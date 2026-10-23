import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { sendToAllTokens } from './fcmSender';

interface EventDoc {
  date: string;
  eventName: string;
  time: string;
  principalSinger: string;
  isCancelled?: boolean;
  cancelReason?: string;
}

const toDayMonthYear = (isoDate: string): string => {
  const [year, month, day] = isoDate.split('-');
  return day && month && year ? `${day}-${month}-${year}` : isoDate;
};

export const onEventUpdated = onDocumentUpdated('events/{eventId}', async (event) => {
  const before = event.data?.before.data() as EventDoc | undefined;
  const after = event.data?.after.data() as EventDoc | undefined;
  if (!before || !after) return;

  const eventId = event.params.eventId;
  const formattedDate = toDayMonthYear(after.date);

  if (!before.isCancelled && after.isCancelled) {
    const reason = after.cancelReason || 'Sin motivo especificado';
    await sendToAllTokens(
      `⚠️ Evento Cancelado (${formattedDate})`,
      `${after.eventName} (${after.time}) fue cancelado. Motivo: ${reason}`,
      `cancel-${eventId}`
    );
    return;
  }

  if (!after.isCancelled) {
    await sendToAllTokens(
      `✏️ Evento Actualizado (${formattedDate})`,
      `${after.eventName} • ${after.time} • Voz principal: ${after.principalSinger}`,
      `edit-${eventId}-${Date.now()}`
    );
  }
});
