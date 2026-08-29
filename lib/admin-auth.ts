/**
 * Admin Authentication Allowlist Helper
 *
 * Verifies if an email is authorized to access the admin area.
 * Reads comma-separated email list from process.env.ADMIN_EMAILS.
 *
 * Security: Fails closed. If ADMIN_EMAILS is missing or empty,
 * all admin access is blocked and a server-side console error is logged.
 */

export function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS;
  if (!raw || !raw.trim()) {
    console.error(
      '[Admin Auth] ADMIN_EMAILS environment variable is not configured or empty. All admin access is blocked (fail closed).'
    );
    return [];
  }

  return raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e.length > 0);
}

export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const adminEmails = getAdminEmails();
  if (adminEmails.length === 0) {
    return false;
  }

  const normalized = email.trim().toLowerCase();
  return adminEmails.includes(normalized);
}
