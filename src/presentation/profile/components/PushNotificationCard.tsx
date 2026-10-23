import React from 'react';
import { Bell, BellRing } from 'lucide-react';
import { User } from '../../../domain/types';
import { Switch } from '../../shared/Switch';
import { Button } from '../../shared/Button';
import { Badge } from '../../shared/Badge';
import { usePushSettings } from '../hooks/usePushSettings';

export const PushNotificationCard: React.FC<{ user: User | null }> = ({ user }) => {
  const { permission, subscribed, loading, toggleSubscription, sendTestPush } =
    usePushSettings(user);

  if (!user || permission === 'unsupported') return null;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <Bell className="w-4 h-4 text-indigo-400" />
          <span>Notificaciones Push</span>
        </div>
        <Badge variant={subscribed ? 'emerald' : 'slate'}>
          {subscribed ? 'Activas' : permission === 'denied' ? 'Bloqueadas' : 'Inactivas'}
        </Badge>
      </div>
      <p className="text-xs text-slate-400">
        Recibe alertas cuando se edite o cancele un evento y recordatorios cuando seas Voz Principal.
      </p>
      <Switch
        labelLeft="Desactivadas"
        labelRight="Activadas"
        checked={subscribed}
        onChange={(next) => {
          if (next !== subscribed) toggleSubscription();
        }}
      />
      {subscribed && (
        <Button variant="secondary" className="w-full gap-2 text-xs" onClick={sendTestPush} disabled={loading}>
          <BellRing className="w-3.5 h-3.5 text-indigo-400" /> Probar Notificación
        </Button>
      )}
    </div>
  );
};
