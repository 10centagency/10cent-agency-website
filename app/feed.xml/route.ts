import { createServerSupabaseClient } from '@/lib/supabase-server';
import { plainTextFromDoc } from '@/components/editor';

export const revalidate = 3600;

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function getExcerpt(post: {
  excerpt?: string | null;
  meta_description?: string | null;
  content?: unknown;
  content_blocks?: any;
}): string {
  if (post.excerpt && post.excerpt.trim()) {
    return post.excerpt.trim();
  }
  if (post.meta_description && post.meta_description.trim()) {
    return post.meta_description.trim();
  }

  const fromNew = plainTextFromDoc(post.content);
  if (fromNew) {
    return fromNew.length > 280 ? `${fromNew.slice(0, 277)}...` : fromNew;
  }

  if (Array.isArray(post.content_blocks)) {
    const text = post.content_blocks
      .filter((b: any) => b && (b.type === 'text' || b.content))
      .map((b: any) => (b.heading ? `${b.heading} ` : '') + (b.content || ''))
      .join(' ')
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (text) {
      return text.length > 280 ? `${text.slice(0, 277)}...` : text;
    }
  }
  return '';
}

export async function GET() {
  let itemsXml = '';
  let lastBuildDate = new Date().toUTCString();

  try {
    const supabase = createServerSupabaseClient();
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('slug, title, excerpt, meta_description, content, content_blocks, created_at, updated_at, sort_order, status')
      .eq('status', 'published')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(20);

    if (!error && Array.isArray(posts) && posts.length > 0) {
      const newestDate = posts[0].updated_at || posts[0].created_at;
      if (newestDate) {
        const d = new Date(newestDate);
        if (!isNaN(d.getTime())) {
          lastBuildDate = d.toUTCString();
        }
      }

      itemsXml = posts
        .map((post) => {
          const title = escapeXml(post.title || '');
          const link = `https://www.10centagency.com/blog/${post.slug}`;
          const excerpt = escapeXml(getExcerpt(post));
          const pubDateStr = post.created_at ? new Date(post.created_at).toUTCString() : new Date().toUTCString();

          return `    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDateStr}</pubDate>
      <description>${excerpt}</description>
    </item>`;
        })
        .join('\n');
    }
  } catch (err) {
    console.error('Error generating RSS feed:', err);
    // Continue with empty items XML
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>10 Cent Agency Blog</title>
    <link>https://www.10centagency.com/blog</link>
    <description>Digital marketing insights, guides, and growth strategies for small businesses in Bangladesh.</description>
    <language>en</language>
    <atom:link href="https://www.10centagency.com/feed.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
${itemsXml ? `${itemsXml}\n` : ''}  </channel>
</rss>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
