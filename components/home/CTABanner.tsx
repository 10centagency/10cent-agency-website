import Link from 'next/link';
import AnimatedSection from '@/components/ui/AnimatedSection';

export default function CTABanner() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="relative rounded-3xl overflow-hidden">
            {/* Glow */}
            <div className="absolute inset-0 bg-brand-blue/20 blur-3xl scale-95" />
            {/* Gradient bg */}
            <div
              className="relative rounded-3xl p-10 lg:p-16 text-center overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #00346D 0%, #2F85F3 100%)' }}
            >
              {/* Decorative rings */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border-2 border-white opacity-[0.04] pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border-2 border-white opacity-[0.06] pointer-events-none" />

              <h2 className="text-3xl lg:text-5xl font-black text-white mb-5">
                Ready to Grow Your Business Online?
              </h2>
              <p className="text-white/80 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                Let us build a smarter, stronger digital presence for your brand. Book a free consultation today — no commitment required.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center bg-white text-brand-navy font-semibold rounded-xl px-8 py-4 hover:bg-brand-accent transition-colors duration-200"
                >
                  Book Free Consultation
                </Link>
                <a
                  href="https://wa.me/8801410244114"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center border-2 border-white text-white font-semibold rounded-xl px-8 py-4 hover:bg-white/10 transition-colors duration-200"
                >
                  Chat on WhatsApp
                </a>
              </div>

              <p className="text-white/60 text-sm">hello@10centagency.com</p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
