import { 
  Eye, Download, Users, Wallet, Plus, FileText, ChevronDown, AlertTriangle, 
  XCircle, ShieldAlert, Bug, MessageSquare, UserPlus, Clock, Rocket, AlertCircle, 
  RefreshCw, FolderKanban, User, ArrowUpRight, Filter, Search, Check, CheckCircle2, 
  X, MoreVertical, Edit, ExternalLink, Trash2, ArrowRight, Layers, DollarSign, 
  Settings, Lock, HelpCircle, CheckSquare, Sparkles, Send, CornerDownRight, BarChart2,
  TrendingUp, TrendingDown, Activity, ShieldCheck, ChevronRight, SlidersHorizontal, Info, Award, Star,
  Gamepad2, Upload, Edit3, Zap, Monitor, Laptop, Trophy, Heart, Copy, Flag, ThumbsUp, ThumbsDown,
  Calendar, Terminal, CreditCard, Building, Shield, Crown, LogOut, Mail,
  ArrowRightLeft
} from 'lucide-react';

export const MOCK_TEAMS = [
  { id: 'team_nocturnal', name: 'NocturnalDevs Studio', role: 'Владелец', avatar: null, canViewFinance: true },
  { id: 'team_pixel', name: 'Pixel Pioneers', role: 'Разработчик', avatar: null, canViewFinance: false }
];

export const INITIAL_ATTENTION_ITEMS = [
  {
    id: 'att_01',
    type: 'moderation_rejected',
    severity: 'critical',
    title: 'Ревизия «Neon Horizon: Vector Run» отклонена',
    subtitle: 'Причина: Отсутствует предупреждение о стробоскопических эффектах.',
    actionLabel: 'Исправить в редакторе',
    targetTab: 'projects',
    icon: XCircle,
    color: 'text-danger',
    bgColor: 'bg-danger/10',
    borderColor: 'border-danger/30',
    scope: 'personal'
  },
  {
    id: 'att_02',
    type: 'crash_bug',
    severity: 'high',
    title: 'Критический вылет (Crash) в «BrokenLore: FOLLOW» v1.2.4',
    subtitle: 'Падение WebGL памяти на мобильных устройствах iOS.',
    actionLabel: 'Перейти к дефекту',
    targetTab: 'bugs',
    icon: Bug,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    borderColor: 'border-warning/30',
    scope: 'team_nocturnal'
  },
  {
    id: 'att_03',
    type: 'unanswered_reviews',
    severity: 'medium',
    title: '5 новых отзывов ждут официального ответа',
    subtitle: 'Игроки задают вопросы о поддержке геймпадов в «Cyber Runner».',
    actionLabel: 'Ответить игрокам',
    targetTab: 'community',
    targetSubTab: 'reviews',
    icon: MessageSquare,
    color: 'text-info',
    bgColor: 'bg-info/10',
    borderColor: 'border-info/30',
    scope: 'personal'
  },
  {
    id: 'att_04',
    type: 'jam_deadline',
    severity: 'medium',
    title: 'Дедлайн Cyberjam 2026 через 2 часа',
    subtitle: 'Проверьте, что финальный билд «BrokenLore» опубликован.',
    actionLabel: 'Проверить сабмит',
    targetTab: 'projects',
    icon: Clock,
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    borderColor: 'border-accent/30',
    scope: 'team_nocturnal'
  },
  {
    id: 'att_05',
    type: 'game_transfer_pending',
    severity: 'medium',
    title: 'Входящие запросы на передачу прав на игры (2 заявки)',
    subtitle: 'Вам предложено принять права владения проектами «Neon Odyssey» и «Retro Synth Racer».',
    actionLabel: 'Открыть трансферы',
    targetTab: 'projects',
    icon: ArrowRightLeft,
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    borderColor: 'border-accent/30',
    scope: 'personal'
  },
  {
    id: 'att_06',
    type: 'blocked_devlog',
    severity: 'critical',
    title: 'Девлог «Отчёт о разработке #4» заблокирован модератором',
    subtitle: 'Причина: Нарушение правил размещения внешних ссылок сбора средств.',
    actionLabel: 'Исправить девлог',
    targetTab: 'devlogs',
    icon: ShieldAlert,
    color: 'text-danger',
    bgColor: 'bg-danger/10',
    borderColor: 'border-danger/30',
    scope: 'personal'
  },
  {
    id: 'att_07',
    type: 'contact_request',
    severity: 'medium',
    title: 'Новый деловой запрос контактов от издателя',
    subtitle: 'Издатель «Indie Aurora» запросил контакты для обсуждения портирования «BrokenLore».',
    actionLabel: 'Просмотреть запрос',
    targetTab: 'overview',
    icon: Mail,
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    borderColor: 'border-accent/30',
    scope: 'personal'
  },
  {
    id: 'att_08',
    type: 'team_invitation',
    severity: 'high',
    title: 'Входящее приглашение в команду «Cyber Crafters»',
    subtitle: 'Вам предложена роль Разработчик с доступом к командным играм и девлогам.',
    actionLabel: 'Перейти к командам',
    targetTab: 'teams',
    icon: Users,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    borderColor: 'border-warning/30',
    scope: 'personal'
  },
  {
    id: 'att_09',
    type: 'seller_issue',
    severity: 'high',
    title: 'Требуется завершить верификацию продавца',
    subtitle: 'Для вывода заработанных средств подтвердите данные самозанятого или юридического лица.',
    actionLabel: 'Пройти верификацию',
    targetTab: 'sales',
    icon: CreditCard,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    borderColor: 'border-warning/30',
    scope: 'team_nocturnal'
  }
];

export const MOCK_GAMES = [
  {
    id: 'g_01',
    title: 'BrokenLore: FOLLOW',
    slug: 'brokenlore-follow',
    genre: 'Sci-Fi Horror',
    visibility: 'public',
    status: 'released',
    statusLabel: 'Релиз',
    cover: '/mocks/cover1.jpg',
    version: 'v1.2.4',
    platforms: ['webgl', 'windows', 'mac'],
    hasBuild: true,
    isJamFrozen: false,
    monetization: 'free',
    monetizationLabel: 'Бесплатно',
    views: 45210,
    downloads: 12400,
    rating: 4.8,
    reviewsCount: 142,
    revenue: '₽ 142,500',
    scope: 'team_nocturnal',
    ownerName: 'NocturnalDevs',
    updatedAt: '17 Июл 2026'
  },
  {
    id: 'g_02',
    title: 'Neon Horizon: Vector Run',
    slug: 'neon-horizon',
    genre: 'Cyberpunk Runner',
    visibility: 'draft',
    status: 'in_dev',
    statusLabel: 'В разработке',
    cover: '/mocks/cover2.jpg',
    version: 'v0.9.1-beta',
    platforms: ['webgl', 'windows'],
    hasBuild: false,
    isJamFrozen: false,
    monetization: 'pwyw',
    monetizationLabel: 'PWYW',
    views: 3840,
    downloads: 420,
    rating: 3.9,
    reviewsCount: 18,
    revenue: '₽ 0',
    scope: 'personal',
    ownerName: 'Личный профиль',
    updatedAt: '12 Июл 2026'
  },
  {
    id: 'g_03',
    title: 'Void Drifter: Zero G',
    slug: 'void-drifter',
    genre: 'Space Sandbox',
    visibility: 'unlisted',
    status: 'prototype',
    statusLabel: 'Прототип',
    cover: '/mocks/cover3.jpg',
    version: 'v0.1.0-dev',
    platforms: ['windows'],
    hasBuild: true,
    isJamFrozen: false,
    monetization: 'paid',
    monetizationLabel: '299 ₽',
    views: 890,
    downloads: 150,
    rating: 4.2,
    reviewsCount: 6,
    revenue: '₽ 44,850',
    scope: 'team_pixel',
    ownerName: 'Pixel Pioneers',
    updatedAt: '05 Июл 2026'
  },
  {
    id: 'g_04',
    title: 'Cyberjam Protocol: Zero',
    slug: 'cyberjam-protocol',
    genre: 'Retro Arcade',
    visibility: 'jam',
    status: 'released',
    statusLabel: 'Джем-версия',
    cover: '/mocks/cover1.jpg',
    version: 'v1.0.0-jam',
    platforms: ['webgl'],
    hasBuild: true,
    isJamFrozen: true,
    monetization: 'free',
    monetizationLabel: 'Бесплатно',
    views: 12400,
    downloads: 3100,
    rating: 4.9,
    reviewsCount: 89,
    revenue: '₽ 0',
    scope: 'team_nocturnal',
    ownerName: 'NocturnalDevs',
    updatedAt: '01 Июл 2026'
  }
];

export const MOCK_INBOX_REVIEWS = [
  { id: 'r_01', author: 'PlayerOne', rating: 5, game: 'BrokenLore: FOLLOW', text: 'Потрясающая атмосфера космического вакуума! Но падает FPS.', scope: 'team_nocturnal' },
  { id: 'r_02', author: 'PixelMage', rating: 3, game: 'Neon Horizon', text: 'Управление слишком резкое на клавиатуре.', scope: 'personal' }
];

export const MOCK_INBOX_BUGS = [
  { id: 'b_01', game: 'BrokenLore', version: 'v1.2.4', os: 'Win 11 / Chrome', title: 'Падение WebGL плеера при входе в мостик', priority: 'Critical', status: 'Open', scope: 'team_nocturnal' }
];

export const MOCK_DEVLOGS = [
  {
    id: 'dl_01',
    title: 'Патч 1.2.4: Глубокая оптимизация памяти и исправление вылетов',
    gameTitle: 'BrokenLore: FOLLOW',
    date: '17 Июл 2026',
    status: 'published',
    views: '4,120',
    commentsCount: 18,
    scope: 'team_nocturnal'
  },
  {
    id: 'dl_02',
    title: 'Анонс дополнения «Сигнал из Бездны» и новые механики O2',
    gameTitle: 'BrokenLore: FOLLOW',
    date: '12 Июл 2026',
    status: 'published',
    views: '8,950',
    commentsCount: 42,
    scope: 'team_nocturnal'
  },
  {
    id: 'dl_03',
    title: 'Концепт-арты шейдеров неоновых вывесок и физика скольжения',
    gameTitle: 'Neon Horizon: Vector Run',
    date: '02 Июл 2026',
    status: 'draft',
    views: '0',
    commentsCount: 0,
    scope: 'personal'
  }
];

export const MOCK_BUGS = [
  {
    id: 'bug_101',
    gameTitle: 'BrokenLore: FOLLOW',
    version: 'v1.2.4',
    title: 'Падение WebGL плеера при входе в мостик станции',
    severity: 'Critical',
    reproducibility: '100% на iOS Chrome',
    status: 'open',
    reporter: 'PlayerOne',
    date: 'Вчера, 14:20',
    scope: 'team_nocturnal',
    logs: 'WebGL: OUT_OF_MEMORY on glDrawElements (0x0505) in TanatosBridgeShader.js'
  },
  {
    id: 'bug_102',
    gameTitle: 'Neon Horizon: Vector Run',
    version: 'v0.9.1',
    title: 'Проваливание сквозь текстуры рампы на 3-м треке',
    severity: 'High',
    reproducibility: 'Иногда',
    status: 'in_progress',
    reporter: 'CyberRunner',
    date: '18 Июл 2026',
    scope: 'personal',
    logs: 'Physics: Raycast missed MeshCollider instance #402'
  }
];

export const MOCK_REVIEWS = [
  {
    id: 'rev_101',
    userNick: 'alex_dev',
    userAvatar: null,
    rating: 3,
    gameId: 'g_01',
    gameTitle: 'BrokenLore: FOLLOW',
    buildVersion: 'v1.2.4',
    text: 'Геймплей отличный, но на локации с туманом проседает FPS до 25 к/с при запуске на WebGL. Добавьте опцию отключения постобработки.',
    createdAt: '16 Июл 2026',
    scope: 'team_nocturnal',
    officialResponse: {
      id: 'resp_101',
      authorName: 'NocturnalDevs Studio',
      text: 'Спасибо за подробный отзыв! Проблему с шейдером тумана исправим в патче v1.2.5 уже на этой неделе.',
      updatedAt: '17 Июл 2026'
    }
  },
  {
    id: 'rev_102',
    userNick: 'gamer99',
    userAvatar: null,
    rating: 1,
    gameId: 'g_01',
    gameTitle: 'BrokenLore: FOLLOW',
    buildVersion: 'v1.2.4',
    text: 'Игра вылетает с ошибкой WebGL Out of Memory при входе во вторую главу на планшетах iPad!',
    createdAt: '17 Июл 2026',
    scope: 'team_nocturnal',
    officialResponse: null
  },
  {
    id: 'rev_103',
    userNick: 'cyber_pilot',
    userAvatar: null,
    rating: 5,
    gameId: 'g_02',
    gameTitle: 'Neon Horizon: Vector Run',
    buildVersion: 'v0.9.1-beta',
    text: 'Невероятный визуальный стиль и качающий саундтрек! Жду полноценного релиза на PC и поддержки DualSense.',
    createdAt: '13 Июл 2026',
    scope: 'personal',
    officialResponse: {
      id: 'resp_103',
      authorName: 'Личный профиль',
      text: 'Огромное спасибо за поддержку! Поддержка геймпадов уже тестируется в закрытой бете.',
      updatedAt: '14 Июл 2026'
    }
  },
  {
    id: 'rev_104',
    userNick: 'indie_lover',
    userAvatar: null,
    rating: 2,
    gameId: 'g_03',
    gameTitle: 'Void Drifter: Zero G',
    buildVersion: 'v0.1.0-dev',
    text: 'Физика невесомости слишком непредсказуемая, управления мышью не хватает. Нужен туториал.',
    createdAt: '06 Июл 2026',
    scope: 'team_pixel',
    officialResponse: null
  }
];

// Analytics Data Set
export const MOCK_ANALYTICS_GAMES = [
  { id: 'game_1', title: 'Cyber Quest 2077', slug: 'cyber-quest-2077', cover: '/mocks/cover2.jpg', scope: 'personal', platforms: ['webgl', 'win', 'mac'], views: 24500, webglPlays: 12400, downloads: 4100, donateClicks: 320, revenue: 84500 },
  { id: 'game_2', title: 'BrokenLore: FOLLOW', slug: 'brokenlore-follow', cover: '/mocks/cover3.jpg', scope: 'team_nocturnal', platforms: ['webgl', 'win'], views: 18200, webglPlays: 9800, downloads: 2300, donateClicks: 195, revenue: 58000 },
  { id: 'game_3', title: 'Pixel Dungeon Run', slug: 'pixel-dungeon-run', cover: '/mocks/cover1.jpg', scope: 'personal', platforms: ['win', 'linux'], views: 6350, webglPlays: 0, downloads: 1890, donateClicks: 42, revenue: 0 }
];

export const MOCK_TIMESERIES = [
  { date: '12 Авг', views: 820, webglPlays: 410, downloads: 130, subscribers: 12, donateClicks: 15, revenue: 2400 },
  { date: '14 Авг', views: 1150, webglPlays: 590, downloads: 180, subscribers: 19, donateClicks: 22, revenue: 3800 },
  { date: '16 Авг', views: 980, webglPlays: 510, downloads: 140, subscribers: 14, donateClicks: 18, revenue: 2900 },
  { date: '18 Авг', views: 1420, webglPlays: 780, downloads: 240, subscribers: 28, donateClicks: 34, revenue: 5100 },
  { date: '20 Авг', views: 1890, webglPlays: 950, downloads: 310, subscribers: 39, donateClicks: 45, revenue: 7800 },
  { date: '22 Авг', views: 2100, webglPlays: 1120, downloads: 380, subscribers: 48, donateClicks: 52, revenue: 9200 },
  { date: '24 Авг', views: 1650, webglPlays: 890, downloads: 270, subscribers: 31, donateClicks: 38, revenue: 6400 }
];

export const MOCK_REFERRALS = [
  { source: 'Каталог Hubigr / Поиск', category: 'Органический каталог', views: 20600, share: '42%' },
  { source: 'Джемы (Страницы сабмишенов)', category: 'Геймджемы M1', views: 13700, share: '28%' },
  { source: 'Дневники разработки (DevLog)', category: 'DevLog лента M2', views: 6860, share: '14%' },
  { source: 'Соцсети / Прямые ссылки', category: 'Внешние переходы', views: 5880, share: '12%' },
  { source: 'Раздел Похожие игры', category: 'Рекомендации', views: 1960, share: '4%' }
];

export const MOCK_STRUCTURED_FEEDBACK = [
  {
    id: 'fb_01',
    userNick: 'mechanic_dev',
    userAvatar: null,
    gameId: 'g_01',
    gameTitle: 'BrokenLore: FOLLOW',
    category: 'design',
    categoryLabel: 'Геймдизайн',
    pros: 'Атмосфера, звуковой дизайн и головоломки с телепортами выполнены на высоте.',
    cons: 'Резкая инерция камеры вызывает укачивание. Стоит добавить слайдер чувствительности FOV.',
    playtime: '2.5 часа',
    threadUrl: '/community/thread/102',
    scope: 'team_nocturnal',
    createdAt: '15 Июл 2026'
  },
  {
    id: 'fb_02',
    userNick: 'pixel_master',
    userAvatar: null,
    gameId: 'g_02',
    gameTitle: 'Neon Horizon: Vector Run',
    category: 'performance',
    categoryLabel: 'Производительность',
    pros: 'Плавный паркур и сочные неоновые эффекты.',
    cons: 'На разрешениях 4K шрифты интерфейса становятся практически нечитаемыми.',
    playtime: '45 минут',
    threadUrl: '/community/thread/88',
    scope: 'personal',
    createdAt: '10 Июл 2026'
  }
];

// ================= ДАННЫЕ ДЛЯ ПРОДАЖ (MOCK_SALES) =================
export const MOCK_SALES_ITEMS = [
  { id: 'item_1', title: 'Cyber Quest 2077 (Deluxe Edition)', price: 499, type: 'game', scope: 'personal' },
  { id: 'item_2', title: 'BrokenLore: FOLLOW (Standard)', price: 350, type: 'game', scope: 'team_nocturnal' },
  { id: 'item_3', title: 'Cyberpunk UI Asset Pack v2', price: 1200, type: 'asset', scope: 'personal' }
];

export const MOCK_SALES_TIMESERIES = [
  { date: '12 Авг', gross: 12400, net: 10540, count: 32, pwyw: 1200, refunds: 0 },
  { date: '14 Авг', gross: 18900, net: 16065, count: 48, pwyw: 2100, refunds: 350 },
  { date: '16 Авг', gross: 14500, net: 12325, count: 38, pwyw: 1500, refunds: 0 },
  { date: '18 Авг', gross: 22000, net: 18700, count: 56, pwyw: 2800, refunds: 499 },
  { date: '20 Авг', gross: 31000, net: 26350, count: 78, pwyw: 4200, refunds: 0 },
  { date: '22 Авг', gross: 28500, net: 24225, count: 71, pwyw: 3900, refunds: 350 },
  { date: '24 Авг', gross: 19800, net: 16830, count: 50, pwyw: 2400, refunds: 0 }
];

export const MOCK_RECENT_SALES = [
  { id: 'ORD-9412', itemTitle: 'Cyber Quest 2077', buyer: '@alex_gamer', amount: 499, method: 'СБП', date: '10 мин назад', status: 'completed' },
  { id: 'ORD-9411', itemTitle: 'BrokenLore: FOLLOW', buyer: '@shadow_runner', amount: 350, method: 'Карта (МИР)', date: '34 мин назад', status: 'completed' },
  { id: 'ORD-9410', itemTitle: 'Cyberpunk UI Asset Pack', buyer: '@dev_studio_99', amount: 1200, method: 'T-Pay', date: '1 час назад', status: 'completed' },
  { id: 'ORD-9409', itemTitle: 'Cyber Quest 2077 (PWYW)', buyer: '@indie_supporter', amount: 1000, method: 'СБП', date: '2 часа назад', status: 'completed' },
  { id: 'ORD-9408', itemTitle: 'BrokenLore: FOLLOW', buyer: '@pixel_master', amount: 350, method: 'Карта (Visa)', date: '4 часа назад', status: 'completed' }
];

export const MOCK_REFUNDS = [
  { id: 'ORD-9012', itemTitle: 'BrokenLore: FOLLOW', buyer: '@bug_hunter', amount: 350, reason: 'Не запускается на WebGL', status: 'approved', date: 'Вчера, 14:20' },
  { id: 'ORD-8821', itemTitle: 'Cyber Quest 2077', buyer: '@test_user', amount: 499, reason: 'Случайная повторная покупка', status: 'pending', date: '22 Авг, 11:05' }
];

export const MOCK_PAYOUTS_HISTORY = [
  { id: 'PO-4091', date: '20 Авг 2026', amount: 45000, fee: 900, details: 'ИП Иванов А.В. (р/с ...8901)', status: 'paid', receiptUrl: '#' },
  { id: 'PO-3820', date: '01 Авг 2026', amount: 32000, fee: 640, details: 'ИП Иванов А.В. (р/с ...8901)', status: 'paid', receiptUrl: '#' },
  { id: 'PO-3510', date: '15 Июл 2026', amount: 28500, fee: 570, details: 'Самозанятый (Карта ...4012)', status: 'paid', receiptUrl: '#' }
];

export interface CreatorRecentEvent {
  id: string;
  type: 'transfer' | 'review' | 'build' | 'bug' | 'finance' | 'devlog';
  title: string;
  description: string;
  timestamp: string;
  scope: string;
  tag: string;
  statusColor: string;
}

export const MOCK_CREATOR_EVENTS: CreatorRecentEvent[] = [
  {
    id: 'ev-1',
    type: 'transfer',
    title: 'Трансфер прав на игру принят',
    description: 'Права владения проектом «QUANTUM CORE» успешно переданы NocturnalDevs Studio.',
    timestamp: 'Сегодня, 14:35',
    scope: 'team_nocturnal',
    tag: 'Трансфер',
    statusColor: 'text-success'
  },
  {
    id: 'ev-2',
    type: 'review',
    title: 'Новый отзыв с оценкой ★5',
    description: 'Игрок @cyber_ninja оставил положительный отзыв к «Neon Horizon: Vector Run».',
    timestamp: 'Сегодня, 12:10',
    scope: 'personal',
    tag: 'Отзывы',
    statusColor: 'text-warning'
  },
  {
    id: 'ev-3',
    type: 'bug',
    title: 'Новый баг-репорт P1 зафиксирован',
    description: 'Игрок сообщил об утечке WebGL памяти в «BrokenLore: FOLLOW» на iOS Safari.',
    timestamp: 'Вчера, 19:22',
    scope: 'team_nocturnal',
    tag: 'Баги',
    statusColor: 'text-danger'
  },
  {
    id: 'ev-4',
    type: 'devlog',
    title: 'Девлог «Патч 1.2.0: Ремастер света» опубликован',
    description: 'Публикация набрала 142 просмотра и 28 лайков за первые сутки.',
    timestamp: 'Вчера, 15:40',
    scope: 'personal',
    tag: 'Девлоги',
    statusColor: 'text-info'
  },
  {
    id: 'ev-5',
    type: 'finance',
    title: 'Выплата 45,200 ₽ успешно обработана',
    description: 'Средства за вычетом комиссии платформы перечислены на верифицированный счёт ИП.',
    timestamp: '3 дня назад',
    scope: 'team_nocturnal',
    tag: 'Финансы',
    statusColor: 'text-success'
  }
];

export interface GameAudienceItem {
  gameId: string;
  gameTitle: string;
  gameCover: string;
  subscribersCount: number;
  subscribersGrowth: number;
  scope: string;
  conversionRate: string;
  activePlayers: number;
}

export const MOCK_AUDIENCE_GAMES: GameAudienceItem[] = [
  {
    gameId: 'g_01',
    gameTitle: 'BrokenLore: FOLLOW',
    gameCover: '/mocks/cover1.jpg',
    subscribersCount: 3420,
    subscribersGrowth: 215,
    scope: 'team_nocturnal',
    conversionRate: '18.4%',
    activePlayers: 1840
  },
  {
    gameId: 'g_02',
    gameTitle: 'Neon Horizon: Vector Run',
    gameCover: '/mocks/cover2.jpg',
    subscribersCount: 1430,
    subscribersGrowth: 105,
    scope: 'personal',
    conversionRate: '22.1%',
    activePlayers: 920
  },
  {
    gameId: 'g_neon',
    gameTitle: 'Neon Odyssey',
    gameCover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=200&auto=format&fit=crop',
    subscribersCount: 890,
    subscribersGrowth: 45,
    scope: 'personal',
    conversionRate: '14.2%',
    activePlayers: 410
  },
  {
    gameId: 'g_racer',
    gameTitle: 'Retro Synth Racer',
    gameCover: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?q=80&w=200&auto=format&fit=crop',
    subscribersCount: 1120,
    subscribersGrowth: 80,
    scope: 'team_nocturnal',
    conversionRate: '16.8%',
    activePlayers: 670
  },
  {
    gameId: 'g_pixel',
    gameTitle: 'Pixel Quest Odyssey',
    gameCover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=200&auto=format&fit=crop',
    subscribersCount: 340,
    subscribersGrowth: 18,
    scope: 'team_pixel',
    conversionRate: '11.5%',
    activePlayers: 190
  }
];

export interface RecentSubscriberItem {
  id: string;
  userNick: string;
  userAvatar: string;
  type: 'profile_follow' | 'game_subscription';
  targetTitle: string;
  subscribedAt: string;
  scope: string;
  playtime?: string;
}

export const MOCK_RECENT_SUBSCRIBERS: RecentSubscriberItem[] = [
  {
    id: 'sub-1',
    userNick: 'cyber_ninja',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop',
    type: 'game_subscription',
    targetTitle: 'BrokenLore: FOLLOW',
    subscribedAt: 'Сегодня, 13:40',
    scope: 'team_nocturnal',
    playtime: '12 ч.'
  },
  {
    id: 'sub-2',
    userNick: 'pixel_artist',
    userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop',
    type: 'profile_follow',
    targetTitle: 'Профиль автора',
    subscribedAt: 'Сегодня, 11:15',
    scope: 'personal'
  },
  {
    id: 'sub-3',
    userNick: 'retro_gamer',
    userAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&auto=format&fit=crop',
    type: 'game_subscription',
    targetTitle: 'Neon Horizon: Vector Run',
    subscribedAt: 'Вчера, 21:05',
    scope: 'personal',
    playtime: '5.4 ч.'
  },
  {
    id: 'sub-4',
    userNick: 'synth_wave',
    userAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop',
    type: 'game_subscription',
    targetTitle: 'Retro Synth Racer',
    subscribedAt: 'Вчера, 16:30',
    scope: 'team_nocturnal',
    playtime: '8.1 ч.'
  },
  {
    id: 'sub-5',
    userNick: 'alex_dev',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop',
    type: 'profile_follow',
    targetTitle: 'Профиль автора',
    subscribedAt: '2 дня назад',
    scope: 'personal'
  }
];

export const MOCK_AUDIENCE_TIMESERIES = [
  { date: '1 Авг', followers: 1140, gameSubscribers: 4210 },
  { date: '5 Авг', followers: 1162, gameSubscribers: 4320 },
  { date: '10 Авг', followers: 1195, gameSubscribers: 4480 },
  { date: '15 Авг', followers: 1220, gameSubscribers: 4610 },
  { date: '20 Авг', followers: 1255, gameSubscribers: 4740 },
  { date: '25 Авг', followers: 1280, gameSubscribers: 4850 }
];
