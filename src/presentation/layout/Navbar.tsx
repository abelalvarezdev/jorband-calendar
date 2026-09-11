import React from 'react';
import { Calendar, UserX, CalendarPlus, User } from 'lucide-react';
import { UserRole } from '../../domain/types';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  userRole?: UserRole;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  userRole = 'User',
}) => {
  const tabs = [
    { id: 'calendar', label: 'Calendario', icon: Calendar, adminOnly: false },
    { id: 'absents', label: 'Ausencias', icon: UserX, adminOnly: false },
    { id: 'events', label: 'Eventos', icon: CalendarPlus, adminOnly: true },
    { id: 'profile', label: 'Perfil', icon: User, adminOnly: false },
  ];

  const visibleTabs = tabs.filter((t) => !t.adminOnly || userRole === 'Admin');

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/90 backdrop-blur-md border-t border-slate-800/80 px-2 py-1 max-w-md mx-auto">
      <div className="flex justify-around items-center">
        {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center py-2 px-3 rounded-2xl transition-all cursor-pointer ${
                isActive
                  ? 'text-indigo-400 font-semibold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : ''}`} />
              <span className="text-[11px] mt-1">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
