import type { Editor } from '@tiptap/core'
import { getBlock } from './registry'
import type { InserterItem } from './types'

/** Index of a top-level doc child — by position (pos) */
export function blockIndexAt(editor: Editor, pos: number): number {
  let found = -1
  editor.state.doc.forEach((_node, offset, index) => {
    if (offset === pos) found = index
  })
  return found
}

export function nodeAt(editor: Editor, pos: number) {
  return editor.state.doc.resolve(pos).nodeAfter
}

/** Move a block up / down */
export function moveBlock(editor: Editor, pos: number, dir: -1 | 1) {
  const { state } = editor
  const { doc } = state
  const index = blockIndexAt(editor, pos)
  if (index < 0) return
  const target = index + dir
  if (target < 0 || target >= doc.childCount) return

  const node = doc.child(index)
  const sibling = doc.child(target)
  const tr = state.tr
  const from = pos
  const to = pos + node.nodeSize

  tr.delete(from, to)
  tr.insert(dir === -1 ? from - sibling.nodeSize : from + sibling.nodeSize, node)
  editor.view.dispatch(tr)
}

export function duplicateBlock(editor: Editor, pos: number) {
  const { state } = editor
  const node = nodeAt(editor, pos)
  if (!node) return
  const tr = state.tr
  tr.insert(pos + node.nodeSize, node.copy())
  editor.view.dispatch(tr)
}

export function deleteBlock(editor: Editor, pos: number) {
  const node = nodeAt(editor, pos)
  if (!node) return
  editor.view.dispatch(editor.state.tr.delete(pos, pos + node.nodeSize))
}

/** Convert a block into another block (Turn into) */
export function turnInto(editor: Editor, pos: number, type: string, attrs?: Record<string, unknown>) {
  const { state } = editor
  const node = nodeAt(editor, pos)
  if (!node) return

  const TEXT_TYPES = ['paragraph', 'heading', 'bulletList', 'orderedList', 'blockquote', 'codeBlock']
  const def = getBlock(type)

  // textblock → textblock: keeps the text and only changes the type
  if (node.isTextblock && TEXT_TYPES.includes(type)) {
    editor.chain().focus().setTextSelection(pos + 1).run()
    if (def?.insert) def.insert({ editor, attrs: { ...(def.defaults ?? {}), ...attrs } })
    return
  }

  const created = state.schema.nodes[type]?.createAndFill({ ...(def?.defaults ?? {}), ...attrs })
  if (!created) return
  const tr = state.tr
  tr.replaceWith(pos, pos + node.nodeSize, created)
  editor.view.dispatch(tr)
}

/** Insert after a given block (drag-handle ➕) */
export function insertAfter(editor: Editor, pos: number, item: InserterItem) {
  const node = nodeAt(editor, pos)
  const at = node ? pos + node.nodeSize : pos
  const def = getBlock(item.blockName)
  const attrs = { ...(def?.defaults ?? {}), ...(item.attrs ?? {}) }

  if (def?.insert) {
    // core block: insert a new paragraph and convert there
    editor.chain().focus().insertContentAt(at, { type: 'paragraph' }).run()
    def.insert({ editor, attrs })
    return
  }
  editor.chain().focus().insertContentAt(at, { type: item.blockName, attrs }).run()
}

/** Get the block at the current selection (for inspector + outline) */
export function activeBlock(editor: Editor) {
  if (!editor || !editor.state) return null
  const { state } = editor
  const sel = state.selection

  // NodeSelection (when a node like image/gallery is clicked and selected)
  if ((sel as any).node) {
    const node = (sel as any).node
    return { name: node.type.name, attrs: { ...node.attrs }, pos: sel.from }
  }

  const $from = sel.$from
  const depth = Math.min($from.depth, 1)
  if (depth < 1) return null
  const node = $from.node(depth)
  if (!node) return null
  return { name: node.type.name, attrs: { ...node.attrs }, pos: $from.before(depth) }
}

