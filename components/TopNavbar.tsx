'use client';

import { useState } from 'react';
import {
  Menu,
  Plus,
  Receipt,
  ArrowDownCircle,
  UserPlus,
  Bell,
  Search,
  CheckCircle2,
  Database,
} from 'lucide-react';
import { QuickAddLeadModal } from './QuickAddLeadModal';
import { CreateInvoiceModal } from './CreateInvoiceModal';
import { CreateExpenseModal } from './CreateExpenseModal';
import { Contact } from '@/types/database';

interface TopNavbarProps {
  contacts?: Contact[];
  onToggleMobileMenu?: () => void;
}

export function TopNavbar({ contacts = [], onToggleMobileMenu }: TopNavbarProps) {
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 lg:hidden"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-300">Arrow Solutions</span>
            <span className="text-slate-400">•</span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Agency OS Active</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowLeadModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs shadow-md shadow-sky-600/25 transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Lead</span>
          </button>

          <button
            onClick={() => setShowInvoiceModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/60 font-medium text-xs transition-colors"
          >
            <Receipt className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">New Invoice</span>
          </button>

          <button
            onClick={() => setShowExpenseModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/60 font-medium text-xs transition-colors"
          >
            <ArrowDownCircle className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Log Expense</span>
          </button>
        </div>
      </header>

      {/* Action Modals */}
      <QuickAddLeadModal
        isOpen={showLeadModal}
        onClose={() => setShowLeadModal(false)}
      />
      <CreateInvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        contacts={contacts}
      />
      <CreateExpenseModal
        isOpen={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
      />
    </>
  );
}
