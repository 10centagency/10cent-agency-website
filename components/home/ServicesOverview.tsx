import Link from 'next/link';
import { ChartBar as BarChart2, Monitor, Bot, Calendar } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import { StaggerContainer, StaggerItem } from '@/components/ui/AnimatedSection';
import AnimatedSection from '@/components/ui/AnimatedSection';

const services = [
  {
    icon: BarChart2,
    title: 'Facebook & Meta Marketing',
    description: 'Drive real results with data-driven Facebook and Instagram campaigns. From ad creation to conversion tracking — we handle it all for your business growth.',
    tag: 'Monthly Retainer',
    href: '/services/facebook-meta-marketing',
  },
  {
    icon: Monitor,
    title: 'Website Development',
    description: 'Professional websites built to convert visitors into customers. E-commerce, landing pages, business sites — all optimized for performance and conversions.',
    tag: 'One-time Project',
    href: '/services/website-development',
  },
  {
    icon: Bot,
    title: 'AI Automation & Chatbot',
    description: 'Smart automation that works while you sleep. Messenger, WhatsApp, and Telegram chatbots that handle leads, orders, and customer support automatically.',
    tag: 'Free Trial Available',
    href: '/services/ai-automation-chatbot',
  },
  {
    icon: Calendar,
    title: 'Social Media Management',
    description: 'Full monthly management of your social media presence with AI-powered engagement tools, consistent content, and community management.',
    tag: 'Monthly Retainer',
    href: '/services/social-media-management',
  },
];

export default function ServicesOverview() {
  return (
    <section className="bg-brand-bgAlt py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <SectionLabel className="mx-auto">What We Do</SectionLabel>
          <h2 className="text-3xl lg:text-5xl font-bold text-brand-textDark mt-2 mb-4">
            Everything Your Business Needs to Win Online
          </h2>
          <p className="text-brand-textMid text-lg max-w-2xl mx-auto">
            From social media marketing to AI automation — one agency, every digital need your business has.
          </p>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <StaggerItem key={service.title}>
                <div className="group bg-white rounded-2xl p-8 shadow-card border border-brand-border border-t-4 border-t-brand-blue transition-all duration-300 hover:shadow-card-hover h-full flex flex-col">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-brand-blue" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-brand-textDark">{service.title}</h3>
                      <span className="inline-block mt-1 text-xs font-medium bg-brand-accent/40 text-brand-navy rounded-full px-3 py-0.5">
                        {service.tag}
                      </span>
                    </div>
                  </div>
                  <p className="text-brand-textMid text-sm leading-relaxed flex-1 mb-4">{service.description}</p>
                  <Link
                    href={service.href}
                    className="text-brand-blue text-sm font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    Learn More <span aria-hidden>→</span>
                  </Link>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        <AnimatedSection className="text-center mt-10 lg:mt-12">
          <Link
            href="/services"
            className="inline-flex items-center justify-center bg-brand-navy text-white font-medium rounded-xl px-8 py-4 shadow-[0_4px_24px_rgba(47,133,243,0.10)] hover:bg-brand-blue transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2"
            aria-label="Explore all services offered by 10 Cent Agency"
          >
            Explore All Services
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
