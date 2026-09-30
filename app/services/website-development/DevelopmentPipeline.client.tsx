"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './WebsiteDevelopment.module.css';
import { pipelineStepsData, PipelineStep, PipelineLine } from './websiteDevelopmentData';
import {
  FaTerminal,
  FaLock,
  FaPhoneVolume,
  FaPenRuler,
  FaCode,
  FaVial,
  FaRocket,
  FaCheck,
} from 'react-icons/fa6';

const stepIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  phone: FaPhoneVolume,
  design: FaPenRuler,
  code: FaCode,
  test: FaVial,
  rocket: FaRocket,
};

export default function DevelopmentPipeline() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [visibleLines, setVisibleLines] = useState<PipelineLine[]>([]);
  const [isLiveStatus, setIsLiveStatus] = useState<boolean>(false);
  const [browserStatus, setBrowserStatus] = useState<string>('Gathering requirements...');
  const [browserUrl, setBrowserUrl] = useState<string>('localhost:3000/discovery');

  const sectionRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const isIntersectingRef = useRef<boolean>(false);
  const currentStepRef = useRef<number>(0);
  const runTokenRef = useRef<number>(0);
  const hasStartedRef = useRef<boolean>(false);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  }, []);

  const runStep = useCallback(
    (index: number, isReducedMotion: boolean) => {
      clearAllTimers();
      const token = ++runTokenRef.current;
      currentStepRef.current = index;
      setCurrentStep(index);

      const stepData: PipelineStep = pipelineStepsData[index];
      if (!stepData) return;

      setBrowserUrl(stepData.url);
      setIsLiveStatus(Boolean(stepData.live));
      setBrowserStatus(stepData.status);

      if (isReducedMotion) {
        setVisibleLines(stepData.lines);
        return;
      }

      setVisibleLines([]);
      let delay = 180;

      stepData.lines.forEach((line) => {
        const t = setTimeout(() => {
          if (runTokenRef.current === token) {
            setVisibleLines((prev) => [...prev, line]);
          }
        }, delay);
        timersRef.current.push(t);
        delay += 520;
      });

      // Next step auto-cycle
      const cycleTimer = setTimeout(() => {
        if (
          runTokenRef.current === token &&
          !document.hidden &&
          isIntersectingRef.current
        ) {
          const nextIndex = (index + 1) % pipelineStepsData.length;
          runStep(nextIndex, isReducedMotion);
        }
      }, delay + 1800);
      timersRef.current.push(cycleTimer);
    },
    [clearAllTimers]
  );

  const handleStepClick = (index: number) => {
    const isReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    runStep(index, isReduced);
  };

  useEffect(() => {
    const isReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isReduced) {
      runStep(0, true);
      return;
    }

    const startPipeline = () => {
      if (hasStartedRef.current) return;
      hasStartedRef.current = true;
      isIntersectingRef.current = true;
      runStep(0, false);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          isIntersectingRef.current = true;
          if (!hasStartedRef.current) {
            startPipeline();
          }
        } else {
          isIntersectingRef.current = false;
        }
      },
      { threshold: 0.4 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearAllTimers();
      } else if (isIntersectingRef.current && hasStartedRef.current) {
        runStep(currentStepRef.current, isReduced);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearAllTimers();
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [clearAllTimers, runStep]);

  const progressPercent = ((currentStep + 1) / pipelineStepsData.length) * 100;
  const linePercent = (currentStep / (pipelineStepsData.length - 1)) * 100;

  return (
    <div ref={sectionRef} id="howWeWorkDev">
      {/* Terminal UI */}
      <div className={styles.hwwTerminal}>
        <div className={styles.hwwTerminalTopbar}>
          <div className={styles.hwwTerminalTopbarLeft}>
            <div className={styles.hwwDots}>
              <span className={styles.dotRed} />
              <span className={styles.dotYellow} />
              <span className={styles.dotGreen} />
            </div>
            <div className={styles.hwwTerminalName}>
              <FaTerminal aria-hidden="true" />
              <span className={styles.hwwTerminalNameText}>
                bash — 10cent-build-pipeline
              </span>
            </div>
          </div>
          <div className={styles.hwwTerminalStepBadge}>
            Step {currentStep + 1} / {pipelineStepsData.length}
          </div>
        </div>

        <div className={styles.hwwTerminalProgressTrack}>
          <div
            className={styles.hwwTerminalProgressFill}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className={styles.hwwTerminalBody}>
          {visibleLines.map((line, idx) => {
            const isLast = idx === visibleLines.length - 1;
            return (
              <div
                key={`${currentStep}-${idx}`}
                className={`${styles.hwwLine} ${
                  line.type === 'prompt'
                    ? styles.hwwPrompt
                    : line.type === 'success'
                    ? styles.hwwSuccess
                    : styles.hwwOutput
                }`}
              >
                {line.type === 'prompt' && (
                  <span className={styles.hwwPromptSym}>$</span>
                )}
                {line.text}
                {isLast && <span className={styles.cursorBlink} aria-hidden="true" />}
              </div>
            );
          })}
        </div>

        <div className={styles.hwwBrowserBar}>
          <div className={styles.hwwBrowserUrlGroup}>
            <FaLock className={styles.hwwBrowserUrlIcon} aria-hidden="true" />
            <span className={styles.hwwBrowserUrl}>{browserUrl}</span>
          </div>
          <span
            className={`${styles.hwwBrowserStatus} ${
              isLiveStatus ? styles.hwwBrowserStatusLive : ''
            }`}
          >
            <span className={styles.hwwStatusDot} />
            {isLiveStatus ? 'LIVE' : browserStatus}
          </span>
        </div>
      </div>

      {/* Step Icons Row */}
      <div className={styles.hwwStepsRow}>
        <div className={styles.hwwStepLine}>
          <div
            className={styles.hwwStepLineFill}
            style={{ width: `${linePercent}%` }}
          />
        </div>

        {pipelineStepsData.map((step) => {
          const StepIcon = stepIconMap[step.iconKey] || FaCode;
          const isActive = currentStep === step.step;
          const isDone = currentStep > step.step;

          return (
            <button
              key={step.step}
              type="button"
              className={`${styles.hwwStep} ${
                isActive ? styles.hwwStepActive : ''
              } ${isDone ? styles.hwwStepDone : ''}`}
              onClick={() => handleStepClick(step.step)}
              aria-label={`Step ${step.step + 1}: ${step.title}`}
              aria-current={isActive ? 'step' : undefined}
            >
              <div className={styles.hwwStepCircle}>
                <StepIcon aria-hidden="true" />
                <span className={styles.hwwStepCheck}>
                  <FaCheck aria-hidden="true" />
                </span>
              </div>
              <h4>{step.title}</h4>
              <p>{step.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
