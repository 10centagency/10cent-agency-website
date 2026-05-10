'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { supabase } from '@/lib/supabase';
import { PortfolioItem } from '@/lib/database.types';

const filters = ['All', 'Meta', 'Website', 'Design', 'Automation'];

const categoryColors: Record<string, string> = {
  Meta: 'bg-blue-100 text-blue-700',
  Website: 'bg-brand-accent/40 text-brand-navy',
  Design: 'bg-rose-100 text-rose-700',
  Automation: 'bg-green-100 text-green-700',
};

export default function PortfolioPreview() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('status', 'published')
        .eq('is_featured', true)
        .order('sort_order', { ascending: true })
        .limit(6);

      if (!error && data && data.length > 0) {
        setItems(data);
      } else {
        // Fallback: show any published items if no featured ones
        const { data: fallbackData } = await supabase
          .from('portfolio_items')
          .select('*')
          .eq('status', 'published')
          .order('sort_order', { ascending: true })
          .limit(6);
        if (fallbackData) setItems(fallbackData);
      }
      setLoading(false);
    }
    fetchFeatured();
  }, []);

  const filtered =
    activeFilter === 'All'
      ? items
      : items.filter((p) => p.category === activeFilter);

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-10">
          <SectionLabel className="mx-auto">Our Work</SectionLabel>
          <h2 className="text-3xl lg:text-5xl font-bold text-brand-textDark mt-2 mb-4">
            Projects We Are Proud Of
          </h2>
          <p className="text-brand-textMid text-lg">
            Real results for real businesses across Bangladesh.
          </p>
        </AnimatedSection>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="group rounded-2xl overflow-hidden border border-brand-border hover:shadow-card-hover transition-shadow duration-300 bg-white"
              >
                <Link href={`/portfolio/${project.slug}`}>
                  <div
                    className="relative h-48 flex items-center justify-center overflow-hidden"
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
                    <h4 className="font-semibold text-brand-textDark mt-2 mb-1 hover:text-brand-blue transition-colors">
                      {project.title}
                    </h4>
                  </Link>
                  <p className="text-brand-textMid text-sm">
                    {project.result_highlight}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {items.length === 0 && !loading && (
          <p className="text-center text-brand-textMid mb-10">
            Featured projects coming soon!
          </p>
        )}

        <div className="text-center">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 bg-brand-navy text-white font-semibold rounded-xl px-8 py-4 hover:bg-brand-blue transition-colors duration-200"
          >
            See All Projects
          </Link>
        </div>
      </div>
    </section>
  );
}
