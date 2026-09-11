import React, { useState, useEffect } from 'react';
import { ChevronRight, BellOff, MessageSquare, Eye, CheckCircle2, Info, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import { 
  getStoredCommunityThreads, 
  isThreadFollowed, 
  toggleFollowThread,
  getThreadFollowSource,
  MOCK_COMMUNITY_CATEGORIES 
} from '../data/communityMockData';
import { CommunityThread } from '../types/community';

export default function CommunitySubscriptionsPage({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const [threads, setThreads] = useState<CommunityThread[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'global' | 'jam'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadSubscribedThreads = () => {
    // BR-COM-084, FR-COM-081: Exclude deleted, hidden, or blocked threads
    const all = getStoredCommunityThreads();
    const subscribed = all.filter(t => {
      const isPublic = t.visibilityState === 'published' && !t.deletedAt;
      return isPublic && isThreadFollowed(t.id);
    });
    setThreads(subscribed);
  };

  useEffect(() => {
    loadSubscribedThreads();
  }, []);

  const handleUnsubscribe = (threadId: string, threadTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFollowThread(threadId, false);
    setToastMessage(`Вы отписались от темы: «${threadTitle}»`);
    setTimeout(() => setToastMessage(null), 3500);
    loadSubscribedThreads();
  };

  const filteredThreads = threads.filter(t => {
    if (activeFilter === 'unread') return t.repliesCount > 0;
    if (activeFilter === 'global') return !t.linkedJamId && t.contextType !== 'jam';
    if (activeFilter === 'jam') return Boolean(t.linkedJamId) || t.contextType === 'jam';
    return true;
  });

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 animate-fadeIn">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-slideUp">
          <div className="px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-bold bg-surface-3 text-textPrimary border border-borderStrong">
            <Info className="w-4 h-4 text-accent shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Breadcrumbs */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-textTertiary mb-8">
        <button onClick={() => onNavigate && onNavigate('/community')} className="hover:text-textPrimary transition-colors">Сообщество</button>
        <ChevronRight className="w-3 h-3" />
        <span className="text-textSecondary">Мои подписки</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-textPrimary tracking-tight">Отслеживаемые темы</h1>
          <p className="text-xs text-textTertiary mt-1 font-medium">Реестр тем, за обновлениями которых вы следите</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {[
            { id: 'all', label: `Все темы (${threads.length})` },
            { id: 'unread', label: 'Непрочитанные ответы' },
            { id: 'global', label: 'Глобальные' },
            { id: 'jam', label: 'Джемы' }
          ].map(f => (
            <button 
              key={f.id}
              onClick={() => setActiveFilter(f.id as any)}
              className={`px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-colors ${
                activeFilter === f.id 
                  ? 'bg-accent/20 text-accent ring-1 ring-accent/40' 
                  : 'bg-surface-2 hover:bg-surface-3 text-textSecondary hover:text-textPrimary'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filteredThreads.length === 0 ? (
        <div className="bg-surface-1 border border-borderDef rounded-2xl p-12 text-center space-y-4">
          <BellOff className="w-12 h-12 text-textTertiary mx-auto opacity-40" />
          <h3 className="text-base font-bold text-textPrimary">У вас пока нет отслеживаемых тем</h3>
          <p className="text-xs text-textSecondary max-w-md mx-auto">
            Подписывайтесь на интересные обсуждения кнопкой «Следить» в карточке темы или оставляйте комментарии — темы появятся здесь автоматически.
          </p>
          <Button variant="outline" size="sm" onClick={() => onNavigate && onNavigate('/community')}>
            Перейти в каталог Сообщества <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredThreads.map(thread => {
            const category = MOCK_COMMUNITY_CATEGORIES.find(c => c.id === thread.categoryId);
            return (
              <div 
                key={thread.id}
                onClick={() => onNavigate && onNavigate(`/community/thread/${thread.id}`)}
                className="bg-surface-1 border border-borderDef rounded-xl p-5 hover:border-accent/50 transition-colors flex flex-col sm:flex-row gap-5 items-start justify-between group cursor-pointer"
              >
                <div className="space-y-3 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-surface-2 text-textSecondary text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase">
                      {category?.name || 'Общее'}
                    </span>
                    <h3 className="text-base font-bold text-textPrimary group-hover:text-accent transition-colors truncate">
                      {thread.title}
                    </h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-textTertiary font-medium">
                    <span>Автор: @{thread.authorNick}</span>
                    <span>•</span>
                    <span>Подписка: {getThreadFollowSource(thread.id) === 'auto_comment' ? 'Автоматическая (по ответу)' : 'Ручная (по кнопке)'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {thread.normalizedViews}</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:items-end gap-3 shrink-0 self-end sm:self-center">
                  <div className="flex items-center gap-2 bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-bold">
                    <MessageSquare className="w-3.5 h-3.5" /> {thread.repliesCount} ответов
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    icon={<BellOff className="w-4 h-4 text-textTertiary hover:text-danger" />}
                    onClick={(e) => handleUnsubscribe(thread.id, thread.title, e)}
                    className="hover:text-danger hover:bg-danger/10"
                  >
                    Отписаться от темы
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
