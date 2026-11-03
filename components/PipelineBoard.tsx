'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Contact, LeadStatus, ServiceDomain } from '@/types/database';
import { formatCurrency, formatDate } from '@/lib/utils';
import { updateLeadStatus } from '@/actions/flow';
import {
  ChevronRight,
  ChevronLeft,
  Building,
  User,
  Plus,
  Loader2,
  DollarSign,
  Layers,
} from 'lucide-react';
import { QuickAddLeadModal } from './QuickAddLeadModal';

interface PipelineBoardProps {
  leads: Contact[];
}

const STAGES: { id: LeadStatus; label: string; color: string; border: string; glow: string }[] = [
  {
    id: 'New',
    label: 'New Leads',
    color: 'text-sky-400',
    border: 'border-sky-500/30',
    glow: 'bg-sky-500/10',
  },
  {
    id: 'Contacted',
    label: 'Contacted',
    color: 'text-amber-400',
    border: 'border-amber-500/30',
    glow: 'bg-amber-500/10',
  },
  {
    id: 'Proposal Sent',
    label: 'Proposal Sent',
    color: 'text-purple-400',
    border: 'border-purple-500/30',
    glow: 'bg-purple-500/10',
  },
  {
    id: 'Won',
    label: 'Closed / Won',
    color: 'text-emerald-400',
    border: 'border-emerald-500/30',
    glow: 'bg-emerald-500/10',
  },
  {
    id: 'Lost',
    label: 'Lost',
    color: 'text-rose-400',
    border: 'border-rose-500/30',
    glow: 'bg-rose-500/10',
  },
];

export function PipelineBoard({ leads }: PipelineBoardProps) {
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  async function handleMove(id: string, targetStatus: LeadStatus) {
    setUpdatingId(id);
    await updateLeadStatus(id, targetStatus);
    setUpdatingId(null);
    router.refresh();
  }

  function getNextStage(current: LeadStatus): LeadStatus | null {
    const order: LeadStatus[] = ['New', 'Contacted', 'Proposal Sent', 'Won'];
    const idx = order.indexOf(current);
    if (idx !== -1 && idx < order.length - 1) {
      return order[idx + 1];
    }
    return null;
  }

  function getPrevStage(current: LeadStatus): LeadStatus | null {
    const order: LeadStatus[] = ['New', 'Contacted', 'Proposal Sent', 'Won'];
    const idx = order.indexOf(current);
    if (idx > 0) {
      return order[idx - 1];
    }
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Pipeline Kanban
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[11px] font-semibold">
              Sales Velocity
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visual stage progression of brand activations, digital campaigns and IT deliverables
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-lg shadow-sky-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Opportunity</span>
        </button>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageLeads = leads.filter((l) => l.status === stage.id);
          const stageTotal = stageLeads.reduce((s, l) => s + (Number(l.deal_value) || 0), 0);

          return (
            <div
              key={stage.id}
              className="flex flex-col bg-slate-900/50 border border-slate-800/80 rounded-2xl p-3 min-w-[240px] max-h-[75vh]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/60 mb-3">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${stage.color.replace('text-', 'bg-')}`} />
                  <span className="text-xs font-bold text-slate-200">{stage.label}</span>
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {stageLeads.length}
                </span>
              </div>

              {/* Stage Value Metric */}
              <div className="mb-3 px-2 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Total Value:</span>
                <span className="font-bold text-slate-200 font-mono">
                  {formatCurrency(stageTotal)}
                </span>
              </div>

              {/* Cards List */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {stageLeads.length === 0 ? (
                  <div className="py-8 text-center text-[11px] text-slate-500">
                    No leads in this stage
                  </div>
                ) : (
                  stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/80 hover:border-sky-500/40 transition-all space-y-2.5 shadow-sm group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-white group-hover:text-sky-400 transition-colors truncate">
                            {lead.company}
                          </span>
                          <span className="text-[11px] text-slate-400 truncate">
                            {lead.name}
                          </span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 whitespace-nowrap">
                          {lead.service_domain}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-xs">
                        <span className="font-bold text-sky-400 font-mono">
                          {formatCurrency(lead.deal_value)}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {formatDate(lead.created_at)}
                        </span>
                      </div>

                      {lead.notes && (
                        <p className="text-[10px] text-slate-400 line-clamp-2 italic bg-slate-900/60 p-1.5 rounded-lg">
                          &quot;{lead.notes}&quot;
                        </p>
                      )}

                      {/* Stage Move Controls */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                        {updatingId === lead.id ? (
                          <div className="flex items-center gap-1.5 text-[10px] text-sky-400 mx-auto">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Updating...</span>
                          </div>
                        ) : (
                          <>
                            {getPrevStage(lead.status) ? (
                              <button
                                onClick={() => handleMove(lead.id, getPrevStage(lead.status)!)}
                                className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 transition-colors"
                                title="Move back"
                              >
                                <ChevronLeft className="w-3 h-3" />
                                <span>Back</span>
                              </button>
                            ) : (
                              <div />
                            )}

                            {getNextStage(lead.status) ? (
                              <button
                                onClick={() => handleMove(lead.id, getNextStage(lead.status)!)}
                                className="flex items-center gap-1 text-[10px] text-sky-300 hover:text-white px-2.5 py-1 rounded bg-sky-600/30 hover:bg-sky-600 font-medium transition-colors ml-auto"
                                title="Advance stage"
                              >
                                <span>Advance</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            ) : null}

                            {lead.status !== 'Lost' && lead.status !== 'Won' && (
                              <button
                                onClick={() => handleMove(lead.id, 'Lost')}
                                className="text-[10px] text-rose-400 hover:text-rose-300 px-1.5 py-1 rounded hover:bg-rose-500/10 transition-colors"
                              >
                                Lost
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      <QuickAddLeadModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
}
