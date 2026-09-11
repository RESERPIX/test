import React, { useState, useRef, useEffect } from 'react';
import { 
  Image as ImageIcon, Save, Send, Gamepad2, 
  Users, ChevronLeft, Plus, Trash2, X, Settings2,
  Link2, Upload, Bold, Italic, Quote, Code, ShieldAlert, CheckCircle2,
  Calendar, Clock, MessageSquareOff, EyeOff, Eye, Trophy, AlertCircle,
  Heading, PenTool
} from 'lucide-react';
import Button from '../components/ui/Button';
import { DevLogType, DevLogCoreStatus } from '../types/devlog';
import { MOCK_DEVLOGS } from '../data/devlogMockData';
import DevMatrixPanel, { DevMatrixField } from '../components/DevMatrixPanel';
import { useAuth } from '../contexts/AuthContext';

export default function DevLogEditorPage({ onNavigate, devlogId, scope = 'personal' }: { onNavigate?: (path: string) => void; devlogId?: string; scope?: string }) {
  const { isAuthenticated, openAuthModal } = useAuth();
  
  // Format the scope display name for FE-TEAM-009
  const authorName = scope === 'personal' ? 'alex_dev (Личный профиль)' : scope === 'team_nocturnal' ? 'NocturnalDevs Studio (Команда)' : 'Объединенный профиль';
  
  const [authRole, setAuthRole] = useState<'guest'|'user'|'admin'>(isAuthenticated ? 'user' : 'guest');
  
  // Keep dev matrix role in sync with global auth if it changes outside
  useEffect(() => {
    if (authRole === 'guest' && isAuthenticated) setAuthRole('user');
    if (authRole !== 'guest' && !isAuthenticated) setAuthRole('guest');
  }, [isAuthenticated]);
  const [canWrite, setCanWrite] = useState(true);
  const [draftState, setDraftState] = useState<'unsaved'|'saved'>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [coreStatus, setCoreStatus] = useState<DevLogCoreStatus>('draft');

  const [type, setType] = useState<DevLogType>('update');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [isCoverPickerOpen, setIsCoverPickerOpen] = useState(false);
  const [coverSourceMode, setCoverSourceMode] = useState<'upload' | 'url'>('upload');
  const [coverUrlInput, setCoverUrlInput] = useState('');
  
  const [linkedGame, setLinkedGame] = useState('none');
  const [linkedJam, setLinkedJam] = useState('none');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  // Scheduled publishing (BR-DVL-027, FR-DVL-015, FR-DVL-016)
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledAt, setScheduledAt] = useState('');

  // Comments toggle (BR-DVL-053, FR-DVL-045)
  const [isCommentsDisabled, setIsCommentsDisabled] = useState(false);

  // Dynamic forms
  const [recruitmentRoles, setRecruitmentRoles] = useState<string[]>([]);
  const [roleInput, setRoleInput] = useState('');
  const [participationFormat, setParticipationFormat] = useState('Энтузиазм');
  const [engine, setEngine] = useState('');
  const [recruitmentSummary, setRecruitmentSummary] = useState('');
  
  // Specific state for 'need_feedback'
  const [feedbackCategories, setFeedbackCategories] = useState<string[]>([]);
  const [catInput, setCatInput] = useState('');
  const [feedbackQuestions, setFeedbackQuestions] = useState<string[]>([]);

  // Preview Mode for Markdown (FE-DVL-004)
  const [editorMode, setEditorMode] = useState<'write' | 'preview'>('write');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Pre-fill if editing an existing devlog (FR-DVL-025)
  useEffect(() => {
    if (devlogId) {
      const existing = MOCK_DEVLOGS.find(p => p.id === devlogId || p.slug === devlogId);
      if (existing) {
        setTitle(existing.title);
        setBody(existing.bodyMarkdown);
        setType(existing.type);
        setCoverUrl(existing.coverUrl || null);
        setTags(existing.tags || []);
        setLinkedGame(existing.gameId || 'none');
        setLinkedJam(existing.jamId || 'none');
        setCoreStatus(existing.coreStatus);
        setIsCommentsDisabled(existing.isCommentsDisabled ?? false);
        if (existing.recruitmentDetails) {
          setRecruitmentRoles(existing.recruitmentDetails.roles || []);
          const formatMap: Record<string, string> = { enthusiasm: 'Энтузиазм', jam: 'Джем', revshare: 'RevShare', commercial: 'Оплата' };
          setParticipationFormat(formatMap[existing.recruitmentDetails.participationFormat] || 'Энтузиазм');
          setEngine(existing.recruitmentDetails.engine || '');
          setRecruitmentSummary(existing.recruitmentDetails.summary || '');
        }
        if (existing.feedbackDetails) {
          setFeedbackCategories(existing.feedbackDetails.feedbackCategories || []);
          setFeedbackQuestions(existing.feedbackDetails.questions || []);
        }
        setDraftState('saved');
        setLastSavedTime(new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }));
      }
    }
  }, [devlogId]);

  // Auto-save interval (BR-DVL-021, FR-DVL-017)
  useEffect(() => {
    const timer = setInterval(() => {
      if (title.trim() && draftState === 'unsaved') {
        setDraftState('saved');
        const now = new Date();
        setLastSavedTime(now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }));
      }
    }, 20000);
    return () => clearInterval(timer);
  }, [title, draftState]);

  const saveDraft = () => {
    if (!title.trim()) {
      alert('Для сохранения черновика укажите хотя бы заголовок');
      return;
    }
    setDraftState('saved');
    const now = new Date();
    setLastSavedTime(now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }));
  };

  const handleNavigateBack = () => {
    if (draftState === 'unsaved' && (title.trim() || body.trim())) {
      if (!confirm('У вас есть несохраненные изменения в черновике. Покинуть редактор без сохранения?')) {
        return;
      }
    }
    onNavigate?.('/devlogs');
  };

  const renderInlineMarkdown = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\))/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      const token = match[0];
      if (token.startsWith('**') && token.endsWith('**')) {
        parts.push(<strong key={match.index} className="font-bold text-textPrimary">{token.slice(2, -2)}</strong>);
      } else if (token.startsWith('*') && token.endsWith('*')) {
        parts.push(<em key={match.index} className="italic text-textSecondary">{token.slice(1, -1)}</em>);
      } else if (token.startsWith('`') && token.endsWith('`')) {
        parts.push(<code key={match.index} className="px-1.5 py-0.5 rounded bg-surface-3 font-mono text-xs text-accent font-semibold">{token.slice(1, -1)}</code>);
      } else if (token.startsWith('[') && token.includes('](') && token.endsWith(')')) {
        const linkText = token.substring(1, token.indexOf(']('));
        const linkUrl = token.substring(token.indexOf('](') + 2, token.length - 1);
        parts.push(<a key={match.index} href={linkUrl} target="_blank" rel="noreferrer" className="text-accent hover:underline font-medium">{linkText}</a>);
      }
      lastIndex = match.index + token.length;
    }
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    return parts.length > 0 ? parts : text;
  };

  const renderMarkdownPreview = (content: string) => {
    if (!content.trim()) {
      return (
        <div className="py-20 px-8 text-center flex flex-col items-center justify-center gap-3 text-textTertiary">
          <PenTool className="w-8 h-8 opacity-40" />
          <p className="font-medium text-sm">Текст записи пока пуст.</p>
          <p className="text-xs text-textTertiary/70 max-w-sm">
            Переключитесь во вкладку «Редактор», чтобы наполнить статью текстом и отформатировать ее перед публикацией.
          </p>
        </div>
      );
    }

    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let inList = false;
    let listItems: React.ReactNode[] = [];

    const flushList = () => {
      if (inList && listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-1.5 my-3 text-textSecondary pl-2">
            {listItems}
          </ul>
        );
        listItems = [];
        inList = false;
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      if (trimmed.startsWith('# ')) {
        flushList();
        elements.push(
          <h1 key={index} className="text-3xl font-black text-textPrimary mt-6 mb-3 tracking-tight">
            {trimmed.slice(2)}
          </h1>
        );
        return;
      }

      if (trimmed.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={index} className="text-2xl font-black text-textPrimary mt-5 mb-2.5 tracking-tight">
            {trimmed.slice(3)}
          </h2>
        );
        return;
      }

      if (trimmed.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={index} className="text-xl font-bold text-textPrimary mt-4 mb-2 tracking-tight">
            {trimmed.slice(4)}
          </h3>
        );
        return;
      }

      if (trimmed.startsWith('> ')) {
        flushList();
        elements.push(
          <blockquote key={index} className="border-l-4 border-accent pl-4 py-2 my-4 bg-accent/5 rounded-r-xl text-textSecondary italic text-[15px]">
            {trimmed.slice(2)}
          </blockquote>
        );
        return;
      }

      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        inList = true;
        listItems.push(
          <li key={index} className="text-textSecondary">
            {renderInlineMarkdown(trimmed.slice(2))}
          </li>
        );
        return;
      }

      flushList();

      if (!trimmed) {
        elements.push(<div key={index} className="h-3" />);
        return;
      }

      const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
      if (imgMatch) {
        elements.push(
          <figure key={index} className="my-6">
            <img src={imgMatch[2]} alt={imgMatch[1]} className="rounded-2xl border border-borderDef max-h-[420px] w-full object-cover shadow-sm" />
            {imgMatch[1] && <figcaption className="text-xs text-textTertiary mt-2 text-center font-mono">{imgMatch[1]}</figcaption>}
          </figure>
        );
        return;
      }

      elements.push(
        <p key={index} className="text-textSecondary leading-[1.75] my-2 text-[16px] md:text-[17px]">
          {renderInlineMarkdown(trimmed)}
        </p>
      );
    });

    flushList();
    return <div className="p-6 md:p-8 space-y-1">{elements}</div>;
  };

  const insertMarkdown = (prefix: string, suffix: string = '', defaultPlaceholder: string = '') => {
    const el = textareaRef.current;
    if (!el) {
      setBody(prev => prev + prefix + defaultPlaceholder + suffix);
      setDraftState('unsaved');
      return;
    }
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selectedText = el.value.substring(start, end) || defaultPlaceholder;
    const replacement = `${prefix}${selectedText}${suffix}`;
    const newText = el.value.substring(0, start) + replacement + el.value.substring(end);
    setBody(newText);
    setDraftState('unsaved');
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 0);
  };

  const handlePublish = () => {
    if (!title.trim()) {
      alert('Для сохранения черновика или публикации укажите заголовок');
      return;
    }
    if (!body.trim()) {
      alert('Для публикации обязательны заголовок, текст и тип записи');
      return;
    }

    if (isScheduled && scheduledAt) {
      alert(`Публикация успешно запланирована на ${new Date(scheduledAt).toLocaleString('ru-RU')} `);
      onNavigate?.('/devlogs');
      return;
    }

    setCoreStatus('published');
    setDraftState('saved');
    alert('Девлог успешно опубликован!');
    onNavigate?.('/devlogs');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setCoverUrl(url);
      setDraftState('unsaved');
    }
  };

  const devFields: DevMatrixField[] = [
    {
      id: 'role', label: 'Роль', type: 'buttons', value: authRole, onChange: setAuthRole as any,
      options: [
        { value: 'guest', label: 'Гость' },
        { value: 'user', label: 'Юзер' },
        { value: 'admin', label: 'Админ' }
      ]
    },
    {
      id: 'can_write', label: 'Право писать', type: 'select', value: canWrite ? 'true' : 'false', 
      onChange: (v) => setCanWrite(v === 'true'),
      options: [
        { value: 'true', label: 'Да' },
        { value: 'false', label: 'Забанен' }
      ]
    },
    {
      id: 'draft', label: 'Статус черновика', type: 'buttons', value: draftState, onChange: setDraftState as any,
      highlight: true,
      options: [
        { value: 'unsaved', label: 'Не сохранен' },
        { value: 'saved', label: 'Сохранен' }
      ]
    },
    {
      id: 'core_status', label: 'Статус записи', type: 'buttons', value: coreStatus, onChange: setCoreStatus as any,
      options: [
        { value: 'draft', label: 'Черновик' },
        { value: 'published', label: 'Опубликован' },
        { value: 'hidden', label: 'Скрыт' },
        { value: 'blocked', label: 'Блок' }
      ]
    }
  ];

  if (authRole === 'guest') {
    return (
      <div className="min-h-screen bg-surface-0 flex flex-col relative font-sans">
        <DevMatrixPanel fields={devFields} />
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center mb-6">
            <Users className="w-8 h-8 text-textTertiary" />
          </div>
          <h2 className="text-3xl font-black text-textPrimary mb-4">Требуется авторизация</h2>
          <p className="text-textSecondary mb-8 max-w-md">Вы должны войти в свой аккаунт, чтобы писать девлоги и управлять командой.</p>
          <Button variant="primary" onClick={() => openAuthModal('LOGIN')}>Войти</Button>
        </div>
      </div>
    );
  }

  if (!canWrite) {
    return (
      <div className="min-h-screen bg-surface-0 flex flex-col relative font-sans">
        <DevMatrixPanel fields={devFields} />
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <div className="text-danger mb-4 p-4 rounded-full bg-danger/10 border border-danger/20">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-textPrimary mb-4">Режим чтения</h2>
          <p className="text-textSecondary mb-8 max-w-md">Вам заблокировано право создания новых записей из-за нарушения правил платформы.</p>
          <Button variant="secondary" onClick={() => onNavigate?.('/devlogs')}>Вернуться в ленту</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col relative font-sans">
      <DevMatrixPanel fields={devFields} />
      
      {/* NAVBAR */}
      <div className="sticky top-0 z-40 bg-surface-0/90 backdrop-blur-xl border-b border-borderDef/50 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex flex-col">
            <button 
              onClick={handleNavigateBack}
              className="flex items-center gap-2 text-[14px] font-bold text-textTertiary hover:text-textPrimary transition-colors"
            >
              <ChevronLeft className="w-5 h-5" /> К девлогам
            </button>
            <div className="flex items-center gap-1.5 ml-7 text-[10px] font-bold text-textSecondary bg-surface-2 px-2 py-0.5 rounded-full w-fit uppercase tracking-wider">
              <Users className="w-3 h-3" /> Автор: {authorName}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Status indicators */}
            {coreStatus === 'blocked' && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-danger bg-danger/10 border border-danger/20 px-2.5 py-1 rounded-lg">
                <AlertCircle className="w-3.5 h-3.5" /> Заблокирован
              </span>
            )}
            {coreStatus === 'hidden' && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-textTertiary bg-surface-2 border border-borderDef px-2.5 py-1 rounded-lg">
                <EyeOff className="w-3.5 h-3.5" /> Скрыт от публики
              </span>
            )}

            {/* Quick visibility toggle (BR-DVL-030) */}
            {coreStatus === 'published' && (
              <button 
                type="button"
                onClick={() => {
                  setCoreStatus('hidden');
                  alert('Запись скрыта из публичной ленты');
                }}
                className="flex items-center gap-1.5 text-[13px] font-bold text-textSecondary hover:text-textPrimary bg-surface-1 hover:bg-surface-2 border border-borderDef/60 px-3 py-1.5 rounded-xl transition-colors"
                title="Скрыть запись от всех, кроме автора"
              >
                <EyeOff className="w-4 h-4" /> Скрыть
              </button>
            )}
            {coreStatus === 'hidden' && (
              <button 
                type="button"
                onClick={() => {
                  setCoreStatus('published');
                  alert('Запись снова видна публично');
                }}
                className="flex items-center gap-1.5 text-[13px] font-bold text-textPrimary bg-surface-2 hover:bg-surface-3 border border-borderDef px-3 py-1.5 rounded-xl transition-colors"
                title="Сделать запись публичной"
              >
                <Eye className="w-4 h-4" /> Опубликовать
              </button>
            )}

            {draftState === 'saved' ? (
              <div className="flex items-center gap-1.5 text-[13px] font-bold text-success px-2" title="Автосохранение активно">
                <CheckCircle2 className="w-4 h-4" /> 
                {lastSavedTime ? `Сохранено в ${lastSavedTime}` : 'Черновик сохранен'}
              </div>
            ) : (
              <button 
                onClick={saveDraft}
                className="text-[13px] font-bold text-textSecondary hover:text-textPrimary transition-colors px-2"
                title="Нажмите для сохранения черновика"
              >
                Сохранить черновик
              </button>
            )}

            <Button 
              variant="primary" 
              onClick={handlePublish} 
              className="h-10 px-5 font-bold flex items-center gap-2 rounded-xl text-[14px] shadow-accent/20 shadow-lg"
            >
              {isScheduled && scheduledAt ? (
                <>
                  <Calendar className="w-4 h-4 mr-0.5" />
                  Запланировать
                </>
              ) : coreStatus === 'published' ? (
                <>
                  <Save className="w-4 h-4 mr-0.5" />
                  Сохранить
                </>
              ) : (
                <>
                  Опубликовать <Send className="w-4 h-4 ml-0.5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* WORKSPACE */}
      <div className="flex-1 max-w-[1200px] mx-auto w-full flex flex-col lg:flex-row items-stretch">
        
        {/* MAIN CANVAS */}
        <div className="flex-1 min-w-0 p-8 md:p-12 pb-32">
          
          {/* Cover Image Area */}
          <div className="mb-10">
            {coverUrl ? (
              <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden bg-surface-1 group border border-borderDef/30 shadow-md">
                <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    type="button"
                    onClick={() => {
                      setCoverUrlInput(coverUrl.startsWith('blob:') ? '' : coverUrl);
                      setIsCoverPickerOpen(true);
                    }}
                    className="px-4 py-2 bg-black/70 hover:bg-black text-white text-xs font-bold rounded-xl backdrop-blur-md transition-colors"
                  >
                    Изменить
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setCoverUrl(null);
                      setIsCoverPickerOpen(false);
                    }}
                    className="w-9 h-9 bg-black/70 hover:bg-danger text-white rounded-xl flex items-center justify-center backdrop-blur-md transition-colors"
                    title="Удалить обложку"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : isCoverPickerOpen ? (
              <div className="p-5 bg-surface-1 border border-borderDef/60 rounded-2xl max-w-lg animate-fadeIn space-y-5 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 bg-surface-2 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setCoverSourceMode('upload')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        coverSourceMode === 'upload' 
                          ? 'bg-surface-0 text-textPrimary shadow-sm' 
                          : 'text-textSecondary hover:text-textPrimary'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" /> Файл
                    </button>
                    <button
                      type="button"
                      onClick={() => setCoverSourceMode('url')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        coverSourceMode === 'url' 
                          ? 'bg-surface-0 text-textPrimary shadow-sm' 
                          : 'text-textSecondary hover:text-textPrimary'
                      }`}
                    >
                      <Link2 className="w-3.5 h-3.5" /> По ссылке
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsCoverPickerOpen(false)}
                    className="text-textTertiary hover:text-textPrimary p-1 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {coverSourceMode === 'upload' ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-borderDef hover:border-accent/50 bg-surface-0/50 hover:bg-surface-0 rounded-xl p-8 text-center cursor-pointer transition-colors group"
                  >
                    <Upload className="w-6 h-6 mx-auto mb-3 text-textTertiary group-hover:text-accent transition-colors" />
                    <p className="text-[13px] font-bold text-textPrimary mb-1">Нажмите для выбора файла</p>
                    <p className="text-[11px] text-textTertiary">PNG, JPG, WebP до 5 МБ</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input 
                        type="url"
                        value={coverUrlInput}
                        onChange={(e) => setCoverUrlInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && coverUrlInput.trim()) {
                            e.preventDefault();
                            setCoverUrl(coverUrlInput.trim());
                            setIsCoverPickerOpen(false);
                          }
                        }}
                        placeholder="https://images.unsplash.com/..."
                        className="flex-1 h-11 bg-surface-0 border border-borderDef focus:border-accent rounded-xl px-4 text-[13px] text-textPrimary outline-none transition-colors placeholder:text-textTertiary"
                      />
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={!coverUrlInput.trim()}
                        onClick={() => {
                          if (coverUrlInput.trim()) {
                            setCoverUrl(coverUrlInput.trim());
                            setIsCoverPickerOpen(false);
                          }
                        }}
                        className="h-11 px-5 text-[13px] font-bold rounded-xl shadow-md"
                      >
                        Применить
                      </Button>
                    </div>
                    <p className="text-[11px] text-textTertiary px-1">
                      Укажите прямую ссылку на изображение (HTTPS)
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <button 
                type="button"
                onClick={() => setIsCoverPickerOpen(true)}
                className="flex items-center gap-2 text-textTertiary hover:text-textPrimary transition-colors hover:bg-surface-1 px-4 py-2.5 rounded-xl -ml-4 border border-transparent hover:border-borderDef/50"
              >
                <ImageIcon className="w-4 h-4" />
                <span className="text-[14px] font-bold">Добавить обложку</span>
              </button>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={(e) => {
                handleImageUpload(e);
                setIsCoverPickerOpen(false);
              }} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          {/* Blocked Post Banner (BR-DVL-031, BR-DVL-033, BR-DVL-034, FR-DVL-025) */}
          {coreStatus === 'blocked' && (
            <div className="mb-8 p-5 rounded-2xl bg-danger/10 border border-danger/30 flex items-start gap-4">
              <div className="p-2 bg-danger/20 text-danger rounded-xl shrink-0 mt-0.5">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="text-sm">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-black text-danger text-[15px]">Редактирование заблокированной записи</span>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-danger/20 text-danger rounded">Модерация</span>
                </div>
                <p className="text-textSecondary leading-relaxed">
                  Вы можете свободно обновлять текст и устранять нарушения. Сохранение правок не снимает блокировку автоматически. После внесения изменений вернитесь на страницу девлога для отправки апелляции модераторам.
                </p>
              </div>
            </div>
          )}

          <input
            type="text"
            placeholder="Заголовок записи..."
            value={title}
            onChange={e => {
              setTitle(e.target.value);
              setDraftState('unsaved');
            }}
            className="w-full bg-transparent text-4xl md:text-[44px] leading-tight font-black text-textPrimary placeholder:text-textTertiary/40 outline-none mb-8 tracking-tight"
          />

          {/* EDITOR WITH FUNCTIONAL TOOLBAR & PREVIEW (FE-DVL-004) */}
          <div className="bg-surface-1/40 border border-borderDef/60 focus-within:border-accent/60 focus-within:ring-2 focus-within:ring-accent/10 rounded-2xl overflow-hidden transition-all shadow-sm flex flex-col">
            
            {/* Functional Markdown Toolbar Header with Mode Switcher */}
            <div className="flex items-center justify-between p-2 border-b border-borderDef/60 bg-surface-2/40 flex-wrap gap-2">
              
              {/* Write / Preview Tab Switcher */}
              <div className="flex items-center gap-1 bg-surface-1 p-1 rounded-xl border border-borderDef/50">
                <button
                  type="button"
                  onClick={() => setEditorMode('write')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    editorMode === 'write' 
                      ? 'bg-surface-0 text-textPrimary shadow-sm' 
                      : 'text-textSecondary hover:text-textPrimary'
                  }`}
                >
                  <PenTool className="w-3.5 h-3.5 text-accent" /> Редактор
                </button>
                <button
                  type="button"
                  onClick={() => setEditorMode('preview')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    editorMode === 'preview' 
                      ? 'bg-surface-0 text-textPrimary shadow-sm' 
                      : 'text-textSecondary hover:text-textPrimary'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 text-accent" /> Предпросмотр
                </button>
              </div>

              {/* Formatting Tools (Only active in 'write' mode) */}
              {editorMode === 'write' ? (
                <div className="flex items-center gap-1 flex-wrap">
                  <button 
                    type="button"
                    onClick={() => insertMarkdown('**', '**', 'жирный текст')}
                    title="Жирный шрифт"
                    className="p-2 text-textTertiary hover:text-textPrimary hover:bg-surface-3 rounded-lg transition-colors font-bold text-sm leading-none"
                  >
                    <Bold className="w-4 h-4" />
                  </button>

                  <button 
                    type="button"
                    onClick={() => insertMarkdown('*', '*', 'курсив')}
                    title="Курсив"
                    className="p-2 text-textTertiary hover:text-textPrimary hover:bg-surface-3 rounded-lg transition-colors italic text-sm leading-none"
                  >
                    <Italic className="w-4 h-4" />
                  </button>

                  <button 
                    type="button"
                    onClick={() => insertMarkdown('### ', '', 'Подзаголовок')}
                    title="Заголовок H3"
                    className="p-2 text-textTertiary hover:text-textPrimary hover:bg-surface-3 rounded-lg transition-colors font-black text-xs leading-none"
                  >
                    <Heading className="w-4 h-4" />
                  </button>

                  <div className="w-px h-5 bg-borderDef/60 mx-1.5" />

                  <button 
                    type="button"
                    onClick={() => insertMarkdown('> ', '', 'Цитата')}
                    title="Цитата"
                    className="p-2 text-textTertiary hover:text-textPrimary hover:bg-surface-3 rounded-lg transition-colors"
                  >
                    <Quote className="w-4 h-4" />
                  </button>

                  <button 
                    type="button"
                    onClick={() => insertMarkdown('`', '`', 'код')}
                    title="Встроенный код"
                    className="p-2 text-textTertiary hover:text-textPrimary hover:bg-surface-3 rounded-lg transition-colors"
                  >
                    <Code className="w-4 h-4" />
                  </button>

                  <button 
                    type="button"
                    onClick={() => insertMarkdown('[', '](https://)', 'текст ссылки')}
                    title="Ссылка"
                    className="p-2 text-textTertiary hover:text-textPrimary hover:bg-surface-3 rounded-lg transition-colors"
                  >
                    <Link2 className="w-4 h-4" />
                  </button>

                  <button 
                    type="button"
                    onClick={() => insertMarkdown('![', '](https://)', 'описание картинки')}
                    title="Изображение в тексте"
                    className="p-2 text-textTertiary hover:text-textPrimary hover:bg-surface-3 rounded-lg transition-colors"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="text-xs font-mono text-textTertiary px-2">
                  Форматированный вид публикации
                </div>
              )}
            </div>
            
            {/* Editor Body: Write mode (Textarea) vs Preview mode (Rendered Markdown) */}
            {editorMode === 'write' ? (
              <textarea
                ref={textareaRef}
                placeholder="Расскажите о процессе разработки. Поддерживается разметка Markdown..."
                value={body}
                onChange={e => {
                  setBody(e.target.value);
                  setDraftState('unsaved');
                }}
                className="w-full min-h-[340px] bg-transparent text-[16px] md:text-[17px] text-textSecondary placeholder:text-textTertiary/50 outline-none resize-y p-6 leading-[1.7]"
              />
            ) : (
              <div className="min-h-[340px] bg-surface-0/20">
                {renderMarkdownPreview(body)}
              </div>
            )}
          </div>

          {/* DYNAMIC FORMS WITH CLEAR BOUNDARIES */}
          {type === 'looking_for_team' && (
            <div className="mt-12 bg-surface-1/40 border border-borderDef/60 rounded-2xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-borderDef/60">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-xl font-black text-textPrimary tracking-tight">Открытые позиции в команду</h3>
              </div>
              
              <div className="space-y-8">
                <div>
                  <label className="block text-[12px] font-bold text-textTertiary uppercase tracking-widest mb-3">
                    Специальности
                  </label>
                  <div className="flex flex-wrap gap-2.5 mb-4">
                    {recruitmentRoles.map((role, idx) => (
                      <span key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-surface-1 border border-borderDef rounded-xl text-[14px] font-bold text-textPrimary shadow-sm">
                        {role}
                        <button onClick={() => setRecruitmentRoles(recruitmentRoles.filter((_, i) => i !== idx))} className="text-textTertiary hover:text-danger transition-colors ml-1">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input 
                    type="text"
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && roleInput.trim()) {
                        e.preventDefault();
                        if (!recruitmentRoles.includes(roleInput.trim())) setRecruitmentRoles([...recruitmentRoles, roleInput.trim()]);
                        setRoleInput('');
                      }
                    }}
                    placeholder="Добавить роль (Например: 2D Artist) + Enter"
                    className="w-full h-12 bg-surface-1 hover:bg-surface-2 border border-borderDef focus:border-accent rounded-xl px-4 text-[14px] text-textPrimary outline-none transition-colors placeholder:text-textTertiary shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[12px] font-bold text-textTertiary uppercase tracking-widest mb-3">
                      Формат участия
                    </label>
                    <div className="relative">
                      <select 
                        value={participationFormat}
                        onChange={(e) => setParticipationFormat(e.target.value)}
                        className="w-full appearance-none bg-surface-1 hover:bg-surface-2 border border-borderDef focus:border-accent rounded-xl h-12 px-4 text-[15px] font-bold text-textPrimary outline-none cursor-pointer transition-colors shadow-sm"
                      >
                        <option value="Энтузиазм">На энтузиазме (Пет-проект)</option>
                        <option value="Джем">Участие в джеме (Jam)</option>
                        <option value="RevShare">RevShare (Доля от дохода)</option>
                        <option value="Оплата">Коммерческая оплата</option>
                        <option value="Договорная">Договорная</option>
                      </select>
                      <ChevronLeft className="w-5 h-5 -rotate-90 text-textTertiary absolute right-4 top-3.5 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-textTertiary uppercase tracking-widest mb-3">
                      Движок / Стек (Опционально)
                    </label>
                    <input 
                      type="text"
                      value={engine}
                      onChange={(e) => setEngine(e.target.value)}
                      placeholder="Например: Unreal Engine 5"
                      className="w-full h-12 bg-surface-1 hover:bg-surface-2 border border-borderDef focus:border-accent rounded-xl px-4 text-[15px] text-textPrimary outline-none transition-colors placeholder:text-textTertiary shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-textTertiary uppercase tracking-widest mb-3">
                    Условия и задачи (Кратко)
                  </label>
                  <textarea 
                    value={recruitmentSummary}
                    onChange={(e) => setRecruitmentSummary(e.target.value)}
                    placeholder="Опишите, что именно предстоит делать и какие условия работы..."
                    className="w-full min-h-[100px] bg-surface-1 hover:bg-surface-2 border border-borderDef focus:border-accent rounded-xl p-4 text-[15px] text-textPrimary outline-none transition-colors resize-y leading-relaxed shadow-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {type === 'need_feedback' && (
            <div className="mt-12 bg-surface-1/40 border border-borderDef/60 rounded-2xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-info/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-borderDef/60">
                <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5 text-info" />
                </div>
                <h3 className="text-xl font-black text-textPrimary tracking-tight">Запрос фидбека</h3>
              </div>
              
              <div className="space-y-8">
                <div>
                  <label className="block text-[12px] font-bold text-textTertiary uppercase tracking-widest mb-3">
                    Фокус тестирования
                  </label>
                  <div className="flex flex-wrap gap-2.5 mb-4">
                    {feedbackCategories.map((cat, idx) => (
                      <span key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-surface-1 border border-borderDef rounded-xl text-[14px] font-bold text-textPrimary shadow-sm">
                        {cat}
                        <button onClick={() => setFeedbackCategories(feedbackCategories.filter((_, i) => i !== idx))} className="text-textTertiary hover:text-danger transition-colors ml-1">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input 
                    type="text"
                    value={catInput}
                    onChange={(e) => setCatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && catInput.trim()) {
                        e.preventDefault();
                        if (!feedbackCategories.includes(catInput.trim())) setFeedbackCategories([...feedbackCategories, catInput.trim()]);
                        setCatInput('');
                      }
                    }}
                    placeholder="Добавить направление (Например: Баланс) + Enter"
                    className="w-full h-12 bg-surface-1 hover:bg-surface-2 border border-borderDef focus:border-info rounded-xl px-4 text-[14px] text-textPrimary outline-none transition-colors placeholder:text-textTertiary shadow-sm"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-[12px] font-bold text-textTertiary uppercase tracking-widest">
                      Целевые вопросы к игрокам
                    </label>
                    <button 
                      onClick={() => setFeedbackQuestions([...feedbackQuestions, ''])}
                      className="flex items-center gap-1.5 text-[13px] font-bold text-info hover:text-info/80 transition-colors bg-info/10 px-3 py-1.5 rounded-lg"
                    >
                      <Plus className="w-4 h-4" /> Добавить
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {feedbackQuestions.map((q, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-8 h-12 flex items-center justify-center text-[14px] font-bold text-textTertiary shrink-0">
                          {idx + 1}.
                        </div>
                        <input
                          type="text"
                          value={q}
                          onChange={e => {
                            const newQs = [...feedbackQuestions];
                            newQs[idx] = e.target.value;
                            setFeedbackQuestions(newQs);
                          }}
                          placeholder="Пример: Как вам баланс сложности на уровне 3?"
                          className="flex-1 h-12 bg-surface-1 hover:bg-surface-2 border border-borderDef focus:border-info rounded-xl px-4 text-[15px] text-textPrimary outline-none transition-colors shadow-sm placeholder:text-textTertiary/50"
                        />
                        <button 
                          onClick={() => setFeedbackQuestions(feedbackQuestions.filter((_, i) => i !== idx))}
                          className="w-12 h-12 flex items-center justify-center rounded-xl border border-borderDef bg-surface-1 hover:bg-danger/10 hover:border-danger/30 hover:text-danger text-textTertiary transition-colors shrink-0"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    {feedbackQuestions.length === 0 && (
                      <div className="text-[14px] text-textTertiary font-medium p-4 border border-dashed border-borderDef rounded-xl text-center">
                        Свободный фидбек (нет конкретных вопросов)
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SIDEBAR PROPERTIES - Transparent with strict input boundaries */}
        <div className="w-full lg:w-[320px] shrink-0 pt-8 md:pt-12">
          <div className="sticky top-28 space-y-10">
            
            <div className="flex items-center gap-3 pb-4 border-b border-borderDef">
              <Settings2 className="w-5 h-5 text-textSecondary" />
              <span className="text-[14px] font-bold text-textPrimary tracking-wide uppercase">Настройки</span>
            </div>

            <div className="space-y-4">
              <label className="block text-[13px] font-bold text-textSecondary">Тип публикации</label>
              <div className="relative">
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value as DevLogType)}
                  className="w-full appearance-none bg-surface-1 border border-borderDef hover:border-borderStrong focus:border-accent rounded-xl h-12 px-4 text-[14px] font-bold text-textPrimary outline-none cursor-pointer transition-colors shadow-sm"
                >
                  <option value="update">Обновление / Патч</option>
                  <option value="looking_for_team">Поиск команды</option>
                  <option value="need_feedback">Запрос фидбека</option>
                  <option value="postmortem">Постмортем</option>
                  <option value="announcement">Анонс</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <ChevronLeft className="w-5 h-5 -rotate-90 text-textTertiary" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-[13px] font-bold text-textSecondary">Привязка к игре</label>
              <div className="relative">
                <select 
                  value={linkedGame}
                  onChange={(e) => {
                    const newGame = e.target.value;
                    setLinkedGame(newGame);
                    if (newGame === 'none') {
                      setLinkedJam('none'); // BR-DVL-004: jam_id не используется без game_id
                    }
                  }}
                  className="w-full appearance-none bg-surface-1 border border-borderDef hover:border-borderStrong focus:border-accent rounded-xl h-12 px-4 text-[14px] font-bold text-textPrimary outline-none cursor-pointer transition-colors shadow-sm"
                >
                  <option value="none">Без привязки (Личный блог)</option>
                  <option value="g-1">Cyber Quest</option>
                  <option value="game-brokenlore">BrokenLore</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <ChevronLeft className="w-5 h-5 -rotate-90 text-textTertiary" />
                </div>
              </div>
            </div>

            {/* Jam Relation (BR-DVL-004, BR-DVL-005) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-[13px] font-bold text-textSecondary flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-warning" /> Привязка к джему
                </label>
                {linkedGame === 'none' && (
                  <span className="text-[10px] font-bold text-textTertiary uppercase">Нужна игра</span>
                )}
              </div>
              <div className="relative">
                <select 
                  value={linkedJam}
                  disabled={linkedGame === 'none'}
                  onChange={(e) => setLinkedJam(e.target.value)}
                  className={`w-full appearance-none rounded-xl h-12 px-4 text-[14px] font-bold outline-none transition-colors shadow-sm ${
                    linkedGame === 'none'
                      ? 'bg-surface-2/50 border border-borderDef/40 text-textTertiary cursor-not-allowed'
                      : 'bg-surface-1 border border-borderDef hover:border-borderStrong focus:border-accent text-textPrimary cursor-pointer'
                  }`}
                >
                  <option value="none">Без привязки к джему</option>
                  <option value="jam-autumn-2026">Hubigr Autumn Jam 2026</option>
                  <option value="j-1">Mini-Jam: One Room</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <ChevronLeft className="w-5 h-5 -rotate-90 text-textTertiary" />
                </div>
              </div>
              <p className="text-[11px] text-textTertiary leading-snug">
                {linkedGame === 'none' 
                  ? 'Джем может быть указан только как дополнительная связь игры.'
                  : 'Связь с джемом, в котором участвует выбранный проект.'}
              </p>
            </div>

            <div className="space-y-4">
              <label className="block text-[13px] font-bold text-textSecondary">Теги</label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, idx) => (
                  <span key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-2 border border-borderDef text-[13px] font-bold text-textPrimary rounded-lg shadow-sm">
                    {tag}
                    <button onClick={() => setTags(tags.filter((_, i) => i !== idx))} className="text-textTertiary hover:text-danger transition-colors ml-0.5">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
              <input 
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && tagInput.trim()) {
                    e.preventDefault();
                    if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
                    setTagInput('');
                  }
                }}
                placeholder="Добавить тег (Enter)"
                className="w-full h-12 bg-surface-1 border border-borderDef focus:border-accent rounded-xl px-4 text-[14px] text-textPrimary outline-none transition-colors placeholder:text-textTertiary shadow-sm"
              />
            </div>

            {/* Scheduled Publishing (BR-DVL-027, FR-DVL-015, FR-DVL-016) */}
            <div className="p-4 bg-surface-1/60 border border-borderDef/70 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-[13px] font-bold text-textPrimary cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isScheduled} 
                    onChange={(e) => {
                      setIsScheduled(e.target.checked);
                      if (!e.target.checked) setScheduledAt('');
                    }}
                    className="rounded border-borderDef text-accent focus:ring-accent w-4 h-4"
                  />
                  <Calendar className="w-4 h-4 text-accent" />
                  Запланировать публикацию
                </label>
              </div>

              {isScheduled && (
                <div className="space-y-2 pt-1 animate-fadeIn">
                  <input 
                    type="datetime-local" 
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="w-full bg-surface-0 border border-borderDef focus:border-accent rounded-xl h-10 px-3 text-[13px] font-medium text-textPrimary outline-none transition-colors"
                  />
                  <p className="text-[11px] text-textTertiary leading-snug">
                    До наступления времени пост останется непубличным черновиком.
                  </p>
                </div>
              )}
            </div>

            {/* Comments Toggle (BR-DVL-053, FR-DVL-045) */}
            <div className="p-4 bg-surface-1/60 border border-borderDef/70 rounded-2xl space-y-2">
              <label className="flex items-start gap-2 text-[13px] font-bold text-textPrimary cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isCommentsDisabled} 
                  onChange={(e) => setIsCommentsDisabled(e.target.checked)}
                  className="rounded border-borderDef text-accent focus:ring-accent w-4 h-4 mt-0.5"
                />
                <div>
                  <span className="flex items-center gap-1.5">
                    <MessageSquareOff className="w-3.5 h-3.5 text-textTertiary" /> Отключить новые комментарии
                  </span>
                  <span className="block text-[11px] font-normal text-textTertiary mt-0.5 leading-snug">
                    Старые комментарии останутся видны, но создание новых будет закрыто.
                  </span>
                </div>
              </label>
            </div>

            {/* Management & Danger Zone (BR-DVL-030, BR-DVL-036) */}
            <div className="pt-4 border-t border-borderDef/60 space-y-3">
              <span className="text-[11px] font-black uppercase tracking-widest text-textTertiary block mb-2">
                Управление записью
              </span>

              {coreStatus !== 'hidden' ? (
                <button
                  type="button"
                  onClick={() => {
                    setCoreStatus('hidden');
                    alert('Запись скрыта из публичного доступа');
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-surface-1 hover:bg-surface-2 border border-borderDef rounded-xl text-[13px] font-bold text-textSecondary hover:text-textPrimary transition-colors"
                >
                  <EyeOff className="w-4 h-4" /> Скрыть из публичного доступа
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setCoreStatus('published');
                    alert('Запись возвращена в статус опубликованной');
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-surface-2 hover:bg-surface-3 border border-borderDef rounded-xl text-[13px] font-bold text-textPrimary transition-colors"
                >
                  <Eye className="w-4 h-4" /> Восстановить публикацию
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  if (confirm('Вы уверены, что хотите удалить девлог? Запись будет снята с публикации с сохранением истории аудита.')) {
                    alert('Девлог удален (soft delete). Он исключен из ленты и поиска.');
                    onNavigate?.('/devlogs');
                  }
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-danger/5 hover:bg-danger/10 border border-danger/20 rounded-xl text-[13px] font-bold text-danger transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Удалить запись
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
