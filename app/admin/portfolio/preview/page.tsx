'use client'

import { useEffect, useState } from 'react'
import { renderDocToHtml, convertLegacyBlocks } from '@/components/editor'
import '@/components/editor/editor.css'
import { X, ExternalLink } from 'lucide-react'
import type { JSONContent } from '@tiptap/core'
import type { ContentBlock } from '@/lib/database.types'

interface PortfolioPreviewData {
  title: string
  slug?: string
  category?: string
  industry?: string
  clientName?: string
  resultHighlight?: string
  excerpt?: string
  metaDescription?: string
  featuredImageUrl?: string
  featuredImageLink?: string
  featuredImageAlt?: string
  content?: JSONContent | null
  contentBlocks?: ContentBlock[]
  tags?: string[]
  savedAt?: string
}

export default function PortfolioPreviewPage() {
  const [data, setData] = useState<PortfolioPreviewData | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('portfolio-preview')
      if (raw) {
        setData(JSON.parse(raw))
      }
    } catch (e) {
      console.error('Failed to parse portfolio preview data from sessionStorage:', e)
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
            This preview must be opened from the portfolio item editor. Open or create a portfolio item in the admin panel and click the Preview button.
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

  // If content was not passed directly, attempt to convert from contentBlocks
  const docContent = data.content ?? (data.contentBlocks ? convertLegacyBlocks(data.contentBlocks) : null)
  const contentHtml = docContent ? renderDocToHtml(docContent) : ''

  const categoryColors: Record<string, string> = {
    Meta: 'bg-blue-100 text-blue-700',
    Website: 'bg-sky-100 text-sky-700',
    Design: 'bg-rose-100 text-rose-700',
    Automation: 'bg-green-100 text-green-700',
  }

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

      {/* Hero Section matching app/portfolio/[slug]/page.tsx */}
      <section className="bg-brand-bgAlt pt-12 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {data.category && (
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                categoryColors[data.category] || 'bg-gray-100 text-gray-700'
              }`}
            >
              {data.category}
            </span>
          )}
          <h1 className="text-4xl lg:text-5xl font-black text-brand-textDark mt-3 mb-4">
            {data.title}
          </h1>
          {data.resultHighlight && (
            <p className="text-brand-textMid text-lg leading-relaxed">
              {data.resultHighlight}
            </p>
          )}
          {data.clientName && (
            <p className="text-sm text-brand-textMid mt-3">
              Client: {data.clientName}
            </p>
          )}
          {data.tags && data.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {data.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium px-2.5 py-1 rounded-full bg-white border border-brand-border text-brand-textMid"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Image matching public portfolio page */}
      {data.featuredImageUrl && (
        <section className="bg-white py-8">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  className="w-full rounded-2xl shadow-sm"
                />
                <div className="absolute inset-0 bg-brand-navy/70 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                  <ExternalLink className="w-5 h-5 text-white" />
                  <span className="text-white font-medium">Visit Website</span>
                </div>
              </a>
            ) : (
              <img
                src={data.featuredImageUrl}
                alt={data.featuredImageAlt || data.title}
                className="w-full rounded-2xl shadow-sm"
              />
            )}
          </div>
        </section>
      )}

      {/* Article / Project Body matching public container classes */}
      <section className="bg-white py-12 lg:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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
        </div>
      </section>
    </div>
  )
}
