import React, { useState } from 'react';
import { Button } from '../../shared/Button';
import { Input } from '../../shared/Input';
import { XCircle } from 'lucide-react';
import { Event } from '../../../domain/types';

interface CancelEventModalProps {
  eventToCancel: Event;
  onConfirm: (reason: string) => void;
  onClose: () => void;
  loading: boolean;
}

export const CancelEventModal: React.FC<CancelEventModalProps> = ({
  eventToCancel, onConfirm, onClose, loading,
}) => {
  const [reason, setReason] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    onConfirm(reason.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-slate-900 border border-rose-500/40 rounded-3xl p-5 shadow-2xl space-y-4">
        <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
          <XCircle className="w-5 h-5 shrink-0" />
          <h3>Cancelar Evento ({eventToCancel.date})</h3>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            label="Motivo de Cancelación"
            placeholder="Ej: Lluvia, suspensión de culto..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
              Volver
            </Button>
            <Button type="submit" variant="danger" disabled={loading || !reason.trim()}>
              {loading ? 'Cancelando...' : 'Confirmar Cancelación'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
