import {
  Wallet,
  Clock,
  TrendingDown,
  TrendingUp,
  Percent,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { DashboardMetrics } from '@/types/database';

interface ExecutiveStatCardsProps {
  metrics: DashboardMetrics;
}

export function ExecutiveStatCards({ metrics }: ExecutiveStatCardsProps) {
  const marginPercentage =
    metrics.cashCollected > 0
      ? Math.round((metrics.netOperatingMargin / metrics.cashCollected) * 100)
      : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Cash Collected */}
      <div className="relative group bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/40 rounded-2xl p-5 shadow-lg transition-all duration-200 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Cash Collected</span>
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-white">
            {formatCurrency(metrics.cashCollected)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Liquid realized revenue in hand</span>
          </div>
        </div>
      </div>

      {/* 2. Outstanding Due / Receivables */}
      <div className="relative group bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/40 rounded-2xl p-5 shadow-lg transition-all duration-200 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Outstanding Receivables</span>
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-amber-300">
            {formatCurrency(metrics.outstandingDue)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-amber-400 font-medium">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Pending collection from billed clients</span>
          </div>
        </div>
      </div>

      {/* 3. Total Operational Expenses */}
      <div className="relative group bg-slate-900/60 border border-slate-800/80 hover:border-rose-500/40 rounded-2xl p-5 shadow-lg transition-all duration-200 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Operational Expenses</span>
          <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <TrendingDown className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-white">
            {formatCurrency(metrics.totalExpenses)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-rose-400 font-medium">
            <span>Rent, cloud, campaigns & team costs</span>
          </div>
        </div>
      </div>

      {/* 4. Net Operating Margin */}
      <div
        className={`relative group bg-slate-900/60 border rounded-2xl p-5 shadow-lg transition-all duration-200 overflow-hidden ${
          metrics.isProfitable
            ? 'border-emerald-500/40 hover:border-emerald-400/60'
            : 'border-rose-500/40 hover:border-rose-400/60'
        }`}
      >
        <div
          className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl pointer-events-none ${
            metrics.isProfitable ? 'bg-emerald-500/10' : 'bg-rose-500/10'
          }`}
        />
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Net Operating Margin</span>
          <div
            className={`w-8 h-8 rounded-xl border flex items-center justify-center ${
              metrics.isProfitable
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
            }`}
          >
            {metrics.isProfitable ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
          </div>
        </div>
        <div className="mt-3">
          <div
            className={`text-2xl font-bold tracking-tight ${
              metrics.isProfitable ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {formatCurrency(metrics.netOperatingMargin)}
          </div>
          <div
            className={`flex items-center gap-1.5 mt-2 text-[11px] font-medium ${
              metrics.isProfitable ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {metrics.isProfitable ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Profitable ({marginPercentage}% net margin)</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Deficit (Deficit margin)</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
