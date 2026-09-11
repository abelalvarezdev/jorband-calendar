import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { AuthHeader } from './components/AuthHeader';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { Toast } from '../shared/Toast';
import { UserRole } from '../../domain/types';

export const AuthScreen: React.FC = () => {
  const auth = useAuth();
  const [isLoginMode, setIsLoginMode] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [role, setRole] = useState<UserRole>('User');
  const [instrument, setInstrument] = useState<string>('Voz Principal');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return auth.setError('Ingresa tu correo electrónico');
    try { await auth.login({ email, password }); } catch {}
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return auth.setError('Nombre y correo son requeridos');
    try { await auth.register({ name, email, password, role, instrument }); } catch {}
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
      <div className="w-full max-w-sm bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
        {auth.error && <Toast message={auth.error} type="error" />}
        <AuthHeader isLoginMode={isLoginMode} />
        {isLoginMode ? (
          <LoginForm email={email} setEmail={setEmail} password={password} setPassword={setPassword} onSubmit={handleLoginSubmit} onSwitchMode={() => setIsLoginMode(false)} loading={auth.loading} />
        ) : (
          <RegisterForm name={name} setName={setName} email={email} setEmail={setEmail} password={password} setPassword={setPassword} role={role} setRole={setRole} instrument={instrument} setInstrument={setInstrument} onSubmit={handleRegisterSubmit} onSwitchMode={() => setIsLoginMode(true)} loading={auth.loading} />
        )}
      </div>
    </div>
  );
};
