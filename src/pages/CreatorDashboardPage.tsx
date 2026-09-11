import DevMatrixPanel from '../components/DevMatrixPanel';
import React, { useState, useEffect, useRef } from 'react';
import { RequestPayoutModal } from './CreatorDashboard/modals/RequestPayoutModal';
import { SellerVerificationModal } from './CreatorDashboard/modals/SellerVerificationModal';
import { CreatorSalesTab } from './CreatorDashboard/tabs/CreatorSalesTab';
import { ExportStatsModal } from './CreatorDashboard/modals/ExportStatsModal';
import { CreatorStatsTab } from './CreatorDashboard/tabs/CreatorStatsTab';
import { CreateTeamModal } from './CreatorDashboard/modals/CreateTeamModal';
import { InviteMemberModal } from './CreatorDashboard/modals/InviteMemberModal';
import { LeaveTeamModal } from './CreatorDashboard/modals/LeaveTeamModal';
import { CreatorTeamsTab } from './CreatorDashboard/tabs/CreatorTeamsTab';
import { CreatorBugsTab } from './CreatorDashboard/tabs/CreatorBugsTab';
import { CreatorSupportTab } from './CreatorDashboard/tabs/CreatorSupportTab';
import { 
  Eye, Download, Users, Wallet, Plus, FileText, ChevronDown, AlertTriangle, 
  XCircle, ShieldAlert, Bug, MessageSquare, UserPlus, Clock, Rocket, AlertCircle, 
  RefreshCw, FolderKanban, User, ArrowUpRight, Filter, Search, Check, CheckCircle2, 
  X, MoreVertical, Edit, ExternalLink, Trash2, ArrowRight, Layers, DollarSign, 
  Settings, Lock, HelpCircle, CheckSquare, Sparkles, Send, CornerDownRight, BarChart2,
  TrendingUp, TrendingDown, Activity, ShieldCheck, ChevronRight, SlidersHorizontal, Info, Award, Star,
  Gamepad2, Upload, Edit3, Zap, Monitor, Laptop, Trophy, Heart, Copy, Flag, ThumbsUp, ThumbsDown,
  Calendar, Terminal, CreditCard, Building, Shield, Crown, LogOut, Mail
, Play , Smartphone , Apple , Archive , Globe , HeartHandshake , Tag , ArrowRightLeft , BookOpen , Pencil , UploadCloud } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { CustomSelect } from '../components/ui/Select';
import { GameTransferModal } from '../components/modals/GameTransferModal';
import { GameTransfersDrawer, GameTransferItem, GameTransferAuditRecord } from '../components/modals/GameTransfersDrawer';
import ScopedForbiddenNotice from '../components/ui/ScopedForbiddenNotice';

import { MOCK_TEAMS, INITIAL_ATTENTION_ITEMS, MOCK_GAMES, MOCK_INBOX_REVIEWS, MOCK_INBOX_BUGS, MOCK_DEVLOGS, MOCK_BUGS, MOCK_REVIEWS, MOCK_ANALYTICS_GAMES, MOCK_TIMESERIES, MOCK_REFERRALS, MOCK_STRUCTURED_FEEDBACK, MOCK_SALES_ITEMS, MOCK_SALES_TIMESERIES, MOCK_RECENT_SALES, MOCK_REFUNDS, MOCK_PAYOUTS_HISTORY, MOCK_CREATOR_EVENTS } from '../data/mockCreatorData';

// --- MOCK TRANSFERS (FE-ACC-007: ACC-API-042...044, BR-ACC-047, BR-ACC-049, BR-ACC-051) ---
const INITIAL_GAME_TRANSFERS: GameTransferItem[] = [
  {
    id: 'tr-1',
    gameId: 'g_neon',
    gameTitle: 'Neon Odyssey',
    gameSlug: 'neon-odyssey',
    gameCover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=200&auto=format&fit=crop',
    fromSubject: { type: 'team', name: 'Cyber Crafters', identifier: 'cyber-crafters' },
    toSubject: { type: 'user', name: 'Kael Vostokov', identifier: '@kael_vostokov' },
    monetizationType: 'free',
    requiresSellerVerification: false,
    recipientHasSellerProfile: true,
    status: 'pending',
    createdAt: 'Сегодня, 11:20',
    direction: 'incoming'
  },
  {
    id: 'tr-2',
    gameId: 'g_racer',
    gameTitle: 'Retro Synth Racer',
    gameSlug: 'retro-synth-racer',
    gameCover: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?q=80&w=200&auto=format&fit=crop',
    fromSubject: { type: 'user', name: 'Pixel Master', identifier: '@pixel_master' },
    toSubject: { type: 'team', name: 'Nocturnal Studios', identifier: 'nocturnal-studios' },
    monetizationType: 'paid',
    price: '499 ₽',
    requiresSellerVerification: true,
    recipientHasSellerProfile: false,
    status: 'pending',
    createdAt: 'Вчера, 18:45',
    direction: 'incoming'
  },
  {
    id: 'tr-3',
    gameId: 'g_01',
    gameTitle: 'BrokenLore: FOLLOW',
    gameSlug: 'brokenlore-follow',
    gameCover: '/mocks/cover1.jpg',
    fromSubject: { type: 'user', name: 'Kael Vostokov', identifier: '@kael_vostokov' },
    toSubject: { type: 'team', name: 'Neon Studios', identifier: 'neon-studios' },
    monetizationType: 'free',
    requiresSellerVerification: false,
    recipientHasSellerProfile: true,
    status: 'pending',
    createdAt: '3 часа назад',
    direction: 'outgoing'
  }
];

const MOCK_TRANSFER_AUDIT_LOGS: GameTransferAuditRecord[] = [
  {
    id: 'aud-1',
    gameTitle: 'QUANTUM CORE',
    gameSlug: 'quantum-core',
    fromSubject: '@kael_vostokov (User)',
    toSubject: 'NocturnalDevs Studio (Team)',
    initiatedBy: '@kael_vostokov',
    date: '14 мая 2026, 15:30',
    status: 'accepted'
  },
  {
    id: 'aud-2',
    gameTitle: 'Cyber Runner',
    gameSlug: 'cyber-runner',
    fromSubject: 'Open Collective (Team)',
    toSubject: '@alex_dev (User)',
    initiatedBy: '@divanov',
    date: '28 марта 2026, 18:12',
    status: 'accepted'
  },
  {
    id: 'aud-3',
    gameTitle: 'Retro Synth Racer',
    gameSlug: 'retro-synth-racer',
    fromSubject: '@pixel_master (User)',
    toSubject: 'Nocturnal Studios (Team)',
    initiatedBy: '@pixel_master',
    date: '02 февраля 2026, 11:00',
    status: 'rejected'
  }
];


// ================= ДАННЫЕ ДЛЯ КОМАНД И ДОСТУПОВ =================
export default function CreatorDashboardPage({ initialTab }: { initialTab?: string } = {}) {
  // --- STATE MATRIX ---
  const [scope, setScope] = useState('personal'); 
  
  // UX HUB ARCHITECTURE
  const [activeNav, setActiveNav] = useState(() => {
    if (initialTab) {
      if (initialTab === 'reviews' || initialTab === 'feedback') return 'community';
      if (initialTab === 'stats') return 'analytics';
      if (initialTab === 'finance') return 'sales';
      return initialTab;
    }
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tab = urlParams.get('tab');
      if (tab === 'reviews' || tab === 'feedback') return 'community';
      if (tab === 'stats') return 'analytics';
      if (tab === 'finance') return 'sales';
      if (tab) return tab;
    }
    return 'overview';
  }); 

  useEffect(() => {
    if (initialTab) {
      if (initialTab === 'reviews' || initialTab === 'feedback') setActiveNav('community');
      else if (initialTab === 'stats') setActiveNav('analytics');
      else if (initialTab === 'finance') setActiveNav('sales');
      else setActiveNav(initialTab);
    } else if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tab = urlParams.get('tab');
      if (tab === 'reviews' || tab === 'feedback') setActiveNav('community');
      else if (tab === 'stats') setActiveNav('analytics');
      else if (tab === 'finance') setActiveNav('sales');
      else if (tab) setActiveNav(tab);
    }
  }, [initialTab]);

  const [communitySubTab, setCommunitySubTab] = useState('reviews'); 

  // System States Controls
  const [pageState, setPageState] = useState('standard'); 
  const [salesApiError, setSalesApiError] = useState(false);
  const [analyticsApiError, setAnalyticsApiError] = useState(false);

  // Dynamic Data & Action States
  const [attentionItems, setAttentionItems] = useState(INITIAL_ATTENTION_ITEMS);
  const [isAttentionCollapsed, setIsAttentionCollapsed] = useState(false);
  const [bugsList, setBugsList] = useState(MOCK_BUGS);
  const [gamesList, setGamesList] = useState(MOCK_GAMES);
  const [devlogsList, setDevlogsList] = useState(MOCK_DEVLOGS);
  const [recentEvents, setRecentEvents] = useState(MOCK_CREATOR_EVENTS);
  
  // Dashboard/Overview Tab Inbox State
  const [inboxReviews, setInboxReviews] = useState(MOCK_INBOX_REVIEWS);
  const [inboxReplyText, setInboxReplyText] = useState<Record<string, string>>({});
  
  // Games Tab Filters State
  const [gamesSearchQuery, setGamesSearchQuery] = useState('');
  const [gamesVisibilityFilter, setGamesVisibilityFilter] = useState('all');
  const [gamesStatusFilter, setGamesStatusFilter] = useState('all');
  const [gamesSortBy, setGamesSortBy] = useState('updated_at');
  const [gamesItemsPerPage, setGamesItemsPerPage] = useState(12);
  const [gamesCurrentPage, setGamesCurrentPage] = useState(1);
  const [activeGameContextMenu, setActiveGameContextMenu] = useState<string | null>(null);
  const [activeVisibilityMenu, setActiveVisibilityMenu] = useState<string | null>(null);

  // DevLogs Tab Filters State
  const [devlogQuery, setDevlogQuery] = useState('');
  const [devlogStatusTab, setDevlogStatusTab] = useState('all'); // all, published, draft, scheduled, blocked
  const [devlogCategoryFilter, setDevlogCategoryFilter] = useState('all'); // all, update, changelog, postmortem, feedback, recruitment, announcement
  const [devlogGameFilter, setDevlogGameFilter] = useState('all'); // all, unlinked, or game.id
  const [devlogSortBy, setDevlogSortBy] = useState('updated'); // updated, created, views, likes
  const [devlogPage, setDevlogPage] = useState(1);
  const [devlogPerPage, setDevlogPerPage] = useState(10);
  const [activeDevlogContextMenu, setActiveDevlogContextMenu] = useState<string | null>(null);

  // Community Tab (Reviews & Feedback) State
  const [communityDomainSubTab, setCommunityDomainSubTab] = useState('reviews'); // 'reviews' | 'feedback'
  const [reviewsList, setReviewsList] = useState(MOCK_REVIEWS);
  const [feedbackList, setFeedbackList] = useState(MOCK_STRUCTURED_FEEDBACK);
  const [communitySearchQuery, setCommunitySearchQuery] = useState('');
  const [communitySelectedGame, setCommunitySelectedGame] = useState('all');
  const [communitySelectedRating, setCommunitySelectedRating] = useState('all');
  const [communityResponseStatus, setCommunityResponseStatus] = useState('all'); // 'all' | 'unanswered' | 'answered' | 'critical'
  const [communitySortBy, setCommunitySortBy] = useState('newest');
  const [editingResponseId, setEditingResponseId] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');

  // Modals
  const [quickUploadGame, setQuickUploadGame] = useState<any>(null);
  const [uploadBuildType, setUploadBuildType] = useState('webgl');
  const [uploadVersionInput, setUploadVersionInput] = useState('v1.0.3');
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [deleteGameModal, setDeleteGameModal] = useState<any>(null);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [gameForTransfer, setGameForTransfer] = useState<any | null>(null);
  const [gameTransfers, setGameTransfers] = useState<GameTransferItem[]>(INITIAL_GAME_TRANSFERS);
  const [transferAuditLogs, setTransferAuditLogs] = useState<GameTransferAuditRecord[]>(MOCK_TRANSFER_AUDIT_LOGS);
  const [isTransfersDrawerOpen, setIsTransfersDrawerOpen] = useState(false);
  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);
  const [publishingRestricted, setPublishingRestricted] = useState(false);
  const incomingPendingCount = gameTransfers.filter(t => t.direction === 'incoming' && t.status === 'pending').length;
  
  const [deleteDevlogModal, setDeleteDevlogModal] = useState<any>(null);
  const [moderationModal, setModerationModal] = useState<any>(null);
  
  const [deleteTargetReview, setDeleteTargetReview] = useState<any>(null);
  const [reportTargetReview, setReportTargetReview] = useState<any>(null);
  const [reportReason, setReportReason] = useState('insult');
  const [reportDetails, setReportDetails] = useState('');

  // Custom Dropdowns
  const [isScopeDropdownOpen, setIsScopeDropdownOpen] = useState(false);
  const [bugStatusDropdownOpen, setBugStatusDropdownOpen] = useState<any>(null);

  // Slide-over Drawers & Modals
  const [selectedBugForDrawer, setSelectedBugForDrawer] = useState<any>(null);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);

  // Contacts form state
  const [contactTelegram, setContactTelegram] = useState('@NocturnalDevs');
  const [contactBoosty, setContactBoosty] = useState('https://boosty.to/nocturnal');

  // Toast System
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('info');
  const [showToast, setShowToast] = useState(false);

  const createMenuRef = useRef<HTMLDivElement>(null);
  const scopeMenuRef = useRef<HTMLDivElement>(null);

  const triggerToast = (msg: string, type: string = 'info') => {
    setToastMsg(msg);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (createMenuRef.current && !createMenuRef.current.contains(event.target as Node)) {
        setIsCreateMenuOpen(false);
      }
      if (scopeMenuRef.current && !scopeMenuRef.current.contains(event.target as Node)) {
        setIsScopeDropdownOpen(false);
      }
      if (!(event.target as Element).closest('.game-card-context-menu')) {
        setActiveGameContextMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filterByScope = (items: any[]) => {
    if (scope === 'all') return items;
    return items.filter((item: any) => item.scope === scope);
  };

  const filteredAttention = filterByScope(attentionItems);
  const filteredBugs = filterByScope(bugsList);
  
  // Dashboard inbox filters (separate from main community tab data)
  const filteredInboxReviews = filterByScope(inboxReviews);
  const filteredInboxBugs = filterByScope(MOCK_INBOX_BUGS);


  const getScopeInfo = () => {
    if (scope === 'personal') return { 
      name: 'Личный профиль', 
      avatar: 'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%22%20height%3D%22100%22%20viewBox%3D%220%200%20100%20100%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%25236366f1%22%20%2F%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2240%22%20r%3D%2220%22%20fill%3D%22%2523fff%22%20%2F%3E%3Cpath%20d%3D%22M%2020%20100%20Q%2050%2060%2080%20100%22%20fill%3D%22%2523fff%22%20%2F%3E%3C%2Fsvg%3E', 
      badge: 'Owner', 
      canViewFinance: true, 
      canViewStats: true, 
      canManageGames: true, 
      canManageDevlog: true, 
      canManageReviews: true, 
      canManageBugs: true,
      canManageFeedback: true,
      canManageSupport: true
    };
    if (scope === 'team_nocturnal') return { 
      name: 'NocturnalDevs Studio', 
      avatar: 'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%22%20height%3D%22100%22%20viewBox%3D%220%200%20100%20100%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%25236366f1%22%20%2F%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2240%22%20r%3D%2220%22%20fill%3D%22%2523fff%22%20%2F%3E%3Cpath%20d%3D%22M%2020%20100%20Q%2050%2060%2080%20100%22%20fill%3D%22%2523fff%22%20%2F%3E%3C%2Fsvg%3E', 
      badge: 'Владелец', 
      canViewFinance: true, 
      canViewStats: true, 
      canManageGames: true, 
      canManageDevlog: true, 
      canManageReviews: true, 
      canManageBugs: true,
      canManageFeedback: true,
      canManageSupport: true
    };
    if (scope === 'team_pixel') return { 
      name: 'Pixel Pioneers', 
      avatar: 'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%22%20height%3D%22100%22%20viewBox%3D%220%200%20100%20100%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%25236366f1%22%20%2F%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2240%22%20r%3D%2220%22%20fill%3D%22%2523fff%22%20%2F%3E%3Cpath%20d%3D%22M%2020%20100%20Q%2050%2060%2080%20100%22%20fill%3D%22%2523fff%22%20%2F%3E%3C%2Fsvg%3E', 
      badge: 'Разработчик', 
      canViewFinance: false, 
      canViewStats: false, 
      canManageGames: false, 
      canManageDevlog: false, 
      canManageReviews: false, 
      canManageBugs: false,
      canManageFeedback: false,
      canManageSupport: false
    };
    return { 
      name: 'Все профили (Объединенный)', 
      avatar: null, 
      badge: 'Combined Scope', 
      canViewFinance: true, 
      canViewStats: true, 
      canManageGames: true, 
      canManageDevlog: true, 
      canManageReviews: true, 
      canManageBugs: true,
      canManageFeedback: true,
      canManageSupport: true
    };
  };

  
  const teamsList = [
    { id: 'team_nocturnal', name: 'NocturnalDevs Studio', logo: 'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%22%20height%3D%22100%22%20viewBox%3D%220%200%20100%20100%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%25236366f1%22%20%2F%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2240%22%20r%3D%2220%22%20fill%3D%22%2523fff%22%20%2F%3E%3Cpath%20d%3D%22M%2020%20100%20Q%2050%2060%2080%20100%22%20fill%3D%22%2523fff%22%20%2F%3E%3C%2Fsvg%3E' },
    { id: 'team_pixel', name: 'Pixel Pioneers', logo: 'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%22%20height%3D%22100%22%20viewBox%3D%220%200%20100%20100%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%25236366f1%22%20%2F%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2240%22%20r%3D%2220%22%20fill%3D%22%2523fff%22%20%2F%3E%3Cpath%20d%3D%22M%2020%20100%20Q%2050%2060%2080%20100%22%20fill%3D%22%2523fff%22%20%2F%3E%3C%2Fsvg%3E' }
  ];

  const scopeInfo = getScopeInfo();

  // Filtered Games Logic for CreatorGamesTab
  const getFilteredGames = () => {
    let result = filterByScope(gamesList);

    // Search query
    if (gamesSearchQuery.trim()) {
      const q = gamesSearchQuery.toLowerCase();
      result = result.filter((g: any) => g.title.toLowerCase().includes(q) || g.slug.toLowerCase().includes(q));
    }

    // Visibility filter
    if (gamesVisibilityFilter !== 'all') {
      result = result.filter((g: any) => g.visibility === gamesVisibilityFilter);
    }

    // Dev status filter
    if (gamesStatusFilter !== 'all') {
      result = result.filter((g: any) => g.status === gamesStatusFilter);
    }

    // Sort by
    result = [...result].sort((a: any, b: any) => {
      if (gamesSortBy === 'downloads') return b.downloads - a.downloads;
      if (gamesSortBy === 'rating') return b.rating - a.rating;
      return 0; // Default order
    });

    return result;
  };

  const filteredGames = getFilteredGames();

  // Filtered Devlogs Logic for CreatorDevlogsTab
  const getFilteredDevlogs = () => {
    let list = filterByScope(devlogsList);

    if (devlogStatusTab !== 'all') {
      if (devlogStatusTab === 'archived') {
        list = list.filter((item: any) => item.status === 'archived' || !!item.archivedAt);
      } else {
        list = list.filter((item: any) => item.status === devlogStatusTab);
      }
    }

    if (devlogCategoryFilter !== 'all') {
      list = list.filter((item: any) => item.type === devlogCategoryFilter);
    }

    if (devlogGameFilter !== 'all') {
      if (devlogGameFilter === 'unlinked') {
        list = list.filter((item: any) => !item.gameId);
      } else {
        list = list.filter((item: any) => item.gameId === devlogGameFilter);
      }
    }

    if (devlogQuery.trim() !== '') {
      const q = devlogQuery.toLowerCase().trim();
      list = list.filter((item: any) => 
        item.title.toLowerCase().includes(q) || 
        item.slug.toLowerCase().includes(q) ||
        (item.gameTitle && item.gameTitle.toLowerCase().includes(q))
      );
    }

    list = [...list].sort((a: any, b: any) => {
      if (devlogSortBy === 'updated') return (new Date(b.updatedAt) as any) - (new Date(a.updatedAt) as any);
      if (devlogSortBy === 'views') return b.views - a.views;
      if (devlogSortBy === 'likes') return b.likes - a.likes;
      return 0;
    });

    return list;
  };

  const filteredDevlogs = getFilteredDevlogs();

  // Handlers for Games Tab Actions
  const handleUnpublishGame = (gameId: string) => {
    setGamesList((prev: any) => prev.map((g: any) => g.id === gameId ? { ...g, visibility: 'draft' } : g));
    setActiveGameContextMenu(null);
    triggerToast('Игра переведена в черновики', 'success');
  };

  const handleDeleteGame = () => {
    if (!deleteGameModal) return;
    if (deleteConfirmationText.trim() !== (deleteGameModal as any).title) {
      triggerToast('Название игры введено неверно', 'error');
      return;
    }
    setGamesList((prev: any) => prev.filter((g: any) => g.id !== (deleteGameModal as any).id));
    setDeleteGameModal(null);
    setDeleteConfirmationText('');
    triggerToast(`Проект «${(deleteGameModal as any).title}» безвозвратно удален`, 'success');
  };

  const handleInitiateGameTransfer = (payload: {
    gameId: string;
    gameTitle: string;
    targetType: 'user' | 'team';
    targetIdentifier: string;
  }) => {
    const newTransfer: GameTransferItem = {
      id: `tr-${Date.now()}`,
      gameId: payload.gameId,
      gameTitle: payload.gameTitle,
      gameSlug: payload.gameTitle.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      fromSubject: { type: 'user', name: 'Kael Vostokov', identifier: '@kael_vostokov' },
      toSubject: { 
        type: payload.targetType, 
        name: payload.targetIdentifier.replace('@', ''), 
        identifier: payload.targetIdentifier 
      },
      monetizationType: 'free',
      requiresSellerVerification: false,
      recipientHasSellerProfile: true,
      status: 'pending',
      createdAt: 'Только что',
      direction: 'outgoing'
    };
    setGameTransfers(prev => [newTransfer, ...prev]);
    triggerToast(
      `Запрос на передачу «${payload.gameTitle}» (${payload.targetType === 'user' ? 'пользователю' : 'команде'} ${payload.targetIdentifier}) отправлен`,
      'success'
    );
  };

  const handleAcceptTransfer = (transfer: GameTransferItem) => {
    if (transfer.monetizationType === 'paid' && !transfer.recipientHasSellerProfile) {
      triggerToast('Для принятия платной игры требуется верифицированный Seller Profile (BR-ACC-051)', 'warning');
      setIsSellerModalOpen(true);
      return;
    }

    setGameTransfers(prev => prev.map(t => t.id === transfer.id ? { ...t, status: 'accepted' } : t));
    
    // Атомарная запись в неизменяемый журнал аудита (BR-ACC-050)
    const auditRecord: GameTransferAuditRecord = {
      id: `aud-${Date.now()}`,
      gameTitle: transfer.gameTitle,
      gameSlug: transfer.gameSlug,
      fromSubject: `${transfer.fromSubject.name} (${transfer.fromSubject.identifier})`,
      toSubject: `${transfer.toSubject.name} (${transfer.toSubject.identifier})`,
      initiatedBy: transfer.fromSubject.identifier,
      date: 'Только что',
      status: 'accepted'
    };
    setTransferAuditLogs(prev => [auditRecord, ...prev]);

    // Атомарная смена владельца: игра появляется у получателя (BR-ACC-047)
    const transferredGame = {
      id: transfer.gameId,
      title: transfer.gameTitle,
      slug: transfer.gameSlug,
      coverUrl: transfer.gameCover,
      isPersonal: transfer.toSubject.type === 'user',
      ownerName: transfer.toSubject.name,
      visibility: 'public',
      status: 'released',
      monetization: transfer.monetizationType,
      hasBuild: true,
      version: 'v1.0.0',
      updatedAt: 'Только что',
      views: 0,
      downloads: 0,
      rating: 5.0,
      reviewsCount: 0
    };
    setGamesList((prev: any) => [transferredGame, ...prev]);
    triggerToast(`Вы приняли права на игру «${transfer.gameTitle}»!`, 'success');
  };

  const handleToggleSellerVerification = (transferId: string) => {
    setGameTransfers(prev => prev.map(t => t.id === transferId ? { ...t, recipientHasSellerProfile: !t.recipientHasSellerProfile } : t));
    triggerToast('Статус верификации продавца изменён для теста', 'info');
  };

  const handleSaveSellerInfo = (data: { taxStatus: string; inn: string; bik: string; accountNum: string }) => {
    setGameTransfers(prev => prev.map(t => ({ ...t, recipientHasSellerProfile: true })));
    triggerToast('Seller Profile успешно верифицирован! Теперь вы можете принять коммерческие игры', 'success');
  };

  const handleRejectTransfer = (transfer: GameTransferItem) => {
    setGameTransfers(prev => prev.map(t => t.id === transfer.id ? { ...t, status: 'rejected' } : t));
    const auditRecord: GameTransferAuditRecord = {
      id: `aud-${Date.now()}`,
      gameTitle: transfer.gameTitle,
      gameSlug: transfer.gameSlug,
      fromSubject: `${transfer.fromSubject.name} (${transfer.fromSubject.identifier})`,
      toSubject: `${transfer.toSubject.name} (${transfer.toSubject.identifier})`,
      initiatedBy: transfer.fromSubject.identifier,
      date: 'Только что',
      status: 'rejected'
    };
    setTransferAuditLogs(prev => [auditRecord, ...prev]);
    triggerToast(`Запрос на передачу «${transfer.gameTitle}» отклонён`, 'info');
  };

  const handleCancelTransfer = (transfer: GameTransferItem) => {
    setGameTransfers(prev => prev.filter(t => t.id !== transfer.id));
    const auditRecord: GameTransferAuditRecord = {
      id: `aud-${Date.now()}`,
      gameTitle: transfer.gameTitle,
      gameSlug: transfer.gameSlug,
      fromSubject: `${transfer.fromSubject.name} (${transfer.fromSubject.identifier})`,
      toSubject: `${transfer.toSubject.name} (${transfer.toSubject.identifier})`,
      initiatedBy: transfer.fromSubject.identifier,
      date: 'Только что',
      status: 'cancelled'
    };
    setTransferAuditLogs(prev => [auditRecord, ...prev]);
    triggerToast(`Исходящий запрос на передачу «${transfer.gameTitle}» отозван`, 'info');
  };

  const handleSimulateBuildUpload = () => {
    setIsUploadingFile(true);
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploadingFile(false);
          setGamesList((prevGames: any) => prevGames.map((g: any) => g.id === (quickUploadGame as any)?.id ? { ...g, hasBuild: true, version: uploadVersionInput } : g));
          setQuickUploadGame(null);
          triggerToast(`Новый билд ${uploadVersionInput} успешно загружен!`, 'success');
          return 100;
        }
        return prev + 30;
      });
    }, 300);
  };


  const handleScopeChange = (newScope: string, toastMessage?: string) => {
    setScope(newScope);
    setActiveNav('overview');
    setIsScopeDropdownOpen(false);
    if (toastMessage) triggerToast(toastMessage);
  };

  const handleResolveAttention = (item: any) => {
    if (item.type === 'game_transfer_pending') {
      setIsTransfersDrawerOpen(true);
      return;
    }
    if (item.type === 'seller_issue') {
      setIsSellerModalOpen(true);
      setActiveNav('sales');
      setAttentionItems((prev: any) => prev.filter((i: any) => i.id !== item.id));
      return;
    }
    if (item.type === 'contact_request') {
      triggerToast('Запрос деловых контактов от издателя открыт', 'info');
      setAttentionItems((prev: any) => prev.filter((i: any) => i.id !== item.id));
      return;
    }
    setAttentionItems((prev: any) => prev.filter((i: any) => i.id !== item.id));
    setActiveNav(item.targetTab);
    if (item.targetSubTab) setCommunitySubTab(item.targetSubTab);
    triggerToast('Переход к разрешению события...', 'success');
  };

  const handleReplyReview = (id: string) => {
    if (!(inboxReplyText as any)[id]?.trim()) return;
    setInboxReviews((prev: any) => prev.filter((r: any) => r.id !== id));
    setInboxReplyText((prev: any) => ({ ...prev, [id]: '' }));
    triggerToast('Ответ опубликован', 'success');
  };

  const handleDeleteDevlog = () => {
    if (!deleteDevlogModal) return;
    setDevlogsList((prev: any) => prev.filter((d: any) => d.id !== (deleteDevlogModal as any).id));
    triggerToast(`Запись «${(deleteDevlogModal as any).title}» безвозвратно удалена`, 'success');
    setDeleteDevlogModal(null);
  };

  const handlePublishNow = (devlog: any) => {
    setDevlogsList((prev: any) => prev.map((d: any) => d.id === devlog.id ? { ...d, status: 'published', publishedAt: 'Только что' } : d));
    triggerToast(`Пост «${devlog.title}» опубликован!`, 'success');
    setActiveDevlogContextMenu(null);
  };

  const handleUnpublish = (devlog: any) => {
    setDevlogsList((prev: any) => prev.map((d: any) => d.id === devlog.id ? { ...d, status: 'draft' } : d));
    triggerToast(`Пост переведен в черновики`, 'info');
    setActiveDevlogContextMenu(null);
  };

  const handleDuplicate = (devlog: any) => {
    const copy = {
      ...devlog,
      id: `dev_${Date.now()}`,
      title: `${devlog.title} (Копия)`,
      slug: `${devlog.slug}-copy`,
      status: 'draft',
      views: 0,
      likes: 0,
      comments: 0,
      updatedAt: 'Только что'
    };
    setDevlogsList((prev: any) => [copy, ...prev]);
    triggerToast(`Создан дубликат записи в черновиках`, 'success');
    setActiveDevlogContextMenu(null);
  };

  // Community Tab Handlers
  const handleOpenInlineEditor = (review: any) => {
    if (!scopeInfo.canManageReviews) {
      triggerToast('У вас нет прав reviews.manage для ответа на отзывы команды', 'info');
      return;
    }
    setEditingResponseId(review.id);
    setResponseText(review.officialResponse ? review.officialResponse.text : '');
  };

  const handleSaveResponse = (reviewId: string) => {
    if (!responseText.trim()) return;
    setReviewsList((prev: any) => prev.map((rev: any) => {
      if (rev.id === reviewId) {
        return {
          ...rev,
          officialResponse: {
            id: rev.officialResponse ? rev.officialResponse.id : `resp_${Date.now()}`,
            authorName: scopeInfo ? scopeInfo.name : 'Разработчик',
            text: responseText.trim(),
            updatedAt: 'Только что'
          }
        };
      }
      return rev;
    }));
    setEditingResponseId(null);
    setResponseText('');
    triggerToast('Официальный ответ сохранен и опубликован', 'success');
  };

  const handleDeleteResponseConfirm = () => {
    if (!deleteTargetReview) return;
    setReviewsList((prev: any) => prev.map((rev: any) => {
      if (rev.id === (deleteTargetReview as any).id) {
        return { ...rev, officialResponse: null };
      }
      return rev;
    }));
    setDeleteTargetReview(null);
    triggerToast('Официальный ответ удален', 'info');
  };

  const handleSendReport = (e: React.FormEvent) => {
    e.preventDefault();
    setReportTargetReview(null);
    setReportDetails('');
    triggerToast('Жалоба отправлена модераторам платформы', 'success');
  };

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            className={`w-3.5 h-3.5 ${star <= rating ? 'text-accent fill-accent' : 'text-textTertiary'}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-surface-0 text-textPrimary font-sans pb-24 select-none relative overflow-x-hidden">
      

      {/* ================= ГЛАВНЫЙ ВОРКСПЕЙС ================= */}
      <main className="max-w-[1440px] mx-auto px-4 md:px-8 pt-8">

        {/* BREADCRUMBS */}
        <div className="flex items-center gap-2 text-xs font-mono text-textSecondary uppercase tracking-wider mb-4">
          <a href="#" className="hover:text-textPrimary transition-colors">Главная</a>
          <span>/</span>
          <span className="text-textPrimary font-semibold">Кабинет автора</span>
        </div>

        {/* ================= HEADER & SCOPE ================= */}
        {pageState === 'loading' ? (
          <div className="mb-8 animate-pulse flex flex-col md:flex-row justify-between gap-6">
             <div className="h-10 w-48 bg-surface-1 rounded-control" />
             <div className="h-10 w-32 bg-surface-1 rounded-control" />
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
            
            {/* Scope Selector */}
            <div className="relative" ref={scopeMenuRef}>
              <button 
                onClick={() => setIsScopeDropdownOpen(!isScopeDropdownOpen)}
                className="flex items-center gap-3 hover:bg-surface-1 p-2 -ml-2 rounded-card transition-colors outline-none focus-visible:outline-none"
              >
                {scopeInfo.avatar ? (
                  <img src={scopeInfo.avatar} alt="Avatar" className="w-10 h-10 rounded-full border border-surface-3 object-cover shadow-sm bg-surface-1" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-surface-2 border border-borderDef flex items-center justify-center text-textSecondary shadow-sm">
                    <FolderKanban className="w-5 h-5" />
                  </div>
                )}
                
                <div className="flex flex-col items-start text-left">
                  <div className="flex items-center gap-2">
                    <h1 className="text-heading-3 font-bold text-textPrimary tracking-tight">{scopeInfo.name}</h1>
                    <ChevronDown className={`w-4 h-4 text-textSecondary transition-transform duration-200 ${isScopeDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                  <span className="text-[11px] font-mono text-textSecondary uppercase tracking-wider">
                    {scope === 'personal' ? 'Личный аккаунт' : scope === 'all' ? 'Все ресурсы' : scopeInfo.badge}
                  </span>
                </div>
              </button>

              {isScopeDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-[260px] bg-surface-2/95 backdrop-blur-xl border border-borderDef shadow-elevation-overlay rounded-card p-1.5 font-sans text-xs animate-fadeIn space-y-0.5 z-50">
                  <span className="px-2.5 py-1.5 text-[10px] font-mono text-textTertiary uppercase tracking-wider block">Личный</span>
                  <button 
                    onClick={() => handleScopeChange('personal', 'Контекст: Личный аккаунт')}
                    className={scope === 'personal' ? 'w-full text-left px-3.5 py-2.5 min-h-[38px] rounded-control flex items-center justify-between transition-all duration-120 cursor-pointer bg-accent/15 text-accent font-bold' : 'w-full text-left px-3.5 py-2.5 min-h-[38px] rounded-control flex items-center justify-between transition-all duration-120 cursor-pointer text-textSecondary hover:text-textPrimary hover:bg-surface-3/80 active:bg-surface-3'}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center">
                         <User className="w-3.5 h-3.5 text-accent" />
                      </div>
                      <span className="font-semibold text-sm">Личный аккаунт</span>
                    </div>
                    {scope === 'personal' && <Check className="w-4 h-4 text-accent" />}
                  </button>

                  <div className="my-1.5 border-t border-borderDef" />
                  <span className="px-2.5 py-1.5 text-[10px] font-mono text-textTertiary uppercase tracking-wider block">Команды</span>
                  
                  {teamsList.map(team => (
                    <button 
                      key={team.id}
                      onClick={() => handleScopeChange(team.id, `Контекст: ${team.name}`)}
                      className={scope === team.id ? 'w-full text-left px-3.5 py-2.5 min-h-[38px] rounded-control flex items-center justify-between transition-all duration-120 cursor-pointer bg-accent/15 text-accent font-bold' : 'w-full text-left px-3.5 py-2.5 min-h-[38px] rounded-control flex items-center justify-between transition-all duration-120 cursor-pointer text-textSecondary hover:text-textPrimary hover:bg-surface-3/80 active:bg-surface-3'}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full border border-surface-3 overflow-hidden bg-surface-0">
                          <img src={team.logo} alt="T" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm leading-tight">{team.name}</span>
                        </div>
                      </div>
                      {scope === team.id && <Check className="w-4 h-4 text-accent" />}
                    </button>
                  ))}

                  <div className="my-1.5 border-t border-borderDef" />
                  <button 
                    onClick={() => handleScopeChange('all', 'Контекст: Все ресурсы')}
                    className={scope === 'all' ? 'w-full text-left px-3.5 py-2.5 min-h-[38px] rounded-control flex items-center justify-between transition-all duration-120 cursor-pointer bg-accent/15 text-accent font-bold' : 'w-full text-left px-3.5 py-2.5 min-h-[38px] rounded-control flex items-center justify-between transition-all duration-120 cursor-pointer text-textSecondary hover:text-textPrimary hover:bg-surface-3/80 active:bg-surface-3'}
                  >
                    <div className="flex items-center gap-2.5">
                      <FolderKanban className="w-4 h-4 text-textSecondary" />
                      <span className="font-medium text-sm">Все ресурсы (Агрегация)</span>
                    </div>
                    {scope === 'all' && <Check className="w-4 h-4 text-accent" />}
                  </button>
                </div>
              )}
            </div>

            {/* Smart Create Button */}
            <div className="relative w-full lg:w-auto" ref={createMenuRef}>
              <button 
                onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
                className="w-full lg:w-auto h-10 px-5 bg-accent hover:bg-accent-hover-hover text-white border border-transparent shadow-accent/20 font-bold text-sm rounded-control transition-colors flex items-center justify-center gap-2 shadow-elevation-base focus:outline-none"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Создать...</span>
              </button>

              {isCreateMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-surface-2/95 backdrop-blur-xl border border-borderDef shadow-elevation-overlay rounded-card p-1.5 font-sans text-xs animate-fadeIn space-y-0.5 z-50">
                  <button 
                    onClick={() => { setIsCreateMenuOpen(false); triggerToast('Редирект на /creator/games/new'); }}
                    className="w-full text-left px-3.5 py-2.5 min-h-[38px] rounded-control flex items-center gap-2.5 transition-all duration-120 cursor-pointer text-textSecondary hover:text-textPrimary hover:bg-surface-3/80 active:bg-surface-3"
                  >
                    <Gamepad2 className="w-4 h-4 text-textPrimary" /> Новую игру
                  </button>
                  <button 
                    onClick={() => { 
                      setIsCreateMenuOpen(false); 
                      if ((window as any).__hubigrNavigate) (window as any).__hubigrNavigate('/devlogs/new');
                      else window.location.href = '#/devlogs/new';
                    }}
                    className="w-full text-left px-3.5 py-2.5 min-h-[38px] rounded-control flex items-center gap-2.5 transition-all duration-120 cursor-pointer text-textSecondary hover:text-textPrimary hover:bg-surface-3/80 active:bg-surface-3"
                  >
                    <FileText className="w-4 h-4 text-textPrimary" /> Девлог / Новость
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= ГЛАВНАЯ НАВИГАЦИЯ ================= */}
        <div className="border-b border-borderDef mb-8 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-6 min-w-max text-[13px] font-bold uppercase tracking-wider font-mono">
            {[
              { id: 'overview', label: 'Обзор' },
              { id: 'projects', label: `Проекты (${filterByScope(gamesList).length})` },
              { id: 'devlogs', label: `Девлоги (${filterByScope(devlogsList).length})` },
              { id: 'community', label: `Отзывы и фидбек (${filterByScope(reviewsList).length + filterByScope(feedbackList).length})` },
              { id: 'bugs', label: `Баг-репорты (${filterByScope(bugsList).filter((b: any) => b.status === 'open' || b.status === 'new' || b.status === 'in_progress').length})` },
              { id: 'analytics', label: 'Аналитика' },
              { id: 'sales', label: 'Продажи' },
              { id: 'teams', label: 'Команды' },
              { id: 'support', label: 'Поддержка' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveNav(tab.id)}
                className={`pb-3.5 relative transition-colors cursor-pointer focus-visible:outline-none ${
                  activeNav === tab.id ? 'text-textPrimary' : 'text-textSecondary hover:text-textPrimary'
                }`}
              >
                <span>{tab.label}</span>
                {activeNav === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-t-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ================= ПУСТАЯ ЗАГЛУШКА ================= */}
        {pageState === 'empty' ? (
          <div className="bg-surface-1 border border-borderDef rounded-card p-16 text-center flex flex-col items-center gap-6 max-w-[600px] mx-auto my-12 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center text-textSecondary">
              <Rocket className="w-8 h-8 stroke-[1.5]" />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-heading-3 font-bold text-textPrimary">У вас пока нет проектов</h2>
              <p className="text-sm text-textSecondary leading-relaxed">
                Опубликуйте свою первую игру, чтобы отслеживать статистику, собирать отзывы и начать зарабатывать.
              </p>
            </div>
            <button 
              onClick={() => { setPageState('standard'); triggerToast('Редирект на /creator/games/new'); }}
              className="mt-2 px-6 py-3 bg-accent hover:bg-accent-hover-hover text-white border border-transparent shadow-accent/20 font-bold text-sm rounded-control transition-colors flex items-center gap-2 shadow-elevation-base"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" /> Создать проект
            </button>
          </div>
        ) : (
          <div className="animate-fadeIn">

            {/* ================= ТАБ 1: ОБЗОР (ОБЩАЯ) ================= */}
{activeNav === 'overview' && (
              <div className="animate-fadeIn w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-surface-1 border border-borderDef rounded-card divide-y sm:divide-y-0 sm:divide-x divide-borderDef overflow-hidden mb-12 animate-fadeIn shadow-sm">
                <div 
                  onClick={() => setActiveNav('analytics')}
                  className="p-5 flex flex-col justify-between hover:bg-surface-2 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center justify-between text-textSecondary mb-3">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider">Просмотры</span>
                    <Eye className="w-4 h-4 text-textTertiary group-hover:text-accent transition-colors" />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-heading-2 font-bold text-textPrimary font-mono">49,050</span>
                    <span className="text-[11px] font-mono font-bold text-success">+14%</span>
                  </div>
                </div>

                <div 
                  onClick={() => setActiveNav('projects')}
                  className="p-5 flex flex-col justify-between hover:bg-surface-2 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center justify-between text-textSecondary mb-3">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider">Запуски</span>
                    <Download className="w-4 h-4 text-textTertiary group-hover:text-info transition-colors" />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-heading-2 font-bold text-textPrimary font-mono">12,820</span>
                    <span className="text-[11px] font-mono text-textTertiary">30 дней</span>
                  </div>
                </div>

                <div 
                  onClick={() => setActiveNav('community')}
                  className="p-5 flex flex-col justify-between hover:bg-surface-2 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center justify-between text-textSecondary mb-3">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-warning">Без ответа</span>
                    <MessageSquare className="w-4 h-4 text-warning" />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-heading-2 font-bold text-textPrimary font-mono">14</span>
                    <span className="text-[11px] font-mono text-warning font-semibold">требуют ответа</span>
                  </div>
                </div>

                <div 
                  onClick={() => setActiveNav('sales')}
                  className="p-5 flex flex-col justify-between hover:bg-surface-2 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center justify-between text-textSecondary mb-3">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-success">Баланс</span>
                    <Wallet className="w-4 h-4 text-success" />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-heading-2 font-bold text-textPrimary font-mono flex items-baseline gap-1">
                      <span className="text-sm text-textTertiary">₽</span>
                      142,500
                    </span>
                    <span className="text-[11px] font-mono text-success font-medium">доступно</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col xl:flex-row gap-12 xl:gap-16 animate-fadeIn">
                
                {/* ЛЕВАЯ КОЛОНКА (Основной фокус) */}
                <div className="flex-1 w-full flex flex-col gap-12">
                  
                  {/* Блок 1: Экспресс-инбокс (Самое важное) */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-heading-3 font-bold tracking-tight text-textPrimary">Требуют внимания</h2>
                      {(filteredAttention.length > 0 || filteredInboxReviews.length > 0 || filteredInboxBugs.length > 0) && (
                        <span className="px-2.5 py-1 bg-warning/10 text-warning text-xs font-bold rounded-md flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {filteredAttention.length + filteredInboxReviews.length + filteredInboxBugs.length} событий
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      {/* Структурные оповещения */}
                      {filteredAttention.length > 0 && filteredAttention.map((item) => {
                        const ItemIcon = item.icon;
                        const severityConfig = {
                          critical: { bg: 'bg-danger/5 hover:bg-danger/10 border-danger/30', indicator: 'bg-danger', text: 'text-danger' },
                          high: { bg: 'bg-warning/5 hover:bg-warning/10 border-warning/30', indicator: 'bg-warning', text: 'text-warning' },
                          medium: { bg: 'bg-accent/5 hover:bg-accent/10 border-accent/30', indicator: 'bg-accent', text: 'text-accent' },
                          low: { bg: 'bg-surface-1 hover:bg-surface-2 border-borderDef hover:border-surface-3', indicator: 'bg-surface-3', text: 'text-textPrimary' }
                        };
                        const config = (severityConfig as any)[item.severity] || severityConfig.low;

                        return (
                          <div 
                            key={item.id}
                            className={`group ${config.bg} border p-4 rounded-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all relative overflow-hidden`}
                          >
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${config.indicator}`} />
                            <div className="flex items-start gap-3 pl-1.5 flex-1">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${config.bg.split(' ')[0].replace('bg-surface-1', 'bg-surface-2')}`}>
                                <ItemIcon className={`w-4 h-4 ${config.text}`} />
                              </div>
                              <div className="flex flex-col gap-1">
                                <h4 className="text-sm font-bold text-textPrimary leading-snug">{item.title}</h4>
                                <p className="text-xs text-textSecondary">{item.subtitle}</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => handleResolveAttention(item)}
                              className="self-end sm:self-auto shrink-0 px-3.5 py-1.5 bg-surface-0 hover:bg-surface-3 border border-borderDef text-xs font-semibold text-textPrimary rounded-control flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                            >
                              <span>{item.actionLabel}</span>
                              <ArrowRight className="w-3.5 h-3.5 text-textSecondary" />
                            </button>
                          </div>
                        );
                      })}

                      {/* Отзывы */}
                      {filteredInboxReviews.length > 0 && filteredInboxReviews.map((rev: any) => (
                        <div 
                          key={rev.id} 
                          onClick={() => setActiveNav('community')}
                          className="group bg-surface-1 hover:bg-surface-2 border border-borderDef hover:border-surface-3 p-4 rounded-card flex items-start gap-4 transition-all cursor-pointer"
                        >
                          <div className="w-8 h-8 rounded-full bg-info/10 flex items-center justify-center shrink-0 mt-0.5">
                            <MessageSquare className="w-4 h-4 text-info" />
                          </div>
                          <div className="flex-1 flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-mono text-textSecondary">{rev.author} • {rev.game}</span>
                              <ChevronRight className="w-4 h-4 text-textSecondary opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                            </div>
                            <p className="text-sm text-textPrimary leading-snug line-clamp-2">{rev.text}</p>
                          </div>
                        </div>
                      ))}

                      {/* Баги */}
                      {filteredInboxBugs.length > 0 && filteredInboxBugs.map((bug: any) => (
                        <div 
                          key={bug.id} 
                          onClick={() => setActiveNav('bugs')}
                          className="group bg-surface-1 hover:bg-surface-2 border border-borderDef hover:border-surface-3 p-4 rounded-card flex items-start gap-4 transition-all cursor-pointer"
                        >
                          <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center shrink-0 mt-0.5">
                            <Bug className="w-4 h-4 text-warning" />
                          </div>
                          <div className="flex-1 flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-xs font-mono text-textSecondary">
                                <span className="text-warning bg-warning/10 px-1.5 py-0.5 rounded font-bold uppercase">{bug.priority}</span>
                                <span>{bug.game}</span>
                              </div>
                              <ChevronRight className="w-4 h-4 text-textSecondary opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                            </div>
                            <p className="text-sm font-semibold text-textPrimary">{bug.title}</p>
                          </div>
                        </div>
                      ))}

                      {filteredAttention.length === 0 && filteredInboxReviews.length === 0 && filteredInboxBugs.length === 0 && (
                        <div className="bg-surface-1 border border-borderDef p-8 rounded-card flex flex-col items-center justify-center text-center gap-3">
                          <CheckCircle2 className="w-8 h-8 text-success" />
                          <div className="space-y-1">
                            <p className="font-semibold text-textPrimary">Всё чисто!</p>
                            <p className="text-xs text-textSecondary">Нет новых критических багов или неотвеченных отзывов.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Блок 2: Последние проекты */}
                  <div className="flex flex-col gap-4 mt-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-heading-3 font-bold tracking-tight text-textPrimary">Активные проекты</h2>
                      <button onClick={() => setActiveNav('projects')} className="text-xs font-mono text-textSecondary hover:text-textPrimary transition-colors flex items-center gap-1">Все проекты <ArrowRight className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredGames.slice(0, 4).map(game => (
                        <div 
                          key={game.id} 
                          onClick={() => setActiveNav('projects')}
                          className="group bg-surface-1 hover:bg-surface-2 border border-borderDef hover:border-accent/40 p-4 rounded-card flex flex-col gap-4 cursor-pointer transition-all"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <img src={game.cover} alt={game.title} className="w-12 h-12 object-cover rounded-md border border-borderDef" />
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${game.status === 'published' ? 'bg-success/10 text-success border border-success/20' : game.status === 'rejected' ? 'bg-danger/10 text-danger border border-danger/20' : 'bg-surface-2 text-textSecondary border border-borderDef'}`}>{game.statusLabel}</span>
                          </div>
                          <div>
                            <h3 className="font-bold text-textPrimary group-hover:text-accent transition-colors truncate">{game.title}</h3>
                            <div className="text-xs font-mono text-textSecondary mt-1 flex items-center gap-2">
                              <span>{game.platform}</span><span>•</span><span>v{game.version}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 mt-4">
                  {/* Блок 3: Недавние события */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-accent" />
                        <h2 className="text-heading-3 font-bold tracking-tight text-textPrimary">Последние события</h2>
                      </div>
                    </div>

                    <div className="bg-surface-1 border border-borderDef rounded-card divide-y divide-borderDef overflow-hidden shadow-sm">
                      {filterByScope(recentEvents).length === 0 ? (
                        <div className="p-8 text-center flex flex-col items-center gap-2">
                          <Clock className="w-6 h-6 text-textTertiary" />
                          <p className="text-xs text-textSecondary">В текущем контексте пока нет недавних событий</p>
                        </div>
                      ) : (
                        filterByScope(recentEvents).map(ev => {
                          const iconMap: Record<string, any> = {
                            transfer: ArrowRightLeft,
                            review: Star,
                            bug: Bug,
                            devlog: FileText,
                            finance: Wallet
                          };
                          const EvIcon = iconMap[ev.type] || Activity;

                          return (
                            <div key={ev.id} className="p-4 flex items-start justify-between gap-4 hover:bg-surface-2/60 transition-colors">
                              <div className="flex items-start gap-3.5">
                                <div className="w-8 h-8 rounded-full bg-surface-2 border border-borderDef flex items-center justify-center shrink-0 mt-0.5">
                                  <EvIcon className={`w-4 h-4 ${ev.statusColor}`} />
                                </div>
                                <div className="flex flex-col gap-0.5">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="text-sm font-semibold text-textPrimary leading-snug">{ev.title}</h4>
                                    <span className="px-2 py-0.5 bg-surface-2 border border-borderDef rounded text-[10px] font-mono font-bold uppercase tracking-wider text-textSecondary">
                                      {ev.tag}
                                    </span>
                                  </div>
                                  <p className="text-xs text-textSecondary leading-relaxed">{ev.description}</p>
                                </div>
                              </div>
                              <span className="text-[11px] font-mono text-textTertiary whitespace-nowrap shrink-0">{ev.timestamp}</span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                </div>

                {/* ПРАВАЯ КОЛОНКА (Вспомогательная) */}
                <aside className="w-full xl:w-[360px] shrink-0 flex flex-col gap-12">
                  
                  {/* Быстрые действия (Главные кнопки) */}
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => triggerToast('В разработке')}
                      className="w-full h-11 bg-accent hover:bg-accent-hover-hover text-white font-bold text-sm rounded-card transition-colors flex items-center justify-center gap-2 shadow-elevation-raised shadow-accent/20"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" /> Создать проект
                    </button>
                    <button 
                      onClick={() => {
                        if ((window as any).__hubigrNavigate) (window as any).__hubigrNavigate('/devlogs/new');
                        else window.location.href = '#/devlogs/new';
                      }}
                      className="w-full h-11 bg-surface-1 hover:bg-surface-2 border border-borderDef text-textPrimary font-semibold text-sm rounded-card transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4 text-textSecondary" /> Написать девлог
                    </button>
                  </div>

                  {/* Аналитика Сводка */}
                  <div className="flex flex-col gap-4">
                    <h2 className="text-sm font-bold tracking-tight text-textSecondary uppercase">Аналитика (30 дней)</h2>
                    <div className="bg-surface-1 border border-borderDef rounded-card p-5 flex flex-col gap-5">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                          <span className="text-heading-2 font-bold font-mono text-textPrimary">24.5%</span>
                          <span className="text-xs text-textSecondary font-medium">Конверсия в запуск</span>
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 bg-success/10 text-success rounded text-xs font-bold font-mono">
                          <TrendingUp className="w-3 h-3" /> +12%
                        </div>
                      </div>
                      <div className="h-px w-full bg-borderDef" />
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-textSecondary flex items-center gap-2"><UserPlus className="w-4 h-4" /> Новые фолловеры</span>
                          <span className="font-mono font-bold text-textPrimary">+12</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-textSecondary flex items-center gap-2"><Users className="w-4 h-4" /> Игроки</span>
                          <span className="font-mono font-bold text-textPrimary">12.4k</span>
                        </div>
                      </div>
                      <button onClick={() => setActiveNav('analytics')} className="w-full mt-2 py-2 text-xs font-semibold text-textSecondary hover:text-textPrimary bg-surface-2 hover:bg-surface-3 rounded-control transition-colors">
                        Подробный отчет
                      </button>
                    </div>
                  </div>

                </aside>
              </div>
            </div>
            )}

            {/* ================= ХАБ 2: ПРОЕКТЫ И БИЛДЫ (CreatorGamesTab) ================= */}
            {activeNav === 'projects' && (
              <div className="flex flex-col gap-6">

                {/* Scoped Capability Restriction: publishing (BR-ACC-056, FR-ACC-053) */}
                {publishingRestricted && (
                  <ScopedForbiddenNotice
                    capability="publishing"
                    onOpenAppeal={() => {
                      if ((window as any).__hubigrNavigate) (window as any).__hubigrNavigate('/account-restricted');
                    }}
                  />
                )}

                {/* --- 2.1. ВЕРХНЯЯ ПАНЕЛЬ ДЕЙСТВИЙ И ПОИСКА (TOOLBAR & FILTERS) --- */}
                <div className="flex flex-col gap-4">
                  
                  {/* Search Bar & Actions Header */}
                  <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                    {/* Input with Clear Icon */}
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-textSecondary" />
                      <input 
                        type="text"
                        value={gamesSearchQuery}
                        onChange={(e) => setGamesSearchQuery(e.target.value)}
                        placeholder="Поиск по названию игры или слагу..."
                        className="w-full h-10 bg-surface-2 border border-borderDef focus:border-accent text-textPrimary text-xs font-sans rounded-md pl-10 pr-10 outline-none transition-colors"
                      />
                      {gamesSearchQuery && (
                        <button 
                          onClick={() => setGamesSearchQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-textSecondary hover:text-textPrimary transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Secondary Filters Dropdowns */}
                    <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
                      {/* Dev Stage Filter */}
                      <CustomSelect 
                        value={gamesStatusFilter}
                        onChange={setGamesStatusFilter}
                        options={[
                          { value: 'all', label: 'Все этапы' },
                          { value: 'released', label: 'Релиз / Выпущено' },
                          { value: 'in_dev', label: 'В разработке' },
                          { value: 'prototype', label: 'Прототип' },
                          { value: 'on_hold', label: 'На паузе' },
                          { value: 'canceled', label: 'Отменено' }
                        ]}
                      />

                      {/* Sort Dropdown */}
                      <CustomSelect 
                        value={gamesSortBy}
                        onChange={setGamesSortBy}
                        options={[
                          { value: 'updated_at', label: 'По дате обновления' },
                          { value: 'created_at', label: 'Сначала новые' },
                          { value: 'downloads', label: 'По скачиваниям' },
                          { value: 'rating', label: 'По рейтингу' }
                        ]}
                      />

                      {/* Primary CTA Button (Scope Permission Protected) */}
                      {scopeInfo.canManageGames && (
                        <button 
                          onClick={() => { 
                            if (publishingRestricted) {
                              triggerToast('Публикация и создание проектов приостановлены модерацией (дело #RES-PUB-8041)', 'warning');
                              return;
                            }
                            if ((window as any).__hubigrNavigate) (window as any).__hubigrNavigate('/game-editor'); 
                          }}
                          className={`shrink-0 h-10 px-5 font-bold text-xs uppercase tracking-wider rounded-md transition-colors flex items-center justify-center gap-2 active:scale-95 duration-120 focus:outline-none ${
                            publishingRestricted 
                              ? 'bg-surface-3 text-textTertiary cursor-not-allowed border border-borderDef' 
                              : 'bg-accent hover:bg-accent-hover-hover text-white'
                          }`}
                        >
                          <Plus className="w-4 h-4 stroke-[2.5]" />
                          <span>Создать игру</span>
                        </button>
                      )}

                      {/* Game Transfers Center Button (FE-ACC-007) */}
                      <button 
                        onClick={() => setIsTransfersDrawerOpen(true)}
                        className="shrink-0 h-10 px-4 bg-surface-1 hover:bg-surface-2 border border-borderDef hover:border-accent/40 text-textPrimary font-semibold text-xs rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer relative"
                        title="Центр трансферов прав на игры"
                      >
                        <ArrowRightLeft className="w-4 h-4 text-accent" />
                        <span>Трансферы</span>
                        {incomingPendingCount > 0 && (
                          <span className="w-5 h-5 rounded-full bg-accent text-white font-mono text-[10px] font-bold flex items-center justify-center">
                            {incomingPendingCount}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* --- VISIBILITY TABS --- */}
                  <div className="flex items-center gap-2 border-t border-borderDef pt-3 overflow-x-auto no-scrollbar">
                    {[
                      { id: 'all', label: `Все (${filterByScope(gamesList).length})` },
                      { id: 'public', label: 'Опубликованные' },
                      { id: 'draft', label: 'Черновики' },
                      { id: 'unlisted', label: 'По ссылке' },
                      { id: 'jam', label: 'Джем-версии' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setGamesVisibilityFilter(tab.id)}
                        className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer outline-none whitespace-nowrap ${
                          gamesVisibilityFilter === tab.id
                            ? 'bg-surface-1 text-accent font-semibold border border-surface-3'
                            : 'text-textSecondary hover:text-textPrimary hover:bg-surface-1/50'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                </div>

                {/* --- 2.2. СЕТКА КАРТОЧЕК ПРОЕКТОВ (GAMES GRID) --- */}
                {pageState === 'loading' ? (
                  /* Skeleton State */
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <div key={i} className="bg-surface-1 border border-borderDef rounded-card overflow-hidden h-80 flex flex-col justify-between p-4">
                        <div className="w-full h-40 bg-surface-1 rounded-control" />
                        <div className="h-5 w-3/4 bg-surface-1 rounded mt-4" />
                        <div className="h-4 w-1/2 bg-surface-1 rounded mt-2" />
                        <div className="h-10 w-full bg-surface-1 rounded mt-4" />
                      </div>
                    ))}
                  </div>
                ) : filteredGames.length === 0 ? (
                  /* Filtered Empty State */
                  <div className="bg-surface-1 border border-dashed border-surface-3 rounded-card p-12 text-center flex flex-col items-center gap-4 my-4">
                    <div className="w-12 h-12 rounded-full bg-surface-2 border border-borderDef flex items-center justify-center text-textSecondary">
                      <Search className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-body-lg font-bold text-textPrimary">Проекты не найдены</h3>
                      <p className="text-xs text-textSecondary">По вашему запросу ничего не найдено. Попробуйте изменить параметры фильтрации или сбросить поиск.</p>
                    </div>
                    <button 
                      onClick={() => { setGamesSearchQuery(''); setGamesVisibilityFilter('all'); setGamesStatusFilter('all'); }}
                      className="h-9 px-4 bg-surface-1 hover:bg-surface-2 border border-borderDef text-xs font-semibold text-textPrimary rounded-md transition-colors mt-2"
                    >
                      Сбросить все фильтры
                    </button>
                  </div>
                ) : (
/* Actual Games Cards Grid (New Horizontal Layout) */
                  <div className="flex flex-col gap-4">
                    {filteredGames.map((game: any) => {
                      // Map mock data to spec requirements
                      const isPersonal = game.scope === 'personal';
                      const isPublic = game.visibility === 'public';
                      const isDraft = game.visibility === 'draft';
                      const isJam = game.visibility === 'jam';
                      const isUnlisted = game.visibility === 'unlisted';
                      
                      const modStatus = isDraft ? 'pending' : 'approved';
                      
                      const monetizationType = game.monetization || 'free';
                      const bugsCount = game.id === 'g_01' ? 3 : 0;
                      
                      return (
                        <div 
                          key={game.id}
                          className="flex flex-col md:flex-row items-stretch bg-surface-1 border border-borderDef rounded-card hover:border-surface-3 transition-all duration-200 group relative"
                        >
                          {/* 2.1 Media / Preview Zone */}
                          <div 
                            className="relative w-full md:w-[220px] shrink-0 aspect-video md:aspect-auto bg-surface-2 border-b md:border-b-0 md:border-r border-borderDef rounded-t-xl md:rounded-none md:rounded-l-xl overflow-hidden cursor-pointer group/media"
                            onClick={() => window.open(`#/games/${game.slug}`, '_blank')}
                          >
                            {game.cover ? (
                              <img 
                                src={game.cover} 
                                alt={game.title} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover/media:scale-[1.05]"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-surface-2 text-borderStrong">
                                <Gamepad2 className="w-10 h-10 mb-2" />
                                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '16px 16px', opacity: 0.1 }}></div>
                              </div>
                            )}
                            
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/media:opacity-100 transition-opacity flex items-center justify-center">
                              {game.platforms?.includes('webgl') ? (
                                <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center shadow-elevation-raised transform translate-y-2 group-hover/media:translate-y-0 transition-transform">
                                  <Play className="w-5 h-5 fill-white" />
                                </div>
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-surface-2/80 text-white flex items-center justify-center shadow-elevation-raised transform translate-y-2 group-hover/media:translate-y-0 transition-transform">
                                  <ExternalLink className="w-5 h-5" />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Info Architecture Zone */}
                          <div className="flex-1 flex flex-col p-4 md:p-5">
                            
                            {/* Header Row */}
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex flex-col gap-1.5">
                                <h3 
                                  className="text-body-lg font-semibold text-textPrimary hover:underline cursor-pointer truncate max-w-[400px]"
                                  onClick={() => triggerToast('В разработке')}
                                >
                                  {game.title}
                                </h3>
                                
                                <div className="flex items-center gap-3 flex-wrap">
                                  {/* Slug */}
                                  <div className="flex items-center gap-1.5 text-xs font-mono text-textSecondary hover:text-textPrimary cursor-pointer transition-colors" onClick={() => triggerToast('В разработке')}>
                                    <span>/games/{game.slug}</span>
                                    <Copy className="w-3.5 h-3.5" />
                                  </div>
                                  
                                  <span className="w-1 h-1 rounded-full bg-borderStrong hidden sm:block"></span>
                                  
                                  {/* Ownership */}
                                  {isPersonal ? (
                                    <div 
                                      className="flex items-center gap-1.5 text-xs text-textSecondary font-medium cursor-pointer hover:text-accent transition-colors"
                                      onClick={() => setGameForTransfer(game)}
                                      title="Передать права на игру"
                                    >
                                      <User className="w-3.5 h-3.5" /> Личный
                                    </div>
                                  ) : (
                                    <div 
                                      className="flex items-center gap-1.5 text-xs text-info font-medium cursor-pointer hover:underline" 
                                      onClick={() => setGameForTransfer(game)}
                                      title="Передать права на игру"
                                    >
                                      <Users className="w-3.5 h-3.5" /> Студия: {game.ownerName}
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Badges Container */}
                              <div className="flex flex-wrap justify-end gap-2 shrink-0 max-w-[200px]">
                                {/* Visibility & Moderation */}
                                {isDraft ? (
                                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-mono bg-surface-2 text-textSecondary border border-borderDef" title="Проект виден только автору">
                                    <Edit3 className="w-3 h-3" /> Черновик
                                  </div>
                                ) : isUnlisted ? (
                                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-mono bg-warning/10 text-warning border border-warning/20" title="Доступ только по ссылке">
                                    <ExternalLink className="w-3 h-3" /> По ссылке
                                  </div>
                                ) : isPublic && modStatus === 'approved' ? (
                                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-mono bg-success/10 text-success border border-success/20" title="Опубликован">
                                    <Eye className="w-3 h-3" /> Опубликовано
                                  </div>
                                ) : modStatus === 'pending' ? (
                                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-mono bg-warning/10 text-warning border border-warning/20" title="Проверяется модерацией">
                                    <Clock className="w-3 h-3" /> На проверке
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-mono bg-surface-2 text-textSecondary border border-borderDef">
                                    <Archive className="w-3 h-3" /> В архиве
                                  </div>
                                )}
                                
                                {/* Monetization */}
                                {monetizationType === 'free' ? (
                                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-mono bg-surface-2/60 text-textSecondary border border-borderDef">
                                    <Tag className="w-3 h-3" /> Бесплатно
                                  </div>
                                ) : monetizationType === 'pwyw' ? (
                                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-mono bg-info/10 text-info border border-info/20">
                                    <HeartHandshake className="w-3 h-3" /> PWYW
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-mono bg-accent/10 text-accent border border-accent/20">
                                    <DollarSign className="w-3 h-3" /> Платная
                                  </div>
                                )}
                                
                                {/* Jam Context */}
                                {isJam && (
                                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-mono bg-reaction/10 text-reaction border border-reaction/20">
                                    <Trophy className="w-3 h-3" /> Game Jam Entry
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Builds & Platforms */}
                            <div className="mt-4 pt-4 border-t border-borderDef flex items-center flex-wrap gap-4 text-xs font-mono">
                              {game.hasBuild ? (
                                <>
                                  <div className="flex items-center gap-3">
                                    {game.platforms?.includes('webgl') && <div className="flex items-center gap-1.5" title="WebGL"><Globe className="w-4 h-4 text-success" /></div>}
                                    {game.platforms?.includes('windows') && <div className="flex items-center gap-1.5" title="Windows"><Monitor className="w-4 h-4 text-info" /></div>}
                                    {game.platforms?.includes('mac') && <div className="flex items-center gap-1.5" title="macOS"><Apple className="w-4 h-4 text-borderStrong" /></div>}
                                    {game.platforms?.includes('linux') && <div className="flex items-center gap-1.5" title="Linux"><Terminal className="w-4 h-4 text-warning" /></div>}
                                    {game.platforms?.includes('android') && <div className="flex items-center gap-1.5" title="Android"><Smartphone className="w-4 h-4 text-success" /></div>}
                                  </div>
                                  <span className="w-1 h-1 rounded-full bg-borderStrong hidden sm:block"></span>
                                  <span className="text-textSecondary">{game.version}</span>
                                  <span className="w-1 h-1 rounded-full bg-borderStrong hidden sm:block"></span>
                                  <div className="flex items-center gap-1.5 text-textSecondary">
                                    <Clock className="w-3.5 h-3.5 opacity-60" /> Обновлено {game.updatedAt}
                                  </div>
                                </>
                              ) : (
                                <div className="flex items-center gap-2 px-2 py-1 bg-warning/10 text-warning rounded-md border border-warning/20">
                                  <AlertCircle className="w-4 h-4" /> 
                                  <span className="font-medium">Нет загруженных билдов — игра недоступна для игроков</span>
                                </div>
                              )}
                            </div>
                            
                            {/* Metrics */}
                            <div className="mt-3 flex items-center gap-5 text-xs font-mono text-textSecondary overflow-x-auto no-scrollbar">
                              <div className="flex items-center gap-1.5 shrink-0" title="Просмотры">
                                <Eye className="w-3.5 h-3.5" /> {(game.views > 1000 ? (game.views/1000).toFixed(1) + 'k' : game.views)}
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0" title="Запуски WebGL">
                                <Play className="w-3.5 h-3.5" /> {(game.downloads * 0.6 > 1000 ? (game.downloads * 0.6 / 1000).toFixed(1) + 'k' : game.downloads)}
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0" title="Скачивания">
                                <Download className="w-3.5 h-3.5" /> {(game.downloads > 1000 ? (game.downloads/1000).toFixed(1) + 'k' : game.downloads)}
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0" title="Рейтинг">
                                <Star className="w-3.5 h-3.5 text-warning fill-warning" /> {game.rating} ({game.reviewsCount})
                              </div>
                              {bugsCount > 0 && (
                                <div className="flex items-center gap-1.5 text-danger bg-danger/10 px-2 py-0.5 rounded cursor-pointer hover:bg-danger/20 transition-colors shrink-0" title="Открытые баги">
                                  <Bug className="w-3.5 h-3.5" /> {bugsCount}
                                </div>
                              )}
                            </div>
                            
                            {/* Action Bar */}
                            <div className="mt-4 pt-4 border-t border-borderDef flex items-center justify-between gap-3 flex-wrap">
                              <div className="flex items-center gap-2">
                                {/* Upload Build */}
                                <button 
                                  disabled={!scopeInfo.canManageGames}
                                  onClick={() => { setQuickUploadGame(game); triggerToast('Открытие FastBuildUploadModal'); }}
                                  className={`h-8 px-3 text-xs font-semibold rounded-md border flex items-center gap-1.5 transition-colors ${!scopeInfo.canManageGames ? 'bg-surface-2 border-borderDef text-borderStrong cursor-not-allowed' : 'bg-surface-1 border-borderDef hover:bg-surface-2 text-textPrimary'}`}
                                  title={!scopeInfo.canManageGames ? 'Требуется право game.manage для загрузки файлов' : 'Быстрая загрузка билда'}
                                >
                                  <UploadCloud className="w-3.5 h-3.5" /> Загрузить билд
                                </button>
                                
                                {/* Edit */}
                                <button 
                                  disabled={!scopeInfo.canManageGames}
                                  onClick={() => { if ((window as any).__hubigrNavigate) (window as any).__hubigrNavigate('/game-editor/' + game.id); }}
                                  className={`h-8 px-3 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors ${!scopeInfo.canManageGames ? 'bg-surface-2 border-borderDef text-borderStrong cursor-not-allowed' : 'bg-accent hover:bg-accent-hover-hover text-white border border-transparent shadow-sm'}`}
                                  title={!scopeInfo.canManageGames ? 'У вас нет прав на редактирование игр команды' : 'Редактировать'}
                                >
                                  <Pencil className="w-3.5 h-3.5" /> Редактировать
                                </button>
                              </div>
                              
                              <div className="flex items-center gap-2 ml-auto">
                                {/* Visibility Selector (Component) */}
                                <div className="w-[130px] pointer-events-auto" onClick={e => e.stopPropagation()}>
                                  <CustomSelect 
                                    size="sm"
                                    variant="form"
                                    disabled={!scopeInfo.canManageGames}
                                    value={game.visibility}
                                    onChange={(val) => { triggerToast(`Изменение статуса на ${val}`); }}
                                    options={[
                                      { value: 'draft', label: 'Черновик' },
                                      { value: 'unlisted', label: 'По ссылке' },
                                      { value: 'public', label: 'Опубликовано' },
                                      { value: 'published', label: 'Опубликовано' }
                                    ]}
                                  />
                                </div>
                                
                                {/* Context Menu */}
                                {scopeInfo.canManageGames && (
                                  <div className="relative game-card-context-menu">
                                    <button 
                                      onClick={() => setActiveGameContextMenu(activeGameContextMenu === game.id ? null : game.id)}
                                      className="w-8 h-8 rounded-md bg-surface-1 hover:bg-surface-2 border border-borderDef flex items-center justify-center text-textSecondary hover:text-textPrimary transition-colors"
                                    >
                                      <MoreVertical className="w-4 h-4" />
                                    </button>
                                    
                                    {activeGameContextMenu === game.id && (
                                      <div className="absolute bottom-full mb-2 right-0 w-56 bg-surface-2/95 backdrop-blur-xl border border-borderDef shadow-elevation-overlay rounded-card p-1.5 font-sans text-xs animate-fadeIn space-y-0.5 z-50">
                                        <button className="w-full text-left px-3.5 py-2.5 min-h-[38px] rounded-control flex items-center gap-2.5 transition-all duration-120 cursor-pointer text-textSecondary hover:text-textPrimary hover:bg-surface-3/80 active:bg-surface-3"><ExternalLink className="w-3.5 h-3.5 text-textSecondary"/> Открыть публичную страницу</button>
                                        <button className="w-full text-left px-3.5 py-2.5 min-h-[38px] rounded-control flex items-center gap-2.5 transition-all duration-120 cursor-pointer text-textSecondary hover:text-textPrimary hover:bg-surface-3/80 active:bg-surface-3"><Layers className="w-3.5 h-3.5 text-textSecondary"/> История версий и билдов</button>
                                        <button onClick={() => { setActiveGameContextMenu(null); if ((window as any).__hubigrNavigate) (window as any).__hubigrNavigate('/devlogs/new?gameId=' + game.id); else window.location.href = '#/devlogs/new?gameId=' + game.id; }} className="w-full text-left px-3.5 py-2.5 min-h-[38px] rounded-control flex items-center gap-2.5 transition-all duration-120 cursor-pointer text-textSecondary hover:text-textPrimary hover:bg-surface-3/80 active:bg-surface-3"><BookOpen className="w-3.5 h-3.5 text-textSecondary"/> Написать DevLog по этой игре</button>
                                        <button className="w-full text-left px-3.5 py-2.5 min-h-[38px] rounded-control flex items-center gap-2.5 transition-all duration-120 cursor-pointer text-textSecondary hover:text-textPrimary hover:bg-surface-3/80 active:bg-surface-3"><Bug className="w-3.5 h-3.5 text-textSecondary"/> Баг-репорты игры ({bugsCount})</button>
                                        <button disabled={!scopeInfo.canViewStats} onClick={() => { setActiveGameContextMenu(null); setActiveNav('analytics'); }} className={`w-full text-left px-3.5 py-2.5 min-h-[38px] rounded-control flex items-center gap-2.5 transition-all duration-120 ${!scopeInfo.canViewStats ? "text-textTertiary opacity-50 cursor-not-allowed" : "cursor-pointer text-textSecondary hover:text-textPrimary hover:bg-surface-3/80 active:bg-surface-3"}`} title={!scopeInfo.canViewStats ? 'Просмотр статистики ограничен (требуется право stats.view)' : 'Перейти в аналитику'}><BarChart2 className="w-3.5 h-3.5 text-textSecondary"/> Аналитика и конверсии</button>
                                        <div className="h-px w-full bg-borderDef my-1.5 opacity-50" />
                                        <button 
                                          onClick={() => {
                                            setActiveGameContextMenu(null);
                                            setGameForTransfer(game);
                                          }}
                                          className="w-full text-left px-3.5 py-2.5 min-h-[38px] rounded-control flex items-center gap-2.5 transition-all duration-120 cursor-pointer text-textSecondary hover:text-textPrimary hover:bg-surface-3/80 active:bg-surface-3"
                                        >
                                          <ArrowRightLeft className="w-3.5 h-3.5 text-textSecondary"/> Передать владение
                                        </button>
                                        <button className="w-full text-left px-3.5 py-2.5 min-h-[38px] rounded-control flex items-center gap-2.5 transition-all duration-120 cursor-pointer text-textSecondary hover:text-textPrimary hover:bg-surface-3/80 active:bg-surface-3"><Archive className="w-3.5 h-3.5 text-textSecondary"/> Перенести в архив</button>
                                        {true && (
                                          <>
                                            <div className="h-px w-full bg-borderDef my-1.5 opacity-50" />
                                            <button onClick={() => { setActiveGameContextMenu(null); triggerToast('Вызван модал удаления', 'error'); }} className="w-full text-left px-3.5 py-2.5 min-h-[38px] rounded-control flex items-center gap-2.5 transition-all duration-120 cursor-pointer text-danger hover:bg-danger/10 active:bg-danger/20"><Trash2 className="w-3.5 h-3.5"/> Удалить игру</button>
                                          </>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                {/* --- 2.3. ПАГИНАЦИЯ (PAGINATION) --- */}
                {filteredGames.length > 0 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 text-xs font-mono">
                    <div className="flex items-center gap-3 text-textSecondary">
                      <span>Показывать:</span>
                      {[12, 24, 48].map(num => (
                        <button
                          key={num}
                          onClick={() => setGamesItemsPerPage(num)}
                          className={`px-2 py-1 rounded transition-colors ${
                            gamesItemsPerPage === num ? 'bg-surface-1 text-accent font-bold border border-surface-3' : 'hover:text-textPrimary'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {}}
                        className="h-9 px-4 bg-surface-1 hover:bg-surface-2 border border-borderDef text-xs font-semibold text-textPrimary rounded-md transition-colors flex items-center gap-1.5"
                      >
                        <span>Показать еще</span>
                        <ChevronDown className="w-3.5 h-3.5 text-textSecondary" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-mono">
                      <button disabled className="px-3 py-1 bg-surface-2 border border-borderDef text-borderStrong rounded opacity-50 cursor-not-allowed">Назад</button>
                      <button className="px-3 py-1 bg-accent text-white font-bold rounded">1</button>
                      <button disabled className="px-3 py-1 bg-surface-2 border border-borderDef text-borderStrong rounded opacity-50 cursor-not-allowed">Вперед</button>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* ================= ХАБ 3: ДЕВЛОГИ (CreatorDevlogsTab) ================= */}
            {activeNav === 'devlogs' && (
              <div className="flex flex-col gap-6">

                {/* Team Read-Only Warning Banner */}
                {!scopeInfo.canManageDevlog && (
                  <div className="p-4 bg-surface-2 border border-borderDef rounded-control flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5 text-textSecondary">
                      <Lock className="w-4 h-4 text-accent" />
                      <span>Режим просмотщика в <strong>{scopeInfo.name}</strong>. У вас отсутствуют права <code>devlog.manage</code> для публикации или редактирования статей.</span>
                    </div>
                  </div>
                )}

                {/* БЛОК 1: ТУЛБАР И ФИЛЬТРЫ */}
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                    
                    {/* Live Search Input */}
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-textSecondary" />
                      <input 
                        type="text"
                        value={devlogQuery}
                        onChange={e => setDevlogQuery(e.target.value)}
                        placeholder="Поиск по заголовку статьи или тегу..."
                        className="w-full h-10 bg-surface-2 border border-borderDef focus:border-accent text-textPrimary text-xs font-sans rounded-md pl-10 pr-10 outline-none transition-colors"
                      />
                      {devlogQuery && (
                        <button onClick={() => setDevlogQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-textSecondary hover:text-textPrimary transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Filter Dropdowns & Primary CTA */}
                    <div className="flex flex-wrap items-center gap-3">
                      
                      {/* Filter by Category */}
                      <CustomSelect 
                        value={devlogCategoryFilter}
                        onChange={setDevlogCategoryFilter}
                        options={[
                          { value: 'all', label: 'Все категории' },
                          { value: 'update', label: 'Обновление (Update)' },
                          { value: 'postmortem', label: 'Постмортем (Postmortem)' },
                          { value: 'feedback', label: 'Нужен фидбек' },
                          { value: 'recruitment', label: 'Поиск команды' },
                          { value: 'announcement', label: 'Анонс (Announcement)' }
                        ]}
                      />

                      {/* Filter by Game */}
                      <CustomSelect 
                        value={devlogGameFilter}
                        onChange={setDevlogGameFilter}
                        options={[
                          { value: 'all', label: 'Все проекты' },
                          { value: 'unlinked', label: 'Глобальные (Без привязки)' },
                          ...gamesList.map(g => ({ value: g.id, label: g.title }))
                        ]}
                      />

                      {/* Sorting */}
                      <CustomSelect 
                        value={devlogSortBy}
                        onChange={setDevlogSortBy}
                        options={[
                          { value: 'updated', label: 'По дате обновления' },
                          { value: 'views', label: 'По просмотрам' },
                          { value: 'likes', label: 'По реакциям / лайкам' }
                        ]}
                      />

                      {/* CTA Button */}
                      {scopeInfo.canManageDevlog && (
                        <button 
                          onClick={() => {
                            if ((window as any).__hubigrNavigate) (window as any).__hubigrNavigate('/devlogs/new');
                            else window.location.href = '#/devlogs/new';
                          }}
                          className="h-10 px-5 bg-info hover:bg-info text-white font-bold text-xs uppercase tracking-wider rounded-md transition-colors flex items-center gap-2 active:scale-95 duration-120 cursor-pointer"
                        >
                          <Plus className="w-4 h-4 stroke-[2.5]" />
                          <span>Написать пост</span>
                        </button>
                      )}

                    </div>
                  </div>

                  {/* TABBAR ФИЛЬТРАЦИИ ПО СТАТУСУ */}
                  <div className="flex items-center gap-2 border-t border-borderDef pt-3 overflow-x-auto no-scrollbar">
                    {[
                      { id: 'all', label: `Все (${filterByScope(devlogsList).length})` },
                      { id: 'published', label: 'Опубликованные' },
                      { id: 'draft', label: 'Черновики' },
                      { id: 'scheduled', label: 'Запланированные' },
                      { id: 'blocked', label: 'Заблокированные' },
                      { id: 'archived', label: 'В архиве' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setDevlogStatusTab(tab.id)}
                        className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer outline-none whitespace-nowrap ${
                          devlogStatusTab === tab.id 
                            ? 'bg-surface-1 text-accent font-semibold border border-surface-3' 
                            : 'text-textSecondary hover:text-textPrimary hover:bg-surface-1/50'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* БЛОК 2: СЕТКА КАРТОЧЕК DEVLOG */}
                {pageState === 'loading' ? (
                  <div className="flex flex-col gap-3 animate-pulse">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-28 bg-surface-1 border border-borderDef rounded-card p-4 flex gap-4">
                        <div className="w-36 h-full bg-surface-1 rounded-md" />
                        <div className="flex-1 space-y-3">
                          <div className="h-4 w-1/2 bg-surface-1 rounded" />
                          <div className="h-3 w-1/4 bg-surface-1 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredDevlogs.length === 0 ? (
                  <div className="bg-surface-1 border border-dashed border-surface-3 rounded-card p-12 text-center flex flex-col items-center gap-4 my-4">
                    <FileText className="w-10 h-10 text-textSecondary" />
                    <div className="flex flex-col gap-1">
                      <h3 className="text-base font-bold text-textPrimary">Записи не найдены</h3>
                      <p className="text-xs text-textSecondary">По вашему запросу или выбранным фильтрам ничего не найдено.</p>
                    </div>
                    <button 
                      onClick={() => {
                        setDevlogQuery('');
                        setDevlogStatusTab('all');
                        setDevlogCategoryFilter('all');
                        setDevlogGameFilter('all');
                      }}
                      className="h-9 px-4 bg-surface-1 hover:bg-surface-2 border border-borderDef text-xs font-semibold text-textPrimary rounded-md transition-colors"
                    >
                      Сбросить все фильтры
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {filteredDevlogs.map(devlog => {
                      const isOwner = scopeInfo.canManageDevlog;

                      return (
                        <div 
                          key={devlog.id}
                          className="flex flex-col md:flex-row items-stretch bg-surface-1 border border-borderDef rounded-card hover:border-surface-3 transition-all duration-200 group relative"
                        >
                          {/* Media Zone */}
                          <div className="relative w-full md:w-[240px] shrink-0 aspect-video md:aspect-auto bg-surface-2 border-b md:border-b-0 md:border-r border-borderDef rounded-t-xl md:rounded-none md:rounded-l-xl overflow-hidden cursor-pointer group/media">
                            {devlog.cover ? (
                              <img src={devlog.cover} alt={devlog.title} className="w-full h-full object-cover group-hover/media:scale-105 transition-transform duration-300" />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-textTertiary group-hover/media:bg-surface-3 transition-colors bg-surface-2">
                                <FileText className="w-6 h-6 mb-2 opacity-50" />
                                <span className="text-[10px] uppercase font-bold tracking-wider opacity-70">Нет обложки</span>
                              </div>
                            )}
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/media:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                              <a href={`/devlogs/${devlog.slug}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-surface-0/20 text-white flex items-center justify-center hover:scale-110 hover:bg-accent transition-all shadow-elevation-raised">
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </div>
                          </div>

                          {/* Content Zone */}
                          <div className="flex-1 p-4 md:p-5 flex flex-col justify-between min-w-0">
                            <div className="flex flex-col gap-2">
                              {/* Meta Row: Game & Category & Status */}
                              <div className="flex items-center justify-between gap-3 flex-wrap">
                                <div className="flex items-center gap-2 text-xs font-medium text-textSecondary">
                                  {devlog.gameTitle ? (
                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-surface-2 rounded-md border border-surface-3">
                                      <Gamepad2 className="w-3.5 h-3.5 text-accent" /> {devlog.gameTitle}
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-surface-2 rounded-md border border-surface-3">
                                      <Globe className="w-3.5 h-3.5" /> Глобальный блог
                                    </div>
                                  )}
                                  <span className="text-borderStrong">•</span>
                                  <span>{devlog.typeLabel}</span>
                                </div>
                                
                                {/* Status Badges */}
                                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider font-mono shrink-0">
                                  {devlog.status === 'published' && (
                                    <span className="bg-success/10 text-success border border-success/20 px-2 py-0.5 rounded">
                                      Опубликовано
                                    </span>
                                  )}
                                  {devlog.status === 'draft' && (
                                    <span className="bg-surface-2 text-textSecondary border border-borderDef px-2 py-0.5 rounded">
                                      Черновик
                                    </span>
                                  )}
                                  {devlog.status === 'scheduled' && (
                                    <span className="bg-info/10 text-info border border-info/20 px-2 py-0.5 rounded flex items-center gap-1">
                                      <Clock className="w-3 h-3" /> {devlog.scheduledAt}
                                    </span>
                                  )}
                                  {devlog.status === 'blocked' && (
                                    <button 
                                      onClick={() => setModerationModal(devlog)}
                                      className="bg-danger/10 text-danger border border-danger/20 px-2 py-0.5 rounded flex items-center gap-1 hover:bg-danger/20 transition-colors cursor-pointer"
                                    >
                                      <ShieldAlert className="w-3 h-3" /> Заблокировано
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Title */}
                              <a 
                                href={`/devlogs/${devlog.slug}`} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="text-base md:text-body-lg font-bold text-textPrimary hover:text-accent transition-colors leading-snug line-clamp-2 mt-1"
                              >
                                {devlog.title}
                              </a>
                            </div>

                            {/* Metrics & Action Bar */}
                            <div className="flex items-center justify-between gap-4 mt-5 pt-4 border-t border-borderDef">
                              {/* Metrics */}
                              <div className="flex items-center gap-4 text-xs font-medium text-textSecondary">
                                <span className="flex items-center gap-1.5" title="Просмотры">
                                  <Eye className="w-4 h-4" /> {devlog.views}
                                </span>
                                <span className="flex items-center gap-1.5" title="Лайки">
                                  <Heart className="w-4 h-4 text-danger/80" /> {devlog.likes}
                                </span>
                                <span className="flex items-center gap-1.5" title="Комментарии">
                                  <MessageSquare className="w-4 h-4 text-info/80" /> {devlog.comments}
                                </span>
                                <span className="hidden sm:inline text-textTertiary text-[11px] ml-2 font-mono">Обновлено: {devlog.updatedAt}</span>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-2 shrink-0 ml-auto">
                                {isOwner && (
                                  <button 
                                    onClick={() => {
                                      if ((window as any).__hubigrNavigate) (window as any).__hubigrNavigate(`/devlog-editor?id=${devlog.id}`);
                                      else window.location.href = `#/devlog-editor?id=${devlog.id}`;
                                    }}
                                    className="h-8 px-3 bg-surface-1 hover:bg-surface-2 border border-borderDef text-xs font-semibold text-textPrimary rounded-md transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                                  >
                                    <Edit3 className="w-3.5 h-3.5 text-textSecondary" />
                                    <span>Редактировать</span>
                                  </button>
                                )}
                                
                                {isOwner && (
                                  <div className="relative">
                                    <button 
                                      onClick={() => setActiveDevlogContextMenu(activeDevlogContextMenu === devlog.id ? null : devlog.id)}
                                      className="h-8 w-8 bg-surface-1 hover:bg-surface-2 border border-borderDef text-textSecondary hover:text-textPrimary rounded-md flex items-center justify-center transition-colors shadow-sm"
                                    >
                                      <MoreVertical className="w-4 h-4" />
                                    </button>

                                    {activeDevlogContextMenu === devlog.id && (
                                      <div className="absolute right-0 top-full mt-2 w-56 bg-surface-2/95 backdrop-blur-xl border border-borderDef shadow-elevation-overlay rounded-card p-1.5 font-sans text-xs animate-fadeIn space-y-0.5 z-50">
                                        
                                        {devlog.status === 'draft' && (
                                          <button 
                                            onClick={() => handlePublishNow(devlog)}
                                            className="w-full text-left px-3.5 py-2.5 min-h-[38px] rounded-control flex items-center gap-2.5 transition-all duration-120 cursor-pointer text-success hover:bg-success/10 active:bg-success/20 font-medium"
                                          >
                                            <Send className="w-4 h-4 text-success" /> Опубликовать сейчас
                                          </button>
                                        )}
                                        {devlog.status === 'published' && (
                                          <button 
                                            onClick={() => handleUnpublish(devlog)}
                                            className="w-full text-left px-3.5 py-2.5 min-h-[38px] rounded-control flex items-center gap-2.5 transition-all duration-120 cursor-pointer text-textSecondary hover:text-textPrimary hover:bg-surface-3/80 active:bg-surface-3 font-medium"
                                          >
                                            <XCircle className="w-4 h-4 text-textTertiary" /> Перевести в черновик
                                          </button>
                                        )}
                                        <button 
                                          onClick={() => handleDuplicate(devlog)}
                                          className="w-full text-left px-3.5 py-2.5 min-h-[38px] rounded-control flex items-center gap-2.5 transition-all duration-120 cursor-pointer text-textSecondary hover:text-textPrimary hover:bg-surface-3/80 active:bg-surface-3 font-medium"
                                        >
                                          <Copy className="w-4 h-4 text-textTertiary" /> Создать копию
                                        </button>
                                        <div className="h-px w-full bg-borderDef my-1.5 opacity-50" />
                                        <button 
                                          onClick={() => {
                                            setDeleteDevlogModal(devlog);
                                            setActiveDevlogContextMenu(null);
                                          }}
                                          className="w-full text-left px-3.5 py-2.5 min-h-[38px] rounded-control flex items-center gap-2.5 transition-all duration-120 cursor-pointer text-danger hover:bg-danger/10 active:bg-danger/20 font-medium"
                                        >
                                          <Trash2 className="w-4 h-4" /> Удалить запись
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* БЛОК 3: ПАГИНАЦИЯ */}
                {filteredDevlogs.length > 0 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 text-xs font-mono">
                    <div className="flex items-center gap-3 text-textSecondary">
                      <span>Показывать:</span>
                      {[10, 20, 50].map(num => (
                        <button
                          key={num}
                          onClick={() => setDevlogPerPage(num)}
                          className={`px-2 py-1 rounded transition-colors ${
                            devlogPerPage === num ? 'bg-surface-1 text-accent font-bold border border-surface-3' : 'hover:text-textPrimary'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {}}
                        className="h-9 px-4 bg-surface-1 hover:bg-surface-2 border border-borderDef text-xs font-semibold text-textPrimary font-sans rounded-md transition-colors flex items-center gap-1.5"
                      >
                        <span>Показать еще</span>
                        <ChevronDown className="w-3.5 h-3.5 text-textSecondary" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button disabled className="px-3 py-1 bg-surface-2 border border-borderDef text-borderStrong rounded opacity-50 cursor-not-allowed">Назад</button>
                      <button className="px-3 py-1 bg-accent text-white font-bold rounded">1</button>
                      <button disabled className="px-3 py-1 bg-surface-2 border border-borderDef text-borderStrong rounded opacity-50 cursor-not-allowed">Вперед</button>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* ================= ХАБ 4: ОТЗЫВЫ И ФИДБЕК (Community) ================= */}
            {activeNav === 'community' && (
              <div className="space-y-6 animate-fadeIn">

                {/* Sub-tabs Domain Selector */}
                <div className="flex items-center gap-3 border-b border-borderDef pb-3">
                  <button
                    onClick={() => setCommunityDomainSubTab('reviews')}
                    className={`px-4 py-2 rounded-md text-xs font-semibold font-mono transition-colors flex items-center gap-2 cursor-pointer outline-none ${
                      communityDomainSubTab === 'reviews' 
                        ? 'bg-accent/10 border border-accent/40 text-accent' 
                        : 'bg-surface-1 border border-borderDef text-textSecondary hover:text-textPrimary'
                    }`}
                  >
                    <Star className="w-3.5 h-3.5" />
                    <span>Отзывы и Оценки</span>
                    <span className="ml-1 px-1.5 py-0.2 bg-surface-1 rounded text-xs text-textPrimary">
                      {reviewsList.filter(i => scope === 'all' || i.scope === scope).length}
                    </span>
                  </button>

                  <button
                    onClick={() => setCommunityDomainSubTab('feedback')}
                    className={`px-4 py-2 rounded-md text-xs font-semibold font-mono transition-colors flex items-center gap-2 cursor-pointer outline-none ${
                      communityDomainSubTab === 'feedback' 
                        ? 'bg-accent/10 border border-accent/40 text-accent' 
                        : 'bg-surface-1 border border-borderDef text-textSecondary hover:text-textPrimary'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Конструктивный Фидбек</span>
                    <span className="ml-1 px-1.5 py-0.2 bg-surface-1 rounded text-xs text-textPrimary">
                      {feedbackList.filter(i => scope === 'all' || i.scope === scope).length}
                    </span>
                  </button>
                </div>

                {/* Toolbar & Filters */}
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                    
                    {/* Search Bar */}
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-textSecondary absolute left-3 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text"
                        value={communitySearchQuery}
                        onChange={(e) => setCommunitySearchQuery(e.target.value)}
                        placeholder={communityDomainSubTab === 'reviews' ? "Поиск по тексту отзыва, никнейму игрока..." : "Поиск по конструктивному фидбеку..."}
                        className="w-full bg-surface-2 border border-borderDef text-textPrimary text-xs pl-9 pr-8 py-2.5 rounded-md focus:border-accent outline-none placeholder-textTertiary"
                      />
                      {communitySearchQuery && (
                        <button 
                          onClick={() => setCommunitySearchQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-textSecondary hover:text-textPrimary"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Filters Dropdowns */}
                    <div className="flex items-center gap-2 flex-wrap">
                      
                      {/* Game Filter */}
                      <CustomSelect
                        value={communitySelectedGame}
                        onChange={setCommunitySelectedGame}
                        options={[
                          { value: 'all', label: 'Все проекты' },
                          ...gamesList.map(g => ({ value: g.id, label: g.title }))
                        ]}
                      />

                      {/* Rating Filter (Only for Reviews) */}
                      {communityDomainSubTab === 'reviews' && (
                        <CustomSelect
                          value={communitySelectedRating}
                          onChange={setCommunitySelectedRating}
                          options={[
                            { value: 'all', label: 'Все оценки' },
                            { value: '5', label: '★ 5 звезд' },
                            { value: '4', label: '★ 4 звезды' },
                            { value: '3', label: '★ 3 звезды' },
                            { value: '2', label: '★ 2 звезды' },
                            { value: '1', label: '★ 1 звезда (Критические)' }
                          ]}
                        />
                      )}

                      {/* Sort Dropdown */}
                      <CustomSelect
                        value={communitySortBy}
                        onChange={setCommunitySortBy}
                        options={[
                          { value: 'newest', label: 'Сначала новые' },
                          { value: 'oldest', label: 'Сначала старые' },
                          ...(communityDomainSubTab === 'reviews' ? [
                            { value: 'rating_asc', label: 'Сначала низкая оценка' },
                            { value: 'rating_desc', label: 'Сначала высокая оценка' }
                          ] : [])
                        ]}
                      />
                    </div>
                  </div>

                  {/* Sub-filters Status Tabs (Reviews domain) */}
                  {communityDomainSubTab === 'reviews' && (
                    <div className="flex items-center gap-2 pt-2 border-t border-borderDef overflow-x-auto no-scrollbar">
                      {[
                        { id: 'all', label: 'Все отзывы' },
                        { id: 'unanswered', label: 'Без ответа разработчика' },
                        { id: 'answered', label: 'С ответом' },
                        { id: 'critical', label: 'Критические ★1-2' }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setCommunityResponseStatus(tab.id)}
                          className={`px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer outline-none whitespace-nowrap ${
                            communityResponseStatus === tab.id
                              ? 'bg-surface-1 text-accent border border-accent/40 font-semibold'
                              : 'text-textSecondary hover:text-textPrimary hover:bg-surface-1/50'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Permission Warning Notice for Team Scope */}
                {!scopeInfo.canManageReviews && (
                  <div className="p-3 bg-surface-2 border border-borderDef rounded-control flex items-center gap-2 text-xs text-textSecondary">
                    <Lock className="w-4 h-4 text-accent shrink-0" />
                    <span>Режим просмотра: У вас нет права <code className="text-accent">reviews.manage</code> для публикации официальных ответов команды {scopeInfo?.name}.</span>
                  </div>
                )}

                

                {/* Domain 1: REVIEWS LIST */}
                {communityDomainSubTab === 'reviews' && (
                  <div className="space-y-4">
                    {filterByScope(reviewsList).filter(review => {
                      if (communitySelectedGame !== 'all' && review.gameId !== communitySelectedGame) return false;
                      if (communitySelectedRating !== 'all' && review.rating !== parseInt(communitySelectedRating, 10)) return false;
                      if (communityResponseStatus === 'unanswered' && review.officialResponse !== null) return false;
                      if (communityResponseStatus === 'answered' && review.officialResponse === null) return false;
                      if (communityResponseStatus === 'critical' && review.rating > 2) return false;
                      if (communitySearchQuery.trim()) {
                        const q = communitySearchQuery.toLowerCase();
                        return review.text.toLowerCase().includes(q) || review.userNick.toLowerCase().includes(q) || review.gameTitle.toLowerCase().includes(q);
                      }
                      return true;
                    }).length === 0 ? (
                      <div className="bg-surface-1 border border-dashed border-surface-3 rounded-card p-12 text-center flex flex-col items-center gap-4 my-6">
                        <div className="w-12 h-12 rounded-full bg-surface-2 border border-borderDef flex items-center justify-center text-textSecondary">
                          <MessageSquare className="w-6 h-6 stroke-[1.5]" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-base font-bold text-textPrimary">Пока нет отзывов и оценок</h3>
                          <p className="text-xs text-textSecondary">Здесь будут выводиться официальные отзывы игроков с оценками и возможностью ответа.</p>
                        </div>
                      </div>
                    ) : (
                      filterByScope(reviewsList).filter(review => {
                        if (communitySelectedGame !== 'all' && review.gameId !== communitySelectedGame) return false;
                        if (communitySelectedRating !== 'all' && review.rating !== parseInt(communitySelectedRating, 10)) return false;
                        if (communityResponseStatus === 'unanswered' && review.officialResponse !== null) return false;
                        if (communityResponseStatus === 'answered' && review.officialResponse === null) return false;
                        if (communityResponseStatus === 'critical' && review.rating > 2) return false;
                        if (communitySearchQuery.trim()) {
                          const q = communitySearchQuery.toLowerCase();
                          return review.text.toLowerCase().includes(q) || review.userNick.toLowerCase().includes(q) || review.gameTitle.toLowerCase().includes(q);
                        }
                        return true;
                      }).map(review => (
                        <div key={review.id} className="bg-surface-1 border border-borderDef hover:border-surface-3 rounded-card overflow-hidden transition-all duration-200 group flex flex-col">
                          
                          {/* Header: User & Game Context & Rating */}
                          <div className="bg-surface-2/30 border-b border-borderDef px-4 py-3 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                              <img src={review.userAvatar} alt={review.userNick} className="w-8 h-8 rounded-full bg-surface-2 border border-borderDef object-cover shrink-0" />
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-textPrimary leading-none">@{review.userNick}</span>
                                <span className="text-[11px] font-mono text-textTertiary mt-1">{review.createdAt}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3 shrink-0">
                              <div className="flex items-center gap-1.5 px-2 py-1 bg-surface-2 rounded-md border border-surface-3 text-xs font-medium text-textSecondary" title={`Версия билда: ${review.buildVersion}`}>
                                <Gamepad2 className="w-3.5 h-3.5 text-accent" /> {review.gameTitle}
                              </div>
                              <div className="flex items-center gap-1 bg-surface-2 px-2 py-1 rounded-md border border-surface-3">
                                {renderStarRating(review.rating)}
                              </div>
                              {/* Report Action */}
                              <button
                                onClick={() => setReportTargetReview(review)}
                                className="w-7 h-7 text-textTertiary hover:text-danger hover:bg-danger/10 rounded-md transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer"
                                title="Пожаловаться на отзыв"
                              >
                                <Flag className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Content: Review Text */}
                          <div className="p-4 md:p-5 text-sm text-textPrimary leading-relaxed">
                            {review.text}
                          </div>

                          {/* Footer: Official Response */}
                          {review.officialResponse ? (
                            <div className="bg-surface-2/50 border-t border-borderDef p-4 flex flex-col gap-2.5">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs font-bold text-textPrimary">
                                  <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center">
                                    <CornerDownRight className="w-3.5 h-3.5 text-accent" />
                                  </div>
                                  <span>Ответ разработчика ({review.officialResponse.authorName})</span>
                                  <span className="text-[11px] font-mono text-textTertiary font-normal ml-2">{review.officialResponse.updatedAt}</span>
                                </div>
                                {scopeInfo.canManageReviews && (
                                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleOpenInlineEditor(review)} className="p-1.5 text-textSecondary hover:text-textPrimary hover:bg-surface-3 rounded-md transition-colors"><Edit3 className="w-3.5 h-3.5" /></button>
                                    <button onClick={() => setDeleteTargetReview(review)} className="p-1.5 text-textSecondary hover:text-danger hover:bg-danger/10 rounded-md transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                  </div>
                                )}
                              </div>
                              <p className="text-sm text-textSecondary leading-relaxed pl-8">
                                {review.officialResponse.text}
                              </p>
                            </div>
                          ) : editingResponseId === review.id ? (
                            <div className="bg-surface-2 border-t border-borderDef p-4 animate-fadeIn">
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-bold text-textPrimary flex items-center gap-1.5">
                                  <CornerDownRight className="w-4 h-4 text-accent" /> Написать официальный ответ
                                </span>
                                <span className="text-[11px] font-mono text-textTertiary">Правило M8: 1 ответ на отзыв</span>
                              </div>
                              <textarea
                                value={responseText}
                                onChange={(e) => setResponseText(e.target.value)}
                                placeholder="Напишите вежливый и конструктивный ответ игроку от имени разработчика..."
                                rows={3}
                                maxLength={1000}
                                className="w-full bg-surface-1 border border-borderDef focus:border-accent text-textPrimary text-sm p-3 rounded-control outline-none resize-none placeholder-textTertiary transition-colors"
                              />
                              <div className="flex items-center justify-between pt-3">
                                <span className="text-[11px] font-mono text-textSecondary">{responseText.length}/1000 символов</span>
                                <div className="flex items-center gap-2">
                                  <button onClick={() => { setEditingResponseId(null); setResponseText(''); }} className="h-8 px-4 text-xs font-semibold text-textSecondary hover:text-textPrimary rounded-md hover:bg-surface-3 transition-colors cursor-pointer">Отмена</button>
                                  <button onClick={() => handleSaveResponse(review.id)} disabled={!responseText.trim()} className="h-8 px-4 bg-accent hover:bg-accent-hover-hover disabled:opacity-50 text-white text-xs font-bold rounded-md transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"><Send className="w-3.5 h-3.5" /> Опубликовать</button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            scopeInfo.canManageReviews ? (
                              <div className="bg-surface-2/30 border-t border-borderDef p-3 px-4 flex items-center justify-between">
                                <button
                                  onClick={() => handleOpenInlineEditor(review)}
                                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-accent-hover-hover transition-colors cursor-pointer"
                                >
                                  <CornerDownRight className="w-3.5 h-3.5" /> Ответить от имени разработчика
                                </button>
                              </div>
                            ) : null
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}


                {/* Domain 2: STRUCTURED FEEDBACK LIST */}
                {communityDomainSubTab === 'feedback' && (
                  <div className="space-y-4">
                    {!scopeInfo.canManageFeedback && (
                      <div className="p-3 bg-surface-2 border border-borderDef rounded-control flex items-center gap-2 text-xs text-textSecondary mb-2">
                        <Lock className="w-4 h-4 text-accent shrink-0" />
                        <span>Режим просмотра: У вас нет права <code className="text-accent font-mono font-bold">feedback.manage</code> для управления структурированным фидбеком команды {scopeInfo?.name}.</span>
                      </div>
                    )}
                    {filterByScope(feedbackList).filter(fb => {
                      if (communitySelectedGame !== 'all' && fb.gameId !== communitySelectedGame) return false;
                      if (communitySearchQuery.trim()) {
                        const q = communitySearchQuery.toLowerCase();
                        return fb.pros.toLowerCase().includes(q) || fb.cons.toLowerCase().includes(q) || fb.userNick.toLowerCase().includes(q);
                      }
                      return true;
                    }).length === 0 ? (
                      <div className="bg-surface-1 border border-dashed border-surface-3 rounded-card p-12 text-center flex flex-col items-center gap-4 my-6">
                        <div className="w-12 h-12 rounded-full bg-surface-2 border border-borderDef flex items-center justify-center text-textSecondary">
                          <MessageSquare className="w-6 h-6 stroke-[1.5]" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-base font-bold text-textPrimary">Пока нет конструктивного фидбека</h3>
                          <p className="text-xs text-textSecondary">Здесь выводится структурированный фидбек из тем Сообщества NeedFeedback (M3).</p>
                        </div>
                      </div>
                    ) : (
                      filterByScope(feedbackList).filter(fb => {
                        if (communitySelectedGame !== 'all' && fb.gameId !== communitySelectedGame) return false;
                        if (communitySearchQuery.trim()) {
                          const q = communitySearchQuery.toLowerCase();
                          return fb.pros.toLowerCase().includes(q) || fb.cons.toLowerCase().includes(q) || fb.userNick.toLowerCase().includes(q);
                        }
                        return true;
                      }).map(fb => (
                        <div key={fb.id} className="bg-surface-1 border border-borderDef hover:border-surface-3 rounded-card overflow-hidden transition-all duration-200 group flex flex-col">
                          
                          {/* Header: User & Game Context */}
                          <div className="bg-surface-2/30 border-b border-borderDef px-4 py-3 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                              <img src={fb.userAvatar} alt={fb.userNick} className="w-8 h-8 rounded-full bg-surface-2 border border-borderDef object-cover shrink-0" />
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-textPrimary leading-none">@{fb.userNick}</span>
                                <span className="text-[11px] font-mono text-textTertiary mt-1">{fb.createdAt} • {fb.playtime} в игре</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3 shrink-0">
                              <div className="flex items-center gap-1.5 px-2 py-1 bg-surface-2 rounded-md border border-surface-3 text-xs font-medium text-textSecondary">
                                <Gamepad2 className="w-3.5 h-3.5 text-accent" /> {fb.gameTitle}
                              </div>
                              <span className="px-2 py-1 bg-info/10 text-info border border-info/20 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider">
                                {fb.categoryLabel}
                              </span>
                              <a href="#" onClick={(e) => { e.preventDefault(); triggerToast(`Переход в тему ${fb.threadUrl}`); }} className="h-8 w-8 bg-surface-2 hover:bg-surface-3 border border-borderDef text-textSecondary hover:text-textPrimary rounded-md flex items-center justify-center transition-colors shadow-sm cursor-pointer" title="Перейти в тему обсуждения">
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </div>
                          </div>

                          {/* Content: Structured Fields */}
                          <div className="p-4 md:p-5 flex flex-col md:flex-row gap-4">
                            <div className="flex-1 p-4 bg-success/5 border border-success/20 rounded-card flex flex-col gap-3">
                              <div className="text-xs font-mono font-bold text-success flex items-center gap-1.5 uppercase tracking-wider">
                                <ThumbsUp className="w-4 h-4" /> Что понравилось
                              </div>
                              <p className="text-sm text-textPrimary leading-relaxed">{fb.pros}</p>
                            </div>

                            <div className="flex-1 p-4 bg-warning/5 border border-warning/20 rounded-card flex flex-col gap-3">
                              <div className="text-xs font-mono font-bold text-warning flex items-center gap-1.5 uppercase tracking-wider">
                                <ThumbsDown className="w-4 h-4" /> Что требует улучшения
                              </div>
                              <p className="text-sm text-textPrimary leading-relaxed">{fb.cons}</p>
                            </div>
                          </div>

                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* --- COMMUNITY ПАГИНАЦИЯ --- */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 text-xs font-mono">
                  <div className="flex items-center gap-3 text-textSecondary">
                    <span>Показывать:</span>
                    {[10, 25, 50].map(sz => (
                      <button 
                        key={sz}
                        className={`px-2 py-1 rounded transition-colors ${
                          sz === 10 ? 'bg-surface-1 text-accent font-bold border border-surface-3' : 'hover:text-textPrimary'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {}}
                      className="h-9 px-4 bg-surface-1 hover:bg-surface-2 border border-borderDef text-xs font-semibold text-textPrimary font-sans rounded-md transition-colors flex items-center gap-1.5"
                    >
                      <span>Показать еще</span>
                      <ChevronDown className="w-3.5 h-3.5 text-textSecondary" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button disabled className="px-3 py-1 bg-surface-2 border border-borderDef text-borderStrong rounded opacity-50 cursor-not-allowed">Назад</button>
                    <button className="px-3 py-1 bg-accent text-white font-bold rounded">1</button>
                    <button disabled className="px-3 py-1 bg-surface-2 border border-borderDef text-borderStrong rounded opacity-50 cursor-not-allowed">Вперед</button>
                  </div>
                </div>

              </div>
            )}

            {/* ================= ХАБ 5: СТАТИСТИКА (АНАЛИТИКА) ================= */}
            {activeNav === 'analytics' && (
              <CreatorStatsTab 
                scopeInfo={scopeInfo}
                salesApiError={salesApiError}
                analyticsApiError={analyticsApiError}
                triggerToast={triggerToast}
              />
            )}

            {/* ================= ХАБ 6: ПРОДАЖИ (ФИНАНСЫ) ================= */}
            {(activeNav === 'sales' || activeNav === 'finance') && (
              <CreatorSalesTab 
                scopeInfo={scopeInfo}
                salesApiError={salesApiError}
                triggerToast={triggerToast}
              />
            )}

            {activeNav === 'bugs' && (
              <CreatorBugsTab scopeInfo={scopeInfo} triggerToast={triggerToast} />
            )}

            {/* ================= ХАБ 8: КОМАНДЫ И ДОСТУПЫ ================= */}
            {activeNav === 'teams' && (
              <CreatorTeamsTab scopeInfo={scopeInfo} onChangeScope={handleScopeChange} triggerToast={triggerToast} />
            )}

            {/* ================= ХАБ 9: ПОДДЕРЖКА И КОНТАКТЫ ================= */}
            {activeNav === 'support' && (
              <CreatorSupportTab scopeInfo={scopeInfo} scope={scope} triggerToast={triggerToast} />
            )}


          </div>
        )}

      </main>

      {/* ================= МОДАЛ БЫСТРОЙ ЗАГРУЗКИ БИЛДА (CRD-API-002) ================= */}
      {quickUploadGame && (
        <Modal
          isOpen={!!quickUploadGame}
          onClose={() => setQuickUploadGame(null)}
          title={`Загрузка билда: ${quickUploadGame.title}`}
          maxWidth="lg"
        >
          <div className="space-y-5">
            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-textSecondary uppercase mb-2">
                  Тип сборки / Платформа
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`p-3 border rounded-control flex flex-col gap-1 cursor-pointer transition-colors ${
                    uploadBuildType === 'webgl' ? 'border-accent bg-accent/10 text-textPrimary' : 'border-surface-3 bg-surface-1 text-textSecondary'
                  }`}>
                    <input 
                      type="radio" 
                      name="buildType" 
                      checked={uploadBuildType === 'webgl'} 
                      onChange={() => setUploadBuildType('webgl')} 
                      className="hidden"
                    />
                    <div className="flex items-center gap-1.5 font-bold text-xs text-textPrimary">
                      <Zap className="w-3.5 h-3.5 text-accent" /> WebGL (Браузер)
                    </div>
                    <span className="text-xs text-textSecondary">Запуск в браузере (до 1 ГБ)</span>
                  </label>

                  <label className={`p-3 border rounded-control flex flex-col gap-1 cursor-pointer transition-colors ${
                    uploadBuildType === 'desktop' ? 'border-accent bg-accent/10 text-textPrimary' : 'border-surface-3 bg-surface-1 text-textSecondary'
                  }`}>
                    <input 
                      type="radio" 
                      name="buildType" 
                      checked={uploadBuildType === 'desktop'} 
                      onChange={() => setUploadBuildType('desktop')} 
                      className="hidden"
                    />
                    <div className="flex items-center gap-1.5 font-bold text-xs text-textPrimary">
                      <Monitor className="w-3.5 h-3.5 text-info" /> Desktop-приложение
                    </div>
                    <span className="text-xs text-textSecondary">Windows/macOS/Linux (до 2 ГБ)</span>
                  </label>
                </div>
              </div>

              {/* Version Input */}
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs font-bold text-textSecondary uppercase">Версия билда</label>
                <input 
                  type="text" 
                  value={uploadVersionInput}
                  onChange={(e) => setUploadVersionInput(e.target.value)}
                  placeholder="например, v1.0.3"
                  className="h-10 bg-surface-2 border border-borderDef text-textPrimary px-3 rounded-md outline-none font-mono focus:border-accent"
                />
              </div>

              {/* Drag and Drop Zone */}
              <div className="border-2 border-dashed border-surface-3 hover:border-accent bg-surface-1/50 rounded-control p-6 text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors">
                <Upload className="w-8 h-8 text-textSecondary" />
                <span className="text-xs font-semibold text-textPrimary">Перетащите архив сюда или нажмите для выбора</span>
                <span className="text-xs text-textSecondary">Поддерживаемые форматы: .zip, .7z, .exe</span>
              </div>

              {/* Upload Progress Bar */}
              {isUploadingFile && (
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs font-mono text-textSecondary">
                    <span>Загрузка файла...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-surface-1 rounded-full overflow-hidden">
                    <div className="h-full bg-accent transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}

              {/* Notice Box */}
              <div className="p-3 bg-accent/10 border border-accent/30 rounded-md text-accent text-xs leading-relaxed flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Архив WebGL должен содержать файл <strong>index.html</strong> в корневом каталоге.</span>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-borderDef flex items-center justify-end gap-3">
              <button 
                onClick={() => setQuickUploadGame(null)}
                className="h-10 px-5 bg-surface-1 hover:bg-surface-2 border border-borderDef text-xs font-semibold text-textPrimary rounded-md transition-colors"
              >
                Отмена
              </button>

              <button 
                disabled={isUploadingFile}
                onClick={handleSimulateBuildUpload}
                className="h-10 px-6 bg-success hover:bg-success/90 text-white font-bold text-xs uppercase tracking-wider rounded-md transition-colors flex items-center gap-2"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Загрузить файл</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ================= MODAL 2: ПОДТВЕРЖДЕНИЕ УДАЛЕНИЯ ИГРЫ (DeleteGameModal) ================= */}
      <Modal
        isOpen={!!deleteGameModal}
        onClose={() => setDeleteGameModal(null)}
        title={deleteGameModal ? `Удалить проект ${deleteGameModal?.title}?` : ''}
        icon={<Trash2 className="text-danger" />}
        maxWidth="md"
      >
        <div className="flex flex-col gap-4 py-5 text-xs font-sans">
              <p className="text-textSecondary leading-relaxed">
                Это действие <strong className="text-danger">нельзя отменить</strong>. Все привязанные билды, статистика просмотров, отзывы игроков и сабмишены на джемы будут безвозвратно удалены.
              </p>

              <div className="flex flex-col gap-1.5 pt-2">
                <label className="text-xs text-textSecondary">
                  Для подтверждения введите точное название игры: <strong className="text-textPrimary">{deleteGameModal?.title}</strong>
                </label>
                <input 
                  type="text"
                  value={deleteConfirmationText}
                  onChange={(e) => setDeleteConfirmationText(e.target.value)}
                  placeholder={deleteGameModal?.title || ""}
                  className="h-10 bg-surface-2 border border-borderDef text-textPrimary px-3 rounded-md outline-none font-sans focus:border-danger"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-borderDef flex items-center justify-end gap-3">
              <button 
                onClick={() => setDeleteGameModal(null)}
                className="h-10 px-5 bg-surface-1 hover:bg-surface-2 border border-borderDef text-xs font-semibold text-textPrimary rounded-md transition-colors"
              >
                Отмена
              </button>

              <button 
                onClick={handleDeleteGame}
                disabled={deleteConfirmationText.trim() !== deleteGameModal?.title}
                className={`h-10 px-6 font-bold text-xs uppercase tracking-wider rounded-md transition-colors flex items-center gap-2 ${
                  deleteConfirmationText.trim() === deleteGameModal?.title
                    ? 'bg-danger hover:bg-danger/90 text-textPrimary'
                    : 'bg-surface-1 text-borderStrong border border-borderDef cursor-not-allowed'
                }`}
              >
                <Trash2 className="w-4 h-4" />
                <span>Удалить навсегда</span>
              </button>
            </div>
      </Modal>

      {/* ================= СЛАЙД-ОВЕР ДЕТАЛЕЙ БАГ-РЕПОРТА (Drawer) ================= */}
      {selectedBugForDrawer && (
        <div className="fixed inset-0 z-dropdown flex justify-end">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fadeIn" onClick={() => setSelectedBugForDrawer(null)} />
          <div className="bg-surface-1 border-l border-borderDef w-full max-w-[480px] h-full p-8 flex flex-col justify-between relative z-10 animate-slideInRight">
            <div className="flex flex-col gap-8">
              <div className="flex items-center justify-between pb-5 border-b border-borderDef">
                <div className="flex items-center gap-3">
                  <Bug className="w-5 h-5 text-danger" />
                  <h3 className="text-body-lg font-bold text-textPrimary font-mono">#{selectedBugForDrawer.id}</h3>
                </div>
                <button onClick={() => setSelectedBugForDrawer(null)} className="p-1.5 hover:bg-surface-1 rounded-full text-textSecondary hover:text-textPrimary transition-colors focus:outline-none">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-6 font-sans">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-mono font-bold text-textSecondary uppercase tracking-wider">Проект</span>
                  <span className="text-textPrimary font-semibold text-base">{selectedBugForDrawer.gameTitle} <span className="font-mono text-xs text-textSecondary ml-2 font-normal">{selectedBugForDrawer.version}</span></span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs font-mono font-bold text-textSecondary uppercase tracking-wider">Описание проблемы</span>
                  <p className="text-textPrimary text-base leading-relaxed">{selectedBugForDrawer.title}</p>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-xs font-mono font-bold text-textSecondary uppercase tracking-wider">Системные логи</span>
                  <div className="p-4 bg-surface-2 border border-borderDef rounded-md text-danger text-xs font-mono leading-relaxed overflow-x-auto">
                    {selectedBugForDrawer.logs}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-borderDef flex items-center gap-3">
              <button 
                onClick={() => setSelectedBugForDrawer(null)}
                className="flex-1 h-11 bg-surface-2 border border-borderDef hover:bg-surface-1 text-sm font-semibold text-textPrimary rounded-md focus:outline-none transition-colors"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ПОДТВЕРЖДЕНИЕ УДАЛЕНИЯ DEVLOG ================= */}
      <Modal
        isOpen={!!deleteDevlogModal}
        onClose={() => setDeleteDevlogModal(null)}
        title="Удалить запись?"
        icon={<Trash2 className="text-danger" />}
        maxWidth="md"
      >
        <div className="py-5 text-xs text-textSecondary leading-relaxed">
          Вы уверены, что хотите безвозвратно удалить запись «<strong className="text-textPrimary">{deleteDevlogModal?.title}</strong>»?
          Все привязанные комментарии игроков, лайки и статистика просмотров этой статьи будут утеряны.
        </div>

        <div className="pt-4 border-t border-borderDef flex items-center justify-end gap-3">
          <button 
            onClick={() => setDeleteDevlogModal(null)}
            className="h-10 px-5 bg-surface-1 hover:bg-surface-2 border border-borderDef text-xs font-semibold text-textPrimary rounded-md transition-colors"
          >
            Отмена
          </button>
          <button 
            onClick={handleDeleteDevlog}
            className="h-10 px-6 bg-danger hover:bg-danger/90 text-textPrimary font-bold text-xs uppercase tracking-wider rounded-md transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Удалить навсегда</span>
          </button>
        </div>
      </Modal>

      {/* ================= MODAL: ПРИЧИНА БЛОКИРОВКИ МОДЕРАЦИЕЙ ================= */}
      <Modal
        isOpen={!!moderationModal}
        onClose={() => setModerationModal(null)}
        title="Запись заблокирована модератором"
        icon={<ShieldAlert className="text-danger" />}
        maxWidth="md"
      >
        <div className="flex flex-col gap-4 py-5 text-xs font-sans">
          <span className="text-textPrimary font-semibold">{moderationModal?.title}</span>
          <div className="p-4 bg-surface-2 border border-borderDef rounded-control text-danger leading-relaxed font-mono">
            {moderationModal?.moderationReason || 'Нарушение пользовательского соглашения или правил публикации сообщества.'}
          </div>
        </div>

        <div className="pt-4 border-t border-borderDef flex items-center justify-end gap-3">
          <button 
            onClick={() => setModerationModal(null)}
            className="h-10 px-5 bg-surface-1 hover:bg-surface-2 border border-borderDef text-xs font-semibold text-textPrimary rounded-md transition-colors"
          >
            Закрыть
          </button>
          <button 
            onClick={() => {
              const id = moderationModal?.id;
              setModerationModal(null);
              if ((window as any).__hubigrNavigate) (window as any).__hubigrNavigate(`/devlog-editor?id=${id}`);
              else window.location.href = `#/devlog-editor?id=${id}`;
            }}
            className="h-10 px-6 bg-accent hover:bg-accent-hover-hover text-white font-bold text-xs uppercase tracking-wider rounded-md transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
            <span>Редактировать и подать апелляцию</span>
          </button>
        </div>
      </Modal>

      {/* ================= MODAL: Delete Official Response ================= */}
      <Modal
        isOpen={!!deleteTargetReview}
        onClose={() => setDeleteTargetReview(null)}
        title="Удалить официальный ответ?"
        icon={<Trash2 className="text-danger" />}
        maxWidth="md"
      >
        <p className="text-xs text-textSecondary leading-relaxed">
          Ваш ответ будет скрыт из карточки отзыва в публичном каталоге. Вы сможете написать новый ответ в любое время.
        </p>
        <div className="flex items-center justify-end gap-3 pt-4">
          <button 
            onClick={() => setDeleteTargetReview(null)}
            className="px-4 py-2 text-xs font-semibold text-textSecondary hover:text-textPrimary cursor-pointer"
          >
            Отмена
          </button>
          <button 
            onClick={handleDeleteResponseConfirm}
            className="px-4 py-2 bg-danger hover:bg-danger/90 text-textPrimary text-xs font-bold rounded-md transition-colors cursor-pointer"
          >
            Удалить ответ
          </button>
        </div>
      </Modal>

      {/* ================= MODAL: Report Review ================= */}
      <Modal
        isOpen={!!reportTargetReview}
        onClose={() => setReportTargetReview(null)}
        title="Пожаловаться на отзыв"
        icon={<Flag className="text-warning" />}
        maxWidth="md"
      >
        <form onSubmit={handleSendReport} className="space-y-4">
          <div className="space-y-3">
            <label className="block text-xs font-mono text-textSecondary">Причина жалобы:</label>
            <CustomSelect
              value={reportReason}
              onChange={setReportReason}
              options={[
                { value: 'insult', label: 'Оскорбления / Токсичность' },
                { value: 'spam', label: 'Спам / Реклама' },
                { value: 'fake', label: 'Ложная информация / Фейк' },
                { value: 'irrelevant', label: 'Неотносимый контент' }
              ]}
            />

            <label className="block text-xs font-mono text-textSecondary">Детали нарушения:</label>
            <textarea 
              value={reportDetails}
              onChange={e => setReportDetails(e.target.value)}
              placeholder="Опишите проблему для модераторов платформы..."
              rows={3}
              className="w-full bg-surface-2 border border-borderDef text-textPrimary text-xs p-3 rounded-md outline-none focus:border-accent resize-none placeholder-textTertiary"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-borderDef">
            <button 
              type="button"
              onClick={() => setReportTargetReview(null)}
              className="px-4 py-2 text-xs font-semibold text-textSecondary hover:text-textPrimary cursor-pointer"
            >
              Отмена
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-accent hover:bg-accent-hover-hover text-white text-xs font-bold rounded-md transition-colors cursor-pointer"
            >
              Отправить жалобу
            </button>
          </div>
        </form>
      </Modal>

      {/* ================= МОДАЛ ПЕРЕДАЧИ ВЛАДЕНИЯ ИГРОЙ (FE-ACC-007) ================= */}
      <GameTransferModal
        isOpen={!!gameForTransfer}
        onClose={() => setGameForTransfer(null)}
        game={gameForTransfer}
        onInitiateTransfer={handleInitiateGameTransfer}
      />

      {/* ================= ЦЕНТР ТРАНСФЕРОВ ИГР (FE-ACC-007) ================= */}
      <GameTransfersDrawer
        isOpen={isTransfersDrawerOpen}
        onClose={() => setIsTransfersDrawerOpen(false)}
        transfers={gameTransfers}
        auditLogs={transferAuditLogs}
        onAcceptTransfer={handleAcceptTransfer}
        onRejectTransfer={handleRejectTransfer}
        onCancelTransfer={handleCancelTransfer}
        onOpenSellerVerification={() => setIsSellerModalOpen(true)}
        onToggleSellerVerification={handleToggleSellerVerification}
      />

      {/* ================= МОДАЛ ВЕРИФИКАЦИИ ПРОДАВЦА (BR-ACC-051) ================= */}
      <SellerVerificationModal
        isOpen={isSellerModalOpen}
        onClose={() => setIsSellerModalOpen(false)}
        onSaveSellerInfo={handleSaveSellerInfo}
      />

      {/* ================= ГЛОБАЛЬНЫЙ TOAST ================= */}
      {showToast && (
        <div className="fixed bottom-6 left-6 z-modal bg-surface-2 border border-borderDef text-textPrimary px-4 py-3 rounded-control flex items-center gap-3 animate-fadeIn">
          {toastType === 'success' ? <CheckCircle2 className="w-4 h-4 text-success" /> : <Info className="w-4 h-4 text-accent" />}
          <span className="text-sm font-medium font-sans leading-snug">{toastMsg}</span>
        </div>
      )}

      <DevMatrixPanel 
        pageName="Кабинет Автора"
        fields={[
          {
            id: 'pageState',
            label: 'Состояние UI',
            type: 'select',
            value: pageState,
            onChange: (val) => setPageState(val),
            options: [
              { value: 'standard', label: 'Standard (Заполнено)' },
              { value: 'loading', label: 'Skeleton Loading' },
              { value: 'empty', label: 'Empty State' }
            ]
          },
          {
            id: 'salesApiError',
            label: 'Сбой Продаж',
            type: 'checkbox',
            value: salesApiError,
            onChange: (val) => setSalesApiError(val)
          },
          {
            id: 'publishingRestricted',
            label: 'Бан публикации (BR-ACC-056)',
            type: 'checkbox',
            value: publishingRestricted,
            onChange: (val) => setPublishingRestricted(val)
          },
          {
            id: 'analyticsApiError',
            label: 'Сбой Аналитики',
            type: 'checkbox',
            value: analyticsApiError,
            onChange: (val) => setAnalyticsApiError(val)
          }
        ]}
      />
    </div>
  );
}
