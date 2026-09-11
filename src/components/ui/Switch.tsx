import React from 'react';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

const Switch: React.FC<SwitchProps> = ({ checked, onChange, label, disabled = false }) => {
  return (
    <label className={`min-h-[40px] flex items-center gap-3 select-none touch-manipulation py-1 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
      {label && <span className="text-sm font-medium text-textPrimary">{label}</span>}
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => {
            if (!disabled) onChange(e.target.checked);
          }}
          disabled={disabled}
        />
        <div 
          className={`block w-10 h-6 rounded-full transition-colors duration-200 ease-in-out ${
            checked ? 'bg-accent' : 'bg-surface-3'
          }`}
        />
        <div 
          className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </div>
    </label>
  );
};

export default Switch;
