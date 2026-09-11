import React, { useState, useEffect, useRef } from 'react';
import DevMatrixPanel from '../components/DevMatrixPanel';
import FontStyles from '../components/ui/FontStyles';
import { useToast } from '../components/ui/Toast';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Tabs from '../components/ui/Tabs';
import AddToCollectionModal from '../components/modals/AddToCollectionModal';
import QuickPlayDrawer from '../components/modals/QuickPlayDrawer';
import ReportContentModal from '../components/modals/ReportContentModal';
import DonationDrawer from '../components/modals/DonationDrawer';
import JamAppealDrawer from '../components/modals/JamAppealDrawer';
import JamPrizeDisputeDrawer from '../components/modals/JamPrizeDisputeDrawer';
import ContactRequestModal from '../components/modals/ContactRequestModal';
import BugReportDrawer from '../components/modals/BugReportDrawer';
import DevLogGameWidget from '../components/devlog/DevLogGameWidget';
import MarketGameCard from '../components/MarketGameCard';
import ReviewsSection, { Review } from '../components/ReviewsSection';
import { jamOrganizerService } from '../services/jamOrganizerService';
import Drawer from '../components/ui/Drawer';
import CustomSelect from '../components/ui/Select';
import {
  Play, Share2, Heart, Flag, ChevronDown, Download, AlertTriangle,
  Lock, Star, MessageSquare, Bug, ChevronLeft, ChevronRight, X,
  Clock, Bell, User, Layers, Info, Folder, RefreshCw, AlertOctagon,
  ArrowUpRight, Bookmark, CheckCircle2, Check, ExternalLink, Calendar, Plus, Swords,
  Upload, Trash2, Monitor, Cpu, Trophy, Medal, Award, ShieldCheck, Shield, Eye, Sparkles, Mail
} from 'lucide-react';



const BROKEN_LORE_DATA = {
  id: 'game-brokenlore',
  title: 'BrokenLore: FOLLOW',
  genre: 'Sci-Fi Horror, Психологический триллер',
  jamName: 'Cyberjam 2026',
  versions: 'v1.2.4',
  warnings: 'Игра содержит мрачные сцены, клаустрофобные пространства и резкие звуковые эффекты.',
  descriptionLead: 'Управляйте кислородом, чтобы выжить. Каждое ваше движение, бег или паническая атака истощают запасы воздуха. В игре вам предстоит балансировать между исследованием заброшенных отсеков и поиском баллонов с O2, постоянно контролируя уровень своего дыхания.',
  descriptionBody: 'Освоив механику выживания, вы сможете погрузиться в историю исследовательской станции «Танатос». Вы просыпаетесь в криокамере после неизвестного инцидента. Системы жизнеобеспечения повреждены, коридоры погружены во тьму, а ваш собственный разум начинает играть с вами в жестокие игры.',
  cover: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1440&auto=format&fit=crop',
  screenshots: [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=800&auto=format&fit=crop'
  ],
  authors: [
    { id: 1, name: 'NocturnalDevs', role: 'Геймдизайн, Сюжет', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=nocturnal' },
    { id: 2, name: 'Alex_Code', role: 'WebGL & Код', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop' },
    { id: 3, name: 'Maria_Art', role: '3D Художник', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop' },
    { id: 4, name: 'VoidSound', role: 'Саунд-дизайнер', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=void' }
  ],
  devlogs: [
    {
      id: 1,
      title: 'Патч 1.2.4: Глубокая оптимизация памяти и исправление критических вылетов',
      date: '17.07.2026',
      img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop',
      type: 'ОБНОВЛЕНИЕ',
      typeStyle: 'border-success/20 text-success bg-success/5',
      version: 'v1.2.4',
      text: 'В этом обновлении мы полностью переработали архитектуру загрузки текстур в WebGL. Внедрение кастомного алгоритма стриминга ассетов позволило высвободить до 35% оперативной памяти на мобильных устройствах, предотвращая вылеты вкладки браузера.'
    },
    {
      id: 2,
      title: 'Анонс масштабного дополнения «Сигнал из Бездны»',
      date: '12.07.2026',
      img: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=400&auto=format&fit=crop',
      type: 'АНОНС',
      typeStyle: 'border-accent/20 text-accent bg-accent/5',
      version: 'Предстоящий DLC',
      text: 'Готовьтесь к самому крупному контентному обновлению со дня релиза. Вас ждут три новые полуоткрытые зоны на нижних палубах станции Танатос, кастомная механика радиопомех и совершенно новые виды угроз.'
    }
  ],
  reviews: [
    {
      id: 1,
      author: 'PlayerOne',
      role: 'Player' as const,
      date: 'Вчера',
      score: 14,
      text: 'Потрясающая атмосфера космического вакуума! На втором уровне падает частота кадров. У всех так?',
      developerResponse: {
        id: 'dev-resp-1',
        author: 'NocturnalDevs',
        date: 'Вчера',
        text: 'Спасибо за отзыв! Патч 1.2.4 оптимизирует работу. Попробуйте перезапустить сессию.',
      }
    },
    {
      id: 2,
      author: 'AlexJudge',
      role: 'Judge' as const,
      date: '3 дня назад',
      score: 42,
      text: 'Великолепный визуальный стиль и шейдеры O2! Обратите внимание на коллизии камеры в узких коридорах отсека B.',
      developerResponse: null
    }
  ]
};

const MINIMAL_DATA = {
  id: 'game-brokenlore-demo',
  title: 'BrokenLore: FOLLOW (Tech Demo)',
  genre: 'Sci-Fi Sandbox',
  jamName: 'Cyberjam 2026',
  versions: 'v1.0.0-draft',
  warnings: 'Минимальный технический прототип.',
  descriptionLead: 'Тестовый полигон для обкатки механик WebGL.',
  descriptionBody: 'В этой сборке доступно только базовое перемещение.',
  cover: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1440&auto=format&fit=crop',
  screenshots: [],
  authors: [
    { id: 1, name: 'NocturnalDevs', role: 'Разработчик', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=nocturnal' }
  ],
  devlogs: [],
  reviews: []
};

const BROKEN_LORE_RELEASES = [
  {
    id: "rel_01",
    version: "v1.2.4",
    is_latest: true,
    published_at: "17 Июл 2026",
    file_size: "245 MB",
    changelog_markdown: [
      {
        title: "Что нового",
        items: [
          "Добавлен продвинутый менеджер распределения кислорода в криокамере станции.",
          "Мрачные сцены стали еще более кинематографичными за счет кастомных шейдеров теней."
        ]
      },
      {
        title: "Исправления ошибок",
        items: [
          "Исправлено падение частоты кадров на втором уровне, на которое жаловался PlayerOne.",
          "Исправлена ошибка, из-за которой звуковой эффект дыхания зависал при перезапуске сессии."
        ]
      },
      {
        title: "Оптимизация",
        items: [
          "Снижено потребление видеопамяти на WebGL сборках при загрузке тяжелых ассетов."
        ]
      }
    ]
  },
  {
    id: "rel_02",
    version: "v1.2.0",
    is_latest: false,
    published_at: "30 Июн 2026",
    file_size: "238 MB",
    changelog_markdown: [
      {
        title: "Что нового",
        items: [
          "Полностью переработаны звуковые эффекты сердцебиения при повышении уровня паники.",
          "Добавлена экспериментальная поддержка геймпадов."
        ]
      },
      {
        title: "Исправления ошибок",
        items: [
          "Устранен баг с проваливанием сквозь текстуры пола в зоне жилых отсеков."
        ]
      }
    ]
  },
  {
    id: "rel_03",
    version: "v1.1.0",
    is_latest: false,
    published_at: "15 Май 2026",
    file_size: "220 MB",
    changelog_markdown: [
      {
        title: "Базовый релиз",
        items: [
          "Первая публичная бета-версия с механиками контроля уровня O2 и исследования заброшенной станции."
        ]
      }
    ]
  }
];

// Имитационные данные результатов джема и судейских оценок (M11 & M1 REST API integration)
const MOCK_JAM_RESULTS_DATA = {
  jam: {
    id: "broken-worlds-jam-2026",
    title: "Broken Worlds Jam 2026",
    slug: "broken-worlds-jam",
    is_results_published: true
  },
  submission: {
    submission_id: "SUB-9012",
    rank: 1,
    total_submissions: 120,
    weighted_score: 4.68,
    nominations: ["Best Audio / Sound Design", "Community Choice"]
  },
  criteria_averages: [
    { key: "gameplay", label: "Геймплей и Механика", score: 4.8, weight: "30%" },
    { key: "theme", label: "Соответствие теме", score: 5.0, weight: "25%" },
    { key: "graphics", label: "Графика и Арт-стиль", score: 4.2, weight: "20%" },
    { key: "sound", label: "Звуковой дизайн и Музыка", score: 4.5, weight: "15%" },
    { key: "originality", label: "Оригинальность / Инновации", score: 4.4, weight: "10%" }
  ],
  evaluations: [
    {
      evaluation_id: "eval-101",
      judge: {
        id: "usr-88",
        nick: "Alexander Kael",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120",
        specialization: "Lead Game Designer @ Nocturnal Studio"
      },
      weighted_score: 4.80,
      scores: {
        gameplay: 5.0,
        theme: 5.0,
        graphics: 4.5,
        sound: 4.5,
        originality: 5.0
      },
      jury_comment: "Отличный геймдизайн и сочная атмосфера! Механика контроля запаса кислорода создаёт потрясающее напряжение. Каждое движение ощущается весомым. Графика прекрасно подчёркивает клаустрофобию заброшенной станции.",
      is_private: false
    },
    {
      evaluation_id: "eval-102",
      judge: {
        id: "usr-92",
        nick: "Maria Art",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120",
        specialization: "3D & VFX Lead @ CyberArts"
      },
      weighted_score: 4.55,
      scores: {
        gameplay: 4.5,
        theme: 5.0,
        graphics: 4.0,
        sound: 4.5,
        originality: 4.5
      },
      jury_comment: "Очень точное и выразительное следование теме «Забытые технологии». Освещение и туман вытягивают сцену на высочайший уровень для 72 часов разработки.",
      is_private: false
    },
    {
      evaluation_id: "eval-103",
      judge: {
        id: "usr-95",
        nick: "VoidSound Expert",
        avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=120",
        specialization: "Audio Director & Composer"
      },
      weighted_score: 4.70,
      scores: {
        gameplay: 4.8,
        theme: 5.0,
        graphics: 4.2,
        sound: 5.0,
        originality: 4.5
      },
      jury_comment: "Служебная заметка для оргкомитета: Акустические фильтры звука в WebGL билде работают идеально, без рассинхронизации частот на macOS/Windows.",
      is_private: true
    }
  ]
};

// Динамические темы для 1 / 2 / 3 места
const RANK_THEMES: Record<number, {
  name: string; text: string; bg: string; hoverBg: string;
  borderSubtle: string; glow: string; score: number;
  criteria: { gameplay: number; theme: number; graphics: number; sound: number; originality: number };
  emoji: string; label: string;
}> = {
  1: {
    name: 'Золото', emoji: '🥇', label: '1 МЕСТО',
    text: 'text-celebratory', bg: 'bg-celebratory', hoverBg: 'hover:opacity-90',
    borderSubtle: 'border-celebratory/30', glow: 'bg-celebratory/[0.05]',
    score: 4.68,
    criteria: { gameplay: 4.8, theme: 5.0, graphics: 4.2, sound: 4.5, originality: 4.4 }
  },
  2: {
    name: 'Серебро', emoji: '🥈', label: '2 МЕСТО',
    text: 'text-textPrimary', bg: 'bg-surface-3', hoverBg: 'hover:bg-borderStrong',
    borderSubtle: 'border-borderStrong', glow: 'bg-surface-3/[0.08]',
    score: 4.52,
    criteria: { gameplay: 4.6, theme: 4.8, graphics: 4.0, sound: 4.3, originality: 4.1 }
  },
  3: {
    name: 'Бронза', emoji: '🥉', label: '3 МЕСТО',
    text: 'text-warning', bg: 'bg-warning', hoverBg: 'hover:opacity-90',
    borderSubtle: 'border-warning/30', glow: 'bg-warning/[0.05]',
    score: 4.41,
    criteria: { gameplay: 4.5, theme: 4.6, graphics: 4.0, sound: 4.1, originality: 4.0 }
  }
};

export default function JamGamePage({ jamSlug, gameSlug, slug, authState, setAuthState }: { jamSlug?: string; gameSlug?: string; slug?: string; authState?: string; setAuthState?: (val: string) => void }) {
  console.log('JamGamePage loaded with jamSlug:', jamSlug, 'gameSlug:', gameSlug || slug);
  // --- STATE MATRIX ---
  const [localRole, setLocalRole] = useState('player');
  const role = authState || localRole;
  const isAuthor = role === 'author' || role === 'creator' || role === 'developer';
  
  // Mock current user ID - in production, this would come from auth context
  const currentUserId = role === 'developer' ? 1 : 999;
  const setRole = (val: string) => {
    setLocalRole(val);
    if (setAuthState) setAuthState(val);
  };
  const [status, setStatus] = useState('published');
  const [jamState, setJamState] = useState('results'); // default to 'results' state for demonstration
  const [jamRank, setJamRank] = useState<number>(1); // 1, 2, 3 — призовое место
  const [contentFill, setContentFill] = useState('happy');
  const [releasesTabState, setReleasesTabState] = useState('standard');
  const [donationState, setDonationState] = useState('active');

  // Локальные состояния интерфейса
  const [activeTab, setActiveTab] = useState('description');
  const [selectedJudgeId, setSelectedJudgeId] = useState('eval-101');
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);
  const [isPlayerActive, setIsPlayerActive] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isBuildsOpen, setIsBuildsOpen] = useState(false);
  const [commentSort, setCommentSort] = useState('fresh');
  const [isCollected, setIsCollected] = useState(false);
  const [isAddToCollectionModalOpen, setIsAddToCollectionModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [hasReportedGame, setHasReportedGame] = useState(false); // Track if user already reported this game
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const mockCollections = [
    { id: 'col-1', title: 'Избранное (Favorites)', games_count: 12 },
    { id: 'col-2', title: 'Играть позже (Backlog)', games_count: 5 },
    { id: 'col-3', title: 'Инди-хорроры 2026', games_count: 8 }
  ];

  // Раскрывающиеся списки изменений прошлых версий
  const [expandedReleases, setExpandedReleases] = useState({ rel_02: false, rel_03: false });

  // Текст комментария / фидбека в обсуждении
  const [reviewText, setReviewText] = useState('');

  // Состояния для джем-результатов
  const [isScorePopoverOpen, setIsScorePopoverOpen] = useState(false);
  const [isDiplomaModalOpen, setIsDiplomaModalOpen] = useState(false);
  const [isAppealDrawerOpen, setIsAppealDrawerOpen] = useState(false); // BR-JORG-059
  const [isDisputeDrawerOpen, setIsDisputeDrawerOpen] = useState(false); // BR-JORG-023
  const [sidebarJuryFilter, setSidebarJuryFilter] = useState<'all' | 'public' | 'private'>('all');
  const [expandedJudgeId, setExpandedJudgeId] = useState<string | null>('eval-101');
  const [juryAnonymityMode, setJuryAnonymityMode] = useState<'public' | 'anonymized'>('public');
  const [isAuthorFollowed, setIsAuthorFollowed] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isGameSubscribed, setIsGameSubscribed] = useState(false);
  const [gameSubscribersCount, setGameSubscribersCount] = useState(48);

  // --- СОСТОЯНИЯ БАГ-РЕПОРТА (ОБНОВЛЕННЫЙ DRAWER ИЗ ЭТАЛОНА) ---
  const [isBugReportDrawerOpen, setIsBugReportDrawerOpen] = useState(false);
  const [bugCategory, setBugCategory] = useState('gameplay'); // gameplay, graphics, audio, performance, crash, other
  const [bugReproducibility, setBugReproducibility] = useState('always'); // always, sometimes, rare, once
  const [bugSeverity, setBugSeverity] = useState('Medium'); // Low, Medium, High, Critical
  const [bugSteps, setBugSteps] = useState('');
  const [bugActualResult, setBugActualResult] = useState('');
  const [bugExpectedResult, setBugExpectedResult] = useState('');
  const [bugAttachSpecs, setBugSpecsAttach] = useState(true);
  const [bugAttachedFiles, setBugAttachedFiles] = useState([]); // массив имитированных вложений

  const [bugReportValidationError, setBugReportValidationError] = useState(false);
  const [isBugReportSubmitting, setIsBugReportSubmitting] = useState(false);
  const [isBugReportSuccess, setIsBugReportSuccess] = useState(false);
  const [bugReportsSentCount, setBugReportsSentCount] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(2700);

  // --- СОСТОЯНИЯ ПОДДЕРЖКИ АВТОРА ---
  const [isDonationDrawerOpen, setIsDonationDrawerOpen] = useState(false);
  const [showDonationAuthPrompt, setShowDonationAuthPrompt] = useState(false);
  const { showToast } = useToast();

  // Оценки джема (Для панели жюри)
  const [jamRatings, setJamRatings] = useState({ gameplay: 0, graphics: 0, theme: 0 });
  const [jamRatingsHover, setJamRatingsHover] = useState({ gameplay: 0, graphics: 0, theme: 0 });
  const [isRecused, setIsRecused] = useState(false); // BR-JORG-034: Judge Recusal

  const profileMenuRef = useRef(null);

  const data = contentFill === 'happy' ? BROKEN_LORE_DATA : MINIMAL_DATA;
  const [jamReviews, setJamReviews] = useState<Review[]>(data.reviews as any || []);

  useEffect(() => {
    setJamReviews(data.reviews as any || []);
  }, [contentFill]);

  const handleSubmitComment = () => {
    if (!reviewText.trim() || role === 'guest') return;
    const newComment: Review = {
      id: Date.now(),
      author: role === 'author' ? (data.authors?.[0]?.name || 'NocturnalDevs') : role === 'judge' ? 'Эксперт Жюри' : 'Вы (Участник)',
      authorAvatar: role === 'author' ? data.authors?.[0]?.avatar : undefined,
      role: (role === 'author' ? 'Author' : role === 'judge' ? 'Judge' : 'Player') as Review['role'],
      date: 'Только что',
      score: 0,
      text: reviewText.trim(),
      developerResponse: null,
    };
    setJamReviews(prev => [newComment, ...prev]);
    setReviewText('');
    triggerToast("Комментарий успешно опубликован!", "success");
  };

  
  // Owner check: determine if current user is an author of this game
  const isOwner = data.authors?.some(author => author.id === currentUserId) || false;

  // Вычисление динамического среднего балла оценок жюри
  const totalRated = (jamRatings.gameplay > 0 ? 1 : 0) + (jamRatings.graphics > 0 ? 1 : 0) + (jamRatings.theme > 0 ? 1 : 0);
  const avgScore = totalRated > 0 ? ((jamRatings.gameplay + jamRatings.graphics + jamRatings.theme) / totalRated).toFixed(1) : null;

  useEffect(() => {
    setIsPlayerActive(false);
    setActiveSlide(0);
    setIsBuildsOpen(false);
    setIsBugReportDrawerOpen(false);
    setShowDonationAuthPrompt(false);
    setIsProfileMenuOpen(false);
  }, [contentFill, jamState, role]);

  // Automatically open appeal drawer if navigated with appeal intent
  useEffect(() => {
    const checkHashForAppeal = () => {
      console.log('Checking hash for appeal:', window.location.hash);
      if (window.location.hash.includes('appeal=true')) {
        console.log('Opening appeal drawer!');
        setIsAppealDrawerOpen(true);
        setJamState('disqualified');
      }
    };
    
    // Check on mount
    checkHashForAppeal();
    
    // Check on hash change
    window.addEventListener('hashchange', checkHashForAppeal);
    
    return () => {
      window.removeEventListener('hashchange', checkHashForAppeal);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    let interval = null;
    if (bugReportsSentCount >= 5 && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setBugReportsSentCount(0);
      setTimerSeconds(2700);
    }
    return () => clearInterval(interval);
  }, [bugReportsSentCount, timerSeconds]);

  const formatTimer = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const triggerToast = (text: string, type: any = 'info') => {
    showToast(text, type === 'error' ? 'danger' : type);
  };

  const handleToggleAuthorFollow = () => {
    if (role === 'guest') {
      showToast('Войдите в аккаунт, чтобы подписаться на автора', 'warning');
      return;
    }

    if (isAuthorFollowed) {
      setIsAuthorFollowed(false);
      showToast('Вы отписались от автора', 'info');
    } else {
      setIsAuthorFollowed(true);
      showToast('Вы подписались на автора. Новые статьи девлогов будут приходить в ленту', 'success');
    }
  };

  const toggleReleaseExpand = (relId) => {
    setExpandedReleases(prev => ({ ...prev, [relId]: !prev[relId] }));
  };

  const handleRetryLoading = () => {
    setReleasesTabState('loading');
    setTimeout(() => {
      setReleasesTabState('standard');
      triggerToast('Список релизов успешно обновлен!', 'success');
    }, 1200);
  };

  // Метод имитации добавления файлов в баг-репорт
  const handleAddMockScreenshot = () => {
    if (bugAttachedFiles.length >= 3) {
      triggerToast("Максимум можно прикрепить 3 файла", "warning");
      return;
    }
    const mockNames = ["error_shader_O2.png", "kriokamera_collision.png", "framerate_drop_tanatos.png"];
    const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];
    const newFile = {
      id: Date.now(),
      name: `${Date.now().toString().slice(-4)}_${randomName}`,
      size: `${(Math.random() * 2 + 0.5).toFixed(1)} MB`
    };
    setBugAttachedFiles(prev => [...prev, newFile]);
    triggerToast(`Файл ${newFile.name} прикреплен к отчету`, "success");
  };

  const handleRemoveMockScreenshot = (id) => {
    setBugAttachedFiles(prev => prev.filter(f => f.id !== id));
  };

  // Метод отправки баг-репорта
  const handleBugReportSubmit = () => {
    if (role === 'guest') return;

    if (!bugActualResult.trim() || !bugSteps.trim() || !bugExpectedResult.trim()) {
      setBugReportValidationError(true);
      return;
    }

    setIsBugReportSubmitting(true);

    setTimeout(() => {
      setIsBugReportSubmitting(false);
      setIsBugReportSuccess(true);
      setBugReportsSentCount(prev => prev + 1);

      // Сброс полей
      setBugSteps('');
      setBugActualResult('');
      setBugExpectedResult('');
      setBugAttachedFiles([]);
      setBugReportValidationError(false);
      triggerToast('Баг-репорт успешно отправлен разработчикам!', 'success');

      setTimeout(() => {
        setIsBugReportSuccess(false);
        setIsBugReportDrawerOpen(false);
      }, 2000);
    }, 1800);
  };


  const handleCopyLink = () => {
    const tempInput = document.createElement('input');
    tempInput.value = window.location.href;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      triggerToast("Ссылка скопирована в буфер обмена!", 'success');
    } catch (err) {
      triggerToast("Не удалось скопировать ссылку.", 'error');
    }
    document.body.removeChild(tempInput);
  };

  const handleToggleGameSubscription = () => {
    if (role === 'guest') {
      triggerToast('Войдите в аккаунт, чтобы подписаться на игру', 'warning');
      return;
    }
    if (isGameSubscribed) {
      setIsGameSubscribed(false);
      setGameSubscribersCount(prev => Math.max(0, prev - 1));
      triggerToast('Вы отписались от обновлений игры', 'info');
    } else {
      setIsGameSubscribed(true);
      setGameSubscribersCount(prev => prev + 1);
      triggerToast('Вы подписались на обновления игры', 'success');
    }
  };

  const [showMobileStickyCta, setShowMobileStickyCta] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowMobileStickyCta(window.scrollY > 380);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  return (
    <div className="min-h-screen bg-surface-0 text-textPrimary relative select-none font-sans overflow-x-hidden">
      <FontStyles />

      {/* DEV MATRIX CONTROL PANEL */}
      <DevMatrixPanel 
        bottomOffsetClass="bottom-36 md:bottom-0"
        pageName="Страница игры (Джем-версия)"
        fields={[
          {
            id: 'role',
            label: 'Роль',
            type: 'select',
            value: role,
            onChange: setRole,
            options: [
              { value: 'guest', label: '[Guest (Гость)]' },
              { value: 'player', label: '[Player (Игрок)]' },
              { value: 'author', label: '[Author (Владелец)]' },
              { value: 'judge', label: '[Judge (Жюри)]' }
            ]
          },
          {
            id: 'jamState',
            label: 'Джем',
            type: 'select',
            value: jamState,
            onChange: setJamState,
            options: [
              { value: 'none', label: '[Вне джемов]' },
              { value: 'active_locked', label: '[Активный джем: Голосование]' },
              { value: 'results', label: '[Результаты джема]' },
              { value: 'disqualified', label: '[Дисквалифицирован (Апелляция)]' }
            ]
          },
          {
            id: 'jamRank',
            label: 'Призовое место',
            type: 'select',
            value: String(jamRank),
            onChange: (val: string) => setJamRank(Number(val)),
            highlight: true,
            options: [
              { value: '1', label: '[1-е Место (Золото)]' },
              { value: '2', label: '[2-е Место (Серебро)]' },
              { value: '3', label: '[3-е Место (Бронза)]' }
            ]
          },
          {
            id: 'releasesTabState',
            label: 'Релизы',
            type: 'select',
            value: releasesTabState,
            onChange: (val) => {
              setReleasesTabState(val);
              setActiveTab('releases');
            },
            highlight: true,
            options: [
              { value: 'standard', label: '[1. Успешно / Списки]' },
              { value: 'loading', label: '[2. Загрузка / Скелетоны]' },
              { value: 'empty', label: '[3. Пустое состояние]' },
              { value: 'error', label: '[4. Ошибка сети]' },
              { value: 'jam_locked', label: '[5. Lock / Джем-заморозка]' }
            ]
          }
        ]}
      />

      {/* --- СИСТЕМНЫЕ СТАТУСНЫЕ БАННЕРЫ --- */}
      {isAuthor && (
        <div className="bg-surface-1 border-b border-borderDef px-4 md:px-8 py-3 flex items-center justify-between sticky top-10 z-20">
          <span className="text-xs text-textTertiary font-mono uppercase tracking-wider">Панель управления автора</span>
          <div className="flex items-center gap-3">
            {jamState === 'results' && jamRank <= 3 && (
              <button
                onClick={() => setIsDisputeDrawerOpen(true)}
                className="text-xs h-9 px-4 bg-surface-2 hover:bg-surface-3 border border-borderDef text-textPrimary rounded-card font-medium transition-colors active:scale-95 duration-120 flex items-center gap-2"
              >
                <Trophy className="w-3.5 h-3.5 text-success" />
                Приз не получен?
              </button>
            )}
            <button className="text-xs h-9 px-4 hover:bg-surface-3 rounded-card transition-colors text-textPrimary font-medium border border-borderDef active:scale-95 duration-120">
              Редактировать страницу
            </button>
            <div className="relative group">
              <button
                className={`text-xs h-9 px-4 rounded-card flex items-center gap-2 transition-colors border font-medium active:scale-95 duration-120
                  ${jamState === 'active_locked'
                    ? 'text-textDisabled bg-transparent border-borderDef cursor-not-allowed'
                    : 'text-textPrimary bg-surface-3 border-borderDef hover:bg-surface-3'}`}
                disabled={jamState === 'active_locked'}
              >
                {jamState === 'active_locked' && <Lock className="w-3.5 h-3.5 text-textDisabled" />}
                Управление билдами
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DISQUALIFIED / REJECTED BANNER (BR-JORG-059) */}
      {jamState === 'disqualified' && isAuthor && (
        <div className="bg-danger/10 border-b border-danger/30 px-4 md:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn shadow-sm sticky top-10 z-20">
          <div className="flex items-start gap-3">
            <AlertOctagon className="w-5 h-5 text-danger shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold text-danger uppercase tracking-wider font-mono">Заявка дисквалифицирована</span>
              <span className="text-xs text-danger/90 font-sans leading-relaxed">
                Ваша заявка снята с участия в Cyberjam 2026. Если вы считаете это ошибкой модерации, вы можете подать апелляцию.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsAppealDrawerOpen(true)}
            className="shrink-0 px-5 py-2.5 bg-danger hover:bg-danger/90 text-white rounded-card text-xs font-bold uppercase tracking-wider transition-colors active:scale-95 shadow-md"
          >
            Подать апелляцию
          </button>
        </div>
      )}

      {/* --- ГЛАВНЫЙ КОНТЕНТНЫЙ БЛОК --- */}
      <main className="max-w-[1440px] mx-auto px-4 md:px-8 pt-6 sm:pt-10 pb-44 md:pb-24">

        {/* Хлебные крошки и заголовок */}
        <div className="mb-8 select-none">
          <nav aria-label="Хлебные крошки" className="flex items-center gap-2 text-xs font-semibold text-textTertiary uppercase tracking-wider mb-2 font-mono">
            <button 
              type="button"
              onClick={() => {
                if ((window as any).__hubigrNavigate) (window as any).__hubigrNavigate('/jams');
                else window.location.hash = '#/jams';
              }}
              className="hover:text-accent transition-colors cursor-pointer"
            >
              Джемы
            </button>
            <span>/</span>
            <button 
              type="button"
              onClick={() => {
                const target = `/jams/${jamSlug || 'broken-worlds-jam'}`;
                if ((window as any).__hubigrNavigate) (window as any).__hubigrNavigate(target);
                else window.location.hash = `#${target}`;
              }}
              className="hover:text-accent transition-colors cursor-pointer truncate max-w-xs"
            >
              {data.jamName || 'Broken Worlds Jam 2026'}
            </button>
            <span>/</span>
            <span className="text-textPrimary font-bold truncate">Сабмит</span>
          </nav>

          <h1 className="text-3xl md:text-[44px] font-bold leading-[1.1] tracking-tight text-textPrimary mb-4 font-sans">
            {data.title}
          </h1>

          <div className="flex flex-wrap items-center gap-2.5">
            {jamState !== 'none' && (
              <span className="bg-accent/10 border border-accent/30 text-accent px-3 py-1 rounded-control text-xs font-bold flex items-center gap-1.5 uppercase tracking-wide">
                <Star className="w-3.5 h-3.5 fill-accent" /> Game Jam Entry
              </span>
            )}
            <span className="bg-surface-2 border border-borderDef text-textTertiary px-3 py-1 rounded-control text-xs font-medium font-mono uppercase">
              {data.genre ? data.genre.split(',')[0].trim() : 'Sci-Fi Horror'}
            </span>
            <span className="bg-surface-2 border border-borderDef text-textTertiary px-3 py-1 rounded-control text-xs font-medium font-mono uppercase">
              WebGL Build
            </span>
          </div>

          {/* 3.1. ЕДИНЫЙ И ЭЛЕГАНТНЫЙ ЗНАК ПОБЕДИТЕЛЯ В ШАПКЕ ПРОЕКТА (Динамический по ранкингу) */}
          {jamState === 'results' && (() => {
            const t = RANK_THEMES[jamRank] || RANK_THEMES[1];
            return (
              <div className="flex items-center gap-3 mt-3 relative select-none animate-fadeIn">
                <button
                  type="button"
                  onClick={() => setIsDiplomaModalOpen(true)}
                  className={`inline-flex items-center gap-2.5 bg-transparent border hover:brightness-125 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer group ${t.text} ${t.borderSubtle}`}
                  title="Нажмите, чтобы открыть диплом победителя"
                >
                  <Trophy className="w-3.5 h-3.5 shrink-0 fill-current group-hover:rotate-12 transition-transform" />
                  <span>{t.emoji} {t.label} • BROKEN WORLDS JAM 2026</span>
                  <span className="text-textDisabled font-normal">|</span>
                  <span className="text-textPrimary font-sans font-extrabold flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-current" /> {t.score.toFixed(2)}
                  </span>
                </button>
              </div>
            );
          })()}
        </div>

        {/* СЕТКА LAYOUT: CSS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-y-8 lg:gap-12 items-start w-full">
          
          {/* БЛОК 1: ПЛЕЕР И СКРИНШОТЫ */}
          <div className="w-full flex flex-col gap-4 order-1 lg:col-start-1 lg:row-start-1">

            {/* Медиа-комбайн WebGL */}
            <div className="flex flex-col gap-4">
              
              {/* JAM BUILD SNAPSHOT ALERT (BR-JORG-046) */}
              {jamState === 'active_locked' && (
                <div className="bg-warning/10 border border-warning/40 rounded-card p-4 flex items-start gap-3 shadow-sm mb-0 animate-fadeIn">
                  <Lock className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1.5 text-sm font-sans">
                    <span className="font-bold text-warning uppercase tracking-wide text-xs">Jam Build Snapshot (Frozen at Cutoff)</span>
                    <span className="text-textSecondary leading-relaxed text-[13px]">
                      Эта сборка заморожена <span className="font-mono text-textPrimary">12.07.2026</span> правилами {data.jamName}. 
                      Жюри оценивает именно эту версию. Новые релизы (текущая версия: {data.versions}) недоступны до конца голосования.
                    </span>
                  </div>
                </div>
              )}

              <div className="w-full aspect-[16/10] bg-surface-1 rounded-modal overflow-hidden relative border border-borderDef shadow-2xl mt-1">
                {isPlayerActive ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-surface-0 animate-fadeIn">
                    <button
                      onClick={() => setIsPlayerActive(false)}
                      className="absolute top-4 right-4 bg-surface-3 p-2.5 rounded-full hover:bg-surface-3 transition-colors border border-borderDef text-textPrimary z-50 animate-fadeIn"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <div className="w-16 h-16 rounded-full border-4 border-t-accent border-r-transparent border-b-transparent border-l-transparent animate-spin mb-4" />
                    <p className="hidden md:block text-sm text-textTertiary font-mono">Запуск WebGL среды BrokenLore...</p>
                    <div className="md:hidden flex flex-col items-center text-center px-4 space-y-1.5">
                      <p className="text-sm font-bold text-textPrimary font-sans">Запуск WebGL среды...</p>
                      <span className="text-[11px] text-textTertiary font-mono bg-surface-2 px-2.5 py-1 rounded-control border border-borderDef">
                        💡 Совет: поверните устройство для лучшего обзора
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    <img
                      src={activeSlide === 0 ? data.cover : data.screenshots[activeSlide - 1]}
                      alt="Кадр игрового процесса"
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-0/60 to-transparent" />

                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <button
                        onClick={() => {
                          setIsPlayerActive(true);
                        }}
                        className="bg-accent hover:bg-accent-hover text-white pointer-events-auto pl-6 pr-8 py-4 rounded-card font-extrabold text-sm sm:text-base flex items-center gap-3.5 transition-all active:scale-95 duration-120 shadow-md tracking-wider uppercase border-none cursor-pointer"
                      >
                        <Play className="w-5 h-5 fill-current" />
                        {jamState === 'active_locked' ? 'Запустить Jam Snapshot' : 'Запустить WebGL'}
                      </button>
                    </div>

                    {data.screenshots && data.screenshots.length > 0 && (
                      <>
                        <button
                          onClick={() => setActiveSlide(prev => Math.max(0, prev - 1))}
                          disabled={activeSlide === 0}
                          className={`absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/95 p-2.5 rounded-full transition-all pointer-events-auto border border-borderDef ${activeSlide === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-100'}`}
                        >
                          <ChevronLeft className="w-5 h-5 text-white" />
                        </button>
                        <button
                          onClick={() => setActiveSlide(prev => Math.min(data.screenshots.length, prev + 1))}
                          disabled={activeSlide === data.screenshots.length}
                          className={`absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/95 p-2.5 rounded-full transition-all pointer-events-auto border border-borderDef ${activeSlide === data.screenshots.length ? 'opacity-30 cursor-not-allowed' : 'opacity-100'}`}
                        >
                          <ChevronRight className="w-5 h-5 text-white" />
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>

              {/* Ряд скриншотов */}
              {data.screenshots && data.screenshots.length > 0 && !isPlayerActive && (
                <div className="flex flex-row flex-nowrap w-full overflow-x-auto no-scrollbar gap-3 select-none">
                  <div
                    onClick={() => setActiveSlide(0)}
                    className={`w-32 shrink-0 aspect-[16/10] rounded-card overflow-hidden cursor-pointer border-2 transition-all hover:scale-[1.02] duration-200 ${activeSlide === 0 ? 'border-accent' : 'border-borderDef hover:border-borderStrong'}`}
                  >
                    <img src={data.cover} className="w-full h-full object-cover filter brightness-[80%] hover:brightness-[100%] transition-all" alt="Cover thumbnail" />
                  </div>
                  {data.screenshots.map((src, i) => (
                    <div
                      key={i}
                      onClick={() => setActiveSlide(i + 1)}
                      className={`w-32 shrink-0 aspect-[16/10] rounded-card overflow-hidden cursor-pointer border-2 transition-all hover:scale-[1.02] duration-200 ${activeSlide === i + 1 ? 'border-accent' : 'border-borderDef hover:border-borderStrong'}`}
                    >
                      <img src={src} className="w-full h-full object-cover filter brightness-[80%] hover:brightness-[100%] transition-all" alt="Gameplay thumbnail" />
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* БЛОК 3: ТАБЫ И КОНТЕНТ */}
          <div className="w-full flex flex-col gap-8 order-3 lg:col-start-1 lg:row-start-2">
            
            {/* Вкладочная навигация */}
            <div className="border-b border-borderDef flex items-center gap-6 md:gap-8 mt-2 md:mt-4 select-none w-full overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('description')}
                className={`pb-4 text-[15px] font-semibold relative transition-colors ${activeTab === 'description' ? 'text-textPrimary' : 'text-textTertiary hover:text-textSecondary'}`}
              >
                Описание
                {activeTab === 'description' && <span className="absolute bottom-[-1.5px] left-0 right-0 h-[2px] bg-accent" />}
              </button>
              <button
                onClick={() => {
                  setActiveTab('devlog');
                }}
                className={`pb-4 text-[15px] font-semibold relative transition-colors ${activeTab === 'devlog' ? 'text-textPrimary' : 'text-textTertiary hover:text-textSecondary'}`}
              >
                Devlog ({data.devlogs ? data.devlogs.length : 0})
                {activeTab === 'devlog' && <span className="absolute bottom-[-1.5px] left-0 right-0 h-[2px] bg-accent" />}
              </button>
              <button
                onClick={() => {
                  setActiveTab('releases');
                }}
                className={`pb-4 text-[15px] font-semibold relative transition-colors ${activeTab === 'releases' ? 'text-textPrimary' : 'text-textTertiary hover:text-textSecondary'}`}
              >
                Релизы
                {activeTab === 'releases' && <span className="absolute bottom-[-1.5px] left-0 right-0 h-[2px] bg-accent" />}
              </button>
            </div>

            {/* Контент табов */}
            <div className="w-full">
              {activeTab === 'description' && (
                <div className="flex flex-col gap-10">
                  <div className="flex flex-col gap-6 max-w-[720px] font-sans">
                    <p className="text-[19px] leading-relaxed text-textPrimary font-semibold tracking-tight">
                      {data.descriptionLead}
                    </p>
                    <p className="text-[16px] leading-[1.7] text-textPrimary/90">
                      {data.descriptionBody}
                    </p>
                  </div>

                  <div className="border-y border-borderDef/50 w-full pt-2">
                    <button
                      onClick={() => setIsSpecsOpen(!isSpecsOpen)}
                      className="w-full flex items-center justify-between py-4 hover:text-accent transition-colors outline-none focus-visible:outline-none group"
                    >
                      <span className="text-sm font-bold text-textPrimary group-hover:text-accent transition-colors">Спецификация и управление</span>
                      <ChevronDown className={`w-4 h-4 text-textTertiary transition-transform ${isSpecsOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isSpecsOpen && (
                      <div className="pb-6 pt-4 flex flex-col gap-8 animate-fadeIn">
                        <div className="flex flex-col gap-4 text-sm font-sans">
                          <div className="flex justify-between py-1 border-b border-borderDef">
                            <span className="text-textTertiary">Движок / Технология:</span>
                            <span className="text-textPrimary font-mono text-xs">Unity WebGL API</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-borderDef">
                            <span className="text-textTertiary">Системные требования:</span>
                            <span className="text-textPrimary font-mono text-xs">4 GB RAM / WebGL 2.0 compatible browser</span>
                          </div>
                        </div>

                        {/* Управление */}
                        <div className="flex flex-col gap-4 font-sans">
                          <span className="text-sm font-bold text-textPrimary">Раскладка управления</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                            <div className="flex flex-col gap-4">
                              <div className="flex items-center gap-3">
                                <kbd className="font-mono text-textPrimary text-xs bg-surface-3 border border-borderDef px-1.5 py-0.5 rounded-control min-w-[32px] text-center shadow-sm">WASD</kbd>
                                <span className="text-textSecondary">Перемещение персонажа</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <kbd className="font-mono text-textPrimary text-xs bg-surface-3 border border-borderDef px-1.5 py-0.5 rounded-control min-w-[32px] text-center shadow-sm">SPACE</kbd>
                                <span className="text-textSecondary">Прыгнуть / Задержать дыхание</span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-4">
                              <div className="flex items-center gap-3">
                                <kbd className="font-mono text-textPrimary text-xs bg-surface-3 border border-borderDef px-1.5 py-0.5 rounded-control min-w-[32px] text-center shadow-sm">E</kbd>
                                <span className="text-textSecondary">Взаимодействовать с баллоном</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <kbd className="font-mono text-textPrimary text-xs bg-surface-3 border border-borderDef px-1.5 py-0.5 rounded-control min-w-[32px] text-center shadow-sm">LMB</kbd>
                                <span className="text-textSecondary">Включить прожектор</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ЛЕНТА ДЕВЛОГОВ (Унифицировано с DevLogGameWidget) */}
              {activeTab === 'devlog' && (
                <DevLogGameWidget
                  gameId={data.id}
                  gameSlug={jamSlug || 'brokenlore-follow'}
                  gameName={data.title}
                  isOwner={isAuthor}
                />
              )}

              {/* РЕЛИЗЫ (Растянутые на всю ширину таба) */}
              {activeTab === 'releases' && (
                <div className="w-full flex flex-col gap-8 animate-fadeIn">
                  {releasesTabState === 'loading' && (
                    <div className="w-full flex flex-col gap-6 animate-pulse">
                      <div className="bg-surface-1 border border-borderDef p-6 rounded-card flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <div className="h-7 w-28 bg-surface-2 rounded-control" />
                          <div className="h-5 w-20 bg-surface-2 rounded-control" />
                        </div>
                        <div className="h-4 w-40 bg-surface-2 rounded-control" />
                        <div className="space-y-2 pt-2">
                          <div className="h-3 w-full bg-surface-2 rounded-control" />
                          <div className="h-3 w-5/6 bg-surface-2 rounded-control" />
                        </div>
                      </div>
                    </div>
                  )}

                  {releasesTabState === 'empty' && (
                    <div className="w-full bg-surface-1 border border-dashed border-borderDef p-12 rounded-modal flex flex-col items-center text-center gap-4">
                      <div className="w-12 h-12 rounded-card border border-borderDef flex items-center justify-center text-textDisabled bg-surface-0">
                        <Folder className="w-6 h-6 stroke-[1.5]" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <h4 className="text-xs font-bold text-textPrimary uppercase tracking-wide font-mono">История версий пуста</h4>
                        <p className="text-xs text-textTertiary max-w-[420px] leading-relaxed font-sans">
                          Разработчик пока не добавил ни одной сборки на платформу HUBIGR.
                        </p>
                      </div>
                    </div>
                  )}

                  {releasesTabState === 'error' && (
                    <div className="w-full border border-danger/30 bg-danger/5 p-6 rounded-card flex items-start gap-4">
                      <AlertOctagon className="w-5 h-5 text-danger shrink-0 mt-0.5" />
                      <div className="flex-1 flex flex-col gap-3">
                        <div>
                          <h4 className="text-xs font-bold text-danger uppercase tracking-wider font-mono">Ошибка получения списка релизов</h4>
                          <p className="text-xs text-textSecondary mt-1 leading-relaxed font-sans">
                            Не удалось установить защищенное соединение с сервером сборщика HUBIGR. Пожалуйста, попробуйте повторить попытку.
                          </p>
                        </div>
                        <button
                          onClick={handleRetryLoading}
                          className="w-max bg-transparent border border-danger/40 hover:bg-danger/10 text-textPrimary px-4 py-1.5 rounded-control text-xs font-bold font-sans tracking-wide uppercase flex items-center gap-2 transition-all duration-120 active:scale-95"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          Повторить попытку
                        </button>
                      </div>
                    </div>
                  )}

                  {(releasesTabState === 'standard' || releasesTabState === 'jam_locked') && (
                    <div className="w-full flex flex-col gap-8">
                      {releasesTabState === 'jam_locked' && (
                        <div className="border border-warning/30 bg-warning/10 p-4 rounded-card flex items-start gap-3">
                          <Lock className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                          <p className="text-xs text-textSecondary leading-relaxed font-sans">
                            <span className="text-warning font-bold uppercase tracking-wider font-mono mr-1.5">[Заморожено джемом]:</span>
                            Скачивание прошлых версий сборки ограничено условиями проведения <span className="text-textPrimary font-semibold">Cyberjam 2026</span> до окончания оценки.
                          </p>
                        </div>
                      )}

                      {/* АКТУАЛЬНЫЙ РЕЛИЗ */}
                      {BROKEN_LORE_RELEASES.filter(r => r.is_latest).map(rel => (
                        <div key={rel.id} className="bg-surface-1 border border-borderDef p-6 rounded-card flex flex-col gap-5 shadow-[0_4px_24px_rgba(0,0,0,0.4)] animate-fadeIn">
                          <div className="flex items-start justify-between flex-wrap gap-3 select-none">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl font-bold text-textPrimary tracking-tight font-sans">{rel.version}</span>
                              <span className="bg-accent text-white text-xs font-bold px-2 py-0.5 rounded-control uppercase tracking-wider font-mono">
                                LATEST
                              </span>
                            </div>
                            <span className="font-mono text-xs text-textTertiary mt-1.5">
                              {rel.published_at} &bull; {rel.file_size}
                            </span>
                          </div>

                          <div className="flex flex-col gap-5 border-t border-borderDef pt-4">
                            {rel.changelog_markdown.map((section, idx) => (
                              <div key={idx} className="flex flex-col gap-2 font-sans">
                                <h4 className="text-xs font-bold text-accent uppercase tracking-wider font-mono">
                                  {section.title}
                                </h4>
                                <ul className="flex flex-col gap-1.5 pl-4 list-none text-sm text-textSecondary leading-relaxed">
                                  {section.items.map((item, i) => (
                                    <li key={i} className="relative before:content-[''] before:absolute before:left-[-14px] before:top-[8px] before:w-1.5 before:border-b-2 before:border-accent-secondary">
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>

                          <div className="pt-2">
                            <button
                              onClick={() => {
                                if (releasesTabState === 'jam_locked') {
                                  triggerToast("Скачивание ограничено правилами Cyberjam 2026", "warning");
                                } else {
                                  triggerToast(`Загрузка релиза ${rel.version}...`, "success");
                                }
                              }}
                              className={`px-5 py-2.5 rounded-card border text-xs font-bold font-mono tracking-wide uppercase flex items-center gap-2.5 transition-all duration-120 active:scale-95
                                ${releasesTabState === 'jam_locked'
                                  ? 'border-borderDef text-textDisabled bg-transparent cursor-not-allowed'
                                  : 'border-borderDef text-textPrimary bg-transparent hover:bg-surface-2'}`}
                              disabled={releasesTabState === 'jam_locked'}
                            >
                              {releasesTabState === 'jam_locked' ? <Lock className="w-4 h-4" /> : <Download className="w-4 h-4 text-textTertiary" />}
                              Скачать сборку
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* АРХИВНЫЕ ВЕРСИИ */}
                      <div className="flex flex-col w-full mt-2">
                        {BROKEN_LORE_RELEASES.filter(r => !r.is_latest).map(rel => {
                          const isOpen = expandedReleases[rel.id];
                          return (
                            <div key={rel.id} className="w-full border-t border-borderDef py-5 flex flex-col gap-4 group transition-colors duration-200">
                              <div className="flex items-center justify-between flex-wrap gap-2 select-none">
                                <div className="flex items-center gap-3">
                                  <span className="text-[18px] font-bold text-textPrimary tracking-tight group-hover:text-accent transition-colors font-sans">
                                    {rel.version}
                                  </span>
                                  <span className="font-mono text-xs text-textTertiary pt-0.5">
                                    {rel.published_at} &bull; {rel.file_size}
                                  </span>
                                </div>

                                <div className="flex items-center gap-4">
                                  <button
                                    onClick={() => toggleReleaseExpand(rel.id)}
                                    className="text-xs font-bold text-textTertiary hover:text-accent uppercase tracking-wider flex items-center gap-1.5 transition-colors duration-120"
                                  >
                                    {isOpen ? "Скрыть" : "Изменения"}
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                                  </button>

                                  <button
                                    onClick={() => {
                                      if (releasesTabState === 'jam_locked') {
                                        triggerToast("Доступ заблокирован правилами Cyberjam 2026", "warning");
                                      } else {
                                        triggerToast(`Загрузка архива версии ${rel.version}`, "success");
                                      }
                                    }}
                                    className={`p-1.5 rounded-control transition-all flex items-center gap-1.5 font-mono text-xs font-bold uppercase duration-120 active:scale-95
                                      ${releasesTabState === 'jam_locked'
                                        ? 'text-textDisabled cursor-not-allowed'
                                        : 'text-textTertiary hover:text-textPrimary'}`}
                                    disabled={releasesTabState === 'jam_locked'}
                                  >
                                    {releasesTabState === 'jam_locked' ? <Lock className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                                    ZIP
                                  </button>
                                </div>
                              </div>

                              {isOpen && (
                                <div className="pt-2 flex flex-col gap-4 animate-fadeIn w-full font-sans">
                                  {rel.changelog_markdown.map((section, idx) => (
                                    <div key={idx} className="flex flex-col gap-1.5">
                                      <h5 className="text-xs font-bold text-accent uppercase tracking-wider font-mono">{section.title}</h5>
                                      <ul className="flex flex-col gap-1 pl-4 list-none text-xs text-textSecondary leading-relaxed">
                                        {section.items.map((item, i) => (
                                          <li key={i} className="relative before:content-[''] before:absolute before:left-[-12px] before:top-[7px] before:w-1 before:border-b-2 before:border-accent-secondary/55">{item}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Warnings Предупреждения */}
            {data.warnings && activeTab !== 'releases' && (
              <div className="flex items-start gap-3 text-warning w-full bg-warning/10 border border-warning/30 p-4 rounded-card">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-warning" />
                <p className="text-sm leading-relaxed font-medium font-sans">{data.warnings}</p>
              </div>
            )}

            {/* ОБСУЖДЕНИЕ И ФОРМЫ (Унифицировано с ReviewsSection) */}
            <div id="reviews-section" className="mt-12 border-t border-borderDef pt-12 w-full scroll-mt-24">
              <div className="flex items-center justify-between mb-8 flex-wrap gap-4 select-none">
                <h2 className="text-[24px] font-bold tracking-tight text-textPrimary font-sans">
                  Обсуждение <span className="font-mono text-textDisabled font-normal text-[18px]">({jamReviews.length})</span>
                </h2>

                <div className="flex items-center gap-3">
                  {/* Кнопка баг-репорта (FE-BUG-001, FE-BUG-002) */}
                  <button
                    type="button"
                    onClick={() => setIsBugReportDrawerOpen(true)}
                    className={`h-9 px-4 rounded-control border text-xs font-semibold flex items-center gap-2 transition-all duration-120 active:scale-95 focus:outline-none cursor-pointer
                      ${isBugReportDrawerOpen
                        ? 'border-danger bg-danger/10 text-danger'
                        : 'border-borderDef bg-transparent text-textSecondary hover:text-textPrimary hover:border-borderStrong'}`}
                  >
                    <Bug className="w-3.5 h-3.5 text-danger" />
                    <span>Баг-репорт</span>
                  </button>

                  <div className="flex border border-borderDef rounded-control overflow-hidden">
                    <button
                      onClick={() => setCommentSort('fresh')}
                      className={`px-3 h-9 text-xs font-semibold font-mono transition-colors ${commentSort === 'fresh' ? 'bg-surface-3 text-textPrimary' : 'text-textTertiary hover:text-textSecondary'}`}
                    >
                      Свежие
                    </button>
                    <button
                      onClick={() => setCommentSort('popular')}
                      className={`px-3 h-9 text-xs font-semibold font-mono transition-colors ${commentSort === 'popular' ? 'bg-surface-3 text-textPrimary' : 'text-textTertiary hover:text-textSecondary'}`}
                    >
                      Популярные
                    </button>
                  </div>
                </div>
              </div>

              {/* Modern Comment Input (Single Shape) */}
              <div className="relative group mb-8">
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  maxLength={500}
                  placeholder="Напишите конструктивный отзыв или комментарий для команды проекта..."
                  className="w-full bg-surface-2/40 hover:bg-surface-2/60 focus:bg-surface-2 focus:ring-1 focus:ring-accent/50 rounded-card text-base text-textPrimary placeholder:text-textTertiary resize-none min-h-[120px] p-5 pb-16 leading-relaxed outline-none transition-all border-none"
                  disabled={role === 'guest'}
                />

                {/* Floating Bottom Row inside the textarea shape */}
                <div className="absolute bottom-4 left-5 right-4 flex items-center justify-between select-none">
                  <span className="text-xs text-textDisabled font-medium">
                    {reviewText.length} / 500
                  </span>

                  <button
                    onClick={handleSubmitComment}
                    disabled={!reviewText.trim() || role === 'guest'}
                    className={`h-9 px-5 rounded-control text-sm font-bold transition-all ${
                      reviewText.trim() && role !== 'guest'
                        ? 'bg-accent hover:bg-accent-hover text-white shadow-md shadow-accent/20 cursor-pointer'
                        : 'bg-surface-3 text-textDisabled cursor-not-allowed opacity-70'
                    }`}
                  >
                    {role === 'guest' ? 'Войдите для отзыва' : 'Опубликовать'}
                  </button>
                </div>
              </div>

              {/* Unified ReviewsSection Component */}
              <ReviewsSection
                reviews={jamReviews}
                currentUserId={currentUserId}
                role={role}
                gameAuthorName={data.authors?.[0]?.name || 'NocturnalDevs'}
                hideTitle
                onReply={(reviewId, text) => {
                  setJamReviews(prev => prev.map(r => r.id === reviewId ? {
                    ...r,
                    developerResponse: {
                      id: Date.now(),
                      author: data.authors?.[0]?.name || 'NocturnalDevs',
                      date: 'Только что',
                      text,
                    }
                  } : r));
                  triggerToast('Ответ опубликован!', 'success');
                }}
                onVote={(reviewId) => {
                  triggerToast('+1', 'info');
                }}
                onEdit={(reviewId) => {
                  triggerToast('Редактирование комментария', 'info');
                }}
                onDelete={(reviewId) => {
                  setJamReviews(prev => prev.filter(r => r.id !== reviewId));
                  triggerToast('Комментарий удален', 'success');
                }}
                onReport={(reviewId) => {
                  triggerToast('Жалоба отправлена модераторам', 'success');
                }}
                triggerToast={triggerToast}
              />
            </div>
          </div>

          {/* БЛОК 2: САЙДБАР СПРАВА */}
          <aside className="w-full flex flex-col gap-6 text-sm text-textPrimary order-2 lg:col-start-2 lg:row-start-1 lg:row-span-2">

            {/* 1. БЛОК ДЕЙСТВИЙ (CTA CARD) */}
            <div className="bg-surface-1 border border-borderDef rounded-card p-5 shadow-elevation-base flex flex-col gap-4">

              {/* Плашка доступа жюри */}
              {role === 'judge' && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-control bg-accent/10 border border-accent/20 text-accent text-xs font-mono">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span className="leading-tight">Временный доступ жюри (JamAccessGrant)</span>
                </div>
              )}

              {/* ЦЕННИК / СТАТУС ДЖЕМА */}
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-success font-mono">Бесплатно</div>
                <span className="bg-accent/10 text-accent border border-accent/20 px-2 py-0.5 text-xs font-semibold rounded-control uppercase font-mono">
                  Jam Entry
                </span>
              </div>

              {/* КНОПКИ ДЕЙСТВИЯ */}
              <div className="flex flex-col gap-2">
                <Button
                  variant="primary"
                  fullWidth
                  size="lg"
                  icon={<Play className="w-4 h-4 fill-current" />}
                  onClick={() => setIsPlayerActive(true)}
                  className="font-sans uppercase tracking-wider font-extrabold"
                >
                  {jamState === 'active_locked' ? 'ЗАПУСТИТЬ SNAPSHOT' : 'ЗАПУСТИТЬ WEBGL'}
                </Button>

                <div className="relative w-full">
                  <Button
                    variant="secondary"
                    fullWidth
                    size="md"
                    icon={<Download className="w-4 h-4" />}
                    onClick={() => setIsBuildsOpen(!isBuildsOpen)}
                    className="justify-between"
                  >
                    <span className="flex-1 text-left">{jamState === 'active_locked' ? 'Снапшоты джема' : 'Скачать игру'}</span>
                    <ChevronDown className={`w-4 h-4 text-textTertiary transition-transform duration-200 ${isBuildsOpen ? 'rotate-180' : ''}`} />
                  </Button>

                  {isBuildsOpen && (
                    <div className="absolute mt-2 w-full bg-surface-3 border border-borderDef rounded-card py-1.5 shadow-elevation-raised z-50 flex flex-col animate-fadeIn">
                      {jamState === 'active_locked' ? (
                        <button
                          onClick={() => { setIsBuildsOpen(false); triggerToast("Загрузка Jam Snapshot: Windows Build (120 MB)", "success"); }}
                          className="text-left px-5 py-3 hover:bg-surface-2 text-textSecondary hover:text-accent text-sm flex justify-between group transition-colors font-sans focus:outline-none border-l-2 border-transparent hover:border-accent"
                        >
                          <span className="flex flex-col gap-0.5">
                            <span className="font-bold">Windows x64 (Snapshot)</span>
                            <span className="text-[10px] uppercase font-mono tracking-wider opacity-60">Заморожено 12.07.2026</span>
                          </span>
                          <span className="font-mono text-textDisabled group-hover:text-accent/70 mt-1">120 MB</span>
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => { setIsBuildsOpen(false); triggerToast("Началось скачивание Windows Build (120 MB)", "success"); }}
                            className="text-left px-5 py-3 hover:bg-surface-2 text-textSecondary hover:text-textPrimary text-sm flex justify-between group transition-colors font-sans focus:outline-none"
                          >
                            <span>Windows x64 Build</span>
                            <span className="font-mono text-textDisabled group-hover:text-textTertiary">120 MB</span>
                          </button>
                          <button
                            onClick={() => { setIsBuildsOpen(false); triggerToast("Началось скачивание Web Build (45 MB)", "success"); }}
                            className="text-left px-5 py-3 hover:bg-surface-2 text-textSecondary hover:text-textPrimary text-sm flex justify-between group transition-colors font-sans focus:outline-none"
                          >
                            <span>Standalone Web Build</span>
                            <span className="font-mono text-textDisabled group-hover:text-textTertiary">45 MB</span>
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {jamState === 'active_locked' && (
                  <div className="w-full mt-1 p-3 bg-warning/5 border border-warning/20 rounded-control flex items-start space-x-2">
                    <Lock className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                    <span className="text-[11px] font-sans text-warning leading-relaxed">
                      Доступ к новым версиям (после 12.07.2026) заблокирован для чистоты голосования. Доступны только Snapshot-сборки.
                    </span>
                  </div>
                )}
              </div>

              {/* Вторичные действия */}
              <div className="flex items-center gap-2 mt-1">
                <Button
                  variant="outline"
                  fullWidth
                  icon={<Heart className="w-3.5 h-3.5" />}
                  onClick={() => triggerToast("Добавлено в избранное", "success")}
                >
                  В избранное
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  icon={<Bookmark className={`w-3.5 h-3.5 ${isCollected ? 'text-accent fill-accent' : ''}`} />}
                  onClick={() => setIsAddToCollectionModalOpen(true)}
                >
                  В коллекцию
                </Button>
                <Button
                  variant="outline"
                  icon={<Share2 className="w-3.5 h-3.5" />}
                  onClick={handleCopyLink}
                  aria-label="Поделиться"
                />
              </div>

              {/* Поддержка автора */}
              <div className="mt-2">
                <Button
                  variant="secondary"
                  fullWidth
                  size="md"
                  icon={<Heart className="w-4 h-4 text-reaction" />}
                  onClick={() => setIsDonationDrawerOpen(true)}
                  className="border-reaction/30 bg-reaction/10 text-reaction hover:bg-reaction/20 font-medium cursor-pointer transition-colors"
                >
                  Поддержать автора
                </Button>
              </div>

              {/* Подписка на игру / обновления */}
              <div className="mt-2.5">
                <Button
                  variant={isGameSubscribed ? "secondary" : "outline"}
                  fullWidth
                  size="md"
                  onClick={handleToggleGameSubscription}
                  icon={isGameSubscribed ? <Check className="w-4 h-4 text-accent" /> : <Bell className="w-4 h-4 text-textTertiary" />}
                  className={isGameSubscribed ? "border-accent/40 bg-accent/10 text-accent font-medium shadow-sm" : "border-borderDef text-textSecondary hover:text-textPrimary hover:bg-surface-2"}
                >
                  {isGameSubscribed ? `Подписка на игру активна (${gameSubscribersCount})` : `Подписаться на обновления (${gameSubscribersCount})`}
                </Button>
                <p className="text-[11px] text-textTertiary mt-1 px-1">
                  Оповещения о версиях, патчах и итогах джема
                </p>
              </div>

            </div>

            {/* БЛОК ИТОГОВ ГЕЙМДЖЕМА В САЙДБАРЕ (Прогрессивное раскрытие + Динамический тематизм) */}
            {/* БЛОК ИТОГОВ ГЕЙМДЖЕМА В САЙДБАРЕ (Прогрессивное раскрытие + Динамический тематизм) */}
            {jamState === 'results' && (() => {
              const theme = RANK_THEMES[jamRank] || RANK_THEMES[1];

              const filteredEvaluations = MOCK_JAM_RESULTS_DATA.evaluations.filter(e => {
                if (sidebarJuryFilter === 'public') return !e.is_private;
                if (sidebarJuryFilter === 'private') return e.is_private;
                return true;
              });

              return (
                <div className="bg-surface-1 border border-borderDef rounded-card p-5 flex flex-col shadow-elevation-card relative overflow-hidden transition-all duration-300 ease-in-out animate-fadeIn">
                  
                  {/* Атмосферное свечение сверху */}
                  <div className={`absolute top-0 inset-x-0 h-28 ${theme.glow} opacity-30 blur-2xl pointer-events-none transition-colors duration-500`} />

                  {/* HEADER: Название джема + кнопка диплома */}
                  <div className="flex items-center justify-between pb-5 border-b border-borderDef/60 mb-6 relative z-10">
                    <div className={`flex items-center gap-2.5 transition-colors duration-300 ${theme.text}`}>
                      <div className="w-8 h-8 rounded-control bg-surface-2 border border-borderDef flex items-center justify-center shrink-0">
                        <Trophy className="w-4 h-4 fill-current" />
                      </div>
                      <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-textPrimary">
                        {MOCK_JAM_RESULTS_DATA.jam.title || 'Cyberjam 2026'}
                      </h2>
                    </div>
                    
                    <button 
                      type="button"
                      onClick={() => setIsDiplomaModalOpen(true)}
                      className={`text-xs font-bold font-mono transition-all flex items-center gap-1.5 px-3 py-1.5 rounded-control bg-surface-2 hover:bg-surface-3 border border-borderDef cursor-pointer ${theme.text} hover:brightness-125 active:scale-95`}
                    >
                      <span>Диплом</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* КЛЮЧЕВЫЕ МЕТРИКИ: Место + Средний балл */}
                  <div className="grid grid-cols-2 gap-3 mb-6 relative z-10">
                    <div className="flex flex-col gap-1 bg-surface-2/80 border border-borderDef/70 p-4 rounded-card">
                      <span className="text-[11px] text-textTertiary font-mono uppercase tracking-wider">Итоговое место</span>
                      <div className={`text-3xl font-extrabold tracking-tight leading-none transition-colors duration-300 ${theme.text}`}>
                        #{jamRank}<span className="text-sm text-textDisabled font-normal ml-1 font-mono">/ 120</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1 bg-surface-2/80 border border-borderDef/70 p-4 rounded-card">
                      <span className="text-[11px] text-textTertiary font-mono uppercase tracking-wider">Средний балл</span>
                      <div className={`text-3xl font-extrabold tracking-tight leading-none flex items-center gap-1.5 transition-colors duration-300 ${theme.text}`}>
                        <Star className="w-5 h-5 fill-current shrink-0" />
                        <span>{theme.score.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* 5 КРИТЕРИЕВ: Прогресс-бары */}
                  <div className="flex flex-col gap-3.5 mb-6 p-4 bg-surface-2/50 border border-borderDef/60 rounded-card relative z-10">
                    <span className="text-[11px] font-mono text-textTertiary uppercase tracking-wider font-bold">Оценки по критериям:</span>
                    {[
                      { label: 'Геймплей', val: theme.criteria.gameplay },
                      { label: 'Тема', val: theme.criteria.theme },
                      { label: 'Графика', val: theme.criteria.graphics },
                      { label: 'Звук', val: theme.criteria.sound },
                      { label: 'Инновации', val: theme.criteria.originality }
                    ].map(crit => {
                      const pct = (crit.val / 5.0) * 100;
                      return (
                        <div key={crit.label} className="flex flex-col gap-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-textSecondary font-medium">{crit.label}</span>
                            <span className="font-mono text-textPrimary font-bold">{crit.val.toFixed(1)} / 5</span>
                          </div>
                          <div className="w-full h-1.5 bg-surface-3 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-500 ease-out bg-accent" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* ЖЮРИ АККОРДЕОН: Фильтр-табы + Раскрывающиеся карточки */}
                  <div className="pt-5 border-t border-borderDef/60 relative z-10">
                    
                    {/* Segmented filter */}
                    <div className="flex gap-4 border-b border-borderDef/60 mb-3 select-none">
                      {[
                        { id: 'all' as const, label: 'Все рецензии' },
                        { id: 'public' as const, label: 'Открытые' },
                        { id: 'private' as const, label: 'Приватные' }
                      ].map(tab => (
                        <button 
                          key={tab.id}
                          type="button"
                          onClick={() => setSidebarJuryFilter(tab.id)} 
                          className={`pb-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-colors relative focus:outline-none cursor-pointer
                            ${sidebarJuryFilter === tab.id ? 'text-accent' : 'text-textTertiary hover:text-textSecondary'}`}
                        >
                          {tab.label}
                          {sidebarJuryFilter === tab.id && (
                            <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-accent transition-colors duration-300" />
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Judges Roster Accordion */}
                    <div className="flex flex-col gap-2">
                      {filteredEvaluations.length > 0 ? (
                        filteredEvaluations.map(e => {
                          const isOpen = expandedJudgeId === e.evaluation_id;
                          const isPrivateForUser = e.is_private && role !== 'author' && role !== 'judge' && role !== 'admin';

                          return (
                            <div 
                              key={e.evaluation_id} 
                              onClick={() => setExpandedJudgeId(isOpen ? null : e.evaluation_id)}
                              className="group flex flex-col p-3 bg-surface-2/60 hover:bg-surface-2 border border-borderDef/60 rounded-card transition-all cursor-pointer"
                            >
                              {/* Row Header */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <img src={e.judge.avatar} alt={e.judge.nick} className="w-8 h-8 rounded-full object-cover bg-surface-3 border border-borderDef" />
                                  <div className="flex flex-col">
                                    <span className="text-xs font-bold text-textPrimary leading-tight group-hover:text-accent transition-colors">
                                      {e.judge.nick}
                                    </span>
                                    <span className="text-[11px] text-textTertiary font-mono">
                                      {e.judge.specialization}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2.5">
                                  <span className="text-xs font-mono font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-control border border-accent/20">
                                    ★ {e.weighted_score.toFixed(2)}
                                  </span>
                                  <ChevronDown className={`w-4 h-4 text-textTertiary group-hover:text-textPrimary transition-all duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                                </div>
                              </div>

                              {/* Collapsible Content */}
                              <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-3 pt-3 border-t border-borderDef/50' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
                                <div className="overflow-hidden space-y-3">
                                  
                                  {/* Criteria Chips */}
                                  <div className="flex flex-wrap gap-1.5">
                                    {[
                                      { key: 'gameplay', label: 'Геймплей' },
                                      { key: 'theme', label: 'Тема' },
                                      { key: 'sound', label: 'Звук' }
                                    ].map(chip => (
                                      <span key={chip.key} className="text-[11px] font-mono bg-surface-3 border border-borderDef text-textSecondary px-2 py-0.5 rounded-control">
                                        {chip.label}: <strong className="text-textPrimary">{(e.scores as any)[chip.key].toFixed(1)}</strong>
                                      </span>
                                    ))}
                                  </div>

                                  {/* Comment Block */}
                                  <div className="p-3 bg-surface-3/60 rounded-control border border-borderDef/40">
                                    {isPrivateForUser ? (
                                      <div className="flex items-center gap-2 text-textDisabled text-xs">
                                        <Lock className="w-3.5 h-3.5 shrink-0" />
                                        <span>Приватная заметка (скрыто)</span>
                                      </div>
                                    ) : e.is_private ? (
                                      <div className="flex items-start gap-2 text-danger text-xs">
                                        <Shield className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                        <span>{e.jury_comment}</span>
                                      </div>
                                    ) : (
                                      <p className="text-xs text-textSecondary leading-relaxed italic">
                                        "{e.jury_comment}"
                                      </p>
                                    )}
                                  </div>

                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="py-6 text-center text-xs text-textTertiary font-mono">
                          Нет рецензий, подходящих под фильтр.
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              );
            })()}

            {jamState === 'active_locked' && (
              <div className="bg-surface-1 border border-borderDef rounded-card p-5 shadow-elevation-card relative overflow-hidden transition-all duration-200">
                <div className="flex items-center justify-between mb-4 relative z-10 select-none">
                  <span className="text-accent font-bold text-xs uppercase tracking-wider font-mono flex items-center gap-2">
                    <Swords className="w-4 h-4" /> Участник Cyberjam 2026
                  </span>
                  <span className="text-xs bg-surface-2 text-accent border border-accent/20 font-mono px-2.5 py-0.5 rounded-control font-bold uppercase tracking-wide">
                    Оценка
                  </span>
                </div>

                <p className="text-xs text-textSecondary font-sans leading-relaxed mb-4 relative z-10">
                  Проект принимает участие в Cyberjam 2026. Оценки жюри формируют общий рейтинг и влияют на победу в номинациях.
                </p>

                <hr className="border-borderDef/60 mb-4 relative z-10" />

                {role === 'judge' ? (
                  isRecused ? (
                    <div className="relative z-10 flex items-start gap-3 bg-danger/10 border border-danger/30 p-4 rounded-card select-none animate-fadeIn">
                      <AlertOctagon className="w-4 h-4 text-danger shrink-0 mt-0.5" />
                      <div className="flex flex-col gap-1.5">
                        <span className="text-xs text-danger font-bold font-sans uppercase tracking-wider">Заявлен конфликт интересов (Recusal)</span>
                        <span className="text-[11px] text-danger/80 leading-relaxed font-sans">
                          Вы отказались от оценки данной заявки. Ваши оценки аннулированы, и вы не будете учитываться при расчете среднего балла для этой работы.
                        </span>
                        <button
                          onClick={() => setIsRecused(false)}
                          className="text-xs text-danger hover:text-danger/80 font-bold underline mt-1 w-max cursor-pointer"
                        >
                          Отменить самоотвод
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative z-10 space-y-4">
                      <div className="flex items-center justify-between select-none">
                        <span className="text-xs font-mono text-textTertiary uppercase tracking-wider font-bold">Оценочная карта жюри:</span>
                        {avgScore && (
                          <span className="text-xs font-mono text-accent bg-accent/10 border border-accent/25 px-2 py-0.5 rounded-control font-bold animate-fadeIn">
                            Ср. балл: {avgScore}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-3 bg-surface-2/70 border border-borderDef/60 p-4 rounded-card">
                        {[
                          { id: 'gameplay', label: 'Геймплей', desc: 'Управление, механики и динамика O2' },
                          { id: 'graphics', label: 'Графика', desc: 'Атмосфера, шейдеры O2 и свет' },
                          { id: 'theme', label: 'Соответствие теме', desc: 'Клаустрофобия и Sci-Fi сеттинг' }
                        ].map(crit => {
                          const currentRating = jamRatings[crit.id as keyof typeof jamRatings];
                          const currentHover = jamRatingsHover[crit.id as keyof typeof jamRatingsHover];
                          return (
                            <div key={crit.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 gap-2">
                              <div className="flex flex-col">
                                <span className="text-xs text-textPrimary font-sans font-bold">{crit.label}</span>
                                <span className="text-[11px] text-textTertiary font-sans">{crit.desc}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex gap-1 select-none">
                                  {[1, 2, 3, 4, 5].map(star => (
                                    <Star
                                      key={star}
                                      onMouseEnter={() => setJamRatingsHover(prev => ({ ...prev, [crit.id]: star }))}
                                      onMouseLeave={() => setJamRatingsHover(prev => ({ ...prev, [crit.id]: 0 }))}
                                      onClick={() => {
                                        setJamRatings(prev => ({ ...prev, [crit.id]: star }));
                                        triggerToast(`Категория «${crit.label}» оценена на ${star}/5`, 'success');
                                      }}
                                      className={`w-4 h-4 cursor-pointer transition-colors duration-100 ${star <= (currentHover || currentRating)
                                          ? 'text-accent fill-accent'
                                          : 'text-surface-3 fill-surface-3 hover:text-textTertiary'
                                        }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs font-mono text-accent font-bold w-4 text-right">
                                  {currentRating > 0 ? currentRating : '—'}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex items-center gap-3">
                        <Button
                          variant="primary"
                          fullWidth
                          size="md"
                          onClick={() => triggerToast("Вердикт жюри успешно сохранен!", "success")}
                          className="font-sans font-bold uppercase tracking-wider text-xs"
                        >
                          Сохранить вердикт
                        </Button>
                        <button
                          onClick={() => {
                            setIsRecused(true);
                            jamOrganizerService.declareJudgeConflict(
                              'jam-123',
                              'judge-usr-01',
                              data.id || 'sub-1',
                              'Самоотвод судьи по причине конфликта интересов'
                            );
                            triggerToast("Оформлен самоотвод (COI Recusal). Оценки исключены из расчета.", "warning");
                          }}
                          className="px-4 py-2.5 bg-transparent border border-danger/40 hover:bg-danger/10 text-danger text-xs font-bold uppercase tracking-wider rounded-card transition-all active:scale-95 cursor-pointer shrink-0 flex items-center justify-center"
                          title="Конфликт интересов: отказаться от оценки"
                        >
                          <Flag className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="relative z-10 flex items-start gap-3 bg-surface-2/60 border border-borderDef/60 p-4 rounded-card select-none animate-fadeIn">
                    <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-textPrimary font-bold font-sans">Идет голосование экспертов</span>
                      <span className="text-[11px] text-textTertiary leading-relaxed font-sans">
                        Оценки жюри скрыты до окончания этапа судейства. Итоговый протокол и результаты номинаций Cyberjam 2026 будут опубликованы на церемонии закрытия.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. БЛОК МЕТАДАННЫХ И РАЗРАБОТЧИКА (DE-BOXED) */}
            <div className="flex flex-col gap-6 pt-2">
              {/* FE-ACC-011: USER FOLLOW (SC-ACC-026, BR-ACC-067) */}
              <div className="group flex items-center justify-between hover:bg-surface-1 p-3 -mx-3 rounded-card transition-colors border border-transparent hover:border-borderDef/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-surface-3 border border-borderDef overflow-hidden flex items-center justify-center shadow-sm">
                    {data.authors?.[0]?.avatar ? (
                      <img src={data.authors[0].avatar} alt={data.authors[0].name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-textTertiary" />
                    )}
                  </div>
                  <div>
                    <div className="text-base font-bold text-textPrimary group-hover:text-accent transition-colors">{data.authors?.[0]?.name || 'Unknown'}</div>
                    <div className="text-sm text-textTertiary">{data.authors?.[0]?.role || 'Разработчик'}</div>
                  </div>
                </div>
                <Button
                  variant={isAuthorFollowed ? "secondary" : "outline"}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleAuthorFollow();
                  }}
                  icon={isAuthorFollowed ? <Check className="w-3.5 h-3.5 text-accent" /> : <Plus className="w-3.5 h-3.5" />}
                  className={isAuthorFollowed ? "text-accent border-accent/30 bg-accent/10 text-xs font-medium" : "text-xs"}
                >
                  {isAuthorFollowed ? 'Вы подписаны' : 'Подписаться'}
                </Button>
              </div>

              <div className="flex flex-col gap-3.5 text-sm px-1">
                <div className="flex justify-between items-center">
                  <span className="text-textTertiary">Джем</span>
                  <span className="font-sans font-semibold text-accent">{data.jamName || 'Cyberjam 2026'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-textTertiary">Релиз</span>
                  <span className="font-mono text-textPrimary">17.07.2026</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-textTertiary">Версия</span>
                  <span className="font-mono text-textPrimary">{data.versions || 'v1.0.0'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-textTertiary">Платформы</span>
                  <div className="flex items-center gap-3 text-textSecondary">
                    <span title="WebGL"><Play className="w-4 h-4 fill-current" /></span>
                    <span title="Windows"><Monitor className="w-4 h-4" /></span>
                    <span title="macOS"><div className="w-4 h-4 border border-current rounded-full" /></span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-textTertiary">Языки</span>
                  <span className="text-textPrimary text-right">Русский, Английский</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-textTertiary">Возраст</span>
                  <span className="text-textPrimary bg-surface-2 border border-borderDef px-1.5 py-0.5 rounded text-xs font-mono">12+</span>
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-2 px-1">
                {/* Соавторы если их несколько */}
                {data.authors && data.authors.length > 1 && (
                  <div className="flex flex-col gap-2 pt-2 border-t border-borderDef/50">
                    <span className="text-xs font-bold text-textDisabled uppercase tracking-wider font-mono">
                      Команда проекта ({data.authors.length})
                    </span>
                    <div className="flex items-center space-x-2">
                      {data.authors.map((author) => (
                        <div key={author.id} className="relative group cursor-pointer">
                          <img
                            src={author.avatar}
                            className="w-10 h-10 rounded-full object-cover border border-borderDef group-hover:ring-2 group-hover:ring-accent transition-all shadow-sm bg-surface-2"
                            alt={author.name}
                          />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-surface-3/95 backdrop-blur-md border border-borderDef p-2 rounded-card opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 shadow-xl z-50 min-w-[150px] text-center font-sans">
                            <div className="text-xs font-bold text-textPrimary">{author.name}</div>
                            <div className="text-[11px] font-mono text-textTertiary">{author.role || 'Разработчик'}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-card bg-surface-0 hover:bg-surface-1 font-medium text-xs"
                    icon={<Mail className="w-3.5 h-3.5 text-accent" />}
                    onClick={() => setIsContactModalOpen(true)}
                  >
                    Связаться
                  </Button>
                  <Button variant="outline" className="rounded-card bg-surface-0 hover:bg-surface-1 px-3 text-xs" icon={<ExternalLink className="w-3.5 h-3.5" />}>Сайт</Button>
                  <Button variant="outline" className="rounded-card bg-surface-0 hover:bg-surface-1 px-3 text-xs" icon={<ExternalLink className="w-3.5 h-3.5" />}>VK</Button>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-borderDef/60 mt-1">
                  <button
                    type="button"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-card border border-borderDef hover:border-danger/40 hover:bg-danger/10 text-xs font-semibold text-textSecondary hover:text-danger transition-all group cursor-pointer"
                    onClick={() => setIsBugReportDrawerOpen(true)}
                  >
                    <Bug className="w-3.5 h-3.5 text-danger group-hover:scale-110 transition-transform" />
                    <span>Сообщить о баге</span>
                  </button>

                  {!isOwner && (
                    hasReportedGame ? (
                      <div className="text-xs text-success flex items-center gap-1.5 font-sans px-2">
                        <Check className="w-3.5 h-3.5 stroke-[1.5]" />
                        <span>Жалоба отправлена</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => setIsReportModalOpen(true)}
                        className="py-2.5 px-3 rounded-card border border-borderDef hover:border-borderStrong hover:bg-surface-2 text-xs text-textTertiary hover:text-textPrimary flex items-center gap-1.5 transition-all focus:outline-none cursor-pointer font-sans"
                        title="Пожаловаться модераторам"
                      >
                        <Flag className="w-3.5 h-3.5 stroke-[1.5]" />
                        <span>Жалоба</span>
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>

          </aside>

        </div>

        {/* 8. БЛОКИ РЕКОМЕНДАЦИЙ (CROSS-DISCOVERY) */}
        <div className="mt-20 border-t border-borderDef pt-10 flex flex-col gap-12">
          <section>
            <h2 className="text-xl font-bold text-textPrimary mb-6 flex items-center gap-2 font-sans">
              Другие игры с {data.jamName || 'Cyberjam 2026'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <MarketGameCard
                id="m1" title="Cyber Hunter" coverUrl="/mocks/cover1.jpg"
                developer={{ name: 'IndieDev', avatarUrl: null }}
                price={0} rating={4.5} reviewsCount={120} platforms={['webgl']}
              />
              <MarketGameCard
                id="m2" title="Space Mining" coverUrl="/mocks/cover2.jpg"
                developer={{ name: 'Nebula', avatarUrl: null }}
                price={0} rating={4.2} reviewsCount={45} platforms={['windows']}
              />
              <MarketGameCard
                id="m3" title="Neon Drift" coverUrl="/mocks/cover3.jpg"
                developer={{ name: 'NeonStudios', avatarUrl: null }}
                price={0} rating={4.8} reviewsCount={300} platforms={['windows', 'mac_os']}
              />
              <MarketGameCard
                id="m4" title="Pixel Quest" coverUrl={null}
                developer={{ name: 'PixelArt', avatarUrl: null }}
                price={0} rating={4.1} reviewsCount={10} platforms={['webgl']}
              />
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-textPrimary flex items-center gap-2 font-sans">
                Другие игры от <span className="text-accent hover:underline cursor-pointer ml-1">{data.authors?.[0]?.name || 'автора'}</span>
              </h2>
              <Button variant="ghost" className="hidden sm:flex">Все игры автора</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* @ts-ignore */}
              <MarketGameCard id="m5" title="Older Project" coverUrl="/mocks/cover2.jpg" developer={{ name: data.authors?.[0]?.name || 'Автор', avatarUrl: null }} price={0} rating={4.0} reviewsCount={50} platforms={['webgl']} />
            </div>
          </section>
        </div>

      </main>



      {/* ================= 5. МОДАЛЬНОЕ ОКНО "СЕРТИФИКАТ И ДИПЛОМ ПРИЗЕРА" (JamDiplomaModal — Динамический тематизм) ================= */}
      {isDiplomaModalOpen && (() => {
        const theme = RANK_THEMES[jamRank] || RANK_THEMES[1];
        return (
          <div 
            onClick={() => setIsDiplomaModalOpen(false)}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm z-modal flex items-center justify-center p-4 animate-fadeIn select-none"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="bg-surface-4 border border-borderStrong rounded-modal max-w-[620px] w-full p-6 md:p-8 flex flex-col shadow-2xl relative overflow-hidden transition-all duration-300"
            >
              {/* Ambient Modal Glow (Динамический цвет металла) */}
              <div className={`absolute top-0 right-0 w-72 h-72 blur-3xl pointer-events-none rounded-full transition-colors duration-500 ${theme.glow}`} />

              <button 
                type="button"
                onClick={() => setIsDiplomaModalOpen(false)}
                className="absolute top-4 right-4 p-2 bg-surface-2 hover:bg-surface-3 rounded-full text-textTertiary hover:text-textPrimary transition-colors z-20 focus:outline-none cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className={`border ${theme.borderSubtle} bg-surface-0 p-8 md:p-10 rounded-card flex flex-col items-center text-center gap-6 relative z-10 transition-colors duration-500`}>
                
                <div className={`w-16 h-16 rounded-full border flex items-center justify-center transition-colors duration-500 ${theme.glow} ${theme.borderSubtle}`}>
                  <Trophy className={`w-8 h-8 fill-current opacity-90 transition-colors duration-500 ${theme.text}`} />
                </div>

                <div className="flex flex-col gap-2">
                  <span className={`text-xs font-mono uppercase font-bold tracking-widest flex items-center justify-center gap-1.5 transition-colors duration-500 ${theme.text}`}>
                    <Sparkles className="w-3.5 h-3.5" /> Официальный диплом
                  </span>
                  <h3 className="text-3xl font-bold text-textPrimary tracking-tight">
                    {MOCK_JAM_RESULTS_DATA.jam.title || 'Cyberjam 2026'}
                  </h3>
                </div>

                <div className={`w-16 h-[1px] transition-colors duration-500 ${theme.borderSubtle}`} />

                <p className="text-[15px] text-textSecondary max-w-[480px] leading-relaxed">
                  Настоящий сертификат подтверждает, что проект <span className="text-textPrimary font-semibold">«{data.title}»</span> команды <span className="text-textPrimary font-semibold">NocturnalDevs</span> занял <span className={`font-bold transition-colors duration-500 ${theme.text}`}>{jamRank} место</span> среди 120 участников со средним баллом <span className="font-mono text-textPrimary font-semibold">{theme.score.toFixed(2)} / 5.00</span>.
                </p>

                <div className="grid grid-cols-2 gap-4 w-full mt-6 pt-6 border-t border-borderDef text-xs font-medium text-textTertiary">
                  <div className="text-left flex flex-col gap-1">
                    <span>Председатель жюри:</span>
                    <div className="text-textPrimary font-semibold font-sans">AlexGameDev</div>
                  </div>
                  <div className="text-right flex flex-col gap-1">
                    <span>Дата выдачи:</span>
                    <div className="text-textPrimary font-mono">10.08.2026</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 mt-6 select-none relative z-10">
                <span className="text-xs font-mono text-textDisabled">ID: CERT-2026-HUBIGR-9012</span>
                
                <button 
                  type="button"
                  onClick={() => {
                    triggerToast("Загрузка диплома в формате PDF началась...", "success");
                    setIsDiplomaModalOpen(false);
                  }}
                  className={`text-white font-bold px-6 py-3 rounded-control text-[13px] uppercase tracking-wider flex items-center gap-2 transition-all duration-300 active:scale-95 focus:outline-none cursor-pointer ${theme.bg} ${theme.hoverBg}`}
                >
                  <Download className="w-4 h-4" />
                  Скачать PDF
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* ================= DONATION DRAWER ================= */}
      <DonationDrawer
        isOpen={isDonationDrawerOpen}
        onClose={() => setIsDonationDrawerOpen(false)}
        recipientName={data.authors?.[0]?.name || 'Автор'}
        role={role}
        triggerToast={triggerToast}
      />

      {/* DRAWER: СООБЩИТЬ О ПРОБЛЕМЕ (FE-BUG-001, FE-BUG-002, FE-BUG-009) */}
      <BugReportDrawer
        isOpen={isBugReportDrawerOpen}
        onClose={() => setIsBugReportDrawerOpen(false)}
        role={role}
        gameTitle={data.title}
        gameId={data.id?.toString() || 'jam-g1'}
        detectedVersion="v1.0.0-jam"
        triggerToast={triggerToast}
      />

      {/* --- ADD TO COLLECTION MODAL --- */}
      <AddToCollectionModal
        isOpen={isAddToCollectionModalOpen}
        game={{ id: data.id, title: data.title, cover: data.cover }}
        collections={mockCollections}
        role={role}
        onClose={() => setIsAddToCollectionModalOpen(false)}
        onSave={(gameId, collectionIds) => {
          setIsCollected(collectionIds.length > 0);
        }}
        triggerToast={triggerToast}
      />

      {/* --- QUICKPLAY WEBGL DRAWER --- */}
      <QuickPlayDrawer
        isOpen={isPlayerActive}
        game={{
          id: data.id,
          title: data.title,
          author: data.authors?.[0]?.name || 'Автор',
          cover: data.cover,
          slug: 'brokenlore-follow',
          latest_version: 'v1.0.2',
          jam_title: 'Cyberjam 2026',
          controls: 'WASD — передвижение, Пробел — прыжок, ЛКМ — прожектор/действие, Esc — пауза'
        }}
        onClose={() => setIsPlayerActive(false)}
        onOpenCollectionModal={() => setIsAddToCollectionModalOpen(true)}
        onOpenDonationDrawer={() => setIsDonationDrawerOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        triggerToast={triggerToast}
      />

      {/* --- REPORT CONTENT MODAL --- */}
      <ReportContentModal
        isOpen={isReportModalOpen}
        game={{ id: data.id, title: data.title }}
        onClose={() => setIsReportModalOpen(false)}
        onSuccessfulSubmit={() => setHasReportedGame(true)}
        triggerToast={triggerToast}
        role={role}
      />

      {/* CONTACT CREATOR / TEAM MODAL (FE-CSP-009, AC-CSP-009, AC-CSP-010) */}
      <ContactRequestModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        ownerType="user"
        ownerName={data.authors?.[0]?.name || 'NocturnalDevs'}
        teamContacts={{
          email: 'team@nocturnal.games',
          telegram: '@nocturnal_biz',
          website: 'https://nocturnal.games',
          vk: 'https://vk.com/nocturnal'
        }}
        triggerToast={triggerToast}
      />

      {/* =========================================================================
          MOBILE CONTEXTUAL STICKY CTA (Floating Pill)
          ========================================================================= */}
      <div className={`fixed bottom-[84px] left-4 right-4 z-40 flex md:hidden transition-all duration-300 ${
        showMobileStickyCta ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-8 opacity-0 pointer-events-none'
      }`}>
        <div className="w-full bg-surface-1/95 backdrop-blur-xl border border-borderDef shadow-[0_8px_32px_rgba(0,0,0,0.6)] rounded-modal p-2.5 flex items-center justify-between gap-2.5">
          <div className="flex-1 min-w-0">
            <button 
              onClick={() => {
                setIsPlayerActive(true);
              }}
              className="w-full h-11 bg-accent hover:bg-accent-hover text-white font-extrabold text-[13px] tracking-wide rounded-card flex items-center justify-center gap-2 cursor-pointer touch-manipulation active:scale-[0.98] shadow-sm uppercase"
            >
              <Play className="w-4 h-4 fill-current shrink-0" />
              <span className="truncate">{jamState === 'active_locked' ? 'Snapshot' : 'Играть'}</span>
            </button>
          </div>
          <button 
            onClick={() => setIsAddToCollectionModalOpen(true)}
            className="h-11 w-11 shrink-0 bg-surface-2 hover:bg-surface-3 border border-borderDef text-textSecondary rounded-card flex items-center justify-center cursor-pointer touch-manipulation active:scale-[0.98]"
            aria-label="В коллекцию"
          >
            <Bookmark className={`w-4 h-4 ${isCollected ? 'text-accent fill-accent' : 'text-textTertiary'}`} />
          </button>
          <button
            onClick={() => setIsDonationDrawerOpen(true)}
            className="h-11 w-11 shrink-0 bg-surface-2 hover:bg-surface-3 border border-borderDef text-reaction rounded-card flex items-center justify-center cursor-pointer touch-manipulation active:scale-[0.98]"
            aria-label="Поддержать автора"
            title="Поддержать автора"
          >
            <Heart className="w-4 h-4 text-reaction" />
          </button>
          <button 
            onClick={handleCopyLink}
            className="h-11 w-11 shrink-0 bg-surface-2 hover:bg-surface-3 border border-borderDef text-textSecondary rounded-card flex items-center justify-center cursor-pointer touch-manipulation active:scale-[0.98]"
            aria-label="Поделиться"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* --- JAM APPEAL DRAWER (BR-JORG-059) --- */}
      <JamAppealDrawer
        isOpen={isAppealDrawerOpen}
        onClose={() => {
          setIsAppealDrawerOpen(false);
          if (window.location.hash.includes('appeal=true')) {
            window.location.hash = window.location.hash.replace('?appeal=true', '').replace('&appeal=true', '');
          }
        }}
        jamId={data.jamName || 'cyberjam'}
        gameId={data.id}
        triggerToast={triggerToast}
      />

      {/* --- JAM PRIZE DISPUTE DRAWER (BR-JORG-023) --- */}
      <JamPrizeDisputeDrawer
        isOpen={isDisputeDrawerOpen}
        onClose={() => setIsDisputeDrawerOpen(false)}
        jamId={data.jamName || 'cyberjam'}
        gameId={data.id}
        triggerToast={triggerToast}
        prizeAmount={jamRank === 1 ? '100,000 RUB' : jamRank === 2 ? '50,000 RUB' : 'Лицензия Unity Pro'}
      />
    </div>
  );
}