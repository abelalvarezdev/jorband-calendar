import React from 'react';
import { Header } from './Header';
import { Navbar } from './Navbar';
import { User } from '../../domain/types';

interface MainLayoutProps {
  children: React.ReactNode;
  currentUser: User | null;
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  currentUser,
  currentTab,
  onTabChange,
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col max-w-md mx-auto shadow-2xl border-x border-slate-900">
      <Header userName={currentUser?.name} userRole={currentUser?.role} />
      <main className="flex-1 px-4 pt-4 pb-24 overflow-y-auto">{children}</main>
      <Navbar
        currentTab={currentTab}
        onTabChange={onTabChange}
        userRole={currentUser?.role}
      />
    </div>
  );
};
