import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/supabase-admin';
import { verifySameOrigin } from '@/lib/csrf';
import { portfolioItemCreateSchema } from '@/lib/admin-schemas';

export async function GET(req: NextRequest) {
  const auth = await verifyAdmin(req);
  if (!auth.authorized) {
    return auth.response;
  }

  const { supabaseAdmin } = auth;
  const { data, error } = await supabaseAdmin
    .from('portfolio_items')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch portfolio items' }, { status: 500 });
  }

  return NextResponse.json({ items: data });
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

  // 3. Body parse & schema validation
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = portfolioItemCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Validation failed' }, { status: 400 });
  }

  const { supabaseAdmin } = auth;
  const { data, error } = await supabaseAdmin
    .from('portfolio_items')
    .insert(parsed.data as any)
    .select()
    .single();

  if (error) {
    console.error('[Admin Portfolio API] insert error:', error);
    if (error.code === '23505') {
      return NextResponse.json({ error: 'A portfolio item with this slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create portfolio item' }, { status: 500 });
  }

  return NextResponse.json({ item: data }, { status: 201 });
}
