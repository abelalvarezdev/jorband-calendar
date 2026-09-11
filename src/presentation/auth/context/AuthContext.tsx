import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRepositories } from '../../../infrastructure/di/RepositoryContext';
import { User, LoginCredentials, RegisterData } from '../../../domain/types';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  setError: (err: string | null) => void;
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (data: RegisterData) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { authRepository } = useRepositories();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    authRepository
      .getCurrentUser()
      .then((user) => setCurrentUser(user))
      .catch(() => setCurrentUser(null))
      .finally(() => setLoading(false));
  }, [authRepository]);

  const login = async (credentials: LoginCredentials): Promise<User> => {
    setError(null);
    setLoading(true);
    try {
      const user = await authRepository.login(credentials);
      setCurrentUser(user);
      return user;
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<User> => {
    setError(null);
    setLoading(true);
    try {
      const user = await authRepository.register(data);
      setCurrentUser(user);
      return user;
    } catch (err: any) {
      setError(err.message || 'Error al registrarse');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authRepository.logout();
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        error,
        setError,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
