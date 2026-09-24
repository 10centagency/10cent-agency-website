import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/supabase-admin';
import { verifySameOrigin } from '@/lib/csrf';
import { submissionPatchSchema, submissionDeleteSchema } from '@/lib/admin-schemas';

export async function GET(req: NextRequest) {
  const auth = await verifyAdmin(req);
  if (!auth.authorized) {
    return auth.response;
  }

  const { supabaseAdmin } = auth;
  const { data, error } = await supabaseAdmin
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }

  return NextResponse.json({ submissions: data });
}

export async function PATCH(req: NextRequest) {
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

  // 3. Body parse & schema validation
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = submissionPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Validation failed' }, { status: 400 });
  }

  const { supabaseAdmin } = auth;
  const { data, error } = await (supabaseAdmin.from('contact_submissions') as any)
    .update({ status: parsed.data.status })
    .eq('id', parsed.data.id)
    .select()
    .single();

  if (error) {
    console.error('[Submissions API] update error:', error);
    return NextResponse.json({ error: 'Failed to update submission' }, { status: 500 });
  }

  return NextResponse.json({ submission: data });
}

export async function DELETE(req: NextRequest) {
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

  const url = new URL(req.url);
  let id = url.searchParams.get('id');

  if (!id) {
    try {
      const body = await req.json();
      id = body?.id;
    } catch {
      // ignore
    }
  }

  const parsed = submissionDeleteSchema.safeParse({ id });
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Valid UUID id is required' }, { status: 400 });
  }

  const { supabaseAdmin } = auth;
  const { error } = await supabaseAdmin
    .from('contact_submissions')
    .delete()
    .eq('id', parsed.data.id);

  if (error) {
    console.error('[Submissions API] delete error:', error);
    return NextResponse.json({ error: 'Failed to delete submission' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
