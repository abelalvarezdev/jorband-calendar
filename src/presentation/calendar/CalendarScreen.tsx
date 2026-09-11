import React from 'react';
import { useCalendar } from './hooks/useCalendar';
import { CalendarHeader } from './components/CalendarHeader';
import { CalendarGrid } from './components/CalendarGrid';
import { DayDetailCard } from './components/DayDetailCard';

export const CalendarScreen: React.FC = () => {
  const calendar = useCalendar();

  return (
    <div className="space-y-4">
      <CalendarHeader
        year={calendar.currentYear}
        month={calendar.currentMonth}
        showAbsents={calendar.showAbsentsView}
        onToggleView={calendar.setShowAbsentsView}
        onPrev={calendar.handlePrevMonth}
        onNext={calendar.handleNextMonth}
      />
      {calendar.loading ? (
        <div className="py-12 text-center text-xs text-slate-500 animate-pulse">
          Cargando calendario...
        </div>
      ) : (
        <>
          <CalendarGrid
            days={calendar.daysGrid}
            selectedDateStr={calendar.selectedDateStr}
            showAbsents={calendar.showAbsentsView}
            onSelectDate={calendar.setSelectedDateStr}
          />
          <DayDetailCard dayData={calendar.selectedDayData} />
        </>
      )}
    </div>
  );
};
