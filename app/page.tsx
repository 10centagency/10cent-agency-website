import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import HeroSection from '@/components/home/HeroSection';
import ServicesOverview from '@/components/home/ServicesOverview';
import { homeFaqs } from '@/components/home/homeSectionsData';

// Dynamic imports for below-the-fold and animation-heavy components
const MarqueeStrip = dynamic(() => import('@/components/home/MarqueeStrip'), { ssr: true });
const WhyChooseUs = dynamic(() => import('@/components/home/WhyChooseUs'), { ssr: true });
const HowWeWork = dynamic(() => import('@/components/home/HowWeWork'), { ssr: true });
const ServicesDetail = dynamic(() => import('@/components/home/ServicesDetail'), { ssr: true });
const AddOnServices = dynamic(() => import('@/components/home/AddOnServices'), { ssr: true });
const PortfolioPreview = dynamic(() => import('@/components/home/PortfolioPreview'), { ssr: true });
const Testimonials = dynamic(() => import('@/components/home/Testimonials'), { ssr: true });
const HomeFAQ = dynamic(() => import('@/components/home/HomeFAQ'), { ssr: true });
const CTABanner = dynamic(() => import('@/components/home/CTABanner'), { ssr: true });

export const metadata: Metadata = {
  title: "10 Cent Agency | Best Digital Marketing Agency in BD",
  description:
    "Affordable digital marketing agency in BD helping small businesses grow online with Facebook ads, websites & AI automation. Get a free consultation today!",
  keywords: [
    "digital marketing agency in bd",
    "best digital marketing agency in bd",
    "digital marketing agency for small business",
    "social media marketing agency Bangladesh",
  ],
  alternates: {
    canonical: "https://www.10centagency.com/",
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "10 Cent Agency",
              "url": "https://www.10centagency.com",
              "logo": "https://www.10centagency.com/Logo.webp",
              "image": "https://www.10centagency.com/og-image.png",
              "description": "Affordable digital marketing agency in Bangladesh helping small businesses grow online with Facebook ads, websites & AI automation.",
              "telephone": "+8801615144114",
              "email": "hello@10centagency.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "East Monipur, Mirpur",
                "addressLocality": "Dhaka",
                "postalCode": "1216",
                "addressCountry": "BD"
              },
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Saturday","Sunday","Monday","Tuesday","Wednesday","Thursday"],
                  "opens": "10:00",
                  "closes": "21:00"
                }
              ],
              "sameAs": [
                "https://www.facebook.com/10centagency",
                "https://www.instagram.com/10centagency",
                "https://www.youtube.com/@10centagency",
                "https://www.linkedin.com/company/10-cent-agency"
              ],
              "priceRange": "৳৳"
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": homeFaqs.map((faq) => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.answer
                }
              }))
            }
          ])
        }}
      />
      <HeroSection />
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
