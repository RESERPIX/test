import React from 'react';
import { Eye, Heart, Shield, Gamepad2, Users, Trophy, Archive, EyeOff, ShieldAlert, Clock, MessageSquareOff } from 'lucide-react';
import { DevLogPost, DevLogType } from '../../types/devlog';

interface DevLogCardProps {
  post: DevLogPost;
  onClick?: () => void;
}

const TypeIndicator = ({ type }: { type: DevLogType }) => {
  const getStyle = () => {
    switch (type) {
      case 'update': return 'text-success bg-success/10 border-success/20';
      case 'postmortem': return 'text-textPrimary bg-surface-3 border-borderDef';
      case 'need_feedback': return 'text-warning bg-warning/10 border-warning/20';
      case 'looking_for_team': return 'text-info bg-info/10 border-info/20';
      case 'announcement': return 'text-accent bg-accent/10 border-accent/20';
      default: return 'text-textSecondary bg-surface-2 border-borderDef';
    }
  };
  
  const getLabel = () => {
    switch (type) {
      case 'update': return 'Обновление';
      case 'postmortem': return 'Постмортем';
      case 'need_feedback': return 'Нужен фидбек';
      case 'looking_for_team': return 'Поиск команды';
      case 'announcement': return 'Анонс';
      default: return type;
    }
  };

  return (
    <span className={`px-2.5 py-1 text-[11px] font-black uppercase tracking-widest rounded-md border ${getStyle()}`}>
      {getLabel()}
    </span>
  );
};

export default function DevLogCard({ post, onClick }: DevLogCardProps) {
  return (
    <article 
      onClick={onClick}
      className="flex flex-col h-full cursor-pointer group bg-surface-1 border border-borderDef hover:border-textTertiary transition-colors duration-200 rounded-3xl overflow-hidden"
    >
      {/* Containerized Cover Image (Premium inset style) */}
      {post.coverUrl && (
        <div className="p-3 pb-0">
          <div className="w-full aspect-[16/10] overflow-hidden rounded-2xl bg-surface-2 border border-borderDef/50 relative">
            <img 
              src={post.coverUrl} 
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
            {/* Subtle inner shadow for depth, no gradients */}
            <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] rounded-2xl pointer-events-none" />
          </div>
        </div>
      )}

      <div className="flex flex-col flex-1 p-6 md:p-7">
        {/* Meta Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <TypeIndicator type={post.type} />
            {post.archivedAt && (
              <span className="px-2 py-0.5 text-[11px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-md flex items-center gap-1" title="Игра удалена автором. Пост сохранён в режиме архива">
                <Archive className="w-3 h-3" /> Архив
              </span>
            )}
            {post.jamName && (
              <span className="px-2 py-0.5 text-[11px] font-bold text-warning bg-warning/10 border border-warning/20 rounded-md flex items-center gap-1" title="Привязан к джему">
                <Trophy className="w-3 h-3" /> {post.jamName}
              </span>
            )}
            {post.coreStatus === 'hidden' && (
              <span className="px-2 py-0.5 text-[11px] font-bold text-textTertiary bg-surface-2 border border-borderDef rounded-md flex items-center gap-1">
                <EyeOff className="w-3 h-3" /> Скрыт
              </span>
            )}
            {post.coreStatus === 'blocked' && (
              <span className="px-2 py-0.5 text-[11px] font-bold text-danger bg-danger/10 border border-danger/20 rounded-md flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" /> Заблокирован
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-[13px] font-bold text-textTertiary shrink-0">
            <span>
              {new Date(post.publishedAt || post.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
            </span>
            {post.isEdited && (
              <span className="text-[11px] text-textTertiary font-medium" title="Запись была отредактирована">
                (изм.)
              </span>
            )}
          </div>
        </div>

        {/* Title & Excerpt */}
        <h3 className="text-xl font-black text-textPrimary leading-tight tracking-tight mb-3 group-hover:text-accent transition-colors line-clamp-2">
          {post.title}
        </h3>
        
        <p className="text-[14px] text-textSecondary leading-relaxed line-clamp-3 mb-6 flex-1 font-medium">
          {post.bodyMarkdown.replace(/[#*`_\[\]]/g, '')}
        </p>

        {/* Premium Indicators - Elegant inline styling */}
        {(post.type === 'looking_for_team' || post.type === 'need_feedback') && (
          <div className="mb-6 flex flex-col gap-2">
            {post.type === 'looking_for_team' && post.recruitmentDetails && (
              <div className="flex items-start gap-2 bg-info/5 border border-info/10 rounded-xl p-3">
                <Users className="w-4 h-4 text-info shrink-0 mt-0.5" />
                <div className="text-[13px] font-bold text-info">
                  <span className="text-info/70 uppercase text-[10px] tracking-widest block mb-0.5">Открытые роли</span>
                  {post.recruitmentDetails.roles.join(', ')}
                </div>
              </div>
            )}
            {post.type === 'need_feedback' && (
              <div className="flex items-start gap-2 bg-warning/5 border border-warning/10 rounded-xl p-3">
                <Gamepad2 className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                <div className="text-[13px] font-bold text-warning">
                  <span className="text-warning/70 uppercase text-[10px] tracking-widest block mb-0.5">Фокус тестов</span>
                  Ищем тестировщиков
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer: Author & Metrics */}
        <div className="flex items-center justify-between pt-5 mt-auto">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              {post.publisherAvatarUrl ? (
                <img src={post.publisherAvatarUrl} alt={post.publisherName} className="w-8 h-8 rounded-full object-cover bg-surface-2" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-surface-3 flex items-center justify-center text-[11px] font-bold text-textSecondary">
                  {post.publisherName.charAt(0)}
                </div>
              )}
              {post.publisherType === 'team' && (
                <div className="absolute -bottom-1 -right-1 bg-surface-1 rounded-full p-0.5">
                  <Shield className="w-3 h-3 text-textPrimary" />
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-bold text-textPrimary leading-none">{post.publisherName}</span>
              {post.gameName && <span className="text-[12px] font-medium text-textTertiary mt-1 truncate max-w-[120px]">{post.gameName}</span>}
            </div>
          </div>

          <div className="flex items-center gap-3 text-[13px] font-bold text-textTertiary shrink-0">
            {post.isCommentsDisabled && (
              <span title="Комментарии отключены автором">
                <MessageSquareOff className="w-4 h-4 text-textTertiary" />
              </span>
            )}
            <div className="flex items-center gap-1.5 group-hover:text-textPrimary transition-colors">
              <Eye className="w-4 h-4" /> {post.normalizedViews}
            </div>
            <div className="flex items-center gap-1.5 group-hover:text-danger transition-colors">
              <Heart className="w-4 h-4" /> {post.likesCount}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
