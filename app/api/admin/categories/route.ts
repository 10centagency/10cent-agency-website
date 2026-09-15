import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/supabase-admin';

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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ categories: data });
}

export async function POST(req: NextRequest) {
  const auth = await verifyAdmin(req);
  if (!auth.authorized) {
    return auth.response;
  }

  const { supabaseAdmin } = auth;
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.name || !body.slug || !body.type) {
    return NextResponse.json({ error: 'Name, slug, and type are required' }, { status: 400 });
  }

  if (body.type !== 'portfolio' && body.type !== 'blog') {
    return NextResponse.json({ error: 'Type must be portfolio or blog' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('categories')
    .insert({
      name: String(body.name).trim(),
      slug: String(body.slug).trim().toLowerCase(),
      type: body.type,
    } as any)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ category: data }, { status: 201 });
}
