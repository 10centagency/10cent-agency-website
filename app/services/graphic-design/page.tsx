import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { JetBrains_Mono } from 'next/font/google';
import CTABanner from '@/components/home/CTABanner';
import styles from './GraphicDesign.module.css';

// Client Components
import GdPhotoshopMockup from './GdPhotoshopMockup.client';
import GdOverviewMotion from './GdOverviewMotion.client';
import GdHowWeWork from './GdHowWeWork.client';
import GdStrategyTabs from './GdStrategyTabs.client';
import GdStats from './GdStats.client';
import GdFileDelivery from './GdFileDelivery.client';
import GdFAQ from './GdFAQ.client';

import RelatedServices from '@/components/services/RelatedServices.client';

// Data
import {
  serviceCardsData,
  paletteShowcaseData,
  typePairShowcaseData,
  techStackData,
  whyChooseUsData,
  vsComparisonData,
  commonMistakesData,
  pricingPackagesData,
  industriesData,
  testimonialsData,
  getGraphicDesignSchemaGraph,
} from './graphicDesignData';

// Icons
import {
  FaArrowLeft,
  FaCircleCheck,
  FaCircleInfo,
  FaXmark,
  FaCheck,
  FaStar,
  FaPalette,
  FaFigma,
  FaPenNib,
  FaImage,
  FaFileLines,
  FaObjectGroup,
  FaShareNodes,
  FaPrint,
  FaDroplet,
  FaCropSimple,
  FaFilePdf,
  FaShapes,
  FaDisplay,
  FaFilm,
  FaIcons,
  FaSwatchbook,
  FaBolt,
  FaFileExport,
  FaCopyright,
  FaArrowsRotate,
  FaUserTie,
  FaUtensils,
  FaCartShopping,
  FaHouse,
  FaHeartPulse,
  FaGraduationCap,
  FaShirt,
  FaFacebook,
  FaGlobe,
  FaMagnifyingGlassChart,
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
  FaPalette,
  FaFigma,
  FaPrint,
  FaShapes,
};

const techToolIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FaPenNib,
  FaImage,
  FaFileLines,
  FaFigma,
  FaObjectGroup,
  FaShareNodes,
  FaDroplet,
  FaCropSimple,
  FaFilePdf,
  FaDisplay,
  FaFilm,
  FaIcons,
};

const whyIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FaSwatchbook,
  FaBolt,
  FaFileExport,
  FaCopyright,
  FaArrowsRotate,
  FaUserTie,
};

const industryIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FaUtensils,
  FaCartShopping,
  FaHouse,
  FaHeartPulse,
  FaGraduationCap,
  FaShirt,
};

export const metadata: Metadata = {
  title: 'Graphic Design Services in Bangladesh | 10 Cent Agency',
  description:
    'Logo design, brand identity, social media graphics & marketing materials for Bangladeshi businesses. Professional, affordable, fast delivery. Get a free quote.',
  alternates: {
    canonical: 'https://www.10centagency.com/services/graphic-design',
  },
  openGraph: {
    type: 'website',
    url: 'https://www.10centagency.com/services/graphic-design',
    siteName: '10 Cent Agency',
    title: 'Graphic Design Services in Bangladesh | 10 Cent Agency',
    description:
      'Logo design, brand identity, social media graphics & marketing materials for Bangladeshi businesses. Professional, affordable, fast delivery. Get a free quote.',
    images: [
      {
        url: 'https://www.10centagency.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Graphic Design Services in Bangladesh | 10 Cent Agency',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Graphic Design Services in Bangladesh | 10 Cent Agency',
    description:
      'Logo design, brand identity, social media graphics & marketing materials for Bangladeshi businesses. Professional, affordable, fast delivery. Get a free quote.',
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

export default function GraphicDesignPage() {
  const schemaGraph = getGraphicDesignSchemaGraph();

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
            <span className={styles.breadcrumbCurrent}>Graphic Design</span>
          </div>

          <h1>Graphic Design</h1>
          <p>
            Professional visual identity and marketing materials that make your brand look polished
            and trustworthy. From logos and brand systems to social media graphics and print — every
            pixel designed with your brand in mind.
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

      {/* ===================== 2. QUICK ANSWER — PHOTOSHOP UI MOCKUP ===================== */}
      <GdPhotoshopMockup />

      {/* ===================== 3. OVERVIEW — DATA DASHBOARD ===================== */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={`${styles.center} ${styles.ovIntro}`}>
            <span className={styles.sectionTag}>The Bigger Picture</span>
            <h2 className={styles.sectionTitle} style={{ fontSize: '32px' }}>
              Why Design Quality Actually Matters
            </h2>
            <p>
              Real numbers behind why professional visuals directly affect how customers perceive
              and trust your brand.
            </p>
          </div>

          <GdOverviewMotion />
        </div>
      </section>

      {/* ===================== 4. SERVICE BREAKDOWN ===================== */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <div className={styles.center}>
            <span className={styles.sectionTag}>Add-On Service 06</span>
            <h2 className={styles.sectionTitle}>Graphic Design Services</h2>
            <p className={`${styles.sectionSub} ${styles.center}`}>
              Create a memorable brand identity and professional marketing materials that stand out
              — across print, digital, and social media.
            </p>
          </div>

          <div className={styles.cardsGrid}>
            {serviceCardsData.map((card) => (
              <div key={card.id} className={styles.serviceCard}>
                <span className={styles.badge}>{card.badge}</span>
                <h3>{card.title}</h3>
                <ul>
                  {card.items.map((item, idx) => (
                    <li key={idx}>
                      <FaCircleCheck className={styles.serviceCardLiIcon} aria-hidden="true" />
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
              From brief to final files — a simple, collaborative process built for a brand you&apos;ll
              love.
            </p>
          </div>

          <GdHowWeWork />
        </div>
      </section>

      {/* ===================== 6. DESIGN STYLE SHOWCASE ===================== */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <div className={styles.center}>
            <span className={styles.sectionTag}>Our Design Language</span>
            <h2 className={styles.sectionTitle}>Design Style Showcase</h2>
            <p className={`${styles.sectionSub} ${styles.center}`}>
              A glimpse of the color systems and typography pairings we build brands around — every
              project is fully custom to your business.
            </p>
          </div>

          {/* Color Palettes */}
          <div className={styles.paletteGrid}>
            {paletteShowcaseData.map((palette) => (
              <div key={palette.id} className={styles.paletteCard}>
                <div className={styles.swatchRow}>
                  {palette.swatches.map((color, cIdx) => (
                    <span
                      key={cIdx}
                      className={
                        palette.hasBorderLast && cIdx === palette.swatches.length - 1
                          ? styles.swatchBorder
                          : ''
                      }
                      style={{ background: color }}
                    />
                  ))}
                </div>
                <h4>{palette.name}</h4>
                <p>{palette.note}</p>
              </div>
            ))}
          </div>

          {/* Typography Pairings */}
          <div className={styles.typePairsGrid}>
            {typePairShowcaseData.map((typePair) => {
              let headingClass = styles.typePairHeadingGeometric;
              if (typePair.styleType === 'serif') {
                headingClass = styles.typePairHeadingSerif;
              } else if (typePair.styleType === 'mono') {
                headingClass = styles.typePairHeadingMono;
              }

              return (
                <div key={typePair.id} className={styles.typePairCard}>
                  <div className={`${styles.typePairHeading} ${headingClass}`}>
                    {typePair.heading}
                  </div>
                  <div className={styles.typePairBody}>{typePair.body}</div>
                  <div className={styles.typePairTags}>
                    {typePair.tags.map((tag, tIdx) => (
                      <span key={tIdx}>{tag}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== 7. STRATEGY TABS (IN-DEPTH APPROACH) ===================== */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.center}>
            <span className={styles.sectionTag}>In-Depth Approach</span>
            <h2 className={styles.sectionTitle}>Our Graphic Design Approach</h2>
            <p className={`${styles.sectionSub} ${styles.center}`}>
              A closer look at the exact process and thinking behind every design we deliver.
            </p>
          </div>

          <GdStrategyTabs />
        </div>
      </section>

      {/* ===================== 8. TOOLS & SOFTWARE ===================== */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <div className={styles.center}>
            <span className={styles.sectionTag}>Tools &amp; Software</span>
            <h2 className={styles.sectionTitle}>Software We Design With</h2>
            <p className={`${styles.sectionSub} ${styles.center}`}>
              Industry-standard design tools for every type of project — from logos to social media
              kits.
            </p>
          </div>

          <div className={styles.techStackGrid}>
            {techStackData.map((category, cIdx) => {
              const CatIcon = techCategoryIconMap[category.iconKey] || FaPalette;
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
                      const ToolIcon = techToolIconMap[tool.iconKey] || FaPenNib;
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

      {/* ===================== 9. WHY CHOOSE US ===================== */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.center}>
            <span className={styles.sectionTag}>Why 10 Cent Agency</span>
            <h2 className={styles.sectionTitle}>Why Work With Us</h2>
            <p className={`${styles.sectionSub} ${styles.center}`}>
              We don&apos;t just make things look nice — we design brand systems that build trust and
              recognition.
            </p>
          </div>

          <div className={styles.whyGrid}>
            {whyChooseUsData.map((card) => {
              const IconComp = whyIconMap[card.iconKey] || FaSwatchbook;
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

      {/* ===================== 10. 10 CENT AGENCY vs FREELANCER/DIY ===================== */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <div className={styles.center}>
            <span className={styles.sectionTag}>The Real Difference</span>
            <h2 className={styles.sectionTitle}>10 Cent Agency vs Freelancer/DIY Design</h2>
            <p className={`${styles.sectionSub} ${styles.center}`}>
              Cheap or free design tools can get you a logo — but not a brand system. Here&apos;s
              what actually changes with us.
            </p>
          </div>

          <div className={styles.vsGrid}>
            {/* Traditional / Freelancer */}
            <div className={`${styles.vsCol} ${styles.vsColTraditional}`}>
              <span className={styles.vsBadge}>{vsComparisonData.traditional.badge}</span>
              <div className={styles.vsColHead}>
                <div className={styles.vsColIcon}>
                  <FaXmark aria-hidden="true" />
                </div>
                <h3>{vsComparisonData.traditional.heading}</h3>
              </div>
              {vsComparisonData.traditional.points.map((point, idx) => (
                <div key={idx} className={styles.vsRow}>
                  <FaXmark className={styles.vsRowIcon} aria-hidden="true" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            {/* 10 Cent Agency */}
            <div className={`${styles.vsCol} ${styles.vsColUs}`}>
              <span className={styles.vsBadge}>{vsComparisonData.us.badge}</span>
              <div className={styles.vsColHead}>
                <div className={styles.vsColIcon}>
                  <FaCheck aria-hidden="true" />
                </div>
                <h3>{vsComparisonData.us.heading}</h3>
              </div>
              {vsComparisonData.us.points.map((point, idx) => (
                <div key={idx} className={styles.vsRow}>
                  <FaCheck className={styles.vsRowIcon} aria-hidden="true" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== 11. COMMON MISTAKES ===================== */}
      <section className={styles.section}>
        <div className={styles.container} style={{ maxWidth: '950px' }}>
          <div className={styles.center}>
            <span className={styles.sectionTag}>Avoid These Pitfalls</span>
            <h2 className={styles.sectionTitle}>5 Common Design Mistakes Businesses Make</h2>
            <p className={`${styles.sectionSub} ${styles.center}`}>
              We&apos;ve reviewed dozens of Bangladeshi business brand assets. Here&apos;s what we
              see most often.
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

      {/* ===================== 12. STATS / RESULTS ===================== */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <GdStats />
        </div>
      </section>

      {/* ===================== 13. WHAT YOU ACTUALLY RECEIVE ===================== */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <div className={styles.center}>
            <span className={styles.sectionTag}>No Confusion, Just Clarity</span>
            <h2 className={styles.sectionTitle}>What You Actually Receive</h2>
            <p className={`${styles.sectionSub} ${styles.center}`}>
              This is exactly how your final delivery folder looks — every format labeled, so you
              always know which file to use and where.
            </p>
          </div>

          <GdFileDelivery />
        </div>
      </section>

      {/* ===================== 14. PRICING ===================== */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.center}>
            <span className={styles.sectionTag}>Packages</span>
            <h2 className={styles.sectionTitle}>Choose the Right Design Package</h2>
            <p className={`${styles.sectionSub} ${styles.center}`}>
              Every brand has different needs — that&apos;s why we scope every project individually.
            </p>
          </div>

          <div className={styles.pricingGrid}>
            {pricingPackagesData.map((pkg) => (
              <div
                key={pkg.id}
                className={`${styles.priceCard} ${pkg.popular ? styles.priceCardPopular : ''}`}
              >
                {pkg.popular && <span className={styles.popularBadge}>{pkg.badge}</span>}
                {!pkg.popular && <span className={styles.badge}>{pkg.badge}</span>}
                <h3>{pkg.title}</h3>
                <p className={styles.priceNote}>{pkg.note}</p>
                <ul>
                  {pkg.bullets.map((bullet, bIdx) => (
                    <li key={bIdx}>
                      <FaCircleCheck className={styles.priceCardLiIcon} aria-hidden="true" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className={`${styles.btn} ${
                    pkg.popular ? styles.btnPrimary : styles.btnOutline
                  } ${styles.priceCardBtn}`}
                >
                  Get Custom Quote
                </Link>
              </div>
            ))}
          </div>

          {/* Pricing Note Box */}
          <div className={styles.pricingNoteBox}>
            <p>
              <FaCircleInfo className={styles.pricingNoteIcon} aria-hidden="true" />
              <span>
                Final pricing depends on scope and number of deliverables.{' '}
                <strong>
                  <Link href="/contact">Book a free consultation</Link>
                </strong>{' '}
                and we&apos;ll recommend the right package with a transparent quote.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* ===================== 15. INDUSTRIES ===================== */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <div className={styles.center}>
            <span className={styles.sectionTag}>Industries We Serve</span>
            <h2 className={styles.sectionTitle}>Design Tailored to Your Industry</h2>
          </div>

          <div className={styles.industryDescGrid}>
            {industriesData.map((industry) => {
              const IndIcon = industryIconMap[industry.iconKey] || FaUtensils;
              return (
                <div key={industry.id} className={styles.industryDescCard}>
                  <h4>
                    <IndIcon className={styles.industryDescIcon} aria-hidden="true" />
                    <span>{industry.name}</span>
                  </h4>
                  <p>{industry.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== 16. FAQ ===================== */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.center}>
            <span className={styles.sectionTag}>FAQ</span>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
            <p className={`${styles.sectionSub} ${styles.center}`}>
              Common questions about our Graphic Design services
            </p>
          </div>

          <GdFAQ />
        </div>
      </section>

      {/* ===================== 17. TESTIMONIALS ===================== */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <div className={styles.center}>
            <span className={styles.sectionTag}>Client Voices</span>
            <h2 className={styles.sectionTitle}>What Our Clients Say</h2>
          </div>

          <div className={styles.testiGrid}>
            {testimonialsData.map((testi) => {
              let avatarThemeClass = styles.avNavy;
              if (testi.avatarTheme === 'blue') {
                avatarThemeClass = styles.avBlue;
              } else if (testi.avatarTheme === 'deep') {
                avatarThemeClass = styles.avDeep;
              }

              return (
                <div key={testi.id} className={styles.testiCard}>
                  <div className={styles.testiTop}>
                    <div className={styles.testiStars} aria-label="5 out of 5 stars">
                      <FaStar aria-hidden="true" />
                      <FaStar aria-hidden="true" />
                      <FaStar aria-hidden="true" />
                      <FaStar aria-hidden="true" />
                      <FaStar aria-hidden="true" />
                    </div>
                    <span className={styles.testiTag}>{testi.badge}</span>
                  </div>
                  <p className={styles.testiQuote}>{testi.quote}</p>
                  <div className={styles.testiUser}>
                    <div
                      className={`${styles.testiAvatar} ${avatarThemeClass}`}
                      aria-hidden="true"
                    >
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
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== 18. CLOSING SUMMARY ===================== */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.closingWrap}>
            <h2 className={styles.closingTitle}>The Bottom Line</h2>
            <p className={styles.closingText}>
              Great design isn&apos;t decoration — it&apos;s how customers decide, in seconds, whether
              to trust your business. A consistent, professional visual identity compounds in value
              across every marketing channel you use.
            </p>
            <p className={styles.closingText}>
              At <strong>10 Cent Agency</strong>, we build brand systems — not one-off graphics — so
              every design works together to make your business look polished, credible, and
              unforgettable.
            </p>
          </div>
        </div>
      </section>

      {/* ===================== 19. RELATED SERVICES ===================== */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <div className={styles.center}>
            <span className={styles.sectionTag}>Explore More</span>
            <h2 className={styles.sectionTitle}>Related Services</h2>
          </div>

          <RelatedServices currentSlug="graphic-design" />
        </div>
      </section>
    </div>

    {/* ===================== CTA BANNER (Single Shared Component) ===================== */}
    <CTABanner />
  </>
);
}
