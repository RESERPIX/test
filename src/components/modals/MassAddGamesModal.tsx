import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { Search, Layers } from 'lucide-react';

export interface MassAddGamesModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: any | null; // using any to match existing props
  games: any[]; // library games
  onSave: (selectedGameIds: string[]) => void;
}

export const MassAddGamesModal: React.FC<MassAddGamesModalProps> = ({
  isOpen,
  onClose,
  collection,
  games,
  onSave,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGameIds, setSelectedGameIds] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen && collection) {
      setSelectedGameIds(collection.games || []);
      setSearchQuery('');
    }
  }, [isOpen, collection]);

  const filteredGames = games.filter(g => {
    if (!searchQuery.trim()) return true;
    return g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           g.author.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSave = () => {
    onSave(selectedGameIds);
    onClose();
  };

  if (!isOpen || !collection) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Добавить игры в подборку"
      icon={<Layers className="w-5 h-5 text-accent" />}
      maxWidth="md"
    >
      <div className="space-y-5">
        <p className="text-xs text-textSecondary -mt-2">Коллекция: <strong className="text-textPrimary">{collection.title}</strong></p>
        
        <div className="relative flex items-center">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
            <Search className="w-4 h-4 text-textTertiary" />
          </div>
          <input 
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Поиск по играм из вашей библиотеки..."
            className="w-full bg-surface-3 border border-borderDef focus:border-accent text-textPrimary placeholder:text-textDisabled pl-9 pr-8 py-2.5 rounded-control text-sm outline-none transition-colors"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-textTertiary hover:text-textPrimary p-1">
              <span className="sr-only">Очистить</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          )}
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {filteredGames.length === 0 ? (
            <div className="text-center py-6 text-textTertiary text-xs">
              Ничего не найдено
            </div>
          ) : (
            filteredGames.map(game => {
              const isChecked = selectedGameIds.includes(game.id);
              return (
                <label key={game.id} className={`flex items-center justify-between p-3 rounded-control border cursor-pointer transition-colors text-xs ${isChecked ? 'bg-surface-3 border-accent/50' : 'bg-surface-1 border-borderDef hover:bg-surface-3'}`}>
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={isChecked}
                      onChange={() => {
                        if (isChecked) {
                          setSelectedGameIds(prev => prev.filter(id => id !== game.id));
                        } else {
                          setSelectedGameIds(prev => [...prev, game.id]);
                        }
                      }}
                      className="accent-accent w-4 h-4" 
                    />
                    <img src={game.cover_url || ''} alt={game.title} className="w-12 aspect-video object-cover rounded border border-borderDef" />
                    <div className="flex flex-col">
                      <span className="font-bold text-textPrimary">{game.title}</span>
                      <span className="text-caption text-textTertiary">{game.author?.name}</span>
                    </div>
                  </div>
                </label>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-borderDef">
          <span className="text-xs font-mono text-textTertiary">Выбрано: {selectedGameIds.length}</span>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-4 py-2 text-textTertiary hover:text-textPrimary text-sm font-semibold cursor-pointer">
              Отмена
            </button>
            <button onClick={handleSave} className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-white font-bold text-sm rounded-control cursor-pointer transition-colors">
              Сохранить состав
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default MassAddGamesModal;
