"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FaArrowRightLong, FaCircleInfo } from 'react-icons/fa6';
import styles from './GoogleAds.module.css';
import { beforeAfterData } from './googleAdsData';

export default function GaBeforeAfter() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isReduced = reducedMotionQuery.matches;
    setPrefersReducedMotion(isReduced);

    if (isReduced) {
      setHasAnimated(true);
      return;
    }

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

    if (gridRef.current) {
      observer.observe(gridRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const getMetricWidth = (finalWidth: string) => {
    if (!isMounted || prefersReducedMotion || hasAnimated) {
      return finalWidth;
    }
    return '0%';
  };

  return (
    <>
      <div ref={gridRef} className={styles.baGrid}>
        {/* Month 1 — Before Card */}
        <div className={`${styles.baCard} ${styles.baBefore}`}>
          <div className={styles.baBadge}>{beforeAfterData.before.badge}</div>
          <h4>{beforeAfterData.before.title}</h4>
          {beforeAfterData.before.metrics.map((metric, idx) => (
            <div key={idx} className={styles.baMetric}>
              <div className={styles.baMetricTop}>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
              </div>
              <div className={styles.baBarTrack}>
                <div
                  className={`${styles.baBarFill} ${styles.baBarFillBad}`}
                  style={{
                    width: getMetricWidth(metric.width),
                    transitionDelay: hasAnimated ? `${idx * 100}ms` : '0ms',
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Center Indicator Arrow */}
        <div className={styles.baArrow}>
          <FaArrowRightLong className={styles.baArrowIcon} aria-hidden="true" />
          <span>{beforeAfterData.arrowText}</span>
        </div>

        {/* Month 3 — After Card */}
        <div className={`${styles.baCard} ${styles.baAfter}`}>
          <div className={`${styles.baBadge} ${styles.baBadgeGood}`}>
            {beforeAfterData.after.badge}
          </div>
          <h4>{beforeAfterData.after.title}</h4>
          {beforeAfterData.after.metrics.map((metric, idx) => (
            <div key={idx} className={styles.baMetric}>
              <div className={styles.baMetricTop}>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
              </div>
              <div className={styles.baBarTrack}>
                <div
                  className={`${styles.baBarFill} ${styles.baBarFillGood}`}
                  style={{
                    width: getMetricWidth(metric.width),
                    transitionDelay: hasAnimated ? `${idx * 100 + 150}ms` : '0ms',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Caption with baseline-aligned info icon */}
      <p className={styles.caption} style={{ marginTop: '24px' }}>
        <FaCircleInfo className={styles.captionIcon} aria-hidden="true" />
        <span>{beforeAfterData.caption}</span>
      </p>
    </>
  );
}
