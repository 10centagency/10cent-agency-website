import type { NextRequest } from 'next/server';

/**
 * Validates IPv4 address string (standard dotted quad, 0.0.0.0 to 255.255.255.255)
 */
const IPV4_REGEX = /^(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(?:\.(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/;

/**
 * Validates IPv6 address string (including compressed :: notation and IPv4-mapped addresses)
 */
const IPV6_REGEX =
  /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]+|::(ffff(:0{1,4})?:)?((25[0-5]|(2[0-4]|1?[0-9])?[0-9])\.){3}(25[0-5]|(2[0-4]|1?[0-9])?[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1?[0-9])?[0-9])\.){3}(25[0-5]|(2[0-4]|1?[0-9])?[0-9]))$/;

/**
 * Checks whether a candidate string is a strictly valid IPv4 or IPv6 address.
 */
export function isValidIp(candidate: string | null | undefined): boolean {
  if (!candidate || typeof candidate !== 'string') return false;
  const trimmed = candidate.trim();
  if (trimmed.length < 3 || trimmed.length > 45) return false;
  return IPV4_REGEX.test(trimmed) || IPV6_REGEX.test(trimmed);
}

/**
 * Extracts and sanitizes client IP according to a verified deployment proxy trust model:
 *
 * Threat Model & Proxy Spoofing Defense:
 * Directly exposing an origin server or receiving requests that bypass upstream reverse proxies
 * allows malicious clients to inject arbitrary headers (`cf-connecting-ip`, `x-real-ip`,
 * `x-forwarded-for`). To prevent rate-limit bypass and IP spoofing, headers are only trusted
 * when the application is confirmed to run behind the respective proxy infrastructure.
 *
 * Trust Rules:
 * 1. Cloudflare edge header (`cf-connecting-ip`):
 *    Trusted only when Cloudflare proxying is confirmed via `TRUST_CLOUDFLARE_PROXY === 'true'`,
 *    `CF_PAGES === '1'`, or blanket `TRUST_PROXY_HEADERS === 'true'`.
 * 2. Trusted reverse proxy header (`x-real-ip`):
 *    Trusted only when reverse proxying is confirmed via `TRUST_REVERSE_PROXY === 'true'`,
 *    `VERCEL === '1'`, or `TRUST_PROXY_HEADERS === 'true'`.
 * 3. Forwarded hops (`x-forwarded-for`):
 *    Trusted only when running in a verified Vercel environment (`VERCEL === '1'`) or when
 *    explicitly enabled via `TRUST_PROXY_HEADERS === 'true'`. The leftmost hop is extracted.
 * 4. Validation:
 *    Every extracted candidate MUST strictly pass IPv4 or IPv6 format validation. Any
 *    spoofed, malformed, or injected strings are rejected.
 * 5. Fallback:
 *    When no trusted, valid IP can be extracted, returns `'unknown'` in production to prevent
 *    untrusted client input from poisoning rate limits or audit logs, or `'127.0.0.1'` in
 *    development/test.
 */
export function getClientIp(req: NextRequest): string {
  const headers = req.headers;

  const isVercel = process.env.VERCEL === '1';
  const trustAllProxies = process.env.TRUST_PROXY_HEADERS === 'true';

  // 1. Cloudflare edge proxy header (gated by confirmed Cloudflare topology)
  const trustCloudflare =
    trustAllProxies ||
    process.env.TRUST_CLOUDFLARE_PROXY === 'true' ||
    process.env.CF_PAGES === '1';

  if (trustCloudflare) {
    const cfIp = headers.get('cf-connecting-ip')?.trim();
    if (cfIp && isValidIp(cfIp)) {
      return cfIp;
    }
  }

  // 2. Trusted reverse proxy x-real-ip (gated by confirmed reverse proxy topology)
  const trustReverseProxy =
    trustAllProxies ||
    isVercel ||
    process.env.TRUST_REVERSE_PROXY === 'true';

  if (trustReverseProxy) {
    const realIp = headers.get('x-real-ip')?.trim();
    if (realIp && isValidIp(realIp)) {
      return realIp;
    }
  }

  // 3. x-forwarded-for (gated by Vercel runtime or explicit proxy trust)
  const trustForwardedFor = trustAllProxies || isVercel;

  if (trustForwardedFor) {
    const forwarded = headers.get('x-forwarded-for');
    if (forwarded) {
      const leftmost = forwarded.split(',')[0]?.trim();
      if (leftmost && isValidIp(leftmost)) {
        return leftmost;
      }
    }
  }

  // 4. Fallback: conservative key for rate limiter / logging
  return process.env.NODE_ENV === 'production' ? 'unknown' : '127.0.0.1';
}
