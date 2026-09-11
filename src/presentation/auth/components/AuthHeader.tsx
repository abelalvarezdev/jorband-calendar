import React from 'react';
import { Music } from 'lucide-react';

interface AuthHeaderProps {
  isLoginMode: boolean;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ isLoginMode }) => {
  return (
    <div className="text-center space-y-2 mb-6">
      <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center mx-auto shadow-xl shadow-indigo-600/30">
        <Music className="w-8 h-8 text-white animate-pulse" />
      </div>
      <h2 className="text-2xl font-black text-white tracking-tight">JORBAND</h2>
      <p className="text-xs text-slate-400">
        {isLoginMode
          ? 'Inicia sesión para gestionar el calendario y tus ausencias'
          : 'Crea tu cuenta de integrante en la banda'}
      </p>
    </div>
  );
};
