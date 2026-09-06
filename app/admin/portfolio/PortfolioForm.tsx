'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
import { supabase } from '@/lib/supabase';
import { getAuthenticatedClient } from '@/lib/auth-helpers';
import { registerAllBlocks, BlockEditor, convertLegacyBlocks, isDocEmpty } from '@/components/editor';
import type { JSONContent } from '@tiptap/core';
import {
  Loader,
  Upload,
  X,
  ArrowLeft,
  Eye,
} from 'lucide-react';

registerAllBlocks();

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
  const [feedback, setFeedback] = useState('');
  const targetStatusRef = useRef<'draft' | 'published'>('draft');

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
  const [featuredImageAlt, setFeaturedImageAlt] = useState('');
  const [content, setContent] = useState<JSONContent | null>(null);
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
        setExcerpt(data.excerpt || '');
        setMetaDescription(data.meta_description || '');
        setTags(data.tags?.join(', ') || '');
        setFeaturedImageUrl(data.featured_image_url || '');
        setFeaturedImageLink(data.featured_image_link || '');
        setFeaturedImageAlt(data.featured_image_alt || '');
        setContent((data.content as JSONContent) ?? convertLegacyBlocks(data.content_blocks) ?? null);
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
      const sanitizedName = file.name.toLowerCase().replace(/[^a-z0-9.\-_]/g, '-').replace(/-+/g, '-');
      const path = `${Date.now()}-${sanitizedName}`;
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

  const handlePreview = () => {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(
      'portfolio-preview',
      JSON.stringify({
        title: title || 'Untitled Project',
        slug: slug || generateSlug(title),
        category,
        industry,
        clientName,
        resultHighlight,
        excerpt: excerpt || '',
        metaDescription: metaDescription || '',
        featuredImageUrl: featuredImageUrl || '',
        featuredImageLink: featuredImageLink || '',
        featuredImageAlt: featuredImageAlt || '',
        content: content ?? null,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        savedAt: new Date().toISOString(),
      })
    );
    window.open('/admin/portfolio/preview', '_blank', 'noopener,noreferrer');
  };

  const submitWithStatus = async (e: React.FormEvent, nextStatus: 'draft' | 'published') => {
    e.preventDefault();
    setError('');
    setFeedback('');
    setSaving(true);

    const client = await getAuthenticatedClient();
    if (!client) {
      setSaving(false);
      return;
    }

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
      featured_image_alt: featuredImageAlt || null,
      content: isDocEmpty(content) ? null : content,
      is_featured: isFeatured,
      sort_order: sortOrder,
      status: nextStatus,
    };

    if (isEditing) {
      const { error } = await client.from('portfolio_items').update(payload).eq('id', itemId!).select().single();
      if (error) { setError(`Update failed: ${error.message}`); setSaving(false); return; }
    } else {
      const { error } = await client.from('portfolio_items').insert([payload]).select().single();
      if (error) { setError(`Create failed: ${error.message}`); setSaving(false); return; }
    }

    setStatus(nextStatus);
    setFeedback(
      nextStatus === 'draft'
        ? 'Draft saved'
        : isEditing && status === 'published'
        ? 'Project updated'
        : 'Project published'
    );
    setTimeout(() => {
      window.location.replace('/admin/portfolio');
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    submitWithStatus(e, targetStatusRef.current);
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
      {feedback && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">
          {feedback}
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

        <div>
          <label className="block text-sm font-medium text-brand-textDark mb-1.5">Image Link URL (Optional)</label>
          <input type="url" value={featuredImageLink} onChange={(e) => setFeaturedImageLink(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-3 py-2 border border-brand-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
          />
          <p className="text-xs text-brand-textMid mt-1">If added, clicking this image opens the URL in a new tab</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-textDark mb-1.5">Alt Text (SEO)</label>
          <input
            type="text"
            value={featuredImageAlt}
            onChange={(e) => setFeaturedImageAlt(e.target.value)}
            placeholder="Describe the image for search engines and accessibility"
            className="w-full px-4 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
          />
          <p className="text-xs text-brand-textMid mt-1">
            Keep it concise and descriptive (e.g. "Portfolio project showcase")
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl border border-brand-border p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-brand-textDark">Content</h2>
          <span className="text-xs text-brand-textMid">Block editor</span>
        </div>
        {loading ? (
          <p className="text-sm text-brand-textMid">Loading content…</p>
        ) : (
          <BlockEditor
            key={itemId ?? 'new-portfolio'}
            value={content}
            onChange={setContent}
            upload={async (file) => uploadImage(file, 'portfolio-content')}
          />
        )}
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
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="button"
          onClick={handlePreview}
          className="px-5 py-2.5 rounded-lg border border-brand-border bg-white text-sm font-medium text-brand-textDark hover:bg-gray-50 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Eye className="w-4 h-4 text-brand-textMid" />
          Preview
        </button>
        <button
          type="submit"
          onClick={() => {
            targetStatusRef.current = 'draft';
          }}
          disabled={saving}
          className="px-5 py-2.5 rounded-lg border border-brand-border bg-white text-sm font-medium text-brand-textDark hover:bg-gray-50 transition-colors disabled:opacity-60 flex items-center gap-2 cursor-pointer"
        >
          {saving && targetStatusRef.current === 'draft' && <Loader className="w-4 h-4 animate-spin" />}
          {saving && targetStatusRef.current === 'draft' ? 'Saving…' : 'Save Draft'}
        </button>
        <button
          type="submit"
          onClick={() => {
            targetStatusRef.current = 'published';
          }}
          disabled={saving}
          className="bg-brand-navy text-white text-sm font-semibold rounded-lg px-6 py-2.5 hover:bg-brand-blue transition-colors disabled:opacity-60 flex items-center gap-2 cursor-pointer"
        >
          {saving && targetStatusRef.current === 'published' && <Loader className="w-4 h-4 animate-spin" />}
          {saving && targetStatusRef.current === 'published'
            ? 'Saving…'
            : isEditing && status === 'published'
            ? 'Update'
            : 'Publish'}
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