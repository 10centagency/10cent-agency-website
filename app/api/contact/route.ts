import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { checkRateLimit } from '@/lib/rate-limit';

const ALLOWED_SERVICES = [
  'Facebook & Meta Marketing',
  'Google Ads',
  'Website Development',
  'AI Automation & Chatbot',
  'Social Media Management',
  'SEO, AEO & GEO',
  'Graphic Design',
  'Multiple Services',
  'Not Sure Yet',
  'Other',
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+0-9\s\-().]{6,30}$/;

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting by client IP
    const forwardedFor = req.headers.get('x-forwarded-for');
    const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : req.headers.get('x-real-ip') || '127.0.0.1';

    const rateLimit = await checkRateLimit(clientIp, 5, 600); // 5 submissions per 10 mins
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many submissions from this network. Please wait a few minutes before trying again.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimit.resetTime - Date.now()) / 1000)),
          },
        }
      );
    }

    // 2. Parse Body
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    // 3. Honeypot check (hidden input for bot detection)
    if (body.hp_field && String(body.hp_field).trim().length > 0) {
      // Return 200 without saving so bots don't learn
      return NextResponse.json({ success: true, message: 'Message submitted successfully' });
    }

    // 4. Cloudflare Turnstile Verification
    const turnstileToken = body.turnstileToken;
    const turnstileSecret = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
    const isTestOrBypass =
      process.env.TURNSTILE_BYPASS === 'true' ||
      (process.env.NODE_ENV === 'test' && !turnstileSecret);

    if (!isTestOrBypass) {
      if (!turnstileToken) {
        return NextResponse.json(
          { error: 'Security verification (Turnstile) is required.' },
          { status: 400 }
        );
      }

      if (!turnstileSecret) {
        console.error('[Contact API] CLOUDFLARE_TURNSTILE_SECRET_KEY is missing in production environment');
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
          return NextResponse.json(
            { error: 'Security verification failed. Please refresh and try again.' },
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

    // 5. Strict Schema Validation & Sanitization
    const fullName = String(body.fullName || body.full_name || '').trim();
    const businessName = String(body.businessName || body.business_name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const whatsapp = String(body.whatsapp || body.phone || '').trim();
    const service = String(body.service || body.service_interested || '').trim();
    const budget = body.budget || body.budget_range ? String(body.budget || body.budget_range).trim() : null;
    const message = String(body.message || '').trim();

    if (!fullName || fullName.length > 100) {
      return NextResponse.json({ error: 'Full name is required (max 100 characters).' }, { status: 400 });
    }

    if (!businessName || businessName.length > 100) {
      return NextResponse.json({ error: 'Business name is required (max 100 characters).' }, { status: 400 });
    }

    if (!email || email.length > 254 || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
    }

    if (!whatsapp || whatsapp.length > 30 || !PHONE_REGEX.test(whatsapp)) {
      return NextResponse.json({ error: 'A valid phone/WhatsApp number is required.' }, { status: 400 });
    }

    if (!service || !ALLOWED_SERVICES.includes(service)) {
      return NextResponse.json(
        { error: `Service must be one of: ${ALLOWED_SERVICES.join(', ')}` },
        { status: 400 }
      );
    }

    if (budget && budget.length > 50) {
      return NextResponse.json({ error: 'Budget text is too long (max 50 characters).' }, { status: 400 });
    }

    if (!message || message.length < 5 || message.length > 5000) {
      return NextResponse.json(
        { error: 'Message is required and must be between 5 and 5,000 characters.' },
        { status: 400 }
      );
    }

    // 6. Secure Database Insertion via service-role client
    const admin = getSupabaseAdmin();
    const { error: insertError } = await admin
      .from('contact_submissions')
      .insert({
        full_name: fullName,
        business_name: businessName,
        email,
        whatsapp,
        service_interested: service,
        budget_range: budget || 'Not specified',
        message,
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
