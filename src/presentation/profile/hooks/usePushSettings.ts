import { useState, useEffect, useCallback } from 'react';
import { useRepositories } from '../../../infrastructure/di/RepositoryContext';
import { NotificationPermissionState, User } from '../../../domain/types';

export const usePushSettings = (user: User | null) => {
  const { notificationRepository } = useRepositories();
  const [permission, setPermission] = useState<NotificationPermissionState>(
    notificationRepository.getPermissionState()
  );
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!user) return;
    notificationRepository.isUserSubscribed(user.id).then(setSubscribed);
  }, [user, notificationRepository]);

  const toggleSubscription = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      if (subscribed) {
        await notificationRepository.unsubscribeUser(user.id);
        setSubscribed(false);
      } else {
        const token = await notificationRepository.subscribeUser(user);
        setPermission(notificationRepository.getPermissionState());
        setSubscribed(Boolean(token));
      }
    } finally {
      setLoading(false);
    }
  }, [user, subscribed, notificationRepository]);

  const sendTestPush = useCallback(async () => {
    await notificationRepository.sendNotification({
      title: '🔔 Notificaciones Jorband Activas',
      body: 'Recibirás alertas de eventos editados, cancelados y recordatorios de voz principal.',
      tag: 'test-push',
    });
  }, [notificationRepository]);

  return { permission, subscribed, loading, toggleSubscription, sendTestPush };
};
