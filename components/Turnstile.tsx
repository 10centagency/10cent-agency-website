'use client';

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          action?: string;
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

export interface TurnstileRef {
  reset: () => void;
}

interface TurnstileProps {
  onSuccess: (token: string) => void;
  onError?: (error?: string) => void;
  onExpire?: () => void;
  nonce?: string;
  theme?: 'light' | 'dark' | 'auto';
  action?: string;
  className?: string;
}

const Turnstile = forwardRef<TurnstileRef, TurnstileProps>(function Turnstile(
  {
    onSuccess,
    onError,
    onExpire,
    nonce,
    theme = 'light',
    action,
    className = '',
  },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);

  // Canonical public site key with backwards compatibility fallback
  const siteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ||
    process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY;

  useImperativeHandle(ref, () => ({
    reset: () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.reset(widgetIdRef.current);
        } catch {
          // ignore
        }
      }
    },
  }));

  useEffect(() => {
    // Automated test execution only
    if (process.env.NODE_ENV === 'test') {
      onSuccess('test-mock-token');
      return;
    }

    // Outside automated test mode, missing site key must fail closed with recoverable UI message
    if (!siteKey) {
      const msg = 'Security verification is temporarily unavailable. Please reload or contact support.';
      setConfigError(msg);
      if (onError) onError(msg);
      return;
    }

    let isMounted = true;

    const renderWidget = () => {
      if (!isMounted || !containerRef.current || !window.turnstile) return;
      if (widgetIdRef.current) return;

      try {
        const id = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          action,
          callback: (token: string) => {
            if (isMounted) onSuccess(token);
          },
          'error-callback': () => {
            if (isMounted && onError) onError('Security challenge failed. Please retry.');
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
      // Load Turnstile script if not already present
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
  }, [siteKey, onSuccess, onError, onExpire, nonce, theme, action]);

  if (configError) {
    return (
      <div
        className={`turnstile-error text-xs text-rose-600 p-2 border border-rose-200 bg-rose-50 rounded-lg ${className}`}
      >
        {configError}
      </div>
    );
  }

  if (!siteKey && process.env.NODE_ENV !== 'test') {
    return null;
  }

  return (
    <div className={`turnstile-container my-2 ${className}`}>
      <div ref={containerRef} />
    </div>
  );
});

export default Turnstile;
