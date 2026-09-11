import React, { useState, useEffect } from 'react';
import { 
  Star, MessageSquare, MoreHorizontal, Reply, Flag, Trash2, 
  Edit3, Clock, CheckCircle2, ShieldCheck, CornerDownRight, 
  Send, X
} from 'lucide-react';
import Button from './ui/Button';
import { Badge } from './ui/Badge';

export interface DeveloperResponse {
  id: string | number;
  author: string;
  authorHandle?: string;
  authorAvatar?: string;
  date: string;
  text: string;
  isEdited?: boolean;
}

export interface Review {
  id: number;
  author: string;
  authorId?: number;
  authorHandle?: string;
  authorAvatar?: string;
  role: 'Player' | 'Author' | 'Judge' | 'Verified';
  isVerifiedOwner?: boolean;
  rating?: number; // 1 to 5
  date: string;
  text: string;
  score?: number;
  isEdited?: boolean;
  developerResponse?: DeveloperResponse | null;
}

export interface ReviewsSectionProps {
  reviews: Review[];
  currentUserId?: number;
  role: string; // 'player' | 'author' | 'judge' | 'admin'
  gameAuthorName?: string;
  hideTitle?: boolean;
  onReply?: (reviewId: number, text: string) => void;
  onEditReply?: (reviewId: number, text: string) => void;
  onDeleteReply?: (reviewId: number) => void;
  onVote?: (reviewId: number) => void;
  onEdit?: (reviewId: number) => void;
  onDelete?: (reviewId: number) => void;
  onAddReview?: (rating: number, text: string) => void;
  onEditReview?: (reviewId: number, rating: number, text: string) => void;
  onDeleteReview?: (reviewId: number) => void;
  onReport?: (reviewId: number) => void;
  triggerToast?: (message: string, type?: any) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews: initialReviews,
  currentUserId = 1,
  role = 'player',
  gameAuthorName = '@cyber_studio',
  hideTitle = false,
  onReply,
  onEditReply,
  onDeleteReply,
  onVote,
  onEdit,
  onDelete,
  onAddReview,
  onEditReview,
  onDeleteReview,
  onReport,
  triggerToast,
}) => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  useEffect(() => {
    setReviews(initialReviews);
  }, [initialReviews]);

  // Inline Review Edit State
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [newRating, setNewRating] = useState<number>(5);
  const [newReviewText, setNewReviewText] = useState<string>('');

  // Developer Official Response State (FE-MKT-012, BR-MKT-047)
  const [replyingToId, setReplyingToId] = useState<number | null>(null);
  const [editingReplyReviewId, setEditingReplyReviewId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  // Active Menu State
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);

  const isGameAuthor = role === 'author';

  // 2. Official Developer Response Handlers (BR-MKT-047)
  const handleSaveDeveloperResponse = (reviewId: number) => {
    if (!replyText.trim()) return;

    if (editingReplyReviewId !== null) {
      // Edit existing official response
      setReviews(prev => prev.map(r => {
        if (r.id === reviewId && r.developerResponse) {
          return {
            ...r,
            developerResponse: {
              ...r.developerResponse,
              text: replyText,
              isEdited: true,
              date: 'Только что (изменено)',
            }
          };
        }
        return r;
      }));
      onEditReply?.(reviewId, replyText);
      triggerToast?.('Официальный ответ разработчика обновлен', 'success');
    } else {
      // Create new official response (zero or one)
      const officialResponse: DeveloperResponse = {
        id: `dev-resp-${Date.now()}`,
        author: gameAuthorName,
        date: 'Сегодня, только что',
        text: replyText,
        isEdited: false,
      };

      setReviews(prev => prev.map(r => {
        if (r.id === reviewId) {
          return {
            ...r,
            developerResponse: officialResponse,
          };
        }
        return r;
      }));
      onReply?.(reviewId, replyText);
      triggerToast?.('Официальный ответ разработчика опубликован', 'success');
    }

    setReplyingToId(null);
    setEditingReplyReviewId(null);
    setReplyText('');
  };

  const handleDeleteDeveloperResponse = (reviewId: number) => {
    setReviews(prev => prev.map(r => {
      if (r.id === reviewId) {
        return {
          ...r,
          developerResponse: null,
        };
      }
      return r;
    }));
    onDeleteReply?.(reviewId);
    triggerToast?.('Официальный ответ разработчика удален', 'info');
  };

  const handleDeleteReview = (reviewId: number) => {
    setReviews(prev => prev.filter(r => r.id !== reviewId));
    onDeleteReview?.(reviewId);
    triggerToast?.('Отзыв удален', 'info');
  };

  const handleStartEditReview = (review: Review) => {
    setEditingReviewId(review.id);
    setNewRating(review.rating || 5);
    setNewReviewText(review.text);
    setMenuOpenId(null);
  };

  return (
    <div className="flex flex-col gap-8 font-sans">
      {/* Reviews List */}
      <div className="space-y-4">
        {!hideTitle && (
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-textTertiary font-mono">
              Отзывы сообщества ({reviews.length})
            </h3>
          </div>
        )}

        {reviews.length === 0 ? (
          <div className="bg-surface-1 border border-dashed border-borderDef rounded-card p-12 flex flex-col items-center text-center">
            <MessageSquare className="w-10 h-10 text-textTertiary mb-3" />
            <h4 className="text-sm font-bold text-textPrimary mb-1">Пока нет отзывов</h4>
            <p className="text-xs text-textSecondary max-w-sm">
              Станьте первым, кто оценит игру и поделится впечатлениями с игровым сообществом!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6 sm:gap-8">
            {reviews.map((review) => {
              const isReviewOwner = review.authorId === currentUserId;
              const hasDeveloperResponse = Boolean(review.developerResponse);

              return (
                <div key={review.id} className="group relative">
                  {/* Top: Reviewer Info & Rating */}
                  <div className="flex items-start justify-between gap-4 mb-2.5">
                    <div className="flex items-start gap-3">
                      <img
                        src={review.authorAvatar || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${review.author}`}
                        alt={review.author}
                        className="w-10 h-10 rounded-full bg-surface-2 ring-1 ring-borderDef/50 ring-offset-2 ring-offset-surface-1 shrink-0 object-cover mt-0.5"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[14px] font-bold text-textPrimary">{review.author}</span>
                          {review.isVerifiedOwner && (
                            <Badge variant="neutral" size="sm" className="font-mono text-[9px] gap-1 px-1.5 h-4 flex items-center">
                              <CheckCircle2 className="w-2.5 h-2.5 text-success" />
                              Куплено
                            </Badge>
                          )}
                          {review.role === 'Author' && (
                            <Badge variant="accent" size="sm" className="font-mono text-[9px] px-1.5 h-4 flex items-center">
                              Автор
                            </Badge>
                          )}
                          {review.role === 'Judge' && (
                            <Badge variant="info" size="sm" className="font-mono text-[9px] px-1.5 h-4 flex items-center">
                              Жюри
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-textTertiary font-mono">
                          <span>{review.date}</span>
                          {review.isEdited && <span className="text-textDisabled">(изменено)</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Star Rating Display */}
                      {review.rating && (
                        <div className="flex items-center gap-0.5 bg-surface-2/50 px-2 py-1 rounded-control border border-borderDef/40">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s <= review.rating!
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-borderDef/50'
                              }`}
                            />
                          ))}
                        </div>
                      )}

                      {/* Dropdown Menu */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setMenuOpenId(menuOpenId === review.id ? null : review.id)}
                          className="p-1.5 hover:bg-surface-2 rounded-control text-textTertiary hover:text-textPrimary transition-colors cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {menuOpenId === review.id && (
                          <>
                            <div className="fixed inset-0 z-20" onClick={() => setMenuOpenId(null)} />
                            <div className="absolute right-0 top-full mt-1 bg-surface-2 border border-borderDef rounded-card shadow-elevation-overlay z-30 min-w-[150px] py-1 text-xs">
                              {isReviewOwner && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleStartEditReview(review)}
                                    className="w-full px-3 py-2 text-left hover:bg-surface-3 flex items-center gap-2 text-textPrimary transition-colors"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                    Редактировать
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => { handleDeleteReview(review.id); setMenuOpenId(null); }}
                                    className="w-full px-3 py-2 text-left hover:bg-danger/10 flex items-center gap-2 text-danger transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Удалить отзыв
                                  </button>
                                </>
                              )}
                              {!isReviewOwner && (
                                <button
                                  type="button"
                                  onClick={() => { onReport?.(review.id); setMenuOpenId(null); triggerToast?.('Жалоба отправлена модераторам', 'info'); }}
                                  className="w-full px-3 py-2 text-left hover:bg-surface-3 flex items-center gap-2 text-textSecondary transition-colors"
                                >
                                  <Flag className="w-3.5 h-3.5" />
                                  Пожаловаться
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Review Text & Inline Editor */}
                  {editingReviewId === review.id ? (
                    <div className="space-y-3 pt-2 ml-[3.25rem]">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-textTertiary font-medium">Оценка:</span>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewRating(star)}
                              className="p-1 hover:scale-110 transition-transform cursor-pointer"
                            >
                              <Star
                                className={`w-4 h-4 transition-colors ${
                                  star <= newRating
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-borderDef fill-surface-2'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                        <span className="text-xs font-mono font-bold text-textPrimary ml-1.5">{newRating} / 5</span>
                      </div>
                      <textarea
                        rows={3}
                        value={newReviewText}
                        onChange={(e) => setNewReviewText(e.target.value)}
                        className="w-full bg-surface-0 border border-borderDef rounded-card p-3 text-[13px] text-textPrimary placeholder:text-textTertiary focus:border-accent focus:outline-none transition-colors resize-y leading-relaxed"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          type="button"
                          onClick={() => setEditingReviewId(null)}
                        >
                          Отмена
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          type="button"
                          disabled={!newReviewText.trim() || (review.rating !== undefined && newRating === 0)}
                          onClick={() => {
                            setReviews(prev => prev.map(r => r.id === editingReviewId ? {
                              ...r,
                              rating: newRating,
                              text: newReviewText,
                              isEdited: true,
                              date: 'Только что (изменено)',
                            } : r));
                            onEditReview?.(editingReviewId, newRating, newReviewText);
                            triggerToast?.('Отзыв успешно обновлен', 'success');
                            setEditingReviewId(null);
                          }}
                        >
                          Сохранить
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[13px] text-textSecondary leading-relaxed whitespace-pre-wrap ml-[3.25rem]">
                      {review.text}
                    </p>
                  )}

                  {/* Actions Row */}
                  <div className="flex items-center gap-4 text-xs pt-1 ml-[3.25rem]">
                    {/* Official Developer Reply Trigger (BR-MKT-047: zero or one response) */}
                    {isGameAuthor && !hasDeveloperResponse && replyingToId !== review.id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setReplyingToId(review.id);
                          setEditingReplyReviewId(null);
                          setReplyText('');
                        }}
                        icon={<Reply className="w-3.5 h-3.5 text-accent" />}
                      >
                        Ответить как разработчик
                      </Button>
                    )}
                  </div>

                  {/* Inline Developer Response Input (BR-MKT-047) */}
                  {replyingToId === review.id && (
                    <div className="ml-[3.25rem] bg-surface-0 border border-accent/30 rounded-card p-4 space-y-3 mt-3 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-bold text-accent flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4" />
                          {editingReplyReviewId !== null ? 'Редактирование ответа разработчика' : 'Официальный ответ разработчика'}
                        </span>
                        <span className="text-[10px] text-textTertiary font-mono hidden sm:inline-block">
                          Разрешен ровно 1 ответ на отзыв от разработчика
                        </span>
                      </div>
                      <textarea
                        rows={3}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Поблагодарите за отзыв или ответьте на замечания игрока..."
                        className="w-full bg-surface-1 border border-borderDef rounded-control p-3 text-[13px] text-textPrimary placeholder:text-textTertiary focus:border-accent focus:outline-none transition-colors resize-none leading-relaxed"
                        autoFocus
                      />
                      <div className="flex items-center justify-end gap-2 mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setReplyingToId(null);
                            setEditingReplyReviewId(null);
                            setReplyText('');
                          }}
                        >
                          Отмена
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleSaveDeveloperResponse(review.id)}
                          disabled={!replyText.trim()}
                        >
                          Опубликовать ответ
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* 3. Official Developer Response Container (BR-MKT-047: Zero or One, No nested replies) */}
                  {hasDeveloperResponse && review.developerResponse && (
                    <div className="ml-[3.25rem] mt-4 pt-4 border-t border-borderDef/50 space-y-2 relative">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-[13px] font-bold text-textPrimary">
                            {review.developerResponse.author}
                          </span>
                          <Badge variant="accent" size="sm" className="text-[9px] font-mono py-0 h-4 px-1.5 items-center flex">
                            Разработчик
                          </Badge>
                          <span className="text-[11px] text-textTertiary font-mono ml-1 hidden sm:inline-block">
                            {review.developerResponse.date}
                            {review.developerResponse.isEdited && <span className="ml-1">(изменено)</span>}
                          </span>
                        </div>

                        {/* Developer action buttons if author */}
                        {isGameAuthor && (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setReplyingToId(review.id);
                                setEditingReplyReviewId(review.id);
                                setReplyText(review.developerResponse!.text);
                              }}
                              className="p-1.5 hover:bg-surface-2 text-textTertiary hover:text-textPrimary rounded-control transition-colors cursor-pointer"
                              title="Редактировать ответ"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteDeveloperResponse(review.id)}
                              className="p-1.5 hover:bg-danger/10 text-textTertiary hover:text-danger rounded-control transition-colors cursor-pointer"
                              title="Удалить ответ"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <div className="sm:hidden text-[11px] text-textTertiary font-mono mb-2">
                        {review.developerResponse.date}
                        {review.developerResponse.isEdited && <span className="ml-1">(изменено)</span>}
                      </div>

                      <p className="text-[13px] text-textSecondary leading-relaxed whitespace-pre-wrap pl-[2rem]">
                        {review.developerResponse.text}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;
