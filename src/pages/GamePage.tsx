import React, { useState, useEffect, useRef } from 'react';
import DevMatrixPanel from '../components/DevMatrixPanel';
import FontStyles from '../components/ui/FontStyles';
import { useToast } from '../components/ui/Toast';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Tabs from '../components/ui/Tabs';
import AddToCollectionModal from '../components/modals/AddToCollectionModal';
import BugReportDrawer from '../components/modals/BugReportDrawer';
import Drawer from '../components/ui/Drawer';
import QuickPlayDrawer from '../components/modals/QuickPlayDrawer';
import ReportContentModal from '../components/modals/ReportContentModal';
import DonationDrawer from '../components/modals/DonationDrawer';
import ContactRequestModal from '../components/modals/ContactRequestModal';
import { creatorSupportService } from '../services/creatorSupportService';
import ReviewsSection from '../components/ReviewsSection';
import CustomSelect from '../components/ui/Select';
import DevLogGameWidget from '../components/devlog/DevLogGameWidget';
import CheckoutPage from './CheckoutPage';
import MarketGameCard from '../components/MarketGameCard';
import {
  ShoppingCart, Check, Trophy, ShieldAlert, Play, Share2, Heart, Flag, ChevronDown, Download, AlertTriangle,
  Lock, Star, MessageSquare, Bug, ChevronLeft, ChevronRight, X,
  Clock, Bell, User, Layers, Info, Folder, RefreshCw, AlertOctagon,
  ArrowUpRight, Bookmark, CheckCircle2, ExternalLink, Calendar, Plus, Swords,
  Upload, Trash2, Monitor, Cpu, Mail
} from 'lucide-react';

// User Rating Widget Component
const UserRatingWidget = ({
  isOwner,
  role,
  hasPlayed,
  onSubmit,
  triggerToast
}: {
  isOwner: boolean;
  role: string;
  hasPlayed: boolean;
  onSubmit: (rating: number, comment: string) => void;
  triggerToast: (msg: string, type: string) => void;
}) => {
  const [ratingValue, setRatingValue] = useState(0);
  const [ratingHover, setRatingHover] = useState(0);
  const [comment, setComment] = useState('');
  const [isVerified, setIsVerified] = useState(true); // Mock: user is verified
  const [hasPurchased, setHasPurchased] = useState(false); // Mock: for paid games

  // Hide widget for game owner
  if (isOwner) {
    return null;
  }

  const handleSubmit = () => {
    if (role === 'guest') {
      triggerToast('Войдите в аккаунт, чтобы оставить оценку', 'warning');
      return;
    }

    if (!hasPlayed) {
      triggerToast('Запустите или скачайте игру, чтобы оставить оценку', 'warning');
      return;
    }

    if (!ratingValue) {
      triggerToast('Пожалуйста, выберите оценку', 'warning');
      return;
    }

    if (!comment.trim()) {
      triggerToast('Напишите текстовый отзыв', 'warning');
      return;
    }

    onSubmit(ratingValue, comment);
    setRatingValue(0);
    setComment('');
  };

  const getRatingLabel = () => {
    if (ratingValue === 0) return '';
    return ['', 'Плохо', 'Так себе', 'Нормально', 'Хорошо', 'Отлично'][ratingValue];
  };

  return (
    <div className="flex flex-col gap-5 pt-4 pb-8">
      {/* Star Rating Row */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map(star => (
            <Star
              key={star}
              onMouseEnter={() => setRatingHover(star)}
              onMouseLeave={() => setRatingHover(0)}
              onClick={() => setRatingValue(ratingValue === star ? 0 : star)}
              className={`w-9 h-9 cursor-pointer transition-transform duration-200 hover:scale-110 ${(ratingHover || ratingValue) >= star
                ? 'text-accent fill-accent'
                : 'text-surface-3 fill-surface-3 hover:text-accent/40 hover:fill-accent/40'
                }`}
              strokeWidth={0}
            />
          ))}
        </div>

        {ratingValue > 0 && (
          <span className="text-accent text-sm font-bold tracking-tight animate-fadeIn">
            {getRatingLabel()}
          </span>
        )}
      </div>

      {/* Comment Field (Modern single shape) */}
      <div className="relative group">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={500}
          placeholder="Расскажите о своих впечатлениях..."
          className="w-full bg-surface-2/40 hover:bg-surface-2/60 focus:bg-surface-2 focus:ring-1 focus:ring-accent/50 rounded-card text-base text-textPrimary placeholder:text-textTertiary resize-none min-h-[140px] p-5 pb-16 leading-relaxed outline-none transition-all border-none"
          disabled={role === 'guest'}
        />

        {/* Floating Bottom Row inside the textarea shape */}
        <div className="absolute bottom-4 left-5 right-4 flex items-center justify-between">
          <span className="text-xs text-textDisabled font-medium">
            {comment.length} / 500
          </span>

          <button
            onClick={handleSubmit}
            disabled={!ratingValue || !comment.trim() || role === 'guest' || !hasPlayed}
            className={`h-9 px-5 rounded-control text-sm font-bold transition-all ${ratingValue && role !== 'guest' && hasPlayed
              ? 'bg-accent hover:bg-accent-hover text-white shadow-md shadow-accent/20'
              : 'bg-surface-3 text-textDisabled cursor-not-allowed opacity-70'
              }`}
          >
            {role === 'guest' ? 'Войдите для оценки' : !hasPlayed ? 'Сначала запустите игру' : 'Опубликовать'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Rating Breakdown Component for Regular Games (5-star histogram)
const RatingBreakdown = ({ ratingData }: { ratingData: any }) => {
  const totalRatings = ratingData.total || 0;
  const avgRating = ratingData.average || 0;
  const distribution = ratingData.distribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  if (totalRatings === 0) {
    return (
      <div className="bg-surface-1 border border-borderDef rounded-card p-6 flex flex-col items-center justify-center gap-3 text-center">
        <Star className="w-8 h-8 text-textDisabled" />
        <div>
          <h4 className="text-sm font-bold text-textPrimary mb-1">Нет оценок</h4>
          <p className="text-xs text-textTertiary">Будьте первым, кто оценит эту игру</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 flex flex-col gap-6">
      {/* Header with average */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <Star className="w-5 h-5 text-warning fill-warning" />
          <div>
            <span className="text-base font-semibold text-textSecondary">Оценка игроков</span>
            <span className="text-2xl font-bold text-textPrimary ml-3 font-mono">{avgRating.toFixed(2)} / 5.00</span>
          </div>
        </div>
        <span className="text-xs text-textTertiary font-mono">Всего: {totalRatings}</span>
      </div>

      {/* 5-star histogram */}
      <div className="flex flex-col gap-2">
        {[5, 4, 3, 2, 1].map(stars => {
          const count = distribution[stars] || 0;
          const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;

          return (
            <div key={stars} className="flex items-center gap-3">
              {/* Stars display */}
              <div className="flex items-center gap-0.5 w-20 shrink-0">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${i < stars ? 'text-warning fill-warning' : 'text-surface-3 fill-surface-3'}`}
                  />
                ))}
              </div>

              {/* Label */}
              <span className="text-xs text-textTertiary font-mono w-16 shrink-0">
                {stars} {stars === 1 ? 'звезда' : stars < 5 ? 'звезды' : 'звезд'}
              </span>

              {/* Progress bar */}
              <div className="flex-1 h-2 bg-surface-0 rounded-full overflow-hidden border border-borderDef">
                <div
                  className="h-full bg-gradient-to-r from-warning to-accent transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {/* Percentage and count */}
              <span className="text-xs text-textSecondary font-mono w-20 text-right">
                {percentage.toFixed(0)}% ({count})
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const BROKEN_LORE_DATA = {
  id: 'game-brokenlore',
  title: 'BrokenLore: FOLLOW',
  genre: 'Sci-Fi Horror, Психологический триллер',
  jamName: 'Cyberjam 2026',
  ratingAvg: '4.8',
  ratingCount: '124 отзыва',
  downloads: '1 240',
  versions: 'v1.2.4',
  warnings: 'Игра содержит мрачные сцены, клаустрофобные пространства и резкие звуковые эффекты.',
  // Rating data for regular game
  ratingData: {
    total: 124,
    average: 4.85,
    distribution: {
      5: 105,
      4: 15,
      3: 3,
      2: 1,
      1: 0
    }
  },
  // Jam rating data (shown when jamState !== 'none')
  jamRatingData: {
    average: 4.72,
    criteria: [
      { name: 'Геймплей / Gameplay', score: 4.8 },
      { name: 'Соответствие теме / Theme', score: 4.9 },
      { name: 'Графика / Art', score: 4.6 },
      { name: 'Звук и Музыка / Audio', score: 4.5 }
    ]
  },
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
      role: 'Player',
      rating: 5,
      date: 'Вчера',
      score: 14,
      text: 'Потрясающая атмосфера космического вакуума! На втором уровне падает частота кадров. У всех так?',
      replies: [
        {
          id: 11,
          author: 'NocturnalDevs', authorId: 1,
          role: 'Author',
          date: 'Вчера',
          score: 5,
          text: 'Спасибо за отзыв! Патч 1.2.4 оптимизирует работу. Попробуйте перезапустить сессию.',
          replies: []
        }
      ]
    }
  ]
};

const MINIMAL_DATA = {
  id: 'game-brokenlore-demo',
  title: 'BrokenLore: FOLLOW (Tech Demo)',
  genre: 'Sci-Fi Sandbox',
  jamName: 'Cyberjam 2026',
  ratingAvg: '3.5',
  ratingCount: '2 отзыва',
  downloads: '42',
  versions: 'v1.0.0-draft',
  warnings: 'Минимальный технический прототип.',
  ratingData: {
    total: 2,
    average: 3.5,
    distribution: {
      5: 1,
      4: 0,
      3: 0,
      2: 1,
      1: 0
    }
  },
  jamRatingData: {
    average: 0,
    criteria: []
  },
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

export default function App({ slug, authState, setAuthState }: { slug?: string; authState?: string; setAuthState?: (val: string) => void }) {
  console.log('GamePage loaded with slug:', slug);
  // --- STATE MATRIX ---
  const [localRole, setLocalRole] = useState('player');
  const role = authState || localRole;

  // Mock current user ID - in production, this would come from auth context
  // For demo purposes: user ID 1 is NocturnalDevs (author), others are not
  const currentUserId = role === 'developer' ? 1 : 999; // Change to test owner check
  const setRole = (val: string) => {
    setLocalRole(val);
    if (setAuthState) setAuthState(val);
  };
  const [status, setStatus] = useState('published');
  const [jamState, setJamState] = useState('none');
  const [contentFill, setContentFill] = useState('happy');
  const [releasesTabState, setReleasesTabState] = useState('standard');
  const [donationState, setDonationState] = useState('active');
  const [hasPlayed, setHasPlayed] = useState(false);
  const [pageState, setPageState] = useState('standard');

  const [isPaid, setIsPaid] = useState(true);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isOwned, setIsOwned] = useState(false);
  const [offSale, setOffSale] = useState(false);
  const [unlisted, setUnlisted] = useState(false);
  const [restricted, setRestricted] = useState(false);
  const [downloadLimit, setDownloadLimit] = useState(false);


  // Локальные состояния интерфейса
  const [activeTab, setActiveTab] = useState('description');
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

  // --- СОСТОЯНИЯ БАГ-РЕПОРТА (ОБНОВЛЕННЫЙ DRAWER ИЗ ЭТАЛОНА) ---
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isBugReportDrawerOpen, setIsBugReportDrawerOpen] = useState(false);
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

  // --- СОСТОЯНИЯ ПОДДЕРЖКИ АВТОРА И СВЯЗИ ---
  const [isDonationDrawerOpen, setIsDonationDrawerOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const { showToast } = useToast();

  // FE-ACC-011 STAGE 2: GAME SUBSCRIPTION VS USER FOLLOW (BR-ACC-067, SC-ACC-027)
  const [isGameSubscribed, setIsGameSubscribed] = useState(false);
  const [gameSubscribersCount, setGameSubscribersCount] = useState(142);
  const [isAuthorFollowed, setIsAuthorFollowed] = useState(false);
  const [userReviews, setUserReviews] = useState<any[]>([]);

  const handleToggleGameSubscription = () => {
    if (role === 'guest') {
      showToast('Войдите в аккаунт, чтобы подписаться на обновления игры', 'warning');
      return;
    }

    if (isGameSubscribed) {
      setIsGameSubscribed(false);
      setGameSubscribersCount(prev => Math.max(0, prev - 1));
      showToast('Вы отписались от обновлений этой игры', 'info');
    } else {
      setIsGameSubscribed(true);
      setGameSubscribersCount(prev => prev + 1);
      showToast('Вы подписались на обновления игры. Оповещения о патчах и релизах будут приходить в Центр уведомлений', 'success');
    }
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

  const handleOpenJamSubmission = () => {
    const jamPath = '/jams/cyberjam/brokenlore-follow';
    if ((window as any).__hubigrNavigate) {
      (window as any).__hubigrNavigate(jamPath);
    } else {
      window.location.hash = `#${jamPath}`;
    }
  };

  const profileMenuRef = useRef(null);

  const data = contentFill === 'happy' ? BROKEN_LORE_DATA : MINIMAL_DATA;
  const allReviews = [...userReviews, ...data.reviews];

  // Dynamic Game Support Projection (BR-CSP-015, AC-CSP-007, AC-CSP-008)
  const primaryAuthor = data.authors?.[0];
  const supportOwnerType: 'user' | 'team' =
    primaryAuthor?.role?.toLowerCase().includes('team') ||
    primaryAuthor?.role?.toLowerCase().includes('студ')
      ? 'team'
      : 'user';
  const supportOwnerId: string = 'u_nocturnal';
  const supportOwnerName: string = primaryAuthor?.name || 'Nocturnal Games';

  const gameSupportProjection = creatorSupportService.getGameSupportProjection(
    data.id,
    supportOwnerType,
    supportOwnerId,
    supportOwnerName
  );
  const hasActiveSupportLinks = gameSupportProjection.hasActiveLinks;

  // Owner check: determine if current user is an author of this game
  const isOwner = role === 'author';

  useEffect(() => {
    setIsPlayerActive(false);
    setActiveSlide(0);
    setIsBuildsOpen(false);
    setIsBugReportDrawerOpen(false);
    setIsProfileMenuOpen(false);
  }, [contentFill, jamState, role]);

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
      triggerToast('Изменения успешно отправлен разработчикам!', 'success');

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
        pageName="Страница игры"
        fields={[
          {
            id: 'role',
            label: 'Роль',
            type: 'buttons',
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
            id: 'hasPlayed',
            label: 'Запускал игру',
            type: 'checkbox',
            value: hasPlayed,
            onChange: setHasPlayed
          },
          {
            id: 'isGameSubscribed',
            label: 'Подписка на игру (SC-ACC-027)',
            type: 'checkbox',
            value: isGameSubscribed,
            onChange: (val) => {
              setIsGameSubscribed(val);
              setGameSubscribersCount(prev => val ? prev + 1 : Math.max(0, prev - 1));
            }
          },
          {
            id: 'isAuthorFollowed',
            label: 'Подписка на автора (SC-ACC-026)',
            type: 'checkbox',
            value: isAuthorFollowed,
            onChange: setIsAuthorFollowed
          },
          {
            id: 'jamState',
            label: 'Джем (AC-MKT-065)',
            type: 'buttons',
            value: jamState,
            onChange: (val: string) => {
              if (val === 'jam_page') {
                handleOpenJamSubmission();
              } else {
                setJamState(val);
              }
            },
            options: [
              { value: 'none', label: '[1. Вне джемов]' },
              { value: 'results', label: '[2. Призер джема]' },
              { value: 'jam_page', label: '[3. Открыть JamGamePage ➔]' }
            ]
          },
          {
            id: 'isPaid', label: 'Платная игра', type: 'checkbox', value: isPaid, onChange: setIsPaid
          },
          {
            id: 'hasWebGL', label: 'WebGL плеер', type: 'checkbox', value: hasWebGL, onChange: setHasWebGL
          },
          {
            id: 'isOwned', label: 'Куплена (В библиотеке)', type: 'checkbox', value: isOwned, onChange: setIsOwned
          },
          {
            id: 'unlisted', label: 'Скрыта из каталога (unlisted)', type: 'checkbox', value: unlisted, onChange: setUnlisted
          },
          {
            id: 'restricted', label: 'Заблокирована админом', type: 'checkbox', value: restricted, onChange: setRestricted
          },
          {
            id: 'offSale', label: 'Снята с продажи', type: 'checkbox', value: offSale, onChange: setOffSale
          },
          {
            id: 'dlLimit', label: 'Лимит загрузок исчерпан', type: 'checkbox', value: downloadLimit, onChange: setDownloadLimit
          },
          {
            id: 'pageState',
            label: 'Состояние страницы',
            type: 'buttons',
            value: pageState,
            onChange: setPageState,
            highlight: true,
            options: [
              { value: 'standard', label: '[Успешно (Standard)]' },
              { value: 'loading', label: '[Загрузка (Loading)]' },
              { value: 'not_found', label: '[Не найдено (404)]' },
              { value: 'error', label: '[Ошибка сети (500)]' }
            ]
          },
          {
            id: 'releasesTabState',
            label: 'Релизы',
            type: 'buttons',
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
              { value: 'error', label: '[4. Ошибка сети]' }
            ]
          }
        ]}
      />


      {pageState === 'loading' && (
        <div className="w-full min-h-[80vh] flex flex-col items-center justify-center p-8">
          <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin mb-6"></div>
          <h2 className="text-xl font-bold text-textPrimary font-mono animate-pulse">Загрузка игры...</h2>
        </div>
      )}

      {pageState === 'not_found' && (
        <div className="w-full min-h-[80vh] flex flex-col items-center justify-center p-8 text-center">
          <div className="text-6xl mb-6">👻</div>
          <h2 className="text-2xl font-bold text-textPrimary font-sans mb-3">Игра не найдена</h2>
          <p className="text-textSecondary max-w-[400px]">Возможно, автор удалил проект, или вы перешли по неверной ссылке.</p>
        </div>
      )}

      {pageState === 'error' && (
        <div className="w-full min-h-[80vh] flex flex-col items-center justify-center p-8 text-center">
          <div className="text-danger mb-4 border border-danger/20 bg-danger/10 p-4 rounded-full">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-textPrimary font-sans mb-3">Ошибка подключения</h2>
          <p className="text-textSecondary max-w-[400px]">Не удалось загрузить данные игры. Проверьте подключение к интернету.</p>
        </div>
      )}

      {pageState === 'standard' && (
        <>
          {/* --- СИСТЕМНЫЕ СТАТУСНЫЕ БАННЕРЫ --- */}

          {role === 'author' && (
            <div className="bg-surface-1 border-b border-borderDef px-4 md:px-8 py-3 flex items-center justify-between sticky top-10 z-20">
              <span className="text-xs text-textTertiary font-mono uppercase tracking-wider">Панель управления автора</span>
              <div className="flex items-center gap-3">
                <button className="text-xs h-9 px-4 hover:bg-surface-3 rounded-card transition-colors text-textPrimary font-medium border border-borderDef active:scale-95 duration-120">
                  Редактировать страницу
                </button>
                <div className="relative group">
                  <button
                    className="text-xs h-9 px-4 rounded-card flex items-center gap-2 transition-colors border font-medium active:scale-95 duration-120 text-textPrimary bg-surface-3 border-borderDef hover:bg-surface-3"
                  >
                    Управление билдами
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* --- ГЛАВНЫЙ КОНТЕНТНЫЙ БЛОК --- */}

          {(!isOwner && role !== 'admin' && role !== 'moderator' && status !== 'published') ? (
            <div className="flex-1 flex flex-col items-center justify-center py-32 text-center relative z-10 animate-fadeIn">
              <div className="w-24 h-24 bg-surface-2 border-borderDef rounded-full flex items-center justify-center mb-6">
                <ShieldAlert className="w-10 h-10 text-textDisabled" />
              </div>
              <h1 className="text-3xl font-black text-textPrimary mb-3 font-sans">Страница недоступна</h1>
              <p className="text-textSecondary max-w-md mx-auto leading-relaxed">
                {status === 'draft' ? 'Эта игра еще не опубликована автором и скрыта от публичного доступа.' : 'Эта страница скрыта платформой или находится на модерации.'}
              </p>
            </div>
          ) : (
            <main className="max-w-[1440px] mx-auto px-4 md:px-8 pt-6 sm:pt-10 pb-44 md:pb-24">

              {/* Хлебные крошки и заголовок */}
              <div className="mb-8 select-none">
                <div className="text-xs font-semibold text-textTertiary uppercase tracking-wider mb-2 font-mono">
                  {data.genre ? `Каталог игр / ${data.genre.split(',')[0].trim()}` : 'Каталог игр'}
                </div>

                <h1 className="text-3xl md:text-[44px] font-bold leading-[1.1] tracking-tight text-textPrimary mb-4 font-sans">
                  {data.title}
                </h1>


                <div className="flex flex-wrap items-center gap-2.5">
                  {jamState === 'results' && (
                    <span className="bg-celebratory/10 border border-celebratory/30 text-celebratory px-3 py-1 rounded-control text-xs font-bold flex items-center gap-1.5 uppercase tracking-wide">
                      <Trophy className="w-3.5 h-3.5" /> Cyberjam 2026: 2-е Место
                    </span>
                  )}
                  {data.genre && data.genre.split(',').map((g, i) => (
                    <span key={i} className="bg-surface-2 border border-borderDef text-textTertiary px-3 py-1 rounded-control text-xs font-medium font-mono uppercase">
                      {g.trim()}
                    </span>
                  ))}
                  {hasWebGL && (
                    <span className="bg-surface-2 border border-borderDef text-textTertiary px-3 py-1 rounded-control text-xs font-medium font-mono uppercase">
                      WebGL Build
                    </span>
                  )}
                </div>
              </div>

              {/* СЕТКА LAYOUT: УМНАЯ СЕТКА GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-y-8 lg:gap-12 items-start">

                {/* БЛОК 1: ПЛЕЕР И СКРИНШОТЫ (Отображается первым) */}
                <div className="w-full flex flex-col gap-4 order-1 lg:col-start-1 lg:row-start-1">
                  <div className="w-full flex flex-col gap-4">
                    <div className="w-full aspect-[16/10] bg-surface-1 rounded-modal overflow-hidden relative border border-borderDef shadow-2xl">
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
                            className={`w-full h-full object-cover transition-opacity duration-200 ${hasWebGL ? 'opacity-85' : 'opacity-100'}`}
                          />
                          {hasWebGL && <div className="absolute inset-0 bg-gradient-to-t from-surface-0/60 to-transparent" />}

                          {hasWebGL && (!isPaid || isOwned) && !restricted && !offSale && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-fadeIn">
                              <button
                                onClick={() => {
                                  setIsPlayerActive(true);
                                  setHasPlayed(true);
                                }}
                                className={`pointer-events-auto pl-6 pr-8 py-4 rounded-card font-extrabold text-sm sm:text-base flex items-center gap-3.5 transition-all duration-120 shadow-md tracking-wider uppercase border-none ${!isOwned && (offSale || restricted) ? 'bg-surface-3 text-textDisabled cursor-not-allowed' : 'bg-accent hover:bg-accent-hover text-white active:scale-95 cursor-pointer'}`}
                                disabled={!isOwned && (offSale || restricted)}
                              >
                                <Play className="w-5 h-5 fill-current" />
                                Запустить WebGL
                              </button>
                            </div>
                          )}

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

                {/* БЛОК 3: ТАБЫ И ОПИСАНИЕ (Отображается третьим на мобилке, вторым рядом на десктопе) */}
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

                              </div>


                              {/* СИСТЕМНЫЕ ТРЕБОВАНИЯ */}
                              {!hasWebGL && (
                                <div className="flex flex-col gap-4 font-sans mt-8">
                                  <span className="text-sm font-bold text-textPrimary">Системные требования</span>
                                  <div className="rounded-card overflow-hidden">
                                    <Tabs
                                      tabs={[
                                        { id: 'win', label: 'Windows' },
                                        { id: 'mac', label: 'macOS' },
                                        { id: 'lin', label: 'Linux' }
                                      ]}
                                      activeTab="win"
                                      onChange={() => { }}

                                    />
                                    <div className="py-4 grid grid-cols-1 lg:grid-cols-2 gap-8 text-sm">
                                      <div className="flex flex-col gap-3">
                                        <h4 className="font-bold text-textPrimary mb-1">Минимальные</h4>
                                        <div className="flex flex-col gap-2.5 text-textSecondary">
                                          <div><strong className="text-textPrimary font-medium">ОС:</strong> Windows 10 (64-bit)</div>
                                          <div><strong className="text-textPrimary font-medium">Процессор:</strong> Intel Core i3-4160 / AMD FX-4350</div>
                                          <div><strong className="text-textPrimary font-medium">Оперативная память:</strong> 4 GB ОЗУ</div>
                                          <div><strong className="text-textPrimary font-medium">Видеокарта:</strong> GeForce GTX 660 / Radeon HD 7850</div>
                                          <div><strong className="text-textPrimary font-medium">Место на диске:</strong> 2 GB свободного места</div>
                                        </div>
                                      </div>
                                      <div className="flex flex-col gap-3">
                                        <h4 className="font-bold text-textPrimary mb-1">Рекомендуемые</h4>
                                        <div className="flex flex-col gap-2.5 text-textSecondary">
                                          <div><strong className="text-textPrimary font-medium">ОС:</strong> Windows 11 (64-bit)</div>
                                          <div><strong className="text-textPrimary font-medium">Процессор:</strong> Intel Core i5-8400 / Ryzen 5 2600</div>
                                          <div><strong className="text-textPrimary font-medium">Оперативная память:</strong> 8 GB ОЗУ</div>
                                          <div><strong className="text-textPrimary font-medium">Видеокарта:</strong> GeForce GTX 1060 / Radeon RX 580</div>
                                          <div><strong className="text-textPrimary font-medium">Место на диске:</strong> 2 GB свободного места (SSD)</div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

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

                    {/* ЛЕНТА ДЕВЛОГОВ */}
                    {activeTab === 'devlog' && (
                      <div className="flex flex-col gap-0 relative border-l border-borderDef pl-6 md:pl-8 ml-3 md:ml-4 animate-fadeIn">
                        <DevLogGameWidget 
                          gameId={data.id} 
                          gameSlug={slug} 
                          gameName={data.title} 
                          isOwner={role === 'author'} 
                        />
                      </div>
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

                        {releasesTabState === 'standard' && (
                          <div className="w-full flex flex-col gap-8">
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
                                      triggerToast(`Загрузка релиза ${rel.version}...`, "success");
                                    }}
                                    className="px-5 py-2.5 rounded-card border border-borderDef text-textPrimary bg-transparent hover:bg-surface-2 text-xs font-bold font-mono tracking-wide uppercase flex items-center gap-2.5 transition-all duration-120 active:scale-95"
                                  >
                                    <Download className="w-4 h-4 text-textTertiary" />
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
                                            triggerToast(`Загрузка архива версии ${rel.version}`, "success");
                                          }}
                                          className="p-1.5 rounded-control transition-all flex items-center gap-1.5 font-mono text-xs font-bold uppercase duration-120 active:scale-95 text-textTertiary hover:text-textPrimary"
                                        >
                                          <Download className="w-3.5 h-3.5" />
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

                  {/* ОБСУЖДЕНИЕ И ФОРМЫ */}
                  <div id="reviews-section" className="mt-12 border-t border-borderDef pt-12 w-full scroll-mt-24">
                    <div className="flex items-center justify-between mb-8 flex-wrap gap-4 select-none">
                      <h2 className="text-[24px] font-bold tracking-tight text-textPrimary font-sans">
                        Обсуждение <span className="font-mono text-textDisabled font-normal text-[18px]">({allReviews.length})</span>
                      </h2>

                      <div className="flex items-center gap-3">
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

                    {/* Rating Widgets Section */}
                    <div className="flex flex-col gap-6 mb-10">
                      {/* User Rating Widget */}
                      <UserRatingWidget
                        isOwner={isOwner}
                        role={role}
                        hasPlayed={hasPlayed}
                        onSubmit={(rating, comment) => {
                          triggerToast(`Спасибо за оценку ${rating}/5!`, 'success');
                          const newReview = {
                            id: Date.now(),
                            author: 'Вы (Игрок)',
                            authorId: currentUserId,
                            role: 'Player' as const,
                            isVerifiedOwner: true,
                            rating,
                            date: 'Только что',
                            text: comment,
                            score: 0,
                            developerResponse: null,
                          };
                          setUserReviews(prev => [newReview, ...prev]);
                        }}
                        triggerToast={triggerToast}
                      />

                      {/* Rating Breakdown */}
                      <RatingBreakdown ratingData={data.ratingData} />
                    </div>

                    {/* Modern Reviews Section */}
                    <ReviewsSection
                      reviews={allReviews}
                      currentUserId={currentUserId}
                      role={role}
                      hideTitle
                      onReply={(reviewId, text) => {
                        triggerToast('Ответ опубликован!', 'success');
                      }}
                      onVote={(reviewId) => {
                        triggerToast('+1', 'info');
                      }}
                      onEdit={(reviewId) => {
                        triggerToast('Редактирование отзыва', 'info');
                      }}
                      onDelete={(reviewId) => {
                        triggerToast('Отзыв удален', 'success');
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
                  
                  <div className="bg-surface-1 border border-borderDef rounded-card shadow-sm overflow-hidden flex flex-col">
                    
                    {/* СЕКЦИЯ 1: ЦЕНА И ПОКУПКА */}
                    <div className="p-5 flex flex-col gap-4">
                      {/* Плашка административного ограничения */}
                      {restricted && !isOwned && (
                        <div className="bg-danger/10 border border-danger/30 text-danger text-xs px-3 py-2 rounded-control font-medium flex items-start gap-2">
                          <ShieldAlert className="w-4 h-4 shrink-0" />
                          <span>Доступ к покупке игры временно ограничен администрацией</span>
                        </div>
                      )}

                      {/* Плашка снятия с продажи */}
                      {offSale && (
                        <div className="bg-surface-2 border border-borderDef text-textSecondary text-xs px-3 py-2 rounded-control font-medium flex items-start gap-2">
                          <ShieldAlert className="w-4 h-4 text-warning shrink-0" />
                          <span>{isOwned ? 'Снято с продажи (Доступно вам)' : 'Игра снята с продажи разработчиком'}</span>
                        </div>
                      )}

                      {/* Лимит загрузок */}
                      {downloadLimit && isOwned && (
                        <div className="bg-danger/10 border border-danger/30 text-danger text-xs px-3 py-2 rounded-control font-medium flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          <span>Достигнут суточный лимит (10/10). Доступ к файлам обновится через 12 часов</span>
                        </div>
                      )}

                      {/* ЦЕННИК */}
                      {!offSale || isOwned ? (
                        <div className="flex items-center justify-between">
                          {isPaid ? (
                            isOwned ? (
                              <div className="w-full flex items-center gap-3 bg-surface-2/60 border border-borderDef/60 px-3.5 py-2.5 rounded-card">
                                <div className="w-8 h-8 rounded-full bg-surface-3 flex items-center justify-center shrink-0 border border-borderDef shadow-sm">
                                  <CheckCircle2 className="w-4 h-4 text-textSecondary" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-sm font-bold text-textPrimary leading-none mb-1 font-sans">В библиотеке</span>
                                  <span className="text-xs text-textTertiary leading-none font-sans">У вас есть доступ к игре</span>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <Badge variant="accent">-30%</Badge>
                                <div className="flex flex-col">
                                  <span className="text-xs text-textTertiary line-through decoration-danger decoration-2 leading-none font-mono">500 ₽</span>
                                  <span className="text-2xl font-bold text-textPrimary leading-none font-mono">350 ₽</span>
                                </div>
                              </div>
                            )
                          ) : (
                            <div className="text-2xl font-bold text-success font-mono">Бесплатно</div>
                          )}
                        </div>
                      ) : null}

                      {/* КНОПКИ ДЕЙСТВИЯ */}
                      <div className="flex flex-col gap-2">
                        {/* Guest Logic */}
                        {role === 'guest' ? (
                          isPaid ? (
                            <Button variant="primary" fullWidth size="lg" icon={<ShoppingCart className="w-4 h-4" />} disabled={restricted || offSale}>Войти и купить</Button>
                          ) : hasWebGL ? (
                            <Button variant="primary" fullWidth size="lg" icon={<Play className="w-4 h-4 fill-current" />} disabled={!isOwned && (offSale || restricted)}>Играть в браузере</Button>
                          ) : (
                            <Button variant="primary" fullWidth size="lg" icon={<Download className="w-4 h-4" />}>Войти для загрузки</Button>
                          )
                        ) : (
                          /* Auth User Logic */
                          isPaid && !isOwned ? (
                            <Button variant="primary" fullWidth size="lg" icon={<ShoppingCart className="w-4 h-4" />} disabled={restricted || offSale} onClick={() => setIsCheckoutOpen(true)}>КУПИТЬ ЗА 350 ₽</Button>
                          ) : isOwned || !isPaid ? (
                            <>
                              {hasWebGL && <Button variant="primary" fullWidth size="lg" icon={<Play className="w-4 h-4 fill-current" />} disabled={!isOwned && (offSale || restricted)}>Играть в браузере</Button>}
                              <Button variant={hasWebGL ? "secondary" : "primary"} fullWidth size="lg" icon={<Download className="w-4 h-4" />} disabled={downloadLimit && !hasWebGL}>
                                {isPaid || isOwned ? 'Скачать игру' : 'Получить в библиотеку'}
                              </Button>
                            </>
                          ) : null
                        )}
                      </div>

                      {/* Вторичные действия */}
                      <div className="flex items-center gap-2 mt-1">
                        <Button variant="outline" fullWidth icon={<Heart className="w-3.5 h-3.5" />}>В избранное</Button>
                        <Button variant="outline" fullWidth icon={<Bookmark className="w-3.5 h-3.5" />} onClick={() => setIsAddToCollectionModalOpen(true)}>В коллекцию</Button>
                        <Button variant="outline" icon={<Share2 className="w-3.5 h-3.5" />} onClick={handleCopyLink} aria-label="Поделиться" className="bg-transparent hover:bg-surface-1" />
                      </div>
                    </div>

                    {/* СЕКЦИЯ 2: РАЗРАБОТЧИК */}
                    <div className="p-5 border-t border-borderDef/50 flex items-center justify-between hover:bg-surface-1 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-surface-3 border border-borderDef overflow-hidden flex items-center justify-center shadow-sm">
                          <User className="w-5 h-5 text-textTertiary" />
                        </div>
                        <div>
                          <div className="text-base font-bold text-textPrimary group-hover:text-accent transition-colors leading-tight">{data.authors?.[0]?.name || 'NocturnalDevs'}</div>
                          <div className="text-[13px] text-textTertiary leading-tight mt-0.5">Разработчик</div>
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
                       
                      >
                        {isAuthorFollowed ? 'Вы подписаны' : 'Подписаться'}
                      </Button>
                    </div>

                    {/* СЕКЦИЯ 3: МЕТАДАННЫЕ */}
                    <div className="p-5 border-t border-borderDef/50 flex flex-col gap-3.5 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-textTertiary">Релиз</span>
                        <span className="font-mono text-textPrimary text-[13px]">12.04.2026</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-textTertiary">Версия</span>
                        <span className="font-mono text-textPrimary text-[13px]">{data.versions || 'v1.2.4'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-textTertiary">Платформы</span>
                        <div className="flex items-center gap-2 text-textSecondary text-[13px]">
                          {hasWebGL && <span className="flex items-center gap-1.5" title="WebGL"><Play className="w-3 h-3 fill-current" /> Web</span>}
                          <span className="text-textTertiary">·</span>
                          <span className="flex items-center gap-1.5" title="Windows"><Monitor className="w-3 h-3" /> Windows</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-textTertiary">Языки</span>
                        <span className="text-textPrimary text-[13px] text-right">Русский <span className="text-textTertiary mx-1">·</span> Английский</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-textTertiary">Возраст</span>
                        <Badge variant="neutral" size="sm">12+</Badge>
                      </div>
                    </div>

                    {/* СЕКЦИЯ 4: ПОДДЕРЖКА И ПОДПИСКА */}
                    <div className="p-5 border-t border-borderDef/50 flex flex-col gap-5">
                      {/* Поддержать автора */}
                      {hasActiveSupportLinks && (
                        <button 
                          onClick={() => setIsDonationDrawerOpen(true)}
                          className="w-full flex items-center justify-between group cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            <Heart className="w-5 h-5 text-textTertiary group-hover:text-reaction transition-colors" />
                            <span className="text-sm font-bold text-textPrimary group-hover:text-reaction transition-colors">Поддержать автора</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-textTertiary group-hover:text-reaction transition-colors" />
                        </button>
                      )}

                      {/* Подписка на игру */}
                      <button 
                        onClick={handleToggleGameSubscription}
                        className="w-full flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-start gap-4">
                          <Bell className={`w-5 h-5 mt-0.5 transition-colors ${isGameSubscribed ? 'text-accent' : 'text-textTertiary group-hover:text-accent'}`} />
                          <div className="flex flex-col items-start">
                            <span className={`text-sm font-bold transition-colors ${isGameSubscribed ? 'text-accent' : 'text-textPrimary group-hover:text-accent'}`}>
                              {isGameSubscribed ? 'Подписка активна' : 'Подписаться на обновления'}
                            </span>
                            <span className="text-xs text-textTertiary mt-0.5">Патчи, обновления и релизы игры</span>
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 transition-colors ${isGameSubscribed ? 'text-accent' : 'text-textTertiary group-hover:text-accent'}`} />
                      </button>
                    </div>

                    {/* СЕКЦИЯ 5: СОЦИАЛЬНЫЕ ССЫЛКИ */}
                    <div className="p-3.5 border-t border-borderDef/50 flex items-center justify-between">
                      <Button variant="ghost" size="sm" onClick={() => setIsBugReportDrawerOpen(true)} className="text-textTertiary hover:text-danger hover:bg-danger/10" icon={<Bug className="w-4 h-4" />}>Сообщить о баге</Button>
                      <Button variant="ghost" size="sm" onClick={() => setIsReportModalOpen(true)} className="text-textTertiary" icon={<Flag className="w-4 h-4" />}>Жалоба</Button>
                    </div>

                  </div>

                  {/* РЕЗУЛЬТАТЫ ДЖЕМА (AC-MKT-065: Jam Achievements) */}
                  {jamState === 'results' && (
                    <div className="bg-celebratory/10 border border-celebratory/30 rounded-card p-5 animate-fadeIn relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                        <Trophy className="w-24 h-24 text-celebratory" />
                      </div>
                      <div className="relative z-10 flex flex-col gap-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Trophy className="w-4 h-4 text-celebratory shrink-0" />
                          <span className="text-xs font-bold text-celebratory uppercase tracking-wider font-mono">Cyberjam 2026</span>
                        </div>
                        <h3 className="text-lg font-bold text-textPrimary">2-е Место: Лучшая Атмосфера</h3>
                        <p className="text-xs text-textSecondary leading-relaxed">
                          Игра вошла в топ-3 проектов в номинации "Атмосфера и звук" среди 450 участников.
                        </p>
                        <button
                          type="button"
                          onClick={handleOpenJamSubmission}
                          className="mt-2 text-xs font-bold text-accent uppercase tracking-wider flex items-center gap-1.5 hover:underline w-max cursor-pointer"
                        >
                          Страница заявки на джеме <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                </aside>


              </div>

              {/* 8. БЛОКИ РЕКОМЕНДАЦИЙ (CROSS-DISCOVERY) */}
              <div className="mt-20 border-t border-borderDef pt-10 flex flex-col gap-12">

                <section>
                  <h2 className="text-xl font-bold text-textPrimary mb-6 flex items-center gap-2 font-sans">
                    Похожие игры
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {/* MOCK GAMES */}
                    <MarketGameCard
                      id="m1" title="Cyber Hunter" coverUrl="/mocks/cover1.jpg"
                      developer={{ name: 'IndieDev', avatarUrl: null }}
                      price={0} rating={4.5} reviewsCount={120} platforms={['webgl']}
                    />
                    <MarketGameCard
                      id="m2" title="Space Mining" coverUrl="/mocks/cover2.jpg"
                      developer={{ name: 'Nebula', avatarUrl: null }}
                      price={150} rating={4.2} reviewsCount={45} platforms={['windows']}
                    />
                    <MarketGameCard
                      id="m3" title="Neon Drift" coverUrl="/mocks/cover3.jpg"
                      developer={{ name: 'NeonStudios', avatarUrl: null }}
                      price={500} rating={4.8} reviewsCount={300} platforms={['windows', 'mac_os']}
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
          )}

          {/* ================= DONATION DRAWER ================= */}
          {isCheckoutOpen && (
            <CheckoutPage
              alreadyOwned={isOwned}
              onClose={() => setIsCheckoutOpen(false)}
              onGoToLibrary={() => {
                setIsCheckoutOpen(false);
                triggerToast('Переход в библиотеку...', 'success');
              }}
              onGoToGame={() => setIsCheckoutOpen(false)}
            />
          )}

          <DonationDrawer
            isOpen={isDonationDrawerOpen}
            onClose={() => setIsDonationDrawerOpen(false)}
            recipientName={supportOwnerName}
            ownerType={supportOwnerType}
            ownerId={supportOwnerId}
            context="game"
            contextId={data.id}
            role={role}
            triggerToast={triggerToast}
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

          {/* DRAWER: СООБЩИТЬ О ПРОБЛЕМЕ (FE-BUG-001, FE-BUG-002, FE-BUG-009) */}
          <BugReportDrawer
            isOpen={isBugReportDrawerOpen}
            onClose={() => setIsBugReportDrawerOpen(false)}
            role={role}
            gameTitle={data.title}
            gameId={data.id?.toString() || 'g1'}
            isPaid={isPaid}
            hasEntitlement={isOwned}
            detectedVersion={data.versions || 'v1.0.4'}
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

          {/* =========================================================================
          MOBILE CONTEXTUAL STICKY CTA (Floating Pill)
          ========================================================================= */}
          <div className={`fixed bottom-[84px] left-4 right-4 z-40 flex md:hidden transition-all duration-300 ${showMobileStickyCta ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-8 opacity-0 pointer-events-none'
            }`}>
            <div className="w-full bg-surface-1/95 backdrop-blur-xl border border-borderDef shadow-[0_8px_32px_rgba(0,0,0,0.6)] rounded-modal p-2.5 flex items-center justify-between gap-2.5">
              <div className="flex-1 min-w-0">
                <button
                  onClick={() => {
                    if (hasWebGL) {
                      setIsPlayerActive(true);
                      setHasPlayed(true);
                    } else if (isPaid && !isOwned) {
                      triggerToast('Переход к покупке игры...', 'info');
                    } else {
                      triggerToast('Запуск скачивания...', 'success');
                    }
                  }}
                  className="w-full h-11 bg-accent hover:bg-accent-hover text-white font-extrabold text-[13px] tracking-wide rounded-card flex items-center justify-center gap-2 cursor-pointer touch-manipulation active:scale-[0.98] shadow-sm uppercase"
                  disabled={!isOwned && (offSale || restricted)}
                >
                  {hasWebGL ? (
                    <>
                      <Play className="w-4 h-4 fill-current shrink-0" />
                      <span className="truncate">Играть</span>
                    </>
                  ) : isPaid && !isOwned ? (
                    <>
                      <ShoppingCart className="w-4 h-4 shrink-0" />
                      <span className="truncate">Купить</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 shrink-0" />
                      <span className="truncate">{isPaid || isOwned ? 'Скачать' : 'В библиотеку'}</span>
                    </>
                  )}
                </button>
              </div>
              <button
                onClick={() => setIsAddToCollectionModalOpen(true)}
                className="h-11 w-11 shrink-0 bg-surface-2 hover:bg-surface-3 border border-borderDef text-textSecondary rounded-card flex items-center justify-center cursor-pointer touch-manipulation active:scale-[0.98]"
                aria-label="В коллекцию"
              >
                <Bookmark className={`w-4 h-4 ${isCollected ? 'text-accent fill-accent' : 'text-textTertiary'}`} />
              </button>
              {hasActiveSupportLinks && (
                <button
                  onClick={() => setIsDonationDrawerOpen(true)}
                  className="h-11 w-11 shrink-0 bg-surface-2 hover:bg-surface-3 border border-borderDef text-reaction rounded-card flex items-center justify-center cursor-pointer touch-manipulation active:scale-[0.98]"
                  aria-label="Поддержать автора"
                  title="Поддержать автора"
                >
                  <Heart className="w-4 h-4 text-reaction" />
                </button>
              )}
              <button
                onClick={handleCopyLink}
                className="h-11 w-11 shrink-0 bg-surface-2 hover:bg-surface-3 border border-borderDef text-textSecondary rounded-card flex items-center justify-center cursor-pointer touch-manipulation active:scale-[0.98]"
                aria-label="Поделиться"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
