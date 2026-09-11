import React, { useState } from 'react';
import { 
  Shield, CheckCircle, XCircle, Search, Filter, AlertTriangle, 
  Eye, ArrowRight, UserX, Clock, MessageSquare, Users, RotateCcw,
  ShieldAlert, CheckCircle2, DollarSign, FileText, Lock, RefreshCw,
  Info, Sparkles
} from 'lucide-react';
import Button from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../components/ui/Toast';
import { CustomSelect } from '../components/ui/Select';
import Input from '../components/ui/Input';
import DevMatrixPanel, { DevMatrixField } from '../components/DevMatrixPanel';

// 1. Mock Data for Moderation Queue (FE-MKT-004, FE-MKT-010)
const MOCK_QUEUE = [
  { 
    id: 'rev-1', 
    gameId: 'cyber-quest-neon', 
    title: 'Cyber Quest: Origins', 
    author: '@snikitin', 
    type: 'new_game', 
    status: 'on_moderation', 
    version: 'v1.0.0',
    changelog: 'Первый релиз игры в маркете. Поддержка WebGL и Windows.',
    submittedAt: '2026-09-06T10:00', 
    price: 350 
  },
  { 
    id: 'rev-2', 
    gameId: 'stellar-drift', 
    title: 'Space Runner Tactics', 
    author: '@alex_dev', 
    type: 'update', 
    status: 'on_moderation', 
    version: 'v1.2.0',
    liveVersion: 'v1.1.4',
    changelog: '• Добавлена новая галактическая трасса\n• Исправлены падения FPS на macOS\n• Обновлен саундтрек',
    submittedAt: '2026-09-06T11:30', 
    price: 0 
  },
  { 
    id: 'rev-3', 
    gameId: 'pixel-dungeon', 
    title: 'Dark Fantasy RPG: Chronicles', 
    author: '@rpg_master', 
    type: 'new_game', 
    status: 'on_moderation', 
    version: 'v0.9.5-beta',
    changelog: 'Бета-версия ролевой игры для раннего доступа.',
    submittedAt: '2026-09-05T18:15', 
    price: 1200 
  },
];

// 2. Mock Reported Games (FE-MKT-016, AC-MKT-085, SC-MKT-043/044)
export interface ReportedGame {
  id: string;
  title: string;
  author: string;
  reportsCount: number;
  reportReasons: string[];
  restrictionState: 'active' | 'ordinary_restricted' | 'sales_stopped' | 'full_revoked';
  lastReportedAt: string;
}

const MOCK_REPORTED_GAMES: ReportedGame[] = [
  {
    id: 'rep-g1',
    title: 'Stolen Assets Cyber Adventure',
    author: '@shadow_scammer',
    reportsCount: 14,
    reportReasons: ['Плагиат коммерческих ассетов (8)', 'Недопустимый контент (6)'],
    restrictionState: 'active',
    lastReportedAt: 'Сегодня, 14:10',
  },
  {
    id: 'rep-g2',
    title: 'Suspicious Crypto Miner WebGL',
    author: '@dark_hacker',
    reportsCount: 48,
    reportReasons: ['Подозрение на вредоносный код (42)', 'Фризы системы (6)'],
    restrictionState: 'ordinary_restricted',
    lastReportedAt: 'Вчера, 20:30',
  },
  {
    id: 'rep-g3',
    title: 'Offensive Battle Royale Arena',
    author: '@troll_dev',
    reportsCount: 8,
    reportReasons: ['Оскорбительные материалы в текстурах (8)'],
    restrictionState: 'sales_stopped',
    lastReportedAt: '05 сентября 2026',
  },
];

// 3. Mock Refund Cases (FE-MKT-016, SC-MKT-042/045, MKT-API-015/016)
export interface AdminRefundCase {
  id: string;
  orderId: string;
  gameTitle: string;
  buyer: string;
  amount: number;
  reason: string;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

const MOCK_REFUND_CASES: AdminRefundCase[] = [
  {
    id: 'REF-2026-9812',
    orderId: '#ORD-2026-9812',
    gameTitle: 'Cyber Quest: Neon Awakening',
    buyer: '@alex_player',
    amount: 350,
    reason: 'Технические проблемы / не запускается',
    comment: 'Игра крашится при запуске на Windows 11 с видеокартой Intel Arc.',
    status: 'pending',
    date: 'Сегодня, 12:45',
  },
  {
    id: 'REF-2026-8740',
    orderId: '#ORD-2026-8740',
    gameTitle: 'Space Runner Tactics',
    buyer: '@dmitry_gamer',
    amount: 500,
    reason: 'Куплено по ошибке',
    comment: 'Случайно оплатил второй раз вместо DLC.',
    status: 'pending',
    date: 'Вчера, 18:20',
  },
  {
    id: 'REF-2026-7611',
    orderId: '#ORD-2026-7611',
    gameTitle: 'Abyssal Soulslike',
    buyer: '@pro_soul',
    amount: 600,
    reason: 'Не подошли системные требования',
    comment: 'Слишком низкий FPS на моем ноутбуке.',
    status: 'approved',
    date: '02 сентября 2026',
  },
];

export default function MarketAdminPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'queue' | 'reports' | 'financial' | 'teams'>('queue');
  
  // Moderation Queue State
  const [queue, setQueue] = useState(MOCK_QUEUE);
  const [selectedRev, setSelectedRev] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Reported Games State
  const [reportedGames, setReportedGames] = useState<ReportedGame[]>(MOCK_REPORTED_GAMES);

  // Refund Cases State
  const [refundCases, setRefundCases] = useState<AdminRefundCase[]>(MOCK_REFUND_CASES);
  const [rejectRefundComment, setRejectRefundComment] = useState('');
  const [activeRejectCaseId, setActiveRejectCaseId] = useState<string | null>(null);

  // Admin Role (QA DevMatrix)
  const [adminRole, setAdminRole] = useState<'super_admin' | 'moderator'>('super_admin');

  // Queue Handlers
  const handleApprove = (id: string) => {
    setQueue(prev => prev.filter(item => item.id !== id));
    setSelectedRev(null);
    showToast('Ревизия успешно одобрена и опубликована в маркете', 'success');
  };

  const handleReject = (id: string) => {
    if (!rejectReason.trim()) {
      showToast('Укажите причину отказа модерации', 'warning');
      return;
    }
    setQueue(prev => prev.filter(item => item.id !== id));
    setSelectedRev(null);
    setRejectReason('');
    showToast('Ревизия отклонена. Замечания переданы автору.', 'success');
  };

  // Administrative Game Restrictions (FE-MKT-016, SC-MKT-043/044, AC-MKT-085)
  const handleApplyRestriction = (gameId: string, state: ReportedGame['restrictionState'], label: string) => {
    setReportedGames(prev => prev.map(g => g.id === gameId ? { ...g, restrictionState: state } : g));
    showToast(`Статус игры обновлен: ${label}`, 'info');
  };

  // Refund Handlers (SC-MKT-045, MKT-API-015/016)
  const handleApproveRefund = (caseId: string) => {
    setRefundCases(prev => prev.map(c => c.id === caseId ? { ...c, status: 'approved' } : c));
    showToast(`Возврат по заявке ${caseId} одобрен. Цифровой доступ покупателя аннулирован`, 'success');
  };

  const handleRejectRefund = (caseId: string) => {
    setRefundCases(prev => prev.map(c => c.id === caseId ? { ...c, status: 'rejected' } : c));
    setActiveRejectCaseId(null);
    setRejectRefundComment('');
    showToast(`Заявка на возврат ${caseId} отклонена. Пользователь уведомлен.`, 'info');
  };

  return (
    <div className="w-full min-h-screen bg-bgDefault pt-16 md:pt-24 pb-28 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-textPrimary uppercase tracking-tight flex items-center gap-3">
              <Shield className="w-8 h-8 text-accent" />
              <span>Панель администрирования маркета</span>
            </h1>
            <p className="text-xs text-textSecondary mt-1">
              Модерация ревизий, проверка жалоб, ручное рассмотрение возвратов и ограничения каталога
            </p>
          </div>
          <div className="flex items-center gap-3 bg-surface-1 p-2.5 rounded-xl border border-borderDef/70">
            <span className="text-xs font-bold text-textSecondary uppercase font-mono px-2">Ваша роль:</span>
            <Badge variant={adminRole === 'super_admin' ? 'accent' : 'neutral'}>
              {adminRole === 'super_admin' ? 'Super Admin' : 'Market Moderator'}
            </Badge>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* SIDEBAR TABS */}
          <div className="w-full lg:w-64 shrink-0 flex flex-col gap-2">
            {[
              { id: 'queue', label: 'Очередь модерации', icon: Clock, count: queue.length },
              { id: 'reports', label: 'Каталог и жалобы', icon: AlertTriangle, count: reportedGames.filter(g => g.restrictionState === 'active').length },
              { id: 'financial', label: 'Заявки на возврат', icon: DollarSign, count: refundCases.filter(c => c.status === 'pending').length },
              { id: 'teams', label: 'Команды (Admin)', icon: Users, count: 2 },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id as any); setSelectedRev(null); }}
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
                  {tab.count > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                      activeTab === tab.id ? 'bg-accent text-white font-bold' : 'bg-surface-2 text-textPrimary'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* MAIN CONTENT */}
          <div className="flex-1">
            
            {/* TAB 1: MODERATION QUEUE (FE-MKT-004, FE-MKT-010) */}
            {activeTab === 'queue' && (
              <div className="flex flex-col lg:flex-row gap-6 min-h-[600px]">
                
                {/* QUEUE LIST */}
                <div className="flex-1 bg-surface-1 border border-borderDef rounded-card overflow-hidden flex flex-col shadow-sm">
                  <div className="p-4 border-b border-borderDef bg-surface-2/60 flex items-center justify-between">
                    <h2 className="font-bold text-textPrimary uppercase text-xs tracking-wider font-mono">
                      Очередь ревизий
                    </h2>
                    <Badge variant="neutral" size="sm" className="font-mono">
                      {queue.length} в ожидании
                    </Badge>
                  </div>

                  <div className="overflow-y-auto flex-1 p-3 space-y-2.5">
                    {queue.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-textTertiary py-16">
                        <CheckCircle className="w-12 h-12 mb-3 text-success/50" />
                        <p className="font-bold text-textPrimary text-sm">Очередь модерации пуста</p>
                        <p className="text-xs text-textTertiary mt-1">Все ревизии проверены.</p>
                      </div>
                    ) : (
                      queue.map(item => (
                        <div 
                          key={item.id}
                          onClick={() => setSelectedRev(item)}
                          className={`p-4 rounded-xl border cursor-pointer transition-colors ${
                            selectedRev?.id === item.id 
                              ? 'bg-accent/10 border-accent shadow-sm' 
                              : 'bg-surface-0 border-borderDef hover:border-textTertiary'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-bold text-textPrimary text-sm truncate pr-3">{item.title}</span>
                            <Badge variant={item.type === 'new_game' ? 'accent' : 'info'} size="sm" className="font-mono text-[10px]">
                              {item.type === 'new_game' ? 'Новая игра' : 'Обновление'}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-xs text-textSecondary font-mono">
                            <span>Автор: <span className="text-accent">{item.author}</span></span>
                            <span className="font-bold text-textPrimary">{item.version}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* REVIEW PANEL */}
                {selectedRev && (
                  <div className="w-full lg:w-[420px] shrink-0 bg-surface-1 border border-borderDef rounded-card flex flex-col shadow-sm animate-fadeIn">
                    <div className="p-4 border-b border-borderDef bg-surface-2/60 flex items-center justify-between">
                      <h2 className="font-bold text-textPrimary uppercase text-xs tracking-wider font-mono">
                        Инспекция ревизии {selectedRev.id}
                      </h2>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
                      <div>
                        <p className="text-[10px] font-bold text-textTertiary uppercase font-mono mb-1">Игра и ревизия (FE-MKT-004)</p>
                        <p className="font-bold text-base text-textPrimary">{selectedRev.title}</p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <Badge variant="accent" size="sm" className="font-mono">
                            Кандидат: {selectedRev.version}
                          </Badge>
                          {selectedRev.liveVersion && (
                            <Badge variant="success" size="sm" className="font-mono">
                              LIVE сейчас: {selectedRev.liveVersion}
                            </Badge>
                          )}
                        </div>
                        <a 
                          href={`/games/${selectedRev.gameId}`} 
                          target="_blank"
                          rel="noreferrer"
                          className="text-accent text-xs hover:underline flex items-center gap-1 mt-2 font-medium"
                        >
                          Смотреть карточку игры в маркете <Eye className="w-3.5 h-3.5" />
                        </a>
                      </div>

                      {selectedRev.changelog && (
                        <div className="bg-surface-0 border border-borderDef rounded-xl p-3.5 space-y-1">
                          <p className="text-[10px] font-bold text-textTertiary uppercase font-mono">
                            Патчноут / Список изменений:
                          </p>
                          <p className="text-xs text-textSecondary whitespace-pre-line leading-relaxed font-sans">
                            {selectedRev.changelog}
                          </p>
                        </div>
                      )}

                      <div className="p-3.5 bg-surface-0 border border-borderDef rounded-xl space-y-2.5">
                        <div className="flex justify-between">
                          <span className="text-textSecondary">Билды:</span>
                          <span className="font-bold text-success flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Win, WebGL, macOS
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-textSecondary">Антивирус / Проверка кода:</span>
                          <span className="font-bold text-success">Clean (0 угроз)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-textSecondary">Стоимость:</span>
                          <span className="font-bold text-textPrimary font-mono">
                            {selectedRev.price > 0 ? `${selectedRev.price} ₽` : 'Бесплатно'}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-textTertiary uppercase font-mono">
                          Замечания для автора (при отказе)
                        </p>
                        <textarea 
                          rows={3}
                          value={rejectReason}
                          onChange={e => setRejectReason(e.target.value)}
                          placeholder="Укажите, что необходимо исправить в файлах сборки или метаданных..."
                          className="w-full bg-surface-0 border border-borderDef rounded-xl p-3 text-xs text-textPrimary focus:border-danger focus:outline-none transition-colors leading-relaxed"
                        />
                      </div>
                    </div>

                    <div className="p-4 border-t border-borderDef bg-surface-0 flex gap-3">
                      <Button 
                        variant="primary" 
                        fullWidth 
                        onClick={() => handleApprove(selectedRev.id)} 
                        className="bg-success hover:bg-success/90"
                        icon={<CheckCircle className="w-4 h-4" />}
                      >
                        Одобрить
                      </Button>
                      <Button 
                        variant="danger" 
                        fullWidth 
                        onClick={() => handleReject(selectedRev.id)}
                        icon={<XCircle className="w-4 h-4" />}
                      >
                        Отклонить
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: REPORTS & CATALOG RESTRICTIONS (FE-MKT-016, AC-MKT-085, SC-MKT-043/044) */}
            {activeTab === 'reports' && (
              <div className="bg-surface-1 border border-borderDef rounded-card p-6 shadow-sm space-y-6 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-borderDef/50 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-textPrimary">
                      Управление каталогом и жалобы
                    </h2>
                    <p className="text-xs text-textSecondary mt-0.5">
                      Правило модерации: количество жалоб само по себе никогда автоматически не снимает игру с публикации. Требуется явное решение модератора.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {reportedGames.map(game => (
                    <div 
                      key={game.id} 
                      className="p-5 bg-surface-0 border border-borderDef rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h4 className="font-bold text-textPrimary text-sm">{game.title}</h4>
                          <span className="text-xs text-textTertiary">({game.author})</span>
                          
                          {game.restrictionState === 'active' && (
                            <Badge variant="success" size="sm">В каталоге (Активна)</Badge>
                          )}
                          {game.restrictionState === 'ordinary_restricted' && (
                            <Badge variant="warning" size="sm">Скрыта (Ordinary Takedown)</Badge>
                          )}
                          {game.restrictionState === 'sales_stopped' && (
                            <Badge variant="warning" size="sm">Продажи остановлены</Badge>
                          )}
                          {game.restrictionState === 'full_revoked' && (
                            <Badge variant="danger" size="sm">Full Revoke (Изъята)</Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-xs text-textSecondary">
                          <span className="text-danger font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" /> 
                            Жалоб: {game.reportsCount}
                          </span>
                          <span className="text-textTertiary">•</span>
                          <span className="text-textTertiary">Последняя жалоба: {game.lastReportedAt}</span>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap pt-1">
                          {game.reportReasons.map((r, i) => (
                            <span key={i} className="text-[11px] bg-surface-2 text-textSecondary px-2 py-0.5 rounded-md border border-borderDef/50 font-mono">
                              {r}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action buttons adhering strictly to SC-MKT-043/044 */}
                      <div className="flex items-center gap-2 shrink-0 flex-wrap">
                        {game.restrictionState === 'active' ? (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleApplyRestriction(game.id, 'sales_stopped', 'Продажи остановлены')}
                            >
                              Стоп продажи
                            </Button>
                            <Button 
                              variant="secondary" 
                              size="sm"
                              onClick={() => handleApplyRestriction(game.id, 'ordinary_restricted', 'Скрыта из каталога (Ordinary Takedown)')}
                              title="Существующие владельцы сохраняют доступ в Библиотеке"
                            >
                              Скрыть (Ordinary)
                            </Button>
                            <Button 
                              variant="danger" 
                              size="sm"
                              onClick={() => handleApplyRestriction(game.id, 'full_revoked', 'Full Revoke (Изъято у всех)')}
                              title="Критическое основание (вирусы/вредоносный контент). Полное аннулирование доступа"
                            >
                              Full Revoke
                            </Button>
                          </>
                        ) : (
                          <Button 
                            variant="primary" 
                            size="sm"
                            onClick={() => handleApplyRestriction(game.id, 'active', 'Ограничения сняты, игра восстановлена')}
                            icon={<RefreshCw className="w-3.5 h-3.5" />}
                          >
                            Восстановить в каталоге
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: REFUND CASES (FE-MKT-016, SC-MKT-042/045, MKT-API-015/016, TBD-10) */}
            {activeTab === 'financial' && (
              <div className="bg-surface-1 border border-borderDef rounded-card p-6 shadow-sm space-y-6 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-borderDef/50 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-textPrimary">
                      Журнал возвратов покупателей
                    </h2>
                    <p className="text-xs text-textSecondary mt-0.5">
                      Ручное рассмотрение заявок на возврат денежных средств. При одобрении цифровой доступ к игре аннулируется.
                    </p>
                  </div>
                  <Badge variant="neutral" size="sm" className="font-mono">
                    {refundCases.filter(c => c.status === 'pending').length} на рассмотрении
                  </Badge>
                </div>

                <div className="space-y-4">
                  {refundCases.map(c => (
                    <div 
                      key={c.id} 
                      className="p-5 bg-surface-0 border border-borderDef rounded-2xl flex flex-col gap-4 text-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-borderDef/40 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono font-bold text-textPrimary">{c.id}</span>
                          <span className="text-textTertiary font-mono">({c.orderId})</span>
                          <span className="text-textTertiary">•</span>
                          <span className="text-textSecondary">{c.date}</span>
                        </div>

                        <div>
                          {c.status === 'pending' && <Badge variant="warning" size="sm">На рассмотрении</Badge>}
                          {c.status === 'approved' && <Badge variant="success" size="sm">Возврат выполнен</Badge>}
                          {c.status === 'rejected' && <Badge variant="danger" size="sm">Отклонено</Badge>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <div>
                            <span className="text-textTertiary text-[11px] block">Товар / Игра:</span>
                            <span className="text-textPrimary font-bold text-sm">{c.gameTitle}</span>
                          </div>
                          <div>
                            <span className="text-textTertiary text-[11px] block">Покупатель:</span>
                            <span className="text-accent font-mono">{c.buyer}</span>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div>
                            <span className="text-textTertiary text-[11px] block">Причина:</span>
                            <span className="text-textPrimary font-semibold">{c.reason}</span>
                          </div>
                          <div>
                            <span className="text-textTertiary text-[11px] block">Сумма к возврату:</span>
                            <span className="text-success font-black font-mono text-base">{c.amount} ₽</span>
                          </div>
                        </div>
                      </div>

                      {c.comment && (
                        <div className="bg-surface-1 border border-borderDef/60 rounded-xl p-3 text-textSecondary leading-relaxed">
                          <span className="font-bold text-textPrimary block mb-1">Комментарий покупателя:</span>
                          {c.comment}
                        </div>
                      )}

                      {/* Pending Decision Actions */}
                      {c.status === 'pending' && (
                        <div className="flex items-center justify-end gap-3 pt-2 border-t border-borderDef/40">
                          {activeRejectCaseId === c.id ? (
                            <div className="flex items-center gap-2 w-full max-w-md">
                              <Input
                                size="sm"
                                placeholder="Причина отказа (например, наиграно > 2 часов)..."
                                value={rejectRefundComment}
                                onChange={(e) => setRejectRefundComment(e.target.value)}
                              />
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleRejectRefund(c.id)}
                              >
                                Подтвердить отказ
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setActiveRejectCaseId(null)}
                              >
                                Отмена
                              </Button>
                            </div>
                          ) : (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setActiveRejectCaseId(c.id)}
                              >
                                Отклонить заявку
                              </Button>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleApproveRefund(c.id)}
                                className="bg-success hover:bg-success/90"
                                icon={<CheckCircle className="w-4 h-4" />}
                              >
                                Одобрить возврат {c.amount} ₽
                              </Button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: TEAMS ADMIN */}
            {activeTab === 'teams' && (
              <div className="bg-surface-1 border border-borderDef rounded-card p-6 shadow-sm space-y-6 animate-fadeIn">
                <h2 className="text-xl font-bold text-textPrimary">Управление студиями и командами (Super Admin)</h2>
                
                <div className="space-y-4">
                  {[
                    { id: 't1', name: 'Scam Studios', members: 4, reports: 3 },
                    { id: 't2', name: 'NocturnalDevs Studio', members: 12, reports: 0 },
                  ].map(team => (
                    <div key={team.id} className="p-4 bg-surface-0 border border-borderDef rounded-control flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-textPrimary text-sm">{team.name}</h4>
                        <p className="text-caption text-textSecondary mt-1">Участников: {team.members}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {team.reports > 0 && (
                          <span className="text-caption text-danger flex items-center gap-1 font-bold mr-2">
                            <AlertTriangle className="w-3.5 h-3.5" /> Жалоб: {team.reports}
                          </span>
                        )}
                        <Button variant="secondary" size="sm" onClick={() => showToast('Просмотр состава команды', 'info')}>
                          Состав
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => showToast('Команда заблокирована администратором', 'success')}>
                          Заблокировать
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* DevMatrixPanel for QA Testing */}
      <DevMatrixPanel
        pageName="Market Admin"
        fields={[
          {
            id: 'adminRole',
            label: 'Роль администратора',
            type: 'buttons',
            value: adminRole,
            onChange: (val) => setAdminRole(val as any),
            options: [
              { value: 'super_admin', label: 'Super Admin' },
              { value: 'moderator', label: 'Moderator' },
            ],
          },
        ]}
      />
    </div>
  );
}
