import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, CheckCircle2 } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import AnimatedSection, { StaggerContainer, StaggerItem } from '@/components/ui/AnimatedSection';
import { Badge } from '@/components/ui/badge';
import CTABanner from '@/components/home/CTABanner';

export const metadata: Metadata = {
  title: 'AI Automation & Chatbot Services | 10 Cent Agency',
  description:
    'Smart assistants that work 24/7 — answering questions, collecting leads, processing orders, and following up automatically.',
  alternates: {
    canonical: 'https://www.10centagency.com/services/ai-automation-chatbot',
  },
  openGraph: {
    type: 'website',
    url: 'https://www.10centagency.com/services/ai-automation-chatbot',
    siteName: '10 Cent Agency',
    title: 'AI Automation & Chatbot Services | 10 Cent Agency',
    description:
      'Smart AI-powered chatbots for Messenger, WhatsApp, and Telegram. Automate leads, orders, and support 24/7.',
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
    title: 'AI Automation & Chatbot Services | 10 Cent Agency',
    description:
      'Smart AI-powered chatbots for Messenger, WhatsApp, and Telegram. Automate leads, orders, and support 24/7.',
    images: ['https://www.10centagency.com/og-image.png'],
  },
};

const subServices = [
  {
    name: 'AI Chatbot Setup',
    type: 'One-time Setup Fee',
    features: [
      'Platforms: Facebook Messenger, WhatsApp Business, Telegram',
      'Facebook post auto-comment reply with lead-to-DM conversion',
      '24/7 FAQ handling, lead capture, appointment booking',
      'Multilingual (Bangla & English), human handover trigger',
      'API cost: approx. $5-20/month (client pays directly to provider)',
    ],
  },
  {
    name: 'AI Automation Workflows (n8n)',
    type: 'One-time Setup + Optional Maintenance',
    features: [
      'Lead Generation — auto-capture from Facebook Ads, store in Sheets/CRM',
      'Order Management — auto confirm orders, generate invoices, notify team',
      'Customer Support — auto-respond, ticket tracking, satisfaction surveys',
      'Business Workflows — payment reminders, review requests, social cross-posting',
    ],
  },
];

export default function AIAutomationChatbotPage() {
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
            <span className="text-brand-textDark font-medium">AI Automation & Chatbot</span>
          </div>

          <AnimatedSection className="max-w-4xl">
            <h1 className="text-4xl lg:text-6xl font-black text-brand-textDark mb-6">
              AI Automation & Chatbot (3 Days Free Trial)
            </h1>
            <p className="text-brand-textMid text-xl leading-relaxed mb-8">
              Smart assistants that work 24/7 — answering questions, collecting leads, processing orders, and following up automatically. Powered by cutting-edge AI and n8n automation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center bg-brand-navy text-white font-semibold rounded-xl px-8 py-4 hover:bg-brand-blue transition-colors duration-200"
              >
                Start Free Trial
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
            <SectionLabel className="mx-auto">Core Service 03</SectionLabel>
            <h2 className="text-3xl lg:text-5xl font-bold text-brand-textDark mt-2 mb-4">
              AI Automation & Chatbot Services
            </h2>
            <p className="text-brand-textMid text-lg max-w-3xl mx-auto">
              Automate your customer interactions and business workflows with intelligent AI solutions.
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
