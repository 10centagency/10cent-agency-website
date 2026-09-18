import { z } from 'zod';
import { isSafeNavigationUrl, isSafeMediaUrl } from './url-safety';

// Canonical slug regex: lowercase alphanumeric characters and hyphens only (no trailing/leading hyphens)
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
// Hex color or rgb/rgba string
const COLOR_REGEX = /^(#(?:[0-9a-fA-F]{3,8})|rgb\([^)]+\)|rgba\([^)]+\))$/;

// Safe URL validator for navigation links
const safeNavigationUrlSchema = z
  .string()
  .max(2048)
  .refine((val) => isSafeNavigationUrl(val), {
    message: 'Must be a safe HTTPS URL or valid same-site relative path',
  });

// Safe URL validator for images/media
const safeMediaUrlSchema = z
  .string()
  .max(2048)
  .refine((val) => isSafeMediaUrl(val), {
    message: 'Must be a safe media URL from an allowed origin',
  });

// -----------------------------------------------------------------------------
// Category Schemas
// -----------------------------------------------------------------------------
export const categoryCreateSchema = z
  .object({
    name: z.string().trim().min(1, 'Category name is required').max(100),
    slug: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, 'Category slug is required')
      .max(100)
      .regex(SLUG_REGEX, 'Slug must contain only lowercase letters, numbers, and hyphens'),
    type: z.enum(['portfolio', 'blog']),
  })
  .strict();

export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>;

// -----------------------------------------------------------------------------
// Blog Post Schemas
// -----------------------------------------------------------------------------
export const blogPostCreateSchema = z
  .object({
    title: z.string().trim().min(1, 'Title is required').max(200),
    slug: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, 'Slug is required')
      .max(200)
      .regex(SLUG_REGEX, 'Slug must contain only lowercase letters, numbers, and hyphens'),
    category_id: z.string().uuid('Category ID must be a valid UUID'),
    excerpt: z.string().trim().max(1000).nullable().optional(),
    meta_description: z.string().trim().max(300).nullable().optional(),
    featured_image_url: safeMediaUrlSchema.nullable().optional(),
    featured_image_link: safeNavigationUrlSchema.nullable().optional(),
    featured_image_alt: z.string().trim().max(300).nullable().optional(),
    thumbnail_gradient_from: z.string().regex(COLOR_REGEX).default('#2F85F3'),
    thumbnail_gradient_to: z.string().regex(COLOR_REGEX).default('#B6D7FF'),
    content: z.any().nullable().optional(), // TipTap JSON document
    content_blocks: z.array(z.record(z.unknown())).max(100).default([]),
    tags: z.array(z.string().trim().max(50)).max(20).default([]),
    is_featured: z.boolean().default(false),
    sort_order: z.number().int().min(-1000).max(1000).default(0),
    status: z.enum(['published', 'draft']).default('draft'),
  })
  .strict();

export type BlogPostCreateInput = z.infer<typeof blogPostCreateSchema>;

export const blogPostUpdateSchema = blogPostCreateSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    'Update payload must contain at least one field to update'
  );

export type BlogPostUpdateInput = z.infer<typeof blogPostUpdateSchema>;

// -----------------------------------------------------------------------------
// Portfolio Item Schemas
// -----------------------------------------------------------------------------
export const portfolioItemCreateSchema = z
  .object({
    title: z.string().trim().min(1, 'Title is required').max(200),
    slug: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, 'Slug is required')
      .max(200)
      .regex(SLUG_REGEX, 'Slug must contain only lowercase letters, numbers, and hyphens'),
    category: z.string().trim().min(1, 'Category is required').max(100),
    industry: z.string().trim().max(100).default(''),
    client_name: z.string().trim().max(100).nullable().optional(),
    result_highlight: z.string().trim().max(200).default(''),
    excerpt: z.string().trim().max(1000).nullable().optional(),
    meta_description: z.string().trim().max(300).nullable().optional(),
    featured_image_url: safeMediaUrlSchema.nullable().optional(),
    featured_image_link: safeNavigationUrlSchema.nullable().optional(),
    featured_image_alt: z.string().trim().max(300).nullable().optional(),
    thumbnail_gradient_from: z.string().regex(COLOR_REGEX).default('#2F85F3'),
    thumbnail_gradient_to: z.string().regex(COLOR_REGEX).default('#B6D7FF'),
    content: z.any().nullable().optional(),
    content_blocks: z.array(z.record(z.unknown())).max(100).default([]),
    tags: z.array(z.string().trim().max(50)).max(20).default([]),
    is_featured: z.boolean().default(false),
    sort_order: z.number().int().min(-1000).max(1000).default(0),
    status: z.enum(['published', 'draft']).default('draft'),
  })
  .strict();

export type PortfolioItemCreateInput = z.infer<typeof portfolioItemCreateSchema>;

export const portfolioItemUpdateSchema = portfolioItemCreateSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    'Update payload must contain at least one field to update'
  );

export type PortfolioItemUpdateInput = z.infer<typeof portfolioItemUpdateSchema>;

// -----------------------------------------------------------------------------
// Contact Submission Schemas
// -----------------------------------------------------------------------------
export const submissionPatchSchema = z
  .object({
    id: z.string().uuid('Submission ID must be a valid UUID'),
    status: z.enum(['read', 'unread']),
  })
  .strict();

export const submissionDeleteSchema = z
  .object({
    id: z.string().uuid('Submission ID must be a valid UUID'),
  })
  .strict();

// -----------------------------------------------------------------------------
// Contact Public Submission Schema
// -----------------------------------------------------------------------------
export const ALLOWED_SERVICES = [
  'Facebook & Meta Marketing',
  'Google Ads',
  'Website Development',
  'AI Automation & Chatbot',
  'Social Media Management',
  'SEO, AEO & GEO',
  'Graphic Design',
  'Multiple Services',
  'Not Sure Yet',
  'Other',
] as const;

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^[+0-9\s\-().]{6,30}$/;

export const canonicalContactSubmissionSchema = z
  .object({
    fullName: z.string().trim().min(1, 'Full name is required').max(100, 'Full name must be at most 100 characters'),
    businessName: z.string().trim().min(1, 'Business name is required').max(100, 'Business name must be at most 100 characters'),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, 'Email is required')
      .max(254, 'Email is too long')
      .regex(EMAIL_REGEX, 'Valid email address is required'),
    whatsapp: z
      .string()
      .trim()
      .min(6, 'Valid phone/WhatsApp number is required')
      .max(30, 'Phone/WhatsApp number is too long')
      .regex(PHONE_REGEX, 'Valid phone/WhatsApp number is required'),
    service: z.string().trim().refine((s) => (ALLOWED_SERVICES as readonly string[]).includes(s), {
      message: `Service must be one of: ${ALLOWED_SERVICES.join(', ')}`,
    }),
    budget: z.string().trim().max(50).nullable().optional(),
    message: z
      .string()
      .trim()
      .min(5, 'Message must be between 5 and 5,000 characters')
      .max(5000, 'Message must be at most 5,000 characters'),
    honeypot: z.string().max(100).optional().default(''),
    turnstileToken: z.string().max(4096).optional().default(''),
  })
  .strict();

export type CanonicalContactSubmission = z.infer<typeof canonicalContactSubmissionSchema>;

export interface ContactNormalizationResult {
  success: boolean;
  data?: CanonicalContactSubmission;
  error?: string;
  fieldErrors?: Record<string, string>;
}

/**
 * Normalizes input with alias resolution (e.g. name -> fullName, phone -> whatsapp, website -> honeypot).
 * Rejects with validation error if conflicting non-empty values are supplied for any alias pair.
 */
export function normalizeContactInput(raw: unknown): ContactNormalizationResult {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return {
      success: false,
      error: 'Invalid request body format',
      fieldErrors: { form: 'Invalid request body format' },
    };
  }

  const obj = raw as Record<string, unknown>;

  // Helper to extract string safely
  const str = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');

  // 1. Alias: fullName vs name
  const rawFullName = str(obj.fullName);
  const rawName = str(obj.name);
  if (rawFullName && rawName && rawFullName !== rawName) {
    return {
      success: false,
      error: 'Conflicting values provided for name fields',
      fieldErrors: { fullName: 'Conflicting name values provided' },
    };
  }
  const resolvedFullName = rawFullName || rawName;

  // 2. Alias: businessName vs company
  const rawBusiness = str(obj.businessName);
  const rawCompany = str(obj.company);
  if (rawBusiness && rawCompany && rawBusiness !== rawCompany) {
    return {
      success: false,
      error: 'Conflicting values provided for business fields',
      fieldErrors: { businessName: 'Conflicting business name values provided' },
    };
  }
  const resolvedBusinessName = rawBusiness || rawCompany;

  // 3. Alias: whatsapp vs phone
  const rawWhatsapp = str(obj.whatsapp);
  const rawPhone = str(obj.phone);
  if (rawWhatsapp && rawPhone && rawWhatsapp !== rawPhone) {
    return {
      success: false,
      error: 'Conflicting values provided for phone fields',
      fieldErrors: { whatsapp: 'Conflicting phone values provided' },
    };
  }
  const resolvedWhatsapp = rawWhatsapp || rawPhone;

  // 4. Honeypot: website vs hp_field
  const rawWebsite = str(obj.website);
  const rawHp = str(obj.hp_field);
  if (rawWebsite && rawHp && rawWebsite !== rawHp) {
    return {
      success: false,
      error: 'Conflicting honeypot submission',
      fieldErrors: { website: 'Conflicting honeypot values' },
    };
  }
  const resolvedHoneypot = rawWebsite || rawHp;

  // 5. Parse canonical schema
  const candidate = {
    fullName: resolvedFullName,
    businessName: resolvedBusinessName,
    email: str(obj.email).toLowerCase(),
    whatsapp: resolvedWhatsapp,
    service: str(obj.service),
    budget: obj.budget !== undefined && obj.budget !== null ? str(obj.budget) : undefined,
    message: str(obj.message),
    honeypot: resolvedHoneypot,
    turnstileToken: str(obj.turnstileToken),
  };

  const parsed = canonicalContactSubmissionSchema.safeParse(candidate);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path[0] ? String(issue.path[0]) : 'form';
      if (!fieldErrors[path]) {
        fieldErrors[path] = issue.message;
      }
    }
    const firstError = parsed.error.issues[0]?.message || 'Invalid form submission data';
    return {
      success: false,
      error: firstError,
      fieldErrors,
    };
  }

  return {
    success: true,
    data: parsed.data,
  };
}

// Keep legacy export for backwards compatibility
export const contactSubmissionSchema = canonicalContactSubmissionSchema;
export type ContactSubmissionInput = CanonicalContactSubmission;
