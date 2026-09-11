import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, History, MousePointerClick, Gamepad2, Trophy, Layers, Search as SearchIcon } from 'lucide-react';

const SEARCH_DATABASE = [
  // Игры
  { id: 'g1', title: 'BrokenLore: FOLLOW', sub: 'Sci-Fi Horror • WebGL • Бесплатно', type: 'games', path: '/games/brokenlore-follow' },
  { id: 'g2', title: 'ECHOES OF THE VOID', sub: 'Psychological Horror • 1 299 ₽ • Unity URP', type: 'games', path: '/games/echoes-of-the-void' },
  { id: 'g3', title: 'Neon Horizon: Vector Run', sub: 'Cyberpunk Runner • WASM • 599 ₽', type: 'games', path: '/games/neon-horizon' },
  { id: 'g4', title: 'WHISPERER', sub: 'Mystery Adventure • Prototype • Бесплатно', type: 'games', path: '/games/whisperer' },
  
  // Джемы
  { id: 'j1', title: 'Cyberjam 2026', sub: 'Призовой фонд 150 000 ₽ • Идет судейство', type: 'jams', path: '/jams/cyberjam-2026' },
  { id: 'j2', title: 'Broken Worlds Jam', sub: 'Призовой фонд 80 000 ₽ • Завершён', type: 'jams', path: '/jams/broken-worlds' },
  { id: 'j3', title: 'Indie WebGL Sprint #4', sub: 'Без призового фонда • Предстоящий', type: 'jams', path: '/jams/indie-webgl-sprint' },
  
  // Авторы & Студии
  { id: 'c1', title: "Alexander 'Kael' Vostokov", sub: '@kael_vostokov • Lead Designer • 12 проектов', type: 'creators', path: '/profile' },
  { id: 'c2', title: 'PixelForge Studio', sub: '@pixelforge • Команда • 4 игры', type: 'creators', path: '/profile' },
  { id: 'c3', title: 'VoidSound Audio', sub: '@voidsound • Композитор & Sound Designer', type: 'creators', path: '/profile' },
  
  // Разделы
  { id: 'p1', title: 'Маркет', sub: 'Каталог игр, витрина и WebGL проекты', type: 'pages', path: '/market' },
  { id: 'p2', title: 'Каталог джемов', sub: 'Соревнования, темы и призы', type: 'pages', path: '/jams' },
  { id: 'p3', title: 'Моя библиотека', sub: 'Коллекции, купленные игры и ассеты', type: 'pages', path: '/library' },
  { id: 'p4', title: 'Создать джем', sub: 'Конструктор соревнований', type: 'pages', path: '/jam-creation' },
  { id: 'p5', title: 'О платформе HUBIGR', sub: 'Миссия, экосистема и возможности', type: 'pages', path: '/about' },
  { id: 'p6', title: 'База знаний и гайды', sub: 'Обучение и документация для разработчиков', type: 'pages', path: '/tutorials' },
  { id: 'p7', title: 'Служба поддержки', sub: 'FAQ, контакты и помощь разработчикам', type: 'pages', path: '/support' },
];

const CATEGORIES = [
  { id: 'all', label: 'Все' },
  { id: 'games', label: 'Маркет' },
  { id: 'jams', label: 'Джемы' },
  { id: 'creators', label: 'Авторы' },
  { id: 'pages', label: 'Разделы' },
];

interface SearchCommandPaletteProps {
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const SearchCommandPalette: React.FC<SearchCommandPaletteProps> = ({ onClose, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState<'all' | 'games' | 'jams' | 'creators' | 'pages'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto focus input on mount
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 100);
  }, []);

  const filteredSearchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = SEARCH_DATABASE;
    if (searchCategory !== 'all') {
      list = list.filter(item => item.type === searchCategory);
    }
    if (q) {
      list = list.filter(item => 
        item.title.toLowerCase().includes(q) || 
        item.sub.toLowerCase().includes(q)
      );
    }
    return list;
  }, [searchQuery, searchCategory]);

  const handleResultClick = (path: string) => {
    onNavigate(path);
    onClose();
  };

  return (
    <div className="flex flex-col h-full max-h-[85vh] sm:max-h-[70vh]">
      {/* HEADER: Input & Esc */}
      <div className="flex items-center gap-3 p-3 sm:p-4 border-b border-surface-2 shrink-0 relative">
        <SearchIcon className="w-5 h-5 text-textTertiary absolute left-6 sm:left-7" />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск по играм, джемам, авторам..."
          className="w-full bg-surface-1 border border-borderDef rounded-control py-2.5 pl-10 pr-12 text-sm text-textPrimary placeholder-textTertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all"
        />
        <div className="absolute right-6 sm:right-7 hidden sm:flex items-center justify-center pointer-events-none">
          <kbd className="px-2 py-1 bg-surface-2 border border-borderDef rounded text-[10px] font-mono text-textTertiary uppercase font-semibold">ESC</kbd>
        </div>
      </div>

      {/* CATEGORY TABS */}
      <div className="flex items-center gap-2 px-3 sm:px-4 py-3 border-b border-surface-2 overflow-x-auto no-scrollbar shrink-0">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSearchCategory(cat.id as any)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors active:scale-95 ${
              searchCategory === cat.id 
                ? 'bg-accent text-white' 
                : 'bg-surface-2 text-textSecondary hover:text-textPrimary hover:bg-surface-3'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* SCROLLABLE LIST */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 no-scrollbar space-y-6">
        {!searchQuery ? (
          <>
            <div className="space-y-3">
              <h4 className="text-[10px] uppercase tracking-wider font-bold text-textTertiary px-2">Недавние поиски</h4>
              <div className="flex flex-wrap gap-2 px-2">
                <button type="button" onClick={() => handleResultClick('/games/brokenlore-follow')} className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-2 hover:bg-surface-3 text-textSecondary hover:text-textPrimary rounded-full text-xs font-medium transition-colors">
                  <History className="w-3.5 h-3.5" /> BrokenLore: FOLLOW
                </button>
                <button type="button" onClick={() => handleResultClick('/jams/cyberjam-2026')} className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-2 hover:bg-surface-3 text-textSecondary hover:text-textPrimary rounded-full text-xs font-medium transition-colors">
                  <History className="w-3.5 h-3.5" /> Cyberjam 2026
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-[10px] uppercase tracking-wider font-bold text-textTertiary px-2">Быстрый переход</h4>
              <div className="flex flex-col gap-1">
                <button type="button" onClick={() => handleResultClick('/market')} className="flex items-start gap-4 p-2 rounded-xl hover:bg-surface-2 text-left group transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-surface-3 flex items-center justify-center shrink-0 group-hover:bg-surface-4 transition-colors">
                    <Gamepad2 className="w-5 h-5 text-textSecondary" />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-textPrimary">Маркет</h5>
                    <p className="text-xs text-textTertiary mt-0.5">Все игры, WebGL и инди-проекты</p>
                  </div>
                </button>
                <button type="button" onClick={() => handleResultClick('/jams')} className="flex items-start gap-4 p-2 rounded-xl hover:bg-surface-2 text-left group transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-surface-3 flex items-center justify-center shrink-0 group-hover:bg-surface-4 transition-colors">
                    <Trophy className="w-5 h-5 text-textSecondary" />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-textPrimary">Каталог джемов</h5>
                    <p className="text-xs text-textTertiary mt-0.5">Активные соревнования и призы</p>
                  </div>
                </button>
                <button type="button" onClick={() => handleResultClick('/library')} className="flex items-start gap-4 p-2 rounded-xl hover:bg-surface-2 text-left group transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-surface-3 flex items-center justify-center shrink-0 group-hover:bg-surface-4 transition-colors">
                    <Layers className="w-5 h-5 text-textSecondary" />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-textPrimary">Моя библиотека</h5>
                    <p className="text-xs text-textTertiary mt-0.5">Коллекции и купленные материалы</p>
                  </div>
                </button>
              </div>
            </div>
          </>
        ) : filteredSearchResults.length > 0 ? (
          <div className="flex flex-col gap-1">
            {filteredSearchResults.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleResultClick(item.path)}
                className="flex flex-col items-start text-left p-3 rounded-xl hover:bg-surface-2 transition-colors active:scale-[0.98]"
              >
                <div className="flex items-center gap-2 mb-1">
                  {item.type === 'games' && <Gamepad2 className="w-4 h-4 text-textTertiary" />}
                  {item.type === 'jams' && <Trophy className="w-4 h-4 text-textTertiary" />}
                  {item.type === 'creators' && <SearchIcon className="w-4 h-4 text-textTertiary" />}
                  {item.type === 'pages' && <MousePointerClick className="w-4 h-4 text-textTertiary" />}
                  <span className="text-sm font-semibold text-textPrimary">{item.title}</span>
                </div>
                <span className="text-[11px] text-textTertiary pl-6">{item.sub}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <SearchIcon className="w-10 h-10 text-borderDef mb-3" />
            <h5 className="text-sm font-medium text-textSecondary">Ничего не найдено</h5>
            <p className="text-xs text-textTertiary mt-1">Попробуйте изменить запрос или категорию</p>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="hidden sm:flex items-center justify-between text-[11px] text-textTertiary font-mono px-4 py-3 bg-surface-2 shrink-0 border-t border-borderDef rounded-b-lg">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-surface-3 rounded">↑</kbd> <kbd className="px-1.5 py-0.5 bg-surface-3 rounded">↓</kbd> Навигация</span>
          <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-surface-3 rounded">↵</kbd> Выбрать</span>
        </div>
        <span>HUBIGR Global Search</span>
      </div>
    </div>
  );
};
