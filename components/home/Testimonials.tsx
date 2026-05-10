'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import AnimatedSection from '@/components/ui/AnimatedSection';

const testimonials = [
  {
    quote: '10 Cent Agency transformed our Facebook presence completely. Within 2 months, our restaurant saw a 3x increase in reach and table bookings through social media doubled. Their work is professional and the pricing is unbeatable.',
    name: 'Rakib Hossain',
    business: 'Local Restaurant Owner, Dhaka',
    initials: 'RH',
    rating: 5,
  },
  {
    quote: 'They built our e-commerce website exactly how we imagined — clean, fast, and with full payment integration for bKash and cards. The conversion rate has been amazing since launch. Highly recommend for any business going online.',
    name: 'Nusrat Jahan',
    business: 'Online Clothing Brand',
    initials: 'NJ',
    rating: 5,
  },
  {
    quote: 'The AI chatbot they built for our Messenger handles more than 80% of customer inquiries automatically. Our team can now focus on actual work instead of answering the same questions repeatedly. Game changer for our coaching center.',
    name: 'Tanvir Ahmed',
    business: 'Coaching Center, Mirpur',
    initials: 'TA',
    rating: 5,
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused]);

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

        <div
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Prev button */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 z-10 w-10 h-10 rounded-full bg-white border border-brand-border shadow-sm flex items-center justify-center hover:bg-brand-bgAlt transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5 text-brand-textDark" />
          </button>

          {/* Cards */}
          <div className="overflow-hidden px-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="bg-white rounded-3xl p-8 lg:p-12 shadow-card border border-brand-border"
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
                <p className="text-brand-textDark text-lg leading-relaxed italic mb-8">
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
            aria-label="Next"
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
