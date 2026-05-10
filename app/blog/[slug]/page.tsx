'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { BlogPost, CategoryRow } from '@/lib/database.types'
import {
  ArrowLeft,
  Facebook,
  MessageCircle,
  Twitter,
  Linkedin,
  Link2,
  Check,
  ExternalLink,
  Loader,
} from 'lucide-react'
import CTABanner from '@/components/home/CTABanner'
import ImageLightbox from '@/components/ui/ImageLightbox'

export default function BlogSinglePage() {
  const params = useParams()
  const slug = params.slug as string

  const [post, setPost] = useState<BlogPost | null>(null)
  const [category, setCategory] = useState<CategoryRow | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const [postRes, relatedRes] = await Promise.all([
        supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .maybeSingle(),
        supabase
          .from('blog_posts')
          .select('*')
          .eq('status', 'published')
          .limit(3),
      ])

      if (postRes.data) {
        const blogPost = postRes.data as BlogPost
        setPost(blogPost)

        if (blogPost.category_id) {
          const catRes = await supabase
            .from('categories')
            .select('*')
            .eq('id', blogPost.category_id)
            .maybeSingle()
          if (catRes.data) setCategory(catRes.data as CategoryRow)
        }

        if (relatedRes.data) {
          setRelatedPosts(
            (relatedRes.data as BlogPost[]).filter(
              (p) => p.id !== blogPost.id && p.category_id === blogPost.category_id
            )
          )
        }
      }
      setLoading(false)
    }

    fetchData()
  }, [slug])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="w-8 h-8 text-brand-blue animate-spin" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-brand-textMid mb-4">Post not found</p>
          <Link href="/blog">
            <button className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90">
              Back to Blog
            </button>
          </Link>
        </div>
      </div>
    )
  }

  const pageUrl = `https://10centagency.com/blog/${post.slug}`
  const pageTitle = post.title

  const handleCopyLink = () => {
    navigator.clipboard.writeText(pageUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link href="/blog" className="flex items-center gap-2 text-brand-blue hover:text-brand-blue/70 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        {/* Featured Image */}
        {post.featured_image_url && (
          <div className="relative h-96 bg-gradient-to-br rounded-2xl overflow-hidden mb-8 group">
            <img
              src={post.featured_image_url}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            {post.featured_image_link && (
              <a
                href={post.featured_image_link}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 bg-brand-navy/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-5 h-5 text-white" />
                <span className="text-white font-medium">Visit</span>
              </a>
            )}
          </div>
        )}

        {/* Meta Row */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-brand-border">
          {category && (
            <span className="px-3 py-1 bg-brand-blue/10 text-brand-blue text-xs font-semibold rounded-full">
              {category.name}
            </span>
          )}
          <span className="text-sm text-brand-textMid">
            {new Date(post.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-brand-textMid bg-gray-100 px-2 py-1 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className="text-4xl lg:text-5xl font-black text-brand-textDark mb-4">
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-xl text-brand-textMid italic mb-8 border-l-4 border-brand-blue pl-6">
            {post.excerpt}
          </p>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-12 space-y-6">
          {(post.content_blocks as any[])?.map((block, index) => {
            if (block.type === 'text') {
              return (
                <div key={index}>
                  {block.heading && (
                    <h2 className="text-2xl font-bold text-brand-textDark mt-6 mb-3">
                      {block.heading}
                    </h2>
                  )}
                  <div
                    className="prose-content prose-headings:text-brand-textDark prose-headings:font-semibold prose-p:text-brand-textDark prose-p:leading-relaxed prose-a:text-brand-blue prose-a:underline prose-blockquote:border-brand-blue prose-blockquote:text-brand-textMid"
                    dangerouslySetInnerHTML={{ __html: block.content }}
                  />
                </div>
              )
            }

            if (block.type === 'image') {
              return (
                <div key={index} className="my-8">
                  {block.link_url ? (
                    <figure>
                      <a
                        href={block.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block relative group rounded-lg overflow-hidden"
                      >
                        <img
                          src={block.image_url}
                          alt={block.caption || 'Content image'}
                          className="w-full h-auto rounded-lg group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-brand-navy/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 rounded-lg">
                          <ExternalLink className="w-5 h-5 text-white" />
                          <span className="text-white font-medium">Visit</span>
                        </div>
                      </a>
                      {block.caption && (
                        <figcaption className="text-center text-sm text-brand-textMid mt-3">
                          {block.caption}
                        </figcaption>
                      )}
                    </figure>
                  ) : (
                    <ImageLightbox
                      src={block.image_url}
                      alt={block.caption || 'Content image'}
                      caption={block.caption}
                    />
                  )}
                </div>
              )
            }

            return null
          })}
        </div>

        {/* Social Share */}
        <div className="bg-gray-50 rounded-xl p-8 mb-12 border border-brand-border">
          <h3 className="text-lg font-semibold text-brand-textDark mb-4">
            Share this article
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                pageUrl
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1877F2] text-white rounded-xl hover:opacity-90 transition-opacity font-medium text-sm"
            >
              <Facebook className="w-4 h-4" />
              <span className="hidden sm:inline">Facebook</span>
            </a>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `${pageTitle} ${pageUrl}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-xl hover:opacity-90 transition-opacity font-medium text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>

            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                pageUrl
              )}&text=${encodeURIComponent(pageTitle)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-xl hover:opacity-90 transition-opacity font-medium text-sm"
            >
              <Twitter className="w-4 h-4" />
              <span className="hidden sm:inline">Twitter</span>
            </a>

            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                pageUrl
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-[#0A66C2] text-white rounded-xl hover:opacity-90 transition-opacity font-medium text-sm"
            >
              <Linkedin className="w-4 h-4" />
              <span className="hidden sm:inline">LinkedIn</span>
            </a>

            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-bgAlt border border-brand-border text-brand-textDark rounded-xl hover:bg-gray-100 transition-colors font-medium text-sm"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="hidden sm:inline text-green-500">Copied</span>
                </>
              ) : (
                <>
                  <Link2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-brand-textDark mb-8">
              Related Posts
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                  <div className="group cursor-pointer h-full">
                    <div className="relative h-40 bg-gradient-to-br rounded-xl overflow-hidden mb-3">
                      {relatedPost.featured_image_url ? (
                        <img
                          src={relatedPost.featured_image_url}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div
                          className="w-full h-full"
                          style={{
                            backgroundImage: `linear-gradient(135deg, ${relatedPost.thumbnail_gradient_from} 0%, ${relatedPost.thumbnail_gradient_to} 100%)`,
                          }}
                        />
                      )}
                    </div>
                    <h4 className="font-semibold text-brand-textDark group-hover:text-brand-blue transition-colors line-clamp-2 text-sm mb-2">
                      {relatedPost.title}
                    </h4>
                    {relatedPost.excerpt && (
                      <p className="text-xs text-brand-textMid line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      <CTABanner />
    </div>
  )
}
