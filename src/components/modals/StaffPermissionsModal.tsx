import React, { useState } from 'react';
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Check, 
  X, 
  Lock, 
  AlertTriangle, 
  Users, 
  Gamepad2, 
  DollarSign, 
  MessageSquare, 
  FileText,
  Flame,
  Award
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import Button from '../ui/Button';

export interface PermissionDefinition {
  id: string;
  name: string;
  description: string;
  category: 'users' | 'content' | 'moderation' | 'finance' | 'admin';
  isSuperAdminOnly?: boolean;
}

export const PERMISSIONS_CATALOG: PermissionDefinition[] = [
  {
    id: 'users.view',
    name: 'Просмотр пользователей',
    description: 'Доступ к реестру и операционным карточкам пользователей (Section 14)',
    category: 'users'
  },
  {
    id: 'users.manage',
    name: 'Управление санкциями',
    description: 'Наложение и снятие временных/постоянных ограничений (SC-ACC-039..042)',
    category: 'users'
  },
  {
    id: 'users.delete',
    name: 'Принудительное удаление (Forced)',
    description: 'Инициирование принудительного удаления учетных записей (SC-ACC-049)',
    category: 'users',
    isSuperAdminOnly: true
  },
  {
    id: 'community.moderate',
    name: 'Модерация сообщества',
    description: 'Удаление недопустимых сообщений, закрытие тем и блокировка спама',
    category: 'moderation'
  },
  {
    id: 'reports.resolve',
    name: 'Обработка жалоб',
    description: 'Рассмотрение тикетов в очереди жалоб пользователей (Reports Queue)',
    category: 'moderation'
  },
  {
    id: 'market.moderate',
    name: 'Модерация маркета',
    description: 'Проверка и публикация релизов игр в основном каталоге',
    category: 'content'
  },
  {
    id: 'games.review',
    name: 'Ревью билдов и девлогов',
    description: 'Проверка загружаемых исполняемых файлов и статей девлога',
    category: 'content'
  },
  {
    id: 'jams.manage',
    name: 'Управление джемами',
    description: 'Назначение судей и модерация игровых джемов платформы',
    category: 'content'
  },
  {
    id: 'finance.view',
    name: 'Финансовая аналитика',
    description: 'Просмотр балансов продавцов, истории выплат и споров',
    category: 'finance',
    isSuperAdminOnly: true
  },
  {
    id: 'permissions.manage',
    name: 'Управление правами персонала',
    description: 'Назначение и отзыв полномочий модераторов и администраторов (SC-ACC-037)',
    category: 'admin',
    isSuperAdminOnly: true
  },
  {
    id: 'audit.view',
    name: 'Полный журнал аудита',
    description: 'Неизменяемая история всех административных действий платформы',
    category: 'admin'
  }
];

export interface StaffPermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: {
    id: string;
    username: string;
    displayName: string;
    role: 'moderator' | 'admin' | 'user';
    permissions: string[];
  };
  currentStaffRole: 'super_admin' | 'admin' | 'moderator';
  onSavePermissions: (userId: string, newPermissions: string[]) => void;
}

export const StaffPermissionsModal: React.FC<StaffPermissionsModalProps> = ({
  isOpen,
  onClose,
  targetUser,
  currentStaffRole,
  onSavePermissions
}) => {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(targetUser.permissions || []);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const isSuperAdmin = currentStaffRole === 'super_admin';
  const hasFullAccess = selectedPermissions.includes('*');

  const handleToggle = (permissionId: string) => {
    // Только SuperAdmin имеет право назначать и менять permissions (SC-ACC-037, FR-ACC-071)
    if (!isSuperAdmin) return;

    if (selectedPermissions.includes(permissionId)) {
      setSelectedPermissions(prev => prev.filter(p => p !== permissionId));
    } else {
      setSelectedPermissions(prev => [...prev, permissionId]);
    }
  };

  const handleSelectAll = () => {
    if (!isSuperAdmin) return;
    const allIds = PERMISSIONS_CATALOG.filter(p => !p.isSuperAdminOnly || isSuperAdmin).map(p => p.id);
    setSelectedPermissions(allIds);
  };

  const handleClearAll = () => {
    if (!isSuperAdmin) return;
    setSelectedPermissions([]);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) return;

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      onSavePermissions(targetUser.id, selectedPermissions);
      onClose();
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Управление правами доступа персонала"
      subtitle={`Настройка каталога разрешений (RBAC) для сотрудника @${targetUser.username}`}
      icon={<Shield className="w-5 h-5 text-accent" />}
      maxWidth="lg"
    >
      <form onSubmit={handleSave} className="space-y-4">
        
        {/* ПРЕДУПРЕЖДЕНИЕ О ПРАВАХ SUPERADMIN (SC-ACC-037, FR-ACC-071) */}
        {!isSuperAdmin ? (
          <div className="p-3.5 bg-danger/10 border border-danger/30 rounded-xl space-y-1 text-xs">
            <div className="flex items-center gap-2 text-danger font-bold">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Ограничение доступа (Fail-Closed Gate: SC-ACC-038)</span>
            </div>
            <p className="text-textSecondary leading-relaxed">
              Вы вошли с ролью <strong className="text-textPrimary uppercase font-mono">{currentStaffRole}</strong>. 
              Согласно правилу безопасности <span className="font-mono text-danger">FR-ACC-071</span>, назначение и изменение полномочий сотрудников разрешено <strong>исключительно Super Admin</strong>. Режим доступен только для чтения.
            </p>
          </div>
        ) : (
          <div className="p-3 bg-accent/10 border border-accent/30 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-accent font-semibold">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Режим SuperAdmin: разрешено назначение гранулярных прав</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-[11px] font-mono text-accent hover:underline cursor-pointer"
              >
                Выбрать все
              </button>
              <span className="text-textTertiary">•</span>
              <button
                type="button"
                onClick={handleClearAll}
                className="text-[11px] font-mono text-textTertiary hover:text-textPrimary cursor-pointer"
              >
                Сбросить
              </button>
            </div>
          </div>
        )}

        {/* ИНФО О СОТРУДНИКЕ */}
        <div className="p-3 bg-surface-2 rounded-xl border border-borderDef flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-textTertiary">Сотрудник:</span>
            <strong className="text-textPrimary">{targetUser.displayName} (@{targetUser.username})</strong>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-textTertiary">Роль:</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-accent/20 text-accent uppercase">
              {targetUser.role}
            </span>
          </div>
        </div>

        {/* КАТАЛОГ ПРАВ (GRID) */}
        <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
          {PERMISSIONS_CATALOG.map((perm) => {
            const isChecked = hasFullAccess || selectedPermissions.includes(perm.id);
            const isDisabled = !isSuperAdmin;

            return (
              <label
                key={perm.id}
                className={`p-3 rounded-xl border transition-all flex items-start justify-between gap-3 select-none ${
                  isDisabled
                    ? 'bg-surface-2/60 border-borderDef/60 opacity-80 cursor-not-allowed'
                    : isChecked
                      ? 'bg-accent/5 border-accent/40 hover:border-accent cursor-pointer'
                      : 'bg-surface-2 border-borderDef hover:border-borderStrong cursor-pointer'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggle(perm.id)}
                    disabled={isDisabled}
                    className="mt-0.5 rounded text-accent focus:ring-accent w-4 h-4 cursor-pointer"
                  />
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-textPrimary">{perm.name}</span>
                      <span className="text-[10px] font-mono text-textTertiary px-1.5 py-0.2 bg-surface-3 rounded border border-borderDef">
                        {perm.id}
                      </span>
                      {perm.isSuperAdminOnly && (
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-purple-500/15 text-purple-400 border border-purple-500/30">
                          SuperAdmin
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-textSecondary leading-relaxed">
                      {perm.description}
                    </p>
                  </div>
                </div>

                {isChecked && (
                  <span className="text-accent shrink-0 pt-0.5">
                    <Check className="w-4 h-4" />
                  </span>
                )}
              </label>
            );
          })}
        </div>

        {/* ФУТЕР ДЕЙСТВИЙ */}
        <div className="flex items-center justify-between pt-3 border-t border-borderDef text-xs">
          <span className="text-textTertiary font-mono">
            Выбрано прав: <strong className="text-textPrimary">{selectedPermissions.length}</strong> из {PERMISSIONS_CATALOG.length}
          </span>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSaving}
            >
              Отмена
            </Button>

            <Button
              type="submit"
              variant="primary"
              disabled={!isSuperAdmin || isSaving}
              className="font-bold flex items-center gap-1.5"
            >
              <Shield className="w-4 h-4" />
              <span>{isSaving ? 'Сохранение...' : 'Сохранить права'}</span>
            </Button>
          </div>
        </div>

      </form>
    </Modal>
  );
};

export default StaffPermissionsModal;
