import { useAuth } from '../../auth/hooks/useAuth';

export const useProfile = () => {
  const auth = useAuth();
  return {
    user: auth.currentUser,
    handleLogout: auth.logout,
  };
};
