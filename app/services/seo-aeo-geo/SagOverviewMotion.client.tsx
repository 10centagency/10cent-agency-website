"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  FaChartSimple,
  FaArrowPointer,
  FaRobot,
  FaArrowTrendUp,
} from 'react-icons/fa6';
import styles from './SeoAeoGeo.module.css';
import { overviewBarsData, overviewCompareData } from './seoAeoGeoData';

export default function SagOverviewMotion() {
  const cardARef = useRef<HTMLDivElement>(null);
  const cardDRef = useRef<HTMLDivElement>(null);

  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [hasAnimatedA, setHasAnimatedA] = useState<boolean>(false);
  const [hasAnimatedD, setHasAnimatedD] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isReduced = reducedMotionQuery.matches;
    setPrefersReducedMotion(isReduced);

    if (isReduced) {
      setIsMounted(true);
      setHasAnimatedA(true);
      setHasAnimatedD(true);
      return;
    }

    setIsMounted(true);

    // Separate Observer for Card A (Where Users Get Their Answers) - threshold: 0.4
    const observerA = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setHasAnimatedA(true);
          observerA.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    // Separate Observer for Card D (Brand Visibility Impact) - threshold: 0.4
    const observerD = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setHasAnimatedD(true);
          observerD.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    if (cardARef.current) {
      observerA.observe(cardARef.current);
    }
    if (cardDRef.current) {
      observerD.observe(cardDRef.current);
    }

    return () => {
      observerA.disconnect();
      observerD.disconnect();
    };
  }, []);

  const getBarWidthA = (finalWidth: string) => {
    if (!isMounted || prefersReducedMotion || hasAnimatedA) {
      return finalWidth;
    }
    return '0%';
  };

  const getBarWidthD = (finalWidth: string) => {
    if (!isMounted || prefersReducedMotion || hasAnimatedD) {
      return finalWidth;
    }
    return '0%';
  };

  return (
    <div className={styles.ovDashboard}>
      {/* Card A: Where Users Get Their Answers Today (Wide) */}
      <div ref={cardARef} className={`${styles.ovCard} ${styles.ovCardWide}`}>
        <div className={styles.ovCardTitle}>
          <FaChartSimple className={styles.ovCardTitleIcon} aria-hidden="true" />
          Where Users Get Their Answers Today
        </div>
        {overviewBarsData.map((bar, idx) => (
          <div key={idx} className={styles.ovBarRow}>
            <div className={styles.ovBarTop}>
              <span>{bar.label}</span>
              <strong>{bar.rate}</strong>
            </div>
            <div className={styles.ovBarTrack}>
              <div
                className={styles.ovBarFill}
                style={{
                  width: getBarWidthA(bar.width),
                  transitionDelay: hasAnimatedA ? `${idx * 120}ms` : '0ms',
                }}
              />
            </div>
          </div>
        ))}
        <div className={styles.ovSource}>Source: Industry search behavior benchmark data</div>
      </div>

      {/* Card B: Big Stat (60%+) */}
      <div className={styles.ovCard}>
        <div className={styles.ovBigStat}>
          <div className={styles.ovBigIcon}>
            <FaArrowPointer aria-hidden="true" />
          </div>
          <div className={styles.ovBigNum}>60%+</div>
          <div className={styles.ovBigLabel}>Of searches now end without a single click</div>
        </div>
      </div>

      {/* Card C: Big Stat (1B+) */}
      <div className={styles.ovCard}>
        <div className={styles.ovBigStat}>
          <div className={styles.ovBigIcon}>
            <FaRobot aria-hidden="true" />
          </div>
          <div className={styles.ovBigNum}>1B+</div>
          <div className={styles.ovBigLabel}>Monthly queries now go through AI chatbots</div>
        </div>
      </div>

      {/* Card D: Brand Visibility Impact (Wide) */}
      <div ref={cardDRef} className={`${styles.ovCard} ${styles.ovCardWide}`}>
        <div className={styles.ovCardTitle}>
          <FaArrowTrendUp className={styles.ovCardTitleIcon} aria-hidden="true" />
          Brand Visibility Impact
        </div>
        <div className={styles.ovCompareRow}>
          <div className={styles.ovCompareLabel}>
            <span>{overviewCompareData.without.label}</span>
            <span>{overviewCompareData.without.sub}</span>
          </div>
          <div className={styles.ovCompareTrack}>
            <div
              className={`${styles.ovCompareFill} ${styles.ovCompareFillWithout}`}
              style={{
                width: getBarWidthD(overviewCompareData.without.width),
                transitionDelay: hasAnimatedD ? '0ms' : '0ms',
              }}
            >
              <span>{overviewCompareData.without.innerText}</span>
            </div>
          </div>
        </div>
        <div className={styles.ovCompareRow}>
          <div className={styles.ovCompareLabel}>
            <span>{overviewCompareData.with.label}</span>
            <span>{overviewCompareData.with.sub}</span>
          </div>
          <div className={styles.ovCompareTrack}>
            <div
              className={`${styles.ovCompareFill} ${styles.ovCompareFillWith}`}
              style={{
                width: getBarWidthD(overviewCompareData.with.width),
                transitionDelay: hasAnimatedD ? '140ms' : '0ms',
              }}
            >
              <span>{overviewCompareData.with.innerText}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
