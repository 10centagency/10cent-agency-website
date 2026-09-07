'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { BlogPost, CategoryRow } from '@/lib/database.types'
import { Plus, Trash2, Pencil, Search, Loader } from 'lucide-react'

export default function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<CategoryRow[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const [postsRes, catsRes] = await Promise.all([
      supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false }),
      supabase
        .from('categories')
        .select('*')
        .eq('type', 'blog')
        .order('name'),
    ])

    if (postsRes.data) setPosts(postsRes.data as BlogPost[])
    if (catsRes.data) setCategories(catsRes.data as CategoryRow[])
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    setDeleting(id)
    const { error } = await supabase.from('blog_posts').delete().eq('id', id)

    if (!error) {
      setPosts(posts.filter((p) => p.id !== id))
    }
    setDeleting(null)
  }

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory =
      !selectedCategory || post.category_id === selectedCategory

    return matchesSearch && matchesCategory
  })

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || 'Uncategorized'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-sm text-brand-textMid">
            {posts.length} total post{posts.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 bg-brand-navy text-white text-sm font-semibold rounded-lg px-4 py-2.5 hover:bg-brand-blue transition-colors self-start"
        >
          <Plus className="w-4 h-4" />
          Add New Post
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-textMid" />
          <input
            type="text"
            placeholder="Search by title or excerpt..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-brand-border bg-white text-sm text-brand-textDark placeholder:text-brand-textMid/50 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              selectedCategory === null
                ? 'bg-brand-blue text-white'
                : 'bg-white border border-brand-border text-brand-textMid hover:text-brand-textDark'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-brand-blue text-white'
                  : 'bg-white border border-brand-border text-brand-textMid hover:text-brand-textDark'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Table */}
      {filteredPosts.length === 0 ? (
        <div className="bg-white rounded-xl border border-brand-border p-12 text-center">
          <p className="text-sm text-brand-textMid">
            {posts.length === 0
              ? 'No blog posts yet. Create your first one!'
              : 'No posts match your search.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-brand-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-border bg-brand-bgAlt/50">
                  <th className="text-left px-5 py-3 font-medium text-brand-textMid">
                    Title
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-brand-textMid hidden sm:table-cell">
                    Category
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-brand-textMid hidden md:table-cell">
                    Status
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-brand-textMid hidden lg:table-cell">
                    Date
                  </th>
                  <th className="text-right px-5 py-3 font-medium text-brand-textMid">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {filteredPosts.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-brand-bgAlt/30 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <span className="font-medium text-brand-textDark truncate max-w-[240px] block">
                        {post.title}
                      </span>
                      {post.excerpt && (
                        <span className="text-xs text-brand-textMid truncate max-w-[240px] block">
                          {post.excerpt}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-bgAlt text-brand-textMid">
                        {getCategoryName(post.category_id)}
                      </span>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          post.status === 'published'
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-amber-50 text-amber-600'
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-brand-textMid whitespace-nowrap hidden lg:table-cell">
                      {new Date(post.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/blog/${post.id}`}
                          className="p-1.5 text-brand-textMid hover:text-brand-blue hover:bg-brand-bgAlt rounded-lg transition-colors"
                          title="Edit post"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          disabled={deleting === post.id}
                          className="p-1.5 text-brand-textMid hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete post"
                        >
                          {deleting === post.id ? (
                            <Loader className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
