import type { JSONContent } from '@tiptap/core'

/**
 * Tiptap JSON document → plain text.
 * Needed for RSS feed, excerpt, meta description, search index — everywhere.
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
    // text may live in atom block attrs (image+text body, CTA title, quote…)
    if (node.attrs && typeof node.attrs === 'object') {
      for (const key of TEXT_ATTRS) {
        const v = node.attrs[key]
        if (typeof v === 'string' && v.trim() && !/^(https?:|\/|#|data:)/.test(v.trim())) {
          out.push(stripHtml(v), ' ')
        }
      }
      // Repeater (list) attributes hold arrays of objects — stats items, FAQ q/a,
      // pricing plans, timeline steps, team members, logos, TOC links, gallery
      // alts. Pull the human-readable strings out of every nested object.
      for (const v of Object.values(node.attrs)) {
        if (Array.isArray(v)) {
          for (const item of v) {
            if (item && typeof item === 'object') collectStrings(item, out)
          }
        }
      }
    }
    // a space after each block stops words running together
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

/** Text stored in node attrs (image+text body, caption, CTA title etc.) */
const TEXT_ATTRS = ['heading', 'body', 'caption', 'label', 'quote', 'text', 'title', 'bio', 'sample']

function stripHtml(input: string): string {
  return input
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Recursively collect readable strings from a repeater item (skips URL fields). */
function collectStrings(obj: Record<string, unknown>, out: string[]) {
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      const t = value.trim()
      if (t && !URL_KEYS.has(key.toLowerCase()) && !/^(https?:|\/|#|data:)/.test(t)) {
        out.push(stripHtml(value), ' ')
      }
    } else if (Array.isArray(value)) {
      value.forEach((x) => {
        if (x && typeof x === 'object') collectStrings(x as Record<string, unknown>, out)
      })
    }
  }
}

const URL_KEYS = new Set([
  'src', 'url', 'href', 'image', 'avatar', 'logo', 'photo', 'poster',
  'linkurl', 'link', 'ctaurl', 'linkedin', 'website', 'bgimage', 'buttonurl',
  'button2url',
])

const BLOCK_TYPES = new Set([
  'paragraph', 'heading', 'blockquote', 'bulletList', 'orderedList', 'listItem',
  'codeBlock', 'imageBlock', 'galleryBlock', 'beforeAfterBlock', 'columnsBlock',
  'columnBlock', 'dividerBlock', 'spacerBlock', 'calloutBlock', 'colorPaletteBlock',
  'ctaBlock', 'statsBlock', 'testimonialBlock', 'faqBlock',
])

/** Whether the doc has real content — used as an empty-save guard */
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
  // Added: blocks whose text lives in attrs (or that are purely visual). Without
  // these, a doc made only of such blocks was treated as empty and saved as null.
  'pricingBlock', 'timelineBlock', 'logoGridBlock', 'teamBlock', 'typographyBlock',
  'tocBlock', 'buttonBlock', 'fullImageBlock', 'videoBlock', 'embedBlock',
  'htmlBlock', 'imageTextBlock',
])
