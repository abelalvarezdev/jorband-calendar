import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebaseClient';
import { NotificationPayload } from '../../domain/types';

export const ACTIVE_NOTIFICATION_KEY = 'jorband_active_notification';

export const dispatchSwNotification = async (
  payload: NotificationPayload
): Promise<void> => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACTIVE_NOTIFICATION_KEY, JSON.stringify(payload));
  window.dispatchEvent(new CustomEvent('jorband-notification', { detail: payload }));

  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  const reg = await navigator.serviceWorker?.getRegistration();
  if (reg && 'showNotification' in reg) {
    await reg.showNotification(payload.title, {
      body: payload.body,
      tag: payload.tag,
      icon: '/pwa-192x192.png',
      data: payload,
    });
    return;
  }
  new Notification(payload.title, { body: payload.body, tag: payload.tag, data: payload });
};

export const queueFirestoreNotification = async (
  payload: NotificationPayload
): Promise<void> => {
  await addDoc(collection(db, 'notifications'), {
    ...payload,
    createdAt: new Date().toISOString(),
  }).catch(() => undefined);
};
