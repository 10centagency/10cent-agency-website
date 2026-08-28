'use client';

import dynamic from 'next/dynamic';
import ServicesOverview from '@/components/home/ServicesOverview';
import ServicesDetail from '@/components/home/ServicesDetail';
import AddOnServices from '@/components/home/AddOnServices';

// Dynamic imports for below-the-fold and animation-heavy components
const MarqueeStrip = dynamic(() => import('@/components/home/MarqueeStrip'), { ssr: false, loading: () => <div className="min-h-[200px]" /> });
const WhyChooseUs = dynamic(() => import('@/components/home/WhyChooseUs'), { ssr: true });
const HowWeWork = dynamic(() => import('@/components/home/HowWeWork'), { ssr: false, loading: () => <div className="min-h-[200px]" /> });
const PortfolioPreview = dynamic(() => import('@/components/home/PortfolioPreview'), { ssr: false, loading: () => <div className="min-h-[200px]" /> });
const Testimonials = dynamic(() => import('@/components/home/Testimonials'), { ssr: false, loading: () => <div className="min-h-[200px]" /> });
const HomeFAQ = dynamic(() => import('@/components/home/HomeFAQ'), { ssr: true });
const CTABanner = dynamic(() => import('@/components/home/CTABanner'), { ssr: false, loading: () => <div className="min-h-[200px]" /> });

export default function HomeContent() {
  return (
    <>
      <MarqueeStrip />
      <ServicesOverview />
      <WhyChooseUs />
      <HowWeWork />
      <ServicesDetail />
      <AddOnServices />
      <PortfolioPreview />
      <Testimonials />
      <HomeFAQ />
      <CTABanner />
    </>
  );
}
