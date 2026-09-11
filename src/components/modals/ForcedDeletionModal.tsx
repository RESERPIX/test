import React, { useState } from 'react';
import { 
  Trash2, 
  AlertTriangle, 
  ShieldAlert, 
  Lock, 
  CheckCircle2, 
  XCircle, 
  Gamepad2, 
  Users, 
  DollarSign, 
  Info 
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';

export interface ForcedDeletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: {
    id: string;
    username: string;
    displayName: string;
    email: string;
    hasPublishedGames: boolean;
    isSoleTeamOwner: boolean;
    hasPendingFinances: boolean;
  };
  onConfirmForcedDeletion: (userId: string, reason: string) => void;
}

export const ForcedDeletionModal: React.FC<ForcedDeletionModalProps> = ({
  isOpen,
  onClose,
  targetUser,
  onConfirmForcedDeletion
}) => {
  const [confirmationInput, setConfirmationInput] = useState('');
  const [reason, setReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const hasBlockers = targetUser.hasPublishedGames || targetUser.isSoleTeamOwner || targetUser.hasPendingFinances;
  const isConfirmWordCorrect = confirmationInput.trim().toUpperCase() === 'ПРИНУДИТЕЛЬНО';
  const canProceed = !hasBlockers && isConfirmWordCorrect && reason.trim().length >= 10;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canProceed) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onConfirmForcedDeletion(targetUser.id, reason.trim());
      onClose();
    }, 600);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Принудительное удаление аккаунта (SuperAdmin)"
      subtitle={`Процедура экстренного аудированного удаления для @${targetUser.username} (SC-ACC-049)`}
      icon={<Trash2 className="w-5 h-5 text-danger" />}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        
        {/* ПРЕДУПРЕЖДЕНИЕ О НЕОБРАТИМОСТИ */}
        <div className="p-3.5 bg-danger/10 border border-danger/30 rounded-xl space-y-1.5">
          <div className="flex items-center gap-2 text-danger font-bold">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Экстренное удаление (SuperAdmin Forced Deletion: SC-ACC-049)</span>
          </div>
          <p className="text-textSecondary leading-relaxed text-[11px]">
            SuperAdmin вправе инициировать принудительное удаление аккаунта без согласия пользователя при грубых нарушениях. Доступ блокируется немедленно, действие протоколируется в журнале аудита.
          </p>
        </div>

        {/* СНИМОК ЗАВИСИМОСТЕЙ (SYSTEM DEPENDENCIES SNAPSHOT: FR-ACC-064) */}
        <div className="space-y-2">
          <span className="font-mono text-textSecondary uppercase font-bold block text-[10px]">
            Контроль системных зависимостей (Инвариант безопасности):
          </span>

          <div className="space-y-1.5 font-mono">
            {/* 1. Игры автора */}
            <div className={`p-2.5 rounded-lg border flex items-center justify-between text-[11px] ${
              targetUser.hasPublishedGames ? 'bg-danger/10 border-danger/30 text-danger' : 'bg-surface-2 border-borderDef text-textSecondary'
            }`}>
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-3.5 h-3.5 shrink-0" />
                <span>Опубликованные игры автора (BR-ACC-063)</span>
              </div>
              <span className="font-bold">
                {targetUser.hasPublishedGames ? 'БЛОКЕР' : 'Чисто'}
              </span>
            </div>

            {/* 2. Владелец команды */}
            <div className={`p-2.5 rounded-lg border flex items-center justify-between text-[11px] ${
              targetUser.isSoleTeamOwner ? 'bg-danger/10 border-danger/30 text-danger' : 'bg-surface-2 border-borderDef text-textSecondary'
            }`}>
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 shrink-0" />
                <span>Единственный владелец команды (BR-ACC-064)</span>
              </div>
              <span className="font-bold">
                {targetUser.isSoleTeamOwner ? 'БЛОКЕР' : 'Чисто'}
              </span>
            </div>

            {/* 3. Финансы продавца */}
            <div className={`p-2.5 rounded-lg border flex items-center justify-between text-[11px] ${
              targetUser.hasPendingFinances ? 'bg-danger/10 border-danger/30 text-danger' : 'bg-surface-2 border-borderDef text-textSecondary'
            }`}>
              <div className="flex items-center gap-2">
                <DollarSign className="w-3.5 h-3.5 shrink-0" />
                <span>Финансовые обязательства продавца (BR-ACC-065)</span>
              </div>
              <span className="font-bold">
                {targetUser.hasPendingFinances ? 'БЛОКЕР' : 'Чисто'}
              </span>
            </div>
          </div>

          {hasBlockers && (
            <div className="p-2.5 bg-warning/10 border border-warning/30 rounded-lg text-warning text-[11px] flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>Внимание:</strong> Принудительное удаление невозможно до разрешения системных блокеров. Платформа не допускает оставление игр без владельца или обход финансовых обязательств.
              </span>
            </div>
          )}
        </div>

        {/* ПРИЧИНА УДАЛЕНИЯ */}
        <div className="space-y-1">
          <label className="font-mono text-textSecondary uppercase font-bold block text-[10px]">
            Официальное основание для принудительного удаления (минимум 10 символов):
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Укажите исчерпывающее юридическое или модерационное основание..."
            rows={3}
            disabled={hasBlockers}
            className="w-full bg-surface-0 border border-borderDef rounded-lg p-2.5 text-xs text-textPrimary outline-none focus:border-accent resize-none font-sans"
          />
        </div>

        {/* ЗАЩИТНОЕ СЛОВО-ПОДТВЕРЖДЕНИЕ */}
        <div className="space-y-1">
          <label className="font-mono text-textSecondary uppercase font-bold block text-[10px]">
            Для подтверждения введите слово <span className="text-danger font-bold">ПРИНУДИТЕЛЬНО</span>:
          </label>
          <Input
            value={confirmationInput}
            onChange={(e) => setConfirmationInput(e.target.value)}
            placeholder="Введите слово заглавными буквами"
            disabled={hasBlockers}
            className="font-mono text-xs uppercase"
          />
        </div>

        {/* ФУТЕР ДЕЙСТВИЙ */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-borderDef">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isProcessing}>
            Отмена
          </Button>

          <Button
            type="submit"
            variant="danger"
            disabled={!canProceed || isProcessing}
            className="font-bold flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isProcessing ? 'Удаление...' : 'Принудительно удалить аккаунт'}</span>
          </Button>
        </div>

      </form>
    </Modal>
  );
};

export default ForcedDeletionModal;
