import React, { useState } from 'react';
import { Shield, Lock, Mail, Trash2, BellRing, BellOff, Info, Smartphone, AlertTriangle, Monitor, LogOut, Link2, Unlink, AlertCircle, RefreshCw, CheckCircle2, ShieldCheck, Eye, EyeOff, KeyRound, Key, Check, Calendar, Laptop, MapPin, Clock, Copy, Download, QrCode, ShieldAlert, HelpCircle, ExternalLink, FileText, Users, Gamepad2, DollarSign, CheckSquare, Square, Bell, BookOpen, Tag, Trophy, RotateCcw } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { AccountAppealModal } from '../components/modals/AccountAppealModal';
import { AccountDeletionModal } from '../components/modals/AccountDeletionModal';
const FormField = ({ label, children }: { label?: string; children: React.ReactNode }) => (<div className="flex flex-col gap-2"><label className="text-caption font-semibold text-textSecondary uppercase tracking-wider">{label}</label>{children}</div>);
import Switch from '../components/ui/Switch';
import { useToast } from '../components/ui/Toast';
import DevMatrixPanel, { DevMatrixField } from '../components/DevMatrixPanel';

interface LinkedProvider {
  id: 'vk' | 'yandex' | 'gosuslugi';
  name: string;
  badge: string;
  iconBg: string;
  isLinked: boolean;
  linkedIdentity?: string;
  linkedDate?: string;
}

interface SessionItem {
  id: string;
  device: string;
  browser: string;
  deviceType: 'desktop' | 'mobile' | 'laptop';
  ip: string;
  location: string;
  date: string;
  isCurrent: boolean;
  isNew?: boolean;
}

export interface PunishmentAuditRecord {
  id: string;
  date: string;
  type: 'warning' | 'scoped_restriction' | 'suspension';
  capability: string;
  reason: string;
  status: 'active' | 'resolved' | 'appealed_unbanned';
}

const INITIAL_PUNISHMENT_HISTORY: PunishmentAuditRecord[] = [
  {
    id: 'RES-COM-1049',
    date: '05 сентября 2026',
    type: 'scoped_restriction',
    capability: 'Отзывы и комментарии',
    reason: 'Спам и недопустимые внешние ссылки в отзывах (Раздел 4.2)',
    status: 'active'
  },
  {
    id: 'WARN-2026-89',
    date: '12 июля 2026',
    type: 'warning',
    capability: 'Профиль и донаты',
    reason: 'Некорректный формат внешней ссылки на сбор средств',
    status: 'resolved'
  },
  {
    id: 'BAN-2025-014',
    date: '18 ноября 2025',
    type: 'suspension',
    capability: 'Полный доступ',
    reason: 'Подозрение на компрометацию учетной записи (смена IP)',
    status: 'appealed_unbanned'
  }
];

const QRCodeSVG = () => (
  <div className="w-44 h-44 bg-white p-3 rounded-2xl shadow-sm border border-borderDef flex items-center justify-center relative select-none">
    <svg viewBox="0 0 100 100" className="w-full h-full text-black fill-current">
      <rect x="5" y="5" width="26" height="26" rx="4" />
      <rect x="9" y="9" width="18" height="18" rx="2" fill="white" />
      <rect x="13" y="13" width="10" height="10" rx="1" />
      
      <rect x="69" y="5" width="26" height="26" rx="4" />
      <rect x="73" y="9" width="18" height="18" rx="2" fill="white" />
      <rect x="77" y="13" width="10" height="10" rx="1" />

      <rect x="5" y="69" width="26" height="26" rx="4" />
      <rect x="9" y="73" width="18" height="18" rx="2" fill="white" />
      <rect x="13" y="77" width="10" height="10" rx="1" />

      <rect x="36" y="8" width="4" height="4" />
      <rect x="44" y="8" width="4" height="4" />
      <rect x="52" y="8" width="4" height="4" />
      <rect x="60" y="8" width="4" height="4" />

      <rect x="8" y="36" width="4" height="4" />
      <rect x="8" y="44" width="4" height="4" />
      <rect x="8" y="52" width="4" height="4" />
      <rect x="8" y="60" width="4" height="4" />

      <rect x="36" y="20" width="4" height="4" />
      <rect x="48" y="20" width="8" height="4" />
      <rect x="60" y="20" width="4" height="4" />

      <rect x="36" y="36" width="28" height="28" rx="4" fill="#6366F1" />
      <circle cx="50" cy="50" r="10" fill="white" />
      <path d="M47 48v-2a3 3 0 0 1 6 0v2h1a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h1zm2 0h2v-2a1 1 0 0 0-2 0v2z" fill="#6366F1" />

      <rect x="36" y="68" width="8" height="4" />
      <rect x="48" y="68" width="4" height="8" />
      <rect x="56" y="72" width="8" height="4" />
      <rect x="40" y="80" width="4" height="8" />
      <rect x="52" y="84" width="8" height="4" />

      <rect x="68" y="36" width="4" height="8" />
      <rect x="76" y="40" width="8" height="4" />
      <rect x="88" y="36" width="4" height="8" />
      <rect x="68" y="52" width="8" height="4" />
      <rect x="80" y="52" width="4" height="8" />
      <rect x="88" y="56" width="4" height="8" />

      <rect x="68" y="68" width="8" height="8" />
      <rect x="80" y="72" width="4" height="4" />
      <rect x="88" y="68" width="4" height="8" />
      <rect x="72" y="84" width="4" height="4" />
      <rect x="84" y="84" width="8" height="4" />
    </svg>
  </div>
);

export default function SettingsPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('security');

  // URL Hash/Query listener for deep-linking tabs (e.g. /settings?tab=notifications)
  React.useEffect(() => {
    const parseTabFromUrl = () => {
      const hash = window.location.hash;
      const qIndex = hash.indexOf('?');
      if (qIndex !== -1) {
        const queryStr = hash.substring(qIndex + 1);
        const params = new URLSearchParams(queryStr);
        const tab = params.get('tab');
        if (tab && ['security', 'linkedAccounts', 'sessions', 'notifications', 'restrictions', 'deletion'].includes(tab)) {
          setActiveTab(tab);
        }
      }
    };
    parseTabFromUrl();
    window.addEventListener('hashchange', parseTabFromUrl);
    return () => window.removeEventListener('hashchange', parseTabFromUrl);
  }, []);

  // --- FE-ACC-008: SCOPED RESTRICTIONS STATE (BR-ACC-056, FR-ACC-053) ---
  const [scopedRestrictions, setScopedRestrictions] = useState({
    comments: true,
    publishing: false,
    payouts: false,
  });
  const [isAppealModalOpen, setIsAppealModalOpen] = useState(false);
  const [appealCaseInfo, setAppealCaseInfo] = useState<{ caseId: string; title: string; capability: 'comments' | 'publishing' | 'payouts' }>({
    caseId: 'RES-COM-1049',
    title: 'Ограничение отзывов и комментариев',
    capability: 'comments'
  });
  const [punishmentHistory, setPunishmentHistory] = useState<PunishmentAuditRecord[]>(INITIAL_PUNISHMENT_HISTORY);

  // --- FE-ACC-009: ACCOUNT DELETION STATE (BR-ACC-059...065, FR-ACC-056...063) ---
  const [deletionDependencies, setDeletionDependencies] = useState({
    hasPublishedGames: false, // BR-ACC-063: Game ownership dependency
    isSoleTeamOwner: false,    // BR-ACC-064: Team ownership dependency
    hasPendingFinances: false  // BR-ACC-065: Seller finance dependency
  });
  const [hasDigitalRightsLossConfirmed, setHasDigitalRightsLossConfirmed] = useState(false); // BR-ACC-062
  const [isDeletionModalOpen, setIsDeletionModalOpen] = useState(false);

  // --- FE-ACC-003 STAGE 2: TOTP 2FA STATE ---
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [twoFASecret] = useState('JBSWY3DPEHPK3PXP');
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([
    '4829-1024',
    '7391-8842',
    '1930-5512',
    '8831-4029',
    '6201-9311',
    '3019-7482',
    '9582-1204',
    '5142-6639',
    '2719-8301',
    '6048-2951',
  ]);

  // 2FA Setup Wizard Modal State
  const [is2FASetupModalOpen, setIs2FASetupModalOpen] = useState(false);
  const [setupStep, setSetupStep] = useState<1 | 2 | 3>(1);
  const [setupVerifyCode, setSetupVerifyCode] = useState('');
  const [setupCodeError, setSetupCodeError] = useState<string | null>(null);
  const [hasSavedCodesConfirmed, setHasSavedCodesConfirmed] = useState(false);

  // Recovery Codes Modal State
  const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState(false);

  // Disable 2FA Modal State
  const [isDisable2FAModalOpen, setIsDisable2FAModalOpen] = useState(false);
  const [disable2FAPassword, setDisable2FAPassword] = useState('');
  const [showDisablePass, setShowDisablePass] = useState(false);
  const [disable2FAError, setDisable2FAError] = useState<string | null>(null);

  // --- FE-ACC-003 STAGE 3: ROLE-BASED 2FA RULES (BR-ACC-031, BR-ACC-033) ---
  const [accountRole, setAccountRole] = useState<'user' | 'seller' | 'admin'>('user');
  const is2FAMandatory = accountRole !== 'user';
  const [is2FALockoutModalOpen, setIs2FALockoutModalOpen] = useState(false);

  // Edge cases & Account state
  const [hasLocalPassword, setHasLocalPassword] = useState(true);
  const isOAuthOnly = !hasLocalPassword;
  const setIsOAuthOnly = (val: boolean) => setHasLocalPassword(!val);
  const [hasPurchases, setHasPurchases] = useState(true);
  const [isSoleOwner, setIsSoleOwner] = useState(false);
  const [deletionConfirmed, setDeletionConfirmed] = useState(false);
  const [isPendingDeletion, setIsPendingDeletion] = useState(false);

  // --- FE-ACC-011 STAGE 1: NOTIFICATIONS (BR-ACC-066, FR-ACC-066) ---
  interface ConfigurableNotificationPref {
    id: string;
    title: string;
    description: string;
    category: 'games' | 'devlogs' | 'community' | 'marketing' | 'jams';
    email: boolean;
    inApp: boolean;
    push: boolean;
  }

  const [configurablePrefs, setConfigurablePrefs] = useState<ConfigurableNotificationPref[]>([
    {
      id: 'game_updates',
      title: 'Обновления подписанных игр (Game Subscriptions)',
      description: 'Патчи, новые версии и релизные анонсы отслеживаемых игр (SC-ACC-027)',
      category: 'games',
      email: true,
      inApp: true,
      push: true
    },
    {
      id: 'devlogs_following',
      title: 'Девлоги авторов (User Follow)',
      description: 'Публикации статей разработки от авторов, на которых вы подписаны',
      category: 'devlogs',
      email: false,
      inApp: true,
      push: false
    },
    {
      id: 'community_replies',
      title: 'Ответы и реакции в сообществе',
      description: 'Уведомления об ответах на ваши комментарии и упоминаниях через @ник',
      category: 'community',
      email: true,
      inApp: true,
      push: true
    },
    {
      id: 'wishlist_discounts',
      title: 'Скидки и списки желаемого',
      description: 'Снижение стоимости и старт распродаж игр из вашего списка желаемого',
      category: 'marketing',
      email: true,
      inApp: true,
      push: false
    },
    {
      id: 'jam_reminders',
      title: 'Напоминания об игровых джемах',
      description: 'Напоминания о дедлайнах сдачи билдов, старте голосования и результатах',
      category: 'jams',
      email: false,
      inApp: true,
      push: true
    },
    {
      id: 'new_followers',
      title: 'Новые подписчики профиля',
      description: 'Оповещения, когда другой пользователь подписывается на ваш аккаунт',
      category: 'community',
      email: false,
      inApp: true,
      push: false
    }
  ]);

  const handleTogglePref = (id: string, channel: 'email' | 'inApp' | 'push') => {
    setConfigurablePrefs(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, [channel]: !item[channel] };
      }
      return item;
    }));
  };

  const handleSaveNotificationPreferences = () => {
    showToast('Настройки уведомлений успешно сохранены', 'success');
  };

  const handleResetNotificationPreferences = () => {
    setConfigurablePrefs(prev => prev.map(item => ({
      ...item,
      email: item.category === 'games' || item.category === 'community' || item.category === 'marketing',
      inApp: true,
      push: item.category === 'games' || item.category === 'jams'
    })));
    showToast('Настройки сброшены к рекомендуемым', 'info');
  };

  // FE-ACC-011 STAGE 2: GAME SUBSCRIPTIONS (SC-ACC-027, BR-ACC-067)
  const INITIAL_SUBSCRIBED_GAMES = [
    {
      id: 'game-1',
      title: 'Cyber Quest 2077',
      developer: 'CyberPeak Games',
      subscribedAt: '15.03.2026',
      latestUpdate: 'Патч v1.2.4: Исправление шейдеров и синхронизации',
      updateDate: 'Вчера, 18:40',
      unreadUpdates: true,
      patchesEnabled: true,
      announcementsEnabled: true,
    },
    {
      id: 'game-2',
      title: 'Neon Odyssey: Chronicles',
      developer: 'RetroFuture Lab',
      subscribedAt: '02.02.2026',
      latestUpdate: 'Крупное DLC: Эра Неона и 4 новых уровня',
      updateDate: '3 дня назад',
      unreadUpdates: false,
      patchesEnabled: true,
      announcementsEnabled: false,
    },
    {
      id: 'game-3',
      title: 'Pixel Tactics Zero',
      developer: 'IndieMaster Studio',
      subscribedAt: '10.01.2026',
      latestUpdate: 'Версия v1.0.0: Официальный глобальный релиз!',
      updateDate: '1 неделя назад',
      unreadUpdates: false,
      patchesEnabled: true,
      announcementsEnabled: true,
    },
  ];

  const [subscribedGames, setSubscribedGames] = useState(INITIAL_SUBSCRIBED_GAMES);

  const handleUnsubscribeGame = (gameId: string, gameTitle: string) => {
    setSubscribedGames(prev => prev.filter(g => g.id !== gameId));
    showToast(`Вы отписались от обновлений игры "${gameTitle}" (SC-ACC-027)`, 'info');
  };

  const handleToggleGamePatchAlerts = (gameId: string) => {
    setSubscribedGames(prev => prev.map(g => {
      if (g.id === gameId) {
        const nextState = !g.patchesEnabled;
        showToast(nextState ? 'Оповещения о патчах включены' : 'Оповещения о патчах выключены', 'info');
        return { ...g, patchesEnabled: nextState };
      }
      return g;
    }));
  };

  const handleToggleGameAnnouncementAlerts = (gameId: string) => {
    setSubscribedGames(prev => prev.map(g => {
      if (g.id === gameId) {
        const nextState = !g.announcementsEnabled;
        showToast(nextState ? 'Оповещения об анонсах включены' : 'Оповещения об анонсах выключены', 'info');
        return { ...g, announcementsEnabled: nextState };
      }
      return g;
    }));
  };

  // --- FE-ACC-003 STAGE 1: SESSIONS & DEVICES (BR-ACC-029, BR-ACC-036) ---
  const initialSessions: SessionItem[] = [
    {
      id: 's-current',
      device: 'Windows 11 PC',
      browser: 'Google Chrome 124.0',
      deviceType: 'desktop',
      ip: '192.168.1.45',
      location: 'Москва, Россия',
      date: 'Активно сейчас',
      isCurrent: true,
    },
    {
      id: 's-mobile',
      device: 'Apple iPhone 15 Pro',
      browser: 'Mobile Safari 17.4',
      deviceType: 'mobile',
      ip: '94.25.178.12',
      location: 'Санкт-Петербург, Россия',
      date: '2 часа назад',
      isCurrent: false,
    },
    {
      id: 's-laptop',
      device: 'Apple MacBook Air M2',
      browser: 'Mozilla Firefox 125.0',
      deviceType: 'laptop',
      ip: '85.140.2.11',
      location: 'Екатеринбург, Россия',
      date: 'Вчера в 18:40',
      isCurrent: false,
    },
  ];

  const [mockSessions, setMockSessions] = useState<SessionItem[]>(initialSessions);
  const [sessionToRevoke, setSessionToRevoke] = useState<SessionItem | null>(null);
  const [isRevokeAllModalOpen, setIsRevokeAllModalOpen] = useState(false);
  const [newDeviceAlert, setNewDeviceAlert] = useState<{
    id: string;
    device: string;
    browser: string;
    location: string;
    ip: string;
  } | null>(null);

  const handleSimulateNewDevice = () => {
    const newSessionId = 's-new-' + Date.now();
    const newSession: SessionItem = {
      id: newSessionId,
      device: 'Xiaomi 13 Pro',
      browser: 'Chrome Mobile 123.0',
      deviceType: 'mobile',
      ip: '178.205.41.92',
      location: 'Казань, Россия',
      date: 'Только что',
      isCurrent: false,
      isNew: true,
    };
    setMockSessions(prev => [prev[0], newSession, ...prev.slice(1)]);
    setNewDeviceAlert({
      id: newSessionId,
      device: 'Xiaomi 13 Pro',
      browser: 'Chrome Mobile 123.0',
      location: 'Казань, Россия',
      ip: '178.205.41.92',
    });
    showToast('Смоделирован вход с нового устройства (г. Казань)', 'warning');
  };

  const handleDismissNewDeviceAlert = () => {
    setNewDeviceAlert(null);
    showToast('Устройство подтверждено как доверенное', 'info');
  };

  const handleQuickRevokeNewDevice = () => {
    if (!newDeviceAlert) return;
    setMockSessions(prev => prev.filter(s => s.id !== newDeviceAlert.id));
    setNewDeviceAlert(null);
    showToast('Подозрительная сессия немедленно завершена', 'success');
  };

  const handleConfirmRevokeSession = () => {
    if (!sessionToRevoke) return;
    setMockSessions(prev => prev.filter(s => s.id !== sessionToRevoke.id));
    if (newDeviceAlert && newDeviceAlert.id === sessionToRevoke.id) {
      setNewDeviceAlert(null);
    }
    showToast(`Сессия на устройстве ${sessionToRevoke.device} завершена`, 'info');
    setSessionToRevoke(null);
  };

  const handleConfirmRevokeAll = () => {
    setMockSessions(prev => prev.filter(s => s.isCurrent));
    setNewDeviceAlert(null);
    setIsRevokeAllModalOpen(false);
    showToast('Все остальные сессии успешно завершены', 'success');
  };

  const handleResetSessions = () => {
    setMockSessions(initialSessions);
    setNewDeviceAlert(null);
    showToast('Список сессий сброшен к исходному состоянию', 'info');
  };

  // --- FE-ACC-003 STAGE 2: 2FA HANDLERS ---
  const handleOpen2FASetup = () => {
    setSetupStep(1);
    setSetupVerifyCode('');
    setSetupCodeError(null);
    setHasSavedCodesConfirmed(false);
    setIs2FASetupModalOpen(true);
  };

  const handleVerifySetupCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (setupVerifyCode.trim().length !== 6) {
      setSetupCodeError('Введите 6-значный код из приложения аутентификатора');
      return;
    }
    setSetupCodeError(null);
    setSetupStep(3);
    showToast('Код безопасности подтвержден', 'success');
  };

  const handleComplete2FASetup = () => {
    if (!hasSavedCodesConfirmed) {
      showToast('Пожалуйста, подтвердите сохранение резервных кодов', 'warning');
      return;
    }
    setIs2FAEnabled(true);
    setIs2FASetupModalOpen(false);
    showToast('Двухфакторная аутентификация успешно активирована!', 'success');
  };

  const handleCopySecret = () => {
    navigator.clipboard.writeText(twoFASecret);
    showToast('Секретный ключ скопирован', 'info');
  };

  const handleCopyRecoveryCodes = () => {
    navigator.clipboard.writeText(recoveryCodes.join('\n'));
    showToast('Резервные коды скопированы в буфер обмена', 'info');
  };

  const handleDownloadRecoveryCodes = () => {
    const text = `Резервные коды восстановления Hubigr (Аккаунт: ${currentEmail})\nСгенерированы: ${new Date().toLocaleDateString('ru-RU')}\n\n` + recoveryCodes.join('\n') + '\n\nКаждый код может быть использован только один раз.';
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hubigr-recovery-codes.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Файл с резервными кодами успешно сохранен', 'success');
  };

  const handleRegenerateRecoveryCodes = () => {
    const generateCode = () => {
      const p1 = Math.floor(1000 + Math.random() * 9000);
      const p2 = Math.floor(1000 + Math.random() * 9000);
      return `${p1}-${p2}`;
    };
    const newCodes = Array.from({ length: 10 }, generateCode);
    setRecoveryCodes(newCodes);
    showToast('Сгенерированы 10 новых кодов. Предыдущие аннулированы', 'success');
  };

  const handleDisable2FA = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasLocalPassword && !disable2FAPassword.trim()) {
      setDisable2FAError('Введите текущий пароль для подтверждения');
      return;
    }
    setIs2FAEnabled(false);
    setIsDisable2FAModalOpen(false);
    setDisable2FAPassword('');
    setDisable2FAError(null);
    showToast('Двухфакторная аутентификация отключена', 'warning');
  };

  const handleAttemptDisable2FA = () => {
    if (is2FAMandatory) {
      setIs2FALockoutModalOpen(true);
    } else {
      setDisable2FAPassword('');
      setDisable2FAError(null);
      setIsDisable2FAModalOpen(true);
    }
  };

  // --- FE-ACC-002 STAGE 2: EMAIL & PHONE RE-AUTH FLOWS (BR-ACC-025, BR-ACC-026, AC-ACC-010, AC-ACC-011) ---
  const [currentEmail, setCurrentEmail] = useState('user@example.com');
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [emailSecurityAlert, setEmailSecurityAlert] = useState<string | null>(null);
  const [showPasswordMask, setShowPasswordMask] = useState(false);

  const [emailModalState, setEmailModalState] = useState<{
    isOpen: boolean;
    step: 'reauth' | 'input' | 'verify';
    currentPass: string;
    newEmail: string;
    verifyCode: string;
    resendTimer: number;
    error?: string;
  }>({
    isOpen: false,
    step: 'reauth',
    currentPass: '',
    newEmail: '',
    verifyCode: '',
    resendTimer: 0,
  });

  const [currentPhone, setCurrentPhone] = useState<string | null>('+7 (999) 000-00-00');
  const [phoneModalState, setPhoneModalState] = useState<{
    isOpen: boolean;
    step: 'reauth' | 'input' | 'verify';
    currentPass: string;
    newPhone: string;
    verifyCode: string;
    resendTimer: number;
    error?: string;
  }>({
    isOpen: false,
    step: 'reauth',
    currentPass: '',
    newPhone: '',
    verifyCode: '',
    resendTimer: 0,
  });

  // Countdown timers for resend
  React.useEffect(() => {
    let timer: any;
    if (emailModalState.resendTimer > 0) {
      timer = setTimeout(() => {
        setEmailModalState(prev => ({ ...prev, resendTimer: prev.resendTimer - 1 }));
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [emailModalState.resendTimer]);

  React.useEffect(() => {
    let timer: any;
    if (phoneModalState.resendTimer > 0) {
      timer = setTimeout(() => {
        setPhoneModalState(prev => ({ ...prev, resendTimer: prev.resendTimer - 1 }));
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [phoneModalState.resendTimer]);

  // Email Flow Handlers
  const handleOpenEmailModal = () => {
    setEmailModalState({
      isOpen: true,
      step: hasLocalPassword ? 'reauth' : 'input',
      currentPass: '',
      newEmail: '',
      verifyCode: '',
      resendTimer: 0,
    });
  };

  const handleEmailReauthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasLocalPassword && !emailModalState.currentPass.trim()) {
      setEmailModalState(prev => ({ ...prev, error: 'Введите текущий пароль для подтверждения личности' }));
      return;
    }
    setEmailModalState(prev => ({ ...prev, step: 'input', error: undefined }));
  };

  const handleEmailInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const email = emailModalState.newEmail.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailModalState(prev => ({ ...prev, error: 'Пожалуйста, введите корректный адрес электронной почты' }));
      return;
    }
    if (email.toLowerCase() === currentEmail.toLowerCase()) {
      setEmailModalState(prev => ({ ...prev, error: 'Новый адрес совпадает с текущим' }));
      return;
    }

    setPendingEmail(email);
    setEmailModalState(prev => ({ ...prev, step: 'verify', resendTimer: 60, error: undefined }));
    showToast(`Код подтверждения отправлен на ${email}`, 'info');
  };

  const handleEmailVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailModalState.verifyCode.trim().length < 4) {
      setEmailModalState(prev => ({ ...prev, error: 'Введите код подтверждения (например: 123456)' }));
      return;
    }

    const oldEmail = currentEmail;
    const updatedEmail = pendingEmail || emailModalState.newEmail;
    setCurrentEmail(updatedEmail);
    setPendingEmail(null);
    setEmailSecurityAlert(`На ваш прежний адрес ${oldEmail} отправлено security-уведомление о смене основного email.`);
    setEmailModalState({ isOpen: false, step: 'reauth', currentPass: '', newEmail: '', verifyCode: '', resendTimer: 0 });
    showToast(`Email успешно изменён на ${updatedEmail}`, 'success');
  };

  // Phone Flow Handlers
  const handleOpenPhoneModal = () => {
    setPhoneModalState({
      isOpen: true,
      step: hasLocalPassword ? 'reauth' : 'input',
      currentPass: '',
      newPhone: currentPhone || '+7 ',
      verifyCode: '',
      resendTimer: 0,
    });
  };

  const handlePhoneReauthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasLocalPassword && !phoneModalState.currentPass.trim()) {
      setPhoneModalState(prev => ({ ...prev, error: 'Введите текущий пароль для подтверждения' }));
      return;
    }
    setPhoneModalState(prev => ({ ...prev, step: 'input', error: undefined }));
  };

  const handlePhoneInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phone = phoneModalState.newPhone.trim();
    if (phone.length < 10) {
      setPhoneModalState(prev => ({ ...prev, error: 'Введите корректный номер телефона с кодом страны' }));
      return;
    }
    setPhoneModalState(prev => ({ ...prev, step: 'verify', resendTimer: 45, error: undefined }));
    showToast(`СМС с проверочным кодом отправлено на ${phone}`, 'info');
  };

  const handlePhoneVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneModalState.verifyCode.trim().length < 4) {
      setPhoneModalState(prev => ({ ...prev, error: 'Введите 4-значный СМС-код (например: 4812)' }));
      return;
    }

    setCurrentPhone(phoneModalState.newPhone);
    setPhoneModalState({ isOpen: false, step: 'reauth', currentPass: '', newPhone: '', verifyCode: '', resendTimer: 0 });
    showToast(`Номер телефона успешно подтверждён и сохранён как приватный`, 'success');
  };

  const handleRemovePhone = () => {
    if (window.confirm('Вы уверены, что хотите удалить привязанный номер телефона?')) {
      setCurrentPhone(null);
      showToast('Номер телефона удален', 'info');
    }
  };

  // --- FE-ACC-002 STAGE 3: PASSWORD FLOW (BR-ACC-027, BR-ACC-028, AC-ACC-012, AC-ACC-013) ---
  const [passwordSecurityAlert, setPasswordSecurityAlert] = useState<string | null>(null);
  const [passwordModalState, setPasswordModalState] = useState<{
    isOpen: boolean;
    step: 'reauth' | 'input';
    currentPass: string;
    twoFACode: string;
    oauthVerifyCode: string;
    newPass: string;
    confirmPass: string;
    revokeOtherSessions: boolean;
    resendTimer: number;
    showCurrentPass: boolean;
    showNewPass: boolean;
    showConfirmPass: boolean;
    error?: string;
  }>({
    isOpen: false,
    step: 'reauth',
    currentPass: '',
    twoFACode: '',
    oauthVerifyCode: '',
    newPass: '',
    confirmPass: '',
    revokeOtherSessions: true,
    resendTimer: 0,
    showCurrentPass: false,
    showNewPass: false,
    showConfirmPass: false,
  });

  // Countdown timer for OAuth password setup code resend
  React.useEffect(() => {
    let timer: any;
    if (passwordModalState.resendTimer > 0) {
      timer = setTimeout(() => {
        setPasswordModalState(prev => ({ ...prev, resendTimer: prev.resendTimer - 1 }));
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [passwordModalState.resendTimer]);

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-borderDef', width: 'w-0' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[a-zA-Z]/.test(pass) && /\d/.test(pass)) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/[^a-zA-Z0-9]/.test(pass) || pass.length >= 12) score++;

    if (score <= 1) return { score: 1, label: 'Слабый', color: 'bg-danger', width: 'w-1/4' };
    if (score === 2) return { score: 2, label: 'Средний', color: 'bg-warning', width: 'w-2/4' };
    if (score === 3) return { score: 3, label: 'Хороший', color: 'bg-accent', width: 'w-3/4' };
    return { score: 4, label: 'Надежный', color: 'bg-success', width: 'w-full' };
  };

  const handleOpenPasswordModal = () => {
    setPasswordModalState({
      isOpen: true,
      step: 'reauth',
      currentPass: '',
      twoFACode: '',
      oauthVerifyCode: '',
      newPass: '',
      confirmPass: '',
      revokeOtherSessions: true,
      resendTimer: !hasLocalPassword ? 60 : 0,
      showCurrentPass: false,
      showNewPass: false,
      showConfirmPass: false,
      error: undefined,
    });
    if (!hasLocalPassword) {
      showToast('Код безопасности отправлен на ваш Email', 'info');
    }
  };

  const handlePasswordReauthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasLocalPassword) {
      if (!passwordModalState.currentPass.trim()) {
        setPasswordModalState(prev => ({ ...prev, error: 'Пожалуйста, введите текущий пароль' }));
        return;
      }
      if (is2FAEnabled) {
        if (!passwordModalState.twoFACode.trim()) {
          setPasswordModalState(prev => ({ ...prev, error: 'Пожалуйста, введите код двухфакторной аутентификации' }));
          return;
        }
        if (passwordModalState.twoFACode.trim().length !== 6) {
          setPasswordModalState(prev => ({ ...prev, error: 'Код 2FA должен содержать ровно 6 цифр' }));
          return;
        }
      }
    } else {
      // OAuth-only verification code check
      if (!passwordModalState.oauthVerifyCode.trim()) {
        setPasswordModalState(prev => ({ ...prev, error: 'Пожалуйста, введите проверочный код из письма' }));
        return;
      }
      if (passwordModalState.oauthVerifyCode.trim() !== '938104') {
        setPasswordModalState(prev => ({ ...prev, error: 'Неверный проверочный код. Для теста введите 938104' }));
        return;
      }
    }

    setPasswordModalState(prev => ({ ...prev, step: 'input', error: undefined }));
  };

  const handlePasswordInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordModalState.newPass.length < 8) {
      setPasswordModalState(prev => ({ ...prev, error: 'Пароль должен содержать минимум 8 символов' }));
      return;
    }
    if (passwordModalState.newPass !== passwordModalState.confirmPass) {
      setPasswordModalState(prev => ({ ...prev, error: 'Введенные пароли не совпадают' }));
      return;
    }
    if (hasLocalPassword && passwordModalState.newPass === passwordModalState.currentPass) {
      setPasswordModalState(prev => ({ ...prev, error: 'Новый пароль должен отличаться от текущего' }));
      return;
    }

    const wasOAuthOnly = !hasLocalPassword;
    setHasLocalPassword(true);

    if (passwordModalState.revokeOtherSessions) {
      setMockSessions(prev => prev.filter(s => s.isCurrent));
    }

    setPasswordModalState(prev => ({ ...prev, isOpen: false }));

    if (wasOAuthOnly) {
      showToast('Пароль успешно установлен. Теперь доступен вход по email.', 'success');
      setPasswordSecurityAlert('Для аккаунта успешно создан пароль. Вы можете входить как через соцсеть, так и по связке email + пароль.');
    } else {
      showToast('Пароль обновлен. Все остальные сеансы завершены.', 'success');
      setPasswordSecurityAlert('Пароль аккаунта был успешно изменен. Все остальные активные сеансы завершены, на вашу почту отправлено уведомление безопасности.');
    }
  };

  // --- FE-ACC-002 STAGE 4: PROTECTED DATE OF BIRTH (DOB) FLOW (BR-ACC-003, BR-ACC-034, FR-ACC-032, AC-ACC-051) ---
  const [currentDOB, setCurrentDOB] = useState<string | null>('2002-05-15');
  const [dobSecurityAlert, setDobSecurityAlert] = useState<string | null>(null);
  const [dobModalState, setDobModalState] = useState<{
    isOpen: boolean;
    step: 'reauth' | 'input';
    currentPass: string;
    oauthVerifyCode: string;
    newDOB: string;
    resendTimer: number;
    showPass: boolean;
    confirmAccuracy: boolean;
    error?: string;
  }>({
    isOpen: false,
    step: 'reauth',
    currentPass: '',
    oauthVerifyCode: '',
    newDOB: '2002-05-15',
    resendTimer: 0,
    showPass: false,
    confirmAccuracy: false,
  });

  // Countdown timer for OAuth DOB re-auth code resend
  React.useEffect(() => {
    let timer: any;
    if (dobModalState.resendTimer > 0) {
      timer = setTimeout(() => {
        setDobModalState(prev => ({ ...prev, resendTimer: prev.resendTimer - 1 }));
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [dobModalState.resendTimer]);

  const calculateAge = (dobString: string): number => {
    if (!dobString) return 0;
    const birthDate = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatDOB = (dobString: string): string => {
    if (!dobString) return '';
    const date = new Date(dobString);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const handleOpenDOBModal = () => {
    setDobModalState({
      isOpen: true,
      step: 'reauth',
      currentPass: '',
      oauthVerifyCode: '',
      newDOB: currentDOB || '2000-01-01',
      resendTimer: !hasLocalPassword ? 60 : 0,
      showPass: false,
      confirmAccuracy: false,
      error: undefined,
    });
    if (!hasLocalPassword) {
      showToast('Код безопасности отправлен на ваш Email', 'info');
    }
  };

  const handleDOBReauthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasLocalPassword) {
      if (!dobModalState.currentPass.trim()) {
        setDobModalState(prev => ({ ...prev, error: 'Пожалуйста, введите текущий пароль для подтверждения' }));
        return;
      }
    } else {
      if (!dobModalState.oauthVerifyCode.trim()) {
        setDobModalState(prev => ({ ...prev, error: 'Пожалуйста, введите проверочный код из письма' }));
        return;
      }
      if (dobModalState.oauthVerifyCode.trim() !== '938104') {
        setDobModalState(prev => ({ ...prev, error: 'Неверный проверочный код. Для теста введите 938104' }));
        return;
      }
    }

    setDobModalState(prev => ({ ...prev, step: 'input', error: undefined }));
  };

  const handleDOBInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dobModalState.newDOB) {
      setDobModalState(prev => ({ ...prev, error: 'Пожалуйста, укажите дату рождения' }));
      return;
    }

    const age = calculateAge(dobModalState.newDOB);
    if (age < 12) {
      setDobModalState(prev => ({
        ...prev,
        error: 'Возраст пользователя должен быть не менее 12 лет согласно правилам платформы',
      }));
      return;
    }

    if (!dobModalState.confirmAccuracy) {
      setDobModalState(prev => ({
        ...prev,
        error: 'Пожалуйста, подтвердите достоверность указанных данных',
      }));
      return;
    }

    setCurrentDOB(dobModalState.newDOB);
    setDobModalState(prev => ({ ...prev, isOpen: false }));
    showToast('Дата рождения успешно обновлена', 'success');
    setDobSecurityAlert('Дата рождения аккаунта была обновлена. На ваш основной email отправлено уведомление безопасности.');
  };

  // --- FE-ACC-002: LINKED ACCOUNTS STATE (AC-ACC-006, AC-ACC-007, AC-ACC-008) ---
  const [linkedProviders, setLinkedProviders] = useState<LinkedProvider[]>([
    { id: 'vk', name: 'ВКонтакте (VK ID)', badge: 'VK', iconBg: 'bg-[#0077FF]', isLinked: true, linkedIdentity: 'vk.com/id4829104', linkedDate: '14 мая 2025' },
    { id: 'yandex', name: 'Яндекс ID', badge: 'Я', iconBg: 'bg-[#FC3F1D]', isLinked: false },
    { id: 'gosuslugi', name: 'Госуслуги (ЕСИА)', badge: 'ГУ', iconBg: 'bg-[#0D4CD3]', isLinked: false },
  ]);

  const [providerToLink, setProviderToLink] = useState<LinkedProvider | null>(null);
  const [providerToUnlink, setProviderToUnlink] = useState<LinkedProvider | null>(null);
  const [isLinkingProcess, setIsLinkingProcess] = useState(false);

  // Total active login methods: password (if set) + count of linked OAuth providers
  const activeOAuthCount = linkedProviders.filter(p => p.isLinked).length;
  const totalActiveLoginMethods = (hasLocalPassword ? 1 : 0) + activeOAuthCount;

  const openLinkModal = (provider: LinkedProvider) => {
    setProviderToLink(provider);
  };

  const handleConfirmLink = () => {
    if (!providerToLink) return;
    setIsLinkingProcess(true);
    setTimeout(() => {
      setLinkedProviders(prev => prev.map(p => {
        if (p.id === providerToLink.id) {
          const fakeIdentity = p.id === 'vk' ? 'vk.com/id7748123' : p.id === 'yandex' ? 'alex.dev@yandex.ru' : 'ЕСИА: подтвержден';
          return { ...p, isLinked: true, linkedIdentity: fakeIdentity, linkedDate: 'Только что' };
        }
        return p;
      }));
      setIsLinkingProcess(false);
      showToast(`${providerToLink.name} успешно привязан к аккаунту`, 'success');
      setProviderToLink(null);
    }, 800);
  };

  const handleConfirmUnlink = () => {
    if (!providerToUnlink) return;
    // Security check: cannot unlink the last login method (AC-ACC-008)
    if (totalActiveLoginMethods <= 1) {
      showToast('Ошибка безопасности: нельзя отключить единственный способ входа', 'danger');
      setProviderToUnlink(null);
      return;
    }

    setLinkedProviders(prev => prev.map(p => {
      if (p.id === providerToUnlink.id) {
        return { ...p, isLinked: false, linkedIdentity: undefined, linkedDate: undefined };
      }
      return p;
    }));
    showToast(`${providerToUnlink.name} успешно отвязан от аккаунта`, 'info');
    setProviderToUnlink(null);
  };

  const [notificationPrefs, setNotificationPrefs] = useState({
    marketing: false,
    security: true, // Mandatory (FR-ACC-066)
    community: true
  });

  return (
    <div className="w-full min-h-screen bg-bgDefault pt-16 md:pt-24 pb-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row gap-8">
        
        {/* SIDEBAR NAVIGATION */}
        <div className="w-full md:w-64 flex flex-col gap-2 shrink-0 animate-fadeIn">
          <h2 className="text-h3 font-black text-textPrimary mb-4 font-mono uppercase tracking-tight">Настройки</h2>
          
          {/* USER ACCOUNT BADGE & ROLE SELECTOR */}
          <div className="p-3 bg-surface-1 rounded-xl border border-borderDef mb-2 flex items-center justify-between gap-2.5 shadow-sm">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-accent/20 text-accent font-bold flex items-center justify-center text-xs shrink-0 border border-accent/30">
                JD
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-textPrimary truncate">John Doe</div>
                <div className="text-[10px] text-textTertiary font-mono truncate">{currentEmail}</div>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-surface-2 border border-borderDef text-textSecondary shrink-0">
              {accountRole === 'seller' ? 'Продавец' : accountRole === 'admin' ? 'Админ' : 'Пользователь'}
            </span>
          </div>

          <button 
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-3 px-4 py-3 rounded-control text-left transition-colors duration-fast ${activeTab === 'security' ? 'bg-surface-2 text-textPrimary font-bold border border-borderDef' : 'text-textSecondary hover:bg-surface-1 hover:text-textPrimary'}`}
          >
            <Shield className={`w-5 h-5 ${activeTab === 'security' ? 'text-accent' : ''}`} />
            Безопасность и Вход
          </button>

          <button 
            onClick={() => setActiveTab('linkedAccounts')}
            className={`flex items-center gap-3 px-4 py-3 rounded-control text-left transition-colors duration-fast ${activeTab === 'linkedAccounts' ? 'bg-surface-2 text-textPrimary font-bold border border-borderDef' : 'text-textSecondary hover:bg-surface-1 hover:text-textPrimary'}`}
          >
            <LogOut className={`w-5 h-5 ${activeTab === 'linkedAccounts' ? 'text-accent' : ''}`} />
            Связанные аккаунты
          </button>
          
          <button 
            onClick={() => setActiveTab('sessions')}
            className={`flex items-center gap-3 px-4 py-3 rounded-control text-left transition-colors duration-fast ${activeTab === 'sessions' ? 'bg-surface-2 text-textPrimary font-bold border border-borderDef' : 'text-textSecondary hover:bg-surface-1 hover:text-textPrimary'}`}
          >
            <Monitor className={`w-5 h-5 ${activeTab === 'sessions' ? 'text-accent' : ''}`} />
            Сессии устройств
          </button>

          <button 
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-3 px-4 py-3 rounded-control text-left transition-colors duration-fast ${activeTab === 'notifications' ? 'bg-surface-2 text-textPrimary font-bold border border-borderDef' : 'text-textSecondary hover:bg-surface-1 hover:text-textPrimary'}`}
          >
            <Mail className={`w-5 h-5 ${activeTab === 'notifications' ? 'text-accent' : ''}`} />
            Уведомления
          </button>

          <button 
            onClick={() => setActiveTab('restrictions')}
            className={`flex items-center gap-3 px-4 py-3 rounded-control text-left transition-colors duration-fast ${activeTab === 'restrictions' ? 'bg-surface-2 text-textPrimary font-bold border border-borderDef' : 'text-textSecondary hover:bg-surface-1 hover:text-textPrimary'}`}
          >
            <ShieldAlert className={`w-5 h-5 ${activeTab === 'restrictions' ? 'text-accent' : ''}`} />
            <div className="flex-1 flex items-center justify-between">
              <span>Ограничения</span>
              {Object.values(scopedRestrictions).some(Boolean) && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-warning/10 text-warning border border-warning/30">
                  1
                </span>
              )}
            </div>
          </button>

          <div className="flex-1"></div>

          <button 
            onClick={() => setActiveTab('deletion')}
            className={`flex items-center gap-3 px-4 py-3 rounded-control text-left transition-colors duration-fast mt-auto ${activeTab === 'deletion' ? 'bg-danger/10 text-danger font-bold border border-danger/30' : 'text-danger/70 hover:bg-danger/10 hover:text-danger'}`}
          >
            <Trash2 className="w-5 h-5" />
            Удаление аккаунта
          </button>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 max-w-[800px] animate-fadeIn">
          
          {/* TAB: SECURITY */}
          {activeTab === 'security' && (
            <div className="flex flex-col gap-8">
              
              {/* MANDATORY 2FA ENFORCEMENT BANNER (BR-ACC-031) */}
              {is2FAMandatory && !is2FAEnabled && (
                <div className="p-5 bg-danger/10 border-2 border-danger/40 rounded-card space-y-3 animate-slideDown shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-danger/20 border border-danger/40 flex items-center justify-center shrink-0 text-danger mt-0.5">
                        <Lock className="w-5 h-5 animate-pulse" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-body font-bold text-textPrimary">
                            Требуется обязательное подключение 2FA
                          </span>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-danger/20 text-danger border border-danger/40">
                            {accountRole === 'seller' ? 'Статус Продавца' : 'Статус Администратора'}
                          </span>
                        </div>
                        <p className="text-xs text-textSecondary leading-relaxed">
                          Для учетных записей со статусом <strong className="text-textPrimary">{accountRole === 'seller' ? 'Продавца (Seller)' : 'Администратора'}</strong> двухфакторная аутентификация является обязательным требованием безопасности. Доступ к торговым операциям и управлению платформой ограничен до активации 2FA.
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleOpen2FASetup}
                      className="shrink-0 self-end sm:self-center text-xs"
                    >
                      <Shield className="w-3.5 h-3.5 mr-1" /> Подключить 2FA
                    </Button>
                  </div>
                </div>
              )}

              {/* Security Alert Notification (notification on email change) */}
              {emailSecurityAlert && (
                <div className="p-4 bg-info/10 border border-info/30 rounded-xl flex items-start justify-between gap-3 text-xs text-textPrimary animate-fadeIn shadow-sm">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-info shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="font-bold text-info">Уведомление безопасности</span>
                      <p className="text-textSecondary leading-relaxed">{emailSecurityAlert}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setEmailSecurityAlert(null)}
                    className="text-textTertiary hover:text-textPrimary p-1 rounded transition-colors"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Security Alert Notification (notification on password change) */}
              {passwordSecurityAlert && (
                <div className="p-4 bg-info/10 border border-info/30 rounded-xl flex items-start justify-between gap-3 text-xs text-textPrimary animate-fadeIn shadow-sm">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-info shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="font-bold text-info">Уведомление безопасности</span>
                      <p className="text-textSecondary leading-relaxed">{passwordSecurityAlert}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setPasswordSecurityAlert(null)}
                    className="text-textTertiary hover:text-textPrimary p-1 rounded transition-colors"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Security Alert Notification (notification on DOB change) */}
              {dobSecurityAlert && (
                <div className="p-4 bg-info/10 border border-info/30 rounded-xl flex items-start justify-between gap-3 text-xs text-textPrimary animate-fadeIn shadow-sm">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-info shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="font-bold text-info">Уведомление безопасности</span>
                      <p className="text-textSecondary leading-relaxed">{dobSecurityAlert}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setDobSecurityAlert(null)}
                    className="text-textTertiary hover:text-textPrimary p-1 rounded transition-colors"
                  >
                    ✕
                  </button>
                </div>
              )}

              <div className="bg-surface-1 border border-borderDef rounded-card p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-h4 font-bold text-textPrimary">Данные для входа и контакты</h3>
                    <p className="text-caption text-textSecondary mt-0.5">Управление основными учетными данными и защитой доступа</p>
                  </div>

                  {/* Dev Mode Scenario Switcher for QA */}
                  <div className="flex items-center gap-2 p-1.5 bg-surface-2 border border-borderDef rounded-lg shrink-0 flex-wrap">
                    <span className="text-overline font-mono text-textTertiary uppercase px-1">Тест:</span>
                    <button
                      type="button"
                      onClick={() => { setHasLocalPassword(true); showToast('Режим: Пароль активен', 'info'); }}
                      className={`text-xs px-2.5 py-1 rounded font-medium transition-colors ${hasLocalPassword ? 'bg-surface-3 text-textPrimary shadow-sm' : 'text-textTertiary hover:text-textPrimary'}`}
                    >
                      Есть пароль
                    </button>
                    <button
                      type="button"
                      onClick={() => { setHasLocalPassword(false); showToast('Режим: Только соцсеть (OAuth-only)', 'warning'); }}
                      className={`text-xs px-2.5 py-1 rounded font-medium transition-colors ${!hasLocalPassword ? 'bg-warning/20 text-warning border border-warning/40' : 'text-textTertiary hover:text-textPrimary'}`}
                    >
                      OAuth-only
                    </button>
                    <span className="w-px h-4 bg-borderDef" />
                    <button
                      type="button"
                      onClick={() => {
                        if (currentDOB) {
                          setCurrentDOB(null);
                          showToast('Режим: Без даты (Legacy-аккаунт)', 'warning');
                        } else {
                          setCurrentDOB('2002-05-15');
                          showToast('Режим: Дата рождения указана', 'info');
                        }
                      }}
                      className={`text-xs px-2.5 py-1 rounded font-medium transition-colors ${
                        !currentDOB ? 'bg-warning/20 text-warning border border-warning/40' : 'text-textTertiary hover:text-textPrimary'
                      }`}
                    >
                      {currentDOB ? 'DOB: Заполнен' : 'DOB: Legacy'}
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-col gap-4">
                  {/* --- EMAIL CARD --- */}
                  <div className="p-5 bg-surface-2 rounded-xl border border-borderDef space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-surface-3 flex items-center justify-center shrink-0 border border-borderDef text-textPrimary">
                          <Mail className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-body font-bold text-textPrimary">Email адрес</span>
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-success/10 text-success border border-success/30 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Основной
                            </span>
                          </div>
                          <div className="text-body-sm font-mono text-textPrimary mt-0.5">{currentEmail}</div>
                        </div>
                      </div>
                      <div className="shrink-0 flex items-center gap-2">
                        <Button variant="secondary" size="sm" onClick={handleOpenEmailModal}>
                          Изменить Email
                        </Button>
                      </div>
                    </div>

                    {/* Pending Email Banner if in verification process */}
                    {pendingEmail && (
                      <div className="p-3.5 bg-warning/10 border border-warning/30 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-fadeIn">
                        <div className="flex items-center gap-2 text-warning">
                          <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                          <span>
                            Ожидает подтверждения: <strong className="font-mono text-textPrimary">{pendingEmail}</strong>. 
                            До подтверждения основным остаётся {currentEmail}.
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => setEmailModalState(prev => ({ ...prev, isOpen: true, step: 'verify' }))}
                            className="px-2.5 py-1 bg-warning text-black rounded font-bold text-caption hover:bg-warning/90 transition-colors uppercase font-mono"
                          >
                            Ввести код
                          </button>
                          <button
                            onClick={() => { setPendingEmail(null); showToast('Смена email отменена', 'info'); }}
                            className="text-textTertiary hover:text-danger text-caption font-medium underline"
                          >
                            Отменить
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* --- PHONE CARD --- */}
                  <div className="p-5 bg-surface-2 rounded-xl border border-borderDef">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-surface-3 flex items-center justify-center shrink-0 border border-borderDef text-textPrimary">
                          <Smartphone className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-body font-bold text-textPrimary">Номер телефона</span>
                            {currentPhone ? (
                              <>
                                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-success/10 text-success border border-success/30">
                                  Подтвержден
                                </span>
                                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-surface-3 text-textSecondary border border-borderDef flex items-center gap-1">
                                  <Lock className="w-2.5 h-2.5" /> Приватный
                                </span>
                              </>
                            ) : (
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-surface-3 text-textTertiary">
                                Не привязан
                              </span>
                            )}
                          </div>
                          <div className="text-body-sm font-mono text-textPrimary mt-0.5">
                            {currentPhone || 'Телефон не указан'}
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0 flex items-center gap-2">
                        {currentPhone ? (
                          <>
                            <Button variant="secondary" size="sm" onClick={handleOpenPhoneModal}>
                              Изменить
                            </Button>
                            <Button variant="secondary" size="sm" onClick={handleRemovePhone} className="text-danger hover:border-danger">
                              Удалить
                            </Button>
                          </>
                        ) : (
                          <Button variant="primary" size="sm" onClick={handleOpenPhoneModal}>
                            Привязать телефон
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* --- PASSWORD CARD --- */}
                  <div className="p-5 bg-surface-2 rounded-xl border border-borderDef space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-surface-3 flex items-center justify-center shrink-0 border border-borderDef text-textPrimary">
                          <KeyRound className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-body font-bold text-textPrimary">Пароль аккаунта</span>
                            {hasLocalPassword ? (
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-success/10 text-success border border-success/30 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Установлен
                              </span>
                            ) : (
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-warning/10 text-warning border border-warning/30 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> Не установлен
                              </span>
                            )}
                          </div>
                          <div className="text-caption text-textSecondary mt-0.5">
                            {hasLocalPassword
                              ? 'Обновлен 2 месяца назад • Используется для входа по email и подтверждения операций'
                              : 'Аккаунт создан через соцсеть. Задайте пароль для входа по связке email + пароль'}
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0 flex items-center gap-2">
                        {hasLocalPassword ? (
                          <Button variant="secondary" size="sm" onClick={handleOpenPasswordModal}>
                            Изменить пароль
                          </Button>
                        ) : (
                          <Button variant="primary" size="sm" onClick={handleOpenPasswordModal}>
                            Установить пароль
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* --- DATE OF BIRTH CARD (BR-ACC-003, BR-ACC-034, FR-ACC-032, AC-ACC-051) --- */}
                  <div className="p-5 bg-surface-2 rounded-xl border border-borderDef space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-surface-3 flex items-center justify-center shrink-0 border border-borderDef text-textPrimary">
                          <Calendar className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-body font-bold text-textPrimary">Дата рождения</span>
                            {currentDOB ? (
                              <>
                                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-success/10 text-success border border-success/30 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> Указана
                                </span>
                                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-surface-3 text-textSecondary border border-borderDef flex items-center gap-1">
                                  <Lock className="w-2.5 h-2.5" /> Приватное поле
                                </span>
                              </>
                            ) : (
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-warning/10 text-warning border border-warning/30 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> Не указана (Legacy)
                              </span>
                            )}
                          </div>
                          <div className="text-caption text-textSecondary mt-0.5">
                            {currentDOB 
                              ? `${formatDOB(currentDOB)} (${calculateAge(currentDOB)} лет) • Не подлежит свободной правке в профиле`
                              : 'Не заполнена. Требуется подтверждение возраста (12+) для доступа к функциям платформы'}
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0 flex items-center gap-2">
                        {currentDOB ? (
                          <Button variant="secondary" size="sm" onClick={handleOpenDOBModal}>
                            Изменить дату
                          </Button>
                        ) : (
                          <Button variant="primary" size="sm" onClick={handleOpenDOBModal}>
                            Указать дату
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* --- 2FA SETUP BLOCK (BR-ACC-030, BR-ACC-031, BR-ACC-032) --- */}
              <div className="bg-surface-1 border border-borderDef rounded-card p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-borderDef">
                  <div>
                    <h3 className="text-h4 font-bold text-textPrimary mb-1.5 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-accent" />
                      Двухфакторная аутентификация (2FA)
                    </h3>
                    <p className="text-body-sm text-textSecondary">
                      Защитите свой аккаунт дополнительным уровнем безопасности с помощью одноразовых кодов (TOTP).
                    </p>
                  </div>
                </div>

                <div className="p-5 bg-surface-2 rounded-xl border border-borderDef space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                        is2FAEnabled
                          ? 'bg-success/15 border-success/30 text-success'
                          : 'bg-surface-3 border-borderDef text-textSecondary'
                      }`}>
                        {is2FAEnabled ? <ShieldCheck className="w-6 h-6 text-success" /> : <Smartphone className="w-6 h-6 text-accent" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-body font-bold text-textPrimary">
                            Приложение-аутентификатор (TOTP)
                          </span>
                          {is2FAEnabled ? (
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-success/15 text-success border border-success/30 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                              Включена
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-warning/15 text-warning border border-warning/30 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              Отключена
                            </span>
                          )}
                          {is2FAMandatory ? (
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30 flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5" /> Обязательно ({accountRole === 'seller' ? 'Продавец' : 'Администратор'})
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-surface-3 text-textSecondary border border-borderDef">
                              Добровольная защита
                            </span>
                          )}
                        </div>
                        <div className="text-caption text-textSecondary mt-0.5">
                          {is2FAEnabled
                            ? 'Google Authenticator, Яндекс Ключ или Authy генерируют 6-значные коды для входа'
                            : 'При входе будет запрашиваться одноразовый пароль из приложения на вашем смартфоне'}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {is2FAEnabled ? (
                        <>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setIsRecoveryModalOpen(true)}
                          >
                            <Key className="w-3.5 h-3.5 mr-1.5 text-accent" /> Коды восстановления
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="text-danger border-danger/25 hover:bg-danger/10 hover:border-danger/40"
                            onClick={handleAttemptDisable2FA}
                          >
                            Отключить
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={handleOpen2FASetup}
                        >
                          <Shield className="w-3.5 h-3.5 mr-1.5" /> Настроить 2FA
                        </Button>
                      )}
                    </div>
                  </div>

                  {is2FAEnabled && (
                    <div className="pt-3 border-t border-borderDef/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-textSecondary">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                        <span>
                          {is2FAMandatory
                            ? 'Обязательное условие для защиты выплат, каталога и административных прав'
                            : 'Второй фактор обязателен при входе с новых устройств'}
                        </span>
                      </div>
                      <div className="text-textTertiary font-mono text-caption">
                        Доступно кодов восстановления: {recoveryCodes.length} из 10
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB: SESSIONS */}
          {activeTab === 'sessions' && (
            <div className="space-y-6 animate-fadeIn">
              {/* UNKNOWN / NEW DEVICE ALERT BANNER */}
              {newDeviceAlert && (
                <div className="p-5 bg-warning/10 border-2 border-warning/40 rounded-card space-y-3 animate-slideDown shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-warning/20 border border-warning/40 flex items-center justify-center shrink-0 text-warning mt-0.5">
                        <AlertTriangle className="w-5 h-5 animate-pulse" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-body font-bold text-textPrimary">
                            Обнаружен вход с нового устройства
                          </span>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-warning/20 text-warning border border-warning/40">
                            Требует внимания
                          </span>
                        </div>
                        <p className="text-xs text-textSecondary leading-relaxed">
                          Был выполнен вход с незнакомого устройства: <strong className="text-textPrimary">{newDeviceAlert.device}</strong> ({newDeviceAlert.browser}). Местоположение: <span className="text-textPrimary font-medium">{newDeviceAlert.location}</span>, IP: <span className="font-mono text-textPrimary">{newDeviceAlert.ip}</span>.
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleDismissNewDeviceAlert}
                        className="text-xs"
                      >
                        Это был я
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={handleQuickRevokeNewDevice}
                        className="text-xs"
                      >
                        <LogOut className="w-3.5 h-3.5 mr-1" /> Завершить сеанс
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* MAIN SESSIONS CARD */}
              <div className="bg-surface-1 border border-borderDef rounded-card p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-borderDef">
                  <div>
                    <h3 className="text-h4 font-bold text-textPrimary mb-1.5 flex items-center gap-2">
                      <Monitor className="w-5 h-5 text-accent" />
                      Сеансы и устройства
                    </h3>
                    <p className="text-body-sm text-textSecondary">
                      Список всех активных авторизаций в вашей учетной записи. Вы можете удаленно завершить сеанс на любом устройстве.
                    </p>
                  </div>
                  {mockSessions.filter(s => !s.isCurrent).length > 0 && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="text-danger border-danger/30 hover:bg-danger/10 hover:border-danger/50 shrink-0 self-start sm:self-center"
                      onClick={() => setIsRevokeAllModalOpen(true)}
                    >
                      <LogOut className="w-4 h-4 mr-1.5" />
                      Завершить другие сеансы ({mockSessions.filter(s => !s.isCurrent).length})
                    </Button>
                  )}
                </div>

                {/* SESSIONS LIST */}
                <div className="space-y-3.5">
                  {mockSessions.map(session => (
                    <div
                      key={session.id}
                      className={`p-5 rounded-xl border transition-all ${
                        session.isCurrent
                          ? 'bg-surface-2 border-accent/30 shadow-sm'
                          : session.isNew
                          ? 'bg-warning/5 border-warning/40 shadow-sm'
                          : 'bg-surface-2 border-borderDef hover:border-borderStrong'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                            session.isCurrent
                              ? 'bg-accent/10 border-accent/30 text-accent'
                              : session.isNew
                              ? 'bg-warning/10 border-warning/30 text-warning'
                              : 'bg-surface-3 border-borderDef text-textSecondary'
                          }`}>
                            {session.deviceType === 'mobile' ? (
                              <Smartphone className="w-6 h-6" />
                            ) : session.deviceType === 'laptop' ? (
                              <Laptop className="w-6 h-6" />
                            ) : (
                              <Monitor className="w-6 h-6" />
                            )}
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-body font-bold text-textPrimary">
                                {session.device}
                              </span>
                              {session.isCurrent && (
                                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-success/15 text-success border border-success/30 flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                                  Текущий сеанс
                                </span>
                              )}
                              {session.isNew && !session.isCurrent && (
                                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-warning/15 text-warning border border-warning/30 flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" />
                                  Новое устройство
                                </span>
                              )}
                            </div>

                            <div className="text-xs text-textSecondary flex items-center gap-2 flex-wrap font-medium">
                              <span>{session.browser}</span>
                            </div>

                            <div className="flex items-center gap-3 text-caption text-textTertiary font-mono flex-wrap pt-0.5">
                              <span className="bg-surface-3/60 px-2 py-0.5 rounded border border-borderDef/60 text-textSecondary">
                                {session.ip}
                              </span>
                              <span className="flex items-center gap-1 text-textSecondary">
                                <MapPin className="w-3 h-3 text-textTertiary" />
                                {session.location}
                              </span>
                              <span className="flex items-center gap-1 text-textSecondary">
                                <Clock className="w-3 h-3 text-textTertiary" />
                                {session.date}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center self-end sm:self-center">
                          {session.isCurrent ? (
                            <div className="text-xs text-textTertiary font-medium px-3 py-1.5 rounded-lg bg-surface-3/50 border border-borderDef">
                              Это приложение
                            </div>
                          ) : (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => setSessionToRevoke(session)}
                              className="text-danger border-danger/25 hover:bg-danger/10 hover:border-danger/50"
                            >
                              <LogOut className="w-3.5 h-3.5 mr-1" /> Завершить сеанс
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: LINKED ACCOUNTS (FE-ACC-002: AC-ACC-006, AC-ACC-007, AC-ACC-008) */}
          {activeTab === 'linkedAccounts' && (
            <div className="bg-surface-1 border border-borderDef rounded-card p-6 sm:p-8 shadow-sm animate-fadeIn space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-borderDef">
                <div>
                  <h3 className="text-h4 font-bold text-textPrimary flex items-center gap-2">
                    <Link2 className="w-5 h-5 text-accent" />
                    Связанные аккаунты и способы входа
                  </h3>
                  <p className="text-caption text-textSecondary mt-1">
                    Управление внешними сервисами авторизации и методами доступа к аккаунту.
                  </p>
                </div>

                {/* Dev Mode Scenario Switcher for QA */}
                <div className="flex items-center gap-2 p-1.5 bg-surface-2 border border-borderDef rounded-lg shrink-0">
                  <span className="text-overline font-mono text-textTertiary uppercase px-1">Тест:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setHasLocalPassword(true);
                      setLinkedProviders([
                        { id: 'vk', name: 'ВКонтакте (VK ID)', badge: 'VK', iconBg: 'bg-[#0077FF]', isLinked: true, linkedIdentity: 'vk.com/id4829104', linkedDate: '14 мая 2025' },
                        { id: 'yandex', name: 'Яндекс ID', badge: 'Я', iconBg: 'bg-[#FC3F1D]', isLinked: false },
                        { id: 'gosuslugi', name: 'Госуслуги (ЕСИА)', badge: 'ГУ', iconBg: 'bg-[#0D4CD3]', isLinked: false },
                      ]);
                      showToast('Режим: Несколько способов (Пароль + VK)', 'info');
                    }}
                    className={`text-xs px-2.5 py-1 rounded font-medium transition-colors ${
                      hasLocalPassword ? 'bg-surface-3 text-textPrimary shadow-sm' : 'text-textTertiary hover:text-textPrimary'
                    }`}
                  >
                    Пароль + VK
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setHasLocalPassword(false);
                      setLinkedProviders([
                        { id: 'vk', name: 'ВКонтакте (VK ID)', badge: 'VK', iconBg: 'bg-[#0077FF]', isLinked: true, linkedIdentity: 'vk.com/id4829104', linkedDate: '14 мая 2025' },
                        { id: 'yandex', name: 'Яндекс ID', badge: 'Я', iconBg: 'bg-[#FC3F1D]', isLinked: false },
                        { id: 'gosuslugi', name: 'Госуслуги (ЕСИА)', badge: 'ГУ', iconBg: 'bg-[#0D4CD3]', isLinked: false },
                      ]);
                      showToast('Режим: Только VK (Единственный способ входа)', 'warning');
                    }}
                    className={`text-xs px-2.5 py-1 rounded font-medium transition-colors ${
                      !hasLocalPassword ? 'bg-warning/20 text-warning border border-warning/40' : 'text-textTertiary hover:text-textPrimary'
                    }`}
                  >
                    Только VK (OAuth-only)
                  </button>
                </div>
              </div>

              {/* Status Counter Banner */}
              <div className="flex items-center justify-between p-3.5 bg-surface-2/60 border border-borderDef rounded-xl text-xs">
                <div className="flex items-center gap-2.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${totalActiveLoginMethods > 1 ? 'bg-success' : 'bg-warning animate-pulse'}`} />
                  <span className="text-textSecondary">
                    Активных способов входа: <strong className="text-textPrimary">{totalActiveLoginMethods}</strong>
                  </span>
                </div>
                {totalActiveLoginMethods === 1 && (
                  <span className="text-caption text-warning bg-warning/10 border border-warning/30 px-2 py-0.5 rounded font-medium">
                    Защита последнего метода
                  </span>
                )}
              </div>

              {/* List of Login Methods */}
              <div className="space-y-3.5">
                {/* 1. Local Password Method */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-surface-2 rounded-xl border border-borderDef gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 bg-surface-3 border border-borderDef rounded-xl flex items-center justify-center text-textPrimary shrink-0">
                      <Lock className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-body font-bold text-textPrimary">Пароль аккаунта</h4>
                        {hasLocalPassword ? (
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-success/10 text-success border border-success/30">
                            Активен
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-warning/10 text-warning border border-warning/30">
                            Не установлен
                          </span>
                        )}
                      </div>
                      <p className="text-caption text-textSecondary mt-0.5">
                        {hasLocalPassword 
                          ? 'Используется для входа по email и подтверждения важных действий'
                          : 'Аккаунт создан через соцсеть. Вы можете задать пароль для прямого входа'}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    {hasLocalPassword ? (
                      <Button variant="secondary" size="sm" onClick={() => setActiveTab('security')}>
                        Изменить пароль
                      </Button>
                    ) : (
                      <Button variant="primary" size="sm" onClick={() => { setActiveTab('security'); setIsOAuthOnly(true); }}>
                        Установить пароль
                      </Button>
                    )}
                  </div>
                </div>

                {/* 2. External OAuth Providers */}
                {linkedProviders.map((provider) => {
                  const isOnlyLoginMethod = provider.isLinked && totalActiveLoginMethods <= 1;

                  return (
                    <div 
                      key={provider.id} 
                      className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all gap-4 ${
                        provider.isLinked ? 'bg-surface-2 border-borderDef' : 'bg-surface-2/40 border-borderDef/60'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`w-10 h-10 ${provider.iconBg} rounded-xl flex items-center justify-center text-white font-bold font-mono text-sm shrink-0 shadow-sm`}>
                          {provider.badge}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-body font-bold text-textPrimary">{provider.name}</h4>
                            {provider.isLinked ? (
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-success/10 text-success border border-success/30">
                                Подключен
                              </span>
                            ) : (
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-surface-3 text-textTertiary">
                                Не привязан
                              </span>
                            )}
                          </div>
                          <p className="text-caption text-textSecondary mt-0.5">
                            {provider.isLinked 
                              ? `Привязан: ${provider.linkedIdentity} • ${provider.linkedDate}` 
                              : 'Быстрый вход в один клик без ввода пароля'}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        {provider.isLinked ? (
                          <div className="flex flex-col items-end gap-1">
                            <Button
                              variant="secondary"
                              size="sm"
                              disabled={isOnlyLoginMethod}
                              onClick={() => setProviderToUnlink(provider)}
                              className={isOnlyLoginMethod ? 'opacity-50 cursor-not-allowed' : 'hover:border-danger hover:text-danger'}
                            >
                              <Unlink className="w-3.5 h-3.5 mr-1.5" />
                              Отвязать
                            </Button>
                            {isOnlyLoginMethod && (
                              <span className="text-[10px] text-warning flex items-center gap-1">
                                <Lock className="w-3 h-3" /> Единственный способ входа
                              </span>
                            )}
                          </div>
                        ) : (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => openLinkModal(provider)}
                          >
                            <Link2 className="w-3.5 h-3.5 mr-1.5" />
                            Подключить
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Warning box if OAuth-only with single method */}
              {totalActiveLoginMethods === 1 && (
                <div className="p-4 bg-warning/10 border border-warning/30 rounded-xl flex items-start gap-3 text-xs text-textPrimary animate-fadeIn">
                  <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold text-warning tracking-wide">
                      Защита аккаунта
                    </span>
                    <p className="text-textSecondary leading-relaxed">
                      Для защиты от случайной потери доступа платформа запрещает отвязывать единственный активный способ входа. 
                      Чтобы отвязать текущий сервис, сначала задайте пароль или подключите альтернативный способ авторизации.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: NOTIFICATIONS (FE-ACC-011: BR-ACC-066, FR-ACC-066) */}
          {activeTab === 'notifications' && (
            <div className="bg-surface-1 border border-borderDef rounded-card p-6 sm:p-8 shadow-sm animate-fadeIn space-y-8">
              
              {/* ЗАГОЛОВОК ВКЛАДКИ */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-borderDef">
                <div>
                  <h3 className="text-h4 font-bold text-textPrimary flex items-center gap-2">
                    <Mail className="w-5 h-5 text-accent" />
                    Центр управления уведомлениями (FE-ACC-011)
                  </h3>
                  <p className="text-caption text-textSecondary mt-1">
                    Настройка каналов доставки оповещений, подписок на игры и защита обязательных системных алертов безопасности.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleResetNotificationPreferences}
                    className="text-xs font-mono"
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1" /> Сбросить
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSaveNotificationPreferences}
                    className="text-xs font-mono font-bold"
                  >
                    <Check className="w-3.5 h-3.5 mr-1" /> Сохранить
                  </Button>
                </div>
              </div>

              {/* 1. СЕКЦИЯ: ОБЯЗАТЕЛЬНЫЕ УВЕДОМЛЕНИЯ (MANDATORY NOTIFICATIONS: BR-ACC-066) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-textPrimary flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-accent" />
                      Обязательные системные уведомления (Mandatory)
                    </h4>
                    <p className="text-xs text-textSecondary mt-0.5">
                      Критические события безопасности и аккаунта, доставка которых гарантирована и не может быть отключена пользователем (BR-ACC-066).
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-accent/15 text-accent border border-accent/30 shrink-0">
                    Fail-Closed Safety
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  
                  {/* Mandatory 1: Безопасность и Вход */}
                  <div className="p-4 bg-surface-2 rounded-xl border border-borderDef space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-accent/15 text-accent flex items-center justify-center shrink-0">
                          <Lock className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-textPrimary">Безопасность и вход</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-surface-3 text-textTertiary border border-borderDef">
                        Locked
                      </span>
                    </div>
                    <p className="text-caption text-textSecondary leading-relaxed">
                      Смена пароля, email, телефона, вход с нового устройства (SC-ACC-053), привязка 2FA и провайдеров.
                    </p>
                    <div className="pt-2 border-t border-borderDef/60 flex items-center justify-between text-overline font-mono">
                      <span className="text-textTertiary">Каналы: In-App, Email</span>
                      <span className="text-success font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Активно
                      </span>
                    </div>
                  </div>

                  {/* Mandatory 2: Статус аккаунта и модерация */}
                  <div className="p-4 bg-surface-2 rounded-xl border border-borderDef space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-warning/15 text-warning flex items-center justify-center shrink-0">
                          <ShieldAlert className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-textPrimary">Статус аккаунта</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-surface-3 text-textTertiary border border-borderDef">
                        Locked
                      </span>
                    </div>
                    <p className="text-caption text-textSecondary leading-relaxed">
                      Блокировки (Suspension / Ban), статус апелляций, запуск и отмена 30-дневного удаления аккаунта.
                    </p>
                    <div className="pt-2 border-t border-borderDef/60 flex items-center justify-between text-overline font-mono">
                      <span className="text-textTertiary">Каналы: In-App, Email</span>
                      <span className="text-success font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Активно
                      </span>
                    </div>
                  </div>

                  {/* Mandatory 3: Финансы и Выплаты */}
                  <div className="p-4 bg-surface-2 rounded-xl border border-borderDef space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-success/15 text-success flex items-center justify-center shrink-0">
                          <DollarSign className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-textPrimary">Финансы и выплаты</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-surface-3 text-textTertiary border border-borderDef">
                        Locked
                      </span>
                    </div>
                    <p className="text-caption text-textSecondary leading-relaxed">
                      Статус выплат продавца, заморозка баланса, чеки покупок и возврат средств (Refunds).
                    </p>
                    <div className="pt-2 border-t border-borderDef/60 flex items-center justify-between text-overline font-mono">
                      <span className="text-textTertiary">Каналы: In-App, Email</span>
                      <span className="text-success font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Активно
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* 2. СЕКЦИЯ: НАСТРАИВАЕМЫЕ УВЕДОМЛЕНИЯ (CONFIGURABLE PREFERENCES: SC-ACC-028) */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-textPrimary flex items-center gap-2">
                      <Bell className="w-4 h-4 text-accent" />
                      Настраиваемые категории и каналы доставки
                    </h4>
                    <p className="text-xs text-textSecondary mt-0.5">
                      Выберите удобные каналы получения уведомлений для каждого типа событий платформы.
                    </p>
                  </div>
                </div>

                {/* ТАБЛИЦА НАСТРОЕК КАНАЛОВ */}
                <div className="bg-surface-2 border border-borderDef rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-borderDef bg-surface-3/60 text-textTertiary font-mono uppercase tracking-wider text-[10px]">
                          <th className="py-3 px-4">Категория события</th>
                          <th className="py-3 px-4 text-center w-28">
                            <span className="flex items-center justify-center gap-1">
                              <Bell className="w-3 h-3 text-accent" /> In-App
                            </span>
                          </th>
                          <th className="py-3 px-4 text-center w-28">
                            <span className="flex items-center justify-center gap-1">
                              <Mail className="w-3 h-3 text-accent" /> Email
                            </span>
                          </th>
                          <th className="py-3 px-4 text-center w-28">
                            <span className="flex items-center justify-center gap-1">
                              <Smartphone className="w-3 h-3 text-accent" /> Push
                            </span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-borderDef/60">
                        {configurablePrefs.map((pref) => (
                          <tr key={pref.id} className="hover:bg-surface-3/30 transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="space-y-0.5">
                                <span className="font-bold text-xs text-textPrimary block">{pref.title}</span>
                                <span className="text-caption text-textSecondary leading-relaxed block">{pref.description}</span>
                              </div>
                            </td>

                            {/* In-App Channel */}
                            <td className="py-3.5 px-4 text-center">
                              <div className="flex justify-center">
                                <Switch
                                  checked={pref.inApp}
                                  onChange={() => handleTogglePref(pref.id, 'inApp')}
                                />
                              </div>
                            </td>

                            {/* Email Channel */}
                            <td className="py-3.5 px-4 text-center">
                              <div className="flex justify-center">
                                <Switch
                                  checked={pref.email}
                                  onChange={() => handleTogglePref(pref.id, 'email')}
                                />
                              </div>
                            </td>

                            {/* Push Channel */}
                            <td className="py-3.5 px-4 text-center">
                              <div className="flex justify-center">
                                <Switch
                                  checked={pref.push}
                                  onChange={() => handleTogglePref(pref.id, 'push')}
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ФУТЕР СОХРАНЕНИЯ */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-overline font-mono text-textTertiary">
                    Изменения вступают в силу немедленно после сохранения
                  </span>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSaveNotificationPreferences}
                    className="font-bold"
                  >
                    Сохранить настройки уведомлений
                  </Button>
                </div>

              </div>

              {/* 3. СЕКЦИЯ: УПРАВЛЕНИЕ ПОДПИСКАМИ НА ИГРЫ (GAME SUBSCRIPTIONS: SC-ACC-027, BR-ACC-067) */}
              <div className="space-y-4 pt-4 border-t border-borderDef">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-textPrimary flex items-center gap-2">
                      <BellRing className="w-4 h-4 text-accent" />
                      Отслеживаемые игры (Game Subscriptions: SC-ACC-027)
                    </h4>
                    <p className="text-xs text-textSecondary mt-0.5">
                      Игры, на обновления которых вы подписаны. Оповещения приходят о новых версиях, хотфиксах и новостях разработки.
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-surface-2 text-textSecondary border border-borderDef shrink-0">
                    Активных: {subscribedGames.length}
                  </span>
                </div>

                {/* BR-ACC-067 ПОЯСНЕНИЕ */}
                <div className="p-3.5 bg-surface-2/70 rounded-xl border border-borderDef flex items-start gap-3 text-xs text-textSecondary">
                  <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-textPrimary">Правило платформы (BR-ACC-067):</strong> Подписка на игру (Game Subscription)
                    является отдельной независимой связью от подписки на страницу автора (User Follow). Вы можете отслеживать обновления конкретной игры,
                    даже если не подписаны на автора, и наоборот.
                  </div>
                </div>

                {/* СПИСОК ПОДПИСОК */}
                {subscribedGames.length > 0 ? (
                  <div className="space-y-3">
                    {subscribedGames.map(game => (
                      <div
                        key={game.id}
                        className="p-4 bg-surface-2 rounded-xl border border-borderDef hover:border-borderStrong transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-11 h-11 rounded-xl bg-surface-3 border border-borderDef flex items-center justify-center text-accent shrink-0 shadow-sm">
                            <Gamepad2 className="w-5 h-5" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-bold text-textPrimary">{game.title}</span>
                              <span className="text-xs text-textTertiary">• {game.developer}</span>
                              {game.unreadUpdates && (
                                <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-accent/15 text-accent border border-accent/30">
                                  Свежий патч
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-textSecondary font-mono flex items-center gap-1.5">
                              <span className="text-accent">{game.latestUpdate}</span>
                              <span className="text-textTertiary">({game.updateDate})</span>
                            </p>
                            <p className="text-caption text-textTertiary">
                              Подписка оформлена: {game.subscribedAt}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                          <div className="flex items-center gap-2 mr-2">
                            <label className="text-caption text-textSecondary cursor-pointer select-none flex items-center gap-1.5">
                              <input
                                type="checkbox"
                                checked={game.patchesEnabled}
                                onChange={() => handleToggleGamePatchAlerts(game.id)}
                                className="w-3.5 h-3.5 rounded border-borderDef bg-surface-1 checked:bg-accent cursor-pointer"
                              />
                              Патчи
                            </label>
                            <label className="text-caption text-textSecondary cursor-pointer select-none flex items-center gap-1.5 ml-2">
                              <input
                                type="checkbox"
                                checked={game.announcementsEnabled}
                                onChange={() => handleToggleGameAnnouncementAlerts(game.id)}
                                className="w-3.5 h-3.5 rounded border-borderDef bg-surface-1 checked:bg-accent cursor-pointer"
                              />
                              Новости
                            </label>
                          </div>

                          <a
                            href="#/game/1"
                            className="p-2 rounded-lg border border-borderDef text-textSecondary hover:text-textPrimary hover:bg-surface-3 transition-colors"
                            title="Открыть страницу игры"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>

                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleUnsubscribeGame(game.id, game.title)}
                            className="text-xs text-danger border-danger/25 hover:bg-danger/10 hover:border-danger/50"
                          >
                            <BellOff className="w-3.5 h-3.5 mr-1" /> Отписаться
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-surface-2/50 rounded-xl border border-dashed border-borderDef space-y-2">
                    <p className="text-xs text-textSecondary">Вы еще не подписаны ни на одну игру.</p>
                    <a href="#/" className="text-xs text-accent font-bold hover:underline inline-block">
                      Перейти в каталог игр →
                    </a>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB: RESTRICTIONS (FE-ACC-008: BR-ACC-053...056, FR-ACC-049...053) */}
          {activeTab === 'restrictions' && (
            <div className="bg-surface-1 border border-borderDef rounded-card p-6 sm:p-8 shadow-sm animate-fadeIn space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-borderDef">
                <div>
                  <h3 className="text-h4 font-bold text-textPrimary flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-accent" />
                    Статус аккаунта и ограничения возможностей
                  </h3>
                  <p className="text-caption text-textSecondary mt-1">
                    Информация о действующих взысканиях, точечных ограничениях функций и сохранности цифровых прав.
                  </p>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    if ((window as any).__hubigrNavigate) (window as any).__hubigrNavigate('/account-restricted');
                  }}
                  className="shrink-0 text-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5 mr-1" /> Экран блокировки
                </Button>
              </div>

              {/* Статус общего состояния учетной записи (BR-ACC-053) */}
              <div className="p-4 bg-surface-2 rounded-xl border border-borderDef flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-success/15 text-success border border-success/30 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-textPrimary">Общий статус аккаунта</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-success/10 text-success border border-success/30">
                        Активен (Active)
                      </span>
                    </div>
                    <p className="text-xs text-textSecondary mt-1 leading-relaxed">
                      Полная блокировка аккаунта отсутствует. Вход в систему, доступ к каталогу и библиотеке игр разрешены.
                    </p>
                  </div>
                </div>
              </div>

              {/* Список точечных ограничений возможностей (BR-ACC-056, FR-ACC-053) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-textSecondary">
                    Точечные ограничения возможностей (Scoped Capabilities)
                  </h4>
                  <span className="text-overline font-mono text-textTertiary">
                    Без полного бана аккаунта (BR-ACC-056)
                  </span>
                </div>

                {/* Capability 1: Комментирование и отзывы */}
                <div className="p-4 bg-surface-2 rounded-xl border border-borderDef space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-textPrimary">Отзывы и комментарии</span>
                        {scopedRestrictions.comments ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-warning/10 text-warning border border-warning/30">
                            Ограничено
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono text-success bg-success/10 border border-success/30">
                            Активно
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-textSecondary mt-0.5">
                        Возможность оставлять отзывы к играм и отвечать в темах сообщества.
                      </p>
                    </div>
                  </div>

                  {scopedRestrictions.comments && (
                    <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg text-xs space-y-2">
                      <div className="flex items-start justify-between text-overline font-mono text-textSecondary">
                        <span>Дело: #RES-COM-1049</span>
                        <span className="text-warning font-semibold">Срок: до 18 сентября 2026</span>
                      </div>
                      <p className="text-textPrimary">
                        Причина: Многократные жалобы пользователей на спам и недопустимые ссылки в отзывах.
                      </p>
                      <div className="pt-1 border-t border-warning/20 flex justify-end">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setAppealCaseInfo({
                              caseId: 'RES-COM-1049',
                              title: 'Ограничение отзывов и комментариев',
                              capability: 'comments'
                            });
                            setIsAppealModalOpen(true);
                          }}
                          className="text-xs"
                        >
                          <HelpCircle className="w-3.5 h-3.5 mr-1" /> Обжаловать ограничение
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Capability 2: Публикация проектов и девлогов */}
                <div className="p-4 bg-surface-2 rounded-xl border border-borderDef space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-textPrimary">Публикация проектов и девлогов</span>
                        {scopedRestrictions.publishing ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-warning/10 text-warning border border-warning/30">
                            Ограничено
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono text-success bg-success/10 border border-success/30">
                            Активно
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-textSecondary mt-0.5">
                        Создание новых игр, публикация билдов и статей девлога в Кабинете автора.
                      </p>
                    </div>
                  </div>

                  {scopedRestrictions.publishing && (
                    <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg text-xs space-y-2">
                      <div className="flex items-start justify-between text-overline font-mono text-textSecondary">
                        <span>Дело: #RES-PUB-8041</span>
                        <span className="text-warning font-semibold">Срок: до 15 сентября 2026</span>
                      </div>
                      <p className="text-textPrimary">
                        Причина: Проведение плановой проверки соответствия публикуемых материалов правилам платформы.
                      </p>
                      <div className="pt-1 border-t border-warning/20 flex justify-end">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setAppealCaseInfo({
                              caseId: 'RES-PUB-8041',
                              title: 'Ограничение публикации проектов',
                              capability: 'publishing'
                            });
                            setIsAppealModalOpen(true);
                          }}
                          className="text-xs"
                        >
                          <HelpCircle className="w-3.5 h-3.5 mr-1" /> Обжаловать ограничение
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Capability 3: Коммерческие выплаты */}
                <div className="p-4 bg-surface-2 rounded-xl border border-borderDef space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-textPrimary">Запрос коммерческих выплат</span>
                        {scopedRestrictions.payouts ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-warning/10 text-warning border border-warning/30">
                            Заморожено
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono text-success bg-success/10 border border-success/30">
                            Активно
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-textSecondary mt-0.5">
                        Вывод средств с баланса продаж на расчетный счет продавца.
                      </p>
                    </div>
                  </div>

                  {scopedRestrictions.payouts && (
                    <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg text-xs space-y-2">
                      <div className="flex items-start justify-between text-overline font-mono text-textSecondary">
                        <span>Дело: #RES-PAY-2309</span>
                        <span className="text-warning font-semibold">Срок: до подтверждения документов</span>
                      </div>
                      <p className="text-textPrimary">
                        Причина: Проверка платёжных реквизитов или обновление юридического статуса продавца.
                      </p>
                      <div className="pt-1 border-t border-warning/20 flex justify-end">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setAppealCaseInfo({
                              caseId: 'RES-PAY-2309',
                              title: 'Заморозка коммерческих выплат',
                              capability: 'payouts'
                            });
                            setIsAppealModalOpen(true);
                          }}
                          className="text-xs"
                        >
                          <HelpCircle className="w-3.5 h-3.5 mr-1" /> Обжаловать ограничение
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* Журнал истории взысканий и апелляций (BR-ACC-058, FR-ACC-055, FR-ACC-081) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-textSecondary flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-accent" />
                    Журнал истории взысканий и апелляций
                  </h4>
                  <span className="text-overline font-mono text-textTertiary">
                    Неизменяемый реестр
                  </span>
                </div>

                <div className="bg-surface-2 border border-borderDef rounded-xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-sans">
                      <thead>
                        <tr className="border-b border-borderDef bg-surface-3/50 text-overline font-mono text-textTertiary uppercase">
                          <th className="py-2.5 px-3 font-semibold">Дело / Дата</th>
                          <th className="py-2.5 px-3 font-semibold">Тип и область</th>
                          <th className="py-2.5 px-3 font-semibold">Причина</th>
                          <th className="py-2.5 px-3 text-right font-semibold">Статус</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-borderDef/60 font-mono text-xs">
                        {punishmentHistory.map((item) => (
                          <tr key={item.id} className="hover:bg-surface-3/30 transition-colors">
                            <td className="py-3 px-3">
                              <span className="font-bold text-textPrimary block">#{item.id}</span>
                              <span className="text-[10px] text-textTertiary">{item.date}</span>
                            </td>
                            <td className="py-3 px-3">
                              <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase mb-1 ${
                                item.type === 'suspension' ? 'bg-danger/15 text-danger border border-danger/30' :
                                item.type === 'scoped_restriction' ? 'bg-warning/15 text-warning border border-warning/30' :
                                'bg-info/15 text-info border border-info/30'
                              }`}>
                                {item.type === 'suspension' ? 'Приостановка' :
                                 item.type === 'scoped_restriction' ? 'Точечное' : 'Предупреждение'}
                              </span>
                              <span className="text-textSecondary text-caption font-sans block">{item.capability}</span>
                            </td>
                            <td className="py-3 px-3 max-w-xs font-sans text-textSecondary text-caption leading-snug">
                              {item.reason}
                            </td>
                            <td className="py-3 px-3 text-right">
                              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                item.status === 'active' ? 'bg-warning/10 text-warning border border-warning/30' :
                                item.status === 'appealed_unbanned' ? 'bg-success/10 text-success border border-success/30' :
                                'bg-surface-3 text-textTertiary'
                              }`}>
                                {item.status === 'active' ? 'Действует' :
                                 item.status === 'appealed_unbanned' ? 'Снято по апелляции' : 'Урегулировано'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Сохранность цифровых прав (BR-ACC-055) */}
              <div className="p-4 bg-success/5 border border-success/20 rounded-xl text-xs space-y-1 text-textSecondary">
                <div className="flex items-center gap-2 text-success font-bold text-sm">
                  <ShieldCheck className="w-4 h-4" /> Гарантия сохранения цифровых прав (BR-ACC-055)
                </div>
                <p className="leading-relaxed">
                  При временных ограничениях возможностей или приостановке аккаунта ваши приобретенные игры, лицензии и цифровой контент надежно сохраняются в реестре платформы и будут автоматически возвращены в полном объеме после окончания срока или снятия ограничения.
                </p>
              </div>

            </div>
          )}

          {/* TAB: DELETION (FE-ACC-009: BR-ACC-059...065, FR-ACC-056...063) */}
          {activeTab === 'deletion' && (
            <div className="bg-surface-1 border border-borderDef rounded-card p-6 sm:p-8 shadow-sm animate-fadeIn space-y-6">
              
              {/* Заголовок */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-borderDef">
                <div>
                  <h3 className="text-h4 font-bold text-danger flex items-center gap-2">
                    <Trash2 className="w-5 h-5 text-danger" />
                    Удаление учетной записи
                  </h3>
                  <p className="text-xs text-textSecondary mt-1">
                    Процедура деактивации профиля и окончательного удаления данных (30-дневный период ожидания)
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-danger/10 text-danger border border-danger/30 self-start sm:self-auto">
                  Необратимое действие
                </span>
              </div>

              {/* 1. ПОСЛЕДСТВИЯ И 30-ДНЕВНЫЙ СРОК (BR-ACC-059, BR-ACC-060, BR-ACC-061) */}
              <div className="p-4 bg-surface-2 rounded-xl border border-borderDef space-y-3 text-xs">
                <span className="font-bold text-textPrimary text-sm block">Как устроена процедура удаления:</span>
                <ul className="space-y-2 text-textSecondary leading-relaxed list-disc list-inside">
                  <li>
                    <strong className="text-textPrimary">Период ожидания 30 дней:</strong> после подтверждения аккаунт переходит в статус <span className="font-mono text-warning font-bold">Ожидает удаления</span>. Данные не удаляются мгновенно.
                  </li>
                  <li>
                    <strong className="text-textPrimary">Ограничение сессии (Recovery-only):</strong> доступ к платформе, покупкам и публикациям приостанавливается. Авторизация возможна только для отмены удаления.
                  </li>
                  <li>
                    <strong className="text-textPrimary">Возможность отмены:</strong> в любой момент в течение 30 дней вы можете войти в аккаунт и отменить удаление одной кнопкой.
                  </li>
                  <li>
                    <strong className="text-textPrimary">Окончательное удаление:</strong> по истечении 30 дней профиль, личные данные и цифровой контент удаляются безвозвратно.
                  </li>
                </ul>
              </div>

              {/* 2. ПРОВЕРКА ЗАВИСИМОСТЕЙ И БЛОКЕРЫ (BR-ACC-063, BR-ACC-064, BR-ACC-065) */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-textSecondary flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-accent" />
                    Проверка зависимостей перед удалением
                  </h4>
                  <span className="text-overline font-mono text-textTertiary">
                    Обязательные системные инварианты
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Зависимость 1: Game Ownership (BR-ACC-063) */}
                  <div className={`p-4 rounded-xl border transition-colors ${
                    deletionDependencies.hasPublishedGames
                      ? 'bg-danger/10 border-danger/40'
                      : 'bg-surface-2 border-borderDef'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          deletionDependencies.hasPublishedGames ? 'bg-danger/20 text-danger' : 'bg-surface-3 text-textSecondary'
                        }`}>
                          <Gamepad2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-textPrimary">Игры автора (Game Ownership)</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              deletionDependencies.hasPublishedGames
                                ? 'bg-danger/20 text-danger border border-danger/40'
                                : 'bg-success/10 text-success border border-success/30'
                            }`}>
                              {deletionDependencies.hasPublishedGames ? 'Блокирует удаление' : 'Чисто'}
                            </span>
                          </div>
                          <p className="text-xs text-textSecondary mt-0.5 leading-relaxed">
                            {deletionDependencies.hasPublishedGames 
                              ? 'У вас есть опубликованные игры. Чтобы не осиротить проекты, передайте права команде/автору или снимите с публикации.'
                              : 'У вас нет активных опубликованных игр, препятствующих удалению.'}
                          </p>
                        </div>
                      </div>

                      {deletionDependencies.hasPublishedGames && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            if ((window as any).__hubigrNavigate) (window as any).__hubigrNavigate('/creator-dashboard');
                          }}
                          className="shrink-0 text-xs"
                        >
                          Кабинет автора
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Зависимость 2: Team Ownership (BR-ACC-064) */}
                  <div className={`p-4 rounded-xl border transition-colors ${
                    deletionDependencies.isSoleTeamOwner
                      ? 'bg-danger/10 border-danger/40'
                      : 'bg-surface-2 border-borderDef'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          deletionDependencies.isSoleTeamOwner ? 'bg-danger/20 text-danger' : 'bg-surface-3 text-textSecondary'
                        }`}>
                          <Users className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-textPrimary">Владение командами (Team Ownership)</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              deletionDependencies.isSoleTeamOwner
                                ? 'bg-danger/20 text-danger border border-danger/40'
                                : 'bg-success/10 text-success border border-success/30'
                            }`}>
                              {deletionDependencies.isSoleTeamOwner ? 'Блокирует удаление' : 'Чисто'}
                            </span>
                          </div>
                          <p className="text-xs text-textSecondary mt-0.5 leading-relaxed">
                            {deletionDependencies.isSoleTeamOwner 
                              ? 'Вы являетесь единственным владельцем команды с другими участниками. Назначьте нового владельца перед удалением.'
                              : 'Вы не являетесь единственным владельцем команд с активными участниками.'}
                          </p>
                        </div>
                      </div>

                      {deletionDependencies.isSoleTeamOwner && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            if ((window as any).__hubigrNavigate) (window as any).__hubigrNavigate('/my-teams');
                          }}
                          className="shrink-0 text-xs"
                        >
                          Управление командами
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Зависимость 3: Seller Finance (BR-ACC-065) */}
                  <div className={`p-4 rounded-xl border transition-colors ${
                    deletionDependencies.hasPendingFinances
                      ? 'bg-danger/10 border-danger/40'
                      : 'bg-surface-2 border-borderDef'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          deletionDependencies.hasPendingFinances ? 'bg-danger/20 text-danger' : 'bg-surface-3 text-textSecondary'
                        }`}>
                          <DollarSign className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-textPrimary">Финансовые обязательства (Seller)</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              deletionDependencies.hasPendingFinances
                                ? 'bg-danger/20 text-danger border border-danger/40'
                                : 'bg-success/10 text-success border border-success/30'
                            }`}>
                              {deletionDependencies.hasPendingFinances ? 'Блокирует удаление' : 'Чисто'}
                            </span>
                          </div>
                          <p className="text-xs text-textSecondary mt-0.5 leading-relaxed">
                            {deletionDependencies.hasPendingFinances 
                              ? 'Обнаружены незавершенные выплаты, холд или активные споры по возвратам. Завершите финансовые расчеты.'
                              : 'Все финансовые расчеты и обязательства продавца полностью урегулированы.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. ПОДТВЕРЖДЕНИЕ ПОТЕРИ ЦИФРОВЫХ ПРАВ (BR-ACC-062, FR-ACC-059) */}
              <div className="p-4 bg-danger/5 border border-danger/20 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-danger font-bold text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  Подтверждение потери приобретенных цифровых прав
                </div>
                <p className="text-xs text-textSecondary leading-relaxed">
                  В вашей учетной записи есть приобретенный цифровой контент (игры и лицензии в Библиотеке). При окончательном удалении аккаунта все права будут безвозвратно утеряны без возможности повторной загрузки или компенсации.
                </p>

                <label className="flex items-start gap-3 p-3 bg-surface-1 rounded-lg border border-borderDef cursor-pointer hover:border-danger/40 transition-colors select-none">
                  <input
                    type="checkbox"
                    checked={hasDigitalRightsLossConfirmed}
                    onChange={(e) => setHasDigitalRightsLossConfirmed(e.target.checked)}
                    className="mt-0.5 rounded text-danger focus:ring-danger w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs text-textPrimary leading-relaxed">
                    Я подтверждаю, что ознакомлен с правилами платформы и согласен на безвозвратную потерю всех приобретенных игр, дополнений и цифровых лицензий в Библиотеке по истечении 30 дней с момента запуска процедуры удаления.
                  </span>
                </label>
              </div>

              {/* 4. КНОПКА ЗАПУСКА УДАЛЕНИЯ */}
              {(() => {
                const hasBlockers = Object.values(deletionDependencies).some(Boolean);
                const canProceed = !hasBlockers && hasDigitalRightsLossConfirmed;

                return (
                  <div className="pt-4 border-t border-borderDef flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="text-xs text-textTertiary font-mono">
                      {hasBlockers ? (
                        <span className="text-danger flex items-center gap-1 font-semibold">
                          <AlertTriangle className="w-3.5 h-3.5" /> Сначала разрешите все блокирующие зависимости выше
                        </span>
                      ) : !hasDigitalRightsLossConfirmed ? (
                        <span>Отметьте согласие с потерей цифровых прав для разблокировки кнопки</span>
                      ) : (
                        <span className="text-success flex items-center gap-1 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Все проверки пройдены, удаление доступно
                        </span>
                      )}
                    </div>

                    <Button
                      variant="danger"
                      disabled={!canProceed}
                      onClick={() => setIsDeletionModalOpen(true)}
                      className="w-full sm:w-auto font-bold"
                    >
                      <Trash2 className="w-4 h-4 mr-1.5" />
                      <span>Удалить мой аккаунт</span>
                    </Button>
                  </div>
                );
              })()}

            </div>
          )}

          {/* MODAL: ACCOUNT APPEAL (FE-ACC-008: BR-ACC-056, BR-ACC-058) */}
          <AccountAppealModal
            isOpen={isAppealModalOpen}
            onClose={() => setIsAppealModalOpen(false)}
            caseId={appealCaseInfo.caseId}
            restrictionTitle={appealCaseInfo.title}
            onAppealApproved={() => {
              setScopedRestrictions(prev => ({ ...prev, [appealCaseInfo.capability]: false }));
              setPunishmentHistory(prev => prev.map(item => 
                item.id === appealCaseInfo.caseId 
                  ? { ...item, status: 'appealed_unbanned' }
                  : item
              ));
              showToast(`Апелляция удовлетворена! Ограничение «${appealCaseInfo.title}» снято.`, 'success');
            }}
            onAppealRejected={() => {
              showToast(`Апелляция по делу #${appealCaseInfo.caseId} отклонена модерацией.`, 'info');
            }}
          />

          {/* MODAL: ACCOUNT DELETION (FE-ACC-009: BR-ACC-059, BR-ACC-060, AUTH-018) */}
          <AccountDeletionModal
            isOpen={isDeletionModalOpen}
            onClose={() => setIsDeletionModalOpen(false)}
            userEmail={currentEmail}
            hasPassword={hasLocalPassword}
            onDeletionInitiated={() => {
              setIsDeletionModalOpen(false);
              try {
                sessionStorage.setItem('hubigr_account_restricted_type', 'recovery_only');
              } catch (e) {}
              showToast('Процедура удаления запущена. Аккаунт переведён в статус ожидания (30 дней).', 'warning');
              if ((window as any).__hubigrNavigate) {
                (window as any).__hubigrNavigate('/account-restricted');
              }
            }}
          />

          {/* MODAL: LINK EXTERNAL PROVIDER (AC-ACC-006) */}
          <Modal
            isOpen={!!providerToLink}
            onClose={() => { if (!isLinkingProcess) setProviderToLink(null); }}
            title={`Подключение ${providerToLink?.name}`}
            subtitle="Привязка внешнего сервиса для быстрого входа"
            icon={<Link2 className="w-5 h-5 text-accent" />}
            maxWidth="sm"
          >
            {providerToLink && (
              <div className="space-y-5">
                <div className="p-4 bg-surface-2 rounded-xl border border-borderDef flex items-center gap-3">
                  <div className={`w-12 h-12 ${providerToLink.iconBg} rounded-xl flex items-center justify-center text-white font-bold font-mono text-base shrink-0 shadow-md`}>
                    {providerToLink.badge}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-textPrimary">{providerToLink.name}</h4>
                    <p className="text-xs text-textSecondary">OAuth 2.0 Identity Provider</p>
                  </div>
                </div>

                <div className="text-xs text-textSecondary leading-relaxed space-y-2">
                  <p>
                    Вы будете перенаправлены на страницу подтверждения авторизации <strong>{providerToLink.name}</strong>.
                  </p>
                  <p className="text-textTertiary font-mono text-caption">
                    Платформа получит только ваш подтверждённый идентификатор пользователя для авторизации.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-borderDef">
                  <Button 
                    variant="secondary" 
                    onClick={() => setProviderToLink(null)}
                    disabled={isLinkingProcess}
                  >
                    Отмена
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={handleConfirmLink}
                    disabled={isLinkingProcess}
                  >
                    {isLinkingProcess ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Подключение...
                      </>
                    ) : (
                      `Подтвердить привязку`
                    )}
                  </Button>
                </div>
              </div>
            )}
          </Modal>

          {/* MODAL: UNLINK CONFIRMATION (AC-ACC-007) */}
          <Modal
            isOpen={!!providerToUnlink}
            onClose={() => setProviderToUnlink(null)}
            title={`Отвязать ${providerToUnlink?.name}?`}
            subtitle="Подтверждение отключения метода входа"
            icon={<AlertTriangle className="w-5 h-5 text-danger" />}
            maxWidth="sm"
          >
            {providerToUnlink && (
              <div className="space-y-5">
                <div className="p-4 bg-danger/10 border border-danger/30 rounded-xl flex items-start gap-3 text-xs text-textPrimary">
                  <AlertTriangle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold text-danger">Внимание!</span>
                    <p className="text-textSecondary leading-relaxed">
                      Вы больше не сможете использовать аккаунт <strong>{providerToUnlink.name}</strong> для входа в Хабигр. 
                      Вход будет доступен через оставшиеся активные методы.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-borderDef">
                  <Button variant="secondary" onClick={() => setProviderToUnlink(null)}>
                    Отмена
                  </Button>
                  <Button variant="danger" onClick={handleConfirmUnlink}>
                    Отвязать сервис
                  </Button>
                </div>
              </div>
            )}
          </Modal>

          {/* MODAL: CHANGE EMAIL (BR-ACC-025, AC-ACC-010) */}
          <Modal
            isOpen={emailModalState.isOpen}
            onClose={() => setEmailModalState(prev => ({ ...prev, isOpen: false }))}
            title={
              emailModalState.step === 'reauth' ? 'Подтверждение пароля' :
              emailModalState.step === 'input' ? 'Новый Email адрес' :
              'Подтверждение нового Email'
            }
            subtitle="Защищенная процедура смены контактного адреса"
            icon={<Mail className="w-5 h-5 text-accent" />}
            maxWidth="sm"
          >
            {/* Step 1: Re-authentication */}
            {emailModalState.step === 'reauth' && (
              <form onSubmit={handleEmailReauthSubmit} className="space-y-4">
                <div className="p-3.5 bg-surface-2 rounded-xl border border-borderDef text-xs text-textSecondary leading-relaxed">
                  Смена email является чувствительной операцией безопасности. Пожалуйста, введите текущий пароль аккаунта для подтверждения.
                </div>

                {emailModalState.error && (
                  <div className="p-3 bg-danger/10 border border-danger/30 rounded-lg text-xs text-danger flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{emailModalState.error}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-caption font-bold text-textSecondary uppercase tracking-wider block">Текущий пароль</label>
                  <div className="relative">
                    <Input
                      type={showPasswordMask ? 'text' : 'password'}
                      placeholder="Введите ваш пароль"
                      value={emailModalState.currentPass}
                      onChange={(e) => setEmailModalState(prev => ({ ...prev, currentPass: e.target.value, error: undefined }))}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordMask(!showPasswordMask)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-textTertiary hover:text-textPrimary"
                    >
                      {showPasswordMask ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-borderDef">
                  <Button variant="secondary" type="button" onClick={() => setEmailModalState(prev => ({ ...prev, isOpen: false }))}>
                    Отмена
                  </Button>
                  <Button variant="primary" type="submit">
                    Продолжить
                  </Button>
                </div>
              </form>
            )}

            {/* Step 2: Input New Email */}
            {emailModalState.step === 'input' && (
              <form onSubmit={handleEmailInputSubmit} className="space-y-4">
                <div className="space-y-1 text-xs">
                  <span className="text-textSecondary">Текущий основной адрес:</span>
                  <div className="font-mono font-bold text-textPrimary">{currentEmail}</div>
                </div>

                {emailModalState.error && (
                  <div className="p-3 bg-danger/10 border border-danger/30 rounded-lg text-xs text-danger flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{emailModalState.error}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-caption font-bold text-textSecondary uppercase tracking-wider block">Новый Email адрес</label>
                  <Input
                    type="email"
                    placeholder="new-address@example.com"
                    value={emailModalState.newEmail}
                    onChange={(e) => setEmailModalState(prev => ({ ...prev, newEmail: e.target.value, error: undefined }))}
                    autoFocus
                  />
                  <p className="text-caption text-textTertiary">
                    На указанный адрес будет отправлен 6-значный проверочный код.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-borderDef">
                  <Button variant="secondary" type="button" onClick={() => setEmailModalState(prev => ({ ...prev, isOpen: false }))}>
                    Отмена
                  </Button>
                  <Button variant="primary" type="submit">
                    Отправить код
                  </Button>
                </div>
              </form>
            )}

            {/* Step 3: Verify Code */}
            {emailModalState.step === 'verify' && (
              <form onSubmit={handleEmailVerifySubmit} className="space-y-4">
                <div className="p-3.5 bg-surface-2 rounded-xl border border-borderDef text-xs text-textSecondary space-y-1">
                  <div>Код подтверждения отправлен на:</div>
                  <div className="font-mono font-bold text-textPrimary text-sm">{pendingEmail || emailModalState.newEmail}</div>
                </div>

                {emailModalState.error && (
                  <div className="p-3 bg-danger/10 border border-danger/30 rounded-lg text-xs text-danger flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{emailModalState.error}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-caption font-bold text-textSecondary uppercase tracking-wider">6-значный код</label>
                    <span className="text-overline font-mono text-accent">Тест: 123456</span>
                  </div>
                  <Input
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={emailModalState.verifyCode}
                    onChange={(e) => setEmailModalState(prev => ({ ...prev, verifyCode: e.target.value.replace(/\D/g, ''), error: undefined }))}
                    className="text-center font-mono text-lg tracking-widest"
                    autoFocus
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  {emailModalState.resendTimer > 0 ? (
                    <span className="text-textTertiary font-mono">
                      Повтор через {emailModalState.resendTimer}с
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setEmailModalState(prev => ({ ...prev, resendTimer: 60 }));
                        showToast('Код отправлен повторно', 'info');
                      }}
                      className="text-accent hover:underline font-medium"
                    >
                      Отправить код повторно
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-borderDef">
                  <Button variant="secondary" type="button" onClick={() => setEmailModalState(prev => ({ ...prev, isOpen: false }))}>
                    Отмена
                  </Button>
                  <Button variant="primary" type="submit">
                    Подтвердить смену
                  </Button>
                </div>
              </form>
            )}
          </Modal>

          {/* MODAL: ADD / CHANGE PHONE (BR-ACC-026, AC-ACC-011) */}
          <Modal
            isOpen={phoneModalState.isOpen}
            onClose={() => setPhoneModalState(prev => ({ ...prev, isOpen: false }))}
            title={
              phoneModalState.step === 'reauth' ? 'Подтверждение пароля' :
              phoneModalState.step === 'input' ? (currentPhone ? 'Смена номера телефона' : 'Привязка номера телефона') :
              'Подтверждение по СМС'
            }
            subtitle="Защищенная процедура подтверждения номера"
            icon={<Smartphone className="w-5 h-5 text-accent" />}
            maxWidth="sm"
          >
            {/* Step 1: Re-auth */}
            {phoneModalState.step === 'reauth' && (
              <form onSubmit={handlePhoneReauthSubmit} className="space-y-4">
                <div className="p-3.5 bg-surface-2 rounded-xl border border-borderDef text-xs text-textSecondary leading-relaxed">
                  Для изменения номера телефона требуется подтверждение личности текущим паролем.
                </div>

                {phoneModalState.error && (
                  <div className="p-3 bg-danger/10 border border-danger/30 rounded-lg text-xs text-danger flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{phoneModalState.error}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-caption font-bold text-textSecondary uppercase tracking-wider block">Текущий пароль</label>
                  <Input
                    type="password"
                    placeholder="Введите пароль"
                    value={phoneModalState.currentPass}
                    onChange={(e) => setPhoneModalState(prev => ({ ...prev, currentPass: e.target.value, error: undefined }))}
                    autoFocus
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-borderDef">
                  <Button variant="secondary" type="button" onClick={() => setPhoneModalState(prev => ({ ...prev, isOpen: false }))}>
                    Отмена
                  </Button>
                  <Button variant="primary" type="submit">
                    Продолжить
                  </Button>
                </div>
              </form>
            )}

            {/* Step 2: Phone Input */}
            {phoneModalState.step === 'input' && (
              <form onSubmit={handlePhoneInputSubmit} className="space-y-4">
                <div className="p-3.5 bg-surface-2 rounded-xl border border-borderDef flex items-start gap-2.5 text-xs text-textSecondary">
                  <Lock className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <p>
                    Номер телефона используется только для восстановления доступа и защиты. 
                    <strong> Он никогда не отображается в публичном профиле.</strong>
                  </p>
                </div>

                {phoneModalState.error && (
                  <div className="p-3 bg-danger/10 border border-danger/30 rounded-lg text-xs text-danger flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{phoneModalState.error}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-caption font-bold text-textSecondary uppercase tracking-wider block">Номер телефона</label>
                  <Input
                    type="tel"
                    placeholder="+7 (999) 000-00-00"
                    value={phoneModalState.newPhone}
                    onChange={(e) => setPhoneModalState(prev => ({ ...prev, newPhone: e.target.value, error: undefined }))}
                    autoFocus
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-borderDef">
                  <Button variant="secondary" type="button" onClick={() => setPhoneModalState(prev => ({ ...prev, isOpen: false }))}>
                    Отмена
                  </Button>
                  <Button variant="primary" type="submit">
                    Получить СМС-код
                  </Button>
                </div>
              </form>
            )}

            {/* Step 3: SMS Verification */}
            {phoneModalState.step === 'verify' && (
              <form onSubmit={handlePhoneVerifySubmit} className="space-y-4">
                <div className="p-3.5 bg-surface-2 rounded-xl border border-borderDef text-xs text-textSecondary space-y-1">
                  <div>СМС с кодом подтверждения отправлено на:</div>
                  <div className="font-mono font-bold text-textPrimary text-sm">{phoneModalState.newPhone}</div>
                </div>

                {phoneModalState.error && (
                  <div className="p-3 bg-danger/10 border border-danger/30 rounded-lg text-xs text-danger flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{phoneModalState.error}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-caption font-bold text-textSecondary uppercase tracking-wider">Код из СМС</label>
                    <span className="text-overline font-mono text-accent">Тест: 4812</span>
                  </div>
                  <Input
                    type="text"
                    maxLength={4}
                    placeholder="4812"
                    value={phoneModalState.verifyCode}
                    onChange={(e) => setPhoneModalState(prev => ({ ...prev, verifyCode: e.target.value.replace(/\D/g, ''), error: undefined }))}
                    className="text-center font-mono text-xl tracking-widest"
                    autoFocus
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  {phoneModalState.resendTimer > 0 ? (
                    <span className="text-textTertiary font-mono">
                      Повтор через {phoneModalState.resendTimer}с
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setPhoneModalState(prev => ({ ...prev, resendTimer: 45 }));
                        showToast('СМС отправлено повторно', 'info');
                      }}
                      className="text-accent hover:underline font-medium"
                    >
                      Отправить повторно
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-borderDef">
                  <Button variant="secondary" type="button" onClick={() => setPhoneModalState(prev => ({ ...prev, isOpen: false }))}>
                    Отмена
                  </Button>
                  <Button variant="primary" type="submit">
                    Подтвердить телефон
                  </Button>
                </div>
              </form>
            )}
          </Modal>

          {/* MODAL: CHANGE / SET PASSWORD (AC-ACC-012, AC-ACC-013, BR-ACC-027, BR-ACC-028) */}
          <Modal
            isOpen={passwordModalState.isOpen}
            onClose={() => setPasswordModalState(prev => ({ ...prev, isOpen: false }))}
            title={
              hasLocalPassword
                ? (passwordModalState.step === 'reauth' ? 'Подтверждение личности' : 'Создание нового пароля')
                : (passwordModalState.step === 'reauth' ? 'Подтверждение владения аккаунтом' : 'Создание пароля')
            }
            subtitle={
              hasLocalPassword
                ? (passwordModalState.step === 'reauth' ? 'Введите текущие учетные данные' : 'Придумайте надежный пароль для входа')
                : (passwordModalState.step === 'reauth' ? 'Проверка безопасности перед установкой пароля' : 'Задайте постоянный пароль для входа по email')
            }
            icon={<KeyRound className="w-5 h-5 text-accent" />}
            maxWidth="sm"
          >
            {/* STEP 1: RE-AUTHENTICATION / EMAIL CODE */}
            {passwordModalState.step === 'reauth' && (
              <form onSubmit={handlePasswordReauthSubmit} className="space-y-4">
                {hasLocalPassword ? (
                  <>
                    <div className="p-3.5 bg-surface-2 rounded-xl border border-borderDef text-xs text-textSecondary leading-relaxed">
                      Для смены пароля подтвердите вашу личность текущим паролем аккаунта.
                      {is2FAEnabled && ' Поскольку у вас активна 2FA, также потребуется код из приложения-аутентификатора.'}
                    </div>

                    {passwordModalState.error && (
                      <div className="p-3 bg-danger/10 border border-danger/30 rounded-lg text-xs text-danger flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{passwordModalState.error}</span>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-caption font-bold text-textSecondary uppercase tracking-wider block">Текущий пароль</label>
                      <div className="relative">
                        <Input
                          type={passwordModalState.showCurrentPass ? 'text' : 'password'}
                          placeholder="Введите ваш текущий пароль"
                          value={passwordModalState.currentPass}
                          onChange={(e) => setPasswordModalState(prev => ({ ...prev, currentPass: e.target.value, error: undefined }))}
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => setPasswordModalState(prev => ({ ...prev, showCurrentPass: !prev.showCurrentPass }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-textTertiary hover:text-textPrimary"
                        >
                          {passwordModalState.showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {is2FAEnabled && (
                      <div className="space-y-1.5 pt-2 border-t border-borderDef/60">
                        <div className="flex items-center justify-between">
                          <label className="text-caption font-bold text-textSecondary uppercase tracking-wider block">Код двухфакторной аутентификации</label>
                          <span className="text-overline font-mono text-accent">Тест: 123456</span>
                        </div>
                        <Input
                          type="text"
                          maxLength={6}
                          placeholder="123456"
                          value={passwordModalState.twoFACode}
                          onChange={(e) => setPasswordModalState(prev => ({ ...prev, twoFACode: e.target.value.replace(/\D/g, ''), error: undefined }))}
                          className="text-center font-mono text-xl tracking-widest"
                        />
                        <p className="text-caption text-textTertiary">Введите 6 цифр из приложения Google Authenticator или Authy</p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="p-3.5 bg-surface-2 rounded-xl border border-borderDef text-xs text-textSecondary leading-relaxed space-y-1.5">
                      <p>
                        Так как для вашего аккаунта еще не был задан локальный пароль, мы отправили проверочный код на ваш основной email:
                      </p>
                      <div className="font-mono font-bold text-textPrimary text-sm bg-surface-3/80 px-2.5 py-1 rounded border border-borderDef inline-block">
                        {currentEmail}
                      </div>
                    </div>

                    {passwordModalState.error && (
                      <div className="p-3 bg-danger/10 border border-danger/30 rounded-lg text-xs text-danger flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{passwordModalState.error}</span>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-caption font-bold text-textSecondary uppercase tracking-wider block">Проверочный код</label>
                        <span className="text-overline font-mono text-accent">Тест: 938104</span>
                      </div>
                      <Input
                        type="text"
                        maxLength={6}
                        placeholder="938104"
                        value={passwordModalState.oauthVerifyCode}
                        onChange={(e) => setPasswordModalState(prev => ({ ...prev, oauthVerifyCode: e.target.value.replace(/\D/g, ''), error: undefined }))}
                        className="text-center font-mono text-xl tracking-widest"
                        autoFocus
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      {passwordModalState.resendTimer > 0 ? (
                        <span className="text-textTertiary font-mono">
                          Повторная отправка через {passwordModalState.resendTimer}с
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setPasswordModalState(prev => ({ ...prev, resendTimer: 60 }));
                            showToast('Код безопасности отправлен повторно', 'info');
                          }}
                          className="text-accent hover:underline font-medium"
                        >
                          Отправить код повторно
                        </button>
                      )}
                    </div>
                  </>
                )}

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-borderDef">
                  <Button variant="secondary" type="button" onClick={() => setPasswordModalState(prev => ({ ...prev, isOpen: false }))}>
                    Отмена
                  </Button>
                  <Button variant="primary" type="submit">
                    Продолжить
                  </Button>
                </div>
              </form>
            )}

            {/* STEP 2: ENTER NEW PASSWORD & CONFIRM */}
            {passwordModalState.step === 'input' && (
              <form onSubmit={handlePasswordInputSubmit} className="space-y-4">
                {passwordModalState.error && (
                  <div className="p-3 bg-danger/10 border border-danger/30 rounded-lg text-xs text-danger flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{passwordModalState.error}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-caption font-bold text-textSecondary uppercase tracking-wider block">Новый пароль</label>
                  <div className="relative">
                    <Input
                      type={passwordModalState.showNewPass ? 'text' : 'password'}
                      placeholder="Придумайте пароль"
                      value={passwordModalState.newPass}
                      onChange={(e) => setPasswordModalState(prev => ({ ...prev, newPass: e.target.value, error: undefined }))}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setPasswordModalState(prev => ({ ...prev, showNewPass: !prev.showNewPass }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-textTertiary hover:text-textPrimary"
                    >
                      {passwordModalState.showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {passwordModalState.newPass && (() => {
                    const strength = getPasswordStrength(passwordModalState.newPass);
                    return (
                      <div className="space-y-1.5 pt-1 animate-fadeIn">
                        <div className="flex items-center justify-between text-caption">
                          <span className="text-textSecondary">Надежность пароля:</span>
                          <span className={`font-bold ${
                            strength.score <= 1 ? 'text-danger' :
                            strength.score === 2 ? 'text-warning' :
                            strength.score === 3 ? 'text-accent' : 'text-success'
                          }`}>
                            {strength.label}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-surface-3 rounded-full overflow-hidden">
                          <div className={`h-full ${strength.color} ${strength.width} transition-all duration-300`} />
                        </div>
                      </div>
                    );
                  })()}

                  <div className="text-caption text-textTertiary space-y-0.5 pt-1">
                    <div className="flex items-center gap-1.5">
                      <span className={passwordModalState.newPass.length >= 8 ? 'text-success font-medium' : 'text-textTertiary'}>
                        {passwordModalState.newPass.length >= 8 ? '✓' : '•'} Минимум 8 символов
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={/[a-zA-Z]/.test(passwordModalState.newPass) && /\d/.test(passwordModalState.newPass) ? 'text-success font-medium' : 'text-textTertiary'}>
                        {/[a-zA-Z]/.test(passwordModalState.newPass) && /\d/.test(passwordModalState.newPass) ? '✓' : '•'} Буквы и цифры
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-caption font-bold text-textSecondary uppercase tracking-wider block">Повторите новый пароль</label>
                  <div className="relative">
                    <Input
                      type={passwordModalState.showConfirmPass ? 'text' : 'password'}
                      placeholder="Повторите новый пароль"
                      value={passwordModalState.confirmPass}
                      onChange={(e) => setPasswordModalState(prev => ({ ...prev, confirmPass: e.target.value, error: undefined }))}
                    />
                    <button
                      type="button"
                      onClick={() => setPasswordModalState(prev => ({ ...prev, showConfirmPass: !prev.showConfirmPass }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-textTertiary hover:text-textPrimary"
                    >
                      {passwordModalState.showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Revoke other sessions policy banner */}
                {hasLocalPassword && (
                  <div className="p-3 bg-surface-2 rounded-xl border border-borderDef flex items-start gap-2.5 text-xs text-textSecondary">
                    <Shield className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-textPrimary block mb-0.5">Безопасность сеансов</strong>
                      После смены пароля все остальные активные сессии на других устройствах будут завершены. Текущий сеанс останется активным.
                    </div>
                  </div>
                )}

                {!hasLocalPassword && (
                  <div className="p-3 bg-surface-2 rounded-xl border border-borderDef flex items-start gap-2.5 text-xs text-textSecondary">
                    <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-textPrimary block mb-0.5">Прямой вход по паролю</strong>
                      После установки пароля вы сможете входить на платформу как по связке email + пароль, так и через ранее привязанные соцсети.
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-borderDef">
                  <Button 
                    variant="secondary" 
                    type="button" 
                    onClick={() => setPasswordModalState(prev => ({ ...prev, step: 'reauth', error: undefined }))}
                  >
                    Назад
                  </Button>
                  <Button variant="primary" type="submit">
                    {hasLocalPassword ? 'Обновить пароль' : 'Сохранить пароль'}
                  </Button>
                </div>
              </form>
            )}
          </Modal>

          {/* MODAL: PROTECTED DATE OF BIRTH CHANGE (BR-ACC-034, FR-ACC-032, AC-ACC-051) */}
          <Modal
            isOpen={dobModalState.isOpen}
            onClose={() => setDobModalState(prev => ({ ...prev, isOpen: false }))}
            title={
              currentDOB 
                ? (dobModalState.step === 'reauth' ? 'Подтверждение личности' : 'Изменение даты рождения')
                : (dobModalState.step === 'reauth' ? 'Подтверждение личности' : 'Указание даты рождения')
            }
            subtitle="Защищенная процедура обновления персональных данных"
            icon={<Calendar className="w-5 h-5 text-accent" />}
            maxWidth="sm"
          >
            {/* STEP 1: RE-AUTH */}
            {dobModalState.step === 'reauth' && (
              <form onSubmit={handleDOBReauthSubmit} className="space-y-4">
                {hasLocalPassword ? (
                  <>
                    <div className="p-3.5 bg-surface-2 rounded-xl border border-borderDef text-xs text-textSecondary leading-relaxed">
                      Дата рождения используется для проверки возрастного ценза (12+) и защищена от произвольной правки в профиле. Для продолжения подтвердите вашу личность текущим паролем.
                    </div>

                    {dobModalState.error && (
                      <div className="p-3 bg-danger/10 border border-danger/30 rounded-lg text-xs text-danger flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{dobModalState.error}</span>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-caption font-bold text-textSecondary uppercase tracking-wider block">Текущий пароль</label>
                      <div className="relative">
                        <Input
                          type={dobModalState.showPass ? 'text' : 'password'}
                          placeholder="Введите ваш текущий пароль"
                          value={dobModalState.currentPass}
                          onChange={(e) => setDobModalState(prev => ({ ...prev, currentPass: e.target.value, error: undefined }))}
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => setDobModalState(prev => ({ ...prev, showPass: !prev.showPass }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-textTertiary hover:text-textPrimary"
                        >
                          {dobModalState.showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-3.5 bg-surface-2 rounded-xl border border-borderDef text-xs text-textSecondary leading-relaxed space-y-1.5">
                      <p>
                        Для подтверждения операции мы отправили проверочный код на ваш email:
                      </p>
                      <div className="font-mono font-bold text-textPrimary text-sm bg-surface-3/80 px-2.5 py-1 rounded border border-borderDef inline-block">
                        {currentEmail}
                      </div>
                    </div>

                    {dobModalState.error && (
                      <div className="p-3 bg-danger/10 border border-danger/30 rounded-lg text-xs text-danger flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{dobModalState.error}</span>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-caption font-bold text-textSecondary uppercase tracking-wider block">Проверочный код</label>
                        <span className="text-overline font-mono text-accent">Тест: 938104</span>
                      </div>
                      <Input
                        type="text"
                        maxLength={6}
                        placeholder="938104"
                        value={dobModalState.oauthVerifyCode}
                        onChange={(e) => setDobModalState(prev => ({ ...prev, oauthVerifyCode: e.target.value.replace(/\D/g, ''), error: undefined }))}
                        className="text-center font-mono text-xl tracking-widest"
                        autoFocus
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      {dobModalState.resendTimer > 0 ? (
                        <span className="text-textTertiary font-mono">
                          Повторная отправка через {dobModalState.resendTimer}с
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setDobModalState(prev => ({ ...prev, resendTimer: 60 }));
                            showToast('Код безопасности отправлен повторно', 'info');
                          }}
                          className="text-accent hover:underline font-medium"
                        >
                          Отправить код повторно
                        </button>
                      )}
                    </div>
                  </>
                )}

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-borderDef">
                  <Button variant="secondary" type="button" onClick={() => setDobModalState(prev => ({ ...prev, isOpen: false }))}>
                    Отмена
                  </Button>
                  <Button variant="primary" type="submit">
                    Продолжить
                  </Button>
                </div>
              </form>
            )}

            {/* STEP 2: INPUT NEW DOB & VALIDATE 12+ */}
            {dobModalState.step === 'input' && (
              <form onSubmit={handleDOBInputSubmit} className="space-y-4">
                <div className="p-3 bg-surface-2 rounded-xl border border-borderDef flex items-start gap-2.5 text-xs text-textSecondary">
                  <Lock className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <p>
                    Дата рождения является строго конфиденциальной информацией и 
                    <strong> никогда не показывается в публичном профиле</strong>.
                  </p>
                </div>

                {dobModalState.error && (
                  <div className="p-3 bg-danger/10 border border-danger/30 rounded-lg text-xs text-danger flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{dobModalState.error}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-caption font-bold text-textSecondary uppercase tracking-wider block">
                    Дата рождения
                  </label>
                  <input
                    type="date"
                    required
                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 12)).toISOString().split('T')[0]}
                    value={dobModalState.newDOB}
                    onChange={(e) => setDobModalState(prev => ({ ...prev, newDOB: e.target.value, error: undefined }))}
                    className="w-full h-11 px-4 bg-surface-1 border border-borderDef hover:border-borderStrong focus:border-accent focus:ring-2 focus:ring-accent rounded-control text-sm text-textPrimary transition-all outline-none"
                    autoFocus
                  />
                  {dobModalState.newDOB && (() => {
                    const age = calculateAge(dobModalState.newDOB);
                    const isAllowed = age >= 12;
                    return (
                      <div className={`text-xs flex items-center gap-1.5 pt-1 font-medium ${isAllowed ? 'text-success' : 'text-danger'}`}>
                        {isAllowed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                        <span>
                          Рассчитанный возраст: {age} лет {isAllowed ? '(Соответствует правилам 12+)' : '(Младше 12 лет — недопустимо)'}
                        </span>
                      </div>
                    );
                  })()}
                </div>

                <div className="p-3.5 bg-surface-2 rounded-xl border border-borderDef space-y-2">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={dobModalState.confirmAccuracy}
                      onChange={(e) => setDobModalState(prev => ({ ...prev, confirmAccuracy: e.target.checked, error: undefined }))}
                      className="mt-0.5 w-4 h-4 rounded border-borderDef bg-surface-1 text-accent focus:ring-accent"
                    />
                    <span className="text-xs text-textSecondary leading-relaxed">
                      Я подтверждаю достоверность указанной даты рождения. Предоставление заведомо ложных сведений о возрасте может повлечь блокировку учетной записи.
                    </span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-borderDef">
                  <Button 
                    variant="secondary" 
                    type="button" 
                    onClick={() => setDobModalState(prev => ({ ...prev, step: 'reauth', error: undefined }))}
                  >
                    Назад
                  </Button>
                  <Button variant="primary" type="submit">
                    Сохранить дату
                  </Button>
                </div>
              </form>
            )}
          </Modal>

          {/* MODAL: REVOKE SINGLE SESSION */}
          <Modal
            isOpen={sessionToRevoke !== null}
            onClose={() => setSessionToRevoke(null)}
            title="Завершение сеанса"
          >
            {sessionToRevoke && (
              <div className="space-y-4">
                <p className="text-sm text-textSecondary leading-relaxed">
                  Вы уверены, что хотите завершить сеанс на устройстве <strong className="text-textPrimary">{sessionToRevoke.device}</strong>?
                </p>

                <div className="p-3.5 bg-surface-2 rounded-xl border border-borderDef space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-textTertiary">Браузер / ОС:</span>
                    <span className="font-medium text-textPrimary">{sessionToRevoke.browser}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-textTertiary">Местоположение:</span>
                    <span className="font-medium text-textPrimary">{sessionToRevoke.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-textTertiary">IP-адрес:</span>
                    <span className="font-mono text-textPrimary">{sessionToRevoke.ip}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-textTertiary">Последняя активность:</span>
                    <span className="text-textPrimary">{sessionToRevoke.date}</span>
                  </div>
                </div>

                <div className="p-3 bg-surface-3/50 rounded-lg border border-borderDef text-xs text-textSecondary flex items-start gap-2">
                  <Shield className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span>
                    Сеанс будет немедленно отозван. Для повторного доступа потребуется заново ввести логин и пароль.
                  </span>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-borderDef">
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => setSessionToRevoke(null)}
                  >
                    Отмена
                  </Button>
                  <Button
                    variant="danger"
                    type="button"
                    onClick={handleConfirmRevokeSession}
                  >
                    <LogOut className="w-4 h-4 mr-1.5" /> Завершить сеанс
                  </Button>
                </div>
              </div>
            )}
          </Modal>

          {/* MODAL: REVOKE ALL OTHER SESSIONS */}
          <Modal
            isOpen={isRevokeAllModalOpen}
            onClose={() => setIsRevokeAllModalOpen(false)}
            title="Завершить все остальные сеансы"
          >
            <div className="space-y-4">
              <div className="p-3.5 bg-danger/10 border border-danger/30 rounded-xl text-xs text-danger flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  Все активные сессии на других смартфонах, планшетах и компьютерах будут аннулированы. Ваш текущий сеанс останется активным.
                </div>
              </div>

              <div className="p-3.5 bg-surface-2 rounded-xl border border-borderDef space-y-1.5 text-xs text-textSecondary">
                <div className="flex items-center justify-between">
                  <span>Сессий к завершению:</span>
                  <span className="font-bold text-danger text-sm font-mono">
                    {mockSessions.filter(s => !s.isCurrent).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Текущее устройство:</span>
                  <span className="font-medium text-textPrimary">
                    {mockSessions.find(s => s.isCurrent)?.device || 'Текущий браузер'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-textSecondary leading-relaxed">
                Это действие рекомендуется выполнить, если у вас есть подозрения на несанкционированный доступ к вашей учетной записи.
              </p>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-borderDef">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => setIsRevokeAllModalOpen(false)}
                >
                  Отмена
                </Button>
                <Button
                  variant="danger"
                  type="button"
                  onClick={handleConfirmRevokeAll}
                >
                  <LogOut className="w-4 h-4 mr-1.5" /> Завершить все остальные
                </Button>
              </div>
            </div>
          </Modal>

          {/* MODAL: 2FA SETUP WIZARD (BR-ACC-030, BR-ACC-032) */}
          <Modal
            isOpen={is2FASetupModalOpen}
            onClose={() => setIs2FASetupModalOpen(false)}
            title="Настройка двухфакторной аутентификации"
          >
            <div className="space-y-5">
              {/* STEP PROGRESS INDICATOR */}
              <div className="grid grid-cols-3 gap-2 pb-2">
                <div className={`h-1.5 rounded-full transition-all ${setupStep >= 1 ? 'bg-accent' : 'bg-surface-3'}`} />
                <div className={`h-1.5 rounded-full transition-all ${setupStep >= 2 ? 'bg-accent' : 'bg-surface-3'}`} />
                <div className={`h-1.5 rounded-full transition-all ${setupStep >= 3 ? 'bg-accent' : 'bg-surface-3'}`} />
              </div>

              {/* STEP 1: SCAN QR CODE */}
              {setupStep === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-accent block mb-1">
                      Шаг 1 из 3
                    </span>
                    <h4 className="text-body font-bold text-textPrimary">
                      Отсканируйте QR-код приложением
                    </h4>
                    <p className="text-xs text-textSecondary mt-1 leading-relaxed">
                      Откройте Google Authenticator, Яндекс Ключ или Authy на смартфоне и наведите камеру на QR-код ниже:
                    </p>
                  </div>

                  <div className="flex justify-center py-1">
                    <QRCodeSVG />
                  </div>

                  <div className="p-3.5 bg-surface-2 rounded-xl border border-borderDef space-y-2">
                    <div className="text-xs text-textSecondary flex items-center justify-between">
                      <span>Не можете отсканировать QR-код?</span>
                      <span className="text-caption text-textTertiary">Секретный ключ:</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 bg-surface-3 px-3 py-2 rounded-lg border border-borderDef font-mono text-sm">
                      <span className="font-bold tracking-widest text-textPrimary select-all">
                        {twoFASecret.replace(/(.{4})/g, '$1 ').trim()}
                      </span>
                      <Button
                        variant="secondary"
                        size="sm"
                        type="button"
                        onClick={handleCopySecret}
                        className="h-7 text-xs px-2.5"
                      >
                        <Copy className="w-3 h-3 mr-1" /> Копировать
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-borderDef">
                    <Button
                      variant="secondary"
                      type="button"
                      onClick={() => setIs2FASetupModalOpen(false)}
                    >
                      Отмена
                    </Button>
                    <Button
                      variant="primary"
                      type="button"
                      onClick={() => setSetupStep(2)}
                    >
                      Продолжить
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 2: VERIFY 6-DIGIT CODE */}
              {setupStep === 2 && (
                <form onSubmit={handleVerifySetupCode} className="space-y-4 animate-fadeIn">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-accent block mb-1">
                      Шаг 2 из 3
                    </span>
                    <h4 className="text-body font-bold text-textPrimary">
                      Проверка кода из приложения
                    </h4>
                    <p className="text-xs text-textSecondary mt-1 leading-relaxed">
                      Введите 6-значный одноразовый код, который отображается в вашем приложении аутентификатора:
                    </p>
                  </div>

                  {setupCodeError && (
                    <div className="p-3 bg-danger/10 border border-danger/30 rounded-lg text-xs text-danger flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{setupCodeError}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-caption font-bold text-textSecondary uppercase tracking-wider block">
                        Одноразовый пароль TOTP
                      </label>
                      <span className="text-overline font-mono text-accent">Тест: 123456</span>
                    </div>
                    <Input
                      type="text"
                      maxLength={6}
                      placeholder="000000"
                      value={setupVerifyCode}
                      onChange={(e) => {
                        setSetupVerifyCode(e.target.value.replace(/\D/g, ''));
                        setSetupCodeError(null);
                      }}
                      className="text-center font-mono text-2xl tracking-[0.4em] py-3 font-bold"
                      autoFocus
                    />
                  </div>

                  <div className="p-3 bg-surface-2 rounded-xl border border-borderDef text-xs text-textSecondary flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>
                      Код обновляется каждые 30 секунд. Убедитесь, что время на телефоне и компьютере синхронизировано.
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-borderDef">
                    <Button
                      variant="secondary"
                      type="button"
                      onClick={() => setSetupStep(1)}
                    >
                      Назад
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={setupVerifyCode.length !== 6}
                    >
                      Подтвердить код
                    </Button>
                  </div>
                </form>
              )}

              {/* STEP 3: RECOVERY CODES */}
              {setupStep === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-accent block mb-1">
                      Шаг 3 из 3
                    </span>
                    <h4 className="text-body font-bold text-textPrimary">
                      Сохраните коды восстановления
                    </h4>
                    <p className="text-xs text-textSecondary mt-1 leading-relaxed">
                      Эти резервные коды позволят войти в аккаунт, если вы потеряете доступ к телефону. Каждый код можно использовать только один раз.
                    </p>
                  </div>

                  {/* CODES GRID */}
                  <div className="p-4 bg-surface-2 rounded-xl border border-borderDef font-mono text-sm grid grid-cols-2 gap-2 text-center select-all shadow-inner">
                    {recoveryCodes.map((code, idx) => (
                      <div key={idx} className="bg-surface-3/80 py-1.5 px-2 rounded border border-borderDef/60 font-semibold text-textPrimary tracking-wider">
                        {code}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
                    <Button
                      variant="secondary"
                      size="sm"
                      type="button"
                      onClick={handleCopyRecoveryCodes}
                      className="text-xs flex-1"
                    >
                      <Copy className="w-3.5 h-3.5 mr-1.5" /> Скопировать все коды
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      type="button"
                      onClick={handleDownloadRecoveryCodes}
                      className="text-xs flex-1"
                    >
                      <Download className="w-3.5 h-3.5 mr-1.5" /> Скачать .txt
                    </Button>
                  </div>

                  <div className="p-3.5 bg-surface-2 rounded-xl border border-borderDef">
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={hasSavedCodesConfirmed}
                        onChange={(e) => setHasSavedCodesConfirmed(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded border-borderDef bg-surface-1 text-accent focus:ring-accent"
                      />
                      <span className="text-xs text-textSecondary leading-relaxed">
                        Я подтверждаю, что сохранил резервные коды в надежном месте и понимаю, что без них восстановить доступ при утере устройства будет крайне сложно.
                      </span>
                    </label>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-borderDef">
                    <Button
                      variant="secondary"
                      type="button"
                      onClick={() => setSetupStep(2)}
                    >
                      Назад
                    </Button>
                    <Button
                      variant="primary"
                      type="button"
                      disabled={!hasSavedCodesConfirmed}
                      onClick={handleComplete2FASetup}
                    >
                      Завершить настройку
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Modal>

          {/* MODAL: VIEW & REGENERATE RECOVERY CODES (BR-ACC-032) */}
          <Modal
            isOpen={isRecoveryModalOpen}
            onClose={() => setIsRecoveryModalOpen(false)}
            title="Резервные коды восстановления"
          >
            <div className="space-y-4">
              <p className="text-xs text-textSecondary leading-relaxed">
                Резервные коды используются для однократного входа в аккаунт, если у вас нет доступа к приложению-аутентификатору.
              </p>

              <div className="flex items-center justify-between text-xs text-textTertiary px-1">
                <span>Список активных кодов:</span>
                <span className="font-mono text-textPrimary font-bold">10 кодов доступно</span>
              </div>

              {/* CODES GRID */}
              <div className="p-4 bg-surface-2 rounded-xl border border-borderDef font-mono text-sm grid grid-cols-2 gap-2 text-center select-all shadow-inner">
                {recoveryCodes.map((code, idx) => (
                  <div key={idx} className="bg-surface-3/80 py-1.5 px-2 rounded border border-borderDef/60 font-semibold text-textPrimary tracking-wider">
                    {code}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between gap-2 flex-wrap">
                <Button
                  variant="secondary"
                  size="sm"
                  type="button"
                  onClick={handleCopyRecoveryCodes}
                  className="text-xs flex-1"
                >
                  <Copy className="w-3.5 h-3.5 mr-1.5" /> Скопировать
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  type="button"
                  onClick={handleDownloadRecoveryCodes}
                  className="text-xs flex-1"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" /> Скачать .txt
                </Button>
              </div>

              <div className="p-3.5 bg-warning/10 border border-warning/30 rounded-xl space-y-2">
                <div className="flex items-start gap-2.5 text-xs text-warning leading-relaxed">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    При генерации новых кодов все ранее выданные резервные коды немедленно станут недействительными.
                  </span>
                </div>
                <div className="pt-1 flex justify-end">
                  <Button
                    variant="secondary"
                    size="sm"
                    type="button"
                    onClick={handleRegenerateRecoveryCodes}
                    className="text-xs text-warning border-warning/30 hover:bg-warning/20"
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Сгенерировать новые коды
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-end pt-3 border-t border-borderDef">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => setIsRecoveryModalOpen(false)}
                >
                  Закрыть
                </Button>
              </div>
            </div>
          </Modal>

          {/* MODAL: DISABLE 2FA (BR-ACC-030, BR-ACC-033) */}
          <Modal
            isOpen={isDisable2FAModalOpen}
            onClose={() => setIsDisable2FAModalOpen(false)}
            title="Отключение двухфакторной аутентификации"
          >
            <form onSubmit={handleDisable2FA} className="space-y-4">
              <div className="p-3.5 bg-danger/10 border border-danger/30 rounded-xl text-xs text-danger flex items-start gap-2.5 leading-relaxed">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Отключение двухфакторной аутентификации существенно снизит уровень защиты вашей учетной записи. Для входа будет достаточно знать только логин и пароль.
                </span>
              </div>

              {disable2FAError && (
                <div className="p-3 bg-danger/10 border border-danger/30 rounded-lg text-xs text-danger flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{disable2FAError}</span>
                </div>
              )}

              {hasLocalPassword ? (
                <div className="space-y-1.5">
                  <label className="text-caption font-bold text-textSecondary uppercase tracking-wider block">
                    Подтвердите текущий пароль
                  </label>
                  <div className="relative">
                    <Input
                      type={showDisablePass ? 'text' : 'password'}
                      placeholder="Введите пароль аккаунта"
                      value={disable2FAPassword}
                      onChange={(e) => {
                        setDisable2FAPassword(e.target.value);
                        setDisable2FAError(null);
                      }}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowDisablePass(!showDisablePass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-textTertiary hover:text-textPrimary"
                    >
                      {showDisablePass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 bg-surface-2 rounded-xl border border-borderDef text-xs text-textSecondary space-y-1.5">
                  <p>
                    Для подтверждения отключения защиты мы запросим подтверждение через привязанную учетную запись соцсети.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-borderDef">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => setIsDisable2FAModalOpen(false)}
                >
                  Отмена
                </Button>
                <Button
                  variant="danger"
                  type="submit"
                >
                  Отключить защиту
                </Button>
              </div>
            </form>
          </Modal>

          {/* MODAL: 2FA LOCKOUT (BR-ACC-031, BR-ACC-033) */}
          <Modal
            isOpen={is2FALockoutModalOpen}
            onClose={() => setIs2FALockoutModalOpen(false)}
            title="Отключение 2FA заблокировано"
          >
            <div className="space-y-4">
              <div className="p-3.5 bg-danger/10 border border-danger/30 rounded-xl text-xs text-danger flex items-start gap-2.5 leading-relaxed">
                <Lock className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Учетные записи со статусом <strong>{accountRole === 'seller' ? 'Продавца (Seller)' : 'Администратора'}</strong> обязаны использовать двухфакторную аутентификацию.
                </span>
              </div>

              <div className="p-4 bg-surface-2 rounded-xl border border-borderDef text-xs text-textSecondary space-y-2 leading-relaxed">
                <p>
                  Двухфакторная защита является обязательным условием для доступа к финансовым операциям, реквизитам выплат и каталогу игр на платформе Hubigr.
                </p>
                <div className="pt-2 border-t border-borderDef/60 flex items-start gap-2 text-textPrimary font-medium">
                  <ShieldCheck className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span>
                    Если вам необходимо сменить смартфон или приложение-аутентификатор, вы можете выполнить перепривязку нового устройства без отключения защиты.
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-borderDef">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => setIs2FALockoutModalOpen(false)}
                >
                  Понятно
                </Button>
                <Button
                  variant="primary"
                  type="button"
                  onClick={() => {
                    setIs2FALockoutModalOpen(false);
                    handleOpen2FASetup();
                  }}
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Перепривязать устройство
                </Button>
              </div>
            </div>
          </Modal>

        </div>
      </div>

      {/* DEV MATRIX PANEL (Зафиксированная внизу панель управления для QA без искажения UI) */}
      <DevMatrixPanel
        pageName="Настройки"
        fields={[
          {
            id: 'activeTab',
            label: 'Вкладка',
            type: 'select',
            value: activeTab,
            onChange: (val) => setActiveTab(val),
            options: [
              { value: 'security', label: 'Безопасность и Вход' },
              { value: 'linkedAccounts', label: 'Связанные аккаунты' },
              { value: 'sessions', label: 'Сессии устройств' },
              { value: 'notifications', label: 'Уведомления' },
              { value: 'restrictions', label: 'Ограничения (FE-ACC-008)' },
              { value: 'deletion', label: 'Удаление аккаунта (FE-ACC-009)' }
            ]
          },
          {
            id: 'accountRole',
            label: 'Роль профиля',
            type: 'select',
            value: accountRole,
            onChange: (val) => {
              setAccountRole(val);
              showToast(`Профиль: ${val === 'seller' ? 'Продавец (Seller)' : val === 'admin' ? 'Администратор' : 'Пользователь'}`, 'info');
            },
            options: [
              { value: 'user', label: 'Пользователь (User)' },
              { value: 'seller', label: 'Продавец (Seller)' },
              { value: 'admin', label: 'Администратор (Admin)' }
            ]
          },
          {
            id: 'commentsRestriction',
            label: 'Бан отзывов (BR-ACC-056)',
            type: 'checkbox',
            value: scopedRestrictions.comments,
            onChange: (val) => setScopedRestrictions(prev => ({ ...prev, comments: val }))
          },
          {
            id: 'publishingRestriction',
            label: 'Бан публикаций (BR-ACC-056)',
            type: 'checkbox',
            value: scopedRestrictions.publishing,
            onChange: (val) => setScopedRestrictions(prev => ({ ...prev, publishing: val }))
          },
          {
            id: 'payoutsRestriction',
            label: 'Заморозка выплат (BR-ACC-056)',
            type: 'checkbox',
            value: scopedRestrictions.payouts,
            onChange: (val) => setScopedRestrictions(prev => ({ ...prev, payouts: val }))
          },
          {
            id: 'blockerGames',
            label: 'Блокер: Опубликованные игры (BR-ACC-063)',
            type: 'checkbox',
            value: deletionDependencies.hasPublishedGames,
            onChange: (val) => setDeletionDependencies(prev => ({ ...prev, hasPublishedGames: val }))
          },
          {
            id: 'blockerTeam',
            label: 'Блокер: Владелец команды (BR-ACC-064)',
            type: 'checkbox',
            value: deletionDependencies.isSoleTeamOwner,
            onChange: (val) => setDeletionDependencies(prev => ({ ...prev, isSoleTeamOwner: val }))
          },
          {
            id: 'blockerFinance',
            label: 'Блокер: Финансы продавца (BR-ACC-065)',
            type: 'checkbox',
            value: deletionDependencies.hasPendingFinances,
            onChange: (val) => setDeletionDependencies(prev => ({ ...prev, hasPendingFinances: val }))
          },
          {
            id: 'subscribedGamesCount',
            label: 'Подписки на игры (SC-ACC-027)',
            type: 'buttons',
            value: subscribedGames.length === 0 ? 'empty' : 'active',
            onChange: (val) => {
              if (val === 'empty') {
                setSubscribedGames([]);
                showToast('Список подписок очищен (Empty state)', 'info');
              } else {
                setSubscribedGames(INITIAL_SUBSCRIBED_GAMES);
                showToast('Список подписок восстановлен (3 игры)', 'info');
              }
            },
            options: [
              { value: 'active', label: '[Есть 3 игры]' },
              { value: 'empty', label: '[Пустой список (0)]' }
            ]
          }
        ]}
      />
    </div>
  );
}
