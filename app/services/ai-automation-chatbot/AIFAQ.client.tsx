"use client";

import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import styles from './AIAutomation.module.css';
import { faqsData } from './aiAutomationData';

export default function AIFAQ() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq((prev) => (prev === index ? null : index));
  };

  return (
    <div className={styles.faqList}>
      {faqsData.map((faq, index) => {
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
              {faq.blocks.map((block, bIdx) => (
                <p key={bIdx}>{block.text}</p>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
