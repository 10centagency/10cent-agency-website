-- Add featured image alt text to blog_posts
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS featured_image_alt TEXT;

-- Add featured image alt text to portfolio_items  
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS featured_image_alt TEXT;
