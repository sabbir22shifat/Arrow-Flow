'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Kanban,
  Receipt,
  ArrowDownCircle,
  WalletCards,
  Settings,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    name: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: 'Leads & CRM',
    href: '/dashboard/leads',
    icon: Users,
    badge: 'Live',
  },
  {
    name: 'Pipeline (Kanban)',
    href: '/dashboard/pipeline',
    icon: Kanban,
    badge: null,
  },
  {
    name: 'Invoices & Billing',
    href: '/dashboard/invoices',
    icon: Receipt,
    badge: null,
  },
  {
    name: 'Expenses',
    href: '/dashboard/expenses',
    icon: ArrowDownCircle,
    badge: null,
  },
  {
    name: 'Payroll',
    href: '/dashboard/payroll',
    icon: WalletCards,
    badge: null,
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    badge: null,
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
      <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
        Agency Workspace
      </div>
      {navItems.map((item) => {
        const isActive =
          item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
              isActive
                ? 'bg-gradient-to-r from-sky-600/20 to-blue-600/10 text-sky-400 font-semibold border border-sky-500/20 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon
                className={cn(
                  'w-4 h-4 transition-colors',
                  isActive ? 'text-sky-400' : 'text-slate-400 group-hover:text-slate-200'
                )}
              />
              <span>{item.name}</span>
            </div>
            {item.badge && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30">
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}

      <div className="pt-6 px-3">
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-slate-900 to-slate-900/40 border border-slate-800/80 text-xs text-slate-400 space-y-2">
          <div className="flex items-center gap-2 text-sky-400 font-semibold text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Arrow OS Engine</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400">
            Powered by Neon Tech Serverless Postgres + Vercel Architecture.
          </p>
          <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium pt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Neon Serverless Connected</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
