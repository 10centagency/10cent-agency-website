import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  FaCheck,
  FaXmark,
  FaBuilding,
  FaArrowRight,
  FaUtensils,
  FaShirt,
  FaGraduationCap,
  FaSuitcaseMedical,
  FaCartShopping,
  FaScaleBalanced,
  FaWandMagicSparkles,
  FaRocket,
  FaStore,
  FaBookOpen,
  FaPlane,
  FaPills,
  FaDumbbell,
  FaHandshake,
  FaUsers,
  FaBullhorn,
} from 'react-icons/fa6';
import styles from './AboutSections.module.css';
import AbReveal from './AbReveal.client';
import { AbCaseStudiesGrid, AbStatsBand } from './AbCounters.client';
import AbBeforeAfter from './AbBeforeAfter.client';
import {
  whyChooseUsData,
  caseStudiesData,
  promiseData,
  numbersData,
  problemBeforeAfterData,
  industriesData,
  communityData,
  IndustryItem,
} from './aboutSectionsData';

function getIndustryIcon(iconName: IndustryItem['iconName']) {
  switch (iconName) {
    case 'FaUtensils':
      return <FaUtensils aria-hidden="true" />;
    case 'FaShirt':
      return <FaShirt aria-hidden="true" />;
    case 'FaGraduationCap':
      return <FaGraduationCap aria-hidden="true" />;
    case 'FaSuitcaseMedical':
      return <FaSuitcaseMedical aria-hidden="true" />;
    case 'FaBuilding':
      return <FaBuilding aria-hidden="true" />;
    case 'FaCartShopping':
      return <FaCartShopping aria-hidden="true" />;
    case 'FaScaleBalanced':
      return <FaScaleBalanced aria-hidden="true" />;
    case 'FaWandMagicSparkles':
      return <FaWandMagicSparkles aria-hidden="true" />;
    case 'FaRocket':
      return <FaRocket aria-hidden="true" />;
    case 'FaStore':
      return <FaStore aria-hidden="true" />;
    case 'FaBookOpen':
      return <FaBookOpen aria-hidden="true" />;
    case 'FaPlane':
      return <FaPlane aria-hidden="true" />;
    case 'FaPills':
      return <FaPills aria-hidden="true" />;
    case 'FaDumbbell':
      return <FaDumbbell aria-hidden="true" />;
    default:
      return null;
  }
}

function getCommunityIcon(iconName: 'FaHandshake' | 'FaUsers' | 'FaBullhorn') {
  switch (iconName) {
    case 'FaHandshake':
      return <FaHandshake aria-hidden="true" />;
    case 'FaUsers':
      return <FaUsers aria-hidden="true" />;
    case 'FaBullhorn':
      return <FaBullhorn aria-hidden="true" />;
    default:
      return null;
  }
}

export default function AboutNewSections() {
  return (
    <div className={styles.aboutSectionsScope}>
      {/* ══════════════════════════════════════════════════════════
          SECTION 1 — WHY CHOOSE US (VS Comparison Cards)
      ════════════════════════════════════════════════════════════ */}
      <section
        className={`${styles.section} ${styles.secWhy}`}
        id="why-choose-us"
        aria-labelledby="heading-why-choose-us"
      >
        <div className={styles.container}>
          <AbReveal variant="fadeUp">
            <div className={`${styles.secHead} ${styles.secHeadCenter}`}>
              <div className={styles.labelTag}>{whyChooseUsData.label}</div>
              <h2 id="heading-why-choose-us" className={styles.secTitle}>
                {whyChooseUsData.titlePrefix}
                <span className={styles.titleAccent}>
                  {whyChooseUsData.titleAccent}
                </span>
              </h2>
              <p className={styles.secSub}>{whyChooseUsData.description}</p>
            </div>
          </AbReveal>

          <div className={styles.vsWrap}>
            {/* 10 Cent Agency (Us) */}
            <AbReveal
              variant="slideLeft"
              className={`${styles.vsCard} ${styles.us}`}
              style={{ height: '100%' }}
            >
              <div className={styles.vsHead}>
                <div className={`${styles.vsLogo} ${styles.us}`}>
                  <Image
                    src={whyChooseUsData.usCard.logoSrc || '/favicon-48x48.png'}
                    alt="10 Cent Agency logo"
                    width={42}
                    height={42}
                    className={styles.vsLogoImg}
                  />
                </div>
                <div className={styles.vsHeadText}>
                  <strong>{whyChooseUsData.usCard.title}</strong>
                  <span>{whyChooseUsData.usCard.subtitle}</span>
                </div>
                <span className={styles.vsPick}>
                  {whyChooseUsData.usCard.badge}
                </span>
              </div>
              <ul className={styles.vsList}>
                {whyChooseUsData.usCard.rows.map((row, idx) => (
                  <li key={idx}>
                    <span
                      className={`${styles.vsIc} ${styles.ok}`}
                      aria-hidden="true"
                    >
                      <FaCheck />
                    </span>
                    {row}
                  </li>
                ))}
              </ul>
            </AbReveal>

            {/* VS Badge */}
            <div className={styles.vsBadge} aria-hidden="true">
              VS
            </div>

            {/* Typical Corporate Agency (Them) */}
            <AbReveal
              variant="slideRight"
              className={`${styles.vsCard} ${styles.them}`}
              style={{ height: '100%' }}
            >
              <div className={styles.vsHead}>
                <div className={`${styles.vsLogo} ${styles.them}`}>
                  <FaBuilding aria-hidden="true" />
                </div>
                <div className={styles.vsHeadText}>
                  <strong>{whyChooseUsData.themCard.title}</strong>
                  <span>{whyChooseUsData.themCard.subtitle}</span>
                </div>
              </div>
              <ul className={styles.vsList}>
                {whyChooseUsData.themCard.rows.map((row, idx) => (
                  <li key={idx}>
                    <span
                      className={`${styles.vsIc} ${styles.no}`}
                      aria-hidden="true"
                    >
                      <FaXmark />
                    </span>
                    {row}
                  </li>
                ))}
              </ul>
            </AbReveal>
          </div>

          <AbReveal
            variant="fadeUp"
            delay="0.25s"
            className={styles.whyNote}
          >
            <strong>The result:</strong> {whyChooseUsData.conclusionNote}
          </AbReveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 2 — RESULTS / CASE STUDIES
      ════════════════════════════════════════════════════════════ */}
      <section
        className={`${styles.section} ${styles.secResults}`}
        id="results"
        aria-labelledby="heading-results"
      >
        <div className={styles.container}>
          <AbReveal variant="fadeUp">
            <div className={`${styles.secHead} ${styles.secHeadCenter}`}>
              <div className={styles.labelTag}>{caseStudiesData.label}</div>
              <h2 id="heading-results" className={styles.secTitle}>
                {caseStudiesData.titlePrefix}
                <span className={styles.titleAccent}>
                  {caseStudiesData.titleAccent}
                </span>
              </h2>
              <p className={styles.secSub}>{caseStudiesData.description}</p>
            </div>
          </AbReveal>

          <AbCaseStudiesGrid />

          <AbReveal variant="fadeUp" delay="0.3s">
            <div className={styles.resultsCta}>
              <Link href={caseStudiesData.ctaHref} className={styles.btnGhost}>
                {caseStudiesData.ctaText} <FaArrowRight aria-hidden="true" />
              </Link>
            </div>
          </AbReveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 3 — OUR PROMISE
      ════════════════════════════════════════════════════════════ */}
      <section
        className={`${styles.section} ${styles.secPromise}`}
        id="promise"
        aria-labelledby="heading-promise"
      >
        <div className={styles.container}>
          <div className={styles.promiseWrap}>
            <AbReveal
              variant="fadeUp"
              className={styles.labelTag}
              style={{ display: 'inline-flex' }}
            >
              <span id="heading-promise">{promiseData.label}</span>
            </AbReveal>

            <AbReveal variant="fadeUp" className={styles.promiseLine}>
              No <span className={styles.strike}>waste</span>.
            </AbReveal>

            <AbReveal
              variant="fadeUp"
              delay="0.12s"
              className={styles.promiseLine}
            >
              No <span className={styles.strike}>hidden fees</span>.
            </AbReveal>

            <AbReveal
              variant="fadeUp"
              delay="0.24s"
              className={styles.promiseLine}
            >
              No <span className={styles.strike}>lock-in contracts</span>.
            </AbReveal>

            <AbReveal
              variant="fadeUp"
              delay="0.4s"
              className={styles.promiseLine}
            >
              Just honest work that{' '}
              <span className={styles.hl}>grows your business</span>.
            </AbReveal>

            <AbReveal
              variant="fadeUp"
              delay="0.6s"
              className={styles.promiseChips}
            >
              {promiseData.chips.map((chip, idx) => (
                <span key={idx} className={styles.pChip}>
                  <FaCheck aria-hidden="true" /> {chip}
                </span>
              ))}
            </AbReveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 4 — BY THE NUMBERS
      ════════════════════════════════════════════════════════════ */}
      <section
        className={`${styles.section} ${styles.secNumbers}`}
        id="numbers"
        aria-labelledby="heading-numbers"
      >
        <div className={`${styles.blob} ${styles.b1}`} aria-hidden="true" />
        <div className={`${styles.blob} ${styles.b2}`} aria-hidden="true" />
        <div className={styles.container}>
          <AbReveal variant="fadeUp">
            <div className={`${styles.secHead} ${styles.secHeadCenter}`}>
              <div className={styles.labelTag}>{numbersData.label}</div>
              <h2 id="heading-numbers" className={styles.secTitle}>
                {numbersData.titlePrefix}
                <span className={styles.titleAccent}>
                  {numbersData.titleAccent}
                </span>
              </h2>
            </div>
          </AbReveal>

          <AbStatsBand />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 5 — THE PROBLEM WE SOLVE (Interactive Switch)
      ════════════════════════════════════════════════════════════ */}
      <section
        className={`${styles.section} ${styles.secProblem}`}
        id="problem"
        aria-labelledby="heading-problem"
      >
        <div className={styles.container}>
          <AbReveal variant="fadeUp">
            <div className={`${styles.secHead} ${styles.secHeadCenter}`}>
              <div className={styles.labelTag}>
                {problemBeforeAfterData.label}
              </div>
              <h2 id="heading-problem" className={styles.secTitle}>
                {problemBeforeAfterData.titlePrefix}
                <span className={styles.titleAccent}>
                  {problemBeforeAfterData.titleAccent}
                </span>
              </h2>
              <p className={styles.secSub}>{problemBeforeAfterData.description}</p>
            </div>
          </AbReveal>

          <AbBeforeAfter />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 6 — INDUSTRIES WE SERVE
      ════════════════════════════════════════════════════════════ */}
      <section
        className={`${styles.section} ${styles.secIndustries}`}
        id="industries"
        aria-labelledby="heading-industries"
      >
        <div className={styles.container}>
          <AbReveal variant="fadeUp">
            <div className={`${styles.secHead} ${styles.secHeadCenter}`}>
              <div className={styles.labelTag}>Industries We Serve</div>
              <h2 id="heading-industries" className={styles.secTitle}>
                We Speak Your{' '}
                <span className={styles.titleAccent}>
                  Industry&apos;s Language
                </span>
              </h2>
              <p className={styles.secSub}>
                From restaurants to real estate — every strategy is built around
                how your customers actually buy.
              </p>
            </div>
          </AbReveal>

          <div className={styles.indGrid}>
            {industriesData.map((ind) => (
              <AbReveal
                key={ind.name}
                variant="fadeUp"
                delay={ind.delay}
                className={styles.indCard}
                style={{ height: '100%' }}
              >
                {getIndustryIcon(ind.iconName)}
                <span>{ind.name}</span>
              </AbReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 7 — COMMUNITY COMMITMENT
      ════════════════════════════════════════════════════════════ */}
      <section
        className={`${styles.section} ${styles.secCommunity}`}
        id="community"
        aria-labelledby="heading-community"
      >
        <div className={styles.container}>
          <AbReveal variant="fadeUp">
            <div className={`${styles.secHead} ${styles.secHeadCenter}`}>
              <div className={styles.labelTag}>{communityData.label}</div>
              <h2 id="heading-community" className={styles.secTitle}>
                {communityData.titlePrefix}
                <span className={styles.titleAccent}>
                  {communityData.titleAccent}
                </span>
              </h2>
              <p className={styles.secSub}>{communityData.description}</p>
            </div>
          </AbReveal>

          <div className={styles.comGrid}>
            {communityData.cards.map((card) => (
              <AbReveal
                key={card.title}
                variant="fadeUp"
                delay={card.delay}
                className={styles.comCard}
                style={{ height: '100%' }}
              >
                <div className={styles.comTop}>
                  <div className={styles.comIcon}>
                    {getCommunityIcon(card.iconName)}
                  </div>
                  <span className={styles.comTag}>{card.tag}</span>
                </div>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </AbReveal>
            ))}
          </div>

          <AbReveal
            variant="fadeUp"
            delay="0.3s"
            className={styles.comRefer}
          >
            {communityData.referralText}{' '}
            <Link href={communityData.referralHref}>
              {communityData.referralLinkText}
            </Link>
          </AbReveal>
        </div>
      </section>
    </div>
  );
}
