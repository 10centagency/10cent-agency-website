import { ContentBlock } from '@/lib/database.types';

const widthClass = (width?: string) => {
  switch (width) {
    case 'half':  return 'max-w-[50%]';
    case 'third': return 'max-w-[33.333%]';
    default:      return 'w-full';
  }
};

const aspectClass = (ratio?: string) => {
  switch (ratio) {
    case '16/9': return 'aspect-video';
    case '4/3':  return 'aspect-[4/3]';
    case '1/1':  return 'aspect-square';
    case '3/4':  return 'aspect-[3/4]';
    default:     return '';
  }
};

export default function ContentBlockRenderer({ blocks }: { blocks: ContentBlock[] }) {
  if (!blocks?.length) return null;

  return (
    <div className="space-y-10">
      {blocks
        .sort((a, b) => a.order - b.order)
        .map((block) => {
          switch (block.type) {

            case 'text':
              return (
                <div key={block.id}>
                  {block.heading && (
                    <h3 className="text-xl font-bold text-brand-textDark mb-3">
                      {block.heading}
                    </h3>
                  )}
                  {block.content && (
                    <div
                      className="prose prose-sm max-w-none text-brand-textMid
                        prose-ul:list-disc prose-ul:pl-5 prose-ul:space-y-1
                        prose-ol:list-decimal prose-ol:pl-5 prose-ol:space-y-1
                        prose-li:text-brand-textMid prose-li:marker:text-brand-textMid
                        prose-strong:text-brand-textDark prose-strong:font-semibold
                        prose-em:italic prose-u:underline
                        prose-a:text-brand-blue prose-a:underline prose-a:hover:text-brand-blue/70 prose-a:transition-colors
                        prose-blockquote:border-l-4 prose-blockquote:border-brand-blue/40 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-brand-textMid
                        prose-h1:text-brand-textDark prose-h1:font-bold
                        prose-h2:text-brand-textDark prose-h2:font-bold
                        prose-h3:text-brand-textDark prose-h3:font-semibold"
                      dangerouslySetInnerHTML={{ __html: block.content }}
                    />
                  )}
                </div>
              );

            case 'image': {
              const wClass = widthClass((block as any).width);
              const aClass = aspectClass((block as any).aspect_ratio);
              const img = (
                <div className={`${wClass} overflow-hidden rounded-xl`}>
                  <img
                    src={block.image_url}
                    alt={block.caption || ''}
                    className={`w-full object-cover rounded-xl ${aClass}`}
                  />
                </div>
              );
              return (
                <figure key={block.id} className="space-y-2">
                  {block.link_url ? (
                    <a href={block.link_url} target="_blank" rel="noopener noreferrer">{img}</a>
                  ) : img}
                  {block.caption && (
                    <figcaption className="text-xs text-brand-textMid text-center">{block.caption}</figcaption>
                  )}
                </figure>
              );
            }

            case 'full-image': {
              const b = block as Extract<ContentBlock, { type: 'full-image' }>;
              const img = (
                <img src={b.image_url} alt={b.caption || ''} className="w-full rounded-xl object-cover" />
              );
              return (
                <figure key={b.id} className="space-y-2">
                  {b.link_url ? (
                    <a href={b.link_url} target="_blank" rel="noopener noreferrer">{img}</a>
                  ) : img}
                  {b.caption && (
                    <figcaption className="text-xs text-brand-textMid text-center">{b.caption}</figcaption>
                  )}
                </figure>
              );
            }

            case 'image-duo': {
              const b = block as Extract<ContentBlock, { type: 'image-duo' }>;
              return (
                <figure key={b.id} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {[
                      { url: b.left_image_url,  label: b.left_label  || 'Before' },
                      { url: b.right_image_url, label: b.right_label || 'After'  },
                    ].map(({ url, label }, i) => (
                      <div key={i} className="space-y-2">
                        {url && (
                          <img src={url} alt={label} className="w-full rounded-xl object-cover aspect-square sm:aspect-[4/3]" />
                        )}
                        <p className="text-xs font-semibold text-center text-brand-textMid uppercase tracking-wider">{label}</p>
                      </div>
                    ))}
                  </div>
                  {b.caption && (
                    <figcaption className="text-xs text-brand-textMid text-center">{b.caption}</figcaption>
                  )}
                </figure>
              );
            }

            case 'image-grid': {
              const b = block as Extract<ContentBlock, { type: 'image-grid' }>;
              const colClass =
                b.columns === 2 ? 'grid-cols-2' :
                b.columns === 3 ? 'grid-cols-2 sm:grid-cols-3' :
                                  'grid-cols-2 sm:grid-cols-4';
              return (
                <div key={b.id} className={`grid ${colClass} gap-3`}>
                  {b.images.filter((img) => img.url).map((img, i) => (
                    <figure key={i} className="space-y-1">
                      <img src={img.url} alt={img.caption || ''} className="w-full aspect-square object-cover rounded-xl" />
                      {img.caption && (
                        <figcaption className="text-xs text-brand-textMid text-center">{img.caption}</figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              );
            }

             case 'image-text': {
               const b = block as Extract<ContentBlock, { type: 'image-text' }>;
               const colStyle =
                 b.image_width === '1/3' ? '1fr 2fr' :
                 b.image_width === '2/3' ? '2fr 1fr' : '1fr 1fr';
               const aClass =
                 b.aspect_ratio === '16/9' ? 'aspect-video' :
                 b.aspect_ratio === '4/3'  ? 'aspect-[4/3]' :
                 b.aspect_ratio === '3/4'  ? 'aspect-[3/4]' : 'aspect-square';
               const imgEl = b.image_url ? (
                 <div className={`overflow-hidden rounded-xl ${aClass}`}>
                   <img src={b.image_url} alt={b.heading || ''} className="w-full h-full object-cover" />
                 </div>
               ) : null;
               return (
                 <div key={b.id}
                   className="flex flex-col sm:grid gap-6 sm:gap-8 items-center"
                   style={{ gridTemplateColumns: colStyle }}
                 >
                   <div className={`order-2 ${b.image_position === 'right' ? 'sm:order-2' : 'sm:order-1'}`}>
                     {b.link_url && b.image_url ? (
                       <a href={b.link_url} target="_blank" rel="noopener noreferrer">{imgEl}</a>
                     ) : imgEl}
                   </div>
                   <div className={`space-y-3 order-1 ${b.image_position === 'right' ? 'sm:order-1' : 'sm:order-2'}`}>
                    {b.heading && (
                      <h3 className="text-xl font-bold text-brand-textDark">{b.heading}</h3>
                    )}
                    {b.content && (
                      <div className="prose prose-sm max-w-none text-brand-textMid
                        prose-ul:list-disc prose-ul:pl-5 prose-ul:space-y-1
                        prose-ol:list-decimal prose-ol:pl-5 prose-ol:space-y-1
                        prose-li:text-brand-textMid prose-li:marker:text-brand-textMid
                        prose-strong:text-brand-textDark prose-strong:font-semibold
                        prose-em:italic prose-u:underline
                        prose-a:text-brand-blue prose-a:underline prose-a:hover:text-brand-blue/70 prose-a:transition-colors
                        prose-blockquote:border-l-4 prose-blockquote:border-brand-blue/40 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-brand-textMid
                        prose-h1:text-brand-textDark prose-h1:font-bold
                        prose-h2:text-brand-textDark prose-h2:font-bold
                        prose-h3:text-brand-textDark prose-h3:font-semibold"
                        dangerouslySetInnerHTML={{ __html: b.content }}
                      />
                    )}
                  </div>
                </div>
              );
            }

            case 'color-palette': {
              const b = block as Extract<ContentBlock, { type: 'color-palette' }>;
              return (
                <div key={b.id} className="space-y-3">
                  {b.title && <h4 className="text-sm font-semibold text-brand-textDark">{b.title}</h4>}
                  <div className="flex flex-wrap gap-4">
                    {b.colors.map((color, i) => (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 rounded-2xl shadow-md border border-black/5" style={{ backgroundColor: color.hex }} />
                        <div className="text-center">
                          <p className="text-xs font-mono font-medium text-brand-textDark">{color.hex.toUpperCase()}</p>
                          <p className="text-xs text-brand-textMid">{color.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            case 'typography': {
              const b = block as Extract<ContentBlock, { type: 'typography' }>;
              return (
                <div key={b.id} className="space-y-4">
                  {b.title && <h4 className="text-sm font-semibold text-brand-textDark">{b.title}</h4>}
                  <div className="space-y-3">
                    {b.fonts.map((font, i) => (
                      <div key={i} className="border border-brand-border rounded-xl px-5 py-4 bg-brand-bgAlt/30">
                        <p className="text-xs text-brand-textMid mb-1">{font.name}{font.style ? ` · ${font.style}` : ''}{font.weight ? ` · ${font.weight}` : ''}</p>
                        <p className="text-2xl text-brand-textDark leading-snug" style={{ fontWeight: font.weight }}>
                          {font.sample || 'The quick brown fox jumps over the lazy dog'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            default:
              return null;
          }
        })}
    </div>
  );
}
