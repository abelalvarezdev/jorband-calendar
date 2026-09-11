import React from 'react';
import { ConflictInfo } from '../types/events.types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DateMultiSelectProps {
  year: number; month: number; selectedDates: string[]; conflicts: ConflictInfo[];
  onToggleDate: (dStr: string) => void; onSelectRecurring: (dayOfWeek: number) => void;
  onPrevMonth: () => void; onNextMonth: () => void;
}

const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export const DateMultiSelect: React.FC<DateMultiSelectProps> = ({
  year, month, selectedDates, conflicts, onToggleDate, onSelectRecurring, onPrevMonth, onNextMonth,
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
          {Array.from({ length: startDay }).map((_, i) => (<div key={`pad-${i}`} className="h-8 opacity-0" />))}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((dNum) => {
            const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(dNum).padStart(2, '0')}`;
            const isSelected = selectedDates.includes(dateStr);
            const hasConflict = conflictDates.includes(dateStr);
            return (
              <button key={dNum} type="button" onClick={() => onToggleDate(dateStr)} className={`h-8 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                hasConflict ? 'bg-rose-600 text-white animate-pulse ring-2 ring-rose-400' : isSelected ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}>{dNum}</button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
