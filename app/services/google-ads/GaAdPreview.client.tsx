"use client";

import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import {
  FaLock,
  FaMagnifyingGlass,
  FaMicrophone,
  FaCircleInfo,
} from 'react-icons/fa6';
import styles from './GoogleAds.module.css';
import { adPreviewData } from './googleAdsData';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function GaAdPreview() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const hasAnimatedRef = useRef<boolean>(false);

  // CRITICAL REQUIREMENT: Initial React state === Final state (for SSR & no-JS safety)
  const [typedQuery, setTypedQuery] = useState<string>(adPreviewData.query);
  const [showCaret, setShowCaret] = useState<boolean>(false);
  const [adCardVisible, setAdCardVisible] = useState<boolean>(true);
  const [sitelinksCount, setSitelinksCount] = useState<number>(4);
  const [organicVisible, setOrganicVisible] = useState<boolean>(true);

  useIsomorphicLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Reduced motion: remain in final state
      return;
    }

    // Reset to pre-animation state inside layout effect right before observer plays
    setTypedQuery('');
    setShowCaret(true);
    setAdCardVisible(false);
    setSitelinksCount(0);
    setOrganicVisible(false);

    const el = wrapRef.current;
    if (!el) return;

    const startSequence = () => {
      if (hasAnimatedRef.current) return;
      hasAnimatedRef.current = true;

      const fullQuery = adPreviewData.query;
      let currentIndex = 0;

      const typeNextChar = () => {
        if (currentIndex < fullQuery.length) {
          currentIndex++;
          setTypedQuery(fullQuery.slice(0, currentIndex));
          const t = setTimeout(typeNextChar, 50);
          timeoutsRef.current.push(t);
        } else {
          // Pause ~300ms after typing completes
          const tPause = setTimeout(() => {
            // Results phase:
            // 1. Sponsored Ad Card reveals
            setAdCardVisible(true);

            // Sitelinks reveal staggered (80ms each)
            const tSite1 = setTimeout(() => setSitelinksCount(1), 80);
            const tSite2 = setTimeout(() => setSitelinksCount(2), 160);
            const tSite3 = setTimeout(() => setSitelinksCount(3), 240);
            const tSite4 = setTimeout(() => setSitelinksCount(4), 320);

            // Organic result reveals
            const tOrg = setTimeout(() => {
              setOrganicVisible(true);
              setShowCaret(false);
            }, 420);

            timeoutsRef.current.push(tSite1, tSite2, tSite3, tSite4, tOrg);
          }, 300);

          timeoutsRef.current.push(tPause);
        }
      };

      // Start typing after short initial delay
      const tStart = setTimeout(typeNextChar, 100);
      timeoutsRef.current.push(tStart);
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

  return (
    <div className={styles.container}>
      <div ref={wrapRef} className={styles.gadsWrap}>
        {/* Browser Top Bar */}
        <div className={styles.gadsBrowserBar}>
          <div className={styles.gadsDots}>
            <span className={styles.gadsDotRed} />
            <span className={styles.gadsDotYellow} />
            <span className={styles.gadsDotGreen} />
          </div>
          <div className={styles.gadsUrlBar}>
            <FaLock className={styles.gadsUrlBarIcon} aria-hidden="true" />
            <span className={styles.gadsUrlBarText}>{adPreviewData.urlBar}</span>
          </div>
        </div>

        {/* Search Query Row */}
        <div className={styles.gadsSearchRow}>
          <div className={styles.gadsSearchIcon}>
            <FaMagnifyingGlass aria-hidden="true" />
          </div>
          <div className={styles.gadsSearchInput}>
            <FaMagnifyingGlass className={styles.gadsSearchInputIcon} aria-hidden="true" />
            <span className={styles.gadsSearchInputText}>
              <span>{typedQuery}</span>
              {showCaret && <span className={styles.gadsCaret} aria-hidden="true" />}
            </span>
            <FaMicrophone className={styles.gadsSearchInputMic} aria-hidden="true" />
          </div>
        </div>

        {/* Ad & Search Result Body */}
        <div className={styles.gadsBody}>
          {/* Top Ad Card */}
          <div
            className={`${styles.gadsAdCard} ${
              adCardVisible ? styles.gadsItemVisible : styles.gadsItemHidden
            }`}
          >
            <div className={styles.gadsAdHead}>
              <span className={styles.gadsAdTag}>{adPreviewData.adCard.tag}</span>
              <span className={styles.gadsAdUrl}>{adPreviewData.adCard.url}</span>
            </div>
            <div className={styles.gadsAdTitle}>{adPreviewData.adCard.title}</div>
            <div className={styles.gadsAdDesc}>{adPreviewData.adCard.description}</div>
            <div className={styles.gadsSitelinks}>
              {adPreviewData.adCard.sitelinks.map((link, idx) => (
                <div
                  key={idx}
                  className={`${styles.gadsSitelink} ${
                    sitelinksCount > idx ? styles.gadsSitelinkVisible : styles.gadsSitelinkHidden
                  }`}
                >
                  <strong>{link.title}</strong>
                  <span>{link.sub}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Organic Listing Below */}
          <div
            className={`${styles.gadsOrganicBlock} ${
              organicVisible ? styles.gadsItemVisible : styles.gadsItemHidden
            }`}
          >
            <div className={styles.gadsOrganicEyebrow}>
              <span className={styles.fav}>{adPreviewData.organicResult.faviconText}</span>
              <span className={styles.gadsOrganicUrl}>{adPreviewData.organicResult.url}</span>
            </div>
            <div className={styles.gadsOrganicTitle}>{adPreviewData.organicResult.title}</div>
            <div className={styles.gadsOrganicDesc}>{adPreviewData.organicResult.description}</div>
          </div>
        </div>

        {/* Legend */}
        <div className={styles.gadsLegend}>
          {adPreviewData.legend.map((item, idx) => (
            <div key={idx} className={styles.gadsLegendItem}>
              <span
                className={styles.gadsLegendDot}
                style={{ backgroundColor: item.color }}
              />
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* Caption with baseline-aligned info icon */}
      <p className={styles.caption}>
        <FaCircleInfo className={styles.captionIcon} aria-hidden="true" />
        <span>{adPreviewData.caption}</span>
      </p>
    </div>
  );
}
