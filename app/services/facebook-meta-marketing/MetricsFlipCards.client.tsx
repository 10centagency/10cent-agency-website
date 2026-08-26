"use client";

import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import styles from './FacebookMetaMkt.module.css';
import { metricsCardsData, MetricCardItem } from './facebookMetaData';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function MetricsFlipCards() {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [revealedCards, setRevealedCards] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    metricsCardsData.forEach((m) => {
      init[m.id] = true;
    });
    return init;
  });

  const gridRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef<boolean>(false);

  useIsomorphicLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    // Reset to pre-reveal state for scroll animation
    const pre: Record<string, boolean> = {};
    metricsCardsData.forEach((m) => {
      pre[m.id] = false;
    });
    setRevealedCards(pre);

    const el = gridRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          metricsCardsData.forEach((m, idx) => {
            setTimeout(() => {
              setRevealedCards((prev) => ({
                ...prev,
                [m.id]: true,
              }));
            }, idx * 80);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  const toggleCard = (id: string) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleCard(id);
    }
  };

  return (
    <div ref={gridRef} className={styles.metricGrid}>
      {metricsCardsData.map((metric: MetricCardItem) => {
        const IconComponent = metric.icon;
        const isFlipped = !!flippedCards[metric.id];
        const isRevealed = !!revealedCards[metric.id];

        return (
          <div
            key={metric.id}
            role="button"
            tabIndex={0}
            aria-pressed={isFlipped}
            aria-label={`${metric.title}: ${metric.shortDesc}. Press to view explanation.`}
            onClick={() => toggleCard(metric.id)}
            onKeyDown={(e) => handleKeyDown(e, metric.id)}
            className={`${styles.metricCard} ${
              isFlipped ? styles.metricCardFlipped : ''
            } ${isRevealed ? styles.metricCardReveal : ''}`}
          >
            <div className={styles.metricInner}>
              {/* Front Face */}
              <div className={styles.metricFront}>
                <div className={styles.metricIcon}>
                  <IconComponent aria-hidden="true" />
                </div>
                <h4>{metric.title}</h4>
                <p>{metric.shortDesc}</p>
              </div>

              {/* Back Face */}
              <div className={styles.metricBack}>
                <h4>{metric.backTitle}</h4>
                <p>{metric.explanation}</p>
                <span className={styles.metricTag}>{metric.tag}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
