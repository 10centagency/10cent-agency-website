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

export default function GoogleTagManager() {
  const pathname = usePathname();
  const [isLoaded, setIsLoaded] = useState(false);

  // GTM script injection after idle or user interaction (excluded on /admin)
  useEffect(() => {
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
      script.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-5M652RR4';
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
  }, [pathname, isLoaded]);

  // SPA PageView Tracking: push route-change & initial-load event to dataLayer
  useEffect(() => {
    // Skip on admin routes or before GTM is loaded
    if (!isLoaded || !pathname || pathname.startsWith('/admin')) return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'spaPageView',
      pagePath: pathname,
      pageLocation: window.location.href,
      pageTitle: document.title,
    });
  }, [pathname, isLoaded]);

  // Don't render noscript on admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <noscript>
      <iframe
        src="https://www.googletagmanager.com/ns.html?id=GTM-5M652RR4"
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  );
}
