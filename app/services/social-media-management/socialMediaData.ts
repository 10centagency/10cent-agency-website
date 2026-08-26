export interface ServiceCard {
  id: string;
  badge: string;
  title: string;
  features: string[];
}

export interface TimelineMilestone {
  dayRange: string;
  title: string;
  iconKey: string;
  bullets: string[];
  align: 'left' | 'right';
}

export interface StrategyTab {
  id: number;
  title: string;
  iconKey: string;
  paragraphs: string[];
}

export interface WhyChooseCard {
  iconKey: string;
  title: string;
  description: string;
}

export interface CommonMistake {
  number: number;
  title: string;
  description: string;
}

export interface PricingPackage {
  id: string;
  badge: string;
  isPopular?: boolean;
  name: string;
  platforms: {
    key: string;
    iconKey: string;
    className: string;
  }[];
  note: string;
  features: string[];
  ctaText: string;
  ctaHref: string;
}

export interface IndustryCard {
  iconKey: string;
  title: string;
  description: string;
}

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

export interface TestimonialItem {
  id: string;
  rating: number;
  tag: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  initials: string;
  avatarClass: string;
}

export interface RelatedService {
  iconKey: string;
  title: string;
  description: string;
  href: string;
}

export interface CalendarDayChip {
  day: string;
  platform: string;
  iconKey: string;
  chipClass: string;
}

/* ==========================================================================
   0. CONTENT CALENDAR CHIPS DATA
   ========================================================================== */
export const calendarDayChipsData: CalendarDayChip[] = [
  { day: 'Sun', platform: 'Post', iconKey: 'FaFacebookF', chipClass: 'chipFb' },
  { day: 'Mon', platform: 'Reel', iconKey: 'FaInstagram', chipClass: 'chipIg' },
  { day: 'Tue', platform: 'Article', iconKey: 'FaLinkedinIn', chipClass: 'chipLi' },
  { day: 'Wed', platform: 'Update', iconKey: 'FaGoogle', chipClass: 'chipGbp' },
  { day: 'Thu', platform: 'Carousel', iconKey: 'FaInstagram', chipClass: 'chipIg' },
  { day: 'Fri', platform: 'Short', iconKey: 'FaYoutube', chipClass: 'chipYt' },
  { day: 'Sat', platform: 'Story', iconKey: 'FaFacebookF', chipClass: 'chipFb' },
];

/* ==========================================================================
   1. OVERVIEW DATA
   ========================================================================== */
export const overviewEngagementBars = [
  {
    label: 'Static Image Post',
    rate: '1.5% Engagement',
    width: '24%',
  },
  {
    label: 'Carousel / Multi-Image Post',
    rate: '3.2% Engagement',
    width: '52%',
  },
  {
    label: 'Reels / Short-Form Video',
    rate: '6.5% Engagement',
    width: '95%',
  },
];

export const overviewCompareBars = {
  inconsistent: {
    label: 'Inconsistent / Random Posting',
    sub: 'Baseline',
    width: '40%',
    innerText: 'Limited Reach',
  },
  consistent: {
    label: 'With 10 Cent Agency Content Calendar',
    sub: '~3x More Reach',
    width: '92%',
    innerText: 'Consistent Growth',
  },
};

/* ==========================================================================
   2. SERVICE CARDS DATA
   ========================================================================== */
export const serviceCardsData: ServiceCard[] = [
  {
    id: 'content-strategy',
    badge: 'Monthly Retainer',
    title: 'Content Strategy & Calendar Planning',
    features: [
      'Platform-specific content calendar (FB, IG, LinkedIn, YouTube, GBP)',
      'Audience & competitor research',
      'Content pillars & monthly themes',
      'Festival, occasion & campaign-based planning',
    ],
  },
  {
    id: 'post-design',
    badge: 'Monthly Retainer',
    title: 'Post Design & Graphic Content',
    features: [
      'Custom static post design in Bangla & English',
      'Carousel / multi-slide post design',
      'Branded templates matching your visual identity',
      'Story design for Facebook & Instagram',
    ],
  },
  {
    id: 'video-production',
    badge: 'Add-on / Monthly',
    title: 'Video, Reels & Thumbnail Production',
    features: [
      'Reels / Shorts editing for Instagram, Facebook & YouTube',
      'Trending audio & caption integration',
      'Basic motion graphics for posts',
      'Custom thumbnail design for YouTube & video content',
    ],
  },
  {
    id: 'facebook-instagram',
    badge: 'Monthly Retainer',
    title: 'Facebook & Instagram Management',
    features: [
      'Scheduled posting at optimal times',
      'Hashtag research & strategy',
      'Profile & bio optimization',
      'Cross-posting between Facebook & Instagram',
    ],
  },
  {
    id: 'linkedin-management',
    badge: 'Monthly Retainer',
    title: 'LinkedIn Company Page Management',
    features: [
      'LinkedIn content calendar & scheduled posting',
      'Company page optimization',
      'B2B focused copywriting',
      'Employee advocacy content support',
    ],
  },
  {
    id: 'youtube-management',
    badge: 'Add-on / Monthly',
    title: 'YouTube Channel Management',
    features: [
      'Video upload scheduling & optimization',
      'Thumbnail design & A/B testing',
      'SEO-optimized titles & descriptions',
      'Community tab post management',
    ],
  },
  {
    id: 'gbp-management',
    badge: 'Monthly Retainer',
    title: 'Google Business Profile Management',
    features: [
      'Regular GBP post updates',
      'Review monitoring & response management',
      'Business info & photo updates',
      'Local SEO optimization for map visibility',
    ],
  },
  {
    id: 'ai-community',
    badge: 'Monthly Retainer',
    title: 'AI-Powered Community Management',
    features: [
      'AI-powered comment moderation & auto-replies',
      'Inbox / DM management support',
      'Spam & negative comment filtering',
      'Escalation of important customer queries to your team',
    ],
  },
];

/* ==========================================================================
   3. FIRST 30 DAYS TIMELINE DATA
   ========================================================================== */
export const timelineMilestonesData: TimelineMilestone[] = [
  {
    dayRange: 'Day 1 - 3',
    title: 'Onboarding & Discovery',
    iconKey: 'FaFlagCheckered',
    bullets: [
      'Kickoff call to understand your brand, goals & audience',
      'Access setup for all social accounts & Google Business Profile',
      'Competitor & industry research',
    ],
    align: 'left',
  },
  {
    dayRange: 'Day 4 - 7',
    title: 'Strategy & Content Calendar',
    iconKey: 'FaCalendarDays',
    bullets: [
      'Content pillars & monthly themes finalized',
      'First month\'s content calendar drafted',
      'Calendar shared with you for approval & feedback',
    ],
    align: 'right',
  },
  {
    dayRange: 'Day 8 - 15',
    title: 'Design & Production',
    iconKey: 'FaPenRuler',
    bullets: [
      'Branded templates & visual identity setup',
      'First batch of posts, reels & graphics created',
      'Revisions based on your feedback (48hr turnaround)',
    ],
    align: 'left',
  },
  {
    dayRange: 'Day 16 - 25',
    title: 'Go Live & Engage',
    iconKey: 'FaRocket',
    bullets: [
      'Scheduled posting begins across all platforms',
      'AI-powered comment & inbox management activated',
      'Daily monitoring of performance & engagement',
    ],
    align: 'right',
  },
  {
    dayRange: 'Day 26 - 30',
    title: 'Review & Report',
    iconKey: 'FaChartLine',
    bullets: [
      'First monthly performance report delivered',
      'Results reviewed together on a call',
      'Next month\'s strategy adjusted based on data',
    ],
    align: 'left',
  },
];

/* ==========================================================================
   4. SAMPLE MONTHLY REPORT PLATFORM BARS
   ========================================================================== */
export const reportPlatformBars = [
  {
    platform: 'Facebook',
    width: '80%',
    color: '#1877f2',
  },
  {
    platform: 'Instagram',
    width: '95%',
    color: '#dc2743',
  },
  {
    platform: 'LinkedIn',
    width: '55%',
    color: '#0a66c2',
  },
  {
    platform: 'YouTube',
    width: '60%',
    color: '#ff0000',
  },
  {
    platform: 'GBP',
    width: '70%',
    color: '#34a853',
  },
];

/* ==========================================================================
   5. STRATEGY TABS DATA (exact demo copy and punctuation)
   ========================================================================== */
export const strategyTabsData: StrategyTab[] = [
  {
    id: 0,
    title: 'Content Strategy',
    iconKey: 'FaPenNib',
    paragraphs: [
      'Every social media presence starts with a plan, not random posting. We research your industry, audience, and competitors to build content pillars — the core themes your brand will consistently talk about, whether that\'s product highlights, educational tips, behind-the-scenes, or customer stories.',
      'Every month, we plan a full content calendar in advance, written in both Bangla and English depending on your audience, mapped to specific goals — awareness, engagement, or lead generation.',
      'We continuously track which themes and formats perform best for your specific audience and refine the mix based on real engagement data, not guesswork.',
    ],
  },
  {
    id: 1,
    title: 'Platform-Specific Approach',
    iconKey: 'FaLayerGroup',
    paragraphs: [
      'Posting the same content everywhere is one of the biggest mistakes brands make. Facebook rewards shares and comments, Instagram is visual and Reels-driven, LinkedIn favors professional insights and long-form posts, YouTube depends on watch time and thumbnails, and Google Business Profile is about local discovery and trust.',
      'We adapt format, tone, and posting frequency for each platform individually — resizing creatives, adjusting captions, and choosing the right content type — so every platform performs at its best instead of getting generic, repurposed content.',
    ],
  },
  {
    id: 2,
    title: 'Visual Design & Branding',
    iconKey: 'FaPalette',
    paragraphs: [
      'Consistency in visual identity builds recognition. We design every post — static images, carousels, and stories — using a cohesive template system aligned with your brand colors, fonts, and tone of voice.',
      'Whether it\'s a festival greeting, product highlight, or customer testimonial, each design is built to be instantly recognizable as your brand while still feeling fresh and on-trend for the platform it\'s posted on.',
    ],
  },
  {
    id: 3,
    title: 'Video, Reels & Thumbnails',
    iconKey: 'FaClapperboard',
    paragraphs: [
      'Short-form video consistently drives the highest engagement across every platform. We edit Reels and Shorts using trending audio, on-screen text, and pacing designed to hold attention in the first three seconds.',
      'For YouTube specifically, we design custom thumbnails and test variations, since thumbnail design has a direct impact on click-through rate — often more than the video content itself.',
    ],
  },
  {
    id: 4,
    title: 'AI Community Management',
    iconKey: 'FaRobot',
    paragraphs: [
      'Fast response time builds trust and keeps the algorithm favoring your content. We use AI-powered tools to monitor comments and messages in real time, automatically responding to common questions and filtering spam or negative comments.',
      'Important or sales-related queries are automatically flagged and escalated to your team, so no genuine customer is left waiting while routine questions are handled instantly.',
    ],
  },
  {
    id: 5,
    title: 'Google Business Profile & Local SEO',
    iconKey: 'FaGoogle',
    paragraphs: [
      'For local businesses, Google Business Profile is often the first thing a potential customer sees before your website or social pages. We keep your profile active with regular posts, updated photos, and accurate business information.',
      'We also monitor and respond to customer reviews professionally, which directly impacts your local search ranking and builds trust with new customers discovering you through Google Maps and Search.',
    ],
  },
  {
    id: 6,
    title: 'Reporting & Analytics',
    iconKey: 'FaChartPie',
    paragraphs: [
      'You shouldn\'t have to guess whether your social presence is growing. Every month, we deliver a clear report covering follower growth, reach, engagement rate, and top-performing content — broken down by platform, in plain language.',
      'Beyond the numbers, we include our analysis of what worked, what didn\'t, and our recommended content strategy for the following month — so reporting becomes a roadmap for continuous growth, not just a formality.',
    ],
  },
];

/* ==========================================================================
   6. WHY WORK WITH US DATA
   ========================================================================== */
export const whyChooseUsData: WhyChooseCard[] = [
  {
    iconKey: 'FaLanguage',
    title: 'Bangla + English Content',
    description: 'We create content in both languages to maximize local engagement and reach.',
  },
  {
    iconKey: 'FaLayerGroup',
    title: 'Multi-Platform Expertise',
    description: 'One team managing Facebook, Instagram, LinkedIn, YouTube & Google Business Profile.',
  },
  {
    iconKey: 'FaRobot',
    title: 'AI-Powered Efficiency',
    description: 'Faster comment & inbox responses using AI, without losing the human touch.',
  },
  {
    iconKey: 'FaDatabase',
    title: 'Data-Driven Content',
    description: 'Every content decision is backed by performance data, not guesswork.',
  },
  {
    iconKey: 'FaUserTie',
    title: 'Dedicated Manager',
    description: 'Every client gets a dedicated account manager for ongoing support.',
  },
  {
    iconKey: 'FaBolt',
    title: 'Fast Turnaround',
    description: 'Content and design revisions delivered within 48 hours, guaranteed.',
  },
];

/* ==========================================================================
   7. 5 COMMON MISTAKES DATA
   ========================================================================== */
export const commonMistakesData: CommonMistake[] = [
  {
    number: 1,
    title: 'Posting Inconsistently',
    description:
      'Posting three times one week and disappearing the next confuses the algorithm and your audience. We follow a fixed monthly calendar so your presence stays consistent, month after month.',
  },
  {
    number: 2,
    title: 'Same Content Across Every Platform',
    description:
      'What works on Facebook rarely performs the same way on LinkedIn or YouTube. We adapt format and tone per platform instead of copy-pasting the same post everywhere.',
  },
  {
    number: 3,
    title: 'Ignoring Comments & Messages',
    description:
      'Slow or missing responses drive potential customers away. Our AI-powered community management ensures comments and messages are handled quickly, every day.',
  },
  {
    number: 4,
    title: 'No Content Strategy — Just Random Posts',
    description:
      'Posting without a plan leads to inconsistent branding and messaging. We build content pillars and a monthly calendar so every post serves a clear purpose.',
  },
  {
    number: 5,
    title: 'Never Reviewing Performance Data',
    description:
      'Without monthly reporting, you can\'t know what\'s actually working. Our retainer clients get a detailed monthly report with clear next-month recommendations.',
  },
];

/* ==========================================================================
   8. PRICING PACKAGES DATA
   ========================================================================== */
export const pricingPackagesData: PricingPackage[] = [
  {
    id: 'starter',
    badge: 'Best for New Businesses',
    name: 'Starter',
    platforms: [
      { key: 'fb', iconKey: 'FaFacebookF', className: 'piFb' },
      { key: 'ig', iconKey: 'FaInstagram', className: 'piIg' },
    ],
    note: 'Facebook + Instagram management for businesses just getting started',
    features: [
      '8-10 posts/month (static + carousel)',
      '2 Reels/Shorts per month',
      'Basic comment moderation',
      'Monthly performance report',
    ],
    ctaText: 'Get Custom Quote',
    ctaHref: '/contact',
  },
  {
    id: 'growth',
    badge: 'Most Popular',
    isPopular: true,
    name: 'Growth',
    platforms: [
      { key: 'fb', iconKey: 'FaFacebookF', className: 'piFb' },
      { key: 'ig', iconKey: 'FaInstagram', className: 'piIg' },
      { key: 'yt', iconKey: 'FaYoutube', className: 'piYt' },
    ],
    note: 'For growing brands ready to expand reach with video content',
    features: [
      'Everything in Starter',
      '+ YouTube channel management (uploads + thumbnails)',
      '15-20 posts/month + Reels/Shorts',
      'AI-powered comment & inbox management',
      'Monthly analytics report across all platforms',
    ],
    ctaText: 'Get Custom Quote',
    ctaHref: '/contact',
  },
  {
    id: 'pro',
    badge: 'Best for Multi-Platform Brands',
    name: 'Pro',
    platforms: [
      { key: 'fb', iconKey: 'FaFacebookF', className: 'piFb' },
      { key: 'ig', iconKey: 'FaInstagram', className: 'piIg' },
      { key: 'yt', iconKey: 'FaYoutube', className: 'piYt' },
      { key: 'li', iconKey: 'FaLinkedinIn', className: 'piLi' },
      { key: 'gbp', iconKey: 'FaGoogle', className: 'piGbp' },
    ],
    note: 'Full-scale management across all major platforms',
    features: [
      'Everything in Growth',
      '+ LinkedIn + Google Business Profile management',
      '25+ posts/month across all platforms',
      'Video editing & thumbnail design included',
      'Dedicated account manager & priority support',
    ],
    ctaText: 'Get Custom Quote',
    ctaHref: '/contact',
  },
];

/* ==========================================================================
   9. INDUSTRIES DATA
   ========================================================================== */
export const industriesData: IndustryCard[] = [
  {
    iconKey: 'FaUtensils',
    title: 'Restaurant & Food',
    description:
      'Consistent food photography, Reels, and Google Business Profile updates help restaurants stay visible and top-of-mind for daily customers.',
  },
  {
    iconKey: 'FaCartShopping',
    title: 'E-commerce',
    description:
      'Regular product content across Facebook and Instagram, paired with review management on Google, builds trust and drives repeat purchases.',
  },
  {
    iconKey: 'FaShirt',
    title: 'Fashion & Beauty',
    description:
      'Visual-first content, Reels, and carousel posts help fashion brands build a loyal, engaged following across Instagram and Facebook.',
  },
  {
    iconKey: 'FaHouse',
    title: 'Real Estate',
    description:
      'Property showcase content across Facebook, YouTube, and Google Business Profile helps real estate businesses build long-term visibility.',
  },
  {
    iconKey: 'FaBriefcase',
    title: 'B2B & Professional Services',
    description:
      'LinkedIn-focused content strategy and thought-leadership posts help B2B brands build authority and generate quality connections.',
  },
  {
    iconKey: 'FaDumbbell',
    title: 'Gym & Fitness',
    description:
      'Community-building content and consistent posting keep your gym top-of-mind when people are ready to start their fitness journey.',
  },
];

/* ==========================================================================
   10. FAQ DATA
   ========================================================================== */
export const faqsData: FAQItem[] = [
  {
    id: 'faq-platforms',
    question: 'Which social media platforms do you manage?',
    answerText:
      'We manage Facebook, Instagram, LinkedIn, YouTube, and Google Business Profile as standard. Your package is built around the platforms your customers actually use — we never force a five-platform plan on a business that only needs two. Platform mix is decided from how your buyers search and spend time, not from a generic checklist. Typical pairings we see in Bangladesh and the Gulf: Starter — Facebook + Instagram for local retail, food, and fashion brands; Growth — add YouTube for Shorts, class recaps, and product demos; Pro — add LinkedIn + Google Business Profile for B2B, logistics, and local services. During Days 1–3 of onboarding we audit your existing pages, competitors, and audience. By Day 7 the recommended platform mix is locked into your first monthly content calendar, so you know exactly where we will publish before any design work starts.',
    blocks: [
      {
        type: 'paragraph',
        text: 'We manage Facebook, Instagram, LinkedIn, YouTube, and Google Business Profile as standard. Your package is built around the platforms your customers actually use — we never force a five-platform plan on a business that only needs two.',
      },
      {
        type: 'paragraph',
        text: 'Platform mix is decided from how your buyers search and spend time, not from a generic checklist. Typical pairings we see in Bangladesh and the Gulf:',
      },
      {
        type: 'list',
        items: [
          'Starter — Facebook + Instagram for local retail, food, and fashion brands',
          'Growth — add YouTube for Shorts, class recaps, and product demos',
          'Pro — add LinkedIn + Google Business Profile for B2B, logistics, and local services',
        ],
      },
      {
        type: 'paragraph',
        text: 'During Days 1–3 of onboarding we audit your existing pages, competitors, and audience. By Day 7 the recommended platform mix is locked into your first monthly content calendar, so you know exactly where we will publish before any design work starts.',
      },
    ],
  },
  {
    id: 'faq-post-count',
    question: 'How many posts will I get each month?',
    answerText:
      'Post volume is tied to the package, not a vague “as needed” promise. Starter includes 8–10 posts per month plus 2 Reels or Shorts. Growth includes 15–20 posts plus Reels and Shorts across Facebook, Instagram, and YouTube. Pro delivers 25+ posts across all five platforms, including video editing and thumbnail design. A typical Growth month is planned as a mix, not 20 copies of the same static graphic: 8 static or carousel posts with Bangla + English captions; 4 Reels and 2 YouTube Shorts or uploads with custom thumbnails; 3 Stories, plus festival creatives (Eid, Pohela Boishakh, admission season) inside the same quota. The first calendar is drafted on Days 4–7 and sent for your approval. The first design batch is produced on Days 8–15 with a 48-hour revision turnaround. Publishing starts on Day 16. From month two onward you receive the next calendar in the last week of the current month, after the performance report.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Post volume is tied to the package, not a vague “as needed” promise. Starter includes 8–10 posts per month plus 2 Reels or Shorts. Growth includes 15–20 posts plus Reels and Shorts across Facebook, Instagram, and YouTube. Pro delivers 25+ posts across all five platforms, including video editing and thumbnail design.',
      },
      {
        type: 'paragraph',
        text: 'A typical Growth month is planned as a mix, not 20 copies of the same static graphic. You can expect a structure close to this, then we tune it after the first report:',
      },
      {
        type: 'list',
        items: [
          '8 static or carousel posts with Bangla + English captions',
          '4 Reels and 2 YouTube Shorts or uploads with custom thumbnails',
          '3 Stories, plus festival creatives (Eid, Pohela Boishakh, admission season) inside the same quota',
        ],
      },
      {
        type: 'paragraph',
        text: 'The first calendar is drafted on Days 4–7 and sent for your approval. The first design batch is produced on Days 8–15 with a 48-hour revision turnaround. Publishing starts on Day 16. From month two onward you receive the next calendar in the last week of the current month, after the performance report.',
      },
    ],
  },
  {
    id: 'faq-replies',
    question: 'Do you reply to comments and messages on my pages?',
    answerText:
      'Yes. Community management is part of the retainer. Starter includes basic comment moderation. Growth and Pro include AI-powered comment and inbox management: first replies, spam filtering, and escalation of sales or sensitive queries to your team. In practice that means a customer is not left waiting overnight. We write reply templates with you during onboarding so the tone matches the business — formal for cargo and B2B, warmer for education and interiors. Common examples we already handle: Service questions such as LCL/FCL rates or door-to-door coverage; Course questions such as SSC/HSC batch fees and class timings; Appointment questions such as curtain measurement or Dubai installation areas. The system goes live with posting on Days 16–25. Routine comments are handled throughout the day; important leads are flagged to your dedicated manager. You review the first month’s inbox quality on the Day 26–30 report call and we tighten scripts from there.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Yes. Community management is part of the retainer. Starter includes basic comment moderation. Growth and Pro include AI-powered comment and inbox management: first replies, spam filtering, and escalation of sales or sensitive queries to your team.',
      },
      {
        type: 'paragraph',
        text: 'In practice that means a customer is not left waiting overnight. We write reply templates with you during onboarding so the tone matches the business — formal for cargo and B2B, warmer for education and interiors. Common examples we already handle:',
      },
      {
        type: 'list',
        items: [
          'Service questions such as LCL/FCL rates or door-to-door coverage',
          'Course questions such as SSC/HSC batch fees and class timings',
          'Appointment questions such as curtain measurement or Dubai installation areas',
        ],
      },
      {
        type: 'paragraph',
        text: 'The system goes live with posting on Days 16–25. Routine comments are handled throughout the day; important leads are flagged to your dedicated manager. You review the first month’s inbox quality on the Day 26–30 report call and we tighten scripts from there.',
      },
    ],
  },
  {
    id: 'faq-gbp',
    question: 'Can you manage my Google Business Profile as well?',
    answerText:
      'Yes. Google Business Profile management is included in the Pro package and can be added to Starter or Growth. We treat GBP as a local sales channel, not a leftover social tab — it is often the first result a customer sees on Maps before they ever open Facebook. Once we have access, the monthly work is specific and repeatable: Weekly GBP posts (offer, photo, or service highlight); Review monitoring with professional replies within 24–48 business hours; Name, address, phone, category, hour, and photo updates for local SEO. Access is requested on Days 1–3. We clean the profile in week one, then keep the weekly cadence. This is especially useful for a cargo office in Dhaka, a coaching centre, or a curtain showroom — businesses people search with “near me” intent.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Yes. Google Business Profile management is included in the Pro package and can be added to Starter or Growth. We treat GBP as a local sales channel, not a leftover social tab — it is often the first result a customer sees on Maps before they ever open Facebook.',
      },
      {
        type: 'paragraph',
        text: 'Once we have access, the monthly work is specific and repeatable:',
      },
      {
        type: 'list',
        items: [
          'Weekly GBP posts (offer, photo, or service highlight)',
          'Review monitoring with professional replies within 24–48 business hours',
          'Name, address, phone, category, hour, and photo updates for local SEO',
        ],
      },
      {
        type: 'paragraph',
        text: 'Access is requested on Days 1–3. We clean the profile in week one, then keep the weekly cadence. This is especially useful for a cargo office in Dhaka, a coaching centre, or a curtain showroom — businesses people search with “near me” intent.',
      },
    ],
  },
  {
    id: 'faq-paid-ads',
    question: 'Is running paid ads included in this package?',
    answerText:
      'No. This package is organic social media management: planning, design, publishing, community, and reporting. Paid campaigns on Facebook, Instagram, or LinkedIn are a separate add-on, or you can book our dedicated Facebook & Meta Marketing service. Keeping ads separate is intentional. Organic work builds the page, the content library, and social proof. Ads then amplify the posts that already perform, instead of spending budget on untested creatives. Typical add-ons clients attach later: Boost a Reel that already crossed ~6% engagement; Lead-form ads for admission or quote requests; Retargeting people who watched a video or visited the website. If you want both, we scope ads in the same free consultation. Organic setup still follows the 30-day onboarding. Ad campaigns typically launch after the first content batch is live — around Day 16+ — so creatives and the page are ready.',
    blocks: [
      {
        type: 'paragraph',
        text: 'No. This package is organic social media management: planning, design, publishing, community, and reporting. Paid campaigns on Facebook, Instagram, or LinkedIn are a separate add-on, or you can book our dedicated Facebook & Meta Marketing service.',
      },
      {
        type: 'paragraph',
        text: 'Keeping ads separate is intentional. Organic work builds the page, the content library, and social proof. Ads then amplify the posts that already perform, instead of spending budget on untested creatives. Typical add-ons clients attach later:',
      },
      {
        type: 'list',
        items: [
          'Boost a Reel that already crossed ~6% engagement',
          'Lead-form ads for admission or quote requests',
          'Retargeting people who watched a video or visited the website',
        ],
      },
      {
        type: 'paragraph',
        text: 'If you want both, we scope ads in the same free consultation. Organic setup still follows the 30-day onboarding. Ad campaigns typically launch after the first content batch is live — around Day 16+ — so creatives and the page are ready.',
      },
    ],
  },
  {
    id: 'faq-contract',
    question: 'Is the contract monthly or long-term?',
    answerText:
      'All retainers are month-to-month. There is no 6- or 12-month lock-in. You can pause or cancel at the end of any billing cycle — we do not hold pages or approved files hostage. That said, social results are cumulative. We are transparent about the first quarter so you can plan, not guess: Month 1 — onboarding, calendar, templates, and first live posts (Days 1–30); Month 2 — first data-backed calendar and mix changes after the Day 26–30 report; Month 3 — compounding reach; most clients judge the retainer here. To pause or cancel, notify your account manager before the next cycle starts. Unused approved creatives stay yours. If you pause and return later, we resume from the last content pillars instead of starting from zero.',
    blocks: [
      {
        type: 'paragraph',
        text: 'All retainers are month-to-month. There is no 6- or 12-month lock-in. You can pause or cancel at the end of any billing cycle — we do not hold pages or approved files hostage.',
      },
      {
        type: 'paragraph',
        text: 'That said, social results are cumulative. We are transparent about the first quarter so you can plan, not guess:',
      },
      {
        type: 'list',
        items: [
          'Month 1 — onboarding, calendar, templates, and first live posts (Days 1–30)',
          'Month 2 — first data-backed calendar and mix changes after the Day 26–30 report',
          'Month 3 — compounding reach; most clients judge the retainer here',
        ],
      },
      {
        type: 'paragraph',
        text: 'To pause or cancel, notify your account manager before the next cycle starts. Unused approved creatives stay yours. If you pause and return later, we resume from the last content pillars instead of starting from zero.',
      },
    ],
  },
  {
    id: 'faq-custom-mix',
    question: 'Can I request specific content types, like more Reels?',
    answerText:
      'Yes. The monthly mix is customizable. If Reels, Shorts, carousels, or LinkedIn articles perform better for your audience, we shift the calendar toward that format — you are not locked into a fixed template for 12 months. We start from industry benchmarks, then replace them with your own numbers after the first live month: Static image posts — about 1.5% average engagement; Carousel / multi-image — about 3.2% average engagement; Reels / short-form video — about 6.5% average engagement. That is why an education page often moves toward exam-tip Reels, an interiors brand toward install and fabric videos, and a cargo company toward process explainers. Request a mix change anytime; we apply it on the next calendar — usually within 7 days if you ask mid-month, or on the Day 26–30 review for a full month-two rebuild. Individual creative revisions stay at 48 hours.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Yes. The monthly mix is customizable. If Reels, Shorts, carousels, or LinkedIn articles perform better for your audience, we shift the calendar toward that format — you are not locked into a fixed template for 12 months.',
      },
      {
        type: 'paragraph',
        text: 'We start from industry benchmarks, then replace them with your own numbers after the first live month:',
      },
      {
        type: 'list',
        items: [
          'Static image posts — about 1.5% average engagement',
          'Carousel / multi-image — about 3.2% average engagement',
          'Reels / short-form video — about 6.5% average engagement',
        ],
      },
      {
        type: 'paragraph',
        text: 'That is why an education page often moves toward exam-tip Reels, an interiors brand toward install and fabric videos, and a cargo company toward process explainers. Request a mix change anytime; we apply it on the next calendar — usually within 7 days if you ask mid-month, or on the Day 26–30 review for a full month-two rebuild. Individual creative revisions stay at 48 hours.',
      },
    ],
  },
];

/* ==========================================================================
   11. TESTIMONIALS DATA
   ========================================================================== */
export const testimonialsData: TestimonialItem[] = [
  {
    id: 'testi-1',
    rating: 4,
    tag: 'Logistics SMM',
    quote:
      '“We move cargo India to Bangladesh — Kolkata to Dhaka door-to-door, LC, LCL and FCL, plus customs on both sides. That is hard to explain in a Facebook post. 10 Cent Agency built a monthly calendar and started publishing clear service explainers in Bangla and English. Inbox inquiries are more regular now. I would still like more cargo-specific video, but the page finally looks like a real logistics company.”',
    author: 'Abu Manjar',
    role: 'Proprietor',
    company: 'KD Cargo Service',
    initials: 'AM',
    avatarClass: 'avNavy',
  },
  {
    id: 'testi-2',
    rating: 5,
    tag: 'Education Content',
    quote:
      '“Ishan’s English Care is offline and online for SSC, HSC and admission students, so we needed a page that feels like a classroom, not random greetings. They planned exam-season posts, Reels and bilingual captions that students actually share, and comments no longer sit unanswered. The first calendar was approved in week one and publishing has stayed on time every week since.”',
    author: 'Tawhidul Islam',
    role: 'Founder',
    company: 'Ishan\'s English Care',
    initials: 'TI',
    avatarClass: 'avBlue',
  },
  {
    id: 'testi-3',
    rating: 5,
    tag: 'Interior Brand Content',
    quote:
      '“Fabrinest is a Dubai interiors brand — curtains, blinds, sofa upholstery and custom furniture — with 16 years behind it. Our work is visual, and 10 Cent Agency matched that: a consistent feed, install and fabric Reels, and a tone that fits a premium showroom. Instagram and Google now look like the same company. Revisions come within two days and I do not chase posts anymore.”',
    author: 'Kawser Rahman',
    role: 'Founder',
    company: 'Fabrinest Curtains',
    initials: 'KR',
    avatarClass: 'avDeep',
  },
];

// Connected Schema.org @graph generator
export function getSocialMediaSchemaGraph() {
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
        '@id': 'https://www.10centagency.com/services/social-media-management#webpage',
        url: 'https://www.10centagency.com/services/social-media-management',
        name: 'Social Media Management Services in Bangladesh | 10 Cent Agency',
        description:
          'Complete multi-platform social media management — Facebook, Instagram, LinkedIn, YouTube & Google Business Profile. Content calendar, design, AI-powered community management, and monthly reporting.',
        inLanguage: 'en-BD',
        isPartOf: {
          '@id': 'https://www.10centagency.com/#website',
        },
        breadcrumb: {
          '@id': 'https://www.10centagency.com/services/social-media-management#breadcrumb',
        },
        about: {
          '@id': 'https://www.10centagency.com/services/social-media-management#service',
        },
        mainEntity: {
          '@id': 'https://www.10centagency.com/services/social-media-management#service',
        },
      },
      {
        '@type': 'Service',
        '@id': 'https://www.10centagency.com/services/social-media-management#service',
        name: 'Social Media Management Services',
        serviceType: 'Social Media Management',
        url: 'https://www.10centagency.com/services/social-media-management',
        description:
          '10 Cent Agency provides complete social media management services across Facebook, Instagram, LinkedIn, YouTube, and Google Business Profile — including content planning, design, AI-powered community management, and monthly reporting for small and medium businesses in Bangladesh.',
        provider: {
          '@id': 'https://www.10centagency.com/#organization',
        },
        mainEntityOfPage: {
          '@id': 'https://www.10centagency.com/services/social-media-management#webpage',
        },
        areaServed: {
          '@type': 'Country',
          name: 'Bangladesh',
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://www.10centagency.com/services/social-media-management#breadcrumb',
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
            name: 'Social Media Management',
            item: 'https://www.10centagency.com/services/social-media-management',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://www.10centagency.com/services/social-media-management#faq',
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
