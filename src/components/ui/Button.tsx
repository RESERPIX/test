import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'reaction' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  icon,
  iconPosition = 'left',
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-sans transition-all duration-120 outline-none cursor-pointer select-none touch-manipulation active:scale-[0.97] focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none whitespace-nowrap';

  const sizeStyles = {
    sm: 'min-h-[36px] sm:min-h-[32px] h-9 sm:h-8 px-3 text-xs rounded-control gap-1.5 font-semibold',
    md: 'min-h-[40px] sm:min-h-[36px] h-10 sm:h-9 px-4 text-xs rounded-control gap-2 font-semibold',
    lg: 'min-h-[44px] h-11 px-6 text-sm rounded-control gap-2.5 font-extrabold uppercase tracking-wider',
    xl: 'min-h-[48px] h-12 px-6 text-sm rounded-control gap-2.5 font-extrabold uppercase tracking-wider',
  };

  const variantStyles = {
    primary: 'bg-accent hover:bg-accent-hover text-white font-extrabold shadow-sm active:brightness-95',
    gradient: 'bg-accent hover:bg-accent-hover text-white font-extrabold shadow-[0_0_20px_rgba(139,92,246,0.35)] hover:shadow-[0_0_25px_rgba(236,72,153,0.5)] active:brightness-95 border-none',
    secondary: 'bg-surface-2 hover:bg-surface-3 border border-borderDef text-textPrimary font-semibold hover:border-borderStrong active:bg-surface-3',
    danger: 'bg-danger/20 hover:bg-danger/30 text-danger border border-danger/40 font-bold active:bg-danger/30',
    ghost: 'text-textTertiary hover:text-textPrimary hover:bg-surface-2 active:bg-surface-3 rounded-control p-2 border-none bg-transparent min-w-[36px] min-h-[36px] flex items-center justify-center',
    outline: 'bg-transparent border border-borderDef hover:border-accent text-textPrimary font-semibold hover:text-accent active:bg-accent/10',
    reaction: 'bg-reaction hover:bg-reaction-hover text-white font-bold shadow-sm active:brightness-95',
  };

  const iconElement = isLoading ? (
    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
  ) : icon ? (
    <span className="shrink-0">{icon}</span>
  ) : null;

  return (
    <button
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `.trim()}
      disabled={disabled || isLoading}
      {...props}
    >
      {iconPosition === 'left' && iconElement}
      {children && <span className="inline-flex items-center gap-2 whitespace-nowrap">{children}</span>}
      {iconPosition === 'right' && iconElement}
    </button>
  );
};

export default Button;
