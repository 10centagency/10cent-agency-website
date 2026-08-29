'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowRight, FaCalendarDays } from 'react-icons/fa6';
import styles from './HomeSections.module.css';
import HomeSectionReveal from './visuals/HomeSectionReveal.client';
import type { HomeBlogPost } from '@/lib/blog';

interface BlogPreviewProps {
  posts?: HomeBlogPost[];
}

const categoryColors: Record<string, string> = {
  'Marketing Tips': 'bg-blue-100 text-blue-700',
  'Social Media': 'bg-purple-100 text-purple-700',
  'Web Design': 'bg-sky-100 text-sky-700',
  'AI & Automation': 'bg-green-100 text-green-700',
  'Business Growth': 'bg-amber-100 text-amber-700',
  'Case Studies': 'bg-rose-100 text-rose-700',
  'Web Development': 'bg-sky-100 text-sky-700',
  'Digital Marketing': 'bg-blue-100 text-blue-700',
};

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Derives clean plain text for compact cards:
 * Strips HTML tags/entities, trims to ~600 chars at a word boundary,
 * and falls back to excerpt if extracted text is empty or under ~80 chars.
 */
function getCleanContentText(
  content: string | null | undefined,
  excerpt: string | null | undefined,
  maxLen = 600
): string {
  let text = '';
  if (content) {
    text = content
      .replace(/<[^>]*>/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Fallback to excerpt if content is empty or under ~80 chars to prevent dead space
  if (text.length < 80) {
    text = excerpt
      ? excerpt
          .replace(/<[^>]*>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
      : '';
  }

  if (text.length <= maxLen) return text;
  const sub = text.slice(0, maxLen);
  const lastSpace = sub.lastIndexOf(' ');
  return (lastSpace > 0 ? sub.slice(0, lastSpace) : sub).trim();
}

export default function BlogPreview({ posts = [] }: BlogPreviewProps) {
  // Edge Case: 0 published posts -> render NOTHING (no heading, no placeholder cards)
  if (!posts || posts.length === 0) {
    return null;
  }

  const [featuredPost, ...secondaryPosts] = posts;

  const isSingle = posts.length === 1;
  const isDouble = posts.length === 2;

  let gridLayoutClass = styles.blogGrid;
  if (isSingle) {
    gridLayoutClass = `${styles.blogGrid} ${styles.blogGridSingle}`;
  } else if (isDouble) {
    gridLayoutClass = `${styles.blogGrid} ${styles.blogGridDouble}`;
  }

  return (
    <section
      className={`${styles.sectionWrapper} ${styles.section} ${styles.blogSection}`}
      id="latest-blog"
      aria-labelledby="blog-heading"
    >
      <div className={styles.blogContainer}>
        {/* Section Header */}
        <HomeSectionReveal threshold={0.35} className={styles.blogHead}>
          <span className={styles.sectionLabel}>Blog</span>
          <h2 id="blog-heading" className={styles.sectionTitle}>
            Latest From Our Blog
          </h2>
          <p className={styles.sectionDesc}>
            Practical insights on marketing, websites and AI for Bangladeshi businesses.
          </p>
        </HomeSectionReveal>

        {/* Blog Posts Grid */}
        <div className={gridLayoutClass}>
          {/* Featured Post (Left Column / Main Card) */}
          {featuredPost && (
            <HomeSectionReveal
              delay="0.1s"
              threshold={0.35}
              style={{ height: '100%' }}
            >
              <Link
                href={`/blog/${featuredPost.slug}`}
                className={styles.blogFeaturedCard}
                aria-label={`Read article: ${featuredPost.title}`}
              >
                {/* 16:9 Cover Image */}
                <div className={styles.blogFeaturedMedia}>
                  {featuredPost.featured_image_url ? (
                    <Image
                      src={featuredPost.featured_image_url}
                      alt={`10 Cent Agency Blog — ${featuredPost.title}`}
                      fill
                      className={styles.blogFeaturedImg}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      quality={80}
                    />
                  ) : (
                    <div
                      className={styles.blogFallbackGradient}
                      style={{
                        background: `linear-gradient(135deg, ${featuredPost.thumbnail_gradient_from} 0%, ${featuredPost.thumbnail_gradient_to} 100%)`,
                      }}
                    >
                      <span className={styles.blogFallbackLetter}>
                        {featuredPost.title.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className={styles.blogFeaturedOverlay} />
                </div>

                {/* Content Body */}
                <div className={styles.blogFeaturedBody}>
                  {/* Meta Row: Category Badge + Date */}
                  <div className={styles.blogMetaRow}>
                    <span
                      className={`${styles.blogCategoryBadge} ${
                        categoryColors[featuredPost.category] ||
                        'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {featuredPost.category}
                    </span>
                    <span className={styles.blogDate}>
                      <FaCalendarDays className="w-3.5 h-3.5 text-brand-textMid" aria-hidden="true" />
                      <time dateTime={featuredPost.date}>
                        {formatDate(featuredPost.date)}
                      </time>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className={styles.blogFeaturedTitle}>
                    {featuredPost.title}
                  </h3>

                  {/* Excerpt */}
                  {featuredPost.excerpt && (
                    <p className={styles.blogFeaturedExcerpt}>
                      {featuredPost.excerpt}
                    </p>
                  )}

                  {/* Full-wide Read Post CTA */}
                  <span className={styles.blogRpBtn}>
                    <span>Read Post</span>
                    <FaArrowRight className={styles.blogRpBtnArrow} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </HomeSectionReveal>
          )}

          {/* Secondary Posts (Right Column / Compact Stack) */}
          {secondaryPosts.length > 0 && (
            <div className={styles.blogCompactList}>
              {secondaryPosts.map((post, index) => {
                const cleanContent = getCleanContentText(post.content, post.excerpt);

                return (
                  <HomeSectionReveal
                    key={post.slug}
                    delay={`${0.2 + index * 0.1}s`}
                    threshold={0.35}
                    style={{ display: 'flex', flex: 1 }}
                  >
                    <Link
                      href={`/blog/${post.slug}`}
                      className={styles.blogCompactCard}
                      aria-label={`Read article: ${post.title}`}
                    >
                      {/* Mobile (<768px): 16:9 Cover Image */}
                      <div className={styles.blogCompactOnlyMob}>
                        <div className={styles.blogCompactBigImg}>
                          {post.featured_image_url ? (
                            <Image
                              src={post.featured_image_url}
                              alt={`10 Cent Agency Blog — ${post.title}`}
                              fill
                              className={styles.blogFeaturedImg}
                              sizes="(max-width: 768px) 100vw, 33vw"
                              quality={75}
                            />
                          ) : (
                            <div
                              className={styles.blogFallbackGradient}
                              style={{
                                background: `linear-gradient(135deg, ${post.thumbnail_gradient_from} 0%, ${post.thumbnail_gradient_to} 100%)`,
                              }}
                            >
                              <span className={styles.blogFallbackLetter}>
                                {post.title.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Desktop / Tablet (>=768px): Current Head (4:3 thumbnail + meta + 2-line title) */}
                      <div className={styles.blogCompactHead}>
                        <div className={styles.blogCompactThumb}>
                          {post.featured_image_url ? (
                            <Image
                              src={post.featured_image_url}
                              alt={`10 Cent Agency Blog — ${post.title}`}
                              fill
                              className={styles.blogCompactImg}
                              sizes="104px"
                              quality={75}
                            />
                          ) : (
                            <div
                              className={styles.blogFallbackGradient}
                              style={{
                                background: `linear-gradient(135deg, ${post.thumbnail_gradient_from} 0%, ${post.thumbnail_gradient_to} 100%)`,
                              }}
                            >
                              <span className={styles.blogFallbackLetterSmall}>
                                {post.title.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className={styles.blogCompactHeadRight}>
                          <div className={styles.blogCompactTop}>
                            <span
                              className={`${styles.blogCategoryBadge} ${
                                categoryColors[post.category] ||
                                'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {post.category}
                            </span>
                            <span className={styles.blogDate}>
                              <FaCalendarDays className="w-3 h-3 text-brand-textMid" aria-hidden="true" />
                              <time dateTime={post.date}>
                                {formatDate(post.date)}
                              </time>
                            </span>
                          </div>

                          <h4 className={styles.blogCompactTitle}>
                            {post.title}
                          </h4>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className={styles.blogCompactBody}>
                        {/* Mobile-only Meta + Title Block */}
                        <div className={styles.blogCompactOnlyMob}>
                          <div className={styles.blogCompactTop}>
                            <span
                              className={`${styles.blogCategoryBadge} ${
                                categoryColors[post.category] ||
                                'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {post.category}
                            </span>
                            <span className={styles.blogDate}>
                              <FaCalendarDays className="w-3 h-3 text-brand-textMid" aria-hidden="true" />
                              <time dateTime={post.date}>
                                {formatDate(post.date)}
                              </time>
                            </span>
                          </div>

                          <h4 className={styles.blogCompactMobileTitle}>
                            {post.title}
                          </h4>
                        </div>

                        {/* Content Fill (4-line clamped) */}
                        <p className={styles.blogCompactContent}>
                          {cleanContent}
                        </p>
                      </div>

                      {/* Full-wide Read Post CTA */}
                      <span className={styles.blogRpBtn}>
                        <span>Read Post</span>
                        <FaArrowRight className={styles.blogRpBtnArrow} aria-hidden="true" />
                      </span>
                    </Link>
                  </HomeSectionReveal>
                );
              })}
            </div>
          )}
        </div>

        {/* Section Footer: Link to all articles */}
        <HomeSectionReveal delay="0.35s" threshold={0.35} className={styles.blogFooterAction}>
          <Link href="/blog" className={styles.blogAllBtn}>
            <span>See All Articles</span>
            <FaArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </HomeSectionReveal>
      </div>
    </section>
  );
}
