import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success' }) => {
  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl shadow-2xl border text-sm font-medium transition-all animate-bounce ${
        type === 'success'
          ? 'bg-emerald-950/90 text-emerald-200 border-emerald-800/80 shadow-emerald-900/30'
          : 'bg-rose-950/90 text-rose-200 border-rose-800/80 shadow-rose-900/30'
      }`}
    >
      {type === 'success' ? (
        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
      )}
      <span>{message}</span>
    </div>
  );
};
