import React, { useState, useEffect, useRef } from 'react';
import DevMatrixPanel from '../components/DevMatrixPanel';
import FontStyles from '../components/ui/FontStyles';
import { CustomSelect } from '../components/ui/Select';
import { DatePicker } from '../components/ui/DatePicker';
import { Checkbox } from '../components/ui/Checkbox';
import { Input } from '../components/ui/Input';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Toast from '../components/ui/Toast';
import { jamOrganizerService } from '../services/jamOrganizerService';
import { Check, X, AlertTriangle, ArrowLeft, ArrowRight, Save, Info, Eye, Trash2, Lock, Plus, Upload, Star, LogIn } from 'lucide-react';

// --- MOCK DATA ---
const MOCK_USER_STUDIOS = [
  { id: 'st_01', name: 'Void Labs Studio' },
  { id: 'st_02', name: 'CyberPunk Squad' }
];

const MOCK_PLATFORM_USERS = [
  { id: 'usr_1', nick: 'AlexGameDev', name: 'Алексей Иванов', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
  { id: 'usr_2', nick: 'ElenaAudio', name: 'Елена Соколова', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
  { id: 'usr_3', nick: 'Max3D', name: 'Максим Петров', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
  { id: 'usr_4', nick: 'SarahLead', name: 'Сара Коннор', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80' }
];

export default function JamCreationPage({
  jamId,
  authState,
  setAuthState
}: {
  jamId?: string;
  authState?: string;
  setAuthState?: (val: string) => void;
}) {
  // Stepper State (5 Steps as per Spec)
  const [step, setStep] = useState(1);

  // --- SYSTEM & DEV MATRIX STATES ---
  // Определяем режим: если jamId передан - режим редактирования, иначе - создание
  const [pageMode, setPageMode] = useState(jamId ? 'edit' : 'create'); // 'create' | 'edit'
  const [jamPhase, setJamPhase] = useState('draft'); // 'draft' | 'published_active'
  
  // Contextual permissions (BR-JORG-009)
  const [authStateMock, setAuthStateMock] = useState('authenticated'); // 'authenticated' | 'guest'
  const [userAssignments, setUserAssignments] = useState<string[]>(['jam-123']); // Mocks JamOrganizerAssignment

  // Modals & Notifications
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmTitle, setDeleteConfirmTitle] = useState('');
  const [toast, setToast] = useState({ show: false, text: '', type: 'info' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- FORM STATE ---
  // Step 1: Basic Info
  const [organizerType, setOrganizerType] = useState('personal'); // 'personal' | studio_id
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [contentMd, setContentMd] = useState('');
  const [editorTab, setEditorTab] = useState('markdown'); // 'markdown' | 'preview'
  const [bannerUrl, setBannerUrl] = useState('https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80');

  // Step 2: Schedule & Timeline
  const [startAt, setStartAt] = useState('2026-09-01T18:00');
  const [endAt, setEndAt] = useState('2026-09-03T18:00');
  const [resultsAt, setResultsAt] = useState('2026-09-07T18:00');
  const [isPrivate, setIsPrivate] = useState(false);

  // Step 3: Voting & Criteria
  const [voterScope, setVoterScope] = useState('public'); // 'public' | 'authors' | 'jury' | 'hybrid'
  const [jurySearch, setJurySearch] = useState('');
  const [juryMembers, setJuryMembers] = useState([
    { user: MOCK_PLATFORM_USERS[0], status: 'accepted' },
    { user: MOCK_PLATFORM_USERS[1], status: 'pending' }
  ]);
  const [criteria, setCriteria] = useState([
    { id: 'crit_1', name: 'Геймплей', desc: 'Оценка игровой механики и отзывчивости управления', weight: 5 },
    { id: 'crit_2', name: 'Соответствие теме', desc: 'Насколько идея игры передает заданную тему', weight: 4 },
    { id: 'crit_3', name: 'Визуал и Графика', desc: 'Арт-стиль, анимации и графическая цельность', weight: 3 },
    { id: 'crit_4', name: 'Звуковой дизайн', desc: 'Саундтрек, аудиоэффекты и атмосфера', weight: 3 }
  ]);

  // Step 4: Theme & Custom Submission Fields
  const [theme, setTheme] = useState('');
  const [hideThemeUntilStart, setHideThemeUntilStart] = useState(false);
  const [customFields, setCustomFields] = useState([
    { id: 'cf_1', label: 'Использовались ли сторонние ассеты?', type: 'checkbox', required: true },
    { id: 'cf_2', label: 'Укажите игровой движок', type: 'select', required: true, options: 'Unity, Unreal Engine, Godot, Custom' }
  ]);

  // Step 5: Prizes & Partners
  const [partners, setPartners] = useState([
    { id: 'part_1', name: 'Void Engine', status: 'verified' },
    { id: 'part_2', name: 'Indie Fund', status: 'under_review' }
  ]);
  const [prizes, setPrizes] = useState([
    { id: 'prize_1', type: 'money', amount: '50000', currency: 'RUB', provider: 'part_2', name: '1 место' },
    { id: 'prize_2', type: 'software', amount: '1', currency: '', provider: 'part_1', name: 'Лицензия Void Engine PRO' }
  ]);
  const [oneGameLimit, setOneGameLimit] = useState(true); // CQ-6.3
  const [hideEntriesUntilEnd, setHideEntriesUntilEnd] = useState(false);

  // Touched state for validation
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const triggerToast = (text, type = 'info') => {
    setToast({ show: true, text, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3500);
  };

  const handleTitleChange = (val) => {
    setTitle(val);
    const generated = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-а-яА-Я]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(generated || 'my-game-jam');
  };

  // Validation Rules according to Spec
  const checkStep1 = title.trim().length >= 3 && title.trim().length <= 100 && shortDesc.trim().length >= 10 && shortDesc.trim().length <= 250 && contentMd.trim().length >= 20;
  const checkStep2 = new Date(endAt) > new Date(startAt) && new Date(resultsAt) > new Date(endAt);
  const checkStep3 = criteria.length >= 1 && criteria.length <= 8 && criteria.every(c => c.name.trim().length > 0);
  const checkStep4 = true; // Theme & custom fields are optional
  const checkStep5 = true; // Prizes are optional

  const isAllValid = checkStep1 && checkStep2 && checkStep3 && checkStep4 && checkStep5;

  // Material changes allow editing, so we no longer lock the jam completely
  const isActiveJamLocked = false;

  // Jury autocomplete filtering
  const filteredUsers = MOCK_PLATFORM_USERS.filter(u =>
    !juryMembers.some(jm => jm.user.id === u.id) &&
    (u.nick.toLowerCase().includes(jurySearch.toLowerCase()) || u.name.toLowerCase().includes(jurySearch.toLowerCase()))
  );

  const handleAddJury = (user) => {
    setJuryMembers([...juryMembers, { user, status: 'pending' }]);
    setJurySearch('');
  };

  const handleRemoveJury = (id) => {
    setJuryMembers(juryMembers.filter(j => j.user.id !== id));
  };

  // Criteria handlers
  const handleAddCriteria = () => {
    if (criteria.length >= 8) {
      triggerToast('Максимум 8 критериев оценки', 'danger');
      return;
    }
    setCriteria([...criteria, { id: `crit_${Date.now()}`, name: `Критерий ${criteria.length + 1}`, desc: '', weight: 3 }]);
  };

  const handleRemoveCriteria = (id) => {
    if (criteria.length <= 1) {
      triggerToast('Должен остаться хотя бы 1 критерий', 'danger');
      return;
    }
    setCriteria(criteria.filter(c => c.id !== id));
  };

  // Custom submission fields handlers
  const handleAddCustomField = () => {
    setCustomFields([...customFields, { id: `cf_${Date.now()}`, label: 'Новый вопрос', type: 'text', required: false, options: '' }]);
  };

  const handleRemoveCustomField = (id) => {
    setCustomFields(customFields.filter(f => f.id !== id));
  };

  const handleSubmitRequest = () => {
    if (authStateMock === 'guest' || (pageMode === 'edit' && !userAssignments.includes(jamId || 'jam-123'))) {
      triggerToast('У вас нет прав на отправку заявки', 'danger');
      return;
    }

    if (!isAllValid) {
      triggerToast('Заполните все обязательные поля на всех шагах', 'danger');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      
      if (jamPhase === 'published_active') {
        // Material change requires re-moderation
        setJamPhase('under_review');
        jamOrganizerService.addRuleVersion(
          jamId || 'jam-123',
          contentMd || 'Обновленный свод правил соревнования',
          'Существенное изменение регламента и критериев (Material Change)',
          true
        );
        triggerToast('Запрос на изменение правил (Material Change) отправлен на ре-модерацию', 'success');
      } else {
        jamOrganizerService.createRequest({
          applicantUserId: 'current_user',
          applicantUserNick: 'CurrentUser',
          organizerSubjectType: organizerType === 'personal' ? 'user' : 'team',
          organizerSubjectId: organizerType === 'personal' ? 'usr_current' : organizerType,
          organizerSubjectName: organizerType === 'personal' ? 'Алексей Иванов' : 'Void Labs Studio',
          title: title || 'Indie Game Dev Jam 2026',
          concept: shortDesc || 'Концепция инди-джема',
          descriptionMd: contentMd || 'Описание условий джема',
          proposedDates: {
            startAt: startAt || new Date().toISOString(),
            endAt: endAt || new Date().toISOString(),
            resultsAt: resultsAt || new Date().toISOString()
          },
          formatPreset: partners.length > 0 ? 'partner' : 'ranked',
          rulesMd: contentMd || 'Базовые правила соревнования',
          organizerContact: 'contact@hubigr.dev',
          coverUrl: bannerUrl,
          isRanked: voterScope !== 'public',
          expectedParticipantsCount: 150
        });
        setJamPhase('submitted'); // Switch to submitted phase locally to simulate request
        triggerToast(pageMode === 'edit' ? 'Изменения в заявке сохранены и отправлены на ревью!' : 'Заявка на организацию джема успешно отправлена на модерацию!', 'success');
      }
    }, 1200);
  };

  const handleSaveDraft = () => {
    jamOrganizerService.createRequest({
      applicantUserId: 'current_user',
      applicantUserNick: 'CurrentUser',
      organizerSubjectType: organizerType === 'personal' ? 'user' : 'team',
      organizerSubjectId: organizerType === 'personal' ? 'usr_current' : organizerType,
      organizerSubjectName: organizerType === 'personal' ? 'Алексей Иванов' : 'Void Labs Studio',
      title: title || 'Новый черновик джема',
      concept: shortDesc || 'Концепция инди-джема',
      descriptionMd: contentMd || 'Описание условий джема',
      proposedDates: {
        startAt: startAt || new Date().toISOString(),
        endAt: endAt || new Date().toISOString(),
        resultsAt: resultsAt || new Date().toISOString()
      },
      formatPreset: partners.length > 0 ? 'partner' : 'ranked',
      rulesMd: contentMd || 'Базовые правила соревнования',
      organizerContact: 'contact@hubigr.dev',
      coverUrl: bannerUrl,
      isRanked: voterScope !== 'public',
      expectedParticipantsCount: 100
    });
    triggerToast('Черновик заявки сохранен в базе (status = draft)', 'success');
  };

  const handleDeleteJam = () => {
    if (deleteConfirmTitle.trim() !== (title || 'Indie Game Dev Jam 2026')) {
      triggerToast('Название джема введено неверно', 'danger');
      return;
    }
    setIsDeleteModalOpen(false);
    triggerToast('Заявка на джем успешно удалена', 'info');
  };

  return (
    <div className="min-h-screen bg-surface-0 text-textPrimary font-sans pb-44 md:pb-32 relative overflow-x-hidden select-none">
      <FontStyles />

      {/* ACCESS OVERLAY LOCK (BR-JORG-009) */}
      {(authStateMock === 'guest' || (pageMode === 'edit' && !userAssignments.includes(jamId || 'jam-123'))) && (
        <div className="fixed inset-0 z-modal bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface-2 border border-borderDef rounded-2xl max-w-md w-full p-6 sm:p-8 text-center flex flex-col items-center gap-4 animate-modal shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-textPrimary font-sans">
              Нет доступа к заявке
            </h2>
            <p className="text-xs text-textSecondary leading-relaxed">
              {authStateMock === 'guest' 
                ? 'Для создания заявки необходимо войти в аккаунт.' 
                : 'У вас нет прав (JamOrganizerAssignment) на редактирование этого джема.'}
            </p>
            {authStateMock === 'guest' ? (
              <button
                type="button"
                onClick={() => { setAuthStateMock('authenticated'); triggerToast('Вы авторизовались', 'success'); }}
                className="w-full h-11 bg-accent hover:bg-accent/90 text-white font-extrabold text-xs uppercase rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 touch-manipulation"
              >
                <LogIn className="w-4 h-4" />
                <span>Войти в аккаунт</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => { setUserAssignments(['jam-123']); triggerToast('Права назначены (Mock)', 'success'); }}
                className="w-full h-11 bg-accent hover:bg-accent/90 text-white font-extrabold text-xs uppercase rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 touch-manipulation"
              >
                <Lock className="w-4 h-4" />
                <span>Получить права организатора</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main className="max-w-[1200px] mx-auto px-4 md:px-8 pt-6 sm:pt-8 relative z-10">

        {/* BREADCRUMBS & PAGE HEADER */}
        <div className="mb-6">
          <nav className="flex items-center gap-2 text-xs text-textSecondary mb-2 sm:mb-3 font-medium">
            <a href="#/jams" className="hover:text-textPrimary transition-colors">Главная</a>
            <span>/</span>
            <a href="#/jams" className="hover:text-textPrimary transition-colors">Джемы</a>
            <span>/</span>
            <span className="text-textPrimary truncate max-w-[200px]">
              {pageMode === 'edit' ? `Редактирование: ${title || 'Indie Jam 2026'}` : 'Новая заявка'}
            </span>
          </nav>

          <div className="pb-4 sm:pb-6 border-b border-borderDef flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold uppercase font-mono tracking-wide text-textPrimary drop-shadow-sm">
                {pageMode === 'edit' ? 'Управление Джемом / Заявкой' : 'Заявка на организацию джема'}
              </h1>
              <p className="text-xs text-textSecondary mt-1">
                {pageMode === 'edit'
                  ? 'Изменение правил, расписания, критериев судейства и состава жюри.'
                  : 'Заполните параметры заявки. После модерации (Request Approved) джем будет создан.'}
              </p>
            </div>
          </div>
        </div>

        {/* MATERIAL CHANGE BANNER (BR-JORG-025, BR-JORG-056, BR-JORG-071) */}
        {jamPhase === 'published_active' && (
          <div className="mb-6 bg-warning/10 border border-warning/30 rounded-xl p-4 flex items-start gap-3 shadow-sm animate-fadeIn">
            <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1.5 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-bold text-warning uppercase tracking-wide text-xs">Джем активен</span>
                <span className="bg-warning/20 text-warning text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">Текущая версия правил: v1.0.2</span>
              </div>
              <span className="text-textSecondary leading-relaxed text-xs">
                Любое изменение правил, расписания, критериев судейства, партнеров или призов потребует <strong>повторной модерации (Material Change)</strong>. 
                Внесенные изменения будут отправлены на проверку, а участники получат системное уведомление.
              </span>
            </div>
          </div>
        )}


        {/* REQUEST PHASE BANNER */}
        {pageMode === 'edit' && jamPhase !== 'published_active' && (
          <div className={`mb-6 p-4 rounded-2xl border flex items-center gap-3 text-xs animate-fadeIn ${
            jamPhase === 'draft' ? 'bg-surface-2 border-borderDef text-textPrimary' :
            jamPhase === 'submitted' ? 'bg-[#D97706]/10 border-[#D97706]/30 text-[#D97706]' :
            jamPhase === 'under_review' ? 'bg-[#3B82F6]/10 border-[#3B82F6]/30 text-[#3B82F6]' :
            jamPhase === 'needs_changes' ? 'bg-danger/10 border-danger/30 text-danger' :
            jamPhase === 'approved' ? 'bg-success/10 border-success/30 text-success' : ''
          }`}>
            <Info className="w-5 h-5 shrink-0" />
            <div className="flex flex-col">
              <span className="font-bold">
                {jamPhase === 'draft' && 'Статус: Черновик заявки'}
                {jamPhase === 'submitted' && 'Статус: Заявка отправлена (ожидает проверки)'}
                {jamPhase === 'under_review' && 'Статус: На рассмотрении (Under Review)'}
                {jamPhase === 'needs_changes' && 'Статус: Требуются правки от организатора'}
                {jamPhase === 'approved' && 'Статус: Заявка одобрена, ожидайте генерации джема'}
              </span>
              <span className="mt-0.5 opacity-80">
                {jamPhase === 'needs_changes' ? 'Модератор оставил комментарии. Внесите изменения и отправьте повторно.' : 'Вы можете продолжать редактировать параметры. Изменения правил после одобрения могут потребовать повторного ревью.'}
              </span>
            </div>
          </div>
        )}

        {/* STEPPER NAVIGATION (4 STEPS SPECIFICATION) */}
        <nav className="mb-6 sm:mb-10" aria-label="Шаги оформления">
          <div className="flex flex-row bg-surface-1/40 p-1.5 rounded-[20px] border border-borderDef/50 shadow-inner overflow-x-auto touch-scroll no-scrollbar gap-1">
            {[
              { num: 1, name: "1. Основное и График", isDone: checkStep1 && checkStep2 },
              { num: 2, name: "2. Судейство", isDone: checkStep3 },
              { num: 3, name: "3. Тема и Поля", isDone: checkStep4 },
              { num: 4, name: "4. Призы", isDone: checkStep5 }
            ].map(s => {
              const isActive = step === s.num;
              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => setStep(s.num)}
                  aria-label={`Перейти на шаг ${s.num}`}
                  className={`flex-1 h-11 sm:h-12 px-3 sm:px-4 rounded-[14px] transition-all flex items-center justify-between text-xs sm:text-sm font-semibold cursor-pointer whitespace-nowrap min-w-[150px] sm:min-w-0 shrink-0 sm:shrink touch-manipulation ${isActive
                      ? 'bg-surface-3 text-textPrimary shadow-sm border border-borderDef font-bold'
                      : 'text-textSecondary hover:text-textPrimary border border-transparent'
                    }`}
                >
                  <span className="truncate">{s.name}</span>
                  {s.isDone ? (
                    <span className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center transition-colors ml-1 ${isActive ? 'bg-success/20 text-success' : 'text-success/60 group-hover:text-success'}`}>
                      <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5"  strokeWidth={2.5} />
                    </span>
                  ) : isActive ? (
                    <span className="w-2 h-2 rounded-full bg-accent shrink-0 ml-1 shadow-elevation-raised" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </nav>

        {step === 1 && (
          <div className="flex flex-col gap-10 animate-fadeIn pt-2">
            {/* Main Form Columns (No Card Soup) */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:gap-14 items-start pt-4 border-t border-borderDef/30">

              {/* Left Column: Basic Info */}
              <div className="flex flex-col justify-between gap-10 w-full">
                <div className="flex flex-col gap-8">

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-textPrimary px-1">
                      Организатор джема <span className="text-accent">*</span>
                    </label>
                    <CustomSelect
                      size="xl"
                      variant="form"
                      value={organizerType}
                      onChange={setOrganizerType}
                      options={[
                        { value: 'personal', label: 'Личный аккаунт (Алексей Иванов)' },
                        ...MOCK_USER_STUDIOS.map(st => ({ value: st.id, label: `Студия: ${st.name}` }))
                      ]}
                    />
                    <span className="text-xs text-textSecondary px-1 leading-relaxed mt-0.5">
                      От чьего имени публикуется джем.
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-baseline px-1">
                      <label htmlFor="jamTitle" className="text-sm font-semibold text-textPrimary">
                        Название джема <span className="text-accent">*</span>
                      </label>
                      <span className="text-xs font-mono text-textTertiary">{title.length} / 100</span>
                    </div>
                    <input
                      id="jamTitle"
                      type="text"
                      value={title}
                      onBlur={() => setTouched(prev => ({ ...prev, title: true }))}
                      onChange={e => handleTitleChange(e.target.value)}
                      placeholder="Например: Indie Game Dev Jam 2026"
                      className={`w-full bg-surface-1/40 border ${touched.title && title.length < 3 ? 'border-danger' : 'border-borderDef hover:border-borderStrong focus:border-accent focus:bg-surface-2'
                        } text-sm text-textPrimary px-4 h-12 rounded-control outline-none transition-all font-sans shadow-sm placeholder-textTertiary`}
                    />
                    <span className="text-xs text-textSecondary px-1 leading-relaxed mt-0.5">
                      Публичный URL: <span className="text-accent font-mono">hubigr.ru/jams/{slug || 'new-jam'}</span>
                    </span>
                    {touched.title && title.length < 3 && (
                      <span className="text-xs text-danger flex items-center gap-1.5 mt-0.5 px-1 font-medium">
                        <AlertTriangle className="w-3.5 h-3.5" /> Минимум 3 символа
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-baseline px-1">
                      <label htmlFor="shortDesc" className="text-sm font-semibold text-textPrimary">
                        Краткий анонс <span className="text-accent">*</span>
                      </label>
                      <span className="text-xs font-mono text-textTertiary">{shortDesc.length} / 250</span>
                    </div>
                    <textarea
                      id="shortDesc"
                      value={shortDesc}
                      onBlur={() => setTouched(prev => ({ ...prev, shortDesc: true }))}
                      onChange={e => setShortDesc(e.target.value.slice(0, 250))}
                      placeholder="Лаконичный анонс джема для карточки в общем каталоге..."
                      rows={3}
                      className={`w-full bg-surface-1/40 border ${touched.shortDesc && shortDesc.length < 10 ? 'border-danger' : 'border-borderDef hover:border-borderStrong focus:border-accent focus:bg-surface-2'
                        } text-sm text-textPrimary p-4 rounded-control outline-none font-sans resize-none transition-all shadow-sm placeholder-textTertiary`}
                    />
                    <span className="text-xs text-textSecondary px-1 leading-relaxed mt-0.5">
                      Краткое описание, которое увидят участники в каталоге.
                    </span>
                  </div>

                  {/* MERGED: SCHEDULE SCHEDULE BLOCK */}
                  <div className="pt-6 mt-2 border-t border-borderDef flex flex-col gap-6">
                    <h3 className="text-sm font-bold text-textPrimary flex items-center gap-2">
                      <Info className="w-4 h-4 text-accent" /> График проведения (UTC+3)
                    </h3>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="startAt" className="text-sm font-semibold text-textPrimary px-1">
                        Начало приема работ <span className="text-accent">*</span>
                      </label>
                      <DatePicker
                        id="startAt"
                        value={startAt}
                        onChange={setStartAt}
                        disabled={isActiveJamLocked}
                        placeholder="Например, 10 сентября 2026 в 12:00"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="endAt" className="text-sm font-semibold text-textPrimary px-1">
                        Дедлайн сдачи (Конец приема) <span className="text-accent">*</span>
                      </label>
                      <DatePicker
                        id="endAt"
                        value={endAt}
                        onChange={setEndAt}
                        disabled={isActiveJamLocked}
                        placeholder="Например, 20 сентября 2026 в 20:00"
                      />
                      {new Date(endAt) <= new Date(startAt) && (
                        <span className="text-xs text-danger flex items-center gap-1.5 mt-0.5 px-1 font-medium">
                          <AlertTriangle className="w-3.5 h-3.5" /> Должно быть позже даты начала
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="resultsAt" className="text-sm font-semibold text-textPrimary px-1">
                        Подведение итогов <span className="text-accent">*</span>
                      </label>
                      <DatePicker
                        id="resultsAt"
                        value={resultsAt}
                        onChange={setResultsAt}
                        disabled={isActiveJamLocked}
                        placeholder="Например, 25 сентября 2026 в 18:00"
                      />
                    </div>

                    <div className="pt-2 px-1">
                      <label className="flex items-start gap-3 p-3 bg-surface-1/40 hover:bg-surface-2 border border-borderDef rounded-card cursor-pointer transition-colors shadow-sm group">
                        <Checkbox
                          checked={isPrivate}
                          onChange={setIsPrivate}
                          className="mt-0.5"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-textPrimary">Приватный джем</span>
                          <span className="text-xs text-textSecondary mt-0.5 leading-relaxed">Не отображается в общем каталоге. Доступен только по прямой ссылке.</span>
                        </div>
                      </label>
                    </div>
                  </div>

                </div>
              </div>

              {/* Right Column: Banner & Markdown */}
              <div className="flex flex-col gap-8 w-full bg-surface-1/20 rounded-2xl p-6 lg:p-8 border border-borderDef">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-textPrimary px-1">Обложка / Баннер джема (16:9) <span className="text-accent">*</span></label>
                  <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border-2 border-dashed border-borderDef hover:border-accent/60 transition-all group cursor-pointer shadow-sm bg-surface-1/40">
                    <img src={bannerUrl} alt="Banner Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-fast">
                      <span className="text-xs font-bold text-textPrimary flex items-center gap-2 bg-surface-1/90 px-4 py-2 rounded-control border border-borderDef/60 shadow-sm">
                        <Upload className="w-4 h-4 text-accent" /> Загрузить новый баннер
                      </span>
                      <span className="text-caption text-textTertiary font-mono">PNG, JPG, WebP до 5МБ</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2 border-t border-borderDef/20 mt-2">
                  <div className="flex justify-between items-baseline px-1 pb-1">
                    <label htmlFor="contentMd" className="text-sm font-semibold text-textPrimary">
                      Подробные правила (Markdown) <span className="text-accent">*</span>
                    </label>
                    <div className="flex gap-1 text-[11px] font-mono font-medium bg-surface-1/40 p-1 rounded-md border border-borderDef/50 shadow-inner">
                      <button
                        type="button"
                        onClick={() => setEditorTab('markdown')}
                        className={`px-3 py-1 rounded cursor-pointer transition-all ${editorTab === 'markdown' ? 'bg-surface-3 text-textPrimary shadow-sm border border-borderDef/50' : 'text-textSecondary hover:text-textPrimary border border-transparent'}`}
                      >
                        Редактор
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditorTab('preview')}
                        className={`px-3 py-1 rounded cursor-pointer transition-all ${editorTab === 'preview' ? 'bg-surface-3 text-textPrimary shadow-sm border border-borderDef/50' : 'text-textSecondary hover:text-textPrimary border border-transparent'}`}
                      >
                        Превью
                      </button>
                    </div>
                  </div>

                  {editorTab === 'markdown' ? (
                    <textarea
                      id="contentMd"
                      value={contentMd}
                      onBlur={() => setTouched(prev => ({ ...prev, contentMd: true }))}
                      onChange={e => setContentMd(e.target.value.slice(0, 10000))}
                      placeholder="### Добро пожаловать на джем!&#10;Опишите задачи, разрешенные движки и требования к исходникам..."
                      rows={8}
                      className={`w-full bg-surface-1/40 border ${touched.contentMd && contentMd.length < 20 ? 'border-danger' : 'border-borderDef hover:border-borderStrong focus:border-accent focus:bg-surface-2'
                        } text-sm text-textPrimary p-4 rounded-control outline-none font-sans leading-relaxed resize-y transition-all shadow-sm placeholder-textTertiary`}
                    />
                  ) : (
                    <div className="w-full bg-surface-2/40 p-4 rounded-control border border-borderDef/50 text-sm text-textSecondary min-h-[192px] leading-relaxed whitespace-pre-wrap">
                      {contentMd || <span className="italic text-textDisabled">Текст правил отсутствует</span>}
                    </div>
                  )}
                  <span className="text-xs text-textSecondary px-1 leading-relaxed mt-0.5">
                    Поддерживается форматирование списков, заголовков и ссылок.
                  </span>
                </div>
              </div>

            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-10 animate-fadeIn pt-2">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:gap-14 items-start pt-4 border-t border-borderDef/30">

              {/* Left Column: Voter Scope & Jury Members */}
              <div className="flex flex-col gap-8 w-full">

                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1 px-1">
                    <label className="text-sm font-semibold text-textPrimary">Формат судейства <span className="text-accent">*</span></label>
                    <span className="text-xs text-textSecondary leading-relaxed">Кто будет иметь право выставлять оценки работам.</span>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {[
                      { id: 'public', label: 'Публичное голосование', desc: 'Все зарегистрированные пользователи платформы' },
                      { id: 'authors', label: 'Перекрестное участников', desc: 'Оценивать могут только авторы поданных игр' },
                      { id: 'jury', label: 'Закрытое судейство', desc: 'Только назначенный состав официального жюри' },
                      { id: 'hybrid', label: 'Гибридная система', desc: 'Публичные голоса + весовые оценки экспертов' }
                    ].map(vs => (
                      <label key={vs.id} className={`flex items-start gap-3 p-4 rounded-card border cursor-pointer transition-all shadow-sm ${voterScope === vs.id ? 'bg-surface-2 border-accent text-textPrimary' : 'bg-surface-1/40 border-borderDef hover:bg-surface-2 hover:border-borderStrong text-textSecondary'}`}>
                        <input
                          type="radio"
                          name="voterScope"
                          disabled={isActiveJamLocked}
                          checked={voterScope === vs.id}
                          onChange={() => setVoterScope(vs.id)}
                          className="accent-accent w-4 h-4 mt-0.5 cursor-pointer"
                        />
                        <div className="flex flex-col">
                          <span className={`text-sm font-semibold ${voterScope === vs.id ? 'text-textPrimary' : 'text-textSecondary'}`}>{vs.label}</span>
                          <span className="text-xs text-textSecondary mt-0.5 leading-relaxed">{vs.desc}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {(voterScope === 'jury' || voterScope === 'hybrid') && (
                  <div className="flex flex-col gap-4 pt-6 border-t border-borderDef animate-fadeIn">
                    <div className="flex flex-col gap-1 px-1">
                      <label className="text-sm font-semibold text-textPrimary">Состав экспертного жюри <span className="text-accent">*</span></label>
                      <span className="text-xs text-textSecondary leading-relaxed">Выберите пользователей. Им будет отправлен запрос (Invite). Они станут жюри только после подтверждения.</span>
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        value={jurySearch}
                        onChange={e => setJurySearch(e.target.value)}
                        placeholder="Поиск по никнейму или email..."
                        className="w-full bg-surface-1/40 border border-borderDef hover:border-borderStrong focus:border-accent focus:bg-surface-2 text-sm text-textPrimary px-4 h-12 rounded-control outline-none transition-all shadow-sm placeholder-textTertiary"
                      />
                      {jurySearch && (
                        <div className="absolute left-0 right-0 top-full mt-2 bg-surface-2 border border-borderDef/70 rounded-card shadow-elevation-raised z-30 p-1.5 max-h-48 overflow-y-auto custom-scrollbar">
                          {filteredUsers.length > 0 ? (
                            filteredUsers.map(user => (
                              <div
                                key={user.id}
                                onClick={() => handleAddJury(user)}
                                className="p-2.5 hover:bg-surface-3 rounded-control cursor-pointer flex items-center gap-3 transition-colors"
                              >
                                <img src={user.avatar} className="w-6 h-6 rounded-full object-cover" />
                                <div className="flex flex-col">
                                  <span className="text-sm font-semibold text-textPrimary leading-none">{user.nick}</span>
                                  <span className="text-xs text-textTertiary mt-1 leading-none">{user.name}</span>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-4 text-center text-xs text-textSecondary">Пользователи не найдены</div>
                          )}
                        </div>
                      )}
                    </div>

                    {juryMembers.length > 0 && (
                      <div className="flex flex-wrap gap-2.5 mt-2 bg-surface-1/40 p-4 rounded-card border border-borderDef/50 shadow-inner">
                        {juryMembers.map(jm => (
                          <div key={jm.user.id} className={`flex items-center gap-2 bg-surface-2 border pl-2 pr-1 py-1 rounded-full shadow-sm ${jm.status === 'pending' ? 'border-warning/50' : 'border-borderDef/70'}`}>
                            <img src={jm.user.avatar} className="w-5 h-5 rounded-full object-cover" />
                            <span className="text-xs font-mono font-bold text-textPrimary">{jm.user.nick}</span>
                            {jm.status === 'pending' && <span className="text-[9px] bg-warning/20 text-warning px-1.5 py-0.5 rounded-full uppercase tracking-wider font-bold">Pending</span>}
                            <button type="button" onClick={() => handleRemoveJury(jm.user.id)} className="w-6 h-6 flex items-center justify-center text-textTertiary hover:text-danger hover:bg-danger/10 rounded-full transition-colors cursor-pointer">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column: Dynamic Criteria List */}
              <div className="flex flex-col gap-6 w-full bg-surface-1/20 rounded-2xl p-6 lg:p-8 border border-borderDef">
                <div className="flex justify-between items-center px-1">
                  <div className="flex flex-col gap-0.5">
                    <label className="text-sm font-semibold text-textPrimary">Критерии оценки <span className="text-accent">*</span></label>
                    <span className="text-xs text-textSecondary font-mono">{criteria.length} из 8 добавлено</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCriteria}
                    className="h-10 px-4 bg-surface-1/40 hover:bg-surface-2 border border-borderDef text-sm font-medium text-textPrimary rounded-control shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-accent" />
                    <span>Добавить</span>
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {criteria.map(crit => (
                    <div key={crit.id} className="p-4 bg-surface-1/40 border border-borderDef/70 rounded-card flex flex-col gap-3 shadow-sm transition-all hover:border-borderStrong">
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          value={crit.name}
                          onChange={e => setCriteria(criteria.map(c => c.id === crit.id ? { ...c, name: e.target.value } : c))}
                          placeholder="Название критерия (напр. Геймплей)"
                          className="flex-1 bg-surface-2 border border-borderDef focus:border-accent text-sm font-semibold text-textPrimary px-4 h-11 rounded-control outline-none shadow-inner transition-colors placeholder-textTertiary"
                        />
                        <CustomSelect
                          value={crit.weight.toString()}
                          onChange={val => setCriteria(criteria.map(c => c.id === crit.id ? { ...c, weight: parseInt(val) } : c))}
                          options={[1, 2, 3, 4, 5].map(w => ({ value: w.toString(), label: `Вес: x${w}` }))}
                          icon={<Star className="text-accent fill-accent" />}
                          size="lg"
                          className="w-36 shrink-0 font-mono text-accent font-bold"
                        />
                        <button type="button" onClick={() => handleRemoveCriteria(crit.id)} className="w-11 h-11 shrink-0 flex items-center justify-center text-textTertiary hover:text-danger hover:bg-danger/10 rounded-control transition-colors cursor-pointer border border-transparent hover:border-danger/20">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={crit.desc}
                        onChange={e => setCriteria(criteria.map(c => c.id === crit.id ? { ...c, desc: e.target.value } : c))}
                        placeholder="Подсказка для судей (до 150 символов)..."
                        className="w-full bg-surface-2 border border-borderDef focus:border-accent text-xs text-textSecondary px-4 h-10 rounded-control outline-none shadow-inner transition-colors placeholder-textTertiary"
                      />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-10 animate-fadeIn pt-2">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:gap-14 items-start pt-4 border-t border-borderDef/30">

              {/* Left Column: Theme */}
              <div className="flex flex-col gap-8 w-full">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1 px-1">
                    <label htmlFor="jamTheme" className="text-sm font-semibold text-textPrimary">Секретная тема джема</label>
                    <span className="text-xs text-textSecondary leading-relaxed">Основной мотив, которому должны следовать игры участников.</span>
                  </div>

                  <div className="flex flex-col gap-4">
                    <input
                      id="jamTheme"
                      type="text"
                      value={theme}
                      onChange={e => setTheme(e.target.value)}
                      placeholder="Например: Параллельные миры, Один в темноте..."
                      className="w-full bg-surface-1/40 border border-borderDef hover:border-borderStrong focus:border-accent focus:bg-surface-2 text-sm text-textPrimary font-semibold px-4 h-12 rounded-control outline-none transition-all shadow-sm placeholder-textTertiary"
                    />

                    <div className="pt-2 px-1">
                      <label className="flex items-start gap-3 p-3 bg-surface-1/40 hover:bg-surface-2 border border-borderDef rounded-card cursor-pointer transition-colors shadow-sm group">
                        <Checkbox
                          checked={hideThemeUntilStart}
                          onChange={setHideThemeUntilStart}
                          className="mt-0.5"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-textPrimary">Скрыть тему до старта</span>
                          <span className="text-xs text-textSecondary mt-0.5 leading-relaxed">Она будет зашифрована и раскроется автоматически в момент начала приема работ.</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Custom Submission Fields Constructor */}
              <div className="flex flex-col gap-6 w-full bg-surface-1/20 rounded-2xl p-6 lg:p-8 border border-borderDef">
                <div className="flex justify-between items-center px-1">
                  <div className="flex flex-col gap-0.5">
                    <label className="text-sm font-semibold text-textPrimary">Анкета для участников <span className="text-accent">*</span></label>
                    <span className="text-xs text-textSecondary font-mono">{customFields.length} доп. полей</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCustomField}
                    className="h-10 px-4 bg-surface-1/40 hover:bg-surface-2 border border-borderDef text-sm font-medium text-textPrimary rounded-control shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-accent" />
                    <span>Вопрос</span>
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {customFields.map(cf => (
                    <div key={cf.id} className="p-4 bg-surface-1/40 border border-borderDef/70 rounded-card flex flex-col gap-3 shadow-sm transition-all hover:border-borderStrong">
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          value={cf.label}
                          onChange={e => setCustomFields(customFields.map(f => f.id === cf.id ? { ...f, label: e.target.value } : f))}
                          placeholder="Текст вопроса"
                          className="flex-1 bg-surface-2 border border-borderDef focus:border-accent text-sm font-semibold text-textPrimary px-4 h-11 rounded-control outline-none shadow-inner transition-colors placeholder-textTertiary"
                        />
                        <CustomSelect
                          value={cf.type}
                          onChange={val => setCustomFields(customFields.map(f => f.id === cf.id ? { ...f, type: val as any } : f))}
                          options={[
                            { value: 'text', label: 'Текст' },
                            { value: 'checkbox', label: 'Чекбокс' },
                            { value: 'select', label: 'Список' }
                          ]}
                          size="lg"
                          className="w-32 shrink-0 font-semibold text-accent"
                        />
                        <button type="button" onClick={() => handleRemoveCustomField(cf.id)} className="w-11 h-11 shrink-0 flex items-center justify-center text-textTertiary hover:text-danger hover:bg-danger/10 rounded-control transition-colors cursor-pointer border border-transparent hover:border-danger/20">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {cf.type === 'select' && (
                        <div className="pt-1">
                          <input
                            type="text"
                            value={cf.options}
                            onChange={e => setCustomFields(customFields.map(f => f.id === cf.id ? { ...f, options: e.target.value } : f))}
                            placeholder="Опции через запятую (например: Unity, Godot, Unreal)"
                            className="w-full bg-surface-2 border border-borderDef focus:border-accent text-xs text-textSecondary px-4 h-10 rounded-control outline-none shadow-inner font-mono transition-colors placeholder-textTertiary"
                          />
                        </div>
                      )}
                    </div>
                  ))}

                  {customFields.length === 0 && (
                    <div className="p-6 border border-dashed border-borderDef/50 rounded-card flex items-center justify-center">
                      <span className="text-sm text-textSecondary">Дополнительные поля не добавлены</span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col gap-10 animate-fadeIn pt-2">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:gap-14 items-start pt-4 border-t border-borderDef/30">

              {/* Left Column: Prizes & Partners */}
              <div className="flex flex-col gap-8 w-full">
                
                {/* Partners Section */}
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-baseline px-1">
                    <label className="text-sm font-semibold text-textPrimary">Партнеры и Спонсоры</label>
                    <span className="text-[10px] font-mono font-bold text-textTertiary px-1.5 py-0.5 bg-surface-2 border border-borderDef rounded">Верификация</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {partners.map(p => (
                      <div key={p.id} className="flex items-center justify-between p-3 bg-surface-1/40 border border-borderDef rounded-card">
                        <span className="text-sm font-semibold text-textPrimary">{p.name}</span>
                        {p.status === 'verified' ? (
                          <span className="text-xs bg-success/20 text-success px-2 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1"><Check className="w-3 h-3"/> Verified</span>
                        ) : (
                          <span className="text-xs bg-warning/20 text-warning px-2 py-1 rounded-full font-bold uppercase tracking-wider">Under Review</span>
                        )}
                      </div>
                    ))}
                    <button type="button" className="flex items-center justify-center gap-2 p-3 border border-dashed border-borderDef/70 rounded-card hover:bg-surface-2 transition-colors cursor-pointer text-sm font-semibold text-accent mt-1">
                      <Plus className="w-4 h-4"/>
                      <span>Пригласить партнера</span>
                    </button>
                  </div>
                </div>

                {/* Prizes Section */}
                <div className="flex flex-col gap-3 pt-4 border-t border-borderDef/30">
                  <div className="flex justify-between items-baseline px-1">
                    <label className="text-sm font-semibold text-textPrimary">Структурированные призы</label>
                    <span className="text-[10px] font-mono font-bold text-textTertiary px-1.5 py-0.5 bg-surface-2 border border-borderDef rounded">Фонд наград</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    {prizes.map(prize => (
                      <div key={prize.id} className="flex flex-col gap-2 p-4 bg-surface-1/40 border border-borderDef rounded-card">
                        <div className="flex justify-between items-start">
                          <span className="text-sm font-bold text-textPrimary">{prize.name}</span>
                          <span className="text-xs font-mono font-bold text-accent px-2 py-0.5 bg-surface-3 rounded">{prize.type === 'money' ? 'Деньги' : 'Софт/Услуги'}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex flex-col">
                            <span className="text-xs text-textTertiary">Ценность</span>
                            <span className="text-sm font-mono font-bold text-textPrimary">{prize.amount} {prize.currency}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-textTertiary">Провайдер</span>
                            <span className="text-sm font-semibold text-textSecondary">{partners.find(p => p.id === prize.provider)?.name || 'Организатор'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button type="button" className="flex items-center justify-center gap-2 p-3 border border-dashed border-borderDef/70 rounded-card hover:bg-surface-2 transition-colors cursor-pointer text-sm font-semibold text-accent mt-1">
                      <Plus className="w-4 h-4"/>
                      <span>Добавить приз</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Restrictions & Submissions Gallery visibility */}
              <div className="flex flex-col gap-6 w-full">
                <div className="flex flex-col gap-1 px-1 mb-2">
                  <h2 className="text-sm font-semibold text-textPrimary">Ограничения и Галерея</h2>
                  <span className="text-xs text-textSecondary leading-relaxed">Правила публикации работ участниками.</span>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="flex items-start gap-3 p-4 bg-surface-1/40 hover:bg-surface-2 border border-borderDef rounded-card cursor-pointer transition-colors shadow-sm">
                    <input
                      type="checkbox"
                      checked={oneGameLimit}
                      onChange={e => setOneGameLimit(e.target.checked)}
                      className="accent-accent w-4 h-4 mt-0.5 cursor-pointer"
                    />
                    <div className="flex flex-col w-full">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-sm font-semibold text-textPrimary">1 игра от участника/команды</span>
                        <span className="text-[10px] font-mono font-bold text-accent px-1.5 py-0.5 bg-accent/10 border border-accent/20 rounded mt-0.5 shrink-0">CQ-6.3</span>
                      </div>
                      <span className="text-xs text-textSecondary mt-1 leading-relaxed">Запрещает одному пользователю подавать несколько проектов на джем.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-4 bg-surface-1/40 hover:bg-surface-2 border border-borderDef rounded-card cursor-pointer transition-colors shadow-sm">
                    <input
                      type="checkbox"
                      checked={hideEntriesUntilEnd}
                      onChange={e => setHideEntriesUntilEnd(e.target.checked)}
                      className="accent-accent w-4 h-4 mt-0.5 cursor-pointer"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-textPrimary">Скрыть сабмиты до окончания дедлайна</span>
                      <span className="text-xs text-textSecondary mt-1 leading-relaxed">Защищает проекты от списывания и заимствования идей другими командами. Галерея игр откроется только после завершения приема работ.</span>
                    </div>
                  </label>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* STICKY BOTTOM ACTION BAR */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 h-16 md:h-[88px] bg-surface-0/95 backdrop-blur-xl border-t border-borderDef z-30 flex items-center justify-between px-4 md:px-8">
        <div className="max-w-[1200px] mx-auto w-full flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(prev => prev - 1)}
                className="h-11 sm:h-12 px-3.5 sm:px-5 text-xs sm:text-sm font-medium text-textSecondary hover:text-textPrimary bg-surface-1/40 hover:bg-surface-2 border border-borderDef/70 rounded-xl transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer shadow-sm touch-manipulation active:scale-[0.98]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Назад</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleSaveDraft}
              className="h-11 sm:h-12 px-4 sm:px-5 text-xs sm:text-sm font-medium text-textSecondary hover:text-textPrimary bg-surface-1/40 hover:bg-surface-2 border border-borderDef/70 rounded-xl transition-all hidden sm:flex items-center gap-2 cursor-pointer shadow-sm touch-manipulation active:scale-[0.98]"
            >
              <Save className="w-4 h-4" />
              <span>Сохранить черновик</span>
            </button>
            <button
              type="button"
              onClick={() => setIsPreviewModalOpen(true)}
              className="h-11 sm:h-12 px-4 sm:px-5 text-xs sm:text-sm font-medium text-accent hover:bg-accent/10 border border-accent/20 rounded-xl transition-all hidden md:flex items-center gap-2 cursor-pointer shadow-sm touch-manipulation active:scale-[0.98]"
            >
              <Eye className="w-4 h-4" />
              <span>Предпросмотр</span>
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {pageMode === 'edit' && (
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="h-11 sm:h-12 px-3 sm:px-4 text-xs sm:text-sm font-medium text-danger hover:bg-danger/10 rounded-xl transition-colors cursor-pointer touch-manipulation"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(prev => Math.min(4, prev + 1))}
                className="h-11 sm:h-12 px-6 sm:px-8 bg-accent hover:bg-accent/90 text-white text-xs sm:text-sm font-bold uppercase tracking-wide rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-sm touch-manipulation active:scale-[0.98]"
              >
                <span>Далее</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting || !isAllValid}
                onClick={handleSubmitRequest}
                className={`h-11 sm:h-12 px-5 sm:px-8 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wide flex items-center gap-2 sm:gap-2.5 transition-all touch-manipulation active:scale-[0.98] ${isAllValid
                    ? 'bg-accent hover:bg-accent/90 text-white shadow-lg cursor-pointer'
                    : 'bg-surface-1/20 text-textDisabled border border-borderDef/40 cursor-not-allowed'
                  }`}
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Check className="w-4 h-4 stroke-[3]"  strokeWidth={2.5} />
                )}
                <span>
                  {jamPhase === 'published_active' 
                    ? 'Запрос на изменение правил' 
                    : (pageMode === 'edit' ? 'Сохранить' : 'Отправить на модерацию')}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MODAL: PREVIEW */}
      <Modal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        title="Предпросмотр карточки джема"
        maxWidth="lg"
      >
        <div className="flex flex-col gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-accent font-mono text-sm">{title || "Название джема"}</span>
            <span className="text-textTertiary font-mono">#{slug || "slug"}</span>
          </div>

          <p className="text-textSecondary leading-relaxed italic">{shortDesc || "Лаконичный анонс джема..."}</p>

          <div className="grid grid-cols-2 gap-3 bg-surface-2 p-3 rounded-xl border border-borderDef">
            <div>
              <span className="text-caption text-textTertiary uppercase font-mono">Старт:</span>
              <p className="font-mono text-textPrimary">{startAt.replace('T', ' ')}</p>
            </div>
            <div>
              <span className="text-caption text-textTertiary uppercase font-mono">Дедлайн:</span>
              <p className="font-mono text-textPrimary">{endAt.replace('T', ' ')}</p>
            </div>
          </div>

          {theme && (
            <div className="bg-accent/10 border border-accent/30 p-3 rounded-xl flex items-center justify-between">
              <span className="font-bold text-accent">Тема состязания:</span>
              <span className="font-mono font-bold text-white">{hideThemeUntilStart ? '🔒 Зашифрована до старта' : theme}</span>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setIsPreviewModalOpen(false)}
            >
              Закрыть окно
            </Button>
          </div>
        </div>
      </Modal>

      {/* MODAL: DELETE CONFIRMATION */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Удалить черновик джема?"
        maxWidth="md"
      >
        <div className="flex flex-col gap-4 text-xs">
          <p className="text-textSecondary leading-relaxed">
            Это действие необратимо. Для подтверждения введите полное название джема: <strong className="text-white">{title || "Indie Game Dev Jam 2026"}</strong>
          </p>
          <Input
            value={deleteConfirmTitle}
            onChange={e => setDeleteConfirmTitle(e.target.value)}
            placeholder="Введите название..."
          />
          <div className="flex gap-2 justify-end pt-2">
            <Button
              variant="danger"
              size="md"
              onClick={handleDeleteJam}
            >
              Удалить навсегда
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Отмена
            </Button>
          </div>
        </div>
      </Modal>

      {/* TOAST NOTIFICATIONS */}
      {toast.show && (
        <Toast message={toast.text} type={toast.type as any} position="bottom-left" />
      )}

      {/* DEV MATRIX PANEL */}
      <DevMatrixPanel
        bottomOffsetClass="bottom-36 md:bottom-0"
        pageName="Конструктор джема"
        fields={[
          {
            id: 'pageMode',
            label: 'Режим страницы',
            type: 'select',
            value: pageMode,
            onChange: setPageMode,
            options: [
              { value: 'create', label: 'Создание (/jams/create)' },
              { value: 'edit', label: 'Редактирование (/jams/slug/edit)' }
            ]
          },
          {
            id: 'jamPhase',
            label: 'Статус заявки / джема',
            type: 'select',
            value: jamPhase,
            onChange: setJamPhase,
            options: [
              { value: 'draft', label: 'Черновик (Draft)' },
              { value: 'submitted', label: 'На модерации (Submitted)' },
              { value: 'under_review', label: 'Рассматривается (Under Review)' },
              { value: 'needs_changes', label: 'Требуются правки (Needs Changes)' },
              { value: 'approved', label: 'Одобрено (Approved / Preparing)' },
              { value: 'published_active', label: 'Активный джем (Active)' }
            ]
          },
          {
            id: 'authStateMock',
            label: 'Авторизация',
            type: 'select',
            value: authStateMock,
            onChange: setAuthStateMock,
            options: [
              { value: 'authenticated', label: 'Авторизован' },
              { value: 'guest', label: 'Гость (Unauthenticated)' }
            ]
          },
          {
            id: 'userAssignments',
            label: 'Права на джем',
            type: 'select',
            value: userAssignments.includes('jam-123') ? 'has_rights' : 'no_rights',
            onChange: (val) => setUserAssignments(val === 'has_rights' ? ['jam-123'] : []),
            options: [
              { value: 'has_rights', label: 'Есть JamOrganizerAssignment' },
              { value: 'no_rights', label: 'Нет прав на этот джем' }
            ]
          }
        ]}
      />

    </div>
  );
}