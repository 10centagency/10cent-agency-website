import 'server-only';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Returns the list of strictly allowed origins based on server-side configuration.
 * Does NOT trust client-controlled Host header or NEXT_PUBLIC_* variables.
 */
export function getAllowedOrigins(): string[] {
  const allowed = [
    'https://www.10centagency.com',
    'https://10centagency.com',
  ];

  // Server-only configured SITE_URL (e.g. from production deployment environment)
  const serverSiteUrl = process.env.SITE_URL;
  if (serverSiteUrl) {
    try {
      const parsed = new URL(serverSiteUrl);
      if (parsed.protocol === 'https:' && !allowed.includes(parsed.origin)) {
        allowed.push(parsed.origin);
      }
    } catch {
      // ignore invalid serverSiteUrl
    }
  }

  // Exact Vercel Preview host supplied by trusted system environment variable VERCEL_URL
  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) {
    const vercelOrigin = `https://${vercelUrl.replace(/^https?:\/\//, '')}`;
    if (!allowed.includes(vercelOrigin)) {
      allowed.push(vercelOrigin);
    }
  }

  // Allow explicit Vercel branch / preview pattern (only for 10cent agency deployment namespaces)
  const vercelBranchUrl = process.env.VERCEL_BRANCH_URL;
  if (vercelBranchUrl) {
    const branchOrigin = `https://${vercelBranchUrl.replace(/^https?:\/\//, '')}`;
    if (!allowed.includes(branchOrigin)) {
      allowed.push(branchOrigin);
    }
  }

  // In non-production environments (test / development), allow local development origins
  if (process.env.NODE_ENV !== 'production') {
    allowed.push('http://localhost:3000');
    allowed.push('http://127.0.0.1:3000');
  }

  return allowed;
}

/**
 * Validates whether an incoming origin string is allowed.
 * Supports exact origin matches and standard 10cent agency Vercel preview domain suffixes.
 */
export function isOriginAllowed(origin: string): boolean {
  if (!origin || typeof origin !== 'string') return false;

  const allowedOrigins = getAllowedOrigins();
  if (allowedOrigins.includes(origin)) {
    return true;
  }

  // Allow official 10cent agency project preview subdomains on vercel.app
  // Format: https://10cent-agency-website-*-10centagencys-projects.vercel.app or similar
  try {
    const parsed = new URL(origin);
    if (parsed.protocol === 'https:') {
      const hostname = parsed.hostname.toLowerCase();
      if (
        hostname.endsWith('-10centagencys-projects.vercel.app') ||
        hostname.endsWith('-10centagency.vercel.app') ||
        hostname === '10cent-agency-website.vercel.app'
      ) {
        return true;
      }
    }
  } catch {
    return false;
  }

  return false;
}

export interface OriginVerificationResult {
  allowed: boolean;
  response?: NextResponse;
}

/**
 * Enforces strict same-origin / CSRF verification for state-changing requests.
 * Rejects missing or foreign origins with 403 Forbidden.
 */
export function verifySameOrigin(req: NextRequest): OriginVerificationResult {
  // 1. Read Origin header
  const origin = req.headers.get('origin');

  if (origin) {
    if (isOriginAllowed(origin)) {
      return { allowed: true };
    }
    return {
      allowed: false,
      response: NextResponse.json(
        { error: 'Forbidden: Cross-origin request blocked.' },
        { status: 403 }
      ),
    };
  }

  // 2. Strict Referer fallback (e.g. for standard same-page form submissions where Origin is omitted)
  const referer = req.headers.get('referer');
  if (referer) {
    try {
      const refererOrigin = new URL(referer).origin;
      if (isOriginAllowed(refererOrigin)) {
        return { allowed: true };
      }
    } catch {
      // Invalid referer URL
    }
  }

  // Reject requests without valid Origin or Referer on state-changing operations
  return {
    allowed: false,
    response: NextResponse.json(
      { error: 'Forbidden: Missing or invalid origin verification.' },
      { status: 403 }
    ),
  };
}
