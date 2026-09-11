import React, { useState } from 'react';
import { 
  Users, Plus, Mail, Check, X, ExternalLink, Settings, Trash2, 
  UserPlus, Lock, Crown, Shield, LogOut, Gamepad2, FolderKanban, 
  AlertCircle, History, Clock, Send, RefreshCw, AlertTriangle, 
  CheckCircle2, XCircle, ArrowRight, UserCheck, ShieldAlert, Trophy
} from 'lucide-react';
import { 
  Team, TeamMember, TeamRole, TeamPermissions, TeamPermissionKey, 
  TeamType, TeamInvitation, TeamOwnershipTransfer, TeamAuditRecord, 
  DEFAULT_MEMBER_PERMISSIONS, OWNER_PERMISSIONS 
} from '../../../types/team';
import { CreateTeamModal } from '../modals/CreateTeamModal';
import { InviteMemberModal } from '../modals/InviteMemberModal';
import { LeaveTeamModal } from '../modals/LeaveTeamModal';
import { EditTeamModal } from '../modals/EditTeamModal';
import { DeleteTeamModal } from '../modals/DeleteTeamModal';
import { TransferOwnershipModal } from '../modals/TransferOwnershipModal';

// --- INITIAL MOCK DATA (per team.md specifications) ---
const INITIAL_TEAMS: Team[] = [
  {
    id: 'team_nocturnal',
    name: 'NocturnalDevs Studio',
    slug: 'nocturnal-devs',
    type: 'studio',
    logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=nocturnal',
    userRole: 'owner',
    gamesCount: 3,
    membersCount: 4,
    description: 'Инди-студия разработки атмосферных киберпанк и хоррор проектов.',
    contacts: {
      telegram: '@nocturnal_devs',
      vk: 'https://vk.com/nocturnal',
      email: 'team@nocturnal.games',
      website: 'https://nocturnal.games'
    },
    supportLinks: [
      { id: 's1', platform: 'Boosty', url: 'https://boosty.to/nocturnal', verified: true, desc: 'Поддержка разработки' }
    ],
    settings: {
      hideMembers: false,
      hideJamAchievements: false
    },
    activeJamsCount: 0,
    hasActiveSettlements: false,
    pendingTransfer: null,
    createdAt: '15 января 2025',
    members: [
      { 
        id: 'usr_1', 
        nick: '@alex_nocturnal', 
        name: 'Александр (Вы)', 
        avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=NocturnalDevs', 
        role: 'owner', 
        permissions: { ...OWNER_PERMISSIONS },
        joinedAt: '15.01.2025'
      },
      { 
        id: 'usr_2', 
        nick: '@dmitry_tech', 
        name: 'Дмитрий (Lead Dev)', 
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=dmitry', 
        role: 'admin', 
        permissions: { ...DEFAULT_MEMBER_PERMISSIONS, game_manage: true, devlog_manage: true, bugs_manage: true, stats_view: true },
        joinedAt: '20.01.2025'
      },
      { 
        id: 'usr_3', 
        nick: '@elena_art', 
        name: 'Елена (3D Artist)', 
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=elena', 
        role: 'member', 
        permissions: { ...DEFAULT_MEMBER_PERMISSIONS, game_manage: true, devlog_manage: true },
        joinedAt: '02.02.2025'
      },
      { 
        id: 'usr_4', 
        nick: '@sergey_sound', 
        name: 'Сергей (Audio)', 
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=sergey', 
        role: 'member', 
        permissions: { ...DEFAULT_MEMBER_PERMISSIONS, game_manage: false, devlog_manage: true, bugs_manage: false },
        joinedAt: '10.02.2025'
      }
    ]
  },
  {
    id: 'team_pixel',
    name: 'Pixel Pioneers',
    slug: 'pixel-pioneers',
    type: 'indie_team',
    logo: 'https://api.dicebear.com/7.x/bottts/svg?seed=pixel',
    userRole: 'member',
    gamesCount: 1,
    membersCount: 2,
    description: 'Команда пиксельных энтузиастов и ретро-платформеров.',
    contacts: {
      telegram: '@pixel_pioneers'
    },
    settings: {
      hideMembers: false,
      hideJamAchievements: false
    },
    activeJamsCount: 1,
    hasActiveSettlements: false,
    pendingTransfer: null,
    createdAt: '10 марта 2025',
    members: [
      { 
        id: 'usr_10', 
        nick: '@captain_pixel', 
        name: 'Максим (Капитан)', 
        avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=captain', 
        role: 'owner', 
        permissions: { ...OWNER_PERMISSIONS },
        joinedAt: '10.03.2025'
      },
      { 
        id: 'usr_1', 
        nick: '@alex_nocturnal', 
        name: 'Вы (@alex_nocturnal)', 
        avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=NocturnalDevs', 
        role: 'member', 
        permissions: { ...DEFAULT_MEMBER_PERMISSIONS },
        joinedAt: '15.03.2025'
      }
    ]
  }
];

const INITIAL_INCOMING_INVITES = [
  {
    id: 'inv_101',
    teamId: 'team_cybercrafters',
    teamName: 'Cyber Crafters Studio',
    teamSlug: 'cyber-crafters',
    teamLogo: 'https://api.dicebear.com/7.x/identicon/svg?seed=cybercrafters',
    inviterNick: '@vlad_lead',
    inviterName: 'Владислав (Lead)',
    targetRole: 'member' as const,
    permissions: { ...DEFAULT_MEMBER_PERMISSIONS },
    date: '2 часа назад'
  }
];

const INITIAL_OUTGOING_INVITES: TeamInvitation[] = [
  {
    id: 'out_inv_1',
    teamId: 'team_nocturnal',
    teamName: 'NocturnalDevs Studio',
    teamSlug: 'nocturnal-devs',
    inviterNick: '@alex_nocturnal',
    targetUserQuery: '@artem_animator',
    targetRole: 'member',
    permissions: { ...DEFAULT_MEMBER_PERMISSIONS },
    status: 'pending',
    createdAt: 'Сегодня, 10:30',
    expiresAt: 'через 7 дней'
  }
];

const INITIAL_AUDIT_LOGS: Record<string, TeamAuditRecord[]> = {
  team_nocturnal: [
    { id: 'aud_1', timestamp: 'Сегодня, 10:30', action: 'Отправлено приглашение', actorNick: '@alex_nocturnal', details: 'Приглашен пользователь @artem_animator с ролью Участник' },
    { id: 'aud_2', timestamp: '10.02.2025, 14:15', action: 'Новый участник', actorNick: '@sergey_sound', details: 'Принял приглашение в команду' },
    { id: 'aud_3', timestamp: '02.02.2025, 11:00', action: 'Обновление профиля', actorNick: '@alex_nocturnal', details: 'Изменено описание и контакты студии' },
    { id: 'aud_4', timestamp: '15.01.2025, 09:00', action: 'Создание команды', actorNick: '@alex_nocturnal', details: 'Создана команда NocturnalDevs Studio (slug: nocturnal-devs)' }
  ],
  team_pixel: [
    { id: 'aud_10', timestamp: '15.03.2025, 18:20', action: 'Новый участник', actorNick: '@alex_nocturnal', details: 'Принял приглашение капитана' },
    { id: 'aud_11', timestamp: '10.03.2025, 12:00', action: 'Создание команды', actorNick: '@captain_pixel', details: 'Создана команда Pixel Pioneers' }
  ]
};

const PERMISSIONS_META: Array<{ key: TeamPermissionKey; title: string; desc: string }> = [
  { key: 'game_manage', title: 'game.manage', desc: 'Создание, редактирование и публикация игр студии' },
  { key: 'devlog_manage', title: 'devlog.manage', desc: 'Публикация новостей и devlog-статей от лица команды' },
  { key: 'reviews_manage', title: 'reviews.manage', desc: 'Официальные ответы разработчиков на отзывы игроков' },
  { key: 'feedback_manage', title: 'feedback.manage', desc: 'Обработка структурированного фидбека (NeedFeedback)' },
  { key: 'bugs_manage', title: 'bugs.manage', desc: 'Триаж и смена статусов баг-репортов игроков' },
  { key: 'stats_view', title: 'stats.view', desc: 'Просмотр метрик аудитории, графиков посещений и скачиваний' },
  { key: 'finance_view', title: 'finance.view', desc: 'Просмотр финансовых отчетов, баланса и статистики продаж' },
  { key: 'team_manage_support', title: 'team.manage_support', desc: 'Управление донат-ссылками и публичной поддержкой студии' }
];

const TEAM_TYPE_LABELS: Record<TeamType, string> = {
  indie_team: 'Инди-команда',
  studio: 'Студия',
  collective: 'Объединение',
  company_organization: 'Компания',
  other: 'Другое'
};

export interface CreatorTeamsTabProps {
  scopeInfo: any;
  onChangeScope: (scope: string, toastMsg?: string) => void;
  triggerToast: (msg: string, type?: string) => void;
}

export const CreatorTeamsTab: React.FC<CreatorTeamsTabProps> = ({ onChangeScope, triggerToast }) => {
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [incomingInvites, setIncomingInvites] = useState(INITIAL_INCOMING_INVITES);
  const [outgoingInvites, setOutgoingInvites] = useState<TeamInvitation[]>(INITIAL_OUTGOING_INVITES);
  const [auditLogs, setAuditLogs] = useState<Record<string, TeamAuditRecord[]>>(INITIAL_AUDIT_LOGS);

  const [selectedTeamId, setSelectedTeamId] = useState<string>(INITIAL_TEAMS[0].id);
  const [selectedMemberId, setSelectedMemberId] = useState<string>(INITIAL_TEAMS[0].members[0].id);
  const [activeSubTab, setActiveSubTab] = useState<'members' | 'invitations' | 'audit'>('members');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [transferTargetMember, setTransferTargetMember] = useState<TeamMember | null>(null);

  const selectedTeam = teams.find(t => t.id === selectedTeamId) || teams[0];
  const selectedMember = selectedTeam?.members.find(m => m.id === selectedMemberId) || selectedTeam?.members[0];

  const isCurrentMemberOwnerOrAdmin = selectedTeam?.userRole === 'owner' || selectedTeam?.userRole === 'admin';
  const isCurrentMemberOwner = selectedTeam?.userRole === 'owner';

  // Helper to append to immutable audit log (FE-TEAM-013, AC-TEAM-059)
  const appendAudit = (teamId: string, action: string, details: string) => {
    const newRecord: TeamAuditRecord = {
      id: `aud_${Date.now()}`,
      timestamp: 'Только что',
      action,
      actorNick: '@alex_nocturnal',
      details
    };
    setAuditLogs(prev => ({
      ...prev,
      [teamId]: [newRecord, ...(prev[teamId] || [])]
    }));
  };

  // --- HANDLERS ---

  // FE-TEAM-003: Create Team (AC-TEAM-001, AC-TEAM-002)
  const handleCreateTeam = (data: { 
    name: string; 
    slug: string; 
    type: TeamType; 
    customType?: string; 
    description: string;
    logo?: string;
  }) => {
    // Check slug collision
    if (teams.some(t => t.slug.toLowerCase() === data.slug.toLowerCase())) {
      triggerToast('Команда с таким URL slug уже существует! (AC-TEAM-002)', 'error');
      return;
    }

    const newTeamId = `team_${Date.now()}`;
    const newTeam: Team = {
      id: newTeamId,
      name: data.name,
      slug: data.slug,
      type: data.type,
      customType: data.customType,
      logo: data.logo || `https://api.dicebear.com/7.x/identicon/svg?seed=${data.name}`,
      userRole: 'owner',
      gamesCount: 0,
      membersCount: 1,
      description: data.description || 'Новая команда разработчиков.',
      settings: { hideMembers: false, hideJamAchievements: false },
      createdAt: 'Сегодня',
      activeJamsCount: 0,
      hasActiveSettlements: false,
      pendingTransfer: null,
      members: [
        {
          id: 'usr_1',
          nick: '@alex_nocturnal',
          name: 'Александр (Вы)',
          avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=NocturnalDevs',
          role: 'owner',
          permissions: { ...OWNER_PERMISSIONS },
          joinedAt: 'Сегодня'
        }
      ]
    };

    setTeams(prev => [...prev, newTeam]);
    setSelectedTeamId(newTeam.id);
    setSelectedMemberId('usr_1');
    appendAudit(newTeamId, 'Создание команды', `Создана новая команда «${data.name}» (тип: ${data.type})`);
    triggerToast(`Команда «${data.name}» успешно создана!`, 'success');
  };

  // FE-TEAM-003: Edit Team (AC-TEAM-003...006)
  const handleEditTeam = (data: { 
    name: string; 
    slug: string; 
    type?: TeamType;
    customType?: string;
    description: string;
    logo?: string;
    contacts?: any;
    supportLinks?: any;
    settings?: any;
  }) => {
    setTeams(prev => prev.map(t => {
      if (t.id !== selectedTeamId) return t;
      return { 
        ...t, 
        name: data.name,
        slug: data.slug,
        type: data.type || t.type,
        customType: data.customType,
        description: data.description,
        logo: data.logo || t.logo,
        contacts: data.contacts || t.contacts,
        supportLinks: data.supportLinks || t.supportLinks,
        settings: data.settings || t.settings
      };
    }));
    appendAudit(selectedTeamId, 'Обновление профиля', 'Обновлены основные настройки и контакты команды');
    triggerToast('Настройки команды успешно сохранены', 'success');
  };

  // FE-TEAM-012: Delete Team (AC-TEAM-054...058)
  const handleDeleteTeam = (teamId: string) => {
    setTeams(prev => prev.filter(t => t.id !== teamId));
    onChangeScope('personal', 'Команда удалена. Контекст переключен на Личный аккаунт');
    triggerToast('Команда навсегда удалена (AC-TEAM-057)', 'info');
  };

  // FE-TEAM-005: Incoming Invites - Accept (AC-TEAM-012)
  const handleAcceptInvite = (invite: any) => {
    const newTeam: Team = {
      id: invite.teamId,
      name: invite.teamName,
      slug: invite.teamSlug || invite.teamName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      type: 'indie_team',
      logo: invite.teamLogo,
      userRole: 'member',
      gamesCount: 0,
      membersCount: 2,
      description: 'Команда разработчиков.',
      settings: { hideMembers: false, hideJamAchievements: false },
      createdAt: 'Сегодня',
      members: [
        { 
          id: 'usr_lead', 
          nick: invite.inviterNick, 
          name: invite.inviterName || 'Капитан команды', 
          avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=lead', 
          role: 'owner', 
          permissions: { ...OWNER_PERMISSIONS } 
        },
        { 
          id: 'usr_1', 
          nick: '@alex_nocturnal', 
          name: 'Вы (@alex_nocturnal)', 
          avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=NocturnalDevs', 
          role: 'member', 
          permissions: invite.permissions || { ...DEFAULT_MEMBER_PERMISSIONS } 
        }
      ]
    };
    setTeams(prev => [...prev, newTeam]);
    setIncomingInvites(prev => prev.filter(i => i.id !== invite.id));
    appendAudit(newTeam.id, 'Вступление в команду', 'Пользователь @alex_nocturnal принял приглашение');
    triggerToast(`Приглашение в «${invite.teamName}» принято!`, 'success');
  };

  // FE-TEAM-005: Incoming Invites - Reject (AC-TEAM-013)
  const handleRejectInvite = (inviteId: string) => {
    setIncomingInvites(prev => prev.filter(i => i.id !== inviteId));
    triggerToast('Приглашение отклонено', 'info');
  };

  // FE-TEAM-005: Outgoing Invites - Send (AC-TEAM-010, AC-TEAM-011)
  const handleSendInvite = (data: { userQuery: string; role: string; permissions: Record<string, boolean> }) => {
    const query = data.userQuery.trim();

    // Check duplicate active member (AC-TEAM-011)
    if (selectedTeam.members.some(m => m.nick.toLowerCase() === query.toLowerCase())) {
      triggerToast(`Пользователь ${query} уже является участником команды! (AC-TEAM-011)`, 'error');
      return;
    }

    // Check duplicate pending invite (AC-TEAM-010)
    const existingPending = outgoingInvites.find(
      inv => inv.teamId === selectedTeamId && inv.targetUserQuery.toLowerCase() === query.toLowerCase() && inv.status === 'pending'
    );
    if (existingPending) {
      triggerToast(`Пользователю ${query} уже отправлено ожидающее приглашение! (AC-TEAM-010)`, 'error');
      return;
    }

    const newInvite: TeamInvitation = {
      id: `inv_${Date.now()}`,
      teamId: selectedTeam.id,
      teamName: selectedTeam.name,
      teamSlug: selectedTeam.slug,
      inviterNick: '@alex_nocturnal',
      targetUserQuery: query,
      targetRole: (data.role as 'admin' | 'member') || 'member',
      permissions: data.permissions as TeamPermissions,
      status: 'pending',
      createdAt: 'Только что',
      expiresAt: 'через 7 дней'
    };

    setOutgoingInvites(prev => [newInvite, ...prev]);
    appendAudit(selectedTeamId, 'Отправлено приглашение', `Приглашен ${query} с ролью ${data.role}`);
    triggerToast(`Приглашение отправлено пользователю ${query}`, 'success');
  };

  // FE-TEAM-005: Outgoing Invites - Cancel (AC-TEAM-014)
  const handleCancelInvite = (inviteId: string) => {
    setOutgoingInvites(prev => prev.map(inv => {
      if (inv.id !== inviteId) return inv;
      return { ...inv, status: 'cancelled' };
    }));
    appendAudit(selectedTeamId, 'Отзыв приглашения', `Приглашение ${inviteId} отозвано`);
    triggerToast('Приглашение успешно отменено (AC-TEAM-014)', 'info');
  };

  // FE-TEAM-005: Outgoing Invites - Resend (AC-TEAM-015)
  const handleResendInvite = (inviteId: string) => {
    setOutgoingInvites(prev => prev.map(inv => {
      if (inv.id !== inviteId) return inv;
      return { ...inv, createdAt: 'Только что', status: 'pending' };
    }));
    appendAudit(selectedTeamId, 'Повторная отправка', `Приглашение ${inviteId} отправлено повторно`);
    triggerToast('Приглашение отправлено повторно (AC-TEAM-015)', 'success');
  };

  // FE-TEAM-006: Roles - Promote/Demote (AC-TEAM-016, AC-TEAM-018)
  const handleChangeMemberRole = (memberId: string, newRole: TeamRole) => {
    if (!isCurrentMemberOwnerOrAdmin) {
      triggerToast('Недостаточно прав для смены роли', 'error');
      return;
    }

    const target = selectedTeam.members.find(m => m.id === memberId);
    if (!target) return;

    // Prevent demoting Owner or changing owner's role without transfer
    if (target.role === 'owner') {
      triggerToast('Роль владельца не может быть изменена напрямую (AC-TEAM-021)', 'error');
      return;
    }

    setTeams(prev => prev.map(t => {
      if (t.id !== selectedTeamId) return t;
      return {
        ...t,
        members: t.members.map(m => {
          if (m.id !== memberId) return m;
          return { ...m, role: newRole };
        })
      };
    }));

    appendAudit(selectedTeamId, 'Изменение роли', `Роль ${target.nick} изменена на ${newRole}`);
    triggerToast(`Роль участника ${target.nick} изменена на ${newRole}`, 'success');
  };

  // FE-TEAM-006: Permissions - Toggle individual capability (AC-TEAM-017)
  const handleTogglePermission = (permKey: TeamPermissionKey) => {
    if (!isCurrentMemberOwnerOrAdmin) {
      triggerToast('У вас нет прав для изменения разрешений!', 'error');
      return;
    }

    if (selectedMember?.role === 'owner') {
      triggerToast('Владелец всегда обладает всеми правами команды', 'info');
      return;
    }

    setTeams(prev => prev.map(t => {
      if (t.id !== selectedTeamId) return t;
      return {
        ...t,
        members: t.members.map(m => {
          if (m.id !== selectedMemberId) return m;
          return {
            ...m,
            permissions: {
              ...m.permissions,
              [permKey]: !m.permissions[permKey]
            }
          };
        })
      };
    }));

    appendAudit(selectedTeamId, 'Изменение прав', `Обновлено разрешение ${permKey} для ${selectedMember?.nick}`);
    triggerToast('Разрешения участника обновлены (AC-TEAM-017)', 'success');
  };

  // FE-TEAM-006: Member Remove / Kick (AC-TEAM-019)
  const handleRemoveMember = (memberId: string) => {
    if (!isCurrentMemberOwnerOrAdmin) return;
    const target = selectedTeam.members.find(m => m.id === memberId);
    if (!target) return;

    if (target.role === 'owner') {
      triggerToast('Невозможно исключить владельца команды! (AC-TEAM-021)', 'error');
      return;
    }

    setTeams(prev => prev.map(t => {
      if (t.id !== selectedTeamId) return t;
      return { 
        ...t, 
        members: t.members.filter(m => m.id !== memberId), 
        membersCount: Math.max(1, t.membersCount - 1)
      };
    }));
    setSelectedMemberId(selectedTeam.members[0].id);
    appendAudit(selectedTeamId, 'Исключение участника', `Участник ${target.nick} исключен из команды`);
    triggerToast(`Участник ${target.nick} исключен из команды (AC-TEAM-019)`, 'info');
  };

  // FE-TEAM-006: Voluntary Leave Team (AC-TEAM-020, AC-TEAM-021)
  const handleLeaveTeamConfirm = () => {
    if (selectedTeam.userRole === 'owner') {
      triggerToast('Владелец не может покинуть команду без передачи прав (AC-TEAM-021)', 'error');
      return;
    }

    setTeams(prev => prev.filter(t => t.id !== selectedTeamId));
    onChangeScope('personal', 'Вы вышли из команды. Контекст переключен на Личный аккаунт');
    triggerToast(`Вы вышли из команды «${selectedTeam.name}» (AC-TEAM-020)`, 'info');
  };

  // FE-TEAM-007: Ownership Transfer - Initiate (AC-TEAM-022, AC-TEAM-026)
  const handleInitiateTransfer = (targetMemberId: string, postTransferRole: 'admin' | 'member') => {
    if (selectedTeam.userRole !== 'owner') return;

    if (selectedTeam.pendingTransfer) {
      triggerToast('Уже существует активный процесс передачи прав! (AC-TEAM-026)', 'error');
      return;
    }

    const target = selectedTeam.members.find(m => m.id === targetMemberId);
    if (!target) return;

    const transfer: TeamOwnershipTransfer = {
      id: `trans_${Date.now()}`,
      teamId: selectedTeam.id,
      teamName: selectedTeam.name,
      currentOwnerId: 'usr_1',
      currentOwnerNick: '@alex_nocturnal',
      targetMemberId: target.id,
      targetMemberNick: target.nick,
      targetMemberName: target.name,
      status: 'pending',
      createdAt: 'Только что'
    };

    setTeams(prev => prev.map(t => {
      if (t.id !== selectedTeamId) return t;
      return { ...t, pendingTransfer: transfer };
    }));

    appendAudit(selectedTeamId, 'Инициация передачи прав', `Предложена передача владения пользователю ${target.nick}`);
    triggerToast(`Предложение стать владельцем отправлено участнику ${target.nick}`, 'success');
  };

  // FE-TEAM-007: Ownership Transfer - Cancel by Owner (AC-TEAM-025)
  const handleCancelOwnershipTransfer = () => {
    setTeams(prev => prev.map(t => {
      if (t.id !== selectedTeamId) return t;
      return { ...t, pendingTransfer: null };
    }));
    appendAudit(selectedTeamId, 'Отмена передачи прав', 'Владелец отменил процесс передачи прав владения');
    triggerToast('Передача прав владения отменена (AC-TEAM-025)', 'info');
  };

  // FE-TEAM-007: Ownership Transfer - Accept (AC-TEAM-023)
  const handleAcceptOwnershipTransfer = () => {
    if (!selectedTeam.pendingTransfer) return;

    setTeams(prev => prev.map(t => {
      if (t.id !== selectedTeamId) return t;
      return {
        ...t,
        userRole: 'owner',
        pendingTransfer: null,
        members: t.members.map(m => {
          if (m.id === 'usr_1') return { ...m, role: 'owner', permissions: { ...OWNER_PERMISSIONS } };
          if (m.role === 'owner') return { ...m, role: 'admin' };
          return m;
        })
      };
    }));

    appendAudit(selectedTeamId, 'Передача прав завершена', 'Передача прав успешно принята новым владельцем');
    triggerToast(`Вы стали владельцем команды «${selectedTeam.name}»! (AC-TEAM-023)`, 'success');
  };

  // FE-TEAM-007: Ownership Transfer - Reject (AC-TEAM-024)
  const handleRejectOwnershipTransfer = () => {
    setTeams(prev => prev.map(t => {
      if (t.id !== selectedTeamId) return t;
      return { ...t, pendingTransfer: null };
    }));
    appendAudit(selectedTeamId, 'Отклонение передачи прав', 'Предложение о передаче прав отклонено');
    triggerToast('Предложение о передаче прав отклонено (AC-TEAM-024)', 'info');
  };

  const teamOutgoingInvites = outgoingInvites.filter(inv => inv.teamId === selectedTeamId);
  const teamAudit = auditLogs[selectedTeamId] || [];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. HEADER & ACTIONS */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-textPrimary">Мои команды</h3>
          <p className="text-xs text-textSecondary mt-0.5">
            Управление участниками, ролями и доступами (M7 RoadMap: team.md)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="h-9 px-4 bg-textPrimary hover:bg-textSecondary text-surface-0 font-bold text-sm rounded-control flex items-center justify-center gap-2 transition-colors shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Создать команду</span>
          </button>
        </div>
      </div>

      {/* 2. INCOMING INVITATIONS BANNER (AC-TEAM-012, AC-TEAM-013) */}
      {incomingInvites.length > 0 && (
        <div className="bg-surface-1 border border-borderDef rounded-card overflow-hidden shadow-sm">
          <div className="bg-reaction/10 border-b border-reaction/20 p-3 flex items-center gap-2 text-reaction text-[11px] font-bold uppercase tracking-wider font-mono">
            <Mail className="w-4 h-4" /> Входящие приглашения ({incomingInvites.length})
          </div>
          <div className="divide-y divide-borderDef">
            {incomingInvites.map(inv => (
              <div key={inv.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface-1 hover:bg-surface-2/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full border border-borderDef overflow-hidden shrink-0 shadow-sm">
                    <img src={inv.teamLogo} alt="Team Logo" className="w-full h-full object-cover bg-surface-0" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-textPrimary flex items-center gap-2">
                      Вас пригласили в «{inv.teamName}»
                    </h4>
                    <p className="text-[11px] text-textSecondary font-mono mt-1">
                      Отправил: <span className="text-textPrimary">{inv.inviterNick}</span> • Роль: <span className="text-reaction font-bold">{inv.targetRole}</span> • {inv.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    onClick={() => handleRejectInvite(inv.id)}
                    className="h-8 px-3 bg-surface-2 hover:bg-surface-3 border border-borderDef text-textPrimary text-[11px] font-bold uppercase tracking-wider rounded-control flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" /> Отклонить
                  </button>
                  <button
                    onClick={() => handleAcceptInvite(inv)}
                    className="h-8 px-4 bg-success hover:bg-success/90 text-white text-[11px] font-bold uppercase tracking-wider rounded-control flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" /> Принять
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. PENDING OWNERSHIP TRANSFER NOTIFICATION BANNER (AC-TEAM-023, AC-TEAM-024, AC-TEAM-025) */}
      {selectedTeam?.pendingTransfer && (
        <div className="p-4 bg-accent/10 border border-accent/30 rounded-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-start gap-3">
            <Crown className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-textPrimary">
                {selectedTeam.pendingTransfer.targetMemberId === 'usr_1' 
                  ? `Вам предложено стать владельцем команды «${selectedTeam.name}»`
                  : `Инициирована передача владения участнику ${selectedTeam.pendingTransfer.targetMemberNick}`}
              </h4>
              <p className="text-[11px] text-textSecondary mt-0.5">
                {selectedTeam.pendingTransfer.targetMemberId === 'usr_1'
                  ? `Текущий владелец ${selectedTeam.pendingTransfer.currentOwnerNick} передает вам полный контроль над студией.`
                  : 'Ожидается подтверждение (Accept) со стороны участника. Вы можете отозвать запрос до принятия.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            {selectedTeam.pendingTransfer.targetMemberId === 'usr_1' ? (
              <>
                <button
                  onClick={handleRejectOwnershipTransfer}
                  className="h-8 px-3 bg-surface-2 hover:bg-surface-3 border border-borderDef text-textSecondary hover:text-textPrimary text-xs font-semibold rounded-control transition-colors cursor-pointer"
                >
                  Отклонить
                </button>
                <button
                  onClick={handleAcceptOwnershipTransfer}
                  className="h-8 px-3.5 bg-accent hover:bg-accent-hover text-white text-xs font-bold rounded-control transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" /> Принять владение
                </button>
              </>
            ) : (
              <button
                onClick={handleCancelOwnershipTransfer}
                className="h-8 px-3 bg-surface-2 hover:bg-danger/10 border border-borderDef hover:border-danger/30 text-textSecondary hover:text-danger text-xs font-semibold rounded-control transition-colors cursor-pointer"
              >
                Отменить передачу
              </button>
            )}
          </div>
        </div>
      )}

      {/* 4. TEAMS GRID (FE-TEAM-004) */}
      {teams.length === 0 ? (
        <div className="bg-surface-1 border border-borderDef rounded-card p-12 text-center flex flex-col items-center gap-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center text-textSecondary">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-textPrimary">Вы не состоите ни в одной команде</h3>
          <p className="text-sm text-textSecondary max-w-md">
            Создайте свою собственную студию или дождитесь приглашения от других авторов, чтобы работать вместе над играми.
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-2 px-5 py-2.5 bg-textPrimary hover:bg-textSecondary text-surface-0 font-bold text-sm rounded-control flex items-center gap-2 transition-colors cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" /> Создать команду
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map(team => {
            const isSelected = team.id === selectedTeamId;
            return (
              <div 
                key={team.id}
                onClick={() => { 
                  setSelectedTeamId(team.id); 
                  setSelectedMemberId(team.members[0].id); 
                }}
                className={`p-5 rounded-card border transition-all cursor-pointer flex flex-col relative group ${
                  isSelected 
                    ? 'bg-surface-1 border-accent shadow-md' 
                    : 'bg-surface-2/30 border-borderDef hover:bg-surface-1 hover:shadow-sm'
                }`}
              >
                {isSelected && <div className="absolute top-0 left-0 w-full h-1 bg-accent rounded-t-card" />}

                <div className="flex items-start justify-between gap-3 mb-3 mt-1">
                  <div className="flex items-center gap-3">
                    <img src={team.logo} alt="Logo" className="w-10 h-10 rounded-full border border-borderDef bg-surface-0 object-cover shadow-sm shrink-0" />
                    <div className="flex flex-col">
                      <h4 className="text-sm font-bold text-textPrimary leading-tight">
                        {team.name}
                      </h4>
                      <span className="text-[11px] font-mono text-textSecondary mt-0.5">@{team.slug}</span>
                    </div>
                  </div>

                  {/* Role Badge */}
                  <span className={`px-2 py-0.5 rounded-control text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 border shrink-0 ${
                    team.userRole === 'owner' 
                      ? 'bg-accent/10 text-accent border-accent/30' 
                      : team.userRole === 'admin' 
                        ? 'bg-reaction/10 text-reaction border-reaction/30' 
                        : 'bg-surface-3 text-textSecondary border-borderDef'
                  }`}>
                    {team.userRole === 'owner' ? <Crown className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                    {team.userRole === 'owner' ? 'Владелец' : team.userRole === 'admin' ? 'Админ' : 'Участник'}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 rounded-control bg-surface-2 text-[10px] font-mono text-textSecondary border border-borderDef">
                    {TEAM_TYPE_LABELS[team.type] || 'Команда'}
                  </span>
                  {team.pendingTransfer && (
                    <span className="px-2 py-0.5 rounded-control bg-warning/10 text-warning border border-warning/30 text-[10px] font-mono font-bold">
                      Передача прав
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-[11px] font-mono text-textSecondary mb-4 flex-wrap">
                  <span className="flex items-center gap-1.5"><Gamepad2 className="w-3.5 h-3.5 text-textPrimary" /> {team.gamesCount} игр</span>
                  <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-textPrimary" /> {team.membersCount} участн.</span>
                  {team.activeJamsCount > 0 && (
                    <span className="flex items-center gap-1.5 text-accent font-bold bg-accent/10 px-1.5 py-0.5 rounded">
                      <Trophy className="w-3.5 h-3.5" /> Участвует в {team.activeJamsCount} {team.activeJamsCount === 1 ? 'джеме' : 'джемах'}
                    </span>
                  )}
                </div>

                <div className="flex-1" />

                {/* Card Actions */}
                <div className="flex items-center justify-between gap-2 pt-4 border-t border-borderDef/50">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onChangeScope(team.id, `Выбран скоуп «${team.name}»`);
                    }}
                    className="h-8 px-3 bg-surface-1 hover:bg-surface-2 border border-borderDef text-textPrimary text-[11px] font-bold uppercase tracking-wider rounded-control flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                  >
                    <FolderKanban className="w-3.5 h-3.5 text-accent" /> Войти в scope
                  </button>

                  <div className="flex items-center gap-1.5">
                    <a 
                      href={`/teams/${team.slug}`}
                      target="_blank" 
                      rel="noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="w-8 h-8 flex items-center justify-center bg-surface-1 hover:bg-surface-2 border border-borderDef rounded-control text-textSecondary hover:text-textPrimary transition-colors"
                      title="Публичный профиль команды"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setSelectedTeamId(team.id);
                        setIsLeaveModalOpen(true); 
                      }}
                      className="w-8 h-8 flex items-center justify-center bg-surface-1 hover:bg-danger/10 border border-borderDef hover:border-danger/30 rounded-control text-textSecondary hover:text-danger transition-colors cursor-pointer"
                      title="Покинуть команду (AC-TEAM-020)"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* 5. SELECTED TEAM WORKSPACE */}
      {selectedTeam && (
        <div className="bg-surface-1 border border-borderDef rounded-card shadow-sm flex flex-col mt-2 overflow-hidden">
          
          {/* Top Panel Header */}
          <div className="p-5 border-b border-borderDef bg-surface-2/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-textPrimary flex items-center gap-2">
                  Управление командой: {selectedTeam.name}
                </h3>
                <span className="px-2 py-0.5 rounded-control bg-surface-2 text-[10px] font-mono text-textSecondary border border-borderDef">
                  {TEAM_TYPE_LABELS[selectedTeam.type]}
                </span>
              </div>
              <p className="text-xs text-textSecondary font-mono mt-1">
                slug: @{selectedTeam.slug} • создана {selectedTeam.createdAt}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {isCurrentMemberOwnerOrAdmin && (
                <>
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="h-8 px-3 bg-surface-1 hover:bg-surface-2 border border-borderDef text-textPrimary text-[11px] font-bold uppercase tracking-wider rounded-control flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                    title="Настройки профиля команды"
                  >
                    <Settings className="w-3.5 h-3.5" /> Настройки
                  </button>

                  {isCurrentMemberOwner && (
                    <button
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="h-8 px-3 bg-surface-1 hover:bg-danger/10 border border-borderDef hover:border-danger/30 text-textSecondary hover:text-danger text-[11px] font-bold uppercase tracking-wider rounded-control flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                      title="Удалить команду"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Удалить
                    </button>
                  )}

                  <button
                    onClick={() => setIsInviteModalOpen(true)}
                    className="h-8 px-4 bg-surface-1 hover:bg-surface-2 border border-borderDef text-textPrimary text-[11px] font-bold uppercase tracking-wider rounded-control flex items-center gap-2 transition-colors cursor-pointer shadow-sm shrink-0"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-accent" /> Пригласить
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Sub-Tabs Switcher */}
          <div className="flex items-center gap-1 px-5 border-b border-borderDef bg-surface-1">
            <button
              onClick={() => setActiveSubTab('members')}
              className={`py-3 px-3.5 text-xs font-bold font-mono uppercase tracking-wider border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
                activeSubTab === 'members'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-textSecondary hover:text-textPrimary'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Участники и права ({selectedTeam.members.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('invitations')}
              className={`py-3 px-3.5 text-xs font-bold font-mono uppercase tracking-wider border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
                activeSubTab === 'invitations'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-textSecondary hover:text-textPrimary'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Исходящие приглашения ({teamOutgoingInvites.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('audit')}
              className={`py-3 px-3.5 text-xs font-bold font-mono uppercase tracking-wider border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
                activeSubTab === 'audit'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-textSecondary hover:text-textPrimary'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Аудит ({teamAudit.length})</span>
            </button>
          </div>

          {/* SUB-TAB 1: MEMBERS & PERMISSIONS */}
          {activeSubTab === 'members' && (
            <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-borderDef">
              {/* Left Column: Members List */}
              <div className="lg:w-1/3 flex flex-col">
                <div className="p-3 bg-surface-2/50 border-b border-borderDef flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-textSecondary">
                    Состав команды ({selectedTeam.members.length})
                  </span>
                </div>
                <div className="divide-y divide-borderDef">
                  {selectedTeam.members.map(member => {
                    const isMemSelected = member.id === selectedMemberId;
                    return (
                      <div
                        key={member.id}
                        onClick={() => setSelectedMemberId(member.id)}
                        className={`p-4 transition-colors cursor-pointer flex items-center justify-between group ${
                          isMemSelected ? 'bg-surface-1 shadow-[inset_3px_0_0_#8B5CF6]' : 'bg-surface-1 hover:bg-surface-2/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img src={member.avatar} alt="Avatar" className="w-8 h-8 rounded-full border border-borderDef object-cover shadow-sm shrink-0" />
                          <div className="flex flex-col">
                            <div className={`text-sm font-bold transition-colors ${isMemSelected ? 'text-textPrimary' : 'text-textSecondary group-hover:text-textPrimary'}`}>
                              {member.name}
                            </div>
                            <div className="text-[11px] font-mono text-textTertiary mt-0.5">{member.nick}</div>
                          </div>
                        </div>

                        <span className={`px-2 py-0.5 rounded-control text-[10px] font-mono font-bold uppercase tracking-wider ${
                          member.role === 'owner' ? 'bg-accent/10 text-accent' : member.role === 'admin' ? 'bg-reaction/10 text-reaction' : 'bg-surface-3 text-textSecondary'
                        }`}>
                          {member.role === 'owner' ? 'Владелец' : member.role === 'admin' ? 'Админ' : 'Участник'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Member Details & Permissions Matrix */}
              <div className="lg:w-2/3 p-6 flex flex-col">
                {selectedMember ? (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-borderDef/50">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full border border-borderDef overflow-hidden shadow-sm shrink-0">
                          <img src={selectedMember.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-textPrimary flex items-center gap-2">
                            {selectedMember.name}
                            <span className="text-xs font-mono font-normal text-textSecondary">({selectedMember.nick})</span>
                          </h4>
                          <span className="text-[11px] font-mono text-textSecondary uppercase tracking-wider block mt-0.5">
                            Роль: <strong className="text-textPrimary">{selectedMember.role}</strong> {selectedMember.joinedAt && `• в команде с ${selectedMember.joinedAt}`}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {!isCurrentMemberOwnerOrAdmin ? (
                          <span className="px-3 py-1.5 bg-surface-2 border border-borderDef text-textSecondary text-[11px] font-mono font-bold uppercase tracking-wider rounded-control flex items-center gap-1.5 shadow-sm">
                            <Lock className="w-3.5 h-3.5" /> Только просмотр
                          </span>
                        ) : (
                          <>
                            {/* Role Switcher for Admin/Member (AC-TEAM-016) */}
                            {selectedMember.role !== 'owner' && isCurrentMemberOwner && (
                              <div className="flex items-center border border-borderDef rounded-control overflow-hidden bg-surface-2 text-[11px] font-mono font-bold">
                                <button
                                  onClick={() => handleChangeMemberRole(selectedMember.id, 'admin')}
                                  className={`px-2.5 py-1.5 transition-colors cursor-pointer ${
                                    selectedMember.role === 'admin' ? 'bg-reaction text-white' : 'text-textSecondary hover:text-textPrimary'
                                  }`}
                                  title="Назначить администратором"
                                >
                                  Admin
                                </button>
                                <button
                                  onClick={() => handleChangeMemberRole(selectedMember.id, 'member')}
                                  className={`px-2.5 py-1.5 transition-colors cursor-pointer ${
                                    selectedMember.role === 'member' ? 'bg-surface-3 text-textPrimary' : 'text-textSecondary hover:text-textPrimary'
                                  }`}
                                  title="Сделать участником"
                                >
                                  Member
                                </button>
                              </div>
                            )}

                            {/* Transfer Ownership Button (AC-TEAM-022) */}
                            {isCurrentMemberOwner && selectedMember.role !== 'owner' && (
                              <button
                                onClick={() => setTransferTargetMember(selectedMember)}
                                className="h-8 px-3 bg-surface-1 hover:bg-surface-2 border border-borderDef text-textPrimary hover:text-accent text-[11px] font-bold uppercase tracking-wider rounded-control flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                                title="Передать права владельца (AC-TEAM-022)"
                              >
                                <Crown className="w-3.5 h-3.5 text-accent" /> Сделать владельцем
                              </button>
                            )}

                            {/* Kick Member Button (AC-TEAM-019) */}
                            {selectedMember.role !== 'owner' && (
                              <button
                                onClick={() => handleRemoveMember(selectedMember.id)}
                                className="h-8 px-3 bg-surface-1 hover:bg-danger/10 border border-borderDef hover:border-danger/30 text-textSecondary hover:text-danger text-[11px] font-bold uppercase tracking-wider rounded-control flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                                title="Исключить участника (AC-TEAM-019)"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Исключить
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Permissions Grid (AC-TEAM-017) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                      {PERMISSIONS_META.map(perm => {
                        const isChecked = selectedMember.role === 'owner' || Boolean(selectedMember.permissions?.[perm.key]);
                        const isOwner = selectedMember.role === 'owner';
                        const canEdit = isCurrentMemberOwnerOrAdmin && !isOwner;
                        
                        return (
                          <div 
                            key={perm.key}
                            onClick={() => canEdit && handleTogglePermission(perm.key)}
                            className={`flex items-start justify-between gap-3 p-3.5 rounded-card border transition-all ${
                              canEdit ? 'cursor-pointer hover:border-accent/40' : 'cursor-default opacity-85'
                            } ${isChecked ? 'bg-surface-2/60 border-borderDef' : 'bg-transparent border-borderDef/60'}`}
                          >
                            <div className="flex flex-col gap-0.5 pr-2">
                              <span className="font-mono text-xs font-bold text-textPrimary tracking-wide flex items-center gap-1.5">
                                {perm.title}
                                {isOwner && <Lock className="w-3 h-3 text-textTertiary" />}
                              </span>
                              <span className="text-[11px] text-textSecondary leading-relaxed">{perm.desc}</span>
                            </div>
                            
                            {/* Toggle Switch */}
                            <div className={`w-8 h-4 rounded-full flex items-center shrink-0 transition-colors duration-200 mt-1 ${isChecked ? 'bg-accent' : 'bg-surface-3'}`}>
                              <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-200 ${isChecked ? 'translate-x-4' : 'translate-x-1'}`} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center text-textSecondary py-12">
                    <Lock className="w-8 h-8 text-surface-3 mb-4" />
                    <p className="text-sm font-mono">Выберите участника для настройки прав</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SUB-TAB 2: OUTGOING INVITATIONS (FE-TEAM-005, AC-TEAM-010...015) */}
          {activeSubTab === 'invitations' && (
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-textPrimary">Ожидающие приглашения в команду</h4>
                  <p className="text-xs text-textSecondary font-mono mt-0.5">
                    Пользователи получают уведомление и доступ только после подтверждения (Accept)
                  </p>
                </div>
                {isCurrentMemberOwnerOrAdmin && (
                  <button
                    onClick={() => setIsInviteModalOpen(true)}
                    className="h-8 px-3.5 bg-accent hover:bg-accent-hover text-white text-xs font-bold rounded-control flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                  >
                    <UserPlus className="w-3.5 h-3.5" /> Пригласить нового
                  </button>
                )}
              </div>

              {teamOutgoingInvites.length === 0 ? (
                <div className="p-8 text-center bg-surface-2/30 rounded-card border border-borderDef text-textSecondary space-y-2">
                  <Mail className="w-8 h-8 mx-auto text-textTertiary" />
                  <p className="text-xs font-mono">Нет активных исходящих приглашений</p>
                </div>
              ) : (
                <div className="border border-borderDef rounded-card overflow-hidden divide-y divide-borderDef">
                  {teamOutgoingInvites.map(inv => (
                    <div key={inv.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-1 hover:bg-surface-2/40 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-textPrimary font-mono">{inv.targetUserQuery}</span>
                          <span className="px-2 py-0.5 rounded-control text-[10px] font-mono font-bold uppercase tracking-wider bg-surface-2 text-textSecondary border border-borderDef">
                            Роль: {inv.targetRole}
                          </span>
                          <span className={`px-2 py-0.5 rounded-control text-[10px] font-mono font-bold uppercase tracking-wider ${
                            inv.status === 'pending' 
                              ? 'bg-warning/10 text-warning border border-warning/30' 
                              : inv.status === 'cancelled'
                                ? 'bg-surface-3 text-textTertiary'
                                : 'bg-success/10 text-success'
                          }`}>
                            {inv.status === 'pending' ? 'Ожидает ответа' : inv.status === 'cancelled' ? 'Отозвано' : inv.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-textSecondary font-mono">
                          Отправил: {inv.inviterNick} • {inv.createdAt} {inv.expiresAt && `• истекает ${inv.expiresAt}`}
                        </p>
                      </div>

                      {isCurrentMemberOwnerOrAdmin && inv.status === 'pending' && (
                        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                          <button
                            onClick={() => handleResendInvite(inv.id)}
                            className="h-8 px-2.5 bg-surface-2 hover:bg-surface-3 border border-borderDef text-textSecondary hover:text-textPrimary text-xs font-semibold rounded-control flex items-center gap-1 transition-colors cursor-pointer"
                            title="Отправить повторно (AC-TEAM-015)"
                          >
                            <RefreshCw className="w-3.5 h-3.5" /> Повторить
                          </button>
                          <button
                            onClick={() => handleCancelInvite(inv.id)}
                            className="h-8 px-2.5 bg-surface-2 hover:bg-danger/10 border border-borderDef hover:border-danger/30 text-textSecondary hover:text-danger text-xs font-semibold rounded-control flex items-center gap-1 transition-colors cursor-pointer"
                            title="Отозвать приглашение (AC-TEAM-014)"
                          >
                            <X className="w-3.5 h-3.5" /> Отменить
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SUB-TAB 3: AUDIT LOG (FE-TEAM-013, AC-TEAM-059) */}
          {activeSubTab === 'audit' && (
            <div className="p-6 space-y-4">
              <div>
                <h4 className="text-sm font-bold text-textPrimary">Журнал аудита команды</h4>
                <p className="text-xs text-textSecondary font-mono mt-0.5">
                  Неизменяемая хроника действий, смены ролей и передачи прав (AC-TEAM-059)
                </p>
              </div>

              {teamAudit.length === 0 ? (
                <div className="p-8 text-center bg-surface-2/30 rounded-card border border-borderDef text-textSecondary">
                  <History className="w-8 h-8 mx-auto text-textTertiary mb-2" />
                  <p className="text-xs font-mono">Журнал аудита пуст</p>
                </div>
              ) : (
                <div className="border border-borderDef rounded-card overflow-hidden divide-y divide-borderDef font-sans">
                  {teamAudit.map(log => (
                    <div key={log.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-surface-1 hover:bg-surface-2/40 transition-colors">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-textPrimary">{log.action}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-surface-2 border border-borderDef rounded-control text-textSecondary">
                            {log.actorNick}
                          </span>
                        </div>
                        {log.details && (
                          <p className="text-[11px] text-textSecondary">{log.details}</p>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-textTertiary shrink-0 sm:text-right">
                        {log.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* MODALS */}
      <CreateTeamModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateTeam={handleCreateTeam}
      />

      <InviteMemberModal 
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        teamName={selectedTeam?.name || ''}
        onSendInvite={handleSendInvite}
      />

      <LeaveTeamModal 
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        teamName={selectedTeam?.name || ''}
        userRole={selectedTeam?.userRole}
        onConfirmLeave={handleLeaveTeamConfirm}
        onOpenTransferOwnership={() => {
          if (selectedTeam?.members.length > 1) {
            const nextCandidate = selectedTeam.members.find(m => m.id !== 'usr_1') || selectedTeam.members[1];
            setTransferTargetMember(nextCandidate);
          } else {
            triggerToast('В команде нет других участников для передачи прав. Добавьте участника или удалите команду.', 'error');
          }
        }}
      />

      <EditTeamModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        team={selectedTeam}
        onEditTeam={handleEditTeam}
      />

      <DeleteTeamModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        team={selectedTeam}
        onConfirmDelete={handleDeleteTeam}
      />

      <TransferOwnershipModal
        isOpen={Boolean(transferTargetMember)}
        onClose={() => setTransferTargetMember(null)}
        teamName={selectedTeam?.name || ''}
        targetMember={transferTargetMember}
        onInitiateTransfer={handleInitiateTransfer}
      />

    </div>
  );
};
