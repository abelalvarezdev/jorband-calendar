import { NotificationRepository } from '../../domain/ports/NotificationRepository';
import { NotificationPayload, NotificationPermissionState, User } from '../../domain/types';
import { saveUserPushToken, removeUserPushToken, hasUserPushToken } from './fcmTokenService';
import { dispatchSwNotification, queueFirestoreNotification } from './swNotificationHelper';

export class FirebaseNotificationRepository implements NotificationRepository {
  getPermissionState(): NotificationPermissionState {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'unsupported';
    }
    return Notification.permission;
  }

  async subscribeUser(user: User): Promise<string | null> {
    if (this.getPermissionState() === 'unsupported') return null;
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return null;
    return saveUserPushToken(user).catch(() => `sw-local-${user.id}`);
  }

  async unsubscribeUser(userId: string): Promise<void> {
    await removeUserPushToken(userId).catch(() => undefined);
  }

  async isUserSubscribed(userId: string): Promise<boolean> {
    if (this.getPermissionState() !== 'granted') return false;
    return hasUserPushToken(userId).catch(() => true);
  }

  async sendNotification(payload: NotificationPayload): Promise<void> {
    await Promise.all([
      dispatchSwNotification(payload),
      queueFirestoreNotification(payload),
    ]);
  }
}
