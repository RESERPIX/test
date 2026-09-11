import React, { useState, useEffect, useRef } from 'react';
import DevMatrixPanel from '../components/DevMatrixPanel';
import FontStyles from '../components/ui/FontStyles';
import { CustomSelect } from '../components/ui/Select';
import { Input } from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Checkbox from '../components/ui/Checkbox';
import Modal from '../components/ui/Modal';
import Toast from '../components/ui/Toast';
import ConfirmActionModal from '../components/modals/ConfirmActionModal';
import { Check, X, Upload, AlertTriangle, ChevronRight, ChevronLeft, Lock, Unlock, Save, Trash2 } from 'lucide-react';

const ALL_GENRES = [
  "Action", "Adventure", "RPG", "Strategy", "Simulator", 
  "Shooter", "Platformer", "Puzzle", "Horror", "Survival", 
  "Visual Novel", "Racing", "Sports", "Rhythm", "Card Games", 
  "Casual", "Educational", "Fighting", "Other"
];

const MOCK_EXISTING_DRAFTS = [
  {
    id: "draft_01",
    title: "BrokenLore: FOLLOW",
    slug: "brokenlore-follow",
    short_desc: "Психологический хоррор от первого лица. Управляйте ограниченным запасом O2 в криокамере заброшенной станции «Танатос».",
    content_md: "### Сюжет\nВы просыпаетесь в поврежденной криокамере станции «Танатос» после непонятной катастрофы...\n\n### Игровой процесс\n- Балансируйте между исследованием отсеков и контролем O2",
    controls: "WASD — Перемещение\nE — Взаимодействие с O2\nПробел — Задержка дыхания",
    warnings: "Световые вспышки, резкие звуки, элементы клаустрофобии.",
    genres: ["Horror", "Survival"],
    tags: ["Sci-Fi", "Space", "UnrealEngine"],
    cover_url: "/mocks/cover1.jpg",
    webgl_file_name: "brokenlore_webgl_v1.2.4.zip",
    webgl_file_size: "245 MB",
    themeInterpretation: "Забытая космическая станция 'Танатос' как прототип заброшенных технологий человечества."
  }
];

const MOCK_USERS = [
  { id: "u2", name: "Alex_Code", handle: "@alex_code", role: "WebGL Dev" },
  { id: "u3", name: "Maria_Art", handle: "@maria_art", role: "3D Artist" },
  { id: "u4", name: "VoidSound", handle: "@void_sound", role: "Audio Producer" }
];

const ISO_9_GOST_MAP: Record<string, string> = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
  'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
  'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
  'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
  'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
};

export function generateSlugIso9(text: string): string {
  let lower = text.toLowerCase().trim();
  let result = '';
  for (let i = 0; i < lower.length; i++) {
    const char = lower[i];
    if (ISO_9_GOST_MAP[char] !== undefined) {
      result += ISO_9_GOST_MAP[char];
    } else {
      result += char;
    }
  }
  return result
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export type UploadState = 'IDLE' | 'VALIDATING_ZIP' | 'UPLOADING_FILE' | 'SUCCESS' | 'ERROR';

export interface WebGLBuildData {
  build_id: string;
  file_name: string;
  size_bytes: number;
  has_index_html: boolean;
  extracted_entrypoint: string;
  temp_url: string;
}

export interface UploadError {
  code: 'MISSING_INDEX_HTML' | 'NESTED_DIRECTORY_STRUCTURE' | 'FILE_TOO_LARGE' | 'INVALID_FILE_TYPE' | 'NETWORK_ERROR';
  message: string;
  recommendation?: string;
}

export default function GameSubmissionPage({ 
  jamSlug, 
  authState, 
  setAuthState 
}: { 
  jamSlug?: string;
  authState?: string; 
  setAuthState?: (val: string) => void;
}) {
  const [step, setStep] = useState(1);
  const [mode, setSourceMode] = useState('create_new');
  const [selectedDraftId, setSelectedDraftId] = useState('');

  // Step 1 State: Project & Build
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugLocked, setIsSlugLocked] = useState(false);
  const [buildFormat, setBuildFormat] = useState<'webgl' | 'desktop' | 'both'>('webgl');
  
  // WebGL Build State Machine
  const [uploadState, setUploadState] = useState<UploadState>('IDLE');
  const [webglBuildData, setWebglBuildData] = useState<WebGLBuildData | null>(null);
  const [uploadErrorObj, setUploadErrorObj] = useState<UploadError | null>(null);
  const [progressBytes, setProgressBytes] = useState<{ loaded: number; total: number; percent: number }>({ loaded: 0, total: 0, percent: 0 });
  const [desktopFiles, setDesktopFiles] = useState([]);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  // Step 2 State: Content & Team
  const [shortDesc, setShortDesc] = useState('');
  const [editorTab, setEditorTab] = useState('write');
  const [contentMd, setContentMd] = useState('');
  const [controls, setControls] = useState('');
  const [warnings, setWarnings] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [teamMode, setTeamMode] = useState('solo');
  const [teamSource, setTeamSource] = useState('invite');
  const [selectedStudio, setSelectedStudio] = useState('');
  const [coAuthors, setCoAuthors] = useState([]);
  const [coAuthorQuery, setCoAuthorQuery] = useState('');
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);

  // Step 3 State: Visuals & Genres
  const [coverUrl, setCoverUrl] = useState('');
  const [trailerUrl, setTrailerUrl] = useState('');
  const [galleryImages, setGalleryImages] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [genreSearchQuery, setGenreSearchQuery] = useState('');
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [projectStatus, setProjectStatus] = useState('Prototype');

  // Step 4 State: Theme & Jam Fields
  const [themeInterpretation, setThemeInterpretation] = useState('');
  const [engineUsed, setEngineUsed] = useState('Unity');
  const [hasThirdPartyAssets, setHasThirdPartyAssets] = useState(false);
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [isRulesAgreed, setIsRulesAgreed] = useState(false);

  // Touched state for field validation
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  // System & Modal States
  const [userRole, setUserRole] = useState('registered'); // 'registered', 'not_registered', 'submitted'
  const [jamPhase, setJamPhase] = useState('submission_open'); // 'submission_open', 'deadline_passed'
  const [toast, setToast] = useState({ show: false, text: '', type: 'info' });
  const [isNotRegModalOpen, setIsNotRegModalOpen] = useState(false);
  const [regModalStep, setRegModalStep] = useState(1);
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
  const [summaryShake, setSummaryShake] = useState(false);

  const coauthorSearchRef = useRef(null);
  const genreSearchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (coauthorSearchRef.current && !coauthorSearchRef.current.contains(event.target)) {
        setIsSearchDropdownOpen(false);
      }
      if (genreSearchRef.current && !genreSearchRef.current.contains(event.target)) {
        setIsGenreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const triggerToast = (text, type = 'info') => {
    setToast({ show: true, text, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3500);
  };

  const markTouched = (fieldName) => {
    setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugLocked) {
      const generated = generateSlugIso9(val);
      setSlug(generated);
    }
  };

  const handleSlugManualInput = (val: string) => {
    const clean = val.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setSlug(clean);
  };

  const handleDraftSelect = (draftId: string) => {
    setSelectedDraftId(draftId);
    const draft = MOCK_EXISTING_DRAFTS.find(d => d.id === draftId);
    if (draft) {
      setTitle(draft.title);
      setSlug(draft.slug);
      setShortDesc(draft.short_desc);
      setContentMd(draft.content_md);
      setControls(draft.controls);
      setWarnings(draft.warnings || '');
      setSelectedGenres(draft.genres);
      setTags(draft.tags);
      setCoverUrl(draft.cover_url);
      setThemeInterpretation(draft.themeInterpretation || '');
      if (draft.webgl_file_name) {
        setBuildFormat('webgl');
        setUploadState('SUCCESS');
        setWebglBuildData({
          build_id: 'bld_99210',
          file_name: draft.webgl_file_name,
          size_bytes: 44564480,
          has_index_html: true,
          extracted_entrypoint: 'index.html',
          temp_url: 'https://cdn.hubigr.ru/temp/builds/bld_99210/index.html'
        });
      }
      triggerToast(`Черновик «${draft.title}» загружен`, 'success');
    }
  };

  // State Machine WebGL Upload Processor
  const processWebGlFileUpload = (
    fileName = 'my_webgl_game.zip',
    fileSizeBytes = 44564480,
    scenario: 'success' | 'missing_root' | 'nested_dir' | 'too_large' | 'network_error' = 'success'
  ) => {
    if (jamPhase === 'deadline_passed') {
      triggerToast('Загрузка билдов заморожена из-за наступления дедлайна', 'danger');
      return;
    }

    setUploadErrorObj(null);
    setUploadState('VALIDATING_ZIP');

    // 1. Client-side Validation Step
    setTimeout(() => {
      if (scenario === 'too_large' || fileSizeBytes > 1024 * 1024 * 1024) {
        setUploadState('ERROR');
        setUploadErrorObj({
          code: 'FILE_TOO_LARGE',
          message: 'Размер файла превышает допустимый лимит в 1024 МБ'
        });
        return;
      }

      if (scenario === 'missing_root') {
        setUploadState('ERROR');
        setUploadErrorObj({
          code: 'MISSING_INDEX_HTML',
          message: 'В корне загруженного ZIP-архива не найден файл index.html',
          recommendation: 'Убедитесь, что файл index.html находится на верхнем уровне архива, а не внутри папки.'
        });
        return;
      }

      if (scenario === 'nested_dir') {
        setUploadState('ERROR');
        setUploadErrorObj({
          code: 'NESTED_DIRECTORY_STRUCTURE',
          message: 'Файл index.html находится во вложенной директории MyGame/index.html',
          recommendation: 'Выделите содержимое папки сборки и упакуйте в ZIP напрямую (без создания внешней папки).'
        });
        return;
      }

      // 2. Uploading State with AbortController
      setUploadState('UPLOADING_FILE');
      const controller = new AbortController();
      abortControllerRef.current = controller;

      let currentBytes = 0;
      const stepBytes = Math.floor(fileSizeBytes / 8);

      const interval = setInterval(() => {
        if (controller.signal.aborted) {
          clearInterval(interval);
          setUploadState('ERROR');
          setUploadErrorObj({
            code: 'NETWORK_ERROR',
            message: 'Загрузка файла была отменена пользователем'
          });
          return;
        }

        currentBytes += stepBytes;
        if (scenario === 'network_error' && currentBytes > fileSizeBytes * 0.4) {
          clearInterval(interval);
          setUploadState('ERROR');
          setUploadErrorObj({
            code: 'NETWORK_ERROR',
            message: 'Прервано сетевое соединение во время загрузки архива (504 Gateway Timeout)'
          });
          return;
        }

        if (currentBytes >= fileSizeBytes) {
          currentBytes = fileSizeBytes;
          clearInterval(interval);

          // 3. SUCCESS Response (HTTP 200 OK API Contract)
          const mockBuildId = `bld_${Math.floor(Math.random() * 89999 + 10000)}`;
          setWebglBuildData({
            build_id: mockBuildId,
            file_name: fileName,
            size_bytes: fileSizeBytes,
            has_index_html: true,
            extracted_entrypoint: 'index.html',
            temp_url: `https://cdn.hubigr.ru/temp/builds/${mockBuildId}/index.html`
          });
          setUploadState('SUCCESS');
          triggerToast('WebGL архив успешно загружен и валидирован (index.html найден в корне)', 'success');
        }

        const pct = Math.round((currentBytes / fileSizeBytes) * 100);
        setProgressBytes({ loaded: currentBytes, total: fileSizeBytes, percent: pct });
      }, 120);
    }, 350);
  };

  const cancelWebGlUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const resetWebGlUpload = () => {
    setWebglBuildData(null);
    setUploadErrorObj(null);
    setUploadState('IDLE');
    setProgressBytes({ loaded: 0, total: 0, percent: 0 });
  };

  const handleAddDesktopFile = (osName: 'Windows' | 'macOS' | 'Linux', customFileName?: string, customSize?: string) => {
    if (jamPhase === 'deadline_passed') {
      triggerToast('Загрузка билдов заморожена из-за наступления дедлайна', 'danger');
      return;
    }
    
    // Remove previous build for the same OS if exists
    const filtered = desktopFiles.filter(f => f.os !== osName);

    const ext = osName === 'Windows' ? '.zip' : osName === 'macOS' ? '.zip' : '.tar.gz';
    const defaultName = `game_build_${osName.toLowerCase()}${ext}`;

    const newDesktop = {
      id: `d_${osName.toLowerCase()}_${Date.now()}`,
      os: osName,
      name: customFileName || defaultName,
      versionTag: 'v1.0.0-jam',
      isDefault: filtered.length === 0,
      size: customSize || (osName === 'Windows' ? '320 MB' : osName === 'macOS' ? '340 MB' : '310 MB')
    };

    setDesktopFiles([...filtered, newDesktop]);
    triggerToast(`Сборка для ${osName} прикреплена (${newDesktop.name})`, 'success');
  };

  const toggleDesktopDefault = (id) => {
    setDesktopFiles(desktopFiles.map(f => ({
      ...f,
      isDefault: f.id === id
    })));
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const cleaned = tagInput.trim().replace(/^#/, '');
      if (cleaned && !tags.includes(cleaned) && tags.length < 10) {
        setTags([...tags, cleaned]);
        setTagInput('');
      }
    }
  };

  const handleAddGalleryImageSim = () => {
    if (galleryImages.length >= 10) {
      triggerToast('Максимум 10 скриншотов', 'danger');
      return;
    }
    const sampleImages = [
      null,
      null
    ];
    setGalleryImages([...galleryImages, sampleImages[galleryImages.length % sampleImages.length]]);
    triggerToast('Скриншот добавлен в галерею', 'success');
  };

  const toggleGenre = (genreName) => {
    if (selectedGenres.includes(genreName)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genreName));
    } else {
      if (selectedGenres.length >= 5) {
        triggerToast('Максимум 5 жанров', 'danger');
        return;
      }
      setSelectedGenres([...selectedGenres, genreName]);
    }
  };

  const checkReq1 = title.trim().length >= 2;
  const checkReq2 = (buildFormat === 'desktop' ? desktopFiles.length > 0 : webglBuildData !== null) || (buildFormat === 'both' && webglBuildData !== null && desktopFiles.length > 0);
  const checkReq3 = shortDesc.trim().length >= 10;
  const checkReq4 = contentMd.trim().length >= 20;
  const checkReq5 = controls.trim().length >= 3;
  const checkReq6 = coverUrl.trim().length > 0;
  const checkReq7 = selectedGenres.length >= 1;
  const checkReq8 = themeInterpretation.trim().length >= 10;

  const isStep1Complete = checkReq1 && checkReq2;
  const isStep2Complete = checkReq3 && checkReq4 && checkReq5;
  const isStep3Complete = checkReq6 && checkReq7;
  const isStep4Complete = checkReq8;

  const requiredChecks = [
    checkReq1, checkReq2, checkReq3, checkReq4, 
    checkReq5, checkReq6, checkReq7, checkReq8
  ];
  
  const completedCount = requiredChecks.filter(Boolean).length;
  const completionPercent = Math.round((completedCount / requiredChecks.length) * 100);
  const isAllReady = completedCount === requiredChecks.length;

  const jumpToField = (targetStep, fieldId) => {
    setStep(targetStep);
    setTimeout(() => {
      if (fieldId) {
        const el = document.getElementById(fieldId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.focus();
        }
      }
    }, 100);
  };

  const handleSaveDraft = () => {
    triggerToast('Черновик сабмита успешно сохранен!', 'success');
  };

  const handleRevokeSubmit = () => {
    setIsRevokeModalOpen(false);
    setUserRole('registered');
    triggerToast('Сабмит отозван. Игра переведена в статус черновика', 'info');
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    if (userRole === 'not_registered') {
      setIsNotRegModalOpen(true);
      return;
    }

    if (!isAllReady) {
      setSummaryShake(true);
      setTimeout(() => setSummaryShake(false), 400);
      triggerToast('Заполните все обязательные поля перед отправкой!', 'danger');
      return;
    }

    if (!isRulesAgreed) {
      triggerToast('Подтвердите согласие с правилами джема', 'danger');
      return;
    }

    triggerToast(userRole === 'submitted' ? 'Заявка успешно обновлена!' : 'Работа отправлена на джем!', 'success');
    setTimeout(() => {
      setUserRole('submitted');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-surface-0 text-textPrimary font-sans pb-44 md:pb-32 relative overflow-x-hidden">
      <FontStyles />

      {/* MAIN CONTAINER */}
      <main className="max-w-[1200px] mx-auto px-4 md:px-8 pt-6 sm:pt-8 relative z-10">

        {/* BREADCRUMBS & PAGE HEADER */}
        <div className="mb-6">
          <nav className="flex items-center gap-2 text-xs text-textSecondary mb-2 sm:mb-3 font-medium">
            <a href="#/" className="hover:text-textPrimary transition-colors">Главная</a>
            <span>/</span>
            <a href="#/jams" className="hover:text-textPrimary transition-colors">Джемы</a>
            <span>/</span>
            <a href="#/jams/broken-worlds-jam" className="hover:text-textPrimary transition-colors truncate max-w-[150px]">Broken Worlds</a>
            <span>/</span>
            <span className="text-textPrimary truncate">Подача</span>
          </nav>

          <div className="pb-4 sm:pb-6 border-b border-borderDef/30 flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-heading-3 sm:text-heading-2 md:text-heading-1 font-extrabold uppercase font-mono tracking-wide text-textPrimary drop-shadow-sm leading-tight">
                {userRole === 'submitted' ? 'Редактирование' : 'Подача работы'} <span className="text-textSecondary text-base sm:text-heading-3 md:text-heading-2 font-normal block sm:inline">на Broken Worlds Jam</span>
              </h1>
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mt-3 sm:mt-4">
                <div className="flex items-center gap-2 sm:gap-2.5 bg-surface-1/40 border border-borderDef/50 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-card shadow-sm">
                  <span className="text-[11px] sm:text-xs font-medium text-textSecondary">До окончания:</span>
                  <span className="text-accent font-mono font-bold text-xs sm:text-sm">
                    04ч 12м 30с
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-2.5 bg-surface-1/40 border border-borderDef/50 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-card shadow-sm">
                  <span className="text-[11px] sm:text-xs font-medium text-textSecondary">Лимит:</span>
                  <span className="text-textPrimary font-mono font-bold text-xs sm:text-sm">
                    1 игра
                  </span>
                </div>
              </div>
            </div>

            {userRole === 'submitted' && (
              <button
                type="button"
                onClick={() => setIsRevokeModalOpen(true)}
                className="h-10 sm:h-11 px-4 sm:px-5 bg-danger/10 hover:bg-danger/20 border border-danger/30 text-danger text-xs sm:text-sm font-semibold rounded-card transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-sm touch-manipulation"
              >
                <Trash2 className="w-4 h-4" />
                <span>Отозвать сабмит</span>
              </button>
            )}
          </div>
        </div>

        {/* NOT REGISTERED BANNER */}
        {userRole === 'not_registered' && (
          <div className="mb-6 sm:mb-8 p-4 sm:p-5 rounded-modal bg-warning/10 border border-warning/30 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 shadow-sm">
            <div className="flex items-center gap-3 text-xs sm:text-sm text-warning font-medium">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>Для подачи игры необходимо сначала зарегистрироваться в джеме.</span>
            </div>
            <button
              type="button"
              onClick={() => setIsNotRegModalOpen(true)}
              className="h-10 px-5 bg-accent hover:bg-accent/90 text-white font-extrabold rounded-card transition-colors cursor-pointer shrink-0 shadow-sm text-xs sm:text-sm"
            >
              Зарегистрироваться в джеме
            </button>
          </div>
        )}

        {/* DEADLINE PASSED BANNER */}
        {jamPhase === 'deadline_passed' && (
          <div className="mb-6 sm:mb-8 p-4 sm:p-5 rounded-modal bg-surface-1/40 border border-borderDef/50 flex items-center gap-3 text-xs sm:text-sm text-textSecondary shadow-sm">
            <Lock className="w-5 h-5 text-accent shrink-0" />
            <span className="leading-relaxed">Прием работ и загрузка новых билдов завершены. Билды заморожены для этапа голосования. Вы можете редактировать только текстовое описание.</span>
          </div>
        )}

        {/* STEPPER NAVIGATION */}
        <nav className="mb-6 sm:mb-10" aria-label="Шаги оформления">
          <div className="flex flex-row bg-surface-1/40 p-1.5 rounded-[20px] border border-borderDef/50 shadow-inner overflow-x-auto touch-scroll no-scrollbar gap-1">
            {[
              { num: 1, name: "1. Проект и Билд", isDone: isStep1Complete },
              { num: 2, name: "2. Контент и Команда", isDone: isStep2Complete },
              { num: 3, name: "3. Визуал и Жанры", isDone: isStep3Complete },
              { num: 4, name: "4. Тема и Проверка", isDone: isStep4Complete }
            ].map(s => {
              const isActive = step === s.num;
              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => setStep(s.num)}
                  aria-label={`Перейти на шаг ${s.num}`}
                  className={`flex-1 h-11 sm:h-12 px-3 sm:px-4 rounded-[14px] transition-all flex items-center justify-between text-xs sm:text-sm font-semibold cursor-pointer whitespace-nowrap min-w-[150px] sm:min-w-0 shrink-0 sm:shrink touch-manipulation ${
                    isActive 
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

        {}
        {step === 1 && (
          <div className="flex flex-col gap-10 animate-fadeIn pt-2">
            
            {/* Source Option Selection - Sleek Segmented Control */}
            <div className="flex flex-col gap-4">
              <span className="text-sm font-semibold text-textPrimary px-1">
                Как вы хотите начать?
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => { setSourceMode('create_new'); setSelectedDraftId(''); }}
                  className={`p-5 rounded-modal border text-left transition-all cursor-pointer flex flex-col justify-center gap-1.5 min-h-[100px] ${
                    mode === 'create_new'
                      ? 'bg-accent/[0.04] border-accent/60 shadow-sm'
                      : 'bg-surface-1/40 border-borderDef/50 hover:border-borderStrong hover:bg-surface-1/80'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-sm font-semibold transition-colors ${mode === 'create_new' ? 'text-accent' : 'text-textPrimary group-hover:text-textPrimary'}`}>
                      Создать новую игру (с нуля)
                    </span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                      mode === 'create_new' ? 'border-accent bg-accent' : 'border-textTertiary group-hover:border-textSecondary'
                    }`}>
                      {mode === 'create_new' && <div className="w-1.5 h-1.5 rounded-full bg-surface-0" />}
                    </div>
                  </div>
                  <span className="text-xs text-textSecondary font-sans leading-relaxed">
                    Заполнить информацию для нового джем-проекта
                  </span>
                </button>

                <div className={`p-5 rounded-modal border text-left transition-all flex flex-col justify-center gap-3 min-h-[100px] relative z-20 ${
                    mode === 'select_profile'
                      ? 'bg-accent/[0.04] border-accent/60 shadow-sm'
                      : 'bg-surface-1/40 border-borderDef/50'
                  }`}
                >
                  <span className={`text-sm font-semibold transition-colors ${mode === 'select_profile' ? 'text-accent' : 'text-textPrimary'}`}>
                    Привязать существующий черновик
                  </span>
                  
                  <div className="w-full relative">
                    <CustomSelect
                      className="w-full"
                      size="lg"
                      variant="form"
                      id="draftSelect"
                      value={selectedDraftId}
                      onChange={(val) => {
                         if (val) {
                           setSourceMode('select_profile');
                           handleDraftSelect(val);
                         } else {
                           setSourceMode('create_new');
                           setSelectedDraftId('');
                         }
                      }}
                      placeholder="-- Выберите сохраненную игру --"
                      options={MOCK_EXISTING_DRAFTS.map(d => ({
                        value: d.id,
                        label: d.title,
                        sublabel: d.slug
                      }))}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Form Columns (No Card Soup) */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-14 items-start pt-4 border-t border-borderDef/30">
              
              {/* Left Column: Metadata */}
              <div className="flex flex-col justify-between gap-10 w-full">
                <div className="flex flex-col gap-8">
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-baseline px-1">
                      <label htmlFor="gameTitle" className="text-sm font-semibold text-textPrimary">
                        Заголовок игры <span className="text-accent">*</span>
                      </label>
                      <span className="text-xs font-mono text-textTertiary">{title.length} / 100</span>
                    </div>
                    <input
                      id="gameTitle"
                      type="text"
                      value={title}
                      onBlur={() => markTouched('title')}
                      onChange={e => handleTitleChange(e.target.value)}
                      placeholder="Например: BrokenLore: FOLLOW"
                      className={`w-full bg-surface-1/40 border ${
                        touchedFields.title && !checkReq1 ? 'border-danger' : 'border-borderDef hover:border-borderStrong focus:border-accent focus:bg-surface-2'
                      } text-sm text-textPrimary px-4 h-12 rounded-control outline-none transition-all font-sans shadow-sm placeholder-textTertiary`}
                    />
                    <span className="text-xs text-textSecondary px-1 leading-relaxed mt-0.5">
                      Название вашей игры, которое будет отображаться в каталоге и на странице сабмита.
                    </span>
                    {touchedFields.title && !checkReq1 && (
                      <span className="text-xs text-danger flex items-center gap-1.5 mt-0.5 px-1 font-medium">
                        <AlertTriangle className="w-3.5 h-3.5" /> Введите заголовок (минимум 2 символа)
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-baseline px-1">
                      <label htmlFor="gameSlug" className="text-sm font-semibold text-textPrimary">URL-идентификатор (Slug)</label>
                      <span className="text-[11px] font-mono text-textTertiary uppercase tracking-wider">
                        {isSlugLocked ? 'Ручной ввод' : 'Автогенерация'}
                      </span>
                    </div>
                    <div className="flex items-center bg-surface-1/40 border border-borderDef focus-within:border-borderStrong rounded-control pl-3.5 pr-1.5 h-12 text-sm font-mono text-textSecondary transition-colors shadow-sm">
                      <span className="shrink-0 text-textSecondary select-none">hubigr.ru/games/</span>
                      <input
                        id="gameSlug"
                        type="text"
                        value={slug}
                        readOnly={!isSlugLocked}
                        onChange={e => handleSlugManualInput(e.target.value)}
                        placeholder="new-game"
                        className="bg-transparent text-textPrimary outline-none flex-1 ml-1 font-mono text-sm disabled:opacity-50 placeholder-textTertiary"
                      />
                      <button
                        type="button"
                        onClick={() => setIsSlugLocked(!isSlugLocked)}
                        className={`p-2 rounded-md transition-all cursor-pointer flex items-center justify-center shrink-0 ml-2 ${
                          isSlugLocked 
                            ? 'bg-accent/10 text-accent hover:bg-accent/20' 
                            : 'text-textTertiary hover:text-textPrimary hover:bg-surface-3'
                        }`}
                        title={isSlugLocked ? "Разблокировать автогенерацию из названия" : "Зафиксировать ручной ввод URL"}
                      >
                        {isSlugLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-sm font-semibold text-textPrimary px-1">
                    Формат сборки <span className="text-accent">*</span>
                  </label>
                  <div className="flex bg-surface-1/40 p-1 rounded-card border border-borderDef/50 shadow-inner">
                    {[
                      { id: 'webgl', label: 'Только WebGL' },
                      { id: 'desktop', label: 'Только Desktop' },
                      { id: 'both', label: 'Оба формата' }
                    ].map(b => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setBuildFormat(b.id as any)}
                        className={`flex-1 h-10 px-3 text-xs font-medium rounded-control transition-all cursor-pointer ${
                          buildFormat === b.id 
                            ? 'bg-surface-3 text-textPrimary shadow-sm border border-borderDef font-bold' 
                            : 'text-textSecondary hover:text-textPrimary border border-transparent'
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Uploads */}
              <div className="flex flex-col gap-8 w-full bg-surface-1/20 rounded-modal p-6 lg:p-8 border border-borderDef">
                {(buildFormat === 'webgl' || buildFormat === 'both') && (
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 px-1">
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-semibold text-textPrimary">WebGL сборка</span>
                        <span className="px-1.5 py-0.5 rounded-sm bg-accent/10 text-[10px] font-mono font-bold uppercase tracking-wider text-accent border border-accent/20">webgl_file</span>
                      </div>
                      <span className="text-xs font-mono text-textTertiary">.zip до 1 ГБ</span>
                    </div>

                    {/* IDLE STATE */}
                    {uploadState === 'IDLE' && (
                      <div className="flex flex-col gap-3">
                        <label className="relative overflow-hidden bg-surface-1/30 border border-dashed border-borderDef/60 hover:border-accent/60 p-8 rounded-card flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors group">
                          <input
                            type="file"
                            accept=".zip,application/zip,application/x-zip-compressed"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) processWebGlFileUpload(f.name, f.size, 'success');
                            }}
                          />
                          <div className="w-12 h-12 rounded-full bg-surface-2 shadow-sm border border-borderDef/50 group-hover:border-accent/50 group-hover:bg-accent/5 flex items-center justify-center text-textSecondary group-hover:text-accent transition-all duration-300">
                            <Upload className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                          </div>
                          <div className="flex flex-col items-center gap-1 text-center">
                            <span className="text-sm font-semibold text-textPrimary group-hover:text-accent transition-colors">
                              Загрузить WebGL ZIP-архив
                            </span>
                            <span className="text-xs text-textSecondary font-sans leading-relaxed max-w-xs">
                              Нажмите или перетащите архив. Авто-проверка наличия index.html в корне.
                            </span>
                          </div>
                        </label>
                      </div>
                    )}

                    {/* VALIDATING_ZIP STATE */}
                    {uploadState === 'VALIDATING_ZIP' && (
                      <div className="bg-surface-2 border border-accent/40 p-6 rounded-card flex flex-col items-center justify-center gap-3 text-center animate-pulse">
                        <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                        <span className="text-xs font-bold text-textPrimary">Client-Side Zip Inspection...</span>
                        <span className="text-caption text-textTertiary font-mono">Чтение структуры файлов архива без распаковки. Поиск index.html в корне...</span>
                      </div>
                    )}

                    {/* UPLOADING_FILE STATE */}
                    {uploadState === 'UPLOADING_FILE' && (
                      <div className="bg-surface-2 border border-borderDef/60 p-5 rounded-card flex flex-col gap-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-textPrimary font-mono">POST /api/v1/builds/upload-webgl</span>
                          <span className="font-mono text-accent font-bold">{progressBytes.percent}%</span>
                        </div>

                        <div className="w-full bg-surface-1 h-2 rounded-full overflow-hidden border border-borderDef/40">
                          <div
                            className="bg-accent h-full transition-all duration-150"
                            style={{ width: `${progressBytes.percent}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-caption font-mono text-textTertiary pt-1">
                          <span>{(progressBytes.loaded / (1024 * 1024)).toFixed(1)} МБ из {(progressBytes.total / (1024 * 1024)).toFixed(1)} МБ</span>
                          <button
                            type="button"
                            onClick={cancelWebGlUpload}
                            className="text-danger hover:underline cursor-pointer font-sans"
                          >
                            Отменить загрузку
                          </button>
                        </div>
                      </div>
                    )}

                    {/* SUCCESS STATE */}
                    {uploadState === 'SUCCESS' && webglBuildData && (
                      <div className="bg-surface-2 border border-success/40 p-4 rounded-card flex items-center justify-between gap-3 shadow-elevation-base">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-control bg-success/20 border border-success text-success flex items-center justify-center shrink-0">
                            <Check className="w-5 h-5"  strokeWidth={2.5} />
                          </div>
                          <div className="flex flex-col overflow-hidden">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-textPrimary text-xs truncate">{webglBuildData.file_name}</span>
                              <span className="px-1.5 py-0.5 rounded bg-success/10 text-success text-[10px] font-mono font-bold">200 OK</span>
                            </div>
                            <div className="text-caption text-textTertiary font-mono flex items-center gap-2 mt-0.5">
                              <span>build_id: {webglBuildData.build_id}</span>
                              <span>•</span>
                              <span>{(webglBuildData.size_bytes / (1024 * 1024)).toFixed(1)} МБ</span>
                              <span>•</span>
                              <span className="text-success font-bold">index.html в корне</span>
                            </div>
                          </div>
                        </div>

                        {jamPhase !== 'deadline_passed' && (
                          <button
                            type="button"
                            onClick={resetWebGlUpload}
                            className="p-2 text-textTertiary hover:text-danger hover:bg-danger/10 rounded-control transition-colors cursor-pointer"
                            aria-label="Удалить WebGL билд"
                            title="Удалить сборку"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )}

                    {/* ERROR STATE */}
                    {uploadState === 'ERROR' && uploadErrorObj && (
                      <div className="relative overflow-hidden bg-danger/[0.04] border border-danger/20 rounded-card p-4 sm:p-5 flex gap-3.5 animate-fadeIn text-sm group">
                        {/* Акцентная левая направляющая линия (Stripe/Vercel style) */}
                        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-danger/60" />

                        {/* Иконка */}
                        <AlertTriangle className="w-5 h-5 text-danger shrink-0 mt-0.5" />

                        {/* Контентная часть */}
                        <div className="flex flex-col gap-3 flex-1 min-w-0">
                          
                          {/* Главное: Что произошло */}
                          <div className="flex flex-col gap-1.5">
                            <h4 className="font-semibold text-danger flex items-center gap-2.5 flex-wrap">
                              Ошибка валидации архива
                              <code className="px-1.5 py-0.5 rounded-sm bg-danger/10 text-danger text-[10px] font-mono leading-none tracking-wide font-bold">
                                {uploadErrorObj.code}
                              </code>
                            </h4>
                            
                            {/* Второстепенное: Почему это произошло */}
                            <p className="text-textPrimary text-sm leading-relaxed">
                              {uploadErrorObj.message}
                            </p>
                          </div>

                          {/* Вспомогательное: Как исправить (без вложенных карточек) */}
                          {uploadErrorObj.recommendation && (
                            <div className="text-textSecondary text-sm leading-relaxed flex items-start gap-2.5 mt-1">
                              <span className="shrink-0 mt-0.5 opacity-80 text-base leading-none">💡</span>
                              <div>
                                <strong className="text-textPrimary font-medium">Как исправить:</strong>{' '}
                                {uploadErrorObj.recommendation}
                              </div>
                            </div>
                          )}

                          {/* Действие: Что делать дальше (в естественном потоке чтения) */}
                          <div className="pt-3 mt-1 border-t border-danger/10">
                            <button
                              type="button"
                              onClick={resetWebGlUpload}
                              className="inline-flex items-center justify-center h-8 px-4 bg-surface-1 hover:bg-surface-2 border border-borderDef hover:border-textSecondary text-textPrimary text-xs font-medium rounded-control transition-all cursor-pointer shadow-sm active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 placeholder-textTertiary"
                            >
                              Повторить загрузку
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {(buildFormat === 'desktop' || buildFormat === 'both') && (
                  <div className={`flex flex-col gap-4 ${(buildFormat === 'both') ? 'pt-6 border-t border-borderDef/20' : ''}`}>
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 px-1">
                      <span className="text-sm font-semibold text-textPrimary">Скачиваемые билды</span>
                      <span className="text-xs font-mono text-textTertiary">Архивы до 2 ГБ</span>
                    </div>

                    <div className="flex flex-col gap-3">
                      {(['Windows', 'macOS', 'Linux'] as const).map(osName => {
                        const existingBuild = desktopFiles.find(f => f.os === osName);

                        return (
                          <div
                            key={osName}
                            className={`p-3.5 rounded-card transition-all flex flex-col gap-3 ${
                              existingBuild 
                                ? 'bg-surface-2 border border-borderDef shadow-sm' 
                                : 'bg-surface-1/20 border border-dashed border-borderDef hover:border-borderStrong hover:bg-surface-1/40'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex items-center gap-3.5 min-w-0">
                                <span className={`px-2.5 py-1 rounded-sm font-mono text-[10px] font-bold uppercase tracking-widest shrink-0 ${
                                  osName === 'Windows' 
                                    ? 'bg-blue-500/10 text-blue-400' 
                                    : osName === 'macOS' 
                                      ? 'bg-purple-500/10 text-purple-400'
                                      : 'bg-emerald-500/10 text-emerald-400'
                                }`}>
                                  {osName}
                                </span>

                                {existingBuild ? (
                                  <div className="flex items-baseline gap-2 min-w-0">
                                    <span className="font-sans font-medium text-textPrimary text-sm truncate max-w-[200px]">
                                      {existingBuild.name}
                                    </span>
                                    <span className="text-xs font-mono text-textTertiary shrink-0">({existingBuild.size})</span>
                                  </div>
                                ) : (
                                  <span className="text-sm text-textTertiary font-sans">Не прикреплена</span>
                                )}
                              </div>

                              {existingBuild ? (
                                jamPhase !== 'deadline_passed' && (
                                  <button
                                    type="button"
                                    onClick={() => setDesktopFiles(desktopFiles.filter(x => x.os !== osName))}
                                    className="p-1.5 text-textTertiary hover:text-danger hover:bg-danger/10 rounded-control transition-colors cursor-pointer shrink-0"
                                    aria-label={`Удалить билд для ${osName}`}
                                    title="Удалить сборку"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                )
                              ) : (
                                jamPhase !== 'deadline_passed' && (
                                  <label className="h-8 px-4 bg-surface-2 hover:bg-surface-3 border border-transparent hover:border-borderDef text-xs font-medium text-textPrimary rounded-control transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 shrink-0 whitespace-nowrap">
                                    <input
                                      type="file"
                                      accept={osName === 'Linux' ? '.zip,.tar.gz,.gz' : '.zip,.exe,.app'}
                                      className="hidden"
                                      onChange={(e) => {
                                        const f = e.target.files?.[0];
                                        if (f) {
                                          const mb = (f.size / (1024 * 1024)).toFixed(0) + ' MB';
                                          handleAddDesktopFile(osName, f.name, mb);
                                        }
                                      }}
                                    />
                                    Загрузить сборку
                                  </label>
                                )
                              )}
                            </div>

                            {existingBuild && (
                              <div className="pt-2 border-t border-borderDef/30 flex items-center justify-between text-caption font-sans">
                                <Checkbox
                                  checked={existingBuild.isDefault}
                                  onChange={() => toggleDesktopDefault(existingBuild.id)}
                                  label="Основной файл по умолчанию"
                                />
                                <span className="font-mono text-textTertiary font-bold">{existingBuild.versionTag}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {}
        {step === 2 && (
          <div className="flex flex-col gap-10 animate-fadeIn pt-2">
            {/* Main Form Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-start pt-4 border-t border-borderDef/30">
              
              {/* Left Column: Content */}
              <div className="flex flex-col justify-between gap-10 w-full">
                <div className="flex flex-col gap-8">
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-baseline px-1">
                      <label htmlFor="shortDesc" className="text-sm font-semibold text-textPrimary">
                        Краткое описание <span className="text-accent">*</span>
                      </label>
                      <span className="text-xs font-mono text-textTertiary">{shortDesc.length} / 200</span>
                    </div>
                    <textarea
                      id="shortDesc"
                      value={shortDesc}
                      onBlur={() => markTouched('shortDesc')}
                      onChange={e => setShortDesc(e.target.value.slice(0, 200))}
                      placeholder="Кратко опишите завязку сюжета и ключевую фичу..."
                      rows={3}
                      className={`w-full bg-surface-1/40 border ${
                        touchedFields.shortDesc && !checkReq3 ? 'border-danger' : 'border-borderDef hover:border-borderStrong focus:border-accent focus:bg-surface-2'
                      } text-sm text-textPrimary p-4 rounded-control outline-none font-sans resize-none transition-all shadow-sm placeholder-textTertiary`}
                    />
                    <span className="text-xs text-textSecondary px-1 leading-relaxed mt-0.5">
                      Сжатый обзор суть проекта для карточек витрины каталога.
                    </span>
                    {touchedFields.shortDesc && !checkReq3 && (
                      <span className="text-xs text-danger flex items-center gap-1.5 mt-0.5 px-1 font-medium">
                        <AlertTriangle className="w-3.5 h-3.5" /> Введите краткое описание (минимум 10 символов)
                      </span>
                    )}
                  </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-baseline px-1 pb-1">
                    <label htmlFor="contentMd" className="text-sm font-semibold text-textPrimary">
                      Подробное описание <span className="text-accent">*</span>
                    </label>
                    <div className="flex gap-1 text-[11px] font-mono font-medium bg-surface-1/40 p-1 rounded-md border border-borderDef/50 shadow-inner">
                      <button
                        type="button"
                        onClick={() => setEditorTab('write')}
                        className={`px-3 py-1 rounded cursor-pointer transition-all ${editorTab === 'write' ? 'bg-surface-3 text-textPrimary shadow-sm border border-borderDef/50' : 'text-textSecondary hover:text-textPrimary border border-transparent'}`}
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

                  {editorTab === 'write' ? (
                    <textarea
                      id="contentMd"
                      value={contentMd}
                      onBlur={() => markTouched('contentMd')}
                      onChange={e => setContentMd(e.target.value.slice(0, 5000))}
                      placeholder="### Сюжет&#10;Опишите лор вашей игры..."
                      rows={8}
                      className={`w-full bg-surface-1/40 border ${
                        touchedFields.contentMd && !checkReq4 ? 'border-danger' : 'border-borderDef hover:border-borderStrong focus:border-accent focus:bg-surface-2'
                      } text-sm text-textPrimary p-4 rounded-control outline-none font-sans leading-relaxed resize-y transition-all shadow-sm placeholder-textTertiary`}
                    />
                  ) : (
                    <div className="w-full bg-surface-2/40 p-4 rounded-control border border-borderDef/50 text-sm text-textSecondary min-h-[192px] leading-relaxed whitespace-pre-wrap">
                      {contentMd || <span className="italic text-textDisabled">Текст отсутствует</span>}
                    </div>
                  )}
                  <span className="text-xs text-textSecondary px-1 leading-relaxed mt-0.5">
                    Опишите сюжет, основные механики, особенности и историю создания игры (до 5000 символов).
                  </span>
                  {touchedFields.contentMd && !checkReq4 && (
                    <span className="text-xs text-danger flex items-center gap-1.5 mt-0.5 px-1 font-medium">
                      <AlertTriangle className="w-3.5 h-3.5" /> Заполните описание (минимум 20 символов)
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="warningsInput" className="text-sm font-semibold text-textPrimary px-1">Предупреждения и медицинские предостережения</label>
                  <input
                    id="warningsInput"
                    type="text"
                    value={warnings}
                    onChange={e => setWarnings(e.target.value.slice(0, 500))}
                    placeholder="Световые вспышки, клаустрофобия, резкие звуки"
                    className="w-full bg-surface-1/40 border border-borderDef hover:border-borderStrong focus:border-accent focus:bg-surface-2 text-sm text-textPrimary px-4 h-12 rounded-control outline-none transition-all shadow-sm placeholder-textTertiary"
                  />
                  <span className="text-xs text-textSecondary px-1 leading-relaxed mt-0.5">
                    Укажите предупреждения о контенте (напр.: вспышки света, эпилепсия, громкие звуки, сцены насилия).
                  </span>
                </div>
                </div>
              </div>

              {/* Right Column: Team & Tech */}
              <div className="flex flex-col gap-8 w-full bg-surface-1/20 rounded-modal p-6 lg:p-8 border border-borderDef">
                <div className="flex flex-col gap-4">
                  <label className="text-sm font-semibold text-textPrimary px-1">Формат авторства</label>

                  <div className="flex bg-surface-1/40 p-1 rounded-card border border-borderDef/50 shadow-inner">
                    <label className={`flex-1 h-10 px-3 text-sm font-medium rounded-control transition-all cursor-pointer flex items-center justify-center ${
                      teamMode === 'solo' 
                        ? 'bg-surface-3 text-textPrimary shadow-sm border border-borderDef font-bold' 
                        : 'text-textSecondary hover:text-textPrimary border border-transparent'
                    }`}>
                      <input
                        type="radio"
                        name="teamMode"
                        checked={teamMode === 'solo'}
                        onChange={() => setTeamMode('solo')}
                        className="hidden"
                      />
                      Соло
                    </label>
                    <label className={`flex-1 h-10 px-3 text-sm font-medium rounded-control transition-all cursor-pointer flex items-center justify-center ${
                      teamMode === 'team' 
                        ? 'bg-surface-3 text-textPrimary shadow-sm border border-borderDef font-bold' 
                        : 'text-textSecondary hover:text-textPrimary border border-transparent'
                    }`}>
                      <input
                        type="radio"
                        name="teamMode"
                        checked={teamMode === 'team'}
                        onChange={() => setTeamMode('team')}
                        className="hidden"
                      />
                      Команда
                    </label>
                  </div>

                  {teamMode === 'team' && (
                    <div className="flex flex-col gap-5 pt-3">
                      <div className="flex bg-surface-1/40 p-1 rounded-card border border-borderDef/50 shadow-inner">
                        <label className={`flex-1 h-10 px-3 text-xs font-medium rounded-control transition-all cursor-pointer flex items-center justify-center ${
                          teamSource === 'invite' 
                            ? 'bg-surface-3 text-textPrimary shadow-sm border border-borderDef font-bold' 
                            : 'text-textSecondary hover:text-textPrimary border border-transparent'
                        }`}>
                          <input
                            type="radio"
                            name="teamSource"
                            checked={teamSource === 'invite'}
                            onChange={() => setTeamSource('invite')}
                            className="hidden"
                          />
                          Соавторы (до 10 чел.)
                        </label>
                        <label className={`flex-1 h-10 px-3 text-xs font-medium rounded-control transition-all cursor-pointer flex items-center justify-center ${
                          teamSource === 'studio' 
                            ? 'bg-surface-3 text-textPrimary shadow-sm border border-borderDef font-bold' 
                            : 'text-textSecondary hover:text-textPrimary border border-transparent'
                        }`}>
                          <input
                            type="radio"
                            name="teamSource"
                            checked={teamSource === 'studio'}
                            onChange={() => setTeamSource('studio')}
                            className="hidden"
                          />
                          Студия / Команда
                        </label>
                      </div>

                      {teamSource === 'studio' ? (
                        <CustomSelect
                          size="xl"
                          variant="form"
                          value={selectedStudio}
                          onChange={setSelectedStudio}
                          placeholder="-- Выберите вашу зарегистрированную команду/студию --"
                          options={[
                            { value: 'void_labs', label: 'Void Labs Studio', sublabel: '3 участника' }
                          ]}
                        />
                      ) : (
                        <div className="flex flex-col gap-3">
                          <div className="relative" ref={coauthorSearchRef}>
                            <input
                              type="text"
                              value={coAuthorQuery}
                              onChange={e => {
                                setCoAuthorQuery(e.target.value);
                                setIsSearchDropdownOpen(e.target.value.trim().length > 0);
                              }}
                              placeholder="Введите никнейм (@alex_code) или email..."
                              className="w-full bg-surface-1/40 border border-borderDef hover:border-borderStrong focus:border-accent focus:bg-surface-2 text-sm text-textPrimary px-4 h-12 rounded-control outline-none transition-all shadow-sm placeholder-textTertiary"
                            />

                            {isSearchDropdownOpen && (
                              <div className="absolute left-0 right-0 top-full mt-2 bg-surface-3 border border-borderDef rounded-card shadow-elevation-overlay z-40 p-1.5 animate-fadeIn max-h-52 overflow-y-auto custom-scrollbar">
                                {MOCK_USERS.map(user => (
                                  <div
                                    key={user.id}
                                    onClick={() => {
                                      if (coAuthors.length >= 10) {
                                        triggerToast('Максимум 10 соавторов', 'danger');
                                        return;
                                      }
                                      if (!coAuthors.some(x => x.id === user.id)) {
                                        setCoAuthors([...coAuthors, { ...user, projectRole: "Соавтор" }]);
                                      }
                                      setCoAuthorQuery('');
                                      setIsSearchDropdownOpen(false);
                                    }}
                                    className="p-2.5 rounded-control flex items-center justify-between text-xs cursor-pointer hover:bg-surface-3 transition-colors"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="font-semibold text-textPrimary">{user.name}</span>
                                      <span className="font-mono text-textTertiary text-caption">{user.handle}</span>
                                    </div>
                                    <span className="text-accent font-semibold text-caption bg-accent/10 px-2 py-0.5 rounded">+ Добавить</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-2 mt-2">
                            {coAuthors.map(u => (
                              <div key={u.id} className="flex items-center justify-between text-sm bg-surface-2 p-3 rounded-control border border-borderDef/70 shadow-sm">
                                <span className="font-medium text-textPrimary">{u.name} <span className="text-textTertiary font-mono text-xs ml-1">({u.handle})</span></span>
                                <button
                                  type="button"
                                  onClick={() => setCoAuthors(coAuthors.filter(x => x.id !== u.id))}
                                  className="p-1.5 text-textTertiary hover:text-danger hover:bg-danger/10 rounded-control transition-colors cursor-pointer"
                                  aria-label={`Удалить соавтора ${u.name}`}
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 pt-2 border-t border-borderDef/20 mt-2">
                  <div className="flex justify-between items-baseline px-1">
                    <label htmlFor="controlsInput" className="text-sm font-semibold text-textPrimary">
                      Инструкция по управлению <span className="text-accent">*</span>
                    </label>
                  </div>
                  <textarea
                    id="controlsInput"
                    value={controls}
                    onBlur={() => markTouched('controls')}
                    onChange={e => setControls(e.target.value.slice(0, 1000))}
                    placeholder="WASD — Перемещение&#10;E — Взаимодействие"
                    rows={4}
                    className={`w-full bg-surface-1/40 border ${
                      touchedFields.controls && !checkReq5 ? 'border-danger' : 'border-borderDef hover:border-borderStrong focus:border-accent focus:bg-surface-2'
                    } text-sm text-textPrimary p-4 rounded-control outline-none font-sans resize-none transition-all shadow-sm placeholder-textTertiary`}
                  />
                  <span className="text-xs text-textSecondary px-1 leading-relaxed mt-0.5">
                    Укажите раскладку клавиш, поддерживаемые геймпады или интерактивные действия (напр.: WASD — передвижение, Пробел — прыжок).
                  </span>
                  {touchedFields.controls && !checkReq5 && (
                    <span className="text-xs text-danger flex items-center gap-1.5 mt-0.5 px-1 font-medium">
                      <AlertTriangle className="w-3.5 h-3.5" /> Введите инструкцию по управлению
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="projectUrlInput" className="text-sm font-semibold text-textPrimary px-1">Внешний URL-адрес проекта</label>
                  <input
                    id="projectUrlInput"
                    type="text"
                    value={projectUrl}
                    onChange={e => setProjectUrl(e.target.value)}
                    placeholder="https://github.com/myteam/game"
                    className="w-full bg-surface-1/40 border border-borderDef hover:border-borderStrong focus:border-accent focus:bg-surface-2 text-sm text-textPrimary px-4 h-12 rounded-control outline-none font-mono transition-all shadow-sm placeholder-textTertiary"
                  />
                  <span className="text-xs text-textSecondary px-1 leading-relaxed mt-0.5">
                    Ссылка на внешний репозиторий (GitHub/GitLab) или сайт проекта (необязательно).
                  </span>
                </div>
              </div>

            </div>
          </div>
        )}

        {}
        {step === 3 && (
          <div className="flex flex-col gap-10 animate-fadeIn pt-2">
            {/* Main Form Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-start pt-4 border-t border-borderDef/30">
              
              {/* Left Column: Visuals */}
              <div className="flex flex-col justify-between gap-10 w-full">
                <div className="flex flex-col gap-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-textPrimary px-1">
                      Обложка игры (16:9 / 4:3, до 2 МБ) <span className="text-accent">*</span>
                    </label>
                    {coverUrl ? (
                      <div className="relative aspect-[16/9] w-full rounded-control overflow-hidden border border-borderDef/50 shadow-sm">
                        <img src={coverUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setCoverUrl('')}
                          className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-danger text-white rounded-control transition-colors cursor-pointer backdrop-blur-sm"
                          aria-label="Удалить обложку"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => setCoverUrl('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22450%22%20viewBox%3D%220%200%20800%20450%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22bg%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%22100%25%22%20y2%3D%22100%25%22%3E%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%25230f172a%22%20%2F%3E%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%2523312e81%22%20%2F%3E%3C%2FlinearGradient%3E%3Cpattern%20id%3D%22grid%22%20width%3D%2240%22%20height%3D%2240%22%20patternUnits%3D%22userSpaceOnUse%22%3E%3Cpath%20d%3D%22M%2040%200%20L%200%200%200%2040%22%20fill%3D%22none%22%20stroke%3D%22%25234f46e5%22%20stroke-width%3D%221%22%20opacity%3D%220.3%22%2F%3E%3C%2Fpattern%3E%3C%2Fdefs%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22url(%2523bg)%22%20%2F%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22url(%2523grid)%22%20%2F%3E%3Ccircle%20cx%3D%22400%22%20cy%3D%22225%22%20r%3D%22100%22%20fill%3D%22%2523ec4899%22%20opacity%3D%220.8%22%20%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22240%22%20font-family%3D%22sans-serif%22%20font-size%3D%2248%22%20font-weight%3D%22bold%22%20fill%3D%22%2523fff%22%20text-anchor%3D%22middle%22%3ENEON%20RUN%3C%2Ftext%3E%3C%2Fsvg%3E')}
                        className="border-2 border-dashed border-borderDef/60 hover:border-accent bg-surface-1/40 hover:bg-surface-2 p-10 rounded-control text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 group shadow-sm"
                      >
                        <div className="w-12 h-12 rounded-full bg-surface-2 border border-borderDef/50 group-hover:border-accent group-hover:bg-accent/10 flex items-center justify-center text-textSecondary group-hover:text-accent transition-all shadow-sm">
                          <Upload className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-textPrimary">Загрузить обложку JPEG/PNG (до 2 МБ)</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="trailerUrl" className="text-sm font-semibold text-textPrimary px-1">Игровое видео или трейлер</label>
                    <input
                      id="trailerUrl"
                      type="text"
                      value={trailerUrl}
                      onChange={e => setTrailerUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=... или Vimeo"
                      className="w-full bg-surface-1/40 border border-borderDef hover:border-borderStrong focus:border-accent focus:bg-surface-2 text-sm text-textPrimary px-4 h-12 rounded-control outline-none transition-all shadow-sm placeholder-textTertiary"
                    />
                    <span className="text-xs text-textSecondary px-1 leading-relaxed mt-0.5">
                      Вставьте ссылку на трейлер или геймплей с YouTube или Vimeo.
                    </span>
                  </div>

                  <div className="flex flex-col gap-3 pt-2 border-t border-borderDef/20 mt-2">
                    <div className="flex justify-between items-baseline px-1">
                      <label className="text-sm font-semibold text-textPrimary">Галерея скриншотов <span className="text-textSecondary font-normal ml-1">(до 10 шт, до 2 МБ)</span></label>
                      <button type="button" onClick={handleAddGalleryImageSim} className="text-sm font-medium text-accent hover:text-accent/80 cursor-pointer transition-colors">+ Добавить</button>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {galleryImages.map((img, idx) => (
                        <div key={idx} className="relative aspect-video rounded-card overflow-hidden border border-borderDef/50 shadow-sm group">
                          <img src={img} alt="Screenshot" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                          <button
                            type="button"
                            onClick={() => setGalleryImages(galleryImages.filter((_, i) => i !== idx))}
                            className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-danger text-white rounded-md transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100 cursor-pointer"
                            aria-label="Удалить скриншот"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Meta */}
              <div className="flex flex-col gap-8 w-full bg-surface-1/20 rounded-modal p-6 lg:p-8 border border-borderDef">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-textPrimary px-1">
                    Жанры (от 1 до 5) <span className="text-accent">*</span>
                  </label>

                  <div className="relative" ref={genreSearchRef}>
                    <input
                      id="genreSearchQuery"
                      type="text"
                      value={genreSearchQuery}
                      onChange={e => {
                        setGenreSearchQuery(e.target.value);
                        setIsGenreDropdownOpen(true);
                      }}
                      onFocus={() => setIsGenreDropdownOpen(true)}
                      placeholder="Поиск жанров (Horror, Action)..."
                      className="w-full bg-surface-1/40 border border-borderDef hover:border-borderStrong focus:border-accent focus:bg-surface-2 text-sm text-textPrimary px-4 h-12 rounded-control outline-none transition-all shadow-sm placeholder-textTertiary"
                    />

                    {isGenreDropdownOpen && (
                      <div className="absolute left-0 right-0 top-full mt-2 bg-surface-3 border border-borderDef/70 rounded-control shadow-elevation-overlay z-40 max-h-56 overflow-y-auto custom-scrollbar p-1.5 animate-fadeIn">
                        {ALL_GENRES.filter(g => g.toLowerCase().includes(genreSearchQuery.toLowerCase())).map(genre => {
                          const isSelected = selectedGenres.includes(genre);
                          return (
                            <div
                              key={genre}
                              onClick={() => {
                                toggleGenre(genre);
                                setIsGenreDropdownOpen(false);
                                setGenreSearchQuery('');
                              }}
                              className={`p-3 rounded-control text-sm cursor-pointer transition-all flex items-center justify-between ${
                                isSelected 
                                  ? 'bg-accent/10 text-accent font-semibold' 
                                  : 'text-textPrimary hover:bg-surface-4'
                              }`}
                            >
                              <span>{genre}</span>
                              {isSelected && <Check className="w-4 h-4 text-accent"  strokeWidth={2.5} />}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedGenres.map(g => (
                      <span key={g} className="bg-surface-2 border border-borderDef/70 text-textPrimary text-sm px-3 py-1.5 rounded-control flex items-center gap-2 font-medium shadow-sm">
                        {g}
                        <button
                          type="button"
                          onClick={() => toggleGenre(g)}
                          className="text-textSecondary hover:text-danger cursor-pointer"
                          aria-label={`Удалить жанр ${g}`}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2 border-t border-borderDef/20">
                  <label htmlFor="tagInput" className="text-sm font-semibold text-textPrimary px-1">Теги проекта (до 10)</label>
                  <input
                    id="tagInput"
                    type="text"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Введите тег и нажмите Enter..."
                    className="w-full bg-surface-1/40 border border-borderDef hover:border-borderStrong focus:border-accent focus:bg-surface-2 text-sm text-textPrimary px-4 h-12 rounded-control outline-none font-mono transition-all shadow-sm placeholder-textTertiary"
                  />

                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((t, idx) => (
                      <span key={idx} className="bg-surface-2 border border-borderDef/70 text-sm font-mono text-textSecondary px-3 py-1.5 rounded-control flex items-center gap-2 shadow-sm">
                        #{t}
                        <button
                          type="button"
                          onClick={() => setTags(tags.filter((_, i) => i !== idx))}
                          className="text-textSecondary hover:text-danger cursor-pointer"
                          aria-label="Удалить тег"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2 border-t border-borderDef/20">
                  <label htmlFor="statusSelect" className="text-sm font-semibold text-textPrimary px-1">Статус проекта <span className="text-accent">*</span></label>
                  <CustomSelect
                    size="xl"
                    variant="form"
                    id="statusSelect"
                    value={projectStatus}
                    onChange={setProjectStatus}
                    options={[
                      { value: "Prototype", label: "Прототип", sublabel: "Рекомендуется для джемов" },
                      { value: "In Development", label: "В разработке" },
                      { value: "Released", label: "Выпущено" },
                      { value: "On Hold", label: "На паузе" },
                      { value: "Canceled", label: "Отменено" }
                    ]}
                  />
                </div>
              </div>

            </div>
          </div>
        )}

        {}
        {step === 4 && (
          <div className="flex flex-col gap-10 animate-fadeIn pt-2">
            {/* Main Form Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-start pt-4 border-t border-borderDef/30">
              
              {/* Left Column: Tech & Meta */}
              <div className="flex flex-col justify-between gap-10 w-full">
                <div className="flex flex-col gap-8">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-baseline px-1">
                      <label htmlFor="themeText" className="text-sm font-semibold text-textPrimary">
                        Раскрытие темы «Забытые Технологии» <span className="text-accent">*</span>
                      </label>
                    </div>
                    <textarea
                      id="themeText"
                      value={themeInterpretation}
                      onBlur={() => markTouched('themeInterpretation')}
                      onChange={e => setThemeInterpretation(e.target.value.slice(0, 1000))}
                      rows={5}
                      placeholder="Расскажите жюри, как именно ваша игра раскрывает тему джема..."
                      className={`w-full bg-surface-1/40 border ${
                        touchedFields.themeInterpretation && !checkReq8 ? 'border-danger' : 'border-borderDef hover:border-borderStrong focus:border-accent focus:bg-surface-2'
                      } text-sm text-textPrimary p-4 rounded-control outline-none font-sans leading-relaxed resize-none transition-all shadow-sm placeholder-textTertiary`}
                    />
                    <span className="text-xs text-textSecondary px-1 leading-relaxed mt-0.5">
                      Объясните, как ваша игра раскрывает тему джема (до 1000 символов).
                    </span>
                    {touchedFields.themeInterpretation && !checkReq8 && (
                      <span className="text-xs text-danger flex items-center gap-1.5 mt-0.5 px-1 font-medium">
                        <AlertTriangle className="w-3.5 h-3.5" /> Заполните описание темы (минимум 10 символов)
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="engineSelect" className="text-sm font-semibold text-textPrimary px-1">Использованный движок</label>
                    <CustomSelect
                      size="xl"
                      variant="form"
                      id="engineSelect"
                      value={engineUsed}
                      onChange={setEngineUsed}
                      options={[
                        { value: "Unity", label: "Unity" },
                        { value: "Unreal Engine", label: "Unreal Engine" },
                        { value: "Godot", label: "Godot" },
                        { value: "Custom HTML5/JS", label: "Custom Three.js / JS" }
                      ]}
                    />
                  </div>

                  <div className="pt-2 px-1">
                    <Checkbox
                      checked={hasThirdPartyAssets}
                      onChange={setHasThirdPartyAssets}
                      label="Использование сторонних готовых ассетов (Third-party assets)"
                    />
                  </div>

                  <div className="flex flex-col gap-2 pt-2 border-t border-borderDef/20 mt-2">
                    <label htmlFor="submissionNotes" className="text-sm font-semibold text-textPrimary px-1">Заметки для организаторов</label>
                    <textarea
                      id="submissionNotes"
                      value={submissionNotes}
                      onChange={e => setSubmissionNotes(e.target.value.slice(0, 2000))}
                      rows={4}
                      placeholder="Дополнительные примечания для жюри или организаторов (опционально)..."
                      className="w-full bg-surface-1/40 border border-borderDef hover:border-borderStrong focus:border-accent focus:bg-surface-2 text-sm text-textPrimary p-4 rounded-control outline-none font-sans leading-relaxed resize-none transition-all shadow-sm placeholder-textTertiary"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Pre-Flight Checklist Summary Hub */}
              <div className={`flex flex-col gap-8 w-full bg-surface-1/20 rounded-modal p-6 lg:p-8 border transition-colors ${summaryShake ? 'animate-shake border-danger' : 'border-borderDef'}`}>
                <div className="flex items-center justify-between px-1">
                  <span className="text-body-lg font-bold text-textPrimary flex items-center">
                    Чек-лист готовности <span className="text-textSecondary text-sm ml-2 font-mono">({completedCount}/8)</span>
                  </span>
                  <span className={`text-sm font-mono font-bold px-3 py-1 rounded-full ${isAllReady ? 'bg-success/20 text-success' : 'bg-surface-3 text-textSecondary'}`}>
                    {completionPercent}%
                  </span>
                </div>

                <div className="flex flex-col gap-2.5">
                  {[
                    { id: 'title', label: 'Заголовок проекта', isValid: checkReq1, stepNum: 1, fieldId: 'gameTitle' },
                    { id: 'build', label: 'Файлы сборки (WebGL / Desktop)', isValid: checkReq2, stepNum: 1, fieldId: 'gameTitle' },
                    { id: 'shortDesc', label: 'Краткое описание', isValid: checkReq3, stepNum: 2, fieldId: 'shortDesc' },
                    { id: 'contentMd', label: 'Подробное описание', isValid: checkReq4, stepNum: 2, fieldId: 'contentMd' },
                    { id: 'controls', label: 'Управление', isValid: checkReq5, stepNum: 2, fieldId: 'controlsInput' },
                    { id: 'cover', label: 'Обложка игры (16:9)', isValid: checkReq6, stepNum: 3, fieldId: 'coverUrl' },
                    { id: 'genres', label: 'Жанры игры', isValid: checkReq7, stepNum: 3, fieldId: 'genreSearchQuery' },
                    { id: 'theme', label: 'Раскрытие темы джема', isValid: checkReq8, stepNum: 4, fieldId: 'themeText' }
                  ].map(item => (
                    <div
                      key={item.id}
                      onClick={() => jumpToField(item.stepNum, item.fieldId)}
                      className="p-3.5 rounded-control text-sm flex items-center justify-between cursor-pointer bg-surface-1/40 hover:bg-surface-2 border border-borderDef/70 hover:border-borderStrong transition-all shadow-sm group"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shadow-sm transition-colors ${
                          item.isValid ? "bg-success text-surface-0" : "bg-danger text-white"
                        }`}>
                          {item.isValid ? "✓" : "!"}
                        </span>
                        <span className={`font-medium transition-colors ${item.isValid ? "text-textPrimary" : "text-textSecondary group-hover:text-textPrimary"}`}>{item.label}</span>
                      </div>
                      <span className="text-[11px] font-mono text-textTertiary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Перейти <ChevronRight className="w-3.5 h-3.5" /></span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-borderDef/20">
                  <Checkbox
                    checked={isRulesAgreed}
                    onChange={setIsRulesAgreed}
                    label="Я подтверждаю соответствие игры всем правилам и регламенту Broken Worlds Jam"
                  />
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 h-16 md:h-[88px] bg-surface-0/95 backdrop-blur-xl border-t border-borderDef z-30 flex items-center justify-between px-4 md:px-8">
        <div className="max-w-[1200px] mx-auto w-full flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(prev => prev - 1)}
                className="h-11 sm:h-12 px-3.5 sm:px-5 text-xs sm:text-sm font-medium text-textSecondary hover:text-textPrimary bg-surface-1/40 hover:bg-surface-2 border border-borderDef/70 rounded-card transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer shadow-sm touch-manipulation active:scale-[0.98]"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Назад</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleSaveDraft}
              className="h-11 sm:h-12 px-4 sm:px-5 text-xs sm:text-sm font-medium text-textSecondary hover:text-textPrimary bg-surface-1/40 hover:bg-surface-2 border border-borderDef/70 rounded-card transition-all hidden sm:flex items-center gap-2 cursor-pointer shadow-sm touch-manipulation active:scale-[0.98]"
            >
              <Save className="w-4 h-4" />
              <span>Сохранить черновик</span>
            </button>
            <a
              href="#/jams"
              className="h-11 sm:h-12 px-3 sm:px-4 text-xs sm:text-sm font-medium text-textSecondary hover:text-danger flex items-center gap-1 transition-colors ml-1"
            >
              <span>Отмена</span>
            </a>
          </div>

          {step === 4 ? (
            <button
              type="button"
              onClick={handleSubmit}
              className={`h-11 sm:h-12 px-5 sm:px-8 rounded-card text-xs sm:text-sm font-bold uppercase tracking-wide flex items-center gap-2 sm:gap-2.5 transition-all touch-manipulation active:scale-[0.98] ${
                isAllReady && isRulesAgreed
                  ? 'bg-accent hover:bg-accent/90 text-white shadow-elevation-raised cursor-pointer'
                  : 'bg-surface-1/20 text-textDisabled border border-borderDef/40 cursor-not-allowed'
              }`}
            >
              <Check className="w-4 h-4 stroke-[3]"  strokeWidth={2.5} />
              <span>{userRole === 'submitted' ? 'Обновить' : 'Подать игру'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && !title.trim()) {
                  markTouched('title');
                  triggerToast('Введите заголовок игры', 'danger');
                  return;
                }
                setStep(prev => Math.min(4, prev + 1));
              }}
              className="h-11 sm:h-12 px-6 sm:px-8 bg-accent hover:bg-accent/90 text-white text-xs sm:text-sm font-bold uppercase tracking-wide rounded-card flex items-center gap-2 transition-all cursor-pointer shadow-sm touch-manipulation active:scale-[0.98]"
            >
              <span>Далее</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {}
      {/* MODAL: 2-STEP JAM REGISTRATION */}
      {isNotRegModalOpen && (
        <div className="fixed inset-0 z-modal bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-2 border border-borderDef rounded-modal max-w-md w-full p-6 animate-modal flex flex-col gap-4 text-xs shadow-elevation-overlay">
            <div className="flex items-center justify-between border-b border-borderDef pb-3">
              <span className="font-bold text-sm text-textPrimary">Регистрация в джеме (Шаг {regModalStep} из 2)</span>
              <button
                type="button"
                onClick={() => { setIsNotRegModalOpen(false); setRegModalStep(1); }}
                className="touch-target text-textSecondary hover:text-white"
                aria-label="Закрыть окно"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {regModalStep === 1 ? (
              <p className="text-textSecondary leading-relaxed">
                Для подачи игры вы должны быть предварительно зарегистрированы как участник Broken Worlds Jam. Вы хотите зарегистрироваться сейчас?
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                <p className="text-textSecondary leading-relaxed">
                  Подтвердите ваше согласие с регламентом проведения джема и участием в номинациях.
                </p>
                <label className="flex items-center gap-2 text-textPrimary">
                  <input type="checkbox" defaultChecked className="accent-accent" />
                  <span>Я принимаю правила Broken Worlds Jam</span>
                </label>
              </div>
            )}

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => { setIsNotRegModalOpen(false); setRegModalStep(1); }}
                className="px-4 h-11 bg-surface-2 hover:bg-surface-3 border border-borderDef rounded-card text-textSecondary"
              >
                Отмена
              </button>
              {regModalStep === 1 ? (
                <button
                  type="button"
                  onClick={() => setRegModalStep(2)}
                  className="px-5 h-11 bg-accent hover:bg-accent/90 text-white font-extrabold rounded-card"
                >
                  Далее
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setUserRole('registered');
                    setIsNotRegModalOpen(false);
                    setRegModalStep(1);
                    triggerToast('Вы успешно зарегистрированы в джеме!', 'success');
                  }}
                  className="px-5 h-11 bg-accent hover:bg-accent/90 text-white font-extrabold rounded-card"
                >
                  Завершить регистрацию
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REVOKE SUBMISSION CONFIRMATION */}
      <ConfirmActionModal
        isOpen={isRevokeModalOpen}
        onClose={() => setIsRevokeModalOpen(false)}
        title="Отозвать сабмит джема"
        description="Вы уверены, что хотите отозвать работу с Broken Worlds Jam? Игра останется в вашем кабинете авторов как обычный черновик, но выйдет из списка участников джема."
        confirmText="Отозвать сабмит"
        onConfirm={handleRevokeSubmit}
        isDestructive={true}
      />

      {/* TOAST NOTIFICATIONS */}
      {toast.show && (
        <Toast message={toast.text} type={toast.type as any} position="bottom-left" />
      )}

      {/* DEV MATRIX CONTROL PANEL */}
      <DevMatrixPanel 
        bottomOffsetClass="bottom-36 md:bottom-0"
        pageName="Подача игры"
        fields={[
          {
            id: 'webglTestScenario',
            label: 'Тесты загрузчика WebGL',
            type: 'select',
            value: uploadState === 'SUCCESS' ? 'success' : uploadErrorObj?.code ? uploadErrorObj.code.toLowerCase() : 'idle',
            onChange: (val: string) => {
              if (val === 'idle') {
                resetWebGlUpload();
              } else if (val === 'success') {
                processWebGlFileUpload('valid_webgl_build.zip', 44564480, 'success');
              } else if (val === 'missing_root') {
                processWebGlFileUpload('invalid_no_index.zip', 12000000, 'missing_root');
              } else if (val === 'nested_dir') {
                processWebGlFileUpload('nested_folder.zip', 35000000, 'nested_dir');
              } else if (val === 'too_large') {
                processWebGlFileUpload('huge_game.zip', 1500000000, 'too_large');
              } else if (val === 'network_error') {
                processWebGlFileUpload('unstable_net.zip', 80000000, 'network_error');
              }
            },
            highlight: true,
            options: [
              { value: 'idle', label: 'IDLE (Файл не выбран)' },
              { value: 'success', label: '✓ Успех 200 OK (index.html в корне)' },
              { value: 'missing_root', label: '✗ Нет index.html (MISSING_INDEX_HTML)' },
              { value: 'nested_dir', label: '⚠ Вложенная папка (NESTED_DIRECTORY_STRUCTURE)' },
              { value: 'too_large', label: '✗ Файл > 1024 МБ (FILE_TOO_LARGE)' },
              { value: 'network_error', label: '⚡ Сбой сети (504 Timeout)' }
            ]
          },
          {
            id: 'userRole',
            label: 'Роль / Статус сабмита',
            type: 'select',
            value: userRole,
            onChange: setUserRole,
            options: [
              { value: 'registered', label: 'Участник (Registered)' },
              { value: 'not_registered', label: 'Не зарегистрирован' },
              { value: 'submitted', label: 'Работа отправлена (Submitted)' }
            ]
          },
          {
            id: 'jamPhase',
            label: 'Фаза джема',
            type: 'select',
            value: jamPhase,
            onChange: setJamPhase,
            options: [
              { value: 'submission_open', label: 'Прием работ открыт' },
              { value: 'deadline_passed', label: 'Дедлайн прошел' }
            ]
          }
        ]}
      />

    </div>
  );
}