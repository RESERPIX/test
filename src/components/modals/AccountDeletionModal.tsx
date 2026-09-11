import React, { useState } from 'react';
import { 
  Trash2, 
  AlertTriangle, 
  Clock, 
  Eye, 
  EyeOff
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';

export interface AccountDeletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeletionInitiated: () => void;
  userEmail?: string;
  hasPassword?: boolean;
}

export const AccountDeletionModal: React.FC<AccountDeletionModalProps> = ({
  isOpen,
  onClose,
  onDeletionInitiated,
  userEmail = 'john.doe@example.com',
  hasPassword = true
}) => {
  const [password, setPassword] = useState('');
  const [confirmationWord, setConfirmationWord] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Валидация re-authentication
    if (hasPassword) {
      if (!password) {
        setError('Пожалуйста, введите ваш текущий пароль для подтверждения личности');
        return;
      }
      if (password.length < 4) {
        setError('Неверный пароль. Пожалуйста, проверьте введённые данные.');
        return;
      }
    } else {
      if (confirmationWord.trim().toUpperCase() !== 'УДАЛИТЬ') {
        setError('Для подтверждения введите слово «УДАЛИТЬ»');
        return;
      }
    }

    setIsLoading(true);

    // Симуляция вызова AUTH-018: DELETE /api/v1/auth/account (старт pending_deletion)
    setTimeout(() => {
      setIsLoading(false);
      onDeletionInitiated();
    }, 700);
  };

  const handleClose = () => {
    if (isLoading) return;
    setPassword('');
    setConfirmationWord('');
    setError(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Подтверждение удаления аккаунта"
      subtitle="Финальный шаг запуска 30-дневного периода ожидания"
      icon={<Trash2 className="w-5 h-5 text-danger" />}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Предупреждение о последствиях (BR-ACC-059, BR-ACC-060) */}
        <div className="p-3.5 bg-danger/10 border border-danger/30 rounded-control space-y-2 text-xs text-textPrimary">
          <div className="flex items-center gap-2 text-danger font-bold">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Внимание: учетная запись будет переведена в режим удаления</span>
          </div>
          <p className="text-textSecondary leading-relaxed">
            После подтверждения вы будете немедленно деавторизованы на всех устройствах. Аккаунт перейдет в статус <strong className="text-textPrimary">Ожидает удаления (30 дней)</strong>. Все публичные страницы будут скрыты.
          </p>
        </div>

        {/* Сводка сроков */}
        <div className="bg-surface-2 p-3 rounded-control border border-borderDef flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-textSecondary">
            <Clock className="w-4 h-4 text-warning shrink-0" />
            <span>Срок отмены удаления:</span>
          </div>
          <span className="font-bold text-warning">30 календарных дней</span>
        </div>

        {/* Поле подтверждения паролем или кодовым словом */}
        <div className="space-y-2 pt-1">
          <label className="text-caption font-bold text-textSecondary uppercase tracking-wider block">
            {hasPassword ? 'Текущий пароль для подтверждения' : 'Подтверждение словом «УДАЛИТЬ»'}
          </label>

          {hasPassword ? (
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(null); }}
                placeholder="Введите ваш пароль"
                disabled={isLoading}
                required
                className="w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-textTertiary hover:text-textPrimary cursor-pointer p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          ) : (
            <Input
              type="text"
              value={confirmationWord}
              onChange={(e) => { setConfirmationWord(e.target.value); setError(null); }}
              placeholder="Введите слово УДАЛИТЬ заглавными буквами"
              disabled={isLoading}
              required
              className="w-full font-mono uppercase"
            />
          )}

          {error && (
            <p className="text-[11px] font-mono text-danger animate-fadeIn flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              {error}
            </p>
          )}

          <p className="text-[11px] text-textTertiary">
            Подтверждение для аккаунта: <span className="font-mono text-textSecondary">{userEmail}</span>
          </p>
        </div>

        {/* Кнопки действий */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-borderDef">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            Отмена
          </Button>

          <Button
            type="submit"
            variant="danger"
            disabled={isLoading}
            className="font-bold flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isLoading ? 'Запуск процедуры...' : 'Подтвердить удаление (30 дней)'}</span>
          </Button>
        </div>

      </form>
    </Modal>
  );
};

export default AccountDeletionModal;
