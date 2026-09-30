import React from 'react';
import {
  FaBullseye,
  FaEye,
  FaCheck,
  FaScaleBalanced,
  FaChartLine,
  FaLockOpen,
  FaLightbulb,
} from 'react-icons/fa6';
import styles from './HomeSections.module.css';
import {
  missionVisionHeader,
  missionVisionCards,
  missionVisionValues,
} from './homeSectionsData';
import HomeSectionReveal from './visuals/HomeSectionReveal.client';

function getCardIcon(variant: 'mission' | 'vision') {
  if (variant === 'mission') {
    return <FaBullseye aria-hidden="true" />;
  }
  return <FaEye aria-hidden="true" />;
}

function getValueIcon(id: string) {
  switch (id) {
    case 'transparency':
      return <FaScaleBalanced aria-hidden="true" />;
    case 'results-first':
      return <FaChartLine aria-hidden="true" />;
    case 'full-ownership':
      return <FaLockOpen aria-hidden="true" />;
    case 'always-evolving':
      return <FaLightbulb aria-hidden="true" />;
    default:
      return null;
  }
}

export default function MissionVision() {
  return (
    <section
      className={`${styles.sectionWrapper} ${styles.section} ${styles.mvSection}`}
      id="mission-vision"
      aria-labelledby="mv-heading"
    >
      <div className={styles.container}>
        <HomeSectionReveal className={styles.mvHead} threshold={0.4}>
          <span className={styles.sectionLabel}>{missionVisionHeader.label}</span>
          <h2 id="mv-heading" className={styles.sectionTitle}>
            {missionVisionHeader.titlePrefix}
            <span className={styles.mvTitleAccent}>{missionVisionHeader.titleAccent}</span>
          </h2>
          <p className={styles.sectionDesc}>{missionVisionHeader.description}</p>
        </HomeSectionReveal>

        <div className={styles.mvGrid}>
          {missionVisionCards.map((card) => {
            const isVision = card.variant === 'vision';
            return (
              <HomeSectionReveal
                key={card.id}
                delay={card.delay}
                threshold={0.4}
                style={{ height: '100%' }}
              >
                <div
                  className={`${styles.mvCard} ${isVision ? styles.mvCardVision : ''}`}
                >
                  <div className={styles.mvGhost} aria-hidden="true">
                    {getCardIcon(card.variant)}
                  </div>
                  <div
                    className={`${styles.mvIcon} ${isVision ? styles.mvIconVision : ''}`}
                    aria-hidden="true"
                  >
                    {getCardIcon(card.variant)}
                  </div>
                  <div className={`${styles.mvTag} ${isVision ? styles.mvTagVision : ''}`}>
                    {card.tag}
                  </div>
                  <p className={styles.mvStatement}>{card.statement}</p>
                  <div className={styles.mvDivider} aria-hidden="true" />
                  <ul className={styles.mvList}>
                    {card.items.map((item, idx) => (
                      <li key={idx} className={styles.mvItem}>
                        <span className={styles.mvCheck} aria-hidden="true">
                          <FaCheck />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </HomeSectionReveal>
            );
          })}
        </div>

        <div className={styles.mvValues}>
          {missionVisionValues.map((value) => (
            <HomeSectionReveal
              key={value.id}
              delay={value.delay}
              threshold={0.35}
              style={{ height: '100%' }}
            >
              <div className={styles.mvValue}>
                <span className={styles.mvValueIcon} aria-hidden="true">
                  {getValueIcon(value.id)}
                </span>
                <div>
                  <strong className={styles.mvValueTitle}>{value.title}</strong>
                  <span className={styles.mvValueSubtitle}>{value.subtitle}</span>
                </div>
              </div>
            </HomeSectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
