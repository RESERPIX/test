import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Trophy, ArrowRight } from 'lucide-react';

interface JamItem {
  id: string;
  status: 'upcoming' | 'live' | 'completed' | 'archived';
  statusLabel: string;
  title: string;
  description: string;
  metadata: string;
  ctaLabel: string;
  imageUrl: string;
  winner?: string;
}

const MOCK_JAMS: JamItem[] = [
  {
    id: 'jam-one-room',
    status: 'live',
    statusLabel: 'Идет сейчас',
    title: 'ONE ROOM',
    description: 'Создай игру, действие которой происходит в одном помещении. One room. Infinite possibilities.',
    metadata: '48 ЧАСОВ · 1.5K УЧАСТНИКОВ',
    ctaLabel: 'Участвовать',
    imageUrl: '/images/JamsSLider/OneRoom.png',
  },
  {
    id: 'jam-lost-signal',
    status: 'upcoming',
    statusLabel: 'Скоро',
    title: 'LOST SIGNAL',
    description: 'Связь потеряна. Игрок должен понять, что произошло, используя только то, что осталось. The signal is gone. What happened?',
    metadata: 'СТАРТ ЧЕРЕЗ 5 ДНЕЙ · 12–19 ОКТЯБРЯ',
    ctaLabel: 'Регистрация',
    imageUrl: '/images/JamsSLider/LostSignal.png',
  },
  {
    id: 'jam-after-the-end',
    status: 'completed',
    statusLabel: 'Завершен',
    title: 'AFTER THE END',
    description: 'Мир уже закончился. История начинается после катастрофы. The world ended. Your story didn\'t.',
    metadata: '642 РАБОТЫ · РЕЗУЛЬТАТЫ',
    ctaLabel: 'Смотреть результаты',
    imageUrl: '/images/JamsSLider/AfterTheEnd.png',
    winner: 'Echoes of the Fall',
  },
  {
    id: 'jam-borrowed-time',
    status: 'archived',
    statusLabel: 'Архив',
    title: 'BORROWED TIME',
    description: 'Время — ограниченный ресурс. Используй его, меняй его или пытайся обмануть. You can\'t make more time. Or can you?',
    metadata: '24 ЧАСА · 210 РАБОТ',
    ctaLabel: 'Смотреть работы',
    imageUrl: '/images/JamsSLider/BorrowedTime.png',
    winner: 'Chronos Paradox',
  },
];

const getStatusStyles = (status: string) => {
  switch (status) {
    case 'live':
      return { dot: 'bg-accent animate-pulse', text: 'text-accent' };
    case 'upcoming':
      return { dot: 'bg-white', text: 'text-white' };
    case 'completed':
    case 'archived':
    default:
      return { dot: 'bg-white/40', text: 'text-white/60' };
  }
};

export default function EditorialJamsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const slideWidth = scrollRef.current.firstElementChild?.clientWidth || 0;
    if (slideWidth > 0) {
      const newIndex = Math.round(scrollLeft / slideWidth);
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < MOCK_JAMS.length) {
        setCurrentIndex(newIndex);
      }
    }
  };

  const scrollTo = (index: number) => {
    if (!scrollRef.current) return;
    const childNodes = Array.from(scrollRef.current.children);
    const target = childNodes[index] as HTMLElement;
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  };

  const next = () => {
    if (currentIndex < MOCK_JAMS.length - 1) scrollTo(currentIndex + 1);
  };

  const prev = () => {
    if (currentIndex > 0) scrollTo(currentIndex - 1);
  };

  return (
    <section className="w-full my-8 animate-fadeIn relative">
      {/* Scroll Container */}
      <div 
        ref={scrollRef}
        className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar"
        onScroll={handleScroll}
      >
        {MOCK_JAMS.map((jam) => {
          const statusStyle = getStatusStyles(jam.status);
          return (
            <div 
              key={jam.id} 
              className="w-[92%] shrink-0 snap-start relative h-[420px] md:h-[480px] rounded-2xl overflow-hidden group bg-[#050505]"
            >
              {/* Artwork */}
              <div className="absolute inset-0">
                <img 
                  src={jam.imageUrl} 
                  alt={jam.title}
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-[1.02] ease-out opacity-90" 
                  loading="lazy"
                />
                {/* Clean dark gradient for text readability, no muddy overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent md:bg-gradient-to-r md:from-[#050505] md:via-[#050505]/40 md:to-transparent" />
              </div>

              {/* Content Area - Grouped by proximity and typographic weight */}
              <div className="relative z-10 w-full h-full p-6 md:p-10 flex flex-col justify-end pointer-events-none">
                <div className="max-w-2xl flex flex-col items-start">
                  
                  {/* Meta Group: Status + Details */}
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${statusStyle.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                      {jam.statusLabel}
                    </div>
                    <div className="w-1 h-1 rounded-full bg-white/20 hidden sm:block" />
                    <div className="text-xs text-white/60 font-medium tracking-wide uppercase">
                      {jam.metadata}
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-3xl md:text-[44px] leading-tight font-bold text-white mb-4 tracking-tight">
                    {jam.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-white/70 text-base md:text-lg mb-8 max-w-lg leading-relaxed">
                    {jam.description}
                  </p>
                  
                  {/* Actions Group */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto pointer-events-auto">
                    <button className="w-full sm:w-auto px-8 py-3.5 bg-accent hover:bg-accent/90 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                      {jam.ctaLabel} <ArrowRight className="w-4 h-4" />
                    </button>
                    
                    {jam.winner && (
                      <div className="flex items-center gap-3 group/winner cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center transition-colors group-hover/winner:bg-white/10">
                          <Trophy className="w-4 h-4 text-white/60 group-hover/winner:text-white transition-colors" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-white/50 font-medium uppercase tracking-widest">1 место</span>
                          <span className="text-sm text-white font-medium transition-colors group-hover/winner:text-white">{jam.winner}</span>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </div>
          );
        })}

        {/* Spacer to allow the last slide to align left while showing the container gap */}
        <div className="w-[8%] shrink-0 snap-end" />
      </div>

      {/* Navigation Controls - Anchored to the section, not floating in a glass pill */}
      <div className="absolute right-6 bottom-6 md:right-10 md:bottom-10 z-20 flex items-center gap-6 pointer-events-none">
        <div className="text-sm font-medium text-white/40 font-mono tracking-widest">
          <span className="text-white">{String(currentIndex + 1).padStart(2, '0')}</span> / {String(MOCK_JAMS.length).padStart(2, '0')}
        </div>
        <div className="flex gap-2 pointer-events-auto">
          <button 
            onClick={prev} 
            disabled={currentIndex === 0}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors disabled:opacity-20 disabled:hover:bg-black/40"
            aria-label="Предыдущий джем"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={next} 
            disabled={currentIndex === MOCK_JAMS.length - 1}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors disabled:opacity-20 disabled:hover:bg-black/40"
            aria-label="Следующий джем"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Subtle Progress Line */}
      <div className="mt-4 mx-2 h-0.5 bg-surface-2 overflow-hidden rounded-full max-w-[200px]">
        <div 
          className="h-full bg-accent transition-all duration-500 ease-out"
          style={{ width: `${((currentIndex + 1) / MOCK_JAMS.length) * 100}%` }}
        />
      </div>

    </section>
  );
}
