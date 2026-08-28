'use client';

import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
import styles from '../HomeSections.module.css';
import { websiteVizData } from '../homeSectionsData';

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

function typeUrl(
  fullText: string,
  setter: (s: string) => void,
  setIsTyping: (t: boolean) => void,
  charDelay = 55
) {
  setter('');
  setIsTyping(true);
  let idx = 0;
  const interval = setInterval(() => {
    idx++;
    setter(fullText.slice(0, idx));
    if (idx >= fullText.length) {
      clearInterval(interval);
      setTimeout(() => {
        setIsTyping(false);
      }, 1200);
    }
  }, charDelay);
  return () => clearInterval(interval);
}

export default function WebsiteViz() {
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const clearIntervalRef = useRef<(() => void) | null>(null);

  // Initial state === Final SSR state
  const [isActive, setIsActive] = useState(true);
  const [isInView, setIsInView] = useState(true);
  const [urlText, setUrlText] = useState(websiteVizData.url);
  const [isTyping, setIsTyping] = useState(false);
  const [speedScore, setSpeedScore] = useState(websiteVizData.speedScore.val);

  useIsomorphicLayoutEffect(() => {
    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      return;
    }

    setIsActive(false);
    setIsInView(false);

    const el = containerRef.current;
    if (!el) return;

    const startSequence = () => {
      setIsInView(true);
      setIsActive(true);

      // Typing URL after ~450ms
      const tTyping = setTimeout(() => {
        clearIntervalRef.current = typeUrl(
          websiteVizData.url,
          setUrlText,
          setIsTyping,
          55
        );
      }, 450);

      // PageSpeed counter
      const tSpeed = setTimeout(() => {
        countUp(websiteVizData.speedScore.to, setSpeedScore);
      }, websiteVizData.speedScore.cd);

      timeoutsRef.current = [tTyping, tSpeed];
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
      if (clearIntervalRef.current) clearIntervalRef.current();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`${styles.vizCol} ${styles.reveal} ${isInView ? styles.in : ''}`}
      style={{ '--d': '.14s' } as React.CSSProperties}
    >
      <div className={`${styles.browser} ${styles.webAnim} ${isActive ? styles.active : ''}`}>
        <div className={styles.browserBar}>
          <div className={styles.bdots}>
            <i className={styles.br} />
            <i className={styles.by} />
            <i className={styles.bg2} />
          </div>
          <div className={styles.burl}>
            <i />
            <span
              className={`${styles.burlTxt} ${isTyping ? styles.typing : ''}`}
            >
              {urlText}
            </span>
          </div>
          <span className={styles.bspeed}>
            <span>{speedScore}</span> ⚡
          </span>
        </div>

        <div className={styles.browserBody}>
          <div className={styles.bpageHero}>
            <span className={styles.bhTag}>{websiteVizData.heroTag}</span>
            <div className={`${styles.bhLine} ${styles.big}`} />
            <div className={`${styles.bhLine} ${styles.mid}`} />
            <div className={`${styles.bhLine} ${styles.sm}`} />
            <span className={styles.bhBtn}>
              {websiteVizData.heroBtn}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </span>
          </div>

          <div className={styles.techRow}>
            {websiteVizData.tech.map((item) => (
              <span key={item} className={styles.tech}>
                {item}
              </span>
            ))}
          </div>

          <div className={styles.metricsRow}>
            {websiteVizData.metrics.map((metric) => (
              <div key={metric.label} className={styles.met}>
                <div className={styles.mv}>{metric.val}</div>
                <div className={styles.ml}>{metric.label}</div>
              </div>
            ))}
          </div>

          <div className={styles.payRow}>
            {websiteVizData.payments.map((p) => {
              const cls = p.cls === 'bkash' ? styles.bkash : p.cls === 'nagad' ? styles.nagad : p.cls === 'rocket' ? styles.rocket : '';
              return (
                <span key={p.name} className={`${styles.pay} ${cls}`}>
                  {p.name}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
