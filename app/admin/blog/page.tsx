'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { BlogPost, CategoryRow } from '@/lib/database.types'
import { Plus, Trash2, CreditCard as Edit2, Search, Loader } from 'lucide-react'

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
    if (!confirm('Are you sure?')) return

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
      <div className="flex items-center justify-center h-96">
        <Loader className="w-8 h-8 text-brand-blue animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-textDark">Blog Posts</h1>
          <p className="text-brand-textMid text-sm mt-1">
            {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/admin/blog/new">
          <button className="px-6 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Post
          </button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-brand-border space-y-4">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-brand-textMid" />
          <input
            type="text"
            placeholder="Search by title or excerpt..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 border border-brand-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === null
                ? 'bg-brand-blue text-white'
                : 'bg-gray-100 text-brand-textDark hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-brand-blue text-white'
                  : 'bg-gray-100 text-brand-textDark hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-xl shadow-sm border border-brand-border overflow-hidden">
        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-brand-textMid text-sm mb-4">No posts found</p>
            <Link href="/admin/blog/new">
              <button className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90 text-sm">
                Create First Post
              </button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-border bg-gray-50">
                  <th className="px-6 py-3 text-left font-semibold text-brand-textDark">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-brand-textDark">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-brand-textDark">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-brand-textDark">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right font-semibold text-brand-textDark">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="border-b border-brand-border hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-brand-textDark truncate">
                        {post.title}
                      </div>
                      <div className="text-xs text-brand-textMid truncate">
                        {post.excerpt}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-brand-textMid">
                      {getCategoryName(post.category_id)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          post.status === 'published'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-brand-textMid">
                      {new Date(post.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/blog/${post.id}`}>
                          <button className="p-2 text-brand-blue hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          disabled={deleting === post.id}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
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
        )}
      </div>
    </div>
  )
}
