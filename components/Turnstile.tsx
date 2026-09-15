'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          'error-callback'?: () => void;
          'expired-callback'?: () => void;
          theme?: 'light' | 'dark' | 'auto';
        }
      ) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId: string) => void;
    };
    onloadTurnstileCallback?: () => void;
  }
}

interface TurnstileProps {
  onSuccess: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  nonce?: string;
  theme?: 'light' | 'dark' | 'auto';
  className?: string;
}

export default function Turnstile({
  onSuccess,
  onError,
  onExpire,
  nonce,
  theme = 'light',
  className = '',
}: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const siteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY;

  useEffect(() => {
    // If no site key configured or in dev bypass mode
    if (!siteKey) {
      onSuccess('dev-bypass-token');
      return;
    }

    let isMounted = true;

    const renderWidget = () => {
      if (!isMounted || !containerRef.current || !window.turnstile) return;
      if (widgetIdRef.current) return;

      try {
        const id = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token: string) => {
            if (isMounted) onSuccess(token);
          },
          'error-callback': () => {
            if (isMounted && onError) onError();
          },
          'expired-callback': () => {
            if (isMounted && onExpire) onExpire();
          },
          theme,
        });
        widgetIdRef.current = id;
      } catch (err) {
        console.warn('[Turnstile] render error:', err);
      }
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      // Load script if not already present
      const SCRIPT_ID = 'cf-turnstile-script';
      let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.id = SCRIPT_ID;
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        const effectiveNonce =
          nonce ||
          (typeof document !== 'undefined'
            ? document.querySelector('meta[name="csp-nonce"]')?.getAttribute('content') ||
              (document.querySelector('script[nonce]') as HTMLScriptElement)?.nonce
            : undefined);
        if (effectiveNonce) {
          script.nonce = effectiveNonce;
        }
        document.head.appendChild(script);
      }

      const checkInterval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(checkInterval);
          renderWidget();
        }
      }, 50);

      const timeout = setTimeout(() => {
        clearInterval(checkInterval);
      }, 5000);

      return () => {
        isMounted = false;
        clearInterval(checkInterval);
        clearTimeout(timeout);
        if (widgetIdRef.current && window.turnstile) {
          try {
            window.turnstile.remove(widgetIdRef.current);
            widgetIdRef.current = null;
          } catch {
            // ignore
          }
        }
      };
    }

    return () => {
      isMounted = false;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        } catch {
          // ignore
        }
      }
    };
  }, [siteKey, onSuccess, onError, onExpire, nonce, theme]);

  if (!siteKey) {
    return null;
  }

  return (
    <div className={`turnstile-container my-2 ${className}`}>
      <div ref={containerRef} />
    </div>
  );
}
