import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ArrowLeft, ExternalLink } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import SectionLabel from '@/components/ui/SectionLabel';
import AnimatedSection from '@/components/ui/AnimatedSection';
import CTABanner from '@/components/home/CTABanner';
import ProjectContent from './ProjectContent';
import ImageLightbox from '@/components/ui/ImageLightbox';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const supabase = createServerSupabaseClient();
  const { data: items } = await supabase
    .from('portfolio_items')
    .select('slug')
    .eq('status', 'published');

  return (items || []).map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createServerSupabaseClient();
  const { data: item } = await supabase
    .from('portfolio_items')
    .select('title, result_highlight, category')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .maybeSingle();

  if (!item) {
    return { title: 'Project Not Found' };
  }

  return {
    title: item.title,
    description: `${item.category} project — ${item.result_highlight}`,
  };
}

export default async function ProjectPage({ params }: Props) {
  const supabase = createServerSupabaseClient();
  const { data: item } = await supabase
    .from('portfolio_items')
    .select('*')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .maybeSingle();

  if (!item) notFound();

  const categoryColors: Record<string, string> = {
    Meta: 'bg-blue-100 text-blue-700',
    Website: 'bg-sky-100 text-sky-700',
    Design: 'bg-rose-100 text-rose-700',
    Automation: 'bg-green-100 text-green-700',
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-bgAlt pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-brand-textMid mb-8">
            <Link href="/" className="hover:text-brand-blue transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              href="/portfolio"
              className="hover:text-brand-blue transition-colors"
            >
              Portfolio
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-brand-textDark font-medium">{item.title}</span>
          </div>

          <AnimatedSection>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                categoryColors[item.category] || 'bg-gray-100 text-gray-700'
              }`}
            >
              {item.category}
            </span>
            <h1 className="text-4xl lg:text-5xl font-black text-brand-textDark mt-3 mb-4">
              {item.title}
            </h1>
            <p className="text-brand-textMid text-lg leading-relaxed">
              {item.result_highlight}
            </p>

            {item.client_name && (
              <p className="text-sm text-brand-textMid mt-3">
                Client: {item.client_name}
              </p>
            )}

            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {item.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="text-xs font-medium px-2.5 py-1 rounded-full bg-white border border-brand-border text-brand-textMid"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </AnimatedSection>
        </div>
      </section>

      {/* Featured Image */}
      {item.featured_image_url && (
        <section className="bg-white py-8">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              {item.featured_image_link ? (
                <a
                  href={item.featured_image_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative group"
                >
                  <img
                    src={item.featured_image_url}
                    alt={item.title}
                    className="w-full h-64 sm:h-80 lg:h-[420px] object-cover rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-brand-navy/70 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex items-center gap-2 text-white font-medium">
                      <ExternalLink className="w-5 h-5" />
                      <span>Visit</span>
                    </div>
                  </div>
                </a>
              ) : (
                <img
                  src={item.featured_image_url}
                  alt={item.title}
                  className="w-full h-64 sm:h-80 lg:h-[420px] object-cover rounded-2xl"
                />
              )}
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Content Blocks */}
      <ProjectContent
        contentBlocks={item.content_blocks as import('@/lib/database.types').ContentBlock[]}
      />

      {/* Back link */}
      <section className="bg-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-textMid hover:text-brand-blue transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </Link>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
