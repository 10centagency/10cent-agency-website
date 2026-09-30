'use client';

import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
import styles from '../HomeSections.module.css';
import { metaVizData } from '../homeSectionsData';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function countUp(
  targetVal: number,
  setter: (s: string) => void,
  options: {
    prefix?: string;
    suffix?: string;
    dec?: number;
    duration?: number;
  } = {}
) {
  const { prefix = '', suffix = '', dec = 0, duration = 1100 } = options;
  const startTs = performance.now();
  const format = (v: number) => {
    const s = dec > 0 ? v.toFixed(dec) : Math.round(v).toLocaleString('en-US');
    return `${prefix}${s}${suffix}`;
  };

  const step = (now: number) => {
    const p = Math.min((now - startTs) / duration, 1);
    const easeOutCubic = 1 - Math.pow(1 - p, 3);
    setter(format(targetVal * easeOutCubic));
    if (p < 1) {
      requestAnimationFrame(step);
    } else {
      setter(format(targetVal));
    }
  };
  requestAnimationFrame(step);
}

export default function MetaViz() {
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Initial state === Final SSR state for crawler indexability & JS-disabled visibility
  const [isActive, setIsActive] = useState(true);
  const [isInView, setIsInView] = useState(true);

  // Animated KPI values
  const [kpi1, setKpi1] = useState(metaVizData.kpis[0].val);
  const [kpi2, setKpi2] = useState(metaVizData.kpis[1].val);
  const [kpi3, setKpi3] = useState(metaVizData.kpis[2].val);

  // Animated Funnel values
  const [fn1, setFn1] = useState(metaVizData.funnel[0].val);
  const [fn2, setFn2] = useState(metaVizData.funnel[1].val);
  const [fn3, setFn3] = useState(metaVizData.funnel[2].val);
  const [fn4, setFn4] = useState(metaVizData.funnel[3].val);

  useIsomorphicLayoutEffect(() => {
    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      return;
    }

    // Reset before animating on client
    setIsActive(false);
    setIsInView(false);

    const el = containerRef.current;
    if (!el) return;

    const startSequence = () => {
      setIsInView(true);
      setIsActive(true);

      const t1 = setTimeout(() => {
        countUp(metaVizData.kpis[0].to, setKpi1, {
          dec: metaVizData.kpis[0].dec,
          suffix: metaVizData.kpis[0].suffix,
        });
      }, metaVizData.kpis[0].cd);

      const t2 = setTimeout(() => {
        countUp(metaVizData.kpis[1].to, setKpi2, {
          dec: metaVizData.kpis[1].dec,
        });
      }, metaVizData.kpis[1].cd);

      const t3 = setTimeout(() => {
        countUp(metaVizData.kpis[2].to, setKpi3, {
          dec: metaVizData.kpis[2].dec,
          prefix: metaVizData.kpis[2].prefix,
        });
      }, metaVizData.kpis[2].cd);

      const t4 = setTimeout(() => {
        countUp(metaVizData.funnel[0].to, setFn1, {
          dec: metaVizData.funnel[0].dec,
          suffix: metaVizData.funnel[0].suffix,
        });
      }, metaVizData.funnel[0].cd);

      const t5 = setTimeout(() => {
        countUp(metaVizData.funnel[1].to, setFn2, {
          dec: metaVizData.funnel[1].dec,
          suffix: metaVizData.funnel[1].suffix,
        });
      }, metaVizData.funnel[1].cd);

      const t6 = setTimeout(() => {
        countUp(metaVizData.funnel[2].to, setFn3, {
          dec: metaVizData.funnel[2].dec,
          suffix: metaVizData.funnel[2].suffix,
        });
      }, metaVizData.funnel[2].cd);

      const t7 = setTimeout(() => {
        countUp(metaVizData.funnel[3].to, setFn4, {
          dec: metaVizData.funnel[3].dec,
        });
      }, metaVizData.funnel[3].cd);

      timeoutsRef.current = [t1, t2, t3, t4, t5, t6, t7];
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
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`${styles.vizCol} ${styles.reveal} ${isInView ? styles.in : ''}`}
      style={{ '--d': '.14s' } as React.CSSProperties}
    >
      <div className={`${styles.glass} ${styles.metaAnim} ${isActive ? styles.active : ''}`}>
        <div className={styles.scHeader}>
          <span className={styles.scAv}>
            <svg viewBox="0 0 320 512" fill="currentColor" aria-hidden="true">
              <path d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z" />
            </svg>
          </span>
          <div>
            <div className={styles.scName}>{metaVizData.campaignName}</div>
            <div className={styles.scSub}>{metaVizData.campaignSub}</div>
          </div>
          <span className={styles.liveDot}>
            <i />
            Live
          </span>
        </div>

        <div className={styles.scKpis}>
          <div className={styles.kpi}>
            <div className={styles.kv}>{kpi1}</div>
            <div className={styles.kl}>{metaVizData.kpis[0].label}</div>
            <span className={`${styles.kt} ${styles.up}`}>{metaVizData.kpis[0].tag}</span>
          </div>
          <div className={styles.kpi}>
            <div className={styles.kv}>{kpi2}</div>
            <div className={styles.kl}>{metaVizData.kpis[1].label}</div>
            <span className={`${styles.kt} ${styles.up}`}>{metaVizData.kpis[1].tag}</span>
          </div>
          <div className={styles.kpi}>
            <div className={styles.kv}>{kpi3}</div>
            <div className={styles.kl}>{metaVizData.kpis[2].label}</div>
            <span className={`${styles.kt} ${styles.dn}`}>{metaVizData.kpis[2].tag}</span>
          </div>
        </div>

        <div className={styles.sparkline}>
          <svg viewBox="0 0 340 72" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="sparkGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#1877F2" stopOpacity=".6" />
                <stop offset="100%" stopColor="#60a5fa" />
              </linearGradient>
              <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1877F2" stopOpacity=".25" />
                <stop offset="100%" stopColor="#1877F2" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              className={styles.sparkFill}
              d="M0,60 L28,52 L56,44 L84,48 L112,36 L140,40 L168,28 L196,32 L224,20 L252,24 L280,12 L308,8 L340,4 L340,72 L0,72 Z"
            />
            <path
              className={styles.sparkLine}
              d="M0,60 L28,52 L56,44 L84,48 L112,36 L140,40 L168,28 L196,32 L224,20 L252,24 L280,12 L308,8 L340,4"
            />
          </svg>
        </div>

        <div className={styles.scFunnel}>
          <div className={styles.fn}>
            <div className={styles.fnBarWrap}>
              <span
                className={styles.fnBar}
                style={
                  {
                    '--h': isActive ? metaVizData.funnel[0].height : '0px',
                    '--bd': metaVizData.funnel[0].delay,
                  } as React.CSSProperties
                }
              />
            </div>
            <div className={styles.fnV}>{fn1}</div>
            <div className={styles.fnL}>{metaVizData.funnel[0].label}</div>
          </div>

          <div className={styles.fn}>
            <div className={styles.fnBarWrap}>
              <span
                className={styles.fnBar}
                style={
                  {
                    '--h': isActive ? metaVizData.funnel[1].height : '0px',
                    '--bd': metaVizData.funnel[1].delay,
                  } as React.CSSProperties
                }
              />
            </div>
            <div className={styles.fnV}>{fn2}</div>
            <div className={styles.fnL}>{metaVizData.funnel[1].label}</div>
          </div>

          <div className={styles.fn}>
            <div className={styles.fnBarWrap}>
              <span
                className={styles.fnBar}
                style={
                  {
                    '--h': isActive ? metaVizData.funnel[2].height : '0px',
                    '--bd': metaVizData.funnel[2].delay,
                  } as React.CSSProperties
                }
              />
            </div>
            <div className={styles.fnV}>{fn3}</div>
            <div className={styles.fnL}>{metaVizData.funnel[2].label}</div>
          </div>

          <div className={styles.fn}>
            <div className={styles.fnBarWrap}>
              <span
                className={styles.fnBar}
                style={
                  {
                    '--h': isActive ? metaVizData.funnel[3].height : '0px',
                    '--bd': metaVizData.funnel[3].delay,
                    background: 'linear-gradient(180deg, #4ade80, #059669)',
                  } as React.CSSProperties
                }
              />
            </div>
            <div className={styles.fnV}>{fn4}</div>
            <div className={styles.fnL}>{metaVizData.funnel[3].label}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
