import React from 'react';
import { CalendarPlus } from 'lucide-react';

export const EventsHeader: React.FC = () => {
  return (
    <div className="flex items-center gap-3 bg-slate-900/60 p-4 rounded-3xl border border-slate-800/80 mb-4">
      <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
        <CalendarPlus className="w-5 h-5" />
      </div>
      <div>
        <h2 className="text-base font-bold text-white">Programar Eventos</h2>
        <p className="text-xs text-slate-400">Asigna cantantes principales a múltiples fechas del mes</p>
      </div>
    </div>
  );
};
