import Button from './ui/Button';
import React from 'react';
import GameCardContextMenu from './GameCardContextMenu';
import MediaBadge from './ui/MediaBadge';
import GameCover, { GameCoverPlaceholder } from './ui/GameCover';
import Badge from './ui/Badge';
import { 
  Globe, Monitor, Apple, Star, Bookmark, Play, Download, 
  MoreVertical, Eye, AlertTriangle, Lock, Gamepad2, Trophy,
  Sparkles, Clock, GripVertical, ChevronUp, ChevronDown, X,
  Command, Terminal, Flag, Layers, Edit3, Trash2,
  Award, Check, CheckCircle2, FileText
} from 'lucide-react';

export const PlatformIcon: React.FC<{ platform: string; className?: string }> = ({ 
  platform, 
  className = "w-3.5 h-3.5" 
}) => {
  switch (platform.toLowerCase()) {
    case 'webgl':
      return <Globe className={className} />;
    case 'windows':
      return <Monitor className={className} />;
    case 'mac':
    case 'mac_os':
    case 'macos':
      return <Apple className={className} />;
    case 'linux':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.002 0c-2.88 0-4.78 2.22-4.78 5.12 0 1.21.37 2.44 1.02 3.42l-1.98 2.97a3.54 3.54 0 0 0-.58 1.91c0 1.96 1.58 3.55 3.54 3.55.33 0 .66-.05.98-.15l1.8 2.7c.33.5.89.8 1.48.8h.04c.59 0 1.15-.3 1.48-.8l1.8-2.7c.32.1.65.15.98.15 1.96 0 3.54-1.59 3.54-3.55 0-.68-.21-1.34-.58-1.91l-1.98-2.97c.65-.98 1.02-2.21 1.02-3.42C16.782 2.22 14.882 0 12.002 0z"/>
        </svg>
      );
    case 'android':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5516 0 .9997.4482.9997.9993s-.4481.9997-.9997.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5516 0 .9997.4482.9997.9993s-.4481.9997-.9997.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 0 0-.1521-.5676.416.416 0 0 0-.5676.1521l-2.0223 3.503C15.6302 8.3512 13.882 8.0007 12 8.0007s-3.6302.3505-5.1368.9497L4.8409 5.4474a.416.416 0 0 0-.5676-.1521.416.416 0 0 0-.1521.5676l1.9973 3.4592C2.6889 11.0664.3168 14.3804.0535 18.232h23.893c-.2633-3.8516-2.6354-7.1656-6.068-8.9106"/>
        </svg>
      );
    default:
      return null;
  }
};

export const formatMetric = (num: number): string => {
  if (num == null) return '0';
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
};


export const PlatformsBadge: React.FC<{
  platforms: string[];
  size?: 'sm' | 'base';
}> = ({ platforms, size = 'base' }) => {
  if (!platforms || platforms.length === 0) return null;
  const filtered = platforms.filter(p => p !== 'webgl');
  if (filtered.length === 0) return null;
  
  const iconClass = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';
  const padClass = size === 'sm' ? 'gap-1 px-1.5 py-0.5' : 'gap-1.5 px-2 py-1';

  return (
    <div className={`flex items-center ${padClass} bg-surface-1/90 backdrop-blur-sm border border-borderDef/50 shadow-elevation-base rounded-full`}>
      {filtered.slice(0, 4).map(p => (
        <PlatformIcon key={p} platform={p} className={`${iconClass} text-textSecondary`} />
      ))}
    </div>
  );
};

export const ProceduralGameCover: React.FC<{ title: string; id: string | number }> = ({ title, id }) => {
  return <GameCoverPlaceholder title={title} id={id} />;
};

export interface GameCardProps {
  game: {
    id: string;
    slug: string;
    title: string;
    short_desc: string;
    cover_url: string | null;
    author: {
      id: string;
      name: string;
      slug: string;
      is_team: boolean;
      avatar: string;
    };
    ratingAvg: number;
    ratingCount: number;
    downloadsCount: number;
    viewsCount: number;
    price: number;
    monetization: string;
    monetizationLabel: string;
    hasWebGL: boolean;
    hasBuilds: boolean;
    platforms: string[];
    category: string;
    categoryLabel: string;
    genres: string[];
    tags: string[];
    status: string;
    statusLabel: string;
    jamName?: string | null;
    isJamEntry?: boolean;
    created_at: string;
  };
  isCollected: boolean;
  onToggleCollection: (game: any) => void;
  onQuickPlay: (game: any) => void;
  onOpenContextMenu: (e: React.MouseEvent, game: any) => void;
  contextMenuOpen: boolean;
  onCloseContextMenu: () => void;
  onReport: (game: any) => void;
  triggerToast?: (message: string, type?: any) => void;
  onSelectTag: (tag: string) => void;
}

const getStatusBadgeStyle = (status: string) => {
  switch (status) {
    case 'released':
      return 'bg-success/10 text-success border-success/30';
    case 'in_development':
      return 'bg-info/10 text-info border-info/30';
    case 'prototype':
      return 'bg-warning/10 text-warning border-warning/30';
    case 'jam_build':
      return 'bg-celebratory/10 text-celebratory border-celebratory/30';
    default:
      return 'bg-surface-2 text-textSecondary border-borderDef';
  }
};

/* ─── CATALOG GRID CARD ─────────────────────────────────────────────────── */

export const GameGridCard: React.FC<GameCardProps> = ({
  game,
  isCollected,
  onToggleCollection,
  onQuickPlay,
  onOpenContextMenu,
  contextMenuOpen,
  onCloseContextMenu,
  onReport,
  triggerToast,
  onSelectTag
}) => {
  const authorProfileUrl = game.author.is_team ? `/teams/${game.author.slug}` : `/users/${game.author.id}`;

  const navigateToGame = () => {
    if ((window as any).__hubigrNavigate) {
      (window as any).__hubigrNavigate(`/games/${game.slug}`);
    } else {
      window.location.hash = `#/games/${game.slug}`;
    }
  };

  return (
    <article 
      className={`group flex flex-col justify-between gap-2 transition-all duration-base hover:-translate-y-0.5 shadow-none hover:shadow-none font-sans ${
        contextMenuOpen ? 'relative z-dropdown' : 'relative z-0'
      }`}
    >
      {/* Visual Anchor: Cover Artwork */}
      <div 
        className="w-full aspect-video bg-surface-0 relative overflow-hidden block cursor-pointer rounded-t-card"
        onClick={navigateToGame}
      >
        <div className="w-full h-full relative">
          <GameCover 
            src={game.cover_url} 
            title={game.title} 
            id={game.id} 
            developer={game.author?.name}
            className="w-full h-full"
            imageClassName="w-full h-full object-cover opacity-95 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 ease-out"
          />

          <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-black/70 via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-surface-1 via-surface-1/40 to-transparent pointer-events-none" />
        </div>

        {/* Top-Left: WebGL badge */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10 pointer-events-none">
          {game.hasWebGL && (
            <MediaBadge variant="accent" icon={<Globe className="w-3.5 h-3.5" />}>
              WebGL
            </MediaBadge>
          )}
        </div>

        {/* Bottom-Left: Platform icons overlay */}
        <div className="absolute bottom-2.5 left-2.5 z-10 pointer-events-none">
          <PlatformsBadge platforms={game.platforms} />
        </div>

        {/* Top-Right: Price badge */}
        <div className="absolute top-2.5 right-2.5 z-10 pointer-events-none">
          {game.monetization === 'free' && (
            <MediaBadge variant="success">FREE</MediaBadge>
          )}
          {game.monetization === 'pwyw' && (
            <MediaBadge variant="accent" title="Pay What You Want (Гибкая цена)" className="pointer-events-auto cursor-help">
              Гибкая цена
            </MediaBadge>
          )}
          {game.monetization === 'paid' && (
            <MediaBadge variant="white">{game.price > 0 ? `${game.price} ₽` : 'ПЛАТНО'}</MediaBadge>
          )}
        </div>

        {/* Bottom-Right: Bookmark Button */}
        <div className="absolute bottom-2.5 right-2.5 z-20">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleCollection(game);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-[0.97] border-borderDef border ${
              isCollected 
                ? 'bg-reaction/90 border-reaction/50 text-white shadow-none' 
                : 'bg-surface-1/90 hover:bg-surface-1 border-borderDef/50 hover:border-borderStrong text-textSecondary hover:text-textPrimary'
            }`}
            title={isCollected ? 'В коллекции' : 'В коллекцию'}
            aria-label={isCollected ? 'В коллекции' : 'В коллекцию'}
          >
            <Bookmark className={`w-4 h-4 ${isCollected ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Structured Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Header Row: Title & Status Badge */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 
              onClick={navigateToGame}
              className="text-body font-bold text-textPrimary group-hover:text-accent transition-colors duration-fast line-clamp-1 leading-snug tracking-tight cursor-pointer"
            >
              {game.title}
            </h3>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-control border shrink-0 uppercase tracking-wider ${getStatusBadgeStyle(game.status)}`}>
              {game.statusLabel}
            </span>
          </div>

          {/* Author Row */}
          <div className="flex items-center gap-2 mb-2.5">
            <a 
              href={authorProfileUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1.5 text-caption text-textSecondary hover:text-textPrimary transition-colors truncate group/author"
            >
              <img 
                src={game.author.avatar} 
                alt={game.author.name}
                className={`w-4 h-4 object-cover shrink-0 border border-borderDef group-hover/author:border-accent/40 transition-colors ${
                  game.author.is_team ? 'rounded-control' : 'rounded-full'
                }`} 
              />
              <span className="truncate font-medium">@{game.author.name}</span>
            </a>


          </div>

          {/* Tagline Description */}
          <p className="text-caption text-textSecondary leading-relaxed line-clamp-2 mb-3 min-h-[2.5rem]">
            {game.short_desc}
          </p>

          {/* Jam Trophy Origin (if applicable) */}
          {game.isJamEntry && game.jamName && (
            <div className="mb-3 flex items-center gap-1.5 text-caption font-mono text-celebratory">
              <Trophy className="w-3.5 h-3.5 shrink-0" />
              <span className="font-semibold text-textTertiary">Джем:</span>
              <span className="font-bold truncate max-w-[180px]">"{game.jamName}"</span>
            </div>
          )}

          {/* Genre Tags */}
          <div className="flex items-center gap-1.5 flex-wrap mb-2 h-6 overflow-hidden">
            {(game.tags || []).slice(0, 3).map(tag => (
              <button
                key={tag}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTag(tag);
                }}
                className="bg-surface-2 hover:bg-surface-3 border border-borderDef hover:border-accent/40 text-textSecondary hover:text-textPrimary text-[11px] font-mono font-medium px-2 py-0.5 rounded-control transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent cursor-pointer"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        <div>
          {/* Social Proof Metrics */}
          <div className="pt-2.5 border-t border-borderDef flex items-center justify-between text-caption text-textTertiary mb-3 font-mono">
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-warning fill-warning" />
              <span className="font-bold text-textPrimary">{game.ratingAvg}</span>
              <span className="text-textTertiary">({game.ratingCount})</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1" title="Просмотров">
                <Eye className="w-3.5 h-3.5 text-textTertiary" />
                <span>{formatMetric(game.viewsCount)}</span>
              </div>
              <div className="flex items-center gap-1" title="Загрузок">
                <Download className="w-3.5 h-3.5 text-textTertiary" />
                <span>{formatMetric(game.downloadsCount)}</span>
              </div>
            </div>
          </div>

          {/* Main Action Bar */}
          <div className="flex items-center gap-2">
            {!game.hasBuilds ? (
              <Button variant="outline" disabled fullWidth icon={<AlertTriangle className="w-3.5 h-3.5 text-danger" />}>Нет файлов</Button>
            ) : game.monetization === 'paid' ? (
              <Button variant="primary" fullWidth onClick={() => { window.location.href = `/market/checkout?item_id=${game.id}`; }} icon={<Lock className="w-3.5 h-3.5" />}>Купить {game.price} ₽</Button>
            ) : game.hasWebGL ? (
              <Button variant="primary" fullWidth onClick={() => onQuickPlay(game)} icon={<Play className="w-3.5 h-3.5 fill-current" />}>Запустить WebGL</Button>
            ) : (
              <a 
                href={`/games/${game.slug}#download`}
                className="flex-1 h-10 bg-surface-2 hover:bg-surface-3 border border-borderDef hover:border-borderStrong text-textPrimary text-caption font-bold rounded-control flex items-center justify-center gap-1.5 transition-colors no-underline font-sans uppercase tracking-wider active:scale-[0.98]"
              >
                <Download className="w-3.5 h-3.5 text-textTertiary" />
                <span>Скачать ПК</span>
              </a>
            )}

            {/* Context Menu Dropdown Trigger */}
            <div className="relative z-dropdown">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenContextMenu(e, game);
                }}
                className="w-10 h-10 rounded-control bg-surface-2 border border-borderDef hover:border-borderStrong flex items-center justify-center text-textTertiary hover:text-textPrimary transition-all cursor-pointer active:scale-[0.97]"
                aria-label="Контекстное меню"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              
              <GameCardContextMenu 
                game={game}
                isOpen={contextMenuOpen}
                onClose={onCloseContextMenu}
                onReport={() => onReport(game)}
                triggerToast={triggerToast}
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

/* ─── CATALOG LIST CARD ──────────────────────────────────────────────────── */

export const GameListCard: React.FC<GameCardProps> = ({
  game,
  isCollected,
  onToggleCollection,
  onQuickPlay,
  onOpenContextMenu,
  contextMenuOpen,
  onCloseContextMenu,
  onReport,
  triggerToast,
  onSelectTag
}) => {
  const authorProfileUrl = game.author.is_team ? `/teams/${game.author.slug}` : `/users/${game.author.id}`;

  const navigateToGame = () => {
    if ((window as any).__hubigrNavigate) {
      (window as any).__hubigrNavigate(`/games/${game.slug}`);
    } else {
      window.location.hash = `#/games/${game.slug}`;
    }
  };

  return (
    <div 
      className={`py-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 transition-all duration-200 group hover:shadow-none font-sans ${
        contextMenuOpen ? 'relative z-dropdown' : 'relative z-0'
      }`}
    >
      <div className="flex items-center gap-4 sm:gap-5 flex-1 min-w-0 w-full sm:w-auto">
        <div 
          className="relative w-32 sm:w-44 aspect-video bg-surface-0 rounded-control overflow-hidden shrink-0 border border-borderDef group-hover:border-borderStrong cursor-pointer"
          onClick={navigateToGame}
        >
          <GameCover 
            src={game.cover_url} 
            title={game.title} 
            id={game.id} 
            developer={game.author?.name}
            className="w-full h-full"
            imageClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 pointer-events-none" />

          {/* Bottom-Left: Platform icons overlay */}
          <PlatformsBadge platforms={game.platforms} size="sm" />

          {/* Bottom-Right: Bookmark Button */}
          <div className="absolute bottom-2.5 right-2.5 z-20">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onToggleCollection(game);
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-[0.97] border-borderDef border ${
                isCollected 
                  ? 'bg-reaction/90 border-reaction/50 text-white shadow-none' 
                  : 'bg-surface-1/90 hover:bg-surface-1 border-borderDef/50 hover:border-borderStrong text-textSecondary hover:text-textPrimary'
              }`}
              title={isCollected ? 'В коллекции' : 'В коллекцию'}
              aria-label={isCollected ? 'В коллекции' : 'В коллекцию'}
            >
              <Bookmark className={`w-4 h-4 ${isCollected ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        <div className="flex flex-col min-w-0 flex-1 space-y-1.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
              game.monetization === 'free' 
                ? 'bg-success/15 text-success border-success/30'
                : game.monetization === 'pwyw'
                ? 'bg-accent/15 text-accent border-accent/30'
                : 'bg-surface-2 text-textPrimary border-borderDef'
            }`}>
              {game.monetizationLabel}
            </span>

            <div className="flex items-center gap-1 font-mono text-caption text-textTertiary">
              <Star className="w-3.5 h-3.5 text-warning fill-warning" />
              <span className="font-bold text-textPrimary">{game.ratingAvg}</span>
              <span className="text-textTertiary">({game.ratingCount})</span>
            </div>



            {game.isJamEntry && game.jamName && (
              <span className="hidden lg:flex items-center gap-1 text-[10px] font-mono font-semibold text-celebratory bg-celebratory/10 px-2 py-0.5 rounded border border-celebratory/30 uppercase">
                <Trophy className="w-3 h-3" />
                <span>{game.jamName}</span>
              </span>
            )}
          </div>

          <button 
            onClick={navigateToGame}
            className="text-left font-bold text-body leading-snug text-textPrimary hover:text-accent transition-colors truncate cursor-pointer focus-visible:outline-none"
          >
            {game.title}
          </button>

          <div className="flex items-center gap-3 text-caption text-textSecondary font-sans flex-wrap">
            <a 
              href={authorProfileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-textPrimary truncate transition-colors"
            >
              <img 
                src={game.author.avatar} 
                alt={game.author.name} 
                className={`w-4 h-4 object-cover shrink-0 border border-borderDef ${game.author.is_team ? 'rounded-[3px]' : 'rounded-full'}`} 
              />
              <span className="truncate">@{game.author.name}</span>
            </a>

            <span className="hidden md:inline text-textTertiary">&bull;</span>
            <span className="font-mono text-[11px] text-textTertiary hidden md:inline">{game.categoryLabel}</span>

            <div className="flex items-center gap-1.5 flex-wrap">
              {(game.tags || []).slice(0, 3).map(t => (
                <button 
                  key={t}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTag(t);
                  }}
                  className="text-[10px] bg-surface-2 border border-borderDef hover:border-accent/40 text-textTertiary hover:text-textPrimary px-2 py-0.5 rounded-control transition-colors font-mono font-medium"
                >
                  #{t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end border-t sm:border-t-0 border-borderDef pt-3 sm:pt-0 shrink-0">
        {!game.hasBuilds ? (
          <button 
            disabled 
            className="w-44 sm:w-48 h-9 bg-surface-disabled border border-borderDef text-textDisabled text-caption font-semibold rounded-control flex items-center justify-center gap-1.5 cursor-not-allowed shrink-0"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-danger" />
            <span>Нет файлов</span>
          </button>
        ) : game.monetization === 'paid' ? (
          <Button variant="primary" className="w-44 sm:w-48 shrink-0" onClick={() => { window.location.href = `/market/checkout?item_id=${game.id}`; }} icon={<Lock className="w-3.5 h-3.5" />}>Купить {game.price} ₽</Button>
        ) : game.hasWebGL ? (
          <Button variant="primary" className="w-44 sm:w-48 shrink-0" onClick={() => onQuickPlay(game)} icon={<Play className="w-3.5 h-3.5 fill-current" />}>Запустить WebGL</Button>
        ) : (
          <a 
            href={`/games/${game.slug}#download`}
            className="w-44 sm:w-48 h-9 bg-surface-2 hover:bg-surface-3 border border-borderDef hover:border-borderStrong text-textPrimary text-caption font-semibold rounded-control flex items-center justify-center gap-1.5 transition-colors shrink-0 no-underline font-sans focus-visible:outline-none"
          >
            <Download className="w-3.5 h-3.5 text-textTertiary" />
            <span>Скачать билд</span>
          </a>
        )}

        <div className="relative z-dropdown">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onOpenContextMenu(e, game);
            }}
            className="w-9 h-9 rounded-control bg-surface-2 border border-borderDef hover:border-borderStrong flex items-center justify-center text-textTertiary hover:text-textPrimary transition-all focus-visible:outline-none"
            aria-label="Контекстное меню"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          <GameCardContextMenu 
            game={game}
            isOpen={contextMenuOpen}
            onClose={onCloseContextMenu}
            onReport={() => onReport(game)}
            triggerToast={triggerToast}
          />
        </div>
      </div>
    </div>
  );
};

/* ─── LIBRARY GAME CARD (GRID) ───────────────────────────────────────────── */

export interface LibraryGameCardProps {
  game: {
    id: string;
    slug: string;
    title: string;
    author: { name: string; avatar: string; id: string };
    cover_url: string | null;
    ownership: string;
    price_label: string;
    platforms: string[];
    has_webgl: boolean;
    has_desktop: boolean;
    download_builds?: any[];
    has_unread_patch?: boolean;
    latest_version?: string;
    rating: number;
    genre: string;
    is_favorite?: boolean;
    play_later?: boolean;
  };
  onQuickPlay: (game: any) => void;
  onOpenPatchnotes?: (game: any) => void;
  onToggleFavorite?: (gameId: string) => void;
  onTogglePlayLater?: (gameId: string) => void;
  onOpenRemoveFromCollection?: (game: any) => void;
  onOpenRemoveFromLibrary?: (game: any) => void;
  onOpenAddToCollection?: (game: any) => void;
  onOpenContextMenu?: (e: React.MouseEvent, game: any) => void;
  contextMenuOpen?: boolean;
  onCloseContextMenu?: () => void;
  triggerToast?: (message: string, type?: any) => void;
  showCollectionOrderControls?: boolean;
  onMoveInCollection?: (gameId: string, direction: 'up' | 'down') => void;
  isFirstInCollection?: boolean;
  isLastInCollection?: boolean;
  DownloadDropdown?: React.ComponentType<any>;
}

export const LibraryGameCard: React.FC<LibraryGameCardProps> = ({
  game,
  onQuickPlay,
  onOpenPatchnotes,
  onToggleFavorite,
  onTogglePlayLater,
  onOpenRemoveFromCollection,
  onOpenRemoveFromLibrary,
  onOpenAddToCollection,
  onOpenContextMenu,
  contextMenuOpen = false,
  onCloseContextMenu,
  triggerToast,
  showCollectionOrderControls = false,
  onMoveInCollection,
  isFirstInCollection = false,
  isLastInCollection = false,
  DownloadDropdown
}) => {
  return (
    <article className={`flex flex-col justify-between gap-2 transition-all duration-200 group relative shadow-none hover:shadow-none font-sans ${contextMenuOpen ? 'z-dropdown' : 'z-0'}`}>
      <div>
        {/* Cover 16:9 */}
        <div 
          className="relative aspect-video bg-surface-0 rounded-t-card overflow-hidden cursor-pointer" 
          onClick={() => onQuickPlay(game)}
        >
          <GameCover 
            src={game.cover_url} 
            title={game.title} 
            id={game.id} 
            developer={game.author?.name}
            className="w-full h-full"
            imageClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-1 via-transparent to-transparent opacity-60 pointer-events-none" />

          {/* Top Left: Patchnotes Badge */}
          {game.has_unread_patch && onOpenPatchnotes && (
            <button 
              type="button"
              onClick={(e) => { e.stopPropagation(); onOpenPatchnotes(game); }}
              className="absolute top-2 left-2 bg-success text-black text-[10px] font-mono font-bold px-2 py-0.5 rounded-control flex items-center gap-1 shadow-elevation-base transition-transform hover:scale-105 cursor-pointer z-10 uppercase tracking-wider"
              title="Нажмите, чтобы прочитать патчноут"
            >
              <Sparkles className="w-3 h-3 fill-current" />
              <span>{game.latest_version || 'Патч'}</span>
            </button>
          )}

          {/* Top Right: Favorite & Play Later Actions */}
          <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-90 md:opacity-0 md:group-hover:opacity-100 focus-within:opacity-100 transition-opacity z-10">
            {onToggleFavorite && (
              <button 
                onClick={(e) => { e.stopPropagation(); onToggleFavorite(game.id); }}
                className={`w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md border transition-all cursor-pointer ${
                  game.is_favorite 
                    ? 'bg-accent border-accent text-white shadow-elevation-base' 
                    : 'bg-surface-1/90 border-borderDef/50 text-textSecondary hover:bg-surface-1 hover:text-textPrimary'
                }`}
                title="Избранное"
              >
                <Star className={`w-3 h-3 ${game.is_favorite ? 'fill-current' : ''}`} />
              </button>
            )}
            {onTogglePlayLater && (
              <button 
                onClick={(e) => { e.stopPropagation(); onTogglePlayLater(game.id); }}
                className={`w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md border transition-all cursor-pointer ${
                  game.play_later 
                    ? 'bg-accent border-accent text-white shadow-elevation-base' 
                    : 'bg-surface-1/90 border-borderDef/50 text-textSecondary hover:bg-surface-1 hover:text-textPrimary'
                }`}
                title="Пройти позже"
              >
                <Clock className="w-3 h-3" />
              </button>
            )}
            {onOpenRemoveFromCollection && (
              <button 
                onClick={(e) => { e.stopPropagation(); onOpenRemoveFromCollection(game); }}
                className="w-7 h-7 rounded-full bg-surface-1/90 hover:bg-danger text-textSecondary hover:text-white flex items-center justify-center backdrop-blur-md border border-borderDef/50 transition-all cursor-pointer"
                title="Убрать из подборки"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Bottom Left: Platform Icons */}
          <PlatformsBadge platforms={game.platforms} />

          {/* Drag & Drop Reorder Controls for Collections */}
          {showCollectionOrderControls && onMoveInCollection && (
            <div 
              className="absolute top-2 left-2 flex items-center gap-0.5 h-7 bg-surface-1/90 backdrop-blur-md border border-borderDef/50 rounded-full px-1 z-10" 
              onClick={e => e.stopPropagation()}
            >
              <div className="w-5 h-5 flex items-center justify-center cursor-grab text-textTertiary hover:text-textPrimary" title="Перетаскивание">
                <GripVertical className="w-3 h-3" />
              </div>
              <button 
                onClick={() => onMoveInCollection(game.id, 'up')}
                disabled={isFirstInCollection}
                className="w-5 h-5 flex items-center justify-center hover:bg-white/10 text-textTertiary hover:text-textPrimary rounded-full transition-colors disabled:opacity-20 cursor-pointer"
                title="Вверх"
              >
                <ChevronUp className="w-3 h-3" />
              </button>
              <button 
                onClick={() => onMoveInCollection(game.id, 'down')}
                disabled={isLastInCollection}
                className="w-5 h-5 flex items-center justify-center hover:bg-white/10 text-textTertiary hover:text-textPrimary rounded-full transition-colors disabled:opacity-20 cursor-pointer"
                title="Вниз"
              >
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-control uppercase border ${
              game.ownership === 'purchased' 
                ? 'bg-info/10 text-info border-info/30'
                : game.ownership === 'pwyw'
                ? 'bg-accent/10 text-accent border-accent/30'
                : 'bg-surface-2 text-textTertiary border-borderDef'
            }`}>
              {game.price_label}
            </span>

            <div className="flex items-center gap-1 font-mono text-caption text-textTertiary">
              <Star className="w-3.5 h-3.5 text-warning fill-warning" />
              <span className="font-bold text-textPrimary">{game.rating}</span>
            </div>
          </div>

          <button 
            onClick={() => onQuickPlay(game)}
            className="text-left text-body font-bold text-textPrimary group-hover:text-accent transition-colors duration-fast line-clamp-1 cursor-pointer"
          >
            {game.title}
          </button>

          <div className="flex items-center justify-between text-caption text-textTertiary font-sans">
            <span className="flex items-center gap-1.5 truncate max-w-[140px]">
              <img src={game.author.avatar} alt={game.author.name} className="w-4 h-4 rounded-full shrink-0 border border-borderDef" />
              <span className="truncate">@{game.author.name}</span>
            </span>
            <span className="font-mono text-[11px] text-textTertiary">{game.genre}</span>
          </div>
        </div>
      </div>

      <div className="p-4 pt-0 flex items-center gap-2">
        {game.has_webgl ? (
          <button 
            onClick={() => onQuickPlay(game)}
            className="flex-1 h-9 bg-accent hover:bg-accent-hover text-white text-caption font-bold rounded-control flex items-center justify-center gap-1.5 transition-colors uppercase tracking-wider shadow-elevation-base cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Запустить WebGL</span>
          </button>
        ) : DownloadDropdown && game.download_builds ? (
          <div className="flex-1">
            <DownloadDropdown builds={game.download_builds} gameTitle={game.title} triggerToast={triggerToast} />
          </div>
        ) : (
          <button 
            onClick={() => triggerToast?.(`Скачивание клиента для ${game.title}...`, 'info')}
            className="flex-1 h-9 bg-surface-2 hover:bg-surface-3 border border-borderDef text-textPrimary text-caption font-semibold rounded-control flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-textTertiary" />
            <span>Скачать билд</span>
          </button>
        )}

        {onOpenContextMenu && (
          <div className="relative z-dropdown">
            <button 
              onClick={(e) => { e.stopPropagation(); onOpenContextMenu(e, game); }}
              className="w-9 h-9 rounded-control bg-surface-2 border border-borderDef hover:border-borderStrong flex items-center justify-center text-textTertiary hover:text-textPrimary transition-all"
              aria-label="Контекстное меню"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {contextMenuOpen && onCloseContextMenu && (
              <GameCardContextMenu 
                game={{ id: game.id, slug: game.slug, title: game.title, has_unread_patch: game.has_unread_patch }}
                isOpen={contextMenuOpen}
                onClose={onCloseContextMenu}
                onReport={() => triggerToast && triggerToast('Жалоба отправлена', 'info')}
                triggerToast={triggerToast}
              />
            )}
          </div>
        )}
      </div>
    </article>
  );
};

/* ─── JAM SUBMISSION ENTRY CARD ─────────────────────────────────────────── */

export interface JamEntryGameCardProps {
  entry: {
    id: string | number;
    slug: string;
    title: string;
    author: string;
    authorHandle?: string;
    avatar?: string;
    image?: string | null;
    cover_url?: string | null;
    cover?: string | null;
    short_desc?: string;
    platforms?: string[];
    has_webgl?: boolean;
    genres?: string[];
    overallScore?: number | string;
    ratingCount?: number;
    rank?: number;
    awardBadges?: string[];
  };
  onNavigate?: (slug: string) => void;
  onQuickPlay?: (entry: any) => void;
  onToggleCollection?: (entry: any) => void;
  isCollected?: boolean;
}

export const JamEntryGameCard: React.FC<JamEntryGameCardProps> = ({
  entry,
  onNavigate,
  onQuickPlay,
  onToggleCollection,
  isCollected = false
}) => {
  const coverUrl = entry.image || entry.cover_url || entry.cover || null;
  const authorAvatar = entry.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${entry.author}`;

  const handleOpen = () => {
    if (onNavigate) {
      onNavigate(entry.slug);
    } else if ((window as any).__hubigrNavigate) {
      (window as any).__hubigrNavigate(`/games/${entry.slug}`);
    } else {
      window.location.hash = `#/games/${entry.slug}`;
    }
  };

  return (
    <article className="group flex flex-col transition-all gap-2 duration-200 hover:-translate-y-0.5 shadow-none hover:shadow-none font-sans relative z-0">
      <div className="cursor-pointer" onClick={handleOpen}>
        {/* Cover Image */}
        <div className="w-full aspect-video bg-surface-0 relative overflow-hidden rounded-t-card">
          <div className="w-full h-full relative">
            <GameCover 
              src={coverUrl} 
              title={entry.title} 
              id={entry.id} 
              developer={entry.author}
              className="w-full h-full"
              imageClassName="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 ease-out" 
            />

            <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-surface-1 via-surface-1/40 to-transparent pointer-events-none" />
          </div>

          {/* Top Rank Badge */}
          {entry.rank && (
            <div className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-control font-mono font-extrabold text-caption flex items-center gap-1 shadow-elevation-raised border backdrop-blur-md uppercase tracking-wider ${
              entry.rank === 1 
                ? 'bg-accent/20 border-accent text-accent' 
                : entry.rank === 2 
                ? 'bg-slate-300/20 border-slate-300 text-slate-200' 
                : entry.rank === 3 
                ? 'bg-amber-600/20 border-amber-600 text-amber-400' 
                : 'bg-surface-2/80 border-borderDef text-textSecondary'
            }`}>
              <Trophy className="w-3.5 h-3.5" />
              <span>{entry.rank} место</span>
            </div>
          )}

          {/* Platforms */}
          {entry.platforms && entry.platforms.length > 0 && (
            <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 bg-surface-0/80 backdrop-blur-md border border-borderDef px-2 py-0.5 rounded-control text-textSecondary text-[11px] shadow-elevation-base">
              {entry.platforms.map(p => (
                <PlatformIcon key={p} platform={p} className="w-3.5 h-3.5" />
              ))}
            </div>
          )}

          {/* Bookmark Button */}
          {onToggleCollection && (
            <div className="absolute bottom-2.5 right-2.5 z-20">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleCollection(entry);
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-[0.97] border-borderDef border ${
                  isCollected 
                    ? 'bg-reaction/90 border-reaction/50 text-white shadow-none' 
                    : 'bg-surface-1/90 hover:bg-surface-1 border-borderDef/50 hover:border-borderStrong text-textSecondary hover:text-textPrimary'
                }`}
                title={isCollected ? 'В коллекции' : 'Добавить в коллекцию'}
                aria-label={isCollected ? 'В коллекции' : 'Добавить в коллекцию'}
              >
                <Bookmark className={`w-4 h-4 ${isCollected ? 'fill-current' : ''}`} />
              </button>
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div className="mb-1.5">
              <h3 className="text-body font-bold text-textPrimary group-hover:text-accent transition-colors duration-fast line-clamp-1 leading-snug tracking-tight">
                {entry.title}
              </h3>
            </div>

            <div className="flex items-center gap-1.5 text-caption text-textSecondary mb-3">
              <img src={authorAvatar} alt={entry.author} className="w-4 h-4 rounded-full object-cover border border-borderDef" />
              <span className="truncate font-medium">{entry.author}</span>
            </div>

            {entry.short_desc && (
              <p className="text-caption text-textSecondary line-clamp-2 leading-relaxed mb-3 min-h-[2.5rem]">
                {entry.short_desc}
              </p>
            )}

            {/* Genre Tags */}
            {entry.genres && entry.genres.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap mb-3 h-6 overflow-hidden">
                {(entry.genres || []).slice(0, 3).map((genre, i) => (
                  <span
                    key={i}
                    className="bg-surface-2 border border-borderDef text-textSecondary text-[11px] font-mono font-medium px-2 py-0.5 rounded-control"
                  >
                    #{genre}
                  </span>
                ))}
              </div>
            )}

            {entry.awardBadges && entry.awardBadges.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap mb-3">
                {entry.awardBadges.map((award, i) => (
                  <span key={i} className="text-[10px] font-mono font-bold bg-celebratory/10 text-celebratory border border-celebratory/30 px-2 py-0.5 rounded-control uppercase tracking-wider flex items-center gap-1">
                    <Trophy className="w-3 h-3" />
                    <span>{award}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            {/* Score */}
            {entry.overallScore && (
              <div className="pt-2 mb-3 border-t border-borderDef">
                <div className="flex items-center gap-1.5 text-caption font-mono">
                  <Star className="w-3.5 h-3.5 text-warning fill-warning" />
                  <span className="font-bold text-textPrimary">{entry.overallScore}</span>
                  {entry.ratingCount && (
                    <span className="text-textTertiary">({entry.ratingCount})</span>
                  )}
                </div>
              </div>
            )}

            {/* CTA Button */}
            {entry.has_webgl && onQuickPlay ? (
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickPlay(entry);
                }}
                className="w-full h-9 bg-accent hover:bg-accent-hover text-white text-caption font-bold rounded-control flex items-center justify-center gap-1.5 transition-colors uppercase tracking-wider shadow-elevation-base cursor-pointer focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Запустить WebGL</span>
              </button>
            ) : (
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpen();
                }}
                className="w-full h-9 bg-surface-2 hover:bg-surface-3 border border-borderDef hover:border-borderStrong text-textPrimary text-caption font-semibold rounded-control flex items-center justify-center gap-1.5 transition-colors cursor-pointer focus-visible:outline-none"
              >
                <span>Смотреть сабмишен</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

/* ─── PROFILE GAME CARD ─────────────────────────────────────────────────── */

export interface ProfileGameCardProps {
  project: {
    id: string | number;
    title: string;
    slug?: string;
    price: string;
    genre: string;
    rating: number;
    ratingCount?: number;
    downloads: string | number;
    views?: string | number;
    image?: string | null;
    description: string;
    status: string;
    platforms?: string[];
    hasWebGL?: boolean;
    jamName?: string | null;
  };
  isEditingMode: boolean;
  isCollected?: boolean;
  onEdit?: (project: any) => void;
  onDelete?: (project: any) => void;
  onQuickPlay?: (project: any) => void;
  onToggleCollection?: (project: any) => void;
  onOpenContextMenu?: (e: React.MouseEvent, project: any) => void;
  contextMenuOpen?: boolean;
  onCloseContextMenu?: () => void;
  onReport?: (project: any) => void;
  triggerToast?: (message: string, type?: any) => void;
  onSelectTag?: (tag: string) => void;
  onTransferOwnership?: (project: any) => void;
}

export const ProfileGameCard: React.FC<ProfileGameCardProps> = ({
  project,
  isEditingMode,
  isCollected = false,
  onEdit,
  onDelete,
  onQuickPlay,
  onToggleCollection,
  onOpenContextMenu,
  contextMenuOpen = false,
  onCloseContextMenu,
  onReport,
  triggerToast,
  onSelectTag,
  onTransferOwnership
}) => {
  const handleNavigate = () => {
    const slug = project.slug || project.title.toLowerCase().replace(/\s+/g, '-');
    if ((window as any).__hubigrNavigate) {
      (window as any).__hubigrNavigate(`/games/${slug}`);
    } else {
      window.location.hash = `#/games/${slug}`;
    }
  };

  return (
    <article 
      className={`group flex flex-col justify-between gap-2 transition-all duration-base hover:-translate-y-0.5 shadow-none hover:shadow-none font-sans ${
        contextMenuOpen ? 'relative z-dropdown' : 'relative z-0'
      }`}
    >
      {/* Visual Anchor: Cover Artwork */}
      <div 
        className="w-full aspect-video bg-surface-0 relative overflow-hidden block cursor-pointer rounded-t-card"
        onClick={handleNavigate}
      >
        <div className="w-full h-full relative">
          <GameCover 
            src={project.image} 
            title={project.title} 
            id={project.id as number} 
            className="w-full h-full"
            imageClassName="w-full h-full object-cover opacity-95 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 ease-out"
          />

          <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-black/70 via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-surface-1 via-surface-1/40 to-transparent pointer-events-none" />
        </div>

        {/* Top-Left: WebGL badge */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10 pointer-events-none">
          {project.hasWebGL && (
            <MediaBadge variant="accent" icon={<Globe className="w-3.5 h-3.5" />}>
              WebGL
            </MediaBadge>
          )}
        </div>

        {/* Bottom-Left: Platform icons overlay */}
        {project.platforms && <PlatformsBadge platforms={project.platforms} />}

        {/* Bottom-Right: Bookmark Button */}
        {onToggleCollection && (
          <div className="absolute bottom-2.5 right-2.5 z-20">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onToggleCollection(project);
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-[0.97] border-borderDef border ${
                isCollected 
                  ? 'bg-reaction/90 border-reaction/50 text-white shadow-none' 
                  : 'bg-surface-1/90 hover:bg-surface-1 border-borderDef/50 hover:border-borderStrong text-textSecondary hover:text-textPrimary'
              }`}
              title="В коллекцию"
            >
              <Bookmark className={`w-4 h-4 ${isCollected ? 'fill-current' : ''}`} />
            </button>
          </div>
        )}

        {isEditingMode ? (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-20 bg-surface-1/90 backdrop-blur-sm border border-borderDef/50 px-1.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <button 
                onClick={(e) => { e.stopPropagation(); onEdit(project); }} 
                className="p-1 hover:bg-white/20 hover:text-white text-white/80 rounded-full transition-colors cursor-pointer"
                title="Редактировать проект"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(project); }} 
                className="p-1 hover:bg-danger/80 hover:text-white text-white/80 rounded-full transition-colors cursor-pointer"
                title="Удалить проект"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ) : (
          <div className="absolute top-2.5 right-2.5 z-10 pointer-events-none">
            {project.price && project.price !== 'Бесплатно' && project.price !== '0' && project.price !== '0 ₽' ? (
              <MediaBadge variant="white">{project.price}</MediaBadge>
            ) : (
              <MediaBadge variant="success">FREE</MediaBadge>
            )}
          </div>
        )}
      </div>

      {/* Structured Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Header Row: Title & Status Badge */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 
              onClick={handleNavigate}
              className="text-body font-bold text-textPrimary group-hover:text-accent transition-colors duration-fast line-clamp-1 leading-snug tracking-tight cursor-pointer"
            >
              {project.title}
            </h3>
            {project.status && (
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-control border shrink-0 uppercase tracking-wider ${
                project.status === 'released' ? 'bg-success/10 border-success/30 text-success' : 
                project.status === 'in_development' ? 'bg-surface-2 border-borderDef text-textSecondary' : 
                'bg-warning/10 border-warning/30 text-warning'
              }`}>
                {project.status === 'released' ? 'Релиз' : project.status === 'in_development' ? 'В разработке' : project.status === 'prototype' ? 'Прототип' : project.status}
              </span>
            )}
          </div>



          {/* Tagline Description */}
          {project.description && (
            <p className="text-caption text-textSecondary leading-relaxed line-clamp-2 mb-3 min-h-[2.5rem]">
              {project.description}
            </p>
          )}

          {/* Jam Trophy Origin (if applicable) */}
          {project.jamName && (
            <div className="mb-3 flex items-center gap-1.5 text-caption font-mono text-celebratory">
              <Trophy className="w-3.5 h-3.5 shrink-0" />
              <span className="font-semibold text-textTertiary">Джем:</span>
              <span className="font-bold truncate max-w-[180px]">"{project.jamName}"</span>
            </div>
          )}

          {/* Genre Tags */}
          {project.genre && (
            <div className="flex items-center gap-1.5 flex-wrap mb-2 h-6 overflow-hidden">
              {(project.genre ? project.genre.split(' ') : []).slice(0, 3).map((tag: string, i: number) => {
                const cleanTag = tag.replace(/^#/, '');
                return (
                  <button
                    key={i}
                    onClick={(e) => {
                      if (onSelectTag) {
                        e.stopPropagation();
                        onSelectTag(cleanTag);
                      }
                    }}
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-control transition-colors ${
                      onSelectTag 
                        ? 'bg-surface-2 hover:bg-surface-3 border border-borderDef hover:border-accent/40 text-textTertiary hover:text-textPrimary cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent' 
                        : 'bg-surface-2 border border-borderDef text-textTertiary cursor-default'
                    }`}
                  >
                    #{cleanTag}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div>
          {/* Social Proof Metrics */}
          <div className="pt-2.5 border-t border-borderDef flex items-center justify-between text-caption text-textTertiary mb-3 font-mono">
            <div className="flex items-center gap-1.5">
              {project.rating !== undefined ? (
                <>
                  <Star className="w-3.5 h-3.5 text-warning fill-warning" />
                  <span className="font-bold text-textPrimary">{project.rating}</span>
                  {project.ratingCount !== undefined && <span className="text-textTertiary">({project.ratingCount})</span>}
                </>
              ) : (
                <div className="w-4 h-4" />
              )}
            </div>

            <div className="flex items-center gap-3">
              {project.views !== undefined && (
                <div className="flex items-center gap-1" title="Просмотров">
                  <Eye className="w-3.5 h-3.5 text-textTertiary" />
                  <span>{project.views}</span>
                </div>
              )}
              {project.downloads !== undefined && (
                <div className="flex items-center gap-1" title="Загрузок">
                  <Download className="w-3.5 h-3.5 text-textTertiary" />
                  <span>{project.downloads}</span>
                </div>
              )}
            </div>
          </div>

          {/* Main Action Bar */}
          <div className="flex items-center gap-2">
            {project.hasWebGL ? (
              <button 
                onClick={() => onQuickPlay && onQuickPlay(project)}
                className="flex-1 h-10 bg-accent hover:bg-accent-hover text-white text-caption font-extrabold rounded-control flex items-center justify-center gap-1.5 transition-colors uppercase tracking-wider shadow-elevation-base cursor-pointer active:scale-[0.98]"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Запустить WebGL</span>
              </button>
            ) : (
              <button 
                onClick={handleNavigate}
                className="flex-1 h-10 bg-surface-2 hover:bg-surface-3 border border-borderDef hover:border-borderStrong text-textPrimary text-caption font-bold rounded-control flex items-center justify-center gap-1.5 transition-colors uppercase tracking-wider active:scale-[0.98]"
              >
                <Download className="w-3.5 h-3.5 text-textTertiary" />
                <span>Скачать ПК</span>
              </button>
            )}


            {/* Context Menu Dropdown Trigger */}
            {onOpenContextMenu && (
              <div className="relative z-dropdown">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenContextMenu(e, project);
                  }}
                  className="w-10 h-10 rounded-control bg-surface-2 border border-borderDef hover:border-borderStrong flex items-center justify-center text-textTertiary hover:text-textPrimary transition-all cursor-pointer active:scale-[0.97]"
                  aria-label="Опции"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                
                {contextMenuOpen && onCloseContextMenu && (
                  <GameCardContextMenu 
                    game={{ id: project.id.toString(), slug: project.slug || project.title.toLowerCase().replace(/\s+/g, '-'), title: project.title }}
                    isOpen={contextMenuOpen}
                    onClose={onCloseContextMenu}
                    onReport={onReport ? () => onReport(project) : undefined}
                    triggerToast={triggerToast}
                    onTransferOwnership={onTransferOwnership ? () => onTransferOwnership(project) : undefined}
                    showTransferOwnership={!!onTransferOwnership}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};


/* --- JAM SUBMISSION CARD ---------------------------------------------------
 * Phase-aware card: InProgress / Voting / Results × all roles.
 * Single source of truth replacing all inline submission renders in JamPage.
 * ------------------------------------------------------------------------ */

export interface JamSubmissionCardProps {
  entry: {
    id: number;
    slug: string;
    title: string;
    author: string;
    authorHandle?: string;
    avatar?: string;
    image?: string;
    platforms: string[];
    has_webgl: boolean;
    genres?: string[];
    overallScore?: number;
    ratingCount?: number;
    rank?: number;
    is_frozen?: boolean;
    is_results_published?: boolean;
    awardBadges?: string[];
    status?: string;
  };
  jamPhase: 'InProgress' | 'Voting' | 'Results';
  role: string;
  isOwnSubmission?: boolean;
  juryStatus?: 'pending' | 'draft' | 'evaluated';
  juryScore?: string | null;
  hideEntriesUntilEnd?: boolean;
  bookmarked?: boolean;
  onNavigate?: (slug: string) => void;
  onQuickPlay?: (entry: any) => void;
  onBookmark?: (entry: any) => void;
  onVote?: (entry: any) => void;
  onReport?: () => void;
  triggerToast?: (message: string, type?: any) => void;
}

export const JamSubmissionCard: React.FC<JamSubmissionCardProps> = ({
  entry,
  jamPhase,
  role,
  isOwnSubmission = false,
  juryStatus = 'pending',
  juryScore = null,
  hideEntriesUntilEnd = false,
  bookmarked = false,
  onNavigate,
  onQuickPlay,
  onBookmark,
  onVote,
  onReport,
  triggerToast,
}) => {
  const navigate = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onNavigate?.(entry.slug);
  };

  const renderTopLeft = (): React.ReactNode => {
    if (jamPhase === 'InProgress') {
      if (hideEntriesUntilEnd && !isOwnSubmission) return null;
      if (isOwnSubmission && hideEntriesUntilEnd) {
        return <MediaBadge variant="neutral" icon={<Lock className="w-3 h-3" />}>Скрыто до дедлайна</MediaBadge>;
      }
      if (isOwnSubmission) {
        return <MediaBadge variant="accent" icon={<Check className="w-3 h-3" />}>Ваш сабмишен</MediaBadge>;
      }
      return <MediaBadge variant="neutral" icon={<Trophy className="w-3 h-3" />}>Сабмишен</MediaBadge>;
    }

    if (jamPhase === 'Voting') {
      if (isOwnSubmission) return <MediaBadge variant="neutral" icon={<Lock className="w-3 h-3" />}>На судействе</MediaBadge>;
      if (juryStatus === 'evaluated') return <MediaBadge variant="success" icon={<CheckCircle2 className="w-3 h-3" />}>Оценено ★{juryScore}</MediaBadge>;
      if (juryStatus === 'draft') return <MediaBadge variant="neutral" icon={<FileText className="w-3 h-3" />}>Черновик</MediaBadge>;
      return <MediaBadge variant="warning" icon={<Clock className="w-3 h-3" />}>Не оценено</MediaBadge>;
    }

    // Results phase
    const rank = entry.rank ?? 999;
    if (rank === 1) return <MediaBadge variant="accent" icon={<Trophy className="w-3 h-3" />}>1 МЕСТО</MediaBadge>;
    if (rank === 2) return <MediaBadge variant="neutral" icon={<Award className="w-3 h-3" />}>2 МЕСТО</MediaBadge>;
    if (rank === 3) return <MediaBadge variant="warning" icon={<Award className="w-3 h-3" />}>3 МЕСТО</MediaBadge>;
    return <MediaBadge variant="neutral">#{rank} в зачёте</MediaBadge>;
  };

  const renderTopRight = (): React.ReactNode => {
    if (jamPhase === 'Results' && entry.overallScore != null) {
      return (
        <span className="bg-surface-1/90 backdrop-blur-md border border-accent/30 shadow-elevation-base text-accent font-mono font-bold text-[11px] px-2.5 py-1 rounded-control flex items-center gap-1 shadow-elevation-overlay">
          <Star className="w-3 h-3 fill-current" />
          {entry.overallScore.toFixed(2)}
        </span>
      );
    }
    return (
      <span className="bg-surface-1/90 backdrop-blur-md border border-borderDef/50 shadow-elevation-base text-textSecondary font-mono font-semibold text-[11px] px-2.5 py-1 rounded-control">
        #SUB-{entry.id}
      </span>
    );
  };

  const renderCTA = (): React.ReactNode => {
    const primary = 'flex-1 h-9 rounded-control text-caption font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-fast active:scale-[0.98] cursor-pointer bg-accent hover:bg-accent-hover text-white shadow-elevation-base';
    const secondary = 'flex-1 h-9 rounded-control text-caption font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-fast active:scale-[0.98] cursor-pointer bg-surface-2 hover:bg-surface-3 border border-borderDef text-textPrimary';

    if (jamPhase === 'InProgress') {
      if (isOwnSubmission) {
        return <button onClick={navigate} className={secondary}><Edit3 className="w-3.5 h-3.5" /><span>Редактировать</span></button>;
      }
      if (entry.has_webgl) {
        return <button onClick={(e) => { e.stopPropagation(); onQuickPlay?.(entry); }} className={primary}><Play className="w-3.5 h-3.5 fill-current" /><span>Запустить WebGL</span></button>;
      }
      return <button onClick={navigate} className={secondary}><Download className="w-3.5 h-3.5" /><span>Скачать</span></button>;
    }

    if (jamPhase === 'Voting') {
      if (isOwnSubmission) {
        return <button onClick={navigate} className={secondary}><Eye className="w-3.5 h-3.5" /><span>Просмотр сабмита</span></button>;
      }
      if (juryStatus === 'evaluated') {
        return <button onClick={(e) => { e.stopPropagation(); onVote?.(entry); }} className={secondary}><Star className="w-3.5 h-3.5" /><span>Изменить оценку</span></button>;
      }
      return (
        <button onClick={(e) => { e.stopPropagation(); onVote?.(entry); }} className={primary}>
          <Star className="w-3.5 h-3.5" />
          <span>{juryStatus === 'draft' ? 'Продолжить оценку' : 'Оценить работу'}</span>
        </button>
      );
    }

    // Results
    if (entry.has_webgl) {
      return <button onClick={(e) => { e.stopPropagation(); onQuickPlay?.(entry); }} className={primary}><Play className="w-3.5 h-3.5 fill-current" /><span>Запустить WebGL</span></button>;
    }
    return <button onClick={navigate} className={secondary}><Download className="w-3.5 h-3.5" /><span>Скачать</span></button>;
  };

  return (
    <article className="group overflow-hidden flex flex-col gap-2 transition-all duration-base hover:-translate-y-0.5 shadow-none hover:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.7)] relative">
      {/* COVER */}
      <div className="aspect-[16/9] bg-surface-0 relative overflow-hidden cursor-pointer rounded-card ring-1 ring-borderDef ring-inset shadow-elevation-base" onClick={navigate}>
        <GameCover 
          src={entry.image} 
          title={entry.title} 
          id={entry.id} 
          developer={entry.author}
          className="w-full h-full"
          imageClassName="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-slow" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

        {/* Top-Left: phase status */}
        <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
          {renderTopLeft()}
        </div>

        {/* Top-Right: id or score */}
        <div className="absolute top-2.5 right-2.5 z-10 pointer-events-none">
          {renderTopRight()}
        </div>

        {/* Bookmark */}
        {onBookmark && (
          <div className="absolute bottom-2.5 right-2.5 z-20">
            <button
              onClick={(e) => { e.stopPropagation(); onBookmark(entry); }}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-[0.97] border-borderDef border ${
                bookmarked 
                  ? 'bg-reaction/90 border-reaction/50 text-white shadow-none' 
                  : 'bg-surface-1/90 hover:bg-surface-1 border-borderDef/50 hover:border-borderStrong text-textSecondary hover:text-textPrimary'
              }`}
              title="В списки"
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        )}

        {/* Bottom-Left: platforms */}
        <PlatformsBadge platforms={entry.platforms} />
      </div>

      {/* BODY */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3
          onClick={navigate}
          className="text-body-sm font-bold text-textPrimary hover:text-accent transition-colors leading-snug line-clamp-1 cursor-pointer tracking-tight"
        >
          {entry.title}
        </h3>

        <div className="flex items-center gap-1.5">
          {entry.avatar && (
            <img src={entry.avatar} className="w-4 h-4 rounded-full bg-surface-2 shrink-0" alt="" />
          )}
          <span className="text-caption text-textTertiary truncate">{entry.author}</span>
        </div>

        {jamPhase === 'Results' && entry.awardBadges && entry.awardBadges.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {(entry.awardBadges || []).slice(0, 3).map((badge: string, i: number) => (
              <span key={i} className="text-[10px] font-mono font-bold bg-celebratory/10 text-celebratory border border-celebratory/30 px-2 py-0.5 rounded-control uppercase tracking-wider flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                <span>{badge}</span>
              </span>
            ))}
          </div>
        ) : entry.genres && entry.genres.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 h-6 overflow-hidden">
            {(entry.genres || []).slice(0, 3).map((g: string, i: number) => (
              <span key={i} className="bg-surface-2 border border-borderDef text-textSecondary text-[11px] font-mono font-medium px-2 py-0.5 rounded-control">
                #{g}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-auto pt-3 border-t border-borderDef flex items-center gap-2">
          {renderCTA()}
          {onReport && (
            <button
              onClick={(e) => { e.stopPropagation(); onReport(); }}
              className="w-9 h-9 rounded-control bg-surface-2 border border-borderDef hover:border-danger/40 text-textTertiary hover:text-danger flex items-center justify-center transition-all shrink-0"
              title="Пожаловаться"
            >
              <Flag className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
