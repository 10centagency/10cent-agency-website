import HeroSection from '@/components/home/HeroSection';
import MarqueeStrip from '@/components/home/MarqueeStrip';
import ServicesOverview from '@/components/home/ServicesOverview';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import HowWeWork from '@/components/home/HowWeWork';
import ServicesDetail from '@/components/home/ServicesDetail';
import AddOnServices from '@/components/home/AddOnServices';
import PortfolioPreview from '@/components/home/PortfolioPreview';
import Testimonials from '@/components/home/Testimonials';
import CTABanner from '@/components/home/CTABanner';

export default function Home() {
  return (
    <>
      <HeroSection />
      <MarqueeStrip />
      <ServicesOverview />
      <WhyChooseUs />
      <HowWeWork />
      <ServicesDetail />
      <AddOnServices />
      <PortfolioPreview />
      <Testimonials />
      <CTABanner />
    </>
  );
}
