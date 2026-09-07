import type { AnyExtension, Editor } from '@tiptap/core'
import type { BlockDefinition, InserterItem } from './types'

/* ────────────────────────────────────────────────────────────────────────────
 *  SINGLE SOURCE OF TRUTH
 *  To add a block = one file in blocks/ + registerBlocks([...])
 *  Inserter, slash menu, inspector, extension list, static render — all automatic.
 * ──────────────────────────────────────────────────────────────────────────*/
const store = new Map<string, BlockDefinition>()

export function registerBlock(def: BlockDefinition): BlockDefinition {
  store.set(def.name, def)
  return def
}

export function registerBlocks(defs: BlockDefinition[]): void {
  defs.forEach(registerBlock)
}

export function getBlock(name: string): BlockDefinition | undefined {
  return store.get(name)
}

export function allBlocks(): BlockDefinition[] {
  return Array.from(store.values())
}

/** Tiptap extension list from the registry — used when creating the editor */
export function extensionsFromRegistry(): AnyExtension[] {
  const out: AnyExtension[] = []
  for (const block of allBlocks()) {
    if (!block.node) continue
    if (Array.isArray(block.node)) out.push(...block.node)
    else out.push(block.node)
  }
  return out
}

/** UniqueID type list from the registry */
export function customNodeNames(): string[] {
  return allBlocks()
    .filter((b) => b.node)
    .map((b) => b.name)
}

/* ── Inserter items: block + variations flatten ─────────────────────────────*/
export function inserterItems(): InserterItem[] {
  const items: InserterItem[] = []
  for (const block of allBlocks()) {
    if (block.hidden) continue
    if (block.variations?.length) {
      block.variations.forEach((v, i) => {
        items.push({
          id: `${block.name}__${i}`,
          blockName: block.name,
          title: v.title,
          description: block.description,
          category: block.category,
          icon: block.icon,
          keywords: [...(block.keywords ?? []), ...(v.keywords ?? []), block.title, v.title],
          attrs: { ...(block.defaults ?? {}), ...(v.attrs ?? {}) },
        })
      })
    } else {
      items.push({
        id: block.name,
        blockName: block.name,
        title: block.title,
        description: block.description,
        category: block.category,
        icon: block.icon,
        keywords: [...(block.keywords ?? []), block.title],
        attrs: { ...(block.defaults ?? {}) },
      })
    }
  }
  return items
}

/** fuzzy-ish search: by title / keywords / category */
export function searchBlocks(query: string, items = inserterItems()): InserterItem[] {
  const q = query.trim().toLowerCase()
  if (!q) return items
  return items.filter((item) => {
    if (item.title.toLowerCase().includes(q)) return true
    if (item.category.includes(q)) return true
    return item.keywords.some((k) => k.toLowerCase().includes(q))
  })
}

/* ── Insertion ──────────────────────────────────────────────────────────────*/
export function insertBlock(
  editor: Editor,
  blockName: string,
  attrs?: Record<string, unknown>,
  /** Where to insert — default: at the cursor / end */
  pos?: number,
): void {
  const def = getBlock(blockName)
  if (!def || !editor) return
  const finalAttrs = { ...(def.defaults ?? {}), ...(attrs ?? {}) }

  // "insert after position pos" mode (from the drag handle ➕)
  if (typeof pos === 'number') {
    editor
      .chain()
      .focus()
      .insertContentAt(pos, { type: blockName, attrs: finalAttrs })
      .run()
    return
  }

  if (def.insert) {
    def.insert({ editor, attrs: finalAttrs })
    return
  }

  editor.chain().focus().insertContent({ type: blockName, attrs: finalAttrs }).run()
}

/** core node (paragraph/heading/list) — inserted via variations */
export function insertCore(
  editor: Editor,
  blockName: string,
  attrs?: Record<string, unknown>,
): void {
  const def = getBlock(blockName)
  if (def?.insert) def.insert({ editor, attrs: { ...(def.defaults ?? {}), ...(attrs ?? {}) } })
}

/**
 * Insert a block at an explicit document position — used by drag-and-drop from
 * the Blocks library. Core/text blocks act on the current selection via toggle
 * commands, so we drop an empty paragraph at the drop point, select it, then
 * run the block's normal insert. Custom node blocks insert directly.
 */
export function insertBlockAt(
  editor: Editor,
  blockName: string,
  pos: number,
  attrs?: Record<string, unknown>,
): void {
  const def = getBlock(blockName)
  if (!def || !editor) return
  const finalAttrs = { ...(def.defaults ?? {}), ...(attrs ?? {}) }

  if (def.node) {
    editor.chain().focus()
      .insertContentAt(pos, { type: blockName, attrs: finalAttrs })
      .run()
    tidyAfterInsert(editor)
    return
  }

  editor.chain().focus()
    .insertContentAt(pos, { type: 'paragraph' })
    .setTextSelection(pos + 1)
    .run()
  if (def.insert) def.insert({ editor, attrs: finalAttrs })
  tidyAfterInsert(editor)
}

/**
 * After inserting a block via the slash menu / "Add Block", the paragraph that
 * held the "/" (or the empty paragraph the block was inserted next to) is left
 * behind as a dangling empty paragraph. Remove those empty top-level paragraphs
 * so a new block (heading, table, CTA…) does not come with a stray paragraph
 * stuck before/after it. Only removes EMPTY paragraphs (never typed text).
 */
export function tidyAfterInsert(editor: Editor): void {
  const { doc } = editor.state
  const tr = editor.state.tr
  const empties: { from: number; to: number }[] = []
  doc.forEach((node, offset) => {
    if (node.type.name === 'paragraph' && node.content.size === 0) {
      empties.push({ from: offset, to: offset + node.nodeSize })
    }
  })
  // Delete from the end so positions stay valid.
  for (let i = empties.length - 1; i >= 0; i--) {
    const { from, to } = empties[i]
    // Never leave the document with zero nodes — keep at least one node.
    if (tr.doc.childCount - (empties.length - 1 - i) <= 1) continue
    tr.delete(from, to)
  }
  if (tr.docChanged) {
    tr.setMeta('addToHistory', true)
    editor.view.dispatch(tr)
  }
}

