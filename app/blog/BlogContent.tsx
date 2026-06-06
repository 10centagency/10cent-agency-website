'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ExternalLink, ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { BlogPost, CategoryRow } from '@/lib/database.types';
import SectionLabel from '@/components/ui/SectionLabel';
import AnimatedSection from '@/components/ui/AnimatedSection';
import CTABanner from '@/components/home/CTABanner';

const categoryColors: Record<string, string> = {
  'Marketing Tips': 'bg-blue-100 text-blue-700',
  'Social Media': 'bg-purple-100 text-purple-700',
  'Web Design': 'bg-sky-100 text-sky-700',
  'AI & Automation': 'bg-green-100 text-green-700',
  'Business Growth': 'bg-amber-100 text-amber-700',
  'Case Studies': 'bg-rose-100 text-rose-700',
};

export default function BlogContent() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    async function fetchData() {
      const [postsRes, categoriesRes] = await Promise.all([
        supabase
          .from('blog_posts')
          .select('*')
          .eq('status', 'published')
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: false }),
        supabase
          .from('categories')
          .select('*')
          .eq('type', 'blog')
          .order('name'),
      ]);

      if (postsRes.data) setPosts(postsRes.data as BlogPost[]);
      if (categoriesRes.data) setCategories(categoriesRes.data as CategoryRow[]);
      setLoading(false);
    }
    fetchData();
  }, []);

  // Reset visible count when filter changes
  useEffect(() => {
    setVisibleCount(6);
  }, [activeFilter]);

  const filtered =
    activeFilter === 'All'
      ? posts
      : posts.filter((p) => {
          const cat = categories.find((c) => c.id === p.category_id);
          return cat?.name === activeFilter;
        });

  const visiblePosts = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const filters = ['All', ...categories.map((c) => c.name)];

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden border border-brand-border bg-white"
              >
                <div className="h-52 bg-brand-bgAlt animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-4 w-16 bg-brand-bgAlt rounded animate-pulse" />
                  <div className="h-5 w-3/4 bg-brand-bgAlt rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-brand-bgAlt rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-brand-bgAlt pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="max-w-3xl">
            <SectionLabel>Our Insights</SectionLabel>
            <h1 className="text-4xl lg:text-6xl font-black text-brand-textDark mt-2 mb-5">
              Digital Marketing Blog
            </h1>
            <p className="text-brand-textMid text-xl leading-relaxed">
              Expert tips, guides, and insights on digital marketing for small businesses in Bangladesh. New articles coming soon.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Filter Tabs & Grid Section */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeFilter === filter
                    ? 'bg-brand-navy text-white shadow-sm'
                    : 'border border-brand-border text-brand-textMid hover:border-brand-blue hover:text-brand-blue'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Post Count */}
          <p className="text-sm text-brand-textMid text-center mb-12">
            Showing {visiblePosts.length} of {filtered.length} posts
          </p>

          {/* Grid */}
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-brand-textMid/30 mx-auto mb-4" />
              <p className="text-brand-textMid text-lg">No blog posts yet</p>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {visiblePosts.map((post) => {
                  const category = categories.find((c) => c.id === post.category_id);
                  return (
                    <motion.div
                      key={post.id}
                      layout
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.92 }}
                      transition={{ duration: 0.3 }}
                      className="group bg-white rounded-2xl overflow-hidden border border-brand-border shadow-[0_4px_24px_rgba(47,133,243,0.10)] hover:-translate-y-2 hover:shadow-[0_8px_32px_rgba(47,133,243,0.15)] transition-all duration-300"
                    >
                      <div className="border-t-4 border-t-brand-blue" />
                      
                      {/* Image Area */}
                      <Link href={`/blog/${post.slug}`}>
                        <div className="relative h-[200px] overflow-hidden">
                          {post.featured_image_url ? (
                            <img
                              src={post.featured_image_url}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div
                              className="w-full h-full flex items-center justify-center"
                              style={{
                                backgroundImage: `linear-gradient(135deg, ${post.thumbnail_gradient_from} 0%, ${post.thumbnail_gradient_to} 100%)`,
                              }}
                            >
                              <span className="text-5xl font-black text-white/20">
                                {post.title.charAt(0)}
                              </span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-brand-navy/70 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="flex items-center gap-2 text-white font-medium">
                              <ExternalLink className="w-5 h-5" />
                              <span>View Post</span>
                            </div>
                          </div>
                        </div>
                      </Link>

                      {/* Content */}
                      <Link href={`/blog/${post.slug}`}>
                        <div className="p-5">
                          {/* Category Badge */}
                          {category && (
                            <span
                              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                                categoryColors[category.name] || 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {category.name}
                            </span>
                          )}

                          {/* Title */}
                          <h3 className="font-semibold text-lg text-brand-textDark mt-3 mb-2 group-hover:text-brand-blue transition-colors line-clamp-2">
                            {post.title}
                          </h3>

                          {/* Excerpt */}
                          {post.excerpt && (
                            <p className="text-sm text-brand-textMid line-clamp-2 mb-3">
                              {post.excerpt}
                            </p>
                          )}

                          {/* Read More */}
                          <div className="flex items-center gap-2 text-brand-blue font-medium text-sm group-hover:gap-3 transition-all">
                            <BookOpen className="w-4 h-4" />
                            <span>Read More →</span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center mt-12">
              <button
                onClick={() => setVisibleCount((prev) => prev + 6)}
                className="inline-flex items-center gap-2 border-2 border-brand-navy text-brand-navy rounded-xl px-8 py-4 font-semibold hover:bg-brand-navy hover:text-white transition-all duration-300"
              >
                Load More Posts
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-bgAlt py-16 text-center">
        <AnimatedSection>
          <h2 className="text-3xl font-bold text-brand-textDark mb-4">
            Want More Insights?
          </h2>
          <p className="text-brand-textMid mb-8 max-w-xl mx-auto">
            Get expert tips and strategies delivered to your inbox. Book a free consultation to discuss your digital marketing needs.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-brand-navy text-white rounded-xl px-8 py-4 font-semibold hover:bg-brand-blue transition-colors duration-300"
          >
            Start Your Project
          </Link>
        </AnimatedSection>
      </section>

      <CTABanner />
    </>
  );
}
