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

  test('4. consent banner appears on fresh context and can be accepted/dismissed', async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

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
    await page.waitForLoadState('networkidle');

    const submitBtn = page.locator('button[type="submit"]:has-text("Send Message")');
    await expect(submitBtn).toBeVisible();
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
    await page.waitForLoadState('networkidle');

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

  test('7. mobile viewport (390x844): compact consent banner displays cleanly without WhatsApp overlap', async ({ page, context }) => {
    await context.clearCookies();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    const banner = page.locator('aside[aria-label="Cookie consent banner"]');
    await expect(banner).toBeVisible();

    // Verify compact height on mobile (< 45% of 844px height = ~380px)
    const box = await banner.boundingBox();
    expect(box).toBeTruthy();
    expect(box!.height).toBeLessThan(380);

    // Verify buttons are visible and clickable
    const acceptBtn = banner.locator('button:has-text("Accept All")');
    const rejectBtn = banner.locator('button:has-text("Reject Non-Essential")');
    const customizeBtn = banner.locator('button:has-text("Customize")');

    await expect(acceptBtn).toBeVisible();
    await expect(rejectBtn).toBeVisible();
    await expect(customizeBtn).toBeVisible();

    // Verify WhatsApp button is hidden or non-overlapping while banner is open
    const isWhatsappHidden = await page.evaluate(() => {
      const el = document.querySelector('a[aria-label="Chat with us on WhatsApp"]');
      if (!el) return true;
      const parent = el.closest('div');
      const style = parent ? window.getComputedStyle(parent) : null;
      return style ? style.opacity === '0' || style.pointerEvents === 'none' : false;
    });
    expect(isWhatsappHidden).toBe(true);

    // Accept consent
    await acceptBtn.click();
    await expect(banner).not.toBeVisible();
  });

  test('8. CTA banner flips to contact form without Turnstile and submits successfully', async ({ page }) => {
    // Route mock for /api/contact verifies payload and returns success
    await page.route('**/api/contact', async (route) => {
      const requestBody = JSON.parse(route.request().postData() || '{}');
      expect(requestBody.source).toBe('cta_banner');
      expect(requestBody.turnstileToken).toBeUndefined();
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

    await page.goto('/');

    const flipBtn = page.locator('button[aria-label="Open contact form"]');
    await flipBtn.scrollIntoViewIfNeeded();
    await expect(flipBtn).toBeVisible();

    // Click to flip
    await flipBtn.click();

    // Contact form back face is visible
    const backHeading = page.locator('div[class*="ctaFaceBack"] h3:has-text("Contact Us")');
    await expect(backHeading).toBeVisible();

    // Verify Turnstile widget is NOT present in CTA form
    const turnstileInCta = page.locator('div[class*="ctaFaceBack"] div[class*="cf-turnstile"], div[class*="ctaFaceBack"] iframe[src*="challenges.cloudflare.com"]');
    await expect(turnstileInCta).toHaveCount(0);

    // Fill CTA form
    await page.fill('div[class*="ctaFaceBack"] input[name="name"]', 'Alex Morgan');
    await page.fill('div[class*="ctaFaceBack"] input[name="business"]', 'Growth Co');
    await page.fill('div[class*="ctaFaceBack"] input[name="email"]', 'alex@growthco.com');
    await page.fill('div[class*="ctaFaceBack"] input[name="phone"]', '+8801700000000');
    await page.selectOption('div[class*="ctaFaceBack"] select[name="topic"]', 'Website Development');
    await page.fill('div[class*="ctaFaceBack"] textarea[name="message"]', 'Looking for a new web agency to build our application.');

    // Submit CTA form
    const submitBtn = page.locator('div[class*="ctaFaceBack"] button[type="submit"]');
    await submitBtn.click();

    // Verify success view
    await expect(page.locator('div[class*="ctaFaceBack"] h3:has-text("Message Sent!")')).toBeVisible();

    // Flip back
    const flipBackBtn = page.locator('div[class*="ctaFaceBack"] button:has-text("Back to Banner")');
    await flipBackBtn.click();
    await expect(flipBtn).toBeVisible();
  });

  test('9. CTA banner typing animation completes smoothly and stabilizes without clearing', async ({ page }) => {
    await page.goto('/');

    const ctaTitle = page.locator('h2[class*="ctaTitle"]');
    await ctaTitle.scrollIntoViewIfNeeded();
    await expect(ctaTitle).toBeVisible();

    // Wait for the full headline text to be rendered
    await expect(ctaTitle).toContainText('Ready to Grow Your');
    await expect(ctaTitle).toContainText('Business Online?');

    // Wait 2.5s and verify the headline stays stable and does NOT clear back to blank
    await page.waitForTimeout(2500);
    await expect(ctaTitle).toContainText('Ready to Grow Your');
    await expect(ctaTitle).toContainText('Business Online?');
  });
});
