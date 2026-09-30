"use client";

import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import {
  FaFilePdf,
  FaCalendarCheck,
  FaEye,
  FaBullseye,
  FaCoins,
  FaSackDollar,
  FaArrowUp,
  FaMinus,
  FaChartSimple,
  FaChartPie,
  FaCrown,
  FaHeart,
  FaRegComment,
  FaShare,
} from 'react-icons/fa6';
import styles from './FacebookMetaMkt.module.css';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function ReportPreview() {
  const frameRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef<boolean>(false);

  // SSR Final State (Crawlable & Hydration-Safe)
  const [isRevealed, setIsRevealed] = useState<boolean>(true);
  const [kpiRevealed, setKpiRevealed] = useState<boolean[]>([true, true, true, true]);
  const [kpiValues, setKpiValues] = useState<{
    reach: string;
    leads: string;
    spend: string;
    roas: string;
  }>({
    reach: '182,400',
    leads: '214',
    spend: '$285',
    roas: '4.2',
  });
  const [barWidths, setBarWidths] = useState<{
    reels: number;
    catalog: number;
    static: number;
  }>({
    reels: 62,
    catalog: 28,
    static: 10,
  });
  const [donutVal, setDonutVal] = useState<number>(65);

  useIsomorphicLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      // Keep SSR final state
      return;
    }

    // Reset for scroll-triggered animation
    setIsRevealed(false);
    setKpiRevealed([false, false, false, false]);
    setKpiValues({
      reach: '0',
      leads: '0',
      spend: '$0',
      roas: '0.0',
    });
    setBarWidths({
      reels: 0,
      catalog: 0,
      static: 0,
    });
    setDonutVal(0);

    const el = frameRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          setIsRevealed(true);

          // 1. Staggered KPI reveals & count-up
          const targets = { reach: 182400, leads: 214, spend: 285, roas: 4.2 };
          const duration = 1200;
          const startTime = performance.now();

          // Trigger KPI card reveals with slight delay
          [0, 1, 2, 3].forEach((idx) => {
            setTimeout(() => {
              setKpiRevealed((prev) => {
                const next = [...prev];
                next[idx] = true;
                return next;
              });
            }, idx * 120);
          });

          // Animate counters
          const animateCounters = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);

            const currReach = Math.floor(ease * targets.reach);
            const currLeads = Math.floor(ease * targets.leads);
            const currSpend = Math.floor(ease * targets.spend);
            const currRoas = (ease * targets.roas).toFixed(1);

            setKpiValues({
              reach: currReach.toLocaleString('en-US'),
              leads: currLeads.toString(),
              spend: `$${currSpend}`,
              roas: currRoas,
            });

            if (progress < 1) {
              requestAnimationFrame(animateCounters);
            } else {
              setKpiValues({
                reach: targets.reach.toLocaleString('en-US'),
                leads: targets.leads.toString(),
                spend: `$${targets.spend}`,
                roas: targets.roas.toFixed(1),
              });
            }
          };
          requestAnimationFrame(animateCounters);

          // 2. Animate Bars
          setTimeout(() => {
            setBarWidths({
              reels: 62,
              catalog: 28,
              static: 10,
            });
          }, 350);

          // 3. Animate Donut
          const donutDuration = 1000;
          const donutStartTime = performance.now();
          const animateDonut = (now: number) => {
            const donutElapsed = now - donutStartTime;
            const donutProg = Math.min(donutElapsed / donutDuration, 1);
            const donutEase = 1 - Math.pow(1 - donutProg, 3);
            const val = Math.round(donutEase * 65);
            setDonutVal(val);

            if (donutProg < 1) {
              requestAnimationFrame(animateDonut);
            } else {
              setDonutVal(65);
            }
          };

          setTimeout(() => {
            requestAnimationFrame(animateDonut);
          }, 450);

          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={frameRef}
      className={`${styles.rpFrame} ${isRevealed ? styles.rpFrameReveal : ''}`}
    >
      <div className={styles.rpTopbar}>
        <span className={styles.rpDot} style={{ background: '#ff5f57' }} />
        <span className={styles.rpDot} style={{ background: '#febc2e' }} />
        <span className={styles.rpDot} style={{ background: '#28c840' }} />
        <span className={styles.rpFilename}>
          <FaFilePdf aria-hidden="true" /> Monthly_Report_October.pdf
        </span>
      </div>

      <div className={styles.rpBody}>
        <div className={styles.rpHead}>
          <div>
            <h4>Monthly Performance Report</h4>
            <span>October 2025 · Sample E-commerce Client</span>
          </div>
          <span className={styles.rpBadge}>
            <FaCalendarCheck aria-hidden="true" /> Delivered Day 5
          </span>
        </div>

        {/* KPI Row */}
        <div className={styles.rpKpiGrid}>
          <div
            className={`${styles.rpKpi} ${
              kpiRevealed[0] ? styles.rpKpiReveal : ''
            }`}
          >
            <div className={styles.rpKpiIcon}>
              <FaEye aria-hidden="true" />
            </div>
            <div className={styles.rpKpiInfo}>
              <span className={styles.rpKpiLabel}>Reach</span>
              <span className={styles.rpKpiNum}>{kpiValues.reach}</span>
              <span className={`${styles.rpKpiTrend} ${styles.rpKpiTrendUp}`}>
                <FaArrowUp aria-hidden="true" /> 24%
              </span>
            </div>
          </div>

          <div
            className={`${styles.rpKpi} ${
              kpiRevealed[1] ? styles.rpKpiReveal : ''
            }`}
          >
            <div className={styles.rpKpiIcon}>
              <FaBullseye aria-hidden="true" />
            </div>
            <div className={styles.rpKpiInfo}>
              <span className={styles.rpKpiLabel}>Leads</span>
              <span className={styles.rpKpiNum}>{kpiValues.leads}</span>
              <span className={`${styles.rpKpiTrend} ${styles.rpKpiTrendUp}`}>
                <FaArrowUp aria-hidden="true" /> 18%
              </span>
            </div>
          </div>

          <div
            className={`${styles.rpKpi} ${
              kpiRevealed[2] ? styles.rpKpiReveal : ''
            }`}
          >
            <div className={styles.rpKpiIcon}>
              <FaCoins aria-hidden="true" />
            </div>
            <div className={styles.rpKpiInfo}>
              <span className={styles.rpKpiLabel}>Ad Spend</span>
              <span className={styles.rpKpiNum}>{kpiValues.spend}</span>
              <span className={`${styles.rpKpiTrend} ${styles.rpKpiTrendFlat}`}>
                <FaMinus aria-hidden="true" /> On Budget
              </span>
            </div>
          </div>

          <div
            className={`${styles.rpKpi} ${
              kpiRevealed[3] ? styles.rpKpiReveal : ''
            }`}
          >
            <div className={styles.rpKpiIcon}>
              <FaSackDollar aria-hidden="true" />
            </div>
            <div className={styles.rpKpiInfo}>
              <span className={styles.rpKpiLabel}>ROAS</span>
              <span className={styles.rpKpiNum}>{kpiValues.roas}</span>
              <span className={`${styles.rpKpiTrend} ${styles.rpKpiTrendUp}`}>
                <FaArrowUp aria-hidden="true" /> 0.6x
              </span>
            </div>
          </div>
        </div>

        {/* Middle: Content Bars + Donut */}
        <div className={styles.rpMidGrid}>
          <div className={styles.rpPanel}>
            <div className={styles.rpPanelTitle}>
              <FaChartSimple className={styles.rpPanelTitleIcon} aria-hidden="true" />{' '}
              Content Performance
            </div>
            <div className={styles.rpBarRow}>
              <div className={styles.rpBarTop}>
                <span>Reels / Video</span>
                <strong>62%</strong>
              </div>
              <div className={styles.rpBarTrack}>
                <div
                  className={styles.rpBarFill}
                  style={{ width: `${barWidths.reels}%` }}
                />
              </div>
            </div>
            <div className={styles.rpBarRow}>
              <div className={styles.rpBarTop}>
                <span>Catalog Ads</span>
                <strong>28%</strong>
              </div>
              <div className={styles.rpBarTrack}>
                <div
                  className={styles.rpBarFill}
                  style={{ width: `${barWidths.catalog}%` }}
                />
              </div>
            </div>
            <div className={styles.rpBarRow}>
              <div className={styles.rpBarTop}>
                <span>Static Posts</span>
                <strong>10%</strong>
              </div>
              <div className={styles.rpBarTrack}>
                <div
                  className={styles.rpBarFill}
                  style={{ width: `${barWidths.static}%` }}
                />
              </div>
            </div>
          </div>

          <div className={`${styles.rpPanel} ${styles.rpDonutPanel}`}>
            <div className={styles.rpPanelTitle}>
              <FaChartPie className={styles.rpPanelTitleIcon} aria-hidden="true" />{' '}
              Budget Allocation
            </div>
            <div className={styles.rpDonutWrap}>
              <div
                className={styles.rpDonut}
                style={{
                  background: `conic-gradient(var(--fb-blue) 0% ${donutVal}%, #dbe6f7 ${donutVal}% 100%)`,
                }}
              >
                <div className={styles.rpDonutInner}>
                  <strong>{donutVal}%</strong>
                  <span>Conversion Ads</span>
                </div>
              </div>
              <div className={styles.rpDonutLegend}>
                <span>
                  <i style={{ background: 'var(--fb-blue)' }} /> Conversion — 65%
                </span>
                <span>
                  <i style={{ background: 'var(--fb-navy)' }} /> Retargeting — 25%
                </span>
                <span>
                  <i style={{ background: '#c7d4e8' }} /> Awareness — 10%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Post */}
        <div className={styles.rpTopPost}>
          <div className={styles.rpTopPostIcon}>
            <FaCrown aria-hidden="true" />
          </div>
          <div className={styles.rpTopPostInfo}>
            <span className={styles.rpTopPostTag}>
              Top Performing Content This Month
            </span>
            <h5>&ldquo;Product Unboxing Video&rdquo; -Reel</h5>
          </div>
          <div className={styles.rpTopPostStats}>
            <span>
              <FaHeart className={styles.rpStatIcon} aria-hidden="true" /> 4.2K
            </span>
            <span>
              <FaRegComment className={styles.rpStatIcon} aria-hidden="true" /> 312
            </span>
            <span>
              <FaShare className={styles.rpStatIcon} aria-hidden="true" /> 189
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
