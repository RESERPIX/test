import React, { useState, useEffect, useMemo } from 'react';
import { 
  MessageSquare, Plus, Search, HelpCircle, Lightbulb, PenTool, 
  Code, Music, Eye, Heart, MessageSquareOff, Trophy, Bell,
  CheckCircle, Lock, Shield, ChevronRight, Sparkles, Pin, Inbox, Gamepad2
} from 'lucide-react';
import { MOCK_COMMUNITY_CATEGORIES, getStoredCommunityThreads, isThreadFollowed } from '../data/communityMockData';
import { CommunityThreadType, CommunityThread } from '../types/community';
import Button from '../components/ui/Button';
import DevMatrixPanel, { DevMatrixField } from '../components/DevMatrixPanel';
import { useAuth } from '../contexts/AuthContext';

// Helper for relative timestamps
function formatRelativeTime(dateIso: string) {
  try {
    const diffMs = Date.now() - new Date(dateIso).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 1) return 'только что';
    if (diffMins < 60) return `${diffMins} мин назад`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} ч назад`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} дн назад`;
    return new Date(dateIso).toLocaleDateString('ru-RU');
  } catch {
    return 'недавно';
  }
}

// Utility to render correct type badge
const TypeBadge = ({ thread }: { thread: CommunityThread }) => {
  switch (thread.type) {
    case 'looking_for_team':
      return (
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="bg-accent/20 text-accent text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest">
            Ищу команду
          </span>
          {thread.lookingForTeamDetails?.searchState === 'closed' && (
            <span className="bg-surface-2 text-textTertiary text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider border border-borderDef/60">
              Поиск закрыт
            </span>
          )}
        </div>
      );
    case 'need_feedback':
      return (
        <span className="bg-info/20 text-info text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest">
          Нужен фидбек
        </span>
      );
    case 'show_progress':
      return (
        <span className="bg-celebratory/20 text-celebratory text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest">
          Прогресс
        </span>
      );
    case 'share_reference':
      return (
        <span className="bg-textSecondary/20 text-textSecondary text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest">
          Источник
        </span>
      );
    default:
      return null;
  }
};

export default function CommunityPage({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const { isAuthenticated, openAuthModal } = useAuth();

  // DEV MATRIX & Access State
  const [authRole, setAuthRole] = useState<'guest'|'user'|'admin'>(isAuthenticated ? 'user' : 'guest');
  const [canWrite, setCanWrite] = useState<boolean>(true);

  useEffect(() => {
    if (isAuthenticated && authRole === 'guest') setAuthRole('user');
    if (!isAuthenticated && authRole !== 'guest') setAuthRole('guest');
  }, [isAuthenticated]);

  const devFields: DevMatrixField[] = [
    {
      id: 'auth', label: 'Auth Role', type: 'select', value: authRole, onChange: setAuthRole as any,
      options: [
        { value: 'guest', label: 'Гость' },
        { value: 'user', label: 'Пользователь' },
        { value: 'admin', label: 'Админ' },
      ]
    },
    {
      id: 'write_access', label: 'Право писать (community_write)', type: 'select', value: canWrite ? 'true' : 'false', 
      onChange: (v) => setCanWrite(v === 'true'),
      options: [
        { value: 'true', label: 'Разрешено' },
        { value: 'false', label: 'Ограничено (Ban)' }
      ],
      highlight: !canWrite
    }
  ];

  const [threads, setThreads] = useState<CommunityThread[]>([]);
  
  useEffect(() => {
    setThreads(getStoredCommunityThreads());
  }, []);

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeSort, setActiveSort] = useState<'fresh' | 'popular' | 'unanswered' | 'solved'>('fresh');
  const [activeType, setActiveType] = useState<CommunityThreadType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Full-text search and filtering (BR-COM-040, FR-COM-009, SC-COM-035)
  const filteredThreads = useMemo(() => {
    return threads.filter(t => {
      // Hide blocked/hidden from non-admins (BR-COM-084, FR-COM-081)
      if (authRole !== 'admin' && t.visibilityState !== 'published') {
        return false;
      }
      if (t.deletedAt) {
        return false;
      }
      
      if (activeCategory !== 'all' && t.categoryId !== activeCategory) return false;
      if (activeType !== 'all' && t.type !== activeType) return false;
      if (activeSort === 'unanswered' && t.repliesCount > 0) return false;
      if (activeSort === 'solved' && !t.isSolved) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = t.title?.toLowerCase().includes(q);
        const matchBody = t.bodyMarkdown?.toLowerCase().includes(q);
        const matchTags = t.tags?.some(tag => tag.toLowerCase().includes(q));
        const matchAuthor = t.authorNick?.toLowerCase().includes(q);
        const matchGame = t.linkedGameName?.toLowerCase().includes(q);
        const matchJam = t.linkedJamName?.toLowerCase().includes(q);
        if (!matchTitle && !matchBody && !matchTags && !matchAuthor && !matchGame && !matchJam) {
          return false;
        }
      }
      return true;
    });
  }, [threads, authRole, activeCategory, activeType, activeSort, searchQuery]);

  // Sorting with pinned priority (BR-COM-038, BR-COM-039, FR-COM-008, BR-COM-069)
  const sortedThreads = useMemo(() => {
    return [...filteredThreads].sort((a, b) => {
      // Pinned threads always go first (BR-COM-069, FR-COM-071)
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      // Popular ranking calculation: normalizedViews + likes * 5 + replies * 3 (BR-COM-041)
      if (activeSort === 'popular') {
        const scoreA = (a.normalizedViews || 0) + (a.likesCount || 0) * 5 + (a.repliesCount || 0) * 3;
        const scoreB = (b.normalizedViews || 0) + (b.likesCount || 0) * 5 + (b.repliesCount || 0) * 3;
        if (scoreB !== scoreA) return scoreB - scoreA;
      }

      // Default fresh/unanswered/solved: created_at DESC
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [filteredThreads, activeSort]);

  const followedCount = threads.filter(t => isThreadFollowed(t.id) && t.visibilityState === 'published' && !t.deletedAt).length;

  const handleCreateClick = () => {
    if (authRole === 'guest') {
      openAuthModal('LOGIN');
      return;
    }
    if (!canWrite) {
      alert('Создание тем и комментариев временно ограничено модерацией');
      return;
    }
    if (onNavigate) onNavigate('/community/new');
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 animate-fadeIn">
      
      {/* 3-Column Layout (Section 2) */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* LEFT SIDEBAR (240px) */}
        <div className="w-full lg:w-[240px] shrink-0 space-y-10">
          <Button 
            variant="primary" 
            fullWidth 
            size="lg"
            icon={<Plus className="w-5 h-5" />} 
            onClick={handleCreateClick}
            disabled={!canWrite}
            title={!canWrite ? 'Создание тем и комментариев временно ограничено модерацией' : undefined}
            className="shadow-[0_0_20px_rgba(124,58,237,0.2)] hover:shadow-[0_0_25px_rgba(124,58,237,0.4)] transition-shadow cursor-pointer"
          >
            Новая тема
          </Button>
          
          {/* Categories Nav (BR-COM-007, BR-COM-008) */}
          <nav className="space-y-1.5">
            <h3 className="text-[11px] font-extrabold text-textTertiary uppercase tracking-widest mb-4">Категории</h3>
            
            <button 
              onClick={() => setActiveCategory('all')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                activeCategory === 'all' 
                  ? 'text-accent bg-accent/10' 
                  : 'text-textSecondary hover:text-textPrimary hover:bg-surface-2'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Все категории
            </button>
            
            {MOCK_COMMUNITY_CATEGORIES.map(cat => {
              const Icon = getCategoryIcon(cat.slug);
              const isActive = activeCategory === cat.id;
              return (
                <button 
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                    isActive 
                      ? 'text-accent bg-accent/10' 
                      : 'text-textSecondary hover:text-textPrimary hover:bg-surface-2'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.name}
                </button>
              );
            })}
          </nav>
          
          <nav className="space-y-1.5 pt-6 border-t border-borderDef/30">
            <h3 className="text-[11px] font-extrabold text-textTertiary uppercase tracking-widest mb-4">Навигация</h3>
            <button 
              onClick={() => onNavigate && onNavigate('/me/community/subscriptions')} 
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-textSecondary hover:text-textPrimary hover:bg-surface-2 transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              Мои подписки
              {followedCount > 0 && (
                <span className="ml-auto bg-accent/20 text-accent text-[10px] font-bold px-2 py-0.5 rounded-full">{followedCount}</span>
              )}
            </button>
          </nav>
        </div>

        {/* CENTER FEED */}
        <div className="flex-1 min-w-0 flex flex-col">
          
          {/* Search & Sort */}
          <div className="mb-6 space-y-6">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textTertiary group-focus-within:text-accent transition-colors" />
              <input 
                type="text" 
                placeholder="Поиск по темам, авторам, тегам, играм..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full h-12 bg-surface-1/40 hover:bg-surface-2 focus:bg-surface-1 border-b-2 border-transparent focus:border-accent transition-colors pl-12 pr-4 text-base font-medium outline-none rounded-t-xl text-textPrimary placeholder:text-textTertiary"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-textTertiary hover:text-textPrimary cursor-pointer"
                >
                  Очистить
                </button>
              )}
            </div>
            
            <div className="flex flex-col gap-5 border-b border-borderDef/40 pb-5">
              {/* Sort Tabs (BR-COM-038, BR-COM-039, FR-COM-008) */}
              <div className="flex items-center gap-8 overflow-x-auto no-scrollbar w-full">
                {([
                  { id: 'fresh', label: 'Свежие' },
                  { id: 'popular', label: 'Популярные' },
                  { id: 'unanswered', label: 'Без ответа' },
                  { id: 'solved', label: 'Решённые' }
                ] as const).map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveSort(tab.id)}
                    className={`whitespace-nowrap pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                      activeSort === tab.id 
                        ? 'border-textPrimary text-textPrimary' 
                        : 'border-transparent text-textTertiary hover:text-textSecondary hover:border-textTertiary/30'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              
              {/* Type Filters (BR-COM-009, BR-COM-010) */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                <span className="text-[11px] font-extrabold text-textTertiary uppercase tracking-widest mr-2 shrink-0">Тип:</span>
                {([
                  { id: 'all', label: 'Все' },
                  { id: 'looking_for_team', label: 'Поиск команды' },
                  { id: 'need_feedback', label: 'Нужен фидбек' },
                  { id: 'show_progress', label: 'Прогресс' },
                  { id: 'share_reference', label: 'Источники' }
                ] as const).map(type => (
                  <button
                    key={type.id}
                    onClick={() => setActiveType(type.id as CommunityThreadType | 'all')}
                    className={`whitespace-nowrap px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ring-1 cursor-pointer ${
                      activeType === type.id 
                        ? 'bg-textPrimary text-surface-0 ring-textPrimary shadow-sm' 
                        : 'bg-surface-1 text-textSecondary hover:text-textPrimary hover:bg-surface-2 ring-borderDef/50 hover:ring-borderDef'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Threads Feed */}
          <div className="flex flex-col">
            {sortedThreads.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-center gap-4 bg-surface-1/20 border border-borderDef/30 rounded-2xl p-8">
                <MessageSquareOff className="w-12 h-12 text-textTertiary opacity-50" />
                <div>
                  <h3 className="text-lg font-bold text-textPrimary mb-1">В этой категории пока нет тем</h3>
                  <p className="text-sm text-textSecondary max-w-md">Будьте первым, кто начнет обсуждение!</p>
                </div>
                {canWrite && authRole !== 'guest' ? (
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => onNavigate && onNavigate('/community/new')}
                    icon={<Plus className="w-4 h-4" />}
                    className="mt-2 cursor-pointer"
                  >
                    Создать тему
                  </Button>
                ) : authRole === 'guest' ? (
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => openAuthModal('LOGIN')}
                    className="mt-2 cursor-pointer"
                  >
                    Войти и создать тему
                  </Button>
                ) : null}
              </div>
            ) : (
              sortedThreads.map((thread, index) => {
                const categoryName = MOCK_COMMUNITY_CATEGORIES.find(c => c.id === thread.categoryId)?.name || 'Общее';
                const authorDisplay = thread.authorNick || 'Пользователь';

                return (
                  <div 
                    key={thread.id} 
                    onClick={() => onNavigate && onNavigate(`/community/thread/${thread.id}`)}
                    className={`group py-4 cursor-pointer transition-colors hover:bg-surface-1/40 px-3 -mx-3 rounded-xl flex items-start gap-4 ${
                      index !== sortedThreads.length - 1 ? 'border-b border-borderDef/50' : ''
                    }`}
                  >
                    {/* Left: Avatar Column */}
                    <div className="w-10 shrink-0 flex flex-col items-center mt-1">
                      <img 
                        src={thread.authorAvatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${thread.authorNick || thread.authorId}`} 
                        alt={authorDisplay} 
                        className="w-8 h-8 rounded-full bg-surface-2 ring-2 ring-surface-0 group-hover:ring-surface-1 transition-all object-cover" 
                      />
                    </div>

                    {/* Center: Content */}
                    <div className="flex-1 min-w-0">
                      {/* Meta Line: Author, Category, Time, System Badges */}
                      <div className="flex items-center gap-1.5 mb-1.5 flex-wrap text-xs">
                        <span 
                          className="font-bold text-textSecondary group-hover:text-textPrimary transition-colors hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onNavigate) onNavigate(`/users/${thread.authorNick || thread.authorId}`);
                          }}
                        >
                          @{authorDisplay}
                        </span>
                        <span className="text-textTertiary text-[10px]">в</span>
                        <span 
                          className="font-bold text-textPrimary hover:underline cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveCategory(thread.categoryId);
                          }}
                        >
                          {categoryName}
                        </span>
                        <span className="text-textTertiary text-[10px] mx-0.5">•</span>
                        <span className="text-textTertiary">{formatRelativeTime(thread.createdAt)}</span>
                        
                        {/* System Badges (Row 1, Section 4) */}
                        <div className="flex items-center gap-1.5 ml-2 flex-wrap">
                          {thread.isOfficial && (
                            <span className="bg-reaction/10 text-reaction text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" /> Официально
                            </span>
                          )}
                          {thread.isPinned && (
                            <span className="bg-info/10 text-info text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                              <Pin className="w-2.5 h-2.5" /> Закреплено
                            </span>
                          )}
                          {thread.isSolved && (
                            <span className="bg-success/10 text-success text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                              <CheckCircle className="w-2.5 h-2.5" /> Решено
                            </span>
                          )}
                          {thread.discussionState === 'locked' && (
                            <span className="bg-warning/10 text-warning text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5" /> Заморожено
                            </span>
                          )}
                          {thread.discussionState === 'archived' && (
                            <span className="bg-surface-2 text-textTertiary text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                              <Inbox className="w-2.5 h-2.5" /> Закрыто
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-[15px] sm:text-base font-bold text-textPrimary leading-snug group-hover:text-accent transition-colors mb-2 pr-4 line-clamp-2">
                        {thread.title}
                      </h3>

                      {/* Bottom Context: Type Badge, Linked Entities, Tags */}
                      <div className="flex flex-wrap items-center gap-3">
                        <TypeBadge thread={thread} />
                        
                        {thread.linkedGameName && (
                          <div 
                            className="flex items-center gap-1.5 text-[11px] font-medium text-textSecondary bg-surface-2/60 px-2 py-0.5 rounded-md hover:text-textPrimary transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onNavigate && thread.linkedGameSlug) onNavigate(`/games/${thread.linkedGameSlug}`);
                            }}
                          >
                            <Gamepad2 className="w-3 h-3 text-accent" />
                            <span>{thread.linkedGameName}</span>
                          </div>
                        )}

                        {thread.linkedJamName && (
                          <div 
                            className="flex items-center gap-1.5 text-[11px] font-medium text-textSecondary bg-surface-2/60 px-2 py-0.5 rounded-md hover:text-textPrimary transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onNavigate && thread.linkedJamSlug) onNavigate(`/jams/${thread.linkedJamSlug}`);
                            }}
                          >
                            <Trophy className="w-3 h-3 text-warning" />
                            <span>{thread.linkedJamName}</span>
                          </div>
                        )}
                        
                        {thread.tags && thread.tags.length > 0 && (
                          <div className="flex items-center gap-1.5 text-[11px] font-mono text-textTertiary ml-auto sm:ml-2">
                            {thread.tags.slice(0, 3).map(tag => (
                              <span 
                                key={tag} 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSearchQuery(tag);
                                }}
                                className="hover:text-textSecondary hover:underline transition-colors cursor-pointer"
                              >
                                #{tag}
                              </span>
                            ))}
                            {thread.tags.length > 3 && <span>+{thread.tags.length - 3}</span>}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Activity Stats Column (Section 4: Views 👁, Replies 💬, Likes ❤️) */}
                    <div className="shrink-0 hidden sm:flex items-center gap-4 text-xs font-bold text-textTertiary mt-1">
                      <div className="flex items-center gap-1.5 group-hover:text-textPrimary transition-colors w-12 justify-end" title="Просмотры">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{(thread.normalizedViews || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1.5 group-hover:text-textPrimary transition-colors w-10 justify-end" title="Ответы">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{thread.repliesCount || 0}</span>
                      </div>
                      <div className="flex items-center gap-1.5 group-hover:text-textPrimary transition-colors w-10 justify-end" title="Лайки">
                        <Heart className="w-3.5 h-3.5" />
                        <span>{thread.likesCount || 0}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            
            {/* Pagination Controls */}
            {sortedThreads.length > 0 && (
              <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-borderDef/30">
                <button className="px-3 py-1 rounded-md text-sm font-medium text-textSecondary hover:text-textPrimary hover:bg-surface-2 disabled:opacity-50 cursor-pointer" disabled>
                  Назад
                </button>
                <div className="flex items-center gap-1">
                  <button className="w-8 h-8 flex items-center justify-center rounded-md text-sm font-bold bg-accent text-white">1</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-md text-sm font-bold text-textSecondary hover:bg-surface-2 hover:text-textPrimary transition-colors cursor-pointer">2</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-md text-sm font-bold text-textSecondary hover:bg-surface-2 hover:text-textPrimary transition-colors cursor-pointer">3</button>
                  <span className="text-textTertiary px-1">...</span>
                  <button className="w-8 h-8 flex items-center justify-center rounded-md text-sm font-bold text-textSecondary hover:bg-surface-2 hover:text-textPrimary transition-colors cursor-pointer">12</button>
                </div>
                <button className="px-3 py-1 rounded-md text-sm font-medium text-textSecondary hover:text-textPrimary hover:bg-surface-2 transition-colors cursor-pointer">
                  Вперёд
                </button>
              </div>
            )}
          </div>
          
        </div>

        {/* RIGHT SIDEBAR (240px) */}
        <div className="hidden lg:block w-[240px] shrink-0 space-y-8">
          
          {/* Rules Widget */}
          <div className="bg-surface-1/30 rounded-2xl p-5 border border-borderDef/30 space-y-4 group hover:bg-surface-1/50 transition-colors">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-6 h-6 rounded-md bg-surface-2 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                <Shield className="w-3.5 h-3.5 text-textTertiary group-hover:text-accent transition-colors" />
              </div>
              <h4 className="text-[11px] font-extrabold text-textPrimary uppercase tracking-widest">Правила</h4>
            </div>
            
            <div className="space-y-3.5">
              <div className="flex items-start gap-3">
                <div className="text-[10px] font-extrabold text-textTertiary bg-surface-2 w-4 h-4 rounded flex items-center justify-center shrink-0 mt-0.5 group-hover:text-textSecondary transition-colors">1</div>
                <p className="text-xs text-textSecondary leading-snug group-hover:text-textPrimary transition-colors">Взаимоуважение и конструктивная критика</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-[10px] font-extrabold text-textTertiary bg-surface-2 w-4 h-4 rounded flex items-center justify-center shrink-0 mt-0.5 group-hover:text-textSecondary transition-colors">2</div>
                <p className="text-xs text-textSecondary leading-snug group-hover:text-textPrimary transition-colors">Никакого пиратского контента (Warez)</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-[10px] font-extrabold text-textTertiary bg-surface-2 w-4 h-4 rounded flex items-center justify-center shrink-0 mt-0.5 group-hover:text-textSecondary transition-colors">3</div>
                <p className="text-xs text-textSecondary leading-snug group-hover:text-textPrimary transition-colors">Поиск команды строго по формату</p>
              </div>
            </div>
            
            <div className="pt-3 mt-1 border-t border-borderDef/40">
              <button className="text-[11px] font-extrabold text-textTertiary hover:text-textPrimary transition-colors flex items-center gap-1.5 w-full cursor-pointer">
                Полный свод <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
          
          <div className="bg-surface-1/30 rounded-2xl p-5 border border-borderDef/30 space-y-4">
            <h4 className="text-[11px] font-extrabold text-textTertiary uppercase tracking-widest flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-md bg-accent/10 flex items-center justify-center">
                <Trophy className="w-3.5 h-3.5 text-accent" />
              </div>
              Активные джемы
            </h4>
            <div className="space-y-4">
              <div 
                className="group cursor-pointer"
                onClick={() => onNavigate && onNavigate('/jams/hubigr-summer-jam-2026')}
              >
                <div className="text-[13px] font-bold group-hover:text-accent transition-colors line-clamp-1 mb-1">HUBIGR Summer Jam 2026</div>
                <div className="text-[11px] font-bold text-textTertiary uppercase tracking-widest">Осталось 3 дня</div>
              </div>
              <div 
                className="group cursor-pointer"
                onClick={() => onNavigate && onNavigate('/jams/mini-jam-one-room')}
              >
                <div className="text-[13px] font-bold group-hover:text-accent transition-colors line-clamp-1 mb-1">Mini-Jam: One Room</div>
                <div className="text-[11px] font-bold text-textTertiary uppercase tracking-widest">Голосование</div>
              </div>
            </div>
          </div>

        </div>
      </div>
      <DevMatrixPanel pageName="Хаб сообщества" fields={devFields} bottomOffsetClass="bottom-0" />
    </div>
  );
}

function getCategoryIcon(slug: string) {
  switch (slug) {
    case 'general': return MessageSquare;
    case 'questions': return HelpCircle;
    case 'gamedesign': return Lightbulb;
    case 'art': return PenTool;
    case 'code': return Code;
    case 'audio': return Music;
    default: return MessageSquare;
  }
}
