"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  FaGoogle,
  FaStar,
  FaMicrophone,
  FaWandMagicSparkles,
  FaRobot,
} from 'react-icons/fa6';
import styles from './SeoAeoGeo.module.css';
import { evolutionTimelineData } from './seoAeoGeoData';

const timelineIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FaGoogle,
  FaStar,
  FaMicrophone,
  FaWandMagicSparkles,
  FaRobot,
};

export default function SagEvolutionTimeline() {
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleNodes, setVisibleNodes] = useState<boolean[]>([false, false, false, false, false]);
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setVisibleNodes([true, true, true, true, true]);
      return;
    }

    const observers: IntersectionObserver[] = [];

    nodeRefs.current.forEach((el, index) => {
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry && entry.isIntersecting) {
            setVisibleNodes((prev) => {
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
    <div className={styles.timelineWrap}>
      <div className={styles.timelineLineH} />
      <div className={styles.timelineTrack}>
        {evolutionTimelineData.map((node, idx) => {
          const IconComponent = timelineIconMap[node.iconKey] || FaGoogle;
          const isVisible = !isClient || visibleNodes[idx];

          return (
            <div
              key={node.id}
              ref={(el) => {
                nodeRefs.current[idx] = el;
              }}
              className={`${styles.timelineNode} ${node.isNow ? styles.timelineNodeNow : ''} ${
                isVisible ? '' : styles.timelineNodeHidden
              }`}
              style={{
                transitionDelay: isVisible ? `${idx * 120}ms` : '0ms',
              }}
            >
              <div className={styles.timelineYear}>{node.year}</div>
              <div className={styles.timelineDot}>
                <IconComponent aria-hidden="true" />
              </div>
              <h4>{node.title}</h4>
              <p>{node.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
