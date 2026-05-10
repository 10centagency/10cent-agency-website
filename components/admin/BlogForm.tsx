'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { getAuthenticatedClient } from '@/lib/auth-helpers'
import { ContentBlock, BlogPost, CategoryRow } from '@/lib/database.types'
import RichTextEditor from './RichTextEditor'
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
} from 'lucide-react'

interface BlogFormProps {
  postId?: string
}

export default function BlogForm({ postId }: BlogFormProps) {
  const router = useRouter()
  const isEditing = !!postId

  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(isEditing)
  const [uploading, setUploading] = useState<string | null>(null)
  const [error, setError] = useState('')

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [tags, setTags] = useState('')
  const [featuredImageUrl, setFeaturedImageUrl] = useState('')
  const [featuredImageLink, setFeaturedImageLink] = useState('')
  const [gradientFrom, setGradientFrom] = useState('#2F85F3')
  const [gradientTo, setGradientTo] = useState('#B6D7FF')
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([])
  const [isFeatured, setIsFeatured] = useState(false)
  const [sortOrder, setSortOrder] = useState(0)
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [categories, setCategories] = useState<CategoryRow[]>([])
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')

  const generateSlug = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .eq('type', 'blog')
        .order('name')
      if (data) setCategories(data as CategoryRow[])
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    if (!isEditing) return
    async function loadPost() {
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', postId!)
        .maybeSingle()
      if (data) {
        setTitle(data.title)
        setSlug(data.slug)
        setCategoryId(data.category_id)
        setExcerpt(data.excerpt || '')
        setMetaDescription(data.meta_description || '')
        setTags(data.tags?.join(', ') || '')
        setFeaturedImageUrl(data.featured_image_url || '')
        setFeaturedImageLink(data.featured_image_link || '')
        setGradientFrom(data.thumbnail_gradient_from)
        setGradientTo(data.thumbnail_gradient_to)
        setContentBlocks((data.content_blocks as ContentBlock[]) || [])
        setIsFeatured(data.is_featured)
        setSortOrder(data.sort_order)
        setStatus(data.status)
      }
      setLoading(false)
    }
    loadPost()
  }, [postId, isEditing])

  const uploadImage = useCallback(
    async (file: File, bucket: string): Promise<string | null> => {
      const client = await getAuthenticatedClient()
      if (!client) return null

      const ext = file.name.split('.').pop()
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: uploadError } = await client.storage
        .from(bucket)
        .upload(path, file, { cacheControl: '3600', upsert: false })
      if (uploadError) {
        setError('Image upload failed')
        return null
      }

      const { data: publicUrl } = client.storage
        .from(bucket)
        .getPublicUrl(path)
      return publicUrl?.publicUrl || null
    },
    []
  )

  const handleFeaturedImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading('featured')
    const url = await uploadImage(file, 'blog-content')
    if (url) setFeaturedImageUrl(url)
    setUploading(null)
  }

  const handleAddContentBlock = (type: 'text' | 'image') => {
    const newBlock: ContentBlock = type === 'text'
      ? {
          id: Date.now().toString(),
          type: 'text',
          order: contentBlocks.length,
          heading: '',
          content: '',
        }
      : {
          id: Date.now().toString(),
          type: 'image',
          order: contentBlocks.length,
          image_url: '',
          caption: '',
          link_url: '',
        };
    setContentBlocks([...contentBlocks, newBlock])
  }

  const updateContentBlock = (
    blockId: string,
    updates: Record<string, unknown>
  ) => {
    setContentBlocks(
      contentBlocks.map((block) =>
        block.id === blockId ? { ...block, ...updates } as ContentBlock : block
      )
    )
  }

  const deleteContentBlock = (blockId: string) => {
    setContentBlocks(contentBlocks.filter((block) => block.id !== blockId))
  }

  const handleImageUpload = async (
    blockId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(blockId)
    const url = await uploadImage(file, 'blog-content')
    if (url) updateContentBlock(blockId, { image_url: url } as Partial<ContentBlock>)
    setUploading(null)
  }

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      window.location.replace('/auth')
      return
    }

    const slugName = generateSlug(newCategoryName)
    const { data, error: insertError } = await supabase
      .from('categories')
      .insert([{ name: newCategoryName, slug: slugName, type: 'blog' }])
      .select()
      .single()

    if (!insertError && data) {
      setCategories([...categories, data as CategoryRow])
      setCategoryId(data.id)
      setNewCategoryName('')
      setShowCategoryModal(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      window.location.replace('/auth')
      return
    }

    const finalSlug = slug || generateSlug(title)
    const tagsArray = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    const payload = {
      title,
      slug: finalSlug,
      category_id: categoryId,
      excerpt: excerpt || null,
      meta_description: metaDescription || null,
      featured_image_url: featuredImageUrl || null,
      featured_image_link: featuredImageLink || null,
      thumbnail_gradient_from: gradientFrom,
      thumbnail_gradient_to: gradientTo,
      content_blocks: contentBlocks as unknown as Record<string, unknown>[],
      tags: tagsArray,
      is_featured: isFeatured,
      sort_order: sortOrder,
      status,
    }

    if (isEditing) {
      const { data, error } = await supabase
        .from('blog_posts')
        .update(payload)
        .eq('id', postId!)
        .select()
        .single()

      if (error) {
        setError(error.message)
        setSaving(false)
        return
      }
    } else {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([payload])
        .select()
        .single()

      if (error) {
        setError(error.message)
        setSaving(false)
        return
      }
    }

    window.location.replace('/admin/blog')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="w-8 h-8 text-brand-blue animate-spin" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Header Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-brand-border">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin/blog">
            <ArrowLeft className="w-5 h-5 text-brand-blue cursor-pointer hover:text-brand-blue/70" />
          </Link>
          <h1 className="text-2xl font-bold text-brand-textDark">
            {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-textDark mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-textDark mb-2">
              Slug
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder={generateSlug(title)}
              className="w-full px-4 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-textDark mb-2">
              Category
            </label>
            <div className="flex gap-2">
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="flex-1 px-4 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                required
              >
                <option value="">Select category...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowCategoryModal(true)}
                className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90 flex items-center gap-2 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-textDark mb-2">
              Tags
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="tag1, tag2, tag3"
              className="w-full px-4 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-brand-textDark mb-2">
              Excerpt (Short Description)
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Keep under 160 characters"
              rows={2}
              maxLength={160}
              className="w-full px-4 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            />
            <p className="text-xs text-brand-textMid mt-1">
              {excerpt.length}/160 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-textDark mb-2">
              Meta Description (SEO)
            </label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Shown in Google results. Keep under 160 characters."
              rows={2}
              maxLength={160}
              className="w-full px-4 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            />
            <p className="text-xs text-brand-textMid mt-1">
              {metaDescription.length}/160 characters
            </p>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-brand-border">
        <h2 className="text-lg font-semibold text-brand-textDark mb-4">
          Featured Image
        </h2>

        {featuredImageUrl ? (
          <div className="relative mb-4 h-48 bg-gray-100 rounded-lg overflow-hidden group">
            <img
              src={featuredImageUrl}
              alt="Featured"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => setFeaturedImageUrl('')}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="block border-2 border-dashed border-brand-border rounded-lg p-6 text-center cursor-pointer hover:border-brand-blue transition-colors">
            <Upload className="w-8 h-8 text-brand-blue mx-auto mb-2" />
            <p className="text-sm text-brand-textMid">
              {uploading === 'featured' ? 'Uploading...' : 'Click to upload image'}
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFeaturedImageUpload}
              disabled={uploading === 'featured'}
              className="hidden"
            />
          </label>
        )}

        <div className="mt-4">
          <label className="block text-sm font-medium text-brand-textDark mb-2">
            Image Link URL (optional)
          </label>
          <input
            type="url"
            value={featuredImageLink}
            onChange={(e) => setFeaturedImageLink(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-4 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
          />
          <p className="text-xs text-brand-textMid mt-1">
            If added, clicking the image will open this URL in a new tab
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-brand-textDark mb-2">
              Gradient From
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={gradientFrom}
                onChange={(e) => setGradientFrom(e.target.value)}
                className="w-12 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={gradientFrom}
                onChange={(e) => setGradientFrom(e.target.value)}
                className="flex-1 px-3 py-2 border border-brand-border rounded-lg text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-textDark mb-2">
              Gradient To
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={gradientTo}
                onChange={(e) => setGradientTo(e.target.value)}
                className="w-12 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={gradientTo}
                onChange={(e) => setGradientTo(e.target.value)}
                className="flex-1 px-3 py-2 border border-brand-border rounded-lg text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content Blocks */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-brand-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-brand-textDark">Content</h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleAddContentBlock('text')}
              className="px-3 py-1.5 bg-brand-blue text-white text-sm rounded-lg hover:bg-brand-blue/90 flex items-center gap-1"
            >
              <Type className="w-4 h-4" />
              Add Text
            </button>
            <button
              type="button"
              onClick={() => handleAddContentBlock('image')}
              className="px-3 py-1.5 bg-brand-blue text-white text-sm rounded-lg hover:bg-brand-blue/90 flex items-center gap-1"
            >
              <ImageIcon className="w-4 h-4" />
              Add Image
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {contentBlocks.length === 0 ? (
            <p className="text-sm text-brand-textMid text-center py-8">
              No content blocks yet. Add text or images above.
            </p>
          ) : (
            contentBlocks.map((block, index) => (
              <div
                key={block.id}
                className="border border-brand-border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-brand-textMid">
                    Block {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteContentBlock(block.id)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {block.type === 'text' ? (
                  <>
                    <input
                      type="text"
                      placeholder="Heading (optional)"
                      value={(block as any).heading || ''}
                      onChange={(e) =>
                        updateContentBlock(block.id, { heading: e.target.value } as any)
                      }
                      className="w-full px-3 py-2 border border-brand-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                    />
                    <RichTextEditor
                      value={(block as any).content || ''}
                      onChange={(content) =>
                        updateContentBlock(block.id, { content } as any)
                      }
                    />
                  </>
                ) : (
                  <>
                    {(block as any).image_url ? (
                      <div className="relative h-32 bg-gray-100 rounded-lg overflow-hidden group">
                        <img
                          src={(block as any).image_url}
                          alt="Content"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            updateContentBlock(block.id, { image_url: '' } as any)
                          }
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="block border-2 border-dashed border-brand-border rounded-lg p-4 text-center cursor-pointer hover:border-brand-blue transition-colors">
                        <Upload className="w-6 h-6 text-brand-blue mx-auto mb-1" />
                        <p className="text-xs text-brand-textMid">
                          {uploading === block.id ? 'Uploading...' : 'Click to upload'}
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(block.id, e)}
                          disabled={uploading === block.id}
                          className="hidden"
                        />
                      </label>
                    )}

                    <input
                      type="text"
                      placeholder="Caption (optional)"
                      value={(block as any).caption || ''}
                      onChange={(e) =>
                        updateContentBlock(block.id, { caption: e.target.value } as any)
                      }
                      className="w-full px-3 py-2 border border-brand-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                    />

                    <input
                      type="url"
                      placeholder="Image Link URL (optional)"
                      value={(block as any).link_url || ''}
                      onChange={(e) =>
                        updateContentBlock(block.id, { link_url: e.target.value } as any)
                      }
                      className="w-full px-3 py-2 border border-brand-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                    />
                    <p className="text-xs text-brand-textMid">
                      If added, clicking this image will open the URL in a new tab
                    </p>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Options */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-brand-border">
        <h2 className="text-lg font-semibold text-brand-textDark mb-4">Options</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 text-brand-blue rounded"
            />
            <span className="text-sm font-medium text-brand-textDark">
              Featured Post
            </span>
          </label>

          <div>
            <label className="block text-sm font-medium text-brand-textDark mb-2">
              Sort Order
            </label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-brand-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-textDark mb-2">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
              className="w-full px-3 py-2 border border-brand-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg">
            <h3 className="text-lg font-semibold text-brand-textDark mb-4">
              Add New Category
            </h3>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Category name"
              className="w-full px-4 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/30 mb-4"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddCategory()
              }}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowCategoryModal(false)}
                className="flex-1 px-4 py-2 border border-brand-border rounded-lg text-brand-textDark hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddCategory}
                className="flex-1 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="sticky bottom-0 bg-white border-t border-brand-border p-4 rounded-t-xl shadow-lg flex gap-3 justify-end">
        <Link href="/admin/blog">
          <button
            type="button"
            className="px-6 py-2 border border-brand-border rounded-lg text-brand-textDark hover:bg-gray-50"
          >
            Cancel
          </button>
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90 disabled:opacity-50 flex items-center gap-2"
        >
          {saving && <Loader className="w-4 h-4 animate-spin" />}
          {isEditing ? 'Update Post' : 'Create Post'}
        </button>
      </div>
    </form>
  )
}
