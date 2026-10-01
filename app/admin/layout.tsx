import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import AdminLayoutClient from '@/components/admin/AdminLayoutClient';

async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Cannot set cookies directly from Server Component layout
          }
        },
      },
    }
  );
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth');
  }

  let isAdmin = false;
  try {
    const { data: rpcResult, error: rpcError } = await supabase.rpc('is_admin');
    if (!rpcError && rpcResult === true) {
      isAdmin = true;
    } else if (rpcError) {
      console.error('[AdminLayout] is_admin RPC error:', rpcError.message);
    }
  } catch (err) {
    console.error('[AdminLayout] admin verification exception:', err);
  }

  if (!isAdmin) {
    redirect('/');
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}

