import React from 'react';
import { 
  FileText, 
  ShieldCheck, 
  Clock, 
  UserCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Trash2, 
  Lock 
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import Button from '../ui/Button';

export interface AuditRecord {
  id: string;
  timestamp: string;
  action: 'SANCTION_APPLIED' | 'SANCTION_LIFTED' | 'PERMISSIONS_UPDATED' | 'FORCED_DELETION' | 'STATUS_CHANGED';
  actor: string;
  caseId?: string;
  ruleCode?: string;
  details: string;
}

export interface UserAuditHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: {
    username: string;
    displayName: string;
  };
  auditHistory: AuditRecord[];
}

export const UserAuditHistoryModal: React.FC<UserAuditHistoryModalProps> = ({
  isOpen,
  onClose,
  targetUser,
  auditHistory
}) => {
  if (!isOpen) return null;

  const getActionBadge = (action: AuditRecord['action']) => {
    switch (action) {
      case 'SANCTION_APPLIED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-warning/15 text-warning border border-warning/30">САНКЦИЯ ВЫДАНА</span>;
      case 'SANCTION_LIFTED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-success/15 text-success border border-success/30">САНКЦИЯ СНЯТА</span>;
      case 'PERMISSIONS_UPDATED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-accent/15 text-accent border border-accent/30">ПРАВА ИЗМЕНЕНЫ</span>;
      case 'FORCED_DELETION':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-danger/15 text-danger border border-danger/30">ПРИНУДИТЕЛЬНОЕ УДАЛЕНИЕ</span>;
      case 'STATUS_CHANGED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">СТАТУС ИЗМЕНЕН</span>;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Журнал аудита действий (Account Action Audit)"
      subtitle={`Неизменяемая история решений и взысканий для @${targetUser.username} (FR-ACC-055, SC-ACC-050)`}
      icon={<FileText className="w-5 h-5 text-accent" />}
      maxWidth="lg"
    >
      <div className="space-y-4 text-xs">
        
        {/* ИНВАРИАНТ НЕИЗМЕНЯЕМОСТИ (FR-ACC-055) */}
        <div className="p-3 bg-accent/5 border border-accent/20 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-accent font-semibold">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Неизменяемый реестр (Immutable Audit Log)</span>
          </div>
          <span className="text-[10px] font-mono text-textTertiary">
            Записи защищены от редактирования персоналом
          </span>
        </div>

        {/* СПИСОК ЗАПИСЕЙ АУДИТА */}
        <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
          {auditHistory.length === 0 ? (
            <div className="p-8 text-center text-textTertiary font-mono">
              Дисциплинарные или административные записи в журнале отсутствуют
            </div>
          ) : (
            auditHistory.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-surface-2 rounded-xl border border-borderDef space-y-1.5 transition-colors hover:border-borderStrong"
              >
                <div className="flex items-start justify-between gap-3 text-[11px] font-mono">
                  <div className="flex items-center gap-2">
                    {getActionBadge(item.action)}
                    {item.caseId && (
                      <span className="text-textSecondary font-bold">{item.caseId}</span>
                    )}
                    {item.ruleCode && (
                      <span className="text-textTertiary">({item.ruleCode})</span>
                    )}
                  </div>

                  <span className="text-textTertiary shrink-0">{item.timestamp}</span>
                </div>

                <p className="text-textPrimary leading-relaxed">
                  {item.details}
                </p>

                <div className="text-[10px] font-mono text-textTertiary pt-1 border-t border-borderDef/60 flex items-center justify-between">
                  <span>Исполнитель: <strong className="text-textSecondary">{item.actor}</strong></span>
                  <span>ID события: #{item.id}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ФУТЕР */}
        <div className="flex items-center justify-between pt-3 border-t border-borderDef text-xs">
          <span className="text-textTertiary font-mono">
            Всего записей в аудите: <strong className="text-textPrimary">{auditHistory.length}</strong>
          </span>

          <Button variant="secondary" onClick={onClose}>
            Закрыть
          </Button>
        </div>

      </div>
    </Modal>
  );
};

export default UserAuditHistoryModal;
