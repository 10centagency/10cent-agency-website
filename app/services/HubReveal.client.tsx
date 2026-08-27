"use client";

import React, { useEffect, useRef, useState } from 'react';
import styles from './ServicesHub.module.css';

interface HubRevealProps {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  delayMs?: number;
}

export default function HubReveal({
  children,
  className = '',
  threshold = 0.35,
  delayMs = 0,
}: HubRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          if (delayMs > 0) {
            setTimeout(() => {
              setIsInView(true);
            }, delayMs);
          } else {
            setIsInView(true);
          }
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [threshold, delayMs]);

  return (
    <div
      ref={ref}
      className={`${styles.revealItem} ${isInView ? styles.inView : ''} ${className}`}
    >
      {children}
    </div>
  );
}
