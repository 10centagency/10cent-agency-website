/*
  # Create Categories Table

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `slug` (text)
      - `type` (text: 'portfolio' or 'blog')
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `categories` table
    - Public read access for all users
    - Admin (authenticated) users can insert/update/delete
*/

CREATE TABLE IF NOT EXISTS categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL,
  type text NOT NULL CHECK (type IN ('portfolio', 'blog')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read categories"
  ON categories FOR SELECT TO anon
  USING (true);

CREATE POLICY "Authenticated read categories"
  ON categories FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admin manage categories"
  ON categories FOR ALL TO authenticated
  USING (true) WITH CHECK (true);
