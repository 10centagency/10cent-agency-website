"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from './SocialMediaManagement.module.css';

export default function SMMStats() {
  const statsRef = useRef<HTMLDivElement>(null);
  const [counters, setCounters] = useState({
    pages: 30,
    growth: 45,
    platforms: 5,
    retention: 95,
  });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setCounters({
        pages: 30,
        growth: 45,
        platforms: 5,
        retention: 95,
      });
      return;
    }

    // Reset to 0 on client mount before intersection animation
    setCounters({
      pages: 0,
      growth: 0,
      platforms: 0,
      retention: 0,
    });

    let rafId: number | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          const duration = 1200;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);

            setCounters({
              pages: Math.floor(easeProgress * 30),
              growth: Math.floor(easeProgress * 45),
              platforms: Math.floor(easeProgress * 5),
              retention: Math.floor(easeProgress * 95),
            });

            if (progress < 1) {
              rafId = requestAnimationFrame(animate);
            } else {
              setCounters({
                pages: 30,
                growth: 45,
                platforms: 5,
                retention: 95,
              });
            }
          };

          rafId = requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      observer.disconnect();
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <div ref={statsRef} className={styles.statsGrid}>
      <div className={styles.statCard}>
        <div className={styles.statNumber}>
          <span>{counters.pages}</span>+
        </div>
        <div className={styles.statLabel}>Social Pages Managed</div>
      </div>

      <div className={styles.statCard}>
        <div className={styles.statNumber}>
          <span>{counters.growth}</span>%
        </div>
        <div className={styles.statLabel}>Avg. Engagement Growth</div>
      </div>

      <div className={styles.statCard}>
        <div className={styles.statNumber}>
          <span>{counters.platforms}</span>+
        </div>
        <div className={styles.statLabel}>Platforms Managed Per Client (Avg.)</div>
      </div>

      <div className={styles.statCard}>
        <div className={styles.statNumber}>
          <span>{counters.retention}</span>%
        </div>
        <div className={styles.statLabel}>Client Retention Rate</div>
      </div>
    </div>
  );
}
