import { NextRequest, NextResponse } from 'next/server';
import { sendToCAPI } from '@/lib/capi';

// Allowed event names based on codebase tracking callers
const ALLOWED_EVENTS = new Set(['PageView', 'Lead', 'Contact', 'Purchase']);

// In-memory rate limiting map: IP -> { count, windowStart }
// Rate limit: best-effort on serverless (per-instance) — acceptable for now, no new dependencies.
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 20;
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();

  // Periodic cleanup of stale entries if map gets large
  if (rateLimitMap.size > 500) {
    rateLimitMap.forEach((record, key) => {
      if (now - record.windowStart > RATE_LIMIT_WINDOW_MS) {
        rateLimitMap.delete(key);
      }
    });
  }

  const record = rateLimitMap.get(ip);

  if (!record || now - record.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return true;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  record.count += 1;
  return true;
}

function isValidOrigin(originOrReferer: string | null): boolean {
  if (!originOrReferer) return false;
  try {
    const url = new URL(originOrReferer);
    const origin = url.origin;

    // Production domains
    if (origin === 'https://www.10centagency.com' || origin === 'https://10centagency.com') {
      return true;
    }

    // Local development domains (localhost / 127.0.0.1 on any port)
    if (/^http:\/\/localhost(:\d+)?$/.test(origin) || /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

function hasAllowedOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');

  // Must carry Origin OR Referer
  if (!origin && !referer) {
    return false;
  }

  if (origin && isValidOrigin(origin)) {
    return true;
  }

  if (referer && isValidOrigin(referer)) {
    return true;
  }

  return false;
}

function isValidSourceUrl(urlStr: string): boolean {
  try {
    const parsed = new URL(urlStr);
    return isValidOrigin(parsed.origin);
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  // 1. Same-origin check: Origin OR Referer matching allowed origin
  if (!hasAllowedOrigin(req)) {
    console.warn('[Track API] Rejected: missing or disallowed Origin/Referer header');
    return NextResponse.json({ error: 'Bad request' }, { status: 403 });
  }

  // 4. Rate limiting check (per IP, in-memory)
  const ipAddress =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1';

  if (!checkRateLimit(ipAddress)) {
    console.warn('[Track API] Rejected: rate limit exceeded (20 req/min)');
    return NextResponse.json({ error: 'Bad request' }, { status: 429 });
  }

  try {
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      console.warn('[Track API] Rejected: invalid JSON body');
      return NextResponse.json({ error: 'Bad request' }, { status: 400 });
    }

    if (!body || typeof body !== 'object') {
      console.warn('[Track API] Rejected: body is not an object');
      return NextResponse.json({ error: 'Bad request' }, { status: 400 });
    }

    const { eventName, eventId, eventSourceUrl, fbc, fbp } = body;

    // 2. Event allowlist check
    if (typeof eventName !== 'string' || eventName.length > 50 || !ALLOWED_EVENTS.has(eventName)) {
      console.warn(`[Track API] Rejected: invalid or disallowed eventName "${String(eventName)}"`);
      return NextResponse.json({ error: 'Bad request' }, { status: 400 });
    }

    // 3. Input validation
    if (typeof eventId !== 'string' || !eventId.trim() || eventId.length > 100) {
      console.warn('[Track API] Rejected: invalid or missing eventId');
      return NextResponse.json({ error: 'Bad request' }, { status: 400 });
    }

    if (eventSourceUrl !== undefined && eventSourceUrl !== null && eventSourceUrl !== '') {
      if (
        typeof eventSourceUrl !== 'string' ||
        eventSourceUrl.length > 2000 ||
        !isValidSourceUrl(eventSourceUrl)
      ) {
        console.warn('[Track API] Rejected: invalid eventSourceUrl');
        return NextResponse.json({ error: 'Bad request' }, { status: 400 });
      }
    }

    if (fbc !== undefined && fbc !== null && fbc !== '') {
      if (typeof fbc !== 'string' || fbc.length > 150) {
        console.warn('[Track API] Rejected: invalid fbc format');
        return NextResponse.json({ error: 'Bad request' }, { status: 400 });
      }
    }

    if (fbp !== undefined && fbp !== null && fbp !== '') {
      if (typeof fbp !== 'string' || fbp.length > 150) {
        console.warn('[Track API] Rejected: invalid fbp format');
        return NextResponse.json({ error: 'Bad request' }, { status: 400 });
      }
    }

    const userAgent = req.headers.get('user-agent') || undefined;

    await sendToCAPI({
      eventName,
      eventId: eventId.trim(),
      eventSourceUrl: (typeof eventSourceUrl === 'string' ? eventSourceUrl : '') || 'https://www.10centagency.com',
      userAgent,
      ipAddress: ipAddress !== '127.0.0.1' ? ipAddress : undefined,
      fbc: typeof fbc === 'string' ? fbc : undefined,
      fbp: typeof fbp === 'string' ? fbp : undefined,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Track API] Internal processing error:', err);
    return NextResponse.json({ error: 'Bad request' }, { status: 500 });
  }
}
