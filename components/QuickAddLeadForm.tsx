'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  UserPlus,
  Loader2,
  CheckCircle2,
  Building,
  User,
  Phone,
  Banknote,
  Send,
} from 'lucide-react';
import { createLead } from '@/actions/flow';
import { ServiceDomain, LeadStatus } from '@/types/database';

export function QuickAddLeadForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  async function handleAction(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const res = await createLead(formData);

    setLoading(false);
    if (!res.success) {
      setMessage({ text: res.error || 'Failed to add lead.', isError: true });
    } else {
      setMessage({ text: 'New lead recorded into database!', isError: false });
      form.reset();
      router.refresh();
      setTimeout(() => setMessage(null), 4000);
    }
  }

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-lg relative overflow-hidden">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/60 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <UserPlus className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Quick Add Lead</h3>
            <p className="text-[11px] text-slate-400">Direct pipeline entry for sales staff</p>
          </div>
        </div>
        <span className="text-[10px] font-semibold text-sky-400 uppercase tracking-wider bg-sky-950/60 border border-sky-800/60 px-2 py-0.5 rounded-full">
          Live Database
        </span>
      </div>

      {message && (
        <div
          className={`mb-4 p-2.5 rounded-xl text-xs flex items-center gap-2 transition-all ${
            message.isError
              ? 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
              : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
          }`}
        >
          {!message.isError && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleAction} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">
              Client Name <span className="text-sky-400">*</span>
            </label>
            <div className="relative">
              <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                name="name"
                required
                placeholder="Tanvir Ahmed"
                className="w-full pl-8 pr-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">
              Company / Brand <span className="text-sky-400">*</span>
            </label>
            <div className="relative">
              <Building className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                name="company"
                required
                placeholder="Apex Footwear"
                className="w-full pl-8 pr-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Phone</label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="tel"
                name="phone"
                placeholder="+880 1711 000000"
                className="w-full pl-8 pr-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">
              Estimated Deal (৳)
            </label>
            <div className="relative">
              <Banknote className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="number"
                name="deal_value"
                step="5000"
                min="0"
                placeholder="250000"
                className="w-full pl-8 pr-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">
              Service Domain
            </label>
            <select
              name="service_domain"
              defaultValue="BTL & Activation"
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            >
              <option value="BTL & Activation">BTL & Activation</option>
              <option value="Digital Marketing">Digital Marketing</option>
              <option value="Web & IT">Web & IT</option>
              <option value="Event Management">Event Management</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">
              Pipeline Stage
            </label>
            <select
              name="status"
              defaultValue="New"
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Proposal Sent">Proposal Sent</option>
              <option value="Won">Won</option>
            </select>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-medium text-xs shadow-md shadow-sky-500/20 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Add Lead to Pipeline</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
