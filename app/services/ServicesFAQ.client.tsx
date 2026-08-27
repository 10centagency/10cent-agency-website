"use client";

import React, { useState } from 'react';
import styles from './ServicesHub.module.css';
import { faqsData, FAQItem } from './servicesData';
import { FaChevronDown } from 'react-icons/fa6';

export default function ServicesFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className={styles.faqList} id="faqList">
      {faqsData.map((faq: FAQItem, index: number) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={faq.id}
            className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ''}`}
          >
            <button
              type="button"
              id={`faq-btn-${faq.id}`}
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${faq.id}`}
              className={styles.faqQuestion}
              onClick={() => toggleFaq(index)}
            >
              <span>{faq.question}</span>
              <FaChevronDown className={styles.faqChevron} aria-hidden="true" />
            </button>
            <div
              id={`faq-answer-${faq.id}`}
              role="region"
              aria-labelledby={`faq-btn-${faq.id}`}
              className={styles.faqAnswer}
            >
              <div className={styles.faqAnswerInner}>
                <p>{faq.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
