import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
}

export interface CustomSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: SelectOption[];
  icon?: React.ReactNode | React.ElementType;
  className?: string;
  labelPrefix?: string;
  placeholder?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'surface-0' | 'flat' | 'form';
  id?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  icon,
  className = '',
  labelPrefix = '',
  placeholder = 'Выберите...',
  disabled = false,
  size = 'md',
  variant = 'default',
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    minWidth: number;
    placement: 'bottom' | 'top';
  }>({
    top: 0,
    left: 0,
    minWidth: 180,
    placement: 'bottom'
  });
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  const sizeClasses = {
    sm: 'min-h-[32px] h-8 text-xs px-2.5 rounded-control',
    md: 'min-h-[36px] h-9 text-xs px-3 rounded-control',
    lg: 'min-h-[40px] h-10 text-xs sm:text-sm px-3.5 rounded-control',
    xl: 'min-h-11 h-11 text-sm px-4 rounded-control'
  };

  const updateCoords = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const ESTIMATED_MENU_HEIGHT = Math.min(options.length * 38 + 12, 260);
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      // Smart flip logic: if not enough space below and more space above, open upwards
      const openUpwards = spaceBelow < ESTIMATED_MENU_HEIGHT && spaceAbove > spaceBelow;
      
      const width = Math.max(rect.width, 190);
      let leftPos = rect.left;
      
      // Horizontal boundary clamping
      if (leftPos + width > window.innerWidth - 12) {
        leftPos = Math.max(12, window.innerWidth - width - 12);
      }

      const topPos = openUpwards 
        ? Math.max(12, rect.top - ESTIMATED_MENU_HEIGHT - 6) 
        : rect.bottom + 6;

      setCoords({
        top: topPos,
        left: leftPos,
        minWidth: width,
        placement: openUpwards ? 'top' : 'bottom'
      });
    }
  }, [options.length]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('.custom-select-portal')
      ) {
        setIsOpen(false);
      }
    };

    const handleScrollOrResize = () => {
      if (isOpen) updateCoords();
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isOpen, updateCoords]);

  const handleToggle = () => {
    if (disabled) return;
    if (!isOpen) updateCoords();
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggle();
    } else if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!isOpen) {
        handleToggle();
      } else {
        const idx = options.findIndex(o => o.value === value);
        if (idx < options.length - 1) onChange(options[idx + 1].value);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!isOpen) {
        handleToggle();
      } else {
        const idx = options.findIndex(o => o.value === value);
        if (idx > 0) onChange(options[idx - 1].value);
      }
    }
  };

  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) return icon;
    const IconComp = icon as React.ElementType;
    return <IconComp className="w-3.5 h-3.5 text-accent shrink-0" />;
  };

  const menuContent = isOpen ? (
    <div
      role="listbox"
      tabIndex={-1}
      style={{
        position: 'fixed',
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        minWidth: `${coords.minWidth}px`,
        zIndex: 9999
      }}
      className="custom-select-portal bg-surface-2/95 backdrop-blur-xl border border-borderDef shadow-elevation-overlay rounded-xl p-1.5 font-sans text-xs animate-fadeIn space-y-0.5 overflow-hidden max-h-[260px] overflow-y-auto no-scrollbar select-none"
    >
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="option"
            aria-selected={isSelected}
            onClick={() => {
              onChange(option.value);
              setIsOpen(false);
            }}
            className={`w-full text-left px-3.5 py-2.5 min-h-[40px] rounded-lg flex items-center justify-between gap-2.5 transition-all duration-120 cursor-pointer touch-manipulation active:scale-[0.98] ${
              isSelected
                ? 'bg-accent/15 text-accent font-bold'
                : 'text-textSecondary hover:text-textPrimary hover:bg-surface-3/80 active:bg-surface-3'
            }`}
          >
            <div className="flex items-center gap-2.5 pr-2 min-w-0 flex-1">
              {option.icon && <span className="shrink-0 text-textTertiary">{option.icon}</span>}
              <div className="flex flex-col min-w-0">
                <span className="truncate text-sm sm:text-xs">{option.label}</span>
                {option.sublabel && (
                  <span className="text-[11px] sm:text-[10px] font-mono text-textTertiary mt-0.5 truncate leading-none">
                    {option.sublabel}
                  </span>
                )}
              </div>
            </div>
            {isSelected && <Check className="w-4 h-4 text-accent shrink-0 stroke-[2.5]" />}
          </button>
        );
      })}
    </div>
  ) : null;

  const bgClass = variant === 'form' 
    ? 'bg-surface-1 hover:bg-surface-2'
    : (variant === 'surface-0' || variant === 'flat')
      ? 'bg-surface-0 hover:bg-surface-1'
      : 'bg-surface-2 hover:bg-surface-3';

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        id={id}
        ref={buttonRef}
        type="button"
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        disabled={disabled}
        onKeyDown={handleKeyDown}
        onClick={handleToggle}
        className={`
          ${sizeClasses[size]}
          ${bgClass}
          border
          ${isOpen 
            ? 'border-accent ring-2 ring-accent/20 text-textPrimary shadow-sm' 
            : 'border-borderDef text-textPrimary hover:border-borderStrong'}
          font-sans flex items-center justify-between gap-2 transition-all outline-none cursor-pointer w-full select-none shadow-sm disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation active:scale-[0.98]
        `}
      >
        <div className="flex items-center gap-2 truncate min-w-0">
          {renderIcon()}
          <span className="truncate font-medium">
            {labelPrefix && <span className="text-textTertiary mr-1.5 font-mono text-[11px] uppercase tracking-wider">{labelPrefix}:</span>}
            {selectedOption?.label || placeholder}
          </span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-textTertiary transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-accent' : ''}`} />
      </button>

      {isOpen && ReactDOM.createPortal(menuContent, document.body)}
    </div>
  );
};

export const NativeSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <select
    className={`min-h-[36px] h-9 px-3 bg-surface-2 border border-borderDef focus:border-accent text-textPrimary text-xs font-sans rounded-control outline-none transition-colors cursor-pointer touch-manipulation ${className}`}
    {...props}
  >
    {children}
  </select>
);

export default CustomSelect;
