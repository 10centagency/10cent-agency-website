import type { IconType } from 'react-icons';
import {
  FaBolt,
  FaChartLine,
  FaRobot,
  FaLanguage,
  FaShieldHalved,
  FaArrowDown,
  FaArrowRight,
  FaFacebookF,
  FaGoogle,
  FaDisplay,
  FaShareNodes,
  FaMagnifyingGlassChart,
  FaPalette,
  FaClock,
  FaBuilding,
  FaCompass,
  FaWandMagicSparkles,
  FaSackDollar,
  FaMagnifyingGlass,
  FaCircleCheck,
  FaArrowTrendUp,
  FaRocket,
  FaCommentDots,
  FaCalendarCheck,
  FaStar,
  FaLayerGroup,
  FaScaleBalanced,
  FaDiagramProject,
  FaPhoneVolume,
  FaLightbulb,
  FaPenRuler,
  FaCoins,
  FaChartSimple,
  FaUserTie,
  FaBriefcase,
  FaUtensils,
  FaShirt,
  FaBookOpen,
  FaStethoscope,
  FaCartShopping,
  FaScissors,
  FaMicrochip,
  FaStore,
  FaGraduationCap,
  FaPlane,
  FaPills,
  FaDumbbell,
  FaClapperboard,
  FaCamera,
  FaCircleQuestion,
  FaChevronDown,
} from 'react-icons/fa6';

/* ==========================================================================
   Icon Map for Server & Client Render
   ========================================================================== */
export const iconMap: Record<string, IconType> = {
  FaBolt,
  FaChartLine,
  FaRobot,
  FaLanguage,
  FaShieldHalved,
  FaArrowDown,
  FaArrowRight,
  FaFacebookF,
  FaGoogle,
  FaDisplay,
  FaShareNodes,
  FaMagnifyingGlassChart,
  FaPalette,
  FaClock,
  FaBuilding,
  FaCompass,
  FaWandMagicSparkles,
  FaSackDollar,
  FaMagnifyingGlass,
  FaCircleCheck,
  FaArrowTrendUp,
  FaRocket,
  FaCommentDots,
  FaCalendarCheck,
  FaStar,
  FaLayerGroup,
  FaScaleBalanced,
  FaDiagramProject,
  FaPhoneVolume,
  FaLightbulb,
  FaPenRuler,
  FaCoins,
  FaChartSimple,
  FaUserTie,
  FaBriefcase,
  FaUtensils,
  FaShirt,
  FaBookOpen,
  FaStethoscope,
  FaCartShopping,
  FaScissors,
  FaMicrochip,
  FaStore,
  FaGraduationCap,
  FaPlane,
  FaPills,
  FaDumbbell,
  FaClapperboard,
  FaCamera,
  FaCircleQuestion,
  FaChevronDown,
};

/* ==========================================================================
   1. HERO SECTION DATA
   ========================================================================== */
export interface HeroData {
  tag: string;
  tagIcon: string;
  titleStart: string;
  titleAccent: string;
  lead: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText: string;
  secondaryCtaHref: string;
  trustItems: { icon: string; text: string }[];
}

export const heroData: HeroData = {
  tag: '7 Services · 1 Expert Agency',
  tagIcon: 'FaBolt',
  titleStart: 'Everything Your Business Needs to ',
  titleAccent: 'Win Online',
  lead: 'From getting found on Google and Meta, to building your website, automating leads with AI, and looking professional everywhere — we run it all, so you can run your business.',
  primaryCtaText: 'Explore All Services',
  primaryCtaHref: '#services-grid',
  secondaryCtaText: 'Book Free Consultation',
  secondaryCtaHref: '/contact',
  trustItems: [
    { icon: 'FaChartLine', text: '150+ Campaigns Managed' },
    { icon: 'FaRobot', text: '20+ Businesses Automated' },
    { icon: 'FaLanguage', text: 'Bangla + English, Always' },
    { icon: 'FaShieldHalved', text: 'Zero Markup on Ad Spend' },
  ],
};

export interface IconNavChip {
  id: string;
  cardId: string;
  labelFirst: string;
  labelSecond: string;
  tag: string;
  color: string;
  icon: string;
}

export const iconNavChips: IconNavChip[] = [
  {
    id: 'meta',
    cardId: 'svc-meta',
    labelFirst: 'Facebook',
    labelSecond: '& Meta',
    tag: 'Retainer',
    color: '#1877F2',
    icon: 'FaFacebookF',
  },
  {
    id: 'google',
    cardId: 'svc-google',
    labelFirst: 'Google',
    labelSecond: 'Ads',
    tag: 'New',
    color: '#EA4335',
    icon: 'FaGoogle',
  },
  {
    id: 'web',
    cardId: 'svc-web',
    labelFirst: 'Website',
    labelSecond: 'Dev',
    tag: 'One-time',
    color: '#0F5FE0',
    icon: 'FaDisplay',
  },
  {
    id: 'ai',
    cardId: 'svc-ai',
    labelFirst: 'AI',
    labelSecond: 'Automation',
    tag: 'Free Trial',
    color: '#7C3AED',
    icon: 'FaRobot',
  },
  {
    id: 'social',
    cardId: 'svc-social',
    labelFirst: 'Social',
    labelSecond: 'Media',
    tag: 'Retainer',
    color: '#0284C7',
    icon: 'FaShareNodes',
  },
  {
    id: 'seo',
    cardId: 'svc-seo',
    labelFirst: 'SEO, AEO',
    labelSecond: '& GEO',
    tag: 'Retainer',
    color: '#059669',
    icon: 'FaMagnifyingGlassChart',
  },
  {
    id: 'design',
    cardId: 'svc-design',
    labelFirst: 'Graphic',
    labelSecond: 'Design',
    tag: 'Project',
    color: '#DB2777',
    icon: 'FaPalette',
  },
];

/* ==========================================================================
   2. TRUST MARQUEE DATA
   ========================================================================== */
export interface MarqueeItem {
  icon: string;
  highlight: string;
  suffix: string;
}

export const marqueeItems: MarqueeItem[] = [
  { icon: 'FaChartLine', highlight: '150+', suffix: 'Campaigns Managed' },
  { icon: 'FaRobot', highlight: '20+', suffix: 'Businesses Automated' },
  { icon: 'FaPalette', highlight: '85%', suffix: 'Repeat Design Clients' },
  { icon: 'FaBuilding', highlight: 'Registered', suffix: 'Business Entity, Bangladesh' },
  { icon: 'FaLanguage', highlight: 'Bangla + English', suffix: 'Content, Always' },
  { icon: 'FaShieldHalved', highlight: 'Zero Markup', suffix: 'on Ad Spend' },
  { icon: 'FaClock', highlight: '48hr', suffix: 'Revision Turnaround' },
];

/* ==========================================================================
   3. GOAL FINDER DATA
   ========================================================================== */
export interface GoalChip {
  id: string;
  label: string;
  icon: string;
  hint: string;
}

export const goalChipsData: GoalChip[] = [
  {
    id: 'all',
    label: 'Show Everything',
    icon: 'FaWandMagicSparkles',
    hint: '',
  },
  {
    id: 'sales',
    label: 'Get More Sales/Leads',
    icon: 'FaSackDollar',
    hint: 'Showing services built to drive more sales & leads.',
  },
  {
    id: 'found',
    label: 'Get Found Online',
    icon: 'FaMagnifyingGlass',
    hint: 'Showing services that help customers find you.',
  },
  {
    id: 'site',
    label: 'Need a Website',
    icon: 'FaDisplay',
    hint: 'Showing services related to building your website.',
  },
  {
    id: 'automate',
    label: 'Automate with AI',
    icon: 'FaRobot',
    hint: 'Showing services that automate your business with AI.',
  },
  {
    id: 'social',
    label: 'Stay Active on Social',
    icon: 'FaShareNodes',
    hint: 'Showing services that keep your social presence active.',
  },
  {
    id: 'brand',
    label: 'Look More Professional',
    icon: 'FaPalette',
    hint: 'Showing services that make your brand look professional.',
  },
];

/* ==========================================================================
   4. MAIN SERVICE CARDS DATA
   ========================================================================== */
export interface ServiceCardItem {
  id: string;
  number: string;
  title: string;
  slug: string;
  href: string;
  badge: string;
  badgeCustomStyle?: { background: string; color: string };
  accentColor: string;
  accentClass: string;
  icon: string;
  description: string;
  features: string[];
  statIcon: string;
  statText: string;
  primaryActionText: string;
  primaryActionHref: string;
  secondaryActionText: string;
  secondaryActionHref: string;
  goals: string[];
}

export const serviceCardsData: ServiceCardItem[] = [
  {
    id: 'svc-meta',
    number: '01',
    title: '01 · Facebook & Meta Marketing',
    slug: 'facebook-meta-marketing',
    href: '/services/facebook-meta-marketing',
    badge: 'Monthly Retainer',
    accentColor: '#1877F2',
    accentClass: 'cMeta',
    icon: 'FaFacebookF',
    description:
      'High-performing Facebook & Instagram ad campaigns with server-side (CAPI) tracking, so every taka you spend is measurable.',
    features: [
      'Page setup, content & ad management',
      'Pixel + Conversions API tracking',
      'Ad spend at zero markup',
    ],
    statIcon: 'FaArrowTrendUp',
    statText: '150+ campaigns managed',
    primaryActionText: 'Start Project',
    primaryActionHref: '/contact',
    secondaryActionText: 'View Details',
    secondaryActionHref: '/services/facebook-meta-marketing',
    goals: ['sales', 'social', 'found'],
  },
  {
    id: 'svc-google',
    number: '02',
    title: '02 · Google Ads',
    slug: 'google-ads',
    href: '/services/google-ads',
    badge: 'New · One-time + Retainer',
    badgeCustomStyle: {
      background: 'rgba(234,67,53,0.12)',
      color: '#EA4335',
    },
    accentColor: '#EA4335',
    accentClass: 'cGoogle',
    icon: 'FaGoogle',
    description:
      'Show up when Bangladeshi buyers are already searching. Search, Shopping, Display, YouTube & Performance Max — zero markup on spend.',
    features: [
      'Verified conversion tracking first',
      'Weekly negative-keyword cleanup',
      'You own the ad account',
    ],
    statIcon: 'FaBolt',
    statText: 'Clicks within 24–48 hours',
    primaryActionText: 'Get a Free Audit',
    primaryActionHref: '/contact',
    secondaryActionText: 'View Details',
    secondaryActionHref: '/services/google-ads',
    goals: ['sales', 'found'],
  },
  {
    id: 'svc-web',
    number: '03',
    title: '03 · Website Development',
    slug: 'website-development',
    href: '/services/website-development',
    badge: 'One-time Project',
    accentColor: '#0F5FE0',
    accentClass: 'cWeb',
    icon: 'FaDisplay',
    description:
      'Fast, mobile-first websites built on WordPress + Elementor or custom Next.js/React — whichever fits your business.',
    features: [
      'Business sites, landing pages, e-commerce',
      'bKash, Nagad, Rocket & card payments',
      '1 month free support included',
    ],
    statIcon: 'FaRocket',
    statText: '<3s target load time',
    primaryActionText: 'Start Project',
    primaryActionHref: '/contact',
    secondaryActionText: 'View Details',
    secondaryActionHref: '/services/website-development',
    goals: ['site', 'sales'],
  },
  {
    id: 'svc-ai',
    number: '04',
    title: '04 · AI Automation & Chatbot',
    slug: 'ai-automation-chatbot',
    href: '/services/ai-automation-chatbot',
    badge: '3 Days Free Trial',
    accentColor: '#7C3AED',
    accentClass: 'cAi',
    icon: 'FaRobot',
    description:
      '24/7 chatbots for Messenger, WhatsApp & Telegram plus n8n workflows that capture leads and manage orders automatically.',
    features: [
      'Bangla + English, Banglish-aware',
      'Human handover built-in',
      'No commitment — test it free',
    ],
    statIcon: 'FaCommentDots',
    statText: '<10s average reply time',
    primaryActionText: 'Start Free Trial',
    primaryActionHref: '/contact',
    secondaryActionText: 'View Details',
    secondaryActionHref: '/services/ai-automation-chatbot',
    goals: ['automate', 'sales'],
  },
  {
    id: 'svc-social',
    number: '05',
    title: '05 · Social Media Management',
    slug: 'social-media-management',
    href: '/services/social-media-management',
    badge: 'Monthly Retainer',
    accentColor: '#0284C7',
    accentClass: 'cSocial',
    icon: 'FaShareNodes',
    description:
      'Content calendar, design, scheduled posting and AI-powered comment management across FB, IG, LinkedIn, YouTube & GBP.',
    features: [
      '5 platforms, one dedicated manager',
      'AI comment & inbox moderation',
      'Monthly reporting, plain language',
    ],
    statIcon: 'FaCalendarCheck',
    statText: '100% on-time publishing',
    primaryActionText: 'Get a Quote',
    primaryActionHref: '/contact',
    secondaryActionText: 'View Details',
    secondaryActionHref: '/services/social-media-management',
    goals: ['social', 'found'],
  },
  {
    id: 'svc-seo',
    number: '06',
    title: '06 · SEO, AEO & GEO',
    slug: 'seo-aeo-geo',
    href: '/services/seo-aeo-geo',
    badge: 'Monthly Retainer',
    accentColor: '#059669',
    accentClass: 'cSeo',
    icon: 'FaMagnifyingGlassChart',
    description:
      'Get found in Google’s blue links, Featured Snippets, and cited by ChatGPT, Gemini & AI Overviews — one unified strategy.',
    features: [
      'On-page, technical & local SEO',
      'FAQ schema & AI-citation ready content',
      'Monthly rank & AI-visibility reports',
    ],
    statIcon: 'FaRobot',
    statText: '40% now appear in AI answers',
    primaryActionText: 'Get a Quote',
    primaryActionHref: '/contact',
    secondaryActionText: 'View Details',
    secondaryActionHref: '/services/seo-aeo-geo',
    goals: ['found', 'sales'],
  },
  {
    id: 'svc-design',
    number: '07',
    title: '07 · Graphic Design',
    slug: 'graphic-design',
    href: '/services/graphic-design',
    badge: 'Project-based',
    accentColor: '#DB2777',
    accentClass: 'cDesign',
    icon: 'FaPalette',
    description:
      'Logos, brand systems, social graphics and print-ready files that make your business look polished and trustworthy.',
    features: [
      'Custom, never a template',
      'Print + digital ready, 100% ownership',
      'Delivered in 3–7 working days',
    ],
    statIcon: 'FaStar',
    statText: '85% clients come back for more',
    primaryActionText: 'Get a Quote',
    primaryActionHref: '/contact',
    secondaryActionText: 'View Details',
    secondaryActionHref: '/services/graphic-design',
    goals: ['brand', 'social'],
  },
];

export interface ComboCardData {
  title: string;
  description: string;
  features: string[];
  ctaText: string;
  ctaHref: string;
}

export const comboCardData: ComboCardData = {
  title: 'Need a Custom Package?',
  description:
    'Most clients don’t pick just one — they bundle 2 or 3 services (like Website + SEO + Ads) into a single plan. Tell us your goal and budget, and we’ll build a custom package with one combined price.',
  features: [
    'Mix & match any of our 7 services',
    'One bundled price, no overlap fees',
    'One dedicated manager for everything',
  ],
  ctaText: 'Build My Custom Plan',
  ctaHref: '/contact',
};

/* ==========================================================================
   5. COMPARE CHANNELS DATA
   ========================================================================== */
export interface CompareRow {
  factor: string;
  googleAds: string;
  facebookAds: string;
  seo: string;
}

export const compareRowsData: CompareRow[] = [
  {
    factor: 'Intent Level',
    googleAds: 'High — actively searching',
    facebookAds: 'Lower — browsing, not searching',
    seo: 'High — same as Google, but organic',
  },
  {
    factor: 'Speed to Results',
    googleAds: 'Clicks in 24–48 hours',
    facebookAds: 'Impressions within hours',
    seo: '3–4 months for ranking movement',
  },
  {
    factor: 'Cost Model',
    googleAds: 'Pay per click',
    facebookAds: 'Pay per impression/click',
    seo: 'One-time + retainer, compounds',
  },
  {
    factor: 'Best For',
    googleAds: 'Buyers ready to purchase now',
    facebookAds: 'Brand awareness, visual products',
    seo: 'Long-term, sustainable traffic',
  },
  {
    factor: 'Example',
    googleAds: '"buy office chair"',
    facebookAds: 'Scroll-stopping product video',
    seo: '"best office chairs for backpain"',
  },
];

/* ==========================================================================
   6. PROCESS DATA
   ========================================================================== */
export interface ProcessStep {
  number: number;
  title: string;
  description: string;
  icon: string;
}

export const processStepsData: ProcessStep[] = [
  {
    number: 1,
    title: 'Discovery Call',
    description: 'Free consultation to understand your goals, budget & audience.',
    icon: 'FaPhoneVolume',
  },
  {
    number: 2,
    title: 'Strategy & Proposal',
    description: 'A custom plan and transparent quote — never one-size-fits-all.',
    icon: 'FaLightbulb',
  },
  {
    number: 3,
    title: 'Build / Setup',
    description: 'Design, development, campaign setup or content production begins.',
    icon: 'FaPenRuler',
  },
  {
    number: 4,
    title: 'Launch & Optimize',
    description: 'Goes live with real-time monitoring and quick iteration.',
    icon: 'FaRocket',
  },
  {
    number: 5,
    title: 'Report & Scale',
    description: 'Monthly reporting in plain language, and a plan for what’s next.',
    icon: 'FaChartLine',
  },
];

/* ==========================================================================
   7. NUMBERS STRIP DATA
   ========================================================================== */
export interface NumberStat {
  target: number;
  prefix?: string;
  suffix: string;
  label: string;
  icon: string;
}

export const numbersStripData: NumberStat[] = [
  {
    target: 150,
    suffix: '+',
    label: 'Ad Campaigns Managed',
    icon: 'FaChartLine',
  },
  {
    target: 20,
    suffix: '+',
    label: 'Businesses Automated with AI',
    icon: 'FaRobot',
  },
  {
    target: 85,
    suffix: '%',
    label: 'Design Clients Come Back',
    icon: 'FaPalette',
  },
  {
    target: 7,
    suffix: '',
    label: 'Ways We Help Your Business Grow',
    icon: 'FaLayerGroup',
  },
];

/* ==========================================================================
   8. WHY US DATA
   ========================================================================== */
export interface WhyUsCard {
  title: string;
  description: string;
  icon: string;
}

export const whyUsCardsData: WhyUsCard[] = [
  {
    title: 'Bangla + English, Always',
    description: 'Every ad, post, and chatbot reply is crafted for how your customers actually speak.',
    icon: 'FaLanguage',
  },
  {
    title: 'Zero Hidden Markup',
    description: 'Meta & Google ad spend goes straight from your account to the platform — no commission.',
    icon: 'FaCoins',
  },
  {
    title: 'Data-Driven, Not Guesswork',
    description: 'Pixel, CAPI, GA4, and rank tracking back every recommendation we make.',
    icon: 'FaChartSimple',
  },
  {
    title: 'Dedicated Manager',
    description: 'One accountable point of contact for your account — every service, every month.',
    icon: 'FaUserTie',
  },
  {
    title: '48-Hour Turnaround',
    description: 'Content, ad creative, and design revisions delivered fast — guaranteed.',
    icon: 'FaBolt',
  },
  {
    title: 'Registered Business Entity',
    description: 'A real agency with a trade license — not an anonymous freelancer.',
    icon: 'FaAward',
  },
];

/* ==========================================================================
   9. INDUSTRIES WE SERVE DATA
   ========================================================================== */
export interface IndustryChip {
  name: string;
  icon: string;
}

export const industriesData: IndustryChip[] = [
  { name: 'Restaurant', icon: 'FaUtensils' },
  { name: 'Clothing Brand', icon: 'FaShirt' },
  { name: 'Coaching Center', icon: 'FaBookOpen' },
  { name: 'Healthcare', icon: 'FaStethoscope' },
  { name: 'Real Estate', icon: 'FaBuilding' },
  { name: 'E-commerce', icon: 'FaCartShopping' },
  { name: 'Law Firm', icon: 'FaScaleBalanced' },
  { name: 'Beauty Salon', icon: 'FaScissors' },
  { name: 'Technology Startup', icon: 'FaMicrochip' },
  { name: 'Local Retail', icon: 'FaStore' },
  { name: 'Education', icon: 'FaGraduationCap' },
  { name: 'Travel Agency', icon: 'FaPlane' },
  { name: 'Pharmacy', icon: 'FaPills' },
  { name: 'Gym & Fitness', icon: 'FaDumbbell' },
];

/* ==========================================================================
   10. COMING SOON DATA
   ========================================================================== */
export interface ComingSoonItem {
  title: string;
  status: string;
  icon: string;
}

export const comingSoonData: ComingSoonItem[] = [
  {
    title: 'Video Production',
    status: 'Coming Soon',
    icon: 'FaClapperboard',
  },
  {
    title: 'Photography',
    status: 'Coming Soon',
    icon: 'FaCamera',
  },
];

/* ==========================================================================
   11. FAQ DATA
   ========================================================================== */
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const faqsData: FAQItem[] = [
  {
    id: 'cost',
    question: 'How much do your services cost?',
    answer:
      'There’s no single price list, because no two businesses need the exact same thing. A one-page landing site costs very differently from a full e-commerce build, and a single-platform starter chatbot costs differently from a multi-channel automation system with n8n workflows built in. What we do instead is scope every project individually — during your free consultation, we’ll ask about your goals, your current setup, and your budget, then put together a clear, itemized quote before any work begins. We offer flexible options across the board: one-time project pricing for things like websites and graphic design, and monthly retainers for ongoing work like ad management, SEO, and social media. There’s no obligation attached to getting a quote, and we’re upfront about what’s realistic for your budget rather than pushing a package that doesn’t fit.',
  },
  {
    id: 'ad-costs',
    question: 'Do I pay Facebook/Google ad costs separately?',
    answer:
      'Yes, and this is intentional — it’s how we keep our pricing honest. Your advertising budget is paid directly to Meta or Google from your own Ads Manager or Business Manager account, never routed through us. We charge a separate, transparent management fee for the strategy, setup, creative, and day-to-day optimization work, with zero markup added on top of your ad spend. This means you always know exactly where every taka is going: one line for what the platform charges to show your ads, and one line for the expertise managing them. It also means the account and its data belong to you from day one, not to us — so if you ever decide to part ways, your campaigns, audiences, and historical performance data stay fully in your control.',
  },
  {
    id: 'combine',
    question: 'Can I combine multiple services (e.g. Website + SEO + Ads)?',
    answer:
      'Absolutely, and honestly, this is how most of our long-term clients get the best results. A new website performs far better when it’s paired with SEO from launch day, since both share the same on-page foundation. Similarly, Facebook Ads and Google Ads work well together because they reach buyers at different stages — Google catches people actively searching, while Facebook builds awareness and retargets people who’ve already shown interest. When you bundle two or three services with us, we also design the strategy around how they reinforce each other — shared tracking setup, consistent messaging, and one unified monthly report instead of juggling separate vendors. Bundled clients typically get preferential pricing as well, since we can plan resourcing more efficiently across a single account.',
  },
  {
    id: 'takeover',
    question: 'Can you take over my existing website or social pages?',
    answer:
      'Yes, this is one of our most common starting points. Very few clients come to us with a completely blank slate — most already have a website that needs a redesign, or social pages that have been inconsistently managed. We start by auditing what you currently have: checking site speed, mobile responsiveness, existing SEO setup, ad account history, Pixel/tracking configuration, and content quality. From there we give you an honest picture of what’s working, what’s holding you back, and whether it makes more sense to optimize your existing setup or rebuild specific parts of it. You’re never forced into starting from zero if what you have is salvageable — but we also won’t pretend something is fine if it’s actively costing you customers.',
  },
  {
    id: 'language',
    question: 'Do you provide content in Bangla and English?',
    answer:
      'Yes, and it’s built into how we work by default, not offered as an add-on. Every piece of content we produce — ad copy, social captions, chatbot conversation flows, website copy, SEO content — is written with your specific audience in mind, whether that means pure Bangla, pure English, or the natural Bangla-English mix ("Banglish") that most Bangladeshi customers actually type and speak in day to day. Our AI chatbots are also trained to understand casual, mixed-language messages like "price koto" or "delivery kobe hobe" the same way a human team member would, rather than requiring customers to phrase things in a rigid, formal way. If your audience is split — say, local customers in Bangla and an international audience in English — we can run both simultaneously without one language feeling like an afterthought.',
  },
  {
    id: 'timeline',
    question: 'How long does it take to see results?',
    answer:
      'It depends entirely on the channel, and we’ll always give you a realistic, honest timeline upfront rather than an inflated promise. Paid channels move fastest — Google Ads and Facebook/Meta campaigns typically start generating clicks and impressions within 24–48 hours of launch, though we usually recommend a short learning period of one to two weeks before drawing firm conclusions from the data. Website projects are generally delivered within 7–14 days for standard business sites, and 14–21 days for e-commerce builds. AI chatbots can go from kickoff to a live, testable trial within about a week. Organic channels take longer by nature — SEO, AEO & GEO work usually needs 3–4 months before you see meaningful ranking movement, since that’s how long it takes for changes to be indexed, evaluated, and reflected in search results. We’ll walk you through what’s realistic for your specific goals during the discovery call.',
  },
  {
    id: 'contract',
    question: 'Is there a minimum contract, or can I cancel anytime?',
    answer:
      'One-time projects — websites, graphic design packages, landing pages — are simply scoped, paid, and delivered; there’s no ongoing contract involved once the project is complete. For monthly retainer services like ad management, SEO, and social media management, we work on a month-to-month basis rather than locking clients into long fixed terms. We do ask for advance notice before cancelling an active retainer, mainly so we can hand over account access, reporting data, and any in-progress work cleanly, without leaving campaigns or content calendars in a half-finished state. Our goal is to keep clients because the results speak for themselves, not because a contract makes it inconvenient to leave — which is also why we maintain a high retention rate across every one of our services.',
  },
  {
    id: 'revisions',
    question: 'What if I’m not happy with the work — do you offer revisions?',
    answer:
      'Yes. Every website project includes a full month of free post-launch support with up to 3–4 revision requests, so small tweaks and fixes after go-live don’t come with an extra invoice. Graphic design packages include structured revision rounds as well — typically 1–2 rounds for social media design work, and 2–3 rounds for brand identity projects — where we ask for consolidated feedback so a round isn’t burned on a single one-line comment. For ongoing retainer services like ads, SEO, and social media management, revisions to creative, copy, and content are simply part of the monthly workflow, with a 48-hour turnaround guarantee on requested changes. If something genuinely isn’t meeting the agreed brief, we’ll always fix it — our priority is that the final result actually works for your business, not just that a deliverable gets checked off a list.',
  },
  {
    id: 'get-started',
    question: 'How do I get started?',
    answer:
      'Getting started is simple and there’s no pressure or commitment involved. Reach out through WhatsApp, our contact page, or by booking a free consultation call directly — whichever is more convenient for you. On that call, we’ll ask about your business, your current setup, and what you’re actually trying to achieve, whether that’s more leads, a better-looking brand, or simply getting your evenings back from managing social media yourself. From there, we’ll recommend the specific service or combination of services that fits, along with a clear, itemized quote and realistic timeline. If AI Automation & Chatbot is one of the services you’re exploring, you can even test a fully working version with our 3-day free trial before deciding on anything — no credit card, no obligation.',
  },
];

/* ==========================================================================
   JSON-LD SCHEMA GRAPH GENERATOR (6 CONNECTED NODES)
   ========================================================================== */
export function getServicesSchemaGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LocalBusiness',
        '@id': 'https://www.10centagency.com/#organization',
        name: '10 Cent Agency',
        url: 'https://www.10centagency.com',
        logo: 'https://www.10centagency.com/Logo.webp',
        image: 'https://www.10centagency.com/og-image.png',
        telephone: '+8801615144114',
        email: 'hello@10centagency.com',
        description:
          'Affordable digital marketing agency in Bangladesh helping small businesses grow online with Facebook & Meta ads, Google ads, website development, AI automation, SEO, and graphic design.',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'East Monipur, Mirpur',
          addressLocality: 'Dhaka',
          postalCode: '1216',
          addressCountry: 'BD',
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [
              'Saturday',
              'Sunday',
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
            ],
            opens: '10:00',
            closes: '21:00',
          },
        ],
        sameAs: [
          'https://www.facebook.com/10centagency',
          'https://www.instagram.com/10centagency',
          'https://www.youtube.com/@10centagency',
          'https://www.linkedin.com/company/10-cent-agency',
        ],
        priceRange: '৳৳',
      },
      {
        '@type': 'WebSite',
        '@id': 'https://www.10centagency.com/#website',
        url: 'https://www.10centagency.com',
        name: '10 Cent Agency',
        description: 'Best Digital Marketing Agency in BD',
        inLanguage: 'en-BD',
        publisher: {
          '@id': 'https://www.10centagency.com/#organization',
        },
      },
      {
        '@type': 'WebPage',
        '@id': 'https://www.10centagency.com/services#webpage',
        url: 'https://www.10centagency.com/services',
        name: 'Our Services | 10 Cent Agency',
        description:
          'A complete suite of 7 digital services designed to grow your business — Facebook & Meta Marketing, Google Ads, Website Development, AI Automation, Social Media Management, SEO/AEO/GEO, and Graphic Design.',
        inLanguage: 'en-BD',
        isPartOf: {
          '@id': 'https://www.10centagency.com/#website',
        },
        breadcrumb: {
          '@id': 'https://www.10centagency.com/services#breadcrumb',
        },
        mainEntity: {
          '@id': 'https://www.10centagency.com/services#list',
        },
      },
      {
        '@type': 'ItemList',
        '@id': 'https://www.10centagency.com/services#list',
        name: '10 Cent Agency Digital Services',
        description:
          'Full suite of 7 digital services designed to grow small and medium businesses in Bangladesh.',
        numberOfItems: 7,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Facebook & Meta Marketing',
            url: 'https://www.10centagency.com/services/facebook-meta-marketing',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Google Ads',
            url: 'https://www.10centagency.com/services/google-ads',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Website Development',
            url: 'https://www.10centagency.com/services/website-development',
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: 'AI Automation & Chatbot',
            url: 'https://www.10centagency.com/services/ai-automation-chatbot',
          },
          {
            '@type': 'ListItem',
            position: 5,
            name: 'Social Media Management',
            url: 'https://www.10centagency.com/services/social-media-management',
          },
          {
            '@type': 'ListItem',
            position: 6,
            name: 'SEO, AEO & GEO',
            url: 'https://www.10centagency.com/services/seo-aeo-geo',
          },
          {
            '@type': 'ListItem',
            position: 7,
            name: 'Graphic Design',
            url: 'https://www.10centagency.com/services/graphic-design',
          },
        ],
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://www.10centagency.com/services#breadcrumb',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://www.10centagency.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Services',
            item: 'https://www.10centagency.com/services',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://www.10centagency.com/services#faq',
        mainEntity: faqsData.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
    ],
  };
}
