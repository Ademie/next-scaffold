'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MessageSquare,
  Kanban,
  FileText,
  Users,
  Layers,
  Settings,
  ChevronDown,
  LogOut,
  LogIn,
  Menu,
  X,
} from 'lucide-react';
import { signOutAction } from '@/features/auth/actions';

interface AppShellProps {
  children: React.ReactNode;
  user?: {
    name: string;
    role: string;
    organizationName: string;
  } | null;
}

export function AppShell({ children, user }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Feedback', href: '/feedback', icon: MessageSquare },
    { label: 'Roadmap', href: '/roadmap', icon: Kanban },
    { label: 'Changelog', href: '/changelog', icon: FileText },
  ];

  const manageItems = [
    { label: 'Team', href: '/dashboard', icon: Users },
    { label: 'Boards', href: '/roadmap', icon: Layers },
    { label: 'Settings', href: '/dashboard', icon: Settings },
  ];

  const isCurrentActive = (href: string) => {
    if (href === '/feedback' && pathname.startsWith('/posts')) return true;
    return pathname === href;
  };

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full p-4">
      <div>
        {/* Org Switcher Header */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-base-200/50 border border-base-200 mb-6 shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-primary-content font-bold text-xs shadow-xs">
              {user ? user.organizationName.charAt(0) : 'FP'}
            </span>
            <div className="min-w-0">
              <span className="font-semibold text-xs text-base-content block truncate">
                {user ? user.organizationName : 'FeaturePulse'}
              </span>
              <span className="text-[10px] text-base-content/50 block">Product Workspace</span>
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-base-content/50 shrink-0" />
        </div>

        {/* Primary Navigation */}
        <div className="mb-6">
          <span className="block px-3 text-[10px] font-bold text-base-content/40 uppercase tracking-wider mb-2">
            Main
          </span>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isCurrentActive(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-primary text-primary-content shadow-xs'
                      : 'text-base-content/70 hover:text-base-content hover:bg-base-200/60'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Manage Section */}
        <div>
          <span className="block px-3 text-[10px] font-bold text-base-content/40 uppercase tracking-wider mb-2">
            Manage
          </span>
          <nav className="flex flex-col gap-1">
            {manageItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-base-content/70 hover:text-base-content hover:bg-base-200/60 transition-colors"
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Profile / Auth Action (Bottom) */}
      <div className="pt-4 border-t border-base-200">
        {user ? (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                {user.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <span className="block font-semibold text-xs text-base-content truncate">
                  {user.name}
                </span>
                <span className="badge badge-neutral badge-xs font-medium text-[9px] uppercase">
                  {user.role}
                </span>
              </div>
            </div>

            <form action={signOutAction}>
              <button
                type="submit"
                aria-label="Sign out"
                className="btn btn-ghost btn-circle btn-xs text-base-content/60 hover:text-error"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        ) : (
          <Link
            href="/login"
            onClick={() => setMobileOpen(false)}
            className="btn btn-neutral btn-sm w-full gap-2 rounded-xl font-medium text-xs shadow-xs"
          >
            <LogIn className="w-3.5 h-3.5" />
            Sign in
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-base-100">
      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-40 bg-base-100 border-b border-base-200 h-14 px-4 flex items-center justify-between">
        <button
          onClick={() => setMobileOpen(true)}
          className="btn btn-ghost btn-square btn-sm text-base-content/80"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link href="/feedback" className="flex items-center gap-2 font-bold text-sm text-base-content">
          <span className="w-6 h-6 rounded-md bg-primary flex items-center justify-center text-primary-content font-black text-xs">
            FP
          </span>
          <span>FeaturePulse</span>
        </Link>

        {user ? (
          <div className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
            {user.name.charAt(0)}
          </div>
        ) : (
          <Link href="/login" className="btn btn-neutral btn-xs rounded-lg px-2.5">
            Sign in
          </Link>
        )}
      </header>

      {/* Mobile Backdrop & Drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs md:hidden animate-in fade-in duration-150"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="w-72 max-w-[80vw] h-full bg-base-100 shadow-2xl flex flex-col relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="btn btn-ghost btn-circle btn-sm absolute right-3 top-3 text-base-content/60"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop Sticky Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 border-r border-base-200 bg-base-100 min-h-screen sticky top-0 h-screen">
        {sidebarContent}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
