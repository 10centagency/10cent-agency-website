import React from 'react';
import Link from 'next/link';
import styles from './HomeSections.module.css';
import {
  addOnServicesHeader,
  addOnServices,
} from './homeSectionsData';
import HomeSectionReveal from './visuals/HomeSectionReveal.client';

function getAddOnIcon(slug: string) {
  switch (slug) {
    case 'google-ads':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
          <path d="M19.8 7.5A9 9 0 1 0 21 12" />
          <path d="M12 12h9" />
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
    default:
      return null;
  }
}

function getAddOnStyles(tint: string) {
  switch (tint) {
    case 'google':
      return { tint: styles.tintGoogle, acc: styles.accGoogle };
    case 'seo':
      return { tint: styles.tintSeo, acc: styles.accSeo };
    case 'design':
      return { tint: styles.tintDesign, acc: styles.accDesign };
    case 'social':
      return { tint: styles.tintSocial, acc: styles.accSocial };
    default:
      return { tint: '', acc: styles.accBlue };
  }
}

export default function AddOnServices() {
  return (
    <section className={`${styles.sectionWrapper} ${styles.section} ${styles.sectionAddon}`} id="additional-services">
      <div className={styles.container}>
        <HomeSectionReveal className={styles.sectionHead}>
          <span className={styles.sectionLabel}>{addOnServicesHeader.label}</span>
          <h2 className={styles.sectionTitle}>{addOnServicesHeader.title}</h2>
          <p className={styles.sectionDesc}>{addOnServicesHeader.description}</p>
        </HomeSectionReveal>

        <div className={styles.addonGrid}>
          {addOnServices.map((service) => {
            const { tint, acc } = getAddOnStyles(service.tint);

            return (
              <HomeSectionReveal key={service.id} delay={service.delay}>
                <Link
                  href={service.href}
                  className={`${styles.addonCard} ${tint}`}
                >
                  <div className={styles.addonTop}>
                    <span className={`${styles.addonIcon} ${acc}`}>
                      {getAddOnIcon(service.slug)}
                    </span>
                    <span className={styles.addonBadge}>
                      {service.badge}
                    </span>
                  </div>
                  <h3 className={styles.addonCardTitle}>{service.title}</h3>
                  <p className={styles.addonCardDesc}>{service.description}</p>
                  <span className={styles.addonLink}>
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
        </div>
      </div>
    </section>
  );
}
