"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from './FacebookMetaMkt.module.css';

export default function AnimatedStats() {
  const statsRef = useRef<HTMLDivElement>(null);
  const [counters, setCounters] = useState({
    campaigns: 0,
    growth: 0,
    roas: '0.0',
    retention: 0,
  });

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setCounters({
        campaigns: 150,
        growth: 40,
        roas: '4.5',
        retention: 98,
      });
      return;
    }

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
              campaigns: Math.floor(easeProgress * 150),
              growth: Math.floor(easeProgress * 40),
              roas: (easeProgress * 4.5).toFixed(1),
              retention: Math.floor(easeProgress * 98),
            });

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCounters({
                campaigns: 150,
                growth: 40,
                roas: '4.5',
                retention: 98,
              });
            }
          };

          requestAnimationFrame(animate);
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
    };
  }, []);

  return (
    <div ref={statsRef} className={styles.statsSection}>
      <div className={styles.statsHeader}>
        <span className={styles.statsHeaderTag}>Real Results</span>
        <h2>Our Performance By The Numbers</h2>
        <p>Average results our clients see from their Facebook &amp; Instagram campaigns</p>
      </div>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>
            <span>{counters.campaigns}</span>+
          </div>
          <div className={styles.statLabel}>Campaigns Managed</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>
            <span>{counters.growth}</span>%
          </div>
          <div className={styles.statLabel}>Avg. Engagement Growth</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>
            <span>{counters.roas}</span>x
          </div>
          <div className={styles.statLabel}>Average ROAS</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>
            <span>{counters.retention}</span>%
          </div>
          <div className={styles.statLabel}>Client Retention Rate</div>
        </div>
      </div>

      <div className={styles.donutWrap}>
        <div className={styles.donut}>
          <div className={styles.donutInner}>
            <strong>65%</strong>
            <span>Budget → Ads</span>
          </div>
        </div>
        <div className={styles.donutLegend}>
          <h4>Ad Budget Allocation (Sample)</h4>
          <p>
            On average, 65% of the ad budget goes to conversion-focused campaigns,
            with the rest split between retargeting and awareness — maximizing your
            return on investment.
          </p>
        </div>
      </div>
    </div>
  );
}
