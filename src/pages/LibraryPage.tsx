import React, { useState, useMemo } from 'react';
import { 
  Search, ShieldAlert, Gamepad2, AlertCircle, Eye, EyeOff,
  ArrowUpDown, Filter
} from 'lucide-react';
import Button from '../components/ui/Button';
import DevMatrixPanel from '../components/DevMatrixPanel';
import { Badge } from '../components/ui/Badge';
import { Tabs } from '../components/ui/Tabs';
import { CustomSelect } from '../components/ui/Select';
import { SearchInput } from '../components/ui/Input';
import { LibraryGameCard, LibraryGame } from '../components/LibraryGameCard';
import { ConfirmActionModal } from '../components/modals/ConfirmActionModal';
import { useToast } from '../components/ui/Toast';

// Rich Mock Data adhering strictly to the spec
const INITIAL_GAMES: LibraryGame[] = [
  { 
    id: 1, 
    slug: 'cyber-quest-neon',
    title: 'Cyber Quest: Neon Awakening', 
    developer: { name: '@cyber_studio', avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100' },
    version: 'v1.2.0', 
    updatedAt: '15.08.2026',
    coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800', 
    isFree: false, 
    isOffSale: false,
    platforms: ['web', 'win', 'mac'], 
    isHidden: false 
  },
  { 
    id: 2, 
    slug: 'pixel-dungeon',
    title: 'Pixel Dungeon Chronicles', 
    developer: { name: '@retro_dev', avatarUrl: null },
    version: 'v1.0.4', 
    updatedAt: '10.08.2026',
    coverUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800', 
    isFree: true, 
    isOffSale: false,
    platforms: ['win', 'linux'], 
    isHidden: false 
  },
  { 
    id: 3, 
    slug: 'stellar-drift',
    title: 'Stellar Drift: Deep Space', 
    developer: '@orbit_studios', 
    version: 'v2.0.1', 
    updatedAt: '01.08.2026',
    coverUrl: 'https://images.unsplash.com/photo-1614294149010-950b698f72c0?q=80&w=800', 
    isFree: false, 
    isOffSale: true, // Off-sale test case
    platforms: ['win', 'mac'], 
    isHidden: false 
  },
  { 
    id: 4, 
    slug: 'abyssal-soulslike',
    title: 'Abyssal Soulslike', 
    developer: '@ironforge', 
    version: 'v1.5.0', 
    updatedAt: '28.07.2026',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800', 
    isFree: false, 
    isOffSale: false,
    platforms: ['win'], 
    isHidden: false 
  },
  { 
    id: 5, 
    slug: 'neo-tokyo-racer',
    title: 'Neo-Tokyo Synth Racer', 
    developer: '@speed_rush', 
    version: 'v1.1.2', 
    updatedAt: '22.07.2026',
    coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800', 
    isFree: true, 
    isOffSale: false,
    platforms: ['web'], 
    isHidden: false 
  },
  { 
    id: 6, 
    slug: 'aetheria-whispers',
    title: 'Aetheria: Whispers in Fog', 
    developer: '@maria_art', 
    version: 'v1.0.0', 
    updatedAt: '18.07.2026',
    coverUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800', 
    isFree: false, 
    isOffSale: false,
    platforms: ['web', 'win', 'mac'], 
    isHidden: false 
  },
  { 
    id: 7, 
    slug: 'void-architect',
    title: 'Void Architect: Sandbox', 
    developer: '@orbitalmind', 
    version: 'v0.9.8', 
    updatedAt: '12.07.2026',
    coverUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800', 
    isFree: false, 
    isOffSale: false,
    platforms: ['win', 'linux'], 
    isHidden: false 
  },
  { 
    id: 8, 
    slug: 'mecha-protocol',
    title: 'Mecha Protocol Zero', 
    developer: '@titan_works', 
    version: 'v2.3.0', 
    updatedAt: '05.07.2026',
    coverUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=800', 
    isFree: true, 
    isOffSale: false,
    platforms: ['win'], 
    isHidden: false 
  },
  { 
    id: 9, 
    slug: 'chronos-tactics',
    title: 'Chronos Tactics: Edge of Time', 
    developer: '@chronolab', 
    version: 'v1.0.8', 
    updatedAt: '01.07.2026',
    coverUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800', 
    isFree: true, 
    isOffSale: false,
    platforms: ['web', 'win'], 
    isHidden: false 
  },
  { 
    id: 10, 
    slug: 'neon-abyss-outrun',
    title: 'Neon Abyss: Outrun', 
    developer: '@vector_corp', 
    version: 'v1.4.0', 
    updatedAt: '25.06.2026',
    coverUrl: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?q=80&w=800', 
    isFree: false, 
    isOffSale: false,
    platforms: ['win', 'mac'], 
    isHidden: false 
  },
  { 
    id: 11, 
    slug: 'hollow-citadel',
    title: 'Hollow Citadel: Reborn', 
    developer: '@dark_castle', 
    version: 'v1.2.5', 
    updatedAt: '20.06.2026',
    coverUrl: 'https://images.unsplash.com/photo-1569705460033-cfaa4bf9f822?q=80&w=800', 
    isFree: false, 
    isOffSale: false,
    platforms: ['win'], 
    isHidden: false 
  },
  { 
    id: 12, 
    slug: 'iron-magic-arena',
    title: 'Iron & Magic: Siege Arena', 
    developer: '@runic_team', 
    version: 'v0.8.4', 
    updatedAt: '15.06.2026',
    coverUrl: 'https://images.unsplash.com/photo-1519638399535-1b036603ac77?q=80&w=800', 
    isFree: true, 
    isOffSale: false,
    platforms: ['web'], 
    isHidden: false 
  },
  { 
    id: 13, 
    slug: 'astro-protocol',
    title: 'Astro Protocol: Horizon', 
    developer: '@nebula_int', 
    version: 'v1.6.0', 
    updatedAt: '10.06.2026',
    coverUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800', 
    isFree: false, 
    isOffSale: false,
    platforms: ['win', 'linux'], 
    isHidden: false 
  },
  { 
    id: 14, 
    slug: 'retro-8bit',
    title: 'Retro 8-Bit Odyssey', 
    developer: '@pixel_master', 
    version: 'v1.0.0', 
    updatedAt: '01.06.2026',
    coverUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=800', 
    isFree: true, 
    isOffSale: false,
    platforms: ['web', 'win'], 
    isHidden: false 
  },
  { 
    id: 15, 
    slug: 'shadow-blade',
    title: 'Shadow Blade: Cyber Shinobi', 
    developer: '@shinobi_craft', 
    version: 'v2.1.0', 
    updatedAt: '15.05.2026',
    coverUrl: 'https://images.unsplash.com/photo-1552824722-ddab1374e622?q=80&w=800', 
    isFree: false, 
    isOffSale: false,
    platforms: ['win', 'mac'], 
    isHidden: true 
  },
  { 
    id: 16, 
    slug: 'galactic-assault',
    title: 'Galactic Assault: Star Wings', 
    developer: '@nova_games', 
    version: 'v1.0.3', 
    updatedAt: '10.05.2026',
    coverUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800', 
    isFree: false, 
    isOffSale: false,
    platforms: ['win'], 
    isHidden: true 
  },
];

export default function LibraryPage({ 
  onNavigate = (path: string) => {},
  authState = 'player',
  setAuthState = (val: string) => {}
}: {
  onNavigate?: (path: string) => void;
  authState?: string;
  setAuthState?: (val: string) => void;
}) {
  const { showToast } = useToast();
  const triggerToast = (text: string, type: any = 'info') => showToast(text, type === 'error' ? 'danger' : type);
  const [activeTab, setActiveTab] = useState<'games' | 'hidden'>('games');
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [sortOption, setSortOption] = useState('recent');
  const [userOS, setUserOS] = useState<'windows' | 'mac' | 'linux'>('windows');
  const [isBanned, setIsBanned] = useState(false);
  const [downloadsToday, setDownloadsToday] = useState(3);
  const [games, setGames] = useState<LibraryGame[]>(INITIAL_GAMES);

  // Deletion Modal State
  const [gameToDelete, setGameToDelete] = useState<LibraryGame | null>(null);

  const visibleGames = useMemo(() => games.filter(g => !g.isHidden), [games]);
  const hiddenGames = useMemo(() => games.filter(g => g.isHidden), [games]);

  const filteredGames = useMemo(() => {
    const currentList = activeTab === 'games' ? visibleGames : hiddenGames;
    return currentList.filter(g => {
      const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPlatform = platformFilter === 'all' || g.platforms.some(p => p.toLowerCase().includes(platformFilter));
      return matchesSearch && matchesPlatform;
    });
  }, [activeTab, visibleGames, hiddenGames, searchQuery, platformFilter]);

  const handleHideGame = (game: LibraryGame) => {
    setGames(prev => prev.map(g => g.id === game.id ? { ...g, isHidden: true } : g));
  };

  const handleRestoreGame = (game: LibraryGame) => {
    setGames(prev => prev.map(g => g.id === game.id ? { ...g, isHidden: false } : g));
  };

  const handleConfirmDelete = () => {
    if (!gameToDelete) return;
    setGames(prev => prev.filter(g => g.id !== gameToDelete.id));
    setGameToDelete(null);
  };

  const handleDownload = (game: LibraryGame, platform: string) => {
    if (downloadsToday >= 10) return;
    setDownloadsToday(prev => Math.min(10, prev + 1));
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8 pb-20 font-sans">
      
      

      {/* Banned User Alert Banner (BR-ACC-055, Section 6 of account.md, FE-MKT-006) */}
      {isBanned && (
        <div className="bg-danger/10 border border-danger/30 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-danger/20 rounded-full flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6 text-danger" />
          </div>
          <div className="text-center sm:text-left flex-1">
            <div className="flex items-center gap-2 mb-1 justify-center sm:justify-start">
              <h2 className="text-base font-bold text-danger tracking-tight">Ограниченный режим аккаунта (BR-ACC-055)</h2>
              <Badge variant="danger" size="sm" className="font-mono text-[10px]">Entitlement Retained</Badge>
            </div>
            <p className="text-xs text-textSecondary leading-relaxed">
              Доступ к платформе, покупкам и каталогу ограничен администрацией. В соответствии со стандартом защиты прав пользователей вы сохраняете полный доступ к запуску и скачиванию ранее приобретенных игр вашей Библиотеки. Финансовый раздел и новые покупки заблокированы.
            </p>
          </div>
        </div>
      )}

      {/* HEADER & TABS */}
      <header className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-3xl sm:text-4xl font-black text-textPrimary tracking-tight">БИБЛИОТЕКА ИГР</h1>
        </div>
        
        <Tabs 
          activeTab={activeTab} 
          onChange={(id) => setActiveTab(id as 'games' | 'hidden')}
          tabs={[
            { id: 'games', label: 'Мои игры в библиотеке', count: visibleGames.length },
            { id: 'hidden', label: 'Скрытые', count: hiddenGames.length }
          ]} 
        />
      </header>

      {/* TAB 1 & 2: GAMES & HIDDEN GRID */}
      {(activeTab === 'games' || activeTab === 'hidden') && (
        <div className="flex flex-col gap-6">
          
          {/* TOOLBAR */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="w-full sm:max-w-md">
              <SearchInput 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery('')}
                placeholder="Поиск по названию в библиотеке..."
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
              <CustomSelect 
                value={platformFilter}
                onChange={setPlatformFilter}
                icon={<Filter className="w-3.5 h-3.5 text-accent" />}
                className="w-full sm:w-[180px]"
                options={[
                  { value: 'all', label: 'Все платформы' },
                  { value: 'web', label: 'WebGL' },
                  { value: 'win', label: 'Windows' },
                  { value: 'mac', label: 'macOS' },
                  { value: 'lin', label: 'Linux' }
                ]}
              />
              
              <CustomSelect 
                value={sortOption}
                onChange={setSortOption}
                icon={<ArrowUpDown className="w-3.5 h-3.5 text-accent" />}
                className="w-full sm:w-[220px]"
                options={[
                  { value: 'recent', label: 'Недавно добавленные' },
                  { value: 'az', label: 'По алфавиту' }
                ]}
              />
            </div>
          </div>

          {/* GRID */}
          {filteredGames.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {filteredGames.map(game => (
                <LibraryGameCard 
                  key={game.id}
                  game={game}
                  userOS={userOS}
                  downloadsToday={downloadsToday}
                  isBanned={isBanned}
                  isCurrentTabHidden={activeTab === 'hidden'}
                  onPlay={(g) => {
                    alert(`Запуск WebGL игры: ${g.title}`);
                  }}
                  onDownload={(g, platform) => handleDownload(g, platform)}
                  onHide={(g) => handleHideGame(g)}
                  onRestore={(g) => handleRestoreGame(g)}
                  onRequestDeleteFree={(g) => setGameToDelete(g)}
                  onNavigate={(slug) => onNavigate(`/games/${slug}`)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-surface-1/40 rounded-3xl border border-dashed border-borderDef/50 text-center">
              <div className="w-16 h-16 bg-surface-2 rounded-2xl flex items-center justify-center mb-4 border border-borderDef/50 shadow-sm">
                <Gamepad2 className="w-8 h-8 text-textTertiary" />
              </div>
              <h3 className="text-xl font-bold text-textPrimary mb-2">
                {activeTab === 'games' ? 'В вашей библиотеке пока нет игр' : 'Нет скрытых игр'}
              </h3>
              <p className="text-sm text-textSecondary max-w-sm mb-6 leading-relaxed">
                {activeTab === 'games' 
                  ? 'Здесь будут появляться все приобретенные и бесплатно полученные игры.' 
                  : 'Скрытые из основного списка игры будут храниться здесь. Вы сможете вернуть их в любой момент.'}
              </p>
              {activeTab === 'games' && (
                <Button variant="primary" size="lg" onClick={() => onNavigate('/market')}>
                  Перейти в маркет
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* CONFIRMATION MODAL FOR DELETING FREE GAME */}
      <ConfirmActionModal 
        isOpen={Boolean(gameToDelete)}
        onClose={() => setGameToDelete(null)}
        title="Удалить игру из библиотеки?"
        description={`Вы действительно хотите удалить игру «${gameToDelete?.title}»? Вы сможете получить её снова в каталоге в любое время.`}
        confirmText="Удалить из библиотеки"
        cancelText="Отмена"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
      />
      {/* Dev Matrix Panel anchored at bottom */}
      <DevMatrixPanel
        pageName="Библиотека"
        fields={[
          {
            id: 'banned',
            label: 'Бан аккаунта',
            type: 'checkbox',
            value: isBanned,
            onChange: setIsBanned
          },
          {
            id: 'userOS',
            label: 'ОС пользователя',
            type: 'buttons',
            value: userOS,
            onChange: (val) => setUserOS(val),
            options: [
              { value: 'windows', label: 'Windows' },
              { value: 'mac', label: 'macOS' },
              { value: 'linux', label: 'Linux' }
            ]
          },
          {
            id: 'downloadsToday',
            label: 'Лимит скачиваний',
            type: 'buttons',
            value: String(downloadsToday),
            onChange: (val) => setDownloadsToday(Number(val)),
            options: [
              { value: '0', label: '0/10' },
              { value: '3', label: '3/10 (Норма)' },
              { value: '9', label: '9/10 (Почти)' },
              { value: '10', label: '10/10 (Исчерпан)' }
            ]
          }
        ]}
      />
    </div>
  );
}