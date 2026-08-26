"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  FaLock,
  FaMagnifyingGlass,
  FaMicrophone,
  FaWandMagicSparkles,
  FaStar,
  FaCircleInfo,
} from 'react-icons/fa6';
import styles from './SeoAeoGeo.module.css';
import { serpMockupData } from './seoAeoGeoData';

export default function SagSERPPreview() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setIsRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    if (wrapRef.current) {
      observer.observe(wrapRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // On initial SSR/hydration, reveal state class is applied smoothly
  const animClass = !isClient || isRevealed ? styles.serpRevealed : styles.serpRevealing;

  return (
    <div className={styles.container}>
      <div ref={wrapRef} className={`${styles.serpAnswerWrap} ${animClass}`}>
        {/* Browser Top Bar */}
        <div className={styles.serpBrowserBar}>
          <div className={styles.serpDots}>
            <span className={styles.serpDotRed} />
            <span className={styles.serpDotYellow} />
            <span className={styles.serpDotGreen} />
          </div>
          <div className={styles.serpUrlBar}>
            <FaLock className={styles.serpUrlBarIcon} aria-hidden="true" />
            <span className={styles.serpUrlBarText}>{serpMockupData.urlBar}</span>
          </div>
        </div>

        {/* Search Query Row */}
        <div className={styles.serpSearchRow}>
          <div className={styles.serpSearchIcon}>
            <FaMagnifyingGlass aria-hidden="true" />
          </div>
          <div className={styles.serpSearchInput}>
            <FaMagnifyingGlass className={styles.serpSearchInputIcon} aria-hidden="true" />
            <span>{serpMockupData.query}</span>
          </div>
          <div className={styles.serpMic}>
            <FaMicrophone aria-hidden="true" />
          </div>
        </div>

        {/* Decorative Search Tabs */}
        <div className={styles.serpTabsRow}>
          {serpMockupData.tabs.map((tab, idx) => (
            <div
              key={idx}
              className={`${styles.serpTabItem} ${idx === 0 ? styles.serpTabItemActive : ''}`}
            >
              {tab}
            </div>
          ))}
        </div>

        {/* SERP Body (All 3 results in SSR) */}
        <div className={styles.serpBody}>
          {/* 1. AI Overview Box (GEO) */}
          <div className={styles.serpAiBox}>
            <div className={styles.serpAiHead}>
              <div className={styles.serpAiIcon}>
                <FaWandMagicSparkles aria-hidden="true" />
              </div>
              <div className={styles.serpAiLabel}>{serpMockupData.aiOverview.title}</div>
              <div className={styles.serpAiTag}>{serpMockupData.aiOverview.tag}</div>
            </div>
            <p>
              {serpMockupData.aiOverview.bodyBeforeBold}
              <strong>{serpMockupData.aiOverview.boldText}</strong>
              {serpMockupData.aiOverview.bodyAfterBold}
            </p>
          </div>

          {/* 2. Featured Snippet Box (AEO) */}
          <div className={styles.serpSnippetBox}>
            <div className={styles.serpSnippetTag}>
              <FaStar aria-hidden="true" /> {serpMockupData.featuredSnippet.tag}
            </div>
            <p>{serpMockupData.featuredSnippet.body}</p>
            <div className={styles.serpSnippetSource}>
              <span className={styles.fav} /> {serpMockupData.featuredSnippet.source}
            </div>
          </div>

          {/* 3. Organic Result (SEO) */}
          <div className={styles.serpOrganic}>
            <div className={styles.serpOrganicEyebrow}>
              <span className={styles.fav}>{serpMockupData.organicResult.faviconText}</span>
              <span className={styles.serpOrganicUrl}>{serpMockupData.organicResult.url}</span>
            </div>
            <div className={styles.serpOrganicTitle}>{serpMockupData.organicResult.title}</div>
            <div className={styles.serpOrganicDesc}>{serpMockupData.organicResult.description}</div>
          </div>
        </div>

        {/* Legend */}
        <div className={styles.serpLegend}>
          {serpMockupData.legend.map((item, idx) => (
            <div key={idx} className={styles.serpLegendItem}>
              <span
                className={styles.serpLegendDot}
                style={{ backgroundColor: item.dotColor }}
              />
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* Caption with baseline-aligned info icon */}
      <p className={styles.serpCaption}>
        <FaCircleInfo className={styles.serpCaptionIcon} aria-hidden="true" />
        <span>{serpMockupData.caption}</span>
      </p>
    </div>
  );
}
