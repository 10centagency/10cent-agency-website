import type { JSONContent } from '@tiptap/core'
import { htmlToNodes } from './render'

/**
 * Old 8-block system (content_blocks array) → new Tiptap document.
 *
 * Why: so older blog/portfolio posts do not lose content when opened in the editor.
 * Optional but strongly recommended — without it, old posts
 * stay read-only via the fallback renderer.
 *
 * Mapping:
 *   text          → heading + rich text nodes
 *   image         → imageBlock
 *   full-image    → imageBlock (width 100)
 *   image-duo     → beforeAfterBlock
 *   image-grid    → galleryBlock
 *   image-text    → imageTextBlock
 *   color-palette → colorPaletteBlock
 *   typography    → typographyBlock
 */
export function convertLegacyBlocks(blocks: unknown): JSONContent | null {
  if (!Array.isArray(blocks) || blocks.length === 0) return null

  const content: JSONContent[] = []

  for (const raw of blocks) {
    const b = raw as Record<string, any>
    if (!b || typeof b !== 'object') continue

    switch (b.type) {
      case 'text': {
        if (b.heading && String(b.heading).trim()) {
          content.push({
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: String(b.heading) }],
          })
        }
        const nodes = htmlToNodes(String(b.content ?? ''))
        content.push(...(nodes.length ? nodes : [{ type: 'paragraph' }]))
        break
      }

      case 'image': {
        if (!b.image_url) break
        content.push({
          type: 'imageBlock',
          attrs: {
            src: b.image_url,
            alt: b.alt_text ?? '',
            caption: b.caption ?? '',
            align: 'center',
            width: b.width === 'half' ? 50 : b.width === 'third' ? 33 : 100,
            rounded: true,
            shadow: true,
          },
        })
        break
      }

      case 'full-image': {
        if (!b.image_url) break
        content.push({
          type: 'fullImageBlock',
          attrs: {
            src: b.image_url,
            alt: b.alt_text ?? '',
            caption: b.caption ?? '',
            height: 'auto',
            linkUrl: b.link_url ?? '',
          },
        })
        break
      }

      case 'image-duo': {
        if (!b.left_image_url && !b.right_image_url) break
        content.push({
          type: 'beforeAfterBlock',
          attrs: {
            leftSrc: b.left_image_url ?? '',
            rightSrc: b.right_image_url ?? '',
            leftLabel: b.left_label ?? 'Before',
            rightLabel: b.right_label ?? 'After',
            caption: b.caption ?? '',
          },
        })
        break
      }

      case 'image-grid': {
        const images = Array.isArray(b.images) ? b.images : []
        if (!images.length) break
        content.push({
          type: 'galleryBlock',
          attrs: {
            images: images.map((i: any) => ({ src: i?.url ?? '', alt: i?.caption ?? '' })),
            columns: b.columns ?? 3,
            gap: 12,
            rounded: true,
          },
        })
        break
      }

      case 'image-text': {
        if (!b.image_url && !b.content && !b.heading) break
        content.push({
          type: 'imageTextBlock',
          attrs: {
            imageUrl: b.image_url ?? '',
            alt: b.alt_text ?? '',
            imagePosition: b.image_position === 'right' ? 'right' : 'left',
            aspect: b.aspect_ratio ?? '1/1',
            heading: b.heading ?? '',
            body: b.content ?? '',
            linkUrl: b.link_url ?? '',
          },
        })
        break
      }

      case 'color-palette': {
        const colors = Array.isArray(b.colors) ? b.colors : []
        if (!colors.length) break
        content.push({
          type: 'colorPaletteBlock',
          attrs: {
            title: b.title ?? 'Brand Colors',
            colors: colors.map((c: any) => ({ hex: c?.hex ?? '#000000', name: c?.name ?? '' })),
            size: 64,
          },
        })
        break
      }

      case 'typography': {
        const fonts = Array.isArray(b.fonts) ? b.fonts : []
        if (!fonts.length) break
        content.push({
          type: 'typographyBlock',
          attrs: {
            title: b.title ?? 'Typography',
            showMeta: true,
            fonts: fonts.map((f: any) => ({
              name: f?.name ?? '',
              sample: f?.sample ?? '',
              weight: f?.weight ?? '',
              style: f?.style ?? '',
              size: '',
            })),
          },
        })
        break
      }

      default:
        break
    }
  }

  if (!content.length) return null
  return { type: 'doc', content }
}

