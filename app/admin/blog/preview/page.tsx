'use client'

import { useEffect, useState } from 'react'
import { renderDocToHtml } from '@/components/editor'
import '@/components/editor/editor.css'
import { X, ExternalLink } from 'lucide-react'
import type { JSONContent } from '@tiptap/core'

interface BlogPreviewData {
  title: string
  slug?: string
  excerpt?: string
  metaDescription?: string
  featuredImageUrl?: string
  featuredImageLink?: string
  featuredImageAlt?: string
  content?: JSONContent | null
  tags?: string[]
  categoryName?: string
  savedAt?: string
}

export default function BlogPreviewPage() {
  const [data, setData] = useState<BlogPreviewData | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('blog-preview')
      if (raw) {
        setData(JSON.parse(raw))
      }
    } catch (e) {
      console.error('Failed to parse preview data from sessionStorage:', e)
    }
    setMounted(true)
  }, [])

  const handleClose = () => {
    if (typeof window !== 'undefined') {
      window.close()
    }
  }

  if (!mounted) {
    return null
  }

  if (!data) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <X className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Nothing to preview</h2>
          <p className="mt-2 text-sm text-slate-600">
            This preview must be opened from the blog post editor. Open or create a blog post in the admin panel and click the Preview button.
          </p>
          <button
            type="button"
            onClick={handleClose}
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
          >
            Close tab
          </button>
        </div>
      </div>
    )
  }

  const contentHtml = data.content ? renderDocToHtml(data.content) : ''

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-white">
      {/* Slim Top Bar */}
      <div className="sticky top-0 z-50 flex items-center justify-between border-b border-amber-200 bg-amber-50/95 px-4 py-2.5 backdrop-blur-sm shadow-sm">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-900 uppercase tracking-wide">
            Preview — not published yet
          </span>
          <span className="hidden sm:inline text-xs text-amber-800/80 truncate font-medium">
            {data.title}
          </span>
        </div>
        <button
          type="button"
          onClick={handleClose}
          className="inline-flex items-center gap-1.5 rounded-md border border-amber-300 bg-white px-3 py-1 text-xs font-semibold text-amber-900 hover:bg-amber-100 transition-colors shadow-xs cursor-pointer"
        >
          <X className="h-3.5 w-3.5" />
          Close
        </button>
      </div>

      {/* Public Article Layout matching BlogPostClient.tsx */}
      <div className="min-h-screen bg-white pt-10 pb-20">
        <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Featured Image */}
          {data.featuredImageUrl && (
            <div className="mb-8">
              {data.featuredImageLink ? (
                <a
                  href={data.featuredImageLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative group"
                >
                  <img
                    src={data.featuredImageUrl}
                    alt={data.featuredImageAlt || data.title}
                    className="w-full rounded-2xl lg:h-[420px] lg:object-cover"
                  />
                  <div className="absolute inset-0 bg-brand-navy/70 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                    <ExternalLink className="w-5 h-5 text-white" />
                    <span className="text-white font-medium">Visit</span>
                  </div>
                </a>
              ) : (
                <img
                  src={data.featuredImageUrl}
                  alt={data.featuredImageAlt || data.title}
                  className="w-full rounded-2xl lg:h-[420px] lg:object-cover"
                />
              )}
            </div>
          )}

          {/* Meta Row */}
          <div className="flex flex-wrap items-center gap-2 mb-6 pb-6 border-b border-brand-border">
            {data.categoryName && (
              <span className="px-3 py-1.5 bg-brand-blue/10 text-brand-blue text-xs font-semibold rounded-full">
                {data.categoryName}
              </span>
            )}
            <span className="px-3 py-1.5 border border-amber-300 bg-amber-50 text-amber-800 text-xs font-medium rounded-full">
              Draft Preview
            </span>
            {data.tags &&
              data.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 border border-brand-border text-brand-textMid text-xs font-medium rounded-full bg-white"
                >
                  #{tag}
                </span>
              ))}
          </div>

          {/* Title */}
          <h1 className="text-4xl lg:text-5xl font-black text-brand-textDark mb-4">
            {data.title}
          </h1>

          {/* Excerpt */}
          {data.excerpt && (
            <p className="text-xl text-brand-textMid italic mb-8 border-l-4 border-brand-blue pl-6">
              {data.excerpt}
            </p>
          )}

          {/* Content Body */}
          {contentHtml ? (
            <div
              className="doc-content mb-12"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-12 text-center text-sm text-brand-textMid italic mb-12">
              This post has no content yet.
            </div>
          )}
        </article>
      </div>
    </div>
  )
}
