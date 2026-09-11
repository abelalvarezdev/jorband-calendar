import React from 'react';
import { Input } from '../../shared/Input';
import { Button } from '../../shared/Button';
import { CalendarDays, Send } from 'lucide-react';

interface AbsentFormProps {
  date: string;
  setDate: (v: string) => void;
  reason: string;
  setReason: (v: string) => void;
  onQuickThursday: () => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export const AbsentForm: React.FC<AbsentFormProps> = ({
  date,
  setDate,
  reason,
  setReason,
  onQuickThursday,
  onSubmit,
  loading,
}) => {
  return (
    <form onSubmit={onSubmit} className="bg-slate-900/90 border border-slate-800 p-4 rounded-3xl space-y-4 shadow-xl">
      <div className="space-y-2">
        <Input label="Fecha de Ausencia" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <button type="button" onClick={onQuickThursday} className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-semibold transition-all cursor-pointer">
          <CalendarDays className="w-3.5 h-3.5" /> Seleccionar Próximo Jueves (Día de Ensayo)
        </button>
      </div>
      <div className="space-y-1">
        <label className="block text-xs font-semibold text-slate-300">Motivo de Ausencia</label>
        <textarea rows={3} placeholder="Describe brevemente la razón de tu inasistencia..." value={reason} onChange={(e) => setReason(e.target.value)} required className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500" />
      </div>
      <Button type="submit" variant="primary" className="w-full bg-amber-600 hover:bg-amber-500 shadow-amber-600/30 gap-2" disabled={loading}>
        <Send className="w-4 h-4" /> {loading ? 'Registrando...' : 'Registrar Ausencia'}
      </Button>
    </form>
  );
};
