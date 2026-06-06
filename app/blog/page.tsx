import type { Metadata } from 'next';
import BlogContent from './BlogContent';

export const metadata: Metadata = {
  title: 'Digital Marketing Blog | 10 Cent Agency',
  description:
    'Expert tips on Facebook ads, website development, and AI automation for small businesses in Bangladesh.',
  alternates: {
    canonical: 'https://www.10centagency.com/blog',
  },
  openGraph: {
    type: 'website',
    url: 'https://www.10centagency.com/blog',
    siteName: '10 Cent Agency',
    title: 'Digital Marketing Blog | 10 Cent Agency',
    description:
      'Expert tips on Facebook ads, website development, and AI automation for small businesses in Bangladesh.',
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
    title: 'Digital Marketing Blog | 10 Cent Agency',
    description:
      'Expert tips on Facebook ads, website development, and AI automation for small businesses in Bangladesh.',
    images: ['https://www.10centagency.com/og-image.png'],
  },
};

export default function BlogPage() {
  return <BlogContent />;
}
