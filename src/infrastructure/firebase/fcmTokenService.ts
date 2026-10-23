import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { getToken } from 'firebase/messaging';
import { db, getMessagingInstance } from './firebaseClient';
import { User } from '../../domain/types';

const TOKENS_COLLECTION = 'user_tokens';

const resolveFcmToken = async (): Promise<string> => {
  const messaging = await getMessagingInstance();
  const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
  if (!messaging || !vapidKey) return `sw-local-${Date.now()}`;
  const swReg = await navigator.serviceWorker?.register('/firebase-messaging-sw.js');
  return getToken(messaging, { vapidKey, serviceWorkerRegistration: swReg });
};

export const saveUserPushToken = async (user: User): Promise<string> => {
  const token = await resolveFcmToken().catch(() => `sw-local-${user.id}`);
  await setDoc(doc(db, TOKENS_COLLECTION, user.id), {
    userId: user.id,
    userName: user.name,
    role: user.role,
    token,
    updatedAt: new Date().toISOString(),
  });
  return token;
};

export const removeUserPushToken = async (userId: string): Promise<void> => {
  await deleteDoc(doc(db, TOKENS_COLLECTION, userId));
};

export const hasUserPushToken = async (userId: string): Promise<boolean> => {
  const snap = await getDoc(doc(db, TOKENS_COLLECTION, userId));
  return snap.exists();
};
