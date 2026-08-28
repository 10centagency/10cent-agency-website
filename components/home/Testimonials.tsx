'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import AnimatedSection from '@/components/ui/AnimatedSection';

const testimonials = [
  {
    quote:
      'We move cargo India to Bangladesh — Kolkata to Dhaka door-to-door, LC, LCL and FCL, plus customs on both sides. That is hard to explain in a Facebook post. 10 Cent Agency built a monthly calendar and started publishing clear service explainers in Bangla and English. Inbox inquiries are more regular now. I would still like more cargo-specific video, but the page finally looks like a real logistics company.',
    name: 'Abu Manjar',
    business: 'Proprietor, KD Cargo Service',
    initials: 'AM',
    rating: 4,
  },
  {
    quote:
      'Fabrinest is a Dubai interiors brand — curtains, blinds, sofa upholstery and custom furniture — with 16 years behind it. Our work is visual, and 10 Cent Agency matched that: a consistent feed, install and fabric Reels, and a tone that fits a premium showroom. Instagram and Google now look like the same company. Revisions come within two days and I do not chase posts anymore.',
    name: 'Kawser Rahman',
    business: 'Founder, Fabrinest Curtains',
    initials: 'KR',
    rating: 5,
  },
  {
    quote:
      'Velora is a modern Bangladeshi fashion brand — clothing and lifestyle, sold online. We needed more than blog posts. They built FAQ blocks, size-and-fabric snippets, and entity pages so we show up in search and in AI answers. Within the first quarter we won Featured Snippets on two collection queries, and a client forwarded a ChatGPT reply that named Velora. That’s the brief we hired them for.',
    name: 'Arif Mahmud',
    business: 'Founder & CEO, Velora Fashion',
    initials: 'AM',
    rating: 5,
  },
  {
    quote:
      'Nova is phones, accessories, and smart-home kits — if the catalog is wrong, the ad is wrong. 10 Cent Agency connected the pixel, cleaned the product feed, and started catalog ads plus remarketing instead of boosting random posts. Within the first month we could see which SKUs actually paid for the click. I still watch competitive phone launches week to week, but we are not advertising blind on Facebook anymore.',
    name: 'Fahim Hasan',
    business: 'Managing Director, Nova Electronics',
    initials: 'FH',
    rating: 5,
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  return (
    <section className="bg-brand-bg py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <SectionLabel className="mx-auto">Client Stories</SectionLabel>
          <h2 className="text-3xl lg:text-5xl font-bold text-brand-textDark mt-2">
            What Our Clients Say
          </h2>
        </AnimatedSection>

        <div className="relative max-w-4xl mx-auto">
          {/* Prev button */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 z-10 w-10 h-10 rounded-full bg-white border border-brand-border shadow-sm flex items-center justify-center hover:bg-brand-bgAlt transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5 text-brand-textDark" />
          </button>

          {/* Cards */}
          <div className="overflow-hidden px-2 flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="bg-white rounded-3xl p-6 sm:p-8 lg:p-12 shadow-card border border-brand-border min-h-[540px] sm:min-h-[500px] md:min-h-[460px] flex flex-col justify-between"
              >
                {/* Quote mark */}
                <div className="text-8xl font-serif text-brand-blue/20 leading-none mb-2 select-none h-12 flex items-start">
                  &ldquo;
                </div>
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                {/* Quote */}
                <p className="text-brand-textDark text-base sm:text-lg leading-relaxed italic mb-8 flex-1">
                  {testimonials[current].quote}
                </p>
                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-navy flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                    {testimonials[current].initials}
                  </div>
                  <div>
                    <div className="font-semibold text-brand-textDark">{testimonials[current].name}</div>
                    <div className="text-sm text-brand-textMid">{testimonials[current].business}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Next button */}
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 z-10 w-10 h-10 rounded-full bg-white border border-brand-border shadow-sm flex items-center justify-center hover:bg-brand-bgAlt transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5 text-brand-textDark" />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === current ? 'w-6 h-2.5 bg-brand-navy' : 'w-2.5 h-2.5 bg-brand-border hover:bg-brand-blue'
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
