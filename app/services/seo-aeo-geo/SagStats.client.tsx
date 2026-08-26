"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from './SeoAeoGeo.module.css';
import { statsCountersData, donutStatData } from './seoAeoGeoData';

export default function SagStats() {
  const statsRef = useRef<HTMLDivElement>(null);
  const [counters, setCounters] = useState({
    ranked: 15,
    traffic: 75,
    snippets: 30,
    retention: 95,
  });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setCounters({
        ranked: 15,
        traffic: 75,
        snippets: 30,
        retention: 95,
      });
      return;
    }

    // Reset to 0 on client mount before intersection animation
    setCounters({
      ranked: 0,
      traffic: 0,
      snippets: 0,
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
              ranked: Math.floor(easeProgress * 15),
              traffic: Math.floor(easeProgress * 75),
              snippets: Math.floor(easeProgress * 30),
              retention: Math.floor(easeProgress * 95),
            });

            if (progress < 1) {
              rafId = requestAnimationFrame(animate);
            } else {
              setCounters({
                ranked: 15,
                traffic: 75,
                snippets: 30,
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
    <div className={styles.statsSection}>
      <div className={styles.statsHeader}>
        <span className={styles.sectionTag}>Real Results</span>
        <h2>Our Performance By The Numbers</h2>
        <p>Average results our clients see after launching a full SEO + AEO + GEO strategy</p>
      </div>

      <div ref={statsRef} className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>
            <span>{counters.ranked}</span>+
          </div>
          <div className={styles.statLabel}>Websites Ranked</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statNumber}>
            <span>{counters.traffic}</span>%
          </div>
          <div className={styles.statLabel}>Avg. Organic Traffic Increase</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statNumber}>
            <span>{counters.snippets}</span>+
          </div>
          <div className={styles.statLabel}>Featured Snippets Won</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statNumber}>
            <span>{counters.retention}</span>%
          </div>
          <div className={styles.statLabel}>Client Retention Rate</div>
        </div>
      </div>

      {/* Donut Chart & Legend */}
      <div className={styles.donutWrap}>
        <div className={styles.donut}>
          <div className={styles.donutInner}>
            <strong>{donutStatData.percentage}%</strong>
            <span>{donutStatData.innerLabel}</span>
          </div>
        </div>
        <div className={styles.donutLegend}>
          <h4>{donutStatData.legendTitle}</h4>
          <p>{donutStatData.legendParagraph}</p>
        </div>
      </div>
    </div>
  );
}
