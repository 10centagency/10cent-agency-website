import { Node } from '@tiptap/core'
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
import { TableKit } from '@tiptap/extension-table'
import { TableStyles } from '../extensions/tableStyles'
import { Table2, Code, ListTree } from 'lucide-react'
import type { BlockDefinition } from '../types'
import { cx, jsonAttr, mergeAttributes, suppress } from './helpers'

/* ══════════════════════════════════════════════════════════════════════════
 * TABLE  (Tiptap official TableKit — fully editable)
 * ═════════════════════════════════════════════════════════════════════════*/
export const tableBlock: BlockDefinition = {
  name: 'table',
  title: 'Table',
  description: 'Editable table with header row',
  category: 'advanced',
  icon: Table2,
  keywords: ['table', 'grid', 'rows', 'columns', 'data'],
  // TableKit + TableStyles (our own style attributes) — as an array
  node: [
    TableKit.configure({
      table: { resizable: true, lastColumnResizable: true, allowTableNodeSelection: true },
    }),
    TableStyles,
  ],
  insert: ({ editor }) =>
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
  defaults: {
    tableBorders: 'all',
    tableStriped: false,
    tableCompact: false,
    tableHover: false,
    tableHeaderBg: '',
    tableSticky: false,
  },
  options: [
    {
      key: 'tableBorders',
      label: 'Borders',
      type: 'segmented',
      choices: [
        { label: 'All', value: 'all' },
        { label: 'Rows', value: 'horizontal' },
        { label: 'None', value: 'none' },
      ],
    },
    { key: 'tableStriped', label: 'Zebra rows', type: 'toggle' },
    { key: 'tableCompact', label: 'Compact padding', type: 'toggle' },
    { key: 'tableHover', label: 'Highlight row on hover', type: 'toggle' },
    { key: 'tableHeaderBg', label: 'Header background', type: 'color' },
    { key: 'tableSticky', label: 'Sticky header (stays visible when scrolling)', type: 'toggle' },
  ],
}

/* ══════════════════════════════════════════════════════════════════════════
 * RAW HTML
 * ═════════════════════════════════════════════════════════════════════════*/
const HtmlView = ({ node, selected }: { node: any; selected: boolean }) => {
  const { code } = node.attrs
  return (
    <NodeViewWrapper
      data-block="html"
      className={cx('my-2', selected && 'ring-2 ring-brand-blue ring-offset-2 rounded-lg')}
      data-drag-handle
    >
      {code ? (
        <div className="raw-html" dangerouslySetInnerHTML={{ __html: code }} />
      ) : (
        <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-xs text-slate-400">
          Raw HTML — paste your code in the inspector →
        </div>
      )}
    </NodeViewWrapper>
  )
}

const HtmlNode = Node.create({
  name: 'htmlBlock',
  group: 'block',
  draggable: true,
  addAttributes() {
    return {
      code: {
        default: '',
        parseHTML: (el) => el.getAttribute('data-code') || '',
        renderHTML: (attrs) => ({ 'data-code': encodeURIComponent(attrs.code || '') }),
      },
    }
  },
  parseHTML() {
    return [{ tag: 'div[data-block="html"]' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-block': 'html', class: 'my-6 raw-html' })]
  },
  addNodeView() {
    return ReactNodeViewRenderer(HtmlView)
  },
})

export const htmlBlock: BlockDefinition = {
  name: 'htmlBlock',
  title: 'Raw HTML',
  description: 'Custom HTML / scripts (advanced)',
  category: 'advanced',
  icon: Code,
  keywords: ['html', 'raw', 'code', 'custom', 'script', 'embed'],
  node: HtmlNode,
  defaults: { code: '' },
  options: [{ key: 'code', label: 'HTML code', type: 'textarea', rows: 8, placeholder: '<div>your code</div>' }],
}

/* ══════════════════════════════════════════════════════════════════════════
 * TABLE OF CONTENTS  (manual links)
 * ═════════════════════════════════════════════════════════════════════════*/
const TocView = ({ node, selected }: { node: any; selected: boolean }) => {
  const { title, links, columns, numbered, bgColor, border } = node.attrs
  return (
    <NodeViewWrapper
      data-block="toc"
      className={cx('my-2', selected && 'ring-2 ring-brand-blue ring-offset-2 rounded-lg')}
      data-drag-handle
    >
      <nav
        className={cx('rounded-xl bg-slate-50 p-5', border && 'border border-slate-200')}
        style={bgColor ? { backgroundColor: bgColor } : undefined}
      >
        {title && <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>}
        <ol className={cx(numbered ? 'list-decimal space-y-1 pl-5' : 'space-y-1', Number(columns) === 2 && 'grid gap-1 sm:grid-cols-2')}>
          {(links as { label: string; url: string }[]).map((l, i) => (
            <li key={i}>
              <a href={l.url || '#'} className="text-sm text-blue-600 hover:underline">
                {l.label || `Section ${i + 1}`}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </NodeViewWrapper>
  )
}

const TocNode = Node.create({
  name: 'tocBlock',
  group: 'block',
  draggable: true,
  addAttributes() {
    return {
      title: { default: 'On this page', renderHTML: suppress },
      links: jsonAttr([{ label: 'Section one', url: '#section-one' }]),
      columns: { default: 1, renderHTML: suppress },
      numbered: { default: false, renderHTML: suppress },
      bgColor: { default: '', renderHTML: suppress },
      border: { default: true, renderHTML: suppress },
    }
  },
  parseHTML() {
    return [{ tag: 'nav[data-block="toc"]' }]
  },
  renderHTML({ node, HTMLAttributes }) {
    const { title, links, columns, numbered, bgColor, border } = node.attrs
    const items = (links as { label: string; url: string }[]).map((l) => [
      'li',
      {},
      ['a', { href: l.url || '#', class: 'text-sm text-blue-600 hover:underline' }, l.label],
    ])
    return [
      'nav',
      mergeAttributes(HTMLAttributes, {
        'data-block': 'toc',
        class: cx('my-6 rounded-xl bg-slate-50 p-5', border && 'border border-slate-200'),
        ...(bgColor ? { style: `background-color:${bgColor}` } : {}),
      }),
      title ? ['p', { class: 'mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500' }, title] : ['span', { class: 'hidden' }],
      ['ol', { class: cx(numbered ? 'list-decimal space-y-1 pl-5' : 'space-y-1', Number(columns) === 2 && 'grid gap-1 sm:grid-cols-2') }, ...items],
    ]
  },
  addNodeView() {
    return ReactNodeViewRenderer(TocView)
  },
})

export const tocBlock: BlockDefinition = {
  name: 'tocBlock',
  title: 'Table of Contents',
  description: 'Jump links list for long posts',
  category: 'advanced',
  icon: ListTree,
  keywords: ['toc', 'contents', 'index', 'jump', 'outline'],
  node: TocNode,
  defaults: {
    title: 'On this page',
    links: [{ label: 'Section one', url: '#section-one' }],
    columns: 1,
    numbered: false,
    bgColor: '',
    border: true,
  },
  options: [
    { key: 'title', label: 'Title', type: 'text' },
    {
      key: 'columns',
      label: 'Layout',
      type: 'segmented',
      choices: [
        { label: 'Single', value: '1' },
        { label: 'Two column', value: '2' },
      ],
    },
    { key: 'numbered', label: 'Numbered list', type: 'toggle' },
    { key: 'bgColor', label: 'Background colour', type: 'color' },
    { key: 'border', label: 'Border', type: 'toggle' },
    {
      key: 'links',
      label: 'Links',
      type: 'list',
      itemLabel: 'Link',
      max: 20,
      defaultItem: { label: 'New section', url: '#section' },
      fields: [
        { key: 'label', label: 'Label', type: 'text' },
        { key: 'url', label: 'Anchor / URL', type: 'text', placeholder: '#section-one' },
      ],
    },
  ],
}

export const advancedBlocks: BlockDefinition[] = [tableBlock, htmlBlock, tocBlock]

