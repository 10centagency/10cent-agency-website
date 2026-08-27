import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import CTABanner from '@/components/home/CTABanner';
import styles from './ServicesHub.module.css';

// Client Components
import GoalFinder from './GoalFinder.client';
import ServicesFAQ from './ServicesFAQ.client';
import HubNumbers from './HubNumbers.client';

// Data
import {
  heroData,
  iconNavChips,
  marqueeItems,
  compareRowsData,
  processStepsData,
  whyUsCardsData,
  industriesData,
  comingSoonData,
  getServicesSchemaGraph,
  iconMap,
} from './servicesData';

// Icons
import {
  FaBolt,
  FaArrowDown,
  FaGoogle,
  FaFacebookF,
  FaMagnifyingGlassChart,
  FaScaleBalanced,
  FaDiagramProject,
  FaAward,
  FaBriefcase,
  FaClock,
  FaCircleQuestion,
} from 'react-icons/fa6';

export const metadata: Metadata = {
  title: 'Our Services | 10 Cent Agency',
  description:
    'A complete suite of 7 digital services designed to grow your business — Facebook & Meta Marketing, Google Ads, Website Development, AI Automation, Social Media Management, SEO/AEO/GEO, and Graphic Design.',
  alternates: {
    canonical: 'https://www.10centagency.com/services',
  },
  openGraph: {
    type: 'website',
    url: 'https://www.10centagency.com/services',
    siteName: '10 Cent Agency',
    title: 'Our Services | 10 Cent Agency',
    description:
      'A complete suite of 7 digital services designed to grow your business — Facebook & Meta Marketing, Google Ads, Website Development, AI Automation, Social Media Management, SEO/AEO/GEO, and Graphic Design.',
    images: [
      {
        url: 'https://www.10centagency.com/og-image.png',
        width: 1200,
        height: 630,
        alt: '10 Cent Agency — Complete Suite of Digital Marketing Services in Bangladesh',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Services | 10 Cent Agency',
    description:
      'A complete suite of 7 digital services designed to grow your business — Facebook & Meta Marketing, Google Ads, Website Development, AI Automation, Social Media Management, SEO/AEO/GEO, and Graphic Design.',
    images: ['https://www.10centagency.com/og-image.png'],
  },
};

export default function ServicesPage() {
  const schemaGraph = getServicesSchemaGraph();

  return (
    <>
      {/* ===================== JSON-LD STRUCTURED DATA (6 Connected Nodes) ===================== */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaGraph).replace(/</g, '\\u003c'),
        }}
      />

      <div className={styles.pageRoot}>
        {/* ===================== 1. HERO — CENTERED EDITORIAL + ICON NAV STRIP ===================== */}
        <section className={styles.heroEditorial}>
          <div className={styles.container}>
            <div className={styles.heroContent}>
              <span className={styles.eyebrow}>
                <FaBolt aria-hidden="true" /> {heroData.tag}
              </span>
              <h1 className={styles.heroTitle}>
                {heroData.titleStart}
                <span className={styles.accentUnderline}>
                  {heroData.titleAccent}
                  <svg
                    viewBox="0 0 300 14"
                    preserveAspectRatio="none"
                    className={styles.accentUnderlineSvg}
                    aria-hidden="true"
                  >
                    <path
                      d="M2 10C60 2 240 2 298 10"
                      stroke="#2F85F3"
                      strokeWidth="4"
                      strokeLinecap="round"
                      fill="none"
                      opacity="0.35"
                    />
                  </svg>
                </span>
              </h1>
              <p className={styles.heroLead}>{heroData.lead}</p>

              <div className={styles.heroActions}>
                <a
                  href={heroData.primaryCtaHref}
                  className={`${styles.btn} ${styles.btnPrimary}`}
                >
                  <span>{heroData.primaryCtaText}</span>
                  <FaArrowDown aria-hidden="true" />
                </a>
                <Link
                  href={heroData.secondaryCtaHref}
                  className={`${styles.btn} ${styles.btnOutline}`}
                >
                  {heroData.secondaryCtaText}
                </Link>
              </div>

              <div className={styles.heroTrust}>
                {heroData.trustItems.map((item, idx) => {
                  const TrustIcon = iconMap[item.icon] || FaBolt;
                  return (
                    <span key={idx} className={styles.heroTrustItem}>
                      <TrustIcon aria-hidden="true" />
                      <span>{item.text}</span>
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Icon Nav Strip — Jumps straight to each service card */}
            <nav
              className={styles.iconNavStrip}
              aria-label="Services quick navigation"
            >
              {iconNavChips.map((chip) => {
                const ChipIcon = iconMap[chip.icon] || FaBolt;
                return (
                  <a
                    key={chip.id}
                    href={`#${chip.cardId}`}
                    className={styles.iconNavItem}
                  >
                    <div
                      className={styles.niIco}
                      style={{ backgroundColor: chip.color }}
                    >
                      <ChipIcon aria-hidden="true" />
                    </div>
                    <div className={styles.niLabel}>
                      {chip.labelFirst}
                      <br />
                      {chip.labelSecond}
                    </div>
                    <div className={styles.niTag} style={{ color: chip.color }}>
                      {chip.tag}
                    </div>
                  </a>
                );
              })}
            </nav>
          </div>
        </section>

        {/* ===================== 2. TRUST MARQUEE ===================== */}
        <div className={styles.trustStrip} aria-label="Agency highlights and credentials">
          <div className={styles.marqueeWrap}>
            <div className={styles.marqueeTrack}>
              {marqueeItems.map((item, idx) => {
                const MarqueeIcon = iconMap[item.icon] || FaBolt;
                return (
                  <span key={`mq-1-${idx}`} className={styles.marqueeItem}>
                    <MarqueeIcon aria-hidden="true" />
                    <b>{item.highlight}</b> {item.suffix}
                  </span>
                );
              })}
            </div>
            {/* Duplicated track for seamless infinite CSS loop */}
            <div className={styles.marqueeTrack} aria-hidden="true">
              {marqueeItems.map((item, idx) => {
                const MarqueeIcon = iconMap[item.icon] || FaBolt;
                return (
                  <span key={`mq-2-${idx}`} className={styles.marqueeItem}>
                    <MarqueeIcon aria-hidden="true" />
                    <b>{item.highlight}</b> {item.suffix}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* ===================== 3. GOAL FINDER & 4. SERVICE CARDS ===================== */}
        <GoalFinder />

        {/* ===================== 5. COMPARE CHANNELS ===================== */}
        <section className={`${styles.section} ${styles.compareSection}`}>
          <div className={styles.container}>
            <div className={styles.sectionHead}>
              <span className={styles.eyebrow}>
                <FaScaleBalanced aria-hidden="true" /> Know The Difference
              </span>
              <h2 className={styles.sectionTitle}>Google Ads vs Facebook Ads vs SEO</h2>
              <p className={styles.sectionDesc}>
                Three different jobs in your growth plan — most clients run more than one, together.
              </p>
            </div>

            {/* Desktop / Tablet: Full Comparison Table */}
            <div className={styles.compareTableWrap}>
              <table className={styles.compareTable}>
                <thead>
                  <tr>
                    <th>Factor</th>
                    <th>
                      <FaGoogle aria-hidden="true" /> Google Ads
                    </th>
                    <th>
                      <FaFacebookF aria-hidden="true" /> Facebook / Meta Ads
                    </th>
                    <th>
                      <FaMagnifyingGlassChart aria-hidden="true" /> SEO, AEO &amp; GEO
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {compareRowsData.map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.factor}</td>
                      <td>{row.googleAds}</td>
                      <td>{row.facebookAds}</td>
                      <td>{row.seo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile: Grouped-by-Factor Stacked Cards */}
            <div className={styles.compareStack}>
              {compareRowsData.map((row, idx) => (
                <div key={idx} className={styles.compareGroup}>
                  <div className={styles.compareGroupHead}>{row.factor}</div>
                  <div className={styles.compareRow}>
                    <span
                      className={styles.compareRowLabel}
                      style={{ '--row-accent': '#EA4335' } as React.CSSProperties}
                    >
                      <FaGoogle aria-hidden="true" /> Google Ads
                    </span>
                    <span className={styles.compareRowValue}>{row.googleAds}</span>
                  </div>
                  <div className={styles.compareRow}>
                    <span
                      className={styles.compareRowLabel}
                      style={{ '--row-accent': '#1877F2' } as React.CSSProperties}
                    >
                      <FaFacebookF aria-hidden="true" /> Facebook Ads
                    </span>
                    <span className={styles.compareRowValue}>{row.facebookAds}</span>
                  </div>
                  <div className={styles.compareRow}>
                    <span
                      className={styles.compareRowLabel}
                      style={{ '--row-accent': '#059669' } as React.CSSProperties}
                    >
                      <FaMagnifyingGlassChart aria-hidden="true" /> SEO, AEO &amp; GEO
                    </span>
                    <span className={styles.compareRowValue}>{row.seo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== 6. PROCESS ===================== */}
        <section className={`${styles.section} ${styles.processSection}`}>
          <div className={styles.container}>
            <div className={styles.sectionHead}>
              <span className={styles.eyebrow}>
                <FaDiagramProject aria-hidden="true" /> Our Process
              </span>
              <h2 className={styles.sectionTitle}>How We Work — On Every Service</h2>
              <p className={styles.sectionDesc}>
                Same transparent process whether it&apos;s ads, a website, a chatbot, or a full brand system.
              </p>
            </div>

            <div className={styles.processTrack}>
              {processStepsData.map((step) => {
                const StepIcon = iconMap[step.icon] || FaBolt;
                return (
                  <div key={step.number} className={styles.processStep}>
                    <div className={styles.processNum}>
                      <StepIcon aria-hidden="true" />
                    </div>
                    <h3 className={styles.processStepTitle}>{step.title}</h3>
                    <p className={styles.processStepDesc}>{step.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===================== 7. NUMBERS STRIP ===================== */}
        <section className={`${styles.sectionTight} ${styles.numbersSection}`}>
          <div className={styles.container}>
            <HubNumbers />
          </div>
        </section>

        {/* ===================== 8. WHY 10 CENT AGENCY ===================== */}
        <section className={`${styles.section} ${styles.whyUsSection}`}>
          <div className={styles.container}>
            <div className={styles.sectionHead}>
              <span className={styles.eyebrow}>
                <FaAward aria-hidden="true" /> Why 10 Cent Agency
              </span>
              <h2 className={styles.sectionTitle}>Pure Execution, Zero Confusion</h2>
              <p className={styles.sectionDesc}>
                The same standards apply across every one of our 7 services.
              </p>
            </div>

            <div className={styles.whyGrid}>
              {whyUsCardsData.map((card, idx) => {
                const WhyIcon = iconMap[card.icon] || FaAward;
                return (
                  <div key={idx} className={styles.whyCard}>
                    <div className={styles.whyIcon}>
                      <WhyIcon aria-hidden="true" />
                    </div>
                    <h3 className={styles.whyCardTitle}>{card.title}</h3>
                    <p className={styles.whyCardDesc}>{card.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===================== 9. INDUSTRIES WE SERVE ===================== */}
        <section className={`${styles.sectionTight} ${styles.industriesSection}`}>
          <div className={styles.container}>
            <div className={styles.sectionHead}>
              <span className={styles.eyebrow}>
                <FaBriefcase aria-hidden="true" /> Who We Work With
              </span>
              <h2 className={styles.sectionTitle}>Industries We Serve</h2>
              <p className={styles.sectionDesc}>
                Whatever your business, we&apos;ve likely already grown one just like it.
              </p>
            </div>

            <div className={styles.industriesGrid}>
              {industriesData.map((ind, idx) => {
                const IndIcon = iconMap[ind.icon] || FaBriefcase;
                return (
                  <div key={idx} className={styles.industryChip}>
                    <IndIcon aria-hidden="true" />
                    <span>{ind.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===================== 10. COMING SOON ===================== */}
        <section className={`${styles.sectionTight} ${styles.comingSoonSection}`}>
          <div className={`${styles.container} ${styles.center}`}>
            <span className={styles.eyebrow}>
              <FaClock aria-hidden="true" /> Coming Soon
            </span>
            <h2 className={styles.sectionTitle} style={{ fontSize: '26px' }}>
              We&apos;re Expanding — Stay Tuned
            </h2>
            <p
              className={styles.sectionDesc}
              style={{ marginBottom: '36px' }}
            >
              Two more services joining the lineup this year.
            </p>

            <div className={styles.comingGrid}>
              {comingSoonData.map((item, idx) => {
                const ComingIcon = iconMap[item.icon] || FaClock;
                return (
                  <div key={idx} className={styles.comingCard}>
                    <div className={styles.comingIcon}>
                      <ComingIcon aria-hidden="true" />
                    </div>
                    <h3 className={styles.comingTitle}>{item.title}</h3>
                    <span className={styles.comingBadge}>{item.status}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===================== 11. FAQ ===================== */}
        <section className={`${styles.section} ${styles.faqSection}`}>
          <div className={styles.container}>
            <div className={styles.sectionHead}>
              <span className={styles.eyebrow}>
                <FaCircleQuestion aria-hidden="true" /> Frequently Asked Questions
              </span>
              <h2 className={styles.sectionTitle}>Everything You Need to Know</h2>
              <p className={styles.sectionDesc}>
                Don&apos;t see your question? Reach out — we reply fast.
              </p>
            </div>

            <ServicesFAQ />
          </div>
        </section>
      </div>

      {/* ===================== CTA BANNER (Single Shared Component outside pageRoot) ===================== */}
      <CTABanner />
    </>
  );
}
