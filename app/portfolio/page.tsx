import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import AnimatedSection from '@/components/ui/AnimatedSection';
import CTABanner from '@/components/home/CTABanner';
import { getPublishedPortfolioItems } from '@/lib/portfolio';
import PortfolioGrid from './PortfolioGrid';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Our Portfolio & Case Studies | 10 Cent Agency Bangladesh',
  description:
    'Browse real results — website builds, Facebook ad campaigns, AI chatbot setups & graphic design projects for businesses across Bangladesh. See our work.',
  alternates: {
    canonical: 'https://www.10centagency.com/portfolio',
  },
  openGraph: {
    type: 'website',
    url: 'https://www.10centagency.com/portfolio',
    siteName: '10 Cent Agency',
    title: 'Our Portfolio & Case Studies | 10 Cent Agency Bangladesh',
    description:
      'Browse real results — website builds, Facebook ad campaigns, AI chatbot setups & graphic design projects for businesses across Bangladesh. See our work.',
    images: [
      {
        url: 'https://www.10centagency.com/og-image.png',
        width: 1200,
        height: 630,
        alt: '10 Cent Agency Portfolio',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Portfolio & Case Studies | 10 Cent Agency Bangladesh',
    description:
      'Browse real results — website builds, Facebook ad campaigns, AI chatbot setups & graphic design projects for businesses across Bangladesh. See our work.',
    images: [
      {
        url: 'https://www.10centagency.com/og-image.png',
        width: 1200,
        height: 630,
        alt: '10 Cent Agency Portfolio',
      },
    ],
  },
};

export default async function PortfolioPage() {
  const initialItems = await getPublishedPortfolioItems();

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
          'https://x.com/10centagency',
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
        '@id': 'https://www.10centagency.com/portfolio#webpage',
        url: 'https://www.10centagency.com/portfolio',
        name: 'Our Portfolio & Case Studies | 10 Cent Agency Bangladesh',
        description:
          'Browse real results — website builds, Facebook ad campaigns, AI chatbot setups & graphic design projects for businesses across Bangladesh. See our work.',
        inLanguage: 'en-BD',
        isPartOf: {
          '@id': 'https://www.10centagency.com/#website',
        },
        about: {
          '@id': 'https://www.10centagency.com/#organization',
        },
        mainEntity: {
          '@id': 'https://www.10centagency.com/portfolio#list',
        },
      },
      {
        '@type': 'ItemList',
        '@id': 'https://www.10centagency.com/portfolio#list',
        name: '10 Cent Agency Portfolio & Case Studies',
        numberOfItems: initialItems.length,
        itemListElement: initialItems.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.title,
          url: `https://www.10centagency.com/portfolio/${item.slug}`,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://www.10centagency.com/portfolio#breadcrumb',
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
            name: 'Portfolio',
            item: 'https://www.10centagency.com/portfolio',
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
      {/* Hero */}
      <section className="bg-brand-bgAlt pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-brand-textMid mb-8">
            <Link href="/" className="hover:text-brand-blue transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-brand-textDark font-medium">Portfolio</span>
          </div>
          <AnimatedSection className="max-w-3xl">
            <SectionLabel>Our Work</SectionLabel>
            <h1 className="text-4xl lg:text-6xl font-black text-brand-textDark mt-2 mb-5">
              Our Portfolio
            </h1>
            <p className="text-brand-textMid text-xl leading-relaxed">
              See our work — Facebook marketing campaigns, websites, AI automation projects, and graphic design for businesses across Bangladesh.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <PortfolioGrid initialItems={initialItems} />

      {/* CTA */}
      <section className="bg-brand-bgAlt py-16 text-center">
        <AnimatedSection>
          <h2 className="text-3xl font-bold text-brand-textDark mb-4">
            Want to See Your Business Here?
          </h2>
          <p className="text-brand-textMid mb-8 max-w-xl mx-auto">
            Let us create results-driven campaigns, websites, and automation for your business.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-brand-navy text-white font-semibold rounded-xl px-8 py-4 hover:bg-brand-blue transition-colors duration-200"
          >
            Start Your Project
          </Link>
        </AnimatedSection>
      </section>

      <CTABanner />
    </>
  );
}
