import React from 'react';
import { ProfileCard } from './components/ProfileCard';
import { PushNotificationCard } from './components/PushNotificationCard';
import { User } from '../../domain/types';

export const ProfileScreen: React.FC<{ currentUser: User | null; onLogout: () => void }> = ({
  currentUser,
  onLogout,
}) => {
  return (
    <div className="py-4 space-y-4">
      <ProfileCard user={currentUser} onLogout={onLogout} />
      <PushNotificationCard user={currentUser} />
    </div>
  );
};
