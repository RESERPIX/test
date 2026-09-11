import React, { useState } from 'react';
import { 
  HelpCircle, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  ExternalLink, 
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';

export interface AccountAppealModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId?: string;
  restrictionTitle?: string;
  onAppealSubmitted?: (appealData: { category: string; explanation: string; evidenceUrl?: string }) => void;
  onAppealApproved?: () => void;
  onAppealRejected?: () => void;
}

export type AppealStatus = 'form' | 'submitted' | 'approved' | 'rejected';

export const AccountAppealModal: React.FC<AccountAppealModalProps> = ({
  isOpen,
  onClose,
  caseId = 'BAN-89412',
  restrictionTitle = 'Ограничение учетной записи',
  onAppealSubmitted,
  onAppealApproved,
  onAppealRejected
}) => {
  const [status, setStatus] = useState<AppealStatus>('form');
  const [category, setCategory] = useState('mistake');
  const [explanation, setExplanation] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!explanation.trim()) {
      setError('Пожалуйста, подробно опишите причину и обстоятельства для рассмотрения апелляции');
      return;
    }
    setError(null);
    setStatus('submitted');
    if (onAppealSubmitted) {
      onAppealSubmitted({ category, explanation, evidenceUrl });
    }
  };

  const handleSimulateApprove = () => {
    setStatus('approved');
    if (onAppealApproved) {
      onAppealApproved();
    }
  };

  const handleSimulateReject = () => {
    setStatus('rejected');
    if (onAppealRejected) {
      onAppealRejected();
    }
  };

  const handleReset = () => {
    setStatus('form');
    setExplanation('');
    setEvidenceUrl('');
    setError(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Апелляция решения модерации"
      subtitle={`Обжалование по делу #${caseId}`}
      icon={<HelpCircle className="w-5 h-5 text-accent" />}
      maxWidth="md"
    >
      <div className="space-y-4">

        {/* ШАГ 1: ФОРМА ПОДАЧИ АПЕЛЛЯЦИИ */}
        {status === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Блок текущего дела */}
            <div className="p-3 bg-surface-2 border border-borderDef rounded-control text-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-textTertiary font-mono block">Предмет апелляции</span>
                <span className="font-bold text-textPrimary">{restrictionTitle}</span>
              </div>
              <span className="px-2 py-0.5 rounded font-mono text-[11px] font-bold bg-surface-3 text-textSecondary">
                #{caseId}
              </span>
            </div>

            {error && (
              <div className="p-3 bg-danger/10 border border-danger/30 rounded-control text-xs text-danger flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Категория обращения */}
            <div className="space-y-1.5">
              <label className="text-caption font-bold text-textSecondary uppercase tracking-wider block">
                Категория обращения
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { id: 'mistake', label: 'Ошибочная блокировка' },
                  { id: 'hacked', label: 'Аккаунт был скомпрометирован' },
                  { id: 'fixed', label: 'Нарушение устранено' },
                  { id: 'other', label: 'Другие обстоятельства' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCategory(item.id)}
                    className={`p-2.5 rounded-control border text-xs font-semibold text-left transition-colors cursor-pointer ${
                      category === item.id 
                        ? 'bg-accent/15 border-accent text-textPrimary' 
                        : 'bg-surface-2 border-borderDef text-textSecondary hover:text-textPrimary hover:bg-surface-3'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Пояснение */}
            <div className="space-y-1.5">
              <label className="text-caption font-bold text-textSecondary uppercase tracking-wider block">
                Обоснование апелляции
              </label>
              <textarea
                value={explanation}
                onChange={(e) => { setExplanation(e.target.value); setError(null); }}
                placeholder="Подробно объясните, почему вы считаете наложенное ограничение необоснованным, либо опишите принятые вами меры по устранению нарушения..."
                rows={4}
                className="w-full bg-surface-2 border border-borderDef focus:border-accent text-textPrimary text-xs p-3 rounded-control outline-none resize-none placeholder-textTertiary"
              />
              <div className="flex justify-between text-[10px] text-textTertiary font-mono">
                <span>Минимум 20 символов</span>
                <span>{explanation.length} / 1000</span>
              </div>
            </div>

            {/* Ссылки на материалы / скриншоты */}
            <div className="space-y-1.5">
              <label className="text-caption font-bold text-textSecondary uppercase tracking-wider block">
                Ссылки на материалы (необязательно)
              </label>
              <Input
                type="url"
                value={evidenceUrl}
                onChange={(e) => setEvidenceUrl(e.target.value)}
                placeholder="https://imgur.com/... или ссылка на скриншот"
              />
              <span className="text-[10px] text-textTertiary font-mono block">
                Вы можете приложить ссылки на облачные хранилища со скриншотами или документами.
              </span>
            </div>

            {/* Кнопки формы */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-borderDef">
              <Button variant="secondary" type="button" onClick={onClose}>
                Отмена
              </Button>
              <Button variant="primary" type="submit">
                <Send className="w-3.5 h-3.5 mr-1.5" />
                <span>Отправить апелляцию</span>
              </Button>
            </div>

          </form>
        )}

        {/* ШАГ 2: АПЕЛЛЯЦИЯ ОТПРАВЛЕНА (СТАТУС НА РАССМОТРЕНИИ) */}
        {status === 'submitted' && (
          <div className="space-y-4 text-center py-2 animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-info/15 text-info border border-info/30 flex items-center justify-center mx-auto">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold text-textPrimary">Апелляция принята на рассмотрение</h4>
              <p className="text-xs text-textSecondary max-w-sm mx-auto leading-relaxed">
                Обращение зарегистрировано под номером <span className="font-mono font-bold text-textPrimary">#APL-{caseId}</span>. Срок рассмотрения старшими модераторами составляет до 48 часов.
              </p>
            </div>

            <div className="p-3 bg-surface-2 rounded-control border border-borderDef text-left text-xs space-y-1 font-mono">
              <div className="flex justify-between text-textTertiary">
                <span>Категория:</span>
                <span className="text-textPrimary font-semibold">
                  {category === 'mistake' ? 'Ошибочная блокировка' : 
                   category === 'hacked' ? 'Скомпрометирован' : 
                   category === 'fixed' ? 'Нарушение устранено' : 'Другое'}
                </span>
              </div>
              <div className="flex justify-between text-textTertiary">
                <span>Статус рассмотрения:</span>
                <span className="text-info font-semibold">В очереди (Pending Review)</span>
              </div>
            </div>

            {/* Панель симуляции для интерактивного тестирования в прототипе */}
            <div className="p-3 bg-surface-0 border border-dashed border-borderDef rounded-control text-xs space-y-2 text-left">
              <span className="font-mono text-[10px] text-textTertiary uppercase font-bold block">Симуляция ответа модератора (QA):</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSimulateApprove}
                  className="flex-1 text-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Одобрить (Разбан)
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleSimulateReject}
                  className="flex-1 text-xs"
                >
                  <XCircle className="w-3.5 h-3.5 mr-1" /> Отклонить
                </Button>
              </div>
            </div>

            <div className="pt-2 border-t border-borderDef flex justify-end">
              <Button variant="secondary" onClick={onClose}>
                Закрыть
              </Button>
            </div>
          </div>
        )}

        {/* ШАГ 3А: АПЕЛЛЯЦИЯ ОДОБРЕНА (РАЗБЛОКИРОВАНО) */}
        {status === 'approved' && (
          <div className="space-y-4 text-center py-2 animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-success/15 text-success border border-success/30 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold text-success">Апелляция удовлетворена</h4>
              <p className="text-xs text-textSecondary max-w-sm mx-auto leading-relaxed">
                Модерация пересмотрела решение по делу #{caseId}. Ограничение снято, все возможности учетной записи полностью восстановлены.
              </p>
            </div>

            <div className="p-3 bg-success/5 border border-success/20 rounded-control text-xs text-left space-y-1">
              <span className="font-bold text-textPrimary">Комментарий старшего модератора:</span>
              <p className="text-textSecondary leading-relaxed">
                «Факты проверены. Блокировка снята как ошибочная. Приносим извинения за временные неудобства.»
              </p>
            </div>

            <div className="pt-2 border-t border-borderDef flex items-center justify-between">
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-mono text-textTertiary hover:text-textPrimary flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Сбросить статус
              </button>
              <Button variant="primary" onClick={onClose}>
                Понятно
              </Button>
            </div>
          </div>
        )}

        {/* ШАГ 3Б: АПЕЛЛЯЦИЯ ОТКЛОНЕНА */}
        {status === 'rejected' && (
          <div className="space-y-4 text-center py-2 animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-danger/15 text-danger border border-danger/30 flex items-center justify-center mx-auto">
              <XCircle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold text-danger">Апелляция отклонена</h4>
              <p className="text-xs text-textSecondary max-w-sm mx-auto leading-relaxed">
                После повторного изучения материалов модерация оставила решение в силе.
              </p>
            </div>

            <div className="p-3 bg-danger/5 border border-danger/20 rounded-control text-xs text-left space-y-1">
              <span className="font-bold text-textPrimary">Официальный ответ:</span>
              <p className="text-textSecondary leading-relaxed">
                «В предоставленных материалах подтвержден факт нарушения правил сообщества. Ограничение остаётся в силе до истечения установленного срока.»
              </p>
            </div>

            <div className="pt-2 border-t border-borderDef flex items-center justify-between">
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-mono text-textTertiary hover:text-textPrimary flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Попробовать снова
              </button>
              <Button variant="secondary" onClick={onClose}>
                Закрыть
              </Button>
            </div>
          </div>
        )}

      </div>
    </Modal>
  );
};

export default AccountAppealModal;
