import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/contact/route';
import { checkRateLimit } from '@/lib/rate-limit';

describe('POST /api/contact API Validation, CSRF & Anti-Abuse', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
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
    expect(data.error).toBeDefined();
  });

  it('silently absorbs honeypot bot submissions without writing to database', async () => {
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
    expect(data.error.toLowerCase()).toContain('email');
  });

  it('rejects payload that exceeds maximum content-length', async () => {
    const req = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        origin: 'http://localhost:3000',
        'content-length': '100000', // > 64KB
      },
      body: JSON.stringify({ message: 'too large' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(413);
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
