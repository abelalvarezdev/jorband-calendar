import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { sendToAllTokens } from './fcmSender';

interface EventDoc {
  date: string;
  eventName: string;
  time: string;
  principalSinger: string;
  isSpecialEvent?: boolean;
  notes?: string;
}

const toDayMonthYear = (isoDate: string): string => {
  const [year, month, day] = isoDate.split('-');
  return day && month && year ? `${day}-${month}-${year}` : isoDate;
};

export const onSpecialEventCreated = onDocumentCreated('events/{eventId}', async (event) => {
  const data = event.data?.data() as EventDoc | undefined;
  if (!data || !data.isSpecialEvent) return;

  const eventId = event.params.eventId;
  const formattedDate = toDayMonthYear(data.date);
  const notesText = data.notes ? ` • Notas: ${data.notes}` : '';

  await sendToAllTokens(
    `🌟 ¡Evento Especial Programado! (${formattedDate})`,
    `${data.eventName} (${data.time}) • Voz: ${data.principalSinger}${notesText}`,
    `special-${eventId}-${Date.now()}`
  );
});
