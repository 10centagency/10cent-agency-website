"use client";

import React, { useState, useRef, useEffect, useId } from 'react';
import Link from 'next/link';
import {
  FaEye,
  FaArrowPointer,
  FaBullseye,
  FaCoins,
  FaCircleInfo,
} from 'react-icons/fa6';
import styles from './FacebookMetaMkt.module.css';
import {
  estimatorIndustriesData,
  EstimatorIndustry,
} from './facebookMetaData';

export default function RoiEstimator() {
  const sliderId = useId();
  const selectId = useId();

  const [budget, setBudget] = useState<number>(200);
  const [selectedIndustryKey, setSelectedIndustryKey] = useState<string>(
    estimatorIndustriesData[0].key // 'ecommerce' (E-commerce / Fashion)
  );

  // SSR Default Initial Outputs (Matching E-commerce / Fashion at $200)
  const [displayReach, setDisplayReach] = useState<string>('91,667');
  const [displayClicks, setDisplayClicks] = useState<string>('2,500');
  const [displayLeads, setDisplayLeads] = useState<string>('167');
  const [displayCpl, setDisplayCpl] = useState<string>('1.20');

  // Track raw numerical values for animated transitions
  const rawValuesRef = useRef<{
    reach: number;
    clicks: number;
    leads: number;
    cpl: number;
  }>({
    reach: 91667,
    clicks: 2500,
    leads: 167,
    cpl: 1.2,
  });

  const animFrameRef = useRef<number | null>(null);

  const calculateTargetValues = (budVal: number, indKey: string) => {
    const data =
      estimatorIndustriesData.find((ind) => ind.key === indKey) ||
      estimatorIndustriesData[0];

    const impressions = (budVal / data.cpm) * 1000;
    const reach = impressions * 0.55;
    const clicks = impressions * data.ctr;
    const leads = Math.max(1, Math.round(budVal / data.cpl));
    const cpl = data.cpl;

    return {
      reach: Math.round(reach),
      clicks: Math.round(clicks),
      leads,
      cpl,
    };
  };

  useEffect(() => {
    const target = calculateTargetValues(budget, selectedIndustryKey);
    const start = { ...rawValuesRef.current };

    const duration = 400;
    const startTime = performance.now();

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);

      const currentReach = Math.round(start.reach + (target.reach - start.reach) * ease);
      const currentClicks = Math.round(start.clicks + (target.clicks - start.clicks) * ease);
      const currentLeads = Math.round(start.leads + (target.leads - start.leads) * ease);
      const currentCpl = start.cpl + (target.cpl - start.cpl) * ease;

      setDisplayReach(currentReach.toLocaleString('en-US'));
      setDisplayClicks(currentClicks.toLocaleString('en-US'));
      setDisplayLeads(currentLeads.toLocaleString('en-US'));
      setDisplayCpl(currentCpl.toFixed(2));

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        setDisplayReach(target.reach.toLocaleString('en-US'));
        setDisplayClicks(target.clicks.toLocaleString('en-US'));
        setDisplayLeads(target.leads.toLocaleString('en-US'));
        setDisplayCpl(target.cpl.toFixed(2));
        rawValuesRef.current = target;
      }
    };

    animFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [budget, selectedIndustryKey]);

  return (
    <div className={styles.roiBox}>
      <div className={styles.roiInputs}>
        {/* Budget Slider */}
        <div className={styles.roiField}>
          <label htmlFor={sliderId}>Monthly Ad Budget (USD)</label>
          <div className={styles.roiSliderWrapper}>
            <input
              id={sliderId}
              type="range"
              min={50}
              max={1000}
              step={10}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              aria-label="Monthly Ad Budget in USD"
              className={styles.roiRangeInput}
            />
          </div>
          <div className={styles.roiValue}>
            ${budget.toLocaleString('en-US')}
          </div>
        </div>

        {/* Industry Select */}
        <div className={styles.roiField}>
          <label htmlFor={selectId}>Select Your Industry</label>
          <select
            id={selectId}
            value={selectedIndustryKey}
            onChange={(e) => setSelectedIndustryKey(e.target.value)}
            className={styles.roiSelect}
          >
            {estimatorIndustriesData.map((ind: EstimatorIndustry) => (
              <option key={ind.key} value={ind.key}>
                {ind.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Outputs Grid */}
      <div className={styles.roiOutputs}>
        <div className={styles.roiOutCard}>
          <FaEye className={styles.roiOutIcon} aria-hidden="true" />
          <div className={styles.roiOutNum}>{displayReach}</div>
          <div className={styles.roiOutLabel}>Estimated Reach</div>
        </div>

        <div className={styles.roiOutCard}>
          <FaArrowPointer className={styles.roiOutIcon} aria-hidden="true" />
          <div className={styles.roiOutNum}>{displayClicks}</div>
          <div className={styles.roiOutLabel}>Estimated Clicks</div>
        </div>

        <div className={`${styles.roiOutCard} ${styles.roiOutCardHighlight}`}>
          <FaBullseye className={styles.roiOutIcon} aria-hidden="true" />
          <div className={styles.roiOutNum}>{displayLeads}</div>
          <div className={styles.roiOutLabel}>Estimated Leads / Results</div>
        </div>

        <div className={styles.roiOutCard}>
          <FaCoins className={styles.roiOutIcon} aria-hidden="true" />
          <div className={styles.roiOutNum}>${displayCpl}</div>
          <div className={styles.roiOutLabel}>Cost Per Lead / Result (Industry Avg.)</div>
        </div>
      </div>

      {/* Estimator Disclaimer (Unified Caption Pattern) */}
      <div className={`${styles.captionNote} ${styles.roiDisclaimer}`}>
        <FaCircleInfo className={styles.captionIcon} aria-hidden="true" />
        <span>
          These numbers are based on industry benchmarks — not a guaranteed result.
          For an accurate projection,{' '}
          <Link href="/contact" className={styles.captionLink}>
            book a free audit call
          </Link>
          .
        </span>
      </div>
    </div>
  );
}
