'use client';

import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
import styles from '../HomeSections.module.css';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

interface HomeSectionRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: string;
  threshold?: number;
  style?: React.CSSProperties;
}

export default function HomeSectionReveal({
  children,
  className = '',
  delay = '0s',
  threshold = 0.35,
  style = {},
}: HomeSectionRevealProps) {
  const [isInView, setIsInView] = useState(true);
  const elRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      return;
    }

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
      { threshold }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  const combinedStyle = {
    ...style,
    '--d': delay,
  } as React.CSSProperties;

  return (
    <div
      ref={elRef}
      className={`${styles.reveal} ${isInView ? styles.in : ''} ${className}`}
      style={combinedStyle}
    >
      {children}
    </div>
  );
}
