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
} from 'lucide-react';

const CATEGORIES = ['Meta', 'Website', 'Design', 'Automation'] as const;

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
  const [tags, setTags] = useState('');
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');
  const [featuredImageLink, setFeaturedImageLink] = useState('');
  const [gradientFrom, setGradientFrom] = useState('#2F85F3');
  const [gradientTo, setGradientTo] = useState('#B6D7FF');
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [sortOrder, setSortOrder] = useState(0);
  const [status, setStatus] = useState<'draft' | 'published'>('draft');

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

  const uploadImage = useCallback(
    async (file: File, bucket: string): Promise<string | null> => {
      const client = await getAuthenticatedClient();
      if (!client) return null;

      const ext = file.name.split('.').pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await client.storage
        .from(bucket)
        .upload(path, file, { cacheControl: '3600', upsert: false });
      if (uploadError) {
        setError('Image upload failed');
        return null;
      }
      const {
        data: { publicUrl },
      } = client.storage.from(bucket).getPublicUrl(path);
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

  const addContentBlock = (type: 'text' | 'image') => {
    const newBlock: ContentBlock = type === 'text'
      ? {
          id: crypto.randomUUID(),
          type: 'text',
          order: contentBlocks.length,
          heading: '',
          content: '',
        }
      : {
          id: crypto.randomUUID(),
          type: 'image',
          order: contentBlocks.length,
          image_url: '',
          caption: '',
          link_url: '',
        };
    setContentBlocks([...contentBlocks, newBlock]);
  };

  const updateContentBlock = (id: string, updates: Record<string, unknown>) => {
    setContentBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } as ContentBlock : b))
    );
  };

  const removeContentBlock = (id: string) => {
    setContentBlocks((prev) => {
      const filtered = prev.filter((b) => b.id !== id);
      return filtered.map((b, i) => ({ ...b, order: i }));
    });
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

  const handleContentImageUpload = async (
    blockId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(blockId);
    const url = await uploadImage(file, 'portfolio-content');
    if (url) updateContentBlock(blockId, { image_url: url } as Partial<ContentBlock>);
    setUploading(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      alert('Session expired. Please login again.')
      window.location.replace('/auth')
      return
    }

    const finalSlug = slug || generateSlug(title);
    const tagsArray = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title,
      slug: finalSlug,
      category,
      industry,
      client_name: clientName || null,
      result_highlight: resultHighlight,
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
      const { data, error } = await supabase
        .from('portfolio_items')
        .update(payload)
        .eq('id', itemId!)
        .select()
        .single()

      if (error) {
        setError(error.message)
        setSaving(false)
        return
      }
    } else {
      const { data, error } = await supabase
        .from('portfolio_items')
        .insert([payload])
        .select()
        .single()

      if (error) {
        setError(error.message)
        setSaving(false)
        return
      }
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

      {/* Basic Info */}
      <div className="bg-white rounded-xl border border-brand-border p-5 space-y-4">
        <h2 className="text-sm font-semibold text-brand-textDark">Basic Info</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-brand-textDark mb-1.5">
              Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!isEditing) setSlug(generateSlug(e.target.value));
              }}
              className="w-full px-4 py-2.5 rounded-lg border border-brand-border bg-white text-sm text-brand-textDark focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-brand-textDark mb-1.5">
              Slug
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-brand-border bg-white text-sm text-brand-textDark focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-textDark mb-1.5">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as typeof CATEGORIES[number])}
              className="w-full px-4 py-2.5 rounded-lg border border-brand-border bg-white text-sm text-brand-textDark focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-textDark mb-1.5">
              Industry
            </label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-brand-border bg-white text-sm text-brand-textDark focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-textDark mb-1.5">
              Client Name
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-brand-border bg-white text-sm text-brand-textDark focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-textDark mb-1.5">
              Result Highlight
            </label>
            <input
              type="text"
              value={resultHighlight}
              onChange={(e) => setResultHighlight(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-brand-border bg-white text-sm text-brand-textDark focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-brand-textDark mb-1.5">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Facebook Ads, Lead Gen, E-commerce"
              className="w-full px-4 py-2.5 rounded-lg border border-brand-border bg-white text-sm text-brand-textDark placeholder:text-brand-textMid/50 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="bg-white rounded-xl border border-brand-border p-5 space-y-4">
        <h2 className="text-sm font-semibold text-brand-textDark">
          Featured Image
        </h2>

        {featuredImageUrl ? (
          <div className="relative group">
            <img
              src={featuredImageUrl}
              alt="Featured"
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => setFeaturedImageUrl('')}
              className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
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
                <span className="text-sm text-brand-textMid">
                  Click to upload featured image
                </span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFeaturedUpload}
              className="hidden"
            />
          </label>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-textDark mb-1.5">
              Gradient From
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={gradientFrom}
                onChange={(e) => setGradientFrom(e.target.value)}
                className="w-8 h-8 rounded border border-brand-border cursor-pointer"
              />
              <input
                type="text"
                value={gradientFrom}
                onChange={(e) => setGradientFrom(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-brand-border bg-white text-sm text-brand-textDark focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-textDark mb-1.5">
              Gradient To
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={gradientTo}
                onChange={(e) => setGradientTo(e.target.value)}
                className="w-8 h-8 rounded border border-brand-border cursor-pointer"
              />
              <input
                type="text"
                value={gradientTo}
                onChange={(e) => setGradientTo(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-brand-border bg-white text-sm text-brand-textDark focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="mt-3">
          <label className="block text-sm font-medium text-brand-textDark mb-1.5">
            Image Link URL (Optional)
          </label>
          <input
            type="url"
            value={featuredImageLink}
            onChange={(e) => setFeaturedImageLink(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-3 py-2 border border-brand-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
          />
          <p className="text-xs text-brand-textMid mt-1">
            If added, clicking this image opens the URL in a new tab
          </p>
        </div>

        {/* Gradient preview */}
        <div
          className="h-12 rounded-lg"
          style={{
            background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
          }}
        />
      </div>

      {/* Content Blocks */}
      <div className="bg-white rounded-xl border border-brand-border p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-brand-textDark">
            Content Blocks
          </h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => addContentBlock('text')}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-blue bg-brand-blue/5 hover:bg-brand-blue/10 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Type className="w-3.5 h-3.5" />
              Add Text
            </button>
            <button
              type="button"
              onClick={() => addContentBlock('image')}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-blue bg-brand-blue/5 hover:bg-brand-blue/10 px-3 py-1.5 rounded-lg transition-colors"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              Add Image
            </button>
          </div>
        </div>

        {contentBlocks.length === 0 && (
          <p className="text-sm text-brand-textMid text-center py-6">
            No content blocks yet. Add text or image blocks above.
          </p>
        )}

        <div className="space-y-3">
          {contentBlocks.map((block, idx) => (
            <div
              key={block.id}
              className="border border-brand-border rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-brand-textMid/40" />
                  <span className="text-xs font-medium text-brand-textMid">
                    {block.type === 'text' ? 'Text Block' : 'Image Block'} #
                    {idx + 1}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveContentBlock(block.id, 'up')}
                    disabled={idx === 0}
                    className="p-1 text-brand-textMid hover:text-brand-textDark disabled:opacity-30 transition-colors text-xs"
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    onClick={() => moveContentBlock(block.id, 'down')}
                    disabled={idx === contentBlocks.length - 1}
                    className="p-1 text-brand-textMid hover:text-brand-textDark disabled:opacity-30 transition-colors text-xs"
                  >
                    Down
                  </button>
                  <button
                    type="button"
                    onClick={() => removeContentBlock(block.id)}
                    className="p-1 text-brand-textMid hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {block.type === 'text' && (
                <>
                  <input
                    type="text"
                    placeholder="Heading (optional)"
                    value={block.heading || ''}
                    onChange={(e) =>
                      updateContentBlock(block.id, { heading: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-brand-border bg-white text-sm text-brand-textDark placeholder:text-brand-textMid/50 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors"
                  />
                  <RichTextEditor
                    value={block.content}
                    onChange={(content) =>
                      updateContentBlock(block.id, { content })
                    }
                  />
                </>
              )}

              {block.type === 'image' && (
                <>
                  {block.image_url ? (
                    <div className="relative group">
                      <img
                        src={block.image_url}
                        alt={block.caption || 'Content image'}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          updateContentBlock(block.id, {
                            image_url: '',
                          } as Partial<ContentBlock>)
                        }
                        className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4 text-brand-textDark" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-brand-border rounded-lg cursor-pointer hover:border-brand-blue/40 hover:bg-brand-bgAlt/30 transition-colors">
                      {uploading === block.id ? (
                        <Loader className="w-5 h-5 text-brand-blue animate-spin" />
                      ) : (
                        <span className="text-sm text-brand-textMid">
                          Upload image
                        </span>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleContentImageUpload(block.id, e)}
                        className="hidden"
                      />
                    </label>
                  )}
                  <input
                    type="text"
                    placeholder="Caption (optional)"
                    value={block.caption || ''}
                    onChange={(e) =>
                      updateContentBlock(block.id, {
                        caption: e.target.value,
                      } as Partial<ContentBlock>)
                    }
                    className="w-full px-3 py-2 rounded-lg border border-brand-border bg-white text-sm text-brand-textDark placeholder:text-brand-textMid/50 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors"
                  />
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-brand-textDark mb-1">
                      Image Link URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={block.link_url || ''}
                      onChange={(e) =>
                        updateContentBlock(block.id, { link_url: e.target.value })
                      }
                      placeholder="https://example.com"
                      className="w-full px-3 py-2 border border-brand-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                    />
                    <p className="text-xs text-brand-textMid mt-1">
                      If added, clicking this image opens the URL in a new tab
                    </p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-xl border border-brand-border p-5 space-y-4">
        <h2 className="text-sm font-semibold text-brand-textDark">Settings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-textDark mb-1.5">
              Status
            </label>
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as 'draft' | 'published')
              }
              className="w-full px-4 py-2.5 rounded-lg border border-brand-border bg-white text-sm text-brand-textDark focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-textDark mb-1.5">
              Sort Order
            </label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2.5 rounded-lg border border-brand-border bg-white text-sm text-brand-textDark focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors"
            />
          </div>
          <div className="flex items-end pb-0.5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-brand-border text-brand-blue focus:ring-brand-blue/30"
              />
              <span className="text-sm font-medium text-brand-textDark">
                Featured
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-brand-navy text-white text-sm font-semibold rounded-lg px-6 py-2.5 hover:bg-brand-blue transition-colors disabled:opacity-60 flex items-center gap-2"
        >
          {saving && <Loader className="w-4 h-4 animate-spin" />}
          {saving
            ? 'Saving...'
            : isEditing
            ? 'Update Item'
            : 'Create Item'}
        </button>
        <NextLink
          href="/admin/portfolio"
          className="text-sm font-medium text-brand-textMid hover:text-brand-textDark transition-colors px-4 py-2.5"
        >
          Cancel
        </NextLink>
      </div>
    </form>
  );
}