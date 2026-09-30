"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FaChartColumn } from 'react-icons/fa6';
import styles from './SocialMediaManagement.module.css';
import { reportPlatformBars } from './socialMediaData';

export default function SMMReportBars() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isReduced = reducedMotionQuery.matches;
    setPrefersReducedMotion(isReduced);

    if (isReduced) {
      setIsMounted(true);
      setHasAnimated(true);
      return;
    }

    setIsMounted(true);

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const getBarWidth = (finalWidth: string) => {
    if (!isMounted || prefersReducedMotion || hasAnimated) {
      return finalWidth;
    }
    return '0%';
  };

  return (
    <div ref={cardRef} className={styles.reportChartCard}>
      <div className={styles.rcTitle}>
        <FaChartColumn aria-hidden="true" />
        Platform-wise Performance
      </div>
      {reportPlatformBars.map((bar, idx) => (
        <div key={bar.platform} className={styles.rcBar}>
          <span>{bar.platform}</span>
          <div className={styles.rcTrack}>
            <div
              className={styles.rcFill}
              style={{
                width: getBarWidth(bar.width),
                backgroundColor: bar.color,
                transitionDelay: hasAnimated ? `${idx * 90}ms` : '0ms',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
