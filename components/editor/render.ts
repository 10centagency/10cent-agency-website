import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import { generateHTML, generateJSON } from '@tiptap/html'
import type { JSONContent } from '@tiptap/core'
import { extensionsFromRegistry, allBlocks } from './registry'
import { TextStyles } from './extensions/textStyles'
import { isDocEmpty } from './plainText'
import { registerAllBlocks } from './blocks'

/**
 * SERVER-SAFE extension list — nodes and marks only.
 *
 * SlashCommand / Placeholder / UniqueID / TrailingNode / FileHandler
 * These are plugin-only → not needed on the server; keeping them can cause problems.
 *
 * ⚠️ editorExtensions() (BlockEditor.tsx) and renderExtensions() —
 *    both must contain the same block nodes, or unknown nodes get dropped.
 */
/**
 * SERVER-SAFETY: when renderDocToHtml() is called in a server component
 * (e.g. app/blog/[slug]/page.tsx), BlogForm module-level `registerAllBlocks()`
 * does not run, so the registry may be empty and custom blocks are silently dropped.
 * So if the registry is empty, we register it here.
 */
function ensureBlocksRegistered() {
  if (allBlocks().length === 0) {
    // lazy require → avoids a circular import
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    registerAllBlocks()
  }
}

export function renderExtensions() {
  ensureBlocksRegistered()
  return [
    StarterKit.configure({
      heading: { levels: [1, 2, 3, 4] },
      link: { openOnClick: false },
      trailingNode: false, // no extra paragraph needed when rendering
    }),
    TextAlign.configure({ types: ['heading', 'paragraph', 'tableCell', 'tableHeader'] }),
    ...extensionsFromRegistry(),
    TextStyles,
  ]
}

/** Tiptap JSON → HTML (public page / RSS / meta description) */
export function renderDocToHtml(doc: JSONContent | null | undefined): string {
  // empty doc → return '' so the caller falls back (old content_blocks)
  if (!doc || isDocEmpty(doc)) return ''

  if (!doc || typeof doc !== 'object') return ''
  let html = ''
  try {
    html = generateHTML(doc as JSONContent, renderExtensions())
  } catch (err) {
    console.error('[renderDocToHtml] failed:', err)
    return ''
  }

  // Raw HTML block: its code is stored URI-encoded in data-code. Attribute order
  // is not guaranteed (mergeAttributes may emit class/data-block before data-code),
  // so match an empty div that carries data-block="html", then pull data-code out.
  html = html.replace(/<div([^>]*?)><\/div>/g, (match, attrs) => {
    if (!attrs.includes('data-block="html"')) return match
    const codeMatch = /data-code="([^"]*)"/.exec(attrs)
    if (!codeMatch) return match
    try {
      const cls = /class="([^"]*)"/.exec(attrs)?.[1] ?? 'my-6 raw-html'
      return `<div class="${cls}">${decodeURIComponent(codeMatch[1])}</div>`
    } catch {
      return match
    }
  })

  // Image+Text block: the rich-text body is stored URI-encoded in data-body.
  html = html.replace(/<div([^>]*?)><\/div>/g, (match, attrs) => {
    const bodyMatch = /data-body="([^"]*)"/.exec(attrs)
    if (!bodyMatch) return match
    try {
      const cls = /class="([^"]*)"/.exec(attrs)?.[1] ?? ''
      return `<div class="${cls}">${decodeURIComponent(bodyMatch[1])}</div>`
    } catch {
      return match
    }
  })

  return html
}

/** Legacy HTML string → Tiptap nodes (old block.content was HTML) */
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
