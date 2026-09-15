import { describe, it, expect } from 'vitest';
import { sanitizeContentHtml, safeJsonLd, isTrustedEmbedUrl } from '@/lib/sanitize';

describe('HTML Sanitizer & XSS Prevention', () => {
  it('strips dangerous <script> tags and malicious payloads', () => {
    const malicious = '<p>Hello</p><script>alert("xss")</script><script src="https://evil.com/payload.js"></script>';
    const cleaned = sanitizeContentHtml(malicious);
    expect(cleaned).not.toContain('<script');
    expect(cleaned).not.toContain('evil.com');
    expect(cleaned).toContain('<p>Hello</p>');
  });

  it('strips inline event handlers (onerror, onclick, onload, etc.)', () => {
    const malicious = '<img src="invalid" onerror="alert(1)" /><button onclick="fetch(\'/steal\')">Click</button>';
    const cleaned = sanitizeContentHtml(malicious);
    expect(cleaned).not.toContain('onerror');
    expect(cleaned).not.toContain('onclick');
    expect(cleaned).not.toContain('fetch(');
  });

  it('strips javascript: and data: URIs from hyperlinks', () => {
    const malicious = '<a href="javascript:alert(1)">Click me</a><a href="data:text/html,<script>alert(1)</script>">Evil Data</a>';
    const cleaned = sanitizeContentHtml(malicious);
    expect(cleaned).not.toContain('javascript:');
    expect(cleaned).not.toContain('data:');
  });

  it('enforces rel="noopener noreferrer" and https on external links', () => {
    const input = '<a href="https://example.com" target="_blank">Safe Link</a>';
    const cleaned = sanitizeContentHtml(input);
    expect(cleaned).toContain('href="https://example.com"');
    expect(cleaned).toContain('rel="noopener noreferrer"');
  });

  it('strips untrusted iframe sources while keeping trusted hosts', () => {
    const evilIframe = '<iframe src="https://attacker.com/keylogger"></iframe>';
    const cleanedEvil = sanitizeContentHtml(evilIframe);
    expect(cleanedEvil).not.toContain('attacker.com');

    const safeIframe = '<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" width="560" height="315"></iframe>';
    const cleanedSafe = sanitizeContentHtml(safeIframe);
    expect(cleanedSafe).toContain('https://www.youtube.com/embed/dQw4w9WgXcQ');
    expect(cleanedSafe).toContain('<iframe');
  });

  it('preserves legitimate rich text elements and formatting', () => {
    const formatted = `
      <h1>Main Title</h1>
      <h2>Sub Title</h2>
      <p>This is a <strong>bold</strong> and <em>italic</em> text with <mark>highlight</mark>.</p>
      <ul><li>Item 1</li><li>Item 2</li></ul>
      <blockquote>Wisdom of the day</blockquote>
      <table><thead><tr><th>Header</th></tr></thead><tbody><tr><td>Data</td></tr></tbody></table>
    `;
    const cleaned = sanitizeContentHtml(formatted);
    expect(cleaned).toContain('<h1>Main Title</h1>');
    expect(cleaned).toContain('<strong>bold</strong>');
    expect(cleaned).toContain('<em>italic</em>');
    expect(cleaned).toContain('<ul>');
    expect(cleaned).toContain('<blockquote>Wisdom of the day</blockquote>');
    expect(cleaned).toContain('<table>');
  });
});

describe('Embed URL Host Allowlist Validation', () => {
  it('approves legitimate embed URLs from trusted hosts over HTTPS', () => {
    expect(isTrustedEmbedUrl('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe(true);
    expect(isTrustedEmbedUrl('https://player.vimeo.com/video/123456')).toBe(true);
    expect(isTrustedEmbedUrl('https://calendly.com/10centagency/consultation')).toBe(true);
    expect(isTrustedEmbedUrl('https://www.google.com/maps/embed?pb=123')).toBe(true);
  });

  it('rejects untrusted domains, HTTP scheme, and malicious URLs', () => {
    expect(isTrustedEmbedUrl('http://www.youtube.com/embed/123')).toBe(false); // HTTP rejected
    expect(isTrustedEmbedUrl('https://attacker.com/embed')).toBe(false);
    expect(isTrustedEmbedUrl('javascript:alert(1)')).toBe(false);
    expect(isTrustedEmbedUrl('')).toBe(false);
    expect(isTrustedEmbedUrl('not a url')).toBe(false);
  });
});

describe('safeJsonLd Escaping', () => {
  it('escapes < and > to prevent script tag injection and JSON-LD breakout', () => {
    const dangerousData = {
      title: '</script><script>alert("xss")</script>',
      description: 'Contains <tag> and > characters',
    };
    const serialized = safeJsonLd(dangerousData);
    expect(serialized).not.toContain('</script>');
    expect(serialized).not.toContain('<tag>');
    expect(serialized).toContain('\\u003c/script\\u003e');
    expect(serialized).toContain('\\u003ctag\\u003e');
    expect(serialized).toContain('\\u003e');
  });
});
