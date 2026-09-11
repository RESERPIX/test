import React, { useState, useEffect, useRef } from 'react';
import Drawer from '../ui/Drawer';
import Button from '../ui/Button';
import { ShieldAlert, Save, CheckCircle2, Clock } from 'lucide-react';

interface JamAppealDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  jamId: string;
  gameId: string;
  triggerToast: (msg: string, type: 'success' | 'danger' | 'warning' | 'info') => void;
}

export default function JamAppealDrawer({ isOpen, onClose, jamId, gameId, triggerToast }: JamAppealDrawerProps) {
  const [appealText, setAppealText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  
  const storageKey = `jam_appeal_draft_${jamId}_${gameId}`;
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load draft on open
  useEffect(() => {
    if (isOpen) {
      try {
        const draft = localStorage.getItem(storageKey);
        if (draft) {
          setAppealText(draft);
          setLastSavedTime(new Date());
        }
      } catch (e) {
        console.error('Failed to load draft:', e);
      }
    }
  }, [isOpen, storageKey]);

  // Auto-save logic
  useEffect(() => {
    if (!isOpen) return;
    
    // Clear previous timeout
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    
    // Set new timeout to save after 1 second of inactivity
    saveTimeoutRef.current = setTimeout(() => {
      try {
        if (appealText.trim().length > 0) {
          localStorage.setItem(storageKey, appealText);
          setLastSavedTime(new Date());
        } else {
          localStorage.removeItem(storageKey);
          setLastSavedTime(null);
        }
      } catch (e) {
        console.error('Failed to save draft:', e);
      }
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [appealText, isOpen, storageKey]);

  const handleSubmit = () => {
    if (appealText.trim().length < 20) {
      triggerToast('Апелляция должна содержать хотя бы 20 символов.', 'warning');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      localStorage.removeItem(storageKey); // clear draft on success
      setAppealText('');
      setLastSavedTime(null);
      triggerToast('Ваша апелляция успешно отправлена на рассмотрение модераторам.', 'success');
      onClose();
    }, 1500);
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Апелляция решения (JamAppeal)"
      subtitle="Подача запроса на пересмотр дисквалификации или штрафа."
      icon={<ShieldAlert className="w-5 h-5 text-warning" />}
      size="md"
    >
      <div className="flex flex-col gap-6 h-full">
        <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 flex flex-col gap-2">
          <span className="text-xs font-bold text-warning uppercase font-mono tracking-wider">Причина блокировки / штрафа:</span>
          <span className="text-[13px] text-textSecondary font-sans leading-relaxed">
            Ваша заявка нарушает пункт 4.1 правил джема (использование генеративного ИИ в ассетах без пометки). 
            Если вы считаете это ошибкой, подробно опишите процесс создания ресурсов.
          </span>
        </div>

        <div className="flex flex-col gap-2 flex-1 relative">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-textPrimary uppercase tracking-wider font-mono">
              Текст апелляции
            </label>
            {lastSavedTime && (
              <span className="flex items-center gap-1.5 text-[10px] text-success font-mono uppercase">
                <CheckCircle2 className="w-3 h-3" />
                Сохранено в {lastSavedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            )}
          </div>
          
          <textarea
            value={appealText}
            onChange={(e) => setAppealText(e.target.value)}
            placeholder="Подробно опишите, почему решение модератора ошибочно. Приложите ссылки на исходники или видео процесса разработки..."
            className="w-full flex-1 bg-surface-1 border border-borderDef rounded-xl p-4 text-[13px] text-textPrimary font-sans resize-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
          />
          <span className="text-[11px] text-textTertiary font-mono absolute bottom-3 right-4 bg-surface-1">
            Минимум 20 символов
          </span>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <Button
            onClick={handleSubmit}
            variant="primary"
            size="lg"
            className="w-full flex items-center justify-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2"><Clock className="w-4 h-4 animate-spin" /> Отправка...</span>
            ) : (
              'Отправить на рассмотрение'
            )}
          </Button>
          <span className="text-[10px] text-center text-textTertiary font-sans">
            Ваш запрос будет рассмотрен независимым администратором в течение 48 часов.
          </span>
        </div>
      </div>
    </Drawer>
  );
}
