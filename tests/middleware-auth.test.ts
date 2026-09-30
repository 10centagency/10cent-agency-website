import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

const mockCreateServerClient = vi.fn();
vi.mock('@supabase/ssr', () => ({
  createServerClient: (...args: any[]) => mockCreateServerClient(...args),
}));

import { middleware } from '@/middleware';

describe('Middleware Security, Nonce Propagation & Cookie Preservation', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockCreateServerClient.mockReset();
  });

  describe('Content Security Policy Contracts', () => {
    it('generates unique nonces and sets CSP headers on every request', async () => {
      const req = new NextRequest('https://www.10centagency.com/');
      const res = await middleware(req);

      const nonce = res.headers.get('x-nonce');
      const csp = res.headers.get('Content-Security-Policy');

      expect(nonce).toBeDefined();
      expect(typeof nonce).toBe('string');
      expect(csp).toBeDefined();
      expect(csp).toContain(`'nonce-${nonce}'`);
    });

    it('forwards x-nonce in request headers for downstream server components', async () => {
      const req = new NextRequest('https://www.10centagency.com/blog');
      const res = await middleware(req);

      const nonce = res.headers.get('x-nonce');
      expect(nonce).toBeTruthy();
    });

    it('includes https://www.googletagmanager.com in frame-src for GTM noscript iframe', async () => {
      const req = new NextRequest('https://www.10centagency.com/');
      const res = await middleware(req);
      const csp = res.headers.get('Content-Security-Policy') || '';

      const match = csp.match(/frame-src\s+([^;]+)/);
      expect(match).not.toBeNull();
      const frameSrc = match![1];
      expect(frameSrc).toContain('https://www.googletagmanager.com');
    });

    it('includes all trusted embed providers in frame-src', async () => {
      const req = new NextRequest('https://www.10centagency.com/');
      const res = await middleware(req);
      const csp = res.headers.get('Content-Security-Policy') || '';

      expect(csp).toContain('https://challenges.cloudflare.com');
      expect(csp).toContain('https://calendly.com');
      expect(csp).toContain('https://www.youtube.com');
      expect(csp).toContain('https://player.vimeo.com');
      expect(csp).toContain('https://www.google.com');
      expect(csp).toContain('https://maps.google.com');
    });
  });

  describe('Session Cookie Preservation on /admin', () => {
    it('redirects unauthenticated user from /admin to /auth', async () => {
      mockCreateServerClient.mockReturnValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: new Error('No session') }),
        },
      });

      const req = new NextRequest('https://www.10centagency.com/admin/blog');
      const res = await middleware(req);

      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toContain('/auth');
    });

    it('preserves cookies set during auth on authorized /admin requests', async () => {
      let cookieCallback: (cookies: any[]) => void = () => {};

      vi.spyOn(global, 'fetch').mockImplementation(async (url: any) => {
        if (typeof url === 'string' && url.includes('/rest/v1/admin_users')) {
          return new Response(JSON.stringify([{ user_id: 'admin-1' }]), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        return new Response('Not Found', { status: 404 });
      });

      mockCreateServerClient.mockImplementation((_url: string, _key: string, options: any) => {
        cookieCallback = options.cookies.setAll;
        return {
          auth: {
            getUser: vi.fn().mockImplementation(async () => {
              // Simulate Supabase refreshing the auth token cookie
              cookieCallback([
                {
                  name: 'sb-test-auth-token',
                  value: 'refreshed-session-token-abc',
                  options: { path: '/', httpOnly: true, secure: true },
                },
              ]);
              return {
                data: { user: { id: 'admin-1', email: 'admin@10centagency.com' } },
                error: null,
              };
            }),
          },
        };
      });

      const req = new NextRequest('https://www.10centagency.com/admin/dashboard');
      const res = await middleware(req);

      // Must allow request through (status 200)
      expect(res.status).toBe(200);

      // Crucial: The refreshed cookie MUST NOT have been discarded
      const cookies = res.cookies.getAll();
      const authCookie = cookies.find((c) => c.name === 'sb-test-auth-token');
      expect(authCookie).toBeDefined();
      expect(authCookie!.value).toBe('refreshed-session-token-abc');
    });
  });
});
