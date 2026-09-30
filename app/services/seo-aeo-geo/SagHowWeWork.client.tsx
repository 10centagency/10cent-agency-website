"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  FaMagnifyingGlass,
  FaDiagramProject,
  FaCode,
  FaLink,
  FaChartLine,
} from 'react-icons/fa6';
import styles from './SeoAeoGeo.module.css';
import { howWeWorkStepsData } from './seoAeoGeoData';

const stepIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FaMagnifyingGlass,
  FaDiagramProject,
  FaCode,
  FaLink,
  FaChartLine,
};

export default function SagHowWeWork() {
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleSteps, setVisibleSteps] = useState<boolean[]>([false, false, false, false, false]);
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setVisibleSteps([true, true, true, true, true]);
      return;
    }

    const observers: IntersectionObserver[] = [];

    stepRefs.current.forEach((el, index) => {
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry && entry.isIntersecting) {
            setVisibleSteps((prev) => {
              const updated = [...prev];
              updated[index] = true;
              return updated;
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
    <div className={styles.hwTimeline}>
      {howWeWorkStepsData.map((step, idx) => {
        const IconComponent = stepIconMap[step.iconKey] || FaMagnifyingGlass;
        const isReverse = idx % 2 === 1;
        const isVisible = !isClient || visibleSteps[idx];

        const cardHiddenClass = isReverse
          ? styles.hwStepCardHiddenRight
          : styles.hwStepCardHiddenLeft;

        return (
          <div
            key={step.stepNumber}
            ref={(el) => {
              stepRefs.current[idx] = el;
            }}
            className={`${styles.hwStep} ${isReverse ? styles.hwStepReverse : ''}`}
          >
            <div
              className={`${styles.hwStepCard} ${isVisible ? '' : cardHiddenClass}`}
              style={{
                transitionDelay: isVisible ? `${idx * 100}ms` : '0ms',
              }}
            >
              <span className={styles.hwTag}>{step.stepTag}</span>
              <h4>
                <IconComponent className={styles.hwStepCardIcon} aria-hidden="true" />
                <span>{step.title}</span>
              </h4>
              <p>{step.description}</p>
            </div>

            <div
              className={`${styles.hwStepNum} ${isVisible ? '' : styles.hwStepNumHidden}`}
              style={{
                transitionDelay: isVisible ? `${idx * 100 + 100}ms` : '0ms',
              }}
            >
              {step.stepNumber}
            </div>

            <div className={styles.hwSpacer} />
          </div>
        );
      })}
    </div>
  );
}
