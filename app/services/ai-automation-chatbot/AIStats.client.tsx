"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from './AIAutomation.module.css';

export default function AIStats() {
  const statsRef = useRef<HTMLDivElement>(null);
  const [counters, setCounters] = useState({
    chatbots: 20,
    responseTime: 10,
    resolutionRate: 85,
    retentionRate: 95,
  });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setCounters({
        chatbots: 20,
        responseTime: 10,
        resolutionRate: 85,
        retentionRate: 95,
      });
      return;
    }

    // Set to 0 on client mount before intersection animation
    setCounters({
      chatbots: 0,
      responseTime: 0,
      resolutionRate: 0,
      retentionRate: 0,
    });

    let rafId: number | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          const duration = 1200;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);

            setCounters({
              chatbots: Math.floor(easeProgress * 20),
              responseTime: Math.floor(easeProgress * 10),
              resolutionRate: Math.floor(easeProgress * 85),
              retentionRate: Math.floor(easeProgress * 95),
            });

            if (progress < 1) {
              rafId = requestAnimationFrame(animate);
            } else {
              setCounters({
                chatbots: 20,
                responseTime: 10,
                resolutionRate: 85,
                retentionRate: 95,
              });
            }
          };

          rafId = requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      observer.disconnect();
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <div ref={statsRef} className={styles.statsSection}>
      <div className={styles.statsHeader}>
        <span className={styles.statsTag}>Real Results</span>
        <h2>Our Performance By The Numbers</h2>
        <p>Average results our clients see after launching an AI chatbot &amp; automation system</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>
            <span>{counters.chatbots}</span>+
          </div>
          <div className={styles.statLabel}>Chatbots Deployed</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statNumber}>
            &lt;<span>{counters.responseTime}</span>s
          </div>
          <div className={styles.statLabel}>Avg. Response Time</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statNumber}>
            <span>{counters.resolutionRate}</span>%
          </div>
          <div className={styles.statLabel}>Query Resolution Rate</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statNumber}>
            <span>{counters.retentionRate}</span>%
          </div>
          <div className={styles.statLabel}>Client Retention Rate</div>
        </div>
      </div>

      <div className={styles.donutWrap}>
        <div className={styles.donut}>
          <div className={styles.donutInner}>
            <strong>60%</strong>
            <span>Resolved by Bot</span>
          </div>
        </div>
        <div className={styles.donutLegend}>
          <h4>Conversation Resolution Breakdown (Sample)</h4>
          <p>
            On average, 60% of customer conversations are fully resolved by the AI chatbot alone —
            with the remaining 40% smoothly handed over to a human when needed.
          </p>
        </div>
      </div>
    </div>
  );
}
