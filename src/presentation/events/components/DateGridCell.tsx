import React from 'react';
import { Event } from '../../../domain/types';

interface DateGridCellProps {
  dNum: number;
  dateStr: string;
  isSelected: boolean;
  hasConflict: boolean;
  existingEvt?: Event;
  onToggleDate: (dStr: string) => void;
}

export const DateGridCell: React.FC<DateGridCellProps> = ({
  dNum, dateStr, isSelected, hasConflict, existingEvt, onToggleDate,
}) => {
  const existingSinger = existingEvt?.principalSinger || '';
  const firstSinger = existingSinger ? existingSinger.split(' ')[0] : '';
  const isCancelled = existingEvt?.isCancelled;

  const tileStyle = hasConflict
    ? 'bg-rose-600 text-white animate-pulse ring-2 ring-rose-400'
    : isSelected
      ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400'
      : isCancelled
        ? 'bg-slate-900/90 text-slate-400 border border-slate-700/80 hover:bg-slate-800'
        : existingEvt
          ? 'bg-slate-900 text-indigo-200 border border-indigo-500/50 hover:bg-indigo-950/40'
          : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800/60';

  return (
    <button
      type="button"
      onClick={() => onToggleDate(dateStr)}
      className={`h-11 text-xs font-bold rounded-xl transition-all cursor-pointer p-0.5 flex flex-col justify-between items-center overflow-hidden ${tileStyle}`}
    >
      <span className="leading-tight text-[11px] font-extrabold pt-0.5">{dNum}</span>
      {existingEvt && (
        <span
          className={`w-full text-[8px] font-bold text-left truncate px-0.5 leading-none py-0.5 rounded ${isCancelled
            ? 'bg-rose-950/60 text-rose-300 border border-rose-800/60'
            : isSelected
              ? 'bg-white/20 text-white'
              : 'bg-indigo-500/25 text-indigo-200 border border-indigo-500/30'
            }`}
          title={isCancelled ? `Evento Cancelado: ${existingEvt.cancelReason || 'Sin motivo'}` : `Cantante: ${existingSinger}`}
        >
          {isCancelled ? 'CANCELADO' : `${firstSinger}`}
        </span>
      )}
    </button>
  );
};
