"use client";

import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import {
  FaFaceFrown,
  FaFaceSmile,
  FaCheck,
  FaXmark,
} from 'react-icons/fa6';
import styles from './AboutSections.module.css';
import { problemBeforeAfterData } from './aboutSectionsData';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function AbBeforeAfter() {
  const [activeTab, setActiveTab] = useState<'before' | 'after'>('before');
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isCardVisible, setIsCardVisible] = useState(true);

  const cardRef = useRef<HTMLDivElement>(null);
  const userTouchedRef = useRef(false);
  const timer1Ref = useRef<NodeJS.Timeout | null>(null);
  const timer2Ref = useRef<NodeJS.Timeout | null>(null);

  useIsomorphicLayoutEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setIsCardVisible(true);
      return;
    }

    setIsCardVisible(false);

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setIsCardVisible(true);

          // One-time auto-demo per owner demo
          if (!userTouchedRef.current) {
            timer1Ref.current = setTimeout(() => {
              if (!userTouchedRef.current) {
                setActiveTab('after');
              }
            }, 1600);

            timer2Ref.current = setTimeout(() => {
              if (!userTouchedRef.current) {
                setActiveTab('before');
              }
            }, 4300);
          }

          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      observer.disconnect();
      if (timer1Ref.current) clearTimeout(timer1Ref.current);
      if (timer2Ref.current) clearTimeout(timer2Ref.current);
    };
  }, []);

  const handleToggle = (tab: 'before' | 'after') => {
    userTouchedRef.current = true;
    setHasInteracted(true);
    if (timer1Ref.current) clearTimeout(timer1Ref.current);
    if (timer2Ref.current) clearTimeout(timer2Ref.current);
    setActiveTab(tab);
  };

  const isAfter = activeTab === 'after';

  return (
    <div className={styles.tfWrap}>
      {/* Toggle Pill */}
      <div
        className={`${styles.tfToggle} ${isAfter ? styles.after : ''}`}
        role="group"
        aria-label="Before and after transformation switcher"
      >
        <div className={styles.tfSlider} aria-hidden="true" />
        <button
          type="button"
          onClick={() => handleToggle('before')}
          className={!isAfter ? styles.activeBefore : ''}
          aria-pressed={!isAfter}
          aria-controls="tfCard"
        >
          Before
        </button>
        <button
          type="button"
          onClick={() => handleToggle('after')}
          className={isAfter ? styles.activeAfter : ''}
          aria-pressed={isAfter}
          aria-controls="tfCard"
        >
          After
        </button>
      </div>

      {/* Interactive Hint */}
      <div
        className={`${styles.tfHint} ${hasInteracted ? styles.gone : ''}`}
        aria-hidden="true"
      >
        <span className={styles.hintDot} />
        {problemBeforeAfterData.hint}
      </div>

      {/* Comparison Card (Contains BOTH layers for complete SSR HTML) */}
      <div
        ref={cardRef}
        id="tfCard"
        className={`${styles.tfCard} ${styles.fadeUp} ${
          isCardVisible ? styles.visible : ''
        } ${isAfter ? styles.after : ''}`}
      >
        <div className={styles.tfStack}>
          {/* BEFORE LAYER */}
          <div
            id="tfLayerBefore"
            className={`${styles.tfLayer} ${!isAfter ? styles.active : ''}`}
            aria-hidden={isAfter}
          >
            <div className={styles.tfHead}>
              <div className={`${styles.tfFace} ${styles.frown}`} aria-hidden="true">
                <FaFaceFrown />
              </div>
              <div>
                <strong>{problemBeforeAfterData.beforeLayer.title}</strong>
                <span>{problemBeforeAfterData.beforeLayer.subtitle}</span>
              </div>
            </div>
            <ul className={styles.tfList}>
              {problemBeforeAfterData.beforeLayer.points.map((point, i) => (
                <li key={i}>
                  <span className={`${styles.vsIc} ${styles.no}`} aria-hidden="true">
                    <FaXmark />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
            <div className={styles.tfMood}>
              <div className={styles.tfMoodLabel}>
                <span>{problemBeforeAfterData.beforeLayer.moodLabel}</span>
                <span>{problemBeforeAfterData.beforeLayer.moodPercentage}%</span>
              </div>
              <div className={styles.tfMoodBar}>
                <div
                  className={`${styles.tfMoodFill} ${styles.red}`}
                  style={
                    {
                      '--w': `${problemBeforeAfterData.beforeLayer.moodPercentage}%`,
                    } as React.CSSProperties
                  }
                />
              </div>
            </div>
          </div>

          {/* AFTER LAYER */}
          <div
            id="tfLayerAfter"
            className={`${styles.tfLayer} ${styles.tfLayerAfter} ${
              isAfter ? styles.active : ''
            }`}
            aria-hidden={!isAfter}
          >
            <div className={styles.tfHead}>
              <div className={`${styles.tfFace} ${styles.smile}`} aria-hidden="true">
                <FaFaceSmile />
              </div>
              <div>
                <strong>{problemBeforeAfterData.afterLayer.title}</strong>
                <span>{problemBeforeAfterData.afterLayer.subtitle}</span>
              </div>
            </div>
            <ul className={styles.tfList}>
              {problemBeforeAfterData.afterLayer.points.map((point, i) => (
                <li key={i}>
                  <span className={`${styles.vsIc} ${styles.ok}`} aria-hidden="true">
                    <FaCheck />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
            <div className={styles.tfMood}>
              <div className={styles.tfMoodLabel}>
                <span>{problemBeforeAfterData.afterLayer.moodLabel}</span>
                <span>{problemBeforeAfterData.afterLayer.moodPercentage}%</span>
              </div>
              <div className={styles.tfMoodBar}>
                <div
                  className={`${styles.tfMoodFill} ${styles.teal}`}
                  style={
                    {
                      '--w': `${problemBeforeAfterData.afterLayer.moodPercentage}%`,
                    } as React.CSSProperties
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Caption */}
      <div className={styles.tfCaption}>
        <span
          id="tfCapBefore"
          className={`${styles.tfCapItem} ${styles.tfCapBefore} ${
            !isAfter ? styles.on : ''
          }`}
        >
          {problemBeforeAfterData.captions.before}
        </span>
        <span
          id="tfCapAfter"
          className={`${styles.tfCapItem} ${styles.tfCapAfter} ${
            isAfter ? styles.on : ''
          }`}
        >
          {problemBeforeAfterData.captions.after}
        </span>
      </div>
    </div>
  );
}
