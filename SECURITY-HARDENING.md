# Security Hardening & Architecture Documentation

## 1. Executive Summary

This document details the production security architecture and vulnerability remediation implemented across the **10 Cent Agency** web platform (Next.js 15 App Router, TypeScript, Supabase SSR, Cloudflare Turnstile, Sharp, and Tailwind CSS).

The platform enforces:
1. **Zero-Client-Write Supabase Model**: Browser clients (including authenticated administrators) have zero direct database table write/update/delete access and zero direct Storage upload access.
2. **Database-Backed Admin Authorization**: Verified exclusively on the server via `supabase.auth.getUser()` and service-role queries against `public.admin_users`.
3. **Strict Content Security Policy (CSP)**: Cryptographic per-request base64 nonces with `strict-dynamic` in production; zero `'unsafe-inline'` and zero `'unsafe-eval'` in production script directives.
4. **Isomorphic URL Safety & Server Sanitization**: Strict URL schemes (`https`, `mailto`, `tel`, and safe same-site relative paths), absolute rejection of `javascript:`, data URIs, and protocol-relative bypasses at both API input and rendering boundaries.
5. **Multi-Tier Atomic Rate Limiting**: Distributed atomic Redis Lua execution with an atomic PostgreSQL RPC fallback (`public.check_rate_limit`), failing closed in production.
6. **Hardened Image Processing**: Server-side image decoding via `sharp`, decompression-bomb protection (16MP limit), SVG/HTML/executable rejection, animated GIF policy, EXIF/IPTC stripping, and cryptographic UUID filenames.
7. **CSRF & Same-Origin Protection**: Strict origin verification for all state-changing mutations across admin and contact routes based on trusted server configuration.

---

## 2. Runtime & Dependency Specifications

| Component | Pinned Version Policy | Configuration Source |
| :--- | :--- | :--- |
| **Node.js** | `>=22.12.0 <23` (Pinned: `22.12.0`) | `package.json` engines, `.nvmrc`, `.node-version` |
| **npm** | `10.9.2` | `package.json` packageManager & engines |
| **Next.js** | `15.5.25` | `package.json` dependencies |
| **Sharp** | `^0.35.4` | `package.json` dependencies |
| **PostCSS** | `8.5.28` | `package.json` dependencies & overrides |
| **Zod** | `^3.24.2` | `package.json` dependencies |

---

## 3. Environment Variable Configuration

The application requires specific server-side and client-facing environment variables. Secrets are never exposed to browser clients or committed to version control.

### 3.1 Canonical Variable Inventory

| Variable Name | Exposure | Required Environment | Purpose |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public (Client & Server) | All | Supabase project URL for Auth client initialization |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public (Client & Server) | All | Supabase anonymous key (Auth & public reads only) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server-Only** | Production, Preview, Dev | Privileged mutations, admin checks, and rate-limit RPC |
| `NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY` | Public (Client & Server) | Production, Preview, Dev | Canonical public site key for Turnstile widget challenge |
| `CLOUDFLARE_TURNSTILE_SECRET_KEY` | **Server-Only** | Production, Preview | Secret key used to verify Turnstile tokens with Cloudflare |
| `SITE_URL` | **Server-Only** | Production, Preview | Canonical trusted domain for CSRF decisions (e.g. `https://www.10centagency.com`) |
| `VERCEL_URL` | **Server-Only** (Vercel System) | Production, Preview | Deployment hostname used for preview domain authorization |
| `VERCEL_BRANCH_URL` | **Server-Only** (Vercel System) | Preview | Branch deployment URL for preview origin validation |
| `UPSTASH_REDIS_REST_URL` | **Server-Only** | Optional (Prod/Preview) | Distributed rate limiting primary tier |
| `TURNSTILE_BYPASS_FOR_TESTS` | **Server-Only** | **Test Only (`NODE_ENV !== 'production'`)** | Fails closed with 403 if enabled in Production. Never bypasses without this explicit flag. |
| `TRUST_PROXY_HEADERS` | **Server-Only** | Optional (Prod/Preview/Dev) | Set to `'true'` to trust upstream proxy headers (`x-forwarded-for`, `cf-connecting-ip`, `x-real-ip`). Automatically trusted on Vercel (`VERCEL === '1'`). When unset, direct origin requests reject untrusted headers to defeat spoofing. |
| `TRUST_CLOUDFLARE_PROXY` | **Server-Only** | Optional (Prod/Preview) | Set to `'true'` when behind Cloudflare to trust `cf-connecting-ip`. |
| `TRUST_REVERSE_PROXY` | **Server-Only** | Optional (Prod/Preview) | Set to `'true'` when behind Nginx or reverse proxy to trust `x-real-ip`. |

---

## 4. Supabase Authorization & Zero-Client-Write Architecture

### 4.1 Principle of Zero Direct Browser Writes
- **Browser database clients** (`createBrowserClient`) are used **strictly for Supabase Auth** (login, logout, session management) and public read queries.
- **Zero client write policies**: No `INSERT`, `UPDATE`, or `DELETE` RLS policies exist on any table for `anon` or `authenticated` roles.
- **Zero client storage upload policies**: No browser client has permission to upload directly to Supabase Storage.
- All mutations (creating blog posts, updating portfolio items, uploading images, updating submissions) are executed via `/api/admin/*` routes authenticated by `verifyAdmin()`.

### 4.2 Database Schema (`admin_users`)

The canonical schema for administrative access control:

```sql
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Revoke all direct client access (only service_role can query)
DROP POLICY IF EXISTS "No client access to admin_users" ON public.admin_users;
```

### 4.3 First-Admin Bootstrap Procedure

To grant administrator privileges to an existing authenticated user, run the following idempotent SQL command in the Supabase SQL Editor:

```sql
INSERT INTO public.admin_users (user_id)
SELECT id FROM auth.users WHERE email = 'ADMIN_EMAIL@domain.com'
ON CONFLICT (user_id) DO NOTHING;
```

### 4.4 Storage Bucket Single Source of Truth

The confirmed application buckets defined in `lib/storage-config.ts` are:

```ts
export const ALLOWED_STORAGE_BUCKETS = [
  'portfolio-featured',
  'portfolio-content',
  'blog-featured',
  'blog-content',
] as const;
```

### 4.5 Atomic Rate Limit RPC (`public.check_rate_limit`)

An atomic, concurrency-safe PostgreSQL function executed via `SECURITY DEFINER` with a locked `search_path`:

```sql
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_key TEXT,
  p_limit INT,
  p_window_seconds INT
)
RETURNS TABLE (
  allowed BOOLEAN,
  remaining INT,
  reset_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog, pg_temp
AS $$
DECLARE
  v_now TIMESTAMPTZ := clock_timestamp();
  v_window INTERVAL := (p_window_seconds || ' seconds')::interval;
  v_record RECORD;
  v_new_count INT;
  v_reset_at TIMESTAMPTZ;
BEGIN
  IF p_key IS NULL OR length(trim(p_key)) = 0 OR length(p_key) > 255 THEN
    RAISE EXCEPTION 'Invalid rate limit key';
  END IF;

  p_limit := greatest(1, least(p_limit, 10000));
  p_window_seconds := greatest(1, least(p_window_seconds, 86400));

  SELECT count, window_start
  INTO v_record
  FROM public.rate_limits
  WHERE key = p_key
  FOR UPDATE;

  IF NOT FOUND THEN
    v_reset_at := v_now + v_window;
    INSERT INTO public.rate_limits (key, count, window_start)
    VALUES (p_key, 1, v_now)
    ON CONFLICT (key) DO UPDATE
      SET count = rate_limits.count + 1
      WHERE rate_limits.window_start + v_window > v_now;

    RETURN QUERY SELECT TRUE, p_limit - 1, v_reset_at;
    RETURN;
  END IF;

  IF v_record.window_start + v_window <= v_now THEN
    v_reset_at := v_now + v_window;
    UPDATE public.rate_limits
    SET count = 1, window_start = v_now
    WHERE key = p_key;

    RETURN QUERY SELECT TRUE, p_limit - 1, v_reset_at;
    RETURN;
  END IF;

  v_reset_at := v_record.window_start + v_window;
  v_new_count := v_record.count + 1;

  IF v_new_count > p_limit THEN
    RETURN QUERY SELECT FALSE, 0, v_reset_at;
    RETURN;
  ELSE
    UPDATE public.rate_limits
    SET count = v_new_count
    WHERE key = p_key;

    RETURN QUERY SELECT TRUE, p_limit - v_new_count, v_reset_at;
    RETURN;
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.check_rate_limit(TEXT, INT, INT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_rate_limit(TEXT, INT, INT) TO service_role;
```

---

## 5. Content Security Policy (CSP) & Header Architecture

### 5.1 Production CSP Contract
In production (`NODE_ENV === 'production'`), `middleware.ts` enforces:
- **`default-src 'self'`**
- **`script-src 'self' 'nonce-{random}' 'strict-dynamic' https://challenges.cloudflare.com https://www.googletagmanager.com`**
  - **No `'unsafe-eval'`**
  - **No `'unsafe-inline'`**
- **`style-src 'self' 'unsafe-inline'`**: Required strictly for Framer Motion dynamic CSS transforms and TipTap editor styling.
- **`object-src 'none'`**
- **`base-uri 'self'`**
- **`form-action 'self'`**
- **`frame-ancestors 'self'`**
- **`upgrade-insecure-requests`**
- **`frame-src`**: Strictly reconciles all embed providers: `https://challenges.cloudflare.com`, `https://calendly.com`, `https://www.youtube.com`, `https://www.youtube-nocookie.com`, `https://player.vimeo.com`, `https://www.google.com`, `https://maps.google.com`, and `https://www.googletagmanager.com` (for GTM noscript iframe).

### 5.2 Isolated Development CSP
In development (`NODE_ENV !== 'production'`), `middleware.ts` applies a local-safe policy:
- Allows `'unsafe-eval'` for Webpack / Next.js Fast Refresh and HMR.
- Omits `upgrade-insecure-requests` to prevent breaking HTTP local testing (`http://localhost:3000`).

### 5.3 Nonce Propagation & Dynamic Rendering Trade-Off
1. `middleware.ts` generates a 16-byte cryptographically secure random nonce (`crypto.getRandomValues`) per request.
2. The nonce is injected into the `Content-Security-Policy` header and forwarded via `x-nonce` in request headers.
3. The root layout and server components (such as `components/seo/JsonLd.tsx`) read `headers()` to apply `nonce={nonce}` to script tags.
4. **Trade-off**: Because the document layout reads request headers for the unique nonce, root page document responses are dynamically rendered on demand. This prevents CDN proxies from caching and serving stale nonces (which would trigger CSP execution blocks in user browsers). Static assets (`/_next/static/*`) remain immutable and CDN-cached.

---

## 6. CSRF, Input Validation & URL Safety

### 6.1 Server-Side Same-Origin Enforcement (`lib/csrf.ts`)
- Evaluates `Origin` and `Referer` headers against trusted origins:
  - Canonical: `https://www.10centagency.com`, `https://10centagency.com`
  - Server configuration: `SITE_URL`
  - Vercel preview: `VERCEL_URL`, `VERCEL_BRANCH_URL`, and verified `*-10centagencys-projects.vercel.app` domains
  - Development: `http://localhost:3000`, `http://127.0.0.1:3000`
- Rejects foreign or missing origins with `403 Forbidden`.
- Does not trust client-controlled `Host` headers or browser-exposed variables.

### 6.2 Strict Zod Schemas (`lib/admin-schemas.ts`)
- All mutation endpoints enforce `.strict()` on Zod schemas, rejecting unrecognized or injected properties.
- Category, blog, portfolio, and contact schemas enforce slug patterns, string length limits, UUID formatting, and permitted enum values.
- Database error messages are suppressed; APIs return generic, stable client errors (e.g. `'Failed to create blog post'`).

### 6.3 Pure Isomorphic URL Safety (`lib/url-safety.ts`)
- Independent from server HTML sanitization, allowing safe usage in both client components and server rendering.
- Rejects dangerous schemes (`javascript:`, `vbscript:`, `data:`, `file:`, `blob:`, protocol-relative `//`, backslash variants, and URL-encoded bypasses).
- Provides dedicated validators:
  - `isSafeNavigationUrl()`: Validates hyperlinks and navigation actions.
  - `isSafeMediaUrl()`: Restricts media sources to Supabase storage, canonical domains, and trusted CDNs.
  - `isSafeEmbedUrl()`: Enforces frame source consistency with CSP `frame-src`.
  - `sanitizeCssBackgroundUrl()`: Prevents CSS syntax breakouts in `background-image: url(...)`.
  - `safeJsonLd()`: Escapes `<` and `>` to prevent script-tag termination XSS in JSON-LD structured data.

---

## 7. Hardened Image Upload Pipeline (`/api/admin/upload`)

The upload endpoint enforces end-to-end media validation:
1. **Node.js Runtime**: Explicitly declared via `export const runtime = 'nodejs'`.
2. **Authorization & CSRF**: Enforces `verifySameOrigin()` and `verifyAdmin()` before reading the request stream.
3. **Early Content-Length Check**: Drops requests exceeding 6MB before parsing multipart form data.
4. **Bucket Allowlist**: Enforces `isAllowedBucket()` against `ALLOWED_STORAGE_BUCKETS`.
5. **Magic Byte & Content Pre-Check**: Blocks files containing vector markup (`<svg`, `<?xml`), HTML (`<!doctype`, `<html`), PHP scripts, and binary executables (`MZ`, `ELF`).
6. **Sharp Decompression Bomb Defense**: Decodes images with `limitInputPixels: 16777216` (16MP) and max dimensions of `4096 x 4096px`.
7. **Animated GIF Policy**: Multi-frame/multi-page GIFs are rejected to eliminate resource exhaustion and frame-based polyglot vulnerabilities; static single-frame GIFs are safely re-encoded to WebP.
8. **Normalization & Metadata Stripping**: Images are re-encoded through Sharp, completely stripping EXIF, IPTC, and XMP metadata chunks.
9. **UUID Filename Generation**: Stored under `crypto.randomUUID() + '.' + canonicalExt` with `upsert: false`.

---

## 8. Database Staged Rollout, Verification & Rollback

### 8.1 Preflight Policy Audit Query
Before applying changes to a live database, inspect existing policies:

```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname IN ('public', 'storage')
ORDER BY tablename, policyname;
```

### 8.2 Migration Deployment
Run the idempotent forward migration:
`supabase/migrations/20260915010000_repair_security_hardening.sql`

This migration:
1. Dynamically drops all legacy permissive policies on targeted tables (`blog_posts`, `portfolio_items`, `categories`, `contact_submissions`, `admin_users`, `rate_limits`).
2. Recreates explicit published-only SELECT policies for public tables.
3. Drops all client write-capable policies on confirmed storage buckets (`portfolio-featured`, `portfolio-content`, `blog-featured`, `blog-content`).
4. Installs the atomic `public.check_rate_limit()` RPC function.

### 8.3 Post-Deployment Policy Verification Query
Verify that only the intended policies exist:

```sql
SELECT tablename, policyname, cmd, roles
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd;
```

Expected result:
- `blog_posts`: `SELECT` policy `Allow public published read` only.
- `portfolio_items`: `SELECT` policy `Allow public published read` only.
- `categories`: `SELECT` policy `Allow public read categories` only.
- `contact_submissions`: Zero policies (client access disabled).
- `admin_users`: Zero policies (client access disabled).
- `rate_limits`: Zero policies (client access disabled).

### 8.4 Safe Rollback Procedure
If a rollback is required, **never** restore broad `USING (true)` or `WITH CHECK (true)` policies. Instead, restore explicit read-only access and retain the zero-client-write security posture:

```sql
-- Safe Rollback: Retain zero client writes, restore read access if required
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Rollback read blog" ON public.blog_posts;
CREATE POLICY "Rollback read blog" ON public.blog_posts FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Rollback read portfolio" ON public.portfolio_items;
CREATE POLICY "Rollback read portfolio" ON public.portfolio_items FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Rollback read categories" ON public.categories;
CREATE POLICY "Rollback read categories" ON public.categories FOR SELECT USING (true);
```

---

## 9. Automated Test Suite

The test suite validates security contracts via Vitest:

| Test File | Coverage Scope |
| :--- | :--- |
| `tests/csp.test.ts` | Nonce generation uniqueness, removal of `unsafe-eval` and `unsafe-inline`, CSP directives |
| `tests/csrf.test.ts` | Allowed origin matching, Vercel preview wildcards, foreign origin 403 rejection, missing origin rejection |
| `tests/url-safety.test.ts` | Navigation URLs, media CDN URLs, embed hosts, CSS background URLs, JSON-LD escaping |
| `tests/sanitizer.test.ts` | Rich text HTML sanitization, script stripping, event handler stripping, iframe filtering |
| `tests/contact.test.ts` | Same-origin guard, rate limiting, honeypot rejection (400), conflicting aliases (400), payload size bounding (16KB) |
| `tests/ip.test.ts` | Client IP extraction, proxy trust hierarchy (Cloudflare, Vercel, x-real-ip), IPv4/IPv6 sanitization |
| `tests/admin-api.test.ts` | Unauthenticated 401, non-admin 403, strict schema rejection, UUID validation, database error suppression |
| `tests/upload.test.ts` | Same-origin, admin auth, bucket allowlist, SVG/HTML/executable rejection, decompression bomb defense, Sharp re-encoding |
| `tests/middleware-auth.test.ts` | Nonce forwarding, GTM frame-src, session cookie preservation on `/admin`, redirect cookie forwarding |
| `tests/contact-form-a11y.test.tsx` | Accessible field names, keyboard navigation, tabIndex=-1 honeypot, double-submission prevention, error/success states |
| `tests/consent-banner.test.tsx` | Google Consent Mode v2, versioned storage (`tc_consent_v1`), keyboard controls, modal focus trap & escape close |
| `tests/e2e/smoke.spec.ts` | Playwright E2E smoke tests: page loads, navigation reachability, fresh-context consent, mocked form submission |

Run unit and component tests:
```bash
npm test
```

Run Playwright smoke tests:
```bash
npm run test:e2e
```
