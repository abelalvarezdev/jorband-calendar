self.addEventListener('push', (event) => {
  if (!event.data) return;
  try {
    const raw = event.data.json();
    const notification = raw.notification || raw.data || {};
    const title = notification.title || 'Jorband Calendario';
    const body = notification.body || '';
    const eventDate = raw.data?.eventDate || notification.eventDate || '';
    const payload = { title, body, tag: notification.tag || 'jorband-push', eventDate };
    event.waitUntil(
      self.registration.showNotification(title, {
        body,
        icon: '/pwa-192x192.png',
        tag: payload.tag,
        data: payload,
      })
    );
  } catch {
    const body = event.data.text();
    event.waitUntil(
      self.registration.showNotification('Jorband', {
        body,
        data: { title: 'Jorband', body, tag: 'jorband-push' },
      })
    );
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const data = event.notification.data || {
    title: event.notification.title,
    body: event.notification.body,
  };
  const params = new URLSearchParams({
    notifTitle: data.title || 'Notificación Jorband',
    notifBody: data.body || '',
    ...(data.eventDate ? { eventDate: data.eventDate } : {}),
  });
  const targetUrl = `/?${params.toString()}`;

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      if (clients.length > 0) {
        clients[0].postMessage({ type: 'NOTIFICATION_CLICK', payload: data });
        return 'focus' in clients[0] ? clients[0].focus() : undefined;
      }
      return self.clients.openWindow(targetUrl);
    })
  );
});
