import React, { useState, useMemo } from 'react';
import { 
  Receipt, ShieldAlert, CreditCard, CheckCircle2, Clock, 
  RotateCcw, XCircle, Search, Filter, ArrowUpDown, ArrowRight, 
  Download, Eye, ExternalLink, Gamepad2, AlertTriangle, RefreshCw
} from 'lucide-react';
import Button from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { SearchInput } from '../components/ui/Input';
import { CustomSelect } from '../components/ui/Select';
import { useToast } from '../components/ui/Toast';
import { ReceiptModal } from '../components/modals/ReceiptModal';
import { RefundRequestModal } from '../components/modals/RefundRequestModal';
import DevMatrixPanel, { DevMatrixField } from '../components/DevMatrixPanel';

export interface PurchaseOrder {
  id: string;
  gameId: string | number;
  gameSlug: string;
  gameTitle: string;
  gameCover: string;
  developer: string;
  date: string;
  amount: number;
  paymentMethod: 'card' | 'sbp';
  paymentMethodLabel: string;
  status: 'completed' | 'pending' | 'refunded' | 'failed' | 'refund_requested';
  fiscalDocNumber?: string;
  refundReason?: string;
  refundRequestedAt?: string;
}

const INITIAL_PURCHASES: PurchaseOrder[] = [
  {
    id: '#ORD-2026-9812',
    gameId: 1,
    gameSlug: 'cyber-quest-neon',
    gameTitle: 'Cyber Quest: Neon Awakening',
    gameCover: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800',
    developer: '@cyber_studio',
    date: '02 сентября 2026, 14:30',
    amount: 350,
    paymentMethod: 'card',
    paymentMethodLabel: 'Банковская карта РФ (МИР •••• 4210)',
    status: 'completed',
    fiscalDocNumber: '49201',
  },
  {
    id: '#ORD-2026-8740',
    gameId: 3,
    gameSlug: 'stellar-drift',
    gameTitle: 'Stellar Drift: Deep Space',
    gameCover: 'https://images.unsplash.com/photo-1614294149010-950b698f72c0?q=80&w=800',
    developer: '@orbit_studios',
    date: '28 августа 2026, 19:15',
    amount: 450,
    paymentMethod: 'sbp',
    paymentMethodLabel: 'Система быстрых платежей (СБП)',
    status: 'completed',
    fiscalDocNumber: '48834',
  },
  {
    id: '#ORD-2026-7611',
    gameId: 4,
    gameSlug: 'abyssal-soulslike',
    gameTitle: 'Abyssal Soulslike',
    gameCover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800',
    developer: '@ironforge',
    date: '15 августа 2026, 21:05',
    amount: 600,
    paymentMethod: 'card',
    paymentMethodLabel: 'Банковская карта РФ (Mastercard •••• 8819)',
    status: 'refunded',
    fiscalDocNumber: '47510',
    refundReason: 'Технические проблемы / не запускается',
  },
  {
    id: '#ORD-2026-6549',
    gameId: 10,
    gameSlug: 'neon-abyss-outrun',
    gameTitle: 'Neon Abyss: Outrun',
    gameCover: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?q=80&w=800',
    developer: '@vector_corp',
    date: '08 сентября 2026, 11:20',
    amount: 290,
    paymentMethod: 'sbp',
    paymentMethodLabel: 'Система быстрых платежей (СБП)',
    status: 'pending',
    fiscalDocNumber: '50112',
  },
  {
    id: '#ORD-2026-5120',
    gameId: 11,
    gameSlug: 'hollow-citadel',
    gameTitle: 'Hollow Citadel: Reborn',
    gameCover: 'https://images.unsplash.com/photo-1569705460033-cfaa4bf9f822?q=80&w=800',
    developer: '@dark_castle',
    date: '01 августа 2026, 16:40',
    amount: 420,
    paymentMethod: 'card',
    paymentMethodLabel: 'Банковская карта РФ (Visa •••• 1102)',
    status: 'failed',
  },
];

interface PurchaseHistoryPageProps {
  onNavigate?: (path: string) => void;
  authState?: string;
  setAuthState?: (val: string) => void;
}

export default function PurchaseHistoryPage({
  onNavigate = (path: string) => {
    if ((window as any).__hubigrNavigate) {
      (window as any).__hubigrNavigate(path);
    }
  },
  authState = 'player',
  setAuthState = () => {},
}: PurchaseHistoryPageProps) {
  const { showToast } = useToast();

  // QA State
  const [isBanned, setIsBanned] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'completed' | 'refunded' | 'empty'>('all');

  // Search and Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'refunded' | 'failed'>('all');
  const [sortOption, setSortOption] = useState<'newest' | 'oldest' | 'amount_desc'>('newest');

  // Orders data
  const [orders, setOrders] = useState<PurchaseOrder[]>(INITIAL_PURCHASES);

  // Modals state
  const [receiptOrder, setReceiptOrder] = useState<PurchaseOrder | null>(null);
  const [refundOrder, setRefundOrder] = useState<PurchaseOrder | null>(null);

  // Filtered orders computation
  const displayedOrders = useMemo(() => {
    if (filterMode === 'empty') return [];

    let list = [...orders];

    if (filterMode === 'completed') {
      list = list.filter(o => o.status === 'completed');
    } else if (filterMode === 'refunded') {
      list = list.filter(o => o.status === 'refunded' || o.status === 'refund_requested');
    }

    if (statusFilter !== 'all') {
      list = list.filter(o => o.status === statusFilter || (statusFilter === 'refunded' && o.status === 'refund_requested'));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(o => 
        o.id.toLowerCase().includes(q) ||
        o.gameTitle.toLowerCase().includes(q) ||
        o.developer.toLowerCase().includes(q)
      );
    }

    if (sortOption === 'newest') {
      // already sorted newest
    } else if (sortOption === 'oldest') {
      list.reverse();
    } else if (sortOption === 'amount_desc') {
      list.sort((a, b) => b.amount - a.amount);
    }

    return list;
  }, [orders, filterMode, statusFilter, searchQuery, sortOption]);

  // Handlers
  const handleRefundSubmit = (orderId: string, reason: string, comment: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'refund_requested',
          refundReason: reason,
          refundRequestedAt: 'Сегодня, только что',
        };
      }
      return o;
    }));
  };

  const handleConfirmPendingPayment = (orderId: string) => {
    showToast('Проверка статуса оплаты в платёжном шлюзе...', 'info');
    setTimeout(() => {
      setOrders(prev => prev.map(o => {
        if (o.id === orderId) {
          return {
            ...o,
            status: 'completed',
          };
        }
        return o;
      }));
      showToast(`Оплата заказа ${orderId} подтверждена! Игра добавлена в библиотеку.`, 'success');
    }, 1200);
  };

  // 1. Blocked User Mode (AC-MKT-084, ERR-MKT-002, ERR-MKT-019)
  if (isBanned) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 font-sans">
        <div className="bg-surface-1 border border-danger/30 rounded-3xl p-8 sm:p-12 flex flex-col items-center text-center shadow-elevation-raised gap-6">
          <div className="w-20 h-20 bg-danger/10 text-danger rounded-full flex items-center justify-center ring-8 ring-danger/5">
            <ShieldAlert className="w-10 h-10" />
          </div>

          <div className="space-y-2 max-w-lg">
            <Badge variant="danger" size="md" className="uppercase tracking-widest font-mono text-[10px]">
              Ограниченный доступ
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-black text-textPrimary tracking-tight">
              Доступ к истории покупок ограничен
            </h1>
            <p className="text-sm text-textSecondary leading-relaxed">
              Ваш аккаунт заблокирован администрацией площадки. Просмотр финансовых транзакций, чеков и функционал маркета закрыты в соответствии с правилами безопасности платформы.
            </p>
          </div>

          <div className="bg-surface-2/70 border border-borderDef/60 rounded-2xl p-4 text-xs text-textSecondary text-left max-w-md w-full space-y-2">
            <div className="flex items-center gap-2 text-textPrimary font-bold">
              <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
              <span>Сохранение цифровых прав (BR-ACC-055):</span>
            </div>
            <p className="text-textTertiary leading-relaxed">
              Все ранее приобретенные вами игры остаются доступными для запуска и загрузки в вашей персональной Библиотеке.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md pt-2">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => onNavigate('/library')}
              icon={<Gamepad2 className="w-4 h-4" />}
            >
              Перейти в Библиотеку игр
            </Button>
            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={() => onNavigate('/support')}
            >
              Поддержка и апелляция
            </Button>
          </div>
        </div>

        <DevMatrixPanel
          pageName="История покупок"
          fields={[
            {
              id: 'banned',
              label: 'Бан аккаунта',
              type: 'checkbox',
              value: isBanned,
              onChange: setIsBanned,
            },
          ]}
        />
      </div>
    );
  }

  // 2. Normal View: Purchase History (SC-MKT-069, FE-MKT-008)
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8 pb-24 font-sans">
      {/* Top Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-borderDef/50 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
              <Receipt className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent">
              Финансовый профиль
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-textPrimary tracking-tight">
            ИСТОРИЯ ПОКУПОК
          </h1>
          <p className="text-xs text-textSecondary mt-1">
            Ваши заказы, электронные чеки и операции возвратов на платформе Хабигр
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={() => onNavigate('/market')}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            В маркет
          </Button>
        </div>
      </header>

      {/* Controls Bar: Search & Status Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:max-w-md">
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            placeholder="Поиск по номеру заказа или названию игры..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Status quick tabs */}
          <div className="bg-surface-1 p-1 rounded-xl border border-borderDef/50 flex gap-1 text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                statusFilter === 'all' ? 'bg-accent text-white shadow-sm' : 'text-textTertiary hover:text-textPrimary'
              }`}
            >
              Все
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                statusFilter === 'completed' ? 'bg-accent text-white shadow-sm' : 'text-textTertiary hover:text-textPrimary'
              }`}
            >
              Оплачено
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                statusFilter === 'pending' ? 'bg-accent text-white shadow-sm' : 'text-textTertiary hover:text-textPrimary'
              }`}
            >
              В ожидании
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('refunded')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                statusFilter === 'refunded' ? 'bg-accent text-white shadow-sm' : 'text-textTertiary hover:text-textPrimary'
              }`}
            >
              Возвраты
            </button>
          </div>

          <CustomSelect
            value={sortOption}
            onChange={(v) => setSortOption(v as any)}
            icon={<ArrowUpDown className="w-3.5 h-3.5 text-accent" />}
            className="w-full sm:w-[200px]"
            options={[
              { value: 'newest', label: 'Сначала новые' },
              { value: 'oldest', label: 'Сначала старые' },
              { value: 'amount_desc', label: 'По сумме (убыв.)' },
            ]}
          />
        </div>
      </div>

      {/* Orders List / Table */}
      {displayedOrders.length > 0 ? (
        <div className="bg-surface-1 rounded-3xl border border-borderDef/50 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-surface-2/80 border-b border-borderDef/50 text-textTertiary font-semibold uppercase tracking-wider font-mono">
                <tr>
                  <th className="px-6 py-4">Номер и дата</th>
                  <th className="px-6 py-4">Товар / Игра</th>
                  <th className="px-6 py-4">Способ оплаты</th>
                  <th className="px-6 py-4">Сумма</th>
                  <th className="px-6 py-4">Статус</th>
                  <th className="px-6 py-4 text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderDef/30 text-textSecondary">
                {displayedOrders.map((order) => {
                  return (
                    <tr key={order.id} className="hover:bg-surface-2/30 transition-colors">
                      {/* 1. Order Number & Date */}
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-textPrimary block text-xs">
                          {order.id}
                        </span>
                        <span className="text-[11px] text-textTertiary block mt-0.5">
                          {order.date}
                        </span>
                      </td>

                      {/* 2. Game Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={order.gameCover}
                            alt={order.gameTitle}
                            className="w-10 h-10 rounded-lg object-cover border border-borderDef shrink-0"
                          />
                          <div className="space-y-0.5">
                            <span 
                              onClick={() => onNavigate(`/games/${order.gameSlug}`)}
                              className="font-bold text-textPrimary hover:text-accent cursor-pointer transition-colors block leading-tight text-xs"
                            >
                              {order.gameTitle}
                            </span>
                            <span className="text-[11px] text-textTertiary block">
                              {order.developer}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 3. Payment Method */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {order.paymentMethod === 'card' ? (
                            <CreditCard className="w-4 h-4 text-accent shrink-0" />
                          ) : (
                            <div className="w-4 h-4 rounded bg-accent/20 text-accent flex items-center justify-center font-black text-[8px] shrink-0">
                              СБП
                            </div>
                          )}
                          <span className="text-textSecondary truncate max-w-[180px]" title={order.paymentMethodLabel}>
                            {order.paymentMethod === 'card' ? 'Банковская карта' : 'СБП'}
                          </span>
                        </div>
                      </td>

                      {/* 4. Amount */}
                      <td className="px-6 py-4 font-mono font-bold text-textPrimary text-sm">
                        {order.amount} ₽
                      </td>

                      {/* 5. Status Badge */}
                      <td className="px-6 py-4">
                        {order.status === 'completed' && (
                          <Badge variant="success" size="sm" className="gap-1.5">
                            <CheckCircle2 className="w-3 h-3" />
                            Оплачено
                          </Badge>
                        )}
                        {order.status === 'pending' && (
                          <Badge variant="warning" size="sm" className="gap-1.5 animate-pulse">
                            <Clock className="w-3 h-3" />
                            Ожидает подтверждения
                          </Badge>
                        )}
                        {order.status === 'refund_requested' && (
                          <Badge variant="warning" size="sm" className="gap-1.5">
                            <Clock className="w-3 h-3" />
                            Заявка на рассмотрении
                          </Badge>
                        )}
                        {order.status === 'refunded' && (
                          <Badge variant="danger" size="sm" className="gap-1.5">
                            <RotateCcw className="w-3 h-3" />
                            Возврат средств
                          </Badge>
                        )}
                        {order.status === 'failed' && (
                          <Badge variant="danger" size="sm" className="gap-1.5">
                            <XCircle className="w-3 h-3" />
                            Ошибка оплаты
                          </Badge>
                        )}
                        {order.refundReason && (
                          <span className="text-[10px] text-textTertiary block mt-1 max-w-[140px] truncate" title={order.refundReason}>
                            Причина: {order.refundReason}
                          </span>
                        )}
                      </td>

                      {/* 6. Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Receipt button */}
                          {(order.status === 'completed' || order.status === 'refunded' || order.status === 'refund_requested') && (
                            <button
                              type="button"
                              onClick={() => setReceiptOrder(order)}
                              className="px-2.5 py-1.5 rounded-lg bg-surface-2 hover:bg-surface-3 text-textSecondary hover:text-textPrimary font-semibold transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
                              title="Посмотреть электронный чек"
                            >
                              <Receipt className="w-3.5 h-3.5 text-accent" />
                              <span>Чек</span>
                            </button>
                          )}

                          {/* Check status for pending */}
                          {order.status === 'pending' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleConfirmPendingPayment(order.id)}
                              icon={<RefreshCw className="w-3.5 h-3.5" />}
                            >
                              Проверить статус
                            </Button>
                          )}

                          {/* Refund request button */}
                          {order.status === 'completed' && (
                            <button
                              type="button"
                              onClick={() => setRefundOrder(order)}
                              className="px-2.5 py-1.5 rounded-lg hover:bg-danger/10 text-textTertiary hover:text-danger font-semibold transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
                              title="Запросить возврат средств"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Возврат</span>
                            </button>
                          )}

                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 bg-surface-1/40 rounded-3xl border border-dashed border-borderDef/50 text-center">
          <div className="w-16 h-16 bg-surface-2 rounded-2xl flex items-center justify-center mb-4 border border-borderDef/50 shadow-sm text-textTertiary">
            <Receipt className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-textPrimary mb-2">
            История покупок пуста
          </h2>
          <p className="text-sm text-textSecondary max-w-md mb-6 leading-relaxed">
            Здесь будут отображаться все ваши платежи, фискальные чеки и история возвратов после совершения первой покупки в маркете.
          </p>
          <Button variant="primary" size="lg" onClick={() => onNavigate('/market')}>
            Перейти в каталог игр
          </Button>
        </div>
      )}

      {/* Fiscal Receipt Modal */}
      <ReceiptModal
        isOpen={Boolean(receiptOrder)}
        onClose={() => setReceiptOrder(null)}
        order={receiptOrder}
      />

      {/* Refund Request Modal */}
      <RefundRequestModal
        isOpen={Boolean(refundOrder)}
        onClose={() => setRefundOrder(null)}
        order={refundOrder}
        onSubmitRefund={handleRefundSubmit}
      />

      {/* DevMatrixPanel for QA */}
      <DevMatrixPanel
        pageName="История покупок"
        fields={[
          {
            id: 'banned',
            label: 'Бан аккаунта',
            type: 'checkbox',
            value: isBanned,
            onChange: setIsBanned,
          },
          {
            id: 'filterMode',
            label: 'Режим выборки',
            type: 'buttons',
            value: filterMode,
            onChange: (val) => setFilterMode(val),
            options: [
              { value: 'all', label: 'Все заказы' },
              { value: 'completed', label: 'Оплаченные' },
              { value: 'refunded', label: 'С возвратами' },
              { value: 'empty', label: 'Пустая история (0)' },
            ],
          },
        ]}
      />
    </div>
  );
}
