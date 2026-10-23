import { useState, useEffect, useCallback } from 'react';
import { NotificationPayload } from '../../../domain/types';
import { ACTIVE_NOTIFICATION_KEY } from '../../../infrastructure/firebase/swNotificationHelper';

export const useNotificationClick = (onSelectEventDate: (dateStr: string) => void) => {
  const [activeNotification, setActiveNotification] = useState<NotificationPayload | null>(() => {
    const params = new URLSearchParams(window.location.search);
    const title = params.get('notifTitle');
    const body = params.get('notifBody');
    const eventDate = params.get('eventDate') || undefined;
    if (title && body) {
      window.history.replaceState({}, '', window.location.pathname);
      return { title, body, tag: 'url-notif', eventDate };
    }
    const stored = localStorage.getItem(ACTIVE_NOTIFICATION_KEY);
    return stored ? (JSON.parse(stored) as NotificationPayload) : null;
  });

  const applyNotification = useCallback(
    (payload: NotificationPayload) => {
      setActiveNotification(payload);
      if (payload.eventDate) onSelectEventDate(payload.eventDate);
    },
    [onSelectEventDate]
  );

  useEffect(() => {
    if (activeNotification?.eventDate) onSelectEventDate(activeNotification.eventDate);
  }, [activeNotification, onSelectEventDate]);

  useEffect(() => {
    const onSwMessage = (event: MessageEvent) => {
      if (event.data?.type === 'NOTIFICATION_CLICK' && event.data.payload) {
        applyNotification(event.data.payload);
      }
    };
    const onCustom = (event: Event) => {
      const custom = event as CustomEvent<NotificationPayload>;
      if (custom.detail) applyNotification(custom.detail);
    };
    navigator.serviceWorker?.addEventListener('message', onSwMessage);
    window.addEventListener('jorband-notification', onCustom);
    return () => {
      navigator.serviceWorker?.removeEventListener('message', onSwMessage);
      window.removeEventListener('jorband-notification', onCustom);
    };
  }, [applyNotification]);

  const clearNotification = () => {
    localStorage.removeItem(ACTIVE_NOTIFICATION_KEY);
    setActiveNotification(null);
  };

  return { activeNotification, clearNotification };
};
