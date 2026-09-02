import type { Metadata } from 'next';
import { getPublishedBlogPosts, getBlogCategories } from '@/lib/blog';
import BlogContent from './BlogContent';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Digital Marketing Blog | 10 Cent Agency Bangladesh',
  description:
    'Practical tips on Facebook ads, website development, SEO & AI automation for Bangladeshi small businesses. Free guides & insights from 10 Cent Agency.',
  alternates: {
    canonical: 'https://www.10centagency.com/blog',
  },
  openGraph: {
    type: 'website',
    url: 'https://www.10centagency.com/blog',
    siteName: '10 Cent Agency',
    title: 'Digital Marketing Blog | 10 Cent Agency Bangladesh',
    description:
      'Practical tips on Facebook ads, website development, SEO & AI automation for Bangladeshi small businesses. Free guides & insights from 10 Cent Agency.',
    images: [
      {
        url: 'https://www.10centagency.com/og-image.png',
        width: 1200,
        height: 630,
        alt: '10 Cent Agency — Best Digital Marketing Agency in BD',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Marketing Blog | 10 Cent Agency Bangladesh',
    description:
      'Practical tips on Facebook ads, website development, SEO & AI automation for Bangladeshi small businesses. Free guides & insights from 10 Cent Agency.',
    images: ['https://www.10centagency.com/og-image.png'],
  },
};

export default async function BlogPage() {
  const [initialPosts, initialCategories] = await Promise.all([
    getPublishedBlogPosts(),
    getBlogCategories(),
  ]);

  return (
    <BlogContent
      initialPosts={initialPosts}
      initialCategories={initialCategories}
    />
  );
}
