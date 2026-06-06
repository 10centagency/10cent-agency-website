import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { CircleCheck as CheckCircle2, ChartBar as BarChart2, Monitor, Bot, Search, Palette, Share2, Clock, ChevronRight } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import AnimatedSection, { StaggerContainer, StaggerItem } from '@/components/ui/AnimatedSection';

// Dynamic imports for below-the-fold components
const CTABanner = dynamic(() => import('@/components/home/CTABanner'), { ssr: true });
const ServicesFAQ = dynamic(() => import('@/components/services/ServicesFAQ'), { ssr: true });

export const metadata: Metadata = {
  title: 'Our Services | 10 Cent Agency',
  description:
    'Explore our complete range of digital marketing services including Facebook marketing, website development, AI automation, SEO, and graphic design.',
  alternates: {
    canonical: 'https://www.10centagency.com/services',
  },
};

const mainServices = [
  {
    id: 'meta',
    image: '/services/facebook-marketing.jpg',
    slug: 'facebook-meta-marketing',
    number: '01',
    icon: BarChart2,
    title: 'Facebook & Meta Marketing',
    type: 'Monthly Retainer',
    description:
      'We create and manage high-performing Facebook and Instagram ad campaigns that bring real customers to your business. Using Meta\'s full advertising platform plus advanced tracking, every taka you spend works harder and delivers measurable returns.',
    features: [
      'Facebook and Instagram page setup and optimization',
      'Content creation in Bangla and English',
      'Ad campaign strategy and management',
      'Server-side tracking via Meta Conversions API',
      'Monthly performance reports with key insights',
      'Ad running costs included at no extra charge',
      'Audience research and targeting',
      'Retargeting campaigns for warm audiences',
    ],
  },
  {
    id: 'website',
    image: '/services/website-development.jpg',
    slug: 'website-development',
    number: '02',
    icon: Monitor,
    title: 'Website Development',
    type: 'One-time Project',
    description:
      'A great website is your most powerful sales tool. We build fast, professional, and fully optimized websites that convert visitors into loyal customers. From simple business sites to full e-commerce platforms — built for performance.',
    features: [
      'Business and personal websites',
      'E-commerce with bKash, Nagad, and card payments',
      'High-converting landing pages',
      'Full conversion tracking and analytics setup',
      'Mobile-first responsive design',
      'SEO-ready structure and page speed optimization',
      '1 month free post-delivery support',
      'Domain and hosting guidance',
    ],
  },
  {
    id: 'ai',
    image: '/services/ai-automation-chatbot.jpg',
    slug: 'ai-automation-chatbot',
    number: '03',
    icon: Bot,
    title: 'AI Automation & Chatbot (3 Days Free Trial)',
    type: 'One-time Setup',
    description:
      'Stop missing leads after business hours. Our AI-powered chatbots and automation workflows handle customer inquiries, generate leads, and manage orders around the clock — so you never lose a potential customer while you sleep.',
    features: [
      'Messenger, WhatsApp, and Telegram chatbots',
      'Facebook auto comment reply automation',
      'Lead generation and qualification workflows',
      'Order management and tracking automation',
      'Customer support automation',
      'Custom conversation flows for your business',
      'Integration with your existing tools',
      'Post-setup training and documentation',
    ],
  },
];

const addOnServices = [
  {
    id: 'social',
    slug: 'social-media-management',
    number: '04',
    icon: Share2,
    title: 'Social Media Management',
    type: 'Monthly Retainer',
    description:
      'Full monthly management of your social media presence. We handle content creation, scheduling, community management, and AI-powered engagement tools — keeping your brand active and growing.',
    features: [
      'Content calendar planning and execution',
      'Graphic creation for posts and stories',
      'Caption writing in Bangla and English',
      'Community management and comment replies',
      'AI-powered engagement automation',
      'Monthly performance reporting',
    ],
  },
  {
    id: 'seo',
    slug: 'seo',
    number: '05',
    icon: Search,
    title: 'Search Engine Optimization',
    type: 'Monthly Retainer',
    description:
      'Get found on Google when customers search for your products or services. We handle on-page SEO, technical optimization, and local SEO to improve your rankings and organic traffic.',
    features: [
      'Keyword research and strategy',
      'On-page SEO optimization',
      'Technical SEO audits and fixes',
      'Local SEO for Bangladesh businesses',
      'Google Business Profile optimization',
      'Monthly ranking and traffic reports',
    ],
  },
  {
    id: 'design',
    slug: 'graphic-design',
    number: '06',
    icon: Palette,
    title: 'Graphic Design',
    type: 'Project-based',
    description:
      'Professional visual identity and marketing materials that make your brand look polished and trustworthy. From logos to social media graphics — all designed with your brand in mind.',
    features: [
      'Logo design and brand identity',
      'Social media post templates',
      'Advertising banner and flyer design',
      'Business card and letterhead design',
      'Product packaging design',
      'Brand guideline creation',
    ],
  },
];

const comingSoon = [
  { icon: '🎬', title: 'Video Production' },
  { icon: '📸', title: 'Photography' },
  { icon: '▶️', title: 'YouTube Management' },
];

function ServiceSection({ service, reversed = false }: { service: typeof mainServices[0]; reversed?: boolean }) {
  const Icon = service.icon;
  return (
    <section id={service.id} className="scroll-mt-20 py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid lg:grid-cols-2 gap-12 items-start ${reversed ? 'lg:grid-flow-col-dense' : ''}`}>
          {/* Visual side */}
          <AnimatedSection
            variant="scaleIn"
            className={`${reversed ? 'lg:col-start-2' : ''} flex justify-center`}
          >
            <div className="w-full max-w-md rounded-3xl overflow-hidden border border-brand-border shadow-card">
              <Image
                src={service.image}
                alt={service.title}
                width={600}
                height={400}
                className="w-full h-auto object-cover"
              />
            </div>
          </AnimatedSection>

          {/* Text side */}
          <AnimatedSection variant={reversed ? 'slideRight' : 'slideLeft'} className={reversed ? 'lg:col-start-1' : ''}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-brand-blue" />
              </div>
              <span className="text-sm font-semibold text-brand-blue">
                {service.id === 'ai' ? 'AI Automation & Chatbot' : service.title}
              </span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-brand-textDark mb-4">{service.title}</h2>
            <p className="text-brand-textMid leading-relaxed mb-6">{service.description}</p>
            <ul className="space-y-3 mb-8">
              {service.features.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-blue flex-shrink-0 mt-0.5" />
                  <span className="text-brand-textMid text-sm">{f}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`/services/${service.slug}`}
                className="inline-flex items-center justify-center gap-2 border-2 border-brand-navy text-brand-navy font-semibold rounded-xl px-6 py-3 hover:bg-brand-navy hover:text-white transition-colors duration-200"
              >
                View Details
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-brand-navy text-white font-semibold rounded-xl px-6 py-3 hover:bg-brand-blue transition-colors duration-200"
              >
                {service.id === 'ai' ? 'Start Free Trial' : 'Get a Quote'}
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much do your services cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our pricing varies based on the service and your specific needs. We offer flexible packages for every budget — from one-time projects to monthly retainers. Contact us for a free consultation and custom quote tailored to your business goals.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need to pay for Facebook/Instagram ad costs separately?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. You pay Meta (Facebook) directly for your ad budget, and we manage the campaigns at no extra charge. You control the budget, and we make sure every taka is spent wisely.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does it take to build a website?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most websites are completed within 7-14 days, depending on complexity. E-commerce sites may take 14-21 days. We provide a clear timeline during our initial consultation.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can you help if I already have a website or social media page?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely. We can optimize, redesign, or take over management of your existing digital assets. Whether you need a refresh or ongoing support, we will work with what you have and make it better.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you provide content in Bangla and English?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. We create content in both Bangla and English to help you reach your target audience effectively. Our team understands the local market and can communicate your message in the language your customers prefer.',
      },
    },
    {
      '@type': 'Question',
      name: 'What if I need revisions or changes after the project is done?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'All website projects include 1 month of free support with up to 3-4 revision requests. For ongoing changes and updates, we offer affordable monthly maintenance packages.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you work with small businesses and startups?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. We specialize in helping small businesses and startups grow online. Our services are designed to be affordable and scalable — so you can start small and expand as your business grows.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I get started?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Simply contact us through our website, WhatsApp, or email. We will schedule a free consultation to understand your needs, discuss solutions, and provide a custom quote. No commitment required.',
      },
    },
  ],
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Digital Marketing Services',
  provider: {
    '@type': 'LocalBusiness',
    name: '10 Cent Agency',
    url: 'https://www.10centagency.com',
  },
  description: 'Complete digital marketing services including Facebook marketing, website development, AI automation, SEO, and graphic design for small businesses in Bangladesh.',
  areaServed: { '@type': 'Country', name: 'Bangladesh' },
  url: 'https://www.10centagency.com/services',
};

export default function ServicesPage() {
  return (
    <>
      {/* FAQ Schema */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* Service Schema */}
      <Script
        id="service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      {/* Hero */}
      <section className="bg-brand-bgAlt pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-brand-textMid mb-8">
            <Link href="/" className="hover:text-brand-blue transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-brand-textDark font-medium">Services</span>
          </div>
          <AnimatedSection className="max-w-3xl">
            <SectionLabel>Our Services</SectionLabel>
            <h1 className="text-4xl lg:text-6xl font-black text-brand-textDark mt-2 mb-5">
              Our Services
            </h1>
            <p className="text-brand-textMid text-xl leading-relaxed">
              A complete suite of digital services designed to grow your business — from social media to websites and AI automation.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Main services — alternating backgrounds */}
      {mainServices.map((service, i) => (
        <div key={service.id} className={i % 2 === 0 ? 'bg-brand-bg' : 'bg-white'}>
          <ServiceSection service={service} reversed={i % 2 !== 0} />
        </div>
      ))}

      {/* Add-on services */}
      <section className="bg-brand-bgAlt py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <SectionLabel className="mx-auto">Additional Services</SectionLabel>
            <h2 className="text-3xl lg:text-5xl font-bold text-brand-textDark mt-2 mb-4">
              More Ways We Can Help
            </h2>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {addOnServices.map((service) => {
              const Icon = service.icon;
              return (
                <StaggerItem key={service.id}>
                  <div id={service.id} className="bg-white rounded-2xl p-8 border border-brand-border shadow-card border-t-4 border-t-brand-blue h-full flex flex-col scroll-mt-20">
                    <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-brand-blue" />
                    </div>
                    <span className="text-xs font-semibold bg-brand-accent/40 text-brand-navy rounded-full px-3 py-0.5 mb-3 w-fit">
                      {service.type}
                    </span>
                    <h3 className="font-bold text-xl text-brand-textDark mb-3">{service.title}</h3>
                    <p className="text-brand-textMid text-sm leading-relaxed mb-4 flex-1">{service.description}</p>
                    <ul className="space-y-2 mb-6">
                      {service.features.map((f) => (
                        <li key={f} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-brand-blue flex-shrink-0 mt-0.5" />
                          <span className="text-brand-textMid text-xs">{f}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                      <Link
                        href={`/services/${service.slug}`}
                        className="text-brand-navy text-sm font-semibold hover:underline inline-flex items-center justify-center gap-1 border border-brand-navy rounded-lg px-4 py-2 hover:bg-brand-navy hover:text-white transition-colors duration-200"
                      >
                        View Details
                      </Link>
                      <Link
                        href="/contact"
                        className="text-white bg-brand-navy text-sm font-semibold rounded-lg px-4 py-2 hover:bg-brand-blue transition-colors duration-200 inline-flex items-center justify-center gap-1"
                      >
                        Get a Quote
                      </Link>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-10">
            <h3 className="text-2xl font-bold text-brand-textDark mb-2">Coming Soon</h3>
            <p className="text-brand-textMid">We are expanding our services. Stay tuned.</p>
          </AnimatedSection>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {comingSoon.map((item) => (
              <StaggerItem key={item.title}>
                <div className="bg-brand-bgAlt rounded-2xl p-6 border border-brand-border flex flex-col items-center text-center gap-3">
                  <Clock className="w-8 h-8 text-brand-blue/40" />
                  <h4 className="font-semibold text-brand-textDark">{item.title}</h4>
                  <span className="text-xs font-medium bg-brand-accent/30 text-brand-navy rounded-full px-3 py-1">
                    Coming Soon
                  </span>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* FAQ Section */}
      <ServicesFAQ />

      <CTABanner />
    </>
  );
}
