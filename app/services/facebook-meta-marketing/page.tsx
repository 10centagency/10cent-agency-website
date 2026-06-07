import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { ChevronRight, CheckCircle2 } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import AnimatedSection, { StaggerContainer, StaggerItem } from '@/components/ui/AnimatedSection';
import { Badge } from '@/components/ui/badge';
import CTABanner from '@/components/home/CTABanner';

export const metadata: Metadata = {
  title: 'Facebook & Meta Marketing Services | 10 Cent Agency',
  description:
    'Build a powerful, revenue-generating presence on Facebook and Instagram. From page setup to full-scale ad campaigns with measurable results.',
  alternates: {
    canonical: 'https://www.10centagency.com/services/facebook-meta-marketing',
  },
  openGraph: {
    type: 'website',
    url: 'https://www.10centagency.com/services/facebook-meta-marketing',
    siteName: '10 Cent Agency',
    title: 'Facebook & Meta Marketing Services | 10 Cent Agency',
    description:
      'Build a powerful revenue-generating presence on Facebook and Instagram. Data-driven ad campaigns with measurable results.',
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
    title: 'Facebook & Meta Marketing Services | 10 Cent Agency',
    description:
      'Build a powerful revenue-generating presence on Facebook and Instagram. Data-driven ad campaigns with measurable results.',
    images: ['https://www.10centagency.com/og-image.png'],
  },
};

const subServices = [
  {
    name: 'Page Setup & Optimization',
    type: 'One-time Setup',
    features: [
      'Facebook Business Page & Instagram Business Account setup',
      'Meta Business Suite configuration + Facebook Pixel installation',
      'Profile optimization (Bio, CTA button, contact info)',
      'Cover photo, profile photo design',
      'Linked Instagram & Facebook integration',
    ],
  },
  {
    name: 'Content Creation & Post Design',
    type: 'Monthly Retainer',
    features: [
      'Custom social media post design (static graphics) in Bangla & English',
      'Post copywriting — captions, headlines, calls-to-action',
      'Monthly content calendar planning & scheduled posting',
      'Hashtag research, festival/occasion posts, promotional posts',
      'Testimonial, educational, and product highlight post designs',
    ],
  },
  {
    name: 'Ad Creative Production',
    type: 'Per Project / Monthly',
    features: [
      'Ad creative design (static image) with copywriting',
      'Multiple ad variations for A/B testing',
      'Ad creatives in multiple sizes — Feed, Story, Banner',
      'Retargeting and promotional creatives',
    ],
  },
  {
    name: 'Facebook & Instagram Ads Management',
    type: 'Monthly Retainer',
    features: [
      'Full campaign strategy, setup, audience targeting & segmentation',
      'Custom & Lookalike audience creation, A/B split testing',
      'Facebook Conversions API (server-side tracking) setup',
      'Google Analytics 4 + Google Tag Manager integration',
      'UTM parameter setup & cross-platform attribution tracking',
      'Weekly performance check + detailed monthly report',
      'Ad budget policy: client provides budget directly to Meta; we manage everything at no extra charge',
    ],
  },
  {
    name: 'Monthly Performance Report',
    type: 'Included with Retainer',
    features: [
      'Page growth overview (Followers, Reach, Engagement rate)',
      'Ad campaign results — Spend, Reach, Clicks, Leads, ROAS',
      'Server-side tracking data + Google Analytics 4 report',
      'Audience insights, top content analysis, next-month strategy',
      'Delivered as PDF within first 5 days of each month',
    ],
  },
];

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Facebook & Meta Marketing',
  provider: {
    '@type': 'LocalBusiness',
    name: '10 Cent Agency',
    url: 'https://www.10centagency.com',
  },
  description: 'Data-driven Facebook and Instagram ad campaigns with full campaign management, content creation in Bangla and English, and server-side tracking.',
  areaServed: { '@type': 'Country', name: 'Bangladesh' },
  url: 'https://www.10centagency.com/services/facebook-meta-marketing',
};

export default function FacebookMetaMarketingPage() {
  return (
    <>
      {/* Service Schema */}
      <Script
        id="service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Facebook & Meta Marketing Services",
            "url": "https://www.10centagency.com/services/facebook-meta-marketing",
            "provider": {
              "@type": "Organization",
              "name": "10 Cent Agency",
              "url": "https://www.10centagency.com"
            },
            "areaServed": {
              "@type": "Country",
              "name": "Bangladesh"
            },
            "description": "Build a powerful, revenue-generating presence on Facebook and Instagram. From page setup to full-scale ad campaigns with measurable results."
          })
        }}
      />
      {/* Hero Section */}
      <section className="relative bg-brand-bgAlt pt-32 pb-16 overflow-hidden">
        {/* Decorative rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border-2 border-brand-blue/5 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border-2 border-brand-blue/5 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-brand-textMid mb-8">
            <Link href="/" className="hover:text-brand-blue transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/services" className="hover:text-brand-blue transition-colors">
              Services
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-brand-textDark font-medium">Facebook & Meta Marketing</span>
          </div>

          <AnimatedSection className="max-w-4xl">
            <h1 className="text-4xl lg:text-6xl font-black text-brand-textDark mb-6">
              Facebook & Meta Marketing
            </h1>
            <p className="text-brand-textMid text-xl leading-relaxed mb-8">
              Build a powerful, revenue-generating presence on Facebook and Instagram — from ground-zero setup to full-scale ad campaigns. We craft strategies that fit your budget and deliver measurable results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center bg-brand-navy text-white font-semibold rounded-xl px-8 py-4 hover:bg-brand-blue transition-colors duration-200"
              >
                Get a Quote
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center border-2 border-brand-navy text-brand-navy font-semibold rounded-xl px-8 py-4 hover:bg-brand-navy hover:text-white transition-colors duration-200"
              >
                Back to Services
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Sub-Services Section */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <SectionLabel className="mx-auto">Core Service 01</SectionLabel>
            <h2 className="text-3xl lg:text-5xl font-bold text-brand-textDark mt-2 mb-4">
              Facebook & Meta Marketing Services
            </h2>
            <p className="text-brand-textMid text-lg max-w-3xl mx-auto">
              Comprehensive solutions to establish, grow, and monetize your presence on Facebook and Instagram.
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {subServices.map((service) => (
              <StaggerItem key={service.name}>
                <div className="bg-white rounded-2xl p-8 border border-brand-border shadow-[0_4px_24px_rgba(47,133,243,0.10)] hover:shadow-[0_8px_40px_rgba(47,133,243,0.18)] transition-shadow duration-300 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge
                      variant="secondary"
                      className="bg-brand-accent/40 text-brand-navy text-xs font-semibold"
                    >
                      {service.type}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold text-brand-textDark mb-4">{service.name}</h3>
                  <ul className="space-y-3 flex-1">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-brand-blue flex-shrink-0 mt-0.5" />
                        <span className="text-brand-textMid text-sm leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
