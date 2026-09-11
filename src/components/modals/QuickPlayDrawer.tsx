import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Play, RotateCcw, Maximize2, MousePointer, Bookmark, Heart, Star, 
  Flag, ExternalLink, Trophy, AlertTriangle, Download, ShieldAlert, Send, Gamepad2, ChevronDown, ChevronUp
} from 'lucide-react';

export interface QuickPlayGame {
  id?: string;
  title: string;
  author?: { name?: string; nick?: string; avatar?: string; id?: string } | string;
  cover_url?: string;
  cover?: string;
  slug?: string;
  latest_version?: string;
  version?: string;
  jamName?: string;
  jam_title?: string;
  controls?: string;
  build_size_mb?: number;
  ratingAvg?: string | number;
  ratingCount?: string | number;
  download_url?: string;
}

export interface QuickPlayDrawerProps {
  isOpen: boolean;
  game: QuickPlayGame | null;
  onClose: () => void;
  onOpenCollectionModal?: (game: QuickPlayGame) => void;
  onOpenDonationDrawer?: (game: QuickPlayGame) => void;
  onOpenReportModal?: (game: QuickPlayGame) => void;
  triggerToast?: (message: string, type?: any) => void;
}

export const QuickPlayDrawer: React.FC<QuickPlayDrawerProps> = ({
  isOpen,
  game,
  onClose,
  onOpenCollectionModal,
  onOpenDonationDrawer,
  onOpenReportModal,
  triggerToast
}) => {
  const [playerState, setPlayerState] = useState<'splash' | 'loading' | 'active' | 'error' | 'context_lost'>('splash');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeSrc, setIframeSrc] = useState<string>('about:blank');
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userReviewText, setUserReviewText] = useState('');
  const [isMobileWarningDismissed, setIsMobileWarningDismissed] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent));

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
    } else {
      document.body.style.overflow = '';
      document.body.style.height = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, [isOpen]);

  const handleCleanClose = () => {
    setIframeSrc('about:blank');
    if (iframeRef.current) {
      iframeRef.current.src = 'about:blank';
    }
    setPlayerState('splash');
    setLoadingProgress(0);
    onClose();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        } else {
          handleCleanClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    let interval: any;
    if (playerState === 'loading') {
      setLoadingProgress(0);
      interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setPlayerState('active');
            setIframeSrc('https://html5.gamedistribution.com/rvvAScbd/8a4eb4dd2a7e44a796e6761ed4aa4ce9/index.html');
            return 100;
          }
          return prev + 10;
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [playerState]);

  if (!isOpen || !game) return null;

  const authorName = typeof game.author === 'object' ? (game.author?.name || game.author?.nick) : (game.author || 'Hubigr Dev');
  const authorAvatar = typeof game.author === 'object' ? game.author?.avatar : null;
  const authorId = typeof game.author === 'object' ? game.author?.id : 'author-1';
  const coverUrl = game.cover_url || game.cover || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200';
  const versionTag = game.latest_version || game.version || 'v1.0.2';
  const jamTitle = game.jam_title || game.jamName;
  const gameSlug = game.slug || 'brokenlore-follow';
  const buildSize = game.build_size_mb || 45;
  const controlsText = game.controls || 'WASD — движение, Пробел — прыжок, ЛКМ — действие/атака, Esc — пауза';
  const ratingVal = game.ratingAvg || '4.8';

  const handleStartPlay = () => setPlayerState('loading');
  const handleRestart = () => {
    setPlayerState('loading');
    if (triggerToast) triggerToast('Перезапуск WebGL сессии...', 'info');
  };

  const handlePointerLock = () => {
    if (iframeRef.current) {
      try {
        iframeRef.current.focus();
        iframeRef.current.contentWindow?.focus();
        if (triggerToast) triggerToast('Фокус и мышь перехвачены Canvas', 'success');
      } catch (e) {
        console.warn('Pointer lock focus error:', e);
      }
    }
  };

  const handleToggleFullscreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
      } else {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userRating === 0) {
      if (triggerToast) triggerToast('Пожалуйста, выберите оценку от 1 до 5 звезд', 'warning');
      return;
    }
    if (triggerToast) triggerToast('Ваша оценка и отзыв успешно сохранены!', 'success');
    setIsReviewOpen(false);
  };

  return (
    <div 
      className="fixed inset-0 z-modal flex justify-end animate-fadeIn select-none font-sans" 
      style={{ isolation: 'isolate' }}
    >
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity"
        onClick={handleCleanClose} 
      />

      {/* Geometry fixed: max-w-[1000px] ensures it fits 1080p height (1000px width -> 562px height 16:9 video) */}
      <div 
        ref={containerRef}
        className={`relative w-full ${isFullscreen ? 'max-w-full h-full' : 'max-w-[1000px] h-full'} bg-surface-0 flex flex-col z-10 shadow-elevation-overlay transition-all duration-300 overflow-y-auto no-scrollbar`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER: Clean, borderless, typography-driven hierarchy */}
        <header className="h-[72px] px-6 flex items-center justify-between shrink-0 sticky top-0 z-30 font-sans bg-surface-0/95 backdrop-blur">
          
          <div className="flex items-center gap-4 min-w-0">
            <h3 className="text-lg md:text-xl font-bold text-textPrimary truncate max-w-[300px] md:max-w-[400px] tracking-tight">
              {game.title}
            </h3>

            <div className="hidden sm:flex items-center gap-3">
              <a 
                href={`#/users/${authorId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-textTertiary hover:text-textPrimary transition-colors group"
              >
                {authorAvatar && (
                  <img src={authorAvatar} alt={authorName} className="w-6 h-6 rounded-full object-cover shrink-0 grayscale group-hover:grayscale-0 transition-all" />
                )}
                <span className="font-medium truncate max-w-[120px]">{authorName}</span>
              </a>

              <span className="text-[11px] font-mono font-medium text-textTertiary bg-surface-2 px-2 py-1 rounded shrink-0">
                {versionTag}
              </span>

              {jamTitle && (
                <span className="text-[11px] font-mono font-bold text-accent flex items-center gap-1.5 shrink-0">
                  <Trophy className="w-3.5 h-3.5" /> {jamTitle}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <a
              href={`#/games/${gameSlug}`}
              onClick={handleCleanClose}
              className="text-xs font-semibold text-textSecondary hover:text-accent flex items-center gap-1.5 px-3 py-2 rounded-control transition-colors"
            >
              На страницу игры
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              type="button"
              onClick={handleCleanClose}
              className="p-2 text-textTertiary hover:text-textPrimary hover:bg-surface-2 rounded-control transition-colors cursor-pointer ml-2"
              title="Закрыть (Esc)"
              aria-label="Закрыть"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </header>

        {isMobile && !isMobileWarningDismissed && (
          <div className="bg-warning text-black px-6 py-3 flex items-center justify-between gap-3 text-sm shrink-0">
            <div className="flex items-center gap-2 font-semibold">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>Для игры потребуется физическая клавиатура и мышь.</span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button 
                onClick={() => setIsMobileWarningDismissed(true)} 
                className="font-bold underline cursor-pointer"
              >
                Продолжить
              </button>
            </div>
          </div>
        )}

        {/* WEBGL PLAYER ZONE (Ratio strictly 16:9) */}
        <section className="relative w-full aspect-video bg-black shrink-0 flex items-center justify-center overflow-hidden">
          
          {/* State 1: Clean Premium Splash Screen */}
          {playerState === 'splash' && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center animate-fadeIn group">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                style={{ backgroundImage: `url(${coverUrl})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />

              <div className="relative z-10 flex flex-col items-center gap-6 mt-12">
                <button
                  type="button"
                  onClick={handleStartPlay}
                  className="w-20 h-20 bg-accent hover:bg-accent-hover text-white rounded-full flex items-center justify-center shadow-[0_0_35px_rgba(139,92,246,0.4)] hover:shadow-[0_0_50px_rgba(236,72,153,0.6)] transition-all cursor-pointer group/btn"
                >
                  <Play className="w-10 h-10 fill-current translate-x-1 group-hover/btn:scale-110 transition-transform" />
                </button>
                <div className="text-center">
                  <h4 className="text-textPrimary font-bold text-lg mb-1 tracking-wide">ЗАПУСТИТЬ WEBGL</h4>
                  <p className="text-xs text-textSecondary font-mono opacity-80">
                    Сборка: {buildSize} МБ &bull; WebGL 2.0
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* State 2: Loading (Clean, no boxes) */}
          {playerState === 'loading' && (
            <div className="absolute inset-0 z-10 bg-surface-0 flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
              <h4 className="text-xs font-bold text-textSecondary font-mono uppercase tracking-widest mb-6">
                Загрузка ассетов
              </h4>
              
              <div className="w-full max-w-sm h-1 bg-surface-2 rounded-full overflow-hidden mb-4">
                <div 
                  className="h-full bg-accent transition-all duration-200" 
                  style={{ width: `${loadingProgress}%` }} 
                />
              </div>

              <span className="text-sm text-textPrimary font-mono mb-8 font-bold">
                {loadingProgress}% <span className="text-textTertiary font-normal ml-2">({Math.round((loadingProgress / 100) * buildSize)} / {buildSize} МБ)</span>
              </span>

              <button
                type="button"
                onClick={() => setPlayerState('splash')}
                className="text-textTertiary hover:text-textPrimary text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
              >
                Отменить
              </button>
            </div>
          )}

          {/* State 3: Active Iframe */}
          {playerState === 'active' && (
            <iframe
              ref={iframeRef}
              src={iframeSrc}
              title={game.title}
              className="w-full h-full border-none z-10 bg-black"
              sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms"
              allow="fullscreen; autoplay; gamepad; acceleration; gyroscope"
            />
          )}

          {/* Edge Cases */}
          {playerState === 'error' && (
            <div className="absolute inset-0 z-10 bg-surface-0 flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
              <AlertTriangle className="w-10 h-10 text-danger mb-4" />
              <h4 className="text-base font-bold text-textPrimary font-mono uppercase mb-2">Ошибка загрузки файла</h4>
              <p className="text-sm text-textSecondary mb-8 max-w-md">Файл index.html сборки недоступен на сервере.</p>
              {game.download_url && (
                <a href={game.download_url} download className="text-accent hover:text-accent-hover font-bold font-mono text-xs uppercase underline underline-offset-4">Скачать Desktop-версию</a>
              )}
            </div>
          )}

          {playerState === 'context_lost' && (
            <div className="absolute inset-0 z-10 bg-surface-0 flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
              <ShieldAlert className="w-10 h-10 text-warning mb-4" />
              <h4 className="text-base font-bold text-textPrimary font-mono uppercase mb-2">Сбой видеодрайвера</h4>
              <p className="text-sm text-textSecondary mb-8">Браузер сбросил графический контекст WebGL.</p>
              <button onClick={handleRestart} className="text-accent hover:text-accent-hover font-bold font-mono text-xs uppercase underline underline-offset-4 cursor-pointer">Перезапустить плеер</button>
            </div>
          )}
        </section>

        {/* TOOLBAR: Ghost Buttons, High Contrast */}
        <div className="h-[48px] bg-black border-t border-borderDef px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={handlePointerLock}
              disabled={playerState !== 'active'}
              className="group flex items-center gap-2 text-xs font-mono font-medium text-textTertiary hover:text-accent disabled:opacity-30 disabled:hover:text-textTertiary transition-colors cursor-pointer"
            >
              <MousePointer className="w-4 h-4 group-hover:fill-accent/20 transition-all" />
              <span>Захват мыши</span>
            </button>
            
            <button
              type="button"
              onClick={() => setIsControlsOpen(!isControlsOpen)}
              className={`flex items-center gap-2 text-xs font-mono font-medium transition-colors cursor-pointer ${
                isControlsOpen ? 'text-accent' : 'text-textTertiary hover:text-textPrimary'
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Управление</span>
            </button>

            <button
              type="button"
              onClick={handleRestart}
              disabled={playerState === 'splash'}
              className="flex items-center gap-2 text-xs font-mono font-medium text-textTertiary hover:text-textPrimary disabled:opacity-30 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Рестарт</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="flex items-center gap-2 text-xs font-mono font-medium text-textTertiary hover:text-textPrimary transition-colors cursor-pointer"
          >
            <span>На весь экран</span>
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* CONTROLS OVERLAY (Expands directly under the toolbar for maximum convenience) */}
        <div className={`bg-surface-0 border-b border-borderDef/30 transition-all duration-300 overflow-hidden ${isControlsOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 border-none'}`}>
          <div className="p-6 sm:px-8">
            <h5 className="text-xs font-mono font-bold text-textTertiary uppercase tracking-wider mb-4">Раскладка управления</h5>
            
            {/* Smart parsed control chips */}
            {controlsText && (
              <div className="flex flex-wrap gap-3 items-center">
                {controlsText.split(/[,;]\s*/).map((part, index) => {
                  const match = part.match(/^(.+?)\s*[—:-]\s*(.+)$/);
                  if (match) {
                    const [, key, action] = match;
                    return (
                      <div key={index} className="flex items-center gap-2 bg-surface-1 border border-borderDef/50 px-3 py-1.5 rounded-control text-sm shadow-sm">
                        <kbd className="font-mono font-extrabold text-accent bg-surface-2 px-2 py-0.5 rounded text-xs border border-borderDef/50 shadow-inner">{key.trim()}</kbd>
                        <span className="text-textPrimary text-xs font-medium">{action.trim()}</span>
                      </div>
                    );
                  }
                  return (
                    <span key={index} className="text-xs font-mono text-textSecondary bg-surface-1 border border-borderDef/50 px-3 py-1.5 rounded-control shadow-sm">
                      {part}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* QUICK ACTIONS & INFO (Structured Hierarchy) */}
        <div className="p-6 sm:p-8 flex-1 flex flex-col gap-6 bg-surface-1">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            
            <div className="flex flex-wrap items-center gap-4">
              {/* Primary Action */}
              <button
                type="button"
                onClick={() => onOpenCollectionModal && onOpenCollectionModal(game)}
                className="px-5 py-3 bg-accent hover:bg-accent-hover text-white font-extrabold text-sm rounded-control flex items-center gap-2 transition-colors cursor-pointer shadow-[0_4px_14px_rgba(124,58,237,0.2)]"
              >
                <Bookmark className="w-4 h-4 fill-current" />
                <span>В КОЛЛЕКЦИЮ</span>
              </button>

              {/* Secondary Action (Review) */}
              <button
                type="button"
                onClick={() => setIsReviewOpen(!isReviewOpen)}
                className="px-4 py-3 border border-borderStrong hover:border-accent text-textPrimary hover:text-accent font-semibold text-sm rounded-control flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Star className="w-4 h-4" />
                <span>Оценить (★ {ratingVal})</span>
              </button>

              {/* Tertiary Action (Donate) - Text Link */}
              <button
                type="button"
                onClick={() => onOpenDonationDrawer && onOpenDonationDrawer(game)}
                className="px-2 py-3 text-sm font-medium text-textSecondary hover:text-textPrimary flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Heart className="w-4 h-4 text-danger opacity-80" />
                <span>Поддержать</span>
              </button>
            </div>

            {/* Quaternary Action (Report) - Quiet Icon Link */}
            <button
              type="button"
              onClick={() => onOpenReportModal && onOpenReportModal(game)}
              className="text-xs text-textTertiary hover:text-danger flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              title="Пожаловаться на контент"
            >
              <Flag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Пожаловаться</span>
            </button>
          </div>

          {/* Premium Inline Review Form */}
          {isReviewOpen && (
            <form onSubmit={handleReviewSubmit} className="animate-fadeIn border-t border-borderDef/30 pt-5 mt-1 flex flex-col gap-4">
              
              {/* Star Rating Row */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-textTertiary uppercase tracking-widest">
                  {userRating === 0 ? 'Выберите оценку' : `${userRating} из 5 звёзд`}
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      onClick={() => setUserRating(star)}
                      className={`w-8 h-8 cursor-pointer transition-all duration-150 active:scale-90 ${
                        star <= userRating
                          ? 'text-accent fill-accent'
                          : 'text-surface-3 hover:text-textTertiary'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Textarea */}
              <textarea
                value={userReviewText}
                onChange={e => setUserReviewText(e.target.value)}
                placeholder="Опишите свои впечатления — это увидят авторы игры..."
                rows={3}
                className="w-full bg-surface-0 border border-borderDef/40 hover:border-borderDef focus:border-accent text-sm text-textPrimary px-4 py-3 rounded-card outline-none resize-none placeholder:text-textDisabled transition-colors"
              />

              {/* Submit Row */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-textTertiary font-mono">Отзыв будет опубликован публично</span>
                <button
                  type="submit"
                  className="px-5 py-2 bg-accent hover:bg-accent-hover text-white font-extrabold text-xs uppercase tracking-wider rounded-control flex items-center gap-2 cursor-pointer transition-colors active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" /> Отправить
                </button>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickPlayDrawer;
