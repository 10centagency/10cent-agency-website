# ENGINE SOURCE — 10centagency Block Editor

এই ফাইলে `components/editor/` ফোল্ডারের **সব ফাইল** আছে — Antigravity-তে
`02-prompt-phase1.md`-এর prompt দিলে ও নিজেই এখান থেকে সব ফাইল তৈরি করে দেবে।

**আপনাকে কিছু করতে হবে না** — শুধু এই ফাইলটা project root-এ রাখুন।

প্রতিটা ফাইল শুরু হয় `<!-- FILE: ... -->` দিয়ে, তারপর code block-এ ফাইলের content।

- মোট ফাইল: **25** (24 টি .ts/.tsx + 1 টি editor.css)
- Block: **32 টি registered → inserter-এ 38 টি item**
- বাহ্যিক dependency: শুধু `@tiptap/*`, `lucide-react`, `react` (`@/` alias নেই)
- ✅ strict TypeScript (target es5, jsx preserve) — 0 errors

---

<!-- FILE: components/editor/BlockEditor.tsx -->
```tsx
import { useEffect, useMemo, useRef, useState } from 'react'
import { useEditor, useEditorState, EditorContent } from '@tiptap/react'
import type { JSONContent } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import UniqueID from '@tiptap/extension-unique-id'
import FileHandler from '@tiptap/extension-file-handler'
import {
  Plus, Undo2, Redo2, Eye, Pencil, Braces, Copy, Check, RotateCcw, Sparkles,
} from 'lucide-react'

import { customNodeNames, extensionsFromRegistry, insertBlock } from './registry'
import { SlashCommand } from './extensions/slashCommand'
import BlockPicker from './surfaces/BlockPicker'
import BlockHandle from './surfaces/BlockHandle'
import FormatToolbar from './surfaces/FormatToolbar'
import Inspector from './surfaces/Inspector'
import { activeBlock } from './commands'
import { renderDocToHtml } from './render'
import { demoDoc } from './demoContent'
import { cx } from './blocks/helpers'
import type { InserterItem, UploadFn } from './types'

export type { UploadFn }

const EMPTY_DOC: JSONContent = { type: 'doc', content: [{ type: 'paragraph' }] }

const IMAGE_MIME = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml']

/**
 * Client editor extension list.
 * ⚠️ renderExtensions() (render.ts) এর সাথে node/mark list মিল থাকতে হবে।
 */
export function editorExtensions(upload?: UploadFn) {
  const list = [
    // StarterKit v3.31-এ বিল্ট-ইন: underline, link, trailingNode, listKeymap, undoRedo
    StarterKit.configure({
      heading: { levels: [1, 2, 3, 4] },
      link: { openOnClick: false, autolink: true },
      trailingNode: {}, // ডকুমেন্টের শেষে সবসময় একটা paragraph
    }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Placeholder.configure({
      placeholder: ({ node }) =>
        node.type.name === 'heading' ? 'Heading…' : "Type '/' to choose a block",
    }),
    UniqueID.configure({
      attributeName: 'blockId',
      types: [...customNodeNames(), 'heading'],
    }),
    ...extensionsFromRegistry(),
    SlashCommand,
  ]

  if (upload) {
    list.push(
      FileHandler.configure({
        allowedMimeTypes: IMAGE_MIME,
        consumePasteEvent: true,
        onDrop: (ed, files, pos) => {
          files.forEach(async (file) => {
            const url = await upload(file)
            if (url) ed.chain().insertContentAt(pos, { type: 'imageBlock', attrs: { src: url, alt: file.name } }).focus().run()
          })
        },
        onPaste: (ed, files) => {
          files.forEach(async (file) => {
            const url = await upload(file)
            if (url) ed.chain().insertContent({ type: 'imageBlock', attrs: { src: url, alt: file.name } }).focus().run()
          })
        },
      }),
    )
  }

  return list
}

type Mode = 'edit' | 'preview' | 'json'

export interface BlockEditorProps {
  /** 저장된 Tiptap JSON — null হলে empty doc */
  value?: JSONContent | null
  onChange?: (json: JSONContent) => void
  /** Supabase-এ আপলোড করে public URL দেয় (FileHandler + inspector upload) */
  upload?: UploadFn
  /** demo mode: Preview/JSON tab + Reset বাটন + demo content */
  demo?: boolean
}

export default function BlockEditor({ value, onChange, upload, demo = false }: BlockEditorProps) {
  const [mode, setMode] = useState<Mode>('edit')
  const [pickerOpen, setPickerOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const lastEmitted = useRef<JSONContent | null>(null)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const initialContent = useMemo(
    () => value ?? (demo ? demoDoc : EMPTY_DOC),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const editor = useEditor({
    extensions: editorExtensions(upload),
    content: initialContent as any,
    autofocus: false,
    onUpdate: ({ editor: ed }) => {
      const json = ed.getJSON()
      lastEmitted.current = json
      onChangeRef.current?.(json)
    },
  })

  /* value বাইরে থেকে change হলে (যেমন async load) editor সিঙ্ক করো */
  useEffect(() => {
    if (!editor || value === undefined) return
    if (value === lastEmitted.current) return
    editor.commands.setContent(value ?? EMPTY_DOC, { emitUpdate: false })
    lastEmitted.current = value ?? null
  }, [value, editor])

  const state = useEditorState({
    editor,
    selector: ({ editor: ed }) => ({
      active: ed ? activeBlock(ed) : null,
      canUndo: ed?.can().undo() ?? false,
      canRedo: ed?.can().redo() ?? false,
      words: ed
        ? ed.state.doc.textBetween(0, ed.state.doc.content.size, ' ').trim().split(/\s+/).filter(Boolean).length
        : 0,
      blocks: ed?.state.doc.childCount ?? 0,
    }),
  })

  // ★ public page-এ যা render হবে, ঠিক সেটাই (renderExtensions + raw-HTML decode)
  const html = useMemo(() => {
    if (mode !== 'preview' || !editor) return ''
    try {
      return renderDocToHtml(editor.getJSON())
    } catch (err) {
      return `<pre style="color:red">${String(err)}</pre>`
    }
  }, [mode, editor, state?.blocks])

  if (!editor) return <div className="p-6 text-sm text-slate-400">Loading editor…</div>

  const onPick = (item: InserterItem) => {
    setPickerOpen(false)
    if (!editor.isFocused) editor.chain().focus('end').run()
    insertBlock(editor, item.blockName, item.attrs)
  }

  return (
    <div className={cx('flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white font-sans', demo && 'h-screen')}>
      {/* ══ Top bar ══════════════════════════════════════════════════════ */}
      <header className="z-40 flex h-12 shrink-0 items-center gap-2 border-b border-slate-200 bg-white px-3">
        {demo && (
          <>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-blue text-white">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <span className="mr-1 text-sm font-bold text-slate-800">Block Editor</span>
            <span className="h-6 w-px bg-slate-200" />
          </>
        )}

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!state?.canUndo}
          className="rounded p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
          title="Undo"
        >
          <Undo2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!state?.canRedo}
          className="rounded p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
          title="Redo"
        >
          <Redo2 className="h-4 w-4" />
        </button>

        <span className="h-6 w-px bg-slate-200" />

        {/* Add Block (inserter) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setPickerOpen((v) => !v)}
            className={cx(
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
              pickerOpen ? 'bg-brand-blue text-white' : 'bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/20',
            )}
          >
            <Plus className="h-4 w-4" />
            Add Block
          </button>
          {pickerOpen && (
            <div className="absolute left-0 top-full z-50 mt-1.5">
              <BlockPicker onPick={onPick} onClose={() => setPickerOpen(false)} />
            </div>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="hidden text-xs text-slate-400 sm:inline">
            {state?.blocks ?? 0} blocks · {state?.words ?? 0} words
          </span>

          {demo && (
            <>
              <div className="flex overflow-hidden rounded-lg border border-slate-200">
                {(
                  [
                    { id: 'edit', label: 'Edit', icon: Pencil },
                    { id: 'preview', label: 'Preview', icon: Eye },
                    { id: 'json', label: 'JSON', icon: Braces },
                  ] as const
                ).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMode(m.id)}
                    className={cx(
                      'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors',
                      mode === m.id ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-50',
                    )}
                  >
                    <m.icon className="h-3.5 w-3.5" />
                    {m.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(JSON.stringify(editor.getJSON(), null, 2))
                  setCopied(true)
                  setTimeout(() => setCopied(false), 1600)
                }}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy JSON'}
              </button>

              <button
                type="button"
                onClick={() => {
                  editor.commands.setContent(demoDoc as any)
                  setMode('edit')
                }}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                title="Reset demo content"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>
            </>
          )}
        </div>
      </header>

      {/* ══ Body ═════════════════════════════════════════════════════════ */}
      <div className={cx('flex min-h-0 flex-1', !demo && 'max-h-[75vh]')}>
        <main className="flex-1 overflow-y-auto bg-slate-50">
          <div className={cx('mx-auto px-6 py-8', demo ? 'max-w-3xl' : 'max-w-none')}>
            {mode === 'edit' && (
              <div className="rounded-2xl border border-slate-200 bg-white px-8 py-8 shadow-sm">
                <FormatToolbar editor={editor} />
                <BlockHandle editor={editor} />
                <EditorContent editor={editor} className="tiptap-canvas" />
              </div>
            )}

            {mode === 'preview' && (
              <div className="rounded-2xl border border-slate-200 bg-white px-8 py-8 shadow-sm">
                <div className="mb-6 rounded-lg bg-amber-50 px-4 py-2.5 text-xs text-amber-800">
                  <strong>Static render</strong> — public page-এ যা দেখাবে (<code>generateHTML()</code>)
                </div>
                <div className="preview-content" dangerouslySetInnerHTML={{ __html: html }} />
              </div>
            )}

            {mode === 'json' && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <pre className="max-h-[60vh] overflow-auto rounded-lg bg-slate-900 p-4 text-[11px] leading-relaxed text-slate-100">
                  {JSON.stringify(editor.getJSON(), null, 2)}
                </pre>
              </div>
            )}
          </div>
        </main>

        <Inspector editor={editor} active={state?.active ?? null} upload={upload} />
      </div>
    </div>
  )
}
```

<!-- FILE: components/editor/blocks/advanced.tsx -->
```tsx
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
```

<!-- FILE: components/editor/blocks/core.tsx -->
```tsx
import { Text as TextIcon, Heading as HeadingIcon, List, ListOrdered, Quote, Code2 } from 'lucide-react'
import type { BlockDefinition } from '../types'

/**
 * Core text blocks — এগুলোর কোনো custom node নেই,
 * StarterKit-এর node-কে registry দিয়ে "block" হিসেবে expose করা হয়েছে মাত্র।
 */

export const paragraphBlock: BlockDefinition = {
  name: 'paragraph',
  title: 'Paragraph',
  description: 'Plain body text',
  category: 'text',
  icon: TextIcon,
  keywords: ['text', 'body', 'p'],
  options: [
    {
      key: 'textAlign',
      label: 'Alignment',
      type: 'segmented',
      choices: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
  ],
  insert: ({ editor }) => editor.chain().focus().setParagraph().run(),
}

export const headingBlock: BlockDefinition = {
  name: 'heading',
  title: 'Heading',
  description: 'Section title',
  category: 'text',
  icon: HeadingIcon,
  keywords: ['title', 'h1', 'h2', 'h3', 'heading'],
  defaults: { level: 2, textAlign: 'left' },
  variations: [
    { title: 'Heading 1', attrs: { level: 1 }, keywords: ['h1', 'big title'] },
    { title: 'Heading 2', attrs: { level: 2 }, keywords: ['h2', 'title'] },
    { title: 'Heading 3', attrs: { level: 3 }, keywords: ['h3', 'subtitle'] },
    { title: 'Heading 4', attrs: { level: 4 }, keywords: ['h4'] },
  ],
  options: [
    {
      key: 'level',
      label: 'Level',
      type: 'select',
      choices: [
        { label: 'H1', value: '1' },
        { label: 'H2', value: '2' },
        { label: 'H3', value: '3' },
        { label: 'H4', value: '4' },
      ],
    },
    {
      key: 'textAlign',
      label: 'Alignment',
      type: 'segmented',
      choices: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
  ],
  insert: ({ editor, attrs }) =>
    editor.chain().focus().toggleHeading({ level: (attrs?.level as 1 | 2 | 3 | 4) ?? 2 }).run(),
}

export const bulletListBlock: BlockDefinition = {
  name: 'bulletList',
  title: 'Bullet List',
  description: 'Unordered list',
  category: 'text',
  icon: List,
  keywords: ['ul', 'unordered', 'points'],
  insert: ({ editor }) => editor.chain().focus().toggleBulletList().run(),
}

export const orderedListBlock: BlockDefinition = {
  name: 'orderedList',
  title: 'Numbered List',
  description: 'Ordered list',
  category: 'text',
  icon: ListOrdered,
  keywords: ['ol', 'ordered', 'number', 'steps'],
  insert: ({ editor }) => editor.chain().focus().toggleOrderedList().run(),
}

export const quoteBlock: BlockDefinition = {
  name: 'blockquote',
  title: 'Quote',
  description: 'Pull quote / citation',
  category: 'text',
  icon: Quote,
  keywords: ['blockquote', 'cite', 'testimonial'],
  insert: ({ editor }) => editor.chain().focus().toggleBlockquote().run(),
}

export const codeBlockDef: BlockDefinition = {
  name: 'codeBlock',
  title: 'Code',
  description: 'Syntax-highlighted code block',
  category: 'text',
  icon: Code2,
  keywords: ['code', 'snippet', 'pre'],
  insert: ({ editor }) => editor.chain().focus().toggleCodeBlock().run(),
}

export const coreBlocks: BlockDefinition[] = [
  paragraphBlock,
  headingBlock,
  bulletListBlock,
  orderedListBlock,
  quoteBlock,
  codeBlockDef,
]
```

<!-- FILE: components/editor/blocks/design.tsx -->
```tsx
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
  return (
    <NodeViewWrapper data-block="callout" className={cx('my-2', selected && 'rounded-lg ring-2 ring-brand-blue ring-offset-2')} data-drag-handle>
      <div className={cx('rounded-r-xl px-5 py-4', v.wrap)}>
        {node.attrs.title && (
          <p className={cx('mb-1 flex items-center gap-2 text-sm font-bold', v.title)}>
            <span>{v.icon}</span>
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
    }
  },
  parseHTML() {
    return [{ tag: 'div[data-block="callout"]' }]
  },
  renderHTML({ node, HTMLAttributes }) {
    const v = VARIANTS[node.attrs.variant] ?? VARIANTS.info
    const children: any[] = []
    if (node.attrs.title) {
      children.push(['p', { class: `mb-1 text-sm font-bold ${v.title}` }, `${v.icon} ${node.attrs.title}`])
    }
    children.push(['div', { class: 'text-sm leading-relaxed text-slate-700' }, 0])
    return ['div', mergeAttributes(HTMLAttributes, { 'data-block': 'callout', class: `my-6 rounded-r-xl px-5 py-4 ${v.wrap}` }), ...children]
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
  defaults: { variant: 'info', title: '' },
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
  const { title, colors, size } = node.attrs
  return (
    <NodeViewWrapper data-block="palette" className={cx('my-2', selected && 'rounded-lg ring-2 ring-brand-blue ring-offset-2')} data-drag-handle>
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        {title && <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>}
        <div className="flex flex-wrap gap-4">
          {(colors as { hex: string; name: string }[]).map((c, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div
                className="rounded-xl border border-black/5 shadow-sm"
                style={{ backgroundColor: c.hex, width: `${size}px`, height: `${size}px` }}
              />
              <div className="text-center">
                <p className="font-mono text-[10px] font-medium text-slate-800">{String(c.hex).toUpperCase()}</p>
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
    }
  },
  parseHTML() {
    return [{ tag: 'div[data-block="palette"]' }]
  },
  renderHTML({ node, HTMLAttributes }) {
    const { title, colors, size } = node.attrs
    const swatches = (colors as { hex: string; name: string }[]).map((c) => [
      'div',
      { class: 'flex flex-col items-center gap-1' },
      ['div', { style: `width:${size}px;height:${size}px;background:${c.hex}`, class: 'rounded-xl border border-black/5 shadow-sm' }],
      ['p', { class: 'font-mono text-[10px] font-medium text-slate-800' }, String(c.hex).toUpperCase()],
      ['p', { class: 'text-[10px] text-slate-500' }, c.name],
    ])
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-block': 'palette', class: 'my-6 rounded-xl border border-slate-200 bg-white p-5' }),
      title ? ['p', { class: 'mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500' }, title] : ['span', { class: 'hidden' }],
      ['div', { class: 'flex flex-wrap gap-4' }, ...swatches],
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
  },
  options: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'size', label: 'Swatch size', type: 'range', min: 40, max: 120, step: 8 },
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
  const { title, fonts, showMeta } = node.attrs
  return (
    <NodeViewWrapper data-block="typography" className={cx('my-2', selected && 'ring-2 ring-brand-blue ring-offset-2 rounded-lg')} data-drag-handle>
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        {title && <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>}
        <div className="space-y-3">
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
                style={{ fontWeight: f.weight || '400', fontStyle: f.style?.toLowerCase().includes('italic') ? 'italic' : 'normal', fontSize: f.size || undefined }}
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
    }
  },
  parseHTML() { return [{ tag: 'div[data-block="typography"]' }] },
  renderHTML({ node, HTMLAttributes }) {
    const { title, fonts, showMeta } = node.attrs
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
          style: `font-weight:${f.weight || 400};font-style:${String(f.style || '').toLowerCase().includes('italic') ? 'italic' : 'normal'}${f.size ? `;font-size:${f.size}` : ''}`,
        },
        f.sample || 'The quick brown fox jumps over the lazy dog',
      ],
    ])
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-block': 'typography', class: 'my-6 rounded-xl border border-slate-200 bg-white p-5' }),
      title ? ['p', { class: 'mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500' }, title] : ['span', { class: 'hidden' }],
      ['div', { class: 'space-y-3' }, ...rows],
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
  },
  options: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'showMeta', label: 'Show font meta', type: 'toggle' },
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

const ButtonView = ({ node, selected }: { node: any; selected: boolean }) => {
  const { label, url, style, size, align, fullWidth, newTab } = node.attrs
  const justify = align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start'
  return (
    <NodeViewWrapper data-block="button" className={cx('my-2 flex', justify, selected && 'ring-2 ring-brand-blue rounded-lg')} data-drag-handle>
      <a
        href={url || '#'}
        target={newTab ? '_blank' : undefined}
        rel={newTab ? 'noopener noreferrer' : undefined}
        className={cx(
          'inline-flex items-center justify-center rounded-lg font-semibold transition-colors',
          BUTTON_STYLES[style] ?? BUTTON_STYLES.primary,
          BUTTON_SIZES[size] ?? BUTTON_SIZES.md,
          fullWidth && 'w-full',
        )}
      >
        {label || 'Button text'}
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
    }
  },
  parseHTML() { return [{ tag: 'div[data-block="button"]' }] },
  renderHTML({ node, HTMLAttributes }) {
    const { label, url, style, size, align, fullWidth, newTab } = node.attrs
    const justify = align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start'
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-block': 'button', class: `my-6 flex ${justify}` }),
      [
        'a',
        {
          href: url || '#',
          ...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
          class: cx(
            'inline-flex items-center justify-center rounded-lg font-semibold transition-colors',
            BUTTON_STYLES[style] ?? BUTTON_STYLES.primary,
            BUTTON_SIZES[size] ?? BUTTON_SIZES.md,
            fullWidth && 'w-full',
          ),
        },
        label || 'Button text',
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
  defaults: { label: 'Button text', url: '', style: 'primary', size: 'md', align: 'left', fullWidth: false, newTab: false },
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
  ],
}

export const designBlocks: BlockDefinition[] = [calloutBlock, colorPaletteBlock, typographyBlock, buttonBlock]
```

<!-- FILE: components/editor/blocks/helpers.tsx -->
```tsx
import { mergeAttributes } from '@tiptap/core'

/** attribute-কে root element-এ auto-render করতে দেবে না (আমরা নিজেরা markup বানাই) */
export const suppress = () => ({})

/** array / object attribute (images, colors, items …) — JSON round-trip */
export function jsonAttr<T>(defaultValue: T) {
  return {
    default: defaultValue as T,
    parseHTML: (element: HTMLElement) => {
      const raw = element.getAttribute('data-json')
      if (!raw) return defaultValue
      try {
        return JSON.parse(raw) as T
      } catch {
        return defaultValue
      }
    },
    renderHTML: () => ({}),
  }
}

/** দুইটা class list একসাথে করে */
export const cx = (...parts: (string | false | null | undefined)[]) =>
  parts.filter(Boolean).join(' ')

export { mergeAttributes }

/* ── Demo assets: data-URI SVG (কোনো external network লাগে না) ─────────────*/
export function demoImage(label: string, from = '#93C5FD', to = '#2563EB', w = 1200, h = 675) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${from}"/><stop offset="100%" stop-color="${to}"/>
    </linearGradient></defs>
    <rect width="${w}" height="${h}" fill="url(#g)"/>
    <text x="50%" y="50%" font-family="system-ui,sans-serif" font-size="${Math.round(w / 14)}"
      font-weight="700" fill="rgba(255,255,255,.92)" text-anchor="middle" dominant-baseline="middle">${label}</text>
  </svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

/* ── Shared small components ───────────────────────────────────────────────*/
export function EmptyImageBox({
  label = 'Image',
  className = '',
}: {
  label?: string
  className?: string
}) {
  return (
    <div
      className={cx(
        'flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400',
        className,
      )}
    >
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.5-3.5L3 21" />
      </svg>
      <span className="text-xs font-medium">No {label} — set a URL in the inspector →</span>
    </div>
  )
}
```

<!-- FILE: components/editor/blocks/index.ts -->
```ts
import { registerBlocks } from '../registry'
import { coreBlocks } from './core'
import { mediaBlocks } from './media'
import { layoutBlocks } from './layout'
import { designBlocks } from './design'
import { marketingBlocks } from './marketing'
import { advancedBlocks } from './advanced'

/**
 * ★★★  নতুন block যোগ করার একমাত্র জায়গা  ★★★
 * 1. blocks/ ফোল্ডারে নতুন ফাইল বানান (যেমন blocks/embeds.tsx)
 * 2. নিচের array তে সেটা যোগ করুন
 * → Inserter, slash menu, inspector, extension list, static render — সব auto-update
 */
export function registerAllBlocks() {
  registerBlocks([
    ...coreBlocks,
    ...mediaBlocks,
    ...layoutBlocks,
    ...designBlocks,
    ...marketingBlocks,
    ...advancedBlocks,
  ])
}

export { coreBlocks, mediaBlocks, layoutBlocks, designBlocks, marketingBlocks, advancedBlocks }
```

<!-- FILE: components/editor/blocks/layout.tsx -->
```tsx
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
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-block': 'columns', class: 'my-6' })]
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
    return ['div', mergeAttributes(HTMLAttributes, { 'data-block': 'column', class: 'min-w-0' })]
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
```

<!-- FILE: components/editor/blocks/marketing.tsx -->
```tsx
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
```

<!-- FILE: components/editor/blocks/media.tsx -->
```tsx
import { Node } from '@tiptap/core'
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
import { Image as ImageIcon, Images, Columns2, Maximize2, Play, Code2 } from 'lucide-react'
import type { BlockDefinition } from '../types'
import { cx, EmptyImageBox, jsonAttr, mergeAttributes, suppress } from './helpers'

/* ══════════════════════════════════════════════════════════════════════════
 * 1. IMAGE  — atom block + React NodeView + inspector options
 * ═════════════════════════════════════════════════════════════════════════*/
const ImageBlockView = ({ node, selected }: { node: any; selected: boolean }) => {
  const { src, alt, caption, align, width, rounded, shadow } = node.attrs
  const justify = align === 'left' ? 'justify-start' : align === 'right' ? 'justify-end' : 'justify-center'

  return (
    <NodeViewWrapper data-block="image"
      className={cx(
        'group relative my-2 flex flex-col rounded-lg transition-shadow',
        justify,
        selected && 'ring-2 ring-brand-blue ring-offset-2',
      )}
      data-drag-handle
    >
      <div style={{ width: `${width}%` }} className="flex flex-col gap-2">
        {src ? (
          <img
            src={src}
            alt={alt || ''}
            className={cx(
              'w-full object-cover',
              rounded && 'rounded-xl',
              shadow && 'shadow-md',
            )}
          />
        ) : (
          <EmptyImageBox label="image" className="aspect-[16/9] w-full" />
        )}
        {caption && (
          <figcaption className="text-center text-xs italic text-slate-500">{caption}</figcaption>
        )}
      </div>
    </NodeViewWrapper>
  )
}

const ImageBlockNode = Node.create({
  name: 'imageBlock',
  group: 'block',
  draggable: true,
  atom: false,

  addAttributes() {
    return {
      src: { default: '', parseHTML: (el) => el.querySelector('img')?.getAttribute('src') || '', renderHTML: suppress },
      alt: { default: '', parseHTML: (el) => el.querySelector('img')?.getAttribute('alt') || '', renderHTML: suppress },
      caption: { default: '', parseHTML: (el) => el.querySelector('figcaption')?.textContent || '', renderHTML: suppress },
      align: { default: 'center', renderHTML: suppress },
      width: { default: 100, renderHTML: suppress },
      rounded: { default: true, renderHTML: suppress },
      shadow: { default: true, renderHTML: suppress },
    }
  },

  parseHTML() {
    return [{ tag: 'figure[data-block="image"]' }]
  },

  renderHTML({ node, HTMLAttributes }) {
    const { src, alt, caption, align, width, rounded, shadow } = node.attrs
    const figureClass = cx('my-6 flex flex-col gap-2', align === 'left' ? 'items-start' : align === 'right' ? 'items-end' : 'items-center')
    const imgClass = cx('h-auto object-cover', rounded && 'rounded-xl', shadow && 'shadow-md')

    return [
      'figure',
      mergeAttributes(HTMLAttributes, { 'data-block': 'image', class: figureClass }),
      [
        'div',
        { style: `width:${width}%` },
        ['img', { src, alt: alt || '', class: imgClass }],
        caption ? ['figcaption', { class: 'mt-2 text-center text-xs italic text-slate-500' }, caption] : ['span', { class: 'hidden' }],
      ],
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageBlockView)
  },
})

export const imageBlock: BlockDefinition = {
  name: 'imageBlock',
  title: 'Image',
  description: 'Single image with caption + size controls',
  category: 'media',
  icon: ImageIcon,
  keywords: ['image', 'photo', 'picture', 'img'],
  node: ImageBlockNode,
  defaults: { src: '', alt: '', caption: '', align: 'center', width: 100, rounded: true, shadow: true },
  options: [
    { key: 'src', label: 'Image URL', type: 'url', placeholder: 'https://… or data:image/…' },
    { key: 'alt', label: 'Alt text (SEO)', type: 'text', placeholder: 'Describe the image' },
    { key: 'caption', label: 'Caption', type: 'text' },
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
    { key: 'width', label: 'Width (%)', type: 'range', min: 20, max: 100, step: 5 },
    { key: 'rounded', label: 'Rounded corners', type: 'toggle' },
    { key: 'shadow', label: 'Drop shadow', type: 'toggle' },
  ],
}

/* ══════════════════════════════════════════════════════════════════════════
 * 2. GALLERY / IMAGE GRID — repeater (list) options
 * ═════════════════════════════════════════════════════════════════════════*/
const GalleryView = ({ node, selected }: { node: any; selected: boolean }) => {
  const { images, columns, gap, rounded } = node.attrs
  return (
    <NodeViewWrapper data-block="gallery" className={cx('my-2', selected && 'ring-2 ring-brand-blue ring-offset-2 rounded-lg')} data-drag-handle>
      <div className="grid" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))`, gap: `${gap}px` }}>
        {(images as { src: string; alt: string }[]).map((img, i) =>
          img?.src ? (
            <img key={i} src={img.src} alt={img.alt || ''} className={cx('aspect-square w-full object-cover', rounded && 'rounded-lg')} />
          ) : (
            <EmptyImageBox key={i} label={`image ${i + 1}`} className="aspect-square w-full" />
          ),
        )}
      </div>
    </NodeViewWrapper>
  )
}

const GalleryNode = Node.create({
  name: 'galleryBlock',
  group: 'block',
  draggable: true,
  addAttributes() {
    return {
      images: jsonAttr([{ src: '', alt: '' }, { src: '', alt: '' }, { src: '', alt: '' }]),
      columns: { default: 3, renderHTML: suppress },
      gap: { default: 12, renderHTML: suppress },
      rounded: { default: true, renderHTML: suppress },
    }
  },
  parseHTML() {
    return [{ tag: 'div[data-block="gallery"]' }]
  },
  renderHTML({ node, HTMLAttributes }) {
    const { images, columns, gap, rounded } = node.attrs
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-block': 'gallery',
        class: 'my-6 grid',
        style: `grid-template-columns:repeat(${columns},minmax(0,1fr));gap:${gap}px`,
      }),
      ...(images as { src: string; alt: string }[])
        .filter((i) => i?.src)
        .map((img) => ['img', { src: img.src, alt: img.alt || '', class: cx('aspect-square w-full object-cover', rounded && 'rounded-lg') }]),
    ]
  },
  addNodeView() {
    return ReactNodeViewRenderer(GalleryView)
  },
})

export const galleryBlock: BlockDefinition = {
  name: 'galleryBlock',
  title: 'Gallery',
  description: 'Image grid — 2 / 3 / 4 columns',
  category: 'media',
  icon: Images,
  keywords: ['gallery', 'grid', 'photos', 'masonry'],
  node: GalleryNode,
  defaults: { images: [{ src: '', alt: '' }, { src: '', alt: '' }, { src: '', alt: '' }], columns: 3, gap: 12, rounded: true },
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
    { key: 'gap', label: 'Gap (px)', type: 'range', min: 0, max: 32, step: 4 },
    { key: 'rounded', label: 'Rounded corners', type: 'toggle' },
    {
      key: 'images',
      label: 'Images',
      type: 'list',
      itemLabel: 'Image',
      max: 12,
      defaultItem: { src: '', alt: '' },
      fields: [
        { key: 'src', label: 'URL', type: 'url', placeholder: 'https://…' },
        { key: 'alt', label: 'Alt text', type: 'text' },
      ],
    },
  ],
}

/* ══════════════════════════════════════════════════════════════════════════
 * 3. BEFORE / AFTER  (আপনার পুরনো image-duo block — modernized)
 * ═════════════════════════════════════════════════════════════════════════*/
const BeforeAfterView = ({ node, selected }: { node: any; selected: boolean }) => {
  const { leftSrc, rightSrc, leftLabel, rightLabel, caption } = node.attrs
  const side = (src: string, label: string) => (
    <div className="flex flex-col gap-2">
      {src ? (
        <img src={src} alt={label} className="aspect-[4/3] w-full rounded-lg object-cover" />
      ) : (
        <EmptyImageBox label={label} className="aspect-[4/3] w-full" />
      )}
      <span className="text-center text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</span>
    </div>
  )
  return (
    <NodeViewWrapper data-block="before-after" className={cx('my-2', selected && 'ring-2 ring-brand-blue ring-offset-2 rounded-lg')} data-drag-handle>
      <figure className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          {side(leftSrc, leftLabel)}
          {side(rightSrc, rightLabel)}
        </div>
        {caption && <figcaption className="text-center text-xs italic text-slate-500">{caption}</figcaption>}
      </figure>
    </NodeViewWrapper>
  )
}

const BeforeAfterNode = Node.create({
  name: 'beforeAfterBlock',
  group: 'block',
  draggable: true,
  addAttributes() {
    return {
      leftSrc: { default: '', renderHTML: suppress },
      rightSrc: { default: '', renderHTML: suppress },
      leftLabel: { default: 'Before', renderHTML: suppress },
      rightLabel: { default: 'After', renderHTML: suppress },
      caption: { default: '', renderHTML: suppress },
    }
  },
  parseHTML() {
    return [{ tag: 'figure[data-block="before-after"]' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['figure', mergeAttributes(HTMLAttributes, { 'data-block': 'before-after', class: 'my-6' })]
  },
  addNodeView() {
    return ReactNodeViewRenderer(BeforeAfterView)
  },
})

export const beforeAfterBlock: BlockDefinition = {
  name: 'beforeAfterBlock',
  title: 'Before / After',
  description: 'Side-by-side comparison slider layout',
  category: 'media',
  icon: Columns2,
  keywords: ['before', 'after', 'compare', 'duo', 'slider'],
  node: BeforeAfterNode,
  defaults: { leftSrc: '', rightSrc: '', leftLabel: 'Before', rightLabel: 'After', caption: '' },
  options: [
    { key: 'leftSrc', label: 'Before image URL', type: 'url' },
    { key: 'rightSrc', label: 'After image URL', type: 'url' },
    { key: 'leftLabel', label: 'Left label', type: 'text' },
    { key: 'rightLabel', label: 'Right label', type: 'text' },
    { key: 'caption', label: 'Caption', type: 'text' },
  ],
}


/* ══════════════════════════════════════════════════════════════════════════
 * 4. FULL-WIDTH IMAGE  (পুরনো full-image block — modernized, edge-to-edge)
 * ═════════════════════════════════════════════════════════════════════════*/
const FULL_HEIGHTS: Record<string, string> = {
  auto: 'h-auto',
  sm: 'h-[240px]',
  md: 'h-[380px]',
  lg: 'h-[520px]',
  screen: 'h-[80vh]',
}

const FullImageView = ({ node, selected }: { node: any; selected: boolean }) => {
  const { src, alt, caption, height, linkUrl } = node.attrs
  const img = src ? (
    <img src={src} alt={alt || ''} className={`w-full object-cover ${FULL_HEIGHTS[height] ?? FULL_HEIGHTS.auto}`} />
  ) : (
    <EmptyImageBox label="image" className={`w-full ${FULL_HEIGHTS[height] ?? FULL_HEIGHTS.md}`} />
  )
  return (
    <NodeViewWrapper data-block="full-image" className={cx('my-2', selected && 'ring-2 ring-brand-blue ring-offset-2 rounded-lg')} data-drag-handle>
      <figure className="w-full">
        {linkUrl ? (
          <a href={linkUrl} target="_blank" rel="noopener noreferrer">{img}</a>
        ) : img}
        {caption && <figcaption className="mt-2 text-center text-xs italic text-slate-500">{caption}</figcaption>}
      </figure>
    </NodeViewWrapper>
  )
}

const FullImageNode = Node.create({
  name: 'fullImageBlock',
  group: 'block',
  draggable: true,
  addAttributes() {
    return {
      src: { default: '', renderHTML: suppress },
      alt: { default: '', renderHTML: suppress },
      caption: { default: '', renderHTML: suppress },
      height: { default: 'auto', renderHTML: suppress },
      linkUrl: { default: '', renderHTML: suppress },
    }
  },
  parseHTML() { return [{ tag: 'figure[data-block="full-image"]' }] },
  renderHTML({ node, HTMLAttributes }) {
    const { src, alt, caption, height, linkUrl } = node.attrs
    const cls = FULL_HEIGHTS[height] ?? FULL_HEIGHTS.auto
    const img = ['img', { src, alt: alt || '', class: `w-full object-cover ${cls}` }]
    return [
      'figure',
      mergeAttributes(HTMLAttributes, { 'data-block': 'full-image', class: 'my-6 w-full' }),
      linkUrl ? ['a', { href: linkUrl, target: '_blank', rel: 'noopener noreferrer' }, img] : img,
      caption ? ['figcaption', { class: 'mt-2 text-center text-xs italic text-slate-500' }, caption] : ['span', { class: 'hidden' }],
    ]
  },
  addNodeView() { return ReactNodeViewRenderer(FullImageView) },
})

export const fullImageBlock: BlockDefinition = {
  name: 'fullImageBlock',
  title: 'Full-Width Image',
  description: 'Edge-to-edge hero image',
  category: 'media',
  icon: Maximize2,
  keywords: ['full', 'wide', 'hero', 'banner', 'cover', 'edge'],
  node: FullImageNode,
  defaults: { src: '', alt: '', caption: '', height: 'auto', linkUrl: '' },
  options: [
    { key: 'src', label: 'Image URL', type: 'url', placeholder: 'https://…' },
    { key: 'alt', label: 'Alt text (SEO)', type: 'text' },
    { key: 'caption', label: 'Caption', type: 'text' },
    {
      key: 'height',
      label: 'Height',
      type: 'select',
      choices: [
        { label: 'Auto', value: 'auto' },
        { label: 'Small (240px)', value: 'sm' },
        { label: 'Medium (380px)', value: 'md' },
        { label: 'Large (520px)', value: 'lg' },
        { label: 'Full screen (80vh)', value: 'screen' },
      ],
    },
    { key: 'linkUrl', label: 'Link (optional)', type: 'url' },
  ],
}

/* ══════════════════════════════════════════════════════════════════════════
 * 5. IMAGE + TEXT  (পুরনো image-text block — modernized)
 * ═════════════════════════════════════════════════════════════════════════*/
const ASPECTS: Record<string, string> = {
  '16/9': 'aspect-video',
  '4/3': 'aspect-[4/3]',
  '1/1': 'aspect-square',
  '3/4': 'aspect-[3/4]',
}

const ImageTextView = ({ node, selected }: { node: any; selected: boolean }) => {
  const { imageUrl, imagePosition, aspect, heading, body, linkUrl, alt } = node.attrs
  const imgEl = imageUrl ? (
    <img src={imageUrl} alt={alt || ''} className={`w-full h-full object-cover rounded-xl ${ASPECTS[aspect] ?? 'aspect-square'}`} />
  ) : (
    <EmptyImageBox label="image" className={`w-full ${ASPECTS[aspect] ?? 'aspect-square'}`} />
  )
  return (
    <NodeViewWrapper data-block="image-text" className={cx('my-2', selected && 'ring-2 ring-brand-blue ring-offset-2 rounded-lg')} data-drag-handle>
      <div className="grid items-center gap-6 sm:gap-8" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className={imagePosition === 'right' ? 'sm:order-2' : 'sm:order-1'}>
          {linkUrl && imageUrl ? (
            <a href={linkUrl} target="_blank" rel="noopener noreferrer">{imgEl}</a>
          ) : imgEl}
        </div>
        <div className={imagePosition === 'right' ? 'sm:order-1' : 'sm:order-2'}>
          {heading && <h3 className="mb-2 text-xl font-bold text-slate-900">{heading}</h3>}
          {body && <div className="text-sm leading-relaxed text-slate-600" dangerouslySetInnerHTML={{ __html: body }} />}
        </div>
      </div>
    </NodeViewWrapper>
  )
}

const ImageTextNode = Node.create({
  name: 'imageTextBlock',
  group: 'block',
  draggable: true,
  addAttributes() {
    return {
      imageUrl: { default: '', renderHTML: suppress },
      alt: { default: '', renderHTML: suppress },
      imagePosition: { default: 'left', renderHTML: suppress },
      aspect: { default: '1/1', renderHTML: suppress },
      heading: { default: '', renderHTML: suppress },
      body: { default: '', renderHTML: suppress },
      linkUrl: { default: '', renderHTML: suppress },
    }
  },
  parseHTML() { return [{ tag: 'div[data-block="image-text"]' }] },
  renderHTML({ node, HTMLAttributes }) {
    const { imageUrl, alt, imagePosition, aspect, heading, body, linkUrl } = node.attrs
    const img = ['img', { src: imageUrl, alt: alt || '', class: `w-full h-full object-cover rounded-xl ${ASPECTS[aspect] ?? 'aspect-square'}` }]
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-block': 'image-text',
        class: 'my-6 grid items-center gap-6 sm:gap-8',
        style: 'grid-template-columns:1fr 1fr',
      }),
      ['div', { class: imagePosition === 'right' ? 'sm:order-2' : 'sm:order-1' },
        linkUrl && imageUrl
          ? ['a', { href: linkUrl, target: '_blank', rel: 'noopener noreferrer' }, img]
          : img],
      ['div', { class: imagePosition === 'right' ? 'sm:order-1' : 'sm:order-2' },
        heading ? ['h3', { class: 'mb-2 text-xl font-bold text-slate-900' }, heading] : ['span', { class: 'hidden' }],
        body ? ['div', { class: 'text-sm leading-relaxed text-slate-600 [&_a]:text-blue-600 [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_p]:mb-2' }, body] : ['span', { class: 'hidden' }]],
    ]
  },
  addNodeView() { return ReactNodeViewRenderer(ImageTextView) },
})

export const imageTextBlock: BlockDefinition = {
  name: 'imageTextBlock',
  title: 'Image + Text',
  description: 'Side-by-side image and copy',
  category: 'media',
  icon: Columns2,
  keywords: ['image text', 'side by side', 'feature', 'split'],
  node: ImageTextNode,
  defaults: { imageUrl: '', alt: '', imagePosition: 'left', aspect: '1/1', heading: '', body: '', linkUrl: '' },
  options: [
    { key: 'imageUrl', label: 'Image URL', type: 'url' },
    { key: 'alt', label: 'Alt text (SEO)', type: 'text' },
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'body', label: 'Text (HTML allowed)', type: 'textarea', rows: 5 },
    {
      key: 'imagePosition',
      label: 'Image side',
      type: 'segmented',
      choices: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
    },
    {
      key: 'aspect',
      label: 'Image ratio',
      type: 'select',
      choices: [
        { label: '16 / 9', value: '16/9' },
        { label: '4 / 3', value: '4/3' },
        { label: '1 / 1', value: '1/1' },
        { label: '3 / 4', value: '3/4' },
      ],
    },
    { key: 'linkUrl', label: 'Image link (optional)', type: 'url' },
  ],
}

/* ══════════════════════════════════════════════════════════════════════════
 * 6. VIDEO  (YouTube / Vimeo / MP4)
 * ═════════════════════════════════════════════════════════════════════════*/
export function videoEmbedUrl(url: string): string | null {
  if (!url) return null
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{6,})/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`
  const vm = url.match(/vimeo\.com\/(\d+)/)
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`
  return null
}

const VideoView = ({ node, selected }: { node: any; selected: boolean }) => {
  const { url, caption, aspect, autoplay, muted, loop, controls } = node.attrs
  const embed = videoEmbedUrl(url)
  return (
    <NodeViewWrapper data-block="video" className={cx('my-2', selected && 'ring-2 ring-brand-blue ring-offset-2 rounded-lg')} data-drag-handle>
      <figure>
        {!url ? (
          <EmptyImageBox label="video" className={`w-full ${ASPECTS[aspect] ?? 'aspect-video'}`} />
        ) : embed ? (
          <iframe
            src={`${embed}${embed.includes('?') ? '&' : '?'}${autoplay ? 'autoplay=1&' : ''}${muted ? 'mute=1&' : ''}${loop ? 'loop=1&' : ''}`}
            title={caption || 'Video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className={`w-full rounded-xl ${ASPECTS[aspect] ?? 'aspect-video'}`}
          />
        ) : (
          <video
            src={url}
            controls={controls}
            autoPlay={autoplay}
            muted={muted}
            loop={loop}
            className={`w-full rounded-xl bg-black ${ASPECTS[aspect] ?? 'aspect-video'}`}
          />
        )}
        {caption && <figcaption className="mt-2 text-center text-xs italic text-slate-500">{caption}</figcaption>}
      </figure>
    </NodeViewWrapper>
  )
}

const VideoNode = Node.create({
  name: 'videoBlock',
  group: 'block',
  draggable: true,
  addAttributes() {
    return {
      url: { default: '', renderHTML: suppress },
      caption: { default: '', renderHTML: suppress },
      aspect: { default: '16/9', renderHTML: suppress },
      autoplay: { default: false, renderHTML: suppress },
      muted: { default: true, renderHTML: suppress },
      loop: { default: false, renderHTML: suppress },
      controls: { default: true, renderHTML: suppress },
    }
  },
  parseHTML() { return [{ tag: 'figure[data-block="video"]' }] },
  renderHTML({ node, HTMLAttributes }) {
    const { url, caption, aspect, autoplay, muted, loop, controls } = node.attrs
    const embed = videoEmbedUrl(url)
    const cls = `w-full rounded-xl ${ASPECTS[aspect] ?? 'aspect-video'}`
    const inner = !url
      ? ['div', { class: cls }]
      : embed
        ? ['iframe', { src: `${embed}${autoplay ? '?autoplay=1' : ''}`, title: caption || 'Video', allowfullscreen: 'true', allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture', class: cls }]
        : ['video', { src: url, controls: controls ? 'true' : 'false', autoplay: autoplay ? 'true' : 'false', muted: muted ? 'true' : 'false', loop: loop ? 'true' : 'false', class: cls }]
    return [
      'figure',
      mergeAttributes(HTMLAttributes, { 'data-block': 'video', class: 'my-6' }),
      inner,
      caption ? ['figcaption', { class: 'mt-2 text-center text-xs italic text-slate-500' }, caption] : ['span', { class: 'hidden' }],
    ]
  },
  addNodeView() { return ReactNodeViewRenderer(VideoView) },
})

export const videoBlock: BlockDefinition = {
  name: 'videoBlock',
  title: 'Video',
  description: 'YouTube, Vimeo or MP4 file',
  category: 'media',
  icon: Play,
  keywords: ['video', 'youtube', 'vimeo', 'mp4', 'embed'],
  node: VideoNode,
  defaults: { url: '', caption: '', aspect: '16/9', autoplay: false, muted: true, loop: false, controls: true },
  options: [
    { key: 'url', label: 'Video URL (YouTube / Vimeo / .mp4)', type: 'url' },
    { key: 'caption', label: 'Caption', type: 'text' },
    {
      key: 'aspect',
      label: 'Ratio',
      type: 'select',
      choices: [
        { label: '16 / 9', value: '16/9' },
        { label: '4 / 3', value: '4/3' },
        { label: '1 / 1', value: '1/1' },
      ],
    },
    { key: 'autoplay', label: 'Autoplay', type: 'toggle' },
    { key: 'muted', label: 'Muted', type: 'toggle' },
    { key: 'loop', label: 'Loop', type: 'toggle' },
    { key: 'controls', label: 'Show controls (MP4)', type: 'toggle' },
  ],
}

/* ══════════════════════════════════════════════════════════════════════════
 * 7. EMBED  (generic iframe — map, social post, airtable…)
 * ═════════════════════════════════════════════════════════════════════════*/
const EmbedView = ({ node, selected }: { node: any; selected: boolean }) => {
  const { url, title, height } = node.attrs
  return (
    <NodeViewWrapper data-block="embed" className={cx('my-2', selected && 'ring-2 ring-brand-blue ring-offset-2 rounded-lg')} data-drag-handle>
      {url ? (
        <iframe
          src={url}
          title={title || 'Embedded content'}
          style={{ height: `${height}px` }}
          className="w-full rounded-xl border border-slate-200"
          loading="lazy"
        />
      ) : (
        <EmptyImageBox label="embed URL" className="w-full" />
      )}
    </NodeViewWrapper>
  )
}

const EmbedNode = Node.create({
  name: 'embedBlock',
  group: 'block',
  draggable: true,
  addAttributes() {
    return {
      url: { default: '', renderHTML: suppress },
      title: { default: 'Embedded content', renderHTML: suppress },
      height: { default: 420, renderHTML: suppress },
    }
  },
  parseHTML() { return [{ tag: 'div[data-block="embed"]' }] },
  renderHTML({ node, HTMLAttributes }) {
    const { url, title, height } = node.attrs
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-block': 'embed', class: 'my-6' }),
      url
        ? ['iframe', { src: url, title, loading: 'lazy', style: `height:${height}px`, class: 'w-full rounded-xl border border-slate-200' }]
        : ['div', { class: 'w-full' }],
    ]
  },
  addNodeView() { return ReactNodeViewRenderer(EmbedView) },
})

export const embedBlock: BlockDefinition = {
  name: 'embedBlock',
  title: 'Embed',
  description: 'Any iframe content (map, calendar, post)',
  category: 'media',
  icon: Code2,
  keywords: ['embed', 'iframe', 'map', 'calendar', 'social'],
  node: EmbedNode,
  defaults: { url: '', title: 'Embedded content', height: 420 },
  options: [
    { key: 'url', label: 'Embed URL', type: 'url', placeholder: 'https://…' },
    { key: 'title', label: 'Title (accessibility)', type: 'text' },
    { key: 'height', label: 'Height (px)', type: 'range', min: 200, max: 900, step: 20 },
  ],
}

export const mediaBlocks: BlockDefinition[] = [
  imageBlock,
  galleryBlock,
  beforeAfterBlock,
  fullImageBlock,
  imageTextBlock,
  videoBlock,
  embedBlock,
]
```

<!-- FILE: components/editor/commands.ts -->
```ts
import type { Editor } from '@tiptap/core'
import { getBlock } from './registry'
import type { InserterItem } from './types'

/** top-level doc child index — position (pos) দিয়ে */
export function blockIndexAt(editor: Editor, pos: number): number {
  let found = -1
  editor.state.doc.forEach((_node, offset, index) => {
    if (offset === pos) found = index
  })
  return found
}

export function nodeAt(editor: Editor, pos: number) {
  return editor.state.doc.resolve(pos).nodeAfter
}

/** block উপরে/নিচে সরানো */
export function moveBlock(editor: Editor, pos: number, dir: -1 | 1) {
  const { state } = editor
  const { doc } = state
  const index = blockIndexAt(editor, pos)
  if (index < 0) return
  const target = index + dir
  if (target < 0 || target >= doc.childCount) return

  const node = doc.child(index)
  const sibling = doc.child(target)
  const tr = state.tr
  const from = pos
  const to = pos + node.nodeSize

  tr.delete(from, to)
  tr.insert(dir === -1 ? from - sibling.nodeSize : from + sibling.nodeSize, node)
  editor.view.dispatch(tr)
}

export function duplicateBlock(editor: Editor, pos: number) {
  const { state } = editor
  const node = nodeAt(editor, pos)
  if (!node) return
  const tr = state.tr
  tr.insert(pos + node.nodeSize, node.copy())
  editor.view.dispatch(tr)
}

export function deleteBlock(editor: Editor, pos: number) {
  const node = nodeAt(editor, pos)
  if (!node) return
  editor.view.dispatch(editor.state.tr.delete(pos, pos + node.nodeSize))
}

/** block কে অন্য block-এ রূপান্তর (Turn into) */
export function turnInto(editor: Editor, pos: number, type: string, attrs?: Record<string, unknown>) {
  const { state } = editor
  const node = nodeAt(editor, pos)
  if (!node) return

  const TEXT_TYPES = ['paragraph', 'heading', 'bulletList', 'orderedList', 'blockquote', 'codeBlock']
  const def = getBlock(type)

  // textblock → textblock: লেখা রেখে শুধু type বদলায়
  if (node.isTextblock && TEXT_TYPES.includes(type)) {
    editor.chain().focus().setTextSelection(pos + 1).run()
    if (def?.insert) def.insert({ editor, attrs: { ...(def.defaults ?? {}), ...attrs } })
    return
  }

  const created = state.schema.nodes[type]?.createAndFill({ ...(def?.defaults ?? {}), ...attrs })
  if (!created) return
  const tr = state.tr
  tr.replaceWith(pos, pos + node.nodeSize, created)
  editor.view.dispatch(tr)
}

/** Insert after a given block (drag-handle ➕) */
export function insertAfter(editor: Editor, pos: number, item: InserterItem) {
  const node = nodeAt(editor, pos)
  const at = node ? pos + node.nodeSize : pos
  const def = getBlock(item.blockName)
  const attrs = { ...(def?.defaults ?? {}), ...(item.attrs ?? {}) }

  if (def?.insert) {
    // core block: নতুন paragraph বসিয়ে সেখানে convert করি
    editor.chain().focus().insertContentAt(at, { type: 'paragraph' }).run()
    def.insert({ editor, attrs })
    return
  }
  editor.chain().focus().insertContentAt(at, { type: item.blockName, attrs }).run()
}

/** current selection-এর block বের করা (inspector + outline এর জন্য) */
export function activeBlock(editor: Editor) {
  if (!editor || !editor.state) return null
  const { state } = editor
  const sel = state.selection

  // NodeSelection (image/gallery-এর মতো node ক্লিক করে সিলেক্ট করলে)
  if ((sel as any).node) {
    const node = (sel as any).node
    return { name: node.type.name, attrs: { ...node.attrs }, pos: sel.from }
  }

  const $from = sel.$from
  const depth = Math.min($from.depth, 1)
  if (depth < 1) return null
  const node = $from.node(depth)
  if (!node) return null
  return { name: node.type.name, attrs: { ...node.attrs }, pos: $from.before(depth) }
}
```

<!-- FILE: components/editor/demoContent.ts -->
```ts
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
```

<!-- FILE: components/editor/editor.css -->
```css
/* ══════════════════════════════════════════════════════════════════════════
 *  editor.css — portable stylesheet for the block editor
 *
 *  এটা Tailwind-এর ওপর নির্ভর করে না (plain CSS) — যেকোনো প্রজেক্টে চলবে।
 *  brand রঙগুলো 10centagency-এর Tailwind theme থেকে নেওয়া:
 *    navy #00346D · blue #2F85F3 · accent #B6D7FF
 *    textDark #16324F · textMid #5C718A · border #D9E8FA
 *
 *  প্রয়োগ:
 *    .tiptap-canvas   → admin editor-এর লেখার এলাকা
 *    .doc-content     → public page-এ render করা HTML-এর wrapper
 * ══════════════════════════════════════════════════════════════════════════*/

/* ── 1. Editor canvas ─────────────────────────────────────────────────── */
.tiptap-canvas .ProseMirror {
  min-height: 420px;
  font-size: 15px;
  line-height: 1.7;
  color: #5c718a;
  outline: none;
}
.tiptap-canvas .ProseMirror > * + * { margin-top: 1rem; }

.tiptap-canvas .ProseMirror p { margin: 0.75rem 0; }
.tiptap-canvas .ProseMirror h1 { margin: 2rem 0 1rem; font-size: 2.25rem; line-height: 1.2; font-weight: 800; color: #16324f; }
.tiptap-canvas .ProseMirror h2 { margin: 2rem 0 0.75rem; font-size: 1.875rem; line-height: 1.25; font-weight: 700; color: #16324f; }
.tiptap-canvas .ProseMirror h3 { margin: 1.5rem 0 0.5rem; font-size: 1.25rem; line-height: 1.35; font-weight: 700; color: #16324f; }
.tiptap-canvas .ProseMirror h4 { margin: 1.25rem 0 0.5rem; font-size: 1.125rem; font-weight: 600; color: #16324f; }

.tiptap-canvas .ProseMirror ul { margin: 0.75rem 0; padding-left: 1.5rem; list-style: disc; }
.tiptap-canvas .ProseMirror ol { margin: 0.75rem 0; padding-left: 1.5rem; list-style: decimal; }
.tiptap-canvas .ProseMirror li { margin: 0.15rem 0; }
.tiptap-canvas .ProseMirror li p { margin: 0; }
.tiptap-canvas .ProseMirror ul ul,
.tiptap-canvas .ProseMirror ol ol { margin: 0.25rem 0; }

.tiptap-canvas .ProseMirror blockquote {
  margin: 1.25rem 0;
  padding-left: 1rem;
  border-left: 4px solid rgba(47, 133, 243, 0.4);
  font-style: italic;
  color: #5c718a;
}

.tiptap-canvas .ProseMirror code {
  padding: 0.15rem 0.35rem;
  border-radius: 0.25rem;
  background: #eef2f7;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.85em;
  color: #e11d48;
}
.tiptap-canvas .ProseMirror pre {
  margin: 1rem 0;
  padding: 1rem;
  overflow-x: auto;
  border-radius: 0.75rem;
  background: #0f172a;
  color: #e2e8f0;
  font-size: 0.875rem;
}
.tiptap-canvas .ProseMirror pre code { padding: 0; background: transparent; color: inherit; }

.tiptap-canvas .ProseMirror a { color: #2f85f3; text-decoration: underline; text-underline-offset: 2px; }
.tiptap-canvas .ProseMirror hr { margin: 2rem 0; border: 0; border-top: 1px solid #d9e8fa; }
.tiptap-canvas .ProseMirror img { max-width: 100%; height: auto; }

/* placeholder */
.tiptap-canvas .ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
  color: #94a3b8;
}

/* selected node (image/gallery click করলে) */
.tiptap-canvas .ProseMirror .ProseMirror-selectednode {
  outline: 2px solid #2f85f3;
  outline-offset: 2px;
  border-radius: 4px;
}
.tiptap-canvas .ProseMirror .ProseMirror-selectednode img { border-radius: 4px; }

/* columns placeholder text */
.tiptap-canvas .ProseMirror [data-block="column"]:empty::before {
  content: "Type in this column…";
  color: #94a3b8;
  font-size: 14px;
}

/* ── 2. Tables (editor + public) ──────────────────────────────────────── */
.tiptap-canvas .ProseMirror table,
.doc-content table {
  width: 100%;
  margin: 1.5rem 0;
  border-collapse: collapse;
  font-size: 0.9rem;
}
.tiptap-canvas .ProseMirror th,
.tiptap-canvas .ProseMirror td,
.doc-content th,
.doc-content td {
  border: 1px solid #d9e8fa;
  padding: 0.6rem 0.75rem;
  text-align: left;
  vertical-align: top;
}
.tiptap-canvas .ProseMirror th,
.doc-content th {
  background: #eef6ff;
  font-weight: 600;
  color: #16324f;
}
.tiptap-canvas .ProseMirror td p,
.doc-content td p,
.tiptap-canvas .ProseMirror th p,
.doc-content th p { margin: 0; }
.tiptap-canvas .ProseMirror .selectedCell::after { background: rgba(47, 133, 243, 0.15); }
.tiptap-canvas .ProseMirror .column-resize-handle {
  background-color: #2f85f3;
  width: 3px;
}

/* ── 3. Public page rendering (.doc-content wrapper) ──────────────────── */
.doc-content { color: #5c718a; font-size: 16px; line-height: 1.75; }
.doc-content > * { max-width: 100%; }
.doc-content p { margin: 0.85rem 0; }
.doc-content h1 { margin: 2rem 0 0.75rem; font-size: 2.1rem; line-height: 1.2; font-weight: 800; color: #16324f; }
.doc-content h2 { margin: 2rem 0 0.75rem; font-size: 1.7rem; line-height: 1.25; font-weight: 700; color: #16324f; }
.doc-content h3 { margin: 1.5rem 0 0.5rem; font-size: 1.25rem; font-weight: 700; color: #16324f; }
.doc-content h4 { margin: 1.25rem 0 0.5rem; font-size: 1.1rem; font-weight: 600; color: #16324f; }
.doc-content ul { margin: 0.85rem 0; padding-left: 1.4rem; list-style: disc; }
.doc-content ol { margin: 0.85rem 0; padding-left: 1.4rem; list-style: decimal; }
.doc-content li { margin: 0.2rem 0; }
.doc-content li p { margin: 0; }
.doc-content blockquote {
  margin: 1.25rem 0;
  padding-left: 1rem;
  border-left: 4px solid rgba(47, 133, 243, 0.4);
  font-style: italic;
}
.doc-content a { color: #2f85f3; text-decoration: underline; text-underline-offset: 2px; }
.doc-content a:hover { color: #00346d; }
.doc-content strong { color: #16324f; font-weight: 600; }
.doc-content em { font-style: italic; }
.doc-content u { text-decoration: underline; }
.doc-content s { text-decoration: line-through; }
.doc-content code {
  padding: 0.15rem 0.35rem;
  border-radius: 0.25rem;
  background: #eef2f7;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.85em;
}
.doc-content pre { margin: 1.25rem 0; padding: 1rem; overflow-x: auto; border-radius: 0.75rem; background: #0f172a; color: #e2e8f0; }
.doc-content pre code { background: transparent; color: inherit; padding: 0; }
.doc-content hr { margin: 2rem 0; border: 0; border-top: 1px solid #d9e8fa; }
.doc-content img { max-width: 100%; height: auto; }
.doc-content figure { margin: 0; }
.doc-content figcaption { margin-top: 0.5rem; font-size: 0.8rem; font-style: italic; color: #8296ab; }

/* ── 4. Drag handle layer ─────────────────────────────────────────────── */
.drag-handle { z-index: 30; }
.drag-handle:hover { opacity: 1 !important; }

/* ── 5. Misc ──────────────────────────────────────────────────────────── */
.raw-html { width: 100%; }
.raw-html iframe { max-width: 100%; }
```

<!-- FILE: components/editor/extensions/slashCommand.ts -->
```ts
import { Extension } from '@tiptap/core'
import Suggestion from '@tiptap/suggestion'
import { ReactRenderer } from '@tiptap/react'
import SlashList, { type SlashListHandle } from '../surfaces/SlashList'
import { insertBlock, searchBlocks } from '../registry'
import type { InserterItem } from '../types'

/**
 * Slash command ("/") — registry থেকে সরাসরি items আসে,
 * তাই নতুন block যোগ করলে স্ল্যাশ মেনুতেও সাথে সাথে চলে আসে।
 */
export const SlashCommand = Extension.create({
  name: 'slashCommand',

  addProseMirrorPlugins() {
    return [
      Suggestion<InserterItem>({
        editor: this.editor,
        char: '/',
        allowSpaces: false,
        startOfLine: false,

        items: ({ query }) => searchBlocks(query).slice(0, 10),

        command: ({ editor, range, props }) => {
          editor.chain().focus().deleteRange(range).run()
          insertBlock(editor, props.blockName, props.attrs)
        },

        render: () => {
          let renderer: ReactRenderer<SlashListHandle, SlashListProps> | null = null
          let el: HTMLDivElement | null = null

          const position = (clientRect?: (() => DOMRect | null) | null) => {
            const rect = clientRect?.()
            if (!rect || !el) return
            const h = el.offsetHeight || 300
            const spaceBelow = window.innerHeight - rect.bottom
            el.style.position = 'fixed'
            el.style.zIndex = '9999'
            el.style.top = `${spaceBelow < h + 24 ? Math.max(8, rect.top - h - 8) : rect.bottom + 8}px`
            el.style.left = `${Math.max(8, Math.min(rect.left, window.innerWidth - 320))}px`
          }

          const cleanup = () => {
            renderer?.destroy()
            el?.remove()
            renderer = null
            el = null
          }

          return {
            onStart: (props) => {
              renderer = new ReactRenderer(SlashList, {
                props: { items: props.items, command: (item: InserterItem) => props.command(item) },
                editor: props.editor,
              })
              el = document.createElement('div')
              el.appendChild(renderer.element)
              document.body.appendChild(el)
              requestAnimationFrame(() => position(props.clientRect))
            },
            onUpdate: (props) => {
              renderer?.updateProps({ items: props.items, command: (item: InserterItem) => props.command(item) })
              requestAnimationFrame(() => position(props.clientRect))
            },
            onKeyDown: (props) => {
              if (props.event.key === 'Escape') {
                cleanup()
                return true
              }
              return renderer?.ref?.onKeyDown({ event: props.event }) ?? false
            },
            onExit: cleanup,
          }
        },
      }),
    ]
  },
})

type SlashListProps = { items: InserterItem[]; command: (item: InserterItem) => void }
```

<!-- FILE: components/editor/index.ts -->
```ts
/**
 * ══════════════════════════════════════════════════════════════════════════
 *  components/editor/index.ts — public API
 *
 *  বাইরের কোড (BlogForm, PortfolioForm, public pages, RSS) শুধু এই ফাইল
 *  থেকে import করবে। ভেতরের ফাইল-গঠন বদলালেও এই API একই থাকবে।
 *
 *  import { BlockEditor, renderDocToHtml, plainTextFromDoc } from '@/components/editor'
 * ══════════════════════════════════════════════════════════════════════════*/

/* ── React কম্পোনেন্ট ──────────────────────────────────────────────────── */
export { default as BlockEditor, editorExtensions } from './BlockEditor'
export type { BlockEditorProps } from './BlockEditor'

/* ── Registry (block যোগ/খোঁজা) ────────────────────────────────────────── */
export { registerAllBlocks } from './blocks'
export { registerBlock, registerBlocks, getBlock, allBlocks, inserterItems } from './registry'
export { moveBlock, duplicateBlock, deleteBlock, turnInto } from './commands'

/* ── Server-side / static render ───────────────────────────────────────── */
export { renderDocToHtml, renderExtensions, htmlToNodes } from './render'
export { plainTextFromDoc, isDocEmpty } from './plainText'
export { convertLegacyBlocks } from './legacy'

/* ── Types ─────────────────────────────────────────────────────────────── */
export type {
  UploadFn,
  BlockCategoryId,
  BlockCategory,
  BlockDefinition,
  BlockVariation,
  InserterItem,
  OptionField,
} from './types'
export { CATEGORIES } from './types'
```

<!-- FILE: components/editor/legacy.ts -->
```ts
import type { JSONContent } from '@tiptap/core'
import { htmlToNodes } from './render'

/**
 * পুরনো ৮-ব্লক সিস্টেম (content_blocks array) → নতুন Tiptap document।
 *
 * কেন দরকার: পুরনো blog/portfolio post গুলো এডিটরে খুললে যেন লেখা হারিয়ে না যায়।
 * এটা optional কিন্তু strongly recommended — এটা ছাড়া পুরনো post গুলো
 * শুধু read-only (fallback renderer) হিসেবে থাকবে।
 *
 * Mapping:
 *   text          → heading + rich text nodes
 *   image         → imageBlock
 *   full-image    → imageBlock (width 100)
 *   image-duo     → beforeAfterBlock
 *   image-grid    → galleryBlock
 *   image-text    → imageTextBlock
 *   color-palette → colorPaletteBlock
 *   typography    → typographyBlock
 */
export function convertLegacyBlocks(blocks: unknown): JSONContent | null {
  if (!Array.isArray(blocks) || blocks.length === 0) return null

  const content: JSONContent[] = []

  for (const raw of blocks) {
    const b = raw as Record<string, any>
    if (!b || typeof b !== 'object') continue

    switch (b.type) {
      case 'text': {
        if (b.heading && String(b.heading).trim()) {
          content.push({
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: String(b.heading) }],
          })
        }
        const nodes = htmlToNodes(String(b.content ?? ''))
        content.push(...(nodes.length ? nodes : [{ type: 'paragraph' }]))
        break
      }

      case 'image': {
        if (!b.image_url) break
        content.push({
          type: 'imageBlock',
          attrs: {
            src: b.image_url,
            alt: b.alt_text ?? '',
            caption: b.caption ?? '',
            align: 'center',
            width: b.width === 'half' ? 50 : b.width === 'third' ? 33 : 100,
            rounded: true,
            shadow: true,
          },
        })
        break
      }

      case 'full-image': {
        if (!b.image_url) break
        content.push({
          type: 'fullImageBlock',
          attrs: {
            src: b.image_url,
            alt: b.alt_text ?? '',
            caption: b.caption ?? '',
            height: 'auto',
            linkUrl: b.link_url ?? '',
          },
        })
        break
      }

      case 'image-duo': {
        if (!b.left_image_url && !b.right_image_url) break
        content.push({
          type: 'beforeAfterBlock',
          attrs: {
            leftSrc: b.left_image_url ?? '',
            rightSrc: b.right_image_url ?? '',
            leftLabel: b.left_label ?? 'Before',
            rightLabel: b.right_label ?? 'After',
            caption: b.caption ?? '',
          },
        })
        break
      }

      case 'image-grid': {
        const images = Array.isArray(b.images) ? b.images : []
        if (!images.length) break
        content.push({
          type: 'galleryBlock',
          attrs: {
            images: images.map((i: any) => ({ src: i?.url ?? '', alt: i?.caption ?? '' })),
            columns: b.columns ?? 3,
            gap: 12,
            rounded: true,
          },
        })
        break
      }

      case 'image-text': {
        if (!b.image_url && !b.content && !b.heading) break
        content.push({
          type: 'imageTextBlock',
          attrs: {
            imageUrl: b.image_url ?? '',
            alt: b.alt_text ?? '',
            imagePosition: b.image_position === 'right' ? 'right' : 'left',
            aspect: b.aspect_ratio ?? '1/1',
            heading: b.heading ?? '',
            body: b.content ?? '',
            linkUrl: b.link_url ?? '',
          },
        })
        break
      }

      case 'color-palette': {
        const colors = Array.isArray(b.colors) ? b.colors : []
        if (!colors.length) break
        content.push({
          type: 'colorPaletteBlock',
          attrs: {
            title: b.title ?? 'Brand Colors',
            colors: colors.map((c: any) => ({ hex: c?.hex ?? '#000000', name: c?.name ?? '' })),
            size: 64,
          },
        })
        break
      }

      case 'typography': {
        const fonts = Array.isArray(b.fonts) ? b.fonts : []
        if (!fonts.length) break
        content.push({
          type: 'typographyBlock',
          attrs: {
            title: b.title ?? 'Typography',
            showMeta: true,
            fonts: fonts.map((f: any) => ({
              name: f?.name ?? '',
              sample: f?.sample ?? '',
              weight: f?.weight ?? '',
              style: f?.style ?? '',
              size: '',
            })),
          },
        })
        break
      }

      default:
        break
    }
  }

  if (!content.length) return null
  return { type: 'doc', content }
}
```

<!-- FILE: components/editor/plainText.ts -->
```ts
import type { JSONContent } from '@tiptap/core'

/**
 * Tiptap JSON document → plain text.
 * RSS feed, excerpt, meta description, search index — সব জায়গায় লাগবে।
 */
export function plainTextFromDoc(doc: unknown, maxLength?: number): string {
  if (!doc || typeof doc !== 'object') return ''
  const out: string[] = []
  const walk = (node: any) => {
    if (!node || typeof node !== 'object') return
    if (node.type === 'text') {
      if (typeof node.text === 'string') out.push(node.text)
      return
    }
    // atom block-এর attrs-এ লেখা থাকতে পারে (image+text body, CTA title, quote…)
    if (node.attrs && typeof node.attrs === 'object') {
      for (const key of TEXT_ATTRS) {
        const v = node.attrs[key]
        if (typeof v === 'string' && v.trim() && !/^(https?:|\/|#|data:)/.test(v.trim())) {
          out.push(stripHtml(v), ' ')
        }
      }
    }
    // block গুলোর পরে space দিলে শব্দ জুড়ে যায় না
    if (node.content && Array.isArray(node.content)) {
      node.content.forEach(walk)
      if (BLOCK_TYPES.has(node.type)) out.push(' ')
    }
  }
  walk(doc as any)

  const text = out
    .join('')
    .replace(/\s+/g, ' ')
    .trim()

  if (maxLength && text.length > maxLength) {
    const cut = text.slice(0, maxLength)
    const lastSpace = cut.lastIndexOf(' ')
    return (lastSpace > maxLength * 0.5 ? cut.slice(0, lastSpace) : cut).trim() + '…'
  }
  return text
}

/** node attrs-এ থাকা লেখা (image+text-এর body, caption, CTA title ইত্যাদি) */
const TEXT_ATTRS = ['heading', 'body', 'caption', 'label', 'quote', 'text', 'title', 'bio', 'sample']

function stripHtml(input: string): string {
  return input
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const BLOCK_TYPES = new Set([
  'paragraph', 'heading', 'blockquote', 'bulletList', 'orderedList', 'listItem',
  'codeBlock', 'imageBlock', 'galleryBlock', 'beforeAfterBlock', 'columnsBlock',
  'columnBlock', 'dividerBlock', 'spacerBlock', 'calloutBlock', 'colorPaletteBlock',
  'ctaBlock', 'statsBlock', 'testimonialBlock', 'faqBlock',
])

/** doc-এ আসল content আছে কিনা — empty save guard এর জন্য */
export function isDocEmpty(doc: unknown): boolean {
  if (!doc || typeof doc !== 'object') return true
  const content = (doc as any).content
  if (!Array.isArray(content) || content.length === 0) return true
  return content.every((node: any) => {
    if (node.type === 'paragraph' && (!node.content || node.content.length === 0)) return true
    if (NON_TEXT_NODES.has(node.type)) return false
    return plainTextFromDoc(node).trim() === ''
  })
}

const NON_TEXT_NODES = new Set([
  'imageBlock', 'galleryBlock', 'beforeAfterBlock', 'dividerBlock', 'spacerBlock',
  'colorPaletteBlock', 'testimonialBlock', 'statsBlock', 'ctaBlock', 'faqBlock',
  'columnsBlock', 'calloutBlock',
])
```

<!-- FILE: components/editor/registry.ts -->
```ts
import type { AnyExtension, Editor } from '@tiptap/core'
import type { BlockDefinition, InserterItem } from './types'

/* ────────────────────────────────────────────────────────────────────────────
 *  SINGLE SOURCE OF TRUTH
 *  নতুন block যোগ করতে = blocks/ ফোল্ডারে একটা ফাইল + registerBlocks([...])
 *  Inserter, slash menu, inspector, extension list, static render — সব auto.
 * ──────────────────────────────────────────────────────────────────────────*/
const store = new Map<string, BlockDefinition>()

export function registerBlock(def: BlockDefinition): BlockDefinition {
  store.set(def.name, def)
  return def
}

export function registerBlocks(defs: BlockDefinition[]): void {
  defs.forEach(registerBlock)
}

export function getBlock(name: string): BlockDefinition | undefined {
  return store.get(name)
}

export function allBlocks(): BlockDefinition[] {
  return Array.from(store.values())
}

/** registry থেকে Tiptap extension list — editor তৈরির সময় ব্যবহার হয় */
export function extensionsFromRegistry(): AnyExtension[] {
  const out: AnyExtension[] = []
  for (const block of allBlocks()) {
    if (!block.node) continue
    if (Array.isArray(block.node)) out.push(...block.node)
    else out.push(block.node)
  }
  return out
}

/** registry থেকে UniqueID টাইপ list */
export function customNodeNames(): string[] {
  return allBlocks()
    .filter((b) => b.node)
    .map((b) => b.name)
}

/* ── Inserter items: block + variations flatten ─────────────────────────────*/
export function inserterItems(): InserterItem[] {
  const items: InserterItem[] = []
  for (const block of allBlocks()) {
    if (block.hidden) continue
    if (block.variations?.length) {
      block.variations.forEach((v, i) => {
        items.push({
          id: `${block.name}__${i}`,
          blockName: block.name,
          title: v.title,
          description: block.description,
          category: block.category,
          icon: block.icon,
          keywords: [...(block.keywords ?? []), ...(v.keywords ?? []), block.title, v.title],
          attrs: { ...(block.defaults ?? {}), ...(v.attrs ?? {}) },
        })
      })
    } else {
      items.push({
        id: block.name,
        blockName: block.name,
        title: block.title,
        description: block.description,
        category: block.category,
        icon: block.icon,
        keywords: [...(block.keywords ?? []), block.title],
        attrs: { ...(block.defaults ?? {}) },
      })
    }
  }
  return items
}

/** fuzzy-ish search: title / keywords / category দিয়ে */
export function searchBlocks(query: string, items = inserterItems()): InserterItem[] {
  const q = query.trim().toLowerCase()
  if (!q) return items
  return items.filter((item) => {
    if (item.title.toLowerCase().includes(q)) return true
    if (item.category.includes(q)) return true
    return item.keywords.some((k) => k.toLowerCase().includes(q))
  })
}

/* ── Insertion ──────────────────────────────────────────────────────────────*/
export function insertBlock(
  editor: Editor,
  blockName: string,
  attrs?: Record<string, unknown>,
  /** কোথায় insert করবে — default: কার্সার/শেষে */
  pos?: number,
): void {
  const def = getBlock(blockName)
  if (!def || !editor) return
  const finalAttrs = { ...(def.defaults ?? {}), ...(attrs ?? {}) }

  // "insert after position pos" mode (drag handle ➕ থেকে)
  if (typeof pos === 'number') {
    editor
      .chain()
      .focus()
      .insertContentAt(pos, { type: blockName, attrs: finalAttrs })
      .run()
    return
  }

  if (def.insert) {
    def.insert({ editor, attrs: finalAttrs })
    return
  }

  editor.chain().focus().insertContent({ type: blockName, attrs: finalAttrs }).run()
}

/** core node (paragraph/heading/list) — variations দিয়ে insert */
export function insertCore(
  editor: Editor,
  blockName: string,
  attrs?: Record<string, unknown>,
): void {
  const def = getBlock(blockName)
  if (def?.insert) def.insert({ editor, attrs: { ...(def.defaults ?? {}), ...(attrs ?? {}) } })
}
```

<!-- FILE: components/editor/render.ts -->
```ts
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import { generateHTML, generateJSON } from '@tiptap/html'
import type { JSONContent } from '@tiptap/core'
import { extensionsFromRegistry } from './registry'

/**
 * SERVER-SAFE extension list — শুধু node + mark।
 *
 * SlashCommand / Placeholder / UniqueID / TrailingNode / FileHandler
 * এগুলো plugin-only → server-এ দরকার নেই, রাখলে সমস্যা হতে পারে।
 *
 * ⚠️ editorExtensions() (BlockEditor.tsx) আর renderExtensions() —
 *    দুটোতেই যেন block node গুলো একই থাকে, নাহলে unknown node drop হয়ে যাবে।
 */
export function renderExtensions() {
  return [
    StarterKit.configure({
      heading: { levels: [1, 2, 3, 4] },
      link: { openOnClick: false },
      trailingNode: false, // render করার সময় extra paragraph লাগবে না
    }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ...extensionsFromRegistry(),
  ]
}

/** Tiptap JSON → HTML (public page / RSS / meta description) */
export function renderDocToHtml(doc: JSONContent | null | undefined): string {
  if (!doc || typeof doc !== 'object') return ''
  let html = ''
  try {
    html = generateHTML(doc as JSONContent, renderExtensions())
  } catch (err) {
    console.error('[renderDocToHtml] failed:', err)
    return ''
  }

  // Raw HTML block: content is stored URI-encoded in data-code, put it back
  return html.replace(/<div([^>]*?)data-code="([^"]*)"([^>]*?)><\/div>/g, (match, _pre, code, _post) => {
    if (!match.includes('data-block="html"')) return match
    try {
      return `<div class="my-6 raw-html">${decodeURIComponent(code)}</div>`
    } catch {
      return match
    }
  })
}

/** Legacy HTML string → Tiptap nodes (পুরনো block.content ছিল HTML) */
export function htmlToNodes(html: string): JSONContent[] {
  if (!html || !html.trim()) return []
  try {
    const json = generateJSON(html, renderExtensions())
    return (json?.content as JSONContent[]) ?? []
  } catch (err) {
    console.error('[htmlToNodes] failed:', err)
    return []
  }
}
```

<!-- FILE: components/editor/surfaces/BlockHandle.tsx -->
```tsx
import { useRef, useState } from 'react'
import DragHandle from '@tiptap/extension-drag-handle-react'
import type { Editor } from '@tiptap/core'
import { Plus, GripVertical, ChevronUp, ChevronDown, Copy, Trash2, Shuffle } from 'lucide-react'
import type { Node } from '@tiptap/pm/model'
import BlockPicker from './BlockPicker'
import { duplicateBlock, deleteBlock, moveBlock, insertAfter, turnInto } from '../commands'
import type { InserterItem } from '../types'
import { cx } from '../blocks/helpers'

interface HandleState {
  node: Node | null
  pos: number
}

export default function BlockHandle({ editor }: { editor: Editor }) {
  const [handle, setHandle] = useState<HandleState>({ node: null, pos: -1 })
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null)
  const [picker, setPicker] = useState<{ x: number; y: number; mode: 'insert' | 'transform' } | null>(null)
  const anchorRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  const anchorFrom = (e: React.MouseEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
    anchorRef.current = { x: r.left, y: r.bottom + 6 }
    return anchorRef.current
  }

  const closeAll = () => {
    setMenu(null)
    setPicker(null)
  }

  const blockName = handle.node?.type.name ?? ''
  const nodeSize = handle.node?.nodeSize ?? 0

  return (
    <>
      <DragHandle
        editor={editor}
        nested
        onNodeChange={({ node, pos }) => setHandle({ node, pos })}
        className="drag-handle z-30"
      >
        <div className="flex items-center gap-0.5 rounded-md border border-slate-200 bg-white p-0.5 shadow-sm transition-opacity hover:border-brand-blue/40">
          <div
            role="button"
            title="Insert block after"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation()
              const a = anchorFrom(e)
              setPicker({ x: a.x, y: a.y, mode: 'insert' })
              setMenu(null)
            }}
            className="flex h-6 w-6 cursor-pointer items-center justify-center rounded text-slate-400 hover:bg-brand-blue/10 hover:text-brand-blue"
          >
            <Plus className="h-3.5 w-3.5" />
          </div>
          <div
            role="button"
            title="Drag to move · click for options"
            onClick={(e) => {
              e.stopPropagation()
              const a = anchorFrom(e)
              setMenu({ x: a.x, y: a.y })
              setPicker(null)
            }}
            className="flex h-6 w-6 cursor-grab items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-600 active:cursor-grabbing"
          >
            <GripVertical className="h-3.5 w-3.5" />
          </div>
        </div>
      </DragHandle>

      {/* ── Block context menu ─────────────────────────────────────────── */}
      {menu && (
        <div
          className="fixed z-[60] w-52 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-panel"
          style={{ left: menu.x, top: menu.y }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <MenuItem
            icon={<ChevronUp className="h-3.5 w-3.5" />}
            label="Move up"
            onClick={() => {
              moveBlock(editor, handle.pos, -1)
              closeAll()
            }}
          />
          <MenuItem
            icon={<ChevronDown className="h-3.5 w-3.5" />}
            label="Move down"
            onClick={() => {
              moveBlock(editor, handle.pos, 1)
              closeAll()
            }}
          />
          <MenuItem
            icon={<Copy className="h-3.5 w-3.5" />}
            label="Duplicate"
            onClick={() => {
              duplicateBlock(editor, handle.pos)
              closeAll()
            }}
          />
          <div className="my-1 h-px bg-slate-100" />
          <MenuItem
            icon={<Shuffle className="h-3.5 w-3.5" />}
            label="Turn into…"
            onClick={() => {
              setPicker({ x: menu.x, y: menu.y, mode: 'transform' })
              setMenu(null)
            }}
          />
          <div className="my-1 h-px bg-slate-100" />
          <MenuItem
            icon={<Trash2 className="h-3.5 w-3.5" />}
            label="Delete block"
            danger
            onClick={() => {
              deleteBlock(editor, handle.pos)
              closeAll()
            }}
          />
          <div className="border-t border-slate-100 px-3 py-1.5 text-[10px] text-slate-400">
            {blockName} · {nodeSize} chars
          </div>
        </div>
      )}

      {/* ── Inline block picker (insert after / turn into) ─────────────── */}
      {picker && (
        <div className="fixed z-[70]" style={{ left: picker.x, top: picker.y }}>
          <BlockPicker
            compact
            onClose={closeAll}
            onPick={(item: InserterItem) => {
              if (picker.mode === 'insert') insertAfter(editor, handle.pos, item)
              else turnInto(editor, handle.pos, item.blockName, item.attrs)
              closeAll()
            }}
          />
        </div>
      )}
    </>
  )
}

function MenuItem({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
  danger?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        'flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-sm transition-colors',
        danger ? 'text-rose-600 hover:bg-rose-50' : 'text-slate-700 hover:bg-slate-50',
      )}
    >
      <span className={cx('shrink-0', danger ? 'text-rose-500' : 'text-slate-400')}>{icon}</span>
      {label}
    </button>
  )
}
```

<!-- FILE: components/editor/surfaces/BlockPicker.tsx -->
```tsx
import { useEffect, useMemo, useRef, useState } from 'react'
import { Search } from 'lucide-react'
import { CATEGORIES, type BlockCategoryId, type InserterItem } from '../types'
import { searchBlocks } from '../registry'
import { cx } from '../blocks/helpers'

interface BlockPickerProps {
  onPick: (item: InserterItem) => void
  onClose: () => void
  /** compact = slash-menu/plus-button style list */
  compact?: boolean
}

export default function BlockPicker({ onPick, onClose, compact = false }: BlockPickerProps) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<BlockCategoryId | 'all'>('all')
  const [active, setActive] = useState(0)
  const wrapRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])

  const items = useMemo(() => {
    const searched = searchBlocks(query)
    if (category === 'all') return searched
    return searched.filter((i) => i.category === category)
  }, [query, category])

  useEffect(() => setActive(0), [query, category])

  /* click outside → close */
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [onClose])

  /* active item → scroll into view */
  useEffect(() => {
    itemRefs.current[active]?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const pick = (item: InserterItem) => onPick(item)

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => (items.length ? (a + 1) % items.length : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => (items.length ? (a - 1 + items.length) % items.length : 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (items[active]) pick(items[active])
    }
  }

  return (
    <div
      ref={wrapRef}
      onKeyDown={onKeyDown}
      className={cx(
        'w-[340px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-panel',
        compact && 'w-[300px]',
      )}
    >
      {/* Search */}
      <div className="border-b border-slate-100 p-2">
        <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-2.5 py-2">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search blocks…"
            className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-1 border-b border-slate-100 px-2 py-2">
        {[{ id: 'all' as const, label: 'All' }, ...CATEGORIES].map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setCategory(cat.id as BlockCategoryId | 'all')}
            className={cx(
              'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
              category === cat.id ? 'bg-brand-blue text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className={cx('overflow-y-auto p-2', compact ? 'max-h-[260px]' : 'max-h-[340px]')}>
        {items.length === 0 ? (
          <p className="px-2 py-8 text-center text-sm text-slate-400">No blocks match “{query}”</p>
        ) : compact ? (
          <div className="space-y-0.5">
            {items.map((item, i) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  ref={(el) => (itemRefs.current[i] = el)}
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => pick(item)}
                  className={cx(
                    'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors',
                    active === i ? 'bg-brand-blue/10' : 'hover:bg-slate-50',
                  )}
                >
                  <Icon className={cx('h-4 w-4 shrink-0', active === i ? 'text-brand-blue' : 'text-slate-500')} />
                  <span className="text-sm font-medium text-slate-700">{item.title}</span>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1.5">
            {items.map((item, i) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  ref={(el) => (itemRefs.current[i] = el)}
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => pick(item)}
                  title={item.description}
                  className={cx(
                    'flex flex-col items-center gap-1.5 rounded-lg border px-1.5 py-3 transition-colors',
                    active === i
                      ? 'border-brand-blue bg-brand-blue/10'
                      : 'border-slate-200 hover:border-brand-blue/40 hover:bg-slate-50',
                  )}
                >
                  <Icon className={cx('h-5 w-5', active === i ? 'text-brand-blue' : 'text-slate-500')} />
                  <span className="line-clamp-2 text-center text-[10px] font-medium leading-tight text-slate-600">
                    {item.title}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div className="border-t border-slate-100 bg-slate-50 px-3 py-1.5 text-[10px] text-slate-400">
        ↑↓ navigate · ⏎ select · esc close
      </div>
    </div>
  )
}
```

<!-- FILE: components/editor/surfaces/FormatToolbar.tsx -->
```tsx
import { useState } from 'react'
import { BubbleMenu } from '@tiptap/react/menus'
import type { Editor } from '@tiptap/core'
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code, Link2, Link2Off,
  AlignLeft, AlignCenter, AlignRight, ChevronDown, Type, Heading2, Heading3, Quote, List,
} from 'lucide-react'
import { cx } from '../blocks/helpers'

export default function FormatToolbar({ editor }: { editor: Editor }) {
  const [turnOpen, setTurnOpen] = useState(false)
  const [linkOpen, setLinkOpen] = useState(false)
  const [linkValue, setLinkValue] = useState('')

  const btn = (active: boolean) =>
    cx(
      'flex h-7 w-7 items-center justify-center rounded transition-colors',
      active ? 'bg-brand-blue text-white' : 'text-slate-600 hover:bg-slate-100',
    )

  const turnIntoOptions = [
    { label: 'Paragraph', icon: Type, run: () => editor.chain().focus().setParagraph().run() },
    { label: 'Heading 2', icon: Heading2, run: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
    { label: 'Heading 3', icon: Heading3, run: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
    { label: 'Quote', icon: Quote, run: () => editor.chain().focus().toggleBlockquote().run() },
    { label: 'Bullet list', icon: List, run: () => editor.chain().focus().toggleBulletList().run() },
  ]

  const applyLink = () => {
    if (linkValue.trim()) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkValue.trim() }).run()
    }
    setLinkOpen(false)
    setLinkValue('')
  }

  return (
    <BubbleMenu
      editor={editor}
      options={{ placement: 'top', offset: 8 }}
      shouldShow={({ editor: ed, from, to }) => from !== to && !ed.isActive('codeBlock')}
    >
      <div className="flex items-center gap-0.5 rounded-lg border border-slate-200 bg-white p-1 shadow-panel">
        {/* Turn into */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setTurnOpen((v) => !v)}
            className="flex h-7 items-center gap-1 rounded px-2 text-xs font-medium text-slate-600 hover:bg-slate-100"
          >
            Turn into
            <ChevronDown className="h-3 w-3" />
          </button>
          {turnOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setTurnOpen(false)} />
              <div className="absolute left-0 top-full z-20 mt-1 w-40 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-panel">
                {turnIntoOptions.map(({ label, icon: Icon, run }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      run()
                      setTurnOpen(false)
                    }}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <Icon className="h-3.5 w-3.5 text-slate-400" />
                    {label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <span className="mx-0.5 h-5 w-px bg-slate-200" />

        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btn(editor.isActive('bold'))} title="Bold">
          <Bold className="h-3.5 w-3.5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btn(editor.isActive('italic'))} title="Italic">
          <Italic className="h-3.5 w-3.5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={btn(editor.isActive('underline'))} title="Underline">
          <UnderlineIcon className="h-3.5 w-3.5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={btn(editor.isActive('strike'))} title="Strikethrough">
          <Strikethrough className="h-3.5 w-3.5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleCode().run()} className={btn(editor.isActive('code'))} title="Inline code">
          <Code className="h-3.5 w-3.5" />
        </button>

        <span className="mx-0.5 h-5 w-px bg-slate-200" />

        {/* Link */}
        {linkOpen ? (
          <input
            autoFocus
            value={linkValue}
            onChange={(e) => setLinkValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') applyLink()
              if (e.key === 'Escape') setLinkOpen(false)
            }}
            onBlur={() => setTimeout(() => setLinkOpen(false), 150)}
            placeholder="https://…"
            className="h-7 w-40 rounded border border-brand-blue/40 px-2 text-xs focus:outline-none"
          />
        ) : (
          <>
            <button
              type="button"
              onClick={() => {
                const existing = editor.getAttributes('link').href
                if (existing) {
                  editor.chain().focus().extendMarkRange('link').unsetLink().run()
                } else {
                  setLinkValue('')
                  setLinkOpen(true)
                }
              }}
              className={btn(editor.isActive('link'))}
              title={editor.isActive('link') ? 'Remove link' : 'Add link'}
            >
              {editor.isActive('link') ? <Link2Off className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
            </button>
          </>
        )}

        <span className="mx-0.5 h-5 w-px bg-slate-200" />

        <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={btn(editor.isActive({ textAlign: 'left' }))} title="Align left">
          <AlignLeft className="h-3.5 w-3.5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={btn(editor.isActive({ textAlign: 'center' }))} title="Align center">
          <AlignCenter className="h-3.5 w-3.5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={btn(editor.isActive({ textAlign: 'right' }))} title="Align right">
          <AlignRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </BubbleMenu>
  )
}
```

<!-- FILE: components/editor/surfaces/Inspector.tsx -->
```tsx
import { useRef, useState } from 'react'
import type { Editor } from '@tiptap/core'
import { Plus, Trash2, ChevronUp, ChevronDown, Settings2, FileText, ChevronRight, Upload, Loader2 } from 'lucide-react'
import type { OptionField, UploadFn } from '../types'
import { getBlock } from '../registry'
import { cx } from '../blocks/helpers'
import type { ActiveBlock } from '../types.runtime'

interface InspectorProps {
  editor: Editor
  active: ActiveBlock | null
  upload?: UploadFn
}

export default function Inspector({ editor, active, upload }: InspectorProps) {
  const [tab, setTab] = useState<'block' | 'document'>('block')
  const def = active ? getBlock(active.name) : undefined

  const update = (key: string, value: unknown) => {
    if (!active) return
    const node = editor.state.doc.resolve(active.pos).nodeAfter
    if (!node) return
    const tr = editor.state.tr.setNodeMarkup(
      active.pos,
      undefined,
      { ...node.attrs, [key]: value },
    )
    tr.setMeta('addToHistory', true)
    editor.view.dispatch(tr)
  }

  const updateList = (key: string, next: Record<string, unknown>[]) => update(key, next)

  return (
    <aside className="flex w-[300px] shrink-0 flex-col border-l border-slate-200 bg-white">
      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        {(
          [
            { id: 'block', label: 'Block', icon: Settings2 },
            { id: 'document', label: 'Document', icon: FileText },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cx(
              'flex flex-1 items-center justify-center gap-1.5 border-b-2 px-3 py-2.5 text-xs font-semibold transition-colors',
              tab === t.id
                ? 'border-brand-blue text-brand-blue'
                : 'border-transparent text-slate-500 hover:text-slate-700',
            )}
          >
            <t.icon className="h-3.5 w-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {tab === 'block' ? (
          !active || !def ? (
            <div className="p-6 text-center text-sm text-slate-400">
              <p>No block selected.</p>
              <p className="mt-1 text-xs">Click any block to edit its options.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {/* Block header */}
              <div className="bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <def.icon className="h-4 w-4 text-brand-blue" />
                  <span className="text-sm font-semibold text-slate-800">{def.title}</span>
                </div>
                <p className="mt-0.5 text-[11px] text-slate-400">{def.description}</p>
              </div>

              {!def.options?.length ? (
                <div className="px-4 py-6 text-center text-xs text-slate-400">
                  This block has no options.
                  <br />
                  Edit content directly in the canvas.
                </div>
              ) : (
                <div className="space-y-4 p-4">
                  {def.options.map((field) => (
                    <Field
                      key={field.key}
                      field={field}
                      value={(active.attrs as Record<string, unknown>)[field.key]}
                      onChange={(v) => update(field.key, v)}
                      onChangeList={(v) => updateList(field.key, v)}
                      upload={upload}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        ) : (
          <DocumentPanel editor={editor} />
        )}
      </div>
    </aside>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
 * Field renderer — declarative schema → UI
 * ═════════════════════════════════════════════════════════════════════════*/
function Field({
  field,
  value,
  onChange,
  onChangeList,
  upload,
}: {
  field: OptionField
  value: unknown
  onChange: (v: unknown) => void
  onChangeList: (v: Record<string, unknown>[]) => void
  upload?: UploadFn
}) {
  const label = <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">{field.label}</span>

  switch (field.type) {
    case 'url':
      return <UrlField field={field} value={(value as string) ?? ''} onChange={onChange} upload={upload} />

    case 'text':
      return (
        <label className="block">
          {label}
          <input
            type="text"
            value={(value as string) ?? ''}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm text-slate-700 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
          />
        </label>
      )

    case 'textarea':
      return (
        <label className="block">
          {label}
          <textarea
            rows={field.rows ?? 3}
            value={(value as string) ?? ''}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
            className="w-full resize-y rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm text-slate-700 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
          />
        </label>
      )

    case 'select':
      return (
        <label className="block">
          {label}
          <select
            value={String(value ?? field.choices[0].value)}
            onChange={(e) => {
              const raw = e.target.value
              onChange(isNaN(Number(raw)) || raw === '' ? raw : Number(raw))
            }}
            className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm text-slate-700 focus:border-brand-blue focus:outline-none"
          >
            {field.choices.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
      )

    case 'segmented':
      return (
        <div>
          {label}
          <div className="flex overflow-hidden rounded-lg border border-slate-200">
            {field.choices.map((c, i) => (
              <button
                key={c.value}
                type="button"
                onClick={() => {
                  const raw = c.value
                  onChange(isNaN(Number(raw)) || raw === '' ? raw : Number(raw))
                }}
                className={cx(
                  'flex-1 px-2 py-1.5 text-xs font-medium transition-colors',
                  i > 0 && 'border-l border-slate-200',
                  String(value ?? field.choices[0].value) === c.value
                    ? 'bg-brand-blue text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-50',
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )

    case 'number':
      return (
        <label className="block">
          {label}
          <input
            type="number"
            value={Number(value ?? 0)}
            min={field.min}
            max={field.max}
            step={field.step}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm focus:border-brand-blue focus:outline-none"
          />
        </label>
      )

    case 'range':
      return (
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{field.label}</span>
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono text-slate-600">{String(value ?? field.min)}</span>
          </div>
          <input
            type="range"
            min={field.min}
            max={field.max}
            step={field.step ?? 1}
            value={Number(value ?? field.min)}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full accent-brand-blue"
          />
        </div>
      )

    case 'toggle':
      return (
        <button
          type="button"
          onClick={() => onChange(!value)}
          className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-2.5 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          <span>{field.label}</span>
          <span className={cx('relative h-5 w-9 rounded-full transition-colors', value ? 'bg-brand-blue' : 'bg-slate-300')}>
            <span className={cx('absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all', value ? 'left-4.5 left-[18px]' : 'left-0.5')} />
          </span>
        </button>
      )

    case 'color':
      return (
        <div>
          {label}
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={(value as string) ?? '#000000'}
              onChange={(e) => onChange(e.target.value)}
              className="h-9 w-12 cursor-pointer rounded border border-slate-200 bg-white p-0.5"
            />
            <input
              type="text"
              value={(value as string) ?? ''}
              onChange={(e) => onChange(e.target.value)}
              className="flex-1 rounded-lg border border-slate-200 px-2.5 py-1.5 font-mono text-xs uppercase focus:border-brand-blue focus:outline-none"
            />
          </div>
        </div>
      )

    case 'list': {
      const items = (value as Record<string, unknown>[]) ?? []
      const setItem = (i: number, key: string, v: unknown) => {
        const next = items.map((it, idx) => (idx === i ? { ...it, [key]: v } : it))
        onChangeList(next)
      }
      const move = (i: number, dir: -1 | 1) => {
        const next = [...items]
        const j = i + dir
        if (j < 0 || j >= next.length) return
        ;[next[i], next[j]] = [next[j], next[i]]
        onChangeList(next)
      }
      return (
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              {field.label} ({items.length})
            </span>
          </div>
          <div className="space-y-2">
            {items.map((item, i) => (
              <div key={i} className="rounded-lg border border-slate-200 bg-slate-50/60 p-2.5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase text-slate-400">
                    {field.itemLabel} {i + 1}
                  </span>
                  <div className="flex items-center gap-0.5">
                    <IconBtn onClick={() => move(i, -1)} disabled={i === 0}>
                      <ChevronUp className="h-3 w-3" />
                    </IconBtn>
                    <IconBtn onClick={() => move(i, 1)} disabled={i === items.length - 1}>
                      <ChevronDown className="h-3 w-3" />
                    </IconBtn>
                    <IconBtn danger onClick={() => onChangeList(items.filter((_, idx) => idx !== i))}>
                      <Trash2 className="h-3 w-3" />
                    </IconBtn>
                  </div>
                </div>
                <div className="space-y-2">
                  {field.fields.map((sub) => (
                    <Field
                      key={sub.key}
                      field={sub}
                      value={item[sub.key]}
                      onChange={(v) => setItem(i, sub.key, v)}
                      onChangeList={() => {}}
                      upload={upload}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            disabled={!!field.max && items.length >= field.max}
            onClick={() => onChangeList([...items, { ...field.defaultItem }])}
            className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-300 py-2 text-xs font-medium text-brand-blue hover:border-brand-blue hover:bg-brand-blue/5 disabled:opacity-40"
          >
            <Plus className="h-3.5 w-3.5" />
            Add {field.itemLabel.toLowerCase()}
          </button>
        </div>
      )
    }

    default:
      return null
  }
}

function UrlField({
  field,
  value,
  onChange,
  upload,
}: {
  field: Extract<OptionField, { type: 'url' }>
  value: string
  onChange: (v: unknown) => void
  upload?: UploadFn
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)

  return (
    <div>
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {field.label}
      </span>
      <div className="flex gap-1.5">
        <input
          type="text"
          value={value}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm text-slate-700 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
        />
        {upload && (
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            title="Upload image"
            className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          </button>
        )}
      </div>
      {upload && (
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0]
            if (!file) return
            setBusy(true)
            const url = await upload(file)
            setBusy(false)
            if (url) onChange(url)
            e.target.value = ''
          }}
        />
      )}
    </div>
  )
}

function IconBtn({
  children,
  onClick,
  disabled,
  danger,
}: {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  danger?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cx(
        'flex h-5 w-5 items-center justify-center rounded transition-colors disabled:opacity-30',
        danger ? 'text-rose-500 hover:bg-rose-50' : 'text-slate-400 hover:bg-slate-200 hover:text-slate-600',
      )}
    >
      {children}
    </button>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
 * Document tab — outline + stats
 * ═════════════════════════════════════════════════════════════════════════*/
function DocumentPanel({ editor }: { editor: Editor }) {
  const blocks: { name: string; pos: number; text: string; index: number }[] = []
  editor.state.doc.forEach((node, offset, index) => {
    blocks.push({
      name: node.type.name,
      pos: offset,
      text: node.textContent.slice(0, 42),
      index,
    })
  })
  const words = editor.state.doc.textBetween(0, editor.state.doc.content.size, ' ').trim().split(/\s+/).filter(Boolean).length

  return (
    <div className="p-4">
      <div className="mb-4 grid grid-cols-2 gap-2">
        <Stat label="Blocks" value={blocks.length} />
        <Stat label="Words" value={words} />
      </div>

      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Outline</p>
      <div className="space-y-0.5">
        {blocks.map((b) => {
          const def = getBlock(b.name)
          const Icon = def?.icon ?? FileText
          return (
            <button
              key={`${b.pos}-${b.index}`}
              type="button"
              onClick={() => editor.chain().focus().setTextSelection(b.pos + 1).scrollIntoView().run()}
              className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-slate-50"
            >
              <Icon className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-medium text-slate-700">{def?.title ?? b.name}</span>
                {b.text && <span className="block truncate text-[10px] text-slate-400">{b.text}</span>}
              </span>
              <ChevronRight className="h-3 w-3 shrink-0 text-slate-300" />
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
      <p className="text-lg font-bold text-slate-800">{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-slate-400">{label}</p>
    </div>
  )
}
```

<!-- FILE: components/editor/surfaces/SlashList.tsx -->
```tsx
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import type { InserterItem } from '../types'
import { cx } from '../blocks/helpers'

export interface SlashListHandle {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean
}

interface SlashListProps {
  items: InserterItem[]
  command: (item: InserterItem) => void
}

/** "/" টাইপ করলে যে লিস্ট দেখায় — BlockPicker-এর compact ভার্সন */
const SlashList = forwardRef<SlashListHandle, SlashListProps>(({ items, command }, ref) => {
  const [selected, setSelected] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => setSelected(0), [items])

  useEffect(() => {
    const el = containerRef.current?.querySelector<HTMLElement>(`[data-index="${selected}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [selected])

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (!items.length) return false
      if (event.key === 'ArrowUp') {
        setSelected((s) => (s + items.length - 1) % items.length)
        return true
      }
      if (event.key === 'ArrowDown') {
        setSelected((s) => (s + 1) % items.length)
        return true
      }
      if (event.key === 'Enter') {
        command(items[selected])
        return true
      }
      return false
    },
  }))

  if (!items.length) return null

  return (
    <div
      ref={containerRef}
      className="max-h-[300px] w-[300px] overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-panel"
    >
      <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Blocks</p>
      {items.map((item, i) => {
        const Icon = item.icon
        return (
          <button
            key={item.id}
            data-index={i}
            type="button"
            onMouseEnter={() => setSelected(i)}
            onClick={() => command(item)}
            className={cx(
              'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors',
              selected === i ? 'bg-brand-blue/10' : 'hover:bg-slate-50',
            )}
          >
            <Icon className={cx('h-4 w-4 shrink-0', selected === i ? 'text-brand-blue' : 'text-slate-500')} />
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-slate-700">{item.title}</span>
              <span className="block truncate text-[11px] text-slate-400">{item.description}</span>
            </span>
          </button>
        )
      })}
      <p className="border-t border-slate-100 px-2 pb-0.5 pt-1.5 text-[10px] text-slate-400">
        ↑↓ navigate · ⏎ select · esc dismiss
      </p>
    </div>
  )
})

SlashList.displayName = 'SlashList'
export default SlashList
```

<!-- FILE: components/editor/types.runtime.ts -->
```ts
export interface ActiveBlock {
  name: string
  attrs: Record<string, unknown>
  pos: number
}
```

<!-- FILE: components/editor/types.ts -->
```ts
import type { AnyExtension, Editor } from '@tiptap/core'
import type { ComponentType } from 'react'

/* ────────────────────────────────────────────────────────────────────────────
 * Block categories — inserter panel + slash menu এই ভাগ ব্যবহার করে
 * ─�─────────────────────────────────────────────────────────────────────────*/
export type UploadFn = (file: File) => Promise<string | null>

export type BlockCategoryId = 'text' | 'media' | 'layout' | 'marketing' | 'design' | 'advanced'

export interface BlockCategory {
  id: BlockCategoryId
  label: string
}

export const CATEGORIES: BlockCategory[] = [
  { id: 'text', label: 'Text' },
  { id: 'media', label: 'Media' },
  { id: 'layout', label: 'Layout' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'design', label: 'Design' },
  { id: 'advanced', label: 'Advanced' },
]

/* ────────────────────────────────────────────────────────────────────────────
 * Inspector options — declarative field schema (Gutenberg InspectorControls)
 * ──────────────────────────────────────────────────────────────────────────*/
export type OptionField =
  | { key: string; label: string; type: 'text'; placeholder?: string }
  | { key: string; label: string; type: 'textarea'; placeholder?: string; rows?: number }
  | { key: string; label: string; type: 'select'; choices: { label: string; value: string }[] }
  | { key: string; label: string; type: 'segmented'; choices: { label: string; value: string }[] }
  | { key: string; label: string; type: 'number'; min?: number; max?: number; step?: number }
  | { key: string; label: string; type: 'range'; min: number; max: number; step?: number }
  | { key: string; label: string; type: 'toggle' }
  | { key: string; label: string; type: 'color' }
  | { key: string; label: string; type: 'url'; placeholder?: string }
  | {
      key: string
      label: string
      type: 'list'
      itemLabel: string
      max?: number
      fields: OptionField[]
      defaultItem: Record<string, unknown>
    }

/* ────────────────────────────────────────────────────────────────────────────
 * Block definition — একটি block = একটি ফাইল = registry তে একটা entry
 * ──────────────────────────────────────────────────────────────────────────*/
export interface BlockVariation {
  /** "Heading 2", "3 Columns" — inserter-এ আলাদা item হিসেবে দেখায় */
  title: string
  keywords?: string[]
  attrs?: Record<string, unknown>
}

export interface BlockDefinition {
  /** ProseMirror node name (অথবা core node-এর নাম: paragraph, heading …) */
  name: string
  title: string
  description: string
  category: BlockCategoryId
  icon: ComponentType<{ className?: string }>
  /** স্ল্যাশ কমান্ড + সার্চ-এ মিলবে */
  keywords?: string[]
  /** কাস্টম node (থাকলে registry থেকে extension list-এ যাবে) — Table-এর মতো block-এ array */
  node?: AnyExtension | AnyExtension[]
  /** insert করার সময় default attrs */
  defaults?: Record<string, unknown>
  /** Inspector-এ যে options দেখাবে */
  options?: OptionField[]
  /** Gutenberg-এর block variations */
  variations?: BlockVariation[]
  /** insert logic (না দিলে default: insertContent node) */
  insert?: (args: { editor: Editor; attrs?: Record<string, unknown> }) => void
  /** inserter-এ লুকানো (যেমন: column — parent দিয়েই তৈরি হয়) */
  hidden?: boolean
}

/* ────────────────────────────────────────────────────────────────────────────
 * Inserter item — block + variation flatten করে তৈরি হয়
 * ──────────────────────────────────────────────────────────────────────────*/
export interface InserterItem {
  id: string
  blockName: string
  title: string
  description: string
  category: BlockCategoryId
  icon: ComponentType<{ className?: string }>
  keywords: string[]
  attrs?: Record<string, unknown>
}
```
