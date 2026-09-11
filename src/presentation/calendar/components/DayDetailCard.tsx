import React from 'react';
import { DayData } from '../types/calendar.types';
import { Badge } from '../../shared/Badge';
import { Calendar, Mic, UserX, Clock, Sparkles } from 'lucide-react';

export const DayDetailCard: React.FC<{ dayData: DayData }> = ({ dayData }) => {
  const { dateStr = '', event, absents = [] } = dayData;
  const parts = dateStr.split('-');
  const [y, m, d] = parts.length === 3 ? parts : ['', '', ''];

  return (
    <div className="mt-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
        <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-indigo-400" /><h3 className="text-sm font-bold text-white">Detalle del {d}/{m}/{y}</h3></div>
        {event ? <Badge variant={event.isGuestSinger ? 'amber' : 'indigo'}>Evento Programado</Badge> : <Badge variant="slate">Sin Evento</Badge>}
      </div>
      {event && (
        <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/60 space-y-2">
          <div className="flex justify-between items-start"><h4 className="text-sm font-extrabold text-indigo-300">{event.eventName}</h4><span className="text-xs text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" />{event.time}</span></div>
          <div className="flex items-center gap-2 pt-1"><Mic className="w-4 h-4 text-amber-400 shrink-0" /><span className="text-xs text-slate-300">Cantante:</span><span className="text-xs font-bold text-white flex items-center gap-1">{event.principalSinger || 'Sin cantante'}{event.isGuestSinger && <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded-full border border-amber-500/30 flex items-center gap-0.5"><Sparkles className="w-2.5 h-2.5" />Invitado</span>}</span></div>
        </div>
      )}
      <div className="space-y-2 pt-1">
        <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5"><UserX className="w-3.5 h-3.5 text-rose-400" />Integrantes Ausentes ({absents.length})</h4>
        {absents.length === 0 ? <p className="text-xs text-slate-500 italic pl-5">No hay ausencias reportadas para este día.</p> : (
          <div className="space-y-1.5">
            {absents.map((a) => (
              <div key={a.id} className="bg-rose-950/20 border border-rose-900/30 p-2 rounded-xl flex items-center justify-between text-xs">
                <span className="font-semibold text-rose-200">{a.userName}</span><span className="text-[11px] text-slate-400 italic max-w-[180px] truncate">{a.reason}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
