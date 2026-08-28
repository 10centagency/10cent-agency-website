export interface WhatWeDoService {
  id: string;
  slug: string;
  title: string;
  badge: string;
  description: string;
  href: string;
  tint: 'meta' | 'google' | 'web' | 'ai' | 'social' | 'seo' | 'design';
  delay: string;
}

export interface WhatWeDoCta {
  title: string;
  description: string;
  href: string;
  delay: string;
}

export interface ServiceDetailPanelData {
  id: string;
  panelClass: string;
  kicker: string;
  kickerColor: string;
  titlePrefix: string;
  titleHighlight: string;
  titleSuffix?: string;
  gradientColors: { g1: string; g2: string };
  description: string;
  features: string[];
  ctaText: string;
  ctaHref: string;
  isFlipped: boolean;
}

export interface AddOnServiceItem {
  id: string;
  slug: string;
  title: string;
  badge: string;
  badgeClass: string;
  description: string;
  href: string;
  tint: 'google' | 'seo' | 'design' | 'social';
  delay: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1: WHAT WE DO
// ─────────────────────────────────────────────────────────────────────────────
export const whatWeDoHeader = {
  label: 'What We Do',
  title: 'Digital Marketing Services for Bangladeshi Businesses',
  description:
    'Facebook & Google ads, high-converting websites, AI automation, SEO, social media and design — one accountable team, transparent pricing, and measurable results in Bangla and English.',
};

export const whatWeDoServices: WhatWeDoService[] = [
  {
    id: 'facebook-meta-marketing',
    slug: 'facebook-meta-marketing',
    title: 'Facebook & Meta Marketing',
    badge: 'Monthly Retainer',
    description:
      'Data-driven Facebook & Instagram campaigns with server-side tracking, so every taka you spend is measurable.',
    href: '/services/facebook-meta-marketing',
    tint: 'meta',
    delay: '.00s',
  },
  {
    id: 'google-ads',
    slug: 'google-ads',
    title: 'Google Ads',
    badge: 'Monthly Retainer',
    description:
      'Capture buyers at the exact moment they search — Search, Shopping & YouTube campaigns with a fixed management fee.',
    href: '/services/google-ads',
    tint: 'google',
    delay: '.06s',
  },
  {
    id: 'website-development',
    slug: 'website-development',
    title: 'Website Development',
    badge: 'One-time Project',
    description:
      'Fast, professional websites and e-commerce stores built to convert visitors into paying customers.',
    href: '/services/website-development',
    tint: 'web',
    delay: '.12s',
  },
  {
    id: 'ai-automation-chatbot',
    slug: 'ai-automation-chatbot',
    title: 'AI Automation & Chatbot',
    badge: '3 Days Free Trial',
    description:
      'Messenger, WhatsApp & Telegram bots that answer questions, capture leads and confirm orders 24/7.',
    href: '/services/ai-automation-chatbot',
    tint: 'ai',
    delay: '.18s',
  },
  {
    id: 'social-media-management',
    slug: 'social-media-management',
    title: 'Social Media Management',
    badge: 'Monthly Retainer',
    description:
      'Consistent content, community management and AI-powered engagement across every platform you use.',
    href: '/services/social-media-management',
    tint: 'social',
    delay: '.00s',
  },
  {
    id: 'seo-aeo-geo',
    slug: 'seo-aeo-geo',
    title: 'SEO, AEO & GEO',
    badge: 'Monthly Retainer',
    description:
      'Rank on Google and get cited by AI answer engines like ChatGPT and Gemini — long-term, compounding traffic.',
    href: '/services/seo-aeo-geo',
    tint: 'seo',
    delay: '.06s',
  },
  {
    id: 'graphic-design',
    slug: 'graphic-design',
    title: 'Graphic Design',
    badge: 'One-time Project',
    description:
      'Logos, social creatives and marketing materials designed to make your brand look professional everywhere.',
    href: '/services/graphic-design',
    tint: 'design',
    delay: '.12s',
  },
];

export const whatWeDoCta: WhatWeDoCta = {
  title: 'See Full Service Breakdowns',
  description: 'Packages, pricing logic, timelines & FAQs for every service.',
  href: '/services',
  delay: '.18s',
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2: 3 SERVICE DETAIL PANELS
// ─────────────────────────────────────────────────────────────────────────────
export const metaDetailData: ServiceDetailPanelData = {
  id: 'detail-meta',
  panelClass: 'panelDark',
  kicker: 'Facebook & Meta Marketing',
  kickerColor: '#1877F2',
  titlePrefix: 'Turn Scrollers Into ',
  titleHighlight: 'Paying Customers',
  gradientColors: { g1: '#1877F2', g2: '#3B82F6' },
  description:
    'Build a revenue-generating presence on Facebook & Instagram — from page setup to full-scale Advantage+ campaigns. Every taka tracked with server-side Conversions API.',
  features: [
    'Page setup, content & ad management',
    'Bangla, English & Banglish content',
    'Pixel + Conversions API (server-side)',
    'Advantage+ campaigns & creative testing',
    'Zero markup on ad spend — you own the account',
    'Monthly plain-language performance reports',
  ],
  ctaText: 'Learn More',
  ctaHref: '/services/facebook-meta-marketing',
  isFlipped: true,
};

export const metaVizData = {
  campaignName: 'Eid Sale Campaign',
  campaignSub: 'Advantage+ Shopping · $25/day',
  kpis: [
    { val: '4.2×', to: 4.2, dec: 1, suffix: '×', cd: 500, label: 'ROAS', tag: '▲ Best week', tagType: 'up' },
    { val: '1,240', to: 1240, dec: 0, cd: 620, label: 'Leads', tag: '▲ 32%', tagType: 'up' },
    { val: '$0.4', to: 0.4, dec: 1, prefix: '$', cd: 740, label: 'CPM', tag: '▼ 12%', tagType: 'dn' },
  ],
  funnel: [
    { height: '44px', delay: '.0s', val: '24.5K', to: 24.5, dec: 1, suffix: 'K', cd: 700, label: 'Reach' },
    { height: '34px', delay: '.1s', val: '3.1K', to: 3.1, dec: 1, suffix: 'K', cd: 820, label: 'Clicks' },
    { height: '24px', delay: '.2s', val: '1.2K', to: 1.2, dec: 1, suffix: 'K', cd: 940, label: 'Leads' },
    { height: '14px', delay: '.3s', val: '386', to: 386, dec: 0, cd: 1060, label: 'Sales', isGreen: true },
  ],
};

export const websiteDetailData: ServiceDetailPanelData = {
  id: 'detail-website',
  panelClass: 'panelNavy',
  kicker: 'Website Development',
  kickerColor: '#0F5FE0',
  titlePrefix: 'Built Fast. Built Smart. ',
  titleHighlight: 'Built to Sell.',
  gradientColors: { g1: '#0F5FE0', g2: '#2F85F3' },
  description:
    'Fast, mobile-first websites and e-commerce stores built on WordPress + Elementor or Next.js/React — tuned to turn every visitor into a paying customer.',
  features: [
    'Business sites, landing pages & e-commerce',
    'bKash, Nagad, Rocket & card via SSLCommerz',
    'Mobile-first, <3s load target, 95+ PageSpeed',
    'Pixel + CAPI + GA4 + UTM tracking',
    'Domain, hosting, SSL & on-page SEO',
    '1 month free post-launch support',
  ],
  ctaText: 'Learn More',
  ctaHref: '/services/website-development',
  isFlipped: false,
};

export const websiteVizData = {
  url: 'yourbusiness.com',
  speedScore: { val: '98', to: 98, cd: 1750 },
  heroTag: 'Trusted by 50+ BD Businesses', // Corrected text override: 50+ (owner-approved)
  heroBtn: 'Get Started Today',
  tech: ['WordPress', 'Next.js', 'React', 'Elementor', 'WooCommerce'],
  metrics: [
    { val: '<3s', label: 'Page Load' },
    { val: 'SSL ✓', label: 'Secure' },
    { val: '7 Days', label: 'Delivery' },
  ],
  payments: [
    { name: 'bKash', cls: 'bkash' },
    { name: 'Nagad', cls: 'nagad' },
    { name: 'Rocket', cls: 'rocket' },
    { name: 'VISA', cls: '' },
    { name: 'Mastercard', cls: '' },
    { name: 'SSLCommerz', cls: '' },
  ],
};

export const aiDetailData: ServiceDetailPanelData = {
  id: 'detail-ai',
  panelClass: 'panelIndigo',
  kicker: 'AI Automation & Chatbot',
  kickerColor: '#2F85F3',
  titlePrefix: 'Your Business ',
  titleHighlight: 'Never Sleeps',
  titleSuffix: ' Again',
  gradientColors: { g1: '#1D4ED8', g2: '#3B82F6' },
  description:
    'AI-powered chatbots on Messenger, WhatsApp & Telegram that answer questions, capture leads and process orders — 24/7, in Bangla, English or Banglish. Backed by n8n automation workflows.',
  features: [
    'Messenger, WhatsApp & Telegram bots',
    'Facebook comment → DM lead capture',
    'n8n workflows: invoices, reminders, order confirm',
    'Bangla, English & Banglish + human handover',
    'Unified inbox + CRM / Google Sheets sync',
    '3 days free trial — zero commitment',
  ],
  ctaText: 'Start Free Trial',
  ctaHref: '/services/ai-automation-chatbot',
  isFlipped: true,
};

export const aiVizData = {
  assistantTitle: '10 Cent AI Assistant',
  assistantStatus: '● Online 24/7',
  chatMessages: [
    {
      sender: 'ai',
      text: 'Assalamu alaikum! How can I help you today? 😊',
    },
    {
      sender: 'usr',
      text: 'Delivery charge koto Dhaka te?',
    },
    {
      sender: 'ai',
      text: 'Dhaka city er bhitore delivery charge matro ৳60! 🎉',
      subtext: 'Ki order korte chan?',
      quickBtns: ['✓Order Now', 'More info'],
    },
  ],
  channels: [
    {
      name: 'WhatsApp',
      val: '2.4K',
      to: 2.4,
      dec: 1,
      suffix: 'K',
      cd: 3000,
      color: '#25D366',
      icon: 'whatsapp',
    },
    {
      name: 'Messenger',
      val: '5.1K',
      to: 5.1,
      dec: 1,
      suffix: 'K',
      cd: 3150,
      color: '#0084FF',
      icon: 'messenger',
    },
    {
      name: 'Telegram',
      val: '890',
      to: 890,
      dec: 0,
      cd: 3300,
      color: '#26A5E4',
      icon: 'telegram',
    },
  ],
  workflowSteps: [
    { label: 'Lead In', status: 'done' as const },
    { label: 'Invoice', status: 'done' as const },
    { label: 'Notify', status: 'pend' as const },
    { label: 'Follow-up', status: 'wait' as const },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3: ADDITIONAL SERVICES
// ─────────────────────────────────────────────────────────────────────────────
export const addOnServicesHeader = {
  label: 'Additional Services',
  title: 'More Ways We Can Help',
  description: 'Complement your core marketing strategy with these powerful add-on services.',
};

export const addOnServices: AddOnServiceItem[] = [
  {
    id: 'google-ads',
    slug: 'google-ads',
    title: 'Google Ads',
    badge: 'New · One-time + Retainer',
    badgeClass: 'badgeGoogle',
    description:
      'Show up when Bangladeshi buyers are already searching. Search, Shopping, Display, YouTube & Performance Max — with zero markup on your ad spend.',
    href: '/services/google-ads',
    tint: 'google',
    delay: '.00s',
  },
  {
    id: 'seo-aeo-geo',
    slug: 'seo-aeo-geo',
    title: 'SEO, AEO & GEO',
    badge: 'Monthly Retainer',
    badgeClass: 'badgeSoft',
    description:
      'Rank on Google and get cited by AI answer engines like ChatGPT and Gemini — long-term, compounding traffic that keeps working.',
    href: '/services/seo-aeo-geo',
    tint: 'seo',
    delay: '.06s',
  },
  {
    id: 'graphic-design',
    slug: 'graphic-design',
    title: 'Graphic Design',
    badge: 'One-time Project',
    badgeClass: 'badgeSoft',
    description:
      'Logos, social media graphics, banners, and marketing materials — all designed to reflect your brand professionally.',
    href: '/services/graphic-design',
    tint: 'design',
    delay: '.12s',
  },
  {
    id: 'social-media-management',
    slug: 'social-media-management',
    title: 'Social Media Management',
    badge: 'Monthly Retainer',
    badgeClass: 'badgeSoft',
    description:
      'Full monthly management with AI-powered engagement tools, consistent posting, and community management for your brand.',
    href: '/services/social-media-management',
    tint: 'social',
    delay: '.18s',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4: HOMEPAGE FAQS
// ─────────────────────────────────────────────────────────────────────────────
export interface HomeFaqItem {
  question: string;
  answer: string;
}

export const homeFaqs: HomeFaqItem[] = [
  {
    question: 'What digital marketing services does 10 Cent Agency provide?',
    answer:
      'We provide 7 core digital marketing services designed for growing Bangladeshi businesses: Facebook & Meta Marketing, Google Ads (Search, Shopping, Display & Performance Max), Website Development (custom WordPress & Next.js stores with bKash, Nagad, and SSLCommerz), AI Automation & Chatbots (for Messenger, WhatsApp & Telegram), Social Media Management, SEO/AEO/GEO (Google rankings and AI answer engine visibility like ChatGPT and Gemini), and Graphic Design (brand identity, packaging, and marketing creatives). Rather than juggling multiple disconnected vendors, you get one accountable partner with dedicated project management, transparent monthly reporting, and execution tailored to your specific business goals.',
  },
  {
    question: 'How does your pricing work, and what determines the cost?',
    answer:
      'We use custom scoping instead of rigid, one-size-fits-all packages so you only pay for the exact work your business needs. Project costs depend on the service type, scope, and technical complexity. For instance, a single-service retainer with your own creatives costs less than full-scale multi-channel management with custom design and video production. Website pricing varies based on whether you need a fast landing page, a full corporate site, or an e-commerce platform with automated inventory and local payment gateways. After a free 20–30 minute discovery consultation, we provide a transparent, itemized proposal with clear deliverables and zero hidden fees.',
  },
  {
    question: 'How is advertising spend handled on Meta and Google?',
    answer:
      'You pay your ad spend directly to Meta and Google through your own payment methods inside your Business Manager or Google Ads account. We never touch your media money, charge zero markup on your ad spend, and never bundle ad spend into ambiguous fees. 10 Cent Agency is added as an authorized partner to set up, manage, and optimize your campaigns. You retain 100% ownership of your accounts, tracking pixels, customer data, and campaign history. If you ever pause or end services, full control and all data remain entirely yours.',
  },
  {
    question: 'What is the process from our first call to launching campaigns?',
    answer:
      'Our work follows a structured 5-step process: Discovery Call, Strategy & Proposal, Build / Setup, Launch & Optimize, and Report & Scale. We begin with a free 20–30 minute discovery call to understand your business, audience, and goals. Within 24–48 hours, we deliver a custom strategy and transparent proposal. Once approved, Days 1–5 focus on setup, onboarding, asset audits, and server-side tracking (Pixel, CAPI, GA4). In Days 7–14, we build creatives, staging sites, or workflows. After launch, we monitor and optimize in real time, followed by monthly plain-language reporting and scaling recommendations.',
  },
  {
    question: 'What are realistic timelines to see results across different services?',
    answer:
      'Timelines depend on the service channel. Paid advertising on Google Search and Facebook Ads can generate initial leads, WhatsApp inquiries, or sales within the first 7 to 14 days, with predictable ROAS developing over months 2 to 3 as machine learning stabilizes. Website projects typically take 3 to 7 days for landing pages, 7 to 14 working days for business websites, and 14 to 21 days for full e-commerce stores. AI chatbots start responding 24/7 immediately after deployment, while SEO and AEO require 3 to 6 months of compounding authority and technical optimization to rank for competitive commercial keywords.',
  },
  {
    question: 'Do you create marketing content in both Bangla and English?',
    answer:
      'Yes. Every campaign, social post, ad creative, and chatbot workflow is available in authentic Bangla, English, or conversational Banglish. Communicating naturally in the language your customers speak is essential for building trust in Bangladesh—whether you are selling fashion during Eid rush in Dhaka, running local B2B logistics campaigns, or serving international clients. We write culturally resonant copy, design bilingual graphics with proper typography, and configure AI chatbot scripts that understand colloquial local phrasing and common customer questions seamlessly.',
  },
  {
    question: 'Are your contracts long-term, or can I cancel anytime?',
    answer:
      'All our management retainers operate on a flexible month-to-month basis with no 6-month or 12-month lock-in contracts. You have the freedom to adjust your scope, pause campaigns, or cancel anytime with simple notice before your next billing cycle. Because we build all assets, tracking pixels, ad accounts, and websites directly inside your own properties, you keep complete ownership of every asset, audience list, and dataset even if you choose to stop working with us.',
  },
  {
    question: 'Why should I hire 10 Cent Agency instead of a freelancer or doing it in-house?',
    answer:
      'A single freelancer or in-house hire rarely possesses the complete skill set required for modern digital growth—combining technical tracking, media buying, persuasive copywriting, conversion-focused design, web development, and AI automation. 10 Cent Agency is a registered business entity in Bangladesh providing an entire multi-disciplinary team led by a dedicated account manager at a cost comparable to a single junior employee. You get consistent reliability, standardized workflows, 48-hour revision turnarounds on design, and institutional expertise without the overhead of hiring, managing, or training staff.',
  },
  {
    question: 'How do we get started with 10 Cent Agency?',
    answer:
      'Getting started is quick and risk-free. Book a free 20–30 minute consultation or reach out via WhatsApp or phone. We will discuss your current marketing setup, review your website or social presence, and identify immediate opportunities for improvement. Within 24 to 48 hours, we send an itemized proposal with clear timelines, deliverables, and transparent pricing. You can also test our AI Automation services with a 3-day free trial. Once you approve the plan, onboarding begins immediately on Day 1.',
  },
];
