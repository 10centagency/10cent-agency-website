import Link from 'next/link';
import { CircleCheck as CheckCircle2, ChartBar as BarChart2, Monitor, Bot } from 'lucide-react';
import AnimatedSection from '@/components/ui/AnimatedSection';

const metaFeatures = [
  'Page setup and optimization',
  'Content creation in Bangla and English',
  'Ad campaign management',
  'Server-side tracking (Conversions API)',
  'Monthly performance reports',
  'Ad running included at no extra charge',
];

const websiteFeatures = [
  'Business and personal websites',
  'E-commerce with bKash, Nagad, and card payments',
  'High-converting landing pages',
  'Full conversion tracking setup',
  '1 month free post-delivery support',
];

const aiFeatures = [
  'Messenger, WhatsApp, and Telegram chatbots',
  'Facebook auto comment reply',
  'Lead generation automation',
  'Order management workflows',
  'Customer support automation',
];

function FeatureList({ features }: { features: string[] }) {
  return (
    <ul className="space-y-3">
      {features.map((f) => (
        <li key={f} className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-brand-blue flex-shrink-0 mt-0.5" />
          <span className="text-brand-textMid text-sm">{f}</span>
        </li>
      ))}
    </ul>
  );
}

function PhoneMockup() {
  return (
    <div className="relative w-64 mx-auto">
      <div className="bg-gradient-to-br from-brand-blue to-brand-navy rounded-[2.5rem] p-3 shadow-2xl">
        <div className="bg-white rounded-[2rem] overflow-hidden">
          <div className="bg-[#1877F2] px-4 py-3 text-white text-xs font-semibold">Facebook Ads Manager</div>
          <div className="p-3 space-y-2">
            <div className="bg-brand-bgAlt rounded-lg p-2">
              <div className="text-xs text-brand-textMid mb-1">Campaign Reach</div>
              <div className="text-lg font-bold text-brand-navy">24,500+</div>
              <div className="flex gap-1 mt-2 items-end h-8">
                {[30, 55, 40, 70, 60, 85, 75].map((h, i) => (
                  <div key={i} className="flex-1 bg-brand-blue/40 rounded-sm" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs text-green-700 font-medium">Campaign Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LaptopMockup() {
  return (
    <div className="relative w-72 mx-auto">
      <div className="bg-brand-navy rounded-xl p-3 shadow-2xl">
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="flex items-center gap-1.5 bg-brand-bgAlt px-3 py-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
            <div className="flex-1 bg-white rounded mx-2 px-2 py-0.5 text-[10px] text-brand-textMid truncate">www.client.com</div>
          </div>
          <div className="p-3 space-y-2">
            <div className="h-6 bg-brand-navy rounded w-3/4" />
            <div className="h-2 bg-brand-blue/20 rounded w-full" />
            <div className="h-2 bg-brand-blue/15 rounded w-5/6" />
            <div className="grid grid-cols-3 gap-1 mt-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-brand-bgAlt rounded" />
              ))}
            </div>
            <div className="h-8 bg-brand-blue rounded-lg" />
          </div>
        </div>
      </div>
      <div className="bg-brand-navy h-3 rounded-b-xl mx-4" />
      <div className="bg-brand-textMid h-1.5 rounded-b-lg mx-8" />
    </div>
  );
}

function ChatMockup() {
  return (
    <div className="relative w-64 mx-auto">
      <div className="bg-gradient-to-br from-brand-accent to-brand-blue/30 rounded-2xl p-4 shadow-xl border border-brand-border">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-brand-border">
          <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-xs font-semibold text-brand-textDark">AI Assistant</div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-[10px] text-brand-textMid">Online</span>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="w-6 h-6 rounded-full bg-brand-blue/20 flex items-center justify-center flex-shrink-0">
              <Bot className="w-3 h-3 text-brand-blue" />
            </div>
            <div className="bg-white rounded-xl rounded-tl-sm px-3 py-2 text-xs text-brand-textDark max-w-[140px] shadow-sm">
              Hi! How can I help you today?
            </div>
          </div>
          <div className="flex gap-2 flex-row-reverse">
            <div className="w-6 h-6 rounded-full bg-brand-navy flex items-center justify-center flex-shrink-0 text-white text-[9px] font-bold">
              U
            </div>
            <div className="bg-brand-navy rounded-xl rounded-tr-sm px-3 py-2 text-xs text-white max-w-[140px] shadow-sm">
              I want to place an order
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-6 h-6 rounded-full bg-brand-blue/20 flex items-center justify-center flex-shrink-0">
              <Bot className="w-3 h-3 text-brand-blue" />
            </div>
            <div className="bg-white rounded-xl rounded-tl-sm px-3 py-2 text-xs text-brand-textDark max-w-[140px] shadow-sm">
              Sure! What would you like to order?
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServicesDetail() {
  return (
    <div>
      {/* Row 1: Meta Marketing */}
      <section id="meta" className="bg-brand-bg py-16 lg:py-24 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <AnimatedSection variant="scaleIn" className="flex justify-center">
              <PhoneMockup />
            </AnimatedSection>
            <AnimatedSection variant="slideRight">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center">
                  <BarChart2 className="w-5 h-5 text-brand-blue" />
                </div>
                <span className="text-sm font-semibold text-brand-blue">Facebook & Meta Marketing</span>
              </div>
              <h3 className="text-2xl lg:text-3xl font-semibold text-brand-textDark mb-4">
                Facebook & Instagram Marketing That Drives Real Results
              </h3>
              <p className="text-brand-textMid leading-relaxed mb-6">
                We create and manage high-performing Facebook and Instagram ad campaigns that bring real customers to your business. Using Meta&#39;s full advertising platform plus advanced tracking, every taka you spend works harder.
              </p>
              <FeatureList features={metaFeatures} />
              <Link
                href="/services/facebook-meta-marketing"
                className="inline-flex items-center gap-1 text-brand-blue font-semibold mt-6 hover:underline"
              >
                Learn More <span aria-hidden>→</span>
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Row 2: Website Development */}
      <section id="website" className="bg-white py-16 lg:py-24 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <AnimatedSection variant="slideLeft">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center">
                  <Monitor className="w-5 h-5 text-brand-blue" />
                </div>
                <span className="text-sm font-semibold text-brand-blue">Website Development</span>
              </div>
              <h3 className="text-2xl lg:text-3xl font-semibold text-brand-textDark mb-4">
                Websites Built to Convert Visitors Into Customers
              </h3>
              <p className="text-brand-textMid leading-relaxed mb-6">
                A great website is more than design — it&#39;s your most powerful sales tool. We build fast, professional, and fully optimized websites that turn visitors into loyal customers for your business.
              </p>
              <FeatureList features={websiteFeatures} />
              <Link
                href="/services/website-development"
                className="inline-flex items-center gap-1 text-brand-blue font-semibold mt-6 hover:underline"
              >
                Learn More <span aria-hidden>→</span>
              </Link>
            </AnimatedSection>
            <AnimatedSection variant="scaleIn" className="flex justify-center order-first lg:order-last">
              <LaptopMockup />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Row 3: AI Automation */}
      <section id="ai" className="bg-brand-bg py-16 lg:py-24 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <AnimatedSection variant="scaleIn" className="flex justify-center">
              <ChatMockup />
            </AnimatedSection>
            <AnimatedSection variant="slideRight">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-brand-blue" />
                </div>
                <span className="text-sm font-semibold text-brand-blue">AI Automation & Chatbot</span>
              </div>
              <h3 className="text-2xl lg:text-3xl font-semibold text-brand-textDark mb-4">
                Smart AI Automation That Works While You Sleep
              </h3>
              <p className="text-brand-textMid leading-relaxed mb-6">
                Stop missing leads after hours. Our AI-powered chatbots and automation workflows handle customer inquiries, generate leads, and manage orders around the clock — so you never lose a potential customer.
              </p>
              <FeatureList features={aiFeatures} />
              <Link
                href="/services/ai-automation-chatbot"
                className="inline-flex items-center gap-1 text-brand-blue font-semibold mt-6 hover:underline"
              >
                Learn More <span aria-hidden>→</span>
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}
