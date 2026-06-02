// Type declaration for fbq global
declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
    _fbq: unknown;
  }
}

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID!;

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
