import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import CTABanner from '@/components/home/CTABanner';
import styles from './FacebookMetaMkt.module.css';
import StrategyTabs from './StrategyTabs.client';
import FAQAccordion from './FAQAccordion.client';
import AnimatedStats from './AnimatedStats.client';
import FacebookMotion from './FacebookMotion.client';
import ReportPreview from './ReportPreview.client';
import MetricsFlipCards from './MetricsFlipCards.client';
import RoiEstimator from './RoiEstimator.client';
import RelatedServices from '@/components/services/RelatedServices.client';
import {
  getFacebookMetaSchemaGraph,
  trustSealsData,
  promiseItemsData,
  testimonialsData,
  TrustSealItem,
  PromiseItem,
  TestimonialItem,
} from './facebookMetaData';
import {
  FaArrowLeft,
  FaArrowRight,
  FaFacebookF,
  FaCircleCheck,
  FaEarthAsia,
  FaEllipsis,
  FaThumbsUp,
  FaHeart,
  FaRegThumbsUp,
  FaRegComment,
  FaShare,
  FaCircleInfo,
  FaChartSimple,
  FaFacebook,
  FaClock,
  FaArrowTrendUp,
  FaPhoneVolume,
  FaLightbulb,
  FaPenRuler,
  FaRocket,
  FaChartLine,
  FaLanguage,
  FaEye,
  FaDatabase,
  FaUserTie,
  FaBolt,
  FaAward,
  FaUtensils,
  FaCartShopping,
  FaShirt,
  FaHouse,
  FaHeartPulse,
  FaDumbbell,
  FaShieldHeart,
  FaCheck,
} from 'react-icons/fa6';

export const metadata: Metadata = {
  title: 'Facebook & Meta Marketing Services | 10 Cent Agency BD',
  description:
    'Data-driven Facebook & Instagram campaigns for Bangladeshi businesses — Pixel, Conversions API, creative management & monthly reports. No ad spend markup.',
  alternates: {
    canonical: 'https://www.10centagency.com/services/facebook-meta-marketing',
  },
  openGraph: {
    type: 'website',
    url: 'https://www.10centagency.com/services/facebook-meta-marketing',
    siteName: '10 Cent Agency',
    title: 'Facebook & Meta Marketing Services | 10 Cent Agency BD',
    description:
      'Data-driven Facebook & Instagram campaigns for Bangladeshi businesses — Pixel, Conversions API, creative management & monthly reports. No ad spend markup.',
    images: [
      {
        url: 'https://www.10centagency.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Facebook & Meta Marketing Services — 10 Cent Agency',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Facebook & Meta Marketing Services | 10 Cent Agency BD',
    description:
      'Data-driven Facebook & Instagram campaigns for Bangladeshi businesses — Pixel, Conversions API, creative management & monthly reports. No ad spend markup.',
    images: [
      {
        url: 'https://www.10centagency.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Facebook & Meta Marketing Services — 10 Cent Agency',
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

export default function FacebookMetaMarketingPage() {
  const schemaGraph = getFacebookMetaSchemaGraph();

  return (
    <>
      <div className={styles.pageRoot} data-fb-page-root>
        {/* Page-Scoped Motion Controller for Reveal Observers & Timelines */}
        <FacebookMotion />

        {/* Single Server-Rendered Connected Schema.org @graph */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaGraph),
          }}
        />

        {/* ===================== 1. HERO ===================== */}
        <section className={styles.hero}>
          <div className={styles.container}>
            <div className={styles.breadcrumb}>
              <Link href="/">Home</Link>
              <span>&gt;</span>
              <Link href="/services">Services</Link>
              <span>&gt;</span>
              <span className={styles.breadcrumbCurrent}>
                Facebook &amp; Meta Marketing
              </span>
            </div>
            <h1 className={styles.heroTitle}>Facebook &amp; Meta Marketing</h1>
            <p className={styles.heroDesc}>
              Build a powerful, revenue-generating presence on Facebook and Instagram —
              from ground-zero setup to full-scale ad campaigns. We craft strategies that fit
              your budget and deliver measurable results.
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

        {/* ===================== 2. QUICK ANSWER — Facebook Post Mockup Style ===================== */}
        <div className={styles.container}>
          <div className={styles.fbAnswerWrap}>
            <div className={styles.fbPostHeader}>
              <div className={styles.fbAvatar}>
                <FaFacebookF aria-hidden="true" />
              </div>
              <div className={styles.fbPostMeta}>
                <div className={styles.fbPageName}>
                  10 Cent Agency <FaCircleCheck className={styles.fbVerified} aria-hidden="true" />
                </div>
                <div className={styles.fbPostSub}>
                  <FaEarthAsia aria-hidden="true" /> Quick Answer · Public
                </div>
              </div>
              <div className={styles.fbPostMenu}>
                <FaEllipsis aria-hidden="true" />
              </div>
            </div>
            <div className={styles.fbPostBody}>
              <h2>What is Facebook &amp; Meta Marketing? 🤔</h2>
              <p>
                Facebook &amp; Meta Marketing is a digital marketing service that builds
                business presence on Facebook and Instagram through page setup, content
                creation, and targeted ad campaigns to grow brand awareness, engagement,
                and sales. 10 Cent Agency provides end-to-end service for small and
                medium businesses in Bangladesh — from page setup to monthly ad management
                and performance reporting.
              </p>
              <div className={styles.fbTags}>
                <span className={styles.fbTag}>#FacebookMarketing</span>
                <span className={styles.fbTag}>#MetaAds</span>
                <span className={styles.fbTag}>#BangladeshBusiness</span>
              </div>
            </div>
            <div className={styles.fbReactionSummary}>
              <div className={styles.fbReactionsIcons}>
                <span className={styles.fbIconLike}>
                  <FaThumbsUp aria-hidden="true" />
                </span>
                <span className={styles.fbIconLove}>
                  <FaHeart aria-hidden="true" />
                </span>
                <span>2.4K</span>
              </div>
              <div>180 Comments · 95 Shares</div>
            </div>
            <div className={styles.fbPostActions}>
              <button type="button" className={styles.fbAction}>
                <FaRegThumbsUp aria-hidden="true" /> Like
              </button>
              <button type="button" className={styles.fbAction}>
                <FaRegComment aria-hidden="true" /> Comment
              </button>
              <button type="button" className={styles.fbAction}>
                <FaShare aria-hidden="true" /> Share
              </button>
            </div>
          </div>
          <div className={`${styles.captionNote} ${styles.fbCaption}`}>
            <FaCircleInfo className={styles.captionIcon} aria-hidden="true" />
            <span>
              This is the exact quality standard we build for every client&apos;s
              content — clear, engaging, and structured to get results.
            </span>
          </div>
        </div>

        {/* ===================== 3. OVERVIEW — Data Dashboard Style ===================== */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={`${styles.center} ${styles.ovIntro}`}>
              <span className={styles.sectionTag}>The Bigger Picture</span>
              <h2 className={styles.sectionTitle}>
                Understanding Facebook &amp; Meta Marketing in Bangladesh
              </h2>
              <p>
                Real numbers behind why Facebook and Instagram remain the highest-ROI
                marketing channel for businesses in Bangladesh.
              </p>
            </div>

            <div className={styles.ovDashboard}>
              {/* Engagement by content type */}
              <div className={`${styles.ovCard} ${styles.ovCardWide}`} data-progress-animation>
                <div className={styles.ovCardTitle}>
                  <FaChartSimple className={styles.ovCardTitleIcon} aria-hidden="true" /> Average Engagement
                  Rate by Content Type
                </div>
                <div className={styles.ovBarRow}>
                  <div className={styles.ovBarTop}>
                    <span>Plain Product Photo Post</span>
                    <strong>1.2% Engagement</strong>
                  </div>
                  <div className={styles.ovBarTrack}>
                    <div className={`${styles.ovBarFill} ${styles.barFill20}`} />
                  </div>
                </div>
                <div className={styles.ovBarRow}>
                  <div className={styles.ovBarTop}>
                    <span>Customer Testimonial Post</span>
                    <strong>3.4% Engagement</strong>
                  </div>
                  <div className={styles.ovBarTrack}>
                    <div className={`${styles.ovBarFill} ${styles.barFill55}`} />
                  </div>
                </div>
                <div className={styles.ovBarRow}>
                  <div className={styles.ovBarTop}>
                    <span>Video / Reels Content</span>
                    <strong>5.8% Engagement</strong>
                  </div>
                  <div className={styles.ovBarTrack}>
                    <div className={`${styles.ovBarFill} ${styles.barFill92}`} />
                  </div>
                </div>
                <div className={styles.ovSource}>
                  Source: Meta Business Insights / Industry benchmark data
                </div>
              </div>

              {/* Big stat: active users in BD */}
              <div className={styles.ovCard}>
                <div className={styles.ovBigStat}>
                  <div className={styles.ovBigIcon}>
                    <FaFacebook aria-hidden="true" />
                  </div>
                  <div className={styles.ovBigNum}>45M+</div>
                  <div className={styles.ovBigLabel}>
                    Active Facebook users in Bangladesh — your potential audience
                  </div>
                </div>
              </div>

              {/* Big stat: time spent */}
              <div className={styles.ovCard}>
                <div className={styles.ovBigStat}>
                  <div className={styles.ovBigIcon}>
                    <FaClock aria-hidden="true" />
                  </div>
                  <div className={styles.ovBigNum}>2.5 hrs</div>
                  <div className={styles.ovBigLabel}>
                    Average daily time spent on Facebook &amp; Instagram per user
                  </div>
                </div>
              </div>

              {/* Comparison bars */}
              <div className={`${styles.ovCard} ${styles.ovCardWide}`} data-progress-animation>
                <div className={styles.ovCardTitle}>
                  <FaArrowTrendUp className={styles.ovCardTitleIcon} aria-hidden="true" /> Conversion
                  Tracking Accuracy
                </div>
                <div className={styles.ovCompareRow}>
                  <div className={styles.ovCompareLabel}>
                    <span>Without Pixel + CAPI Setup</span>
                    <span>Baseline</span>
                  </div>
                  <div className={styles.ovCompareTrack}>
                    <div
                      className={`${styles.ovCompareFill} ${styles.ovCompareFillWithout} ${styles.barFill45}`}
                    >
                      <span>Incomplete Data</span>
                    </div>
                  </div>
                </div>
                <div className={styles.ovCompareRow}>
                  <div className={styles.ovCompareLabel}>
                    <span>With 10 Cent Agency Setup</span>
                    <span>~2x More Accurate</span>
                  </div>
                  <div className={styles.ovCompareTrack}>
                    <div
                      className={`${styles.ovCompareFill} ${styles.ovCompareFillWith} ${styles.barFill90}`}
                    >
                      <span>Full Conversion Visibility</span>
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
              <span className={styles.sectionTag}>Core Service 01</span>
              <h2 className={styles.sectionTitle}>
                Facebook &amp; Meta Marketing Services
              </h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                Comprehensive solutions to establish, grow, and monetize your presence on
                Facebook and Instagram.
              </p>
            </div>
            <div className={styles.cardsGrid}>
              {/* 1 */}
              <div className={styles.serviceCard}>
                <span className={styles.badge}>One-time Setup</span>
                <h3>Page Setup &amp; Optimization</h3>
                <ul>
                  <li>
                    <FaCircleCheck className={styles.serviceCardLiIcon} aria-hidden="true" />
                    <span>Facebook Business Page &amp; Instagram Business Account setup</span>
                  </li>
                  <li>
                    <FaCircleCheck className={styles.serviceCardLiIcon} aria-hidden="true" />
                    <span>
                      Meta Business Suite configuration + Facebook Pixel installation
                    </span>
                  </li>
                  <li>
                    <FaCircleCheck className={styles.serviceCardLiIcon} aria-hidden="true" />
                    <span>Profile optimization (Bio, CTA button, contact info)</span>
                  </li>
                  <li>
                    <FaCircleCheck className={styles.serviceCardLiIcon} aria-hidden="true" />
                    <span>Cover photo, profile photo design</span>
                  </li>
                  <li>
                    <FaCircleCheck className={styles.serviceCardLiIcon} aria-hidden="true" />
                    <span>Linked Instagram &amp; Facebook integration</span>
                  </li>
                </ul>
              </div>

              {/* 2 */}
              <div className={styles.serviceCard}>
                <span className={styles.badge}>Monthly Retainer</span>
                <h3>Content Creation &amp; Post Design</h3>
                <ul>
                  <li>
                    <FaCircleCheck className={styles.serviceCardLiIcon} aria-hidden="true" />
                    <span>
                      Custom social media post design (static graphics) in Bangla &amp;
                      English
                    </span>
                  </li>
                  <li>
                    <FaCircleCheck className={styles.serviceCardLiIcon} aria-hidden="true" />
                    <span>Post copywriting — captions, headlines, calls-to-action</span>
                  </li>
                  <li>
                    <FaCircleCheck className={styles.serviceCardLiIcon} aria-hidden="true" />
                    <span>Monthly content calendar planning &amp; scheduled posting</span>
                  </li>
                  <li>
                    <FaCircleCheck className={styles.serviceCardLiIcon} aria-hidden="true" />
                    <span>Hashtag research, festival/occasion posts, promotional posts</span>
                  </li>
                  <li>
                    <FaCircleCheck className={styles.serviceCardLiIcon} aria-hidden="true" />
                    <span>Testimonial, educational, and product highlight post designs</span>
                  </li>
                </ul>
              </div>

              {/* 3 */}
              <div className={styles.serviceCard}>
                <span className={styles.badge}>Per Project / Monthly</span>
                <h3>Ad Creative Production</h3>
                <ul>
                  <li>
                    <FaCircleCheck className={styles.serviceCardLiIcon} aria-hidden="true" />
                    <span>Ad creative design (static image) with copywriting</span>
                  </li>
                  <li>
                    <FaCircleCheck className={styles.serviceCardLiIcon} aria-hidden="true" />
                    <span>Multiple ad variations for A/B testing</span>
                  </li>
                  <li>
                    <FaCircleCheck className={styles.serviceCardLiIcon} aria-hidden="true" />
                    <span>Ad creatives in multiple sizes — Feed, Story, Banner</span>
                  </li>
                  <li>
                    <FaCircleCheck className={styles.serviceCardLiIcon} aria-hidden="true" />
                    <span>Retargeting and promotional creatives</span>
                  </li>
                </ul>
              </div>

              {/* 4 */}
              <div className={styles.serviceCard}>
                <span className={styles.badge}>Monthly Retainer</span>
                <h3>Facebook &amp; Instagram Ads Management</h3>
                <ul>
                  <li>
                    <FaCircleCheck className={styles.serviceCardLiIcon} aria-hidden="true" />
                    <span>Full campaign strategy, setup, audience targeting &amp; segmentation</span>
                  </li>
                  <li>
                    <FaCircleCheck className={styles.serviceCardLiIcon} aria-hidden="true" />
                    <span>Custom &amp; Lookalike audience creation, A/B split testing</span>
                  </li>
                  <li>
                    <FaCircleCheck className={styles.serviceCardLiIcon} aria-hidden="true" />
                    <span>Facebook Conversions API (server-side tracking) setup</span>
                  </li>
                  <li>
                    <FaCircleCheck className={styles.serviceCardLiIcon} aria-hidden="true" />
                    <span>Google Analytics 4 + Google Tag Manager integration</span>
                  </li>
                  <li>
                    <FaCircleCheck className={styles.serviceCardLiIcon} aria-hidden="true" />
                    <span>UTM parameter setup &amp; cross-platform attribution tracking</span>
                  </li>
                  <li>
                    <FaCircleCheck className={styles.serviceCardLiIcon} aria-hidden="true" />
                    <span>Weekly performance check + detailed monthly report</span>
                  </li>
                  <li>
                    <FaCircleCheck className={styles.serviceCardLiIcon} aria-hidden="true" />
                    <span>
                      Ad budget policy: client provides budget directly to Meta; we manage
                      everything at no extra charge
                    </span>
                  </li>
                </ul>
              </div>

              {/* 5 */}
              <div className={styles.serviceCard}>
                <span className={styles.badge}>Included with Retainer</span>
                <h3>Monthly Performance Report</h3>
                <ul>
                  <li>
                    <FaCircleCheck className={styles.serviceCardLiIcon} aria-hidden="true" />
                    <span>Page growth overview (Followers, Reach, Engagement rate)</span>
                  </li>
                  <li>
                    <FaCircleCheck className={styles.serviceCardLiIcon} aria-hidden="true" />
                    <span>Ad campaign results — Spend, Reach, Clicks, Leads, ROAS</span>
                  </li>
                  <li>
                    <FaCircleCheck className={styles.serviceCardLiIcon} aria-hidden="true" />
                    <span>Server-side tracking data + Google Analytics 4 report</span>
                  </li>
                  <li>
                    <FaCircleCheck className={styles.serviceCardLiIcon} aria-hidden="true" />
                    <span>Audience insights, top content analysis, next-month strategy</span>
                  </li>
                  <li>
                    <FaCircleCheck className={styles.serviceCardLiIcon} aria-hidden="true" />
                    <span>Delivered as PDF within first 5 days of each month</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 5. NEW: SEE BEFORE YOU SIGN ===================== */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>See Before You Sign</span>
              <h2 className={styles.sectionTitle}>
                This Is Exactly What Your Report Looks Like
              </h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                A real preview of the monthly dashboard you&apos;ll receive — clear numbers,
                real trends, and a plan for what&apos;s next.
              </p>
            </div>

            {/* Client Component: Report Preview Dashboard */}
            <ReportPreview />
          </div>
        </section>

        {/* ===================== 6. HOW WE WORK ===================== */}
        <section id="how-we-work" className={styles.section}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Our Process</span>
              <h2 className={styles.sectionTitle}>How We Work</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                From discovery call to monthly optimization — a simple, transparent
                process built for results.
              </p>
            </div>
            <div className={styles.processWrap}>
              <div className={styles.processLine} />
              <div className={styles.processGrid}>
                <div className={styles.processStep} data-timeline-step>
                  <div className={styles.stepCircle}>
                    <FaPhoneVolume aria-hidden="true" />
                    <span className={styles.stepNum}>1</span>
                  </div>
                  <h4>Discovery Call</h4>
                  <p>Free consultation to understand your goals and target audience</p>
                </div>
                <div className={styles.processStep} data-timeline-step>
                  <div className={styles.stepCircle}>
                    <FaLightbulb aria-hidden="true" />
                    <span className={styles.stepNum}>2</span>
                  </div>
                  <h4>Strategy &amp; Proposal</h4>
                  <p>Custom plan and proposal built around your budget</p>
                </div>
                <div className={styles.processStep} data-timeline-step>
                  <div className={styles.stepCircle}>
                    <FaPenRuler aria-hidden="true" />
                    <span className={styles.stepNum}>3</span>
                  </div>
                  <h4>Setup &amp; Content</h4>
                  <p>Page setup, content calendar, and creative production</p>
                </div>
                <div className={styles.processStep} data-timeline-step>
                  <div className={styles.stepCircle}>
                    <FaRocket aria-hidden="true" />
                    <span className={styles.stepNum}>4</span>
                  </div>
                  <h4>Launch &amp; Optimize</h4>
                  <p>Campaign goes live with real-time optimization</p>
                </div>
                <div className={styles.processStep} data-timeline-step>
                  <div className={styles.stepCircle}>
                    <FaChartLine aria-hidden="true" />
                    <span className={styles.stepNum}>5</span>
                  </div>
                  <h4>Report &amp; Scale</h4>
                  <p>Monthly reporting and scaling what performs best</p>
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
              <h2 className={styles.sectionTitle}>
                Our Facebook &amp; Meta Marketing Strategies
              </h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                A closer look at the exact techniques we use to grow your presence and drive
                real ROI.
              </p>
            </div>

            {/* Client Component with Accessible Tabs */}
            <StrategyTabs />
          </div>
        </section>

        {/* ===================== 8. NEW: KNOW THE NUMBERS (Flip Cards) ===================== */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Know The Numbers</span>
              <h2 className={styles.sectionTitle}>
                Understand the Key Meta Marketing Metrics
              </h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                The numbers behind every campaign — hover or tap each card to see what
                they actually mean.
              </p>
            </div>

            {/* Client Component: 3D Metrics Flip Cards */}
            <MetricsFlipCards />
          </div>
        </section>

        {/* ===================== 9. WHY CHOOSE US ===================== */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Why 10 Cent Agency</span>
              <h2 className={styles.sectionTitle}>Why Work With Us</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                We&apos;re not just running campaigns — we&apos;re your long-term growth
                partner.
              </p>
            </div>
            <div className={styles.whyGrid}>
              <div className={styles.whyCard}>
                <div className={styles.whyIcon}>
                  <FaLanguage aria-hidden="true" />
                </div>
                <h4>Bangla + English Content</h4>
                <p>
                  We create content in both languages to maximize local engagement and
                  reach.
                </p>
              </div>
              <div className={styles.whyCard}>
                <div className={styles.whyIcon}>
                  <FaEye aria-hidden="true" />
                </div>
                <h4>Transparent Ad Spend</h4>
                <p>
                  Ad budget goes directly to Meta — we never charge hidden markups or
                  extra fees.
                </p>
              </div>
              <div className={styles.whyCard}>
                <div className={styles.whyIcon}>
                  <FaDatabase aria-hidden="true" />
                </div>
                <h4>Data-Driven Strategy</h4>
                <p>
                  Every decision is backed by Pixel, CAPI, and GA4 data — not guesswork.
                </p>
              </div>
              <div className={styles.whyCard}>
                <div className={styles.whyIcon}>
                  <FaUserTie aria-hidden="true" />
                </div>
                <h4>Dedicated Manager</h4>
                <p>Every client gets a dedicated account manager for ongoing support.</p>
              </div>
              <div className={styles.whyCard}>
                <div className={styles.whyIcon}>
                  <FaBolt aria-hidden="true" />
                </div>
                <h4>Fast Turnaround</h4>
                <p>
                  Content and ad creative revisions delivered within 48 hours, guaranteed.
                </p>
              </div>
              <div className={styles.whyCard}>
                <div className={styles.whyIcon}>
                  <FaAward aria-hidden="true" />
                </div>
                <h4>Proven Results</h4>
                <p>
                  From e-commerce to service businesses — a track record of measurable
                  success.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 10. NEW: CREDIBILITY YOU CAN CHECK ===================== */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Credibility You Can Check</span>
              <h2 className={styles.sectionTitle}>Verified &amp; Trusted</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                Every claim we make is backed by real process, real access, and real
                accountability.
              </p>
            </div>

            <div className={styles.trustGrid}>
              {trustSealsData.map((seal: TrustSealItem) => {
                const SealIcon = seal.icon;
                return (
                  <div
                    key={seal.id}
                    className={styles.trustSealItem}
                    data-trust-seal
                  >
                    <div className={styles.trustSeal}>
                      <div className={styles.trustSealRing} />
                      <div className={styles.trustSealIcon}>
                        <SealIcon aria-hidden="true" />
                      </div>
                      <div className={styles.trustCheck}>
                        <FaCheck aria-hidden="true" />
                      </div>
                    </div>
                    <span className={styles.trustRibbon}>{seal.ribbon}</span>
                    <p className={styles.trustDesc}>{seal.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===================== 11. COMMON MISTAKES ===================== */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container} style={{ maxWidth: '950px' }}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Avoid These Pitfalls</span>
              <h2 className={styles.sectionTitle}>
                5 Common Mistakes Businesses Make on Facebook
              </h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                We&apos;ve audited dozens of Facebook Pages in Bangladesh. Here are the
                mistakes we see most often — and how we fix them.
              </p>
            </div>

            <div style={{ display: 'grid', gap: '26px' }}>
              <div className={styles.mistakeRow}>
                <div className={styles.mistakeNum}>1</div>
                <div>
                  <h4>Running Ads Without a Pixel Installed</h4>
                  <p>
                    This is the most common mistake — spending money on ads with no way to
                    track who converted. Without a Pixel, Meta&apos;s algorithm can&apos;t
                    optimize your campaign toward people likely to buy, which means wasted
                    budget from day one.
                  </p>
                </div>
              </div>
              <div className={styles.mistakeRow}>
                <div className={styles.mistakeNum}>2</div>
                <div>
                  <h4>Targeting Too Broad or Too Narrow an Audience</h4>
                  <p>
                    Many businesses either target &ldquo;everyone in Bangladesh&rdquo; (too
                    broad, wastes budget) or an audience so narrow the algorithm
                    can&apos;t find enough people to show ads to. We use a mix of custom
                    and lookalike audiences to find the sweet spot.
                  </p>
                </div>
              </div>
              <div className={styles.mistakeRow}>
                <div className={styles.mistakeNum}>3</div>
                <div>
                  <h4>Posting Only Product Photos, No Storytelling</h4>
                  <p>
                    Facebook&apos;s algorithm rewards content that generates engagement —
                    comments, shares, saves. Pure product catalog posts rarely perform
                    well. We mix product content with educational, behind-the-scenes, and
                    testimonial posts that actually get seen.
                  </p>
                </div>
              </div>
              <div className={styles.mistakeRow}>
                <div className={styles.mistakeNum}>4</div>
                <div>
                  <h4>Ignoring iOS Tracking Limitations</h4>
                  <p>
                    Since Apple&apos;s privacy update, browser-based Pixel tracking alone
                    misses a significant chunk of conversions from iPhone users. We
                    implement server-side Conversions API (CAPI) to recover this lost
                    data.
                  </p>
                </div>
              </div>
              <div className={styles.mistakeRow}>
                <div className={styles.mistakeNum}>5</div>
                <div>
                  <h4>Never Reviewing Performance Data</h4>
                  <p>
                    Many businesses launch a campaign and never revisit it. Without
                    weekly optimization — pausing underperforming ads, scaling winners —
                    you&apos;re leaving results on the table. Our retainer clients get
                    weekly checks built in.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 12. RESULTS / STATS (Infographic) ===================== */}
        <section className={styles.section}>
          <div className={styles.container}>
            {/* Client Component with IntersectionObserver Counter Animations */}
            <AnimatedStats />
          </div>
        </section>

        {/* ===================== 13. NEW: TRY IT YOURSELF (ROI / Budget Estimator) ===================== */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Try It Yourself</span>
              <h2 className={styles.sectionTitle}>
                What Results Could Your Budget Get You?
              </h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                Move the slider and pick your industry for a rough estimate — this is a
                directional projection, not a guaranteed outcome.
              </p>
            </div>

            {/* Client Component: Live ROI Estimator Calculator */}
            <RoiEstimator />
          </div>
        </section>

        {/* ===================== 14. PRICING ===================== */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Packages</span>
              <h2 className={styles.sectionTitle}>
                Choose the Right Plan for Your Business
              </h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                Every business is different — that&apos;s why we build custom packages based
                on your goals, budget, and industry. Here&apos;s what&apos;s typically
                included at each level.
              </p>
            </div>
            <div className={styles.pricingGrid}>
              {/* Starter */}
              <div className={styles.priceCard}>
                <span className={styles.badge}>Best for Startups</span>
                <h3>Starter</h3>
                <p className={styles.priceNote}>
                  Perfect for businesses just getting started on Facebook &amp; Instagram
                </p>
                <ul>
                  <li>
                    <FaCircleCheck className={styles.priceCardLiIcon} aria-hidden="true" />
                    <span>Page setup &amp; optimization</span>
                  </li>
                  <li>
                    <FaCircleCheck className={styles.priceCardLiIcon} aria-hidden="true" />
                    <span>Basic monthly content calendar</span>
                  </li>
                  <li>
                    <FaCircleCheck className={styles.priceCardLiIcon} aria-hidden="true" />
                    <span>Single ad campaign setup</span>
                  </li>
                  <li>
                    <FaCircleCheck className={styles.priceCardLiIcon} aria-hidden="true" />
                    <span>Monthly performance report</span>
                  </li>
                </ul>
                <Link
                  href="/contact"
                  className={`${styles.btn} ${styles.btnOutline} ${styles.fullWidth}`}
                >
                  Get Custom Quote
                </Link>
              </div>

              {/* Growth */}
              <div className={`${styles.priceCard} ${styles.priceCardPopular}`}>
                <span className={styles.popularBadge}>Most Popular</span>
                <h3>Growth</h3>
                <p className={styles.priceNote}>
                  For businesses ready to scale reach and generate consistent leads
                </p>
                <ul>
                  <li>
                    <FaCircleCheck className={styles.priceCardLiIcon} aria-hidden="true" />
                    <span>Everything in Starter</span>
                  </li>
                  <li>
                    <FaCircleCheck className={styles.priceCardLiIcon} aria-hidden="true" />
                    <span>Full content + ad creative production</span>
                  </li>
                  <li>
                    <FaCircleCheck className={styles.priceCardLiIcon} aria-hidden="true" />
                    <span>Multi-campaign ads management + A/B testing</span>
                  </li>
                  <li>
                    <FaCircleCheck className={styles.priceCardLiIcon} aria-hidden="true" />
                    <span>Pixel + CAPI + GA4 tracking setup</span>
                  </li>
                  <li>
                    <FaCircleCheck className={styles.priceCardLiIcon} aria-hidden="true" />
                    <span>Weekly optimization</span>
                  </li>
                </ul>
                <Link
                  href="/contact"
                  className={`${styles.btn} ${styles.btnPrimary} ${styles.fullWidth}`}
                >
                  Get Custom Quote
                </Link>
              </div>

              {/* Pro */}
              <div className={styles.priceCard}>
                <span className={styles.badge}>Best for Scaling</span>
                <h3>Pro</h3>
                <p className={styles.priceNote}>
                  For established brands running high-budget, multi-platform campaigns
                </p>
                <ul>
                  <li>
                    <FaCircleCheck className={styles.priceCardLiIcon} aria-hidden="true" />
                    <span>Everything in Growth</span>
                  </li>
                  <li>
                    <FaCircleCheck className={styles.priceCardLiIcon} aria-hidden="true" />
                    <span>Dedicated account manager</span>
                  </li>
                  <li>
                    <FaCircleCheck className={styles.priceCardLiIcon} aria-hidden="true" />
                    <span>Unlimited content revisions</span>
                  </li>
                  <li>
                    <FaCircleCheck className={styles.priceCardLiIcon} aria-hidden="true" />
                    <span>Priority support &amp; strategy calls</span>
                  </li>
                </ul>
                <Link
                  href="/contact"
                  className={`${styles.btn} ${styles.btnOutline} ${styles.fullWidth}`}
                >
                  Get Custom Quote
                </Link>
              </div>
            </div>

            {/* Trust note with internal link to contact */}
            <div className={`${styles.captionNote} ${styles.priceTrustBox}`}>
              <FaCircleInfo className={styles.captionIcon} aria-hidden="true" />
              <span>
                Pricing depends on your business size, goals, and ad budget — that&apos;s
                why we don&apos;t use one-size-fits-all pricing.{' '}
                <Link href="/contact" className={styles.captionLink}>
                  Book a free consultation
                </Link>{' '}
                and we&apos;ll recommend the right package with a transparent quote.
              </span>
            </div>
          </div>
        </section>

        {/* ===================== 15. NEW: OUR PROMISE ===================== */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.mtrustCard} data-promise-card>
              <div className={styles.mtrustBadge}>
                <div className={styles.mtrustRing} />
                <div className={styles.mtrustBadgeIcon}>
                  <FaShieldHeart aria-hidden="true" />
                </div>
              </div>

              <span className={styles.sectionTag}>Our Promise</span>
              <h2 className={styles.mtrustTitle}>Built On Trust, Backed By Action</h2>
              <p className={styles.mtrustSub}>
                No lock-ins. No hidden markups. No empty promises.
              </p>

              <div className={styles.mtrustGrid}>
                {promiseItemsData.map((item: PromiseItem) => {
                  const PromiseIcon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className={styles.mtrustItem}
                      data-promise-item
                    >
                      <div className={styles.mtrustIcon}>
                        <PromiseIcon aria-hidden="true" />
                      </div>
                      <h5>{item.title}</h5>
                      <span>{item.description}</span>
                    </div>
                  );
                })}
              </div>

              <Link
                href="/services/facebook-meta-marketing#how-we-work"
                className={styles.mtrustLink}
              >
                See how we work <FaArrowRight className={styles.mtrustLinkIcon} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        {/* ===================== 16. INDUSTRIES ===================== */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Industries We Serve</span>
              <h2 className={styles.sectionTitle}>
                Facebook Marketing Tailored to Your Industry
              </h2>
            </div>
            <div className={styles.industryDescGrid}>
              <div className={styles.industryDescCard}>
                <h4>
                  <FaUtensils className={styles.industryCardIcon} aria-hidden="true" />
                  Restaurant &amp; Food
                </h4>
                <p>
                  From mouth-watering food photography to location-based ad targeting, we
                  help restaurants fill tables and drive online orders through Facebook and
                  Instagram.
                </p>
              </div>
              <div className={styles.industryDescCard}>
                <h4>
                  <FaCartShopping className={styles.industryCardIcon} aria-hidden="true" />
                  E-commerce
                </h4>
                <p>
                  We run catalog-based dynamic ads and retargeting campaigns that turn
                  browsers into buyers, backed by full conversion tracking.
                </p>
              </div>
              <div className={styles.industryDescCard}>
                <h4>
                  <FaShirt className={styles.industryCardIcon} aria-hidden="true" />
                  Fashion &amp; Beauty
                </h4>
                <p>
                  Visual-first content, influencer collaborations, and shoppable posts
                  help fashion brands build a loyal, engaged following that converts.
                </p>
              </div>
              <div className={styles.industryDescCard}>
                <h4>
                  <FaHouse className={styles.industryCardIcon} aria-hidden="true" />
                  Real Estate
                </h4>
                <p>
                  Lead generation campaigns with property showcase videos and targeted
                  ads help real estate businesses connect with serious buyers.
                </p>
              </div>
              <div className={styles.industryDescCard}>
                <h4>
                  <FaHeartPulse className={styles.industryCardIcon} aria-hidden="true" />
                  Healthcare
                </h4>
                <p>
                  We build trust-focused content and compliant ad campaigns that help
                  clinics and healthcare providers reach patients seeking care online.
                </p>
              </div>
              <div className={styles.industryDescCard}>
                <h4>
                  <FaDumbbell className={styles.industryCardIcon} aria-hidden="true" />
                  Gym &amp; Fitness
                </h4>
                <p>
                  Community-building content and membership-focused ad campaigns keep your
                  gym top-of-mind when people are ready to start their fitness journey.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 17. FAQ ACCORDION ===================== */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>FAQ</span>
              <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>
                Honest, detailed answers to the questions we hear most often about
                Facebook &amp; Instagram marketing
              </p>
            </div>

            {/* Client Component with Keyboard Accessible Accordion */}
            <FAQAccordion />
          </div>
        </section>

        {/* ===================== 18. TESTIMONIALS ===================== */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Client Voices</span>
              <h2 className={styles.sectionTitle}>What Our Clients Say</h2>
            </div>
            <div className={styles.testiGrid}>
              {testimonialsData.map((testi: TestimonialItem) => (
                <div key={testi.id} className={styles.testiCard}>
                  <div>
                    <div className={styles.testiTop}>
                      <div
                        className={styles.testiStars}
                        aria-label={`${testi.rating} out of 5 stars`}
                      >
                        {'★'.repeat(testi.rating)}
                        {testi.rating < 5 && (
                          <span className={styles.testiStarsStarEmpty}>
                            {'★'.repeat(5 - testi.rating)}
                          </span>
                        )}
                      </div>
                      <span className={styles.testiTag}>{testi.tag}</span>
                    </div>
                    <p className={styles.testiQuote}>{testi.quote}</p>
                  </div>
                  <div className={styles.testiUser}>
                    <div
                      className={`${styles.testiAvatar} ${
                        testi.avatarClass === 'avNavy'
                          ? styles.avNavy
                          : styles.avDeep
                      }`}
                      aria-hidden="true"
                    >
                      {testi.initials}
                    </div>
                    <div>
                      <h5>
                        {testi.name}{' '}
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
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={`${styles.container} ${styles.closingWrap}`}>
            <h2 className={styles.closingTitle}>The Bottom Line</h2>
            <p className={styles.closingText}>
              Facebook and Instagram marketing isn&apos;t just about posting content and
              hoping for the best — it&apos;s a system built on proper tracking,
              strategic targeting, consistent content, and continuous optimization.
              Businesses that treat it as a real growth channel, rather than an
              afterthought, consistently outperform those that don&apos;t.
            </p>
            <p className={styles.closingText}>
              At <strong>10 Cent Agency</strong>, we bring together strategy, design, and
              data into one accountable system — so you can focus on running your business
              while we focus on growing your audience and revenue on Meta platforms.
            </p>
          </div>
        </section>

        {/* ===================== 20. RELATED SERVICES ===================== */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.center}>
              <span className={styles.sectionTag}>Explore More</span>
              <h2 className={styles.sectionTitle}>Related Services</h2>
            </div>
            <RelatedServices currentSlug="facebook-meta-marketing" />
          </div>
        </section>
      </div>

      {/* Existing CTA Banner Component outside pageRoot */}
      <CTABanner />
    </>
  );
}
