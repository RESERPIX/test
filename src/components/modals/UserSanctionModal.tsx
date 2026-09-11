import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Clock, 
  Ban, 
  MessageSquare, 
  Gamepad2, 
  DollarSign, 
  Check, 
  FileText 
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';

export type SanctionType = 'scoped_comments' | 'scoped_publishing' | 'scoped_payouts' | 'suspended' | 'banned';

export interface UserSanctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: {
    id: string;
    username: string;
    displayName: string;
  };
  onApplySanction: (data: {
    type: SanctionType;
    reason: string;
    ruleCode: string;
    caseId: string;
    durationDays: number | null; // null = бессрочно
  }) => void;
}

export const UserSanctionModal: React.FC<UserSanctionModalProps> = ({
  isOpen,
  onClose,
  targetUser,
  onApplySanction
}) => {
  const [sanctionType, setSanctionType] = useState<SanctionType>('scoped_comments');
  const [reason, setReason] = useState('');
  const [ruleCode, setRuleCode] = useState('RULE-COMMUNITY-4.2');
  const [caseId, setCaseId] = useState(`CASE-${Math.floor(10000 + Math.random() * 90000)}`);
  const [durationDays, setDurationDays] = useState<number | null>(14);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onApplySanction({
        type: sanctionType,
        reason: reason.trim(),
        ruleCode,
        caseId,
        durationDays
      });
      onClose();
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Применение санкций и ограничений"
      subtitle={`Выдача взыскания пользователю @${targetUser.username} (SC-ACC-039..041)`}
      icon={<ShieldAlert className="w-5 h-5 text-warning" />}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        
        {/* ВЫБОР ТИПА САНКЦИИ */}
        <div className="space-y-1.5">
          <label className="font-mono text-textSecondary uppercase font-bold block text-[10px]">
            Тип дисциплинарного воздействия:
          </label>
          <div className="grid grid-cols-1 gap-2">
            {[
              {
                id: 'scoped_comments' as SanctionType,
                title: 'Ограничение отзывов и сообщества (BR-ACC-056)',
                desc: 'Запрет на отправку сообщений в темах и комментирование игр',
                icon: MessageSquare,
                color: 'text-warning'
              },
              {
                id: 'scoped_publishing' as SanctionType,
                title: 'Запрет публикаций игр и девлогов (BR-ACC-056)',
                desc: 'Блокировка создания проектов и загрузки новых билдов',
                icon: Gamepad2,
                color: 'text-warning'
              },
              {
                id: 'scoped_payouts' as SanctionType,
                title: 'Заморозка выплат продавца (BR-ACC-056)',
                desc: 'Приостановка вывода средств с баланса продаж',
                icon: DollarSign,
                color: 'text-warning'
              },
              {
                id: 'suspended' as SanctionType,
                title: 'Временная приостановка аккаунта (Suspension)',
                desc: 'Полный запрет входа на период расследования (BR-ACC-053..055)',
                icon: Clock,
                color: 'text-orange-400'
              },
              {
                id: 'banned' as SanctionType,
                title: 'Полная блокировка аккаунта (Full Ban)',
                desc: 'Бессрочный запрет доступа без уничтожения цифровых прав (BR-ACC-055)',
                icon: Ban,
                color: 'text-danger'
              }
            ].map((option) => {
              const Icon = option.icon;
              const isSelected = sanctionType === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSanctionType(option.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-accent/10 border-accent text-textPrimary font-semibold shadow-sm'
                      : 'bg-surface-2 border-borderDef hover:border-borderStrong text-textSecondary'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${option.color}`} />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-textPrimary">{option.title}</div>
                    <div className="text-[11px] text-textTertiary mt-0.5">{option.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* НОМЕР ДЕЛА И СТАТЬЯ ПРАВИЛ */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="font-mono text-textSecondary uppercase font-bold block text-[10px]">
              Номер дела (Case ID):
            </label>
            <Input
              value={caseId}
              onChange={(e) => setCaseId(e.target.value)}
              className="font-mono text-xs"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-textSecondary uppercase font-bold block text-[10px]">
              Пункт правил платформы:
            </label>
            <Input
              value={ruleCode}
              onChange={(e) => setRuleCode(e.target.value)}
              className="font-mono text-xs"
              required
            />
          </div>
        </div>

        {/* СРОК ДЕЙСТВИЯ */}
        <div className="space-y-1.5">
          <label className="font-mono text-textSecondary uppercase font-bold block text-[10px]">
            Срок ограничения:
          </label>
          <div className="flex flex-wrap gap-2 font-mono text-[11px]">
            {[
              { label: '3 дня', days: 3 },
              { label: '7 дней', days: 7 },
              { label: '14 дней', days: 14 },
              { label: '30 дней', days: 30 },
              { label: 'Бессрочно', days: null }
            ].map((dur) => (
              <button
                key={String(dur.days)}
                type="button"
                onClick={() => setDurationDays(dur.days)}
                className={`px-3 py-1.5 rounded-lg border cursor-pointer transition-colors ${
                  durationDays === dur.days
                    ? 'bg-accent text-white border-accent font-bold'
                    : 'bg-surface-2 border-borderDef text-textSecondary hover:text-textPrimary'
                }`}
              >
                {dur.label}
              </button>
            ))}
          </div>
        </div>

        {/* ПРИЧИНА И ОБОСНОВАНИЕ */}
        <div className="space-y-1">
          <label className="font-mono text-textSecondary uppercase font-bold block text-[10px]">
            Обоснование решения (отображается пользователю и в аудите):
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Укажите подробную причину наложения санкции со ссылкой на доказательства..."
            rows={3}
            required
            className="w-full bg-surface-0 border border-borderDef rounded-lg p-2.5 text-xs text-textPrimary outline-none focus:border-accent resize-none font-sans"
          />
        </div>

        {/* ИНВАРИАНТ СОХРАННОСТИ ЦИФРОВЫХ ПРАВ (BR-ACC-055) */}
        <div className="p-2.5 bg-surface-2 rounded-lg border border-borderDef text-[11px] text-textSecondary">
          <span className="font-bold text-textPrimary">Инвариант BR-ACC-055:</span> Блокировка аккаунта ограничивает доступ к платформе, но <strong>не уничтожает Entitlements/игры</strong> в Библиотеке пользователя. При снятии санкций права владения сохраняются.
        </div>

        {/* КНОПКИ ДЕЙСТВИЙ */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-borderDef">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Отмена
          </Button>

          <Button type="submit" variant="danger" disabled={isSubmitting || !reason.trim()} className="font-bold">
            {isSubmitting ? 'Применение...' : 'Применить санкцию'}
          </Button>
        </div>

      </form>
    </Modal>
  );
};

export default UserSanctionModal;
