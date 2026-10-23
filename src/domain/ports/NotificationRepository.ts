import { NotificationPayload, NotificationPermissionState, User } from '../types';

export interface NotificationRepository {
  getPermissionState(): NotificationPermissionState;
  subscribeUser(user: User): Promise<string | null>;
  unsubscribeUser(userId: string): Promise<void>;
  isUserSubscribed(userId: string): Promise<boolean>;
  sendNotification(payload: NotificationPayload): Promise<void>;
}
