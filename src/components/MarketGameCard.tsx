import React, { useState } from 'react';
import { Trophy, TrendingUp, Star, Heart, Sparkles } from 'lucide-react';
import { PlatformIcon } from './GameCard';
import { MediaBadge } from './ui/MediaBadge';
import { GameCoverPlaceholder } from './ui/GameCover';

export interface MarketGameCardProps {
  id: string;
  slug?: string;
  title: string;
  coverUrl: string | null;
  developer: {
    name: string;
    avatarUrl: string | null;
  };
  price?: number;
  discountPercent?: number;
  discountOldPrice?: number;
  rating: number;
  reviewsCount: number;
  platforms: string[];
  tags?: string[];
  jamBadge?: string;
  trendingBadge?: string;
  isEditorsChoice?: boolean;
  status?: 'published' | 'unlisted' | 'off_sale' | 'restricted' | 'revoked';
  spanType?: '1x1' | '1x2' | '2x2' | 'banner';
  userState?: 'guest' | 'auth_no_entitlement' | 'auth_entitlement_owned';
  onNavigate?: () => void;
  onLike?: (e: React.MouseEvent) => void;
}

const MarketGameCard: React.FC<MarketGameCardProps> = ({
  id,
  title,
  coverUrl,
  developer,
  price = 0,
  discountPercent,
  discountOldPrice,
  rating,
  reviewsCount,
  platforms,
  jamBadge,
  trendingBadge,
  isEditorsChoice,
  status = 'published',
  spanType = '1x1',
  userState = 'guest',
  onNavigate,
  onLike
}) => {
  const [imageError, setImageError] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  
  // 3. BR-MKT-011, BR-MKT-012: Фильтрация непубличных статусов
  if (status !== 'published') return null;

  const isFree = price === 0;
  const isOwned = userState === 'auth_entitlement_owned';

  // For grid spanning
  const getSpanClasses = () => {
    switch (spanType) {
      case '2x2': return 'col-span-2 row-span-2';
      case '1x2': return 'row-span-2';
      case 'banner': return 'col-span-full md:col-span-2 lg:col-span-3 row-span-2';
      default: return 'col-span-1 row-span-1';
    }
  };

  return (
    <div 
      className={`group relative flex flex-col gap-2.5 cursor-pointer transition-all duration-300 ${getSpanClasses()}`}
      onClick={onNavigate}
    >
      {/* Media Zone (16:9) */}
      <div className="relative w-full pt-[56.25%] overflow-hidden bg-surface-2 shrink-0 rounded-xl ring-1 ring-borderDef ring-inset shadow-sm transition-transform duration-300 group-hover:scale-[1.03] group-hover:shadow-lg group-active:scale-100 group-active:shadow-sm">
        
        {/* Main Cover */}
        <div className="absolute inset-0">
          {(coverUrl && !imageError) ? (
            <img src={coverUrl} alt={title} className="w-full h-full object-cover" onError={() => setImageError(true)} />
          ) : (
            <GameCoverPlaceholder title={title} id={id} />
          )}
        </div>

        {/* Floating Badges (Top Left) */}
        <div className="absolute top-2 left-2 z-30 flex flex-col gap-1.5 pointer-events-none">
          {isEditorsChoice && (
            <MediaBadge variant="accent" icon={<Sparkles className="w-3 h-3" />}>Выбор редакции</MediaBadge>
          )}
          {trendingBadge && (
            <MediaBadge variant="success" icon={<TrendingUp className="w-3 h-3" />}>{trendingBadge}</MediaBadge>
          )}
        </div>

        {/* 1. Бейдж победы в геймджеме (Анимация сдвига) */}
        {jamBadge && (
          <div className="absolute top-2 z-40 transition-all duration-300 right-11 md:right-2 md:group-hover:right-11 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md border border-transparent shadow-lg pointer-events-none flex items-center gap-1.5 max-w-[calc(100%-52px)] md:max-w-[calc(100%-16px)] md:group-hover:max-w-[calc(100%-52px)]">
            <Trophy className="w-3.5 h-3.5 text-warning shrink-0" />
            <span className="text-[10px] font-bold text-white uppercase tracking-wider truncate">{jamBadge}</span>
          </div>
        )}

        {/* 2. Favorite Button */}
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            if (onLike) onLike(e); 
          }}
          className="absolute top-2 right-2 z-50 p-2 rounded-full bg-black/60 hover:bg-accent/90 text-white backdrop-blur-sm border border-transparent transition-all shadow-lg opacity-100 md:opacity-0 md:group-hover:opacity-100"
          aria-label="В избранное"
        >
          <Heart className="w-4 h-4 shrink-0" />
        </button>

        {/* Platforms Badge (Bottom Left) */}
        {platforms.length > 0 && (
          <div className="absolute bottom-2 left-2 z-30 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md shadow-lg pointer-events-none">
            {platforms.map(p => (
              <PlatformIcon key={p} platform={p} className="w-3.5 h-3.5 text-white/90" />
            ))}
          </div>
        )}
      </div>

      {/* Content Zone */}
      <div className="flex flex-col relative z-10 pt-1 px-0.5">
        
        {/* Header: Title and Price */}
        <div className="flex justify-between items-start gap-3 mb-1">
          <h3 className="font-bold text-textPrimary text-base leading-tight line-clamp-2 transition-colors group-hover:text-accent">{title}</h3>
          
          {/* Price Block */}
          <div className="flex flex-col items-end shrink-0 pointer-events-none mt-0.5">
            {isOwned ? (
              <span className="text-white font-bold text-xs tracking-tight bg-success px-1.5 py-0.5 rounded-md">В библиотеке</span>
            ) : isFree ? (
              <span className="text-success font-bold text-xs tracking-tight bg-success/10 px-1.5 py-0.5 rounded-md">Бесплатно</span>
            ) : (
              <div className="flex items-center gap-1.5">
                {discountPercent && discountOldPrice && (
                  <span className="text-xs text-textTertiary line-through font-medium leading-none">{discountOldPrice} ₽</span>
                )}
                {discountPercent ? (
                  <div className="flex items-center gap-1 bg-danger text-white rounded-md px-1.5 py-0.5">
                    <span className="font-bold text-xs">-{discountPercent}%</span>
                  </div>
                ) : null}
                <span className="text-textPrimary font-bold text-base leading-none">{price} ₽</span>
              </div>
            )}
          </div>
        </div>

        {/* Developer & Rating */}
        <div className="flex items-center justify-between text-[13px] text-textSecondary mt-2 pointer-events-none">
          <div className="flex items-center gap-1.5 truncate pr-2">
            {(developer.avatarUrl && !avatarError) ? (
              <img src={developer.avatarUrl} alt="" className="w-4 h-4 rounded-full" onError={() => setAvatarError(true)} />
            ) : (
              <div className="w-4 h-4 rounded-full bg-surface-3 border border-borderDef" />
            )}
            <span className="truncate">{developer.name}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {reviewsCount > 0 ? (
              <>
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-medium text-textPrimary">{rating.toFixed(1)} <span className="text-textTertiary font-normal">({reviewsCount})</span></span>
              </>
            ) : (
              <span className="text-textTertiary text-xs">Нет оценок</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketGameCard;
