'use client';

import { useState } from 'react';
import {
  InvoiceWithContact,
  Contact,
  InvoiceStatus,
} from '@/types/database';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Receipt,
  Plus,
  Printer,
  CreditCard,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building,
  Calendar,
} from 'lucide-react';
import { RecordPaymentModal } from './RecordPaymentModal';
import { PrintInvoiceModal } from './PrintInvoiceModal';
import { CreateInvoiceModal } from './CreateInvoiceModal';

interface InvoicesClientProps {
  invoices: InvoiceWithContact[];
  contacts: Contact[];
}

export function InvoicesClient({ invoices, contacts }: InvoicesClientProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | InvoiceStatus>('All');
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] =
    useState<InvoiceWithContact | null>(null);
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] =
    useState<InvoiceWithContact | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Filtered invoices
  const filtered = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoice_no.toLowerCase().includes(search.toLowerCase()) ||
      (inv.contact?.company || '').toLowerCase().includes(search.toLowerCase()) ||
      (inv.contact?.name || '').toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' ? true : inv.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalInvoiced = invoices.reduce((s, i) => s + Number(i.total_amount || 0), 0);
  const totalCollected = invoices.reduce((s, i) => s + Number(i.paid_amount || 0), 0);
  const totalPending = Math.max(0, totalInvoiced - totalCollected);

  return (
    <div className="space-y-6">
      {/* Header and Quick Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Invoices & Client Accounts
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold">
              Accounts Receivable
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Arrow Solutions Billing Ledger • Dispatch invoices & track payments
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-lg shadow-emerald-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Generate Invoice</span>
        </button>
      </div>

      {/* Financial Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <span className="text-xs text-slate-400">Total Invoiced</span>
          <div className="text-xl font-bold text-white mt-1">
            {formatCurrency(totalInvoiced)}
          </div>
          <span className="text-[10px] text-slate-400">Across {invoices.length} billing items</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <span className="text-xs text-slate-400">Total Collected</span>
          <div className="text-xl font-bold text-emerald-400 mt-1">
            {formatCurrency(totalCollected)}
          </div>
          <span className="text-[10px] text-emerald-500">Realized liquid collections</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <span className="text-xs text-slate-400">Total Outstanding</span>
          <div className="text-xl font-bold text-amber-400 mt-1">
            {formatCurrency(totalPending)}
          </div>
          <span className="text-[10px] text-amber-500">Unpaid & partial balance</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/40 p-3 rounded-2xl border border-slate-800/80">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search invoice number, client or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(['All', 'Unpaid', 'Partially Paid', 'Paid'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === status
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Ledger Table */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/70 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800/60">
              <tr>
                <th className="py-3 px-6 font-semibold">Invoice No</th>
                <th className="py-3 px-4 font-semibold">Client / Company</th>
                <th className="py-3 px-4 font-semibold">Due Date</th>
                <th className="py-3 px-4 font-semibold">Total Amount</th>
                <th className="py-3 px-4 font-semibold">Paid Amount</th>
                <th className="py-3 px-4 font-semibold">Balance Due</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No matching invoices found.
                  </td>
                </tr>
              ) : (
                filtered.map((inv) => {
                  const dueBalance = Math.max(0, inv.total_amount - (inv.paid_amount || 0));
                  return (
                    <tr
                      key={inv.id}
                      className="hover:bg-slate-800/30 transition-colors group"
                    >
                      <td className="py-3.5 px-6 font-mono font-semibold text-sky-400">
                        {inv.invoice_no}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-100">
                            {inv.contact?.company || 'Direct Client'}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {inv.contact?.name || '—'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatDate(inv.due_date)}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-100 font-mono">
                        {formatCurrency(inv.total_amount)}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-emerald-400 font-mono">
                        {formatCurrency(inv.paid_amount)}
                      </td>
                      <td className="py-3.5 px-4 font-semibold font-mono">
                        <span
                          className={dueBalance > 0 ? 'text-amber-400' : 'text-slate-500'}
                        >
                          {formatCurrency(dueBalance)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            inv.status === 'Paid'
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                              : inv.status === 'Partially Paid'
                              ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                              : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedInvoiceForPrint(inv)}
                            title="Print & Client Dispatch"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          {inv.status !== 'Paid' && (
                            <button
                              onClick={() => setSelectedInvoiceForPayment(inv)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 font-semibold text-[11px] transition-colors"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>Record Pay</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <CreateInvoiceModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        contacts={contacts}
      />
      <RecordPaymentModal
        isOpen={!!selectedInvoiceForPayment}
        onClose={() => setSelectedInvoiceForPayment(null)}
        invoice={selectedInvoiceForPayment}
      />
      <PrintInvoiceModal
        isOpen={!!selectedInvoiceForPrint}
        onClose={() => setSelectedInvoiceForPrint(null)}
        invoice={selectedInvoiceForPrint}
      />
    </div>
  );
}
