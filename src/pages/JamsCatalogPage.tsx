import React, { useState, useEffect, useRef } from 'react';
import DevMatrixPanel from '../components/DevMatrixPanel';
import FontStyles from '../components/ui/FontStyles';
import Tabs from '../components/ui/Tabs';
import { CustomSelect } from '../components/ui/Select';
import { useToast } from '../components/ui/Toast';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import MediaBadge from '../components/ui/MediaBadge';
import Modal from '../components/ui/Modal';
import { SearchInput } from '../components/ui/Input';
import { 
  Flame, Trophy, Calendar, Clock, Users, Search, Plus, 
  ChevronDown, X, Info, CheckCircle2, AlertTriangle, AlertOctagon, 
  ArrowUpRight, Filter, Sparkles, Bell, Shield, ExternalLink, Play, Lock, Star, Award, Check, ArrowUpDown
} from 'lucide-react';

// --- ДАННЫЕ ДЖЕМОВ ---
const JAMS_MOCK_DATA = [
  {
    id: 'jam_01',
    title: 'Broken Worlds Jam',
    organizer: 'GW Staff',
    hashtag: 'brokenworlds',
    status: 'active',
    statusLabel: 'Идёт приём',
    statusVariant: 'accent',
    submitsCount: 1240,
    description: 'Создайте шедевр интерактивного искусства за 72 часа. Продемонстрируйте свои навыки дизайна и повествования в нелинейном игровом мире.',
    theme: 'Разрушенные миры',
    isThemeSecret: false,
    prize: '$10,000',
    prizeValue: 10000,
    timerLabel: 'Осталось времени',
    timerValue: '2д 14ч 42м',
    ctaLabel: 'ОТПРАВИТЬ ИГРУ',
    ctaPrimary: true,
    cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'jam_02',
    title: 'Pixel Horror Fest 2026',
    organizer: 'IndieHub',
    hashtag: 'pixelhorror2026',
    status: 'upcoming',
    statusLabel: 'Предстоящий',
    statusVariant: 'info',
    submitsCount: 456,
    description: 'Ежегодный джем для любителей ретро-хорроров. Создайте пугающую атмосферу в условиях жестких палитровых ограничений классических консолей.',
    theme: '[ 🔒 СКРЫТА ]',
    isThemeSecret: true,
    prize: '$2,000',
    prizeValue: 2000,
    timerLabel: 'До старта',
    timerValue: '5д 08ч 15м',
    ctaLabel: 'ПОДПИСАТЬСЯ',
    ctaPrimary: false,
    cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'jam_03',
    title: 'Mini Jam 145: Void',
    organizer: 'Mini Jams',
    hashtag: 'minijam145',
    status: 'voting',
    statusLabel: 'Голосование',
    statusVariant: 'warning',
    submitsCount: 890,
    description: 'Короткий джем на выходные. Тема "Пустота" бросает вызов вашему умению использовать негативное пространство и минималистичный аудиодизайн.',
    theme: 'Пустота',
    isThemeSecret: false,
    prize: 'Без рейтинга',
    prizeValue: 0,
    timerLabel: 'Конец голосования',
    timerValue: '14ч 30м',
    ctaLabel: 'ОЦЕНИВАТЬ РАБОТЫ',
    ctaPrimary: true,
    cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'jam_04',
    title: 'Cyberpunk Neon Jam',
    organizer: 'CyberCorp',
    hashtag: 'cyberneonjam',
    status: 'ended',
    statusLabel: 'Завершён',
    statusVariant: 'neutral',
    submitsCount: 2150,
    description: 'Крупнейшее событие весны. Неоновые огни, корпорации и аугментации. Итоги подведены, победители объявлены и получили гранты.',
    theme: 'Высокие технологии...',
    isThemeSecret: false,
    prize: '$5,000',
    prizeValue: 5000,
    timerLabel: 'Завершён',
    timerValue: '12 Июня 2026',
    ctaLabel: 'СМОТРЕТЬ ИТОГИ',
    ctaPrimary: false,
    cover: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'jam_05',
    title: '8-Bit Platformer Challenge',
    organizer: 'Retro Devs',
    hashtag: '8bitplatformer',
    status: 'ended',
    statusLabel: 'Завершён',
    statusVariant: 'neutral',
    submitsCount: 629,
    description: 'Возвращение к истокам. Участники создавали 8-битные платформеры со строгими правилами механики движения.',
    theme: 'Только прыжки',
    isThemeSecret: false,
    prize: 'Без рейтинга',
    prizeValue: 0,
    timerLabel: 'Дедлайн',
    timerValue: '28 Мая 2026',
    ctaLabel: 'СМОТРЕТЬ ИТОГИ',
    ctaPrimary: false,
    cover: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'jam_06',
    title: 'Cozy Autumn Jam',
    organizer: 'Wholesome Games',
    hashtag: 'cozyautumn',
    status: 'upcoming',
    statusLabel: 'Предстоящий',
    statusVariant: 'info',
    submitsCount: 128,
    description: 'Мероприятие без рейтинга. Создайте самую уютную, спокойную и расслабляющую атмосферную игру.',
    theme: '[ 🔒 СКРЫТА ]',
    isThemeSecret: true,
    prize: 'Без рейтинга',
    prizeValue: 0,
    timerLabel: 'До старта',
    timerValue: '45д 12ч 00м',
    ctaLabel: 'ПОДПИСАТЬСЯ',
    ctaPrimary: false,
    cover: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=600&auto=format&fit=crop'
  }
];

export default function App({ authState, setAuthState }: { authState?: string; setAuthState?: (val: string) => void }) {
  // --- STATE MATRIX ---
  const [localRole, setLocalRole] = useState('player');
  const role = authState || localRole;
  const setRole = (val: string) => {
    setLocalRole(val);
    if (setAuthState) setAuthState(val);
  };
  const [pageState, setPageState] = useState('standard');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [searchQuery, setSearchQuery] = useState('');

  // Модальные окна
  const [selectedJamModal, setSelectedJamModal] = useState(null);
  const [subscribedJams, setSubscribedJams] = useState({});

  // Поля формы создания джема - удалены
  // const [newJamTitle, setNewJamTitle] = useState('');
  // const [newJamPrize, setNewJamPrize] = useState('');
  // const [newJamTheme, setNewJamTheme] = useState('');

  // Toast
  const { showToast } = useToast();
  const triggerToast = (text: string, type: any = 'success') => {
    showToast(text, type === 'error' ? 'danger' : type);
  };

  const getFilteredJams = () => {
    return JAMS_MOCK_DATA.filter(jam => {
      const matchesSearch = jam.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            jam.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            jam.theme.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesStatus = true;
      if (statusFilter === 'active') matchesStatus = jam.status === 'active' || jam.status === 'voting';
      if (statusFilter === 'upcoming') matchesStatus = jam.status === 'upcoming';
      if (statusFilter === 'ended') matchesStatus = jam.status === 'ended';

      return matchesSearch && matchesStatus;
    }).sort((a, b) => {
      if (sortBy === 'prize') return b.prizeValue - a.prizeValue;
      if (sortBy === 'popularity') return b.submitsCount - a.submitsCount;
      return 0;
    });
  };

  const filteredJams = getFilteredJams();

  const navigateToJam = (jam) => {
    const targetPath = `/jams/${jam.slug || 'broken-worlds-jam'}`;
    if (window.__hubigrNavigate) {
      window.__hubigrNavigate(targetPath);
    } else {
      window.location.hash = `#${targetPath}`;
    }
  };

  const handleActionClick = (jam) => {
    if (jam.status === 'upcoming') {
      const isSub = !subscribedJams[jam.id];
      setSubscribedJams(prev => ({ ...prev, [jam.id]: isSub }));
      triggerToast(isSub ? `Вы подписались на анонс «${jam.title}»` : `Подписка на «${jam.title}» отменена`);
    } else {
      navigateToJam(jam);
    }
  };

  return (
    <div className="min-h-screen bg-surface-0 text-textPrimary font-sans pb-24 select-none relative overflow-x-hidden">
      <FontStyles />

      {/* DEV MATRIX CONTROL PANEL */}
      <DevMatrixPanel 
        pageName="Каталог джемов"
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
              { value: 'organizer', label: 'Organizer (Организатор)' },
              { value: 'admin', label: 'Admin (Модерация)' }
            ]
          },
          {
            id: 'pageState',
            label: 'Состояние UI',
            type: 'select',
            value: pageState,
            onChange: setPageState,
            highlight: true,
            options: [
              { value: 'standard', label: '1. Standard (Заполнено)' },
              { value: 'loading', label: '2. Loading (Скелетоны)' },
              { value: 'empty', label: '3. Empty (Пустой результат)' },
              { value: 'error', label: '4. Error (Ошибка соединения)' }
            ]
          }
        ]}
      />

      {/* --- ГЛАВНЫЙ СЕТЧАТЫЙ КОНТЕЙНЕР --- */}
      <main className="max-w-[1440px] mx-auto px-4 md:px-8 pt-4 sm:pt-6 pb-20 md:pb-8">

        {/* --- HERO СЕКЦИЯ --- */}
        <div className="relative mb-8 sm:mb-12 overflow-hidden rounded-[20px] border border-borderDef">
          {/* Фоновое изображение */}
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2000&auto=format&fit=crop"
              alt="Jams Hero"
              className="w-full h-full object-cover opacity-20"
            />
          </div>
          
          {/* Градиенты и эффекты */}
          <div className="absolute inset-0 bg-gradient-to-r from-surface-0 via-surface-0/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface-0" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] text-borderDef bg-[size:4rem_4rem] opacity-30" />
          
          {/* Контент Hero */}
          <div className="relative z-10 px-5 sm:px-8 md:px-12 py-6 sm:py-12 md:py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8">
            
            {/* Левая часть: Текст */}
            <div className="flex flex-col gap-3 sm:gap-4 max-w-[620px]">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center">
                  <Trophy className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-accent" />
                </div>
                <span className="text-xs sm:text-overline font-mono font-bold text-accent">Game Jams</span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl md:text-display font-bold text-textPrimary leading-tight">
                Создавайте игры <br className="hidden sm:inline" />
                и соревнуйтесь с лучшими
              </h1>
              
              <p className="hidden sm:block text-xs sm:text-sm md:text-body text-textSecondary max-w-3xl font-sans leading-relaxed">
                Участвуйте в джемах, демонстрируйте свои навыки, получайте призы и находите единомышленников для совместных проектов.
              </p>
              
              {/* Список преимуществ */}
              <div className="hidden sm:flex flex-col gap-2 pt-1 sm:pt-2">
                <div className="flex items-center gap-2 text-xs sm:text-body-sm text-textSecondary">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-accent" />
                  </div>
                  <span>Бесплатное участие в соревнованиях</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-body-sm text-textSecondary">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-accent" />
                  </div>
                  <span>Призы и награды для победителей</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-body-sm text-textSecondary">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-accent" />
                  </div>
                  <span>Поиск команды и нетворкинг</span>
                </div>
              </div>
            </div>

            {/* Правая часть: CTA кнопка */}
            <div className="flex flex-col gap-2.5 shrink-0 w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                icon={<Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-base" />}
                onClick={() => {
                  if ((window as any).__hubigrNavigate) {
                    (window as any).__hubigrNavigate('/jams/create');
                  } else {
                    window.location.hash = '#/jams/create';
                  }
                }}
                className="group w-full sm:w-auto"
              >
                Организовать джем
              </Button>
              
              <span className="hidden sm:inline-block text-xs text-textTertiary text-center font-mono">
                Создайте своё соревнование
              </span>
            </div>

          </div>
        </div>

        {/* --- 2. ЗАГОЛОВОК КАТАЛОГА И ГЛОБАЛЬНЫЙ ПОИСК --- */}
        <div className="mb-6 select-none pt-2 sm:pt-4">
          <h1 className="text-2xl sm:text-3xl md:text-heading-1 font-bold text-textPrimary tracking-tight font-sans">
            Каталог джемов
          </h1>
          <p className="text-sm sm:text-body text-textSecondary mt-1.5 sm:mt-2 max-w-3xl font-sans leading-relaxed">
            Участвуйте в глобальных соревнованиях, создавайте игры с нуля и находите единомышленников в команды.
          </p>

          <div className="relative w-full mt-4 flex flex-col gap-4">
            <SearchInput
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              placeholder="Поиск по названию джема, организатору или теме..."
            />
          </div>
        </div>

        {/* --- 3. ТАБЫ КАТЕГОРИЙ --- */}
        <div className="mb-6 sm:mb-8 relative -mx-4 px-4 sm:mx-0 sm:px-0">
          <Tabs
            tabs={[
              { id: 'all', label: 'Все джемы' },
              { id: 'upcoming', label: 'Предстоящие' },
              { id: 'active', label: 'Активные' },
              { id: 'ended', label: 'Завершённые' }
            ]}
            activeTab={statusFilter}
            onChange={setStatusFilter}
          />
        </div>

        {/* --- 4. ПАНЕЛЬ СОРТИРОВКИ И СЧЁТЧИКА --- */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 mb-4">
          <span className="text-[13px] text-textTertiary font-medium tracking-tight">
            Найдено: <span className="text-textPrimary font-semibold">{filteredJams.length}</span>
          </span>
          <div className="flex items-center gap-3 shrink-0">
            <CustomSelect
              value={sortBy}
              onChange={setSortBy}
              options={[
                { value: 'date', label: 'Хронология' },
                { value: 'prize', label: 'Призовой фонд' },
                { value: 'popularity', label: 'Популярность' }
              ]}
              icon={<ArrowUpDown className="w-3.5 h-3.5 text-accent" />}
              className="sm:w-[220px]"
            />
          </div>
        </div>

        {/* --- 4. СЕТКА КАРТОЧЕК ДЖЕМОВ (3 В РЯД) --- */}
        <section>
          {pageState === 'loading' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 animate-pulse">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-surface-1 border border-surface-3 rounded-card h-[420px] p-6 flex flex-col gap-4">
                  <div className="w-full aspect-[16/9] bg-surface-2 rounded-card" />
                  <div className="h-4 w-1/2 bg-surface-2 rounded" />
                  <div className="h-6 w-3/4 bg-surface-2 rounded" />
                  <div className="mt-auto h-11 w-full bg-surface-2 rounded-control" />
                </div>
              ))}
            </div>
          )}

          {(pageState === 'empty' || (pageState === 'standard' && filteredJams.length === 0)) && (
            <div className="w-full bg-surface-1 border border-dashed border-surface-4 rounded-card p-16 text-center flex flex-col items-center gap-4 animate-fadeIn">
              <Search className="w-8 h-8 text-textTertiary" />
              <h4 className="text-sm font-bold text-textPrimary uppercase font-mono">Соревнования не найдены</h4>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => { setSearchQuery(''); setStatusFilter('all'); setPageState('standard'); }}
                className="text-accent font-mono font-bold uppercase"
              >
                Сбросить фильтры
              </Button>
            </div>
          )}

          {pageState === 'error' && (
            <div className="w-full bg-surface-1 border border-danger/40 rounded-card p-16 text-center flex flex-col items-center gap-4 animate-fadeIn">
              <AlertOctagon className="w-8 h-8 text-danger" />
              <h4 className="text-sm font-bold text-textPrimary uppercase font-mono">Ошибка соединения с сервером</h4>
              <p className="text-xs text-textTertiary max-w-[400px]">Не удалось загрузить каталог джемов. Проверьте соединение с сетью.</p>
              <Button 
                variant="primary" 
                size="md" 
                onClick={() => setPageState('standard')}
              >
                Повторить попытку
              </Button>
            </div>
          )}

          {pageState === 'standard' && filteredJams.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {filteredJams.map(jam => (
                <div 
                  key={jam.id} 
                  onClick={() => navigateToJam(jam)}
                  className="bg-surface-1 border border-transparent hover:border-accent/40 rounded-card overflow-hidden flex flex-col justify-between group transition-all duration-base shadow-elevation-raised hover:shadow-elevation-overlay cursor-pointer focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0"
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigateToJam(jam);
                    }
                  }}
                >
                  <div>
                    {/* ОБЛОЖКА КАРТОЧКИ */}
                    <div 
                      className="w-full aspect-[16/9] bg-surface-2 relative overflow-hidden"
                    >
                      <img src={jam.cover} alt={jam.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80" />
                      
                      {/* Слева: Статус-бейдж */}
                      <div className="absolute top-3.5 left-3.5">
                        <MediaBadge variant={jam.statusVariant as any} size="default">
                          {jam.statusLabel}
                        </MediaBadge>
                      </div>

                      {/* Справа: Плашка участников */}
                      <span className="absolute top-3.5 right-3.5 bg-black/70 border border-white/10 text-textPrimary text-xs font-mono font-bold px-2.5 py-1 rounded-control flex items-center gap-1.5 backdrop-blur-md shadow-md">
                        <Users className="w-3.5 h-3.5 text-accent" /> {jam.submitsCount}
                      </span>
                    </div>

                    {/* ТЕЛО КАРТОЧКИ */}
                    <div className="p-5 sm:p-6 flex flex-col gap-3.5">
                      <h3 className="text-xl font-extrabold text-textPrimary group-hover:text-accent transition-colors leading-snug font-sans tracking-tight">
                        {jam.title}
                      </h3>

                      <div className="text-xs font-mono text-textTertiary">
                        Org: <span className="text-textSecondary font-semibold">{jam.organizer}</span>
                      </div>

                      <p className="text-sm text-textSecondary line-clamp-3 leading-relaxed font-sans">
                        {jam.description}
                      </p>

                      {/* ТАБЛИЦА ПАРАМЕТРОВ */}
                      <div className="flex flex-col gap-2.5 pt-4 border-t border-surface-3 text-xs mt-1">
                        
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-textSecondary font-sans font-medium shrink-0">Тема</span>
                          <span className={jam.isThemeSecret ? "font-mono text-textSecondary font-bold" : "font-mono text-accent font-bold text-right line-clamp-2 max-w-[180px] leading-tight"}>
                            {jam.theme}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-textSecondary font-sans font-medium">Призовой фонд</span>
                          <span className="font-mono text-success font-bold text-sm">{jam.prize}</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-textSecondary font-sans font-medium">{jam.timerLabel}</span>
                          <span className={jam.status === 'active' ? "font-mono text-accent font-bold" : "font-mono text-textPrimary font-bold"}>
                            {jam.timerValue}
                          </span>
                        </div>

                      </div>
                    </div>
                  </div>

                  {/* ФУТЕР КАРТОЧКИ */}
                  <div className="p-5 pt-0 sm:p-6 sm:pt-0">
                    <Button 
                      variant={jam.ctaPrimary ? 'primary' : 'secondary'}
                      size="lg"
                      fullWidth
                      onClick={(e) => {
                        e.stopPropagation();
                        handleActionClick(jam);
                      }}
                    >
                      {subscribedJams[jam.id] && jam.status === 'upcoming' ? 'ПОДПИСКА АКТИВНА ✓' : jam.ctaLabel}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>

      {/* ================= MODAL: ДЕТАЛИ ДЖЕМА ================= */}
      <Modal
        isOpen={!!selectedJamModal}
        onClose={() => setSelectedJamModal(null)}
        title={selectedJamModal?.title || ''}
        icon={<Trophy className="w-4 h-4 text-accent" />}
        maxWidth="lg"
      >
        {selectedJamModal && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <Badge variant={selectedJamModal.statusVariant as any}>
                {selectedJamModal.statusLabel}
              </Badge>
              <span className="font-mono text-xs text-textSecondary">
                Призовой фонд: <strong className="text-success text-sm">{selectedJamModal.prize}</strong>
              </span>
            </div>

            <div>
              <div className="font-mono text-xs text-textSecondary mb-1">
                Opr: {selectedJamModal.organizer} • #{selectedJamModal.hashtag}
              </div>
            </div>

            <div className="p-4 bg-surface-0 border border-surface-3 rounded-card flex flex-col gap-1.5">
              <span className="text-xs font-mono uppercase text-textSecondary">Тема джема:</span>
              <span className="text-sm font-bold text-accent font-mono">{selectedJamModal.theme}</span>
            </div>

            <p className="text-sm text-textSecondary leading-relaxed font-sans">
              {selectedJamModal.description}
            </p>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono text-textSecondary border-t border-surface-3 pt-4">
              <div>{selectedJamModal.timerLabel}: <span className="text-textPrimary block mt-1 font-bold">{selectedJamModal.timerValue}</span></div>
              <div>Всего сабмитов: <span className="text-textPrimary block mt-1 font-bold">{selectedJamModal.submitsCount}</span></div>
            </div>

            <Button 
              variant="secondary"
              size="lg"
              fullWidth
              onClick={() => setSelectedJamModal(null)}
            >
              Закрыть
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}