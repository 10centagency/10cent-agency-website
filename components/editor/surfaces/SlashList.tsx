import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import type { InserterItem } from '../types'
import { cx } from '../blocks/helpers'

export interface SlashListHandle {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean
}

interface SlashListProps {
  items: InserterItem[]
  command: (item: InserterItem) => void
}

/** "/" টাইপ করলে যে লিস্ট দেখায় — BlockPicker-এর compact ভার্সন */
const SlashList = forwardRef<SlashListHandle, SlashListProps>(({ items, command }, ref) => {
  const [selected, setSelected] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => setSelected(0), [items])

  useEffect(() => {
    const el = containerRef.current?.querySelector<HTMLElement>(`[data-index="${selected}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [selected])

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (!items.length) return false
      if (event.key === 'ArrowUp') {
        setSelected((s) => (s + items.length - 1) % items.length)
        return true
      }
      if (event.key === 'ArrowDown') {
        setSelected((s) => (s + 1) % items.length)
        return true
      }
      if (event.key === 'Enter') {
        command(items[selected])
        return true
      }
      return false
    },
  }))

  if (!items.length) return null

  return (
    <div
      ref={containerRef}
      className="max-h-[300px] w-[300px] overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-panel"
    >
      <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Blocks</p>
      {items.map((item, i) => {
        const Icon = item.icon
        return (
          <button
            key={item.id}
            data-index={i}
            type="button"
            onMouseEnter={() => setSelected(i)}
            onClick={() => command(item)}
            className={cx(
              'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors',
              selected === i ? 'bg-brand-blue/10' : 'hover:bg-slate-50',
            )}
          >
            <Icon className={cx('h-4 w-4 shrink-0', selected === i ? 'text-brand-blue' : 'text-slate-500')} />
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-slate-700">{item.title}</span>
              <span className="block truncate text-[11px] text-slate-400">{item.description}</span>
            </span>
          </button>
        )
      })}
      <p className="border-t border-slate-100 px-2 pb-0.5 pt-1.5 text-[10px] text-slate-400">
        ↑↓ navigate · ⏎ select · esc dismiss
      </p>
    </div>
  )
})

SlashList.displayName = 'SlashList'
export default SlashList
