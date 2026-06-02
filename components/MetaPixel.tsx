'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { pageView, META_PIXEL_ID } from '@/lib/pixel';

export default function MetaPixel() {
  const pathname = usePathname();
  const initialized = useRef(false);

  useEffect(() => {
    if (!META_PIXEL_ID) return;

    // On the very first render, the inline <Script> in layout.tsx has already
    // called fbq('init') and fbq('track', 'PageView').
    // We skip this first effect run to prevent a duplicate PageView.
    if (!initialized.current) {
      initialized.current = true;
      return;
    }

    // Every subsequent pathname change = SPA navigation = fire PageView.
    pageView();
  }, [pathname]);

  return null;
}
