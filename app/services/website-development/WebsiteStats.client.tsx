"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from './WebsiteDevelopment.module.css';

export default function WebsiteStats() {
  const statsRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);
  const [counters, setCounters] = useState({
    websites: 0,
    pagespeed: 0,
    leads: 0,
    satisfaction: 0,
  });

  useEffect(() => {
    let isMounted = true;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setCounters({
        websites: 10,
        pagespeed: 90,
        leads: 55,
        satisfaction: 98,
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
            if (!isMounted) return;

            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);

            setCounters({
              websites: Math.floor(easeProgress * 10),
              pagespeed: Math.floor(easeProgress * 90),
              leads: Math.floor(easeProgress * 55),
              satisfaction: Math.floor(easeProgress * 98),
            });

            if (progress < 1) {
              rafIdRef.current = requestAnimationFrame(animate);
            } else {
              setCounters({
                websites: 10,
                pagespeed: 90,
                leads: 55,
                satisfaction: 98,
              });
            }
          };

          rafIdRef.current = requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      isMounted = false;
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={statsRef} className={styles.statsSection}>
      <div className={styles.statsHeader}>
        <span className={styles.statsHeaderTag}>Real Results</span>
        <h2>Our Performance By The Numbers</h2>
        <p>Average results our clients see after launching a new website with us</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>
            <span>{counters.websites}</span>+
          </div>
          <div className={styles.statLabel}>Websites Delivered</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>
            <span>{counters.pagespeed}</span>+
          </div>
          <div className={styles.statLabel}>Avg. PageSpeed Score</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>
            <span>{counters.leads}</span>%
          </div>
          <div className={styles.statLabel}>Avg. Increase in Leads</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>
            <span>{counters.satisfaction}</span>%
          </div>
          <div className={styles.statLabel}>Client Satisfaction Rate</div>
        </div>
      </div>

      <div className={styles.donutWrap}>
        <div className={styles.donut}>
          <div className={styles.donutInner}>
            <strong>72%</strong>
            <span>Mobile Traffic</span>
          </div>
        </div>
        <div className={styles.donutLegend}>
          <h4>Where Your Visitors Come From (Sample)</h4>
          <p>
            On average, 72% of visitors to our clients&apos; websites arrive from mobile
            devices — which is exactly why we design mobile-first, not desktop-first.
          </p>
        </div>
      </div>
    </div>
  );
}
