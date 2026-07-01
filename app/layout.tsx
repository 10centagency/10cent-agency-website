import type { Metadata } from "next";
import Script from "next/script";
import { Outfit, Anek_Bangla } from 'next/font/google'
import { LazyMotion, domAnimation } from "framer-motion";
import "./globals.css";
import PublicLayoutWrapper from "@/components/layout/PublicLayoutWrapper";
import CAPIPageView from "@/components/CAPIPageView";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import ScrollToTop from "@/components/ui/ScrollToTop";
import CustomCursor from "@/components/ui/CustomCursor";

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300','400','500','600','700','800','900'],
  variable: '--font-outfit',
  display: 'swap',
});

const anekBangla = Anek_Bangla({
  subsets: ['bengali'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-anek-bangla',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.10centagency.com'),
  title: "10 Cent Agency | Best Digital Marketing Agency in BD",
  description:
    "Affordable digital marketing agency in BD helping small businesses grow online with Facebook ads, websites & AI automation. Get a free consultation today!",
  keywords: [
    "digital marketing agency in bd",
    "best digital marketing agency in bd",
    "digital marketing agency for small business",
    "social media marketing agency Bangladesh",
  ],
  alternates: {
    canonical: "https://www.10centagency.com/",
  },
  // ✅ OPEN GRAPH — Facebook/WhatsApp share preview
  openGraph: {
    type: "website",
    url: "https://www.10centagency.com/",
    siteName: "10 Cent Agency",
    title: "10 Cent Agency | Best Digital Marketing Agency in BD",
    description:
      "Affordable digital marketing agency in BD helping small businesses grow online with Facebook ads, websites & AI automation. Get a free consultation today!",
    images: [
      {
        url: "https://www.10centagency.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "10 Cent Agency — Best Digital Marketing Agency in BD",
      },
    ],
    locale: "en_US",
  },

  // ✅ TWITTER CARD
  twitter: {
    card: "summary_large_image",
    title: "10 Cent Agency | Best Digital Marketing Agency in BD",
    description:
      "Affordable digital marketing agency in BD helping small businesses grow online with Facebook ads, websites & AI automation. Get a free consultation today!",
    images: ["https://www.10centagency.com/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
    ],
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: '#00346D',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-BD" className={`${outfit.variable} ${anekBangla.variable}`}>
      <head>
        {/* Preload critical above-the-fold image */}
        <link
          rel="preload"
          href="/Logo.webp"
          as="image"
          type="image/webp"
        />
        
        {/* Preconnect hints for external resources */}
        <link rel="preconnect" href="https://assets.calendly.com" />
        <link rel="dns-prefetch" href="https://wa.me" />
        <link rel="dns-prefetch" href="https://www.facebook.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body>
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5M652RR4');`,
          }}
        />
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5M652RR4"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded focus:shadow-lg"
        >
          Skip to main content
        </a>
        <CAPIPageView />
        <LazyMotion features={domAnimation}>
          <PublicLayoutWrapper>{children}</PublicLayoutWrapper>
        </LazyMotion>
        <WhatsAppButton />
        <ScrollToTop />
        <CustomCursor />
      </body>
    </html>
  );
}
