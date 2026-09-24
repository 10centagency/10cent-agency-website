import { test, expect } from '@playwright/test';

test.describe('End-to-End Smoke Tests', () => {
  test('1. home page loads successfully without 500 error', async ({ page }) => {
    const res = await page.goto('/');
    expect(res?.status()).toBeLessThan(400);
    await expect(page).toHaveTitle(/10 Cent Agency/i);
    await expect(page.locator('header').first()).toBeVisible();
  });

  test('2. main navigation is visible and keyboard reachable', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();

    // Verify key navigation links are reachable
    const contactLink = nav.locator('a[href="/contact"]').first();
    await expect(contactLink).toBeVisible();

    // Keyboard tab reachability
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(focused).toBeTruthy();
  });

  test('3. contact page loads successfully', async ({ page }) => {
    const res = await page.goto('/contact');
    expect(res?.status()).toBeLessThan(400);
    await expect(page.locator('h3:has-text("Send Us a Message")')).toBeVisible();
    await expect(page.locator('input#fullName')).toBeVisible();
  });

  test('4. consent banner appears on fresh context and can be accepted/dismissed', async ({ page }) => {
    await page.goto('/');
    const banner = page.locator('aside[aria-label="Cookie consent banner"]');
    await expect(banner).toBeVisible();

    const acceptBtn = banner.locator('button:has-text("Accept All")');
    await expect(acceptBtn).toBeVisible();
    await acceptBtn.click();

    // Banner dismissed after accepting
    await expect(banner).not.toBeVisible();

    // Verify localStorage has tc_consent_v1
    const storedConsent = await page.evaluate(() => localStorage.getItem('tc_consent_v1'));
    expect(storedConsent).toBeTruthy();
    const parsed = JSON.parse(storedConsent!);
    expect(parsed.analytics).toBe(true);
    expect(parsed.marketing).toBe(true);
  });

  test('5. contact form displays client-side validation errors without external services', async ({ page }) => {
    await page.goto('/contact');
    const submitBtn = page.locator('button[type="submit"]:has-text("Send Message")');
    await submitBtn.click();

    // Error messages appear and aria-invalid is set
    const fullNameInput = page.locator('input#fullName');
    await expect(fullNameInput).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('text=Full name is required')).toBeVisible();
  });

  test('6. contact form displays mocked success response when submitted', async ({ page }) => {
    // Route mock for /api/contact ensures test does not depend on real Turnstile, DB, or Redis
    await page.route('**/api/contact', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          ok: true,
          success: true,
          message: 'Thank you! Your message has been received.',
        }),
      });
    });

    await page.goto('/contact');

    // Fill form inputs
    await page.fill('input#fullName', 'Sarah Connor');
    await page.fill('input#businessName', 'Cyberdyne Systems');
    await page.fill('input#email', 'sarah@example.com');
    await page.fill('input#whatsapp', '+8801700000000');
    await page.selectOption('select#service', 'Website Development');
    await page.selectOption('select#budget', '15,000–30,000 BDT');
    await page.fill('textarea#message', 'We need a resilient web application deployed immediately.');

    const submitBtn = page.locator('button[type="submit"]:has-text("Send Message")');
    await submitBtn.click();

    // Expect success announcement
    await expect(page.locator('text=Message Sent!')).toBeVisible();
    await expect(
      page.locator('text=Thank you! We received your message and will get back to you within 24 hours.')
    ).toBeVisible();
  });
});
