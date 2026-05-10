import { Search, Palette, Share2 } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import AnimatedSection, { StaggerContainer, StaggerItem } from '@/components/ui/AnimatedSection';

const addOns = [
  {
    icon: Search,
    title: 'Search Engine Optimization',
    description: 'Get found on Google with on-page and local SEO optimization. Rank for keywords your customers are searching for.',
    tag: 'SEO',
    href: '/services#seo',
  },
  {
    icon: Palette,
    title: 'Graphic Design',
    description: 'Logos, social media graphics, banners, and marketing materials — all designed to reflect your brand professionally.',
    tag: 'Design',
    href: '/services#design',
  },
  {
    icon: Share2,
    title: 'Social Media Management',
    description: 'Full monthly management with AI-powered engagement tools, consistent posting, and community management for your brand.',
    tag: 'Management',
    href: '/services#social',
  },
];

export default function AddOnServices() {
  return (
    <section className="bg-brand-bgAlt py-16 lg:py-24" id="social">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <SectionLabel className="mx-auto">Additional Services</SectionLabel>
          <h2 className="text-3xl lg:text-5xl font-bold text-brand-textDark mt-2 mb-4">
            More Ways We Can Help
          </h2>
          <p className="text-brand-textMid text-lg max-w-xl mx-auto">
            Complement your core marketing strategy with these powerful add-on services.
          </p>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {addOns.map((service) => {
            const Icon = service.icon;
            return (
              <StaggerItem key={service.title}>
                <div className="group bg-white rounded-2xl p-8 shadow-card border border-brand-border border-t-4 border-t-brand-blue hover:-translate-y-2 transition-all duration-300 hover:shadow-card-hover h-full flex flex-col">
                  <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-brand-blue" />
                  </div>
                  <span className="text-xs font-semibold bg-brand-accent/40 text-brand-navy rounded-full px-3 py-0.5 mb-3 w-fit">
                    {service.tag}
                  </span>
                  <h3 className="font-bold text-lg text-brand-textDark mb-3">{service.title}</h3>
                  <p className="text-brand-textMid text-sm leading-relaxed flex-1">{service.description}</p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
