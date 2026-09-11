import React, { useState, useEffect, useRef } from 'react';
import { Play, ShoppingCart, Download, Heart, Trophy, Zap, Sparkles, ChevronRight } from 'lucide-react';
import Button from './ui/Button';
import { MediaBadge } from './ui/MediaBadge';
import { PlatformIcon } from './GameCard';

import caveblazersImg from '../../images/Caveblazers.png';
import echoesOfEldriaImg from '../../images/EchoesOfEldria.png';
import frostfallImg from '../../images/FROSTFALL.png';
import paperlightImg from '../../images/PAPERLIGHT.png';
import tinysparkImg from '../../images/TINYSPARK.png';

const FEATURED_GAMES = [
  {
    id: "f-eldria",
    title: "Echoes of Eldria",
    pitch: "Отправьтесь в грандиозное путешествие по цветущему королевству Эльдрия. Раскройте древние тайны парящих замков и станьте героем эпической сюжетной RPG.",
    statusBadge: "Флагманский релиз",
    statusIcon: Sparkles,
    tags: ["RPG", "Открытый мир", "Фэнтези"],
    platforms: ["windows", "mac"],
    mediaUrl: echoesOfEldriaImg,
    thumbUrl: echoesOfEldriaImg,
    isVideo: false,
    price: 699,
    isWebGL: false,
    userState: "guest"
  },
  {
    id: "f-frostfall",
    title: "Frostfall: Verses of the Last Sun",
    pitch: "Мрачный постапокалиптический экшен в ледяной пустоши. Зажгите угасшее солнце древней цивилизации и бросьте вызов титанам вечной мерзлоты.",
    statusBadge: "Хит продаж",
    statusIcon: Zap,
    tags: ["Экшен", "Соулслайк", "Постапокалипсис"],
    platforms: ["windows", "linux"],
    mediaUrl: frostfallImg,
    thumbUrl: frostfallImg,
    isVideo: false,
    price: 449,
    isWebGL: false,
    userState: "owned"
  },
  {
    id: "f-paperlight",
    title: "Paperlight: A Small Light in a Folded World",
    pitch: "Трогательный пазл-платформер в мире из живого оригами. Проведите крошечный огонек сквозь забытые тени и оживите гигантских кукол.",
    statusBadge: "Победитель Hubigr Jam #4",
    statusIcon: Trophy,
    tags: ["Головоломка", "Атмосферная", "Платформер"],
    platforms: ["webgl", "windows", "mac"],
    mediaUrl: paperlightImg,
    thumbUrl: paperlightImg,
    isVideo: false,
    price: 0,
    isWebGL: true,
    userState: "guest"
  },
  {
    id: "f-tinyspark",
    title: "Tiny Spark",
    pitch: "Красочное пиксельное приключение о храбром путешественнике и его спутнике. Исследуйте парящие острова, заводите друзей и открывайте неизведанные земли.",
    statusBadge: "Выбор редакции",
    statusIcon: Sparkles,
    tags: ["Приключение", "Пиксель-арт", "Инди"],
    platforms: ["webgl", "windows"],
    mediaUrl: tinysparkImg,
    thumbUrl: tinysparkImg,
    isVideo: false,
    price: 0,
    isWebGL: true,
    userState: "guest"
  },
  {
    id: "f-caveblazers",
    title: "Caveblazers",
    pitch: "Хардкорный платформер-рогалик по процедурно генерируемым пещерам. Собирайте магические артефакты, побеждайте монстров и выживайте во тьме подземелий.",
    statusBadge: "Культовый рогалик",
    statusIcon: Trophy,
    tags: ["Рогалик", "Платформер", "Пиксель-арт"],
    platforms: ["windows", "mac", "linux"],
    mediaUrl: caveblazersImg,
    thumbUrl: caveblazersImg,
    isVideo: false,
    price: 349,
    isWebGL: false,
    userState: "guest"
  }
];

const AUTOPLAY_INTERVAL = 8000;

const MarketHeroCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Smart Pause
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setIsPaused(!entry.isIntersecting));
      },
      { threshold: 0.1 }
    );
    if (carouselRef.current) observer.observe(carouselRef.current);

    const handleVisibility = () => setIsPaused(document.hidden);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  // Timer loop
  useEffect(() => {
    let interval: any;
    if (!isPaused) {
      interval = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            setActiveIndex((cur) => (cur + 1) % FEATURED_GAMES.length);
            return 0;
          }
          return p + (50 / AUTOPLAY_INTERVAL) * 100;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPaused, activeIndex]);

  const handleSelect = (index: number) => {
    setActiveIndex(index);
    setProgress(0);
  };

  const activeGame = FEATURED_GAMES[activeIndex];

  const renderCTA = () => {
    if (activeGame.userState === 'owned') {
      return (
        <Button variant="primary" size="lg" icon={<Play className="w-5 h-5 fill-current" />}>
          Играть
        </Button>
      );
    }
    if (activeGame.price === 0) {
      if (activeGame.isWebGL) {
        return (
          <Button variant="primary" size="lg" icon={<Zap className="w-5 h-5 fill-current" />}>
            Играть бесплатно
          </Button>
        );
      }
      return (
        <Button variant="primary" size="lg" icon={<Download className="w-5 h-5" />}>
          Добавить в библиотеку
        </Button>
      );
    }
    return (
      <Button variant="primary" size="lg" icon={<ShoppingCart className="w-5 h-5" />}>
        Купить за {activeGame.price} ₽
      </Button>
    );
  };

  return (
    <div 
      ref={carouselRef} 
      className="relative w-full rounded-2xl overflow-hidden bg-[#050505] flex flex-col lg:flex-row h-[500px] lg:h-[480px] mb-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      
      {/* LEFT SIDE: Main Feature (75%) */}
      <div className="relative w-full lg:w-[75%] h-[380px] lg:h-full shrink-0 group cursor-pointer overflow-hidden bg-[#050505]">
        {/* Animated Media Backgrounds */}
        {FEATURED_GAMES.map((game, idx) => (
          <div 
            key={game.id} 
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${idx === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <img 
              src={game.mediaUrl} 
              alt={game.title} 
              className="w-full h-full object-cover transition-transform duration-[8s] scale-100 group-hover:scale-105 ease-out opacity-90" 
              loading={idx === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
        
        {/* Clean Editorial Gradient */}
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent lg:bg-gradient-to-r lg:from-[#050505] lg:via-[#050505]/50 lg:to-transparent pointer-events-none" />

        {/* Content Area */}
        <div className="absolute inset-0 z-30 p-6 lg:p-10 flex flex-col justify-end pointer-events-none">
          <div className="max-w-3xl">
            
            {/* Meta Group: Status + Platforms */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-accent uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                {activeGame.statusBadge}
              </div>
              <div className="hidden sm:block w-1 h-1 rounded-full bg-white/20" />
              <div className="flex items-center gap-1.5 opacity-80">
                {activeGame.platforms.map(p => (
                   <PlatformIcon key={p} platform={p} className="w-4 h-4 text-white" />
                ))}
              </div>
            </div>
            
            {/* Title */}
            <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-black text-white leading-[1.05] mb-4 tracking-tight">
              {activeGame.title}
            </h2>
            
            {/* Pitch & Tags Group */}
            <div className="mb-8 max-w-xl">
              <p className="text-white/70 text-base lg:text-lg leading-relaxed mb-3">
                {activeGame.pitch}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {activeGame.tags.map(tag => (
                  <span key={tag} className="text-xs font-medium text-white/50 uppercase tracking-widest">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            {/* CTA Zone */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pointer-events-auto">
              <div className="w-full sm:w-auto [&>button]:w-full [&>button]:sm:w-auto">
                {renderCTA()}
              </div>
              
              <button 
                className="w-full sm:w-auto px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors flex items-center justify-center"
                onClick={(e) => { e.stopPropagation(); window.location.hash = '#/market'; }}
              >
                Страница игры
              </button>
              
              <button 
                className="hidden sm:flex w-[48px] h-[48px] items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
                title="В избранное"
                onClick={(e) => e.stopPropagation()}
              >
                <Heart className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Thumbnails Queue (25%) - Desktop Only */}
      <div className="hidden lg:flex flex-col w-[25%] shrink-0 bg-[#0a0a0c] p-3 gap-2 z-40">
        <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-3 pt-2 mb-1">
          В фокусе
        </div>
        {FEATURED_GAMES.map((game, idx) => {
          const isActive = idx === activeIndex;
          return (
            <div 
              key={'thumb-'+game.id}
              onClick={() => handleSelect(idx)}
              className={`relative flex flex-col justify-center flex-1 rounded-xl p-3 cursor-pointer transition-colors overflow-hidden ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}`}
            >
              {/* Active Loading Bar at the bottom of the active thumbnail */}
              {isActive && (
                <div className="absolute bottom-0 left-0 h-0.5 bg-accent" style={{ width: `${progress}%`, transition: 'width 50ms linear' }} />
              )}
              
              <div className="flex items-center gap-4">
                <div className="w-14 h-10 shrink-0 rounded-md overflow-hidden bg-black/50 relative">
                   <img 
                     src={game.thumbUrl} 
                     alt={game.title} 
                     className={`w-full h-full object-cover transition-opacity ${isActive ? 'opacity-100' : 'opacity-60'}`} 
                   />
                </div>
                <div className="flex flex-col min-w-0">
                   <span className={`text-sm font-bold truncate transition-colors ${isActive ? 'text-white' : 'text-white/60'}`}>
                     {game.title}
                   </span>
                   <span className="text-[10px] font-medium text-white/40 uppercase tracking-widest truncate mt-1">
                     {game.tags[0]}
                   </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Mobile Dots */}
      <div className="lg:hidden absolute bottom-4 right-4 z-40 flex items-center gap-2">
        {FEATURED_GAMES.map((_, idx) => (
          <button 
            key={idx}
            onClick={() => handleSelect(idx)}
            className={`h-1.5 rounded-full transition-all ${idx === activeIndex ? 'bg-accent w-6' : 'bg-white/30 w-1.5 hover:bg-white/50'}`}
          />
        ))}
      </div>

    </div>
  );
};

export default MarketHeroCarousel;
