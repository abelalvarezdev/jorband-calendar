import { Event, NotificationPayload } from '../types';
import { toDayMonthYear } from './reminderMessages';

export const buildCancelNotification = (
  event: Event,
  reason: string
): NotificationPayload => {
  const formattedDate = toDayMonthYear(event.date);
  return {
    title: `⚠️ Evento Cancelado (${formattedDate})`,
    body: `${event.eventName} (${event.time}) fue cancelado. Motivo: ${reason}`,
    tag: `cancel-${event.id}`,
    eventDate: formattedDate,
  };
};

export const buildEditNotification = (
  event: Event,
  updates: Partial<Event>
): NotificationPayload => {
  const formattedDate = toDayMonthYear(event.date);
  const name = updates.eventName ?? event.eventName;
  const time = updates.time ?? event.time;
  const singer = updates.principalSinger ?? event.principalSinger;
  return {
    title: `✏️ Evento Actualizado (${formattedDate})`,
    body: `${name} • ${time} • Voz principal: ${singer}`,
    tag: `edit-${event.id}-${Date.now()}`,
    eventDate: formattedDate,
  };
};
