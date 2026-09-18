'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

// Type declaration for dataLayer global
declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    _gtmLoaded?: boolean;
  }
}

/**
 * Generates a single event_id per page view.
 *
 * This ID is pushed into the dataLayer as `metaEventId` and is read by BOTH:
 *   1. the "Meta Pixel-PageView" tag  (browser pixel)
 *   2. the "CAPI-PageView" tag        (server-side Conversions API)
 */
function generateEventId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback for non-secure contexts where crypto.randomUUID is unavailable
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

interface GoogleTagManagerProps {
  nonce?: string;
}

export default function GoogleTagManager({ nonce }: GoogleTagManagerProps = {}) {
  const pathname = usePathname();
  const [isLoaded, setIsLoaded] = useState(false);

  // Read environment variable strictly. Zero hardcoded tracking IDs.
  const gtmId = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;

  // GTM script injection after idle or user interaction (excluded on /admin or when env var is missing)
  useEffect(() => {
    // If no GTM ID is provided in environment variables, do not load GTM
    if (!gtmId) {
      return;
    }

    // Never load GTM on admin routes
    if (pathname?.startsWith('/admin')) {
      return;
    }

    if (isLoaded || typeof window === 'undefined' || window._gtmLoaded) {
      if (window._gtmLoaded && !isLoaded) {
        setIsLoaded(true);
      }
      return;
    }

    let timeoutId: NodeJS.Timeout | null = null;
    let idleId: number | null = null;

    const loadGTM = () => {
      cleanup();
      if (window._gtmLoaded) return;
      window._gtmLoaded = true;

      // Initialize dataLayer
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js',
      });

      // Inject GTM script
      const script = document.createElement('script');
      script.async = true;
      if (nonce) {
        script.nonce = nonce;
      }
      script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
      document.head.appendChild(script);

      setIsLoaded(true);
    };

    const cleanup = () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (idleId && typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId);
      }
      window.removeEventListener('scroll', loadGTM);
      window.removeEventListener('mousemove', loadGTM);
      window.removeEventListener('touchstart', loadGTM);
      window.removeEventListener('keydown', loadGTM);
    };

    // User interaction triggers immediate load
    window.addEventListener('scroll', loadGTM, { passive: true, once: true });
    window.addEventListener('mousemove', loadGTM, { passive: true, once: true });
    window.addEventListener('touchstart', loadGTM, { passive: true, once: true });
    window.addEventListener('keydown', loadGTM, { passive: true, once: true });

    // Fallback: requestIdleCallback with 2.5s timeout or setTimeout
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(loadGTM, { timeout: 2500 });
    } else {
      timeoutId = setTimeout(loadGTM, 2500);
    }

    return cleanup;
  }, [pathname, isLoaded, nonce, gtmId]);

  // SPA PageView Tracking: push route-change & initial-load event to dataLayer
  useEffect(() => {
    if (!gtmId || !isLoaded || !pathname || pathname.startsWith('/admin')) return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'spaPageView',
      pagePath: pathname,
      pageLocation: window.location.href,
      pageTitle: document.title,
      metaEventId: generateEventId(),
    });
  }, [pathname, isLoaded, gtmId]);

  // If no GTM ID configured or on admin routes, do not render iframe or tag
  if (!gtmId || pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(gtmId)}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  );
}
