import { useRef, useState } from 'react'
import DragHandle from '@tiptap/extension-drag-handle-react'
import type { Editor } from '@tiptap/core'
import { Plus, GripVertical, ChevronUp, ChevronDown, Copy, Trash2, Shuffle } from 'lucide-react'
import type { Node } from '@tiptap/pm/model'
import BlockPicker from './BlockPicker'
import { duplicateBlock, deleteBlock, moveBlock, insertAfter, turnInto } from '../commands'
import type { InserterItem } from '../types'
import { cx } from '../blocks/helpers'

interface HandleState {
  node: Node | null
  pos: number
}

export default function BlockHandle({ editor }: { editor: Editor }) {
  const [handle, setHandle] = useState<HandleState>({ node: null, pos: -1 })
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null)
  const [picker, setPicker] = useState<{ x: number; y: number; mode: 'insert' | 'transform' } | null>(null)
  const anchorRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  const anchorFrom = (e: React.MouseEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
    anchorRef.current = { x: r.left, y: r.bottom + 6 }
    return anchorRef.current
  }

  const closeAll = () => {
    setMenu(null)
    setPicker(null)
  }

  const blockName = handle.node?.type.name ?? ''
  const nodeSize = handle.node?.nodeSize ?? 0

  return (
    <>
      <DragHandle
        editor={editor}
        nested
        onNodeChange={({ node, pos }) => setHandle({ node, pos })}
        className="drag-handle z-30"
      >
        <div className="flex items-center gap-0.5 rounded-md border border-slate-200 bg-white p-0.5 shadow-sm transition-opacity hover:border-brand-blue/40">
          <div
            role="button"
            title="Insert block after"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation()
              const a = anchorFrom(e)
              setPicker({ x: a.x, y: a.y, mode: 'insert' })
              setMenu(null)
            }}
            className="flex h-6 w-6 cursor-pointer items-center justify-center rounded text-slate-400 hover:bg-brand-blue/10 hover:text-brand-blue"
          >
            <Plus className="h-3.5 w-3.5" />
          </div>
          <div
            role="button"
            title="Drag to move · click for options"
            onClick={(e) => {
              e.stopPropagation()
              const a = anchorFrom(e)
              setMenu({ x: a.x, y: a.y })
              setPicker(null)
            }}
            className="flex h-6 w-6 cursor-grab items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-600 active:cursor-grabbing"
          >
            <GripVertical className="h-3.5 w-3.5" />
          </div>
        </div>
      </DragHandle>

      {/* ── Block context menu ─────────────────────────────────────────── */}
      {menu && (
        <div
          className="fixed z-[60] w-52 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-panel"
          style={{ left: menu.x, top: menu.y }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <MenuItem
            icon={<ChevronUp className="h-3.5 w-3.5" />}
            label="Move up"
            onClick={() => {
              moveBlock(editor, handle.pos, -1)
              closeAll()
            }}
          />
          <MenuItem
            icon={<ChevronDown className="h-3.5 w-3.5" />}
            label="Move down"
            onClick={() => {
              moveBlock(editor, handle.pos, 1)
              closeAll()
            }}
          />
          <MenuItem
            icon={<Copy className="h-3.5 w-3.5" />}
            label="Duplicate"
            onClick={() => {
              duplicateBlock(editor, handle.pos)
              closeAll()
            }}
          />
          <div className="my-1 h-px bg-slate-100" />
          <MenuItem
            icon={<Shuffle className="h-3.5 w-3.5" />}
            label="Turn into…"
            onClick={() => {
              setPicker({ x: menu.x, y: menu.y, mode: 'transform' })
              setMenu(null)
            }}
          />
          <div className="my-1 h-px bg-slate-100" />
          <MenuItem
            icon={<Trash2 className="h-3.5 w-3.5" />}
            label="Delete block"
            danger
            onClick={() => {
              deleteBlock(editor, handle.pos)
              closeAll()
            }}
          />
          <div className="border-t border-slate-100 px-3 py-1.5 text-[10px] text-slate-400">
            {blockName} · {nodeSize} chars
          </div>
        </div>
      )}

      {/* ── Inline block picker (insert after / turn into) ─────────────── */}
      {picker && (
        <div className="fixed z-[70]" style={{ left: picker.x, top: picker.y }}>
          <BlockPicker
            compact
            onClose={closeAll}
            onPick={(item: InserterItem) => {
              if (picker.mode === 'insert') insertAfter(editor, handle.pos, item)
              else turnInto(editor, handle.pos, item.blockName, item.attrs)
              closeAll()
            }}
          />
        </div>
      )}
    </>
  )
}

function MenuItem({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
  danger?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        'flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-sm transition-colors',
        danger ? 'text-rose-600 hover:bg-rose-50' : 'text-slate-700 hover:bg-slate-50',
      )}
    >
      <span className={cx('shrink-0', danger ? 'text-rose-500' : 'text-slate-400')}>{icon}</span>
      {label}
    </button>
  )
}

