import React, { useEffect, useRef } from 'react';
import { Copy, ExternalLink, Flag, Trash2, FolderPlus, Sparkles } from 'lucide-react';

interface GameCardContextMenuProps {
  game: {
    id: string;
    slug: string;
    title: string;
    has_unread_patch?: boolean;
  };
  isOpen: boolean;
  onClose: () => void;
  onCopyLink?: () => void;
  onOpenNewTab?: () => void;
  onReport?: () => void;
  onRemoveFromLibrary?: () => void;
  showRemoveFromLibrary?: boolean;
  // Дополнительные опции для LibraryPage
  onAddToCollection?: () => void;
  onViewPatchnotes?: () => void;
  showLibraryActions?: boolean;
  triggerToast?: (message: string, type?: any) => void;
  onTransferOwnership?: () => void;
  showTransferOwnership?: boolean;
}

const GameCardContextMenu: React.FC<GameCardContextMenuProps> = ({
  game,
  isOpen,
  onClose,
  onCopyLink,
  onOpenNewTab,
  onReport,
  onRemoveFromLibrary,
  showRemoveFromLibrary = false,
  onAddToCollection,
  onViewPatchnotes,
  showLibraryActions = false,
  triggerToast,
  onTransferOwnership,
  showTransferOwnership = false
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const gameUrl = `${window.location.origin}/games/${game.slug}`;

  const handleCopyLink = () => {
    if (onCopyLink) {
      onCopyLink();
    } else {
      navigator.clipboard.writeText(gameUrl);
      if (triggerToast) {
        triggerToast('Ссылка скопирована в буфер обмена', 'success');
      }
    }
    onClose();
  };

  const handleOpenNewTab = () => {
    if (onOpenNewTab) {
      onOpenNewTab();
    } else {
      window.open(gameUrl, '_blank', 'noopener,noreferrer');
    }
    onClose();
  };

  const handleReport = () => {
    if (onReport) {
      onReport();
    }
    onClose();
  };

  const handleRemoveFromLibrary = () => {
    if (onRemoveFromLibrary) {
      onRemoveFromLibrary();
    }
    onClose();
  };

  return (
    <div 
      ref={menuRef}
      className="absolute right-0 top-full mt-1.5 w-52 bg-surface-1 border border-borderStrong rounded-card p-1.5 shadow-elevation-overlay font-sans text-xs space-y-1 animate-fadeIn"
      style={{ zIndex: 9999, pointerEvents: 'auto' }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Действия для библиотеки (если включены) */}
      {showLibraryActions && (
        <>
          {/* Добавить в коллекцию */}
          {onAddToCollection && (
            <button
              type="button"
              onClick={(e) => { 
                e.preventDefault();
                e.stopPropagation();
                onAddToCollection(); 
                onClose(); 
              }}
              className="w-full text-left px-3 py-2 rounded hover:bg-surface-3 text-textPrimary flex items-center gap-2 transition-colors cursor-pointer"
              style={{ pointerEvents: 'auto' }}
            >
              <FolderPlus className="w-3.5 h-3.5 text-textTertiary" />
              <span>Добавить в коллекцию</span>
            </button>
          )}

          {/* Патчноуты */}
          {onViewPatchnotes && (
            <button
              type="button"
              onClick={(e) => { 
                e.preventDefault();
                e.stopPropagation();
                onViewPatchnotes(); 
                onClose(); 
              }}
              className="w-full text-left px-3 py-2 rounded hover:bg-surface-3 text-textPrimary flex items-center justify-between transition-colors cursor-pointer"
              style={{ pointerEvents: 'auto' }}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-success" />
                <span>Просмотреть патчноуты</span>
              </div>
              {game.has_unread_patch && (
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              )}
            </button>
          )}

          <div className="h-px bg-borderDef my-1" />
        </>
      )}

      {/* Скопировать ссылку */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleCopyLink();
        }}
        className="w-full text-left px-3 py-2 rounded hover:bg-surface-3 text-textPrimary flex items-center gap-2 transition-colors cursor-pointer"
        style={{ pointerEvents: 'auto' }}
      >
        <Copy className="w-3.5 h-3.5 text-textTertiary" />
        <span>Скопировать ссылку</span>
      </button>

      {/* Открыть в новой вкладке */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleOpenNewTab();
        }}
        className="w-full text-left px-3 py-2 rounded hover:bg-surface-3 text-textPrimary flex items-center gap-2 transition-colors cursor-pointer"
        style={{ pointerEvents: 'auto' }}
      >
        <ExternalLink className="w-3.5 h-3.5 text-textTertiary" />
        <span>Открыть в новой вкладке</span>
      </button>

      {/* Разделитель */}
      <div className="h-px bg-borderDef my-1" />

      {/* Пожаловаться */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleReport();
        }}
        className="w-full text-left px-3 py-2 rounded hover:bg-danger/10 text-danger flex items-center gap-2 font-semibold transition-colors cursor-pointer"
        style={{ pointerEvents: 'auto' }}
      >
        <Flag className="w-3.5 h-3.5" />
        <span>Пожаловаться</span>
      </button>

      {/* Удалить из библиотеки (если применимо) */}
      {showRemoveFromLibrary && onRemoveFromLibrary && (
        <>
          <div className="h-px bg-borderDef my-1" />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleRemoveFromLibrary();
            }}
            className="w-full text-left px-3 py-2 rounded hover:bg-danger/10 text-danger flex items-center gap-2 font-semibold transition-colors cursor-pointer"
            style={{ pointerEvents: 'auto' }}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Удалить из библиотеки</span>
          </button>
        </>
      )}

      {/* Передать владение (TO-BE Stage 4) */}
      {showTransferOwnership && onTransferOwnership && (
        <>
          <div className="h-px bg-borderDef my-1" />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onTransferOwnership();
              onClose();
            }}
            className="w-full text-left px-3 py-2 rounded hover:bg-accent/10 text-accent flex items-center gap-2 font-semibold transition-colors cursor-pointer"
            style={{ pointerEvents: 'auto' }}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Передать владение</span>
          </button>
        </>
      )}
    </div>
  );
};

export default GameCardContextMenu;
