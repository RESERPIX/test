import React from 'react';
import { AlertCircle, ShieldAlert, Clock, HelpCircle } from 'lucide-react';
import Button from './Button';

export interface ScopedForbiddenNoticeProps {
  capability: 'comments' | 'publishing' | 'payouts' | 'contacts';
  title?: string;
  reason?: string;
  expiresAt?: string;
  caseId?: string;
  onOpenAppeal?: () => void;
  compact?: boolean;
  className?: string;
}

const CAPABILITY_DEFAULTS = {
  comments: {
    title: 'Возможность комментирования ограничена',
    defaultReason: 'Многократные нарушения правил общения в сообществе или спам',
    defaultExpires: 'до 18 сентября 2026',
    caseId: 'RES-COM-1049'
  },
  publishing: {
    title: 'Публикация и обновление проектов приостановлены',
    defaultReason: 'Проведение плановой проверки соответствия материалов правилам платформы',
    defaultExpires: 'до 15 сентября 2026',
    caseId: 'RES-PUB-8041'
  },
  payouts: {
    title: 'Коммерческие выплаты временно заморожены',
    defaultReason: 'Проверка платёжных реквизитов или обновление юридического статуса продавца',
    defaultExpires: 'до подтверждения документов',
    caseId: 'RES-PAY-2309'
  },
  contacts: {
    title: 'Запросы контактных данных ограничены',
    defaultReason: 'Превышен лимит отправки запросов или жалобы на нежелательные контакты',
    defaultExpires: 'до 12 сентября 2026',
    caseId: 'RES-CNT-5012'
  }
};

export const ScopedForbiddenNotice: React.FC<ScopedForbiddenNoticeProps> = ({
  capability,
  title,
  reason,
  expiresAt,
  caseId,
  onOpenAppeal,
  compact = false,
  className = ''
}) => {
  const defaults = CAPABILITY_DEFAULTS[capability] || CAPABILITY_DEFAULTS.comments;
  const displayTitle = title || defaults.title;
  const displayReason = reason || defaults.defaultReason;
  const displayExpires = expiresAt || defaults.defaultExpires;
  const displayCaseId = caseId || defaults.caseId;

  if (compact) {
    return (
      <div className={`p-3.5 bg-warning/10 border border-warning/30 rounded-control flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${className}`}>
        <div className="flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-textPrimary">{displayTitle}</span>
            <p className="text-textSecondary text-[11px] leading-relaxed">{displayReason} ({displayExpires})</p>
          </div>
        </div>

        {onOpenAppeal && (
          <button
            type="button"
            onClick={onOpenAppeal}
            className="shrink-0 text-[11px] font-mono font-bold text-accent hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Обжаловать</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`p-4 md:p-5 bg-surface-1 border border-warning/30 rounded-card space-y-3.5 shadow-sm ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-warning/15 border border-warning/30 flex items-center justify-center text-warning shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-textPrimary text-sm">{displayTitle}</h4>
            <span className="text-[11px] font-mono text-textTertiary">Дело: #{displayCaseId}</span>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-warning/10 text-warning border border-warning/20 shrink-0 flex items-center gap-1">
          <Clock className="w-3 h-3" /> Временное ограничение
        </span>
      </div>

      <div className="bg-surface-2 p-3 rounded-control border border-borderDef text-xs space-y-1.5 font-sans">
        <span className="text-[10px] font-bold uppercase text-textTertiary font-mono block">Официальная причина</span>
        <p className="text-textSecondary leading-relaxed">{displayReason}</p>
        <div className="pt-1.5 border-t border-borderDef/60 flex items-center justify-between text-[11px] font-mono text-textTertiary">
          <span>Срок ограничения:</span>
          <span className="text-warning font-semibold">{displayExpires}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-borderDef/60">
        <span className="text-[11px] text-textTertiary leading-tight">
          Остальной функционал платформы и доступ к библиотеке остаются активными.
        </span>

        {onOpenAppeal && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onOpenAppeal}
            className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-1.5 text-xs"
          >
            <HelpCircle className="w-3.5 h-3.5 text-accent" />
            <span>Подать апелляцию</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ScopedForbiddenNotice;
