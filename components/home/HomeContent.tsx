import dynamic from 'next/dynamic';
import ServicesOverview from '@/components/home/ServicesOverview';
import ServicesDetail from '@/components/home/ServicesDetail';
import AddOnServices from '@/components/home/AddOnServices';
import MissionVision from '@/components/home/MissionVision';
import MadeForBangladesh from '@/components/home/MadeForBangladesh';
import type { HomeBlogPost } from '@/lib/blog';

// Dynamic imports for below-the-fold and animation-heavy components
const MarqueeStrip = dynamic(() => import('@/components/home/MarqueeStrip'), { ssr: true });
const WhyChooseUs = dynamic(() => import('@/components/home/WhyChooseUs'), { ssr: true });
const HowWeWork = dynamic(() => import('@/components/home/HowWeWork'), { ssr: true });
const PortfolioPreview = dynamic(() => import('@/components/home/PortfolioPreview'), { ssr: true });
const Testimonials = dynamic(() => import('@/components/home/Testimonials'), { ssr: true });
const BlogPreview = dynamic(() => import('@/components/home/BlogPreview'), { ssr: true });
const HomeFAQ = dynamic(() => import('@/components/home/HomeFAQ'), { ssr: true });
const CTABanner = dynamic(() => import('@/components/home/CTABanner'), { ssr: true });

interface HomeContentProps {
  blogPosts?: HomeBlogPost[];
}

export default function HomeContent({ blogPosts = [] }: HomeContentProps) {
  return (
    <>
      <MarqueeStrip />
      <ServicesOverview />
      <WhyChooseUs />
      <HowWeWork />
      <ServicesDetail />
      <AddOnServices />
      <MissionVision />
      <MadeForBangladesh />
      <PortfolioPreview />
      <Testimonials />
      <BlogPreview posts={blogPosts} />
      <HomeFAQ />
      <CTABanner />
    </>
  );
}
