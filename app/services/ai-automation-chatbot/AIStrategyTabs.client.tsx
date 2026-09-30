"use client";

import React, { useState, useRef } from 'react';
import {
  FaDiagramProject,
  FaBrain,
  FaUsers,
  FaCartShopping,
  FaLanguage,
  FaUserTie,
  FaChartPie,
} from 'react-icons/fa6';
import styles from './AIAutomation.module.css';
import { strategyTopicsData } from './aiAutomationData';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FaDiagramProject,
  FaBrain,
  FaUsers,
  FaCartShopping,
  FaLanguage,
  FaUserTie,
  FaChartPie,
};

export default function AIStrategyTabs() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index;
    const total = strategyTopicsData.length;

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
      {/* Mobile Strategy Picker (<= 768px) */}
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
          onChange={(event) => setActiveTab(Number(event.target.value))}
        >
          {strategyTopicsData.map((tab) => (
            <option key={tab.id} value={tab.id}>
              {tab.title}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop / Tablet Strategy Tabs */}
      <div
        className={styles.strategyTabsCol}
        role="tablist"
        aria-label="AI Automation Strategies"
      >
        {strategyTopicsData.map((tab, idx) => {
          const IconComponent = iconMap[tab.iconKey] || FaDiagramProject;
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
              <IconComponent className={styles.strategyTabIcon} aria-hidden="true" />
              <span>{tab.title}</span>
            </button>
          );
        })}
      </div>

      {/* Crawlable Tab Content (All 7 panels rendered in initial HTML, inactive use hidden) */}
      <div className={styles.strategyContentCol}>
        {strategyTopicsData.map((tab) => (
          <div
            key={tab.id}
            id={`strategy-tabpanel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`strategy-tab-${tab.id}`}
            hidden={activeTab !== tab.id}
            className={styles.strategyContent}
          >
            <h3>{tab.title}</h3>
            {tab.paragraphs.map((p, pIdx) => (
              <p key={pIdx}>{p}</p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
