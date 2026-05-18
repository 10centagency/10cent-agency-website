'use client';

import AnimatedSection from '@/components/ui/AnimatedSection';
import { ContentBlock } from '@/lib/database.types';
import { ExternalLink } from 'lucide-react';
import ImageLightbox from '@/components/ui/ImageLightbox';
import RichTextContent from '@/components/RichTextContent';

interface ProjectContentProps {
  contentBlocks: ContentBlock[];
}

export default function ProjectContent({ contentBlocks }: ProjectContentProps) {
  if (!contentBlocks || contentBlocks.length === 0) return null;

  const sorted = [...contentBlocks].sort((a, b) => a.order - b.order);

  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {sorted.map((block) => {
          if (block.type === 'text') {
            return (
              <AnimatedSection key={block.id}>
                {block.heading && (
                  <h2 className="text-2xl lg:text-3xl font-bold text-brand-textDark mb-4">
                    {block.heading}
                  </h2>
                )}
                <RichTextContent html={block.content} />
              </AnimatedSection>
            );
          }

          if (block.type === 'image') {
            return (
              <AnimatedSection key={block.id}>
                {block.link_url ? (
                  <div className="relative group">
                    <a
                      href={block.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block relative"
                    >
                      <img
                        src={block.image_url}
                        alt={block.caption || 'Project image'}
                        className="w-full rounded-xl object-cover max-h-[500px]"
                      />
                      <div className="absolute inset-0 bg-brand-navy/70 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="flex items-center gap-2 text-white font-medium">
                          <ExternalLink className="w-5 h-5" />
                          <span>Visit</span>
                        </div>
                      </div>
                    </a>
                    {block.caption && (
                      <p className="text-sm text-brand-textMid mt-2 text-center italic">
                        {block.caption}
                      </p>
                    )}
                  </div>
                ) : (
                  <ImageLightbox
                    src={block.image_url}
                    alt={block.caption || 'Project image'}
                    caption={block.caption}
                    className="object-cover max-h-[500px]"
                  />
                )}
              </AnimatedSection>
            );
          }

          return null;
        })}
      </div>
    </section>
  );
}
