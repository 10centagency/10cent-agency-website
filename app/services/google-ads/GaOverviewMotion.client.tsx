"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  FaChartSimple,
  FaBolt,
  FaCartShopping,
  FaArrowTrendUp,
} from 'react-icons/fa6';
import styles from './GoogleAds.module.css';
import {
  overviewClickDistribution,
  overviewSourceText,
  overviewBigStats,
  overviewCompareBars,
} from './googleAdsData';

export default function GaOverviewMotion() {
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

    // Separate Observer for Card A (Click distribution bars) - threshold: 0.4
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

    // Separate Observer for Card D (Managed vs Self-Run compare bars) - threshold: 0.4
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
      {/* Card A: Where High-Intent Clicks Go on Google (Wide) */}
      <div ref={cardARef} className={`${styles.ovCard} ${styles.ovCardWide}`}>
        <div className={styles.ovCardTitle}>
          <FaChartSimple className={styles.ovCardTitleIcon} aria-hidden="true" />
          Where High-Intent Clicks Go on Google
        </div>
        {overviewClickDistribution.map((bar, idx) => (
          <div key={idx} className={styles.ovBarRow}>
            <div className={styles.ovBarTop}>
              <span>{bar.label}</span>
              <strong>{bar.percentage}</strong>
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
        <div className={styles.ovSource}>{overviewSourceText}</div>
      </div>

      {/* Card B: Big Stat (24–48h) */}
      <div className={styles.ovCard}>
        <div className={styles.ovBigStat}>
          <div className={styles.ovBigIcon}>
            <FaBolt aria-hidden="true" />
          </div>
          <div className={styles.ovBigNum}>{overviewBigStats[0].value}</div>
          <div className={styles.ovBigLabel}>{overviewBigStats[0].label}</div>
        </div>
      </div>

      {/* Card C: Big Stat (2x) */}
      <div className={styles.ovCard}>
        <div className={styles.ovBigStat}>
          <div className={styles.ovBigIcon}>
            <FaCartShopping aria-hidden="true" />
          </div>
          <div className={styles.ovBigNum}>{overviewBigStats[1].value}</div>
          <div className={styles.ovBigLabel}>{overviewBigStats[1].label}</div>
        </div>
      </div>

      {/* Card D: Managed vs Self-Run Accounts (Wide) */}
      <div ref={cardDRef} className={`${styles.ovCard} ${styles.ovCardWide}`}>
        <div className={styles.ovCardTitle}>
          <FaArrowTrendUp className={styles.ovCardTitleIcon} aria-hidden="true" />
          Managed vs Self-Run Accounts
        </div>
        <div className={styles.ovCompareRow}>
          <div className={styles.ovCompareLabel}>
            <span>{overviewCompareBars.selfManaged.label}</span>
            <span>{overviewCompareBars.selfManaged.sub}</span>
          </div>
          <div className={styles.ovCompareTrack}>
            <div
              className={`${styles.ovCompareFill} ${styles.ovCompareFillWithout}`}
              style={{
                width: getBarWidthD(overviewCompareBars.selfManaged.width),
                transitionDelay: hasAnimatedD ? '0ms' : '0ms',
              }}
            >
              <span>{overviewCompareBars.selfManaged.innerText}</span>
            </div>
          </div>
        </div>
        <div className={styles.ovCompareRow}>
          <div className={styles.ovCompareLabel}>
            <span>{overviewCompareBars.agencyManaged.label}</span>
            <span>{overviewCompareBars.agencyManaged.sub}</span>
          </div>
          <div className={styles.ovCompareTrack}>
            <div
              className={`${styles.ovCompareFill} ${styles.ovCompareFillWith}`}
              style={{
                width: getBarWidthD(overviewCompareBars.agencyManaged.width),
                transitionDelay: hasAnimatedD ? '140ms' : '0ms',
              }}
            >
              <span>{overviewCompareBars.agencyManaged.innerText}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
