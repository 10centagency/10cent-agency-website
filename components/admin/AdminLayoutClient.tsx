'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopbar from '@/components/admin/AdminTopbar';

const pageTitles: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/portfolio': 'Portfolio',
  '/admin/submissions': 'Submissions',
  '/admin/settings': 'Settings',
};

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const title =
    pageTitles[pathname] ||
    (pathname.startsWith('/admin/portfolio/') ? 'Edit Portfolio Item' : 'Admin');

  return (
    <div className="min-h-screen bg-brand-bg">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-64">
        <AdminTopbar
          onMenuClick={() => setSidebarOpen(true)}
          title={title}
        />
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
