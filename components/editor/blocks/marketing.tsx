import { Node } from '@tiptap/core'
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
import { Megaphone, BarChart3, MessageSquareQuote, HelpCircle, Tags, ListOrdered, Grid3x3, Users } from 'lucide-react'
import type { BlockDefinition } from '../types'
import { cx, jsonAttr, mergeAttributes, suppress } from './helpers'

/* ══════════════════════════════════════════════════════════════════════════
 * CTA
 * ═════════════════════════════════════════════════════════════════════════*/
const CTA_STYLES: Record<string, string> = {
  gradient: 'bg-gradient-to-r from-brand-navy to-brand-blue text-white',
  light: 'bg-brand-bgAlt text-brand-textDark border border-brand-border',
  dark: 'bg-brand-navy text-white',
  outline: 'bg-white text-brand-textDark border-2 border-brand-navy',
}

const CtaView = ({ node, selected }: { node: any; selected: boolean }) => {
  const { title, body, buttonLabel, buttonUrl, variant, align } = node.attrs
  const alignCls = align === 'center' ? 'items-center text-center' : align === 'right' ? 'items-end text-right' : 'items-start text-left'
  return (
    <NodeViewWrapper data-block="cta" className={cx('my-2', selected && 'rounded-lg ring-2 ring-brand-blue ring-offset-2')} data-drag-handle>
      <div className={cx('flex flex-col gap-3 rounded-2xl px-6 py-8', CTA_STYLES[variant] ?? CTA_STYLES.gradient, alignCls)}>
        {title && <h3 className="text-2xl font-bold leading-tight">{title}</h3>}
        {body && <p className={cx('max-w-xl text-sm leading-relaxed', variant === 'light' || variant === 'outline' ? 'text-brand-textMid' : 'text-white/80')}>{body}</p>}
        {buttonLabel && (
          <a
            href={buttonUrl || '#'}
            className={cx(
              'mt-1 inline-flex rounded-lg px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90',
              variant === 'light' || variant === 'outline' ? 'bg-brand-blue text-white' : 'bg-white text-brand-navy',
            )}
          >
            {buttonLabel}
          </a>
        )}
      </div>
    </NodeViewWrapper>
  )
}

const CtaNode = Node.create({
  name: 'ctaBlock',
  group: 'block',
  draggable: true,
  addAttributes() {
    return {
      title: { default: 'Ready to grow your business?', renderHTML: suppress },
      body: { default: '', renderHTML: suppress },
      buttonLabel: { default: 'Get a free quote', renderHTML: suppress },
      buttonUrl: { default: '', renderHTML: suppress },
      variant: { default: 'gradient', renderHTML: suppress },
      align: { default: 'center', renderHTML: suppress },
    }
  },
  parseHTML() {
    return [{ tag: 'div[data-block="cta"]' }]
  },
  renderHTML({ node, HTMLAttributes }) {
    const { title, body, buttonLabel, buttonUrl, variant, align } = node.attrs
    const children: any[] = []
    if (title) children.push(['h3', { class: 'text-2xl font-bold leading-tight' }, title])
    if (body) children.push(['p', { class: 'max-w-xl text-sm leading-relaxed opacity-80' }, body])
    if (buttonLabel) {
      children.push([
        'a',
        {
          href: buttonUrl || '#',
          class: `mt-3 inline-block rounded-lg px-5 py-2.5 text-sm font-semibold ${variant === 'light' || variant === 'outline' ? 'bg-blue-600 text-white' : 'bg-white text-slate-900'}`,
        },
        buttonLabel,
      ])
    }
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-block': 'cta',
        class: `my-6 flex flex-col gap-3 rounded-2xl px-6 py-8 ${CTA_STYLES[variant] ?? CTA_STYLES.gradient} ${align === 'center' ? 'items-center text-center' : align === 'right' ? 'items-end text-right' : 'items-start text-left'}`,
      }),
      ...children,
    ]
  },
  addNodeView() {
    return ReactNodeViewRenderer(CtaView)
  },
})

export const ctaBlock: BlockDefinition = {
  name: 'ctaBlock',
  title: 'Call to Action',
  description: 'Conversion banner with button',
  category: 'marketing',
  icon: Megaphone,
  keywords: ['cta', 'banner', 'button', 'convert', 'lead'],
  node: CtaNode,
  defaults: {
    title: 'Ready to grow your business?',
    body: 'Book a free 30-minute strategy call with our team.',
    buttonLabel: 'Get a free quote',
    buttonUrl: '',
    variant: 'gradient',
    align: 'center',
  },
  options: [
    { key: 'title', label: 'Headline', type: 'text' },
    { key: 'body', label: 'Supporting text', type: 'textarea', rows: 3 },
    { key: 'buttonLabel', label: 'Button label', type: 'text' },
    { key: 'buttonUrl', label: 'Button URL', type: 'url' },
    {
      key: 'variant',
      label: 'Style',
      type: 'segmented',
      choices: [
        { label: 'Gradient', value: 'gradient' },
        { label: 'Dark', value: 'dark' },
        { label: 'Light', value: 'light' },
        { label: 'Outline', value: 'outline' },
      ],
    },
    {
      key: 'align',
      label: 'Alignment',
      type: 'segmented',
      choices: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
  ],
}

/* ══════════════════════════════════════════════════════════════════════════
 * STATS / COUNTERS
 * ═════════════════════════════════════════════════════════════════════════*/
const StatsView = ({ node, selected }: { node: any; selected: boolean }) => {
  const { items, columns, variant } = node.attrs
  const dark = variant === 'dark'
  return (
    <NodeViewWrapper data-block="stats" className={cx('my-2', selected && 'rounded-lg ring-2 ring-brand-blue ring-offset-2')} data-drag-handle>
      <div
        className={cx('grid gap-6 rounded-2xl px-6 py-8', dark ? 'bg-brand-navy text-white' : 'bg-brand-bgAlt text-brand-textDark border border-brand-border')}
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))` }}
      >
        {(items as { value: string; label: string; suffix: string }[]).map((s, i) => (
          <div key={i} className="text-center">
            <p className="text-3xl font-extrabold">
              {s.value}
              {s.suffix && <span className="text-brand-blue">{s.suffix}</span>}
            </p>
            <p className={cx('mt-1 text-xs font-medium', dark ? 'text-white/60' : 'text-brand-textMid')}>{s.label}</p>
          </div>
        ))}
      </div>
    </NodeViewWrapper>
  )
}

const StatsNode = Node.create({
  name: 'statsBlock',
  group: 'block',
  draggable: true,
  addAttributes() {
    return {
      items: jsonAttr([
        { value: '250', label: 'Projects delivered', suffix: '+' },
        { value: '98', label: 'Client retention', suffix: '%' },
        { value: '12', label: 'Years in business', suffix: '' },
      ]),
      columns: { default: 3, renderHTML: suppress },
      variant: { default: 'light', renderHTML: suppress },
    }
  },
  parseHTML() {
    return [{ tag: 'div[data-block="stats"]' }]
  },
  renderHTML({ node, HTMLAttributes }) {
    const { items, columns, variant } = node.attrs
    const dark = variant === 'dark'
    const cells = (items as any[]).map((s) => [
      'div',
      { class: 'text-center' },
      ['p', { class: 'text-3xl font-extrabold' }, `${s.value}${s.suffix ? s.suffix : ''}`],
      ['p', { class: `mt-1 text-xs font-medium ${dark ? 'text-white/60' : 'text-slate-500'}` }, s.label],
    ])
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-block': 'stats',
        class: `my-6 grid gap-6 rounded-2xl px-6 py-8 ${dark ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900 border border-slate-200'}`,
        style: `grid-template-columns:repeat(${columns},minmax(0,1fr))`,
      }),
      ...cells,
    ]
  },
  addNodeView() {
    return ReactNodeViewRenderer(StatsView)
  },
})

export const statsBlock: BlockDefinition = {
  name: 'statsBlock',
  title: 'Stats / Counters',
  description: 'KPI numbers row',
  category: 'marketing',
  icon: BarChart3,
  keywords: ['stats', 'kpi', 'numbers', 'counter', 'metrics'],
  node: StatsNode,
  defaults: {
    items: [
      { value: '250', label: 'Projects delivered', suffix: '+' },
      { value: '98', label: 'Client retention', suffix: '%' },
      { value: '12', label: 'Years in business', suffix: '' },
    ],
    columns: 3,
    variant: 'light',
  },
  options: [
    {
      key: 'columns',
      label: 'Columns',
      type: 'segmented',
      choices: [
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
      ],
    },
    {
      key: 'variant',
      label: 'Style',
      type: 'segmented',
      choices: [
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
      ],
    },
    {
      key: 'items',
      label: 'Stats',
      type: 'list',
      itemLabel: 'Stat',
      max: 6,
      defaultItem: { value: '0', label: 'New stat', suffix: '' },
      fields: [
        { key: 'value', label: 'Value', type: 'text' },
        { key: 'suffix', label: 'Suffix', type: 'text' },
        { key: 'label', label: 'Label', type: 'text' },
      ],
    },
  ],
}

/* ══════════════════════════════════════════════════════════════════════════
 * TESTIMONIAL
 * ═════════════════════════════════════════════════════════════════════════*/
const TestimonialView = ({ node, selected }: { node: any; selected: boolean }) => {
  const { quote, author, role, avatar, rating, variant } = node.attrs
  const dark = variant === 'dark'
  return (
    <NodeViewWrapper data-block="testimonial" className={cx('my-2', selected && 'rounded-lg ring-2 ring-brand-blue ring-offset-2')} data-drag-handle>
      <figure className={cx('rounded-2xl px-6 py-7', dark ? 'bg-brand-navy text-white' : 'bg-white text-brand-textDark border border-brand-border shadow-sm')}>
        {rating > 0 && <p className="mb-3 text-amber-400">{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</p>}
        <blockquote className={cx('text-lg leading-relaxed', dark ? 'text-white' : 'text-brand-textDark')}>"{quote}"</blockquote>
        <figcaption className="mt-5 flex items-center gap-3">
          {avatar ? (
            <img src={avatar} alt={author} className="h-11 w-11 rounded-full object-cover" />
          ) : (
            <div className={cx('flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold', dark ? 'bg-white/15 text-white' : 'bg-brand-blue/10 text-brand-blue')}>
              {(author || 'A').slice(0, 1).toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold">{author}</p>
            {role && <p className={cx('text-xs', dark ? 'text-white/60' : 'text-brand-textMid')}>{role}</p>}
          </div>
        </figcaption>
      </figure>
    </NodeViewWrapper>
  )
}

const TestimonialNode = Node.create({
  name: 'testimonialBlock',
  group: 'block',
  draggable: true,
  addAttributes() {
    return {
      quote: { default: 'They doubled our qualified leads in 90 days.', renderHTML: suppress },
      author: { default: 'Jane Doe', renderHTML: suppress },
      role: { default: 'Marketing Director', renderHTML: suppress },
      avatar: { default: '', renderHTML: suppress },
      rating: { default: 5, renderHTML: suppress },
      variant: { default: 'light', renderHTML: suppress },
    }
  },
  parseHTML() {
    return [{ tag: 'figure[data-block="testimonial"]' }]
  },
  renderHTML({ node, HTMLAttributes }) {
    const { quote, author, role, avatar, rating, variant } = node.attrs
    const dark = variant === 'dark'
    return [
      'figure',
      mergeAttributes(HTMLAttributes, {
        'data-block': 'testimonial',
        class: `my-6 rounded-2xl px-6 py-7 ${dark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900 border border-slate-200'}`,
      }),
      rating ? ['p', { class: 'mb-3 text-amber-400' }, `${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}`] : ['span', { class: 'hidden' }],
      ['blockquote', { class: 'text-lg leading-relaxed' }, `"${quote}"`],
      [
        'figcaption',
        { class: 'mt-5 flex items-center gap-3' },
        avatar
          ? ['img', { src: avatar, alt: author, class: 'h-11 w-11 rounded-full object-cover' }]
          : ['div', { class: `flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold ${dark ? 'bg-white/15' : 'bg-blue-50 text-blue-600'}` }, (author || 'A').slice(0, 1).toUpperCase()],
        ['div', {}, ['p', { class: 'text-sm font-semibold' }, author], role ? ['p', { class: `text-xs ${dark ? 'text-white/60' : 'text-slate-500'}` }, role] : ['span', {}]],
      ],
    ]
  },
  addNodeView() {
    return ReactNodeViewRenderer(TestimonialView)
  },
})

export const testimonialBlock: BlockDefinition = {
  name: 'testimonialBlock',
  title: 'Testimonial',
  description: 'Client quote with rating',
  category: 'marketing',
  icon: MessageSquareQuote,
  keywords: ['testimonial', 'quote', 'review', 'client'],
  node: TestimonialNode,
  defaults: {
    quote: 'They doubled our qualified leads in 90 days.',
    author: 'Jane Doe',
    role: 'Marketing Director',
    avatar: '',
    rating: 5,
    variant: 'light',
  },
  options: [
    { key: 'quote', label: 'Quote', type: 'textarea', rows: 3 },
    { key: 'author', label: 'Author', type: 'text' },
    { key: 'role', label: 'Role / Company', type: 'text' },
    { key: 'avatar', label: 'Avatar URL', type: 'url' },
    { key: 'rating', label: 'Rating', type: 'range', min: 0, max: 5, step: 1 },
    {
      key: 'variant',
      label: 'Style',
      type: 'segmented',
      choices: [
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
      ],
    },
  ],
}

/* ══════════════════════════════════════════════════════════════════════════
 * FAQ (accordion)
 * ═════════════════════════════════════════════════════════════════════════*/
const FaqView = ({ node, selected }: { node: any; selected: boolean }) => {
  const { title, items, openFirst } = node.attrs
  return (
    <NodeViewWrapper data-block="faq" className={cx('my-2', selected && 'rounded-lg ring-2 ring-brand-blue ring-offset-2')} data-drag-handle>
      <div className="rounded-2xl border border-brand-border bg-white p-6">
        {title && <h3 className="mb-4 text-lg font-bold text-brand-textDark">{title}</h3>}
        <div className="divide-y divide-brand-border">
          {(items as { q: string; a: string }[]).map((it, i) => (
            <details key={i} className="group py-3" open={openFirst && i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-brand-textDark">
                {it.q || `Question ${i + 1}`}
                <span className="text-brand-blue transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-2 pr-8 text-sm leading-relaxed text-brand-textMid">{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </NodeViewWrapper>
  )
}

const FaqNode = Node.create({
  name: 'faqBlock',
  group: 'block',
  draggable: true,
  addAttributes() {
    return {
      title: { default: 'Frequently asked questions', renderHTML: suppress },
      items: jsonAttr([
        { q: 'How long does a project take?', a: 'Most engagements run 4–8 weeks from kickoff to launch.' },
        { q: 'Do you work with international clients?', a: 'Yes — we work across EU, UK, US and APAC time zones.' },
      ]),
      openFirst: { default: true, renderHTML: suppress },
    }
  },
  parseHTML() {
    return [{ tag: 'div[data-block="faq"]' }]
  },
  renderHTML({ node, HTMLAttributes }) {
    const { title, items, openFirst } = node.attrs
    const rows = (items as { q: string; a: string }[]).map((it, i) => [
      'details',
      { class: 'border-t border-slate-200 py-3', ...(openFirst && i === 0 ? { open: 'open' } : {}) },
      ['summary', { class: 'flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-slate-900' }, it.q],
      ['p', { class: 'mt-2 pr-8 text-sm leading-relaxed text-slate-500' }, it.a],
    ])
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-block': 'faq', class: 'my-6 rounded-2xl border border-slate-200 bg-white p-6' }),
      title ? ['h3', { class: 'mb-4 text-lg font-bold text-slate-900' }, title] : ['span', { class: 'hidden' }],
      ['div', {}, ...rows],
    ]
  },
  addNodeView() {
    return ReactNodeViewRenderer(FaqView)
  },
})

export const faqBlock: BlockDefinition = {
  name: 'faqBlock',
  title: 'FAQ',
  description: 'Accordion questions & answers',
  category: 'marketing',
  icon: HelpCircle,
  keywords: ['faq', 'accordion', 'questions', 'answers'],
  node: FaqNode,
  defaults: {
    title: 'Frequently asked questions',
    items: [
      { q: 'How long does a project take?', a: 'Most engagements run 4–8 weeks from kickoff to launch.' },
      { q: 'Do you work with international clients?', a: 'Yes — we work across EU, UK, US and APAC time zones.' },
    ],
    openFirst: true,
  },
  options: [
    { key: 'title', label: 'Section title', type: 'text' },
    { key: 'openFirst', label: 'Open first item', type: 'toggle' },
    {
      key: 'items',
      label: 'Questions',
      type: 'list',
      itemLabel: 'Q&A',
      max: 20,
      defaultItem: { q: 'New question?', a: 'Answer goes here.' },
      fields: [
        { key: 'q', label: 'Question', type: 'text' },
        { key: 'a', label: 'Answer', type: 'textarea', rows: 3 },
      ],
    },
  ],
}


/* ══════════════════════════════════════════════════════════════════════════
 * PRICING TABLE
 * ═════════════════════════════════════════════════════════════════════════*/
const PricingView = ({ node, selected }: { node: any; selected: boolean }) => {
  const { title, subtitle, plans, columns } = node.attrs
  return (
    <NodeViewWrapper data-block="pricing" className={cx('my-2', selected && 'ring-2 ring-brand-blue ring-offset-2 rounded-lg')} data-drag-handle>
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        {title && <h3 className="text-center text-2xl font-bold text-slate-900">{title}</h3>}
        {subtitle && <p className="mb-6 mt-1 text-center text-sm text-slate-500">{subtitle}</p>}
        <div className="grid gap-5" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))` }}>
          {(plans as any[]).map((p: any, i: number) => (
            <div
              key={i}
              className={cx(
                'flex flex-col rounded-2xl border p-5',
                p.highlight ? 'border-blue-600 bg-blue-50/60 shadow-md' : 'border-slate-200 bg-white',
              )}
            >
              <p className="text-sm font-semibold text-slate-900">{p.name}</p>
              <p className="mt-2 text-3xl font-extrabold text-slate-900">
                {p.price}
                {p.period && <span className="text-sm font-medium text-slate-400">{p.period}</span>}
              </p>
              <ul className="mt-4 flex-1 space-y-1.5 text-sm text-slate-600">
                {String(p.features || '')
                  .split('\n')
                  .filter(Boolean)
                  .map((f: string, j: number) => (
                    <li key={j} className="flex gap-2">
                      <span className="text-blue-600">✓</span>
                      {f}
                    </li>
                  ))}
              </ul>
              {p.ctaLabel && (
                <a
                  href={p.ctaUrl || '#'}
                  className={cx(
                    'mt-5 inline-flex justify-center rounded-lg px-4 py-2 text-sm font-semibold',
                    p.highlight ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white',
                  )}
                >
                  {p.ctaLabel}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </NodeViewWrapper>
  )
}

const PricingNode = Node.create({
  name: 'pricingBlock',
  group: 'block',
  draggable: true,
  addAttributes() {
    return {
      title: { default: 'Pricing', renderHTML: suppress },
      subtitle: { default: '', renderHTML: suppress },
      plans: jsonAttr([
        { name: 'Starter', price: '$490', period: '/mo', features: 'Audit & strategy call\nMonthly reporting\nEmail support', highlight: false, ctaLabel: 'Get started', ctaUrl: '' },
        { name: 'Growth', price: '$1,490', period: '/mo', features: 'Everything in Starter\nPaid ads management\nLanding pages\nBi-weekly calls', highlight: true, ctaLabel: 'Get started', ctaUrl: '' },
      ]),
      columns: { default: 2, renderHTML: suppress },
    }
  },
  parseHTML() { return [{ tag: 'div[data-block="pricing"]' }] },
  renderHTML({ node, HTMLAttributes }) {
    const { title, subtitle, plans, columns } = node.attrs
    const cards = (plans as any[]).map((p) => [
      'div',
      { class: `flex flex-col rounded-2xl border p-5 ${p.highlight ? 'border-blue-600 bg-blue-50/60' : 'border-slate-200 bg-white'}` },
      ['p', { class: 'text-sm font-semibold text-slate-900' }, p.name],
      ['p', { class: 'mt-2 text-3xl font-extrabold text-slate-900' }, `${p.price}${p.period ? p.period : ''}`],
      [
        'ul',
        { class: 'mt-4 flex-1 space-y-1 text-sm text-slate-600' },
        ...String(p.features || '').split('\n').filter(Boolean).map((f) => ['li', { class: 'flex gap-2' }, ['span', { class: 'text-blue-600' }, '✓'], f]),
      ],
      p.ctaLabel
        ? ['a', { href: p.ctaUrl || '#', class: `mt-5 inline-flex justify-center rounded-lg px-4 py-2 text-sm font-semibold ${p.highlight ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white'}` }, p.ctaLabel]
        : ['span', { class: 'hidden' }],
    ])
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-block': 'pricing', class: 'my-6 rounded-2xl border border-slate-200 bg-white p-6' }),
      title ? ['h3', { class: 'text-center text-2xl font-bold text-slate-900' }, title] : ['span', { class: 'hidden' }],
      subtitle ? ['p', { class: 'mb-6 mt-1 text-center text-sm text-slate-500' }, subtitle] : ['span', { class: 'hidden' }],
      ['div', { class: 'grid gap-5', style: `grid-template-columns:repeat(${columns},minmax(0,1fr))` }, ...cards],
    ]
  },
  addNodeView() { return ReactNodeViewRenderer(PricingView) },
})

export const pricingBlock: BlockDefinition = {
  name: 'pricingBlock',
  title: 'Pricing Table',
  description: 'Plan comparison cards',
  category: 'marketing',
  icon: Tags,
  keywords: ['pricing', 'plans', 'packages', 'price', 'tiers'],
  node: PricingNode,
  defaults: {
    title: 'Pricing',
    subtitle: '',
    plans: [
      { name: 'Starter', price: '$490', period: '/mo', features: 'Audit & strategy call\nMonthly reporting\nEmail support', highlight: false, ctaLabel: 'Get started', ctaUrl: '' },
      { name: 'Growth', price: '$1,490', period: '/mo', features: 'Everything in Starter\nPaid ads management\nLanding pages\nBi-weekly calls', highlight: true, ctaLabel: 'Get started', ctaUrl: '' },
    ],
    columns: 2,
  },
  options: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'subtitle', label: 'Subtitle', type: 'text' },
    {
      key: 'columns',
      label: 'Columns',
      type: 'segmented',
      choices: [
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
      ],
    },
    {
      key: 'plans',
      label: 'Plans',
      type: 'list',
      itemLabel: 'Plan',
      max: 4,
      defaultItem: { name: 'New plan', price: '$0', period: '/mo', features: 'Feature one\nFeature two', highlight: false, ctaLabel: 'Get started', ctaUrl: '' },
      fields: [
        { key: 'name', label: 'Plan name', type: 'text' },
        { key: 'price', label: 'Price', type: 'text' },
        { key: 'period', label: 'Period', type: 'text' },
        { key: 'features', label: 'Features (প্রতি লাইনে একটা)', type: 'textarea', rows: 4 },
        { key: 'ctaLabel', label: 'Button text', type: 'text' },
        { key: 'ctaUrl', label: 'Button URL', type: 'url' },
        { key: 'highlight', label: 'Highlight this plan', type: 'toggle' },
      ],
    },
  ],
}

/* ══════════════════════════════════════════════════════════════════════════
 * TIMELINE / PROCESS
 * ═════════════════════════════════════════════════════════════════════════*/
const TimelineView = ({ node, selected }: { node: any; selected: boolean }) => {
  const { title, steps } = node.attrs
  return (
    <NodeViewWrapper data-block="timeline" className={cx('my-2', selected && 'ring-2 ring-brand-blue ring-offset-2 rounded-lg')} data-drag-handle>
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        {title && <h3 className="mb-5 text-lg font-bold text-slate-900">{title}</h3>}
        <ol className="relative space-y-6 border-l border-slate-200 pl-6">
          {(steps as any[]).map((s: any, i: number) => (
            <li key={i} className="relative">
              <span className="absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                {i + 1}
              </span>
              {s.badge && <span className="mb-1 inline-block rounded bg-blue-50 px-2 py-0.5 text-[10px] font-semibold uppercase text-blue-700">{s.badge}</span>}
              <p className="text-sm font-semibold text-slate-900">{s.title}</p>
              {s.text && <p className="mt-1 text-sm text-slate-500">{s.text}</p>}
            </li>
          ))}
        </ol>
      </div>
    </NodeViewWrapper>
  )
}

const TimelineNode = Node.create({
  name: 'timelineBlock',
  group: 'block',
  draggable: true,
  addAttributes() {
    return {
      title: { default: 'How we work', renderHTML: suppress },
      steps: jsonAttr([
        { badge: 'Week 1', title: 'Discovery', text: 'Audit, research and goal setting.' },
        { badge: 'Week 2-4', title: 'Build', text: 'Design, develop and iterate.' },
        { badge: 'Week 5+', title: 'Scale', text: 'Optimise and report.' },
      ]),
    }
  },
  parseHTML() { return [{ tag: 'div[data-block="timeline"]' }] },
  renderHTML({ node, HTMLAttributes }) {
    const { title, steps } = node.attrs
    const items = (steps as any[]).map((s, i) => [
      'li',
      { class: 'relative' },
      ['span', { class: 'absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white' }, String(i + 1)],
      s.badge ? ['span', { class: 'mb-1 inline-block rounded bg-blue-50 px-2 py-0.5 text-[10px] font-semibold uppercase text-blue-700' }, s.badge] : ['span', { class: 'hidden' }],
      ['p', { class: 'text-sm font-semibold text-slate-900' }, s.title],
      s.text ? ['p', { class: 'mt-1 text-sm text-slate-500' }, s.text] : ['span', { class: 'hidden' }],
    ])
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-block': 'timeline', class: 'my-6 rounded-2xl border border-slate-200 bg-white p-6' }),
      title ? ['h3', { class: 'mb-5 text-lg font-bold text-slate-900' }, title] : ['span', { class: 'hidden' }],
      ['ol', { class: 'relative space-y-6 border-l border-slate-200 pl-6' }, ...items],
    ]
  },
  addNodeView() { return ReactNodeViewRenderer(TimelineView) },
})

export const timelineBlock: BlockDefinition = {
  name: 'timelineBlock',
  title: 'Timeline / Process',
  description: 'Numbered step-by-step list',
  category: 'marketing',
  icon: ListOrdered,
  keywords: ['timeline', 'process', 'steps', 'roadmap', 'how we work'],
  node: TimelineNode,
  defaults: {
    title: 'How we work',
    steps: [
      { badge: 'Week 1', title: 'Discovery', text: 'Audit, research and goal setting.' },
      { badge: 'Week 2-4', title: 'Build', text: 'Design, develop and iterate.' },
      { badge: 'Week 5+', title: 'Scale', text: 'Optimise and report.' },
    ],
  },
  options: [
    { key: 'title', label: 'Title', type: 'text' },
    {
      key: 'steps',
      label: 'Steps',
      type: 'list',
      itemLabel: 'Step',
      max: 12,
      defaultItem: { badge: '', title: 'New step', text: '' },
      fields: [
        { key: 'badge', label: 'Badge (e.g. Week 1)', type: 'text' },
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'text', label: 'Description', type: 'textarea', rows: 2 },
      ],
    },
  ],
}

/* ══════════════════════════════════════════════════════════════════════════
 * LOGO GRID
 * ═════════════════════════════════════════════════════════════════════════*/
const LogoGridView = ({ node, selected }: { node: any; selected: boolean }) => {
  const { title, logos, columns, grayscale } = node.attrs
  return (
    <NodeViewWrapper data-block="logo-grid" className={cx('my-2', selected && 'ring-2 ring-brand-blue ring-offset-2 rounded-lg')} data-drag-handle>
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        {title && <p className="mb-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>}
        <div className="grid items-center gap-6" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))` }}>
          {(logos as any[]).map((l: any, i: number) =>
            l.image ? (
              <img key={i} src={l.image} alt={l.name || ''} className={cx('mx-auto h-10 w-auto object-contain', grayscale && 'opacity-60 grayscale')} />
            ) : (
              <div key={i} className="mx-auto h-10 w-24 rounded bg-slate-100" />
            ),
          )}
        </div>
      </div>
    </NodeViewWrapper>
  )
}

const LogoGridNode = Node.create({
  name: 'logoGridBlock',
  group: 'block',
  draggable: true,
  addAttributes() {
    return {
      title: { default: 'Trusted by', renderHTML: suppress },
      logos: jsonAttr([{ image: '', name: 'Client', url: '' }]),
      columns: { default: 4, renderHTML: suppress },
      grayscale: { default: true, renderHTML: suppress },
    }
  },
  parseHTML() { return [{ tag: 'div[data-block="logo-grid"]' }] },
  renderHTML({ node, HTMLAttributes }) {
    const { title, logos, columns, grayscale } = node.attrs
    const cells = (logos as any[]).map((l) => [
      'div',
      { class: 'flex justify-center' },
      l.image
        ? ['img', { src: l.image, alt: l.name || '', class: `h-10 w-auto object-contain ${grayscale ? 'opacity-60 grayscale' : ''}` }]
        : ['div', { class: 'h-10 w-24 rounded bg-slate-100' }],
    ])
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-block': 'logo-grid', class: 'my-6 rounded-2xl border border-slate-200 bg-white p-6' }),
      title ? ['p', { class: 'mb-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500' }, title] : ['span', { class: 'hidden' }],
      ['div', { class: 'grid items-center gap-6', style: `grid-template-columns:repeat(${columns},minmax(0,1fr))` }, ...cells],
    ]
  },
  addNodeView() { return ReactNodeViewRenderer(LogoGridView) },
})

export const logoGridBlock: BlockDefinition = {
  name: 'logoGridBlock',
  title: 'Logo Grid',
  description: 'Client / partner logos',
  category: 'marketing',
  icon: Grid3x3,
  keywords: ['logo', 'clients', 'partners', 'trusted', 'brands'],
  node: LogoGridNode,
  defaults: { title: 'Trusted by', logos: [{ image: '', name: 'Client', url: '' }], columns: 4, grayscale: true },
  options: [
    { key: 'title', label: 'Title', type: 'text' },
    {
      key: 'columns',
      label: 'Columns',
      type: 'segmented',
      choices: [
        { label: '3', value: '3' },
        { label: '4', value: '4' },
        { label: '5', value: '5' },
        { label: '6', value: '6' },
      ],
    },
    { key: 'grayscale', label: 'Grayscale', type: 'toggle' },
    {
      key: 'logos',
      label: 'Logos',
      type: 'list',
      itemLabel: 'Logo',
      max: 24,
      defaultItem: { image: '', name: 'Client', url: '' },
      fields: [
        { key: 'image', label: 'Logo URL', type: 'url' },
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'url', label: 'Website (optional)', type: 'url' },
      ],
    },
  ],
}

/* ══════════════════════════════════════════════════════════════════════════
 * TEAM
 * ═════════════════════════════════════════════════════════════════════════*/
const TeamView = ({ node, selected }: { node: any; selected: boolean }) => {
  const { title, members, columns } = node.attrs
  return (
    <NodeViewWrapper data-block="team" className={cx('my-2', selected && 'ring-2 ring-brand-blue ring-offset-2 rounded-lg')} data-drag-handle>
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        {title && <h3 className="mb-5 text-lg font-bold text-slate-900">{title}</h3>}
        <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))` }}>
          {(members as any[]).map((m: any, i: number) => (
            <div key={i} className="text-center">
              {m.photo ? (
                <img src={m.photo} alt={m.name} className="mx-auto h-24 w-24 rounded-full object-cover" />
              ) : (
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-50 text-xl font-bold text-blue-600">
                  {(m.name || 'A').slice(0, 1).toUpperCase()}
                </div>
              )}
              <p className="mt-3 text-sm font-semibold text-slate-900">{m.name}</p>
              {m.role && <p className="text-xs text-slate-500">{m.role}</p>}
              {m.bio && <p className="mt-2 text-xs leading-relaxed text-slate-500">{m.bio}</p>}
            </div>
          ))}
        </div>
      </div>
    </NodeViewWrapper>
  )
}

const TeamNode = Node.create({
  name: 'teamBlock',
  group: 'block',
  draggable: true,
  addAttributes() {
    return {
      title: { default: 'Our team', renderHTML: suppress },
      members: jsonAttr([{ name: 'Jane Doe', role: 'Founder', photo: '', bio: '' }]),
      columns: { default: 3, renderHTML: suppress },
    }
  },
  parseHTML() { return [{ tag: 'div[data-block="team"]' }] },
  renderHTML({ node, HTMLAttributes }) {
    const { title, members, columns } = node.attrs
    const cells = (members as any[]).map((m) => [
      'div',
      { class: 'text-center' },
      m.photo
        ? ['img', { src: m.photo, alt: m.name, class: 'mx-auto h-24 w-24 rounded-full object-cover' }]
        : ['div', { class: 'mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-50 text-xl font-bold text-blue-600' }, (m.name || 'A').slice(0, 1).toUpperCase()],
      ['p', { class: 'mt-3 text-sm font-semibold text-slate-900' }, m.name],
      m.role ? ['p', { class: 'text-xs text-slate-500' }, m.role] : ['span', { class: 'hidden' }],
      m.bio ? ['p', { class: 'mt-2 text-xs leading-relaxed text-slate-500' }, m.bio] : ['span', { class: 'hidden' }],
    ])
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-block': 'team', class: 'my-6 rounded-2xl border border-slate-200 bg-white p-6' }),
      title ? ['h3', { class: 'mb-5 text-lg font-bold text-slate-900' }, title] : ['span', { class: 'hidden' }],
      ['div', { class: 'grid gap-6', style: `grid-template-columns:repeat(${columns},minmax(0,1fr))` }, ...cells],
    ]
  },
  addNodeView() { return ReactNodeViewRenderer(TeamView) },
})

export const teamBlock: BlockDefinition = {
  name: 'teamBlock',
  title: 'Team',
  description: 'People / member profiles',
  category: 'marketing',
  icon: Users,
  keywords: ['team', 'people', 'members', 'staff', 'about'],
  node: TeamNode,
  defaults: { title: 'Our team', members: [{ name: 'Jane Doe', role: 'Founder', photo: '', bio: '' }], columns: 3 },
  options: [
    { key: 'title', label: 'Title', type: 'text' },
    {
      key: 'columns',
      label: 'Columns',
      type: 'segmented',
      choices: [
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
      ],
    },
    {
      key: 'members',
      label: 'Members',
      type: 'list',
      itemLabel: 'Member',
      max: 12,
      defaultItem: { name: 'New member', role: '', photo: '', bio: '' },
      fields: [
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'role', label: 'Role', type: 'text' },
        { key: 'photo', label: 'Photo URL', type: 'url' },
        { key: 'bio', label: 'Short bio', type: 'textarea', rows: 2 },
      ],
    },
  ],
}

export const marketingBlocks: BlockDefinition[] = [
  ctaBlock,
  statsBlock,
  testimonialBlock,
  faqBlock,
  pricingBlock,
  timelineBlock,
  logoGridBlock,
  teamBlock,
]
