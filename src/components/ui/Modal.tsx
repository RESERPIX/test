import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, Info } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  icon?: React.ReactNode | React.ElementType;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  icon,
  maxWidth = 'md',
  className = '',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  const renderIcon = () => {
    if (!icon) return <Info className="w-4 h-4 text-accent" />;
    if (React.isValidElement(icon)) return icon;
    const IconComp = icon as React.ElementType;
    return <IconComp className="w-4 h-4 text-accent" />;
  };

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-modal bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn"
    >
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className={`relative z-10 bg-surface-1 border-t sm:border border-borderDef sm:border-borderStrong rounded-t-2xl sm:rounded-2xl w-full p-5 sm:p-6 shadow-elevation-overlay max-h-[92vh] sm:max-h-[90vh] flex flex-col overflow-hidden text-textPrimary animate-slideUpBottom sm:animate-fadeIn safe-area-pb ${maxWidthStyles[maxWidth]} ${className}`}>
        {/* Mobile Drag Handle */}
        <div className="w-10 h-1.5 bg-surface-4 rounded-full mx-auto -mt-1 mb-3 sm:hidden shrink-0" />

        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-borderDef shrink-0">
          <div className="flex items-center gap-3 font-semibold text-textPrimary text-base min-w-0 pr-2">
            <div className="w-9 h-9 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center shrink-0">
              {renderIcon()}
            </div>
            <div className="flex flex-col min-w-0">
              <h3 className="font-bold tracking-tight text-base sm:text-lg text-textPrimary truncate">{title}</h3>
              {subtitle && <div className="text-[11px] sm:text-xs text-textSecondary truncate">{subtitle}</div>}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="w-9 h-9 rounded-lg bg-surface-2 hover:bg-surface-3 active:scale-95 flex items-center justify-center text-textTertiary hover:text-textPrimary transition-all cursor-pointer outline-none shrink-0 touch-manipulation"
          >
            <X className="w-4 h-4 shrink-0" />
          </button>
        </div>
        <div className="overflow-y-auto touch-scroll flex-1 pt-4">{children}</div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default Modal;
