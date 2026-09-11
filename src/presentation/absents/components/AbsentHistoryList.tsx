import React from 'react';
import { Absent } from '../../../domain/types';
import { Trash2, Calendar } from 'lucide-react';

interface AbsentHistoryListProps {
  absents: Absent[];
  onDelete: (id: string) => void;
}

export const AbsentHistoryList: React.FC<AbsentHistoryListProps> = ({
  absents,
  onDelete,
}) => {
  if (absents.length === 0) return null;

  return (
    <div className="mt-6 space-y-3">
      <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Tus Ausencias Reportadas</h3>
      <div className="space-y-2">
        {absents.map((a) => {
          const [y, m, d] = a.date.split('-');
          return (
            <div key={a.id} className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex items-center justify-between shadow-md">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {d}/{m}/{y}
                </span>
                <p className="text-xs text-slate-300">{a.reason}</p>
              </div>
              <button onClick={() => onDelete(a.id)} className="p-2 text-slate-500 hover:text-rose-400 rounded-xl hover:bg-rose-500/10 transition-all cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
