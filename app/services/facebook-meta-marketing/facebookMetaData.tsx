import React from 'react';
import Link from 'next/link';
import {
  FaUsers,
  FaPenNib,
  FaPhotoFilm,
  FaSatelliteDish,
  FaInstagram,
  FaWhatsapp,
  FaChartPie,
  FaEye,
  FaLayerGroup,
  FaRepeat,
  FaArrowPointer,
  FaCoins,
  FaChartColumn,
  FaBullseye,
  FaSackDollar,
  FaMeta,
  FaGoogle,
  FaShieldHalved,
  FaClockRotateLeft,
  FaFileInvoiceDollar,
  FaArrowsRotate,
  FaCalendarCheck,
  FaRotateLeft,
} from 'react-icons/fa6';

export interface FAQItem {
  id: number;
  question: string;
  paragraphs: string[];
  bullets?: string[];
  footParagraph?: string;
  schemaText: string;
}

export interface StrategyTab {
  id: number;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
}

export interface MetricCardItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  shortDesc: string;
  backTitle: string;
  explanation: string;
  tag: string;
}

export interface TrustSealItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  ribbon: string;
  description: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  tag: string;
  rating: number;
  quote: string;
  initials: string;
  avatarClass: 'avNavy' | 'avDeep';
}

export interface EstimatorIndustry {
  key: string;
  label: string;
  cpm: number;
  ctr: number;
  cpl: number;
}

export interface PromiseItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

// 1. FAQS DATA (6 questions, detailed multi-paragraph + bullet format + clean schemaText)
export const faqsData: FAQItem[] = [
  {
    id: 1,
    question: 'What is the minimum budget needed to start Facebook Marketing?',
    paragraphs: [
      'There are two costs, and they are billed separately. Our one-time page setup and the monthly management retainer are quoted after a short audit — they are not a percentage of what you spend on ads. Ad spend itself is paid by you, directly to Meta, from your own Business Manager. We never add a markup on media.',
      'For most Bangladeshi SMEs we recommend enough ad spend that Meta’s algorithm can actually learn — typically BDT 15,000–30,000 per month to start, on top of the management fee. A fashion or electronics catalog that needs Advantage+ shopping tests may need the higher end; a local clinic generating WhatsApp leads can often start closer to BDT 15,000–20,000 if the pixel and form are tracking.',
    ],
    bullets: [
      'One-time setup — page, pixel, catalog (if needed), and Business Manager access, quoted on the audit call',
      'Monthly retainer — content + ads management, fixed fee, not tied to how much you spend',
      'Ad budget — you pay Meta; BDT 15,000–30,000 is a realistic testing floor for most SMEs',
      'If your budget is tight we do not split it across five campaigns — we launch one offer and one audience first',
    ],
    footParagraph:
      'The free consultation is usually 20–30 minutes. If you go ahead, Days 1–5 are pixel, page, and creative setup; we do not push serious spend until the pixel fires a test event, typically within that first week.',
    schemaText:
      'There are two costs, and they are billed separately. Our one-time page setup and the monthly management retainer are quoted after a short audit — they are not a percentage of what you spend on ads. Ad spend itself is paid by you, directly to Meta, from your own Business Manager. We never add a markup on media. For most Bangladeshi SMEs we recommend enough ad spend that Meta’s algorithm can actually learn — typically BDT 15,000–30,000 per month to start, on top of the management fee. A fashion or electronics catalog that needs Advantage+ shopping tests may need the higher end; a local clinic generating WhatsApp leads can often start closer to BDT 15,000–20,000 if the pixel and form are tracking. One-time setup — page, pixel, catalog (if needed), and Business Manager access, quoted on the audit call Monthly retainer — content + ads management, fixed fee, not tied to how much you spend Ad budget — you pay Meta; BDT 15,000–30,000 is a realistic testing floor for most SMEs If your budget is tight we do not split it across five campaigns — we launch one offer and one audience first The free consultation is usually 20–30 minutes. If you go ahead, Days 1–5 are pixel, page, and creative setup; we do not push serious spend until the pixel fires a test event, typically within that first week.',
  },
  {
    id: 2,
    question: 'How long does it take to see results from Facebook Ads?',
    paragraphs: [
      'You can usually see the first signals — reach, profile visits, and a handful of messages or form fills — within 15 to 30 days of a properly tracked launch. That window is the learning phase, not the finished result. Meta needs enough conversions before it stops guessing who to show the ad to.',
      'Stable cost-per-lead or ROAS is a 2–3 month job if tracking, creative, and landing experience are in place. Killing a campaign after five days because “it didn’t sell” is the most common way businesses waste the setup they just paid for.',
    ],
    bullets: [
      'Days 1–5 — pixel, catalog, and ad account connected; test purchase or lead event confirmed',
      'Days 7–14 — first ads in learning; we watch frequency, CTR, and whether the form/WhatsApp actually fires',
      'Days 15–30 — early leads or add-to-carts if the offer is clear; we kill obvious losers, not the whole account',
      'Months 2–3 — remarketing stacked on, creative refreshed, cost-per-result usually more predictable',
    ],
    footParagraph:
      'On the monthly call (first week of the new month) we show you that timeline against your actual numbers — not a screenshot of Ads Manager with no context. If something is broken (pixel missing, page rejected, form 404) we flag it within 24 hours, not at the end of the month.',
    schemaText:
      'You can usually see the first signals — reach, profile visits, and a handful of messages or form fills — within 15 to 30 days of a properly tracked launch. That window is the learning phase, not the finished result. Meta needs enough conversions before it stops guessing who to show the ad to. Stable cost-per-lead or ROAS is a 2–3 month job if tracking, creative, and landing experience are in place. Killing a campaign after five days because “it didn’t sell” is the most common way businesses waste the setup they just paid for. Days 1–5 — pixel, catalog, and ad account connected; test purchase or lead event confirmed Days 7–14 — first ads in learning; we watch frequency, CTR, and whether the form/WhatsApp actually fires Days 15–30 — early leads or add-to-carts if the offer is clear; we kill obvious losers, not the whole account Months 2–3 — remarketing stacked on, creative refreshed, cost-per-result usually more predictable On the monthly call (first week of the new month) we show you that timeline against your actual numbers — not a screenshot of Ads Manager with no context. If something is broken (pixel missing, page rejected, form 404) we flag it within 24 hours, not at the end of the month.',
  },
  {
    id: 3,
    question: 'Will the cost be lower if I already have my own content or graphics?',
    paragraphs: [
      'Yes. If you already have usable photos, Reels, or a designer, we do not charge you for a full content production package. The retainer then covers strategy, targeting, copy, Ads Manager, and reporting — and we quote that slimmer scope before you sign.',
      '“Usable” means the files are sized for Feed, Story, and Reels, and they match the offer we will advertise. A product shoot from last year that does not show price, delivery, or the current SKU still needs new creative. We tell you which assets we can run as-is in the first content audit, usually within 3–5 days of onboarding.',
    ],
    bullets: [
      'You supply 8–12 ready creatives per month — we skip design hours and reduce the retainer',
      'You supply raw photos — we still crop, caption, and cut Reels; design time is lower, not zero',
      'You have no assets — Starter/Growth includes a monthly content calendar and original creatives',
      'Catalog ads for e-commerce still need a clean product feed even if you have pretty brand photos',
    ],
    footParagraph:
      'Bring whatever you have to the audit call. We mark each file keep / recrop / replace so the quote you get that week matches the work we will actually do, not a generic package.',
    schemaText:
      'Yes. If you already have usable photos, Reels, or a designer, we do not charge you for a full content production package. The retainer then covers strategy, targeting, copy, Ads Manager, and reporting — and we quote that slimmer scope before you sign. “Usable” means the files are sized for Feed, Story, and Reels, and they match the offer we will advertise. A product shoot from last year that does not show price, delivery, or the current SKU still needs new creative. We tell you which assets we can run as-is in the first content audit, usually within 3–5 days of onboarding. You supply 8–12 ready creatives per month — we skip design hours and reduce the retainer You supply raw photos — we still crop, caption, and cut Reels; design time is lower, not zero You have no assets — Starter/Growth includes a monthly content calendar and original creatives Catalog ads for e-commerce still need a clean product feed even if you have pretty brand photos Bring whatever you have to the audit call. We mark each file keep / recrop / replace so the quote you get that week matches the work we will actually do, not a generic package.',
  },
  {
    id: 4,
    question: 'Is the contract monthly or long-term?',
    paragraphs: [
      'Retainers are month-to-month. There is no 6- or 12-month lock-in. You can pause or cancel before the next billing date; we do not hold your Page, pixel, or ad account hostage.',
      'Facebook ads still need a learning window, so we recommend staying through at least 60–90 days before you judge the channel. Cancelling in week two because the first creative did not convert usually means you paid for setup and got no learning. That is your choice — we just say it clearly up front.',
    ],
    bullets: [
      'Month-to-month invoice, typically issued in the first week of the period',
      'Cancel or pause with notice before the next cycle — no lock-in clause',
      'Page, Business Manager, pixel, and ad account stay in your name',
      'If you pause, we document audiences and winning ads so you can restart without starting from zero',
    ],
    footParagraph:
      'Onboarding access (Business Manager invite) goes out on Day 1. If you leave, we remove our partner access the same week you confirm — your data remains in your account.',
    schemaText:
      'Retainers are month-to-month. There is no 6- or 12-month lock-in. You can pause or cancel before the next billing date; we do not hold your Page, pixel, or ad account hostage. Facebook ads still need a learning window, so we recommend staying through at least 60–90 days before you judge the channel. Cancelling in week two because the first creative did not convert usually means you paid for setup and got no learning. That is your choice — we just say it clearly up front. Month-to-month invoice, typically issued in the first week of the period Cancel or pause with notice before the next cycle — no lock-in clause Page, Business Manager, pixel, and ad account stay in your name If you pause, we document audiences and winning ads so you can restart without starting from zero Onboarding access (Business Manager invite) goes out on Day 1. If you leave, we remove our partner access the same week you confirm — your data remains in your account.',
  },
  {
    id: 5,
    question: 'Who manages the ad budget — the client or the agency?',
    paragraphs: [
      'You do. Spend comes out of your own Meta payment method inside your Business Manager. We are added as a partner with ads permission so we can build campaigns, change targeting, and optimize — we cannot withdraw your money, and we do not invoice a “media” line with a hidden markup.',
      'Daily and monthly caps are agreed with you before launch. If we recommend raising budget (for example after a catalog ad hits a stable ROAS in week 3–4), we ask first. If a campaign is wasting spend, we cut it the same day and tell you in the weekly note.',
    ],
    bullets: [
      'Payment method and billing threshold — yours, inside Meta',
      'Campaign structure, audiences, and creative tests — 10 Cent Agency',
      'Budget changes above the agreed cap — only after you approve',
      'Monthly report shows spend vs results so you can see every taka that left the ad account',
    ],
    footParagraph:
      'We request partner access on Day 1 (a Meta email, usually accepted the same day). We never ask for your Facebook password on WhatsApp. If you want your in-house person as a second admin, we add them in that same Business Manager within one working day.',
    schemaText:
      'You do. Spend comes out of your own Meta payment method inside your Business Manager. We are added as a partner with ads permission so we can build campaigns, change targeting, and optimize — we cannot withdraw your money, and we do not invoice a “media” line with a hidden markup. Daily and monthly caps are agreed with you before launch. If we recommend raising budget (for example after a catalog ad hits a stable ROAS in week 3–4), we ask first. If a campaign is wasting spend, we cut it the same day and tell you in the weekly note. Payment method and billing threshold — yours, inside Meta Campaign structure, audiences, and creative tests — 10 Cent Agency Budget changes above the agreed cap — only after you approve Monthly report shows spend vs results so you can see every taka that left the ad account We request partner access on Day 1 (a Meta email, usually accepted the same day). We never ask for your Facebook password on WhatsApp. If you want your in-house person as a second admin, we add them in that same Business Manager within one working day.',
  },
  {
    id: 6,
    question: 'What types of businesses benefit most from Facebook Marketing?',
    paragraphs: [
      'Facebook and Instagram still have the largest daily audience in Bangladesh, so almost any business that can show a product, a place, or a clear offer can use the channel. The strongest fits are businesses where someone can decide from a photo or a short video: e-commerce, fashion, restaurants, real estate viewings, clinics, courses, and local services.',
      'What does not work well is a vague “brand awareness” campaign with no pixel, no offer, and no WhatsApp or form. We would rather run one conversion campaign to a real lead event than three pretty videos that nobody can inquire on. During the audit we say if Meta is the wrong first channel (for example, high-intent B2B keywords may belong on Google Search first).',
    ],
    bullets: [
      'E-commerce / electronics / fashion — catalog + Advantage+ shopping + remarketing',
      'Restaurants and local retail — reach + location + WhatsApp',
      'Real estate, healthcare, education — lead forms and message ads, 15–30 day learning',
      'Logistics and B2B services — works when the offer is specific (door-to-door, LC, a named lane), not “we do cargo”',
    ],
    footParagraph:
      'On the audit call we pick one primary objective (messages, leads, or purchases) and one audience to start. That mix is locked into the first 30-day plan before any design work begins, usually by Day 7 of onboarding.',
    schemaText:
      'Facebook and Instagram still have the largest daily audience in Bangladesh, so almost any business that can show a product, a place, or a clear offer can use the channel. The strongest fits are businesses where someone can decide from a photo or a short video: e-commerce, fashion, restaurants, real estate viewings, clinics, courses, and local services. What does not work well is a vague “brand awareness” campaign with no pixel, no offer, and no WhatsApp or form. We would rather run one conversion campaign to a real lead event than three pretty videos that nobody can inquire on. During the audit we say if Meta is the wrong first channel (for example, high-intent B2B keywords may belong on Google Search first). E-commerce / electronics / fashion — catalog + Advantage+ shopping + remarketing Restaurants and local retail — reach + location + WhatsApp Real estate, healthcare, education — lead forms and message ads, 15–30 day learning Logistics and B2B services — works when the offer is specific (door-to-door, LC, a named lane), not “we do cargo” On the audit call we pick one primary objective (messages, leads, or purchases) and one audience to start. That mix is locked into the first 30-day plan before any design work begins, usually by Day 7 of onboarding.',
  },
];

// 2. STRATEGY TABS DATA
export const strategyTabsData: StrategyTab[] = [
  {
    id: 0,
    title: 'Audience Research & Targeting',
    icon: FaUsers,
    content: (
      <>
        <h3>Audience Research &amp; Targeting</h3>
        <p>
          Every successful campaign starts with understanding exactly who your
          customer is. Before writing a single ad, we research your industry,
          your competitors, and your existing customer base to build detailed
          audience profiles based on demographics, interests, online behavior,
          and purchase intent.
        </p>
        <p>
          We use a combination of <strong>Custom Audiences</strong> (built from
          your website visitors, page followers, and customer list) and{' '}
          <strong>Lookalike Audiences</strong> (people who share characteristics
          with your best customers) to ensure your ads reach people who are
          actually likely to buy — not just anyone scrolling their feed.
        </p>
        <p>
          For local businesses in Bangladesh, we also layer in location-based
          targeting — down to specific areas of Dhaka, Chattogram, or wherever
          your customers are — so your budget isn&apos;t wasted showing ads to
          people outside your service area.
        </p>
      </>
    ),
  },
  {
    id: 1,
    title: 'Content Strategy',
    icon: FaPenNib,
    content: (
      <>
        <h3>Content Strategy</h3>
        <p>
          Facebook&apos;s algorithm rewards content that keeps people on the
          platform longer — comments, shares, and saves matter more than likes
          alone. That&apos;s why we don&apos;t just post product photos; we build a
          content mix that includes educational posts, behind-the-scenes content,
          customer testimonials, and festival/seasonal campaigns relevant to the
          Bangladeshi market.
        </p>
        <p>
          Every month, we plan a full content calendar in advance, written in
          both Bangla and English depending on your audience, with captions
          crafted to drive specific actions — comments, DMs, link clicks, or
          shares.
        </p>
        <p>
          We also track which content types perform best for your specific
          audience and continuously refine the mix based on real engagement
          data, not guesswork.
        </p>
      </>
    ),
  },
  {
    id: 2,
    title: 'Ad Creative Production',
    icon: FaPhotoFilm,
    content: (
      <>
        <h3>Ad Creative Production</h3>
        <p>
          Even the best targeting fails if the ad creative doesn&apos;t stop the
          scroll. Our{' '}
          <Link
            href="/services/graphic-design"
            className="text-brand-blue font-semibold hover:underline"
          >
            graphic design
          </Link>{' '}
          team produces multiple variations of every ad — different headlines,
          visuals, and calls-to-action — so we can test what resonates before
          scaling budget behind the winner.
        </p>
        <p>
          We design creatives specifically sized for each placement — Feed,
          Story, and Reels — because a creative that works in one format often
          underperforms in another. Each ad is built with a clear objective in
          mind: awareness, traffic, engagement, or direct conversion.
        </p>
        <p>
          For retargeting campaigns, we create separate creative sets designed to
          bring back visitors who showed interest but didn&apos;t convert —
          often with urgency-driven messaging or special offers.
        </p>
      </>
    ),
  },
  {
    id: 3,
    title: 'Pixel, CAPI & Tracking',
    icon: FaSatelliteDish,
    content: (
      <>
        <h3>Pixel, CAPI &amp; Tracking</h3>
        <p>
          Accurate tracking is the foundation of a profitable ad campaign. We
          install the Meta Pixel on your{' '}
          <Link
            href="/services/website-development"
            className="text-brand-blue font-semibold hover:underline"
          >
            website
          </Link>{' '}
          to track visitor behavior — page views, add-to-cart actions, and
          purchases — feeding this data back to Meta&apos;s algorithm for smarter
          ad optimization.
        </p>
        <p>
          Since Apple&apos;s iOS privacy updates significantly reduced
          browser-based tracking accuracy, we also implement{' '}
          <strong>Conversions API (CAPI)</strong> — a server-side tracking
          method that recovers conversion data that would otherwise be lost,
          ensuring your reported results reflect what&apos;s actually happening.
        </p>
        <p>
          We complete the setup with Google Analytics 4 and UTM parameters,
          giving you a full picture of how Facebook traffic behaves on your
          website, not just on the platform itself.
        </p>
      </>
    ),
  },
  {
    id: 4,
    title: 'Instagram Growth',
    icon: FaInstagram,
    content: (
      <>
        <h3>Instagram Growth</h3>
        <p>
          Instagram often requires a different content approach than Facebook —
          more visual, more Stories and Reels-focused, and driven heavily by
          aesthetics. We optimize your Instagram Business profile with a cohesive
          visual theme, strategic hashtag research, and Reels designed to
          maximize reach through Instagram&apos;s discovery algorithm.
        </p>
        <p>
          Since Facebook and Instagram ads run through the same Meta Ads
          Manager, we ensure your campaigns are cross-optimized — allowing budget
          to flow toward whichever platform is converting better for your
          specific business.
        </p>
      </>
    ),
  },
  {
    id: 5,
    title: 'Messenger & WhatsApp',
    icon: FaWhatsapp,
    content: (
      <>
        <h3>Messenger &amp; WhatsApp Marketing</h3>
        <p>
          For many Bangladeshi businesses, sales don&apos;t close in the ad —
          they close in the DM. We set up Click-to-Messenger and
          Click-to-WhatsApp ad campaigns that drive interested users directly
          into a conversation, where your team (or an automated chatbot, if you
          use our{' '}
          <Link
            href="/services/ai-automation-chatbot"
            className="text-brand-blue font-semibold hover:underline"
          >
            AI Automation &amp; Chatbot
          </Link>{' '}
          service) can answer questions and close the sale.
        </p>
        <p>
          We also help structure quick-reply templates and FAQ automation so
          response time stays fast, even during high-traffic campaign periods.
        </p>
      </>
    ),
  },
  {
    id: 6,
    title: 'Reporting & Analytics',
    icon: FaChartPie,
    content: (
      <>
        <h3>Reporting &amp; Analytics</h3>
        <p>
          You shouldn&apos;t have to guess whether your investment is working.
          Every month, we deliver a clear PDF report covering page growth, reach,
          engagement rate, ad spend, clicks, leads, and ROAS — translated into
          plain language, not just raw numbers.
        </p>
        <p>
          Beyond the numbers, we include our analysis of what worked, what
          didn&apos;t, and our recommended strategy for the following month —
          so reporting isn&apos;t just a formality, it&apos;s a roadmap for
          continuous growth.
        </p>
      </>
    ),
  },
];

// 3. METRICS FLIP CARDS DATA (8 key Meta Marketing metrics)
export const metricsCardsData: MetricCardItem[] = [
  {
    id: 'reach',
    icon: FaEye,
    title: 'Reach',
    shortDesc: 'How many people saw it',
    backTitle: 'Reach',
    explanation:
      'The number of unique people who saw your ad at least once — even if the same person saw it 5 times, it still counts as 1.',
    tag: 'Higher Reach = More Awareness',
  },
  {
    id: 'impressions',
    icon: FaLayerGroup,
    title: 'Impressions',
    shortDesc: 'Total times shown',
    backTitle: 'Impressions',
    explanation:
      'The total number of times your ad was displayed on screen — if the same person sees it multiple times, each view counts separately.',
    tag: 'Impressions ≥ Reach',
  },
  {
    id: 'frequency',
    icon: FaRepeat,
    title: 'Frequency',
    shortDesc: 'Avg. views per person',
    backTitle: 'Frequency',
    explanation:
      'Impressions ÷ Reach = Frequency. Once this goes above 3, audience fatigue sets in — time to refresh the creative.',
    tag: 'Ideal: 1.5 – 3',
  },
  {
    id: 'ctr',
    icon: FaArrowPointer,
    title: 'CTR',
    shortDesc: 'Click-through rate',
    backTitle: 'Click-Through Rate',
    explanation:
      'The percentage of people who clicked after seeing your ad. A low CTR usually means the creative or targeting needs work.',
    tag: 'Good CTR: 1% – 3%+',
  },
  {
    id: 'cpc',
    icon: FaCoins,
    title: 'CPC',
    shortDesc: 'Cost per click',
    backTitle: 'Cost Per Click',
    explanation:
      'The average amount spent for each click on your ad. Lower CPC generally means more efficient targeting and creative.',
    tag: 'Budget ÷ Clicks',
  },
  {
    id: 'cpm',
    icon: FaChartColumn,
    title: 'CPM',
    shortDesc: 'Cost per 1,000 views',
    backTitle: 'Cost Per Mille',
    explanation:
      'The cost to show your ad 1,000 times. Competitive audiences (like urban Dhaka) tend to push CPM higher.',
    tag: '(Budget ÷ Impressions) × 1000',
  },
  {
    id: 'cpl',
    icon: FaBullseye,
    title: 'CPL / CPA',
    shortDesc: 'Cost per lead/action',
    backTitle: 'Cost Per Lead / Action',
    explanation:
      'The average cost to generate one lead or desired action, such as a form fill or purchase.',
    tag: 'Budget ÷ Total Leads',
  },
  {
    id: 'roas',
    icon: FaSackDollar,
    title: 'ROAS',
    shortDesc: 'Return on ad spend',
    backTitle: 'Return On Ad Spend',
    explanation:
      'For every $1 spent, how much revenue came back. A 4x ROAS means $1 spent generated $4 in sales.',
    tag: 'Revenue ÷ Ad Spend',
  },
];

// 4. TRUST SEALS DATA (6 verified seals)
export const trustSealsData: TrustSealItem[] = [
  {
    id: 'meta-ads',
    icon: FaMeta,
    ribbon: 'Meta Ads Manager Practices',
    description:
      'Campaigns built and managed following Meta\'s official Ads Manager, Business Suite, and Conversions API guidelines.',
  },
  {
    id: 'ga4-gtm',
    icon: FaGoogle,
    ribbon: 'GA4 & Tag Manager Proficient',
    description:
      'Full-funnel tracking setup using Google Analytics 4 and Google Tag Manager, cross-checked against Meta data.',
  },
  {
    id: 'registered-entity',
    icon: FaShieldHalved,
    ribbon: 'Registered Business Entity',
    description:
      'A registered agency with a trade license — not an anonymous freelancer, with real accountability behind the work.',
  },
  {
    id: 'capi-specialist',
    icon: FaSatelliteDish,
    ribbon: 'Server-Side Tracking Specialist',
    description:
      'Conversions API (CAPI) implementation to recover data lost to iOS privacy restrictions.',
  },
  {
    id: 'campaigns-count',
    icon: FaClockRotateLeft,
    ribbon: '150+ Campaigns Managed',
    description:
      'A proven track record across e-commerce, real estate, healthcare, restaurants, and B2B logistics.',
  },
  {
    id: 'zero-markup',
    icon: FaFileInvoiceDollar,
    ribbon: 'Zero Hidden Markup Policy',
    description:
      'Ad spend goes directly to Meta from your own Business Manager — no hidden commission, ever.',
  },
];

// 5. ESTIMATOR INDUSTRY BENCHMARKS
// Default option: E-commerce / Fashion at $200
export const estimatorIndustriesData: EstimatorIndustry[] = [
  {
    key: 'ecommerce',
    label: 'E-commerce / Fashion',
    cpm: 1.2,
    ctr: 0.015,
    cpl: 1.2,
  },
  {
    key: 'restaurant',
    label: 'Restaurant / Local Retail',
    cpm: 0.9,
    ctr: 0.02,
    cpl: 0.8,
  },
  {
    key: 'realestate',
    label: 'Real Estate',
    cpm: 2.5,
    ctr: 0.01,
    cpl: 10.0,
  },
  {
    key: 'healthcare',
    label: 'Healthcare / Clinic',
    cpm: 2.0,
    ctr: 0.013,
    cpl: 3.5,
  },
  {
    key: 'education',
    label: 'Education / Course',
    cpm: 1.6,
    ctr: 0.018,
    cpl: 2.7,
  },
  {
    key: 'service',
    label: 'Local Service / B2B',
    cpm: 2.2,
    ctr: 0.015,
    cpl: 4.2,
  },
];

// 6. OUR PROMISE DATA (4 commitments)
export const promiseItemsData: PromiseItem[] = [
  {
    id: 'tracking-fixes',
    icon: FaArrowsRotate,
    title: 'Free Tracking Fixes',
    description: 'First 30 days covered',
  },
  {
    id: 'no-lockin',
    icon: FaCalendarCheck,
    title: 'No Lock-In',
    description: 'Cancel anytime',
  },
  {
    id: 'zero-markup',
    icon: FaEye,
    title: 'Zero Markup',
    description: '100% of spend to Meta',
  },
  {
    id: 'free-resetup',
    icon: FaRotateLeft,
    title: 'Free Re-Setup',
    description: 'If it\'s wrong, we fix it',
  },
];

// 7. TESTIMONIALS (3 verified clients from final demo)
export const testimonialsData: TestimonialItem[] = [
  {
    id: 'fahim-hasan',
    name: 'Fahim Hasan',
    role: 'Managing Director, Nova Electronics',
    tag: 'Catalog + Facebook Ads',
    rating: 5,
    quote:
      '“Nova is phones, accessories, and smart-home kits — if the catalog is wrong, the ad is wrong. 10 Cent Agency connected the pixel, cleaned the product feed, and started catalog ads plus remarketing instead of boosting random posts. Within the first month we could see which SKUs actually paid for the click. I still watch competitive phone launches week to week, but we are not advertising blind on Facebook anymore.”',
    initials: 'FH',
    avatarClass: 'avNavy',
  },
  {
    id: 'abu-manjar',
    name: 'Abu Manjar',
    role: 'Proprietor, KD Cargo Service',
    tag: 'Lead Ads',
    rating: 4,
    quote:
      '“We import from India — Kolkata to Dhaka door-to-door, LC, LCL and FCL, plus customs on both sides. That is hard to explain in a boosted post. They rebuilt the Page, ran lead and message ads around the real service, and started sending inquiries to WhatsApp instead of a dead inbox. Leads are more regular now. I would still like more cargo-specific video, but the Page finally looks like a real logistics company.”',
    initials: 'AM',
    avatarClass: 'avDeep',
  },
  {
    id: 'kabir-chowdhury',
    name: 'Kabir Chowdhury',
    role: 'Owner, GadgetHive BD',
    tag: 'Catalog + Remarketing',
    rating: 5,
    quote:
      '“GadgetHive sells electronics and trending accessories across Bangladesh. The team set up Instagram and Facebook catalog ads, then remarketing for people who left the cart. The monthly report is in plain language — spend, messages, and cost-per-order — so I know what I am paying for. I would run more creative tests on new arrivals, but the structure is finally something I can grow without guessing.”',
    initials: 'KC',
    avatarClass: 'avNavy',
  },
];

// 8. SCHEMA GRAPH GENERATOR
export function getFacebookMetaSchemaGraph() {
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
        '@id': 'https://www.10centagency.com/services/facebook-meta-marketing#webpage',
        url: 'https://www.10centagency.com/services/facebook-meta-marketing',
        name: 'Facebook & Meta Marketing Services | 10 Cent Agency BD',
        description:
          'Data-driven Facebook & Instagram campaigns for Bangladeshi businesses — Pixel, Conversions API, creative management & monthly reports. No ad spend markup.',
        inLanguage: 'en-BD',
        isPartOf: {
          '@id': 'https://www.10centagency.com/#website',
        },
        breadcrumb: {
          '@id': 'https://www.10centagency.com/services/facebook-meta-marketing#breadcrumb',
        },
        about: {
          '@id': 'https://www.10centagency.com/services/facebook-meta-marketing#service',
        },
      },
      {
        '@type': 'Service',
        '@id': 'https://www.10centagency.com/services/facebook-meta-marketing#service',
        name: 'Facebook & Meta Marketing Services',
        serviceType: 'Facebook & Meta Marketing',
        url: 'https://www.10centagency.com/services/facebook-meta-marketing',
        description:
          '10 Cent Agency provides complete Facebook & Instagram marketing services including page setup, content creation, ad campaign management, and monthly performance reporting for small and medium businesses in Bangladesh.',
        provider: {
          '@id': 'https://www.10centagency.com/#organization',
        },
        mainEntityOfPage: {
          '@id': 'https://www.10centagency.com/services/facebook-meta-marketing#webpage',
        },
        areaServed: {
          '@type': 'Country',
          name: 'Bangladesh',
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://www.10centagency.com/services/facebook-meta-marketing#breadcrumb',
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
            name: 'Facebook & Meta Marketing',
            item: 'https://www.10centagency.com/services/facebook-meta-marketing',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://www.10centagency.com/services/facebook-meta-marketing#faq',
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
