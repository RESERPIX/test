import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { 
  ArrowRightLeft, 
  User, 
  Users, 
  AlertTriangle, 
  Info, 
  Gamepad2, 
  DollarSign, 
  CheckCircle2, 
  Send 
} from 'lucide-react';

export interface GameTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: {
    id: string;
    title: string;
    slug: string;
    coverUrl?: string;
    isPersonal?: boolean;
    ownerName?: string;
    monetizationType?: 'free' | 'pwyw' | 'paid';
    price?: number;
  } | null;
  onInitiateTransfer: (payload: {
    gameId: string;
    gameTitle: string;
    targetType: 'user' | 'team';
    targetIdentifier: string;
  }) => void;
}

export const GameTransferModal: React.FC<GameTransferModalProps> = ({
  isOpen,
  onClose,
  game,
  onInitiateTransfer,
}) => {
  const [targetType, setTargetType] = useState<'user' | 'team'>('team');
  const [targetIdentifier, setTargetIdentifier] = useState('');
  const [confirmedRisk, setConfirmedRisk] = useState(false);
  const [validationError, setValidationError] = useState('');

  if (!game) return null;

  const isPaid = game.monetizationType === 'paid';
  const isPersonal = game.isPersonal ?? true;
  const currentOwnerText = isPersonal 
    ? 'Личный аккаунт (@kael_vostokov)' 
    : `Команда: ${game.ownerName || 'Студия'}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = targetIdentifier.trim();
    if (!trimmed) {
      setValidationError(
        targetType === 'user' 
          ? 'Укажите никнейм пользователя (например, @alex_dev)' 
          : 'Укажите идентификатор (slug) команды (например, neon-studios)'
      );
      return;
    }

    if (!confirmedRisk) {
      setValidationError('Пожалуйста, подтвердите ознакомление с условиями передачи');
      return;
    }

    setValidationError('');
    onInitiateTransfer({
      gameId: game.id,
      gameTitle: game.title,
      targetType,
      targetIdentifier: trimmed.startsWith('@') ? trimmed : (targetType === 'user' ? `@${trimmed}` : trimmed),
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Передача прав на игру"
      subtitle="Инициация смены владельца проекта"
      icon={<ArrowRightLeft className="w-5 h-5 text-accent" />}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Карточка игры и текущего владельца */}
        <div className="bg-surface-2 p-4 rounded-control border border-borderDef flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-lg bg-surface-3 border border-borderDef flex items-center justify-center overflow-hidden shrink-0">
            {game.coverUrl ? (
              <img src={game.coverUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <Gamepad2 className="w-6 h-6 text-accent" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-textPrimary text-sm truncate">{game.title}</h4>
            <div className="flex items-center gap-2 text-xs font-mono text-textTertiary mt-0.5">
              <span>/games/{game.slug}</span>
              <span>•</span>
              <span className="text-textSecondary flex items-center gap-1">
                {isPersonal ? <User className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                {currentOwnerText}
              </span>
            </div>
          </div>
          {isPaid && (
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-accent/10 text-accent border border-accent/20 shrink-0 flex items-center gap-1">
              <DollarSign className="w-3 h-3" /> Платная
            </span>
          )}
        </div>

        {/* Предупреждение о монетизации (Seller Boundary) */}
        {isPaid && (
          <div className="p-3.5 bg-warning/10 border border-warning/30 rounded-control flex items-start gap-3 text-xs text-warning">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">Платный проект: проверка статуса продавца</p>
              <p className="text-textSecondary leading-relaxed">
                Согласно регламенту платформы, для завершения передачи у нового владельца (пользователя или команды) должен быть верифицирован профиль продавца (Seller Profile). Если профиль отсутствует, продажи игры будут временно приостановлены до завершения верификации получателем.
              </p>
            </div>
          </div>
        )}

        {/* Выбор типа целевого субъекта (User или Team) */}
        <div>
          <label className="text-caption font-bold text-textSecondary uppercase mb-2 block">
            Кому передать игру (новый владелец)
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => { setTargetType('user'); setValidationError(''); }}
              className={`p-3 rounded-control border text-left flex items-center gap-3 transition-all cursor-pointer ${
                targetType === 'user' 
                  ? 'bg-accent/10 border-accent text-textPrimary' 
                  : 'bg-surface-1 border-borderDef text-textSecondary hover:bg-surface-2'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                targetType === 'user' ? 'bg-accent text-white' : 'bg-surface-2 text-textTertiary'
              }`}>
                <User className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-xs">Пользователю (User)</p>
                <p className="text-[11px] text-textTertiary mt-0.5">Личный профиль автора</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => { setTargetType('team'); setValidationError(''); }}
              className={`p-3 rounded-control border text-left flex items-center gap-3 transition-all cursor-pointer ${
                targetType === 'team' 
                  ? 'bg-accent/10 border-accent text-textPrimary' 
                  : 'bg-surface-1 border-borderDef text-textSecondary hover:bg-surface-2'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                targetType === 'team' ? 'bg-accent text-white' : 'bg-surface-2 text-textTertiary'
              }`}>
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-xs">Команде (Team)</p>
                <p className="text-[11px] text-textTertiary mt-0.5">Студия или сообщество</p>
              </div>
            </button>
          </div>
        </div>

        {/* Поле ввода идентификатора получателя */}
        <div>
          <label className="text-caption font-bold text-textSecondary uppercase mb-1.5 block">
            {targetType === 'user' ? 'Никнейм пользователя' : 'Идентификатор (slug) команды'}
          </label>
          <Input 
            value={targetIdentifier}
            onChange={(e) => {
              setTargetIdentifier(e.target.value);
              if (validationError) setValidationError('');
            }}
            placeholder={targetType === 'user' ? '@alex_dev или email' : 'neon-studios или open-collective'}
            autoFocus
          />
          <p className="text-[11px] text-textTertiary mt-1 font-mono">
            {targetType === 'user' 
              ? 'Пользователь получит персональный запрос и должен будет подтвердить принятие' 
              : 'Уполномоченный администратор или владелец команды должен будет одобрить трансфер'}
          </p>
        </div>

        {/* Инварианты передачи и подтверждение */}
        <div className="bg-surface-1 p-3.5 rounded-control border border-borderDef space-y-2 text-xs">
          <div className="flex items-start gap-2 text-textSecondary">
            <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              Вы остаётесь полноправным владельцем игры до тех пор, пока получатель явно не примет запрос. До момента подтверждения вы можете отозвать запрос в любое время.
            </span>
          </div>
          <div className="flex items-start gap-2 text-textSecondary">
            <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              У игры всегда ровно один владелец — долевое владение не предусмотрено. Вся история передачи фиксируется в журнале аудита.
            </span>
          </div>
        </div>

        {/* Чекбокс согласия */}
        <label className="flex items-start gap-2.5 cursor-pointer select-none">
          <input 
            type="checkbox"
            checked={confirmedRisk}
            onChange={(e) => {
              setConfirmedRisk(e.target.checked);
              if (validationError) setValidationError('');
            }}
            className="mt-0.5 rounded border-borderDef text-accent focus:ring-accent w-4 h-4"
          />
          <span className="text-xs text-textSecondary leading-normal">
            Я понимаю, что после подтверждения запроса получателем полный контроль над страницей игры, билдами и обновлениями перейдёт новому владельцу.
          </span>
        </label>

        {validationError && (
          <p className="text-xs font-semibold text-danger">{validationError}</p>
        )}

        {/* Кнопки действий */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-borderDef">
          <Button variant="secondary" type="button" onClick={onClose}>
            Отмена
          </Button>
          <Button variant="primary" type="submit">
            <Send className="w-4 h-4 mr-1.5" /> Отправить запрос
          </Button>
        </div>

      </form>
    </Modal>
  );
};

export default GameTransferModal;
