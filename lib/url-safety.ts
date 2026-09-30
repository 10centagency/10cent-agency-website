/**
 * Pure isomorphic URL safety utilities.
 * Usable safely on both browser (client components) and Node.js (server).
 * Does not depend on sanitize-html or any server-only modules.
 */

export const TRUSTED_FRAME_ORIGINS = [
  'https://www.youtube.com',
  'https://youtube.com',
  'https://www.youtube-nocookie.com',
  'https://youtube-nocookie.com',
  'https://player.vimeo.com',
  'https://calendly.com',
  'https://www.google.com',
  'https://google.com',
  'https://maps.google.com',
  'https://challenges.cloudflare.com',
  'https://www.googletagmanager.com',
] as const;

export const TRUSTED_FRAME_HOSTS = [
  'www.youtube.com',
  'youtube.com',
  'www.youtube-nocookie.com',
  'youtube-nocookie.com',
  'player.vimeo.com',
  'calendly.com',
  'www.google.com',
  'google.com',
  'maps.google.com',
  'challenges.cloudflare.com',
  'www.googletagmanager.com',
] as const;

/**
 * Checks whether a URL is a dangerous scheme or contains bypasses.
 * Rejects javascript:, vbscript:, data:, file:, blob:, protocol-relative //, and encoded variants.
 */
function containsDangerousProtocol(raw: string): boolean {
  // Strip control characters, whitespace, and tabs before scanning
  const sanitized = raw.replace(/[\u0000-\u001F\u007F-\u009F\s]/g, '').toLowerCase();

  // Check for dangerous protocol prefixes or backslash protocol-relative bypasses
  if (
    sanitized.startsWith('javascript:') ||
    sanitized.startsWith('vbscript:') ||
    sanitized.startsWith('data:') ||
    sanitized.startsWith('file:') ||
    sanitized.startsWith('blob:') ||
    sanitized.startsWith('//') ||
    sanitized.startsWith('/\\') ||
    sanitized.startsWith('\\\\')
  ) {
    return true;
  }

  // Check for URL-encoded variants (e.g. %6a%61%76%61%73%63%72%69%70%74)
  try {
    const decoded = decodeURIComponent(raw).replace(/[\u0000-\u001F\u007F-\u009F\s]/g, '').toLowerCase();
    if (
      decoded.startsWith('javascript:') ||
      decoded.startsWith('vbscript:') ||
      decoded.startsWith('data:') ||
      decoded.startsWith('file:') ||
      decoded.startsWith('blob:') ||
      decoded.startsWith('//')
    ) {
      return true;
    }
  } catch {
    // Malformed URI encoding is rejected
    return true;
  }

  return false;
}

/**
 * Validates a navigation URL (for <a href="...">, buttons, links).
 * Permits:
 *  - Safe same-site relative URLs (starting with '/', but not '//' or '/\')
 *  - Anchor hash links ('#')
 *  - Valid 'https:' and 'mailto:' / 'tel:' URLs
 */
export function isSafeNavigationUrl(rawUrl: string | null | undefined): boolean {
  if (!rawUrl || typeof rawUrl !== 'string') return false;
  const trimmed = rawUrl.trim();
  if (!trimmed) return false;

  if (containsDangerousProtocol(trimmed)) {
    return false;
  }

  // Safe same-site relative link (e.g. "/services", "/blog/post-1", "#contact")
  if (trimmed === '#' || (trimmed.startsWith('/') && !trimmed.startsWith('//') && !trimmed.startsWith('/\\'))) {
    return true;
  }

  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' || parsed.protocol === 'mailto:' || parsed.protocol === 'tel:';
  } catch {
    return false;
  }
}

/**
 * Validates a media URL (for <img src="...">, video posters, background images).
 * Enforces consistency with CSP img-src directives.
 * Permits:
 *  - Safe same-site relative paths (e.g. '/Logo.webp', '/favicon.ico')
 *  - Trusted HTTPS origins (e.g., Supabase project storage, GTM, Meta/FB)
 */
export function isSafeMediaUrl(rawUrl: string | null | undefined): boolean {
  if (!rawUrl || typeof rawUrl !== 'string') return false;
  const trimmed = rawUrl.trim();
  if (!trimmed) return false;

  if (containsDangerousProtocol(trimmed)) {
    return false;
  }

  // Safe same-site relative media
  if (trimmed.startsWith('/') && !trimmed.startsWith('//') && !trimmed.startsWith('/\\')) {
    return true;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:') return false;

    const host = parsed.hostname.toLowerCase();
    // Allow Supabase storage, official domains, and trusted platforms
    if (
      host.endsWith('.supabase.co') ||
      host === 'www.10centagency.com' ||
      host === '10centagency.com' ||
      host.endsWith('.vercel.app') ||
      host === 'www.googletagmanager.com' ||
      host.endsWith('.facebook.com') ||
      host.endsWith('.fbcdn.net') ||
      host === 'assets.calendly.com' ||
      host.endsWith('.unsplash.com') ||
      host.endsWith('.cloudinary.com')
    ) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Validates an iframe embed URL (YouTube, Vimeo, Google Maps, Calendly, Turnstile).
 * Enforces exact consistency with CSP frame-src.
 */
export function isSafeEmbedUrl(rawUrl: string | null | undefined): boolean {
  if (!rawUrl || typeof rawUrl !== 'string') return false;
  const trimmed = rawUrl.trim();
  if (!trimmed) return false;

  if (containsDangerousProtocol(trimmed)) {
    return false;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:') return false;
    const host = parsed.hostname.toLowerCase();
    return (TRUSTED_FRAME_HOSTS as readonly string[]).includes(host);
  } catch {
    return false;
  }
}

/**
 * Backwards compatibility alias for isSafeEmbedUrl
 */
export const isTrustedEmbedUrl = isSafeEmbedUrl;

/**
 * Returns a safe navigation URL or safeFallback if invalid.
 */
export function sanitizeUrl(rawUrl: string | null | undefined, safeFallback = ''): string {
  if (!rawUrl || typeof rawUrl !== 'string') return safeFallback;
  const trimmed = rawUrl.trim();
  if (isSafeNavigationUrl(trimmed)) {
    return trimmed;
  }
  return safeFallback;
}

/**
 * Sanitizes a URL specifically for CSS `background-image: url(...)` contexts.
 * Prevents CSS syntax breakouts (closing parentheses, quotes, semicolons, curly braces).
 */
export function sanitizeCssBackgroundUrl(rawUrl: string | null | undefined): string | null {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const trimmed = rawUrl.trim();
  if (!isSafeMediaUrl(trimmed)) return null;

  // Prevent CSS expression or quote breakout
  if (/[\(\)\'"\\;\r\n]/.test(trimmed)) {
    return null;
  }

  return trimmed;
}

/**
 * Escapes `<` and `>` in JSON-LD objects to prevent script-tag termination XSS
 * (e.g. `</script><script>alert(1)</script>`)
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e');
}

