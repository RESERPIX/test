import React, { useState, useEffect } from 'react';
import { Bell, Copy, MessageCircle, PlusCircle, Trophy, Check } from 'lucide-react';

interface JamThemeBlockProps {
  jam: {
    slug: string;
    theme: string | null;
    schedule: { start_at: string; end_at: string };
    content_html?: string;
  };
  userRole?: 'organizer' | 'admin' | 'participant' | 'visitor';
  onSubscribe?: () => void;
  onSubmit?: () => void;
  canSubmit?: boolean;
}

type ThemeState = 'locked' | 'revealed' | 'archived';

const calculateTimeRemaining = (targetDate: string) => {
  const diff = Math.max(0, new Date(targetDate).getTime() - new Date().getTime());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000)
  };
};

const determineThemeState = (startAt: string, endAt: string): ThemeState => {
  const now = new Date(), start = new Date(startAt), end = new Date(endAt);
  if (now < start) return 'locked';
  if (now >= start && now < end) return 'revealed';
  return 'archived';
};

export default function JamThemeBlock({ jam, userRole = 'visitor', onSubscribe, onSubmit, canSubmit = false }: JamThemeBlockProps) {
  const [themeState, setThemeState] = useState<ThemeState>(() => determineThemeState(jam.schedule.start_at, jam.schedule.end_at));
  const [timeRemaining, setTimeRemaining] = useState(() => calculateTimeRemaining(jam.schedule.start_at));
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const newState = determineThemeState(jam.schedule.start_at, jam.schedule.end_at);
      if (newState !== themeState) setThemeState(newState);
      if (themeState === 'locked') setTimeRemaining(calculateTimeRemaining(jam.schedule.start_at));
    }, 1000);
    return () => clearInterval(interval);
  }, [jam.schedule.start_at, jam.schedule.end_at, themeState]);

  const handleCopy = async () => {
    if (!jam.theme) return;
    try {
      await navigator.clipboard.writeText(jam.theme);
      setToastMessage('Скопировано');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {}
  };

  const handleSubscribe = () => {
    if (isSubscribed) {
      setIsSubscribed(false);
      setToastMessage('Подписка отменена');
    } else {
      setIsSubscribed(true);
      setToastMessage('Вы подписались на уведомление. Мы пришлём оповещение в момент раскрытия темы');
      if (onSubscribe) onSubscribe();
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const isPreview = (userRole === 'organizer' || userRole === 'admin') && themeState === 'locked';

  // LOCKED
  if (themeState === 'locked' && !isPreview) {
    return (
      <div className="border border-borderDef rounded-xl p-4 sm:p-6 md:p-8 min-h-[240px] md:min-h-[340px] flex items-center justify-center overflow-hidden">
        <div className="w-full text-center space-y-6 md:space-y-8">
          <h3 className="text-sm md:text-base text-textTertiary font-medium">До раскрытия темы</h3>
          
          <div className="flex items-center justify-center gap-3 sm:gap-6 md:gap-12">
            <div className="text-center">
              <div className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-mono text-textPrimary tabular-nums leading-none">{String(timeRemaining.days).padStart(2, '0')}</div>
              <div className="text-[10px] sm:text-xs text-textTertiary uppercase tracking-wider mt-1 sm:mt-2">ДНЕЙ</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-mono text-textPrimary tabular-nums leading-none">{String(timeRemaining.hours).padStart(2, '0')}</div>
              <div className="text-[10px] sm:text-xs text-textTertiary uppercase tracking-wider mt-1 sm:mt-2">ЧАСОВ</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-mono text-textPrimary tabular-nums leading-none">{String(timeRemaining.minutes).padStart(2, '0')}</div>
              <div className="text-[10px] sm:text-xs text-textTertiary uppercase tracking-wider mt-1 sm:mt-2">МИНУТ</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-mono text-textPrimary tabular-nums leading-none">{String(timeRemaining.seconds).padStart(2, '0')}</div>
              <div className="text-[10px] sm:text-xs text-textTertiary uppercase tracking-wider mt-1 sm:mt-2">СЕКУНД</div>
            </div>
          </div>

          {onSubscribe && (
            <button 
              onClick={handleSubscribe} 
              className={`inline-flex items-center justify-center gap-2 h-11 md:h-10 px-5 w-full sm:w-auto font-semibold text-sm rounded-xl md:rounded-lg transition-colors ${
                isSubscribed 
                  ? 'bg-surface-2 border border-borderDef text-textPrimary hover:bg-surface-3' 
                  : 'bg-accent hover:bg-accent-hover text-white'
              }`}
              title={isSubscribed ? 'Нажмите, чтобы отменить' : ''}
            >
              {isSubscribed ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Напоминание включено</span>
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4" />
                  <span>Уведомить о старте</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    );
  }

  // PREVIEW
  if (isPreview && jam.theme) {
    return (
      <div className="border border-borderDef rounded-xl p-4 sm:p-6 md:p-8 min-h-[200px] md:min-h-[340px] flex items-center">
        <div className="w-full">
          <div className="flex items-start justify-between gap-4 mb-3">
            <span className="text-xs font-mono text-textTertiary uppercase tracking-widest">Тема джема</span>
            <span className="text-[10px] md:text-xs font-mono text-accent uppercase bg-accent/10 px-2 py-1 rounded">Предпросмотр</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-black text-textPrimary">«{jam.theme}»</h3>
          {jam.content_html && <p className="text-sm text-textSecondary mt-3">{jam.content_html}</p>}
        </div>
      </div>
    );
  }

  // REVEALED
  if (themeState === 'revealed' && jam.theme) {
    return (
      <div className="border border-borderDef rounded-xl p-4 sm:p-6 md:p-8 min-h-[240px] md:min-h-[340px] flex flex-col justify-between gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <span className="text-xs font-mono text-textTertiary uppercase tracking-widest">Тема джема</span>
            <h2 className="text-3xl sm:text-4xl font-black text-textPrimary leading-tight break-words">«{jam.theme}»</h2>
            {jam.content_html && <p className="text-sm text-textSecondary leading-relaxed pt-1">{jam.content_html}</p>}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full">
          <button onClick={handleCopy} className="h-11 sm:h-10 px-4 w-full sm:w-auto bg-surface-2 hover:bg-surface-3 border border-borderDef text-textPrimary text-sm rounded-xl sm:rounded-lg transition-colors flex items-center justify-center gap-2">
            <Copy className="w-4 h-4" />
            <span>Скопировать</span>
          </button>
          <button onClick={() => window.location.hash = `/jams/${jam.slug}?tab=community`} className="h-11 sm:h-10 px-4 w-full sm:w-auto bg-surface-2 hover:bg-surface-3 border border-borderDef text-textPrimary text-sm rounded-xl sm:rounded-lg transition-colors flex items-center justify-center gap-2">
            <MessageCircle className="w-4 h-4" />
            <span>Обсудить</span>
          </button>
          {canSubmit && onSubmit && (
            <button onClick={onSubmit} className="h-11 sm:h-10 px-5 w-full sm:w-auto bg-accent hover:bg-accent-hover text-white font-bold text-sm rounded-xl sm:rounded-lg transition-colors flex items-center justify-center gap-2 sm:ml-auto mt-2 sm:mt-0">
              <PlusCircle className="w-4 h-4" />
              <span>Подать игру</span>
            </button>
          )}
        </div>

        {showToast && (
          <div className="fixed bottom-6 right-6 z-toast bg-surface-1 border border-borderDef px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 max-w-md">
            <div className="w-1.5 h-1.5 bg-success rounded-full" />
            <span className="text-sm text-textPrimary">{toastMessage}</span>
          </div>
        )}
      </div>
    );
  }

  // ARCHIVED
  if (themeState === 'archived' && jam.theme) {
    return (
      <div className="border border-borderDef rounded-xl p-4 sm:p-6 flex items-center">
        <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-1">
            <span className="text-xs font-mono text-textTertiary uppercase tracking-wider">Тема прошедшего джема</span>
            <h3 className="text-2xl font-bold text-textPrimary break-words">«{jam.theme}»</h3>
          </div>
          <button onClick={() => window.location.hash = `/jams/${jam.slug}?tab=results`} className="h-11 sm:h-10 px-4 w-full sm:w-auto bg-accent hover:bg-accent-hover text-white font-bold text-sm rounded-xl sm:rounded-lg transition-colors flex items-center justify-center gap-2 shrink-0">
            <Trophy className="w-4 h-4" />
            <span>Итоги</span>
          </button>
        </div>
      </div>
    );
  }

  return null;
}
