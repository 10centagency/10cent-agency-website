'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Unlink,
  X,
} from 'lucide-react'
import { useState } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (content: string) => void
}

export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState('')
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [textColor, setTextColor] = useState('#000000')

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        blockquote: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (typeof window === 'undefined') return null

  if (!editor) {
    return null
  }

  const handleAddLink = () => {
    if (!linkUrl) return

    editor
      .chain()
      .focus()
      .setLink({ href: linkUrl, target: '_blank' })
      .run()

    setLinkUrl('')
    setShowLinkInput(false)
  }

  const handleRemoveLink = () => {
    editor.chain().focus().unsetLink().run()
  }

  const handleTextColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value
    setTextColor(color)
  }

  const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px']

  return (
    <div className="border border-brand-border rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-brand-border p-2 space-y-2">
        {/* Row 1: Text Style */}
        <div className="flex flex-wrap items-center gap-1">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={`p-1.5 rounded hover:bg-brand-blue/10 transition-colors ${
              editor.isActive('bold')
                ? 'bg-brand-blue/20 text-brand-blue'
                : 'text-brand-textDark'
            }`}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded hover:bg-brand-blue/10 transition-colors ${
              editor.isActive('italic')
                ? 'bg-brand-blue/20 text-brand-blue'
                : 'text-brand-textDark'
            }`}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            disabled={!editor.can().chain().focus().toggleUnderline().run()}
            className={`p-1.5 rounded hover:bg-brand-blue/10 transition-colors ${
              editor.isActive('underline')
                ? 'bg-brand-blue/20 text-brand-blue'
                : 'text-brand-textDark'
            }`}
            title="Underline"
          >
            <UnderlineIcon className="w-4 h-4" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className={`p-1.5 rounded hover:bg-brand-blue/10 transition-colors ${
              editor.isActive('strike')
                ? 'bg-brand-blue/20 text-brand-blue'
                : 'text-brand-textDark'
            }`}
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>

          <div className="border-r border-gray-200 h-6 mx-1" />

          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            disabled={
              !editor.can().chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={`p-1.5 rounded hover:bg-brand-blue/10 transition-colors text-sm font-bold ${
              editor.isActive('heading', { level: 1 })
                ? 'bg-brand-blue/20 text-brand-blue'
                : 'text-brand-textDark'
            }`}
            title="Heading 1"
          >
            H1
          </button>

          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            disabled={
              !editor.can().chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`p-1.5 rounded hover:bg-brand-blue/10 transition-colors text-sm font-bold ${
              editor.isActive('heading', { level: 2 })
                ? 'bg-brand-blue/20 text-brand-blue'
                : 'text-brand-textDark'
            }`}
            title="Heading 2"
          >
            H2
          </button>

          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            disabled={
              !editor.can().chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={`p-1.5 rounded hover:bg-brand-blue/10 transition-colors text-sm font-bold ${
              editor.isActive('heading', { level: 3 })
                ? 'bg-brand-blue/20 text-brand-blue'
                : 'text-brand-textDark'
            }`}
            title="Heading 3"
          >
            H3
          </button>

          <div className="border-r border-gray-200 h-6 mx-1" />

        </div>

        {/* Row 2: Formatting */}
        <div className="flex flex-wrap items-center gap-1">
          <div className="flex items-center gap-1">
            <input
              type="color"
              value={textColor}
              onChange={handleTextColor}
              className="w-6 h-6 rounded cursor-pointer"
              title="Text Color"
            />
          </div>

          <div className="border-r border-gray-200 h-6 mx-1" />

          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-1.5 rounded hover:bg-brand-blue/10 transition-colors ${
              editor.isActive({ textAlign: 'left' })
                ? 'bg-brand-blue/20 text-brand-blue'
                : 'text-brand-textDark'
            }`}
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-1.5 rounded hover:bg-brand-blue/10 transition-colors ${
              editor.isActive({ textAlign: 'center' })
                ? 'bg-brand-blue/20 text-brand-blue'
                : 'text-brand-textDark'
            }`}
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </button>

          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`p-1.5 rounded hover:bg-brand-blue/10 transition-colors ${
              editor.isActive({ textAlign: 'right' })
                ? 'bg-brand-blue/20 text-brand-blue'
                : 'text-brand-textDark'
            }`}
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </button>

          <div className="border-r border-gray-200 h-6 mx-1" />

          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1.5 rounded hover:bg-brand-blue/10 transition-colors ${
              editor.isActive('bulletList')
                ? 'bg-brand-blue/20 text-brand-blue'
                : 'text-brand-textDark'
            }`}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1.5 rounded hover:bg-brand-blue/10 transition-colors ${
              editor.isActive('orderedList')
                ? 'bg-brand-blue/20 text-brand-blue'
                : 'text-brand-textDark'
            }`}
            title="Ordered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-1.5 rounded hover:bg-brand-blue/10 transition-colors ${
              editor.isActive('blockquote')
                ? 'bg-brand-blue/20 text-brand-blue'
                : 'text-brand-textDark'
            }`}
            title="Blockquote"
          >
            <Quote className="w-4 h-4" />
          </button>
        </div>

        {/* Row 3: Links */}
        <div className="flex flex-wrap items-center gap-1">
          {!showLinkInput ? (
            <>
              <button
                onClick={() => setShowLinkInput(true)}
                className={`p-1.5 rounded hover:bg-brand-blue/10 transition-colors ${
                  editor.isActive('link')
                    ? 'bg-brand-blue/20 text-brand-blue'
                    : 'text-brand-textDark'
                }`}
                title="Add Link"
              >
                <LinkIcon className="w-4 h-4" />
              </button>

              <button
                onClick={handleRemoveLink}
                disabled={!editor.isActive('link')}
                className="p-1.5 rounded hover:bg-brand-blue/10 transition-colors text-brand-textDark disabled:opacity-30"
                title="Remove Link"
              >
                <Unlink className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-1 flex-1">
              <input
                type="url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddLink()
                  if (e.key === 'Escape') setShowLinkInput(false)
                }}
                className="flex-1 px-2 py-1 text-xs rounded border border-brand-border bg-white text-brand-textDark placeholder:text-brand-textMid/50 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                autoFocus
              />
              <button
                onClick={handleAddLink}
                className="p-1.5 rounded bg-brand-blue text-white hover:bg-brand-blue/90 transition-colors"
              >
                <LinkIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowLinkInput(false)}
                className="p-1.5 rounded hover:bg-red-100 transition-colors text-brand-textDark"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="bg-white p-4 min-h-[200px] focus:outline-none prose prose-sm max-w-none
          prose-headings:text-brand-textDark prose-headings:font-semibold
          prose-p:text-brand-textDark prose-p:leading-relaxed
          prose-a:text-brand-blue prose-a:underline
          prose-blockquote:border-brand-blue prose-blockquote:text-brand-textMid
          prose-ul:text-brand-textDark prose-ol:text-brand-textDark"
      />
    </div>
  )
}
