import React from 'react';
import { Star } from 'lucide-react';

interface SpecialEventToggleProps {
  isSpecialEvent: boolean;
  onChange: (value: boolean) => void;
}

export const SpecialEventToggle: React.FC<SpecialEventToggleProps> = ({
  isSpecialEvent,
  onChange,
}) => {
  return (
    <label
      className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
        isSpecialEvent
          ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 shadow-lg shadow-amber-500/10'
          : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
      }`}
    >
      <div className="flex items-center gap-2">
        <Star className={`w-4 h-4 ${isSpecialEvent ? 'text-amber-400 fill-amber-400' : 'text-slate-400'}`} />
        <div>
          <span className="block text-xs font-bold">Evento Especial</span>
          <span className="block text-[10px] text-slate-400">Cumpleaños, boda o celebración especial</span>
        </div>
      </div>
      <input
        type="checkbox"
        checked={isSpecialEvent}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-slate-900 border-slate-700"
      />
    </label>
  );
};
