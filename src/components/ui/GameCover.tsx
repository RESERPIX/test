import React, { useState } from 'react';
import { Gamepad2 } from 'lucide-react';

export interface GameCoverProps {
  src?: string | null;
  alt?: string;
  title: string;
  id?: string | number;
  className?: string;
  imageClassName?: string;
  developer?: string;
}

export const GameCoverPlaceholder: React.FC<{
  title: string;
  id?: string | number;
  developer?: string;
  className?: string;
}> = ({ title, developer, className = '' }) => {
  return (
    <div
      className={`w-full h-full relative overflow-hidden flex flex-col items-center justify-center p-4 select-none bg-gradient-to-b from-surface-2 via-surface-2/90 to-surface-1 border border-borderDef/30 ${className}`}
    >
      {/* Subtle background radial light */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-surface-3/30 via-transparent to-transparent pointer-events-none" />

      {/* Center Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-[85%] gap-2.5">
        <div className="w-10 h-10 rounded-xl bg-surface-3/60 border border-borderDef/50 flex items-center justify-center text-textTertiary shadow-sm">
          <Gamepad2 className="w-5 h-5 opacity-70" strokeWidth={1.75} />
        </div>

        <div className="flex flex-col items-center gap-0.5">
          <h4 className="text-xs font-semibold text-textSecondary tracking-tight line-clamp-2 leading-snug">
            {title}
          </h4>
          {developer && (
            <span className="text-[11px] text-textTertiary font-normal truncate">
              {developer}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export const GameCover: React.FC<GameCoverProps> = ({
  src,
  alt = 'Game Cover',
  title,
  id,
  developer,
  className = 'w-full h-full',
  imageClassName = 'w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
}) => {
  const [hasError, setHasError] = useState(!src);

  if (hasError || !src) {
    return <GameCoverPlaceholder title={title} id={id} developer={developer} className={className} />;
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt || title}
        className={imageClassName}
        loading="lazy"
        onError={() => setHasError(true)}
      />
    </div>
  );
};

export default GameCover;
