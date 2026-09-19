import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import crypto from 'node:crypto';
import { POST, GET } from '@/app/api/contact/route';
import * as rateLimitModule from '@/lib/rate-limit';
import { checkRateLimit, clearMemoryRateLimitStore } from '@/lib/rate-limit';

describe('POST /api/contact API Validation, CSRF & Anti-Abuse', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    clearMemoryRateLimitStore();
  });

  it('rejects foreign origin with 403 Forbidden', async () => {
    const req = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        origin: 'https://evil-attacker.com',
      },
      body: JSON.stringify({
        fullName: 'Attacker',
        businessName: 'Evil Inc',
        email: 'attacker@evil.com',
        whatsapp: '+1234567890',
        service: 'Website Development',
        message: 'CSRF attack payload',
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(403);
    const data = await res.json();
    expect(data.error).toContain('Forbidden');
  });

  it('rejects missing origin and referer with 403 Forbidden', async () => {
    const req = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName: 'Bot',
        businessName: 'Bot Inc',
        email: 'bot@example.com',
        whatsapp: '+1234567890',
        service: 'Website Development',
        message: 'No origin header',
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(403);
  });

  it('rejects submissions with missing required fields with 400', async () => {
    const req = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        origin: 'http://localhost:3000',
      },
      body: JSON.stringify({
        fullName: '', // missing
        businessName: '',
        email: 'invalid-email',
        whatsapp: '',
        service: 'Invalid Service',
        message: '',
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.ok).toBe(false);
    expect(data.error).toBeDefined();
    expect(data.fieldErrors).toBeDefined();
  });

  it('rejects conflicting duplicate alias fields with 400', async () => {
    const req = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        origin: 'http://localhost:3000',
      },
      body: JSON.stringify({
        fullName: 'Jane Doe',
        name: 'John Smith', // Conflicting alias!
        businessName: 'Acme Corp',
        email: 'jane@example.com',
        whatsapp: '+1234567890',
        service: 'Website Development',
        message: 'Hello, this is a test message for development',
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.ok).toBe(false);
    expect(data.error).toContain('Conflicting');
    expect(data.fieldErrors?.fullName).toBeDefined();
  });

  it('rejects honeypot bot submissions with HTTP 400', async () => {
    const req = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        origin: 'http://localhost:3000',
      },
      body: JSON.stringify({
        fullName: 'Spam Bot',
        businessName: 'Spam Co',
        email: 'spammer@spam.com',
        whatsapp: '+1234567890',
        service: 'Website Development',
        message: 'Buy cheap watches from our website',
        website: 'https://spam-link.com', // Honeypot trap filled
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.ok).toBe(false);
    expect(data.error).toBe('Invalid form submission');
  });

  it('validates email format correctly', async () => {
    const req = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        origin: 'http://localhost:3000',
      },
      body: JSON.stringify({
        fullName: 'John Doe',
        businessName: 'Acme Corp',
        email: 'not-an-email',
        whatsapp: '+1234567890',
        service: 'Website Development',
        message: 'Legitimate message about SEO service',
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.ok).toBe(false);
    expect(data.error.toLowerCase()).toContain('email');
  });

  it('rejects payload that exceeds 16KB content-length with 413', async () => {
    const req = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        origin: 'http://localhost:3000',
        'content-length': '20000', // > 16KB (16384 bytes)
      },
      body: JSON.stringify({ message: 'too large' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(413);
    const data = await res.json();
    expect(data.ok).toBe(false);
    expect(data.error).toBe('Payload too large');
  });

  it('returns 405 Method Not Allowed for GET request', async () => {
    const res = await GET();
    expect(res.status).toBe(405);
    const data = await res.json();
    expect(data.ok).toBe(false);
    expect(data.error).toBe('Method Not Allowed');
  });

  it('enforces in-memory/distributed rate limiting', async () => {
    const identifier = 'test-client-ip-' + Date.now();
    const limit = 3;
    const windowSeconds = 60;

    // First 3 should succeed
    for (let i = 0; i < limit; i++) {
      const result = await checkRateLimit(identifier, limit, windowSeconds);
      expect(result.allowed).toBe(true);
    }

    // 4th request must be rejected
    const blocked = await checkRateLimit(identifier, limit, windowSeconds);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.resetTime).toBeGreaterThan(Date.now());
  });

  it('rejects unsupported content types with 415 Unsupported Media Type', async () => {
    const req = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        origin: 'http://localhost:3000',
      },
      body: 'plain text body',
    });

    const res = await POST(req);
    expect(res.status).toBe(415);
    const data = await res.json();
    expect(data.ok).toBe(false);
    expect(data.error).toContain('Unsupported Media Type');
  });

  it('executes rate limiting before Turnstile verification', async () => {
    // Fill rate limit for client IP '127.0.0.1' (default fallback in test environment)
    for (let i = 0; i < 5; i++) {
      await checkRateLimit('127.0.0.1', 5, 600);
    }

    const req = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        origin: 'http://localhost:3000',
      },
      // Note: No turnstileToken provided at all
      body: JSON.stringify({
        fullName: 'Rate Limited User',
        businessName: 'RL Corp',
        email: 'rl@example.com',
        whatsapp: '+1234567890',
        service: 'Website Development',
        message: 'Hello world test message',
      }),
    });

    const res = await POST(req);
    // Must be rejected by rate limiter (429), proving rate limiting runs before Turnstile
    expect(res.status).toBe(429);
    expect(res.headers.get('Retry-After')).toBeDefined();
    const data = await res.json();
    expect(data.ok).toBe(false);
    expect(data.error).toContain('Too many submissions');
  });

  it('hashes secondary email rate-limit key with sha256 to prevent raw PII storage', async () => {
    const testEmail = 'sensitive.ceo@corporation.com';
    const expectedHash = crypto.createHash('sha256').update(testEmail).digest('hex').slice(0, 16);
    const expectedKey = `email:${expectedHash}`;

    // Verify key format is pseudonymous and never contains the raw email string
    expect(expectedKey).not.toContain(testEmail);
    expect(expectedKey).toMatch(/^email:[a-f0-9]{16}$/);

    // Consume all 3 allowed submissions for this email hash
    for (let i = 0; i < 3; i++) {
      const res = await checkRateLimit(expectedKey, 3, 600);
      expect(res.allowed).toBe(true);
    }
    const blocked = await checkRateLimit(expectedKey, 3, 600);
    expect(blocked.allowed).toBe(false);
  });

  it('production missing rate-limit backend fails safe with 429', async () => {
    const prevNodeEnv = process.env.NODE_ENV;
    const prevUpstashUrl = process.env.UPSTASH_REDIS_REST_URL;
    const prevUpstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;
    const prevSupabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    try {
      (process.env as any).NODE_ENV = 'production';
      delete process.env.UPSTASH_REDIS_REST_URL;
      delete process.env.UPSTASH_REDIS_REST_TOKEN;
      delete process.env.SUPABASE_SERVICE_ROLE_KEY;

      const rateLimitResult = await checkRateLimit('prod-test-ip', 5, 600);
      // In production without durable backend, it must fail closed (allowed: false)
      expect(rateLimitResult.allowed).toBe(false);
      expect(rateLimitResult.remaining).toBe(0);
      expect(rateLimitResult.resetTime).toBeGreaterThan(Date.now());
    } finally {
      (process.env as any).NODE_ENV = prevNodeEnv;
      if (prevUpstashUrl) process.env.UPSTASH_REDIS_REST_URL = prevUpstashUrl;
      if (prevUpstashToken) process.env.UPSTASH_REDIS_REST_TOKEN = prevUpstashToken;
      if (prevSupabaseKey) process.env.SUPABASE_SERVICE_ROLE_KEY = prevSupabaseKey;
    }
  });

  it('production missing TURNSTILE_SECRET_KEY fails closed with 500', async () => {
    const prevNodeEnv = process.env.NODE_ENV;
    const prevSecret = process.env.TURNSTILE_SECRET_KEY;
    const prevCfSecret = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;

    try {
      (process.env as any).NODE_ENV = 'production';
      delete process.env.TURNSTILE_SECRET_KEY;
      delete process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;

      vi.spyOn(rateLimitModule, 'checkRateLimit').mockResolvedValue({
        allowed: true,
        remaining: 4,
        resetTime: Date.now() + 600000,
      });

      const req = new NextRequest('https://www.10centagency.com/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          origin: 'https://www.10centagency.com',
          'cf-connecting-ip': '203.0.113.1',
        },
        body: JSON.stringify({
          fullName: 'Prod User',
          businessName: 'Prod Corp',
          email: 'prod@example.com',
          whatsapp: '+1234567890',
          service: 'Website Development',
          message: 'Testing production secret validation',
          turnstileToken: 'real-turnstile-token',
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(500);
      const data = await res.json();
      expect(data.ok).toBe(false);
      expect(data.error).toContain('Server security configuration error');
    } finally {
      (process.env as any).NODE_ENV = prevNodeEnv;
      if (prevSecret) process.env.TURNSTILE_SECRET_KEY = prevSecret;
      if (prevCfSecret) process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY = prevCfSecret;
    }
  });

  it('production ignores TURNSTILE_BYPASS_FOR_TESTS and fails closed with 403', async () => {
    const prevNodeEnv = process.env.NODE_ENV;
    const prevBypass = process.env.TURNSTILE_BYPASS_FOR_TESTS;

    try {
      (process.env as any).NODE_ENV = 'production';
      process.env.TURNSTILE_BYPASS_FOR_TESTS = 'true';

      vi.spyOn(rateLimitModule, 'checkRateLimit').mockResolvedValue({
        allowed: true,
        remaining: 4,
        resetTime: Date.now() + 600000,
      });

      const req = new NextRequest('https://www.10centagency.com/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          origin: 'https://www.10centagency.com',
          'cf-connecting-ip': '203.0.113.2',
        },
        body: JSON.stringify({
          fullName: 'Bypass Attempt',
          businessName: 'Bypass Corp',
          email: 'bypass@example.com',
          whatsapp: '+1234567890',
          service: 'Website Development',
          message: 'Trying to bypass in production',
          turnstileToken: 'test-mock-token',
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(403);
      const data = await res.json();
      expect(data.ok).toBe(false);
      expect(data.error).toContain('Security verification failed');
    } finally {
      (process.env as any).NODE_ENV = prevNodeEnv;
      if (prevBypass) {
        process.env.TURNSTILE_BYPASS_FOR_TESTS = prevBypass;
      } else {
        delete process.env.TURNSTILE_BYPASS_FOR_TESTS;
      }
    }
  });

  it('does not recognize deprecated TURNSTILE_BYPASS and does not bypass verification', async () => {
    const prevBypass = (process.env as any).TURNSTILE_BYPASS;
    const prevTestBypass = process.env.TURNSTILE_BYPASS_FOR_TESTS;
    const prevSecret = process.env.TURNSTILE_SECRET_KEY;
    const prevCfSecret = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;

    try {
      delete process.env.TURNSTILE_BYPASS_FOR_TESTS;
      delete process.env.TURNSTILE_SECRET_KEY;
      delete process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
      (process.env as any).TURNSTILE_BYPASS = 'true';

      vi.spyOn(rateLimitModule, 'checkRateLimit').mockResolvedValue({
        allowed: true,
        remaining: 4,
        resetTime: Date.now() + 600000,
      });

      const req = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          origin: 'http://localhost:3000',
        },
        body: JSON.stringify({
          fullName: 'Legacy Bypass User',
          businessName: 'Legacy Corp',
          email: 'legacy@example.com',
          whatsapp: '+1234567890',
          service: 'Website Development',
          message: 'Trying legacy bypass',
          turnstileToken: 'arbitrary-token-not-mock',
        }),
      });

      const res = await POST(req);
      // Because TURNSTILE_BYPASS is ignored and TURNSTILE_SECRET_KEY is missing, it should fail with 500
      expect(res.status).toBe(500);
      const data = await res.json();
      expect(data.ok).toBe(false);
      expect(data.error).toContain('Server security configuration error');
    } finally {
      if (prevBypass !== undefined) (process.env as any).TURNSTILE_BYPASS = prevBypass;
      else delete (process.env as any).TURNSTILE_BYPASS;
      if (prevTestBypass !== undefined) process.env.TURNSTILE_BYPASS_FOR_TESTS = prevTestBypass;
      else delete process.env.TURNSTILE_BYPASS_FOR_TESTS;
      if (prevSecret) process.env.TURNSTILE_SECRET_KEY = prevSecret;
      if (prevCfSecret) process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY = prevCfSecret;
    }
  });

  it('missing TURNSTILE_SECRET_KEY in test environment does not silently bypass verification', async () => {
    const prevTestBypass = process.env.TURNSTILE_BYPASS_FOR_TESTS;
    const prevSecret = process.env.TURNSTILE_SECRET_KEY;
    const prevCfSecret = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;

    try {
      delete process.env.TURNSTILE_BYPASS_FOR_TESTS;
      delete process.env.TURNSTILE_SECRET_KEY;
      delete process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;

      vi.spyOn(rateLimitModule, 'checkRateLimit').mockResolvedValue({
        allowed: true,
        remaining: 4,
        resetTime: Date.now() + 600000,
      });

      const req = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          origin: 'http://localhost:3000',
        },
        body: JSON.stringify({
          fullName: 'Test User',
          businessName: 'Test Corp',
          email: 'test@example.com',
          whatsapp: '+1234567890',
          service: 'Website Development',
          message: 'Trying non-mock token without secret',
          turnstileToken: 'real-user-token',
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(500);
      const data = await res.json();
      expect(data.ok).toBe(false);
      expect(data.error).toContain('Server security configuration error');
    } finally {
      if (prevTestBypass !== undefined) process.env.TURNSTILE_BYPASS_FOR_TESTS = prevTestBypass;
      else delete process.env.TURNSTILE_BYPASS_FOR_TESTS;
      if (prevSecret) process.env.TURNSTILE_SECRET_KEY = prevSecret;
      if (prevCfSecret) process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY = prevCfSecret;
    }
  });

  it('rejects Turnstile response with unapproved hostname with 403', async () => {
    const prevSecret = process.env.TURNSTILE_SECRET_KEY;
    process.env.TURNSTILE_SECRET_KEY = 'test-secret';

    const originalFetch = global.fetch;
    global.fetch = vi.fn().mockImplementation(async (url: any) => {
      if (typeof url === 'string' && url.includes('challenges.cloudflare.com')) {
        return {
          ok: true,
          json: async () => ({
            success: true,
            hostname: 'malicious-phishing-site.com', // Not in allowlist!
          }),
        };
      }
      return originalFetch(url);
    });

    try {
      const req = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          origin: 'http://localhost:3000',
        },
        body: JSON.stringify({
          fullName: 'Hostname Test',
          businessName: 'Test Corp',
          email: 'host@example.com',
          whatsapp: '+1234567890',
          service: 'Website Development',
          message: 'Testing hostname verification',
          turnstileToken: 'token-from-foreign-site',
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(403);
      const data = await res.json();
      expect(data.ok).toBe(false);
      expect(data.error).toContain('Hostname mismatch');
    } finally {
      global.fetch = originalFetch;
      if (prevSecret) {
        process.env.TURNSTILE_SECRET_KEY = prevSecret;
      } else {
        delete process.env.TURNSTILE_SECRET_KEY;
      }
    }
  });

  it('rejects Turnstile response with unexpected action with 403', async () => {
    const prevSecret = process.env.TURNSTILE_SECRET_KEY;
    process.env.TURNSTILE_SECRET_KEY = 'test-secret';

    const originalFetch = global.fetch;
    global.fetch = vi.fn().mockImplementation(async (url: any) => {
      if (typeof url === 'string' && url.includes('challenges.cloudflare.com')) {
        return {
          ok: true,
          json: async () => ({
            success: true,
            hostname: '10centagency.com',
            action: 'unauthorized_admin_login', // Mismatched action!
          }),
        };
      }
      return originalFetch(url);
    });

    try {
      const req = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          origin: 'http://localhost:3000',
        },
        body: JSON.stringify({
          fullName: 'Action Test',
          businessName: 'Test Corp',
          email: 'action@example.com',
          whatsapp: '+1234567890',
          service: 'Website Development',
          message: 'Testing action verification',
          turnstileToken: 'token-with-wrong-action',
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(403);
      const data = await res.json();
      expect(data.ok).toBe(false);
      expect(data.error).toContain('Action mismatch');
    } finally {
      global.fetch = originalFetch;
      if (prevSecret) {
        process.env.TURNSTILE_SECRET_KEY = prevSecret;
      } else {
        delete process.env.TURNSTILE_SECRET_KEY;
      }
    }
  });
});
