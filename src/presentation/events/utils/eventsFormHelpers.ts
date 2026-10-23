import { Absent, User } from '../../../domain/types';
import { ConflictInfo } from '../types/events.types';

export const getRecurringDatesInMonth = (
  year: number,
  month: number,
  dayOfWeek: number
): string[] => {
  const dates: string[] = [];
  const daysInMonth = new Date(year, month, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    if (new Date(year, month - 1, d).getDay() === dayOfWeek) {
      dates.push(`${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
    }
  }
  return dates;
};

export const findSingerConflicts = (
  activeSingerName: string,
  isGuestSinger: boolean,
  selectedDates: string[],
  members: User[],
  monthAbsents: Absent[]
): ConflictInfo[] => {
  if (!activeSingerName || isGuestSinger || selectedDates.length === 0) return [];
  const user = members.find((m) => m.name.toLowerCase() === activeSingerName.toLowerCase());
  if (!user) return [];
  const found: ConflictInfo[] = [];
  selectedDates.forEach((dateStr) => {
    const abs = monthAbsents.find((a) => a.userId === user.id && a.date === dateStr);
    if (abs) found.push({ date: dateStr, singerName: user.name, reason: abs.reason });
  });
  return found;
};
