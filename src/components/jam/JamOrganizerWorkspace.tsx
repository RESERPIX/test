import React, { useState, useMemo } from 'react';
import {
  BarChart2,
  Shield,
  Users,
  Bell,
  Sparkles,
  FileText,
  Plus,
  Check,
  X,
  AlertTriangle,
  Gift,
  RefreshCw,
  ShieldCheck,
  Ban,
  AlertOctagon
} from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { jamOrganizerService } from '../../services/jamOrganizerService';
import {
  JamOrganizerAnalytics,
  JamJudgeAssignment,
  JamJudgeInvitation,
  JamAnnouncement,
  JamPartner,
  JamPrize,
  JamRuleVersion
} from '../../types/jamOrganizer';

export interface JamOrganizerWorkspaceProps {
  isOpen: boolean;
  onClose: () => void;
  jamId: string;
  jamTitle?: string;
  triggerToast?: (text: string, type?: any) => void;
}

// Mock submissions for moderation
const INITIAL_SUBMISSIONS = [
  {
    id: 'sub_01',
    gameTitle: 'Neon Abyss: Cyber Runner',
    gameId: 'game_101',
    author: 'CyberPunk Squad',
    authorType: 'team',
    isOrganizerOwnGame: false,
    engine: 'Unity 2023.2',
    webGlReady: true,
    assetsDeclared: 'Использовались бесплатные звуки freesound.org',
    submittedAt: '03 Сен 2026, 17:40',
    status: 'on_moderation', // 'on_moderation' | 'approved' | 'rejected' | 'disqualified'
    cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300'
  },
  {
    id: 'sub_02',
    gameTitle: 'Void Odyssey (Showcase)',
    gameId: 'game_102',
    author: 'Void Labs Studio',
    authorType: 'team',
    isOrganizerOwnGame: true, // Conflict guard test!
    engine: 'Unreal Engine 5.3',
    webGlReady: false,
    assetsDeclared: 'Оригинальный арт и музыка',
    submittedAt: '04 Сен 2026, 12:10',
    status: 'approved',
    cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300'
  },
  {
    id: 'sub_03',
    gameTitle: 'Echoes of the Machine',
    gameId: 'game_103',
    author: 'SoloPilot',
    authorType: 'user',
    isOrganizerOwnGame: false,
    engine: 'Godot 4.2',
    webGlReady: true,
    assetsDeclared: 'Все создано с нуля на джеме',
    submittedAt: '04 Сен 2026, 16:50',
    status: 'approved',
    cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300'
  },
  {
    id: 'sub_04',
    gameTitle: 'Stolen Prototype 2025',
    gameId: 'game_104',
    author: 'SuspiciousUser',
    authorType: 'user',
    isOrganizerOwnGame: false,
    engine: 'Custom C++',
    webGlReady: false,
    assetsDeclared: 'Не указано',
    submittedAt: '04 Сен 2026, 17:59',
    status: 'disqualified',
    cover: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300'
  }
];

export const JamOrganizerWorkspace: React.FC<JamOrganizerWorkspaceProps> = ({
  isOpen,
  onClose,
  jamId,
  jamTitle = 'Indie Cyber Jam 2026',
  triggerToast = () => {}
}) => {
  const [activeTab, setActiveTab] = useState<
    'analytics' | 'moderation' | 'judges' | 'announcements' | 'partners' | 'prizes' | 'rules'
  >('analytics');

  // Submissions State
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);
  const [subFilter, setSubFilter] = useState('all');

  // Action Modals State
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [disqualifyModalOpen, setDisqualifyModalOpen] = useState(false);
  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);
  const [actionReason, setActionReason] = useState('');
  const [actionEvidence, setActionEvidence] = useState('');

  // Judges State
  const [judgesList] = useState<JamJudgeAssignment[]>(() =>
    jamOrganizerService.getJudges(jamId)
  );
  const [judgeInvites, setJudgeInvites] = useState<JamJudgeInvitation[]>(() =>
    jamOrganizerService.getJudgeInvitations(jamId)
  );
  const [newJudgeNick, setNewJudgeNick] = useState('');
  const [newJudgeRole, setNewJudgeRole] = useState<'judge' | 'head_judge'>('judge');

  // Announcements State
  const [announcements, setAnnouncements] = useState<JamAnnouncement[]>(() =>
    jamOrganizerService.getAnnouncements(jamId)
  );
  const [newAncTitle, setNewAncTitle] = useState('');
  const [newAncContent, setNewAncContent] = useState('');
  const [newAncPinned, setNewAncPinned] = useState(false);

  // Partners State
  const [partners, setPartners] = useState<JamPartner[]>(() =>
    jamOrganizerService.getPartners(jamId)
  );
  const [newPartName, setNewPartName] = useState('');
  const [newPartRole, setNewPartRole] = useState('');
  const [newPartUrl, setNewPartUrl] = useState('');

  // Prizes State
  const [prizes, setPrizes] = useState<JamPrize[]>(() =>
    jamOrganizerService.getPrizes(jamId)
  );
  const [newPrizeTitle, setNewPrizeTitle] = useState('');
  const [newPrizeAmount, setNewPrizeAmount] = useState('');
  const [newPrizeType, setNewPrizeType] = useState<'money' | 'physical' | 'license' | 'service'>('money');
  const [newPrizeProvider, setNewPrizeProvider] = useState('');

  // Rules State
  const [ruleVersions, setRuleVersions] = useState<JamRuleVersion[]>(() =>
    jamOrganizerService.getRulesVersions(jamId)
  );
  const [newRuleText, setNewRuleText] = useState('');
  const [newRuleReason, setNewRuleReason] = useState('');

  // Analytics
  const analytics: JamOrganizerAnalytics = useMemo(
    () => jamOrganizerService.getAnalytics(jamId),
    [jamId]
  );

  // Filtered Submissions
  const filteredSubs = useMemo(() => {
    if (subFilter === 'all') return submissions;
    return submissions.filter((s) => s.status === subFilter);
  }, [submissions, subFilter]);

  // --- HANDLERS: MODERATION & CONFLICT GUARD (AC-JORG-024, 025, 026) ---

  const handleApproveSub = (sub: typeof INITIAL_SUBMISSIONS[0]) => {
    // Conflict guard (AC-JORG-026): organizer cannot moderate own game
    if (sub.isOrganizerOwnGame) {
      triggerToast('Защита от конфликта интересов: организатор не может модерировать собственную игру!', 'danger');
      return;
    }
    setSubmissions((prev) =>
      prev.map((s) => (s.id === sub.id ? { ...s, status: 'approved' } : s))
    );
    triggerToast(`Работа "${sub.gameTitle}" успешно одобрена для участия!`, 'success');
  };

  const handleOpenReject = (sub: typeof INITIAL_SUBMISSIONS[0]) => {
    if (sub.isOrganizerOwnGame) {
      triggerToast('Защита от конфликта интересов: организатор не может модерировать собственную игру!', 'danger');
      return;
    }
    setSelectedSubId(sub.id);
    setActionReason('');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (!actionReason.trim()) {
      triggerToast('Укажите причину отклонения заявки', 'warning');
      return;
    }
    setSubmissions((prev) =>
      prev.map((s) => (s.id === selectedSubId ? { ...s, status: 'rejected' } : s))
    );
    setRejectModalOpen(false);
    triggerToast('Заявка отклонена. Участник уведомлен о замечаниях.', 'info');
  };

  const handleOpenDisqualify = (sub: typeof INITIAL_SUBMISSIONS[0]) => {
    setSelectedSubId(sub.id);
    setActionReason('');
    setActionEvidence('');
    setDisqualifyModalOpen(true);
  };

  const handleConfirmDisqualify = () => {
    if (!actionReason.trim() || !actionEvidence.trim()) {
      triggerToast('Заполните причину и доказательства нарушения', 'warning');
      return;
    }
    const targetSub = submissions.find((s) => s.id === selectedSubId);
    if (!targetSub) return;

    jamOrganizerService.disqualifySubmission({
      jamId,
      submissionId: targetSub.id,
      gameTitle: targetSub.gameTitle,
      participantSubjectType: targetSub.authorType as any,
      participantSubjectId: targetSub.author,
      reason: actionReason,
      evidence: actionEvidence,
      disqualifiedBy: 'Оргкомитет джема'
    });

    setSubmissions((prev) =>
      prev.map((s) => (s.id === selectedSubId ? { ...s, status: 'disqualified' } : s))
    );
    setDisqualifyModalOpen(false);
    triggerToast(`Работа "${targetSub.gameTitle}" дисквалифицирована из джема.`, 'danger');
  };

  // --- HANDLERS: JUDGES (AC-JORG-011, 014) ---

  const handleInviteJudge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJudgeNick.trim()) {
      triggerToast('Введите никнейм приглашаемого эксперта', 'warning');
      return;
    }

    const invite = jamOrganizerService.inviteJudge(
      jamId,
      {
        id: 'usr_' + Date.now(),
        nick: newJudgeNick.trim(),
        name: newJudgeNick.trim(),
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
      },
      newJudgeRole,
      'usr_me'
    );

    setJudgeInvites((prev) => [...prev, invite]);
    setNewJudgeNick('');
    triggerToast(`Приглашение отправлено судье @${invite.targetUserNick}`, 'success');
  };

  const handleRevokeInvite = (inviteId: string) => {
    jamOrganizerService.revokeJudgeInvite(jamId, inviteId);
    setJudgeInvites((prev) => prev.filter((i) => i.id !== inviteId));
    triggerToast('Приглашение судьи отозвано', 'info');
  };

  // --- HANDLERS: ANNOUNCEMENTS (AC-JORG-043) ---

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAncTitle.trim() || !newAncContent.trim()) {
      triggerToast('Заполните заголовок и текст сообщения', 'warning');
      return;
    }

    const anc = jamOrganizerService.createAnnouncement(
      jamId,
      'usr_me',
      'Оргкомитет джема',
      newAncTitle.trim(),
      newAncContent.trim(),
      newAncPinned
    );

    setAnnouncements((prev) => [anc, ...prev]);
    setNewAncTitle('');
    setNewAncContent('');
    setNewAncPinned(false);
    triggerToast('Официальный анонс успешно опубликован для всех участников!', 'success');
  };

  // --- HANDLERS: PARTNERS (AC-JORG-034) ---

  const handleProposePartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartName.trim() || !newPartRole.trim()) {
      triggerToast('Укажите название партнера и его роль', 'warning');
      return;
    }

    const partner = jamOrganizerService.proposePartner(
      jamId,
      newPartName.trim(),
      newPartRole.trim(),
      newPartUrl.trim() || undefined
    );

    setPartners((prev) => [...prev, partner]);
    setNewPartName('');
    setNewPartRole('');
    setNewPartUrl('');
    triggerToast('Партнер добавлен и направлен на верификацию платформой', 'success');
  };

  // --- HANDLERS: PRIZES (AC-JORG-036) ---

  const handleAddPrize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrizeTitle.trim() || !newPrizeProvider.trim()) {
      triggerToast('Укажите название награды и предоставителя', 'warning');
      return;
    }

    const prize = jamOrganizerService.addPrize(jamId, {
      title: newPrizeTitle.trim(),
      amount: newPrizeAmount.trim() || undefined,
      type: newPrizeType,
      provider: newPrizeProvider.trim(),
      providerType: 'partner',
      description: 'Официальная награда джема',
      fulfillmentStatus: 'verified'
    });

    setPrizes((prev) => [...prev, prize]);
    setNewPrizeTitle('');
    setNewPrizeAmount('');
    setNewPrizeProvider('');
    triggerToast('Приз успешно добавлен в фонд джема', 'success');
  };

  // --- HANDLERS: RULES & MATERIAL CHANGES (AC-JORG-008) ---

  const handleAddRuleVersion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleText.trim() || !newRuleReason.trim()) {
      triggerToast('Укажите текст обновленных правил и причину изменений', 'warning');
      return;
    }

    const rule = jamOrganizerService.addRuleVersion(
      jamId,
      newRuleText.trim(),
      newRuleReason.trim(),
      true // Material change requires re-moderation
    );

    setRuleVersions((prev) => [...prev, rule]);
    setNewRuleText('');
    setNewRuleReason('');
    triggerToast('Новая версия правил направлена на согласование (Material Change)', 'info');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Рабочее место организатора (Organizer Workspace)"
      subtitle={`Управление джемом: ${jamTitle}`}
      maxWidth="xl"
    >
      <div className="flex flex-col h-[75vh] -mx-4 -my-2">
        {/* TOP NAVIGATION BAR */}
        <div className="px-6 py-2 border-b border-borderDef bg-surface-2 flex items-center justify-between gap-4 shrink-0 overflow-x-auto">
          <div className="flex items-center gap-1.5 min-w-max">
            <button
              type="button"
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-textSecondary hover:text-textPrimary hover:bg-surface-3'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              <span>Аналитика</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('moderation')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === 'moderation'
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-textSecondary hover:text-textPrimary hover:bg-surface-3'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Модерация заявок</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-surface-1 text-textPrimary border border-borderDef">
                {submissions.filter((s) => s.status === 'on_moderation').length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('judges')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === 'judges'
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-textSecondary hover:text-textPrimary hover:bg-surface-3'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Судьи и жюри</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('announcements')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === 'announcements'
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-textSecondary hover:text-textPrimary hover:bg-surface-3'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Анонсы</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('partners')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === 'partners'
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-textSecondary hover:text-textPrimary hover:bg-surface-3'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Партнеры</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('prizes')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === 'prizes'
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-textSecondary hover:text-textPrimary hover:bg-surface-3'
              }`}
            >
              <Gift className="w-4 h-4" />
              <span>Призы</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('rules')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === 'rules'
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-textSecondary hover:text-textPrimary hover:bg-surface-3'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Версии правил</span>
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-success/10 border border-success/30 text-success flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Verified Organizer
            </span>
          </div>
        </div>

        {/* TAB BODY CONTENT */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: ANALYTICS (FE-JORG-012, JORG-API-034, AC-JORG-045) */}
          {activeTab === 'analytics' && (
            <div className="flex flex-col gap-6">
              {/* TOP METRICS GRID */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                <div className="p-4 rounded-xl bg-surface-1 border border-borderDef flex flex-col gap-1">
                  <span className="text-xs text-textTertiary uppercase font-mono tracking-wider">Просмотры</span>
                  <div className="text-2xl font-bold text-textPrimary font-mono">
                    {analytics.viewsCount.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-success flex items-center gap-1 mt-1">
                    ↑ +18% за последние 48 часов
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-surface-1 border border-borderDef flex flex-col gap-1">
                  <span className="text-xs text-textTertiary uppercase font-mono tracking-wider">Регистрации</span>
                  <div className="text-2xl font-bold text-accent font-mono">
                    {analytics.registrationsCount}
                  </div>
                  <span className="text-[11px] text-textSecondary mt-1">
                    {analytics.soloCount} соло • {analytics.teamsCount} команд
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-surface-1 border border-borderDef flex flex-col gap-1">
                  <span className="text-xs text-textTertiary uppercase font-mono tracking-wider">Сдано игр</span>
                  <div className="text-2xl font-bold text-textPrimary font-mono">
                    {analytics.submissionsTotal}
                  </div>
                  <span className="text-[11px] text-textSecondary mt-1">
                    {analytics.submissionsApproved} одобрено • {analytics.submissionsRejected} отклонено
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-surface-1 border border-borderDef flex flex-col gap-1">
                  <span className="text-xs text-textTertiary uppercase font-mono tracking-wider">Судейство</span>
                  <div className="text-2xl font-bold text-reaction font-mono">
                    {analytics.judgingCompletedPercent}%
                  </div>
                  <div className="w-full bg-surface-2 h-1.5 rounded-full overflow-hidden mt-2">
                    <div className="bg-reaction h-full" style={{ width: `${analytics.judgingCompletedPercent}%` }} />
                  </div>
                </div>
              </div>

              {/* TRAFFIC SOURCES & DAILY TREND */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-5 rounded-xl bg-surface-1 border border-borderDef flex flex-col gap-4">
                  <h4 className="text-sm font-bold text-textPrimary flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-accent" />
                    <span>Источники трафика джема</span>
                  </h4>
                  <div className="flex flex-col gap-3">
                    {analytics.trafficSources.map((src, i) => (
                      <div key={i} className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs font-medium text-textSecondary">
                          <span>{src.name}</span>
                          <span className="font-mono text-textPrimary font-bold">{src.percent}% ({src.count.toLocaleString()})</span>
                        </div>
                        <div className="w-full bg-surface-2 h-2 rounded-full overflow-hidden">
                          <div className="bg-accent h-full rounded-full" style={{ width: `${src.percent}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-surface-1 border border-borderDef flex flex-col gap-4">
                  <h4 className="text-sm font-bold text-textPrimary flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-accent" />
                    <span>Динамика активности по дням</span>
                  </h4>
                  <div className="flex flex-col gap-2">
                    {analytics.dailyViewsHistory.map((d, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-surface-2 text-xs">
                        <span className="font-mono font-bold text-textPrimary w-16">{d.date}</span>
                        <span className="text-textSecondary">{d.views} просмотров</span>
                        <span className="text-accent font-medium">{d.registrations} рег.</span>
                        <span className="text-success font-bold font-mono">+{d.submissions} игр</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SUBMISSIONS MODERATION (FE-JORG-007, JORG-API-023, 024, AC-JORG-024, 025, 026) */}
          {activeTab === 'moderation' && (
            <div className="flex flex-col gap-4">
              {/* TOOLBAR */}
              <div className="flex items-center justify-between gap-4 p-3 bg-surface-2 border border-borderDef rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-textSecondary font-medium">Фильтр:</span>
                  {(['all', 'on_moderation', 'approved', 'rejected', 'disqualified'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setSubFilter(st)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                        subFilter === st
                          ? 'bg-accent text-white'
                          : 'bg-surface-1 text-textSecondary hover:text-textPrimary border border-borderDef'
                      }`}
                    >
                      {st === 'all' && 'Все заявки'}
                      {st === 'on_moderation' && 'На проверке'}
                      {st === 'approved' && 'Одобренные'}
                      {st === 'rejected' && 'Отклоненные'}
                      {st === 'disqualified' && 'Дисквалифицированные'}
                    </button>
                  ))}
                </div>

                <span className="text-xs text-textTertiary font-mono">
                  Показано: {filteredSubs.length} из {submissions.length}
                </span>
              </div>

              {/* LIST */}
              <div className="flex flex-col gap-3">
                {filteredSubs.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-4 bg-surface-1 border border-borderDef rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <img
                        src={sub.cover}
                        alt={sub.gameTitle}
                        className="w-20 h-14 rounded-lg object-cover border border-borderDef shrink-0"
                      />
                      <div className="min-w-0 flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-textPrimary truncate">{sub.gameTitle}</h4>
                          {sub.isOrganizerOwnGame && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-warning/10 border border-warning/30 text-warning font-bold">
                              Игра организатора (Showcase)
                            </span>
                          )}
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
                              sub.status === 'approved'
                                ? 'bg-success/10 border-success/30 text-success'
                                : sub.status === 'rejected'
                                ? 'bg-warning/10 border-warning/30 text-warning'
                                : sub.status === 'disqualified'
                                ? 'bg-danger/10 border-danger/30 text-danger'
                                : 'bg-accent/10 border-accent/30 text-accent'
                            }`}
                          >
                            {sub.status === 'approved' && 'Одобрена'}
                            {sub.status === 'rejected' && 'Отклонена'}
                            {sub.status === 'disqualified' && 'Дисквалифицирована'}
                            {sub.status === 'on_moderation' && 'Ожидает проверки'}
                          </span>
                        </div>
                        <div className="text-xs text-textSecondary flex items-center gap-3">
                          <span>Автор: <strong>{sub.author}</strong> ({sub.authorType})</span>
                          <span>•</span>
                          <span>Движок: {sub.engine}</span>
                          <span>•</span>
                          <span>Подано: {sub.submittedAt}</span>
                        </div>
                        <p className="text-[11px] text-textTertiary italic truncate">
                          Декларация: {sub.assetsDeclared}
                        </p>
                      </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      {sub.status === 'on_moderation' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleApproveSub(sub)}
                            className="px-3 py-1.5 rounded-lg bg-success/15 hover:bg-success text-success hover:text-white border border-success/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Одобрить</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenReject(sub)}
                            className="px-3 py-1.5 rounded-lg bg-warning/15 hover:bg-warning text-warning hover:text-white border border-warning/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Отклонить</span>
                          </button>
                        </>
                      )}

                      {sub.status !== 'disqualified' && (
                        <button
                          type="button"
                          onClick={() => handleOpenDisqualify(sub)}
                          className="px-3 py-1.5 rounded-lg bg-surface-2 hover:bg-danger/20 text-textTertiary hover:text-danger border border-borderDef text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                          title="Дисквалифицировать за нарушение правил"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>Дисквалификация</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: JUDGES (FE-JORG-004, JORG-API-012..017, AC-JORG-011..014) */}
          {activeTab === 'judges' && (
            <div className="flex flex-col gap-6">
              {/* INVITE FORM */}
              <div className="p-4 rounded-xl bg-surface-2 border border-borderDef flex flex-col gap-3">
                <h4 className="text-xs font-bold text-textPrimary uppercase tracking-wider flex items-center gap-2">
                  <Plus className="w-4 h-4 text-accent" />
                  <span>Пригласить эксперта в состав жюри</span>
                </h4>
                <form onSubmit={handleInviteJudge} className="flex flex-col md:flex-row gap-3 items-center">
                  <input
                    type="text"
                    value={newJudgeNick}
                    onChange={(e) => setNewJudgeNick(e.target.value)}
                    placeholder="Никнейм пользователя на HUBIGR (например, Max3D)"
                    className="flex-1 w-full bg-surface-1 border border-borderDef rounded-lg px-3 py-2 text-xs text-textPrimary focus:outline-none focus:border-accent"
                  />
                  <select
                    value={newJudgeRole}
                    onChange={(e) => setNewJudgeRole(e.target.value as any)}
                    className="w-full md:w-48 bg-surface-1 border border-borderDef rounded-lg px-3 py-2 text-xs text-textPrimary focus:outline-none focus:border-accent"
                  >
                    <option value="judge">Судья (Judge)</option>
                    <option value="head_judge">Главный судья (Head Judge)</option>
                  </select>
                  <Button variant="primary" size="sm" type="submit">
                    Отправить инвайт
                  </Button>
                </form>
              </div>

              {/* ACTIVE ASSIGNMENTS */}
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-textTertiary font-semibold">
                  Действующий судейский корпус ({judgesList.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {judgesList.map((judge) => (
                    <div
                      key={judge.id}
                      className="p-3.5 bg-surface-1 border border-borderDef rounded-xl flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={judge.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                          alt={judge.userName}
                          className="w-10 h-10 rounded-full object-cover border border-borderDef"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-textPrimary">{judge.userName}</span>
                            {judge.role === 'head_judge' && (
                              <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-reaction/15 text-reaction border border-reaction/30 font-bold">
                                Head Judge
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-textTertiary font-mono">@{judge.userNick}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-bold text-accent font-mono">
                          {judge.ratedCount} / {judge.assignedSubmissionsCount}
                        </div>
                        <span className="text-[10px] text-textTertiary">работ оценено</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* PENDING INVITATIONS */}
              {judgeInvites.length > 0 && (
                <div className="flex flex-col gap-3">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-textTertiary font-semibold">
                    Ожидают подтверждения ({judgeInvites.length})
                  </h4>
                  <div className="flex flex-col gap-2">
                    {judgeInvites.map((inv) => (
                      <div
                        key={inv.id}
                        className="p-3 bg-surface-1 border border-borderDef rounded-xl flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-textPrimary">{inv.targetUserName}</span>
                          <span className="text-textTertiary">(@{inv.targetUserNick})</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-warning/10 text-warning border border-warning/30">
                            {inv.role === 'head_judge' ? 'Head Judge • pending' : 'Judge • pending'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRevokeInvite(inv.id)}
                          className="text-xs text-danger hover:underline cursor-pointer"
                        >
                          Отозвать
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ANNOUNCEMENTS (FE-JORG-011, JORG-API-029, 030, AC-JORG-043) */}
          {activeTab === 'announcements' && (
            <div className="flex flex-col gap-6">
              {/* CREATE FORM */}
              <div className="p-4 rounded-xl bg-surface-2 border border-borderDef flex flex-col gap-3">
                <h4 className="text-xs font-bold text-textPrimary uppercase tracking-wider flex items-center gap-2">
                  <Bell className="w-4 h-4 text-accent" />
                  <span>Опубликовать официальное объявление</span>
                </h4>
                <form onSubmit={handleCreateAnnouncement} className="flex flex-col gap-3">
                  <input
                    type="text"
                    value={newAncTitle}
                    onChange={(e) => setNewAncTitle(e.target.value)}
                    placeholder="Тема анонса (например: Публикация темы хакатона)"
                    className="w-full bg-surface-1 border border-borderDef rounded-lg px-3 py-2 text-xs text-textPrimary focus:outline-none focus:border-accent"
                  />
                  <textarea
                    rows={3}
                    value={newAncContent}
                    onChange={(e) => setNewAncContent(e.target.value)}
                    placeholder="Текст сообщения для участников и подписчиков джема..."
                    className="w-full bg-surface-1 border border-borderDef rounded-lg p-3 text-xs text-textPrimary focus:outline-none focus:border-accent"
                  />
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs text-textSecondary cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newAncPinned}
                        onChange={(e) => setNewAncPinned(e.target.checked)}
                        className="rounded border-borderDef"
                      />
                      <span>Закрепить анонс в верхней части ленты</span>
                    </label>
                    <Button variant="primary" size="sm" type="submit">
                      Опубликовать анонс
                    </Button>
                  </div>
                </form>
              </div>

              {/* LIST */}
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-textTertiary font-semibold">
                  Опубликованные анонсы ({announcements.length})
                </h4>
                {announcements.map((anc) => (
                  <div
                    key={anc.id}
                    className="p-4 bg-surface-1 border border-borderDef rounded-xl flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-textPrimary">{anc.title}</h4>
                        {anc.isPinned && (
                          <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-accent/15 text-accent border border-accent/30 font-bold">
                            Закреплено
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-textTertiary font-mono">
                        {new Date(anc.publishedAt).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                    <p className="text-xs text-textSecondary whitespace-pre-wrap leading-relaxed">
                      {anc.contentMd}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: PARTNERS (FE-JORG-003, JORG-API-031, 032, AC-JORG-034, 035) */}
          {activeTab === 'partners' && (
            <div className="flex flex-col gap-6">
              {/* FORM */}
              <div className="p-4 rounded-xl bg-surface-2 border border-borderDef flex flex-col gap-3">
                <h4 className="text-xs font-bold text-textPrimary uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span>Предложить партнера или спонсора</span>
                </h4>
                <form onSubmit={handleProposePartner} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={newPartName}
                    onChange={(e) => setNewPartName(e.target.value)}
                    placeholder="Название компании / сообщества"
                    className="bg-surface-1 border border-borderDef rounded-lg px-3 py-2 text-xs text-textPrimary focus:outline-none focus:border-accent"
                  />
                  <input
                    type="text"
                    value={newPartRole}
                    onChange={(e) => setNewPartRole(e.target.value)}
                    placeholder="Роль (например: Технологический партнер)"
                    className="bg-surface-1 border border-borderDef rounded-lg px-3 py-2 text-xs text-textPrimary focus:outline-none focus:border-accent"
                  />
                  <input
                    type="url"
                    value={newPartUrl}
                    onChange={(e) => setNewPartUrl(e.target.value)}
                    placeholder="https://partner-website.com"
                    className="bg-surface-1 border border-borderDef rounded-lg px-3 py-2 text-xs text-textPrimary focus:outline-none focus:border-accent"
                  />
                  <div className="md:col-span-3 flex justify-end">
                    <Button variant="primary" size="sm" type="submit">
                      Добавить партнера
                    </Button>
                  </div>
                </form>
              </div>

              {/* LIST */}
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-textTertiary font-semibold">
                  Список партнеров ({partners.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {partners.map((p) => (
                    <div
                      key={p.id}
                      className="p-3.5 bg-surface-1 border border-borderDef rounded-xl flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-surface-2 border border-borderDef flex items-center justify-center text-accent font-bold">
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-textPrimary">{p.name}</span>
                            <span
                              className={`text-[10px] font-mono px-2 py-0.2 rounded font-bold border ${
                                p.verificationStatus === 'verified'
                                  ? 'bg-success/10 border-success/30 text-success'
                                  : 'bg-warning/10 border-warning/30 text-warning'
                              }`}
                            >
                              {p.verificationStatus === 'verified' ? 'Verified Partner' : 'На проверке'}
                            </span>
                          </div>
                          <span className="text-[11px] text-textTertiary">{p.roleDescription}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: PRIZES (FE-JORG-003, JORG-API-033, AC-JORG-036, 037) */}
          {activeTab === 'prizes' && (
            <div className="flex flex-col gap-6">
              {/* FORM */}
              <div className="p-4 rounded-xl bg-surface-2 border border-borderDef flex flex-col gap-3">
                <h4 className="text-xs font-bold text-textPrimary uppercase tracking-wider flex items-center gap-2">
                  <Gift className="w-4 h-4 text-accent" />
                  <span>Добавить приз в фонд джема</span>
                </h4>
                <form onSubmit={handleAddPrize} className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <input
                    type="text"
                    value={newPrizeTitle}
                    onChange={(e) => setNewPrizeTitle(e.target.value)}
                    placeholder="Название приза (например: 1 место)"
                    className="bg-surface-1 border border-borderDef rounded-lg px-3 py-2 text-xs text-textPrimary focus:outline-none focus:border-accent"
                  />
                  <input
                    type="text"
                    value={newPrizeAmount}
                    onChange={(e) => setNewPrizeAmount(e.target.value)}
                    placeholder="Сумма / Описание награды"
                    className="bg-surface-1 border border-borderDef rounded-lg px-3 py-2 text-xs text-textPrimary focus:outline-none focus:border-accent"
                  />
                  <select
                    value={newPrizeType}
                    onChange={(e) => setNewPrizeType(e.target.value as any)}
                    className="bg-surface-1 border border-borderDef rounded-lg px-3 py-2 text-xs text-textPrimary focus:outline-none focus:border-accent"
                  >
                    <option value="money">Денежный приз (Money)</option>
                    <option value="license">Лицензия / ПО (License)</option>
                    <option value="physical">Физический мерч (Physical)</option>
                    <option value="service">Сервис / Подписка (Service)</option>
                  </select>
                  <input
                    type="text"
                    value={newPrizeProvider}
                    onChange={(e) => setNewPrizeProvider(e.target.value)}
                    placeholder="Предоставитель (Оргкомитет / Спонсор)"
                    className="bg-surface-1 border border-borderDef rounded-lg px-3 py-2 text-xs text-textPrimary focus:outline-none focus:border-accent"
                  />
                  <div className="md:col-span-4 flex justify-between items-center pt-1">
                    <span className="text-[11px] text-textTertiary">
                      * Внимание: уменьшение заявленного призового фонда после старта требует согласования с администрацией.
                    </span>
                    <Button variant="primary" size="sm" type="submit">
                      Добавить награду
                    </Button>
                  </div>
                </form>
              </div>

              {/* LIST */}
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-textTertiary font-semibold">
                  Структура наград ({prizes.length})
                </h4>
                <div className="flex flex-col gap-2.5">
                  {prizes.map((prz) => (
                    <div
                      key={prz.id}
                      className="p-3.5 bg-surface-1 border border-borderDef rounded-xl flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-textPrimary">{prz.title}</span>
                          {prz.amount && (
                            <span className="text-xs font-mono font-bold text-accent">
                              {prz.amount} {prz.currency}
                            </span>
                          )}
                          <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-surface-2 border border-borderDef text-textSecondary">
                            {prz.type}
                          </span>
                        </div>
                        <span className="text-[11px] text-textTertiary">
                          Предоставитель: {prz.provider} • Статус обязательства: {prz.fulfillmentStatus}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-success/10 text-success border border-success/30 font-bold">
                        Подтверждено
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: RULES VERSIONS (FE-JORG-003, JORG-API-028, AC-JORG-008) */}
          {activeTab === 'rules' && (
            <div className="flex flex-col gap-6">
              {/* FORM */}
              <div className="p-4 rounded-xl bg-surface-2 border border-borderDef flex flex-col gap-3">
                <h4 className="text-xs font-bold text-textPrimary uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-accent" />
                  <span>Внести правки в правила (Material Change)</span>
                </h4>
                <form onSubmit={handleAddRuleVersion} className="flex flex-col gap-3">
                  <textarea
                    rows={4}
                    value={newRuleText}
                    onChange={(e) => setNewRuleText(e.target.value)}
                    placeholder="Полный актуализированный текст правил джема..."
                    className="w-full bg-surface-1 border border-borderDef rounded-lg p-3 text-xs text-textPrimary focus:outline-none focus:border-accent"
                  />
                  <input
                    type="text"
                    value={newRuleReason}
                    onChange={(e) => setNewRuleReason(e.target.value)}
                    placeholder="Причина изменений (например: Продление дедлайна на 24 часа по просьбам участников)"
                    className="w-full bg-surface-1 border border-borderDef rounded-lg px-3 py-2 text-xs text-textPrimary focus:outline-none focus:border-accent"
                  />
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-warning flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Существенные изменения правил отправляются на повторное ревью администрации платформы.
                    </span>
                    <Button variant="primary" size="sm" type="submit">
                      Отправить на модерацию
                    </Button>
                  </div>
                </form>
              </div>

              {/* LIST */}
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-textTertiary font-semibold">
                  История версий правил ({ruleVersions.length})
                </h4>
                {ruleVersions.map((rv) => (
                  <div
                    key={rv.id}
                    className="p-4 bg-surface-1 border border-borderDef rounded-xl flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-textPrimary font-mono">Версия {rv.versionNumber}</span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.2 rounded border font-semibold ${
                            rv.moderationStatus === 'approved'
                              ? 'bg-success/10 border-success/30 text-success'
                              : 'bg-warning/10 border-warning/30 text-warning'
                          }`}
                        >
                          {rv.moderationStatus === 'approved' ? 'Действующая' : 'На проверке'}
                        </span>
                      </div>
                      <span className="text-[11px] text-textTertiary font-mono">
                        {new Date(rv.effectiveAt).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                    {rv.changeReason && (
                      <p className="text-xs text-textSecondary italic">
                        Причина: {rv.changeReason}
                      </p>
                    )}
                    <p className="text-xs text-textTertiary font-mono bg-surface-2 p-2.5 rounded-lg whitespace-pre-wrap">
                      {rv.rulesMd}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* REJECT SUBMISSION MODAL */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Отклонить заявку на участие"
        subtitle="Укажите замечания модератора"
        maxWidth="md"
      >
        <div className="flex flex-col gap-4">
          <p className="text-xs text-textSecondary leading-relaxed">
            Автор получит уведомление с замечаниями и сможет исправить билд или описание работы до дедлайна.
          </p>
          <textarea
            rows={4}
            value={actionReason}
            onChange={(e) => setActionReason(e.target.value)}
            placeholder="Опишите причину отклонения (например: поврежден архив сборки, отсутствует WebGL билд)..."
            className="w-full bg-surface-1 border border-borderDef rounded-lg p-3 text-xs text-textPrimary focus:outline-none focus:border-accent"
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={() => setRejectModalOpen(false)}>
              Отмена
            </Button>
            <Button variant="danger" size="sm" onClick={handleConfirmReject}>
              Подтвердить отклонение
            </Button>
          </div>
        </div>
      </Modal>

      {/* DISQUALIFY SUBMISSION MODAL */}
      <Modal
        isOpen={disqualifyModalOpen}
        onClose={() => setDisqualifyModalOpen(false)}
        title="Дисквалификация работы из джема"
        subtitle="Фиксация нарушения регламента соревнований"
        maxWidth="md"
      >
        <div className="flex flex-col gap-4">
          <div className="p-3 bg-danger/10 border border-danger/25 rounded-xl flex items-start gap-2.5 text-xs text-danger leading-normal">
            <AlertOctagon className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Дисквалификация исключает работу из судейского зачета джема. Решение действует строго в рамках данного джема и не затрагивает статус игры на витрине платформы.
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-textSecondary">Причина дисквалификации:</label>
            <input
              type="text"
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              placeholder="Например: использование готового прототипа 2024 года"
              className="w-full bg-surface-1 border border-borderDef rounded-lg px-3 py-2 text-xs text-textPrimary focus:outline-none focus:border-accent"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-textSecondary">Доказательства (ссылки, аудит коммитов):</label>
            <textarea
              rows={3}
              value={actionEvidence}
              onChange={(e) => setActionEvidence(e.target.value)}
              placeholder="Ссылки на публичные репозитории, даты заливки файлов..."
              className="w-full bg-surface-1 border border-borderDef rounded-lg p-3 text-xs text-textPrimary focus:outline-none focus:border-accent"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={() => setDisqualifyModalOpen(false)}>
              Отмена
            </Button>
            <Button variant="danger" size="sm" onClick={handleConfirmDisqualify}>
              Применить дисквалификацию
            </Button>
          </div>
        </div>
      </Modal>
    </Modal>
  );
};

export default JamOrganizerWorkspace;
