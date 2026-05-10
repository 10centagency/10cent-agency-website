/*
  # Insert Default Categories

  1. Portfolio Categories:
    - Meta
    - Website
    - Design
    - Automation

  2. Blog Categories:
    - Marketing Tips
    - Social Media
    - Web Design
    - AI & Automation
    - Business Growth
    - Case Studies
*/

INSERT INTO categories (name, slug, type) VALUES
('Meta', 'meta', 'portfolio'),
('Website', 'website', 'portfolio'),
('Design', 'design', 'portfolio'),
('Automation', 'automation', 'portfolio'),
('Marketing Tips', 'marketing-tips', 'blog'),
('Social Media', 'social-media', 'blog'),
('Web Design', 'web-design', 'blog'),
('AI & Automation', 'ai-automation', 'blog'),
('Business Growth', 'business-growth', 'blog'),
('Case Studies', 'case-studies', 'blog')
ON CONFLICT DO NOTHING;
