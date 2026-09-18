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
 * 1. Cloudflare edge header (`cf-connecting-ip`):
 *    Authoritative when traffic is proxied through Cloudflare CDN/WAF.
 * 2. Standard reverse proxy header (`x-real-ip`):
 *    Set by trusted ingress proxies (e.g. Nginx or internal gateways).
 * 3. Forwarded hops (`x-forwarded-for`):
 *    On Vercel edge/serverless runtimes, Vercel reverse proxies sanitize and append
 *    the connecting client IP. The leftmost entry is parsed and MUST pass strict
 *    IPv4 or IPv6 validation. Any spoofed, malformed, or injected strings are rejected.
 * 4. Fallback:
 *    Returns '127.0.0.1' for development/test, or 'unknown' for production when
 *    no trusted, valid IP can be extracted. Never logs or uses raw unvalidated strings.
 */
export function getClientIp(req: NextRequest): string {
  const headers = req.headers;

  // 1. Cloudflare edge proxy header
  const cfIp = headers.get('cf-connecting-ip')?.trim();
  if (cfIp && isValidIp(cfIp)) {
    return cfIp;
  }

  // 2. Trusted reverse proxy x-real-ip
  const realIp = headers.get('x-real-ip')?.trim();
  if (realIp && isValidIp(realIp)) {
    return realIp;
  }

  // 3. x-forwarded-for (parse leftmost hop only with strict validation)
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    const leftmost = forwarded.split(',')[0]?.trim();
    if (leftmost && isValidIp(leftmost)) {
      return leftmost;
    }
  }

  // 4. Fallback: conservative key for rate limiter / logging
  return process.env.NODE_ENV === 'production' ? 'unknown' : '127.0.0.1';
}
