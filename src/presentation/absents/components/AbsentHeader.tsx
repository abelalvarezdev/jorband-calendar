import React from 'react';
import { UserX } from 'lucide-react';

export const AbsentHeader: React.FC = () => {
  return (
    <div className="flex items-center gap-3 bg-slate-900/60 p-4 rounded-3xl border border-slate-800/80 mb-4">
      <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
        <UserX className="w-5 h-5" />
      </div>
      <div>
        <h2 className="text-base font-bold text-white">Reportar Ausencia</h2>
        <p className="text-xs text-slate-400">Notifica los días que no podrás asistir a ensayos o eventos</p>
      </div>
    </div>
  );
};
