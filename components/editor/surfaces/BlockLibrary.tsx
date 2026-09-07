import { useMemo, useState } from 'react'
import { Search, Layers } from 'lucide-react'
import { CATEGORIES, type BlockCategoryId, type InserterItem } from '../types'
import { searchBlocks } from '../registry'
import { cx } from '../blocks/helpers'

export const BLOCK_DRAG_MIME = 'application/x-10cent-block'

interface BlockLibraryProps {
  onPick: (item: InserterItem) => void
  width?: number
}

/** Persistent left "Blocks" library — Elementor-style panel beside the canvas. */
export default function BlockLibrary({ onPick, width = 260 }: BlockLibraryProps) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<BlockCategoryId | 'all'>('all')

  const items = useMemo(() => {
    const searched = searchBlocks(query)
    return category === 'all' ? searched : searched.filter((i) => i.category === category)
  }, [query, category])

  return (
    <aside style={{ width }} className="flex shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center gap-2 border-b border-slate-200 px-3 py-2.5">
        <Layers className="h-4 w-4 text-brand-blue" />
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Blocks</span>
      </div>

      <div className="border-b border-slate-100 p-2">
        <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-2.5 py-2">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search blocks…"
            className="w-full min-w-0 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-1 border-b border-slate-100 px-2 py-2">
        {[{ id: 'all' as const, label: 'All' }, ...CATEGORIES].map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setCategory(cat.id as BlockCategoryId | 'all')}
            className={cx(
              'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
              category === cat.id ? 'bg-brand-blue text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {items.length === 0 ? (
          <p className="px-2 py-8 text-center text-sm text-slate-400">No blocks match “{query}”</p>
        ) : (
          <div
            className="grid gap-1.5"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))' }}
          >
            {items.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  type="button"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData(
                      BLOCK_DRAG_MIME,
                      JSON.stringify({ blockName: item.blockName, attrs: item.attrs }),
                    )
                    e.dataTransfer.effectAllowed = 'copy'
                  }}
                  onClick={() => onPick(item)}
                  title={`${item.description} — click or drag onto the canvas`}
                  className="flex cursor-grab flex-col items-center gap-1.5 rounded-lg border border-slate-200 px-1.5 py-3 transition-colors hover:border-brand-blue/60 hover:bg-brand-blue/5 active:cursor-grabbing"
                >
                  <Icon className="h-5 w-5 text-slate-500" />
                  <span className="line-clamp-2 text-center text-[10px] font-medium leading-tight text-slate-600">
                    {item.title}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div className="border-t border-slate-100 bg-slate-50 px-3 py-1.5 text-[10px] text-slate-400">
        Click or drag a block to add it
      </div>
    </aside>
  )
}
