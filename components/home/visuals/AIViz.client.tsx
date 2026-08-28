'use client';

import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
import styles from '../HomeSections.module.css';
import { aiVizData } from '../homeSectionsData';

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

export default function AIViz() {
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Initial state === Final SSR state
  const [isActive, setIsActive] = useState(true);
  const [isInView, setIsInView] = useState(true);

  // Channel counters
  const [ch1, setCh1] = useState(aiVizData.channels[0].val);
  const [ch2, setCh2] = useState(aiVizData.channels[1].val);
  const [ch3, setCh3] = useState(aiVizData.channels[2].val);

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

      const t1 = setTimeout(() => {
        countUp(aiVizData.channels[0].to, setCh1, {
          dec: aiVizData.channels[0].dec,
          suffix: aiVizData.channels[0].suffix,
        });
      }, aiVizData.channels[0].cd);

      const t2 = setTimeout(() => {
        countUp(aiVizData.channels[1].to, setCh2, {
          dec: aiVizData.channels[1].dec,
          suffix: aiVizData.channels[1].suffix,
        });
      }, aiVizData.channels[1].cd);

      const t3 = setTimeout(() => {
        countUp(aiVizData.channels[2].to, setCh3, {
          dec: aiVizData.channels[2].dec,
        });
      }, aiVizData.channels[2].cd);

      timeoutsRef.current = [t1, t2, t3];
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
      <div className={`${styles.aiAnim} ${isActive ? styles.active : ''}`}>
        {/* Chat Terminal */}
        <div className={styles.terminal}>
          <div className={styles.termBar}>
            <div className={styles.bdots}>
              <i className={styles.br} />
              <i className={styles.by} />
              <i className={styles.bg2} />
            </div>
            <span className={styles.termTitle}>{aiVizData.assistantTitle}</span>
            <span className={styles.termStatus}>{aiVizData.assistantStatus}</span>
          </div>

          <div className={styles.termBody}>
            {/* Msg 1 */}
            <div className={styles.chatMsg}>
              <span className={`${styles.chatAv} ${styles.avAi}`}>AI</span>
              <div>
                <div className={`${styles.bubble} ${styles.ai}`}>
                  {aiVizData.chatMessages[0].text}
                </div>
              </div>
            </div>

            {/* Msg 2 */}
            <div className={`${styles.chatMsg} ${styles.right}`}>
              <span className={`${styles.chatAv} ${styles.avUsr}`}>U</span>
              <div className={`${styles.bubble} ${styles.usr}`}>
                {aiVizData.chatMessages[1].text}
              </div>
            </div>

            {/* Msg 3 */}
            <div className={styles.chatMsg}>
              <span className={`${styles.chatAv} ${styles.avAi}`}>AI</span>
              <div>
                <div className={`${styles.bubble} ${styles.ai}`}>
                  {aiVizData.chatMessages[2].text}
                  <br />
                  {aiVizData.chatMessages[2].subtext}
                </div>
                {aiVizData.chatMessages[2].quickBtns && (
                  <div className={styles.quickBtns}>
                    {aiVizData.chatMessages[2].quickBtns.map((btn) => (
                      <span key={btn} className={styles.qbtn}>
                        {btn}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Channel stats */}
        <div className={styles.channels}>
          <div className={styles.ch} style={{ color: aiVizData.channels[0].color }}>
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Z" />
            </svg>
            <span className={styles.cnt}>{ch1}</span>
            {aiVizData.channels[0].name}
          </div>

          <div className={styles.ch} style={{ color: aiVizData.channels[1].color }}>
            <svg viewBox="0 0 320 512" fill="currentColor" aria-hidden="true">
              <path d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z" />
            </svg>
            <span className={styles.cnt}>{ch2}</span>
            {aiVizData.channels[1].name}
          </div>

          <div className={styles.ch} style={{ color: aiVizData.channels[2].color }}>
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="m21 3-19 8 6 2 2 6 3-4 6 4z" />
            </svg>
            <span className={styles.cnt}>{ch3}</span>
            {aiVizData.channels[2].name}
          </div>
        </div>

        {/* n8n workflow */}
        <div className={styles.workflow}>
          <div className={styles.workflowSteps}>
            <div className={styles.ws}>
              <div className={`${styles.wn} ${styles.wnDone}`}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  aria-hidden="true"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <span className={styles.wnLbl}>{aiVizData.workflowSteps[0].label}</span>
            </div>

            <div className={styles.ws}>
              <div className={`${styles.wn} ${styles.wnDone}`}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <path d="M8 9h8M8 13h5" />
                </svg>
              </div>
              <span className={styles.wnLbl}>{aiVizData.workflowSteps[1].label}</span>
            </div>

            <div className={styles.ws}>
              <div className={`${styles.wn} ${styles.wnPend}`}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M22 2 11 13" />
                  <path d="M22 2 15 22l-4-9-9-4Z" />
                </svg>
              </div>
              <span className={styles.wnLbl}>{aiVizData.workflowSteps[2].label}</span>
            </div>

            <div className={styles.ws}>
              <div className={`${styles.wn} ${styles.wnWait}`}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 7v5l3 2" />
                </svg>
              </div>
              <span className={styles.wnLbl}>{aiVizData.workflowSteps[3].label}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
