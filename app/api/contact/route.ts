import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { checkRateLimit } from '@/lib/rate-limit';
import { verifySameOrigin } from '@/lib/csrf';
import { contactSubmissionSchema } from '@/lib/admin-schemas';

export async function POST(req: NextRequest) {
  try {
    // 1. Same-origin CSRF protection
    const csrf = verifySameOrigin(req);
    if (!csrf.allowed) {
      return csrf.response!;
    }

    // 2. Bound raw request body size before parsing (max 64KB)
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > 65536) {
      return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
    }

    // 3. Trusted client IP extraction
    // Prefer x-real-ip or cf-connecting-ip over caller-spoofable x-forwarded-for
    const clientIp =
      req.headers.get('x-real-ip') ||
      req.headers.get('cf-connecting-ip') ||
      (req.headers.get('x-forwarded-for')?.split(',')[0].trim()) ||
      '127.0.0.1';

    // 4. Atomic Rate Limiting by client IP (5 submissions per 10 mins)
    const rateLimit = await checkRateLimit(clientIp, 5, 600);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many submissions from this network. Please wait a few minutes before trying again.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.max(1, Math.ceil((rateLimit.resetTime - Date.now()) / 1000))),
          },
        }
      );
    }

    // 5. Parse JSON Body
    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    // 6. Strict Schema Validation
    const parseResult = contactSubmissionSchema.safeParse(rawBody);
    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0]?.message || 'Invalid form submission data';
      return NextResponse.json({ error: firstIssue }, { status: 400 });
    }

    const body = parseResult.data;

    // 7. Honeypot check (hidden input for bot detection)
    if (body.hp_field && body.hp_field.trim().length > 0) {
      // Return 200 without saving so bots don't learn
      return NextResponse.json({ success: true, message: 'Message submitted successfully' });
    }

    // 8. Cloudflare Turnstile Verification
    const turnstileToken = body.turnstileToken;
    const turnstileSecret = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
    const isTest = process.env.NODE_ENV === 'test';

    // In production and Preview, TURNSTILE_BYPASS=true must fail closed/reject submissions
    if (process.env.TURNSTILE_BYPASS === 'true' && !isTest) {
      console.error('[Contact API] TURNSTILE_BYPASS is not permitted in production or preview environments.');
      return NextResponse.json(
        { error: 'Security verification failed. Invalid bypass configuration.' },
        { status: 403 }
      );
    }

    if (isTest && (turnstileToken === 'test-mock-token' || !turnstileSecret)) {
      // Allowed only in automated test execution
    } else {
      if (!turnstileToken) {
        return NextResponse.json(
          { error: 'Security verification (Turnstile) is required.' },
          { status: 400 }
        );
      }

      if (!turnstileSecret) {
        console.error('[Contact API] CLOUDFLARE_TURNSTILE_SECRET_KEY is missing in server environment');
        return NextResponse.json(
          { error: 'Server security configuration error. Please contact support.' },
          { status: 500 }
        );
      }

      const verifyFormData = new URLSearchParams();
      verifyFormData.append('secret', turnstileSecret);
      verifyFormData.append('response', turnstileToken);
      verifyFormData.append('remoteip', clientIp);

      try {
        const turnstileRes = await fetch(
          'https://challenges.cloudflare.com/turnstile/v0/siteverify',
          {
            method: 'POST',
            body: verifyFormData,
          }
        );
        const turnstileData = await turnstileRes.json();

        if (!turnstileData.success) {
          console.warn('[Contact API] Turnstile challenge failed:', turnstileData['error-codes']);
          return NextResponse.json(
            { error: 'Security verification failed. Please refresh and try again.' },
            { status: 400 }
          );
        }

        // Hostname validation
        const siteUrl = process.env.SITE_URL;
        const vercelUrl = process.env.VERCEL_URL;
        const allowedHostnames = [
          'www.10centagency.com',
          '10centagency.com',
          'localhost',
          '127.0.0.1',
        ];
        if (siteUrl) {
          try {
            allowedHostnames.push(new URL(siteUrl).hostname.toLowerCase());
          } catch {}
        }
        if (vercelUrl) {
          try {
            const vHost = vercelUrl.replace(/^https?:\/\//, '').split('/')[0].toLowerCase();
            allowedHostnames.push(vHost);
          } catch {}
        }

        const responseHostname = turnstileData.hostname ? turnstileData.hostname.toLowerCase() : '';
        const isValidHostname =
          !responseHostname ||
          allowedHostnames.includes(responseHostname) ||
          responseHostname.endsWith('.vercel.app');

        if (!isValidHostname) {
          console.error('[Contact API] Turnstile hostname mismatch:', responseHostname);
          return NextResponse.json(
            { error: 'Security verification failed: Hostname mismatch.' },
            { status: 400 }
          );
        }
      } catch (err) {
        console.error('[Contact API] Turnstile verify error:', err);
        return NextResponse.json(
          { error: 'Failed to verify security challenge' },
          { status: 500 }
        );
      }
    }

    // 9. Secure Database Insertion via service-role client
    const admin = getSupabaseAdmin();
    const { error: insertError } = await admin
      .from('contact_submissions')
      .insert({
        full_name: body.fullName,
        business_name: body.businessName,
        email: body.email,
        whatsapp: body.whatsapp,
        service_interested: body.service,
        budget_range: body.budget || 'Not specified',
        message: body.message,
        status: 'unread',
      } as any);

    if (insertError) {
      console.error('[Contact API] Insertion error:', insertError);
      return NextResponse.json(
        { error: 'Failed to record your submission. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Thank you! Your message has been received.' },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('[Contact API] Unexpected error:', err);
    return NextResponse.json({ error: 'An unexpected server error occurred.' }, { status: 500 });
  }
}
