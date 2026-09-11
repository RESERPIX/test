import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { Plus, Lock, FolderPlus } from 'lucide-react';

interface Collection {
  id: string;
  title: string;
  games_count: number;
}

interface Game {
  id: string;
  title: string;
  cover_url?: string;
  cover?: string;
}

interface AddToCollectionModalProps {
  isOpen: boolean;
  game: Game | null;
  collections: Collection[];
  onClose: () => void;
  onSave: (gameId: string, collectionIds: string[]) => void;
  onCreateNew?: () => void;
  triggerToast?: (message: string, type?: any) => void;
  role?: string;
}

const AddToCollectionModal: React.FC<AddToCollectionModalProps> = ({
  isOpen,
  game,
  collections,
  onClose,
  onSave,
  onCreateNew,
  triggerToast,
  role = 'player'
}) => {
  const [selectedCollectionIds, setSelectedCollectionIds] = useState<string[]>([]);

  // Reset selections when modal opens with a new game
  useEffect(() => {
    if (isOpen && game) {
      setSelectedCollectionIds([]);
    }
  }, [isOpen, game]);

  if (!isOpen || !game) return null;

  if (role === 'guest') {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Требуется авторизация"
        icon={<Lock className="w-5 h-5 text-accent" />}
        maxWidth="sm"
      >
        <div className="flex flex-col items-center text-center gap-4 py-2">
          <p className="text-xs text-textSecondary">
            Войдите в аккаунт Hubigr, чтобы добавлять «<strong className="text-textPrimary">{game.title}</strong>» в личные коллекции.
          </p>
          <button 
            onClick={() => { window.location.href = '#/login'; }}
            className="w-full bg-accent hover:bg-accent-hover text-white font-extrabold py-2.5 rounded-control text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            Перейти к входу
          </button>
        </div>
      </Modal>
    );
  }

  const handleSave = () => {
    onSave(game.id, selectedCollectionIds);
    if (triggerToast) {
      const count = selectedCollectionIds.length;
      if (count > 0) {
        triggerToast(`Игра «${game.title}» добавлена в ${count} ${count === 1 ? 'коллекцию' : 'коллекции'}`, 'success');
      }
    }
    onClose();
  };

  const toggleCollection = (collectionId: string) => {
    setSelectedCollectionIds(prev =>
      prev.includes(collectionId)
        ? prev.filter(id => id !== collectionId)
        : [...prev, collectionId]
    );
  };

  const coverUrl = game.cover_url || game.cover;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Сохранить в коллекцию"
      icon={<FolderPlus className="w-5 h-5 text-accent" />}
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Game Preview */}
        <div className="flex items-center gap-3 bg-surface-3/80 p-3 rounded-control border border-borderDef">
          {coverUrl && (
            <img 
              src={coverUrl} 
              alt="Cover" 
              className="w-12 aspect-video object-cover rounded-md shrink-0" 
            />
          )}
          <span className="font-bold text-textPrimary text-sm truncate">
            {game.title}
          </span>
        </div>

        {/* Collections List */}
        <div className="space-y-2">
          <label className="block text-xs text-textTertiary font-mono uppercase tracking-wider">
            Выберите ваши подборки:
          </label>
          <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
            {collections.length === 0 ? (
              <div className="text-center py-6 text-textTertiary text-sm">
                У вас пока нет коллекций
              </div>
            ) : (
              collections.map(col => {
                const isChecked = selectedCollectionIds.includes(col.id);
                return (
                  <label 
                    key={col.id} 
                    className={`flex items-center justify-between p-3 rounded-control border cursor-pointer text-xs transition-all ${
                      isChecked
                        ? 'bg-accent/10 border-accent text-textPrimary'
                        : 'bg-surface-2 hover:bg-surface-3 border-borderDef text-textSecondary hover:text-textPrimary'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input 
                        type="checkbox" 
                        checked={isChecked}
                        onChange={() => toggleCollection(col.id)}
                        className="accent-accent w-4 h-4 rounded cursor-pointer" 
                      />
                      <span className="font-bold text-textPrimary">{col.title}</span>
                    </div>
                    <span className="text-[11px] font-mono text-textTertiary">
                      {col.games_count} игр
                    </span>
                  </label>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-borderDef">
          {onCreateNew && (
            <button 
              onClick={() => {
                onClose();
                onCreateNew();
              }} 
              className="text-accent text-xs font-mono font-bold flex items-center gap-1 hover:underline cursor-pointer transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Создать новую
            </button>
          )}

          <div className={`flex items-center gap-2 ${!onCreateNew ? 'ml-auto' : ''}`}>
            <button 
              onClick={onClose} 
              className="px-3 py-1.5 text-textTertiary hover:text-textPrimary font-mono text-xs cursor-pointer transition-colors"
            >
              Отмена
            </button>
            <button 
              onClick={handleSave} 
              disabled={selectedCollectionIds.length === 0}
              className={`px-4 py-2 font-extrabold font-mono text-xs rounded-control cursor-pointer transition-all ${
                selectedCollectionIds.length === 0
                  ? 'bg-surface-3 text-textDisabled cursor-not-allowed border border-borderDef'
                  : 'bg-accent hover:bg-accent-hover text-white'
              }`}
            >
              Применить
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddToCollectionModal;
