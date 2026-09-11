import React from 'react';
import Modal from '../ui/Modal';
import { Rocket, ExternalLink } from 'lucide-react';

export interface PatchnotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: any | null; // using any to match existing props in LibraryPage, should be typed properly in a real codebase
}

export const PatchnotesModal: React.FC<PatchnotesModalProps> = ({
  isOpen,
  onClose,
  game,
}) => {
  if (!isOpen || !game) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Информация об обновлении"
      icon={<Rocket className="w-5 h-5 text-accent" />}
      maxWidth="md"
    >
      <div className="flex flex-col h-full space-y-5">
        <div className="flex items-start gap-3 border-b border-borderDef pb-4 shrink-0">
          <img 
            src={game.cover_url} 
            alt="Cover" 
            className="w-12 h-12 object-cover rounded-control border border-borderDef" 
          />
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-textPrimary font-mono">{game.title}</h3>
              <span className="bg-success/20 text-success border border-success/30 font-mono text-caption font-bold px-2 py-0.5 rounded">
                {game.latest_version || 'v1.0.0'}
              </span>
            </div>
            <span className="text-xs text-textTertiary font-mono">Патчноут &bull; Выпущено 2 дня назад</span>
          </div>
        </div>

        <div className="space-y-4 overflow-y-auto pr-1 text-xs text-textSecondary leading-relaxed font-sans max-h-[50vh]">
          <div className="bg-surface-3 p-3.5 rounded-control border border-borderDef space-y-2">
            <h4 className="font-bold text-textPrimary text-sm font-mono flex items-center gap-2">
              <Rocket className="w-4 h-4 text-accent" />
              <span>Патч {game.latest_version || 'v1.0.0'}: Крупные улучшения производительности</span>
            </h4>
            <p className="text-textTertiary text-xs">
              Разработчик <strong>{game.author?.name || 'Автор'}</strong> выпустил обновление. Вот полный список изменений и улучшений:
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-caption font-mono font-bold text-accent uppercase tracking-wider block">Что нового:</span>
            <ul className="space-y-1.5 pl-4 list-disc text-textSecondary">
              <li>Оптимизирована работа с памятью и браузерными субресурсами WebGL/WASM.</li>
              <li>Добавлена поддержка контроллеров и геймпадов с кастомным назначением клавиш.</li>
              <li>Исправлен баг с сохранением игрового прогресса в локальном хранилище.</li>
              <li>Улучшено физическое сглаживание и задержка ввода при высоком FPS.</li>
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-borderDef shrink-0">
          <span className="text-accent text-xs font-mono font-bold flex items-center gap-1 cursor-pointer hover:underline">
            <span>Полный Девлог на сайте</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </span>

          <button 
            onClick={onClose} 
            className="px-5 py-2 bg-accent hover:bg-accent-hover text-white font-extrabold font-mono text-xs rounded-control transition-colors cursor-pointer"
          >
            Прочитано
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PatchnotesModal;
