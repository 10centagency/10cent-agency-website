'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setSaving(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Password updated successfully.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }

    setSaving(false);
  };

  return (
    <div className="max-w-lg space-y-6">
      {/* Change Password */}
      <div className="bg-white rounded-xl border border-brand-border p-5 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-brand-blue" />
          <h2 className="text-sm font-semibold text-brand-textDark">
            Change Password
          </h2>
        </div>

        {message && (
          <div
            className={`text-sm rounded-lg px-4 py-3 ${
              message.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-textDark mb-1.5">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full px-4 py-2.5 rounded-lg border border-brand-border bg-white text-sm text-brand-textDark placeholder:text-brand-textMid/50 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors pr-11"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-textMid hover:text-brand-textDark transition-colors"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-textDark mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-4 py-2.5 rounded-lg border border-brand-border bg-white text-sm text-brand-textDark placeholder:text-brand-textMid/50 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors pr-11"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-textMid hover:text-brand-textDark transition-colors"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-brand-navy text-white text-sm font-semibold rounded-lg px-6 py-2.5 hover:bg-brand-blue transition-colors disabled:opacity-60 flex items-center gap-2"
          >
            {saving && <Loader className="w-4 h-4 animate-spin" />}
            {saving ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-xl border border-brand-border p-5 space-y-3">
        <h2 className="text-sm font-semibold text-brand-textDark">
          Account Info
        </h2>
        <div className="text-sm text-brand-textMid">
          <p>Admin access is managed through Supabase Auth.</p>
          <p className="mt-1">
            To manage users or email settings, visit the Supabase dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
