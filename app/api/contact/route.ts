import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { checkRateLimit } from '@/lib/rate-limit';
import { verifySameOrigin } from '@/lib/csrf';
import { normalizeContactInput } from '@/lib/admin-schemas';
import { getClientIp } from '@/lib/ip';

/**
 * Maximum allowed JSON payload size (16 KB)
 */
const MAX_PAYLOAD_BYTES = 16384;

export async function POST(req: NextRequest) {
  try {
    // 1. Same-origin CSRF protection
    const csrf = verifySameOrigin(req);
    if (!csrf.allowed) {
      return csrf.response!;
    }

    // 2. Request body size guard before JSON parsing or expensive processing
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > MAX_PAYLOAD_BYTES) {
      return NextResponse.json(
        { ok: false, error: 'Payload too large' },
        { status: 413 }
      );
    }

    // 3. Content-Type verification (JSON only)
    const contentType = req.headers.get('content-type');
    if (!contentType || !contentType.toLowerCase().includes('application/json')) {
      return NextResponse.json(
        { ok: false, error: 'Unsupported Media Type. Content-Type must be application/json.' },
        { status: 415 }
      );
    }

    // 3. Trusted client IP extraction
    const clientIp = getClientIp(req);

    // 4. Rate Limiting by client IP (5 submissions per 10 mins)
    // Executes before Turnstile verification, DB inserts, or email sends
    const ipRateLimit = await checkRateLimit(clientIp, 5, 600);
    if (!ipRateLimit.allowed) {
      const retryAfter = Math.max(1, Math.ceil((ipRateLimit.resetTime - Date.now()) / 1000));
      return NextResponse.json(
        {
          ok: false,
          error: 'Too many submissions from this network. Please wait a few minutes before trying again.',
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
          },
        }
      );
    }

    // 5. Parse JSON Body with body length safety
    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return NextResponse.json(
        { ok: false, error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }

    // 6. Safe Schema Normalization (resolves aliases and rejects conflicting duplicate pairs)
    const normResult = normalizeContactInput(rawBody);
    if (!normResult.success || !normResult.data) {
      return NextResponse.json(
        {
          ok: false,
          error: normResult.error || 'Invalid form submission data',
          fieldErrors: normResult.fieldErrors,
        },
        { status: 400 }
      );
    }

    const body = normResult.data;

    // 7. Honeypot check (reject submission if filled)
    if (body.honeypot && body.honeypot.trim().length > 0) {
      return NextResponse.json(
        { ok: false, error: 'Invalid form submission' },
        { status: 400 }
      );
    }

    // 8. Secondary Rate Limiting by hashed email (prevents distributed IP flood using same email)
    const emailHash = crypto.createHash('sha256').update(body.email).digest('hex').slice(0, 16);
    const emailRateLimit = await checkRateLimit(`email:${emailHash}`, 3, 600);
    if (!emailRateLimit.allowed) {
      const retryAfter = Math.max(1, Math.ceil((emailRateLimit.resetTime - Date.now()) / 1000));
      return NextResponse.json(
        {
          ok: false,
          error: 'Too many submissions for this email address. Please try again later.',
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
          },
        }
      );
    }

    // 9. Cloudflare Turnstile Verification
    const turnstileToken = body.turnstileToken;
    const turnstileSecret =
      process.env.TURNSTILE_SECRET_KEY || process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
    const isProd = process.env.NODE_ENV === 'production';
    const isTestBypass = process.env.TURNSTILE_BYPASS_FOR_TESTS === 'true';

    // In production, bypass flags must never be active and must fail closed
    if (isProd && isTestBypass) {
      console.error('[Contact API] Turnstile test bypass is strictly forbidden in production.');
      return NextResponse.json(
        { ok: false, error: 'Security verification failed. Invalid configuration.' },
        { status: 403 }
      );
    }

    // Bypass is strictly allowed only in non-production environments when explicitly enabled
    // via TURNSTILE_BYPASS_FOR_TESTS or when utilizing the designated test mock token.
    // Missing TURNSTILE_SECRET_KEY never silently bypasses verification.
    const isExplicitTestBypass =
      !isProd && (isTestBypass || turnstileToken === 'test-mock-token');

    if (isExplicitTestBypass) {
      // Allowed in automated test execution
    } else {
      if (!turnstileToken) {
        return NextResponse.json(
          { ok: false, error: 'Security verification (Turnstile) is required.' },
          { status: 400 }
        );
      }

      if (!turnstileSecret) {
        console.error('[Contact API] TURNSTILE_SECRET_KEY is missing in server environment');
        return NextResponse.json(
          { ok: false, error: 'Server security configuration error. Please contact support.' },
          { status: 500 }
        );
      }

      const verifyFormData = new URLSearchParams();
      verifyFormData.append('secret', turnstileSecret);
      verifyFormData.append('response', turnstileToken);
      if (clientIp && clientIp !== 'unknown') {
        verifyFormData.append('remoteip', clientIp);
      }

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
            { ok: false, error: 'Security verification failed. Please refresh and try again.' },
            { status: 403 }
          );
        }

        // Hostname validation
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
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
        const isValidHostname = isProd
          ? responseHostname &&
            (allowedHostnames.includes(responseHostname) || responseHostname.endsWith('.vercel.app'))
          : !responseHostname ||
            allowedHostnames.includes(responseHostname) ||
            responseHostname.endsWith('.vercel.app');

        if (!isValidHostname) {
          console.error('[Contact API] Turnstile hostname mismatch:', responseHostname);
          return NextResponse.json(
            { ok: false, error: 'Security verification failed: Hostname mismatch.' },
            { status: 403 }
          );
        }

        // Action validation: if action was passed, verify against allowed form actions
        const allowedActions = ['contact_form', 'cta_form', 'contact'];
        if (turnstileData.action && !allowedActions.includes(turnstileData.action)) {
          console.error('[Contact API] Turnstile action mismatch:', turnstileData.action);
          return NextResponse.json(
            { ok: false, error: 'Security verification failed: Action mismatch.' },
            { status: 403 }
          );
        }
      } catch (err) {
        console.error('[Contact API] Turnstile verify error:', err);
        return NextResponse.json(
          { ok: false, error: 'Failed to verify security challenge' },
          { status: 500 }
        );
      }
    }

    // 10. Secure Database Insertion via service-role client
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
        { ok: false, error: 'Failed to record your submission. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { ok: true, success: true, message: 'Thank you! Your message has been received.' },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('[Contact API] Unexpected error:', err);
    return NextResponse.json(
      { ok: false, error: 'An unexpected server error occurred.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { ok: false, error: 'Method Not Allowed' },
    { status: 405, headers: { Allow: 'POST' } }
  );
}

export async function PUT() {
  return NextResponse.json(
    { ok: false, error: 'Method Not Allowed' },
    { status: 405, headers: { Allow: 'POST' } }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { ok: false, error: 'Method Not Allowed' },
    { status: 405, headers: { Allow: 'POST' } }
  );
}
