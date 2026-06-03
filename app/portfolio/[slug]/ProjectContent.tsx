'use client';

import AnimatedSection from '@/components/ui/AnimatedSection';
import { ContentBlock } from '@/lib/database.types';
import ContentBlockRenderer from '@/components/portfolio/ContentBlockRenderer';

interface ProjectContentProps {
  contentBlocks: ContentBlock[];
}

export default function ProjectContent({ contentBlocks }: ProjectContentProps) {
  if (!contentBlocks || contentBlocks.length === 0) return null;

  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <ContentBlockRenderer blocks={contentBlocks} />
        </AnimatedSection>
      </div>
    </section>
  );
}
