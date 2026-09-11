import React from 'react';
import { Music2 } from 'lucide-react';

interface HeaderProps {
  userName?: string;
  userRole?: string;
}

export const Header: React.FC<HeaderProps> = ({ userName, userRole }) => {
  return (
    <header className="bg-slate-900/60 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 sticky top-0 z-30 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
          <Music2 className="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-extrabold tracking-wide text-white">JORBAND</h1>
          <p className="text-[10px] text-slate-400 font-medium">Calendario & Ausencias</p>
        </div>
      </div>
      {userName && (
        <div className="text-right">
          <span className="block text-xs font-semibold text-slate-200">{userName}</span>
          <span className="text-[10px] text-indigo-400 font-medium">{userRole}</span>
        </div>
      )}
    </header>
  );
};
