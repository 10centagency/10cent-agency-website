/**
 * Preview handoff for the "Preview in new tab" feature.
 *
 * Uses localStorage (NOT sessionStorage): the preview tab is opened with
 * `window.open(..., '_blank', 'noopener,noreferrer')`, and a noopener tab does
 * not reliably share sessionStorage with the opener in Chrome/Safari, which
 * made the preview show "Nothing to preview". localStorage is shared same-origin.
 */

export function savePreview(key: string, data: unknown): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify({ data, savedAt: Date.now() }))
  } catch (e) {
    console.error('Failed to store preview data:', e)
  }
}

export function readPreview<T = unknown>(key: string): T | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return (parsed?.data as T) ?? null
  } catch (e) {
    console.error('Failed to read preview data:', e)
    return null
  }
}

export function clearPreview(key: string): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(key)
  } catch {
    // ignore
  }
}
