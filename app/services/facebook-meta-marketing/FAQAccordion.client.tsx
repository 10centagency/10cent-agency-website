"use client";

import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import styles from './FacebookMetaMkt.module.css';
import { faqsData, FAQItem } from './facebookMetaData';

export default function FAQAccordion() {
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
              {faq.paragraphs &&
                faq.paragraphs.map((para, pIdx) => <p key={pIdx}>{para}</p>)}

              {faq.bullets && faq.bullets.length > 0 && (
                <ul className={styles.faqBulletList}>
                  {faq.bullets.map((bullet, bIdx) => (
                    <li key={bIdx}>{bullet}</li>
                  ))}
                </ul>
              )}

              {faq.footParagraph && <p>{faq.footParagraph}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
