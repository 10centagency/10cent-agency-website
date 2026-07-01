// Type declaration for fbq global
declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
    _fbq: unknown;
  }
}

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID!;

if (!META_PIXEL_ID) {
  console.error('[MetaPixel] NEXT_PUBLIC_META_PIXEL_ID is missing or empty. Check your .env.local file.');
}

// ─── Core helper ────────────────────────────────────────────────────────────

function fbq(...args: unknown[]) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq(...args);
  }
}

// ─── Page tracking ──────────────────────────────────────────────────────────

export function pageView() {
  fbq('track', 'PageView');
}

// ─── Standard events ────────────────────────────────────────────────────────
// Wire these to UI elements when ready.

export function trackLead(params?: Record<string, unknown>) {
  fbq('track', 'Lead', params);
}

export function trackContact(params?: Record<string, unknown>) {
  fbq('track', 'Contact', params);
}

export function trackPurchase(params?: { value: number; currency: string; [key: string]: unknown }) {
  fbq('track', 'Purchase', params);
}

export function trackCustom(eventName: string, params?: Record<string, unknown>) {
  fbq('trackCustom', eventName, params);
}

// ─── CAPI-ready structure ────────────────────────────────────────────────────
// When adding Conversions API, create lib/capi.ts alongside this file.
// Each function above can be extended to call both fbq() AND your CAPI endpoint.
// Example pattern:
//   export async function trackLeadWithCAPI(params) {
//     trackLead(params);                        // browser pixel
//     await sendToCAPI({ event: 'Lead', params }); // server-side CAPI
//   }

// ─── CAPI helpers ───────────────────────────────────────────────────────────

import { v4 as uuidv4 } from 'uuid';

export function getCookieValue(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1];
}

export async function trackEventWithCAPI(eventName: string) {
  const eventId = uuidv4();
  const eventSourceUrl = window.location.href;
  const fbc = getCookieValue('_fbc');
  const fbp = getCookieValue('_fbp');

  // Browser Pixel (client-side) — for deduplication, pass eventID
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', eventName, {}, { eventID: eventId });
  }

  // Server-side CAPI
  await fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventName,
      eventId,
      eventSourceUrl,
      fbc,
      fbp,
    }),
  });
}
