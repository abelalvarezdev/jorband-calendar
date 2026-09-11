import React from 'react';
import { Select } from '../../shared/Select';
import { Input } from '../../shared/Input';
import { User } from '../../../domain/types';
import { UserCheck, Sparkles } from 'lucide-react';

interface SingerSelectorProps {
  members: User[];
  principalSinger: string;
  setPrincipalSinger: (v: string) => void;
  isGuestSinger: boolean;
  setIsGuestSinger: (v: boolean) => void;
  guestSingerName: string;
  setGuestSingerName: (v: string) => void;
}

export const SingerSelector: React.FC<SingerSelectorProps> = ({
  members,
  principalSinger,
  setPrincipalSinger,
  isGuestSinger,
  setIsGuestSinger,
  guestSingerName,
  setGuestSingerName,
}) => {
  const options = members.map((m) => ({
    value: m.name,
    label: `${m.name} (${m.instrument})`,
  }));

  return (
    <div className="space-y-3 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5"><UserCheck className="w-3.5 h-3.5 text-indigo-400" /> Cantante Principal</span>
        <label className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold cursor-pointer">
          <input type="checkbox" checked={isGuestSinger} onChange={(e) => setIsGuestSinger(e.target.checked)} className="rounded text-amber-500 focus:ring-amber-400 bg-slate-900 border-slate-800" />
          <Sparkles className="w-3 h-3" /> Cantante Invitado
        </label>
      </div>
      {!isGuestSinger ? (
        <Select value={principalSinger} options={options} onChange={(e) => setPrincipalSinger(e.target.value)} />
      ) : (
        <Input label="Nombre del Cantante Invitado" placeholder="Ej: Carlos Gómez" value={guestSingerName} onChange={(e) => setGuestSingerName(e.target.value)} required />
      )}
    </div>
  );
};
