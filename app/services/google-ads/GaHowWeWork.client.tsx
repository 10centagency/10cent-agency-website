"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  FaMagnifyingGlass,
  FaKey,
  FaCode,
  FaRocket,
  FaFilter,
  FaChartLine,
} from 'react-icons/fa6';
import styles from './GoogleAds.module.css';
import { howWeWorkSteps } from './googleAdsData';

const stepIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FaMagnifyingGlass,
  FaKey,
  FaCode,
  FaRocket,
  FaFilter,
  FaChartLine,
};

export default function GaHowWeWork() {
  const [visibleSteps, setVisibleSteps] = useState<Record<number, boolean>>({});
  const [isClient, setIsClient] = useState<boolean>(false);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setIsClient(true);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      const allVisible: Record<number, boolean> = {};
      howWeWorkSteps.forEach((_, idx) => {
        allVisible[idx] = true;
      });
      setVisibleSteps(allVisible);
      return;
    }

    const observers: IntersectionObserver[] = [];

    stepRefs.current.forEach((el, idx) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry && entry.isIntersecting) {
            setVisibleSteps((prev) => ({ ...prev, [idx]: true }));
            obs.disconnect();
          }
        },
        { threshold: 0.35 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  return (
    <div className={styles.hwTimeline}>
      {howWeWorkSteps.map((step, idx) => {
        const IconComponent = stepIconMap[step.iconKey] || FaMagnifyingGlass;
        const isReverse = idx % 2 === 1;
        const isRevealed = !isClient || !!visibleSteps[idx];
        const revealClass = isRevealed ? styles.hwStepRevealed : styles.hwStepRevealing;

        return (
          <div
            key={step.stepNumber}
            ref={(el) => {
              stepRefs.current[idx] = el;
            }}
            className={`${styles.hwStep} ${isReverse ? styles.hwStepReverse : ''} ${revealClass}`}
          >
            <div className={styles.hwStepCard}>
              <span className={styles.hwTag}>{step.stepTag}</span>
              <h4>
                <IconComponent className={styles.hwStepCardIcon} aria-hidden="true" />
                <span>{step.title}</span>
              </h4>
              <p>{step.description}</p>
            </div>
            <div className={styles.hwStepNum}>{step.stepNumber}</div>
            <div className={styles.hwSpacer} />
          </div>
        );
      })}
    </div>
  );
}
