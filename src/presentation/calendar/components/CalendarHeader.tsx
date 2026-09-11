import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Switch } from '../../shared/Switch';

interface CalendarHeaderProps {
  year: number;
  month: number;
  showAbsents: boolean;
  onToggleView: (val: boolean) => void;
  onPrev: () => void;
  onNext: () => void;
}

const MONTH_NAMES_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  year, month, showAbsents, onToggleView, onPrev, onNext,
}) => (
  <div className="space-y-3 mb-4">
    <div className="flex items-center justify-between bg-slate-900/60 p-3 rounded-2xl border border-slate-800/80">
      <button onClick={onPrev} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-all cursor-pointer">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <h2 className="text-base font-bold text-white tracking-wide">{MONTH_NAMES_ES[month - 1]} {year}</h2>
      <button onClick={onNext} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-all cursor-pointer">
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
    <Switch labelLeft="Cantante" labelRight="Ausencias" checked={showAbsents} onChange={onToggleView} />
  </div>
);
