import React, { useState, useMemo } from 'react';
import { ArrowLeft, Bug, Paperclip, Send, Lock, RotateCcw, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { BugReport, BugStatus, BugSeverity } from '../../../types/bugReport';
import { updateBugReport } from '../../../mocks/bugReports';

interface CreatorBugWorkspaceProps {
  bug: BugReport;
  onBack: () => void;
  triggerToast: (msg: string, type?: 'success'|'error'|'info'|'warning') => void;
  viewMode?: 'creator' | 'reporter';
}

const normalizePriority = (p?: any): 'P0' | 'P1' | 'P2' | 'P3' => {
  if (p === 'P0' || p === 'urgent') return 'P0';
  if (p === 'P1' || p === 'high') return 'P1';
  if (p === 'P2' || p === 'medium') return 'P2';
  if (p === 'P3' || p === 'low') return 'P3';
  return 'P2';
};

export const CreatorBugWorkspace = ({ bug, onBack, triggerToast, viewMode = 'creator' }: CreatorBugWorkspaceProps) => {
  const [currentStatus, setCurrentStatus] = useState<BugStatus>(bug.status);
  const [triageSeverity, setTriageSeverity] = useState<BugSeverity>(bug.triageSeverity || bug.reporterSeverity);
  const [priority, setPriority] = useState<'P0' | 'P1' | 'P2' | 'P3'>(normalizePriority(bug.priority));

  const [newComment, setNewComment] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [comments, setComments] = useState(bug.comments || []);
  
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  
  const [showDuplicateTarget, setShowDuplicateTarget] = useState(false);
  const [duplicateId, setDuplicateId] = useState(bug.duplicateTargetId || '');

  // CRITICAL PRIVACY FIX (BR-BUG-025, BR-BUG-030, SC-BUG-008):
  // Never leak internal notes to reporters!
  const visibleComments = useMemo(() => {
    if (viewMode === 'reporter') {
      return comments.filter(c => !c.isInternal);
    }
    return comments;
  }, [comments, viewMode]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const s = e.target.value as BugStatus;
    
    if (s === 'rejected' && currentStatus !== 'rejected') {
      setShowRejectReason(true);
      setShowDuplicateTarget(false);
      return;
    }
    if (s === 'duplicate' && currentStatus !== 'duplicate') {
      setShowDuplicateTarget(true);
      setShowRejectReason(false);
      return;
    }
    
    setShowRejectReason(false);
    setShowDuplicateTarget(false);
    
    setCurrentStatus(s);
    updateBugReport(bug.id, { status: s });
    triggerToast('Статус обновлен', 'success');
  };

  const handleTriageSeverityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sev = e.target.value as BugSeverity;
    setTriageSeverity(sev);
    updateBugReport(bug.id, { triageSeverity: sev });
    triggerToast('Подтвержденная важность обновлена', 'success');
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const p = e.target.value as 'P0' | 'P1' | 'P2' | 'P3';
    setPriority(p);
    updateBugReport(bug.id, { priority: p });
    triggerToast('Приоритет задачи обновлен', 'success');
  };

  const handleReopen = () => {
    setCurrentStatus('in_progress');
    updateBugReport(bug.id, { status: 'in_progress' });
    triggerToast('Баг переоткрыт и возвращен в работу', 'info');
  };

  const submitStatusWithReason = (type: 'rejected' | 'duplicate') => {
    if (type === 'rejected' && !rejectReason.trim()) {
      triggerToast('Укажите причину', 'error');
      return;
    }
    if (type === 'duplicate' && !duplicateId.trim()) {
      triggerToast('Укажите ID оригинала', 'error');
      return;
    }
    setCurrentStatus(type);
    setShowRejectReason(false);
    setShowDuplicateTarget(false);

    const patch: Partial<BugReport> = { status: type };
    if (type === 'rejected') patch.rejectedReason = rejectReason.trim();
    if (type === 'duplicate') patch.duplicateTargetId = duplicateId.trim();
    updateBugReport(bug.id, patch);

    triggerToast('Статус обновлен', 'success');
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const nc = {
      id: `c_new_${Date.now()}`,
      authorId: 'me',
      authorName: viewMode === 'creator' ? 'Team Member' : bug.reporterName,
      isCreator: viewMode === 'creator',
      isInternal: isInternalNote,
      content: newComment,
      createdAt: new Date().toISOString()
    };
    const updated = [...comments, nc];
    setComments(updated);
    updateBugReport(bug.id, { comments: updated });
    setNewComment('');
    if (isInternalNote) setIsInternalNote(false);
    triggerToast(isInternalNote ? 'Приватная заметка сохранена' : 'Комментарий отправлен', 'success');
  };

  return (
    <div className="flex flex-col animate-fadeIn max-w-6xl mx-auto w-full pb-20">
      
      {/* Top Navigation */}
      <button 
        onClick={onBack} 
        className="flex items-center gap-2 text-textSecondary hover:text-textPrimary transition-colors w-max mb-6 group text-sm"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        К списку багов
      </button>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
        
        {/* LEFT COLUMN: Main Content */}
        <div className="flex-1 min-w-0 flex flex-col">
          
          {/* Header */}
          <div className="flex flex-col gap-3 mb-8">
            <h1 className="text-3xl font-bold text-textPrimary leading-tight">{bug.title}</h1>
            <div className="flex items-center gap-3 text-sm text-textSecondary flex-wrap">
              <span className="font-mono">#{bug.id.toUpperCase()}</span>
              <span>•</span>
              <span>{bug.gameTitle}</span>
              <span>•</span>
              <span>от {bug.reporterName}</span>
              <span>•</span>
              <span>{new Date(bug.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Reopen notice if fixed */}
          {currentStatus === 'fixed' && viewMode === 'creator' && (
            <div className="bg-success/10 border border-success/30 rounded-xl p-4 mb-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-success font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Баг отмечен как исправленный. Если проблема повторилась, вы можете переоткрыть его.</span>
              </div>
              <button 
                onClick={handleReopen}
                className="px-3 py-1.5 bg-surface-2 hover:bg-surface-3 border border-borderDef text-textPrimary text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5 text-accent" />
                Переоткрыть
              </button>
            </div>
          )}

          {/* Special Status Notices (Rejected / Duplicate) */}
          {currentStatus === 'rejected' && (bug.rejectedReason || rejectReason) && (
            <div className="bg-danger/10 border border-danger/20 rounded-xl p-4 mb-6 flex items-start gap-3 text-xs">
              <AlertTriangle className="w-4 h-4 text-danger shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <span className="font-bold text-danger">Причина отклонения:</span>
                <span className="text-textPrimary">{bug.rejectedReason || rejectReason}</span>
              </div>
            </div>
          )}

          {currentStatus === 'duplicate' && (
            <div className="bg-surface-2 border border-borderDef rounded-xl p-4 mb-6 flex items-start gap-3 text-xs">
              <Info className="w-4 h-4 text-textSecondary shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <span className="font-bold text-textPrimary">Дубликат:</span>
                <span className="text-textSecondary">
                  {viewMode === 'creator' 
                    ? `Связан с оригинальным тикетом #${duplicateId || bug.duplicateTargetId}` 
                    : `Объединено с существующей проблемой #${duplicateId || bug.duplicateTargetId || 'DUPLICATE'}`}
                </span>
              </div>
            </div>
          )}

          {/* Bug Description */}
          <div className="flex flex-col gap-6 text-base text-textPrimary leading-relaxed">
            <div className="whitespace-pre-wrap text-sm sm:text-base">
              {bug.description}
            </div>

            {bug.steps && (
              <div className="bg-surface-1 rounded-xl p-5 border border-borderDef text-xs sm:text-sm">
                <span className="font-bold text-textSecondary block mb-1.5">Шаги для воспроизведения:</span>
                <span className="text-textPrimary whitespace-pre-wrap">{bug.steps}</span>
              </div>
            )}

            <div className="flex flex-col gap-3 bg-surface-1 rounded-xl p-5 border border-borderDef text-xs sm:text-sm">
              <div className="flex flex-col md:flex-row gap-2 md:gap-6">
                <span className="font-semibold text-textSecondary md:w-32 shrink-0">Ожидалось:</span>
                <span className="text-textPrimary">{bug.expectedBehavior}</span>
              </div>
              <div className="flex flex-col md:flex-row gap-2 md:gap-6">
                <span className="font-semibold text-textSecondary md:w-32 shrink-0">Фактически:</span>
                <span className="text-textPrimary">{bug.actualBehavior}</span>
              </div>
            </div>
          </div>

          <hr className="border-borderDef my-10" />

          {/* Activity / Comments */}
          <div className="flex flex-col gap-8">
            <h3 className="text-lg font-bold text-textPrimary">Обсуждение</h3>
            
            <div className="flex flex-col gap-6">
              {visibleComments.map(c => (
                <div key={c.id} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-textSecondary">{c.authorName.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex flex-col gap-1.5 flex-1 min-w-0 pt-1">
                    <div className="flex items-center gap-2 flex-wrap text-sm">
                      <span className="font-bold text-textPrimary">{c.authorName}</span>
                      {c.isCreator && <span className="text-[10px] font-bold bg-surface-2 text-textSecondary px-1.5 py-0.5 rounded-md">Автор</span>}
                      {c.isInternal && <span className="text-[10px] font-bold bg-warning/10 text-warning px-1.5 py-0.5 rounded-md flex items-center gap-1"><Lock className="w-3 h-3" /> Внутренний</span>}
                      <span className="text-textTertiary text-xs ml-2">{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className={`text-sm sm:text-base leading-relaxed mt-1 ${c.isInternal ? 'text-warning-light italic bg-warning/5 p-3 rounded-lg border border-warning/20' : 'text-textPrimary'}`}>
                      {c.content}
                    </div>
                  </div>
                </div>
              ))}
              
              {visibleComments.length === 0 && (
                <div className="text-textTertiary text-sm">Пока нет сообщений в обсуждении.</div>
              )}
            </div>

            {/* Comment Input */}
            <div className="flex gap-4 mt-4">
               <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center shrink-0 hidden sm:flex">
                  <span className="text-sm font-bold text-textSecondary">Вы</span>
               </div>
               <div className="flex-1 flex flex-col gap-3">
                  <div className="flex flex-col bg-surface-1 border border-borderDef focus-within:border-textSecondary rounded-xl overflow-hidden transition-colors">
                    <textarea 
                      rows={4}
                      placeholder={isInternalNote ? "Заметка для команды (игрок не увидит)..." : "Написать ответ..."}
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      className={`w-full bg-transparent text-sm p-4 outline-none resize-none placeholder-textTertiary ${isInternalNote ? 'text-warning' : 'text-textPrimary'}`}
                    />
                    <div className="flex items-center justify-between p-3 bg-surface-0/50">
                      <div className="flex items-center gap-4 px-2">
                        {viewMode === 'creator' && (
                          <label className="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" checked={isInternalNote} onChange={(e) => setIsInternalNote(e.target.checked)} className="rounded border-borderDef text-warning focus:ring-warning/20 bg-surface-2" />
                            <span className="text-xs text-textSecondary group-hover:text-textPrimary transition-colors flex items-center gap-1">
                              <Lock className="w-3 h-3" /> Приватная заметка
                            </span>
                          </label>
                        )}
                      </div>
                      <button 
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        className="px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2 bg-textPrimary text-bgDefault hover:bg-textSecondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Send className="w-4 h-4" /> Отправить
                      </button>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sidebar (FE-BUG-006, BR-BUG-016) */}
        <div className="w-full lg:w-72 shrink-0 flex flex-col gap-8 lg:pt-14">
          
          {/* Status Control */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-textSecondary">Статус жизненного цикла</span>
            {viewMode === 'creator' ? (
              <div className="flex flex-col gap-2">
                <select 
                  value={showRejectReason ? 'rejected' : showDuplicateTarget ? 'duplicate' : currentStatus} 
                  onChange={handleStatusChange}
                  className="w-full h-10 bg-surface-1 border border-borderDef hover:border-textSecondary focus:border-textPrimary rounded-lg px-3 text-sm text-textPrimary outline-none cursor-pointer transition-colors"
                >
                  <option value="new">Новый</option>
                  <option value="confirmed">Подтвержден</option>
                  <option value="in_progress">В работе</option>
                  <option value="fixed">Исправлен</option>
                  <option value="rejected">Отклонен...</option>
                  <option value="duplicate">Дубликат...</option>
                </select>
                
                {showRejectReason && (
                  <div className="flex flex-col gap-2 mt-2 animate-scaleIn">
                    <input type="text" placeholder="Укажите причину..." value={rejectReason} onChange={e => setRejectReason(e.target.value)} className="w-full h-10 bg-surface-1 border border-danger/50 focus:border-danger rounded-lg px-3 text-sm outline-none" />
                    <button onClick={() => submitStatusWithReason('rejected')} className="w-full h-10 bg-danger text-white rounded-lg text-sm font-bold hover:bg-danger-hover transition-colors">Сохранить</button>
                  </div>
                )}
                {showDuplicateTarget && (
                  <div className="flex flex-col gap-2 mt-2 animate-scaleIn">
                    <input type="text" placeholder="ID оригинала..." value={duplicateId} onChange={e => setDuplicateId(e.target.value)} className="w-full h-10 bg-surface-1 border border-borderDef focus:border-textPrimary rounded-lg px-3 text-sm outline-none" />
                    <button onClick={() => submitStatusWithReason('duplicate')} className="w-full h-10 bg-textPrimary text-bgDefault rounded-lg text-sm font-bold hover:bg-textSecondary transition-colors">Привязать</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-10 flex items-center px-3 bg-surface-1 border border-borderDef rounded-lg text-sm text-textPrimary">
                {currentStatus === 'new' ? 'Новый' : currentStatus === 'confirmed' ? 'Подтвержден' : currentStatus === 'in_progress' ? 'В работе' : currentStatus === 'fixed' ? 'Исправлен' : currentStatus === 'rejected' ? 'Отклонен' : 'Дубликат'}
              </div>
            )}
          </div>

          {/* Triage Severity & Priority (BR-BUG-016, FE-BUG-006) */}
          {viewMode === 'creator' && (
            <div className="flex flex-col gap-4 p-4 bg-surface-1 border border-borderDef rounded-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-textSecondary">Триаж разработчика</span>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-textTertiary">Подтвержденная важность</label>
                <select 
                  value={triageSeverity} 
                  onChange={handleTriageSeverityChange}
                  className="w-full h-9 bg-surface-2 border border-borderDef rounded-lg px-2.5 text-xs text-textPrimary outline-none cursor-pointer"
                >
                  <option value="low">Низкая (Косметическая)</option>
                  <option value="medium">Средняя (Геймплей)</option>
                  <option value="high">Высокая (Блокер миссии)</option>
                  <option value="critical">Критичная (Краш/софтлок)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-textTertiary">Внутренний приоритет</label>
                <select 
                  value={priority} 
                  onChange={handlePriorityChange}
                  className="w-full h-9 bg-surface-2 border border-borderDef rounded-lg px-2.5 text-xs text-textPrimary outline-none cursor-pointer"
                >
                  <option value="P0">P0 — Немедленный фикс (Hotfix)</option>
                  <option value="P1">P1 — Высокий (В текущий спринт)</option>
                  <option value="P2">P2 — Обычный (Следующий патч)</option>
                  <option value="P3">P3 — Низкий (Бэклог)</option>
                </select>
              </div>
            </div>
          )}

          {/* Meta Info */}
          <div className="flex flex-col gap-4 text-xs">
            <div className="flex flex-col gap-1">
              <span className="text-textSecondary">Оценка репортера</span>
              <span className={`font-semibold capitalize ${
                bug.reporterSeverity === 'critical' ? 'text-danger' : 
                bug.reporterSeverity === 'high' ? 'text-warning' : 
                bug.reporterSeverity === 'medium' ? 'text-info' : 'text-success'
              }`}>
                {bug.reporterSeverity}
              </span>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-textSecondary">Платформа</span>
              <span className="text-textPrimary capitalize font-semibold">{bug.platform}</span>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-textSecondary">Версия билда</span>
              <span className="text-textPrimary font-mono font-semibold">{bug.buildVersion}</span>
            </div>
          </div>

          {/* Attachments */}
          {bug.attachments.length > 0 && (
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-textSecondary">Вложения ({bug.attachments.length})</span>
              <div className="flex flex-col gap-2">
                {bug.attachments.map(att => (
                  <button key={att.id} className="flex items-center gap-3 p-3 bg-surface-1 hover:bg-surface-2 border border-borderDef rounded-lg text-left transition-colors group">
                    <Paperclip className="w-4 h-4 text-textTertiary group-hover:text-textPrimary shrink-0 transition-colors" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs text-textPrimary font-medium truncate">{att.name}</span>
                      <span className="text-[10px] text-textSecondary">{att.size ? `${(att.size / 1024).toFixed(1)} KB` : 'Файл'}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

