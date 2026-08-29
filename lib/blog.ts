import { createServerSupabaseClient } from '@/lib/supabase-server';

export interface HomeBlogPost {
  slug: string;
  title: string;
  category: string;
  date: string;
  excerpt: string | null;
  featured_image_url: string | null;
  thumbnail_gradient_from: string;
  thumbnail_gradient_to: string;
  content: string | null;
}

export async function getLatestBlogPosts(limit = 3): Promise<HomeBlogPost[]> {
  try {
    const supabase = createServerSupabaseClient();
    const [postsRes, categoriesRes] = await Promise.all([
      supabase
        .from('blog_posts')
        .select('slug, title, category_id, excerpt, meta_description, featured_image_url, thumbnail_gradient_from, thumbnail_gradient_to, created_at, sort_order, status, content_blocks')
        .eq('status', 'published')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })
        .limit(limit),
      supabase
        .from('categories')
        .select('id, name')
        .eq('type', 'blog'),
    ]);

    if (postsRes.error || !postsRes.data || postsRes.data.length === 0) {
      if (postsRes.error) {
        console.error('Error fetching blog posts for homepage:', postsRes.error);
      }
      return [];
    }

    const categoryMap = new Map<string, string>();
    if (categoriesRes.data) {
      categoriesRes.data.forEach((c) => {
        categoryMap.set(c.id, c.name);
      });
    }

    return postsRes.data.map((post) => {
      let rawContent = '';
      if (Array.isArray(post.content_blocks)) {
        rawContent = post.content_blocks
          .filter((b: any) => b && (b.type === 'text' || b.content))
          .map((b: any) => (b.heading ? `${b.heading} ` : '') + (b.content || ''))
          .join(' ');
      }

      return {
        slug: post.slug,
        title: post.title,
        category: categoryMap.get(post.category_id) || 'Digital Marketing',
        date: post.created_at,
        excerpt: post.excerpt || post.meta_description || null,
        featured_image_url: post.featured_image_url,
        thumbnail_gradient_from: post.thumbnail_gradient_from || '#2F85F3',
        thumbnail_gradient_to: post.thumbnail_gradient_to || '#B6D7FF',
        content: rawContent.trim() || null,
      };
    });
  } catch (error) {
    console.error('getLatestBlogPosts failed:', error);
    return [];
  }
}
