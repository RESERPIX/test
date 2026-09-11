import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import Button from '../ui/Button';
import { 
  ShieldCheck, 
  ShieldAlert, 
  ExternalLink, 
  AlertTriangle, 
  Copy, 
  Check, 
  Lock, 
  Globe 
} from 'lucide-react';

export interface AntiPhishingModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUrl: string;
  platformName?: string;
  onProceed?: () => void;
}

// Список доверенных краудфандинговых и платежных платформ
const TRUSTED_DOMAINS = [
  'boosty.to',
  'donationalerts.com',
  'cloudtips.ru',
  'pay.cloudtips.ru',
  'patreon.com',
  'vk.com',
  'vk.ru',
  'yoomoney.ru',
  'tinkoff.ru',
  'tbank.ru',
  'sberbank.ru',
  'github.com',
  'artstation.com'
];

export const AntiPhishingModal: React.FC<AntiPhishingModalProps> = ({
  isOpen,
  onClose,
  targetUrl,
  platformName,
  onProceed,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  if (!targetUrl) return null;

  let hostname = '';
  try {
    const parsed = new URL(targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`);
    hostname = parsed.hostname;
  } catch {
    hostname = targetUrl;
  }

  const isTrustedPlatform = TRUSTED_DOMAINS.some(domain => 
    hostname === domain || hostname.endsWith(`.${domain}`)
  );

  const handleCopyUrl = () => {
    try {
      navigator.clipboard.writeText(targetUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleProceed = () => {
    onClose();
    if (onProceed) {
      onProceed();
    } else {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Переход на внешний сервис"
      subtitle="Проверка безопасности и защита от фишинга"
      icon={isTrustedPlatform ? <ShieldCheck className="w-5 h-5 text-success" /> : <ShieldAlert className="w-5 h-5 text-warning" />}
      maxWidth="md"
    >
      <div className="flex flex-col gap-5 select-none">
        
        {/* Статус доверия сервиса */}
        {isTrustedPlatform ? (
          <div className="p-4 rounded-xl bg-success/10 border border-success/30 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center text-success shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-body-sm font-bold text-success flex items-center gap-2">
                <span>Проверенный сервис поддержки</span>
                {platformName && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-success/20 text-success">
                    {platformName}
                  </span>
                )}
              </div>
              <p className="text-caption text-textSecondary mt-1 leading-normal">
                Домен <strong className="text-textPrimary font-mono">{hostname}</strong> входит в реестр верифицированных краудфандинговых платформ.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-warning/10 border border-warning/30 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-warning/20 flex items-center justify-center text-warning shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-body-sm font-bold text-warning flex items-center gap-2">
                <span>Сторонний внешний ресурс</span>
              </div>
              <p className="text-caption text-textSecondary mt-1 leading-normal">
                Ресурс <strong className="text-textPrimary font-mono">{hostname}</strong> размещен сторонним автором и не модерируется платформой напрямую.
              </p>
            </div>
          </div>
        )}

        {/* Карточка целевого адреса */}
        <div className="flex flex-col gap-2">
          <label className="text-caption font-semibold text-textSecondary uppercase tracking-wider">
            Целевой адрес ссылки
          </label>
          <div className="p-3 bg-surface-2 border border-borderDef rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <Globe className="w-4 h-4 text-textTertiary shrink-0" />
              <span className="text-caption font-mono text-textPrimary truncate" title={targetUrl}>
                {targetUrl}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyUrl}
              className="p-1.5 rounded-lg bg-surface-3 hover:bg-surface-4 text-textTertiary hover:text-textPrimary transition-colors shrink-0 cursor-pointer"
              title="Скопировать ссылку"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Памятка безопасности */}
        <div className="p-4 rounded-xl bg-surface-2/60 border border-borderDef/60 flex flex-col gap-2.5">
          <div className="text-caption font-bold text-textPrimary uppercase tracking-wider flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-accent" />
            <span>Правила безопасности HUBIGR</span>
          </div>
          <ul className="space-y-2 text-caption text-textSecondary font-sans">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
              <span>
                <strong>Никогда не вводите пароль от HUBIGR</strong> или коды двухфакторной аутентификации (2FA) на внешних сайтах.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
              <span>
                Все операции по донатам осуществляются на стороне выбранного внешнего сервиса по его правилам.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
              <span>
                Перед проведением транзакции убедитесь, что в адресной строке браузера указан защищенный протокол <strong className="font-mono text-textPrimary">https://</strong>.
              </span>
            </li>
          </ul>
        </div>

        {/* Действия */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2 border-t border-borderDef/40">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Остаться на HUBIGR
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleProceed}
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <span>Перейти на сайт</span>
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>

      </div>
    </Modal>
  );
};

export default AntiPhishingModal;
