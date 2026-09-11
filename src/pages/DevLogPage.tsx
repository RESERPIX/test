import React, { useState, useEffect } from 'react';
import { 
  Heart, MessageSquare, Share2, Eye, Users, Gamepad2, 
  ChevronLeft, Flag, AlertTriangle, Bookmark, Clock, Check,
  ShieldAlert, Archive, Trophy, EyeOff, Edit3, Trash2, Send, History, X, Lock, MessageSquareOff
} from 'lucide-react';
import { MOCK_DEVLOGS } from '../data/devlogMockData';
import { DevLogCoreStatus } from '../types/devlog';
import Button from '../components/ui/Button';
import DevMatrixPanel, { DevMatrixField } from '../components/DevMatrixPanel';
import { useAuth } from '../contexts/AuthContext';

export default function DevLogPage({ slug, onNavigate }: { slug: string, onNavigate?: (path: string) => void }) {
  const { isAuthenticated, openAuthModal } = useAuth();
  
  const [role, setRole] = useState<'guest'|'user'|'moderator'|'author'|'admin'>(isAuthenticated ? 'user' : 'guest');
  
  useEffect(() => {
    if (role === 'guest' && isAuthenticated) setRole('user');
    if (role !== 'guest' && !isAuthenticated) setRole('guest');
  }, [isAuthenticated]);

  const post = MOCK_DEVLOGS.find(p => p.slug === slug) || MOCK_DEVLOGS[0];

  const [pageState, setPageState] = useState<'standard'|'loading'|'not_found'|'blocked'|'error'>('standard');
  const [coreStatus, setCoreStatus] = useState<DevLogCoreStatus>(post?.coreStatus || 'published');
  const [isEdited, setIsEdited] = useState<boolean>(post?.isEdited ?? false);
  const [isArchived, setIsArchived] = useState<boolean>(!!post?.archivedAt);
  const [commentsState, setCommentsState] = useState<'open'|'closed'|'disabled_by_author'>(
    post?.isCommentsDisabled ? 'disabled_by_author' : 'open'
  );

  // Appeal & moderation workflow (BR-DVL-034, FR-DVL-026)
  const [appealStatus, setAppealStatus] = useState<'none'|'writing'|'submitted'>('none');
  const [appealMessage, setAppealMessage] = useState('');

  // Modals
  const [editHistoryOpen, setEditHistoryOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Report Modal (FE-DVL-011, BR-DVL-051)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState<'spam'|'harassment'|'prohibited_content'|'fraud'|'malicious_link'|'copyright'|'other'>('spam');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  // Interactions
  const [isLiked, setIsLiked] = useState(false);
  const [isPinned, setIsPinned] = useState(post?.isPinnedToGame || false);
  const [copied, setCopied] = useState(false);
  
  const isConcreteAuthor = role === 'author';
  const isManager = role === 'author' && post?.publisherType === 'team';
  const canManage = isConcreteAuthor || isManager || role === 'moderator' || role === 'admin';
  const canPin = !!post?.gameId && (isConcreteAuthor || isManager);
  
  const devFields: DevMatrixField[] = [
    {
      id: 'role', label: 'Роль', type: 'buttons', value: role, onChange: setRole as any,
      options: [
        { value: 'guest', label: 'Гость' },
        { value: 'user', label: 'Юзер' },
        { value: 'author', label: 'Автор' },
        { value: 'moderator', label: 'Модер' },
        { value: 'admin', label: 'Админ' }
      ]
    },
    {
      id: 'page_state', label: 'Статус страницы', type: 'buttons', value: pageState, onChange: setPageState as any,
      highlight: true,
      options: [
        { value: 'standard', label: 'Успешно' },
        { value: 'loading', label: 'Загрузка' },
        { value: 'blocked', label: 'Заблокировано' },
        { value: 'not_found', label: 'Не найдено' },
        { value: 'error', label: 'Ошибка 500' }
      ]
    },
    {
      id: 'core_status', label: 'Статус поста', type: 'buttons', value: coreStatus, onChange: setCoreStatus as any,
      options: [
        { value: 'published', label: 'Опубликован' },
        { value: 'hidden', label: 'Скрыт' },
        { value: 'blocked', label: 'Заблокирован' }
      ]
    },
    {
      id: 'is_edited', label: 'Отредактирован (BR-DVL-049)', type: 'buttons', value: isEdited ? 'yes' : 'no', 
      onChange: (v) => setIsEdited(v === 'yes'),
      options: [
        { value: 'no', label: 'Оригинал' },
        { value: 'yes', label: 'Изменен' }
      ]
    },
    {
      id: 'is_archived', label: 'Архив игры (BR-DVL-037)', type: 'buttons', value: isArchived ? 'yes' : 'no', 
      onChange: (v) => setIsArchived(v === 'yes'),
      options: [
        { value: 'no', label: 'Игра активна' },
        { value: 'yes', label: 'Игра удалена' }
      ]
    },
    {
      id: 'comments', label: 'Комментарии (BR-DVL-053)', type: 'select', value: commentsState, onChange: setCommentsState as any,
      options: [
        { value: 'open', label: 'Открыты' },
        { value: 'closed', label: 'Закрыты (Модератор)' },
        { value: 'disabled_by_author', label: 'Отключены автором' }
      ]
    }
  ];

  if (pageState === 'loading') {
    return (
      <div className="min-h-screen bg-surface-0 flex flex-col relative font-sans">
        <DevMatrixPanel fields={devFields} />
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin mb-6"></div>
          <h2 className="text-xl font-bold text-textPrimary animate-pulse">Загрузка девлога...</h2>
        </div>
      </div>
    );
  }

  if (pageState === 'not_found' || !post) {
    return (
      <div className="min-h-screen bg-surface-0 flex flex-col relative font-sans">
        <DevMatrixPanel fields={devFields} />
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <div className="text-6xl mb-6">👻</div>
          <h2 className="text-3xl font-black text-textPrimary mb-4">Девлог не найден</h2>
          <p className="text-textSecondary mb-8 max-w-md">Возможно, запись была удалена автором или вы перешли по устаревшей ссылке.</p>
          <Button variant="secondary" onClick={() => onNavigate?.('/devlogs')}>Вернуться в ленту</Button>
        </div>
      </div>
    );
  }

  if (pageState === 'error') {
    return (
      <div className="min-h-screen bg-surface-0 flex flex-col relative font-sans">
        <DevMatrixPanel fields={devFields} />
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <div className="text-danger mb-4 p-4 rounded-full bg-danger/10 border border-danger/20">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-textPrimary mb-4">Ошибка подключения</h2>
          <p className="text-textSecondary mb-8 max-w-md">Не удалось загрузить данные. Проверьте интернет-соединение.</p>
        </div>
      </div>
    );
  }

  // BR-DVL-032: Public users see stub for blocked posts.
  // BR-DVL-033: Author and managers see the full post + block/appeal banner.
  const isPostBlocked = pageState === 'blocked' || coreStatus === 'blocked';
  if (isPostBlocked && !canManage) {
    return (
      <div className="min-h-screen bg-surface-0 flex flex-col relative font-sans">
        <DevMatrixPanel fields={devFields} />
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <div className="text-danger mb-4 p-4 rounded-full bg-danger/10 border border-danger/20">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-textPrimary mb-4">Запись заблокирована</h2>
          <p className="text-textSecondary mb-8 max-w-md">
            Этот девлог скрыт модераторами платформы за нарушение правил сообщества.
          </p>
          <Button variant="secondary" onClick={() => onNavigate?.('/devlogs')}>Вернуться в ленту</Button>
        </div>
      </div>
    );
  }

  const renderMarkdown = (text: string) => {
    return text.split('\n\n').map((para, i) => (
      <p key={i} className="mb-6 leading-relaxed">
        {para.split('\n').map((line, j) => (
          <React.Fragment key={j}>
            {line}
            {j < para.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>
    ));
  };

  const handleShare = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleHide = () => {
    setCoreStatus(prev => prev === 'hidden' ? 'published' : 'hidden');
  };

  const handleConfirmDelete = () => {
    setDeleteConfirmOpen(false);
    // Soft delete rule BR-DVL-036
    onNavigate?.('/devlogs');
  };

  const handleSubmitAppeal = () => {
    if (!appealMessage.trim()) return;
    setAppealStatus('submitted');
  };

  return (
    <div className="min-h-screen bg-surface-0 pb-32 relative">
      <DevMatrixPanel fields={devFields} />
      
      {/* SINGLE-COLUMN LAYOUT */}
      <div className="max-w-[1000px] mx-auto px-4 md:px-8 pt-12 md:pt-16">
        
        {/* Navigation & Author Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 md:mb-12">
          <button 
            onClick={() => onNavigate?.('/devlogs')}
            className="flex items-center gap-2 text-body-sm font-bold text-textTertiary hover:text-textPrimary transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Назад в ленту
          </button>

          {canManage && (
            <div className="flex flex-wrap items-center gap-2 bg-surface-1 border border-borderDef p-1.5 rounded-2xl">
              <button
                onClick={() => onNavigate?.(`/devlog-editor?id=${post.id}`)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[13px] font-bold text-textPrimary hover:bg-surface-2 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 text-accent" /> Редактировать
              </button>
              
              <button
                onClick={handleToggleHide}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[13px] font-bold text-textSecondary hover:text-textPrimary hover:bg-surface-2 transition-colors"
              >
                <EyeOff className="w-3.5 h-3.5" />
                {coreStatus === 'hidden' ? 'Опубликовать' : 'Скрыть'}
              </button>

              <button
                onClick={() => setDeleteConfirmOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[13px] font-bold text-danger hover:bg-danger/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Удалить
              </button>
            </div>
          )}
        </div>

        {/* BR-DVL-037, FR-DVL-029: Archived Game Banner */}
        {isArchived && (
          <div className="mb-10 p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-4">
            <div className="p-2 bg-amber-500/20 text-amber-500 rounded-xl shrink-0 mt-0.5">
              <Archive className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-[15px] font-bold text-amber-400 mb-1 flex items-center gap-2">
                Архивный девлог: игра больше недоступна
                <span className="text-[11px] font-black uppercase tracking-widest px-2 py-0.5 bg-amber-500/20 rounded">Архив</span>
              </h4>
              <p className="text-body-sm text-amber-200/80 leading-relaxed">
                {post.archiveReason || 'Проект игры был удален или снят с публикации автором. Данный девлог сохранен в режиме архива для истории и образовательного обмена опытом.'}
              </p>
            </div>
          </div>
        )}

        {/* BR-DVL-031, BR-DVL-033, FR-DVL-025, FR-DVL-026: Author Block & Appeal UI */}
        {isPostBlocked && (
          <div className="mb-10 p-6 rounded-3xl bg-danger/10 border border-danger/30">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-2 bg-danger/20 text-danger rounded-xl shrink-0 mt-0.5">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-lg font-black text-danger">Запись заблокирована модератором</h4>
                  <span className="text-[11px] font-black uppercase tracking-widest px-2 py-0.5 bg-danger/20 text-danger rounded">Блокировка</span>
                </div>
                <p className="text-body-sm text-danger/90 font-medium mb-2">
                  <strong>Причина блокировки:</strong> {post.blockReason || 'Нарушение правил сообщества (несанкционированный контент).'}
                </p>
                <p className="text-[13px] text-textSecondary leading-relaxed">
                  Пост скрыт от публичных пользователей. Вы можете внести правки в редакторе или подать апелляцию на повторное рассмотрение модератором.
                </p>
              </div>
            </div>

            {/* Appeal Actions */}
            <div className="mt-4 pt-4 border-t border-danger/20">
              {appealStatus === 'none' && (
                <div className="flex flex-wrap gap-3">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => onNavigate?.(`/devlog-editor?id=${post.id}`)}
                    className="font-bold"
                  >
                    <Edit3 className="w-3.5 h-3.5 mr-1.5" /> Исправить в редакторе
                  </Button>
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => setAppealStatus('writing')}
                    className="bg-danger hover:bg-danger/90 text-white font-bold"
                  >
                    Подать апелляцию
                  </Button>
                </div>
              )}

              {appealStatus === 'writing' && (
                <div className="space-y-3">
                  <label className="text-[13px] font-bold text-textPrimary block">
                    Пояснение для модератора:
                  </label>
                  <textarea
                    value={appealMessage}
                    onChange={(e) => setAppealMessage(e.target.value)}
                    placeholder="Опишите, какие правки были внесены или почему блокировка была ошибочной..."
                    className="w-full bg-surface-1 border border-danger/30 focus:border-danger rounded-2xl p-3.5 text-body-sm text-textPrimary outline-none min-h-[90px] resize-none"
                  />
                  <div className="flex items-center gap-3">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleSubmitAppeal}
                      disabled={!appealMessage.trim()}
                      className="bg-danger hover:bg-danger/90 text-white font-bold"
                    >
                      <Send className="w-3.5 h-3.5 mr-1.5" /> Отправить апелляцию
                    </Button>
                    <button
                      onClick={() => setAppealStatus('none')}
                      className="text-[13px] font-bold text-textTertiary hover:text-textPrimary"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              )}

              {appealStatus === 'submitted' && (
                <div className="flex items-center gap-3 bg-surface-1 border border-danger/20 rounded-2xl p-3.5 text-body-sm text-success font-bold">
                  <Check className="w-4 h-4 text-success shrink-0" />
                  <span>Апелляция #AP-849 отправлена модераторам. Ожидайте уведомления о результатах проверки.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Hidden notice (BR-DVL-030) */}
        {coreStatus === 'hidden' && (
          <div className="mb-10 p-5 rounded-2xl bg-surface-1 border border-borderDef flex items-start gap-4">
            <EyeOff className="w-5 h-5 text-textSecondary shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[15px] font-bold text-textPrimary mb-1">Пост скрыт из публичного доступа</h4>
              <p className="text-body-sm text-textSecondary">
                Запись не отображается в общей ленте и ленте игры. Доступна только автору и менеджеру команды.
              </p>
            </div>
          </div>
        )}

        {/* Header Metadata */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="text-caption font-black uppercase tracking-widest text-textPrimary bg-surface-2 px-2.5 py-1 rounded-md">
            {post.type.replace('_', ' ')}
          </span>

          {post.jamName && (
            <span className="text-caption font-bold text-warning bg-warning/10 border border-warning/20 px-2.5 py-1 rounded-md flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5" /> {post.jamName}
            </span>
          )}

          <div className="flex items-center gap-1.5 text-body-sm font-medium text-textTertiary">
            <span>
              {new Date(post.publishedAt || post.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            {isEdited && (
              canManage ? (
                <button 
                  onClick={() => setEditHistoryOpen(true)}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-bold text-accent hover:bg-accent/10 transition-colors ml-1 cursor-pointer"
                  title="Нажмите, чтобы просмотреть историю изменений"
                >
                  <History className="w-3 h-3" /> (отредактировано)
                </button>
              ) : (
                <span className="text-caption text-textTertiary ml-1 font-medium" title="Запись была отредактирована автором">
                  (изм.)
                </span>
              )
            )}
          </div>

          <div className="flex items-center gap-1.5 text-textTertiary text-body-sm ml-auto">
            <Eye className="w-4 h-4" /> {post.normalizedViews}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-black text-textPrimary tracking-tight leading-[1.15] mb-8">
          {post.title}
        </h1>

        {/* Author Block */}
        <div className="flex items-center gap-3 mb-10 pb-8 border-b border-borderDef/50">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-2">
            {post.authorAvatarUrl ? (
              <img src={post.authorAvatarUrl} alt={post.authorNick} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-textSecondary font-bold text-body-sm">
                {post.authorNick.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <div className="text-[15px] font-bold text-textPrimary">{post.authorNick}</div>
            <div className="text-[13px] font-medium text-textTertiary">
              {post.publisherType === 'team' ? `Команда: ${post.publisherName}` : 'Независимый разработчик'}
              {post.gameName && (
                <span> • Игра: {isArchived ? <span className="line-through opacity-70">{post.gameName} (недоступна)</span> : post.gameName}</span>
              )}
            </div>
          </div>
        </div>

        {/* Cover Image */}
        {post.coverUrl && (
          <div className="w-full aspect-[16/9] mb-12 rounded-2xl overflow-hidden bg-surface-1 border border-borderDef/30">
            <img src={post.coverUrl} alt="Обложка" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Main Content */}
        <article className="prose prose-invert prose-lg max-w-none text-[17px] md:text-[19px] text-textSecondary leading-relaxed md:leading-[1.8] mb-12">
          {renderMarkdown(post.bodyMarkdown)}
        </article>

        {/* Recruitment Widget */}
        {post.type === 'looking_for_team' && post.recruitmentDetails && (
          <div className="mb-12 bg-info/5 rounded-3xl p-6 md:p-8 border border-info/20">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-info" />
              <h3 className="text-2xl font-black text-textPrimary tracking-tight">Открытые вакансии</h3>
            </div>
            <div className="mb-6">
              <div className="text-xs font-bold text-info uppercase tracking-widest mb-3">Ищем специалистов</div>
              <div className="flex flex-wrap gap-2">
                {post.recruitmentDetails.roles.map(role => (
                  <span key={role} className="px-3 py-1 bg-surface-0 border border-info/20 text-body-sm font-bold text-textPrimary rounded-lg">
                    {role}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-[16px] text-textSecondary leading-relaxed mb-6">{post.recruitmentDetails.summary}</p>
            <Button variant="primary" className="w-full sm:w-auto px-8 font-bold">Откликнуться</Button>
          </div>
        )}

        {/* Feedback Widget */}
        {post.type === 'need_feedback' && post.feedbackDetails && (
          <div className="mb-12 bg-warning/5 rounded-3xl p-6 md:p-8 border border-warning/20">
            <div className="flex items-center gap-3 mb-6">
              <Gamepad2 className="w-6 h-6 text-warning" />
              <h3 className="text-2xl font-black text-textPrimary tracking-tight">Нужен фидбек</h3>
            </div>
            <div className="mb-6">
              <div className="text-xs font-bold text-warning uppercase tracking-widest mb-3">Направления</div>
              <div className="flex flex-wrap gap-2">
                {post.feedbackDetails.feedbackCategories.map(cat => (
                  <span key={cat} className="px-3 py-1 bg-surface-0 border border-warning/20 text-body-sm font-bold text-textPrimary rounded-lg">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
            {post.feedbackDetails.questions.length > 0 && (
              <div>
                <div className="text-xs font-bold text-warning uppercase tracking-widest mb-3">Вопросы к тестерам</div>
                <ul className="space-y-3">
                  {post.feedbackDetails.questions.map((q, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-[15px] text-textSecondary font-medium">
                      <span className="font-black text-warning shrink-0">{idx + 1}.</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-12">
            {post.tags.map(tag => (
              <span key={tag} className="text-body-sm font-medium text-textTertiary hover:text-textPrimary cursor-pointer transition-colors">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* POST FOOTER */}
        <div className="flex flex-wrap items-center justify-between gap-6 py-6 border-y border-borderDef/50 mb-16">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => !isConcreteAuthor && setIsLiked(!isLiked)}
              disabled={isConcreteAuthor}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-body-sm transition-all ${
                isConcreteAuthor 
                  ? 'bg-surface-2 text-textTertiary cursor-not-allowed opacity-60' 
                  : isLiked 
                    ? 'bg-danger/10 text-danger border border-danger/20' 
                    : 'bg-surface-1 text-textPrimary hover:bg-surface-2 border border-borderDef/50'
              }`}
              title={isConcreteAuthor ? "Вы не можете лайкнуть собственный пост" : ""}
            >
              <Heart className={`w-4 h-4 ${isLiked && !isConcreteAuthor ? 'fill-danger text-danger' : ''}`} />
              {post.likesCount + (isLiked && !isConcreteAuthor ? 1 : 0)}
            </button>

            <button 
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-1 hover:bg-surface-2 border border-borderDef/50 font-bold text-body-sm text-textPrimary transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-success" /> : <Share2 className="w-4 h-4 text-textSecondary" />}
              {copied ? 'Скопировано' : 'Поделиться'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            {canPin && (
              <button 
                onClick={() => setIsPinned(!isPinned)}
                className={`p-2.5 rounded-xl border transition-all ${isPinned ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-transparent border-transparent hover:bg-surface-1 text-textTertiary hover:text-textPrimary'}`}
                title="Закрепить пост"
              >
                <Bookmark className={`w-4 h-4 ${isPinned ? 'fill-accent' : ''}`} /> 
              </button>
            )}
            {isEdited && canManage && (
              <button 
                onClick={() => setEditHistoryOpen(true)}
                className="p-2.5 rounded-xl text-textTertiary hover:text-textPrimary hover:bg-surface-1 transition-all cursor-pointer" 
                title="История изменений"
              >
                <Clock className="w-4 h-4" /> 
              </button>
            )}
            <button 
              onClick={() => {
                if (role === 'guest') {
                  openAuthModal('LOGIN');
                  return;
                }
                setReportSuccess(false);
                setReportDetails('');
                setReportReason('spam');
                setIsReportModalOpen(true);
              }}
              className="p-2.5 rounded-xl text-textTertiary hover:text-danger hover:bg-surface-1 transition-all cursor-pointer" 
              title="Пожаловаться на запись"
            >
              <Flag className="w-4 h-4" /> 
            </button>
          </div>
        </div>

        {/* COMMENTS (BR-DVL-053, FR-DVL-045) */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <h3 className="text-2xl font-black text-textPrimary tracking-tight">Комментарии</h3>
            <span className="text-textTertiary text-[16px] font-bold">{post.commentsCount}</span>
          </div>
          
          {commentsState === 'disabled_by_author' && (
            <div className="mb-8 p-5 bg-surface-1 rounded-2xl border border-borderDef flex items-center gap-4">
              <MessageSquareOff className="w-5 h-5 text-textTertiary shrink-0" />
              <div>
                <h4 className="text-body-sm font-bold text-textPrimary">Комментирование закрыто автором</h4>
                <p className="text-[13px] text-textTertiary">
                  Новые комментарии не принимаются. Существующие комментарии сохранены для чтения.
                </p>
              </div>
            </div>
          )}

          {commentsState === 'closed' && (
            <div className="mb-8 p-5 bg-danger/5 rounded-2xl border border-danger/20 flex items-center gap-4">
              <Lock className="w-5 h-5 text-danger shrink-0" />
              <div>
                <h4 className="text-body-sm font-bold text-danger">Комментирование закрыто модератором</h4>
                <p className="text-[13px] text-danger/70">
                  Ветка комментариев заморожена администрацией платформы.
                </p>
              </div>
            </div>
          )}

          {/* Comment Form if comments are active */}
          {commentsState === 'open' && (
            <div className="mb-10">
              {role === 'guest' ? (
                <div className="p-6 bg-surface-1 border border-borderDef/50 rounded-2xl flex items-center justify-between gap-4">
                  <span className="text-body-sm text-textSecondary font-medium">Войдите, чтобы оставить комментарий</span>
                  <Button variant="primary" size="sm" onClick={() => openAuthModal('LOGIN')}>Войти</Button>
                </div>
              ) : (
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface-2 flex-shrink-0" />
                  <div className="flex-1 bg-surface-1 rounded-2xl border border-borderDef focus-within:border-accent transition-colors overflow-hidden">
                    <textarea 
                      placeholder="Написать комментарий..."
                      className="w-full bg-transparent p-4 text-[15px] outline-none resize-none placeholder:text-textTertiary min-h-[100px]"
                    />
                    <div className="flex justify-between items-center p-3 border-t border-borderDef/30 bg-surface-1/50">
                      <div className="text-xs text-textTertiary px-2">Поддерживается Markdown</div>
                      <Button variant="primary" className="px-5 py-2 font-bold text-[13px]">Отправить</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Preserved Comments List (visible even if comments disabled per BR-DVL-053) */}
          <div className="space-y-6">
            <div className="flex gap-4 p-5 rounded-2xl bg-surface-1/50 border border-borderDef/30">
              <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center font-bold text-textPrimary flex-shrink-0">
                T
              </div>
              <div className="flex-1 pt-0.5">
                <div className="flex items-center gap-2 mb-1">
                  <div className="text-body-sm font-bold text-textPrimary">ToxiK</div>
                  <div className="text-caption font-medium text-textTertiary">2 часа назад</div>
                </div>
                <p className="text-[15px] text-textSecondary leading-relaxed mb-3">
                  Отличное обновление! Жду не дождусь, когда можно будет поиграть в бету.
                </p>
                <div className="flex items-center gap-4">
                  {commentsState === 'open' && (
                    <button className="text-caption font-bold text-textTertiary hover:text-textPrimary transition-colors">
                      Ответить
                    </button>
                  )}
                  <button className="text-caption font-bold text-textTertiary hover:text-textPrimary transition-colors flex items-center gap-1.5">
                    <Heart className="w-3 h-3" /> 2
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Edit History Modal (FR-DVL-040, BR-DVL-049) */}
      {editHistoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-surface-1 border border-borderDef rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative">
            <button 
              onClick={() => setEditHistoryOpen(false)}
              className="absolute top-6 right-6 text-textTertiary hover:text-textPrimary transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-accent/10 text-accent rounded-2xl">
                <History className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-textPrimary">История изменений записи</h3>
                <span className="text-caption font-bold text-textTertiary">Аудит изменений</span>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="p-4 rounded-2xl bg-surface-2/60 border border-borderDef/50 flex items-start justify-between gap-4">
                <div>
                  <div className="text-body-sm font-bold text-textPrimary mb-0.5">Текущая версия (v2)</div>
                  <div className="text-caption text-textTertiary">Текст девлога обновлен автором</div>
                </div>
                <span className="text-caption font-bold text-accent px-2 py-1 rounded bg-accent/10">
                  {new Date(post.updatedAt).toLocaleDateString('ru-RU')}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-surface-2/30 border border-borderDef/30 flex items-start justify-between gap-4">
                <div>
                  <div className="text-body-sm font-bold text-textPrimary mb-0.5">Первоначальная публикация (v1)</div>
                  <div className="text-caption text-textTertiary">Запись размещена в публичной ленте</div>
                </div>
                <span className="text-caption font-bold text-textTertiary px-2 py-1 rounded bg-surface-3">
                  {new Date(post.publishedAt || post.createdAt).toLocaleDateString('ru-RU')}
                </span>
              </div>
            </div>

            <p className="text-[13px] text-textTertiary leading-relaxed mb-6">
              Платформа сохраняет дату первоначальной публикации и фиксирует факт правок для защиты пользователей от подмены информации.
            </p>

            <Button variant="secondary" className="w-full font-bold" onClick={() => setEditHistoryOpen(false)}>
              Закрыть
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal (BR-DVL-036) */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-surface-1 border border-danger/30 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative">
            <div className="flex items-center gap-3 mb-5 text-danger">
              <div className="p-3 bg-danger/10 rounded-2xl">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black">Удалить этот девлог?</h3>
            </div>

            <p className="text-body-sm text-textSecondary leading-relaxed mb-6">
              Запись будет снята с публикации (soft-delete). Заголовок и метаданные останутся в архиве для аудита модерации.
            </p>

            <div className="flex items-center gap-3">
              <Button 
                variant="primary" 
                onClick={handleConfirmDelete}
                className="flex-1 bg-danger hover:bg-danger/90 text-white font-bold py-3"
              >
                Да, удалить
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => setDeleteConfirmOpen(false)}
                className="flex-1 font-bold py-3"
              >
                Отмена
              </Button>
            </div>
          </div>
        </div>
      )}

          {/* Report Modal (FE-DVL-011, Section 17) */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-surface-1 border border-borderDef rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative animate-scaleUp">
            <button 
              onClick={() => setIsReportModalOpen(false)}
              className="absolute top-6 right-6 text-textTertiary hover:text-textPrimary transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 bg-danger/10 text-danger rounded-2xl">
                <Flag className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-textPrimary">Пожаловаться на запись</h3>
                <span className="text-caption font-bold text-textTertiary">Модерация контента</span>
              </div>
            </div>

            {reportSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-success/10 text-success flex items-center justify-center mx-auto">
                  <Check className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-bold text-textPrimary">Жалоба принята</h4>
                <p className="text-xs text-textSecondary leading-relaxed">
                  Спасибо за бдительность. Модераторы платформы рассмотрят обращение. По правилам сообщества, факт жалобы не скрывает пост автоматически до вердикта модератора.
                </p>
                <Button variant="primary" className="w-full mt-4" onClick={() => setIsReportModalOpen(false)}>
                  Понятно
                </Button>
              </div>
            ) : (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  setReportSuccess(true);
                }} 
                className="space-y-4"
              >
                <p className="text-xs text-textSecondary leading-relaxed">
                  Укажите причину жалобы. По правилам платформы, количество жалоб не скрывает публикацию автоматически:
                </p>

                <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                  {[
                    { id: 'spam', label: 'Спам, флуд или реклама' },
                    { id: 'harassment', label: 'Оскорбления или домогательства' },
                    { id: 'prohibited_content', label: 'Запрещенный правилами контент' },
                    { id: 'fraud', label: 'Мошенничество или обман' },
                    { id: 'malicious_link', label: 'Вредоносные ссылки / вредоносное ПО' },
                    { id: 'copyright', label: 'Нарушение авторских прав' },
                    { id: 'other', label: 'Другое нарушение правил' }
                  ].map(r => (
                    <label 
                      key={r.id} 
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        reportReason === r.id 
                          ? 'border-accent bg-accent/5' 
                          : 'border-borderDef/60 bg-surface-2/40 hover:bg-surface-2'
                      }`}
                    >
                      <input
                        type="radio"
                        name="report_reason"
                        value={r.id}
                        checked={reportReason === r.id}
                        onChange={() => setReportReason(r.id as any)}
                        className="accent-accent"
                      />
                      <span className="text-xs font-semibold text-textPrimary">{r.label}</span>
                    </label>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-bold text-textSecondary mb-1.5">
                    Дополнительные детали {reportReason === 'other' && <span className="text-danger">*</span>}
                  </label>
                  <textarea
                    value={reportDetails}
                    required={reportReason === 'other'}
                    onChange={e => setReportDetails(e.target.value)}
                    placeholder="Поясните подробнее суть нарушения правил..."
                    className="w-full h-20 bg-surface-2 border border-borderDef focus:border-accent rounded-xl p-3 text-xs text-textPrimary outline-none resize-none leading-relaxed placeholder:text-textTertiary"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="secondary" className="flex-1 font-bold text-xs" onClick={() => setIsReportModalOpen(false)}>
                    Отмена
                  </Button>
                  <Button type="submit" variant="danger" className="flex-1 font-bold text-xs">
                    Отправить жалобу
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

</div>
  );
}

