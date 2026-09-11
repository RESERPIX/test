import React from 'react';
import { ShieldAlert, XCircle, AlertTriangle, Lock } from 'lucide-react';
import { Modal } from '../ui/Modal';
import Button from '../ui/Button';

export interface FailClosedForbiddenModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredPermission: string;
  attemptedAction: string;
  currentStaffRole: string;
}

export const FailClosedForbiddenModal: React.FC<FailClosedForbiddenModalProps> = ({
  isOpen,
  onClose,
  requiredPermission,
  attemptedAction,
  currentStaffRole
}) => {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="403 Доступ запрещен (Fail-Closed Gate)"
      subtitle="Отказ в выполнении административной операции по правилу SC-ACC-038"
      icon={<ShieldAlert className="w-5 h-5 text-danger" />}
      maxWidth="md"
    >
      <div className="space-y-4">
        
        {/* Предупреждение о нарушении полномочий */}
        <div className="p-4 bg-danger/10 border border-danger/30 rounded-xl space-y-2 text-xs">
          <div className="flex items-center gap-2 text-danger font-bold">
            <Lock className="w-4 h-4 shrink-0" />
            <span>Недостаточно полномочий для выполнения действия</span>
          </div>
          <p className="text-textSecondary leading-relaxed">
            Попытка выполнить операцию: <strong className="text-textPrimary">«{attemptedAction}»</strong>.
            Ваша текущая роль <span className="font-mono uppercase font-bold text-textPrimary">[{currentStaffRole}]</span> не обладает требуемым разрешением.
          </p>
        </div>

        {/* Сведения о требуемом праве */}
        <div className="bg-surface-2 p-3.5 rounded-xl border border-borderDef space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between text-textSecondary">
            <span>Требуемое разрешение:</span>
            <span className="px-2 py-0.5 rounded bg-surface-3 border border-borderDef text-accent font-bold">
              {requiredPermission}
            </span>
          </div>
          <div className="flex items-center justify-between text-textSecondary">
            <span>Принцип безопасности:</span>
            <span className="text-textPrimary">Fail-Closed / No Self-Escalation (FR-ACC-071)</span>
          </div>
        </div>

        <p className="text-[11px] text-textTertiary leading-relaxed">
          В соответствии с политикой глобального администрирования платформы Hubigr (Раздел 7 ТЗ <code>account.md</code>), статус сотрудника сам по себе не предоставляет автоматического доступа. Полномочия должны быть явно делегированы SuperAdmin.
        </p>

        {/* Кнопка закрытия */}
        <div className="flex justify-end pt-3 border-t border-borderDef">
          <Button variant="secondary" onClick={onClose}>
            Понятно
          </Button>
        </div>

      </div>
    </Modal>
  );
};

export default FailClosedForbiddenModal;
