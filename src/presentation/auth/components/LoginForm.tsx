import React from 'react';
import { Input } from '../../shared/Input';
import { Button } from '../../shared/Button';

interface LoginFormProps {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onSwitchMode: () => void;
  loading: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  email, setEmail, password, setPassword, onSubmit, onSwitchMode, loading,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <Input label="Correo Electrónico" type="email" placeholder="admin@jorband.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <Input label="Contraseña" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <div className="flex gap-1.5 pt-1">
        <button type="button" onClick={() => { setEmail('admin@jorband.com'); setPassword('123456'); }} className="flex-1 py-1 text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-lg font-bold hover:bg-indigo-500/30 transition-all cursor-pointer">Demo Admin</button>
        <button type="button" onClick={() => { setEmail('maria@jorband.com'); setPassword('123456'); }} className="flex-1 py-1 text-[10px] bg-slate-800 text-slate-300 border border-slate-700 rounded-lg font-bold hover:bg-slate-700 transition-all cursor-pointer">Demo Integrante</button>
      </div>
      <Button type="submit" className="w-full mt-2" disabled={loading}>
        {loading ? 'Ingresando...' : 'Iniciar Sesión'}
      </Button>
      <div className="text-center pt-1">
        <button type="button" onClick={onSwitchMode} className="text-xs text-indigo-400 hover:underline cursor-pointer">
          ¿No tienes cuenta? Regístrate aquí
        </button>
      </div>
    </form>
  );
};
