import React from 'react';
import { ConflictInfo } from '../types/events.types';
import { Event } from '../../../domain/types';
import { ChevronLeft, ChevronRight, Mic } from 'lucide-react';
import { DateGridCell } from './DateGridCell';

interface DateMultiSelectProps {
  year: number; month: number; selectedDates: string[]; conflicts: ConflictInfo[];
  existingEvents?: Event[];
  onToggleDate: (dStr: string) => void; onSelectRecurring: (dayOfWeek: number) => void;
  onPrevMonth: () => void; onNextMonth: () => void;
}

const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export const DateMultiSelect: React.FC<DateMultiSelectProps> = ({
  year, month, selectedDates, conflicts, existingEvents = [], onToggleDate, onSelectRecurring, onPrevMonth, onNextMonth,
}) => {
  const startDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const conflictDates = conflicts.map((c) => c.date);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-300">Fechas Seleccionadas ({selectedDates.length})</label>
        <div className="flex gap-1">
          <button type="button" onClick={() => onSelectRecurring(2)} className="px-2 py-0.5 bg-slate-800 text-[10px] font-bold text-indigo-300 rounded-lg border border-slate-700">Mar</button>
          <button type="button" onClick={() => onSelectRecurring(5)} className="px-2 py-0.5 bg-slate-800 text-[10px] font-bold text-indigo-300 rounded-lg border border-slate-700">Vie</button>
          <button type="button" onClick={() => onSelectRecurring(0)} className="px-2 py-0.5 bg-slate-800 text-[10px] font-bold text-indigo-300 rounded-lg border border-slate-700">Dom</button>
        </div>
      </div>
      <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between bg-slate-900/80 px-2 py-1 rounded-xl border border-slate-800/80">
          <button type="button" onClick={onPrevMonth} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
          <span className="text-xs font-extrabold text-white">{MONTHS[month - 1]} {year}</span>
          <button type="button" onClick={onNextMonth} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
        </div>
        <div className="grid grid-cols-7 text-center">{WEEKDAYS.map((w) => (<span key={w} className="text-[10px] font-bold text-slate-400 py-0.5">{w}</span>))}</div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: startDay }).map((_, i) => (<div key={`pad-${i}`} className="h-11 opacity-0" />))}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((dNum) => {
            const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(dNum).padStart(2, '0')}`;
            return (
              <DateGridCell
                key={dNum}
                dNum={dNum}
                dateStr={dateStr}
                isSelected={selectedDates.includes(dateStr)}
                hasConflict={conflictDates.includes(dateStr)}
                existingEvt={existingEvents.find((e) => e.date === dateStr)}
                onToggleDate={onToggleDate}
              />
            );
          })}
        </div>
        <div className="text-[10px] text-slate-400 flex items-center gap-1.5 pt-1.5 border-t border-slate-800/80">
          <Mic className="w-3 h-3 text-indigo-400 shrink-0" />
          <span>Fechas con cantante o canceladas</span>
        </div>
      </div>
    </div>
  );
};
