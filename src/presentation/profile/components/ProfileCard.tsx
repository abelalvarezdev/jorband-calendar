import React from 'react';
import { User } from '../../../domain/types';
import { Badge } from '../../shared/Badge';
import { Button } from '../../shared/Button';
import { User as UserIcon, Mail, Music2, Shield, LogOut } from 'lucide-react';

interface ProfileCardProps {
  user: User | null;
  onLogout: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ user, onLogout }) => {
  if (!user) return null;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      <div className="text-center space-y-2">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center mx-auto shadow-xl shadow-indigo-600/30">
          <UserIcon className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-xl font-black text-white">{user.name}</h2>
        <div className="flex justify-center gap-2">
          <Badge variant="indigo"><Shield className="w-3 h-3 mr-1" />{user.role}</Badge>
          <Badge variant="amber"><Music2 className="w-3 h-3 mr-1" />{user.instrument}</Badge>
        </div>
      </div>
      <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 text-xs">
        <div className="flex items-center justify-between text-slate-300">
          <span className="text-slate-400 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Correo:</span>
          <span className="font-semibold">{user.email}</span>
        </div>
        <div className="flex items-center justify-between text-slate-300">
          <span className="text-slate-400 flex items-center gap-1.5"><Music2 className="w-3.5 h-3.5" /> Instrumento:</span>
          <span className="font-semibold">{user.instrument}</span>
        </div>
      </div>
      <Button variant="danger" className="w-full gap-2" onClick={onLogout}>
        <LogOut className="w-4 h-4" /> Cerrar Sesión
      </Button>
    </div>
  );
};
