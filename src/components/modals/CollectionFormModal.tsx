import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { Layers, CheckCircle2 } from 'lucide-react';
import Switch from '../ui/Switch';

export interface CollectionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (collectionData: any) => void;
  initialData?: any | null; // using any to match existing data
}

export const CollectionFormModal: React.FC<CollectionFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}) => {
  const isEditing = !!initialData;
  const [collectionName, setCollectionName] = useState('');
  const [collectionDesc, setCollectionDesc] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setCollectionName(initialData.name || '');
        setCollectionDesc(initialData.description || '');
        setIsPrivate(initialData.isPrivate || false);
      } else {
        setCollectionName('');
        setCollectionDesc('');
        setIsPrivate(false);
      }
      setIsLoading(false);
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!collectionName.trim()) return;
    
    setIsLoading(true);
    // Simulate network request
    setTimeout(() => {
      onSubmit({
        name: collectionName,
        description: collectionDesc,
        isPrivate,
      });
      setIsLoading(false);
    }, 600);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Редактировать коллекцию' : 'Создать новую коллекцию'}
      icon={<Layers className="w-5 h-5 text-accent" />}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-textPrimary">Название коллекции</label>
            <input
              type="text"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              placeholder="Например: Любимые платформеры"
              className="w-full px-4 py-2.5 bg-surface-2 border border-borderDef rounded-control text-sm text-textPrimary focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder-textTertiary"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-textPrimary">Описание <span className="text-textTertiary font-normal">(необязательно)</span></label>
            <textarea
              value={collectionDesc}
              onChange={(e) => setCollectionDesc(e.target.value)}
              placeholder="Коротко о том, какие игры собраны здесь..."
              className="w-full px-4 py-2.5 bg-surface-2 border border-borderDef rounded-control text-sm text-textPrimary focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder-textTertiary min-h-[80px] resize-y"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 bg-surface-2 border border-borderDef rounded-control">
            <div className="flex flex-col space-y-0.5">
              <span className="text-sm font-bold text-textPrimary">Сделать приватной</span>
              <span className="text-xs text-textSecondary">Эту коллекцию будете видеть только вы</span>
            </div>
            <Switch
              checked={isPrivate}
              onChange={setIsPrivate}
              label=""
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-5 py-2.5 bg-surface-2 hover:bg-surface-3 text-textPrimary rounded-control font-semibold text-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={!collectionName.trim() || isLoading}
            className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-control font-bold text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            <span>{isEditing ? 'Сохранить изменения' : 'Создать коллекцию'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CollectionFormModal;
