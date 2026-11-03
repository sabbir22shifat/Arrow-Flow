import { ShieldCheck, MoreVertical } from 'lucide-react';

export function UserProfileBadge() {
  return (
    <div className="p-3 border-t border-slate-800/80 bg-slate-900/30">
      <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-900/80 transition-colors cursor-pointer group">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-slate-800">
              KT
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
          </div>
          <div className="flex flex-col min-w-0 text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-200 truncate">
                Tariqul Islam
              </span>
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
            </div>
            <span className="text-[10px] text-slate-400 font-medium truncate">
              Admin • Partner
            </span>
          </div>
        </div>
        <MoreVertical className="w-4 h-4 text-slate-400 group-hover:text-slate-300 flex-shrink-0" />
      </div>
    </div>
  );
}
