import React from 'react';
import { ConflictInfo } from '../types/events.types';
import { AlertTriangle } from 'lucide-react';

interface EventConflictAlertProps {
  conflicts: ConflictInfo[];
}

export const EventConflictAlert: React.FC<EventConflictAlertProps> = ({
  conflicts,
}) => {
  if (conflicts.length === 0) return null;

  return (
    <div className="bg-rose-950/80 border border-rose-600/80 p-3.5 rounded-2xl space-y-2 shadow-xl animate-bounce">
      <div className="flex items-center gap-2 text-rose-300 font-extrabold text-xs">
        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
        <span>¡Alerta! Cantante no disponible</span>
      </div>
      <div className="space-y-1 pl-6">
        {conflicts.map((c) => {
          const [y, m, d] = c.date.split('-');
          return (
            <p key={c.date} className="text-xs text-rose-200">
              <strong className="text-white">{c.singerName}</strong> reportó ausencia el{' '}
              <span className="font-bold underline">{d}/{m}/{y}</span>: "{c.reason}"
            </p>
          );
        })}
      </div>
    </div>
  );
};
