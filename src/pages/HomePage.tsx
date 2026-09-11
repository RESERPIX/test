import React from 'react';
import EditorialJamsCarousel from '../components/EditorialJamsCarousel';
import MarketHeroCarousel from '../components/MarketHeroCarousel';
import MarketGameCard from '../components/MarketGameCard';
import { ChevronRight, Star, Trophy } from 'lucide-react';
import { MOCK_GAMES_DATABASE } from './MarketPage';

export default function HomePage() {
  return (
    <main className="max-w-[1440px] mx-auto px-4 md:px-8 pt-4 sm:pt-6 pb-20 md:pb-8">
      {/* HERO SPOTLIGHT CAROUSEL */}
      <MarketHeroCarousel />

      {/* СЕКЦИЯ 3 ИЗ СПЕЦИФИКАЦИИ: ВИТРИННЫЕ БЛОКИ */}
      <div className="flex flex-col gap-10 mb-12 animate-fadeIn w-full overflow-hidden">
        
        {/* 1. Игры со скидкой */}
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-heading-2 font-black text-textPrimary tracking-tight">Скидки</h2>
            <button onClick={() => { window.location.hash = '#/market'; }} className="text-body-sm font-bold text-accent hover:text-accent/80 flex items-center gap-1 transition-colors">Смотреть все <ChevronRight className="w-4 h-4" /></button>
          </div>
          <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 snap-x hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {MOCK_GAMES_DATABASE.map((game, index) => (
              <div key={'discount-'+game.id} className="w-[280px] sm:w-[320px] shrink-0 snap-start">
                <MarketGameCard 
                  id={game.id} title={game.title} coverUrl={game.cover_url} developer={{ name: game.author.name, avatarUrl: game.author.avatar }}
                  platforms={game.platforms} rating={game.ratingAvg} reviewsCount={game.ratingCount}
                  price={game.price > 0 ? game.price : 499} discountPercent={30} discountOldPrice={game.price > 0 ? Math.round(game.price * 1.4) : 650}
                  spanType={index === 0 ? "2x2" : "1x1"} userState={game.price === 0 ? 'guest' : 'auth_no_entitlement'}
                />
              </div>
            ))}
          </div>
        </section>

        {/* EDITORIAL GAME JAMS SLIDER */}
        <EditorialJamsCarousel />

        {/* 2. Новинки (Fresh Releases) */}
        <section>
              <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-heading-2 font-black text-textPrimary tracking-tight">Новинки</h2>
                <button onClick={() => { window.location.hash = '#/market'; }} className="text-body-sm font-bold text-accent hover:text-accent/80 flex items-center gap-1 transition-colors">Смотреть все <ChevronRight className="w-4 h-4" /></button>
              </div>
              <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 snap-x hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                {MOCK_GAMES_DATABASE.slice().reverse().map((game, index) => (
                  <div key={'new-'+game.id} className="w-[280px] sm:w-[320px] shrink-0 snap-start">
                    <MarketGameCard 
                      id={game.id} title={game.title} coverUrl={game.cover_url} developer={{ name: game.author.name, avatarUrl: game.author.avatar }}
                      platforms={game.platforms} rating={game.ratingAvg} reviewsCount={game.ratingCount} price={game.price || 0}
                      spanType={index === 0 ? "2x2" : "1x1"} userState={game.price === 0 ? 'guest' : 'auth_no_entitlement'}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* 3. Популярные */}
            <section>
              <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-heading-2 font-black text-textPrimary tracking-tight">Популярное</h2>
                <button onClick={() => { window.location.hash = '#/market'; }} className="text-body-sm font-bold text-accent hover:text-accent/80 flex items-center gap-1 transition-colors">Смотреть все <ChevronRight className="w-4 h-4" /></button>
              </div>
              <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 snap-x hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                {MOCK_GAMES_DATABASE.map((game, index) => (
                  <div key={'pop-'+game.id} className="w-[280px] sm:w-[320px] shrink-0 snap-start">
                    <MarketGameCard 
                      id={game.id} title={game.title} coverUrl={game.cover_url} developer={{ name: game.author.name, avatarUrl: game.author.avatar }}
                      platforms={game.platforms} rating={game.ratingAvg} reviewsCount={game.ratingCount} price={game.price || 0}
                      trendingBadge="Топ онлайна" spanType={index === 0 ? "2x2" : "1x1"} userState={game.price === 0 ? 'guest' : 'auth_no_entitlement'}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* 4. Победители геймджемов */}
            <section>
              <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-heading-2 font-black text-textPrimary tracking-tight flex items-center gap-2"><Trophy className="w-6 h-6 text-warning" /> Победители джемов</h2>
              </div>
              <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 snap-x hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                {MOCK_GAMES_DATABASE.filter(g => g.isJamEntry).map((game, index) => (
                  <div key={'jam-'+game.id} className="w-[280px] sm:w-[320px] shrink-0 snap-start">
                    <MarketGameCard 
                      id={game.id} title={game.title} coverUrl={game.cover_url} developer={{ name: game.author.name, avatarUrl: game.author.avatar }}
                      platforms={game.platforms} rating={game.ratingAvg} reviewsCount={game.ratingCount} price={game.price || 0}
                      jamBadge={`Победитель ${game.jamName || 'Джема'}`} spanType={index === 0 ? "2x2" : "1x1"} userState={game.price === 0 ? 'guest' : 'auth_no_entitlement'}
                    />
                  </div>
                ))}
              </div>
            </section>
            
            {/* 5. Редакторские подборки */}
            <section>
              <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-heading-2 font-black text-textPrimary tracking-tight flex items-center gap-2"><Star className="w-6 h-6 text-accent" /> Выбор редакции</h2>
              </div>
              <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 snap-x hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                {MOCK_GAMES_DATABASE.slice(0, 2).map((game, index) => (
                  <div key={'ed-'+game.id} className="w-[280px] sm:w-[320px] shrink-0 snap-start">
                    <MarketGameCard 
                      id={game.id} title={game.title} coverUrl={game.cover_url} developer={{ name: game.author.name, avatarUrl: game.author.avatar }}
                      platforms={game.platforms} rating={game.ratingAvg} reviewsCount={game.ratingCount} price={game.price || 0}
                      spanType={index === 0 ? "2x2" : "1x1"} userState={game.price === 0 ? 'guest' : 'auth_no_entitlement'}
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>

        
    </main>
  );
}
