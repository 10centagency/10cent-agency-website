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
