# HUBIGR Platform

Инди-геймдев платформа: игры, джемы, девлоги и сообщество.

## 📁 Структура проекта

```
hubigr-prototype/
├── src/
│   ├── components/          # Общие переиспользуемые компоненты
│   │   ├── TopNavigationBar.tsx
│   │   └── DevMatrixPanel.tsx
│   │
│   ├── pages/              # Страницы приложения
│   │   ├── GamesCatalogPage.tsx    # Каталог игр
│   │   ├── JamsCatalogPage.tsx     # Каталог джемов
│   │   ├── GamePage.tsx            # Детальная страница игры
│   │   ├── JamPage.tsx             # Детальная страница джема
│   │   ├── ProfilePage.tsx         # Профиль разработчика/команды
│   │   ├── GameSubmissionWizard.tsx # Визард подачи игры
│   │   ├── AboutPage.tsx           # О платформе
│   │   ├── SupportPage.tsx         # Поддержка проекта
│   │   └── TutorialPage.tsx        # Как участвовать
│   │
│   ├── App.tsx             # Root компонент
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles + Tailwind directives
│
├── index.html              # HTML entry point для Vite
├── tailwind.config.js      # Tailwind + Design System tokens
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── hubigr-design-system-v1.1.md  # Дизайн-система (документация)
```

## 🛠 Tech Stack

- **Frontend Framework:** React 18.3 + TypeScript 5.7
- **Build Tool:** Vite 6.1
- **Styling:** Tailwind CSS 3.4 + Custom Design System Tokens
- **Icons:** Lucide React 0.474
- **Routing:** Hash-based Client-Side Routing (внутри TopNavigationBar)

## 🎨 Design System

Semantic tokens определены в `tailwind.config.js`:

- **Colors:** `surface-0/1/2/3/4/disabled`, `textPrimary/Secondary/Tertiary/Disabled`, `accent/accent-hover`, `borderDef/borderStrong`, semantic colors (`success`, `danger`, `warning`, `info`)
- **Spacing:** `inline`, `stack`, `card`, `section`, `section-lg`
- **Typography:** `display`, `heading-1/2/3`, `body/body-sm`, `caption`
- **Elevation:** `elevation-base/raised/overlay`
- **Radius:** `control`, `card`, `modal`
- **Transitions:** `duration-fast/base/slow/expand`

Полная документация: `hubigr-design-system-v1.1.md`

## 🚀 Запуск проекта

```bash
# Установка зависимостей
npm install

# Dev server (http://localhost:5173)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## 📝 Naming Conventions

- **Components:** PascalCase (e.g., `TopNavigationBar.tsx`)
- **Pages:** PascalCase + "Page" suffix (e.g., `GamesCatalogPage.tsx`)
- **Utilities:** camelCase (e.g., `formatMetric()`)

## ✅ Accessibility

Все интерактивные элементы имеют:
- `focus-visible:ring-2` для keyboard navigation
- Proper ARIA labels
- Semantic HTML
- Контраст текста соответствует WCAG AA (4.5:1)

## 🔄 Recent Updates

- ✅ Реорганизация структуры: все TSX компоненты перемещены в `src/`
- ✅ Удалены устаревшие HTML файлы (hubigr_about.html, hubigr_support.html, hubigr_tutorial.html)
- ✅ Semantic tokens система внедрена
- ✅ Focus-visible добавлен на все интерактивные элементы
- ✅ Исправлено нарушение display-регистра (§1.0 дизайн-системы)
- ✅ Устранена конкуренция accent-триггеров в navigation bar

## 📄 License

Private project - All rights reserved
