import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/supabase-admin';
import { verifySameOrigin } from '@/lib/csrf';
import { categoryCreateSchema } from '@/lib/admin-schemas';

export async function GET(req: NextRequest) {
  const auth = await verifyAdmin(req);
  if (!auth.authorized) {
    return auth.response;
  }

  const { supabaseAdmin } = auth;
  const url = new URL(req.url);
  const type = url.searchParams.get('type');

  let query = supabaseAdmin.from('categories').select('*').order('name');
  if (type === 'portfolio' || type === 'blog') {
    query = query.eq('type', type);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }

  return NextResponse.json({ categories: data });
}

export async function POST(req: NextRequest) {
  // 1. Same-origin CSRF verification
  const csrf = verifySameOrigin(req);
  if (!csrf.allowed) {
    return csrf.response!;
  }

  // 2. Admin authorization
  const auth = await verifyAdmin(req);
  if (!auth.authorized) {
    return auth.response;
  }

  // 3. Body parse & strict schema validation
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = categoryCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Validation failed' }, { status: 400 });
  }

  const { supabaseAdmin } = auth;
  const { data, error } = await supabaseAdmin
    .from('categories')
    .insert(parsed.data as any)
    .select()
    .single();

  if (error) {
    console.error('[Categories API] insert error:', error);
    if (error.code === '23505') {
      return NextResponse.json({ error: 'A category with this slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }

  return NextResponse.json({ category: data }, { status: 201 });
}
