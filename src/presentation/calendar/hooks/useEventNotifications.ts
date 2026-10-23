import { useEffect, useCallback } from 'react';
import { Event, User } from '../../../domain/types';
import { NotificationRepository } from '../../../domain/ports/NotificationRepository';
import { buildCancelNotification, buildEditNotification } from '../../../domain/services/notificationMessages';
import {
  buildSingerReminderNotification,
  buildMemberTodayNotification,
} from '../../../domain/services/reminderMessages';
import { findUpcomingSingerEvents } from '../../../domain/services/singerReminderMatcher';

const REMINDER_STORAGE_KEY = 'jorband_singer_reminders_sent';

export const useEventNotifications = (
  notificationRepository: NotificationRepository,
  events: Event[],
  currentUser: User | null
) => {
  useEffect(() => {
    if (!currentUser || events.length === 0) return;
    const matches = findUpcomingSingerEvents(events, currentUser.name);
    if (matches.length === 0) return;

    const sentRaw = sessionStorage.getItem(REMINDER_STORAGE_KEY);
    const sentTags: string[] = sentRaw ? JSON.parse(sentRaw) : [];

    matches.forEach(({ event, isToday, isPrincipalSinger }) => {
      const payload = isPrincipalSinger
        ? buildSingerReminderNotification(event, isToday)
        : buildMemberTodayNotification(event);
      if (!sentTags.includes(payload.tag)) {
        sentTags.push(payload.tag);
        notificationRepository.sendNotification(payload);
      }
    });
    sessionStorage.setItem(REMINDER_STORAGE_KEY, JSON.stringify(sentTags));
  }, [events, currentUser, notificationRepository]);

  const notifyEventEdited = useCallback(
    async (event: Event, updates: Partial<Event>) => {
      await notificationRepository.sendNotification(buildEditNotification(event, updates));
    },
    [notificationRepository]
  );

  const notifyEventCancelled = useCallback(
    async (event: Event, reason: string) => {
      await notificationRepository.sendNotification(buildCancelNotification(event, reason));
    },
    [notificationRepository]
  );

  return { notifyEventEdited, notifyEventCancelled };
};
