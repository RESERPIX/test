import React from 'react';
import Modal from '../ui/Modal';
import { AlertTriangle, Trash2, CheckCircle2 } from 'lucide-react';

export interface ConfirmActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  isDestructive?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode | React.ElementType;
}

export const ConfirmActionModal: React.FC<ConfirmActionModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  confirmText = 'Подтвердить',
  cancelText = 'Отмена',
  onConfirm,
  isDestructive = false,
  isLoading = false,
  icon,
}) => {
  // Determine default icon if none provided
  const getIcon = () => {
    if (icon) return icon;
    if (isDestructive) return <AlertTriangle className="w-5 h-5 text-error" />;
    return <CheckCircle2 className="w-5 h-5 text-accent" />;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      icon={getIcon()}
      maxWidth="md"
    >
      <div className="space-y-6">
        <div className="text-textSecondary text-sm leading-relaxed">
          {description}
        </div>
        
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 bg-surface-2 hover:bg-surface-3 text-textPrimary rounded-control font-semibold text-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 font-semibold text-sm rounded-control transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50 ${
              isDestructive
                ? 'bg-error hover:bg-error/90 text-white'
                : 'bg-accent hover:bg-accent-hover text-white'
            }`}
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
            ) : isDestructive ? (
              <Trash2 className="w-4 h-4" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmActionModal;
