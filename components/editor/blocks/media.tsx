import { Node } from '@tiptap/core'
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
import { Image as ImageIcon, Images, Columns2, Maximize2, Play, Code2 } from 'lucide-react'
import type { BlockDefinition } from '../types'
import { cx, EmptyImageBox, jsonAttr, mergeAttributes, suppress } from './helpers'

/* ══════════════════════════════════════════════════════════════════════════
 * 1. IMAGE  — atom block + React NodeView + inspector options
 * ═════════════════════════════════════════════════════════════════════════*/
const ImageBlockView = ({ node, selected }: { node: any; selected: boolean }) => {
  const { src, alt, caption, align, width, rounded, shadow } = node.attrs
  const justify = align === 'left' ? 'justify-start' : align === 'right' ? 'justify-end' : 'justify-center'

  return (
    <NodeViewWrapper data-block="image"
      className={cx(
        'group relative my-2 flex flex-col rounded-lg transition-shadow',
        justify,
        selected && 'ring-2 ring-brand-blue ring-offset-2',
      )}
      data-drag-handle
    >
      <div style={{ width: `${width}%` }} className="flex flex-col gap-2">
        {src ? (
          <img
            src={src}
            alt={alt || ''}
            className={cx(
              'w-full object-cover',
              rounded && 'rounded-xl',
              shadow && 'shadow-md',
            )}
          />
        ) : (
          <EmptyImageBox label="image" className="aspect-[16/9] w-full" />
        )}
        {caption && (
          <figcaption className="text-center text-xs italic text-slate-500">{caption}</figcaption>
        )}
      </div>
    </NodeViewWrapper>
  )
}

const ImageBlockNode = Node.create({
  name: 'imageBlock',
  group: 'block',
  draggable: true,
  atom: false,

  addAttributes() {
    return {
      src: { default: '', parseHTML: (el) => el.querySelector('img')?.getAttribute('src') || '', renderHTML: suppress },
      alt: { default: '', parseHTML: (el) => el.querySelector('img')?.getAttribute('alt') || '', renderHTML: suppress },
      caption: { default: '', parseHTML: (el) => el.querySelector('figcaption')?.textContent || '', renderHTML: suppress },
      align: { default: 'center', renderHTML: suppress },
      width: { default: 100, renderHTML: suppress },
      rounded: { default: true, renderHTML: suppress },
      shadow: { default: true, renderHTML: suppress },
    }
  },

  parseHTML() {
    return [{ tag: 'figure[data-block="image"]' }]
  },

  renderHTML({ node, HTMLAttributes }) {
    const { src, alt, caption, align, width, rounded, shadow } = node.attrs
    const figureClass = cx('my-6 flex flex-col gap-2', align === 'left' ? 'items-start' : align === 'right' ? 'items-end' : 'items-center')
    const imgClass = cx('h-auto object-cover', rounded && 'rounded-xl', shadow && 'shadow-md')

    return [
      'figure',
      mergeAttributes(HTMLAttributes, { 'data-block': 'image', class: figureClass }),
      [
        'div',
        { style: `width:${width}%` },
        ['img', { src, alt: alt || '', class: imgClass }],
        caption ? ['figcaption', { class: 'mt-2 text-center text-xs italic text-slate-500' }, caption] : ['span', { class: 'hidden' }],
      ],
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageBlockView)
  },
})

export const imageBlock: BlockDefinition = {
  name: 'imageBlock',
  title: 'Image',
  description: 'Single image with caption + size controls',
  category: 'media',
  icon: ImageIcon,
  keywords: ['image', 'photo', 'picture', 'img'],
  node: ImageBlockNode,
  defaults: { src: '', alt: '', caption: '', align: 'center', width: 100, rounded: true, shadow: true },
  options: [
    { key: 'src', label: 'Image URL', type: 'url', placeholder: 'https://… or data:image/…' },
    { key: 'alt', label: 'Alt text (SEO)', type: 'text', placeholder: 'Describe the image' },
    { key: 'caption', label: 'Caption', type: 'text' },
    {
      key: 'align',
      label: 'Alignment',
      type: 'segmented',
      choices: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
    { key: 'width', label: 'Width (%)', type: 'range', min: 20, max: 100, step: 5 },
    { key: 'rounded', label: 'Rounded corners', type: 'toggle' },
    { key: 'shadow', label: 'Drop shadow', type: 'toggle' },
  ],
}

/* ══════════════════════════════════════════════════════════════════════════
 * 2. GALLERY / IMAGE GRID — repeater (list) options
 * ═════════════════════════════════════════════════════════════════════════*/
const GalleryView = ({ node, selected }: { node: any; selected: boolean }) => {
  const { images, columns, gap, rounded } = node.attrs
  return (
    <NodeViewWrapper data-block="gallery" className={cx('my-2', selected && 'ring-2 ring-brand-blue ring-offset-2 rounded-lg')} data-drag-handle>
      <div className="grid" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))`, gap: `${gap}px` }}>
        {(images as { src: string; alt: string }[]).map((img, i) =>
          img?.src ? (
            <img key={i} src={img.src} alt={img.alt || ''} className={cx('aspect-square w-full object-cover', rounded && 'rounded-lg')} />
          ) : (
            <EmptyImageBox key={i} label={`image ${i + 1}`} className="aspect-square w-full" />
          ),
        )}
      </div>
    </NodeViewWrapper>
  )
}

const GalleryNode = Node.create({
  name: 'galleryBlock',
  group: 'block',
  draggable: true,
  addAttributes() {
    return {
      images: jsonAttr([{ src: '', alt: '' }, { src: '', alt: '' }, { src: '', alt: '' }]),
      columns: { default: 3, renderHTML: suppress },
      gap: { default: 12, renderHTML: suppress },
      rounded: { default: true, renderHTML: suppress },
    }
  },
  parseHTML() {
    return [{ tag: 'div[data-block="gallery"]' }]
  },
  renderHTML({ node, HTMLAttributes }) {
    const { images, columns, gap, rounded } = node.attrs
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-block': 'gallery',
        class: 'my-6 grid',
        style: `grid-template-columns:repeat(${columns},minmax(0,1fr));gap:${gap}px`,
      }),
      ...(images as { src: string; alt: string }[])
        .filter((i) => i?.src)
        .map((img) => ['img', { src: img.src, alt: img.alt || '', class: cx('aspect-square w-full object-cover', rounded && 'rounded-lg') }]),
    ]
  },
  addNodeView() {
    return ReactNodeViewRenderer(GalleryView)
  },
})

export const galleryBlock: BlockDefinition = {
  name: 'galleryBlock',
  title: 'Gallery',
  description: 'Image grid — 2 / 3 / 4 columns',
  category: 'media',
  icon: Images,
  keywords: ['gallery', 'grid', 'photos', 'masonry'],
  node: GalleryNode,
  defaults: { images: [{ src: '', alt: '' }, { src: '', alt: '' }, { src: '', alt: '' }], columns: 3, gap: 12, rounded: true },
  options: [
    {
      key: 'columns',
      label: 'Columns',
      type: 'segmented',
      choices: [
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
      ],
    },
    { key: 'gap', label: 'Gap (px)', type: 'range', min: 0, max: 32, step: 4 },
    { key: 'rounded', label: 'Rounded corners', type: 'toggle' },
    {
      key: 'images',
      label: 'Images',
      type: 'list',
      itemLabel: 'Image',
      max: 12,
      defaultItem: { src: '', alt: '' },
      fields: [
        { key: 'src', label: 'URL', type: 'url', placeholder: 'https://…' },
        { key: 'alt', label: 'Alt text', type: 'text' },
      ],
    },
  ],
}

/* ══════════════════════════════════════════════════════════════════════════
 * 3. BEFORE / AFTER  (আপনার পুরনো image-duo block — modernized)
 * ═════════════════════════════════════════════════════════════════════════*/
const BeforeAfterView = ({ node, selected }: { node: any; selected: boolean }) => {
  const { leftSrc, rightSrc, leftLabel, rightLabel, caption } = node.attrs
  const side = (src: string, label: string) => (
    <div className="flex flex-col gap-2">
      {src ? (
        <img src={src} alt={label} className="aspect-[4/3] w-full rounded-lg object-cover" />
      ) : (
        <EmptyImageBox label={label} className="aspect-[4/3] w-full" />
      )}
      <span className="text-center text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</span>
    </div>
  )
  return (
    <NodeViewWrapper data-block="before-after" className={cx('my-2', selected && 'ring-2 ring-brand-blue ring-offset-2 rounded-lg')} data-drag-handle>
      <figure className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          {side(leftSrc, leftLabel)}
          {side(rightSrc, rightLabel)}
        </div>
        {caption && <figcaption className="text-center text-xs italic text-slate-500">{caption}</figcaption>}
      </figure>
    </NodeViewWrapper>
  )
}

const BeforeAfterNode = Node.create({
  name: 'beforeAfterBlock',
  group: 'block',
  draggable: true,
  addAttributes() {
    return {
      leftSrc: { default: '', renderHTML: suppress },
      rightSrc: { default: '', renderHTML: suppress },
      leftLabel: { default: 'Before', renderHTML: suppress },
      rightLabel: { default: 'After', renderHTML: suppress },
      caption: { default: '', renderHTML: suppress },
    }
  },
  parseHTML() {
    return [{ tag: 'figure[data-block="before-after"]' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['figure', mergeAttributes(HTMLAttributes, { 'data-block': 'before-after', class: 'my-6' })]
  },
  addNodeView() {
    return ReactNodeViewRenderer(BeforeAfterView)
  },
})

export const beforeAfterBlock: BlockDefinition = {
  name: 'beforeAfterBlock',
  title: 'Before / After',
  description: 'Side-by-side comparison slider layout',
  category: 'media',
  icon: Columns2,
  keywords: ['before', 'after', 'compare', 'duo', 'slider'],
  node: BeforeAfterNode,
  defaults: { leftSrc: '', rightSrc: '', leftLabel: 'Before', rightLabel: 'After', caption: '' },
  options: [
    { key: 'leftSrc', label: 'Before image URL', type: 'url' },
    { key: 'rightSrc', label: 'After image URL', type: 'url' },
    { key: 'leftLabel', label: 'Left label', type: 'text' },
    { key: 'rightLabel', label: 'Right label', type: 'text' },
    { key: 'caption', label: 'Caption', type: 'text' },
  ],
}


/* ══════════════════════════════════════════════════════════════════════════
 * 4. FULL-WIDTH IMAGE  (পুরনো full-image block — modernized, edge-to-edge)
 * ═════════════════════════════════════════════════════════════════════════*/
const FULL_HEIGHTS: Record<string, string> = {
  auto: 'h-auto',
  sm: 'h-[240px]',
  md: 'h-[380px]',
  lg: 'h-[520px]',
  screen: 'h-[80vh]',
}

const FullImageView = ({ node, selected }: { node: any; selected: boolean }) => {
  const { src, alt, caption, height, linkUrl } = node.attrs
  const img = src ? (
    <img src={src} alt={alt || ''} className={`w-full object-cover ${FULL_HEIGHTS[height] ?? FULL_HEIGHTS.auto}`} />
  ) : (
    <EmptyImageBox label="image" className={`w-full ${FULL_HEIGHTS[height] ?? FULL_HEIGHTS.md}`} />
  )
  return (
    <NodeViewWrapper data-block="full-image" className={cx('my-2', selected && 'ring-2 ring-brand-blue ring-offset-2 rounded-lg')} data-drag-handle>
      <figure className="w-full">
        {linkUrl ? (
          <a href={linkUrl} target="_blank" rel="noopener noreferrer">{img}</a>
        ) : img}
        {caption && <figcaption className="mt-2 text-center text-xs italic text-slate-500">{caption}</figcaption>}
      </figure>
    </NodeViewWrapper>
  )
}

const FullImageNode = Node.create({
  name: 'fullImageBlock',
  group: 'block',
  draggable: true,
  addAttributes() {
    return {
      src: { default: '', renderHTML: suppress },
      alt: { default: '', renderHTML: suppress },
      caption: { default: '', renderHTML: suppress },
      height: { default: 'auto', renderHTML: suppress },
      linkUrl: { default: '', renderHTML: suppress },
    }
  },
  parseHTML() { return [{ tag: 'figure[data-block="full-image"]' }] },
  renderHTML({ node, HTMLAttributes }) {
    const { src, alt, caption, height, linkUrl } = node.attrs
    const cls = FULL_HEIGHTS[height] ?? FULL_HEIGHTS.auto
    const img = ['img', { src, alt: alt || '', class: `w-full object-cover ${cls}` }]
    return [
      'figure',
      mergeAttributes(HTMLAttributes, { 'data-block': 'full-image', class: 'my-6 w-full' }),
      linkUrl ? ['a', { href: linkUrl, target: '_blank', rel: 'noopener noreferrer' }, img] : img,
      caption ? ['figcaption', { class: 'mt-2 text-center text-xs italic text-slate-500' }, caption] : ['span', { class: 'hidden' }],
    ]
  },
  addNodeView() { return ReactNodeViewRenderer(FullImageView) },
})

export const fullImageBlock: BlockDefinition = {
  name: 'fullImageBlock',
  title: 'Full-Width Image',
  description: 'Edge-to-edge hero image',
  category: 'media',
  icon: Maximize2,
  keywords: ['full', 'wide', 'hero', 'banner', 'cover', 'edge'],
  node: FullImageNode,
  defaults: { src: '', alt: '', caption: '', height: 'auto', linkUrl: '' },
  options: [
    { key: 'src', label: 'Image URL', type: 'url', placeholder: 'https://…' },
    { key: 'alt', label: 'Alt text (SEO)', type: 'text' },
    { key: 'caption', label: 'Caption', type: 'text' },
    {
      key: 'height',
      label: 'Height',
      type: 'select',
      choices: [
        { label: 'Auto', value: 'auto' },
        { label: 'Small (240px)', value: 'sm' },
        { label: 'Medium (380px)', value: 'md' },
        { label: 'Large (520px)', value: 'lg' },
        { label: 'Full screen (80vh)', value: 'screen' },
      ],
    },
    { key: 'linkUrl', label: 'Link (optional)', type: 'url' },
  ],
}

/* ══════════════════════════════════════════════════════════════════════════
 * 5. IMAGE + TEXT  (পুরনো image-text block — modernized)
 * ═════════════════════════════════════════════════════════════════════════*/
const ASPECTS: Record<string, string> = {
  '16/9': 'aspect-video',
  '4/3': 'aspect-[4/3]',
  '1/1': 'aspect-square',
  '3/4': 'aspect-[3/4]',
}

const ImageTextView = ({ node, selected }: { node: any; selected: boolean }) => {
  const { imageUrl, imagePosition, aspect, heading, body, linkUrl, alt } = node.attrs
  const imgEl = imageUrl ? (
    <img src={imageUrl} alt={alt || ''} className={`w-full h-full object-cover rounded-xl ${ASPECTS[aspect] ?? 'aspect-square'}`} />
  ) : (
    <EmptyImageBox label="image" className={`w-full ${ASPECTS[aspect] ?? 'aspect-square'}`} />
  )
  return (
    <NodeViewWrapper data-block="image-text" className={cx('my-2', selected && 'ring-2 ring-brand-blue ring-offset-2 rounded-lg')} data-drag-handle>
      <div className="grid items-center gap-6 sm:gap-8" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className={imagePosition === 'right' ? 'sm:order-2' : 'sm:order-1'}>
          {linkUrl && imageUrl ? (
            <a href={linkUrl} target="_blank" rel="noopener noreferrer">{imgEl}</a>
          ) : imgEl}
        </div>
        <div className={imagePosition === 'right' ? 'sm:order-1' : 'sm:order-2'}>
          {heading && <h3 className="mb-2 text-xl font-bold text-slate-900">{heading}</h3>}
          {body && <div className="text-sm leading-relaxed text-slate-600" dangerouslySetInnerHTML={{ __html: body }} />}
        </div>
      </div>
    </NodeViewWrapper>
  )
}

const ImageTextNode = Node.create({
  name: 'imageTextBlock',
  group: 'block',
  draggable: true,
  addAttributes() {
    return {
      imageUrl: { default: '', renderHTML: suppress },
      alt: { default: '', renderHTML: suppress },
      imagePosition: { default: 'left', renderHTML: suppress },
      aspect: { default: '1/1', renderHTML: suppress },
      heading: { default: '', renderHTML: suppress },
      body: { default: '', renderHTML: suppress },
      linkUrl: { default: '', renderHTML: suppress },
    }
  },
  parseHTML() { return [{ tag: 'div[data-block="image-text"]' }] },
  renderHTML({ node, HTMLAttributes }) {
    const { imageUrl, alt, imagePosition, aspect, heading, body, linkUrl } = node.attrs
    const img = ['img', { src: imageUrl, alt: alt || '', class: `w-full h-full object-cover rounded-xl ${ASPECTS[aspect] ?? 'aspect-square'}` }]
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-block': 'image-text',
        class: 'my-6 grid items-center gap-6 sm:gap-8',
        style: 'grid-template-columns:1fr 1fr',
      }),
      ['div', { class: imagePosition === 'right' ? 'sm:order-2' : 'sm:order-1' },
        linkUrl && imageUrl
          ? ['a', { href: linkUrl, target: '_blank', rel: 'noopener noreferrer' }, img]
          : img],
      ['div', { class: imagePosition === 'right' ? 'sm:order-1' : 'sm:order-2' },
        heading ? ['h3', { class: 'mb-2 text-xl font-bold text-slate-900' }, heading] : ['span', { class: 'hidden' }],
        body ? ['div', { class: 'text-sm leading-relaxed text-slate-600 [&_a]:text-blue-600 [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_p]:mb-2' }, body] : ['span', { class: 'hidden' }]],
    ]
  },
  addNodeView() { return ReactNodeViewRenderer(ImageTextView) },
})

export const imageTextBlock: BlockDefinition = {
  name: 'imageTextBlock',
  title: 'Image + Text',
  description: 'Side-by-side image and copy',
  category: 'media',
  icon: Columns2,
  keywords: ['image text', 'side by side', 'feature', 'split'],
  node: ImageTextNode,
  defaults: { imageUrl: '', alt: '', imagePosition: 'left', aspect: '1/1', heading: '', body: '', linkUrl: '' },
  options: [
    { key: 'imageUrl', label: 'Image URL', type: 'url' },
    { key: 'alt', label: 'Alt text (SEO)', type: 'text' },
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'body', label: 'Text (HTML allowed)', type: 'textarea', rows: 5 },
    {
      key: 'imagePosition',
      label: 'Image side',
      type: 'segmented',
      choices: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
    },
    {
      key: 'aspect',
      label: 'Image ratio',
      type: 'select',
      choices: [
        { label: '16 / 9', value: '16/9' },
        { label: '4 / 3', value: '4/3' },
        { label: '1 / 1', value: '1/1' },
        { label: '3 / 4', value: '3/4' },
      ],
    },
    { key: 'linkUrl', label: 'Image link (optional)', type: 'url' },
  ],
}

/* ══════════════════════════════════════════════════════════════════════════
 * 6. VIDEO  (YouTube / Vimeo / MP4)
 * ═════════════════════════════════════════════════════════════════════════*/
export function videoEmbedUrl(url: string): string | null {
  if (!url) return null
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{6,})/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`
  const vm = url.match(/vimeo\.com\/(\d+)/)
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`
  return null
}

const VideoView = ({ node, selected }: { node: any; selected: boolean }) => {
  const { url, caption, aspect, autoplay, muted, loop, controls } = node.attrs
  const embed = videoEmbedUrl(url)
  return (
    <NodeViewWrapper data-block="video" className={cx('my-2', selected && 'ring-2 ring-brand-blue ring-offset-2 rounded-lg')} data-drag-handle>
      <figure>
        {!url ? (
          <EmptyImageBox label="video" className={`w-full ${ASPECTS[aspect] ?? 'aspect-video'}`} />
        ) : embed ? (
          <iframe
            src={`${embed}${embed.includes('?') ? '&' : '?'}${autoplay ? 'autoplay=1&' : ''}${muted ? 'mute=1&' : ''}${loop ? 'loop=1&' : ''}`}
            title={caption || 'Video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className={`w-full rounded-xl ${ASPECTS[aspect] ?? 'aspect-video'}`}
          />
        ) : (
          <video
            src={url}
            controls={controls}
            autoPlay={autoplay}
            muted={muted}
            loop={loop}
            className={`w-full rounded-xl bg-black ${ASPECTS[aspect] ?? 'aspect-video'}`}
          />
        )}
        {caption && <figcaption className="mt-2 text-center text-xs italic text-slate-500">{caption}</figcaption>}
      </figure>
    </NodeViewWrapper>
  )
}

const VideoNode = Node.create({
  name: 'videoBlock',
  group: 'block',
  draggable: true,
  addAttributes() {
    return {
      url: { default: '', renderHTML: suppress },
      caption: { default: '', renderHTML: suppress },
      aspect: { default: '16/9', renderHTML: suppress },
      autoplay: { default: false, renderHTML: suppress },
      muted: { default: true, renderHTML: suppress },
      loop: { default: false, renderHTML: suppress },
      controls: { default: true, renderHTML: suppress },
    }
  },
  parseHTML() { return [{ tag: 'figure[data-block="video"]' }] },
  renderHTML({ node, HTMLAttributes }) {
    const { url, caption, aspect, autoplay, muted, loop, controls } = node.attrs
    const embed = videoEmbedUrl(url)
    const cls = `w-full rounded-xl ${ASPECTS[aspect] ?? 'aspect-video'}`
    const inner = !url
      ? ['div', { class: cls }]
      : embed
        ? ['iframe', { src: `${embed}${autoplay ? '?autoplay=1' : ''}`, title: caption || 'Video', allowfullscreen: 'true', allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture', class: cls }]
        : ['video', { src: url, controls: controls ? 'true' : 'false', autoplay: autoplay ? 'true' : 'false', muted: muted ? 'true' : 'false', loop: loop ? 'true' : 'false', class: cls }]
    return [
      'figure',
      mergeAttributes(HTMLAttributes, { 'data-block': 'video', class: 'my-6' }),
      inner,
      caption ? ['figcaption', { class: 'mt-2 text-center text-xs italic text-slate-500' }, caption] : ['span', { class: 'hidden' }],
    ]
  },
  addNodeView() { return ReactNodeViewRenderer(VideoView) },
})

export const videoBlock: BlockDefinition = {
  name: 'videoBlock',
  title: 'Video',
  description: 'YouTube, Vimeo or MP4 file',
  category: 'media',
  icon: Play,
  keywords: ['video', 'youtube', 'vimeo', 'mp4', 'embed'],
  node: VideoNode,
  defaults: { url: '', caption: '', aspect: '16/9', autoplay: false, muted: true, loop: false, controls: true },
  options: [
    { key: 'url', label: 'Video URL (YouTube / Vimeo / .mp4)', type: 'url' },
    { key: 'caption', label: 'Caption', type: 'text' },
    {
      key: 'aspect',
      label: 'Ratio',
      type: 'select',
      choices: [
        { label: '16 / 9', value: '16/9' },
        { label: '4 / 3', value: '4/3' },
        { label: '1 / 1', value: '1/1' },
      ],
    },
    { key: 'autoplay', label: 'Autoplay', type: 'toggle' },
    { key: 'muted', label: 'Muted', type: 'toggle' },
    { key: 'loop', label: 'Loop', type: 'toggle' },
    { key: 'controls', label: 'Show controls (MP4)', type: 'toggle' },
  ],
}

/* ══════════════════════════════════════════════════════════════════════════
 * 7. EMBED  (generic iframe — map, social post, airtable…)
 * ═════════════════════════════════════════════════════════════════════════*/
const EmbedView = ({ node, selected }: { node: any; selected: boolean }) => {
  const { url, title, height } = node.attrs
  return (
    <NodeViewWrapper data-block="embed" className={cx('my-2', selected && 'ring-2 ring-brand-blue ring-offset-2 rounded-lg')} data-drag-handle>
      {url ? (
        <iframe
          src={url}
          title={title || 'Embedded content'}
          style={{ height: `${height}px` }}
          className="w-full rounded-xl border border-slate-200"
          loading="lazy"
        />
      ) : (
        <EmptyImageBox label="embed URL" className="w-full" />
      )}
    </NodeViewWrapper>
  )
}

const EmbedNode = Node.create({
  name: 'embedBlock',
  group: 'block',
  draggable: true,
  addAttributes() {
    return {
      url: { default: '', renderHTML: suppress },
      title: { default: 'Embedded content', renderHTML: suppress },
      height: { default: 420, renderHTML: suppress },
    }
  },
  parseHTML() { return [{ tag: 'div[data-block="embed"]' }] },
  renderHTML({ node, HTMLAttributes }) {
    const { url, title, height } = node.attrs
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-block': 'embed', class: 'my-6' }),
      url
        ? ['iframe', { src: url, title, loading: 'lazy', style: `height:${height}px`, class: 'w-full rounded-xl border border-slate-200' }]
        : ['div', { class: 'w-full' }],
    ]
  },
  addNodeView() { return ReactNodeViewRenderer(EmbedView) },
})

export const embedBlock: BlockDefinition = {
  name: 'embedBlock',
  title: 'Embed',
  description: 'Any iframe content (map, calendar, post)',
  category: 'media',
  icon: Code2,
  keywords: ['embed', 'iframe', 'map', 'calendar', 'social'],
  node: EmbedNode,
  defaults: { url: '', title: 'Embedded content', height: 420 },
  options: [
    { key: 'url', label: 'Embed URL', type: 'url', placeholder: 'https://…' },
    { key: 'title', label: 'Title (accessibility)', type: 'text' },
    { key: 'height', label: 'Height (px)', type: 'range', min: 200, max: 900, step: 20 },
  ],
}

export const mediaBlocks: BlockDefinition[] = [
  imageBlock,
  galleryBlock,
  beforeAfterBlock,
  fullImageBlock,
  imageTextBlock,
  videoBlock,
  embedBlock,
]
