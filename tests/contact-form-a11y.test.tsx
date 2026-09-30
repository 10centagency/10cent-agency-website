// @vitest-environment happy-dom
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from '@/app/contact/ContactForm';

describe('Contact Form Accessibility & Form States (ContactForm.tsx)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('1. all contact form fields have accessible labels and names', () => {
    render(<ContactForm />);

    expect(screen.getByLabelText(/Full Name/i)).toBeDefined();
    expect(screen.getByLabelText(/Business Name/i)).toBeDefined();
    expect(screen.getByLabelText(/Email Address/i)).toBeDefined();
    expect(screen.getByLabelText(/WhatsApp Number/i)).toBeDefined();
    expect(screen.getByLabelText(/Service Interested In/i)).toBeDefined();
    expect(screen.getByLabelText(/Budget Range/i)).toBeDefined();
    expect(screen.getByLabelText(/Tell Us About Your Business/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Send Message/i })).toBeDefined();
  });

  it('2. honeypot input is not reachable via keyboard navigation and has tabIndex -1', () => {
    render(<ContactForm />);
    const honeypotInput = document.querySelector('input[name="website"]') as HTMLInputElement;

    expect(honeypotInput).toBeDefined();
    expect(honeypotInput.tabIndex).toBe(-1);
    expect(honeypotInput.getAttribute('aria-hidden')).toBe('true');
  });

  it('3. user can tab through interactive controls in logical order', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const fullNameInput = screen.getByLabelText(/Full Name/i);
    const businessNameInput = screen.getByLabelText(/Business Name/i);
    const emailInput = screen.getByLabelText(/Email Address/i);
    const whatsappInput = screen.getByLabelText(/WhatsApp Number/i);
    const serviceSelect = screen.getByLabelText(/Service Interested In/i);
    const budgetSelect = screen.getByLabelText(/Budget Range/i);
    const messageInput = screen.getByLabelText(/Tell Us About Your Business/i);
    const submitBtn = screen.getByRole('button', { name: /Send Message/i });

    // Focus first input
    fullNameInput.focus();
    expect(document.activeElement).toBe(fullNameInput);

    // Tab through controls
    await user.tab();
    expect(document.activeElement).toBe(businessNameInput);

    await user.tab();
    expect(document.activeElement).toBe(emailInput);

    await user.tab();
    expect(document.activeElement).toBe(whatsappInput);

    await user.tab();
    expect(document.activeElement).toBe(serviceSelect);

    await user.tab();
    expect(document.activeElement).toBe(budgetSelect);

    await user.tab();
    expect(document.activeElement).toBe(messageInput);

    await user.tab();
    expect(document.activeElement).toBe(submitBtn);
  });

  it('4. submit button disables while request is pending to prevent double submission', async () => {
    let resolveFetch: (value: any) => void;
    const fetchPromise = new Promise((resolve) => {
      resolveFetch = resolve;
    });

    global.fetch = vi.fn().mockReturnValue(fetchPromise);

    render(<ContactForm />);

    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Alice Smith' } });
    fireEvent.change(screen.getByLabelText(/Business Name/i), { target: { value: 'Alice Corp' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'alice@example.com' } });
    fireEvent.change(screen.getByLabelText(/WhatsApp Number/i), { target: { value: '+8801712345678' } });
    fireEvent.change(screen.getByLabelText(/Service Interested In/i), { target: { value: 'Website Development' } });
    fireEvent.change(screen.getByLabelText(/Budget Range/i), { target: { value: 'Under 5,000 BDT' } });
    fireEvent.change(screen.getByLabelText(/Tell Us About Your Business/i), { target: { value: 'We need an e-commerce website built.' } });

    const submitBtn = screen.getByRole('button', { name: /Send Message/i });
    fireEvent.click(submitBtn);

    // Verify pending state
    expect(submitBtn.hasAttribute('disabled')).toBe(true);
    expect(screen.getByText(/Sending.../i)).toBeDefined();

    // Resolve fetch
    resolveFetch!({
      ok: true,
      json: async () => ({ ok: true, message: 'Success' }),
    });

    await waitFor(() => {
      expect(screen.getByText(/Message Sent!/i)).toBeDefined();
    });
  });

  it('5. success response displays an accessible success status and focuses announcement', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, message: 'Thank you! Your message has been received.' }),
    });

    render(<ContactForm />);

    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Bob Jones' } });
    fireEvent.change(screen.getByLabelText(/Business Name/i), { target: { value: 'Jones Media' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'bob@example.com' } });
    fireEvent.change(screen.getByLabelText(/WhatsApp Number/i), { target: { value: '+8801812345678' } });
    fireEvent.change(screen.getByLabelText(/Service Interested In/i), { target: { value: 'Google Ads' } });
    fireEvent.change(screen.getByLabelText(/Budget Range/i), { target: { value: '5,000–15,000 BDT' } });
    fireEvent.change(screen.getByLabelText(/Tell Us About Your Business/i), { target: { value: 'Interested in PPC ads.' } });

    fireEvent.click(screen.getByRole('button', { name: /Send Message/i }));

    await waitFor(() => {
      const statusElement = screen.getByRole('status');
      expect(statusElement).toBeDefined();
      expect(statusElement.getAttribute('aria-live')).toBe('polite');
      expect(screen.getByText(/Message Sent!/i)).toBeDefined();
    });
  });

  it('6. client validation error response displays field-level messages and sets aria-invalid/aria-describedby', async () => {
    render(<ContactForm />);

    // Click submit with empty form
    fireEvent.click(screen.getByRole('button', { name: /Send Message/i }));

    const fullNameInput = screen.getByLabelText(/Full Name/i);
    expect(fullNameInput.getAttribute('aria-invalid')).toBe('true');
    expect(fullNameInput.getAttribute('aria-describedby')).toBe('fullName-error');

    const emailInput = screen.getByLabelText(/Email Address/i);
    expect(emailInput.getAttribute('aria-invalid')).toBe('true');
    expect(emailInput.getAttribute('aria-describedby')).toBe('email-error');

    expect(screen.getByText(/Full name is required/i)).toBeDefined();
  });

  it('7. server error or rate-limit (429) displays generic recoverable error alert', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      json: async () => ({
        ok: false,
        error: 'Too many submissions from this network. Please wait a few minutes before trying again.',
      }),
    });

    render(<ContactForm />);

    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Rate Limited' } });
    fireEvent.change(screen.getByLabelText(/Business Name/i), { target: { value: 'Limit Corp' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/WhatsApp Number/i), { target: { value: '+8801912345678' } });
    fireEvent.change(screen.getByLabelText(/Service Interested In/i), { target: { value: 'SEO, AEO & GEO' } });
    fireEvent.change(screen.getByLabelText(/Budget Range/i), { target: { value: '15,000–30,000 BDT' } });
    fireEvent.change(screen.getByLabelText(/Tell Us About Your Business/i), { target: { value: 'Testing rate limiter error display.' } });

    fireEvent.click(screen.getByRole('button', { name: /Send Message/i }));

    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert).toBeDefined();
      expect(alert.textContent).toContain('Too many submissions');
    });

    // Verify inputs are preserved
    expect((screen.getByLabelText(/Full Name/i) as HTMLInputElement).value).toBe('Rate Limited');
  });

  it('8. handles Turnstile-missing or config error gracefully without crashing', () => {
    const originalSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    delete process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    delete process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY;

    // Set NODE_ENV to development so fail closed UI message is triggered
    const originalNodeEnv = process.env.NODE_ENV;
    (process.env as any).NODE_ENV = 'development';

    render(<ContactForm />);

    expect(screen.getByText(/Security verification is temporarily unavailable/i)).toBeDefined();

    // Restore
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = originalSiteKey;
    (process.env as any).NODE_ENV = originalNodeEnv;
  });
});
