import type { Metadata } from "next";
import Script from "next/script";
import { Anek_Bangla } from 'next/font/google'
import "./globals.css";
import PublicLayoutWrapper from "@/components/layout/PublicLayoutWrapper";
import MetaPixel from "@/components/MetaPixel";
import { META_PIXEL_ID } from "@/lib/pixel";

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
      { url: "/favicon.svg", type: "image/svg+xml" },
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${anekBangla.variable}`}>
      <body>
        {/* ── Meta Pixel base code ─────────────────────────────────────────
            strategy="afterInteractive": loads after hydration, non-blocking.
            id="meta-pixel": Next.js deduplicates by id — can never load twice.
            fbq('init'): registers the pixel with your ID.
            fbq('track', 'PageView'): fires the initial PageView on hard load.
            MetaPixel component below handles all subsequent SPA route changes.
        ──────────────────────────────────────────────────────────────────── */}
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${META_PIXEL_ID}');
              fbq('track', 'PageView');
            `,
          }}
        />
        {/* Fires PageView on every App Router SPA navigation */}
        <MetaPixel />
        <PublicLayoutWrapper>{children}</PublicLayoutWrapper>
      </body>
    </html>
  );
}
