import React from 'react';
import { DayData } from '../types/calendar.types';

interface CalendarDayCellProps {
  day: DayData; isSelected: boolean; showAbsents: boolean; onSelect: (dateStr: string) => void;
}

export const CalendarDayCell: React.FC<CalendarDayCellProps> = ({
  day, isSelected, showAbsents, onSelect,
}) => {
  const { dateStr, dayNumber, isCurrentMonth, isToday, event, absents = [] } = day;
  const singerName = event?.principalSinger || '';
  const firstSingerName = singerName ? singerName.split(' ')[0] : 'Cantante';
  const visibleAbsents = absents.slice(0, 3);
  const remainingAbsents = absents.length > 3 ? absents.length - 3 : 0;

  const tileBg = !isCurrentMonth ? 'opacity-25 border-transparent cursor-not-allowed'
    : isSelected ? 'bg-indigo-600/30 border-indigo-400 ring-2 ring-indigo-500/50 text-white scale-[1.02] shadow-lg'
    : isToday ? 'bg-slate-900 border-indigo-400 text-indigo-300 font-bold'
    : event ? (event.isGuestSinger ? 'bg-amber-950/40 border-amber-500/70 text-amber-200 ring-1 ring-amber-500/30' : 'bg-indigo-950/50 border-indigo-500/70 text-indigo-200 ring-1 ring-indigo-500/30')
    : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-800/80 text-slate-300';

  return (
    <button onClick={() => onSelect(dateStr)} disabled={!isCurrentMonth} className={`h-[84px] p-1 rounded-2xl flex flex-col justify-between items-center transition-all cursor-pointer border overflow-hidden ${tileBg}`}>
      <span className={`text-xs font-semibold ${isToday ? 'text-indigo-400 font-extrabold' : ''}`}>{dayNumber}</span>
      <div className="w-full flex flex-col items-center gap-0.5 overflow-hidden my-auto">
        {!showAbsents && event && singerName && (
          <div className={`w-full px-0.5 py-0.2 rounded-md text-[9px] font-bold text-center truncate ${
            event.isGuestSinger ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
          }`}>
            <span className="truncate block leading-tight">{firstSingerName}</span>
          </div>
        )}
        {showAbsents && absents.length > 0 && (
          <div className="w-full flex flex-col gap-0.5 overflow-hidden">
            {visibleAbsents.map((a) => (
              <div key={a.id} className="bg-rose-500/20 text-rose-300 border border-rose-500/30 w-full px-0.5 py-0.2 rounded-md text-[9px] font-bold text-center truncate">
                <span className="truncate block leading-tight">{(a.userName || '').split(' ')[0]}</span>
              </div>
            ))}
            {remainingAbsents > 0 && (<div className="text-[8px] font-extrabold text-rose-400 text-center leading-none">+{remainingAbsents} más</div>)}
          </div>
        )}
      </div>
    </button>
  );
};
