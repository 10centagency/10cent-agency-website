export interface OverviewBarItem {
  label: string;
  rate: string;
  width: string;
}

export interface OverviewCompareData {
  without: {
    label: string;
    sub: string;
    width: string;
    innerText: string;
  };
  with: {
    label: string;
    sub: string;
    width: string;
    innerText: string;
  };
}

export interface TimelineNodeItem {
  id: string;
  year: string;
  title: string;
  description: string;
  iconKey: string;
  isNow?: boolean;
}

export interface ComparisonRow {
  factor: string;
  seo: string;
  aeo: string;
  geo: string;
}

export interface ServiceCardItem {
  id: string;
  badge: string;
  title: string;
  checklist: string[];
}

export interface HowWeWorkStepItem {
  stepNumber: number;
  stepTag: string;
  title: string;
  description: string;
  iconKey: string;
}

export interface StrategyTabItem {
  id: number;
  title: string;
  iconKey: string;
  paragraphs: string[];
}

export interface AICitationData {
  assistantTitle: string;
  liveBadgeText: string;
  userQuestion: string;
  aiAnswerPrefix: string;
  aiAnswerBold: string;
  aiAnswerBody: string;
  citationSource: string;
  captionText: string;
}

export interface TechToolItem {
  label: string;
  iconKey: string;
}

export interface TechCategoryItem {
  id: string;
  title: string;
  iconKey: string;
  items: TechToolItem[];
}

export interface WhyChooseItem {
  id: string;
  title: string;
  description: string;
  iconKey: string;
}

export interface VsAgencyComparison {
  traditional: {
    badge: string;
    title: string;
    points: string[];
  };
  us: {
    badge: string;
    title: string;
    points: string[];
  };
}

export interface CommonMistakeItem {
  number: number;
  title: string;
  description: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  isReady: boolean;
}

export interface StatItem {
  id: string;
  targetNumber: number;
  suffix: string;
  label: string;
}

export interface PricingTierItem {
  id: string;
  badge: string;
  isPopular?: boolean;
  name: string;
  note: string;
  features: string[];
  ctaText: string;
  ctaHref: string;
}

export interface IndustryItem {
  id: string;
  searchQuery: string;
  title: string;
  description: string;
  iconKey: string;
  tagText: string;
}

export interface FAQBlock {
  type: 'paragraph' | 'list';
  text?: string;
  items?: string[];
}

export interface FAQItem {
  id: string;
  question: string;
  schemaText: string;
  blocks: FAQBlock[];
}

export interface TestimonialItem {
  id: string;
  rating: number;
  tag: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  initials: string;
  avatarClass: 'avNavy' | 'avBlue' | 'avDeep';
}

export interface RelatedServiceItem {
  id: string;
  title: string;
  description: string;
  href: string;
  iconKey: string;
}

/* ==========================================================================
   1. SERP QUICK ANSWER MOCKUP DATA
   ========================================================================== */
export const serpMockupData = {
  urlBar: 'search-results-preview.com/results?q=seo+aeo+geo',
  query: 'what is seo, aeo and geo optimization?',
  tabs: ['All', 'AI Overview', 'Images', 'News'],
  aiOverview: {
    tag: 'GEO',
    title: 'AI Overview',
    bodyBeforeBold: 'SEO, AEO, and GEO are three layers of search visibility. SEO ranks your website in traditional search results. AEO structures content so it\'s chosen as a direct answer. GEO ensures your brand is understood and cited by AI tools like ChatGPT, Gemini, and Google AI Overviews. ',
    boldText: '10 Cent Agency',
    bodyAfterBold: ' builds all three into one strategy.',
  },
  featuredSnippet: {
    tag: 'Featured Snippet',
    body: 'Answer Engine Optimization (AEO) is the process of structuring website content — using schema markup, FAQ formatting, and clear definitions — so search engines can extract it as a direct answer shown at "Position 0," above all regular search results.',
    source: '10centagency.com › services › seo-aeo-geo',
  },
  organicResult: {
    faviconText: '10',
    url: '10centagency.com › services › seo-aeo-geo',
    title: 'SEO, AEO & GEO Services in Bangladesh | 10 Cent Agency',
    description: 'Complete Search, Answer & Generative Engine Optimization services — on-page, technical, local SEO, structured data, and AI chatbot visibility. Book a free consultation today.',
  },
  legend: [
    { label: 'GEO — AI Chatbot Answers', dotColor: 'var(--sag-blue, #1f5fb0)' },
    { label: 'AEO — Featured Snippets', dotColor: '#c98a1f' },
    { label: 'SEO — Organic Rankings', dotColor: 'var(--sag-navy, #0f2547)' },
  ],
  caption: 'This is exactly how we position your brand — visible in Google\'s organic results, Featured Snippets, and AI-generated answers, all at once.',
};

/* ==========================================================================
   2. OVERVIEW DATA (Why SEO Alone Isn't Enough Anymore)
   ========================================================================== */
export const overviewBarsData: OverviewBarItem[] = [
  {
    label: 'Traditional Organic Click',
    rate: '45%',
    width: '45%',
  },
  {
    label: 'Featured Snippet / Position 0',
    rate: '25%',
    width: '25%',
  },
  {
    label: 'AI Overview / Chatbot Answer',
    rate: '30%',
    width: '30%',
  },
];

export const overviewCompareData: OverviewCompareData = {
  without: {
    label: 'SEO-Only Strategy',
    sub: 'Baseline',
    width: '42%',
    innerText: 'Google Only',
  },
  with: {
    label: 'SEO + AEO + GEO Strategy',
    sub: '3x Wider Visibility',
    width: '90%',
    innerText: 'Google + Snippets + AI Answers',
  },
};

/* ==========================================================================
   3. SEARCH EVOLUTION TIMELINE DATA
   ========================================================================== */
export const evolutionTimelineData: TimelineNodeItem[] = [
  {
    id: 'timeline-2010s',
    year: '2010s',
    title: 'Traditional Search',
    description: 'Keyword-based blue links ranked by backlinks & on-page SEO',
    iconKey: 'FaGoogle',
  },
  {
    id: 'timeline-2015',
    year: '2015+',
    title: 'Featured Snippets',
    description: '"Position 0" answers began appearing above organic results',
    iconKey: 'FaStar',
  },
  {
    id: 'timeline-2018',
    year: '2018+',
    title: 'Voice Search',
    description: 'Alexa & Google Assistant started reading answers aloud',
    iconKey: 'FaMicrophone',
  },
  {
    id: 'timeline-2023',
    year: '2023+',
    title: 'Google AI Overviews',
    description: 'AI-generated summaries began dominating the top of the SERP',
    iconKey: 'FaWandMagicSparkles',
  },
  {
    id: 'timeline-now',
    year: 'Now',
    title: 'ChatGPT / Perplexity',
    description: 'Users increasingly ask AI directly instead of searching Google',
    iconKey: 'FaRobot',
    isNow: true,
  },
];

/* ==========================================================================
   4. SEO vs AEO vs GEO COMPARISON TABLE DATA
   ========================================================================== */
export const comparisonTableData: ComparisonRow[] = [
  {
    factor: 'Goal',
    seo: 'Rank in traditional search engine results',
    aeo: 'Get picked as a direct, instant answer',
    geo: 'Get mentioned & cited by AI models',
  },
  {
    factor: 'Where It Appears',
    seo: 'Google organic blue links',
    aeo: 'Featured Snippets, People Also Ask, voice assistants',
    geo: 'ChatGPT, Gemini, Perplexity, AI Overviews',
  },
  {
    factor: 'Ranking Factor',
    seo: 'Backlinks, keywords, technical health',
    aeo: 'FAQ schema, clear Q&A formatting',
    geo: 'Entity authority, structured data, citations',
  },
  {
    factor: 'Content Format',
    seo: 'Long-form, keyword-optimized pages',
    aeo: 'Concise, question-based answers',
    geo: 'Fact-based, well-structured, quotable content',
  },
  {
    factor: 'Example Platform',
    seo: 'Google, Bing organic results',
    aeo: 'Google Featured Snippets, Alexa',
    geo: 'ChatGPT, Perplexity, Google AI Overview',
  },
  {
    factor: 'Success Metric',
    seo: 'Keyword rankings, organic traffic',
    aeo: 'Snippets won, "People Also Ask" appearances',
    geo: 'AI brand mentions & citations',
  },
];

/* ==========================================================================
   5. SERVICE CARDS DATA (8 Core Service Cards)
   ========================================================================== */
export const serviceCardsData: ServiceCardItem[] = [
  {
    id: 'on-page-seo',
    badge: 'One-time Setup',
    title: 'On-Page SEO',
    checklist: [
      'Keyword research & meta title/description optimization',
      'Heading structure, image alt text, URL optimization',
      'Internal linking structure & content optimization',
    ],
  },
  {
    id: 'technical-seo',
    badge: 'One-time Setup',
    title: 'Technical SEO',
    checklist: [
      'XML sitemap, robots.txt, crawlability fixes',
      'Site speed & Core Web Vitals optimization',
      'Google Search Console & Analytics 4 setup',
    ],
  },
  {
    id: 'off-page-seo',
    badge: 'Monthly Retainer',
    title: 'Off-Page SEO & Link Building',
    checklist: [
      'Quality backlink outreach & guest posting',
      'Business directory citations & digital PR',
      'Domain authority growth tracking',
    ],
  },
  {
    id: 'local-seo',
    badge: 'One-time + Maintenance',
    title: 'Local SEO',
    checklist: [
      'Google Business Profile setup & optimization',
      'Local keyword targeting, NAP consistency',
      'Google Maps optimization, review strategy',
    ],
  },
  {
    id: 'aeo',
    badge: 'One-time Setup',
    title: 'Answer Engine Optimization (AEO)',
    checklist: [
      'FAQ schema & structured data markup',
      'Featured Snippet & "People Also Ask" targeting',
      'Conversational, question-based content structuring',
    ],
  },
  {
    id: 'geo',
    badge: 'Monthly Retainer',
    title: 'Generative Engine Optimization (GEO)',
    checklist: [
      'Optimization for ChatGPT, Perplexity, Gemini & AI Overviews',
      'Entity & brand authority building across the web',
      'Structured data & llms.txt setup for AI crawlers',
    ],
  },
  {
    id: 'content-strategy',
    badge: 'Monthly Retainer',
    title: 'Content Strategy & Optimization',
    checklist: [
      'SEO/AEO-friendly blog & landing page content',
      'Topic clusters & content gap analysis',
      'Ongoing content refresh for ranking pages',
    ],
  },
  {
    id: 'reporting',
    badge: 'Included with Retainer',
    title: 'Monthly Reporting & Rank Tracking',
    checklist: [
      'Keyword ranking & organic traffic reports',
      'Featured Snippet & AI Overview visibility tracking',
      'Next-month strategy recommendations',
    ],
  },
];

/* ==========================================================================
   6. HOW WE WORK (5 Steps Alternating Timeline)
   ========================================================================== */
export const howWeWorkStepsData: HowWeWorkStepItem[] = [
  {
    stepNumber: 1,
    stepTag: 'STEP 01',
    title: 'Visibility Audit',
    description: 'Full SEO, technical, and AI-visibility audit of your current presence',
    iconKey: 'FaMagnifyingGlass',
  },
  {
    stepNumber: 2,
    stepTag: 'STEP 02',
    title: 'Keyword & Entity Research',
    description: 'Identifying keywords, questions, and entities your customers search for',
    iconKey: 'FaDiagramProject',
  },
  {
    stepNumber: 3,
    stepTag: 'STEP 03',
    title: 'On-Page, Technical & Schema',
    description: 'Implementing fixes, structured data, and AEO/GEO-ready formatting',
    iconKey: 'FaCode',
  },
  {
    stepNumber: 4,
    stepTag: 'STEP 04',
    title: 'Authority Building',
    description: 'Off-page links, citations, and content that build topical authority',
    iconKey: 'FaLink',
  },
  {
    stepNumber: 5,
    stepTag: 'STEP 05',
    title: 'Monitor & Optimize',
    description: 'Monthly reporting across rankings, snippets, and AI citations',
    iconKey: 'FaChartLine',
  },
];

/* ==========================================================================
   7. STRATEGY TABS DATA (7 Tabs)
   ========================================================================== */
export const strategyTabsData: StrategyTabItem[] = [
  {
    id: 0,
    title: 'Keyword & Entity Research',
    iconKey: 'FaKey',
    paragraphs: [
      'We research not just keywords but "entities" — the people, places, products, and concepts search engines and AI models associate with your business.',
      'We analyze competitor rankings, search intent, and question-based queries people ask on Google and AI chatbots.',
      'For Bangladeshi businesses, we also research Bangla-language search patterns alongside English.',
    ],
  },
  {
    id: 1,
    title: 'On-Page Optimization',
    iconKey: 'FaFileLines',
    paragraphs: [
      'Every page is optimized with proper title tags, meta descriptions, header hierarchy, image alt text, and keyword-optimized copy that reads naturally.',
      'We structure internal linking so search engines understand your site\'s hierarchy.',
      'This on-page foundation is also what makes AEO and GEO possible later.',
    ],
  },
  {
    id: 2,
    title: 'Technical SEO Foundation',
    iconKey: 'FaGears',
    paragraphs: [
      'We audit and fix XML sitemaps, robots.txt configuration, canonical tags, and broken link fixes.',
      'Site speed and Core Web Vitals are optimized. We ensure full mobile responsiveness.',
      'Google Search Console and Analytics 4 are connected from day one.',
    ],
  },
  {
    id: 3,
    title: 'Off-Page SEO & Link Building',
    iconKey: 'FaLink',
    paragraphs: [
      'We build links through guest posting, business directory citations, and outreach — always white-hat, never spammy link farms.',
      'We also pursue digital PR opportunities that build backlinks and brand authority AI models recognize.',
      'Every link is tracked and reported monthly.',
    ],
  },
  {
    id: 4,
    title: 'Local SEO (Google Business Profile)',
    iconKey: 'FaLocationDot',
    paragraphs: [
      'We fully optimize your Google Business Profile — categories, hours, photos, services, and reviews.',
      'We ensure NAP consistency across every directory online.',
      'This helps you appear in Google Maps and the local pack.',
    ],
  },
  {
    id: 5,
    title: 'Answer Engine Optimization',
    iconKey: 'FaCommentDots',
    paragraphs: [
      'We implement FAQ schema markup and write clear, concise Q&A sections that directly address common queries.',
      'This increases your chances of winning Featured Snippets and "People Also Ask" boxes.',
      'We prioritize AEO for high-intent questions your customers actually ask.',
    ],
  },
  {
    id: 6,
    title: 'Generative Engine Optimization',
    iconKey: 'FaBrain',
    paragraphs: [
      'GEO ensures your brand is understood, trusted, and cited by AI chatbots like ChatGPT, Gemini, Perplexity, and Google\'s AI Overviews.',
      'We strengthen entity presence, publish citable content, and implement standards like llms.txt.',
      'GEO ensures your business isn\'t left out when AI recommends solutions in your industry.',
    ],
  },
];

/* ==========================================================================
   8. REAL AI CITATION EXAMPLE DATA
   ========================================================================== */
export const aiCitationData: AICitationData = {
  assistantTitle: 'AI Assistant',
  liveBadgeText: 'GEO in Action',
  userQuestion: 'Can you recommend a good SEO & digital marketing agency in Bangladesh?',
  aiAnswerPrefix: 'Based on available information, ',
  aiAnswerBold: '10 Cent Agency',
  aiAnswerBody: ' is a well-reviewed digital marketing agency based in Dhaka, Bangladesh. They specialize in SEO, AEO & GEO optimization, Facebook & Meta marketing, and website development — with a strong focus on transparent reporting and AI-search visibility for small and medium businesses.',
  citationSource: 'Source: 10centagency.com',
  captionText: 'This is the level of brand trust and citation-readiness we build into every client\'s GEO strategy.',
};

/* ==========================================================================
   9. TOOLS WE USE (4 Categories × 3 Tools)
   ========================================================================== */
export const techStackData: TechCategoryItem[] = [
  {
    id: 'cat-research',
    title: 'Research & Analytics',
    iconKey: 'FaChartLine',
    items: [
      { label: 'Search Console', iconKey: 'FaGoogle' },
      { label: 'Google Analytics 4', iconKey: 'FaChartSimple' },
      { label: 'SEMrush / Ahrefs', iconKey: 'FaMagnifyingGlassChart' },
    ],
  },
  {
    id: 'cat-onpage',
    title: 'On-Page & Technical',
    iconKey: 'FaGears',
    items: [
      { label: 'Screaming Frog', iconKey: 'FaSpider' },
      { label: 'Schema.org Markup', iconKey: 'FaCode' },
      { label: 'PageSpeed Insights', iconKey: 'FaGaugeHigh' },
    ],
  },
  {
    id: 'cat-ai-geo',
    title: 'AI & GEO Tools',
    iconKey: 'FaBrain',
    items: [
      { label: 'AI Overview Monitoring', iconKey: 'FaChartArea' },
      { label: 'ChatGPT / Perplexity Tracking', iconKey: 'FaRobot' },
      { label: 'llms.txt Setup', iconKey: 'FaFileCode' },
    ],
  },
  {
    id: 'cat-local-offpage',
    title: 'Local & Off-Page',
    iconKey: 'FaLocationDot',
    items: [
      { label: 'Google Business Profile', iconKey: 'FaGoogle' },
      { label: 'Google Maps', iconKey: 'FaMap' },
      { label: 'Backlink & Citation Tools', iconKey: 'FaLink' },
    ],
  },
];

/* ==========================================================================
   10. WHY CHOOSE US (6 Cards)
   ========================================================================== */
export const whyChooseUsData: WhyChooseItem[] = [
  {
    id: 'why-future-proof',
    title: 'Future-Proof Strategy',
    description: 'We build SEO, AEO, and GEO together — visible on Google today and in AI answers tomorrow.',
    iconKey: 'FaLayerGroup',
  },
  {
    id: 'why-data-driven',
    title: 'Data-Driven Approach',
    description: 'Every recommendation is backed by real ranking, traffic, and AI-visibility data.',
    iconKey: 'FaDatabase',
  },
  {
    id: 'why-local-expertise',
    title: 'Local Bangladesh Expertise',
    description: 'We understand Bangla + English search behavior better than generic global agencies.',
    iconKey: 'FaEarthAsia',
  },
  {
    id: 'why-transparent-reporting',
    title: 'Transparent Reporting',
    description: 'Clear monthly reports on rankings, traffic, snippets won, and AI citations.',
    iconKey: 'FaFileInvoice',
  },
  {
    id: 'why-white-hat',
    title: 'White-Hat Techniques Only',
    description: 'No shortcuts, no spam links, no risky tactics that could get your site penalized.',
    iconKey: 'FaShieldHalved',
  },
  {
    id: 'why-dedicated-specialist',
    title: 'Dedicated Specialist',
    description: 'A dedicated SEO/AEO/GEO specialist manages your account and strategy every month.',
    iconKey: 'FaUserTie',
  },
];

/* ==========================================================================
   11. 10 CENT AGENCY vs TRADITIONAL SEO AGENCIES
   ========================================================================== */
export const vsAgenciesData: VsAgencyComparison = {
  traditional: {
    badge: 'Traditional SEO Agency',
    title: 'Old-School Approach',
    points: [
      'Only focuses on Google organic rankings',
      'Generic monthly reports — just rankings & traffic',
      'No strategy for ChatGPT, Gemini, or Perplexity',
      'One-size-fits-all packages for every client',
      'No dedicated specialist — shared account managers',
      'Outdated keyword-stuffing tactics',
    ],
  },
  us: {
    badge: '10 Cent Agency',
    title: 'Future-Proof Approach',
    points: [
      'Full SEO + AEO + GEO visibility strategy',
      'Transparent reporting with AI-citation tracking',
      'Dedicated ChatGPT/Perplexity/Gemini optimization',
      'Custom-scoped strategy for your exact goals',
      'Dedicated SEO/AEO/GEO specialist on your account',
      'White-hat, entity-based, natural content only',
    ],
  },
};

/* ==========================================================================
   12. 5 COMMON MISTAKES
   ========================================================================== */
export const commonMistakesData: CommonMistakeItem[] = [
  {
    number: 1,
    title: 'Only Optimizing for Traditional Google Search',
    description: 'Many businesses ignore Featured Snippets and AI chatbot visibility entirely.',
  },
  {
    number: 2,
    title: 'No Schema or Structured Data',
    description: 'Without schema markup, AI models struggle to understand your content.',
  },
  {
    number: 3,
    title: 'Outdated Keyword Stuffing Tactics',
    description: 'Keyword stuffing hurts your chances of being cited by AI systems.',
  },
  {
    number: 4,
    title: 'Ignoring Local SEO',
    description: 'An unoptimized Google Business Profile means missing "near me" searches.',
  },
  {
    number: 5,
    title: 'No Ongoing Monitoring After Ranking',
    description: 'Without monthly monitoring, rankings and visibility quietly decline.',
  },
];

/* ==========================================================================
   13. IS YOUR WEBSITE AI-SEARCH READY? CHECKLIST
   ========================================================================== */
export const aiSearchChecklistData: ChecklistItem[] = [
  {
    id: 'chk-schema',
    text: 'Schema Markup Added (Organization, Service, FAQ)',
    isReady: true,
  },
  {
    id: 'chk-faq-structured',
    text: 'FAQ Page with Structured Data',
    isReady: false,
  },
  {
    id: 'chk-llmstxt',
    text: 'llms.txt File for AI Crawlers',
    isReady: false,
  },
  {
    id: 'chk-gbp',
    text: 'Google Business Profile Fully Optimized',
    isReady: true,
  },
  {
    id: 'chk-entity',
    text: 'Consistent Brand Entity Across the Web',
    isReady: false,
  },
  {
    id: 'chk-speed',
    text: 'Mobile-Responsive & Fast-Loading Pages',
    isReady: true,
  },
];

/* ==========================================================================
   14. STATS / RESULTS DATA
   ========================================================================== */
export const statsCountersData: StatItem[] = [
  {
    id: 'stat-ranked',
    targetNumber: 15,
    suffix: '+',
    label: 'Websites Ranked',
  },
  {
    id: 'stat-traffic',
    targetNumber: 75,
    suffix: '%',
    label: 'Avg. Organic Traffic Increase',
  },
  {
    id: 'stat-snippets',
    targetNumber: 30,
    suffix: '+',
    label: 'Featured Snippets Won',
  },
  {
    id: 'stat-retention',
    targetNumber: 95,
    suffix: '%',
    label: 'Client Retention Rate',
  },
];

export const donutStatData = {
  percentage: 40,
  innerLabel: 'Now in AI Answers',
  legendTitle: 'AI Visibility Growth (Sample)',
  legendParagraph: 'On average, 40% of our optimized clients now appear in Google AI Overviews or are cited by AI chatbots.',
};

/* ==========================================================================
   15. PRICING PACKAGES DATA (3 Packages, No Prices)
   ========================================================================== */
export const pricingPackagesData: PricingTierItem[] = [
  {
    id: 'pkg-starter',
    badge: 'Best for Startups',
    name: 'SEO Starter',
    note: 'A solid foundation for businesses just starting with SEO',
    features: [
      'On-page + technical SEO setup',
      'Google Search Console & GA4 setup',
      'Local SEO / Google Business Profile',
      'Monthly ranking report',
    ],
    ctaText: 'Get Custom Quote',
    ctaHref: '/contact',
  },
  {
    id: 'pkg-growth',
    badge: 'Most Popular',
    isPopular: true,
    name: 'SEO + AEO Growth',
    note: 'For businesses ready to compete for rankings and Featured Snippets',
    features: [
      'Everything in SEO Starter',
      'FAQ schema + Featured Snippet targeting (AEO)',
      'Monthly off-page link building',
      'Content strategy & optimization',
    ],
    ctaText: 'Get Custom Quote',
    ctaHref: '/contact',
  },
  {
    id: 'pkg-full',
    badge: 'Full Visibility',
    name: 'SEO + AEO + GEO',
    note: 'For brands that want visibility across Google, Snippets & AI chatbots',
    features: [
      'Everything in Growth',
      'Generative Engine Optimization (GEO)',
      'AI chatbot visibility tracking',
      'Dedicated specialist + priority support',
    ],
    ctaText: 'Get Custom Quote',
    ctaHref: '/contact',
  },
];

/* ==========================================================================
   16. INDUSTRIES DATA (Search-Query Card Style)
   ========================================================================== */
export const industriesData: IndustryItem[] = [
  {
    id: 'ind-ecommerce',
    searchQuery: '"best online shoe store in Bangladesh"',
    title: 'E-commerce',
    description: 'Product page SEO, schema markup for rich results, and GEO strategies so AI shopping assistants recommend your store by name.',
    iconKey: 'FaCartShopping',
    tagText: 'AI Answer Ready',
  },
  {
    id: 'ind-restaurant',
    searchQuery: '"best restaurant in Dhaka near me"',
    title: 'Restaurant & Food',
    description: 'Local SEO and Google Maps optimization to dominate "near me" searches and AI dining recommendations.',
    iconKey: 'FaUtensils',
    tagText: 'AI Answer Ready',
  },
  {
    id: 'ind-realestate',
    searchQuery: '"recommend a real estate agency in Dhaka"',
    title: 'Real Estate',
    description: 'Location-based keyword targeting and structured data so AI tools cite your agency when buyers ask for recommendations.',
    iconKey: 'FaHouse',
    tagText: 'AI Answer Ready',
  },
  {
    id: 'ind-healthcare',
    searchQuery: '"trusted clinic near me for check-up"',
    title: 'Healthcare',
    description: 'Trust-focused content, FAQ schema, and AEO to answer patient questions directly in search & AI answer boxes.',
    iconKey: 'FaHeartPulse',
    tagText: 'AI Answer Ready',
  },
  {
    id: 'ind-education',
    searchQuery: '"best coaching center for admission test"',
    title: 'Education',
    description: 'Content clusters and question-based optimization so your institute answers student queries directly in search & AI chat.',
    iconKey: 'FaGraduationCap',
    tagText: 'AI Answer Ready',
  },
  {
    id: 'ind-professional',
    searchQuery: '"recommend a digital marketing agency in Bangladesh"',
    title: 'Professional Services',
    description: 'Authority-building content and citations that strengthen both SEO rankings and AI trust signals for your firm.',
    iconKey: 'FaBriefcase',
    tagText: 'AI Answer Ready',
  },
];

/* ==========================================================================
   17. FAQ DATA (8 Items — UI Bullets + Schema Text)
   ========================================================================== */
export const faqsData: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'What is the difference between SEO, AEO, and GEO?',
    schemaText: 'They are three layers of the same visibility system, not three competing services. SEO ranks your website in traditional Google and Bing results — the blue links. AEO structures content so Google can lift it as a direct answer: Featured Snippets, People Also Ask, and voice assistants. GEO makes your brand understandable and citable by ChatGPT, Gemini, Perplexity, and Google AI Overviews. A local organic grocer usually needs Local SEO plus AEO for “near me” and “is this organic?” questions. An online furniture store needs product-page SEO and schema. A fashion brand competing nationally needs all three so it ranks, wins snippets, and gets named when someone asks an AI for a Bangladeshi clothing brand. SEO Starter covers the ranking foundation. SEO + AEO Growth adds snippet targeting after the technical audit (week 1). The full SEO + AEO + GEO package adds entity and citation work once on-page is live, typically from week 3–4.',
    blocks: [
      {
        type: 'paragraph',
        text: 'They are three layers of the same visibility system, not three competing services. SEO ranks your website in traditional Google and Bing results — the blue links. AEO structures content so Google can lift it as a direct answer: Featured Snippets, People Also Ask, and voice assistants. GEO makes your brand understandable and citable by ChatGPT, Gemini, Perplexity, and Google AI Overviews.',
      },
      {
        type: 'paragraph',
        text: 'The mix depends on how your customers actually search. Typical pairings we scope after the week-1 audit:',
      },
      {
        type: 'list',
        items: [
          'Local / grocery / clinic — Local SEO + AEO for “near me” and trust questions',
          'E-commerce / home & lifestyle — product-page SEO, Product schema, collection snippets',
          'Fashion / national brands — full SEO + AEO + GEO so AI tools can name you',
        ],
      },
      {
        type: 'paragraph',
        text: 'SEO Starter covers the ranking foundation. SEO + AEO Growth adds snippet targeting after the technical audit. The full SEO + AEO + GEO package adds entity and citation work once on-page is live, typically from week 3–4.',
      },
    ],
  },
  {
    id: 'faq-2',
    question: 'How long does it take to see SEO/AEO/GEO results?',
    schemaText: 'Technical and on-page fixes usually show crawl and indexing improvement within 4–6 weeks. AEO and GEO signals — snippet eligibility and cleaner entity data — often appear within 2–3 months. Meaningful ranking movement on competitive terms typically takes 3–4 months. Month 1 is the visibility audit, keyword and entity research, and technical/schema work. Month 2 is content, internal links, and the first snippet-ready FAQ blocks. Month 3–4 is authority building plus the first full ranking and AI-visibility report. Local queries such as a grocery or clinic “near me” can move faster on Maps. National e-commerce and fashion keywords take the full 3–4 months because competition is thicker. We review progress on the monthly report in the first week of the following month — not with a fake 7-day rank promise.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Technical and on-page fixes usually show crawl and indexing improvement within 4–6 weeks. AEO and GEO signals — snippet eligibility and cleaner entity data — often appear within 2–3 months. Meaningful ranking movement on competitive terms typically takes 3–4 months.',
      },
      {
        type: 'paragraph',
        text: 'The first quarter is mapped so you know what “progress” looks like before page-one ranks arrive:',
      },
      {
        type: 'list',
        items: [
          'Month 1 — visibility audit, keyword & entity research, technical and schema work',
          'Month 2 — content, internal links, and the first snippet-ready FAQ blocks',
          'Month 3–4 — authority building plus the first full ranking and AI-visibility report',
        ],
      },
      {
        type: 'paragraph',
        text: 'Local queries such as a grocery or clinic “near me” can move faster on Maps. National e-commerce and fashion keywords take the full 3–4 months. We review progress on the monthly report in the first week of the following month — not with a fake 7-day rank promise.',
      },
    ],
  },
  {
    id: 'faq-3',
    question: 'Can you guarantee a first-page Google ranking?',
    schemaText: 'No ethical agency can guarantee a specific Google position. Rankings depend on competitors, algorithm updates, and your own content and site speed — none of which we control 100%. What we do guarantee is a technically sound, well-optimized site, white-hat work only, and a monthly report you can actually read. That report covers keyword positions, organic traffic, technical health, backlinks, snippets won, and AI mentions — so you see movement even before a keyword hits page one. After the week-1 audit we give a realistic 90-day forecast. If a term is too competitive for Starter, we say so and recommend Growth or a longer horizon instead of selling a #1 promise.',
    blocks: [
      {
        type: 'paragraph',
        text: 'No ethical agency can guarantee a specific Google position. Rankings depend on competitors, algorithm updates, and your own content and site speed — none of which anyone controls 100%.',
      },
      {
        type: 'paragraph',
        text: 'What we do put in writing after the week-1 audit is the work and the reporting, not a #1 trophy:',
      },
      {
        type: 'list',
        items: [
          'A technically sound, indexable website (sitemap, CWV, crawl fixes)',
          'White-hat on-page, schema, and link work only — no PBNs or spam',
          'A monthly report covering ranks, traffic, snippets, and AI mentions',
        ],
      },
      {
        type: 'paragraph',
        text: 'After that audit we give a realistic 90-day forecast. If a term is too competitive for Starter, we say so and recommend Growth or a longer horizon instead of selling a first-page promise.',
      },
    ],
  },
  {
    id: 'faq-4',
    question: 'What exactly is Answer Engine Optimization (AEO)?',
    schemaText: 'AEO is the practice of writing and marking up content so search engines can extract a complete answer and show it at Position 0 — above the organic links — or read it aloud via a voice assistant. We implement FAQ and HowTo schema, write short definition blocks, and target People Also Ask questions your buyers already type. Examples: “Is UrbanLeaf produce pesticide-free?”, “Does HomeVibe deliver furniture in Dhaka?”, “What size chart does Velora use?”. Those answers are 40–60 words, sit next to the question, and are wrapped in FAQPage schema. AEO is included from the SEO + AEO Growth package. Schema goes live with the on-page pass (usually weeks 2–3). First snippet opportunities are reviewed at the 8–12 week mark, once Google has recrawled the new Q&A blocks.',
    blocks: [
      {
        type: 'paragraph',
        text: 'AEO is writing and marking up content so search engines can extract a complete answer and show it at Position 0 — above the organic links — or read it aloud via a voice assistant.',
      },
      {
        type: 'paragraph',
        text: 'We implement FAQ and HowTo schema, write short definition blocks, and target People Also Ask questions your buyers already type. Real examples from the kinds of sites we optimize:',
      },
      {
        type: 'list',
        items: [
          '“Is this organic produce pesticide-free?” — grocery / wellness',
          '“Do you deliver furniture inside Dhaka?” — home & lifestyle',
          '“What is the size chart for this collection?” — fashion',
        ],
      },
      {
        type: 'paragraph',
        text: 'AEO is included from the SEO + AEO Growth package. Schema goes live with the on-page pass (usually weeks 2–3). First snippet opportunities are reviewed at the 8–12 week mark, once Google has recrawled the new Q&A blocks.',
      },
    ],
  },
  {
    id: 'faq-5',
    question: 'How do you optimize for ChatGPT and AI chatbots (GEO)?',
    schemaText: 'GEO — Generative Engine Optimization — makes your brand a trusted source that AI systems can name and cite. We strengthen your entity (consistent name, address, category across the web), publish fact-based quotable pages, add Organization/Service/Product schema, and set up llms.txt so AI crawlers know what they may use. We also build a small set of citation-ready pages: a clear About, a services or collection page, and industry explainers an AI can quote without hallucinating. Mentions are tracked across ChatGPT, Gemini, Perplexity, and Google AI Overviews in the monthly report. GEO is part of the full SEO + AEO + GEO package. Entity cleanup starts after the week-1 audit; llms.txt and schema ship with the technical pass; citation tracking begins once those pages are live, with first AI-visibility notes typically in months 2–3.',
    blocks: [
      {
        type: 'paragraph',
        text: 'GEO — Generative Engine Optimization — makes your brand a trusted source that AI systems can name and cite. If someone asks ChatGPT or Gemini for an organic grocer, a home store, or a Bangladeshi fashion brand, the model needs a clear entity and citable facts — not just a keyword-stuffed blog.',
      },
      {
        type: 'paragraph',
        text: 'The monthly GEO work is specific:',
      },
      {
        type: 'list',
        items: [
          'Entity cleanup — consistent name, category, and NAP across the web',
          'Organization / Service / Product schema plus an llms.txt for AI crawlers',
          'Quotable About, collection, and explainer pages models can cite without guessing',
        ],
      },
      {
        type: 'paragraph',
        text: 'GEO is part of the full SEO + AEO + GEO package. Entity work starts after the week-1 audit; schema and llms.txt ship with the technical pass. Citation tracking begins once those pages are live, with first AI-visibility notes typically in months 2–3.',
      },
    ],
  },
  {
    id: 'faq-6',
    question: 'Do I need a new website for SEO, AEO, and GEO?',
    schemaText: 'In most cases, no. We optimize the site you already have after a full visibility audit. A rebuild is only recommended when the current site cannot be crawled cleanly, fails Core Web Vitals badly, or is a JavaScript shell with no indexable HTML. The week-1 audit checks sitemap, robots.txt, speed, mobile rendering, and existing schema. You get a written recommendation before any rebuild is scoped — so you are not sold a new website by default. If the site is healthy, on-page and schema work starts in weeks 2–3 on the live URLs. If a rebuild is required, we pause ranking promises until the new templates are indexable, usually 2–4 weeks after launch.',
    blocks: [
      {
        type: 'paragraph',
        text: 'In most cases, no. We optimize the site you already have after a full visibility audit. A rebuild is only recommended when the current site cannot be crawled cleanly, fails Core Web Vitals badly, or is a JavaScript shell with no indexable HTML.',
      },
      {
        type: 'paragraph',
        text: 'The week-1 audit is the decision point. We check, then write the recommendation before any rebuild is scoped:',
      },
      {
        type: 'list',
        items: [
          'XML sitemap, robots.txt, canonicals, and index coverage',
          'Mobile rendering and Core Web Vitals (LCP, INP, CLS)',
          'Existing schema — Organization, Product, FAQ — or the lack of it',
        ],
      },
      {
        type: 'paragraph',
        text: 'If the site is healthy, on-page and schema work starts in weeks 2–3 on the live URLs. If a rebuild is required, we pause ranking forecasts until the new templates are indexable, usually 2–4 weeks after launch.',
      },
    ],
  },
  {
    id: 'faq-7',
    question: 'Is SEO a one-time service or an ongoing process?',
    schemaText: 'Both. The foundation is a one-time setup; staying visible is a retainer. On-page SEO, technical fixes, Google Search Console / GA4, and the first schema pass are project work. Rank tracking, content refreshes, link building, snippet maintenance, and AI-visibility monitoring need a monthly cycle because competitors and models keep moving. SEO Starter includes the setup plus a monthly ranking report. Growth adds off-page and content each month. The full package adds GEO monitoring. We recommend staying at least 90 days: month 1 is setup, month 2 is the first data-backed content, month 3 is when rankings and snippets are fair to judge. Pause or cancel at the end of any billing cycle — unused approved content stays yours.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Both. The foundation is a one-time setup; staying visible is a retainer. Competitors keep publishing, Google keeps updating, and AI models recrawl — a one-off meta-tag pass will not hold.',
      },
      {
        type: 'paragraph',
        text: 'We split the work so you are not paying a retainer for project tasks, or a project fee for work that has to repeat:',
      },
      {
        type: 'list',
        items: [
          'One-time — on-page, technical SEO, GSC / GA4, first schema pass',
          'Monthly — rank tracking, content refreshes, link building, snippet maintenance',
          'Full package — plus GEO / AI-visibility monitoring every cycle',
        ],
      },
      {
        type: 'paragraph',
        text: 'Stay at least 90 days: month 1 is setup, month 2 is the first data-backed content, month 3 is when ranks and snippets are fair to judge. Pause or cancel at the end of any billing cycle. Unused approved content stays yours.',
      },
    ],
  },
  {
    id: 'faq-8',
    question: 'What\'s included in your monthly SEO report?',
    schemaText: 'Every retainer month ends with a plain-language report, not a raw tool export. You see where you stood, what changed, and what we will do next. Typical sections: keyword rankings and movement, organic sessions from GA4, technical health (coverage, speed, CWV), new and lost backlinks, Featured Snippets and People Also Ask wins, and AI visibility notes for Overviews and chatbots. The report is delivered in the first week of the following month. We walk through it on a short call and lock next month’s tasks — for example refreshing a product collection that slipped, or adding FAQ blocks to a page that is ranking 6–10 and is snippet-eligible.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Every retainer month ends with a plain-language report, not a raw tool export. You see where you stood, what changed, and what we will do next — the same way the sample monthly reports on this page are structured.',
      },
      {
        type: 'paragraph',
        text: 'A standard report includes:',
      },
      {
        type: 'list',
        items: [
          'Keyword rankings and movement, plus organic sessions from GA4',
          'Technical health — coverage, speed, Core Web Vitals',
          'New / lost backlinks, Featured Snippets & PAA wins, and AI Overview / chatbot mentions',
        ],
      },
      {
        type: 'paragraph',
        text: 'The report is delivered in the first week of the following month. We walk through it on a short call and lock next month’s tasks — for example refreshing a collection that slipped, or adding FAQ blocks to a page ranking 6–10 that is snippet-eligible.',
      },
    ],
  },
];

/* ==========================================================================
   18. TESTIMONIALS DATA (3 Cards)
   ========================================================================== */
export const testimonialsData: TestimonialItem[] = [
  {
    id: 'testi-1',
    rating: 4,
    tag: 'Local SEO + AEO',
    quote: '“UrbanLeaf is an organic grocery and wellness brand — people search ‘near me’ and ask if the food is actually natural. 10 Cent Agency cleaned up our Google Business Profile, added FAQ schema, and started targeting those questions. Maps visibility is clearly better. Competitive product keywords are still moving slowly, which is why this is a four, not a five — but the local foundation is solid.”',
    author: 'Tanvir Hossain',
    role: 'Managing Director',
    company: 'UrbanLeaf Organics',
    initials: 'TH',
    avatarClass: 'avNavy',
  },
  {
    id: 'testi-2',
    rating: 4,
    tag: 'SEO + Product Schema',
    quote: '“HomeVibe BD is an online home and lifestyle store — furniture, décor, everyday accessories — so product pages have to rank, not just the homepage. They fixed titles, internal links and Product schema. A few collection pages now pick up rich results. I’d like faster movement on the bigger furniture terms, but reporting is honest and the site is in much better technical shape than when we started.”',
    author: 'Rashedul Islam',
    role: 'Founder & CEO',
    company: 'HomeVibe BD',
    initials: 'RI',
    avatarClass: 'avBlue',
  },
  {
    id: 'testi-3',
    rating: 5,
    tag: 'SEO + AEO + GEO',
    quote: '“Velora is a modern Bangladeshi fashion brand — clothing and lifestyle, sold online. We needed more than blog posts. They built FAQ blocks, size-and-fabric snippets, and entity pages so we show up in search and in AI answers. Within the first quarter we won Featured Snippets on two collection queries, and a client forwarded a ChatGPT reply that named Velora. That’s the brief we hired them for.”',
    author: 'Arif Mahmud',
    role: 'Founder & CEO',
    company: 'Velora Fashion',
    initials: 'AM',
    avatarClass: 'avDeep',
  },
];

// Connected Schema.org @graph generator
export function getSeoAeoGeoSchemaGraph() {
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
        telephone: '+880 1615-144114',
        email: 'hello@10centagency.com',
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
        '@id': 'https://www.10centagency.com/services/seo-aeo-geo#webpage',
        url: 'https://www.10centagency.com/services/seo-aeo-geo',
        name: 'SEO, AEO & GEO Services in Bangladesh | 10 Cent Agency',
        description:
          'SEO, AEO & GEO services in Bangladesh — rank on Google, win Featured Snippets and get cited by ChatGPT, Gemini & AI Overviews. On-page, technical & local SEO for your business.',
        inLanguage: 'en-BD',
        isPartOf: {
          '@id': 'https://www.10centagency.com/#website',
        },
        breadcrumb: {
          '@id': 'https://www.10centagency.com/services/seo-aeo-geo#breadcrumb',
        },
        about: {
          '@id': 'https://www.10centagency.com/services/seo-aeo-geo#service',
        },
        mainEntity: {
          '@id': 'https://www.10centagency.com/services/seo-aeo-geo#service',
        },
      },
      {
        '@type': 'Service',
        '@id': 'https://www.10centagency.com/services/seo-aeo-geo#service',
        name: 'SEO, AEO & GEO Services',
        serviceType: 'SEO, AEO & GEO Optimization',
        url: 'https://www.10centagency.com/services/seo-aeo-geo',
        description:
          '10 Cent Agency provides complete Search Engine Optimization (SEO), Answer Engine Optimization (AEO), and Generative Engine Optimization (GEO) services for small and medium businesses in Bangladesh.',
        provider: {
          '@id': 'https://www.10centagency.com/#organization',
        },
        mainEntityOfPage: {
          '@id': 'https://www.10centagency.com/services/seo-aeo-geo#webpage',
        },
        areaServed: {
          '@type': 'Country',
          name: 'Bangladesh',
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://www.10centagency.com/services/seo-aeo-geo#breadcrumb',
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
            name: 'SEO, AEO & GEO',
            item: 'https://www.10centagency.com/services/seo-aeo-geo',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://www.10centagency.com/services/seo-aeo-geo#faq',
        mainEntity: faqsData.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.schemaText,
          },
        })),
      },
    ],
  };
}
