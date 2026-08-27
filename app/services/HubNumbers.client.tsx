"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from './ServicesHub.module.css';
import { numbersStripData, iconMap } from './servicesData';
import { FaChartLine } from 'react-icons/fa6';

export default function HubNumbers() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [counts, setCounts] = useState<number[]>([150, 20, 85, 7]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setCounts([150, 20, 85, 7]);
      return;
    }

    // Reset counters to 0 for initial interactive state
    setCounts([0, 0, 0, 0]);

    let rafId: number | null = null;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          const duration = 1400;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);

            setCounts([
              Math.floor(ease * 150),
              Math.floor(ease * 20),
              Math.floor(ease * 85),
              Math.floor(ease * 7),
            ]);

            if (progress < 1) {
              rafId = requestAnimationFrame(animate);
            } else {
              setCounts([150, 20, 85, 7]);
            }
          };

          rafId = requestAnimationFrame(animate);
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
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.numbersGrid}>
      {numbersStripData.map((stat, idx) => {
        const StatIcon = iconMap[stat.icon] || FaChartLine;
        const displayValue = counts[idx] ?? stat.target;

        return (
          <div key={idx} className={styles.numItem}>
            <div className={styles.numBig}>
              {displayValue}
              {stat.suffix}
            </div>
            <div className={styles.numLbl}>
              <StatIcon aria-hidden="true" />
              <span>{stat.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
