'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { homeFaqs, HomeFaqItem } from './homeSectionsData';

export type { HomeFaqItem };
export { homeFaqs };

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
          {homeFaqs.map((faq, index) => (
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
                  openIndex === index ? 'max-h-[500px]' : 'max-h-0'
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
