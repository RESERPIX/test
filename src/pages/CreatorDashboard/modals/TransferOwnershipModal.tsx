import React, { useState } from 'react';
import { Crown, AlertTriangle, ArrowRight, Shield } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { TeamMember, TeamRole } from '../../../types/team';

interface TransferOwnershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamName: string;
  targetMember: TeamMember | null;
  onInitiateTransfer: (targetMemberId: string, postTransferRole: 'admin' | 'member') => void;
}

export const TransferOwnershipModal: React.FC<TransferOwnershipModalProps> = ({
  isOpen,
  onClose,
  teamName,
  targetMember,
  onInitiateTransfer
}) => {
  const [postTransferRole, setPostTransferRole] = useState<'admin' | 'member'>('admin');
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen || !targetMember) return null;

  const handleConfirm = () => {
    onInitiateTransfer(targetMember.id, postTransferRole);
    setConfirmed(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => { setConfirmed(false); onClose(); }}
      title="Передача прав владельца команды"
      subtitle={`Команда «${teamName}» • Двухэтапный протокол (AC-TEAM-022...026)`}
      icon={<Crown className="w-5 h-5 text-accent" />}
      maxWidth="md"
    >
      <div className="space-y-4 text-textPrimary font-sans">
        {/* Target Member Card */}
        <div className="flex items-center gap-3 p-3.5 bg-surface-2 rounded-card border border-borderDef">
          <img 
            src={targetMember.avatar} 
            alt={targetMember.name} 
            className="w-10 h-10 rounded-full border border-borderDef bg-surface-0 object-cover shrink-0" 
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-textPrimary truncate">{targetMember.name}</h4>
            <p className="text-xs font-mono text-textSecondary">{targetMember.nick}</p>
          </div>
          <span className="px-2 py-0.5 rounded-control text-[10px] font-mono font-bold uppercase tracking-wider bg-surface-3 text-textSecondary border border-borderDef">
            Текущая роль: {targetMember.role}
          </span>
        </div>

        {/* Warning / Rules */}
        <div className="p-3.5 bg-reaction/10 border border-reaction/30 rounded-card text-xs text-textSecondary space-y-2 leading-relaxed">
          <div className="flex items-center gap-2 text-reaction font-bold">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Важная информация о передаче:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 pl-1 text-[11px]">
            <li>Передача требует <strong>явного подтверждения (Accept)</strong> со стороны {targetMember.name}.</li>
            <li>До момента принятия вы остаётесь полноценным владельцем команды (AC-TEAM-022).</li>
            <li>Вы можете отозвать предложение в любой момент до его принятия (AC-TEAM-025).</li>
            <li>После принятия новый участник станет Владельцем, а вы перейдете в выбранную роль.</li>
          </ul>
        </div>

        {/* Post-Transfer Role Selection */}
        <div>
          <label className="text-xs font-mono text-textSecondary uppercase font-bold block mb-2">
            Ваша роль после завершения передачи (AC-TEAM-025):
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPostTransferRole('admin')}
              className={`p-3 rounded-card border text-left transition-colors cursor-pointer ${
                postTransferRole === 'admin' 
                  ? 'border-accent bg-accent/10 text-textPrimary' 
                  : 'border-borderDef bg-surface-2 text-textSecondary hover:bg-surface-3'
              }`}
            >
              <div className="font-bold text-xs flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-accent" /> Администратор
              </div>
              <div className="text-[11px] text-textSecondary mt-1">
                Сохранить доступ к управлению играми и настройкам
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPostTransferRole('member')}
              className={`p-3 rounded-card border text-left transition-colors cursor-pointer ${
                postTransferRole === 'member' 
                  ? 'border-accent bg-accent/10 text-textPrimary' 
                  : 'border-borderDef bg-surface-2 text-textSecondary hover:bg-surface-3'
              }`}
            >
              <div className="font-bold text-xs flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-textSecondary" /> Участник
              </div>
              <div className="text-[11px] text-textSecondary mt-1">
                Базовый доступ к назначенным проектам
              </div>
            </button>
          </div>
        </div>

        {/* Confirmation Checkbox */}
        <label className="flex items-start gap-2.5 p-3 rounded-card bg-surface-2 border border-borderDef cursor-pointer">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={e => setConfirmed(e.target.checked)}
            className="mt-0.5 accent-accent rounded"
          />
          <span className="text-xs text-textSecondary leading-snug">
            Я понимаю, что передаю полный контроль над студией, привязанными играми и настройками пользователю <strong className="text-textPrimary">{targetMember.nick}</strong>.
          </span>
        </label>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-borderDef">
          <button
            type="button"
            onClick={() => { setConfirmed(false); onClose(); }}
            className="h-9 px-4 rounded-control bg-surface-2 hover:bg-surface-3 text-textSecondary hover:text-textPrimary text-xs font-semibold transition-colors cursor-pointer"
          >
            Отмена
          </button>
          <button
            type="button"
            disabled={!confirmed}
            onClick={handleConfirm}
            className={`h-9 px-5 rounded-control text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-sm ${
              confirmed 
                ? 'bg-accent hover:bg-accent-hover cursor-pointer' 
                : 'bg-surface-3 text-textTertiary cursor-not-allowed'
            }`}
          >
            <span>Отправить предложение</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </Modal>
  );
};
