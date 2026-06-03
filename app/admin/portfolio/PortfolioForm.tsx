'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
import { supabase } from '@/lib/supabase';
import { getAuthenticatedClient } from '@/lib/auth-helpers';
import { ContentBlock, PortfolioItem } from '@/lib/database.types';
import RichTextEditor from '@/components/admin/RichTextEditor';
import {
  Loader,
  Upload,
  X,
  Plus,
  GripVertical,
  Image as ImageIcon,
  Type,
  Trash2,
  ArrowLeft,
  LayoutGrid,
  Columns2,
  Maximize2,
  Palette,
  CaseSensitive,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

const CATEGORIES = ['Meta', 'Website', 'Design', 'Automation'] as const;

// ─── Extended ContentBlock types ───────────────────────────────────────────
// Add these to your database.types.ts as well:
//
// type: 'text'       → { heading, content }
// type: 'image'      → { image_url, caption, link_url, width?, aspect_ratio? }
// type: 'full-image' → { image_url, caption, link_url }
// type: 'image-duo'  → { left_image_url, right_image_url, left_label, right_label, caption }
// type: 'image-grid' → { images: [{url, caption}], columns: 2|3|4 }
// type: 'color-palette' → { colors: [{hex, name}], title }
// type: 'typography' → { fonts: [{name, sample, weight, style}], title }

interface PortfolioFormProps {
  itemId?: string;
}

export default function PortfolioForm({ itemId }: PortfolioFormProps) {
  const router = useRouter();
  const isEditing = !!itemId;

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEditing);
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<typeof CATEGORIES[number]>('Website');
  const [industry, setIndustry] = useState('');
  const [clientName, setClientName] = useState('');
  const [resultHighlight, setResultHighlight] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [tags, setTags] = useState('');
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');
  const [featuredImageLink, setFeaturedImageLink] = useState('');
  const [gradientFrom, setGradientFrom] = useState('#2F85F3');
  const [gradientTo, setGradientTo] = useState('#B6D7FF');
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [sortOrder, setSortOrder] = useState(0);
  const [status, setStatus] = useState<'draft' | 'published'>('draft');

  // ── Add-block menu toggle ──────────────────────────────────────────────
  const [showBlockMenu, setShowBlockMenu] = useState(false);

  const generateSlug = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

  useEffect(() => {
    if (!isEditing) return;
    async function loadItem() {
      const { data } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('id', itemId!)
        .maybeSingle();
      if (data) {
        setTitle(data.title);
        setSlug(data.slug);
        setCategory(data.category);
        setIndustry(data.industry);
        setClientName(data.client_name || '');
        setResultHighlight(data.result_highlight);
        setExcerpt(data.excerpt || '');
        setMetaDescription(data.meta_description || '');
        setTags(data.tags?.join(', ') || '');
        setFeaturedImageUrl(data.featured_image_url || '');
        setFeaturedImageLink(data.featured_image_link || '');
        setGradientFrom(data.thumbnail_gradient_from);
        setGradientTo(data.thumbnail_gradient_to);
        setContentBlocks((data.content_blocks as ContentBlock[]) || []);
        setIsFeatured(data.is_featured);
        setSortOrder(data.sort_order);
        setStatus(data.status);
      }
      setLoading(false);
    }
    loadItem();
  }, [itemId, isEditing]);

  // ── Image upload helper ────────────────────────────────────────────────
  const uploadImage = useCallback(
    async (file: File, bucket: string): Promise<string | null> => {
      const client = await getAuthenticatedClient();
      if (!client) return null;
      const ext = file.name.split('.').pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await client.storage
        .from(bucket)
        .upload(path, file, { cacheControl: '3600', upsert: false });
      if (uploadError) { setError('Image upload failed'); return null; }
      const { data: { publicUrl } } = client.storage.from(bucket).getPublicUrl(path);
      return publicUrl;
    },
    []
  );

  const handleFeaturedUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading('featured');
    const url = await uploadImage(file, 'portfolio-featured');
    if (url) setFeaturedImageUrl(url);
    setUploading(null);
  };

  // ── Content block helpers ──────────────────────────────────────────────
  const addContentBlock = (type: ContentBlock['type']) => {
    setShowBlockMenu(false);
    const base = { id: crypto.randomUUID(), order: contentBlocks.length };

    let newBlock: ContentBlock;
    switch (type) {
      case 'text':
        newBlock = { ...base, type: 'text', heading: '', content: '' };
        break;
      case 'image':
        newBlock = { ...base, type: 'image', image_url: '', caption: '', link_url: '', width: 'full', aspect_ratio: '16/9' };
        break;
      case 'full-image':
        newBlock = { ...base, type: 'full-image', image_url: '', caption: '', link_url: '' };
        break;
      case 'image-duo':
        newBlock = { ...base, type: 'image-duo', left_image_url: '', right_image_url: '', left_label: 'Before', right_label: 'After', caption: '' };
        break;
       case 'image-grid':
         newBlock = { ...base, type: 'image-grid', images: [{ url: '', caption: '' }, { url: '', caption: '' }], columns: 2 };
         break;
       case 'image-text':
         newBlock = {
           ...base,
           type: 'image-text',
           image_url: '',
           image_position: 'left',
           image_width: '1/2',
           aspect_ratio: '1/1',
           heading: '',
           content: '',
           link_url: '',
         };
         break;
       case 'color-palette':
        newBlock = { ...base, type: 'color-palette', title: 'Brand Colors', colors: [{ hex: '#000000', name: 'Primary' }, { hex: '#ffffff', name: 'Secondary' }] };
        break;
      case 'typography':
        newBlock = { ...base, type: 'typography', title: 'Typography', fonts: [{ name: 'Font Name', sample: 'The quick brown fox', weight: '400', style: 'Regular' }] };
        break;
      default:
        return;
    }
    setContentBlocks((prev) => [...prev, newBlock]);
  };

  const updateContentBlock = (id: string, updates: Record<string, unknown>) => {
    setContentBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } as ContentBlock : b))
    );
  };

  const removeContentBlock = (id: string) => {
    setContentBlocks((prev) =>
      prev.filter((b) => b.id !== id).map((b, i) => ({ ...b, order: i }))
    );
  };

  const moveContentBlock = (id: string, direction: 'up' | 'down') => {
    setContentBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      if (idx < 0) return prev;
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= prev.length) return prev;
      const arr = [...prev];
      [arr[idx], arr[swapIdx]] = [arr[swapIdx], arr[idx]];
      return arr.map((b, i) => ({ ...b, order: i }));
    });
  };

  // generic single-image upload for a block field
  const handleBlockImageUpload = async (
    blockId: string,
    field: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const uploadKey = `${blockId}-${field}`;
    setUploading(uploadKey);
    const url = await uploadImage(file, 'portfolio-content');
    if (url) updateContentBlock(blockId, { [field]: url });
    setUploading(null);
  };

  // grid image upload
  const handleGridImageUpload = async (
    blockId: string,
    imgIdx: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const uploadKey = `${blockId}-grid-${imgIdx}`;
    setUploading(uploadKey);
    const url = await uploadImage(file, 'portfolio-content');
    if (url) {
      setContentBlocks((prev) =>
        prev.map((b) => {
          if (b.id !== blockId || b.type !== 'image-grid') return b;
          const images = [...b.images];
          images[imgIdx] = { ...images[imgIdx], url };
          return { ...b, images } as ContentBlock;
        })
      );
    }
    setUploading(null);
  };

  // ── Submit ─────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    const client = await getAuthenticatedClient();
    if (!client) return;

    const finalSlug = slug || generateSlug(title);
    const tagsArray = tags.split(',').map((t) => t.trim()).filter(Boolean);

    const payload = {
      title,
      slug: finalSlug,
      category,
      industry,
      client_name: clientName || null,
      result_highlight: resultHighlight,
      excerpt: excerpt || null,
      meta_description: metaDescription || null,
      tags: tagsArray,
      featured_image_url: featuredImageUrl || null,
      featured_image_link: featuredImageLink || null,
      thumbnail_gradient_from: gradientFrom,
      thumbnail_gradient_to: gradientTo,
      content_blocks: contentBlocks as unknown as Record<string, unknown>[],
      is_featured: isFeatured,
      sort_order: sortOrder,
      status,
    };

    if (isEditing) {
      const { error } = await client.from('portfolio_items').update(payload).eq('id', itemId!).select().single();
      if (error) { setError(`Update failed: ${error.message}`); setSaving(false); return; }
    } else {
      const { error } = await client.from('portfolio_items').insert([payload]).select().single();
      if (error) { setError(`Create failed: ${error.message}`); setSaving(false); return; }
    }

    window.location.replace('/admin/portfolio');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── Block type label + icon map ────────────────────────────────────────
  const blockLabel: Record<string, { label: string; icon: React.ReactNode }> = {
    text:           { label: 'Text Block',       icon: <Type className="w-3.5 h-3.5" /> },
    image:          { label: 'Image',            icon: <ImageIcon className="w-3.5 h-3.5" /> },
    'full-image':   { label: 'Full-Width Image', icon: <Maximize2 className="w-3.5 h-3.5" /> },
    'image-duo':    { label: 'Before / After',   icon: <Columns2 className="w-3.5 h-3.5" /> },
    'image-grid':   { label: 'Image Grid',       icon: <LayoutGrid className="w-3.5 h-3.5" /> },
    'image-text':   { label: 'Image + Text',     icon: <Columns2 className="w-3.5 h-3.5" /> },
    'color-palette':{ label: 'Color Palette',    icon: <Palette className="w-3.5 h-3.5" /> },
    typography:     { label: 'Typography',       icon: <CaseSensitive className="w-3.5 h-3.5" /> },
  };

  // ── Reusable upload zone ───────────────────────────────────────────────
  const UploadZone = ({
    uploadKey,
    label = 'Upload image',
    onFile,
    imageUrl,
    onClear,
    height = 'h-28',
  }: {
    uploadKey: string;
    label?: string;
    onFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
    imageUrl?: string;
    onClear?: () => void;
    height?: string;
  }) => {
    if (imageUrl) {
      return (
        <div className="relative group">
          <img src={imageUrl} alt="uploaded" className={`w-full ${height} object-cover rounded-lg`} />
          {onClear && (
            <button
              type="button"
              onClick={onClear}
              className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4 text-brand-textDark" />
            </button>
          )}
        </div>
      );
    }
    return (
      <label className={`flex flex-col items-center justify-center ${height} border-2 border-dashed border-brand-border rounded-lg cursor-pointer hover:border-brand-blue/40 hover:bg-brand-bgAlt/30 transition-colors`}>
        {uploading === uploadKey ? (
          <Loader className="w-5 h-5 text-brand-blue animate-spin" />
        ) : (
          <>
            <Upload className="w-5 h-5 text-brand-textMid mb-1.5" />
            <span className="text-xs text-brand-textMid">{label}</span>
          </>
        )}
        <input type="file" accept="image/*" onChange={onFile} className="hidden" />
      </label>
    );
  };

  // ── Render a single content block editor ──────────────────────────────
  const renderBlockEditor = (block: ContentBlock, idx: number) => {
    const info = blockLabel[block.type] ?? { label: block.type, icon: null };

    return (
      <div key={block.id} className="border border-brand-border rounded-xl p-4 space-y-3 bg-white">
        {/* Block header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GripVertical className="w-4 h-4 text-brand-textMid/40 flex-shrink-0" />
            <span className="flex items-center gap-1.5 text-xs font-medium text-brand-textMid">
              {info.icon}
              {info.label} #{idx + 1}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => moveContentBlock(block.id, 'up')} disabled={idx === 0}
              className="p-1 text-brand-textMid hover:text-brand-textDark disabled:opacity-30 transition-colors">
              <ChevronUp className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => moveContentBlock(block.id, 'down')} disabled={idx === contentBlocks.length - 1}
              className="p-1 text-brand-textMid hover:text-brand-textDark disabled:opacity-30 transition-colors">
              <ChevronDown className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => removeContentBlock(block.id)}
              className="p-1 text-brand-textMid hover:text-rose-600 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── TEXT ── */}
        {block.type === 'text' && (
          <>
            <input type="text" placeholder="Heading (optional)"
              value={block.heading || ''}
              onChange={(e) => updateContentBlock(block.id, { heading: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            />
            <RichTextEditor
              content={block.content || ''}
              onUpdate={(content: string) => updateContentBlock(block.id, { content })}
            />
          </>
        )}

        {/* ── IMAGE (with width + aspect ratio controls) ── */}
        {block.type === 'image' && (
          <>
            {/* Width control */}
            <div className="flex gap-2 flex-wrap">
              <span className="text-xs font-medium text-brand-textMid self-center">Width:</span>
              {(['full', 'half', 'third'] as const).map((w) => (
                <button key={w} type="button"
                  onClick={() => updateContentBlock(block.id, { width: w })}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    (block as any).width === w
                      ? 'bg-brand-blue text-white'
                      : 'bg-brand-bgAlt border border-brand-border text-brand-textMid hover:text-brand-textDark'
                  }`}
                >
                  {w === 'full' ? 'Full' : w === 'half' ? '1/2' : '1/3'}
                </button>
              ))}
              <span className="text-xs font-medium text-brand-textMid self-center ml-3">Ratio:</span>
              {(['16/9', '4/3', '1/1', '3/4', 'free'] as const).map((r) => (
                <button key={r} type="button"
                  onClick={() => updateContentBlock(block.id, { aspect_ratio: r })}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    (block as any).aspect_ratio === r
                      ? 'bg-brand-blue text-white'
                      : 'bg-brand-bgAlt border border-brand-border text-brand-textMid hover:text-brand-textDark'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <UploadZone
              uploadKey={block.id}
              imageUrl={block.image_url}
              onFile={(e) => handleBlockImageUpload(block.id, 'image_url', e)}
              onClear={() => updateContentBlock(block.id, { image_url: '' })}
            />
            <input type="text" placeholder="Caption (optional)" value={block.caption || ''}
              onChange={(e) => updateContentBlock(block.id, { caption: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            />
            <input type="url" placeholder="Link URL (optional)" value={block.link_url || ''}
              onChange={(e) => updateContentBlock(block.id, { link_url: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            />
          </>
        )}

        {/* ── FULL-WIDTH IMAGE ── */}
        {block.type === 'full-image' && (
          <>
            <p className="text-xs text-brand-textMid">Full viewport-width image — great for hero shots, banner mockups.</p>
            <UploadZone
              uploadKey={`${block.id}-full`}
              height="h-40"
              imageUrl={(block as any).image_url}
              onFile={(e) => handleBlockImageUpload(block.id, 'image_url', e)}
              onClear={() => updateContentBlock(block.id, { image_url: '' })}
            />
            <input type="text" placeholder="Caption (optional)" value={(block as any).caption || ''}
              onChange={(e) => updateContentBlock(block.id, { caption: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            />
            <input type="url" placeholder="Link URL (optional)" value={(block as any).link_url || ''}
              onChange={(e) => updateContentBlock(block.id, { link_url: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            />
          </>
        )}

        {/* ── IMAGE DUO (Before / After) ── */}
        {block.type === 'image-duo' && (
          <>
            <p className="text-xs text-brand-textMid">Side-by-side comparison — perfect for logo redesigns, before/after.</p>
            <div className="grid grid-cols-2 gap-3">
              {/* Left */}
              <div className="space-y-2">
                <input type="text" placeholder="Left label" value={(block as any).left_label || ''}
                  onChange={(e) => updateContentBlock(block.id, { left_label: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                />
                <UploadZone
                  uploadKey={`${block.id}-left`}
                  label="Upload left image"
                  imageUrl={(block as any).left_image_url}
                  onFile={(e) => handleBlockImageUpload(block.id, 'left_image_url', e)}
                  onClear={() => updateContentBlock(block.id, { left_image_url: '' })}
                />
              </div>
              {/* Right */}
              <div className="space-y-2">
                <input type="text" placeholder="Right label" value={(block as any).right_label || ''}
                  onChange={(e) => updateContentBlock(block.id, { right_label: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                />
                <UploadZone
                  uploadKey={`${block.id}-right`}
                  label="Upload right image"
                  imageUrl={(block as any).right_image_url}
                  onFile={(e) => handleBlockImageUpload(block.id, 'right_image_url', e)}
                  onClear={() => updateContentBlock(block.id, { right_image_url: '' })}
                />
              </div>
            </div>
            <input type="text" placeholder="Overall caption (optional)" value={(block as any).caption || ''}
              onChange={(e) => updateContentBlock(block.id, { caption: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            />
          </>
        )}

        {/* ── IMAGE GRID ── */}
        {block.type === 'image-grid' && (
          <>
            {/* Column selector */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium text-brand-textMid">Columns:</span>
              {([2, 3, 4] as const).map((col) => (
                <button key={col} type="button"
                  onClick={() => updateContentBlock(block.id, { columns: col })}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    (block as any).columns === col
                      ? 'bg-brand-blue text-white'
                      : 'bg-brand-bgAlt border border-brand-border text-brand-textMid hover:text-brand-textDark'
                  }`}
                >
                  {col}
                </button>
              ))}
            </div>

            {/* Grid images */}
            <div className={`grid gap-2 ${
              (block as any).columns === 2 ? 'grid-cols-2' :
              (block as any).columns === 3 ? 'grid-cols-3' : 'grid-cols-4'
            }`}>
              {((block as any).images as { url: string; caption: string }[]).map((img, imgIdx) => (
                <div key={imgIdx} className="space-y-1.5">
                  <UploadZone
                    uploadKey={`${block.id}-grid-${imgIdx}`}
                    height="h-24"
                    label="Upload"
                    imageUrl={img.url}
                    onFile={(e) => handleGridImageUpload(block.id, imgIdx, e)}
                    onClear={() => {
                      setContentBlocks((prev) =>
                        prev.map((b) => {
                          if (b.id !== block.id || b.type !== 'image-grid') return b;
                          const images = [...b.images];
                          images[imgIdx] = { ...images[imgIdx], url: '' };
                          return { ...b, images } as ContentBlock;
                        })
                      );
                    }}
                  />
                  <input type="text" placeholder="Caption"
                    value={img.caption}
                    onChange={(e) => {
                      setContentBlocks((prev) =>
                        prev.map((b) => {
                          if (b.id !== block.id || b.type !== 'image-grid') return b;
                          const images = [...b.images];
                          images[imgIdx] = { ...images[imgIdx], caption: e.target.value };
                          return { ...b, images } as ContentBlock;
                        })
                      );
                    }}
                    className="w-full px-2 py-1 rounded border border-brand-border text-xs focus:outline-none focus:ring-1 focus:ring-brand-blue/30"
                  />
                </div>
              ))}
            </div>

            {/* Add / Remove image buttons */}
            <div className="flex gap-2">
              <button type="button"
                onClick={() => {
                  setContentBlocks((prev) =>
                    prev.map((b) => {
                      if (b.id !== block.id || b.type !== 'image-grid') return b;
                      return { ...b, images: [...b.images, { url: '', caption: '' }] } as ContentBlock;
                    })
                  );
                }}
                className="text-xs text-brand-blue hover:underline"
              >
                + Add image
              </button>
              {((block as any).images as any[]).length > 1 && (
                <button type="button"
                  onClick={() => {
                    setContentBlocks((prev) =>
                      prev.map((b) => {
                        if (b.id !== block.id || b.type !== 'image-grid') return b;
                        return { ...b, images: b.images.slice(0, -1) } as ContentBlock;
                      })
                    );
                  }}
                  className="text-xs text-rose-500 hover:underline"
                >
                  − Remove last
                </button>
              )}
            </div>
          </>
        )}

        {/* ── IMAGE + TEXT ── */}
        {block.type === 'image-text' && (
          <>
            <p className="text-xs text-brand-textMid">Image and text side by side — great for showcasing design work with explanation.</p>

            {/* Image position */}
            <div className="flex gap-2 flex-wrap items-center">
              <span className="text-xs font-medium text-brand-textMid">Image position:</span>
              {(['left', 'right'] as const).map((pos) => (
                <button key={pos} type="button"
                  onClick={() => updateContentBlock(block.id, { image_position: pos })}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    (block as any).image_position === pos
                      ? 'bg-brand-blue text-white'
                      : 'bg-brand-bgAlt border border-brand-border text-brand-textMid hover:text-brand-textDark'
                  }`}
                >
                  {pos === 'left' ? 'Image Left' : 'Image Right'}
                </button>
              ))}
            </div>

            {/* Image width */}
            <div className="flex gap-2 flex-wrap items-center">
              <span className="text-xs font-medium text-brand-textMid">Image width:</span>
              {(['1/3', '1/2', '2/3'] as const).map((w) => (
                <button key={w} type="button"
                  onClick={() => updateContentBlock(block.id, { image_width: w })}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    (block as any).image_width === w
                      ? 'bg-brand-blue text-white'
                      : 'bg-brand-bgAlt border border-brand-border text-brand-textMid hover:text-brand-textDark'
                  }`}
                >
                  {w}
                </button>
              ))}
              <span className="text-xs font-medium text-brand-textMid ml-3">Ratio:</span>
              {(['16/9', '4/3', '1/1', '3/4'] as const).map((r) => (
                <button key={r} type="button"
                  onClick={() => updateContentBlock(block.id, { aspect_ratio: r })}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    (block as any).aspect_ratio === r
                      ? 'bg-brand-blue text-white'
                      : 'bg-brand-bgAlt border border-brand-border text-brand-textMid hover:text-brand-textDark'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className={`grid gap-4`}
              style={{ gridTemplateColumns: (block as any).image_width === '1/3' ? '1fr 2fr' : (block as any).image_width === '2/3' ? '2fr 1fr' : '1fr 1fr' }}
            >
              {/* Image side */}
              <div className={(block as any).image_position === 'right' ? 'order-2' : 'order-1'}>
                <UploadZone
                  uploadKey={`${block.id}-imgtext`}
                  imageUrl={(block as any).image_url}
                  onFile={(e) => handleBlockImageUpload(block.id, 'image_url', e)}
                  onClear={() => updateContentBlock(block.id, { image_url: '' })}
                />
                <input type="url" placeholder="Image link URL (optional)" value={(block as any).link_url || ''}
                  onChange={(e) => updateContentBlock(block.id, { link_url: e.target.value })}
                  className="w-full mt-2 px-3 py-2 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                />
              </div>

              {/* Text side */}
              <div className={`space-y-2 ${(block as any).image_position === 'right' ? 'order-1' : 'order-2'}`}>
                <input type="text" placeholder="Heading (optional)" value={(block as any).heading || ''}
                  onChange={(e) => updateContentBlock(block.id, { heading: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                />
                <RichTextEditor
                  content={(block as any).content || ''}
                  onUpdate={(content: string) => updateContentBlock(block.id, { content })}
                />
              </div>
            </div>
          </>
        )}

        {/* ── COLOR PALETTE ── */}
        {block.type === 'color-palette' && (
          <>
            <input type="text" placeholder="Section title" value={(block as any).title || ''}
              onChange={(e) => updateContentBlock(block.id, { title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            />
            <div className="flex flex-wrap gap-3">
              {((block as any).colors as { hex: string; name: string }[]).map((color, cIdx) => (
                <div key={cIdx} className="flex flex-col items-center gap-1.5">
                  <div
                    className="w-14 h-14 rounded-xl border border-brand-border shadow-sm"
                    style={{ backgroundColor: color.hex }}
                  />
                  <input
                    type="color"
                    value={color.hex}
                    onChange={(e) => {
                      setContentBlocks((prev) =>
                        prev.map((b) => {
                          if (b.id !== block.id || b.type !== 'color-palette') return b;
                          const colors = [...b.colors];
                          colors[cIdx] = { ...colors[cIdx], hex: e.target.value };
                          return { ...b, colors } as ContentBlock;
                        })
                      );
                    }}
                    className="w-8 h-6 rounded border border-brand-border cursor-pointer"
                    title="Pick color"
                  />
                  <input
                    type="text"
                    value={color.hex}
                    onChange={(e) => {
                      setContentBlocks((prev) =>
                        prev.map((b) => {
                          if (b.id !== block.id || b.type !== 'color-palette') return b;
                          const colors = [...b.colors];
                          colors[cIdx] = { ...colors[cIdx], hex: e.target.value };
                          return { ...b, colors } as ContentBlock;
                        })
                      );
                    }}
                    className="w-20 px-1.5 py-1 rounded border border-brand-border text-xs text-center font-mono focus:outline-none focus:ring-1 focus:ring-brand-blue/30"
                  />
                  <input
                    type="text"
                    placeholder="Name"
                    value={color.name}
                    onChange={(e) => {
                      setContentBlocks((prev) =>
                        prev.map((b) => {
                          if (b.id !== block.id || b.type !== 'color-palette') return b;
                          const colors = [...b.colors];
                          colors[cIdx] = { ...colors[cIdx], name: e.target.value };
                          return { ...b, colors } as ContentBlock;
                        })
                      );
                    }}
                    className="w-20 px-1.5 py-1 rounded border border-brand-border text-xs text-center focus:outline-none focus:ring-1 focus:ring-brand-blue/30"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button type="button"
                onClick={() => {
                  setContentBlocks((prev) =>
                    prev.map((b) => {
                      if (b.id !== block.id || b.type !== 'color-palette') return b;
                      return { ...b, colors: [...b.colors, { hex: '#cccccc', name: 'New Color' }] } as ContentBlock;
                    })
                  );
                }}
                className="text-xs text-brand-blue hover:underline"
              >
                + Add color
              </button>
              {((block as any).colors as any[]).length > 1 && (
                <button type="button"
                  onClick={() => {
                    setContentBlocks((prev) =>
                      prev.map((b) => {
                        if (b.id !== block.id || b.type !== 'color-palette') return b;
                        return { ...b, colors: b.colors.slice(0, -1) } as ContentBlock;
                      })
                    );
                  }}
                  className="text-xs text-rose-500 hover:underline"
                >
                  − Remove last
                </button>
              )}
            </div>
          </>
        )}

        {/* ── TYPOGRAPHY ── */}
        {block.type === 'typography' && (
          <>
            <input type="text" placeholder="Section title" value={(block as any).title || ''}
              onChange={(e) => updateContentBlock(block.id, { title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            />
            <div className="space-y-3">
              {((block as any).fonts as { name: string; sample: string; weight: string; style: string }[]).map((font, fIdx) => (
                <div key={fIdx} className="border border-brand-border rounded-lg p-3 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="Font name (e.g. Poppins)" value={font.name}
                      onChange={(e) => {
                        setContentBlocks((prev) =>
                          prev.map((b) => {
                            if (b.id !== block.id || b.type !== 'typography') return b;
                            const fonts = [...b.fonts];
                            fonts[fIdx] = { ...fonts[fIdx], name: e.target.value };
                            return { ...b, fonts } as ContentBlock;
                          })
                        );
                      }}
                      className="px-3 py-2 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                    />
                    <input type="text" placeholder="Style (e.g. Bold, Regular)" value={font.style}
                      onChange={(e) => {
                        setContentBlocks((prev) =>
                          prev.map((b) => {
                            if (b.id !== block.id || b.type !== 'typography') return b;
                            const fonts = [...b.fonts];
                            fonts[fIdx] = { ...fonts[fIdx], style: e.target.value };
                            return { ...b, fonts } as ContentBlock;
                          })
                        );
                      }}
                      className="px-3 py-2 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="Weight (e.g. 700)" value={font.weight}
                      onChange={(e) => {
                        setContentBlocks((prev) =>
                          prev.map((b) => {
                            if (b.id !== block.id || b.type !== 'typography') return b;
                            const fonts = [...b.fonts];
                            fonts[fIdx] = { ...fonts[fIdx], weight: e.target.value };
                            return { ...b, fonts } as ContentBlock;
                          })
                        );
                      }}
                      className="px-3 py-2 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                    />
                    <input type="text" placeholder="Sample text" value={font.sample}
                      onChange={(e) => {
                        setContentBlocks((prev) =>
                          prev.map((b) => {
                            if (b.id !== block.id || b.type !== 'typography') return b;
                            const fonts = [...b.fonts];
                            fonts[fIdx] = { ...fonts[fIdx], sample: e.target.value };
                            return { ...b, fonts } as ContentBlock;
                          })
                        );
                      }}
                      className="px-3 py-2 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                    />
                  </div>
                  {/* Preview */}
                  <div className="bg-brand-bgAlt rounded-lg px-3 py-2">
                    <p className="text-xs text-brand-textMid mb-0.5">{font.name} · {font.style} · {font.weight}</p>
                    <p className="text-lg" style={{ fontWeight: font.weight }}>{font.sample || 'The quick brown fox'}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button type="button"
                onClick={() => {
                  setContentBlocks((prev) =>
                    prev.map((b) => {
                      if (b.id !== block.id || b.type !== 'typography') return b;
                      return { ...b, fonts: [...b.fonts, { name: '', sample: 'The quick brown fox', weight: '400', style: 'Regular' }] } as ContentBlock;
                    })
                  );
                }}
                className="text-xs text-brand-blue hover:underline"
              >
                + Add font
              </button>
              {((block as any).fonts as any[]).length > 1 && (
                <button type="button"
                  onClick={() => {
                    setContentBlocks((prev) =>
                      prev.map((b) => {
                        if (b.id !== block.id || b.type !== 'typography') return b;
                        return { ...b, fonts: b.fonts.slice(0, -1) } as ContentBlock;
                      })
                    );
                  }}
                  className="text-xs text-rose-500 hover:underline"
                >
                  − Remove last
                </button>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════
  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* Back link */}
      <NextLink
        href="/admin/portfolio"
        className="inline-flex items-center gap-1.5 text-sm text-brand-textMid hover:text-brand-blue transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Portfolio
      </NextLink>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* ── Basic Info ── */}
      <div className="bg-white rounded-xl border border-brand-border p-5 space-y-4">
        <h2 className="text-sm font-semibold text-brand-textDark">Basic Info</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-brand-textDark mb-1.5">Title *</label>
            <input type="text" required value={title}
              onChange={(e) => { setTitle(e.target.value); if (!isEditing) setSlug(generateSlug(e.target.value)); }}
              className="w-full px-4 py-2.5 rounded-lg border border-brand-border bg-white text-sm text-brand-textDark focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-brand-textDark mb-1.5">Slug</label>
            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-brand-border bg-white text-sm text-brand-textDark focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-textDark mb-1.5">Category *</label>
            <select value={category} onChange={(e) => setCategory(e.target.value as typeof CATEGORIES[number])}
              className="w-full px-4 py-2.5 rounded-lg border border-brand-border bg-white text-sm text-brand-textDark focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-textDark mb-1.5">Industry</label>
            <input type="text" value={industry} onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-brand-border bg-white text-sm text-brand-textDark focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-textDark mb-1.5">Client Name</label>
            <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-brand-border bg-white text-sm text-brand-textDark focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-textDark mb-1.5">Result Highlight</label>
            <input type="text" value={resultHighlight} onChange={(e) => setResultHighlight(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-brand-border bg-white text-sm text-brand-textDark focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-brand-textDark mb-1.5">Tags (comma-separated)</label>
            <input type="text" value={tags} onChange={(e) => setTags(e.target.value)}
              placeholder="Logo Design, Brand Identity, Packaging"
              className="w-full px-4 py-2.5 rounded-lg border border-brand-border bg-white text-sm text-brand-textDark placeholder:text-brand-textMid/50 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-brand-textDark mb-1.5">Excerpt (Short Description)</label>
            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Keep under 160 characters" rows={2} maxLength={160}
              className="w-full px-4 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            />
            <p className="text-xs text-brand-textMid mt-1">{excerpt.length}/160 characters</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-textDark mb-1.5">Meta Description (SEO)</label>
            <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Shown in Google results. Keep under 160 characters." rows={2} maxLength={160}
              className="w-full px-4 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            />
            <p className="text-xs text-brand-textMid mt-1">{metaDescription.length}/160 characters</p>
          </div>
        </div>
      </div>

      {/* ── Featured Image ── */}
      <div className="bg-white rounded-xl border border-brand-border p-5 space-y-4">
        <h2 className="text-sm font-semibold text-brand-textDark">Featured Image</h2>
        {featuredImageUrl ? (
          <div className="relative group">
            <img src={featuredImageUrl} alt="Featured" className="w-full h-48 object-cover rounded-lg" />
            <button type="button" onClick={() => setFeaturedImageUrl('')}
              className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
              <X className="w-4 h-4 text-brand-textDark" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-brand-border rounded-lg cursor-pointer hover:border-brand-blue/40 hover:bg-brand-bgAlt/30 transition-colors">
            {uploading === 'featured' ? (
              <Loader className="w-6 h-6 text-brand-blue animate-spin" />
            ) : (
              <>
                <Upload className="w-6 h-6 text-brand-textMid mb-2" />
                <span className="text-sm text-brand-textMid">Click to upload featured image</span>
              </>
            )}
            <input type="file" accept="image/*" onChange={handleFeaturedUpload} className="hidden" />
          </label>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-textDark mb-1.5">Gradient From</label>
            <div className="flex items-center gap-2">
              <input type="color" value={gradientFrom} onChange={(e) => setGradientFrom(e.target.value)}
                className="w-8 h-8 rounded border border-brand-border cursor-pointer" />
              <input type="text" value={gradientFrom} onChange={(e) => setGradientFrom(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-brand-border bg-white text-sm text-brand-textDark focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-textDark mb-1.5">Gradient To</label>
            <div className="flex items-center gap-2">
              <input type="color" value={gradientTo} onChange={(e) => setGradientTo(e.target.value)}
                className="w-8 h-8 rounded border border-brand-border cursor-pointer" />
              <input type="text" value={gradientTo} onChange={(e) => setGradientTo(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-brand-border bg-white text-sm text-brand-textDark focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-textDark mb-1.5">Image Link URL (Optional)</label>
          <input type="url" value={featuredImageLink} onChange={(e) => setFeaturedImageLink(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-3 py-2 border border-brand-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
          />
          <p className="text-xs text-brand-textMid mt-1">If added, clicking this image opens the URL in a new tab</p>
        </div>

        <div className="h-12 rounded-lg" style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }} />
      </div>

      {/* ── Content Blocks ── */}
      <div className="bg-white rounded-xl border border-brand-border p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-brand-textDark">Content Blocks</h2>
          <span className="text-xs text-brand-textMid">{contentBlocks.length} block{contentBlocks.length !== 1 ? 's' : ''}</span>
        </div>

        {contentBlocks.length === 0 && (
          <p className="text-sm text-brand-textMid text-center py-6">
            No content blocks yet. Add blocks using the buttons below.
          </p>
        )}

        <div className="space-y-3">
          {contentBlocks.map((block, idx) => renderBlockEditor(block, idx))}
        </div>

        {/* ── Add Block Menu ── */}
        <div className="relative mt-2">
          <button
            type="button"
            onClick={() => setShowBlockMenu((v) => !v)}
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-blue bg-brand-blue/5 hover:bg-brand-blue/10 px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Block
          </button>

          {showBlockMenu && (
            <div className="absolute left-0 top-full mt-1.5 z-20 bg-white border border-brand-border rounded-xl shadow-lg p-2 min-w-[220px]">
              {(
                [
                  { type: 'text',           icon: <Type className="w-4 h-4" />,          label: 'Text',              desc: 'Heading + rich text' },
                  { type: 'image',          icon: <ImageIcon className="w-4 h-4" />,     label: 'Image',             desc: 'With width & ratio controls' },
                  { type: 'full-image',     icon: <Maximize2 className="w-4 h-4" />,     label: 'Full-Width Image',  desc: 'Edge-to-edge hero shot' },
                  { type: 'image-duo',      icon: <Columns2 className="w-4 h-4" />,      label: 'Before / After',    desc: 'Side-by-side comparison' },
                  { type: 'image-grid',     icon: <LayoutGrid className="w-4 h-4" />,    label: 'Image Grid',        desc: '2 / 3 / 4 column grid' },
                  { type: 'image-text',     icon: <Columns2 className="w-4 h-4" />,      label: 'Image + Text',      desc: 'Side-by-side image and text' },
                  { type: 'color-palette',  icon: <Palette className="w-4 h-4" />,       label: 'Color Palette',     desc: 'Brand colors showcase' },
                  { type: 'typography',     icon: <CaseSensitive className="w-4 h-4" />, label: 'Typography',        desc: 'Font showcase with preview' },
                ] as { type: ContentBlock['type']; icon: React.ReactNode; label: string; desc: string }[]
              ).map(({ type, icon, label, desc }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => addContentBlock(type)}
                  className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-brand-bgAlt transition-colors text-left"
                >
                  <span className="mt-0.5 text-brand-blue flex-shrink-0">{icon}</span>
                  <span>
                    <span className="block text-sm font-medium text-brand-textDark">{label}</span>
                    <span className="block text-xs text-brand-textMid">{desc}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Settings ── */}
      <div className="bg-white rounded-xl border border-brand-border p-5 space-y-4">
        <h2 className="text-sm font-semibold text-brand-textDark">Settings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-textDark mb-1.5">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
              className="w-full px-4 py-2.5 rounded-lg border border-brand-border bg-white text-sm text-brand-textDark focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-textDark mb-1.5">Sort Order</label>
            <input type="number" value={sortOrder} onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2.5 rounded-lg border border-brand-border bg-white text-sm text-brand-textDark focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors"
            />
          </div>
          <div className="flex items-end pb-0.5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-brand-border text-brand-blue focus:ring-brand-blue/30"
              />
              <span className="text-sm font-medium text-brand-textDark">Featured</span>
            </label>
          </div>
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={saving}
          className="bg-brand-navy text-white text-sm font-semibold rounded-lg px-6 py-2.5 hover:bg-brand-blue transition-colors disabled:opacity-60 flex items-center gap-2"
        >
          {saving && <Loader className="w-4 h-4 animate-spin" />}
          {saving ? 'Saving...' : isEditing ? 'Update Item' : 'Create Item'}
        </button>
        <NextLink href="/admin/portfolio"
          className="text-sm font-medium text-brand-textMid hover:text-brand-textDark transition-colors px-4 py-2.5"
        >
          Cancel
        </NextLink>
      </div>
    </form>
  );
}