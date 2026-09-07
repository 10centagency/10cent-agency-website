import type { AnyExtension, Editor } from '@tiptap/core'
import type { ComponentType } from 'react'

/* ────────────────────────────────────────────────────────────────────────────
 * Block categories — used by the inserter panel and the slash menu
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
 * Block definition — one block = one file = one registry entry
 * ──────────────────────────────────────────────────────────────────────────*/
export interface BlockVariation {
  /** "Heading 2", "3 Columns" — shown as a separate item in the inserter */
  title: string
  keywords?: string[]
  attrs?: Record<string, unknown>
}

export interface BlockDefinition {
  /** ProseMirror node name (or a core node name: paragraph, heading …) */
  name: string
  title: string
  description: string
  category: BlockCategoryId
  icon: ComponentType<{ className?: string }>
  /** Matched by the slash command and search */
  keywords?: string[]
  /** Custom node (added to the extension list) — an array for blocks like Table */
  node?: AnyExtension | AnyExtension[]
  /** Default attributes used when inserting */
  defaults?: Record<string, unknown>
  /** Options shown in the inspector */
  options?: OptionField[]
  /** Gutenberg-style block variations */
  variations?: BlockVariation[]
  /** Insert logic (default: insertContent node) */
  insert?: (args: { editor: Editor; attrs?: Record<string, unknown> }) => void
  /** Hidden in the inserter (e.g. column — created by its parent) */
  hidden?: boolean
}

/* ────────────────────────────────────────────────────────────────────────────
 * Inserter item — built by flattening block + variation
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

