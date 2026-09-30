"use client";

import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
import Link from 'next/link';
import {
  FaArrowTrendUp,
  FaLaptopCode,
  FaRobot,
  FaArrowRight,
} from 'react-icons/fa6';
import styles from './AboutSections.module.css';
import { caseStudiesData, numbersData } from './aboutSectionsData';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/* ==========================================================================
   Case Study Card Component (Section 2)
   ========================================================================== */
interface CaseStudyCardProps {
  id: string;
  tag: string;
  iconName: 'FaArrowTrendUp' | 'FaLaptopCode' | 'FaRobot';
  client: string;
  prefix?: string;
  target: number;
  decimals?: number;
  unit: string;
  metricLabel: string;
  description: string;
  visualType: 'bars' | 'duo' | 'bot';
  delay?: string;
}

export function AbCaseCard({
  tag,
  iconName,
  client,
  prefix = '',
  target,
  decimals = 0,
  unit,
  metricLabel,
  description,
  visualType,
  delay = '0s',
}: CaseStudyCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  // SSR initial value is final target
  const [displayValue, setDisplayValue] = useState<string>(
    target.toFixed(decimals)
  );
  const [isVisible, setIsVisible] = useState(true);

  useIsomorphicLayoutEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setDisplayValue(target.toFixed(decimals));
      setIsVisible(true);
      return;
    }

    // Reset to 0 for count-up animation on view
    setDisplayValue((0).toFixed(decimals));
    setIsVisible(false);

    let rafId: number | null = null;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setIsVisible(true);
          const duration = 1400;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            const currentVal = target * ease;
            setDisplayValue(currentVal.toFixed(decimals));

            if (progress < 1) {
              rafId = requestAnimationFrame(animate);
            } else {
              setDisplayValue(target.toFixed(decimals));
            }
          };

          rafId = requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      observer.disconnect();
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [target, decimals]);

  const TagIcon =
    iconName === 'FaArrowTrendUp'
      ? FaArrowTrendUp
      : iconName === 'FaLaptopCode'
      ? FaLaptopCode
      : FaRobot;

  return (
    <div
      ref={cardRef}
      className={`${styles.caseCard} ${styles.fadeUp} ${
        isVisible ? `${styles.visible} ${styles.caseCardInView}` : ''
      }`}
      style={{ '--delay': delay } as React.CSSProperties}
    >
      <div className={styles.caseTag}>
        <TagIcon aria-hidden="true" /> {tag}
      </div>
      <span className={styles.caseClient}>{client}</span>

      <div className={styles.caseMetric}>
        {prefix && <span className={styles.prefix}>{prefix}</span>}
        <span>{displayValue}</span>
        <span className={styles.unit}>{unit}</span>
      </div>
      <div className={styles.caseMetricLabel}>{metricLabel}</div>
      <p className={styles.caseDesc}>{description}</p>

      {/* Visual Type 1: Bars */}
      {visualType === 'bars' && (
        <div className={styles.bars} aria-hidden="true">
          <div
            className={`${styles.bar} ${styles.dim}`}
            style={{ '--h': '32%', '--bd': '0.15s' } as React.CSSProperties}
          />
          <div
            className={`${styles.bar} ${styles.dim}`}
            style={{ '--h': '46%', '--bd': '0.25s' } as React.CSSProperties}
          />
          <div
            className={`${styles.bar} ${styles.dim}`}
            style={{ '--h': '58%', '--bd': '0.35s' } as React.CSSProperties}
          />
          <div
            className={`${styles.bar} ${styles.dim}`}
            style={{ '--h': '76%', '--bd': '0.45s' } as React.CSSProperties}
          />
          <div
            className={`${styles.bar} ${styles.full}`}
            style={{ '--h': '100%', '--bd': '0.55s' } as React.CSSProperties}
          />
        </div>
      )}

      {/* Visual Type 2: Duo Before/After Bars */}
      {visualType === 'duo' && (
        <div className={styles.duo} aria-hidden="true">
          <div className={styles.duoRow}>
            <span>Before</span>
            <div className={styles.duoBar}>
              <div
                className={`${styles.duoFill} ${styles.gray}`}
                style={{ '--w': '38%', '--bd': '0.2s' } as React.CSSProperties}
              />
            </div>
          </div>
          <div className={styles.duoRow}>
            <span>After</span>
            <div className={styles.duoBar}>
              <div
                className={`${styles.duoFill} ${styles.grad}`}
                style={{ '--w': '100%', '--bd': '0.5s' } as React.CSSProperties}
              />
            </div>
          </div>
        </div>
      )}

      {/* Visual Type 3: Bot Active Status Box */}
      {visualType === 'bot' && (
        <div className={styles.botBox}>
          <span className={styles.liveDot} aria-hidden="true" />
          <div>
            <strong>Bot active — answering right now</strong>
            <span>Messenger · WhatsApp · Telegram</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   Case Studies Grid Section (Section 2)
   ========================================================================== */
export function AbCaseStudiesGrid() {
  const delays = ['0s', '0.12s', '0.24s'];

  return (
    <div className={styles.caseGrid}>
      {caseStudiesData.items.map((item, idx) => (
        <AbCaseCard
          key={item.id}
          {...item}
          delay={delays[idx % delays.length]}
        />
      ))}
    </div>
  );
}

/* ==========================================================================
   By The Numbers Stats Band (Section 4)
   ========================================================================== */
export function AbStatsBand() {
  const statsRef = useRef<HTMLDivElement>(null);
  // SSR initial values are final targets
  const [displayValues, setDisplayValues] = useState<Array<number | string>>([
    40,
    98,
    7,
    '24/7',
  ]);
  const [isVisible, setIsVisible] = useState(true);

  useIsomorphicLayoutEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setDisplayValues([40, 98, 7, '24/7']);
      setIsVisible(true);
      return;
    }

    // Reset numeric counters to 0 for count-up
    setDisplayValues([0, 0, 0, '24/7']);
    setIsVisible(false);

    let rafId: number | null = null;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setIsVisible(true);
          const duration = 1400;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);

            setDisplayValues([
              Math.floor(ease * 40),
              Math.floor(ease * 98),
              Math.floor(ease * 7),
              '24/7',
            ]);

            if (progress < 1) {
              rafId = requestAnimationFrame(animate);
            } else {
              setDisplayValues([40, 98, 7, '24/7']);
            }
          };

          rafId = requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      observer.disconnect();
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={statsRef} className={styles.stats}>
      {numbersData.stats.map((stat, idx) => {
        const val = displayValues[idx] ?? stat.target;
        return (
          <div
            key={stat.label}
            className={`${styles.stat} ${styles.fadeUp} ${
              isVisible ? styles.visible : ''
            }`}
            style={{ '--delay': stat.delay } as React.CSSProperties}
          >
            <div className={styles.statNum}>
              <span>{val}</span>
              {stat.suffix && (
                <span className={styles.statSuffix}>{stat.suffix}</span>
              )}
            </div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
        );
      })}
    </div>
  );
}
