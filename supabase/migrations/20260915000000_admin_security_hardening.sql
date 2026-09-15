/*
  # Admin Authorization & Zero-Client-Write RLS Hardening Migration

  1. Security Changes:
    - Create `public.admin_users` table to maintain the database source of truth for admin membership.
    - Enable RLS on `public.admin_users` to deny all direct client access (no anonymous or normal user enumeration).
    - Create `public.is_admin()` SQL function (SECURITY DEFINER, STABLE, search_path locked down)
      to safely check whether the caller's auth.uid() exists in public.admin_users.
    - Revoke execution from PUBLIC and anon; grant execution only to authenticated and service_role.

  2. Strict Table & Storage Policies:
    - Drop all legacy permissive policies (including `USING (true)`, `WITH CHECK (true)`, and `OR true`).
    - Enforce ZERO client-side writes across all tables and storage buckets:
      * NO client INSERT/UPDATE/DELETE policies for `blog_posts`, `portfolio_items`, `categories`, `contact_submissions`.
      * Direct public insertion into `contact_submissions` is completely REVOKED.
      * Direct browser storage uploads/updates/deletions on `storage.objects` are completely REVOKED.
      * All mutations must route through server-side API endpoints using the service-role client.
    - Public SELECT access is permitted ONLY for published content (`status = 'published'`) and categories.

  3. Bootstrap Instructions:
    To bootstrap the first admin user, run this in the Supabase SQL editor:
    INSERT INTO public.admin_users (user_id)
    SELECT id FROM auth.users WHERE email = 'YOUR_ADMIN_EMAIL@domain.com'
    ON CONFLICT (user_id) DO NOTHING;
*/

-- -------------------------------------------------------------------------
-- 1. Create Admin Users Table
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Deny all client operations on public.admin_users (service_role bypasses RLS)
DROP POLICY IF EXISTS "Deny all client read on admin_users" ON public.admin_users;
CREATE POLICY "Deny all client read on admin_users"
  ON public.admin_users FOR SELECT
  TO PUBLIC
  USING (false);

-- -------------------------------------------------------------------------
-- 2. Create is_admin() Function
-- -------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_admin() FROM anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO service_role;

-- -------------------------------------------------------------------------
-- 3. Harden portfolio_items Policies
-- -------------------------------------------------------------------------
-- Drop all existing policies
DROP POLICY IF EXISTS "Public read published portfolio" ON public.portfolio_items;
DROP POLICY IF EXISTS "Admin select portfolio" ON public.portfolio_items;
DROP POLICY IF EXISTS "Admin insert portfolio" ON public.portfolio_items;
DROP POLICY IF EXISTS "Admin update portfolio" ON public.portfolio_items;
DROP POLICY IF EXISTS "Admin delete portfolio" ON public.portfolio_items;
DROP POLICY IF EXISTS "Admin select all portfolio" ON public.portfolio_items;

ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

-- Only published items may be read by clients
CREATE POLICY "Public read published portfolio"
  ON public.portfolio_items FOR SELECT
  TO PUBLIC
  USING (status = 'published');

-- Zero client write policies: all INSERT/UPDATE/DELETE are performed via server-side APIs

-- -------------------------------------------------------------------------
-- 4. Harden blog_posts Policies
-- -------------------------------------------------------------------------
-- Drop all existing policies
DROP POLICY IF EXISTS "Public read published blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated read published blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admin manage blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admin select all blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admin insert blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admin update blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admin delete blog posts" ON public.blog_posts;

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Only published posts may be read by clients (no "OR true")
CREATE POLICY "Public read published blog posts"
  ON public.blog_posts FOR SELECT
  TO PUBLIC
  USING (status = 'published');

-- Zero client write policies: all INSERT/UPDATE/DELETE are performed via server-side APIs

-- -------------------------------------------------------------------------
-- 5. Harden categories Policies
-- -------------------------------------------------------------------------
-- Drop all existing policies
DROP POLICY IF EXISTS "Public read categories" ON public.categories;
DROP POLICY IF EXISTS "Authenticated read categories" ON public.categories;
DROP POLICY IF EXISTS "Admin manage categories" ON public.categories;
DROP POLICY IF EXISTS "Admin insert categories" ON public.categories;
DROP POLICY IF EXISTS "Admin update categories" ON public.categories;
DROP POLICY IF EXISTS "Admin delete categories" ON public.categories;

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Public read for categories
CREATE POLICY "Public read categories"
  ON public.categories FOR SELECT
  TO PUBLIC
  USING (true);

-- Zero client write policies: all writes are performed via server-side APIs

-- -------------------------------------------------------------------------
-- 6. Lock Down contact_submissions
-- -------------------------------------------------------------------------
-- Drop all existing policies
DROP POLICY IF EXISTS "Public insert contacts" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admin select contacts" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admin update contacts" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admin delete contacts" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admin manage contacts" ON public.contact_submissions;
DROP POLICY IF EXISTS "Public insert contact submissions" ON public.contact_submissions;

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Zero client policies: contact_submissions is NOT accessible from client browser.
-- All reads and writes must pass through validated server-side APIs using service_role.

-- -------------------------------------------------------------------------
-- 7. Lock Down storage.objects Writes
-- -------------------------------------------------------------------------
-- Drop legacy permissive policies on storage buckets
DROP POLICY IF EXISTS "Admin upload featured images" ON storage.objects;
DROP POLICY IF EXISTS "Admin update featured images" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete featured images" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload content images" ON storage.objects;
DROP POLICY IF EXISTS "Admin update content images" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete content images" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Admin update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete blog images" ON storage.objects;

-- Ensure public read for published images in public buckets
DROP POLICY IF EXISTS "Public read public buckets" ON storage.objects;
CREATE POLICY "Public read public buckets"
  ON storage.objects FOR SELECT
  TO PUBLIC
  USING (bucket_id IN ('portfolio-featured', 'portfolio-content', 'blog-featured', 'blog-content'));

-- Zero client write policies on storage: all uploads/deletions route through /api/admin/upload via service_role.

-- -------------------------------------------------------------------------
-- 8. Persistent Rate Limits Table (Fallback for distributed rate limiting)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.rate_limits (
  key text PRIMARY KEY,
  count integer DEFAULT 1 NOT NULL,
  reset_at timestamptz NOT NULL
);

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Deny all client access (only service_role can read/write rate limits)
DROP POLICY IF EXISTS "Deny client access to rate_limits" ON public.rate_limits;
CREATE POLICY "Deny client access to rate_limits"
  ON public.rate_limits FOR ALL
  TO PUBLIC
  USING (false);

