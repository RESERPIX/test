import React, { useState } from 'react';
import { 
  Users, 
  Settings, 
  AlertTriangle, 
  ArrowLeft, 
  Plus, 
  CheckCircle2, 
  Shield, 
  UserX, 
  X, 
  Trash2, 
  Mail, 
  Clock, 
  RefreshCw, 
  Key, 
  ArrowRight,
  Check,
  Building,
  UserCheck,
  Send,
  Info
} from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { CustomSelect } from '../components/ui/Select';
import { TEAM_TYPES } from './TeamsCatalogPage';
import { useToast } from '../components/ui/Toast';

// --- TYPES (FE-ACC-006: BR-ACC-043...046, BR-ACC-064) ---
export interface TeamItem {
  id: string;
  slug: string;
  name: string;
  role: 'Owner' | 'Admin' | 'Member';
  membersCount: number;
  description: string;
  type: string;
}

export interface TeamInvitationItem {
  id: string;
  teamId: string;
  teamName: string;
  teamSlug: string;
  inviter: string;
  targetRole: 'Admin' | 'Member';
  date: string;
}

export interface MemberItem {
  id: string;
  username: string;
  name: string;
  role: 'Owner' | 'Admin' | 'Member';
  avatar: string;
}

export interface PendingInviteItem {
  id: string;
  emailOrNick: string;
  targetRole: 'Admin' | 'Member';
  date: string;
}

// --- INITIAL MOCK DATA ---
const INITIAL_MY_TEAMS: TeamItem[] = [
  { 
    id: 't1', 
    slug: 'neon-studios', 
    name: 'Neon Studios', 
    role: 'Owner', 
    membersCount: 3, 
    description: 'Независимая студия разработки атмосферных инди-проектов', 
    type: 'indie_team' 
  },
  { 
    id: 't2', 
    slug: 'open-collective', 
    name: 'Open Collective', 
    role: 'Member', 
    membersCount: 12, 
    description: 'Открытое сообщество инди-разработчиков и энтузиастов геймдева', 
    type: 'community' 
  },
];

const INITIAL_INCOMING_INVITES: TeamInvitationItem[] = [
  {
    id: 'inv-1',
    teamId: 't-cyber',
    teamName: 'Cyber Crafters',
    teamSlug: 'cyber-crafters',
    inviter: '@vlad_lead',
    targetRole: 'Member',
    date: '2 часа назад'
  },
  {
    id: 'inv-2',
    teamId: 't-retro',
    teamName: 'Retro Pixel Team',
    teamSlug: 'retro-pixel',
    inviter: '@pixel_master',
    targetRole: 'Admin',
    date: 'Вчера'
  }
];

const INITIAL_MEMBERS: MemberItem[] = [
  { id: 'm1', username: 'alex_dev', name: 'Александр', role: 'Owner', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop' },
  { id: 'm2', username: 'cyber_artist', name: 'Елена', role: 'Admin', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop' },
  { id: 'm3', username: 'sound_master', name: 'Сергей', role: 'Member', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop' }
];

const INITIAL_PENDING_OUTGOING: PendingInviteItem[] = [
  { id: 'out-1', emailOrNick: '@newbie_coder', targetRole: 'Member', date: '3 часа назад' },
  { id: 'out-2', emailOrNick: 'level_artist@example.com', targetRole: 'Admin', date: 'Вчера' }
];

export default function TeamDashboardPage({ teamId }: { teamId?: string }) {
  const { showToast } = useToast();

  // Navigation & selection
  const [selectedTeamSlug, setSelectedTeamSlug] = useState<string | null>(teamId || null);
  const activeSlug = teamId || selectedTeamSlug;

  // Global teams & invitations state (FE-ACC-006: BR-ACC-043, BR-ACC-045, BR-ACC-046)
  const [myTeams, setMyTeams] = useState<TeamItem[]>(INITIAL_MY_TEAMS);
  const [incomingInvites, setIncomingInvites] = useState<TeamInvitationItem[]>(INITIAL_INCOMING_INVITES);

  // Active workspace state
  const [activeTab, setActiveTab] = useState<'settings' | 'members' | 'invitations' | 'audit' | 'danger'>('settings');
  const [teamMembers, setTeamMembers] = useState<MemberItem[]>(INITIAL_MEMBERS);
  const [pendingOutgoing, setPendingOutgoing] = useState<PendingInviteItem[]>(INITIAL_PENDING_OUTGOING);

  // Creation form state
  const [isCreating, setIsCreating] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamSlug, setNewTeamSlug] = useState('');
  const [newTeamType, setNewTeamType] = useState('indie_team');
  const [newTeamDesc, setNewTeamDesc] = useState('');

  // Team settings state
  const [currentTeamName, setCurrentTeamName] = useState('Neon Studios');
  const [currentTeamDesc, setCurrentTeamDesc] = useState('Независимая студия разработки атмосферных инди-проектов');

  // Invitation creation state
  const [inviteTarget, setInviteTarget] = useState('');
  const [inviteTargetRole, setInviteTargetRole] = useState<'Admin' | 'Member'>('Member');

  // Danger zone state
  const [newOwnerId, setNewOwnerId] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  // Audit logs
  const [auditLogs, setAuditLogs] = useState([
    { d: 'Сегодня, 14:30', u: 'alex_dev', a: 'Обновил описание команды' },
    { d: 'Вчера, 09:15', u: 'cyber_artist', a: 'Отправил приглашение пользователю @newbie_coder' },
    { d: '10 авг, 18:00', u: 'alex_dev', a: 'Создал команду Neon Studios' },
  ]);

  const currentTeam = myTeams.find(t => t.slug === activeSlug) || myTeams[0];

  const goBack = () => {
    setSelectedTeamSlug(null);
    if ((window as any).__hubigrNavigate) (window as any).__hubigrNavigate('/my-teams');
  };

  const goToTeam = (slug: string) => {
    setSelectedTeamSlug(slug);
    if ((window as any).__hubigrNavigate) (window as any).__hubigrNavigate(`/my-teams/${slug}`);
  };

  // --- ACTIONS: INCOMING INVITATIONS (FR-ACC-041, FR-ACC-042, FR-ACC-043, BR-ACC-046) ---
  const handleAcceptInvite = (inv: TeamInvitationItem) => {
    const newTeam: TeamItem = {
      id: inv.teamId,
      slug: inv.teamSlug || inv.teamName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name: inv.teamName,
      role: inv.targetRole,
      membersCount: 3,
      description: 'Новая студия разработки',
      type: 'indie_team'
    };
    setMyTeams(prev => [newTeam, ...prev]);
    setIncomingInvites(prev => prev.filter(i => i.id !== inv.id));
    showToast(`Вы приняли приглашение в команду «${inv.teamName}»!`, 'success');
  };

  const handleRejectInvite = (inv: TeamInvitationItem) => {
    setIncomingInvites(prev => prev.filter(i => i.id !== inv.id));
    showToast(`Приглашение в команду «${inv.teamName}» отклонено`, 'info');
  };

  // --- ACTIONS: TEAM CREATION (FR-ACC-038, BR-ACC-043) ---
  const handleCreateTeam = () => {
    const trimmedName = newTeamName.trim();
    if (!trimmedName) {
      showToast('Введите название команды', 'warning');
      return;
    }
    const slug = newTeamSlug.trim() || trimmedName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const created: TeamItem = {
      id: `t-${Date.now()}`,
      slug,
      name: trimmedName,
      role: 'Owner',
      membersCount: 1,
      description: newTeamDesc || 'Новая инди-команда',
      type: newTeamType
    };
    setMyTeams(prev => [created, ...prev]);
    setIsCreating(false);
    setNewTeamName('');
    setNewTeamSlug('');
    setNewTeamDesc('');
    showToast(`Команда «${trimmedName}» успешно создана!`, 'success');
    goToTeam(slug);
  };

  // --- ACTIONS: SEND INVITATION (FR-ACC-040, BR-ACC-045) ---
  const handleSendInvite = () => {
    const target = inviteTarget.trim();
    if (!target) {
      showToast('Укажите @username или email пользователя', 'warning');
      return;
    }
    const newInvite: PendingInviteItem = {
      id: `out-${Date.now()}`,
      emailOrNick: target.startsWith('@') ? target : `@${target}`,
      targetRole: inviteTargetRole,
      date: 'Только что'
    };
    setPendingOutgoing(prev => [newInvite, ...prev]);
    setAuditLogs(prev => [
      { d: 'Только что', u: 'alex_dev', a: `Отправил приглашение пользователю ${newInvite.emailOrNick} (роль: ${inviteTargetRole})` },
      ...prev
    ]);
    setInviteTarget('');
    showToast(`Приглашение отправлено пользователю ${newInvite.emailOrNick}`, 'success');
  };

  const handleRevokeOutgoingInvite = (inviteId: string, target: string) => {
    setPendingOutgoing(prev => prev.filter(i => i.id !== inviteId));
    setAuditLogs(prev => [
      { d: 'Только что', u: 'alex_dev', a: `Отозвал приглашение для ${target}` },
      ...prev
    ]);
    showToast(`Приглашение для ${target} отозвано`, 'info');
  };

  // --- ACTIONS: MEMBERS & ROLES (FR-ACC-046, FR-ACC-047, BR-ACC-044) ---
  const handleChangeMemberRole = (memberId: string, newRole: 'Admin' | 'Member') => {
    setTeamMembers(prev => prev.map(m => m.id === memberId ? { ...m, role: newRole } : m));
    showToast('Роль участника успешно обновлена', 'success');
  };

  const handleExcludeMember = (memberId: string, username: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== memberId));
    setMyTeams(prev => prev.map(t => t.slug === activeSlug ? { ...t, membersCount: Math.max(1, t.membersCount - 1) } : t));
    setAuditLogs(prev => [
      { d: 'Только что', u: 'alex_dev', a: `Исключил участника @${username}` },
      ...prev
    ]);
    showToast(`Участник @${username} исключён из команды`, 'info');
  };

  // --- ACTIONS: OWNERSHIP TRANSFER & DELETE (FR-ACC-048, BR-ACC-064) ---
  const handleTransferOwnership = () => {
    if (!newOwnerId) {
      showToast('Выберите участника для передачи прав', 'warning');
      return;
    }
    const target = teamMembers.find(m => m.id === newOwnerId);
    if (!target) return;

    setTeamMembers(prev => prev.map(m => {
      if (m.id === target.id) return { ...m, role: 'Owner' };
      if (m.role === 'Owner') return { ...m, role: 'Admin' };
      return m;
    }));
    setMyTeams(prev => prev.map(t => t.slug === activeSlug ? { ...t, role: 'Admin' } : t));
    setAuditLogs(prev => [
      { d: 'Только что', u: 'alex_dev', a: `Передал права владельца команды пользователю @${target.username}` },
      ...prev
    ]);
    setNewOwnerId('');
    showToast(`Права владельца успешно переданы @${target.username}`, 'success');
  };

  const handleDeleteTeam = () => {
    if (deleteConfirmation !== currentTeam.slug) {
      showToast('Введённый URL не совпадает', 'danger');
      return;
    }
    setMyTeams(prev => prev.filter(t => t.slug !== currentTeam.slug));
    showToast(`Команда «${currentTeam.name}» удалена`, 'success');
    setDeleteConfirmation('');
    goBack();
  };

  // =========================================================================
  // VIEW: СПИСОК «МОИ КОМАНДЫ» И ВХОДЯЩИЕ ПРИГЛАШЕНИЯ (BR-ACC-043, FR-ACC-037)
  // =========================================================================
  if (!activeSlug) {
    return (
      <div className="w-full min-h-screen bg-bgDefault pt-16 md:pt-24 pb-20 select-none">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-h2 font-black text-textPrimary uppercase tracking-tight">Мои Команды</h1>
              <p className="text-body-sm text-textSecondary mt-1">
                Управление студиями, командами разработки и участие в совместных проектах
              </p>
            </div>
            <Button variant="primary" onClick={() => setIsCreating(true)} className="shrink-0">
              <Plus className="w-4 h-4 mr-2" /> Создать команду
            </Button>
          </div>

          {/* ВХОДЯЩИЕ ПРИГЛАШЕНИЯ В КОМАНДЫ (FE-ACC-006: FR-ACC-041, BR-ACC-045, BR-ACC-046) */}
          {incomingInvites.length > 0 && (
            <div className="mb-8 p-6 bg-surface-1 border border-accent/30 rounded-card shadow-sm animate-fadeIn">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-body font-bold text-textPrimary">Входящие приглашения в команды</h3>
                    <p className="text-caption text-textTertiary">
                      Вас пригласили стать участником. Членство возникает только после вашего согласия.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-accent bg-accent/10 px-2.5 py-1 rounded-full">
                  {incomingInvites.length} {incomingInvites.length === 1 ? 'приглашение' : 'приглашения'}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {incomingInvites.map((inv) => (
                  <div 
                    key={inv.id} 
                    className="p-4 bg-surface-2 border border-borderDef hover:border-accent/40 rounded-control flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-surface-3 border border-borderDef flex items-center justify-center text-textPrimary font-bold font-mono shrink-0">
                        {inv.teamName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-textPrimary">{inv.teamName}</span>
                          <span className="text-caption text-textTertiary">• {inv.inviter}</span>
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                            inv.targetRole === 'Admin' ? 'bg-warning/10 text-warning border border-warning/20' : 'bg-surface-3 text-textSecondary'
                          }`}>
                            Роль: {inv.targetRole}
                          </span>
                        </div>
                        <div className="text-caption text-textTertiary mt-0.5">{inv.date}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => handleRejectInvite(inv)}
                      >
                        <X className="w-4 h-4 mr-1.5" /> Отклонить
                      </Button>
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => handleAcceptInvite(inv)}
                      >
                        <Check className="w-4 h-4 mr-1.5" /> Принять приглашение
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ФОРМА СОЗДАНИЯ КОМАНДЫ (FR-ACC-038) */}
          {isCreating && (
            <div className="bg-surface-1 border border-accent/30 p-6 rounded-card mb-8 animate-fadeIn shadow-elevation-raised">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-h4 font-bold text-textPrimary">Создание новой команды</h2>
                <button 
                  onClick={() => setIsCreating(false)} 
                  className="text-textTertiary hover:text-textPrimary p-1 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-caption font-bold text-textSecondary uppercase mb-1.5 block">
                    Название команды *
                  </label>
                  <Input 
                    value={newTeamName} 
                    onChange={e => {
                      setNewTeamName(e.target.value);
                      if (!newTeamSlug) {
                        setNewTeamSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                      }
                    }} 
                    placeholder="Например, DreamMakers Studio" 
                  />
                </div>
                <div>
                  <label className="text-caption font-bold text-textSecondary uppercase mb-1.5 block">
                    URL страницы (Slug)
                  </label>
                  <Input 
                    value={newTeamSlug} 
                    onChange={e => setNewTeamSlug(e.target.value)} 
                    placeholder="dream-makers" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="text-caption font-bold text-textSecondary uppercase mb-1.5 block">
                    Тип команды
                  </label>
                  <CustomSelect 
                    variant="form"
                    value={newTeamType}
                    onChange={setNewTeamType}
                    options={Object.entries(TEAM_TYPES).map(([k, v]) => ({ value: k, label: v.label }))}
                  />
                </div>
                <div>
                  <label className="text-caption font-bold text-textSecondary uppercase mb-1.5 block">
                    Краткое описание
                  </label>
                  <Input 
                    value={newTeamDesc} 
                    onChange={e => setNewTeamDesc(e.target.value)} 
                    placeholder="Чем занимается ваша команда..." 
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-borderDef">
                <div className="text-caption text-textTertiary font-sans flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-accent shrink-0" />
                  <span>Вы автоматически станете владельцем (Owner) созданной команды</span>
                </div>
                <div className="flex gap-2.5">
                  <Button variant="secondary" onClick={() => setIsCreating(false)}>Отмена</Button>
                  <Button variant="primary" onClick={handleCreateTeam}>Создать команду</Button>
                </div>
              </div>
            </div>
          )}

          {/* СПИСОК КОМАНД ПОЛЬЗОВАТЕЛЯ (BR-ACC-043: Несколько Teams) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myTeams.map(team => (
              <div 
                key={team.id} 
                className="bg-surface-1 border border-borderDef p-5 rounded-control flex flex-col justify-between hover:border-accent/60 transition-all shadow-sm group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-2 border border-borderDef flex items-center justify-center font-bold text-textPrimary text-base group-hover:border-accent/40 transition-colors">
                        {team.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-textPrimary text-body leading-tight">{team.name}</h3>
                        <span className="text-caption font-mono text-textTertiary">/{team.slug}</span>
                      </div>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded font-bold font-mono text-[10px] uppercase border ${
                      team.role === 'Owner' 
                        ? 'bg-accent/10 text-accent border-accent/30' 
                        : team.role === 'Admin'
                        ? 'bg-warning/10 text-warning border-warning/30'
                        : 'bg-surface-2 text-textSecondary border-borderDef'
                    }`}>
                      {team.role}
                    </span>
                  </div>

                  <p className="text-body-sm text-textSecondary line-clamp-2 mt-2 font-sans">
                    {team.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-borderDef/60">
                  <span className="text-caption text-textTertiary flex items-center gap-1.5 font-mono">
                    <Users className="w-3.5 h-3.5 text-textTertiary" /> {team.membersCount} участников
                  </span>
                  <Button variant="secondary" size="sm" onClick={() => goToTeam(team.slug)}>
                    <span>Управление</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: РАБОЧАЯ ОБЛАСТЬ КОМАНДЫ (TEAM WORKSPACE)
  // =========================================================================
  return (
    <div className="w-full min-h-screen bg-bgDefault pt-16 md:pt-24 pb-20 select-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8 border-b border-borderDef pb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={goBack} 
              className="w-10 h-10 rounded-full bg-surface-1 hover:bg-surface-2 border border-borderDef flex items-center justify-center transition-colors cursor-pointer"
              title="Назад ко всем командам"
            >
              <ArrowLeft className="w-5 h-5 text-textPrimary" />
            </button>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-h3 font-black text-textPrimary uppercase tracking-tight">
                  {currentTeam.name}
                </h1>
                <span className={`px-2 py-0.5 rounded font-bold font-mono text-[10px] uppercase border ${
                  currentTeam.role === 'Owner' 
                    ? 'bg-accent/10 text-accent border-accent/30' 
                    : 'bg-surface-2 text-textSecondary border-borderDef'
                }`}>
                  {currentTeam.role}
                </span>
              </div>
              <p className="text-body-sm text-textSecondary mt-0.5 font-mono">
                /{currentTeam.slug}
              </p>
            </div>
          </div>

          <Button variant="secondary" size="sm" onClick={goBack}>
            <Users className="w-4 h-4 mr-1.5" />
            <span className="hidden sm:inline">Все команды</span>
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* SIDEBAR TABS */}
          <div className="w-full md:w-64 shrink-0 flex flex-col gap-1.5">
            {[
              { id: 'settings', label: 'Настройки', icon: Settings },
              { id: 'members', label: 'Участники', icon: Users, count: teamMembers.length },
              { id: 'invitations', label: 'Приглашения', icon: Mail, count: pendingOutgoing.length },
              { id: 'audit', label: 'Журнал аудита', icon: Clock },
              { id: 'danger', label: 'Опасная зона', icon: AlertTriangle, danger: true },
            ].map(tab => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-3 rounded-control text-left font-bold transition-all flex items-center justify-between cursor-pointer ${
                    tab.danger
                      ? isSelected 
                        ? 'bg-danger/15 text-danger border border-danger/30' 
                        : 'text-danger/80 hover:bg-danger/10 hover:text-danger'
                      : isSelected 
                        ? 'bg-accent/10 text-accent border border-accent/20' 
                        : 'bg-surface-0 text-textSecondary hover:bg-surface-1 hover:text-textPrimary'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.count !== undefined && (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-surface-2 text-textTertiary">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* MAIN TAB CONTENT */}
          <div className="flex-1 min-w-0">
            
            {/* 1. НАСТРОЙКИ КОМАНДЫ (FR-ACC-039) */}
            {activeTab === 'settings' && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-h4 font-bold text-textPrimary">Настройки команды</h2>
                  <p className="text-caption text-textTertiary mt-0.5">Основные данные и параметры студии</p>
                </div>

                <div className="bg-surface-1 p-6 border border-borderDef rounded-card space-y-4 shadow-sm">
                  <div>
                    <label className="text-caption font-bold text-textSecondary uppercase mb-1.5 block">
                      Название команды
                    </label>
                    <Input 
                      value={currentTeamName} 
                      onChange={e => setCurrentTeamName(e.target.value)} 
                    />
                  </div>
                  <div>
                    <label className="text-caption font-bold text-textSecondary uppercase mb-1.5 block">
                      URL команды (Slug)
                    </label>
                    <Input 
                      defaultValue={currentTeam.slug} 
                      disabled 
                    />
                    <span className="text-[11px] text-textTertiary font-mono mt-1 block">
                      Идентификатор команды используется в ссылках и не может быть изменен после создания
                    </span>
                  </div>
                  <div>
                    <label className="text-caption font-bold text-textSecondary uppercase mb-1.5 block">
                      Описание деятельности
                    </label>
                    <textarea 
                      rows={4} 
                      className="w-full bg-surface-0 border border-borderDef rounded-control p-3 text-body-sm text-textPrimary focus:border-accent focus:outline-none transition-colors" 
                      value={currentTeamDesc} 
                      onChange={e => setCurrentTeamDesc(e.target.value)} 
                    />
                  </div>
                  <div className="pt-2">
                    <Button variant="primary" onClick={() => showToast('Настройки команды сохранены', 'success')}>
                      Сохранить изменения
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. УЧАСТНИКИ КОМАНДЫ (BR-ACC-044, FR-ACC-045...047) */}
            {activeTab === 'members' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-h4 font-bold text-textPrimary">Участники команды</h2>
                    <p className="text-caption text-textTertiary mt-0.5">
                      Контекстные роли в рамках команды: Owner, Admin, Member
                    </p>
                  </div>
                  <Button variant="secondary" onClick={() => setActiveTab('invitations')}>
                    <Plus className="w-4 h-4 mr-2" /> Пригласить
                  </Button>
                </div>
                
                <div className="bg-surface-1 border border-borderDef rounded-card overflow-hidden shadow-sm">
                  {teamMembers.map((m) => (
                    <div 
                      key={m.id} 
                      className="flex items-center justify-between p-4 border-b border-borderDef last:border-0 bg-surface-0 hover:bg-surface-1 transition-colors"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <img 
                          src={m.avatar} 
                          alt="" 
                          className="w-10 h-10 rounded-full shrink-0 object-cover border border-borderDef" 
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-textPrimary truncate">{m.name}</p>
                          <span className="text-caption font-mono text-textTertiary">@{m.username}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 shrink-0">
                        {m.role === 'Owner' ? (
                          <span className="px-3 py-1 rounded font-bold font-mono text-[11px] uppercase bg-accent/10 text-accent border border-accent/30">
                            Owner (Владелец)
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <CustomSelect
                              size="sm"
                              value={m.role.toLowerCase()}
                              onChange={(val) => handleChangeMemberRole(m.id, val === 'admin' ? 'Admin' : 'Member')}
                              options={[
                                { value: 'admin', label: 'Admin (Администратор)' }, 
                                { value: 'member', label: 'Member (Участник)' }
                              ]}
                            />
                            <button 
                              onClick={() => handleExcludeMember(m.id, m.username)} 
                              className="w-8 h-8 flex items-center justify-center rounded bg-surface-2 hover:bg-danger/20 text-textTertiary hover:text-danger transition-colors cursor-pointer" 
                              title={`Исключить @${m.username} из команды`}
                            >
                              <UserX className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. ПРИГЛАШЕНИЯ (BR-ACC-045, BR-ACC-046, FR-ACC-040, FR-ACC-044) */}
            {activeTab === 'invitations' && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-h4 font-bold text-textPrimary">Приглашения в команду</h2>
                  <p className="text-caption text-textTertiary mt-0.5">
                    Прямое добавление без согласия запрещено. Пользователь получит приглашение и войдет в команду только после принятия.
                  </p>
                </div>
                
                {/* Форма отправки инвайта */}
                <div className="bg-surface-1 p-6 border border-borderDef rounded-card shadow-sm">
                  <h3 className="font-bold text-textPrimary mb-3 flex items-center gap-2">
                    <Send className="w-4 h-4 text-accent" />
                    <span>Отправить приглашение</span>
                  </h3>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <Input 
                        value={inviteTarget} 
                        onChange={e => setInviteTarget(e.target.value)} 
                        placeholder="@username или email пользователя..." 
                      />
                    </div>
                    <div className="w-full sm:w-48">
                      <CustomSelect 
                        value={inviteTargetRole.toLowerCase()}
                        onChange={(val) => setInviteTargetRole(val === 'admin' ? 'Admin' : 'Member')}
                        options={[
                          { value: 'member', label: 'Роль: Member' },
                          { value: 'admin', label: 'Роль: Admin' }
                        ]}
                      />
                    </div>
                    <Button variant="primary" onClick={handleSendInvite} className="shrink-0">
                      Отправить
                    </Button>
                  </div>
                </div>

                {/* Список отправленных и ожидающих ответа инвайтов */}
                <div>
                  <h3 className="font-bold text-textPrimary mb-3 flex items-center justify-between">
                    <span>Ожидают принятия пользователем (Pending)</span>
                    <span className="text-xs font-mono text-textTertiary font-normal">
                      {pendingOutgoing.length} отправлено
                    </span>
                  </h3>

                  <div className="bg-surface-1 border border-borderDef rounded-card overflow-hidden shadow-sm">
                    {pendingOutgoing.map((inv) => (
                      <div 
                        key={inv.id} 
                        className="flex items-center justify-between p-4 border-b border-borderDef last:border-0 bg-surface-0 hover:bg-surface-1 transition-colors"
                      >
                        <div>
                          <p className="font-bold text-textPrimary font-mono">{inv.emailOrNick}</p>
                          <div className="flex items-center gap-2 text-xs text-textTertiary mt-0.5 font-mono">
                            <span className="text-textSecondary font-bold">Роль: {inv.targetRole}</span>
                            <span>•</span>
                            <span>Отправлено {inv.date}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Button 
                            variant="secondary" 
                            size="sm"
                            onClick={() => showToast('Приглашение отправлено повторно', 'info')}
                            title="Отправить повторное уведомление"
                          >
                            <RefreshCw className="w-3.5 h-3.5 mr-1" /> Повторить
                          </Button>
                          <Button 
                            variant="danger" 
                            size="sm"
                            onClick={() => handleRevokeOutgoingInvite(inv.id, inv.emailOrNick)}
                          >
                            Отозвать
                          </Button>
                        </div>
                      </div>
                    ))}
                    {pendingOutgoing.length === 0 && (
                      <div className="p-8 text-center text-caption text-textTertiary">
                        Нет активных ожидающих приглашений
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 4. ЖУРНАЛ АУДИТА */}
            {activeTab === 'audit' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-h4 font-bold text-textPrimary">Журнал аудита</h2>
                    <p className="text-caption text-textTertiary mt-0.5">История административных действий в команде</p>
                  </div>
                  <Button variant="secondary" size="sm">
                    <Shield className="w-4 h-4 mr-2" /> Экспорт CSV
                  </Button>
                </div>
                
                <div className="bg-surface-1 border border-borderDef rounded-card overflow-hidden shadow-sm">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-textSecondary border-b border-borderDef bg-surface-2/60">
                        <th className="p-3.5 font-semibold w-1/4">Дата</th>
                        <th className="p-3.5 font-semibold w-1/4">Пользователь</th>
                        <th className="p-3.5 font-semibold w-1/2">Действие</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogs.map((log, i) => (
                        <tr key={i} className="border-b border-borderDef last:border-0 hover:bg-surface-2/40 transition-colors">
                          <td className="p-3.5 text-textTertiary font-mono text-xs">{log.d}</td>
                          <td className="p-3.5 font-medium text-textPrimary font-mono">@{log.u}</td>
                          <td className="p-3.5 text-textSecondary">{log.a}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 5. ОПАСНАЯ ЗОНА (BR-ACC-064: Передача прав владельца и удаление) */}
            {activeTab === 'danger' && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-h4 font-bold text-textPrimary text-danger">Опасная зона</h2>
                  <p className="text-caption text-textTertiary mt-0.5">
                    Действия, связанные с передачей прав владения и закрытием команды
                  </p>
                </div>
                
                {/* ПЕРЕДАЧА ПРАВ ВЛАДЕЛЬЦА (BR-ACC-064) */}
                <div className="bg-surface-1 border border-borderDef p-6 rounded-card shadow-sm">
                  <h3 className="font-bold text-textPrimary mb-2 flex items-center gap-2">
                    <Key className="w-5 h-5 text-warning" /> 
                    <span>Передача прав владельца команды</span>
                  </h3>
                  <p className="text-body-sm text-textSecondary mb-5 font-sans leading-relaxed">
                    Вы можете передать статус <strong>Owner</strong> другому участнику команды. 
                    После подтверждения новый владелец получит полный контроль над командой, а ваша роль изменится на Администратор (Admin).
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                    <div className="flex-1">
                      <CustomSelect 
                        value={newOwnerId}
                        onChange={setNewOwnerId}
                        options={[
                          { value: '', label: 'Выберите нового владельца из участников...' },
                          ...teamMembers.filter(m => m.role !== 'Owner').map(m => ({
                            value: m.id,
                            label: `${m.name} (@${m.username}) — ${m.role}`
                          }))
                        ]}
                      />
                    </div>
                    <Button 
                      variant="secondary" 
                      onClick={handleTransferOwnership}
                      disabled={!newOwnerId}
                      className="shrink-0"
                    >
                      <span>Передать права</span> 
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </div>
                </div>

                {/* УДАЛЕНИЕ КОМАНДЫ (С ПРОВЕРКОЙ БЛОКИРАТОРОВ) */}
                <div className="bg-danger/5 border border-danger/30 p-6 rounded-card shadow-sm">
                  <h3 className="font-bold text-textPrimary mb-2 flex items-center gap-2 text-danger">
                    <Trash2 className="w-5 h-5 text-danger" /> 
                    <span>Удаление команды</span>
                  </h3>
                  <p className="text-body-sm text-textSecondary mb-5 font-sans leading-relaxed">
                    Это действие необратимо. Перед удалением система обязана проверить зависимости: у команды не должно быть привязанных опубликованных игр и активных финансовых споров.
                  </p>
                  
                  {/* Чек-лист зависимостей перед удалением */}
                  <div className="space-y-2.5 bg-surface-0 p-4 rounded-control border border-borderDef mb-6">
                    <div className="flex items-center gap-2.5 text-body-sm">
                      <CheckCircle2 className="w-4 h-4 text-success shrink-0" /> 
                      <span className="text-textSecondary">Активный Seller Profile отсутствует</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-body-sm">
                      <CheckCircle2 className="w-4 h-4 text-success shrink-0" /> 
                      <span className="text-textSecondary">Все финансовые взаиморасчеты завершены</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-body-sm">
                      <X className="w-4 h-4 text-danger shrink-0" /> 
                      <span className="font-bold text-textPrimary">Привязана опубликованная игра (1 проект)</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="text-caption font-bold text-textSecondary uppercase block mb-1.5">
                      Введите URL команды <strong>{currentTeam.slug}</strong> для подтверждения:
                    </label>
                    <Input 
                      value={deleteConfirmation} 
                      onChange={e => setDeleteConfirmation(e.target.value)} 
                      placeholder={currentTeam.slug}
                    />
                  </div>

                  <Button 
                    variant="danger" 
                    disabled={deleteConfirmation !== currentTeam.slug} 
                    onClick={handleDeleteTeam}
                  >
                    Я понимаю последствия, удалить команду
                  </Button>
                </div>

              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
