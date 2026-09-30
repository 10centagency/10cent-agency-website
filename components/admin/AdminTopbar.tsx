'use client';
import { Menu, PanelLeft } from 'lucide-react';

interface AdminTopbarProps {
  onMenuClick: () => void;
  onToggleSidebar: () => void;
  title: string;
}

export default function AdminTopbar({ onMenuClick, onToggleSidebar, title }: AdminTopbarProps) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-brand-border flex items-center px-4 sm:px-6">
      <button onClick={onMenuClick} aria-label="Open menu"
        className="lg:hidden p-2 rounded-lg text-brand-textMid hover:text-brand-textDark hover:bg-brand-bgAlt transition-colors mr-3">
        <Menu className="w-5 h-5" />
      </button>
      <button onClick={onToggleSidebar} aria-label="Toggle sidebar" title="Toggle sidebar"
        className="hidden lg:inline-flex p-2 rounded-lg text-brand-textMid hover:text-brand-textDark hover:bg-brand-bgAlt transition-colors mr-3">
        <PanelLeft className="w-5 h-5" />
      </button>
      <h1 className="text-lg font-semibold text-brand-textDark">{title}</h1>
    </header>
  );
}

