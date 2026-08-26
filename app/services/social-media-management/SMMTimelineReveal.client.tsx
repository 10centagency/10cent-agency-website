"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  FaFlagCheckered,
  FaCalendarDays,
  FaPenRuler,
  FaRocket,
  FaChartLine,
} from 'react-icons/fa6';
import styles from './SocialMediaManagement.module.css';
import { timelineMilestonesData } from './socialMediaData';

const timelineIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FaFlagCheckered,
  FaCalendarDays,
  FaPenRuler,
  FaRocket,
  FaChartLine,
};

export default function SMMTimelineReveal() {
  const [animatedMilestones, setAnimatedMilestones] = useState<boolean[]>([
    true,
    true,
    true,
    true,
    true,
  ]);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isReduced = reducedMotionQuery.matches;
    setPrefersReducedMotion(isReduced);

    if (isReduced) {
      setIsMounted(true);
      setAnimatedMilestones([true, true, true, true, true]);
      return;
    }

    setIsMounted(true);
    setAnimatedMilestones([false, false, false, false, false]);

    const observers: IntersectionObserver[] = [];

    itemRefs.current.forEach((el, idx) => {
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry && entry.isIntersecting) {
            setAnimatedMilestones((prev) => {
              const next = [...prev];
              next[idx] = true;
              return next;
            });
            observer.disconnect();
          }
        },
        { threshold: 0.35 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  return (
    <div className={styles.timeline30List}>
      {timelineMilestonesData.map((item, idx) => {
        const MilestoneIcon = timelineIconMap[item.iconKey] || FaFlagCheckered;
        const isLeft = item.align === 'left';

        // SSR / reduced motion: visible. Client: state controlled.
        const shouldAnimate = isMounted && !prefersReducedMotion;
        const isVisible = !shouldAnimate || animatedMilestones[idx];

        return (
          <div
            key={idx}
            ref={(el) => {
              itemRefs.current[idx] = el;
            }}
            className={`${styles.timeline30Item} ${
              isLeft ? styles.timeline30ItemLeft : styles.timeline30ItemRight
            } ${isVisible ? styles.timeline30ItemIn : ''}`}
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(22px)',
              transition: shouldAnimate
                ? `opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1), transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)`
                : 'none',
            }}
          >
            <div className={styles.timeline30Dot}>
              <MilestoneIcon aria-hidden="true" />
            </div>
            <div className={styles.timeline30Card}>
              <span className={styles.timeline30Days}>{item.dayRange}</span>
              <h4>{item.title}</h4>
              <ul>
                {item.bullets.map((bullet, bIdx) => (
                  <li key={bIdx}>{bullet}</li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}
