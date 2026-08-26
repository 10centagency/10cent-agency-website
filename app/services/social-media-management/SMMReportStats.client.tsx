"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FaArrowTrendUp } from 'react-icons/fa6';
import styles from './SocialMediaManagement.module.css';

export default function SMMReportStats() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState({
    followers: 1240,
    reach: 86.4,
    engagement: 5.8,
    posts: 24,
  });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setStats({
        followers: 1240,
        reach: 86.4,
        engagement: 5.8,
        posts: 24,
      });
      return;
    }

    // Reset to 0 on client mount before intersection animation
    setStats({
      followers: 0,
      reach: 0,
      engagement: 0,
      posts: 0,
    });

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
            const easeProgress = 1 - Math.pow(1 - progress, 3);

            setStats({
              followers: Math.floor(easeProgress * 1240),
              reach: Number((easeProgress * 86.4).toFixed(1)),
              engagement: Number((easeProgress * 5.8).toFixed(1)),
              posts: Math.floor(easeProgress * 24),
            });

            if (progress < 1) {
              rafId = requestAnimationFrame(animate);
            } else {
              setStats({
                followers: 1240,
                reach: 86.4,
                engagement: 5.8,
                posts: 24,
              });
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
    <div ref={containerRef} className={styles.reportStatsGrid}>
      <div className={styles.reportStat}>
        <span className={styles.rsLabel}>Followers Growth</span>
        <span className={`${styles.rsValue} ${styles.rsValueUp}`}>
          +{stats.followers.toLocaleString()} <FaArrowTrendUp aria-hidden="true" />
        </span>
      </div>
      <div className={styles.reportStat}>
        <span className={styles.rsLabel}>Total Reach</span>
        <span className={`${styles.rsValue} ${styles.rsValueUp}`}>
          {stats.reach.toFixed(1)}K <FaArrowTrendUp aria-hidden="true" />
        </span>
      </div>
      <div className={styles.reportStat}>
        <span className={styles.rsLabel}>Engagement Rate</span>
        <span className={`${styles.rsValue} ${styles.rsValueUp}`}>
          {stats.engagement.toFixed(1)}% <FaArrowTrendUp aria-hidden="true" />
        </span>
      </div>
      <div className={styles.reportStat}>
        <span className={styles.rsLabel}>Posts Published</span>
        <span className={styles.rsValue}>{stats.posts} / 24</span>
      </div>
    </div>
  );
}
