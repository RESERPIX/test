import React from 'react';

/**
 * Badge - стандартный бейдж для использования на темных поверхностях (surface-0/1/2)
 * 
 * Следует формуле бейджа из дизайн-системы §2.5:
 * - Заливка: color/10
 * - Граница: color/20-30
 * - Текст: сплошной color
 * 
 * ⚠️ НЕ использовать поверх непредсказуемых изображений!
 * Для бейджей на обложках игр используйте MediaBadge.tsx
 */

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'accent' | 'neutral';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  icon,
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center gap-1.5 font-mono font-semibold rounded-xs border transition-colors shrink-0';

  const sizeStyles = {
    sm: 'text-[10px] px-1.5 py-0.5 leading-none',
    md: 'text-xs px-2.5 py-1 leading-none',
  };

  const variantStyles = {
    success: 'bg-success/10 border-success/30 text-success',
    warning: 'bg-warning/10 border-warning/30 text-warning',
    danger: 'bg-danger/10 border-danger/30 text-danger',
    info: 'bg-info/10 border-info/30 text-info',
    accent: 'bg-accent/10 border-accent/30 text-accent font-bold',
    neutral: 'bg-surface-2 border-borderDef text-textSecondary',
  };

  return (
    <span
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${className}
      `.trim()}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children && <span>{children}</span>}
    </span>
  );
};

export default Badge;
