import type { AnyExtension, Editor } from '@tiptap/core'
import type { ComponentType } from 'react'

/* ────────────────────────────────────────────────────────────────────────────
 * Block categories — inserter panel + slash menu এই ভাগ ব্যবহার করে
 * ─�─────────────────────────────────────────────────────────────────────────*/
export type UploadFn = (file: File) => Promise<string | null>

export type BlockCategoryId = 'text' | 'media' | 'layout' | 'marketing' | 'design' | 'advanced'

export interface BlockCategory {
  id: BlockCategoryId
  label: string
}

export const CATEGORIES: BlockCategory[] = [
  { id: 'text', label: 'Text' },
  { id: 'media', label: 'Media' },
  { id: 'layout', label: 'Layout' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'design', label: 'Design' },
  { id: 'advanced', label: 'Advanced' },
]

/* ────────────────────────────────────────────────────────────────────────────
 * Inspector options — declarative field schema (Gutenberg InspectorControls)
 * ──────────────────────────────────────────────────────────────────────────*/
export type OptionField =
  | { key: string; label: string; type: 'text'; placeholder?: string }
  | { key: string; label: string; type: 'textarea'; placeholder?: string; rows?: number }
  | { key: string; label: string; type: 'select'; choices: { label: string; value: string }[] }
  | { key: string; label: string; type: 'segmented'; choices: { label: string; value: string }[] }
  | { key: string; label: string; type: 'number'; min?: number; max?: number; step?: number }
  | { key: string; label: string; type: 'range'; min: number; max: number; step?: number }
  | { key: string; label: string; type: 'toggle' }
  | { key: string; label: string; type: 'color' }
  | { key: string; label: string; type: 'url'; placeholder?: string }
  | {
      key: string
      label: string
      type: 'list'
      itemLabel: string
      max?: number
      fields: OptionField[]
      defaultItem: Record<string, unknown>
    }

/* ────────────────────────────────────────────────────────────────────────────
 * Block definition — একটি block = একটি ফাইল = registry তে একটা entry
 * ──────────────────────────────────────────────────────────────────────────*/
export interface BlockVariation {
  /** "Heading 2", "3 Columns" — inserter-এ আলাদা item হিসেবে দেখায় */
  title: string
  keywords?: string[]
  attrs?: Record<string, unknown>
}

export interface BlockDefinition {
  /** ProseMirror node name (অথবা core node-এর নাম: paragraph, heading …) */
  name: string
  title: string
  description: string
  category: BlockCategoryId
  icon: ComponentType<{ className?: string }>
  /** স্ল্যাশ কমান্ড + সার্চ-এ মিলবে */
  keywords?: string[]
  /** কাস্টম node (থাকলে registry থেকে extension list-এ যাবে) — Table-এর মতো block-এ array */
  node?: AnyExtension | AnyExtension[]
  /** insert করার সময় default attrs */
  defaults?: Record<string, unknown>
  /** Inspector-এ যে options দেখাবে */
  options?: OptionField[]
  /** Gutenberg-এর block variations */
  variations?: BlockVariation[]
  /** insert logic (না দিলে default: insertContent node) */
  insert?: (args: { editor: Editor; attrs?: Record<string, unknown> }) => void
  /** inserter-এ লুকানো (যেমন: column — parent দিয়েই তৈরি হয়) */
  hidden?: boolean
}

/* ────────────────────────────────────────────────────────────────────────────
 * Inserter item — block + variation flatten করে তৈরি হয়
 * ──────────────────────────────────────────────────────────────────────────*/
export interface InserterItem {
  id: string
  blockName: string
  title: string
  description: string
  category: BlockCategoryId
  icon: ComponentType<{ className?: string }>
  keywords: string[]
  attrs?: Record<string, unknown>
}
