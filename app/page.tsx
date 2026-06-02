import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import MarqueeStrip from '@/components/home/MarqueeStrip';
import ServicesOverview from '@/components/home/ServicesOverview';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import HowWeWork from '@/components/home/HowWeWork';
import ServicesDetail from '@/components/home/ServicesDetail';
import AddOnServices from '@/components/home/AddOnServices';
import PortfolioPreview from '@/components/home/PortfolioPreview';
import Testimonials from '@/components/home/Testimonials';
import HomeFAQ from '@/components/home/HomeFAQ';
import CTABanner from '@/components/home/CTABanner';

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
              "@type": "Organization",
              "name": "10 Cent Agency",
              "url": "https://www.10centagency.com",
              "logo": "https://www.10centagency.com/Logo.png",
              "description": "Affordable digital marketing agency in BD helping small businesses grow online with Facebook ads, websites, and AI automation.",
              "foundingDate": "2026",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "East Monipur, Mirpur",
                "addressLocality": "Dhaka",
                "addressCountry": "BD",
                "postalCode": "1216"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+880-1615-144114",
                "contactType": "customer service",
                "availableLanguage": ["English", "Bengali"]
              },
              "sameAs": [
                "https://www.facebook.com/10centagency",
                "https://www.instagram.com/10centagency",
                "https://www.youtube.com/@10centagency",
                "https://www.linkedin.com/company/10-cent-agency"
              ]
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
