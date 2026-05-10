'use client';

import Link from 'next/link';
import { BadgeDollarSign, Eye, ChartLine as LineChart, Languages } from 'lucide-react';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import SectionLabel from '@/components/ui/SectionLabel';
import AnimatedSection, { StaggerContainer, StaggerItem } from '@/components/ui/AnimatedSection';

const features = [
  {
    icon: BadgeDollarSign,
    title: 'Affordable Professional Quality',
    description: 'Enterprise-level strategies and execution at prices that work for small and growing businesses.',
  },
  {
    icon: Eye,
    title: 'Full Transparency',
    description: 'Clear reporting, honest communication, and zero hidden fees — always know exactly what we are doing.',
  },
  {
    icon: LineChart,
    title: 'Tracking & Analytics Focused',
    description: 'Every campaign is built around data. We track what matters and optimize for real, measurable growth.',
  },
  {
    icon: Languages,
    title: 'English & Bangla Content',
    description: 'We create content in both languages to connect authentically with your local and global audience.',
  },
];

const stats = [
  { value: 20, suffix: '+', label: 'Projects Completed' },
  { value: 100, suffix: '%', label: 'Delivery Rate' },
  { value: 3, suffix: '', label: 'Core Services' },
  { value: 24, suffix: '/7', label: 'Support' },
];

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1500;
    const step = 16;
    const increment = target / (duration / step);

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, step);

    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref} className="text-5xl font-black text-brand-navy">
      {count}{suffix}
    </span>
  );
}

export default function WhyChooseUs() {
  return (
    <section className="bg-brand-bg py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-16">
          {/* Left */}
          <AnimatedSection>
            <SectionLabel>Why 10 Cent Agency</SectionLabel>
            <h2 className="text-3xl lg:text-5xl font-bold text-brand-textDark mt-2 mb-5">
              The Smart Choice for Growing Businesses
            </h2>
            <p className="text-brand-textMid text-base leading-relaxed mb-8">
              We built 10 Cent Agency for one reason: to make professional digital marketing accessible to every business, regardless of size or budget. No fluff, no overpricing — just results.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 border-2 border-brand-navy text-brand-navy font-semibold rounded-xl px-6 py-3 hover:bg-brand-navy hover:text-white transition-all duration-200"
            >
              See How We Work
            </Link>
          </AnimatedSection>

          {/* Right: Features */}
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <StaggerItem key={feature.title}>
                  <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-card h-full">
                    <div className="w-11 h-11 rounded-xl bg-brand-blue/10 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-brand-blue" />
                    </div>
                    <h4 className="font-semibold text-brand-textDark mb-2">{feature.title}</h4>
                    <p className="text-brand-textMid text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>

        {/* Stats row */}
        <AnimatedSection>
          <div className="bg-white rounded-2xl border border-brand-border shadow-card py-8 px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <div key={stat.label} className={`text-center ${i < stats.length - 1 ? 'lg:border-r lg:border-brand-border' : ''}`}>
                  <div className="mb-2">
                    <CountUp target={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-sm text-brand-textMid">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
