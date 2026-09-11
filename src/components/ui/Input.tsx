import React from 'react';
import { Search, X } from 'lucide-react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  error?: string;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'surface-0' | 'flat';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  className = '',
  error,
  icon,
  type = 'text',
  size = 'md',
  variant = 'default',
  ...props
}, ref) => {
  const sizeClasses = {
    sm: 'h-9',
    md: 'h-10',
    lg: 'h-11'
  };

  const heightClass = sizeClasses[size];
  const bgClass = (variant === 'surface-0' || variant === 'flat') ? 'bg-surface-0' : 'bg-surface-1';

  return (
    <div className="w-full space-y-1">
      <div className="relative flex items-center w-full group">
        {icon && (
          <span className="absolute left-3 text-textTertiary group-focus-within:text-accent pointer-events-none shrink-0 transition-colors">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          type={type}
          className={`
            w-full ${heightClass} ${bgClass} border ${
              error ? 'border-danger focus:border-danger focus:shadow-[0_0_12px_rgba(229,72,77,0.2)]' : 'border-borderDef hover:border-borderStrong focus:border-accent focus:ring-2 focus:ring-accent focus:border-accent'
            } text-textPrimary placeholder:text-textTertiary rounded-control text-base sm:text-xs font-sans outline-none transition-all shadow-sm touch-manipulation
            ${icon ? 'pl-10 pr-3' : 'px-3'}
            ${className}
          `.trim()}
          {...props}
        />
      </div>
      {error && <p className="text-[11px] font-mono text-danger">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'icon'> {
  onClear?: () => void;
  variant?: 'default' | 'surface-0' | 'flat' | 'nested';
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onClear,
  placeholder = 'Поиск...',
  className = '',
  variant = 'default',
  ...props
}) => {
  const bgClass = variant === 'nested' 
    ? 'bg-surface-2' 
    : (variant === 'surface-0' || variant === 'flat') ? 'bg-surface-0' : 'bg-surface-1';

  const borderClass = variant === 'nested'
    ? 'border border-transparent focus:border-accent focus:ring-2 focus:ring-accent focus:border-accent'
    : 'border border-borderDef hover:border-borderStrong focus:border-accent focus:ring-2 focus:ring-accent focus:border-accent';

  return (
    <div className="relative flex items-center w-full group">
      <Search className="w-4 h-4 text-textTertiary group-focus-within:text-accent absolute left-3 pointer-events-none shrink-0 transition-colors" />
      <input
        type="search"
        value={value}
        placeholder={placeholder}
        className={`
          w-full h-10 pl-10 pr-10 ${bgClass} ${borderClass} text-textPrimary placeholder:text-textTertiary rounded-control text-base sm:text-xs font-sans outline-none transition-all shadow-sm touch-manipulation
          ${className}
        `.trim()}
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-textTertiary hover:text-textPrimary hover:bg-surface-3 p-1 rounded-control transition-all cursor-pointer touch-manipulation active:scale-95"
          aria-label="Очистить поиск"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  variant?: 'default' | 'surface-0' | 'surface-2' | 'flat';
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({
  className = '',
  error,
  variant = 'default',
  ...props
}, ref) => {
  const bgClass = variant === 'surface-2' ? 'bg-surface-2' : (variant === 'surface-0' || variant === 'flat') ? 'bg-surface-0' : 'bg-surface-1';

  return (
    <div className="w-full space-y-1">
      <textarea
        ref={ref}
        className={`
          w-full ${bgClass} border ${
            error ? 'border-danger focus:border-danger' : 'border-borderDef hover:border-borderStrong focus:border-accent focus:ring-2 focus:ring-accent focus:border-accent'
          } text-textPrimary placeholder:text-textTertiary rounded-control p-3 text-caption font-sans outline-none transition-all resize-none shadow-sm touch-manipulation
          ${className}
        `.trim()}
        {...props}
      />
      {error && <p className="text-[11px] font-mono text-danger">{error}</p>}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Input;

