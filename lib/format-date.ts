/**
 * Deterministic date formatting helper for SSR and client hydration.
 *
 * Formats the date portion of an ISO timestamp using UTC timezone explicitly
 * so that server-side rendered HTML (Node.js/Vercel) and client-side hydration
 * (in any timezone like Bangladesh UTC+6, US UTC-5, etc.) produce 100% identical output.
 */

export function formatDateUTC(
  dateStr?: string | null,
  options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }
): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-GB', {
      ...options,
      timeZone: 'UTC',
    });
  } catch {
    return dateStr || '';
  }
}
