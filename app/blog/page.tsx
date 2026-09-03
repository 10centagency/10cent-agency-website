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
    types: {
      'application/rss+xml': [
        {
          url: 'https://www.10centagency.com/feed.xml',
          title: '10 Cent Agency Blog',
        },
      ],
    },
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

  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LocalBusiness',
        '@id': 'https://www.10centagency.com/#organization',
        name: '10 Cent Agency',
        url: 'https://www.10centagency.com/',
        logo: 'https://www.10centagency.com/Logo.webp',
        image: 'https://www.10centagency.com/og-image.png',
        description:
          'Affordable digital marketing agency in Bangladesh helping small businesses grow online with Facebook ads, websites & AI automation.',
        telephone: '+880 1615-144114',
        email: 'hello@10centagency.com',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'East Monipur, Mirpur',
          addressLocality: 'Dhaka',
          postalCode: '1216',
          addressCountry: 'BD',
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [
              'Saturday',
              'Sunday',
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
            ],
            opens: '10:00',
            closes: '21:00',
          },
        ],
        sameAs: [
          'https://www.facebook.com/10centagency',
          'https://www.instagram.com/10centagency',
          'https://www.youtube.com/@10centagency',
          'https://www.linkedin.com/company/10-cent-agency',
        ],
        priceRange: '৳৳',
      },
      {
        '@type': 'WebSite',
        '@id': 'https://www.10centagency.com/#website',
        url: 'https://www.10centagency.com/',
        name: '10 Cent Agency',
        description: 'Best Digital Marketing Agency in BD',
        inLanguage: 'en-BD',
        publisher: {
          '@id': 'https://www.10centagency.com/#organization',
        },
      },
      {
        '@type': 'CollectionPage',
        '@id': 'https://www.10centagency.com/blog#webpage',
        url: 'https://www.10centagency.com/blog',
        name: 'Digital Marketing Blog | 10 Cent Agency Bangladesh',
        description:
          'Practical tips on Facebook ads, website development, SEO & AI automation for Bangladeshi small businesses. Free guides & insights from 10 Cent Agency.',
        inLanguage: 'en-BD',
        isPartOf: {
          '@id': 'https://www.10centagency.com/#website',
        },
        about: {
          '@id': 'https://www.10centagency.com/#organization',
        },
        mainEntity: {
          '@id': 'https://www.10centagency.com/blog#list',
        },
      },
      {
        '@type': 'ItemList',
        '@id': 'https://www.10centagency.com/blog#list',
        name: 'Digital Marketing Blog Posts',
        numberOfItems: initialPosts.length,
        itemListElement: initialPosts.map((post, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: post.title,
          url: `https://www.10centagency.com/blog/${post.slug}`,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://www.10centagency.com/blog#breadcrumb',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://www.10centagency.com/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: 'https://www.10centagency.com/blog',
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaGraph).replace(/</g, '\\u003c'),
        }}
      />
      <BlogContent
        initialPosts={initialPosts}
        initialCategories={initialCategories}
      />
    </>
  );
}
