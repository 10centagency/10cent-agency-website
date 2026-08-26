// Data module for AI Automation & Chatbot Service Page
// Single source of truth containing serializable data only (no JSX, no state, no browser APIs)

export interface ServiceCardData {
  id: string;
  badge: string;
  name: string;
  features: string[];
}

export interface HowWeWorkStep {
  stepNumber: number;
  iconKey: string;
  title: string;
  description: string;
}

export interface StrategyTopic {
  id: number;
  title: string;
  iconKey: string;
  paragraphs: string[];
}

export interface TechItem {
  name: string;
  iconKey: string;
}

export interface TechCategory {
  title: string;
  iconKey: string;
  items: TechItem[];
}

export interface WhyChooseItem {
  title: string;
  iconKey: string;
  description: string;
}

export interface BenefitItem {
  title: string;
  iconKey: string;
  description: string;
}

export interface CommonMistakeItem {
  number: number;
  title: string;
  description: string;
}

export interface PricingPackage {
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
  title: string;
  iconKey: string;
  description: string;
}

export interface FAQBlock {
  type: 'paragraph';
  text: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answerText: string;
  blocks: FAQBlock[];
}

export interface TestimonialItem {
  id: string;
  tag: string;
  rating: number;
  quote: string;
  author: string;
  role: string;
  company: string;
  initials: string;
  avatarGradient: string;
}

export interface RelatedServiceItem {
  title: string;
  iconKey: string;
  description: string;
  href: string;
}

// 1. Service Breakdown (Exactly 5 cards from demo)
export const serviceCardsData: ServiceCardData[] = [
  {
    id: 'ai-chatbot-setup',
    badge: 'One-time Setup Fee',
    name: 'AI Chatbot Setup',
    features: [
      'Platforms: Facebook Messenger, WhatsApp Business, Telegram',
      'Facebook post auto-comment reply with lead-to-DM conversion',
      '24/7 FAQ handling, lead capture, appointment booking',
      'Multilingual (Bangla & English), human handover trigger',
      'API cost: approx. $5-20/month (client pays directly to provider)',
    ],
  },
  {
    id: 'ai-automation-workflows',
    badge: 'One-time Setup + Optional Maintenance',
    name: 'AI Automation Workflows (n8n)',
    features: [
      'Lead Generation — auto-capture from Facebook Ads, store in Sheets/CRM',
      'Order Management — auto confirm orders, generate invoices, notify team',
      'Customer Support — auto-respond, ticket tracking, satisfaction surveys',
      'Business Workflows — payment reminders, review requests, social cross-posting',
    ],
  },
  {
    id: 'chatbot-training',
    badge: 'Included with Setup',
    name: 'Chatbot Training & Knowledge Base',
    features: [
      'Custom FAQ database built from your products, services & policies',
      'AI trained on your brand\'s tone of voice and personality',
      'Continuous learning from real customer conversations',
      'Smart fallback responses for out-of-scope questions',
    ],
  },
  {
    id: 'multi-platform-integration',
    badge: 'Per Project',
    name: 'Multi-Platform Integration',
    features: [
      'Connect chatbot across Messenger, WhatsApp, Website Chat & Telegram together',
      'Unified inbox so your team sees all conversations in one place',
      'CRM & Google Sheets sync for real-time lead tracking',
      'E-commerce platform integration for order status updates',
    ],
  },
  {
    id: 'maintenance-optimization',
    badge: 'Monthly Retainer',
    name: 'Maintenance & Optimization',
    features: [
      'Monthly conversation log review & response accuracy improvements',
      'New FAQ / product updates added to the knowledge base',
      'Automation workflow monitoring & error fixing',
      'Monthly performance report — conversations handled, resolution rate, leads captured',
    ],
  },
];

// 2. How We Work (5 Steps)
export const howWeWorkData: HowWeWorkStep[] = [
  {
    stepNumber: 1,
    iconKey: 'FaPhoneVolume',
    title: 'Discovery Call',
    description: 'Understand your customer questions, sales process & tools',
  },
  {
    stepNumber: 2,
    iconKey: 'FaDiagramProject',
    title: 'Workflow Mapping',
    description: 'Map out conversation flows & automation logic for your business',
  },
  {
    stepNumber: 3,
    iconKey: 'FaRobot',
    title: 'Bot Building & Training',
    description: 'Build & train the chatbot on your real business knowledge',
  },
  {
    stepNumber: 4,
    iconKey: 'FaFlask',
    title: '3-Day Free Trial',
    description: 'Test the live chatbot with real conversations before committing',
  },
  {
    stepNumber: 5,
    iconKey: 'FaRocket',
    title: 'Launch & Optimize',
    description: 'Go live with ongoing monitoring and continuous improvement',
  },
];

// 3. Strategy Topics (7 Topics)
export const strategyTopicsData: StrategyTopic[] = [
  {
    id: 0,
    title: 'Conversation Flow Design',
    iconKey: 'FaDiagramProject',
    paragraphs: [
      'Before writing a single automated reply, we map out every possible path a customer conversation can take — from a simple price question to a full purchase inquiry. This prevents the frustrating experience of a chatbot getting "stuck" or giving irrelevant answers.',
      'We design flows around your actual sales process — greeting, qualifying questions, product recommendations, and a clear path to either checkout or human handoff. Each flow is built with decision branches so the bot responds appropriately no matter how the customer phrases their question.',
      'For Bangladeshi businesses, we also account for common local buying behavior — customers asking for price directly, requesting delivery details, or wanting to negotiate — building appropriate automated responses for each scenario.',
    ],
  },
  {
    id: 1,
    title: 'Natural Language Understanding',
    iconKey: 'FaBrain',
    paragraphs: [
      'A good chatbot doesn\'t rely on rigid keyword matching — it needs to understand what a customer actually means, even with typos, slang, or mixed Bangla-English (Banglish) messages. We use modern AI language models to interpret intent accurately, not just literal words.',
      'This means your chatbot can understand "koto taka?", "price koto", and "what\'s the cost?" as the exact same question, and respond appropriately regardless of how it\'s phrased.',
      'We continuously refine the understanding layer based on real conversation logs, so the bot gets smarter and more accurate at recognizing customer intent over time.',
    ],
  },
  {
    id: 2,
    title: 'Lead Capture & CRM Sync',
    iconKey: 'FaUsers',
    paragraphs: [
      'Every conversation is a potential lead — and losing that information because it\'s buried in a chat inbox is a common, costly mistake. We configure your chatbot to automatically capture name, phone number, and interest details during natural conversation, without feeling like a rigid form.',
      'Captured leads are automatically synced to Google Sheets or your CRM system in real time, so your sales team can follow up immediately instead of manually copying information from chat threads.',
      'We can also set up automated tagging — separating hot leads ready to buy from those still browsing — so your team knows exactly who to prioritize.',
    ],
  },
  {
    id: 3,
    title: 'Order & Payment Automation',
    iconKey: 'FaCartShopping',
    paragraphs: [
      'For businesses that sell directly through chat, we automate the entire order confirmation process — the bot collects order details, confirms product availability, and generates an order summary automatically, reducing manual back-and-forth.',
      'Using n8n automation, we connect this to your backend — automatically creating invoices, updating stock counts, and notifying your team the moment a new order comes in, so nothing gets missed during busy periods.',
      'Where applicable, we also integrate payment reminders and confirmation messages, keeping customers informed at every step without requiring manual follow-up from your team.',
    ],
  },
  {
    id: 4,
    title: 'Multilingual Support',
    iconKey: 'FaLanguage',
    paragraphs: [
      'Most Bangladeshi customers switch fluidly between Bangla and English, sometimes within the same sentence. Our chatbots are trained to understand and respond naturally in both languages, matching the customer\'s own language and tone.',
      'This removes a major barrier that generic, English-only chatbot templates create — customers get answers in the language they\'re most comfortable with, which builds trust and increases the likelihood of conversion.',
    ],
  },
  {
    id: 5,
    title: 'Human Handover System',
    iconKey: 'FaUserTie',
    paragraphs: [
      'No chatbot should ever leave a customer stuck with no way to reach a real person. Every bot we build includes a human handover trigger — when the AI detects a question it can\'t confidently answer, or when a customer explicitly asks for a human, it immediately notifies your team.',
      'This hybrid approach gives you the best of both worlds: instant automated responses for common questions, and a smooth, no-frustration path to human support for anything more complex.',
    ],
  },
  {
    id: 6,
    title: 'Analytics & Reporting',
    iconKey: 'FaChartPie',
    paragraphs: [
      'You shouldn\'t have to guess whether your chatbot is actually helping your business. Every month, we deliver a clear report covering total conversations handled, resolution rate, leads captured, and common questions the bot is receiving.',
      'This data also reveals gaps in your current FAQ coverage — questions the bot couldn\'t answer — which we use to continuously expand and improve the knowledge base, making the system smarter every month.',
    ],
  },
];

// 4. Technology Stack (4 Categories)
export const techStackData: TechCategory[] = [
  {
    title: 'AI & Language Models',
    iconKey: 'FaBrain',
    items: [
      { name: 'OpenAI GPT', iconKey: 'FaWandMagicSparkles' },
      { name: 'Google Dialogflow', iconKey: 'FaGoogle' },
      { name: 'Claude AI', iconKey: 'FaCommentDots' },
    ],
  },
  {
    title: 'Automation Platform',
    iconKey: 'FaDiagramProject',
    items: [
      { name: 'n8n', iconKey: 'FaGears' },
      { name: 'Zapier', iconKey: 'FaBolt' },
      { name: 'Make.com', iconKey: 'FaArrowsTurnToDots' },
    ],
  },
  {
    title: 'Messaging Platforms',
    iconKey: 'FaComments',
    items: [
      { name: 'Facebook Messenger', iconKey: 'FaFacebookMessenger' },
      { name: 'WhatsApp Business API', iconKey: 'FaWhatsapp' },
      { name: 'Telegram Bot API', iconKey: 'FaTelegram' },
    ],
  },
  {
    title: 'Integration & Data',
    iconKey: 'FaDatabase',
    items: [
      { name: 'Google Sheets', iconKey: 'FaGoogleDrive' },
      { name: 'Airtable', iconKey: 'FaTable' },
      { name: 'HubSpot CRM', iconKey: 'FaAddressBook' },
    ],
  },
];

// 5. Why Choose Us (6 Cards)
export const whyChooseUsData: WhyChooseItem[] = [
  {
    title: '3 Days Free Trial',
    iconKey: 'FaGift',
    description: 'Test the fully working chatbot live before you commit to anything.',
  },
  {
    title: 'Bangla + English Bots',
    iconKey: 'FaLanguage',
    description: 'Chatbots trained to understand and respond naturally in both languages.',
  },
  {
    title: 'Human Handover Built-in',
    iconKey: 'FaUserTie',
    description: 'Every bot smoothly escalates to your team when a question needs a human touch.',
  },
  {
    title: 'n8n-Powered Automation',
    iconKey: 'FaDiagramProject',
    description: 'Connect leads, orders, and customer support into one automated workflow system.',
  },
  {
    title: 'Transparent API Costs',
    iconKey: 'FaEye',
    description: 'You pay AI API costs directly to the provider — we never add hidden markups.',
  },
  {
    title: 'Fast Setup & Launch',
    iconKey: 'FaBolt',
    description: 'Most chatbots go from discovery call to live trial within a week.',
  },
];

// 6. Benefits List for AI Console section (5 rows)
export const benefitsData: BenefitItem[] = [
  {
    title: 'Never Miss a Customer Again',
    iconKey: 'FaClock',
    description: 'Responds instantly, 24/7 — even at 2 AM while you sleep.',
  },
  {
    title: 'Speaks Bangla & English Naturally',
    iconKey: 'FaLanguage',
    description: 'Understands Banglish messages the way your real customers type.',
  },
  {
    title: 'More Leads, Less Manual Work',
    iconKey: 'FaArrowTrendUp',
    description: 'Captures and organizes every lead automatically into your CRM.',
  },
  {
    title: 'Connects Your Whole Business',
    iconKey: 'FaDiagramProject',
    description: 'Orders, invoices, follow-ups — all automated together with n8n.',
  },
  {
    title: 'Smooth Human Handover',
    iconKey: 'FaUserTie',
    description: 'Never leaves a customer stuck — escalates to your team automatically.',
  },
];

// 7. 5 Common Chatbot Mistakes
export const commonMistakesData: CommonMistakeItem[] = [
  {
    number: 1,
    title: 'Using a Generic, Untrained Chatbot',
    description:
      'Off-the-shelf chatbot templates don\'t know your products, pricing, or policies — leading to frustrating, generic answers. We train every bot specifically on your business\'s real information.',
  },
  {
    number: 2,
    title: 'No Human Handover for Complex Queries',
    description:
      'When a bot gets stuck and there\'s no way to reach a human, customers simply give up and leave. Every chatbot we build includes an automatic handover trigger for exactly this situation.',
  },
  {
    number: 3,
    title: 'Only Automating One Platform',
    description:
      'Many businesses automate Facebook Messenger but leave WhatsApp and website chat fully manual — creating inconsistent response times across channels. We build unified, multi-platform systems.',
  },
  {
    number: 4,
    title: 'Ignoring Post-Sale Automation',
    description:
      'Automation shouldn\'t stop at answering questions — order confirmations, invoice generation, and follow-up messages are equally important and often left completely manual.',
  },
  {
    number: 5,
    title: 'Never Reviewing Conversation Logs',
    description:
      'Chatbots need ongoing refinement based on real customer questions. Businesses that "set it and forget it" miss opportunities to close gaps in the bot\'s knowledge base.',
  },
];

// 8. Pricing Packages
export const pricingPackagesData: PricingPackage[] = [
  {
    id: 'starter',
    badge: 'Best for Startups',
    name: 'Starter',
    note: 'Perfect for testing AI automation on a single platform',
    features: [
      'Single platform chatbot (Messenger or WhatsApp)',
      'Basic FAQ handling & lead capture',
      'Standard conversation flow templates',
      '3 days free trial included',
    ],
    ctaText: 'Get Custom Quote',
    ctaHref: '/contact',
  },
  {
    id: 'growth',
    badge: 'Most Popular',
    isPopular: true,
    name: 'Growth',
    note: 'For businesses ready to automate across multiple channels',
    features: [
      'Everything in Starter',
      'Multi-platform chatbot (Messenger + WhatsApp + Telegram)',
      'n8n automation workflows (leads, orders, follow-ups)',
      'CRM / Google Sheets integration',
      'Monthly optimization included',
    ],
    ctaText: 'Get Custom Quote',
    ctaHref: '/contact',
  },
  {
    id: 'pro',
    badge: 'Best for Scaling',
    name: 'Pro',
    note: 'For established businesses running full automation systems',
    features: [
      'Everything in Growth',
      'Advanced custom automation workflows',
      'Dedicated automation engineer',
      'Priority support & monthly strategy calls',
    ],
    ctaText: 'Get Custom Quote',
    ctaHref: '/contact',
  },
];

// 9. Industries We Serve (6 Cards)
export const industriesData: IndustryItem[] = [
  {
    title: 'E-commerce',
    iconKey: 'FaCartShopping',
    description:
      'Automated order confirmation, cart-recovery messages, and instant product Q&A that keep customers moving toward checkout.',
  },
  {
    title: 'Restaurant & Food',
    iconKey: 'FaUtensils',
    description:
      'Instant menu responses, table reservation bots, and automated order status updates for delivery customers.',
  },
  {
    title: 'Real Estate',
    iconKey: 'FaHouse',
    description:
      '24/7 property inquiry handling, automatic lead qualification, and instant scheduling for property visits.',
  },
  {
    title: 'Healthcare',
    iconKey: 'FaHeartPulse',
    description:
      'Automated appointment booking, reminder messages, and FAQ handling for clinics and healthcare providers.',
  },
  {
    title: 'Education',
    iconKey: 'FaGraduationCap',
    description:
      'Instant admission inquiry responses and automated follow-up sequences for prospective students.',
  },
  {
    title: 'Service & Consulting',
    iconKey: 'FaBriefcase',
    description:
      'Automated lead qualification and appointment scheduling so no inquiry ever goes unanswered.',
  },
];

// 10. FAQ Data (7 FAQs - Single source of truth for UI and JSON-LD)
export const faqsData: FAQItem[] = [
  {
    id: 'free-trial',
    question: 'How does the 3-day free trial work?',
    answerText:
      'We build and connect a fully working version of your chatbot on your chosen platform, trained on your actual business information. You get 3 full days to test it live with real customer conversations, completely free and with no credit card required. During the trial we collect your feedback and make adjustments. After the trial, if you are not satisfied, we disconnect the bot and you pay nothing.',
    blocks: [
      {
        type: 'paragraph',
        text: 'We build and connect a fully working version of your chatbot on your chosen platform — trained on your actual business information, not a generic template. You then get 3 full days to test it live with real customer conversations, completely free and with no credit card required.',
      },
      {
        type: 'paragraph',
        text: 'During the trial, we stay available on WhatsApp to collect your feedback and make adjustments, so you can see exactly how the bot answers questions, captures leads, and hands over to your team. This is a real working system, not a demo or a slideshow — your customers can interact with it directly.',
      },
      {
        type: 'paragraph',
        text: 'After the trial, you decide: if you\'re happy, we move forward with the package that fits your needs; if not, we disconnect the bot and you pay nothing. There is absolutely no pressure or hidden commitment.',
      },
    ],
  },
  {
    id: 'messaging-platforms',
    question: 'Which messaging platforms do you support?',
    answerText:
      'We build chatbots for Facebook Messenger, WhatsApp Business, Telegram, and website live chat widgets, either individually or connected together in one unified system. For businesses selling through Facebook pages, we also set up auto-comment replies on posts that convert commenters into private messages. During the free consultation we recommend the right platform based on where your customers actually message you.',
    blocks: [
      {
        type: 'paragraph',
        text: 'We build chatbots for Facebook Messenger, WhatsApp Business, Telegram, and website live chat widgets — either as a single platform or connected together in one unified system.',
      },
      {
        type: 'paragraph',
        text: 'For businesses selling through Facebook pages (F-Commerce), we also set up auto-comment replies on posts that convert commenters into private messages, so no inquiry gets lost in the comments section. This is one of the biggest lead sources for Bangladeshi online sellers.',
      },
      {
        type: 'paragraph',
        text: 'During your free consultation, we look at where your customers actually message you and recommend the right platform — or combination of platforms — instead of setting up everything blindly.',
      },
    ],
  },
  {
    id: 'api-costs',
    question: 'Do I need to pay for AI API costs separately?',
    answerText:
      'Yes, and this is fully transparent. The AI API (such as OpenAI) usage cost is approximately 5-20 USD per month depending on conversation volume, paid directly by you to the provider with no markup from us. For high-volume simple Q&A chatbots, we can tune the system to use lighter models to keep the bill lower, and we include monthly usage monitoring in your report.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Yes — and we want that to be completely transparent. The AI API (such as OpenAI) usage cost is approximately $5–20/month depending on your conversation volume, and it is paid directly by you to the provider. We never add any markup on it, and you can see the bill yourself in your own account.',
      },
      {
        type: 'paragraph',
        text: 'This model keeps your setup affordable and keeps you in control — there are no hidden monthly charges bundled inside our service. For high-volume, simple Q&A chatbots, we can also tune the system to use lighter and cheaper models, keeping the API bill at the lower end.',
      },
      {
        type: 'paragraph',
        text: 'We also help you monitor monthly usage in your report, so you always know what you\'re paying and why.',
      },
    ],
  },
  {
    id: 'bangla-support',
    question: 'Can the chatbot understand and respond in Bangla?',
    answerText:
      'Yes, our chatbots are trained to understand and respond fluently in both Bangla and English, including mixed Banglish messages. Whether a customer writes "dame koto?", "price koto?", or "what\'s the cost?", the bot recognizes the same intent and answers correctly, matching the customer\'s language and tone. It also understands local buying context such as delivery charges, bKash/Nagad payment, and bargaining.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Yes — our chatbots are trained to understand and respond fluently in both Bangla and English, including the mixed Banglish messages customers commonly type. Whether someone writes "দাম কত?", "price koto?", or "what\'s the cost?", the bot recognizes them as the same question and answers correctly.',
      },
      {
        type: 'paragraph',
        text: 'The bot matches the customer\'s own language and tone, which makes conversations feel natural and builds trust. It also understands local buying context — asking about delivery charges, bKash/Nagad payment, or bargaining — and responds appropriately without getting confused.',
      },
      {
        type: 'paragraph',
        text: 'This is one of the biggest advantages over English-only chatbot templates, which often frustrate Bangladeshi customers.',
      },
    ],
  },
  {
    id: 'human-handover',
    question: 'What happens if the chatbot can\'t answer a customer\'s question?',
    answerText:
      'Every chatbot we build includes a human handover trigger. When the AI cannot confidently answer, or the customer asks for a human, the bot notifies your team on WhatsApp or Telegram with a conversation summary so they can continue seamlessly. The bot never leaves the customer hanging and explains that a team member will join shortly. We also review unanswered questions monthly and add answers to the knowledge base, so resolution rates keep improving.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Every chatbot we build includes a human handover trigger. When the AI detects a question it can\'t confidently answer — or when a customer explicitly asks for a human — the bot immediately notifies your team through WhatsApp or Telegram, with a summary of the conversation so your staff can continue without re-reading the whole chat.',
      },
      {
        type: 'paragraph',
        text: 'Meanwhile, the bot never leaves the customer hanging: it responds politely, explains that a team member will join shortly, and shares your contact options. The customer always has a clear next step.',
      },
      {
        type: 'paragraph',
        text: 'We also review every unanswered question in our monthly optimization report and add the missing answers to the knowledge base — so the bot\'s resolution rate keeps improving, and fewer conversations need a human over time.',
      },
    ],
  },
  {
    id: 'n8n-usage',
    question: 'Is n8n automation only used for chatbots?',
    answerText:
      'No. n8n automation connects and automates almost any part of your business: order confirmations, invoice generation, review requests, payment reminders, lead syncing to CRM or Google Sheets, and cross-posting content. For example, a chatbot confirms an order and n8n automatically creates an invoice, updates stock, and notifies the customer and your team in seconds.',
    blocks: [
      {
        type: 'paragraph',
        text: 'No — n8n automation goes far beyond chatbots. It connects and automates almost any part of your business: order confirmations, invoice generation, review requests, payment reminders, lead syncing to CRM/Google Sheets, and cross-posting content across platforms.',
      },
      {
        type: 'paragraph',
        text: 'For example, a typical setup we build: a customer messages the chatbot → the bot confirms the order → n8n automatically creates an invoice, updates your stock sheet, and sends a WhatsApp confirmation to the customer and a notification to your team — all in seconds, with zero manual work.',
      },
      {
        type: 'paragraph',
        text: 'Think of the chatbot as the front door of your business and n8n as the engine running behind it. During discovery, we map your actual daily workflow and show you exactly where automation can save you hours.',
      },
    ],
  },
  {
    id: 'setup-timeline',
    question: 'How long does it take to set up a chatbot?',
    answerText:
      'A standard single-platform chatbot takes 5-10 working days to build and train, including the 3-day free trial period. Multi-platform or advanced automation setups take 2-3 weeks depending on complexity. The timeline depends on how quickly you provide your business information, and we give you a simple content checklist at the start. We share progress updates on WhatsApp at every stage.',
    blocks: [
      {
        type: 'paragraph',
        text: 'A standard single-platform chatbot typically takes 5–10 working days to build and train, including the 3-day free trial period. Multi-platform setups or advanced automation workflows may take 2–3 weeks, depending on the complexity of your business process.',
      },
      {
        type: 'paragraph',
        text: 'The timeline depends mainly on how quickly we receive your business information — product/service list, common customer questions, pricing, and policies. We give you a simple content checklist at the start, so you know exactly what to prepare and nothing gets delayed.',
      },
      {
        type: 'paragraph',
        text: 'We work in clear stages — build, review the conversation flow with you, then the live trial — and you receive progress updates on WhatsApp at every step, so you\'re never left wondering where your project stands.',
      },
    ],
  },
];

// 11. Testimonials Data (3 Cards)
export const testimonialsData: TestimonialItem[] = [
  {
    id: 'fabri-creation',
    tag: 'F-Commerce Chatbot',
    rating: 5,
    quote:
      '"We sell men\'s shirts, pants, and hoodies through our Facebook page, and replying to every comment and inbox message used to take hours. Now the chatbot answers product, price, and order questions instantly — even while we sleep — and captures order details automatically. We just confirm orders in the morning, and we haven\'t missed a single customer message since."',
    author: 'Mahfuz Hasan',
    role: 'Owner',
    company: 'Fabri Creation BD',
    initials: 'MH',
    avatarGradient: 'linear-gradient(135deg, #1f5fb0, #0f2547)',
  },
  {
    id: 'china-bd-trading',
    tag: 'WhatsApp Automation',
    rating: 5,
    quote:
      '"Most of our clients reach us on WhatsApp for rates and shipment updates. The automated system now answers the common questions instantly — hand carry, urgent samples, documents, and parts — and serious inquiries are forwarded straight to our team. We handle far more clients every day without needing extra staff, and nothing gets lost in the chat list anymore."',
    author: 'Atiqur Rahman',
    role: 'Proprietor',
    company: 'China BD Trading',
    initials: 'AR',
    avatarGradient: 'linear-gradient(135deg, #0d9488, #134e4a)',
  },
  {
    id: 'taslimas-makeover',
    tag: 'Booking Automation',
    rating: 5,
    quote:
      '"Bridal clients often message us late at night, and we used to lose inquiries when we couldn\'t reply on time. Now the chatbot shares our bridal and party makeover packages, prices, and booking process instantly, and takes booking requests round the clock. Our appointment schedule fills up faster, and I only step in for the final confirmation."',
    author: 'Taslima Begum',
    role: 'Owner',
    company: 'Taslima\'s Makeover',
    initials: 'TB',
    avatarGradient: 'linear-gradient(135deg, #7c3aed, #4c1d95)',
  },
];

// Connected Schema.org @graph generator
export function getAIAutomationSchemaGraph() {
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
        '@id': 'https://www.10centagency.com/services/ai-automation-chatbot#webpage',
        url: 'https://www.10centagency.com/services/ai-automation-chatbot',
        name: 'AI Automation & Chatbot Services in Bangladesh | 10 Cent Agency',
        description:
          'AI chatbot and n8n automation services in Bangladesh for Messenger, WhatsApp and Telegram—automate leads, orders and customer support 24/7.',
        inLanguage: 'en-BD',
        isPartOf: {
          '@id': 'https://www.10centagency.com/#website',
        },
        breadcrumb: {
          '@id': 'https://www.10centagency.com/services/ai-automation-chatbot#breadcrumb',
        },
        about: {
          '@id': 'https://www.10centagency.com/services/ai-automation-chatbot#service',
        },
        mainEntity: {
          '@id': 'https://www.10centagency.com/services/ai-automation-chatbot#service',
        },
      },
      {
        '@type': 'Service',
        '@id': 'https://www.10centagency.com/services/ai-automation-chatbot#service',
        name: 'AI Automation & Chatbot Services',
        serviceType: 'AI Automation & Chatbot',
        url: 'https://www.10centagency.com/services/ai-automation-chatbot',
        description:
          '10 Cent Agency builds AI-powered chatbots for Facebook Messenger, WhatsApp Business, and Telegram, plus n8n-powered business automation workflows for lead generation, order management, and customer support for small and medium businesses in Bangladesh.',
        provider: {
          '@id': 'https://www.10centagency.com/#organization',
        },
        mainEntityOfPage: {
          '@id': 'https://www.10centagency.com/services/ai-automation-chatbot#webpage',
        },
        areaServed: {
          '@type': 'Country',
          name: 'Bangladesh',
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://www.10centagency.com/services/ai-automation-chatbot#breadcrumb',
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
            name: 'AI Automation & Chatbot',
            item: 'https://www.10centagency.com/services/ai-automation-chatbot',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://www.10centagency.com/services/ai-automation-chatbot#faq',
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
