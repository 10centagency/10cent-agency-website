'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function GoogleTagManager() {
  const pathname = usePathname();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Never load GTM on admin routes
    if (pathname?.startsWith('/admin')) {
      return;
    }

    if (isLoaded || typeof window === 'undefined') return;

    let timeoutId: NodeJS.Timeout | null = null;
    let idleId: number | null = null;

    const loadGTM = () => {
      cleanup();
      if ((window as unknown as { _gtmLoaded?: boolean })._gtmLoaded) return;
      (window as unknown as { _gtmLoaded?: boolean })._gtmLoaded = true;

      // Initialize dataLayer
      const win = window as unknown as { dataLayer: unknown[] };
      win.dataLayer = win.dataLayer || [];
      win.dataLayer.push({
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
        (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(idleId);
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
    if ('requestIdleCallback' in window) {
      idleId = (window as unknown as { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback(
        loadGTM,
        { timeout: 2500 }
      );
    } else {
      timeoutId = setTimeout(loadGTM, 2500);
    }

    return cleanup;
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
