import { Search, Lightbulb, Code2, Rocket, TrendingUp } from 'lucide-react';
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
    title: 'Strategy & Proposal',
    description: 'We build a custom strategy and a transparent, itemized proposal — tailored to your industry, budget, and growth goals.',
  },
  {
    number: '03',
    icon: Code2,
    title: 'Build / Setup',
    description: 'Our team executes the plan — design, development, campaign setup, and content production.',
  },
  {
    number: '04',
    icon: Rocket,
    title: 'Launch & Optimize',
    description: 'Your project goes live with real-time monitoring and quick, data-driven iteration.',
  },
  {
    number: '05',
    icon: TrendingUp,
    title: 'Report & Scale',
    description: "We track results, share plain-language reports, and scale what's working month after month.",
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
            Our proven 5-step process ensures every project is delivered with clarity, quality, and results.
          </p>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 relative">
          {/* Connecting line — desktop only */}
          <div className="hidden lg:block absolute top-[52px] left-[10%] right-[10%] h-px border-t-2 border-dashed border-brand-blue/30 z-0" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <StaggerItem
                key={step.number}
                className={index === 4 ? 'md:col-span-2 lg:col-span-1' : ''}
              >
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
                  <p className="text-brand-textMid text-sm leading-relaxed max-w-[180px]">{step.description}</p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
