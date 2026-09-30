'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, FolderOpen, FileText, Mail, Settings,
  LogOut, X, PanelLeftClose, PanelLeftOpen,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Portfolio', href: '/admin/portfolio', icon: FolderOpen },
  { label: 'Blog Posts', href: '/admin/blog', icon: FileText },
  { label: 'Submissions', href: '/admin/submissions', icon: Mail },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function AdminSidebar({ open, onClose, collapsed, onToggleCollapse }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  const isActive = (href: string) =>
    href === '/admin/dashboard' ? pathname === href : pathname.startsWith(href);

  const itemCls = (active: boolean) =>
    `flex items-center rounded-lg text-sm font-medium transition-colors duration-200 ${
      collapsed ? 'lg:justify-center lg:px-0 px-3 py-2.5 gap-3' : 'gap-3 px-3 py-2.5'
    } ${active ? 'bg-brand-blue text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`;

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onClose} />}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-brand-navy flex flex-col transition-all duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        } ${collapsed ? 'lg:w-16' : 'lg:w-64'} overflow-hidden`}
      >
        {/* Logo */}
        <div className={`flex items-center h-16 border-b border-white/10 ${
          collapsed ? 'lg:justify-center lg:px-0 px-5 justify-between' : 'justify-between px-5'}`}>
          <Link href="/admin/dashboard" onClick={onClose} className="flex items-center" title="10 Cent Agency">
            {collapsed ? (
              <>
                <span className="relative hidden lg:block h-9 w-9 overflow-hidden rounded-md">
                  <Image src="/10cent-agency-logo.webp" alt="10 Cent Agency Logo" fill
                    sizes="36px" className="object-cover object-left" priority />
                </span>
                <Image src="/10cent-agency-logo.webp" alt="10 Cent Agency Logo"
                  width={140} height={65} className="h-9 w-auto lg:hidden" priority />
              </>
            ) : (
              <Image src="/10cent-agency-logo.webp" alt="10 Cent Agency Logo"
                width={140} height={65} className="h-9 w-auto" priority />
            )}
          </Link>
          <button onClick={onClose} className="lg:hidden text-white/60 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href} onClick={onClose} title={item.label} className={itemCls(active)}>
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className={collapsed ? 'lg:hidden' : ''}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle (desktop) + Logout */}
        <div className="px-3 py-4 border-t border-white/10 space-y-1">
          <button onClick={onToggleCollapse} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={`hidden lg:flex items-center rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors duration-200 w-full ${
              collapsed ? 'lg:justify-center lg:px-0 py-2.5' : 'gap-3 px-3 py-2.5'}`}>
            {collapsed
              ? <PanelLeftOpen className="w-5 h-5 flex-shrink-0" />
              : <><PanelLeftClose className="w-5 h-5 flex-shrink-0" /><span>Collapse</span></>}
          </button>
          <button onClick={handleLogout} title="Sign Out" className={itemCls(false)}>
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className={collapsed ? 'lg:hidden' : ''}>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

