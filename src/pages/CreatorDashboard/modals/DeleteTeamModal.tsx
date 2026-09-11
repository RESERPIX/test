import React, { useState } from 'react';
import { AlertTriangle, Trash2, ArrowRight, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';

interface DeleteTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: { 
    id: string; 
    name: string; 
    gamesCount: number;
    pendingTransfer?: any;
    hasPendingTransfers?: boolean;
    hasActiveSettlements?: boolean;
    activeJamsCount?: number;
  } | null;
  onConfirmDelete: (teamId: string) => void;
}

export const DeleteTeamModal: React.FC<DeleteTeamModalProps> = ({ isOpen, onClose, team, onConfirmDelete }) => {
  const [confirmText, setConfirmText] = useState('');

  if (!isOpen || !team) return null;

  const hasGames = (team.gamesCount || 0) > 0;
  const hasTransfers = Boolean(team.pendingTransfer || team.hasPendingTransfers);
  const hasSettlements = Boolean(team.hasActiveSettlements);
  const hasActiveJams = Boolean(team.activeJamsCount && team.activeJamsCount > 0);

  const hasBlockers = hasGames || hasTransfers || hasSettlements || hasActiveJams;
  const isMatch = confirmText.trim().toLowerCase() === team.name.trim().toLowerCase();

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => { setConfirmText(''); onClose(); }}
      title="Удаление студии"
      subtitle="Проверка зависимостей и подтверждение удаления (AC-TEAM-054...058)"
      icon={<AlertTriangle className="text-danger" />}
      maxWidth="md"
    >
      <div className="space-y-5 text-textPrimary font-sans">
        {hasBlockers ? (
          <div className="space-y-4">
            <div className="bg-danger/10 border border-danger/30 rounded-card p-4 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-danger shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-danger">Невозможно удалить команду</h4>
                <p className="text-xs text-textSecondary mt-1 leading-relaxed">
                  По правилам платформы (<code>BR-TEAM-026</code>), удаление блокируется до устранения следующих активных зависимостей:
                </p>
              </div>
            </div>

            <div className="space-y-2 bg-surface-2 p-3.5 rounded-card border border-borderDef text-xs font-mono">
              <div className={`flex items-center justify-between p-2 rounded-control ${hasGames ? 'bg-danger/10 text-danger' : 'text-success'}`}>
                <span className="flex items-center gap-2">
                  {hasGames ? <XCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                  Закреплённые игры: {team.gamesCount}
                </span>
                <span className="text-[10px] uppercase font-bold">{hasGames ? 'Блокирует' : 'OK'}</span>
              </div>

              <div className={`flex items-center justify-between p-2 rounded-control ${hasTransfers ? 'bg-danger/10 text-danger' : 'text-success'}`}>
                <span className="flex items-center gap-2">
                  {hasTransfers ? <XCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                  Активные передачи прав (Transfers)
                </span>
                <span className="text-[10px] uppercase font-bold">{hasTransfers ? 'Блокирует' : 'OK'}</span>
              </div>

              <div className={`flex items-center justify-between p-2 rounded-control ${hasSettlements ? 'bg-danger/10 text-danger' : 'text-success'}`}>
                <span className="flex items-center gap-2">
                  {hasSettlements ? <XCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                  Финансовые обязательства / расчеты (Seller)
                </span>
                <span className="text-[10px] uppercase font-bold">{hasSettlements ? 'Блокирует' : 'OK'}</span>
              </div>

              <div className={`flex items-center justify-between p-2 rounded-control ${hasActiveJams ? 'bg-danger/10 text-danger' : 'text-success'}`}>
                <span className="flex items-center gap-2">
                  {hasActiveJams ? <XCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                  Участие в активных джемах (Jam Roster)
                </span>
                <span className="text-[10px] uppercase font-bold">{hasActiveJams ? 'Блокирует' : 'OK'}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-borderDef">
              <button 
                type="button"
                onClick={() => { setConfirmText(''); onClose(); }}
                className="h-9 px-4 rounded-control bg-surface-2 hover:bg-surface-3 text-textPrimary text-xs font-semibold transition-colors cursor-pointer"
              >
                Понятно
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-surface-2 border border-borderDef rounded-card p-4 text-xs text-textSecondary leading-relaxed">
              Вы собираетесь навсегда удалить команду <strong className="text-textPrimary">«{team.name}»</strong>. Все участники будут переведены в статус бывших (Former), а профиль перестанет быть активным. Исторические девлоги и результаты джемов сохранят маркер команды (<code>AC-TEAM-058</code>).
            </div>

            <div>
              <label className="text-xs font-mono text-textSecondary uppercase font-bold block mb-1.5">
                Для подтверждения введите точное название команды:
              </label>
              <input 
                type="text" 
                value={confirmText}
                onChange={e => setConfirmText(e.target.value)}
                placeholder={team.name}
                className="w-full bg-surface-0 border border-borderDef focus:border-danger text-textPrimary px-3 py-2 rounded-control text-xs outline-none transition-colors"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-borderDef">
              <button 
                type="button" 
                onClick={() => { setConfirmText(''); onClose(); }} 
                className="h-9 px-4 rounded-control bg-surface-2 hover:bg-surface-3 text-textSecondary hover:text-textPrimary text-xs font-semibold transition-colors cursor-pointer"
              >
                Отмена
              </button>
              <button 
                type="button"
                disabled={!isMatch}
                onClick={() => {
                  onConfirmDelete(team.id);
                  setConfirmText('');
                  onClose();
                }}
                className={`h-9 px-5 rounded-control text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-sm ${
                  isMatch ? 'bg-danger hover:bg-danger/90 cursor-pointer' : 'bg-surface-3 text-textTertiary cursor-not-allowed'
                }`}
              >
                <Trash2 className="w-4 h-4" /> Удалить навсегда
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
