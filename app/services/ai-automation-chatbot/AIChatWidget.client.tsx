"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  FaRobot,
  FaPhone,
  FaMinus,
  FaXmark,
  FaUser,
  FaPaperPlane,
  FaCircleInfo,
} from 'react-icons/fa6';
import styles from './AIAutomation.module.css';

export default function AIChatWidget() {
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const hasAnimatedRef = useRef(false);

  // States for progressive reveal
  // Initial state: SSR / JS-off renders everything visible. Once client mounts, if animation is enabled, we sequence it.
  const [mounted, setMounted] = useState(false);
  const [showUser, setShowUser] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [showBot, setShowBot] = useState(true);
  const [showQuickReplies, setShowQuickReplies] = useState(true);

  useEffect(() => {
    setMounted(true);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setShowUser(true);
      setIsTyping(false);
      setShowBot(true);
      setShowQuickReplies(true);
      return;
    }

    // Prepare for animation
    setShowUser(false);
    setIsTyping(false);
    setShowBot(false);
    setShowQuickReplies(false);

    const el = containerRef.current;
    if (!el) return;

    const startSequence = () => {
      if (hasAnimatedRef.current) return;
      hasAnimatedRef.current = true;

      // 1. User message appears
      const t1 = setTimeout(() => {
        setShowUser(true);
      }, 150);

      // 2. Typing indicator appears
      const t2 = setTimeout(() => {
        setIsTyping(true);
      }, 800);

      // 3. Typing disappears & Bot message appears
      const t3 = setTimeout(() => {
        setIsTyping(false);
        setShowBot(true);
      }, 2400);

      // 4. Quick replies appear
      const t4 = setTimeout(() => {
        setShowQuickReplies(true);
      }, 3000);

      timeoutsRef.current = [t1, t2, t3, t4];
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
      timeoutsRef.current.forEach((id) => clearTimeout(id));
    };
  }, []);

  return (
    <div className={`${styles.container} ${styles.chatSectionContainer}`}>
      <div className={styles.chatAnswerWrap} data-chat-widget>
        {/* Header */}
        <div className={styles.chatHeader}>
          <div className={styles.chatAvatar}>
            <FaRobot aria-hidden="true" />
            <span className={styles.chatStatusDot} aria-hidden="true" />
          </div>
          <div className={styles.chatHeaderInfo}>
            <h4>10 Cent AI Assistant</h4>
            <span>
              <span className={styles.chatOnlineDot}>●</span> Online · Replies Instantly
            </span>
          </div>
          <div className={styles.chatHeaderIcons} aria-hidden="true">
            <FaPhone className={styles.chatHeaderIconsPhone} />
            <FaMinus className={styles.chatHeaderIconsMinus} />
            <FaXmark />
          </div>
        </div>

        {/* Chat Body — Observed for scroll entrance */}
        <div className={styles.chatBody} ref={containerRef}>
          {/* User Message */}
          <div
            className={`${styles.chatBubbleRow} ${styles.chatBubbleRowUser} ${
              mounted && !showUser ? styles.chatBubbleRowHidden : ''
            } ${mounted && showUser ? styles.bubblePopIn : ''}`}
          >
            <div className={styles.userMessageGroup}>
              <div className={`${styles.chatBubble} ${styles.chatBubbleUser}`}>
                What is AI Automation &amp; Chatbot?
              </div>
              <span className={styles.userTimestamp}>10:41 AM</span>
            </div>

            <div className={`${styles.chatBubbleAvatar} ${styles.chatBubbleAvatarUser}`}>
              <FaUser aria-hidden="true" />
            </div>
          </div>

          {/* Typing Indicator */}
          {mounted && isTyping && (
            <div className={`${styles.chatBubbleRow} ${styles.bubblePopIn}`}>
              <div className={`${styles.chatBubbleAvatar} ${styles.chatBubbleAvatarBot}`}>
                <FaRobot aria-hidden="true" />
              </div>
              <div className={styles.chatTypingBubble} aria-label="AI Assistant is typing">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}

          {/* Bot Answer */}
          <div
            className={`${styles.chatBubbleRow} ${
              mounted && !showBot ? styles.chatBubbleRowHidden : ''
            } ${mounted && showBot ? styles.bubblePopIn : ''}`}
          >
            <div className={`${styles.chatBubbleAvatar} ${styles.chatBubbleAvatarBot}`}>
              <FaRobot aria-hidden="true" />
            </div>
            <div>
              <div className={`${styles.chatBubble} ${styles.chatBubbleBot}`}>
                AI Automation &amp; Chatbot is a smart customer service system that uses artificial
                intelligence to instantly respond to messages, capture leads, and automate repetitive
                business tasks — 24/7, without human intervention. 10 Cent Agency builds custom AI
                chatbots for Facebook Messenger, WhatsApp, and Telegram, plus n8n automation
                workflows that connect your business tools together.
              </div>
              <span className={styles.chatTimestamp}>10:41 AM</span>
            </div>
          </div>

          {/* Quick Replies */}
          <div
            className={`${styles.chatQuickReplies} ${
              mounted && !showQuickReplies ? styles.chatBubbleRowHidden : ''
            } ${mounted && showQuickReplies ? styles.chatQuickRepliesAnimated : ''}`}
          >
            <Link href="#pricing" className={styles.chatQuickReply}>
              See Pricing 💰
            </Link>
            <Link href="#how-it-works" className={styles.chatQuickReply}>
              How It Works ⚙️
            </Link>
            <Link href="/contact" className={styles.chatQuickReply}>
              Talk to Human 👋
            </Link>
          </div>
        </div>

        {/* Mock Footer */}
        <div className={styles.chatFooter}>
          <div className={styles.chatInputMock}>Type your message...</div>
          <div className={styles.chatSendBtn} aria-hidden="true">
            <FaPaperPlane />
          </div>
        </div>
      </div>

      <p className={styles.chatCaption}>
        <FaCircleInfo className={styles.chatCaptionIcon} aria-hidden="true" />
        This is the exact response speed and quality your customers will experience — instant,
        helpful, and always on.
      </p>
    </div>
  );
}
