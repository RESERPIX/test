# Auth Module Integration Guide

## Структура файлов

```
src/
├── contexts/
│   └── AuthContext.tsx          # Глобальный контекст авторизации
├── components/
│   └── auth/
│       ├── AuthModal.tsx        # Модальное окно с 5 экранами auth
│       └── AuthDevTools.tsx     # DevTools панель для тестирования
├── App.tsx                      # Главный компонент с AuthProvider
└── components/TopNavigationBar.tsx  # Интегрирован с useAuth()
```

## Компоненты

### 1. AuthContext (src/contexts/AuthContext.tsx)

Глобальный контекст для управления состоянием авторизации.

**API:**
```typescript
const {
  user,                    // User | null - текущий пользователь
  isAuthenticated,         // boolean - статус авторизации
  isAuthModalOpen,         // boolean - открыто ли модальное окно
  authView,                // AuthView - текущий экран модалки
  contextMessage,          // string | null - контекстное сообщение (для returnUrl)
  openAuthModal,           // (view?, message?) => void
  closeAuthModal,          // () => void
  setAuthView,             // (view) => void
  login,                   // (userData) => void
  logout,                  // () => void
} = useAuth();
```

### 2. AuthModal (src/components/auth/AuthModal.tsx)

Модальное окно с 5 экранами:
- **LOGIN** - вход в аккаунт
- **REGISTER** - регистрация
- **VERIFY_EMAIL** - подтверждение OTP кода
- **FORGOT_PASSWORD** - запрос ссылки для сброса
- **RESET_PASSWORD** - установка нового пароля

**Функционал:**
- ✅ Real-time валидация email/никнейма с debounce 300ms
- ✅ Password strength meter (4 уровня)
- ✅ OTP input с автофокусом и paste support
- ✅ Resend timer (59 секунд)
- ✅ Toast уведомления
- ✅ Context messages (для returnUrl после действия)
- ✅ Зарезервированные никнеймы: admin, support, mod, hubigr, api, null, root, system
- ✅ Капча при rate limiting (429)
- ✅ Обработка ошибок: 401 (wrong), 403 (banned), 409 (conflict), 429 (limit)

### 3. AuthDevTools (src/components/auth/AuthDevTools.tsx)

Floating панель внизу экрана для тестирования:
- Показывает текущий статус (залогинен/нет)
- Кнопки быстрого перехода между экранами
- Тест контекстных сообщений (избранное, покупка)

## Использование

### Открыть модальное окно авторизации

```typescript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { openAuthModal } = useAuth();

  return (
    <button onClick={() => openAuthModal('LOGIN')}>
      Войти
    </button>
  );
}
```

### Показать контекстное сообщение

```typescript
// Пример: пользователь пытается добавить в избранное без авторизации
const { openAuthModal, isAuthenticated } = useAuth();

const handleAddToFavorites = () => {
  if (!isAuthenticated) {
    openAuthModal('LOGIN', 'Войдите, чтобы добавить игру в избранное');
    return;
  }
  // ... добавить в избранное
};
```

### Проверка авторизации

```typescript
const { isAuthenticated, user } = useAuth();

if (isAuthenticated) {
  console.log('Пользователь:', user.nickname, user.email);
} else {
  console.log('Гость');
}
```

### Выход из системы

```typescript
const { logout } = useAuth();

<button onClick={logout}>Выйти</button>
```

## Интеграция в TopNavigationBar

TopNavigationBar уже интегрирован с AuthContext:

```typescript
const { openAuthModal, isAuthenticated, user, logout } = useAuth();

// Кнопки входа/регистрации показываются только для гостей:
{authState === 'guest' && !isAuthenticated && (
  <div className="flex items-center gap-2">
    <button onClick={() => openAuthModal('LOGIN')}>Войти</button>
    <button onClick={() => openAuthModal('REGISTER')}>Регистрация</button>
  </div>
)}
```

## Тестирование

1. Запустите dev-сервер: `npm run dev`
2. Внизу экрана появится **AuthDevTools** панель
3. Используйте кнопки для переключения между экранами
4. Протестируйте context messages (избранное, покупка)

## Mock данные для тестирования

**Email занят:**
- `taken@example.com`
- `busy@example.com`

**Зарезервированные никнеймы:**
- admin, support, mod, hubigr, api, null, root, system

**OTP код:** любой 6-значный код (валидация отсутствует в mock режиме)

## UI/UX особенности

**Типографика:**
- Labels: `text-sm font-semibold text-textPrimary`
- Inputs: `h-12 px-4 text-sm` (py-3 эквивалент)
- Placeholders: `text-textTertiary`

**Состояния:**
- Focus: `focus:border-accent focus:ring-2 focus:ring-accent/20`
- Error: `border-danger` + inline сообщение
- Success: `border-success` + inline статус

**Accessibility:**
- Все inputs имеют labels
- Keyboard navigation (Tab, Enter, Escape)
- Focus-visible states
- ARIA attributes

## Будущие улучшения

1. **Backend интеграция:**
   - Подключить реальные API endpoints
   - JWT token management
   - Refresh token logic

2. **Social auth:**
   - Google OAuth
   - GitHub OAuth
   - Discord OAuth

3. **2FA:**
   - TOTP authenticator apps
   - Backup codes

4. **Email verification:**
   - Реальная отправка писем
   - Token validation

5. **Password recovery:**
   - Secure token generation
   - Expiration handling
