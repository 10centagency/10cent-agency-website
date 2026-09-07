'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopbar from '@/components/admin/AdminTopbar';

const pageTitles: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/portfolio': 'Portfolio',
  '/admin/submissions': 'Submissions',
  '/admin/settings': 'Settings',
};

const STORAGE_KEY = 'admin-sidebar-collapsed';

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);      // mobile drawer
  const [collapsed, setCollapsed] = useState(true);           // desktop: icon rail by default

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) setCollapsed(saved === '1');
    } catch { /* ignore */ }
  }, []);

  const toggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try { localStorage.setItem(STORAGE_KEY, next ? '1' : '0'); } catch { /* ignore */ }
      return next;
    });
  };

  const pathname = usePathname();
  const title =
    pageTitles[pathname] ||
    (pathname.startsWith('/admin/portfolio/') ? 'Edit Portfolio Item' : 'Admin');

  return (
    <div className="min-h-screen bg-brand-bg">
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={toggleCollapse}
      />
      <div className={`transition-all duration-300 ${collapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        <AdminTopbar
          onMenuClick={() => setSidebarOpen(true)}
          onToggleSidebar={toggleCollapse}
          title={title}
        />
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
