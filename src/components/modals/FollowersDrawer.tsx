import React, { useRef, useEffect } from 'react';
import { Users, Search, X, UserPlus, UserCheck, Lock, Shield } from 'lucide-react';
import Drawer from '../ui/Drawer';

const ROLE_BADGE_STYLES: Record<string, string> = {
  Creator:   'bg-success/10 border-success/30 text-success',
  Moderator: 'bg-info/10 border-info/30 text-info',
  Admin:     'bg-danger/10 border-danger/30 text-danger',
  Guest:     'bg-surface-2 border-borderDef text-textTertiary',
};

export interface FollowerUser {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  role?: string;
  isFollowingBack?: boolean;
}

export interface FollowersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tab: 'followers' | 'following';
  onTabChange: (tab: 'followers' | 'following') => void;
  search: string;
  onSearchChange: (search: string) => void;
  followers: FollowerUser[];
  following: FollowerUser[];
  followStatuses: Record<string, boolean>;
  onToggleFollow: (userId: string) => void;
  profileName: string;
  isFollowersHidden?: boolean;
  isFollowingHidden?: boolean;
  isOwner?: boolean;
  onOpenPrivacySettings?: () => void;
}

export const FollowersDrawer: React.FC<FollowersDrawerProps> = ({
  isOpen,
  onClose,
  tab,
  onTabChange,
  search,
  onSearchChange,
  followers,
  following,
  followStatuses,
  onToggleFollow,
  profileName,
  isFollowersHidden = false,
  isFollowingHidden = false,
  isOwner = false,
  onOpenPrivacySettings,
}) => {
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchRef.current?.focus(), 120);
    }
  }, [isOpen]);

  const list = tab === 'followers' ? followers : following;
  const filtered = search.trim()
    ? list.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.handle.toLowerCase().includes(search.toLowerCase())
      )
    : list;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={profileName}
      icon={<Users className="w-5 h-5" />}
      size="md"
    >
      <div className="flex flex-col h-full -mx-6 -my-6">
        {/* Табы */}
        <div className="px-5 bg-surface-1 border-b border-borderDef flex items-center gap-6 shrink-0 pt-2">
          {(['followers', 'following'] as const).map(t => {
            const isHiddenTab = (t === 'followers' && isFollowersHidden) || (t === 'following' && isFollowingHidden);
            return (
              <button
                key={t}
                type="button"
                onClick={() => { onTabChange(t); onSearchChange(''); }}
                className={`pb-3 text-xs font-mono font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  tab === t
                    ? 'text-accent border-accent'
                    : 'text-textTertiary border-transparent hover:text-textPrimary'
                }`}
              >
                <span>
                  {t === 'followers'
                    ? `Подписчики (${followers.length})`
                    : `Подписки (${following.length})`}
                </span>
                {isHiddenTab && (
                  <span title="Список скрыт настройками приватности" className="inline-flex items-center">
                    <Lock className="w-3 h-3 text-textTertiary shrink-0" />
                  </span>
                )}
              </button>
            );
          })}

          {isOwner && onOpenPrivacySettings && (
            <button
              type="button"
              onClick={onOpenPrivacySettings}
              className="ml-auto text-[11px] font-mono text-textTertiary hover:text-accent flex items-center gap-1 pb-3 cursor-pointer transition-colors"
              title="Настройки приватности списков"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Приватность</span>
            </button>
          )}
        </div>

        {/* Индикатор для владельца, если список скрыт */}
        {isOwner && ((tab === 'followers' && isFollowersHidden) || (tab === 'following' && isFollowingHidden)) && (
          <div className="px-4 py-2 bg-accent/10 border-b border-accent/20 flex items-center gap-2 text-[11px] font-mono text-accent select-none">
            <Lock className="w-3.5 h-3.5 shrink-0" />
            <span>Этот список скрыт от других пользователей настройками приватности.</span>
          </div>
        )}

        {/* Экран блокировки приватности для гостей */}
        {!isOwner && ((tab === 'followers' && isFollowersHidden) || (tab === 'following' && isFollowingHidden)) ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-surface-0 space-y-3 select-none">
            <div className="w-12 h-12 rounded-full bg-surface-2 flex items-center justify-center text-accent">
              <Lock className="w-6 h-6 text-accent" />
            </div>
            <h4 className="text-body font-bold text-textPrimary">
              {tab === 'followers' ? 'Список подписчиков скрыт' : 'Список подписок скрыт'}
            </h4>
            <p className="text-caption text-textTertiary max-w-xs leading-relaxed">
              Владелец профиля ограничил отображение этого списка в настройках приватности.
            </p>
          </div>
        ) : (
          <>
            {/* Поиск */}
            <div className="p-4 border-b border-borderDef shrink-0 bg-surface-0">
              <div className="relative">
                <Search className="w-4 h-4 text-textTertiary absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={e => onSearchChange(e.target.value)}
                  placeholder={tab === 'followers' ? 'Поиск в подписчиках...' : 'Поиск в подписках...'}
                  className="w-full h-10 bg-surface-2 border border-borderDef rounded-xl pl-10 pr-10 text-xs text-textPrimary placeholder:text-textTertiary transition-colors focus:border-accent outline-none"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => onSearchChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-textTertiary hover:text-textPrimary cursor-pointer p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Список */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar bg-surface-0">
              {filtered.length === 0 ? (
                <div className="text-center py-16 space-y-2">
                  <Users className="w-8 h-8 text-textTertiary mx-auto" />
                  <p className="text-xs text-textTertiary font-mono">
                    {search ? 'Никого не найдено' : 'Список пуст'}
                  </p>
                </div>
              ) : (
            filtered.map(user => (
              <div
                key={user.id}
                className="p-3.5 bg-surface-1 hover:bg-surface-2 rounded-xl flex items-center justify-between border border-borderDef transition-colors duration-200"
              >
                {/* Аватар + Имя + Хэндл */}
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border border-borderDef shrink-0 bg-surface-2"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-sm font-bold text-textPrimary truncate">{user.name}</p>
                      {user.role && (
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded border text-[10px] uppercase font-mono font-bold leading-none shrink-0 ${
                          ROLE_BADGE_STYLES[user.role] ?? ROLE_BADGE_STYLES['Guest']
                        }`}>
                          {user.role}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-textTertiary font-mono truncate mt-0.5">@{user.handle}</p>
                  </div>
                </div>

                {/* Кнопка подписки */}
                <button
                  onClick={() => onToggleFollow(user.id)}
                  className={`ml-3 shrink-0 px-3 h-8 rounded text-xs font-mono font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                    followStatuses[user.id]
                      ? 'bg-surface-2 border-borderDef text-textPrimary hover:bg-danger/10 hover:border-danger/30 hover:text-danger'
                      : 'bg-accent/10 border-accent text-accent hover:bg-accent hover:text-white'
                  }`}
                >
                  {followStatuses[user.id] ? (
                    <>
                      <UserCheck className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Вы подписаны</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Подписаться</span>
                    </>
                  )}
                </button>
              </div>
            ))
          )}
        </div>
      </>
      )}
    </div>
  </Drawer>
  );
};

export default FollowersDrawer;
