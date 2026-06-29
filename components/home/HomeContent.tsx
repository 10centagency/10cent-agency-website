'use client';

import dynamic from 'next/dynamic';

// Dynamic imports for below-the-fold and animation-heavy components
const MarqueeStrip = dynamic(() => import('@/components/home/MarqueeStrip'), { ssr: false, loading: () => <div className="min-h-[200px]" /> });
const ServicesOverview = dynamic(() => import('@/components/home/ServicesOverview'), { ssr: false, loading: () => <div className="min-h-[200px]" /> });
const WhyChooseUs = dynamic(() => import('@/components/home/WhyChooseUs'), { ssr: false, loading: () => <div className="min-h-[200px]" /> });
const HowWeWork = dynamic(() => import('@/components/home/HowWeWork'), { ssr: false, loading: () => <div className="min-h-[200px]" /> });
const ServicesDetail = dynamic(() => import('@/components/home/ServicesDetail'), { ssr: false, loading: () => <div className="min-h-[200px]" /> });
const AddOnServices = dynamic(() => import('@/components/home/AddOnServices'), { ssr: false, loading: () => <div className="min-h-[200px]" /> });
const PortfolioPreview = dynamic(() => import('@/components/home/PortfolioPreview'), { ssr: false, loading: () => <div className="min-h-[200px]" /> });
const Testimonials = dynamic(() => import('@/components/home/Testimonials'), { ssr: false, loading: () => <div className="min-h-[200px]" /> });
const HomeFAQ = dynamic(() => import('@/components/home/HomeFAQ'), { ssr: false, loading: () => <div className="min-h-[200px]" /> });
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
