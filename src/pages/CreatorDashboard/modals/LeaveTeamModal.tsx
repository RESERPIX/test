import React from 'react';
import { LogOut, AlertOctagon, ArrowRight } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { TeamRole } from '../../../types/team';

interface LeaveTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamName: string;
  userRole?: TeamRole;
  onConfirmLeave: () => void;
  onOpenTransferOwnership?: () => void;
}

export const LeaveTeamModal: React.FC<LeaveTeamModalProps> = ({ 
  isOpen, 
  onClose, 
  teamName, 
  userRole = 'member', 
  onConfirmLeave,
  onOpenTransferOwnership 
}) => {
  if (!isOpen) return null;

  const isOwner = userRole === 'owner';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isOwner ? "Невозможно покинуть команду" : `Выйти из команды «${teamName}»?`}
      subtitle={isOwner ? "Инвариант владения (AC-TEAM-021)" : "Подтвердите добровольный выход"}
      icon={isOwner ? <AlertOctagon className="w-5 h-5 text-danger" /> : <LogOut className="w-5 h-5 text-danger" />}
      maxWidth="md"
    >
      <div className="space-y-4 text-textPrimary font-sans">
        {isOwner ? (
          <div className="space-y-3">
            <div className="p-4 bg-danger/10 border border-danger/30 rounded-card flex items-start gap-3">
              <AlertOctagon className="w-5 h-5 text-danger shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-xs font-bold text-danger block">
                  Владелец не может покинуть команду
                </span>
                <p className="text-xs text-textSecondary leading-relaxed">
                  Вы являетесь владельцем студии <strong>«{teamName}»</strong>. По правилам платформы (правило <code>AC-TEAM-021</code>, <code>BR-TEAM-033</code>), команда не может остаться без владельца. Чтобы выйти из команды, сначала передайте права владения другому участнику.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-borderDef">
              <button 
                type="button" 
                onClick={onClose} 
                className="h-9 px-4 rounded-control bg-surface-2 hover:bg-surface-3 text-textSecondary hover:text-textPrimary text-xs font-semibold transition-colors cursor-pointer"
              >
                Закрыть
              </button>
              {onOpenTransferOwnership && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenTransferOwnership();
                  }}
                  className="h-9 px-4 rounded-control bg-accent hover:bg-accent-hover text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>Передать права владельца</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-textSecondary leading-relaxed bg-surface-2 p-3.5 rounded-control border border-borderDef">
              Вы потеряете доступ к управлению проектами, статьям DevLog, модерации отзывов и аналитике студии <strong>«{teamName}»</strong>. Ранее опубликованные вами материалы останутся за командой с сохранением вашего исторического авторства (AC-TEAM-038).
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-borderDef">
              <button 
                type="button" 
                onClick={onClose} 
                className="h-9 px-4 rounded-control bg-surface-2 hover:bg-surface-3 text-textSecondary hover:text-textPrimary text-xs font-semibold transition-colors cursor-pointer"
              >
                Отмена
              </button>
              <button 
                type="button" 
                onClick={() => { onConfirmLeave(); onClose(); }}
                className="h-9 px-4 rounded-control bg-danger hover:bg-danger/90 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <LogOut className="w-3.5 h-3.5" /> Выйти из команды
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};