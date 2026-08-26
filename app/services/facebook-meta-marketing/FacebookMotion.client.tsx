'use client';

import { useEffect } from 'react';

export default function FacebookMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('[data-fb-page-root]');
    if (!root) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (mediaQuery.matches) {
      return;
    }

    const progressTargets = Array.from(
      root.querySelectorAll<HTMLElement>('[data-progress-animation]')
    );
    const stepTargets = Array.from(
      root.querySelectorAll<HTMLElement>('[data-timeline-step]')
    );
    const trustSealTargets = Array.from(
      root.querySelectorAll<HTMLElement>('[data-trust-seal]')
    );
    const promiseCardTargets = Array.from(
      root.querySelectorAll<HTMLElement>('[data-promise-card]')
    );
    const promiseItemTargets = Array.from(
      root.querySelectorAll<HTMLElement>('[data-promise-item]')
    );

    // Enable page-scoped motion
    root.setAttribute('data-fb-motion-enabled', 'true');

    // Observer for progress cards (threshold: 0.4)
    const progressObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            target.setAttribute('data-visible', 'true');
            progressObserver.unobserve(target);
          }
        });
      },
      { threshold: 0.4 }
    );

    // Observer for individual timeline steps (threshold: 0.35)
    const stepObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            target.setAttribute('data-visible', 'true');
            stepObserver.unobserve(target);
          }
        });
      },
      { threshold: 0.35 }
    );

    // Observer for trust seals (threshold: 0.25)
    const trustSealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            target.setAttribute('data-visible', 'true');
            trustSealObserver.unobserve(target);
          }
        });
      },
      { threshold: 0.25 }
    );

    // Observer for promise card & items (threshold: 0.25)
    const promiseObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            target.setAttribute('data-visible', 'true');
            promiseObserver.unobserve(target);
          }
        });
      },
      { threshold: 0.25 }
    );

    progressTargets.forEach((target) => {
      progressObserver.observe(target);
    });

    stepTargets.forEach((target) => {
      stepObserver.observe(target);
    });

    trustSealTargets.forEach((target) => {
      trustSealObserver.observe(target);
    });

    promiseCardTargets.forEach((target) => {
      promiseObserver.observe(target);
    });

    promiseItemTargets.forEach((target) => {
      promiseObserver.observe(target);
    });

    const allTargets = [
      ...progressTargets,
      ...stepTargets,
      ...trustSealTargets,
      ...promiseCardTargets,
      ...promiseItemTargets,
    ];

    const handleMotionChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        allTargets.forEach((target) => {
          target.setAttribute('data-visible', 'true');
        });
        root.removeAttribute('data-fb-motion-enabled');
        progressObserver.disconnect();
        stepObserver.disconnect();
        trustSealObserver.disconnect();
        promiseObserver.disconnect();
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMotionChange);
    } else {
      mediaQuery.addListener(handleMotionChange);
    }

    return () => {
      progressObserver.disconnect();
      stepObserver.disconnect();
      trustSealObserver.disconnect();
      promiseObserver.disconnect();
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMotionChange);
      } else {
        mediaQuery.removeListener(handleMotionChange);
      }
    };
  }, []);

  return null;
}
