import { headers } from 'next/headers';
import { safeJsonLd } from '@/lib/url-safety';

interface JsonLdProps {
  data: unknown;
  nonce?: string;
}

/**
 * Server-side reusable component for JSON-LD structured data.
 * Automatically discovers the per-request cryptographic nonce and safely escapes data.
 */
export default async function JsonLd({ data, nonce }: JsonLdProps) {
  let scriptNonce = nonce;
  if (!scriptNonce) {
    try {
      const headersList = await headers();
      scriptNonce = headersList.get('x-nonce') || undefined;
    } catch {
      // Fallback for purely static rendering if headers() cannot be called
    }
  }

  return (
    <script
      type="application/ld+json"
      nonce={scriptNonce}
      dangerouslySetInnerHTML={{
        __html: safeJsonLd(data),
      }}
    />
  );
}
