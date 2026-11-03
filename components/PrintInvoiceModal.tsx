'use client';

import { useRef } from 'react';
import {
  X,
  Printer,
  Download,
  Building,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { InvoiceWithContact } from '@/types/database';
import { formatCurrency, formatDate } from '@/lib/utils';
import { BrandLogo } from './BrandLogo';

interface PrintInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: InvoiceWithContact | null;
}

export function PrintInvoiceModal({ isOpen, onClose, invoice }: PrintInvoiceModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !invoice) return null;

  const dueBalance = Math.max(0, invoice.total_amount - (invoice.paid_amount || 0));

  function handlePrint() {
    window.print();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl my-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        {/* Modal Controls Bar (Hidden during print) */}
        <div className="no-print flex items-center justify-between px-6 py-3.5 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-300">
              Invoice Preview • {invoice.invoice_no}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                invoice.status === 'Paid'
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  : invoice.status === 'Partially Paid'
                  ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                  : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
              }`}
            >
              {invoice.status}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md shadow-sky-600/30 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Dispatch PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 overflow-y-auto bg-slate-950/90 text-slate-100 invoice-printable">
          {/* Top Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 via-sky-600 to-cyan-500 p-0.5 flex items-center justify-center">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <svg
                      viewBox="0 0 40 40"
                      fill="none"
                      className="w-6 h-6 text-sky-400"
                    >
                      <path d="M10 32L18 8L23 18L13 28L10 32Z" fill="#004d99" />
                      <path
                        d="M19 14L28 6M28 6H20M28 6V14"
                        stroke="#0284c7"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path d="M14 26L30 32L24 20L14 26Z" fill="#0066cc" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-extrabold tracking-tight text-white leading-none">
                    ARROW <span className="text-sky-400">SOLUTIONS</span>
                  </h1>
                  <p className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mt-1">
                    Offline Marketing • Digital Growth • Software Solutions
                  </p>
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-400 leading-relaxed">
                <p>Gulshan-2, Dhaka-1212, Bangladesh</p>
                <p>Email: billing@arrowsolutions.com • Phone: +880 1700-000000</p>
              </div>
            </div>

            <div className="sm:text-right">
              <span className="text-xs uppercase font-extrabold tracking-widest text-sky-400">
                Official Agency Invoice
              </span>
              <div className="text-2xl font-mono font-bold text-white mt-1">
                {invoice.invoice_no}
              </div>
              <div className="text-xs text-slate-400 mt-2 space-y-0.5">
                <p>
                  <span className="text-slate-400">Date Issued:</span>{' '}
                  <span className="text-slate-200">{formatDate(invoice.created_at)}</span>
                </p>
                <p>
                  <span className="text-slate-400">Payment Due:</span>{' '}
                  <span className="text-amber-400 font-semibold">{formatDate(invoice.due_date)}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Client Bill To & Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Billed To:
              </span>
              <h3 className="text-base font-bold text-white mt-1">
                {invoice.contact?.company || 'Direct Agency Client'}
              </h3>
              <div className="text-xs text-slate-400 mt-1 space-y-0.5">
                <p>Attention: {invoice.contact?.name || 'Accounts Payable'}</p>
                {invoice.contact?.phone && <p>Phone: {invoice.contact.phone}</p>}
                {invoice.contact?.email && <p>Email: {invoice.contact.email}</p>}
                <p className="text-sky-400 font-medium pt-1">
                  Service Domain: {invoice.contact?.service_domain || 'Agency Deliverables'}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Payment Status</span>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                    invoice.status === 'Paid'
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : invoice.status === 'Partially Paid'
                      ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                      : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                  }`}
                >
                  {invoice.status}
                </span>
              </div>
              <div className="mt-3">
                <div className="text-xs text-slate-400">Total Outstanding Balance:</div>
                <div className="text-xl font-bold text-amber-400">
                  {formatCurrency(dueBalance)}
                </div>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="py-6">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-300 border-y border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Scope & Deliverables</th>
                  <th className="py-2.5 px-3 font-semibold">Domain</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Amount (৳)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr>
                  <td className="py-4 px-3">
                    <p className="font-semibold text-white">
                      {invoice.notes ||
                        `${invoice.contact?.service_domain || 'Agency'} Project Execution Milestone`}
                    </p>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Professional services rendered by Arrow Solutions creative and execution team.
                    </p>
                  </td>
                  <td className="py-4 px-3 text-slate-300">
                    {invoice.contact?.service_domain || 'Full Service'}
                  </td>
                  <td className="py-4 px-3 text-right font-mono font-bold text-white">
                    {formatCurrency(invoice.total_amount)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals Calculation */}
          <div className="flex flex-col sm:flex-row justify-between gap-6 pt-4 border-t border-slate-800">
            <div className="max-w-xs space-y-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-300 uppercase tracking-wider text-[10px]">
                Payment Instructions:
              </span>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] space-y-1">
                <p className="font-semibold text-slate-200">Bank Transfer / EFT:</p>
                <p>Account Name: Arrow Solutions</p>
                <p>Bank: City Bank PLC (Gulshan Branch)</p>
                <p>Account No: 1102938475001</p>
                <p className="pt-1 text-slate-300">bKash Merchant: +8801700000000</p>
              </div>
            </div>

            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Subtotal:</span>
                <span className="font-mono text-slate-200">
                  {formatCurrency(invoice.total_amount)}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Paid / Retainer:</span>
                <span className="font-mono text-emerald-400">
                  - {formatCurrency(invoice.paid_amount)}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-sm font-bold text-white">
                <span className="text-amber-400">Balance Due:</span>
                <span className="font-mono text-amber-400 text-base">
                  {formatCurrency(dueBalance)}
                </span>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-12 mt-6 border-t border-slate-800 text-center text-xs text-slate-400">
            <div>
              <div className="h-10 border-b border-slate-700/60 mx-auto w-36 mb-1" />
              <p className="font-medium text-slate-300">Client Acknowledgement</p>
              <p className="text-[10px] text-slate-400">Received & Approved</p>
            </div>
            <div>
              <div className="h-10 border-b border-slate-700/60 mx-auto w-44 mb-1 flex items-end justify-center pb-1">
                <span className="text-xs text-sky-400 font-mono font-semibold">Md. Sabbir Ahammed Shifat</span>
              </div>
              <p className="font-semibold text-slate-200">Md. Sabbir Ahammed Shifat</p>
              <p className="text-[10px] text-sky-400 font-medium">Chief Executive Officer (CEO) • Arrow Solutions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
