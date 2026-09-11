import React from 'react';
import { Button } from '../../shared/Button';
import { RotateCcw, AlertTriangle } from 'lucide-react';
import { Event } from '../../../domain/types';

interface RestoreEventModalProps {
  eventToRestore: Event;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

export const RestoreEventModal: React.FC<RestoreEventModalProps> = ({
  eventToRestore,
  onConfirm,
  onCancel,
  loading,
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
    <div className="w-full max-w-sm bg-slate-900 border border-amber-500/40 rounded-3xl p-5 shadow-2xl space-y-4">
      <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
        <AlertTriangle className="w-5 h-5 shrink-0" />
        <h3>Restaurar Evento Cancelado</h3>
      </div>
      <p className="text-xs text-slate-300 leading-relaxed">
        La fecha <strong className="text-amber-300">{eventToRestore.date}</strong> tiene un evento cancelado (<em className="italic">{eventToRestore.eventName}</em>). ¿Deseas reactivarlo y actualizarlo con los datos del nuevo formulario?
      </p>
      <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="button" variant="primary" onClick={onConfirm} disabled={loading} className="bg-amber-600 hover:bg-amber-500 text-white">
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          {loading ? 'Restaurando...' : 'Restaurar y Actualizar'}
        </Button>
      </div>
    </div>
  </div>
);
