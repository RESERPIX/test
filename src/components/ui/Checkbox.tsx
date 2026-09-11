import React from 'react';
import { Check } from 'lucide-react';

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  ariaLabel?: string;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  disabled = false,
  label,
  ariaLabel,
  className = ''
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange(!checked);
    }
  };

  const checkboxElement = (
    <div
      role="checkbox"
      tabIndex={disabled ? -1 : 0}
      aria-checked={checked}
      aria-label={ariaLabel || label}
      onKeyDown={handleKeyDown}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onChange(!checked);
      }}
      className={`relative w-4 h-4 rounded-control border flex items-center justify-center shrink-0 cursor-pointer transition-all duration-base touch-manipulation active:scale-95 after:absolute after:-inset-2.5 after:content-[''] ${
        checked
          ? 'bg-accent border-accent text-white shadow-[0_0_8px_rgba(124,58,237,0.35)] scale-105'
          : 'bg-surface-0 border-surface-4 hover:border-accent/50 active:border-accent'
      } ${disabled ? 'bg-surface-disabled text-textDisabled cursor-not-allowed border-surface-4 opacity-50' : ''} ${className}`}
    >
      {checked && <Check className="w-3 h-3 stroke-[3]" />}
    </div>
  );

  if (label) {
    return (
      <label className="min-h-[36px] flex items-center gap-2.5 cursor-pointer group touch-manipulation select-none py-1">
        {checkboxElement}
        <span className={`text-xs select-none ${disabled ? 'text-textDisabled' : 'text-textSecondary group-hover:text-textPrimary'} transition-colors`}>
          {label}
        </span>
      </label>
    );
  }

  return checkboxElement;
};

export default Checkbox;
