'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import AnimatedSection from '@/components/ui/AnimatedSection';

const faqs = [
  {
    question: 'How much does digital marketing cost for a small business in Bangladesh?',
    answer:
      'At 10 Cent Agency, every package is custom-built around your business goals and budget. Whether you are a startup or an established SMB, we offer flexible plans from one-time projects to monthly retainers. Book a free consultation to get a transparent quote with zero hidden fees.',
  },
  {
    question: 'How soon can I expect results from digital marketing?',
    answer:
      'Facebook ad campaigns can generate leads and sales within the first 7 to 14 days. Website SEO typically takes 3 to 6 months to show significant results. AI chatbots start working from day one. We set realistic expectations upfront and share weekly updates so you always know what is happening.',
  },
  {
    question: 'How long does it take to build a website in Bangladesh?',
    answer:
      'At 10 Cent Agency, a business website is ready in 7 to 14 working days. Landing pages take 3 to 7 days. E-commerce stores with payment gateways like bKash, Nagad, and SSLCommerz take 14 to 21 days. We provide a clear timeline before starting and always deliver on time.',
  },
  {
    question: 'What is an AI chatbot and how can it help my business in Bangladesh?',
    answer:
      'An AI chatbot is a smart automated assistant that works 24/7 on Facebook Messenger, WhatsApp, and Telegram. It answers customer questions, captures leads, confirms orders, and books appointments even when you are offline. For Bangladesh businesses that rely on Messenger for sales, a chatbot can increase response speed by 10x and never miss a customer inquiry.',
  },
  {
    question: 'Do you work with brand new businesses that are just starting out?',
    answer:
      'Absolutely. Some of our best work has been helping businesses start from zero and build a strong digital presence from day one. Whether you need a Facebook page, a website, or a complete digital strategy, we will meet you exactly where you are.',
  },
  {
    question: 'What makes 10 Cent Agency different from other digital marketing agencies in Bangladesh?',
    answer:
      '10 Cent Agency offers enterprise-level strategy at a price built for small and medium businesses. We provide bilingual content in Bangla and English, dedicated support, transparent monthly reporting, and a genuine long-term growth partnership — not just project delivery.',
  },
  {
    question: 'How does the process work after I book a free consultation?',
    answer:
      'After your free 30-minute consultation, we analyze your business and send a clear proposal within 24 to 48 hours with exact deliverables, timeline, and pricing. No pressure, no confusing jargon. Once you approve, we start immediately and provide regular updates throughout.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept bKash, Nagad, Rocket, and bank transfer. For e-commerce website projects, we set up SSLCommerz so your customers can pay via bKash, Nagad, Rocket, debit, and credit cards directly on your website.',
  },
];

export default function HomeFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-brand-bgAlt py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <SectionLabel className="mx-auto">FAQ</SectionLabel>
          <h2 className="text-3xl lg:text-5xl font-bold text-brand-textDark mt-2 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-brand-textMid text-lg">
            Everything you need to know before getting started.
          </p>
        </AnimatedSection>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-brand-border overflow-hidden transition-all duration-200 hover:shadow-card"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors duration-200"
                aria-expanded={openIndex === index}
                aria-controls={`home-faq-answer-${index}`}
              >
                <span className="font-semibold text-brand-textDark pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-brand-blue flex-shrink-0 transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                id={`home-faq-answer-${index}`}
                className={`overflow-hidden transition-all duration-200 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-5 pt-0">
                  <p className="text-brand-textMid leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
