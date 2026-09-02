export interface OverviewBarItem {
  label: string;
  rate: string;
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
  items: string[];
}

export interface HowWeWorkStepItem {
  stepNumber: string;
  stepTag: string;
  iconKey: string;
  title: string;
  description: string;
}

export interface PaletteItem {
  id: string;
  name: string;
  swatches: string[];
  hasBorderLast?: boolean;
  note: string;
}

export interface TypePairItem {
  id: string;
  styleType: 'geometric' | 'serif' | 'mono';
  heading: string;
  body: string;
  tags: string[];
}

export interface StrategyTabItem {
  id: number;
  title: string;
  iconKey: string;
  paragraphs: string[];
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

export interface VsComparisonSide {
  badge: string;
  heading: string;
  points: string[];
}

export interface CommonMistakeItem {
  number: number;
  title: string;
  description: string;
}

export interface FileDeliveryItem {
  id: string;
  ext: string;
  name: string;
  color: string;
  bgColor: string;
  iconKey: string;
  hint: string;
}

export interface PricingPackageItem {
  id: string;
  badge: string;
  title: string;
  note: string;
  popular?: boolean;
  bullets: string[];
}

export interface IndustryItem {
  id: string;
  name: string;
  iconKey: string;
  description: string;
}

export interface FAQBlock {
  type: 'paragraph' | 'list';
  text?: string;
  items?: string[];
}

export interface FAQItem {
  id: number;
  question: string;
  blocks: FAQBlock[];
  schemaText: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  badge: string;
  avatar: string;
  avatarTheme: 'navy' | 'blue' | 'deep';
  quote: string;
}

export interface RelatedServiceItem {
  id: string;
  title: string;
  iconKey: string;
  description: string;
  link: string;
}

/* ==========================================================================
   1. OVERVIEW PROGRESS BARS & STATS (Why Design Quality Actually Matters)
   ========================================================================== */
export const overviewBarsData: OverviewBarItem[] = [
  { label: 'Logo & Color Consistency', rate: '38%', width: '38%' },
  { label: 'Typography & Readability', rate: '25%', width: '25%' },
  { label: 'Photo/Graphic Quality', rate: '37%', width: '37%' },
];

export const overviewCompareData = {
  without: {
    label: 'Inconsistent / DIY Design',
    sub: 'Baseline',
    width: '38%',
    innerText: 'Low Recall',
  } as OverviewCompareBlock,
  with: {
    label: 'Professional Brand System',
    sub: '+80% Recognition',
    width: '90%',
    innerText: 'Consistent & Trusted',
  } as OverviewCompareBlock,
};

/* ==========================================================================
   2. SERVICE CARDS (Graphic Design Services)
   ========================================================================== */
export const serviceCardsData: ServiceCardItem[] = [
  {
    id: 'brand-identity',
    title: 'Brand Identity Design',
    badge: 'One-time Project',
    items: [
      'Logo design (Primary, Icon & all variations)',
      'Color palette, typography & brand style guide',
      'Business card & letterhead design',
    ],
  },
  {
    id: 'social-media-graphics',
    title: 'Social Media Graphics',
    badge: 'Per Project / Monthly',
    items: [
      'Facebook/Instagram cover & post templates',
      'Story templates, highlight icons, promotional banners',
      'Editable monthly content calendar design',
    ],
  },
  {
    id: 'marketing-print',
    title: 'Marketing & Print Materials',
    badge: 'Per Project',
    items: [
      'Flyers, posters, brochures & ad creatives',
      'Print-ready files (CMYK, bleed-safe)',
      'Menu, catalog & signage design',
    ],
  },
  {
    id: 'packaging-label',
    title: 'Packaging & Label Design',
    badge: 'Per Project',
    items: [
      'Product packaging & box design',
      'Label & sticker design with die-line files',
      'Print-vendor-ready delivery',
    ],
  },
  {
    id: 'presentation-pitch-deck',
    title: 'Presentation & Pitch Deck Design',
    badge: 'Per Project',
    items: [
      'Investor pitch deck & sales presentation design',
      'Editable PowerPoint / Google Slides template',
      'Custom icons, charts & infographics',
    ],
  },
  {
    id: 'digital-ad-creatives',
    title: 'Digital Ad Creatives',
    badge: 'Per Project / Monthly',
    items: [
      'Facebook & Google display ad sets',
      'Multiple size variations for every placement',
      'A/B creative variations for testing',
    ],
  },
];

/* ==========================================================================
   3. HOW WE WORK (Our Process)
   ========================================================================== */
export const howWeWorkStepsData: HowWeWorkStepItem[] = [
  {
    stepNumber: '1',
    stepTag: 'STEP 01',
    iconKey: 'FaComments',
    title: 'Discovery & Brief',
    description: 'Understanding your brand, audience, and design goals',
  },
  {
    stepNumber: '2',
    stepTag: 'STEP 02',
    iconKey: 'FaSwatchbook',
    title: 'Moodboard & Concept',
    description: 'Curating color, style, and reference direction before design begins',
  },
  {
    stepNumber: '3',
    stepTag: 'STEP 03',
    iconKey: 'FaPenNib',
    title: 'Design Drafts',
    description: '2-3 initial concepts delivered for your review and feedback',
  },
  {
    stepNumber: '4',
    stepTag: 'STEP 04',
    iconKey: 'FaArrowsRotate',
    title: 'Revisions & Refinement',
    description: 'Structured revision rounds until the design feels exactly right',
  },
  {
    stepNumber: '5',
    stepTag: 'STEP 05',
    iconKey: 'FaBoxOpen',
    title: 'Final Delivery',
    description: 'All source & export files delivered, ready for print and digital use',
  },
];

/* ==========================================================================
   4. DESIGN STYLE SHOWCASE (Palettes & Typography Pairings)
   ========================================================================== */
export const paletteShowcaseData: PaletteItem[] = [
  {
    id: 'corporate-trust',
    name: 'Corporate Trust',
    swatches: ['#0f2547', '#1f5fb0', '#eaf3fc', '#ffffff'],
    hasBorderLast: true,
    note: 'Navy & Blue — Finance, Tech, B2B',
  },
  {
    id: 'vibrant-modern',
    name: 'Vibrant Modern',
    swatches: ['#e0463f', '#ff8a5c', '#ffd166', '#fff6ee'],
    hasBorderLast: false,
    note: 'Warm & Energetic — Food, Retail, Youth Brands',
  },
  {
    id: 'earthy-organic',
    name: 'Earthy Organic',
    swatches: ['#3d5a45', '#89a877', '#e3c88a', '#f6f1e7'],
    hasBorderLast: false,
    note: 'Natural & Warm — Wellness, Organic, Lifestyle',
  },
  {
    id: 'minimal-luxury',
    name: 'Minimal Luxury',
    swatches: ['#111111', '#4d4d4d', '#c9a24b', '#f5f5f5'],
    hasBorderLast: false,
    note: 'Mono & Gold — Premium, Fashion, Real Estate',
  },
];

export const typePairShowcaseData: TypePairItem[] = [
  {
    id: 'geometric',
    styleType: 'geometric',
    heading: 'Aa Bb Cc',
    body: 'Bold, geometric headline paired with a clean, readable body font.',
    tags: ['Poppins', 'Inter'],
  },
  {
    id: 'serif',
    styleType: 'serif',
    heading: 'Aa Bb Cc',
    body: 'Elegant serif-style headline for premium, editorial brand feels.',
    tags: ['Playfair Display', 'Lato'],
  },
  {
    id: 'mono',
    styleType: 'mono',
    heading: 'Aa Bb Cc',
    body: 'Modern monospace headline for tech, SaaS, and startup brands.',
    tags: ['JetBrains Mono', 'Poppins'],
  },
];

/* ==========================================================================
   5. STRATEGY TABS (Our Graphic Design Approach)
   ========================================================================== */
export const strategyTabsData: StrategyTabItem[] = [
  {
    id: 0,
    title: 'Brand Discovery & Strategy',
    iconKey: 'FaLightbulb',
    paragraphs: [
      'Before any design work begins, we understand your business — your audience, competitors, and what makes you different. This shapes every design decision that follows.',
      'We ask about tone (professional, playful, premium), target customer, and where your designs will actually be used — print, social, or both.',
      'This discovery step is what separates a strategic brand from a random-looking logo.',
    ],
  },
  {
    id: 1,
    title: 'Logo & Identity Process',
    iconKey: 'FaShapes',
    paragraphs: [
      'We start with sketches and moodboards, then develop 2-3 distinct logo directions based on your brief.',
      'Once a direction is chosen, we refine it into a full identity system — primary logo, icon/favicon version, and monochrome variations for different backgrounds.',
      'Every logo is delivered vector-based, so it scales perfectly from a business card to a billboard.',
    ],
  },
  {
    id: 2,
    title: 'Color Theory & Psychology',
    iconKey: 'FaFillDrip',
    paragraphs: [
      'Color choice isn\'t random — blue builds trust, red creates urgency, green suggests growth or nature. We select palettes based on what emotion your brand needs to trigger.',
      'We also test color combinations for accessibility and contrast, so your designs remain readable across devices.',
      'Every palette includes primary, secondary, and neutral tones for full design flexibility.',
    ],
  },
  {
    id: 3,
    title: 'Typography Selection',
    iconKey: 'FaFont',
    paragraphs: [
      'Fonts carry personality — bold and geometric feels modern, serif feels premium, monospace feels technical. We pair a strong headline font with a highly readable body font.',
      'We also ensure fonts we choose support Bangla + English where your business needs bilingual materials.',
      'This pairing becomes part of your brand guideline for long-term consistency.',
    ],
  },
  {
    id: 4,
    title: 'Social Media Design Systems',
    iconKey: 'FaTableCells',
    paragraphs: [
      'Rather than one-off posts, we build a reusable template system — so your social media stays visually consistent even when you create new content yourself.',
      'This includes post templates, story templates, highlight icons, and a defined content color/layout structure.',
      'All templates are delivered in editable format (Canva or PSD) based on your preference.',
    ],
  },
  {
    id: 5,
    title: 'Print-Ready File Preparation',
    iconKey: 'FaPrint',
    paragraphs: [
      'Print materials require different technical setup than digital — CMYK color mode, correct bleed and safe margins, and appropriate resolution (300 DPI).',
      'We prepare every print file exactly as a professional printing press requires, avoiding costly reprints from incorrect setup.',
      'Digital and print versions are always delivered separately so colors look accurate in both formats.',
    ],
  },
];

/* ==========================================================================
   6. TOOLS & SOFTWARE (Software We Design With)
   ========================================================================== */
export const techStackData: TechCategoryItem[] = [
  {
    category: 'Adobe Creative Suite',
    iconKey: 'FaPalette',
    tools: [
      { name: 'Illustrator', iconKey: 'FaPenNib' },
      { name: 'Photoshop', iconKey: 'FaImage' },
      { name: 'InDesign', iconKey: 'FaFileLines' },
    ],
  },
  {
    category: 'UI & Collaboration',
    iconKey: 'FaFigma',
    tools: [
      { name: 'Figma', iconKey: 'FaFigma' },
      { name: 'Canva Pro', iconKey: 'FaObjectGroup' },
      { name: 'Shared Design Boards', iconKey: 'FaShareNodes' },
    ],
  },
  {
    category: 'Print Preparation',
    iconKey: 'FaPrint',
    tools: [
      { name: 'CMYK Color Setup', iconKey: 'FaDroplet' },
      { name: 'Bleed & Dieline Setup', iconKey: 'FaCropSimple' },
      { name: 'Press-Ready PDF', iconKey: 'FaFilePdf' },
    ],
  },
  {
    category: 'Presentation & Motion',
    iconKey: 'FaShapes',
    tools: [
      { name: 'PowerPoint / Slides', iconKey: 'FaDisplay' },
      { name: 'After Effects (Basic)', iconKey: 'FaFilm' },
      { name: 'Icon & Illustration Kits', iconKey: 'FaIcons' },
    ],
  },
];

/* ==========================================================================
   7. WHY CHOOSE US (Why Work With Us)
   ========================================================================== */
export const whyChooseUsData: WhyChooseUsItem[] = [
  {
    id: 'custom-designs',
    title: 'Custom, Not Templates',
    iconKey: 'FaSwatchbook',
    description: 'Every design is built from scratch around your brand — never a recycled template.',
  },
  {
    id: 'fast-turnaround',
    title: 'Fast Turnaround',
    iconKey: 'FaBolt',
    description: 'Structured process means most projects are delivered within 3-7 working days.',
  },
  {
    id: 'print-digital-ready',
    title: 'Print & Digital Ready',
    iconKey: 'FaFileExport',
    description: 'Every file is delivered correctly formatted for both print and screen use.',
  },
  {
    id: 'full-ownership',
    title: 'Full Ownership',
    iconKey: 'FaCopyright',
    description: 'You receive 100% commercial rights and source files — no license restrictions.',
  },
  {
    id: 'structured-revisions',
    title: 'Structured Revisions',
    iconKey: 'FaArrowsRotate',
    description: 'Clear revision rounds included so the final design truly matches your vision.',
  },
  {
    id: 'dedicated-designer',
    title: 'Dedicated Designer',
    iconKey: 'FaUserTie',
    description: 'A dedicated designer manages your brand\'s visual consistency across every project.',
  },
];

/* ==========================================================================
   8. COMPARISON TABLE (10 Cent Agency vs Freelancer/DIY Design)
   ========================================================================== */
export const vsComparisonData = {
  traditional: {
    badge: 'Freelancer / DIY Design',
    heading: 'Inconsistent Approach',
    points: [
      'Inconsistent style across different materials',
      'No brand guideline document provided',
      'Slow, unpredictable turnaround times',
      'Limited or no revision support',
      'Files often not print-ready',
      'One person, limited availability',
    ],
  } as VsComparisonSide,
  us: {
    badge: '10 Cent Agency',
    heading: 'Structured Brand System',
    points: [
      'Consistent, professional brand system every time',
      'Complete brand guideline document included',
      'Fast, scheduled delivery timelines',
      'Structured revision rounds included',
      'Print & digital-ready files, every time',
      'Dedicated design team + account support',
    ],
  } as VsComparisonSide,
};

/* ==========================================================================
   9. COMMON MISTAKES (5 Common Design Mistakes)
   ========================================================================== */
export const commonMistakesData: CommonMistakeItem[] = [
  {
    number: 1,
    title: 'Using Free Logo Makers',
    description: 'Generic templates make your brand look identical to hundreds of other businesses using the same tool.',
  },
  {
    number: 2,
    title: 'Inconsistent Colors & Fonts',
    description: 'Different colors and fonts across Facebook, website, and print materials confuse and weaken brand recall.',
  },
  {
    number: 3,
    title: 'Low-Resolution Files for Print',
    description: 'Using web images for printing leads to blurry, unprofessional-looking banners and packaging.',
  },
  {
    number: 4,
    title: 'No Brand Guideline Document',
    description: 'Without a guideline, every new designer or employee creates something slightly "off-brand."',
  },
  {
    number: 5,
    title: 'Ignoring Platform-Specific Sizing',
    description: 'Designs not sized correctly for Facebook, Instagram, or print get cropped or distorted.',
  },
];

/* ==========================================================================
   10. STATS & DONUT (Our Performance By The Numbers)
   ========================================================================== */
export const statsCountersData = {
  delivered: 220,
  brands: 90,
  firstDraft: 48,
  satisfaction: 98,
};

export const donutStatData = {
  percentage: 85,
  innerLabel: 'Repeat Clients',
  legendTitle: 'Client Retention (Sample)',
  legendParagraph:
    '85% of our design clients return for additional projects — social media kits, marketing materials, or campaign creatives.',
};

/* ==========================================================================
   11. FILE DELIVERY MOCKUP (What You Actually Receive)
   ========================================================================== */
export const fileDeliveryData: FileDeliveryItem[] = [
  {
    id: 'ai-master',
    ext: '.AI',
    name: 'Master_Source.ai',
    color: '#e08b1f',
    bgColor: '#fff2e0',
    iconKey: 'FaPenNib',
    hint: 'Editable original file — for future edits by any designer.',
  },
  {
    id: 'eps-vector',
    ext: '.EPS',
    name: 'Universal_Vector.eps',
    color: '#c9622b',
    bgColor: '#ffe8d6',
    iconKey: 'FaVectorSquare',
    hint: 'Universal format — what printing vendors usually ask for.',
  },
  {
    id: 'pdf-print',
    ext: '.PDF',
    name: 'Print_Ready.pdf',
    color: '#c22b2b',
    bgColor: '#fde6e6',
    iconKey: 'FaFilePdf',
    hint: 'CMYK, bleed-safe — hand this directly to any press.',
  },
  {
    id: 'png-logo',
    ext: '.PNG',
    name: 'Transparent_Logo.png',
    color: '#3556d1',
    bgColor: '#e6ecff',
    iconKey: 'FaImage',
    hint: 'Transparent background — use over any color or image.',
  },
  {
    id: 'jpg-share',
    ext: '.JPG',
    name: 'Quick_Share.jpg',
    color: '#1f9d55',
    bgColor: '#dff3e6',
    iconKey: 'FaFileImage',
    hint: 'Lightweight — perfect for social media & WhatsApp.',
  },
  {
    id: 'svg-vector',
    ext: '.SVG',
    name: 'Web_Vector.svg',
    color: '#c22b7f',
    bgColor: '#fde6f2',
    iconKey: 'FaCode',
    hint: 'Stays sharp at any size — ideal for your website & favicon.',
  },
];

/* ==========================================================================
   12. PRICING PACKAGES (Choose the Right Design Package)
   ========================================================================== */
export const pricingPackagesData: PricingPackageItem[] = [
  {
    id: 'social-media-design',
    badge: 'Best for Creators',
    title: 'Social Media Design',
    note: 'Perfect for consistent monthly content',
    popular: false,
    bullets: [
      'Post & story template design',
      'Editable Canva or PSD files',
      '1-2 revision rounds',
    ],
  },
  {
    id: 'brand-identity-package',
    badge: 'Most Popular',
    title: 'Brand Identity Package',
    note: 'A complete professional brand system',
    popular: true,
    bullets: [
      'Logo + all variations',
      'Color palette & typography guide',
      'Business card & letterhead',
      '2-3 revision rounds',
    ],
  },
  {
    id: 'brand-marketing-bundle',
    badge: 'Full Bundle',
    title: 'Brand + Marketing Bundle',
    note: 'For businesses that need it all in one project',
    popular: false,
    bullets: [
      'Everything in Brand Identity',
      'Social media kit + marketing materials',
      'Dedicated designer & priority turnaround',
    ],
  },
];

/* ==========================================================================
   13. INDUSTRIES (Design Tailored to Your Industry)
   ========================================================================== */
export const industriesData: IndustryItem[] = [
  {
    id: 'restaurant-food',
    name: 'Restaurant & Food',
    iconKey: 'FaUtensils',
    description: 'Menu design, packaging, table cards, and social media food photography layouts.',
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    iconKey: 'FaCartShopping',
    description: 'Product graphics, ad creatives, banner sets, and packaging design that boosts conversions.',
  },
  {
    id: 'real-estate',
    name: 'Real Estate',
    iconKey: 'FaHouse',
    description: 'Property brochures, signage, and premium presentation design for listings.',
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    iconKey: 'FaHeartPulse',
    description: 'Appointment cards, awareness posters, and trust-building clinic branding.',
  },
  {
    id: 'education',
    name: 'Education',
    iconKey: 'FaGraduationCap',
    description: 'Course banners, certificates, and admission campaign creatives for institutes.',
  },
  {
    id: 'fashion-retail',
    name: 'Fashion & Retail',
    iconKey: 'FaShirt',
    description: 'Lookbooks, catalogs, and seasonal campaign graphics for retail brands.',
  },
];

/* ==========================================================================
   14. FAQ ITEMS (Frequently Asked Questions)
   ========================================================================== */
export const faqsData: FAQItem[] = [
  {
    id: 1,
    question: 'How many logo concepts do I get?',
    blocks: [
      {
        type: 'paragraph',
        text: 'You receive 2–3 unique logo concepts after the discovery call and moodboard — not three slight color tweaks of the same mark. Each direction is built from your brief: audience, tone, and where the logo will actually live (tags, brochures, social, site boards).',
      },
      {
        type: 'paragraph',
        text: 'The mix is industry-specific. Typical first-round sets look like this:',
      },
      {
        type: 'list',
        items: [
          'Fashion / everyday wear — wordmark, icon-led mark, and a monogram for labels',
          'Home décor & lifestyle — wordmark plus a seal that works on packaging and lookbooks',
          'Real estate / development — formal lockup that still reads on a site board and brochure cover',
        ],
      },
      {
        type: 'paragraph',
        text: 'Step 1 is discovery, Step 2 is the moodboard (usually Days 1–2), and concepts land in Step 3. You pick one direction; Steps 4–5 refine it through the included revision rounds and deliver primary, icon, and monochrome versions as vectors.',
      },
    ],
    schemaText:
      'You receive 2–3 unique logo concepts after the discovery call and moodboard — not three slight color tweaks of the same mark. Each direction is built from your brief: audience, tone, and where the logo will live (tags, brochures, social, signage). A fashion brand might see a wordmark, an icon-led mark, and a monogram. A home décor studio often gets a wordmark plus a seal. A property developer typically needs a formal lockup that still works on a site board. Step 1 is discovery, Step 2 is the moodboard (usually Days 1–2), and concepts land in Step 3. You pick one direction; Steps 4–5 refine it through the included revision rounds and deliver primary, icon, and monochrome versions as vectors.',
  },
  {
    id: 2,
    question: 'What file formats will I receive?',
    blocks: [
      {
        type: 'paragraph',
        text: 'Every project ships as an organized delivery folder — the same structure shown in the file-delivery mockup on this page — so you always know which file to send where. Nothing is left as a single flattened JPG.',
      },
      {
        type: 'paragraph',
        text: 'A standard Brand Identity pack includes:',
      },
      {
        type: 'list',
        items: [
          'AI + EPS master vectors, and SVG for web / favicon',
          'CMYK bleed-safe PDF for press, plus transparent PNG and lightweight JPG',
          'Social kits add PSD or Canva templates; packaging adds die-lines; decks add PPT / Slides',
        ],
      },
      {
        type: 'paragraph',
        text: 'Files go out on the final delivery day — typically Day 5–7 for identity, Day 3–5 for social or print — via a labeled Google Drive folder. After final payment you own every file: no watermark, no license expiry.',
      },
    ],
    schemaText:
      'Every project ships as an organized delivery folder — the same structure shown in the file-delivery mockup on this page — so you always know which file to send where. You get AI and EPS master vectors, a CMYK bleed-safe PDF for press, transparent PNG, lightweight JPG, and SVG for web and favicons. Social kits add PSD or Canva templates; packaging adds die-line files; pitch decks add editable PowerPoint or Google Slides. Files go out on the final delivery day (typically Day 5–7 for identity, Day 3–5 for social or print) via a labeled Google Drive folder. After final payment you own every file — no watermark, no license expiry.',
  },
  {
    id: 3,
    question: 'How many revision rounds are included?',
    blocks: [
      {
        type: 'paragraph',
        text: 'Social Media Design includes 1–2 revision rounds. Brand Identity and the Brand + Marketing Bundle include 2–3 rounds on the chosen concept — not unlimited restarts from a blank page.',
      },
      {
        type: 'paragraph',
        text: 'A “round” is one collected set of feedback, turned around in 24–48 hours. Typical notes we action in a single round:',
      },
      {
        type: 'list',
        items: [
          'Tighten the wordmark or simplify the icon',
          'Swap a secondary color or adjust contrast for print',
          'Resize lockups for tags, stories, or a brochure cover',
        ],
      },
      {
        type: 'paragraph',
        text: 'Extra rounds after the package limit can be added at a small quoted fee. We ask for consolidated comments so a round is not burned on one-line WhatsApp notes. Revisions sit in Step 4, after you pick a concept in Step 3.',
      },
    ],
    schemaText:
      'Social Media Design includes 1–2 revision rounds. Brand Identity and the Brand + Marketing Bundle include 2–3 rounds on the chosen concept — not unlimited restarts from a blank page. A round is one collected set of feedback (for example: tighten the wordmark, swap the secondary color, simplify the icon), turned around in 24–48 hours. Extra rounds after the package limit can be added at a small quoted fee. We ask for consolidated comments so a round is not burned on one-line WhatsApp notes. Revisions sit in Step 4, after you pick a concept in Step 3, so the clock is spent polishing one direction.',
  },
  {
    id: 4,
    question: 'Do I get full ownership and copyright of the designs?',
    blocks: [
      {
        type: 'paragraph',
        text: 'Yes. Once the final invoice is paid, you receive 100% ownership and commercial usage rights to all final design files — logo, templates, print, and source.',
      },
      {
        type: 'paragraph',
        text: 'That means you can use the work without coming back to us or paying a yearly license:',
      },
      {
        type: 'list',
        items: [
          'Print, advertise, and run ads under your own name',
          'File a trademark and hand AI / EPS files to any future designer',
          'Stock photos or licensed fonts follow their own licenses — we only pick fonts you can keep using commercially, listed in the guideline',
        ],
      },
      {
        type: 'paragraph',
        text: 'Transfer happens with the final Drive folder on delivery day. We do not retain usage rights or watermark finals.',
      },
    ],
    schemaText:
      'Yes. Once the final invoice is paid, you receive 100% ownership and commercial usage rights to all final design files — logo, templates, print, and source. You can print, advertise, trademark, and hand the AI/EPS files to any future designer. Stock photos or licensed fonts follow their own licenses; we only use fonts you can keep using commercially and we list them in the brand guideline. Transfer happens with the final Drive folder on delivery day. We do not retain usage rights, charge yearly license fees, or watermark finals.',
  },
  {
    id: 5,
    question: 'How long does a typical design project take?',
    blocks: [
      {
        type: 'paragraph',
        text: 'Brand Identity is typically 5–7 working days. Social media graphics and marketing / print materials are typically 3–5 working days. A full Brand + Marketing Bundle is scoped on the brief — often 8–12 working days, because identity is locked before the kit is built.',
      },
      {
        type: 'paragraph',
        text: 'The five-step clock looks like this on a standard identity job:',
      },
      {
        type: 'list',
        items: [
          'Days 1–2 — discovery call and moodboard',
          'Days 3–5 — 2–3 concepts, then 24–48 hour revision turns',
          'Days 6–7 — final file pack (print + digital)',
        ],
      },
      {
        type: 'paragraph',
        text: 'Social templates on an existing logo often ship closer to 48 hours after the first draft is approved. Timelines start when the brief and existing assets are in. Flag festival or launch dates on the kickoff call so we reverse-plan.',
      },
    ],
    schemaText:
      'Brand Identity is typically 5–7 working days. Social media graphics and marketing/print materials are typically 3–5 working days. A full Brand + Marketing Bundle is scoped on the brief — often 8–12 working days because identity is locked before the kit is built. Day 1 is discovery, Days 1–2 the moodboard, concepts in the next 2–3 days, then 24–48 hour revision turns, then the file pack. Social templates for an existing logo often ship closer to 48 hours once the first draft is approved. Timelines start when the brief and any existing assets (logo, colors, photos) are in. Festival or launch dates should be flagged on the kickoff call so we reverse-plan.',
  },
  {
    id: 6,
    question: 'Can you design in Bangla language?',
    blocks: [
      {
        type: 'paragraph',
        text: 'Yes. We design proper Bangla typography and bilingual layouts — not English files with a Bangla font dropped in at the end. That includes logos with a Bangla lockup, menus, packaging, property brochures, and social posts that mix Bangla headlines with English product names.',
      },
      {
        type: 'paragraph',
        text: 'What “proper” means in the files:',
      },
      {
        type: 'list',
        items: [
          'A Bangla-capable headline and body pair, checked for conjuncts and line-height',
          'Both scripts on the same grid so neither looks like an afterthought',
          'Print and social crops tested in both languages before export',
        ],
      },
      {
        type: 'paragraph',
        text: 'Tell us the language mix on Day 1. Copy should be final before layout; late Bangla text swaps are a revision round because line breaks change.',
      },
    ],
    schemaText:
      'Yes. We design proper Bangla typography and bilingual layouts — not English files with a Bangla font dropped in at the end. That covers logos with Bangla lockups, menus, packaging, property brochures, and Facebook/Instagram posts that mix Bangla headlines with English product names. We pair a Bangla-capable headline and body font, check line-height and conjuncts, and test both scripts on the same grid so neither looks like an afterthought. Tell us the language mix on Day 1. Copy should be final before layout; late text swaps in Bangla are treated as a revision round because line breaks change.',
  },
  {
    id: 7,
    question: 'Do you provide print-ready files for the printing press?',
    blocks: [
      {
        type: 'paragraph',
        text: 'Yes. Print jobs are built in CMYK, 300 DPI, with bleed (usually 3 mm) and safe margins, then exported as a press-ready PDF — the file you can hand to any press in Dhaka without a designer standing there.',
      },
      {
        type: 'paragraph',
        text: 'This is the default setup for:',
      },
      {
        type: 'list',
        items: [
          'Business cards, letterheads, flyers, posters, and brochures',
          'Menus, catalogs, and site / showroom signage',
          'Packaging and labels, including die-line files for the vendor',
        ],
      },
      {
        type: 'paragraph',
        text: 'Digital RGB exports are delivered separately so screen colors stay accurate. Send your vendor’s spec (size, paper, finish) in Step 1 and we build to it. Print PDFs sit in the Print Ready folder on delivery day, with EPS for vendors who still ask for it.',
      },
    ],
    schemaText:
      'Yes. Print jobs are built in CMYK, 300 DPI, with bleed (usually 3 mm) and safe margins, then exported as press-ready PDF — the file you can hand to any press in Dhaka without a designer standing there. Business cards, letterheads, flyers, brochures, menus, catalogs, signage, and packaging die-lines are set up this way. Digital RGB exports are delivered separately so screen colors stay accurate. If you already have a vendor, send their spec (size, paper, special finish) during Step 1 and we build to it. Print PDFs go in the Print Ready folder on delivery day, alongside EPS for vendors who still ask for it.',
  },
  {
    id: 8,
    question: 'I already have a logo — can you just do social media graphics?',
    blocks: [
      {
        type: 'paragraph',
        text: 'Yes. Brand Identity, Social Media Graphics, and Marketing Materials are all available as standalone projects. If your logo and colors already work, we start from those assets and build a reusable template system rather than redrawing the brand.',
      },
      {
        type: 'paragraph',
        text: 'The Social Media Design package is built for that exact case:',
      },
      {
        type: 'list',
        items: [
          'Post, story, highlight, and cover templates in Canva or PSD',
          '3–5 working days, 1–2 revision rounds',
          'First draft often within ~48 hours once we have the logo files',
        ],
      },
      {
        type: 'paragraph',
        text: 'Send AI / SVG / PNG of the mark, hex codes, and 3–5 sample captions or offers on Day 1. If the existing logo is only a low-res JPG, we will say so on the kickoff call and quote a vector redraw instead of guessing.',
      },
    ],
    schemaText:
      'Yes. Brand Identity, Social Media Graphics, and Marketing Materials are all available as standalone projects. If your logo and colors already work, we start from those assets and build a reusable template system — posts, stories, highlight icons, covers — in Canva or PSD. That is the Social Media Design package: 3–5 working days, 1–2 revision rounds, average first-draft turnaround around 48 hours after we have the logo files. Send AI/SVG/PNG of the mark, hex codes, and 3–5 sample captions or offers on Day 1. If the existing logo is only a low-res JPG, we will say so on the kickoff call and quote a vector redraw instead of guessing.',
  },
];

/* ==========================================================================
   15. TESTIMONIALS (What Our Clients Say)
   ========================================================================== */
export const testimonialsData: TestimonialItem[] = [
  {
    id: 'nobin-fashion',
    name: 'Fahad Karim',
    role: 'Managing Director, Nobin Fashion',
    badge: 'Brand Identity',
    avatar: 'FK',
    avatarTheme: 'navy',
    quote:
      '“Nobin is premium everyday wear — the old logo looked like a generic clothing page. 10 Cent Agency built a full identity: wordmark, hang-tag icon, color, type. We had three real directions in the first week, picked one, and two revision rounds later the files were print-ready. Labels, lookbook, and Instagram finally look like the same brand.”',
  },
  {
    id: 'urbannest-living',
    name: 'Tawhid Rahman',
    role: 'Founder, UrbanNest Living',
    badge: 'Social + Brand Kit',
    avatar: 'TR',
    avatarTheme: 'blue',
    quote:
      '“UrbanNest sells curated furniture and décor for modern homes, so every post has to feel like a room, not a sale sticker. They kept our existing mark, built Canva templates, and delivered the kit in five working days. Covers, stories and product tiles now match. We produce weekly content in-house without breaking the look.”',
  },
  {
    id: 'aura-properties',
    name: 'Shafin Islam',
    role: 'Director, Aura Properties',
    badge: 'Brand + Marketing',
    avatar: 'SI',
    avatarTheme: 'deep',
    quote:
      '“Aura develops modern residential projects — brochures and site boards cannot look DIY. They designed the identity, then the launch brochure and signage in CMYK with proper bleed. The press took the PDF as-is. From brief to printed set was just over a week, and the bilingual lockup reads cleanly on a board from the road.”',
  },
];

// Connected Schema.org @graph generator
export function getGraphicDesignSchemaGraph() {
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
        '@id': 'https://www.10centagency.com/services/graphic-design#webpage',
        url: 'https://www.10centagency.com/services/graphic-design',
        name: 'Graphic Design Services in Bangladesh | 10 Cent Agency',
        description:
          'Logo design, brand identity, social media graphics & marketing materials for Bangladeshi businesses. Professional, affordable, fast delivery. Get a free quote.',
        inLanguage: 'en-BD',
        isPartOf: {
          '@id': 'https://www.10centagency.com/#website',
        },
        breadcrumb: {
          '@id': 'https://www.10centagency.com/services/graphic-design#breadcrumb',
        },
        about: {
          '@id': 'https://www.10centagency.com/services/graphic-design#service',
        },
        mainEntity: {
          '@id': 'https://www.10centagency.com/services/graphic-design#service',
        },
      },
      {
        '@type': 'Service',
        '@id': 'https://www.10centagency.com/services/graphic-design#service',
        name: 'Graphic Design Services',
        serviceType: 'Graphic Design',
        url: 'https://www.10centagency.com/services/graphic-design',
        description:
          '10 Cent Agency provides complete graphic design services including brand identity design, social media graphics, marketing materials, packaging, and presentation design for small and medium businesses in Bangladesh.',
        provider: {
          '@id': 'https://www.10centagency.com/#organization',
        },
        mainEntityOfPage: {
          '@id': 'https://www.10centagency.com/services/graphic-design#webpage',
        },
        areaServed: {
          '@type': 'Country',
          name: 'Bangladesh',
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://www.10centagency.com/services/graphic-design#breadcrumb',
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
            name: 'Graphic Design',
            item: 'https://www.10centagency.com/services/graphic-design',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://www.10centagency.com/services/graphic-design#faq',
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

