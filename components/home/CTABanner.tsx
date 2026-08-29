import { JetBrains_Mono } from 'next/font/google';
import CTABannerInteractive from './CTABannerInteractive.client';
import styles from './CTABanner.module.css';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-cta-mono',
});

export default function CTABanner() {
  return (
    <section className={`${styles.ctaSection} ${jetbrainsMono.variable} ${jetbrainsMono.className}`}>
      <div className={styles.ctaContainer}>
        <div className={styles.ctaFrame}>
          <div className={styles.ctaGlow} aria-hidden="true" />
          <CTABannerInteractive />
        </div>
      </div>
    </section>
  );
}