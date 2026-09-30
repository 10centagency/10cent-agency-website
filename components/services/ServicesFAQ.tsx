'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import AnimatedSection from '@/components/ui/AnimatedSection';

const faqs = [
  {
    question: 'How much do your services cost?',
    answer:
      'Our pricing varies based on the service and your specific needs. We offer flexible packages for every budget — from one-time projects to monthly retainers. Contact us for a free consultation and custom quote tailored to your business goals.',
  },
  {
    question: 'Do I need to pay for Facebook/Instagram ad costs separately?',
    answer:
      'Yes. You pay Meta (Facebook) directly for your ad budget, and we manage the campaigns at no extra charge. This keeps things transparent — you control the budget, and we make sure every taka is spent wisely.',
  },
  {
    question: 'How long does it take to build a website?',
    answer:
      'Most websites are completed within 7-14 days, depending on complexity. E-commerce sites may take 14-21 days. We will give you a clear timeline during our initial consultation.',
  },
  {
    question: 'Can you help if I already have a website or social media page?',
    answer:
      'Absolutely! We can optimize, redesign, or take over management of your existing digital assets. Whether you need a refresh or ongoing support, we will work with what you have and make it better.',
  },
  {
    question: 'Do you provide content in Bangla and English?',
    answer:
      'Yes! We create content in both Bangla and English to help you reach your target audience effectively. Our team understands the local market and can communicate your message in the language your customers prefer.',
  },
  {
    question: 'What if I need revisions or changes after the project is done?',
    answer:
      'All our website projects include 1 month of free support with up to 3-4 revision requests. For ongoing changes and updates, we offer affordable monthly maintenance packages.',
  },
  {
    question: 'Do you work with small businesses and startups?',
    answer:
      'Yes! We specialize in helping small businesses and startups grow online. Our services are designed to be affordable and scalable — so you can start small and expand as your business grows.',
  },
  {
    question: 'How do I get started?',
    answer:
      'Simply contact us through our website, WhatsApp, or email. We will schedule a free consultation to understand your needs, discuss solutions, and provide a custom quote. No commitment required!',
  },
];

export default function ServicesFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-brand-bg py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <SectionLabel className="mx-auto">Frequently Asked Questions</SectionLabel>
          <h2 className="text-3xl lg:text-5xl font-bold text-brand-textDark mt-2 mb-4">
            Everything You Need to Know Before Getting Started
          </h2>
          <p className="text-brand-textMid text-lg">
            Have questions? We've got answers. If you don't see what you're looking for, feel free to reach out.
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
                aria-controls={`faq-answer-${index}`}
              >
                <span className="font-semibold text-brand-textDark pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-brand-blue flex-shrink-0 transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                id={`faq-answer-${index}`}
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
