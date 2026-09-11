# HUBIGR — Руководство по типографике

## ✅ Что улучшено (v1.3)

### 1. Line-height оптимизирован для кириллицы

**Проблема:** Кириллические символы (Д, Ж, Ф, Ц, Щ, Ы) выше латиницы и требуют больше вертикального пространства.

**Решение:**
- `heading-2`: 1.3 → **1.4** (+7.7%)
- `heading-3`: 1.4 → **1.5** (+7.1%)
- `body-lg`: 1.6 → **1.7** (+6.25%)
- `body`: 1.6 → **1.65** (+3.1%)
- `body-sm`: 1.5 → **1.6** (+6.7%)
- `caption`: 1.4 → **1.5** (+7.1%)
- `display`: 1.1 → **1.15** (+4.5%)

### 2. Добавлен overline стиль

```css
.overline {
  font-family: 'JetBrains Mono';
  font-size: 0.625rem; /* 10px */
  line-height: 1.6;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-weight: 600;
  color: #8A9099;
}
```

**Использование:** Системные лейблы, статусы, категории.

### 3. Глобальные улучшения рендеринга

```css
html {
  font-feature-settings: 'kern' 1, 'liga' 1, 'calt' 1;
  -webkit-font-feature-settings: 'kern' 1, 'liga' 1, 'calt' 1;
}

body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}
```

**Эффект:**
- Кернинг (kern) — правильные расстояния между буквами
- Лигатуры (liga) — красивые сочетания fi, fl, ff
- Контекстные альтернативы (calt) — умные замены символов

### 4. Современный text-wrap

```css
p, .prose {
  max-width: 65ch; /* оптимальная длина строки */
  text-wrap: pretty; /* лучшие переносы */
}

h1, h2, h3, h4, h5, h6 {
  text-wrap: balance; /* предотвращает висячие предлоги */
}
```

**Поддержка:** Chrome 114+, Firefox 121+, Safari 17.4+

---

## 📐 Правила применения

### Заголовки (Inter, sans-serif)

```tsx
// Display — главный заголовок страницы
<h1 className="text-display font-bold text-textPrimary">
  Название игры
</h1>

// Heading-1 — крупные секции
<h2 className="text-heading-1 font-bold text-textPrimary">
  Системные требования
</h2>

// Heading-2 — подсекции
<h3 className="text-heading-2 font-semibold text-textPrimary">
  Рекомендуемые
</h3>

// Heading-3 — мелкие заголовки
<h4 className="text-heading-3 font-semibold text-textPrimary">
  Процессор
</h4>
```

### Body текст (Inter, sans-serif)

```tsx
// Body-lg — лонгриды, описания игр
<p className="text-body-lg text-textSecondary leading-relaxed">
  Длинное описание игры...
</p>

// Body — основной текст
<p className="text-body text-textSecondary">
  Стандартный параграф
</p>

// Body-sm — второстепенный текст
<span className="text-body-sm text-textSecondary">
  Дополнительная информация
</span>

// Caption — мета-информация
<span className="text-caption text-textTertiary">
  12 минут назад · 234 просмотра
</span>
```

### Системные данные (JetBrains Mono, monospace)

```tsx
// Overline — категории, лейблы
<span className="overline">
  EARLY ACCESS
</span>

// Mono-label — статусы, счётчики
<span className="mono-label text-xs text-textTertiary">
  В РАЗРАБОТКЕ
</span>

// Таймеры, ID, версии
<span className="font-mono text-sm font-semibold text-textPrimary">
  v1.2.4
</span>

// Цены
<span className="font-mono text-lg font-bold text-accent">
  $9.99
</span>
```

---

## ❌ Частые ошибки

### 1. Неправильный выбор шрифта

```tsx
// ❌ ПЛОХО: Mono для естественного языка
<h2 className="font-mono text-xl font-bold uppercase">
  Описание игры
</h2>

// ✅ ХОРОШО: Inter для заголовков
<h2 className="text-heading-2 font-semibold text-textPrimary">
  Описание игры
</h2>
```

### 2. Недостаточный line-height

```tsx
// ❌ ПЛОХО: Слишком плотно для кириллицы
<p className="text-sm leading-tight text-textSecondary">
  Длинный текст с русскими буквами...
</p>

// ✅ ХОРОШО: Используем предустановленные размеры
<p className="text-body-sm text-textSecondary">
  Длинный текст с русскими буквами...
</p>
```

### 3. text-disabled для информации

```tsx
// ❌ ПЛОХО: Контраст 2.4:1 (ниже WCAG AA)
<span className="text-xs text-textDisabled">
  Опубликовано 2 дня назад
</span>

// ✅ ХОРОШО: text-tertiary (4.8:1)
<span className="text-caption text-textTertiary">
  Опубликовано 2 дня назад
</span>
```

### 4. Слишком длинные строки

```tsx
// ❌ ПЛОХО: Строка на всю ширину экрана
<div className="w-full">
  <p className="text-body text-textSecondary">
    Очень длинный текст без ограничения ширины...
  </p>
</div>

// ✅ ХОРОШО: Ограничиваем до 65 символов
<div className="max-w-prose">
  <p className="text-body text-textSecondary">
    Очень длинный текст с ограничением ширины...
  </p>
</div>
```

### 5. Uppercase без letter-spacing

```tsx
// ❌ ПЛОХО: Uppercase без расширения трекинга
<span className="text-xs font-bold uppercase">
  СТАТУС
</span>

// ✅ ХОРОШО: С tracking-wider
<span className="text-xs font-bold uppercase tracking-wider">
  СТАТУС
</span>

// ✅ ЕЩЁ ЛУЧШЕ: Используем утилиту
<span className="mono-label text-xs">
  СТАТУС
</span>
```

---

## 🎯 Контрасты (WCAG AA: 4.5:1, AAA: 7:1)

| Токен | Контраст | Применение |
|---|---|---|
| `text-primary` #F5F5F7 | **14.2:1** ✅ AAA | Заголовки, важные лейблы |
| `text-secondary` #B8BCC4 | **8.1:1** ✅ AAA | Body текст, описания |
| `text-tertiary` #8A9099 | **4.8:1** ✅ AA | Мета-информация, даты |
| `text-disabled` #5A5F68 | **2.4:1** ❌ | ТОЛЬКО disabled элементы |

**Правило:** `text-disabled` ЗАПРЕЩЕНО использовать для информационного текста.

---

## 📱 Адаптивность

```tsx
// Заголовки масштабируются
<h1 className="text-2xl md:text-4xl lg:text-display font-bold">
  Адаптивный заголовок
</h1>

// Body текст остаётся читаемым
<p className="text-body-sm md:text-body text-textSecondary">
  Адаптивный параграф
</p>

// Ограничиваем ширину на больших экранах
<div className="max-w-prose mx-auto px-4">
  <p className="text-body-lg text-textSecondary">
    Комфортное чтение на любом экране
  </p>
</div>
```

---

## 🔧 Утилиты Tailwind

```tsx
// Готовые размеры с правильным line-height
text-display      // 40px, lh: 1.15
text-heading-1    // 32px, lh: 1.3
text-heading-2    // 24px, lh: 1.4
text-heading-3    // 20px, lh: 1.5
text-body-lg      // 18px, lh: 1.7
text-body         // 16px, lh: 1.65
text-body-sm      // 14px, lh: 1.6
text-caption      // 12px, lh: 1.5

// Шрифты
font-sans         // Inter
font-mono         // JetBrains Mono

// Веса
font-bold         // 700
font-semibold     // 600
font-medium       // 500
font-normal       // 400

// Letter-spacing
tracking-tighter  // -0.05em
tracking-tight    // -0.025em
tracking-normal   // 0
tracking-wide     // 0.025em
tracking-wider    // 0.05em (для uppercase)
tracking-widest   // 0.1em (для overline)

// Цвета
text-textPrimary    // #F5F5F7
text-textSecondary  // #B8BCC4
text-textTertiary   // #8A9099
text-textDisabled   // #5A5F68

// Ширина текстового блока
max-w-prose         // ~65ch (оптимально для чтения)
```

---

## 📊 Миграция существующего кода

### Найти проблемные места

```bash
# Найти text-disabled в информационном контексте
grep -r "text-textDisabled" src/ | grep -v "disabled"

# Найти uppercase без tracking
grep -r "uppercase" src/ | grep -v "tracking"

# Найти плотный line-height
grep -r "leading-tight\|leading-none" src/
```

### Заменить

1. `text-textDisabled` → `text-textTertiary` (если не disabled)
2. `uppercase` → `uppercase tracking-wider`
3. `leading-tight` → использовать предустановленные размеры
4. Хардкод размеров → использовать токены (`text-body`, `text-heading-2`, etc.)

---

## ✨ Итог

Типографика платформы теперь:
- ✅ Оптимизирована для кириллицы (+7% line-height)
- ✅ Соответствует WCAG AA/AAA
- ✅ Использует современные CSS возможности (text-wrap)
- ✅ Имеет чёткие правила Inter vs Mono
- ✅ Предоставляет готовые утилиты
