import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/supabase-admin';
import { verifySameOrigin } from '@/lib/csrf';
import { blogPostCreateSchema } from '@/lib/admin-schemas';

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
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }

  return NextResponse.json({ posts: data });
}

export async function POST(req: NextRequest) {
  // 1. Same-origin CSRF check
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

  const parsed = blogPostCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Validation failed' }, { status: 400 });
  }

  const { supabaseAdmin } = auth;
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .insert(parsed.data as any)
    .select()
    .single();

  if (error) {
    console.error('[Admin Blog API] insert error:', error);
    if (error.code === '23505') {
      return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }

  return NextResponse.json({ post: data }, { status: 201 });
}
