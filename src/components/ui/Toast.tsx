import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CheckCircle2, AlertTriangle, Info, AlertOctagon } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'danger' | 'info';

export interface ToastProps {
  message: string;
  type?: ToastType;
  position?: 'bottom-left' | 'bottom-right';
  className?: string;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  position = 'bottom-left',
  className = '',
}) => {
  const positionStyles = {
    'bottom-left': 'fixed bottom-6 left-6 z-toast',
    'bottom-right': 'fixed bottom-16 right-6 z-toast',
  };

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 shrink-0 text-success" />,
    warning: <AlertTriangle className="w-4 h-4 shrink-0 text-warning" />,
    danger: <AlertOctagon className="w-4 h-4 shrink-0 text-danger" />,
    info: <Info className="w-4 h-4 shrink-0 text-accent" />,
  };

  return (
    <div
      className={`
        ${positionStyles[position]}
        bg-surface-3 border border-borderStrong px-4 py-3 rounded-card text-xs font-mono shadow-elevation-overlay flex items-center gap-3 animate-fadeIn
        ${className}
      `.trim()}
    >
      {icons[type]}
      <span className="text-textPrimary font-bold">{message}</span>
    </div>
  );
};

interface ToastState {
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideToast = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setToast(null);
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setToast({ message, type });
    timerRef.current = setTimeout(() => {
      setToast(null);
      timerRef.current = null;
    }, 3200);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          position="bottom-left"
        />
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    // Fallback if rendered outside ToastProvider
    return {
      showToast: (msg: string) => console.log('[Toast]', msg),
      hideToast: () => {}
    };
  }
  return context;
};

export default Toast;

