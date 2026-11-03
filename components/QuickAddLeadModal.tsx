'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  UserPlus,
  Building,
  User,
  Phone,
  Mail,
  Layers,
  Banknote,
  FileText,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { createLead } from '@/actions/flow';
import { ServiceDomain, LeadStatus } from '@/types/database';

interface QuickAddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function QuickAddLeadModal({ isOpen, onClose, onSuccess }: QuickAddLeadModalProps) {
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
    const res = await createLead(formData);

    setLoading(false);
    if (!res.success) {
      setError(res.error || 'Failed to create lead.');
    } else {
      setSuccess(res.message || 'Lead added successfully!');
      router.refresh();
      setTimeout(() => {
        setSuccess(null);
        onClose();
        if (onSuccess) onSuccess();
      }, 900);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Add New Lead / Client</h2>
              <p className="text-xs text-slate-400">Arrow Solutions Sales Pipeline Intake</p>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Contact Person <span className="text-sky-400">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Tanvir Ahmed"
                  className="w-full pl-9 pr-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Company / Brand <span className="text-sky-400">*</span>
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  name="company"
                  required
                  placeholder="e.g. Apex Footwear Ltd"
                  className="w-full pl-9 pr-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  name="phone"
                  placeholder="+880 1711 000000"
                  className="w-full pl-9 pr-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  name="email"
                  placeholder="client@company.com"
                  className="w-full pl-9 pr-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Service Domain
              </label>
              <select
                name="service_domain"
                defaultValue="BTL & Activation"
                className="w-full px-2.5 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-sky-500"
              >
                <option value="BTL & Activation">BTL & Activation</option>
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="Web & IT">Web & IT</option>
                <option value="Event Management">Event Management</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Initial Pipeline Status
              </label>
              <select
                name="status"
                defaultValue="New"
                className="w-full px-2.5 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-sky-500"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Proposal Sent">Proposal Sent</option>
                <option value="Won">Won</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Estimated Deal (৳)
              </label>
              <input
                type="number"
                name="deal_value"
                step="5000"
                min="0"
                placeholder="250000"
                className="w-full px-2.5 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Requirements & Activation Notes
            </label>
            <textarea
              name="notes"
              rows={2}
              placeholder="Campaign objectives, target audience, venue or scope..."
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
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-sky-500/20 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Adding Lead...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Save Lead</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
