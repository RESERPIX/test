import React, { useState, useEffect, useRef } from 'react';
import { Eye, Download, Users, Wallet, Plus, FileText, ChevronDown, AlertTriangle, XCircle, ShieldAlert, Bug, MessageSquare, UserPlus, Clock, Rocket, AlertCircle, RefreshCw, FolderKanban, User, ArrowUpRight, Filter, Search, Check, CheckCircle2, X, MoreVertical, Edit, ExternalLink, Trash2, ArrowRight, Layers, DollarSign, Settings, Lock, HelpCircle, CheckSquare, Sparkles, Send, CornerDownRight, BarChart2, TrendingUp, TrendingDown, Activity, ShieldCheck, ChevronRight, SlidersHorizontal, Info, Award, Star, Gamepad2, Upload, Edit3, Zap, Monitor, Laptop, Trophy, Heart, Copy, Flag, ThumbsUp, ThumbsDown, Calendar, Terminal, CreditCard, Building, Shield, Crown, LogOut, Mail } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { MOCK_TEAMS, INITIAL_ATTENTION_ITEMS, MOCK_GAMES, MOCK_INBOX_REVIEWS, MOCK_INBOX_BUGS, MOCK_DEVLOGS, MOCK_BUGS, MOCK_REVIEWS, MOCK_ANALYTICS_GAMES, MOCK_TIMESERIES, MOCK_REFERRALS, MOCK_STRUCTURED_FEEDBACK, MOCK_SALES_ITEMS, MOCK_SALES_TIMESERIES, MOCK_RECENT_SALES, MOCK_REFUNDS, MOCK_PAYOUTS_HISTORY } from '../../../data/mockCreatorData';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamName: string;
  onSendInvite: (data: { userQuery: string; role: string; permissions: Record<string, boolean> }) => void;
}

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({ isOpen, onClose, teamName, onSendInvite }) => {
  const [userQuery, setUserQuery] = useState('');
  const [role, setRole] = useState('member');
  const [permissions, setPermissions] = useState<Record<string, boolean>>({
    game_manage: true,
    devlog_manage: true,
    reviews_manage: false,
    feedback_manage: false,
    bugs_manage: true,
    stats_view: false,
    finance_view: false,
    team_manage_support: false
  });

  if (!isOpen) return null;

  const handleTogglePerm = (key: string) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;
    onSendInvite({ userQuery, role, permissions });
    setUserQuery('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Пригласить участника в команду"
      subtitle={`Студия: ${teamName}`}
      icon={<UserPlus />}
      maxWidth="md"
    >
      <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="text-xs font-mono text-textSecondary uppercase font-bold block mb-1">Пользователь / Никнейм или Email *</label>
            <div className="relative">
              <input 
                type="text" 
                value={userQuery}
                onChange={e => setUserQuery(e.target.value)}
                placeholder="@nickname или email@domain.com"
                required
                className="w-full bg-surface-0 border border-surface-3 focus:border-accent text-textPrimary pl-9 pr-3 py-2.5 rounded-md text-xs outline-none font-mono"
              />
              <Search className="w-4 h-4 text-textSecondary absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-textSecondary uppercase font-bold block mb-1">Роль в команде</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`p-2.5 rounded-md border text-xs text-left transition-colors ${role === 'admin' ? 'border-accent bg-accent/10 text-textPrimary' : 'border-surface-3 bg-surface-0 text-textSecondary'}`}
              >
                <div className="font-bold flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-accent" /> Администратор</div>
                <div className="text-xs text-textSecondary mt-0.5">Полное управление проектами</div>
              </button>
              <button
                type="button"
                onClick={() => setRole('member')}
                className={`p-2.5 rounded-md border text-xs text-left transition-colors ${role === 'member' ? 'border-accent bg-accent/10 text-textPrimary' : 'border-surface-3 bg-surface-0 text-textSecondary'}`}
              >
                <div className="font-bold flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-info" /> Участник</div>
                <div className="text-xs text-textSecondary mt-0.5">Ограниченные права по списку</div>
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-textSecondary uppercase font-bold block mb-2">Первоначальные разрешения</label>
            <div className="grid grid-cols-2 gap-2 bg-surface-0 p-3 rounded-lg border border-surface-3 text-xs">
              {[
                { key: 'game_manage', label: 'game.manage (Игры)' },
                { key: 'devlog_manage', label: 'devlog.manage (DevLog)' },
                { key: 'reviews_manage', label: 'reviews.manage (Отзывы)' },
                { key: 'bugs_manage', label: 'bugs.manage (Баги)' },
                { key: 'stats_view', label: 'stats.view (Статистика)' },
                { key: 'finance_view', label: 'finance.view (Выручка)' }
              ].map(item => (
                <label key={item.key} className="flex items-center gap-2 cursor-pointer text-textSecondary">
                  <input 
                    type="checkbox" 
                    checked={permissions[item.key]}
                    onChange={() => handleTogglePerm(item.key)}
                    className="accent-accent rounded"
                  />
                  <span className="font-mono text-xs">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-surface-1 hover:bg-surface-2 text-textSecondary hover:text-textPrimary text-xs font-semibold transition-colors">
              Отмена
            </button>
            <button type="submit" className="px-5 py-2 rounded-md bg-accent hover:bg-accent-hover text-surface-0 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5" /> Отправить приглашение
            </button>
          </div>
        </form>
    </Modal>
  );
};