import React from 'react';
import ReactDOM from 'react-dom';
import {
  Trophy, Award, Star, Sparkles, CheckCircle2,
  Users, UserPlus, Cpu, Monitor, Gamepad2, Compass,
  Heart, Bookmark, Flag, Calendar, MessageSquare,
  Bell, Mail, Eye, Share2, Globe, Layers,
  Briefcase, Camera, MapPin, Info, ChevronDown, X
} from 'lucide-react';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'celebratory';

export interface BadgeData {
  id: string;
  icon: string;
  label: string;
  variant: BadgeVariant;
  hidden?: boolean;
}

export const BADGE_ICON_MAP: Record<string, React.ElementType> = {
  'trophy':         Trophy,
  'award':          Award,
  'star':           Star,
  'sparkles':       Sparkles,
  'check-circle-2': CheckCircle2,
  'users':          Users,
  'user-plus':      UserPlus,
  'cpu':            Cpu,
  'monitor':        Monitor,
  'gamepad-2':      Gamepad2,
  'compass':        Compass,
  'heart':          Heart,
  'bookmark':       Bookmark,
  'flag':           Flag,
  'calendar':       Calendar,
  'message-square': MessageSquare,
  'bell':           Bell,
  'mail':           Mail,
  'eye':            Eye,
  'share-2':        Share2,
  'globe':          Globe,
  'layers':         Layers,
  'briefcase':      Briefcase,
  'camera':         Camera,
  'map-pin':        MapPin,
  'info':           Info,
};

export const BADGE_VARIANT_STYLES: Record<BadgeVariant, { chip: string; icon: string }> = {
  default:      { chip: 'bg-surface-2 border-borderDef text-textSecondary',             icon: 'text-textTertiary'  },
  success:      { chip: 'bg-success/10 border-success/30 text-success',                 icon: 'text-success'       },
  warning:      { chip: 'bg-warning/10 border-warning/30 text-warning',                 icon: 'text-warning'       },
  celebratory:  { chip: 'bg-celebratory/10 border-celebratory/30 text-celebratory',     icon: 'text-celebratory'   },
};

export const BadgeChip: React.FC<{ badge: BadgeData }> = ({ badge }) => {
  const styles  = BADGE_VARIANT_STYLES[badge.variant] || BADGE_VARIANT_STYLES.default;
  const IconCmp = BADGE_ICON_MAP[badge.icon] ?? Info;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-caption font-semibold font-mono leading-none select-none ${styles.chip}`}>
      <IconCmp className={`w-3.5 h-3.5 shrink-0 ${styles.icon}`} />
      {badge.label}
    </span>
  );
};

const MAX_VISIBLE_BADGES = 3;

export function useBadgeOverflow(badges: BadgeData[]) {
  const [open, setOpen] = React.useState(false);
  const [portalStyle, setPortalStyle] = React.useState<React.CSSProperties>({});
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const popoverRef = React.useRef<HTMLDivElement>(null);

  const visibleBadges = badges.filter(b => !b.hidden);
  const visible  = visibleBadges.slice(0, MAX_VISIBLE_BADGES);
  const overflow = visibleBadges.slice(MAX_VISIBLE_BADGES);
  const hasOverflow = overflow.length > 0;

  const openPortal = React.useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const portalWidth = 272;
    let left = rect.left;
    if (left + portalWidth > window.innerWidth - 16) {
      left = Math.max(16, window.innerWidth - portalWidth - 16);
    }
    setPortalStyle({ top: rect.bottom + 8, left });
    setOpen(true);
  }, []);

  const closePortal = React.useCallback(() => setOpen(false), []);

  const togglePortal = React.useCallback(() => {
    open ? closePortal() : openPortal();
  }, [open, openPortal, closePortal]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closePortal(); };
    const onScroll = () => closePortal();
    const onClick = (e: MouseEvent) => {
      if (triggerRef.current && triggerRef.current.contains(e.target as Node)) return;
      if (popoverRef.current && popoverRef.current.contains(e.target as Node)) return;
      closePortal();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
      window.removeEventListener('scroll', onScroll);
    };
  }, [open, closePortal]);

  return { visible, overflow, visibleBadges, hasOverflow, open, triggerRef, popoverRef, portalStyle, togglePortal, closePortal };
}

export const BadgeRow: React.FC<{ badges: BadgeData[] }> = ({ badges }) => {
  const { visible, overflow, visibleBadges, hasOverflow, open, triggerRef, popoverRef, portalStyle, togglePortal, closePortal } = useBadgeOverflow(badges);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 select-none">
        {visible.map(b => <BadgeChip key={b.id} badge={b} />)}

        {hasOverflow && (
          <button
            ref={triggerRef}
            type="button"
            aria-expanded={open}
            aria-haspopup="true"
            onClick={togglePortal}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-caption font-bold font-mono leading-none cursor-pointer select-none transition-colors duration-150
              ${open
                ? 'bg-surface-3 border-borderStrong text-textPrimary'
                : 'bg-surface-2 border-borderDef text-textSecondary hover:bg-surface-3 hover:border-borderStrong hover:text-textPrimary'
              }`}
          >
            <span>+{overflow.length} ещё</span>
            <ChevronDown className={`w-3 h-3 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      {hasOverflow && open && typeof document !== 'undefined' && ReactDOM.createPortal(
        <div
          ref={popoverRef}
          role="dialog"
          aria-label="Все бейджи и награды"
          style={{ ...portalStyle, position: 'fixed', width: 272, zIndex: 500 }}
          className="bg-surface-3 border border-borderDef rounded-card p-3 shadow-elevation-overlay flex flex-col gap-2 animate-fadeIn"
        >
          <div className="flex items-center justify-between pb-2 border-b border-borderDef">
            <span className="text-caption font-mono font-bold uppercase tracking-wider text-textTertiary flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-accent" />
              Бейджи и награды
            </span>
            <div className="flex items-center gap-2">
              <span className="text-caption font-mono text-textSecondary">{visibleBadges.length} всего</span>
              <button
                onClick={closePortal}
                className="w-5 h-5 rounded hover:bg-surface-2 flex items-center justify-center text-textTertiary hover:text-textPrimary transition-colors cursor-pointer"
                aria-label="Закрыть"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="flex flex-col items-start gap-2">
            {overflow.map(b => <BadgeChip key={b.id} badge={b} />)}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default BadgeRow;
