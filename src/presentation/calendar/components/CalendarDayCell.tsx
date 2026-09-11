import React from 'react';
import { DayData } from '../types/calendar.types';
import { getSingerColor } from '../utils/singerColor';

interface CalendarDayCellProps {
  day: DayData; isSelected: boolean; showAbsents: boolean; onSelect: (dateStr: string) => void;
}

export const CalendarDayCell: React.FC<CalendarDayCellProps> = ({
  day, isSelected, showAbsents, onSelect,
}) => {
  const { dateStr, dayNumber, isCurrentMonth, isToday, event, absents = [] } = day;
  const isCancelled = event?.isCancelled;
  const singerName = event?.principalSinger || '';
  const firstSingerName = singerName ? singerName.split(' ')[0] : 'Cantante';

  const palette = event && !isCancelled ? getSingerColor(singerName, event.isGuestSinger) : null;
  const selClasses = palette ? `${palette.selectedBg} ${palette.selectedBorder} ${palette.selectedRing} text-white scale-[1.02]` : 'bg-indigo-600/30 border-indigo-400 ring-2 ring-indigo-500/50 text-white scale-[1.02]';

  const tileBg = !isCurrentMonth ? 'opacity-25 border-transparent cursor-not-allowed'
    : isSelected ? selClasses
    : isToday ? 'bg-slate-900 border-indigo-400 text-indigo-300 font-bold'
    : isCancelled ? 'bg-slate-900/90 border-slate-700/80 text-slate-400 opacity-75'
    : palette ? `${palette.bg} ${palette.border} ${palette.text} ring-1 ${palette.ring}`
    : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-800/80 text-slate-300';

  return (
    <button onClick={() => onSelect(dateStr)} disabled={!isCurrentMonth} className={`h-[84px] p-1 rounded-2xl flex flex-col justify-between items-center transition-all cursor-pointer border overflow-hidden ${tileBg}`}>
      <div className="w-full flex items-center justify-between px-1 pt-0.5">
        <span className={`text-xs font-semibold ${isToday ? 'text-indigo-400 font-extrabold' : ''}`}>{dayNumber}</span>
        {!showAbsents && absents.length > 0 && (
          <span className="text-[9px] font-black bg-rose-500/35 text-rose-300 border border-rose-500/50 px-1 py-0.2 rounded-full" title={`${absents.length} ausente(s)`}>{absents.length}</span>
        )}
      </div>

      <div className="w-full flex flex-col items-center gap-0.5 overflow-hidden my-auto">
        {!showAbsents && event && (
          <div className={`w-full px-0.5 py-0.5 rounded-md text-[9px] font-bold text-center truncate ${
            isCancelled ? 'bg-rose-950/70 text-rose-300 border border-rose-800/60' : `${palette?.badgeBg} ${palette?.badgeText} border ${palette?.badgeBorder}`
          }`}>
            <span className="truncate block leading-tight">{isCancelled ? 'CANCELADO' : firstSingerName}</span>
          </div>
        )}
        {showAbsents && absents.length > 0 && (
          <div className="w-full flex flex-col gap-0.5 overflow-hidden">
            {absents.slice(0, 3).map((a) => (
              <div key={a.id} className="bg-rose-500/20 text-rose-300 border border-rose-500/30 w-full px-0.5 py-0.2 rounded-md text-[9px] font-bold text-center truncate">
                <span className="truncate block leading-tight">{(a.userName || '').split(' ')[0]}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </button>
  );
};
