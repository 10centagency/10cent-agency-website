import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/supabase-admin';

export async function GET(req: NextRequest) {
  const auth = await verifyAdmin(req);
  if (!auth.authorized) {
    return auth.response;
  }

  const { supabaseAdmin } = auth;

  try {
    const [portfolioRes, blogRes, submissionsRes, blogCountRes, publishedBlogCountRes] = await Promise.all([
      supabaseAdmin
        .from('portfolio_items')
        .select('id, title, status, updated_at')
        .order('updated_at', { ascending: false })
        .limit(5),
      supabaseAdmin
        .from('blog_posts')
        .select('id, title, slug, status, created_at, featured_image_url')
        .order('created_at', { ascending: false })
        .limit(5),
      supabaseAdmin
        .from('contact_submissions')
        .select('id, full_name, service_interested, created_at, status')
        .order('created_at', { ascending: false })
        .limit(5),
      supabaseAdmin
        .from('blog_posts')
        .select('*', { count: 'exact', head: true }),
      supabaseAdmin
        .from('blog_posts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published'),
    ]);

    const [portfolioCountRes, publishedPortfolioCountRes, submissionsCountRes, unreadSubmissionsCountRes] = await Promise.all([
      supabaseAdmin.from('portfolio_items').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('portfolio_items').select('*', { count: 'exact', head: true }).eq('status', 'published'),
      supabaseAdmin.from('contact_submissions').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('contact_submissions').select('*', { count: 'exact', head: true }).eq('status', 'unread'),
    ]);

    const totalPortfolio = portfolioCountRes.count || 0;
    const publishedPortfolio = publishedPortfolioCountRes.count || 0;
    const totalBlog = blogCountRes.count || 0;
    const publishedBlog = publishedBlogCountRes.count || 0;
    const totalSubmissions = submissionsCountRes.count || 0;
    const unreadSubmissions = unreadSubmissionsCountRes.count || 0;

    return NextResponse.json({
      stats: {
        totalPortfolio,
        publishedPortfolio,
        draftPortfolio: totalPortfolio - publishedPortfolio,
        totalBlog,
        publishedBlog,
        draftBlog: totalBlog - publishedBlog,
        totalSubmissions,
        unreadSubmissions,
      },
      recentPortfolio: portfolioRes.data || [],
      recentBlog: blogRes.data || [],
      recentSubmissions: submissionsRes.data || [],
    });
  } catch (err: any) {
    console.error('[Admin Dashboard API] error:', err);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
