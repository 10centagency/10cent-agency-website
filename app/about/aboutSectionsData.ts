// Data definitions for the 7 new sections on /about (source of truth: aboutpage-sections-demo.html)

export interface ComparisonRow {
  text: string;
  isPositive: boolean;
}

export interface ComparisonCard {
  title: string;
  subtitle: string;
  badge?: string;
  logoSrc?: string;
  rows: string[];
}

export interface CaseStudyItem {
  id: string;
  tag: string;
  iconName: 'FaArrowTrendUp' | 'FaLaptopCode' | 'FaRobot';
  client: string;
  prefix?: string;
  target: number;
  decimals?: number;
  unit: string;
  metricLabel: string;
  description: string;
  visualType: 'bars' | 'duo' | 'bot';
}

export interface PromiseItem {
  text: string;
}

export interface StatItem {
  target: number | string;
  suffix?: string;
  label: string;
  isStatic?: boolean;
}

export interface ProblemLayerItem {
  type: 'before' | 'after';
  title: string;
  subtitle: string;
  faceIcon: 'frown' | 'smile';
  points: string[];
  moodLabel: string;
  moodPercentage: number;
}

export interface IndustryItem {
  name: string;
  iconName:
    | 'FaUtensils'
    | 'FaShirt'
    | 'FaGraduationCap'
    | 'FaSuitcaseMedical'
    | 'FaBuilding'
    | 'FaCartShopping'
    | 'FaScaleBalanced'
    | 'FaWandMagicSparkles'
    | 'FaRocket'
    | 'FaStore'
    | 'FaBookOpen'
    | 'FaPlane'
    | 'FaPills'
    | 'FaDumbbell';
  delay: string;
}

export interface CommunityCardItem {
  tag: string;
  iconName: 'FaHandshake' | 'FaUsers' | 'FaBullhorn';
  title: string;
  description: string;
  delay: string;
}

// -----------------------------------------------------------------------------
// SECTION 1: Why Choose Us
// -----------------------------------------------------------------------------
export const whyChooseUsData = {
  label: 'Why Choose Us',
  titlePrefix: 'High-End Growth Support, ',
  titleAccent: 'Built for Smaller Budgets',
  description:
    "Running a small business shouldn't mean settling for less. Here's how we compare to corporate agencies.",
  usCard: {
    title: '10 Cent Agency',
    subtitle: 'Your dedicated growth team',
    badge: '★ Best Choice',
    logoSrc: '/favicon-48x48.png',
    rows: [
      'Affordable & transparent pricing',
      'Built for small & growing businesses',
      'Direct access to the people doing the work',
      'High commitment — we grow when you grow',
      'Replies within 2–4 hours on WhatsApp', // Corrected owner-approved line
      'Month-to-month — cancel anytime',
    ],
  },
  themCard: {
    title: 'Typical Corporate Agency',
    subtitle: 'The traditional route',
    rows: [
      'Expensive retainers & hidden costs',
      'Focus on large corporate clients',
      'Slow, layered communication',
      'Low priority for smaller clients',
      '2–3 working-day response times',
      '6–12 month lock-in contracts',
    ],
  },
  conclusionNote:
    'a full multi-disciplinary team — strategy, design, development and AI — at a cost comparable to a single junior employee.',
};

// -----------------------------------------------------------------------------
// SECTION 2: Results / Case Studies
// -----------------------------------------------------------------------------
export const caseStudiesData: {
  label: string;
  titlePrefix: string;
  titleAccent: string;
  description: string;
  items: CaseStudyItem[];
  ctaText: string;
  ctaHref: string;
} = {
  label: 'Case Studies',
  titlePrefix: 'Real Results for ',
  titleAccent: 'Real Businesses',
  description:
    'A quick look at what happens when strategy, execution and tracking come together.',
  items: [
    {
      id: 'case-fb-ads',
      tag: 'Facebook Ads',
      iconName: 'FaArrowTrendUp',
      client: 'E-commerce Brand',
      target: 4.2,
      decimals: 1,
      unit: '×',
      metricLabel: 'return on ad spend',
      description:
        'Advantage+ campaigns with server-side tracking — every taka accounted for.',
      visualType: 'bars',
    },
    {
      id: 'case-website',
      tag: 'Website',
      iconName: 'FaLaptopCode',
      client: 'Local Service Business',
      prefix: '+',
      target: 60,
      decimals: 0,
      unit: '%',
      metricLabel: 'more leads every month',
      description:
        'A fast, conversion-first website that turns visitors into paying inquiries.',
      visualType: 'duo',
    },
    {
      id: 'case-ai-automation',
      tag: 'AI Automation',
      iconName: 'FaRobot',
      client: 'Online Retailer',
      target: 10,
      decimals: 0,
      unit: 'hrs',
      metricLabel: 'saved every single week',
      description:
        'A chatbot that answers, qualifies and confirms orders — 24/7, in Bangla or English.',
      visualType: 'bot',
    },
  ],
  ctaText: 'View All Case Studies',
  ctaHref: '/portfolio',
};

// -----------------------------------------------------------------------------
// SECTION 3: Our Promise
// -----------------------------------------------------------------------------
export const promiseData = {
  label: 'Our Promise',
  strikes: ['waste', 'hidden fees', 'lock-in contracts'],
  finalHighlight: 'grows your business',
  chips: [
    'Zero markup on ad spend',
    'You own every account & asset',
    'Plain-language monthly reports',
  ],
};

// -----------------------------------------------------------------------------
// SECTION 4: By The Numbers (same numbers as homepage WhyChooseUs stats)
// -----------------------------------------------------------------------------
export const numbersData = {
  label: 'By The Numbers',
  titlePrefix: 'The Numbers ',
  titleAccent: 'Behind the Work',
  stats: [
    { target: 40, suffix: '+', label: 'Projects Completed', delay: '0s' },
    { target: 98, suffix: '%', label: 'Delivery Rate', delay: '0.1s' },
    { target: 7, suffix: '', label: 'Core Services', delay: '0.2s' },
    { target: '24/7', suffix: '', label: 'Support', isStatic: true, delay: '0.3s' },
  ],
};

// -----------------------------------------------------------------------------
// SECTION 5: The Problem We Solve
// -----------------------------------------------------------------------------
export const problemBeforeAfterData = {
  label: 'The Problem We Solve',
  titlePrefix: 'Same Business. ',
  titleAccent: 'Different Story.',
  description:
    'Flip the switch — see what changes when a growing business stops settling for less and starts scaling.',
  hint: 'Tap the switch to compare',
  beforeLayer: {
    type: 'before' as const,
    title: 'Life Before 10 Cent Agency',
    subtitle: 'Where most small businesses are stuck',
    faceIcon: 'frown' as const,
    points: [
      'Priced out by large agencies',
      'Chasing unreliable freelancers',
      'Wasting nights DIY-ing your marketing',
      'Campaigns that quietly go nowhere',
    ],
    moodLabel: 'Business mood',
    moodPercentage: 30,
  },
  afterLayer: {
    type: 'after' as const,
    title: 'Life With 10 Cent Agency',
    subtitle: 'Where you could be in 90 days',
    faceIcon: 'smile' as const,
    points: [
      'One affordable team for everything',
      'Direct communication, fast replies',
      "Your evenings back — run the business, we'll run the marketing",
      'Campaigns that compound month after month',
    ],
    moodLabel: 'Business mood',
    moodPercentage: 95,
  },
  captions: {
    before: 'Sound familiar?',
    after: "That's what one decision changes.",
  },
};

// -----------------------------------------------------------------------------
// SECTION 6: Industries We Serve
// -----------------------------------------------------------------------------
export const industriesData: IndustryItem[] = [
  { name: 'Restaurant', iconName: 'FaUtensils', delay: '0.00s' },
  { name: 'Clothing Brand', iconName: 'FaShirt', delay: '0.05s' },
  { name: 'Coaching Center', iconName: 'FaGraduationCap', delay: '0.10s' },
  { name: 'Healthcare', iconName: 'FaSuitcaseMedical', delay: '0.15s' },
  { name: 'Real Estate', iconName: 'FaBuilding', delay: '0.20s' },
  { name: 'E-commerce', iconName: 'FaCartShopping', delay: '0.25s' },
  { name: 'Law Firm', iconName: 'FaScaleBalanced', delay: '0.30s' },
  { name: 'Beauty Salon', iconName: 'FaWandMagicSparkles', delay: '0.35s' },
  { name: 'Tech Startup', iconName: 'FaRocket', delay: '0.40s' },
  { name: 'Local Retail', iconName: 'FaStore', delay: '0.45s' },
  { name: 'Education', iconName: 'FaBookOpen', delay: '0.50s' },
  { name: 'Travel Agency', iconName: 'FaPlane', delay: '0.55s' },
  { name: 'Pharmacy', iconName: 'FaPills', delay: '0.60s' },
  { name: 'Gym & Fitness', iconName: 'FaDumbbell', delay: '0.65s' },
];

// -----------------------------------------------------------------------------
// SECTION 7: Community Commitment
// -----------------------------------------------------------------------------
export const communityData = {
  label: 'Community Commitment',
  titlePrefix: 'Growing Bangladesh, ',
  titleAccent: 'One Business at a Time',
  description:
    "When local businesses grow, everyone grows. Here's how we give back beyond client work.",
  cards: [
    {
      tag: 'Monthly',
      iconName: 'FaHandshake' as const,
      title: 'Free Startup Consultation',
      description:
        'Every month, one selected startup receives a complete growth strategy consultation — free, no strings attached.',
      delay: '0.00s',
    },
    {
      tag: 'Ongoing',
      iconName: 'FaUsers' as const,
      title: 'Local Business Events',
      description:
        'We host and join community events that help local business owners master digital growth.',
      delay: '0.12s',
    },
    {
      tag: 'Always Free',
      iconName: 'FaBullhorn' as const,
      title: 'Tips, Guides & Resources',
      description:
        'Practical digital marketing knowledge — shared free on our blog and social channels, forever.',
      delay: '0.24s',
    },
  ],
  referralText: 'Know a startup that deserves a boost?',
  referralLinkText: 'Refer them',
  referralHref: '/contact',
};
