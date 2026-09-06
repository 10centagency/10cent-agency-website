import { Extension } from '@tiptap/core'

/**
 * TextStyles — Text block গুলোর (paragraph, heading, list, quote, code)
 * কোনো custom node নেই (StarterKit-এর), তাই global attributes দিয়ে
 * styling option যোগ করা হচ্ছে।
 *
 * ⚠️ editorExtensions() আর renderExtensions() — দুটোতেই থাকতে হবে।
 *
 * 💡 Tiptap-এর mergeAttributes() style-গুলো নিজেই জোড়া লাগিয়ে দেয়
 *    (`style="color:…; font-size:…"`), তাই প্রতিটা attribute আলাদা ভাবে
 *    style return করলেও clash হয় না।
 */

export const FONT_SIZES: Record<string, string> = {
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
}

export const LINE_HEIGHTS: Record<string, string> = {
  tight: '1.35',
  snug: '1.5',
  normal: '1.7',
  relaxed: '1.9',
}

const styleIf = (v: unknown, css: (x: string) => string) =>
  v && String(v).trim() ? { style: css(String(v)) } : {}

export const TextStyles = Extension.create({
  name: 'textStyles',

  addGlobalAttributes() {
    return [
      /* ── সাধারণ টেক্সট স্টাইল ─────────────────────────────────────── */
      {
        types: ['paragraph', 'heading', 'blockquote'],
        attributes: {
          fontSize: {
            default: '',
            parseHTML: (el) => el.getAttribute('data-fs') || '',
            renderHTML: (attrs) => {
              const v = FONT_SIZES[attrs.fontSize as string]
              return styleIf(v, (x) => `font-size:${x}`)
            },
          },
          lineHeight: {
            default: '',
            parseHTML: (el) => el.getAttribute('data-lh') || '',
            renderHTML: (attrs) => {
              const v = LINE_HEIGHTS[attrs.lineHeight as string]
              return styleIf(v, (x) => `line-height:${x}`)
            },
          },
          textColor: {
            default: '',
            parseHTML: (el) => el.getAttribute('data-tc') || '',
            renderHTML: (attrs) => styleIf(attrs.textColor, (x) => `color:${x}`),
          },
          bgColor: {
            default: '',
            parseHTML: (el) => el.getAttribute('data-bc') || '',
            renderHTML: (attrs) => styleIf(attrs.bgColor, (x) => `background-color:${x}`),
          },
          paddingY: {
            default: 0,
            parseHTML: (el) => Number(el.getAttribute('data-py') || 0),
            renderHTML: (attrs) =>
              Number(attrs.paddingY) > 0
                ? { style: `padding-top:${attrs.paddingY}px;padding-bottom:${attrs.paddingY}px` }
                : {},
          },
        },
      },

      /* ── শুধু Heading ─────────────────────────────────────────────── */
      {
        types: ['heading'],
        attributes: {
          // TOC block-এর jump link-এর জন্য
          anchorId: {
            default: '',
            parseHTML: (el) => el.getAttribute('id') || '',
            renderHTML: (attrs) => (attrs.anchorId ? { id: String(attrs.anchorId) } : {}),
          },
          uppercase: {
            default: false,
            parseHTML: (el) => el.getAttribute('data-upper') === 'true',
            renderHTML: (attrs) =>
              attrs.uppercase ? { style: 'text-transform:uppercase;letter-spacing:0.04em' } : {},
          },
        },
      },

      /* ── List ──────────────────────────────────────────────────────── */
      {
        types: ['bulletList', 'orderedList'],
        attributes: {
          listStyle: {
            default: '',
            parseHTML: (el) => el.getAttribute('data-list-style') || '',
            renderHTML: (attrs) => styleIf(attrs.listStyle, (x) => `list-style-type:${x}`),
          },
          textColor: {
            default: '',
            parseHTML: (el) => el.getAttribute('data-tc') || '',
            renderHTML: (attrs) => styleIf(attrs.textColor, (x) => `color:${x}`),
          },
        },
      },
      {
        types: ['orderedList'],
        attributes: {
          start: {
            default: 1,
            parseHTML: (el) => Number(el.getAttribute('start') || 1),
            renderHTML: (attrs) =>
              Number(attrs.start) > 1 ? { start: String(attrs.start) } : {},
          },
        },
      },

      /* ── Blockquote ────────────────────────────────────────────────── */
      {
        types: ['blockquote'],
        attributes: {
          // citation CSS ::after দিয়ে দেখানো হয় (editor.css)
          citation: {
            default: '',
            parseHTML: (el) => el.getAttribute('data-citation') || '',
            renderHTML: (attrs) => (attrs.citation ? { 'data-citation': String(attrs.citation) } : {}),
          },
          quoteVariant: {
            default: '',
            parseHTML: (el) => el.getAttribute('data-quote') || '',
            renderHTML: (attrs) => (attrs.quoteVariant ? { 'data-quote': String(attrs.quoteVariant) } : {}),
          },
          borderColor: {
            default: '',
            parseHTML: (el) => el.getAttribute('data-bc2') || '',
            renderHTML: (attrs) => styleIf(attrs.borderColor, (x) => `border-left-color:${x}`),
          },
        },
      },

      /* ── Code block ────────────────────────────────────────────────── */
      {
        types: ['codeBlock'],
        attributes: {
          language: {
            default: '',
            parseHTML: (el) => el.getAttribute('data-language') || '',
            renderHTML: (attrs) => (attrs.language ? { 'data-language': String(attrs.language) } : {}),
          },
          lineNumbers: {
            default: false,
            parseHTML: (el) => el.getAttribute('data-linenumbers') === 'true',
            renderHTML: (attrs) => (attrs.lineNumbers ? { 'data-linenumbers': 'true' } : {}),
          },
          codeTheme: {
            default: 'dark',
            parseHTML: (el) => el.getAttribute('data-theme') || 'dark',
            renderHTML: (attrs) => ({ 'data-theme': String(attrs.codeTheme || 'dark') }),
          },
        },
      },
    ]
  },
})

