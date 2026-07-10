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
  LayoutGrid,
  Columns2,
  Maximize2,
  Palette,
  CaseSensitive,
  ChevronUp,
  ChevronDown,
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
   const [featuredImageAlt, setFeaturedImageAlt] = useState('')
   const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([])
  const [isFeatured, setIsFeatured] = useState(false)
  const [sortOrder, setSortOrder] = useState(0)
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [categories, setCategories] = useState<CategoryRow[]>([])
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [showBlockMenu, setShowBlockMenu] = useState(false)

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
        setFeaturedImageAlt(data.featured_image_alt || '')
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
       const sanitizedName = file.name.toLowerCase().replace(/[^a-z0-9.\-_]/g, '-').replace(/-+/g, '-')
       const path = `${Date.now()}-${sanitizedName}`
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

  const addContentBlock = (type: ContentBlock['type']) => {
    setShowBlockMenu(false)
    const base = { id: crypto.randomUUID(), order: contentBlocks.length }

    let newBlock: ContentBlock
    switch (type) {
      case 'text':
        newBlock = { ...base, type: 'text', heading: '', content: '' }
        break
      case 'image':
        newBlock = { ...base, type: 'image', image_url: '', caption: '', link_url: '', width: 'full', aspect_ratio: '16/9' }
        break
      case 'full-image':
        newBlock = { ...base, type: 'full-image', image_url: '', caption: '', link_url: '' }
        break
      case 'image-duo':
        newBlock = { ...base, type: 'image-duo', left_image_url: '', right_image_url: '', left_label: 'Before', right_label: 'After', caption: '' }
        break
      case 'image-grid':
        newBlock = { ...base, type: 'image-grid', images: [{ url: '', caption: '' }, { url: '', caption: '' }], columns: 2 }
        break
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
        }
        break
      case 'color-palette':
        newBlock = { ...base, type: 'color-palette', title: 'Brand Colors', colors: [{ hex: '#000000', name: 'Primary' }, { hex: '#ffffff', name: 'Secondary' }] }
        break
      case 'typography':
        newBlock = { ...base, type: 'typography', title: 'Typography', fonts: [{ name: 'Font Name', sample: 'The quick brown fox', weight: '400', style: 'Regular' }] }
        break
      default:
        return
    }
    setContentBlocks((prev) => [...prev, newBlock])
  }

  const updateContentBlock = (id: string, updates: Record<string, unknown>) => {
    setContentBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } as ContentBlock : b))
    )
  }

  const removeContentBlock = (id: string) => {
    setContentBlocks((prev) =>
      prev.filter((b) => b.id !== id).map((b, i) => ({ ...b, order: i }))
    )
  }

  const moveContentBlock = (id: string, direction: 'up' | 'down') => {
    setContentBlocks((prev: ContentBlock[]) => {
      const idx = prev.findIndex((b) => b.id === id)
      if (idx < 0) return prev
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1
      if (swapIdx < 0 || swapIdx >= prev.length) return prev
      const newArr = [...prev]
      const temp = newArr[idx]
      newArr[idx] = newArr[swapIdx]
      newArr[swapIdx] = temp
      return newArr.map((b: ContentBlock, i: number) => ({ ...b, order: i }))
    })
  }

  const handleBlockImageUpload = async (
    blockId: string,
    field: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    const uploadKey = `${blockId}-${field}`
    setUploading(uploadKey)
    const url = await uploadImage(file, 'blog-content')
    if (url) updateContentBlock(blockId, { [field]: url })
    setUploading(null)
  }

  const handleGridImageUpload = async (
    blockId: string,
    imgIdx: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    const uploadKey = `${blockId}-grid-${imgIdx}`
    setUploading(uploadKey)
    const url = await uploadImage(file, 'blog-content')
    if (url) {
      setContentBlocks((prev) =>
        prev.map((b) => {
          if (b.id !== blockId || b.type !== 'image-grid') return b
          const images = [...b.images]
          images[imgIdx] = { ...images[imgIdx], url }
          return { ...b, images } as ContentBlock
        })
      )
    }
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

    const client = await getAuthenticatedClient()
    if (!client) return

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
      featured_image_alt: featuredImageAlt || null,
      content_blocks: contentBlocks as unknown as Record<string, unknown>[],
      tags: tagsArray,
      is_featured: isFeatured,
      sort_order: sortOrder,
      status,
    }

    if (isEditing) {
      const { error } = await client
        .from('blog_posts')
        .update(payload)
        .eq('id', postId!)
        .select()
        .single()

      if (error) {
        console.error('Blog update error:', error)
        setError(`Update failed: ${error.message}`)
        setSaving(false)
        return
      }
    } else {
      const { error } = await client
        .from('blog_posts')
        .insert([payload])
        .select()
        .single()

      if (error) {
        console.error('Blog insert error:', error)
        setError(`Create failed: ${error.message}`)
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

  const blockLabel: Record<string, { label: string; icon: React.ReactNode }> = {
    text:           { label: 'Text Block',       icon: <Type className="w-3.5 h-3.5" /> },
    image:          { label: 'Image',            icon: <ImageIcon className="w-3.5 h-3.5" /> },
    'full-image':   { label: 'Full-Width Image', icon: <Maximize2 className="w-3.5 h-3.5" /> },
    'image-duo':    { label: 'Before / After',   icon: <Columns2 className="w-3.5 h-3.5" /> },
    'image-grid':   { label: 'Image Grid',       icon: <LayoutGrid className="w-3.5 h-3.5" /> },
    'image-text':   { label: 'Image + Text',     icon: <Columns2 className="w-3.5 h-3.5" /> },
    'color-palette':{ label: 'Color Palette',    icon: <Palette className="w-3.5 h-3.5" /> },
    typography:     { label: 'Typography',       icon: <CaseSensitive className="w-3.5 h-3.5" /> },
  }

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

  const renderBlockEditor = (block: ContentBlock, idx: number) => {
    const info = blockLabel[block.type] ?? { label: block.type, icon: null };

    return (
      <div key={block.id} className="border border-brand-border rounded-xl p-4 space-y-3 bg-white">
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
              uploadKey={`${block.id}-image`}
              imageUrl={(block as any).image_url}
              onFile={(e) => handleBlockImageUpload(block.id, 'image_url', e)}
              onClear={() => updateContentBlock(block.id, { image_url: '' })}
            />
            <input type="text" placeholder="Caption (optional)" value={(block as any).caption || ''}
              onChange={(e) => updateContentBlock(block.id, { caption: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            />
            <input type="url" placeholder="Image link URL (optional)" value={(block as any).link_url || ''}
              onChange={(e) => updateContentBlock(block.id, { link_url: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            />
            <input type="text" placeholder="Alt text (for accessibility & SEO)" value={(block as any).alt_text || ''}
              onChange={(e) => updateContentBlock(block.id, { alt_text: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            />
          </>
        )}

        {block.type === 'full-image' && (
          <>
            <UploadZone
              uploadKey={`${block.id}-full`}
              imageUrl={(block as any).image_url}
              onFile={(e) => handleBlockImageUpload(block.id, 'image_url', e)}
              onClear={() => updateContentBlock(block.id, { image_url: '' })}
            />
            <input type="text" placeholder="Caption (optional)" value={(block as any).caption || ''}
              onChange={(e) => updateContentBlock(block.id, { caption: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            />
            <input type="url" placeholder="Image link URL (optional)" value={(block as any).link_url || ''}
              onChange={(e) => updateContentBlock(block.id, { link_url: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            />
            <input type="text" placeholder="Alt text (for accessibility & SEO)" value={(block as any).alt_text || ''}
              onChange={(e) => updateContentBlock(block.id, { alt_text: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            />
          </>
        )}

        {block.type === 'image-duo' && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-medium text-brand-textMid mb-2">Left Image</p>
                <UploadZone
                  uploadKey={`${block.id}-left`}
                  imageUrl={(block as any).left_image_url}
                  onFile={(e) => handleBlockImageUpload(block.id, 'left_image_url', e)}
                  onClear={() => updateContentBlock(block.id, { left_image_url: '' })}
                  height="h-24"
                />
              </div>
              <div>
                <p className="text-xs font-medium text-brand-textMid mb-2">Right Image</p>
                <UploadZone
                  uploadKey={`${block.id}-right`}
                  imageUrl={(block as any).right_image_url}
                  onFile={(e) => handleBlockImageUpload(block.id, 'right_image_url', e)}
                  onClear={() => updateContentBlock(block.id, { right_image_url: '' })}
                  height="h-24"
                />
              </div>
            </div>
            <input type="text" placeholder="Left label" value={(block as any).left_label || ''}
              onChange={(e) => updateContentBlock(block.id, { left_label: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            />
            <input type="text" placeholder="Left alt text" value={(block as any).left_alt_text || ''}
              onChange={(e) => updateContentBlock(block.id, { left_alt_text: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            />
            <input type="text" placeholder="Right label" value={(block as any).right_label || ''}
              onChange={(e) => updateContentBlock(block.id, { right_label: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            />
            <input type="text" placeholder="Right alt text" value={(block as any).right_alt_text || ''}
              onChange={(e) => updateContentBlock(block.id, { right_alt_text: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            />
            <input type="text" placeholder="Caption (optional)" value={(block as any).caption || ''}
              onChange={(e) => updateContentBlock(block.id, { caption: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            />
          </>
        )}

        {block.type === 'image-grid' && (
          <>
            <div className="flex gap-2 items-center">
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
            <div className="space-y-2">
              {((block as any).images || []).map((img: any, i: number) => (
                <div key={i} className="space-y-1">
                  <UploadZone
                    uploadKey={`${block.id}-grid-${i}`}
                    imageUrl={img.url}
                    onFile={(e) => handleGridImageUpload(block.id, i, e)}
                    onClear={() => {
                      const images = [...(block as any).images];
                      images[i] = { ...images[i], url: '' };
                      updateContentBlock(block.id, { images });
                    }}
                    height="h-20"
                  />
                  <input type="text" placeholder="Caption" value={img.caption || ''}
                    onChange={(e) => {
                      const images = [...(block as any).images];
                      images[i] = { ...images[i], caption: e.target.value };
                      updateContentBlock(block.id, { images });
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                  />
                  <input type="text" placeholder="Alt text" value={img.alt || ''}
                    onChange={(e) => {
                      const images = [...(block as any).images];
                      images[i] = { ...images[i], alt: e.target.value };
                      updateContentBlock(block.id, { images });
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                  />
                </div>
              ))}
            </div>
            <button type="button"
              onClick={() => {
                const images = [...((block as any).images || []), { url: '', caption: '' }];
                updateContentBlock(block.id, { images });
              }}
              className="w-full px-3 py-2 text-sm text-brand-blue border border-brand-blue/30 rounded-lg hover:bg-brand-blue/5 transition-colors"
            >
              + Add Image
            </button>
          </>
        )}

        {block.type === 'image-text' && (
          <>
            <div className="flex gap-2 flex-wrap items-center">
              <span className="text-xs font-medium text-brand-textMid">Position:</span>
              {(['left', 'right'] as const).map((pos) => (
                <button key={pos} type="button"
                  onClick={() => updateContentBlock(block.id, { image_position: pos })}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    (block as any).image_position === pos
                      ? 'bg-brand-blue text-white'
                      : 'bg-brand-bgAlt border border-brand-border text-brand-textMid hover:text-brand-textDark'
                  }`}
                >
                  {pos === 'left' ? 'Left' : 'Right'}
                </button>
              ))}
            </div>
            <UploadZone
              uploadKey={`${block.id}-imgtext`}
              imageUrl={(block as any).image_url}
              onFile={(e) => handleBlockImageUpload(block.id, 'image_url', e)}
              onClear={() => updateContentBlock(block.id, { image_url: '' })}
            />
            <input type="text" placeholder="Heading (optional)" value={(block as any).heading || ''}
              onChange={(e) => updateContentBlock(block.id, { heading: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            />
            <RichTextEditor
              content={(block as any).content || ''}
              onUpdate={(content: string) => updateContentBlock(block.id, { content })}
            />
            <input type="url" placeholder="Image link URL (optional)" value={(block as any).link_url || ''}
              onChange={(e) => updateContentBlock(block.id, { link_url: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            />
            <input type="text" placeholder="Alt text (for accessibility & SEO)" value={(block as any).alt_text || ''}
              onChange={(e) => updateContentBlock(block.id, { alt_text: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            />
          </>
        )}

        {block.type === 'color-palette' && (
          <>
            <input type="text" placeholder="Title (optional)" value={(block as any).title || ''}
              onChange={(e) => updateContentBlock(block.id, { title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            />
            <div className="space-y-2">
              {((block as any).colors || []).map((color: any, i: number) => (
                <div key={i} className="flex gap-2 items-end">
                  <input type="color" value={color.hex}
                    onChange={(e) => {
                      const colors = [...(block as any).colors];
                      colors[i] = { ...colors[i], hex: e.target.value };
                      updateContentBlock(block.id, { colors });
                    }}
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <input type="text" placeholder="Color name" value={color.name}
                    onChange={(e) => {
                      const colors = [...(block as any).colors];
                      colors[i] = { ...colors[i], name: e.target.value };
                      updateContentBlock(block.id, { colors });
                    }}
                    className="flex-1 px-3 py-2 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                  />
                </div>
              ))}
            </div>
            <button type="button"
              onClick={() => {
                const colors = [...((block as any).colors || []), { hex: '#000000', name: 'Color' }];
                updateContentBlock(block.id, { colors });
              }}
              className="w-full px-3 py-2 text-sm text-brand-blue border border-brand-blue/30 rounded-lg hover:bg-brand-blue/5 transition-colors"
            >
              + Add Color
            </button>
          </>
        )}

        {block.type === 'typography' && (
          <>
            <input type="text" placeholder="Title (optional)" value={(block as any).title || ''}
              onChange={(e) => updateContentBlock(block.id, { title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            />
            <div className="space-y-3">
              {((block as any).fonts || []).map((font: any, i: number) => (
                <div key={i} className="space-y-2 p-3 border border-brand-border rounded-lg">
                  <input type="text" placeholder="Font name" value={font.name}
                    onChange={(e) => {
                      const fonts = [...(block as any).fonts];
                      fonts[i] = { ...fonts[i], name: e.target.value };
                      updateContentBlock(block.id, { fonts });
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                  />
                  <input type="text" placeholder="Sample text" value={font.sample}
                    onChange={(e) => {
                      const fonts = [...(block as any).fonts];
                      fonts[i] = { ...fonts[i], sample: e.target.value };
                      updateContentBlock(block.id, { fonts });
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                  />
                  <input type="text" placeholder="Weight (e.g., 400, 700)" value={font.weight}
                    onChange={(e) => {
                      const fonts = [...(block as any).fonts];
                      fonts[i] = { ...fonts[i], weight: e.target.value };
                      updateContentBlock(block.id, { fonts });
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                  />
                  <input type="text" placeholder="Style (e.g., Regular, Italic)" value={font.style}
                    onChange={(e) => {
                      const fonts = [...(block as any).fonts];
                      fonts[i] = { ...fonts[i], style: e.target.value };
                      updateContentBlock(block.id, { fonts });
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                  />
                </div>
              ))}
            </div>
            <button type="button"
              onClick={() => {
                const fonts = [...((block as any).fonts || []), { name: 'Font', sample: 'Sample', weight: '400', style: 'Regular' }];
                updateContentBlock(block.id, { fonts });
              }}
              className="w-full px-3 py-2 text-sm text-brand-blue border border-brand-blue/30 rounded-lg hover:bg-brand-blue/5 transition-colors"
            >
              + Add Font
            </button>
          </>
        )}
      </div>
    );
  };

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

        <div className="mt-4">
          <label className="block text-sm font-medium text-brand-textDark mb-2">
            Alt Text (SEO)
          </label>
          <input
            type="text"
            value={featuredImageAlt}
            onChange={(e) => setFeaturedImageAlt(e.target.value)}
            placeholder="Describe the image for search engines and accessibility"
            className="w-full px-4 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
          />
          <p className="text-xs text-brand-textMid mt-1">
            Keep it concise and descriptive (e.g. "Digital marketing agency team in Dhaka")
          </p>
        </div>
      </div>

      {/* Content Blocks */}
      <div className="bg-white rounded-xl border border-brand-border p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-brand-textDark">Content Blocks</h2>
          <span className="text-xs text-brand-textMid">{contentBlocks.length} block{contentBlocks.length !== 1 ? 's' : ''}</span>
        </div>

        {contentBlocks.length === 0 && (
          <p className="text-sm text-brand-textMid text-center py-6">
            No content blocks yet. Add blocks using the button below.
          </p>
        )}

        <div className="space-y-3">
          {contentBlocks.map((block, idx) => renderBlockEditor(block, idx))}
        </div>

        {/* Add Block Menu */}
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
                  { type: 'text',            icon: <Type className="w-4 h-4" />,           label: 'Text',              desc: 'Heading + rich text' },
                  { type: 'image',           icon: <ImageIcon className="w-4 h-4" />,      label: 'Image',             desc: 'With width & ratio controls' },
                  { type: 'full-image',      icon: <Maximize2 className="w-4 h-4" />,      label: 'Full-Width Image',  desc: 'Edge-to-edge hero shot' },
                  { type: 'image-duo',       icon: <Columns2 className="w-4 h-4" />,       label: 'Before / After',    desc: 'Side-by-side comparison' },
                  { type: 'image-grid',      icon: <LayoutGrid className="w-4 h-4" />,     label: 'Image Grid',        desc: '2 / 3 / 4 column grid' },
                  { type: 'image-text',      icon: <Columns2 className="w-4 h-4" />,       label: 'Image + Text',      desc: 'Side-by-side image and text' },
                  { type: 'color-palette',   icon: <Palette className="w-4 h-4" />,        label: 'Color Palette',     desc: 'Brand colors showcase' },
                  { type: 'typography',      icon: <CaseSensitive className="w-4 h-4" />,  label: 'Typography',        desc: 'Font showcase with preview' },
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
