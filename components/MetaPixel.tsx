'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { META_PIXEL_ID } from '@/lib/pixel';

export default function MetaPixel() {
  const pathname = usePathname();
  const initialized = useRef(false);

  useEffect(() => {
    if (!META_PIXEL_ID) return;

    if (!initialized.current) {
      initialized.current = true;
      return;
    }

    // Generate shared eventID for deduplication
    const eventId = crypto.randomUUID();
    const eventSourceUrl = window.location.href;

    // Browser Pixel
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'PageView', {}, { eventID: eventId });
    }

    // CAPI
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName: 'PageView',
        eventId: eventId,
        eventSourceUrl: eventSourceUrl,
      }),
    });

  }, [pathname]);

  return null;
}
