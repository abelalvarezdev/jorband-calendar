import React from 'react';

interface SwitchProps {
  labelLeft: string;
  labelRight: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const Switch: React.FC<SwitchProps> = ({
  labelLeft,
  labelRight,
  checked,
  onChange,
}) => {
  return (
    <div className="flex items-center justify-between bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800/80 text-xs font-semibold">
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`flex-1 py-2 px-3 rounded-xl transition-all ${
          !checked
            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        {labelLeft}
      </button>
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`flex-1 py-2 px-3 rounded-xl transition-all ${
          checked
            ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        {labelRight}
      </button>
    </div>
  );
};
