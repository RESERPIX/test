import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Download, MoreVertical, Eye, EyeOff, Trash2, ExternalLink, 
  Lock, Zap, Monitor, Apple, Terminal
} from 'lucide-react';
import Button from './ui/Button';
import { GameCover } from './ui/GameCover';
import { MediaBadge } from './ui/MediaBadge';

export interface LibraryGame {
  id: string | number;
  slug?: string;
  title: string;
  developer: {
    name: string;
    avatarUrl?: string | null;
    slug?: string;
  } | string;
  coverUrl?: string | null;
  version: string;
  updatedAt: string;
  platforms: string[];
  isFree: boolean;
  isOffSale?: boolean;
  isHidden?: boolean;
}

export interface LibraryGameCardProps {
  game: LibraryGame;
  userOS?: 'windows' | 'mac' | 'linux' | 'other';
  downloadsToday?: number;
  isBanned?: boolean;
  isCurrentTabHidden?: boolean;
  onPlay?: (game: LibraryGame) => void;
  onDownload?: (game: LibraryGame, platform: string) => void;
  onHide?: (game: LibraryGame) => void;
  onRestore?: (game: LibraryGame) => void;
  onRequestDeleteFree?: (game: LibraryGame) => void;
  onNavigate?: (slugOrId: string | number) => void;
}

export const LibraryGameCard: React.FC<LibraryGameCardProps> = ({
  game,
  userOS = 'windows',
  downloadsToday = 3,
  isBanned = false,
  isCurrentTabHidden = false,
  onPlay,
  onDownload,
  onHide,
  onRestore,
  onRequestDeleteFree,
  onNavigate
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);

  // Close context menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const devName = typeof game.developer === 'string' ? game.developer : game.developer.name;
  const devAvatar = typeof game.developer === 'string' ? null : game.developer.avatarUrl;

  // Normalize platform flags
  const normalizedPlatforms = game.platforms.map(p => p.toLowerCase());
  const hasWebGL = normalizedPlatforms.some(p => p === 'web' || p === 'webgl');
  const hasWin = normalizedPlatforms.some(p => p === 'win' || p === 'windows');
  const hasMac = normalizedPlatforms.some(p => p === 'mac' || p === 'macos' || p === 'mac_os');
  const hasLin = normalizedPlatforms.some(p => p === 'lin' || p === 'linux');

  const desktopPlatforms: { key: string; label: string; icon: React.ReactNode; ext: string }[] = [];
  if (hasWin) desktopPlatforms.push({ key: 'win', label: 'Windows', icon: <Monitor className="w-3.5 h-3.5" />, ext: '.exe' });
  if (hasMac) desktopPlatforms.push({ key: 'mac', label: 'macOS', icon: <Apple className="w-3.5 h-3.5" />, ext: '.dmg' });
  if (hasLin) desktopPlatforms.push({ key: 'lin', label: 'Linux', icon: <Terminal className="w-3.5 h-3.5" />, ext: '.tar.gz' });

  const hasDesktop = desktopPlatforms.length > 0;
  const isMultiplatform = hasWebGL && hasDesktop;

  // OS Match check
  const osMatches = 
    (userOS === 'windows' && hasWin) ||
    (userOS === 'mac' && hasMac) ||
    (userOS === 'linux' && hasLin);

  const matchedPlatform = desktopPlatforms.find(p => p.key === userOS) || desktopPlatforms[0];
  const isDownloadLimitReached = downloadsToday >= 10;

  // CTA button actions
  const handlePrimaryPlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlay?.(game);
  };

  const handlePrimaryDownload = (e: React.MouseEvent, platformKey: string) => {
    e.stopPropagation();
    if (isDownloadLimitReached) return;
    onDownload?.(game, platformKey);
  };

  const handleTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNavigate?.(game.slug || game.id);
  };

  // Hover Overlay Primary Action
  const getPrimaryAction = () => {
    if (isCurrentTabHidden) {
      return { 
        icon: <Eye className="w-4 h-4" />, 
        label: 'Вернуть',
        onClick: (e: React.MouseEvent) => { e.stopPropagation(); onRestore?.(game); },
        disabled: false
      };
    }
    
    if (hasWebGL) {
      return { 
        icon: <Play className="w-4 h-4 fill-current" />, 
        label: 'Играть',
        onClick: handlePrimaryPlay,
        disabled: false
      };
    }

    if (isDownloadLimitReached) {
      return { 
        icon: <Lock className="w-4 h-4 text-white/50" />, 
        label: 'Лимит',
        onClick: (e: React.MouseEvent) => e.stopPropagation(), 
        disabled: true 
      };
    }

    if (matchedPlatform) {
      return { 
        icon: <Download className="w-4 h-4" />, 
        label: `Скачать`,
        onClick: (e: React.MouseEvent) => handlePrimaryDownload(e, matchedPlatform.key),
        disabled: false
      };
    }

    return null;
  };

  const primaryAction = getPrimaryAction();

  return (
    <article className={`group relative flex flex-col justify-start gap-3 p-1 rounded-2xl transition-all duration-200 font-sans h-full ${isMenuOpen ? 'z-30' : 'z-10'}`}>
      
      {/* 1. MEDIA CONTAINER */}
      <div 
        className="relative shrink-0 w-full rounded-xl ring-1 ring-borderDef ring-inset shadow-sm bg-surface-1"
        style={{ aspectRatio: '16/10' }}
      >
        {/* Cover image wrapper with overflow-hidden for rounded corners & hover zoom */}
        <div 
          className="absolute inset-0 rounded-xl overflow-hidden cursor-pointer"
          onClick={handleTitleClick}
        >
          <GameCover 
            src={game.coverUrl} 
            title={game.title} 
            id={game.id} 
            developer={devName}
            className="w-full h-full"
            imageClassName="w-full h-full object-cover group-hover:scale-110 group-hover:brightness-50 transition-all duration-700 ease-out"
          />

          {/* System Design Hover Overlay */}
          {primaryAction && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center z-20 gap-2 pointer-events-none">
              <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
                <Button 
                  variant="primary" 
                  size="md"
                  icon={primaryAction.icon}
                  onClick={primaryAction.onClick}
                  disabled={primaryAction.disabled}
                  className="shadow-xl shadow-accent/20 min-w-[120px] pointer-events-auto"
                >
                  {primaryAction.label}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Ownership / Off-sale Status Badge (Top-Left) */}
        <div className="absolute top-2 left-2 z-10 pointer-events-none">
          {game.isOffSale ? (
            <MediaBadge variant="warning">Снято с продажи</MediaBadge>
          ) : game.isFree ? (
            <MediaBadge variant="accent">Бесплатно</MediaBadge>
          ) : (
            <MediaBadge variant="success">Куплено</MediaBadge>
          )}
        </div>

        {/* Floating Context Menu Trigger (<MoreVertical/>) */}
        {!isBanned && (
          <div className="absolute top-2 right-2 z-30" ref={menuRef}>
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className={`w-7 h-7 rounded-full bg-surface-1/90 backdrop-blur-md border border-borderDef/50 flex items-center justify-center transition-all shadow-sm text-textSecondary hover:text-textPrimary hover:bg-surface-2 cursor-pointer ${
                isMenuOpen ? 'opacity-100 bg-surface-2 text-textPrimary ring-2 ring-accent' : 'opacity-100 md:opacity-0 md:group-hover:opacity-100'
              }`}
              aria-label="Опции игры"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {/* Context Menu Dropdown */}
            {isMenuOpen && (
              <div className="absolute top-8 right-0 bg-surface-2/95 backdrop-blur-xl border border-borderDef shadow-elevation-overlay rounded-xl p-1.5 w-52 z-50 flex flex-col gap-0.5 text-xs font-medium animate-fadeIn select-none">
                
                {/* 0. Primary Actions (for mobile/touch users) */}
                {hasWebGL && (
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(false);
                      handlePrimaryPlay(e);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-accent/10 text-textPrimary flex items-center justify-between gap-2 transition-colors group/item"
                  >
                    <div className="flex items-center gap-2">
                      <Play className="w-4 h-4 text-accent fill-accent/20 group-hover/item:fill-accent transition-colors" />
                      <span className="font-bold text-sm">Играть</span>
                    </div>
                    <span className="text-[10px] text-textTertiary uppercase font-mono">Web</span>
                  </button>
                )}

                {desktopPlatforms.map(p => (
                  <button
                    key={p.key}
                    type="button"
                    disabled={isDownloadLimitReached}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(false);
                      handlePrimaryDownload(e, p.key);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between gap-2 transition-colors ${
                      isDownloadLimitReached 
                        ? 'opacity-40 cursor-not-allowed text-textDisabled' 
                        : 'hover:bg-surface-3 text-textPrimary group/item'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 flex items-center justify-center text-accent group-hover/item:scale-110 transition-transform">
                        {p.icon}
                      </div>
                      <span className={hasWebGL ? "font-medium text-sm" : "font-bold text-sm"}>
                        Скачать
                      </span>
                    </div>
                    <span className="text-[10px] text-textTertiary uppercase font-mono">{p.label}</span>
                  </button>
                ))}

                {(hasWebGL || desktopPlatforms.length > 0) && (
                  <div className="h-px bg-borderDef/50 my-1" />
                )}

                {/* 1. Hide / Restore */}
                {isCurrentTabHidden ? (
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(false);
                      onRestore?.(game);
                    }} 
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-surface-3 text-textPrimary flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-accent" />
                    <span>Вернуть в библиотеку</span>
                  </button>
                ) : (
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(false);
                      onHide?.(game);
                    }} 
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-surface-3 text-textPrimary flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <EyeOff className="w-3.5 h-3.5 text-textTertiary" />
                    <span>Скрыть из списка</span>
                  </button>
                )}

                {/* 2. Free Game: Delete from library */}
                {game.isFree && (
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(false);
                      onRequestDeleteFree?.(game);
                    }} 
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-danger/10 text-danger flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Удалить из библиотеки</span>
                  </button>
                )}

                <div className="h-px bg-borderDef/50 my-1" />

                {/* 4. Go to game page */}
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
                    onNavigate?.(game.slug || game.id);
                  }} 
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-surface-3 text-textPrimary flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-textTertiary" />
                  <span>На страницу игры</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. CARD CONTENT & METADATA */}
      <div className="flex flex-col gap-1.5 px-0.5">
        
        {/* Title */}
        <h3 
          onClick={handleTitleClick}
          className="text-sm font-bold text-textPrimary leading-tight truncate cursor-pointer hover:text-accent transition-colors"
          title={game.title}
        >
          {game.title}
        </h3>

        {/* Author / Studio */}
        <div className="flex items-center gap-1.5 text-xs text-textSecondary truncate">
          {devAvatar ? (
            <img src={devAvatar} alt={devName} className="w-4 h-4 rounded-full object-cover shrink-0" />
          ) : (
            <div className="w-4 h-4 rounded-full bg-surface-3 text-textTertiary flex items-center justify-center text-[9px] font-bold shrink-0">
              {devName.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="truncate hover:text-textPrimary transition-colors cursor-pointer">{devName}</span>
        </div>

        {/* Build Metadata & Platforms */}
        <div className="flex items-center justify-between text-[11px] text-textTertiary font-medium pt-0.5">
          <span className="truncate">
            Версия: <span className="font-mono text-textSecondary">{game.version}</span> • {game.updatedAt}
          </span>
          
          <div className="flex items-center gap-1 shrink-0 ml-1">
            {hasWebGL && <span title="WebGL (Браузер)"><Zap className="w-3.5 h-3.5 text-accent" /></span>}
            {hasWin && <span title="Windows"><Monitor className="w-3.5 h-3.5 text-textSecondary" /></span>}
            {hasMac && <span title="macOS"><Apple className="w-3.5 h-3.5 text-textSecondary" /></span>}
            {hasLin && <span title="Linux"><Terminal className="w-3.5 h-3.5 text-textSecondary" /></span>}
          </div>
        </div>
      </div>

    </article>
  );
};

export default LibraryGameCard;
