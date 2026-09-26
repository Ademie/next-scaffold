'use client';

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
} from 'lucide-react';
import { signOutAction } from '@/features/auth/actions';

interface SidebarProps {
  userName?: string;
  userRole?: string;
  orgName?: string;
}

export function DashboardSidebar({
  userName = 'John Carter',
  userRole = 'Admin',
  orgName = 'Acme Inc.',
}: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Feedback', href: '/feedback', icon: MessageSquare },
    { label: 'Roadmap', href: '/roadmap', icon: Kanban },
    { label: 'Changelog', href: '/changelog', icon: FileText },
  ];

  const manageItems = [
    { label: 'Team', href: '#', icon: Users },
    { label: 'Boards', href: '#', icon: Layers },
    { label: 'Settings', href: '#', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-base-200 bg-base-100 flex flex-col justify-between p-4 shrink-0 min-h-screen">
      <div>
        {/* Org Switcher Header */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-base-200/50 border border-base-200 mb-6">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-6 h-6 rounded-md bg-primary flex items-center justify-center text-primary-content font-bold text-xs">
              A
            </span>
            <span className="font-semibold text-sm text-base-content truncate">
              {orgName}
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-base-content/50" />
        </div>

        {/* Primary Navigation */}
        <div className="mb-6">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-base-content/70 hover:text-base-content hover:bg-base-200/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
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
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => e.preventDefault()}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-base-content/70 hover:text-base-content hover:bg-base-200/50 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Profile & Sign Out Row (Bottom) */}
      <div className="pt-4 border-t border-base-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0">
            JC
          </div>
          <div className="min-w-0">
            <span className="block font-semibold text-xs text-base-content truncate">
              {userName}
            </span>
            <span className="badge badge-neutral badge-xs font-medium text-[9px] uppercase">
              {userRole}
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
    </aside>
  );
}
