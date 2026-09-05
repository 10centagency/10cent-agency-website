import { Node } from '@tiptap/core'
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
import { TableKit } from '@tiptap/extension-table'
import { Table2, Code, ListTree } from 'lucide-react'
import type { BlockDefinition } from '../types'
import { cx, jsonAttr, mergeAttributes, suppress } from './helpers'

/* ══════════════════════════════════════════════════════════════════════════
 * TABLE  (Tiptap-এর official TableKit — সম্পূর্ণ editable)
 * ═════════════════════════════════════════════════════════════════════════*/
export const tableBlock: BlockDefinition = {
  name: 'table',
  title: 'Table',
  description: 'Editable table with header row',
  category: 'advanced',
  icon: Table2,
  keywords: ['table', 'grid', 'rows', 'columns', 'data'],
  node: TableKit.configure({
    table: { resizable: true, lastColumnResizable: true, allowTableNodeSelection: true },
  }),
  insert: ({ editor }) =>
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
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
  const { title, links } = node.attrs
  return (
    <NodeViewWrapper
      data-block="toc"
      className={cx('my-2', selected && 'ring-2 ring-brand-blue ring-offset-2 rounded-lg')}
      data-drag-handle
    >
      <nav className="rounded-xl border border-slate-200 bg-slate-50 p-5">
        {title && <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>}
        <ol className="space-y-1">
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
    }
  },
  parseHTML() {
    return [{ tag: 'nav[data-block="toc"]' }]
  },
  renderHTML({ node, HTMLAttributes }) {
    const { title, links } = node.attrs
    const items = (links as { label: string; url: string }[]).map((l) => [
      'li',
      {},
      ['a', { href: l.url || '#', class: 'text-sm text-blue-600 hover:underline' }, l.label],
    ])
    return [
      'nav',
      mergeAttributes(HTMLAttributes, { 'data-block': 'toc', class: 'my-6 rounded-xl border border-slate-200 bg-slate-50 p-5' }),
      title ? ['p', { class: 'mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500' }, title] : ['span', { class: 'hidden' }],
      ['ol', { class: 'space-y-1' }, ...items],
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
  defaults: { title: 'On this page', links: [{ label: 'Section one', url: '#section-one' }] },
  options: [
    { key: 'title', label: 'Title', type: 'text' },
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
