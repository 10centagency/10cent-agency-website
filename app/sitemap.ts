import { MetadataRoute } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let blogPosts: Array<{ slug: string; updated_at: string | null }> = []
  let portfolioItems: Array<{ slug: string; updated_at: string | null }> = []

  try {
    const supabase = createServerSupabaseClient()

    const { data: blogData } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('status', 'published')

    const { data: portfolioData } = await supabase
      .from('portfolio_items')
      .select('slug, updated_at')

    if (blogData) blogPosts = blogData
    if (portfolioData) portfolioItems = portfolioData
  } catch {
    // If database is unreachable, continue with empty arrays
    blogPosts = []
    portfolioItems = []
  }

  return [
    {
      url: 'https://www.10centagency.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://www.10centagency.com/services',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://www.10centagency.com/services/facebook-meta-marketing',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://www.10centagency.com/services/website-development',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://www.10centagency.com/services/ai-automation-chatbot',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://www.10centagency.com/services/social-media-management',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://www.10centagency.com/services/seo',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://www.10centagency.com/services/graphic-design',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://www.10centagency.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: 'https://www.10centagency.com/portfolio',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: 'https://www.10centagency.com/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: 'https://www.10centagency.com/contact',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://www.10centagency.com/privacy-policy',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: 'https://www.10centagency.com/terms-of-service',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    ...(blogPosts ?? []).map((post) => ({
      url: `https://www.10centagency.com/blog/${post.slug}`,
      lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
    ...(portfolioItems ?? []).map((item) => ({
      url: `https://www.10centagency.com/portfolio/${item.slug}`,
      lastModified: item.updated_at ? new Date(item.updated_at) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
  ]
}
