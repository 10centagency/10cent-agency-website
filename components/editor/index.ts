/**
 * ══════════════════════════════════════════════════════════════════════════
 *  components/editor/index.ts — public API
 *
 *  Outside code (BlogForm, PortfolioForm, public pages, RSS) should only
 *  import from this file. Internals may change; this API will not.
 *
 *  import { BlockEditor, renderDocToHtml, plainTextFromDoc } from '@/components/editor'
 * ══════════════════════════════════════════════════════════════════════════*/

/* ── React components ──────────────────────────────────────────────────── */
export { default as BlockEditor, editorExtensions } from './BlockEditor'
export type { BlockEditorProps } from './BlockEditor'

/* ── Registry (add / find blocks) ────────────────────────────────────────── */
export { registerAllBlocks } from './blocks'
export { registerBlock, registerBlocks, getBlock, allBlocks, inserterItems } from './registry'
export { moveBlock, duplicateBlock, deleteBlock, turnInto } from './commands'

/* ── Server-side / static render ───────────────────────────────────────── */
export { renderDocToHtml, renderExtensions, htmlToNodes } from './render'
export { plainTextFromDoc, isDocEmpty } from './plainText'
export { convertLegacyBlocks } from './legacy'

/* ── Types ─────────────────────────────────────────────────────────────── */
export type {
  UploadFn,
  BlockCategoryId,
  BlockCategory,
  BlockDefinition,
  BlockVariation,
  InserterItem,
  OptionField,
} from './types'
export { CATEGORIES } from './types'

