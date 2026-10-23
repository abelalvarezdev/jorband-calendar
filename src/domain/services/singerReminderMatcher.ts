import { Event } from '../types';

const formatIsoDate = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export interface UpcomingEventMatch {
  event: Event;
  isToday: boolean;
  isPrincipalSinger: boolean;
}

export const findUpcomingSingerEvents = (
  events: Event[],
  userName: string,
  daysAhead = 1
): UpcomingEventMatch[] => {
  const normalizedUser = userName.trim().toLowerCase();
  if (!normalizedUser) return [];

  const today = new Date();
  const todayStr = formatIsoDate(today);
  const limitDate = new Date(today);
  limitDate.setDate(today.getDate() + daysAhead);
  const limitStr = formatIsoDate(limitDate);

  return events
    .filter((evt) => {
      if (evt.isCancelled) return false;
      const isSinger = evt.principalSinger.trim().toLowerCase() === normalizedUser;
      return isSinger
        ? evt.date >= todayStr && evt.date <= limitStr
        : evt.date === todayStr;
    })
    .map((event) => ({
      event,
      isToday: event.date === todayStr,
      isPrincipalSinger: event.principalSinger.trim().toLowerCase() === normalizedUser,
    }));
};
