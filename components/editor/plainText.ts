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
