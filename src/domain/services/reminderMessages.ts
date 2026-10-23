import { Event, NotificationPayload } from '../types';

export const toDayMonthYear = (isoDate: string): string => {
  const [year, month, day] = isoDate.split('-');
  return day && month && year ? `${day}-${month}-${year}` : isoDate;
};

export const buildSingerReminderNotification = (
  event: Event,
  isToday: boolean
): NotificationPayload => {
  const formattedDate = toDayMonthYear(event.date);
  return {
    title: isToday
      ? '🎤 ¡Hoy eres Voz Principal!'
      : `🎤 Recordatorio: Mañana cantas (${formattedDate})`,
    body: `${event.eventName} a las ${event.time}. ¡Prepárate!`,
    tag: `reminder-singer-${event.id}-${event.date}`,
    eventDate: formattedDate,
    targetUserName: event.principalSinger,
  };
};

export const buildMemberTodayNotification = (
  event: Event
): NotificationPayload => {
  const formattedDate = toDayMonthYear(event.date);
  const notesText = event.notes ? ` • Notas: ${event.notes}` : '';
  return {
    title: `🎶 ¡Hoy tenemos Evento! (${formattedDate})`,
    body: `${event.eventName} (${event.time}) • Voz: ${event.principalSinger}${notesText}`,
    tag: `reminder-member-${event.id}-${event.date}`,
    eventDate: formattedDate,
  };
};
