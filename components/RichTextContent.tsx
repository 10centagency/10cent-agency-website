/**
 * RichTextContent
 * Renders TipTap-generated HTML with consistent public-facing typography styles.
 *
 * Why this exists:
 * - @tailwindcss/typography is NOT installed, so `prose` classes are no-ops.
 * - Tailwind's base reset strips list-style, margins, etc. from ul/ol/li.
 * - This component applies explicit Tailwind arbitrary-variant selectors so
 *   headings, bullet/ordered lists, blockquotes, links, bold, italic all render
 *   correctly on public pages — matching what the admin TipTap editor shows.
 */

interface RichTextContentProps {
  html: string;
  className?: string;
}

export default function RichTextContent({ html, className = '' }: RichTextContentProps) {
  return (
    <div
      className={[
        // Base text
        'text-brand-textMid leading-relaxed',
        // Paragraphs - minimal spacing, empty ones create blank line
        '[&_p]:mb-2 [&_p]:leading-relaxed',
        '[&_p:empty]:block [&_p:empty]:h-4 [&_p:empty]:mb-2',
        // Headings
        '[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-brand-textDark [&_h1]:mt-6 [&_h1]:mb-3',
        '[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-brand-textDark [&_h2]:mt-6 [&_h2]:mb-3',
        '[&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-brand-textDark [&_h3]:mt-5 [&_h3]:mb-2',
        // Bold / Italic
        '[&_strong]:font-bold [&_strong]:text-brand-textDark',
        '[&_em]:italic',
        // Underline
        '[&_u]:underline',
        // Bullet list
        '[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-1',
        // Ordered list
        '[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-1',
        // List items
        '[&_li]:text-brand-textMid [&_li]:leading-relaxed',
        // Nested lists
        '[&_ul_ul]:list-circle [&_ul_ul]:mt-1',
        '[&_ol_ol]:list-[lower-alpha] [&_ol_ol]:mt-1',
        // Blockquote
        '[&_blockquote]:border-l-4 [&_blockquote]:border-brand-blue [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-brand-textMid [&_blockquote]:my-4',
        // Links
        '[&_a]:text-brand-blue [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-brand-navy',
        // Code (if any)
        '[&_code]:bg-gray-100 [&_code]:text-sm [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono',
        '[&_pre]:bg-gray-100 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:mb-4',
        // Horizontal rule
        '[&_hr]:border-brand-border [&_hr]:my-6',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}