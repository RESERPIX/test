import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { Share2, Copy, Check } from 'lucide-react';

export interface ShareProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileName: string;
  profileHandle: string;
  triggerToast?: (message: string, type?: any) => void;
}

export const ShareProfileModal: React.FC<ShareProfileModalProps> = ({
  isOpen,
  onClose,
  profileName,
  profileHandle,
  triggerToast,
}) => {
  const [isCopiedRecently, setIsCopiedRecently] = useState(false);
  const profileUrl = `${window.location.origin}/u/${profileHandle.replace('@', '')}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    setIsCopiedRecently(true);
    triggerToast?.('Ссылка на профиль скопирована!', 'success');
    setTimeout(() => setIsCopiedRecently(false), 2000);
  };

  const socialLinks = [
    { name: 'Telegram', url: `https://t.me/share/url?url=${encodeURIComponent(profileUrl)}&text=${encodeURIComponent(`Профиль ${profileName} на HUBIGR`)}` },
    { name: 'VK', url: `https://vk.com/share.php?url=${encodeURIComponent(profileUrl)}` },
    { name: 'X', url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(profileUrl)}&text=${encodeURIComponent(`Профиль ${profileName} на HUBIGR`)}` },
    { name: 'Reddit', url: `https://reddit.com/submit?url=${encodeURIComponent(profileUrl)}&title=${encodeURIComponent(`Профиль ${profileName} на HUBIGR`)}` }
  ];

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Поделиться профилем"
      icon={<Share2 className="w-5 h-5 text-accent" />}
      maxWidth="sm"
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono text-textTertiary uppercase font-bold">Прямая ссылка</label>
          <div className="flex items-center gap-2 bg-surface-0 border border-borderDef p-2 rounded-xl">
            <input 
              type="text" 
              readOnly 
              value={profileUrl} 
              className="bg-transparent border-none text-xs font-mono text-textSecondary w-full outline-none px-2 select-all"
            />
            <button 
              onClick={handleCopyLink} 
              className="bg-surface-2 hover:bg-surface-3 border border-borderDef text-textPrimary hover:text-accent p-2 rounded-lg shrink-0 transition-colors cursor-pointer" 
              title="Скопировать ссылку"
            >
              {isCopiedRecently ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono text-textTertiary uppercase font-bold">Поделиться в соцсетях</label>
          <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
            {socialLinks.map(net => (
              <a 
                key={net.name}
                href={net.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  triggerToast?.(`Переход к шерингу в ${net.name}`, 'info');
                }}
                className="p-3 bg-surface-2 hover:bg-surface-3 border border-borderDef hover:border-accent/40 rounded-xl text-textSecondary hover:text-textPrimary transition-colors flex items-center justify-center font-bold"
              >
                {net.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ShareProfileModal;
