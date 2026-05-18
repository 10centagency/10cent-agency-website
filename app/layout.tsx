import type { Metadata } from "next";
import "./globals.css"; // Keep global styles
import PublicLayoutWrapper from "@/components/layout/PublicLayoutWrapper";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.10centagency.com"),
  title: {
    default: "10 Cent Agency",
    template: "%s | 10 Cent Agency",
  },
  description: "10 Cent Agency - Social Media Marketing Agency in Bangladesh.",
  alternates: {
    canonical: "/",
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
    <html lang="en">
      <body>
        <PublicLayoutWrapper>{children}</PublicLayoutWrapper>
      </body>
    </html>
  );
}