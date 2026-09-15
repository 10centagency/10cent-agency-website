import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/contact/route';
import { checkRateLimit } from '@/lib/rate-limit';

describe('POST /api/contact API Validation & Anti-Abuse', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('rejects submissions with missing required fields with 400', async () => {
    const req = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: '', // missing
        email: 'invalid-email',
        message: '',
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBeDefined();
  });

  it('silently absorbs honeypot bot submissions without writing to database', async () => {
    const req = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: 'Spam Bot',
        email: 'spammer@spam.com',
        message: 'Buy cheap watches',
        hp_field: 'I am a bot trapped by honeypot', // Honeypot trap filled
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    // Silent success response returned to trick spam bots
    expect(data.success).toBe(true);
  });

  it('validates email format correctly', async () => {
    const req = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: 'John Doe',
        business_name: 'Acme Corp',
        email: 'not-an-email',
        message: 'Legitimate message about SEO service',
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error.toLowerCase()).toContain('valid email address');
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
});
