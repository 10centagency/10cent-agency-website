'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackEventWithCAPI } from '@/lib/pixel';

export default function CAPIPageView() {
  const pathname = usePathname();
  const initialized = useRef(false);

  useEffect(() => {
    // Skip very first render — GTM already fired PageView on hard load
    if (!initialized.current) {
      initialized.current = true;
      // Still send CAPI for the first page load
      trackEventWithCAPI('PageView');
      return;
    }
    // SPA navigation — fire both browser pixel + CAPI
    trackEventWithCAPI('PageView');
  }, [pathname]);

  return null;
}
