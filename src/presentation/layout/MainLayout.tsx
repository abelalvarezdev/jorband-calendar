import React, { useCallback } from 'react';
import { Header } from './Header';
import { Navbar } from './Navbar';
import { User } from '../../domain/types';
import { useNotificationClick } from '../calendar/hooks/useNotificationClick';
import { NotificationAlertBanner } from '../calendar/components/NotificationAlertBanner';

interface MainLayoutProps {
  children: React.ReactNode;
  currentUser: User | null;
  currentTab: string;
  onTabChange: (tab: string) => void;
}

const toIsoDate = (dateStr: string): string => {
  const parts = dateStr.split('-');
  return parts.length === 3 && parts[0].length === 2 ? `${parts[2]}-${parts[1]}-${parts[0]}` : dateStr;
};

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  currentUser,
  currentTab,
  onTabChange,
}) => {
  const handleSelectEventDate = useCallback(
    (dateStr: string) => {
      const isoDate = toIsoDate(dateStr);
      sessionStorage.setItem('jorband_selected_date', isoDate);
      onTabChange('calendar');
      window.dispatchEvent(new CustomEvent('jorband-select-date', { detail: isoDate }));
    },
    [onTabChange]
  );

  const { activeNotification, clearNotification } = useNotificationClick(handleSelectEventDate);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col max-w-md mx-auto shadow-2xl border-x border-slate-900">
      <Header userName={currentUser?.name} userRole={currentUser?.role} />
      <main className="flex-1 px-4 pt-4 pb-24 overflow-y-auto space-y-4">
        <NotificationAlertBanner
          notification={activeNotification}
          onDismiss={clearNotification}
          onSelectDate={handleSelectEventDate}
        />
        {children}
      </main>
      <Navbar currentTab={currentTab} onTabChange={onTabChange} userRole={currentUser?.role} />
    </div>
  );
};
