import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import Button from '../ui/Button';
import { AlertTriangle, Info, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useToast } from '../ui/Toast';

export interface RefundRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: {
    id: string;
    gameTitle: string;
    amount: number;
    date: string;
    paymentMethodLabel: string;
  } | null;
  onSubmitRefund: (orderId: string, reason: string, comment: string) => void;
}

const REFUND_REASONS = [
  { id: 'tech_issues', label: 'Технические проблемы / не запускается на моей системе' },
  { id: 'accidental', label: 'Куплено по ошибке' },
  { id: 'misleading', label: 'Игра существенно отличается от описания или скриншотов' },
  { id: 'hardware_mismatch', label: 'Не подошли системные требования' },
  { id: 'other', label: 'Другая причина' },
];

export const RefundRequestModal: React.FC<RefundRequestModalProps> = ({
  isOpen,
  onClose,
  order,
  onSubmitRefund,
}) => {
  const { showToast } = useToast();
  const [selectedReason, setSelectedReason] = useState(REFUND_REASONS[0].id);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!order) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() && selectedReason === 'other') {
      showToast('Пожалуйста, укажите подробности в комментарии', 'warning');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsDone(true);
      const reasonObj = REFUND_REASONS.find(r => r.id === selectedReason);
      onSubmitRefund(order.id, reasonObj ? reasonObj.label : selectedReason, comment);
      showToast('Заявка на возврат успешно отправлена в службу поддержки', 'success');
    }, 600);
  };

  const handleClose = () => {
    setIsDone(false);
    setComment('');
    setSelectedReason(REFUND_REASONS[0].id);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Запрос на возврат средств"
      subtitle={`Заказ ${order.id} • «${order.gameTitle}» (${order.amount} ₽)`}
      icon={<AlertTriangle className="w-5 h-5 text-warning" />}
      maxWidth="md"
    >
      {isDone ? (
        <div className="flex flex-col items-center text-center py-6 gap-4">
          <div className="w-14 h-14 rounded-full bg-success/10 text-success flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-textPrimary">Заявка принята на рассмотрение</h3>
            <p className="text-xs text-textSecondary max-w-sm mx-auto leading-relaxed">
              Служба поддержки рассмотрит обращение вручную (SC-MKT-042). Статус заказа в вашей истории покупок обновлен на «Заявка на рассмотрении».
            </p>
          </div>
          <div className="w-full bg-surface-2/60 border border-borderDef/50 rounded-xl p-3.5 text-left text-xs space-y-1.5 font-mono">
            <div className="flex justify-between">
              <span className="text-textTertiary">Номер заказа:</span>
              <span className="text-textPrimary font-bold">{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-textTertiary">Сумма возврата:</span>
              <span className="text-success font-bold">{order.amount} ₽</span>
            </div>
            <div className="flex justify-between">
              <span className="text-textTertiary">Способ выплаты:</span>
              <span className="text-textPrimary">{order.paymentMethodLabel}</span>
            </div>
          </div>
          <Button variant="primary" size="md" fullWidth onClick={handleClose}>
            Понятно
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-2">
          {/* Policy Info Notice */}
          <div className="bg-surface-2/70 border border-borderDef/60 rounded-xl p-3.5 flex items-start gap-3">
            <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <div className="text-xs text-textSecondary leading-relaxed space-y-1">
              <p>
                <strong className="text-textPrimary">Правила возврата:</strong> Заявки на возврат цифрового контента рассматриваются вручную.
              </p>
              <p>
                После утверждения возврата лицензия на запуск и скачивание игры будет аннулирована, а денежные средства возвращены на <span className="text-textPrimary font-medium">{order.paymentMethodLabel}</span>.
              </p>
            </div>
          </div>

          {/* Reason Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-textTertiary">
              Причина запроса возврата <span className="text-danger">*</span>
            </label>
            <div className="space-y-2">
              {REFUND_REASONS.map(reason => (
                <label
                  key={reason.id}
                  className={`flex items-start gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors text-xs ${
                    selectedReason === reason.id
                      ? 'border-accent bg-accent/5 text-textPrimary font-semibold'
                      : 'border-borderDef/50 hover:bg-surface-2 text-textSecondary'
                  }`}
                >
                  <input
                    type="radio"
                    name="refund_reason"
                    value={reason.id}
                    checked={selectedReason === reason.id}
                    onChange={() => setSelectedReason(reason.id)}
                    className="mt-0.5 accent-accent"
                  />
                  <span>{reason.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Detailed comment */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-textTertiary flex justify-between">
              <span>Комментарий для поддержки</span>
              <span className="text-[10px] text-textTertiary font-normal font-mono">{comment.length}/500</span>
            </label>
            <textarea
              rows={3}
              maxLength={500}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Опишите, что пошло не так (конфигурация системы, возникшие ошибки)..."
              className="w-full bg-surface-2 border border-borderDef rounded-xl p-3 text-xs text-textPrimary placeholder:text-textTertiary focus:border-accent focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-borderDef/50">
            <Button variant="ghost" size="md" type="button" onClick={handleClose} disabled={isSubmitting}>
              Отмена
            </Button>
            <Button
              variant="primary"
              size="md"
              type="submit"
              isLoading={isSubmitting}
            >
              Отправить заявку
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
