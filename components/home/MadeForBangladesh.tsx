import React from 'react';
import {
  FaLocationDot,
  FaComments,
  FaCreditCard,
  FaGlobe,
} from 'react-icons/fa6';
import styles from './HomeSections.module.css';
import {
  madeForBangladeshHeader,
  bangladeshFeatures,
} from './homeSectionsData';
import HomeSectionReveal from './visuals/HomeSectionReveal.client';
import BdMap from './visuals/BdMap.client';

function getFeatureIcon(id: string) {
  switch (id) {
    case 'nationwide-coverage':
      return <FaLocationDot aria-hidden="true" />;
    case 'fluent-languages':
      return <FaComments aria-hidden="true" />;
    case 'local-payments':
      return <FaCreditCard aria-hidden="true" />;
    case 'global-standards':
      return <FaGlobe aria-hidden="true" />;
    default:
      return null;
  }
}

export default function MadeForBangladesh() {
  return (
    <section
      className={`${styles.sectionWrapper} ${styles.section} ${styles.bdSection}`}
      id="made-for-bangladesh"
      aria-labelledby="bd-heading"
    >
      <div className={styles.container}>
        <div className={styles.bdGrid}>
          {/* Left Column: Copy & Feature Badges */}
          <div>
            <HomeSectionReveal threshold={0.4}>
              <span className={styles.sectionLabel}>
                {madeForBangladeshHeader.label}
              </span>
              <h2 id="bd-heading" className={styles.sectionTitle}>
                {madeForBangladeshHeader.titlePrefix}
                <span className={styles.mvTitleAccent}>
                  {madeForBangladeshHeader.titleAccent}
                </span>
              </h2>
              <p className={styles.sectionDesc}>
                {madeForBangladeshHeader.description}
              </p>
            </HomeSectionReveal>

            <div className={styles.bdBadges}>
              {bangladeshFeatures.map((feature) => (
                <HomeSectionReveal
                  key={feature.id}
                  delay={feature.delay}
                  threshold={0.35}
                >
                  <div className={styles.bdBadge}>
                    <div className={styles.bdBadgeIcon} aria-hidden="true">
                      {getFeatureIcon(feature.id)}
                    </div>
                    <div>
                      <strong className={styles.bdBadgeTitle}>
                        {feature.title}
                      </strong>
                      <span className={styles.bdBadgeDesc}>
                        {feature.description}
                      </span>
                    </div>
                  </div>
                </HomeSectionReveal>
              ))}
            </div>
          </div>

          {/* Right Column: Bangladesh Interactive Map Card */}
          <HomeSectionReveal delay=".24s" threshold={0.4} style={{ height: '100%' }}>
            <BdMap />
          </HomeSectionReveal>
        </div>
      </div>
    </section>
  );
}
