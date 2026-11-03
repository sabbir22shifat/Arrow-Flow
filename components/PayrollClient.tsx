'use client';

import { useState } from 'react';
import { PayrollWithEmployee, Employee } from '@/types/database';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  WalletCards,
  UserCheck,
  CheckCircle2,
  Clock,
  Building,
  User,
  Calendar,
  Layers,
} from 'lucide-react';

interface PayrollClientProps {
  payroll: PayrollWithEmployee[];
  employees: Employee[];
}

export function PayrollClient({ payroll, employees }: PayrollClientProps) {
  const [selectedMonth, setSelectedMonth] = useState('October 2026');

  const totalPayroll = payroll.reduce((s, p) => s + (Number(p.net_salary) || 0), 0);
  const paidPayroll = payroll
    .filter((p) => p.status === 'Paid')
    .reduce((s, p) => s + (Number(p.net_salary) || 0), 0);
  const pendingPayroll = Math.max(0, totalPayroll - paidPayroll);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Payroll & Staff Compensation
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold">
              Monthly Disbursement
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Arrow Solutions Team Registry & Monthly Compensation Schedule
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <span className="text-xs text-slate-400">Total Monthly Payroll</span>
          <div className="text-xl font-bold text-white mt-1 font-mono">
            {formatCurrency(totalPayroll)}
          </div>
          <span className="text-[10px] text-slate-400">{employees.length} Active Staff Members</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <span className="text-xs text-slate-400">Disbursed Salaries</span>
          <div className="text-xl font-bold text-emerald-400 mt-1 font-mono">
            {formatCurrency(paidPayroll)}
          </div>
          <span className="text-[10px] text-emerald-500">Processed through agency bank</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <span className="text-xs text-slate-400">Pending Disbursement</span>
          <div className="text-xl font-bold text-amber-400 mt-1 font-mono">
            {formatCurrency(pendingPayroll)}
          </div>
          <span className="text-[10px] text-amber-500">Scheduled for pay day</span>
        </div>
      </div>

      {/* Staff Registry & Salary Ledger */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg">
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Disbursement Ledger</h3>
          <span className="text-xs text-slate-400 font-medium">Month: October 2026</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/70 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800/60">
              <tr>
                <th className="py-3 px-6 font-semibold">Staff Member</th>
                <th className="py-3 px-4 font-semibold">Designation</th>
                <th className="py-3 px-4 font-semibold">Base Salary</th>
                <th className="py-3 px-4 font-semibold">Bonus</th>
                <th className="py-3 px-4 font-semibold">Deductions</th>
                <th className="py-3 px-4 font-semibold">Net Salary</th>
                <th className="py-3 px-6 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {payroll.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-6 font-semibold text-slate-100">
                    {p.employee?.full_name || 'Staff Member'}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {p.employee?.designation || 'Specialist'}
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    {formatCurrency(p.employee?.base_salary || p.net_salary)}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-emerald-400">
                    +{formatCurrency(p.bonus)}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-rose-400">
                    -{formatCurrency(p.deductions)}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-white">
                    {formatCurrency(p.net_salary)}
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        p.status === 'Paid'
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
