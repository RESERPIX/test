import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Settings2 } from 'lucide-react';

type DevSimStatus = 'success' | 'wrong' | 'banned' | 'conflict' | 'limit';

export default function AuthDevTools() {
  const { openAuthModal, user, logout, isAuthenticated, isAuthModalOpen } = useAuth();
  const [simStatus, setSimStatus] = useState<DevSimStatus>('success');
  // На мобильных устройствах (< md) AuthDevTools свернут по умолчанию, чтобы не перекрывать Bottom Sheet
  const [isCollapsed, setIsCollapsed] = useState(() => window.innerWidth < 768);

  // Показываем AuthDevTools только когда открыто модальное окно авторизации в dev-режиме
  if (!isAuthModalOpen) {
    return null;
  }

  // Когда модалка открыта - z-index повышается поверх основной панели
  const zIndex = 'z-devtools';

  if (isCollapsed) {
    return (
      <button
        onClick={() => setIsCollapsed(false)}
        className={`fixed top-2 right-14 md:top-auto md:bottom-2 md:left-2 ${zIndex} px-2.5 py-1 bg-surface-1/90 backdrop-blur-md border border-accent/40 rounded-full text-[10px] font-mono text-accent hover:bg-surface-2 transition-all shadow-md active:scale-95`}
      >
        ⚡ Auth Dev
      </button>
    );
  }

  return (
    <div className={`hidden md:flex fixed bottom-0 left-0 w-full bg-surface-1/95 backdrop-blur-md border-t border-borderDef p-3 ${zIndex} transition-all duration-200 flex-wrap items-center justify-center gap-4 text-[11px] font-mono text-textSecondary shadow-2xl select-none`}>
      <button
        onClick={() => setIsCollapsed(true)}
        className="absolute top-2 right-2 text-textTertiary hover:text-textPrimary text-xs cursor-pointer"
        title="Свернуть AuthDevTools"
      >
        ✕
      </button>
      <div className="flex items-center gap-2">
        <Settings2 className="w-3.5 h-3.5" />
        <span>Auth DevTools:</span>
      </div>

      {isAuthenticated ? (
        <div className="flex items-center gap-3">
          <span className="text-success">✓ Залогинен: {user?.nickname || user?.email}</span>
          <button
            onClick={logout}
            className="px-2 py-1 bg-surface-2 border border-borderDef rounded text-textPrimary hover:border-accent hover:text-accent transition-colors"
          >
            Выйти
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-textTertiary">Не залогинен</span>
          <button
            onClick={() => openAuthModal('LOGIN')}
            className="px-2 py-1 bg-surface-2 border border-borderDef rounded text-textPrimary hover:border-accent hover:text-accent transition-colors"
          >
            Вход
          </button>
          <button
            onClick={() => openAuthModal('REGISTER')}
            className="px-2 py-1 bg-surface-2 border border-borderDef rounded text-textPrimary hover:border-accent hover:text-accent transition-colors"
          >
            Регистрация
          </button>
        </div>
      )}

      <div className="w-px h-4 bg-borderDef hidden sm:block" />

      <div className="flex items-center gap-2 flex-wrap justify-center">
        <span>Открыть экран:</span>
        <button onClick={() => openAuthModal('LOGIN')} className="hover:text-textPrimary hover:underline">Вход</button>
        <button onClick={() => openAuthModal('REGISTER')} className="hover:text-textPrimary hover:underline">Регистрация</button>
        <button onClick={() => openAuthModal('VERIFY_EMAIL')} className="hover:text-textPrimary hover:underline">OTP</button>
        <button onClick={() => openAuthModal('FORGOT_PASSWORD')} className="hover:text-textPrimary hover:underline">Сброс пароля</button>
        <button onClick={() => openAuthModal('RESET_PASSWORD')} className="hover:text-textPrimary hover:underline">Новый пароль</button>
      </div>

      <div className="w-px h-4 bg-borderDef hidden sm:block" />

      <div className="flex items-center gap-2">
        <span>Context Message Test:</span>
        <button
          onClick={() => openAuthModal('LOGIN', 'Войдите, чтобы добавить игру в избранное')}
          className="hover:text-textPrimary hover:underline"
        >
          Избранное
        </button>
        <button
          onClick={() => openAuthModal('LOGIN', 'Войдите в аккаунт для покупки игры')}
          className="hover:text-textPrimary hover:underline"
        >
          Покупка
        </button>
      </div>
    </div>
  );
}
