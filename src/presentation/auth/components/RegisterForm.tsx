import React from 'react';
import { Input } from '../../shared/Input';
import { Select } from '../../shared/Select';
import { Button } from '../../shared/Button';
import { UserRole } from '../../../domain/types';

interface RegisterFormProps {
  name: string; setName: (v: string) => void;
  email: string; setEmail: (v: string) => void;
  password: string; setPassword: (v: string) => void;
  role: UserRole; setRole: (v: UserRole) => void;
  instrument: string; setInstrument: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void; onSwitchMode: () => void; loading: boolean;
}

const INSTRUMENT_OPTIONS = [
  { value: 'Voz Principal', label: 'Voz Principal' },
  { value: 'Corista', label: 'Corista' },
  { value: 'Guitarra', label: 'Guitarra' },
  { value: 'Trompeta', label: 'Trompeta' },
  { value: 'Piano / Teclado', label: 'Piano / Teclado' },
  { value: 'Batería', label: 'Batería' },
  { value: 'Bajo', label: 'Bajo' },
  { value: 'Otro', label: 'Otro' },
];

const ROLE_OPTIONS = [
  { value: 'User', label: 'Integrante (User)' },
  { value: 'Admin', label: 'Administrador (Admin)' },
];

export const RegisterForm: React.FC<RegisterFormProps> = ({
  name, setName, email, setEmail, password, setPassword, role, setRole, instrument, setInstrument, onSubmit, onSwitchMode, loading,
}) => (
  <form onSubmit={onSubmit} className="space-y-3">
    <Input label="Nombre Completo" value={name} onChange={(e) => setName(e.target.value)} required />
    <Input label="Correo Electrónico" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
    <Input label="Contraseña" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
    <Select label="Rol en la Banda" value={role} options={ROLE_OPTIONS} onChange={(e) => setRole(e.target.value as UserRole)} />
    <Select label="Instrumento / Función" value={instrument} options={INSTRUMENT_OPTIONS} onChange={(e) => setInstrument(e.target.value)} />
    <Button type="submit" className="w-full mt-2" disabled={loading}>{loading ? 'Registrando...' : 'Crear Cuenta'}</Button>
    <div className="text-center pt-1"><button type="button" onClick={onSwitchMode} className="text-xs text-indigo-400 hover:underline">¿Ya tienes cuenta? Inicia sesión</button></div>
  </form>
);
