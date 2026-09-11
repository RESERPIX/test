import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Gamepad2, Users, ChevronLeft, Plus, Trash2, X, Settings2,
  Image as ImageIcon, Sparkles, Bold, Italic, Quote, Code, Link2, AlertTriangle,
  Edit3, Check, Bookmark, ExternalLink, Upload, Eye, FileText, Tag, Trophy
} from 'lucide-react';
import { MOCK_COMMUNITY_CATEGORIES, addCommunityThread, updateCommunityThread, getStoredCommunityThreads } from '../data/communityMockData';
import { MOCK_DEVLOGS } from '../data/devlogMockData';
import { CommunityThreadType, CommunityThread } from '../types/community';
import Button from '../components/ui/Button';
import DevMatrixPanel, { DevMatrixField } from '../components/DevMatrixPanel';

const ROLES = [
  'Геймдизайнер',
  'Unity-разработчик',
  'Godot-разработчик',
  'Unreal-разработчик',
  '2D-художник',
  '3D-моделлер',
  'Аниматор',
  'Композитор / Саунд-дизайнер',
  'Сценарист / Нарративщик',
  'Тестировщик',
  'Другое'
];

const FORMATS = [
  { id: 'enthusiasm', label: 'Энтузиазм / Пет-проект' },
  { id: 'jam', label: 'Геймджем (краткосрочный проект)' },
  { id: 'revshare', label: 'RevShare (доля от будущей прибыли)' },
  { id: 'commercial', label: 'Коммерческий / Оплата работы' },
];

const EXPERIENCE_LEVELS: { id: 'beginner' | 'mid' | 'senior'; label: string }[] = [
  { id: 'beginner', label: 'Начинающие' },
  { id: 'mid', label: 'Есть опыт (1-2 проекта)' },
  { id: 'senior', label: 'Опытные / Middle+' }
];

const SUGGESTED_SKILLS = ['Blender', 'FMOD', 'Spine', 'C#', 'GDScript', 'Pixel Art', 'Photoshop', 'Git', 'Substance Painter'];

const ENGINES = ['Unity', 'Godot', 'Unreal Engine', 'GameMaker', 'Custom/C++', 'Другой'];

const FEEDBACK_CATEGORIES = [
  'Gameplay (Игровой процесс / механики)',
  'UI-UX (Интерфейс и удобство)',
  'Bugs (Поиск багов / стабильность)',
  'Balance (Баланс и сложность)',
  'Art (Визуальный стиль / арт)',
  'Audio (Музыка и звук)',
  'Performance (Производительность)',
  'Idea (Концепция и сюжет)',
  'Other (Другое)'
];

const PLATFORMS = ['Браузер (WebGL)', 'Windows', 'macOS', 'Linux', 'Android'];

const ESTIMATED_TIMES = ['5-10 минут', '15-30 минут', '1 час', 'Более часа'];

const AVAILABLE_GAMES = [
  { id: 'brokenlore-follow', title: 'BrokenLore: FOLLOW', slug: 'brokenlore-follow' },
  { id: 'neon-horizon-vector-run', title: 'Neon Horizon: Vector Run', slug: 'neon-horizon-vector-run' },
  { id: 'stellar-nomad', title: 'Stellar Nomad', slug: 'stellar-nomad' },
  { id: 'cyber-tactics', title: 'Cyber Tactics', slug: 'cyber-tactics' },
  { id: 'pixel-dungeon-odyssey', title: 'Pixel Dungeon Odyssey', slug: 'pixel-dungeon-odyssey' }
];

const AVAILABLE_JAMS = [
  { id: 'cyberjam-2026', title: 'Cyberjam 2026', slug: 'cyberjam-2026' },
  { id: 'summer-game-jam-2026', title: 'Летний Хабигр Джем 2026', slug: 'summer-game-jam-2026' },
  { id: 'godot-speedjam', title: 'Godot Speedjam #4', slug: 'godot-speedjam' },
  { id: 'indie-cup-proto', title: 'Indie Cup Prototype 2026', slug: 'indie-cup-proto' }
];

export default function CommunityNewThreadPage({ 
  onNavigate, 
  editThreadId 
}: { 
  onNavigate?: (path: string) => void; 
  editThreadId?: string;
}) {
  const isEditing = Boolean(editThreadId);
  const [existingThread, setExistingThread] = useState<CommunityThread | null>(null);

  // DEV MATRIX
  const [authRole, setAuthRole] = useState<'guest'|'user'|'admin'>('user');
  const [canWrite, setCanWrite] = useState<boolean>(true);

  const devFields: DevMatrixField[] = [
    {
      id: 'auth', label: 'Auth', type: 'select', value: authRole, onChange: setAuthRole as any,
      options: [
        { value: 'guest', label: 'Гость' },
        { value: 'user', label: 'Пользователь' },
        { value: 'admin', label: 'Администратор' },
      ]
    },
    {
      id: 'write_access', label: 'Право писать', type: 'select', value: canWrite ? 'true' : 'false', 
      onChange: (v) => setCanWrite(v === 'true'),
      options: [
        { value: 'true', label: 'Да' },
        { value: 'false', label: 'Бан' }
      ]
    }
  ];

  const [categoryId, setCategoryId] = useState<string>('');
  const [type, setType] = useState<CommunityThreadType>('normal');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [editorMode, setEditorMode] = useState<'edit' | 'preview'>('edit');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Dynamic states for LookingForTeam
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [format, setFormat] = useState<string>('enthusiasm');
  const [summary, setSummary] = useState('');
  const [engine, setEngine] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [experience, setExperience] = useState<'beginner' | 'mid' | 'senior' | undefined>(undefined);
  
  // Dynamic states for NeedFeedback
  const [selectedFbCats, setSelectedFbCats] = useState<string[]>([]);
  const [questions, setQuestions] = useState<string[]>(['']);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [estimatedTime, setEstimatedTime] = useState<string>('15-30 минут');

  // Dynamic states for show_progress
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [mediaInputUrl, setMediaInputUrl] = useState('');
  const [linkedDevLogId, setLinkedDevLogId] = useState('');

  // Dynamic states for share_reference
  const [sourceType, setSourceType] = useState<'devlog' | 'jam_thread'>('devlog');
  const [sourceTitle, setSourceTitle] = useState('');
  const [sourcePreview, setSourcePreview] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [sourceAuthorNick, setSourceAuthorNick] = useState('');
  const [selectedDevLogId, setSelectedDevLogId] = useState('');

  // Context relations
  const [linkedGameId, setLinkedGameId] = useState<string>('');
  const [linkedJamId, setLinkedJamId] = useState<string>('');

  // Tags
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (editThreadId) {
      const found = getStoredCommunityThreads().find(t => t.id === editThreadId);
      if (found) {
        setExistingThread(found);
        setTitle(found.title);
        setBody(found.bodyMarkdown);
        setCategoryId(found.categoryId);
        setType(found.type);
        setTags(found.tags || []);
        setLinkedGameId(found.linkedGameId || '');
        setLinkedJamId(found.linkedJamId || '');
        if (found.type === 'looking_for_team' && found.lookingForTeamDetails) {
          setSelectedRoles(found.lookingForTeamDetails.roles || []);
          setFormat(found.lookingForTeamDetails.participationFormat || 'enthusiasm');
          setSummary(found.lookingForTeamDetails.summary || found.title);
          setEngine(found.lookingForTeamDetails.engine || '');
          setSkills(found.lookingForTeamDetails.skills || []);
          setExperience(found.lookingForTeamDetails.experience);
        }
        if (found.type === 'need_feedback' && found.needFeedbackDetails) {
          setSelectedFbCats(found.needFeedbackDetails.feedbackCategories || []);
          setQuestions(found.needFeedbackDetails.questions?.length ? found.needFeedbackDetails.questions : ['']);
          setSelectedPlatforms(found.needFeedbackDetails.platform || []);
          setEstimatedTime(found.needFeedbackDetails.estimatedTime || '15-30 минут');
        }
        if (found.type === 'show_progress' && found.showProgressDetails) {
          setMediaUrls(found.showProgressDetails.mediaUrls || []);
          setLinkedDevLogId(found.showProgressDetails.devLogId || '');
        }
        if (found.type === 'share_reference' && found.shareReferenceDetails) {
          setSourceType(found.shareReferenceDetails.sourceType || 'devlog');
          setSourceTitle(found.shareReferenceDetails.sourceTitle || '');
          setSourcePreview(found.shareReferenceDetails.sourcePreview || '');
          setSourceUrl(found.shareReferenceDetails.sourceUrl || '');
          setSourceAuthorNick(found.shareReferenceDetails.sourceAuthorNick || '');
          setSelectedDevLogId(found.shareReferenceDetails.sourceId || '');
        }
      }
    }
  }, [editThreadId]);

  // Category cannot be changed once replies exist (repliesCount > 0), unless admin/staff
  const isCategoryLocked = isEditing && Boolean(existingThread && existingThread.repliesCount > 0 && authRole !== 'admin');

  // Toolbar action helper
  const insertFormat = (prefix: string, suffix: string = '', defaultPlaceholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = body.substring(start, end);
    const textToInsert = selected || defaultPlaceholder;
    const newBody = body.substring(0, start) + prefix + textToInsert + suffix + body.substring(end);
    setBody(newBody);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + textToInsert.length);
    }, 10);
  };

  const handlePublish = () => {
    setErrorMessage(null);

    // Auth & Permission Check
    if (authRole === 'guest') {
      setErrorMessage('Для создания или редактирования темы необходимо войти в аккаунт.');
      return;
    }
    if (!canWrite) {
      setErrorMessage('Создание тем и комментариев временно ограничено модерацией для вашего аккаунта.');
      return;
    }

    // Validation:
    if (!categoryId) {
      setErrorMessage('Выберите активную категорию для публикации темы.');
      return;
    }
    if (!title.trim() || title.trim().length < 5) {
      setErrorMessage('Заголовок слишком короткий (минимум 5 символов).');
      return;
    }
    if (title.trim().length > 150) {
      setErrorMessage('Заголовок слишком длинный (максимум 150 символов).');
      return;
    }
    if (!body.trim() || body.trim().length < 10) {
      setErrorMessage('Напишите содержание темы (минимум 10 символов).');
      return;
    }

    if (type === 'looking_for_team') {
      if (selectedRoles.length === 0) {
        setErrorMessage('Укажите хотя бы одну роль в анкете поиска команды.');
        return;
      }
      if (!format) {
        setErrorMessage('Выберите формат участия.');
        return;
      }
      if (!summary.trim()) {
        setErrorMessage('Укажите краткое резюме поиска.');
        return;
      }
    }

    if (type === 'need_feedback') {
      if (selectedFbCats.length === 0) {
        setErrorMessage('Выберите минимум одно направление фидбека.');
        return;
      }
    }

    if (type === 'show_progress') {
      if (mediaUrls.length === 0 && body.trim().length < 10) {
        setErrorMessage('Добавьте медиафайлы или подробное описание прогресса.');
        return;
      }
    }

    if (type === 'share_reference') {
      if (!sourceTitle.trim()) {
        setErrorMessage('Укажите заголовок цитируемого источника.');
        return;
      }
      if (!sourceUrl.trim()) {
        setErrorMessage('Укажите ссылку на цитируемый источник.');
        return;
      }
    }

    const selectedGame = AVAILABLE_GAMES.find(g => g.id === linkedGameId);
    const selectedJam = AVAILABLE_JAMS.find(j => j.id === linkedJamId);

    if (isEditing && editThreadId && existingThread) {
      updateCommunityThread(editThreadId, {
        title: title.trim(),
        bodyMarkdown: body.trim(),
        categoryId: isCategoryLocked ? existingThread.categoryId : categoryId,
        tags: tags,
        type: type,
        linkedGameId: selectedGame ? selectedGame.id : null,
        linkedGameSlug: selectedGame ? selectedGame.slug : null,
        linkedGameName: selectedGame ? selectedGame.title : null,
        linkedJamId: selectedJam ? selectedJam.id : null,
        linkedJamSlug: selectedJam ? selectedJam.slug : null,
        linkedJamName: selectedJam ? selectedJam.title : null,
        contextType: selectedJam ? 'jam' : 'global',
        ...(type === 'looking_for_team' ? {
          lookingForTeamDetails: {
            ...(existingThread.lookingForTeamDetails || { searchState: 'active' }),
            roles: selectedRoles,
            participationFormat: format as any,
            summary: summary.trim() || title.trim(),
            engine: engine || undefined,
            skills: skills,
            experience: experience,
          }
        } : {}),
        ...(type === 'need_feedback' ? {
          needFeedbackDetails: {
            ...(existingThread.needFeedbackDetails || {}),
            feedbackCategories: selectedFbCats,
            questions: questions.filter(q => q.trim().length > 0),
            platform: selectedPlatforms,
            estimatedTime: estimatedTime || undefined
          }
        } : {}),
        ...(type === 'show_progress' ? {
          showProgressDetails: {
            mediaUrls,
            devLogId: linkedDevLogId || null
          }
        } : {}),
        ...(type === 'share_reference' ? {
          shareReferenceDetails: {
            sourceType,
            sourceId: selectedDevLogId || (existingThread.shareReferenceDetails?.sourceId || `ref-${Date.now()}`),
            sourceTitle: sourceTitle.trim(),
            sourcePreview: sourcePreview.trim() || sourceTitle.trim(),
            sourceUrl: sourceUrl.trim(),
            sourceAuthorNick: sourceAuthorNick.trim() || 'Автор',
            sourceCreatedAt: existingThread.shareReferenceDetails?.sourceCreatedAt || new Date().toISOString()
          }
        } : {})
      });
      onNavigate?.(`/community/thread/${editThreadId}`);
      return;
    }

    const newThread: CommunityThread = {
      id: `th-${Date.now()}`,
      categoryId,
      type,
      title: title.trim(),
      bodyMarkdown: body.trim(),
      authorId: 'current_user',
      authorNick: 'CurrentUser',
      authorAvatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=me',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      visibilityState: 'published',
      discussionState: 'open',
      isOfficial: false,
      isPinned: false,
      isSolved: false,
      tags: tags,
      normalizedViews: 1,
      repliesCount: 0,
      likesCount: 0,
      linkedGameId: selectedGame ? selectedGame.id : null,
      linkedGameSlug: selectedGame ? selectedGame.slug : null,
      linkedGameName: selectedGame ? selectedGame.title : null,
      linkedJamId: selectedJam ? selectedJam.id : null,
      linkedJamSlug: selectedJam ? selectedJam.slug : null,
      linkedJamName: selectedJam ? selectedJam.title : null,
      contextType: selectedJam ? 'jam' : 'global',
      ...(type === 'looking_for_team' ? {
        lookingForTeamDetails: {
          roles: selectedRoles,
          participationFormat: format as any,
          summary: summary.trim() || title.trim(),
          engine: engine || undefined,
          skills: skills,
          experience: experience,
          searchState: 'active'
        }
      } : {}),
      ...(type === 'need_feedback' ? {
        needFeedbackDetails: {
          feedbackCategories: selectedFbCats,
          questions: questions.filter(q => q.trim().length > 0),
          platform: selectedPlatforms,
          estimatedTime: estimatedTime || undefined
        }
      } : {}),
      ...(type === 'show_progress' ? {
        showProgressDetails: {
          mediaUrls,
          devLogId: linkedDevLogId || null
        }
      } : {}),
      ...(type === 'share_reference' ? {
        shareReferenceDetails: {
          sourceType,
          sourceId: selectedDevLogId || `ref-${Date.now()}`,
          sourceTitle: sourceTitle.trim(),
          sourcePreview: sourcePreview.trim() || sourceTitle.trim(),
          sourceUrl: sourceUrl.trim(),
          sourceAuthorNick: sourceAuthorNick.trim() || 'Автор',
          sourceCreatedAt: new Date().toISOString()
        }
      } : {})
    };

    addCommunityThread(newThread);
    onNavigate?.(`/community/thread/${newThread.id}`);
  };

  const toggleArrayItem = (arr: string[], setArr: (val: string[]) => void, item: string) => {
    if (arr.includes(item)) setArr(arr.filter(i => i !== item));
    else setArr([...arr, item]);
  };

  // Safe and clean Markdown rendering without dangerouslySetInnerHTML
  const renderInlineSpans = (text: string): React.ReactNode => {
    const tokens: React.ReactNode[] = [];
    let remaining = text;
    let keyIdx = 0;

    while (remaining.length > 0) {
      // Image: ![alt](url)
      const imgMatch = remaining.match(/^!\[([^\]]*)\]\((https?:\/\/[^\s\)]+)\)/);
      if (imgMatch) {
        tokens.push(
          <img 
            key={keyIdx++} 
            src={imgMatch[2]} 
            alt={imgMatch[1]} 
            className="rounded-xl max-h-96 my-3 border border-borderDef object-cover" 
          />
        );
        remaining = remaining.slice(imgMatch[0].length);
        continue;
      }

      // Link: [text](url)
      const linkMatch = remaining.match(/^\[([^\]]+)\]\((https?:\/\/[^\s\)]+|\/[^\s\)]+)\)/);
      if (linkMatch) {
        tokens.push(
          <a 
            key={keyIdx++} 
            href={linkMatch[2]} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-accent font-semibold hover:underline inline-flex items-center gap-0.5"
          >
            {linkMatch[1]}
            <ExternalLink className="w-3 h-3 inline" />
          </a>
        );
        remaining = remaining.slice(linkMatch[0].length);
        continue;
      }

      // Bold: **text**
      const boldMatch = remaining.match(/^\*\*([^\*]+)\*\*/);
      if (boldMatch) {
        tokens.push(<strong key={keyIdx++} className="font-bold text-textPrimary">{boldMatch[1]}</strong>);
        remaining = remaining.slice(boldMatch[0].length);
        continue;
      }

      // Italic: *text*
      const italicMatch = remaining.match(/^\*([^\*]+)\*/);
      if (italicMatch) {
        tokens.push(<em key={keyIdx++} className="italic">{italicMatch[1]}</em>);
        remaining = remaining.slice(italicMatch[0].length);
        continue;
      }

      // Inline code: `code`
      const codeMatch = remaining.match(/^`([^`]+)`/);
      if (codeMatch) {
        tokens.push(
          <code key={keyIdx++} className="px-1.5 py-0.5 bg-surface-2 border border-borderDef text-accent font-mono text-xs rounded-md">
            {codeMatch[1]}
          </code>
        );
        remaining = remaining.slice(codeMatch[0].length);
        continue;
      }

      // Plain character
      const nextSpecial = remaining.search(/(!\[|\[|\*\*|\*|`)/);
      if (nextSpecial === -1) {
        tokens.push(remaining);
        break;
      } else if (nextSpecial === 0) {
        tokens.push(remaining[0]);
        remaining = remaining.slice(1);
      } else {
        tokens.push(remaining.slice(0, nextSpecial));
        remaining = remaining.slice(nextSpecial);
      }
    }

    return tokens;
  };

  const renderMarkdownPreview = (rawContent: string) => {
    if (!rawContent.trim()) {
      return (
        <div className="py-16 text-center text-textTertiary text-sm italic border-2 border-dashed border-borderDef/60 rounded-xl bg-surface-1/20">
          Здесь будет отображаться предпросмотр вашей публикации с поддержкой Markdown...
        </div>
      );
    }

    const blocks = rawContent.split(/\n\s*\n/);

    return (
      <div className="space-y-4 text-textSecondary text-[15px] leading-relaxed p-6 bg-surface-1/30 rounded-2xl border border-borderDef/60 min-h-[300px]">
        {blocks.map((block, idx) => {
          const trimmed = block.trim();
          if (trimmed.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-lg font-bold text-textPrimary pt-2 pb-1 border-b border-borderDef/40">
                {renderInlineSpans(trimmed.slice(4))}
              </h3>
            );
          }
          if (trimmed.startsWith('## ')) {
            return (
              <h2 key={idx} className="text-xl font-black text-textPrimary pt-3 pb-1 border-b border-borderDef/60">
                {renderInlineSpans(trimmed.slice(3))}
              </h2>
            );
          }
          if (trimmed.startsWith('# ')) {
            return (
              <h1 key={idx} className="text-2xl font-black text-textPrimary pt-4 pb-2 border-b border-borderDef">
                {renderInlineSpans(trimmed.slice(2))}
              </h1>
            );
          }
          if (trimmed.startsWith('> ')) {
            return (
              <blockquote key={idx} className="border-l-4 border-accent/60 pl-4 py-2 italic bg-surface-2/40 rounded-r-xl text-textSecondary">
                {renderInlineSpans(trimmed.slice(2))}
              </blockquote>
            );
          }
          if (trimmed.startsWith('```')) {
            const lines = trimmed.split('\n');
            const codeLines = lines.slice(1, lines[lines.length - 1].startsWith('```') ? -1 : undefined).join('\n');
            return (
              <pre key={idx} className="bg-surface-2/80 border border-borderDef rounded-xl p-4 font-mono text-xs text-accent overflow-x-auto my-2">
                <code>{codeLines}</code>
              </pre>
            );
          }
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const items = trimmed.split('\n').map(l => l.replace(/^[-*]\s+/, ''));
            return (
              <ul key={idx} className="list-disc list-inside space-y-1.5 pl-2">
                {items.map((item, i) => (
                  <li key={i}>{renderInlineSpans(item)}</li>
                ))}
              </ul>
            );
          }
          if (/^\d+\.\s+/.test(trimmed)) {
            const items = trimmed.split('\n').map(l => l.replace(/^\d+\.\s+/, ''));
            return (
              <ol key={idx} className="list-decimal list-inside space-y-1.5 pl-2">
                {items.map((item, i) => (
                  <li key={i}>{renderInlineSpans(item)}</li>
                ))}
              </ol>
            );
          }

          const lines = block.split('\n');
          return (
            <p key={idx} className="leading-relaxed">
              {lines.map((line, i) => (
                <React.Fragment key={i}>
                  {renderInlineSpans(line)}
                  {i < lines.length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col font-sans">
      <DevMatrixPanel fields={devFields} />
      
      {/* NAVBAR WITH BREADCRUMBS */}
      <div className="sticky top-0 z-40 bg-surface-0/95 backdrop-blur-xl border-b border-borderDef/60 shadow-sm">
        <div className="max-w-[1240px] mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm font-bold text-textTertiary">
            <button 
              onClick={() => onNavigate?.('/community')}
              className="hover:text-textPrimary transition-colors flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" /> Сообщество
            </button>
            <span className="text-textTertiary/40">/</span>
            <span className="text-textPrimary">
              {isEditing ? 'Редактирование темы' : 'Новая тема'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isEditing && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-bold uppercase tracking-wider border border-accent/20">
                <Edit3 className="w-3.5 h-3.5" /> Редактирование
              </span>
            )}
            <Button 
              variant="outline" 
              onClick={() => onNavigate?.(isEditing && editThreadId ? `/community/thread/${editThreadId}` : '/community')}
              className="h-10 px-4 text-xs font-bold rounded-xl border-borderDef text-textSecondary hover:text-textPrimary"
            >
              Отмена
            </Button>
            <Button 
              variant="primary" 
              onClick={handlePublish} 
              className="h-10 px-5 font-bold flex items-center gap-2 rounded-xl text-body-sm shadow-accent/20 shadow-lg"
            >
              {isEditing ? (
                <>Сохранить изменения <Check className="w-4 h-4 ml-0.5" /></>
              ) : (
                <>Опубликовать тему <Send className="w-4 h-4 ml-0.5" /></>
              )}
            </Button>
          </div>
        </div>

        {/* Validation Error Banner */}
        {errorMessage && (
          <div className="bg-danger/10 border-t border-danger/20 px-6 py-2.5 text-xs text-danger font-medium flex items-center justify-center gap-2 animate-fadeIn">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* WORKSPACE */}
      <div className="flex-1 max-w-[1240px] mx-auto w-full flex flex-col lg:flex-row items-stretch">
        
        {/* MAIN CANVAS */}
        <div className="flex-1 min-w-0 p-6 md:p-10 pb-32">
          
          <input
            type="text"
            placeholder="Заголовок темы..."
            value={title}
            maxLength={150}
            onChange={e => setTitle(e.target.value)}
            className="w-full bg-transparent text-3xl md:text-[38px] leading-tight font-black text-textPrimary placeholder:text-textTertiary/40 outline-none mb-3 tracking-tight"
          />
          <div className="flex items-center justify-between text-xs text-textTertiary font-medium mb-6">
            <span>Краткий и понятный заголовок сути темы (от 5 до 150 символов)</span>
            <span className={title.length > 140 ? 'text-warning font-bold' : ''}>{title.length}/150</span>
          </div>

          {/* DYNAMIC FORMS WITH CLEAR BOUNDARIES */}
          {type === 'looking_for_team' && (
            <div className="mb-8 bg-surface-1/40 border border-borderDef/60 rounded-2xl p-6 md:p-8 relative overflow-hidden group shadow-sm">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-borderDef/60">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-textPrimary tracking-tight">Анкета поиска команды</h3>
                  <p className="text-xs text-textTertiary mt-0.5">Укажите требуемые роли, формат сотрудничества и требования</p>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* Roles */}
                <div>
                  <label className="block text-caption font-bold text-textTertiary uppercase tracking-widest mb-3">
                    Искомые роли * (можно выбрать несколько)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ROLES.map(role => {
                      const active = selectedRoles.includes(role);
                      return (
                        <button 
                          key={role} 
                          type="button"
                          onClick={() => toggleArrayItem(selectedRoles, setSelectedRoles, role)}
                          className={`px-3.5 py-1.5 rounded-xl text-[13px] font-bold transition-all border ${
                            active 
                              ? 'bg-accent border-accent text-surface-0 shadow-sm shadow-accent/20' 
                              : 'bg-surface-1 border-borderDef text-textSecondary hover:text-textPrimary hover:bg-surface-2'
                          }`}
                        >
                          {role}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Participation Format & Experience */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-caption font-bold text-textTertiary uppercase tracking-widest mb-2">
                      Формат участия *
                    </label>
                    <div className="relative">
                      <select 
                        value={format}
                        onChange={(e) => setFormat(e.target.value)}
                        className="w-full appearance-none bg-surface-1 hover:bg-surface-2 border border-borderDef focus:border-accent rounded-xl h-11 px-4 text-sm font-bold text-textPrimary outline-none cursor-pointer transition-colors shadow-sm"
                      >
                        {FORMATS.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
                      </select>
                      <ChevronLeft className="w-4 h-4 -rotate-90 text-textTertiary absolute right-4 top-3.5 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-caption font-bold text-textTertiary uppercase tracking-widest mb-2">
                      Опыт / Уровень кандидата
                    </label>
                    <div className="relative">
                      <select 
                        value={experience || ''}
                        onChange={(e) => setExperience(e.target.value ? (e.target.value as any) : undefined)}
                        className="w-full appearance-none bg-surface-1 hover:bg-surface-2 border border-borderDef focus:border-accent rounded-xl h-11 px-4 text-sm font-bold text-textPrimary outline-none cursor-pointer transition-colors shadow-sm"
                      >
                        <option value="">Не имеет значения / Любой</option>
                        {EXPERIENCE_LEVELS.map(exp => (
                          <option key={exp.id} value={exp.id}>{exp.label}</option>
                        ))}
                      </select>
                      <ChevronLeft className="w-4 h-4 -rotate-90 text-textTertiary absolute right-4 top-3.5 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Engine & Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-caption font-bold text-textTertiary uppercase tracking-widest mb-2">
                      Движок проекта (Опционально)
                    </label>
                    <div className="relative">
                      <select 
                        value={engine}
                        onChange={(e) => setEngine(e.target.value)}
                        className="w-full appearance-none bg-surface-1 hover:bg-surface-2 border border-borderDef focus:border-accent rounded-xl h-11 px-4 text-sm font-bold text-textPrimary outline-none cursor-pointer transition-colors shadow-sm"
                      >
                        <option value="">Не указан</option>
                        {ENGINES.map(e => <option key={e} value={e}>{e}</option>)}
                      </select>
                      <ChevronLeft className="w-4 h-4 -rotate-90 text-textTertiary absolute right-4 top-3.5 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-caption font-bold text-textTertiary uppercase tracking-widest mb-2">
                      Требуемые навыки (Стек)
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        value={skillInput}
                        onChange={e => setSkillInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && skillInput.trim()) {
                            e.preventDefault();
                            if (!skills.includes(skillInput.trim())) setSkills([...skills, skillInput.trim()]);
                            setSkillInput('');
                          }
                        }}
                        placeholder="Добавить навык (Enter)"
                        className="flex-1 h-11 bg-surface-1 border border-borderDef focus:border-accent rounded-xl px-4 text-xs font-medium text-textPrimary outline-none transition-colors"
                      />
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => {
                          if (skillInput.trim() && !skills.includes(skillInput.trim())) {
                            setSkills([...skills, skillInput.trim()]);
                            setSkillInput('');
                          }
                        }}
                        className="h-11 px-3 text-xs"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Skills tags list & suggestions */}
                <div>
                  {skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                      {skills.map((sk, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 bg-surface-2 border border-borderDef rounded-lg text-xs font-semibold text-textPrimary">
                          {sk}
                          <button type="button" onClick={() => setSkills(skills.filter((_, i) => i !== idx))} className="text-textTertiary hover:text-danger">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-textTertiary">
                    <span className="font-medium">Подсказки:</span>
                    {SUGGESTED_SKILLS.map(sk => (
                      <button
                        key={sk}
                        type="button"
                        onClick={() => {
                          if (!skills.includes(sk)) setSkills([...skills, sk]);
                        }}
                        className="px-2 py-0.5 rounded bg-surface-2/60 hover:bg-surface-3 hover:text-textPrimary text-textSecondary text-[11px] transition-colors"
                      >
                        +{sk}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pitch summary */}
                <div>
                  <label className="block text-caption font-bold text-textTertiary uppercase tracking-widest mb-2">
                    Краткое резюме поиска * (1-2 предложения)
                  </label>
                  <input 
                    type="text"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Пример: Ищем пиксель-арт художника для завершения демки платформера..."
                    className="w-full h-11 bg-surface-1 hover:bg-surface-2 border border-borderDef focus:border-accent rounded-xl px-4 text-sm text-textPrimary outline-none transition-colors shadow-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {type === 'need_feedback' && (
            <div className="mb-8 bg-surface-1/40 border border-borderDef/60 rounded-2xl p-6 md:p-8 relative overflow-hidden group shadow-sm">
              <div className="absolute top-0 right-0 w-64 h-64 bg-info/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-borderDef/60">
                <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5 text-info" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-textPrimary tracking-tight">Запрос целевого фидбека</h3>
                  <p className="text-xs text-textTertiary mt-0.5">Укажите направления критики, платформы и конкретные вопросы для игроков</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-caption font-bold text-textTertiary uppercase tracking-widest mb-3">
                    Направления фидбека * (минимум одно)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {FEEDBACK_CATEGORIES.map(cat => {
                      const active = selectedFbCats.includes(cat);
                      return (
                        <button 
                          key={cat} 
                          type="button"
                          onClick={() => toggleArrayItem(selectedFbCats, setSelectedFbCats, cat)}
                          className={`px-3 py-2 rounded-xl text-left text-xs font-bold transition-all border flex items-center justify-between ${
                            active 
                              ? 'bg-info/15 border-info/40 text-info shadow-sm' 
                              : 'bg-surface-1 border-borderDef text-textSecondary hover:text-textPrimary hover:bg-surface-2'
                          }`}
                        >
                          <span className="truncate">{cat}</span>
                          {active && <Check className="w-3.5 h-3.5 shrink-0 ml-1.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-caption font-bold text-textTertiary uppercase tracking-widest mb-2">
                      Платформы проверки
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {PLATFORMS.map(p => {
                        const active = selectedPlatforms.includes(p);
                        return (
                          <button 
                            key={p} 
                            type="button"
                            onClick={() => toggleArrayItem(selectedPlatforms, setSelectedPlatforms, p)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                              active 
                                ? 'bg-surface-2 border-accent text-accent shadow-sm' 
                                : 'bg-surface-1 border-borderDef text-textSecondary hover:text-textPrimary hover:bg-surface-2'
                            }`}
                          >
                            {p}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-caption font-bold text-textTertiary uppercase tracking-widest mb-2">
                      Ориентировочное время теста
                    </label>
                    <div className="relative">
                      <select 
                        value={estimatedTime}
                        onChange={(e) => setEstimatedTime(e.target.value)}
                        className="w-full appearance-none bg-surface-1 hover:bg-surface-2 border border-borderDef focus:border-info rounded-xl h-11 px-4 text-xs font-bold text-textPrimary outline-none cursor-pointer transition-colors shadow-sm"
                      >
                        {ESTIMATED_TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <ChevronLeft className="w-4 h-4 -rotate-90 text-textTertiary absolute right-4 top-3.5 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-caption font-bold text-textTertiary uppercase tracking-widest">
                      Целевые вопросы к игрокам (до 5 вопросов)
                    </label>
                    {questions.length < 5 && (
                      <button 
                        type="button"
                        onClick={() => setQuestions([...questions, ''])}
                        className="flex items-center gap-1 text-xs font-bold text-info hover:text-info/80 transition-colors bg-info/10 px-2.5 py-1 rounded-lg"
                      >
                        <Plus className="w-3.5 h-3.5" /> Добавить вопрос
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-2.5">
                    {questions.map((q, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-7 h-10 flex items-center justify-center text-xs font-bold text-textTertiary shrink-0">
                          {idx + 1}.
                        </div>
                        <input
                          type="text"
                          value={q}
                          onChange={e => {
                            const newQs = [...questions];
                            newQs[idx] = e.target.value;
                            setQuestions(newQs);
                          }}
                          placeholder="Пример: Понятно ли обучение на первом уровне? Какое оружие показалось перегруженным?"
                          className="flex-1 h-10 bg-surface-1 hover:bg-surface-2 border border-borderDef focus:border-info rounded-xl px-4 text-xs text-textPrimary outline-none transition-colors shadow-sm placeholder:text-textTertiary/50 font-medium"
                        />
                        <button 
                          type="button"
                          onClick={() => setQuestions(questions.filter((_, i) => i !== idx))}
                          className="w-10 h-10 flex items-center justify-center rounded-xl border border-borderDef bg-surface-1 hover:bg-danger/10 hover:border-danger/30 hover:text-danger text-textTertiary transition-colors shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {type === 'show_progress' && (
            <div className="mb-8 bg-surface-1/40 border border-borderDef/60 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-borderDef/60">
                <div className="w-10 h-10 rounded-xl bg-celebratory/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-celebratory" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-textPrimary tracking-tight">Галерея прогресса</h3>
                  <p className="text-xs text-textTertiary mt-0.5">Прикрепите скриншоты, анимации или видео процесса разработки</p>
                </div>
              </div>

              {/* Upload Dropzone / Click */}
              <div className="space-y-5">
                <input
                  type="file"
                  id="community-media-file-input"
                  accept="image/png,image/jpeg,image/gif,video/mp4,video/webm"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (!files || files.length === 0) return;
                    Array.from(files).forEach(file => {
                      const reader = new FileReader();
                      reader.onload = () => {
                        if (typeof reader.result === 'string') {
                          setMediaUrls(prev => [...prev, reader.result as string]);
                        }
                      };
                      reader.readAsDataURL(file);
                    });
                  }}
                />

                <div 
                  onClick={() => document.getElementById('community-media-file-input')?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const files = e.dataTransfer.files;
                    if (!files || files.length === 0) return;
                    Array.from(files).forEach(file => {
                      const reader = new FileReader();
                      reader.onload = () => {
                        if (typeof reader.result === 'string') {
                          setMediaUrls(prev => [...prev, reader.result as string]);
                        }
                      };
                      reader.readAsDataURL(file);
                    });
                  }}
                  className="w-full py-7 border-2 border-dashed border-borderDef hover:border-celebratory/50 rounded-2xl flex flex-col items-center justify-center bg-surface-1 hover:bg-surface-2 cursor-pointer transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-surface-0 border border-borderDef flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-sm">
                    <Upload className="w-4 h-4 text-textTertiary group-hover:text-celebratory transition-colors" />
                  </div>
                  <div className="text-xs font-bold text-textPrimary">Нажмите для выбора файлов или перетащите сюда</div>
                  <div className="text-[11px] font-medium text-textTertiary mt-1 uppercase tracking-wider">PNG, JPG, GIF, MP4, WebM</div>
                </div>

                {/* URL Input Option */}
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <ImageIcon className="w-4 h-4 text-textTertiary absolute left-3.5 top-3" />
                    <input
                      type="url"
                      value={mediaInputUrl}
                      onChange={(e) => setMediaInputUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (mediaInputUrl.trim()) {
                            setMediaUrls([...mediaUrls, mediaInputUrl.trim()]);
                            setMediaInputUrl('');
                          }
                        }
                      }}
                      placeholder="Или вставьте прямую ссылку на медиа (https://...)"
                      className="w-full h-10 bg-surface-1 border border-borderDef focus:border-accent rounded-xl pl-10 pr-4 text-xs text-textPrimary outline-none transition-colors"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (mediaInputUrl.trim()) {
                        setMediaUrls([...mediaUrls, mediaInputUrl.trim()]);
                        setMediaInputUrl('');
                      }
                    }}
                    className="h-10 px-4 text-xs font-bold shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Добавить
                  </Button>
                </div>

                {/* Presets */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-textTertiary font-semibold">Примеры для демо:</span>
                  {[
                    { label: '+ Скриншот локации', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop' },
                    { label: '+ Моделирование UI', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop' },
                    { label: '+ Арт персонажа', url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop' }
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setMediaUrls(prev => [...prev, preset.url])}
                      className="text-[11px] bg-surface-2 hover:bg-surface-3 text-textSecondary hover:text-textPrimary border border-borderDef/80 px-2 py-0.5 rounded-lg transition-colors font-medium"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* Uploaded Media Previews */}
                {mediaUrls.length > 0 && (
                  <div className="pt-4 border-t border-borderDef/50 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-textPrimary uppercase tracking-wider">
                        Прикрепленные медиа ({mediaUrls.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => setMediaUrls([])}
                        className="text-xs font-semibold text-danger hover:underline"
                      >
                        Очистить все
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {mediaUrls.map((url, index) => (
                        <div key={index} className="relative group rounded-xl overflow-hidden aspect-video border border-borderDef bg-surface-2 shadow-sm">
                          <img src={url} alt={`Media ${index + 1}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => setMediaUrls(mediaUrls.filter((_, i) => i !== index))}
                              className="p-1.5 bg-danger text-white rounded-lg hover:bg-danger/80 transition-colors shadow-md"
                              title="Удалить"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="absolute bottom-1.5 left-1.5 bg-black/70 text-[10px] font-bold text-white px-1.5 py-0.5 rounded">
                            #{index + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {type === 'share_reference' && (
            <div className="mb-8 bg-surface-1/40 border border-borderDef/60 rounded-2xl p-6 md:p-8 relative overflow-hidden group shadow-sm">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-borderDef/60">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Bookmark className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-textPrimary tracking-tight">Вложенный источник / Референс</h3>
                  <p className="text-xs text-textTertiary mt-0.5">Прикрепите DevLog или публикацию для обсуждения и анализа</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSourceType('devlog')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      sourceType === 'devlog' 
                        ? 'bg-accent border-accent text-surface-0 shadow-sm shadow-accent/20' 
                        : 'bg-surface-1 border-borderDef text-textSecondary hover:text-textPrimary'
                    }`}
                  >
                    Дневник разработки (DevLog)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSourceType('jam_thread')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      sourceType === 'jam_thread' 
                        ? 'bg-accent border-accent text-surface-0 shadow-sm shadow-accent/20' 
                        : 'bg-surface-1 border-borderDef text-textSecondary hover:text-textPrimary'
                    }`}
                  >
                    Пост / Джем-проект
                  </button>
                </div>

                {sourceType === 'devlog' && (
                  <div className="p-3.5 bg-surface-2/40 border border-borderDef/60 rounded-xl">
                    <label className="block text-[11px] font-bold text-textTertiary uppercase tracking-widest mb-1.5">
                      Быстрый выбор из каталога DevLogs
                    </label>
                    <select
                      value={selectedDevLogId}
                      onChange={(e) => {
                        const dlId = e.target.value;
                        setSelectedDevLogId(dlId);
                        const foundDl = MOCK_DEVLOGS.find(d => d.id === dlId);
                        if (foundDl) {
                          setSourceTitle(foundDl.title);
                          setSourcePreview(foundDl.bodyMarkdown.slice(0, 160) + '...');
                          setSourceUrl(`/games/${foundDl.gameSlug || 'brokenlore'}/devlog/${foundDl.slug || foundDl.id}`);
                          setSourceAuthorNick(foundDl.authorNick);
                          if (!title.trim()) {
                            setTitle(`Обсуждение: ${foundDl.title}`);
                          }
                        }
                      }}
                      className="w-full bg-surface-1 border border-borderDef focus:border-accent rounded-xl h-10 px-3 text-xs font-bold text-textPrimary outline-none cursor-pointer"
                    >
                      <option value="">-- Выберите девлог для автозаполнения --</option>
                      {MOCK_DEVLOGS.map(dl => (
                        <option key={dl.id} value={dl.id}>{dl.title} (@{dl.authorNick})</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-textTertiary uppercase tracking-widest mb-1.5">
                      Заголовок источника *
                    </label>
                    <input
                      type="text"
                      value={sourceTitle}
                      onChange={e => setSourceTitle(e.target.value)}
                      placeholder="Название публикации или девлога..."
                      className="w-full h-10 bg-surface-1 border border-borderDef focus:border-accent rounded-xl px-3.5 text-xs text-textPrimary outline-none font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-textTertiary uppercase tracking-widest mb-1.5">
                      Ссылка (URL) *
                    </label>
                    <input
                      type="text"
                      value={sourceUrl}
                      onChange={e => setSourceUrl(e.target.value)}
                      placeholder="/games/... или https://..."
                      className="w-full h-10 bg-surface-1 border border-borderDef focus:border-accent rounded-xl px-3.5 text-xs text-textPrimary outline-none font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-textTertiary uppercase tracking-widest mb-1.5">
                      Ник автора оригинала
                    </label>
                    <input
                      type="text"
                      value={sourceAuthorNick}
                      onChange={e => setSourceAuthorNick(e.target.value)}
                      placeholder="например, alex_gamedev"
                      className="w-full h-10 bg-surface-1 border border-borderDef focus:border-accent rounded-xl px-3.5 text-xs text-textPrimary outline-none font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-textTertiary uppercase tracking-widest mb-1.5">
                      Краткая выдержка (превью)
                    </label>
                    <input
                      type="text"
                      value={sourcePreview}
                      onChange={e => setSourcePreview(e.target.value)}
                      placeholder="Короткая цитата или тезис из материала..."
                      className="w-full h-10 bg-surface-1 border border-borderDef focus:border-accent rounded-xl px-3.5 text-xs text-textPrimary outline-none font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* EDITOR WITH TOOLBAR & PREVIEW TOGGLE */}
          <div className="bg-surface-1/40 border border-borderDef/60 focus-within:border-accent/60 rounded-2xl overflow-hidden transition-all shadow-sm flex flex-col">
            
            {/* Toolbar Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 border-b border-borderDef/60 bg-surface-2/40">
              
              {/* Left format controls (when in editor mode) */}
              <div className="flex items-center gap-1">
                <button 
                  type="button"
                  title="Жирный шрифт (**текст**)"
                  onClick={() => insertFormat('**', '**', 'жирный текст')}
                  className="p-2 text-textTertiary hover:text-textPrimary hover:bg-surface-3 rounded-lg transition-colors font-bold text-sm leading-none"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button 
                  type="button"
                  title="Курсив (*текст*)"
                  onClick={() => insertFormat('*', '*', 'курсив')}
                  className="p-2 text-textTertiary hover:text-textPrimary hover:bg-surface-3 rounded-lg transition-colors italic text-sm leading-none"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <div className="w-px h-5 bg-borderDef/60 mx-1" />
                <button 
                  type="button"
                  title="Заголовок H2 (## Заголовок)"
                  onClick={() => insertFormat('\n## ', '\n', 'Заголовок темы')}
                  className="px-2 py-1 text-textTertiary hover:text-textPrimary hover:bg-surface-3 rounded-lg transition-colors font-black text-xs"
                >
                  H2
                </button>
                <button 
                  type="button"
                  title="Подзаголовок H3 (### Подзаголовок)"
                  onClick={() => insertFormat('\n### ', '\n', 'Подзаголовок')}
                  className="px-2 py-1 text-textTertiary hover:text-textPrimary hover:bg-surface-3 rounded-lg transition-colors font-bold text-xs"
                >
                  H3
                </button>
                <div className="w-px h-5 bg-borderDef/60 mx-1" />
                <button 
                  type="button"
                  title="Цитата (> текст)"
                  onClick={() => insertFormat('\n> ', '\n', 'Цитата')}
                  className="p-2 text-textTertiary hover:text-textPrimary hover:bg-surface-3 rounded-lg transition-colors"
                >
                  <Quote className="w-4 h-4" />
                </button>
                <button 
                  type="button"
                  title="Код (`код`)"
                  onClick={() => insertFormat('`', '`', 'код')}
                  className="p-2 text-textTertiary hover:text-textPrimary hover:bg-surface-3 rounded-lg transition-colors"
                >
                  <Code className="w-4 h-4" />
                </button>
                <button 
                  type="button"
                  title="Ссылка ([текст](url))"
                  onClick={() => insertFormat('[', '](https://...)', 'Текст ссылки')}
                  className="p-2 text-textTertiary hover:text-textPrimary hover:bg-surface-3 rounded-lg transition-colors"
                >
                  <Link2 className="w-4 h-4" />
                </button>
                <button 
                  type="button"
                  title="Изображение (![описание](url))"
                  onClick={() => insertFormat('![', '](https://images.unsplash.com/...)', 'Описание картинки')}
                  className="p-2 text-textTertiary hover:text-textPrimary hover:bg-surface-3 rounded-lg transition-colors"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Right Mode Switcher: Редактор | Предпросмотр */}
              <div className="flex items-center bg-surface-1 border border-borderDef rounded-xl p-0.5">
                <button
                  type="button"
                  onClick={() => setEditorMode('edit')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    editorMode === 'edit'
                      ? 'bg-surface-3 text-textPrimary shadow-sm'
                      : 'text-textTertiary hover:text-textSecondary'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" /> Редактор
                </button>
                <button
                  type="button"
                  onClick={() => setEditorMode('preview')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    editorMode === 'preview'
                      ? 'bg-surface-3 text-accent shadow-sm'
                      : 'text-textTertiary hover:text-textSecondary'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" /> Предпросмотр
                </button>
              </div>

            </div>
            
            {/* Editor Textarea or Markdown Preview */}
            {editorMode === 'edit' ? (
              <textarea
                ref={textareaRef}
                placeholder="Подробно опишите вашу тему. Поддерживается Markdown форматирование (**жирный**, *курсив*, ## заголовки, > цитаты, списки, `код`)..."
                value={body}
                onChange={e => setBody(e.target.value)}
                className="w-full min-h-[320px] bg-transparent text-[15px] md:text-[16px] text-textSecondary placeholder:text-textTertiary/50 outline-none resize-y p-6 leading-[1.7]"
              />
            ) : (
              <div className="p-6">
                {renderMarkdownPreview(body)}
              </div>
            )}
          </div>

        </div>

        {/* SIDEBAR PROPERTIES */}
        <div className="w-full lg:w-[340px] shrink-0 pt-6 md:pt-10 px-6 lg:px-0 lg:pr-6">
          <div className="sticky top-24 space-y-8 pb-16">
            
            <div className="flex items-center gap-2.5 pb-3 border-b border-borderDef">
              <Settings2 className="w-4 h-4 text-accent" />
              <span className="text-xs font-bold text-textPrimary tracking-wider uppercase">Параметры темы</span>
            </div>

            {/* Category Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-textSecondary uppercase tracking-wider">Раздел сообщества *</label>
                {isCategoryLocked && (
                  <span className="text-[10px] font-mono font-bold text-warning uppercase bg-warning/10 px-1.5 py-0.5 rounded border border-warning/20">
                    Заблокировано
                  </span>
                )}
              </div>
              <div className="relative">
                <select 
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  disabled={isCategoryLocked}
                  className={`w-full appearance-none bg-surface-1 border rounded-xl h-11 px-4 text-xs font-bold outline-none transition-colors shadow-sm ${
                    isCategoryLocked 
                      ? 'border-warning/40 text-textTertiary cursor-not-allowed bg-surface-2/60' 
                      : 'border-borderDef hover:border-borderStrong focus:border-accent text-textPrimary cursor-pointer'
                  }`}
                >
                  <option value="" disabled>Выберите активный раздел...</option>
                  {MOCK_COMMUNITY_CATEGORIES.filter(c => c.status === 'active').map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <ChevronLeft className="w-4 h-4 -rotate-90 text-textTertiary" />
                </div>
              </div>
              {isCategoryLocked && (
                <div className="p-2.5 bg-warning/10 border border-warning/20 rounded-xl text-[11px] text-warning leading-relaxed flex items-start gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>
                    Раздел зафиксирован: в теме уже есть ответы ({existingThread?.repliesCount || 0}). Для переноса темы обратитесь к модераторам.
                  </span>
                </div>
              )}
            </div>

            {/* Thread Type Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-textSecondary uppercase tracking-wider">Тип темы *</label>
              <div className="relative">
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value as CommunityThreadType)}
                  disabled={isEditing && authRole !== 'admin'}
                  className={`w-full appearance-none bg-surface-1 border rounded-xl h-11 px-4 text-xs font-bold outline-none transition-colors shadow-sm ${
                    isEditing && authRole !== 'admin'
                      ? 'border-borderDef/50 text-textTertiary cursor-not-allowed bg-surface-2/60'
                      : 'border-borderDef hover:border-borderStrong focus:border-accent text-textPrimary cursor-pointer'
                  }`}
                >
                  <option value="normal">Обычное обсуждение / Вопрос</option>
                  <option value="looking_for_team">Поиск команды (LookingForTeam)</option>
                  <option value="need_feedback">Запрос фидбека (NeedFeedback)</option>
                  <option value="show_progress">Показ прогресса (ShowProgress)</option>
                  <option value="share_reference">Вложенный источник / Референс</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <ChevronLeft className="w-4 h-4 -rotate-90 text-textTertiary" />
                </div>
              </div>
              <p className="text-[11px] text-textTertiary leading-relaxed">
                {isEditing 
                  ? 'Формат публикации закреплен за темой (изменение доступно модераторам).' 
                  : 'Определяет специальные анкеты и интерактивные блоки в теме.'}
              </p>
            </div>

            {/* External Links: Game & Jam */}
            <div className="pt-3 border-t border-borderDef space-y-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-3.5 h-3.5 text-textTertiary" />
                <span className="text-xs font-bold text-textPrimary uppercase tracking-wider">Связи с контекстами</span>
              </div>

              {/* Linked Game */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-textTertiary uppercase tracking-widest">
                  Связать с игрой (Game)
                </label>
                <div className="relative">
                  <select 
                    value={linkedGameId}
                    onChange={(e) => setLinkedGameId(e.target.value)}
                    className="w-full appearance-none bg-surface-1 hover:bg-surface-2 border border-borderDef focus:border-accent rounded-xl h-10 px-3.5 text-xs font-medium text-textPrimary outline-none cursor-pointer transition-colors shadow-sm"
                  >
                    <option value="">Не выбрано / Без привязки</option>
                    {AVAILABLE_GAMES.map(g => (
                      <option key={g.id} value={g.id}>{g.title}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none">
                    <ChevronLeft className="w-3.5 h-3.5 -rotate-90 text-textTertiary" />
                  </div>
                </div>
              </div>

              {/* Linked Jam */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-textTertiary uppercase tracking-widest">
                  Связать с Джемом (Jam)
                </label>
                <div className="relative">
                  <select 
                    value={linkedJamId}
                    onChange={(e) => setLinkedJamId(e.target.value)}
                    className="w-full appearance-none bg-surface-1 hover:bg-surface-2 border border-borderDef focus:border-accent rounded-xl h-10 px-3.5 text-xs font-medium text-textPrimary outline-none cursor-pointer transition-colors shadow-sm"
                  >
                    <option value="">Не выбрано / Без привязки</option>
                    {AVAILABLE_JAMS.map(j => (
                      <option key={j.id} value={j.id}>{j.title}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none">
                    <ChevronLeft className="w-3.5 h-3.5 -rotate-90 text-textTertiary" />
                  </div>
                </div>
              </div>
            </div>

            {/* Tags Input */}
            <div className="pt-3 border-t border-borderDef space-y-2.5">
              <div className="flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-textTertiary" />
                <label className="block text-xs font-bold text-textPrimary uppercase tracking-wider">Теги темы</label>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag, idx) => (
                    <span key={idx} className="flex items-center gap-1 px-2.5 py-1 bg-surface-2 border border-borderDef text-xs font-semibold text-textPrimary rounded-lg shadow-sm">
                      #{tag}
                      <button type="button" onClick={() => setTags(tags.filter((_, i) => i !== idx))} className="text-textTertiary hover:text-danger ml-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <input 
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
                    e.preventDefault();
                    const clean = tagInput.trim().replace(/^#/, '').toLowerCase();
                    if (clean && !tags.includes(clean)) setTags([...tags, clean]);
                    setTagInput('');
                  }
                }}
                placeholder="Добавить тег (Enter или запятая)"
                className="w-full h-10 bg-surface-1 border border-borderDef focus:border-accent rounded-xl px-3.5 text-xs text-textPrimary outline-none transition-colors placeholder:text-textTertiary shadow-sm font-medium"
              />
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
