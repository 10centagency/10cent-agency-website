import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { JetBrains_Mono } from 'next/font/google';
import CTABanner from '@/components/home/CTABanner';
import styles from './SeoAeoGeo.module.css';

// Client Components
import SagSERPPreview from './SagSERPPreview.client';
import SagOverviewMotion from './SagOverviewMotion.client';
import SagEvolutionTimeline from './SagEvolutionTimeline.client';
import SagHowWeWork from './SagHowWeWork.client';
import SagStrategyTabs from './SagStrategyTabs.client';
import SagAICitation from './SagAICitation.client';
import SagStats from './SagStats.client';
import SagFAQ from './SagFAQ.client';

import RelatedServices from '@/components/services/RelatedServices.client';

// Data
import {
  comparisonTableData,
  serviceCardsData,
  techStackData,
  whyChooseUsData,
  vsAgenciesData,
  commonMistakesData,
  aiSearchChecklistData,
  pricingPackagesData,
  industriesData,
  testimonialsData,
  getSeoAeoGeoSchemaGraph,
} from './seoAeoGeoData';

// Icons
import {
  FaArrowLeft,
  FaMagnifyingGlass,
  FaStar,
  FaRobot,
  FaCircleInfo,
  FaCircleCheck,
  FaChartLine,
  FaGears,
  FaBrain,
  FaLocationDot,
  FaGoogle,
  FaChartSimple,
  FaMagnifyingGlassChart,
  FaSpider,
  FaCode,
  FaGaugeHigh,
  FaChartArea,
  FaFileCode,
  FaMap,
  FaLink,
  FaLayerGroup,
  FaDatabase,
  FaEarthAsia,
  FaFileInvoice,
  FaShieldHalved,
  FaUserTie,
  FaXmark,
  FaCheck,
  FaCartShopping,
  FaUtensils,
  FaHouse,
  FaHeartPulse,
  FaGraduationCap,
  FaBriefcase,
  FaWandMagicSparkles,
  FaMicrophone,
  FaFacebook,
  FaGlobe,
  FaPalette,
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
  FaChartLine,
  FaGears,
  FaBrain,
  FaLocationDot,
};

const techToolIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FaGoogle,
  FaChartSimple,
  FaMagnifyingGlassChart,
  FaSpider,
  FaCode,
  FaGaugeHigh,
  FaChartArea,
  FaRobot,
  FaFileCode,
  FaMap,
  FaLink,
};

const whyIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FaLayerGroup,
  FaDatabase,
  FaEarthAsia,
  FaFileInvoice,
  FaShieldHalved,
  FaUserTie,
};

const industryIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FaCartShopping,
  FaUtensils,
  FaHouse,
  FaHeartPulse,
  FaGraduationCap,
  FaBriefcase,
};

export const metadata: Metadata = {
  title: 'SEO, AEO & GEO Services in Bangladesh | 10 Cent Agency',
  description:
    'Rank on Google, win Featured Snippets & get cited by ChatGPT, Gemini & AI Overviews. On-page, technical & local SEO + AEO & GEO for Bangladeshi businesses.',
  alternates: {
    canonical: 'https://www.10centagency.com/services/seo-aeo-geo',
  },
  openGraph: {
    type: 'website',
    url: 'https://www.10centagency.com/services/seo-aeo-geo',
    siteName: '10 Cent Agency',
    title: 'SEO, AEO & GEO Services in Bangladesh | 10 Cent Agency',
    description:
      'Rank on Google, win Featured Snippets & get cited by ChatGPT, Gemini & AI Overviews. On-page, technical & local SEO + AEO & GEO for Bangladeshi businesses.',
    images: [
      {
        url: 'https://www.10centagency.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SEO, AEO & GEO Services in Bangladesh | 10 Cent Agency',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEO, AEO & GEO Services in Bangladesh | 10 Cent Agency',
    description:
      'Rank on Google, win Featured Snippets & get cited by ChatGPT, Gemini & AI Overviews. On-page, technical & local SEO + AEO & GEO for Bangladeshi businesses.',
    images: [
      {
        url: 'https://www.10centagency.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SEO, AEO & GEO Services in Bangladesh | 10 Cent Agency',
      },
    ],
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

export default function SeoAeoGeoPage() {
  const schemaGraph = getSeoAeoGeoSchemaGraph();

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
              <span className={styles.breadcrumbCurrent}>SEO, AEO &amp; GEO</span>
            </div>

            <h1>SEO, AEO &amp; GEO Optimization</h1>
            <p>
              Get found everywhere people search — Google&apos;s blue links, Featured Snippets, and
              AI answers from ChatGPT, Gemini &amp; Google AI Overviews. We combine traditional SEO
              with Answer Engine Optimization (AEO) and Generative Engine Optimization (GEO) to
              make your business impossible to miss.
            </p>
            <div className={styles.heroActions}>
              <Link href="/contact" className={`${styles.btn} ${styles.btnPrimary}`}>
                Get a Quote
              </Link>
              <Link href="/services" className={`${styles.btn} ${styles.btnOutline}`}>
                <FaArrowLeft aria-hidden="true" /> Back to Services
              </Link>
            </div>
          </div>
        </section>

        {/* ===================== 2. QUICK ANSWER — SERP MOCKUP ===================== */}
        <SagSERPPreview />

        {/* ===================== 3. OVERVIEW — DATA DASHBOARD ===================== */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={`${styles.center} ${styles.ovIntro}`}>
              <span className={styles.sectionTag}>The Bigger Picture</span>
              <h2 className={styles.sectionTitle} style={{ fontSize: '32px' }}>
                Why SEO Alone Isn&apos;t Enough Anymore
              </h2>
              <p>
                Real numbers behind why search visibility now means more than just ranking blue
                links on Google.
              </p>
            </div>

            <SagOverviewMotion />
          </div>
        </section>

        {/* ===================== 4. SEARCH EVOLUTION TIMELINE ===================== */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>The Journey</span>
              <h2 className={styles.sectionTitle}>The Search Evolution Timeline</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                Search has changed more in the last 5 years than in the previous 20 — here&apos;s why
                relying on SEO alone is no longer enough.
              </p>
            </div>

            <SagEvolutionTimeline />
          </div>
        </section>

        {/* ===================== 5. SEO vs AEO vs GEO COMPARISON TABLE ===================== */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Know The Difference</span>
              <h2 className={styles.sectionTitle}>SEO vs AEO vs GEO — Comparison Table</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                Three different goals, three different playing fields — here&apos;s exactly how each
                one works and where your brand shows up.
              </p>
            </div>

            <div className={styles.compareTableWrap}>
              <table className={styles.compareTable}>
                <thead>
                  <tr>
                    <th scope="col">Factor</th>
                    <th scope="col">
                      <FaMagnifyingGlass className={styles.compareTableThIcon} aria-hidden="true" />
                      SEO
                    </th>
                    <th scope="col">
                      <FaStar className={styles.compareTableThIcon} aria-hidden="true" />
                      AEO
                    </th>
                    <th scope="col">
                      <FaRobot className={styles.compareTableThIcon} aria-hidden="true" />
                      GEO
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonTableData.map((row, idx) => (
                    <tr key={idx}>
                      <td data-label="Factor">{row.factor}</td>
                      <td data-label="SEO">{row.seo}</td>
                      <td data-label="AEO">{row.aeo}</td>
                      <td data-label="GEO">{row.geo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className={styles.serpCaption} style={{ marginTop: '20px' }}>
              <FaCircleInfo className={styles.serpCaptionIcon} aria-hidden="true" />
              <span>
                10 Cent Agency builds all three into a single, unified strategy — so you&apos;re
                visible everywhere people search.
              </span>
            </p>
          </div>
        </section>

        {/* ===================== 6. SERVICE BREAKDOWN ===================== */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Core Service 05</span>
              <h2 className={styles.sectionTitle}>SEO, AEO &amp; GEO Services</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                A complete visibility system covering traditional search rankings, direct-answer
                optimization, and AI chatbot citation.
              </p>
            </div>
            <div className={styles.cardsGrid}>
              {serviceCardsData.map((service) => (
                <div key={service.id} className={styles.serviceCard}>
                  <span className={styles.badge}>{service.badge}</span>
                  <h3>{service.title}</h3>
                  <ul>
                    {service.checklist.map((item, idx) => (
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

        {/* ===================== 7. HOW WE WORK ===================== */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Our Process</span>
              <h2 className={styles.sectionTitle}>How We Work</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                From audit to AI-visibility — a transparent process built for long-term,
                compounding results.
              </p>
            </div>

            <SagHowWeWork />
          </div>
        </section>

        {/* ===================== 8. STRATEGIES DEEP-DIVE (Tabbed) ===================== */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>In-Depth Strategy</span>
              <h2 className={styles.sectionTitle}>Our SEO, AEO &amp; GEO Approach</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                A closer look at the exact techniques we use to grow your visibility everywhere
                search happens.
              </p>
            </div>

            <SagStrategyTabs />
          </div>
        </section>

        {/* ===================== 9. REAL AI CITATION EXAMPLE ===================== */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Proof, Not Promises</span>
              <h2 className={styles.sectionTitle}>Real AI Citation Example</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                This is exactly how GEO works in practice — showing how a well-optimized brand gets
                recommended by AI.
              </p>
            </div>

            <SagAICitation />
          </div>
        </section>

        {/* ===================== 10. TOOLS WE USE ===================== */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Tools &amp; Technology</span>
              <h2 className={styles.sectionTitle}>Tools We Use</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                Industry-standard tools for research, optimization, and monitoring across search and
                AI platforms.
              </p>
            </div>
            <div className={styles.techStackGrid}>
              {techStackData.map((category) => {
                const CategoryIcon = techCategoryIconMap[category.iconKey] || FaChartLine;
                return (
                  <div key={category.id} className={styles.techCategory}>
                    <div className={styles.techCategoryHeader}>
                      <div className={styles.techCategoryIcon}>
                        <CategoryIcon aria-hidden="true" />
                      </div>
                      <h4>{category.title}</h4>
                    </div>
                    <div className={styles.techItemList}>
                      {category.items.map((tool, idx) => {
                        const ToolIcon = techToolIconMap[tool.iconKey] || FaGoogle;
                        return (
                          <div key={idx} className={styles.techItem}>
                            <div className={styles.techItemIcon}>
                              <ToolIcon aria-hidden="true" />
                            </div>
                            <span>{tool.label}</span>
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

        {/* ===================== 11. WHY WORK WITH US ===================== */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Why 10 Cent Agency</span>
              <h2 className={styles.sectionTitle}>Why Work With Us</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                We future-proof your visibility — not just for today&apos;s Google, but for
                tomorrow&apos;s AI-driven search.
              </p>
            </div>
            <div className={styles.whyGrid}>
              {whyChooseUsData.map((card) => {
                const IconComponent = whyIconMap[card.iconKey] || FaLayerGroup;
                return (
                  <div key={card.id} className={styles.whyCard}>
                    <div className={styles.whyIcon}>
                      <IconComponent aria-hidden="true" />
                    </div>
                    <h4>{card.title}</h4>
                    <p>{card.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===================== 12. 10 CENT AGENCY vs TRADITIONAL SEO AGENCIES ===================== */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>The Real Difference</span>
              <h2 className={styles.sectionTitle}>10 Cent Agency vs Traditional SEO Agencies</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                Most agencies still sell SEO the way they did in 2015. Here&apos;s what actually
                changes when you work with us.
              </p>
            </div>
            <div className={styles.vsGrid}>
              {/* Traditional Column */}
              <div className={`${styles.vsCol} ${styles.vsColTraditional}`}>
                <span className={styles.vsBadge}>{vsAgenciesData.traditional.badge}</span>
                <div className={styles.vsColHead}>
                  <div className={styles.vsColIcon}>
                    <FaXmark aria-hidden="true" />
                  </div>
                  <h3>{vsAgenciesData.traditional.title}</h3>
                </div>
                {vsAgenciesData.traditional.points.map((point, idx) => (
                  <div key={idx} className={styles.vsRow}>
                    <FaXmark className={styles.vsRowIcon} aria-hidden="true" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              {/* 10 Cent Agency Column */}
              <div className={`${styles.vsCol} ${styles.vsColUs}`}>
                <span className={styles.vsBadge}>{vsAgenciesData.us.badge}</span>
                <div className={styles.vsColHead}>
                  <div className={styles.vsColIcon}>
                    <FaCheck aria-hidden="true" />
                  </div>
                  <h3>{vsAgenciesData.us.title}</h3>
                </div>
                {vsAgenciesData.us.points.map((point, idx) => (
                  <div key={idx} className={styles.vsRow}>
                    <FaCheck className={styles.vsRowIcon} aria-hidden="true" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 13. 5 COMMON MISTAKES ===================== */}
        <section className={styles.section}>
          <div className={styles.container} style={{ maxWidth: '950px' }}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Avoid These Pitfalls</span>
              <h2 className={styles.sectionTitle}>5 Common Mistakes Businesses Make</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                We&apos;ve audited dozens of Bangladeshi business websites. Here are the mistakes we
                see most often.
              </p>
            </div>
            <div className={styles.mistakesWrap}>
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

        {/* ===================== 14. IS YOUR WEBSITE AI-SEARCH READY? CHECKLIST ===================== */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Quick Self-Check</span>
              <h2 className={styles.sectionTitle}>Is Your Website AI-Search Ready?</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                Run through this quick checklist — if you&apos;re missing more than 2 of these, you&apos;re
                likely invisible to AI search tools.
              </p>
            </div>
            <div className={styles.auditWrap}>
              {aiSearchChecklistData.map((item) => (
                <div key={item.id} className={styles.auditItem}>
                  <div
                    className={`${styles.auditCheck} ${
                      item.isReady ? styles.auditCheckYes : styles.auditCheckNo
                    }`}
                  >
                    {item.isReady ? (
                      <FaCheck aria-hidden="true" />
                    ) : (
                      <FaXmark aria-hidden="true" />
                    )}
                  </div>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
            <div className={styles.auditCta}>
              <p>
                <strong>Not sure where your website stands?</strong> Get a free, no-obligation AI
                Visibility Audit from our team.
              </p>
              <Link href="/contact" className={`${styles.btn} ${styles.btnPrimary}`}>
                Get a Free AI Visibility Audit
              </Link>
            </div>
          </div>
        </section>

        {/* ===================== 15. RESULTS / STATS ===================== */}
        <section className={styles.section}>
          <div className={styles.container}>
            <SagStats />
          </div>
        </section>

        {/* ===================== 16. PRICING (NO PRICES) ===================== */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Packages</span>
              <h2 className={styles.sectionTitle}>Choose the Right Visibility Package</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                Every business has different goals — that&apos;s why we scope every project
                individually.
              </p>
            </div>
            <div className={styles.pricingGrid}>
              {pricingPackagesData.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`${styles.priceCard} ${
                    pkg.isPopular ? styles.priceCardPopular : ''
                  }`}
                >
                  <span className={pkg.isPopular ? styles.popularBadge : styles.badge}>
                    {pkg.badge}
                  </span>
                  <h3>{pkg.name}</h3>
                  <p className={styles.priceNote}>{pkg.note}</p>
                  <ul>
                    {pkg.features.map((feat, idx) => (
                      <li key={idx}>
                        <FaCircleCheck className={styles.priceCheckIcon} aria-hidden="true" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={pkg.ctaHref}
                    className={`${styles.btn} ${
                      pkg.isPopular ? styles.btnPrimary : styles.btnOutline
                    }`}
                    style={{ width: '100%' }}
                  >
                    {pkg.ctaText}
                  </Link>
                </div>
              ))}
            </div>

            {/* Pricing Disclaimer Note */}
            <div className={styles.pricingTrustBox}>
              <p>
                <FaCircleInfo className={styles.pricingTrustBoxIcon} aria-hidden="true" />
                <span>
                  Final pricing depends on your website&apos;s current state, competition, and
                  goals. <strong>Book a free consultation</strong> and we&apos;ll recommend the
                  right package.
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* ===================== 17. INDUSTRIES (Search Query Card Style) ===================== */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Industries We Serve</span>
              <h2 className={styles.sectionTitle}>Search Visibility Tailored to Your Industry</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                Every industry searches differently — here&apos;s how we tailor SEO, AEO &amp; GEO
                strategy to match real queries in your space.
              </p>
            </div>
            <div className={styles.industryQueryGrid}>
              {industriesData.map((ind) => {
                const IconComponent = industryIconMap[ind.iconKey] || FaBriefcase;
                return (
                  <div key={ind.id} className={styles.industryQueryCard}>
                    <div className={styles.iqSearchBar}>
                      <FaMagnifyingGlass className={styles.iqSearchIcon} aria-hidden="true" />
                      <span className={styles.iqQuery}>{ind.searchQuery}</span>
                      <FaMicrophone className={styles.iqMic} aria-hidden="true" />
                    </div>
                    <div className={styles.iqHeader}>
                      <div className={styles.iqIcon}>
                        <IconComponent aria-hidden="true" />
                      </div>
                      <h4>{ind.title}</h4>
                    </div>
                    <p>{ind.description}</p>
                    <span className={styles.iqAiTag}>
                      <FaWandMagicSparkles aria-hidden="true" /> {ind.tagText}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===================== 18. FAQ ===================== */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>FAQ</span>
              <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                Common questions about our SEO, AEO &amp; GEO services
              </p>
            </div>

            <SagFAQ />
          </div>
        </section>

        {/* ===================== 19. TESTIMONIALS ===================== */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Client Voices</span>
              <h2 className={styles.sectionTitle}>What Our Clients Say</h2>
            </div>
            <div className={styles.testiGrid}>
              {testimonialsData.map((testi) => {
                const avatarColorClass = styles[testi.avatarClass] || styles.avNavy;
                return (
                  <div key={testi.id} className={styles.testiCard}>
                    <div className={styles.testiTop}>
                      <div
                        className={styles.testiStars}
                        aria-label={`${testi.rating} out of 5 stars`}
                      >
                        {'★'.repeat(testi.rating)}
                        {testi.rating < 5 && (
                          <span className={styles.starEmpty}>{'★'.repeat(5 - testi.rating)}</span>
                        )}
                      </div>
                      <span className={styles.testiTag}>{testi.tag}</span>
                    </div>
                    <p className={styles.testiQuote}>{testi.quote}</p>
                    <div className={styles.testiUser}>
                      <div
                        className={`${styles.testiAvatar} ${avatarColorClass}`}
                        aria-hidden="true"
                      >
                        {testi.initials}
                      </div>
                      <div>
                        <h5>
                          {testi.author}{' '}
                          <FaCircleCheck
                            className={styles.testiVerified}
                            title="Verified client"
                            aria-label="Verified client"
                          />
                        </h5>
                        <span>
                          {testi.role}, {testi.company}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===================== 20. CLOSING SUMMARY ===================== */}
        <section className={styles.section}>
          <div className={`${styles.container} ${styles.closingBox}`}>
            <h2>The Bottom Line</h2>
            <p>
              Search is no longer just a list of blue links. It&apos;s Featured Snippets, AI
              Overviews, and chatbot conversations happening across ChatGPT, Gemini, and
              Perplexity.
            </p>
            <p>
              At <strong>10 Cent Agency</strong>, we combine SEO, AEO, and GEO into one
              accountable strategy — so your business stays visible today, tomorrow, and however
              search continues to evolve.
            </p>
          </div>
        </section>

        {/* ===================== 21. RELATED SERVICES ===================== */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Explore More</span>
              <h2 className={styles.sectionTitle}>Related Services</h2>
            </div>
            <RelatedServices currentSlug="seo-aeo-geo" />
          </div>
        </section>
      </div>

      {/* Shared Single CTABanner outside pageRoot */}
      <CTABanner />
    </>
  );
}
