import { useEffect, useState } from 'react'
import type { Editor } from '@tiptap/core'
import { Plus, Minus, Trash2, Merge, Split, Rows3, Columns3, Table2 } from 'lucide-react'
import { cx } from '../blocks/helpers'

/**
 * TableToolbar — floats above the table while the cursor is inside it.
 * Row/Column add-delete, merge/split, header toggle, table delete।
 */
export default function TableToolbar({ editor }: { editor: Editor | null }) {
  const [box, setBox] = useState<{ top: number; left: number } | null>(null)

  useEffect(() => {
    if (!editor) return

    const update = () => {
      if (!editor.isActive('table')) {
        setBox(null)
        return
      }
      const { state } = editor
      const $from = state.selection.$from
      let tablePos = -1
      for (let d = $from.depth; d > 0; d--) {
        if ($from.node(d).type.name === 'table') {
          tablePos = $from.before(d)
          break
        }
      }
      if (tablePos < 0) {
        setBox(null)
        return
      }
      const dom = editor.view.nodeDOM(tablePos)
      if (!dom || !(dom instanceof HTMLElement)) {
        setBox(null)
        return
      }
      const r = dom.getBoundingClientRect()
      setBox({ top: r.top, left: r.left })
    }

    editor.on('transaction', update)
    editor.on('selectionUpdate', update)
    editor.on('focus', update)
    update()
    return () => {
      editor.off('transaction', update)
      editor.off('selectionUpdate', update)
      editor.off('focus', update)
    }
  }, [editor])

  if (!editor || !box) return null

  /* mousedown must be prevented so the editor selection is not lost */
  const run = (fn: () => void) => (e: React.MouseEvent) => {
    e.preventDefault()
    fn()
  }
  const chain = () => editor.chain().focus()

  const Btn = ({
    onClick,
    title,
    children,
    danger,
  }: {
    onClick: () => void
    title: string
    children: React.ReactNode
    danger?: boolean
  }) => (
    <button
      type="button"
      title={title}
      onMouseDown={run(onClick)}
      className={cx(
        'flex h-7 items-center gap-1 rounded px-1.5 text-[11px] font-medium transition-colors',
        danger ? 'text-red-600 hover:bg-red-50' : 'text-slate-600 hover:bg-slate-100',
      )}
    >
      {children}
    </button>
  )

  return (
    <div
      className="drag-handle fixed z-40 flex items-center gap-0.5 rounded-lg border border-slate-200 bg-white px-1 py-1 shadow-panel"
      style={{ top: Math.max(8, box.top - 36), left: box.left }}
    >
      <Table2 className="mx-1 h-3.5 w-3.5 text-slate-400" />

      <Btn onClick={() => chain().addRowBefore().run()} title="Add row above">
        <Rows3 className="h-3.5 w-3.5" />
        <Plus className="h-2.5 w-2.5" />
      </Btn>
      <Btn onClick={() => chain().addRowAfter().run()} title="Add row below">
        <Rows3 className="h-3.5 w-3.5" />
        <Plus className="h-2.5 w-2.5" />
      </Btn>
      <Btn onClick={() => chain().deleteRow().run()} title="Delete row" danger>
        <Rows3 className="h-3.5 w-3.5" />
        <Minus className="h-2.5 w-2.5" />
      </Btn>

      <span className="mx-1 h-4 w-px bg-slate-200" />

      <Btn onClick={() => chain().addColumnBefore().run()} title="Add column left">
        <Columns3 className="h-3.5 w-3.5" />
        <Plus className="h-2.5 w-2.5" />
      </Btn>
      <Btn onClick={() => chain().addColumnAfter().run()} title="Add column right">
        <Columns3 className="h-3.5 w-3.5" />
        <Plus className="h-2.5 w-2.5" />
      </Btn>
      <Btn onClick={() => chain().deleteColumn().run()} title="Delete column" danger>
        <Columns3 className="h-3.5 w-3.5" />
        <Minus className="h-2.5 w-2.5" />
      </Btn>

      <span className="mx-1 h-4 w-px bg-slate-200" />

      <Btn onClick={() => chain().mergeCells().run()} title="Cell merge">
        <Merge className="h-3.5 w-3.5" />
      </Btn>
      <Btn onClick={() => chain().splitCell().run()} title="Cell split">
        <Split className="h-3.5 w-3.5" />
      </Btn>
      <Btn onClick={() => chain().toggleHeaderRow().run()} title="Header row">
        <span className="text-[10px] font-bold">HR</span>
      </Btn>
      <Btn onClick={() => chain().toggleHeaderColumn().run()} title="Header column">
        <span className="text-[10px] font-bold">HC</span>
      </Btn>

      <span className="mx-1 h-4 w-px bg-slate-200" />

      <Btn onClick={() => chain().deleteTable().run()} title="Delete table" danger>
        <Trash2 className="h-3.5 w-3.5" />
      </Btn>
    </div>
  )
}

