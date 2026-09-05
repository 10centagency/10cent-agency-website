import { createServerSupabaseClient } from '@/lib/supabase-server';
import type { BlogPost, CategoryRow, ContentBlock } from '@/lib/database.types';

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

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();

    if (error || !data) {
      if (slug === 'test-post') {
        const { demoDoc } = await import('@/components/editor/demoContent');
        return {
          id: '00000000-0000-0000-0000-000000000001',
          slug: 'test-post',
          title: 'Test Post: Modern Tiptap Architecture & Blocks',
          category_id: 'a8090aac-1a88-4a38-ad04-c8c00c51d6f5',
          excerpt: 'Live demonstration of heading, image, CTA banner, columns, and gallery blocks.',
          meta_description: 'Live demonstration of heading, image, CTA banner, columns, and gallery blocks.',
          featured_image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80',
          featured_image_link: null,
          thumbnail_gradient_from: '#00346D',
          thumbnail_gradient_to: '#2F85F3',
          content: demoDoc as any,
          content_blocks: [],
          tags: ['Tiptap', 'WebEngineering', 'Architecture'],
          is_featured: false,
          sort_order: 1,
          status: 'published',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as BlogPost;
      }
      if (error) console.error(`Error fetching blog post "${slug}":`, error);
      return null;
    }

    return data as BlogPost;
  } catch (error) {
    console.error(`getBlogPost("${slug}") failed:`, error);
    return null;
  }
}

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error || !data) {
      if (error) console.error('Error fetching published blog posts:', error);
      return [];
    }

    return data as BlogPost[];
  } catch (error) {
    console.error('getPublishedBlogPosts failed:', error);
    return [];
  }
}

export async function getBlogCategories(): Promise<CategoryRow[]> {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('type', 'blog')
      .order('name');

    if (error || !data) {
      if (error) console.error('Error fetching blog categories:', error);
      return [];
    }

    return data as CategoryRow[];
  } catch (error) {
    console.error('getBlogCategories failed:', error);
    return [];
  }
}

export async function getCategoryById(id: string): Promise<CategoryRow | null> {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return data as CategoryRow;
  } catch (error) {
    console.error(`getCategoryById("${id}") failed:`, error);
    return null;
  }
}

export async function getRelatedBlogPosts(
  currentPostId: string,
  categoryId?: string | null,
  limit = 3
): Promise<BlogPost[]> {
  try {
    const supabase = createServerSupabaseClient();
    let query = supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .neq('id', currentPostId);

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query.limit(limit);

    if (error || !data) {
      if (error) console.error('Error fetching related blog posts:', error);
      return [];
    }

    return data as BlogPost[];
  } catch (error) {
    console.error('getRelatedBlogPosts failed:', error);
    return [];
  }
}

export function formatBlogTitle(title: string): string {
  const suffix = ' | 10 Cent Agency';
  const maxWithBrand = 65;
  const maxHeadlineOnly = 70;
  if (!title) return '10 Cent Agency Blog';
  const cleanTitle = title.trim();
  if (!cleanTitle) return '10 Cent Agency Blog';

  if (cleanTitle.length + suffix.length <= maxWithBrand) {
    return `${cleanTitle}${suffix}`;
  }

  if (cleanTitle.length <= maxHeadlineOnly) {
    return cleanTitle;
  }

  const slice = cleanTitle.slice(0, maxHeadlineOnly);
  const lastSpace = slice.lastIndexOf(' ');
  if (lastSpace > 0) {
    return slice.slice(0, lastSpace).trim();
  }
  return slice.trim();
}

export function extractPlainTextFromBlocks(blocks?: ContentBlock[] | null): string {
  if (!blocks || !Array.isArray(blocks)) return '';
  const texts: string[] = [];
  for (const block of blocks) {
    if (!block) continue;
    if (block.type === 'text') {
      if (block.heading) texts.push(block.heading);
      if (block.content) texts.push(block.content);
    } else if (block.type === 'image-text') {
      if (block.heading) texts.push(block.heading);
      if (block.content) texts.push(block.content);
    }
  }
  return texts.join(' ').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

export function truncateDescription(text: string, maxLen = 155): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (!clean) return '';
  if (clean.length <= maxLen) return clean;
  const truncated = clean.slice(0, maxLen);
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > 50) {
    return truncated.slice(0, lastSpace).trim() + '...';
  }
  return truncated.trim() + '...';
}

export function getBlogPostDescription(post: {
  meta_description?: string | null;
  excerpt?: string | null;
  content_blocks?: ContentBlock[] | null;
}): string {
  if (post.meta_description && post.meta_description.trim()) {
    return post.meta_description.trim();
  }
  if (post.excerpt && post.excerpt.trim()) {
    return post.excerpt.trim();
  }
  const plain = extractPlainTextFromBlocks(post.content_blocks);
  if (plain) {
    return truncateDescription(plain, 155);
  }
  return 'Expert tips on Facebook ads, website development, and AI automation for small businesses in Bangladesh.';
}
