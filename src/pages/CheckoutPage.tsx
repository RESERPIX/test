import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, Zap, Monitor, Apple, Terminal, ArrowRight, Check, Loader2,
  CheckCircle2, AlertCircle, RefreshCw, Play, CreditCard, Receipt
} from 'lucide-react';
import Button from '../components/ui/Button';
import { GameCover } from '../components/ui/GameCover';
import DevMatrixPanel from '../components/DevMatrixPanel';

type CheckoutState = 'init' | 'pending' | 'success' | 'failed' | 'cancelled';
type PaymentMethod = 'card' | 'sbp';

export default function CheckoutPage({ 
  alreadyOwned = false,
  onClose = () => console.log('Close Checkout'),
  onGoToLibrary = () => console.log('Go to Library'),
  onGoToGame = () => console.log('Go to Game Page'),
  onGoToPurchases = () => {
    if ((window as any).__hubigrNavigate) {
      (window as any).__hubigrNavigate('/purchases');
    }
  }
}: { 
  alreadyOwned?: boolean;
  onClose?: () => void;
  onGoToLibrary?: () => void;
  onGoToGame?: () => void;
  onGoToPurchases?: () => void;
}) {
  const [checkoutState, setCheckoutState] = useState<CheckoutState>('init');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');

  const game = {
    title: 'Cyber Quest: Neon Awakening',
    developer: '@cyber_studio',
    coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
    platforms: ['web', 'win', 'mac', 'lin'],
    basePrice: 500,
    discountPercent: 30,
    discountAmount: 150,
    totalPrice: 350
  };

  const handlePay = () => {
    setCheckoutState('pending');
    setTimeout(() => {
      const isSuccess = Math.random() > 0.2;
      setCheckoutState(isSuccess ? 'success' : 'failed');
    }, 3000);
  };

  useEffect(() => {
    const orig = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = orig;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (alreadyOwned) {
    return createPortal(
      <div className="fixed inset-0 z-50 bg-surface-0 flex items-center justify-center p-4">
        <div className="bg-surface-1 border border-borderDef rounded-2xl p-8 max-w-md w-full flex flex-col items-center text-center shadow-elevation-raised">
          <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-textPrimary mb-3">Вы уже владеете этой игрой</h2>
          <p className="text-sm text-textSecondary mb-8 leading-relaxed">
            Эта игра уже добавлена в вашу библиотеку, и у вас есть полный доступ ко всем платформам и обновлениям.
          </p>
          <div className="flex flex-col gap-3 w-full">
            <Button variant="primary" size="lg" fullWidth onClick={onGoToLibrary}>
              Перейти в Библиотеку
            </Button>
            <Button variant="ghost" size="lg" fullWidth onClick={onGoToGame}>
              Вернуться на страницу игры
            </Button>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  const renderPlatformIcon = (p: string) => {
    switch (p) {
      case 'web': return <Zap className="w-4 h-4" />;
      case 'win': return <Monitor className="w-4 h-4" />;
      case 'mac': return <Apple className="w-4 h-4" />;
      case 'lin': return <Terminal className="w-4 h-4" />;
      default: return null;
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 bg-surface-0 flex flex-col overflow-y-auto font-sans">
      <header className="flex items-center justify-between px-6 py-4 border-b border-borderDef/50 bg-surface-1/50 sticky top-0 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shadow-lg shadow-accent/20">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="font-black tracking-tight text-lg">
            ХАБИГР <span className="text-textTertiary font-medium">| Безопасная оплата</span>
          </span>
        </div>
        <button 
          onClick={() => { setCheckoutState('cancelled'); setTimeout(onClose, 500); }}
          className="flex items-center gap-2 text-sm font-semibold text-textSecondary hover:text-textPrimary transition-colors bg-surface-2 hover:bg-surface-3 px-3 py-1.5 rounded-full"
        >
          <X className="w-4 h-4" />
          Закрыть
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        {checkoutState === 'init' && (
          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-bold text-textPrimary tracking-tight">Сводка заказа</h2>
              <div className="bg-surface-1 rounded-3xl p-2 flex flex-col gap-5 border border-borderDef/50 shadow-sm">
                <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden relative">
                  <GameCover src={game.coverUrl} title={game.title} className="w-full h-full" imageClassName="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white leading-tight drop-shadow-md mb-1">{game.title}</h3>
                    <span className="text-sm font-medium text-white/80">{game.developer}</span>
                  </div>
                </div>
                <div className="px-5 pb-5 flex flex-col gap-5">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-textTertiary font-medium w-24">Доступно для:</span>
                    <div className="flex items-center gap-2">
                      {game.platforms.map(p => (
                        <div key={p} className="flex items-center gap-1.5 bg-surface-2 px-2.5 py-1 rounded-md text-xs font-semibold text-textSecondary uppercase tracking-wider border border-borderDef/50">
                          {renderPlatformIcon(p)}
                          {p}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="h-px w-full bg-borderDef/50" />
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-textSecondary">Базовая цена:</span>
                      <span className="font-mono text-textPrimary">{game.basePrice} ₽</span>
                    </div>
                    {game.discountAmount > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-success font-medium">Скидка (-{game.discountPercent}%):</span>
                        <span className="font-mono text-success">-{game.discountAmount} ₽</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center mt-2 pt-4 border-t border-dashed border-borderDef">
                      <span className="text-base font-bold text-textPrimary">ИТОГО К ОПЛАТЕ:</span>
                      <span className="text-2xl font-black font-mono text-textPrimary">{game.totalPrice} ₽</span>
                    </div>
                  </div>
                  <div className="bg-surface-2/50 rounded-xl p-4 flex flex-col gap-3 border border-borderDef/30 mt-2">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-accent/20 text-accent flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className="text-sm font-medium text-textSecondary leading-snug">Бессрочный доступ ко всем платформам</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-accent/20 text-accent flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className="text-sm font-medium text-textSecondary leading-snug">Все будущие одобренные обновления</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-bold text-textPrimary tracking-tight">Оплата</h2>
              <div className="bg-surface-1 rounded-3xl p-6 md:p-8 flex flex-col gap-8 border border-borderDef/50 shadow-sm">
                <div className="flex flex-col items-center justify-center py-6 bg-surface-2/50 rounded-2xl border border-borderDef/50">
                  <span className="text-sm text-textTertiary font-medium mb-1">Сумма к оплате</span>
                  <span className="text-4xl font-black font-mono text-textPrimary tracking-tight">{game.totalPrice} ₽</span>
                </div>
                <div className="flex flex-col gap-3">
                  <span className="text-sm font-bold text-textSecondary mb-1">Способ оплаты</span>
                  
                  <label className={`relative flex items-center gap-4 p-4 rounded-xl cursor-pointer border-2 transition-all ${paymentMethod === 'card' ? 'border-accent bg-accent/5' : 'border-borderDef/50 bg-surface-0 hover:border-borderStrong'}`}>
                    <input type="radio" name="payment_method" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="hidden" />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentMethod === 'card' ? 'border-accent' : 'border-borderDef'}`}>
                      {paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-accent" />}
                    </div>
                    <CreditCard className={`w-6 h-6 ${paymentMethod === 'card' ? 'text-accent' : 'text-textTertiary'}`} />
                    <span className={`font-semibold ${paymentMethod === 'card' ? 'text-textPrimary' : 'text-textSecondary'}`}>Банковская карта (РФ)</span>
                  </label>

                  <label className={`relative flex items-center gap-4 p-4 rounded-xl cursor-pointer border-2 transition-all ${paymentMethod === 'sbp' ? 'border-accent bg-accent/5' : 'border-borderDef/50 bg-surface-0 hover:border-borderStrong'}`}>
                    <input type="radio" name="payment_method" value="sbp" checked={paymentMethod === 'sbp'} onChange={() => setPaymentMethod('sbp')} className="hidden" />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentMethod === 'sbp' ? 'border-accent' : 'border-borderDef'}`}>
                      {paymentMethod === 'sbp' && <div className="w-2.5 h-2.5 rounded-full bg-accent" />}
                    </div>
                    <div className={`w-6 h-6 flex items-center justify-center rounded ${paymentMethod === 'sbp' ? 'bg-accent text-white' : 'bg-surface-3 text-textTertiary'}`}>
                      <span className="font-black text-[10px]">СБП</span>
                    </div>
                    <span className={`font-semibold ${paymentMethod === 'sbp' ? 'text-textPrimary' : 'text-textSecondary'}`}>СБП (Система быстрых платежей)</span>
                  </label>
                </div>
                <div className="bg-surface-2 rounded-xl p-4 text-xs text-textTertiary leading-relaxed space-y-2 border border-borderDef/30">
                  <p><strong className="text-textSecondary">Продавцом выступает ООО «Хабигр».</strong></p>
                  <p>Нажимая кнопку оплаты, вы соглашаетесь с условиями предоставления сервиса. Электронный кассовый чек будет отправлен на <span className="text-textPrimary font-medium">user@email.com</span>.</p>
                </div>
                <button onClick={handlePay} className="w-full h-14 bg-accent hover:bg-accent-hover text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-accent/20">
                  Перейти к оплате {game.totalPrice} ₽
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {checkoutState === 'pending' && (
          <div className="bg-surface-1 border border-borderDef rounded-3xl p-10 max-w-md w-full flex flex-col items-center text-center shadow-elevation-raised">
            <Loader2 className="w-14 h-14 animate-spin text-accent mb-6" />
            <h2 className="text-2xl font-bold text-textPrimary mb-3 tracking-tight">Ожидает подтверждения</h2>
            <p className="text-base text-textSecondary leading-relaxed max-w-[280px]">
              Мы проверяем статус платежа от платёжной системы. Это может занять от нескольких секунд до пары минут. Пожалуйста, не закрывайте страницу.
            </p>
          </div>
        )}

        {checkoutState === 'success' && (
          <div className="bg-surface-1 border border-borderDef rounded-3xl p-10 max-w-md w-full flex flex-col items-center text-center shadow-elevation-raised">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 ring-8 ring-emerald-500/5">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-textPrimary mb-3 tracking-tight">Оплата прошла успешно!</h2>
            <p className="text-base text-textSecondary leading-relaxed mb-8">
              Игра <strong className="text-textPrimary font-semibold">«{game.title}»</strong> навсегда добавлена в вашу Библиотеку. Электронный чек отправлен на вашу почту.
            </p>
            <div className="flex flex-col gap-3 w-full">
              <Button variant="primary" size="xl" fullWidth onClick={onGoToLibrary} icon={<Play className="w-5 h-5 fill-current" />}>
                Перейти в Библиотеку и играть
              </Button>
              <Button variant="outline" size="lg" fullWidth onClick={onGoToPurchases} icon={<Receipt className="w-5 h-5" />}>
                Посмотреть в истории покупок
              </Button>
              <Button variant="ghost" size="lg" fullWidth onClick={onGoToGame}>
                Вернуться на страницу игры
              </Button>
            </div>
          </div>
        )}

        {checkoutState === 'failed' && (
          <div className="bg-surface-1 border border-danger/20 rounded-3xl p-10 max-w-md w-full flex flex-col items-center text-center shadow-elevation-raised">
            <div className="w-20 h-20 bg-danger/10 rounded-full flex items-center justify-center mb-6 ring-8 ring-danger/5">
              <AlertCircle className="w-10 h-10 text-danger" />
            </div>
            <h2 className="text-2xl font-bold text-textPrimary mb-3 tracking-tight">Платёж не прошёл</h2>
            <p className="text-base text-textSecondary leading-relaxed mb-8">
              Не удалось завершить транзакцию. Средства с вашего счёта не были списаны. Попробуйте использовать другую карту или повторить попытку позже.
            </p>
            <div className="flex flex-col gap-3 w-full">
              <Button variant="primary" size="lg" fullWidth onClick={() => setCheckoutState('init')} icon={<RefreshCw className="w-5 h-5" />}>
                Повторить оплату
              </Button>
              <Button variant="ghost" size="lg" fullWidth onClick={() => { setCheckoutState('cancelled'); setTimeout(onClose, 500); }}>
                Отменить и вернуться к игре
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* DevMatrixPanel for QA state toggling */}
      <DevMatrixPanel
        pageName="Оформление заказа"
        fields={[
          {
            id: 'checkoutState',
            label: 'Статус чекаута',
            type: 'buttons',
            value: checkoutState,
            onChange: (val) => setCheckoutState(val as CheckoutState),
            options: [
              { value: 'init', label: 'Оплата' },
              { value: 'pending', label: 'Pending' },
              { value: 'success', label: 'Успех' },
              { value: 'failed', label: 'Ошибка' },
            ],
          },
          {
            id: 'paymentMethod',
            label: 'Способ оплаты',
            type: 'buttons',
            value: paymentMethod,
            onChange: (val) => setPaymentMethod(val as PaymentMethod),
            options: [
              { value: 'card', label: 'Карта' },
              { value: 'sbp', label: 'СБП' },
            ],
          },
        ]}
      />
    </div>,
    document.body
  );
}
