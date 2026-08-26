"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import styles from './WebsiteDevelopment.module.css';
import { strategyTabsData } from './websiteDevelopmentData';
import {
  FaObjectGroup,
  FaGaugeHigh,
  FaMagnifyingGlass,
  FaMobileScreen,
  FaCreditCard,
  FaShieldHalved,
  FaChartLine,
} from 'react-icons/fa6';

const strategyIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'ux-ui': FaObjectGroup,
  speed: FaGaugeHigh,
  seo: FaMagnifyingGlass,
  mobile: FaMobileScreen,
  payment: FaCreditCard,
  security: FaShieldHalved,
  analytics: FaChartLine,
};

export default function WebsiteStrategyTabs() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index;
    const total = strategyTabsData.length;

    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      nextIndex = (index + 1) % total;
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      nextIndex = (index - 1 + total) % total;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = total - 1;
    }

    if (nextIndex !== index) {
      setActiveTab(nextIndex);
      tabRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div className={styles.strategyGrid}>
      {/* Mobile Picker (visible at <= 900px) */}
      <div className={styles.strategyMobilePicker}>
        <label
          htmlFor="strategy-mobile-select"
          className={styles.strategyMobileLabel}
        >
          Choose a strategy
        </label>
        <select
          id="strategy-mobile-select"
          className={styles.strategyMobileSelect}
          value={activeTab}
          onChange={(e) => setActiveTab(Number(e.target.value))}
        >
          {strategyTabsData.map((tab) => (
            <option key={tab.id} value={tab.id}>
              {tab.title}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop / Tablet Vertical Tabs */}
      <div
        className={styles.strategyTabsCol}
        role="tablist"
        aria-label="Website Development Approach Strategies"
      >
        {strategyTabsData.map((tab, idx) => {
          const TabIcon = strategyIconMap[tab.iconKey] || FaObjectGroup;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[idx] = el;
              }}
              type="button"
              role="tab"
              id={`strategy-tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`strategy-tabpanel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              className={`${styles.strategyTab} ${
                isActive ? styles.strategyTabActive : ''
              }`}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
            >
              <TabIcon className={styles.strategyTabIcon} aria-hidden="true" />
              <span>{tab.title}</span>
            </button>
          );
        })}
      </div>

      {/* Strategy Content Panels (All 7 rendered in HTML) */}
      <div className={styles.strategyContentCol}>
        {strategyTabsData.map((tab) => {
          const isSeoTab = tab.key === 'seo';

          return (
            <div
              key={tab.id}
              id={`strategy-tabpanel-${tab.id}`}
              role="tabpanel"
              aria-labelledby={`strategy-tab-${tab.id}`}
              hidden={activeTab !== tab.id}
              className={styles.strategyContent}
            >
              <h3>{tab.title}</h3>
              {tab.paragraphs.map((p, pIdx) => {
                if (isSeoTab && pIdx === 2) {
                  return (
                    <p key={pIdx}>
                      For businesses ready to actively compete for search rankings, our
                      website development pairs seamlessly with our dedicated{' '}
                      <Link
                        href="/services/seo-aeo-geo"
                        className="text-brand-blue font-semibold hover:underline"
                      >
                        SEO service
                      </Link>{' '}
                      for continued keyword targeting and content growth.
                    </p>
                  );
                }
                return <p key={pIdx}>{p}</p>;
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
