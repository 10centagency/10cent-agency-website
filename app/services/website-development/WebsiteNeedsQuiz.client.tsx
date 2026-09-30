"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './WebsiteDevelopment.module.css';
import {
  quizQuestionsData,
  quizVerdictsData,
  QuizQuestion,
  QuizVerdict,
} from './websiteDevelopmentData';
import {
  FaGlobe,
  FaMobileScreenButton,
  FaGauge,
  FaArrowPointer,
  FaFaceFrown,
  FaCheck,
  FaCircleQuestion,
  FaCircleCheck,
  FaTriangleExclamation,
  FaCircleExclamation,
  FaArrowRight,
} from 'react-icons/fa6';

const quizIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  globe: FaGlobe,
  mobile: FaMobileScreenButton,
  gauge: FaGauge,
  pointer: FaArrowPointer,
  frown: FaFaceFrown,
  question: FaCircleQuestion,
  'check-circle': FaCircleCheck,
  warning: FaTriangleExclamation,
  exclamation: FaCircleExclamation,
};

const CIRCUMFERENCE = 314;
const MAX_SCORE = 10;

function getVerdict(score: number): QuizVerdict {
  if (score === 0) return quizVerdictsData.zero;
  if (score <= 2) return quizVerdictsData.low;
  if (score <= 6) return quizVerdictsData.medium;
  return quizVerdictsData.high;
}

function getRingColor(score: number): string {
  if (score === 0) return '#e7eef8';
  if (score <= 2) return '#22c55e';
  if (score <= 6) return '#f59e0b';
  return '#ef4444';
}

export default function WebsiteNeedsQuiz() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectedQuestions = quizQuestionsData.filter((q) =>
    selectedIds.includes(q.id)
  );

  const score = selectedQuestions.reduce((acc, curr) => acc + curr.points, 0);
  const verdict = getVerdict(score);
  const ringColor = getRingColor(score);
  const ringOffset =
    CIRCUMFERENCE - Math.min(score / MAX_SCORE, 1) * CIRCUMFERENCE;

  const VerdictIcon = quizIconMap[verdict.iconKey] || FaCircleQuestion;

  return (
    <div className={styles.quizWrapper}>
      {/* Left: Checklist Statements (Static HTML items with checkboxes) */}
      <div className={styles.quizLeft}>
        <div
          className={styles.quizItems}
          role="group"
          aria-label="Website situation statements"
        >
          {quizQuestionsData.map((item: QuizQuestion) => {
            const isChecked = selectedIds.includes(item.id);
            const ItemIcon = quizIconMap[item.iconKey] || FaGlobe;

            return (
              <label key={item.id} className={styles.quizItem}>
                <input
                  type="checkbox"
                  className={styles.quizCheckbox}
                  checked={isChecked}
                  onChange={() => handleToggle(item.id)}
                  aria-label={item.title}
                />
                <div
                  className={`${styles.quizItemInner} ${
                    isChecked ? styles.quizItemInnerChecked : ''
                  }`}
                >
                  <div
                    className={`${styles.quizItemIcon} ${
                      isChecked ? styles.quizItemIconChecked : ''
                    }`}
                  >
                    <ItemIcon aria-hidden="true" />
                  </div>
                  <div className={styles.quizItemText}>
                    <strong>{item.title}</strong>
                    <span>{item.desc}</span>
                  </div>
                  <div
                    className={`${styles.quizCheckMark} ${
                      isChecked ? styles.quizCheckMarkChecked : ''
                    }`}
                  >
                    <FaCheck aria-hidden="true" />
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Right: Result Box */}
      <div className={styles.quizRight}>
        <div className={styles.quizResultBox}>
          <div className={styles.quizScoreWrap}>
            <div className={styles.quizScoreRing}>
              <svg viewBox="0 0 120 120" width="120" height="120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#e7eef8"
                  strokeWidth="10"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke={ringColor}
                  strokeWidth="10"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={ringOffset}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                  style={{ transition: 'stroke-dashoffset 0.35s ease, stroke 0.35s ease' }}
                />
              </svg>
              <div className={styles.quizScoreCenter}>
                <span className={styles.quizScoreNum}>{score}</span>
                <small className={styles.quizScoreMax}>/ {MAX_SCORE}</small>
              </div>
            </div>
            <div className={styles.quizScoreLabel}>{verdict.label}</div>
          </div>

          <div
            className={`${styles.quizVerdict} ${
              verdict.cls ? styles[verdict.cls] : ''
            }`}
            aria-live="polite"
          >
            <div className={styles.verdictIcon}>
              <VerdictIcon aria-hidden="true" />
            </div>
            <h4>{verdict.title}</h4>
            <p>{verdict.text}</p>
          </div>

          {verdict.cta && (
            <Link
              href="/contact"
              className={`${styles.btn} ${styles.btnPrimary} ${styles.quizCtaBtn}`}
            >
              Book a Free Consultation
              <FaArrowRight style={{ marginLeft: '6px' }} aria-hidden="true" />
            </Link>
          )}

          {selectedQuestions.length > 0 && (
            <div className={styles.quizSelectedWrap}>
              <div className={styles.quizSelectedTitle}>You selected:</div>
              <div className={styles.quizSelectedList}>
                {selectedQuestions.map((q) => (
                  <div key={q.id} className={styles.quizSelectedPill}>
                    <FaCheck
                      style={{ color: 'var(--wd-blue)', fontSize: '10px' }}
                      aria-hidden="true"
                    />
                    {q.title}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
