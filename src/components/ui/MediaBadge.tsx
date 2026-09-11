import React from 'react';

/**
 * MediaBadge - специальный бейдж для использования поверх медиа (обложки игр, превью)
 * 
 * Отличие от Badge.tsx:
 * - Использует плотную темную подложку для читаемости на любом фоне
 * - Предназначен для overlay поверх непредсказуемых изображений
 * - Следует правилу §13 дизайн-системы (текст поверх изображения обязан иметь подложку)
 */

export interface MediaBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'accent' | 'neutral' | 'white';
  icon?: React.ReactNode;
  size?: 'default' | 'compact';
}

export const MediaBadge: React.FC<MediaBadgeProps> = ({
  variant = 'neutral',
  icon,
  size = 'default',
  children,
  className = '',
  ...props
}) => {
  // Базовые стили: плотная подложка surface-1 с backdrop-blur
  const baseStyles = 'inline-flex items-center font-mono font-bold rounded-lg backdrop-blur-md shadow-lg shrink-0';
  
  // Размеры
  const sizeStyles = {
    default: 'h-[26px] text-[11px] px-2 gap-1.5',
    compact: 'h-[22px] text-[10px] px-1.5 gap-1',
  };

  // Варианты цветов (все с темной подложкой для читаемости)
  const variantStyles = {
    success: 'bg-surface-1/95 border border-success/40 text-success',
    warning: 'bg-surface-1/95 border border-warning/40 text-warning',
    accent: 'bg-surface-1/95 border border-accent/40 text-accent',
    neutral: 'bg-surface-1/95 border border-borderDef text-textSecondary',
    white: 'bg-surface-1/95 border border-borderDef text-textPrimary',
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
      {icon && <span className="shrink-0 flex items-center">{icon}</span>}
      {children && <span className="uppercase tracking-wider">{children}</span>}
    </span>
  );
};

export default MediaBadge;
