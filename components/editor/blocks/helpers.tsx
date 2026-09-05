import { mergeAttributes } from '@tiptap/core'

/** attribute-কে root element-এ auto-render করতে দেবে না (আমরা নিজেরা markup বানাই) */
export const suppress = () => ({})

/** array / object attribute (images, colors, items …) — JSON round-trip */
export function jsonAttr<T>(defaultValue: T) {
  return {
    default: defaultValue as T,
    parseHTML: (element: HTMLElement) => {
      const raw = element.getAttribute('data-json')
      if (!raw) return defaultValue
      try {
        return JSON.parse(raw) as T
      } catch {
        return defaultValue
      }
    },
    renderHTML: () => ({}),
  }
}

/** দুইটা class list একসাথে করে */
export const cx = (...parts: (string | false | null | undefined)[]) =>
  parts.filter(Boolean).join(' ')

export { mergeAttributes }

/* ── Demo assets: data-URI SVG (কোনো external network লাগে না) ─────────────*/
export function demoImage(label: string, from = '#93C5FD', to = '#2563EB', w = 1200, h = 675) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${from}"/><stop offset="100%" stop-color="${to}"/>
    </linearGradient></defs>
    <rect width="${w}" height="${h}" fill="url(#g)"/>
    <text x="50%" y="50%" font-family="system-ui,sans-serif" font-size="${Math.round(w / 14)}"
      font-weight="700" fill="rgba(255,255,255,.92)" text-anchor="middle" dominant-baseline="middle">${label}</text>
  </svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

/* ── Shared small components ───────────────────────────────────────────────*/
export function EmptyImageBox({
  label = 'Image',
  className = '',
}: {
  label?: string
  className?: string
}) {
  return (
    <div
      className={cx(
        'flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400',
        className,
      )}
    >
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.5-3.5L3 21" />
      </svg>
      <span className="text-xs font-medium">No {label} — set a URL in the inspector →</span>
    </div>
  )
}
