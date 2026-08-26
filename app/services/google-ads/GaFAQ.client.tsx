"use client";

import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import styles from './GoogleAds.module.css';
import { faqsData, FAQItem } from './googleAdsData';

export default function GaFAQ() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq((prev) => (prev === index ? null : index));
  };

  return (
    <div className={styles.faqList}>
      {faqsData.map((faq: FAQItem, index: number) => {
        const isOpen = activeFaq === index;

        return (
          <div
            key={faq.id}
            className={`${styles.faqItem} ${isOpen ? styles.faqItemActive : ''}`}
          >
            <button
              type="button"
              id={`faq-question-${faq.id}`}
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${faq.id}`}
              className={styles.faqQuestion}
              onClick={() => toggleFaq(index)}
            >
              <span>{faq.question}</span>
              <FaPlus
                className={`${styles.faqQuestionIcon} ${
                  isOpen ? styles.faqQuestionIconActive : ''
                }`}
                aria-hidden="true"
              />
            </button>
            <div
              id={`faq-answer-${faq.id}`}
              role="region"
              aria-labelledby={`faq-question-${faq.id}`}
              className={`${styles.faqAnswer} ${
                isOpen ? styles.faqAnswerActive : ''
              }`}
            >
              {faq.paragraphs.map((pText: string, pIdx: number) => (
                <p key={pIdx}>{pText}</p>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
