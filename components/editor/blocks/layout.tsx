import { Node } from '@tiptap/core'
import { NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
import { Columns3, Minus, MoveVertical } from 'lucide-react'
import type { BlockDefinition } from '../types'
import { cx, mergeAttributes, suppress } from './helpers'

/* ══════════════════════════════════════════════════════════════════════════
 * COLUMNS  — nested content block (Gutenberg-এর মতো block-এর ভেতরে block)
 * columnsBlock → columnBlock+ → block+
 * ═════════════════════════════════════════════════════════════════════════*/
const ColumnsView = ({ node, selected }: { node: any; selected: boolean }) => {
  const { template, gap, divider } = node.attrs
  return (
    <NodeViewWrapper data-block="columns"
      className={cx('my-2 rounded-lg', selected && 'ring-2 ring-brand-blue ring-offset-2')}
      data-drag-handle
    >
      <div
        className="grid"
        style={{
          gridTemplateColumns: template,
          gap: `${gap}px`,
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
      verticalAlign: { default: 'start', renderHTML: suppress },
    }
  },
  parseHTML() {
    return [{ tag: 'div[data-block="columns"]' }]
  },
  renderHTML({ node, HTMLAttributes }) {
    const { template, gap } = node.attrs
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-block': 'columns',
        class: 'my-6 grid',
        style: `grid-template-columns: ${template || '1fr 1fr'}; gap: ${gap ?? 24}px;`,
      }),
      0,
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
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-block': 'column', class: 'min-w-0' }), 0]
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
  defaults: { template: '1fr 1fr', gap: 24, divider: false, verticalAlign: 'start' },
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
        { label: '1 / 1', value: '1fr 1fr' },
        { label: '1 / 1 / 1', value: '1fr 1fr 1fr' },
        { label: '1 / 1 / 1 / 1', value: 'repeat(4, 1fr)' },
        { label: '1 / 2', value: '1fr 2fr' },
        { label: '2 / 1', value: '2fr 1fr' },
      ],
    },
    {
      key: 'verticalAlign',
      label: 'Vertical align',
      type: 'segmented',
      choices: [
        { label: 'Top', value: 'start' },
        { label: 'Center', value: 'center' },
        { label: 'Bottom', value: 'end' },
      ],
    },
    { key: 'gap', label: 'Gap (px)', type: 'range', min: 0, max: 64, step: 4 },
    { key: 'divider', label: 'Show divider under', type: 'toggle' },
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
        attrs: { template: '1fr 1fr', gap: 24, divider: false, verticalAlign: 'start', ...attrs },
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
  const { variant, thickness, width, color } = node.attrs
  const style =
    variant === 'solid'
      ? { borderTopWidth: `${thickness}px`, borderTopStyle: 'solid' as const, borderTopColor: color }
      : variant === 'dashed'
        ? { borderTopWidth: `${thickness}px`, borderTopStyle: 'dashed' as const, borderTopColor: color }
        : variant === 'dotted'
          ? { borderTopWidth: `${thickness}px`, borderTopStyle: 'dotted' as const, borderTopColor: color }
          : { height: `${thickness}px`, background: `linear-gradient(90deg, transparent, ${color}, transparent)` }
  return (
    <NodeViewWrapper data-block="divider" className={cx('my-1 flex', selected && 'ring-2 ring-brand-blue')} data-drag-handle>
      <div className="mx-auto" style={{ width: `${width}%` }}>
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
    }
  },
  parseHTML() {
    return [{ tag: 'div[data-block="divider"]' }]
  },
  renderHTML({ node, HTMLAttributes }) {
    const { variant, thickness, width, color } = node.attrs
    const style =
      variant === 'gradient'
        ? `height:${thickness}px;background:linear-gradient(90deg,transparent,${color},transparent);width:${width}%;margin:2rem auto`
        : `border-top:${thickness}px ${variant} ${color};width:${width}%;margin:2rem auto`
    return ['div', mergeAttributes(HTMLAttributes, { 'data-block': 'divider', style })]
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
  defaults: { variant: 'solid', thickness: 1, width: 60, color: '#E2E8F0' },
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
  ],
}

/* ══════════════════════════════════════════════════════════════════════════
 * SPACER
 * ═════════════════════════════════════════════════════════════════════════*/
const SpacerView = ({ node, selected }: { node: any; selected: boolean }) => (
  <NodeViewWrapper data-block="spacer" data-drag-handle>
    <div
      className={cx('w-full', selected && 'bg-brand-blue/10')}
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
    return { height: { default: 48, renderHTML: suppress } }
  },
  parseHTML() {
    return [{ tag: 'div[data-block="spacer"]' }]
  },
  renderHTML({ node, HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-block': 'spacer', style: `height:${node.attrs.height}px` })]
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
  defaults: { height: 48 },
  options: [{ key: 'height', label: 'Height (px)', type: 'range', min: 8, max: 200, step: 8 }],
}

export const layoutBlocks: BlockDefinition[] = [columnsBlock, columnBlock, dividerBlock, spacerBlock]
