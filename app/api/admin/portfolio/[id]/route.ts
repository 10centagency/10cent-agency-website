import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/supabase-admin';
import { verifySameOrigin } from '@/lib/csrf';
import { portfolioItemUpdateSchema } from '@/lib/admin-schemas';
import { z } from 'zod';

interface RouteContext {
  params: Promise<{ id: string }>;
}

const idSchema = z.string().uuid('Invalid portfolio item ID');

export async function GET(req: NextRequest, context: RouteContext) {
  const auth = await verifyAdmin(req);
  if (!auth.authorized) {
    return auth.response;
  }

  const { id } = await context.params;
  const idParsed = idSchema.safeParse(id);
  if (!idParsed.success) {
    return NextResponse.json({ error: idParsed.error.issues[0]?.message }, { status: 400 });
  }

  const { supabaseAdmin } = auth;
  const { data, error } = await supabaseAdmin
    .from('portfolio_items')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Portfolio item not found' }, { status: 404 });
  }

  return NextResponse.json({ item: data });
}

export async function PUT(req: NextRequest, context: RouteContext) {
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

  const { id } = await context.params;
  const idParsed = idSchema.safeParse(id);
  if (!idParsed.success) {
    return NextResponse.json({ error: idParsed.error.issues[0]?.message }, { status: 400 });
  }

  // 3. Body parse & schema validation
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = portfolioItemUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Validation failed' }, { status: 400 });
  }

  const payload: Record<string, any> = {
    ...parsed.data,
    updated_at: new Date().toISOString(),
  };

  const { supabaseAdmin } = auth;
  const { data, error } = await (supabaseAdmin.from('portfolio_items') as any)
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[Admin Portfolio API] update error:', error);
    if (error.code === '23505') {
      return NextResponse.json({ error: 'A portfolio item with this slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to update portfolio item' }, { status: 500 });
  }

  return NextResponse.json({ item: data });
}

export async function DELETE(req: NextRequest, context: RouteContext) {
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

  const { id } = await context.params;
  const idParsed = idSchema.safeParse(id);
  if (!idParsed.success) {
    return NextResponse.json({ error: idParsed.error.issues[0]?.message }, { status: 400 });
  }

  const { supabaseAdmin } = auth;
  const { error } = await supabaseAdmin
    .from('portfolio_items')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[Admin Portfolio API] delete error:', error);
    return NextResponse.json({ error: 'Failed to delete portfolio item' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
