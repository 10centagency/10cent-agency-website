"use client";

import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
import styles from './AboutSections.module.css';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

interface AbRevealProps {
  children: React.ReactNode;
  variant?: 'fadeUp' | 'slideLeft' | 'slideRight' | 'pop';
  className?: string;
  delay?: string;
  threshold?: number;
  style?: React.CSSProperties;
}

export default function AbReveal({
  children,
  variant = 'fadeUp',
  className = '',
  delay = '0s',
  threshold = 0.15,
  style = {},
}: AbRevealProps) {
  // Initial state is true for SSR HTML safety
  const [isInView, setIsInView] = useState(true);
  const elRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      return;
    }

    // Set false on client hydration to arm animation
    setIsInView(false);

    const el = elRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -20px 0px' }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  const variantClass = styles[variant] || styles.fadeUp;

  const combinedStyle = {
    ...style,
    '--delay': delay,
  } as React.CSSProperties;

  return (
    <div
      ref={elRef}
      className={`${variantClass} ${isInView ? styles.visible : ''} ${className}`}
      style={combinedStyle}
    >
      {children}
    </div>
  );
}
