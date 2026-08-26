"use client";

import { useEffect } from 'react';

export default function AIOverviewMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('[data-ai-page-root]');
    if (!root) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const getTargets = () => {
      return Array.from(
        root.querySelectorAll<HTMLElement>(
          '[data-progress-animation]'
        )
      );
    };

    if (mediaQuery.matches) {
      return;
    }

    const targets = getTargets();
    if (targets.length === 0) return;

    // Enable page-scoped motion
    root.setAttribute('data-ai-motion-enabled', 'true');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            target.setAttribute('data-visible', 'true');
            observer.unobserve(target);
          }
        });
      },
      {
        threshold: 0.4,
      }
    );

    targets.forEach((target) => {
      observer.observe(target);
    });

    const handleMotionChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        targets.forEach((target) => {
          target.setAttribute('data-visible', 'true');
        });
        root.removeAttribute('data-ai-motion-enabled');
        observer.disconnect();
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMotionChange);
    } else {
      mediaQuery.addListener(handleMotionChange);
    }

    return () => {
      observer.disconnect();
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMotionChange);
      } else {
        mediaQuery.removeListener(handleMotionChange);
      }
    };
  }, []);

  return null;
}
