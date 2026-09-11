import React from 'react';
import { DayData } from '../types/calendar.types';
import { CalendarDayCell } from './CalendarDayCell';

interface CalendarGridProps {
  days: DayData[];
  selectedDateStr: string;
  showAbsents: boolean;
  onSelectDate: (dateStr: string) => void;
}

const WEEKDAYS_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  days,
  selectedDateStr,
  showAbsents,
  onSelectDate,
}) => {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-7 text-center">
        {WEEKDAYS_ES.map((day) => (
          <span key={day} className="text-[11px] font-bold text-slate-400 py-1 uppercase tracking-wider">
            {day}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => (
          <CalendarDayCell
            key={day.dateStr}
            day={day}
            isSelected={day.dateStr === selectedDateStr}
            showAbsents={showAbsents}
            onSelect={onSelectDate}
          />
        ))}
      </div>
    </div>
  );
};
