'use client';

import React from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';

interface RichTextEditorProps {
  content: string;
  onUpdate: (html: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onUpdate }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Ensure all needed nodes are enabled (defaults are fine, just be explicit)
        heading: { levels: [1, 2, 3] },
        bulletList: {},
        orderedList: {},
        listItem: {},
        blockquote: {},
        hardBreak: {},
        bold: {},
        italic: {},
      }),
      Underline,
      Link.configure({ openOnClick: false }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
  });

  if (!editor) return null;

  const prevent = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const btnClass = (active: boolean) =>
    `px-2 py-1 text-sm rounded transition-colors ${
      active
        ? 'bg-blue-600 text-white'
        : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
    }`;

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-gray-100 border-b border-gray-300">
        <button
          type="button"
          onMouseDown={prevent}
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={btnClass(editor.isActive('bold'))}
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onMouseDown={prevent}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={btnClass(editor.isActive('italic'))}
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onMouseDown={prevent}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={btnClass(editor.isActive('underline'))}
        >
          <u>U</u>
        </button>

        <div className="w-px bg-gray-300 mx-1" />

        <button
          type="button"
          onMouseDown={prevent}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={btnClass(editor.isActive('heading', { level: 1 }))}
        >
          H1
        </button>
        <button
          type="button"
          onMouseDown={prevent}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={btnClass(editor.isActive('heading', { level: 2 }))}
        >
          H2
        </button>
        <button
          type="button"
          onMouseDown={prevent}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={btnClass(editor.isActive('heading', { level: 3 }))}
        >
          H3
        </button>

        <div className="w-px bg-gray-300 mx-1" />

        <button
          type="button"
          onMouseDown={prevent}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={btnClass(editor.isActive('bulletList'))}
        >
          • List
        </button>
        <button
          type="button"
          onMouseDown={prevent}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={btnClass(editor.isActive('orderedList'))}
        >
          1. List
        </button>
        <button
          type="button"
          onMouseDown={prevent}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={btnClass(editor.isActive('blockquote'))}
        >
          ❝ Quote
        </button>

        <div className="w-px bg-gray-300 mx-1" />

        <button
          type="button"
          onMouseDown={prevent}
          onClick={() => editor.chain().focus().setHardBreak().run()}
          className="px-2 py-1 text-sm rounded bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors"
        >
          ↵ Break
        </button>
      </div>

      {/* Editor content area — white background, dark text */}
      <EditorContent
        editor={editor}
        className="bg-white text-gray-900 p-3 min-h-[150px] focus:outline-none
          [&_.ProseMirror]:outline-none
          [&_.ProseMirror]:min-h-[120px]
          [&_.ProseMirror_h1]:text-2xl
          [&_.ProseMirror_h1]:font-bold
          [&_.ProseMirror_h1]:mb-2
          [&_.ProseMirror_h2]:text-xl
          [&_.ProseMirror_h2]:font-bold
          [&_.ProseMirror_h2]:mb-2
          [&_.ProseMirror_h3]:text-lg
          [&_.ProseMirror_h3]:font-semibold
          [&_.ProseMirror_h3]:mb-1
          [&_.ProseMirror_ul]:list-disc
          [&_.ProseMirror_ul]:pl-6
          [&_.ProseMirror_ul]:mb-2
          [&_.ProseMirror_ol]:list-decimal
          [&_.ProseMirror_ol]:pl-6
          [&_.ProseMirror_ol]:mb-2
          [&_.ProseMirror_li]:mb-0.5
          [&_.ProseMirror_blockquote]:border-l-4
          [&_.ProseMirror_blockquote]:border-blue-400
          [&_.ProseMirror_blockquote]:pl-4
          [&_.ProseMirror_blockquote]:italic
          [&_.ProseMirror_blockquote]:text-gray-600
          [&_.ProseMirror_blockquote]:my-2
          [&_.ProseMirror_p]:mb-2
          [&_.ProseMirror_strong]:font-bold
          [&_.ProseMirror_em]:italic
          [&_.ProseMirror_a]:text-blue-600
          [&_.ProseMirror_a]:underline"
      />
    </div>
  );
};

export default RichTextEditor;
