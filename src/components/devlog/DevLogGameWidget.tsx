import React from 'react';
import { MOCK_DEVLOGS } from '../../data/devlogMockData';
import { ChevronRight, Plus, Pin } from 'lucide-react';

interface DevLogGameWidgetProps {
  gameId: string;
  gameSlug: string;
  gameName: string;
  isOwner?: boolean;
}

const getTypeDisplay = (type: string) => {
  switch (type) {
    case 'update': return { label: 'ОБНОВЛЕНИЕ', style: 'border-success/20 text-success bg-success/5' };
    case 'announcement': return { label: 'АНОНС', style: 'border-accent/20 text-accent bg-accent/5' };
    case 'postmortem': return { label: 'ПОСТМОРТЕМ', style: 'border-purple-500/20 text-purple-400 bg-purple-500/5' };
    case 'need_feedback': return { label: 'НУЖЕН ФИДБЕК', style: 'border-warning/20 text-warning bg-warning/5' };
    case 'looking_for_team': return { label: 'ПОИСК КОМАНДЫ', style: 'border-info/20 text-info bg-info/5' };
    default: return { label: type.toUpperCase(), style: 'border-textTertiary/20 text-textTertiary bg-surface-2' };
  }
};

const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export default function DevLogGameWidget({ gameId, gameSlug, gameName, isOwner }: DevLogGameWidgetProps) {
  // Find all posts linked to this game
  const posts = MOCK_DEVLOGS.filter(p => 
    p.gameId === gameId || p.gameSlug === gameSlug || p.gameName === gameName
  ).sort((a, b) => {
    if (a.isPinnedToGame && !b.isPinnedToGame) return -1;
    if (!a.isPinnedToGame && b.isPinnedToGame) return 1;
    return new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime();
  });

  return (
    <div className="flex flex-col gap-0 relative w-full">
      {/* Кнопка добавления записи Devlog (Элегантная, неяркая) */}
      {isOwner && (
        <div className="mb-10 relative">
          <div className="absolute -left-[31px] md:-left-[39px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-surface-0 border-2 border-borderDef z-10" />
          <button 
            onClick={() => window.location.hash = '#/devlogs/new'}
            className="w-full sm:w-[320px] py-4 border border-dashed border-borderDef hover:border-accent hover:bg-accent/5 text-textTertiary hover:text-accent transition-colors duration-200 rounded-card flex items-center justify-center gap-2 font-mono text-xs uppercase font-bold tracking-wider"
          >
            <Plus className="w-4 h-4" /> Добавить запись
          </button>
        </div>
      )}

      {posts.length > 0 ? (
        posts.map(post => {
          const typeInfo = getTypeDisplay(post.type);
          
          return (
            <article 
              key={post.id} 
              className="mb-12 relative group last:mb-2 cursor-pointer"
              onClick={() => window.location.hash = `#/devlogs/${post.slug}`}
            >
              {/* Таймлайн точка */}
              <div className={`absolute -left-[31px] md:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full bg-surface-0 border-2 group-hover:border-accent transition-colors duration-150 flex items-center justify-center z-10 ${post.isPinnedToGame ? 'border-accent' : 'border-borderDef'}`}>
                <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-150 ${post.isPinnedToGame ? 'bg-accent' : 'bg-transparent group-hover:bg-accent'}`}></div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    {post.isPinnedToGame && (
                      <span className="flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded-md">
                        <Pin className="w-3 h-3 fill-accent" /> Закреплено
                      </span>
                    )}
                    <span className={`text-caption font-mono font-bold px-2.5 py-0.5 rounded-control border ${typeInfo.style}`}>
                      {typeInfo.label}
                    </span>

                    {post.type === 'update' && (
                      <span className="text-xs font-mono text-textTertiary bg-surface-0 border border-borderDef px-2 py-1 rounded-card">
                        Версия: <span className="text-textPrimary font-bold">Latest</span>
                      </span>
                    )}
                  </div>

                  <span className="font-mono text-xs font-bold text-textTertiary tracking-wider">
                    {formatDate(post.publishedAt || post.createdAt)}
                  </span>
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-textPrimary tracking-tight group-hover:text-accent transition-colors duration-150 leading-snug">
                  {post.title}
                </h3>

                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  {post.coverUrl && (
                    <div className="w-full sm:w-44 aspect-[16/10] shrink-0 rounded-card overflow-hidden border border-borderDef bg-surface-1">
                      <img src={post.coverUrl} alt="Обложка девлога" className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-body-sm text-textSecondary leading-[1.65] font-sans line-clamp-3">
                      {post.bodyMarkdown.substring(0, 300).replace(/[#*`_\[\]]/g, '')}
                    </p>
                    <div className="flex items-center gap-2 mt-4 cursor-pointer hover:underline w-max">
                      <span className="text-xs font-mono font-bold text-accent tracking-wider uppercase">
                        Читать полностью
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-accent" />
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })
      ) : (
        <div className="text-[15px] text-textTertiary py-8 text-left border border-dashed border-borderDef rounded-control -ml-10 px-6 font-sans">
          Дневник разработки пока пуст.
        </div>
      )}
    </div>
  );
}