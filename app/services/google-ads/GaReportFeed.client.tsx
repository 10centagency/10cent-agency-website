"use client";

import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import {
  FaPlus,
  FaFlask,
  FaArrowsRotate,
  FaArrowTrendDown,
  FaBan,
  FaVial,
  FaPause,
  FaMoneyBillTrendUp,
  FaBullseye,
  FaCircleInfo,
} from 'react-icons/fa6';
import styles from './GoogleAds.module.css';
import {
  reportMockupData,
  liveFeedItems,
  liveFeedFootnote,
  ReportPinItem,
  FeedListItem,
} from './googleAdsData';

const feedIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FaBan,
  FaVial,
  FaPause,
  FaMoneyBillTrendUp,
  FaBullseye,
};

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function GaReportFeed() {
  const [activePin, setActivePin] = useState<ReportPinItem | null>(null);

  // CRITICAL REQUIREMENT: Initial React state === Final state (for SSR & no-JS safety)
  const [reportRevealed, setReportRevealed] = useState<boolean>(true);
  const [headerRevealed, setHeaderRevealed] = useState<boolean>(true);
  const [metricsRevealed, setMetricsRevealed] = useState<boolean>(true);
  const [changelogCount, setChangelogCount] = useState<number>(3);
  const [trendRevealed, setTrendRevealed] = useState<boolean>(true);
  const [planRevealed, setPlanRevealed] = useState<boolean>(true);
  const [feedRevealed, setFeedRevealed] = useState<boolean>(true);

  const gridRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const hasAnimatedRef = useRef<boolean>(false);

  useIsomorphicLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Reduced motion: remain in final state
      return;
    }

    // Reset to pre-animation state inside layout effect right before observer plays
    setReportRevealed(false);
    setHeaderRevealed(false);
    setMetricsRevealed(false);
    setChangelogCount(0);
    setTrendRevealed(false);
    setPlanRevealed(false);
    setFeedRevealed(false);

    const el = gridRef.current;
    if (!el) return;

    const startSequence = () => {
      if (hasAnimatedRef.current) return;
      hasAnimatedRef.current = true;

      // 1. Report window slide up + feed start
      setReportRevealed(true);
      setFeedRevealed(true);

      // 2. Header row (file name + status)
      const tHeader = setTimeout(() => setHeaderRevealed(true), 100);

      // 3. KPI figures row
      const tMetrics = setTimeout(() => setMetricsRevealed(true), 200);

      // 4. What Changed This Month items (staggered)
      const tChange1 = setTimeout(() => setChangelogCount(1), 300);
      const tChange2 = setTimeout(() => setChangelogCount(2), 380);
      const tChange3 = setTimeout(() => setChangelogCount(3), 460);

      // 5. Cost Per Conversion Trend (sparkline width/clip & -38% badge)
      const tTrend = setTimeout(() => setTrendRevealed(true), 540);

      // 6. Next Month's Plan card
      const tPlan = setTimeout(() => setPlanRevealed(true), 640);

      timeoutsRef.current = [tHeader, tMetrics, tChange1, tChange2, tChange3, tTrend, tPlan];
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          startSequence();
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      timeoutsRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  const handlePinClick = (pin: ReportPinItem) => {
    setActivePin((prev) => (prev?.id === pin.id ? null : pin));
  };

  return (
    <div ref={gridRef} className={styles.rptGrid}>
      {/* Left: Annotated Monthly Report Mockup */}
      <div
        className={`${styles.rptMockWrap} ${
          reportRevealed ? styles.rptMockWrapRevealed : styles.rptMockWrapHidden
        }`}
      >
        <div className={styles.rptMock}>
          <div
            className={`${styles.rptMockHeader} ${
              headerRevealed ? styles.rptBlockVisible : styles.rptBlockHidden
            }`}
          >
            <span className={styles.rptMockDot} />
            <span className={styles.rptMockDot} />
            <span className={styles.rptMockDot} />
            <span className={styles.rptMockTitle}>{reportMockupData.fileName}</span>
          </div>

          <div className={styles.rptMockBody}>
            {/* Row 1: Active Campaign & Metrics */}
            <div
              className={`${styles.rptRow} ${
                metricsRevealed ? styles.rptBlockVisible : styles.rptBlockHidden
              }`}
            >
              <div className={styles.rptRowTop}>
                <strong>{reportMockupData.campaignName}</strong>
                <span className={styles.rptTagGood}>{reportMockupData.campaignTag}</span>
              </div>
              <div className={styles.rptMetrics}>
                {reportMockupData.metrics.map((metric, idx) => (
                  <div key={idx}>
                    <span className={styles.rptNum}>{metric.value}</span>
                    <span className={styles.rptLabel}>{metric.label}</span>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className={`${styles.rptPin} ${
                  activePin?.id === 1 ? styles.rptPinActive : ''
                }`}
                onClick={() => handlePinClick(reportMockupData.pins[0])}
                aria-label={`Show note for ${reportMockupData.pins[0].title}`}
              >
                1
              </button>
            </div>

            {/* Row 2: What Changed This Month */}
            <div
              className={`${styles.rptRow} ${
                changelogCount > 0 ? styles.rptBlockVisible : styles.rptBlockHidden
              }`}
            >
              <div className={styles.rptRowTop}>
                <strong>What Changed This Month</strong>
              </div>
              <ul className={styles.rptChangelog}>
                <li
                  className={
                    changelogCount >= 1
                      ? styles.rptChangelogItemVisible
                      : styles.rptChangelogItemHidden
                  }
                >
                  <FaPlus className={styles.rptChangelogIcon} aria-hidden="true" />
                  <span>{reportMockupData.changelog[0]}</span>
                </li>
                <li
                  className={
                    changelogCount >= 2
                      ? styles.rptChangelogItemVisible
                      : styles.rptChangelogItemHidden
                  }
                >
                  <FaFlask className={styles.rptChangelogIcon} aria-hidden="true" />
                  <span>{reportMockupData.changelog[1]}</span>
                </li>
                <li
                  className={
                    changelogCount >= 3
                      ? styles.rptChangelogItemVisible
                      : styles.rptChangelogItemHidden
                  }
                >
                  <FaArrowsRotate className={styles.rptChangelogIcon} aria-hidden="true" />
                  <span>{reportMockupData.changelog[2]}</span>
                </li>
              </ul>
              <button
                type="button"
                className={`${styles.rptPin} ${
                  activePin?.id === 2 ? styles.rptPinActive : ''
                }`}
                onClick={() => handlePinClick(reportMockupData.pins[1])}
                aria-label={`Show note for ${reportMockupData.pins[1].title}`}
              >
                2
              </button>
            </div>

            {/* Row 3: Cost Per Conversion Trend */}
            <div
              className={`${styles.rptRow} ${
                trendRevealed ? styles.rptBlockVisible : styles.rptBlockHidden
              }`}
            >
              <div className={styles.rptRowTop}>
                <strong>{reportMockupData.trendTitle}</strong>
              </div>
              <div className={styles.rptTrend}>
                <svg
                  viewBox="0 0 220 60"
                  className={`${styles.rptSparkline} ${
                    trendRevealed ? styles.rptSparklineVisible : styles.rptSparklineHidden
                  }`}
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="gaCpcFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1f5fb0" stopOpacity="0.22" />
                      <stop offset="100%" stopColor="#1f5fb0" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <polygon
                    points="0,12 28,18 56,16 90,28 120,34 152,44 184,48 220,52 220,60 0,60"
                    fill="url(#gaCpcFill)"
                  />
                  <polyline points="0,12 28,18 56,16 90,28 120,34 152,44 184,48 220,52" />
                </svg>
                <span
                  className={`${styles.rptTrendBadge} ${
                    trendRevealed ? styles.rptTrendBadgeVisible : styles.rptTrendBadgeHidden
                  }`}
                >
                  <FaArrowTrendDown aria-hidden="true" /> {reportMockupData.trendBadge}
                </span>
              </div>
              <button
                type="button"
                className={`${styles.rptPin} ${
                  activePin?.id === 3 ? styles.rptPinActive : ''
                }`}
                onClick={() => handlePinClick(reportMockupData.pins[2])}
                aria-label={`Show note for ${reportMockupData.pins[2].title}`}
              >
                3
              </button>
            </div>

            {/* Row 4: Next Month's Plan */}
            <div
              className={`${styles.rptRow} ${
                planRevealed ? styles.rptBlockVisible : styles.rptBlockHidden
              }`}
            >
              <div className={styles.rptRowTop}>
                <strong>{reportMockupData.planTitle}</strong>
              </div>
              <p className={styles.rptPlanText}>{reportMockupData.planText}</p>
              <button
                type="button"
                className={`${styles.rptPin} ${
                  activePin?.id === 4 ? styles.rptPinActive : ''
                }`}
                onClick={() => handlePinClick(reportMockupData.pins[3])}
                aria-label={`Show note for ${reportMockupData.pins[3].title}`}
              >
                4
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Tooltip Box */}
        {activePin && (
          <div className={styles.rptTooltip}>
            <button
              type="button"
              className={styles.rptTooltipClose}
              onClick={() => setActivePin(null)}
              aria-label="Close tooltip"
            >
              &times;
            </button>
            <h5>{activePin.title}</h5>
            <p>{activePin.text}</p>
          </div>
        )}
      </div>

      {/* Right: Live Activity Feed */}
      <div className={styles.feedWrap}>
        <div className={styles.feedHeader}>
          <div className={styles.feedLiveDot} />
          <h4>Live On Your Account This Month</h4>
        </div>

        <div className={styles.feedList}>
          {liveFeedItems.map((item: FeedListItem, idx: number) => {
            const IconComponent = feedIconMap[item.iconKey] || FaBan;

            return (
              <div
                key={item.id}
                className={`${styles.feedItem} ${feedRevealed ? styles.feedItemShow : ''}`}
                style={{
                  transitionDelay: feedRevealed ? `${idx * 150}ms` : '0ms',
                }}
              >
                <div
                  className={`${styles.feedIcon} ${
                    item.type === 'good' ? styles.feedIconGood : styles.feedIconWarn
                  }`}
                >
                  <IconComponent aria-hidden="true" />
                </div>
                <div className={styles.feedContent}>
                  <p>
                    <strong>{item.strongText}</strong>
                    {item.restText}
                  </p>
                  <span className={styles.feedTime}>{item.time}</span>
                </div>
              </div>
            );
          })}
        </div>

        <p
          className={styles.caption}
          style={{ marginTop: '18px', borderTop: '1px solid #eef2f8', paddingTop: '14px' }}
        >
          <FaCircleInfo className={styles.captionIcon} aria-hidden="true" />
          <span>{liveFeedFootnote}</span>
        </p>
      </div>
    </div>
  );
}
