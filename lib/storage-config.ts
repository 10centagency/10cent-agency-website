/**
 * Confirmed application Storage buckets.
 * Single source of truth across client upload components, server upload API,
 * RLS policies, and documentation.
 */
export const ALLOWED_STORAGE_BUCKETS = [
  'portfolio-featured',
  'portfolio-content',
  'blog-featured',
  'blog-content',
] as const;

export type AllowedStorageBucket = (typeof ALLOWED_STORAGE_BUCKETS)[number];

export function isAllowedBucket(bucket: unknown): bucket is AllowedStorageBucket {
  return typeof bucket === 'string' && (ALLOWED_STORAGE_BUCKETS as readonly string[]).includes(bucket);
}
