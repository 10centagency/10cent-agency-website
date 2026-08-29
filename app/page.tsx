import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import HomeContent from '@/components/home/HomeContent';
import { homeFaqs } from '@/components/home/homeSectionsData';
import { getLatestBlogPosts, type HomeBlogPost } from '@/lib/blog';

export const revalidate = 3600;

export const metadata: Metadata = {
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
};

export default async function Home() {
  let blogPosts: HomeBlogPost[] = [];
  try {
    blogPosts = await getLatestBlogPosts(3);
  } catch (error) {
    console.error('Failed to load homepage blog posts:', error);
    blogPosts = [];
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "10 Cent Agency",
              "url": "https://www.10centagency.com",
              "logo": "https://www.10centagency.com/Logo.webp",
              "image": "https://www.10centagency.com/og-image.png",
              "description": "Affordable digital marketing agency in Bangladesh helping small businesses grow online with Facebook ads, websites & AI automation.",
              "telephone": "+8801615144114",
              "email": "hello@10centagency.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "East Monipur, Mirpur",
                "addressLocality": "Dhaka",
                "postalCode": "1216",
                "addressCountry": "BD"
              },
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Saturday","Sunday","Monday","Tuesday","Wednesday","Thursday"],
                  "opens": "10:00",
                  "closes": "21:00"
                }
              ],
              "sameAs": [
                "https://www.facebook.com/10centagency",
                "https://www.instagram.com/10centagency",
                "https://www.youtube.com/@10centagency",
                "https://www.linkedin.com/company/10-cent-agency"
              ],
              "priceRange": "৳৳"
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": homeFaqs.map((faq) => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.answer
                }
              }))
            }
          ])
        }}
      />
      <HeroSection />
      <HomeContent blogPosts={blogPosts} />
    </>
  );
}
