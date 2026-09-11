import React, { useState, useEffect, useRef } from 'react';
import { Eye, Download, Users, Wallet, Plus, FileText, ChevronDown, AlertTriangle, XCircle, ShieldAlert, Bug, MessageSquare, UserPlus, Clock, Rocket, AlertCircle, RefreshCw, FolderKanban, User, ArrowUpRight, Filter, Search, Check, CheckCircle2, X, MoreVertical, Edit, ExternalLink, Trash2, ArrowRight, Layers, DollarSign, Settings, Lock, HelpCircle, CheckSquare, Sparkles, Send, CornerDownRight, BarChart2, TrendingUp, TrendingDown, Activity, ShieldCheck, ChevronRight, SlidersHorizontal, Info, Award, Star, Gamepad2, Upload, Edit3, Zap, Monitor, Laptop, Trophy, Heart, Copy, Flag, ThumbsUp, ThumbsDown, Calendar, Terminal, CreditCard, Building, Shield, Crown, LogOut, Mail } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { MOCK_TEAMS, INITIAL_ATTENTION_ITEMS, MOCK_GAMES, MOCK_INBOX_REVIEWS, MOCK_INBOX_BUGS, MOCK_DEVLOGS, MOCK_BUGS, MOCK_REVIEWS, MOCK_ANALYTICS_GAMES, MOCK_TIMESERIES, MOCK_REFERRALS, MOCK_STRUCTURED_FEEDBACK, MOCK_SALES_ITEMS, MOCK_SALES_TIMESERIES, MOCK_RECENT_SALES, MOCK_REFUNDS, MOCK_PAYOUTS_HISTORY } from '../../../data/mockCreatorData';

interface SellerVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSellerInfo: (data: { taxStatus: string; inn: string; bik: string; accountNum: string }) => void;
}

export const SellerVerificationModal: React.FC<SellerVerificationModalProps> = ({ isOpen, onClose, onSaveSellerInfo }) => {
  const [taxStatus, setTaxStatus] = useState('ip');
  const [inn, setInn] = useState('770123456789');
  const [bik, setBik] = useState('044525225');
  const [accountNum, setAccountNum] = useState('40802810400000008901');
  const [agreeOffer, setAgreeOffer] = useState(true);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeOffer) return;
    onSaveSellerInfo({ taxStatus, inn, bik, accountNum });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Настройка реквизитов Продавца"
      subtitle="Верификация юридического статуса для приема коммерческих платежей"
      icon={<ShieldCheck />}
      maxWidth="md"
    >
      <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-mono text-textSecondary uppercase font-bold block mb-1.5">Налоговый статус</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'npd', label: 'Самозанятый (НПД)' },
                { id: 'ip', label: 'ИП' },
                { id: 'ooo', label: 'ООО / Юр.Лицо' }
              ].map(t => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setTaxStatus(t.id)}
                  className={`p-2.5 rounded-md border text-xs font-semibold transition-colors ${
                    taxStatus === t.id ? 'border-accent bg-accent/10 text-textPrimary' : 'border-surface-3 bg-surface-0 text-textSecondary'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono text-textSecondary uppercase font-bold block mb-1">ИНН</label>
              <input 
                type="text" 
                value={inn}
                onChange={e => setInn(e.target.value)}
                required
                className="w-full bg-surface-0 border border-surface-3 text-textPrimary px-3 py-2 rounded-md text-xs font-mono outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-textSecondary uppercase font-bold block mb-1">БИК Банка</label>
              <input 
                type="text" 
                value={bik}
                onChange={e => setBik(e.target.value)}
                required
                className="w-full bg-surface-0 border border-surface-3 text-textPrimary px-3 py-2 rounded-md text-xs font-mono outline-none focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-textSecondary uppercase font-bold block mb-1">Номер расчётного счёта</label>
            <input 
              type="text" 
              value={accountNum}
              onChange={e => setAccountNum(e.target.value)}
              required
              className="w-full bg-surface-0 border border-surface-3 text-textPrimary px-3 py-2 rounded-md text-xs font-mono outline-none focus:border-accent"
            />
          </div>

          <label className="flex items-start gap-2 text-xs text-textSecondary pt-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={agreeOffer} 
              onChange={e => setAgreeOffer(e.target.checked)} 
              className="mt-0.5 rounded accent-accent"
            />
            <span>Я принимаю условия <a href="#" className="text-accent underline">Публичной оферты Продавца Hubigr (M8)</a> и подлежащих налоговых сборов.</span>
          </label>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-surface-1 hover:bg-surface-2 text-textSecondary hover:text-textPrimary text-xs font-semibold transition-colors"
            >
              Отмена
            </button>
            <button 
              type="submit"
              disabled={!agreeOffer}
              className="px-5 py-2 rounded-md bg-accent hover:bg-accent-hover text-surface-0 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              Сохранить реквизиты
            </button>
          </div>
        </form>
    </Modal>
  );
};
