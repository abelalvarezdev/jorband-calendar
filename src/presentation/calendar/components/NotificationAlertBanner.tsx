import React from 'react';
import { BellRing, X, Calendar } from 'lucide-react';
import { NotificationPayload } from '../../../domain/types';

interface NotificationAlertBannerProps {
  notification: NotificationPayload | null;
  onDismiss: () => void;
  onSelectDate?: (dateStr: string) => void;
}

export const NotificationAlertBanner: React.FC<NotificationAlertBannerProps> = ({
  notification,
  onDismiss,
  onSelectDate,
}) => {
  if (!notification) return null;

  return (
    <div className="bg-indigo-950/90 border border-indigo-500/50 rounded-2xl p-3.5 shadow-lg shadow-indigo-950/50 flex items-start justify-between gap-3 animate-fade-in">
      <div className="flex items-start gap-2.5">
        <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 shrink-0 mt-0.5">
          <BellRing className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-extrabold text-white">{notification.title}</h4>
          <p className="text-xs text-indigo-200 leading-relaxed">{notification.body}</p>
          {notification.eventDate && onSelectDate && (
            <button
              type="button"
              onClick={() => onSelectDate(notification.eventDate!)}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:underline pt-0.5"
            >
              <Calendar className="w-3 h-3" /> Ver fecha: {notification.eventDate}
            </button>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
        aria-label="Cerrar alerta"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
