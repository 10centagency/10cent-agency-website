export interface OverviewBarItem {
  label: string;
  percentage: string;
  width: string;
}

export interface OverviewCompareBlock {
  label: string;
  sub: string;
  width: string;
  innerText: string;
}

export interface ServiceCardItem {
  id: string;
  title: string;
  badge: string;
  checklist: string[];
}

export interface HowWeWorkStepItem {
  stepNumber: string;
  stepTag: string;
  iconKey: string;
  title: string;
  description: string;
}

export interface StrategyTabItem {
  id: number;
  title: string;
  iconKey: string;
  paragraphs: string[];
}

export interface FunnelStageItem {
  id: string;
  iconKey: string;
  label: string;
  target: number;
  formatted: string;
  note: string;
  dropRate?: string;
  stageWidth: number;
  isHighlight?: boolean;
}

export interface ComparisonRowItem {
  factor: string;
  googleAds: string;
  facebookAds: string;
  seo: string;
}

export interface TechToolItem {
  name: string;
  iconKey: string;
}

export interface TechCategoryItem {
  category: string;
  iconKey: string;
  tools: TechToolItem[];
}

export interface WhyChooseUsItem {
  id: string;
  title: string;
  iconKey: string;
  description: string;
}

export interface CommonMistakeItem {
  number: number;
  title: string;
  description: string;
}

export interface BeforeAfterMetricItem {
  label: string;
  value: string;
  width: string;
  isBad?: boolean;
}

export interface BeforeAfterCardItem {
  badge: string;
  title: string;
  isGoodBadge?: boolean;
  metrics: BeforeAfterMetricItem[];
}

export interface StatItem {
  target: number;
  suffix: string;
  label: string;
}

export interface ReportPinItem {
  id: number;
  title: string;
  text: string;
}

export interface FeedListItem {
  id: number;
  type: 'good' | 'warn';
  iconKey: string;
  strongText: string;
  restText: string;
  time: string;
}

export interface PricingPackageItem {
  id: string;
  badge: string;
  title: string;
  note: string;
  isPopular?: boolean;
  bullets: string[];
  ctaText: string;
  ctaHref: string;
}

export interface IndustryItem {
  id: string;
  iconKey: string;
  title: string;
  description: string;
  tagText: string;
}

export interface FAQItem {
  id: number;
  question: string;
  paragraphs: string[];
  schemaText: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  avatar: string;
  tag: string;
  rating: number;
  quote: string;
}

export interface RelatedServiceItem {
  id: string;
  title: string;
  description: string;
  link: string;
  iconKey: string;
}

// 1. HERO DATA
export const heroData = {
  breadcrumb: [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Google Ads', href: '/services/google-ads', current: true },
  ],
  title: 'Google Ads',
  description:
    'Show up right when Bangladeshi buyers are searching — not just get impressions. We build, launch, and continuously optimize Search, Shopping, Display, YouTube & Performance Max campaigns, with transparent monthly reporting and zero markup on your ad spend.',
  primaryCtaText: 'Get a Free Audit',
  primaryCtaHref: '/contact',
  outlineCtaText: 'Back to Services',
  outlineCtaHref: '/services',
};

// 2. LIVE AD PREVIEW MOCKUP DATA
export const adPreviewData = {
  urlBar: 'google.com/search?q=best+furniture+shop+in+dhaka',
  query: 'best furniture shop in dhaka',
  adCard: {
    tag: 'Ad',
    url: 'homevibebd.com › living-room',
    title: 'HomeVibe BD — Furniture Store in Dhaka | Free Delivery Inside City',
    description:
      'Sofas, beds & dining sets starting ৳8,900. In-stock, ready to deliver within 48 hours. EMI available. Visit our Mirpur showroom or order online today.',
    sitelinks: [
      { title: 'Sofa Sets', sub: 'View Collection' },
      { title: 'Bed Frames', sub: 'Starting ৳12,500' },
      { title: 'Track Order', sub: 'Live Status' },
      { title: 'Call Now', sub: '+880 1XXX-XXXXXX' },
    ],
  },
  organicResult: {
    faviconText: '10',
    url: '10centagency.com › services › google-ads',
    title: 'Google Ads Management Services in Bangladesh | 10 Cent Agency',
    description:
      'Search, Shopping, Display & Performance Max campaigns managed for Bangladeshi SMEs — transparent reporting, no markup on ad spend, free audit call.',
  },
  legend: [
    { label: 'Top Ad Position (Search)', color: 'var(--ga-navy)' },
    { label: 'Sitelink Extensions', color: 'var(--ga-blue)' },
    { label: 'Organic Result Below', color: '#8fa2c2' },
  ],
  caption:
    'This is exactly how we position your ad — above the organic results, with sitelinks, call extensions, and pricing that make people click.',
};

// 3. OVERVIEW DATA
export const overviewClickDistribution: OverviewBarItem[] = [
  { label: 'Top 4 Paid Ad Positions', percentage: '65%', width: '65%' },
  { label: 'Organic Results', percentage: '28%', width: '28%' },
  { label: 'Maps / Shopping Panel', percentage: '7%', width: '7%' },
];

export const overviewSourceText =
  'Source: Industry commercial-intent search click benchmark data';

export const overviewBigStats = [
  {
    iconKey: 'FaBolt',
    value: '24–48h',
    label: 'Time to get your first click after launch — no waiting for rankings',
  },
  {
    iconKey: 'FaCartShopping',
    value: '2x',
    label: 'Higher purchase-intent than average social media clicks',
  },
];

export const overviewCompareBars = {
  selfManaged: {
    label: 'Self-Managed Account',
    sub: 'Baseline',
    width: '40%',
    innerText: 'Wasted Spend',
  },
  agencyManaged: {
    label: '10 Cent Agency Managed',
    sub: 'Lower Cost/Conversion',
    width: '88%',
    innerText: 'Optimized & Tracked',
  },
};

// 4. SERVICE BREAKDOWN CARDS
export const serviceCardsData: ServiceCardItem[] = [
  {
    id: 'search-ads',
    badge: 'One-time Setup + Retainer',
    title: 'Search Ads Management',
    checklist: [
      'Keyword research & match type strategy',
      'Ad copywriting with A/B tested headlines',
      'Sitelinks, callouts & call extensions setup',
    ],
  },
  {
    id: 'shopping-pmax',
    badge: 'One-time Setup + Retainer',
    title: 'Shopping & Performance Max',
    checklist: [
      'Google Merchant Center product feed setup',
      'Product title & feed optimization for approval',
      'Performance Max asset groups & audience signals',
    ],
  },
  {
    id: 'display-remarketing',
    badge: 'Monthly Retainer',
    title: 'Display & Remarketing',
    checklist: [
      "Retarget website visitors who didn't convert",
      'Custom banner creatives (multiple sizes)',
      'Lookalike & in-market audience targeting',
    ],
  },
  {
    id: 'youtube-ads',
    badge: 'Monthly Retainer',
    title: 'YouTube Ads',
    checklist: [
      'In-stream & discovery video ad campaigns',
      'Audience targeting by interest & competitor viewers',
      'Video script guidance for higher completion rate',
    ],
  },
  {
    id: 'conversion-tracking',
    badge: 'Included with Onboarding',
    title: 'Conversion Tracking Setup',
    checklist: [
      'Google Tag Manager & GA4 configuration',
      'Purchase, form, WhatsApp & call tracking',
      'Verified before any budget scaling begins',
    ],
  },
  {
    id: 'cro-guidance',
    badge: 'Consulting',
    title: 'Landing Page & CRO Guidance',
    checklist: [
      'Landing page audit for message match & speed',
      'Form-length and CTA placement recommendations',
      'Mobile load-time flags before spend scales',
    ],
  },
  {
    id: 'negative-keywords',
    badge: 'Ongoing',
    title: 'Negative Keywords & Waste Reduction',
    checklist: [
      'Weekly search term review',
      'Irrelevant clicks blocked before they cost you',
      "Budget reallocated to what's actually converting",
    ],
  },
  {
    id: 'monthly-reporting',
    badge: 'Included with Retainer',
    title: 'Monthly Reporting & Optimization',
    checklist: [
      'Plain-language performance report',
      'Cost-per-conversion & ROAS tracking',
      'Next-month strategy call',
    ],
  },
];

// 5. HOW WE WORK (6 Steps)
export const howWeWorkSteps: HowWeWorkStepItem[] = [
  {
    stepNumber: '1',
    stepTag: 'STEP 01',
    iconKey: 'FaMagnifyingGlass',
    title: 'Account & Competitor Audit',
    description:
      'Review existing account (or start fresh) and analyze what competitors are bidding on',
  },
  {
    stepNumber: '2',
    stepTag: 'STEP 02',
    iconKey: 'FaKey',
    title: 'Keyword & Budget Strategy',
    description:
      'Build keyword themes, match types, and a realistic starting budget for your goals',
  },
  {
    stepNumber: '3',
    stepTag: 'STEP 03',
    iconKey: 'FaCode',
    title: 'Conversion Tracking Setup',
    description:
      'Install and verify GTM/GA4 tracking before any real spend goes live',
  },
  {
    stepNumber: '4',
    stepTag: 'STEP 04',
    iconKey: 'FaRocket',
    title: 'Campaign Build & Launch',
    description:
      'Structure campaigns, write ad copy, add extensions, and go live',
  },
  {
    stepNumber: '5',
    stepTag: 'STEP 05',
    iconKey: 'FaFilter',
    title: 'Optimization Sprint',
    description:
      'Weekly negative keyword cleanup, bid adjustments, and ad copy testing',
  },
  {
    stepNumber: '6',
    stepTag: 'STEP 06',
    iconKey: 'FaChartLine',
    title: 'Scale & Report',
    description:
      "Scale what's converting, cut what isn't, and deliver a clear monthly report",
  },
];

// 6. STRATEGY TABS (7 Tabs)
export const strategyTabsData: StrategyTabItem[] = [
  {
    id: 0,
    title: 'Keyword & Match Types',
    iconKey: 'FaKey',
    paragraphs: [
      'We start by mapping the exact phrases your buyers type — not just broad category terms — and group them into tight themes so each ad group stays highly relevant.',
      'Match types are chosen deliberately: phrase and exact match for high-intent buying terms, broad match only when paired with strong negative keyword lists and smart bidding.',
      'For Bangladeshi businesses we also research Bangla and Banglish search patterns ("দাম কত", "price koto") alongside English terms.',
    ],
  },
  {
    id: 1,
    title: 'Ad Copy & Extensions',
    iconKey: 'FaPenNib',
    paragraphs: [
      'Every ad is written around a specific offer or benefit — price, delivery speed, warranty — not generic brand messaging that doesn\'t earn the click.',
      'We add sitelinks, callouts, structured snippets, and call extensions so your ad takes up more space on the results page and gives users more reasons to click.',
      'At least 2–3 ad variations run per ad group at all times so Google\'s algorithm can test and favor the best performer.',
    ],
  },
  {
    id: 2,
    title: 'Campaign Structure',
    iconKey: 'FaObjectGroup',
    paragraphs: [
      'Campaigns are split by product line, service type, or intent level (e.g., brand search vs generic search) so budget and bidding can be controlled precisely per theme.',
      'This structure also makes reporting clear — you can see exactly which product or service is generating conversions, not just a blended average.',
    ],
  },
  {
    id: 3,
    title: 'Bid Strategy & Budget',
    iconKey: 'FaSackDollar',
    paragraphs: [
      'New accounts typically start on manual or Maximize Clicks bidding to gather data quickly, then move to Target CPA or Target ROAS once there\'s enough conversion history for smart bidding to work reliably.',
      'Budget is allocated based on which campaigns are proving profitable — we don\'t spread spend evenly across everything by default.',
    ],
  },
  {
    id: 4,
    title: 'Audience & Remarketing',
    iconKey: 'FaUsers',
    paragraphs: [
      'We layer in-market and affinity audiences on top of keyword targeting to improve relevance, and build remarketing lists from website visitors, cart abandoners, and past customers.',
      'Remarketing campaigns typically run at a much lower cost-per-conversion since these users already know your brand.',
    ],
  },
  {
    id: 5,
    title: 'Conversion Tracking',
    iconKey: 'FaBullseye',
    paragraphs: [
      'Before scaling any budget, we verify that purchase, lead-form, WhatsApp click, and call conversions are firing correctly in Google Tag Manager and GA4.',
      'Without accurate tracking, Google\'s bidding algorithm is optimizing blind — this is the single most common reason self-managed accounts underperform.',
    ],
  },
  {
    id: 6,
    title: 'Negative Keywords',
    iconKey: 'FaBan',
    paragraphs: [
      'Every week, we review the actual search terms triggering your ads and block irrelevant queries — job seekers, unrelated product searches, competitor brand confusion — before they drain your budget.',
      'This ongoing cleanup is one of the fastest ways to lower cost-per-conversion without touching bids.',
    ],
  },
];

// 7. BUDGET FUNNEL (4 Stages)
export const funnelStagesData: FunnelStageItem[] = [
  {
    id: 'impressions',
    iconKey: 'FaEye',
    label: 'Impressions',
    target: 50000,
    formatted: '50,000',
    note: 'Your ad shown to people actively searching',
    dropRate: '3.6% CTR',
    stageWidth: 100,
  },
  {
    id: 'clicks',
    iconKey: 'FaArrowPointer',
    label: 'Clicks',
    target: 1800,
    formatted: '1,800',
    note: 'We optimize keywords & ad copy to earn this click',
    dropRate: '97% Landed',
    stageWidth: 72,
  },
  {
    id: 'visits',
    iconKey: 'FaGlobe',
    label: 'Website Visits',
    target: 1750,
    formatted: '1,750',
    note: 'We check landing page speed & message match here',
    dropRate: '4.8% Convert',
    stageWidth: 55,
  },
  {
    id: 'leads',
    iconKey: 'FaFlagCheckered',
    label: 'Leads / Sales',
    target: 85,
    formatted: '85',
    note: 'Conversion tracking confirms this is a real result, not a guess',
    stageWidth: 42,
    isHighlight: true,
  },
];

// 8. COMPARISON TABLE DATA
export const comparisonTableData: ComparisonRowItem[] = [
  {
    factor: 'Intent Level',
    googleAds: 'High — user is actively searching',
    facebookAds: 'Lower — user is browsing, not searching',
    seo: 'High — same as Google Ads, but organic',
  },
  {
    factor: 'Speed to Results',
    googleAds: 'Clicks within 24–48 hours',
    facebookAds: 'Impressions within hours',
    seo: '3–4 months for ranking movement',
  },
  {
    factor: 'Cost Model',
    googleAds: 'Pay per click, stops when budget stops',
    facebookAds: 'Pay per impression/click',
    seo: 'One-time + monthly retainer, compounds over time',
  },
  {
    factor: 'Best For',
    googleAds: 'Buyers ready to purchase now',
    facebookAds: 'Brand awareness, visual products',
    seo: 'Long-term, sustainable traffic',
  },
  {
    factor: 'Example Query',
    googleAds: '"buy office chair"',
    facebookAds: 'Scroll-stopping product video',
    seo: '"best office chairs for backpain" (organic rank)',
  },
];

export const comparisonTableCaption =
  'Most of our clients run Google Ads for immediate buyers while SEO builds long-term organic traffic in parallel.';

// 9. TECH STACK (4 categories x 3)
export const techStackData: TechCategoryItem[] = [
  {
    category: 'Research & Planning',
    iconKey: 'FaMagnifyingGlass',
    tools: [
      { name: 'Google Keyword Planner', iconKey: 'FaGoogle' },
      { name: 'SEMrush / SpyFu', iconKey: 'FaChartSimple' },
      { name: 'Competitor Ad Library', iconKey: 'FaUserSecret' },
    ],
  },
  {
    category: 'Campaign Management',
    iconKey: 'FaGears',
    tools: [
      { name: 'Google Ads Editor', iconKey: 'FaTableList' },
      { name: 'Google Merchant Center', iconKey: 'FaStore' },
      { name: 'YouTube Studio', iconKey: 'FaYoutube' },
    ],
  },
  {
    category: 'Tracking & Analytics',
    iconKey: 'FaBullseye',
    tools: [
      { name: 'Google Tag Manager', iconKey: 'FaTags' },
      { name: 'Google Analytics 4', iconKey: 'FaChartArea' },
      { name: 'Enhanced Conversions', iconKey: 'FaShieldHalved' },
    ],
  },
  {
    category: 'Reporting',
    iconKey: 'FaChartPie',
    tools: [
      { name: 'Looker Studio', iconKey: 'FaGoogleDrive' },
      { name: 'Custom Client Dashboards', iconKey: 'FaFileInvoice' },
      { name: 'Google Sheets Reporting', iconKey: 'FaTable' },
    ],
  },
];

// 10. WHY WORK WITH US (6 cards)
export const whyChooseUsData: WhyChooseUsItem[] = [
  {
    id: 'no-markup',
    title: 'No Markup on Ad Spend',
    iconKey: 'FaEye',
    description:
      'Fixed management fee only — your ad budget goes straight to Google, untouched.',
  },
  {
    id: 'tracking-first',
    title: 'Tracking Verified First',
    iconKey: 'FaBullseye',
    description:
      'We never scale spend on an account without confirmed, working conversion tracking.',
  },
  {
    id: 'local-expertise',
    title: 'Local Bangladesh Expertise',
    iconKey: 'FaEarthAsia',
    description:
      'Bangla + English keyword research and buying-behavior context built into every account.',
  },
  {
    id: 'transparent-reports',
    title: 'Transparent Reporting',
    iconKey: 'FaFileInvoice',
    description:
      'Plain-language monthly reports — no raw exports you need a manual to read.',
  },
  {
    id: 'account-ownership',
    title: 'You Own the Account',
    iconKey: 'FaKey',
    description:
      'Campaigns run inside your own Google Ads account — nothing is locked to us.',
  },
  {
    id: 'dedicated-manager',
    title: 'Dedicated Ads Manager',
    iconKey: 'FaUserTie',
    description:
      'One person accountable for your account\'s performance every single month.',
  },
];

// 11. 5 COMMON MISTAKES
export const commonMistakesData: CommonMistakeItem[] = [
  {
    number: 1,
    title: 'Running Ads Without Conversion Tracking',
    description:
      'Without tracking, Google\'s algorithm has no idea what a "good" click looks like, so it optimizes toward clicks — not sales or leads.',
  },
  {
    number: 2,
    title: 'Using Only Broad Match, No Negative Keywords',
    description:
      'This is the fastest way to burn budget on irrelevant searches that were never going to convert.',
  },
  {
    number: 3,
    title: 'Sending Traffic to a Slow Homepage',
    description:
      'Paying for a click that lands on a generic, slow-loading homepage instead of a focused landing page kills conversion rate.',
  },
  {
    number: 4,
    title: 'Never Reviewing Search Terms',
    description:
      'Accounts left untouched for months keep paying for the same wasted clicks week after week.',
  },
  {
    number: 5,
    title: 'Judging Performance Too Early',
    description:
      'Turning off a campaign after 3 days doesn\'t give Google\'s learning phase enough data to actually optimize.',
  },
];

// 12. BEFORE VS AFTER OUR OPTIMIZATION
export const beforeAfterData: {
  before: BeforeAfterCardItem;
  arrowText: string;
  after: BeforeAfterCardItem;
  caption: string;
} = {
  before: {
    badge: 'Month 1 — Before',
    title: 'Self-Managed Account',
    isGoodBadge: false,
    metrics: [
      { label: 'Cost Per Conversion', value: '$3.2', width: '85%', isBad: true },
      { label: 'Click-Through Rate', value: '1.2%', width: '25%', isBad: true },
      { label: 'Wasted Ad Spend', value: '40%', width: '40%', isBad: true },
      { label: 'Quality Score (avg)', value: '4/10', width: '40%', isBad: true },
    ],
  },
  arrowText: '90 Days of Management',
  after: {
    badge: 'Month 3 — After',
    title: '10 Cent Agency Managed',
    isGoodBadge: true,
    metrics: [
      { label: 'Cost Per Conversion', value: '$1.1', width: '38%', isBad: false },
      { label: 'Click-Through Rate', value: '3.8%', width: '78%', isBad: false },
      { label: 'Wasted Ad Spend', value: '8%', width: '8%', isBad: false },
      { label: 'Quality Score (avg)', value: '8/10', width: '80%', isBad: false },
    ],
  },
  caption:
    'Sample data based on average patterns across audited accounts. Your results depend on industry, competition, and starting point.',
};

// 13. STATS / RESULTS DATA
export const statsNumbers: StatItem[] = [
  { target: 25, suffix: '+', label: 'Ad Accounts Managed' },
  { target: 38, suffix: '%', label: 'Avg. Cost-Per-Conversion Reduction' },
  { target: 4, suffix: 'x', label: 'Avg. Return on Ad Spend' },
  { target: 95, suffix: '%', label: 'Client Retention Rate' },
];

export const statsDonut = {
  percentage: '45%',
  label: 'Waste Cut',
  title: 'Wasted Spend Recovery (Sample)',
  description:
    'On average, we identify and eliminate 45% of previously wasted spend within the first 60 days through negative keywords and bid restructuring.',
};

// 14. REPORT ANATOMY + LIVE FEED DATA
export const reportMockupData = {
  fileName: 'Monthly_Performance_Report_Nov.pdf',
  campaignName: 'Search Campaign — Furniture',
  campaignTag: 'Active',
  metrics: [
    { label: 'Impressions', value: '42,180' },
    { label: 'Clicks', value: '1,860' },
    { label: 'CTR', value: '4.4%' },
    { label: 'Avg CPC', value: '$0.45' },
  ],
  changelog: [
    'Added 14 negative keywords',
    'Tested 2 new ad headlines',
    'Shifted 15% budget to Shopping',
  ],
  trendTitle: 'Cost Per Conversion Trend',
  trendBadge: '-38%',
  planTitle: "Next Month's Plan",
  planText:
    'Scale Shopping budget +20%, launch Performance Max test, refresh top 3 ad creatives.',
  pins: [
    {
      id: 1,
      title: 'Campaign Breakdown',
      text: 'Every campaign gets its own row — impressions, clicks, CTR, and CPC, so you see exactly where your budget is going, not a blended average.',
    },
    {
      id: 2,
      title: 'Change Log',
      text: 'We log every action taken on your account this month — what was added, paused, or tested — so you know the work actually happened.',
    },
    {
      id: 3,
      title: 'Trend Tracking',
      text: 'A simple visual so you can see if cost-per-conversion is improving month over month — no need to read raw spreadsheets.',
    },
    {
      id: 4,
      title: 'Forward Plan',
      text: 'Every report ends with what we\'re doing next — so you\'re never guessing what happens after this month.',
    },
  ],
};

export const liveFeedItems: FeedListItem[] = [
  {
    id: 1,
    type: 'good',
    iconKey: 'FaBan',
    strongText: '8 negative keywords added',
    restText: ' — blocked irrelevant "job" & "free" searches',
    time: '2 hours ago',
  },
  {
    id: 2,
    type: 'good',
    iconKey: 'FaVial',
    strongText: 'New ad headline tested',
    restText: ' — Variant B winning by 22% CTR',
    time: 'Yesterday',
  },
  {
    id: 3,
    type: 'warn',
    iconKey: 'FaPause',
    strongText: 'Underperforming keyword paused',
    restText: ' — "furniture wholesale" (CPA too high)',
    time: '3 days ago',
  },
  {
    id: 4,
    type: 'good',
    iconKey: 'FaMoneyBillTrendUp',
    strongText: 'Budget reallocated',
    restText: ' — +15% to Shopping campaign (best ROAS)',
    time: '5 days ago',
  },
  {
    id: 5,
    type: 'good',
    iconKey: 'FaBullseye',
    strongText: 'Conversion tracking verified',
    restText: ' — WhatsApp click events confirmed firing',
    time: '1 week ago',
  },
];

export const liveFeedFootnote =
  'Sample activity log — every managed account gets weekly actions like these.';

// 15. PRICING PACKAGES (3 cards)
export const pricingPackagesData: PricingPackageItem[] = [
  {
    id: 'search-starter',
    badge: 'Best for Startups',
    title: 'Search Starter',
    note: 'A focused Search-only campaign to test paid traffic',
    isPopular: false,
    bullets: [
      'Single Search campaign setup',
      'Conversion tracking (GTM + GA4)',
      'Monthly performance report',
      'Weekly negative keyword review',
    ],
    ctaText: 'Get Custom Quote',
    ctaHref: '/contact',
  },
  {
    id: 'growth-search-shopping',
    badge: 'Most Popular',
    title: 'Growth (Search + Shopping)',
    note: 'For e-commerce and lead-gen businesses ready to scale',
    isPopular: true,
    bullets: [
      'Everything in Search Starter',
      'Shopping campaign + Merchant Center feed',
      'Remarketing campaign setup',
      'Bi-weekly optimization calls',
    ],
    ctaText: 'Get Custom Quote',
    ctaHref: '/contact',
  },
  {
    id: 'pro-full-funnel',
    badge: 'Full Funnel',
    title: 'Pro (Full Funnel)',
    note: 'Search, Shopping, Display, YouTube & Performance Max together',
    isPopular: false,
    bullets: [
      'Everything in Growth',
      'YouTube & Performance Max campaigns',
      'Landing page CRO consulting',
      'Dedicated ads manager + priority support',
    ],
    ctaText: 'Get Custom Quote',
    ctaHref: '/contact',
  },
];

export const pricingNoteText = {
  prefix:
    'Your ad spend is billed directly by Google to your own account — our fee is only for management.',
  boldLead: 'Book a free audit',
  suffix: "and we'll recommend the right starting budget and package.",
};

// 16. INDUSTRIES WE SERVE (6 cards)
export const industriesData: IndustryItem[] = [
  {
    id: 'ecommerce',
    iconKey: 'FaCartShopping',
    title: 'E-commerce',
    description:
      'Shopping ads with product images and price directly in search results, plus remarketing for cart abandoners.',
    tagText: 'High Purchase Intent',
  },
  {
    id: 'real-estate',
    iconKey: 'FaHouse',
    title: 'Real Estate',
    description:
      'Search ads with call extensions and lead-form tracking for instant inquiry capture from serious buyers.',
    tagText: 'High Purchase Intent',
  },
  {
    id: 'healthcare',
    iconKey: 'FaHeartPulse',
    title: 'Healthcare',
    description:
      'Local Search campaigns with call extensions and appointment-booking conversion tracking.',
    tagText: 'High Purchase Intent',
  },
  {
    id: 'education',
    iconKey: 'FaGraduationCap',
    title: 'Education',
    description:
      'Lead-gen Search campaigns with form tracking and remarketing to nurture prospective students.',
    tagText: 'High Purchase Intent',
  },
  {
    id: 'professional-services',
    iconKey: 'FaBriefcase',
    title: 'Professional Services',
    description:
      'Search campaigns targeting high-value commercial keywords, paired with landing page CRO guidance.',
    tagText: 'High Purchase Intent',
  },
  {
    id: 'restaurant-food',
    iconKey: 'FaUtensils',
    title: 'Restaurant & Food',
    description:
      'Local Search + Display remarketing to bring back past customers with fresh offers.',
    tagText: 'High Purchase Intent',
  },
];

// 17. FAQS (8 items, with full schemaText)
export const faqsData: FAQItem[] = [
  {
    id: 1,
    question: 'How much budget do I need to start with Google Ads?',
    paragraphs: [
      "There's no fixed minimum, but for most Bangladeshi SMEs we recommend starting with at least BDT 20,000–35,000 per month in ad spend so Google's algorithm has enough clicks and conversions to optimize toward — anything lower and the account stays stuck in a data-starved learning loop.",
      'The right number depends heavily on your industry: a real estate agency targeting "apartment for rent in Gulshan" might see cost-per-click of BDT 40–90 due to high competition, while a niche B2B service with long-tail keywords might pay BDT 10–20 per click. During the free audit call, we calculate your average order value or lead value, benchmark it against typical landing page conversion rates (usually 2–5%), and back into a realistic starting budget instead of quoting a generic number.',
      "If your budget is tight, we don't spread it thin — we narrow the campaign to 1–2 of your highest-intent keyword themes first and expand once we see what's actually converting.",
    ],
    schemaText:
      "There's no fixed minimum, but for most Bangladeshi SMEs we recommend starting with at least BDT 20,000–35,000 per month in ad spend so Google's algorithm has enough clicks and conversions to optimize toward — anything lower and the account stays stuck in a data-starved learning loop. The right number depends heavily on your industry: a real estate agency targeting 'apartment for rent in Gulshan' might see cost-per-click of BDT 40–90 due to high competition, while a niche B2B service with long-tail keywords might pay BDT 10–20 per click. During the free audit call, we calculate your average order value or lead value, benchmark it against typical landing page conversion rates (usually 2–5%), and back into a realistic starting budget instead of quoting a generic number. If your budget is tight, we don't spread it thin — we narrow the campaign to 1–2 of your highest-intent keyword themes first and expand once we see what's converting.",
  },
  {
    id: 2,
    question: 'Do you take a percentage of my ad spend?',
    paragraphs: [
      'No — we never take a cut of your ad spend. We charge a fixed monthly management fee based on account complexity (number of campaigns, channels, and hands-on optimization required), and that fee stays the same whether you spend BDT 20,000 or BDT 2,00,000 a month.',
      'Your ad budget is billed directly by Google to your own billing profile — we never see or touch that money. A single Search-only campaign for a local service business is priced differently than a multi-channel Search + Shopping + Performance Max account for an e-commerce brand with 200+ SKUs, and we quote the exact fee for your setup before you sign anything. This model keeps our incentive tied to lowering your cost-per-conversion, not convincing you to spend more.',
    ],
    schemaText:
      'No — we never take a cut of your ad spend. We charge a fixed monthly management fee based on account complexity (number of campaigns, channels, and hands-on optimization required), and that fee stays the same whether you spend BDT 20,000 or BDT 2,00,000 a month. Your ad budget is billed directly by Google to your own billing profile — we never see or touch that money. A single Search-only campaign for a local service business is priced differently than a multi-channel Search + Shopping + Performance Max account for an e-commerce brand with 200+ SKUs, and we quote the exact fee for your specific setup before you sign anything. This model keeps our incentive tied to lowering your cost-per-conversion, not convincing you to spend more.',
  },
  {
    id: 3,
    question: 'How fast can I expect results from Google Ads?',
    paragraphs: [
      "Because Google Ads runs on an auction, not a ranking algorithm, your Search ads can start showing and getting clicks within 24–48 hours of launch — there's no waiting to rank the way there is with SEO.",
      "The first 2–3 weeks are the learning phase: we're collecting search-term data, adding negative keywords daily, and running 2–3 ad variations to see which copy performs best. Most clients see a meaningful drop in cost-per-conversion by week 3–4, once obvious wasted clicks are blocked and the algorithm has enough conversion data to bid smarter.",
      'Shopping and Performance Max take a bit longer — Google itself recommends at least 15–30 conversions before Smart Bidding stabilizes, which for most accounts takes 4–8 weeks. A fully optimized, predictable account typically takes 2–3 months of continuous management.',
    ],
    schemaText:
      "Because Google Ads runs on an auction, not a ranking algorithm, your Search ads can start showing and getting clicks within 24–48 hours of launch — there's no waiting to rank the way there is with SEO. The first 2–3 weeks are the learning phase: we're collecting search-term data, adding negative keywords daily, and running 2–3 ad variations to see which copy performs best. Most clients see a meaningful drop in cost-per-conversion by week 3–4, once obvious wasted clicks are blocked and the algorithm has enough conversion data to bid smarter. Shopping and Performance Max take a bit longer — Google itself recommends at least 15–30 conversions before Smart Bidding stabilizes, which for most accounts takes 4–8 weeks. A fully optimized, predictable account you can forecast cost-per-lead or ROAS from typically takes 2–3 months of continuous management.",
  },
  {
    id: 4,
    question: 'Can you guarantee a specific number of leads or sales?',
    paragraphs: [
      'No ethical agency can promise an exact number of leads or sales, because the ad is only one part of the equation — your pricing, offer, website speed, and sales follow-up all affect the outcome as much as the campaign itself.',
      'What we commit to is a properly structured account, verified conversion tracking from day one, transparent monthly reporting you can actually understand, and continuous week-by-week optimization based on real data, not guesswork.',
      'After the first audit, we give a realistic forecast range — for example, "expect roughly BDT 150–250 cost-per-lead in month one, improving to BDT 90–150 by month three" — based on benchmarks from similar accounts we\'ve managed, so you know what to expect instead of a vague promise.',
    ],
    schemaText:
      "No ethical agency can promise an exact number of leads or sales, because the ad is only one part of the equation — your pricing, offer, website speed, and sales follow-up all affect the outcome as much as the campaign itself. What we commit to is a properly structured account, verified conversion tracking from day one, transparent monthly reporting you can actually understand, and continuous week-by-week optimization based on real data, not guesswork. After the first audit, we give a realistic forecast range — for example, 'expect roughly BDT 150–250 cost-per-lead in month one, improving to BDT 90–150 by month three' — based on benchmarks from similar accounts we've managed, so you know what to expect instead of a vague promise.",
  },
  {
    id: 5,
    question:
      'What is the difference between Search, Shopping, Display, and Performance Max?',
    paragraphs: [
      'Search ads are text ads shown when someone actively types a query like "buy sofa set Dhaka" — the highest-intent format since the person is already looking to act. Shopping ads show your product photo, name, and price directly in search results, working like a mini storefront inside Google — best for e-commerce.',
      'Display ads are banner ads shown across the Google Display Network of news sites, blogs, and apps — best for remarketing to past visitors or low-cost brand awareness. Performance Max is Google\'s automated campaign type that pulls your budget across Search, Display, YouTube, Gmail, and Maps from one campaign using AI bidding — best once you have at least a month or two of solid conversion data.',
      'We typically launch new accounts with Search first, layer in Shopping within the first month for product businesses, and introduce Performance Max around month two or three once tracking is proven reliable.',
    ],
    schemaText:
      "Search ads are text ads shown when someone actively types a query like 'buy sofa set Dhaka' — the highest-intent format since the person is already looking to act. Shopping ads show your product photo, name, and price directly in search results, working like a mini storefront inside Google — best for e-commerce. Display ads are banner ads shown across the Google Display Network of news sites, blogs, and apps — best for remarketing to past visitors or low-cost brand awareness. Performance Max is Google's automated campaign type that pulls your budget across Search, Display, YouTube, Gmail, and Maps from one campaign using AI bidding — best once you have at least a month or two of solid conversion data. We typically launch new accounts with Search first, layer in Shopping within the first month for product businesses, and introduce Performance Max around month two or three once tracking is proven reliable.",
  },
  {
    id: 6,
    question: 'Do I need conversion tracking set up before running ads?',
    paragraphs: [
      'Yes, and this is one of the first things we set up during onboarding, typically within the first 3–5 business days, before your budget spends seriously.',
      'Without tracking purchases, form submissions, WhatsApp clicks, or calls, Google Ads has no signal to know which clicks actually turned into business, so it optimizes toward cheap clicks instead of real customers — the single biggest reason self-managed accounts underperform.',
      'We install Google Tag Manager, connect GA4 for website events, set up click-to-WhatsApp tracking (since many Bangladeshi customers prefer inquiring this way), and configure e-commerce or lead-form tracking based on your business model. We then test each conversion manually before scaling spend past the initial testing budget.',
    ],
    schemaText:
      'Yes, and this is one of the first things we set up during onboarding, typically within the first 3–5 business days, before your budget spends seriously. Without tracking purchases, form submissions, WhatsApp clicks, or calls, Google Ads has no signal to know which clicks actually turned into business, so it optimizes toward cheap clicks instead of real customers — the single biggest reason self-managed accounts underperform. We install Google Tag Manager, connect GA4 for website events, set up click-to-WhatsApp tracking (since many Bangladeshi customers prefer inquiring this way), and configure e-commerce or lead-form tracking based on your business model. We then test each conversion manually — submitting a test form, clicking the WhatsApp button ourselves — and confirm it fires correctly before scaling spend past the initial testing budget.',
  },
  {
    id: 7,
    question: 'Who owns the Google Ads account and the data?',
    paragraphs: [
      'You own it, fully and always. We work inside your own Google Ads account using Google\'s manager account (MCC) access, meaning we manage campaigns without ever needing your password, or we help you create a fresh account under your business email if you\'re starting from zero.',
      'If you ever pause working with us, we simply remove our manager access; your account, full campaign history, conversion data, remarketing audience lists, and billing stay exactly as they are under your ownership. Nothing is ever locked behind an agency login.',
    ],
    schemaText:
      "You own it, fully and always. We work inside your own Google Ads account using Google's manager account (MCC) access, meaning we manage campaigns without ever needing your password, or we help you create a fresh account under your business email if you're starting from zero. If you ever pause working with us, we simply remove our manager access; your account, full campaign history, conversion data, remarketing audience lists, and billing stay exactly as they are under your ownership. Nothing is ever locked behind an agency login.",
  },
  {
    id: 8,
    question: "What's included in the monthly report?",
    paragraphs: [
      'Every month, typically delivered within the first 5 business days of the following month, you receive a plain-language report covering impressions, clicks, click-through rate, average cost-per-click, conversions, cost-per-conversion, and return on ad spend (for e-commerce), broken down campaign by campaign.',
      'Alongside the numbers, we include a short summary of what changed — for example, "added 12 new negative keywords, tested 2 new ad headlines, shifted 15% more budget to the Shopping campaign because it had the lowest cost-per-order" — plus what we\'re testing next. We also schedule a 20–30 minute call to walk through the report together, so you\'re never left decoding a spreadsheet alone.',
    ],
    schemaText:
      "Every month, typically delivered within the first 5 business days of the following month, you receive a plain-language report covering impressions, clicks, click-through rate, average cost-per-click, conversions, cost-per-conversion, and return on ad spend (for e-commerce), broken down campaign by campaign. Alongside the numbers, we include a short summary of what changed — for example, 'added 12 new negative keywords, tested 2 new ad headlines, shifted 15% more budget to the Shopping campaign because it had the lowest cost-per-order' — plus what we're testing next. We also schedule a 20–30 minute call to walk through the report together, so you're never left decoding a spreadsheet alone.",
  },
];

// 18. TESTIMONIALS (3 cards)
export const testimonialsData: TestimonialItem[] = [
  {
    id: 'rh',
    name: 'Rafiul Haque',
    role: 'Owner, UrbanCart BD',
    avatar: 'RH',
    tag: 'Search + Shopping',
    rating: 5,
    quote:
      '"We were burning budget on broad keywords with no tracking before. Within the first month, 10 Cent Agency set up proper conversion tracking and cut our irrelevant clicks dramatically. Our cost-per-order dropped noticeably and we finally know which products are actually profitable to advertise."',
  },
  {
    id: 'rk',
    name: 'Raihan Kabir',
    role: 'Director, BrightPath Academy',
    avatar: 'RK',
    tag: 'Lead Generation',
    rating: 5,
    quote:
      '"As a coaching center, our biggest issue was inconsistent inquiries. The Search campaigns they built bring in steady form submissions every week, and the monthly report actually makes sense to me — I know exactly what I\'m paying for."',
  },
  {
    id: 'ki',
    name: 'Kamrul Islam',
    role: 'Manager, Dhaka Homes Realty',
    avatar: 'KI',
    tag: 'Real Estate Leads',
    rating: 4,
    quote:
      '"Property inquiries used to come in randomly. Now we get consistent, qualified calls from people actually looking to rent in our target areas. Still working on lowering cost-per-lead further on our most competitive listings, but the difference from before is night and day."',
  },
];

// 19. CLOSING SUMMARY
export const closingSummaryData = {
  title: 'The Bottom Line',
  paragraphs: [
    'Google Ads is the fastest way to reach buyers who are actively looking for what you sell — but only when it\'s structured properly, tracked accurately, and optimized continuously.',
    'At 10 Cent Agency, we manage your account like it\'s our own budget — transparent reporting, no markup on ad spend, and a dedicated manager watching performance every week.',
  ],
};

// Connected Schema.org @graph generator
export function getGoogleAdsSchemaGraph() {
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
        '@id': 'https://www.10centagency.com/services/google-ads#webpage',
        url: 'https://www.10centagency.com/services/google-ads',
        name: 'Google Ads Management Services in Bangladesh | 10 Cent Agency',
        description:
          'Google Ads management in Bangladesh — Search, Shopping, Display, YouTube & Performance Max campaigns. Transparent reporting, no markup on ad spend. Book a free audit.',
        inLanguage: 'en-BD',
        isPartOf: {
          '@id': 'https://www.10centagency.com/#website',
        },
        breadcrumb: {
          '@id': 'https://www.10centagency.com/services/google-ads#breadcrumb',
        },
        about: {
          '@id': 'https://www.10centagency.com/services/google-ads#service',
        },
        mainEntity: {
          '@id': 'https://www.10centagency.com/services/google-ads#service',
        },
      },
      {
        '@type': 'Service',
        '@id': 'https://www.10centagency.com/services/google-ads#service',
        name: 'Google Ads Management Services',
        serviceType: 'Google Ads Management',
        url: 'https://www.10centagency.com/services/google-ads',
        description:
          '10 Cent Agency manages Google Ads (Search, Shopping, Display, YouTube & Performance Max) for small and medium businesses in Bangladesh — including keyword research, conversion tracking, landing page guidance, waste reduction, and transparent monthly reporting with no markup on ad spend.',
        provider: {
          '@id': 'https://www.10centagency.com/#organization',
        },
        mainEntityOfPage: {
          '@id': 'https://www.10centagency.com/services/google-ads#webpage',
        },
        areaServed: {
          '@type': 'Country',
          name: 'Bangladesh',
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://www.10centagency.com/services/google-ads#breadcrumb',
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
            name: 'Google Ads',
            item: 'https://www.10centagency.com/services/google-ads',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://www.10centagency.com/services/google-ads#faq',
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

