'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Shield, Settings, X, Check } from 'lucide-react';

export const CONSENT_STORAGE_KEY = 'tc_consent_v1';

export interface ConsentPreferences {
  version: string;
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

function updateGoogleConsent(preferences: ConsentPreferences) {
  if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
    (window as any).gtag('consent', 'update', {
      ad_storage: preferences.marketing ? 'granted' : 'denied',
      analytics_storage: preferences.analytics ? 'granted' : 'denied',
      ad_user_data: preferences.marketing ? 'granted' : 'denied',
      ad_personalization: preferences.marketing ? 'granted' : 'denied',
    });
  }
}

function savePreferencesToStorage(preferences: ConsentPreferences) {
  try {
    const serialized = JSON.stringify(preferences);
    localStorage.setItem(CONSENT_STORAGE_KEY, serialized);
    // Write cookie for potential server-side reads (1 year expiry)
    document.cookie = `${CONSENT_STORAGE_KEY}=${encodeURIComponent(
      serialized
    )}; path=/; max-age=31536000; SameSite=Lax`;
  } catch {
    // Storage access may fail in restricted/private browsing
  }
}

export default function ConsentBanner() {
  const [hasResolved, setHasResolved] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [analyticsConsent, setAnalyticsConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  const triggerElementRef = useRef<HTMLElement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const modalFirstFocusRef = useRef<HTMLButtonElement>(null);

  // Initialize consent state from storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ConsentPreferences;
        if (parsed && typeof parsed === 'object') {
          setAnalyticsConsent(Boolean(parsed.analytics));
          setMarketingConsent(Boolean(parsed.marketing));
          setShowBanner(false);
          setHasResolved(true);
          return;
        }
      }
    } catch {
      // ignore
    }
    // No prior consent: show banner
    setShowBanner(true);
    setHasResolved(true);
  }, []);

  // Listen for custom event to reopen preferences (e.g. from footer link)
  useEffect(() => {
    const handleOpen = () => {
      triggerElementRef.current = document.activeElement as HTMLElement | null;
      setShowModal(true);
    };

    window.addEventListener('tc_open_consent', handleOpen);
    return () => window.removeEventListener('tc_open_consent', handleOpen);
  }, []);

  const handleAcceptAll = useCallback(() => {
    const pref: ConsentPreferences = {
      version: 'v1',
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    };
    setAnalyticsConsent(true);
    setMarketingConsent(true);
    savePreferencesToStorage(pref);
    updateGoogleConsent(pref);
    setShowBanner(false);
    setShowModal(false);
  }, []);

  const handleRejectNonEssential = useCallback(() => {
    const pref: ConsentPreferences = {
      version: 'v1',
      essential: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    };
    setAnalyticsConsent(false);
    setMarketingConsent(false);
    savePreferencesToStorage(pref);
    updateGoogleConsent(pref);
    setShowBanner(false);
    setShowModal(false);
  }, []);

  const handleSaveCustom = useCallback(() => {
    const pref: ConsentPreferences = {
      version: 'v1',
      essential: true,
      analytics: analyticsConsent,
      marketing: marketingConsent,
      timestamp: new Date().toISOString(),
    };
    savePreferencesToStorage(pref);
    updateGoogleConsent(pref);
    setShowBanner(false);
    setShowModal(false);

    if (triggerElementRef.current) {
      triggerElementRef.current.focus();
    }
  }, [analyticsConsent, marketingConsent]);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    if (triggerElementRef.current) {
      triggerElementRef.current.focus();
    }
  }, []);

  // Trap focus inside modal dialog and support Escape key
  useEffect(() => {
    if (!showModal) return;

    // Focus first interactive element in modal
    setTimeout(() => {
      modalFirstFocusRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleCloseModal();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showModal, handleCloseModal]);

  if (!hasResolved) {
    return null;
  }

  return (
    <>
      {/* 1. Floating Banner (Keyboard accessible, no focus trap) */}
      {showBanner && !showModal && (
        <aside
          role="region"
          aria-label="Cookie consent banner"
          className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 bg-brand-navy/95 backdrop-blur-md border-t border-brand-border text-white shadow-2xl transition-all duration-300"
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3 max-w-3xl">
              <Shield className="w-5 h-5 text-brand-blue flex-shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm text-white/80 leading-relaxed">
                We use cookies and Google Consent Mode v2 to analyze site performance and deliver
                personalized experiences. You can accept all, reject non-essential cookies, or
                customize your preferences anytime.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <button
                type="button"
                onClick={handleAcceptAll}
                className="flex-1 sm:flex-initial px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-brand-blue hover:bg-brand-blue/90 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white/40"
              >
                Accept All
              </button>
              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="flex-1 sm:flex-initial px-4 py-2 text-xs sm:text-sm font-medium text-white/90 bg-white/10 hover:bg-white/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white/40"
              >
                Reject Non-Essential
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerElementRef.current = document.activeElement as HTMLElement | null;
                  setShowModal(true);
                }}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-white/70 hover:text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white/40"
              >
                <Settings className="w-4 h-4" aria-hidden="true" />
                <span>Customize</span>
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* 2. Preferences Modal Dialog (Traps focus, supports Escape) */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          role="presentation"
        >
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="tc-consent-title"
            aria-describedby="tc-consent-desc"
            className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-brand-border text-brand-textDark max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-4 border-b border-brand-border">
              <div className="flex items-center gap-2.5">
                <Shield className="w-5 h-5 text-brand-navy" aria-hidden="true" />
                <h2 id="tc-consent-title" className="text-lg font-bold text-brand-textDark">
                  Cookie &amp; Privacy Preferences
                </h2>
              </div>
              <button
                ref={modalFirstFocusRef}
                type="button"
                onClick={handleCloseModal}
                aria-label="Close preferences dialog"
                className="p-1 rounded-lg text-brand-textMid hover:text-brand-textDark hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <p id="tc-consent-desc" className="text-sm text-brand-textMid mt-4 leading-relaxed">
              Customize your cookie choices below. Essential cookies are required for basic site
              security and functionality. Non-essential cookies will remain denied unless you
              explicitly opt in.
            </p>

            <div className="mt-6 space-y-4">
              {/* Essential */}
              <div className="p-4 rounded-xl border border-brand-border bg-slate-50 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-brand-textDark">
                      Strictly Necessary Cookies
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-brand-blue/10 text-brand-blue rounded">
                      Required
                    </span>
                  </div>
                  <p className="text-xs text-brand-textMid mt-1">
                    Essential for security, Turnstile verification, and session management. Cannot
                    be disabled.
                  </p>
                </div>
                <div className="flex items-center h-6">
                  <Check className="w-5 h-5 text-brand-blue" aria-hidden="true" />
                </div>
              </div>

              {/* Analytics */}
              <div className="p-4 rounded-xl border border-brand-border bg-white flex items-start justify-between gap-4">
                <div>
                  <label
                    htmlFor="consent-analytics-toggle"
                    className="text-sm font-semibold text-brand-textDark cursor-pointer"
                  >
                    Analytics &amp; Performance
                  </label>
                  <p className="text-xs text-brand-textMid mt-1">
                    Helps us understand how visitors interact with our website to measure traffic
                    and improve services via Google Analytics (Consent Mode v2).
                  </p>
                </div>
                <div className="flex items-center h-6">
                  <input
                    id="consent-analytics-toggle"
                    type="checkbox"
                    checked={analyticsConsent}
                    onChange={(e) => setAnalyticsConsent(e.target.checked)}
                    className="w-5 h-5 rounded text-brand-blue border-slate-300 focus:ring-brand-blue cursor-pointer"
                  />
                </div>
              </div>

              {/* Marketing */}
              <div className="p-4 rounded-xl border border-brand-border bg-white flex items-start justify-between gap-4">
                <div>
                  <label
                    htmlFor="consent-marketing-toggle"
                    className="text-sm font-semibold text-brand-textDark cursor-pointer"
                  >
                    Marketing &amp; Personalization
                  </label>
                  <p className="text-xs text-brand-textMid mt-1">
                    Used to track visitor engagement across advertising platforms (such as Meta
                    Pixel) to serve relevant promotions.
                  </p>
                </div>
                <div className="flex items-center h-6">
                  <input
                    id="consent-marketing-toggle"
                    type="checkbox"
                    checked={marketingConsent}
                    onChange={(e) => setMarketingConsent(e.target.checked)}
                    className="w-5 h-5 rounded text-brand-blue border-slate-300 focus:ring-brand-blue cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-brand-border flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-brand-textMid hover:text-brand-textDark transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue"
              >
                Reject All Non-Essential
              </button>
              <button
                type="button"
                onClick={handleSaveCustom}
                className="w-full sm:w-auto px-5 py-2 text-sm font-semibold text-white bg-brand-navy hover:bg-brand-blue rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
