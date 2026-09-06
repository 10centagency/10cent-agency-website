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

