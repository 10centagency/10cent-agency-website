import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Youtube, Linkedin, Mail, Phone, MapPin, Clock } from 'lucide-react';

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

const services = [
  { label: 'Facebook & Meta Marketing', href: '/services/facebook-meta-marketing' },
  { label: 'Website Development', href: '/services/website-development' },
  { label: 'AI Automation & Chatbot', href: '/services/ai-automation-chatbot' },
  { label: 'Social Media Management', href: '/services/social-media-management' },
  { label: 'SEO', href: '/services/seo' },
  { label: 'Graphic Design', href: '/services/graphic-design' },
];

const socialLinks = [
  { icon: Facebook, href: 'https://www.facebook.com/10centagency', label: 'Facebook' },
  { icon: Instagram, href: 'https://www.instagram.com/10centagency', label: 'Instagram' },
  { icon: Youtube, href: 'https://www.youtube.com/@10centagency', label: 'YouTube' },
  { icon: Linkedin, href: 'https://www.linkedin.com/company/10-cent-agency', label: 'LinkedIn' },
];

export default function Footer() {
  return (
    <footer className="bg-brand-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Column 1: Brand */}
          <div>
             <Link href="/" className="inline-block mb-4">
               <Image
                 src="/10cent-agency-logo.webp"
                 alt="10 Cent Agency — Best Digital Marketing Agency in BD"
                 width={160}
                 height={40}
                 className="h-10 w-auto"
               />
             </Link>
            <p className="text-brand-accent italic text-sm font-medium mb-4">
              Professional | Affordable | Unstoppable
            </p>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              The best digital marketing agency in BD for small businesses — helping brands grow with social media marketing, website development, and AI automation.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white hover:text-brand-accent hover:bg-white/20 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-base mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 text-sm hover:text-brand-accent transition-colors duration-200 group flex items-center gap-2"
                  >
                    <span className="w-0 h-px bg-brand-accent transition-all duration-300 group-hover:w-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h3 className="text-white font-semibold text-base mb-5">Our Services</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.label}>
                  <Link
                    href={service.href}
                    className="text-white/60 text-sm hover:text-brand-accent transition-colors duration-200 group flex items-center gap-2"
                  >
                    <span className="w-0 h-px bg-brand-accent transition-all duration-300 group-hover:w-3" />
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-white font-semibold text-base mb-5">Contact Us</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:hello@10centagency.com"
                  className="flex items-start gap-3 text-white/60 text-sm hover:text-brand-accent transition-colors duration-200"
                >
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  hello@10centagency.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/8801615144114"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-white/60 text-sm hover:text-brand-accent transition-colors duration-200"
                >
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  +880 1615-144114
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-white/60 text-sm">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>East Monipur, Mirpur, Dhaka, Bangladesh-1216</span>
                </div>
              </li>
              <li>
                <div className="flex items-start gap-3 text-white/60 text-sm">
                  <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Saturday–Thursday, 10AM–9PM</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm">
            &copy; 2026 10 Cent Agency. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="text-white/50 text-sm hover:text-white/80 transition-colors">
              Privacy Policy
            </Link>
            <span className="text-white/30">|</span>
            <Link href="/terms-of-service" className="text-white/50 text-sm hover:text-white/80 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
