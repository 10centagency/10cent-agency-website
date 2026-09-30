"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaGoogle,
} from 'react-icons/fa6';
import styles from './SocialMediaManagement.module.css';
import { calendarDayChipsData } from './socialMediaData';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaGoogle,
};

export default function SMMCalendarChips() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isReduced = reducedMotionQuery.matches;
    setPrefersReducedMotion(isReduced);

    if (isReduced) {
      setIsMounted(true);
      setHasAnimated(true);
      return;
    }

    setIsMounted(true);

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.smCalendarGrid}>
      {calendarDayChipsData.map((chip, idx) => {
        const IconComponent = iconMap[chip.iconKey] || FaFacebookF;
        const chipColorClass = styles[chip.chipClass] || styles.chipFb;

        // SSR / no-JS / reduced-motion: fully visible.
        // Client before scroll: hidden (-24px).
        // Client on view: animate to visible with stagger.
        const shouldAnimate = isMounted && !prefersReducedMotion;
        const isVisible = !shouldAnimate || hasAnimated;

        return (
          <div
            key={chip.day}
            className={`${styles.smDay} ${isVisible ? styles.smDayIn : ''}`}
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(-24px)',
              transition: shouldAnimate
                ? `opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1), transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)`
                : 'none',
              transitionDelay: hasAnimated && shouldAnimate ? `${idx * 80}ms` : '0ms',
            }}
          >
            <div className={styles.smDayLabel}>{chip.day}</div>
            <div className={`${styles.smPostChip} ${chipColorClass}`}>
              <IconComponent aria-hidden="true" />
              <span>{chip.platform}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
