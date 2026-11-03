'use client';

import { useState } from 'react';
import { Expense, ExpenseCategory } from '@/types/database';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  ArrowDownCircle,
  Plus,
  Search,
  Filter,
  Layers,
  Calendar,
  Building,
  TrendingDown,
} from 'lucide-react';
import { CreateExpenseModal } from './CreateExpenseModal';

interface ExpensesClientProps {
  expenses: Expense[];
}

const categoryColors: Record<ExpenseCategory, string> = {
  'Office & Rent': 'bg-blue-950/80 text-blue-300 border-blue-800',
  Marketing: 'bg-purple-950/80 text-purple-300 border-purple-800',
  'Domain & Hosting': 'bg-cyan-950/80 text-cyan-300 border-cyan-800',
  Operational: 'bg-amber-950/80 text-amber-300 border-amber-800',
  Salaries: 'bg-emerald-950/80 text-emerald-300 border-emerald-800',
  Misc: 'bg-slate-800 text-slate-300 border-slate-700',
};

export function ExpensesClient({ expenses }: ExpensesClientProps) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | ExpenseCategory>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = expenses.filter((exp) => {
    const matchesSearch =
      exp.title.toLowerCase().includes(search.toLowerCase()) ||
      (exp.notes || '').toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === 'All' ? true : exp.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const totalSpent = expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0);

  // Category breakdown
  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Operational Expenses
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-semibold">
              Agency Overhead
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Arrow Solutions Operational Ledger • Track overhead, office, hosting and campaigns
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-semibold text-xs shadow-lg shadow-rose-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Log Expense</span>
        </button>
      </div>

      {/* Category Totals Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {(
          [
            'Office & Rent',
            'Marketing',
            'Domain & Hosting',
            'Operational',
            'Salaries',
            'Misc',
          ] as const
        ).map((cat) => (
          <div
            key={cat}
            className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80"
          >
            <span className="text-[10px] text-slate-400 truncate block">{cat}</span>
            <div className="text-sm font-bold text-white mt-1 font-mono">
              {formatCurrency(categoryTotals[cat] || 0)}
            </div>
          </div>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/40 p-3 rounded-2xl border border-slate-800/80">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search expense description or notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-sky-500"
          >
            <option value="All">All Categories</option>
            <option value="Operational">Operational</option>
            <option value="Office & Rent">Office & Rent</option>
            <option value="Marketing">Marketing</option>
            <option value="Domain & Hosting">Domain & Hosting</option>
            <option value="Salaries">Salaries</option>
            <option value="Misc">Misc</option>
          </select>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/70 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800/60">
              <tr>
                <th className="py-3 px-6 font-semibold">Expense Title</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Notes / Vendor</th>
                <th className="py-3 px-6 font-semibold text-right">Amount (৳)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No matching expenses logged yet.
                  </td>
                </tr>
              ) : (
                filtered.map((exp) => (
                  <tr
                    key={exp.id}
                    className="hover:bg-slate-800/30 transition-colors group"
                  >
                    <td className="py-3.5 px-6 font-semibold text-slate-100 group-hover:text-rose-400 transition-colors">
                      {exp.title}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                          categoryColors[exp.category] || 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDate(exp.expense_date)}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px] max-w-xs truncate">
                      {exp.notes || '—'}
                    </td>
                    <td className="py-3.5 px-6 text-right font-mono font-bold text-rose-400">
                      {formatCurrency(exp.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CreateExpenseModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
}
