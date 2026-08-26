import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { JetBrains_Mono } from 'next/font/google';
import CTABanner from '@/components/home/CTABanner';
import styles from './GoogleAds.module.css';

// Client Components
import GaAdPreview from './GaAdPreview.client';
import GaOverviewMotion from './GaOverviewMotion.client';
import GaHowWeWork from './GaHowWeWork.client';
import GaStrategyTabs from './GaStrategyTabs.client';
import GaFunnel from './GaFunnel.client';
import GaBeforeAfter from './GaBeforeAfter.client';
import GaStats from './GaStats.client';
import GaReportFeed from './GaReportFeed.client';
import GaFAQ from './GaFAQ.client';

import RelatedServices from '@/components/services/RelatedServices.client';

// Data
import {
  heroData,
  serviceCardsData,
  comparisonTableData,
  comparisonTableCaption,
  techStackData,
  whyChooseUsData,
  commonMistakesData,
  pricingPackagesData,
  industriesData,
  testimonialsData,
  closingSummaryData,
  getGoogleAdsSchemaGraph,
} from './googleAdsData';

// Icons
import {
  FaArrowLeft,
  FaCircleCheck,
  FaCircleInfo,
  FaGoogle,
  FaFacebook,
  FaMagnifyingGlassChart,
  FaMagnifyingGlass,
  FaChartSimple,
  FaUserSecret,
  FaGears,
  FaTableList,
  FaStore,
  FaYoutube,
  FaBullseye,
  FaTags,
  FaChartArea,
  FaShieldHalved,
  FaChartPie,
  FaGoogleDrive,
  FaFileInvoice,
  FaTable,
  FaEye,
  FaEarthAsia,
  FaKey,
  FaUserTie,
  FaCartShopping,
  FaHouse,
  FaHeartPulse,
  FaGraduationCap,
  FaBriefcase,
  FaUtensils,
  FaStar,
  FaGlobe,
  FaRobot,
} from 'react-icons/fa6';

// Route-scoped JetBrains Mono font
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

// Icon maps
const techCategoryIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FaMagnifyingGlass,
  FaGears,
  FaBullseye,
  FaChartPie,
};

const techToolIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FaGoogle,
  FaChartSimple,
  FaUserSecret,
  FaTableList,
  FaStore,
  FaYoutube,
  FaTags,
  FaChartArea,
  FaShieldHalved,
  FaGoogleDrive,
  FaFileInvoice,
  FaTable,
};

const whyIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FaEye,
  FaBullseye,
  FaEarthAsia,
  FaFileInvoice,
  FaKey,
  FaUserTie,
};

const industryIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FaCartShopping,
  FaHouse,
  FaHeartPulse,
  FaGraduationCap,
  FaBriefcase,
  FaUtensils,
};

export const metadata: Metadata = {
  title: 'Google Ads Management Services in Bangladesh | 10 Cent Agency',
  description:
    'Google Ads management in Bangladesh — Search, Shopping, Display, YouTube & Performance Max campaigns. Transparent reporting, no markup on ad spend. Book a free audit.',
  alternates: {
    canonical: 'https://www.10centagency.com/services/google-ads',
  },
  openGraph: {
    type: 'website',
    url: 'https://www.10centagency.com/services/google-ads',
    siteName: '10 Cent Agency',
    title: 'Google Ads Management Services in Bangladesh | 10 Cent Agency',
    description:
      'Google Ads management in Bangladesh — Search, Shopping, Display, YouTube & Performance Max campaigns. Transparent reporting, no markup on ad spend. Book a free audit.',
    images: [
      {
        url: 'https://www.10centagency.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Google Ads Management Services in Bangladesh | 10 Cent Agency',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Google Ads Management Services in Bangladesh | 10 Cent Agency',
    description:
      'Google Ads management in Bangladesh — Search, Shopping, Display, YouTube & Performance Max campaigns. Transparent reporting, no markup on ad spend. Book a free audit.',
    images: ['https://www.10centagency.com/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function GoogleAdsPage() {
  const schemaGraph = getGoogleAdsSchemaGraph();

  return (
    <>
      {/* Single Server-Rendered Connected Schema.org @graph */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaGraph).replace(/</g, '\\u003c'),
        }}
      />

      <div className={`${styles.pageRoot} ${jetbrainsMono.variable}`}>
        {/* ===================== 1. HERO ===================== */}
        <section className={styles.hero}>
          <div className={styles.container}>
            {/* Breadcrumb */}
            <div className={styles.breadcrumb} aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span className={styles.breadcrumbSep}>&gt;</span>
              <Link href="/services">Services</Link>
              <span className={styles.breadcrumbSep}>&gt;</span>
              <span className={styles.breadcrumbCurrent}>{heroData.title}</span>
            </div>

            <h1>{heroData.title}</h1>
            <p>{heroData.description}</p>
            <div className={styles.heroActions}>
              <Link href={heroData.primaryCtaHref} className={`${styles.btn} ${styles.btnPrimary}`}>
                {heroData.primaryCtaText}
              </Link>
              <Link href={heroData.outlineCtaHref} className={`${styles.btn} ${styles.btnOutline}`}>
                <FaArrowLeft aria-hidden="true" /> {heroData.outlineCtaText}
              </Link>
            </div>
          </div>
        </section>

        {/* ===================== 2. QUICK ANSWER — LIVE AD PREVIEW MOCKUP ===================== */}
        <GaAdPreview />

        {/* ===================== 3. OVERVIEW — WHY BUSINESSES DON'T WAIT ===================== */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={`${styles.center} ${styles.ovIntro}`}>
              <span className={styles.sectionTag}>The Bigger Picture</span>
              <h2 className={styles.sectionTitle} style={{ fontSize: '32px' }}>
                Why Businesses Don&apos;t Wait for Organic Traffic
              </h2>
              <p>
                Real numbers behind why paid search is the fastest way to reach buyers who are ready
                to purchase right now.
              </p>
            </div>

            <GaOverviewMotion />
          </div>
        </section>

        {/* ===================== 4. SERVICE BREAKDOWN ===================== */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Core Service</span>
              <h2 className={styles.sectionTitle}>Google Ads Management Services</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                A complete paid search system — from account setup to daily optimization — covering
                every campaign type that drives real business results.
              </p>
            </div>

            <div className={styles.cardsGrid}>
              {serviceCardsData.map((card) => (
                <div key={card.id} className={styles.serviceCard}>
                  <span className={styles.badge}>{card.badge}</span>
                  <h3>{card.title}</h3>
                  <ul>
                    {card.checklist.map((item, idx) => (
                      <li key={idx}>
                        <FaCircleCheck className={styles.serviceCardCheckIcon} aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== 5. HOW WE WORK ===================== */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Our Process</span>
              <h2 className={styles.sectionTitle}>How We Work</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                From account audit to a fully optimized campaign — a transparent process with no
                guesswork.
              </p>
            </div>

            <GaHowWeWork />
          </div>
        </section>

        {/* ===================== 6. STRATEGY TABS (IN-DEPTH APPROACH) ===================== */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>In-Depth Strategy</span>
              <h2 className={styles.sectionTitle}>Our Google Ads Approach</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                A closer look at the exact techniques we use to keep cost-per-conversion low and
                quality traffic high.
              </p>
            </div>

            <GaStrategyTabs />
          </div>
        </section>

        {/* ===================== 7. BUDGET FUNNEL ===================== */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Where Your Budget Goes</span>
              <h2 className={styles.sectionTitle}>From Impression to Sale — The Full Funnel</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                We don&apos;t just optimize for clicks — every stage of this funnel gets tracked and
                improved.
              </p>
            </div>

            <GaFunnel />
          </div>
        </section>

        {/* ===================== 8. COMPARISON TABLE ===================== */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Know The Difference</span>
              <h2 className={styles.sectionTitle}>Google Ads vs Facebook Ads vs SEO</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                Three different channels, three different jobs — here&apos;s how each one fits into
                your growth plan.
              </p>
            </div>

            <div className={styles.compareTableWrap}>
              <table className={styles.compareTable}>
                <thead>
                  <tr>
                    <th scope="col">Factor</th>
                    <th scope="col">
                      <FaGoogle className={styles.compareTableThIcon} aria-hidden="true" />
                      Google Ads
                    </th>
                    <th scope="col">
                      <FaFacebook className={styles.compareTableThIcon} aria-hidden="true" />
                      Facebook Ads
                    </th>
                    <th scope="col">
                      <FaMagnifyingGlassChart
                        className={styles.compareTableThIcon}
                        aria-hidden="true"
                      />
                      SEO
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonTableData.map((row, idx) => (
                    <tr key={idx}>
                      <td data-label="Factor">{row.factor}</td>
                      <td data-label="Google Ads">{row.googleAds}</td>
                      <td data-label="Facebook Ads">{row.facebookAds}</td>
                      <td data-label="SEO">{row.seo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className={styles.caption} style={{ marginTop: '20px' }}>
              <FaCircleInfo className={styles.captionIcon} aria-hidden="true" />
              <span>{comparisonTableCaption}</span>
            </p>
          </div>
        </section>

        {/* ===================== 9. TECH STACK (TOOLS WE USE) ===================== */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Tools &amp; Technology</span>
              <h2 className={styles.sectionTitle}>Tools We Use</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                Industry-standard tools for research, campaign management, and performance
                tracking.
              </p>
            </div>

            <div className={styles.techStackGrid}>
              {techStackData.map((category, cIdx) => {
                const CatIcon = techCategoryIconMap[category.iconKey] || FaMagnifyingGlass;
                return (
                  <div key={cIdx} className={styles.techCategory}>
                    <div className={styles.techCategoryHeader}>
                      <div className={styles.techCategoryIcon}>
                        <CatIcon aria-hidden="true" />
                      </div>
                      <h4>{category.category}</h4>
                    </div>
                    <div className={styles.techItemList}>
                      {category.tools.map((tool, tIdx) => {
                        const ToolIcon = techToolIconMap[tool.iconKey] || FaGoogle;
                        return (
                          <div key={tIdx} className={styles.techItem}>
                            <div className={styles.techItemIcon}>
                              <ToolIcon aria-hidden="true" />
                            </div>
                            <span>{tool.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===================== 10. WHY WORK WITH US ===================== */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Why 10 Cent Agency</span>
              <h2 className={styles.sectionTitle}>Why Work With Us</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                We manage your budget like it&apos;s our own — because our fee doesn&apos;t depend on
                how much you spend.
              </p>
            </div>

            <div className={styles.whyGrid}>
              {whyChooseUsData.map((card) => {
                const IconComp = whyIconMap[card.iconKey] || FaEye;
                return (
                  <div key={card.id} className={styles.whyCard}>
                    <div className={styles.whyIcon}>
                      <IconComp aria-hidden="true" />
                    </div>
                    <h4>{card.title}</h4>
                    <p>{card.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===================== 11. 5 COMMON MISTAKES ===================== */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container} style={{ maxWidth: '950px' }}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Avoid These Pitfalls</span>
              <h2 className={styles.sectionTitle}>
                5 Common Mistakes Businesses Make with Google Ads
              </h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                We&apos;ve audited dozens of self-managed accounts in Bangladesh. Here&apos;s what
                usually goes wrong.
              </p>
            </div>

            <div className={styles.mistakesList}>
              {commonMistakesData.map((mistake) => (
                <div key={mistake.number} className={styles.mistakeRow}>
                  <div className={styles.mistakeNum}>{mistake.number}</div>
                  <div>
                    <h4>{mistake.title}</h4>
                    <p>{mistake.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== 12. BEFORE VS AFTER OUR OPTIMIZATION ===================== */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Real Transformation</span>
              <h2 className={styles.sectionTitle}>Before vs After Our Optimization</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                A real snapshot of how account health typically shifts within the first 90 days of
                management.
              </p>
            </div>

            <GaBeforeAfter />
          </div>
        </section>

        {/* ===================== 13. STATS / RESULTS ===================== */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container}>
            <GaStats />
          </div>
        </section>

        {/* ===================== 14. REPORT ANATOMY + LIVE FEED ===================== */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>See What You Get</span>
              <h2 className={styles.sectionTitle}>Not Just Ads — A System You Can See</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                Here&apos;s exactly what lands in your inbox every month, and what happens behind the
                scenes every single week.
              </p>
            </div>

            <GaReportFeed />
          </div>
        </section>

        {/* ===================== 15. PRICING ===================== */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Packages</span>
              <h2 className={styles.sectionTitle}>Choose the Right Ads Management Plan</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                Fixed monthly management fee — never a percentage of your ad spend.
              </p>
            </div>

            <div className={styles.pricingGrid}>
              {pricingPackagesData.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`${styles.priceCard} ${pkg.isPopular ? styles.priceCardPopular : ''}`}
                >
                  {pkg.isPopular && <span className={styles.popularBadge}>{pkg.badge}</span>}
                  {!pkg.isPopular && <span className={styles.badge}>{pkg.badge}</span>}
                  <h3>{pkg.title}</h3>
                  <p className={styles.priceNote}>{pkg.note}</p>
                  <ul>
                    {pkg.bullets.map((bullet, bIdx) => (
                      <li key={bIdx}>
                        <FaCircleCheck className={styles.priceCardCheckIcon} aria-hidden="true" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={pkg.ctaHref}
                    className={`${styles.btn} ${
                      pkg.isPopular ? styles.btnPrimary : styles.btnOutline
                    } ${styles.priceCardBtn}`}
                  >
                    {pkg.ctaText}
                  </Link>
                </div>
              ))}
            </div>

            {/* Pricing Note Box with shared caption class */}
            <div className={styles.pricingNoteBox}>
              <p className={styles.caption}>
                <FaCircleInfo className={styles.captionIcon} aria-hidden="true" />
                <span>
                  Your ad spend is billed directly by Google to your own account — our fee is only
                  for management.{' '}
                  <strong>
                    <Link href="/contact">Book a free audit</Link>
                  </strong>{' '}
                  and we&apos;ll recommend the right starting budget and package.
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* ===================== 16. INDUSTRIES ===================== */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Industries We Serve</span>
              <h2 className={styles.sectionTitle}>Google Ads Tailored to Your Industry</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                Every industry has a different buyer journey — here&apos;s how we adapt campaign types
                to match.
              </p>
            </div>

            <div className={styles.industryQueryGrid}>
              {industriesData.map((industry) => {
                const IndIcon = industryIconMap[industry.iconKey] || FaCartShopping;
                return (
                  <div key={industry.id} className={styles.industryQueryCard}>
                    <div className={styles.iqHeader}>
                      <div className={styles.iqIcon}>
                        <IndIcon aria-hidden="true" />
                      </div>
                      <h4>{industry.title}</h4>
                    </div>
                    <p>{industry.description}</p>
                    <span className={styles.iqAiTag}>
                      <FaBullseye className={styles.iqAiTagIcon} aria-hidden="true" />
                      {industry.tagText}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===================== 17. FAQ ===================== */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>FAQ</span>
              <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                Honest, detailed answers to the questions we hear most often about Google Ads
                management
              </p>
            </div>

            <GaFAQ />
          </div>
        </section>

        {/* ===================== 18. TESTIMONIALS ===================== */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Client Voices</span>
              <h2 className={styles.sectionTitle}>What Our Clients Say</h2>
            </div>

            <div className={styles.testiGrid}>
              {testimonialsData.map((testi) => (
                <div key={testi.id} className={styles.testiCard}>
                  <div className={styles.testiTop}>
                    <div
                      className={styles.testiStars}
                      aria-label={`${testi.rating} out of 5 stars`}
                    >
                      <FaStar aria-hidden="true" />
                      <FaStar aria-hidden="true" />
                      <FaStar aria-hidden="true" />
                      <FaStar aria-hidden="true" />
                      {testi.rating >= 5 ? (
                        <FaStar aria-hidden="true" />
                      ) : (
                        <FaStar className={styles.starEmpty} aria-hidden="true" />
                      )}
                    </div>
                    <span className={styles.testiTag}>{testi.tag}</span>
                  </div>
                  <p className={styles.testiQuote}>{testi.quote}</p>
                  <div className={styles.testiUser}>
                    <div className={styles.testiAvatar} aria-hidden="true">
                      {testi.avatar}
                    </div>
                    <div>
                      <h5>
                        <span>{testi.name}</span>
                        <FaCircleCheck
                          className={styles.testiVerified}
                          title="Verified client"
                          aria-label="Verified client"
                        />
                      </h5>
                      <span>{testi.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== 19. CLOSING SUMMARY ===================== */}
        <section className={styles.section}>
          <div className={`${styles.container} ${styles.closingBox}`}>
            <h2>{closingSummaryData.title}</h2>
            {closingSummaryData.paragraphs.map((para, pIdx) => (
              <p key={pIdx}>
                {pIdx === 1 ? (
                  <>
                    At <strong>10 Cent Agency</strong>, we manage your account like it&apos;s our own
                    budget — transparent reporting, no markup on ad spend, and a dedicated manager
                    watching performance every week.
                  </>
                ) : (
                  para
                )}
              </p>
            ))}
          </div>
        </section>

        {/* ===================== 20. RELATED SERVICES ===================== */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Explore More</span>
              <h2 className={styles.sectionTitle}>Related Services</h2>
            </div>

            <RelatedServices currentSlug="google-ads" />
          </div>
        </section>
      </div>

      {/* ===================== CTA BANNER (Single Shared Component outside pageRoot) ===================== */}
      <CTABanner />
    </>
  );
}
