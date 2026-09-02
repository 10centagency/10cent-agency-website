import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import {
  getBlogPost,
  getCategoryById,
  getRelatedBlogPosts,
  formatBlogTitle,
  getBlogPostDescription,
} from '@/lib/blog';
import BlogPostClient from './BlogPostClient';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const supabase = createServerSupabaseClient();
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('status', 'published');

  return (posts || []).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: 'Post Not Found | 10 Cent Agency',
    };
  }

  const title = formatBlogTitle(post.title);
  const description = getBlogPostDescription(post);
  const canonicalUrl = `https://www.10centagency.com/blog/${slug}`;
  const imageUrl = post.featured_image_url || 'https://www.10centagency.com/og-image.png';

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'article',
      url: canonicalUrl,
      siteName: '10 Cent Agency',
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const [category, relatedPosts] = await Promise.all([
    post.category_id ? getCategoryById(post.category_id) : Promise.resolve(null),
    getRelatedBlogPosts(post.id, post.category_id, 3),
  ]);

  const postDescription = getBlogPostDescription(post);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: `https://www.10centagency.com/blog/${post.slug}`,
    headline: post.title,
    description: postDescription,
    image: post.featured_image_url || 'https://www.10centagency.com/og-image.png',
    url: `https://www.10centagency.com/blog/${post.slug}`,
    datePublished: post.created_at || '',
    dateModified: post.updated_at || post.created_at || '',
    author: {
      '@type': 'Organization',
      name: '10 Cent Agency',
      url: 'https://www.10centagency.com',
    },
    publisher: {
      '@type': 'Organization',
      name: '10 Cent Agency',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.10centagency.com/Logo.png',
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      <BlogPostClient
        post={post}
        category={category}
        relatedPosts={relatedPosts}
      />
    </>
  );
}
