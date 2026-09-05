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
