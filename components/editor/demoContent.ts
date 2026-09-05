import { demoImage } from './blocks/helpers'

const img = (label: string, from: string, to: string) => demoImage(label, from, to)

export const demoDoc = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 2, textAlign: 'left' },
      content: [{ type: 'text', text: 'Northwind — Full Rebrand & Website' }],
    },
    {
      type: 'paragraph',
      attrs: { textAlign: 'left' },
      content: [
        { type: 'text', text: 'This page is editable. Try these: type ' },
        { type: 'text', marks: [{ type: 'code' }], text: '/' },
        { type: 'text', text: ' on an empty line for the slash menu, hover any block for the ' },
        { type: 'text', marks: [{ type: 'bold' }], text: '⋮⋮ handle' },
        { type: 'text', text: ', or select text for the formatting toolbar.' },
      ],
    },
    {
      type: 'imageBlock',
      attrs: {
        src: img('Homepage hero', '#0B1B3A', '#2563EB'),
        alt: 'Northwind homepage redesign',
        caption: 'Homepage — desktop view',
        align: 'center',
        width: 100,
        rounded: true,
        shadow: true,
      },
    },
    {
      type: 'columnsBlock',
      attrs: { template: '1fr 1fr', gap: 24, divider: false, verticalAlign: 'start' },
      content: [
        {
          type: 'columnBlock',
          attrs: { width: '1fr' },
          content: [
            {
              type: 'heading',
              attrs: { level: 3, textAlign: 'left' },
              content: [{ type: 'text', text: 'The challenge' }],
            },
            {
              type: 'paragraph',
              attrs: { textAlign: 'left' },
              content: [
                { type: 'text', text: 'Northwind had a dated identity and a site that converted at 0.4%.' },
              ],
            },
            {
              type: 'bulletList',
              content: [
                { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Brand felt inconsistent across markets' }] }] },
                { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'No clear conversion path' }] }] },
                { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Mobile bounce rate above 70%' }] }] },
              ],
            },
          ],
        },
        {
          type: 'columnBlock',
          attrs: { width: '1fr' },
          content: [
            {
              type: 'heading',
              attrs: { level: 3, textAlign: 'left' },
              content: [{ type: 'text', text: 'What we did' }],
            },
            {
              type: 'paragraph',
              attrs: { textAlign: 'left' },
              content: [{ type: 'text', text: 'Full identity refresh plus a conversion-focused site rebuild in 7 weeks.' }],
            },
            {
              type: 'bulletList',
              content: [
                { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Positioning & messaging workshop' }] }] },
                { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Design system + component library' }] }] },
                { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Next.js build with CMS' }] }] },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'statsBlock',
      attrs: {
        items: [
          { value: '312', label: 'Qualified leads / mo', suffix: '+' },
          { value: '2.4', label: 'Conversion rate', suffix: '%' },
          { value: '7', label: 'Weeks to launch', suffix: '' },
        ],
        columns: 3,
        variant: 'light',
      },
    },
    { type: 'dividerBlock', attrs: { variant: 'gradient', thickness: 2, width: 80, color: '#2563EB' } },
    {
      type: 'heading',
      attrs: { level: 3, textAlign: 'left' },
      content: [{ type: 'text', text: 'Before / After' }],
    },
    {
      type: 'beforeAfterBlock',
      attrs: {
        leftSrc: img('Old site', '#94A3B8', '#64748B'),
        rightSrc: img('New site', '#2563EB', '#0B1B3A'),
        leftLabel: 'Before',
        rightLabel: 'After',
        caption: 'Homepage redesign — same content, new system.',
      },
    },
    {
      type: 'galleryBlock',
      attrs: {
        images: [
          { src: img('Mobile 01', '#60A5FA', '#2563EB'), alt: 'Mobile screen 1' },
          { src: img('Mobile 02', '#818CF8', '#4F46E5'), alt: 'Mobile screen 2' },
          { src: img('Mobile 03', '#38BDF8', '#0284C7'), alt: 'Mobile screen 3' },
        ],
        columns: 3,
        gap: 12,
        rounded: true,
      },
    },
    {
      type: 'blockquote',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'The new site paid for itself inside two months. — Operations Lead, Northwind' },
          ],
        },
      ],
    },
    {
      type: 'testimonialBlock',
      attrs: {
        quote: 'They rebuilt our brand and our pipeline at the same time. Rare combination.',
        author: 'Sarah Ahmed',
        role: 'CMO, Northwind',
        avatar: '',
        rating: 5,
        variant: 'dark',
      },
    },
    {
      type: 'colorPaletteBlock',
      attrs: {
        title: 'Brand colors',
        colors: [
          { hex: '#0B1B3A', name: 'Navy' },
          { hex: '#2563EB', name: 'Primary' },
          { hex: '#60A5FA', name: 'Accent' },
          { hex: '#F1F5F9', name: 'Mist' },
        ],
        size: 64,
      },
    },
    {
      type: 'faqBlock',
      attrs: {
        title: 'Project FAQ',
        items: [
          { q: 'How long did it take?', a: 'Seven weeks from kickoff to launch.' },
          { q: 'Who owned the content?', a: 'Our team wrote and structured all copy.' },
        ],
        openFirst: true,
      },
    },
    {
      type: 'ctaBlock',
      attrs: {
        title: 'Want a result like this?',
        body: 'Book a free 30-minute strategy call and we will map your growth plan.',
        buttonLabel: 'Get a free quote',
        buttonUrl: '',
        variant: 'gradient',
        align: 'center',
      },
    },
    {
      type: 'fullImageBlock',
      attrs: {
        src: img('Wide banner', '#00346D', '#2F85F3'),
        alt: 'Full width banner',
        caption: '',
        height: 'md',
        linkUrl: '',
      },
    },
    {
      type: 'typographyBlock',
      attrs: {
        title: 'Typography',
        showMeta: true,
        fonts: [
          { name: 'Heading', sample: 'Grow your business', weight: '800', style: 'Bold', size: '' },
          { name: 'Body', sample: 'The quick brown fox jumps over the lazy dog', weight: '400', style: 'Regular', size: '' },
        ],
      },
    },
    {
      type: 'timelineBlock',
      attrs: {
        title: 'How we work',
        steps: [
          { badge: 'Week 1', title: 'Discovery', text: 'Audit, research and goal setting.' },
          { badge: 'Week 2–4', title: 'Build', text: 'Design, develop, iterate.' },
          { badge: 'Week 5+', title: 'Scale', text: 'Optimise and report.' },
        ],
      },
    },
    {
      type: 'pricingBlock',
      attrs: {
        title: 'Pricing',
        subtitle: 'No lock-in contracts',
        columns: 2,
        plans: [
          { name: 'Starter', price: '$490', period: '/mo', features: 'Audit & strategy\nMonthly reporting', highlight: false, ctaLabel: 'Get started', ctaUrl: '' },
          { name: 'Growth', price: '$1,490', period: '/mo', features: 'Everything in Starter\nPaid ads management\nLanding pages', highlight: true, ctaLabel: 'Get started', ctaUrl: '' },
        ],
      },
    },
    {
      type: 'buttonBlock',
      attrs: { label: 'Book a free call', url: '', style: 'primary', size: 'lg', align: 'center', fullWidth: false, newTab: false },
    },
    { type: 'paragraph', attrs: { textAlign: 'left' }, content: [] },
  ],
}
