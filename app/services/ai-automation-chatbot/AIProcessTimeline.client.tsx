"use client";

import React, { useEffect, useRef, useState } from 'react';
import {
  FaPhoneVolume,
  FaDiagramProject,
  FaRobot,
  FaFlask,
  FaRocket,
} from 'react-icons/fa6';
import styles from './AIAutomation.module.css';
import { howWeWorkData } from './aiAutomationData';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FaPhoneVolume,
  FaDiagramProject,
  FaRobot,
  FaFlask,
  FaRocket,
};

export default function AIProcessTimeline() {
  const [animatedSteps, setAnimatedSteps] = useState<boolean[]>([
    true,
    true,
    true,
    true,
    true,
  ]);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isReduced = reducedMotionQuery.matches;
    setPrefersReducedMotion(isReduced);

    if (isReduced) {
      setIsMounted(true);
      setAnimatedSteps([true, true, true, true, true]);
      return;
    }

    setIsMounted(true);
    setAnimatedSteps([false, false, false, false, false]);

    const observers: IntersectionObserver[] = [];

    stepRefs.current.forEach((el, idx) => {
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry && entry.isIntersecting) {
            setAnimatedSteps((prev) => {
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
    <div className={styles.processWrap}>
      <div className={styles.processLine}>
        <span className={styles.processFlowDot} aria-hidden="true" />
      </div>
      <div className={styles.processGrid}>
        {howWeWorkData.map((step, idx) => {
          const IconComponent = iconMap[step.iconKey] || FaRobot;
          const shouldAnimate = isMounted && !prefersReducedMotion;
          const isStepIn = !shouldAnimate || animatedSteps[idx];

          return (
            <div
              key={step.stepNumber}
              ref={(el) => {
                stepRefs.current[idx] = el;
              }}
              className={`${styles.processStep} ${isStepIn ? styles.stepIn : ''}`}
            >
              <div className={styles.stepCircle}>
                <IconComponent />
                <span className={styles.stepNum}>{step.stepNumber}</span>
              </div>
              <div className={styles.processStepText}>
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
