import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Rocket, Target, Heart, Handshake, Eye, TrendingUp, Users } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import AnimatedSection, { StaggerContainer, StaggerItem } from '@/components/ui/AnimatedSection';
import CTABanner from '@/components/home/CTABanner';
import Image from "next/image";

export const metadata: Metadata = {
  title: 'About Us | 10 Cent Agency',
  description:
    'Learn about 10 Cent Agency — a Bangladesh-based digital marketing agency built to serve small and medium businesses with professional, affordable services.',
  alternates: {
    canonical: 'https://www.10centagency.com/about',
  },
  openGraph: {
    type: 'website',
    url: 'https://www.10centagency.com/about',
    siteName: '10 Cent Agency',
    title: 'About Us | 10 Cent Agency',
    description: 'Learn about 10 Cent Agency — a Bangladesh-based digital marketing agency built to serve small and medium businesses with professional, affordable services.',
    images: [{ url: 'https://www.10centagency.com/og-image.png', width: 1200, height: 630, alt: '10 Cent Agency' }],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | 10 Cent Agency',
    description: 'Learn about 10 Cent Agency — a Bangladesh-based digital marketing agency built to serve small and medium businesses.',
  },
};

const values = [
  {
    icon: Heart,
    title: 'Quality',
    description: 'We never cut corners. Every deliverable is crafted to the highest standard, regardless of project size.',
  },
  {
    icon: Handshake,
    title: 'Partnership',
    description: 'We treat every client as a long-term partner, not just a transaction. Your success is our success.',
  },
  {
    icon: Eye,
    title: 'Clarity',
    description: 'Transparent pricing, honest communication, and clear reporting — always. No surprises, ever.',
  },
  {
    icon: TrendingUp,
    title: 'Growth',
    description: 'Everything we do is focused on one thing: growing your business in measurable, sustainable ways.',
  },
  {
    icon: Users,
    title: 'Care',
    description: 'We genuinely care about the businesses we work with and the communities they serve in Bangladesh.',
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-brand-bgAlt pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-brand-textMid mb-8">
            <Link href="/" className="hover:text-brand-blue transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-brand-textDark font-medium">About</span>
          </div>
          <AnimatedSection className="max-w-3xl">
            <SectionLabel>About Us</SectionLabel>
            <h1 className="text-4xl lg:text-6xl font-black text-brand-textDark mt-2 mb-5">
              About 10 Cent Agency
            </h1>
            <p className="text-brand-textMid text-xl leading-relaxed">
              Learn about 10 Cent Agency — a Bangladesh-based digital marketing agency built to serve small and medium businesses with professional, affordable services.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Visual */}
            <AnimatedSection variant="scaleIn">
  <div className="relative">
    <div className="relative rounded-3xl aspect-[4/3] overflow-hidden border border-brand-border">
      <Image
        src="/about-agency.jpg"
        alt="Why We Built 10 Cent Agency"
        fill
        className="object-cover"
        priority
      />
    </div>

    <div className="absolute -bottom-4 -right-4 bg-brand-navy text-white rounded-2xl p-5 shadow-xl">
      <div className="text-3xl font-black">20+</div>
      <div className="text-xs text-white/70">Happy Clients</div>
    </div>
  </div>
</AnimatedSection>

            {/* Story text */}
            <AnimatedSection variant="slideRight">
              <SectionLabel>Our Story</SectionLabel>
              <h2 className="text-3xl lg:text-4xl font-bold text-brand-textDark mt-2 mb-5">
                Why We Built 10 Cent Agency
              </h2>
              <div className="space-y-4 text-brand-textMid leading-relaxed">
                <p>
                  We started 10 Cent Agency with a simple but powerful observation: the small businesses and entrepreneurs in Bangladesh who needed digital marketing the most were consistently priced out of getting it.
                </p>
                <p>
                  Large agencies charge large prices — built for corporations, not corner shops. We built something different. A professional agency that combines real expertise with pricing that actually makes sense for growing businesses.
                </p>
                <p>
                  From Mirpur to Mohammadpur, from Chattogram to Sylhet — we have worked with restaurants, clothing brands, coaching centers, and dozens of other local businesses to build digital presences that genuinely move the needle.
                </p>
                <p>
                  Today, we are a focused team of specialists in Facebook marketing, web development, and AI automation. But our mission has never changed: help every business — regardless of size or budget — compete and win online.
                </p>
              </div>

              {/* Blockquote */}
              <blockquote className="mt-8 pl-5 border-l-4 border-brand-blue">
                <p className="text-brand-textDark font-medium text-lg italic leading-relaxed">
                  &ldquo;The businesses that need digital marketing the most are often the ones who can afford it the least.&rdquo;
                </p>
                <footer className="mt-2 text-brand-textMid text-sm">— Founder, 10 Cent Agency</footer>
              </blockquote>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-brand-bgAlt py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <SectionLabel className="mx-auto">What Drives Us</SectionLabel>
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-textDark mt-2">
              Mission & Vision
            </h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <AnimatedSection delay={0}>
              <div className="bg-brand-navy text-white rounded-2xl p-8 h-full">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-5">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Our Mission</h3>
                <p className="text-white/70 leading-relaxed">
                  To make professional digital marketing accessible and affordable for every small and medium business in Bangladesh — delivering real results that drive real growth.
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.15}>
              <div className="bg-brand-bg rounded-2xl p-8 border border-brand-border shadow-card h-full">
                <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center mb-5">
                  <Target className="w-6 h-6 text-brand-blue" />
                </div>
                <h3 className="text-xl font-bold text-brand-textDark mb-3">Our Vision</h3>
                <p className="text-brand-textMid leading-relaxed">
                  To become Bangladesh&rsquo;s most trusted digital marketing partner for growing businesses — known for exceptional quality, complete transparency, and outcomes that exceed expectations.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <SectionLabel className="mx-auto">Our Principles</SectionLabel>
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-textDark mt-2">
              Core Values
            </h2>
          </AnimatedSection>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <StaggerItem key={value.title}>
                  <div className="bg-brand-bgAlt rounded-2xl p-6 border border-brand-border text-center h-full">
                    <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-brand-blue" />
                    </div>
                    <h4 className="font-bold text-brand-textDark mb-2">{value.title}</h4>
                    <p className="text-brand-textMid text-xs leading-relaxed">{value.description}</p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

     {/* Founder section */}
<section className="bg-brand-bgAlt py-16 lg:py-20">
  <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <AnimatedSection>
      <SectionLabel className="mx-auto">A Personal Note</SectionLabel>

      <div className="mt-8 flex justify-center">
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-brand-navy shadow-[0_8px_20px_rgba(0,52,109,0.15)]">
          <Image
            src="/founder.jpg"
            alt="Founder of 10 Cent Agency"
            fill
            className="object-cover object-center"
            sizes="96px"
            priority
          />
        </div>
      </div>

      {/* Name: Bold */}
      <h3 className="text-xl font-bold text-brand-textDark mt-6">
        Md Al Amin
      </h3>

      {/* Founder: Normal/Regular weight */}
      <p className="text-brand-textDark text-base font-normal">
        Founder of 10 Cent Agency
      </p>

      {/* Location */}
      <p className="text-brand-textMid text-sm mt-1">
        Mirpur, Dhaka, Bangladesh
      </p>

      <blockquote className="mt-8 text-brand-textDark text-lg leading-relaxed italic max-w-2xl mx-auto">
        &ldquo;I started this agency because I kept seeing brilliant business owners struggle to grow online — not because of lack of effort, but because of lack of access to the right help at the right price. 10 Cent Agency is my answer to that problem. Every day, we work to make sure that your business gets the digital presence it deserves.&rdquo;
      </blockquote>
    </AnimatedSection>
  </div>
</section>

      {/* CTA */}
      <section className="bg-white py-12 text-center">
        <AnimatedSection>
          <h2 className="text-3xl font-bold text-brand-textDark mb-4">Ready to Work With Us?</h2>
          <p className="text-brand-textMid mb-8">Let&rsquo;s build something great for your business together.</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-brand-navy text-white font-semibold rounded-xl px-8 py-4 hover:bg-brand-blue transition-colors duration-200"
          >
            Work With Us
          </Link>
        </AnimatedSection>
      </section>

      <CTABanner />
    </>
  );
}
