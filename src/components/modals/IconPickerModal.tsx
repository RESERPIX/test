import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { Sparkles, Search } from 'lucide-react';
import { BADGE_ICON_MAP } from '../ProfileBadges';

export interface IconPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentIcon: string;
  onSelect: (iconKey: string) => void;
  iconMap: Record<string, React.ElementType>;
}

export const IconPickerModal: React.FC<IconPickerModalProps> = ({
  isOpen,
  onClose,
  currentIcon,
  onSelect,
  iconMap
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredIcons = Object.entries(iconMap).filter(([key]) =>
    key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Выберите иконку"
      icon={<Sparkles className="w-5 h-5 text-accent" />}
      maxWidth="lg"
    >
      <div className="flex flex-col h-full max-h-[60vh]">
        <div className="relative mb-5 shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-textTertiary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск иконки..."
            className="w-full h-11 bg-surface-2 border border-borderDef rounded-control pl-10 pr-4 text-sm text-textPrimary placeholder:text-textTertiary focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
            autoFocus
          />
        </div>

        <div className="flex-1 overflow-y-auto pr-2 no-scrollbar">
          {filteredIcons.length > 0 ? (
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 pb-4">
              {filteredIcons.map(([iconKey, IconComponent]) => {
                const isSelected = currentIcon === iconKey;
                return (
                  <button
                    key={iconKey}
                    onClick={() => {
                      onSelect(iconKey);
                      onClose();
                    }}
                    className={`aspect-square flex items-center justify-center rounded-lg border-2 transition-all group ${
                      isSelected
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-borderDef bg-surface-2 text-textTertiary hover:border-accent/50 hover:bg-surface-3 hover:text-textPrimary'
                    }`}
                    title={iconKey}
                  >
                    <IconComponent className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 flex flex-col items-center">
              <Search className="w-12 h-12 mb-3 text-textTertiary opacity-30" />
              <p className="text-sm font-bold text-textSecondary">Иконки не найдены</p>
              <p className="text-xs text-textTertiary mt-1">Попробуйте другой запрос</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default IconPickerModal;
