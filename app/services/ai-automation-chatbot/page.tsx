import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import CTABanner from '@/components/home/CTABanner';
import styles from './AIAutomation.module.css';

// Client Components
import AIChatWidget from './AIChatWidget.client';
import AIOverviewMotion from './AIOverviewMotion.client';
import AIProcessTimeline from './AIProcessTimeline.client';
import AIStrategyTabs from './AIStrategyTabs.client';
import N8nWorkflow from './N8nWorkflow.client';
import AIStats from './AIStats.client';
import AIFAQ from './AIFAQ.client';

import RelatedServices from '@/components/services/RelatedServices.client';

// Data
import {
  serviceCardsData,
  techStackData,
  whyChooseUsData,
  benefitsData,
  commonMistakesData,
  pricingPackagesData,
  industriesData,
  testimonialsData,
  getAIAutomationSchemaGraph,
} from './aiAutomationData';

// Icons
import {
  FaArrowLeft,
  FaCircleCheck,
  FaChartSimple,
  FaClock,
  FaBolt,
  FaArrowTrendUp,
  FaGift,
  FaLanguage,
  FaUserTie,
  FaDiagramProject,
  FaEye,
  FaRobot,
  FaUser,
  FaGaugeHigh,
  FaShieldHalved,
  FaStar,
  FaCartShopping,
  FaUtensils,
  FaHouse,
  FaHeartPulse,
  FaGraduationCap,
  FaBriefcase,
  FaFacebook,
  FaGlobe,
  FaMagnifyingGlassChart,
  FaPalette,
  FaCircleInfo,
  FaWandMagicSparkles,
  FaGoogle,
  FaCommentDots,
  FaGears,
  FaArrowsTurnToDots,
  FaComments,
  FaFacebookMessenger,
  FaWhatsapp,
  FaTelegram,
  FaDatabase,
  FaGoogleDrive,
  FaTable,
  FaAddressBook,
  FaBrain,
} from 'react-icons/fa6';

const techIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FaBrain,
  FaDiagramProject,
  FaComments,
  FaDatabase,
  FaWandMagicSparkles,
  FaGoogle,
  FaCommentDots,
  FaGears,
  FaBolt,
  FaArrowsTurnToDots,
  FaFacebookMessenger,
  FaWhatsapp,
  FaTelegram,
  FaGoogleDrive,
  FaTable,
  FaAddressBook,
};

const whyIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FaGift,
  FaLanguage,
  FaUserTie,
  FaDiagramProject,
  FaEye,
  FaBolt,
};

const benefitIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FaClock,
  FaLanguage,
  FaArrowTrendUp,
  FaDiagramProject,
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
  title: 'AI Chatbot & Automation in Bangladesh | 10 Cent Agency',
  description:
    '24/7 AI chatbots for Messenger, WhatsApp & Telegram — automate lead capture, orders & customer support in Bangla & English. 3-day free trial, no commitment.',
  alternates: {
    canonical: 'https://www.10centagency.com/services/ai-automation-chatbot',
  },
  openGraph: {
    type: 'website',
    url: 'https://www.10centagency.com/services/ai-automation-chatbot',
    siteName: '10 Cent Agency',
    title: 'AI Chatbot & Automation in Bangladesh | 10 Cent Agency',
    description:
      '24/7 AI chatbots for Messenger, WhatsApp & Telegram — automate lead capture, orders & customer support in Bangla & English. 3-day free trial, no commitment.',
    images: [
      {
        url: 'https://www.10centagency.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Automation & Chatbot Services in Bangladesh | 10 Cent Agency',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Chatbot & Automation in Bangladesh | 10 Cent Agency',
    description:
      '24/7 AI chatbots for Messenger, WhatsApp & Telegram — automate lead capture, orders & customer support in Bangla & English. 3-day free trial, no commitment.',
    images: [
      {
        url: 'https://www.10centagency.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Automation & Chatbot Services in Bangladesh | 10 Cent Agency',
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

export default function AIAutomationChatbotPage() {
  const schemaGraph = getAIAutomationSchemaGraph();

  return (
    <>
      {/* Single Server-Rendered Connected Schema.org @graph */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaGraph).replace(/</g, '\\u003c'),
        }}
      />

      <div className={styles.pageRoot} data-ai-page-root>
        {/* Page-Scoped Motion Controller for Progress Bars */}
        <AIOverviewMotion />

        {/* ===================== 1. HERO ===================== */}
        <section className={styles.hero}>
          <div className={styles.container}>
            {/* Breadcrumb */}
            <div className={styles.breadcrumb} aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span className={styles.breadcrumbSep}>&gt;</span>
              <Link href="/services">Services</Link>
              <span className={styles.breadcrumbSep}>&gt;</span>
              <span className={styles.breadcrumbCurrent}>AI Automation &amp; Chatbot</span>
            </div>

            <h1>
              AI Automation &amp; Chatbot{' '}
              <span className={styles.heroHighlight}>(3 Days Free Trial)</span>
            </h1>
            <p>
              Smart assistants that work 24/7 — answering questions, collecting leads, processing
              orders, and following up automatically. Powered by cutting-edge AI and n8n automation.
            </p>
            <div className={styles.heroActions}>
              <Link href="/contact" className={`${styles.btn} ${styles.btnPrimary}`}>
                Start Free Trial
              </Link>
              <Link href="/services" className={`${styles.btn} ${styles.btnOutline}`}>
                <FaArrowLeft aria-hidden="true" /> Back to Services
              </Link>
            </div>
          </div>
        </section>

        {/* ===================== 2. QUICK ANSWER — AI Chat Widget ===================== */}
        <AIChatWidget />

        {/* ===================== 3. OVERVIEW — Data Dashboard Style ===================== */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={`${styles.center} ${styles.ovIntro}`}>
              <span className={styles.sectionTag}>The Bigger Picture</span>
              <h2 className={styles.sectionTitle} style={{ fontSize: '32px' }}>
                Why Businesses Are Switching to AI Automation
              </h2>
              <p>
                Real numbers behind why instant response and automated workflows directly impact
                your revenue and customer retention.
              </p>
            </div>

            <div className={styles.ovDashboard}>
              {/* Wide Bar Card */}
              <div className={`${styles.ovCard} ${styles.ovCardWide}`} data-progress-animation>
                <div className={styles.ovCardTitle}>
                  <FaChartSimple className={styles.ovCardTitleIcon} aria-hidden="true" />
                  Average First Response Time by Channel
                </div>
                <div className={styles.ovBarRow}>
                  <div className={styles.ovBarTop}>
                    <span>Email Support</span>
                    <strong>~12 Hours</strong>
                  </div>
                  <div className={styles.ovBarTrack}>
                    <div className={styles.ovBarFill} style={{ width: '20%' }} />
                  </div>
                </div>
                <div className={styles.ovBarRow}>
                  <div className={styles.ovBarTop}>
                    <span>Facebook Page (Manual Reply)</span>
                    <strong>2-5 Hours</strong>
                  </div>
                  <div className={styles.ovBarTrack}>
                    <div className={styles.ovBarFill} style={{ width: '45%' }} />
                  </div>
                </div>
                <div className={styles.ovBarRow}>
                  <div className={styles.ovBarTop}>
                    <span>AI Chatbot</span>
                    <strong>&lt;10 Seconds</strong>
                  </div>
                  <div className={styles.ovBarTrack}>
                    <div className={styles.ovBarFill} style={{ width: '98%' }} />
                  </div>
                </div>
                <div className={styles.ovSource}>
                  Source: Industry customer service response benchmark data
                </div>
              </div>

              {/* 24/7 Stat Card */}
              <div className={styles.ovCard}>
                <div className={styles.ovBigStat}>
                  <div className={styles.ovBigIcon}>
                    <FaClock aria-hidden="true" />
                  </div>
                  <div className={styles.ovBigNum}>24/7</div>
                  <div className={styles.ovBigLabel}>
                    Always-on customer support, even while you sleep
                  </div>
                </div>
              </div>

              {/* 78% Stat Card */}
              <div className={styles.ovCard}>
                <div className={styles.ovBigStat}>
                  <div className={styles.ovBigIcon}>
                    <FaBolt aria-hidden="true" />
                  </div>
                  <div className={styles.ovBigNum}>78%</div>
                  <div className={styles.ovBigLabel}>
                    Customers who buy from whichever business responds first
                  </div>
                </div>
              </div>

              {/* Wide Comparison Card */}
              <div className={`${styles.ovCard} ${styles.ovCardWide}`} data-progress-animation>
                <div className={styles.ovCardTitle}>
                  <FaArrowTrendUp className={styles.ovCardTitleIcon} aria-hidden="true" />
                  Lead Response Impact
                </div>
                <div className={styles.ovCompareRow}>
                  <div className={styles.ovCompareLabel}>
                    <span>Without Automation (Delayed Replies)</span>
                    <span>Baseline</span>
                  </div>
                  <div className={styles.ovCompareTrack}>
                    <div
                      className={`${styles.ovCompareFill} ${styles.ovCompareFillWithout}`}
                      style={{ width: '42%' }}
                    >
                      <span>Missed Leads</span>
                    </div>
                  </div>
                </div>
                <div className={styles.ovCompareRow}>
                  <div className={styles.ovCompareLabel}>
                    <span>With 10 Cent Agency AI Setup</span>
                    <span>+65% More Leads Captured</span>
                  </div>
                  <div className={styles.ovCompareTrack}>
                    <div
                      className={`${styles.ovCompareFill} ${styles.ovCompareFillWith}`}
                      style={{ width: '90%' }}
                    >
                      <span>Instant &amp; Consistent</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 4. SERVICE BREAKDOWN ===================== */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Core Service 03</span>
              <h2 className={styles.sectionTitle}>AI Automation &amp; Chatbot Services</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                Automate your customer interactions and business workflows with intelligent AI
                solutions, built and trained specifically for your business.
              </p>
            </div>
            <div className={styles.cardsGrid}>
              {serviceCardsData.map((service) => (
                <div key={service.id} className={styles.serviceCard}>
                  <span className={styles.badge}>{service.badge}</span>
                  <h3>{service.name}</h3>
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

        {/* ===================== 5. HOW WE WORK ===================== */}
        <section className={styles.section} id="how-it-works">
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Our Process</span>
              <h2 className={styles.sectionTitle}>How We Work</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                From discovery call to a live, trained chatbot — a simple, transparent process with
                a risk-free trial period.
              </p>
            </div>
            <AIProcessTimeline />
          </div>
        </section>

        {/* ===================== 6. STRATEGIES DEEP-DIVE (Tabbed) ===================== */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>In-Depth Strategy</span>
              <h2 className={styles.sectionTitle}>Our AI Automation Approach</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                A closer look at the exact techniques we use to build chatbots and automation that
                actually work.
              </p>
            </div>
            <AIStrategyTabs />
          </div>
        </section>

        {/* ===================== 7. TECH STACK ===================== */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Tools &amp; Technology</span>
              <h2 className={styles.sectionTitle}>Technology We Build With</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                We combine leading AI models with proven automation platforms to build reliable,
                scalable chatbot systems.
              </p>
            </div>

            <div className={styles.techStackGrid}>
              {techStackData.map((category, idx) => {
                const HeaderIcon = techIconMap[category.iconKey] || FaBrain;
                return (
                  <div key={idx} className={styles.techCategory}>
                    <div className={styles.techCategoryHeader}>
                      <div className={styles.techCategoryIcon}>
                        <HeaderIcon aria-hidden="true" />
                      </div>
                      <h4>{category.title}</h4>
                    </div>
                    <div className={styles.techItemList}>
                      {category.items.map((item, itemIdx) => {
                        const ItemIcon = techIconMap[item.iconKey] || FaWandMagicSparkles;
                        return (
                          <div key={itemIdx} className={styles.techItem}>
                            <div className={styles.techItemIcon}>
                              <ItemIcon aria-hidden="true" />
                            </div>
                            <span>{item.name}</span>
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

        {/* ===================== 8. N8N REALISTIC WORKFLOW DEMO ===================== */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>See It In Action</span>
              <h2 className={styles.sectionTitle}>A Real n8n Automation Workflow — Explained</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                This is a real example of a Messenger sales chatbot workflow — AI reads the message,
                extracts lead info, validates it, saves it to Sheets, and automatically follows up.
                Nothing is manual.
              </p>
            </div>

            <N8nWorkflow />
          </div>
        </section>

        {/* ===================== 9. WHY CHOOSE US ===================== */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Why 10 Cent Agency</span>
              <h2 className={styles.sectionTitle}>Why Work With Us</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                We&apos;re not just installing a chatbot — we&apos;re building a working extension of
                your team.
              </p>
            </div>
            <div className={styles.whyGrid}>
              {whyChooseUsData.map((card, idx) => {
                const IconComponent = whyIconMap[card.iconKey] || FaGift;
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

        {/* ===================== 10. AI CONSOLE VISUAL + BENEFITS + CTA ===================== */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.robotCtaGrid}>
              {/* Left: AI Console Visual */}
              <div className={styles.robotVisualCol}>
                <div className={styles.aiConsoleOuter}>
                  <div className={styles.aiConsoleWrap}>
                    <div className={styles.aiConsoleGlow} />

                    {/* Connector lines */}
                    <div className={`${styles.aiConnect} ${styles.aiConnect1}`}>
                      <span className={styles.aiConnectDot} />
                    </div>
                    <div className={`${styles.aiConnect} ${styles.aiConnect2}`}>
                      <span className={styles.aiConnectDot} />
                    </div>

                    {/* Floating badges */}
                    <div className={`${styles.aiBadge} ${styles.aiBadge1}`}>
                      <span className={styles.aiBadgeDot} />
                      <span className={styles.aiBadgeLabel}>Online 24/7</span>
                    </div>
                    <div className={`${styles.aiBadge} ${styles.aiBadge2}`}>
                      <FaBolt className={styles.aiBadgeIcon} aria-hidden="true" />
                      <span className={styles.aiBadgeLabel}>Low API Cost</span>
                    </div>

                    {/* Main Panel */}
                    <div className={styles.aiPanel}>
                      <div className={styles.aiPanelTop}>
                        <div className={styles.aiPanelAvatar}>
                          <FaRobot aria-hidden="true" />
                          <span className={styles.aiDot} />
                        </div>
                        <div>
                          <h5>10 Cent AI Assistant</h5>
                          <span>
                            <span style={{ fontSize: '5px', color: '#4ade80', marginRight: '3px' }}>●</span>
                            Automation Active
                          </span>
                        </div>
                      </div>

                      <div className={styles.aiPanelBody}>
                        <div className={styles.aiMsgRow}>
                          <div className={styles.aiMsgAvatar}>
                            <FaRobot aria-hidden="true" />
                          </div>
                          <div className={styles.aiMsgBubble}>
                            <div className={styles.aiSkel} style={{ width: '88%' }} />
                            <div className={styles.aiSkel} style={{ width: '65%' }} />
                          </div>
                        </div>
                        <div className={`${styles.aiMsgRow} ${styles.aiMsgRowUser}`}>
                          <div className={styles.aiMsgAvatar}>
                            <FaUser aria-hidden="true" />
                          </div>
                          <div className={styles.aiMsgBubble} style={{ maxWidth: '70%' }}>
                            <div className={styles.aiSkel} style={{ width: '60px' }} />
                          </div>
                        </div>
                        <div className={styles.aiTypingRow}>
                          <div className={styles.aiMsgAvatar}>
                            <FaRobot aria-hidden="true" />
                          </div>
                          <div className={styles.aiTypingBubble} aria-hidden="true">
                            <span />
                            <span />
                            <span />
                          </div>
                        </div>
                      </div>

                      <div className={styles.aiPanelFooter}>
                        <div className={styles.aiStat}>
                          <FaClock className={styles.aiStatIcon} aria-hidden="true" />
                          <strong>24/7</strong>
                          <span>Uptime</span>
                        </div>
                        <div className={styles.aiStat}>
                          <FaLanguage className={styles.aiStatIcon} aria-hidden="true" />
                          <strong>BN/EN</strong>
                          <span>Language</span>
                        </div>
                        <div className={styles.aiStat}>
                          <FaGaugeHigh className={styles.aiStatIcon} aria-hidden="true" />
                          <strong>&lt;10s</strong>
                          <span>Reply</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.aiConsoleShadow} />
                </div>
              </div>

              {/* Right: Benefits List & CTA */}
              <div className={styles.robotBenefitsCol}>
                <span className={styles.sectionTag}>Why It Matters</span>
                <h2 className={styles.sectionTitle} style={{ fontSize: '32px' }}>
                  Let Your AI Assistant Handle the Busywork
                </h2>
                <p style={{ marginBottom: '26px', fontSize: '15px' }}>
                  While you focus on growing your business, your AI chatbot takes care of the
                  repetitive stuff — instantly, accurately, and around the clock.
                </p>

                <div className={styles.robotBenefitList}>
                  {benefitsData.map((item, idx) => {
                    const IconComponent = benefitIconMap[item.iconKey] || FaClock;
                    return (
                      <div key={idx} className={styles.robotBenefitItem}>
                        <div className={styles.robotBenefitIcon}>
                          <IconComponent aria-hidden="true" />
                        </div>
                        <div>
                          <h5>{item.title}</h5>
                          <p>{item.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className={styles.robotCtaBox}>
                  <Link
                    href="/contact"
                    className={`${styles.btn} ${styles.btnPrimary} ${styles.robotCtaBtn}`}
                  >
                    <FaGift aria-hidden="true" /> Activate My 3-Day Free Trial
                  </Link>
                  <p className={styles.robotCtaNote}>
                    <FaShieldHalved className={styles.robotCtaNoteIcon} aria-hidden="true" />
                    No credit card required · No commitment until you&apos;re satisfied
                  </p>
                  <p className={styles.robotSocialProof}>
                    <FaStar className={styles.robotStarIcon} aria-hidden="true" />
                    20+ businesses in Bangladesh already automated with us
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 11. COMMON MISTAKES ===================== */}
        <section className={styles.section}>
          <div className={styles.container} style={{ maxWidth: '950px' }}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Avoid These Pitfalls</span>
              <h2 className={styles.sectionTitle}>5 Common Mistakes Businesses Make about Chatbot</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                We&apos;ve reviewed dozens of chatbot setups in Bangladesh. Here are the mistakes we
                see most often — and how we fix them.
              </p>
            </div>
            <div style={{ display: 'grid', gap: '26px' }}>
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

        {/* ===================== 12. RESULTS / STATS (Infographic) ===================== */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container}>
            <AIStats />
          </div>
        </section>

        {/* ===================== 13. PRICING ===================== */}
        <section className={styles.section} id="pricing">
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Packages</span>
              <h2 className={styles.sectionTitle}>Choose the Right Automation Plan</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                Every business has different automation needs — that&apos;s why we scope every chatbot
                project individually. Here&apos;s what&apos;s typically included at each level.
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
                  <p className={styles.priceNote}>{pkg.note}</p>
                  <ul>
                    {pkg.features.map((feat, fIdx) => (
                      <li key={fIdx}>
                        <FaCircleCheck className={styles.priceCardCheckIcon} aria-hidden="true" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={pkg.ctaHref}
                    className={`${styles.btn} ${pkg.isPopular ? styles.btnPrimary : styles.btnOutline
                      }`}
                    style={{ width: '100%' }}
                  >
                    {pkg.ctaText}
                  </Link>
                </div>
              ))}
            </div>

            {/* Trust Box */}
            <div className={styles.pricingTrustBox}>
              <p>
                <FaCircleInfo className={styles.pricingTrustBoxIcon} aria-hidden="true" />
                Pricing depends on the number of platforms, complexity of automation, and
                conversation volume — that&apos;s why we don&apos;t use one-size-fits-all pricing.{' '}
                <strong>Start your 3-day free trial</strong> and we&apos;ll recommend the right
                package with a transparent quote.
              </p>
            </div>
          </div>
        </section>

        {/* ===================== 14. INDUSTRIES ===================== */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Industries We Serve</span>
              <h2 className={styles.sectionTitle}>AI Automation Tailored to Your Industry</h2>
            </div>
            <div className={styles.industryDescGrid}>
              {industriesData.map((ind, idx) => {
                const IconComponent = industryIconMap[ind.iconKey] || FaBriefcase;
                return (
                  <div key={idx} className={styles.industryDescCard}>
                    <h4>
                      <IconComponent className={styles.industryIcon} aria-hidden="true" />
                      {ind.title}
                    </h4>
                    <p>{ind.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===================== 15. FAQ ===================== */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>FAQ</span>
              <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                Honest, detailed answers to the questions we hear most often about our AI Automation
                &amp; Chatbot services
              </p>
            </div>
            <AIFAQ />
          </div>
        </section>

        {/* ===================== 16. TESTIMONIALS ===================== */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Client Voices</span>
              <h2 className={styles.sectionTitle}>What Our Clients Say</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                Real feedback from business owners across Bangladesh
              </p>
            </div>
            <div className={styles.testiGrid}>
              {testimonialsData.map((testi) => (
                <div key={testi.id} className={styles.testiCard}>
                  <div className={styles.testiTop}>
                    <div className={styles.testiStars} aria-label={`${testi.rating} out of 5 stars`}>
                      {'★'.repeat(testi.rating)}
                    </div>
                    <span className={styles.testiTag}>{testi.tag}</span>
                  </div>
                  <p className={styles.testiQuote}>{testi.quote}</p>
                  <div className={styles.testiUser}>
                    <div
                      className={styles.testiAvatar}
                      style={{ background: testi.avatarGradient }}
                      aria-hidden="true"
                    >
                      {testi.initials}
                    </div>
                    <div>
                      <h5>
                        {testi.author}
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
              ))}
            </div>
          </div>
        </section>

        {/* ===================== 17. CLOSING SUMMARY ===================== */}
        <section className={styles.section}>
          <div className={`${styles.container} ${styles.closingBox}`}>
            <h2>The Bottom Line</h2>
            <p>
              Customers today expect an instant response — and businesses that make them wait hours
              (or days) are quietly losing sales to competitors who reply first. AI Automation &amp;
              Chatbots close that gap, turning every conversation into a consistent, 24/7 opportunity
              instead of a missed one.
            </p>
            <p>
              At <strong>10 Cent Agency</strong>, we combine trained AI conversation design with
              real business automation — so your chatbot doesn&apos;t just chat, it actually works for
              your business around the clock.
            </p>
          </div>
        </section>

        {/* ===================== 18. RELATED SERVICES ===================== */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Explore More</span>
              <h2 className={styles.sectionTitle}>Related Services</h2>
            </div>
            <RelatedServices currentSlug="ai-automation-chatbot" />
          </div>
        </section>
      </div>

      {/* Shared Single CTABanner */}
      <CTABanner />
    </>
  );
}
