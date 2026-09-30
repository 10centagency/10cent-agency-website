import React from 'react';
import Link from 'next/link';
import styles from './HomeSections.module.css';
import {
  whatWeDoHeader,
  whatWeDoServices,
  whatWeDoCta,
} from './homeSectionsData';
import HomeSectionReveal from './visuals/HomeSectionReveal.client';

function getServiceIcon(slug: string) {
  switch (slug) {
    case 'facebook-meta-marketing':
      return (
        <svg viewBox="0 0 320 512" fill="currentColor" aria-hidden="true">
          <path d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z" />
        </svg>
      );
    case 'google-ads':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
          <path d="M19.8 7.5A9 9 0 1 0 21 12" />
          <path d="M12 12h9" />
        </svg>
      );
    case 'website-development':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      );
    case 'ai-automation-chatbot':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 8V4H8" />
          <rect x="4" y="8" width="16" height="12" rx="2" />
          <path d="M2 14h2" />
          <path d="M20 14h2" />
          <path d="M15 13v2" />
          <path d="M9 13v2" />
        </svg>
      );
    case 'social-media-management':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      );
    case 'seo-aeo-geo':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
          <path d="M8.5 13.5v-2" />
          <path d="M11 13.5v-4" />
          <path d="M13.5 13.5v-1.5" />
        </svg>
      );
    case 'graphic-design':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
          <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
          <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
          <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
        </svg>
      );
    default:
      return null;
  }
}

function getTintClass(tint: string) {
  switch (tint) {
    case 'meta':
      return { tint: styles.tintMeta, acc: styles.accMeta };
    case 'google':
      return { tint: styles.tintGoogle, acc: styles.accGoogle };
    case 'web':
      return { tint: styles.tintWeb, acc: styles.accWeb };
    case 'ai':
      return { tint: styles.tintAi, acc: styles.accAi };
    case 'social':
      return { tint: styles.tintSocial, acc: styles.accSocial };
    case 'seo':
      return { tint: styles.tintSeo, acc: styles.accSeo };
    case 'design':
      return { tint: styles.tintDesign, acc: styles.accDesign };
    default:
      return { tint: '', acc: styles.accBlue };
  }
}

export default function ServicesOverview() {
  return (
    <section className={`${styles.sectionWrapper} ${styles.section} ${styles.sectionWhatWeDo}`} id="what-we-do">
      <div className={styles.container}>
        <HomeSectionReveal className={styles.sectionHead}>
          <span className={styles.sectionLabel}>{whatWeDoHeader.label}</span>
          <h2 className={styles.sectionTitle}>{whatWeDoHeader.title}</h2>
          <p className={styles.sectionDesc}>{whatWeDoHeader.description}</p>
        </HomeSectionReveal>

        <div className={styles.svcGrid}>
          {whatWeDoServices.map((service) => {
            const { tint, acc } = getTintClass(service.tint);
            return (
              <HomeSectionReveal key={service.id} delay={service.delay}>
                <Link
                  href={service.href}
                  className={`${styles.svcCard} ${tint}`}
                >
                  <div className={styles.svcTop}>
                    <span className={`${styles.svcIcon} ${acc}`}>
                      {getServiceIcon(service.slug)}
                    </span>
                    <span className={styles.svcBadge}>{service.badge}</span>
                  </div>
                  <h3 className={styles.svcCardTitle}>{service.title}</h3>
                  <p className={styles.svcCardDesc}>{service.description}</p>
                  <span className={styles.svcLink}>
                    Learn More
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
                  </span>
                </Link>
              </HomeSectionReveal>
            );
          })}

          {/* 08 · CTA card */}
          <HomeSectionReveal delay={whatWeDoCta.delay}>
            <Link
              href={whatWeDoCta.href}
              className={styles.svcCta}
              aria-label="See full service breakdowns"
            >
              <span className={styles.ctaArrow}>
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
              </span>
              <h3 className={styles.svcCtaTitle}>{whatWeDoCta.title}</h3>
              <p className={styles.svcCtaDesc}>{whatWeDoCta.description}</p>
            </Link>
          </HomeSectionReveal>
        </div>
      </div>
    </section>
  );
}
