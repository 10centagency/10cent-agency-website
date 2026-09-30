"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './WebsiteDevelopment.module.css';
import {
  decisionGuideData,
  DecisionPanelData,
  DecisionReason,
  TechPill,
} from './websiteDevelopmentData';
import {
  FaWordpress,
  FaCode,
  FaCircleCheck,
  FaCircleXmark,
  FaUser,
  FaCoins,
  FaStore,
  FaRocket,
  FaBlog,
  FaDatabase,
  FaUsers,
  FaGears,
  FaBolt,
  FaArrowTrendUp,
  FaLock,
  FaUserPen,
  FaClock,
  FaObjectUngroup,
  FaCartShopping,
  FaServer,
  FaShieldHalved,
  FaReact,
  FaCloudArrowUp,
  FaCloudBolt,
  FaLightbulb,
} from 'react-icons/fa6';

const decisionIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  wordpress: FaWordpress,
  code: FaCode,
  user: FaUser,
  coins: FaCoins,
  store: FaStore,
  rocket: FaRocket,
  blog: FaBlog,
  database: FaDatabase,
  users: FaUsers,
  gears: FaGears,
  bolt: FaBolt,
  'trend-up': FaArrowTrendUp,
  lock: FaLock,
  'user-pen': FaUserPen,
  clock: FaClock,
  elementor: FaObjectUngroup,
  woocommerce: FaCartShopping,
  server: FaServer,
  shield: FaShieldHalved,
  react: FaReact,
  nextjs: FaCode,
  supabase: FaDatabase,
  vercel: FaCloudArrowUp,
  cloudflare: FaCloudBolt,
};

export default function TechnologyDecisionGuide() {
  const [activeTab, setActiveTab] = useState<'wp' | 'next'>('wp');

  const renderPanel = (type: 'wp' | 'next', data: DecisionPanelData) => {
    const isWp = type === 'wp';
    const isVisible = activeTab === type;
    const HeaderIcon = isWp ? FaWordpress : FaCode;

    return (
      <div
        key={type}
        id={`dg-panel-${type}`}
        role="tabpanel"
        aria-labelledby={`dg-tab-${type}`}
        hidden={!isVisible}
        className={styles.dgPanel}
      >
        <div
          className={`${styles.dgPanelHeader} ${
            isWp ? styles.dgWp : styles.dgNext
          }`}
        >
          <div className={styles.dgPanelIcon}>
            <HeaderIcon aria-hidden="true" />
          </div>
          <div>
            <h3>{data.title}</h3>
            <span>{data.subtitle}</span>
          </div>
          <div
            className={`${styles.dgRecommendedBadge} ${
              !isWp ? styles.dgBadgeNext : ''
            }`}
          >
            {data.badge}
          </div>
        </div>

        <div className={styles.dgBody}>
          {/* Choose this if */}
          <div className={styles.dgCol}>
            <h4 className={`${styles.dgColTitle} ${styles.dgGreen}`}>
              <FaCircleCheck aria-hidden="true" /> Choose this if —
            </h4>
            <div className={styles.dgReasonList}>
              {data.chooseIf.map((reason: DecisionReason, idx: number) => {
                const Icon = decisionIconMap[reason.iconKey] || FaCircleCheck;
                return (
                  <div key={idx} className={styles.dgReason}>
                    <div
                      className={`${styles.dgReasonIcon} ${styles.dgReasonIconGreen}`}
                    >
                      <Icon aria-hidden="true" />
                    </div>
                    <div>
                      <strong>{reason.title}</strong>
                      <p>{reason.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Avoid this if */}
          <div className={styles.dgCol}>
            <h4 className={`${styles.dgColTitle} ${styles.dgRed}`}>
              <FaCircleXmark aria-hidden="true" /> Avoid this if —
            </h4>
            <div className={styles.dgReasonList}>
              {data.avoidIf.map((reason: DecisionReason, idx: number) => {
                const Icon = decisionIconMap[reason.iconKey] || FaCircleXmark;
                return (
                  <div key={idx} className={styles.dgReason}>
                    <div
                      className={`${styles.dgReasonIcon} ${styles.dgReasonIconRed}`}
                    >
                      <Icon aria-hidden="true" />
                    </div>
                    <div>
                      <strong>{reason.title}</strong>
                      <p>{reason.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tech Used */}
            <div className={styles.dgTechUsed}>
              <h5>Technologies we use for this:</h5>
              <div className={styles.dgTechPills}>
                {data.techPills.map((pill: TechPill, idx: number) => {
                  const PillIcon = decisionIconMap[pill.iconKey] || FaCode;
                  return (
                    <span key={idx} className={styles.dgTechPill}>
                      <PillIcon aria-hidden="true" /> {pill.label}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Toggle Buttons */}
      <div
        className={styles.dgToggleWrap}
        role="tablist"
        aria-label="Website Technology Choice"
      >
        <button
          type="button"
          role="tab"
          id="dg-tab-wp"
          aria-selected={activeTab === 'wp'}
          aria-controls="dg-panel-wp"
          className={`${styles.dgToggleBtn} ${
            activeTab === 'wp' ? styles.dgToggleBtnActive : ''
          }`}
          onClick={() => setActiveTab('wp')}
        >
          <FaWordpress aria-hidden="true" /> WordPress + Elementor
        </button>
        <div className={styles.dgToggleDivider}>vs</div>
        <button
          type="button"
          role="tab"
          id="dg-tab-next"
          aria-selected={activeTab === 'next'}
          aria-controls="dg-panel-next"
          className={`${styles.dgToggleBtn} ${
            activeTab === 'next' ? styles.dgToggleBtnActive : ''
          }`}
          onClick={() => setActiveTab('next')}
        >
          <FaCode aria-hidden="true" /> Next.js / React
        </button>
      </div>

      {/* Panels (Both rendered in HTML) */}
      <div className={styles.dgContent}>
        {renderPanel('wp', decisionGuideData.wp)}
        {renderPanel('next', decisionGuideData.next)}
      </div>

      {/* Helper Bar */}
      <div className={styles.dgHelper}>
        <FaLightbulb className={styles.dgHelperIcon} aria-hidden="true" />
        <div className={styles.dgHelperText}>
          <strong>Not sure which one fits your project?</strong>
          Book a free consultation — we&apos;ll listen to your goals and budget,
          then recommend the right technology with a clear, honest explanation.
        </div>
        <Link
          href="/contact"
          className={`${styles.btn} ${styles.btnPrimary} ${styles.dgHelperBtn}`}
        >
          Get Free Advice
        </Link>
      </div>
    </div>
  );
}
