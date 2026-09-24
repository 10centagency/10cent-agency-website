import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import type { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
}

/**
 * Server-only service-role Supabase client.
 * Bypasses RLS for authorized admin operations and server-verified writes.
 */
export function getSupabaseAdmin() {
  if (!supabaseServiceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured on the server');
  }
  return createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export type AdminVerificationResult =
  | { authorized: true; user: { id: string; email?: string }; supabaseAdmin: ReturnType<typeof getSupabaseAdmin> }
  | { authorized: false; response: NextResponse };

/**
 * Verifies that the incoming request has a valid Supabase authenticated session
 * AND that the authenticated user is listed in public.admin_users.
 */
export async function verifyAdmin(req: NextRequest): Promise<AdminVerificationResult> {
  const supabase = createServerClient(
    supabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll() {
          // No-op for read verification in API route
        },
      },
    }
  );

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Unauthorized: Authentication session required.' },
        { status: 401 }
      ),
    };
  }

  // Verify real admin membership in public.admin_users using server admin client
  const adminClient = getSupabaseAdmin();
  const { data: adminRecord, error: adminError } = await adminClient
    .from('admin_users' as any)
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (adminError || !adminRecord) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Forbidden: Admin authorization required.' },
        { status: 403 }
      ),
    };
  }

  return {
    authorized: true,
    user: { id: user.id, email: user.email },
    supabaseAdmin: adminClient,
  };
}
