import { Node } from '@tiptap/core'
import { NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
import { Info, Palette, CaseSensitive, MousePointerClick } from 'lucide-react'
import type { BlockDefinition } from '../types'
import { cx, jsonAttr, mergeAttributes, suppress } from './helpers'

/* ══════════════════════════════════════════════════════════════════════════
 * CALLOUT — nested rich content block (content: 'block+')
 * ═════════════════════════════════════════════════════════════════════════*/
const VARIANTS: Record<string, { wrap: string; title: string; icon: string }> = {
  info: { wrap: 'border-l-4 border-blue-500 bg-blue-50', title: 'text-blue-900', icon: '💡' },
  success: { wrap: 'border-l-4 border-emerald-500 bg-emerald-50', title: 'text-emerald-900', icon: '✅' },
  warning: { wrap: 'border-l-4 border-amber-500 bg-amber-50', title: 'text-amber-900', icon: '⚠️' },
  danger: { wrap: 'border-l-4 border-rose-500 bg-rose-50', title: 'text-rose-900', icon: '🚫' },
  note: { wrap: 'border border-slate-200 bg-slate-50', title: 'text-slate-900', icon: '📝' },
}

const CalloutView = ({ node, selected }: { node: any; selected: boolean }) => {
  const v = VARIANTS[node.attrs.variant] ?? VARIANTS.info
  const { showIcon, padding, border, rounded } = node.attrs
  return (
    <NodeViewWrapper data-block="callout" className={cx('my-2', selected && 'rounded-lg ring-2 ring-brand-blue ring-offset-2')} data-drag-handle>
      <div
        className={cx('px-5', v.wrap, rounded && 'rounded-r-xl', border && 'border border-slate-200')}
        style={{ paddingTop: `${padding}px`, paddingBottom: `${padding}px` }}
      >
        {node.attrs.title && (
          <p className={cx('mb-1 flex items-center gap-2 text-sm font-bold', v.title)}>
            {showIcon && <span>{v.icon}</span>}
            {node.attrs.title}
          </p>
        )}
        <NodeViewContent className="text-sm leading-relaxed text-slate-700" />
      </div>
    </NodeViewWrapper>
  )
}

const CalloutNode = Node.create({
  name: 'calloutBlock',
  group: 'block',
  content: 'block+',
  draggable: true,
  defining: true,
  addAttributes() {
    return {
      variant: { default: 'info', renderHTML: suppress },
      title: { default: '', renderHTML: suppress },
      showIcon: { default: true, renderHTML: suppress },
      padding: { default: 16, renderHTML: suppress },
      border: { default: false, renderHTML: suppress },
      rounded: { default: true, renderHTML: suppress },
    }
  },
  parseHTML() {
    return [{ tag: 'div[data-block="callout"]' }]
  },
  renderHTML({ node, HTMLAttributes }) {
    const v = VARIANTS[node.attrs.variant] ?? VARIANTS.info
    const { showIcon, padding, border, rounded } = node.attrs
    const children: any[] = []
    if (node.attrs.title) {
      children.push(['p', { class: `mb-1 text-sm font-bold ${v.title}` }, showIcon ? `${v.icon} ${node.attrs.title}` : node.attrs.title])
    }
    children.push(['div', { class: 'text-sm leading-relaxed text-slate-700' }, 0])
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-block': 'callout',
        class: cx('my-6 px-5', v.wrap, rounded && 'rounded-r-xl', border && 'border border-slate-200'),
        style: `padding-top:${padding}px;padding-bottom:${padding}px`,
      }),
      ...children,
    ]
  },
  addNodeView() {
    return ReactNodeViewRenderer(CalloutView)
  },
})

export const calloutBlock: BlockDefinition = {
  name: 'calloutBlock',
  title: 'Callout',
  description: 'Highlighted note / tip box',
  category: 'design',
  icon: Info,
  keywords: ['callout', 'note', 'tip', 'alert', 'info', 'warning'],
  node: CalloutNode,
  defaults: { variant: 'info', title: '', showIcon: true, padding: 16, border: false, rounded: true },
  options: [
    { key: 'title', label: 'Title (optional)', type: 'text' },
    {
      key: 'variant',
      label: 'Style',
      type: 'segmented',
      choices: [
        { label: 'Info', value: 'info' },
        { label: 'Success', value: 'success' },
        { label: 'Warn', value: 'warning' },
        { label: 'Danger', value: 'danger' },
        { label: 'Note', value: 'note' },
      ],
    },
    { key: 'showIcon', label: 'Icon দেখান', type: 'toggle' },
    { key: 'padding', label: 'Padding (px)', type: 'range', min: 8, max: 48, step: 4 },
    { key: 'rounded', label: 'Rounded corners', type: 'toggle' },
    { key: 'border', label: 'Border', type: 'toggle' },
  ],
  insert: ({ editor, attrs }) =>
    editor
      .chain()
      .focus()
      .insertContent({
        type: 'calloutBlock',
        attrs: { variant: 'info', title: '', ...attrs },
        content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Write your note here…' }] }],
      })
      .run(),
}

/* ══════════════════════════════════════════════════════════════════════════
 * COLOR PALETTE (আপনার পুরনো block — modernized + repeater)
 * ═════════════════════════════════════════════════════════════════════════*/
const PaletteView = ({ node, selected }: { node: any; selected: boolean }) => {
  const { title, colors, size, layout, showHex, shape, gap } = node.attrs
  return (
    <NodeViewWrapper data-block="palette" className={cx('my-2', selected && 'rounded-lg ring-2 ring-brand-blue ring-offset-2')} data-drag-handle>
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        {title && <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>}
        <div className={cx(layout === 'grid' ? 'grid grid-cols-2 sm:grid-cols-4' : 'flex flex-wrap')} style={{ gap: `${gap}px` }}>
          {(colors as { hex: string; name: string }[]).map((c, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div
                className={cx('border border-black/5 shadow-sm', shape === 'circle' ? 'rounded-full' : 'rounded-xl')}
                style={{ backgroundColor: c.hex, width: `${size}px`, height: `${size}px` }}
              />
              <div className="text-center">
                {showHex && <p className="font-mono text-[10px] font-medium text-slate-800">{String(c.hex).toUpperCase()}</p>}
                <p className="text-[10px] text-slate-500">{c.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </NodeViewWrapper>
  )
}

const PaletteNode = Node.create({
  name: 'colorPaletteBlock',
  group: 'block',
  draggable: true,
  addAttributes() {
    return {
      title: { default: 'Brand Colors', renderHTML: suppress },
      colors: jsonAttr([
        { hex: '#0B1B3A', name: 'Navy' },
        { hex: '#2563EB', name: 'Primary' },
        { hex: '#93C5FD', name: 'Accent' },
        { hex: '#F1F5F9', name: 'Mist' },
      ]),
      size: { default: 64, renderHTML: suppress },
      layout: { default: 'row', renderHTML: suppress },
      showHex: { default: true, renderHTML: suppress },
      shape: { default: 'square', renderHTML: suppress },
      gap: { default: 16, renderHTML: suppress },
    }
  },
  parseHTML() {
    return [{ tag: 'div[data-block="palette"]' }]
  },
  renderHTML({ node, HTMLAttributes }) {
    const { title, colors, size, layout, showHex, shape, gap } = node.attrs
    const swatches = (colors as { hex: string; name: string }[]).map((c) => [
      'div',
      { class: 'flex flex-col items-center gap-1' },
      ['div', { style: `width:${size}px;height:${size}px;background:${c.hex}`, class: cx('border border-black/5 shadow-sm', shape === 'circle' ? 'rounded-full' : 'rounded-xl') }],
      showHex ? ['p', { class: 'font-mono text-[10px] font-medium text-slate-800' }, String(c.hex).toUpperCase()] : ['span', { class: 'hidden' }],
      ['p', { class: 'text-[10px] text-slate-500' }, c.name],
    ])
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-block': 'palette', class: 'my-6 rounded-xl border border-slate-200 bg-white p-5' }),
      title ? ['p', { class: 'mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500' }, title] : ['span', { class: 'hidden' }],
      ['div', { class: cx(layout === 'grid' ? 'grid grid-cols-2 sm:grid-cols-4' : 'flex flex-wrap'), style: `gap:${gap}px` }, ...swatches],
    ]
  },
  addNodeView() {
    return ReactNodeViewRenderer(PaletteView)
  },
})

export const colorPaletteBlock: BlockDefinition = {
  name: 'colorPaletteBlock',
  title: 'Color Palette',
  description: 'Showcase brand colours',
  category: 'design',
  icon: Palette,
  keywords: ['color', 'palette', 'swatch', 'brand', 'hex'],
  node: PaletteNode,
  defaults: {
    title: 'Brand Colors',
    colors: [
      { hex: '#0B1B3A', name: 'Navy' },
      { hex: '#2563EB', name: 'Primary' },
      { hex: '#93C5FD', name: 'Accent' },
      { hex: '#F1F5F9', name: 'Mist' },
    ],
    size: 64,
    layout: 'row',
    showHex: true,
    shape: 'square',
    gap: 16,
  },
  options: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'size', label: 'Swatch size', type: 'range', min: 40, max: 120, step: 8 },
    { key: 'gap', label: 'Gap (px)', type: 'range', min: 4, max: 48, step: 4 },
    {
      key: 'layout',
      label: 'Layout',
      type: 'segmented',
      choices: [
        { label: 'Row', value: 'row' },
        { label: 'Grid', value: 'grid' },
      ],
    },
    {
      key: 'shape',
      label: 'Swatch shape',
      type: 'segmented',
      choices: [
        { label: 'Square', value: 'square' },
        { label: 'Circle', value: 'circle' },
      ],
    },
    { key: 'showHex', label: 'Hex code দেখান', type: 'toggle' },
    {
      key: 'colors',
      label: 'Colors',
      type: 'list',
      itemLabel: 'Color',
      max: 12,
      defaultItem: { hex: '#2563EB', name: 'New color' },
      fields: [
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'hex', label: 'Hex', type: 'color' },
      ],
    },
  ],
}


/* ══════════════════════════════════════════════════════════════════════════
 * TYPOGRAPHY  (আপনার পুরনো typography block — modernized)
 * ═════════════════════════════════════════════════════════════════════════*/
const TypographyView = ({ node, selected }: { node: any; selected: boolean }) => {
  const { title, fonts, showMeta, layout, sampleSize, border } = node.attrs
  return (
    <NodeViewWrapper data-block="typography" className={cx('my-2', selected && 'ring-2 ring-brand-blue ring-offset-2 rounded-lg')} data-drag-handle>
      <div className={cx('rounded-xl bg-white p-5', border && 'border border-slate-200')}>
        {title && <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>}
        <div className={cx(layout === 'grid' ? 'grid gap-4 sm:grid-cols-2' : 'space-y-3')}>
          {(fonts as any[]).map((f: any, i: number) => (
            <div key={i} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
              {showMeta && (
                <p className="mb-1 text-[11px] text-slate-400">
                  {f.name}
                  {f.style ? ` · ${f.style}` : ''}
                  {f.weight ? ` · ${f.weight}` : ''}
                  {f.size ? ` · ${f.size}` : ''}
                </p>
              )}
              <p
                className="text-slate-900"
                style={{ fontWeight: f.weight || '400', fontStyle: f.style?.toLowerCase().includes('italic') ? 'italic' : 'normal', fontSize: f.size || sampleSize || undefined }}
              >
                {f.sample || 'The quick brown fox jumps over the lazy dog'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </NodeViewWrapper>
  )
}

const TypographyNode = Node.create({
  name: 'typographyBlock',
  group: 'block',
  draggable: true,
  addAttributes() {
    return {
      title: { default: 'Typography', renderHTML: suppress },
      fonts: jsonAttr([
        { name: 'Heading Font', sample: 'The quick brown fox', weight: '700', style: 'Bold', size: '' },
        { name: 'Body Font', sample: 'The quick brown fox jumps over the lazy dog', weight: '400', style: 'Regular', size: '' },
      ]),
      showMeta: { default: true, renderHTML: suppress },
      layout: { default: 'stack', renderHTML: suppress },
      sampleSize: { default: '', renderHTML: suppress },
      border: { default: true, renderHTML: suppress },
    }
  },
  parseHTML() { return [{ tag: 'div[data-block="typography"]' }] },
  renderHTML({ node, HTMLAttributes }) {
    const { title, fonts, showMeta, layout, sampleSize, border } = node.attrs
    const rows = (fonts as any[]).map((f) => [
      'div',
      { class: 'border-b border-slate-100 pb-3 last:border-0 last:pb-0' },
      showMeta
        ? ['p', { class: 'mb-1 text-[11px] text-slate-400' }, [f.name, f.style ? ` · ${f.style}` : '', f.weight ? ` · ${f.weight}` : '', f.size ? ` · ${f.size}` : ''].filter(Boolean).join('')]
        : ['span', { class: 'hidden' }],
      [
        'p',
        {
          class: 'text-slate-900',
          style: `font-weight:${f.weight || 400};font-style:${String(f.style || '').toLowerCase().includes('italic') ? 'italic' : 'normal'}${f.size || sampleSize ? `;font-size:${f.size || sampleSize}` : ''}`,
        },
        f.sample || 'The quick brown fox jumps over the lazy dog',
      ],
    ])
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-block': 'typography', class: cx('my-6 rounded-xl bg-white p-5', border && 'border border-slate-200') }),
      title ? ['p', { class: 'mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500' }, title] : ['span', { class: 'hidden' }],
      ['div', { class: cx(layout === 'grid' ? 'grid gap-4 sm:grid-cols-2' : 'space-y-3') }, ...rows],
    ]
  },
  addNodeView() { return ReactNodeViewRenderer(TypographyView) },
})

export const typographyBlock: BlockDefinition = {
  name: 'typographyBlock',
  title: 'Typography',
  description: 'Font showcase with live preview',
  category: 'design',
  icon: CaseSensitive,
  keywords: ['typography', 'font', 'typeface', 'text style'],
  node: TypographyNode,
  defaults: {
    title: 'Typography',
    fonts: [
      { name: 'Heading Font', sample: 'The quick brown fox', weight: '700', style: 'Bold', size: '' },
      { name: 'Body Font', sample: 'The quick brown fox jumps over the lazy dog', weight: '400', style: 'Regular', size: '' },
    ],
    showMeta: true,
    layout: 'stack',
    sampleSize: '',
    border: true,
  },
  options: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'showMeta', label: 'Show font meta', type: 'toggle' },
    {
      key: 'layout',
      label: 'Layout',
      type: 'segmented',
      choices: [
        { label: 'Stacked', value: 'stack' },
        { label: 'Grid', value: 'grid' },
      ],
    },
    { key: 'sampleSize', label: 'Sample size (e.g. 24px)', type: 'text' },
    { key: 'border', label: 'Border', type: 'toggle' },
    {
      key: 'fonts',
      label: 'Fonts',
      type: 'list',
      itemLabel: 'Font',
      max: 12,
      defaultItem: { name: 'New font', sample: 'The quick brown fox', weight: '400', style: 'Regular', size: '' },
      fields: [
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'sample', label: 'Sample text', type: 'text' },
        { key: 'weight', label: 'Weight', type: 'text' },
        { key: 'style', label: 'Style', type: 'text' },
        { key: 'size', label: 'Size (e.g. 24px)', type: 'text' },
      ],
    },
  ],
}

/* ══════════════════════════════════════════════════════════════════════════
 * BUTTON
 * ═════════════════════════════════════════════════════════════════════════*/
const BUTTON_STYLES: Record<string, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-slate-900 text-white hover:bg-slate-800',
  outline: 'border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white',
  ghost: 'text-blue-600 hover:bg-blue-50',
}
const BUTTON_SIZES: Record<string, string> = {
  sm: 'px-4 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
}
const BUTTON_RADIUS: Record<string, string> = {
  none: 'rounded-none',
  md: 'rounded-lg',
  full: 'rounded-full',
}

const ButtonView = ({ node, selected }: { node: any; selected: boolean }) => {
  const { label, url, style, size, align, fullWidth, newTab, icon, iconPosition, bgColor, textColor, radius, shadow } = node.attrs
  const justify = align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start'
  const custom: React.CSSProperties = {}
  if (bgColor) custom.backgroundColor = bgColor
  if (textColor) custom.color = textColor
  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="mr-2 inline-flex">{icon}</span>}
      {label || 'Button text'}
      {icon && iconPosition === 'right' && <span className="ml-2 inline-flex">{icon}</span>}
    </>
  )
  return (
    <NodeViewWrapper data-block="button" className={cx('my-2 flex', justify, selected && 'ring-2 ring-brand-blue rounded-lg')} data-drag-handle>
      <a
        href={url || '#'}
        target={newTab ? '_blank' : undefined}
        rel={newTab ? 'noopener noreferrer' : undefined}
        style={custom}
        className={cx(
          'inline-flex items-center justify-center font-semibold transition-colors',
          BUTTON_RADIUS[radius] ?? BUTTON_RADIUS.md,
          !bgColor && (BUTTON_STYLES[style] ?? BUTTON_STYLES.primary),
          BUTTON_SIZES[size] ?? BUTTON_SIZES.md,
          fullWidth && 'w-full',
          shadow && 'shadow-lg',
        )}
      >
        {content}
      </a>
    </NodeViewWrapper>
  )
}

const ButtonNode = Node.create({
  name: 'buttonBlock',
  group: 'block',
  draggable: true,
  addAttributes() {
    return {
      label: { default: 'Button text', renderHTML: suppress },
      url: { default: '', renderHTML: suppress },
      style: { default: 'primary', renderHTML: suppress },
      size: { default: 'md', renderHTML: suppress },
      align: { default: 'left', renderHTML: suppress },
      fullWidth: { default: false, renderHTML: suppress },
      newTab: { default: false, renderHTML: suppress },
      icon: { default: '', renderHTML: suppress },
      iconPosition: { default: 'right', renderHTML: suppress },
      bgColor: { default: '', renderHTML: suppress },
      textColor: { default: '', renderHTML: suppress },
      radius: { default: 'md', renderHTML: suppress },
      shadow: { default: false, renderHTML: suppress },
    }
  },
  parseHTML() { return [{ tag: 'div[data-block="button"]' }] },
  renderHTML({ node, HTMLAttributes }) {
    const { label, url, style, size, align, fullWidth, newTab, icon, iconPosition, bgColor, textColor, radius, shadow } = node.attrs
    const justify = align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start'
    const styleAttr = [bgColor ? `background-color:${bgColor}` : '', textColor ? `color:${textColor}` : ''].filter(Boolean).join(';')
    const spans: any[] = []
    if (icon && iconPosition === 'left') spans.push(['span', { style: 'margin-right:8px' }, icon])
    spans.push(label || 'Button text')
    if (icon && iconPosition === 'right') spans.push(['span', { style: 'margin-left:8px' }, icon])
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-block': 'button', class: `my-6 flex ${justify}` }),
      [
        'a',
        {
          href: url || '#',
          ...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
          ...(styleAttr ? { style: styleAttr } : {}),
          class: cx(
            'inline-flex items-center justify-center font-semibold transition-colors',
            BUTTON_RADIUS[radius] ?? BUTTON_RADIUS.md,
            !bgColor && (BUTTON_STYLES[style] ?? BUTTON_STYLES.primary),
            BUTTON_SIZES[size] ?? BUTTON_SIZES.md,
            fullWidth && 'w-full',
            shadow && 'shadow-lg',
          ),
        },
        ...spans,
      ],
    ]
  },
  addNodeView() { return ReactNodeViewRenderer(ButtonView) },
})

export const buttonBlock: BlockDefinition = {
  name: 'buttonBlock',
  title: 'Button',
  description: 'Standalone call-to-action button',
  category: 'design',
  icon: MousePointerClick,
  keywords: ['button', 'link', 'cta', 'action'],
  node: ButtonNode,
  defaults: {
    label: 'Button text', url: '', style: 'primary', size: 'md', align: 'left', fullWidth: false, newTab: false,
    icon: '', iconPosition: 'right', bgColor: '', textColor: '', radius: 'md', shadow: false,
  },
  options: [
    { key: 'label', label: 'Button text', type: 'text' },
    { key: 'url', label: 'Link URL', type: 'url' },
    {
      key: 'style',
      label: 'Style',
      type: 'segmented',
      choices: [
        { label: 'Primary', value: 'primary' },
        { label: 'Dark', value: 'secondary' },
        { label: 'Outline', value: 'outline' },
        { label: 'Ghost', value: 'ghost' },
      ],
    },
    {
      key: 'size',
      label: 'Size',
      type: 'segmented',
      choices: [
        { label: 'S', value: 'sm' },
        { label: 'M', value: 'md' },
        { label: 'L', value: 'lg' },
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
    { key: 'fullWidth', label: 'Full width', type: 'toggle' },
    { key: 'newTab', label: 'Open in new tab', type: 'toggle' },
    { key: 'icon', label: 'Icon (emoji বা চিহ্ন)', type: 'text', placeholder: '→' },
    {
      key: 'iconPosition',
      label: 'Icon position',
      type: 'segmented',
      choices: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
    },
    {
      key: 'radius',
      label: 'Corner radius',
      type: 'segmented',
      choices: [
        { label: 'Square', value: 'none' },
        { label: 'Rounded', value: 'md' },
        { label: 'Pill', value: 'full' },
      ],
    },
    { key: 'bgColor', label: 'Custom background', type: 'color' },
    { key: 'textColor', label: 'Custom text colour', type: 'color' },
    { key: 'shadow', label: 'Drop shadow', type: 'toggle' },
  ],
}

export const designBlocks: BlockDefinition[] = [calloutBlock, colorPaletteBlock, typographyBlock, buttonBlock]

