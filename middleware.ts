import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export function buildCspHeader(nonce: string, isDev: boolean): string {
  if (isDev) {
    // Development policy: allows Webpack eval/Fast Refresh (HMR) and omits upgrade-insecure-requests for local HTTP
    return `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net https://challenges.cloudflare.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data: https://*.supabase.co https://www.googletagmanager.com https://*.facebook.com https://*.fbcdn.net https://assets.calendly.com https://*.unsplash.com https://*.cloudinary.com;
      font-src 'self' data:;
      connect-src 'self' http://localhost:* ws://localhost:* https://*.supabase.co wss://*.supabase.co https://*.facebook.com https://*.google-analytics.com https://*.googletagmanager.com https://challenges.cloudflare.com;
      frame-src 'self' https://calendly.com https://challenges.cloudflare.com https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com https://www.google.com https://maps.google.com https://www.googletagmanager.com;
      frame-ancestors 'self';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
    `
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  // Strict Production CSP: strict-dynamic with cryptographic nonce, no unsafe-inline script, no unsafe-eval
  return `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://www.googletagmanager.com https://connect.facebook.net https://challenges.cloudflare.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://*.supabase.co https://www.googletagmanager.com https://*.facebook.com https://*.fbcdn.net https://assets.calendly.com https://*.unsplash.com https://*.cloudinary.com;
    font-src 'self' data:;
    connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.facebook.com https://*.google-analytics.com https://*.googletagmanager.com https://challenges.cloudflare.com;
    frame-src 'self' https://calendly.com https://challenges.cloudflare.com https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com https://www.google.com https://maps.google.com https://www.googletagmanager.com;
    frame-ancestors 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export async function middleware(req: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const pathname = req.nextUrl.pathname;
  const isDev = process.env.NODE_ENV === 'development';

  const cspHeader = buildCspHeader(nonce, isDev);

  // 1. Prepare forwarded request headers for Next.js App Router (layout reading headers())
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', cspHeader);

  // 2. Initialize the single canonical response object
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Attach CSP and security headers to response
  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('x-nonce', nonce);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // 3. Admin authentication & database role check (for /admin paths)
  if (pathname.startsWith('/admin')) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('[Admin Middleware] Missing Supabase configuration');
      return NextResponse.redirect(new URL('/auth', req.url));
    }

    // Bind cookie mutations directly to the active response to preserve session refreshes
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    });

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      const redirectResponse = NextResponse.redirect(new URL('/auth', req.url));
      // Copy any cookies set by Supabase to redirect response
      response.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie);
      });
      return redirectResponse;
    }

    // Verify database-backed admin membership using server credentials
    let isDbAdmin = false;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (serviceRoleKey && supabaseUrl) {
      try {
        const checkRes = await fetch(
          `${supabaseUrl}/rest/v1/admin_users?user_id=eq.${encodeURIComponent(user.id)}&select=user_id`,
          {
            headers: {
              apikey: serviceRoleKey,
              Authorization: `Bearer ${serviceRoleKey}`,
            },
            cache: 'no-store',
          }
        );
        if (checkRes.ok) {
          const records = await checkRes.json();
          if (Array.isArray(records) && records.length > 0) {
            isDbAdmin = true;
          }
        }
      } catch (err) {
        console.error('[Admin Middleware] Admin database verification error:', err);
      }
    } else {
      console.error('[Admin Middleware] SUPABASE_SERVICE_ROLE_KEY is not configured');
    }

    if (!isDbAdmin) {
      try {
        await supabase.auth.signOut();
      } catch {
        // ignore
      }
      const redirectResponse = NextResponse.redirect(new URL('/', req.url));
      response.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie);
      });
      return redirectResponse;
    }

    // Authorized admin: returns the active response with refreshed cookies preserved!
    return response;
  }

  return response;
}

export const config = {
  matcher: [
    {
      source:
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|bmp|tiff)$).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
