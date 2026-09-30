"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  FaEye,
  FaArrowPointer,
  FaGlobe,
  FaFlagCheckered,
  FaArrowDown,
} from 'react-icons/fa6';
import styles from './GoogleAds.module.css';
import { funnelStagesData } from './googleAdsData';

const stageIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FaEye,
  FaArrowPointer,
  FaGlobe,
  FaFlagCheckered,
};

export default function GaFunnel() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  const [counterValues, setCounterValues] = useState<{ [key: string]: number }>({
    impressions: 50000,
    clicks: 1800,
    visits: 1750,
    leads: 85,
  });

  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 700);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isReduced = reducedMotionQuery.matches;
    setPrefersReducedMotion(isReduced);

    if (isReduced) {
      setHasAnimated(true);
      return () => {
        window.removeEventListener('resize', checkMobile);
      };
    }

    // Reset counters to 0 for initial client load before scrolling into view
    setCounterValues({
      impressions: 0,
      clicks: 0,
      visits: 0,
      leads: 0,
    });

    let rafId: number | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setHasAnimated(true);

          const duration = 1400;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);

            setCounterValues({
              impressions: Math.floor(easeProgress * 50000),
              clicks: Math.floor(easeProgress * 1800),
              visits: Math.floor(easeProgress * 1750),
              leads: Math.floor(easeProgress * 85),
            });

            if (progress < 1) {
              rafId = requestAnimationFrame(animate);
            } else {
              setCounterValues({
                impressions: 50000,
                clicks: 1800,
                visits: 1750,
                leads: 85,
              });
            }
          };

          rafId = requestAnimationFrame(animate);
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
      window.removeEventListener('resize', checkMobile);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  const getBarWidth = (stageWidth: number, index: number) => {
    if (!isMounted || prefersReducedMotion || hasAnimated) {
      if (isMobile) {
        return `${(38 + stageWidth * 0.62).toFixed(2)}%`;
      }
      return `${stageWidth}%`;
    }
    return '0%';
  };

  return (
    <div ref={wrapRef} className={styles.funnelWrap}>
      {funnelStagesData.map((stage, idx) => {
        const IconComponent = stageIconMap[stage.iconKey] || FaEye;
        const currentCount = counterValues[stage.id] ?? stage.target;
        const formattedValue = currentCount.toLocaleString('en-US');

        return (
          <React.Fragment key={stage.id}>
            <div className={styles.funnelStage}>
              <div
                className={`${styles.funnelBar} ${
                  stage.isHighlight ? styles.funnelBarHighlight : ''
                }`}
                style={{
                  width: getBarWidth(stage.stageWidth, idx),
                  transitionDelay: hasAnimated ? `${idx * 150}ms` : '0ms',
                }}
              >
                <IconComponent className={styles.funnelBarIcon} aria-hidden="true" />
                <span className={styles.funnelLabel}>{stage.label}</span>
                <span className={styles.funnelNum}>{formattedValue}</span>
              </div>
              <p className={styles.funnelNote}>{stage.note}</p>
            </div>

            {stage.dropRate && (
              <div className={styles.funnelDrop}>
                <FaArrowDown className={styles.funnelDropIcon} aria-hidden="true" />
                <span>{stage.dropRate}</span>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
