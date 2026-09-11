import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Shield, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Eye, 
  Lock, 
  ShieldAlert, 
  Gamepad2, 
  DollarSign, 
  ChevronRight, 
  ExternalLink,
  Smartphone,
  Mail,
  Calendar,
  KeyRound,
  ShieldCheck,
  UserCheck,
  UserX,
  RefreshCw,
  X,
  FileText,
  Trash2
} from 'lucide-react';
import Button from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import Input from '../components/ui/Input';
import { useToast } from '../components/ui/Toast';
import DevMatrixPanel, { DevMatrixField } from '../components/DevMatrixPanel';
import { StaffPermissionsModal } from '../components/modals/StaffPermissionsModal';
import { FailClosedForbiddenModal } from '../components/modals/FailClosedForbiddenModal';
import { UserSanctionModal, SanctionType } from '../components/modals/UserSanctionModal';
import { ForcedDeletionModal } from '../components/modals/ForcedDeletionModal';
import { UserAuditHistoryModal, AuditRecord } from '../components/modals/UserAuditHistoryModal';

export type UserAccountState = 'active' | 'suspended' | 'banned' | 'pending_deletion';
export type StaffRole = 'user' | 'moderator' | 'admin' | 'super_admin';

export interface AdminUserRecord {
  id: string;
  username: string;
  displayName: string;
  email: string;
  isEmailVerified: boolean;
  phoneMasked: string;
  isPhoneVerified: boolean;
  dob: string;
  isDobVerified: boolean;
  is2FAEnabled: boolean;
  state: UserAccountState;
  role: StaffRole;
  registeredAt: string;
  lastActiveAt: string;
  sellerStatus: 'none' | 'pending_verification' | 'active' | 'suspended';
  teams: { id: string; name: string; role: 'Owner' | 'Admin' | 'Member' }[];
  games: { id: string; title: string; status: 'published' | 'draft' }[];
  purchasesCount: number;
  purchasesTotalRub: number;
  refundsCount: number;
  activeRestrictions: { capability: string; reason: string; expiresAt?: string }[];
  permissions?: string[];
  deletionInfo?: { deadline: string; daysRemaining: number };
}

export const MOCK_ADMIN_USERS: AdminUserRecord[] = [
  {
    id: 'usr-101',
    username: 'johndoe',
    displayName: 'John Doe',
    email: 'john.doe@example.com',
    isEmailVerified: true,
    phoneMasked: '+7 (999) ***-48-21',
    isPhoneVerified: true,
    dob: '1998-05-14',
    isDobVerified: true,
    is2FAEnabled: true,
    state: 'active',
    role: 'user',
    registeredAt: '2026-01-15',
    lastActiveAt: '10 минут назад',
    sellerStatus: 'active',
    teams: [
      { id: 'team-1', name: 'Quantum Leap Studio', role: 'Owner' }
    ],
    games: [
      { id: 'g-1', title: 'Cyber Quest: Origins', status: 'published' },
      { id: 'g-4', title: 'Neon Highway 2026', status: 'draft' }
    ],
    purchasesCount: 12,
    purchasesTotalRub: 4850,
    refundsCount: 0,
    activeRestrictions: []
  },
  {
    id: 'usr-102',
    username: 'alex_proto',
    displayName: 'Alex Mercer',
    email: 'alex@proto.dev',
    isEmailVerified: true,
    phoneMasked: '+7 (912) ***-11-90',
    isPhoneVerified: true,
    dob: '1995-11-20',
    isDobVerified: true,
    is2FAEnabled: true,
    state: 'active',
    role: 'moderator',
    registeredAt: '2025-11-04',
    lastActiveAt: '2 часа назад',
    sellerStatus: 'none',
    teams: [],
    games: [],
    purchasesCount: 3,
    purchasesTotalRub: 750,
    refundsCount: 0,
    activeRestrictions: [],
    permissions: ['community.moderate', 'reports.resolve']
  },
  {
    id: 'usr-103',
    username: 'spammer_x',
    displayName: 'Spam Bot 99',
    email: 'spam99@tempmail.org',
    isEmailVerified: true,
    phoneMasked: 'Не привязан',
    isPhoneVerified: false,
    dob: '2004-02-10',
    isDobVerified: true,
    is2FAEnabled: false,
    state: 'suspended',
    role: 'user',
    registeredAt: '2026-08-20',
    lastActiveAt: '3 дня назад',
    sellerStatus: 'none',
    teams: [],
    games: [],
    purchasesCount: 1,
    purchasesTotalRub: 0,
    refundsCount: 0,
    activeRestrictions: [
      { capability: 'comments', reason: 'Многократный спам ссылками в отзывах (CASE-1049)', expiresAt: '2026-09-18' }
    ]
  },
  {
    id: 'usr-104',
    username: 'admin_dev',
    displayName: 'Security Admin',
    email: 'admin_dev@hubigr.ru',
    isEmailVerified: true,
    phoneMasked: '+7 (903) ***-33-22',
    isPhoneVerified: true,
    dob: '1990-07-03',
    isDobVerified: true,
    is2FAEnabled: true,
    state: 'active',
    role: 'admin',
    registeredAt: '2025-06-01',
    lastActiveAt: 'Сейчас в сети',
    sellerStatus: 'none',
    teams: [],
    games: [],
    purchasesCount: 24,
    purchasesTotalRub: 15400,
    refundsCount: 1,
    activeRestrictions: [],
    permissions: ['users.view', 'games.review', 'market.moderate']
  },
  {
    id: 'usr-105',
    username: 'elena_art',
    displayName: 'Elena Rostova',
    email: 'elena@artstudio.com',
    isEmailVerified: true,
    phoneMasked: '+7 (926) ***-88-12',
    isPhoneVerified: true,
    dob: '2001-09-15',
    isDobVerified: true,
    is2FAEnabled: true,
    state: 'pending_deletion',
    role: 'user',
    registeredAt: '2026-03-10',
    lastActiveAt: 'Вчера, 19:40',
    sellerStatus: 'pending_verification',
    teams: [
      { id: 'team-3', name: 'Indie Aurora', role: 'Member' }
    ],
    games: [],
    purchasesCount: 8,
    purchasesTotalRub: 2300,
    refundsCount: 0,
    activeRestrictions: [],
    deletionInfo: { deadline: '2026-10-07', daysRemaining: 29 }
  },
  {
    id: 'usr-106',
    username: 'super_admin',
    displayName: 'Platform Lead',
    email: 'root@hubigr.ru',
    isEmailVerified: true,
    phoneMasked: '+7 (999) ***-00-01',
    isPhoneVerified: true,
    dob: '1988-12-01',
    isDobVerified: true,
    is2FAEnabled: true,
    state: 'active',
    role: 'super_admin',
    registeredAt: '2025-01-01',
    lastActiveAt: 'Сейчас в сети',
    sellerStatus: 'none',
    teams: [],
    games: [],
    purchasesCount: 40,
    purchasesTotalRub: 35000,
    refundsCount: 0,
    activeRestrictions: [],
    permissions: ['*']
  }
];

export default function AdminUsersPage() {
  const { showToast } = useToast();
  const [users, setUsers] = useState<AdminUserRecord[]>(MOCK_ADMIN_USERS);
  const [selectedUser, setSelectedUser] = useState<AdminUserRecord | null>(null);

  // Фильтры и поиск
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | UserAccountState>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | StaffRole>('all');
  
  // Текущая роль просматривающего сотрудника (симуляция прав в DevMatrix)
  const [currentStaffRole, setCurrentStaffRole] = useState<'super_admin' | 'admin' | 'moderator'>('super_admin');

  // FE-ACC-010 STAGE 2 & 3: RBAC, Sanctions, Forced Deletion, Audit State
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [isSanctionModalOpen, setIsSanctionModalOpen] = useState(false);
  const [isForcedDeletionModalOpen, setIsForcedDeletionModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  const [auditLogs, setAuditLogs] = useState<Record<string, AuditRecord[]>>({
    'usr-101': [
      {
        id: 'aud-101-1',
        timestamp: '15.01.2026, 14:20',
        action: 'STATUS_CHANGED',
        actor: 'System (Auth Engine)',
        details: 'Успешная регистрация и верификация DOB 12+ (SC-ACC-001).'
      }
    ],
    'usr-102': [
      {
        id: 'aud-102-1',
        timestamp: '04.11.2025, 11:00',
        action: 'PERMISSIONS_UPDATED',
        actor: 'Platform Lead (@super_admin)',
        details: 'Назначены полномочия модератора: community.moderate, reports.resolve (SC-ACC-037).'
      }
    ],
    'usr-103': [
      {
        id: 'aud-103-1',
        timestamp: '05.09.2026, 16:45',
        action: 'SANCTION_APPLIED',
        actor: 'Security Admin (@admin_dev)',
        caseId: 'CASE-1049',
        ruleCode: 'RULE-COMMUNITY-4.2',
        details: 'Применена временная приостановка (Suspension) и ограничение комментариев за спам ссылками в отзывах.'
      }
    ],
    'usr-105': [
      {
        id: 'aud-105-1',
        timestamp: '07.09.2026, 19:40',
        action: 'STATUS_CHANGED',
        actor: 'Elena Rostova (@elena_art)',
        details: 'Пользователь запустил процедуру удаления аккаунта (30 дней grace-period: SC-ACC-043).'
      }
    ]
  });

  const [forbiddenModal, setForbiddenModal] = useState<{
    isOpen: boolean;
    requiredPermission: string;
    attemptedAction: string;
  }>({
    isOpen: false,
    requiredPermission: '',
    attemptedAction: ''
  });

  // SC-ACC-038: Fail-Closed Gate check
  const checkStaffPermission = (requiredPermission: string, attemptedAction: string): boolean => {
    // SuperAdmin has global unrestricted access
    if (currentStaffRole === 'super_admin') return true;

    // Admin has specific operational permissions
    if (currentStaffRole === 'admin') {
      const adminPerms = ['users.view', 'users.manage', 'games.review', 'market.moderate', 'audit.view'];
      if (adminPerms.includes(requiredPermission)) return true;
    }

    // Moderator has limited queue moderation permissions
    if (currentStaffRole === 'moderator') {
      const modPerms = ['community.moderate', 'reports.resolve', 'users.view'];
      if (modPerms.includes(requiredPermission)) return true;
    }

    // Fail-Closed Gate: Trigger rejection modal
    setForbiddenModal({
      isOpen: true,
      requiredPermission,
      attemptedAction
    });
    return false;
  };

  // SC-ACC-037, FR-ACC-071: Open permissions wizard (SuperAdmin only)
  const handleOpenPermissions = () => {
    if (!selectedUser) return;

    if (currentStaffRole !== 'super_admin') {
      setForbiddenModal({
        isOpen: true,
        requiredPermission: 'permissions.manage (SuperAdmin Only)',
        attemptedAction: 'Назначение и отзыв полномочий персонала (FR-ACC-071)'
      });
      return;
    }

    setIsPermissionsModalOpen(true);
  };

  const handleSavePermissions = (userId: string, newPermissions: string[]) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, permissions: newPermissions } : u));
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser(prev => prev ? { ...prev, permissions: newPermissions } : null);
    }
    
    // Add audit record
    const newAudit: AuditRecord = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleString('ru-RU'),
      action: 'PERMISSIONS_UPDATED',
      actor: 'Platform Lead (@super_admin)',
      details: `Обновлены полномочия персонала (${newPermissions.length} разрешений: ${newPermissions.join(', ')}).`
    };
    setAuditLogs(prev => ({
      ...prev,
      [userId]: [newAudit, ...(prev[userId] || [])]
    }));

    showToast(`Полномочия сотрудника обновлены (${newPermissions.length} разрешений)`, 'success');
  };

  const handleViewFinances = () => {
    if (!checkStaffPermission('finance.view', 'Просмотр финансовой аналитики и выплат')) {
      return;
    }
    showToast('Финансовая отчётность загружена (доступ подтверждён)', 'success');
  };

  // SC-ACC-039..041: Применение санкций
  const handleApplySanction = (data: {
    type: SanctionType;
    reason: string;
    ruleCode: string;
    caseId: string;
    durationDays: number | null;
  }) => {
    if (!selectedUser) return;
    if (!checkStaffPermission('users.manage', 'Наложение дисциплинарных мер на пользователя')) return;

    let nextState: UserAccountState = selectedUser.state;
    const nextRestrictions = [...selectedUser.activeRestrictions];

    if (data.type === 'suspended') {
      nextState = 'suspended';
    } else if (data.type === 'banned') {
      nextState = 'banned';
    } else {
      const capability = data.type.replace('scoped_', '');
      const expiry = data.durationDays ? `${data.durationDays} дней` : 'Бессрочно';
      nextRestrictions.push({
        capability,
        reason: `${data.reason} (${data.caseId})`,
        expiresAt: expiry
      });
    }

    const updated = { ...selectedUser, state: nextState, activeRestrictions: nextRestrictions };
    setUsers(prev => prev.map(u => u.id === selectedUser.id ? updated : u));
    setSelectedUser(updated);

    // Add audit record (FR-ACC-055)
    const newAudit: AuditRecord = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleString('ru-RU'),
      action: 'SANCTION_APPLIED',
      actor: currentStaffRole === 'super_admin' ? 'Platform Lead (@super_admin)' : currentStaffRole === 'admin' ? 'Admin (@admin_dev)' : 'Moderator (@alex_proto)',
      caseId: data.caseId,
      ruleCode: data.ruleCode,
      details: `Применена санкция [${data.type}]: ${data.reason}`
    };
    setAuditLogs(prev => ({
      ...prev,
      [selectedUser.id]: [newAudit, ...(prev[selectedUser.id] || [])]
    }));

    showToast(`Санкция успешно применена (Дело #${data.caseId})`, 'warning');
  };

  // SC-ACC-042: Снятие санкций (Unban)
  const handleLiftSanctions = () => {
    if (!selectedUser) return;
    if (!checkStaffPermission('users.manage', 'Снятие ограничений с пользователя (Unban)')) return;

    const updated: AdminUserRecord = {
      ...selectedUser,
      state: selectedUser.state === 'suspended' || selectedUser.state === 'banned' ? 'active' : selectedUser.state,
      activeRestrictions: []
    };
    setUsers(prev => prev.map(u => u.id === selectedUser.id ? updated : u));
    setSelectedUser(updated);

    // Add audit record (BR-ACC-055, FR-ACC-055)
    const newAudit: AuditRecord = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleString('ru-RU'),
      action: 'SANCTION_LIFTED',
      actor: currentStaffRole === 'super_admin' ? 'Platform Lead (@super_admin)' : 'Admin (@admin_dev)',
      details: 'Все ограничения и блокировки сняты. Доступ к цифровым правам и функционалу платформы полностью восстановлен (BR-ACC-055).'
    };
    setAuditLogs(prev => ({
      ...prev,
      [selectedUser.id]: [newAudit, ...(prev[selectedUser.id] || [])]
    }));

    showToast('Ограничения успешно сняты. Доступ пользователя восстановлен.', 'success');
  };

  // SC-ACC-049, FR-ACC-064: SuperAdmin Forced Deletion
  const handleOpenForcedDeletion = () => {
    if (!selectedUser) return;
    if (!checkStaffPermission('users.delete', 'Принудительное удаление аккаунта (SuperAdmin Only)')) {
      return;
    }
    setIsForcedDeletionModalOpen(true);
  };

  const handleConfirmForcedDeletion = (userId: string, reason: string) => {
    const updated: AdminUserRecord = {
      ...selectedUser!,
      state: 'pending_deletion',
      deletionInfo: { deadline: 'через 30 дней', daysRemaining: 30 }
    };
    setUsers(prev => prev.map(u => u.id === userId ? updated : u));
    setSelectedUser(updated);

    // Add audit record (SC-ACC-049, FR-ACC-064)
    const newAudit: AuditRecord = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleString('ru-RU'),
      action: 'FORCED_DELETION',
      actor: 'Platform Lead (@super_admin)',
      details: `Инициировано принудительное удаление аккаунта (SuperAdmin Forced Deletion). Основание: ${reason}`
    };
    setAuditLogs(prev => ({
      ...prev,
      [userId]: [newAudit, ...(prev[userId] || [])]
    }));

    showToast('Принудительное удаление запущено. Аккаунт переведён в статус pending_deletion.', 'danger');
  };

  // SC-ACC-050: Просмотр аудита
  const handleOpenAudit = () => {
    if (!checkStaffPermission('audit.view', 'Просмотр журнала аудита действий персонала')) {
      return;
    }
    setIsAuditModalOpen(true);
  };

  // Фильтрация пользователей
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || user.state === statusFilter;
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, searchQuery, statusFilter, roleFilter]);

  const getStateBadge = (state: UserAccountState) => {
    switch (state) {
      case 'active':
        return <Badge variant="success" size="sm">Активен</Badge>;
      case 'suspended':
        return <Badge variant="warning" size="sm">Приостановлен</Badge>;
      case 'banned':
        return <Badge variant="danger" size="sm">Заблокирован</Badge>;
      case 'pending_deletion':
        return <Badge variant="info" size="sm">Ожидает удаления</Badge>;
    }
  };

  const getRoleBadge = (role: StaffRole) => {
    switch (role) {
      case 'super_admin':
        return <Badge variant="accent" size="sm">SuperAdmin</Badge>;
      case 'admin':
        return <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/30" size="sm">Admin</Badge>;
      case 'moderator':
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/30" size="sm">Moderator</Badge>;
      case 'user':
        return <Badge variant="neutral" size="sm">User</Badge>;
    }
  };

  return (
    <div className="w-full min-h-screen bg-bgDefault pt-16 md:pt-24 pb-24 text-textPrimary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-borderDef">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-h3 font-black text-textPrimary uppercase tracking-tight">
                  Пользователи и Права (FE-ACC-010)
                </h1>
                <p className="text-xs text-textSecondary mt-0.5">
                  Операционный реестр учетных записей, управление ролями персонала и аудит
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-surface-1 p-2 rounded-xl border border-borderDef">
            <span className="text-overline font-mono font-bold text-textTertiary uppercase px-2">Ваша роль:</span>
            <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-accent/20 text-accent border border-accent/40">
              {currentStaffRole === 'super_admin' ? 'Super Admin' : currentStaffRole === 'admin' ? 'Admin' : 'Moderator'}
            </span>
          </div>
        </div>

        {/* ТАБЛИЦА РЕЕСТРА И КАРТОЧКА ДЕТАЛЕЙ (SPLIT VIEW) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ЛЕВАЯ КОЛОНКА: РЕЕСТР ПОЛЬЗОВАТЕЛЕЙ (DIRECTORY) */}
          <div className={`${selectedUser ? 'lg:col-span-7' : 'lg:col-span-12'} transition-all duration-200 space-y-4`}>
            
            {/* ТУЛБАР ПОИСКА И ФИЛЬТРОВ */}
            <div className="bg-surface-1 border border-borderDef rounded-card p-4 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-textTertiary absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск по логину, имени, email или ID..."
                    className="pl-9 w-full text-xs"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-textTertiary hover:text-textPrimary"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="h-10 px-3 bg-surface-2 border border-borderDef rounded-control text-xs font-medium text-textPrimary outline-none focus:border-accent cursor-pointer"
                  >
                    <option value="all">Все статусы</option>
                    <option value="active">Активные</option>
                    <option value="suspended">Приостановленные</option>
                    <option value="banned">Заблокированные</option>
                    <option value="pending_deletion">Ожидают удаления</option>
                  </select>

                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value as any)}
                    className="h-10 px-3 bg-surface-2 border border-borderDef rounded-control text-xs font-medium text-textPrimary outline-none focus:border-accent cursor-pointer"
                  >
                    <option value="all">Все роли</option>
                    <option value="user">Обычные пользователи</option>
                    <option value="moderator">Модераторы</option>
                    <option value="admin">Администраторы</option>
                    <option value="super_admin">SuperAdmin</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between text-overline font-mono text-textTertiary pt-1">
                <span>Найдено записей: <strong className="text-textPrimary">{filteredUsers.length}</strong></span>
                <span>Нажмите на строку для открытия операционной карточки</span>
              </div>
            </div>

            {/* СПИСОК / ТАБЛИЦА ПОЛЬЗОВАТЕЛЕЙ */}
            <div className="bg-surface-1 border border-borderDef rounded-card overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-borderDef bg-surface-2 text-textTertiary font-mono uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4">Пользователь</th>
                      <th className="py-3 px-3">Роль</th>
                      <th className="py-3 px-3">Статус</th>
                      <th className="py-3 px-3">Верификация</th>
                      <th className="py-3 px-3">Связи</th>
                      <th className="py-3 px-3 text-right">Действие</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-borderDef/60">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-textTertiary font-mono">
                          По заданным фильтрам пользователи не найдены
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => {
                        const isSelected = selectedUser?.id === user.id;
                        return (
                          <tr
                            key={user.id}
                            onClick={() => setSelectedUser(user)}
                            className={`cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-accent/10 hover:bg-accent/15'
                                : 'hover:bg-surface-2'
                            }`}
                          >
                            {/* Пользователь */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-surface-3 border border-borderDef flex items-center justify-center font-bold text-xs text-textSecondary shrink-0 uppercase">
                                  {user.username.slice(0, 2)}
                                </div>
                                <div className="min-w-0">
                                  <div className="font-bold text-textPrimary flex items-center gap-1.5 truncate">
                                    <span>{user.displayName}</span>
                                    <span className="text-textTertiary text-overline font-mono">@{user.username}</span>
                                  </div>
                                  <div className="text-textTertiary font-mono text-[10px] truncate">{user.email}</div>
                                </div>
                              </div>
                            </td>

                            {/* Роль */}
                            <td className="py-3.5 px-3">
                              {getRoleBadge(user.role)}
                            </td>

                            {/* Статус */}
                            <td className="py-3.5 px-3">
                              {getStateBadge(user.state)}
                            </td>

                            {/* Индикаторы безопасности */}
                            <td className="py-3.5 px-3">
                              <div className="flex items-center gap-1.5 font-mono text-overline">
                                {user.isEmailVerified && (
                                  <span title="Email подтвержден" className="text-success flex items-center">
                                    <Mail className="w-3.5 h-3.5" />
                                  </span>
                                )}
                                {user.isPhoneVerified && (
                                  <span title="Телефон подтвержден" className="text-success flex items-center">
                                    <Smartphone className="w-3.5 h-3.5" />
                                  </span>
                                )}
                                {user.is2FAEnabled && (
                                  <span title="2FA включена" className="text-accent flex items-center">
                                    <KeyRound className="w-3.5 h-3.5" />
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Связи */}
                            <td className="py-3.5 px-3">
                              <div className="flex items-center gap-2 text-overline text-textSecondary font-mono">
                                {user.teams.length > 0 && (
                                  <span title={`Команд: ${user.teams.length}`} className="flex items-center gap-0.5">
                                    <Users className="w-3.5 h-3.5 text-textTertiary" /> {user.teams.length}
                                  </span>
                                )}
                                {user.games.length > 0 && (
                                  <span title={`Игр автора: ${user.games.length}`} className="flex items-center gap-0.5">
                                    <Gamepad2 className="w-3.5 h-3.5 text-textTertiary" /> {user.games.length}
                                  </span>
                                )}
                                {user.sellerStatus === 'active' && (
                                  <span title="Seller активен" className="text-success flex items-center">
                                    <DollarSign className="w-3.5 h-3.5" />
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Кнопка Просмотр */}
                            <td className="py-3.5 px-3 text-right">
                              <button
                                type="button"
                                className={`px-2.5 py-1 rounded text-xs font-mono font-semibold transition-colors ${
                                  isSelected 
                                    ? 'bg-accent text-white' 
                                    : 'bg-surface-2 text-textSecondary hover:text-textPrimary hover:bg-surface-3'
                                }`}
                              >
                                {isSelected ? 'Выбран' : 'Обзор'}
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* ПРАВАЯ КОЛОНКА: ОПЕРАЦИОННАЯ КАРТОЧКА ПОЛЬЗОВАТЕЛЯ (SECTION 14, SC-ACC-050) */}
          {selectedUser && (
            <div className="lg:col-span-5 bg-surface-1 border border-borderDef rounded-card p-6 shadow-elevation-overlay space-y-6 sticky top-24 animate-fadeIn">
              
              {/* ЗАГОЛОВОК КАРТОЧКИ */}
              <div className="flex items-start justify-between gap-3 pb-4 border-b border-borderDef">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-accent/15 border border-accent/30 text-accent font-bold text-base flex items-center justify-center uppercase shrink-0">
                    {selectedUser.username.slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-textPrimary truncate">{selectedUser.displayName}</h3>
                      {getRoleBadge(selectedUser.role)}
                    </div>
                    <div className="text-xs text-textTertiary font-mono flex items-center gap-2 mt-0.5">
                      <span>@{selectedUser.username}</span>
                      <span>•</span>
                      <span>ID: {selectedUser.id}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="w-8 h-8 rounded-control bg-surface-2 hover:bg-surface-3 text-textTertiary hover:text-textPrimary flex items-center justify-center transition-colors cursor-pointer"
                  title="Закрыть карточку"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 🛡️ PRIVACY GUARD (КРИТИЧЕСКИЙ ИНВАРИАНТ БЕЗОПАСНОСТИ РАЗДЕЛА 14) */}
              <div className="p-3 bg-accent/5 border border-accent/20 rounded-xl text-xs space-y-1">
                <div className="flex items-center gap-2 text-accent font-bold text-overline uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Privacy Guard (Протокол защиты секретов)</span>
                </div>
                <p className="text-overline text-textSecondary leading-relaxed">
                  Хеши паролей, 2FA-секреты, сессионные токены и полные платёжные реквизиты никогда не передаются в DTO оператора.
                </p>
              </div>

              {/* СТАТУС АККАУНТА */}
              <div className="p-3.5 bg-surface-2 rounded-xl border border-borderDef flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono uppercase text-textTertiary font-bold block">Статус учетной записи</span>
                  <div className="text-xs font-semibold text-textPrimary flex items-center gap-2">
                    {getStateBadge(selectedUser.state)}
                    <span className="text-textTertiary text-overline font-mono">
                      {selectedUser.state === 'active' ? 'Полный доступ к платформе' : selectedUser.state === 'pending_deletion' ? `Удаление через ${selectedUser.deletionInfo?.daysRemaining} дн.` : 'Действуют ограничения'}
                    </span>
                  </div>
                </div>

                <div className="text-right text-overline font-mono text-textTertiary">
                  <span>Активность:</span>
                  <div className="text-textSecondary">{selectedUser.lastActiveAt}</div>
                </div>
              </div>

              {/* БЛОК 1: ИДЕНТИФИКАЦИЯ И ВЕРИФИКАЦИЯ */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-textSecondary flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-accent" />
                  Идентификация и Безопасность
                </h4>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {/* Email */}
                  <div className="p-2.5 bg-surface-2 rounded-lg border border-borderDef space-y-1">
                    <span className="text-[10px] font-mono text-textTertiary block">Email адрес</span>
                    <span className="font-mono text-overline text-textPrimary truncate block" title={selectedUser.email}>
                      {selectedUser.email}
                    </span>
                    <span className="text-[10px] font-mono text-success flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Подтвержден
                    </span>
                  </div>

                  {/* Телефон */}
                  <div className="p-2.5 bg-surface-2 rounded-lg border border-borderDef space-y-1">
                    <span className="text-[10px] font-mono text-textTertiary block">Телефон (маскированный)</span>
                    <span className="font-mono text-overline text-textPrimary block">
                      {selectedUser.phoneMasked}
                    </span>
                    {selectedUser.isPhoneVerified ? (
                      <span className="text-[10px] font-mono text-success flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Верифицирован
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-textTertiary">Не привязан</span>
                    )}
                  </div>

                  {/* Возраст / DOB */}
                  <div className="p-2.5 bg-surface-2 rounded-lg border border-borderDef space-y-1">
                    <span className="text-[10px] font-mono text-textTertiary block">Возраст / DOB (12+)</span>
                    <span className="font-mono text-overline text-textPrimary block">
                      {selectedUser.dob}
                    </span>
                    <span className="text-[10px] font-mono text-success flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Возраст 12+ подтвержден
                    </span>
                  </div>

                  {/* 2FA Статус */}
                  <div className="p-2.5 bg-surface-2 rounded-lg border border-borderDef space-y-1">
                    <span className="text-[10px] font-mono text-textTertiary block">Двухфакторная защита</span>
                    <span className={`font-mono text-overline block font-bold ${selectedUser.is2FAEnabled ? 'text-success' : 'text-textTertiary'}`}>
                      {selectedUser.is2FAEnabled ? 'TOTP 2FA активна' : 'Отключена'}
                    </span>
                    {selectedUser.role !== 'user' && !selectedUser.is2FAEnabled && (
                      <span className="text-[10px] font-mono text-danger font-semibold">Обязательно для роли!</span>
                    )}
                  </div>
                </div>
              </div>

              {/* БЛОК 2: СВЯЗАННЫЕ СУЩНОСТИ (КОМАНДЫ И ИГРЫ АВТОРА) */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-textSecondary flex items-center gap-1.5">
                  <Gamepad2 className="w-3.5 h-3.5 text-accent" />
                  Команды и Авторские проекты
                </h4>

                <div className="space-y-2 text-xs">
                  {/* Команды */}
                  <div className="p-3 bg-surface-2 rounded-lg border border-borderDef space-y-1.5">
                    <div className="flex items-center justify-between text-overline font-mono text-textTertiary">
                      <span>Участие в командах:</span>
                      <strong className="text-textPrimary">{selectedUser.teams.length}</strong>
                    </div>
                    {selectedUser.teams.length > 0 ? (
                      <div className="space-y-1 pt-1">
                        {selectedUser.teams.map((t) => (
                          <div key={t.id} className="flex items-center justify-between text-xs bg-surface-1 p-2 rounded border border-borderDef">
                            <span className="font-semibold text-textPrimary truncate">{t.name}</span>
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-surface-3 text-textSecondary">
                              {t.role}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-overline text-textTertiary block italic">Не состоит в командах студий</span>
                    )}
                  </div>

                  {/* Игры автора */}
                  <div className="p-3 bg-surface-2 rounded-lg border border-borderDef space-y-1.5">
                    <div className="flex items-center justify-between text-overline font-mono text-textTertiary">
                      <span>Игры автора:</span>
                      <strong className="text-textPrimary">{selectedUser.games.length}</strong>
                    </div>
                    {selectedUser.games.length > 0 ? (
                      <div className="space-y-1 pt-1">
                        {selectedUser.games.map((g) => (
                          <div key={g.id} className="flex items-center justify-between text-xs bg-surface-1 p-2 rounded border border-borderDef">
                            <span className="font-semibold text-textPrimary truncate">{g.title}</span>
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                              g.status === 'published' ? 'bg-success/10 text-success' : 'bg-surface-3 text-textTertiary'
                            }`}>
                              {g.status === 'published' ? 'Опубликована' : 'Черновик'}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-overline text-textTertiary block italic">Нет опубликованных игр</span>
                    )}
                  </div>
                </div>
              </div>

              {/* БЛОК 3: КОММЕРЦИЯ И СТАТУС ПРОДАВЦА (SELLER READINESS) */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-textSecondary flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-accent" />
                  Коммерция и Покупки
                </h4>

                <div className="grid grid-cols-3 gap-2 text-xs text-center font-mono">
                  <div className="p-2.5 bg-surface-2 rounded-lg border border-borderDef">
                    <span className="text-[10px] text-textTertiary block">Seller</span>
                    <span className={`text-xs font-bold block mt-0.5 ${
                      selectedUser.sellerStatus === 'active' ? 'text-success' : 'text-textTertiary'
                    }`}>
                      {selectedUser.sellerStatus === 'active' ? 'Активен' : selectedUser.sellerStatus === 'pending_verification' ? 'Проверка' : 'Нет'}
                    </span>
                  </div>

                  <div className="p-2.5 bg-surface-2 rounded-lg border border-borderDef">
                    <span className="text-[10px] text-textTertiary block">Покупок</span>
                    <span className="text-xs font-bold text-textPrimary block mt-0.5">
                      {selectedUser.purchasesCount} ({selectedUser.purchasesTotalRub} ₽)
                    </span>
                  </div>

                  <div className="p-2.5 bg-surface-2 rounded-lg border border-borderDef">
                    <span className="text-[10px] text-textTertiary block">Споры/Возвраты</span>
                    <span className={`text-xs font-bold block mt-0.5 ${
                      selectedUser.refundsCount > 0 ? 'text-warning' : 'text-textSecondary'
                    }`}>
                      {selectedUser.refundsCount}
                    </span>
                  </div>
                </div>

                <div className="pt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={handleViewFinances}
                    className="text-overline font-mono text-accent hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Детализация выплат (требует finance.view)</span>
                  </button>
                </div>
              </div>

              {/* БЛОК ПОЛНОМОЧИЙ ПЕРСОНАЛА (RBAC: SC-ACC-037, SC-ACC-038, FR-ACC-071) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-textSecondary flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-accent" />
                    Полномочия персонала (RBAC)
                  </h4>
                  {selectedUser.role !== 'user' && (
                    <span className="text-[10px] font-mono text-accent font-bold">
                      {selectedUser.permissions?.includes('*') ? 'Все права (*)' : `${selectedUser.permissions?.length || 0} разрешений`}
                    </span>
                  )}
                </div>

                <div className="p-3.5 bg-surface-2 rounded-xl border border-borderDef space-y-3 text-xs">
                  {selectedUser.role === 'user' ? (
                    <p className="text-textTertiary text-overline italic">
                      Пользователь не входит в штат сотрудников платформы (обычный User).
                    </p>
                  ) : (
                    <>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedUser.permissions?.includes('*') ? (
                          <span className="px-2 py-0.5 rounded text-overline font-mono font-bold bg-accent/20 text-accent border border-accent/40">
                            Полный административный доступ (*)
                          </span>
                        ) : selectedUser.permissions && selectedUser.permissions.length > 0 ? (
                          selectedUser.permissions.map((p) => (
                            <span key={p} className="px-2 py-0.5 rounded text-[10px] font-mono bg-surface-3 border border-borderDef text-textPrimary">
                              {p}
                            </span>
                          ))
                        ) : (
                          <span className="text-textTertiary text-overline italic">Нет назначенных прав</span>
                        )}
                      </div>

                      {currentStaffRole !== 'super_admin' && (
                        <div className="p-2 bg-danger/10 border border-danger/20 rounded-lg text-overline text-danger flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 shrink-0" />
                          <span>Назначение прав разрешено исключительно SuperAdmin (FR-ACC-071)</span>
                        </div>
                      )}

                      <div className="pt-1 flex justify-end">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleOpenPermissions}
                          className="text-xs font-mono flex items-center gap-1.5"
                        >
                          <Shield className="w-3.5 h-3.5 text-accent" />
                          <span>Настроить права персонала</span>
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* БЛОК 4: АКТИВНЫЕ ОГРАНИЧЕНИЯ И САНКЦИИ (SC-ACC-039..042) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-textSecondary flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-warning" />
                    Санкции и Ограничения
                  </h4>
                  {selectedUser.activeRestrictions.length > 0 && (
                    <span className="text-[10px] font-mono text-warning font-bold">
                      {selectedUser.activeRestrictions.length} ограничений
                    </span>
                  )}
                </div>

                {selectedUser.activeRestrictions.length > 0 ? (
                  <div className="p-3.5 bg-warning/10 border border-warning/30 rounded-xl space-y-2 text-xs">
                    <div className="space-y-1.5">
                      {selectedUser.activeRestrictions.map((r, idx) => (
                        <div key={idx} className="bg-surface-1 p-2.5 rounded-lg border border-warning/20 text-xs">
                          <div className="font-bold text-textPrimary flex items-center justify-between">
                            <span>Область: {r.capability}</span>
                            {r.expiresAt && (
                              <span className="text-[10px] font-mono text-warning">Срок: {r.expiresAt}</span>
                            )}
                          </div>
                          <p className="text-textSecondary text-overline mt-0.5">{r.reason}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleLiftSanctions}
                        className="text-xs font-mono text-success hover:border-success/40"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Снять ограничения (Unban)
                      </Button>

                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => setIsSanctionModalOpen(true)}
                        className="text-xs font-mono"
                      >
                        Добавить санкцию
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-surface-2 rounded-xl border border-borderDef flex items-center justify-between text-xs">
                    <span className="text-textTertiary italic text-overline">
                      Активных санкций нет. Доступ открыт.
                    </span>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsSanctionModalOpen(true)}
                      className="text-xs font-mono text-warning hover:border-warning/40"
                    >
                      Применить санкцию
                    </Button>
                  </div>
                )}
              </div>

              {/* БЫСТРЫЕ ДЕЙСТВИЯ (ФУТЕР КАРТОЧКИ: SC-ACC-049, SC-ACC-050) */}
              <div className="pt-4 border-t border-borderDef space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleOpenAudit}
                    className="text-xs font-mono flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-accent" />
                    <span>Журнал аудита ({auditLogs[selectedUser.id]?.length || 0})</span>
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      if ((window as any).__hubigrNavigate) {
                        (window as any).__hubigrNavigate(`/users/${selectedUser.username}`);
                      }
                    }}
                    className="text-xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5 mr-1" /> Профиль
                  </Button>
                </div>

                {/* SUPERADMIN FORCED DELETION BUTTON (SC-ACC-049) */}
                <div className="pt-2 border-t border-borderDef/60 flex items-center justify-between">
                  <span className="text-textTertiary font-mono text-[10px]">
                    Регистрация: {selectedUser.registeredAt}
                  </span>

                  <button
                    type="button"
                    onClick={handleOpenForcedDeletion}
                    className="text-overline font-mono text-danger hover:text-danger/80 flex items-center gap-1 cursor-pointer font-bold transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Принудительное удаление (Forced)</span>
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* DEV MATRIX CONTROL PANEL ДЛЯ QA ТЕСТИРОВАНИЯ */}
      <DevMatrixPanel
        pageName="Управление пользователями"
        fields={[
          {
            id: 'currentStaffRole',
            label: 'Ваша роль (Staff)',
            type: 'select',
            value: currentStaffRole,
            onChange: (val) => {
              setCurrentStaffRole(val);
              showToast(`Режим персонала: ${val.toUpperCase()}`, 'info');
            },
            options: [
              { value: 'super_admin', label: 'SuperAdmin (Полный доступ)' },
              { value: 'admin', label: 'Admin (Администратор)' },
              { value: 'moderator', label: 'Moderator (Модератор)' }
            ]
          },
          {
            id: 'statusFilter',
            label: 'Фильтр статуса',
            type: 'select',
            value: statusFilter,
            onChange: (val) => setStatusFilter(val),
            options: [
              { value: 'all', label: 'Все статусы' },
              { value: 'active', label: 'Активные' },
              { value: 'suspended', label: 'Приостановленные' },
              { value: 'banned', label: 'Заблокированные' },
              { value: 'pending_deletion', label: 'Ожидают удаления' }
            ]
          },
          {
            id: 'roleFilter',
            label: 'Фильтр роли',
            type: 'select',
            value: roleFilter,
            onChange: (val) => setRoleFilter(val),
            options: [
              { value: 'all', label: 'Все роли' },
              { value: 'user', label: 'Пользователь' },
              { value: 'moderator', label: 'Модератор' },
              { value: 'admin', label: 'Администратор' },
              { value: 'super_admin', label: 'SuperAdmin' }
            ]
          }
        ]}
      />

      {/* MODAL: STAFF PERMISSIONS (RBAC: SC-ACC-037, FR-ACC-071) */}
      {selectedUser && (
        <StaffPermissionsModal
          isOpen={isPermissionsModalOpen}
          onClose={() => setIsPermissionsModalOpen(false)}
          targetUser={{
            id: selectedUser.id,
            username: selectedUser.username,
            displayName: selectedUser.displayName,
            role: selectedUser.role as any,
            permissions: selectedUser.permissions || []
          }}
          currentStaffRole={currentStaffRole}
          onSavePermissions={handleSavePermissions}
        />
      )}

      {/* MODAL: FAIL-CLOSED ACCESS DENIAL (SC-ACC-038) */}
      <FailClosedForbiddenModal
        isOpen={forbiddenModal.isOpen}
        onClose={() => setForbiddenModal(prev => ({ ...prev, isOpen: false }))}
        requiredPermission={forbiddenModal.requiredPermission}
        attemptedAction={forbiddenModal.attemptedAction}
        currentStaffRole={currentStaffRole}
      />

      {/* MODAL: USER SANCTIONS (SC-ACC-039..042) */}
      {selectedUser && (
        <UserSanctionModal
          isOpen={isSanctionModalOpen}
          onClose={() => setIsSanctionModalOpen(false)}
          targetUser={{
            id: selectedUser.id,
            username: selectedUser.username,
            displayName: selectedUser.displayName
          }}
          onApplySanction={handleApplySanction}
        />
      )}

      {/* MODAL: FORCED ACCOUNT DELETION (SC-ACC-049, FR-ACC-064) */}
      {selectedUser && (
        <ForcedDeletionModal
          isOpen={isForcedDeletionModalOpen}
          onClose={() => setIsForcedDeletionModalOpen(false)}
          targetUser={{
            id: selectedUser.id,
            username: selectedUser.username,
            displayName: selectedUser.displayName,
            email: selectedUser.email,
            hasPublishedGames: selectedUser.games.some(g => g.status === 'published'),
            isSoleTeamOwner: selectedUser.teams.some(t => t.role === 'Owner'),
            hasPendingFinances: selectedUser.sellerStatus === 'active' && selectedUser.purchasesTotalRub > 3000
          }}
          onConfirmForcedDeletion={handleConfirmForcedDeletion}
        />
      )}

      {/* MODAL: IMMUTABLE AUDIT LOG (SC-ACC-050, FR-ACC-055) */}
      {selectedUser && (
        <UserAuditHistoryModal
          isOpen={isAuditModalOpen}
          onClose={() => setIsAuditModalOpen(false)}
          targetUser={{
            username: selectedUser.username,
            displayName: selectedUser.displayName
          }}
          auditHistory={auditLogs[selectedUser.id] || []}
        />
      )}

    </div>
  );
}
