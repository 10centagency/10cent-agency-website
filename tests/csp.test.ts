import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { middleware } from '@/middleware';

describe('Content Security Policy (CSP) & Nonce Generation', () => {
  it('generates a unique base64 nonce per request and attaches it to headers', async () => {
    const req1 = new NextRequest('https://www.10centagency.com/');
    const res1 = await middleware(req1);

    const nonce1 = res1.headers.get('x-nonce');
    const csp1 = res1.headers.get('Content-Security-Policy');

    expect(nonce1).toBeDefined();
    expect(typeof nonce1).toBe('string');
    expect(nonce1!.length).toBeGreaterThan(16);
    // Verify base64 format
    expect(/^[A-Za-z0-9+/=]+$/.test(nonce1!)).toBe(true);
    expect(csp1).toContain(`'nonce-${nonce1}'`);

    const req2 = new NextRequest('https://www.10centagency.com/');
    const res2 = await middleware(req2);
    const nonce2 = res2.headers.get('x-nonce');

    // Nonces must be unique per request
    expect(nonce1).not.toEqual(nonce2);
  });

  it('eliminates unsafe-eval from CSP policy completely', async () => {
    const req = new NextRequest('https://www.10centagency.com/services');
    const res = await middleware(req);
    const csp = res.headers.get('Content-Security-Policy') || '';

    expect(csp).not.toContain("'unsafe-eval'");
  });

  it('eliminates unsafe-inline from script-src directive', async () => {
    const req = new NextRequest('https://www.10centagency.com/');
    const res = await middleware(req);
    const csp = res.headers.get('Content-Security-Policy') || '';

    // Extract script-src directive
    const match = csp.match(/script-src\s+([^;]+)/);
    expect(match).not.toBeNull();
    const scriptSrc = match![1];

    expect(scriptSrc).not.toContain("'unsafe-inline'");
    expect(scriptSrc).toContain("'strict-dynamic'");
    expect(scriptSrc).toContain('https://challenges.cloudflare.com');
    expect(scriptSrc).toContain('https://www.googletagmanager.com');
  });

  it('retains style-src unsafe-inline for dynamic framer-motion / runtime element styles', async () => {
    const req = new NextRequest('https://www.10centagency.com/');
    const res = await middleware(req);
    const csp = res.headers.get('Content-Security-Policy') || '';

    const match = csp.match(/style-src\s+([^;]+)/);
    expect(match).not.toBeNull();
    const styleSrc = match![1];

    expect(styleSrc).toContain("'self'");
    expect(styleSrc).toContain("'unsafe-inline'");
  });

  it('enforces essential protective boundaries (object-src, frame-src, base-uri, etc.)', async () => {
    const req = new NextRequest('https://www.10centagency.com/');
    const res = await middleware(req);
    const csp = res.headers.get('Content-Security-Policy') || '';

    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).toContain("frame-ancestors 'self'");
    expect(csp).toContain("upgrade-insecure-requests");
    expect(csp).toContain("https://challenges.cloudflare.com");
    expect(csp).toContain("https://calendly.com");
  });
});
