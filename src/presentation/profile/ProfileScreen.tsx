import React from 'react';
import { ProfileCard } from './components/ProfileCard';
import { User } from '../../domain/types';

export const ProfileScreen: React.FC<{ currentUser: User | null; onLogout: () => void }> = ({
  currentUser,
  onLogout,
}) => {
  return (
    <div className="py-4">
      <ProfileCard user={currentUser} onLogout={onLogout} />
    </div>
  );
};
