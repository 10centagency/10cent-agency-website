import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/supabase-admin';

export async function GET(req: NextRequest) {
  const auth = await verifyAdmin(req);
  if (!auth.authorized) {
    return auth.response;
  }

  const { supabaseAdmin } = auth;
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ posts: data });
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

  if (!body.title || !body.slug || !body.category_id) {
    return NextResponse.json({ error: 'Title, slug, and category are required' }, { status: 400 });
  }

  const payload = {
    title: String(body.title).trim(),
    slug: String(body.slug).trim().toLowerCase(),
    category_id: String(body.category_id),
    excerpt: body.excerpt ? String(body.excerpt).trim() : null,
    meta_description: body.meta_description ? String(body.meta_description).trim() : null,
    featured_image_url: body.featured_image_url ? String(body.featured_image_url) : null,
    featured_image_link: body.featured_image_link ? String(body.featured_image_link) : null,
    thumbnail_gradient_from: body.thumbnail_gradient_from || '#2F85F3',
    thumbnail_gradient_to: body.thumbnail_gradient_to || '#B6D7FF',
    content: body.content || null,
    content_blocks: Array.isArray(body.content_blocks) ? body.content_blocks : [],
    tags: Array.isArray(body.tags) ? body.tags.map(String) : [],
    is_featured: Boolean(body.is_featured),
    sort_order: typeof body.sort_order === 'number' ? body.sort_order : 0,
    status: body.status === 'published' ? 'published' : 'draft',
  };

  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .insert(payload as any)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ post: data }, { status: 201 });
}
