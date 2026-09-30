"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  FaChartSimple,
  FaLayerGroup,
  FaClock,
  FaArrowTrendUp,
} from 'react-icons/fa6';
import styles from './SocialMediaManagement.module.css';
import { overviewEngagementBars, overviewCompareBars } from './socialMediaData';

export default function SMMOverviewMotion() {
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

    // Separate Observer for Card A (Engagement Bars) - threshold: 0.4
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

    // Separate Observer for Card D (Consistency Compare Bars) - threshold: 0.4
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
      {/* Card A: Average Engagement Rate by Content Type (Wide) */}
      <div ref={cardARef} className={`${styles.ovCard} ${styles.ovCardWide}`}>
        <div className={styles.ovCardTitle}>
          <FaChartSimple className={styles.ovCardTitleIcon} aria-hidden="true" />
          Average Engagement Rate by Content Type
        </div>
        {overviewEngagementBars.map((bar, idx) => (
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
                  transitionDelay: hasAnimatedA ? `${idx * 100}ms` : '0ms',
                }}
              />
            </div>
          </div>
        ))}
        <div className={styles.ovSource}>
          Source: Industry benchmark data across Meta, LinkedIn &amp; YouTube
        </div>
      </div>

      {/* Card B: Big Stat (5+ Platforms) */}
      <div className={styles.ovCard}>
        <div className={styles.ovBigStat}>
          <div className={styles.ovBigIcon}>
            <FaLayerGroup aria-hidden="true" />
          </div>
          <div className={styles.ovBigNum}>5+</div>
          <div className={styles.ovBigLabel}>
            Major platforms your customers use daily — Facebook, Instagram, LinkedIn, YouTube, Google
          </div>
        </div>
      </div>

      {/* Card C: Big Stat (3+ hrs) */}
      <div className={styles.ovCard}>
        <div className={styles.ovBigStat}>
          <div className={styles.ovBigIcon}>
            <FaClock aria-hidden="true" />
          </div>
          <div className={styles.ovBigNum}>3+ hrs</div>
          <div className={styles.ovBigLabel}>
            Time saved weekly when content planning &amp; posting is outsourced
          </div>
        </div>
      </div>

      {/* Card D: Impact of Posting Consistency on Reach (Wide) */}
      <div ref={cardDRef} className={`${styles.ovCard} ${styles.ovCardWide}`}>
        <div className={styles.ovCardTitle}>
          <FaArrowTrendUp className={styles.ovCardTitleIcon} aria-hidden="true" />
          Impact of Posting Consistency on Reach
        </div>
        <div className={styles.ovCompareRow}>
          <div className={styles.ovCompareLabel}>
            <span>{overviewCompareBars.inconsistent.label}</span>
            <span>{overviewCompareBars.inconsistent.sub}</span>
          </div>
          <div className={styles.ovCompareTrack}>
            <div
              className={`${styles.ovCompareFill} ${styles.ovCompareFillWithout}`}
              style={{
                width: getBarWidthD(overviewCompareBars.inconsistent.width),
                transitionDelay: hasAnimatedD ? '0ms' : '0ms',
              }}
            >
              <span>{overviewCompareBars.inconsistent.innerText}</span>
            </div>
          </div>
        </div>
        <div className={styles.ovCompareRow}>
          <div className={styles.ovCompareLabel}>
            <span>{overviewCompareBars.consistent.label}</span>
            <span>{overviewCompareBars.consistent.sub}</span>
          </div>
          <div className={styles.ovCompareTrack}>
            <div
              className={`${styles.ovCompareFill} ${styles.ovCompareFillWith}`}
              style={{
                width: getBarWidthD(overviewCompareBars.consistent.width),
                transitionDelay: hasAnimatedD ? '120ms' : '0ms',
              }}
            >
              <span>{overviewCompareBars.consistent.innerText}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
