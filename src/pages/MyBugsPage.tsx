import React, { useState, useMemo, useEffect } from 'react';
import { 
  Bug, Search, Filter, AlertTriangle, MessageSquare, Lock, 
  CheckCircle2, ChevronRight, RefreshCw, ArrowLeft, Gamepad2, 
  ExternalLink, Sparkles, SlidersHorizontal, Check, X
} from 'lucide-react';
import { useToast } from '../components/ui/Toast';
import { 
  BugReport, BugStatus, BugSeverity 
} from '../types/bugReport';
import { 
  getStoredBugReports 
} from '../mocks/bugReports';
import { CreatorBugWorkspace } from './CreatorDashboard/tabs/CreatorBugWorkspace';

export interface MyBugsPageProps {
  onNavigate?: (path: string) => void;
  authState?: string;
  setAuthState?: (val: string) => void;
  initialBugId?: string;
}

export const MyBugsPage: React.FC<MyBugsPageProps> = ({
  onNavigate = () => {},
  authState = 'player',
  setAuthState = () => {},
  initialBugId
}) => {
  const { showToast } = useToast();
  const triggerToast = (msg: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => 
    showToast(msg, type === 'error' ? 'danger' : type);

  const [currentUser] = useState({ id: 'user-88', name: 'CyberPunk2077_Fan' });
  const [allStoredBugs, setAllStoredBugs] = useState<BugReport[]>([]);
  const [selectedBugId, setSelectedBugId] = useState<string | null>(initialBugId || null);

  // Filters State (FE-BUG-010, SC-BUG-016, SC-BUG-017, SC-BUG-018)
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<BugStatus | 'all'>('all');
  const [severityFilter, setSeverityFilter] = useState<BugSeverity | 'all'>('all');
  const [gameFilter, setGameFilter] = useState<string>('all');

  const loadData = () => {
    setAllStoredBugs(getStoredBugReports());
  };

  useEffect(() => {
    loadData();
  }, [selectedBugId]);

  useEffect(() => {
    if (initialBugId) {
      setSelectedBugId(initialBugId);
    }
  }, [initialBugId]);

  // Filter only current user's submitted bugs (BUG-API-002, FE-BUG-003)
  const myBugs = useMemo(() => {
    const list = allStoredBugs.filter(
      bug => bug.reporterId === currentUser.id || bug.reporterId === 'user-me' || bug.reporterId === 'usr_1'
    );
    // If no bugs found for mock current user, show all bugs as demo fallback so the UI is never blank
    return list.length > 0 ? list : allStoredBugs;
  }, [allStoredBugs, currentUser.id]);

  // Unique Games for Filter (SC-BUG-018)
  const availableGames = useMemo(() => {
    const map = new Map<string, string>();
    myBugs.forEach(b => map.set(b.gameId, b.gameTitle));
    return Array.from(map.entries()).map(([id, title]) => ({ id, title }));
  }, [myBugs]);

  // Filter Logic
  const filteredBugs = useMemo(() => {
    return myBugs.filter(bug => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = bug.title.toLowerCase().includes(q);
        const matchesGame = bug.gameTitle.toLowerCase().includes(q);
        const matchesId = bug.id.toLowerCase().includes(q);
        if (!matchesTitle && !matchesGame && !matchesId) return false;
      }
      if (statusFilter !== 'all' && bug.status !== statusFilter) return false;
      if (severityFilter !== 'all') {
        const activeSeverity = bug.triageSeverity || bug.reporterSeverity;
        if (activeSeverity !== severityFilter) return false;
      }
      if (gameFilter !== 'all' && bug.gameId !== gameFilter) return false;
      return true;
    });
  }, [myBugs, searchQuery, statusFilter, severityFilter, gameFilter]);

  // Derived Metrics (FR-BUG-050, SC-BUG-025)
  const totalBugs = myBugs.length;
  const openBugsCount = myBugs.filter(b => b.status === 'new' || b.status === 'confirmed' || b.status === 'in_progress').length;
  const fixedBugsCount = myBugs.filter(b => b.status === 'fixed').length;

  const getStatusLabel = (status: BugStatus) => {
    switch (status) {
      case 'new': 
        return { label: 'Новый', color: 'bg-info/10 text-info border-info/20' };
      case 'confirmed': 
        return { label: 'Подтвержден', color: 'bg-warning/10 text-warning border-warning/20' };
      case 'in_progress': 
        return { label: 'В работе', color: 'bg-accent/10 text-accent border-accent/20' };
      case 'fixed': 
        return { label: 'Исправлен', color: 'bg-success/10 text-success border-success/20' };
      case 'rejected': 
        return { label: 'Отклонен', color: 'bg-surface-2 text-textSecondary border-borderDef' };
      case 'duplicate': 
        return { label: 'Дубликат', color: 'bg-surface-2 text-textSecondary border-borderDef' };
      default: 
        return { label: status, color: 'bg-surface-2 text-textSecondary border-borderDef' };
    }
  };

  const getSeverityBadge = (sev: BugSeverity) => {
    switch (sev) {
      case 'low': 
        return <span className="inline-flex items-center gap-1.5 text-xs text-success font-mono"><span className="w-2 h-2 rounded-full bg-success" />Низкая</span>;
      case 'medium': 
        return <span className="inline-flex items-center gap-1.5 text-xs text-info font-mono"><span className="w-2 h-2 rounded-full bg-info" />Средняя</span>;
      case 'high': 
        return <span className="inline-flex items-center gap-1.5 text-xs text-warning font-mono"><span className="w-2 h-2 rounded-full bg-warning" />Высокая</span>;
      case 'critical': 
        return <span className="inline-flex items-center gap-1.5 text-xs text-danger font-bold font-mono animate-pulse"><span className="w-2 h-2 rounded-full bg-danger" />Критичная</span>;
    }
  };

  // --- DETAIL VIEW: Open Bug Ticket in Unified Workspace ---
  if (selectedBugId) {
    const activeBug = allStoredBugs.find(b => b.id === selectedBugId);
    if (activeBug) {
      return (
        <div className="w-full min-h-screen bg-surface-0 pt-16 md:pt-24 pb-20 font-sans text-textPrimary">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
            <CreatorBugWorkspace 
              bug={activeBug} 
              onBack={() => { setSelectedBugId(null); loadData(); }} 
              triggerToast={triggerToast} 
              viewMode="reporter" 
            />
          </div>
        </div>
      );
    }
  }

  // --- LIST VIEW: My Submitted Bugs (Aligned with CreatorBugsTab) ---
  return (
    <div className="w-full min-h-screen bg-surface-0 pt-16 md:pt-24 pb-20 font-sans text-textPrimary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 space-y-6 animate-fadeIn">
        
        {/* 1. HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-textPrimary tracking-tight mb-1">
              Мои баг-репорты
            </h1>
            <p className="text-sm text-textSecondary max-w-2xl leading-relaxed">
              Отслеживание статусов найденных вами багов и переписка со студиями разработки (FE-BUG-003, BUG-API-002).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if ((window as any).__hubigrNavigate) {
                  (window as any).__hubigrNavigate('/games');
                } else {
                  window.location.href = '/games';
                }
              }}
              className="h-9 px-4 bg-surface-1 hover:bg-surface-2 border border-borderDef text-textPrimary text-xs font-bold uppercase tracking-wider rounded-control flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <Gamepad2 className="w-4 h-4 text-accent" />
              <span>Каталог игр</span>
            </button>
          </div>
        </div>

        {/* 2. STATS SUMMARY CARDS (Aligned with CreatorBugsTab) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-surface-1 border border-borderDef rounded-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-textSecondary uppercase tracking-wider">Всего отправлено</span>
              <Bug className="w-4 h-4 text-textTertiary" />
            </div>
            <div className="text-2xl font-black text-textPrimary mt-2">{totalBugs}</div>
          </div>

          <div className="bg-surface-1 border border-borderDef rounded-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-textSecondary uppercase tracking-wider">В работе / открыты</span>
              <RefreshCw className="w-4 h-4 text-accent" />
            </div>
            <div className="text-2xl font-black text-accent mt-2">{openBugsCount}</div>
          </div>

          <div className="bg-surface-1 border border-borderDef rounded-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-textSecondary uppercase tracking-wider">Успешно исправлено</span>
              <CheckCircle2 className="w-4 h-4 text-success" />
            </div>
            <div className="text-2xl font-black text-success mt-2">{fixedBugsCount}</div>
          </div>
        </div>

        {/* 3. FILTERS & CONTROLS */}
        <div className="bg-surface-1 border border-borderDef rounded-card p-4 shadow-sm flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-textTertiary" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Поиск по названию бага, игре или номеру тикета..."
              className="w-full bg-surface-0 border border-borderDef focus:border-accent text-textPrimary pl-9 pr-4 py-2 rounded-control text-xs outline-none font-mono transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="h-9 bg-surface-0 border border-borderDef hover:border-borderStrong text-textPrimary px-3 rounded-control text-xs font-mono outline-none cursor-pointer transition-colors"
            >
              <option value="all">Все статусы</option>
              <option value="new">Новые</option>
              <option value="confirmed">Подтвержденные</option>
              <option value="in_progress">В работе</option>
              <option value="fixed">Исправленные</option>
              <option value="rejected">Отклоненные</option>
              <option value="duplicate">Дубликаты</option>
            </select>

            {/* Severity Filter */}
            <select
              value={severityFilter}
              onChange={e => setSeverityFilter(e.target.value as any)}
              className="h-9 bg-surface-0 border border-borderDef hover:border-borderStrong text-textPrimary px-3 rounded-control text-xs font-mono outline-none cursor-pointer transition-colors"
            >
              <option value="all">Любая важность</option>
              <option value="low">Низкая</option>
              <option value="medium">Средняя</option>
              <option value="high">Высокая</option>
              <option value="critical">Критичная</option>
            </select>

            {/* Game Filter */}
            {availableGames.length > 1 && (
              <select
                value={gameFilter}
                onChange={e => setGameFilter(e.target.value)}
                className="h-9 bg-surface-0 border border-borderDef hover:border-borderStrong text-textPrimary px-3 rounded-control text-xs font-mono outline-none cursor-pointer transition-colors"
              >
                <option value="all">Все игры</option>
                {availableGames.map(g => (
                  <option key={g.id} value={g.id}>{g.title}</option>
                ))}
              </select>
            )}

            {(searchQuery || statusFilter !== 'all' || severityFilter !== 'all' || gameFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setSeverityFilter('all');
                  setGameFilter('all');
                }}
                className="h-9 px-3 bg-surface-2 hover:bg-surface-3 text-textSecondary hover:text-textPrimary text-xs font-semibold rounded-control transition-colors cursor-pointer"
                title="Сбросить все фильтры"
              >
                Сбросить
              </button>
            )}
          </div>
        </div>

        {/* 4. BUGS LIST (Cards aligned with CreatorBugsTab) */}
        {filteredBugs.length === 0 ? (
          <div className="p-12 text-center bg-surface-1 border border-borderDef rounded-card space-y-3">
            <Bug className="w-12 h-12 mx-auto text-textTertiary opacity-60" />
            <h3 className="text-base font-bold text-textPrimary">Баг-репорты не найдены</h3>
            <p className="text-xs text-textSecondary max-w-sm mx-auto leading-relaxed">
              {myBugs.length === 0
                ? 'Вы еще не отправили ни одного баг-репорта. На странице любой игры можно нажать «Сообщить о баге» при обнаружении проблемы.'
                : 'По выбранным критериям поиска ничего не найдено. Попробуйте сбросить фильтры.'}
            </p>
            {myBugs.length > 0 && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setSeverityFilter('all');
                  setGameFilter('all');
                }}
                className="h-8 px-4 bg-surface-2 hover:bg-surface-3 text-textPrimary text-xs font-bold rounded-control transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                Сбросить фильтры
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredBugs.map(bug => {
              const statusCfg = getStatusLabel(bug.status);
              const commentsCount = bug.comments?.filter(c => !c.isInternal).length || 0;
              const activeSeverity = bug.triageSeverity || bug.reporterSeverity;

              return (
                <div
                  key={bug.id}
                  onClick={() => setSelectedBugId(bug.id)}
                  className="group bg-surface-1 border border-borderDef hover:border-accent rounded-card p-4 sm:p-5 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:shadow-md"
                >
                  <div className="flex flex-col gap-2 min-w-0 flex-1">
                    {/* Game & Timestamp Bar */}
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-control bg-surface-2 text-[10px] font-mono text-textPrimary border border-borderDef flex items-center gap-1">
                        <Gamepad2 className="w-3 h-3 text-accent" /> {bug.gameTitle}
                      </span>
                      <span className="text-[11px] font-mono text-textTertiary">
                        #{bug.id.toUpperCase()} • {new Date(bug.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm sm:text-base font-bold text-textPrimary group-hover:text-accent transition-colors leading-snug">
                      {bug.title}
                    </h3>

                    {/* Metadata & Status */}
                    <div className="flex items-center gap-3 text-xs flex-wrap pt-0.5">
                      {getSeverityBadge(activeSeverity)}
                      <span className="text-textTertiary">•</span>
                      <span className="text-textSecondary font-mono text-[11px]">
                        {bug.platform} {bug.buildVersion && `(${bug.buildVersion})`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                    {/* Status Badge */}
                    <span className={`px-2.5 py-1 rounded-control text-xs font-mono font-bold uppercase tracking-wider border ${statusCfg.color}`}>
                      {statusCfg.label}
                    </span>

                    {/* Comments Counter */}
                    <span className="flex items-center gap-1 text-xs font-mono text-textTertiary" title="Ответов в обсуждении">
                      <MessageSquare className="w-3.5 h-3.5" />
                      {commentsCount}
                    </span>

                    <ChevronRight className="w-4 h-4 text-textTertiary group-hover:text-accent group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default MyBugsPage;
