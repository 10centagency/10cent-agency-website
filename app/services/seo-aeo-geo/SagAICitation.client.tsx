"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  FaRobot,
  FaUser,
  FaWandMagicSparkles,
  FaLink,
  FaCircleInfo,
} from 'react-icons/fa6';
import styles from './SeoAeoGeo.module.css';
import { aiCitationData } from './seoAeoGeoData';

export default function SagAICitation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUserMsg, setShowUserMsg] = useState<boolean>(false);
  const [showAiMsg, setShowAiMsg] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setShowUserMsg(true);
      setShowAiMsg(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setShowUserMsg(true);
          setTimeout(() => {
            setShowAiMsg(true);
          }, 350);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const userVisible = !isClient || showUserMsg;
  const aiVisible = !isClient || showAiMsg;

  return (
    <div>
      <div ref={containerRef} className={styles.chatProofWrap}>
        {/* Chat Header */}
        <div className={styles.chatProofHeader}>
          <FaRobot className={styles.chatProofHeaderIcon} aria-hidden="true" />
          <span className={styles.chatProofHeaderTitle}>{aiCitationData.assistantTitle}</span>
          <span className={styles.cpLive}>{aiCitationData.liveBadgeText}</span>
        </div>

        {/* User Message */}
        <div
          className={`${styles.chatMsg} ${styles.chatMsgUser} ${
            userVisible ? '' : styles.chatMsgHidden
          }`}
        >
          <div className={`${styles.chatAvatar} ${styles.chatAvatarUser}`}>
            <FaUser aria-hidden="true" />
          </div>
          <div className={styles.chatText}>
            <strong>You:</strong> {aiCitationData.userQuestion}
          </div>
        </div>

        {/* AI Answer Message */}
        <div
          className={`${styles.chatMsg} ${styles.chatMsgAi} ${
            aiVisible ? '' : styles.chatMsgHidden
          }`}
        >
          <div className={`${styles.chatAvatar} ${styles.chatAvatarAi}`}>
            <FaWandMagicSparkles aria-hidden="true" />
          </div>
          <div className={styles.chatText}>
            {aiCitationData.aiAnswerPrefix}
            <strong>{aiCitationData.aiAnswerBold}</strong>
            {aiCitationData.aiAnswerBody}
            <br />
            <div className={styles.chatCite}>
              <FaLink aria-hidden="true" /> {aiCitationData.citationSource}
            </div>
          </div>
        </div>
      </div>

      {/* Caption with baseline-aligned info icon */}
      <p className={styles.serpCaption} style={{ marginTop: '20px' }}>
        <FaCircleInfo className={styles.serpCaptionIcon} aria-hidden="true" />
        <span>{aiCitationData.captionText}</span>
      </p>
    </div>
  );
}
