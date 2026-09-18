import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { getClientIp, isValidIp } from '@/lib/ip';

describe('IP Extraction and Proxy Trust Model (lib/ip.ts)', () => {
  it('validates valid IPv4 addresses', () => {
    expect(isValidIp('192.168.1.1')).toBe(true);
    expect(isValidIp('8.8.8.8')).toBe(true);
    expect(isValidIp('127.0.0.1')).toBe(true);
    expect(isValidIp('255.255.255.255')).toBe(true);
  });

  it('validates valid IPv6 addresses', () => {
    expect(isValidIp('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toBe(true);
    expect(isValidIp('::1')).toBe(true);
    expect(isValidIp('2001:db8::1')).toBe(true);
  });

  it('rejects invalid or malformed IP addresses', () => {
    expect(isValidIp('')).toBe(false);
    expect(isValidIp('999.999.999.999')).toBe(false);
    expect(isValidIp('not-an-ip')).toBe(false);
    expect(isValidIp('192.168.1.1; DROP TABLE users;')).toBe(false);
    expect(isValidIp('<script>alert(1)</script>')).toBe(false);
    expect(isValidIp('127.0.0.1:8080')).toBe(false);
  });

  it('prioritizes cf-connecting-ip when present and valid', () => {
    const req = new NextRequest('http://localhost:3000/api/contact', {
      headers: {
        'cf-connecting-ip': '203.0.113.195',
        'x-real-ip': '198.51.100.1',
        'x-forwarded-for': '192.0.2.1, 198.51.100.2',
      },
    });
    expect(getClientIp(req)).toBe('203.0.113.195');
  });

  it('uses x-vercel-ip if cf-connecting-ip is absent', () => {
    const req = new NextRequest('http://localhost:3000/api/contact', {
      headers: {
        'x-vercel-ip': '198.51.100.42',
        'x-real-ip': '198.51.100.1',
      },
    });
    expect(getClientIp(req)).toBe('198.51.100.42');
  });

  it('uses x-real-ip if cf and vercel headers are absent', () => {
    const req = new NextRequest('http://localhost:3000/api/contact', {
      headers: {
        'x-real-ip': '198.51.100.10',
      },
    });
    expect(getClientIp(req)).toBe('198.51.100.10');
  });

  it('extracts leftmost valid IP from x-forwarded-for safely', () => {
    const req = new NextRequest('http://localhost:3000/api/contact', {
      headers: {
        'x-forwarded-for': '203.0.113.50, 70.42.1.1, 10.0.0.1',
      },
    });
    expect(getClientIp(req)).toBe('203.0.113.50');
  });

  it('ignores spoofed or malicious x-forwarded-for headers and falls back', () => {
    const req = new NextRequest('http://localhost:3000/api/contact', {
      headers: {
        'x-forwarded-for': 'malicious-injected-string, 192.168.1.1',
      },
    });
    expect(getClientIp(req)).toBe('127.0.0.1');
  });

  it('falls back safely when no headers are provided', () => {
    const req = new NextRequest('http://localhost:3000/api/contact');
    expect(getClientIp(req)).toBe('127.0.0.1');
  });
});
