'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Contact, LeadStatus } from '@/types/database';
import { formatCurrency, formatDate } from '@/lib/utils';
import { updateLeadStatus } from '@/actions/flow';
import {
  ChevronRight,
  Sparkles,
  Phone,
  Mail,
  Loader2,
  Building2,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';

interface RecentLeadsTableProps {
  initialLeads: Contact[];
}

const statusColors: Record<LeadStatus, string> = {
  New: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  Contacted: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  'Proposal Sent': 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  Won: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Lost: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
};

const domainBadges: Record<string, string> = {
  'BTL & Activation': 'bg-blue-950/80 text-blue-300 border-blue-800',
  'Digital Marketing': 'bg-indigo-950/80 text-indigo-300 border-indigo-800',
  'Web & IT': 'bg-cyan-950/80 text-cyan-300 border-cyan-800',
  'Event Management': 'bg-amber-950/80 text-amber-300 border-amber-800',
};

export function RecentLeadsTable({ initialLeads }: RecentLeadsTableProps) {
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function handleStatusChange(id: string, newStatus: LeadStatus) {
    setUpdatingId(id);
    await updateLeadStatus(id, newStatus);
    setUpdatingId(null);
    router.refresh();
  }

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Recent Pipeline & Leads</h3>
            <p className="text-xs text-slate-400">Track client opportunities & deal velocity</p>
          </div>
        </div>
        <Link
          href="/dashboard/leads"
          className="flex items-center gap-1 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors"
        >
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/70 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800/60">
            <tr>
              <th className="py-3 px-6 font-semibold">Client / Company</th>
              <th className="py-3 px-4 font-semibold">Service Domain</th>
              <th className="py-3 px-4 font-semibold">Deal Value</th>
              <th className="py-3 px-4 font-semibold">Pipeline Status</th>
              <th className="py-3 px-6 font-semibold text-right">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {initialLeads.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500">
                  No leads logged yet. Use the Quick Add form to start!
                </td>
              </tr>
            ) : (
              initialLeads.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-slate-800/30 transition-colors group"
                >
                  <td className="py-3.5 px-6">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-100 group-hover:text-sky-400 transition-colors">
                        {lead.company}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{lead.name}</span>
                        {lead.phone && (
                          <span className="flex items-center gap-1 text-slate-400">
                            • {lead.phone}
                          </span>
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                        domainBadges[lead.service_domain] || 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {lead.service_domain}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-100">
                    {formatCurrency(lead.deal_value)}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="relative inline-flex items-center">
                      {updatingId === lead.id ? (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] rounded-lg bg-slate-800 text-slate-400">
                          <Loader2 className="w-3 h-3 animate-spin text-sky-400" />
                          <span>Updating...</span>
                        </div>
                      ) : (
                        <select
                          value={lead.status}
                          onChange={(e) =>
                            handleStatusChange(lead.id, e.target.value as LeadStatus)
                          }
                          className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border cursor-pointer focus:outline-none focus:ring-1 focus:ring-sky-500 bg-slate-900 ${
                            statusColors[lead.status]
                          }`}
                        >
                          <option value="New" className="bg-slate-900 text-slate-200">
                            New
                          </option>
                          <option value="Contacted" className="bg-slate-900 text-slate-200">
                            Contacted
                          </option>
                          <option value="Proposal Sent" className="bg-slate-900 text-slate-200">
                            Proposal Sent
                          </option>
                          <option value="Won" className="bg-slate-900 text-slate-200">
                            Won
                          </option>
                          <option value="Lost" className="bg-slate-900 text-slate-200">
                            Lost
                          </option>
                        </select>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-6 text-right text-slate-400 text-[11px]">
                    {formatDate(lead.created_at)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
