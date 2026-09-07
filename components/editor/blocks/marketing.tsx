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
  const { title, body, buttonLabel, buttonUrl, variant, align, layout, bgImage, bgColor, button2Label, button2Url } = node.attrs
  const alignCls = align === 'center' ? 'items-center text-center' : align === 'right' ? 'items-end text-right' : 'items-start text-left'
  const hasCustom = Boolean(bgColor || bgImage)
  const btnCls = (primary: boolean) =>
    cx(
      'inline-flex rounded-lg px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90',
      primary
        ? hasCustom || (variant !== 'light' && variant !== 'outline')
          ? 'bg-white text-slate-900'
          : 'bg-brand-blue text-white'
        : 'border border-white/60 text-white',
    )
  return (
    <NodeViewWrapper data-block="cta" className={cx('my-2', selected && 'rounded-lg ring-2 ring-brand-blue ring-offset-2')} data-drag-handle>
      <div
        className={cx('relative overflow-hidden rounded-2xl px-6 py-8', !hasCustom && (CTA_STYLES[variant] ?? CTA_STYLES.gradient), hasCustom && 'text-white')}
        style={{
          backgroundColor: bgColor || undefined,
          backgroundImage: bgImage ? `url(${bgImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {bgImage && <div className="pointer-events-none absolute inset-0 bg-black/40" />}
        <div className={cx('relative z-10 flex gap-4', layout === 'row' ? 'flex-row items-center justify-between' : 'flex-col', alignCls)}>
          <div className="flex flex-col gap-3">
            {title && <h3 className="text-2xl font-bold leading-tight">{title}</h3>}
            {body && (
              <p className={cx('max-w-xl text-sm leading-relaxed', hasCustom ? 'text-white/85' : variant === 'light' || variant === 'outline' ? 'text-brand-textMid' : 'text-white/80')}>
                {body}
              </p>
            )}
          </div>
          {(buttonLabel || button2Label) && (
            <div className="flex flex-wrap gap-3">
              {buttonLabel && (
                <a href={buttonUrl || '#'} className={btnCls(true)}>{buttonLabel}</a>
              )}
              {button2Label && (
                <a href={button2Url || '#'} className={btnCls(false)}>{button2Label}</a>
              )}
            </div>
          )}
        </div>
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
      button2Label: { default: '', renderHTML: suppress },
      button2Url: { default: '', renderHTML: suppress },
      layout: { default: 'stack', renderHTML: suppress },
      bgImage: { default: '', renderHTML: suppress },
      bgColor: { default: '', renderHTML: suppress },
      variant: { default: 'gradient', renderHTML: suppress },
      align: { default: 'center', renderHTML: suppress },
    }
  },
  parseHTML() {
    return [{ tag: 'div[data-block="cta"]' }]
  },
  renderHTML({ node, HTMLAttributes }) {
    const { title, body, buttonLabel, buttonUrl, variant, align, layout, bgImage, bgColor, button2Label, button2Url } = node.attrs
    const hasCustom = Boolean(bgColor || bgImage)
    const alignCls = align === 'center' ? 'items-center text-center' : align === 'right' ? 'items-end text-right' : 'items-start text-left'
    const btnClass = (primary: boolean) =>
      `inline-block rounded-lg px-5 py-2.5 text-sm font-semibold ${primary ? (hasCustom || (variant !== 'light' && variant !== 'outline') ? 'bg-white text-slate-900' : 'bg-blue-600 text-white') : 'border border-white/60 text-white'}`
    const texts: any[] = []
    if (title) texts.push(['h3', { class: 'text-2xl font-bold leading-tight' }, title])
    if (body) texts.push(['p', { class: 'max-w-xl text-sm leading-relaxed opacity-80' }, body])
    const btns: any[] = []
    if (buttonLabel) btns.push(['a', { href: buttonUrl || '#', class: btnClass(true) }, buttonLabel])
    if (button2Label) btns.push(['a', { href: button2Url || '#', class: btnClass(false) }, button2Label])
    const bgStyle = [bgColor ? `background-color:${bgColor}` : '', bgImage ? `background-image:url(${bgImage});background-size:cover;background-position:center` : ''].filter(Boolean).join(';')
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-block': 'cta',
        class: cx('my-6 relative overflow-hidden rounded-2xl px-6 py-8', !hasCustom && (CTA_STYLES[variant] ?? CTA_STYLES.gradient), hasCustom && 'text-white'),
        ...(bgStyle ? { style: bgStyle } : {}),
      }),
      bgImage ? ['div', { class: 'pointer-events-none absolute inset-0 bg-black/40' }] : ['span', { class: 'hidden' }],
      [
        'div',
        { class: cx('relative z-10 flex gap-4', layout === 'row' ? 'flex-row items-center justify-between' : 'flex-col', alignCls) },
        ['div', { class: 'flex flex-col gap-3' }, ...(texts.length ? texts : [['span', { class: 'hidden' }]])],
        btns.length ? ['div', { class: 'flex flex-wrap gap-3' }, ...btns] : ['span', { class: 'hidden' }],
      ],
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
    layout: 'stack',
    bgImage: '',
    bgColor: '',
    button2Label: '',
    button2Url: '',
  },
  options: [
    { key: 'title', label: 'Headline', type: 'text' },
    { key: 'body', label: 'Supporting text', type: 'textarea', rows: 3 },
    { key: 'buttonLabel', label: 'Button label', type: 'text' },
    { key: 'buttonUrl', label: 'Button URL', type: 'url' },
    { key: 'button2Label', label: 'Second button label', type: 'text' },
    { key: 'button2Url', label: 'Second button URL', type: 'url' },
    {
      key: 'layout',
      label: 'Layout',
      type: 'segmented',
      choices: [
        { label: 'Stacked', value: 'stack' },
        { label: 'Text left / buttons right', value: 'row' },
      ],
    },
    { key: 'bgColor', label: 'Custom background colour', type: 'color' },
    { key: 'bgImage', label: 'Background image URL', type: 'url' },
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
  const { items, columns, variant, bgColor, textColor, dividers, padding } = node.attrs
  const dark = variant === 'dark'
  return (
    <NodeViewWrapper data-block="stats" className={cx('my-2', selected && 'rounded-lg ring-2 ring-brand-blue ring-offset-2')} data-drag-handle>
      <div
        className={cx('grid gap-6 rounded-2xl px-6 py-8', !bgColor && (dark ? 'bg-brand-navy text-white' : 'bg-brand-bgAlt text-brand-textDark border border-brand-border'), dividers && 'divide-x divide-slate-200')}
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))`,
          backgroundColor: bgColor || undefined,
          color: textColor || undefined,
          paddingTop: `${padding}px`,
          paddingBottom: `${padding}px`,
        }}
      >
        {(items as { value: string; label: string; suffix: string }[]).map((s, i) => (
          <div key={i} className="text-center">
            <p className="text-3xl font-extrabold">
              {s.value}
              {s.suffix && <span className="text-brand-blue">{s.suffix}</span>}
            </p>
            <p className="mt-1 text-xs font-medium opacity-70">{s.label}</p>
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
      bgColor: { default: '', renderHTML: suppress },
      textColor: { default: '', renderHTML: suppress },
      dividers: { default: false, renderHTML: suppress },
      padding: { default: 32, renderHTML: suppress },
    }
  },
  parseHTML() {
    return [{ tag: 'div[data-block="stats"]' }]
  },
  renderHTML({ node, HTMLAttributes }) {
    const { items, columns, variant, bgColor, textColor, dividers, padding } = node.attrs
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
        class: cx('my-6 grid gap-6 rounded-2xl px-6 py-8', !bgColor && (dark ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900 border border-slate-200'), dividers && 'divide-x divide-slate-200'),
        style: [
          `grid-template-columns:repeat(${columns},minmax(0,1fr))`,
          bgColor ? `background-color:${bgColor}` : '',
          textColor ? `color:${textColor}` : '',
          `padding-top:${padding}px;padding-bottom:${padding}px`,
        ].filter(Boolean).join(';'),
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
    bgColor: '',
    textColor: '',
    dividers: false,
    padding: 32,
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
    { key: 'bgColor', label: 'Custom background', type: 'color' },
    { key: 'textColor', label: 'Custom text colour', type: 'color' },
    { key: 'dividers', label: 'Dividers between columns', type: 'toggle' },
    { key: 'padding', label: 'Padding (px)', type: 'range', min: 8, max: 80, step: 4 },
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
      company: { default: '', renderHTML: suppress },
      logo: { default: '', renderHTML: suppress },
      avatarShape: { default: 'circle', renderHTML: suppress },
      bgColor: { default: '', renderHTML: suppress },
      align: { default: 'left', renderHTML: suppress },
    }
  },
  parseHTML() {
    return [{ tag: 'figure[data-block="testimonial"]' }]
  },
  renderHTML({ node, HTMLAttributes }) {
    const { quote, author, role, avatar, rating, variant, company, logo, avatarShape, bgColor, align } = node.attrs
    const dark = variant === 'dark'
    const shapeCls = avatarShape === 'square' ? 'rounded-lg' : 'rounded-full'
    return [
      'figure',
      mergeAttributes(HTMLAttributes, {
        'data-block': 'testimonial',
        class: cx('my-6 rounded-2xl px-6 py-7', !bgColor && (dark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900 border border-slate-200'), align === 'center' && 'text-center'),
        ...(bgColor ? { style: `background-color:${bgColor}` } : {}),
      }),
      rating ? ['p', { class: 'mb-3 text-amber-400' }, `${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}`] : ['span', { class: 'hidden' }],
      ['blockquote', { class: 'text-lg leading-relaxed' }, `"${quote}"`],
      [
        'figcaption',
        { class: 'mt-5 flex items-center gap-3' },
        avatar
          ? ['img', { src: avatar, alt: author, class: `h-11 w-11 object-cover ${shapeCls}` }]
          : ['div', { class: `flex h-11 w-11 items-center justify-center text-sm font-bold ${shapeCls} ${dark ? 'bg-white/15' : 'bg-blue-50 text-blue-600'}` }, (author || 'A').slice(0, 1).toUpperCase()],
        ['div', {},
          ['p', { class: 'text-sm font-semibold' }, author],
          role ? ['p', { class: 'text-xs opacity-70' }, role] : ['span', { class: 'hidden' }],
          company ? ['p', { class: 'text-xs font-medium opacity-80' }, company] : ['span', { class: 'hidden' }],
        ],
        logo ? ['img', { src: logo, alt: company || 'logo', class: 'ml-auto h-6 w-auto object-contain opacity-70' }] : ['span', { class: 'hidden' }],
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
    company: '',
    logo: '',
    avatarShape: 'circle',
    bgColor: '',
    align: 'left',
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
    { key: 'company', label: 'Company name', type: 'text' },
    { key: 'logo', label: 'Company logo URL', type: 'url' },
    {
      key: 'avatarShape',
      label: 'Avatar shape',
      type: 'segmented',
      choices: [
        { label: 'Circle', value: 'circle' },
        { label: 'Square', value: 'square' },
      ],
    },
    {
      key: 'align',
      label: 'Alignment',
      type: 'segmented',
      choices: [
        { label: 'Left', value: 'left' },
        { label: 'Centre', value: 'center' },
      ],
    },
    { key: 'bgColor', label: 'Custom background', type: 'color' },
  ],
}

/* ══════════════════════════════════════════════════════════════════════════
 * FAQ (accordion)
 * ═════════════════════════════════════════════════════════════════════════*/
const FaqView = ({ node, selected }: { node: any; selected: boolean }) => {
  const { title, items, openFirst, iconStyle, accordion, bgColor, columns } = node.attrs
  const icon = iconStyle === 'chevron' ? '⌄' : iconStyle === 'arrow' ? '↓' : '+'
  return (
    <NodeViewWrapper data-block="faq" className={cx('my-2', selected && 'rounded-lg ring-2 ring-brand-blue ring-offset-2')} data-drag-handle>
      <div
        className={cx('rounded-2xl border border-brand-border bg-white p-6')}
        style={bgColor ? { backgroundColor: bgColor } : undefined}
      >
        {title && <h3 className="mb-4 text-lg font-bold text-brand-textDark">{title}</h3>}
        <div className={cx(Number(columns) === 2 ? 'grid gap-x-8 sm:grid-cols-2' : 'divide-y divide-brand-border')}>
          {(items as { q: string; a: string }[]).map((it, i) => (
            <details key={i} className="group py-3" open={openFirst && i === 0} name={accordion ? 'faq-accordion' : undefined}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-brand-textDark">
                {it.q || `Question ${i + 1}`}
                <span className={cx('text-brand-blue transition-transform', iconStyle === 'plus' && 'group-open:rotate-45', iconStyle === 'chevron' && 'group-open:rotate-180')}>{icon}</span>
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
      iconStyle: { default: 'plus', renderHTML: suppress },
      accordion: { default: false, renderHTML: suppress },
      bgColor: { default: '', renderHTML: suppress },
      columns: { default: 1, renderHTML: suppress },
    }
  },
  parseHTML() {
    return [{ tag: 'div[data-block="faq"]' }]
  },
  renderHTML({ node, HTMLAttributes }) {
    const { title, items, openFirst, iconStyle, accordion, bgColor, columns } = node.attrs
    const icon = iconStyle === 'chevron' ? '⌄' : iconStyle === 'arrow' ? '↓' : '+'
    const rows = (items as { q: string; a: string }[]).map((it, i) => [
      'details',
      {
        class: 'border-t border-slate-200 py-3',
        ...(openFirst && i === 0 ? { open: 'open' } : {}),
        ...(accordion ? { name: 'faq-accordion' } : {}),
      },
      ['summary', { class: 'flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-slate-900' }, it.q, ['span', { class: 'text-blue-600' }, icon]],
      ['p', { class: 'mt-2 pr-8 text-sm leading-relaxed text-slate-500' }, it.a],
    ])
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-block': 'faq',
        class: 'my-6 rounded-2xl border border-slate-200 bg-white p-6',
        ...(bgColor ? { style: `background-color:${bgColor}` } : {}),
      }),
      title ? ['h3', { class: 'mb-4 text-lg font-bold text-slate-900' }, title] : ['span', { class: 'hidden' }],
      ['div', { class: Number(columns) === 2 ? 'grid gap-x-8 sm:grid-cols-2' : '' }, ...rows],
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
    iconStyle: 'plus',
    accordion: false,
    bgColor: '',
    columns: 1,
  },
  options: [
    { key: 'title', label: 'Section title', type: 'text' },
    { key: 'openFirst', label: 'Open first item', type: 'toggle' },
    { key: 'accordion', label: 'Open only one at a time', type: 'toggle' },
    {
      key: 'iconStyle',
      label: 'Icon style',
      type: 'segmented',
      choices: [
        { label: '+', value: 'plus' },
        { label: 'Chevron', value: 'chevron' },
        { label: 'Arrow', value: 'arrow' },
      ],
    },
    {
      key: 'columns',
      label: 'Layout',
      type: 'segmented',
      choices: [
        { label: 'Single', value: '1' },
        { label: 'Two column', value: '2' },
      ],
    },
    { key: 'bgColor', label: 'Background colour', type: 'color' },
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
const PRICE_ROUND: Record<string, string> = { none: 'rounded-none', md: 'rounded-xl', lg: 'rounded-2xl' }
/** Strips the leading currency symbol and applies the inspector currency */
const withCurrency = (price: string, currency: string, position = 'before') => {
  const bare = String(price ?? '').replace(/^[^\d.,-]+/, '')
  if (!currency) return String(price ?? '')
  return position === 'after' ? `${bare}${currency}` : `${currency}${bare}`
}

const PricingView = ({ node, selected }: { node: any; selected: boolean }) => {
  const { title, subtitle, plans, columns, currency, currencyPosition, bgColor, highlightColor, rounded } = node.attrs
  return (
    <NodeViewWrapper data-block="pricing" className={cx('my-2', selected && 'ring-2 ring-brand-blue ring-offset-2 rounded-lg')} data-drag-handle>
      <div className="rounded-2xl border border-slate-200 bg-white p-6" style={bgColor ? { backgroundColor: bgColor } : undefined}>
        {title && <h3 className="text-center text-2xl font-bold text-slate-900">{title}</h3>}
        {subtitle && <p className="mb-6 mt-1 text-center text-sm text-slate-500">{subtitle}</p>}
        <div className="grid gap-5" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))` }}>
          {(plans as any[]).map((p: any, i: number) => (
            <div
              key={i}
              className={cx(
                'flex flex-col border p-5',
                PRICE_ROUND[rounded] ?? PRICE_ROUND.lg,
                p.highlight ? 'shadow-md' : '',
                !highlightColor && (p.highlight ? 'border-blue-600 bg-blue-50/60' : 'border-slate-200 bg-white'),
              )}
              style={p.highlight && highlightColor ? { borderColor: highlightColor, backgroundColor: `${highlightColor}14` } : undefined}
            >
              <p className="text-sm font-semibold text-slate-900">{p.name}</p>
              <p className="mt-2 text-3xl font-extrabold text-slate-900">
                {withCurrency(p.price, currency, currencyPosition)}
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
      currency: { default: '', renderHTML: suppress },
      currencyPosition: { default: 'before', renderHTML: suppress },
      bgColor: { default: '', renderHTML: suppress },
      highlightColor: { default: '', renderHTML: suppress },
      rounded: { default: 'lg', renderHTML: suppress },
    }
  },
  parseHTML() { return [{ tag: 'div[data-block="pricing"]' }] },
  renderHTML({ node, HTMLAttributes }) {
    const { title, subtitle, plans, columns, currency, currencyPosition, bgColor, highlightColor, rounded } = node.attrs
    const cards = (plans as any[]).map((p) => [
      'div',
      {
        class: cx(
          'flex flex-col border p-5',
          PRICE_ROUND[rounded] ?? PRICE_ROUND.lg,
          !highlightColor && (p.highlight ? 'border-blue-600 bg-blue-50/60' : 'border-slate-200 bg-white'),
        ),
        ...(p.highlight && highlightColor ? { style: `border-color:${highlightColor};background-color:${highlightColor}14` } : {}),
      },
      ['p', { class: 'text-sm font-semibold text-slate-900' }, p.name],
      ['p', { class: 'mt-2 text-3xl font-extrabold text-slate-900' }, `${withCurrency(p.price, currency, currencyPosition)}${p.period ? p.period : ''}`],
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
      mergeAttributes(HTMLAttributes, {
        'data-block': 'pricing',
        class: 'my-6 rounded-2xl border border-slate-200 bg-white p-6',
        ...(bgColor ? { style: `background-color:${bgColor}` } : {}),
      }),
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
    currency: '',
    currencyPosition: 'before',
    bgColor: '',
    highlightColor: '',
    rounded: 'lg',
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
    { key: 'currency', label: 'Currency symbol', type: 'text', placeholder: '$ / € / £' },
    {
      key: 'currencyPosition',
      label: 'Currency position',
      type: 'segmented',
      choices: [
        { label: 'Before', value: 'before' },
        { label: 'After', value: 'after' },
      ],
    },
    {
      key: 'rounded',
      label: 'Card corner',
      type: 'segmented',
      choices: [
        { label: 'Square', value: 'none' },
        { label: 'Rounded', value: 'md' },
        { label: 'Large', value: 'lg' },
      ],
    },
    { key: 'bgColor', label: 'Section background', type: 'color' },
    { key: 'highlightColor', label: 'Highlight colour', type: 'color' },
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
        { key: 'features', label: 'Features (one per line)', type: 'textarea', rows: 4 },
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
  const { title, steps, markerStyle, lineColor, spacing, layout, bgColor } = node.attrs
  const grid = layout === 'grid'
  return (
    <NodeViewWrapper data-block="timeline" className={cx('my-2', selected && 'ring-2 ring-brand-blue ring-offset-2 rounded-lg')} data-drag-handle>
      <div className="rounded-2xl border border-slate-200 bg-white p-6" style={bgColor ? { backgroundColor: bgColor } : undefined}>
        {title && <h3 className="mb-5 text-lg font-bold text-slate-900">{title}</h3>}
        <ol
          className={cx('relative pl-6', grid && 'grid sm:grid-cols-2', !grid && 'border-l')}
          style={{ borderLeftColor: !grid && lineColor ? lineColor : undefined, gap: `${spacing}px` }}
        >
          {(steps as any[]).map((s: any, i: number) => (
            <li key={i} className="relative">
              <span className={cx(
                'absolute -left-[31px] flex items-center justify-center bg-blue-600 font-bold text-white',
                markerStyle === 'dot' ? 'h-3 w-3 -left-[26px] rounded-full text-[0px]' : 'h-5 w-5 rounded-full text-[10px]',
              )}>
                {markerStyle === 'number' ? i + 1 : ''}
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
      markerStyle: { default: 'number', renderHTML: suppress },
      lineColor: { default: '', renderHTML: suppress },
      spacing: { default: 24, renderHTML: suppress },
      layout: { default: 'vertical', renderHTML: suppress },
      bgColor: { default: '', renderHTML: suppress },
    }
  },
  parseHTML() { return [{ tag: 'div[data-block="timeline"]' }] },
  renderHTML({ node, HTMLAttributes }) {
    const { title, steps, markerStyle, lineColor, spacing, layout, bgColor } = node.attrs
    const grid = layout === 'grid'
    const items = (steps as any[]).map((s, i) => [
      'li',
      { class: 'relative' },
      [
        'span',
        {
          class: markerStyle === 'dot'
            ? 'absolute -left-[26px] flex h-3 w-3 items-center justify-center rounded-full bg-blue-600'
            : 'absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white',
        },
        markerStyle === 'number' ? String(i + 1) : '',
      ],
      s.badge ? ['span', { class: 'mb-1 inline-block rounded bg-blue-50 px-2 py-0.5 text-[10px] font-semibold uppercase text-blue-700' }, s.badge] : ['span', { class: 'hidden' }],
      ['p', { class: 'text-sm font-semibold text-slate-900' }, s.title],
      s.text ? ['p', { class: 'mt-1 text-sm text-slate-500' }, s.text] : ['span', { class: 'hidden' }],
    ])
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-block': 'timeline',
        class: 'my-6 rounded-2xl border border-slate-200 bg-white p-6',
        ...(bgColor ? { style: `background-color:${bgColor}` } : {}),
      }),
      title ? ['h3', { class: 'mb-5 text-lg font-bold text-slate-900' }, title] : ['span', { class: 'hidden' }],
      [
        'ol',
        {
          class: cx('relative pl-6', grid && 'grid sm:grid-cols-2', !grid && 'border-l'),
          style: [`border-left-color:${!grid && lineColor ? lineColor : '#E2E8F0'}`, `gap:${spacing}px`].join(';'),
        },
        ...items,
      ],
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
    markerStyle: 'number',
    lineColor: '',
    spacing: 24,
    layout: 'vertical',
    bgColor: '',
  },
  options: [
    { key: 'title', label: 'Title', type: 'text' },
    {
      key: 'layout',
      label: 'Layout',
      type: 'segmented',
      choices: [
        { label: 'Vertical', value: 'vertical' },
        { label: 'Grid', value: 'grid' },
      ],
    },
    {
      key: 'markerStyle',
      label: 'Marker',
      type: 'segmented',
      choices: [
        { label: 'Number', value: 'number' },
        { label: 'Dot', value: 'dot' },
      ],
    },
    { key: 'lineColor', label: 'Line colour', type: 'color' },
    { key: 'spacing', label: 'Step gap (px)', type: 'range', min: 8, max: 64, step: 4 },
    { key: 'bgColor', label: 'Background colour', type: 'color' },
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
  const { title, logos, columns, grayscale, bgColor, logoHeight, border, gap } = node.attrs
  return (
    <NodeViewWrapper data-block="logo-grid" className={cx('my-2', selected && 'ring-2 ring-brand-blue ring-offset-2 rounded-lg')} data-drag-handle>
      <div className={cx('rounded-2xl bg-white p-6', border && 'border border-slate-200')} style={bgColor ? { backgroundColor: bgColor } : undefined}>
        {title && <p className="mb-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>}
        <div className="grid items-center" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))`, gap: `${gap}px` }}>
          {(logos as any[]).map((l: any, i: number) =>
            l.image ? (
              <img key={i} src={l.image} alt={l.name || ''} style={{ height: `${logoHeight}px` }} className={cx('mx-auto w-auto object-contain transition', grayscale && 'opacity-60 grayscale hover:opacity-100 hover:grayscale-0')} />
            ) : (
              <div key={i} className="mx-auto w-24 rounded bg-slate-100" style={{ height: `${logoHeight}px` }} />
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
      bgColor: { default: '', renderHTML: suppress },
      logoHeight: { default: 40, renderHTML: suppress },
      border: { default: true, renderHTML: suppress },
      gap: { default: 24, renderHTML: suppress },
    }
  },
  parseHTML() { return [{ tag: 'div[data-block="logo-grid"]' }] },
  renderHTML({ node, HTMLAttributes }) {
    const { title, logos, columns, grayscale, bgColor, logoHeight, border, gap } = node.attrs
    const cells = (logos as any[]).map((l) => [
      'div',
      { class: 'flex justify-center' },
      l.image
        ? ['img', { src: l.image, alt: l.name || '', style: `height:${logoHeight}px`, class: cx('mx-auto w-auto object-contain', grayscale && 'opacity-60 grayscale') }]
        : ['div', { class: 'w-24 rounded bg-slate-100', style: `height:${logoHeight}px` }],
    ])
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-block': 'logo-grid',
        class: cx('my-6 rounded-2xl bg-white p-6', border && 'border border-slate-200'),
        ...(bgColor ? { style: `background-color:${bgColor}` } : {}),
      }),
      title ? ['p', { class: 'mb-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500' }, title] : ['span', { class: 'hidden' }],
      ['div', { class: 'grid items-center', style: `grid-template-columns:repeat(${columns},minmax(0,1fr));gap:${gap}px` }, ...cells],
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
  defaults: {
    title: 'Trusted by', logos: [{ image: '', name: 'Client', url: '' }], columns: 4, grayscale: true,
    bgColor: '', logoHeight: 40, border: true, gap: 24,
  },
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
    { key: 'logoHeight', label: 'Logo height (px)', type: 'range', min: 20, max: 96, step: 4 },
    { key: 'gap', label: 'Gap (px)', type: 'range', min: 8, max: 64, step: 4 },
    { key: 'bgColor', label: 'Background colour', type: 'color' },
    { key: 'border', label: 'Border', type: 'toggle' },
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
  const { title, members, columns, layout, cardStyle, avatarShape, bgColor } = node.attrs
  const shape = avatarShape === 'square' ? 'rounded-xl' : 'rounded-full'
  const list = layout === 'list'
  return (
    <NodeViewWrapper data-block="team" className={cx('my-2', selected && 'ring-2 ring-brand-blue ring-offset-2 rounded-lg')} data-drag-handle>
      <div className="rounded-2xl border border-slate-200 bg-white p-6" style={bgColor ? { backgroundColor: bgColor } : undefined}>
        {title && <h3 className="mb-5 text-lg font-bold text-slate-900">{title}</h3>}
        <div className={cx(list ? 'flex flex-col gap-5' : 'grid gap-6')} style={list ? undefined : { gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))` }}>
          {(members as any[]).map((m: any, i: number) => (
            <div key={i} className={cx(list ? 'flex items-start gap-4 text-left' : 'text-center', cardStyle === 'card' && 'rounded-xl border border-slate-200 bg-slate-50 p-4')}>
              {m.photo ? (
                <img src={m.photo} alt={m.name} className={cx('h-24 w-24 object-cover', shape, !list && 'mx-auto')} />
              ) : (
                <div className={cx('flex h-24 w-24 items-center justify-center bg-blue-50 text-xl font-bold text-blue-600', shape, !list && 'mx-auto')}>
                  {(m.name || 'A').slice(0, 1).toUpperCase()}
                </div>
              )}
              <div className={list ? 'flex-1' : ''}>
                <p className="mt-3 text-sm font-semibold text-slate-900">{m.name}</p>
                {m.role && <p className="text-xs text-slate-500">{m.role}</p>}
                {m.bio && <p className="mt-2 text-xs leading-relaxed text-slate-500">{m.bio}</p>}
                {(m.linkedin || m.website) && (
                  <p className="mt-2 flex gap-3 text-xs">
                    {m.linkedin && <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">LinkedIn</a>}
                    {m.website && <a href={m.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Website</a>}
                  </p>
                )}
              </div>
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
      members: jsonAttr([{ name: 'Jane Doe', role: 'Founder', photo: '', bio: '', linkedin: '', website: '' }]),
      columns: { default: 3, renderHTML: suppress },
      layout: { default: 'grid', renderHTML: suppress },
      cardStyle: { default: 'plain', renderHTML: suppress },
      avatarShape: { default: 'circle', renderHTML: suppress },
      bgColor: { default: '', renderHTML: suppress },
    }
  },
  parseHTML() { return [{ tag: 'div[data-block="team"]' }] },
  renderHTML({ node, HTMLAttributes }) {
    const { title, members, columns, layout, cardStyle, avatarShape, bgColor } = node.attrs
    const shape = avatarShape === 'square' ? 'rounded-xl' : 'rounded-full'
    const list = layout === 'list'
    const cells = (members as any[]).map((m) => [
      'div',
      { class: cx(list ? 'flex items-start gap-4 text-left' : 'text-center', cardStyle === 'card' && 'rounded-xl border border-slate-200 bg-slate-50 p-4') },
      m.photo
        ? ['img', { src: m.photo, alt: m.name, class: cx('h-24 w-24 object-cover', shape, !list && 'mx-auto') }]
        : ['div', { class: cx('flex h-24 w-24 items-center justify-center bg-blue-50 text-xl font-bold text-blue-600', shape, !list && 'mx-auto') }, (m.name || 'A').slice(0, 1).toUpperCase()],
      [
        'div',
        { class: list ? 'flex-1' : '' },
        ['p', { class: 'mt-3 text-sm font-semibold text-slate-900' }, m.name],
        m.role ? ['p', { class: 'text-xs text-slate-500' }, m.role] : ['span', { class: 'hidden' }],
        m.bio ? ['p', { class: 'mt-2 text-xs leading-relaxed text-slate-500' }, m.bio] : ['span', { class: 'hidden' }],
        m.linkedin || m.website
          ? [
              'p',
              { class: 'mt-2 flex gap-3 text-xs' },
              m.linkedin ? ['a', { href: m.linkedin, target: '_blank', rel: 'noopener noreferrer', class: 'text-blue-600 underline' }, 'LinkedIn'] : ['span', { class: 'hidden' }],
              m.website ? ['a', { href: m.website, target: '_blank', rel: 'noopener noreferrer', class: 'text-blue-600 underline' }, 'Website'] : ['span', { class: 'hidden' }],
            ]
          : ['span', { class: 'hidden' }],
      ],
    ])
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-block': 'team',
        class: 'my-6 rounded-2xl border border-slate-200 bg-white p-6',
        ...(bgColor ? { style: `background-color:${bgColor}` } : {}),
      }),
      title ? ['h3', { class: 'mb-5 text-lg font-bold text-slate-900' }, title] : ['span', { class: 'hidden' }],
      [
        'div',
        {
          class: cx(list ? 'flex flex-col gap-5' : 'grid gap-6'),
          ...(list ? {} : { style: `grid-template-columns:repeat(${columns},minmax(0,1fr))` }),
        },
        ...cells,
      ],
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
  defaults: {
    title: 'Our team',
    members: [{ name: 'Jane Doe', role: 'Founder', photo: '', bio: '', linkedin: '', website: '' }],
    columns: 3,
    layout: 'grid',
    cardStyle: 'plain',
    avatarShape: 'circle',
    bgColor: '',
  },
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
      key: 'layout',
      label: 'Layout',
      type: 'segmented',
      choices: [
        { label: 'Grid', value: 'grid' },
        { label: 'List', value: 'list' },
      ],
    },
    {
      key: 'cardStyle',
      label: 'Card style',
      type: 'segmented',
      choices: [
        { label: 'Plain', value: 'plain' },
        { label: 'Card', value: 'card' },
      ],
    },
    {
      key: 'avatarShape',
      label: 'Avatar shape',
      type: 'segmented',
      choices: [
        { label: 'Circle', value: 'circle' },
        { label: 'Square', value: 'square' },
      ],
    },
    { key: 'bgColor', label: 'Background colour', type: 'color' },
    {
      key: 'members',
      label: 'Members',
      type: 'list',
      itemLabel: 'Member',
      max: 12,
      defaultItem: { name: 'New member', role: '', photo: '', bio: '', linkedin: '', website: '' },
      fields: [
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'role', label: 'Role', type: 'text' },
        { key: 'photo', label: 'Photo URL', type: 'url' },
        { key: 'bio', label: 'Short bio', type: 'textarea', rows: 2 },
        { key: 'linkedin', label: 'LinkedIn URL', type: 'url' },
        { key: 'website', label: 'Website URL', type: 'url' },
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

