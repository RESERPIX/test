import React from 'react';
import { CheckCircle2, RefreshCw, AlertTriangle } from 'lucide-react';

interface AutoSaveIndicatorProps {
  status: 'idle' | 'saving' | 'saved' | 'error';
  lastSaved?: Date;
}

export const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({ status, lastSaved }) => {
  const getTimeAgo = () => {
    if (!lastSaved) return '';
    
    const seconds = Math.floor((Date.now() - lastSaved.getTime()) / 1000);
    
    if (seconds < 60) return 'только что';
    if (seconds < 120) return '1 мин назад';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} мин назад`;
    return `${Math.floor(seconds / 3600)} ч назад`;
  };

  return (
    <div className="text-xs font-mono flex items-center gap-1.5">
      {status === 'saving' && (
        <>
          <RefreshCw className="w-3 h-3 text-textTertiary animate-spin" />
          <span className="text-textTertiary">Сохранение...</span>
        </>
      )}
      
      {status === 'saved' && (
        <>
          <CheckCircle2 className="w-3 h-3 text-success" />
          <span className="text-textTertiary">
            Сохранено {getTimeAgo()}
          </span>
        </>
      )}
      
      {status === 'error' && (
        <>
          <AlertTriangle className="w-3 h-3 text-danger" />
          <span className="text-danger">Ошибка сохранения</span>
        </>
      )}
      
      {status === 'idle' && (
        <span className="text-textDisabled">Автосохранение</span>
      )}
    </div>
  );
};
