import { useRef, useState } from 'react'
import type { Editor } from '@tiptap/core'
import { Plus, Trash2, ChevronUp, ChevronDown, Settings2, FileText, ChevronRight, Upload, Loader2 } from 'lucide-react'
import type { OptionField, UploadFn } from '../types'
import { getBlock } from '../registry'
import { cx } from '../blocks/helpers'
import type { ActiveBlock } from '../types.runtime'

interface InspectorProps {
  editor: Editor
  active: ActiveBlock | null
  upload?: UploadFn
}

export default function Inspector({ editor, active, upload }: InspectorProps) {
  const [tab, setTab] = useState<'block' | 'document'>('block')
  const def = active ? getBlock(active.name) : undefined

  const update = (key: string, value: unknown) => {
    if (!active) return
    const node = editor.state.doc.resolve(active.pos).nodeAfter
    if (!node) return
    const tr = editor.state.tr.setNodeMarkup(
      active.pos,
      undefined,
      { ...node.attrs, [key]: value },
    )
    tr.setMeta('addToHistory', true)
    editor.view.dispatch(tr)
  }

  const updateList = (key: string, next: Record<string, unknown>[]) => update(key, next)

  return (
    <aside className="flex w-[300px] shrink-0 flex-col border-l border-slate-200 bg-white">
      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        {(
          [
            { id: 'block', label: 'Block', icon: Settings2 },
            { id: 'document', label: 'Document', icon: FileText },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cx(
              'flex flex-1 items-center justify-center gap-1.5 border-b-2 px-3 py-2.5 text-xs font-semibold transition-colors',
              tab === t.id
                ? 'border-brand-blue text-brand-blue'
                : 'border-transparent text-slate-500 hover:text-slate-700',
            )}
          >
            <t.icon className="h-3.5 w-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {tab === 'block' ? (
          !active || !def ? (
            <div className="p-6 text-center text-sm text-slate-400">
              <p>No block selected.</p>
              <p className="mt-1 text-xs">Click any block to edit its options.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {/* Block header */}
              <div className="bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <def.icon className="h-4 w-4 text-brand-blue" />
                  <span className="text-sm font-semibold text-slate-800">{def.title}</span>
                </div>
                <p className="mt-0.5 text-[11px] text-slate-400">{def.description}</p>
              </div>

              {!def.options?.length ? (
                <div className="px-4 py-6 text-center text-xs text-slate-400">
                  This block has no options.
                  <br />
                  Edit content directly in the canvas.
                </div>
              ) : (
                <div className="space-y-4 p-4">
                  {def.options.map((field) => (
                    <Field
                      key={field.key}
                      field={field}
                      value={(active.attrs as Record<string, unknown>)[field.key]}
                      onChange={(v) => update(field.key, v)}
                      onChangeList={(v) => updateList(field.key, v)}
                      upload={upload}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        ) : (
          <DocumentPanel editor={editor} />
        )}
      </div>
    </aside>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
 * Field renderer — declarative schema → UI
 * ═════════════════════════════════════════════════════════════════════════*/
function Field({
  field,
  value,
  onChange,
  onChangeList,
  upload,
}: {
  field: OptionField
  value: unknown
  onChange: (v: unknown) => void
  onChangeList: (v: Record<string, unknown>[]) => void
  upload?: UploadFn
}) {
  const label = <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">{field.label}</span>

  switch (field.type) {
    case 'url':
      return <UrlField field={field} value={(value as string) ?? ''} onChange={onChange} upload={upload} />

    case 'text':
      return (
        <label className="block">
          {label}
          <input
            type="text"
            value={(value as string) ?? ''}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm text-slate-700 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
          />
        </label>
      )

    case 'textarea':
      return (
        <label className="block">
          {label}
          <textarea
            rows={field.rows ?? 3}
            value={(value as string) ?? ''}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
            className="w-full resize-y rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm text-slate-700 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
          />
        </label>
      )

    case 'select':
      return (
        <label className="block">
          {label}
          <select
            value={String(value ?? field.choices[0].value)}
            onChange={(e) => {
              const raw = e.target.value
              onChange(isNaN(Number(raw)) || raw === '' ? raw : Number(raw))
            }}
            className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm text-slate-700 focus:border-brand-blue focus:outline-none"
          >
            {field.choices.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
      )

    case 'segmented':
      return (
        <div>
          {label}
          <div className="flex overflow-hidden rounded-lg border border-slate-200">
            {field.choices.map((c, i) => (
              <button
                key={c.value}
                type="button"
                onClick={() => {
                  const raw = c.value
                  onChange(isNaN(Number(raw)) || raw === '' ? raw : Number(raw))
                }}
                className={cx(
                  'flex-1 px-2 py-1.5 text-xs font-medium transition-colors',
                  i > 0 && 'border-l border-slate-200',
                  String(value ?? field.choices[0].value) === c.value
                    ? 'bg-brand-blue text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-50',
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )

    case 'number':
      return (
        <label className="block">
          {label}
          <input
            type="number"
            value={Number(value ?? 0)}
            min={field.min}
            max={field.max}
            step={field.step}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm focus:border-brand-blue focus:outline-none"
          />
        </label>
      )

    case 'range':
      return (
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{field.label}</span>
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono text-slate-600">{String(value ?? field.min)}</span>
          </div>
          <input
            type="range"
            min={field.min}
            max={field.max}
            step={field.step ?? 1}
            value={Number(value ?? field.min)}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full accent-brand-blue"
          />
        </div>
      )

    case 'toggle':
      return (
        <button
          type="button"
          onClick={() => onChange(!value)}
          className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-2.5 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          <span>{field.label}</span>
          <span className={cx('relative h-5 w-9 rounded-full transition-colors', value ? 'bg-brand-blue' : 'bg-slate-300')}>
            <span className={cx('absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all', value ? 'left-4.5 left-[18px]' : 'left-0.5')} />
          </span>
        </button>
      )

    case 'color':
      return (
        <div>
          {label}
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={(value as string) ?? '#000000'}
              onChange={(e) => onChange(e.target.value)}
              className="h-9 w-12 cursor-pointer rounded border border-slate-200 bg-white p-0.5"
            />
            <input
              type="text"
              value={(value as string) ?? ''}
              onChange={(e) => onChange(e.target.value)}
              className="flex-1 rounded-lg border border-slate-200 px-2.5 py-1.5 font-mono text-xs uppercase focus:border-brand-blue focus:outline-none"
            />
          </div>
        </div>
      )

    case 'list': {
      const items = (value as Record<string, unknown>[]) ?? []
      const setItem = (i: number, key: string, v: unknown) => {
        const next = items.map((it, idx) => (idx === i ? { ...it, [key]: v } : it))
        onChangeList(next)
      }
      const move = (i: number, dir: -1 | 1) => {
        const next = [...items]
        const j = i + dir
        if (j < 0 || j >= next.length) return
        ;[next[i], next[j]] = [next[j], next[i]]
        onChangeList(next)
      }
      return (
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              {field.label} ({items.length})
            </span>
          </div>
          <div className="space-y-2">
            {items.map((item, i) => (
              <div key={i} className="rounded-lg border border-slate-200 bg-slate-50/60 p-2.5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase text-slate-400">
                    {field.itemLabel} {i + 1}
                  </span>
                  <div className="flex items-center gap-0.5">
                    <IconBtn onClick={() => move(i, -1)} disabled={i === 0}>
                      <ChevronUp className="h-3 w-3" />
                    </IconBtn>
                    <IconBtn onClick={() => move(i, 1)} disabled={i === items.length - 1}>
                      <ChevronDown className="h-3 w-3" />
                    </IconBtn>
                    <IconBtn danger onClick={() => onChangeList(items.filter((_, idx) => idx !== i))}>
                      <Trash2 className="h-3 w-3" />
                    </IconBtn>
                  </div>
                </div>
                <div className="space-y-2">
                  {field.fields.map((sub) => (
                    <Field
                      key={sub.key}
                      field={sub}
                      value={item[sub.key]}
                      onChange={(v) => setItem(i, sub.key, v)}
                      onChangeList={() => {}}
                      upload={upload}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            disabled={!!field.max && items.length >= field.max}
            onClick={() => onChangeList([...items, { ...field.defaultItem }])}
            className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-300 py-2 text-xs font-medium text-brand-blue hover:border-brand-blue hover:bg-brand-blue/5 disabled:opacity-40"
          >
            <Plus className="h-3.5 w-3.5" />
            Add {field.itemLabel.toLowerCase()}
          </button>
        </div>
      )
    }

    default:
      return null
  }
}

function UrlField({
  field,
  value,
  onChange,
  upload,
}: {
  field: Extract<OptionField, { type: 'url' }>
  value: string
  onChange: (v: unknown) => void
  upload?: UploadFn
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)

  return (
    <div>
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {field.label}
      </span>
      <div className="flex gap-1.5">
        <input
          type="text"
          value={value}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm text-slate-700 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
        />
        {upload && (
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            title="Upload image"
            className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          </button>
        )}
      </div>
      {upload && (
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0]
            if (!file) return
            setBusy(true)
            const url = await upload(file)
            setBusy(false)
            if (url) onChange(url)
            e.target.value = ''
          }}
        />
      )}
    </div>
  )
}

function IconBtn({
  children,
  onClick,
  disabled,
  danger,
}: {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  danger?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cx(
        'flex h-5 w-5 items-center justify-center rounded transition-colors disabled:opacity-30',
        danger ? 'text-rose-500 hover:bg-rose-50' : 'text-slate-400 hover:bg-slate-200 hover:text-slate-600',
      )}
    >
      {children}
    </button>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
 * Document tab — outline + stats
 * ═════════════════════════════════════════════════════════════════════════*/
function DocumentPanel({ editor }: { editor: Editor }) {
  const blocks: { name: string; pos: number; text: string; index: number }[] = []
  editor.state.doc.forEach((node, offset, index) => {
    blocks.push({
      name: node.type.name,
      pos: offset,
      text: node.textContent.slice(0, 42),
      index,
    })
  })
  const words = editor.state.doc.textBetween(0, editor.state.doc.content.size, ' ').trim().split(/\s+/).filter(Boolean).length

  return (
    <div className="p-4">
      <div className="mb-4 grid grid-cols-2 gap-2">
        <Stat label="Blocks" value={blocks.length} />
        <Stat label="Words" value={words} />
      </div>

      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Outline</p>
      <div className="space-y-0.5">
        {blocks.map((b) => {
          const def = getBlock(b.name)
          const Icon = def?.icon ?? FileText
          return (
            <button
              key={`${b.pos}-${b.index}`}
              type="button"
              onClick={() => editor.chain().focus().setTextSelection(b.pos + 1).scrollIntoView().run()}
              className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-slate-50"
            >
              <Icon className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-medium text-slate-700">{def?.title ?? b.name}</span>
                {b.text && <span className="block truncate text-[10px] text-slate-400">{b.text}</span>}
              </span>
              <ChevronRight className="h-3 w-3 shrink-0 text-slate-300" />
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
      <p className="text-lg font-bold text-slate-800">{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-slate-400">{label}</p>
    </div>
  )
}

