import { NotificationRepository } from '../../domain/ports/NotificationRepository';
import { NotificationPermissionState } from '../../domain/types';

export class InMemoryNotificationRepository implements NotificationRepository {
  getPermissionState(): NotificationPermissionState {
    return 'unsupported';
  }

  async subscribeUser(): Promise<string | null> {
    return null;
  }

  async unsubscribeUser(): Promise<void> {}

  async isUserSubscribed(): Promise<boolean> {
    return false;
  }

  async sendNotification(): Promise<void> {}
}
