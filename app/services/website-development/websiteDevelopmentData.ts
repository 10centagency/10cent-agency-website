export interface FAQBlock {
  type: 'paragraph' | 'list';
  text?: string;
  items?: string[];
}

export interface FAQItem {
  id: string;
  question: string;
  answerText: string;
  blocks: FAQBlock[];
}

export interface StrategyTabItem {
  id: number;
  key: string;
  title: string;
  iconKey: string;
  paragraphs: string[];
}

export interface PipelineLine {
  type: 'prompt' | 'output' | 'success';
  text: string;
}

export interface PipelineStep {
  step: number;
  title: string;
  desc: string;
  iconKey: string;
  url: string;
  status: string;
  live?: boolean;
  lines: PipelineLine[];
}

export interface DecisionReason {
  title: string;
  desc: string;
  iconKey: string;
}

export interface TechPill {
  label: string;
  iconKey: string;
}

export interface DecisionPanelData {
  title: string;
  subtitle: string;
  badge: string;
  badgeType: 'wp' | 'next';
  headerType: 'wp' | 'next';
  chooseIf: DecisionReason[];
  avoidIf: DecisionReason[];
  techPills: TechPill[];
}

export interface QuizQuestion {
  id: string;
  points: number;
  title: string;
  desc: string;
  iconKey: string;
}

export interface QuizVerdict {
  cls: string;
  iconKey: string;
  title: string;
  text: string;
  label: string;
  cta: boolean;
}

export interface ServiceCard {
  id: string;
  badge: string;
  title: string;
  features: string[];
}

export interface TechCategoryItem {
  label: string;
  iconKey: string;
}

export interface TechCategory {
  id: string;
  title: string;
  iconKey: string;
  items: TechCategoryItem[];
}

export interface WhyChooseCard {
  id: string;
  title: string;
  desc: string;
  iconKey: string;
}

export interface CommonMistake {
  num: number;
  title: string;
  desc: string;
}

export interface PricingPackage {
  id: string;
  badge?: string;
  title: string;
  note: string;
  isPopular?: boolean;
  popularBadge?: string;
  features: string[];
  ctaText: string;
}

export interface IndustryCard {
  id: string;
  title: string;
  desc: string;
  iconKey: string;
}

export interface DHWCard {
  id: string;
  step: string;
  title: string;
  tagline: string;
  desc: string;
  iconKey: string;
}

export interface TestimonialCard {
  id: string;
  tag: string;
  stars: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  companyUrl: string;
  avatarInitials: string;
  avatarGradient: string;
}

export interface RelatedService {
  id: string;
  title: string;
  desc: string;
  href: string;
  iconKey: string;
}

/* ==========================================================================
   1. SERVICE CARDS (Exact 4 Cards from Attached Demo)
   ========================================================================== */
export const serviceCardsData: ServiceCard[] = [
  {
    id: 'personal-business',
    badge: 'One-time Project',
    title: 'Personal & Business Website',
    features: [
      'Custom design using your brand colors, fonts & style (up to 5-7 pages)',
      'Mobile responsive — Phone, Tablet & Desktop',
      'Domain & hosting setup, SSL certificate activation',
      'Basic on-page SEO, Google Search Console & Analytics 4 setup',
      'Contact form, WhatsApp chat button, Google Maps integration',
      '1 month free support (up to 3-4 revision requests)',
    ],
  },
  {
    id: 'landing-page',
    badge: 'One-time Project',
    title: 'Landing Page',
    features: [
      'High-converting design — Hero, Problem/Solution, Social Proof, FAQ, CTA',
      'Lead capture form, WhatsApp/Messenger CTA, countdown timer',
      'Facebook Pixel + Conversions API + Google Analytics 4 + UTM tracking',
      'Mobile-first, speed-optimized, sticky CTA for mobile',
      '1 month free support (up to 3-4 revision requests)',
    ],
  },
  {
    id: 'ecommerce',
    badge: 'One-time Project',
    title: 'E-Commerce Website',
    features: [
      'Full online store with up to 20 products, categories & filters',
      'Payment gateways: bKash, Nagad, Rocket, Credit/Debit (SSLCommerz)',
      'Shopping cart, coupon system, stock & order management',
      'Customer account system with order history',
      'Facebook Pixel e-commerce events + Google Analytics 4 e-commerce tracking',
      '1 month free support (up to 3-4 revision requests)',
    ],
  },
  {
    id: 'maintenance',
    badge: 'Monthly Retainer',
    title: 'Website Maintenance & Support',
    features: [
      'Regular WordPress core, theme & plugin updates',
      'Daily/weekly automated backups',
      'Uptime monitoring & security scanning',
      'Content updates — text, images, new pages/products',
      'Monthly speed & performance health report',
    ],
  },
];

/* ==========================================================================
   2. DEVELOPMENT PIPELINE STEPS
   ========================================================================== */
export const pipelineStepsData: PipelineStep[] = [
  {
    step: 0,
    title: 'Discovery Call',
    desc: 'Understanding your goals & requirements',
    iconKey: 'phone',
    url: 'localhost:3000/discovery',
    status: 'Gathering requirements...',
    lines: [
      { type: 'prompt', text: './discovery-call.sh --client="your-business"' },
      { type: 'output', text: 'Analyzing business goals...' },
      { type: 'output', text: 'Mapping required pages & features...' },
      { type: 'output', text: 'Defining project scope & timeline...' },
      { type: 'success', text: '✓ Discovery phase complete' },
    ],
  },
  {
    step: 1,
    title: 'Wireframe & Design',
    desc: 'Custom layout matching your brand',
    iconKey: 'design',
    url: 'localhost:3000/design-preview',
    status: 'Designing UI...',
    lines: [
      { type: 'prompt', text: 'npm run design -- --brand="your-colors"' },
      { type: 'output', text: 'Building wireframe layout...' },
      { type: 'output', text: 'Applying brand colors & fonts...' },
      { type: 'output', text: 'Designing responsive UI components...' },
      { type: 'success', text: '✓ Design approved by client' },
    ],
  },
  {
    step: 2,
    title: 'Development',
    desc: 'Building with the right technology',
    iconKey: 'code',
    url: 'localhost:3000/build',
    status: 'Compiling website...',
    lines: [
      { type: 'prompt', text: 'git checkout -b feature/website-build' },
      { type: 'output', text: 'Setting up WordPress + Elementor...' },
      { type: 'output', text: 'Coding custom functionality...' },
      { type: 'output', text: 'Integrating forms, APIs & tracking...' },
      { type: 'success', text: '✓ Development build complete' },
    ],
  },
  {
    step: 3,
    title: 'Testing & Review',
    desc: 'Cross-device testing & feedback',
    iconKey: 'test',
    url: 'staging.yourbusiness.com',
    status: 'Running tests...',
    lines: [
      { type: 'prompt', text: 'npm run test:all --env=staging' },
      { type: 'output', text: 'Testing across mobile, tablet & desktop...' },
      { type: 'output', text: 'PageSpeed score: 94/100 ✓' },
      { type: 'output', text: 'Collecting client feedback...' },
      { type: 'success', text: '✓ All tests passed' },
    ],
  },
  {
    step: 4,
    title: 'Launch & Support',
    desc: 'Going live + 1 month free support',
    iconKey: 'rocket',
    url: 'yourbusiness.com',
    status: 'LIVE',
    live: true,
    lines: [
      { type: 'prompt', text: 'npm run deploy --env=production' },
      { type: 'output', text: 'Uploading files to live server...' },
      { type: 'output', text: 'SSL certificate activated 🔒' },
      { type: 'output', text: 'Website is now LIVE 🚀' },
      { type: 'success', text: '✓ 1-month free support activated' },
    ],
  },
];

/* ==========================================================================
   3. STRATEGY TABS DATA
   ========================================================================== */
export const strategyTabsData: StrategyTabItem[] = [
  {
    id: 0,
    key: 'ux-ui',
    title: 'UX/UI Design',
    iconKey: 'ux-ui',
    paragraphs: [
      'Before any design work begins, we map out the ideal user journey — what a visitor should see first, what questions they need answered, and what action they should take next. This wireframing step prevents cluttered, confusing layouts that cause visitors to bounce.',
      "We design using your brand's colors, fonts, and tone of voice so the website feels like a natural extension of your business, not a generic template. Every button, form, and section is placed with a clear purpose — guiding visitors toward calling, messaging, or purchasing.",
      'For Bangladeshi audiences, we also design with local browsing habits in mind — clear WhatsApp/Messenger buttons, Bangla language options where needed, and trust signals like customer reviews and business credentials placed prominently.',
    ],
  },
  {
    id: 1,
    key: 'speed',
    title: 'Speed & Performance',
    iconKey: 'speed',
    paragraphs: [
      'Page speed directly affects both user experience and Google rankings. A website that takes more than 3 seconds to load can lose over half its visitors before the page even finishes rendering. We optimize every website for speed from the ground up — compressed images, efficient code, caching, and a reliable hosting setup.',
      'We use lightweight, well-coded themes and only the plugins that are truly necessary, avoiding the bloated plugin stacks that slow down many WordPress sites. Every website we deliver is tested using Google PageSpeed Insights and GTmetrix before launch.',
      'For businesses with heavier traffic needs (e-commerce, high-traffic landing pages), we also recommend appropriate hosting tiers and implement CDN (Content Delivery Network) setup where needed.',
    ],
  },
  {
    id: 2,
    key: 'seo',
    title: 'On-Page SEO Foundation',
    iconKey: 'seo',
    paragraphs: [
      "A beautiful website that Google can't understand won't bring you organic traffic. Every website we build includes proper on-page SEO foundations — optimized meta titles and descriptions, header tag structure (H1, H2, H3), image alt text, and clean URL structures.",
      'We connect Google Search Console and Google Analytics 4 from day one, submit an XML sitemap, and ensure the site is fully crawlable and indexable. This gives your website the technical foundation it needs to start ranking — even before you invest in a dedicated ongoing SEO campaign.',
      'For businesses ready to actively compete for search rankings, our website development pairs seamlessly with our dedicated SEO service for continued keyword targeting and content growth.',
    ],
  },
  {
    id: 3,
    key: 'mobile',
    title: 'Mobile Responsiveness',
    iconKey: 'mobile',
    paragraphs: [
      'The majority of web traffic in Bangladesh comes from mobile devices. Every website we build is designed mobile-first, meaning we design and test the mobile experience with the same care as desktop — not as an afterthought.',
      'This includes touch-friendly buttons, properly sized text without zooming, optimized images for mobile data usage, and sticky call-to-action buttons (like a floating WhatsApp button) that stay accessible as visitors scroll.',
      "We test every website across real devices — Android and iPhone, various screen sizes — before handing it over, not just in a browser's simulated mobile view.",
    ],
  },
  {
    id: 4,
    key: 'payment',
    title: 'Payment & E-Commerce Integration',
    iconKey: 'payment',
    paragraphs: [
      'For e-commerce clients, we integrate the payment methods Bangladeshi customers actually use and trust — bKash, Nagad, Rocket, and card payments through SSLCommerz. We set up the full purchase flow: product catalog, cart, checkout, order confirmation, and email/SMS notifications.',
      'We also configure stock management, coupon/discount codes, and a customer account area where buyers can track their order history — reducing manual customer service work for you.',
      'Every e-commerce build includes Facebook Pixel e-commerce events (Add to Cart, Purchase, etc.) and Google Analytics 4 e-commerce tracking, so your ad campaigns and reporting reflect real sales data.',
    ],
  },
  {
    id: 5,
    key: 'security',
    title: 'Security & SSL',
    iconKey: 'security',
    paragraphs: [
      'Every website we launch includes a properly configured SSL certificate (the "https" padlock), which is essential for both customer trust and Google ranking factors. Without it, browsers flag your site as "Not Secure" — an instant credibility killer, especially for e-commerce.',
      'We also apply basic security hardening — limiting login attempts, disabling unnecessary file editing, and keeping core software updated — to reduce the risk of hacking, a common issue with poorly maintained WordPress sites.',
      'For clients on our Website Maintenance retainer, we go further with regular malware scanning and automated backups, so you always have a clean recovery point if anything goes wrong.',
    ],
  },
  {
    id: 6,
    key: 'analytics',
    title: 'Analytics & Tracking',
    iconKey: 'analytics',
    paragraphs: [
      "A website without tracking is a website you're flying blind on. We set up Google Analytics 4 on every project to track visitor behavior — where traffic comes from, which pages perform best, and where visitors drop off.",
      'For landing pages and e-commerce sites, we also install the Facebook Pixel and Conversions API so paid ad performance can be measured accurately, and UTM parameters so you know exactly which campaign or channel is driving your best traffic.',
      "This tracking foundation makes it possible to make informed decisions later — whether that's investing more in Facebook ads, SEO, or specific product pages that are already converting well.",
    ],
  },
];

/* ==========================================================================
   4. TECH STACK SHOWCASE
   ========================================================================== */
export const techStackData: TechCategory[] = [
  {
    id: 'cms',
    title: 'CMS & Website Builder',
    iconKey: 'layer-group',
    items: [
      { label: 'WordPress', iconKey: 'wordpress' },
      { label: 'Elementor', iconKey: 'elementor' },
      { label: 'WooCommerce', iconKey: 'woocommerce' },
    ],
  },
  {
    id: 'custom-dev',
    title: 'Custom Web Development',
    iconKey: 'laptop-code',
    items: [
      { label: 'React', iconKey: 'react' },
      { label: 'Next.js', iconKey: 'nextjs' },
      { label: 'Supabase', iconKey: 'supabase' },
      { label: 'VS Code', iconKey: 'vscode' },
    ],
  },
  {
    id: 'hosting',
    title: 'Hosting & Infrastructure',
    iconKey: 'server',
    items: [
      { label: 'cPanel Hosting', iconKey: 'server' },
      { label: 'Vercel', iconKey: 'vercel' },
      { label: 'Cloudflare', iconKey: 'cloudflare' },
      { label: 'SSL Security', iconKey: 'shield' },
    ],
  },
  {
    id: 'payments-analytics',
    title: 'Payments & Analytics',
    iconKey: 'chart-line',
    items: [
      { label: 'SSLCommerz', iconKey: 'credit-card' },
      { label: 'bKash / Nagad API', iconKey: 'mobile' },
      { label: 'Google Analytics 4', iconKey: 'google' },
      { label: 'Search Console', iconKey: 'search' },
    ],
  },
];

/* ==========================================================================
   5. WORDPRESS VS NEXT.JS DECISION GUIDE
   ========================================================================== */
export const decisionGuideData: { wp: DecisionPanelData; next: DecisionPanelData } = {
  wp: {
    title: 'WordPress + Elementor',
    subtitle: 'Best for: Small & Medium Business Websites',
    badge: '⭐ Most Popular Choice',
    badgeType: 'wp',
    headerType: 'wp',
    chooseIf: [
      {
        title: 'You want to manage content yourself',
        desc: "Elementor's drag-and-drop editor lets you update text, images, and pages without touching a single line of code.",
        iconKey: 'user',
      },
      {
        title: 'You need a cost-effective solution',
        desc: 'WordPress is the most affordable and feature-rich option for standard business websites — maximum value for your investment.',
        iconKey: 'coins',
      },
      {
        title: 'You need an e-commerce store',
        desc: 'WooCommerce integrates seamlessly with local payment gateways — bKash, Nagad, Rocket, and SSLCommerz — out of the box.',
        iconKey: 'store',
      },
      {
        title: 'You want to launch quickly',
        desc: 'A complete, professional website ready in 7–14 working days — the fastest path from idea to live site.',
        iconKey: 'rocket',
      },
      {
        title: 'You need a blog or content section',
        desc: "WordPress's built-in content management system is the industry standard for blogging, SEO content, and portfolio pages.",
        iconKey: 'blog',
      },
    ],
    avoidIf: [
      {
        title: 'You need a complex custom database',
        desc: 'Real-time data processing, custom dashboards, or advanced API integrations push beyond what WordPress handles well.',
        iconKey: 'database',
      },
      {
        title: 'You expect very high traffic volumes',
        desc: 'Extremely high-traffic applications require a custom infrastructure that WordPress alone cannot efficiently support.',
        iconKey: 'users',
      },
      {
        title: 'You need a fully custom web application',
        desc: 'SaaS platforms, booking engines, or complex business logic tools are better served by a custom-coded Next.js solution.',
        iconKey: 'gears',
      },
    ],
    techPills: [
      { label: 'WordPress', iconKey: 'wordpress' },
      { label: 'Elementor', iconKey: 'elementor' },
      { label: 'WooCommerce', iconKey: 'woocommerce' },
      { label: 'cPanel Hosting', iconKey: 'server' },
      { label: 'SSL', iconKey: 'shield' },
    ],
  },
  next: {
    title: 'Next.js / React',
    subtitle: 'Best for: Custom Web Apps & High-Performance Projects',
    badge: '⚡ High Performance',
    badgeType: 'next',
    headerType: 'next',
    chooseIf: [
      {
        title: 'You need extreme performance',
        desc: 'Server-side rendering and static generation deliver lightning-fast load times — consistently hitting 90+ PageSpeed scores.',
        iconKey: 'bolt',
      },
      {
        title: 'You need a custom web application',
        desc: 'Booking systems, user dashboards, SaaS platforms, or any project with complex, custom business logic.',
        iconKey: 'gears',
      },
      {
        title: 'You need real-time data or API integration',
        desc: 'Live inventory updates, real-time messaging, third-party API connections, or advanced data management requirements.',
        iconKey: 'database',
      },
      {
        title: 'You want a future-proof, scalable platform',
        desc: 'Built on modern architecture — your platform grows with your business without needing a full rebuild later.',
        iconKey: 'trend-up',
      },
      {
        title: 'You require advanced security',
        desc: 'Handling sensitive user data, financial transactions, or enterprise-grade security standards that go beyond standard website needs.',
        iconKey: 'lock',
      },
    ],
    avoidIf: [
      {
        title: 'You want to update content yourself easily',
        desc: "Custom-coded sites require technical knowledge for content changes — there's no visual drag-and-drop editor like Elementor.",
        iconKey: 'user-pen',
      },
      {
        title: 'You need to launch as fast as possible',
        desc: 'Custom development takes longer by nature — for a standard business website, this approach is unnecessary and inefficient.',
        iconKey: 'clock',
      },
      {
        title: "You're working with a tight budget",
        desc: 'Custom development costs more. For a straightforward business website, WordPress delivers the same results at a fraction of the investment.',
        iconKey: 'coins',
      },
    ],
    techPills: [
      { label: 'React', iconKey: 'react' },
      { label: 'Next.js', iconKey: 'nextjs' },
      { label: 'Supabase', iconKey: 'supabase' },
      { label: 'Vercel', iconKey: 'vercel' },
      { label: 'Cloudflare', iconKey: 'cloudflare' },
    ],
  },
};

/* ==========================================================================
   6. WHY WORK WITH US
   ========================================================================== */
export const whyChooseUsData: WhyChooseCard[] = [
  {
    id: 'right-tech',
    title: 'Right Tech for Your Business',
    desc: "Whether it's WordPress & Elementor for easy self-management, or custom Next.js/React for advanced performance — we choose the right technology for your goals, not a one-size-fits-all approach.",
    iconKey: 'code',
  },
  {
    id: 'speed-optimized',
    title: 'Speed-Optimized by Default',
    desc: 'Every site is tested for load speed before launch — no bloated themes or unnecessary plugins.',
    iconKey: 'gauge',
  },
  {
    id: 'mobile-first',
    title: 'Mobile-First Design',
    desc: 'Designed and tested for the majority of your visitors — mobile users — from day one.',
    iconKey: 'mobile',
  },
  {
    id: 'seo-ready',
    title: 'SEO-Ready Structure',
    desc: 'Built with proper on-page SEO foundations so your site is ready to rank, not built and abandoned.',
    iconKey: 'seo-chart',
  },
  {
    id: 'free-support',
    title: '1 Month Free Support',
    desc: 'Every project includes a full month of post-launch support and revision requests, no extra charge.',
    iconKey: 'headset',
  },
  {
    id: 'transparent-pricing',
    title: 'Transparent, Fixed Pricing',
    desc: 'Clear project scope and pricing agreed upfront — no hidden charges after work begins.',
    iconKey: 'tag',
  },
];

/* ==========================================================================
   7. 5 COMMON WEBSITE MISTAKES
   ========================================================================== */
export const commonMistakesData: CommonMistake[] = [
  {
    num: 1,
    title: 'Slow Loading Speed',
    desc: 'Heavy, uncompressed images and bloated themes cause pages to load slowly, driving visitors away before they even see your content. We optimize every asset and choose lightweight themes to keep load times under 3 seconds.',
  },
  {
    num: 2,
    title: 'Not Mobile Responsive',
    desc: 'Many older or DIY websites look fine on desktop but break on mobile — text too small, buttons overlapping. Since most Bangladeshi traffic is mobile, this alone can cost a business the majority of its potential customers.',
  },
  {
    num: 3,
    title: 'No Clear Call-to-Action',
    desc: "Visitors land on a page and don't know what to do next — call, message, or buy. Every page we design has a clear, prominent CTA guiding the visitor toward the next step.",
  },
  {
    num: 4,
    title: 'Missing SSL Certificate & Basic SEO',
    desc: 'Without SSL, browsers flag your site as "Not Secure." Without basic on-page SEO, Google can\'t understand or rank your content. Both are foundational elements we set up on every project, never an afterthought.',
  },
  {
    num: 5,
    title: 'Launching and Forgetting About It',
    desc: "A website isn't a one-time task — plugins need updates, backups need to run, and content needs refreshing. Sites left unmaintained become security risks and slowly lose search rankings. Our Website Maintenance retainer solves this ongoing gap.",
  },
];

/* ==========================================================================
   8. SELF-CHECK QUIZ DATA
   ========================================================================== */
export const quizQuestionsData: QuizQuestion[] = [
  {
    id: 'no-website',
    points: 2,
    title: 'My business has no website at all',
    desc: "Competitors are online and visible — I'm not",
    iconKey: 'globe',
  },
  {
    id: 'not-mobile',
    points: 2,
    title: 'My website is not mobile-optimized',
    desc: "It doesn't display or work properly across phones, tablets, and different screen sizes",
    iconKey: 'mobile',
  },
  {
    id: 'slow-load',
    points: 2,
    title: 'My website loads very slowly',
    desc: 'Pages take more than 3–4 seconds — visitors leave before it even loads',
    iconKey: 'gauge',
  },
  {
    id: 'no-leads',
    points: 2,
    title: 'My website gets traffic but generates no leads or sales',
    desc: 'People visit but never call, message, or purchase',
    iconKey: 'pointer',
  },
  {
    id: 'outdated-design',
    points: 2,
    title: 'My website looks outdated and unprofessional',
    desc: 'The design is old — it no longer reflects the quality of my business',
    iconKey: 'frown',
  },
];

export const quizVerdictsData: Record<string, QuizVerdict> = {
  zero: {
    cls: '',
    iconKey: 'question',
    title: 'Tell us your situation',
    text: "Select the statements above that match your current situation — we'll give you an honest, no-pressure recommendation.",
    label: 'Select an item to begin',
    cta: false,
  },
  low: {
    cls: 'verdictLow',
    iconKey: 'check-circle',
    title: 'Your website is in decent shape',
    text: 'Only 1–2 minor issues identified. A small tune-up or a monthly maintenance plan may be all you need right now.',
    label: 'Minor improvements recommended',
    cta: true,
  },
  medium: {
    cls: 'verdictMedium',
    iconKey: 'warning',
    title: 'Your website needs a serious upgrade',
    text: 'Several key issues are likely costing you leads and sales every day. A redesign or a full rebuild would make a measurable difference.',
    label: 'Significant issues identified',
    cta: true,
  },
  high: {
    cls: 'verdictHigh',
    iconKey: 'exclamation',
    title: 'You need a new website — right now',
    text: 'Your current online presence is actively losing you customers. A professional, well-built website could turn this around faster than you think.',
    label: 'Immediate action recommended',
    cta: true,
  },
};

/* ==========================================================================
   9. PRICING PACKAGES
   ========================================================================== */
export const pricingPackagesData: PricingPackage[] = [
  {
    id: 'landing-page',
    badge: 'Best for Startups',
    title: 'Landing Page',
    note: 'Perfect for a single product launch or ad campaign',
    features: [
      '1 high-converting page',
      'Lead form + WhatsApp CTA',
      'Pixel + GA4 tracking setup',
      '1 month free support',
    ],
    ctaText: 'Get Custom Quote',
  },
  {
    id: 'business-website',
    isPopular: true,
    popularBadge: 'Most Popular',
    title: 'Business Website',
    note: 'For businesses that need a full professional online presence',
    features: [
      'Up to 5-7 custom pages',
      'Domain, hosting & SSL setup',
      'Basic on-page SEO + GSC/GA4',
      'Contact form, maps, WhatsApp button',
      '1 month free support',
    ],
    ctaText: 'Get Custom Quote',
  },
  {
    id: 'ecommerce-store',
    badge: 'Best for Selling Online',
    title: 'E-Commerce Store',
    note: 'For businesses ready to sell products online',
    features: [
      'Up to 20 products with categories',
      'bKash/Nagad/Rocket/Card payments',
      'Cart, coupons, order management',
      'Facebook Pixel + GA4 e-commerce tracking',
      '1 month free support',
    ],
    ctaText: 'Get Custom Quote',
  },
];

/* ==========================================================================
   10. INDUSTRIES WE SERVE
   ========================================================================== */
export const industriesData: IndustryCard[] = [
  {
    id: 'restaurant-food',
    title: 'Restaurant & Food',
    desc: 'Online menus, table reservation forms, and delivery-order integration to keep your tables and orders full.',
    iconKey: 'utensils',
  },
  {
    id: 'ecommerce',
    title: 'E-commerce',
    desc: 'Full online stores with bKash/Nagad payments, product catalogs, and conversion tracking built in.',
    iconKey: 'cart',
  },
  {
    id: 'real-estate',
    title: 'Real Estate',
    desc: 'Property listing pages, inquiry forms, and lead capture systems designed to convert serious buyers.',
    iconKey: 'house',
  },
  {
    id: 'healthcare',
    title: 'Healthcare',
    desc: 'Appointment booking forms, service pages, and trust-building design for clinics and healthcare providers.',
    iconKey: 'heart',
  },
  {
    id: 'education',
    title: 'Education',
    desc: 'Course listing pages, admission forms, and content structures built for schools, coaching centers, and institutes.',
    iconKey: 'graduation',
  },
  {
    id: 'professional-services',
    title: 'Professional Services',
    desc: 'Clean, credibility-focused websites for consultants, agencies, and B2B service providers.',
    iconKey: 'briefcase',
  },
];

/* ==========================================================================
   11. DOMAIN VS HOSTING VS WEBSITE
   ========================================================================== */
export const domainHostingWebsiteData: DHWCard[] = [
  {
    id: 'domain',
    step: '01',
    title: 'Domain',
    tagline: "Your business's address / name",
    desc: "A Domain is your website's name — like yourbusiness.com. People type this into their browser to find you. Think of it like your shop's street address.",
    iconKey: 'signature',
  },
  {
    id: 'hosting',
    step: '02',
    title: 'Hosting',
    tagline: 'The land your website sits on',
    desc: "Hosting is a server (a computer) where all your website's files, images, and data are stored. Without it, your domain has nowhere to point to — like having an address but no land to build on.",
    iconKey: 'server',
  },
  {
    id: 'website',
    step: '03',
    title: 'Website',
    tagline: 'Your actual shop / business',
    desc: 'The Website is the actual "shop" built on that land with that address — the design, pages, content, and features your customers see and use to make decisions.',
    iconKey: 'display',
  },
];

/* ==========================================================================
   12. FREQUENTLY ASKED QUESTIONS (Exact 8 Detailed FAQs)
   ========================================================================== */
export const faqsData: FAQItem[] = [
  {
    id: 'build-timeline',
    question: 'How long does it take to build a website?',
    answerText:
      'It depends on the type of project. Landing pages typically take 5-7 working days, personal/business websites take 7-14 working days, and e-commerce stores take 14-21 working days. The timeline assumes content such as logo, photos, and text is provided on time, since content delays are the most common reason projects run longer. We share progress updates on WhatsApp after every milestone, and urgent projects can be prioritised during festival or product-launch seasons.',
    blocks: [
      {
        type: 'paragraph',
        text: 'It depends on the type of project, and we always give you a clear timeline in writing before work begins. As a general guide:',
      },
      {
        type: 'list',
        items: [
          'Landing Page: 5–7 working days',
          'Personal / Business Website (5–7 pages): 7–14 working days',
          'E-Commerce Store (up to 20 products): 14–21 working days',
        ],
      },
      {
        type: 'paragraph',
        text: 'These timelines assume we receive the content we need from you — logo, product photos, text — on time, because content delays are the most common reason a project runs longer than planned. We send you progress updates on WhatsApp after every milestone, so you always know exactly where your project stands. And if you need the site urgently (for example, before a product launch or festival sale), tell us during the consultation — we can often prioritise your project.',
      },
    ],
  },
  {
    id: 'full-ownership',
    question: "Will I fully own the website after it's built?",
    answerText:
      "Yes, 100%. Once the project is completed and the final payment is made, you own everything: website files, design, domain, and hosting account access. There is no vendor lock-in. We register the domain and hosting in your name so the accounts belong to you from day one, and we hand over all admin credentials with a short training session. If you ever move to another developer, you can take the entire site with you.",
    blocks: [
      {
        type: 'paragraph',
        text: "Yes — 100%. Once your project is completed and the final payment is made, you own everything: the website files, the design, the domain, and the hosting account access. There is no vendor lock-in, and no “we'll hold your site until you pay us more” games — that's simply not how we work.",
      },
      {
        type: 'paragraph',
        text: "We register the domain and hosting in your name, not ours, so the accounts belong to you from day one. You also receive all admin credentials plus a short handover session showing you how to access everything. If you ever decide to move to a different developer or agency, you can take the whole site with you — we'll even help you export it.",
      },
    ],
  },
  {
    id: 'domain-hosting-included',
    question: 'Is domain and hosting cost included in the package?',
    answerText:
      'The project package includes complete setup of your domain and hosting, including SSL activation, at no extra setup charge. You only pay the yearly renewal fee to the domain and hosting providers. For a standard business website the total yearly cost is usually between 3,000 and 7,000 BDT depending on the hosting tier. We recommend the most affordable plan that still delivers good speed and reliability, and we send renewal reminders so your website never expires unexpectedly.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Your project package includes the complete setup of your domain and hosting — we register the domain, configure the hosting server, connect them together, and activate the SSL certificate for you, all at no extra setup charge. What you pay separately is the yearly renewal fee, which is billed by the domain and hosting providers themselves, not by us.',
      },
      {
        type: 'paragraph',
        text: "For a standard business website, the total yearly cost (domain + hosting) is usually between 3,000–7,000 BDT depending on the hosting tier. We recommend the most affordable plan that still gives you good speed and reliability, and we show you exactly what you're paying for before anything is purchased. We also keep renewal reminders and can handle the renewal process for you, so your website never expires unexpectedly.",
      },
    ],
  },
  {
    id: 'update-content-self',
    question: 'Can I update the website content myself after it’s launched?',
    answerText:
      'Yes. For WordPress and Elementor websites, you get a recorded video tutorial plus a live training session on updating text, images, blog posts, and products. The visual page builder is beginner-friendly, and most clients manage their own content within the first week. For custom Next.js/React websites, we set up a simple admin panel and provide the same training. Our monthly maintenance retainer can also handle content updates for you if you prefer.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Absolutely — and we make sure of it. For WordPress & Elementor websites, you get a recorded video tutorial plus a live training session where we walk you through updating text, images, blog posts, and products step by step. The Elementor page builder is visual and beginner-friendly — most of our clients are editing their own content confidently within the first week.',
      },
      {
        type: 'paragraph',
        text: "For custom-coded websites (Next.js/React), we set up a simple admin panel that lets you manage content without touching any code, and you get the same training. You're also never completely on your own: if something feels too technical, our monthly Website Maintenance retainer handles content updates for you, and even after the free support period ends, we're just one WhatsApp message away if you have questions.",
      },
    ],
  },
  {
    id: 'payment-gateways',
    question: 'What payment gateways can be integrated into an e-commerce website?',
    answerText:
      'We integrate bKash, Nagad, Rocket, and credit/debit card payments through SSLCommerz, the most widely used gateway in Bangladesh. We can also set up manual bank transfer and cash on delivery options. We handle the full checkout experience, including order confirmation, payment status updates, and automatic notifications, and we guide you through opening your bKash Merchant and SSLCommerz accounts step by step — no technical background needed.',
    blocks: [
      {
        type: 'paragraph',
        text: 'We integrate all the payment methods Bangladeshi customers actually use: bKash, Nagad, Rocket, and Credit/Debit cards — all processed securely through SSLCommerz, Bangladesh’s most widely used payment gateway.',
      },
      {
        type: 'paragraph',
        text: 'Besides online payments, we can also set up manual bank transfer, cash on delivery, and a simple “pay on delivery” flow, so no customer is ever blocked from completing an order. We handle the full checkout experience — order confirmation, payment status updates, and automatic order notifications — and we guide you through opening your merchant accounts (bKash Merchant, SSLCommerz) step by step. You don’t need any technical background; we coordinate directly with the gateway providers on your behalf.',
      },
    ],
  },
  {
    id: 'more-features-later',
    question: 'What if I need more pages or features after the website is launched?',
    answerText:
      'Small fixes and content tweaks are covered by the free support month with up to 3-4 revision requests. New pages, features, or major design changes are quoted separately based on scope, so you always know the cost before work starts. If you expect ongoing changes, our monthly Website Maintenance retainer is more economical and also includes backups and security monitoring.',
    blocks: [
      {
        type: 'paragraph',
        text: 'That’s completely normal — businesses grow, and websites should grow with them. During your first month, our free support includes up to 3–4 revision requests, which covers small fixes and content tweaks such as changing text, swapping images, or adjusting a section.',
      },
      {
        type: 'paragraph',
        text: 'Anything beyond that — a new page, a new feature, or a major design change — is quoted separately based on scope, so you always know the cost before we start. If you expect ongoing changes, our monthly Website Maintenance retainer is the more economical option: it includes a set number of content updates and small changes every month, plus backups and security monitoring. Many of our clients start the retainer right after launch so the momentum never stops.',
      },
    ],
  },
  {
    id: 'google-ranking',
    question: 'Will my website rank on Google?',
    answerText:
      'We set up the technical SEO foundation on every website: meta titles and descriptions, clean URLs, header tags, image alt text, an XML sitemap, and Google Search Console and Analytics 4 connections. But we are honest that ranking takes time — typically 2-6 months for a new website depending on competition — and nobody can guarantee a number-one position. For active ranking growth, our separate Monthly SEO service provides content and keyword work.',
    blocks: [
      {
        type: 'paragraph',
        text: 'We set up a strong technical foundation on every website so that ranking is possible: optimized meta titles and descriptions, clean URL structure, proper header tags, image alt text, an XML sitemap, and connections to Google Search Console and Google Analytics 4. In other words, we make sure Google can find, understand, and index your site from day one.',
      },
      {
        type: 'paragraph',
        text: 'However, we want to be honest with you: nobody can guarantee a #1 ranking, and ranking takes time — typically 2–6 months for a new website, depending on your industry and competition. To actively climb the rankings, you need consistent content, backlinks, and keyword targeting — which is exactly what our separate Monthly SEO service does. If you choose it, we plan the SEO work together with your website from the very start, so nothing has to be rebuilt later.',
      },
    ],
  },
  {
    id: 'wordpress-only',
    question: 'Do you only build websites with WordPress?',
    answerText:
      'No. WordPress + Elementor is our recommendation for most small and medium business websites because it is affordable and easy to manage. For projects needing custom functionality such as booking systems, user dashboards, SaaS platforms, real-time data, or very high traffic, we build custom-coded websites with Next.js and React on modern infrastructure like Vercel and Supabase. During the free consultation, we recommend the right technology for your goals and budget.',
    blocks: [
      {
        type: 'paragraph',
        text: 'No. WordPress + Elementor is our recommendation for most small and medium business websites, because it’s affordable, fast to launch, and easy for you to manage yourself. But it’s not the right tool for every project.',
      },
      {
        type: 'paragraph',
        text: 'For projects that need custom functionality — such as booking systems, user dashboards, SaaS platforms, real-time data, or very high traffic — we build custom-coded websites with Next.js and React, hosted on modern infrastructure like Vercel and Supabase. During your free consultation, we listen to your goals and budget and recommend the right technology with an honest explanation. If WordPress is the better fit for your budget, we’ll tell you that too — we’d rather recommend the right solution than the most expensive one.',
      },
    ],
  },
];

/* ==========================================================================
   13. TESTIMONIALS DATA
   ========================================================================== */
export const testimonialsData: TestimonialCard[] = [
  {
    id: 'fabrinest',
    tag: 'Business Website',
    stars: '★★★★★',
    quote:
      '"Our website used to load slowly and we had no proper way to track our stock. 10 Cent Agency optimized the site and it now loads much faster, and the inventory management web app they built lets us track fabric stock and orders in real time. Managing the business has become a lot easier."',
    author: 'Kawsar Rahman',
    role: 'Owner',
    company: 'Fabrinest Curtains',
    companyUrl: 'https://fabrinestcurtains.com',
    avatarInitials: 'KR',
    avatarGradient: 'linear-gradient(135deg, #1f5fb0, #0f2547)',
  },
  {
    id: 'roadsafety',
    tag: 'Portfolio Website',
    stars: '★★★★★',
    quote:
      '"10 Cent Agency built our complete website from scratch — company profile, products, and project portfolio. Now customers can find us on Google and see our safety equipment and services before contacting us. We receive regular inquiries through the website, which we didn\'t have before."',
    author: 'Md Rajib Hossain',
    role: 'Proprietor',
    company: 'Road Safety Solutions',
    companyUrl: 'https://roadsafetysolutionbd.com',
    avatarInitials: 'RH',
    avatarGradient: 'linear-gradient(135deg, #0d9488, #134e4a)',
  },
  {
    id: 'fccollection',
    tag: 'Landing Page',
    stars: '★★★★★',
    quote:
      '"We use the landing page for our Facebook ads, and it converts really well — visitors land on the page and order directly through WhatsApp. The page loads fast on mobile and looks professional. Our ads perform much better now than when they were going to our old page."',
    author: 'Mahather Mohammad',
    role: 'Owner',
    company: 'FC Collection BD',
    companyUrl: 'https://fccollectionbd.shop',
    avatarInitials: 'MM',
    avatarGradient: 'linear-gradient(135deg, #7c3aed, #4c1d95)',
  },
];

/* ==========================================================================
   15. CONNECTED SCHEMA.ORG @GRAPH
   ========================================================================== */
export function getWebsiteDevelopmentSchemaGraph() {
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
        description:
          'Affordable digital marketing agency in Bangladesh helping small businesses grow online with Facebook ads, websites & AI automation.',
        telephone: '+8801615144114',
        email: 'hello@10centagency.com',
        priceRange: '৳৳',
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
        '@id': 'https://www.10centagency.com/services/website-development#webpage',
        url: 'https://www.10centagency.com/services/website-development',
        name: 'Website Development Services in BD | 10 Cent Agency',
        description:
          'Fast, mobile-first websites & e-commerce stores — WordPress, Next.js, bKash/Nagad payment, SEO setup & 1 month free support. Get a free quote today.',
        inLanguage: 'en-BD',
        isPartOf: {
          '@id': 'https://www.10centagency.com/#website',
        },
        breadcrumb: {
          '@id': 'https://www.10centagency.com/services/website-development#breadcrumb',
        },
        about: {
          '@id': 'https://www.10centagency.com/services/website-development#service',
        },
      },
      {
        '@type': 'Service',
        '@id': 'https://www.10centagency.com/services/website-development#service',
        name: 'Website Development',
        serviceType: 'Website Development',
        url: 'https://www.10centagency.com/services/website-development',
        description:
          '10 Cent Agency provides complete website development services in Bangladesh including personal & business websites, high-converting landing pages, and full e-commerce stores — built with WordPress & Elementor or custom-coded with Next.js and React.',
        provider: {
          '@id': 'https://www.10centagency.com/#organization',
        },
        mainEntityOfPage: {
          '@id': 'https://www.10centagency.com/services/website-development#webpage',
        },
        areaServed: {
          '@type': 'Country',
          name: 'Bangladesh',
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://www.10centagency.com/services/website-development#breadcrumb',
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
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Website Development',
            item: 'https://www.10centagency.com/services/website-development',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://www.10centagency.com/services/website-development#faq',
        mainEntity: faqsData.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answerText,
          },
        })),
      },
    ],
  };
}
