'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Facebook,
  MessageCircle,
  Twitter,
  Linkedin,
  Link2,
  Check,
  ExternalLink,
} from 'lucide-react';
import type { BlogPost, CategoryRow } from '@/lib/database.types';
import CTABanner from '@/components/home/CTABanner';
import ContentBlockRenderer from '@/components/portfolio/ContentBlockRenderer';
import { formatDateUTC } from '@/lib/format-date';

interface BlogPostClientProps {
  post: BlogPost;
  category: CategoryRow | null;
  relatedPosts: BlogPost[];
  contentHtml?: string;
}

export default function BlogPostClient({
  post,
  category,
  relatedPosts,
  contentHtml,
}: BlogPostClientProps) {
  const [copied, setCopied] = useState(false);

  const pageUrl = `https://www.10centagency.com/blog/${post.slug}`;
  const pageTitle = post.title;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = formatDateUTC(post.created_at);

  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/blog"
          className="flex items-center gap-2 text-brand-blue hover:text-brand-blue/70 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        {/* Featured Image */}
        {post.featured_image_url && (
          <div className="mb-8">
            {post.featured_image_link ? (
              <a
                href={post.featured_image_link}
                target="_blank"
                rel="noopener noreferrer"
                className="block relative group"
              >
                <img
                  src={post.featured_image_url}
                  alt={post.title}
                  className="w-full rounded-2xl lg:h-[420px] lg:object-cover"
                />
                <div className="absolute inset-0 bg-brand-navy/70 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                  <ExternalLink className="w-5 h-5 text-white" />
                  <span className="text-white font-medium">Visit</span>
                </div>
              </a>
            ) : (
              <img
                src={post.featured_image_url}
                alt={post.title}
                className="w-full rounded-2xl lg:h-[420px] lg:object-cover"
              />
            )}
          </div>
        )}

        {/* Meta Row */}
        <div className="flex flex-wrap items-center gap-2 mb-6 pb-6 border-b border-brand-border">
          {category && (
            <span className="px-3 py-1.5 bg-brand-blue/10 text-brand-blue text-xs font-semibold rounded-full">
              {category.name}
            </span>
          )}
          {formattedDate && (
            <span className="px-3 py-1.5 border border-brand-blue/30 text-brand-blue/80 text-xs font-medium rounded-full bg-brand-blue/5">
              {formattedDate}
            </span>
          )}
          {post.tags &&
            post.tags.map((tag) => (
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
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-xl text-brand-textMid italic mb-8 border-l-4 border-brand-blue pl-6">
            {post.excerpt}
          </p>
        )}

        {/* Content */}
        {contentHtml ? (
          /* NEW editor output — every node already carries its own Tailwind classes,
             so we must NOT add `prose` here or styles will double up. */
          <div
            className="doc-content mb-12"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        ) : (
          /* FALLBACK: old posts that have not been migrated yet */
          <div className="mb-12 prose prose-sm max-w-none text-brand-textMid [&_img]:my-0 prose-ul:list-disc prose-ul:pl-5 prose-ul:space-y-1 prose-ol:list-decimal prose-ol:pl-5 prose-ol:space-y-1 prose-li:text-brand-textMid prose-li:marker:text-brand-textMid prose-strong:text-brand-textDark prose-strong:font-semibold prose-em:italic prose-u:underline prose-a:text-brand-blue prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-brand-blue/40 prose-blockquote:pl-4 prose-blockquote:italic">
            <ContentBlockRenderer blocks={post.content_blocks ?? []} />
          </div>
        )}

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
  );
}
