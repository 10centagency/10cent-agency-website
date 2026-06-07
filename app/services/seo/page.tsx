import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, CheckCircle2 } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import AnimatedSection, { StaggerContainer, StaggerItem } from '@/components/ui/AnimatedSection';
import { Badge } from '@/components/ui/badge';
import CTABanner from '@/components/home/CTABanner';

export const metadata: Metadata = {
  title: 'SEO Services in Bangladesh | 10 Cent Agency',
  description:
    'Get found on Google when customers in Bangladesh search for your products. On-page SEO, technical SEO & local SEO for small businesses in Dhaka. Free consultation!',
  alternates: {
    canonical: 'https://www.10centagency.com/services/seo',
  },
};

const subServices = [
  {
    name: 'On-Page SEO',
    type: 'One-time Setup',
    features: [
      'Keyword research & meta title/description optimization',
      'Heading structure, image alt text, URL optimization',
      'XML sitemap, Google Search Console & Analytics 4 setup',
    ],
  },
  {
    name: 'Local SEO',
    type: 'One-time + Maintenance',
    features: [
      'Google Business Profile setup & optimization',
      'Local keyword targeting, NAP consistency',
      'Google Maps optimization, review management strategy',
    ],
  },
];

export default function SEOPage() {
  return (
    <>
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
            <span className="text-brand-textDark font-medium">SEO</span>
          </div>

          <AnimatedSection className="max-w-4xl">
            <h1 className="text-4xl lg:text-6xl font-black text-brand-textDark mb-6">
              Search Engine Optimization
            </h1>
            <p className="text-brand-textMid text-xl leading-relaxed mb-8">
              Get found on Google when customers search for your products or services. We handle on-page SEO, technical optimization, and local SEO to improve your rankings and organic traffic.
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
            <SectionLabel className="mx-auto">Add-On Service 05</SectionLabel>
            <h2 className="text-3xl lg:text-5xl font-bold text-brand-textDark mt-2 mb-4">
              SEO Services
            </h2>
            <p className="text-brand-textMid text-lg max-w-3xl mx-auto">
              Improve your search engine rankings and drive organic traffic to your website.
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
