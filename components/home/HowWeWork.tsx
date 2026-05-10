import { Search, Lightbulb, Rocket, TrendingUp } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import AnimatedSection, { StaggerContainer, StaggerItem } from '@/components/ui/AnimatedSection';

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Discovery Call',
    description: 'We learn about your business, goals, audience, and current challenges in a free consultation.',
  },
  {
    number: '02',
    icon: Lightbulb,
    title: 'Strategy Planning',
    description: 'We build a custom digital strategy tailored to your industry, budget, and growth goals.',
  },
  {
    number: '03',
    icon: Rocket,
    title: 'Build & Launch',
    description: 'Our team executes the plan — from design and development to campaigns and automation.',
  },
  {
    number: '04',
    icon: TrendingUp,
    title: 'Report & Optimize',
    description: 'We track results, share transparent reports, and continuously optimize for better performance.',
  },
];

export default function HowWeWork() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <SectionLabel className="mx-auto">Our Process</SectionLabel>
          <h2 className="text-3xl lg:text-5xl font-bold text-brand-textDark mt-2 mb-4">
            Simple. Clear. Effective.
          </h2>
          <p className="text-brand-textMid text-lg max-w-xl mx-auto">
            Our proven 4-step process ensures every project is delivered with clarity, quality, and results.
          </p>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting line — desktop only */}
          <div className="hidden lg:block absolute top-[52px] left-[12.5%] right-[12.5%] h-px border-t-2 border-dashed border-brand-blue/30 z-0" />

          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <StaggerItem key={step.number}>
                <div className="relative flex flex-col items-center text-center z-10">
                  {/* Faded number */}
                  <div className="text-7xl font-black text-brand-blue/10 leading-none mb-2 select-none">
                    {step.number}
                  </div>
                  {/* Icon node */}
                  <div className="w-14 h-14 rounded-full bg-brand-blue/10 border-2 border-brand-blue flex items-center justify-center -mt-4 mb-4 bg-white">
                    <Icon className="w-6 h-6 text-brand-blue" />
                  </div>
                  <h3 className="font-bold text-brand-textDark text-lg mb-2">{step.title}</h3>
                  <p className="text-brand-textMid text-sm leading-relaxed max-w-[200px]">{step.description}</p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
