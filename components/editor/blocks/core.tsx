import { Text as TextIcon, Heading as HeadingIcon, List, ListOrdered, Quote, Code2 } from 'lucide-react'
import type { BlockDefinition } from '../types'

/**
 * Core text blocks — these have no custom node,
 * the StarterKit nodes are simply exposed as "blocks" through the registry.
 */

export const paragraphBlock: BlockDefinition = {
  name: 'paragraph',
  title: 'Paragraph',
  description: 'Plain body text',
  category: 'text',
  icon: TextIcon,
  keywords: ['text', 'body', 'p'],
  defaults: { textAlign: null, fontSize: '', lineHeight: '', textColor: '', bgColor: '', paddingY: 0 },
  options: [
    {
      key: 'textAlign',
      label: 'Alignment',
      type: 'segmented',
      choices: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
        { label: 'Justify', value: 'justify' },
      ],
    },
    {
      key: 'fontSize',
      label: 'Font size',
      type: 'select',
      choices: [
        { label: 'Default', value: '' },
        { label: 'Small', value: 'sm' },
        { label: 'Normal', value: 'base' },
        { label: 'Large', value: 'lg' },
        { label: 'XL', value: 'xl' },
        { label: '2XL', value: '2xl' },
        { label: '3XL', value: '3xl' },
      ],
    },
    {
      key: 'lineHeight',
      label: 'Line height',
      type: 'select',
      choices: [
        { label: 'Default', value: '' },
        { label: 'Tight', value: 'tight' },
        { label: 'Snug', value: 'snug' },
        { label: 'Normal', value: 'normal' },
        { label: 'Relaxed', value: 'relaxed' },
      ],
    },
    { key: 'textColor', label: 'Text colour', type: 'color' },
    { key: 'bgColor', label: 'Background colour', type: 'color' },
    { key: 'paddingY', label: 'Padding top/bottom (px)', type: 'range', min: 0, max: 48, step: 2 },
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
    {
      key: 'fontSize',
      label: 'Font size',
      type: 'select',
      choices: [
        { label: 'Default', value: '' },
        { label: 'Small', value: 'sm' },
        { label: 'Normal', value: 'base' },
        { label: 'Large', value: 'lg' },
        { label: 'XL', value: 'xl' },
        { label: '2XL', value: '2xl' },
        { label: '3XL', value: '3xl' },
      ],
    },
    {
      key: 'lineHeight',
      label: 'Line height',
      type: 'select',
      choices: [
        { label: 'Default', value: '' },
        { label: 'Tight', value: 'tight' },
        { label: 'Snug', value: 'snug' },
        { label: 'Normal', value: 'normal' },
        { label: 'Relaxed', value: 'relaxed' },
      ],
    },
    { key: 'textColor', label: 'Text colour', type: 'color' },
    { key: 'bgColor', label: 'Background colour', type: 'color' },
    { key: 'paddingY', label: 'Padding top/bottom (px)', type: 'range', min: 0, max: 48, step: 2 },
    { key: 'uppercase', label: 'UPPERCASE', type: 'toggle' },
    { key: 'anchorId', label: 'Anchor id (for TOC links)', type: 'text', placeholder: 'section-one' },
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
  defaults: { listStyle: '', textColor: '' },
  options: [
    {
      key: 'listStyle',
      label: 'Bullet style',
      type: 'select',
      choices: [
        { label: 'Default (disc)', value: '' },
        { label: 'Disc ●', value: 'disc' },
        { label: 'Circle ○', value: 'circle' },
        { label: 'Square ■', value: 'square' },
        { label: 'None', value: 'none' },
      ],
    },
    { key: 'textColor', label: 'List colour', type: 'color' },
  ],
  insert: ({ editor }) => editor.chain().focus().toggleBulletList().run(),
}

export const orderedListBlock: BlockDefinition = {
  name: 'orderedList',
  title: 'Numbered List',
  description: 'Ordered list',
  category: 'text',
  icon: ListOrdered,
  keywords: ['ol', 'ordered', 'number', 'steps'],
  defaults: { listStyle: '', start: 1, textColor: '' },
  options: [
    {
      key: 'listStyle',
      label: 'Numbering style',
      type: 'select',
      choices: [
        { label: '1, 2, 3', value: '' },
        { label: 'a, b, c', value: 'lower-alpha' },
        { label: 'A, B, C', value: 'upper-alpha' },
        { label: 'i, ii, iii', value: 'lower-roman' },
        { label: 'I, II, III', value: 'upper-roman' },
      ],
    },
    { key: 'start', label: 'Start from', type: 'number', min: 1, max: 99, step: 1 },
    { key: 'textColor', label: 'List colour', type: 'color' },
  ],
  insert: ({ editor }) => editor.chain().focus().toggleOrderedList().run(),
}

export const quoteBlock: BlockDefinition = {
  name: 'blockquote',
  title: 'Quote',
  description: 'Pull quote / citation',
  category: 'text',
  icon: Quote,
  keywords: ['blockquote', 'cite', 'testimonial'],
  defaults: { quoteVariant: '', citation: '', fontSize: '', textColor: '', bgColor: '', borderColor: '', paddingY: 0 },
  options: [
    {
      key: 'quoteVariant',
      label: 'Style',
      type: 'select',
      choices: [
        { label: 'Default (left border)', value: '' },
        { label: 'Card (with background)', value: 'card' },
        { label: 'Centred quote', value: 'centered' },
        { label: 'Plain (no border)', value: 'plain' },
      ],
    },
    { key: 'citation', label: 'Author / source', type: 'text', placeholder: '— Jane Doe' },
    { key: 'borderColor', label: 'Border colour', type: 'color' },
    {
      key: 'fontSize',
      label: 'Font size',
      type: 'select',
      choices: [
        { label: 'Default', value: '' },
        { label: 'Small', value: 'sm' },
        { label: 'Normal', value: 'base' },
        { label: 'Large', value: 'lg' },
        { label: 'XL', value: 'xl' },
        { label: '2XL', value: '2xl' },
        { label: '3XL', value: '3xl' },
      ],
    },
    {
      key: 'lineHeight',
      label: 'Line height',
      type: 'select',
      choices: [
        { label: 'Default', value: '' },
        { label: 'Tight', value: 'tight' },
        { label: 'Snug', value: 'snug' },
        { label: 'Normal', value: 'normal' },
        { label: 'Relaxed', value: 'relaxed' },
      ],
    },
    { key: 'textColor', label: 'Text colour', type: 'color' },
    { key: 'bgColor', label: 'Background colour', type: 'color' },
    { key: 'paddingY', label: 'Padding top/bottom (px)', type: 'range', min: 0, max: 48, step: 2 },
  ],
  insert: ({ editor }) => editor.chain().focus().toggleBlockquote().run(),
}

export const codeBlockDef: BlockDefinition = {
  name: 'codeBlock',
  title: 'Code',
  description: 'Syntax-highlighted code block',
  category: 'text',
  icon: Code2,
  keywords: ['code', 'snippet', 'pre'],
  defaults: { language: '', lineNumbers: false, codeTheme: 'dark' },
  options: [
    {
      key: 'language',
      label: 'Language',
      type: 'select',
      choices: [
        { label: 'Plain', value: '' },
        { label: 'JavaScript', value: 'javascript' },
        { label: 'TypeScript', value: 'typescript' },
        { label: 'HTML', value: 'html' },
        { label: 'CSS', value: 'css' },
        { label: 'JSON', value: 'json' },
        { label: 'Python', value: 'python' },
        { label: 'Bash', value: 'bash' },
        { label: 'SQL', value: 'sql' },
      ],
    },
    {
      key: 'codeTheme',
      label: 'Theme',
      type: 'segmented',
      choices: [
        { label: 'Dark', value: 'dark' },
        { label: 'Light', value: 'light' },
      ],
    },
    { key: 'lineNumbers', label: 'Show line numbers', type: 'toggle' },
  ],
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

