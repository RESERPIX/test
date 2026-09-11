import { ExportStatsModal } from '../modals/ExportStatsModal';
import React, { useState, useEffect, useRef } from 'react';
import { Eye, Download, Users, Wallet, Plus, FileText, ChevronDown, AlertTriangle, XCircle, ShieldAlert, Bug, MessageSquare, UserPlus, Clock, Rocket, AlertCircle, RefreshCw, FolderKanban, User, ArrowUpRight, Filter, Search, Check, CheckCircle2, X, MoreVertical, Edit, ExternalLink, Trash2, ArrowRight, Layers, DollarSign, Settings, Lock, HelpCircle, CheckSquare, Sparkles, Send, CornerDownRight, BarChart2, TrendingUp, TrendingDown, Activity, ShieldCheck, ChevronRight, SlidersHorizontal, Info, Award, Star, Gamepad2, Upload, Edit3, Zap, Monitor, Laptop, Trophy, Heart, Copy, Flag, ThumbsUp, ThumbsDown, Calendar, Terminal, CreditCard, Building, Shield, Crown, LogOut, Mail } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { CustomSelect } from '../../../components/ui/Select';
import { MOCK_TEAMS, INITIAL_ATTENTION_ITEMS, MOCK_GAMES, MOCK_INBOX_REVIEWS, MOCK_INBOX_BUGS, MOCK_DEVLOGS, MOCK_BUGS, MOCK_REVIEWS, MOCK_ANALYTICS_GAMES, MOCK_TIMESERIES, MOCK_REFERRALS, MOCK_STRUCTURED_FEEDBACK, MOCK_SALES_ITEMS, MOCK_SALES_TIMESERIES, MOCK_RECENT_SALES, MOCK_REFUNDS, MOCK_PAYOUTS_HISTORY } from '../../../data/mockCreatorData';

interface CreatorStatsTabProps {
  scopeInfo: any;
  salesApiError: boolean;
  analyticsApiError: boolean;
  triggerToast: (msg: string, type?: string) => void;
}

export const CreatorStatsTab: React.FC<CreatorStatsTabProps> = ({ scopeInfo, salesApiError, analyticsApiError, triggerToast }) => {
  const [selectedGameId, setSelectedGameId] = useState('all');
  const [period, setPeriod] = useState('30d');
  const [customFromDate, setCustomFromDate] = useState('2026-08-01');
  const [customToDate, setCustomToDate] = useState('2026-08-25');
  const [activeMetricTab, setActiveMetricTab] = useState('views');
  const [hoveredDataPoint, setHoveredDataPoint] = useState<any>(null);
  const [tableSortKey, setTableSortKey] = useState('views');
  const [tableSortDesc, setTableSortDesc] = useState(true);
  
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Filter Games by Scope
  const filteredGames = MOCK_ANALYTICS_GAMES.filter(g => {
    if (scopeInfo.canViewFinance === false && g.scope === 'team_pixel') return true;
    if (selectedGameId !== 'all' && g.id !== selectedGameId) return false;
    return true;
  });

  // Calculate Aggregates
  const totalViews = filteredGames.reduce((acc, g) => acc + g.views, 0);
  const totalWebGlPlays = filteredGames.reduce((acc, g) => acc + g.webglPlays, 0);
  const totalDownloads = filteredGames.reduce((acc, g) => acc + g.downloads, 0);
  const totalDonateClicks = filteredGames.reduce((acc, g) => acc + g.donateClicks, 0);
  const totalRevenue = filteredGames.reduce((acc, g) => acc + g.revenue, 0);
  const totalSubscribers = 240;

  // Sorting Table
  const sortedGames = [...filteredGames].sort((a: any, b: any) => {
    let valA = a[tableSortKey] || 0;
    let valB = b[tableSortKey] || 0;
    if (tableSortKey === 'conversion') {
      valA = ((a.webglPlays + a.downloads) / (a.views || 1)) * 100;
      valB = ((b.webglPlays + b.downloads) / (b.views || 1)) * 100;
    }
    return tableSortDesc ? valB - valA : valA - valB;
  });

  const toggleSort = (key: string) => {
    if (tableSortKey === key) {
      setTableSortDesc(!tableSortDesc);
    } else {
      setTableSortKey(key);
      setTableSortDesc(true);
    }
  };

  // Permission Checks (403 Forbidden State for stats.view - BR-CRD-023, AC-CRD-012)
  if (scopeInfo.canViewStats === false) {
    return (
      <div className="bg-surface-2 border border-borderDef rounded-xl p-12 text-center flex flex-col items-center gap-5 my-6 animate-fadeIn">
        <div className="w-16 h-16 rounded-full bg-danger/10 border border-danger/30 flex items-center justify-center text-danger">
          <Lock className="w-8 h-8 stroke-[1.5]" />
        </div>
        <div className="flex flex-col gap-2 max-w-[480px]">
          <h3 className="text-xl font-bold text-textPrimary">Доступ к аналитике ограничен</h3>
          <p className="text-xs text-textSecondary leading-relaxed">
            У вас недостаточно прав (<code className="text-accent font-mono font-bold">stats.view</code>) для просмотра аналитики студии «{scopeInfo.name}». Обратитесь к капитану команды для получения доступа.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* PARTIAL API FAILURE BANNER */}
      {(analyticsApiError || salesApiError) && (
        <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 flex items-center justify-between gap-4 text-xs text-textPrimary shadow-sm">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-warning shrink-0" />
            <div>
              <span className="font-bold">Частичный сбой источников аналитики Маркета:</span>
              <p className="text-textSecondary mt-0.5">
                {analyticsApiError && 'Сервис сбора логов посещений недоступен. '}
                {salesApiError && 'Сервис финансовых транзакций M8 временно не отвечает. '}
                Некоторые показатели отображаются за прошлый сохранённый период.
              </p>
            </div>
          </div>
          <button 
            onClick={() => triggerToast('Запрос к сервису аналитики повторен', 'info')}
            className="px-3 py-1.5 bg-surface-1 hover:bg-surface-2 border border-borderDef rounded-md font-mono text-xs flex items-center gap-1.5 shrink-0 transition-colors shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 text-accent" /> Повторить загрузку
          </button>
        </div>
      )}

      {/* BLOCK 1: TOOLBAR & PERIOD FILTERS */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Game Selector Dropdown */}
          <div className="relative min-w-[200px]">
            <CustomSelect
              value={selectedGameId}
              onChange={setSelectedGameId}
              options={[
                { value: 'all', label: 'Все игры (Агрегация)' },
                ...MOCK_ANALYTICS_GAMES.map(g => ({ value: g.id, label: g.title }))
              ]}
            />
          </div>

          {/* Sleek Period Segmented Control */}
          <div className="flex items-center bg-surface-2 p-1 border border-borderDef rounded-lg text-xs font-mono font-medium shadow-inner">
            {[
              { id: '7d', label: '7 дней' },
              { id: '30d', label: '30 дней' },
              { id: '90d', label: '90 дней' },
              { id: 'all', label: 'Всё время' },
              { id: 'custom', label: 'Свой' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setPeriod(t.id)}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  period === t.id 
                    ? 'bg-surface-1 text-textPrimary shadow-sm border border-borderDef/50 font-bold' 
                    : 'text-textSecondary hover:text-textPrimary hover:bg-surface-3/50 border border-transparent'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Date Picker Range (Active on Custom) */}
          {period === 'custom' && (
            <div className="flex items-center gap-2 bg-surface-2 border border-borderDef px-3 py-1.5 rounded-lg text-xs font-mono">
              <Calendar className="w-3.5 h-3.5 text-textSecondary" />
              <input 
                type="date" 
                value={customFromDate} 
                onChange={e => setCustomFromDate(e.target.value)}
                className="bg-transparent text-textPrimary outline-none cursor-pointer"
              />
              <span className="text-borderStrong">—</span>
              <input 
                type="date" 
                value={customToDate} 
                onChange={e => setCustomToDate(e.target.value)}
                className="bg-transparent text-textPrimary outline-none cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Export CTA */}
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="h-9 px-4 bg-surface-1 hover:bg-surface-2 border border-borderDef hover:border-accent/50 text-xs font-semibold text-textPrimary rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
        >
          <Download className="w-3.5 h-3.5 text-accent" />
          <span>Экспорт отчёта</span>
        </button>
      </div>

      {filteredGames.length === 0 ? (
        <div className="bg-surface-1 border border-dashed border-surface-3 rounded-card p-12 text-center flex flex-col items-center gap-4 my-8">
          <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center text-textSecondary">
            <BarChart2 className="w-8 h-8" />
          </div>
          <div className="flex flex-col gap-2 max-w-md">
            <h3 className="text-body-lg font-bold text-textPrimary">Пока нет данных для аналитики</h3>
            <p className="text-sm text-textSecondary">
              В выбранном контексте (команда или конкретная игра) еще не накоплено достаточно данных.
              Попробуйте изменить параметры фильтрации.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* COMBINED BLOCK 2 & 3: KPI CARDS TABS + MAIN CHART */}
          <div className="bg-surface-1 border border-borderDef rounded-xl overflow-hidden flex flex-col shadow-sm">
        
        {/* KPI Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-b border-borderDef bg-surface-2/30 divide-y sm:divide-y-0 sm:divide-x divide-borderDef">
          {/* Card 1: Views */}
          <div 
            onClick={() => setActiveMetricTab('views')}
            className={`p-4 sm:p-5 transition-all cursor-pointer relative group ${activeMetricTab === 'views' ? 'bg-surface-1' : 'hover:bg-surface-1'}`}
          >
            {activeMetricTab === 'views' && <div className="absolute top-0 left-0 w-full h-1 bg-accent" />}
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${activeMetricTab === 'views' ? 'text-accent' : 'text-textSecondary group-hover:text-textPrimary'}`}>Показы</span>
              <Eye className={`w-4 h-4 ${activeMetricTab === 'views' ? 'text-accent' : 'text-textSecondary'}`} />
            </div>
            <div className="text-2xl font-mono font-bold text-textPrimary">{totalViews.toLocaleString()}</div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-mono text-success">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="font-bold">+14.2%</span>
              <span className="text-textTertiary font-sans">к пред. периоду</span>
            </div>
          </div>

          {/* Card 2: Plays & Downloads */}
          <div 
            onClick={() => setActiveMetricTab('webglPlays')}
            className={`p-4 sm:p-5 transition-all cursor-pointer relative group ${activeMetricTab === 'webglPlays' || activeMetricTab === 'downloads' ? 'bg-surface-1' : 'hover:bg-surface-1'}`}
          >
            {(activeMetricTab === 'webglPlays' || activeMetricTab === 'downloads') && <div className="absolute top-0 left-0 w-full h-1 bg-info" />}
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${(activeMetricTab === 'webglPlays' || activeMetricTab === 'downloads') ? 'text-info' : 'text-textSecondary group-hover:text-textPrimary'}`}>Сыграно / Скачано</span>
              <Download className={`w-4 h-4 ${(activeMetricTab === 'webglPlays' || activeMetricTab === 'downloads') ? 'text-info' : 'text-textSecondary'}`} />
            </div>
            <div className="text-2xl font-mono font-bold text-textPrimary">{(totalWebGlPlays + totalDownloads).toLocaleString()}</div>
            <div className="flex items-center gap-3 mt-2 text-xs font-mono text-textSecondary font-bold">
              <span>WebGL: <span className="text-textPrimary">{totalWebGlPlays.toLocaleString()}</span></span>
              <span>PC: <span className="text-textPrimary">{totalDownloads.toLocaleString()}</span></span>
            </div>
          </div>

          {/* Card 3: Audience & Subscribers */}
          <div 
            onClick={() => setActiveMetricTab('subscribers')}
            className={`p-4 sm:p-5 transition-all cursor-pointer relative group ${activeMetricTab === 'subscribers' ? 'bg-surface-1' : 'hover:bg-surface-1'}`}
          >
            {activeMetricTab === 'subscribers' && <div className="absolute top-0 left-0 w-full h-1 bg-reaction" />}
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${activeMetricTab === 'subscribers' ? 'text-reaction' : 'text-textSecondary group-hover:text-textPrimary'}`}>Аудитория</span>
              <Users className={`w-4 h-4 ${activeMetricTab === 'subscribers' ? 'text-reaction' : 'text-textSecondary'}`} />
            </div>
            <div className="text-2xl font-mono font-bold text-textPrimary">+{totalSubscribers}</div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-mono text-success">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="font-bold">+8.4%</span>
              <span className="text-textTertiary font-sans">новых фолловеров</span>
            </div>
          </div>

          {/* Card 4: Support & Finance */}
          <div 
            onClick={() => setActiveMetricTab('donateClicks')}
            className={`p-4 sm:p-5 transition-all cursor-pointer relative group overflow-hidden ${activeMetricTab === 'donateClicks' ? 'bg-surface-1' : 'hover:bg-surface-1'}`}
          >
            {activeMetricTab === 'donateClicks' && <div className="absolute top-0 left-0 w-full h-1 bg-success" />}
            
            {/* Sparkle subtle decoration */}
            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-success/5 rounded-full blur-xl pointer-events-none" />

            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${activeMetricTab === 'donateClicks' ? 'text-success' : 'text-textSecondary group-hover:text-textPrimary'}`}>Донаты</span>
              <Wallet className={`w-4 h-4 ${activeMetricTab === 'donateClicks' ? 'text-success' : 'text-textSecondary'}`} />
            </div>
            
            {scopeInfo.canViewFinance ? (
              <>
                <div className="text-2xl font-mono font-bold text-textPrimary flex items-baseline gap-1">
                  <span className="text-success text-lg">$</span>
                  {totalRevenue.toLocaleString()}
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-xs font-mono text-textSecondary font-bold">
                  <span className="text-textPrimary">{totalDonateClicks}</span> переходов
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 mt-4 text-xs font-mono text-textSecondary bg-surface-2 px-2 py-1.5 rounded border border-surface-3">
                <Lock className="w-3.5 h-3.5" /> Финансы скрыты
              </div>
            )}
          </div>
        </div>

        {/* Chart Area */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-textPrimary flex items-center gap-2">
                Динамика: {activeMetricTab === 'views' ? 'Показы страниц' : activeMetricTab === 'webglPlays' ? 'Сыграно / Скачано' : activeMetricTab === 'subscribers' ? 'Рост аудитории' : 'Донаты'}
              </h3>
              <p className="text-xs text-textSecondary font-mono mt-1">График за выбранный период по дням</p>
            </div>
            
            {/* Value on Hover */}
            <div className="h-10 px-4 flex items-center justify-center bg-surface-2 border border-borderDef rounded-lg font-mono text-sm min-w-[140px] shadow-inner">
              {hoveredDataPoint ? (
                <div className="flex items-center gap-2 font-bold">
                  <span className="text-textSecondary">{hoveredDataPoint.date}:</span>
                  <span className="text-textPrimary">{hoveredDataPoint.value}</span>
                </div>
              ) : (
                <span className="text-textTertiary font-medium">Наведите на график</span>
              )}
            </div>
          </div>

          <div className="h-[280px] w-full flex items-end gap-1 relative group">
            {MOCK_TIMESERIES.map((point, idx) => {
              const maxVal = Math.max(...MOCK_TIMESERIES.map(d => d[activeMetricTab as keyof typeof d] as number));
              const val = point[activeMetricTab as keyof typeof point] as number;
              const heightPct = Math.max((val / maxVal) * 100, 2);
              
              let barColor = 'bg-accent/80 hover:bg-accent';
              if (activeMetricTab === 'webglPlays' || activeMetricTab === 'downloads') barColor = 'bg-info/80 hover:bg-info';
              if (activeMetricTab === 'subscribers') barColor = 'bg-reaction/80 hover:bg-reaction';
              if (activeMetricTab === 'donateClicks') barColor = 'bg-success/80 hover:bg-success';

              return (
                <div 
                  key={idx} 
                  className="flex-1 flex flex-col justify-end items-center group/bar h-full cursor-crosshair relative"
                  onMouseEnter={() => setHoveredDataPoint({ date: point.date, value: val })}
                  onMouseLeave={() => setHoveredDataPoint(null)}
                >
                  <div 
                    className={`w-full rounded-t-sm transition-all duration-300 ${barColor}`} 
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
              );
            })}
            
            {/* Decorative Grid Lines */}
            <div className="absolute inset-0 border-t border-b border-surface-3 pointer-events-none opacity-50 flex flex-col justify-between">
              <div className="border-b border-surface-3 w-full h-1/4" />
              <div className="border-b border-surface-3 w-full h-1/4" />
              <div className="border-b border-surface-3 w-full h-1/4" />
            </div>
          </div>
        </div>
      </div>

      {/* BLOCK 4: SPLIT - GEO & REFERRALS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        
        {/* Left: Geo */}
        <div className="bg-surface-1 border border-borderDef rounded-xl flex flex-col overflow-hidden shadow-sm">
          <div className="p-5 border-b border-borderDef bg-surface-2/30 flex items-center justify-between">
            <h4 className="text-sm font-bold text-textPrimary uppercase tracking-wider">География</h4>
            <span className="text-xs font-mono text-textSecondary font-medium">Топ стран</span>
          </div>
          
          <div className="p-4 space-y-1">
            {[
              { country: 'Россия', flag: '🇷🇺', share: '45%', views: 12450 },
              { country: 'США', flag: '🇺🇸', share: '20%', views: 5530 },
              { country: 'Бразилия', flag: '🇧🇷', share: '12%', views: 3310 },
              { country: 'Германия', flag: '🇩🇪', share: '8%', views: 2210 },
              { country: 'Другие', flag: '🌍', share: '15%', views: 4150 }
            ].map((geo, idx) => (
              <div key={idx} className="flex flex-col gap-2 p-3 hover:bg-surface-2 rounded-lg transition-colors group cursor-default">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-xl leading-none drop-shadow-sm" title={geo.country}>{geo.flag}</span>
                    <span className="font-semibold text-textPrimary group-hover:text-accent transition-colors">{geo.country}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono font-bold text-textPrimary">{geo.views.toLocaleString()}</span>
                    <span className="text-xs font-mono text-textSecondary w-10 text-right">{geo.share}</span>
                  </div>
                </div>
                {/* Minimalist Progress Bar */}
                <div className="w-full bg-surface-3 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-accent h-full rounded-full transition-all duration-500" style={{ width: geo.share }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Traffic Referral Sources */}
        <div className="bg-surface-1 border border-borderDef rounded-xl flex flex-col overflow-hidden shadow-sm">
          <div className="p-5 border-b border-borderDef bg-surface-2/30 flex items-center justify-between">
            <h4 className="text-sm font-bold text-textPrimary uppercase tracking-wider">Источники трафика</h4>
            <span className="text-xs font-mono text-textSecondary font-medium">Топ-5 сайтов</span>
          </div>

          <div className="p-4 space-y-1">
            {MOCK_REFERRALS.map((ref, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 hover:bg-surface-2 rounded-lg transition-colors border-b border-borderDef/50 last:border-0 group cursor-default">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-textPrimary group-hover:text-accent transition-colors">{ref.source}</span>
                  <span className="text-xs font-mono text-textTertiary mt-0.5">{ref.category}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-mono font-bold text-textPrimary">{ref.views.toLocaleString()}</span>
                  <span className="text-[11px] font-mono text-accent font-bold mt-0.5">{ref.share}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* BLOCK 5: GAMES PERFORMANCE TABLE */}
      <div className="bg-surface-1 border border-borderDef rounded-xl overflow-hidden shadow-sm flex flex-col">
        <div className="p-5 border-b border-borderDef bg-surface-2/30 flex items-center justify-between">
          <div>
            <h4 className="text-base font-bold text-textPrimary">Сводка по проектам</h4>
            <p className="text-xs text-textSecondary font-mono mt-1">Детализация метрик по каждой игре</p>
          </div>
          <span className="text-xs font-mono font-bold text-textSecondary bg-surface-2 px-2 py-1 rounded border border-surface-3">Игр: {sortedGames.length}</span>
        </div>

        <div className="overflow-x-auto no-scrollbar min-w-full">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-surface-1 border-b border-borderDef text-textSecondary text-[11px] font-bold uppercase tracking-wider font-mono">
                <th className="py-4 px-5">Проект</th>
                <th 
                  onClick={() => toggleSort('views')} 
                  className="py-4 px-5 text-right cursor-pointer hover:text-textPrimary hover:bg-surface-2/50 transition-colors"
                >
                  Показы {tableSortKey === 'views' && (tableSortDesc ? '↓' : '↑')}
                </th>
                <th 
                  onClick={() => toggleSort('webglPlays')} 
                  className="py-4 px-5 text-right cursor-pointer hover:text-textPrimary hover:bg-surface-2/50 transition-colors"
                >
                  Сыграно {tableSortKey === 'webglPlays' && (tableSortDesc ? '↓' : '↑')}
                </th>
                <th 
                  onClick={() => toggleSort('downloads')} 
                  className="py-4 px-5 text-right cursor-pointer hover:text-textPrimary hover:bg-surface-2/50 transition-colors"
                >
                  Скачано {tableSortKey === 'downloads' && (tableSortDesc ? '↓' : '↑')}
                </th>
                <th 
                  onClick={() => toggleSort('conversion')} 
                  className="py-4 px-5 text-right cursor-pointer hover:text-textPrimary hover:bg-surface-2/50 transition-colors"
                >
                  Конверсия {tableSortKey === 'conversion' && (tableSortDesc ? '↓' : '↑')}
                </th>
                <th 
                  onClick={() => toggleSort('donateClicks')} 
                  className="py-4 px-5 text-right cursor-pointer hover:text-textPrimary hover:bg-surface-2/50 transition-colors"
                >
                  Донаты {tableSortKey === 'donateClicks' && (tableSortDesc ? '↓' : '↑')}
                </th>
                <th className="py-4 px-5 text-center">Анализ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderDef">
              {sortedGames.map(game => {
                const conversionRate = (((game.webglPlays + game.downloads) / (game.views || 1)) * 100).toFixed(1);

                return (
                  <tr key={game.id} className="hover:bg-surface-2/50 transition-colors group">
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        <img src={game.cover} alt={game.title} className="w-12 h-8 rounded-md object-cover border border-surface-3 shadow-sm shrink-0" />
                        <div className="flex flex-col">
                          <div className="font-bold text-textPrimary text-sm group-hover:text-accent transition-colors">{game.title}</div>
                          <div className="flex items-center gap-1.5 mt-1">
                            {game.platforms.includes('webgl') && <span title="WebGL"><Zap className="w-3 h-3 text-info" /></span>}
                            {game.platforms.includes('win') && <span title="Windows"><Monitor className="w-3 h-3 text-textSecondary" /></span>}
                            {game.platforms.includes('mac') && <span title="Mac"><Laptop className="w-3 h-3 text-textSecondary" /></span>}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-5 text-right text-textPrimary font-mono font-bold">{game.views.toLocaleString()}</td>
                    <td className="py-3 px-5 text-right text-info font-mono">{game.webglPlays.toLocaleString()}</td>
                    <td className="py-3 px-5 text-right text-textSecondary font-mono">{game.downloads.toLocaleString()}</td>
                    <td className="py-3 px-5 text-right">
                      <span className="inline-block px-2 py-0.5 bg-success/10 text-success border border-success/20 rounded font-mono font-bold text-[11px]">
                        {conversionRate}%
                      </span>
                    </td>
                    <td className="py-3 px-5 text-right text-textPrimary font-mono font-bold">{game.donateClicks}</td>
                    <td className="py-3 px-5 text-center">
                      <button 
                        onClick={() => { setSelectedGameId(game.id); triggerToast(`Открыта детальная аналитика: ${game.title}`); }}
                        className="w-8 h-8 flex items-center justify-center text-textSecondary hover:text-accent hover:bg-surface-3 rounded-md transition-colors mx-auto cursor-pointer"
                        title="Детальный анализ"
                      >
                        <BarChart2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      </>
      )}

      {/* EXPORT MODAL */}
      <ExportStatsModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        canViewFinance={scopeInfo.canViewFinance}
        onExportSuccess={(msg) => triggerToast(msg, 'success')}
      />
    </div>
  );
};
