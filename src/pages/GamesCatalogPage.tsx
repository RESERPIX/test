import React, { useState, useEffect, useMemo, useRef } from 'react';
import DevMatrixPanel from '../components/DevMatrixPanel';
import FontStyles from '../components/ui/FontStyles';
import { useToast } from '../components/ui/Toast';
import Button from '../components/ui/Button';
import Tabs from '../components/ui/Tabs';
import { CustomSelect, NativeSelect } from '../components/ui/Select';
import { SearchInput } from '../components/ui/Input';
import { Checkbox } from '../components/ui/Checkbox';
import Drawer from '../components/ui/Drawer';
import AddToCollectionModal from '../components/modals/AddToCollectionModal';
import QuickPlayDrawer from '../components/modals/QuickPlayDrawer';
import ReportContentModal from '../components/modals/ReportContentModal';
import DonationDrawer from '../components/modals/DonationDrawer';
import GameCardContextMenu from '../components/GameCardContextMenu';
import { GameGridCard, GameListCard, PlatformIcon } from '../components/GameCard';
import { 
  Search, Filter, SlidersHorizontal, Star, Bookmark, Play, Download,
  RefreshCw, AlertOctagon, X, ChevronDown, ChevronUp, ChevronRight,
  ChevronLeft, Plus, Lock, CheckCircle2, AlertTriangle, Info,
  Check, User, LayoutGrid, List, RotateCcw, Eye, Globe, Monitor, Apple,
  Flag, ExternalLink, Copy, Maximize2, Gamepad2, Heart, ArrowUpRight,
  Wrench, MoreVertical, ArrowUpDown
} from 'lucide-react';


const formatMetric = (num) => {
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
};

const MOCK_GAMES_DATABASE = [
  {
    id: "g1",
    slug: "brokenlore-follow",
    title: "BrokenLore: FOLLOW",
    short_desc: "Психологический хоррор от первого лица. Управляйте ограниченным запасом O2 в криокамере заброшенной станции «Танатос».",
    cover_url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop",
    author: { id: "u1", name: "NocturnalDevs", slug: "nocturnaldevs", is_team: false, avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=nocturnal" },
    ratingAvg: 4.8,
    ratingCount: 124,
    downloadsCount: 1240,
    viewsCount: 18500,
    price: 0,
    monetization: "free",
    monetizationLabel: "FREE",
    hasWebGL: true,
    hasBuilds: true,
    platforms: ["webgl", "windows"],
    category: "horror",
    categoryLabel: "Хоррор",
    genres: ["Хоррор", "Выживание", "Приключение"],
    tags: ["pixelart", "horror", "scifi", "atmospheric"],
    status: "released",
    statusLabel: "Выпущено",
    jamName: "Cyberjam 2026",
    isJamEntry: true,
    created_at: "2026-07-17"
  },
  {
    id: "g2",
    slug: "neon-horizon-vector-run",
    title: "Neon Horizon: Vector Run",
    short_desc: "Скоростной киберпанк-раннер с процедурно генерируемыми неоновыми трассами и динамичным синтвейв-саундтреком.",
    cover_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
    author: { id: "t1", name: "CyberRunner Studio", slug: "cyberrunner_team", is_team: true, avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=cyberteam" },
    ratingAvg: 4.6,
    ratingCount: 89,
    downloadsCount: 3400,
    viewsCount: 24200,
    price: 299,
    monetization: "paid",
    monetizationLabel: "299 ₽",
    hasWebGL: true,
    hasBuilds: true,
    platforms: ["webgl", "windows", "mac_os"],
    category: "action",
    categoryLabel: "Экшен",
    genres: ["Экшен", "Гонки", "Ритм-игры"],
    tags: ["cyberpunk", "fastpaced", "3d", "synthwave"],
    status: "released",
    statusLabel: "Выпущено",
    jamName: null,
    isJamEntry: false,
    created_at: "2026-06-10"
  },
  {
    id: "g3",
    slug: "void-architect-sandbox",
    title: "Void Architect: Orbital Physics Sandbox",
    short_desc: "Симулятор строительства и проектирования орбитальных станций в условиях аномальных гравитационных полей.",
    cover_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
    author: { id: "u2", name: "OrbitalMind", slug: "orbitalmind", is_team: false, avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=orbital" },
    ratingAvg: 4.9,
    ratingCount: 210,
    downloadsCount: 5200,
    viewsCount: 31000,
    price: 499,
    monetization: "paid",
    monetizationLabel: "499 ₽",
    hasWebGL: false,
    hasBuilds: true,
    platforms: ["windows", "linux", "mac_os"],
    category: "simulation",
    categoryLabel: "Симулятор",
    genres: ["Стратегия", "Симулятор"],
    tags: ["space", "sandbox", "physics"],
    status: "in_development",
    statusLabel: "В разработке",
    jamName: null,
    isJamEntry: false,
    created_at: "2026-05-01"
  },
  {
    id: "g4",
    slug: "chronos-card-tactics",
    title: "Chronos Tactics: Edge of Time",
    short_desc: "Тактический карточный баттлер с уникальной механикой управления временными петлями и кастомизацией колоды.",
    cover_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
    author: { id: "u3", name: "ChronoLab", slug: "chronolab", is_team: false, avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=chrono" },
    ratingAvg: 4.2,
    ratingCount: 45,
    downloadsCount: 890,
    viewsCount: 7400,
    price: 0,
    monetization: "pwyw",
    monetizationLabel: "PWYW",
    hasWebGL: true,
    hasBuilds: true,
    platforms: ["webgl", "windows", "linux"],
    category: "strategy",
    categoryLabel: "Стратегия",
    genres: ["Карточные игры", "Стратегия"],
    tags: ["pixelart", "turnbased", "deckbuilder"],
    status: "jam_build",
    statusLabel: "Джем-версия",
    jamName: "Cyberjam 2026",
    isJamEntry: true,
    created_at: "2026-07-20"
  },
  {
    id: "g5",
    slug: "aetheria-whispers-novel",
    title: "Aetheria: Whispers in Fog",
    short_desc: "Мрачный визуальный детективный роман в атмосфере стимпанк-мегаполиса XIX века с системой глубоких выборов.",
    cover_url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
    author: { id: "t2", name: "Maria_Art & Co", slug: "maria_art", is_team: true, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop" },
    ratingAvg: 4.7,
    ratingCount: 68,
    downloadsCount: 1560,
    viewsCount: 9200,
    price: 0,
    monetization: "free",
    monetizationLabel: "FREE",
    hasWebGL: true,
    hasBuilds: true,
    platforms: ["webgl", "windows"],
    category: "visual_novel",
    categoryLabel: "Визуальная новелла",
    genres: ["Визуальный роман", "Приключение"],
    tags: ["steampunk", "storyrich", "mystery"],
    status: "released",
    statusLabel: "Выпущено",
    jamName: null,
    isJamEntry: false,
    created_at: "2026-06-15"
  },
  {
    id: "g6",
    slug: "pixel-dungeon-slayer",
    title: "Dungeon Slayer: Reborn",
    short_desc: "Хардкорный пиксельный платформер-рогалик с процедурной генерацией подземелий и босс-файтами.",
    cover_url: null,
    author: { id: "u4", name: "PixelForge", slug: "pixelforge", is_team: false, avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=pixelforge" },
    ratingAvg: 4.4,
    ratingCount: 156,
    downloadsCount: 4100,
    viewsCount: 28000,
    price: 199,
    monetization: "paid",
    monetizationLabel: "199 ₽",
    hasWebGL: false,
    hasBuilds: true,
    platforms: ["windows", "mac_os", "linux"],
    category: "platformer",
    categoryLabel: "Платформер",
    genres: ["Платформер", "Экшен"],
    tags: ["pixelart", "roguelike", "2d"],
    status: "released",
    statusLabel: "Выпущено",
    jamName: null,
    isJamEntry: false,
    created_at: "2026-04-12"
  },
  {
    id: "g7",
    slug: "cyberpulse-arena-pvp",
    title: "CyberPulse: Neon Arena",
    short_desc: "Динамичный арена-шутер в неоновых декорациях. Тестирование сетевого кода и физики перемещений.",
    cover_url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop",
    author: { id: "u5", name: "PulseDev", slug: "pulsedev", is_team: false, avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=pulse" },
    ratingAvg: 4.1,
    ratingCount: 28,
    downloadsCount: 620,
    viewsCount: 4800,
    price: 0,
    monetization: "free",
    monetizationLabel: "FREE",
    hasWebGL: false,
    hasBuilds: false,
    platforms: ["windows"],
    category: "action",
    categoryLabel: "Экшен",
    genres: ["Шутер", "Экшен"],
    tags: ["cyberpunk", "coop", "3d", "fastpaced"],
    status: "prototype",
    statusLabel: "Прототип",
    jamName: null,
    isJamEntry: false,
    created_at: "2026-07-29"
  },
  {
    id: "g8",
    slug: "stellar-craft-colony",
    title: "Stellar Craft: Colony Sandbox",
    short_desc: "Симулятор колонизации далеких экзопланет с глубокой системой крафта и выживания в экстремальных средах.",
    cover_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
    author: { id: "u6", name: "StellarForge", slug: "stellarforge", is_team: false, avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=stellar" },
    ratingAvg: 4.5,
    ratingCount: 92,
    downloadsCount: 2100,
    viewsCount: 14500,
    price: 0,
    monetization: "free",
    monetizationLabel: "FREE",
    hasWebGL: false,
    hasBuilds: true,
    platforms: ["windows", "mac_os", "linux"],
    category: "sandbox",
    categoryLabel: "Песочница",
    genres: ["Симулятор", "Выживание", "Стратегия"],
    tags: ["space", "crafting", "sandbox", "survival"],
    status: "in_development",
    statusLabel: "В разработке",
    jamName: null,
    isJamEntry: false,
    created_at: "2026-05-20"
  }
];

const CATEGORIES_LIST = [
  { id: "all", label: "Все жанры" },
  { id: "action", label: "Экшен" },
  { id: "puzzle", label: "Головоломка" },
  { id: "platformer", label: "Платформер" },
  { id: "horror", label: "Хоррор" },
  { id: "rpg", label: "Ролевая игра" },
  { id: "simulation", label: "Симулятор" },
  { id: "strategy", label: "Стратегия" },
  { id: "visual_novel", label: "Визуальная новелла" },
  { id: "sandbox", label: "Песочница" }
];

const PLATFORMS_LIST = [
  { id: "webgl", label: "WebGL (В браузере)", icon: "webgl" },
  { id: "windows", label: "Windows (.exe)", icon: "windows" },
  { id: "mac_os", label: "macOS (.app)", icon: "mac_os" },
  { id: "linux", label: "Linux (.tar.gz)", icon: "linux" },
  { id: "android", label: "Android (.apk)", icon: "android" }
];

const MONETIZATION_LIST = [
  { id: "free", label: "Бесплатные" },
  { id: "pwyw", label: "Pay What You Want" },
  { id: "paid", label: "Платные" }
];

const STATUS_LIST = [
  { id: "released", label: "Полный релиз" },
  { id: "in_development", label: "В разработке" },
  { id: "prototype", label: "Прототип" },
  { id: "jam_build", label: "Джем-версия" }
];

const SORT_OPTIONS = [
  { id: "popular", label: "По популярности" },
  { id: "rating_desc", label: "По рейтингу" },
  { id: "date_desc", label: "Сначала новые" },
  { id: "price_asc", label: "Цена: по возрастанию" }
];

const POPULAR_TAGS_DICTIONARY = [
  "pixelart", "horror", "scifi", "cyberpunk", "space", 
  "sandbox", "roguelike", "synthwave", "physics", "deckbuilder",
  "steampunk", "coop", "survival", "crafting", "2d", "3d"
];

const PAGE_SIZE = 12;



const GameCardSkeleton = () => (
  <div className="bg-surface-1 border border-borderDef rounded-xl overflow-hidden flex flex-col p-4 gap-3 animate-pulse">
    <div className="w-full aspect-[16/9] bg-surface-2 rounded-xl" />
    <div className="h-5 bg-surface-2 rounded w-2/3" />
    <div className="flex items-center gap-2">
      <div className="w-5 h-5 rounded-full bg-surface-2" />
      <div className="h-4 bg-surface-2 rounded w-1/3" />
    </div>
    <div className="space-y-1.5 pt-1">
      <div className="h-3 bg-surface-2 rounded w-full" />
      <div className="h-3 bg-surface-2 rounded w-4/5" />
    </div>
    <div className="h-4 bg-surface-2 rounded w-1/2 mt-2" />
    <div className="h-9 bg-surface-2 rounded w-full mt-3" />
  </div>
);

const MobileFilterDrawer = ({
  isOpen,
  onClose,
  selectedPlatforms,
  setSelectedPlatforms,
  selectedMonetizations,
  setSelectedMonetizations,
  selectedCategory,
  setSelectedCategory,
  facetCounts,
  onResetFilters,
  totalResultsCount
}) => {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Фильтры каталога"
      icon={<SlidersHorizontal className="w-4 h-4 text-accent" />}
      size="sm"
      footer={
        <div className="space-y-2">
          <button 
            onClick={onClose}
            className="w-full h-11 bg-accent hover:bg-accent-hover text-white text-xs font-bold rounded-xl uppercase tracking-wider cursor-pointer"
          >
            Применить ({totalResultsCount} игр)
          </button>
          <button 
            onClick={onResetFilters}
            className="w-full h-9 bg-surface-2 border border-borderDef text-danger text-xs font-semibold rounded-xl cursor-pointer"
          >
            Сбросить фильтры
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <span className="text-caption font-bold text-textTertiary uppercase tracking-wider font-mono">Платформы</span>
          <div className="space-y-1">
            {PLATFORMS_LIST.map(p => {
              const isChecked = selectedPlatforms.includes(p.id);
              return (
                <div 
                  key={p.id} 
                  onClick={() => setSelectedPlatforms(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id])}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-surface-2 cursor-pointer text-xs select-none"
                >
                  <span className="flex items-center gap-2.5 text-textSecondary">
                    <Checkbox checked={isChecked} 
                      onChange={(val) => setSelectedPlatforms(prev => val ? [...prev, p.id] : prev.filter(x => x !== p.id))} 
                      disabled={false}
                      ariaLabel={p.label}
                    />
                    <PlatformIcon platform={p.icon} className="w-4 h-4 text-textTertiary" />
                    <span>{p.label}</span>
                  </span>
                  <span className="text-caption font-mono text-textTertiary bg-surface-2 px-1.5 py-0.5 rounded-lg border border-borderDef">
                    {facetCounts.platforms[p.id] || 0}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-2 border-t border-borderDef pt-4">
          <span className="text-caption font-bold text-textTertiary uppercase tracking-wider font-mono">Монетизация</span>
          <div className="space-y-1">
            {MONETIZATION_LIST.map(m => {
              const isChecked = selectedMonetizations.includes(m.id);
              return (
                <div 
                  key={m.id} 
                  onClick={() => setSelectedMonetizations(prev => prev.includes(m.id) ? prev.filter(x => x !== m.id) : [...prev, m.id])}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-surface-2 cursor-pointer text-xs select-none"
                >
                  <span className="flex items-center gap-2.5 text-textSecondary">
                    <Checkbox checked={isChecked} 
                      onChange={(val) => setSelectedMonetizations(prev => val ? [...prev, m.id] : prev.filter(x => x !== m.id))}
                      disabled={false}
                      ariaLabel={m.label}
                    />
                    <span>{m.label}</span>
                  </span>
                  <span className="text-caption font-mono text-textTertiary bg-surface-2 px-1.5 py-0.5 rounded-lg border border-borderDef">
                    {facetCounts.monetization[m.id] || 0}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-2 border-t border-borderDef pt-4">
          <span className="text-caption font-bold text-textTertiary uppercase tracking-wider font-mono">Жанр</span>
          <CustomSelect 
            value={selectedCategory} 
            onChange={setSelectedCategory}
            options={CATEGORIES_LIST.map(c => ({
              value: c.id,
              label: `${c.label} (${facetCounts.categories[c.id] || 0})`
            }))}
            className="w-full"
            variant="form"
            size="lg"
          />
        </div>
      </div>
    </Drawer>
  );
};




export default function App({ authState, setAuthState }: { authState?: string; setAuthState?: (val: string) => void }) {
  const [localRole, setLocalRole] = useState('player');
  const role = authState || localRole;
  
  // Mock current user ID - in production, this would come from auth context
  const currentUserId = role === 'developer' ? 1 : 999;
  const setRole = (val: string) => {
    setLocalRole(val);
    if (setAuthState) setAuthState(val);
  };
  const [catalogState, setCatalogState] = useState('standard');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isDevMatrixOpen, setIsDevMatrixOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectedMonetizations, setSelectedMonetizations] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedSort, setSelectedSort] = useState('popular');
  const [activeTags, setActiveTags] = useState([]);
  const [tagSearchTerm, setTagSearchTerm] = useState('');

  const [isGenresExpanded, setIsGenresExpanded] = useState(false);
  const [sidebarCollapsibles, setSidebarCollapsibles] = useState({
    platforms: true,
    monetization: true,
    statuses: true,
    genres: true,
    tags: true
  });

  const [activeQuickChip, setActiveQuickChip] = useState('all');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);

  const [quickPlayGame, setQuickPlayGame] = useState(null);
  const [collectionGame, setCollectionGame] = useState(null);
  const [reportGame, setReportGame] = useState(null);
  const [donationGame, setDonationGame] = useState(null);
  const [contextMenuGameId, setContextMenuGameId] = useState<string | null>(null);

  // Mock collections data
  const mockCollections = [
    { id: 'col_1', title: 'Избранное', games_count: 12 },
    { id: 'col_2', title: 'Играть позже', games_count: 8 },
    { id: 'col_3', title: 'Инди-хорроры 2026', games_count: 5 }
  ];

  const [collectedIds, setCollectedIds] = useState(new Set(['g1']));
  const { showToast: triggerToast } = useToast();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setCurrentPage(1);
    }, 200);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const toggleSidebarSection = (sectionKey) => {
    setSidebarCollapsibles(prev => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
  };

  const handleOpenContextMenu = (e, game) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenuGameId(contextMenuGameId === game.id ? null : game.id);
  };

  const handleCloseContextMenu = () => {
    setContextMenuGameId(null);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    setSelectedCategory('all');
    setSelectedPlatforms([]);
    setSelectedMonetizations([]);
    setSelectedStatuses([]);
    setSelectedSort('popular');
    setActiveTags([]);
    setActiveQuickChip('all');
    setCurrentPage(1);
    triggerToast('Все фильтры сброшены до значений по умолчанию');
  };

  const handleQuickChipClick = (chipId) => {
    setActiveQuickChip(chipId);
    setCurrentPage(1);
    if (chipId === 'all') {
      setSelectedPlatforms([]);
      setSelectedMonetizations([]);
      setSelectedStatuses([]);
    } else if (chipId === 'webgl') {
      setSelectedPlatforms(['webgl']);
    } else if (chipId === 'free') {
      setSelectedMonetizations(['free']);
    } else if (chipId === 'pwyw') {
      setSelectedMonetizations(['pwyw']);
    } else if (chipId === 'jam') {
      setSelectedStatuses(['jam_build']);
    }
  };

  const filteredGames = useMemo(() => {
    let result = [...MOCK_GAMES_DATABASE];

    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase().trim();
      result = result.filter(g => 
        g.title.toLowerCase().includes(q) ||
        g.short_desc.toLowerCase().includes(q) ||
        g.author.name.toLowerCase().includes(q) ||
        g.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter(g => g.category === selectedCategory);
    }
    if (selectedPlatforms.length > 0) {
      result = result.filter(g => selectedPlatforms.some(p => g.platforms.includes(p)));
    }
    if (selectedMonetizations.length > 0) {
      result = result.filter(g => selectedMonetizations.includes(g.monetization));
    }
    if (selectedStatuses.length > 0) {
      result = result.filter(g => selectedStatuses.includes(g.status));
    }
    if (activeTags.length > 0) {
      result = result.filter(g => activeTags.every(t => g.tags.includes(t)));
    }

    if (selectedSort === 'popular') {
      result.sort((a, b) => (b.viewsCount + b.downloadsCount * 2) - (a.viewsCount + a.downloadsCount * 2));
    } else if (selectedSort === 'rating_desc') {
      result.sort((a, b) => b.ratingAvg - a.ratingAvg);
    } else if (selectedSort === 'date_desc') {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (selectedSort === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    }

    return result;
  }, [debouncedQuery, selectedCategory, selectedPlatforms, selectedMonetizations, selectedStatuses, activeTags, selectedSort]);

  const facetCounts = useMemo(() => {
    const counts = { platforms: {}, monetization: {}, statuses: {}, categories: {} };

    PLATFORMS_LIST.forEach(p => {
      counts.platforms[p.id] = MOCK_GAMES_DATABASE.filter(g => g.platforms.includes(p.id)).length;
    });
    MONETIZATION_LIST.forEach(m => {
      counts.monetization[m.id] = MOCK_GAMES_DATABASE.filter(g => g.monetization === m.id).length;
    });
    STATUS_LIST.forEach(s => {
      counts.statuses[s.id] = MOCK_GAMES_DATABASE.filter(g => g.status === s.id).length;
    });
    CATEGORIES_LIST.forEach(c => {
      counts.categories[c.id] = c.id === 'all' 
        ? MOCK_GAMES_DATABASE.length 
        : MOCK_GAMES_DATABASE.filter(g => g.category === c.id).length;
    });

    return counts;
  }, []);

  const totalPages = Math.max(1, Math.ceil(filteredGames.length / PAGE_SIZE));
  const paginatedGames = filteredGames.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const activeFiltersCount = (selectedCategory !== 'all' ? 1 : 0) +
    selectedPlatforms.length +
    selectedMonetizations.length +
    selectedStatuses.length +
    activeTags.length +
    (searchQuery ? 1 : 0);

  const filteredTagDictionary = POPULAR_TAGS_DICTIONARY.filter(t => 
    !tagSearchTerm || t.toLowerCase().includes(tagSearchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-surface-0 text-textPrimary font-sans pb-12">
      <FontStyles />

      {/* DEV MATRIX CONTROL PANEL */}
      <DevMatrixPanel 
        pageName="Каталог игр"
        fields={[
          {
            id: 'role',
            label: 'Роль (Auth)',
            type: 'select',
            value: role,
            onChange: setRole,
            highlight: true,
            options: [
              { value: 'guest', label: 'Guest (Гость)' },
              { value: 'player', label: 'Player (Игрок)' },
              { value: 'author', label: 'Author (Владелец)' },
              { value: 'admin', label: 'Admin (Модерация)' }
            ]
          },
          {
            id: 'catalogState',
            label: 'Состояние',
            type: 'select',
            value: catalogState,
            onChange: setCatalogState,
            highlight: true,
            options: [
              { value: 'standard', label: '1. Standard' },
              { value: 'loading', label: '2. Loading' },
              { value: 'empty', label: '3. Empty' },
              { value: 'error', label: '4. Error State' }
            ]
          }
        ]}
      />

      {/* Main Catalog Workspace */}
      <main className="max-w-[1440px] mx-auto px-4 md:px-8 pt-8">
        
        {/* Title & Global Search */}
        <div className="mb-6 select-none">
          <h1 className="text-3xl sm:text-4xl md:text-[38px] font-extrabold text-textPrimary tracking-tight font-sans">
            Каталог игр
          </h1>
          <p className="text-sm text-textSecondary mt-2 max-w-[780px] leading-relaxed font-sans">
            Открывайте новые игры, находите интересные проекты и погружайтесь в мир независимой разработки.
          </p>

          <div className="relative w-full mt-4">
            <SearchInput
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              placeholder="Поиск по названию игры, тегам (#pixelart) или автору..."
            />
          </div>
        </div>

        {/* Section Tabs Row */}
        <div className="mb-8 relative">
          <Tabs
            tabs={[
              { id: 'all', label: 'Все проекты' },
              { id: 'webgl', label: 'WebGL (В браузере)' },
              { id: 'free', label: 'Бесплатные' },
              { id: 'pwyw', label: 'PWYW' },
              { id: 'jam', label: 'Джем-версии' }
            ]}
            activeTab={activeQuickChip}
            onChange={handleQuickChipClick}
          />
        </div>

        {/* Main Content Layout */}
        <div className="flex items-start gap-8">
          
          {/* Sidebar Filters */}
          <aside className="hidden md:flex flex-col w-[280px] shrink-0 sticky top-20 self-start gap-4 bg-surface-1 border border-borderDef/40 p-4 rounded-card shadow-elevation-base">
            <div className="flex items-center justify-between pb-3 border-b border-borderDef">
              <div className="flex items-center gap-2 text-xs font-bold text-textPrimary uppercase tracking-wider font-mono">
                <SlidersHorizontal className="w-3.5 h-3.5 text-accent" />
                <h3>Фильтры</h3>
              </div>
              {activeFiltersCount > 0 && (
                <button 
                  onClick={handleResetFilters}
                  className="text-caption text-textTertiary hover:text-danger transition-colors font-mono"
                >
                  Сбросить
                </button>
              )}
            </div>

            {/* Platforms Accordion Section */}
            <div className="space-y-1">
              <button 
                onClick={() => toggleSidebarSection('platforms')}
                className="w-full text-caption font-bold text-textTertiary uppercase tracking-[0.12em] font-mono py-1 flex items-center justify-between hover:text-textPrimary"
              >
                <span className="flex items-center gap-1.5">
                  <span>Платформы</span>
                  {selectedPlatforms.length > 0 && (
                    <span className="w-4 h-4 rounded-full bg-accent text-white text-caption font-bold flex items-center justify-center">
                      {selectedPlatforms.length}
                    </span>
                  )}
                </span>
                {sidebarCollapsibles.platforms ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {sidebarCollapsibles.platforms && (
                <div className="space-y-0.5 pt-1 animate-fadeIn">
                  {PLATFORMS_LIST.map(p => {
                    const isChecked = selectedPlatforms.includes(p.id);
                    return (
                      <div 
                        key={p.id}
                        onClick={() => setSelectedPlatforms(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id])}
                        className="group flex items-center justify-between px-2.5 py-1.5 rounded-xl hover:bg-surface-2 cursor-pointer text-xs transition-all duration-150 select-none"
                      >
                        <span className="flex items-center gap-2.5 text-textSecondary group-hover:text-textPrimary transition-colors">
                          <Checkbox checked={isChecked} 
                            onChange={(val) => setSelectedPlatforms(prev => val ? [...prev, p.id] : prev.filter(x => x !== p.id))}
                            disabled={false}
                            ariaLabel={p.label}
                          />
                          <PlatformIcon platform={p.icon} className="w-3.5 h-3.5 text-textTertiary group-hover:text-accent transition-colors" />
                          <span className="font-medium">{p.label}</span>
                        </span>
                        <span className="text-caption font-mono text-textTertiary bg-surface-2 group-hover:bg-surface-3 px-1.5 py-0.5 rounded-lg border border-borderDef">
                          {facetCounts.platforms[p.id] || 0}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Monetization Accordion Section */}
            <div className="space-y-1 border-t border-borderDef pt-3">
              <button 
                onClick={() => toggleSidebarSection('monetization')}
                className="w-full text-caption font-bold text-textTertiary uppercase tracking-[0.12em] font-mono py-1 flex items-center justify-between hover:text-textPrimary"
              >
                <span className="flex items-center gap-1.5">
                  <span>Монетизация</span>
                  {selectedMonetizations.length > 0 && (
                    <span className="w-4 h-4 rounded-full bg-accent text-white text-caption font-bold flex items-center justify-center">
                      {selectedMonetizations.length}
                    </span>
                  )}
                </span>
                {sidebarCollapsibles.monetization ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {sidebarCollapsibles.monetization && (
                <div className="space-y-0.5 pt-1 animate-fadeIn">
                  {MONETIZATION_LIST.map(m => {
                    const isChecked = selectedMonetizations.includes(m.id);
                    return (
                      <div 
                        key={m.id}
                        onClick={() => setSelectedMonetizations(prev => prev.includes(m.id) ? prev.filter(x => x !== m.id) : [...prev, m.id])}
                        className="group flex items-center justify-between px-2.5 py-1.5 rounded-xl hover:bg-surface-2 cursor-pointer text-xs transition-all duration-150 select-none"
                      >
                        <span className="flex items-center gap-2.5 text-textSecondary group-hover:text-textPrimary transition-colors">
                          <Checkbox checked={isChecked} 
                            onChange={(val) => setSelectedMonetizations(prev => val ? [...prev, m.id] : prev.filter(x => x !== m.id))}
                            disabled={false}
                            ariaLabel={m.label}
                          />
                          <span className="font-medium">{m.label}</span>
                        </span>
                        <span className="text-caption font-mono text-textTertiary bg-surface-2 group-hover:bg-surface-3 px-1.5 py-0.5 rounded-lg border border-borderDef/60">
                          {facetCounts.monetization[m.id] || 0}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Development Status Accordion Section */}
            <div className="space-y-1 border-t border-borderDef pt-3">
              <button 
                onClick={() => toggleSidebarSection('statuses')}
                className="w-full text-caption font-bold text-textTertiary uppercase tracking-[0.12em] font-mono py-1 flex items-center justify-between hover:text-textPrimary"
              >
                <span className="flex items-center gap-1.5">
                  <span>Статус разработки</span>
                  {selectedStatuses.length > 0 && (
                    <span className="w-4 h-4 rounded-full bg-accent text-white text-caption font-bold flex items-center justify-center">
                      {selectedStatuses.length}
                    </span>
                  )}
                </span>
                {sidebarCollapsibles.statuses ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {sidebarCollapsibles.statuses && (
                <div className="space-y-0.5 pt-1 animate-fadeIn">
                  {STATUS_LIST.map(s => {
                    const isChecked = selectedStatuses.includes(s.id);
                    return (
                      <div 
                        key={s.id}
                        onClick={() => setSelectedStatuses(prev => prev.includes(s.id) ? prev.filter(x => x !== s.id) : [...prev, s.id])}
                        className="group flex items-center justify-between px-2.5 py-1.5 rounded-xl hover:bg-surface-2 cursor-pointer text-xs transition-all duration-150 select-none"
                      >
                        <span className="flex items-center gap-2.5 text-textSecondary group-hover:text-textPrimary transition-colors">
                          <Checkbox checked={isChecked} 
                            onChange={(val) => setSelectedStatuses(prev => val ? [...prev, s.id] : prev.filter(x => x !== s.id))}
                            disabled={false}
                            ariaLabel={s.label}
                          />
                          <span className="font-medium">{s.label}</span>
                        </span>
                        <span className="text-caption font-mono text-textTertiary bg-surface-2 group-hover:bg-surface-3 px-1.5 py-0.5 rounded-lg border border-borderDef/60">
                          {facetCounts.statuses[s.id] || 0}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Genres Section with Progressive Disclosure */}
            <div className="space-y-1 border-t border-borderDef pt-3">
              <button 
                onClick={() => toggleSidebarSection('genres')}
                className="w-full text-caption font-bold text-textTertiary uppercase tracking-[0.12em] font-mono py-1 flex items-center justify-between hover:text-textPrimary"
              >
                <span>Жанры</span>
                {sidebarCollapsibles.genres ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {sidebarCollapsibles.genres && (
                <div className="space-y-0.5 pt-1 animate-fadeIn">
                  {(isGenresExpanded ? CATEGORIES_LIST : CATEGORIES_LIST.slice(0, 5)).map(c => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.id)}
                      className={`w-full group flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-all duration-150 select-none ${
                        selectedCategory === c.id 
                          ? 'bg-accent/10 border border-accent/30 text-accent font-semibold' 
                          : 'text-textSecondary hover:text-textPrimary hover:bg-surface-2'
                      }`}
                    >
                      <span className="font-medium">{c.label}</span>
                      <span className={`text-caption font-mono px-1.5 py-0.5 rounded-lg transition-all ${
                        selectedCategory === c.id ? 'bg-accent/20 text-accent' : 'text-textTertiary bg-surface-2 group-hover:bg-surface-3'
                      }`}>
                        {facetCounts.categories[c.id] || 0}
                      </span>
                    </button>
                  ))}

                  <button 
                    onClick={() => setIsGenresExpanded(!isGenresExpanded)}
                    className="w-full text-left text-caption font-mono text-accent hover:underline pt-1.5 px-2 font-semibold flex items-center gap-1"
                  >
                    <span>{isGenresExpanded ? 'Свернуть список' : `Показать все (${CATEGORIES_LIST.length})`}</span>
                    {isGenresExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>
              )}
            </div>

            {/* Tags Combobox Section */}
            <div className="space-y-2 border-t border-borderDef pt-3">
              <button 
                onClick={() => toggleSidebarSection('tags')}
                className="w-full text-caption font-bold text-textTertiary uppercase tracking-[0.12em] font-mono py-1 flex items-center justify-between hover:text-textPrimary"
              >
                <span className="flex items-center gap-1.5">
                  <span>Теги проектов</span>
                  {activeTags.length > 0 && (
                    <span className="w-4 h-4 rounded-full bg-accent text-white text-caption font-bold flex items-center justify-center">
                      {activeTags.length}
                    </span>
                  )}
                </span>
                {sidebarCollapsibles.tags ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {sidebarCollapsibles.tags && (
                <div className="space-y-2 pt-1 animate-fadeIn">
                  <SearchInput
                    variant="nested"
                    value={tagSearchTerm}
                    onChange={e => setTagSearchTerm(e.target.value)}
                    onClear={() => setTagSearchTerm('')}
                    placeholder="Поиск тега (#pixelart)..."
                  />

                  {filteredTagDictionary.length === 0 ? (
                    <div className="text-caption text-textTertiary font-mono italic px-1 py-1">
                      Тег не найден
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {filteredTagDictionary.slice(0, 8).map(tag => {
                        const isActive = activeTags.includes(tag);
                        return (
                          <button
                            key={tag}
                            onClick={() => {
                              if (isActive) setActiveTags(prev => prev.filter(t => t !== tag));
                              else setActiveTags(prev => [...prev, tag]);
                            }}
                            className={`text-caption px-2 py-0.5 rounded-lg border transition-all duration-150 font-sans ${
                              isActive 
                                ? 'bg-accent/15 border-accent text-accent font-semibold shadow-[0_0_8px_rgba(124,58,237,0.2)]' 
                                : 'bg-surface-2 border-borderDef text-textTertiary hover:text-textPrimary hover:border-accent/40'
                            }`}
                          >
                            #{tag}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

          </aside>

          {/* Grid Output */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">

            {/* Grid-Aligned Active Filter Chips */}
            {activeFiltersCount > 0 && (
              <div className="flex items-center gap-2 flex-wrap mb-1 animate-fadeIn">
                {selectedCategory !== 'all' && (
                  <span className="bg-accent/10 border border-accent/20 text-accent hover:border-accent/40 transition-colors text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium select-none">
                    {CATEGORIES_LIST.find(c => c.id === selectedCategory)?.label}
                    <X className="w-3.5 h-3.5 cursor-pointer hover:text-white transition-colors" onClick={() => setSelectedCategory('all')} />
                  </span>
                )}
                {selectedPlatforms.map(p => (
                  <span key={p} className="bg-accent/10 border border-accent/20 text-accent hover:border-accent/40 transition-colors text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium select-none">
                    {PLATFORMS_LIST.find(pl => pl.id === p)?.label}
                    <X className="w-3.5 h-3.5 cursor-pointer hover:text-white transition-colors" onClick={() => setSelectedPlatforms(prev => prev.filter(x => x !== p))} />
                  </span>
                ))}
                {selectedMonetizations.map(m => (
                  <span key={m} className="bg-accent/10 border border-accent/20 text-accent hover:border-accent/40 transition-colors text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium select-none">
                    {MONETIZATION_LIST.find(ml => ml.id === m)?.label}
                    <X className="w-3.5 h-3.5 cursor-pointer hover:text-white transition-colors" onClick={() => setSelectedMonetizations(prev => prev.filter(x => x !== m))} />
                  </span>
                ))}
                {activeTags.map(t => (
                  <span key={t} className="bg-accent/10 border border-accent/20 text-accent hover:border-accent/40 transition-colors text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium select-none">
                    #{t}
                    <X className="w-3.5 h-3.5 cursor-pointer hover:text-white transition-colors" onClick={() => setActiveTags(prev => prev.filter(x => x !== t))} />
                  </span>
                ))}
                <button 
                  onClick={handleResetFilters}
                  className="text-xs text-textSecondary hover:text-danger hover:bg-danger/10 px-3 py-1.5 rounded-full transition-colors font-medium flex items-center gap-1.5 ml-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Сбросить все</span>
                </button>
              </div>
            )}
            
            {/* View & Sort Toolbar */}
            <div className="flex items-center justify-between gap-4 pb-3 border-b border-borderDef/30">
              <div className="flex items-center gap-3">
                <span className="text-xs text-textTertiary">Найдено проектов: <strong className="text-textPrimary">{filteredGames.length}</strong></span>
                
                <button 
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="md:hidden h-8 px-3 bg-surface-2 border border-borderDef text-xs text-textPrimary rounded-xl flex items-center gap-1.5 ml-auto uppercase tracking-wider font-semibold"
                >
                  <Filter className="w-3.5 h-3.5 text-accent" />
                  <span>Фильтры {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
                </button>
              </div>

              <div className="flex items-center gap-3 justify-end">
                <CustomSelect 
                  value={selectedSort} 
                  onChange={setSelectedSort}
                  labelPrefix="Сортировка"
                  options={SORT_OPTIONS.map(o => ({ value: o.id, label: o.label }))}
                  icon={<ArrowUpDown className="w-3.5 h-3.5 text-accent" />}
                />

                <div className="flex items-center border border-borderDef rounded-xl overflow-hidden bg-surface-2">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-surface-3 text-accent' : 'text-textTertiary'}`}
                    title="Вид сеткой"
                    aria-label="Вид сеткой"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-surface-3 text-accent' : 'text-textTertiary'}`}
                    title="Вид списком"
                    aria-label="Вид списком"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {catalogState === 'loading' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 isolate">
                {[1, 2, 3, 4, 5, 6].map(i => <GameCardSkeleton key={i} />)}
              </div>
            )}

            {/* Network Error State */}
            {catalogState === 'error' && (
              <div className="w-full bg-surface-1 border border-danger/40 p-12 rounded-2xl flex flex-col items-center text-center gap-4">
                <div className="w-12 h-12 rounded-full bg-danger/10 border border-danger/30 flex items-center justify-center text-danger">
                  <AlertOctagon className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-textPrimary">Ошибка соединения с сервером</h2>
                <p className="text-xs text-textTertiary max-w-[420px]">
                  Не удалось загрузить каталог игр. Проверьте подключение к интернету или повторите попытку через несколько секунд.
                </p>
                <button 
                  onClick={() => {
                    setCatalogState('loading');
                    setTimeout(() => setCatalogState('standard'), 800);
                  }}
                  className="bg-accent hover:bg-accent-hover text-white text-xs font-bold px-4 py-2 rounded-xl uppercase tracking-wider flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Повторить попытку</span>
                </button>
              </div>
            )}

            {/* Empty State */}
            {catalogState === 'empty' || (catalogState === 'standard' && filteredGames.length === 0) ? (
              <div className="w-full bg-surface-1 border border-dashed border-borderDef p-12 rounded-2xl flex flex-col items-center text-center gap-4">
                <div className="w-12 h-12 rounded-full border border-borderDef flex items-center justify-center text-textTertiary">
                  <Search className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-textPrimary">Игры не найдены</h2>
                <p className="text-xs text-textTertiary max-w-[420px]">
                  По вашему запросу не найдено ни одного проекта. Попробуйте сбросить параметры поиска.
                </p>
                <button 
                  onClick={handleResetFilters}
                  className="bg-accent hover:bg-accent-hover text-white text-xs font-bold px-4 py-2 rounded-xl uppercase tracking-wider"
                >
                  Сбросить все фильтры
                </button>
              </div>
            ) : null}

            {/* Standard Game Grid / List View */}
            {catalogState === 'standard' && filteredGames.length > 0 && (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn isolate">
                    {paginatedGames.map(game => {
                      const isOwner = String(game.author?.id) === String(currentUserId);
                      return (
                        <GameGridCard 
                          key={game.id}
                          game={game}
                          isCollected={collectedIds.has(game.id)}
                          onToggleCollection={() => setCollectionGame(game)}
                          onQuickPlay={setQuickPlayGame}
                          onOpenContextMenu={handleOpenContextMenu}
                          contextMenuOpen={contextMenuGameId === game.id}
                          onCloseContextMenu={handleCloseContextMenu}
                          onReport={isOwner ? undefined : setReportGame}
                          triggerToast={triggerToast}
                          onSelectTag={(t) => setActiveTags(prev => [...prev, t])}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 animate-fadeIn isolate">
                    {paginatedGames.map(game => {
                      const isOwner = String(game.author?.id) === String(currentUserId);
                      return (
                        <GameListCard 
                          key={game.id}
                          game={game}
                          isCollected={collectedIds.has(game.id)}
                          onToggleCollection={() => setCollectionGame(game)}
                          onQuickPlay={setQuickPlayGame}
                          onOpenContextMenu={handleOpenContextMenu}
                          contextMenuOpen={contextMenuGameId === game.id}
                          onCloseContextMenu={handleCloseContextMenu}
                          onReport={isOwner ? undefined : setReportGame}
                          triggerToast={triggerToast}
                          onSelectTag={(t) => setActiveTags(prev => [...prev, t])}
                        />
                      );
                    })}
                  </div>
                )}

                {/* Pagination Controls */}
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className="w-11 h-11 border border-borderDef bg-surface-2 rounded-xl disabled:opacity-30 flex items-center justify-center"
                    aria-label="Предыдущая страница"
                  >
                    <ChevronLeft className="w-4 h-4 text-textTertiary" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-11 h-11 rounded-xl border font-bold text-xs flex items-center justify-center ${
                        currentPage === page ? 'bg-accent border-accent text-white' : 'bg-surface-2 border-borderDef text-textTertiary'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className="w-11 h-11 border border-borderDef bg-surface-2 rounded-xl disabled:opacity-30 flex items-center justify-center"
                    aria-label="Следующая страница"
                  >
                    <ChevronRight className="w-4 h-4 text-textTertiary" />
                  </button>
                </div>
              </>
            )}

          </div>

        </div>

      </main>

      {/* Mobile Drawer Offcanvas */}
      <MobileFilterDrawer 
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        selectedPlatforms={selectedPlatforms}
        setSelectedPlatforms={setSelectedPlatforms}
        selectedMonetizations={selectedMonetizations}
        setSelectedMonetizations={setSelectedMonetizations}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        facetCounts={facetCounts}
        onResetFilters={handleResetFilters}
        totalResultsCount={filteredGames.length}
      />

      {/* QuickPlay WebGL Sandbox Drawer */}
      <QuickPlayDrawer 
        isOpen={quickPlayGame !== null}
        game={quickPlayGame}
        onClose={() => setQuickPlayGame(null)}
        onOpenCollectionModal={(g) => setCollectionGame(g)}
        onOpenDonationDrawer={(g) => setDonationGame(g)}
        onOpenReportModal={(g) => setReportGame(g)}
        triggerToast={triggerToast}
      />

      {/* Add To Collection Modal */}
      <AddToCollectionModal 
        isOpen={collectionGame !== null}
        game={collectionGame}
        collections={mockCollections}
        role={role}
        onClose={() => setCollectionGame(null)}
        onSave={(gameId, collectionIds) => {
          console.log('Saving game', gameId, 'to collections', collectionIds);
        }}
        onCreateNew={() => {
          console.log('Create new collection');
        }}
        triggerToast={triggerToast}
      />

      {/* Report Content Modal */}
      <ReportContentModal 
        isOpen={reportGame !== null}
        game={reportGame}
        onClose={() => setReportGame(null)}
        triggerToast={triggerToast}
        role={role}
      />

      {/* Donation Drawer */}
      <DonationDrawer
        isOpen={donationGame !== null}
        onClose={() => setDonationGame(null)}
        recipientName={donationGame?.title}
        role={role}
        triggerToast={triggerToast}
      />
    </div>
  );
}