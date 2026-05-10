'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { PortfolioItem } from '@/lib/database.types';
import { Plus, Search, Trash2, Pencil } from 'lucide-react';

const categories = ['All', 'Meta', 'Website', 'Design', 'Automation'] as const;

export default function PortfolioListPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    const { data, error } = await supabase
      .from('portfolio_items')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!error && data) setItems(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    setDeleting(id);
    await supabase.from('portfolio_items').delete().eq('id', id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    setDeleting(null);
  };

  const filtered = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.client_name?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-sm text-brand-textMid">
            {items.length} total item{items.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/admin/portfolio/new"
          className="inline-flex items-center gap-2 bg-brand-navy text-white text-sm font-semibold rounded-lg px-4 py-2.5 hover:bg-brand-blue transition-colors self-start"
        >
          <Plus className="w-4 h-4" />
          Add New Item
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-textMid" />
          <input
            type="text"
            placeholder="Search by title or client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-brand-border bg-white text-sm text-brand-textDark placeholder:text-brand-textMid/50 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                categoryFilter === cat
                  ? 'bg-brand-blue text-white'
                  : 'bg-white border border-brand-border text-brand-textMid hover:text-brand-textDark'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-brand-border p-12 text-center">
          <p className="text-sm text-brand-textMid">
            {items.length === 0
              ? 'No portfolio items yet. Create your first one!'
              : 'No items match your search.'}
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
                    Client
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-brand-textMid hidden lg:table-cell">
                    Status
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-brand-textMid hidden lg:table-cell">
                    Featured
                  </th>
                  <th className="text-right px-5 py-3 font-medium text-brand-textMid">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-brand-bgAlt/30 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {item.featured_image_url && (
                          <div
                            className="w-10 h-10 rounded-lg bg-cover bg-center flex-shrink-0"
                            style={{
                              backgroundImage: `url(${item.featured_image_url})`,
                            }}
                          />
                        )}
                        <span className="font-medium text-brand-textDark truncate max-w-[200px]">
                          {item.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-brand-bgAlt text-brand-textMid">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-brand-textMid hidden md:table-cell truncate max-w-[150px]">
                      {item.client_name || '—'}
                    </td>
                    <td className="px-5 py-3 hidden lg:table-cell">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          item.status === 'published'
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-amber-50 text-amber-600'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 hidden lg:table-cell">
                      {item.is_featured ? (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-brand-blue/10 text-brand-blue">
                          Featured
                        </span>
                      ) : (
                        <span className="text-brand-textMid">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/portfolio/${item.id}`}
                          className="p-2 rounded-lg text-brand-textMid hover:text-brand-blue hover:bg-brand-blue/5 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deleting === item.id}
                          className="p-2 rounded-lg text-brand-textMid hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
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
  );
}
