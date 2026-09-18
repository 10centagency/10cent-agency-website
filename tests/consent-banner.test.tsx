// @vitest-environment happy-dom
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConsentBanner, { CONSENT_STORAGE_KEY } from '@/components/consent/ConsentBanner';
import CookiePreferencesButton from '@/components/consent/CookiePreferencesButton';
import ConsentModeScript from '@/components/consent/ConsentModeScript';
import GoogleTagManager from '@/components/GoogleTagManager';

describe('Consent Banner & Google Consent Mode v2 (ConsentBanner.tsx)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    (window as any).gtag = vi.fn();
  });

  it('1. displays floating consent banner on first visit when no consent is stored', () => {
    render(<ConsentBanner />);

    expect(screen.getByRole('region', { name: /cookie consent banner/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Accept All/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Reject Non-Essential/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Customize/i })).toBeDefined();
  });

  it('2. banner controls can be reached and activated via keyboard', async () => {
    const user = userEvent.setup();
    render(<ConsentBanner />);

    const acceptBtn = screen.getByRole('button', { name: /Accept All/i });
    const rejectBtn = screen.getByRole('button', { name: /Reject Non-Essential/i });
    const customizeBtn = screen.getByRole('button', { name: /Customize/i });

    acceptBtn.focus();
    expect(document.activeElement).toBe(acceptBtn);

    await user.tab();
    expect(document.activeElement).toBe(rejectBtn);

    await user.tab();
    expect(document.activeElement).toBe(customizeBtn);
  });

  it('3. "Accept All" stores choice in tc_consent_v1, calls gtag consent update, and dismisses banner', async () => {
    render(<ConsentBanner />);

    const acceptBtn = screen.getByRole('button', { name: /Accept All/i });
    fireEvent.click(acceptBtn);

    // Verify storage
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    expect(stored).toBeDefined();
    const parsed = JSON.parse(stored!);
    expect(parsed.analytics).toBe(true);
    expect(parsed.marketing).toBe(true);

    // Verify gtag update
    expect((window as any).gtag).toHaveBeenCalledWith('consent', 'update', {
      ad_storage: 'granted',
      analytics_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
    });

    // Verify banner is dismissed
    await waitFor(() => {
      expect(screen.queryByRole('region', { name: /cookie consent banner/i })).toBeNull();
    });
  });

  it('4. "Reject Non-Essential" stores choice in tc_consent_v1, sets non-essential to denied, and dismisses banner', async () => {
    render(<ConsentBanner />);

    const rejectBtn = screen.getByRole('button', { name: /Reject Non-Essential/i });
    fireEvent.click(rejectBtn);

    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    expect(stored).toBeDefined();
    const parsed = JSON.parse(stored!);
    expect(parsed.analytics).toBe(false);
    expect(parsed.marketing).toBe(false);

    expect((window as any).gtag).toHaveBeenCalledWith('consent', 'update', {
      ad_storage: 'denied',
      analytics_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });

    await waitFor(() => {
      expect(screen.queryByRole('region', { name: /cookie consent banner/i })).toBeNull();
    });
  });

  it('5. banner remains hidden on initial load if consent is already stored', () => {
    localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({
        version: 'v1',
        essential: true,
        analytics: true,
        marketing: false,
        timestamp: new Date().toISOString(),
      })
    );

    render(<ConsentBanner />);
    expect(screen.queryByRole('region', { name: /cookie consent banner/i })).toBeNull();
  });

  it('6. reopening preferences via custom event displays modal dialog with focus management and Escape key close', async () => {
    // Initial state: consent previously recorded
    localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({
        version: 'v1',
        essential: true,
        analytics: false,
        marketing: false,
        timestamp: new Date().toISOString(),
      })
    );

    render(<ConsentBanner />);
    expect(screen.queryByRole('dialog')).toBeNull();

    // Trigger open event from simulated external button
    const triggerBtn = document.createElement('button');
    document.body.appendChild(triggerBtn);
    triggerBtn.focus();

    act(() => {
      window.dispatchEvent(new CustomEvent('tc_open_consent'));
    });

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: /Cookie & Privacy Preferences/i })).toBeDefined();
    });

    // Press Escape to close modal
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull();
    });

    document.body.removeChild(triggerBtn);
  });

  it('7. CookiePreferencesButton dispatches tc_open_consent and reopens preferences modal with focus restoration', async () => {
    localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({
        version: 'v1',
        essential: true,
        analytics: false,
        marketing: false,
        timestamp: new Date().toISOString(),
      })
    );

    render(
      <div>
        <ConsentBanner />
        <CookiePreferencesButton />
      </div>
    );

    const cookieBtn = screen.getByRole('button', { name: /Cookie Preferences/i });
    expect(cookieBtn).toBeDefined();

    // Click button to open preferences
    cookieBtn.focus();
    fireEvent.click(cookieBtn);

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: /Cookie & Privacy Preferences/i })).toBeDefined();
    });

    // Close modal via the close (X) button
    const closeBtn = screen.getByRole('button', { name: /Close preferences dialog/i });
    fireEvent.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull();
    });

    // Focus must be restored to the Cookie Preferences button
    expect(document.activeElement).toBe(cookieBtn);
  });

  it('8. ConsentModeScript initializes gtag with default denied consent in head before any tags run', () => {
    const { container } = render(<ConsentModeScript nonce="test-csp-nonce" />);
    const script = container.querySelector('script#tc-consent-mode-init');

    expect(script).toBeDefined();
    expect(script?.getAttribute('nonce')).toBe('test-csp-nonce');
    expect(script?.innerHTML).toContain("ad_storage: 'denied'");
    expect(script?.innerHTML).toContain("analytics_storage: 'denied'");
    expect(script?.innerHTML).toContain("ad_user_data: 'denied'");
    expect(script?.innerHTML).toContain("ad_personalization: 'denied'");
    expect(script?.innerHTML).toContain("functionality_storage: 'granted'");
    expect(script?.innerHTML).toContain("security_storage: 'granted'");
    expect(script?.innerHTML).toContain("gtag('consent', 'default', initialConsent)");
  });

  it('9. GoogleTagManager does not render or inject scripts when GTM env var is missing', () => {
    const prevGtm = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;
    delete process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;

    try {
      const { container } = render(<GoogleTagManager />);
      expect(container.firstChild).toBeNull();
      // Ensure no script was injected into document.head
      const gtmScripts = document.querySelectorAll('script[src*="googletagmanager.com"]');
      expect(gtmScripts.length).toBe(0);
    } finally {
      if (prevGtm) {
        process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID = prevGtm;
      }
    }
  });
});
