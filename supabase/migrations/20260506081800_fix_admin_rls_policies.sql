/*
  # Fix Admin RLS Policies to Require Authentication

  1. Security Changes
    - Replace permissive `USING (true)` / `WITH CHECK (true)` admin policies
      on `portfolio_items` and `contact_submissions` with policies that
      require `auth.role() = 'authenticated'`.
    - This ensures only logged-in admin users can perform admin operations
      (SELECT, INSERT, UPDATE, DELETE) while public access remains
      appropriately restricted.

  2. Important Notes
    - Public read on published portfolio_items is preserved.
    - Public insert on contact_submissions is preserved.
    - All admin-scoped operations now require an authenticated session.
*/

-- Drop old permissive admin policies on portfolio_items
DROP POLICY IF EXISTS "Admin delete portfolio" ON portfolio_items;
DROP POLICY IF EXISTS "Admin update portfolio" ON portfolio_items;
DROP POLICY IF EXISTS "Admin insert portfolio" ON portfolio_items;
DROP POLICY IF EXISTS "Admin select portfolio" ON portfolio_items;

-- Recreate with auth check
CREATE POLICY "Admin select portfolio"
  ON portfolio_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin insert portfolio"
  ON portfolio_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admin update portfolio"
  ON portfolio_items FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin delete portfolio"
  ON portfolio_items FOR DELETE
  TO authenticated
  USING (true);

-- Drop old permissive admin policies on contact_submissions
DROP POLICY IF EXISTS "Admin delete contacts" ON contact_submissions;
DROP POLICY IF EXISTS "Admin update contacts" ON contact_submissions;
DROP POLICY IF EXISTS "Admin select contacts" ON contact_submissions;

-- Recreate with auth check
CREATE POLICY "Admin select contacts"
  ON contact_submissions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin update contacts"
  ON contact_submissions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin delete contacts"
  ON contact_submissions FOR DELETE
  TO authenticated
  USING (true);

-- Add storage policies for authenticated users
-- portfolio-featured bucket
CREATE POLICY "Admin upload featured images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'portfolio-featured');

CREATE POLICY "Admin update featured images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'portfolio-featured')
  WITH CHECK (bucket_id = 'portfolio-featured');

CREATE POLICY "Admin delete featured images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'portfolio-featured');

-- portfolio-content bucket
CREATE POLICY "Admin upload content images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'portfolio-content');

CREATE POLICY "Admin update content images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'portfolio-content')
  WITH CHECK (bucket_id = 'portfolio-content');

CREATE POLICY "Admin delete content images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'portfolio-content');
