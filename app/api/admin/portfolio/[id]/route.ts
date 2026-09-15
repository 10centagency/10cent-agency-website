import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/supabase-admin';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, context: RouteContext) {
  const auth = await verifyAdmin(req);
  if (!auth.authorized) {
    return auth.response;
  }

  const { id } = await context.params;
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
  const auth = await verifyAdmin(req);
  if (!auth.authorized) {
    return auth.response;
  }

  const { id } = await context.params;
  const { supabaseAdmin } = auth;

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const payload: Record<string, any> = {};
  if (body.title !== undefined) payload.title = String(body.title).trim();
  if (body.slug !== undefined) payload.slug = String(body.slug).trim().toLowerCase();
  if (body.category !== undefined) payload.category = String(body.category).trim();
  if (body.industry !== undefined) payload.industry = String(body.industry).trim();
  if (body.client_name !== undefined) payload.client_name = body.client_name ? String(body.client_name).trim() : null;
  if (body.result_highlight !== undefined) payload.result_highlight = String(body.result_highlight).trim();
  if (body.excerpt !== undefined) payload.excerpt = body.excerpt ? String(body.excerpt).trim() : null;
  if (body.meta_description !== undefined) payload.meta_description = body.meta_description ? String(body.meta_description).trim() : null;
  if (body.tags !== undefined) payload.tags = Array.isArray(body.tags) ? body.tags.map(String) : [];
  if (body.featured_image_url !== undefined) payload.featured_image_url = body.featured_image_url ? String(body.featured_image_url) : null;
  if (body.featured_image_link !== undefined) payload.featured_image_link = body.featured_image_link ? String(body.featured_image_link) : null;
  if (body.thumbnail_gradient_from !== undefined) payload.thumbnail_gradient_from = body.thumbnail_gradient_from;
  if (body.thumbnail_gradient_to !== undefined) payload.thumbnail_gradient_to = body.thumbnail_gradient_to;
  if (body.content !== undefined) payload.content = body.content;
  if (body.content_blocks !== undefined) payload.content_blocks = Array.isArray(body.content_blocks) ? body.content_blocks : [];
  if (body.is_featured !== undefined) payload.is_featured = Boolean(body.is_featured);
  if (body.sort_order !== undefined) payload.sort_order = typeof body.sort_order === 'number' ? body.sort_order : 0;
  if (body.status !== undefined) payload.status = body.status === 'published' ? 'published' : 'draft';
  payload.updated_at = new Date().toISOString();

  const { data, error } = await (supabaseAdmin.from('portfolio_items') as any)
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ item: data });
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  const auth = await verifyAdmin(req);
  if (!auth.authorized) {
    return auth.response;
  }

  const { id } = await context.params;
  const { supabaseAdmin } = auth;

  const { error } = await supabaseAdmin
    .from('portfolio_items')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
