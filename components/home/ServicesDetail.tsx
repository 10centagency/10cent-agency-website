import React from 'react';
import Link from 'next/link';
import styles from './HomeSections.module.css';
import {
  metaDetailData,
  websiteDetailData,
  aiDetailData,
} from './homeSectionsData';
import HomeSectionReveal from './visuals/HomeSectionReveal.client';
import MetaViz from './visuals/MetaViz.client';
import WebsiteViz from './visuals/WebsiteViz.client';
import AIViz from './visuals/AIViz.client';

export default function ServicesDetail() {
  return (
    <div className={styles.sectionWrapper}>
      {/* ─────────────────────────────────────────────────────────────
          §2a META — Light Panel (panelDark)
         ───────────────────────────────────────────────────────────── */}
      <section className={`${styles.panel} ${styles.panelDark}`} id={metaDetailData.id}>
        <div className={styles.container}>
          <div className={`${styles.panelGrid} ${styles.flip}`}>
            <HomeSectionReveal className={styles.panelCopy}>
              <div className={styles.kicker}>
                <span
                  className={styles.kickerDot}
                  style={{ '--kc': metaDetailData.kickerColor } as React.CSSProperties}
                />
                {metaDetailData.kicker}
              </div>
              <h2 className={styles.panelTitle}>
                {metaDetailData.titlePrefix}
                <span
                  style={
                    {
                      '--g1': metaDetailData.gradientColors.g1,
                      '--g2': metaDetailData.gradientColors.g2,
                    } as React.CSSProperties
                  }
                >
                  {metaDetailData.titleHighlight}
                </span>
                {metaDetailData.titleSuffix || ''}
              </h2>
              <p className={styles.panelDesc}>{metaDetailData.description}</p>
              <ul
                className={styles.featList}
                style={{ '--kc': metaDetailData.kickerColor } as React.CSSProperties}
              >
                {metaDetailData.features.map((feat) => (
                  <li key={feat}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              <Link href={metaDetailData.ctaHref} className={styles.panelCta}>
                {metaDetailData.ctaText}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </HomeSectionReveal>

            <MetaViz />
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          §2b WEBSITE — Navy Light Panel (panelNavy)
         ───────────────────────────────────────────────────────────── */}
      <section className={`${styles.panel} ${styles.panelNavy}`} id={websiteDetailData.id}>
        <div className={styles.container}>
          <div className={styles.panelGrid}>
            <HomeSectionReveal className={styles.panelCopy}>
              <div className={styles.kicker}>
                <span
                  className={styles.kickerDot}
                  style={{ '--kc': websiteDetailData.kickerColor } as React.CSSProperties}
                />
                {websiteDetailData.kicker}
              </div>
              <h2 className={styles.panelTitle}>
                {websiteDetailData.titlePrefix}
                <span
                  style={
                    {
                      '--g1': websiteDetailData.gradientColors.g1,
                      '--g2': websiteDetailData.gradientColors.g2,
                    } as React.CSSProperties
                  }
                >
                  {websiteDetailData.titleHighlight}
                </span>
                {websiteDetailData.titleSuffix || ''}
              </h2>
              <p className={styles.panelDesc}>{websiteDetailData.description}</p>
              <ul
                className={styles.featList}
                style={{ '--kc': websiteDetailData.kickerColor } as React.CSSProperties}
              >
                {websiteDetailData.features.map((feat) => (
                  <li key={feat}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              <Link href={websiteDetailData.ctaHref} className={styles.panelCta}>
                {websiteDetailData.ctaText}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </HomeSectionReveal>

            <WebsiteViz />
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          §2c AI — Indigo Light Panel (panelIndigo)
         ───────────────────────────────────────────────────────────── */}
      <section className={`${styles.panel} ${styles.panelIndigo}`} id={aiDetailData.id}>
        <div className={styles.container}>
          <div className={`${styles.panelGrid} ${styles.flip}`}>
            <HomeSectionReveal className={styles.panelCopy}>
              <div className={styles.kicker}>
                <span
                  className={styles.kickerDot}
                  style={{ '--kc': aiDetailData.kickerColor } as React.CSSProperties}
                />
                {aiDetailData.kicker}
              </div>
              <h2 className={styles.panelTitle}>
                {aiDetailData.titlePrefix}
                <span
                  style={
                    {
                      '--g1': aiDetailData.gradientColors.g1,
                      '--g2': aiDetailData.gradientColors.g2,
                    } as React.CSSProperties
                  }
                >
                  {aiDetailData.titleHighlight}
                </span>
                {aiDetailData.titleSuffix || ''}
              </h2>
              <p className={styles.panelDesc}>{aiDetailData.description}</p>
              <ul
                className={styles.featList}
                style={{ '--kc': aiDetailData.kickerColor } as React.CSSProperties}
              >
                {aiDetailData.features.map((feat) => (
                  <li key={feat}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              <Link href={aiDetailData.ctaHref} className={styles.panelCta}>
                {aiDetailData.ctaText}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </HomeSectionReveal>

            <AIViz />
          </div>
        </div>
      </section>
    </div>
  );
}
