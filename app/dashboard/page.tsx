import {
  getDashboardMetrics,
  getRecentLeads,
  getAllLeads,
  getAllInvoices,
} from '@/lib/data';
import { ExecutiveStatCards } from '@/components/ExecutiveStatCards';
import { RecentLeadsTable } from '@/components/RecentLeadsTable';
import { QuickAddLeadForm } from '@/components/QuickAddLeadForm';
import { formatCurrency } from '@/lib/utils';
import {
  Sparkles,
  TrendingUp,
  Target,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Megaphone,
  Monitor,
  CalendarCheck,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0; // Dynamic server component

export default async function DashboardOverviewPage() {
  const metrics = await getDashboardMetrics();
  const recentLeads = await getRecentLeads(6);
  const allLeads = await getAllLeads();
  const allInvoices = await getAllInvoices();

  // Calculate domain distribution
  const domainCounts = {
    'BTL & Activation': allLeads.filter((l) => l.service_domain === 'BTL & Activation').length,
    'Digital Marketing': allLeads.filter((l) => l.service_domain === 'Digital Marketing').length,
    'Web & IT': allLeads.filter((l) => l.service_domain === 'Web & IT').length,
    'Event Management': allLeads.filter((l) => l.service_domain === 'Event Management').length,
  };

  const domainIcons: Record<string, React.ReactNode> = {
    'BTL & Activation': <Megaphone className="w-4 h-4 text-blue-400" />,
    'Digital Marketing': <TrendingUp className="w-4 h-4 text-indigo-400" />,
    'Web & IT': <Monitor className="w-4 h-4 text-cyan-400" />,
    'Event Management': <CalendarCheck className="w-4 h-4 text-amber-400" />,
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Executive Overview
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[11px] font-semibold">
              Live Operations
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Arrow Solutions 360° Agency Management • BTL, Digital Growth & Software Systems
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400">Won Revenue</span>
            <div className="text-sm font-bold text-emerald-400">
              {formatCurrency(metrics.totalDealsWonValue)}
            </div>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400">Active Pipeline</span>
            <div className="text-sm font-bold text-sky-400">
              {metrics.activeLeadsCount} Opportunities
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <ExecutiveStatCards metrics={metrics} />

      {/* Domain Performance & Agency Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.entries(domainCounts).map(([domain, count]) => (
          <div
            key={domain}
            className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 truncate">{domain}</span>
              {domainIcons[domain]}
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xl font-bold text-white">{count}</span>
              <span className="text-[10px] text-slate-400 font-medium">Campaigns / Leads</span>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Main Section: Recent Leads Table & Quick Add Lead Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Recent Leads Table (Span 2) */}
        <div className="lg:col-span-2 space-y-4">
          <RecentLeadsTable initialLeads={recentLeads} />
        </div>

        {/* Quick Add Lead Form Component (Span 1) */}
        <div className="lg:col-span-1 space-y-4">
          <QuickAddLeadForm />

          {/* Quick Invoice Ledger Shortcut Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/80 text-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-200 font-semibold">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Pending Receivables</span>
              </div>
              <Link
                href="/dashboard/invoices"
                className="text-sky-400 hover:text-sky-300 font-medium text-[11px] flex items-center gap-1"
              >
                <span>Ledger</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            <p className="text-slate-400 text-[11px]">
              {allInvoices.filter((i) => i.status !== 'Paid').length} invoices awaiting client settlement.
            </p>
            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/60 text-slate-300">
              <span>Uncollected:</span>
              <span className="font-bold text-amber-400">
                {formatCurrency(metrics.outstandingDue)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
