'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { FolderOpen, Mail, Eye, Clock, Plus, ExternalLink, FileText, EyeOff } from 'lucide-react';

interface Stats {
  totalPortfolio: number;
  publishedPortfolio: number;
  draftPortfolio: number;
  totalBlog: number;
  publishedBlog: number;
  draftBlog: number;
  totalSubmissions: number;
  unreadSubmissions: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalPortfolio: 0,
    publishedPortfolio: 0,
    draftPortfolio: 0,
    totalBlog: 0,
    publishedBlog: 0,
    draftBlog: 0,
    totalSubmissions: 0,
    unreadSubmissions: 0,
  });
  const [recentPortfolio, setRecentPortfolio] = useState<
    { id: string; title: string; status: string; updated_at: string }[]
  >([]);
  const [recentBlog, setRecentBlog] = useState<
    { id: string; title: string; slug: string; status: string; created_at: string; featured_image_url: string | null }[]
  >([]);
  const [recentSubmissions, setRecentSubmissions] = useState<
    { id: string; full_name: string; service_interested: string; created_at: string; status: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const { data: { session } } =
        await supabase.auth.getSession()

      if (!session) {
        window.location.replace('/auth')
        return
      }

      fetchDashboard()
    }
    verifyAuth()
  }, []);

  async function fetchDashboard() {
    const [portfolioRes, blogRes, submissionsRes, blogCountRes, publishedBlogCountRes] = await Promise.all([
      supabase
        .from('portfolio_items')
        .select('id, title, status, updated_at')
        .order('updated_at', { ascending: false })
        .limit(5),
      supabase
        .from('blog_posts')
        .select('id, title, slug, status, created_at, featured_image_url')
        .order('created_at', { ascending: false })
        .limit(5),
      supabase
        .from('contact_submissions')
        .select('id, full_name, service_interested, created_at, status')
        .order('created_at', { ascending: false })
        .limit(5),
      supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true }),
      supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published'),
    ]);

    const allPortfolio = portfolioRes.data || [];
    const allBlog = blogRes.data || [];
    const allSubmissions = submissionsRes.data || [];
    const totalBlogCount = blogCountRes.count || 0;
    const publishedBlogCount = publishedBlogCountRes.count || 0;

    setStats({
      totalPortfolio: allPortfolio.length,
      publishedPortfolio: allPortfolio.filter((p) => p.status === 'published').length,
      draftPortfolio: allPortfolio.filter((p) => p.status === 'draft').length,
      totalBlog: totalBlogCount,
      publishedBlog: publishedBlogCount,
      draftBlog: totalBlogCount - publishedBlogCount,
      totalSubmissions: allSubmissions.length,
      unreadSubmissions: allSubmissions.filter((s) => s.status === 'unread').length,
    });

    setRecentPortfolio(allPortfolio);
    setRecentBlog(allBlog);
    setRecentSubmissions(allSubmissions);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Projects',
      value: stats.totalPortfolio,
      icon: FolderOpen,
      color: 'bg-brand-blue/10 text-brand-blue',
    },
    {
      label: 'Published',
      value: stats.publishedPortfolio,
      icon: Eye,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Drafts',
      value: stats.draftPortfolio,
      icon: Clock,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'Submissions',
      value: stats.totalSubmissions,
      icon: Mail,
      color: 'bg-rose-50 text-rose-600',
      badge: stats.unreadSubmissions > 0 ? `${stats.unreadSubmissions} new` : undefined,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Portfolio Stats Grid */}
      <div>
        <h3 className="text-sm font-semibold text-brand-textDark mb-3">Portfolio</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="bg-white rounded-xl border border-brand-border p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-brand-textMid">
                    {card.label}
                  </span>
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${card.color}`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold text-brand-textDark">
                    {card.value}
                  </span>
                  {card.badge && (
                    <span className="text-xs font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full mb-1">
                      {card.badge}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Blog Stats Grid */}
      <div>
        <h3 className="text-sm font-semibold text-brand-textDark mb-3">Blog</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-brand-border p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-brand-textMid">Total Blog Posts</span>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-brand-blue/10 text-brand-blue">
                <FileText className="w-4.5 h-4.5" />
              </div>
            </div>
            <span className="text-2xl font-bold text-brand-textDark">{stats.totalBlog}</span>
          </div>
          <div className="bg-white rounded-xl border border-brand-border p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-brand-textMid">Published Posts</span>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-emerald-50 text-emerald-600">
                <Eye className="w-4.5 h-4.5" />
              </div>
            </div>
            <span className="text-2xl font-bold text-brand-textDark">{stats.publishedBlog}</span>
          </div>
          <div className="bg-white rounded-xl border border-brand-border p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-brand-textMid">Draft Posts</span>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-amber-50 text-amber-600">
                <EyeOff className="w-4.5 h-4.5" />
              </div>
            </div>
            <span className="text-2xl font-bold text-brand-textDark">{stats.draftBlog}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/portfolio/new"
          className="inline-flex items-center gap-2 bg-brand-navy text-white text-sm font-semibold rounded-lg px-4 py-2.5 hover:bg-brand-blue transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Portfolio Item
        </Link>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 bg-brand-navy text-white text-sm font-semibold rounded-lg px-4 py-2.5 hover:bg-brand-blue transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Blog Post
        </Link>
        <Link
          href="/admin/submissions"
          className="inline-flex items-center gap-2 bg-white border border-brand-border text-brand-textDark text-sm font-medium rounded-lg px-4 py-2.5 hover:bg-brand-bgAlt transition-colors"
        >
          <Mail className="w-4 h-4" />
          View Submissions
        </Link>
        <Link
          href="/portfolio"
          target="_blank"
          className="inline-flex items-center gap-2 bg-white border border-brand-border text-brand-textMid text-sm font-medium rounded-lg px-4 py-2.5 hover:bg-brand-bgAlt transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          View Live Site
        </Link>
      </div>

      {/* Recent Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Portfolio */}
        <div className="bg-white rounded-xl border border-brand-border">
          <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
            <h2 className="text-sm font-semibold text-brand-textDark">
              Recent Portfolio
            </h2>
            <Link
              href="/admin/portfolio"
              className="text-xs font-medium text-brand-blue hover:underline"
            >
              View all
            </Link>
          </div>
          {recentPortfolio.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-brand-textMid">
              No portfolio items yet
            </div>
          ) : (
            <div className="divide-y divide-brand-border">
              {recentPortfolio.map((item) => (
                <Link
                  key={item.id}
                  href={`/admin/portfolio/${item.id}`}
                  className="flex items-center justify-between px-5 py-3 hover:bg-brand-bgAlt transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-brand-textDark truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-brand-textMid mt-0.5">
                      Updated {new Date(item.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ml-3 ${
                      item.status === 'published'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-amber-50 text-amber-600'
                    }`}
                  >
                    {item.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Blog Posts */}
        <div className="bg-white rounded-xl border border-brand-border">
          <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
            <h2 className="text-sm font-semibold text-brand-textDark">
              Recent Blog Posts
            </h2>
            <Link
              href="/admin/blog"
              className="text-xs font-medium text-brand-blue hover:underline"
            >
              View all
            </Link>
          </div>
          {recentBlog.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-brand-textMid">
              No blog posts yet
            </div>
          ) : (
            <div className="divide-y divide-brand-border">
              {recentBlog.map((post) => (
                <Link
                  key={post.id}
                  href={`/admin/blog/${post.id}`}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-brand-bgAlt transition-colors"
                >
                  {post.featured_image_url && (
                    <img
                      src={post.featured_image_url}
                      alt={post.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-brand-textDark truncate">
                      {post.title}
                    </p>
                    <p className="text-xs text-brand-textMid mt-0.5">
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
                      post.status === 'published'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-amber-50 text-amber-600'
                    }`}
                  >
                    {post.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Submissions */}
      <div className="bg-white rounded-xl border border-brand-border">
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
          <h2 className="text-sm font-semibold text-brand-textDark">
            Recent Submissions
          </h2>
          <Link
            href="/admin/submissions"
            className="text-xs font-medium text-brand-blue hover:underline"
          >
            View all
          </Link>
        </div>
        {recentSubmissions.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-brand-textMid">
            No submissions yet
          </div>
        ) : (
          <div className="divide-y divide-brand-border">
            {recentSubmissions.map((sub) => (
              <div
                key={sub.id}
                className="flex items-center justify-between px-5 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-brand-textDark truncate">
                    {sub.full_name}
                  </p>
                  <p className="text-xs text-brand-textMid mt-0.5 truncate">
                    {sub.service_interested} &middot;{' '}
                    {new Date(sub.created_at).toLocaleDateString()}
                  </p>
                </div>
                {sub.status === 'unread' && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0 ml-3" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
