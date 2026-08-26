import type { IconType } from 'react-icons';
import {
  FaFacebook,
  FaGlobe,
  FaRobot,
  FaShareNodes,
  FaMagnifyingGlassChart,
  FaPalette,
  FaGoogle,
} from 'react-icons/fa6';

export interface RelatedServiceItem {
  id: string;
  slug: string;
  name: string;
  href: string;
  icon: IconType;
  description: string;
  accent: string;
}

export const servicesRegistry: RelatedServiceItem[] = [
  {
    id: 'facebook-meta-marketing',
    slug: 'facebook-meta-marketing',
    name: 'Facebook & Meta Marketing',
    href: '/services/facebook-meta-marketing',
    icon: FaFacebook,
    description: 'Grow your brand and drive high-ROI sales through Meta & Instagram ad campaigns.',
    accent: '#1877F2',
  },
  {
    id: 'website-development',
    slug: 'website-development',
    name: 'Website Development',
    href: '/services/website-development',
    icon: FaGlobe,
    description: 'Fast, responsive, and SEO-friendly websites built to convert visitors into customers.',
    accent: '#0066FF',
  },
  {
    id: 'ai-automation-chatbot',
    slug: 'ai-automation-chatbot',
    name: 'AI Automation & Chatbot',
    href: '/services/ai-automation-chatbot',
    icon: FaRobot,
    description: '24/7 lead capture, smart auto-replies, and intelligent workflow automation.',
    accent: '#7C3AED',
  },
  {
    id: 'social-media-management',
    slug: 'social-media-management',
    name: 'Social Media Management',
    href: '/services/social-media-management',
    icon: FaShareNodes,
    description: 'Consistent content creation, active community management, and brand growth.',
    accent: '#0284C7',
  },
  {
    id: 'seo-aeo-geo',
    slug: 'seo-aeo-geo',
    name: 'SEO, AEO & GEO',
    href: '/services/seo-aeo-geo',
    icon: FaMagnifyingGlassChart,
    description: 'Rank higher on Google and get cited across modern AI answer engines.',
    accent: '#059669',
  },
  {
    id: 'graphic-design',
    slug: 'graphic-design',
    name: 'Graphic Design',
    href: '/services/graphic-design',
    icon: FaPalette,
    description: 'High-converting brand identity, social creatives, and marketing visuals.',
    accent: '#DB2777',
  },
  {
    id: 'google-ads',
    slug: 'google-ads',
    name: 'Google Ads',
    href: '/services/google-ads',
    icon: FaGoogle,
    description: 'High-intent Search, Shopping, and YouTube campaigns with tracked ROI.',
    accent: '#EA4335',
  },
];

/**
 * 32-bit FNV-1a deterministic string hashing
 */
function hashString(str: string): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/**
 * Mulberry32 deterministic 32-bit PRNG generator
 */
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Deterministic seeded Fisher-Yates shuffle based on current page's slug.
 * Produces identical order on SSR and client (zero hydration mismatch).
 */
export function getRelatedServices(currentSlug: string): RelatedServiceItem[] {
  const filtered = servicesRegistry.filter((service) => service.slug !== currentSlug);
  const seed = hashString(currentSlug);
  const random = mulberry32(seed);

  const shuffled = [...filtered];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}
