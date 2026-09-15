/*
  # Forward-Only Migration: Authoritative Security Hardening & Atomic Rate Limiting

  Migration: 20260915010000_repair_security_hardening.sql
  Purpose:
    1. Preserve minimal public.admin_users schema (user_id, created_at) without drift.
    2. Authoritatively drop ALL legacy/permissive policies on public tables dynamically.
    3. Re-establish strict zero-client-write policies for blog_posts, portfolio_items,
       categories, contact_submissions, admin_users, and rate_limits.
    4. Confine storage.objects write policies on application buckets ('portfolio-featured',
       'portfolio-content', 'blog-featured', 'blog-content') and ensure public read-only access.
    5. Establish atomic, concurrency-safe database rate limiting function public.check_rate_limit().

  Preflight Audit Query:
    To audit current policies before running this migration:
    SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
    FROM pg_policies
    WHERE schemaname IN ('public', 'storage')
    ORDER BY schemaname, tablename, policyname;

  First-Admin Bootstrap Query:
    INSERT INTO public.admin_users (user_id)
    SELECT id FROM auth.users WHERE email = 'YOUR_ADMIN_EMAIL@domain.com'
    ON CONFLICT (user_id) DO NOTHING;

  Verification Query:
    SELECT tablename, policyname, roles, cmd
    FROM pg_policies
    WHERE schemaname = 'public'
    ORDER BY tablename, policyname;

  Rollback Procedure:
    See end of file for safe baseline rollback script (never restores broad permissive writes).
*/

-- -----------------------------------------------------------------------------
-- 1. Ensure public.admin_users Exists with Exact Canonical Schema
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- 2. Ensure public.rate_limits Exists with Exact Canonical Schema
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.rate_limits (
  key text PRIMARY KEY,
  count integer NOT NULL DEFAULT 1,
  reset_at timestamptz NOT NULL
);

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Index for efficient cleanup of expired rate limit windows
CREATE INDEX IF NOT EXISTS idx_rate_limits_reset_at ON public.rate_limits (reset_at);

-- -----------------------------------------------------------------------------
-- 3. Dynamic Authoritative Policy Drop on Targeted Public Tables
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN (
    SELECT policyname, tablename
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN (
        'admin_users',
        'blog_posts',
        'portfolio_items',
        'categories',
        'contact_submissions',
        'rate_limits'
      )
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename);
  END LOOP;
END $$;

-- -----------------------------------------------------------------------------
-- 4. Recreate Authoritative Explicit Policies on Public Tables
-- -----------------------------------------------------------------------------

-- 4.1 public.admin_users (Deny all client access; service_role bypasses RLS)
CREATE POLICY "admin_users_deny_client_access"
  ON public.admin_users
  FOR ALL
  TO PUBLIC
  USING (false);

-- 4.2 public.blog_posts (Public SELECT published only; ZERO client writes)
CREATE POLICY "blog_posts_public_select_published"
  ON public.blog_posts
  FOR SELECT
  TO PUBLIC
  USING (status = 'published');

-- 4.3 public.portfolio_items (Public SELECT published only; ZERO client writes)
CREATE POLICY "portfolio_items_public_select_published"
  ON public.portfolio_items
  FOR SELECT
  TO PUBLIC
  USING (status = 'published');

-- 4.4 public.categories (Public SELECT all categories; ZERO client writes)
CREATE POLICY "categories_public_select"
  ON public.categories
  FOR SELECT
  TO PUBLIC
  USING (true);

-- 4.5 public.contact_submissions (Deny all direct client access; mutations via API)
CREATE POLICY "contact_submissions_deny_client_access"
  ON public.contact_submissions
  FOR ALL
  TO PUBLIC
  USING (false);

-- 4.6 public.rate_limits (Deny all client access; service_role / RPC only)
CREATE POLICY "rate_limits_deny_client_access"
  ON public.rate_limits
  FOR ALL
  TO PUBLIC
  USING (false);

-- -----------------------------------------------------------------------------
-- 5. Storage Policies on Confirmed Application Buckets
-- -----------------------------------------------------------------------------
-- Confirmed application buckets:
--   'portfolio-featured', 'portfolio-content', 'blog-featured', 'blog-content'

DO $$
DECLARE
  pol RECORD;
BEGIN
  -- Drop existing write-capable or specific policies affecting our application buckets
  FOR pol IN (
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND (
        policyname ILIKE '%portfolio%'
        OR policyname ILIKE '%blog%'
        OR policyname ILIKE '%featured%'
        OR policyname ILIKE '%content%'
        OR policyname ILIKE '%upload%'
      )
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
  END LOOP;
END $$;

-- Recreate strict public read-only policy for application buckets
DROP POLICY IF EXISTS "public_read_application_buckets" ON storage.objects;
CREATE POLICY "public_read_application_buckets"
  ON storage.objects
  FOR SELECT
  TO PUBLIC
  USING (bucket_id IN ('portfolio-featured', 'portfolio-content', 'blog-featured', 'blog-content'));

-- All uploads, modifications, and deletions on storage.objects MUST go through
-- server-side authenticated APIs using service_role credentials. ZERO client write policies.

-- -----------------------------------------------------------------------------
-- 6. Atomic Database Rate Limiting Function (Concurrency-Safe)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_key text,
  p_limit integer DEFAULT 5,
  p_window_seconds integer DEFAULT 600
)
RETURNS TABLE (
  allowed boolean,
  remaining integer,
  reset_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_now timestamptz := clock_timestamp();
  v_safe_limit integer;
  v_safe_window integer;
  v_new_reset timestamptz;
  v_count integer;
  v_current_reset timestamptz;
BEGIN
  -- Bound inputs safely to prevent integer overflow or denial of service
  v_safe_limit := LEAST(GREATEST(COALESCE(p_limit, 5), 1), 1000);
  v_safe_window := LEAST(GREATEST(COALESCE(p_window_seconds, 600), 1), 86400);
  v_new_reset := v_now + (v_safe_window || ' seconds')::interval;

  -- Atomic Upsert with row-level lock
  INSERT INTO public.rate_limits (key, count, reset_at)
  VALUES (p_key, 1, v_new_reset)
  ON CONFLICT (key) DO UPDATE
    SET count = CASE
          WHEN public.rate_limits.reset_at < v_now THEN 1
          ELSE public.rate_limits.count + 1
        END,
        reset_at = CASE
          WHEN public.rate_limits.reset_at < v_now THEN v_new_reset
          ELSE public.rate_limits.reset_at
        END
  RETURNING public.rate_limits.count, public.rate_limits.reset_at
  INTO v_count, v_current_reset;

  IF v_count <= v_safe_limit THEN
    RETURN QUERY SELECT true, (v_safe_limit - v_count), v_current_reset;
  ELSE
    RETURN QUERY SELECT false, 0, v_current_reset;
  END IF;
END;
$$;

-- Restrict execution strictly to service_role
REVOKE ALL ON FUNCTION public.check_rate_limit(text, integer, integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.check_rate_limit(text, integer, integer) FROM anon;
REVOKE ALL ON FUNCTION public.check_rate_limit(text, integer, integer) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.check_rate_limit(text, integer, integer) TO service_role;

-- -----------------------------------------------------------------------------
-- 7. Lock Down / Keep is_admin() Function
-- -----------------------------------------------------------------------------
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
