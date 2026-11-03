'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Contact, LeadStatus, ServiceDomain } from '@/types/database';
import { formatCurrency, formatDate } from '@/lib/utils';
import { updateLeadStatus } from '@/actions/flow';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  Building,
  Filter,
  Loader2,
  Calendar,
} from 'lucide-react';
import { QuickAddLeadModal } from './QuickAddLeadModal';

interface LeadsClientProps {
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

export function LeadsClient({ initialLeads }: LeadsClientProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState<'All' | ServiceDomain>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | LeadStatus>('All');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  async function handleStatusChange(id: string, newStatus: LeadStatus) {
    setUpdatingId(id);
    await updateLeadStatus(id, newStatus);
    setUpdatingId(null);
    router.refresh();
  }

  const filtered = initialLeads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.company.toLowerCase().includes(search.toLowerCase()) ||
      (lead.phone || '').toLowerCase().includes(search.toLowerCase()) ||
      (lead.email || '').toLowerCase().includes(search.toLowerCase());

    const matchesDomain = domainFilter === 'All' ? true : lead.service_domain === domainFilter;
    const matchesStatus = statusFilter === 'All' ? true : lead.status === statusFilter;

    return matchesSearch && matchesDomain && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Leads & Client CRM
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[11px] font-semibold">
              {filtered.length} Contacts
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Arrow Solutions Client Directory • Offline Marketing, Brand Activations & Software
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-lg shadow-sky-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Lead</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 bg-slate-900/40 p-3 rounded-2xl border border-slate-800/80">
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by client, brand, phone or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Domain Filter */}
          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value as any)}
            className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-sky-500"
          >
            <option value="All">All Domains</option>
            <option value="BTL & Activation">BTL & Activation</option>
            <option value="Digital Marketing">Digital Marketing</option>
            <option value="Web & IT">Web & IT</option>
            <option value="Event Management">Event Management</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-sky-500"
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Proposal Sent">Proposal Sent</option>
            <option value="Won">Won</option>
            <option value="Lost">Lost</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/70 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800/60">
              <tr>
                <th className="py-3 px-6 font-semibold">Client & Company</th>
                <th className="py-3 px-4 font-semibold">Contact Info</th>
                <th className="py-3 px-4 font-semibold">Service Domain</th>
                <th className="py-3 px-4 font-semibold">Deal Value</th>
                <th className="py-3 px-4 font-semibold">Pipeline Stage</th>
                <th className="py-3 px-6 font-semibold text-right">Added</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No matching leads found.
                  </td>
                </tr>
              ) : (
                filtered.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-slate-800/30 transition-colors group"
                  >
                    <td className="py-3.5 px-6">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-100 group-hover:text-sky-400 transition-colors">
                          {lead.company}
                        </span>
                        <span className="text-[11px] text-slate-400 mt-0.5">
                          {lead.name}
                        </span>
                        {lead.notes && (
                          <span className="text-[10px] text-slate-500 italic mt-1 max-w-xs truncate">
                            &quot;{lead.notes}&quot;
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <div className="space-y-0.5 text-[11px]">
                        {lead.phone && (
                          <div className="flex items-center gap-1.5 text-slate-300">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{lead.phone}</span>
                          </div>
                        )}
                        {lead.email && (
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span>{lead.email}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${
                          domainBadges[lead.service_domain] || 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {lead.service_domain}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-100 font-mono">
                      {formatCurrency(lead.deal_value)}
                    </td>
                    <td className="py-3.5 px-4">
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
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Proposal Sent">Proposal Sent</option>
                          <option value="Won">Won</option>
                          <option value="Lost">Lost</option>
                        </select>
                      )}
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

      <QuickAddLeadModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
}
