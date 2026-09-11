import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  ArrowLeft, Save, Image as ImageIcon, Upload, Monitor, Globe, 
  CheckCircle2, DollarSign, Eye, EyeOff, Clock, AlertTriangle, 
  FileText, Calendar, Percent, Gift, Sparkles, Trash2, Play, 
  Check, XCircle, Info, ShieldAlert, ExternalLink, Terminal, Apple
} from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Switch from '../components/ui/Switch';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../components/ui/Toast';
import { CustomSelect } from '../components/ui/Select';
import DevMatrixPanel, { DevMatrixField } from '../components/DevMatrixPanel';

const GENRES = [
  { value: 'action', label: 'Action' },
  { value: 'rpg', label: 'RPG' },
  { value: 'strategy', label: 'Strategy' },
  { value: 'puzzle', label: 'Puzzle' },
  { value: 'indie', label: 'Indie' },
];

export interface PlatformBuildInfo {
  platform: 'web' | 'win' | 'mac' | 'linux';
  label: string;
  filename?: string | null;
  size?: string | null;
  status: 'none' | 'uploading' | 'ready';
  uploadedAt?: string | null;
}

export interface ScheduledPromotion {
  id: string;
  type: 'discount' | 'giveaway';
  discountPercent?: number;
  startsAt: string;
  endsAt: string;
  status: 'active' | 'scheduled' | 'ended' | 'cancelled';
}

export default function GameEditorPage({ gameId, scope = 'personal' }: { gameId?: string; scope?: string }) {
  const { showToast } = useToast();
  
  // Format scope display name (FE-TEAM-008)
  const authorName = scope === 'personal' ? 'alex_dev (Личный профиль)' : scope === 'team_nocturnal' ? 'NocturnalDevs Studio (Команда)' : 'Объединенный профиль';
  
  // Tabs: 'general' | 'media' | 'builds' | 'commercial' | 'promotions'
  const [activeTab, setActiveTab] = useState<'general' | 'media' | 'builds' | 'commercial' | 'promotions'>('general');

  // FE-MKT-004: Two-Phase Revision & Publication State
  const [gameStatus, setGameStatus] = useState<'draft' | 'published'>(gameId ? 'published' : 'draft');
  const [currentLiveVersion, setCurrentLiveVersion] = useState('v1.0.4');
  const [candidateVersion, setCandidateVersion] = useState('v1.1.0');
  const [candidateStatus, setCandidateStatus] = useState<'draft' | 'on_moderation' | 'approved' | 'rejected'>('draft');
  const [moderatorFeedback, setModeratorFeedback] = useState<string | null>(
    'В сборке для Windows обнаружено некорректное имя исполняемого файла. Пожалуйста, убедитесь, что архив содержит main executable в корне.'
  );
  const [showModeratorNotes, setShowModeratorNotes] = useState(false);

  // General Metadata
  const [title, setTitle] = useState(gameId ? 'Cyber Quest: Neon Awakening' : '');
  const [summary, setSummary] = useState(gameId ? 'Культовое киберпанк-приключение в процедурном неоновом мегаполисе.' : '');
  const [description, setDescription] = useState(gameId ? 'Cyber Quest — это динамичный платформер с элементами RPG...' : '');
  const [genre, setGenre] = useState(gameId ? 'rpg' : '');

  // Media State
  const [coverUploaded, setCoverUploaded] = useState(Boolean(gameId));

  // FE-MKT-010: Builds and Releases State
  const [changelog, setChangelog] = useState(
    '• Добавлена новая глава «Неоновые кварталы»\n• Оптимизирована производительность WebGL\n• Исправлены ошибки коллизий на Windows и macOS'
  );
  const [candidateBuilds, setCandidateBuilds] = useState<Record<string, PlatformBuildInfo>>({
    web: {
      platform: 'web',
      label: 'Web (HTML5 / WebGL)',
      filename: 'cyber_quest_webgl_v1.1.0.zip',
      size: '48.2 MB',
      status: 'ready',
      uploadedAt: 'Сегодня, 11:20'
    },
    win: {
      platform: 'win',
      label: 'Windows (.exe / .zip)',
      filename: 'cyber_quest_win64_setup.exe',
      size: '184.6 MB',
      status: 'ready',
      uploadedAt: 'Сегодня, 11:35'
    },
    mac: {
      platform: 'mac',
      label: 'macOS (.dmg / .app)',
      filename: 'cyber_quest_macos_universal.dmg',
      size: '192.1 MB',
      status: 'ready',
      uploadedAt: 'Сегодня, 11:42'
    },
    linux: {
      platform: 'linux',
      label: 'Linux (.tar.gz / AppImage)',
      filename: null,
      size: null,
      status: 'none',
      uploadedAt: null
    }
  });

  // FE-MKT-005: Commercial State
  const [isPaid, setIsPaid] = useState(Boolean(gameId));
  const [price, setPrice] = useState('350');
  const [onSale, setOnSale] = useState(true);
  const [isSellerReady, setIsSellerReady] = useState(true);

  // FE-MKT-013: Promotions and Discounts State
  const [discountPercent, setDiscountPercent] = useState<number>(30);
  const [discountStartsAt, setDiscountStartsAt] = useState('2026-09-10T12:00');
  const [discountEndsAt, setDiscountEndsAt] = useState('2026-09-17T12:00');
  const [promotions, setPromotions] = useState<ScheduledPromotion[]>([
    {
      id: 'promo-101',
      type: 'discount',
      discountPercent: 30,
      startsAt: '10.09.2026, 12:00',
      endsAt: '17.09.2026, 12:00',
      status: 'scheduled',
    },
    {
      id: 'promo-098',
      type: 'discount',
      discountPercent: 20,
      startsAt: '01.08.2026, 10:00',
      endsAt: '08.08.2026, 10:00',
      status: 'ended',
    },
  ]);
  const [isCampaignJoined, setIsCampaignJoined] = useState(false);
  
  // AC-MKT-012, BR-MKT-006, BR-MKT-007: Owners count determines complete deletion eligibility
  const [ownersCount, setOwnersCount] = useState<number>(gameId ? 142 : 0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (isDeleteModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDeleteModalOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDeleteModalOpen) {
        setIsDeleteModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDeleteModalOpen]);

  const handleConfirmDeleteGame = () => {
    setIsDeleteModalOpen(false);
    showToast(`Игра «${title || 'Без названия'}» полностью удалена`, 'info');
    if ((window as any).__hubigrNavigate) {
      (window as any).__hubigrNavigate('/creator-dashboard');
    }
  };

  // Handlers for Revision Lifecycle
  const handleSaveDraft = () => {
    showToast('Черновик ревизии успешно сохранен', 'success');
  };

  const handleSubmitForModeration = () => {
    // Sensitive edit check (BR-MKT-008): check mandatory title, summary, genre, build
    if (!title.trim() || !summary.trim() || !genre) {
      showToast('Заполните обязательные поля: Название, Краткое описание и Жанр', 'warning');
      setActiveTab('general');
      return;
    }

    const hasAnyBuild = Object.values(candidateBuilds).some(b => b.status === 'ready');
    if (!hasAnyBuild) {
      showToast('Перед отправкой на модерацию загрузите хотя бы один рабочий билд', 'warning');
      setActiveTab('builds');
      return;
    }

    setCandidateStatus('on_moderation');
    showToast(`Редакция ${candidateVersion} успешно отправлена на модерацию маркета`, 'success');
  };

  const handleWithdrawFromModeration = () => {
    setCandidateStatus('draft');
    showToast('Ревизия отозвана с модерации в статус Черновик', 'info');
  };

  // Build Upload Simulation (FE-MKT-010)
  const handleSimulateUpload = (platformKey: string) => {
    setCandidateBuilds(prev => ({
      ...prev,
      [platformKey]: {
        ...prev[platformKey],
        status: 'uploading'
      }
    }));

    setTimeout(() => {
      const ext = platformKey === 'web' ? '.zip' : platformKey === 'win' ? '.exe' : platformKey === 'mac' ? '.dmg' : '.tar.gz';
      const sizeStr = `${(Math.random() * 100 + 50).toFixed(1)} MB`;
      setCandidateBuilds(prev => {
        const label = prev[platformKey]?.label || platformKey;
        showToast(`Билд для ${label} успешно загружен`, 'success');
        return {
          ...prev,
          [platformKey]: {
            ...prev[platformKey],
            filename: `cyber_quest_${platformKey}_${candidateVersion}${ext}`,
            size: sizeStr,
            status: 'ready',
            uploadedAt: 'Только что'
          }
        };
      });
    }, 900);
  };

  const handleDeleteBuild = (platformKey: string) => {
    setCandidateBuilds(prev => ({
      ...prev,
      [platformKey]: {
        ...prev[platformKey],
        filename: null,
        size: null,
        status: 'none',
        uploadedAt: null
      }
    }));
    showToast(`Билд для ${candidateBuilds[platformKey].label} удален`, 'info');
  };

  // Promotion Creation
  const handleScheduleDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    const newPromo: ScheduledPromotion = {
      id: `promo-${Date.now().toString().slice(-4)}`,
      type: 'discount',
      discountPercent,
      startsAt: new Date(discountStartsAt).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      endsAt: new Date(discountEndsAt).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'scheduled',
    };
    setPromotions(prev => [newPromo, ...prev]);
    showToast(`Скидка -${discountPercent}% запланирована в каталоге`, 'success');
  };

  const handleLaunchGiveaway = () => {
    const giveawayPromo: ScheduledPromotion = {
      id: `giveaway-${Date.now().toString().slice(-4)}`,
      type: 'giveaway',
      startsAt: 'Сегодня, сейчас',
      endsAt: 'Через 24 часа',
      status: 'active',
    };
    setPromotions(prev => [giveawayPromo, ...prev]);
    showToast('Бесплатная раздача (Giveaway 100%) активирована на 24 часа', 'success');
  };

  const handleCancelPromo = (promoId: string) => {
    setPromotions(prev => prev.map(p => p.id === promoId ? { ...p, status: 'cancelled' } : p));
    showToast('Промоакция отменена', 'info');
  };

  const goBack = () => {
    if ((window as any).__hubigrNavigate) (window as any).__hubigrNavigate('/creator-dashboard');
  };

  return (
    <div className="w-full min-h-screen bg-bgDefault pt-16 md:pt-24 pb-28 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        
        {/* TOP REVISION BANNER (FE-MKT-004: Two-phase revision status) */}
        <div className="mb-6 bg-surface-1 border border-borderDef/70 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-textTertiary">
                Двухфазная модель ревизий (FE-MKT-004):
              </span>
              {gameStatus === 'published' ? (
                <Badge variant="success" size="sm" className="font-mono">
                  LIVE: {currentLiveVersion} (В каталоге)
                </Badge>
              ) : (
                <Badge variant="neutral" size="sm" className="font-mono">
                  ИГРА: Черновик
                </Badge>
              )}

              {candidateStatus === 'on_moderation' && (
                <Badge variant="warning" size="sm" className="font-mono animate-pulse">
                  Новая редакция {candidateVersion}: На модерации
                </Badge>
              )}
              {candidateStatus === 'draft' && (
                <Badge variant="neutral" size="sm" className="font-mono">
                  Кандидат {candidateVersion}: Черновик
                </Badge>
              )}
              {candidateStatus === 'approved' && (
                <Badge variant="success" size="sm" className="font-mono">
                  Кандидат {candidateVersion}: Одобрена
                </Badge>
              )}
              {candidateStatus === 'rejected' && (
                <Badge variant="danger" size="sm" className="font-mono">
                  Кандидат {candidateVersion}: Отклонена
                </Badge>
              )}
            </div>

            <p className="text-xs text-textSecondary leading-relaxed">
              {gameStatus === 'published' && candidateStatus === 'on_moderation'
                ? `Действующая версия ${currentLiveVersion} остается доступной игрокам в маркете, пока новая редакция ${candidateVersion} проверяется модератором.`
                : gameStatus === 'published' && candidateStatus === 'rejected'
                ? `Предыдущая одобренная версия ${currentLiveVersion} доступна в каталоге без изменений. Ознакомьтесь с замечаниями модератора для версии ${candidateVersion}.`
                : gameStatus === 'published'
                ? `Текущая опубликованная версия: ${currentLiveVersion}. Вы можете готовить обновление ${candidateVersion}.`
                : 'Игра находится на этапе первичной подготовки. Перед публикацией требуется модерация маркета.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {candidateStatus === 'rejected' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowModeratorNotes(!showModeratorNotes)}
                icon={<ShieldAlert className="w-4 h-4 text-danger" />}
              >
                {showModeratorNotes ? 'Скрыть замечания' : 'Замечания модератора'}
              </Button>
            )}
            {candidateStatus === 'draft' && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleSubmitForModeration}
                icon={<Upload className="w-4 h-4" />}
              >
                Отправить {candidateVersion} на проверку
              </Button>
            )}
            {candidateStatus === 'on_moderation' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleWithdrawFromModeration}
                icon={<XCircle className="w-4 h-4" />}
              >
                Отозвать с проверки
              </Button>
            )}
          </div>
        </div>

        {/* MODERATOR FEEDBACK CALLOUT (IF REJECTED) */}
        {candidateStatus === 'rejected' && showModeratorNotes && (
          <div className="mb-6 bg-danger/10 border border-danger/30 rounded-2xl p-4 text-xs text-textSecondary space-y-2 animate-fadeIn">
            <div className="flex items-center gap-2 text-danger font-bold text-sm">
              <ShieldAlert className="w-5 h-5" />
              <span>Замечания модератора маркета по ревизии {candidateVersion}:</span>
            </div>
            <div className="bg-surface-0 border border-danger/20 rounded-xl p-3 text-textPrimary font-mono text-xs">
              {moderatorFeedback}
            </div>
            <p className="text-[11px] text-textTertiary">
              Внесите исправления в файлы сборок или метаданные и нажмите «Отправить на проверку» повторно. Действующая версия {currentLiveVersion} продолжает работать в каталоге.
            </p>
          </div>
        )}

        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={goBack}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-1 hover:bg-surface-2 text-textPrimary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-textPrimary uppercase tracking-tight">
                {gameId ? 'Редактирование игры' : 'Новая игра'}
              </h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="px-2 py-0.5 rounded-sm text-caption font-bold bg-accent/20 text-accent border border-accent/40 flex items-center gap-1">
                  Автор: {authorName}
                </span>
                <span className="px-2 py-0.5 rounded-sm bg-surface-2 text-textSecondary text-caption font-bold uppercase tracking-wider">
                  Listed в каталоге
                </span>
                <span className={`px-2 py-0.5 rounded-sm text-white text-caption font-bold uppercase tracking-wider ${onSale ? 'bg-success' : 'bg-danger'}`}>
                  {onSale ? 'On Sale' : 'Off Sale'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={handleSaveDraft} icon={<Save className="w-4 h-4" />}>
              Сохранить draft
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                if ((window as any).__hubigrNavigate) (window as any).__hubigrNavigate(`/games/cyber-quest-neon`);
              }}
              icon={<ExternalLink className="w-4 h-4" />}
            >
              Предпросмотр
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR TABS */}
          <div className="w-full lg:w-64 shrink-0 flex flex-col gap-2">
            {[
              { id: 'general', label: 'Основная инфа', icon: FileText },
              { id: 'media', label: 'Медиа и обложка', icon: ImageIcon },
              { id: 'builds', label: 'Сборки и релизы', icon: Upload, count: Object.values(candidateBuilds).filter(b => b.status === 'ready').length },
              { id: 'commercial', label: 'Коммерция и цена', icon: DollarSign },
              { id: 'promotions', label: 'Промоакции и скидки', icon: Percent, count: promotions.filter(p => p.status === 'active' || p.status === 'scheduled').length },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-3 rounded-control text-left font-bold transition-all duration-fast flex items-center justify-between ${
                    activeTab === tab.id 
                      ? 'bg-accent/10 text-accent border border-accent/20' 
                      : 'bg-surface-0 text-textSecondary hover:bg-surface-1'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-surface-2 text-textPrimary font-mono">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* MAIN CONTENT */}
          <div className="flex-1 bg-surface-1 border border-borderDef rounded-card p-6 md:p-8 shadow-sm">
            
            {/* TAB 1: GENERAL */}
            {activeTab === 'general' && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-xl font-bold text-textPrimary mb-1">Основная информация об игре</h2>
                  <p className="text-xs text-textSecondary">Минимальные обязательные поля для сохранения черновика: Название, Краткое описание и Жанр.</p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-caption font-semibold text-textSecondary uppercase">Название игры *</label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Например, Cyber Quest" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-caption font-semibold text-textSecondary uppercase">Краткое описание (Tagline) *</label>
                  <Input value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="В одно предложение для карточки каталога..." />
                </div>

                <div className="space-y-2">
                  <label className="text-caption font-semibold text-textSecondary uppercase">Жанр *</label>
                  <CustomSelect options={GENRES} value={genre} onChange={setGenre} placeholder="Выберите жанр" />
                </div>

                <div className="space-y-2">
                  <label className="text-caption font-semibold text-textSecondary uppercase">Полное описание страницы</label>
                  <textarea 
                    rows={6}
                    className="w-full bg-surface-0 border border-borderDef rounded-control p-4 text-xs text-textPrimary focus:border-accent focus:outline-none transition-colors resize-y leading-relaxed"
                    placeholder="Подробное описание геймплея, сюжета и особенностей игры..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* TAB 2: MEDIA */}
            {activeTab === 'media' && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-xl font-bold text-textPrimary mb-1">Медиа материалы</h2>
                  <p className="text-xs text-textSecondary">Обложка и промо-кадры для витрины маркета.</p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-caption font-semibold text-textSecondary uppercase">Основная обложка (16:9) *</label>
                  <div 
                    className={`w-full h-48 border-2 border-dashed rounded-card flex flex-col items-center justify-center cursor-pointer transition-colors ${
                      coverUploaded ? 'border-accent bg-accent/5' : 'border-borderDef hover:border-textTertiary'
                    }`}
                    onClick={() => setCoverUploaded(true)}
                  >
                    {coverUploaded ? (
                      <>
                        <CheckCircle2 className="w-10 h-10 text-accent mb-2" />
                        <span className="text-sm font-bold text-textPrimary">Обложка загружена (1920×1080)</span>
                        <span className="text-xs text-accent mt-1 hover:underline">Заменить файл</span>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-10 h-10 text-textTertiary mb-2" />
                        <span className="text-sm font-bold text-textSecondary">Нажмите для загрузки обложки (JPG, PNG)</span>
                        <span className="text-xs text-textTertiary mt-1">Рекомендуемый размер 1920×1080</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: BUILDS (FE-MKT-010) */}
            {activeTab === 'builds' && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-xl font-bold text-textPrimary mb-1">
                    Управление сборками и релизом
                  </h2>
                  <p className="text-xs text-textSecondary">
                    Загрузка исполняемых файлов для целевых платформ, семантическое версионирование и список изменений (Changelog).
                  </p>
                </div>

                {/* Release Version & Changelog Inputs */}
                <div className="bg-surface-0 border border-borderDef rounded-xl p-5 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-caption font-bold text-textSecondary uppercase">
                        Семантическая версия релиза (SemVer) *
                      </label>
                      <Input
                        value={candidateVersion}
                        onChange={(e) => setCandidateVersion(e.target.value)}
                        placeholder="v1.1.0"
                        className="font-mono font-bold"
                      />
                      <span className="text-[10px] text-textTertiary">
                        Формат: vX.Y.Z (например, v1.1.0 или v2.0.0)
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-caption font-bold text-textSecondary uppercase">
                        Действующая версия в маркете
                      </label>
                      <div className="h-10 bg-surface-2 rounded-control px-3 flex items-center justify-between border border-borderDef/60 font-mono text-xs">
                        <span className="text-textPrimary font-bold">{currentLiveVersion}</span>
                        <Badge variant="success" size="sm">Опубликована</Badge>
                      </div>
                      <span className="text-[10px] text-textTertiary">
                        Игроки продолжают играть в эту версию до утверждения новой
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-caption font-bold text-textSecondary uppercase flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-accent" />
                      <span>Список изменений (Changelog / Патчноут) *</span>
                    </label>
                    <textarea
                      rows={4}
                      value={changelog}
                      onChange={(e) => setChangelog(e.target.value)}
                      placeholder="Опишите ключевые изменения, новые фичи и исправления..."
                      className="w-full bg-surface-1 border border-borderDef rounded-control p-3 text-xs text-textPrimary focus:border-accent focus:outline-none transition-colors resize-y leading-relaxed font-sans"
                    />
                  </div>
                </div>

                {/* Platform Builds Grid */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-textTertiary uppercase tracking-wider">
                    Платформенные файлы ревизии {candidateVersion}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.values(candidateBuilds).map((build) => {
                      const isReady = build.status === 'ready';
                      const isUploading = build.status === 'uploading';

                      const renderPlatformIcon = () => {
                        switch (build.platform) {
                          case 'web': return <Globe className="w-5 h-5" />;
                          case 'win': return <Monitor className="w-5 h-5" />;
                          case 'mac': return <Apple className="w-5 h-5" />;
                          case 'linux': return <Terminal className="w-5 h-5" />;
                        }
                      };

                      return (
                        <div
                          key={build.platform}
                          className={`border rounded-2xl p-4 flex flex-col justify-between gap-3 transition-colors ${
                            isReady 
                              ? 'bg-surface-0 border-borderDef' 
                              : 'bg-surface-0/60 border-dashed border-borderDef/70'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                isReady ? 'bg-accent/10 text-accent' : 'bg-surface-2 text-textTertiary'
                              }`}>
                                {renderPlatformIcon()}
                              </div>
                              <div className="space-y-0.5">
                                <span className="font-bold text-textPrimary text-xs block">
                                  {build.label}
                                </span>
                                {isReady ? (
                                  <span className="text-[11px] font-mono text-textSecondary block truncate max-w-[170px]" title={build.filename || ''}>
                                    {build.filename}
                                  </span>
                                ) : (
                                  <span className="text-[11px] text-textTertiary block">
                                    Файл не прикреплен
                                  </span>
                                )}
                              </div>
                            </div>

                            {isReady && (
                              <Badge variant="success" size="sm" className="shrink-0 font-mono text-[10px]">
                                {build.size}
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-borderDef/40">
                            {isReady ? (
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-textTertiary">
                                  Загружено: {build.uploadedAt}
                                </span>
                              </div>
                            ) : (
                              <span className="text-[10px] text-textTertiary">
                                Архив ZIP / DMG / EXE
                              </span>
                            )}

                            <div className="flex items-center gap-2">
                              {isReady && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteBuild(build.platform)}
                                  className="p-1.5 text-textTertiary hover:text-danger rounded-lg transition-colors cursor-pointer"
                                  title="Удалить билд"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <Button
                                variant={isReady ? 'outline' : 'primary'}
                                size="sm"
                                isLoading={isUploading}
                                onClick={() => handleSimulateUpload(build.platform)}
                                icon={<Upload className="w-3.5 h-3.5" />}
                              >
                                {isReady ? 'Заменить' : 'Загрузить'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: COMMERCIAL */}
            {activeTab === 'commercial' && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-xl font-bold text-textPrimary mb-1">Коммерческие настройки (FE-MKT-005)</h2>
                  <p className="text-xs text-textSecondary">Управление платной/бесплатной моделью, базовой ценой и статусом доступности для покупки.</p>
                </div>
                
                <div className="bg-surface-0 border border-borderDef p-5 rounded-control">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-body font-bold text-textPrimary flex items-center gap-2">
                        Платная игра <DollarSign className="w-4 h-4 text-accent" />
                      </h4>
                      <p className="text-caption text-textSecondary">Если выключено, игра доступна всем пользователям бесплатно в один клик.</p>
                    </div>
                    <Switch checked={isPaid} onChange={setIsPaid} />
                  </div>
                  
                  {isPaid && (
                    <div className="border-t border-borderDef pt-4 mt-4 space-y-5 animate-fadeIn">
                      {!isSellerReady ? (
                        <div className="bg-warning/10 border border-warning/30 p-4 rounded-card space-y-2">
                          <p className="text-body-sm text-warning font-bold">Требуется заполнить профиль продавца</p>
                          <p className="text-xs text-warning/80">Для коммерческого размещения платных игр необходимо подтвердить статус разработчика и принять оферту.</p>
                          <Button variant="secondary" size="sm" onClick={() => setIsSellerReady(true)}>Подтвердить статус продавца (Mock)</Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="space-y-1.5">
                            <label className="text-caption font-semibold text-textSecondary uppercase">Базовая цена (RUB)</label>
                            <div className="flex items-center gap-3">
                              <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="max-w-[200px] font-mono font-bold" />
                              <span className="text-sm font-bold text-textPrimary">₽</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between p-4 bg-surface-2 rounded-control border border-borderDef">
                            <div>
                              <h4 className="text-body font-bold text-textPrimary flex items-center gap-2">Статус продажи: {onSale ? 'Включены' : 'Остановлены'}</h4>
                              <p className="text-caption text-textSecondary">Остановка продаж скрывает кнопку покупки в маркете, но сохраняет доступ у всех текущих владельцев.</p>
                            </div>
                            <Button 
                              variant={onSale ? "secondary" : "primary"} 
                              size="sm"
                              onClick={() => {
                                setOnSale(!onSale);
                                showToast(onSale ? 'Продажи остановлены' : 'Продажи запущены', onSale ? 'warning' : 'success');
                              }}
                              icon={onSale ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            >
                              {onSale ? 'Снять с продажи' : 'Вернуть в продажу'}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 5: PROMOTIONS & DISCOUNTS (FE-MKT-013) */}
            {activeTab === 'promotions' && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-xl font-bold text-textPrimary mb-1">
                    Управление промоакциями и скидками (FE-MKT-013)
                  </h2>
                  <p className="text-xs text-textSecondary">
                    Планирование временных скидок по расписанию, запуск бесплатных раздач (Giveaway) и участие в сезонных распродажах.
                  </p>
                </div>

                {/* 1. Schedule Discount Form */}
                <form onSubmit={handleScheduleDiscount} className="bg-surface-0 border border-borderDef rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-textPrimary flex items-center gap-2">
                        <Percent className="w-4 h-4 text-accent" />
                        <span>Запланировать скидку (Discount Scheduler)</span>
                      </h4>
                      <p className="text-xs text-textSecondary">Скидка автоматически активируется и завершится в указанные даты.</p>
                    </div>
                  </div>

                  {/* Preset Percent Pills */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase text-textTertiary">Размер скидки</label>
                    <div className="flex flex-wrap items-center gap-2">
                      {[10, 20, 30, 40, 50, 75].map(pct => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => setDiscountPercent(pct)}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono transition-colors cursor-pointer ${
                            discountPercent === pct 
                              ? 'bg-accent text-white shadow-sm' 
                              : 'bg-surface-1 border border-borderDef text-textSecondary hover:border-accent'
                          }`}
                        >
                          -{pct}%
                        </button>
                      ))}
                      <div className="flex items-center gap-1.5 ml-2">
                        <span className="text-xs text-textTertiary">Новая цена:</span>
                        <span className="text-sm font-black font-mono text-success">
                          {Math.round(Number(price || 0) * (1 - discountPercent / 100))} ₽
                        </span>
                        <span className="text-xs text-textTertiary line-through">({price} ₽)</span>
                      </div>
                    </div>
                  </div>

                  {/* Date Range Scheduler */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase text-textTertiary flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-accent" />
                        <span>Дата и время начала</span>
                      </label>
                      <Input
                        type="datetime-local"
                        value={discountStartsAt}
                        onChange={(e) => setDiscountStartsAt(e.target.value)}
                        className="font-mono text-xs"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase text-textTertiary flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-accent" />
                        <span>Дата и время окончания</span>
                      </label>
                      <Input
                        type="datetime-local"
                        value={discountEndsAt}
                        onChange={(e) => setDiscountEndsAt(e.target.value)}
                        className="font-mono text-xs"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button variant="primary" size="sm" type="submit" icon={<Sparkles className="w-4 h-4" />}>
                      Запланировать скидку -{discountPercent}%
                    </Button>
                  </div>
                </form>

                {/* 2. Free Giveaway & Platform Sale */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Giveaway Box */}
                  <div className="bg-surface-0 border border-borderDef rounded-2xl p-5 flex flex-col justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-textPrimary flex items-center gap-2">
                        <Gift className="w-4 h-4 text-accent" />
                        <span>Бесплатная раздача (Giveaway 100%)</span>
                      </h4>
                      <p className="text-xs text-textSecondary leading-relaxed">
                        Временная раздача игры со скидкой 100%. Получатели сохраняют бессрочный доступ навсегда.
                      </p>
                    </div>
                    <Button variant="secondary" size="sm" onClick={handleLaunchGiveaway} icon={<Gift className="w-4 h-4" />}>
                      Запустить Giveaway на 24ч
                    </Button>
                  </div>

                  {/* MarketSale Campaign Participation */}
                  <div className="bg-surface-0 border border-borderDef rounded-2xl p-5 flex flex-col justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-textPrimary flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-warning" />
                          <span>Распродажа «Осенний фестиваль 2026»</span>
                        </h4>
                        <Badge variant={isCampaignJoined ? 'success' : 'neutral'} size="sm">
                          {isCampaignJoined ? 'Участвует' : 'Доступно'}
                        </Badge>
                      </div>
                      <p className="text-xs text-textSecondary leading-relaxed">
                        Общеплатформенная кампания маркета (MarketSale). Период: 15.09 — 22.09.
                      </p>
                    </div>
                    <Button 
                      variant={isCampaignJoined ? 'outline' : 'primary'} 
                      size="sm" 
                      onClick={() => {
                        setIsCampaignJoined(!isCampaignJoined);
                        showToast(isCampaignJoined ? 'Заявка на участие отозвана' : 'Игра включена в список участников распродажи', isCampaignJoined ? 'info' : 'success');
                      }}
                    >
                      {isCampaignJoined ? 'Выйти из кампании' : 'Подать заявку на участие'}
                    </Button>
                  </div>
                </div>

                {/* 3. Scheduled Promotions History List */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-bold text-textTertiary uppercase tracking-wider">
                    Активные и запланированные промоакции
                  </h3>

                  <div className="bg-surface-0 border border-borderDef rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs whitespace-nowrap">
                      <thead className="bg-surface-2 border-b border-borderDef text-textTertiary font-mono uppercase">
                        <tr>
                          <th className="px-4 py-3">Тип промо</th>
                          <th className="px-4 py-3">Скидка</th>
                          <th className="px-4 py-3">Период действия</th>
                          <th className="px-4 py-3">Статус</th>
                          <th className="px-4 py-3 text-right">Действие</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-borderDef/40">
                        {promotions.map(promo => (
                          <tr key={promo.id} className="hover:bg-surface-1/50 transition-colors">
                            <td className="px-4 py-3 font-semibold text-textPrimary">
                              {promo.type === 'giveaway' ? 'Бесплатная раздача (Giveaway)' : 'Скидка по расписанию'}
                            </td>
                            <td className="px-4 py-3 font-mono font-bold text-success">
                              {promo.type === 'giveaway' ? '-100%' : `-${promo.discountPercent}%`}
                            </td>
                            <td className="px-4 py-3 font-mono text-textSecondary text-[11px]">
                              {promo.startsAt} — {promo.endsAt}
                            </td>
                            <td className="px-4 py-3">
                              {promo.status === 'active' && <Badge variant="success" size="sm">Активна</Badge>}
                              {promo.status === 'scheduled' && <Badge variant="warning" size="sm">Запланирована</Badge>}
                              {promo.status === 'ended' && <Badge variant="neutral" size="sm">Завершена</Badge>}
                              {promo.status === 'cancelled' && <Badge variant="danger" size="sm">Отменена</Badge>}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {(promo.status === 'scheduled' || promo.status === 'active') && (
                                <button
                                  type="button"
                                  onClick={() => handleCancelPromo(promo.id)}
                                  className="text-textTertiary hover:text-danger font-semibold transition-colors cursor-pointer text-xs"
                                >
                                  Отменить
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* DANGER ZONE: Complete Deletion (AC-MKT-012, BR-MKT-006, BR-MKT-007) */}
            <div className="mt-10 pt-8 border-t border-borderDef/60">
              <div className="bg-surface-0 border border-danger/30 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3 text-danger pb-3 border-b border-borderDef">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <h3 className="text-base font-bold text-textPrimary">Опасная зона: Удаление игры</h3>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-textPrimary">Безвозвратное удаление игры</div>
                    {ownersCount > 0 ? (
                      <div className="text-xs text-textSecondary leading-relaxed max-w-xl">
                        <span className="text-warning font-semibold">Удаление невозможно: у игры есть {ownersCount} владельцев (покупателей).</span>{' '}
                        В соответствии с правилами маркета, игры с существующими правами владения нельзя удалить безвозвратно. Вы можете снять игру с продажи во вкладке «Коммерция».
                      </div>
                    ) : (
                      <div className="text-xs text-textSecondary leading-relaxed max-w-xl">
                        У игры нет покупателей и добавлений в библиотеки. Полное удаление сотрёт все метаданные, описания, обложки и связанные сборки.
                      </div>
                    )}
                  </div>

                  {ownersCount > 0 ? (
                    <div className="flex items-center gap-2 shrink-0">
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled
                        className="opacity-50 cursor-not-allowed border-danger/30 text-danger"
                        icon={<Trash2 className="w-4 h-4" />}
                      >
                        Удалить игру
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setActiveTab('commercial')}
                      >
                        Снять с продажи
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="danger"
                      size="sm"
                      icon={<Trash2 className="w-4 h-4" />}
                      onClick={() => setIsDeleteModalOpen(true)}
                    >
                      Удалить игру
                    </Button>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>


      {/* DELETE GAME MODAL (AC-MKT-012, BR-MKT-006) */}
      {typeof document !== 'undefined' && isDeleteModalOpen && createPortal(
        <div className="fixed inset-0 z-modal flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="fixed inset-0" onClick={() => setIsDeleteModalOpen(false)} aria-hidden="true" />
          <div className="relative z-10 bg-surface-1 border border-danger/40 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-center gap-3 text-danger pb-3 border-b border-borderDef">
              <Trash2 className="w-5 h-5 shrink-0" />
              <h3 className="text-base font-bold text-textPrimary">Удаление игры</h3>
            </div>
            <p className="text-xs text-textSecondary leading-relaxed">
              Вы действительно хотите полностью удалить игру <strong className="text-textPrimary">«{title || 'Без названия'}»</strong>?
            </p>
            <div className="bg-danger/10 border border-danger/30 text-danger text-xs p-3 rounded-xl">
              Это действие необратимо. Черновик игры, все медиафайлы и загруженные сборки будут безвозвратно удалены.
            </div>
            <div className="flex justify-end gap-3 pt-2 border-t border-borderDef/50">
              <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>Отмена</Button>
              <Button variant="danger" onClick={handleConfirmDeleteGame}>Удалить безвозвратно</Button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* DevMatrixPanel for QA Verification */}
      <DevMatrixPanel
        pageName="Редактор игры"
        fields={[
          {
            id: 'gameStatus',
            label: 'Статус игры',
            type: 'buttons',
            value: gameStatus,
            onChange: (val) => setGameStatus(val as any),
            options: [
              { value: 'draft', label: 'Черновик' },
              { value: 'published', label: 'Published (Live)' },
            ],
          },
          {
            id: 'candidateStatus',
            label: 'Статус ревизии',
            type: 'buttons',
            value: candidateStatus,
            onChange: (val) => setCandidateStatus(val as any),
            options: [
              { value: 'draft', label: 'Draft' },
              { value: 'on_moderation', label: 'On Moderation' },
              { value: 'approved', label: 'Approved' },
              { value: 'rejected', label: 'Rejected' },
            ],
          },
          {
            id: 'isPaid',
            label: 'Платная игра',
            type: 'checkbox',
            value: isPaid,
            onChange: setIsPaid,
          },
          {
            id: 'isSellerReady',
            label: 'Профиль продавца',
            type: 'checkbox',
            value: isSellerReady,
            onChange: setIsSellerReady,
          },
          {
            id: 'onSale',
            label: 'Продажи (On Sale)',
            type: 'checkbox',
            value: onSale,
            onChange: setOnSale,
          },
          {
            id: 'ownersCount',
            label: 'Владельцы (покупатели)',
            type: 'buttons',
            value: String(ownersCount),
            onChange: (val) => setOwnersCount(Number(val)),
            options: [
              { value: '0', label: '0 (Черновик / без покупок)' },
              { value: '142', label: '142 (Есть покупатели)' },
            ],
          },
        ]}
      />
    </div>
  );
}
