'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  Receipt,
  Building,
  Calendar,
  Banknote,
  FileText,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { createInvoice } from '@/actions/flow';
import { Contact } from '@/types/database';

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts?: Contact[];
  onSuccess?: () => void;
}

export function CreateInvoiceModal({
  isOpen,
  onClose,
  contacts = [],
  onSuccess,
}: CreateInvoiceModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);
    const res = await createInvoice(formData);

    setLoading(false);
    if (!res.success) {
      setError(res.error || 'Failed to create invoice.');
    } else {
      setSuccess(res.message || 'Invoice generated successfully!');
      router.refresh();
      setTimeout(() => {
        setSuccess(null);
        onClose();
        if (onSuccess) onSuccess();
      }, 900);
    }
  }

  const defaultInvoiceNo = `INV-${new Date().getFullYear()}-${Math.floor(
    100 + Math.random() * 900
  )}`;
  const defaultDueDate = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Generate Client Invoice</h2>
              <p className="text-xs text-slate-400">Arrow Solutions Accounts & Billing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300">
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 p-3 text-xs rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{success}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Select Client / Contact <span className="text-sky-400">*</span>
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <select
                name="contact_id"
                required
                className="w-full pl-9 pr-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-sky-500"
              >
                <option value="">-- Choose Client or Brand --</option>
                {contacts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.company} — {c.name} ({c.service_domain})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Invoice Number <span className="text-sky-400">*</span>
              </label>
              <input
                type="text"
                name="invoice_no"
                defaultValue={defaultInvoiceNo}
                required
                className="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Payment Due Date <span className="text-sky-400">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="date"
                  name="due_date"
                  defaultValue={defaultDueDate}
                  required
                  className="w-full pl-9 pr-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Total Billed Amount (৳) <span className="text-sky-400">*</span>
              </label>
              <div className="relative">
                <Banknote className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="number"
                  name="total_amount"
                  required
                  min="1"
                  step="500"
                  placeholder="150000"
                  className="w-full pl-9 pr-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-sky-500 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Initial Advance Paid (৳)
              </label>
              <div className="relative">
                <Banknote className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="number"
                  name="paid_amount"
                  defaultValue="0"
                  min="0"
                  step="500"
                  className="w-full pl-9 pr-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Invoice Scope / Terms
            </label>
            <textarea
              name="notes"
              rows={2}
              placeholder="e.g. 50% mobilization advance for brand activation fabrication..."
              className="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Create Invoice</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
