import React, { useState, useEffect, useRef, useMemo } from 'react';
import Drawer from './ui/Drawer';
import { Modal } from './ui/Modal';
import { SearchCommandPalette } from './SearchCommandPalette';
import DevMatrixPanel from './DevMatrixPanel';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from './ui/ThemeProvider';
import { ToastProvider } from './ui/Toast';
import { 
  Search, Bell, LayoutGrid, User, Shield, LogOut, Settings, 
  Trophy, Users, CheckCircle2, AlertTriangle, AlertOctagon, ShieldAlert, ShieldCheck,
  Info, X, ChevronDown, Command, Sparkles, ShoppingBag, 
  Gamepad2, MessageSquare, Layers, LayoutDashboard, Clock,
  ArrowRight, HelpCircle, Heart, Globe, Trash2, Check, CornerDownLeft,
  Sun, Moon, Laptop, LogIn, MoreHorizontal, Compass, Newspaper, BarChart2, Receipt, Bug
} from 'lucide-react';

import { AppRouter } from '../AppRouter';

const PageLoadingFallback = () => (
  <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-4 animate-fadeIn">
    <div className="w-10 h-10 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
    <span className="text-xs font-mono uppercase tracking-widest text-textTertiary">Загрузка модуля HUBIGR...</span>
  </div>
);

const FontStyles = () => (
  <style dangerouslySetInnerHTML={{__html: `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
    
    body {
      font-family: 'Inter', sans-serif;
      background-color: rgb(var(--color-surface-0));
      color: rgb(var(--color-text-primary));
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    
    .font-mono { font-family: 'JetBrains Mono', monospace; }
    
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    
    /* Focus-visible handled per-element with Tailwind classes */

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.98) translateY(-4px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }

    .animate-fadeIn { animation: fadeIn 180ms cubic-bezier(0, 0, 0.2, 1) forwards; }
  ` }} />
);

const NAV_LINKS = [
  { label: 'Игры', path: '/market', icon: Gamepad2, placeholder: false },
  { label: 'Команды', path: '/teams', icon: Users, placeholder: false },
  { label: 'Джемы', path: '/jams', icon: Trophy, placeholder: false },
  { label: 'Девлоги', path: '/devlogs', icon: Layers, placeholder: false, desc: 'Публичные дневники и новости о разработке инди-проектов.' },
  { label: 'Сообщество', path: '/community', icon: MessageSquare, placeholder: false, desc: 'Обсуждения, темы, гайды и поиск союзников и проектов.' },
];

const ABOUT_DROPDOWN_ITEMS = [
  { label: 'О платформе', path: '/about', desc: 'Миссия платформы HUBIGR и экосистема', icon: Globe },
  { label: 'Как участвовать', path: '/how-to-participate', desc: 'Правила участия в джемах и публикация игр', icon: HelpCircle },
  { label: 'Поддержка проекта', path: '/support', desc: 'Помощь разработчикам и партнерство', icon: Heart },
];

const MOCK_NOTIFICATIONS = [
  {
    id: 'n-sec-1',
    type: 'security',
    icon: ShieldAlert,
    title: 'Новый вход в аккаунт (SC-ACC-053)',
    text: 'Зафиксирован вход с нового устройства: Chrome 124 / macOS (IP 178.62.204.18, Франкфурт). Если это были не вы, немедленно завершите сеанс.',
    time: '2 мин назад',
    unread: true,
    link: '/settings?tab=sessions',
    actionLabel: 'Проверить сеансы',
  },
  {
    id: 'n-game-1',
    type: 'games',
    icon: Gamepad2,
    title: 'Cyber Quest 2077: Патч v1.2.4 (SC-ACC-027)',
    text: 'Вышел свежий хотфикс: исправлены утечки памяти в WebGL и обновлена таблица лидеров джема.',
    time: '20 мин назад',
    unread: true,
    link: '/game/1',
    actionLabel: 'Патчноут игры',
  },
  {
    id: 'n0',
    type: 'system',
    icon: ShieldAlert,
    title: 'Модерация: Ваша заявка отклонена',
    text: 'Ваш проект "BrokenLore" дисквалифицирован с Cyberjam 2026 за нарушение п.4.1. Нажмите для подачи апелляции.',
    time: '45 мин назад',
    unread: true,
    link: '/jams/broken-worlds-jam/broken-lore?appeal=true',
    actionLabel: 'Подать апелляцию',
  },
  {
    id: 'n1',
    type: 'community',
    icon: MessageSquare,
    title: 'Ответ в обсуждении',
    text: 'Пользователь @alex_code ответил в вашей теме "Поиск 3D Artist в команду Cyberjam"',
    time: '1 час назад',
    unread: true,
    link: '/community/thread/42'
  },
  {
    id: 'n-game-2',
    type: 'games',
    icon: Gamepad2,
    title: 'Neon Odyssey: Дневник разработки (SC-ACC-027)',
    text: 'Разработчик опубликовал тизер нового сюжетного акта и систем крафта.',
    time: '2 часа назад',
    unread: false,
    link: '/game/1',
  },
  {
    id: 'n2',
    type: 'jams',
    icon: Trophy,
    title: 'Этап голосования открыт!',
    text: 'Cyberjam 2026 перешел в фазу оценки работ. У вас есть 7 дней для голосования.',
    time: '4 часа назад',
    unread: false,
    link: '/jams/cyberjam-2026'
  },
  {
    id: 'n-sec-2',
    type: 'security',
    icon: ShieldCheck,
    title: 'Двухфакторная защита активна (2FA)',
    text: 'Резервные коды сохранены. Обязательные системные оповещения безопасности включены (BR-ACC-066).',
    time: 'Вчера',
    unread: false,
    link: '/settings?tab=security',
  },
  {
    id: 'n3',
    type: 'system',
    icon: Sparkles,
    title: 'Сборка v1.2.4 проверена',
    text: 'Ваш WebGL билд BrokenLore успешно прошел проверку ClamAV антивируса.',
    time: 'Вчера',
    unread: false,
    link: '/creator-dashboard'
  }
];


const AvatarFallback = ({ src, alt, className = "" }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div className={`bg-surface-2 flex items-center justify-center text-textTertiary border border-borderDef ${className}`}>
        <User className="w-1/2 h-1/2" />
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      onError={() => setHasError(true)} 
      className={className} 
    />
  );
};


function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(false);
  React.useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);
  return matches;
}

export default function App({ currentPath: externalPath, onNavigate }: { currentPath?: string, onNavigate?: (path: string) => void }) {
  const { openAuthModal } = useAuth();
  const [authState, setAuthState] = useState('creator'); // 'guest' | 'creator' | 'admin'
  const { theme, setTheme } = useTheme();

  const getInitialPath = () => {
    const hash = window.location.hash.replace(/^#/, '');
    return hash && hash.startsWith('/') ? hash : '/';
  };
  const [internalPath, setInternalPath] = useState(getInitialPath);
  const currentPath = externalPath || internalPath;

  const setCurrentPath = React.useCallback((path: string) => {
    window.location.hash = `#${path}`;
    setInternalPath(path);
    if (onNavigate) onNavigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [onNavigate]);
  const [unreadCount, setUnreadCount] = useState(4);
  const [reportsQueueCount] = useState(7);

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isNotifPopoverOpen, setIsNotifPopoverOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isAboutMenuOpen, setIsAboutMenuOpen] = useState(false);
  const [isMobileSecondaryMenuOpen, setIsMobileSecondaryMenuOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 640px)');


  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [notifFilter, setNotifFilter] = useState('all');
  const [toast, setToast] = useState(null);

  const profileMenuRef = useRef(null);
  const notifMenuRef = useRef(null);
  const aboutMenuRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    window.__hubigrNavigate = (path: string) => {
      console.log('__hubigrNavigate called with:', path);
      window.location.hash = `#${path}`;
      setCurrentPath(path);
      setInternalPath(path);
    };

    const handleHashChange = () => {
      console.log('hashchange event fired, hash:', window.location.hash);
      const hash = window.location.hash.replace(/^#/, '');
      if (hash && hash.startsWith('/')) {
        console.log('Setting internal path to:', hash);
        setInternalPath(hash);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('hashchange', handleHashChange);

    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchModalOpen(false);
        setIsNotifPopoverOpen(false);
        setIsProfileMenuOpen(false);
        setIsAboutMenuOpen(false);
        setIsMobileSecondaryMenuOpen(false);
      }
    };

    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setIsProfileMenuOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target)) {
        setIsNotifPopoverOpen(false);
      }
      if (aboutMenuRef.current && !aboutMenuRef.current.contains(e.target)) {
        setIsAboutMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const showToastNotification = React.useCallback((text: string, type: string = 'info') => {
    setToast({ text, type } as any);
    setTimeout(() => setToast(null), 3200);
  }, []);

  const handleLogout = () => {
    setAuthState('guest');
    setIsProfileMenuOpen(false);
    showToastNotification('Вы успешно вышли из системы', 'success');
  };

  const handleReadAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    setUnreadCount(0);
    showToastNotification('Все уведомления прочитаны', 'success');
  };

  const handleDeleteNotification = (id, e) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
    showToastNotification('Уведомление удалено');
  };

  const handleMarkAsRead = (id, e) => {
    e.stopPropagation();
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const activeNavItem = useMemo(() => {
    const mainNav = NAV_LINKS.find(link => link.path === currentPath);
    if (mainNav) return mainNav;
    const aboutNav = ABOUT_DROPDOWN_ITEMS.find(item => item.path === currentPath);
    if (aboutNav) return { label: aboutNav.label, path: aboutNav.path, icon: aboutNav.icon, placeholder: true, desc: aboutNav.desc };
    return null;
  }, [currentPath]);

  const isAboutActive = ABOUT_DROPDOWN_ITEMS.some(item => item.path === currentPath);

  const filteredNotifications = useMemo(() => {
    if (notifFilter === 'unread') return notifications.filter(n => n.unread);
    if (notifFilter === 'security') return notifications.filter(n => n.type === 'security');
    if (notifFilter === 'games') return notifications.filter(n => n.type === 'games');
    if (notifFilter === 'community') return notifications.filter(n => n.type === 'community');
    if (notifFilter === 'jams') return notifications.filter(n => n.type === 'jams');
    return notifications;
  }, [notifications, notifFilter]);

  return (
    <div className="min-h-screen bg-surface-0 text-textPrimary font-sans relative selection:bg-accent/20">
      <FontStyles />

      {/* HEADER: COMPACT ON MOBILE (h-14), REGULAR ON DESKTOP (h-16) */}
      <header className="sticky top-0 z-20 h-14 md:h-16 bg-surface-0/95 backdrop-blur-md border-b border-borderDef select-none">
        <div className="max-w-[1440px] h-full mx-auto px-3.5 sm:px-4 md:px-8 flex items-center justify-between gap-3 sm:gap-4">
          
          {/* BRAND & DESKTOP MAIN NAVIGATION */}
          <div className="flex items-center gap-6 lg:gap-8 h-full">
            <button 
              type="button"
              onClick={() => setCurrentPath('/')}
              className="flex items-center gap-2 sm:gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0 rounded-control shrink-0 touch-manipulation active:scale-95 transition-transform"
              title="HUBIGR — На главную"
            >
              {/* Desktop Full Logo */}
              <img src="/logo-white.svg" alt="HUBIGR" className="hidden sm:block h-6 sm:h-7 w-auto dark:hidden transition-transform group-hover:scale-105" />
              <img src="/logo-black.svg" alt="HUBIGR" className="hidden dark:sm:block h-6 sm:h-7 w-auto transition-transform group-hover:scale-105" />
              
              {/* Mobile Icon Only */}
              <img src="/icon-white.svg" alt="HUBIGR" className="sm:hidden h-6 sm:h-7 w-auto dark:hidden transition-transform group-hover:scale-105" />
              <img src="/icon-black.svg" alt="HUBIGR" className="hidden dark:block sm:dark:hidden h-6 sm:h-7 w-auto transition-transform group-hover:scale-105" />
            </button>

            {/* DESKTOP NAV LINKS (HIDDEN ON MOBILE, HANDLED BY BOTTOM BAR) */}
            <nav className="hidden md:flex items-center gap-1 sm:gap-2 h-full">
              {NAV_LINKS.map((link) => {
                const isActive = currentPath === link.path;
                return (
                  <button
                    key={link.path}
                    type="button"
                    onClick={() => setCurrentPath(link.path)}
                    className={`px-3 h-full relative font-semibold text-sm transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0 rounded-control ${
                      isActive ? 'text-textPrimary' : 'text-textTertiary hover:text-textPrimary'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent animate-fadeIn" />
                    )}
                  </button>
                );
              })}

              {/* ABOUT DROPDOWN MENU */}
              <div className="relative h-full flex items-center" ref={aboutMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsAboutMenuOpen(!isAboutMenuOpen)}
                  aria-expanded={isAboutMenuOpen}
                  className={`px-3 h-full relative font-semibold text-sm transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0 rounded-control ${
                    isAboutActive || isAboutMenuOpen ? 'text-textPrimary' : 'text-textTertiary hover:text-textPrimary'
                  }`}
                >
                  <span>О проекте</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-textTertiary transition-transform duration-base ${isAboutMenuOpen ? 'rotate-180 text-accent' : ''}`} />
                  {isAboutActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent animate-fadeIn" />
                  )}
                </button>

                {isAboutMenuOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-surface-2/95 backdrop-blur-xl border border-borderDef shadow-elevation-overlay rounded-xl p-1.5 z-dropdown animate-fadeIn select-none">
                    {ABOUT_DROPDOWN_ITEMS.map((item) => {
                      const ItemIcon = item.icon;
                      const isItemActive = currentPath === item.path;
                      return (
                        <button
                          key={item.path}
                          type="button"
                          onClick={() => {
                            setCurrentPath(item.path);
                            setIsAboutMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg flex items-start gap-2.5 transition-all duration-120 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                            isItemActive ? 'bg-accent/15 text-accent font-semibold' : 'text-textSecondary hover:bg-surface-3 hover:text-textPrimary'
                          }`}
                        >
                          <ItemIcon className={`w-4 h-4 shrink-0 mt-0.5 ${isItemActive ? 'text-accent' : 'text-textTertiary'}`} />
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold leading-tight">{item.label}</span>
                            <span className="text-[11px] text-textTertiary mt-0.5 leading-snug">{item.desc}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* DESKTOP SEARCH BAR */}
          <div className="hidden md:flex flex-1 max-w-[320px] lg:max-w-[380px]">
            <button 
              type="button"
              onClick={() => setIsSearchModalOpen(true)}
              className="w-full bg-surface-2 hover:bg-surface-3 border border-borderDef h-9 px-3 rounded-control flex items-center justify-between text-xs text-textTertiary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0 group"
            >
              <div className="flex items-center gap-2 truncate">
                <Search className="w-3.5 h-3.5 text-textSecondary group-hover:text-textPrimary transition-colors" />
                <span className="truncate">Поиск игр, джемов, авторов...</span>
              </div>
              <kbd className="font-mono text-[10px] text-textTertiary bg-surface-3 border border-borderDef px-1.5 py-0.5 rounded-control shrink-0">
                Cmd+K
              </kbd>
            </button>
          </div>

          {/* ACTIONS: MOBILE QUICK ACTIONS + DESKTOP FULL ACTIONS */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* MOBILE QUICK SEARCH BUTTON */}
            <button 
              type="button"
              onClick={() => setIsSearchModalOpen(true)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-control bg-surface-2 hover:bg-surface-3 active:scale-95 text-textTertiary hover:text-textPrimary transition-all touch-manipulation"
              aria-label="Глобальный поиск"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* MOBILE NOTIFICATIONS BUTTON (AUTHENTICATED ONLY) */}
            {authState !== 'guest' && (
              <button 
                type="button"
                onClick={() => setIsNotifPopoverOpen(!isNotifPopoverOpen)}
                className="md:hidden relative w-9 h-9 flex items-center justify-center rounded-control bg-surface-2 hover:bg-surface-3 active:scale-95 text-textTertiary hover:text-textPrimary transition-all touch-manipulation"
                aria-label="Центр уведомлений"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-danger text-white text-[9px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}

            {/* MOBILE SECONDARY MENU BUTTON («···» MORE) */}
            <button 
              type="button"
              onClick={() => setIsMobileSecondaryMenuOpen(true)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-control bg-surface-2 hover:bg-surface-3 active:scale-95 text-textTertiary hover:text-textPrimary transition-all touch-manipulation"
              aria-label="Дополнительное меню"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {/* DESKTOP GUEST ACTIONS */}
            {authState === 'guest' && (
              <div className="hidden md:flex items-center gap-2">
                <button 
                  type="button"
                  onClick={() => openAuthModal('LOGIN')}
                  className="text-xs font-semibold h-9 px-3 rounded-control text-textSecondary hover:text-textPrimary hover:bg-surface-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0 cursor-pointer"
                >
                  Войти
                </button>
                <button 
                  type="button"
                  onClick={() => openAuthModal('REGISTER')}
                  className="text-xs font-bold h-9 px-3.5 rounded-control bg-accent hover:bg-accent-hover text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0 cursor-pointer"
                >
                  Регистрация
                </button>
              </div>
            )}

            {/* DESKTOP AUTHENTICATED ACTIONS */}
            {authState !== 'guest' && (
              <div className="hidden md:flex items-center gap-2">
                
                {authState === 'admin' && (
                  <button 
                    type="button"
                    onClick={() => { setCurrentPath('/admin/users'); showToastNotification('Очередь модерации'); }}
                    className="h-9 px-2.5 bg-danger/10 hover:bg-danger/20 border border-danger/30 text-danger rounded-control flex items-center gap-2 text-xs font-mono font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0"
                    title="Очередь модерации"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span className="hidden lg:inline">Модерация</span>
                    <span className="bg-danger text-white text-[10px] px-1.5 py-0.2 rounded font-sans font-bold">
                      {reportsQueueCount}
                    </span>
                  </button>
                )}

                <button 
                  type="button"
                  onClick={() => { setCurrentPath('/library'); showToastNotification('Библиотека'); }}
                  className={`p-2 rounded-control border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0 ${
                    currentPath === '/library' 
                      ? 'bg-surface-3 border-accent text-accent' 
                      : 'bg-surface-2 hover:bg-surface-3 border-borderDef text-textTertiary hover:text-textPrimary'
                  }`}
                  aria-label="Библиотека"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>

                {/* THEME TOGGLE */}
                <button
                  type="button"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark')}
                  className="p-2 rounded-control border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0 bg-surface-2 hover:bg-surface-3 border-borderDef text-textTertiary hover:text-textPrimary"
                  aria-label="Переключить тему"
                >
                  {theme === 'dark' ? <Moon className="w-4 h-4" /> : theme === 'light' ? <Sun className="w-4 h-4" /> : <Laptop className="w-4 h-4" />}
                </button>

                {/* NOTIFICATION CENTER POPOVER */}
                <div className="relative" ref={notifMenuRef}>
                  <button 
                    type="button"
                    onClick={() => setIsNotifPopoverOpen(!isNotifPopoverOpen)}
                    aria-expanded={isNotifPopoverOpen}
                    aria-label="Центр уведомлений"
                    className={`p-2 rounded-control border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0 relative ${
                      isNotifPopoverOpen
                        ? 'bg-surface-3 border-accent text-accent'
                        : 'bg-surface-2 hover:bg-surface-3 border-borderDef text-textTertiary hover:text-textPrimary'
                    }`}
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-danger text-textPrimary text-[10px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {isNotifPopoverOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface-1 border border-borderDef rounded-modal shadow-elevation-overlay z-30 animate-fadeIn overflow-hidden">
                      
                      <div className="p-3.5 border-b border-surface-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="w-4 h-4 text-accent" />
                          <h3 className="text-xs font-bold text-textPrimary uppercase tracking-wider">Уведомления</h3>
                        </div>
                        {unreadCount > 0 && (
                          <button 
                            type="button"
                            onClick={handleReadAllNotifications}
                            className="text-[11px] font-mono text-textTertiary hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded"
                          >
                            Прочитать все
                          </button>
                        )}
                      </div>

                      <div className="px-3 py-2 bg-surface-0 border-b border-surface-2 flex gap-1.5 text-xs overflow-x-auto no-scrollbar">
                        {[
                          { id: 'all', label: 'Все' },
                          { id: 'unread', label: 'Непрочитанные' },
                          { id: 'security', label: 'Безопасность' },
                          { id: 'games', label: 'Игры' },
                          { id: 'community', label: 'Сообщество' },
                          { id: 'jams', label: 'Джемы' }
                        ].map(tab => (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => setNotifFilter(tab.id)}
                            className={`px-2.5 py-1 rounded-md font-semibold text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent ${
                              notifFilter === tab.id ? 'bg-surface-2 text-accent' : 'text-textTertiary hover:text-textPrimary'
                            }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>

                      <div className="max-h-[320px] overflow-y-auto no-scrollbar divide-y divide-surface-2">
                        {filteredNotifications.length > 0 ? (
                          filteredNotifications.map(item => (
                            <div 
                              key={item.id}
                              onClick={() => {
                                if (item.link) setCurrentPath(item.link);
                                setIsNotifPopoverOpen(false);
                              }}
                              className={`p-3.5 transition-colors cursor-pointer relative group flex items-start gap-3 hover:bg-surface-2 ${
                                item.unread ? 'bg-surface-1' : ''
                              }`}
                            >
                              <div className="p-2 rounded-lg bg-surface-2 text-accent shrink-0 mt-0.5">
                                <item.icon className="w-4 h-4" />
                              </div>

                              <div className="flex-1 min-w-0 pr-6">
                                <div className="flex items-center justify-between gap-2">
                                  <h4 className="text-xs font-semibold text-textPrimary truncate">{item.title}</h4>
                                  <span className="text-[10px] font-mono text-textTertiary shrink-0">{item.time}</span>
                                </div>
                                <p className="text-[11px] text-textSecondary leading-relaxed mt-1 line-clamp-2">{item.text}</p>
                                {/* @ts-ignore */}
                                {item.actionLabel && (
                                  <button className="mt-2 text-[10px] font-bold text-accent bg-accent/10 border border-accent/20 px-2 py-1 rounded transition-colors hover:bg-accent hover:text-white uppercase tracking-wider">
                                    {/* @ts-ignore */}
                                    {item.actionLabel}
                                  </button>
                                )}
                              </div>

                              <div className="absolute right-2 top-3.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                {item.unread && (
                                  <button
                                    type="button"
                                    onClick={(e) => handleMarkAsRead(item.id, e)}
                                    className="p-1 text-textTertiary hover:text-success transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-success rounded"
                                    title="Прочитано"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={(e) => handleDeleteNotification(item.id, e)}
                                  className="p-1 text-textTertiary hover:text-danger transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-danger rounded"
                                  title="Удалить"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="py-8 text-center text-textTertiary text-xs">
                            Нет уведомлений в этой категории
                          </div>
                        )}
                      </div>

                      {/* ФУТЕР ЦЕНТРА УВЕДОМЛЕНИЙ (FE-ACC-011) */}
                      <div className="p-2.5 bg-surface-0 border-t border-surface-2 flex items-center justify-between text-xs">
                        <span className="text-[10px] text-textTertiary font-mono">
                          Обязательные алерты (BR-ACC-066)
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentPath('/settings?tab=notifications');
                            setIsNotifPopoverOpen(false);
                          }}
                          className="text-[11px] text-accent hover:underline font-bold flex items-center gap-1 cursor-pointer"
                        >
                          Все настройки уведомлений →
                        </button>
                      </div>

                    </div>
                  )}
                </div>

                {/* USER PROFILE DROPDOWN */}
                <div className="relative" ref={profileMenuRef}>
                  <button 
                    type="button"
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    aria-expanded={isProfileMenuOpen}
                    aria-label="Профиль"
                    className="p-0.5 rounded-full border border-borderDef hover:border-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0"
                  >
                    <AvatarFallback 
                      src="https://api.dicebear.com/7.x/pixel-art/svg?seed=NocturnalDevs" 
                      alt="User" 
                      className="w-7 h-7 rounded-full" 
                    />
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-surface-2/95 backdrop-blur-xl border border-borderDef shadow-elevation-overlay rounded-xl p-1.5 z-dropdown animate-fadeIn text-xs select-none">
                      <div 
                        onClick={() => { setCurrentPath('/users/kael_vostokov'); setIsProfileMenuOpen(false); }}
                        className="px-3 py-2.5 rounded-lg border-b border-borderDef/60 space-y-0.5 cursor-pointer hover:bg-surface-3 transition-colors mb-1"
                      >
                        <div className="font-bold text-textPrimary text-sm">NocturnalDevs</div>
                        <div className="text-[11px] text-textTertiary font-mono">@nocturnal_dev &bull; Перейти в профиль &rarr;</div>
                      </div>

                      <div className="space-y-0.5 border-b border-borderDef/60 pb-1 mb-1">
                        <button 
                          type="button"
                          onClick={() => { setCurrentPath('/users/kael_vostokov'); setIsProfileMenuOpen(false); }}
                          className="w-full text-left px-3 py-2 rounded-lg text-textSecondary hover:bg-surface-3 hover:text-textPrimary flex items-center gap-2.5 transition-all duration-120 font-medium cursor-pointer"
                        >
                          <User className="w-3.5 h-3.5 text-accent" />
                          <span>Мой профиль (@kael_vostokov)</span>
                        </button>
                        <button 
                          type="button"
                          onClick={() => { setCurrentPath('/my-teams'); setIsProfileMenuOpen(false); }}
                          className="w-full text-left px-3 py-2 rounded-lg text-textSecondary hover:bg-surface-3 hover:text-textPrimary flex items-center gap-2.5 transition-all duration-120 font-medium cursor-pointer"
                        >
                          <Users className="w-3.5 h-3.5 text-accent" />
                          <span>Мои команды</span>
                        </button>
                        <button 
                          type="button"
                          onClick={() => { setCurrentPath('/teams/nocturnal-devs'); setIsProfileMenuOpen(false); }}
                          className="w-full text-left px-3 py-2 rounded-lg text-textSecondary hover:bg-surface-3 hover:text-textPrimary flex items-center gap-2.5 transition-all duration-120 font-medium cursor-pointer"
                        >
                          <Users className="w-3.5 h-3.5 text-textTertiary" />
                          <span>Профиль студии / команды</span>
                        </button>
                        <button 
                          type="button"
                          onClick={() => { setCurrentPath('/library'); setIsProfileMenuOpen(false); }}
                          className="w-full text-left px-3 py-2 rounded-lg text-textSecondary hover:bg-surface-3 hover:text-textPrimary flex items-center gap-2.5 transition-all duration-120 cursor-pointer"
                        >
                          <LayoutGrid className="w-3.5 h-3.5 text-textTertiary" />
                          <span>Моя библиотека</span>
                        </button>

                        <button 
                          type="button"
                          onClick={() => { setCurrentPath('/purchases'); setIsProfileMenuOpen(false); }}
                          className="w-full text-left px-3 py-2 rounded-lg text-textSecondary hover:bg-surface-3 hover:text-textPrimary flex items-center gap-2.5 transition-all duration-120 cursor-pointer"
                        >
                          <Receipt className="w-3.5 h-3.5 text-textTertiary" />
                          <span>История покупок</span>
                        </button>

                        <button 
                          type="button"
                          onClick={() => { setCurrentPath('/me/bugs'); setIsProfileMenuOpen(false); }}
                          className="w-full text-left px-3 py-2 rounded-lg text-textSecondary hover:bg-surface-3 hover:text-textPrimary flex items-center gap-2.5 transition-all duration-120 cursor-pointer"
                        >
                          <Bug className="w-3.5 h-3.5 text-textTertiary" />
                          <span>Мои баг-репорты</span>
                        </button>

                        <button 
                          type="button"
                          onClick={() => { setCurrentPath('/creator-dashboard'); setIsProfileMenuOpen(false); }}
                          className="w-full text-left px-3 py-2 rounded-lg text-textSecondary hover:bg-surface-3 hover:text-textPrimary flex items-center gap-2.5 transition-all duration-120 cursor-pointer"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5 text-textTertiary" />
                          <span>Кабинет автора</span>
                        </button>
                      </div>

                      <div>
                        <button 
                          type="button"
                          onClick={handleLogout}
                          className="w-full text-left px-3 py-2 rounded-lg text-danger hover:bg-danger/10 flex items-center gap-2.5 transition-all duration-120 font-semibold cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Выйти</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>

        </div>
      </header>

      
      {/* =========================================================================
          MOBILE NOTIFICATIONS TOP DROPDOWN (ОТКРЫВАЕТСЯ СВЕРХУ ПОД ШАПКОЙ)
          ========================================================================= */}
      {isNotifPopoverOpen && (
        <div className="md:hidden fixed inset-0 z-drawer animate-fadeIn pointer-events-none">
          {/* Затемнение фона */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs pointer-events-auto" 
            onClick={() => setIsNotifPopoverOpen(false)} 
            aria-hidden="true" 
          />

          {/* Панель уведомлений сверху под хэдером */}
          <div className="relative z-10 mx-2.5 sm:mx-4 mt-[58px] sm:mt-[66px] max-w-[480px] sm:max-w-[420px] ml-auto max-h-[calc(100vh-80px)] bg-surface-1 border border-borderDef rounded-card shadow-elevation-overlay flex flex-col overflow-hidden text-textPrimary pointer-events-auto animate-fadeIn">

            {/* Header */}
            <div className="px-5 py-3.5 border-b border-borderDef flex items-center justify-between bg-surface-1 shrink-0">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-accent" />
                <h3 className="text-sm font-bold text-textPrimary uppercase tracking-wider">Уведомления</h3>
                {unreadCount > 0 && (
                  <span className="bg-danger/20 text-danger border border-danger/30 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full">
                    +{unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button 
                    type="button"
                    onClick={handleReadAllNotifications}
                    className="text-xs font-mono text-accent hover:underline transition-colors px-2 py-1 cursor-pointer"
                  >
                    Прочитать все
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsNotifPopoverOpen(false)}
                  className="w-8 h-8 rounded-control bg-surface-2 hover:bg-surface-3 flex items-center justify-center text-textTertiary hover:text-textPrimary transition-colors cursor-pointer"
                  aria-label="Закрыть уведомления"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="px-4 py-2.5 bg-surface-0 border-b border-surface-2 flex gap-1.5 text-xs overflow-x-auto no-scrollbar shrink-0">
              {[
                { id: 'all', label: 'Все' },
                { id: 'unread', label: 'Непрочитанные' },
                { id: 'security', label: 'Безопасность' },
                { id: 'games', label: 'Игры' },
                { id: 'community', label: 'Сообщество' },
                { id: 'jams', label: 'Джемы' }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setNotifFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-control font-semibold text-xs transition-colors cursor-pointer whitespace-nowrap ${
                    notifFilter === tab.id ? 'bg-accent text-white font-bold shadow-sm' : 'bg-surface-2 text-textTertiary hover:text-textPrimary'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-surface-2/60 p-2">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map(item => (
                  <div 
                    key={item.id}
                    onClick={() => {
                      if (item.link) setCurrentPath(item.link);
                      setIsNotifPopoverOpen(false);
                    }}
                    className={`p-3.5 rounded-xl transition-colors cursor-pointer relative group flex items-start gap-3 hover:bg-surface-2 active:bg-surface-3 ${
                      item.unread ? 'bg-surface-2/50' : ''
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-surface-2 text-accent shrink-0 mt-0.5">
                      <item.icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0 pr-12">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-semibold text-textPrimary truncate">{item.title}</h4>
                        <span className="text-[10px] font-mono text-textTertiary shrink-0">{item.time}</span>
                      </div>
                      <p className="text-xs text-textSecondary leading-relaxed mt-1 line-clamp-2">{item.text}</p>
                      {/* @ts-ignore */}
                      {item.actionLabel && (
                        <button className="mt-2.5 text-[10px] font-bold text-accent bg-accent/10 border border-accent/20 px-3 py-1.5 rounded transition-colors hover:bg-accent hover:text-white uppercase tracking-wider block">
                          {/* @ts-ignore */}
                          {item.actionLabel}
                        </button>
                      )}
                    </div>

                    <div className="absolute right-2 top-3.5 flex items-center gap-1">
                      {item.unread && (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleMarkAsRead(item.id, e); }}
                          className="min-w-[32px] min-h-[32px] flex items-center justify-center p-1.5 text-textTertiary hover:text-success transition-colors rounded-control bg-surface-2"
                          title="Прочитано"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleDeleteNotification(item.id, e); }}
                        className="min-w-[32px] min-h-[32px] flex items-center justify-center p-1.5 text-textTertiary hover:text-danger transition-colors rounded-control bg-surface-2"
                        title="Удалить"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-textTertiary text-xs flex flex-col items-center justify-center">
                  <Bell className="w-6 h-6 text-textDisabled mb-2 opacity-50" />
                  <span>Нет уведомлений в этой категории</span>
                </div>
              )}
            </div>

            {/* ФУТЕР ЦЕНТРА УВЕДОМЛЕНИЙ (FE-ACC-011) */}
            <div className="p-3 bg-surface-0 border-t border-surface-2 flex items-center justify-between text-xs shrink-0">
              <span className="text-[10px] text-textTertiary font-mono">
                Обязательные алерты (BR-ACC-066)
              </span>
              <button
                type="button"
                onClick={() => {
                  setCurrentPath('/settings?tab=notifications');
                  setIsNotifPopoverOpen(false);
                }}
                className="text-xs text-accent hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                Все настройки уведомлений →
              </button>
            </div>

          </div>
        </div>
      )}

{/* =========================================================================
          MOBILE SECONDARY MENU BOTTOM SHEET (ОТКРЫВАЕТСЯ ПО ТАПУ НА «···»)
          ========================================================================= */}
      {isMobileSecondaryMenuOpen && (
      <Drawer 
        isOpen={isMobileSecondaryMenuOpen} 
        onClose={() => setIsMobileSecondaryMenuOpen(false)} 
        title="HUBIGR Меню"
        icon={<div className="w-6 h-6 bg-accent rounded-control flex items-center justify-center text-white font-mono font-bold text-xs">H</div>}
      >
        <div className="space-y-4">
              
              {/* Secondary Navigation Group */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-textTertiary uppercase tracking-wider px-2 block">
                  Разделы и информация
                </span>
                <div className="bg-surface-2 border border-borderDef rounded-xl overflow-hidden divide-y divide-borderDef/60">
                  <button
                    type="button"
                    onClick={() => { setCurrentPath('/about'); setIsMobileSecondaryMenuOpen(false); }}
                    className="w-full min-h-11 px-3.5 py-2.5 text-left flex items-center justify-between text-textPrimary hover:bg-surface-3 active:bg-surface-3 transition-colors touch-manipulation"
                  >
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-4 h-4 text-accent" />
                      <span className="text-sm font-medium">О проекте HUBIGR</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-textTertiary -rotate-90" />
                  </button>

                  <button
                    type="button"
                    onClick={() => { setCurrentPath('/how-to-participate'); setIsMobileSecondaryMenuOpen(false); }}
                    className="w-full min-h-11 px-3.5 py-2.5 text-left flex items-center justify-between text-textPrimary hover:bg-surface-3 active:bg-surface-3 transition-colors touch-manipulation"
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle className="w-4 h-4 text-accent" />
                      <span className="text-sm font-medium">Как участвовать в джемах</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-textTertiary -rotate-90" />
                  </button>

                  <button
                    type="button"
                    onClick={() => { setCurrentPath('/support'); setIsMobileSecondaryMenuOpen(false); }}
                    className="w-full min-h-11 px-3.5 py-2.5 text-left flex items-center justify-between text-textPrimary hover:bg-surface-3 active:bg-surface-3 transition-colors touch-manipulation"
                  >
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-4 h-4 text-accent" />
                      <span className="text-sm font-medium">Поддержка и помощь</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-textTertiary -rotate-90" />
                  </button>

                  <button
                    type="button"
                    onClick={() => { setCurrentPath('/assets-market'); setIsMobileSecondaryMenuOpen(false); }}
                    className="w-full min-h-11 px-3.5 py-2.5 text-left flex items-center justify-between text-textPrimary hover:bg-surface-3 active:bg-surface-3 transition-colors touch-manipulation"
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="w-4 h-4 text-textTertiary" />
                      <span className="text-sm font-medium">Маркет ассетов</span>
                    </div>
                    <span className="text-[10px] font-mono text-textTertiary bg-surface-3 px-2 py-0.5 rounded">В разработке</span>
                  </button>
                </div>
              </div>

              {/* Theme Selector Section */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-textTertiary uppercase tracking-wider px-2 block">
                  Тема оформления
                </span>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-surface-2 border border-borderDef rounded-xl">
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`min-h-10 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all touch-manipulation active:scale-95 ${
                      theme === 'light'
                        ? 'bg-surface-1 text-accent font-bold shadow-sm'
                        : 'text-textTertiary hover:text-textPrimary'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5" />
                    <span>Светлая</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`min-h-10 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all touch-manipulation active:scale-95 ${
                      theme === 'dark'
                        ? 'bg-surface-1 text-accent font-bold shadow-sm'
                        : 'text-textTertiary hover:text-textPrimary'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span>Тёмная</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('system')}
                    className={`min-h-10 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all touch-manipulation active:scale-95 ${
                      theme === 'system'
                        ? 'bg-surface-1 text-accent font-bold shadow-sm'
                        : 'text-textTertiary hover:text-textPrimary'
                    }`}
                  >
                    <Laptop className="w-3.5 h-3.5" />
                    <span>Авто</span>
                  </button>
                </div>
              </div>

              {/* User Account / Auth Actions */}
              {authState === 'guest' ? (
                <div className="pt-2 space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileSecondaryMenuOpen(false);
                      openAuthModal('LOGIN');
                    }}
                    className="w-full min-h-11 bg-surface-2 hover:bg-surface-3 active:scale-98 text-textPrimary font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 border border-borderDef touch-manipulation"
                  >
                    <LogIn className="w-4 h-4 text-accent" />
                    <span>Войти в аккаунт</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileSecondaryMenuOpen(false);
                      openAuthModal('REGISTER');
                    }}
                    className="w-full min-h-11 bg-accent hover:bg-accent-hover active:scale-98 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 touch-manipulation"
                  >
                    <span>Зарегистрироваться</span>
                  </button>
                </div>
              ) : (
                <div className="pt-2 space-y-2">
                  <div className="p-3 bg-surface-2 border border-borderDef rounded-xl flex items-center gap-3">
                    <AvatarFallback 
                      src="https://api.dicebear.com/7.x/pixel-art/svg?seed=NocturnalDevs" 
                      alt="User" 
                      className="w-10 h-10 rounded-full shrink-0" 
                    />
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="font-bold text-sm text-textPrimary truncate">NocturnalDevs</span>
                      <span className="text-xs text-textTertiary font-mono">@nocturnal_dev</span>
                    </div>
                  </div>

                  <div className="bg-surface-2 border border-borderDef rounded-xl overflow-hidden divide-y divide-borderDef/60">
                    <button
                      type="button"
                      onClick={() => { setCurrentPath('/creator-dashboard'); setIsMobileSecondaryMenuOpen(false); }}
                      className="w-full min-h-11 px-3.5 py-2.5 text-left flex items-center justify-between text-textPrimary hover:bg-surface-3 active:bg-surface-3 transition-colors touch-manipulation"
                    >
                      <div className="flex items-center gap-3">
                        <LayoutDashboard className="w-4 h-4 text-accent" />
                        <span className="text-sm font-medium">Кабинет автора</span>
                      </div>
                      <ChevronDown className="w-4 h-4 text-textTertiary -rotate-90" />
                    </button>

                    {authState === 'admin' && (
                      <button
                        type="button"
                        onClick={() => { setCurrentPath('/admin/users'); setIsMobileSecondaryMenuOpen(false); }}
                        className="w-full min-h-11 px-3.5 py-2.5 text-left flex items-center justify-between text-danger hover:bg-danger/10 active:bg-danger/10 transition-colors touch-manipulation"
                      >
                        <div className="flex items-center gap-3">
                          <Shield className="w-4 h-4" />
                          <span className="text-sm font-medium">Очередь модерации</span>
                        </div>
                        <span className="bg-danger text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                          {reportsQueueCount}
                        </span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => { handleLogout(); setIsMobileSecondaryMenuOpen(false); }}
                      className="w-full min-h-11 px-3.5 py-2.5 text-left flex items-center gap-3 text-danger hover:bg-danger/10 active:bg-danger/10 transition-colors touch-manipulation font-semibold"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Выйти из аккаунта</span>
                    </button>
                  </div>
                </div>
              )}
        </div>
      </Drawer>
      )}

      {/* =========================================================================
          MOBILE BOTTOM APP BAR (4 СЛОТА: ИГРЫ / ДЖЕМЫ / БИБЛИОТЕКА / ПРОФИЛЬ-ВОЙТИ)
          ========================================================================= */}
      <nav 
        aria-label="Основная мобильная навигация" 
        className="md:hidden fixed bottom-0 left-0 right-0 z-backdrop bg-surface-1/90 backdrop-blur-2xl border-t border-borderDef/60 safe-area-pb shadow-elevation-overlay select-none"
      >
        <div className="grid grid-cols-4 h-16 max-w-lg mx-auto">
          
          {/* TAB 1: 🎮 МАРКЕТ */}
          {(() => {
            const isMarketActive = currentPath === '/market' || currentPath === '/games' || currentPath.startsWith('/games/');
            return (
              <button
                type="button"
                onClick={() => setCurrentPath('/market')}
                className={`flex flex-col items-center justify-center gap-1 transition-all touch-manipulation active:scale-95 ${
                  isMarketActive ? 'text-accent' : 'text-textTertiary hover:text-textPrimary'
                }`}
              >
                <div className="relative flex items-center justify-center">
                  <Gamepad2 className={`w-6 h-6 transition-all duration-300 ${
                    isMarketActive ? 'stroke-[2.5] scale-110 -translate-y-0.5 drop-shadow-[0_0_8px_rgba(124,58,237,0.5)]' : 'stroke-[1.75]'
                  }`} />
                </div>
                <span className={`text-[10px] tracking-wide transition-all ${
                  isMarketActive ? 'font-bold' : 'font-medium'
                }`}>Маркет</span>
              </button>
            );
          })()}

          {/* TAB 2: 🏆 ДЖЕМЫ */}
          {(() => {
            const isJamsActive = currentPath === '/jams' || currentPath.startsWith('/jams/');
            return (
              <button
                type="button"
                onClick={() => setCurrentPath('/jams')}
                className={`flex flex-col items-center justify-center gap-1 transition-all touch-manipulation active:scale-95 ${
                  isJamsActive ? 'text-accent' : 'text-textTertiary hover:text-textPrimary'
                }`}
              >
                <div className="relative flex items-center justify-center">
                  <Trophy className={`w-6 h-6 transition-all duration-300 ${
                    isJamsActive ? 'stroke-[2.5] scale-110 -translate-y-0.5 drop-shadow-[0_0_8px_rgba(124,58,237,0.5)]' : 'stroke-[1.75]'
                  }`} />
                </div>
                <span className={`text-[10px] tracking-wide transition-all ${
                  isJamsActive ? 'font-bold' : 'font-medium'
                }`}>Джемы</span>
              </button>
            );
          })()}

          {/* TAB 3: 📚 БИБЛИОТЕКА */}
          {(() => {
            const isLibraryActive = currentPath === '/library';
            return (
              <button
                type="button"
                onClick={() => setCurrentPath('/library')}
                className={`flex flex-col items-center justify-center gap-1 transition-all touch-manipulation active:scale-95 ${
                  isLibraryActive ? 'text-accent' : 'text-textTertiary hover:text-textPrimary'
                }`}
              >
                <div className="relative flex items-center justify-center">
                  <LayoutGrid className={`w-6 h-6 transition-all duration-300 ${
                    isLibraryActive ? 'stroke-[2.5] scale-110 -translate-y-0.5 drop-shadow-[0_0_8px_rgba(124,58,237,0.5)]' : 'stroke-[1.75]'
                  }`} />
                </div>
                <span className={`text-[10px] tracking-wide transition-all ${
                  isLibraryActive ? 'font-bold' : 'font-medium'
                }`}>Библиотека</span>
              </button>
            );
          })()}

          {/* TAB 4: 4-Й СЛОТ (ГОСТЬ: «ВОЙТИ» vs АВТОРИЗОВАН: «ПРОФИЛЬ») */}
          {(() => {
            if (authState === 'guest') {
              return (
                <button
                  type="button"
                  onClick={() => openAuthModal('LOGIN')}
                  className="flex flex-col items-center justify-center gap-1 transition-all touch-manipulation active:scale-95 text-textTertiary hover:text-textPrimary"
                >
                  <div className="relative flex items-center justify-center">
                    <LogIn className="w-6 h-6 stroke-[1.75]" />
                  </div>
                  <span className="text-[10px] font-medium tracking-wide">Войти</span>
                </button>
              );
            }

            const isProfileActive = currentPath === '/profile' || currentPath.startsWith('/users/') || currentPath.startsWith('/teams/');
            return (
              <button
                type="button"
                onClick={() => setCurrentPath('/profile')}
                className={`flex flex-col items-center justify-center gap-1 transition-all touch-manipulation active:scale-95 ${
                  isProfileActive ? 'text-accent' : 'text-textTertiary hover:text-textPrimary'
                }`}
              >
                <div className="relative flex items-center justify-center">
                  <div className={`w-6 h-6 rounded-full overflow-hidden transition-all duration-300 ${
                    isProfileActive 
                      ? 'ring-2 ring-accent ring-offset-2 ring-offset-surface-1 shadow-[0_0_8px_rgba(124,58,237,0.5)] scale-110 -translate-y-0.5' 
                      : 'border-[1.5px] border-borderDef opacity-80'
                  }`}>
                    <AvatarFallback 
                      src="https://api.dicebear.com/7.x/pixel-art/svg?seed=NocturnalDevs" 
                      alt="User" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </div>
                <span className={`text-[10px] tracking-wide transition-all ${
                  isProfileActive ? 'font-bold' : 'font-medium'
                }`}>Профиль</span>
              </button>
            );
          })()}

        </div>
      </nav>

      {}
      {isSearchModalOpen && (
        isDesktop ? (
          <div className="fixed inset-0 z-modal flex justify-center pt-16 px-4 animate-fadeIn">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity" 
              onClick={() => setIsSearchModalOpen(false)} 
            />
            {/* Command Palette Container */}
            <div className="relative w-full max-w-[620px] bg-surface-1 border border-borderDef rounded-modal shadow-elevation-overlay overflow-hidden h-fit">
              <SearchCommandPalette onClose={() => setIsSearchModalOpen(false)} onNavigate={(path) => window.__hubigrNavigate(path)} />
            </div>
          </div>
        ) : (
          <Drawer
            isOpen={isSearchModalOpen}
            onClose={() => setIsSearchModalOpen(false)}
            title="Глобальный поиск"
            icon={<Search className="w-5 h-5 text-textSecondary" />}
          >
            <SearchCommandPalette onClose={() => setIsSearchModalOpen(false)} onNavigate={(path) => window.__hubigrNavigate(path)} />
          </Drawer>
        )
      )}
      {/* MAIN ROUTER CONTAINER IMMEDIATELY AFTER TOP NAVIGATION BAR */}
      <ToastProvider>
        <main className="w-full pb-24 md:pb-12">
          <React.Suspense fallback={<PageLoadingFallback />}>
            <AppRouter
              currentPath={currentPath}
              authState={authState}
              setAuthState={setAuthState}
              setCurrentPath={setCurrentPath}
              activeNavItem={activeNavItem}
              showToastNotification={showToastNotification}
              NAV_LINKS={NAV_LINKS}
              ABOUT_DROPDOWN_ITEMS={ABOUT_DROPDOWN_ITEMS}
            />
          </React.Suspense>
        </main>
      </ToastProvider>

      {}
      {toast && (
        <div className="fixed bottom-6 left-6 z-dropdown bg-surface-1 border border-borderDef text-textPrimary px-4 py-3 rounded-xl flex items-center gap-3 shadow-elevation-overlay animate-fadeIn max-w-[320px]">
          <Info className="w-4 h-4 text-accent shrink-0" />
          <span className="text-xs font-medium">{toast.text}</span>
        </div>
      )}

    </div>
  );
}
