import './globals.css';
import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import Script from 'next/script';
import PublicLayout from '@/components/layout/PublicLayout';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import ScrollToTop from '@/components/layout/ScrollToTop';
import CustomCursor from '@/components/CustomCursor';
import { Toaster } from '@/components/ui/toaster';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.10centagency.com'),
  title: {
    default: '10 Cent Agency | Social Media Marketing Agency in Bangladesh',
    template: '%s | 10 Cent Agency',
  },
  description:
    '10 Cent Agency is a professional and affordable social media marketing agency in Bangladesh. We offer Facebook marketing, website development, AI automation, and more for small and medium businesses.',
  keywords: [
    'social media marketing agency in Bangladesh',
    'Facebook marketing Bangladesh',
    'digital marketing agency Dhaka',
    'affordable web design Bangladesh',
    'AI chatbot Bangladesh',
    'Meta ads agency Bangladesh',
    'website development Dhaka',
  ],
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
    shortcut: '/favicon.ico',
  },
  verification: {
    google: 'YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE',
  },
  openGraph: {
    title: '10 Cent Agency | Professional | Affordable | Unstoppable',
    description:
      'Professional digital marketing agency in Bangladesh helping small and medium businesses grow online.',
    url: 'https://www.10centagency.com',
    siteName: '10 Cent Agency',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '10 Cent Agency | Social Media Marketing Agency in Bangladesh',
    description:
      'Professional digital marketing services for small and medium businesses in Bangladesh.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://www.10centagency.com',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: '10 Cent Agency',
    description:
      'Professional and affordable social media marketing agency in Bangladesh',
    url: 'https://10centagency.com',
    telephone: '+8801410244114',
    email: 'hello@10centagency.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'East Monipur, Mirpur',
      addressLocality: 'Dhaka',
      postalCode: '1216',
      addressCountry: 'BD',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '23.8103',
      longitude: '90.4125',
    },
    openingHours: 'Sa-Th 09:00-20:00',
    priceRange: '$$',
    sameAs: [
      'https://facebook.com/10centagency',
      'https://instagram.com/10centagency',
    ],
    serviceArea: {
      '@type': 'Country',
      name: 'Bangladesh',
    },
  }

  return (
    <html lang="en" className={outfit.variable}>
      <head>
        <Script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body className={outfit.className}>
        <CustomCursor />
        <PublicLayout>
          <main>{children}</main>
        </PublicLayout>
        <WhatsAppButton />
        <ScrollToTop />
        <Toaster />
      </body>
    </html>
  );
}
