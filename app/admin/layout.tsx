import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import AdminLayoutClient from '@/components/admin/AdminLayoutClient';

async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

  // Database-backed admin check via public.admin_users
  try {
    const adminClient = getSupabaseAdmin();
    const { data: adminRecord, error } = await adminClient
      .from('admin_users' as any)
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error || !adminRecord) {
      redirect('/');
    }
  } catch (err) {
    console.error('[AdminLayout] Admin verification error:', err);
    redirect('/');
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}

