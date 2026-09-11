import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full space-y-1">
      {label && (
        <label className="block text-xs font-semibold text-slate-300">
          {label}
        </label>
      )}
      <input
        className={`w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
    </div>
  );
};
