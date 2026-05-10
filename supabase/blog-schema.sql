/*
  # Create Blog Posts Table

  1. New Tables
    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `slug` (text, unique)
      - `category_id` (uuid, foreign key to categories)
      - `excerpt` (text, optional)
      - `meta_description` (text, optional)
      - `featured_image_url` (text, optional)
      - `featured_image_link` (text, optional)
      - `thumbnail_gradient_from` (text, default)
      - `thumbnail_gradient_to` (text, default)
      - `content_blocks` (jsonb)
      - `tags` (text array)
      - `is_featured` (boolean)
      - `sort_order` (integer)
      - `status` (text: 'published' or 'draft')
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `blog_posts` table
    - Public can read published posts
    - Admin (authenticated) users have full access

  3. Triggers
    - Auto-update updated_at on changes
*/

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  excerpt text,
  meta_description text,
  featured_image_url text,
  featured_image_link text,
  thumbnail_gradient_from text DEFAULT '#2F85F3',
  thumbnail_gradient_to text DEFAULT '#B6D7FF',
  content_blocks jsonb DEFAULT '[]'::jsonb,
  tags text[] DEFAULT '{}',
  is_featured boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  status text DEFAULT 'draft' CHECK (status IN ('published', 'draft')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published blog posts"
  ON blog_posts FOR SELECT TO anon
  USING (status = 'published');

CREATE POLICY "Authenticated read published blog posts"
  ON blog_posts FOR SELECT TO authenticated
  USING (status = 'published' OR true);

CREATE POLICY "Admin manage blog posts"
  ON blog_posts FOR ALL TO authenticated
  USING (true) WITH CHECK (true);
