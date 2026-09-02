import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import CTABanner from '@/components/home/CTABanner';
import styles from './SocialMediaManagement.module.css';

// Client Components
import SMMCalendarChips from './SMMCalendarChips.client';
import SMMOverviewMotion from './SMMOverviewMotion.client';
import SMMTimelineReveal from './SMMTimelineReveal.client';
import SMMReportStats from './SMMReportStats.client';
import SMMReportBars from './SMMReportBars.client';
import SMMStrategyTabs from './SMMStrategyTabs.client';
import SMMStats from './SMMStats.client';
import SMMFAQ from './SMMFAQ.client';

import RelatedServices from '@/components/services/RelatedServices.client';

// Data
import {
  serviceCardsData,
  whyChooseUsData,
  commonMistakesData,
  pricingPackagesData,
  industriesData,
  testimonialsData,
  getSocialMediaSchemaGraph,
} from './socialMediaData';

// Icons
import {
  FaArrowLeft,
  FaCalendarDays,
  FaCircleCheck,
  FaClock,
  FaTableCells,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
  FaGoogle,
  FaCircleInfo,
  FaFileLines,
  FaStar,
  FaLightbulb,
  FaLanguage,
  FaLayerGroup,
  FaRobot,
  FaDatabase,
  FaUserTie,
  FaBolt,
  FaUtensils,
  FaCartShopping,
  FaShirt,
  FaHouse,
  FaBriefcase,
  FaDumbbell,
  FaFacebook,
  FaGlobe,
  FaMagnifyingGlassChart,
  FaPalette,
} from 'react-icons/fa6';

const whyIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FaLanguage,
  FaLayerGroup,
  FaRobot,
  FaDatabase,
  FaUserTie,
  FaBolt,
};

const platformIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
  FaGoogle,
};

const industryIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FaUtensils,
  FaCartShopping,
  FaShirt,
  FaHouse,
  FaBriefcase,
  FaDumbbell,
};

export const metadata: Metadata = {
  title: 'Social Media Management in Bangladesh | 10 Cent Agency',
  description:
    'Social media management for Bangladeshi businesses — content calendar, post design, Reels & community management across Facebook, Instagram, LinkedIn & more.',
  alternates: {
    canonical: 'https://www.10centagency.com/services/social-media-management',
  },
  openGraph: {
    type: 'website',
    url: 'https://www.10centagency.com/services/social-media-management',
    siteName: '10 Cent Agency',
    title: 'Social Media Management in Bangladesh | 10 Cent Agency',
    description:
      'Social media management for Bangladeshi businesses — content calendar, post design, Reels & community management across Facebook, Instagram, LinkedIn & more.',
    images: [
      {
        url: 'https://www.10centagency.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Social Media Management Services in Bangladesh | 10 Cent Agency',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Social Media Management in Bangladesh | 10 Cent Agency',
    description:
      'Social media management for Bangladeshi businesses — content calendar, post design, Reels & community management across Facebook, Instagram, LinkedIn & more.',
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

export default function SocialMediaManagementPage() {
  const schemaGraph = getSocialMediaSchemaGraph();

  return (
    <>
      {/* Single Server-Rendered Connected Schema.org @graph */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaGraph).replace(/</g, '\\u003c'),
        }}
      />

      <div className={styles.pageRoot}>
        {/* ===================== 1. HERO ===================== */}
        <section className={styles.hero}>
          <div className={styles.container}>
            {/* Breadcrumb */}
            <div className={styles.breadcrumb} aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span className={styles.breadcrumbSep}>&gt;</span>
              <Link href="/services">Services</Link>
              <span className={styles.breadcrumbSep}>&gt;</span>
              <span className={styles.breadcrumbCurrent}>Social Media Management</span>
            </div>

            <h1>Social Media Management</h1>
            <p>
              Consistent, strategic social media presence — without taking your time. We handle
              content planning, design, posting, AI-powered comment management, and community
              engagement every month across Facebook, Instagram, LinkedIn, YouTube, and Google
              Business Profile.
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

        {/* ===================== 2. QUICK ANSWER — CONTENT CALENDAR MOCKUP ===================== */}
        <div className={styles.container}>
          <div className={styles.smAnswerWrap}>
            <div className={styles.smAnswerHeader}>
              <div className={styles.smAnswerIcon}>
                <FaCalendarDays aria-hidden="true" />
              </div>
              <div className={styles.smAnswerMeta}>
                <div className={styles.smAnswerTitle}>
                  10 Cent Agency <FaCircleCheck className={styles.smVerified} aria-label="Verified" />
                </div>
                <div className={styles.smAnswerSub}>
                  <FaClock aria-hidden="true" /> Live Content Calendar Preview
                </div>
              </div>
              <div className={styles.smLiveBadge}>
                <span className={styles.dot} /> Active
              </div>
            </div>
            <div className={styles.smAnswerBody}>
              <h2>What is Social Media Management? 📱</h2>
              <p>
                Social Media Management is the ongoing process of planning, designing, publishing,
                and analyzing content across platforms like Facebook, Instagram, LinkedIn, YouTube,
                and Google Business Profile — to build brand awareness, engagement, and community
                trust. 10 Cent Agency handles everything end-to-end: content calendar, design,
                scheduled posting, AI-powered comment &amp; inbox management, and monthly reporting,
                so you can focus on running your business.
              </p>
              <div className={styles.fbTags}>
                <span className={styles.fbTag}>#SocialMediaManagement</span>
                <span className={styles.fbTag}>#MultiPlatform</span>
                <span className={styles.fbTag}>#BangladeshBusiness</span>
              </div>
            </div>
            <div className={styles.smCalendar}>
              <div className={styles.smCalendarTitle}>
                <FaTableCells className={styles.smCalendarTitleIcon} aria-hidden="true" /> This
                Week&apos;s Content Calendar (Sample)
              </div>
              {/* Animated Calendar Day Chips */}
              <SMMCalendarChips />
            </div>
            <div className={styles.smCalendarFooter}>
              <div className={styles.smStat}>
                <strong>24</strong>Posts / Month
              </div>
              <div className={styles.smStat}>
                <strong>5</strong>Platforms Managed
              </div>
              <div className={styles.smStat}>
                <strong>100%</strong>On-Time Publishing
              </div>
            </div>
          </div>
          <p className={styles.fbCaption}>
            <FaCircleInfo className={styles.fbCaptionIcon} aria-hidden="true" />
            <span>
              This is a sample of the organized, multi-platform content calendar we build for every
              client.
            </span>
          </p>
        </div>

        {/* ===================== 3. OVERVIEW — DATA DASHBOARD ===================== */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={`${styles.center} ${styles.ovIntro}`}>
              <span className={styles.sectionTag}>The Bigger Picture</span>
              <h2 className={styles.sectionTitle} style={{ fontSize: '32px' }}>
                Understanding Social Media Management in Bangladesh
              </h2>
              <p>
                Why a consistent, multi-platform social presence has become non-negotiable for
                businesses competing online today.
              </p>
            </div>

            <SMMOverviewMotion />
          </div>
        </section>

        {/* ===================== 4. SERVICE BREAKDOWN ===================== */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Core Service 04</span>
              <h2 className={styles.sectionTitle}>Social Media Management Services</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                Complete monthly management of your social media presence across every major
                platform — content, design, community, and reporting.
              </p>
            </div>
            <div className={styles.cardsGrid}>
              {serviceCardsData.map((service) => (
                <div key={service.id} className={styles.serviceCard}>
                  <span className={styles.badge}>{service.badge}</span>
                  <h3>{service.title}</h3>
                  <ul>
                    {service.features.map((feature, idx) => (
                      <li key={idx}>
                        <FaCircleCheck className={styles.serviceCardCheckIcon} aria-hidden="true" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== 5. FIRST 30 DAYS TIMELINE ===================== */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Onboarding Journey</span>
              <h2 className={styles.sectionTitle}>Your First 30 Days With Us</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                What exactly happens after you sign up — a clear, transparent roadmap from day one to
                your first monthly report.
              </p>
            </div>

            <div className={styles.timeline30Wrap}>
              <div className={styles.timeline30Line} />
              {/* Progressively Revealed Milestones */}
              <SMMTimelineReveal />
            </div>
          </div>
        </section>

        {/* ===================== 6. SAMPLE MONTHLY PERFORMANCE REPORT ===================== */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Included Every Month</span>
              <h2 className={styles.sectionTitle}>Your Monthly Performance Report</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                This is exactly the kind of report you&apos;ll receive every month — not just
                numbers, a clear growth roadmap.
              </p>
            </div>

            <div className={styles.reportMockup}>
              <div className={styles.reportTopbar}>
                <span className={`${styles.topbarDot} ${styles.dotRed}`} />
                <span className={`${styles.topbarDot} ${styles.dotYellow}`} />
                <span className={`${styles.topbarDot} ${styles.dotGreen}`} />
                <span className={styles.reportTopbarTitle}>
                  <FaFileLines aria-hidden="true" /> 10 Cent Agency — Monthly Report.pdf
                </span>
              </div>

              <div className={styles.reportBody}>
                <div className={styles.reportHeader}>
                  <div>
                    <h3>Performance Report</h3>
                    <p>Client: Fashion House BD &nbsp;•&nbsp; Month: February 2026</p>
                  </div>
                </div>

                {/* 4 Animated Count-up Stat Tiles */}
                <SMMReportStats />

                <div className={styles.reportSplit}>
                  {/* Platform-wise Performance (Animated Client Bars) */}
                  <SMMReportBars />

                  {/* Top Performing Content Card */}
                  <div className={styles.reportTopPost}>
                    <div className={styles.rcTitle}>
                      <FaStar aria-hidden="true" /> Top Performing Content
                    </div>
                    <div className={styles.rtpCard}>
                      <div className={styles.rtpThumb}>
                        <FaInstagram aria-hidden="true" />
                      </div>
                      <div>
                        <strong>Reel: Behind the Scenes</strong>
                        <p>12.4K Reach • 890 Likes • 4.2% Engagement</p>
                      </div>
                    </div>
                    <div className={styles.rcTitle} style={{ marginTop: '20px' }}>
                      <FaLightbulb aria-hidden="true" /> Next Month Recommendation
                    </div>
                    <p className={styles.rtpReco}>
                      Reels are driving the highest engagement this month — we recommend increasing
                      Reels output by 30% next month to sustain growth.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 7. STRATEGIES DEEP-DIVE (Tabbed) ===================== */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>In-Depth Strategy</span>
              <h2 className={styles.sectionTitle}>Our Social Media Management Strategies</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                A closer look at how we manage each platform and turn consistent posting into real
                business growth.
              </p>
            </div>

            <SMMStrategyTabs />
          </div>
        </section>

        {/* ===================== 8. WHY WORK WITH US ===================== */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Why 10 Cent Agency</span>
              <h2 className={styles.sectionTitle}>Why Work With Us</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                We&apos;re not just posting content — we&apos;re building a consistent, multi-platform
                presence for your brand.
              </p>
            </div>
            <div className={styles.whyGrid}>
              {whyChooseUsData.map((card, idx) => {
                const IconComponent = whyIconMap[card.iconKey] || FaLanguage;
                return (
                  <div key={idx} className={styles.whyCard}>
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

        {/* ===================== 9. 5 COMMON MISTAKES ===================== */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container} style={{ maxWidth: '950px' }}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Avoid These Pitfalls</span>
              <h2 className={styles.sectionTitle}>
                5 Common Social Media Mistakes Businesses Make
              </h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                We&apos;ve audited dozens of business pages in Bangladesh. Here are the mistakes we
                see most often — and how we fix them.
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

        {/* ===================== 10. RESULTS / STATS & CONTENT MIX DONUT ===================== */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.statsSection}>
              <div className={styles.statsHeader}>
                <span className={styles.statsTag}>Real Results</span>
                <h2>Our Performance By The Numbers</h2>
                <p>Average results our clients see from ongoing social media management</p>
              </div>

              {/* 4 Animated Counters */}
              <SMMStats />

              {/* Static Conic Donut Chart */}
              <div className={styles.donutWrap}>
                <div className={styles.donut}>
                  <div className={styles.donutInner}>
                    <strong>40%</strong>
                    <span>To Reels &amp; Video</span>
                  </div>
                </div>
                <div className={styles.donutLegend}>
                  <h4>Average Content Mix Allocation</h4>
                  <p>
                    On average, 40% of monthly content is short-form video (Reels/Shorts), with the
                    rest distributed across static posts, carousels, LinkedIn articles, and GBP
                    updates — based on what drives the best engagement for each client.
                  </p>
                  <div className={styles.donutKey}>
                    <span>
                      <span
                        className={styles.donutKeyDot}
                        style={{ color: 'var(--smm-blue)' }}
                        aria-hidden="true"
                      >
                        ●
                      </span>{' '}
                      Reels/Video 40%
                    </span>
                    <span>
                      <span
                        className={styles.donutKeyDot}
                        style={{ color: '#ff0055' }}
                        aria-hidden="true"
                      >
                        ●
                      </span>{' '}
                      Static/Carousel 15%
                    </span>
                    <span>
                      <span
                        className={styles.donutKeyDot}
                        style={{ color: '#34a853' }}
                        aria-hidden="true"
                      >
                        ●
                      </span>{' '}
                      GBP 13%
                    </span>
                    <span>
                      <span
                        className={styles.donutKeyDot}
                        style={{ color: '#0a66c2' }}
                        aria-hidden="true"
                      >
                        ●
                      </span>{' '}
                      LinkedIn 12%
                    </span>
                    <span>
                      <span
                        className={styles.donutKeyDot}
                        style={{ color: 'rgba(255,255,255,0.53)' }}
                        aria-hidden="true"
                      >
                        ●
                      </span>{' '}
                      Other 20%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 11. PRICING (NO PRICES) ===================== */}
        <section className={styles.section} id="pricing">
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Packages</span>
              <h2 className={styles.sectionTitle}>Choose the Right Plan for Your Business</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                Every business needs a different platform mix and content volume — that&apos;s why we
                build custom packages. Here&apos;s what&apos;s typically included at each level.
              </p>
            </div>

            <div className={styles.pricingGrid}>
              {pricingPackagesData.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`${styles.priceCard} ${pkg.isPopular ? styles.priceCardPopular : ''}`}
                >
                  {pkg.isPopular ? (
                    <span className={styles.popularBadge}>{pkg.badge}</span>
                  ) : (
                    <span className={styles.priceBadgeLight}>{pkg.badge}</span>
                  )}
                  <h3>{pkg.name}</h3>

                  <div className={styles.platformIcons}>
                    {pkg.platforms.map((plat) => {
                      const PlatIcon = platformIconMap[plat.iconKey] || FaFacebookF;
                      const platClass = styles[plat.className] || '';
                      return (
                        <span key={plat.key} className={platClass}>
                          <PlatIcon aria-hidden="true" />
                        </span>
                      );
                    })}
                  </div>

                  <p className={styles.priceNote}>{pkg.note}</p>

                  <ul>
                    {pkg.features.map((feat, fIdx) => (
                      <li key={fIdx}>
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
                  Pricing depends on the number of platforms, content volume, and add-ons like ad
                  management or video production — that&apos;s why we don&apos;t use
                  one-size-fits-all pricing. <strong>Book a free consultation</strong> and we&apos;ll
                  recommend the right package with a transparent quote.
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* ===================== 12. INDUSTRIES ===================== */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Industries We Serve</span>
              <h2 className={styles.sectionTitle}>
                Social Media Management Tailored to Your Industry
              </h2>
            </div>
            <div className={styles.industryDescGrid}>
              {industriesData.map((ind, idx) => {
                const IconComponent = industryIconMap[ind.iconKey] || FaBriefcase;
                return (
                  <div key={idx} className={styles.industryDescCard}>
                    <h4>
                      <IconComponent className={styles.industryIcon} aria-hidden="true" />
                      <span>{ind.title}</span>
                    </h4>
                    <p>{ind.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===================== 13. FAQ ===================== */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Frequently Asked Questions</span>
              <h2 className={styles.sectionTitle}>
                Common Questions About Social Media Management
              </h2>
            </div>
            <SMMFAQ />
          </div>
        </section>

        {/* ===================== 14. TESTIMONIALS ===================== */}
        <section className={styles.section}>
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
                      <div className={`${styles.testiAvatar} ${avatarColorClass}`} aria-hidden="true">
                        {testi.initials}
                      </div>
                      <div>
                        <h5>
                          {testi.author}{' '}
                          <FaCircleCheck
                            className={styles.testiVerified}
                            title="Verified Client"
                            aria-label="Verified Client"
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

        {/* ===================== 15. CLOSING SUMMARY ===================== */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={`${styles.container} ${styles.closingBox}`}>
            <h2>The Bottom Line</h2>
            <p>
              Social media management isn&apos;t just about posting content and hoping for the best —
              it&apos;s a system built on strategy, consistent design, fast community response, and
              continuous reporting. Businesses that treat it as an ongoing operation, not an
              afterthought, build stronger, more trusted brands over time.
            </p>
            <p>
              At <strong>10 Cent Agency</strong>, we bring together strategy, design, AI-powered
              community management, and reporting into one accountable system — so your brand stays
              active and consistent across every platform that matters, every single month.
            </p>
          </div>
        </section>

        {/* ===================== 16. RELATED SERVICES ===================== */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Explore More</span>
              <h2 className={styles.sectionTitle}>Related Services</h2>
            </div>
            <RelatedServices currentSlug="social-media-management" />
          </div>
        </section>
      </div>

      {/* Shared Single CTABanner outside pageRoot */}
      <CTABanner />
    </>
  );
}
