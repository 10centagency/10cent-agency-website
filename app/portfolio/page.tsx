import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import AnimatedSection from '@/components/ui/AnimatedSection';
import CTABanner from '@/components/home/CTABanner';
import PortfolioGrid from './PortfolioGrid';

export const metadata: Metadata = {
  title: 'Our Portfolio | 10 Cent Agency',
  description:
    'See our work — Facebook marketing campaigns, websites, AI automation projects, and graphic design for businesses across Bangladesh.',
  alternates: {
    canonical: 'https://www.10centagency.com/portfolio',
  },
  openGraph: {
    type: 'website',
    url: 'https://www.10centagency.com/portfolio',
    siteName: '10 Cent Agency',
    title: 'Our Portfolio | 10 Cent Agency',
    description: 'See our work — Facebook marketing campaigns, websites, AI automation projects, and graphic design for businesses across Bangladesh.',
    images: [{ url: 'https://www.10centagency.com/og-image.png', width: 1200, height: 630, alt: '10 Cent Agency Portfolio' }],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Portfolio | 10 Cent Agency',
    description: 'See our work — Facebook campaigns, websites, AI automation for businesses across Bangladesh.',
  },
};

export default function PortfolioPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-brand-bgAlt pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-brand-textMid mb-8">
            <Link href="/" className="hover:text-brand-blue transition-colors">Home</Link>
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

      <PortfolioGrid />

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
