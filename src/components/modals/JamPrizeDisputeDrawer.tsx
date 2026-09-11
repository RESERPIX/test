import React, { useState, useEffect } from 'react';
import Drawer from '../ui/Drawer';
import { FileText, Send, AlertTriangle, MessageSquare, Image as ImageIcon, X } from 'lucide-react';

interface JamPrizeDisputeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  jamId: string;
  gameId: string;
  triggerToast: (msg: string, type: 'success' | 'danger' | 'info') => void;
  prizeAmount?: string;
  provider?: string;
}

export default function JamPrizeDisputeDrawer({ isOpen, onClose, jamId, gameId, triggerToast, prizeAmount = "100,000 RUB", provider = "IndieFund" }: JamPrizeDisputeDrawerProps) {
  const [disputeText, setDisputeText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>('');
  
  const draftKey = `hubigr_dispute_draft_${jamId}_${gameId}`;

  // Load draft on mount
  useEffect(() => {
    if (isOpen) {
      const draft = localStorage.getItem(draftKey);
      if (draft) {
        setDisputeText(draft);
      }
    }
  }, [isOpen, draftKey]);

  // Autosave
  useEffect(() => {
    if (!isOpen) return;

    setSaveStatus('saving');
    const timer = setTimeout(() => {
      localStorage.setItem(draftKey, disputeText);
      const now = new Date();
      setSaveStatus(`✅ Сохранено в ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearTimeout(timer);
  }, [disputeText, isOpen, draftKey]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disputeText.trim().length < 20) {
      triggerToast('Опишите ситуацию подробнее (минимум 20 символов)', 'danger');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      localStorage.removeItem(draftKey);
      setDisputeText('');
      triggerToast('Претензия по призу успешно отправлена! Администрация рассмотрит ее в ближайшее время.', 'success');
      onClose();
    }, 1200);
  };

  return (
    <Drawer 
      isOpen={isOpen} 
      onClose={onClose}
      title="Неполучение приза"
      subtitle="Dispute / Investigation"
      icon={<AlertTriangle className="w-5 h-5 text-danger" />}
    >
      <div className="flex flex-col h-full bg-surface-0 w-full max-w-[480px]">
        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 no-scrollbar relative">
          <div className="mb-6 p-4 rounded-xl bg-surface-2 border border-borderDef flex flex-col gap-2 shadow-inner">
            <span className="text-xs font-bold text-accent uppercase font-mono tracking-wider">Информация о призе</span>
            <div className="flex justify-between items-center text-sm">
              <span className="text-textSecondary">Заявлен приз:</span>
              <span className="font-bold font-mono">{prizeAmount}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-textSecondary">Спонсор / Провайдер:</span>
              <span className="font-bold text-textPrimary">{provider}</span>
            </div>
          </div>

          <div className="mb-6 bg-warning/10 border border-warning/30 rounded-xl p-4 flex items-start gap-3 shadow-sm">
            <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <span className="text-xs text-textSecondary leading-relaxed">
              Жалоба на невыплату приза ведет к <strong>административному расследованию</strong>. 
              В случае подтверждения нарушения, организатор/спонсор может лишиться статуса Verified и получить системные ограничения на платформе.
            </span>
          </div>

          <form id="disputeForm" onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="disputeText" className="text-sm font-bold flex items-center justify-between uppercase tracking-wider font-mono">
                <span>Детали ситуации</span>
                {saveStatus && (
                  <span className="text-[10px] font-normal text-success">{saveStatus}</span>
                )}
              </label>
              <textarea
                id="disputeText"
                value={disputeText}
                onChange={(e) => setDisputeText(e.target.value)}
                placeholder="Например: Спонсор не отвечает на сообщения уже 2 недели, хотя запрашивал реквизиты..."
                className="w-full h-40 bg-surface-2 border border-borderDef focus:border-accent text-sm text-textPrimary p-4 rounded-xl outline-none resize-none shadow-inner transition-colors placeholder-textTertiary"
                required
              />
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <span className="text-sm font-bold uppercase tracking-wider font-mono">Приложить доказательства (Скриншоты)</span>
              <button 
                type="button"
                className="w-full h-12 border border-dashed border-borderDef hover:border-accent bg-surface-1 hover:bg-surface-2 text-textSecondary hover:text-accent rounded-xl flex items-center justify-center gap-2 transition-colors font-semibold text-sm cursor-pointer"
              >
                <ImageIcon className="w-4 h-4" />
                Прикрепить файлы
              </button>
            </div>
          </form>
        </div>

        {/* FOOTER */}
        <div className="p-5 md:p-6 border-t border-borderDef bg-surface-1 sticky bottom-0 z-10 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-12 bg-surface-2 hover:bg-surface-3 border border-borderDef text-textPrimary rounded-xl font-bold uppercase tracking-wider text-sm transition-all active:scale-95 touch-manipulation"
          >
            Отмена
          </button>
          <button
            type="submit"
            form="disputeForm"
            disabled={isSubmitting || disputeText.length < 20}
            className={`flex-[2] h-12 rounded-xl font-bold uppercase tracking-wider text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 touch-manipulation shadow-md
              ${isSubmitting || disputeText.length < 20
                ? 'bg-danger/50 text-white/50 cursor-not-allowed'
                : 'bg-danger hover:bg-danger/90 text-white cursor-pointer'
              }`}
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Отправить жалобу</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Drawer>
  );
}
