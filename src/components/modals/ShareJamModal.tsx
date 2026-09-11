import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { Share2, Copy, Check, X } from 'lucide-react';

export interface ShareJamModalProps {
  isOpen: boolean;
  onClose: () => void;
  jamTitle: string;
  jamSlug: string;
  triggerToast?: (message: string, type?: any) => void;
}

export const ShareJamModal: React.FC<ShareJamModalProps> = ({
  isOpen,
  onClose,
  jamTitle,
  jamSlug,
  triggerToast,
}) => {
  const [shareActiveTab, setShareActiveTab] = useState<'link' | 'embed'>('link');
  const [isCopiedRecently, setIsCopiedRecently] = useState(false);

  const handleCopyLink = (text: string, successMessage: string = 'Ссылка скопирована!') => {
    navigator.clipboard.writeText(text);
    setIsCopiedRecently(true);
    if (triggerToast) {
      triggerToast(successMessage, 'success');
    }
    setTimeout(() => setIsCopiedRecently(false), 2000);
  };

  const jamUrl = `${window.location.origin}/jams/${jamSlug}`; // Assuming this is the jam url or just window.location.href if on the page. We will use window.location.href for direct replacement. Let's pass it or calculate it.
  const currentUrl = typeof window !== 'undefined' ? window.location.href : jamUrl;

  const socialLinks = [
    { name: 'Telegram', url: `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(jamTitle)}` },
    { name: 'VKontakte', url: `https://vk.com/share.php?url=${encodeURIComponent(currentUrl)}` },
    { name: 'X / Twitter', url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(jamTitle)}` },
    { name: 'Reddit', url: `https://reddit.com/submit?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(jamTitle)}` }
  ];

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Поделиться джемом"
      icon={<Share2 className="w-5 h-5 text-accent" />}
      maxWidth="lg"
    >
      <div className="space-y-5">
        {/* Вкладки: Ссылка / Код виджета */}
        <div className="flex border-b border-borderDef gap-4 font-mono text-xs -mt-2">
          <button 
            onClick={() => setShareActiveTab('link')} 
            className={`pb-2 uppercase font-bold transition-colors border-b-2 cursor-pointer ${shareActiveTab === 'link' ? 'text-accent border-accent' : 'text-textTertiary border-transparent hover:text-white'}`}
          >
            Прямая ссылка
          </button>
          <button 
            onClick={() => setShareActiveTab('embed')} 
            className={`pb-2 uppercase font-bold transition-colors border-b-2 cursor-pointer ${shareActiveTab === 'embed' ? 'text-accent border-accent' : 'text-textTertiary border-transparent hover:text-white'}`}
          >
            Код виджета / Бейдж
          </button>
        </div>

        {shareActiveTab === 'link' ? (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center gap-2 bg-surface-0 border border-borderDef p-2 rounded-xl">
              <input type="text" readOnly value={currentUrl} className="bg-transparent border-none text-xs font-mono text-textSecondary w-full outline-none px-2 select-all" />
              <button 
                onClick={() => handleCopyLink(currentUrl)} 
                className="bg-surface-2 hover:bg-surface-3 border border-borderDef text-textPrimary p-2.5 rounded-lg shrink-0 cursor-pointer min-w-[44px] min-h-11 flex items-center justify-center transition-colors" 
                title="Скопировать ссылку"
              >
                {isCopiedRecently ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono text-textTertiary uppercase font-bold">Быстрый шеринг в соцсети</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
                {socialLinks.map(net => (
                  <button 
                    key={net.name}
                    onClick={() => {
                      triggerToast?.(`Переход к шерингу в ${net.name}`, 'info');
                      window.open(net.url, '_blank');
                    }}
                    className="p-3 bg-surface-2 hover:bg-surface-3 border border-borderDef rounded-xl text-textSecondary hover:text-textPrimary flex items-center justify-center gap-1.5 cursor-pointer transition-colors font-bold"
                  >
                    {net.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono text-textTertiary uppercase font-bold">HTML iFrame Виджет</span>
              <div className="relative">
                <textarea 
                  readOnly 
                  value={`<iframe src="${window.location.origin}/embed/jams/${jamSlug}" width="380" height="200" frameborder="0"></iframe>`}
                  className="w-full bg-surface-0 border border-borderDef text-xs font-mono text-textTertiary p-3 rounded-xl h-24 resize-none outline-none focus:border-accent transition-colors"
                />
                <button 
                  onClick={() => handleCopyLink(`<iframe src="${window.location.origin}/embed/jams/${jamSlug}" width="380" height="200" frameborder="0"></iframe>`, 'HTML код виджета скопирован!')} 
                  className="absolute right-3 bottom-3 bg-surface-2 border border-borderDef text-textPrimary px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 hover:bg-surface-3 transition-colors cursor-pointer font-bold"
                >
                  <Copy className="w-3.5 h-3.5" /> Копировать
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono text-textTertiary uppercase font-bold">Markdown Бейдж для GitHub README</span>
              <div className="relative">
                <textarea 
                  readOnly 
                  value={`[![HUBIGR Jam](${window.location.origin}/badges/jam-${jamSlug}.svg)](${currentUrl})`}
                  className="w-full bg-surface-0 border border-borderDef text-xs font-mono text-textTertiary p-3 rounded-xl h-24 resize-none outline-none focus:border-accent transition-colors"
                />
                <button 
                  onClick={() => handleCopyLink(`[![HUBIGR Jam](${window.location.origin}/badges/jam-${jamSlug}.svg)](${currentUrl})`, 'Markdown код бейджа скопирован!')} 
                  className="absolute right-3 bottom-3 bg-surface-2 border border-borderDef text-textPrimary px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 hover:bg-surface-3 transition-colors cursor-pointer font-bold"
                >
                  <Copy className="w-3.5 h-3.5" /> Копировать
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ShareJamModal;
