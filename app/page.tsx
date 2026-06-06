import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import HeroSection from '@/components/home/HeroSection';
import ServicesOverview from '@/components/home/ServicesOverview';

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
              "logo": "https://www.10centagency.com/Logo.png",
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
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "How much does digital marketing cost for a small business in Bangladesh?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "At 10 Cent Agency, every package is custom-built around your business goals and budget. Whether you are a startup or an established SMB, we offer flexible plans from one-time projects to monthly retainers. Book a free consultation to get a transparent quote with zero hidden fees."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How soon can I expect results from digital marketing?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Facebook ad campaigns can generate leads and sales within the first 7 to 14 days. Website SEO typically takes 3 to 6 months to show significant results. AI chatbots start working from day one. We set realistic expectations upfront and share weekly updates so you always know what is happening."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How long does it take to build a website in Bangladesh?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "At 10 Cent Agency, a business website is ready in 7 to 14 working days. Landing pages take 3 to 7 days. E-commerce stores with payment gateways like bKash, Nagad, and SSLCommerz take 14 to 21 days. We provide a clear timeline before starting and always deliver on time."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What is an AI chatbot and how can it help my business in Bangladesh?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "An AI chatbot is a smart automated assistant that works 24/7 on Facebook Messenger, WhatsApp, and Telegram. It answers customer questions, captures leads, confirms orders, and books appointments even when you are offline. For Bangladesh businesses that rely on Messenger for sales, a chatbot can increase response speed by 10x and never miss a customer inquiry."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Do you work with brand new businesses that are just starting out?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Absolutely. Some of our best work has been helping businesses start from zero and build a strong digital presence from day one. Whether you need a Facebook page, a website, or a complete digital strategy, we will meet you exactly where you are."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What makes 10 Cent Agency different from other digital marketing agencies in Bangladesh?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "10 Cent Agency offers enterprise-level strategy at a price built for small and medium businesses. We provide bilingual content in Bangla and English, dedicated support, transparent monthly reporting, and a genuine long-term growth partnership — not just project delivery."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How does the process work after I book a free consultation?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "After your free 30-minute consultation, we analyze your business and send a clear proposal within 24 to 48 hours with exact deliverables, timeline, and pricing. No pressure, no confusing jargon. Once you approve, we start immediately and provide regular updates throughout."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What payment methods do you accept?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We accept bKash, Nagad, Rocket, and bank transfer. For e-commerce website projects, we set up SSLCommerz so your customers can pay via bKash, Nagad, Rocket, debit, and credit cards directly on your website."
                  }
                }
              ]
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
