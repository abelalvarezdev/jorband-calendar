import React, { useState } from 'react';
import { Button } from '../../shared/Button';
import { Input } from '../../shared/Input';
import { Event, User } from '../../../domain/types';
import { Edit, Calendar } from 'lucide-react';
import { SingerSelector } from '../../events/components/SingerSelector';

interface EditEventModalProps {
  eventToEdit: Event;
  members: User[];
  onSave: (updates: Partial<Event>) => void;
  onClose: () => void;
  loading: boolean;
}

export const EditEventModal: React.FC<EditEventModalProps> = ({
  eventToEdit, members, onSave, onClose, loading,
}) => {
  const [eventName, setEventName] = useState(eventToEdit.eventName);
  const [time, setTime] = useState(eventToEdit.time);
  const [notes, setNotes] = useState(eventToEdit.notes || '');
  const [principalSinger, setPrincipalSinger] = useState(eventToEdit.principalSinger);
  const [isGuestSinger, setIsGuestSinger] = useState(eventToEdit.isGuestSinger);
  const [guestSingerName, setGuestSingerName] = useState(eventToEdit.isGuestSinger ? eventToEdit.principalSinger : '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const activeSinger = isGuestSinger ? guestSingerName.trim() : principalSinger;
    if (!activeSinger) return;
    onSave({ eventName: eventName.trim(), time, principalSinger: activeSinger, isGuestSinger, notes: notes.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-3 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm"><Edit className="w-4 h-4" /><h3>Editar Evento</h3></div>
          <span className="text-xs text-slate-400 flex items-center gap-1 font-semibold"><Calendar className="w-3 h-3 text-slate-500" />{eventToEdit.date}</span>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input label="Nombre del Evento" value={eventName} onChange={(e) => setEventName(e.target.value)} required />
          <Input label="Hora" value={time} onChange={(e) => setTime(e.target.value)} required />
          <Input label="Notas de Servicio" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Instrucciones opcionales..." />
          <SingerSelector members={members} principalSinger={principalSinger} setPrincipalSinger={setPrincipalSinger} isGuestSinger={isGuestSinger} setIsGuestSinger={setIsGuestSinger} guestSingerName={guestSingerName} setGuestSingerName={setGuestSingerName} />
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>Cancelar</Button>
            <Button type="submit" variant="primary" disabled={loading}>{loading ? 'Guardando...' : 'Guardar Cambios'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
