import { RequestPayoutModal } from '../modals/RequestPayoutModal';
import { SellerVerificationModal } from '../modals/SellerVerificationModal';
import React, { useState, useEffect, useRef } from 'react';
import { Eye, Download, Users, Wallet, Plus, FileText, ChevronDown, AlertTriangle, XCircle, ShieldAlert, Bug, MessageSquare, UserPlus, Clock, Rocket, AlertCircle, RefreshCw, FolderKanban, User, ArrowUpRight, Filter, Search, Check, CheckCircle2, X, MoreVertical, Edit, ExternalLink, Trash2, ArrowRight, Layers, DollarSign, Settings, Lock, HelpCircle, CheckSquare, Sparkles, Send, CornerDownRight, BarChart2, TrendingUp, TrendingDown, Activity, ShieldCheck, ChevronRight, SlidersHorizontal, Info, Award, Star, Gamepad2, Upload, Edit3, Zap, Monitor, Laptop, Trophy, Heart, Copy, Flag, ThumbsUp, ThumbsDown, Calendar, Terminal, CreditCard, Building, Shield, Crown, LogOut, Mail } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { CustomSelect } from '../../../components/ui/Select';
import { MOCK_TEAMS, INITIAL_ATTENTION_ITEMS, MOCK_GAMES, MOCK_INBOX_REVIEWS, MOCK_INBOX_BUGS, MOCK_DEVLOGS, MOCK_BUGS, MOCK_REVIEWS, MOCK_ANALYTICS_GAMES, MOCK_TIMESERIES, MOCK_REFERRALS, MOCK_STRUCTURED_FEEDBACK, MOCK_SALES_ITEMS, MOCK_SALES_TIMESERIES, MOCK_RECENT_SALES, MOCK_REFUNDS, MOCK_PAYOUTS_HISTORY } from '../../../data/mockCreatorData';

interface CreatorSalesTabProps {
  scopeInfo: any;
  salesApiError: boolean;
  triggerToast: (msg: string, type?: string) => void;
}


  export const CreatorSalesTab: React.FC<CreatorSalesTabProps> = ({ scopeInfo, salesApiError, triggerToast }) => {
  const [selectedItemId, setSelectedItemId] = useState('all');
  const [period, setPeriod] = useState('30d');
  const [activeMetric, setActiveMetric] = useState('gross');
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [availableBalance, setAvailableBalance] = useState(45200);
  const [holdingBalance] = useState(12800);
  const [sellerStatus, setSellerStatus] = useState({ isVerified: true, type: 'ИП Ivanov A.V.' });

  // 1. Strict Team Access Check (BR-CRD-024)
  if (!scopeInfo.canViewFinance) {
    return (
      <div className="bg-surface-2 border border-borderDef rounded-xl p-12 text-center flex flex-col items-center gap-5 my-6 animate-fadeIn">
        <div className="w-16 h-16 rounded-full bg-danger/10 border border-danger/30 flex items-center justify-center text-danger">
          <Lock className="w-8 h-8 stroke-[1.5]" />
        </div>
        <div className="flex flex-col gap-2 max-w-[480px]">
          <h3 className="text-xl font-bold text-textPrimary">Доступ к разделу Продажи заблокирован</h3>
          <p className="text-xs text-textSecondary leading-relaxed">
            У вас недостаточно прав (finance.view) для просмотра финансовых результатов, баланса и выплат команды «{scopeInfo.name}». Обратитесь к капитану студии для получения доступа.
          </p>
        </div>
      </div>
    );
  }

  // Filter items based on scope
  const availableItems = MOCK_SALES_ITEMS.filter(item => {
    if (scopeInfo.name === 'Личный аккаунт') return item.scope === 'personal';
    return true;
  });

  const handlePayoutSuccess = (amount: number) => {
    setAvailableBalance(prev => prev - amount);
    triggerToast(`Запрос на вывод ₽ ${amount.toLocaleString()} отправлен в обработку`, 'success');
  };

  const handleSaveSeller = (data: { taxStatus: string; inn: string; bik: string; accountNum: string }) => {
    setSellerStatus({ isVerified: true, type: data.taxStatus.toUpperCase() });
    triggerToast('Реквизиты Продавца обновлены и отправлены на проверку', 'success');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* API ERROR BANNER (BR-CRD-007) */}
      {salesApiError && (
        <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 flex items-center justify-between gap-4 text-xs text-textPrimary shadow-sm">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-warning shrink-0" />
            <div>
              <span className="font-bold">Сервис транзакций M8 временно недоступен:</span>
              <p className="text-textSecondary mt-0.5">Часть финансовых данных может отображаться из кэша. Функции вывода средств ограничены.</p>
            </div>
          </div>
          <button 
            onClick={() => triggerToast('Запрос к биллингу повторен', 'info')}
            className="px-3 py-1.5 bg-surface-1 hover:bg-surface-2 border border-borderDef rounded-md font-mono text-xs flex items-center gap-1.5 shrink-0 transition-colors shadow-sm cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-accent" /> Повторить загрузку
          </button>
        </div>
      )}

      {/* BLOCK 1: TOOLBAR & SELLER VERIFICATION */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Item Selector */}
          <div className="relative min-w-[220px]">
            <CustomSelect
              value={selectedItemId}
              onChange={setSelectedItemId}
              options={[
                { value: 'all', label: 'Все продукты (Агрегация)' },
                ...availableItems.map(item => ({ value: item.id, label: `${item.title} (${item.price} ₽)` }))
              ]}
            />
          </div>

          {/* Sleek Period Segmented Control */}
          <div className="flex items-center bg-surface-2 p-1 border border-borderDef rounded-lg text-xs font-mono font-medium shadow-inner">
            {[
              { id: '7d', label: '7 дней' },
              { id: '30d', label: '30 дней' },
              { id: '90d', label: '90 дней' },
              { id: 'month', label: 'Этот месяц' }
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
        </div>

        {/* Verification Status */}
        <div className="flex items-center gap-3 shrink-0">
          {sellerStatus.isVerified ? (
            <button 
              onClick={() => setIsVerificationModalOpen(true)}
              className="px-3 py-1.5 bg-surface-2 hover:bg-surface-3 border border-borderDef text-textPrimary text-xs rounded-lg font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              title="Настройки выплат"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-success" />
              <span>Проверен ({sellerStatus.type})</span>
            </button>
          ) : (
            <button 
              onClick={() => setIsVerificationModalOpen(true)}
              className="px-3 py-1.5 bg-warning/10 hover:bg-warning/20 border border-warning/30 text-warning text-xs rounded-lg font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Заполнить реквизиты</span>
            </button>
          )}
        </div>
      </div>

      {/* BLOCK 2 & 3: FINANCIAL OVERVIEW HERO (Balance + KPIs + Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Balance Card */}
        <div className="lg:col-span-4 bg-surface-1 border border-borderDef rounded-xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden group">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-success/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
          
          <div>
            <div className="flex items-center gap-2 mb-4 text-xs font-mono text-textSecondary uppercase font-bold tracking-wider">
              <Wallet className="w-4 h-4 text-success" /> Текущий баланс
            </div>
            
            <div className="text-4xl font-mono font-bold text-textPrimary flex items-baseline gap-1.5">
              <span className="text-success text-2xl font-sans font-medium">₽</span>
              {availableBalance.toLocaleString()}
            </div>
            <p className="text-xs text-textSecondary mt-2 leading-relaxed max-w-[250px]">
              Доступно для безопасного вывода на привязанный счет.
            </p>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between text-xs font-mono border-t border-borderDef pt-4 mb-4">
              <span className="text-textSecondary">В холде (14 дней):</span>
              <span className="text-textPrimary font-bold">₽ {holdingBalance.toLocaleString()}</span>
            </div>
            <button
              onClick={() => setIsPayoutModalOpen(true)}
              className="w-full h-10 bg-textPrimary hover:bg-textSecondary text-surface-0 font-bold text-sm rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
            >
              Вывести средства
            </button>
          </div>
        </div>

        {/* Right: Metrics Tabs + Chart */}
        <div className="lg:col-span-8 bg-surface-1 border border-borderDef rounded-xl shadow-sm flex flex-col overflow-hidden">
          
          {/* Metric Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-borderDef bg-surface-2/30 divide-x divide-borderDef">
            {[
              { id: 'gross', label: 'Валовая прибыль', value: '147,100', prefix: '₽', trend: '+22.4%' },
              { id: 'net', label: 'Чистый доход', value: '125,045', prefix: '₽', trend: '+19.8%' },
              { id: 'count', label: 'Продано копий', value: '413', prefix: '', trend: '+15.1%' },
              { id: 'avg', label: 'Средний чек', value: '356', prefix: '₽', trend: 'Стабильно', disableClick: true }
            ].map(tab => (
              <div 
                key={tab.id}
                onClick={() => !tab.disableClick && setActiveMetric(tab.id)}
                className={`p-4 sm:p-5 transition-all relative group ${tab.disableClick ? 'opacity-80' : 'cursor-pointer'} ${activeMetric === tab.id ? 'bg-surface-1' : 'hover:bg-surface-1'}`}
              >
                {activeMetric === tab.id && <div className="absolute top-0 left-0 w-full h-1 bg-accent" />}
                <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider block mb-2 transition-colors ${activeMetric === tab.id ? 'text-accent' : 'text-textSecondary group-hover:text-textPrimary'}`}>
                  {tab.label}
                </span>
                <div className="text-lg sm:text-2xl font-mono font-bold text-textPrimary flex items-baseline gap-1">
                  {tab.prefix && <span className="text-textTertiary text-sm">{tab.prefix}</span>}
                  {tab.value}
                </div>
                <div className={`flex items-center gap-1 mt-2 text-[11px] font-mono ${tab.trend.includes('+') ? 'text-success' : 'text-textTertiary'}`}>
                  {tab.trend.includes('+') && <TrendingUp className="w-3 h-3" />}
                  <span className="font-bold">{tab.trend}</span>
                </div>
              </div>
            ))}
          </div>

          {/* SVG Chart */}
          <div className="p-6 relative flex-1 min-h-[260px] flex flex-col">
            <h3 className="text-base font-bold text-textPrimary mb-4">
              {activeMetric === 'gross' ? 'Динамика валовой прибыли' : activeMetric === 'net' ? 'Динамика чистого дохода' : 'Динамика продаж копий'}
            </h3>
            
            <div className="relative flex-1 w-full">
              <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 700 180" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Minimalist Grid lines */}
                <line x1="0" y1="0" x2="700" y2="0" stroke="#1F1F24" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
                <line x1="0" y1="60" x2="700" y2="60" stroke="#1F1F24" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
                <line x1="0" y1="120" x2="700" y2="120" stroke="#1F1F24" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
                <line x1="0" y1="180" x2="700" y2="180" stroke="#333338" strokeWidth="1" />

                {/* Area and Line */}
                {(() => {
                  const safeMetric = (activeMetric === 'gross' || activeMetric === 'net' || activeMetric === 'count' || activeMetric === 'pwyw') ? activeMetric : 'gross';
                  const maxValue = Math.max(...MOCK_SALES_TIMESERIES.map((d: any) => d[safeMetric] || 1));
                  const points = MOCK_SALES_TIMESERIES.map((d, idx) => {
                    const x = (idx / (MOCK_SALES_TIMESERIES.length - 1)) * 700;
                    const y = 160 - (((d as any)[safeMetric] || 0) / maxValue) * 140;
                    return { x, y, data: d };
                  });

                  const pathD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
                  const areaD = `${pathD} L 700 180 L 0 180 Z`;

                  return (
                    <g>
                      <path d={areaD} fill="url(#salesGradient)" />
                      <path d={pathD} fill="none" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      {points.map((p, i) => (
                        <circle
                          key={i}
                          cx={p.x}
                          cy={p.y}
                          r="4"
                          fill="#050505"
                          stroke="#8B5CF6"
                          strokeWidth="2.5"
                          className="hover:r-5 transition-all cursor-crosshair"
                        />
                      ))}
                    </g>
                  );
                })()}
              </svg>
            </div>

            {/* X-Axis Dates */}
            <div className="flex justify-between items-center text-[10px] font-mono text-textTertiary mt-3 px-1">
              {MOCK_SALES_TIMESERIES.map((d, i) => (
                <span key={i}>{d.date}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BLOCK 4: RECENT SALES & REFUNDS (TWO COLUMNS) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Recent Sales Feed */}
        <div className="bg-surface-1 border border-borderDef rounded-xl flex flex-col overflow-hidden shadow-sm">
          <div className="p-5 border-b border-borderDef bg-surface-2/30 flex items-center justify-between">
            <h4 className="text-sm font-bold text-textPrimary uppercase tracking-wider">Последние покупки</h4>
            <span className="text-xs font-mono text-textSecondary font-medium">Лайв-лента</span>
          </div>

          <div className="p-2 space-y-1">
            {MOCK_RECENT_SALES.map(sale => (
              <div key={sale.id} className="p-3 hover:bg-surface-2 rounded-lg flex items-center justify-between text-sm transition-colors group cursor-default">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                    <DollarSign className="w-4 h-4 text-success" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-textPrimary">{sale.itemTitle}</span>
                    <span className="text-[11px] font-mono text-textSecondary mt-0.5">
                      @{sale.buyer} • <span className="text-accent">{sale.method}</span> • {sale.date}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end text-right">
                  <span className="font-mono font-bold text-success">+₽{sale.amount}</span>
                  <span className="text-[10px] font-mono text-textTertiary mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">{sale.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Refunds & Disputes */}
        <div className="bg-surface-1 border border-borderDef rounded-xl flex flex-col overflow-hidden shadow-sm">
          <div className="p-5 border-b border-borderDef bg-surface-2/30 flex items-center justify-between">
            <h4 className="text-sm font-bold text-textPrimary uppercase tracking-wider">Возвраты</h4>
            <span className="text-xs font-mono text-textSecondary font-medium">Рассмотрение модерацией</span>
          </div>

          <div className="p-4 space-y-3">
            {MOCK_REFUNDS.map(ref => (
              <div key={ref.id} className="p-4 bg-surface-2/50 border border-borderDef rounded-xl flex flex-col gap-3 group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-textTertiary">{ref.id}</span>
                    <span className="font-bold text-textPrimary text-sm">{ref.itemTitle}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider ${
                    ref.status === 'approved' ? 'bg-success/10 text-success border border-success/20' : 'bg-accent/10 text-accent border border-accent/20'
                  }`}>
                    {ref.status === 'approved' ? 'Одобрено' : 'В обработке'}
                  </span>
                </div>
                <p className="text-sm text-textSecondary leading-relaxed">{ref.reason}</p>
                <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-surface-3">
                  <span className="text-textPrimary font-bold">₽ {ref.amount}</span>
                  <span className="text-textTertiary">{ref.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* BLOCK 5: PAYOUTS HISTORY TABLE */}
      <div className="bg-surface-1 border border-borderDef rounded-xl overflow-hidden shadow-sm flex flex-col">
        <div className="p-5 border-b border-borderDef bg-surface-2/30 flex items-center justify-between">
          <div>
            <h4 className="text-base font-bold text-textPrimary">История выплат</h4>
            <p className="text-xs text-textSecondary font-mono mt-1">Официальные чеки формируются по 54-ФЗ</p>
          </div>
        </div>

        <div className="overflow-x-auto min-w-full no-scrollbar">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-surface-1 border-b border-borderDef text-textSecondary text-[11px] font-bold uppercase tracking-wider font-mono">
                <th className="py-4 px-5">Транзакция</th>
                <th className="py-4 px-5">Дата</th>
                <th className="py-4 px-5 text-right">Сумма</th>
                <th className="py-4 px-5">Реквизиты</th>
                <th className="py-4 px-5 text-center">Статус</th>
                <th className="py-4 px-5 text-right">Документы</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderDef">
              {MOCK_PAYOUTS_HISTORY.map(po => (
                <tr key={po.id} className="hover:bg-surface-2/50 transition-colors group">
                  <td className="py-3 px-5 font-mono font-bold text-textPrimary">{po.id}</td>
                  <td className="py-3 px-5 text-textSecondary font-mono">{po.date}</td>
                  <td className="py-3 px-5 text-right font-mono font-bold text-success flex items-baseline justify-end gap-1"><span className="text-success text-[11px]">₽</span>{po.amount.toLocaleString()}</td>
                  <td className="py-3 px-5 text-textSecondary font-mono">{po.details}</td>
                  <td className="py-3 px-5 text-center">
                    <span className="px-2 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-success/10 text-success border border-success/20 flex items-center justify-center gap-1.5 w-fit mx-auto">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Выполнено
                    </span>
                  </td>
                  <td className="py-3 px-5 text-right">
                    <button 
                      onClick={() => triggerToast(`Чек 54-ФЗ для ${po.id} скачан`, 'info')}
                      className="px-3 py-1.5 bg-surface-2 hover:bg-surface-3 border border-borderDef text-textPrimary rounded-md text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ml-auto transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                    >
                      <Download className="w-3.5 h-3.5 text-accent" /> Чек
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALS */}
      <RequestPayoutModal 
        isOpen={isPayoutModalOpen}
        onClose={() => setIsPayoutModalOpen(false)}
        availableBalance={availableBalance}
        onConfirmPayout={handlePayoutSuccess}
      />

      <SellerVerificationModal 
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        onSaveSellerInfo={handleSaveSeller}
      />

    </div>
  );
};
