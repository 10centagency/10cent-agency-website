import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import { generateHTML, generateJSON } from '@tiptap/html'
import type { JSONContent } from '@tiptap/core'
import { allBlocks, extensionsFromRegistry } from './registry'
import { registerAllBlocks } from './blocks'
import { isDocEmpty } from './plainText'

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
  if (allBlocks().length === 0) {
    registerAllBlocks()
  }
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
  if (!doc || typeof doc !== 'object' || isDocEmpty(doc)) return ''
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
