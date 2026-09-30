import { describe, it, expect } from 'vitest';
import {
  isSafeNavigationUrl,
  isSafeMediaUrl,
  isSafeEmbedUrl,
  sanitizeUrl,
  sanitizeCssBackgroundUrl,
  safeJsonLd,
} from '@/lib/url-safety';

describe('URL Safety & Injection Prevention (lib/url-safety.ts)', () => {
  describe('isSafeNavigationUrl', () => {
    it('allows valid same-site relative paths', () => {
      expect(isSafeNavigationUrl('/')).toBe(true);
      expect(isSafeNavigationUrl('/blog')).toBe(true);
      expect(isSafeNavigationUrl('/services/website-development')).toBe(true);
      expect(isSafeNavigationUrl('/contact?source=footer')).toBe(true);
    });

    it('allows secure HTTPS URLs', () => {
      expect(isSafeNavigationUrl('https://www.10centagency.com')).toBe(true);
      expect(isSafeNavigationUrl('https://example.com/page')).toBe(true);
      expect(isSafeNavigationUrl('https://maps.google.com/?q=dubai')).toBe(true);
    });

    it('allows safe mailto and tel URIs', () => {
      expect(isSafeNavigationUrl('mailto:hello@10centagency.com')).toBe(true);
      expect(isSafeNavigationUrl('tel:+971501234567')).toBe(true);
    });

    it('rejects javascript: and vbscript: URIs', () => {
      expect(isSafeNavigationUrl('javascript:alert(1)')).toBe(false);
      expect(isSafeNavigationUrl('javascript:/*--></title></style></textarea>*/<script>alert(1)</script>')).toBe(false);
      expect(isSafeNavigationUrl('JAVASCRIPT:alert(1)')).toBe(false);
      expect(isSafeNavigationUrl('java\0script:alert(1)')).toBe(false);
      expect(isSafeNavigationUrl('javascript :alert(1)')).toBe(false);
      expect(isSafeNavigationUrl('vbscript:msgbox("xss")')).toBe(false);
    });

    it('rejects data:, file:, and blob: schemes', () => {
      expect(isSafeNavigationUrl('data:text/html,<script>alert(1)</script>')).toBe(false);
      expect(isSafeNavigationUrl('data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==')).toBe(false);
      expect(isSafeNavigationUrl('file:///etc/passwd')).toBe(false);
      expect(isSafeNavigationUrl('blob:https://10centagency.com/uuid')).toBe(false);
    });

    it('rejects protocol-relative and backslash bypasses', () => {
      expect(isSafeNavigationUrl('//evil.com/payload')).toBe(false);
      expect(isSafeNavigationUrl('/\\evil.com')).toBe(false);
      expect(isSafeNavigationUrl('\\\\evil.com')).toBe(false);
    });

    it('rejects URL-encoded protocol variants', () => {
      expect(isSafeNavigationUrl('%6a%61%76%61%73%63%72%69%70%74:alert(1)')).toBe(false);
      expect(isSafeNavigationUrl('%6A%61%76%61%73%63%72%69%70%74:alert(1)')).toBe(false);
      expect(isSafeNavigationUrl('%64%61%74%61:text/html,test')).toBe(false);
    });
  });

  describe('isSafeMediaUrl', () => {
    it('allows same-site relative media paths', () => {
      expect(isSafeMediaUrl('/images/hero.webp')).toBe(true);
      expect(isSafeMediaUrl('/logo.png')).toBe(true);
    });

    it('allows Supabase storage and trusted media CDN domains', () => {
      expect(isSafeMediaUrl('https://myproject.supabase.co/storage/v1/object/public/blog-featured/img.jpg')).toBe(true);
      expect(isSafeMediaUrl('https://images.unsplash.com/photo-123')).toBe(true);
      expect(isSafeMediaUrl('https://res.cloudinary.com/demo/image/upload/sample.jpg')).toBe(true);
      expect(isSafeMediaUrl('https://www.10centagency.com/brand/logo.svg')).toBe(true);
    });

    it('rejects untrusted or arbitrary external hosts that CSP would block', () => {
      expect(isSafeMediaUrl('https://random-untrusted-site.com/image.jpg')).toBe(false);
      expect(isSafeMediaUrl('https://attacker.com/malicious.png')).toBe(false);
    });

    it('rejects data URIs and scripts in media URLs', () => {
      expect(isSafeMediaUrl('data:image/svg+xml,<svg onload=alert(1)>')).toBe(false);
      expect(isSafeMediaUrl('javascript:alert("img")')).toBe(false);
    });
  });

  describe('isSafeEmbedUrl', () => {
    it('allows legitimate embed hosts (YouTube, Vimeo, Google Maps, Calendly)', () => {
      expect(isSafeEmbedUrl('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe(true);
      expect(isSafeEmbedUrl('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ')).toBe(true);
      expect(isSafeEmbedUrl('https://player.vimeo.com/video/123456789')).toBe(true);
      expect(isSafeEmbedUrl('https://maps.google.com/maps?q=Dubai')).toBe(true);
      expect(isSafeEmbedUrl('https://calendly.com/10centagency/call')).toBe(true);
    });

    it('rejects untrusted embed domains', () => {
      expect(isSafeEmbedUrl('https://attacker-embed.com/iframe')).toBe(false);
      expect(isSafeEmbedUrl('https://fake-youtube.com/embed')).toBe(false);
      expect(isSafeEmbedUrl('http://www.youtube.com/embed/123')).toBe(false); // Insecure HTTP
    });
  });

  describe('sanitizeCssBackgroundUrl', () => {
    it('allows clean https and relative background images', () => {
      expect(sanitizeCssBackgroundUrl('https://images.unsplash.com/photo-1')).toBe('https://images.unsplash.com/photo-1');
      expect(sanitizeCssBackgroundUrl('/bg-pattern.webp')).toBe('/bg-pattern.webp');
    });

    it('strips javascript: and dangerous content from CSS backgrounds', () => {
      expect(sanitizeCssBackgroundUrl('javascript:alert(1)')).toBeNull();
      expect(sanitizeCssBackgroundUrl('url(javascript:alert(1))')).toBeNull();
      expect(sanitizeCssBackgroundUrl('data:image/svg+xml,...')).toBeNull();
      expect(sanitizeCssBackgroundUrl('//attacker.com/bg.png')).toBeNull();
    });
  });

  describe('sanitizeUrl helper with fallback', () => {
    it('returns original URL if safe, fallback if unsafe', () => {
      expect(sanitizeUrl('https://example.com', '/fallback')).toBe('https://example.com');
      expect(sanitizeUrl('javascript:alert(1)', '/fallback')).toBe('/fallback');
      expect(sanitizeUrl(null, '/fallback')).toBe('/fallback');
      expect(sanitizeUrl('', '/fallback')).toBe('/fallback');
    });
  });

  describe('safeJsonLd serialization', () => {
    it('safely serializes JSON-LD without allowing script tags or HTML breakout', () => {
      const payload = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: '10cent Agency <script>alert("xss")</script>',
        description: '</script><script src="https://evil.com/xss.js"></script>',
      };

      const result = safeJsonLd(payload);
      expect(result).not.toContain('<script');
      expect(result).not.toContain('</script>');
      expect(result).toContain('\\u003cscript\\u003e');
      expect(result).toContain('\\u003c/script\\u003e');
    });
  });
});
