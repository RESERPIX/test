import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import Button from '../ui/Button';
import { FileText, Printer, Download, Mail, Check, ShieldCheck, QrCode } from 'lucide-react';
import { useToast } from '../ui/Toast';

export interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: {
    id: string;
    gameTitle: string;
    developer: string;
    amount: number;
    date: string;
    paymentMethodLabel: string;
    status: string;
    fiscalDocNumber?: string;
  } | null;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  const { showToast } = useToast();
  const [isEmailSent, setIsEmailSent] = useState(false);

  if (!order) return null;

  const isRefunded = order.status === 'refunded';
  const fiscalDoc = order.fiscalDocNumber || '58291';
  const fiscalSign = '3849102845';
  const kktNum = '0004928172034912';

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = () => {
    setIsEmailSent(true);
    showToast(`Электронный кассовый чек отправлен на вашу почту`, 'success');
    setTimeout(() => setIsEmailSent(false), 4000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Электронный кассовый чек"
      subtitle={`Фискальный документ №${fiscalDoc} • Заказ ${order.id}`}
      icon={<FileText className="w-5 h-5 text-accent" />}
      maxWidth="md"
    >
      <div className="flex flex-col gap-6 pt-2">
        {/* Receipt Paper Container */}
        <div className="bg-surface-0 border border-borderDef rounded-2xl p-6 font-mono text-xs shadow-inner flex flex-col gap-4 text-textSecondary relative overflow-hidden">
          {/* Top Bar Header */}
          <div className="text-center border-b border-dashed border-borderDef pb-4 space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-textPrimary font-bold text-sm tracking-wider">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span>ООО «ХАБИГР»</span>
            </div>
            <p className="text-[11px] text-textTertiary">ИНН: 7701984210 • ОГРН: 1247700192841</p>
            <p className="text-[11px] text-textTertiary">Сайт платформы: hubigr.ru</p>
            <div className="inline-block bg-surface-2 px-2 py-0.5 rounded text-[10px] text-textSecondary font-bold mt-1">
              {isRefunded ? 'КАССОВЫЙ ЧЕК / ВОЗВРАТ ПРИХОДА' : 'КАССОВЫЙ ЧЕК / ПРИХОД'}
            </div>
          </div>

          {/* Transaction Metadata */}
          <div className="space-y-1 text-[11px] border-b border-dashed border-borderDef pb-3">
            <div className="flex justify-between">
              <span className="text-textTertiary">Номер заказа:</span>
              <span className="text-textPrimary font-bold">{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-textTertiary">Дата и время:</span>
              <span className="text-textPrimary">{order.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-textTertiary">Форма оплаты:</span>
              <span className="text-textPrimary">{order.paymentMethodLabel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-textTertiary">Статус транзакции:</span>
              <span className={isRefunded ? 'text-danger font-bold' : 'text-success font-bold'}>
                {isRefunded ? 'ВОЗВРАЩЕНО' : 'УСПЕШНО ОПЛАЧЕНО'}
              </span>
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-2 border-b border-dashed border-borderDef pb-4">
            <div className="flex justify-between items-start text-xs">
              <div className="space-y-0.5 max-w-[70%]">
                <span className="text-textPrimary font-bold leading-tight block">
                  Лицензия на игру: «{order.gameTitle}»
                </span>
                <span className="text-[10px] text-textTertiary block">
                  Разработчик: {order.developer} • Бессрочный доступ
                </span>
              </div>
              <div className="text-right">
                <span className="text-textPrimary font-bold text-sm block">{order.amount} ₽</span>
                <span className="text-[10px] text-textTertiary block">1 шт × {order.amount} ₽</span>
              </div>
            </div>
            <div className="text-[10px] text-textTertiary pt-1 flex justify-between">
              <span>Ставка налога:</span>
              <span>Включая НДС 20% ({Math.round(order.amount * 20 / 120)} ₽)</span>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-baseline pt-1 text-textPrimary">
            <span className="text-xs font-bold uppercase tracking-wider">ИТОГО К ОПЛАТЕ:</span>
            <span className="text-xl font-bold font-mono">{order.amount} ₽</span>
          </div>

          {/* Fiscal Block and QR Simulation */}
          <div className="bg-surface-1/70 border border-borderDef/50 rounded-xl p-3 text-[10px] text-textTertiary space-y-1 mt-2">
            <div className="flex justify-between">
              <span>Регистрационный номер ККТ:</span>
              <span className="text-textSecondary font-mono">{kktNum}</span>
            </div>
            <div className="flex justify-between">
              <span>Номер фискального документа (ФД):</span>
              <span className="text-textSecondary font-mono">{fiscalDoc}</span>
            </div>
            <div className="flex justify-between">
              <span>Фискальный признак данных (ФП):</span>
              <span className="text-textSecondary font-mono">{fiscalSign}</span>
            </div>
            <div className="flex justify-between">
              <span>Сайт проверки чеков ФНС:</span>
              <span className="text-accent underline">nalog.gov.ru</span>
            </div>
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-borderDef/50">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSendEmail}
              icon={isEmailSent ? <Check className="w-4 h-4 text-success" /> : <Mail className="w-4 h-4" />}
            >
              {isEmailSent ? 'Отправлено!' : 'На email'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              icon={<Printer className="w-4 h-4" />}
            >
              Печать
            </Button>
          </div>

          <Button variant="primary" size="sm" onClick={onClose}>
            Закрыть
          </Button>
        </div>
      </div>
    </Modal>
  );
};
