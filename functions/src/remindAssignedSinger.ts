import { onSchedule } from 'firebase-functions/v2/scheduler';
import { db, sendToUserByName, sendToUsersExcept } from './fcmSender';

const getGuatemalaDateParts = (date: Date) => {
  const local = new Date(date.toLocaleString('en-US', { timeZone: 'America/Guatemala' }));
  const y = local.getFullYear();
  const m = String(local.getMonth() + 1).padStart(2, '0');
  const d = String(local.getDate()).padStart(2, '0');
  return { local, iso: `${y}-${m}-${d}`, hour: local.getHours() };
};

const toDayMonthYear = (iso: string): string => {
  const [y, m, d] = iso.split('-');
  return d && m && y ? `${d}-${m}-${y}` : iso;
};

export const remindAssignedSinger = onSchedule(
  { schedule: '0 10,16 * * *', timeZone: 'America/Guatemala' },
  async () => {
    const { local: today, iso: todayStr, hour } = getGuatemalaDateParts(new Date());
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const maxDateStr = hour >= 16 ? todayStr : getGuatemalaDateParts(tomorrow).iso;

    const snapshot = await db
      .collection('events')
      .where('date', '>=', todayStr)
      .where('date', '<=', maxDateStr)
      .get();

    for (const docSnap of snapshot.docs) {
      const evt = docSnap.data();
      if (evt.isCancelled || !evt.principalSinger) continue;
      const isToday = evt.date === todayStr;
      const formattedDate = toDayMonthYear(evt.date);
      const singerTitle = isToday ? '🎤 ¡Hoy eres Voz Principal!' : `🎤 Recordatorio: Mañana cantas (${formattedDate})`;
      await sendToUserByName(evt.principalSinger, singerTitle, `${evt.eventName} a las ${evt.time}. ¡Prepárate!`, `reminder-singer-${docSnap.id}-${evt.date}-${hour}`);

      if (isToday) {
        const notesText = evt.notes ? ` • Notas: ${evt.notes}` : '';
        const memberBody = `${evt.eventName} (${evt.time}) • Voz: ${evt.principalSinger}${notesText}`;
        await sendToUsersExcept(evt.principalSinger, `🎶 ¡Hoy tenemos Evento! (${formattedDate})`, memberBody, `reminder-member-${docSnap.id}-${evt.date}-${hour}`);
      }
    }
  }
);
