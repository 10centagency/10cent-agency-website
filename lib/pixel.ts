// Type declaration for fbq global
declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
    _fbq: unknown;
  }
}

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '';

/**
 * Checks if marketing consent has been explicitly granted by the user via tc_consent_v1
 */
export function hasMarketingConsent(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const stored = localStorage.getItem('tc_consent_v1');
    if (stored) {
      const pref = JSON.parse(stored);
      return Boolean(pref && typeof pref === 'object' && pref.marketing);
    }
  } catch {
    // Restricted storage environment
  }
  return false;
}

// ─── Core helper ────────────────────────────────────────────────────────────

function fbq(...args: unknown[]) {
  // Only execute tracking if marketing consent is granted and fbq exists
  if (typeof window !== 'undefined' && hasMarketingConsent() && typeof window.fbq === 'function') {
    window.fbq(...args);
  }
}

// ─── Page tracking ──────────────────────────────────────────────────────────

export function pageView() {
  fbq('track', 'PageView');
}

// ─── Standard events ────────────────────────────────────────────────────────

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
