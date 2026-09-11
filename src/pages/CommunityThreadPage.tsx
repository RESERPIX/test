import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  ChevronRight, Heart, Share2, Flag, Bell, MessageSquare, 
  CheckCircle, MoreVertical, Trophy, Eye, HelpCircle, Image as ImageIcon,
  UserCheck, Inbox, Check, X, Send, CheckCircle2, ShieldAlert,
  Pin, Sparkles, Lock, Unlock, Edit3, Trash2, CheckCheck, CornerDownRight,
  AlertTriangle, Info, ExternalLink, ShieldCheck,
  Clock, FolderSync
} from 'lucide-react';
import { 
  MOCK_COMMUNITY_CATEGORIES,
  getStoredCommunityThreads,
  updateCommunityThread,
  getStoredCommunityComments,
  addCommunityComment,
  addCommunityReply,
  updateCommunityComment,
  deleteCommunityComment,
  isThreadLiked,
  toggleLikeThread,
  isThreadFollowed,
  toggleFollowThread,
  saveStoredCommunityComments
} from '../data/communityMockData';
import { CommunityThreadType, CommunityDiscussionState, CommunityThread } from '../types/community';
import { CommunityComment } from '../types/communityComment';
import Button from '../components/ui/Button';
import DevMatrixPanel, { DevMatrixField } from '../components/DevMatrixPanel';
import ScopedForbiddenNotice from '../components/ui/ScopedForbiddenNotice';

// Utility badges
const TypeBadge = ({ type }: { type: CommunityThreadType }) => {
  switch (type) {
    case 'looking_for_team':
      return <span className="bg-accent/20 text-accent text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest">Ищу команду</span>;
    case 'need_feedback':
      return <span className="bg-info/20 text-info text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest">Нужен фидбек</span>;
    case 'show_progress':
      return <span className="bg-celebratory/20 text-celebratory text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest">Прогресс</span>;
    case 'share_reference':
      return <span className="bg-textSecondary/20 text-textSecondary text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest">Источник</span>;
    default:
      return null;
  }
};

export default function CommunityThreadPage({ 
  threadId, 
  onNavigate 
}: { 
  threadId: string; 
  onNavigate?: (path: string) => void;
}) {
  const [thread, setThread] = useState<CommunityThread | undefined>(() => {
    return getStoredCommunityThreads().find(t => t.id === threadId);
  });
  const [comments, setComments] = useState<CommunityComment[]>(() => {
    return getStoredCommunityComments(threadId);
  });
  const [replyContent, setReplyContent] = useState('');

  // Toast feedback state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' | 'danger' } | null>(null);
  const triggerToast = (message: string, type: 'success' | 'info' | 'warning' | 'danger' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, 3800);
  };

  // Like & Follow states
  const [isLiked, setIsLiked] = useState<boolean>(() => isThreadLiked(threadId));
  const [isFollowed, setIsFollowed] = useState<boolean>(() => isThreadFollowed(threadId));

  // Delete Thread Modal State (COM-API-009, BR-COM-021)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Report Modal State (COM-API-015, BR-COM-065)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<{ type: 'thread' | 'comment'; id: string; authorNick?: string } | null>(null);
  const [reportReason, setReportReason] = useState<'spam' | 'harassment' | 'warez' | 'fraud' | 'copyright' | 'other'>('spam');
  const [reportDetails, setReportDetails] = useState('');

  // Category Change Modal (COM-API-043, BR-COM-015)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedNewCategoryId, setSelectedNewCategoryId] = useState<string>('');

  // Revisions Modal (COM-API-027, COM-API-028, FR-COM-075)
  const [revisionsModalOpen, setRevisionsModalOpen] = useState(false);
  const [revisionsData, setRevisionsData] = useState<{
    targetTitle: string;
    items: { version: number; authorNick: string; date: string; content: string; title?: string; changeNote?: string }[];
  } | null>(null);

  // Runtime Visibility Check for share_reference (FR-COM-101, FR-COM-102)
  const [referenceSourceAvailable, setReferenceSourceAvailable] = useState<boolean>(true);

  // LightBox Modal for ShowProgress
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Appeal input state for blocked thread (BR-COM-066, COM-API-029)
  const [appealText, setAppealText] = useState('');
  const [appealSubmitted, setAppealSubmitted] = useState(false);

  useEffect(() => {
    const found = getStoredCommunityThreads().find(t => t.id === threadId);
    if (found) {
      setThread(found);
      setIsLiked(isThreadLiked(threadId));
      setIsFollowed(isThreadFollowed(threadId));
    }
    setComments(getStoredCommunityComments(threadId));
  }, [threadId]);


  // LFT Candidate Applications (BR-COM-049, SC-COM-039, SC-COM-040)
  interface CandidateApplication {
    id: string;
    candidateNick: string;
    candidateAvatar: string;
    message: string;
    createdAt: string;
    contactsRequested: boolean;
  }

  const [applications, setApplications] = useState<CandidateApplication[]>([
    {
      id: 'app-1',
      candidateNick: 'pixel_artist',
      candidateAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pixel',
      message: 'Привет! Занимаюсь пиксель-артом 3 года, работал над двумя джемами, готов вписаться в проект на RevShare.',
      createdAt: '1 час назад',
      contactsRequested: false
    }
  ]);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applyMessage, setApplyMessage] = useState('');
  const [hasApplied, setHasApplied] = useState(false);
  const [isCloseReasonModalOpen, setIsCloseReasonModalOpen] = useState(false);
  const [selectedCloseReason, setSelectedCloseReason] = useState<'team_found' | 'no_longer_needed' | 'project_cancelled' | 'other'>('team_found');

  // Body scroll lock & Escape listener for open modals
  const isAnyModalOpen = isDeleteModalOpen || isReportModalOpen || isCategoryModalOpen || Boolean(revisionsModalOpen && revisionsData) || isApplyModalOpen || isCloseReasonModalOpen;
  useEffect(() => {
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAnyModalOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDeleteModalOpen(false);
        setIsReportModalOpen(false);
        setIsCategoryModalOpen(false);
        setRevisionsModalOpen(false);
        setIsApplyModalOpen(false);
        setIsCloseReasonModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // NeedFeedback Structured Feedbacks (BR-COM-055, FR-COM-058, SC-COM-046)
  interface UserStructuredFeedback {
    id: string;
    authorNick: string;
    authorAvatar: string;
    categories: string[];
    answers: { question: string; answer: string }[];
    freeText: string;
    createdAt: string;
  }

  const [activeFeedbackTab, setActiveFeedbackTab] = useState<'feedback' | 'comments'>('feedback');
  const [feedbacks, setFeedbacks] = useState<UserStructuredFeedback[]>([
    {
      id: 'fb-1',
      authorNick: 'indie_tester',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tester',
      categories: ['Gameplay', 'Balance'],
      answers: [
        { question: 'Чувствуется ли импакт?', answer: 'Да, анимации ударов очень сочные, но звук парирования глуховат.' },
        { question: 'Окно парирования слишком узкое?', answer: 'Окно около 150мс, для казуалов будет сложновато, лучше расширить до 200мс.' }
      ],
      freeText: 'В целом билд отличный, физика приятная. Играл в WebGL версии на Chrome, просадок не было.',
      createdAt: 'Вчера в 21:15'
    }
  ]);
  const [fbSelectedCats, setFbSelectedCats] = useState<string[]>([]);
  const [fbAnswers, setFbAnswers] = useState<{ [qIndex: number]: string }>({});
  const [fbFreeText, setFbFreeText] = useState('');
  const [fbSuccessMessage, setFbSuccessMessage] = useState<string | null>(null);
  
  // DEV MATRIX STATES
  const [authRole, setAuthRole] = useState<'guest'|'user'|'admin'>('user');
  const [isAuthor, setIsAuthor] = useState<boolean>(true);
  const [canWrite, setCanWrite] = useState<boolean>(true);
  
  // Matrix Fields
  const devFields: DevMatrixField[] = [
    {
      id: 'auth', label: 'Auth Role', type: 'select', value: authRole, onChange: setAuthRole,
      options: [
        { value: 'guest', label: 'Гость' },
        { value: 'user', label: 'Пользователь' },
        { value: 'admin', label: 'Админ (Staff)' },
      ]
    },
    {
      id: 'is_author', label: 'Я - автор темы', type: 'select', value: isAuthor ? 'true' : 'false', 
      onChange: (v) => setIsAuthor(v === 'true'),
      options: [
        { value: 'true', label: 'Да' },
        { value: 'false', label: 'Нет' }
      ]
    },
    {
      id: 'write_access', label: 'Право писать', type: 'select', value: canWrite ? 'true' : 'false', 
      onChange: (v) => setCanWrite(v === 'true'),
      options: [
        { value: 'true', label: 'Разрешено' },
        { value: 'false', label: 'Ограничено (Ban)' }
      ],
      highlight: !canWrite
    },
    {
      id: 'visibility', label: 'Статус видимости', type: 'select', value: thread?.visibilityState || 'published',
      onChange: (v) => thread && setThread({ ...thread, visibilityState: v }),
      options: [
        { value: 'published', label: 'Опубликовано' },
        { value: 'blocked', label: 'Заблокировано (Модерация)' },
        { value: 'hidden', label: 'Скрыто' }
      ]
    },
    {
      id: 'discussion', label: 'Статус обсуждения', type: 'select', value: thread?.discussionState || 'open',
      onChange: (v) => thread && setThread({ ...thread, discussionState: v as CommunityDiscussionState }),
      options: [
        { value: 'open', label: 'Открыто' },
        { value: 'locked', label: 'Закрыто (Locked)' },
        { value: 'archived', label: 'В архиве (Archived)' }
      ]
    },
    {
      id: 'ref_source', label: 'Доступность источника', type: 'select', value: referenceSourceAvailable ? 'true' : 'false',
      onChange: (v) => setReferenceSourceAvailable(v === 'true'),
      options: [
        { value: 'true', label: 'Доступен' },
        { value: 'false', label: 'Скрыт/Удален' }
      ]
    }
  ];

  const category = thread ? MOCK_COMMUNITY_CATEGORIES.find(c => c.id === thread.categoryId) : null;

  // BR-COM-084: Заблокированная/скрытая тема недоступна посторонним
  const isAccessible = thread && (
    thread.visibilityState === 'published' || 
    isAuthor || 
    authRole === 'admin'
  );

  if (!thread || !isAccessible) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center animate-fadeIn relative">
        <h2 className="text-2xl font-bold text-textPrimary mb-2">404 - Тема не найдена</h2>
        <p className="text-textSecondary mb-6">Возможно, она была удалена, скрыта автором или заблокирована модератором.</p>
        <Button variant="outline" onClick={() => onNavigate && onNavigate('/community')}>
          Вернуться в сообщество
        </Button>
        <DevMatrixPanel pageName="404 Тема" fields={devFields} bottomOffsetClass="bottom-0" />
      </div>
    );
  }

  // Permission conditions based on matrix
  const canReply = authRole !== 'guest' && canWrite && thread.discussionState === 'open';
  const showAuthorActions = isAuthor || authRole === 'admin';

  // --- THREAD ACTIONS (BR-COM-014 - BR-COM-029, COM-API-008 - COM-API-043) ---

  // 1. Like Thread
  const handleLikeThread = () => {
    if (authRole === 'guest') {
      triggerToast('Войдите, чтобы поставить лайк', 'warning');
      return;
    }
    const res = toggleLikeThread(threadId);
    setIsLiked(res.isLiked);
    setThread(prev => prev ? { ...prev, likesCount: res.count } : prev);
    triggerToast(res.isLiked ? 'Вам понравилась эта тема' : 'Лайк снят', 'info');
  };

  // 2. Follow / Subscribe Thread
  const handleToggleFollow = () => {
    if (authRole === 'guest') {
      triggerToast('Войдите, чтобы подписаться на обновления темы', 'warning');
      return;
    }
    const next = toggleFollowThread(threadId, undefined, 'manual');
    setIsFollowed(next);
    triggerToast(next ? 'Вы подписались на обновления темы' : 'Вы отписались от обновлений темы', 'info');
  };

  // 3. Share Thread
  const handleShareThread = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      triggerToast('Ссылка на тему скопирована в буфер обмена', 'success');
    } else {
      triggerToast('Ссылка готова для копирования', 'info');
    }
  };

  // 4. Report Thread / Comment
  const handleOpenReport = (type: 'thread' | 'comment', id: string, authorNick?: string) => {
    if (authRole === 'guest') {
      triggerToast('Войдите в аккаунт, чтобы отправить жалобу', 'warning');
      return;
    }
    setReportTarget({ type, id, authorNick });
    setReportReason('spam');
    setReportDetails('');
    setIsReportModalOpen(true);
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsReportModalOpen(false);
    triggerToast('Жалоба передана модераторам. Спасибо за бдительность!', 'success');
  };

  // 5. Hide / Show Toggle
  const handleToggleVisibility = () => {
    if (!thread) return;
    const nextVis = thread.visibilityState === 'published' ? 'hidden' : 'published';
    const updated = updateCommunityThread(threadId, { visibilityState: nextVis });
    if (updated) {
      setThread(updated);
      triggerToast(
        nextVis === 'hidden' 
          ? 'Тема скрыта из общего каталога' 
          : 'Тема снова опубликована и доступна всем',
        'info'
      );
    }
  };

  // 6. Close / Reopen Discussion Toggle
  const handleToggleDiscussion = () => {
    if (!thread) return;
    const nextDisc = thread.discussionState === 'open' ? 'archived' : 'open';
    const updated = updateCommunityThread(threadId, { discussionState: nextDisc });
    if (updated) {
      setThread(updated);
      triggerToast(
        nextDisc === 'archived'
          ? 'Обсуждение закрыто (архивировано). Новые ответы отключены'
          : 'Обсуждение возобновлено. Отправка ответов разрешена',
        'info'
      );
    }
  };


  // 8. Delete Thread Modal Handlers
  const handleConfirmDeleteThread = () => {
    if (!thread) return;
    updateCommunityThread(threadId, { deletedAt: new Date().toISOString() });
    triggerToast('Тема удалена. Перенаправление...', 'info');
    setIsDeleteModalOpen(false);
    setTimeout(() => {
      if (onNavigate) onNavigate('/community');
    }, 700);
  };

  // 9. Staff Controls (when authRole === 'admin')
  const handleTogglePin = () => {
    if (!thread) return;
    const nextPin = !thread.isPinned;
    const updated = updateCommunityThread(threadId, { isPinned: nextPin });
    if (updated) {
      setThread(updated);
      triggerToast(nextPin ? 'Тема закреплена в разделе' : 'Тема откреплена', 'info');
    }
  };

  const handleToggleOfficial = () => {
    if (!thread) return;
    const nextOff = !thread.isOfficial;
    const updated = updateCommunityThread(threadId, { isOfficial: nextOff });
    if (updated) {
      setThread(updated);
      triggerToast(nextOff ? 'Установлен маркер «Официально»' : 'Маркер «Официально» снят', 'info');
    }
  };

  const handleToggleFreeze = () => {
    if (!thread) return;
    const nextDisc = thread.discussionState === 'locked' ? 'open' : 'locked';
    const updated = updateCommunityThread(threadId, { discussionState: nextDisc });
    if (updated) {
      setThread(updated);
      triggerToast(nextDisc === 'locked' ? 'Тема заморожена модератором' : 'Тема разморожена', 'warning');
    }
  };

  const handleToggleBlock = () => {
    if (!thread) return;
    const nextVis = thread.visibilityState === 'blocked' ? 'published' : 'blocked';
    const updated = updateCommunityThread(threadId, { visibilityState: nextVis });
    if (updated) {
      setThread(updated);
      triggerToast(nextVis === 'blocked' ? 'Тема заблокирована модерацией' : 'Блокировка модерации снята', 'danger');
    }
  };

  // 10. ShowProgress: Generate DevLog draft (COM-API-023, BR-COM-059, BR-COM-060)
  const handleCreateDevLogDraft = () => {
    if (!thread) return;
    triggerToast(`Создан черновик DevLog для игры «${thread.linkedGameName || 'Cyber Quest'}»`, 'success');
    if (onNavigate) {
      onNavigate(`/devlog-editor?new=1&gameId=${thread.linkedGameId || 'brokenlore-follow'}&title=${encodeURIComponent(thread.title)}&provenanceThreadId=${thread.id}`);
    }
  };

  // Category Change Handlers (COM-API-043, BR-COM-015, FR-COM-018)
  const handleOpenCategoryModal = () => {
    if (!thread) return;
    if (authRole !== 'admin' && thread.repliesCount > 0) {
      triggerToast('Раздел нельзя изменить: в теме уже есть ответы. Для переноса темы обратитесь к модераторам', 'warning');
      return;
    }
    setSelectedNewCategoryId(thread.categoryId);
    setIsCategoryModalOpen(true);
  };

  const handleConfirmChangeCategory = () => {
    if (!thread || !selectedNewCategoryId || selectedNewCategoryId === thread.categoryId) {
      setIsCategoryModalOpen(false);
      return;
    }
    const updated = updateCommunityThread(thread.id, { categoryId: selectedNewCategoryId });
    if (updated) {
      setThread(updated);
      const cat = MOCK_COMMUNITY_CATEGORIES.find(c => c.id === selectedNewCategoryId);
      triggerToast(`Тема перенесена в раздел «${cat?.name || 'Новый раздел'}»`, 'success');
    }
    setIsCategoryModalOpen(false);
  };

  // Revisions Modal Handlers (COM-API-027, COM-API-028, FR-COM-075)
  const handleOpenThreadRevisions = () => {
    if (!thread) return;
    setRevisionsData({
      targetTitle: `История правок: «${thread.title}»`,
      items: [
        {
          version: 2,
          authorNick: thread.authorNick,
          date: thread.updatedAt,
          content: thread.bodyMarkdown,
          changeNote: 'Текущая редакция'
        },
        {
          version: 1,
          authorNick: thread.authorNick,
          date: thread.createdAt,
          content: thread.bodyMarkdown.slice(0, Math.floor(thread.bodyMarkdown.length * 0.75)) || thread.bodyMarkdown,
          changeNote: 'Исходная публикация'
        }
      ]
    });
    setRevisionsModalOpen(true);
  };

  const handleOpenCommentRevisions = (c: CommunityComment) => {
    setRevisionsData({
      targetTitle: `История правок сообщения от @${c.authorNick}`,
      items: [
        {
          version: 2,
          authorNick: c.authorNick,
          date: c.updatedAt || 'Недавно',
          content: c.bodyMarkdown,
          changeNote: 'Текущая редакция сообщения'
        },
        {
          version: 1,
          authorNick: c.authorNick,
          date: c.createdAt,
          content: 'Исходный текст комментария до внесения изменений...',
          changeNote: 'Исходная версия'
        }
      ]
    });
    setRevisionsModalOpen(true);
  };

  // 11. Appeal submit
  const handleAppealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appealText.trim()) return;
    setAppealSubmitted(true);
    triggerToast('Апелляция зарегистрирована и направлена администрации', 'success');
  };

  // Solution mark toggle (BR-COM-043, SC-COM-037)
  const handleToggleSolution = (commentId: string) => {
    if (!thread) return;
    const updatedComments = comments.map(c => {
      if (c.id === commentId) {
        const willBeSolution = !c.isSolution;
        return { ...c, isSolution: willBeSolution };
      }
      return { ...c, isSolution: false };
    });
    
    const hasSolution = updatedComments.some(c => c.isSolution);
    const solutionComment = updatedComments.find(c => c.isSolution);
    
    setComments(updatedComments);
    saveStoredCommunityComments(threadId, updatedComments);
    
    const updatedThread = updateCommunityThread(threadId, {
      isSolved: hasSolution,
      solutionPostId: solutionComment ? solutionComment.id : null
    });
    if (updatedThread) {
      setThread(updatedThread);
    }
    triggerToast(hasSolution ? 'Ответ отмечен как решение' : 'Отметка решения снята', 'success');
  };

  // LFT: Candidate applies
  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyMessage.trim()) return;
    const newApp: CandidateApplication = {
      id: `app-${Date.now()}`,
      candidateNick: 'CurrentUser',
      candidateAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=me',
      message: applyMessage.trim(),
      createdAt: 'Только что',
      contactsRequested: false
    };
    setApplications([newApp, ...applications]);
    setHasApplied(true);
    setIsApplyModalOpen(false);
    setApplyMessage('');
    triggerToast('Приватный отклик отправлен автору темы', 'success');
  };

  // LFT: Author requests candidate contacts
  const handleRequestContacts = (appId: string) => {
    setApplications(applications.map(a => a.id === appId ? { ...a, contactsRequested: true } : a));
    triggerToast('Запрос контактов отправлен кандидату', 'info');
  };

  // LFT: Close search with reason
  const handleConfirmCloseSearch = () => {
    if (!thread || !thread.lookingForTeamDetails) return;
    const updatedDetails = {
      ...thread.lookingForTeamDetails,
      searchState: 'closed' as const,
      closeReason: selectedCloseReason
    };
    const updatedThread = updateCommunityThread(threadId, {
      lookingForTeamDetails: updatedDetails
    });
    if (updatedThread) {
      setThread(updatedThread);
    }
    setIsCloseReasonModalOpen(false);
    triggerToast('Поиск команды закрыт', 'info');
  };

  // LFT: Reopen search
  const handleReopenSearch = () => {
    if (!thread || !thread.lookingForTeamDetails) return;
    const updatedDetails = {
      ...thread.lookingForTeamDetails,
      searchState: 'active' as const,
      closeReason: null
    };
    const updatedThread = updateCommunityThread(threadId, {
      lookingForTeamDetails: updatedDetails
    });
    if (updatedThread) {
      setThread(updatedThread);
    }
    triggerToast('Поиск команды снова активен', 'success');
  };

  // NeedFeedback: Submit structured feedback
  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fbSelectedCats.length === 0) {
      triggerToast('Выберите хотя бы одно оцениваемое направление', 'warning');
      return;
    }
    if (!fbFreeText.trim()) {
      triggerToast('Напишите общий комментарий с вашими впечатлениями', 'warning');
      return;
    }
    const questions = thread?.needFeedbackDetails?.questions || [];
    const answers = questions.map((q, idx) => ({
      question: q,
      answer: fbAnswers[idx] || '—'
    }));
    const newFb: UserStructuredFeedback = {
      id: `fb-${Date.now()}`,
      authorNick: 'CurrentUser',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=me',
      categories: fbSelectedCats,
      answers,
      freeText: fbFreeText.trim(),
      createdAt: 'Только что'
    };
    setFeedbacks([newFb, ...feedbacks]);
    setFbFreeText('');
    setFbAnswers({});
    setFbSelectedCats([]);
    setFbSuccessMessage('Ваш отзыв успешно передан автору!');
    triggerToast('Отзыв успешно отправлен', 'success');
    setTimeout(() => setFbSuccessMessage(null), 5000);
  };

  // Add Comment
  const handleAddComment = () => {
    if (!replyContent.trim() || !thread) return;
    const newComment: CommunityComment = {
      id: `p-${Date.now()}`,
      threadId,
      parentId: null,
      authorId: 'current_user',
      authorNick: 'CurrentUser',
      authorAvatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=me',
      isThreadAuthor: isAuthor,
      bodyMarkdown: replyContent.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likesCount: 0,
      isSolution: false,
      replies: []
    };
    const updated = addCommunityComment(threadId, newComment);
    setComments(updated);
    setReplyContent('');
    setThread(prev => prev ? { ...prev, repliesCount: prev.repliesCount + 1 } : prev);

    // Auto-follow thread on comment
    if (!isFollowed) {
      toggleFollowThread(threadId, true, 'auto_comment');
      setIsFollowed(true);
      triggerToast('Комментарий опубликован. Вы автоматически подписались на тему', 'success');
    } else {
      triggerToast('Комментарий опубликован', 'success');
    }
  };

  // Add Reply to existing comment
  const handleAddReply = (parentId: string, replyText: string) => {
    if (!replyText.trim() || !thread) return;
    const newReply: CommunityComment = {
      id: `p-${Date.now()}`,
      threadId,
      parentId,
      authorId: 'current_user',
      authorNick: 'CurrentUser',
      authorAvatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=me',
      isThreadAuthor: isAuthor,
      bodyMarkdown: replyText.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likesCount: 0,
      isSolution: false
    };
    const updated = addCommunityReply(threadId, parentId, newReply);
    setComments(updated);
    setThread(prev => prev ? { ...prev, repliesCount: prev.repliesCount + 1 } : prev);

    // Auto-follow thread on reply
    if (!isFollowed) {
      toggleFollowThread(threadId, true, 'auto_comment');
      setIsFollowed(true);
      triggerToast('Ответ опубликован. Вы подписались на тему', 'success');
    } else {
      triggerToast('Ответ опубликован', 'success');
    }
  };

  // Edit comment
  const handleEditComment = (commentId: string, newBody: string) => {
    const updated = updateCommunityComment(threadId, commentId, { bodyMarkdown: newBody });
    setComments(updated);
    triggerToast('Сообщение обновлено', 'info');
  };

  // Delete comment
  const handleDeleteComment = (commentId: string) => {
    const isModerator = authRole === 'admin';
    const updated = deleteCommunityComment(threadId, commentId, isModerator, isModerator ? 'Модерация' : '');
    setComments(updated);
    setThread(prev => prev && prev.repliesCount > 0 ? { ...prev, repliesCount: prev.repliesCount - 1 } : prev);
    triggerToast('Сообщение удалено', 'info');
  };

  // Like a comment
  const handleToggleLikeComment = (commentId: string, currentCount: number, hasLiked: boolean) => {
    if (authRole === 'guest') {
      triggerToast('Войдите, чтобы поставить лайк', 'warning');
      return;
    }
    const newCount = hasLiked ? Math.max(0, currentCount - 1) : currentCount + 1;
    const updated = updateCommunityComment(threadId, commentId, { likesCount: newCount });
    setComments(updated);
  };

  return (
    <div className="max-w-[1000px] mx-auto px-4 md:px-8 py-8">
      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slideUp">
          <div className={`px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-bold border backdrop-blur-md ${
            toast.type === 'success' ? 'bg-success/90 text-white border-success/40' :
            toast.type === 'danger' ? 'bg-danger/90 text-white border-danger/40' :
            toast.type === 'warning' ? 'bg-warning/90 text-black border-warning/40' :
            'bg-surface-3 text-textPrimary border-borderStrong'
          }`}>
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0" />}
            {toast.type === 'danger' && <AlertTriangle className="w-4 h-4 shrink-0" />}
            {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 shrink-0 text-accent" />}
            <span>{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-2 opacity-70 hover:opacity-100">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Breadcrumbs */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-textTertiary mb-8">
        <button onClick={() => onNavigate && onNavigate('/community')} className="hover:text-textPrimary transition-colors">Сообщество</button>
        <ChevronRight className="w-3 h-3" />
        <button className="hover:text-textPrimary transition-colors">{category?.name || 'Общее'}</button>
        <ChevronRight className="w-3 h-3" />
        <span className="text-textSecondary truncate max-w-[200px] sm:max-w-xs">{thread.title}</span>
      </div>

      {/* HEADER SECTION */}
      <div className="mb-10">
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <TypeBadge type={thread.type} />
          {thread.isOfficial && <span className="bg-reaction/10 text-reaction text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-widest flex items-center gap-1"><Sparkles className="w-3 h-3"/> Официально</span>}
          {thread.isPinned && <span className="bg-info/10 text-info text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-widest flex items-center gap-1"><Pin className="w-3 h-3"/> Закреплено</span>}
          {thread.isSolved && <span className="bg-success/10 text-success text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-widest flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Решено</span>}
          {thread.discussionState === 'locked' && <span className="bg-warning/10 text-warning text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-widest flex items-center gap-1"><Lock className="w-3 h-3"/> Заморожено</span>}
          {thread.discussionState === 'archived' && <span className="bg-surface-2 text-textTertiary text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-widest flex items-center gap-1"><Inbox className="w-3 h-3"/> Закрыто / В архиве</span>}
          
          <div className="ml-auto text-[11px] font-extrabold text-textTertiary uppercase tracking-widest">
             {category?.name || 'Общее'}
          </div>
        </div>
        
        <h1 className="text-3xl md:text-5xl font-extrabold text-textPrimary leading-tight mb-8 tracking-tight">
          {thread.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-textSecondary">
          <div className="flex items-center gap-3">
            <img src={thread.authorAvatarUrl} alt={thread.authorNick} className="w-10 h-10 rounded-full bg-surface-2 ring-2 ring-surface-0" />
            <div className="flex flex-col gap-0.5">
              <div className="text-textPrimary font-bold hover:underline cursor-pointer">@{thread.authorNick}</div>
              <div className="text-textTertiary font-medium text-[11px]">
                Опубликовано 2 часа назад {thread.updatedAt !== thread.createdAt && <span className="text-textTertiary italic">(ред.)</span>}
              </div>
            </div>
          </div>
          
          <div className="ml-auto flex items-center gap-4">
            {thread.linkedGameName && (
              <span className="text-textSecondary font-bold flex items-center gap-2 cursor-pointer hover:text-textPrimary transition-colors bg-surface-2/60 px-2.5 py-1 rounded-lg">
                <Trophy className="w-4 h-4 text-accent" />
                <span>{thread.linkedGameName}</span>
              </span>
            )}
            <div className="text-textTertiary font-bold" title="Просмотры (нормализованные)">
              <Eye className="w-4 h-4 inline-block mr-1 opacity-50" /> {thread.normalizedViews.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* HIDDEN ALERT (BR-COM-016) */}
      {thread.visibilityState === 'hidden' && (
        <div className="bg-surface-2/70 border-l-4 border-textSecondary p-5 mb-10 flex items-center justify-between gap-4 rounded-r-xl">
          <div className="flex items-center gap-4">
            <Eye className="w-5 h-5 text-textSecondary shrink-0" />
            <div className="text-sm font-medium text-textSecondary">
              Эта тема скрыта автором из публичного доступа. Она видна только вам и администрации.
            </div>
          </div>
          {showAuthorActions && (
            <Button variant="outline" size="sm" onClick={handleToggleVisibility}>
              Опубликовать
            </Button>
          )}
        </div>
      )}

      {/* MODERATION ALERT & APPEAL (BR-COM-066, COM-API-029) */}
      {thread.visibilityState === 'blocked' && (
        <div className="bg-danger/5 border-l-4 border-danger p-6 mb-10 rounded-r-xl">
          <div className="flex items-start gap-4">
            <ShieldAlert className="w-6 h-6 text-danger shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-base font-bold text-danger mb-2">Доступ к теме ограничен модератором</h3>
              <div className="text-sm font-medium text-textSecondary space-y-1 mb-5">
                <p><span className="text-textPrimary font-semibold">Причина блокировки:</span> Нарушение правил сообщества (Спам / Реклама)</p>
                <p><span className="text-textPrimary font-semibold">Комментарий модератора:</span> "Пожалуйста, не публикуйте реферальные или вредоносные ссылки"</p>
              </div>
              
              {appealSubmitted ? (
                <div className="bg-surface-1 p-4 rounded-lg flex items-center gap-3 text-success text-xs font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Ваша апелляция находится на рассмотрении администрации. Ответ поступит в уведомлениях.</span>
                </div>
              ) : (
                <form onSubmit={handleAppealSubmit} className="bg-surface-1 p-4 rounded-lg space-y-3 max-w-xl">
                  <h4 className="text-sm font-bold text-textPrimary">Подача апелляции (Appeal UI)</h4>
                  <p className="text-xs text-textSecondary">Если вы считаете блокировку ошибочной, отправьте запрос на повторное рассмотрение.</p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={appealText}
                      onChange={e => setAppealText(e.target.value)}
                      placeholder="Опишите причину несогласия..." 
                      className="flex-1 h-10 bg-surface-2 border border-borderDef rounded-md px-3 text-sm outline-none focus:border-danger transition-colors text-textPrimary" 
                      required
                    />
                    <Button type="submit" variant="outline" size="sm" className="border-danger/50 text-danger hover:bg-danger/10">
                      Отправить апелляцию
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DYNAMIC BLOCKS BASED ON TYPE */}
      {thread.type === 'looking_for_team' && thread.lookingForTeamDetails && (
        <div className="bg-surface-1/50 rounded-2xl p-6 md:p-8 mb-12 border border-borderDef/30 ring-1 ring-white/5 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-borderDef/50 relative flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <span className={`w-2 h-2 rounded-full ${thread.lookingForTeamDetails.searchState === 'active' ? 'bg-accent animate-pulse' : 'bg-textTertiary'}`} />
              </div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-sm font-extrabold text-textPrimary uppercase tracking-widest">Анкета поиска команды</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                  thread.lookingForTeamDetails.searchState === 'active' 
                    ? 'bg-success/15 text-success border border-success/30' 
                    : 'bg-surface-2 text-textTertiary border border-borderDef'
                }`}>
                  {thread.lookingForTeamDetails.searchState === 'active' ? 'Поиск активен' : 'Поиск закрыт'}
                </span>
              </div>
            </div>

            {(isAuthor || authRole === 'admin') && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  if (thread.lookingForTeamDetails?.searchState === 'active') {
                    setIsCloseReasonModalOpen(true);
                  } else {
                    handleReopenSearch();
                  }
                }}
                className="text-xs font-semibold"
              >
                {thread.lookingForTeamDetails.searchState === 'active' ? 'Закрыть поиск команды' : 'Возобновить поиск'}
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="md:col-span-2 space-y-6">
               <div>
                 <div className="text-[11px] font-extrabold text-textTertiary uppercase tracking-widest mb-3">Искомые роли</div>
                 <div className="flex flex-wrap gap-2">
                   {thread.lookingForTeamDetails.roles.map(r => (
                     <span key={r} className="px-3 py-1 bg-surface-2 rounded-md text-[13px] font-bold text-textPrimary ring-1 ring-borderDef/50">{r}</span>
                   ))}
                 </div>
               </div>
               
               {thread.lookingForTeamDetails.skills.length > 0 && (
                 <div>
                   <div className="text-[11px] font-extrabold text-textTertiary uppercase tracking-widest mb-3">Необходимые навыки</div>
                   <div className="flex flex-wrap gap-2 text-sm text-textSecondary font-medium">
                     {thread.lookingForTeamDetails.skills.map(s => (
                       <span key={s} className="px-2 py-0.5 bg-surface-1 rounded border border-borderDef/50">{s}</span>
                     ))}
                   </div>
                 </div>
               )}
            </div>
            <div className="space-y-6 md:pl-8 md:border-l md:border-borderDef/30">
              <div>
                 <div className="text-[11px] font-extrabold text-textTertiary uppercase tracking-widest mb-2">Формат участия</div>
                 <div className="text-[15px] font-bold text-textPrimary capitalize">{thread.lookingForTeamDetails.participationFormat}</div>
              </div>
              {thread.lookingForTeamDetails.engine && (
                <div>
                   <div className="text-[11px] font-extrabold text-textTertiary uppercase tracking-widest mb-2">Движок</div>
                   <div className="text-[15px] font-bold text-textPrimary">{thread.lookingForTeamDetails.engine}</div>
                </div>
              )}
            </div>

            {/* Candidate Apply Action (BR-COM-049, SC-COM-039) */}
            {!isAuthor && authRole !== 'admin' && thread.lookingForTeamDetails.searchState === 'active' && (
              <div className="col-span-1 md:col-span-3 mt-4 pt-6 border-t border-borderDef/40 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h4 className="text-sm font-bold text-textPrimary">Заинтересовала эта роль?</h4>
                  <p className="text-xs text-textSecondary">Отправьте приватный отклик автору со ссылкой на портфолио или о себе</p>
                </div>
                {hasApplied ? (
                  <div className="flex items-center gap-2 bg-success/10 text-success border border-success/30 px-3.5 py-2 rounded-xl text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Вы откликнулись на вакансию (Приватно)</span>
                  </div>
                ) : (
                  <Button 
                    variant="primary" 
                    icon={<UserCheck className="w-4 h-4" />}
                    disabled={authRole === 'guest' || !canWrite}
                    onClick={() => setIsApplyModalOpen(true)}
                  >
                    Откликнуться на вакансию
                  </Button>
                )}
              </div>
            )}

            {/* Author: Private Applications List (BR-COM-049, FR-COM-095) */}
            {(isAuthor || authRole === 'admin') && (
              <div className="col-span-1 md:col-span-3 mt-4 pt-6 border-t border-borderDef/40">
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <Inbox className="w-4 h-4 text-accent" />
                  <h4 className="text-xs font-bold text-textPrimary uppercase tracking-wider">
                    Поступило приватных откликов ({applications.length})
                  </h4>
                  <span className="text-[11px] text-textTertiary font-normal ml-auto">
                    Видны только вам как автору темы
                  </span>
                </div>
                {applications.length === 0 ? (
                  <p className="text-xs text-textTertiary italic">Пока нет откликов от кандидатов.</p>
                ) : (
                  <div className="space-y-3">
                    {applications.map(app => (
                      <div key={app.id} className="bg-surface-1/80 border border-borderDef/60 rounded-xl p-4 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                        <div className="flex items-start gap-3">
                          <img src={app.candidateAvatar} alt={app.candidateNick} className="w-8 h-8 rounded-full bg-surface-2 mt-0.5 shrink-0" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-textPrimary">@{app.candidateNick}</span>
                              <span className="text-[10px] text-textTertiary">{app.createdAt}</span>
                            </div>
                            <p className="text-xs text-textSecondary mt-1 leading-relaxed">{app.message}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Button 
                            variant={app.contactsRequested ? "secondary" : "outline"} 
                            size="sm"
                            className="text-xs"
                            disabled={app.contactsRequested}
                            onClick={() => handleRequestContacts(app.id)}
                          >
                            {app.contactsRequested ? 'Запрос отправлен' : 'Запросить контакты'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {thread.type === 'need_feedback' && thread.needFeedbackDetails && (
        <div className="bg-surface-1/50 rounded-2xl p-6 md:p-8 mb-12 border border-borderDef/30 ring-1 ring-white/5 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-info/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-borderDef/50 relative">
            <div className="w-8 h-8 rounded-lg bg-info/10 flex items-center justify-center">
              <HelpCircle className="w-4 h-4 text-info" />
            </div>
            <h3 className="text-sm font-extrabold text-textPrimary uppercase tracking-widest">Запрос фидбека</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="md:col-span-2 space-y-6">
              <div>
                 <div className="text-[11px] font-extrabold text-textTertiary uppercase tracking-widest mb-3">Направления для фидбека</div>
                 <div className="flex flex-wrap gap-2 text-[13px] font-bold text-textPrimary">
                   {thread.needFeedbackDetails.feedbackCategories.map(c => (
                     <span key={c} className="px-3 py-1 bg-surface-2 rounded-md ring-1 ring-borderDef/50">{c}</span>
                   ))}
                 </div>
              </div>
              {thread.needFeedbackDetails.questions.length > 0 && (
                <div>
                  <div className="text-[11px] font-extrabold text-textTertiary uppercase tracking-widest mb-3">Целевые вопросы к игрокам</div>
                  <ul className="space-y-3 text-sm text-textSecondary font-medium list-none">
                    {thread.needFeedbackDetails.questions.map((q, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-info font-bold mt-0.5">•</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="space-y-6 md:pl-8 md:border-l md:border-borderDef/30">
              {thread.needFeedbackDetails.platform.length > 0 && (
                <div>
                  <div className="text-[11px] font-extrabold text-textTertiary uppercase tracking-widest mb-3">Платформы тестирования</div>
                  <div className="flex flex-col gap-2">
                    {thread.needFeedbackDetails.platform.map(p => (
                       <div key={p} className="text-[14px] font-bold text-textPrimary">{p}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {thread.type === 'show_progress' && thread.showProgressDetails && (
        <div className="bg-surface-1/50 rounded-2xl p-6 md:p-8 mb-12 border border-borderDef/30 ring-1 ring-white/5 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-celebratory/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-borderDef/50 relative flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-celebratory/10 flex items-center justify-center">
                <ImageIcon className="w-4 h-4 text-celebratory" />
              </div>
              <h3 className="text-sm font-extrabold text-textPrimary uppercase tracking-widest">Медиа прогресса разработки</h3>
            </div>
            
            {(isAuthor || authRole === 'admin') && thread.linkedGameId && (
              <Button 
                variant="outline" 
                size="sm" 
                icon={<Trophy className="w-4 h-4 text-accent"/>}
                onClick={handleCreateDevLogDraft}
              >
                Создать DevLog на основе этого поста
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
            {thread.showProgressDetails.mediaUrls.map((url, i) => (
              <div 
                key={i} 
                onClick={() => setLightboxImage(url)}
                className="relative group/img cursor-pointer overflow-hidden rounded-xl aspect-video bg-surface-2 ring-1 ring-borderDef/50"
              >
                <img src={url} alt={`Progress ${i}`} className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-2">
                  <Eye className="w-4 h-4" /> Посмотреть в полном размере
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {thread.type === 'share_reference' && thread.shareReferenceDetails && (
        !referenceSourceAvailable ? (
          <div className="bg-surface-1/50 rounded-2xl p-6 mb-12 border border-dashed border-borderDef/60 flex items-center gap-4 text-textTertiary">
            <AlertTriangle className="w-6 h-6 text-warning shrink-0" />
            <div>
              <div className="text-sm font-bold text-textPrimary">Исходный материал скрыт, удален или недоступен для просмотра</div>
              <p className="text-xs text-textTertiary mt-0.5">Оригинальная публикация была перемещена или ограничена модерацией.</p>
            </div>
          </div>
        ) : (
        <div className="bg-surface-1/50 rounded-2xl p-6 md:p-8 mb-12 border border-borderDef/30 ring-1 ring-white/5 shadow-xl hover:border-accent/30 transition-colors relative group overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-textSecondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <div className="text-[10px] font-extrabold text-textTertiary uppercase tracking-widest mb-6 relative">
            ВЛОЖЕННЫЙ ИСТОЧНИК: {thread.shareReferenceDetails.sourceType === 'devlog' ? 'DEVLOG' : 'ДЖЕМ-ПОСТ'}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 relative">
             <div className="w-32 h-32 rounded-xl bg-surface-2 shrink-0 ring-1 ring-borderDef/50 flex items-center justify-center text-textTertiary">
               <ExternalLink className="w-8 h-8 opacity-40" />
             </div>
             <div className="flex-1 flex flex-col">
               <h4 className="text-lg font-extrabold text-textPrimary mb-2 leading-tight">{thread.shareReferenceDetails.sourceTitle}</h4>
               <div className="text-xs font-bold text-textTertiary mb-4">
                 @{thread.shareReferenceDetails.sourceAuthorNick} • 15 сентября 2026
               </div>
               <p className="text-sm text-textSecondary line-clamp-2 leading-relaxed mb-4 flex-1">
                 {thread.shareReferenceDetails.sourcePreview}
               </p>
               <button 
                 onClick={() => triggerToast(`Переход к внешнему источнику: ${thread.shareReferenceDetails?.sourceUrl}`, 'info')}
                 className="text-[13px] font-extrabold text-accent hover:text-textPrimary transition-colors flex items-center gap-1.5 mt-auto self-start"
               >
                 Читать оригинал ↗
               </button>
             </div>
          </div>
        </div>
        )
      )}

      {/* BODY CONTENT SECTION */}
      <div className="prose prose-invert max-w-none mb-10">
        <p className="text-base sm:text-lg leading-relaxed text-textSecondary whitespace-pre-wrap">
          {thread.bodyMarkdown}
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-10">
        <TypeBadge type={thread.type} />
        {thread.tags.map(tag => (
          <span key={tag} className="text-[13px] font-mono text-textTertiary hover:text-textPrimary transition-colors cursor-pointer bg-surface-2 px-2 py-0.5 rounded">
            #{tag}
          </span>
        ))}
      </div>

      {/* STAFF MODERATION QUICK PANEL (If Admin) */}
      {authRole === 'admin' && (
        <div className="mb-6 p-4 rounded-xl bg-accent/5 border border-accent/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-accent">
            <ShieldCheck className="w-4 h-4" />
            <span>Панель модератора (Staff Controls)</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleTogglePin} className="text-xs">
              {thread.isPinned ? 'Открепить' : 'Закрепить'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleToggleOfficial} className="text-xs">
              {thread.isOfficial ? 'Снять статус официальной' : 'Сделать официальной'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleToggleFreeze} className="text-xs">
              {thread.discussionState === 'locked' ? 'Разморозить ветку' : 'Заморозить обсуждение'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleToggleBlock} className="text-xs text-danger border-danger/40 hover:bg-danger/10">
              {thread.visibilityState === 'blocked' ? 'Разблокировать' : 'Заблокировать тему'}
            </Button>
          </div>
        </div>
      )}

      {/* ACTION BAR (All Buttons 100% Functional) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-borderDef/50 mb-14">
        <div className="flex flex-wrap items-center gap-1.5 -ml-2">
          {/* Like Thread Button */}
          <Button 
            variant={isLiked ? "secondary" : "ghost"} 
            size="sm" 
            icon={<Heart className={`w-4 h-4 ${isLiked ? 'fill-current text-danger' : ''}`} />}
            onClick={handleLikeThread}
            title="Поставить лайк"
          >
            {thread.likesCount}
          </Button>

          {/* Follow / Subscribe Thread Button */}
          <Button 
            variant={isFollowed ? "outline" : "ghost"} 
            size="sm" 
            icon={isFollowed ? <CheckCheck className="w-4 h-4 text-accent" /> : <Bell className="w-4 h-4" />}
            onClick={handleToggleFollow}
            title="Следить за обновлениями темы"
          >
            {isFollowed ? 'Вы подписаны' : 'Следить'}
          </Button>

          <div className="w-px h-4 bg-borderDef/50 mx-2 hidden sm:block" />

          {/* Share Thread Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            icon={<Share2 className="w-4 h-4" />}
            onClick={handleShareThread}
            title="Скопировать ссылку"
          >
            Поделиться
          </Button>

          {/* Report Thread Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            icon={<Flag className="w-4 h-4 text-textTertiary" />} 
            onClick={() => handleOpenReport('thread', thread.id, thread.authorNick)}
            className="text-textTertiary hover:text-textSecondary"
            title="Пожаловаться на тему"
          >
            Пожаловаться
          </Button>
        </div>
        
        {/* Author / Mod Action Controls */}
        {showAuthorActions && (
          <div className="flex items-center gap-3 text-xs font-bold text-textTertiary sm:ml-auto">
             <button 
               onClick={handleOpenThreadRevisions}
               className="hover:text-textPrimary transition-colors flex items-center gap-1"
               title="История правок темы"
             >
               <Clock className="w-3.5 h-3.5" /> История правок
             </button>
             <button 
               onClick={handleOpenCategoryModal}
               className="hover:text-textPrimary transition-colors flex items-center gap-1"
               title="Сменить категорию темы"
             >
               <FolderSync className="w-3.5 h-3.5" /> Сменить раздел
             </button>
             <button 
               onClick={() => onNavigate && onNavigate(`/community/thread/${thread.id}/edit`)} 
               className="hover:text-textPrimary transition-colors flex items-center gap-1"
             >
               <Edit3 className="w-3.5 h-3.5" /> Редактировать
             </button>
             <button 
               onClick={handleToggleVisibility} 
               className="hover:text-textPrimary transition-colors"
             >
               {thread.visibilityState === 'hidden' ? 'Опубликовать' : 'Скрыть'}
             </button>
             <button 
               onClick={handleToggleDiscussion} 
               className="hover:text-textPrimary transition-colors"
             >
               {thread.discussionState === 'archived' ? 'Возобновить' : 'Закрыть тему'}
             </button>
             <button 
               onClick={() => setIsDeleteModalOpen(true)} 
               className="text-danger/80 hover:text-danger transition-colors flex items-center gap-1"
             >
               <Trash2 className="w-3.5 h-3.5" /> Удалить
             </button>
          </div>
        )}
      </div>

      {/* TABS: NeedFeedback Dual Channel (BR-COM-055, FR-COM-058) */}
      {thread.type === 'need_feedback' && (
        <div className="flex items-center gap-6 border-b border-borderDef/60 mb-8 select-none">
          <button
            onClick={() => setActiveFeedbackTab('feedback')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${activeFeedbackTab === 'feedback' ? 'border-info text-info' : 'border-transparent text-textTertiary hover:text-textSecondary'}`}
          >
            <HelpCircle className="w-4 h-4" />
            Структурированный фидбек ({feedbacks.length})
          </button>
          <button
            onClick={() => setActiveFeedbackTab('comments')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${activeFeedbackTab === 'comments' ? 'border-accent text-accent' : 'border-transparent text-textTertiary hover:text-textSecondary'}`}
          >
            <MessageSquare className="w-4 h-4" />
            Обсуждение ({thread.repliesCount})
          </button>
        </div>
      )}

      {/* RENDER STRUCTURED FEEDBACK VIEW (BR-COM-055, FR-COM-056) */}
      {thread.type === 'need_feedback' && activeFeedbackTab === 'feedback' ? (
        <div className="space-y-10 animate-fadeIn mb-16">
          {/* Form to submit structured feedback */}
          <div className="bg-surface-1/40 border border-borderDef/60 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-borderDef/60 flex-wrap gap-2">
              <div>
                <h3 className="text-base font-bold text-textPrimary">Отправить структурированный фидбек автору</h3>
                <p className="text-xs text-textTertiary">Без оценочных баллов и звёзд — только содержательный разбор</p>
              </div>
            </div>

            {fbSuccessMessage && (
              <div className="bg-success/15 border border-success/30 text-success text-xs font-semibold px-4 py-3 rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>{fbSuccessMessage}</span>
              </div>
            )}

            <form onSubmit={handleFeedbackSubmit} className="space-y-6">
              {/* Category checkboxes */}
              <div>
                <label className="block text-xs font-bold text-textSecondary uppercase tracking-wider mb-2.5">
                  Оцениваемые аспекты*
                </label>
                <div className="flex flex-wrap gap-2">
                  {thread.needFeedbackDetails?.feedbackCategories.map(cat => {
                    const active = fbSelectedCats.includes(cat);
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => {
                          if (active) setFbSelectedCats(fbSelectedCats.filter(c => c !== cat));
                          else setFbSelectedCats([...fbSelectedCats, cat]);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${active ? 'bg-info/20 text-info border-info' : 'bg-surface-2 text-textSecondary border-borderDef hover:border-borderStrong'}`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Questions from author */}
              {thread.needFeedbackDetails?.questions && thread.needFeedbackDetails.questions.length > 0 && (
                <div className="space-y-4 pt-2">
                  <label className="block text-xs font-bold text-textSecondary uppercase tracking-wider">
                    Ответы на целевые вопросы автора
                  </label>
                  {thread.needFeedbackDetails.questions.map((q, idx) => (
                    <div key={idx} className="bg-surface-2/40 border border-borderDef/50 rounded-xl p-4 space-y-2">
                      <div className="text-xs font-bold text-textPrimary flex items-start gap-2">
                        <span className="text-info">{idx + 1}.</span>
                        <span>{q}</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Ваш ответ..."
                        value={fbAnswers[idx] || ''}
                        onChange={(e) => setFbAnswers({ ...fbAnswers, [idx]: e.target.value })}
                        className="w-full h-10 bg-surface-1 border border-borderDef focus:border-info rounded-lg px-3 text-xs text-textPrimary outline-none transition-colors"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Free text review */}
              <div>
                <label className="block text-xs font-bold text-textSecondary uppercase tracking-wider mb-2">
                  Общий разбор полетов и комментарии*
                </label>
                <textarea
                  value={fbFreeText}
                  onChange={(e) => setFbFreeText(e.target.value)}
                  placeholder="Опишите ваши впечатления от геймплея, обнаруженные проблемы, пожелания..."
                  className="w-full min-h-[100px] bg-surface-2/40 border border-borderDef focus:border-info rounded-xl p-4 text-sm text-textPrimary placeholder:text-textTertiary outline-none resize-y transition-colors"
                />
              </div>

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={authRole === 'guest' || !canWrite}
                  icon={<Send className="w-4 h-4" />}
                >
                  Отправить отзыв
                </Button>
              </div>
            </form>
          </div>

          {/* List of received structured feedbacks */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-textPrimary uppercase tracking-wider">
              Полученные структурированные отзывы ({feedbacks.length})
            </h4>
            <div className="space-y-4">
              {feedbacks.map(fb => (
                <div key={fb.id} className="bg-surface-1/60 border border-borderDef/50 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-borderDef/40 pb-3">
                    <div className="flex items-center gap-3">
                      <img src={fb.authorAvatar} alt={fb.authorNick} className="w-8 h-8 rounded-full bg-surface-2" />
                      <div>
                        <span className="text-xs font-bold text-textPrimary">@{fb.authorNick}</span>
                        <span className="text-[11px] text-textTertiary ml-2">{fb.createdAt}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {fb.categories.map(c => (
                        <span key={c} className="px-2 py-0.5 bg-info/10 text-info text-[10px] font-bold rounded">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  {fb.answers.length > 0 && (
                    <div className="space-y-2 bg-surface-2/30 rounded-xl p-4">
                      {fb.answers.map((a, i) => (
                        <div key={i} className="text-xs">
                          <span className="text-textTertiary font-semibold">{a.question}: </span>
                          <span className="text-textPrimary font-medium">{a.answer}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-textSecondary leading-relaxed whitespace-pre-wrap">{fb.freeText}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* COMMENTS SECTION */
        <div className="space-y-8">
          <h3 className="text-xl font-extrabold text-textPrimary tracking-tight">Комментарии ({thread.repliesCount})</h3>

          {/* Quick Reply */}
          <div className="flex items-start gap-4 pb-8 border-b border-borderDef/50">
            <div className="w-10 shrink-0 mt-1">
              <div className="w-10 h-10 rounded-full bg-surface-2 ring-2 ring-surface-0 flex items-center justify-center">
                {authRole === 'guest' ? <span className="text-xs font-bold text-textTertiary">?</span> : <span className="text-xs font-bold text-textSecondary">U</span>}
              </div>
            </div>
            <div className="flex-1">
              {!canReply ? (
                thread.discussionState === 'locked' ? (
                  <div className="h-[80px] bg-surface-1 rounded-xl flex items-center justify-center border border-borderDef/50">
                    <span className="text-sm font-bold text-textTertiary px-4 text-center">Тема закрыта для новых ответов</span>
                  </div>
                ) : thread.discussionState === 'archived' ? (
                  <div className="h-[80px] bg-surface-1 rounded-xl flex items-center justify-center border border-borderDef/50">
                    <span className="text-sm font-bold text-textTertiary px-4 text-center">Эта тема находится в архиве</span>
                  </div>
                ) : authRole === 'guest' ? (
                  <div className="h-[80px] bg-surface-1 rounded-xl flex items-center justify-center border border-borderDef/50">
                    <span className="text-sm font-bold text-textTertiary px-4 text-center">Войдите, чтобы оставить комментарий</span>
                  </div>
                ) : (
                  <ScopedForbiddenNotice
                    capability="comments"
                    compact
                    onOpenAppeal={() => {
                      if ((window as any).__hubigrNavigate) (window as any).__hubigrNavigate('/account-restricted');
                    }}
                  />
                )
              ) : (
                <div className="bg-surface-1 focus-within:bg-surface-2 focus-within:ring-1 focus-within:ring-accent/50 transition-all rounded-xl border border-borderDef p-3">
                  <textarea 
                    value={replyContent}
                    onChange={e => setReplyContent(e.target.value)}
                    placeholder="Написать ответ..."
                    className="w-full h-16 bg-transparent text-sm text-textPrimary placeholder:text-textTertiary outline-none resize-y mb-2"
                  />
                  <div className="flex justify-between items-center">
                    <div className="text-[11px] font-bold text-textTertiary">Поддерживается Markdown</div>
                    <Button variant="primary" size="sm" disabled={!replyContent.trim()} onClick={handleAddComment}>Отправить</Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Comment Tree */}
          <div className="space-y-2 pt-4">
            {comments.map(comment => (
              <CommentNode 
                key={comment.id} 
                comment={comment} 
                threadId={threadId}
                canManageSolution={isAuthor || authRole === 'admin'}
                canReply={canReply}
                onToggleSolution={handleToggleSolution}
                onAddReply={handleAddReply}
                onEditComment={handleEditComment}
                onDeleteComment={handleDeleteComment}
                onToggleLike={handleToggleLikeComment}
                onReportComment={(id, nick) => handleOpenReport('comment', id, nick)}
                onOpenRevisions={handleOpenCommentRevisions}
                currentUserNick="CurrentUser"
                isAdmin={authRole === 'admin'}
              />
            ))}
          </div>
        </div>
      )}

      {/* --- MODAL DIALOGS --- */}


      {/* 2. DELETE THREAD MODAL (COM-API-009, BR-COM-021) */}
      {typeof document !== 'undefined' && isDeleteModalOpen && createPortal(
        <div className="fixed inset-0 z-modal flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="fixed inset-0" onClick={() => setIsDeleteModalOpen(false)} aria-hidden="true" />
          <div className="relative z-10 bg-surface-1 border border-borderDef rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-center gap-3 text-danger pb-3 border-b border-borderDef">
              <Trash2 className="w-5 h-5 shrink-0" />
              <h3 className="text-base font-bold text-textPrimary">Удаление темы</h3>
            </div>
            
            <p className="text-xs text-textSecondary leading-relaxed">
              Вы уверены, что хотите удалить тему <strong className="text-textPrimary">«{thread.title}»</strong>?
            </p>
            <p className="text-xs text-textTertiary bg-surface-2/60 p-3 rounded-xl border border-borderDef/60">
              Тема будет скрыта из общего каталога и поиска, но история ответов сохранится в архиве.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>Отмена</Button>
              <Button variant="danger" onClick={handleConfirmDeleteThread}>Да, удалить тему</Button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* 3. REPORT MODAL */}
      {typeof document !== 'undefined' && isReportModalOpen && createPortal(
        <div className="fixed inset-0 z-modal flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="fixed inset-0" onClick={() => setIsReportModalOpen(false)} aria-hidden="true" />
          <div className="relative z-10 bg-surface-1 border border-borderDef rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-borderDef">
              <div className="flex items-center gap-2.5 text-danger">
                <Flag className="w-5 h-5 shrink-0" />
                <h3 className="text-base font-bold text-textPrimary">Пожаловаться</h3>
              </div>
              <button onClick={() => setIsReportModalOpen(false)} className="text-textTertiary hover:text-textPrimary">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-textSecondary">
              Объект жалобы: <strong className="text-textPrimary">{reportTarget?.type === 'thread' ? 'Тема целиком' : `Сообщение от @${reportTarget?.authorNick || 'пользователя'}`}</strong>.
              Жалоба поступит на рассмотрение модераторам.
            </p>

            <form onSubmit={handleSubmitReport} className="space-y-4">
              <div className="space-y-2">
                {[
                  { id: 'spam', label: 'Спам, флуд, несогласованная реклама' },
                  { id: 'harassment', label: 'Оскорбления, агрессия, троллинг' },
                  { id: 'warez', label: 'Нелицензионный контент, пиратство, варез' },
                  { id: 'fraud', label: 'Мошенничество, фишинг, вредоносные ссылки' },
                  { id: 'copyright', label: 'Нарушение авторских прав' },
                  { id: 'other', label: 'Другое нарушение правил платформы' },
                ].map(r => (
                  <label key={r.id} className="flex items-center gap-3 p-2.5 rounded-xl border border-borderDef bg-surface-2/40 hover:bg-surface-2 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="report_reason"
                      checked={reportReason === r.id}
                      onChange={() => setReportReason(r.id as any)}
                      className="accent-accent"
                    />
                    <span className="text-xs font-semibold text-textPrimary">{r.label}</span>
                  </label>
                ))}
              </div>

              <div>
                <label className="block text-xs text-textSecondary mb-1.5 font-semibold">Дополнительные пояснения</label>
                <textarea
                  value={reportDetails}
                  onChange={e => setReportDetails(e.target.value)}
                  placeholder="Опишите подробнее суть нарушения..."
                  className="w-full h-20 bg-surface-2 border border-borderDef focus:border-danger rounded-xl p-3 text-xs text-textPrimary outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-borderDef/50">
                <Button type="button" variant="ghost" onClick={() => setIsReportModalOpen(false)}>Отмена</Button>
                <Button type="submit" variant="danger">Отправить жалобу</Button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* 4. CATEGORY CHANGE MODAL (COM-API-043, BR-COM-015) */}
      {typeof document !== 'undefined' && isCategoryModalOpen && createPortal(
        <div className="fixed inset-0 z-modal flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="fixed inset-0" onClick={() => setIsCategoryModalOpen(false)} aria-hidden="true" />
          <div className="relative z-10 bg-surface-1 border border-borderDef rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-borderDef">
              <div className="flex items-center gap-2.5 text-accent">
                <FolderSync className="w-5 h-5 shrink-0" />
                <h3 className="text-base font-bold text-textPrimary">Смена раздела темы</h3>
              </div>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-textTertiary hover:text-textPrimary">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-textSecondary leading-relaxed">
              Выберите новый раздел для перемещения темы <strong className="text-textPrimary">«{thread.title}»</strong>:
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {MOCK_COMMUNITY_CATEGORIES.filter(cat => cat.status === 'active').map(cat => (
                <label 
                  key={cat.id} 
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                    selectedNewCategoryId === cat.id 
                      ? 'bg-accent/15 border-accent text-textPrimary' 
                      : 'bg-surface-2/40 border-borderDef hover:bg-surface-2 text-textSecondary'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="category_select"
                      checked={selectedNewCategoryId === cat.id}
                      onChange={() => setSelectedNewCategoryId(cat.id)}
                      className="accent-accent"
                    />
                    <div>
                      <div className="text-xs font-bold text-textPrimary">{cat.name}</div>
                      <div className="text-[11px] text-textTertiary">{cat.description}</div>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-borderDef/50">
              <Button type="button" variant="ghost" onClick={() => setIsCategoryModalOpen(false)}>Отмена</Button>
              <Button type="button" variant="primary" onClick={handleConfirmChangeCategory}>Перенести тему</Button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* 5. REVISIONS HISTORY MODAL (COM-API-027, COM-API-028, FR-COM-075) */}
      {typeof document !== 'undefined' && revisionsModalOpen && revisionsData && createPortal(
        <div className="fixed inset-0 z-modal flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="fixed inset-0" onClick={() => setRevisionsModalOpen(false)} aria-hidden="true" />
          <div className="relative z-10 bg-surface-1 border border-borderDef rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-borderDef">
              <div className="flex items-center gap-2.5 text-accent">
                <Clock className="w-5 h-5 shrink-0" />
                <h3 className="text-base font-bold text-textPrimary">{revisionsData.targetTitle}</h3>
              </div>
              <button onClick={() => setRevisionsModalOpen(false)} className="text-textTertiary hover:text-textPrimary">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {revisionsData.items.map(rev => (
                <div key={rev.version} className="p-4 rounded-xl bg-surface-2/60 border border-borderDef space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-accent/20 text-accent font-bold text-[10px]">
                        Версия {rev.version}
                      </span>
                      <span className="font-semibold text-textPrimary">@{rev.authorNick}</span>
                    </div>
                    <span className="text-textTertiary text-[11px]">{rev.date}</span>
                  </div>
                  {rev.version === revisionsData.items[0]?.version && (
                    <span className="text-[10px] text-textTertiary font-semibold block uppercase tracking-wider">Текущая версия</span>
                  )}
                  {rev.title && (
                    <div className="text-xs font-bold text-textPrimary">
                      Заголовок: {rev.title}
                    </div>
                  )}
                  <div className="text-xs text-textSecondary bg-surface-1 p-3 rounded-lg border border-borderDef/40 font-mono whitespace-pre-wrap leading-relaxed">
                    {rev.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-borderDef/50">
              <Button variant="ghost" onClick={() => setRevisionsModalOpen(false)}>Закрыть</Button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* 6. CANDIDATE APPLY MODAL (BR-COM-049, COM-API-017) */}
      {typeof document !== 'undefined' && isApplyModalOpen && createPortal(
        <div className="fixed inset-0 z-modal flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="fixed inset-0" onClick={() => setIsApplyModalOpen(false)} aria-hidden="true" />
          <div className="relative z-10 bg-surface-1 border border-borderDef rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-borderDef">
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-5 h-5 text-accent" />
                <h3 className="text-base font-bold text-textPrimary">Отклик на вакансию</h3>
              </div>
              <button onClick={() => setIsApplyModalOpen(false)} className="text-textTertiary hover:text-textPrimary">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-xs text-textSecondary leading-relaxed">
              Отклик является <strong className="text-textPrimary">строго приватным</strong> и будет виден только автору темы. Прямые контакты не раскрываются до взаимного подтверждения.
            </p>

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-textSecondary uppercase tracking-wider mb-2">
                  Сопроводительное сообщение*
                </label>
                <textarea
                  value={applyMessage}
                  onChange={(e) => setApplyMessage(e.target.value)}
                  placeholder="Расскажите о своем опыте, портфолио, движках и почему вам интересен проект..."
                  className="w-full min-h-[120px] bg-surface-2 border border-borderDef focus:border-accent rounded-xl p-3 text-xs text-textPrimary outline-none resize-y"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsApplyModalOpen(false)}>Отмена</Button>
                <Button type="submit" variant="primary" disabled={!applyMessage.trim()}>Отправить отклик</Button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* 7. CLOSE SEARCH MODAL */}
      {typeof document !== 'undefined' && isCloseReasonModalOpen && createPortal(
        <div className="fixed inset-0 z-modal flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="fixed inset-0" onClick={() => setIsCloseReasonModalOpen(false)} aria-hidden="true" />
          <div className="relative z-10 bg-surface-1 border border-borderDef rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-borderDef">
              <h3 className="text-base font-bold text-textPrimary">Завершить поиск команды</h3>
              <button onClick={() => setIsCloseReasonModalOpen(false)} className="text-textTertiary hover:text-textPrimary">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-textSecondary">
              Укажите причину закрытия поиска. Тема останется доступна для чтения, но кнопка отклика будет скрыта:
            </p>

            <div className="space-y-2">
              {[
                { id: 'team_found', label: 'Команда успешно укомплектована' },
                { id: 'no_longer_needed', label: 'Поиск более не актуален' },
                { id: 'project_cancelled', label: 'Разработка проекта отменена' },
                { id: 'other', label: 'Другая причина' },
              ].map(reason => (
                <label key={reason.id} className="flex items-center gap-3 p-3 rounded-xl border border-borderDef bg-surface-2/40 hover:bg-surface-2 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="close_reason"
                    checked={selectedCloseReason === reason.id}
                    onChange={() => setSelectedCloseReason(reason.id as any)}
                    className="accent-accent"
                  />
                  <span className="text-xs font-semibold text-textPrimary">{reason.label}</span>
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <Button variant="ghost" onClick={() => setIsCloseReasonModalOpen(false)}>Отмена</Button>
              <Button variant="danger" onClick={handleConfirmCloseSearch}>Закрыть поиск</Button>
            </div>
          </div>
        </div>,
        document.body
      )}

      <DevMatrixPanel pageName="Тема" fields={devFields} bottomOffsetClass="bottom-0" />
    </div>
  );
}

// --- RECURSIVE COMMENT NODE (2-LEVEL STRUCTURE PER BR-COM-022) ---

interface CommentNodeProps {
  comment: CommunityComment;
  threadId: string;
  canManageSolution?: boolean;
  canReply?: boolean;
  onToggleSolution?: (commentId: string) => void;
  onAddReply: (parentId: string, text: string) => void;
  onEditComment: (commentId: string, newBody: string) => void;
  onDeleteComment: (commentId: string) => void;
  onToggleLike: (commentId: string, currentLikes: number, hasLiked: boolean) => void;
  onReportComment: (commentId: string, authorNick: string) => void;
  onOpenRevisions?: (comment: CommunityComment) => void;
  currentUserNick: string;
  isAdmin: boolean;
}

function CommentNode({ 
  comment, 
  threadId,
  canManageSolution,
  canReply,
  onToggleSolution,
  onAddReply,
  onEditComment,
  onDeleteComment,
  onToggleLike,
  onReportComment,
  onOpenRevisions,
  currentUserNick,
  isAdmin
}: CommentNodeProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.bodyMarkdown);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);

  const canEditOrDelete = isAdmin || comment.authorNick === currentUserNick;

  // Tombstone for deleted comments per BR-COM-024
  if (comment.deletedAt) {
    return (
      <div className="relative py-4 border-b border-borderDef/30">
        <div className="text-textTertiary text-sm italic py-2 px-3 bg-surface-1/50 rounded-lg border border-borderDef/30">
          {comment.moderationDeleteReason 
            ? `Сообщение удалено модератором (Причина: ${comment.moderationDeleteReason})`
            : 'Сообщение удалено пользователем'}
        </div>
        {comment.replies && comment.replies.length > 0 && (
          <div className="pl-6 md:pl-12 relative mt-4">
            <div className="absolute left-3 md:left-6 top-0 bottom-0 w-px bg-borderDef/50" />
            <div className="space-y-2">
              {comment.replies.map(reply => (
                <ReplyNode 
                  key={reply.id} 
                  reply={reply} 
                  rootCommentId={comment.id}
                  canReply={canReply}
                  onAddReply={onAddReply}
                  onEditComment={onEditComment}
                  onDeleteComment={onDeleteComment}
                  onToggleLike={onToggleLike}
                  onReportComment={onReportComment}
                  currentUserNick={currentUserNick}
                  isAdmin={isAdmin}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onAddReply(comment.id, replyText);
    setReplyText('');
    setIsReplying(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editText.trim()) return;
    onEditComment(comment.id, editText.trim());
    setIsEditing(false);
  };

  const handleLike = () => {
    onToggleLike(comment.id, comment.likesCount, hasLiked);
    setHasLiked(!hasLiked);
  };

  return (
    <div className={`relative py-6 ${comment.isSolution ? 'bg-success/5 -mx-4 px-4 rounded-xl border border-success/20' : 'border-b border-borderDef/40'} transition-colors`}>
      
      {/* Solution Marker */}
      {comment.isSolution && (
        <div className="flex items-center gap-2 text-success font-extrabold text-[11px] uppercase tracking-widest mb-3">
          <CheckCircle className="w-3.5 h-3.5" /> Отмечено как официальное решение вопроса
        </div>
      )}

      <div className="flex gap-4">
        {/* Avatar Col */}
        <div className="w-10 shrink-0">
          <img src={comment.authorAvatarUrl} alt={comment.authorNick} className="w-10 h-10 rounded-full bg-surface-2 ring-2 ring-surface-0" />
        </div>
        
        {/* Content Col */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5 relative">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="font-bold text-sm text-textPrimary hover:underline cursor-pointer">@{comment.authorNick}</span>
              {comment.isThreadAuthor && <span className="px-1.5 py-0.5 bg-accent/10 text-accent rounded text-[9px] font-extrabold uppercase tracking-wider">Автор темы</span>}
              <span className="text-[11px] font-medium text-textTertiary mx-1">
                2 часа назад {comment.isEdited && <span className="italic text-textTertiary">(ред.)</span>}
              </span>
            </div>
            
            {/* More Menu */}
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-textTertiary hover:text-textSecondary transition-colors p-1 rounded-md"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {isMenuOpen && (
                <div 
                  onMouseLeave={() => setIsMenuOpen(false)}
                  className="absolute right-0 top-6 z-20 bg-surface-3 border border-borderStrong rounded-xl shadow-2xl py-1 min-w-[150px] animate-scaleUp text-xs font-semibold"
                >
                  {canEditOrDelete && (
                    <>
                      <button 
                        onClick={() => { setIsEditing(true); setIsMenuOpen(false); }}
                        className="w-full text-left px-3 py-2 hover:bg-surface-2 flex items-center gap-2 text-textPrimary"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Редактировать
                      </button>
                      <button 
                        onClick={() => { onDeleteComment(comment.id); setIsMenuOpen(false); }}
                        className="w-full text-left px-3 py-2 hover:bg-surface-2 flex items-center gap-2 text-danger"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Удалить
                      </button>
                    </>
                  )}
                  <button 
                    onClick={() => { onOpenRevisions && onOpenRevisions(comment); setIsMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 hover:bg-surface-2 flex items-center gap-2 text-textSecondary hover:text-textPrimary"
                  >
                    <Clock className="w-3.5 h-3.5" /> История правок
                  </button>
                  <button 
                    onClick={() => { onReportComment(comment.id, comment.authorNick); setIsMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 hover:bg-surface-2 flex items-center gap-2 text-textTertiary hover:text-textSecondary"
                  >
                    <Flag className="w-3.5 h-3.5" /> Пожаловаться
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Comment Body or Inline Editor */}
          {isEditing ? (
            <form onSubmit={handleSaveEdit} className="space-y-3 mb-3">
              <textarea
                value={editText}
                onChange={e => setEditText(e.target.value)}
                className="w-full min-h-[90px] bg-surface-2 border border-borderDef focus:border-accent rounded-xl p-3 text-xs text-textPrimary outline-none resize-y"
                required
              />
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Отмена</Button>
                <Button type="submit" variant="primary" size="sm">Сохранить</Button>
              </div>
            </form>
          ) : (
            <div className="text-[14px] leading-relaxed text-textSecondary whitespace-pre-wrap mb-3 pr-4">
              {comment.bodyMarkdown}
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center gap-5 mt-1">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer ${
                hasLiked ? 'text-danger' : 'text-textTertiary hover:text-textPrimary'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current' : ''}`} /> {comment.likesCount}
            </button>
            
            {canReply && (
              <button 
                onClick={() => setIsReplying(!isReplying)}
                className="text-xs font-bold text-textTertiary hover:text-textPrimary transition-colors cursor-pointer flex items-center gap-1"
              >
                <CornerDownRight className="w-3.5 h-3.5" /> Ответить
              </button>
            )}
            
            {canManageSolution && !comment.parentId && (
              <button 
                onClick={() => onToggleSolution && onToggleSolution(comment.id)}
                className={`text-[11px] font-extrabold uppercase tracking-wider transition-colors ml-auto cursor-pointer ${
                  comment.isSolution 
                    ? 'text-danger hover:text-danger/80' 
                    : 'text-success/80 hover:text-success'
                }`}
              >
                {comment.isSolution ? 'Снять решение' : 'Отметить решением'}
              </button>
            )}
          </div>

          {/* Inline Reply Form */}
          {isReplying && (
            <form onSubmit={handleSubmitReply} className="mt-4 pt-4 border-t border-borderDef/30 space-y-3">
              <textarea
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder={`Ответ для @${comment.authorNick}...`}
                className="w-full min-h-[70px] bg-surface-2 border border-borderDef focus:border-accent rounded-xl p-3 text-xs text-textPrimary outline-none resize-y"
                required
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsReplying(false)}>Отмена</Button>
                <Button type="submit" variant="primary" size="sm" disabled={!replyText.trim()}>Отправить ответ</Button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Nested Level-2 Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="pl-14 relative mt-6">
          <div className="absolute left-6 top-0 bottom-4 w-px bg-borderDef/50" />
          
          <div className="space-y-2">
            {comment.replies.map(reply => (
              <ReplyNode 
                key={reply.id} 
                reply={reply} 
                rootCommentId={comment.id}
                canReply={canReply}
                onAddReply={onAddReply}
                onEditComment={onEditComment}
                onDeleteComment={onDeleteComment}
                onToggleLike={onToggleLike}
                onReportComment={onReportComment}
                onOpenRevisions={onOpenRevisions}
                currentUserNick={currentUserNick}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// --- LEVEL-2 REPLY NODE (BR-COM-022) ---

interface ReplyNodeProps {
  reply: CommunityComment;
  rootCommentId: string;
  canReply?: boolean;
  onAddReply: (parentId: string, text: string) => void;
  onEditComment: (commentId: string, newBody: string) => void;
  onDeleteComment: (commentId: string) => void;
  onToggleLike: (commentId: string, currentLikes: number, hasLiked: boolean) => void;
  onReportComment: (commentId: string, authorNick: string) => void;
  onOpenRevisions?: (comment: CommunityComment) => void;
  currentUserNick: string;
  isAdmin: boolean;
}

function ReplyNode({ 
  reply, 
  rootCommentId,
  canReply,
  onAddReply,
  onEditComment,
  onDeleteComment,
  onToggleLike,
  onReportComment,
  currentUserNick,
  isAdmin 
}: ReplyNodeProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState(`@${reply.authorNick} `);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(reply.bodyMarkdown);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);

  const canEditOrDelete = isAdmin || reply.authorNick === currentUserNick;

  if (reply.deletedAt) {
    return (
      <div className="relative py-3 text-textTertiary text-sm italic">
        Сообщение удалено
      </div>
    );
  }

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onAddReply(rootCommentId, replyText);
    setReplyText(`@${reply.authorNick} `);
    setIsReplying(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editText.trim()) return;
    onEditComment(reply.id, editText.trim());
    setIsEditing(false);
  };

  const handleLike = () => {
    onToggleLike(reply.id, reply.likesCount, hasLiked);
    setHasLiked(!hasLiked);
  };

  return (
    <div className="relative py-4 group">
      <div className="flex gap-3">
        <div className="w-8 shrink-0">
          <img src={reply.authorAvatarUrl} alt={reply.authorNick} className="w-8 h-8 rounded-full bg-surface-2 ring-2 ring-surface-0" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1 relative">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="font-bold text-[13px] text-textPrimary hover:underline cursor-pointer">@{reply.authorNick}</span>
              {reply.isThreadAuthor && <span className="px-1.5 py-0.5 bg-accent/10 text-accent rounded text-[9px] font-extrabold uppercase tracking-wider">Автор</span>}
              <span className="text-[11px] font-medium text-textTertiary mx-1">
                30 мин назад {reply.isEdited && <span className="italic text-textTertiary">(ред.)</span>}
              </span>
            </div>

            {/* Menu */}
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-textTertiary hover:text-textSecondary transition-colors opacity-0 group-hover:opacity-100 p-1 rounded-md"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>

              {isMenuOpen && (
                <div 
                  onMouseLeave={() => setIsMenuOpen(false)}
                  className="absolute right-0 top-6 z-20 bg-surface-3 border border-borderStrong rounded-xl shadow-2xl py-1 min-w-[150px] animate-scaleUp text-xs font-semibold"
                >
                  {canEditOrDelete && (
                    <>
                      <button 
                        onClick={() => { setIsEditing(true); setIsMenuOpen(false); }}
                        className="w-full text-left px-3 py-2 hover:bg-surface-2 flex items-center gap-2 text-textPrimary"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Редактировать
                      </button>
                      <button 
                        onClick={() => { onDeleteComment(reply.id); setIsMenuOpen(false); }}
                        className="w-full text-left px-3 py-2 hover:bg-surface-2 flex items-center gap-2 text-danger"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Удалить
                      </button>
                    </>
                  )}
                  <button 
                    onClick={() => { onReportComment(reply.id, reply.authorNick); setIsMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 hover:bg-surface-2 flex items-center gap-2 text-textTertiary hover:text-textSecondary"
                  >
                    <Flag className="w-3.5 h-3.5" /> Пожаловаться
                  </button>
                </div>
              )}
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleSaveEdit} className="space-y-3 mb-2">
              <textarea
                value={editText}
                onChange={e => setEditText(e.target.value)}
                className="w-full min-h-[70px] bg-surface-2 border border-borderDef focus:border-accent rounded-xl p-3 text-xs text-textPrimary outline-none resize-y"
                required
              />
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Отмена</Button>
                <Button type="submit" variant="primary" size="sm">Сохранить</Button>
              </div>
            </form>
          ) : (
            <div className="text-[13.5px] leading-relaxed text-textSecondary whitespace-pre-wrap mb-2 pr-2">
              {reply.bodyMarkdown}
            </div>
          )}

          <div className="flex items-center gap-4 mt-1">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-1.5 text-[11px] font-bold transition-colors cursor-pointer ${
                hasLiked ? 'text-danger' : 'text-textTertiary hover:text-textPrimary'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current' : ''}`} /> {reply.likesCount}
            </button>
            
            {canReply && (
              <button 
                onClick={() => setIsReplying(!isReplying)}
                className="text-[11px] font-bold text-textTertiary hover:text-textPrimary transition-colors cursor-pointer flex items-center gap-1"
              >
                <CornerDownRight className="w-3 h-3" /> Ответить
              </button>
            )}
          </div>

          {/* Inline Reply Form */}
          {isReplying && (
            <form onSubmit={handleSubmitReply} className="mt-3 pt-3 border-t border-borderDef/30 space-y-2">
              <textarea
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                className="w-full min-h-[60px] bg-surface-2 border border-borderDef focus:border-accent rounded-xl p-2.5 text-xs text-textPrimary outline-none resize-y"
                required
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsReplying(false)}>Отмена</Button>
                <Button type="submit" variant="primary" size="sm" disabled={!replyText.trim()}>Ответить</Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
