"use client";

import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import styles from './GraphicDesign.module.css';
import { faqsData, FAQItem, FAQBlock } from './graphicDesignData';

export default function GdFAQ() {
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
              className={`${styles.faqAnswer} ${isOpen ? styles.faqAnswerActive : ''}`}
            >
              {faq.blocks.map((block: FAQBlock, bIdx: number) => {
                if (block.type === 'list' && block.items) {
                  return (
                    <ul key={bIdx}>
                      {block.items.map((item, iIdx) => (
                        <li key={iIdx}>{item}</li>
                      ))}
                    </ul>
                  );
                }
                return <p key={bIdx}>{block.text}</p>;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
