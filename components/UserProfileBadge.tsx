'use client';

import { useState } from 'react';
import { ShieldCheck, LogOut, MoreVertical, Key } from 'lucide-react';
import { logoutAction } from '@/actions/auth';
import { StaffSession } from '@/lib/auth';

interface UserProfileBadgeProps {
  session?: StaffSession | null;
}

export function UserProfileBadge({ session }: UserProfileBadgeProps) {
  const [showMenu, setShowMenu] = useState(false);

  const name = session?.full_name || 'Kazi Tariqul Islam';
  const role = session?.role || 'admin';
  const email = session?.email || 'admin@arrowsolutions.com';

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative p-3 border-t border-slate-800/80 bg-slate-900/30">
      {/* Profile Bar */}
      <div
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-900/80 transition-colors cursor-pointer group"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-slate-800">
              {initials}
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
          </div>
          <div className="flex flex-col min-w-0 text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-200 truncate">{name}</span>
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
            </div>
            <span className="text-[10px] text-slate-400 font-medium truncate capitalize">
              {role} • Arrow Solutions
            </span>
          </div>
        </div>
        <MoreVertical className="w-4 h-4 text-slate-400 group-hover:text-slate-300 flex-shrink-0" />
      </div>

      {/* Dropdown Menu */}
      {showMenu && (
        <div className="absolute bottom-16 left-3 right-3 bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl space-y-1 z-50">
          <div className="px-3 py-2 border-b border-slate-800 text-xs">
            <p className="font-semibold text-white">{name}</p>
            <p className="text-[11px] text-slate-400 truncate">{email}</p>
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-500/20 rounded-xl transition-colors text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of Arrow OS</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
