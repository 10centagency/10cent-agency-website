"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from './GoogleAds.module.css';
import { statsNumbers, statsDonut } from './googleAdsData';

export default function GaStats() {
  const statsRef = useRef<HTMLDivElement>(null);
  const [counters, setCounters] = useState<{ [key: number]: number }>({
    0: 25,
    1: 38,
    2: 4,
    3: 95,
  });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setCounters({
        0: 25,
        1: 38,
        2: 4,
        3: 95,
      });
      return;
    }

    // Reset on client before scroll trigger
    setCounters({
      0: 0,
      1: 0,
      2: 0,
      3: 0,
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
            const easeProgress = 1 - Math.pow(1 - progress, 3);

            setCounters({
              0: Math.floor(easeProgress * 25),
              1: Math.floor(easeProgress * 38),
              2: Math.floor(easeProgress * 4),
              3: Math.floor(easeProgress * 95),
            });

            if (progress < 1) {
              rafId = requestAnimationFrame(animate);
            } else {
              setCounters({
                0: 25,
                1: 38,
                2: 4,
                3: 95,
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
    <div className={styles.statsSection}>
      <div className={styles.statsHeader}>
        <span className={styles.sectionTag}>Real Results</span>
        <h2>Our Performance By The Numbers</h2>
        <p>Average results our clients see after handing over their Google Ads accounts</p>
      </div>

      <div ref={statsRef} className={styles.statsGrid}>
        {statsNumbers.map((stat, idx) => (
          <div key={idx} className={styles.statCard}>
            <div className={styles.statNumber}>
              <span>{counters[idx] ?? stat.target}</span>
              {stat.suffix}
            </div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div className={styles.donutWrap}>
        <div className={styles.donut}>
          <div className={styles.donutInner}>
            <strong>{statsDonut.percentage}</strong>
            <span>{statsDonut.label}</span>
          </div>
        </div>
        <div className={styles.donutLegend}>
          <h4>{statsDonut.title}</h4>
          <p>{statsDonut.description}</p>
        </div>
      </div>
    </div>
  );
}
