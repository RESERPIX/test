import React, { useState, useEffect } from 'react';
import { PenTool, Filter, Sparkles, TrendingUp, Bell, ChevronDown, AlertTriangle } from 'lucide-react';
import { MOCK_DEVLOGS } from '../data/devlogMockData';
import DevLogCard from '../components/devlog/DevLogCard';
import Button from '../components/ui/Button';
import { DevLogType } from '../types/devlog';
import DevMatrixPanel, { DevMatrixField } from '../components/DevMatrixPanel';
import { useAuth } from '../contexts/AuthContext';

type TabType = 'fresh' | 'popular' | 'subscriptions';

export default function DevLogsHubPage({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const { isAuthenticated, openAuthModal } = useAuth();
  
  const [role, setRole] = useState<'guest'|'user'|'moderator'|'admin'>(isAuthenticated ? 'user' : 'guest');
  
  useEffect(() => {
    if (role === 'guest' && isAuthenticated) setRole('user');
    if (role !== 'guest' && !isAuthenticated) setRole('guest');
  }, [isAuthenticated]);
  const [hubState, setHubState] = useState<'standard'|'loading'|'empty'|'error'>('standard');
  const [activeTab, setActiveTab] = useState<TabType>('fresh');
  const [selectedType, setSelectedType] = useState<DevLogType | 'all'>('all');
  
  // Pagination & feed states (FE-DVL-001, AC-DVL-037..040)
  const [pageSize, setPageSize] = useState<number>(6);
  const [visibleCount, setVisibleCount] = useState<number>(6);

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [activeTab, selectedType, pageSize]);

  const devFields: DevMatrixField[] = [
    {
      id: 'role', label: 'Роль', type: 'buttons', value: role, onChange: setRole as any,
      options: [
        { value: 'guest', label: 'Гость' },
        { value: 'user', label: 'Юзер' },
        { value: 'moderator', label: 'Модер' },
        { value: 'admin', label: 'Админ' }
      ]
    },
    {
      id: 'hub_state', label: 'Состояние Хаба', type: 'buttons', value: hubState, onChange: setHubState as any,
      highlight: true,
      options: [
        { value: 'standard', label: 'Успешно' },
        { value: 'loading', label: 'Скелетоны' },
        { value: 'empty', label: 'Пусто (0)' },
        { value: 'error', label: 'Ошибка 500' }
      ]
    },
    {
      id: 'page_size', label: 'Порция пагинации (FE-DVL-001)', type: 'buttons', value: pageSize.toString(),
      onChange: (v: string) => setPageSize(Number(v)),
      options: [
        { value: '3', label: '3 поста' },
        { value: '6', label: '6 постов' },
        { value: '12', label: '12 постов' }
      ]
    }
  ];

  // Filter public posts
  const publicPosts = MOCK_DEVLOGS.filter(p => p.coreStatus === 'published');
  
  // Apply type filter
  const filteredPosts = selectedType === 'all' 
    ? publicPosts 
    : publicPosts.filter(p => p.type === selectedType);

  // Filter posts based on active tab (Subscriptions feed AC-DVL-039)
  let sourcePosts = filteredPosts;
  if (activeTab === 'subscriptions') {
    if (role === 'guest') {
      sourcePosts = [];
    } else {
      sourcePosts = filteredPosts.filter(p => p.publisherType === 'team' || (p.likesCount && p.likesCount > 10));
    }
  }

  // Sorting based on tab (Fresh / Popular)
  const displayPosts = [...sourcePosts].sort((a, b) => {
    if (activeTab === 'popular') return b.normalizedViews - a.normalizedViews;
    // Default fresh
    return new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime();
  });

  const paginatedPosts = displayPosts.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-surface-0 relative pb-32">
      <DevMatrixPanel fields={devFields} />
      
      <div className="max-w-[1200px] mx-auto px-4 py-16 animate-fadeIn">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-12">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-black text-textPrimary tracking-tight leading-tight mb-4">
            Дневники разработки
          </h1>
          <p className="text-lg text-textSecondary font-medium leading-relaxed">
            Отчеты о прогрессе, инсайды и поиск команды от независимых студий.
          </p>
        </div>
        
        <div className="shrink-0">
          <Button 
            variant="primary" 
            size="lg"
            icon={<PenTool className="w-4 h-4" />}
            onClick={() => onNavigate && onNavigate('/devlogs/new')} 
            className="h-12 px-6 font-bold text-[15px] shadow-lg shadow-accent/20"
          >
            Написать пост
          </Button>
        </div>
      </div>

      {/* CONTROLS (TABS & FILTERS) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12 bg-surface-1/50 p-2 md:p-3 rounded-2xl border border-borderDef/50">
        
        {/* Pill-shaped segmented control for Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full lg:w-auto">
          {[
            { id: 'fresh', label: 'Свежее', icon: Sparkles },
            { id: 'popular', label: 'Популярное', icon: TrendingUp },
            { id: 'subscriptions', label: 'Подписки', icon: Bell }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-body-sm font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-surface-0 text-textPrimary shadow-sm border border-borderDef' 
                  : 'text-textSecondary hover:text-textPrimary hover:bg-surface-2 bg-transparent border border-transparent'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-textPrimary' : 'text-textTertiary'}`} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Explicit Filter Select */}
        <div className="flex items-center gap-3 shrink-0 px-2 lg:px-0">
          <span className="text-caption font-extrabold text-textTertiary uppercase tracking-widest hidden md:block">
            Фильтр
          </span>
          <div className="relative">
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as DevLogType | 'all')}
              className="appearance-none w-full md:w-auto bg-surface-2 border border-borderDef hover:border-textTertiary focus:border-accent rounded-xl h-12 pl-4 pr-10 text-body-sm font-bold text-textPrimary outline-none cursor-pointer transition-colors"
            >
              <option value="all">Все записи</option>
              <option value="update">Обновления</option>
              <option value="looking_for_team">Поиск команды</option>
              <option value="need_feedback">Нужен фидбек</option>
              <option value="postmortem">Постмортемы</option>
              <option value="announcement">Анонсы</option>
            </select>
            <ChevronDown className="w-4 h-4 text-textTertiary absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* GRID */}
      {hubState === 'loading' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-surface-1 rounded-3xl h-[400px] animate-pulse border border-borderDef/30" />
          ))}
        </div>
      ) : hubState === 'error' ? (
        <div className="py-32 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center mb-6">
            <AlertTriangle className="w-8 h-8 text-danger" />
          </div>
          <h3 className="text-2xl font-black text-textPrimary mb-3">Ошибка загрузки</h3>
          <p className="text-textSecondary max-w-md mb-6">Не удалось получить данные с сервера. Пожалуйста, проверьте интернет-соединение.</p>
          <Button variant="primary" onClick={() => setHubState('standard')}>Повторить попытку</Button>
        </div>
      ) : activeTab === 'subscriptions' && role === 'guest' ? (
        <div className="py-32 flex flex-col items-center justify-center text-center bg-surface-1/30 rounded-3xl border border-borderDef/50 border-dashed">
          <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center mb-6 text-accent">
            <Bell className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-textPrimary mb-3">Лента ваших подписок</h3>
          <p className="text-textSecondary max-w-md mb-8">
            Войдите в аккаунт, чтобы видеть обновления от авторов и команд, на которых вы подписаны.
          </p>
          <Button variant="primary" onClick={() => openAuthModal('LOGIN')}>Войти в аккаунт</Button>
        </div>
      ) : hubState === 'empty' || displayPosts.length === 0 ? (
        <div className="py-32 flex flex-col items-center justify-center text-center bg-surface-1/30 rounded-3xl border border-borderDef/50 border-dashed">
          <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center mb-6">
            <PenTool className="w-8 h-8 text-textTertiary" />
          </div>
          <h3 className="text-2xl font-black text-textPrimary mb-3">Записей пока нет</h3>
          <p className="text-textSecondary max-w-md mb-8">Будьте первым, кто поделится своим прогрессом или инсайдами разработки.</p>
          <Button variant="primary" onClick={() => onNavigate && onNavigate('/devlogs/new')}>Написать девлог</Button>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
            {paginatedPosts.map(post => (
              <DevLogCard 
                key={post.id} 
                post={post} 
                onClick={() => onNavigate && onNavigate(`/devlogs/${post.slug}`)} 
              />
            ))}
          </div>

          {/* Pagination: Load More (FE-DVL-001) */}
          {visibleCount < displayPosts.length && (
            <div className="mt-12 flex flex-col items-center justify-center gap-3">
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => setVisibleCount(prev => prev + pageSize)}
                className="px-8 py-3.5 font-bold text-sm rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                Показать ещё ({displayPosts.length - visibleCount})
              </Button>
              <span className="text-xs font-mono text-textTertiary">
                Показано {paginatedPosts.length} из {displayPosts.length} записей
              </span>
            </div>
          )}
        </div>
      )}
    </div>
    </div>
  );
}
