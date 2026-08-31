import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import HomeContent from '@/components/home/HomeContent';
import { homeFaqs } from '@/components/home/homeSectionsData';
import { getLatestBlogPosts, type HomeBlogPost } from '@/lib/blog';
import { getFeaturedPortfolioItems } from '@/lib/portfolio';
import type { PortfolioItem } from '@/lib/database.types';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "10 Cent Agency | Best Digital Marketing Agency in BD",
  description:
    "Affordable digital marketing agency in BD helping small businesses grow online with Facebook ads, websites & AI automation. Get a free consultation today!",
  keywords: [
    "digital marketing agency in bd",
    "best digital marketing agency in bd",
    "digital marketing agency for small business",
    "social media marketing agency Bangladesh",
    "social media marketing agency for small business",
  ],
};

export default async function Home() {
  let blogPosts: HomeBlogPost[] = [];
  let portfolioItems: PortfolioItem[] = [];

  try {
    const [posts, portfolio] = await Promise.all([
      getLatestBlogPosts(3),
      getFeaturedPortfolioItems(6),
    ]);
    blogPosts = posts;
    portfolioItems = portfolio;
  } catch (error) {
    console.error('Failed to load homepage data:', error);
  }

  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LocalBusiness',
        '@id': 'https://www.10centagency.com/#organization',
        name: '10 Cent Agency',
        url: 'https://www.10centagency.com',
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
        url: 'https://www.10centagency.com',
        name: '10 Cent Agency',
        description: 'Best Digital Marketing Agency in BD',
        inLanguage: 'en-BD',
        publisher: {
          '@id': 'https://www.10centagency.com/#organization',
        },
      },
      {
        '@type': 'WebPage',
        '@id': 'https://www.10centagency.com/#webpage',
        url: 'https://www.10centagency.com/',
        name: '10 Cent Agency | Best Digital Marketing Agency in BD',
        description:
          'Affordable digital marketing agency in BD helping small businesses grow online with Facebook ads, websites & AI automation. Get a free consultation today!',
        inLanguage: 'en-BD',
        isPartOf: {
          '@id': 'https://www.10centagency.com/#website',
        },
        about: {
          '@id': 'https://www.10centagency.com/#organization',
        },
        mainEntity: {
          '@id': 'https://www.10centagency.com/#organization',
        },
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: ['h1', '[data-speakable-summary]'],
        },
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://www.10centagency.com/#faq',
        mainEntity: homeFaqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
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
      <HeroSection />
      <HomeContent blogPosts={blogPosts} portfolioItems={portfolioItems} />
    </>
  );
}
