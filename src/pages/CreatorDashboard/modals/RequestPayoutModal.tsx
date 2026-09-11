import React, { useState, useEffect, useRef } from 'react';
import { Eye, Download, Users, Wallet, Plus, FileText, ChevronDown, AlertTriangle, XCircle, ShieldAlert, Bug, MessageSquare, UserPlus, Clock, Rocket, AlertCircle, RefreshCw, FolderKanban, User, ArrowUpRight, Filter, Search, Check, CheckCircle2, X, MoreVertical, Edit, ExternalLink, Trash2, ArrowRight, Layers, DollarSign, Settings, Lock, HelpCircle, CheckSquare, Sparkles, Send, CornerDownRight, BarChart2, TrendingUp, TrendingDown, Activity, ShieldCheck, ChevronRight, SlidersHorizontal, Info, Award, Star, Gamepad2, Upload, Edit3, Zap, Monitor, Laptop, Trophy, Heart, Copy, Flag, ThumbsUp, ThumbsDown, Calendar, Terminal, CreditCard, Building, Shield, Crown, LogOut, Mail } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { MOCK_TEAMS, INITIAL_ATTENTION_ITEMS, MOCK_GAMES, MOCK_INBOX_REVIEWS, MOCK_INBOX_BUGS, MOCK_DEVLOGS, MOCK_BUGS, MOCK_REVIEWS, MOCK_ANALYTICS_GAMES, MOCK_TIMESERIES, MOCK_REFERRALS, MOCK_STRUCTURED_FEEDBACK, MOCK_SALES_ITEMS, MOCK_SALES_TIMESERIES, MOCK_RECENT_SALES, MOCK_REFUNDS, MOCK_PAYOUTS_HISTORY } from '../../../data/mockCreatorData';

interface RequestPayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
  onConfirmPayout: (amount: number) => void;
}

export const RequestPayoutModal: React.FC<RequestPayoutModalProps> = ({ isOpen, onClose, availableBalance, onConfirmPayout }) => {
  const [payoutAmount, setPayoutAmount] = useState(availableBalance.toString());
  const [payoutMethod, setPayoutMethod] = useState('bank_account');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    const num = parseFloat(payoutAmount);
    if (isNaN(num) || num < 1000) {
      setError('Минимальная сумма для вывода составляет 1 000 ₽');
      return;
    }
    if (num > availableBalance) {
      setError('Запрошенная сумма превышает доступный баланс');
      return;
    }
    setError('');
    onConfirmPayout(num);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Запрос вывода средств"
      subtitle="Оформление выплаты накопленного баланса Маркета"
      icon={<Wallet />}
      maxWidth="md"
    >
      <div className="space-y-4">
          <div className="bg-surface-0 border border-surface-3 p-3.5 rounded-lg flex justify-between items-center">
            <span className="text-xs text-textSecondary font-medium">Доступно к выводу:</span>
            <span className="text-lg font-mono font-bold text-success">₽ {availableBalance.toLocaleString()}</span>
          </div>

          <div>
            <label className="text-xs font-mono text-textSecondary uppercase font-bold block mb-1.5">Сумма к выплате (₽)</label>
            <input 
              type="number"
              value={payoutAmount}
              onChange={e => { setPayoutAmount(e.target.value); setError(''); }}
              placeholder="1000"
              className="w-full bg-surface-0 border border-surface-3 focus:border-accent text-textPrimary px-3 py-2.5 rounded-md text-sm font-mono outline-none"
            />
            {error && <p className="text-xs text-danger mt-1 font-mono">{error}</p>}
          </div>

          <div>
            <label className="text-xs font-mono text-textSecondary uppercase font-bold block mb-1.5">Реквизиты для зачисления</label>
            <div className="space-y-2">
              <label 
                onClick={() => setPayoutMethod('bank_account')}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                  payoutMethod === 'bank_account' ? 'border-accent bg-accent/10 text-textPrimary' : 'border-surface-3 bg-surface-0 text-textSecondary'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Building className="w-4 h-4 text-accent" />
                  <span className="text-xs font-semibold">Расчётный счёт ИП Иванов А.В. (...8901)</span>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${payoutMethod === 'bank_account' ? 'border-accent' : 'border-borderStrong'}`}>
                  {payoutMethod === 'bank_account' && <div className="w-2 h-2 rounded-full bg-accent" />}
                </div>
              </label>

              <label 
                onClick={() => setPayoutMethod('sbp_card')}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                  payoutMethod === 'sbp_card' ? 'border-accent bg-accent/10 text-textPrimary' : 'border-surface-3 bg-surface-0 text-textSecondary'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-info" />
                  <span className="text-xs font-semibold">Карта СБП / Самозанятый (...4012)</span>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${payoutMethod === 'sbp_card' ? 'border-accent' : 'border-borderStrong'}`}>
                  {payoutMethod === 'sbp_card' && <div className="w-2 h-2 rounded-full bg-accent" />}
                </div>
              </label>
            </div>
          </div>

          <div className="p-3 bg-surface-0 border border-surface-3 rounded-lg text-xs text-textSecondary leading-relaxed">
            Выплата обрабатывается в течение 1–3 рабочих дней. Онлайн-чеки по 54-ФЗ генерируются автоматически и будут доступны в таблице истории выплат.
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
            onClick={handleConfirm}
            className="px-5 py-2 rounded-md bg-success hover:bg-success text-surface-0 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
          >
            <Wallet className="w-3.5 h-3.5" /> Подтвердить вывод
          </button>
        </div>
    </Modal>
  );
};
