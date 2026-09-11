import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import ReactDOM from 'react-dom';
import DevMatrixPanel from '../components/DevMatrixPanel';
import FontStyles from '../components/ui/FontStyles';
import Button from '../components/ui/Button';
import { CustomSelect } from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import SegmentedControl from '../components/ui/SegmentedControl';
import Toast from '../components/ui/Toast';
import {
  Search, X, ChevronDown, ChevronRight, Check, Info,
  Terminal, Sliders, Keyboard, Trophy, Clock, Lock, Star,
  Monitor, ShieldCheck, Download, Play, AlertTriangle, ShieldAlert,
  RotateCw, ExternalLink, Maximize2, Target, Flag, BookOpen,
  MessageSquare, Globe, FileText, Inbox, Layers, CheckCircle2,
  Cpu, Sparkles, User, ArrowRight, CornerDownRight, Shield, RefreshCw,
  SlidersHorizontal, Award, Tag, Gamepad2
} from 'lucide-react';

// ─── MOCK DATA ──────────────────────────────────────────────────────────────

const MOCK_JAMS = [
  {
    id: "indie-jam-2026",
    slug: "indie-jam-2026",
    title: "Cyberpunk Indie Jam 2026",
    total_assigned: 20,
    evaluated_count: 14,
    deadline_formatted: "2д 14ч 30м",
    is_locked: false,
    criteria: [
      { key: "gameplay", label: "Геймплей и Динамика", weight: 0.30, description: "Отклик управления, увлекательность игровой петли, баланс." },
      { key: "theme", label: "Соответствие Теме", weight: 0.25, description: "Насколько оригинально и глубоко раскрыта тема джема." },
      { key: "graphics", label: "Визуальный Стиль", weight: 0.20, description: "Арт-дирекшн, качество графики, анимаций и интерфейса." },
      { key: "sound", label: "Звук и Музыка", weight: 0.15, description: "Атмосферность звукового сопровождения и эффектов." },
      { key: "originality", label: "Инновационность", weight: 0.10, description: "Новизна механик, эксперименты и уникальные идеи." }
    ]
  },
  {
    id: "retro-jam-2026",
    slug: "retro-jam-2026",
    title: "Retro Pixel Jam 2026",
    total_assigned: 12,
    evaluated_count: 8,
    deadline_formatted: "5д 08ч 10м",
    is_locked: false,
    criteria: [
      { key: "gameplay", label: "Ретро-Геймплей", weight: 0.40, description: "Аутентичность классических аркадных механик." },
      { key: "graphics", label: "Пиксель-арт", weight: 0.30, description: "Стилистика 8/16-bit палитры и спрайтов." },
      { key: "sound", label: "Чиптюн звук", weight: 0.30, description: "Синтезированные эффекты и 8-битный саундтрек." }
    ]
  }
];

const MOCK_SUBMISSIONS = [
  {
    submission_id: "SUB-9012",
    jam_id: "indie-jam-2026",
    status: "draft",
    category: "Main Track",
    platform: "webgl",
    webgl_build: {
      url: "https://example.com/webgl-demo",
      version: "v1.0.0",
      size_formatted: "24 МБ",
      uploaded_at: "2026-08-01 18:00"
    },
    game: {
      id: "game-402",
      title: "Cyber Quest: Vector Run",
      slug: "cyber-quest-vector-run",
      cover_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop",
      developer: {
        id: "usr-12",
        name: "AlexDev / CyberPulse Studio",
        type: "team",
        slug: "cyberpulse-studio",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=cyberpulse"
      },
      controls_description: "WASD — передвижение, Пробел — прыжок/рывок, ЛКМ — атака. Поддерживаются геймпады Xbox/DualSense.",
      assets_description: "Спрайты и 3D-модели авторские. Музыка от Karl Casey @ White Bat Audio (CC-BY 4.0).",
    },
    builds: [
      { type: "webgl", url: "https://example.com/webgl-demo" },
      { type: "windows", os: "Windows (x64 .exe)", size: "240 MB" }
    ],
    my_evaluation: {
      status: "draft",
      scores: { gameplay: 4.5, theme: 5.0, graphics: 4.0, sound: 3.5, originality: 4.5 },
      weighted_score: 4.35,
      jury_comment: "Отличный неоновый раннер! Физика прыжков ощущается очень отзывчиво, арт-дирекшн прекрасно попадает в атмосферу джема.",
      is_private: false,
      updated_at: "16:42"
    },
    is_conflict_of_interest: false,
    is_locked: false
  },
  {
    submission_id: "SUB-9013",
    jam_id: "indie-jam-2026",
    status: "pending",
    category: "Main Track",
    platform: "webgl",
    webgl_build: {
      url: "https://example.com/webgl-demo-2",
      version: "v1.0.1",
      size_formatted: "18 МБ",
      uploaded_at: "2026-08-02 12:30"
    },
    game: {
      id: "game-403",
      title: "BrokenLore: Echoes",
      slug: "brokenlore-echoes",
      cover_url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1000&auto=format&fit=crop",
      developer: {
        id: "usr-44",
        name: "Nocturnal Devs",
        type: "team",
        slug: "nocturnal-devs",
        avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=nocturnal"
      },
      controls_description: "Стрелки — перемещение персонажа. Мышь — исследование улик.",
      assets_description: "Звуковые эффекты записаны самостоятельно. Использованы открытые шрифты JetBrains Mono.",
    },
    builds: [
      { type: "webgl", url: "https://example.com/webgl-demo-2" }
    ],
    my_evaluation: null,
    is_conflict_of_interest: false,
    is_locked: false
  },
  {
    submission_id: "SUB-9014",
    jam_id: "indie-jam-2026",
    status: "completed",
    category: "Innovation",
    platform: "desktop",
    webgl_build: null,
    game: {
      id: "game-404",
      title: "Quantum Tactics",
      slug: "quantum-tactics",
      cover_url: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1000&auto=format&fit=crop",
      developer: {
        id: "usr-99",
        name: "Alex_Code",
        type: "user",
        slug: "alex_code",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop"
      },
      controls_description: "Клик по квантовому полю для расщепления вероятностей.",
      assets_description: "Свободные от лицензионных отчислений ассеты из OpenGameArt.",
    },
    builds: [
      { type: "windows", os: "Windows x64 (.exe)", size: "320 MB" },
      { type: "macOS", os: "macOS Apple Silicon (.dmg)", size: "340 MB" },
      { type: "linux", os: "Linux (.AppImage)", size: "310 MB" }
    ],
    my_evaluation: {
      status: "completed",
      scores: { gameplay: 5.0, theme: 4.5, graphics: 4.5, sound: 4.0, originality: 5.0 },
      weighted_score: 4.65,
      jury_comment: "Потрясающая работа с технической механикой квантового расщепления ходов!",
      is_private: true,
      updated_at: "Вчера, 19:15"
    },
    is_conflict_of_interest: false,
    is_locked: false
  },
  {
    submission_id: "SUB-9015",
    jam_id: "indie-jam-2026",
    status: "pending",
    category: "Main Track",
    platform: "webgl",
    webgl_build: {
      url: "https://example.com/webgl-demo-coi",
      version: "v1.0.0",
      size_formatted: "30 МБ",
      uploaded_at: "2026-08-03 09:00"
    },
    game: {
      id: "game-405",
      title: "My Own Dev Game (COI Test)",
      slug: "my-own-dev-game",
      cover_url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1000&auto=format&fit=crop",
      developer: {
        id: "usr-my-id",
        name: "Jury Member (You)",
        type: "user",
        slug: "jury-member",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop"
      },
      controls_description: "Инструкции отсутствуют.",
      assets_description: "Все ассеты авторские.",
    },
    builds: [{ type: "webgl", url: "https://example.com/webgl-demo-coi" }],
    my_evaluation: null,
    is_conflict_of_interest: true,
    is_locked: false
  }
];

// CustomSelect and Modal imported from UI Kit

// ─── JURY PROGRESS WIDGET ───────────────────────────────────────────────────

const JuryProgressWidget = ({ evaluated, total }: { evaluated: number; total: number }) => {
  const percentage = Math.round((evaluated / total) * 100) || 0;
  const radius = 12;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className="flex items-center gap-3 bg-surface-2 border border-borderDef hover:border-accent/40 px-3 py-1.5 rounded-xl shadow-sm transition-all group select-none shrink-0 h-9"
      title={`Прогресс судейства: ${evaluated} из ${total} (${percentage}%)`}
    >
      <div className="relative w-6 h-6 flex items-center justify-center shrink-0">
        <svg
          className="w-6 h-6 -rotate-90 transform shrink-0 block"
          viewBox="0 0 32 32"
          style={{ aspectRatio: '1/1' }}
        >
          <circle
            cx="16"
            cy="16"
            r={radius}
            className="stroke-surface-3"
            strokeWidth="3"
            fill="transparent"
          />
          <circle
            cx="16"
            cy="16"
            r={radius}
            className="stroke-accent transition-all duration-700 ease-out"
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
      </div>

      <div className="flex items-center gap-2 font-mono text-caption">
        <span className="text-caption uppercase tracking-wider text-textTertiary font-bold">Оценено</span>
        <span className="text-textPrimary font-bold">
          <span className="text-accent">{evaluated}</span> / {total}
        </span>
        <span className="text-caption text-success font-semibold bg-success/10 px-1.5 py-0.5 rounded-lg">
          {percentage}%
        </span>
      </div>
    </div>
  );
};

// ─── TESTING WORKSPACE ──────────────────────────────────────────────────────

const TestingWorkspace = ({ submission, onOpenAbuseModal, triggerToast }: {
  submission: any;
  onOpenAbuseModal: (reason: string) => void;
  triggerToast: (message: string, type?: string) => void;
}) => {
  const [playerState, setPlayerState] = useState<'idle' | 'loading' | 'active' | 'error' | 'context_lost'>('idle');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isInputCaptured, setIsInputCaptured] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  const playerContainerRef = useRef<HTMLDivElement>(null);
  const loadingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setPlayerState('idle');
    setLoadingProgress(0);
    setIsInputCaptured(false);
    if (loadingTimerRef.current) clearInterval(loadingTimerRef.current);
  }, [submission.submission_id]);

  const handleStartLaunch = () => {
    setPlayerState('loading');
    setLoadingProgress(5);

    let current = 5;
    loadingTimerRef.current = setInterval(() => {
      current += Math.floor(Math.random() * 20) + 10;
      if (current >= 100) {
        current = 100;
        if (loadingTimerRef.current) clearInterval(loadingTimerRef.current);
        setTimeout(() => {
          setPlayerState('active');
        }, 300);
      }
      setLoadingProgress(current);
    }, 180);
  };

  const handleCancelLoading = () => {
    if (loadingTimerRef.current) clearInterval(loadingTimerRef.current);
    setPlayerState('idle');
    setLoadingProgress(0);
  };

  const handleRestartPlayer = () => {
    setIframeKey(k => k + 1);
    triggerToast("Перезапуск WebGL-плеера... Введенные оценки сохранены", "info");
  };

  const handleToggleFullscreen = () => {
    if (!playerContainerRef.current) return;

    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(() => {
        setIsFullscreen(true);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(() => {
        setIsFullscreen(false);
      });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isInputCaptured && playerState === 'active') {
        const blockedKeys = ["Space", "ArrowUp", "ArrowDown", "PageUp", "PageDown"];
        if (blockedKeys.includes(e.code)) {
          e.preventDefault();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isInputCaptured, playerState]);

  if (submission.platform !== 'webgl') {
    return (
      <div className="space-y-3 p-5 bg-surface-1 border border-borderDef rounded-[10px]">
        <div className="flex items-center justify-between text-caption font-mono text-textTertiary">
          <span className="uppercase tracking-wider flex items-center gap-2 font-bold text-textPrimary">
            <Monitor className="w-4 h-4 text-accent shrink-0" /> Скачиваемые Desktop-дистрибутивы
          </span>
          <span className="text-caption text-success font-semibold flex items-center gap-1.5 px-2 py-0.5 bg-success/10 rounded-lg">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" /> Файлы проверены ClamAV
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 pt-1">
          {submission.builds.map((build: any, idx: number) => (
            <div key={idx} className="p-4 bg-surface-2 border border-borderDef rounded-xl flex items-center justify-between gap-3 shadow-sm hover:border-borderStrong transition-all">
              <div className="space-y-1">
                <h4 className="text-caption font-bold text-textPrimary font-mono flex items-center gap-2">
                  <span>{build.os || build.type}</span>
                </h4>
                <p className="text-caption text-textTertiary font-mono">{build.size || "240 MB"}</p>
              </div>
              <button
                onClick={() => triggerToast(`Загрузка дистрибутива ${build.os}...`, "success")}
                aria-label={`Скачать билд для ${build.os || build.type}`}
                className="px-3.5 py-2 bg-surface-3 hover:bg-surface-3 border border-borderDef text-textPrimary rounded-xl text-caption font-mono font-bold flex items-center gap-2 transition-colors cursor-pointer hover:border-accent/50"
              >
                <Download className="w-3.5 h-3.5 text-accent shrink-0" /> Скачать
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {/* 16:9 CINEMA WEBGL PLAYER CONTAINER */}
      <div
        ref={playerContainerRef}
        className={`relative bg-surface-0 border border-borderDef rounded-[10px] overflow-hidden aspect-video w-full flex flex-col justify-between shadow-2xl group ${isFullscreen ? 'fixed inset-0 z-50 rounded-none w-screen h-screen' : ''
          }`}
        style={isFullscreen ? { aspectRatio: 'unset' } : {}}
      >
        {/* STATE 1: PRE-LAUNCH BANNER */}
        {playerState === 'idle' && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
            <img
              src={submission.game.cover_url}
              alt=""
              className="absolute inset-0 w-full h-full object-cover blur-xl opacity-30 scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-0 via-surface-0/80 to-transparent" />

            <div className="relative z-20 space-y-4 max-w-md">
              <div className="w-16 h-16 rounded-[14px] bg-surface-2/80 border border-borderDef p-2 mx-auto shadow-2xl backdrop-blur-md">
                <img src={submission.game.cover_url} alt="" className="w-full h-full object-cover rounded-[10px]" />
              </div>

              <div className="space-y-1">
                <h3 className="text-body-lg sm:text-heading-3 font-extrabold text-textPrimary tracking-tight">{submission.game.title}</h3>
                <p className="text-caption text-textTertiary font-mono">
                  WebGL Build • {submission.webgl_build?.version || "v1.0.0"} • {submission.webgl_build?.size_formatted || "24 МБ"}
                </p>
              </div>

              <button
                onClick={handleStartLaunch}
                className="px-6 py-3 bg-accent hover:bg-accent-hover text-white font-mono font-extrabold text-overline  tracking-wider rounded-xl shadow-2xl flex items-center gap-2.5 mx-auto transition-transform hover:scale-105 cursor-pointer active:scale-95"
              >
                <Play className="w-4 h-4 fill-current shrink-0" />
                <span>Запустить WebGL в браузере</span>
              </button>
            </div>
          </div>
        )}

        {/* STATE 2: ASSET LOADING STATE */}
        {playerState === 'loading' && (
          <div className="absolute inset-0 z-10 bg-surface-0 flex flex-col items-center justify-center p-6 text-center space-y-5 font-mono select-none">
            <div className="space-y-3 max-w-xs w-full">
              <div className="flex items-center justify-between text-caption">
                <span className="text-textSecondary font-bold">Инициализация WebGL...</span>
                <span className="text-accent font-mono font-bold">{loadingProgress}%</span>
              </div>
              <div className="w-full h-2 bg-surface-2 border border-borderDef rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-150 shadow-sm"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
            </div>

            <button
              onClick={handleCancelLoading}
              className="text-textTertiary hover:text-textPrimary text-caption underline transition-colors cursor-pointer"
            >
              Отмена
            </button>
          </div>
        )}

        {/* STATE 3: ACTIVE TESTING IFRAME */}
        {playerState === 'active' && (
          <iframe
            key={iframeKey}
            title={submission.game.title}
            src="about:blank"
            sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms"
            allow="fullscreen; autoplay; gamepad; acceleration; gyroscope"
            className="w-full h-full bg-black border-none"
          />
        )}

        {/* ERROR OVERLAY */}
        {playerState === 'error' && (
          <div className="absolute inset-0 z-10 bg-surface-1 p-6 flex flex-col items-center justify-center text-center space-y-3 font-sans">
            <AlertTriangle className="w-8 h-8 text-danger mx-auto shrink-0" />
            <div className="space-y-1 max-w-md">
              <h3 className="text-body-sm font-bold text-textPrimary">Сборка WebGL не запускается</h3>
              <p className="text-caption text-textSecondary">Файл поврежден или не содержит index.html.</p>
            </div>
            <button
              onClick={() => onOpenAbuseModal("Билд не запускается / Вылетает")}
              className="px-3.5 py-1.5 bg-danger/20 hover:bg-danger/30 text-danger font-mono text-caption font-bold rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Flag className="w-3.5 h-3.5 shrink-0" />
              <span>Пожаловаться оргкомитету</span>
            </button>
          </div>
        )}

        {/* CONTEXT LOST OVERLAY */}
        {playerState === 'context_lost' && (
          <div className="absolute inset-0 z-20 bg-black/90 backdrop-blur-sm p-6 flex flex-col items-center justify-center text-center space-y-3 font-sans">
            <ShieldAlert className="w-8 h-8 text-warning mx-auto shrink-0" />
            <div className="space-y-1 max-w-md">
              <h3 className="text-body-sm font-bold text-textPrimary">Сбой контекста WebGL</h3>
              <p className="text-caption text-textSecondary">Все сохраненные баллы в безопасности.</p>
            </div>
            <button
              onClick={handleRestartPlayer}
              className="px-4 py-2 bg-accent text-white font-mono font-bold text-caption rounded-lg hover:bg-accent-hover transition-colors flex items-center gap-2 cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5 shrink-0" />
              <span>Перезапустить</span>
            </button>
          </div>
        )}
      </div>

      {/* JURY PLAYER TOOLBAR */}
      <div className="px-1 flex items-center justify-between gap-2 font-mono text-caption text-textTertiary">
        <div className="flex items-center gap-2 truncate">
          <span className="text-caption text-textTertiary flex items-center gap-1.5 shrink-0">
            <Lock className="w-3 h-3 text-accent shrink-0" />
            <span className="font-bold text-textPrimary">{submission.webgl_build?.version || "v1.0.0"}</span>
            <span className="text-textDisabled">•</span>
            <span>Зафиксированная сборка сабмишена</span>
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {playerState === 'active' && (
            <button
              onClick={() => setIsInputCaptured(!isInputCaptured)}
              className={`text-caption font-semibold transition-colors flex items-center gap-1.5 cursor-pointer px-2 py-1 rounded-lg ${isInputCaptured ? 'bg-accent/10 text-accent border border-accent/30' : 'text-textTertiary hover:text-textPrimary hover:bg-surface-2'
                }`}
              title="Блокирует скролл стрелками браузера"
            >
              <Target className="w-3.5 h-3.5 shrink-0" />
              <span>{isInputCaptured ? 'Захват активен' : 'Захват ввода'}</span>
            </button>
          )}

          <button
            onClick={handleRestartPlayer}
            disabled={playerState !== 'active'}
            className="hover:text-textPrimary transition-colors disabled:opacity-30 flex items-center gap-1.5 cursor-pointer"
            title="Перезапустить плеер"
          >
            <RotateCw className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Перезапустить</span>
          </button>

          <a
            href={submission.webgl_build?.url || "#"}
            target="_blank"
            rel="noreferrer"
            className="hover:text-textPrimary transition-colors flex items-center gap-1.5"
            title="В отдельном окне ↗"
          >
            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">В отдельном окне</span>
          </a>

          <button
            onClick={handleToggleFullscreen}
            className="text-accent font-bold hover:underline transition-colors flex items-center gap-1.5 cursor-pointer"
            title="На весь экран"
          >
            <Maximize2 className="w-3.5 h-3.5 shrink-0" />
            <span>На весь экран</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── MAIN PAGE COMPONENT ────────────────────────────────────────────────────

export default function JuryEvaluationsPage({ authState, setAuthState, onNavigate }: {
  authState?: string;
  setAuthState?: (val: string) => void;
  onNavigate?: (path: string) => void;
}) {
  const [submissions, setSubmissions] = useState(MOCK_SUBMISSIONS);
  const [activeSubmissionId, setActiveSubmissionId] = useState("SUB-9012");
  const [selectedJamId, setSelectedJamId] = useState("indie-jam-2026");

  const [statusTab, setStatusTab] = useState("pending");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [simulatedState, setSimulatedState] = useState("normal");

  const [scoresState, setScoresState] = useState<Record<string, number>>({ gameplay: 3.0, theme: 3.0, graphics: 3.0, sound: 3.0, originality: 3.0 });
  const [juryComment, setJuryComment] = useState("");
  const [isPrivateComment, setIsPrivateComment] = useState(false);
  const [mobileView, setMobileView] = useState<'queue' | 'evaluation'>('evaluation');

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [abuseReason, setAbuseReason] = useState("");

  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const triggerToast = (message: string, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const activeJam = useMemo(() => MOCK_JAMS.find(j => j.id === selectedJamId) || MOCK_JAMS[0], [selectedJamId]);

  // Dynamic Body Scroll Lock for App Workspace
  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, []);

  // Parse submission_id from hash route query params
  useEffect(() => {
    const hash = window.location.hash || '';
    const qIdx = hash.indexOf('?');
    if (qIdx !== -1) {
      const params = new URLSearchParams(hash.substring(qIdx));
      const subParam = params.get("submission_id");

      if (subParam) {
        const target = submissions.find(s => s.submission_id === subParam);
        if (target) {
          setActiveSubmissionId(subParam);
          setSelectedJamId(target.jam_id);

          if (target.status === "completed") setStatusTab("completed");
          else if (target.status === "draft") setStatusTab("draft");
          else setStatusTab("pending");

          setPlatformFilter("all");
          setCategoryFilter("all");
          setSearchQuery("");

          populateFormForSubmission(target);
        } else {
          setSimulatedState("404");
          triggerToast(`Ошибка: заявка #${subParam} не найдена`, "danger");
        }
      } else {
        const firstSub = submissions[0];
        if (firstSub) {
          populateFormForSubmission(firstSub);
        }
      }
    } else {
      const firstSub = submissions[0];
      if (firstSub) {
        populateFormForSubmission(firstSub);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const populateFormForSubmission = (sub: any) => {
    if (sub.my_evaluation) {
      setScoresState({ ...sub.my_evaluation.scores });
      setJuryComment(sub.my_evaluation.jury_comment || "");
      setIsPrivateComment(sub.my_evaluation.is_private || false);
    } else {
      setScoresState({ gameplay: 3.0, theme: 3.0, graphics: 3.0, sound: 3.0, originality: 3.0 });
      setJuryComment("");
      setIsPrivateComment(false);
    }
  };

  const activeSubmission = useMemo(() => {
    if (simulatedState === "404") return null;
    return submissions.find(s => s.submission_id === activeSubmissionId);
  }, [submissions, activeSubmissionId, simulatedState]);

  const calculatedWeightedScore = useMemo(() => {
    let sum = 0;
    let totalWeight = 0;
    activeJam.criteria.forEach(c => {
      const val = scoresState[c.key] || 0;
      sum += val * (c.weight || 0.2);
      totalWeight += (c.weight || 0.2);
    });
    return totalWeight > 0 ? (sum / totalWeight).toFixed(2) : "0.00";
  }, [scoresState, activeJam]);

  const filteredQueue = useMemo(() => {
    return submissions.filter(sub => {
      if (sub.jam_id !== selectedJamId) return false;
      if (sub.status !== statusTab) return false;
      if (platformFilter !== "all" && sub.platform !== platformFilter) return false;
      if (categoryFilter !== "all" && sub.category !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return sub.game.title.toLowerCase().includes(q) || sub.submission_id.toLowerCase().includes(q);
      }
      return true;
    });
  }, [submissions, selectedJamId, statusTab, platformFilter, categoryFilter, searchQuery]);

  const handleSelectSubmission = (subId: string) => {
    const targetSub = submissions.find(s => s.submission_id === subId);
    if (targetSub) {
      setSimulatedState("normal");
      setActiveSubmissionId(subId);
      setMobileView('evaluation');

      try {
        const hash = window.location.hash || '';
        const pathPart = hash.split('?')[0] || '#/jury/evaluations';
        window.location.hash = `${pathPart}?submission_id=${subId}`;
      } catch (e) { }

      populateFormForSubmission(targetSub);
    }
  };

  const isCOI = activeSubmission?.is_conflict_of_interest || simulatedState === "coi";
  const isReadOnly = activeSubmission?.is_locked || activeJam.is_locked || simulatedState === "readonly";

  // Global Hotkeys Listener: [, ], Cmd+Enter, ?
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea') return;

      if (e.key === '[') {
        e.preventDefault();
        const currentIndex = filteredQueue.findIndex(s => s.submission_id === activeSubmissionId);
        if (currentIndex > 0) {
          handleSelectSubmission(filteredQueue[currentIndex - 1].submission_id);
        }
      } else if (e.key === ']') {
        e.preventDefault();
        const currentIndex = filteredQueue.findIndex(s => s.submission_id === activeSubmissionId);
        if (currentIndex !== -1 && currentIndex < filteredQueue.length - 1) {
          handleSelectSubmission(filteredQueue[currentIndex + 1].submission_id);
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!isCOI && !isReadOnly) {
          handleSaveEvaluation("completed");
        }
      } else if (e.key === '?') {
        e.preventDefault();
        setActiveModal("hotkeys");
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [filteredQueue, activeSubmissionId, isCOI, isReadOnly]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSaveEvaluation = (statusType = "draft") => {
    if (!activeSubmission) return;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setSubmissions(prev => prev.map(sub => {
      if (sub.submission_id === activeSubmission.submission_id) {
        return {
          ...sub,
          status: statusType,
          my_evaluation: {
            status: statusType,
            scores: { ...sub.my_evaluation.scores, ...scoresState },
            weighted_score: parseFloat(calculatedWeightedScore),
            jury_comment: juryComment,
            is_private: isPrivateComment,
            updated_at: timeStr
          }
        };
      }
      return sub;
    }));

    if (statusType === "completed") {
      triggerToast(`Оценка по игре "${activeSubmission.game.title}" зафиксирована.`, "success");

      const currentIndex = filteredQueue.findIndex(s => s.submission_id === activeSubmissionId);
      if (currentIndex !== -1 && currentIndex < filteredQueue.length - 1) {
        setTimeout(() => handleSelectSubmission(filteredQueue[currentIndex + 1].submission_id), 600);
      }
    } else {
      triggerToast(`Черновик по работе #${activeSubmission.submission_id} сохранён`, "success");
    }
  };

  const handleNavigateToJam = () => {
    const path = `/jams/${activeJam.slug}`;
    if (onNavigate) {
      onNavigate(path);
    } else if ((window as any).__hubigrNavigate) {
      (window as any).__hubigrNavigate(path);
    } else {
      window.location.hash = `#${path}`;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] md:h-[calc(100vh-64px)] w-full bg-surface-0 text-textPrimary overflow-hidden font-sans">
      <FontStyles />

      {/* APPLICATION TOOLBAR HEADER */}
      <div className="h-14 px-4 sm:px-6 bg-surface-1 border-b border-borderDef flex items-center justify-between gap-4 shrink-0 z-20">

        {/* Left: Breadcrumbs & Jam Dropdown */}
        <div className="flex items-center gap-2 text-caption font-mono text-textTertiary min-w-0">
          <button onClick={handleNavigateToJam} className="hidden sm:inline hover:text-textPrimary transition-colors shrink-0 cursor-pointer bg-transparent border-none">
            Джемы
          </button>
          <ChevronRight className="hidden sm:inline w-3.5 h-3.5 text-textDisabled shrink-0" />

          <CustomSelect
            value={selectedJamId}
            onChange={setSelectedJamId}
            options={MOCK_JAMS.map(j => ({ value: j.id, label: j.title }))}
            icon={Trophy}
            className="max-w-[150px] sm:max-w-[210px]"
          />

          <ChevronRight className="hidden md:inline w-3.5 h-3.5 text-textDisabled shrink-0" />
          <span className="hidden md:inline text-textSecondary font-medium shrink-0">Кабинет жюри</span>

          {activeSubmission && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-textDisabled shrink-0" />
              <span className="text-accent font-bold truncate">#{activeSubmission.submission_id}</span>
            </>
          )}
        </div>

        {/* Right: Actions & Status Group */}
        <div className="flex items-center gap-3 shrink-0">
          <JuryProgressWidget evaluated={activeJam.evaluated_count} total={activeJam.total_assigned} />

          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-surface-2 border border-borderDef rounded-xl text-caption font-mono text-textSecondary h-9">
            <Clock className="w-3.5 h-3.5 text-warning shrink-0" />
            <span>До дедлайна: <strong className="text-textPrimary">{activeJam.deadline_formatted}</strong></span>
          </div>

          <button
            onClick={() => setActiveModal("hotkeys")}
            className="hidden md:flex h-9 px-3 bg-surface-2 hover:bg-surface-3 border border-borderDef hover:border-accent/40 text-textTertiary hover:text-textPrimary text-caption font-mono font-medium rounded-xl items-center gap-2 transition-colors cursor-pointer"
            title="Горячие клавиши"
          >
            <Keyboard className="w-3.5 h-3.5 text-accent shrink-0" />
            <span className="hidden xl:inline">Hotkeys (?)</span>
          </button>

          <button
            onClick={() => setActiveModal("lock")}
            className="h-9 w-9 md:w-auto px-0 md:px-3.5 bg-surface-2 hover:bg-surface-3 border border-borderDef hover:border-accent text-textPrimary text-caption font-mono font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shrink-0 cursor-pointer shadow-sm"
            title="Завершить этап проверки"
          >
            <Lock className="w-3.5 h-3.5 text-accent shrink-0" />
            <span className="hidden md:inline">Завершить судейство</span>
          </button>
        </div>

      </div>

      {/* Mobile Master-Detail Switcher */}
      <div className="md:hidden flex items-center justify-between px-3 py-2 bg-surface-1 border-b border-borderDef gap-2 shrink-0">
        <button
          onClick={() => setMobileView('queue')}
          className={`flex-1 py-2 px-3 text-xs font-mono font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer touch-manipulation ${
            mobileView === 'queue' ? 'bg-accent text-white shadow-sm' : 'bg-surface-2 text-textSecondary'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Очередь ({filteredQueue.length})</span>
        </button>
        <button
          onClick={() => setMobileView('evaluation')}
          className={`flex-1 py-2 px-3 text-xs font-mono font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer touch-manipulation ${
            mobileView === 'evaluation' ? 'bg-accent text-white shadow-sm' : 'bg-surface-2 text-textSecondary'
          }`}
        >
          <Star className="w-3.5 h-3.5" />
          <span>Оценка {activeSubmission ? `#${activeSubmission.submission_id}` : ''}</span>
        </button>
      </div>

      {/* MAIN SPLIT-VIEW WORKSPACE */}
      <div className="flex-1 flex overflow-hidden w-full">

        {/* LEFT SIDEBAR: SUBMISSION QUEUE */}
        <aside className={`w-full md:w-80 lg:w-96 bg-surface-1 border-r border-borderDef flex flex-col shrink-0 overflow-hidden ${
          mobileView === 'queue' ? 'flex' : 'hidden md:flex'
        }`}>

          {/* Queue Controls */}
          <div className="p-3.5 border-b border-borderDef space-y-3 bg-surface-1">

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по названию или ID..."
                className="w-full h-9 pl-9 pr-7 bg-surface-2 border border-borderDef rounded-xl text-caption text-textPrimary placeholder:text-textDisabled outline-none focus:border-accent transition-colors font-sans"
              />
              <Search className="w-4 h-4 text-textTertiary absolute left-2.5 top-2.5 shrink-0" />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-2 top-2.5 text-textTertiary hover:text-textPrimary p-0.5 cursor-pointer">
                  <X className="w-3.5 h-3.5 shrink-0" />
                </button>
              )}
            </div>

            {/* Segmented Status Filter Tabs */}
            <SegmentedControl
              items={[
                { 
                  key: "pending", 
                  label: "Ожидают",
                  count: submissions.filter(s => s.jam_id === selectedJamId && s.status === 'pending').length
                },
                { 
                  key: "draft", 
                  label: "Черновики",
                  count: submissions.filter(s => s.jam_id === selectedJamId && s.status === 'draft').length
                },
                { 
                  key: "completed", 
                  label: "Оценённые",
                  count: submissions.filter(s => s.jam_id === selectedJamId && s.status === 'completed').length
                }
              ]}
              value={statusTab}
              onChange={setStatusTab}
            />

            {/* Sub-Filters Row */}
            <div className="grid grid-cols-2 gap-2">
              <CustomSelect
                value={platformFilter}
                onChange={setPlatformFilter}
                options={[
                  { value: "all", label: "Все платформы" },
                  { value: "webgl", label: "WebGL" },
                  { value: "desktop", label: "Desktop" }
                ]}
                icon={Monitor}
              />
              <CustomSelect
                value={categoryFilter}
                onChange={setCategoryFilter}
                options={[
                  { value: "all", label: "Все треки" },
                  { value: "Main Track", label: "Main Track" },
                  { value: "Innovation", label: "Innovation" }
                ]}
                icon={Tag}
              />
            </div>

          </div>

          {/* Submission Cards Queue List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredQueue.length === 0 ? (
              <div className="p-10 text-center text-caption font-mono text-textTertiary space-y-3">
                <Inbox className="w-10 h-10 text-textDisabled mx-auto shrink-0" />
                <p>Нет заявок в выбрнной категории</p>
              </div>
            ) : (
              filteredQueue.map(sub => {
                const isActive = sub.submission_id === activeSubmissionId;
                const evaluatedScore = sub.my_evaluation?.weighted_score;

                return (
                  <div
                    key={sub.submission_id}
                    onClick={() => handleSelectSubmission(sub.submission_id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer group flex items-center gap-3 relative ${isActive
                      ? 'bg-surface-2 border-accent shadow-md ring-1 ring-accent/40'
                      : 'bg-surface-1 border-borderDef hover:border-borderStrong hover:bg-surface-2'
                      }`}
                  >
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-borderDef">
                      <img src={sub.game.cover_url} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/10" />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-mono text-caption text-accent font-bold truncate">#{sub.submission_id}</span>
                        <span className="text-caption font-mono text-textTertiary px-1.5 py-0.5 bg-surface-3 rounded-lg uppercase shrink-0 font-semibold leading-none">
                          {sub.platform}
                        </span>
                      </div>

                      <h4 className="text-caption sm:text-body-sm font-bold text-textPrimary truncate group-hover:text-accent transition-colors leading-snug">
                        {sub.game.title}
                      </h4>

                      <p className="text-caption text-textTertiary truncate leading-none flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-textDisabled" />
                        <span>{sub.game.developer.name}</span>
                      </p>
                    </div>

                    {evaluatedScore !== undefined && evaluatedScore !== null && (
                      <div className="shrink-0 px-2 py-1 bg-accent/10 border border-accent/30 rounded-xl text-accent font-mono text-caption font-bold flex items-center gap-1 leading-none">
                        <Star className="w-3 h-3 text-accent fill-accent shrink-0" />
                        <span>{typeof evaluatedScore === 'number' ? evaluatedScore.toFixed(2) : evaluatedScore}</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

        </aside>

        {/* RIGHT WORKSPACE: ACTIVE EVALUATION */}
        <main className={`flex-1 overflow-y-auto bg-surface-0 flex flex-col justify-between ${
          mobileView === 'evaluation' ? 'flex' : 'hidden md:flex'
        }`}>

          <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto w-full space-y-8 animate-fadeIn pb-24">

            {/* EDGE CASE: HTTP 404 NOT FOUND */}
            {simulatedState === "404" && (
              <div className="max-w-xl mx-auto my-16 bg-surface-1 border border-danger/30 p-8 rounded-2xl text-center space-y-4 shadow-2xl">
                <AlertTriangle className="w-12 h-12 text-danger mx-auto shrink-0" />
                <div className="space-y-1">
                  <h2 className="text-body-lg font-bold font-mono text-textPrimary uppercase">HTTP 404 • Заявка не найдена</h2>
                  <p className="text-caption text-textSecondary">Указанный идентификатор сабмишена не существует или был удален разработчиком.</p>
                </div>
                <button
                  onClick={() => handleSelectSubmission(submissions[0].submission_id)}
                  className="px-5 py-2.5 bg-accent text-white font-mono font-extrabold text-caption rounded-xl hover:bg-accent-hover transition-colors cursor-pointer"
                >
                  Перейти к первой заявке в очереди
                </button>
              </div>
            )}

            {/* EDGE CASE: HTTP 403 FORBIDDEN */}
            {simulatedState === "403" && (
              <div className="max-w-xl mx-auto my-16 bg-surface-1 border border-danger/30 p-8 rounded-2xl text-center space-y-4 shadow-2xl">
                <ShieldAlert className="w-12 h-12 text-danger mx-auto shrink-0" />
                <div className="space-y-1">
                  <h2 className="text-body-lg font-bold font-mono text-textPrimary uppercase">HTTP 403 • Доступ ограничен</h2>
                  <p className="text-caption text-textSecondary">Вы не включены в состав официального жюри этого джема или срок проведения судейства истек.</p>
                </div>
                <button
                  onClick={handleNavigateToJam}
                  className="inline-block px-5 py-2.5 bg-surface-2 hover:bg-surface-3 border border-borderDef text-textPrimary font-mono text-caption font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Вернуться на страницу джема
                </button>
              </div>
            )}

            {/* NORMAL WORKSPACE */}
            {simulatedState !== "404" && simulatedState !== "403" && activeSubmission && (
              <>
                {/* COI BANNER */}
                {isCOI && (
                  <div className="bg-warning/10 border border-warning/30 p-4 rounded-xl flex items-center justify-between gap-4 text-caption font-mono">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-warning shrink-0" />
                      <div>
                        <strong className="text-warning block font-bold uppercase">Конфликт интересов (COI)</strong>
                        <span className="text-textSecondary">Вы являетесь автором или аффилированным участником команды этой работы. Оценка заблокирована.</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const idx = filteredQueue.findIndex(s => s.submission_id === activeSubmissionId);
                        if (idx < filteredQueue.length - 1) handleSelectSubmission(filteredQueue[idx + 1].submission_id);
                      }}
                      className="px-4 py-2 bg-warning text-black font-bold rounded-xl whitespace-nowrap hover:bg-amber-500 transition-colors cursor-pointer"
                    >
                      К следующей игре ➔
                    </button>
                  </div>
                )}

                {/* READ ONLY BANNER */}
                {isReadOnly && !isCOI && (
                  <div className="bg-surface-2 border border-borderDef p-4 rounded-xl flex items-center gap-3 text-caption font-mono text-textSecondary">
                    <Lock className="w-4 h-4 text-accent shrink-0" />
                    <span>Этап судейства завершён. Все выставленные оценки переведены в режим «Только чтение».</span>
                  </div>
                )}

                {/* GAME HEADER TITLE BAR */}
                <div className="flex flex-col gap-3 pb-6 border-b border-borderDef">
                  
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    {/* Tags */}
                    <div className="flex items-center gap-2.5 font-mono text-caption pt-1">
                      <span className="px-2 py-0.5 bg-accent/10 border border-accent/30 text-accent font-bold rounded-lg">
                        #{activeSubmission.submission_id}
                      </span>
                      <span className="text-textDisabled">•</span>
                      <span className="text-textSecondary font-semibold">{activeSubmission.category}</span>
                    </div>

                    {/* Header Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          const path = `/games/${activeSubmission.game.slug}`;
                          if (onNavigate) onNavigate(path);
                          else if ((window as any).__hubigrNavigate) (window as any).__hubigrNavigate(path);
                          else window.location.hash = `#${path}`;
                        }}
                        className="h-9 px-3.5 bg-surface-2 hover:bg-surface-3 border border-borderDef text-textPrimary rounded-xl text-caption font-mono font-bold flex items-center gap-2 transition-colors cursor-pointer hover:border-borderStrong"
                      >
                        <span>Открыть страницу</span>
                        <ExternalLink className="w-3.5 h-3.5 text-textTertiary shrink-0" />
                      </button>

                      <button
                        onClick={() => setActiveModal("rules")}
                        className="h-9 w-9 bg-surface-2 hover:bg-surface-3 border border-borderDef text-textTertiary hover:text-textPrimary rounded-xl flex items-center justify-center transition-colors cursor-pointer"
                        title="Регламент судейства"
                      >
                        <BookOpen className="w-4 h-4 shrink-0" />
                      </button>

                      <button
                        onClick={() => setActiveModal("abuse")}
                        className="h-9 w-9 bg-surface-2 hover:bg-danger/20 border border-borderDef hover:border-danger/40 text-textTertiary hover:text-danger rounded-xl flex items-center justify-center transition-colors cursor-pointer"
                        title="Пожаловаться оргкомитету"
                      >
                        <Flag className="w-4 h-4 shrink-0" />
                      </button>
                    </div>
                  </div>

                  <h1 className="text-heading-2 sm:text-heading-2 font-black text-textPrimary tracking-tight">{activeSubmission.game.title}</h1>

                  <div className="flex items-center gap-2 text-caption text-textTertiary">
                    <span className="shrink-0">Разработчик:</span>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <img src={activeSubmission.game.developer.avatar} alt="" className="w-4 h-4 rounded-full border border-borderDef shrink-0" />
                      <span className="font-semibold text-textPrimary hover:text-accent transition-colors cursor-pointer truncate">
                        {activeSubmission.game.developer.name}
                      </span>
                    </div>
                  </div>
                </div>

                {/* GAME TESTING & INTERACTION ZONE */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-caption font-mono uppercase tracking-wider text-textTertiary font-bold flex items-center gap-2">
                      <Gamepad2 className="w-4 h-4 text-accent" />
                      <span>Интерактивное тестирование сборки</span>
                    </h3>
                  </div>

                  <TestingWorkspace
                    submission={activeSubmission}
                    onOpenAbuseModal={(reason) => {
                      setAbuseReason(reason);
                      setActiveModal("abuse");
                    }}
                    triggerToast={triggerToast}
                  />
                </div>

                {/* GAME METADATA & CONTEXT INFO ACCORDION/BLOCKS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-caption font-sans">
                  {/* Controls Info */}
                  <div className="bg-surface-1 border border-borderDef rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2 font-mono font-bold text-textPrimary">
                      <SlidersHorizontal className="w-4 h-4 text-accent" />
                      <span>Управление и схемы ввода</span>
                    </div>
                    <p className="text-textSecondary leading-relaxed">
                      {activeSubmission.game.controls_description || "Стандартное управление клавиатура + мышь."}
                    </p>
                  </div>

                  {/* Assets Info */}
                  <div className="bg-surface-1 border border-borderDef rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2 font-mono font-bold text-textPrimary">
                      <Tag className="w-4 h-4 text-accent" />
                      <span>Использованные сторонние ассеты & ИИ</span>
                    </div>
                    <p className="text-textSecondary leading-relaxed">
                      {activeSubmission.game.assets_description || "Все ассеты и код созданы авторами с нуля в рамках джема."}
                    </p>
                  </div>
                </div>

                {/* EVALUATION FORM (SLIDERS & CRITERIA MATRIX) */}
                <div className="bg-surface-1 border border-borderDef rounded-2xl p-4 sm:p-6 md:p-8 space-y-8 shadow-xl">
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-borderDef">
                    <div className="space-y-1">
                      <h3 className="text-body-lg font-bold text-textPrimary flex items-center gap-2">
                        <Award className="w-5 h-5 text-accent" />
                        <span>Судейская оценочная форма</span>
                      </h3>
                      <p className="text-caption text-textTertiary font-mono">
                        Шкала от 1.0 до 5.0 с шагом 0.5. Итоговый балл рассчитывается по весовым коэффициентам.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 bg-surface-2 border border-borderDef px-4 py-2 rounded-xl">
                      <span className="text-caption font-mono text-textTertiary uppercase font-semibold">Итоговый балл:</span>
                      <span className="text-heading-3 font-mono font-black text-accent">{calculatedWeightedScore}</span>
                      <span className="text-caption font-mono text-textTertiary">/ 5.0</span>
                    </div>
                  </div>

                  {/* Criteria Sliders Grid */}
                  <div className="space-y-6">
                    {activeJam.criteria.map(crit => {
                      const currentVal = scoresState[crit.key] || 3.0;
                      return (
                        <div key={crit.key} className="space-y-2">
                          <div className="flex items-center justify-between text-caption font-mono">
                            <div className="space-y-0.5">
                              <span className="font-bold text-textPrimary text-body-sm">{crit.label}</span>
                              <span className="text-textTertiary ml-2">Вес: {(crit.weight * 100).toFixed(0)}%</span>
                            </div>
                            <span className="text-accent font-bold text-body-sm px-2.5 py-0.5 bg-accent/10 border border-accent/20 rounded-lg">
                              {currentVal.toFixed(1)} / 5.0
                            </span>
                          </div>

                          <div className="flex items-center gap-4">
                            <input
                              type="range"
                              min="1.0"
                              max="5.0"
                              step="0.5"
                              disabled={isCOI || isReadOnly}
                              value={currentVal}
                              onChange={(e) => setScoresState({ ...scoresState, [crit.key]: parseFloat(e.target.value) })}
                              className="flex-1 accent-accent h-2 bg-surface-3 rounded-lg cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            />
                          </div>

                          <p className="text-caption text-textTertiary">{crit.description}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Jury Feedback & Verdict Textarea */}
                  <div className="space-y-3 pt-6 border-t border-borderDef">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <label className="text-caption font-mono font-bold text-textPrimary uppercase tracking-wider flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-accent shrink-0" />
                        <span>Развернутый комментарий жюри</span>
                      </label>

                      <label className="flex items-center gap-2 text-caption font-mono text-textTertiary cursor-pointer select-none self-start sm:self-auto">
                        <input
                          type="checkbox"
                          checked={isPrivateComment}
                          disabled={isCOI || isReadOnly}
                          onChange={(e) => setIsPrivateComment(e.target.checked)}
                          className="accent-accent w-4 h-4 rounded cursor-pointer shrink-0"
                        />
                        <span>Приватный отзыв (только для оргкомитета)</span>
                      </label>
                    </div>

                    <textarea
                      rows={4}
                      disabled={isCOI || isReadOnly}
                      value={juryComment}
                      onChange={(e) => setJuryComment(e.target.value)}
                      placeholder="Опишите сильные стороны проекта, замечания по геймдизайну, технические огрехи и рекомендации разработчикам..."
                      className="w-full bg-surface-2 border border-borderDef rounded-xl p-3.5 text-body-sm text-textPrimary placeholder:text-textDisabled outline-none focus:border-accent font-sans resize-y no-global-focus disabled:opacity-40 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </>
            )}

          </div>

          {/* BOTTOM FIXED ACTION DOCK */}
          {!isCOI && !isReadOnly && (
            <div className="sticky bottom-0 left-0 right-0 z-30 bg-surface-1/95 backdrop-blur-md border-t border-borderDef p-3 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-4 shadow-2xl">
              <button
                onClick={() => {
                  const idx = filteredQueue.findIndex(s => s.submission_id === activeSubmissionId);
                  if (idx < filteredQueue.length - 1) handleSelectSubmission(filteredQueue[idx + 1].submission_id);
                }}
                className="w-full sm:w-auto px-4 py-2.5 bg-surface-2 hover:bg-surface-3 border border-borderDef text-textSecondary hover:text-textPrimary font-mono text-caption font-bold rounded-xl transition-colors cursor-pointer text-center"
              >
                Пропустить / Отложить
              </button>

              <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
                <button
                  onClick={() => handleSaveEvaluation("draft")}
                  className="flex-1 sm:flex-initial px-4 sm:px-5 py-2.5 bg-surface-2 hover:bg-surface-3 border border-borderDef text-textPrimary font-mono text-caption font-bold rounded-xl transition-colors cursor-pointer hover:border-borderStrong text-center"
                >
                  Черновик
                </button>
                <button
                  onClick={() => handleSaveEvaluation("completed")}
                  className="flex-1 sm:flex-initial px-4 sm:px-6 py-2.5 bg-accent hover:bg-accent-hover text-white font-mono text-caption font-extrabold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-sm touch-manipulation"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Зафиксировать</span>
                  <span className="hidden sm:inline text-caption bg-black/30 text-white px-1.5 py-0.5 rounded-lg ml-1 font-mono font-bold">Cmd+Enter</span>
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* SYSTEM MODALS */}
      <Modal isOpen={activeModal === "hotkeys"} onClose={() => setActiveModal(null)} title="Горячие клавиши судейской консоли" icon={Keyboard}>
        <div className="space-y-3 font-mono text-caption text-textSecondary">
          <div className="flex items-center justify-between p-2.5 bg-surface-2 rounded-xl border border-borderDef"><span>Предыдущая игра</span><kbd className="px-2 py-1 bg-surface-3 rounded-lg text-accent font-bold">[</kbd></div>
          <div className="flex items-center justify-between p-2.5 bg-surface-2 rounded-xl border border-borderDef"><span>Следующая игра</span><kbd className="px-2 py-1 bg-surface-3 rounded-lg text-accent font-bold">]</kbd></div>
          <div className="flex items-center justify-between p-2.5 bg-surface-2 rounded-xl border border-borderDef"><span>Зафиксировать оценку</span><kbd className="px-2 py-1 bg-surface-3 rounded-lg text-accent font-bold">Cmd + Enter</kbd></div>
          <div className="flex items-center justify-between p-2.5 bg-surface-2 rounded-xl border border-borderDef"><span>Открыть памятку</span><kbd className="px-2 py-1 bg-surface-3 rounded-lg text-accent font-bold">?</kbd></div>
        </div>
      </Modal>

      <Modal isOpen={activeModal === "rules"} onClose={() => setActiveModal(null)} title="Регламент и этика судейства" icon={BookOpen}>
        <div className="space-y-3 text-caption text-textSecondary font-sans">
          <p>1. Оценивайте работы объективно, основываясь исключительно на выставленных критериях джема.</p>
          <p>2. Уважайте труд разработчиков: оставляйте конструктивный и развернутый фидбек.</p>
          <p>3. При обнаружении заимствованных ассетов или нарушений темы используйте кнопку «Пожаловаться».</p>
        </div>
      </Modal>

      <Modal isOpen={activeModal === "abuse"} onClose={() => setActiveModal(null)} title="Пожаловаться на сабмишен" icon={Flag}>
        <div className="space-y-4 text-caption font-sans">
          <textarea
            rows={4}
            value={abuseReason}
            onChange={(e) => setAbuseReason(e.target.value)}
            placeholder="Опишите причину обращения к оргкомитету (плагиат, незадекларированные ассеты, нерабочий билд)..."
            className="w-full bg-surface-2 border border-borderDef rounded-xl p-3 text-textPrimary outline-none focus:border-danger no-global-focus"
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setActiveModal(null)}>Отмена</Button>
            <button onClick={() => { triggerToast("Сигнал отправлен оргкомитету", "warning"); setActiveModal(null); setAbuseReason(""); }} className="h-9 px-4 bg-danger hover:bg-red-600 text-white text-caption font-semibold rounded-control transition-colors cursor-pointer">Отправить</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={activeModal === "lock"} onClose={() => setActiveModal(null)} title="Запечатать все оценки джема?" icon={Lock}>
        <div className="space-y-4 text-caption font-sans">
          <p className="text-textSecondary">Вы собираетесь завершить этап проверки. Все выставленные оценки будут зафиксированы, и форма перейдет в режим «Только чтение».</p>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setActiveModal(null)}>Отмена</Button>
            <Button variant="primary" size="md" onClick={() => { setSimulatedState("readonly"); setActiveModal(null); triggerToast("Все оценки запечатаны", "success"); }}>Завершить судейство</Button>
          </div>
        </div>
      </Modal>

      {/* TOAST SYSTEM */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type as any}
          position="bottom-right"
        />
      )}

      {/* DEV MATRIX CONTROL PANEL */}
      <DevMatrixPanel
        bottomOffsetClass="bottom-36 md:bottom-0"
        pageName="Судейская консоль жюри (/#/jury/evaluations)"
        fields={[
          {
            id: 'authState',
            label: 'Роль',
            type: 'select',
            value: authState || 'creator',
            onChange: (val) => setAuthState && setAuthState(val),
            options: [
              { value: 'guest', label: 'Гость (Guest)' },
              { value: 'creator', label: 'Жюри / Творец (Creator)' },
              { value: 'admin', label: 'Модерация (Admin)' }
            ]
          },
          {
            id: 'simulatedState',
            label: 'Режим консоли',
            type: 'select',
            value: simulatedState,
            onChange: setSimulatedState,
            highlight: true,
            options: [
              { value: 'normal', label: '1. Standard (Оценка)' },
              { value: 'coi', label: '2. COI (Конфликт интересов)' },
              { value: 'readonly', label: '3. Read-Only (Замок)' },
              { value: '404', label: '4. HTTP 404 (Не найдено)' },
              { value: '403', label: '5. HTTP 403 (Ограничено)' }
            ]
          }
        ]}
      />

    </div>
  );
}
