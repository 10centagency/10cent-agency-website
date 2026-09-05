/**
 * ══════════════════════════════════════════════════════════════════════════
 *  components/editor/index.ts — public API
 *
 *  বাইরের কোড (BlogForm, PortfolioForm, public pages, RSS) শুধু এই ফাইল
 *  থেকে import করবে। ভেতরের ফাইল-গঠন বদলালেও এই API একই থাকবে।
 *
 *  import { BlockEditor, renderDocToHtml, plainTextFromDoc } from '@/components/editor'
 * ══════════════════════════════════════════════════════════════════════════*/

/* ── React কম্পোনেন্ট ──────────────────────────────────────────────────── */
export { default as BlockEditor, editorExtensions } from './BlockEditor'
export type { BlockEditorProps } from './BlockEditor'

/* ── Registry (block যোগ/খোঁজা) ────────────────────────────────────────── */
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
