import { Event, Absent } from '../../../domain/types';
import { DayData } from '../types/calendar.types';

const pad2 = (n: number): string => String(n).padStart(2, '0');

export const buildCalendarDaysGrid = (
  year: number,
  month: number,
  events: Event[],
  absents: Absent[],
  todayStr: string
): DayData[] => {
  const days: DayData[] = [];
  const startDayIndex = new Date(year, month - 1, 1).getDay();
  const totalDays = new Date(year, month, 0).getDate();
  const prevMonthLastDay = new Date(year, month - 1, 0).getDate();
  const prevM = month === 1 ? 12 : month - 1;
  const prevY = month === 1 ? year - 1 : year;

  for (let i = startDayIndex - 1; i >= 0; i--) {
    const dNum = prevMonthLastDay - i;
    days.push({ dateStr: `${prevY}-${pad2(prevM)}-${pad2(dNum)}`, dayNumber: dNum, isCurrentMonth: false, isToday: false, absents: [] });
  }
  for (let d = 1; d <= totalDays; d++) {
    const dateStr = `${year}-${pad2(month)}-${pad2(d)}`;
    days.push({ dateStr, dayNumber: d, isCurrentMonth: true, isToday: dateStr === todayStr, event: events.find((e) => e.date === dateStr), absents: absents.filter((a) => a.date === dateStr) });
  }
  return days;
};

export const resolveSelectedDay = (
  selectedDateStr: string,
  daysGrid: DayData[],
  events: Event[],
  absents: Absent[],
  todayStr: string
): DayData =>
  daysGrid.find((d) => d.dateStr === selectedDateStr) || {
    dateStr: selectedDateStr,
    dayNumber: Number(selectedDateStr.split('-')[2] || 1),
    isCurrentMonth: true,
    isToday: selectedDateStr === todayStr,
    event: events.find((e) => e.date === selectedDateStr),
    absents: absents.filter((a) => a.date === selectedDateStr),
  };
