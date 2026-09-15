# Security Hardening & Architecture Documentation

## 1. Executive Summary

This document details the production security architecture and vulnerability remediation implemented across the **10 Cent Agency** web platform (Next.js 15 App Router, TypeScript, Supabase SSR, Cloudflare Turnstile, and Tailwind CSS).

The hardening resolves architectural vulnerabilities related to:
1. **Supabase Client-Side Access & Authorization**: Enforced a zero-client-write model. Browser clients (including real admins) have no direct write or delete permissions on Supabase database tables or storage buckets.
2. **Database-Backed Admin Authorization**: Replaced email string checks with a database-backed `public.admin_users` table and `public.is_admin()` SQL function, verified exclusively through server-side APIs.
3. **Stored XSS Elimination**: Eliminated raw HTML editor blocks, restricted iframe embeds to trusted HTTPS providers, strictly sanitized HTML with `sanitize-html` before rendering, and escaped `<` and `>` in JSON-LD structured data.
4. **Strict Content Security Policy (CSP)**: Replaced permissive headers with a cryptographically secure per-request nonce and `strict-dynamic` policy in middleware, removed `'unsafe-eval'` and `'unsafe-inline'` for scripts, and propagated nonces to Next.js layout, GTM, and Turnstile.
5. **Anti-Abuse & Rate Limiting**: Hardened the contact form with schema validation, honeypot traps, Cloudflare Turnstile verification, and distributed rate limiting (Upstash Redis + database fallback).
6. **ESLint 9 & Vitest Suite**: Upgraded linting to ESLint 9 flat config and implemented real TypeScript test suites covering sanitization, CSP, and API anti-abuse.

---

## 2. Supabase Authorization & Zero-Client-Write Architecture

### 2.1 Principle of Zero Direct Browser Writes
Under this architecture:
- **No browser client** (anonymous, public, or authenticated) is granted direct `INSERT`, `UPDATE`, or `DELETE` permissions via Supabase Row-Level Security (RLS).
- **No direct storage upload policy** exists on `storage.objects` for browser clients.
- All mutations and sensitive admin reads must route through authenticated server-side API endpoints (`/api/admin/*` and `/api/contact`).
- These server APIs verify the caller's session via `supabase.auth.getUser()`, confirm their active membership in `public.admin_users`, and only then perform operations using a server-only `SUPABASE_SERVICE_ROLE_KEY` client.

### 2.2 Database Schema & Migration
The forward migration is located at:
`supabase/migrations/20260915000000_admin_security_hardening.sql`

Key components:
- **`public.admin_users`**:
  ```sql
  CREATE TABLE IF NOT EXISTS public.admin_users (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
  ```
- **`public.is_admin()`**:
  ```sql
  CREATE OR REPLACE FUNCTION public.is_admin()
  RETURNS BOOLEAN
  LANGUAGE sql
  SECURITY DEFINER
  STABLE
  SET search_path = public
  AS $$
    SELECT EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE user_id = auth.uid()
    );
  $$;
  ```
- **Client RLS Policies**:
  - `blog_posts`: Public `SELECT` allowed only where `status = 'published'`. ZERO client `INSERT`, `UPDATE`, or `DELETE`.
  - `portfolio_items`: Public `SELECT` allowed only where `status = 'published'`. ZERO client `INSERT`, `UPDATE`, or `DELETE`.
  - `categories`: Public `SELECT` allowed for all. ZERO client `INSERT`, `UPDATE`, or `DELETE`.
  - `contact_submissions`: RLS enabled with ZERO client policies (neither public nor authenticated clients can query or insert directly).
  - `storage.objects`: Public `SELECT` allowed on `portfolio-images` and `blog-images`. ZERO client `INSERT`, `UPDATE`, or `DELETE`.
  - `rate_limits`: RLS enabled with ZERO client policies (server-only rate limiting table).

---

## 3. Server-Side Admin & Contact API Layer

All administrative and public mutation operations are handled by server endpoints:

| Endpoint | Method | Auth Required | Functionality |
| :--- | :--- | :--- | :--- |
| `/api/admin/dashboard` | `GET` | Admin (`verifyAdmin`) | Aggregated stats for posts, projects, categories, and submissions |
| `/api/admin/blog` | `GET`, `POST` | Admin (`verifyAdmin`) | List all posts (including drafts) / create post |
| `/api/admin/blog/[id]` | `GET`, `PUT`, `DELETE` | Admin (`verifyAdmin`) | Retrieve, update, or remove blog post |
| `/api/admin/portfolio` | `GET`, `POST` | Admin (`verifyAdmin`) | List all projects / create project |
| `/api/admin/portfolio/[id]` | `GET`, `PUT`, `DELETE` | Admin (`verifyAdmin`) | Retrieve, update, or remove portfolio item |
| `/api/admin/categories` | `GET`, `POST` | Admin (`verifyAdmin`) | List categories / create category |
| `/api/admin/submissions` | `GET`, `PATCH`, `DELETE`| Admin (`verifyAdmin`) | Read submissions, toggle read status, delete submission |
| `/api/admin/upload` | `POST` | Admin (`verifyAdmin`) | Upload asset with bucket whitelist, mime check, and 5MB size limit |
| `/api/contact` | `POST` | Public | Honeypot check, Turnstile verify, rate limit, service-role insert |

### 3.1 Rate Limiting Architecture (`lib/rate-limit.ts`)
1. **Tier 1: Upstash Redis REST**: Uses distributed atomic `INCR` + `EXPIRE` pipeline if `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set.
2. **Tier 2: Database Fallback**: Falls back automatically to the `public.rate_limits` table in Supabase.
3. **Tier 3: Test & In-Memory Fallback**: In-memory Map ensures uninterrupted testing and resilience against offline states.

---

## 4. Stored XSS Mitigation

1. **Strict HTML Sanitization (`lib/sanitize.ts`)**:
   - Uses `sanitize-html` with an explicit tag allowlist (`h1`-`h6`, `p`, `strong`, `em`, `ul`, `ol`, `li`, `blockquote`, `table`, `a`, `img`, `iframe`).
   - Restricts schemes to `https`, `mailto`, and `tel` (rejecting `javascript:` and `data:` URIs).
   - Forces `rel="noopener noreferrer"` on all hyperlinks targeting `_blank`.
   - Filters CSS styles to only necessary presentation properties (dimensions, colors, text alignment).
2. **Removal of Raw HTML Block**:
   - Removed `htmlBlock` from `components/editor/blocks/advanced.tsx`.
   - Any legacy raw HTML blocks are rendered safely through `sanitizeContentHtml()`.
3. **Iframe Host Allowlist (`isTrustedEmbedUrl`)**:
   - Iframes are restricted strictly to allowlisted HTTPS domains: `youtube.com`, `youtube-nocookie.com`, `player.vimeo.com`, `calendly.com`, `google.com/maps`.
   - Hostile or unverified iframe sources are discarded.
4. **JSON-LD Escaping (`safeJsonLd`)**:
   - Escapes `<` to `\u003c` and `>` to `\u003e` in JSON-LD output, neutralizing `</script><script>` breakout attacks.

---

## 5. Content Security Policy (CSP) & Nonce Propagation

### 5.1 Enforced CSP Directives (via `middleware.ts`)
```http
default-src 'self';
script-src 'self' 'nonce-<base64>' 'strict-dynamic' https://www.googletagmanager.com https://connect.facebook.net https://challenges.cloudflare.com;
style-src 'self' 'unsafe-inline';
img-src 'self' blob: data: https://*.supabase.co https://www.googletagmanager.com https://*.facebook.com https://*.fbcdn.net;
font-src 'self' data:;
connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.facebook.com https://*.google-analytics.com https://*.googletagmanager.com https://challenges.cloudflare.com;
frame-src 'self' https://calendly.com https://challenges.cloudflare.com https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com https://www.google.com;
frame-ancestors 'self';
object-src 'none';
base-uri 'self';
form-action 'self';
upgrade-insecure-requests;
```

### 5.2 Verification of Inline Styles (`style-src 'self' 'unsafe-inline'`)
An inspection of the codebase verified that `'unsafe-inline'` for `style-src` is technically required due to runtime inline styling in over 60 components, including:
- **Framer Motion dynamic animations** (e.g., `CustomCursor.tsx`, `progress.tsx` calculating CSS transform matrices and coordinates at 60fps).
- **Dynamic CSS Grid layouts** (e.g., `ContentBlockRenderer.tsx` computing dynamic column spans).
- **TipTap Rich Text styling** (e.g., custom color picker attributes applied directly to element nodes).
Under W3C CSP Level 2 and 3, inline HTML `style="..."` attributes cannot receive a cryptographic nonce. Therefore, `style-src 'self' 'unsafe-inline'` is necessary to avoid breaking interactive animations and dynamic layouts, while script execution is strictly protected by nonces and `'strict-dynamic'`.

### 5.3 Nonce Propagation
- **Middleware**: Generates `crypto.randomUUID()` base64 nonce and injects both `x-nonce` and `Content-Security-Policy` into request and response headers.
- **Root Layout (`app/layout.tsx`)**: Reads `x-nonce` via `await headers()`, adds `<meta name="csp-nonce" content={nonce} />`, and supplies `nonce` to `<GoogleTagManager>`.
- **Google Tag Manager (`components/GoogleTagManager.tsx`)**: Sets `script.nonce = nonce` during async script element creation.
- **Turnstile (`components/Turnstile.tsx`)**: Discovers nonce from props, meta tag, or DOM script tags, applying `script.nonce = nonce`.
- **JSON-LD**: Dynamic pages pass the nonce to `<script type="application/ld+json" nonce={nonce}>`.

---

## 6. Required Environment Variables

Configure these variables in your deployment environment (e.g. Vercel / Cloudflare):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<public-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<server-only-service-role-key>

# Cloudflare Turnstile
NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY=<turnstile-site-key>
CLOUDFLARE_TURNSTILE_SECRET_KEY=<turnstile-secret-key>
TURNSTILE_BYPASS=false # Set to true only in staging/e2e test environments without internet

# Upstash Redis (Optional - falls back to database rate limiting if omitted)
UPSTASH_REDIS_REST_URL=https://<your-redis>.upstash.io
UPSTASH_REDIS_REST_TOKEN=<upstash-rest-token>
```

> [!CAUTION]
> Never expose `SUPABASE_SERVICE_ROLE_KEY` or `CLOUDFLARE_TURNSTILE_SECRET_KEY` to `NEXT_PUBLIC_*` or client code.

---

## 7. Migration Application & First Admin Bootstrap

### Step 1: Run SQL Migration
Execute the migration file in your Supabase SQL Editor:
`supabase/migrations/20260915000000_admin_security_hardening.sql`

### Step 2: Bootstrap the First Admin User
Run the following SQL snippet in the Supabase SQL Editor, replacing `<USER_EMAIL>` with the email of your registered administrator:

```sql
INSERT INTO public.admin_users (user_id, email, role)
SELECT id, email, 'super_admin'
FROM auth.users
WHERE email = '<USER_EMAIL>'
ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';
```

---

## 8. Automated Verification & Testing

### Test Execution
```bash
# Run Vitest test suite
npm test

# Run ESLint 9 flat config
npm run lint

# Run TypeScript type check
npm run typecheck

# Run production build
npm run build
```

### Test Suite Summary
- `tests/sanitizer.test.ts` (9 tests): Validates `<script>` stripping, event handler removal, `javascript:` protocol elimination, iframe host allowlist, rich text preservation, and `safeJsonLd` entity escaping.
- `tests/csp.test.ts` (5 tests): Validates cryptographic nonce uniqueness, absence of `'unsafe-eval'`, absence of `'unsafe-inline'` in `script-src`, presence of `'strict-dynamic'`, and security directives.
- `tests/contact.test.ts` (4 tests): Validates schema validation, honeypot absorption, email validation, and distributed rate limiting.
