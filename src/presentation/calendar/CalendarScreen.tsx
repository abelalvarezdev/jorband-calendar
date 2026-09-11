import React from 'react';
import { useCalendar } from './hooks/useCalendar';
import { CalendarHeader } from './components/CalendarHeader';
import { CalendarGrid } from './components/CalendarGrid';
import { DayDetailCard } from './components/DayDetailCard';
import { EditEventModal } from './components/EditEventModal';
import { CancelEventModal } from './components/CancelEventModal';

export const CalendarScreen: React.FC = () => {
  const calendar = useCalendar();

  return (
    <div className="space-y-4">
      {calendar.editingEvent && (
        <EditEventModal eventToEdit={calendar.editingEvent} members={calendar.members} onSave={calendar.handleSaveEdit} onClose={() => calendar.setEditingEvent(null)} loading={calendar.actionLoading} />
      )}
      {calendar.cancellingEvent && (
        <CancelEventModal eventToCancel={calendar.cancellingEvent} onConfirm={calendar.handleConfirmCancel} onClose={() => calendar.setCancellingEvent(null)} loading={calendar.actionLoading} />
      )}
      <CalendarHeader year={calendar.currentYear} month={calendar.currentMonth} showAbsents={calendar.showAbsentsView} onToggleView={calendar.setShowAbsentsView} onPrev={calendar.handlePrevMonth} onNext={calendar.handleNextMonth} />
      {calendar.loading ? (
        <div className="py-12 text-center text-xs text-slate-500 animate-pulse">Cargando calendario...</div>
      ) : (
        <>
          <CalendarGrid days={calendar.daysGrid} selectedDateStr={calendar.selectedDateStr} showAbsents={calendar.showAbsentsView} onSelectDate={calendar.setSelectedDateStr} />
          <DayDetailCard dayData={calendar.selectedDayData} isAdmin={calendar.isAdmin} onEdit={() => calendar.selectedDayData.event && calendar.setEditingEvent(calendar.selectedDayData.event)} onCancel={() => calendar.selectedDayData.event && calendar.setCancellingEvent(calendar.selectedDayData.event)} />
        </>
      )}
    </div>
  );
};
