import { MetadataRoute } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase-server';

function parseValidDate(dateStr: string | null | undefined): Date | undefined {
  if (!dateStr) return undefined;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? undefined : d;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let blogPosts: Array<{
    slug: string;
    updated_at: string | null;
    created_at: string | null;
  }> = [];
  let portfolioItems: Array<{
    slug: string;
    updated_at: string | null;
    created_at: string | null;
  }> = [];

  try {
    const supabase = createServerSupabaseClient();

    const { data: blogData } = await supabase
      .from('blog_posts')
      .select('slug, updated_at, created_at')
      .eq('status', 'published');

    const { data: portfolioData } = await supabase
      .from('portfolio_items')
      .select('slug, updated_at, created_at')
      .eq('status', 'published');

    if (blogData) blogPosts = blogData;
    if (portfolioData) portfolioItems = portfolioData;
  } catch {
    // If database is unreachable, continue with empty arrays
    blogPosts = [];
    portfolioItems = [];
  }

  return [
    {
      url: 'https://www.10centagency.com',
      lastModified: new Date('2026-08-29'),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://www.10centagency.com/services',
      lastModified: new Date('2026-08-28'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://www.10centagency.com/services/facebook-meta-marketing',
      lastModified: new Date('2026-08-27'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://www.10centagency.com/services/website-development',
      lastModified: new Date('2026-08-20'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://www.10centagency.com/services/ai-automation-chatbot',
      lastModified: new Date('2026-08-22'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://www.10centagency.com/services/social-media-management',
      lastModified: new Date('2026-08-23'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://www.10centagency.com/services/seo-aeo-geo',
      lastModified: new Date('2026-08-24'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://www.10centagency.com/services/graphic-design',
      lastModified: new Date('2026-08-25'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://www.10centagency.com/services/google-ads',
      lastModified: new Date('2026-08-26'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://www.10centagency.com/about',
      lastModified: new Date('2026-06-07'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: 'https://www.10centagency.com/portfolio',
      lastModified: new Date('2026-06-06'),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: 'https://www.10centagency.com/blog',
      lastModified: new Date('2026-06-06'),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: 'https://www.10centagency.com/contact',
      lastModified: new Date('2026-06-06'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://www.10centagency.com/privacy-policy',
      lastModified: new Date('2026-06-02'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: 'https://www.10centagency.com/terms-of-service',
      lastModified: new Date('2026-06-02'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    ...(blogPosts ?? []).map((post) => {
      const lastModified =
        parseValidDate(post.updated_at) ?? parseValidDate(post.created_at);
      return {
        url: `https://www.10centagency.com/blog/${post.slug}`,
        ...(lastModified ? { lastModified } : {}),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      };
    }),
    ...(portfolioItems ?? []).map((item) => {
      const lastModified =
        parseValidDate(item.updated_at) ?? parseValidDate(item.created_at);
      return {
        url: `https://www.10centagency.com/portfolio/${item.slug}`,
        ...(lastModified ? { lastModified } : {}),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      };
    }),
  ];
}
