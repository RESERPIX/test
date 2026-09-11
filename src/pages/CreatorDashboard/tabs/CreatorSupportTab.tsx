import React, { useState, useEffect } from 'react';
import {
  Mail,
  MessageSquare,
  Globe,
  Heart,
  MousePointerClick,
  ToggleLeft,
  ToggleRight,
  Save,
  Plus,
  Trash2,
  Lock,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Building,
  Check,
  Briefcase,
  ArrowUp,
  ArrowDown,
  Edit3,
  BarChart3,
  Coins,
  CreditCard,
  Sparkles,
  Info,
  Clock,
  HelpCircle,
  X
} from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import {
  CreatorSupportLink,
  SupportLinkProvider,
  SupportSubjectType,
  SupportStatsSummary
} from '../../../types/creatorSupport';
import {
  creatorSupportService,
  PROVIDER_METADATA
} from '../../../services/creatorSupportService';

interface CreatorSupportTabProps {
  scopeInfo: any;
  scope?: string;
  triggerToast: (msg: string, type?: string) => void;
}

export const CreatorSupportTab: React.FC<CreatorSupportTabProps> = ({
  scopeInfo,
  scope = 'personal',
  triggerToast
}) => {
  // Determine subject type and ID from current dashboard scope
  const isTeam = scope.startsWith('team_');
  const subjectType: SupportSubjectType = isTeam ? 'team' : 'user';
  const subjectId = isTeam ? (scope === 'team_nocturnal' ? 'team_1' : scope) : 'u_nocturnal';

  // Contacts State (Separate from support links, BR-CSP-004)
  const [acceptRequests, setAcceptRequests] = useState(true);
  const [contacts, setContacts] = useState({
    email: 'hello@nocturnal.games',
    telegram: '@nocturnal_biz',
    discord: 'NocturnalDevs#1234',
    website: 'https://nocturnal.games'
  });

  // Support Links State
  const [supportLinks, setSupportLinks] = useState<CreatorSupportLink[]>([]);
  const [stats, setStats] = useState<SupportStatsSummary | null>(null);

  // Modal States: Add / Edit Link
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<CreatorSupportLink | null>(null);
  const [modalProvider, setModalProvider] = useState<SupportLinkProvider>('boosty');
  const [modalUrl, setModalUrl] = useState('');
  const [modalLabel, setModalLabel] = useState('');
  const [urlValidationError, setUrlValidationError] = useState<string | null>(null);

  // Modal State: Delete Confirmation
  const [deletingLink, setDeletingLink] = useState<CreatorSupportLink | null>(null);

  // Business Requests Inbox State
  const [businessRequests] = useState([
    {
      id: 'req_1',
      from: 'Epic Games Publishing',
      subject: 'Предложение об издательстве Neon Odyssey',
      date: 'Сегодня, 14:30',
      status: 'new'
    },
    {
      id: 'req_2',
      from: 'Indie Bundle Co',
      subject: 'Участие в летнем бандле',
      date: 'Вчера, 09:15',
      status: 'read'
    }
  ]);

  // Load links and statistics from service
  const reloadData = () => {
    const links = creatorSupportService.getManageableLinks(subjectType, subjectId);
    setSupportLinks(links);
    const summary = creatorSupportService.getStats(subjectType, subjectId);
    setStats(summary);
  };

  useEffect(() => {
    reloadData();
  }, [subjectType, subjectId]);

  // Permission check: team.manage_support (AC-CSP-002, BR-CSP-014)
  if (!scopeInfo.canManageSupport) {
    return (
      <div className="bg-surface-2 border border-borderDef rounded-xl p-12 text-center flex flex-col items-center gap-5 my-6 animate-fadeIn">
        <div className="w-16 h-16 rounded-full bg-danger/10 border border-danger/30 flex items-center justify-center text-danger">
          <Lock className="w-8 h-8 stroke-[1.5]" />
        </div>
        <div className="flex flex-col gap-2 max-w-[480px]">
          <h3 className="text-xl font-bold text-textPrimary">Управление контактами ограничено</h3>
          <p className="text-xs text-textSecondary leading-relaxed">
            У вас недостаточно прав (<code className="text-accent font-mono font-bold">team.manage_support</code>) для редактирования контактов и ссылок поддержки данной команды.
          </p>
        </div>
      </div>
    );
  }

  // --- HANDLERS: CONTACTS ---
  const handleSaveContacts = () => {
    triggerToast('Деловые контакты успешно обновлены и отображаются в публичном профиле', 'success');
  };

  // --- HANDLERS: MODAL OPEN / CLOSE ---
  const handleOpenAddModal = () => {
    setEditingLink(null);
    setModalProvider('boosty');
    setModalUrl('');
    setModalLabel('');
    setUrlValidationError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (link: CreatorSupportLink) => {
    setEditingLink(link);
    setModalProvider(link.provider);
    setModalUrl(link.urlCanonical);
    setModalLabel(link.label);
    setUrlValidationError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLink(null);
  };

  // --- HANDLERS: URL INPUT CHANGE ---
  const handleUrlChange = (val: string) => {
    setModalUrl(val);
    if (!val.trim()) {
      setUrlValidationError(null);
      return;
    }
    const res = creatorSupportService.validateUrl(val);
    if (!res.isValid) {
      setUrlValidationError(res.error || 'Некорректный URL');
    } else {
      setUrlValidationError(null);
      // Auto-detect provider if currently set to custom or default
      const detected = creatorSupportService.detectProvider(res.normalizedUrl);
      if (detected !== 'custom') {
        setModalProvider(detected);
      }
    }
  };

  // --- HANDLERS: SAVE LINK (CREATE / UPDATE) ---
  const handleSaveLink = () => {
    const valResult = creatorSupportService.validateUrl(modalUrl);
    if (!valResult.isValid) {
      setUrlValidationError(valResult.error || 'Пожалуйста, введите корректный URL');
      return;
    }

    if (editingLink) {
      // Update link (AC-CSP-006)
      const res = creatorSupportService.updateLink(editingLink.id, {
        url: valResult.normalizedUrl,
        label: modalLabel || undefined,
        provider: modalProvider
      });

      if (res.error) {
        triggerToast(res.error, 'danger');
        return;
      }

      if (res.link?.state === 'pending_review') {
        triggerToast('Ссылка обновлена и направлена на проверку безопасности', 'warning');
      } else {
        triggerToast('Ссылка успешно обновлена', 'success');
      }
    } else {
      // Create link (AC-CSP-001, AC-CSP-003)
      const res = creatorSupportService.addLink(
        subjectType,
        subjectId,
        valResult.normalizedUrl,
        modalLabel || undefined,
        modalProvider
      );

      if (res.error) {
        triggerToast(res.error, 'danger');
        return;
      }

      if (res.link?.state === 'pending_review') {
        triggerToast('Ссылка создана и отправлена на проверку модератором', 'warning');
      } else {
        triggerToast('Новая ссылка на поддержку успешно добавлена', 'success');
      }
    }

    handleCloseModal();
    reloadData();
  };

  // --- HANDLERS: TOGGLE ENABLED (AC-CSP-015, BR-CSP-026) ---
  const handleToggleEnabled = (link: CreatorSupportLink) => {
    const res = creatorSupportService.updateLink(link.id, {
      enabled: !link.enabled
    });
    if (res.link) {
      triggerToast(
        res.link.enabled ? `Ссылка «${res.link.label}» активирована` : `Ссылка «${res.link.label}» скрыта`,
        'info'
      );
      reloadData();
    }
  };

  // --- HANDLERS: REORDER (AC-CSP-016, BR-CSP-029) ---
  const handleMoveOrder = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= supportLinks.length) return;

    const newOrder = [...supportLinks];
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;

    const orderedIds = newOrder.map((l) => l.id);
    creatorSupportService.reorderLinks(subjectType, subjectId, orderedIds);
    reloadData();
    triggerToast('Порядок отображения ссылок обновлен', 'success');
  };

  // --- HANDLERS: SOFT REMOVAL (AC-CSP-017, BR-CSP-027) ---
  const handleConfirmDelete = () => {
    if (!deletingLink) return;
    creatorSupportService.softRemoveLink(deletingLink.id);
    triggerToast(`Ссылка «${deletingLink.label}» удалена`, 'info');
    setDeletingLink(null);
    reloadData();
  };

  const getProviderIcon = (provider: SupportLinkProvider) => {
    switch (provider) {
      case 'boosty':
        return <Coins className="w-5 h-5 text-[#f05a22]" />;
      case 'donationalerts':
        return <Heart className="w-5 h-5 text-[#f58220]" />;
      case 'yoomoney':
        return <CreditCard className="w-5 h-5 text-[#8b5cf6]" />;
      case 'cloudtips':
        return <Sparkles className="w-5 h-5 text-[#0ea5e9]" />;
      case 'patreon':
        return <Heart className="w-5 h-5 text-[#ff424d]" />;
      default:
        return <Globe className="w-5 h-5 text-accent" />;
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-fadeIn">
      {/* 1. TOP BANNER: ZERO ESCROW & SAFE REDIRECT (BR-CSP-001, AC-CSP-016) */}
      <div className="p-5 rounded-card bg-surface-1 border border-borderDef flex items-start justify-between gap-4 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-body-md font-bold text-textPrimary">
              Внешняя поддержка авторов (0% комиссии платформы)
            </h3>
            <p className="text-caption text-textSecondary mt-1 leading-relaxed max-w-3xl">
              HUBIGR не удерживает платежей во внутренний кошелек. Укажите ваши прямые страницы на верифицированных сервисах (Boosty, DonationAlerts, ЮMoney, CloudTips, Patreon). Все переходы защищены проверкой безопасности HUBIGR Safe Redirect.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleOpenAddModal}
          className="h-10 px-4 bg-accent hover:bg-accent-hover text-white text-xs font-bold rounded-md flex items-center gap-2 transition-all shrink-0 cursor-pointer shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4" /> Добавить ссылку
        </button>
      </div>

      {/* 2. CLICK ANALYTICS WIDGET (FE-CSP-007, FR-CSP-046, AC-CSP-012, AC-CSP-029, AC-CSP-030) */}
      {stats && (
        <section className="bg-surface-1 border border-borderDef rounded-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-accent" />
              <h3 className="text-body-md font-bold text-textPrimary">
                Аналитика переходов по ссылкам поддержки
              </h3>
            </div>
            <span className="text-[11px] font-mono text-textTertiary">
              Агрегированные данные за 30 дней
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-surface-2/60 border border-borderDef/60 flex flex-col gap-1">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-textSecondary">
                Всего переходов
              </span>
              <div className="text-2xl font-bold font-mono text-textPrimary flex items-center gap-2">
                <MousePointerClick className="w-5 h-5 text-accent" />
                {stats.totalClicks.toLocaleString()}
              </div>
              <span className="text-[11px] text-textTertiary mt-0.5">Со всех страниц и карточек</span>
            </div>

            <div className="p-4 rounded-xl bg-surface-2/60 border border-borderDef/60 flex flex-col gap-1">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-textSecondary">
                Со страниц игр
              </span>
              <div className="text-2xl font-bold font-mono text-textPrimary flex items-center gap-2">
                <Globe className="w-5 h-5 text-success" />
                {stats.byContext.game.toLocaleString()}
              </div>
              <span className="text-[11px] text-textTertiary mt-0.5">Шторка «Поддержать автора»</span>
            </div>

            <div className="p-4 rounded-xl bg-surface-2/60 border border-borderDef/60 flex flex-col gap-1">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-textSecondary">
                Из профиля автора
              </span>
              <div className="text-2xl font-bold font-mono text-textPrimary flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-info" />
                {stats.byContext.profile.toLocaleString()}
              </div>
              <span className="text-[11px] text-textTertiary mt-0.5">Публичная визитка</span>
            </div>

            <div className="p-4 rounded-xl bg-surface-2/60 border border-borderDef/60 flex flex-col gap-1">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-textSecondary">
                Команда и джемы
              </span>
              <div className="text-2xl font-bold font-mono text-textPrimary flex items-center gap-2">
                <Building className="w-5 h-5 text-warning" />
                {(stats.byContext.team + stats.byContext.jam).toLocaleString()}
              </div>
              <span className="text-[11px] text-textTertiary mt-0.5">Командные страницы</span>
            </div>
          </div>

          {/* 7-DAY TIMELINE SPARKLINE */}
          <div className="mt-6 pt-5 border-t border-borderDef/60 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-textSecondary">Динамика кликов за последние 7 дней</span>
              <span className="text-[11px] font-mono text-textTertiary flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-textTertiary" />
                Приватность игроков защищена (персональные данные не собираются)
              </span>
            </div>

            <div className="grid grid-cols-7 gap-2 items-end h-16 pt-2">
              {stats.history.map((day, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end">
                  <div
                    className="w-full bg-accent/30 hover:bg-accent rounded-t transition-colors cursor-pointer group relative"
                    style={{ height: `${Math.max(15, Math.min(100, (day.clicks / 15) * 100))}%` }}
                    title={`${day.date}: ${day.clicks} переходов`}
                  >
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-surface-0 border border-borderDef text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      {day.clicks} кликов
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-textTertiary truncate w-full text-center">
                    {day.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. MAIN SECTION: LINKS LIST & CONTACTS */}
      <div className="flex flex-col xl:flex-row gap-8">
        {/* LEFT COLUMN: SUPPORT LINKS CRUD (FE-CSP-001, FE-CSP-006, FE-CSP-008) */}
        <div className="flex-1 flex flex-col gap-6">
          <section className="bg-surface-1 border border-borderDef rounded-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-body-lg font-bold text-textPrimary flex items-center gap-2">
                  <Heart className="w-5 h-5 text-reaction" /> Ссылки поддержки проекта
                </h3>
                <p className="text-xs text-textSecondary mt-1">
                  Активные ссылки отображаются в играх и профиле ({isTeam ? 'Команда' : 'Автор'}).
                </p>
              </div>
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="h-9 px-4 bg-surface-2 hover:bg-surface-3 border border-borderDef text-xs font-semibold text-textPrimary rounded-md flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Добавить
              </button>
            </div>

            {/* LINKS LIST */}
            {supportLinks.length > 0 ? (
              <div className="flex flex-col gap-3.5">
                {supportLinks.map((link, index) => {
                  const meta = PROVIDER_METADATA[link.provider] || PROVIDER_METADATA.custom;
                  const isFirst = index === 0;
                  const isLast = index === supportLinks.length - 1;

                  return (
                    <div
                      key={link.id}
                      className={`p-4 border rounded-xl transition-colors flex flex-col gap-3 ${
                        link.state === 'blocked'
                          ? 'bg-danger/5 border-danger/30'
                          : link.state === 'pending_review'
                          ? 'bg-warning/5 border-warning/30'
                          : !link.enabled
                          ? 'bg-surface-2/40 border-borderDef/60 opacity-75'
                          : 'bg-surface-2/60 hover:bg-surface-2 border-borderDef'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5 min-w-0">
                          {/* Provider Icon */}
                          <div className="w-11 h-11 rounded-xl bg-surface-1 border border-borderDef flex items-center justify-center shrink-0">
                            {getProviderIcon(link.provider)}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm font-bold text-textPrimary truncate">
                                {link.label || meta.name}
                              </h4>

                              {/* State Badges (FE-CSP-006, FE-CSP-008) */}
                              {link.state === 'active' && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-success/15 text-success border border-success/30 flex items-center gap-1">
                                  <ShieldCheck className="w-3 h-3" /> Активна
                                </span>
                              )}
                              {link.state === 'pending_review' && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-warning/15 text-warning border border-warning/30 flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> На проверке
                                </span>
                              )}
                              {link.state === 'blocked' && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-danger/15 text-danger border border-danger/30 flex items-center gap-1">
                                  <ShieldAlert className="w-3 h-3" /> Заблокирована
                                </span>
                              )}

                              {!link.enabled && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-surface-3 text-textTertiary">
                                  Выключена
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 text-xs text-textSecondary mt-0.5 truncate">
                              <span className="font-mono text-textTertiary truncate">{link.urlCanonical}</span>
                              <a
                                href={link.urlCanonical}
                                target="_blank"
                                rel="noreferrer"
                                className="text-textTertiary hover:text-accent shrink-0 transition-colors"
                                title="Проверить ссылку"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>
                        </div>

                        {/* Actions & Controls */}
                        <div className="flex items-center gap-3 shrink-0">
                          {/* Clicks count */}
                          <div className="hidden sm:flex flex-col items-end pr-2">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-textTertiary font-semibold">
                              Клики
                            </span>
                            <span className="text-xs font-mono font-bold text-textPrimary flex items-center gap-1">
                              <MousePointerClick className="w-3 h-3 text-textTertiary" />
                              {(link.clicksCount || 0).toLocaleString()}
                            </span>
                          </div>

                          {/* Reorder Buttons (AC-CSP-016) */}
                          <div className="flex flex-col border border-borderDef rounded-lg overflow-hidden bg-surface-1">
                            <button
                              type="button"
                              onClick={() => handleMoveOrder(index, 'up')}
                              disabled={isFirst}
                              className="p-1 hover:bg-surface-2 text-textTertiary hover:text-textPrimary disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
                              title="Переместить выше"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveOrder(index, 'down')}
                              disabled={isLast}
                              className="p-1 hover:bg-surface-2 text-textTertiary hover:text-textPrimary disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer border-t border-borderDef"
                              title="Переместить ниже"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Toggle Switch (AC-CSP-015) */}
                          <button
                            type="button"
                            onClick={() => handleToggleEnabled(link)}
                            className="p-1.5 text-textSecondary hover:text-textPrimary transition-colors cursor-pointer"
                            title={link.enabled ? 'Скрыть ссылку' : 'Включить ссылку'}
                          >
                            {link.enabled ? (
                              <ToggleRight className="w-7 h-7 text-success transition-transform active:scale-95" />
                            ) : (
                              <ToggleLeft className="w-7 h-7 text-textTertiary transition-transform active:scale-95" />
                            )}
                          </button>

                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(link)}
                            className="p-2 text-textTertiary hover:text-textPrimary hover:bg-surface-3 rounded-lg transition-colors cursor-pointer"
                            title="Редактировать ссылку"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Delete Button (AC-CSP-017) */}
                          <button
                            type="button"
                            onClick={() => setDeletingLink(link)}
                            className="p-2 text-textTertiary hover:text-danger hover:bg-danger/10 rounded-lg transition-colors cursor-pointer"
                            title="Удалить ссылку"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Moderation Warning / Block Reason Banner (FE-CSP-008, BR-CSP-010) */}
                      {link.state === 'blocked' && (
                        <div className="p-3 bg-danger/10 border border-danger/25 rounded-lg flex items-start gap-2.5 text-xs text-danger font-sans">
                          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <span className="font-bold">Ссылка заблокирована службой безопасности:</span>{' '}
                            <span>{link.moderationReason || 'Нарушение правил безопасных внешних ссылок'}</span>
                            <div className="text-[11px] text-danger/80 mt-1">
                              Отредактируйте целевой URL, чтобы отправить ссылку на повторную модерацию.
                            </div>
                          </div>
                        </div>
                      )}

                      {link.state === 'pending_review' && (
                        <div className="p-3 bg-warning/10 border border-warning/25 rounded-lg flex items-start gap-2.5 text-xs text-warning font-sans">
                          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <span className="font-bold">Ссылка ожидает проверки модератором:</span>{' '}
                            <span>
                              {link.moderationReason ||
                                'Нестандартный домен направлен на автоматическую и ручную проверку безопасности.'}
                            </span>
                            <div className="text-[11px] text-warning/80 mt-0.5">
                              До подтверждения ссылка скрыта на публичных страницах игры и профиля.
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-10 border border-dashed border-borderDef rounded-xl text-center flex flex-col items-center gap-3">
                <Heart className="w-8 h-8 text-textTertiary" />
                <div className="flex flex-col gap-1">
                  <h4 className="text-sm font-bold text-textPrimary">Ссылки поддержки пока не добавлены</h4>
                  <p className="text-xs text-textSecondary max-w-sm">
                    Добавьте ссылки на Boosty, DonationAlerts, ЮMoney или CloudTips, чтобы игроки могли поддержать ваше творчество.
                  </p>
                </div>
                <Button variant="primary" size="sm" onClick={handleOpenAddModal} icon={<Plus className="w-3.5 h-3.5" />}>
                  Добавить первую ссылку
                </Button>
              </div>
            )}
          </section>

          {/* PUBLIC BUSINESS CONTACTS (FE-CSP-009, BR-CSP-004) */}
          <section className="bg-surface-1 border border-borderDef rounded-card p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h3 className="text-body-lg font-bold text-textPrimary flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-accent" /> Деловые контакты
                </h3>
                <p className="text-xs text-textSecondary mt-1">
                  Контакты для предложений об издательстве, локализации и коммерческом сотрудничестве. Не используются для сбора донатов.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAcceptRequests(!acceptRequests)}
                className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none group"
              >
                <span className={acceptRequests ? 'text-textPrimary' : 'text-textSecondary'}>
                  Принимать предложения
                </span>
                {acceptRequests ? (
                  <ToggleRight className="w-8 h-8 text-success transition-transform group-active:scale-95" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-textTertiary transition-transform group-active:scale-95" />
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-textSecondary flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> Email
                </label>
                <input
                  type="email"
                  value={contacts.email}
                  onChange={(e) => setContacts({ ...contacts, email: e.target.value })}
                  className="h-10 bg-surface-2 border border-borderDef focus:border-accent text-sm px-3 rounded-md outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-textSecondary flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" /> Telegram
                </label>
                <input
                  type="text"
                  value={contacts.telegram}
                  onChange={(e) => setContacts({ ...contacts, telegram: e.target.value })}
                  className="h-10 bg-surface-2 border border-borderDef focus:border-accent text-sm px-3 rounded-md outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-textSecondary flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" /> Discord
                </label>
                <input
                  type="text"
                  value={contacts.discord}
                  onChange={(e) => setContacts({ ...contacts, discord: e.target.value })}
                  className="h-10 bg-surface-2 border border-borderDef focus:border-accent text-sm px-3 rounded-md outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-textSecondary flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" /> Вебсайт
                </label>
                <input
                  type="url"
                  value={contacts.website}
                  onChange={(e) => setContacts({ ...contacts, website: e.target.value })}
                  className="h-10 bg-surface-2 border border-borderDef focus:border-accent text-sm px-3 rounded-md outline-none transition-colors"
                />
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-borderDef flex justify-end">
              <button
                type="button"
                onClick={handleSaveContacts}
                className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-white text-xs font-bold rounded-md flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
              >
                <Save className="w-4 h-4" /> Сохранить контакты
              </button>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Business Requests Inbox */}
        <aside className="w-full xl:w-[400px] shrink-0">
          <div className="bg-surface-1 border border-borderDef rounded-card shadow-sm overflow-hidden flex flex-col h-[520px]">
            <div className="p-5 border-b border-borderDef bg-surface-2/30">
              <h3 className="text-body-lg font-bold text-textPrimary flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-info" /> Деловые запросы
                </span>
                {businessRequests.filter((r) => r.status === 'new').length > 0 && (
                  <span className="px-2 py-0.5 bg-info/10 text-info text-[10px] font-mono font-bold uppercase tracking-wider rounded border border-info/30">
                    {businessRequests.filter((r) => r.status === 'new').length} новых
                  </span>
                )}
              </h3>
              <p className="text-xs text-textSecondary mt-1">Входящие предложения от издателей и партнёров</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {acceptRequests ? (
                businessRequests.length > 0 ? (
                  businessRequests.map((req) => (
                    <div
                      key={req.id}
                      onClick={() => triggerToast(`Открыт запрос от ${req.from}`)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        req.status === 'new'
                          ? 'bg-info/5 border-info/30 hover:bg-info/10'
                          : 'bg-surface-2 border-borderDef hover:border-surface-3'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-textSecondary">
                          {req.date}
                        </span>
                        {req.status === 'new' && <span className="w-2 h-2 rounded-full bg-info" />}
                      </div>
                      <h4
                        className={`text-sm mb-1 ${
                          req.status === 'new' ? 'font-bold text-textPrimary' : 'font-semibold text-textSecondary'
                        }`}
                      >
                        {req.from}
                      </h4>
                      <p className="text-xs text-textPrimary leading-snug">{req.subject}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 px-6 flex flex-col items-center gap-3">
                    <Check className="w-8 h-8 text-success" />
                    <span className="text-sm text-textSecondary">Новых запросов пока нет</span>
                  </div>
                )
              ) : (
                <div className="text-center py-12 px-6 flex flex-col items-center gap-3">
                  <AlertTriangle className="w-8 h-8 text-warning" />
                  <span className="text-sm font-semibold text-textPrimary">Запросы отключены</span>
                  <p className="text-xs text-textSecondary">
                    Включите «Принимать предложения», чтобы получать входящие сообщения от других пользователей.
                  </p>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* ================= MODAL: ADD / EDIT SUPPORT LINK (AC-CSP-001, AC-CSP-003, AC-CSP-006) ================= */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingLink ? 'Редактирование ссылки на поддержку' : 'Добавить ссылку на поддержку'}
          subtitle="Настройка внешнего сервиса донатов для игр и профиля"
          icon={<Heart className="w-5 h-5 text-reaction" />}
          maxWidth="md"
        >
          <div className="flex flex-col gap-5 select-none pt-1">
            {/* PROVIDER SELECTOR */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-textSecondary">
                Платформа / Сервис
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    'boosty',
                    'donationalerts',
                    'yoomoney',
                    'cloudtips',
                    'patreon',
                    'custom'
                  ] as SupportLinkProvider[]
                ).map((prov) => {
                  const meta = PROVIDER_METADATA[prov];
                  const isSelected = modalProvider === prov;
                  return (
                    <button
                      key={prov}
                      type="button"
                      onClick={() => {
                        setModalProvider(prov);
                        if (!modalLabel || prov !== 'custom') {
                          setModalLabel(meta.name);
                        }
                      }}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-accent bg-accent/10 text-accent font-semibold shadow-sm'
                          : 'border-borderDef bg-surface-2 text-textSecondary hover:text-textPrimary hover:bg-surface-3'
                      }`}
                    >
                      <div className="shrink-0">{getProviderIcon(prov)}</div>
                      <span className="text-xs font-medium truncate">{meta.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TARGET URL INPUT */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-textSecondary flex items-center justify-between">
                <span>Целевой URL ссылки</span>
                <span className="text-textTertiary font-normal normal-case">https://</span>
              </label>
              <input
                type="text"
                value={modalUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder={
                  modalProvider === 'boosty'
                    ? 'https://boosty.to/your_channel'
                    : modalProvider === 'donationalerts'
                    ? 'https://donationalerts.com/r/your_name'
                    : modalProvider === 'yoomoney'
                    ? 'https://yoomoney.ru/to/41001...'
                    : modalProvider === 'cloudtips'
                    ? 'https://pay.cloudtips.ru/p/...'
                    : 'https://example.com/donate'
                }
                className={`h-11 bg-surface-2 border text-sm px-3 rounded-xl outline-none font-mono transition-colors ${
                  urlValidationError ? 'border-danger focus:border-danger' : 'border-borderDef focus:border-accent'
                }`}
              />
              {urlValidationError ? (
                <span className="text-xs text-danger font-sans">{urlValidationError}</span>
              ) : (
                <span className="text-[11px] text-textTertiary">
                  Разрешены только защищённые адреса веб-страниц (https://).
                </span>
              )}
            </div>

            {/* LABEL INPUT */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-textSecondary flex items-center justify-between">
                <span>Отображаемый заголовок кнопки</span>
                <span className="text-[10px] font-mono text-textTertiary">{modalLabel.length}/100</span>
              </label>
              <input
                type="text"
                maxLength={100}
                value={modalLabel}
                onChange={(e) => setModalLabel(e.target.value)}
                placeholder={PROVIDER_METADATA[modalProvider]?.name || 'Поддержать проект'}
                className="h-11 bg-surface-2 border border-borderDef focus:border-accent text-sm px-3 rounded-xl outline-none transition-colors"
              />
            </div>

            {/* SAFETY NOTICE BANNER (AC-CSP-004, AC-CSP-006) */}
            {modalProvider === 'custom' && (
              <div className="p-3.5 bg-warning/10 border border-warning/25 rounded-xl flex items-start gap-2.5 text-xs text-warning">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Пользовательские ссылки на внешние ресурсы автоматически проверяются службой безопасности HUBIGR и до подтверждения будут скрыты в публичных карточках.
                </span>
              </div>
            )}

            {editingLink && (
              <div className="p-3 bg-accent/10 border border-accent/20 rounded-xl flex items-start gap-2 text-xs text-textSecondary">
                <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>
                  Изменение адреса ссылки запустит повторную процедуру проверки безопасности Safe Redirect.
                </span>
              </div>
            )}

            {/* MODAL ACTIONS */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-borderDef/60">
              <Button type="button" variant="secondary" onClick={handleCloseModal}>
                Отмена
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleSaveLink}
                disabled={!modalUrl.trim() || !!urlValidationError}
              >
                {editingLink ? 'Сохранить изменения' : 'Добавить ссылку'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ================= MODAL: DELETE CONFIRMATION (AC-CSP-017, BR-CSP-027, BR-CSP-036) ================= */}
      {deletingLink && (
        <Modal
          isOpen={!!deletingLink}
          onClose={() => setDeletingLink(null)}
          title="Удаление ссылки поддержки"
          subtitle="Подтверждение действия"
          icon={<Trash2 className="w-5 h-5 text-danger" />}
          maxWidth="sm"
        >
          <div className="flex flex-col gap-4 select-none pt-1">
            <p className="text-xs text-textSecondary leading-relaxed">
              Вы уверены, что хотите удалить ссылку{' '}
              <strong className="text-textPrimary">{deletingLink.label || deletingLink.urlCanonical}</strong>?
            </p>
            <div className="p-3 bg-surface-2 rounded-xl border border-borderDef text-[11px] text-textTertiary leading-normal">
              Ссылка перестанет отображаться на всех страницах ваших игр. Историческая агрегированная статистика переходов будет сохранена в аналитике.
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-borderDef/60">
              <Button type="button" variant="secondary" onClick={() => setDeletingLink(null)}>
                Отмена
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleConfirmDelete}
                className="bg-danger hover:bg-danger/80 text-white"
              >
                Удалить
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CreatorSupportTab;
