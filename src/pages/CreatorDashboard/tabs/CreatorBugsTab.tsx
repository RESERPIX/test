import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Filter, AlertTriangle, Bug, MessageSquare, Lock, 
  CheckCircle2, ChevronRight, RefreshCw, ChevronLeft, Gamepad2 
} from 'lucide-react';
import { getStoredBugReports } from '../../../mocks/bugReports';
import { BugReport, BugStatus, BugSeverity } from '../../../types/bugReport';
import { CreatorBugWorkspace } from './CreatorBugWorkspace';

interface CreatorBugsTabProps {
  scopeInfo: any;
  triggerToast: (msg: string, type?: 'success'|'error'|'info'|'warning') => void;
}

export const CreatorBugsTab = ({ scopeInfo, triggerToast }: CreatorBugsTabProps) => {
  const [allStoredBugs, setAllStoredBugs] = useState<BugReport[]>([]);

  // Filters State (FE-BUG-010, SC-BUG-016, SC-BUG-017, SC-BUG-018)
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<BugStatus | 'all'>('all');
  const [severityFilter, setSeverityFilter] = useState<BugSeverity | 'all'>('all');
  const [gameFilter, setGameFilter] = useState<string>('all');

  const [activeBugId, setActiveBugId] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'incoming' | 'submitted'>('incoming');

  // Pagination State (SC-BUG-030, FE-BUG-010)
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const loadData = () => {
    setAllStoredBugs(getStoredBugReports());
  };

  useEffect(() => {
    loadData();
  }, [activeBugId]);

  // Base List Selection
  const baseBugs = useMemo(() => {
    return activeSubTab === 'incoming' 
      ? allStoredBugs 
      : allStoredBugs.filter(bug => bug.reporterId === 'user-88' || bug.reporterId === 'user-me');
  }, [activeSubTab, allStoredBugs]);

  // Unique Games for Filter (SC-BUG-018)
  const availableGames = useMemo(() => {
    const map = new Map<string, string>();
    allStoredBugs.forEach(b => map.set(b.gameId, b.gameTitle));
    return Array.from(map.entries()).map(([id, title]) => ({ id, title }));
  }, [allStoredBugs]);

  // Filter Logic
  const filteredBugs = useMemo(() => {
    return baseBugs.filter(bug => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = bug.title.toLowerCase().includes(q);
        const matchesReporter = bug.reporterName.toLowerCase().includes(q);
        const matchesId = bug.id.toLowerCase().includes(q);
        if (!matchesTitle && !matchesReporter && !matchesId) return false;
      }
      if (statusFilter !== 'all' && bug.status !== statusFilter) return false;
      if (severityFilter !== 'all') {
        const activeSeverity = bug.triageSeverity || bug.reporterSeverity;
        if (activeSeverity !== severityFilter) return false;
      }
      if (gameFilter !== 'all' && bug.gameId !== gameFilter) return false;
      return true;
    });
  }, [baseBugs, searchQuery, statusFilter, severityFilter, gameFilter]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, severityFilter, gameFilter, activeSubTab]);

  // Pagination Logic (SC-BUG-030)
  const totalPages = Math.ceil(filteredBugs.length / pageSize) || 1;
  const paginatedBugs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredBugs.slice(start, start + pageSize);
  }, [filteredBugs, currentPage, pageSize]);

  // Derived metrics (FR-BUG-050, SC-BUG-025)
  const totalBugs = baseBugs.length;
  const openBugsCount = baseBugs.filter(b => b.status === 'new' || b.status === 'confirmed' || b.status === 'in_progress').length;
  const criticalBugsCount = baseBugs.filter(b => (b.triageSeverity || b.reporterSeverity) === 'critical' && b.status !== 'fixed' && b.status !== 'rejected').length;

  const getStatusLabel = (status: BugStatus) => {
    switch (status) {
      case 'new': return { label: 'Новый', color: 'bg-info/10 text-info border-info/20' };
      case 'confirmed': return { label: 'Подтвержден', color: 'bg-warning/10 text-warning border-warning/20' };
      case 'in_progress': return { label: 'В работе', color: 'bg-accent/10 text-accent border-accent/20' };
      case 'fixed': return { label: 'Исправлен', color: 'bg-success/10 text-success border-success/20' };
      case 'rejected': return { label: 'Отклонен', color: 'bg-surface-2 text-textSecondary border-borderDef' };
      case 'duplicate': return { label: 'Дубликат', color: 'bg-surface-2 text-textSecondary border-borderDef' };
      default: return { label: status, color: 'bg-surface-2 text-textSecondary border-borderDef' };
    }
  };

  const getSeverityBadge = (severity: BugSeverity | null) => {
    if (!severity) return null;
    switch (severity) {
      case 'low': return <span className="w-2 h-2 rounded-full bg-success" title="Низкая" />;
      case 'medium': return <span className="w-2 h-2 rounded-full bg-info" title="Средняя" />;
      case 'high': return <span className="w-2 h-2 rounded-full bg-warning" title="Высокая" />;
      case 'critical': return <span className="w-2 h-2 rounded-full bg-danger animate-pulse" title="Критичная" />;
    }
  };

  if (activeBugId) {
    const activeBug = allStoredBugs.find(b => b.id === activeBugId);
    if (activeBug) {
      return (
        <CreatorBugWorkspace 
          bug={activeBug} 
          onBack={() => { setActiveBugId(null); loadData(); }} 
          triggerToast={triggerToast} 
          viewMode={activeSubTab === 'submitted' ? 'reporter' : 'creator'} 
        />
      );
    }
  }

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Sub-tabs Selector */}
      <div className="flex items-center gap-2 border-b border-borderDef pb-4">
        <button
          onClick={() => { setActiveSubTab('incoming'); setActiveBugId(null); }}
          className={`px-4 py-2 text-sm font-bold rounded-control transition-colors ${activeSubTab === 'incoming' ? 'bg-surface-2 text-textPrimary' : 'text-textTertiary hover:text-textSecondary'}`}
        >
          Входящие баги
        </button>
        <button
          onClick={() => { setActiveSubTab('submitted'); setActiveBugId(null); }}
          className={`px-4 py-2 text-sm font-bold rounded-control transition-colors ${activeSubTab === 'submitted' ? 'bg-surface-2 text-textPrimary' : 'text-textTertiary hover:text-textSecondary'}`}
        >
          Мои репорты
        </button>
      </div>
      
      {/* Team Read-Only Warning Banner (BR-BUG-010, SC-BUG-028) */}
      {!scopeInfo.canManageBugs && activeSubTab === 'incoming' && (
        <div className="p-4 bg-warning/10 border border-warning/20 rounded-control flex items-center justify-between text-xs animate-scaleIn">
          <div className="flex items-center gap-3">
            <Lock className="w-4 h-4 text-warning" />
            <div className="flex flex-col">
              <span className="font-bold text-warning">Только чтение</span>
              <span className="text-textSecondary">У вас нет прав на управление баг-репортами (требуется право <code className="bg-surface-0 px-1 py-0.5 rounded text-textPrimary">bugs.manage</code>).</span>
            </div>
          </div>
        </div>
      )}

      {/* Stats Summary (BR-BUG-035, SC-BUG-025, FR-BUG-050) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-1 border border-borderDef rounded-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-textSecondary uppercase tracking-wider">Всего репортов</span>
            <Bug className="w-4 h-4 text-textTertiary" />
          </div>
          <div className="text-2xl font-black text-textPrimary mt-2">{totalBugs}</div>
        </div>
        <div className="bg-surface-1 border border-borderDef rounded-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-textSecondary uppercase tracking-wider">Открытые баги</span>
            <RefreshCw className="w-4 h-4 text-accent" />
          </div>
          <div className="text-2xl font-black text-accent mt-2">{openBugsCount}</div>
        </div>
        <div className="bg-surface-1 border border-borderDef rounded-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-textSecondary uppercase tracking-wider">Критичные (блокеры)</span>
            <AlertTriangle className={`w-4 h-4 ${criticalBugsCount > 0 ? 'text-danger' : 'text-textTertiary'}`} />
          </div>
          <div className={`text-2xl font-black mt-2 ${criticalBugsCount > 0 ? 'text-danger' : 'text-textPrimary'}`}>{criticalBugsCount}</div>
        </div>
      </div>

      {/* Filters (BR-BUG-036, BR-BUG-037, SC-BUG-018) */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between flex-wrap">
        <div className="relative w-full md:w-[280px]">
          <Search className="w-4 h-4 text-textTertiary absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по названию или ID..."
            className="w-full bg-surface-1 border border-borderDef rounded-control pl-9 pr-4 py-2 text-sm text-textPrimary placeholder:text-textTertiary focus:border-accent outline-none"
          />
        </div>
        
        <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
          {/* Game filter dropdown (SC-BUG-018) */}
          <div className="flex items-center gap-1.5 bg-surface-1 border border-borderDef rounded-control px-2.5 py-1 text-xs">
            <Gamepad2 className="w-3.5 h-3.5 text-textTertiary" />
            <select
              value={gameFilter}
              onChange={(e) => setGameFilter(e.target.value)}
              className="bg-transparent text-textPrimary outline-none font-medium cursor-pointer text-xs"
            >
              <option value="all">Все игры</option>
              {availableGames.map(g => (
                <option key={g.id} value={g.id}>{g.title}</option>
              ))}
            </select>
          </div>

          {/* Status filter dropdown (SC-BUG-016) */}
          <div className="flex items-center gap-1.5 bg-surface-1 border border-borderDef rounded-control px-2.5 py-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-textTertiary" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-transparent text-textPrimary outline-none font-medium cursor-pointer text-xs"
            >
              <option value="all">Все статусы</option>
              <option value="new">Новые</option>
              <option value="confirmed">Подтвержденные</option>
              <option value="in_progress">В работе</option>
              <option value="fixed">Исправленные</option>
              <option value="rejected">Отклоненные</option>
              <option value="duplicate">Дубликаты</option>
            </select>
          </div>
          
          {/* Severity filter dropdown (SC-BUG-017) */}
          <div className="flex items-center gap-1.5 bg-surface-1 border border-borderDef rounded-control px-2.5 py-1 text-xs">
            <AlertTriangle className="w-3.5 h-3.5 text-textTertiary" />
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as any)}
              className="bg-transparent text-textPrimary outline-none font-medium cursor-pointer text-xs"
            >
              <option value="all">Любая важность</option>
              <option value="critical">Критичная</option>
              <option value="high">Высокая</option>
              <option value="medium">Средняя</option>
              <option value="low">Низкая</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bugs List - Separate Cards */}
      {paginatedBugs.length === 0 ? (
        <div className="bg-surface-1 border border-borderDef rounded-card p-12 text-center flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-surface-2 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-textTertiary" />
          </div>
          <div>
            <p className="text-textPrimary font-bold">Нет баг-репортов</p>
            <p className="text-sm text-textSecondary mt-1">По заданным критериям ничего не найдено.</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {paginatedBugs.map(bug => {
            const status = getStatusLabel(bug.status);
            const activeSeverity = bug.triageSeverity || bug.reporterSeverity;

            return (
              <div 
                key={bug.id} 
                className="bg-surface-1 border border-borderDef rounded-card p-4 hover:border-surface-3 hover:bg-surface-2/40 transition-all cursor-pointer group"
                onClick={() => setActiveBugId(bug.id)}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                      <span className="text-[10px] font-mono text-textTertiary">#{bug.id.toUpperCase()}</span>
                      {getSeverityBadge(activeSeverity)}
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${status.color}`}>
                        {status.label}
                      </span>
                      <span className="text-[10px] font-mono bg-surface-2 text-textSecondary px-2 py-0.5 rounded border border-borderDef">
                        {bug.gameTitle}
                      </span>
                      {bug.priority && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-surface-2 text-accent border border-accent/20">
                          {bug.priority}
                        </span>
                      )}
                    </div>
                    
                    <h4 className="text-sm font-bold text-textPrimary truncate group-hover:text-accent transition-colors">
                      {bug.title}
                    </h4>
                    
                    <div className="flex items-center gap-4 mt-2 text-xs text-textSecondary flex-wrap">
                      <span className="flex items-center gap-1.5">
                        <Bug className="w-3.5 h-3.5 text-textTertiary" /> {bug.reporterName}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-textTertiary" /> {bug.comments.length}
                      </span>
                      <span>v{bug.buildVersion}</span>
                      <span className="capitalize text-textTertiary">({bug.platform})</span>
                      <span className="text-textTertiary text-[11px] ml-auto">
                        {new Date(bug.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="shrink-0">
                    <ChevronRight className="w-5 h-5 text-textTertiary group-hover:text-textPrimary group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Bar (SC-BUG-030, FE-BUG-010) */}
      {filteredBugs.length > pageSize && (
        <div className="flex items-center justify-between pt-2 text-xs text-textSecondary">
          <span>Показано {paginatedBugs.length} из {filteredBugs.length}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-borderDef hover:bg-surface-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-semibold text-textPrimary">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-borderDef hover:bg-surface-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

