'use client';

import AnimatedSection from '@/components/ui/AnimatedSection';
import { ContentBlock } from '@/lib/database.types';
import ContentBlockRenderer from '@/components/portfolio/ContentBlockRenderer';

interface ProjectContentProps {
  contentBlocks: ContentBlock[];
  contentHtml?: string;
}

export default function ProjectContent({ contentBlocks, contentHtml }: ProjectContentProps) {
  if (!contentHtml && (!contentBlocks || contentBlocks.length === 0)) return null;

  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          {contentHtml ? (
            // NEW editor output — every node carries its own Tailwind classes; do NOT add
            // `prose` here or styles double up.
            <div className="doc-content" dangerouslySetInnerHTML={{ __html: contentHtml }} />
          ) : (
            // FALLBACK: old projects that have not been migrated yet
            <ContentBlockRenderer blocks={contentBlocks} />
          )}
        </AnimatedSection>
      </div>
    </section>
  );
}
