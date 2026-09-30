"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from './GraphicDesign.module.css';
import { statsCountersData, donutStatData } from './graphicDesignData';

export default function GdStats() {
  const statsRef = useRef<HTMLDivElement>(null);
  const [counters, setCounters] = useState({
    delivered: statsCountersData.delivered,
    brands: statsCountersData.brands,
    firstDraft: statsCountersData.firstDraft,
    satisfaction: statsCountersData.satisfaction,
  });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setCounters({
        delivered: statsCountersData.delivered,
        brands: statsCountersData.brands,
        firstDraft: statsCountersData.firstDraft,
        satisfaction: statsCountersData.satisfaction,
      });
      return;
    }

    // Reset to 0 on client mount before intersection animation
    setCounters({
      delivered: 0,
      brands: 0,
      firstDraft: 0,
      satisfaction: 0,
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
              delivered: Math.floor(easeProgress * statsCountersData.delivered),
              brands: Math.floor(easeProgress * statsCountersData.brands),
              firstDraft: Math.floor(easeProgress * statsCountersData.firstDraft),
              satisfaction: Math.floor(easeProgress * statsCountersData.satisfaction),
            });

            if (progress < 1) {
              rafId = requestAnimationFrame(animate);
            } else {
              setCounters({
                delivered: statsCountersData.delivered,
                brands: statsCountersData.brands,
                firstDraft: statsCountersData.firstDraft,
                satisfaction: statsCountersData.satisfaction,
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
        <p>Design work delivered for businesses across Bangladesh</p>
      </div>

      <div ref={statsRef} className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>
            <span>{counters.delivered}</span>+
          </div>
          <div className={styles.statLabel}>Designs Delivered</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statNumber}>
            <span>{counters.brands}</span>+
          </div>
          <div className={styles.statLabel}>Brands Built</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statNumber}>
            <span>{counters.firstDraft}</span> hrs
          </div>
          <div className={styles.statLabel}>Social post first draft</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statNumber}>
            <span>{counters.satisfaction}</span>%
          </div>
          <div className={styles.statLabel}>Client Satisfaction Rate</div>
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
