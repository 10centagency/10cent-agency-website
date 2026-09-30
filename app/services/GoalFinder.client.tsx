"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './ServicesHub.module.css';
import {
  goalChipsData,
  serviceCardsData,
  comboCardData,
  GoalChip,
  ServiceCardItem,
  iconMap,
} from './servicesData';
import {
  FaCompass,
  FaCircleCheck,
  FaArrowRight,
  FaLayerGroup,
} from 'react-icons/fa6';

export default function GoalFinder() {
  const [activeGoal, setActiveGoal] = useState<string>('all');

  const currentHint =
    goalChipsData.find((chip) => chip.id === activeGoal)?.hint || '';

  const handleChipClick = (goalId: string) => {
    setActiveGoal(goalId);
  };

  return (
    <>
      {/* ===================== 3. GOAL FINDER ===================== */}
      <section className={`${styles.sectionTight} ${styles.finderSection}`}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <span className={styles.eyebrow}>
              <FaCompass aria-hidden="true" /> Not Sure Where to Start?
            </span>
            <h2 className={styles.sectionTitle}>Tell Us Your Goal, We&apos;ll Point You There</h2>
            <p className={styles.sectionDesc}>
              Tap what you&apos;re trying to achieve — we&apos;ll highlight the exact service(s) built for it.
            </p>
          </div>

          <div className={styles.goalChips} id="goalChips" role="group" aria-label="Filter services by goal">
            {goalChipsData.map((chip: GoalChip) => {
              const ChipIcon = iconMap[chip.icon] || FaCompass;
              const isActive = activeGoal === chip.id;

              return (
                <button
                  key={chip.id}
                  type="button"
                  data-goal={chip.id}
                  aria-pressed={isActive}
                  className={`${styles.goalChip} ${isActive ? styles.goalChipActive : ''}`}
                  onClick={() => handleChipClick(chip.id)}
                >
                  <ChipIcon aria-hidden="true" />
                  <span>{chip.label}</span>
                </button>
              );
            })}
          </div>

          <p className={styles.finderHint} id="finderHint" aria-live="polite">
            {currentHint}
          </p>
        </div>
      </section>

      {/* ===================== 4. MAIN SERVICE CARDS GRID ===================== */}
      <section className={`${styles.section} ${styles.servicesGridSection}`} id="services-grid">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <span className={styles.eyebrow}>Core Services</span>
            <h2 className={styles.sectionTitle}>7 Ways We Help Your Business Grow</h2>
            <p className={styles.sectionDesc}>
              Every service below links to a full breakdown — process, packages, real numbers, and FAQs.
            </p>
          </div>

          <div className={styles.servicesGrid} id="cardGrid">
            {/* 7 Main Service Cards */}
            {serviceCardsData.map((card: ServiceCardItem) => {
              const ServiceIcon = iconMap[card.icon] || FaCompass;
              const StatIcon = iconMap[card.statIcon] || FaCircleCheck;
              const isDim = activeGoal !== 'all' && !card.goals.includes(activeGoal);

              return (
                <article
                  key={card.id}
                  id={card.id}
                  className={`${styles.svcCard} ${styles[card.accentClass]} ${
                    isDim ? styles.isDim : ''
                  }`}
                  data-goals={card.goals.join(' ')}
                >
                  <div className={styles.svcTop}>
                    <div className={styles.svcIcon}>
                      <ServiceIcon aria-hidden="true" />
                    </div>
                    <span
                      className={styles.svcBadge}
                      style={card.badgeCustomStyle}
                    >
                      {card.badge}
                    </span>
                  </div>

                  <h3 className={styles.svcTitle}>{card.title}</h3>
                  <p className={styles.svcDesc}>{card.description}</p>

                  <ul className={styles.svcFeatures}>
                    {card.features.map((feature, idx) => (
                      <li key={idx} className={styles.svcFeatureItem}>
                        <FaCircleCheck aria-hidden="true" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className={styles.svcStat}>
                    <StatIcon aria-hidden="true" />
                    <span>{card.statText}</span>
                  </div>

                  <div className={styles.svcActions}>
                    <Link
                      href={card.secondaryActionHref}
                      className={`${styles.btn} ${styles.btnOutline}`}
                    >
                      {card.secondaryActionText}
                    </Link>
                    <Link
                      href={card.primaryActionHref}
                      className={`${styles.btn} ${styles.btnPrimary}`}
                    >
                      <span>{card.primaryActionText}</span>
                      <FaArrowRight aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              );
            })}

            {/* 8th Slot — Combo CTA Card (Never dimmed) */}
            <article className={`${styles.svcCard} ${styles.svcComboCard}`}>
              <div className={styles.comboIcon}>
                <FaLayerGroup aria-hidden="true" />
              </div>
              <h3 className={styles.svcTitle}>{comboCardData.title}</h3>
              <p className={styles.svcDesc}>{comboCardData.description}</p>
              <ul className={styles.svcFeatures}>
                {comboCardData.features.map((feature, idx) => (
                  <li key={idx} className={styles.svcFeatureItem}>
                    <FaCircleCheck aria-hidden="true" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className={styles.svcActions}>
                <Link
                  href={comboCardData.ctaHref}
                  className={`${styles.btn} ${styles.btnPrimary} ${styles.btnBlock}`}
                >
                  <span>{comboCardData.ctaText}</span>
                  <FaArrowRight aria-hidden="true" />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
