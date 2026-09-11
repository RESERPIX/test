import React, { useState, useEffect, useRef } from 'react';
import { Eye, Download, Users, Wallet, Plus, FileText, ChevronDown, AlertTriangle, XCircle, ShieldAlert, Bug, MessageSquare, UserPlus, Clock, Rocket, AlertCircle, RefreshCw, FolderKanban, User, ArrowUpRight, Filter, Search, Check, CheckCircle2, X, MoreVertical, Edit, ExternalLink, Trash2, ArrowRight, Layers, DollarSign, Settings, Lock, HelpCircle, CheckSquare, Sparkles, Send, CornerDownRight, BarChart2, TrendingUp, TrendingDown, Activity, ShieldCheck, ChevronRight, SlidersHorizontal, Info, Award, Star, Gamepad2, Upload, Edit3, Zap, Monitor, Laptop, Trophy, Heart, Copy, Flag, ThumbsUp, ThumbsDown, Calendar, Terminal, CreditCard, Building, Shield, Crown, LogOut, Mail } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { MOCK_TEAMS, INITIAL_ATTENTION_ITEMS, MOCK_GAMES, MOCK_INBOX_REVIEWS, MOCK_INBOX_BUGS, MOCK_DEVLOGS, MOCK_BUGS, MOCK_REVIEWS, MOCK_ANALYTICS_GAMES, MOCK_TIMESERIES, MOCK_REFERRALS, MOCK_STRUCTURED_FEEDBACK, MOCK_SALES_ITEMS, MOCK_SALES_TIMESERIES, MOCK_RECENT_SALES, MOCK_REFUNDS, MOCK_PAYOUTS_HISTORY } from '../../../data/mockCreatorData';

interface ExportStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  canViewFinance?: boolean;
  onExportSuccess: (msg: string) => void;
}

export const ExportStatsModal: React.FC<ExportStatsModalProps> = ({ isOpen, onClose, canViewFinance, onExportSuccess }) => {
  const [format, setFormat] = useState('csv');
  const [includeViews, setIncludeViews] = useState(true);
  const [includeTraffic, setIncludeTraffic] = useState(true);
  const [includeDonations, setIncludeDonations] = useState(true);
  const [includeFinance, setIncludeFinance] = useState(canViewFinance);

  if (!isOpen) return null;

  const handleExport = () => {
    onExportSuccess(`Отчёт аналитики выгружен в формате .${format.toUpperCase()}`);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Экспорт аналитических данных"
      subtitle="Выгрузка агрегированного отчёта во внешние файлы"
      icon={<Download />}
      maxWidth="md"
    >
      <div className="space-y-5">
          {/* Format Selection */}
          <div>
            <label className="text-xs font-mono text-textSecondary uppercase font-bold block mb-2">Формат выгрузки</label>
            <div className="grid grid-cols-2 gap-3">
              <label 
                onClick={() => setFormat('csv')}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  format === 'csv' ? 'border-accent bg-accent/10 text-textPrimary' : 'border-surface-3 bg-surface-0 text-textSecondary hover:border-borderDef'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${format === 'csv' ? 'border-accent' : 'border-borderStrong'}`}>
                  {format === 'csv' && <div className="w-2 h-2 rounded-full bg-accent" />}
                </div>
                <span className="text-xs font-semibold">CSV-таблица (Excel)</span>
              </label>

              <label 
                onClick={() => setFormat('json')}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  format === 'json' ? 'border-accent bg-accent/10 text-textPrimary' : 'border-surface-3 bg-surface-0 text-textSecondary hover:border-borderDef'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${format === 'json' ? 'border-accent' : 'border-borderStrong'}`}>
                  {format === 'json' && <div className="w-2 h-2 rounded-full bg-accent" />}
                </div>
                <span className="text-xs font-semibold">JSON-структура</span>
              </label>
            </div>
          </div>

          {/* Data Sections Checkboxes */}
          <div>
            <label className="text-xs font-mono text-textSecondary uppercase font-bold block mb-2">Выборка выгружаемых секций</label>
            <div className="space-y-2 bg-surface-0 p-3 rounded-lg border border-surface-3">
              <label className="flex items-center gap-2.5 text-xs text-textPrimary cursor-pointer">
                <input type="checkbox" checked={includeViews} onChange={e => setIncludeViews(e.target.checked)} className="rounded accent-accent" />
                <span>Просмотры страниц и установки билдов</span>
              </label>
              
              <label className="flex items-center gap-2.5 text-xs text-textPrimary cursor-pointer">
                <input type="checkbox" checked={includeTraffic} onChange={e => setIncludeTraffic(e.target.checked)} className="rounded accent-accent" />
                <span>Источники трафика и платформы ОС</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-textPrimary cursor-pointer">
                <input type="checkbox" checked={includeDonations} onChange={e => setIncludeDonations(e.target.checked)} className="rounded accent-accent" />
                <span>Статистика кликов по кнопкам поддержки (M5)</span>
              </label>

              <label className={`flex items-center gap-2.5 text-xs ${canViewFinance ? 'text-textPrimary cursor-pointer' : 'text-borderStrong cursor-not-allowed'}`}>
                <input 
                  type="checkbox" 
                  disabled={!canViewFinance} 
                  checked={canViewFinance && includeFinance} 
                  onChange={e => setIncludeFinance(e.target.checked)} 
                  className="rounded accent-accent" 
                />
                <span className="flex items-center gap-1.5">
                  Финансовые показатели и выручка (M8)
                  {!canViewFinance && <Lock className="w-3 h-3 text-warning" />}
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-surface-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-surface-1 hover:bg-surface-2 text-textSecondary hover:text-textPrimary text-xs font-semibold transition-colors"
          >
            Отмена
          </button>
          <button 
            onClick={handleExport}
            className="px-5 py-2 rounded-md bg-accent hover:bg-accent-hover text-surface-0 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" /> Скачать отчёт
          </button>
        </div>
    </Modal>
  );
};
