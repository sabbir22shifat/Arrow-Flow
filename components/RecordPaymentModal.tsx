'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  CreditCard,
  Banknote,
  Loader2,
  CheckCircle2,
  Building,
} from 'lucide-react';
import { recordPayment } from '@/actions/flow';
import { InvoiceWithContact } from '@/types/database';
import { formatCurrency } from '@/lib/utils';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: InvoiceWithContact | null;
  onSuccess?: () => void;
}

export function RecordPaymentModal({
  isOpen,
  onClose,
  invoice,
  onSuccess,
}: RecordPaymentModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen || !invoice) return null;

  const outstanding = Math.max(0, invoice.total_amount - (invoice.paid_amount || 0));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!invoice) return;
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid positive payment amount.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const res = await recordPayment(invoice.id, numAmount);

    setLoading(false);
    if (!res.success) {
      setError(res.error || 'Failed to record payment.');
    } else {
      setSuccess(res.message || 'Payment recorded!');
      router.refresh();
      setTimeout(() => {
        setSuccess(null);
        setAmount('');
        onClose();
        if (onSuccess) onSuccess();
      }, 900);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Record Client Payment</h2>
              <p className="text-xs text-slate-400 font-mono">{invoice.invoice_no}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Summary */}
        <div className="p-6 pb-2 space-y-3">
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

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span>Client / Brand:</span>
              <span className="font-semibold text-slate-200">
                {invoice.contact?.company || 'Direct Client'}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Total Invoiced:</span>
              <span className="font-semibold text-slate-200">
                {formatCurrency(invoice.total_amount)}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Already Collected:</span>
              <span className="font-semibold text-emerald-400">
                {formatCurrency(invoice.paid_amount)}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-slate-300 font-semibold">
              <span className="text-amber-400">Remaining Due:</span>
              <span className="text-amber-400 font-bold">{formatCurrency(outstanding)}</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-300">
                Payment Received (৳) <span className="text-sky-400">*</span>
              </label>
              <button
                type="button"
                onClick={() => setAmount(outstanding.toString())}
                className="text-[10px] text-sky-400 hover:text-sky-300 underline font-medium"
              >
                Pay Full Due ({formatCurrency(outstanding)})
              </button>
            </div>
            <div className="relative">
              <Banknote className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="1"
                step="500"
                placeholder={outstanding.toString()}
                className="w-full pl-9 pr-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-sky-500 font-bold text-base"
              />
            </div>
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
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Confirm Receipt</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
