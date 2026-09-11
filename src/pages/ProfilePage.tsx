import React, { useState, useMemo, useEffect, useRef } from 'react';
import DevMatrixPanel from '../components/DevMatrixPanel';
import FontStyles from '../components/ui/FontStyles';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import SegmentedControl from '../components/ui/SegmentedControl';
import Tabs from '../components/ui/Tabs';
import { useToast } from '../components/ui/Toast';
import Drawer from '../components/ui/Drawer';
import FollowersDrawer from '../components/modals/FollowersDrawer';
import Modal from '../components/ui/Modal';
import AddToCollectionModal from '../components/modals/AddToCollectionModal';
import GameCardContextMenu from '../components/GameCardContextMenu';
import { ProfileGameCard } from '../components/GameCard';
import Input, { SearchInput, Textarea } from '../components/ui/Input';
import CustomSelect from '../components/ui/Select';
import ShareProfileModal from '../components/modals/ShareProfileModal';
import IconPickerModal from '../components/modals/IconPickerModal';
import AntiPhishingModal from '../components/modals/AntiPhishingModal';
import GameTransferModal from '../components/modals/GameTransferModal';
import { BadgeRow, BadgeChip, BadgeData, BadgeVariant, BADGE_ICON_MAP, BADGE_VARIANT_STYLES } from '../components/ProfileBadges';
import { getStoredCommunityThreads, MOCK_COMMUNITY_CATEGORIES } from '../data/communityMockData';
import { 
  Search, ChevronDown, Lock, Trophy, Calendar, Users, 
  Layers, ArrowUpRight, Bell, Info, Award, Check, Sparkles, 
  MapPin, Briefcase, Heart, Share2, Flag, Star, Plus, X, 
  Mail, Phone, Send, Cpu, Camera, Edit3, Trash2, RefreshCw, AlertOctagon, Menu,
  MoreVertical, UserX, UserPlus, Copy, CheckCircle2, Compass,
  Bookmark, Globe, Monitor, Apple, Download, Play, Gamepad2, MessageSquare, Eye, ArrowRight, ArrowUpDown, Laptop, Shield, Clock, AlertCircle,
  LayoutDashboard, ShieldCheck, ShieldAlert, ExternalLink
} from 'lucide-react';

// Form Components для консистентности диалогов
const FormField = ({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) => (
  <div className="flex flex-col gap-2">
    <label className="text-caption font-semibold text-textSecondary uppercase tracking-wider">{label}</label>
    {children}
    {hint && <span className="text-caption text-textTertiary">{hint}</span>}
  </div>
);

const Tag = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-2 border border-borderDef rounded-control text-caption font-medium text-textPrimary">
    {label}
    <button
      type="button"
      onClick={onRemove}
      className="hover:text-danger transition-colors cursor-pointer"
      aria-label={`Удалить ${label}`}
    >
      <X className="w-3 h-3" />
    </button>
  </span>
);

// --- MOCK ДАННЫЕ: Подписчики и Подписки ---
const MOCK_FOLLOWERS = [
  { id: 'u1', name: 'Elena Sokolova',   handle: '@esokolova',    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop', role: 'Creator',   isFollowingBack: true  },
  { id: 'u2', name: 'Dmitry Ivanov',    handle: '@divanov',      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop', role: 'Moderator', isFollowingBack: false },
  { id: 'u3', name: 'Masha Krivova',    handle: '@mashakr',      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop', role: 'Creator',   isFollowingBack: true  },
  { id: 'u4', name: 'Pavel Zhuk',       handle: '@pzhuk_dev',    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop', role: 'Guest',     isFollowingBack: false },
  { id: 'u5', name: 'Ira Volkova',      handle: '@irav',         avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop', role: 'Creator',   isFollowingBack: true  },
  { id: 'u6', name: 'Sergey Nikitin',   handle: '@snikitin',     avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop', role: 'Admin',     isFollowingBack: false },
];

const MOCK_FOLLOWING = [
  { id: 'f1', name: 'PixelForge Studio', handle: '@pixelforge',  avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=pixelforge',  role: 'Creator',   isFollowingBack: true  },
  { id: 'f2', name: 'CyberRunner Dev',   handle: '@cyberrunner', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=cyberrunner',    role: 'Creator',   isFollowingBack: true  },
  { id: 'f3', name: 'OrbitalMind',       handle: '@orbitalmind', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=orbital',        role: 'Creator',   isFollowingBack: false },
];

// --- ИМИТАЦИОННЫЕ ДАННЫЕ ПРОФИЛЕЙ (Для Solo и Team) ---
const INITIAL_PROFILES = {
  solo: {
    name: "Alexander 'Kael' Vostokov",
    handle: "@kael_vostokov",
    username: "kael_vostokov",
    usernameChangeAvailableAt: "2026-09-21T12:00:00Z", // AS-IS username cooldown: ~14 days left (BR-ACC-011)
    registeredAt: "июля 2025",
    badges: [
      { id: 'role',     icon: 'user',          label: 'Lead Designer / Tech Artist', variant: 'default'     },
      { id: 'stack',    icon: 'cpu',           label: 'Rust & WebGL Dev',             variant: 'default'     },
      { id: 'search',   icon: 'compass',       label: 'В поиске команды',             variant: 'warning'     },
      { id: 'award1',   icon: 'trophy',        label: '1 место Indie Jam #3',         variant: 'celebratory' },
      { id: 'award2',   icon: 'award',         label: 'Top-3 Cyberjam 2026',          variant: 'celebratory' },
    ],
    aboutTitle: "Lead Game Designer & Technical Artist",
    profession: "Lead Game Designer & Technical Artist",
    gameEngines: ["Unity", "WebGL / WASM", "Custom Rust Engine"],
    availabilityStatus: "В поиске команды",
    location: "Helsinki, Finland",
    experience: "7+ лет в геймдеве (Ex-CD Projekt)",
    bio: "Инди-разработчик и технический художник. Специализируюсь на низкоуровневой графике, оптимизации рендеринга в WebGL и написании высокопроизводительных игровых систем на Rust и WebAssembly.",
    techStack: ["Rust", "WASM", "WebGL", "Unity", "C#", "GLSL", "Three.js", "Blender"],
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
    coverGlow: "from-surface-1 via-surface-0 to-surface-0",
    stats: {
      followers: "1 420",
      following: "382"
    },
    contacts: {
      email: "kael_art@hubigr.dev",
      phone: "+358 40 123 4567",
      telegram: "@kael_vostokov"
    },
    links: [
      { label: "github.com/kael", url: "https://github.com" },
      { label: "t.me/kael_dev", url: "https://t.me" },
      { label: "artstation.com/kael", url: "https://artstation.com" }
    ],
    donateDesc: "Поддержите независимого автора для ускорения выхода новых интерактивных WASM-билдов и патчноутов к QUANTUM CORE.",
    supportLinks: [
      { id: '1', platform: 'Boosty', url: 'https://boosty.to/kael_dev', verified: true, desc: 'Ранний доступ к WebGL-билдам' },
      { id: '2', platform: 'DonationAlerts', url: 'https://donationalerts.com/r/kael_vostokov', verified: true, desc: 'Прямая поддержка стримов' },
      { id: '3', platform: 'CloudTips', url: 'https://pay.cloudtips.ru/p/kael', verified: true, desc: 'Донат через СБП и карты' }
    ],
    projects: [
      {
        id: 1,
        title: "QUANTUM CORE",
        price: "599 ₽",
        genre: "Action WebGL",
        rating: 4.9,
        downloads: "12 400",
        engine: "RUST & WASM",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop",
        description: "Высокооктановая головоломка с procedural-генерацией уровней на чистом WebGL. Победитель номинации за лучшую техническую оптимизацию.",
        award: "Лучший WebGL проект",
        status: "released",
        platforms: ["webgl", "windows"],
        jamName: "Broken Worlds Jam",
        hasWebGL: true
      },
      {
        id: 2,
        title: "VOID DRIFTER",
        price: "Бесплатно",
        genre: "Sci-Fi Arcade",
        rating: 4.6,
        downloads: "3 100",
        engine: "UNITY",
        image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=600&auto=format&fit=crop",
        description: "Космический симулятор выживания в условиях гравитационных аномалий. Разработано в рамках двухнедельного ретро-джема.",
        status: "in_development",
        platforms: ["windows", "linux"],
        jamName: null,
        hasWebGL: false
      }
    ],
    devlogs: [
      {
        id: 1,
        title: "Оптимизация VRAM: сжатие ASTC и чистка графического конвейера",
        date: "12.07.2026",
        category: "Оптимизация",
        postType: "article",
        game: "QUANTUM CORE",
        thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=200&auto=format&fit=crop",
        image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=450&fit=crop",
        summary: "Подробный разбор алгоритмов сжатия текстур и оптимизации кэша процессора для достижения стабильных 60 FPS на мобильных браузерах.",
        stats: {
          likes: 42,
          comments: 14,
          views: 1200
        }
      },
      {
        id: 2,
        title: "Переход на кастомный URP конвейер рендеринга",
        date: "30.06.2026",
        category: "Патчноут",
        postType: "patchnote",
        game: "VOID DRIFTER",
        thumbnail: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=200&auto=format&fit=crop",
        summary: "Интеграция новых шейдеров постобработки и объемного тумана для усиления атмосферы изоляции в открытом космосе.",
        stats: {
          likes: 27,
          comments: 8,
          views: 890
        }
      }
    ],
    jams: [
      {
        id: 1,
        title: "Broken Worlds Jam",
        date: "июль 2026",
        cover: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=600&auto=format&fit=crop",
        award: "1-е Место",
        nominations: "Лучшая атмосфера &bull; Лучший звук &bull; Геймплей",
        score: "4.92",
        rank: "#1 из 98",
        submissionTitle: "QUANTUM CORE",
        submissionCover: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=200&auto=format&fit=crop",
        role: "Solo-разработчик (Full Cycle)"
      }
    ]
  },
  minimal: {
    name: "", // Display name is optional / omitted (BR-ACC-012, BR-ACC-013)
    handle: "@novice_indie",
    username: "novice_indie",
    usernameChangeAvailableAt: null, // Cooldown not active
    registeredAt: "сентября 2026",
    badges: [],
    aboutTitle: "",
    profession: "",
    gameEngines: [],
    availabilityStatus: "",
    location: "",
    experience: "",
    bio: "",
    techStack: [],
    avatar: "", // Empty avatar -> triggers fallback letter badge (BR-ACC-013)
    coverGlow: "from-surface-1 via-surface-0 to-surface-0",
    stats: {
      followers: "0",
      following: "0"
    },
    contacts: {
      email: "",
      phone: "",
      telegram: ""
    },
    links: [],
    donateDesc: "",
    supportLinks: [],
    projects: [],
    devlogs: [],
    jams: []
  },
  team: {
    name: "NocturnalDevs Studio",
    handle: "@nocturnal_devs",
    username: "nocturnal_devs",
    type: "studio",
    settings: {
      hideMembers: false,
      hideJamAchievements: false
    },
    usernameChangeAvailableAt: null,
    registeredAt: "октября 2025",
    badges: [
      { id: 'teamType', icon: 'building',       label: 'Студия',                   variant: 'default'      },
      { id: 'verified', icon: 'check-circle-2', label: 'Верифицированная студия', variant: 'success'      },
      { id: 'size',     icon: 'users',          label: 'Команда (4 чел)',          variant: 'default'      },
      { id: 'hiring',   icon: 'user-plus',      label: 'Ищем 3D Artist / Dev',     variant: 'warning'      },
      { id: 'award1',   icon: 'trophy',         label: 'Grand Prix Cyberjam 2026', variant: 'celebratory'  },
      { id: 'award2',   icon: 'award',          label: 'Top-10 Indie Jam #2',      variant: 'celebratory'  },
    ],
    aboutTitle: "Independent Game Studio",
    profession: "Independent Game Studio",
    gameEngines: ["Unity URP", "Unreal Engine 5"],
    availabilityStatus: "Ищем 3D Artist / Dev",
    location: "Helsinki, Finland",
    experience: "Создано содружеством инди-авторов",
    bio: "Мы — независимое геймдев-объединение. Проектируем атмосферные и мрачные фантастические миры с акцентом на комплексный нарратив, procedural-звук и честные геймплейные механики.",
    techStack: ["Unity", "C#", "FMOD", "Blender", "Rust", "WebAssembly", "WebGL"],
    avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop",
    coverGlow: "from-surface-1 via-surface-0 to-surface-0",
    stats: {
      followers: "4 800",
      following: "12"
    },
    contacts: {
      email: "studio@nocturnaldevs.com",
      phone: "+358 40 987 6543",
      telegram: "@nocturnal_devs"
    },
    links: [
      { label: "nocturnaldevs.com", url: "https://nocturnaldevs.com" },
      { label: "vk.com/nocturnal", url: "https://vk.com" },
      { label: "github.com/nocturnal", url: "https://github.com" }
    ],
    donateDesc: "Фонд содействия независимой разработке NocturnalDevs Studio. Все средства направляются на оплату звуковых библиотек, серверов и локализацию.",
    supportLinks: [
      { id: '1', platform: 'Boosty', url: 'https://boosty.to/nocturnal_studio', verified: true, desc: 'Ежемесячная подписка на бета-тесты' },
      { id: '2', platform: 'DonationAlerts', url: 'https://donationalerts.com/r/nocturnal_devs', verified: true, desc: 'Сбор на краудфандинг саундтрека' }
    ],
    projects: [
      {
        id: 1,
        title: "ECHOES OF THE VOID",
        price: "1 299 ₽",
        genre: "Sci-Fi Horror",
        rating: 4.8,
        downloads: "8 500",
        engine: "UNITY URP",
        image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop",
        description: "Психологический триллер в глубинах заброшенной космической станции. Исследуйте пустые отсеки и выживайте без источников света.",
        award: "Grand Prix Cyberjam 2026",
        status: "released",
        platforms: ["webgl", "windows", "mac_os"],
        jamName: "Cyberjam 2026",
        hasWebGL: true
      },
      {
        id: 2,
        title: "WHISPERER",
        price: "Бесплатно",
        genre: "Mystery Adventure",
        rating: 4.4,
        downloads: "4 200",
        engine: "UNITY",
        image: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?q=80&w=600&auto=format&fit=crop",
        description: "Детективная инди-игра о расшифровке таинственных радиосигналов на отдаленном арктическом аванпосте.",
        status: "prototype",
        platforms: ["windows"],
        jamName: null,
        hasWebGL: false
      }
    ],
    devlogs: [
      {
        id: 1,
        title: "Процедурный эмбиент: генерация низких частот на лету",
        date: "14.07.2026",
        category: "Звук",
        postType: "devlog",
        game: "ECHOES OF THE VOID",
        thumbnail: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=200&auto=format&fit=crop",
        summary: "Интеграция аудиоконвейера FMOD для создания динамически меняющегося звукового фона в зависимости от уровня стресса протагониста."
      }
    ],
    jams: [
      {
        id: 1,
        title: "Broken Worlds Jam",
        date: "июль 2026",
        cover: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=600&auto=format&fit=crop",
        award: "1-е Место",
        nominations: "Лучший звук &bull; Атмосфера &bull; Нарратив",
        score: "4.88",
        rank: "#1 из 112",
        submissionTitle: "ECHOES OF THE VOID",
        submissionCover: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=200&auto=format&fit=crop",
        role: "Студия (Full Team)"
      }
    ],
    members: [
      { id: 1, name: "Alexander Kael", role: "Lead Game Designer", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop" },
      { id: 2, name: "VoidSound", role: "Composer & Audio Lead", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=void" },
      { id: 3, name: "Alex_Code", role: "WebGL Developer", avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=alex" }
    ]
  }
};

export default function App({ initialProfileType, authState, setAuthState }: { initialProfileType?: 'solo' | 'team' | 'minimal'; authState?: string; setAuthState?: (val: string) => void }) {
  // --- DEV SIMULATOR STATES (Панель дебага - z-toast) ---
  const [profileType, setProfileType] = useState<'solo' | 'team' | 'minimal'>(initialProfileType || 'solo'); // 'solo' | 'team' | 'minimal'
  const [dataState, setDataState] = useState('happy'); // 'happy' | 'loading' | 'empty' | 'error' | 'locked'
  const [localVisitorRole, setLocalVisitorRole] = useState('guest'); // 'owner' | 'guest' | 'captain'
  const visitorRole = authState || localVisitorRole;
  const setVisitorRole = (val: string) => {
    setLocalVisitorRole(val);
    if (setAuthState) setAuthState(val);
  };

  // Preview Mode: Переключатель «Глазами гостя» vs «Вид владельца» (FE-ACC-004 Stage 4)
  const [isPreviewPublicView, setIsPreviewPublicView] = useState(false);
  const effectiveRole = (visitorRole === 'owner' && isPreviewPublicView) ? 'guest' : visitorRole;

  // Настройки приватности соц-связей (BR-ACC-024)
  const [privacySettings, setPrivacySettings] = useState({
    followers: 'public', // 'public' | 'followers' | 'private'
    following: 'public', // 'public' | 'followers' | 'private'
    favorites: 'public', // 'public' | 'followers' | 'private'
  });
  const [draftPrivacySettings, setDraftPrivacySettings] = useState({ ...privacySettings });

  useEffect(() => {
    if (initialProfileType) {
      setProfileType(initialProfileType);
    }
  }, [initialProfileType]);

  // --- РЕДАКТИРОВАНИЕ И АДМИНИСТРИРОВАНИЕ ---
  const [profiles, setProfiles] = useState(INITIAL_PROFILES);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileSnapshot, setProfileSnapshot] = useState(null);
  
  // In-Place и Identity состояния (FE-ACC-004 Stage 1: BR-ACC-011, BR-ACC-012, BR-ACC-013)
  const [isEditingName, setIsEditingName] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [draftDisplayName, setDraftDisplayName] = useState('');
  const [draftUsername, setDraftUsername] = useState('');
  const [draftLocation, setDraftLocation] = useState('');
  const [draftExperience, setDraftExperience] = useState('');
  const [draftAvatar, setDraftAvatar] = useState('');
  const [overrideCooldown, setOverrideCooldown] = useState<boolean | null>(null); // null = use profile, true = forced active, false = forced expired

  // Состояния Drawer-панелей и Модалок
  const [activeDrawer, setActiveDrawer] = useState(null); // null | 'developer' | 'contacts' | 'donate' | 'addProject' | 'editProject' | 'addDevlog' | 'editDevlog' | 'inviteTeam' | 'reportProfile' | 'badges'
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [iconPickerState, setIconPickerState] = useState<{ isOpen: boolean; badgeIndex: number | null }>({ isOpen: false, badgeIndex: null });
  
  // Черновик бейджей
  const [draftBadges, setDraftBadges] = useState<BadgeData[]>([]);
  
  // Форма приглашения в команду
  const [inviteTeamName, setInviteTeamName] = useState('CyberJam Squad');
  const [inviteRole, setInviteRole] = useState('3D Generalist');
  const [inviteAccessRole, setInviteAccessRole] = useState('editor');
  const [inviteMessage, setInviteMessage] = useState('');

  // Бан пользователя (Stage 5)
  const [isBanned, setIsBanned] = useState(false);

  // Форма жалобы на профиль
  const [reportReason, setReportReason] = useState('spam');
  const [reportComment, setReportComment] = useState('');

  // Временные буферы для полей Drawer форм
  const [draftProfession, setDraftProfession] = useState('');
  const [draftGameEngines, setDraftGameEngines] = useState<string[]>([]);
  const [newEngineTag, setNewEngineTag] = useState('');
  const [draftAvailability, setDraftAvailability] = useState('');
  const [draftBio, setDraftBio] = useState('');
  const [draftTechStack, setDraftTechStack] = useState([]);
  const [newTechTag, setNewTechStackTag] = useState('');
  const [draftLinks, setDraftLinks] = useState([]);
  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  
  const [draftContacts, setDraftContacts] = useState({ email: '', phone: '', telegram: '' });
  const [draftDonateDesc, setDraftDonateDesc] = useState('');
  const [draftSupportLinks, setDraftSupportLinks] = useState<any[]>([]);
  const [newSupportPlatform, setNewSupportPlatform] = useState('Boosty');
  const [newSupportUrl, setNewSupportUrl] = useState('');
  const [newSupportDesc, setNewSupportDesc] = useState('');

  // Защита внешних ссылок и антифишинг (BR-ACC-021)
  const [antiPhishingState, setAntiPhishingState] = useState<{
    isOpen: boolean;
    url: string;
    platformName?: string;
  }>({
    isOpen: false,
    url: '',
    platformName: ''
  });

  const openExternalSupportLink = (url: string, platformName?: string) => {
    setAntiPhishingState({
      isOpen: true,
      url,
      platformName
    });
  };

  // Черновики проектов и девлогов
  const [draftProject, setDraftProject] = useState({ id: null, title: '', price: '', genre: '', rating: 5.0, downloads: '0', engine: '', image: '', description: '', award: '' });
  const [draftDevlog, setDraftDevlog] = useState({ id: null, title: '', category: '', game: '', summary: '', thumbnail: '', date: '' });
  const [gameForTransfer, setGameForTransfer] = useState<any | null>(null);

  const handleInitiateGameTransfer = (payload: {
    gameId: string;
    gameTitle: string;
    targetType: 'user' | 'team';
    targetIdentifier: string;
  }) => {
    triggerToast(
      `Запрос на передачу «${payload.gameTitle}» (${payload.targetType === 'user' ? 'пользователю' : 'команде'} ${payload.targetIdentifier}) отправлен`,
      'success'
    );
  };

  // --- INTERACTIVE INTERFACE STATES ---
  const [activeTab, setActiveTab] = useState('games'); // 'games' | 'devlogs' | 'jams' | 'members'
  const [searchQuery, setSearchQuery] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  // Contact Access Requests (FE-ACC-005: BR-ACC-016...019, FR-ACC-012...015)
  const [contactRequest, setContactRequest] = useState<'idle' | 'requested' | 'approved' | 'rejected'>('idle');
  const [contactInboxTab, setContactInboxTab] = useState<'pending' | 'grants'>('pending');
  
  const [mockContactRequests, setMockContactRequests] = useState([
    { id: '1', user: '@indie_dev_99', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop', status: 'pending', date: '2 часа назад' },
    { id: '2', user: '@pixel_artist', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop', status: 'approved', date: 'Вчера' }
  ]);

  const handleRequestContact = () => {
    setContactRequest('requested');
    setMockContactRequests(prev => {
      const exists = prev.find(r => r.id === 'curr_guest');
      if (exists) {
        return prev.map(r => r.id === 'curr_guest' ? { ...r, status: 'pending', date: 'Только что' } : r);
      }
      return [
        { id: 'curr_guest', user: '@current_user', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop', status: 'pending', date: 'Только что' },
        ...prev
      ];
    });
    triggerToast('Запрос контактов отправлен', 'success');
  };

  const handleCancelContactRequest = () => {
    setContactRequest('idle');
    setMockContactRequests(prev => prev.filter(r => r.id !== 'curr_guest'));
    triggerToast('Запрос контактов отменён', 'info');
  };

  const handleApproveContactRequest = (reqId: string, username: string) => {
    setMockContactRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'approved' } : r));
    if (reqId === 'curr_guest') {
      setContactRequest('approved');
    }
    triggerToast(`Доступ к контактам открыт для ${username}`, 'success');
  };

  const handleRejectContactRequest = (reqId: string, username: string) => {
    setMockContactRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'rejected' } : r));
    if (reqId === 'curr_guest') {
      setContactRequest('rejected');
    }
    triggerToast(`Запрос ${username} отклонён`, 'info');
  };

  const handleRevokeContactGrant = (reqId: string, username: string) => {
    setMockContactRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'rejected' } : r));
    if (reqId === 'curr_guest') {
      setContactRequest('idle');
    }
    triggerToast(`Доступ к контактам для ${username} отозван`, 'warning');
  };
  
  // Stage 6 Mocks
  const [systemRole, setSystemRole] = useState('none');
  const [hasPendingTransfers, setHasPendingTransfers] = useState(false);

  const [isCopiedRecently, setIsCopiedRecently] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  // Состояния FollowersDrawer
  const [isFollowersDrawerOpen, setIsFollowersDrawerOpen] = useState(false);
  const [followersDrawerTab, setFollowersDrawerTab] = useState<'followers' | 'following'>('followers');
  const [followersSearch, setFollowersSearch] = useState('');
  const [followStatuses, setFollowStatuses] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    [...MOCK_FOLLOWERS, ...MOCK_FOLLOWING].forEach(u => { init[u.id] = u.isFollowingBack; });
    return init;
  });

  // Вычисляемая видимость списков с учётом настроек приватности (BR-ACC-024, FR-ACC-020)
  const isFollowersHidden = effectiveRole !== 'owner' && (
    privacySettings.followers === 'private' || 
    (privacySettings.followers === 'followers' && !isFollowing)
  );
  const isFollowingHidden = effectiveRole !== 'owner' && (
    privacySettings.following === 'private' || 
    (privacySettings.following === 'followers' && !isFollowing)
  );
  const isFavoritesHidden = effectiveRole !== 'owner' && (
    privacySettings.favorites === 'private' || 
    (privacySettings.favorites === 'followers' && !isFollowing)
  );

  const { showToast } = useToast();
  const triggerToast = (msg: string, type: any = 'info') => {
    showToast(msg, type === 'error' ? 'danger' : type);
  };

  // Collection Modal
  const [collectionGameProfile, setCollectionGameProfile] = useState<any | null>(null);
  const [contextMenuProjectId, setContextMenuProjectId] = useState<string | null>(null);
  const mockCollections = [
    { id: 'col_1', title: 'Избранное', games_count: 12 },
    { id: 'col_2', title: 'Играть позже', games_count: 8 },
    { id: 'col_3', title: 'Инди-хорроры 2026', games_count: 5 }
  ];

  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [sortBy, setSortBy] = useState('popularity');
  

  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(500);
  const [accordionOpen, setAccordionOpen] = useState(false);

  // Хедер
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  
  const currentData = useMemo(() => profiles[profileType], [profiles, profileType]);

  // --- FE-ACC-004 STAGE 1: USERNAME COOLDOWN LOGIC (BR-ACC-011) ---
  const activeCooldownDate = overrideCooldown === false 
    ? null 
    : overrideCooldown === true 
      ? "2026-09-21T12:00:00Z" 
      : (currentData as any).usernameChangeAvailableAt;

  const isCooldownActive = Boolean(
    activeCooldownDate && new Date(activeCooldownDate).getTime() > Date.now()
  );

  const cooldownDaysRemaining = isCooldownActive
    ? Math.max(1, Math.ceil((new Date(activeCooldownDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  const cooldownAvailableDateFormatted = isCooldownActive
    ? new Date(activeCooldownDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  const validateUsername = (val: string) => {
    const cleaned = val.replace(/^@/, '').trim();
    if (!cleaned) return { valid: false, error: 'Никнейм обязателен для заполнения' };
    if (cleaned.length < 3) return { valid: false, error: 'Минимальная длина — 3 символа' };
    if (cleaned.length > 30) return { valid: false, error: 'Максимальная длина — 30 символов' };
    if (!/^[a-zA-Z0-9_]+$/.test(cleaned)) return { valid: false, error: 'Разрешены только латинские буквы, цифры и знак _' };
    const reserved = ['admin', 'administrator', 'moderator', 'support', 'hubigr', 'system', 'root', 'api'];
    if (reserved.includes(cleaned.toLowerCase())) return { valid: false, error: 'Этот никнейм зарезервирован платформой' };
    return { valid: true, error: '' };
  };

  const openEditProfileDrawer = () => {
    setDraftDisplayName(currentData.name || '');
    setDraftUsername(currentData.handle ? currentData.handle.replace(/^@/, '') : ((currentData as any).username || ''));
    setDraftProfession((currentData as any).profession || '');
    setDraftGameEngines([...((currentData as any).gameEngines || [])]);
    setNewEngineTag('');
    setDraftAvailability((currentData as any).availabilityStatus || '');
    setDraftBio(currentData.bio || '');
    setDraftLocation(currentData.location || '');
    setDraftExperience(currentData.experience || '');
    setDraftTechStack([...(currentData.techStack || [])]);
    setDraftLinks([...(currentData.links || [])]);
    setDraftAvatar(currentData.avatar || '');
    setOverrideCooldown(null);
    setActiveDrawer('developer');
  };

  useEffect(() => {
    if (visitorRole !== 'owner' || isPreviewPublicView) {
      setIsEditingMode(false);
    }
  }, [visitorRole, isPreviewPublicView]);

  useEffect(() => {
    setContactRequest('idle');
    setSearchQuery('');
    setAccordionOpen(false);
    setActiveDrawer(null);
    setIsShareModalOpen(false);
    setAvatarMenuOpen(false);
    setMoreMenuOpen(false);
    if (profileType !== 'team' && activeTab === 'members') {
      setActiveTab('games');
    }
  }, [profileType]);


  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/u/${currentData.handle.replace('@', '')}`;
    const el = document.createElement('textarea');
    el.value = shareUrl;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    try {
      document.execCommand('copy');
      setIsCopiedRecently(true);
      triggerToast('Ссылка скопирована в буфер обмена!', 'success');
      setTimeout(() => setIsCopiedRecently(false), 2000);
    } catch (err) {
      triggerToast('Не удалось скопировать ссылку', 'error');
    }
    document.body.removeChild(el);
  };

  const updateCurrentProfile = (key: string, value: any) => {
    setProfiles(prev => ({
      ...prev,
      [profileType]: {
        ...prev[profileType],
        [key]: value
      }
    }));
  };

  const updateCurrentProfileBatch = (updates: Record<string, any>) => {
    setProfiles(prev => ({
      ...prev,
      [profileType]: {
        ...prev[profileType],
        ...updates
      }
    }));
  };

  const handleSaveProfileDrawer = () => {
    const userVal = validateUsername(draftUsername);
    if (!isCooldownActive && !userVal.valid) {
      triggerToast(userVal.error, 'error');
      return;
    }

    const currentCleanUsername = currentData.handle.replace(/^@/, '');
    const newCleanUsername = draftUsername.replace(/^@/, '').trim();
    const isUsernameChanged = !isCooldownActive && newCleanUsername !== currentCleanUsername;

    const updates: Record<string, any> = {
      name: draftDisplayName.trim(),
      profession: draftProfession.trim(),
      gameEngines: draftGameEngines,
      availabilityStatus: draftAvailability.trim(),
      bio: draftBio,
      techStack: draftTechStack,
      links: draftLinks,
      location: draftLocation.trim(),
      experience: draftExperience.trim(),
      avatar: draftAvatar
    };

    if (isUsernameChanged) {
      updates.handle = `@${newCleanUsername}`;
      updates.username = newCleanUsername;
      // 30 days cooldown (BR-ACC-011)
      const nextCooldown = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      updates.usernameChangeAvailableAt = nextCooldown;
      setOverrideCooldown(null);
    } else if (overrideCooldown !== null) {
      updates.usernameChangeAvailableAt = activeCooldownDate;
    }

    updateCurrentProfileBatch(updates);
    setActiveDrawer(null);

    if (isUsernameChanged) {
      triggerToast(`Никнейм изменен на @${newCleanUsername}. Следующая смена доступна через 30 дней.`, 'success');
    } else {
      triggerToast('Профиль успешно обновлен', 'success');
    }
  };

  const handleStartEdit = () => {
    if (isBanned) {
      triggerToast('Редактирование профиля недоступно (блокировка)', 'error');
      return;
    }
    setProfileSnapshot(JSON.parse(JSON.stringify(profiles)));
    setIsEditingMode(true);
    triggerToast('Режим редактирования активирован', 'info');
  };

  const handleSaveAll = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsEditingMode(false);
      setProfileSnapshot(null);
      triggerToast('Изменения зафиксированы на сервере HUBIGR', 'success');
    }, 1500);
  };

  const handleCancelAll = () => {
    if (profileSnapshot) {
      setProfiles(profileSnapshot);
      setProfileSnapshot(null);
    }
    setIsEditingMode(false);
    setIsEditingName(false);
    setActiveDrawer(null);
    triggerToast('Все несохраненные изменения отменены', 'warning');
  };

  useEffect(() => {
    if (isBanned && isEditingMode) {
      handleCancelAll();
    }
  }, [isBanned]);

  const handleAvatarUpload = () => {
    if (!isEditingMode) return;
    setIsUploadingAvatar(true);
    setTimeout(() => {
      setIsUploadingAvatar(false);
      const avatars = [
        "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=300&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop"
      ];
      const nextAvatar = avatars[Math.floor(Math.random() * avatars.length)];
      updateCurrentProfile('avatar', nextAvatar);
      triggerToast('Аватар профиля успешно обновлен', 'success');
    }, 1200);
  };

  // COM-API-026, FR-COM-080, FR-COM-081: Public author threads in profile
  const userCommunityThreads = useMemo(() => {
    try {
      const all = getStoredCommunityThreads();
      const authorIdentifier = (currentData as any).username || 'kael_vostokov';
      return all.filter(t => {
        const isAuthor = t.authorNick === authorIdentifier || t.authorNick === 'kael_vostokov' || t.authorNick === 'gamedev_alex' || t.authorId === 'current_user';
        const isPublic = t.visibilityState === 'published' && !t.deletedAt;
        const isGlobal = !t.linkedJamId;
        return isAuthor && isPublic && isGlobal;
      });
    } catch {
      return [];
    }
  }, [currentData]);

  const tabCounts = useMemo(() => {
    if (dataState !== 'happy') {
      return { games: 0, devlogs: 0, jams: 0, members: 0, community: 0 };
    }
    return {
      games: currentData.projects?.length || 0,
      devlogs: currentData.devlogs?.length || 0,
      jams: currentData.jams?.length || 0,
      members: (currentData as any).members?.length || 0,
      community: userCommunityThreads.length
    };
  }, [dataState, currentData, userCommunityThreads]);

  const profileTabs = useMemo(() => {
    const isOwnerOrAdmin = effectiveRole === 'owner' || effectiveRole === 'captain';
    const hideJamAchievements = profileType === 'team' && (currentData as any).settings?.hideJamAchievements && !isOwnerOrAdmin;
    const hideMembers = profileType === 'team' && (currentData as any).settings?.hideMembers && !isOwnerOrAdmin;

    const list = [
      { id: 'games', label: 'Игры', count: tabCounts.games },
      { id: 'devlogs', label: 'Девлоги', count: tabCounts.devlogs },
    ];

    if (!hideJamAchievements) {
      list.push({ id: 'jams', label: 'Джемы', count: tabCounts.jams });
    }

    list.push(
      { id: 'community', label: 'Сообщество', count: tabCounts.community },
      { id: 'favorites', label: 'Избранное', count: 12 }
    );

    if (profileType === 'team' && !hideMembers) {
      list.push({ id: 'members', label: 'Участники', count: tabCounts.members });
    }
    return list;
  }, [tabCounts, profileType, currentData, effectiveRole]);

  const filteredProjects = useMemo(() => {
    if (dataState !== 'happy') return [];
    let items = [...currentData.projects];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(p => p.title.toLowerCase().includes(q) || p.genre.toLowerCase().includes(q));
    }
    if (sortBy === 'popularity') {
      items.sort((a, b) => parseInt(b.downloads.replace(/\s/g, '')) - parseInt(a.downloads.replace(/\s/g, '')));
    } else if (sortBy === 'rating') {
      items.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      items.sort((a, b) => b.id - a.id);
    }
    return items;
  }, [dataState, currentData, searchQuery, sortBy]);

  const filteredDevlogs = useMemo(() => {
    if (dataState !== 'happy') return [];
    let items = [...currentData.devlogs];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(d => d.title.toLowerCase().includes(q) || d.category.toLowerCase().includes(q));
    }
    return items;
  }, [dataState, currentData, searchQuery]);

  const filteredJams = useMemo(() => {
    if (dataState !== 'happy') return [];
    let items = [...currentData.jams];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(j => j.title.toLowerCase().includes(q) || j.nominations.toLowerCase().includes(q));
    }
    return items;
  }, [dataState, currentData, searchQuery]);

  const filteredCommunityThreads = useMemo(() => {
    if (dataState !== 'happy') return [];
    if (!searchQuery.trim()) return userCommunityThreads;
    const q = searchQuery.toLowerCase();
    return userCommunityThreads.filter(t => 
      t.title.toLowerCase().includes(q) || 
      t.tags.some(tag => tag.toLowerCase().includes(q))
    );
  }, [dataState, userCommunityThreads, searchQuery]);

  // БЕНТО 1: DEVELOPER / USER PASSPORT
  const renderCard1 = () => {
    const isCreatorProfile = Boolean(
      (currentData as any).profession || 
      ((currentData as any).gameEngines && (currentData as any).gameEngines.length > 0) ||
      (currentData.projects && currentData.projects.length > 0) ||
      currentData.experience
    );

    const hasAnyContent = Boolean(
      (currentData as any).profession ||
      ((currentData as any).gameEngines && (currentData as any).gameEngines.length > 0) ||
      (currentData as any).availabilityStatus ||
      currentData.bio || 
      currentData.location || 
      currentData.experience || 
      (currentData.techStack && currentData.techStack.length > 0) || 
      (currentData.links && currentData.links.length > 0)
    );

    return (
      <div className="bg-surface-1 border border-borderDef/40 p-6 rounded-card flex flex-col relative group shadow-elevation-raised">
        {isEditingMode && (
          <button 
            onClick={openEditProfileDrawer}
            className="absolute top-5 right-5 text-caption font-mono text-textTertiary hover:text-accent tracking-wider uppercase transition-colors duration-fast focus:outline-none cursor-pointer flex items-center gap-1"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Изменить</span>
          </button>
        )}

        <div className="flex items-center justify-between mb-4">
          <span className="overline block select-none">
            {isCreatorProfile ? 'Создатель' : 'О пользователе'}
          </span>
          {effectiveRole === 'owner' && (
            <span className="text-[10px] font-mono text-textTertiary bg-surface-2 px-2 py-0.5 rounded select-none">
              Публичный вид
            </span>
          )}
        </div>

        {/* Creator Dashboard переход для владельца аккаунта */}
        {effectiveRole === 'owner' && (
          <div className="mb-5 p-3.5 rounded-control bg-gradient-to-r from-surface-2/90 to-surface-2/40 border border-borderDef hover:border-accent/40 transition-colors flex items-center justify-between gap-3 select-none">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/25 flex items-center justify-center shrink-0">
                <LayoutDashboard className="w-4 h-4 text-accent" />
              </div>
              <div className="min-w-0">
                <div className="text-caption font-bold text-textPrimary truncate flex items-center gap-1.5">
                  <span>Панель автора</span>
                </div>
                <div className="text-[11px] text-textTertiary truncate">
                  Управление играми, сборками и аналитикой
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                if ((window as any).__hubigrNavigate) {
                  (window as any).__hubigrNavigate('/creator-dashboard');
                } else {
                  window.location.hash = '#/creator-dashboard';
                }
              }}
              className="text-caption font-mono font-bold text-accent hover:text-accent-hover flex items-center gap-1 shrink-0 px-2 py-1 rounded hover:bg-accent/10 transition-colors"
            >
              <span>В панель</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {hasAnyContent ? (
          <>
            {/* Специализация и статус доступности */}
            {((currentData as any).profession || (currentData as any).availabilityStatus) && (
              <div className="mb-4 pb-3 border-b border-borderDef/30">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  {(currentData as any).profession && (
                    <h3 className="text-body font-bold text-textPrimary leading-snug">
                      {(currentData as any).profession}
                    </h3>
                  )}
                  {(currentData as any).availabilityStatus && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-accent/10 border border-accent/30 text-accent select-none">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                      {(currentData as any).availabilityStatus}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="mb-4">
              {currentData.bio && (
                <p className="text-body-sm text-textSecondary font-sans mb-4 leading-relaxed">
                  {currentData.bio}
                </p>
              )}
              <div className="flex flex-col gap-2.5 text-caption font-sans text-textSecondary">
                {currentData.location && (
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-textTertiary shrink-0" />
                    <span>{currentData.location}</span>
                  </div>
                )}
                {currentData.experience && (
                  <div className="flex items-center gap-2.5">
                    <Briefcase className="w-4 h-4 text-textTertiary shrink-0" />
                    <span>{currentData.experience}</span>
                  </div>
                )}
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-textTertiary shrink-0" />
                  <span>На HUBIGR с {currentData.registeredAt}</span>
                </div>
              </div>
            </div>

            {/* Игровые движки */}
            {(currentData as any).gameEngines && (currentData as any).gameEngines.length > 0 && (
              <div className="border-t border-borderDef/40 pt-4 mt-2">
                <span className="overline mb-2.5 block select-none flex items-center gap-1.5">
                  <Gamepad2 className="w-3.5 h-3.5 text-textTertiary" />
                  <span>Игровые движки</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {((currentData as any).gameEngines as string[]).map((engine, idx) => (
                    <span key={idx} className="bg-surface-2 hover:bg-surface-3 border border-borderDef text-textPrimary text-[11px] font-mono font-semibold px-2.5 py-1 rounded-control select-none flex items-center gap-1.5 transition-colors">
                      <Layers className="w-3 h-3 text-accent shrink-0" />
                      {engine}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Технологии и стек */}
            {currentData.techStack && currentData.techStack.length > 0 && (
              <div className="border-t border-borderDef/40 pt-4 mt-4">
                <span className="overline mb-2.5 block select-none">
                  Технологии
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentData.techStack.map((tech, idx) => (
                    <span key={idx} className="bg-surface-2 border border-borderDef/40 text-textSecondary text-[11px] font-mono font-medium px-2 py-0.5 rounded-control select-none">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Ресурсы и ссылки */}
            {currentData.links && currentData.links.length > 0 && (
              <div className="border-t border-borderDef/40 pt-4 mt-4">
                <span className="overline mb-2.5 block select-none">
                  Ресурсы
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentData.links.map((link, idx) => (
                    <a 
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-surface-2 hover:bg-surface-3 border border-borderDef/40 hover:border-accent/40 text-textSecondary hover:text-accent transition-all duration-fast rounded-control px-2.5 py-1 text-caption font-mono flex items-center gap-1.5 select-none no-underline group/link"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-textTertiary group-hover/link:text-accent shrink-0 transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Minimal Profile Mode (BR-ACC-013) */
          <div className="py-6 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center text-textTertiary">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            {effectiveRole === 'owner' ? (
              <div className="max-w-xs flex flex-col items-center">
                <h4 className="text-body font-bold text-textPrimary mb-1">Расскажите о себе</h4>
                <p className="text-caption text-textSecondary mb-3 leading-normal">
                  Укажите специализацию, движки, биографию и ссылки, чтобы другие игроки и разработчики узнали о вас.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={openEditProfileDrawer}
                >
                  Заполнить информацию
                </Button>
              </div>
            ) : (
              <p className="text-body-sm font-sans text-textTertiary">
                Пользователь пока не добавил описание профиля.
              </p>
            )}
            <div className="flex items-center gap-2 text-caption text-textTertiary mt-2">
              <Calendar className="w-3.5 h-3.5 text-textTertiary shrink-0" />
              <span>На HUBIGR с {currentData.registeredAt}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  // БЕНТО 2: SECURE CONNECTION (Приватные контакты)
  const renderCard2 = () => {
    const pendingCount = mockContactRequests.filter(r => r.status === 'pending').length;

    return (
    <div className="bg-surface-1 border border-borderDef/40 p-6 rounded-card relative overflow-hidden shadow-elevation-raised">
      <div className="flex items-center justify-between mb-4">
        <span className="overline block select-none">
          Контакты
        </span>
        {effectiveRole === 'owner' && !isEditingMode && (
          <button 
            onClick={() => setActiveDrawer('contactInbox')}
            className={`flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
              pendingCount > 0 
                ? 'bg-accent/10 text-accent hover:text-accent-hover' 
                : 'bg-surface-2 text-textTertiary hover:text-textPrimary'
            }`}
          >
            <Bell className="w-3 h-3" />
            <span>{pendingCount > 0 ? `${pendingCount} запрос(ов)` : 'Запросы'}</span>
          </button>
        )}
      </div>

      {effectiveRole !== 'owner' && contactRequest === 'approved' && (
        <div className="mb-3 px-3 py-1.5 rounded-control bg-success/10 border border-success/30 flex items-center gap-2 text-caption text-success font-medium animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Доступ к контактам открыт владельцем</span>
        </div>
      )}

      <div className="flex flex-col gap-3 text-caption font-mono text-textSecondary">
        <div className="flex items-center gap-3">
          <Mail className="w-4 h-4 text-textTertiary shrink-0" />
          <span>{currentData.contacts.email}</span>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="w-4 h-4 text-textTertiary shrink-0" />
          <span>{currentData.contacts.phone}</span>
        </div>
        <div className="flex items-center gap-3">
          <Send className="w-4 h-4 text-textTertiary shrink-0" />
          <span>{currentData.contacts.telegram}</span>
        </div>
      </div>

      {effectiveRole !== 'owner' && contactRequest !== 'approved' ? (
        <div className="absolute inset-0 bg-surface-0/90 backdrop-blur-sm border border-borderDef/40 rounded-card flex flex-col items-center justify-center p-4 text-center z-10 transition-all duration-fast">
          {contactRequest === 'requested' ? (
            <div className="flex flex-col items-center gap-2 animate-fadeIn">
              <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center border border-accent/30 shadow-sm">
                <Info className="w-4 h-4 text-accent" />
              </div>
              <span className="text-caption font-bold text-accent font-mono mt-1">Запрос на рассмотрении</span>
              <p className="text-caption text-textTertiary max-w-[200px] mt-0.5 leading-normal">Владелец профиля получит уведомление</p>
              <button
                type="button"
                onClick={handleCancelContactRequest}
                className="mt-1 text-caption font-mono text-textTertiary hover:text-danger underline transition-colors cursor-pointer"
              >
                Отменить запрос
              </button>
            </div>
          ) : contactRequest === 'rejected' ? (
            <div className="flex flex-col items-center gap-2 animate-fadeIn">
              <div className="w-9 h-9 rounded-full bg-surface-2 flex items-center justify-center border border-borderDef">
                <Lock className="w-4.5 h-4.5 text-textTertiary" />
              </div>
              <span className="text-caption font-bold text-textPrimary font-mono">Запрос отклонён</span>
              <p className="text-caption text-textTertiary max-w-[200px] leading-normal">Владелец отклонил запрос на доступ к контактам</p>
              <Button 
                variant="secondary"
                size="sm"
                onClick={handleRequestContact}
                className="mt-1"
              >
                Запросить снова
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2.5 animate-fadeIn">
              <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center border border-accent/30">
                <Lock className="w-4.5 h-4.5 text-accent" />
              </div>
              <span className="text-caption font-bold text-textPrimary font-mono">Контакты скрыты</span>
              <Button 
                variant="secondary"
                size="sm"
                onClick={handleRequestContact}
                className="mt-1"
              >
                Запросить доступ
              </Button>
            </div>
          )}
        </div>
      ) : (
        isEditingMode && (
          <div className="absolute inset-0 bg-surface-0/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center z-10 transition-all">
            <Button 
              variant="secondary"
              size="sm"
              onClick={() => {
                setDraftContacts({ ...currentData.contacts });
                setActiveDrawer('contacts');
              }}
            >
              Настроить связь
            </Button>
          </div>
        )
      )}
    </div>
  );
  };

  // БЕНТО 3: SUPPORT CORE (Краудфандинг и внешние ссылки поддержки - BR-ACC-020, BR-ACC-021)
  const renderCard3 = () => {
    const supportLinks: any[] = (currentData as any).supportLinks || [];
    const donateDesc: string = (currentData as any).donateDesc || '';
    const hasSupport = supportLinks.length > 0 || Boolean(donateDesc);

    return (
      <div className="bg-surface-1 border border-borderDef/40 p-6 rounded-card flex flex-col gap-4 relative overflow-hidden shadow-elevation-raised">
        <div className="flex items-center justify-between">
          <span className="overline block select-none">
            Поддержать автора
          </span>
          {effectiveRole === 'owner' && isEditingMode && (
            <button 
              onClick={() => {
                setDraftDonateDesc(donateDesc);
                setDraftSupportLinks([...supportLinks]);
                setNewSupportPlatform('Boosty');
                setNewSupportUrl('');
                setNewSupportDesc('');
                setActiveDrawer('donate');
              }}
              className="text-caption font-mono text-textTertiary hover:text-accent tracking-wider uppercase transition-colors duration-fast focus:outline-none cursor-pointer flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Настроить</span>
            </button>
          )}
        </div>

        {hasSupport ? (
          <>
            {donateDesc && (
              <p className="text-body-sm text-textSecondary font-sans leading-relaxed">
                {donateDesc}
              </p>
            )}

            {/* Публичные ссылки поддержки (BR-ACC-020) */}
            {supportLinks.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-mono text-textTertiary uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-success" />
                  <span>Проверенные сервисы поддержки</span>
                </span>
                <div className="flex flex-col gap-2">
                  {supportLinks.map((link) => (
                    <button
                      key={link.id || link.url}
                      type="button"
                      onClick={() => openExternalSupportLink(link.url, link.platform)}
                      className="w-full p-3 rounded-control bg-surface-2 hover:bg-surface-3 border border-borderDef hover:border-accent/40 transition-all flex items-center justify-between gap-3 text-left group/slink cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded bg-surface-1 border border-borderDef/60 flex items-center justify-center text-textPrimary font-mono font-bold text-[11px] shrink-0 group-hover/slink:border-accent/40">
                          {link.platform.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-caption font-bold text-textPrimary truncate flex items-center gap-1.5">
                            <span>{link.platform}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-success" title="Верифицировано" />
                          </div>
                          {link.desc && (
                            <div className="text-[11px] text-textTertiary truncate font-sans">
                              {link.desc}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-mono text-textTertiary group-hover/slink:text-accent transition-colors shrink-0">
                        <span>Перейти</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Прямой донат на платформе */}
            <div className="pt-2 border-t border-borderDef/40 flex flex-col gap-2">
              <Button 
                variant="reaction"
                size="md"
                fullWidth
                icon={<Heart className="w-4 h-4 fill-current" />}
                onClick={() => setIsSupportOpen(true)}
              >
                Прямой донат (СБП / Карта)
              </Button>
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-textTertiary text-center font-sans">
                <ShieldCheck className="w-3 h-3 text-success shrink-0" />
                <span>Публичный доступ без запроса контактов</span>
              </div>
            </div>
          </>
        ) : (
          /* Minimal mode */
          <div className="py-4 flex flex-col items-center justify-center text-center gap-2">
            <p className="text-caption text-textTertiary">
              {effectiveRole === 'owner'
                ? 'Вы еще не настроили краудфандинг и ссылки для материальной поддержки.'
                : 'Автор пока не добавил ссылки для поддержки.'}
            </p>
            {effectiveRole === 'owner' && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setDraftDonateDesc('');
                  setDraftSupportLinks([]);
                  setNewSupportPlatform('Boosty');
                  setNewSupportUrl('');
                  setNewSupportDesc('');
                  setActiveDrawer('donate');
                }}
                className="mt-1"
              >
                Добавить реквизиты
              </Button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-surface-0 text-textSecondary font-sans relative antialiased select-none pb-24">
      
      <FontStyles />

      {/* DEV MATRIX CONTROL PANEL */}
      <DevMatrixPanel 
        bottomOffsetClass="bottom-36 md:bottom-0"
        pageName="Профиль"
        fields={[
          {
            id: 'profileType',
            label: 'Профиль',
            type: 'buttons',
            value: profileType,
            onChange: setProfileType,
            options: [
              { value: 'solo', label: 'Solo (Полный)' },
              { value: 'minimal', label: 'Минимальный' },
              { value: 'team', label: 'Команда' }
            ]
          },
          {
            id: 'dataState',
            label: 'Стейт данных',
            type: 'buttons',
            value: dataState,
            onChange: (st) => {
              setDataState(st);
              triggerToast(`Стейт переключен: ${st.toUpperCase()}`, 'info');
            },
            highlight: true,
            options: [
              { value: 'happy', label: 'happy' },
              { value: 'loading', label: 'loading' },
              { value: 'empty', label: 'empty' },
              { value: 'error', label: 'error' },
              { value: 'locked', label: 'locked' }
            ]
          },
          {
            id: 'visitorRole',
            label: 'Роль',
            type: 'buttons',
            value: visitorRole,
            onChange: setVisitorRole,
            options: [
              { value: 'owner', label: 'Владелец' },
              { value: 'guest', label: 'Гость' },
              { value: 'captain', label: 'Капитан' }
            ]
          },
          {
            id: 'previewMode',
            label: 'Режим предпросмотра (гость)',
            type: 'checkbox',
            value: isPreviewPublicView,
            onChange: setIsPreviewPublicView
          },
          {
            id: 'contactRequest',
            label: 'Запрос контактов',
            type: 'buttons',
            value: contactRequest,
            onChange: (st) => setContactRequest(st as any),
            options: [
              { value: 'idle', label: 'Скрыто' },
              { value: 'requested', label: 'Ожидает' },
              { value: 'approved', label: 'Открыто' },
              { value: 'rejected', label: 'Отклонено' }
            ]
          },
          {
            id: 'isBanned',
            label: 'Забанен',
            type: 'checkbox',
            value: isBanned,
            onChange: setIsBanned
          },
          {
            id: 'systemRole',
            label: 'Staff Роль',
            type: 'select',
            value: systemRole,
            onChange: setSystemRole,
            options: [
              { value: 'none', label: 'None' },
              { value: 'moderator', label: 'Moderator' },
              { value: 'superadmin', label: 'SuperAdmin' },
              { value: 'jury', label: 'Jury' }
            ]
          },
          {
            id: 'pendingTransfers',
            label: 'Запросы на владение',
            type: 'checkbox',
            value: hasPendingTransfers,
            onChange: setHasPendingTransfers
          }
        ]}
      />

      {/* ПЛАВАЮЩИЙ БАННЕР ПРЕДПРОСМОТРА (FE-ACC-004 Stage 4: Public View Preview) */}
      {visitorRole === 'owner' && isPreviewPublicView && (
        <div className="bg-accent text-white py-2.5 px-6 flex justify-between items-center z-30 sticky top-0 shadow-md backdrop-blur-md select-none transition-all animate-fadeIn">
          <div className="flex items-center gap-2.5 text-caption font-sans">
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Eye className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <span className="font-bold block sm:inline">Режим предпросмотра:</span>{' '}
              <span className="text-white/90">вы видите профиль глазами посетителя платформы</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsPreviewPublicView(false)}
            className="bg-white/15 hover:bg-white/25 text-white px-3 py-1.5 rounded-control text-caption font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ml-3"
          >
            <span>Вернуться к профилю</span>
          </button>
        </div>
      )}

      {/* =========================================================================
          0. СИСТЕМНЫЙ БАННЕР БЛОКИРОВКИ (Stage 5)
          ========================================================================= */}
      {isBanned && (
        <div className="bg-danger/10 border-b border-danger/30 py-3 px-6 flex justify-center items-center z-20 sticky top-10 backdrop-blur-md select-none transition-all">
          <div className="flex items-center gap-3">
            <AlertOctagon className="w-5 h-5 text-danger" />
            <span className="text-body-sm font-mono text-danger">
              {effectiveRole === 'owner' 
                ? 'Ваш аккаунт ограничен за нарушение правил платформы. Публикация нового контента недоступна.'
                : 'Этот аккаунт временно ограничен в правах за нарушение правил платформы.'}
            </span>
          </div>
        </div>
      )}

      {/* БАННЕР ВХОДЯЩЕЙ ПЕРЕДАЧИ ИГРЫ */}
      {hasPendingTransfers && effectiveRole === 'owner' && (
        <div className="bg-accent/10 border-b border-accent/30 py-3 px-6 flex justify-center items-center z-20 sticky top-10 backdrop-blur-md select-none transition-all">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <span className="text-body-sm font-mono text-textPrimary">
              Пользователь @indie_dev_99 передает вам права на игру "Cyber Quest".
            </span>
            <div className="flex gap-2 sm:ml-4">
              <Button size="sm" onClick={() => { setHasPendingTransfers(false); triggerToast('Вы стали владельцем игры', 'success'); }}>Принять</Button>
              <Button size="sm" variant="secondary" onClick={() => { setHasPendingTransfers(false); triggerToast('Передача отклонена', 'warning'); }}>Отклонить</Button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          1. СИСТЕМНЫЙ БАННЕР РЕДАКТИРОВАНИЯ
          ========================================================================= */}
      {isEditingMode && (
        <div className="bg-accent/10 border-b border-accent/30 py-2.5 px-6 flex justify-between items-center z-20 sticky top-10 backdrop-blur-md select-none transition-all">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="text-caption font-mono text-accent uppercase tracking-wider font-bold">
              Режим редактирования (активно)
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="bg-accent hover:bg-accent-hover text-white text-caption font-mono font-bold px-4 py-1.5 rounded-control transition-all duration-fast flex items-center gap-1.5 disabled:opacity-50 active:scale-[0.98] cursor-pointer"
            >
              {isSaving ? 'СОХРАНЕНИЕ...' : 'СОХРАНИТЬ'}
            </button>
            <button
              onClick={handleCancelAll}
              className="text-textTertiary hover:text-textPrimary text-caption font-mono transition-colors duration-fast focus:outline-none cursor-pointer"
            >
              ОТМЕНА
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          3. ГЕРОИЧЕСКАЯ ШАПКА ПРОФИЛЯ
          ========================================================================= */}
      <div className="relative w-full">

        {/* БАННЕР — увеличенная высота, hero-gradient поверх coverGlow */}
        <div className="w-full h-40 sm:h-56 lg:h-72 relative overflow-hidden">
          {/* Фоновое изображение */}
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop"
              alt="Profile cover"
              className="w-full h-full object-cover opacity-60 sm:opacity-40 lg:opacity-30"
            />
          </div>
          
          {/* Градиенты и эффекты поверх изображения */}
          <div className={`absolute inset-0 bg-gradient-to-r ${currentData.coverGlow} opacity-75 sm:opacity-60 blur-xl`} />
          <div className="absolute inset-0 bg-gradient-to-r from-surface-0 via-transparent to-surface-0 opacity-70" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] text-borderDef bg-[size:4rem_4rem] opacity-30" />
          
          {/* hero-gradient: плавный переход баннера в фон страницы снизу */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-surface-0/60 to-surface-0" />
        </div>

        {/* КОНТЕЙНЕР ИДЕНТИФИКАЦИИ — перекрывает баннер через -mt-28 */}
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 w-full relative z-10 -mt-16 sm:-mt-24 lg:-mt-28">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end w-full pb-8 border-b border-borderDef gap-6">

            {/* ЛЕВАЯ ЧАСТЬ: аватар + имя + бейджи + метрики */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">

              {/* АВАТАР (с поддержкой фоллбэка инициалов - BR-ACC-013) */}
              <div className="relative shrink-0 group/avatar">
                <div className={`w-24 h-24 sm:w-36 sm:h-36 p-1 bg-surface-0 border-4 border-surface-0 shadow-elevation-overlay overflow-hidden relative ${
                  profileType === 'solo' || profileType === 'minimal' ? 'rounded-full' : 'rounded-[20px] sm:rounded-[24px]'
                }`}>
                  {currentData.avatar ? (
                    <img
                      src={currentData.avatar}
                      alt="Profile Avatar"
                      className={`w-full h-full object-cover ${
                        profileType === 'solo' || profileType === 'minimal' ? 'rounded-full' : 'rounded-[16px] sm:rounded-[20px]'
                      }`}
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/20 via-surface-2 to-surface-3 text-accent font-mono font-bold text-heading-2 sm:text-heading-1 select-none ${
                      profileType === 'solo' || profileType === 'minimal' ? 'rounded-full' : 'rounded-[16px] sm:rounded-[20px]'
                    }`}>
                      {(currentData.name || currentData.handle.replace('@', '') || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  {isEditingMode && (
                    <div
                      onClick={handleAvatarUpload}
                      className={`absolute inset-0 backdrop-blur-sm bg-black/60 flex flex-col items-center justify-center cursor-pointer transition-opacity duration-base opacity-0 group-hover/avatar:opacity-100 ${
                        profileType === 'solo' || profileType === 'minimal' ? 'rounded-full' : 'rounded-[20px]'
                      }`}
                    >
                      {isUploadingAvatar ? (
                        <svg className="animate-spin h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      ) : (
                        <>
                          <Camera className="w-5 h-5 text-white" />
                          <span className="text-caption font-mono text-white font-bold tracking-wider mt-1">СМЕНИТЬ</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
                {/* Online-индикатор */}
                <span className="absolute bottom-2 right-2 w-4 h-4 bg-success border-[3px] border-surface-0 rounded-full shadow-sm" />
              </div>

              {/* ИМЯ (Display Name) + handle (@username) + бейджи + метрики */}
              <div className="flex flex-col gap-1 pb-1">

                {/* Основная строка: Имя (Display Name) или @username при отсутствии имени */}
                <div className="flex items-center gap-3 flex-wrap">
                  {isEditingName ? (
                    <div className="flex flex-col gap-1">
                      <input
                        type="text"
                        value={currentData.name}
                        placeholder="Отображаемое имя (необязательно)"
                        onChange={(e) => updateCurrentProfile('name', e.target.value)}
                        onBlur={() => setIsEditingName(false)}
                        onKeyDown={(e) => { if (e.key === 'Enter') setIsEditingName(false); }}
                        autoFocus
                        className="bg-surface-2 border border-borderDef text-heading-3 font-bold text-textPrimary rounded-control px-2.5 py-1 outline-none focus:border-accent"
                      />
                      <span className="text-[11px] font-sans text-textTertiary">
                        Отображаемое имя опционально. Нажмите Enter для сохранения.
                      </span>
                    </div>
                  ) : (
                    <div
                      onClick={() => { 
                        if (isEditingMode) {
                          openEditProfileDrawer();
                        }
                      }}
                      className={`flex items-center gap-2.5 ${isEditingMode ? 'cursor-pointer group/title' : ''}`}
                      title={isEditingMode ? 'Нажмите для редактирования профиля' : undefined}
                    >
                      <h2 className={`text-heading-2 sm:text-heading-2 lg:text-heading-1 font-bold text-textPrimary tracking-tight leading-none transition-colors ${isEditingMode ? 'group-hover/title:text-accent' : ''}`}>
                        {currentData.name ? currentData.name : currentData.handle}
                      </h2>
                      {isEditingMode && (
                        <Edit3 className="w-4 h-4 text-textTertiary group-hover/title:text-accent transition-colors duration-base" />
                      )}
                    </div>
                  )}
                  {currentData.name && (
                    <span className="bg-accent text-white text-caption font-mono font-bold px-2 py-0.5 rounded-control uppercase tracking-wider select-none">
                      PRO
                    </span>
                  )}
                  {systemRole === 'superadmin' && (
                    <span className="bg-danger text-white text-caption font-bold px-2 py-0.5 rounded-control uppercase tracking-wider select-none border border-danger shadow-[0_0_8px_rgba(239,68,68,0.4)]" title="Super Admin">
                      SUPER ADMIN
                    </span>
                  )}
                  {systemRole === 'moderator' && (
                    <span className="bg-warning text-bgDefault text-caption font-bold px-2 py-0.5 rounded-control uppercase tracking-wider select-none" title="Moderator">
                      MODERATOR
                    </span>
                  )}
                  {systemRole === 'jury' && (
                    <span className="bg-success text-white text-caption font-bold px-2 py-0.5 rounded-control uppercase tracking-wider select-none" title="Jury">
                      JURY
                    </span>
                  )}
                </div>

                {/* Вторая строка: @username (показывается только если имя задано, исключая дублирование - BR-ACC-012) */}
                {currentData.name ? (
                  <div className="flex items-center gap-2">
                    <span className="text-body-sm font-mono text-textTertiary leading-none">
                      {currentData.handle}
                    </span>
                    {isEditingMode && (
                      <button
                        type="button"
                        onClick={openEditProfileDrawer}
                        className="text-[11px] font-mono text-textTertiary hover:text-accent flex items-center gap-1 transition-colors px-1.5 py-0.5 rounded hover:bg-surface-2"
                        title="Настройки никнейма и кулдауна (BR-ACC-011)"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>сменить никнейм</span>
                      </button>
                    )}
                  </div>
                ) : (
                  isEditingMode && (
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[12px] font-sans text-textTertiary italic">
                        Отображаемое имя не задано (используется @username)
                      </span>
                      <button
                        type="button"
                        onClick={openEditProfileDrawer}
                        className="text-[11px] font-mono text-accent hover:underline flex items-center gap-1"
                      >
                        + добавить имя
                      </button>
                    </div>
                  )
                )}

                {/* КЛИКАБЕЛЬНЫЕ МЕТРИКИ: подписчики / подписки */}
                <div className="flex items-center gap-3 text-body-sm font-mono mt-0.5">
                  <button
                    type="button"
                    onClick={() => { setIsFollowersDrawerOpen(true); setFollowersDrawerTab('followers'); }}
                    className="flex items-center gap-1 hover:text-accent transition-colors duration-base rounded-sm"
                  >
                    {isFollowersHidden ? (
                      <span className="flex items-center gap-1 text-textTertiary" title="Скрыто настройками приватности">
                        <Lock className="w-3 h-3 text-textDisabled" />
                        <span>—</span>
                      </span>
                    ) : (
                      <span className="font-bold text-textPrimary flex items-center gap-1">
                        <span>{dataState !== 'happy' ? '0' : currentData.stats.followers}</span>
                        {effectiveRole === 'owner' && privacySettings.followers !== 'public' && (
                          <span title={privacySettings.followers === 'private' ? 'Видно только вам' : 'Видно только подписчикам'}>
                            <Lock className="w-2.5 h-2.5 text-textTertiary" />
                          </span>
                        )}
                      </span>
                    )}
                    <span className="text-textTertiary font-normal underline decoration-dotted underline-offset-2">
                      подписчиков
                    </span>
                  </button>
                  <span className="text-textDisabled">•</span>
                  <button
                    type="button"
                    onClick={() => { setIsFollowersDrawerOpen(true); setFollowersDrawerTab('following'); }}
                    className="flex items-center gap-1 hover:text-accent transition-colors duration-base rounded-sm"
                  >
                    {isFollowingHidden ? (
                      <span className="flex items-center gap-1 text-textTertiary" title="Скрыто настройками приватности">
                        <Lock className="w-3 h-3 text-textDisabled" />
                        <span>—</span>
                      </span>
                    ) : (
                      <span className="font-bold text-textPrimary flex items-center gap-1">
                        <span>{dataState !== 'happy' ? '0' : currentData.stats.following}</span>
                        {effectiveRole === 'owner' && privacySettings.following !== 'public' && (
                          <span title={privacySettings.following === 'private' ? 'Видно только вам' : 'Видно только подписчикам'}>
                            <Lock className="w-2.5 h-2.5 text-textTertiary" />
                          </span>
                        )}
                      </span>
                    )}
                    <span className="text-textTertiary font-normal underline decoration-dotted underline-offset-2">
                      подписок
                    </span>
                  </button>
                </div>

                {/* БЕЙДЖИ */}
                {currentData.badges && currentData.badges.length > 0 && (
                  <div className="mt-1.5">
                    <BadgeRow badges={currentData.badges as any} />
                  </div>
                )}

                {/* Кнопка редактирования бейджей */}
                {isEditingMode && (
                  <button
                    onClick={() => {
                      setDraftBadges([...(currentData.badges as any)]);
                      setActiveDrawer('badges');
                    }}
                    className="mt-2 text-caption font-mono text-textTertiary hover:text-accent transition-colors duration-base flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Управление бейджами
                  </button>
                )}

              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0 select-none">
              {effectiveRole === 'owner' ? (
                <>
                  <button 
                    onClick={() => {
                      if (isEditingMode) {
                        handleSaveAll();
                      } else {
                        handleStartEdit();
                      }
                    }}
                    className="flex-1 md:flex-initial bg-accent hover:bg-accent-hover text-white h-10 px-5 rounded-control font-bold text-caption tracking-wider flex items-center justify-center gap-2 transition-all duration-fast active:scale-[0.98] shadow-sm cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 shrink-0" />
                    {isEditingMode ? 'Сохранить' : 'Редактировать'}
                  </button>
                  {profileType === 'team' && !isEditingMode && (
                    <button 
                      onClick={() => setActiveDrawer('manageTeam')}
                      className="bg-surface-2 hover:bg-surface-3 border border-borderDef hover:border-borderStrong text-textPrimary h-10 px-4 rounded-control text-caption font-bold flex items-center justify-center gap-2 transition-all duration-fast active:scale-[0.98] cursor-pointer"
                    >
                      <Users className="w-4 h-4 shrink-0" />
                      <span className="hidden sm:inline">Команда</span>
                    </button>
                  )}
                  {!isEditingMode && (
                    <button 
                      onClick={() => {
                        if ((window as any).__hubigrNavigate) {
                          (window as any).__hubigrNavigate('/creator-dashboard');
                        } else {
                          window.location.hash = '#/creator-dashboard';
                        }
                      }}
                      className="bg-surface-2 hover:bg-surface-3 border border-borderDef hover:border-borderStrong text-textPrimary h-10 px-3.5 rounded-control text-caption font-bold flex items-center justify-center gap-2 transition-all duration-fast active:scale-[0.98] cursor-pointer"
                      title="Панель автора — управление проектами, сборками и аналитикой"
                    >
                      <LayoutDashboard className="w-4 h-4 text-accent shrink-0" />
                      <span className="hidden sm:inline">Панель автора</span>
                    </button>
                  )}
                  {!isEditingMode && (
                    <button 
                      onClick={() => setIsPreviewPublicView(true)}
                      className="bg-surface-2 hover:bg-surface-3 border border-borderDef hover:border-borderStrong text-textPrimary h-10 px-3.5 rounded-control text-caption font-bold flex items-center justify-center gap-2 transition-all duration-fast active:scale-[0.98] cursor-pointer"
                      title="Предпросмотр: посмотреть профиль глазами гостя"
                    >
                      <Eye className="w-4 h-4 text-textTertiary shrink-0" />
                      <span className="hidden xl:inline">Предпросмотр</span>
                    </button>
                  )}
                  {!isEditingMode && (
                    <button 
                      onClick={() => {
                        setDraftPrivacySettings({ ...privacySettings });
                        setActiveDrawer('privacy');
                      }}
                      className="bg-surface-2 hover:bg-surface-3 border border-borderDef hover:border-borderStrong text-textPrimary h-10 px-3.5 rounded-control text-caption font-bold flex items-center justify-center gap-2 transition-all duration-fast active:scale-[0.98] cursor-pointer"
                      title="Настройки приватности (подписчики, подписки, избранное)"
                    >
                      <Lock className="w-4 h-4 text-textTertiary shrink-0" />
                      <span className="hidden xl:inline">Приватность</span>
                    </button>
                  )}
                  <button 
                    onClick={() => setIsShareModalOpen(true)}
                    className="bg-surface-2 hover:bg-surface-3 border border-borderDef hover:border-borderStrong text-textPrimary h-10 px-4 rounded-control text-caption font-bold flex items-center justify-center gap-2 transition-all duration-fast active:scale-[0.98] cursor-pointer"
                  >
                    <Share2 className="w-4 h-4 shrink-0" />
                    <span className="hidden sm:inline">Поделиться</span>
                  </button>
                  {!isEditingMode && (
                    <button 
                      onClick={() => {
                        if ((window as any).__hubigrNavigate) {
                          (window as any).__hubigrNavigate('/settings/security');
                        } else {
                          window.location.hash = '#/settings/security';
                        }
                      }}
                      className="bg-surface-2 hover:bg-surface-3 border border-borderDef hover:border-borderStrong text-textPrimary h-10 w-10 flex shrink-0 items-center justify-center rounded-control transition-all duration-fast active:scale-[0.98] cursor-pointer"
                      title="Безопасность и Настройки"
                    >
                      <Shield className="w-4 h-4" />
                    </button>
                  )}
                </>
              ) : (
                <>
                  {/* Кнопка "Пригласить в команду" (для Капитанов при просмотре Solo-разработчиков) */}
                  {visitorRole === 'captain' && profileType === 'solo' && (
                    <button
                      onClick={() => {
                        setInviteRole('Level Designer / 3D');
                        setInviteMessage('');
                        setActiveDrawer('inviteTeam');
                      }}
                      className="bg-surface-2 hover:bg-surface-3 border border-accent/40 text-accent h-10 px-4 rounded-control text-caption font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-fast active:scale-[0.98] cursor-pointer"
                    >
                      <UserPlus className="w-4 h-4 shrink-0 text-accent" />
                      <span>В команду</span>
                    </button>
                  )}

                  <button 
                    onClick={() => {
                      setIsFollowing(!isFollowing);
                      triggerToast(isFollowing ? 'Вы отписались от автора' : 'Вы успешно подписались!', 'success');
                    }}
                    className={`flex-1 md:flex-initial h-10 px-5 rounded-control font-bold text-caption tracking-wider flex items-center justify-center gap-2 transition-all duration-fast active:scale-[0.98] cursor-pointer shadow-sm ${
                      isFollowing 
                        ? 'bg-surface-2 border border-accent/30 text-accent hover:bg-surface-3' 
                        : 'bg-accent hover:bg-accent-hover text-white'
                    }`}
                  >
                    {isFollowing ? <Check className="w-4 h-4 shrink-0" /> : <Plus className="w-4 h-4 shrink-0" />}
                    <span>{isFollowing ? 'Подписан' : 'Подписаться'}</span>
                  </button>

                  <button 
                    onClick={() => setIsShareModalOpen(true)}
                    className="bg-surface-2 hover:bg-surface-3 border border-borderDef hover:border-borderStrong text-textPrimary h-10 px-4 rounded-control text-caption font-bold flex items-center justify-center gap-2 transition-all duration-fast active:scale-[0.98] cursor-pointer"
                    title="Поделиться профилем"
                  >
                    <Share2 className="w-4 h-4 shrink-0" />
                  </button>

                  {/* Контекстное меню "Ещё" (...) */}
                  <div className="relative">
                    <button 
                      onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                      className="bg-surface-2 hover:bg-surface-3 border border-borderDef hover:border-borderStrong text-textTertiary hover:text-textPrimary h-10 px-3.5 rounded-control flex items-center justify-center transition-all duration-fast active:scale-[0.98] cursor-pointer"
                      title="Ещё"
                    >
                      <MoreVertical className="w-4 h-4 shrink-0" />
                    </button>

                    {moreMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setMoreMenuOpen(false)} />
                        <div className="absolute right-0 top-full mt-2 w-52 bg-surface-3 border border-borderDef rounded-xl py-1 shadow-elevation-overlay z-50 flex flex-col font-sans text-caption animate-fadeIn">
                          <button 
                            onClick={() => {
                              setMoreMenuOpen(false);
                              setActiveDrawer('reportProfile');
                            }}
                            className="text-left px-4 py-2.5 hover:bg-surface-3 text-textSecondary hover:text-textPrimary transition-colors duration-120 flex items-center gap-2.5 cursor-pointer"
                          >
                            <Flag className="w-3.5 h-3.5 text-danger" />
                            <span>Пожаловаться на профиль</span>
                          </button>
                          <div className="border-t border-borderDef my-0.5" />
                          <button 
                            onClick={() => {
                              setMoreMenuOpen(false);
                              triggerToast('Пользователь заблокирован', 'warning');
                            }}
                            className="text-left px-4 py-2.5 hover:bg-surface-3 text-danger hover:text-accent-hover transition-colors duration-120 flex items-center gap-2.5 cursor-pointer"
                          >
                            <UserX className="w-3.5 h-3.5 text-danger" />
                            <span>Заблокировать</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* =========================================================================
          4. ДВУХКОЛОНОЧНЫЙ БЕНТО-ЛЕЙАУТ
          ========================================================================= */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 mt-6 sm:mt-8 lg:mt-12 grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-x-8 gap-y-6 lg:gap-y-6 items-start w-full">
        
        {/* ПРАВАЯ КОЛОНКА (Контентный хаб) — на мобилках идет ПЕРВОЙ под шапкой */}
        <section className="order-1 lg:order-none lg:col-start-2 lg:row-start-1 lg:row-span-4 w-full flex flex-col gap-6">

          <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
            <Tabs
              tabs={profileTabs}
              activeTab={activeTab}
              onChange={setActiveTab}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 w-full">
            <div className="w-full sm:w-[320px]">
              <SearchInput
                variant="surface-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery('')}
                placeholder="Поиск по архиву..."
              />
            </div>

            {activeTab === 'games' && dataState === 'happy' && (
              <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto shrink-0 select-none">
                <span className="text-xs sm:text-sm text-textTertiary font-mono whitespace-nowrap sm:hidden">
                  Найдено: <strong className="text-textPrimary">{filteredProjects.length}</strong>
                </span>
                <CustomSelect
                  variant="surface-0"
                  value={sortBy}
                  onChange={setSortBy}
                  options={[
                    { value: 'popularity', label: 'По популярности' },
                    { value: 'rating', label: 'По рейтингу' },
                    { value: 'newest', label: 'Сначала новые' },
                  ]}
                  icon={<ArrowUpDown className="w-3.5 h-3.5 text-accent" />}
                  className="sm:w-[220px]"
                />
              </div>
            )}
          </div>

          {/* =========================================================================
              РЕНДЕР КАТЕГОРИЙ ДАННЫХ И 5 СИСТЕМНЫХ СОСТОЯНИЙ
              ========================================================================= */}
          <div className="w-full mt-2">
            
            {/* А. СТЕЙТ - LOADING */}
            {dataState === 'loading' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="bg-surface-1 border border-borderDef rounded-2xl overflow-hidden p-5 space-y-4 animate-pulse">
                      <div className="aspect-[16/10] bg-surface-2 rounded-xl" />
                      <div className="h-4 bg-surface-2 w-3/4 rounded" />
                      <div className="h-3 bg-surface-2 w-1/2 rounded" />
                      <div className="h-3 bg-surface-2 w-5/6 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Б. СТЕЙТ - LOCKED */}
            {dataState === 'locked' && (
              <div className="w-full py-20 flex flex-col items-center text-center gap-4 border border-dashed border-borderDef rounded-2xl bg-surface-1/50 animate-fadeIn">
                <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center border border-warning/30">
                  <Lock className="w-6 h-6 text-warning" />
                </div>
                <div className="flex flex-col gap-1 px-4 select-none">
                  <h4 className="text-body-sm font-bold text-textPrimary font-mono uppercase tracking-wider">ДОСТУП ОГРАНИЧЕН</h4>
                  <p className="text-caption text-textTertiary max-w-[420px]">
                    Этот раздел закрыт владельцем архива или требует прямого участия в текущем активном геймджеме.
                  </p>
                </div>
              </div>
            )}

            {/* В. СТЕЙТ - ERROR */}
            {dataState === 'error' && (
              <div className="w-full py-20 flex flex-col items-center text-center gap-4 border border-danger/30 rounded-2xl bg-danger/5 animate-fadeIn">
                <AlertOctagon className="w-12 h-12 text-danger" />
                <div className="flex flex-col gap-1 px-4 select-none">
                  <h4 className="text-body-sm font-bold text-textPrimary font-mono uppercase tracking-wider">Ошибка загрузки данных</h4>
                  <p className="text-caption text-textTertiary max-w-[420px]">
                    Не удалось получить стабильный ответ от веб-шлюза HUBIGR. Проверьте подключение к сети.
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setDataState('happy');
                    triggerToast('Попытка восстановления связи...', 'info');
                  }}
                  className="mt-2 bg-surface-2 hover:bg-surface-3 border border-borderDef text-textPrimary text-caption font-bold uppercase tracking-wider h-11 px-6 rounded-xl transition-colors duration-120 flex items-center gap-2 active:scale-95"
                >
                  <RefreshCw className="w-4 h-4" />
                  Повторить попытку
                </button>
              </div>
            )}

            {/* Г. СТЕЙТ - EMPTY */}
            {dataState === 'empty' && (
              <div className="w-full py-20 flex flex-col items-center text-center gap-4 border border-dashed border-borderDef rounded-2xl bg-surface-1 animate-fadeIn">
                <Layers className="w-12 h-12 text-textTertiary" />
                <div className="flex flex-col gap-1 px-4 select-none">
                  <h4 className="text-body-sm font-bold text-textPrimary font-mono uppercase tracking-wider">Раздел пуст</h4>
                  <p className="text-caption text-textTertiary max-w-[420px]">
                    Данный разработчик пока не добавил новые метаданные в эту категорию.
                  </p>
                </div>
              </div>
            )}

            {/* Д. СТЕЙТ - HAPPY */}
            {dataState === 'happy' && (
              <>
                {/* 1. TAB: GAMES */}
                {activeTab === 'games' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 animate-fadeIn isolate">

                    {isEditingMode && (
                      <div
                        onClick={() => {
                          setDraftProject({ id: null, title: '', price: 'Бесплатно', genre: 'Разработка', rating: 5.0, downloads: '0', engine: 'Unity', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop', description: '', award: '' });
                          setActiveDrawer('addProject');
                        }}
                        className="border-2 border-dashed border-borderDef hover:border-accent rounded-card flex flex-col items-center justify-center p-8 transition-colors duration-base cursor-pointer min-h-[280px] group bg-surface-1/30 hover:bg-surface-1"
                      >
                        <Plus className="w-8 h-8 text-textTertiary group-hover:text-accent transition-colors duration-base" />
                        <span className="text-caption font-mono text-textTertiary mt-2 group-hover:text-textPrimary tracking-wider uppercase font-bold">Добавить проект</span>
                      </div>
                    )}

                    {filteredProjects.length > 0 ? filteredProjects.map((project) => (
                      <ProfileGameCard 
                        key={project.id}
                        project={project}
                        isEditingMode={isEditingMode}
                        onEdit={(p) => { setDraftProject({ ...p }); setActiveDrawer('editProject'); }}
                        onDelete={(p) => { updateCurrentProfile('projects', currentData.projects.filter(pr => pr.id !== p.id)); triggerToast(`Проект "${p.title}" удалён`, 'warning'); }}
                        onQuickPlay={(p) => triggerToast(`Запуск ${p.title} в браузере...`, 'info')}
                        onToggleCollection={(p) => setCollectionGameProfile(p)}
                        onOpenContextMenu={(e, p) => setContextMenuProjectId(contextMenuProjectId === p.id ? null : p.id)}
                        contextMenuOpen={(contextMenuProjectId as any) === (project.id as any)}
                        onCloseContextMenu={() => setContextMenuProjectId(null)}
                        triggerToast={triggerToast}
                        onTransferOwnership={effectiveRole === 'owner' ? (p) => setGameForTransfer(p) : undefined}
                      />
                    )) : (
                      <div className="col-span-2 w-full py-16 flex flex-col items-center text-center gap-3 border border-dashed border-borderDef rounded-card bg-surface-1 animate-fadeIn">
                        <Layers className="w-10 h-10 text-textTertiary" />
                        <span className="text-caption font-mono text-textTertiary uppercase tracking-wider">Проекты отсутствуют</span>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. TAB: DEVLOGS */}
                {activeTab === 'devlogs' && (
                  <div className="flex flex-col gap-4 animate-fadeIn">

                    {isEditingMode && (
                      <div
                        onClick={() => {
                          setDraftDevlog({ id: null, title: '', category: 'Разработка', game: currentData.projects[0]?.title || 'PROJECT', summary: '', thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=200&auto=format&fit=crop', date: 'Сегодня' });
                          setActiveDrawer('addDevlog');
                        }}
                        className="border-2 border-dashed border-borderDef hover:border-accent rounded-card flex items-center justify-center p-5 transition-colors duration-base cursor-pointer min-h-[80px] group bg-surface-1/30 hover:bg-surface-1"
                      >
                        <Plus className="w-5 h-5 text-textTertiary group-hover:text-accent transition-colors mr-2" />
                        <span className="text-caption font-mono text-textTertiary group-hover:text-textPrimary tracking-wider uppercase font-bold">Написать девлог</span>
                      </div>
                    )}

                    {filteredDevlogs.length > 0 ? filteredDevlogs.map((devlog) => {
                      const postTypeMeta: Record<string, { label: string; cls: string }> = {
                        patchnote:    { label: 'Патчноут',  cls: 'bg-success/15 text-success border-success/30'    },
                        announcement: { label: 'Анонс',     cls: 'bg-accent/15 text-accent border-accent/30'        },
                        article:      { label: 'Статья',    cls: 'bg-surface-3 text-textSecondary border-borderDef' },
                        devlog:       { label: 'Девлог',    cls: 'bg-info/10 text-info border-info/30'              },
                      };
                      const typeMeta = postTypeMeta[devlog.postType] ?? postTypeMeta['article'];
                      return (
                        <article
                          key={devlog.id}
                          className="p-4 sm:p-6 bg-surface-1 border border-borderDef rounded-2xl space-y-4 hover:border-borderStrong transition-all duration-base cursor-pointer group relative shadow-elevation-base"
                        >
                          {isEditingMode && (
                            <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20 bg-surface-1/90 backdrop-blur-md p-1.5 rounded-control border border-borderDef opacity-0 group-hover:opacity-100 transition-opacity duration-base">
                              <Edit3 onClick={(e) => { e.stopPropagation(); setDraftDevlog({ ...devlog }); setActiveDrawer('editDevlog'); }} className="w-4 h-4 text-textTertiary hover:text-accent cursor-pointer transition-colors" />
                              <Trash2 onClick={(e) => { e.stopPropagation(); updateCurrentProfile('devlogs', currentData.devlogs.filter(d => d.id !== devlog.id)); triggerToast('Девлог удалён', 'warning'); }} className="w-4 h-4 text-textTertiary hover:text-danger cursor-pointer transition-colors" />
                            </div>
                          )}

                          {/* Верхняя строка: аватар + имя + дата + postType-бейдж + ссылка на игру */}
                          <div className="flex flex-wrap items-center justify-between gap-3 text-caption">
                            <div className="flex items-center gap-3">
                              <img src={currentData.avatar} alt={currentData.name} className="w-8 h-8 rounded-full object-cover border border-borderDef bg-surface-2 shrink-0" />
                              <div>
                                <span className="text-textPrimary font-semibold text-body-sm">{currentData.name}</span>
                                <span className="text-textTertiary font-mono text-caption ml-2">{devlog.date}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`px-2.5 py-1 rounded-control border font-mono font-bold text-caption ${typeMeta.cls}`}>{typeMeta.label}</span>
                              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-control bg-surface-2 hover:bg-surface-3 text-textSecondary hover:text-textPrimary font-mono text-caption border border-borderDef transition-colors">
                                <Gamepad2 className="w-3.5 h-3.5 text-accent shrink-0" />{devlog.game}
                              </span>
                            </div>
                          </div>

                          {/* Заголовок + описание */}
                          <div className="space-y-2">
                            <h4 className="text-heading-3 font-bold text-textPrimary group-hover:text-accent transition-colors duration-base leading-snug">{devlog.title}</h4>
                            <p className="text-body-sm text-textSecondary">{devlog.summary}</p>
                          </div>

                          {/* Изображение девлога (если есть) */}
                          {(devlog as any).image && (
                            <div className="aspect-video w-full rounded-xl overflow-hidden border border-borderDef bg-surface-2">
                              <img 
                                src={(devlog as any).image} 
                                alt={devlog.title} 
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                              />
                            </div>
                          )}

                          {/* Футер: метрики + кнопка "Читать полностью" */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-borderDef text-caption font-mono text-textTertiary">
                            <div className="flex items-center gap-4 sm:gap-6">
                              <button 
                                onClick={(e) => { e.stopPropagation(); triggerToast('Лайк!', 'success'); }}
                                className="flex items-center gap-2 hover:text-danger transition-colors group/like"
                              >
                                <Heart className="w-4 h-4 group-hover/like:scale-110 transition-transform" />
                                <span>{(devlog as any).stats?.likes || 0}</span>
                              </button>
                              <span className="flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" />
                                {(devlog as any).stats?.comments || 0}
                              </span>
                              <span className="flex items-center gap-2">
                                <Eye className="w-4 h-4" />
                                {(devlog as any).stats?.views || 0}
                              </span>
                            </div>
                            <span className="text-accent hover:underline flex items-center gap-1.5 font-bold">
                              <span>Читать полностью</span>
                              <ArrowRight className="w-4 h-4" />
                            </span>
                          </div>
                        </article>
                      );
                    }) : (
                      <div className="w-full py-16 flex flex-col items-center text-center gap-3 border border-dashed border-borderDef rounded-card bg-surface-1 animate-fadeIn">
                        <Info className="w-10 h-10 text-textTertiary" />
                        <span className="text-caption font-mono text-textTertiary uppercase tracking-wider">Девлоги отсутствуют</span>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. TAB: JAMS */}
                {activeTab === 'jams' && (
                  <div className="flex flex-col gap-5 animate-fadeIn">
                    {filteredJams.length > 0 ? filteredJams.map((jam) => (
                      <article
                        key={jam.id}
                        onClick={() => triggerToast(`Переход: ${jam.title}`, 'info')}
                        className="bg-surface-1 border border-borderDef rounded-card overflow-hidden hover:border-borderStrong hover:bg-surface-2 transition-all duration-base cursor-pointer group shadow-elevation-raised"
                      >
                        {/* Верхняя зона: award-бейджи + название + оценка */}
                        <div className="p-5 space-y-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-control bg-celebratory/10 border border-celebratory/30 text-celebratory text-caption font-mono font-bold flex items-center gap-1.5">
                              <Trophy className="w-3.5 h-3.5 text-celebratory shrink-0" />{jam.award}
                            </span>
                            {jam.nominations.split('&bull;').map((nom, idx) => (
                              <span key={idx} className="px-2.5 py-0.5 rounded-control bg-surface-3 border border-borderDef text-textSecondary text-caption font-mono" dangerouslySetInnerHTML={{ __html: nom.trim() }} />
                            ))}
                          </div>

                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <span className="text-caption font-mono text-textTertiary uppercase tracking-wider block">{jam.date}</span>
                              <h4 className="text-heading-3 font-bold text-textPrimary group-hover:text-accent transition-colors duration-base mt-0.5">{jam.title}</h4>
                            </div>
                            {jam.score && (
                              <div className="text-right shrink-0">
                                <div className="flex items-center gap-1 font-mono font-black text-celebratory text-heading-2 justify-end">
                                  <Star className="w-5 h-5 fill-celebratory text-celebratory" />{jam.score}
                                </div>
                                <div className="text-caption font-mono text-textTertiary">{jam.rank}</div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Нижняя зона: поданная работа + роль */}
                        {jam.submissionTitle && (
                          <div className="mx-4 mb-4 sm:mx-5 sm:mb-5 p-3.5 sm:p-4 bg-surface-2 rounded-card flex flex-wrap items-center justify-between gap-3 sm:gap-4 border border-borderDef">
                            <div className="flex items-center gap-3">
                              <img src={jam.submissionCover} alt={jam.submissionTitle} className="w-16 h-10 rounded-control object-cover bg-surface-3 shrink-0" />
                              <div>
                                <div className="text-caption font-mono text-textTertiary mb-0.5">Поданная работа</div>
                                <span className="text-body-sm font-bold text-textPrimary group-hover:text-accent transition-colors duration-base">{jam.submissionTitle}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-caption font-mono text-textTertiary">Роль в сабмишене</div>
                              <span className="px-2.5 py-0.5 rounded-control bg-surface-3 text-accent font-mono text-caption font-semibold border border-borderDef mt-1 inline-block">{jam.role}</span>
                            </div>
                          </div>
                        )}
                      </article>
                    )) : (
                      <div className="w-full py-16 flex flex-col items-center text-center gap-3 border border-dashed border-borderDef rounded-card bg-surface-1 animate-fadeIn">
                        <Award className="w-10 h-10 text-textTertiary" />
                        <span className="text-caption font-mono text-textTertiary uppercase tracking-wider">Джемы не найдены</span>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. TAB: MEMBERS (Только для Team Studio) */}
                {activeTab === 'members' && profileType === 'team' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
                    {(currentData as any).members?.map((member: any) => (
                      <div
                        key={member.id}
                        onClick={() => triggerToast(`Профиль участника: ${member.name}`, 'info')}
                        className="bg-surface-1 border border-borderDef p-4 rounded-card flex items-center gap-4 hover:bg-surface-2 hover:border-borderStrong transition-all duration-base cursor-pointer group"
                      >
                        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-borderDef bg-surface-2">
                          <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-body font-bold text-textPrimary group-hover:text-accent transition-colors duration-base leading-none">
                            {member.name}
                          </span>
                          <span className="text-caption font-mono text-textTertiary uppercase tracking-wider mt-1.5 leading-none">
                            {member.role}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 5. TAB: FAVORITES (Избранное - BR-ACC-024, FR-ACC-020) */}
                {activeTab === 'favorites' && (
                  <div className="animate-fadeIn">
                    {isFavoritesHidden ? (
                      <div className="w-full py-16 px-6 flex flex-col items-center text-center gap-3 border border-borderDef rounded-card bg-surface-1">
                        <div className="w-12 h-12 rounded-full bg-surface-2 flex items-center justify-center text-textTertiary mb-1">
                          <Lock className="w-5 h-5 text-textTertiary" />
                        </div>
                        <h4 className="text-body font-bold text-textPrimary">Список избранного скрыт</h4>
                        <p className="text-caption text-textTertiary max-w-sm">
                          Владелец профиля ограничил доступ к списку избранных игр настройками приватности.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {currentData.projects.slice(0, 4).map((project) => (
                          <ProfileGameCard
                            key={project.id}
                            project={project}
                            isEditingMode={false}
                            onEdit={() => {}}
                            onDelete={() => {}}
                            onQuickPlay={(p) => triggerToast(`Запуск ${p.title} в браузере...`, 'info')}
                            onToggleCollection={(p) => setCollectionGameProfile(p)}
                            onOpenContextMenu={(e, p) => setContextMenuProjectId(contextMenuProjectId === p.id ? null : p.id)}
                            contextMenuOpen={(contextMenuProjectId as any) === (project.id as any)}
                            onCloseContextMenu={() => setContextMenuProjectId(null)}
                            triggerToast={triggerToast}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 6. TAB: COMMUNITY (BR-COM-073, FR-COM-080, COM-API-026) */}
                {activeTab === 'community' && (
                  <div className="flex flex-col gap-4 animate-fadeIn">
                    <div className="flex items-center justify-between pb-2 border-b border-borderDef text-caption font-mono text-textTertiary">
                      <span>ПУБЛИЧНЫЕ ТЕМЫ В СООБЩЕСТВЕ</span>
                      <span>ТЕМ: {filteredCommunityThreads.length}</span>
                    </div>

                    {filteredCommunityThreads.length > 0 ? (
                      filteredCommunityThreads.map((thread) => {
                        const category = MOCK_COMMUNITY_CATEGORIES.find(c => c.id === thread.categoryId);
                        return (
                          <div
                            key={thread.id}
                            onClick={() => {
                              if ((window as any).__hubigrNavigate) {
                                (window as any).__hubigrNavigate(`/community/thread/${thread.id}`);
                              }
                            }}
                            className="p-5 bg-surface-1 border border-borderDef rounded-2xl space-y-3 hover:border-accent/50 hover:bg-surface-1/70 transition-all duration-base cursor-pointer group shadow-elevation-base"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="px-2.5 py-0.5 rounded-control bg-surface-2 text-textSecondary text-[10px] font-mono font-bold uppercase border border-borderDef">
                                  {category?.name || 'Общее'}
                                </span>
                                {thread.tags.map(tag => (
                                  <span key={tag} className="px-2 py-0.5 rounded-control bg-accent/10 text-accent text-[10px] font-mono font-semibold">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                              {thread.isSolved && (
                                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-control bg-success/15 text-success border border-success/30 text-[10px] font-mono font-bold">
                                  <CheckCircle2 className="w-3 h-3" /> Решено
                                </span>
                              )}
                            </div>

                            <h4 className="text-base font-bold text-textPrimary group-hover:text-accent transition-colors leading-snug">
                              {thread.title}
                            </h4>

                            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-borderDef/40 text-xs text-textTertiary font-mono">
                              <span>Опубликовано: {thread.createdAt}</span>
                              <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {thread.normalizedViews}</span>
                                <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> {thread.repliesCount}</span>
                                <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> {thread.likesCount}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="w-full py-16 flex flex-col items-center text-center gap-3 border border-dashed border-borderDef rounded-card bg-surface-1 animate-fadeIn">
                        <MessageSquare className="w-10 h-10 text-textTertiary opacity-50" />
                        <span className="text-caption font-mono text-textTertiary uppercase tracking-wider">Публичные темы отсутствуют</span>
                        <p className="text-xs text-textTertiary max-w-sm">
                          Пользователь пока не создал ни одной публичной темы в глобальном сообществе.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

          </div>

        </section>

        {/* Passport & Tech Stack (Card 1) — order-2 на мобилках, col 1 row 1 на десктопе */}
        <div className="order-2 lg:order-none lg:col-start-1 lg:row-start-1 w-full select-none">
          {/* Mobile Accordion Wrapper */}
          <div className="lg:hidden w-full bg-surface-1 border border-borderDef/60 rounded-2xl overflow-hidden hover:border-borderDef transition-colors duration-120">
            <button 
              onClick={() => setAccordionOpen(!accordionOpen)}
              className="w-full p-4 flex items-center justify-between text-left focus:outline-none cursor-pointer"
            >
              <span className="text-[13px] font-bold font-mono uppercase tracking-wider text-textPrimary flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                Паспорт &amp; Стек технологий
              </span>
              <ChevronDown className={`w-4 h-4 text-textTertiary transition-transform duration-200 ${accordionOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {accordionOpen && (
              <div className="px-4 pb-4 space-y-4 border-t border-borderDef pt-4 animate-fadeIn">
                {renderCard1()}
              </div>
            )}
          </div>
          {/* Desktop Static Card */}
          <div className="hidden lg:block w-full">
            {renderCard1()}
          </div>
        </div>

        {/* Contacts (Card 2) — order-3 на мобилках, col 1 row 2 на десктопе */}
        <div className="order-3 lg:order-none lg:col-start-1 lg:row-start-2 w-full select-none">
          {renderCard2()}
        </div>

        {/* Support Core (Card 3) — order-4 на мобилках, col 1 row 3 на десктопе */}
        <div className="order-4 lg:order-none lg:col-start-1 lg:row-start-3 w-full select-none">
          {renderCard3()}
        </div>

        {/* Report Button — order-5 на мобилках, col 1 row 4 на десктопе */}
        <div className="order-5 lg:order-none lg:col-start-1 lg:row-start-4 w-full pt-2 select-none">
          <button 
            onClick={() => setActiveDrawer('reportProfile')}
            className="text-textTertiary hover:text-accent text-caption font-semibold flex items-center gap-2 transition-colors duration-120 focus:outline-none cursor-pointer"
          >
            <Flag className="w-4 h-4" />
            <span>Пожаловаться на контент</span>
          </button>
        </div>

      </div>

      {/* =========================================================================
          5. КОНТЕКСТНЫЕ DRAWER-ПАНЕЛИ И МОДАЛЬНЫЕ ОКНА
          ========================================================================= */}
      
      {activeDrawer && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-300 animate-fadeIn"
          onClick={() => setActiveDrawer(null)}
        />
      )}

      {/* А. МОДАЛЬНОЕ ОКНО «ПОДЕЛИЦА ПРОФИЛЕМ» (Share Modal) */}
      <ShareProfileModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        profileName={currentData.name}
        profileHandle={currentData.handle}
        triggerToast={triggerToast}
      />

      {/* Б. Панель «Пригласить в команду» */}
      {activeDrawer === 'inviteTeam' && (
        <Drawer
          isOpen={true}
          onClose={() => setActiveDrawer(null)}
          title="Пригласить в команду"
          icon={<UserPlus className="w-5 h-5" />}
          footer={
            <Button
              variant="primary"
              onClick={() => {
                if (!inviteRole.trim()) { triggerToast('Укажите предлагаемую роль', 'error'); return; }
                setActiveDrawer(null);
                triggerToast(`Приглашение от команды "${inviteTeamName}" отправлено!`, 'success');
              }}
              className="w-full"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Отправить приглашение
            </Button>
          }
        >
          <div className="flex flex-col gap-5">
            <FormField label="Выберите команду">
              <CustomSelect
                value={inviteTeamName}
                onChange={setInviteTeamName}
                options={[
                  { value: "CyberJam Squad", label: "CyberJam Squad", sublabel: "Капитан" },
                  { value: "Nocturnal Sub-Team", label: "Nocturnal Sub-Team", sublabel: "Основатель" }
                ]}
                className="w-full"
                size="lg"
                variant="form"
              />
            </FormField>
            <FormField label="Предлагаемая должность (Title)" hint="Например: 3D Generalist, Level Designer">
              <Input
                type="text"
                placeholder="3D Generalist"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
              />
            </FormField>
            <FormField label="Уровень доступа" hint="Права управления проектами команды (TO-BE Stage 4)">
              <CustomSelect
                value={inviteAccessRole}
                onChange={setInviteAccessRole}
                options={[
                  { value: "admin", label: "Администратор", sublabel: "Полный доступ (игры, команда, финансы)" },
                  { value: "editor", label: "Редактор", sublabel: "Управление страницами игр и девлогами" },
                  { value: "member", label: "Участник", sublabel: "Только отображение в составе команды" }
                ]}
                className="w-full"
                size="lg"
                variant="form"
              />
            </FormField>
            <FormField label="Сопроводительное сообщение">
              <Textarea
                value={inviteMessage}
                onChange={(e) => setInviteMessage(e.target.value)}
                placeholder="Привет! Нам в команду нужен опытный специалист для участия в предстоящем джеме..."
                rows={5}
              />
            </FormField>
          </div>
        </Drawer>
      )}

      {/* В. Панель «Жалоба на профиль» */}
      {activeDrawer === 'reportProfile' && (
        <Drawer
          isOpen={true}
          onClose={() => setActiveDrawer(null)}
          title="Жалоба на профиль"
          icon={<Flag className="w-5 h-5 text-danger" />}
          footer={
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setActiveDrawer(null)} className="flex-1">Отмена</Button>
              <Button
                variant="danger"
                onClick={() => {
                  setActiveDrawer(null);
                  setReportComment('');
                  triggerToast('Жалоба отправлена модераторам HUBIGR', 'success');
                }}
                className="flex-1"
              >
                Отправить
              </Button>
            </div>
          }
        >
          <div className="flex flex-col gap-5">
            <FormField label="Причина жалобы">
              <div className="flex flex-col gap-2">
                {[
                  { id: 'spam',          label: 'Спам / Навязчивая реклама' },
                  { id: 'inappropriate', label: 'Неприемлемый или оскорбительный контент' },
                  { id: 'impersonation', label: 'Выдавание себя за другого автора' },
                  { id: 'copyright',     label: 'Нарушение авторских прав' }
                ].map(reason => (
                  <label key={reason.id} className="flex items-center gap-3 p-3.5 bg-surface-1 border border-borderDef rounded-control cursor-pointer hover:border-borderStrong transition-colors">
                    <input
                      type="radio"
                      name="reportReason"
                      value={reason.id}
                      checked={reportReason === reason.id}
                      onChange={(e) => setReportReason(e.target.value)}
                      className="accent-danger w-4 h-4 cursor-pointer"
                    />
                    <span className="text-body-sm text-textPrimary">{reason.label}</span>
                  </label>
                ))}
              </div>
            </FormField>
            <FormField label="Комментарий" hint="Укажите детали или ссылки на материал">
              <Textarea
                value={reportComment}
                onChange={(e) => setReportComment(e.target.value)}
                placeholder="Дополнительные сведения..."
                rows={4}
              />
            </FormField>
          </div>
        </Drawer>
      )}

      {/* Г. Панель «Редактировать профиль» (FE-ACC-004 Unified Identity: BR-ACC-011, BR-ACC-012, BR-ACC-013) */}
      {activeDrawer === 'developer' && (
        <Drawer
          isOpen={true}
          onClose={() => setActiveDrawer(null)}
          title="Редактировать профиль"
          icon={<Edit3 className="w-5 h-5" />}
          size="md"
          footer={
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setActiveDrawer(null)}
                className="flex-1"
              >
                Отмена
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveProfileDrawer}
                className="flex-1"
              >
                Сохранить
              </Button>
            </div>
          }
        >
          <div className="flex flex-col gap-6">

            {/* БЛОК 1: ОСНОВНАЯ ИДЕНТИФИКАЦИЯ (BR-ACC-011, BR-ACC-012) */}
            <div className="flex flex-col gap-4 p-4 bg-surface-1 border border-borderDef/70 rounded-xl">
              <span className="overline select-none text-accent">
                Идентификация профиля
              </span>

              {/* Отображаемое имя (Display Name - BR-ACC-012) */}
              <FormField 
                label="Отображаемое имя" 
                hint="Необязательно. Имя, которое увидят другие пользователи в шапке и публикациях. Если оставить пустым, отобразится ваш никнейм (@username)."
              >
                <div className="relative flex items-center">
                  <Input
                    type="text"
                    placeholder="Например: Александр Восток"
                    value={draftDisplayName}
                    onChange={(e) => setDraftDisplayName(e.target.value)}
                    className="w-full pr-16"
                  />
                  {draftDisplayName && (
                    <button
                      type="button"
                      onClick={() => setDraftDisplayName('')}
                      className="absolute right-3 text-caption font-mono text-textTertiary hover:text-danger text-[11px] transition-colors"
                      title="Очистить и использовать никнейм"
                    >
                      Очистить
                    </button>
                  )}
                </div>
              </FormField>

              {/* Никнейм (@username) + Кулдаун логика (BR-ACC-011) */}
              <FormField 
                label="Уникальный никнейм (@username)" 
                hint="Обязательный системный идентификатор. Формирует ссылку на профиль: hubigr.com/@никнейм."
              >
                {isCooldownActive ? (
                  <div className="flex flex-col gap-3">
                    <div className="relative flex items-center">
                      <div className="absolute left-3.5 text-textTertiary flex items-center pointer-events-none">
                        <Lock className="w-4 h-4 text-warning" />
                      </div>
                      <Input
                        type="text"
                        value={`@${draftUsername}`}
                        readOnly
                        className="w-full pl-10 bg-surface-2 border-borderDef text-textSecondary cursor-not-allowed opacity-80"
                      />
                    </div>

                    {/* Баннер кулдауна (BR-ACC-011) */}
                    <div className="p-3 bg-warning/10 border border-warning/30 rounded-control flex items-start gap-2.5 text-caption font-sans text-warning">
                      <Clock className="w-4 h-4 shrink-0 mt-0.5" />
                      <div className="flex-1 flex flex-col gap-1">
                        <div className="font-semibold text-textPrimary">
                          Смена никнейма временно заморожена
                        </div>
                        <div className="text-textSecondary text-[12px] leading-relaxed">
                          По правилам платформы никнейм можно менять не чаще одного раза в 30 дней. Следующая смена станет доступна <strong className="text-textPrimary">{cooldownAvailableDateFormatted}</strong> (через {cooldownDaysRemaining} дн.).
                        </div>
                        {/* Демо-симуляция */}
                        <div className="pt-1.5 flex items-center justify-between border-t border-warning/20 mt-1">
                          <span className="text-[11px] text-textTertiary font-mono">Тестирование:</span>
                          <button
                            type="button"
                            onClick={() => {
                              setOverrideCooldown(false);
                              triggerToast('Кулдаун никнейма смоделирован как истёкший', 'info');
                            }}
                            className="text-[11px] font-mono text-accent hover:underline flex items-center gap-1"
                          >
                            <span>Смоделировать окончание кулдауна &rarr;</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-textTertiary font-mono font-bold select-none">
                        @
                      </span>
                      <Input
                        type="text"
                        value={draftUsername}
                        onChange={(e) => setDraftUsername(e.target.value.replace(/^@/, ''))}
                        placeholder="username"
                        className="w-full pl-8 font-mono"
                      />
                    </div>

                    {/* Валидация никнейма */}
                    {draftUsername ? (
                      (() => {
                        const val = validateUsername(draftUsername);
                        if (!val.valid) {
                          return (
                            <div className="flex items-center gap-1.5 text-caption text-danger font-sans">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>{val.error}</span>
                            </div>
                          );
                        }
                        return (
                          <div className="flex items-center justify-between gap-1 text-caption text-success font-sans">
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                              Никнейм свободен
                            </span>
                            <span className="text-textTertiary font-mono text-[11px]">
                              hubigr.com/@{draftUsername}
                            </span>
                          </div>
                        );
                      })()
                    ) : (
                      <span className="text-caption text-textTertiary font-sans">
                        От 3 до 30 символов: латиница, цифры и символ _
                      </span>
                    )}

                    <div className="p-2.5 bg-surface-2 border border-borderDef/60 rounded-control flex items-center justify-between text-[11px] font-sans text-textTertiary">
                      <span>Кулдаун 30 дней после смены</span>
                      <button
                        type="button"
                        onClick={() => {
                          setOverrideCooldown(true);
                          triggerToast('Кулдаун никнейма включен (14 дней)', 'info');
                        }}
                        className="text-accent hover:underline font-mono"
                      >
                        Смоделировать кулдаун
                      </button>
                    </div>
                  </div>
                )}
              </FormField>

              {/* Аватар профиля и сброс к инициалам (BR-ACC-013) */}
              <FormField 
                label="Аватар профиля" 
                hint="Загрузите изображение или удалите его для автоматического отображения стильного значка с первой буквой имени."
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-borderDef shrink-0 bg-surface-2 flex items-center justify-center">
                    {draftAvatar ? (
                      <img src={draftAvatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/20 via-surface-2 to-surface-3 text-accent font-mono font-bold text-heading-3 select-none">
                        {(draftDisplayName || draftUsername || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          const avatars = [
                            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=300&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop"
                          ];
                          const next = avatars[Math.floor(Math.random() * avatars.length)];
                          setDraftAvatar(next);
                          triggerToast('Аватар выбран', 'info');
                        }}
                      >
                        <Camera className="w-3.5 h-3.5 mr-1.5" />
                        Случайное фото
                      </Button>
                      {draftAvatar && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setDraftAvatar('');
                            triggerToast('Аватар сброшен к буквенному инициалу', 'info');
                          }}
                          className="text-danger hover:text-danger"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-1" />
                          Удалить
                        </Button>
                      )}
                    </div>
                    <span className="text-[11px] text-textTertiary">
                      {draftAvatar ? 'Используется кастомное изображение' : 'Используется стандартный бейдж с инициалом'}
                    </span>
                  </div>
                </div>
              </FormField>
            </div>

            {/* БЛОК 2: АВТОРСКАЯ СПЕЦИАЛИЗАЦИЯ И СТАТУС (BR-ACC-014) */}
            <div className="flex flex-col gap-4">
              <span className="overline select-none text-textSecondary">
                Авторская специализация и статус
              </span>

              {/* Специализация / Роль */}
              <FormField 
                label="Специализация / Роль" 
                hint="Отображается в паспорте профиля рядом со статусом поиска."
              >
                <Input
                  type="text"
                  placeholder="Например: Lead Game Designer & Technical Artist"
                  value={draftProfession}
                  onChange={(e) => setDraftProfession(e.target.value)}
                />
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {[
                    'Solo Indie Dev',
                    'Game Designer',
                    '3D Generalist',
                    'Pixel Artist',
                    'Sound Designer',
                    'Unity Developer',
                    'Unreal Dev',
                    'WebGL / Rust Dev'
                  ].map((roleChip) => (
                    <button
                      key={roleChip}
                      type="button"
                      onClick={() => setDraftProfession(roleChip)}
                      className={`text-[11px] font-mono px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                        draftProfession === roleChip
                          ? 'bg-accent/15 border-accent text-accent font-bold'
                          : 'bg-surface-2 border-borderDef text-textSecondary hover:border-textTertiary'
                      }`}
                    >
                      {roleChip}
                    </button>
                  ))}
                </div>
              </FormField>

              {/* Статус поиска и доступности */}
              <FormField 
                label="Статус доступности / Поиск" 
                hint="Позволяет другим участникам и командам знать, открыты ли вы к предложениям."
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { value: 'В поиске команды', color: 'text-warning border-warning/40 bg-warning/10' },
                    { value: 'Открыт к предложениям', color: 'text-success border-success/40 bg-success/10' },
                    { value: 'Ищем разработчиков', color: 'text-accent border-accent/40 bg-accent/10' },
                    { value: 'Занят проектом', color: 'text-textTertiary border-borderDef bg-surface-2' },
                    { value: '', label: 'Не указывать', color: 'text-textTertiary border-borderDef bg-surface-1' }
                  ].map((item) => {
                    const isSelected = draftAvailability === item.value;
                    return (
                      <button
                        key={item.value || 'none'}
                        type="button"
                        onClick={() => setDraftAvailability(item.value)}
                        className={`text-[11px] font-mono py-1.5 px-2 rounded-control border text-center transition-all cursor-pointer truncate ${
                          isSelected
                            ? `${item.color} font-bold shadow-sm ring-1 ring-accent`
                            : 'bg-surface-2 border-borderDef/60 text-textSecondary hover:border-borderStrong'
                        }`}
                      >
                        {item.label || item.value}
                      </button>
                    );
                  })}
                </div>
              </FormField>

              {/* Игровые движки */}
              <FormField 
                label="Игровые движки" 
                hint="Основные игровые движки и фреймворки, в которых создаются ваши проекты."
              >
                <div className="flex flex-wrap gap-2 mb-2.5">
                  {draftGameEngines.map((engine, idx) => (
                    <Tag
                      key={idx}
                      label={engine}
                      onRemove={() => setDraftGameEngines(draftGameEngines.filter(e => e !== engine))}
                    />
                  ))}
                  {draftGameEngines.length === 0 && (
                    <span className="text-caption text-textTertiary italic">Движки пока не добавлены</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Например: Unity, Godot, Unreal Engine 5"
                    value={newEngineTag}
                    onChange={(e) => setNewEngineTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newEngineTag.trim()) {
                        e.preventDefault();
                        if (!draftGameEngines.includes(newEngineTag.trim())) {
                          setDraftGameEngines([...draftGameEngines, newEngineTag.trim()]);
                        }
                        setNewEngineTag('');
                      }
                    }}
                  />
                  <Button
                    variant="secondary"
                    onClick={() => {
                      if (newEngineTag.trim()) {
                        if (!draftGameEngines.includes(newEngineTag.trim())) {
                          setDraftGameEngines([...draftGameEngines, newEngineTag.trim()]);
                        }
                        setNewEngineTag('');
                      }
                    }}
                    disabled={!newEngineTag.trim()}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {/* Быстрое добавление популярных движков */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[11px] font-sans text-textTertiary mr-1">Популярные:</span>
                  {[
                    'Unity',
                    'Unreal Engine 5',
                    'Godot',
                    'WebGL / WASM',
                    'Defold',
                    'Custom Rust/C++'
                  ].map((engineChip) => (
                    <button
                      key={engineChip}
                      type="button"
                      onClick={() => {
                        if (!draftGameEngines.includes(engineChip)) {
                          setDraftGameEngines([...draftGameEngines, engineChip]);
                        }
                      }}
                      disabled={draftGameEngines.includes(engineChip)}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                        draftGameEngines.includes(engineChip)
                          ? 'opacity-40 border-borderDef bg-surface-2 cursor-not-allowed'
                          : 'bg-surface-2 border-borderDef text-textSecondary hover:border-accent hover:text-accent'
                      }`}
                    >
                      + {engineChip}
                    </button>
                  ))}
                </div>
              </FormField>
            </div>

            {/* БЛОК 3: БИОГРАФИЯ, ОПЫТ И ЛОКАЦИЯ */}
            <div className="flex flex-col gap-4">
              <span className="overline select-none text-textSecondary">
                Деятельность и локация
              </span>

              {/* О себе */}
              <FormField label="О себе (Bio)" hint="Расскажите о ваших проектах, роли и творческих целях">
                <Textarea
                  value={draftBio}
                  onChange={(e) => setDraftBio(e.target.value)}
                  placeholder="Инди-разработчик и технический художник..."
                  rows={4}
                />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Город / Страна" hint="Например: Helsinki, Finland">
                  <Input
                    type="text"
                    placeholder="Город, страна"
                    value={draftLocation}
                    onChange={(e) => setDraftLocation(e.target.value)}
                  />
                </FormField>
                <FormField label="Опыт в индустрии" hint="Например: 5+ лет в геймдеве">
                  <Input
                    type="text"
                    placeholder="Опыт в индустрии"
                    value={draftExperience}
                    onChange={(e) => setDraftExperience(e.target.value)}
                  />
                </FormField>
              </div>
            </div>

            {/* БЛОК 4: ТЕХНОЛОГИИ И ИНСТРУМЕНТЫ */}
            <div className="flex flex-col gap-2">
              <FormField label="Технологии и стек" hint="Добавьте языки программирования, библиотеки и инструментарий">
                <div className="flex flex-wrap gap-2 mb-3">
                  {draftTechStack.map((tech, idx) => (
                    <Tag
                      key={idx}
                      label={tech}
                      onRemove={() => setDraftTechStack(draftTechStack.filter(t => t !== tech))}
                    />
                  ))}
                  {draftTechStack.length === 0 && (
                    <span className="text-caption text-textTertiary italic">Стек технологий пока не добавлен</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Например: Rust, WASM, Blender, Three.js"
                    value={newTechTag}
                    onChange={(e) => setNewTechStackTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newTechTag.trim()) {
                        e.preventDefault();
                        if (!draftTechStack.includes(newTechTag.trim())) {
                          setDraftTechStack([...draftTechStack, newTechTag.trim()]);
                        }
                        setNewTechStackTag('');
                      }
                    }}
                  />
                  <Button
                    variant="secondary"
                    onClick={() => {
                      if (newTechTag.trim()) {
                        if (!draftTechStack.includes(newTechTag.trim())) {
                          setDraftTechStack([...draftTechStack, newTechTag.trim()]);
                        }
                        setNewTechStackTag('');
                      }
                    }}
                    disabled={!newTechTag.trim()}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </FormField>
            </div>

            {/* БЛОК 4: РЕСУРСЫ И ССЫЛКИ */}
            <div className="flex flex-col gap-2">
              <FormField label="Ресурсы и ссылки" hint="GitHub, Artstation, личный сайт">
                <div className="flex flex-col gap-2 mb-3">
                  {draftLinks.map((link, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-surface-2 border border-borderDef rounded-control">
                      <div className="min-w-0 flex-1">
                        <div className="text-body-sm font-medium text-textPrimary truncate">{link.label}</div>
                        <div className="text-caption text-textTertiary truncate">{link.url}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setDraftLinks(draftLinks.filter((_, i) => i !== idx))}
                        className="ml-3 text-textTertiary hover:text-danger transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {draftLinks.length === 0 && (
                    <span className="text-caption text-textTertiary italic">Ссылки пока не добавлены</span>
                  )}
                </div>
                <div className="flex flex-col gap-2 p-4 bg-surface-1 border border-borderDef rounded-control">
                  <Input
                    type="text"
                    placeholder="Название (например: GitHub)"
                    value={newLinkLabel}
                    onChange={(e) => setNewLinkLabel(e.target.value)}
                  />
                  <Input
                    type="url"
                    placeholder="https://"
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                  />
                  <Button
                    variant="secondary"
                    onClick={() => {
                      if (newLinkLabel.trim() && newLinkUrl.trim()) {
                        setDraftLinks([...draftLinks, { label: newLinkLabel.trim(), url: newLinkUrl.trim() }]);
                        setNewLinkLabel('');
                        setNewLinkUrl('');
                      }
                    }}
                    disabled={!newLinkLabel.trim() || !newLinkUrl.trim()}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить ссылку
                  </Button>
                </div>
              </FormField>
            </div>

          </div>
        </Drawer>
      )}

      {/* Г+. Панель «Управление бейджами» */}
      {activeDrawer === 'badges' && (
        <Drawer
          isOpen={true}
          onClose={() => setActiveDrawer(null)}
          title="Управление бейджами"
          icon={<Award className="w-5 h-5" />}
          size="md"
          footer={
            <Button
              variant="primary"
              onClick={() => {
                updateCurrentProfile('badges', draftBadges);
                setActiveDrawer(null);
                triggerToast('Бейджи обновлены', 'success');
              }}
              className="w-full"
            >
              Сохранить изменения
            </Button>
          }
        >
          <div className="flex flex-col gap-5">
            <p className="text-body-sm text-textSecondary">
              Управляйте отображением бейджей в вашем профиле. Первые 3 будут видны сразу, остальные под кнопкой "+N ещё".
            </p>

            {/* Список бейджей */}
            <div className="space-y-4">
              {draftBadges.map((badge, idx) => {
                const styles = BADGE_VARIANT_STYLES[badge.variant];
                const IconCmp = BADGE_ICON_MAP[badge.icon] ?? Info;
                const isVisible = idx < 3;
                
                return (
                  <div
                    key={badge.id}
                    className="group relative p-5 bg-surface-1 border border-borderDef rounded-xl hover:border-borderStrong hover:shadow-sm transition-all"
                  >
                    {/* Заголовок карточки */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-surface-2 text-caption font-mono font-bold text-textTertiary">
                          {isVisible ? idx + 1 : `+${idx - 2}`}
                        </span>
                        <div>
                          <div className="text-body-sm font-semibold text-textPrimary">Бейдж #{idx + 1}</div>
                          <div className="text-caption text-textTertiary mt-0.5">
                            {isVisible ? 'Отображается в профиле' : 'Скрыт под кнопкой "+N ещё"'}
                          </div>
                        </div>
                      </div>
                      
                      {/* Кнопки управления */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            const newBadges = [...draftBadges];
                            [newBadges[idx], newBadges[idx - 1]] = [newBadges[idx - 1], newBadges[idx]];
                            setDraftBadges(newBadges);
                          }}
                          disabled={idx === 0}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-2 hover:bg-surface-3 text-textTertiary hover:text-textPrimary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Переместить вверх"
                        >
                          <ChevronDown className="w-4 h-4 rotate-180" />
                        </button>
                        <button
                          onClick={() => {
                            const newBadges = [...draftBadges];
                            [newBadges[idx], newBadges[idx + 1]] = [newBadges[idx + 1], newBadges[idx]];
                            setDraftBadges(newBadges);
                          }}
                          disabled={idx === draftBadges.length - 1}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-2 hover:bg-surface-3 text-textTertiary hover:text-textPrimary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Переместить вниз"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setDraftBadges(draftBadges.filter(b => b.id !== badge.id));
                            triggerToast('Бейдж удалён', 'warning');
                          }}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-2 hover:bg-danger/10 text-textTertiary hover:text-danger transition-colors"
                          title="Удалить бейдж"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Форма редактирования */}
                    <div className="space-y-4">
                      {/* Текст бейджа */}
                      <div>
                        <label className="block text-caption font-medium text-textSecondary mb-2">
                          Текст
                        </label>
                        <input
                          type="text"
                          value={badge.label}
                          onChange={(e) => {
                            const newBadges = [...draftBadges];
                            newBadges[idx] = { ...badge, label: e.target.value };
                            setDraftBadges(newBadges);
                          }}
                          placeholder="Название бейджа"
                          className="w-full h-10 px-3 bg-surface-2 border border-borderDef rounded-lg text-body-sm text-textPrimary placeholder:text-textTertiary focus:outline-none focus:border-accent transition-all"
                        />
                      </div>

                      {/* Иконка */}
                      <div>
                        <label className="block text-caption font-medium text-textSecondary mb-2">
                          Иконка
                        </label>
                        <button
                          type="button"
                          onClick={() => setIconPickerState({ isOpen: true, badgeIndex: idx })}
                          className="w-full h-12 flex items-center gap-3 px-4 bg-surface-2 border-2 border-borderDef hover:border-accent rounded-lg text-textPrimary transition-all group"
                        >
                          {(() => {
                            const IconComponent = BADGE_ICON_MAP[badge.icon] ?? Info;
                            return (
                              <>
                                <div className="w-8 h-8 flex items-center justify-center rounded bg-surface-3 text-textTertiary group-hover:text-accent transition-colors">
                                  <IconComponent className="w-4 h-4" />
                                </div>
                                <span className="text-body-sm font-medium flex-1 text-left">{badge.icon || 'Выберите иконку'}</span>
                                <ChevronDown className="w-4 h-4 text-textTertiary group-hover:text-accent transition-colors rotate-[-90deg]" />
                              </>
                            );
                          })()}
                        </button>
                      </div>

                      {/* Вариант цвета */}
                      <div>
                        <label className="block text-caption font-medium text-textSecondary mb-2">
                          Цветовой вариант
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {(Object.keys(BADGE_VARIANT_STYLES) as BadgeVariant[]).map((variant) => {
                            const variantStyles = BADGE_VARIANT_STYLES[variant];
                            return (
                              <button
                                key={variant}
                                onClick={() => {
                                  const newBadges = [...draftBadges];
                                  newBadges[idx] = { ...badge, variant };
                                  setDraftBadges(newBadges);
                                }}
                                className={`h-10 px-3 flex items-center justify-center gap-2 rounded-lg border-2 text-caption font-medium capitalize transition-all ${
                                  badge.variant === variant
                                    ? 'border-accent bg-accent/10 text-accent'
                                    : 'border-borderDef bg-surface-2 text-textSecondary hover:border-borderStrong'
                                }`}
                              >
                                <div className={`w-2.5 h-2.5 rounded-full ${variantStyles.chip.split(' ').find(c => c.startsWith('bg-'))}`} />
                                {variant}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Превью */}
                      <div>
                        <label className="block text-caption font-medium text-textSecondary mb-2">
                          Превью
                        </label>
                        <div className="flex items-center justify-center h-12 bg-surface-0 border border-borderDef rounded-lg">
                          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-caption font-semibold leading-none ${styles.chip}`}>
                            <IconCmp className={`w-3.5 h-3.5 shrink-0 ${styles.icon}`} />
                            <span>{badge.label || 'Текст бейджа'}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {draftBadges.length === 0 && (
                <div className="text-center py-16 space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-full bg-surface-2 flex items-center justify-center">
                    <Award className="w-8 h-8 text-textTertiary opacity-40" />
                  </div>
                  <div>
                    <p className="text-body-sm font-medium text-textSecondary mb-1">Нет бейджей</p>
                    <p className="text-caption text-textTertiary">Добавьте бейджи чтобы выделить достижения</p>
                  </div>
                </div>
              )}
            </div>

            {/* Кнопка добавления */}
            <div className="pt-3 border-t border-borderDef">
              <button
                onClick={() => {
                  const newBadge: BadgeData = {
                    id: `badge-${Date.now()}`,
                    icon: 'award',
                    label: 'Новый бейдж',
                    variant: 'default'
                  };
                  setDraftBadges([...draftBadges, newBadge]);
                  triggerToast('Бейдж добавлен', 'info');
                }}
                className="w-full h-11 flex items-center justify-center gap-2 border-2 border-dashed border-borderDef hover:border-accent rounded-lg text-body-sm font-medium text-textSecondary hover:text-accent transition-colors"
              >
                <Plus className="w-4 h-4" />
                Добавить новый бейдж
              </button>
            </div>
          </div>
        </Drawer>
      )}
      {/* ВХОДЯЩИЕ ЗАПРОСЫ И ВЫДАННЫЕ ДОСТУПЫ (FE-ACC-005: BR-ACC-016...019) */}
      {activeDrawer === 'contactInbox' && (
        <Drawer
          isOpen={true}
          onClose={() => setActiveDrawer(null)}
          title="Доступ к контактам"
          icon={<Bell className="w-5 h-5" />}
        >
          <div className="flex flex-col gap-4">
            <p className="text-body-sm text-textSecondary">
              Управление доступом к вашим приватным контактам. Выдавая доступ, вы открываете пользователю Email, Телефон и Telegram.
            </p>

            <SegmentedControl
              items={[
                { key: 'pending', label: 'Входящие', count: mockContactRequests.filter(r => r.status === 'pending').length },
                { key: 'grants', label: 'Выданные доступы', count: mockContactRequests.filter(r => r.status === 'approved').length }
              ]}
              value={contactInboxTab}
              onChange={(val) => setContactInboxTab(val as any)}
            />

            {contactInboxTab === 'pending' ? (
              <div className="space-y-3">
                {mockContactRequests.filter(r => r.status === 'pending').map((req) => (
                  <div key={req.id} className="p-4 bg-surface-2 border border-borderDef rounded-control flex items-center justify-between gap-3 animate-fadeIn">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={req.avatar} alt="" className="w-10 h-10 rounded-full shrink-0 object-cover bg-surface-3" />
                      <div className="min-w-0">
                        <div className="text-body-sm font-bold text-textPrimary truncate">{req.user}</div>
                        <div className="text-caption text-textTertiary">{req.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleRejectContactRequest(req.id, req.user)}
                        title="Отклонить запрос"
                      >
                        <X className="w-4 h-4" />
                        <span className="hidden sm:inline">Отклонить</span>
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleApproveContactRequest(req.id, req.user)}
                        title="Открыть контакты"
                      >
                        <Check className="w-4 h-4" />
                        <span className="hidden sm:inline">Принять</span>
                      </Button>
                    </div>
                  </div>
                ))}
                {mockContactRequests.filter(r => r.status === 'pending').length === 0 && (
                  <div className="py-12 flex flex-col items-center justify-center text-center gap-2 text-textTertiary bg-surface-1 rounded-control border border-dashed border-borderDef">
                    <CheckCircle2 className="w-8 h-8 text-textTertiary/60" />
                    <span className="text-body-sm font-medium">Нет новых входящих запросов</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {mockContactRequests.filter(r => r.status === 'approved').map((req) => (
                  <div key={req.id} className="p-4 bg-surface-2 border border-borderDef rounded-control flex items-center justify-between gap-3 animate-fadeIn">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={req.avatar} alt="" className="w-10 h-10 rounded-full shrink-0 object-cover bg-surface-3" />
                      <div className="min-w-0">
                        <div className="text-body-sm font-bold text-textPrimary truncate">{req.user}</div>
                        <div className="text-caption text-success flex items-center gap-1 mt-0.5">
                          <CheckCircle2 className="w-3 h-3 shrink-0" />
                          <span>Доступ открыт</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleRevokeContactGrant(req.id, req.user)}
                      className="shrink-0 text-danger hover:text-danger hover:bg-danger/10"
                    >
                      Отозвать доступ
                    </Button>
                  </div>
                ))}
                {mockContactRequests.filter(r => r.status === 'approved').length === 0 && (
                  <div className="py-12 flex flex-col items-center justify-center text-center gap-2 text-textTertiary bg-surface-1 rounded-control border border-dashed border-borderDef">
                    <Lock className="w-8 h-8 text-textTertiary/60" />
                    <span className="text-body-sm font-medium">Вы пока не открывали доступ к контактам другим пользователям</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </Drawer>
      )}


      {/* Е. УПРАВЛЕНИЕ КОМАНДОЙ (Stage 4) */}
      {activeDrawer === 'manageTeam' && (
        <Drawer
          isOpen={true}
          onClose={() => setActiveDrawer(null)}
          title="Управление командой"
          icon={<Users className="w-5 h-5" />}
          size="md"
        >
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center bg-surface-1 p-4 rounded-card border border-borderDef shadow-sm">
              <div>
                <h4 className="text-body font-bold text-textPrimary">Текущие участники</h4>
                <p className="text-caption text-textSecondary">Управление ролями и доступом</p>
              </div>
              <Button size="sm" onClick={() => { setActiveDrawer('inviteTeam'); setInviteTeamName(String('title' in currentData ? (currentData as any).title : currentData.name)); }}>Пригласить</Button>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between p-3 bg-surface-2 rounded-control border border-borderDef">
                <div className="flex items-center gap-3">
                  <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop" className="w-10 h-10 rounded-full" alt="avatar" />
                  <div>
                    <div className="text-body-sm font-bold text-textPrimary">Alex Developer (Вы)</div>
                    <div className="text-caption text-textSecondary">Владелец</div>
                  </div>
                </div>
                <Badge variant="accent">Owner</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-surface-2 rounded-control border border-borderDef">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-3 flex items-center justify-center text-textSecondary border border-borderDef"><Users className="w-4 h-4"/></div>
                  <div>
                    <div className="text-body-sm font-bold text-textPrimary">Jane 3D</div>
                    <div className="text-caption text-textSecondary">3D Artist</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select 
                    className="bg-surface-1 border border-borderDef rounded-control text-caption px-2 py-1 outline-none text-textPrimary"
                    onChange={() => triggerToast('Уровень доступа изменен', 'info')}
                    defaultValue="editor"
                  >
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="member">Member</option>
                  </select>
                  <button onClick={() => triggerToast('Участник исключен', 'warning')} className="text-danger hover:text-danger/70 transition-colors p-1" title="Исключить">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Drawer>
      )}

      {/* Д. Панель «Контакты» */}
      {activeDrawer === 'contacts' && (
        <Drawer
          isOpen={true}
          onClose={() => setActiveDrawer(null)}
          title="Контактная информация"
          icon={<Mail className="w-5 h-5" />}
          footer={
            <Button variant="primary" onClick={() => { updateCurrentProfile('contacts', draftContacts); setActiveDrawer(null); triggerToast('Контакты обновлены', 'success'); }} className="w-full">
              Сохранить
            </Button>
          }
        >
          <div className="flex flex-col gap-5">
            <FormField label="Email">
              <Input type="email" placeholder="you@example.com" value={draftContacts.email} onChange={(e) => setDraftContacts({ ...draftContacts, email: e.target.value })} />
            </FormField>
            <FormField label="Телефон">
              <Input type="text" placeholder="+7 999 000 00 00" value={draftContacts.phone} onChange={(e) => setDraftContacts({ ...draftContacts, phone: e.target.value })} />
            </FormField>
            <FormField label="Telegram">
              <Input type="text" placeholder="@username" value={draftContacts.telegram} onChange={(e) => setDraftContacts({ ...draftContacts, telegram: e.target.value })} />
            </FormField>
          </div>
        </Drawer>
      )}

      {/* Е. Панель «Реквизиты и ссылки поддержки» (BR-ACC-020, BR-ACC-021) */}
      {activeDrawer === 'donate' && (
        <Drawer
          isOpen={true}
          onClose={() => setActiveDrawer(null)}
          title="Поддержка и краудфандинг"
          icon={<Heart className="w-5 h-5" />}
          size="md"
          footer={
            <Button 
              variant="primary" 
              onClick={() => { 
                updateCurrentProfileBatch({
                  donateDesc: draftDonateDesc,
                  supportLinks: draftSupportLinks
                });
                setActiveDrawer(null); 
                triggerToast('Реквизиты и ссылки поддержки обновлены', 'success'); 
              }} 
              className="w-full"
            >
              Сохранить изменения
            </Button>
          }
        >
          <div className="flex flex-col gap-6">
            
            {/* Описание целей сбора */}
            <FormField label="Цели краудфандинга" hint="Опишите, на что направляются средства от поддержки">
              <Textarea 
                value={draftDonateDesc} 
                onChange={(e) => setDraftDonateDesc(e.target.value)} 
                placeholder="Например: Сбор на лицензию FMOD и оплату серверов мультиплеера..." 
                rows={4} 
              />
            </FormField>

            {/* Список добавленных сервисов поддержки */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-caption font-semibold text-textSecondary uppercase tracking-wider">
                  Публичные ссылки поддержки
                </label>
                <span className="text-[11px] font-mono text-textTertiary">
                  Доступны всем игрокам
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {draftSupportLinks.map((slink, idx) => (
                  <div key={idx} className="p-3 bg-surface-2 border border-borderDef rounded-control flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-body-sm font-bold text-textPrimary">{slink.platform}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-success/15 text-success font-semibold flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Проверено</span>
                        </span>
                      </div>
                      <div className="text-caption font-mono text-textTertiary truncate mt-0.5">{slink.url}</div>
                      {slink.desc && (
                        <div className="text-[11px] text-textSecondary font-sans mt-0.5 truncate">{slink.desc}</div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setDraftSupportLinks(draftSupportLinks.filter((_, i) => i !== idx))}
                      className="text-textTertiary hover:text-danger p-1.5 transition-colors cursor-pointer"
                      title="Удалить ссылку"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {draftSupportLinks.length === 0 && (
                  <div className="p-4 bg-surface-1 border border-dashed border-borderDef rounded-control text-center text-caption text-textTertiary">
                    Ссылки поддержки пока не добавлены
                  </div>
                )}
              </div>

              {/* Форма добавления новой ссылки */}
              <div className="p-4 bg-surface-1 border border-borderDef rounded-control flex flex-col gap-3 mt-1">
                <span className="text-caption font-bold text-textPrimary uppercase tracking-wider">
                  Добавить сервис поддержки
                </span>

                {/* Выбор платформы */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Boosty',
                    'DonationAlerts',
                    'CloudTips',
                    'Patreon',
                    'VK Donut',
                    'ЮMoney',
                    'Тинькофф'
                  ].map((plat) => (
                    <button
                      key={plat}
                      type="button"
                      onClick={() => setNewSupportPlatform(plat)}
                      className={`text-[11px] font-mono px-2.5 py-1 rounded border transition-colors cursor-pointer ${
                        newSupportPlatform === plat
                          ? 'bg-accent/15 border-accent text-accent font-bold'
                          : 'bg-surface-2 border-borderDef text-textSecondary hover:border-textTertiary'
                      }`}
                    >
                      {plat}
                    </button>
                  ))}
                </div>

                <Input
                  type="url"
                  placeholder={`https://${newSupportPlatform.toLowerCase()}.to/username`}
                  value={newSupportUrl}
                  onChange={(e) => setNewSupportUrl(e.target.value)}
                />

                <Input
                  type="text"
                  placeholder="Краткое описание (например: Ранний доступ к WebGL-билдам)"
                  value={newSupportDesc}
                  onChange={(e) => setNewSupportDesc(e.target.value)}
                />

                <Button
                  variant="secondary"
                  onClick={() => {
                    if (newSupportUrl.trim()) {
                      const newEntry = {
                        id: String(Date.now()),
                        platform: newSupportPlatform,
                        url: newSupportUrl.trim(),
                        verified: true,
                        desc: newSupportDesc.trim()
                      };
                      setDraftSupportLinks([...draftSupportLinks, newEntry]);
                      setNewSupportUrl('');
                      setNewSupportDesc('');
                      triggerToast(`Сервис ${newSupportPlatform} добавлен`, 'success');
                    }
                  }}
                  disabled={!newSupportUrl.trim()}
                  className="w-full flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Добавить ссылку поддержки</span>
                </Button>
              </div>

              {/* Подсказка о защите от фишинга */}
              <div className="p-3 bg-surface-2/60 border border-borderDef/60 rounded-control flex items-start gap-2.5 text-caption text-textTertiary">
                <ShieldAlert className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>
                  Все внешние ссылки проверяются системой защиты от фишинга. Пользователи увидят проверенный домен и предупреждение перед переходом.
                </span>
              </div>
            </div>

          </div>
        </Drawer>
      )}

      {/* НАСТРОЙКИ ПРИВАТНОСТИ (BR-ACC-024, FR-ACC-020) */}
      {activeDrawer === 'privacy' && (
        <Drawer
          isOpen={true}
          onClose={() => setActiveDrawer(null)}
          title="Настройки приватности"
          icon={<Lock className="w-5 h-5" />}
          size="md"
          footer={
            <div className="flex items-center gap-3 w-full">
              <Button
                variant="secondary"
                onClick={() => setActiveDrawer(null)}
                className="flex-1"
              >
                Отмена
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setPrivacySettings(draftPrivacySettings);
                  setActiveDrawer(null);
                  triggerToast('Настройки приватности сохранены', 'success');
                }}
                className="flex-1"
              >
                Сохранить
              </Button>
            </div>
          }
        >
          <div className="flex flex-col gap-6">
            <p className="text-body-sm text-textSecondary leading-relaxed">
              Настройте видимость социальных связей и списков в вашем профиле для других пользователей платформы.
            </p>

            {/* 1. Список подписчиков */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <label className="text-caption font-semibold text-textSecondary uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4 text-accent" />
                  <span>Список подписчиков</span>
                </label>
              </div>
              <p className="text-caption text-textTertiary">
                Кто может просматривать список пользователей, подписанных на вас.
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'public', label: 'Все', desc: 'Публично' },
                  { value: 'followers', label: 'Подписчики', desc: 'Только подписчики' },
                  { value: 'private', label: 'Только я', desc: 'Скрыто' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setDraftPrivacySettings(prev => ({ ...prev, followers: opt.value as any }))}
                    className={`p-3 rounded-control border text-left transition-all cursor-pointer ${
                      draftPrivacySettings.followers === opt.value
                        ? 'border-accent bg-accent/10 text-textPrimary'
                        : 'border-borderDef bg-surface-2 hover:bg-surface-3 text-textSecondary'
                    }`}
                  >
                    <div className="text-caption font-bold">{opt.label}</div>
                    <div className="text-[11px] text-textTertiary mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Список подписок */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <label className="text-caption font-semibold text-textSecondary uppercase tracking-wider flex items-center gap-2">
                  <Heart className="w-4 h-4 text-accent" />
                  <span>Список подписок</span>
                </label>
              </div>
              <p className="text-caption text-textTertiary">
                Кто может просматривать авторов и проекты, на которые вы подписаны.
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'public', label: 'Все', desc: 'Публично' },
                  { value: 'followers', label: 'Подписчики', desc: 'Только подписчики' },
                  { value: 'private', label: 'Только я', desc: 'Скрыто' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setDraftPrivacySettings(prev => ({ ...prev, following: opt.value as any }))}
                    className={`p-3 rounded-control border text-left transition-all cursor-pointer ${
                      draftPrivacySettings.following === opt.value
                        ? 'border-accent bg-accent/10 text-textPrimary'
                        : 'border-borderDef bg-surface-2 hover:bg-surface-3 text-textSecondary'
                    }`}
                  >
                    <div className="text-caption font-bold">{opt.label}</div>
                    <div className="text-[11px] text-textTertiary mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Избранное и коллекции */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <label className="text-caption font-semibold text-textSecondary uppercase tracking-wider flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-accent" />
                  <span>Избранное и коллекции</span>
                </label>
              </div>
              <p className="text-caption text-textTertiary">
                Кто может просматривать сохранённые вами игры, списки и коллекции.
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'public', label: 'Все', desc: 'Публично' },
                  { value: 'followers', label: 'Подписчики', desc: 'Только подписчики' },
                  { value: 'private', label: 'Только я', desc: 'Скрыто' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setDraftPrivacySettings(prev => ({ ...prev, favorites: opt.value as any }))}
                    className={`p-3 rounded-control border text-left transition-all cursor-pointer ${
                      draftPrivacySettings.favorites === opt.value
                        ? 'border-accent bg-accent/10 text-textPrimary'
                        : 'border-borderDef bg-surface-2 hover:bg-surface-3 text-textSecondary'
                    }`}
                  >
                    <div className="text-caption font-bold">{opt.label}</div>
                    <div className="text-[11px] text-textTertiary mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* BR-ACC-024 Системное пояснение */}
            <div className="p-4 bg-surface-2/70 border border-borderDef/70 rounded-control flex items-start gap-3">
              <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <div className="text-caption text-textSecondary leading-relaxed font-sans">
                <span className="font-bold text-textPrimary block mb-1">
                  Видимость опубликованных игр
                </span>
                Видимость ваших опубликованных игр и сборок не регулируется настройками профиля. Публичный или приватный статус каждого проекта настраивается индивидуально в карточке игры через Панель автора.
              </div>
            </div>
          </div>
        </Drawer>
      )}

      {/* Ж. Панель «Добавить/Редактировать Проект» */}
      {(activeDrawer === 'addProject' || activeDrawer === 'editProject') && (
        <Drawer
          isOpen={true}
          onClose={() => setActiveDrawer(null)}
          title={activeDrawer === 'addProject' ? 'Добавить проект' : 'Редактировать проект'}
          icon={<Gamepad2 className="w-5 h-5" />}
          size="md"
          footer={
            <Button variant="primary" onClick={() => {
              if (!draftProject.title.trim()) { triggerToast('Заполните название проекта', 'error'); return; }
              let list = [...(currentData as any).projects];
              if (activeDrawer === 'addProject') { list.unshift({ ...draftProject, id: Date.now() } as any); triggerToast(`Проект "${draftProject.title}" опубликован`, 'success'); }
              else { list = list.map((p: any) => p.id === draftProject.id ? draftProject : p); triggerToast(`Проект "${draftProject.title}" обновлён`, 'success'); }
              updateCurrentProfile('projects', list);
              setActiveDrawer(null);
            }} className="w-full">
              {activeDrawer === 'addProject' ? 'Опубликовать проект' : 'Сохранить изменения'}
            </Button>
          }
        >
          <div className="flex flex-col gap-5">
            <FormField label="Название игры">
              <Input type="text" placeholder="QUANTUM CORE" value={draftProject.title} onChange={(e) => setDraftProject({ ...draftProject, title: e.target.value })} />
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Стоимость">
                <Input type="text" placeholder="599 ₽" value={draftProject.price} onChange={(e) => setDraftProject({ ...draftProject, price: e.target.value })} />
              </FormField>
              <FormField label="Жанр">
                <Input type="text" placeholder="Action RPG" value={draftProject.genre} onChange={(e) => setDraftProject({ ...draftProject, genre: e.target.value })} />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Рейтинг">
                <Input type="number" step="0.1" min="1.0" max="5.0" value={draftProject.rating} onChange={(e) => setDraftProject({ ...draftProject, rating: parseFloat(e.target.value) || 5.0 })} />
              </FormField>
              <FormField label="Движок / Стек">
                <Input type="text" placeholder="Unity, Rust..." value={draftProject.engine} onChange={(e) => setDraftProject({ ...draftProject, engine: e.target.value })} />
              </FormField>
            </div>
            <FormField label="Описание проекта">
              <Textarea value={draftProject.description} onChange={(e) => setDraftProject({ ...draftProject, description: e.target.value })} placeholder="Расскажите о проекте..." rows={4} />
            </FormField>
            <FormField label="Победная номинация" hint="Необязательно">
              <Input type="text" placeholder="1-е Место Broken Worlds Jam" value={draftProject.award} onChange={(e) => setDraftProject({ ...draftProject, award: e.target.value })} />
            </FormField>
          </div>
        </Drawer>
      )}

      {/* З. Панель «Добавить/Редактировать Девлог» */}
      {(activeDrawer === 'addDevlog' || activeDrawer === 'editDevlog') && (
        <Drawer
          isOpen={true}
          onClose={() => setActiveDrawer(null)}
          title={activeDrawer === 'addDevlog' ? 'Написать девлог' : 'Редактировать девлог'}
          icon={<Edit3 className="w-5 h-5" />}
          size="md"
          footer={
            <Button variant="primary" onClick={() => {
              if (!draftDevlog.title.trim()) { triggerToast('Укажите заголовок', 'error'); return; }
              let list = [...(currentData as any).devlogs];
              if (activeDrawer === 'addDevlog') { list.unshift({ ...draftDevlog, id: Date.now(), date: '17.07.2026' } as any); triggerToast('Девлог добавлен', 'success'); }
              else { list = list.map((d: any) => d.id === draftDevlog.id ? draftDevlog : d); triggerToast('Девлог обновлён', 'success'); }
              updateCurrentProfile('devlogs', list);
              setActiveDrawer(null);
            }} className="w-full">
              {activeDrawer === 'addDevlog' ? 'Опубликовать' : 'Сохранить изменения'}
            </Button>
          }
        >
          <div className="flex flex-col gap-5">
            <FormField label="Заголовок">
              <Input type="text" placeholder="Оптимизация рендеринга в WebGL..." value={draftDevlog.title} onChange={(e) => setDraftDevlog({ ...draftDevlog, title: e.target.value })} />
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Категория">
                <Input type="text" placeholder="Оптимизация" value={draftDevlog.category} onChange={(e) => setDraftDevlog({ ...draftDevlog, category: e.target.value })} />
              </FormField>
              <FormField label="Связанная игра">
                <Input type="text" placeholder="QUANTUM CORE" value={draftDevlog.game} onChange={(e) => setDraftDevlog({ ...draftDevlog, game: e.target.value })} />
              </FormField>
            </div>
            <FormField label="Аннотация">
              <Textarea value={draftDevlog.summary} onChange={(e) => setDraftDevlog({ ...draftDevlog, summary: e.target.value })} placeholder="Краткое описание содержания поста..." rows={5} />
            </FormField>
          </div>
        </Drawer>
      )}

      {/* =========================================================================
          GUEST SUPPORT DRAWER
          ========================================================================= */}
      {/* =========================================================================
          GUEST SUPPORT DRAWER
          ========================================================================= */}
      <Drawer
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
        title="Поддержать автора"
        icon={<Heart className="w-5 h-5 text-reaction fill-current" />}
        footer={
          <div className="flex flex-col gap-3">
            <Button
              variant="primary"
              size="xl"
              fullWidth
              onClick={() => {
                setIsSupportOpen(false);
                triggerToast(`Вы успешно отправили ${selectedDonation} ₽! Спасибо за поддержку.`, 'success');
              }}
            >
              Оплатить {selectedDonation} ₽
            </Button>
            <span className="text-caption font-mono text-textTertiary text-center block font-medium">Транзакция защищена протоколом 3D Secure / СБП</span>
          </div>
        }
      >
        <p className="text-body-sm text-textSecondary leading-[1.6] mb-6 font-sans">
          Выберите желаемую сумму перевода для материальной поддержки разработок и WASM-сборок автора {currentData.name}. Все транзакции осуществляются напрямую.
        </p>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[300, 500, 1000, 1500, 3000, 5000].map((amount) => (
            <button
              key={amount}
              onClick={() => setSelectedDonation(amount)}
              className={`py-3 rounded-xl font-mono text-caption font-semibold border transition-all cursor-pointer ${
                selectedDonation === amount ? 'bg-reaction/10 border-reaction text-reaction shadow-sm' : 'bg-surface-2 border-borderDef text-textSecondary hover:text-textPrimary hover:bg-surface-3'
              }`}
            >
              {amount} ₽
            </button>
          ))}
        </div>
      </Drawer>


      {/* =========================================================================
          FOLLOWERS / FOLLOWING DRAWER
          ========================================================================= */}
      <FollowersDrawer
        isOpen={isFollowersDrawerOpen}
        onClose={() => { setIsFollowersDrawerOpen(false); setFollowersSearch(''); }}
        tab={followersDrawerTab}
        onTabChange={setFollowersDrawerTab}
        search={followersSearch}
        onSearchChange={setFollowersSearch}
        followers={MOCK_FOLLOWERS}
        following={MOCK_FOLLOWING}
        followStatuses={followStatuses}
        onToggleFollow={(id) => setFollowStatuses(prev => ({ ...prev, [id]: !prev[id] }))}
        profileName={currentData.name}
        isFollowersHidden={isFollowersHidden}
        isFollowingHidden={isFollowingHidden}
        isOwner={effectiveRole === 'owner'}
        onOpenPrivacySettings={() => {
          setIsFollowersDrawerOpen(false);
          setDraftPrivacySettings({ ...privacySettings });
          setActiveDrawer('privacy');
        }}
      />

      {/* =========================================================================
          ICON PICKER MODAL (для выбора иконки бейджа)
          ========================================================================= */}
      <IconPickerModal
        isOpen={iconPickerState.isOpen}
        onClose={() => setIconPickerState({ isOpen: false, badgeIndex: null })}
        currentIcon={iconPickerState.badgeIndex !== null ? draftBadges[iconPickerState.badgeIndex]?.icon || '' : ''}
        iconMap={BADGE_ICON_MAP}
        onSelect={(iconKey) => {
          if (iconPickerState.badgeIndex !== null) {
            const newBadges = [...draftBadges];
            newBadges[iconPickerState.badgeIndex] = {
              ...newBadges[iconPickerState.badgeIndex],
              icon: iconKey
            };
            setDraftBadges(newBadges);
          }
        }}
      />

      {/* Add To Collection Modal */}
      <AddToCollectionModal 
        isOpen={collectionGameProfile !== null}
        game={collectionGameProfile}
        collections={mockCollections}
        role={effectiveRole}
        onClose={() => {
          console.log('ProfilePage: Closing modal');
          setCollectionGameProfile(null);
        }}
        onSave={(gameId, collectionIds) => {
          console.log('ProfilePage: Saving game', gameId, 'to collections', collectionIds);
          triggerToast('Добавлено в коллекцию', 'success');
        }}
        onCreateNew={() => {
          console.log('ProfilePage: Create new collection');
        }}
        triggerToast={triggerToast}
      />

      {/* Модальное окно защиты от фишинга (BR-ACC-021) */}
      <AntiPhishingModal
        isOpen={antiPhishingState.isOpen}
        onClose={() => setAntiPhishingState({ isOpen: false, url: '', platformName: '' })}
        targetUrl={antiPhishingState.url}
        platformName={antiPhishingState.platformName}
      />

      {/* Модальное окно передачи прав на игру (FE-ACC-007) */}
      <GameTransferModal
        isOpen={!!gameForTransfer}
        onClose={() => setGameForTransfer(null)}
        game={gameForTransfer}
        onInitiateTransfer={handleInitiateGameTransfer}
      />

    </div>
  );
}
