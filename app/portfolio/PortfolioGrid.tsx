'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { PortfolioItem } from '@/lib/database.types';

const filters = ['All', 'Meta', 'Website', 'Design', 'Automation'];

const categoryColors: Record<string, string> = {
  Meta: 'bg-blue-100 text-blue-700',
  Website: 'bg-sky-100 text-sky-700',
  Design: 'bg-rose-100 text-rose-700',
  Automation: 'bg-green-100 text-green-700',
};

interface PortfolioGridProps {
  initialItems?: PortfolioItem[];
}

export default function PortfolioGrid({ initialItems = [] }: PortfolioGridProps) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [items, setItems] = useState<PortfolioItem[]>(initialItems);
  const [loading, setLoading] = useState(initialItems.length === 0);

  useEffect(() => {
    // Only fetch client-side if no initial items were supplied via SSR
    if (initialItems.length > 0) {
      return;
    }

    async function fetchPortfolio() {
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('status', 'published')
        .order('sort_order', { ascending: true });

      if (!error && data) setItems(data);
      setLoading(false);
    }
    fetchPortfolio();
  }, [initialItems]);

  const filtered =
    activeFilter === 'All'
      ? items
      : items.filter((p) => p.category === activeFilter);

  if (loading) {
    return (
      <section className="bg-white py-16 lg:py-24">
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
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-textMid">
            Portfolio items coming soon. Check back later!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
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

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.3 }}
                className="group rounded-2xl overflow-hidden border border-brand-border hover:shadow-card-hover transition-shadow duration-300 bg-white"
              >
                <Link href={`/portfolio/${project.slug}`}>
                  <div
                    className="relative h-52 flex items-center justify-center overflow-hidden"
                    style={{
                      background: project.featured_image_url
                        ? `url(${project.featured_image_url}) center/cover`
                        : `linear-gradient(135deg, ${project.thumbnail_gradient_from}, ${project.thumbnail_gradient_to})`,
                    }}
                  >
                    {!project.featured_image_url && (
                      <span className="text-5xl font-black text-white/20">
                        {project.category.charAt(0)}
                      </span>
                    )}
                    <div className="absolute inset-0 bg-brand-navy/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center gap-2 text-white font-semibold">
                        <ExternalLink className="w-5 h-5" />
                        View Project
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="p-5">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      categoryColors[project.category] || 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {project.category}
                  </span>
                  <Link href={`/portfolio/${project.slug}`}>
                    <h3 className="font-semibold text-brand-textDark mt-2 mb-1 hover:text-brand-blue transition-colors">
                      {project.title}
                    </h3>
                  </Link>
                  <p className="text-brand-textMid text-sm">
                    {project.result_highlight}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
