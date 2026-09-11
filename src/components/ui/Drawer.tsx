import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  footer,
  size = 'md',
  className = '',
}) => {
  const widthClass = {
    sm: 'md:max-w-sm',
    md: 'md:max-w-md',
    lg: 'md:max-w-lg',
  }[size];

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const drawerContent = (
    <>
      {/* Overlay Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-backdrop animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel: Bottom Sheet on Mobile (<md), Side Drawer on Desktop (>=md) */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`
          fixed bottom-0 left-0 right-0 md:bottom-auto md:top-0 md:left-auto md:right-0
          max-h-[92vh] md:max-h-screen h-auto md:h-screen w-full ${widthClass}
          bg-surface-0 border-t md:border-t-0 md:border-l border-borderDef
          rounded-t-2xl md:rounded-none z-drawer flex flex-col shadow-elevation-overlay
          animate-slideUpBottom md:animate-slideInRight safe-area-pb
          ${className}
        `.trim()}
      >
        {/* Drag Handle on Mobile */}
        <div className="w-full flex items-center justify-center pt-2.5 pb-1 md:hidden bg-surface-1 rounded-t-2xl shrink-0 cursor-grab">
          <div className="w-10 h-1.5 bg-surface-4 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex flex-col justify-center px-5 sm:px-6 py-4 sm:py-5 border-b border-borderDef shrink-0 bg-surface-1">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {icon && <div className="text-accent shrink-0">{icon}</div>}
              <h3 className="text-base font-bold text-textPrimary tracking-tight truncate">{title}</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Закрыть"
              className="w-10 h-10 rounded-control bg-surface-2 hover:bg-surface-3 active:scale-95 flex items-center justify-center text-textTertiary hover:text-textPrimary transition-all outline-none cursor-pointer shrink-0 touch-manipulation"
            >
              <X className="w-4 h-4 shrink-0" />
            </button>
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-textTertiary font-mono mt-1 pr-6 truncate">
              {subtitle}
            </p>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 sm:py-6 touch-scroll">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-5 sm:px-6 py-4 border-t border-borderDef shrink-0 bg-surface-1">
            {footer}
          </div>
        )}
      </div>
    </>
  );

  return ReactDOM.createPortal(drawerContent, document.body);
};

export default Drawer;
