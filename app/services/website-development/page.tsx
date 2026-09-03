import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { JetBrains_Mono } from 'next/font/google';
import CTABanner from '@/components/home/CTABanner';
import styles from './WebsiteDevelopment.module.css';

// Client Components
import DevelopmentPipeline from './DevelopmentPipeline.client';
import WebsiteStrategyTabs from './WebsiteStrategyTabs.client';
import TechnologyDecisionGuide from './TechnologyDecisionGuide.client';
import WebsiteNeedsQuiz from './WebsiteNeedsQuiz.client';
import WebsiteFAQ from './WebsiteFAQ.client';
import WebsiteStats from './WebsiteStats.client';
import WebsiteOverviewMotion from './WebsiteOverviewMotion.client';
import RelatedServices from '@/components/services/RelatedServices.client';

// Data
import {
  serviceCardsData,
  techStackData,
  whyChooseUsData,
  commonMistakesData,
  pricingPackagesData,
  industriesData,
  domainHostingWebsiteData,
  testimonialsData,
  getWebsiteDevelopmentSchemaGraph,
  TechCategory,
  TechCategoryItem,
  WhyChooseCard,
  CommonMistake,
  PricingPackage,
  IndustryCard,
  DHWCard,
  TestimonialCard,
} from './websiteDevelopmentData';

// Icons
import {
  FaArrowLeft,
  FaCode,
  FaFileCode,
  FaCircleInfo,
  FaChartSimple,
  FaGlobe,
  FaGaugeHigh,
  FaArrowTrendUp,
  FaCircleCheck,
  FaLayerGroup,
  FaLaptopCode,
  FaServer,
  FaChartLine,
  FaWordpress,
  FaObjectUngroup,
  FaCartShopping,
  FaReact,
  FaDatabase,
  FaTerminal,
  FaCloudArrowUp,
  FaCloudBolt,
  FaShieldHalved,
  FaCreditCard,
  FaMobileScreen,
  FaGoogle,
  FaMagnifyingGlass,
  FaMobileScreenButton,
  FaMagnifyingGlassChart,
  FaHeadset,
  FaTag,
  FaUtensils,
  FaHouse,
  FaHeartPulse,
  FaGraduationCap,
  FaBriefcase,
  FaSignature,
  FaDisplay,
  FaFacebook,
  FaRobot,
  FaPalette,
} from 'react-icons/fa6';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Website Development Services in BD | 10 Cent Agency',
  description:
    'Fast, mobile-first websites & e-commerce stores — WordPress, Next.js, bKash/Nagad payment, SEO setup & 1 month free support. Get a free quote today.',
  alternates: {
    canonical: 'https://www.10centagency.com/services/website-development',
  },
  openGraph: {
    type: 'website',
    url: 'https://www.10centagency.com/services/website-development',
    siteName: '10 Cent Agency',
    title: 'Website Development Services in BD | 10 Cent Agency',
    description:
      'Fast, mobile-first websites & e-commerce stores — WordPress, Next.js, bKash/Nagad payment, SEO setup & 1 month free support. Get a free quote today.',
    images: [
      {
        url: 'https://www.10centagency.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Website Development Services — 10 Cent Agency',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Website Development Services in BD | 10 Cent Agency',
    description:
      'Fast, mobile-first websites & e-commerce stores — WordPress, Next.js, bKash/Nagad payment, SEO setup & 1 month free support. Get a free quote today.',
    images: [
      {
        url: 'https://www.10centagency.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Website Development Services — 10 Cent Agency',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'layer-group': FaLayerGroup,
  'laptop-code': FaLaptopCode,
  server: FaServer,
  'chart-line': FaChartLine,
  wordpress: FaWordpress,
  elementor: FaObjectUngroup,
  woocommerce: FaCartShopping,
  react: FaReact,
  nextjs: FaCode,
  supabase: FaDatabase,
  vscode: FaTerminal,
  vercel: FaCloudArrowUp,
  cloudflare: FaCloudBolt,
  shield: FaShieldHalved,
  'credit-card': FaCreditCard,
  mobile: FaMobileScreen,
  google: FaGoogle,
  search: FaMagnifyingGlass,
  code: FaCode,
  gauge: FaGaugeHigh,
  'seo-chart': FaMagnifyingGlassChart,
  headset: FaHeadset,
  tag: FaTag,
  utensils: FaUtensils,
  cart: FaCartShopping,
  house: FaHouse,
  heart: FaHeartPulse,
  graduation: FaGraduationCap,
  briefcase: FaBriefcase,
  signature: FaSignature,
  display: FaDisplay,
  facebook: FaFacebook,
  robot: FaRobot,
  palette: FaPalette,
};

export default function WebsiteDevelopmentPage() {
  const schemaGraph = getWebsiteDevelopmentSchemaGraph();
  const jsonLdString = JSON.stringify(schemaGraph).replace(/</g, '\\u003c');

  return (
    <>
      {/* Single Connected Server-Rendered JSON-LD Schema @graph */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString,
        }}
      />

      {/* Page-scoped overview progress bar animation */}
      <WebsiteOverviewMotion />

      <div
        className={`${styles.pageRoot} ${jetbrainsMono.variable}`}
        data-wd-page-root="true"
      >
        {/* ===================== 1. HERO ===================== */}
        <section className={styles.hero}>
          <div className={styles.container}>
            <div className={styles.breadcrumb}>
              <Link href="/">Home</Link>
              <span>&gt;</span>
              <Link href="/services">Services</Link>
              <span>&gt;</span>
              <span className={styles.breadcrumbCurrent}>Website Development</span>
            </div>
            <h1 className={styles.heroTitle}>Website Development</h1>
            <p className={styles.heroDesc}>
              Your website is your most powerful 24/7 salesperson. We design and develop
              fast, beautiful, mobile-optimized websites that convert visitors into paying
              customers — using WordPress &amp; Elementor, or custom-coded Next.js/React
              solutions, depending on what your business needs.
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

        {/* ===================== 2. QUICK ANSWER — Code Editor Style ===================== */}
        <div className={styles.container}>
          <div className={styles.codeAnswerWrap}>
            <div className={styles.codeTitlebar}>
              <div className={styles.codeDots}>
                <span className={styles.dotRed} />
                <span className={styles.dotYellow} />
                <span className={styles.dotGreen} />
              </div>
              <div className={styles.codeTabs}>
                <div className={`${styles.codeTab} ${styles.codeTabActive}`}>
                  <FaCode aria-hidden="true" />
                  <span>answer.json</span>
                </div>
                <div className={`${styles.codeTab} ${styles.codeTabInactive}`}>
                  <FaFileCode aria-hidden="true" />
                  <span>faq.js</span>
                </div>
              </div>
              <div className={styles.codeBadgeLive} aria-label="Schema Active">
                <span className={styles.codeBadgeText}>Schema Active</span>
              </div>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLinenums} aria-hidden="true">
                1<br />2<br />3<br />4<br />5<br />6<br />7<br />8<br />9<br />10<br />11<br />12<br />13<br />14
              </div>
              <pre className={styles.codeContent}>
                <code>
                  <span className={styles.tokComment}>// Quick Answer Engine</span>{'\n'}
                  <span className={styles.tokPunct}>{'{'}</span>{'\n'}
                  {'  '}<span className={styles.tokKey}>&quot;question&quot;</span><span className={styles.tokPunct}>:</span> <span className={styles.tokString}>&quot;What is Website Development?&quot;</span><span className={styles.tokPunct}>,</span>{'\n'}
                  {'  '}<span className={styles.tokKey}>&quot;answer&quot;</span><span className={styles.tokPunct}>:</span> <span className={styles.tokString}>&quot;Website Development is the process of designing,{'\n'}  building, and launching a functional online presence —{'\n'}  optimized for speed, mobile devices, and search engines.{'\n'}  10 Cent Agency builds custom WordPress + Elementor websites{'\n'}  and custom Next.js/React web apps for businesses in Bangladesh.&quot;</span><span className={styles.tokPunct}>,</span>{'\n'}
                  {'  '}<span className={styles.tokKey}>&quot;includes&quot;</span><span className={styles.tokPunct}>:</span> <span className={styles.tokPunct}>[</span><span className={styles.tokString}>&quot;Fast Loading&quot;</span><span className={styles.tokPunct}>,</span> <span className={styles.tokString}>&quot;Mobile-Optimized&quot;</span><span className={styles.tokPunct}>,</span> <span className={styles.tokString}>&quot;SEO Ready&quot;</span><span className={styles.tokPunct}>,</span> <span className={styles.tokString}>&quot;1-Month Support&quot;</span><span className={styles.tokPunct}>]</span>{'\n'}
                  <span className={styles.tokPunct}>{'}'}</span>
                  <span className={styles.cursorBlink} aria-hidden="true" />
                </code>
              </pre>
            </div>
          </div>
          <p className={styles.codeCaption}>
            <FaCircleInfo className={styles.codeCaptionIcon} aria-hidden="true" />
            This is the exact structured format Google &amp; AI search engines use to
            generate instant answers.
          </p>
        </div>

        {/* ===================== 3. OVERVIEW — Data Dashboard ===================== */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={`${styles.center} ${styles.ovIntro}`}>
              <span className={styles.sectionTag}>The Bigger Picture</span>
              <h2 className={styles.sectionTitle} style={{ fontSize: '32px' }}>
                Why Website Development Actually Matters
              </h2>
              <p>
                Real numbers behind why speed, mobile-readiness, and SEO structure
                directly impact your business growth.
              </p>
            </div>

            <div className={styles.ovDashboard}>
              {/* Card 1: Bounce Rate by Page Load Time */}
              <div className={`${styles.ovCard} ${styles.ovCardWide}`} data-progress-animation="true">
                <div className={styles.ovCardTitle}>
                  <FaChartSimple className={styles.ovCardTitleIcon} aria-hidden="true" />
                  Bounce Rate by Page Load Time
                </div>
                <div className={styles.ovBarRow}>
                  <div className={styles.ovBarTop}>
                    <span>1 Second Load Time</span>
                    <strong>7% Bounce</strong>
                  </div>
                  <div className={styles.ovBarTrack}>
                    <div
                      className={`${styles.ovBarFill} ${styles.barFill8}`}
                      style={{ '--wd-bar-delay': '0ms' } as React.CSSProperties}
                    />
                  </div>
                </div>
                <div className={styles.ovBarRow}>
                  <div className={styles.ovBarTop}>
                    <span>3 Second Load Time</span>
                    <strong>32% Bounce</strong>
                  </div>
                  <div className={styles.ovBarTrack}>
                    <div
                      className={`${styles.ovBarFill} ${styles.barFill35}`}
                      style={{ '--wd-bar-delay': '120ms' } as React.CSSProperties}
                    />
                  </div>
                </div>
                <div className={styles.ovBarRow}>
                  <div className={styles.ovBarTop}>
                    <span>5 Second Load Time</span>
                    <strong>90% Bounce</strong>
                  </div>
                  <div className={styles.ovBarTrack}>
                    <div
                      className={`${styles.ovBarFill} ${styles.barFill92}`}
                      style={{ '--wd-bar-delay': '240ms' } as React.CSSProperties}
                    />
                  </div>
                </div>
                <div className={styles.ovSource}>
                  Source: Google / Think with Google research
                </div>
              </div>

              {/* Card 2: Internet Users */}
              <div className={styles.ovCard}>
                <div className={styles.ovBigStat}>
                  <div className={styles.ovBigIcon}>
                    <FaGlobe aria-hidden="true" />
                  </div>
                  <div className={styles.ovBigNum}>130M+</div>
                  <div className={styles.ovBigLabel}>
                    Internet users in Bangladesh — your potential audience online
                  </div>
                </div>
              </div>

              {/* Card 3: Target Load Time */}
              <div className={styles.ovCard}>
                <div className={styles.ovBigStat}>
                  <div className={styles.ovBigIcon}>
                    <FaGaugeHigh aria-hidden="true" />
                  </div>
                  <div className={styles.ovBigNum}>&lt;3s</div>
                  <div className={styles.ovBigLabel}>
                    Our target load time for every website we build
                  </div>
                </div>
              </div>

              {/* Card 4: Lead Generation Impact */}
              <div className={`${styles.ovCard} ${styles.ovCardWide}`} data-progress-animation="true">
                <div className={styles.ovCardTitle}>
                  <FaArrowTrendUp className={styles.ovCardTitleIcon} aria-hidden="true" />
                  Lead Generation Impact
                </div>
                <div className={styles.ovCompareRow}>
                  <div className={styles.ovCompareLabel}>
                    <span>Without a Professional Website</span>
                    <span>Baseline</span>
                  </div>
                  <div className={styles.ovCompareTrack}>
                    <div
                      className={`${styles.ovCompareFill} ${styles.ovCompareFillWithout}`}
                      style={{ '--wd-bar-delay': '120ms' } as React.CSSProperties}
                    >
                      <span>Low Visibility</span>
                    </div>
                  </div>
                </div>
                <div className={styles.ovCompareRow}>
                  <div className={styles.ovCompareLabel}>
                    <span>With a 10 Cent Agency Website</span>
                    <span>+55% More Leads</span>
                  </div>
                  <div className={styles.ovCompareTrack}>
                    <div
                      className={`${styles.ovCompareFill} ${styles.ovCompareFillWith}`}
                      style={{ '--wd-bar-delay': '260ms' } as React.CSSProperties}
                    >
                      <span>Optimized &amp; Discoverable</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 4. SERVICE BREAKDOWN (Exact 4 Cards from Demo) ===================== */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Core Service 02</span>
              <h2 className={styles.sectionTitle}>Website Development Services</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                Professional websites designed to convert visitors into customers and grow
                your business online. Depending on your project&apos;s complexity, we
                build using WordPress &amp; Elementor for easily manageable sites, or
                custom-coded Next.js/React applications for advanced, high-performance
                needs.
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
                        <FaCircleCheck
                          className={styles.serviceCardLiIcon}
                          aria-hidden="true"
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== 5. HOW WE WORK — Dev Pipeline ===================== */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Our Process</span>
              <h2 className={styles.sectionTitle}>How We Work</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                From discovery call to launch and beyond — watch our exact build pipeline
                in action.
              </p>
            </div>

            <DevelopmentPipeline />
          </div>
        </section>

        {/* ===================== 6. STRATEGIES DEEP-DIVE (Tabbed) ===================== */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>In-Depth Strategy</span>
              <h2 className={styles.sectionTitle}>Our Website Development Approach</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                A closer look at the exact standards we build every website against.
              </p>
            </div>

            <WebsiteStrategyTabs />
          </div>
        </section>

        {/* ===================== 7. TECH STACK SHOWCASE ===================== */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Tools &amp; Technology</span>
              <h2 className={styles.sectionTitle}>Technology We Build With</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                We choose the right technology for your business — WordPress &amp;
                Elementor for easily manageable sites, or modern code-based solutions for
                high-performance, custom-feature projects.
              </p>
            </div>

            <div className={styles.techStackGrid}>
              {techStackData.map((category: TechCategory) => {
                const HeaderIcon = iconMap[category.iconKey] || FaLayerGroup;
                return (
                  <div key={category.id} className={styles.techCategory}>
                    <div className={styles.techCategoryHeader}>
                      <div className={styles.techCategoryIcon}>
                        <HeaderIcon aria-hidden="true" />
                      </div>
                      <h4>{category.title}</h4>
                    </div>
                    <div className={styles.techItemList}>
                      {category.items.map((item: TechCategoryItem, idx: number) => {
                        const ItemIcon = iconMap[item.iconKey] || FaCode;
                        return (
                          <div key={idx} className={styles.techItem}>
                            <div className={styles.techItemIcon}>
                              <ItemIcon aria-hidden="true" />
                            </div>
                            <span>{item.label}</span>
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

        {/* ===================== 8. WORDPRESS VS NEXT.JS DECISION GUIDE ===================== */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Technology Guide</span>
              <h2 className={styles.sectionTitle}>
                WordPress vs Next.js — Which One is Right for You?
              </h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                Before we start any project, we take the time to understand your goals and
                recommend the right technology — so you never end up with a solution that
                doesn&apos;t fit your business.
              </p>
            </div>

            <TechnologyDecisionGuide />
          </div>
        </section>

        {/* ===================== 9. WHY CHOOSE US ===================== */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Why 10 Cent Agency</span>
              <h2 className={styles.sectionTitle}>Why Work With Us</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                We&apos;re not just building websites — we&apos;re building your
                business&apos;s digital foundation.
              </p>
            </div>
            <div className={styles.whyGrid}>
              {whyChooseUsData.map((card: WhyChooseCard) => {
                const CardIcon = iconMap[card.iconKey] || FaCode;
                return (
                  <div key={card.id} className={styles.whyCard}>
                    <div className={styles.whyIcon}>
                      <CardIcon aria-hidden="true" />
                    </div>
                    <h4>{card.title}</h4>
                    <p>{card.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===================== 10. COMMON MISTAKES ===================== */}
        <section className={styles.section}>
          <div className={styles.container} style={{ maxWidth: '950px' }}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Avoid These Pitfalls</span>
              <h2 className={styles.sectionTitle}>
                5 Common Website Mistakes Businesses Make
              </h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                We&apos;ve audited dozens of business websites in Bangladesh. Here are the
                mistakes we see most often — and how we fix them.
              </p>
            </div>

            <div className={styles.mistakesWrap}>
              {commonMistakesData.map((mistake: CommonMistake) => (
                <div key={mistake.num} className={styles.mistakeRow}>
                  <div className={styles.mistakeNum}>{mistake.num}</div>
                  <div>
                    <h4>{mistake.title}</h4>
                    <p>{mistake.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== 11. RESULTS / STATS (Infographic) ===================== */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container}>
            <WebsiteStats />
          </div>
        </section>

        {/* ===================== 12. IS THIS RIGHT FOR YOU? QUIZ ===================== */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Quick Self-Check</span>
              <h2 className={styles.sectionTitle}>
                Does Your Business Actually Need a New Website?
              </h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                Select every statement that applies to your current situation. We&apos;ll
                tell you exactly what you need.
              </p>
            </div>

            <WebsiteNeedsQuiz />
          </div>
        </section>

        {/* ===================== 13. PRICING PACKAGES ===================== */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Packages</span>
              <h2 className={styles.sectionTitle}>Choose the Right Website Package</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                Every business has different needs — that&apos;s why we scope every
                project individually. Here&apos;s what&apos;s typically included at each
                level.
              </p>
            </div>
            <div className={styles.pricingGrid}>
              {pricingPackagesData.map((pkg: PricingPackage) => (
                <div
                  key={pkg.id}
                  className={`${styles.priceCard} ${
                    pkg.isPopular ? styles.priceCardPopular : ''
                  }`}
                >
                  {pkg.isPopular && (
                    <span className={styles.popularBadge}>{pkg.popularBadge}</span>
                  )}
                  {pkg.badge && <span className={styles.badge}>{pkg.badge}</span>}
                  <h3>{pkg.title}</h3>
                  <p className={styles.priceNote}>{pkg.note}</p>
                  <ul>
                    {pkg.features.map((feature, idx) => (
                      <li key={idx}>
                        <FaCircleCheck
                          className={styles.priceCardLiIcon}
                          aria-hidden="true"
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/contact"
                    className={`${styles.btn} ${
                      pkg.isPopular ? styles.btnPrimary : styles.btnOutline
                    } ${styles.fullWidth}`}
                  >
                    {pkg.ctaText}
                  </Link>
                </div>
              ))}
            </div>

            <div className={styles.priceTrustBox}>
              <p>
                <FaCircleInfo className={styles.priceTrustBoxIcon} aria-hidden="true" />
                Final pricing depends on the number of pages, features, and complexity of
                your project.{' '}
                <Link
                  href="/contact"
                  className="text-brand-blue font-semibold hover:underline"
                >
                  <strong>Book a free consultation</strong>
                </Link>{' '}
                and we&apos;ll recommend the right package with a transparent quote.
              </p>
            </div>
          </div>
        </section>

        {/* ===================== 14. INDUSTRIES ===================== */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Industries We Serve</span>
              <h2 className={styles.sectionTitle}>Websites Tailored to Your Industry</h2>
            </div>
            <div className={styles.industryDescGrid}>
              {industriesData.map((ind: IndustryCard) => {
                const IndIcon = iconMap[ind.iconKey] || FaUtensils;
                return (
                  <div key={ind.id} className={styles.industryDescCard}>
                    <h4>
                      <IndIcon className={styles.industryCardIcon} aria-hidden="true" />
                      {ind.title}
                    </h4>
                    <p>{ind.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===================== 15. DOMAIN VS HOSTING VS WEBSITE ===================== */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Confused About the Basics?</span>
              <h2 className={styles.sectionTitle}>
                Domain vs Hosting vs Website — What&apos;s the Difference?
              </h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                Many business owners confuse these three things. Here&apos;s a simple
                breakdown of what each one actually is, and why you need all three.
              </p>
            </div>
            <div className={styles.dhwGrid}>
              {domainHostingWebsiteData.map((dhw: DHWCard) => {
                const DhwIcon = iconMap[dhw.iconKey] || FaSignature;
                return (
                  <div key={dhw.id} className={styles.dhwCard}>
                    <span className={styles.dhwStep}>{dhw.step}</span>
                    <div className={styles.dhwIcon}>
                      <DhwIcon aria-hidden="true" />
                    </div>
                    <h4>{dhw.title}</h4>
                    <p className={styles.dhwTagline}>{dhw.tagline}</p>
                    <p>{dhw.desc}</p>
                  </div>
                );
              })}
            </div>
            <div className={styles.dhwSummary}>
              <FaCircleInfo className={styles.dhwSummaryIcon} aria-hidden="true" />
              You need all three together — buying just a Domain doesn&apos;t give you a
              website, and buying just Hosting means no one can find you. We set up both
              Domain and Hosting as part of your project, so you can focus purely on your
              business.
            </div>
          </div>
        </section>

        {/* ===================== 16. FAQ ===================== */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>FAQ</span>
              <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                Honest, detailed answers to the questions we hear most often about our
                Website Development services
              </p>
            </div>

            <WebsiteFAQ />
          </div>
        </section>

        {/* ===================== 17. TESTIMONIALS ===================== */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Client Voices</span>
              <h2 className={styles.sectionTitle}>What Our Clients Say</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                Real feedback from business owners across Bangladesh
              </p>
            </div>
            <div className={styles.testiGrid}>
              {testimonialsData.map((testi: TestimonialCard) => (
                <div key={testi.id} className={styles.testiCard}>
                  <div className={styles.testiTop}>
                    <div className={styles.testiStars}>{testi.stars}</div>
                    <span className={styles.testiTag}>{testi.tag}</span>
                  </div>
                  <p className={styles.testiQuote}>{testi.quote}</p>
                  <div className={styles.testiUser}>
                    <div
                      className={styles.testiAvatar}
                      style={{ background: testi.avatarGradient }}
                    >
                      {testi.avatarInitials}
                    </div>
                    <div>
                      <h5>
                        {testi.author}{' '}
                        <FaCircleCheck
                          className={styles.testiVerified}
                          title="Verified Client"
                          aria-hidden="true"
                        />
                      </h5>
                      <span>
                        {testi.role},{' '}
                        <a
                          href={testi.companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {testi.company}
                        </a>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== 18. CLOSING SUMMARY ===================== */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={`${styles.container} ${styles.closingWrap}`}>
            <h2 className={styles.closingTitle}>The Bottom Line</h2>
            <p className={styles.closingText}>
              A website isn&apos;t just a digital brochure — it&apos;s a system that
              should load fast, look great on every device, be structured for search
              engines, and guide visitors toward taking action. Businesses that invest in
              getting this foundation right consistently outperform those running on
              outdated, slow, or poorly structured sites.
            </p>
            <p className={styles.closingText}>
              At <strong>10 Cent Agency</strong>, we combine design, development, and
              technical SEO into one accountable process — explore our{' '}
              <Link href="/portfolio" className={styles.inlineLink}>
                client portfolio
              </Link>{' '}
              to see our live work, or get in touch so your website becomes a genuine
              growth asset, not just an online formality.
            </p>
          </div>
        </section>

        {/* ===================== 19. RELATED SERVICES ===================== */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Explore More</span>
              <h2 className={styles.sectionTitle}>Related Services</h2>
            </div>
            <RelatedServices currentSlug="website-development" />
          </div>
        </section>
      </div>

      {/* Exactly one CTABanner component outside pageRoot */}
      <CTABanner />
    </>
  );
}
