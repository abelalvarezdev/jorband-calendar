import React, { useState } from 'react';
import { RepositoryProvider } from './infrastructure/di/RepositoryContext';
import { AuthProvider, useAuth } from './presentation/auth/context/AuthContext';
import { AuthScreen } from './presentation/auth/AuthScreen';
import { MainLayout } from './presentation/layout/MainLayout';
import { CalendarScreen } from './presentation/calendar/CalendarScreen';
import { AbsentScreen } from './presentation/absents/AbsentScreen';
import { EventsScreen } from './presentation/events/EventsScreen';
import { ProfileScreen } from './presentation/profile/ProfileScreen';

const MainAppContent: React.FC = () => {
  const auth = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('calendar');

  if (auth.loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs animate-pulse">
        Cargando Jorband PWA...
      </div>
    );
  }

  if (!auth.currentUser) {
    return <AuthScreen />;
  }

  return (
    <MainLayout
      currentUser={auth.currentUser}
      currentTab={currentTab}
      onTabChange={setCurrentTab}
    >
      {currentTab === 'calendar' && <CalendarScreen />}
      {currentTab === 'absents' && <AbsentScreen currentUser={auth.currentUser} />}
      {currentTab === 'events' && <EventsScreen />}
      {currentTab === 'profile' && (
        <ProfileScreen currentUser={auth.currentUser} onLogout={auth.logout} />
      )}
    </MainLayout>
  );
};

export const App: React.FC = () => {
  return (
    <RepositoryProvider>
      <AuthProvider>
        <MainAppContent />
      </AuthProvider>
    </RepositoryProvider>
  );
};

export default App;
