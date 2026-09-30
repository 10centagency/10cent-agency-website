import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { getClientIp, isValidIp } from '@/lib/ip';

describe('IP Extraction and Proxy Trust Model (lib/ip.ts)', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    // Reset relevant env vars
    delete process.env.TRUST_PROXY_HEADERS;
    delete process.env.TRUST_CLOUDFLARE_PROXY;
    delete process.env.TRUST_REVERSE_PROXY;
    delete process.env.VERCEL;
    delete process.env.CF_PAGES;
    (process.env as any).NODE_ENV = 'test';
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  describe('Strict IP Validation (isValidIp)', () => {
    it('validates standard IPv4 addresses', () => {
      expect(isValidIp('192.168.1.1')).toBe(true);
      expect(isValidIp('8.8.8.8')).toBe(true);
      expect(isValidIp('127.0.0.1')).toBe(true);
      expect(isValidIp('255.255.255.255')).toBe(true);
      expect(isValidIp('0.0.0.0')).toBe(true);
    });

    it('validates standard and compressed IPv6 addresses', () => {
      expect(isValidIp('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toBe(true);
      expect(isValidIp('::1')).toBe(true);
      expect(isValidIp('2001:db8::1')).toBe(true);
      expect(isValidIp('fe80::1')).toBe(true);
    });

    it('rejects invalid, malformed, or injected IP strings', () => {
      expect(isValidIp('')).toBe(false);
      expect(isValidIp('   ')).toBe(false);
      expect(isValidIp('999.999.999.999')).toBe(false);
      expect(isValidIp('256.1.1.1')).toBe(false);
      expect(isValidIp('not-an-ip')).toBe(false);
      expect(isValidIp('192.168.1.1; DROP TABLE users;')).toBe(false);
      expect(isValidIp('<script>alert(1)</script>')).toBe(false);
      expect(isValidIp('127.0.0.1:8080')).toBe(false);
      expect(isValidIp('[::1]:80')).toBe(false);
    });
  });

  describe('Untrusted Direct-Origin Spoofing Defense', () => {
    it('ignores spoofed cf-connecting-ip on direct origin when Cloudflare is not confirmed', () => {
      const req = new NextRequest('http://localhost:3000/api/contact', {
        headers: {
          'cf-connecting-ip': '203.0.113.195',
        },
      });
      expect(getClientIp(req)).toBe('127.0.0.1');
    });

    it('ignores spoofed x-real-ip on direct origin when reverse proxy is not confirmed', () => {
      const req = new NextRequest('http://localhost:3000/api/contact', {
        headers: {
          'x-real-ip': '198.51.100.10',
        },
      });
      expect(getClientIp(req)).toBe('127.0.0.1');
    });

    it('ignores spoofed x-forwarded-for on direct origin when proxy headers are not trusted', () => {
      const req = new NextRequest('http://localhost:3000/api/contact', {
        headers: {
          'x-forwarded-for': '203.0.113.50, 70.42.1.1',
        },
      });
      expect(getClientIp(req)).toBe('127.0.0.1');
    });

    it('ignores all spoofed headers in production direct origin and falls back to unknown', () => {
      (process.env as any).NODE_ENV = 'production';
      const req = new NextRequest('https://www.10centagency.com/api/contact', {
        headers: {
          'cf-connecting-ip': '203.0.113.195',
          'x-real-ip': '198.51.100.10',
          'x-forwarded-for': '203.0.113.50',
        },
      });
      expect(getClientIp(req)).toBe('unknown');
    });
  });

  describe('Cloudflare Proxy Gating (cf-connecting-ip)', () => {
    it('trusts cf-connecting-ip when TRUST_CLOUDFLARE_PROXY=true', () => {
      process.env.TRUST_CLOUDFLARE_PROXY = 'true';
      const req = new NextRequest('http://localhost:3000/api/contact', {
        headers: {
          'cf-connecting-ip': '203.0.113.195',
          'x-real-ip': '198.51.100.1',
        },
      });
      expect(getClientIp(req)).toBe('203.0.113.195');
    });

    it('trusts cf-connecting-ip when TRUST_PROXY_HEADERS=true', () => {
      process.env.TRUST_PROXY_HEADERS = 'true';
      const req = new NextRequest('http://localhost:3000/api/contact', {
        headers: {
          'cf-connecting-ip': '203.0.113.195',
        },
      });
      expect(getClientIp(req)).toBe('203.0.113.195');
    });

    it('ignores invalid cf-connecting-ip even when Cloudflare is confirmed', () => {
      process.env.TRUST_CLOUDFLARE_PROXY = 'true';
      const req = new NextRequest('http://localhost:3000/api/contact', {
        headers: {
          'cf-connecting-ip': 'injected-invalid-ip',
        },
      });
      expect(getClientIp(req)).toBe('127.0.0.1');
    });
  });

  describe('Reverse Proxy Gating (x-real-ip)', () => {
    it('trusts x-real-ip when TRUST_REVERSE_PROXY=true', () => {
      process.env.TRUST_REVERSE_PROXY = 'true';
      const req = new NextRequest('http://localhost:3000/api/contact', {
        headers: {
          'x-real-ip': '198.51.100.10',
        },
      });
      expect(getClientIp(req)).toBe('198.51.100.10');
    });

    it('trusts x-real-ip on Vercel runtime (VERCEL=1)', () => {
      process.env.VERCEL = '1';
      const req = new NextRequest('http://localhost:3000/api/contact', {
        headers: {
          'x-real-ip': '198.51.100.10',
        },
      });
      expect(getClientIp(req)).toBe('198.51.100.10');
    });

    it('ignores invalid x-real-ip even when reverse proxy is confirmed', () => {
      process.env.TRUST_REVERSE_PROXY = 'true';
      const req = new NextRequest('http://localhost:3000/api/contact', {
        headers: {
          'x-real-ip': 'bad-ip-string',
        },
      });
      expect(getClientIp(req)).toBe('127.0.0.1');
    });
  });

  describe('Forwarded For Hops (x-forwarded-for)', () => {
    it('extracts leftmost valid IP when TRUST_PROXY_HEADERS=true', () => {
      process.env.TRUST_PROXY_HEADERS = 'true';
      const req = new NextRequest('http://localhost:3000/api/contact', {
        headers: {
          'x-forwarded-for': '203.0.113.50, 70.42.1.1, 10.0.0.1',
        },
      });
      expect(getClientIp(req)).toBe('203.0.113.50');
    });

    it('extracts leftmost valid IP on Vercel (VERCEL=1)', () => {
      process.env.VERCEL = '1';
      const req = new NextRequest('http://localhost:3000/api/contact', {
        headers: {
          'x-forwarded-for': '203.0.113.50, 70.42.1.1',
        },
      });
      expect(getClientIp(req)).toBe('203.0.113.50');
    });

    it('ignores malformed leftmost hop in x-forwarded-for and falls back safely', () => {
      process.env.TRUST_PROXY_HEADERS = 'true';
      const req = new NextRequest('http://localhost:3000/api/contact', {
        headers: {
          'x-forwarded-for': 'malicious-string, 192.168.1.1',
        },
      });
      expect(getClientIp(req)).toBe('127.0.0.1');
    });
  });

  describe('Environment Fallbacks', () => {
    it('falls back to 127.0.0.1 in local/test environment when no trusted headers exist', () => {
      const req = new NextRequest('http://localhost:3000/api/contact');
      expect(getClientIp(req)).toBe('127.0.0.1');
    });

    it('falls back to unknown in production environment when no trusted headers exist', () => {
      (process.env as any).NODE_ENV = 'production';
      const req = new NextRequest('https://www.10centagency.com/api/contact');
      expect(getClientIp(req)).toBe('unknown');
    });
  });
});
