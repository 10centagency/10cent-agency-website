import { Node } from '@tiptap/core'
import { NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
import { Columns3, Minus, MoveVertical } from 'lucide-react'
import type { BlockDefinition } from '../types'
import { cx, mergeAttributes, suppress } from './helpers'

/* ══════════════════════════════════════════════════════════════════════════
 * COLUMNS  — nested content block (blocks inside blocks, like Gutenberg)
 * columnsBlock → columnBlock+ → block+
 * ═════════════════════════════════════════════════════════════════════════*/
const ALIGN: Record<string, string> = { start: 'start', center: 'center', end: 'end', stretch: 'stretch' }

const ColumnsView = ({ node, selected }: { node: any; selected: boolean }) => {
  const { template, gap, divider, verticalAlign, reverseOnMobile } = node.attrs
  return (
    <NodeViewWrapper data-block="columns"
      className={cx('my-2 rounded-lg', selected && 'ring-2 ring-brand-blue ring-offset-2')}
      data-drag-handle
    >
      <div
        data-reverse-mobile={reverseOnMobile ? 'true' : undefined}
        className="grid"
        style={{
          gridTemplateColumns: template,
          gap: `${gap}px`,
          alignItems: ALIGN[verticalAlign] ?? 'start',
        }}
      >
        <NodeViewContent className="contents" />
      </div>
      {divider && <div className="mt-4 h-px w-full bg-slate-200" />}
    </NodeViewWrapper>
  )
}

const ColumnsNode = Node.create({
  name: 'columnsBlock',
  group: 'block',
  content: 'columnBlock+',
  draggable: true,
  defining: true,
  addAttributes() {
    return {
      template: { default: '1fr 1fr', renderHTML: suppress },
      gap: { default: 24, renderHTML: suppress },
      divider: { default: false, renderHTML: suppress },
      reverseOnMobile: { default: false, renderHTML: suppress },
      verticalAlign: { default: 'start', renderHTML: suppress },
      columnBg: { default: '', renderHTML: suppress },
      columnPadding: { default: 0, renderHTML: suppress },
      columnBorder: { default: false, renderHTML: suppress },
    }
  },
  parseHTML() {
    return [{ tag: 'div[data-block="columns"]' }]
  },
  renderHTML({ node, HTMLAttributes }) {
    const { template, gap, divider, verticalAlign, columnBg, columnPadding, columnBorder, reverseOnMobile } = node.attrs
    const children: any[] = [0]
    if (divider) children.push(['div', { class: 'mt-4 h-px w-full bg-slate-200' }])
    // ⚠️ Without the content hole (0), nested column content is dropped on the server
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-block': 'columns',
        ...(reverseOnMobile ? { 'data-reverse-mobile': 'true' } : {}),
        class: 'my-6 grid',
        style: [
          `grid-template-columns:${template}`,
          `gap:${gap}px`,
          `align-items:${ALIGN[verticalAlign] ?? 'start'}`,
          columnBg ? `--column-bg:${columnBg}` : '',
          columnPadding ? `--column-pad:${columnPadding}px` : '',
          columnBorder ? '--column-border:1px solid #D9E8FA' : '',
        ].filter(Boolean).join(';'),
      }),
      ...children,
    ]
  },
  addNodeView() {
    return ReactNodeViewRenderer(ColumnsView)
  },
})

const ColumnView = ({ node, selected }: { node: any; selected: boolean }) => (
  <NodeViewWrapper data-block="column"
    className={cx('min-w-0 rounded-lg px-1', selected && 'bg-brand-blue/5 ring-1 ring-brand-blue/30')}
    data-drag-handle
  >
    <NodeViewContent className="min-w-0 space-y-3" />
  </NodeViewWrapper>
)

const ColumnNode = Node.create({
  name: 'columnBlock',
  content: 'block+',
  group: 'columns',
  draggable: true,
  addAttributes() {
    return { width: { default: '1fr', renderHTML: suppress } }
  },
  parseHTML() {
    return [{ tag: 'div[data-block="column"]' }]
  },
  renderHTML({ node, HTMLAttributes }) {
    const { width } = node.attrs
    // ⚠️ content hole (0) — nested blocks render here
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-block': 'column',
        class: 'min-w-0',
        style: `grid-column:span 1;min-width:0${width && width !== '1fr' ? `;flex-basis:${width}` : ''}`,
      }),
      0,
    ]
  },
  addNodeView() {
    return ReactNodeViewRenderer(ColumnView)
  },
})

export const columnsBlock: BlockDefinition = {
  name: 'columnsBlock',
  title: 'Columns',
  description: 'Side-by-side content columns',
  category: 'layout',
  icon: Columns3,
  keywords: ['columns', 'grid', 'row', 'split', 'side by side'],
  node: ColumnsNode,
  defaults: {
    template: '1fr 1fr',
    gap: 24,
    divider: false,
    verticalAlign: 'start',
    columnBg: '',
    columnPadding: 0,
    columnBorder: false,
    reverseOnMobile: false,
  },
  variations: [
    { title: '2 Columns', attrs: { template: '1fr 1fr' }, keywords: ['two', 'half'] },
    { title: '3 Columns', attrs: { template: '1fr 1fr 1fr' }, keywords: ['three', 'thirds'] },
    { title: '4 Columns', attrs: { template: 'repeat(4, 1fr)' }, keywords: ['four', 'quarters'] },
    { title: 'Sidebar (1/3 + 2/3)', attrs: { template: '1fr 2fr' }, keywords: ['sidebar', '33 66'] },
    { title: 'Sidebar (2/3 + 1/3)', attrs: { template: '2fr 1fr' }, keywords: ['sidebar', '66 33'] },
  ],
  options: [
    {
      key: 'template',
      label: 'Layout',
      type: 'select',
      choices: [
        { label: '2 equal (1/2 · 1/2)', value: '1fr 1fr' },
        { label: '3 equal (1/3 · 1/3 · 1/3)', value: '1fr 1fr 1fr' },
        { label: '4 equal', value: 'repeat(4, 1fr)' },
        { label: 'Sidebar right (2/3 · 1/3)', value: '2fr 1fr' },
        { label: 'Sidebar left (1/3 · 2/3)', value: '1fr 2fr' },
        { label: 'Wide centre (1/4 · 1/2 · 1/4)', value: '1fr 2fr 1fr' },
      ],
    },
    {
      key: 'verticalAlign',
      label: 'Vertical align',
      type: 'segmented',
      choices: [
        { label: 'Top', value: 'start' },
        { label: 'Middle', value: 'center' },
        { label: 'Bottom', value: 'end' },
        { label: 'Stretch', value: 'stretch' },
      ],
    },
    { key: 'gap', label: 'Gap between columns (px)', type: 'range', min: 0, max: 64, step: 4 },
    { key: 'columnBg', label: 'Column background', type: 'color' },
    { key: 'columnPadding', label: 'Column padding (px)', type: 'range', min: 0, max: 40, step: 2 },
    { key: 'columnBorder', label: 'Column border', type: 'toggle' },
    { key: 'divider', label: 'Divider below columns', type: 'toggle' },
    { key: 'reverseOnMobile', label: 'Reverse order on mobile', type: 'toggle' },
  ],
  insert: ({ editor, attrs }) => {
    const count = String(attrs?.template ?? '1fr 1fr').includes('repeat(4')
      ? 4
      : String(attrs?.template ?? '1fr 1fr').split(' ').length || 2
    editor
      .chain()
      .focus()
      .insertContent({
        type: 'columnsBlock',
        attrs: {
          template: '1fr 1fr',
          gap: 24,
          divider: false,
          verticalAlign: 'start',
          columnBg: '',
          columnPadding: 0,
          columnBorder: false,
          ...attrs,
        },
        content: Array.from({ length: count }).map(() => ({
          type: 'columnBlock',
          content: [{ type: 'paragraph' }],
        })),
      })
      .run()
  },
}

export const columnBlock: BlockDefinition = {
  name: 'columnBlock',
  title: 'Column',
  description: 'Single column (auto-created inside Columns)',
  category: 'layout',
  icon: Columns3,
  node: ColumnNode,
  hidden: true,
}

/* ══════════════════════════════════════════════════════════════════════════
 * DIVIDER
 * ═════════════════════════════════════════════════════════════════════════*/
const DividerView = ({ node, selected }: { node: any; selected: boolean }) => {
  const { variant, thickness, width, color, marginY, align } = node.attrs
  const just = align === 'left' ? 'justify-start' : align === 'right' ? 'justify-end' : 'justify-center'
  const style =
    variant === 'solid'
      ? { borderTopWidth: `${thickness}px`, borderTopStyle: 'solid' as const, borderTopColor: color }
      : variant === 'dashed'
        ? { borderTopWidth: `${thickness}px`, borderTopStyle: 'dashed' as const, borderTopColor: color }
        : variant === 'dotted'
          ? { borderTopWidth: `${thickness}px`, borderTopStyle: 'dotted' as const, borderTopColor: color }
          : { height: `${thickness}px`, background: `linear-gradient(90deg, transparent, ${color}, transparent)` }
  return (
    <NodeViewWrapper data-block="divider" className={cx('flex', just, selected && 'ring-2 ring-brand-blue')} data-drag-handle>
      <div style={{ width: `${width}%`, marginTop: `${marginY}px`, marginBottom: `${marginY}px` }}>
        <div style={style} />
      </div>
    </NodeViewWrapper>
  )
}

const DividerNode = Node.create({
  name: 'dividerBlock',
  group: 'block',
  draggable: true,
  addAttributes() {
    return {
      variant: { default: 'solid', renderHTML: suppress },
      thickness: { default: 1, renderHTML: suppress },
      width: { default: 60, renderHTML: suppress },
      color: { default: '#E2E8F0', renderHTML: suppress },
      marginY: { default: 24, renderHTML: suppress },
      align: { default: 'center', renderHTML: suppress },
    }
  },
  parseHTML() {
    return [{ tag: 'div[data-block="divider"]' }]
  },
  renderHTML({ node, HTMLAttributes }) {
    const { variant, thickness, width, color, marginY, align } = node.attrs
    const just = align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center'
    const style =
      variant === 'gradient'
        ? `height:${thickness}px;background:linear-gradient(90deg,transparent,${color},transparent)`
        : `border-top:${thickness}px ${variant} ${color}`
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-block': 'divider', style: `display:flex;justify-content:${just}` }),
      ['div', { style: `width:${width}%;margin-top:${marginY}px;margin-bottom:${marginY}px;${style}` }],
    ]
  },
  addNodeView() {
    return ReactNodeViewRenderer(DividerView)
  },
})

export const dividerBlock: BlockDefinition = {
  name: 'dividerBlock',
  title: 'Divider',
  description: 'Horizontal rule / separator',
  category: 'design',
  icon: Minus,
  keywords: ['divider', 'hr', 'separator', 'line', 'rule'],
  node: DividerNode,
  defaults: { variant: 'solid', thickness: 1, width: 60, color: '#E2E8F0', marginY: 24, align: 'center' },
  options: [
    {
      key: 'variant',
      label: 'Style',
      type: 'segmented',
      choices: [
        { label: 'Solid', value: 'solid' },
        { label: 'Dashed', value: 'dashed' },
        { label: 'Dotted', value: 'dotted' },
        { label: 'Fade', value: 'gradient' },
      ],
    },
    { key: 'thickness', label: 'Thickness', type: 'range', min: 1, max: 12, step: 1 },
    { key: 'width', label: 'Width (%)', type: 'range', min: 10, max: 100, step: 5 },
    { key: 'color', label: 'Color', type: 'color' },
    { key: 'marginY', label: 'Space above & below (px)', type: 'range', min: 0, max: 80, step: 4 },
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
 * SPACER
 * ═════════════════════════════════════════════════════════════════════════*/
const SpacerView = ({ node, selected }: { node: any; selected: boolean }) => (
  <NodeViewWrapper data-block="spacer" data-drag-handle>
    <div
      className={cx('w-full', node.attrs.hideOnMobile && 'hidden sm:block', selected && 'bg-brand-blue/10')}
      style={{
        height: `${node.attrs.height}px`,
        backgroundImage: selected ? undefined : 'repeating-linear-gradient(45deg,#F1F5F9,#F1F5F9 6px,transparent 6px,transparent 12px)',
      }}
    />
  </NodeViewWrapper>
)

const SpacerNode = Node.create({
  name: 'spacerBlock',
  group: 'block',
  draggable: true,
  addAttributes() {
    return {
      height: { default: 48, renderHTML: suppress },
      hideOnMobile: { default: false, renderHTML: suppress },
    }
  },
  parseHTML() {
    return [{ tag: 'div[data-block="spacer"]' }]
  },
  renderHTML({ node, HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-block': 'spacer',
        class: node.attrs.hideOnMobile ? 'hidden sm:block' : '',
        style: `height:${node.attrs.height}px`,
      }),
    ]
  },
  addNodeView() {
    return ReactNodeViewRenderer(SpacerView)
  },
})

export const spacerBlock: BlockDefinition = {
  name: 'spacerBlock',
  title: 'Spacer',
  description: 'Adjustable vertical whitespace',
  category: 'design',
  icon: MoveVertical,
  keywords: ['spacer', 'space', 'gap', 'whitespace'],
  node: SpacerNode,
  defaults: { height: 48, hideOnMobile: false },
  options: [
    { key: 'height', label: 'Height (px)', type: 'range', min: 8, max: 200, step: 8 },
    { key: 'hideOnMobile', label: 'Hide on mobile', type: 'toggle' },
  ],
}

export const layoutBlocks: BlockDefinition[] = [columnsBlock, columnBlock, dividerBlock, spacerBlock]

