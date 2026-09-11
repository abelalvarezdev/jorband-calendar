import { Event, Absent } from '../../../domain/types';

export type CalendarViewMode = 'events' | 'absents';

export interface DayData {
  dateStr: string; // YYYY-MM-DD
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  event?: Event;
  absents: Absent[];
}
