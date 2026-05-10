'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { ContactSubmission } from '@/lib/database.types';
import {
  Search,
  Download,
  X,
  Mail,
  Phone,
  Building2,
  MessageSquare,
  Eye,
  EyeOff,
  Trash2,
} from 'lucide-react';

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [selected, setSelected] = useState<ContactSubmission | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async () => {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setSubmissions(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'unread' ? 'read' : 'unread';
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
    if (selected?.id === id) {
      setSelected({ ...selected, status: newStatus });
    }
    await supabase
      .from('contact_submissions')
      .update({ status: newStatus })
      .eq('id', id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this submission?')) return;
    setDeleting(id);
    await supabase.from('contact_submissions').delete().eq('id', id);
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
    if (selected?.id === id) setSelected(null);
    setDeleting(null);
  };

  const downloadCSV = () => {
    const headers = [
      'Name',
      'Business',
      'Email',
      'WhatsApp',
      'Service',
      'Budget',
      'Message',
      'Status',
      'Date',
    ];
    const rows = filtered.map((s) => [
      s.full_name,
      s.business_name,
      s.email,
      s.whatsapp,
      s.service_interested,
      s.budget_range,
      `"${s.message.replace(/"/g, '""')}"`,
      s.status,
      new Date(s.created_at).toLocaleDateString(),
    ]);

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `submissions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = submissions.filter((s) => {
    const matchesSearch =
      s.full_name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.business_name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const unreadCount = submissions.filter((s) => s.status === 'unread').length;

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
            {submissions.length} total &middot; {unreadCount} unread
          </p>
        </div>
        {submissions.length > 0 && (
          <button
            onClick={downloadCSV}
            className="inline-flex items-center gap-2 bg-white border border-brand-border text-brand-textDark text-sm font-medium rounded-lg px-4 py-2.5 hover:bg-brand-bgAlt transition-colors self-start"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-textMid" />
          <input
            type="text"
            placeholder="Search by name, email, or business..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-brand-border bg-white text-sm text-brand-textDark placeholder:text-brand-textMid/50 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors"
          />
        </div>
        <div className="flex gap-1.5">
          {(['all', 'unread', 'read'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors capitalize ${
                statusFilter === s
                  ? 'bg-brand-blue text-white'
                  : 'bg-white border border-brand-border text-brand-textMid hover:text-brand-textDark'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-brand-border p-12 text-center">
          <p className="text-sm text-brand-textMid">
            {submissions.length === 0
              ? 'No submissions yet.'
              : 'No submissions match your search.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((sub) => (
            <div
              key={sub.id}
              className={`bg-white rounded-xl border transition-colors cursor-pointer ${
                sub.status === 'unread'
                  ? 'border-brand-blue/30 bg-brand-blue/[0.02]'
                  : 'border-brand-border'
              }`}
              onClick={() => setSelected(sub)}
            >
              <div className="flex items-center gap-4 px-5 py-4">
                {/* Unread indicator */}
                <div className="flex-shrink-0">
                  {sub.status === 'unread' ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-blue block" />
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-border block" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-brand-textDark truncate">
                      {sub.full_name}
                    </span>
                    {sub.status === 'unread' && (
                      <span className="text-[10px] font-semibold text-brand-blue bg-brand-blue/10 px-1.5 py-0.5 rounded-full flex-shrink-0">
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-brand-textMid mt-0.5 truncate">
                    {sub.business_name} &middot; {sub.service_interested} &middot;{' '}
                    {new Date(sub.created_at).toLocaleDateString()}
                  </p>
                </div>

                {/* Actions */}
                <div
                  className="flex items-center gap-1 flex-shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => toggleStatus(sub.id, sub.status)}
                    className="p-2 rounded-lg text-brand-textMid hover:text-brand-blue hover:bg-brand-blue/5 transition-colors"
                    title={sub.status === 'unread' ? 'Mark as read' : 'Mark as unread'}
                  >
                    {sub.status === 'unread' ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(sub.id)}
                    disabled={deleting === sub.id}
                    className="p-2 rounded-lg text-brand-textMid hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border sticky top-0 bg-white rounded-t-2xl">
              <h2 className="text-base font-semibold text-brand-textDark">
                Submission Details
              </h2>
              <button
                onClick={() => setSelected(null)}
                className="p-1.5 rounded-lg text-brand-textMid hover:text-brand-textDark hover:bg-brand-bgAlt transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <DetailRow
                icon={<Mail className="w-4 h-4" />}
                label="Email"
                value={selected.email}
              />
              <DetailRow
                icon={<Phone className="w-4 h-4" />}
                label="WhatsApp"
                value={selected.whatsapp}
              />
              <DetailRow
                icon={<Building2 className="w-4 h-4" />}
                label="Business"
                value={selected.business_name}
              />
              <DetailRow
                icon={<MessageSquare className="w-4 h-4" />}
                label="Service"
                value={selected.service_interested}
              />
              <div>
                <p className="text-xs font-medium text-brand-textMid mb-1">
                  Budget Range
                </p>
                <p className="text-sm text-brand-textDark">
                  {selected.budget_range || 'Not specified'}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-brand-textMid mb-1">
                  Message
                </p>
                <p className="text-sm text-brand-textDark whitespace-pre-wrap">
                  {selected.message}
                </p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-brand-border">
                <p className="text-xs text-brand-textMid">
                  Submitted {new Date(selected.created_at).toLocaleString()}
                </p>
                <button
                  onClick={() => toggleStatus(selected.id, selected.status)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                    selected.status === 'unread'
                      ? 'bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/20'
                      : 'bg-brand-bgAlt text-brand-textMid hover:bg-brand-border'
                  }`}
                >
                  {selected.status === 'unread'
                    ? 'Mark as Read'
                    : 'Mark as Unread'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-brand-textMid mt-0.5">{icon}</span>
      <div>
        <p className="text-xs font-medium text-brand-textMid">{label}</p>
        <p className="text-sm text-brand-textDark">{value}</p>
      </div>
    </div>
  );
}
