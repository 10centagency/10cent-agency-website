import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Mail, Phone, MapPin, Clock, Facebook, Instagram, Youtube, Linkedin, Calendar } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import AnimatedSection from '@/components/ui/AnimatedSection';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with 10 Cent Agency. Book a free consultation for Facebook marketing, website development, or AI automation services.',
};

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@10centagency.com',
    href: 'mailto:hello@10centagency.com',
  },
  {
    icon: Phone,
    label: 'WhatsApp',
    value: '+880 1615-144114',
    href: 'https://wa.me/8801615144114',
    external: true,
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'East Monipur, Mirpur, Dhaka, Bangladesh-1216',
    href: null,
  },
  {
    icon: Clock,
    label: 'Hours',
    value: 'Saturday–Thursday, 10AM–9PM',
    href: null,
  },
];

const socialLinks = [
  { icon: Facebook, href: 'https://www.facebook.com/10centagency', label: 'Facebook' },
  { icon: Instagram, href: 'https://www.instagram.com/10centagency', label: 'Instagram' },
  { icon: Youtube, href: 'https://www.youtube.com/@10centagency', label: 'YouTube' },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-brand-bgAlt pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-brand-textMid mb-8">
            <Link href="/" className="hover:text-brand-blue transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-brand-textDark font-medium">Contact</span>
          </div>
          <AnimatedSection className="max-w-2xl">
            <SectionLabel>Get In Touch</SectionLabel>
            <h1 className="text-4xl lg:text-6xl font-black text-brand-textDark mt-2 mb-5">
              Contact Us
            </h1>
            <p className="text-brand-textMid text-xl leading-relaxed">
              Book a free consultation and let us show you how we can grow your business online.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact section */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left: info */}
            <AnimatedSection variant="slideLeft">
              <h2 className="text-2xl lg:text-3xl font-bold text-brand-textDark mb-4">
                Let&rsquo;s Talk About Your Business
              </h2>
              <p className="text-brand-textMid leading-relaxed mb-8">
                Whether you are looking to grow on social media, launch a new website, or automate your customer interactions — we would love to hear about your goals and show you exactly how we can help. No pressure, no obligation.
              </p>

              {/* Contact info */}
              <div className="space-y-5 mb-8">
                {contactInfo.map((item) => {
                  const Icon = item.icon;
                  const content = (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-brand-blue" />
                      </div>
                      <div>
                        <div className="text-xs text-brand-textMid font-medium mb-0.5">{item.label}</div>
                        <div className="text-brand-textDark font-medium text-sm">{item.value}</div>
                      </div>
                    </div>
                  );

                  if (item.href) {
                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        target={item.external ? '_blank' : undefined}
                        rel={item.external ? 'noopener noreferrer' : undefined}
                        className="block hover:opacity-80 transition-opacity"
                      >
                        {content}
                      </a>
                    );
                  }
                  return <div key={item.label}>{content}</div>;
                })}
              </div>

              {/* Social */}
              <div className="mb-8">
                <p className="text-sm text-brand-textMid font-medium mb-3">Follow Us</p>
                <div className="flex items-center gap-3">
                  {socialLinks.map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      aria-label={label}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-brand-bgAlt border border-brand-border flex items-center justify-center text-brand-textMid hover:text-brand-blue hover:border-brand-blue transition-all duration-200"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Book a Free Consultation */}
              <div className="bg-brand-bgAlt border border-brand-border rounded-2xl p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-brand-blue" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-brand-textDark mb-2">
                      Book a Free Consultation
                    </h3>
                    <p className="text-brand-textMid text-sm leading-relaxed">
                      Schedule a 30-minute one-on-one call with our team — no pressure, just a conversation.
                    </p>
                  </div>
                </div>
                <a
                  href="https://calendly.com/10centagency/free-consultation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full bg-brand-blue text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-blue/90 transition-colors duration-200"
                >
                  Book Your Free Call →
                </a>
              </div>
            </AnimatedSection>

            {/* Right: form */}
            <AnimatedSection variant="slideRight">
              <ContactForm />
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  );
}
