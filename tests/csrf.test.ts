import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { verifySameOrigin, isOriginAllowed, getAllowedOrigins } from '@/lib/csrf';

describe('CSRF & Same-Origin Protection (lib/csrf.ts)', () => {
  it('allows canonical 10cent agency domains', () => {
    expect(isOriginAllowed('https://www.10centagency.com')).toBe(true);
    expect(isOriginAllowed('https://10centagency.com')).toBe(true);
  });

  it('allows trusted Vercel preview domains for 10cent agency', () => {
    expect(isOriginAllowed('https://10cent-agency-website-git-feat-10centagencys-projects.vercel.app')).toBe(true);
    expect(isOriginAllowed('https://10cent-agency-website-preview-10centagency.vercel.app')).toBe(true);
    expect(isOriginAllowed('https://10cent-agency-website.vercel.app')).toBe(true);
  });

  it('allows localhost origins in test/development environment', () => {
    expect(isOriginAllowed('http://localhost:3000')).toBe(true);
    expect(isOriginAllowed('http://127.0.0.1:3000')).toBe(true);
  });

  it('rejects attacker/foreign origins', () => {
    expect(isOriginAllowed('https://evil.com')).toBe(false);
    expect(isOriginAllowed('https://attacker-10centagency.com')).toBe(false);
    expect(isOriginAllowed('https://fake-vercel.app')).toBe(false);
    expect(isOriginAllowed('http://www.10centagency.com')).toBe(false); // Insecure HTTP
    expect(isOriginAllowed('')).toBe(false);
  });

  it('verifySameOrigin allows requests with matching Origin header', () => {
    const req = new NextRequest('https://www.10centagency.com/api/admin/blog', {
      method: 'POST',
      headers: {
        origin: 'https://www.10centagency.com',
      },
    });
    const result = verifySameOrigin(req);
    expect(result.allowed).toBe(true);
    expect(result.response).toBeUndefined();
  });

  it('verifySameOrigin rejects foreign Origin with 403 Forbidden', () => {
    const req = new NextRequest('https://www.10centagency.com/api/admin/blog', {
      method: 'POST',
      headers: {
        origin: 'https://evil-site.com',
      },
    });
    const result = verifySameOrigin(req);
    expect(result.allowed).toBe(false);
    expect(result.response).toBeDefined();
    expect(result.response!.status).toBe(403);
  });

  it('verifySameOrigin falls back to Referer when Origin is absent', () => {
    const req = new NextRequest('https://www.10centagency.com/api/contact', {
      method: 'POST',
      headers: {
        referer: 'https://www.10centagency.com/contact',
      },
    });
    const result = verifySameOrigin(req);
    expect(result.allowed).toBe(true);
  });

  it('verifySameOrigin rejects request with both Origin and Referer absent', () => {
    const req = new NextRequest('https://www.10centagency.com/api/admin/categories', {
      method: 'POST',
    });
    const result = verifySameOrigin(req);
    expect(result.allowed).toBe(false);
    expect(result.response!.status).toBe(403);
  });
});
