import React from 'react';
import { useEventsForm } from './hooks/useEventsForm';
import { EventsHeader } from './components/EventsHeader';
import { DateMultiSelect } from './components/DateMultiSelect';
import { SingerSelector } from './components/SingerSelector';
import { ServiceNotesInput } from './components/ServiceNotesInput';
import { RestoreEventModal } from './components/RestoreEventModal';
import { EventConflictAlert } from './components/EventConflictAlert';
import { Input } from '../shared/Input';
import { Button } from '../shared/Button';
import { Toast } from '../shared/Toast';

export const EventsScreen: React.FC = () => {
  const form = useEventsForm();

  return (
    <div className="space-y-4">
      {form.toast && <Toast message={form.toast.message} type={form.toast.type} />}
      {form.eventToRestore && (
        <RestoreEventModal
          eventToRestore={form.eventToRestore}
          onConfirm={form.handleConfirmRestore}
          onCancel={() => form.setEventToRestore(null)}
          loading={form.loading}
        />
      )}
      <EventsHeader />
      <form onSubmit={form.handleSubmit} className="bg-slate-900/90 border border-slate-800 p-4 rounded-3xl space-y-4 shadow-xl">
        <Input label="Nombre del Evento" value={form.eventName} onChange={(e) => form.setEventName(e.target.value)} required />
        <Input label="Hora del Evento" value={form.eventTime} onChange={(e) => form.setEventTime(e.target.value)} required />
        <ServiceNotesInput notes={form.notes} setNotes={form.setNotes} />
        <SingerSelector members={form.members} principalSinger={form.principalSinger} setPrincipalSinger={form.setPrincipalSinger} isGuestSinger={form.isGuestSinger} setIsGuestSinger={form.setIsGuestSinger} guestSingerName={form.guestSingerName} setGuestSingerName={form.setGuestSingerName} />
        <DateMultiSelect existingEvents={form.monthEvents} year={form.currentYear} month={form.currentMonth} selectedDates={form.selectedDates} conflicts={form.conflicts} onToggleDate={form.toggleDateSelection} onSelectRecurring={form.selectRecurringDay} onPrevMonth={form.handlePrevMonth} onNextMonth={form.handleNextMonth} />
        <EventConflictAlert conflicts={form.conflicts} />
        <Button type="submit" variant="primary" className="w-full" disabled={form.loading || form.conflicts.length > 0}>
          {form.loading ? 'Guardando...' : `Guardar Eventos (${form.selectedDates.length})`}
        </Button>
      </form>
    </div>
  );
};
