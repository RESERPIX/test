import React, { useState, useMemo, useEffect, useRef } from 'react';
import DevMatrixPanel from '../components/DevMatrixPanel';
import JamThemeBlock from '../components/JamThemeBlock';
import FontStyles from '../components/ui/FontStyles';
import { useToast } from '../components/ui/Toast';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Tabs from '../components/ui/Tabs';
import Drawer from '../components/ui/Drawer';
import CustomSelect, { NativeSelect } from '../components/ui/Select';
import AddToCollectionModal from '../components/modals/AddToCollectionModal';
import AntiPhishingModal from '../components/modals/AntiPhishingModal';
import { creatorSupportService } from '../services/creatorSupportService';
import { JamAbuseReportDrawer } from '../components/modals/JamAbuseReportDrawer';
import ShareJamModal from '../components/modals/ShareJamModal';
import { JamRegistrationModal } from '../components/modals/JamRegistrationModal';
import GameCardContextMenu from '../components/GameCardContextMenu';
import { JamSubmissionCard, PlatformIcon } from '../components/GameCard';
import JamOrganizerWorkspace from '../components/jam/JamOrganizerWorkspace';
import { jamOrganizerService } from '../services/jamOrganizerService';
import { 
  Trophy, Calendar, Users, Layers, ArrowUpRight, Bell, Info, Award, Check, 
  Sparkles, Heart, Clock, Lock, Share2, Flag, Star, Plus, X, Cpu, RefreshCw, 
  AlertOctagon, Eye, ThumbsUp, ThumbsDown, MessageSquare, ExternalLink, ShieldAlert, 
  MoreVertical, Copy, ChevronDown, ChevronRight, ChevronUp, Search, Play, Gamepad2, FileText, Send, UserCheck,
  Medal, HelpCircle, CheckCircle2, Code, UserPlus, Radio, MessageCircle, Coins,
  Pin, Hash, Filter, UserCircle, CornerDownRight, MessageSquarePlus,
  Briefcase, Globe, User, ArrowLeft, Shield, AlertTriangle, Mail, SendHorizontal, Undo2, Edit3, Trash2,
  Grid, List, Bookmark, Download, Flame, Monitor, Terminal, Apple, LayoutGrid,
  ChevronsUpDown, Gamepad, Lightbulb, Palette, Music
} from 'lucide-react';

// --- ИМИТАЦИОННЫЕ ДАННЫЕ ДЖЕМА И СООБЩЕСТВА ---
const JAM_DATA = {
  id: "broken_worlds_jam",
  title: "BROKEN WORLDS JAM",
  slug: "broken-worlds-jam",
  subtitle: "Создайте шедевр интерактивного искусства за 72 часа. Продемонстрируйте свои навыки дизайна, кода и визуального повествования.",
  aboutText: "Broken Worlds Game Jam — это творческое состязание для независимых разработчиков, где вы вольны показать лучшее, на что способны. Наша цель — собрать увлеченных творцов со всего мира и помочь им воплотить концептуальные идеи в жизнь. По завершении приема работ ваши проекты будут оцениваться авторитетным жюри индустрии и коллегами по джему.",
  cover: "/jam-cover.png",
  stats: {
    participantsCount: 1240,
    submissionsCount: 184,
    prizePool: "$2,700",
    durationDays: "14 дней"
  },
  theme: {
    title: "ЗАБЫТЫЕ ТЕХНОЛОГИИ",
    description: "Тема посвящена архаичным интерфейсам, устаревшим протоколам и утерянным системам управления.",
    modifiers: [
      "Управление одной кнопкой",
      "Цветовая палитра: 4 цвета",
      "No Text / UI"
    ]
  },
  rulesSummary: [
    { num: "01", title: "Свежий код", text: "Все ключевые механики должны быть разработаны строго в отведенный срок. Можно использовать готовые шаблоны и базовые библиотеки." },
    { num: "02", title: "Соответствие теме", text: "Игра должна явно интерпретировать общую тему. Нестандартные толкования поощряются жюри." },
    { num: "03", title: "Открытость", text: "Права остаются у вас. Вы обязаны предоставить стабильный билд для браузеров или ПК." }
  ],
  schedule: [
    { date: "01 Июл 2026, 12:00", title: "Регистрация участников", desc: "Открытие страницы джема. Создание команд и поиск тиммейтов в сообществе.", status: "completed" },
    { date: "04 Июл 2026, 18:00", title: "Старт джема и раскрытие темы", desc: "Автоматическое объявление секретной темы. Ровно 72 часа на разработку.", status: "active" },
    { date: "07 Июл 2026, 18:00", title: "Прием работ и голосование", desc: "Закрытие приема билдов. Начало кросс-голосования участников (5 дней).", status: "upcoming" },
    { date: "15 Июл 2026, 15:00", title: "Подведение итогов", desc: "Публикация финальных результатов, выбор победителей жюри и раздача грантов.", status: "upcoming" }
  ],
  prizes: [
    { place: "1 место", sum: "$1,500", reward: "Денежный приз, экспозиция в бета-витрине HUBIGR и приглашение в закрытый сообщество-хаб." },
    { place: "2 место", sum: "$800", reward: "Денежный приз и особый бейдж участника." },
    { place: "3 место", sum: "$400", reward: "Денежный приз и бронзовый бейдж участника." }
  ],
  rulesDetailed: [
    {
      id: 1,
      title: "1. Формат участия и состав команд",
      iconName: "Users",
      summary: "Участие доступно одиночным разработчикам и командам до 4 человек.",
      details: "Вы можете участвовать соло или объединяться в команды до 4 человек. Каждый участник команды должен зарегистрироваться на странице джема до завершения дедлайна сдачи работ. Найти соавторов или присоединиться к открытым студиям можно во вкладке «Сообщество»."
    },
    {
      id: 2,
      title: "2. Требования к движкам и WebGL сборкам",
      iconName: "Cpu",
      summary: "Обязательная работоспособная WebGL сборка для запуска в браузере.",
      details: "Разрешено использовать любые игровые движки (Unity, Godot, Unreal Engine, Defold, Phaser, Custom C++/Rust). Для максимального охвата аудитории и удобства судейства обязательна публикация WebGL сборки. Дополнительно допускается загрузка архивных Desktop сборок (.zip/.exe) до 500 МБ."
    },
    {
      id: 3,
      title: "3. Использование сторонних ассетов и ИИ-инструментов",
      iconName: "Sparkles",
      summary: "Сторонние паки и ИИ разрешены при обязательном заполнении декларации.",
      details: "Разрешается использовать готовые платные и бесплатные паки (аудио, текстуры, 3D-модели), если у вас есть соответствующая лицензия. При использовании генеративных ИИ-инструментов (Midjourney, ChatGPT, Stable Diffusion) автор обязан указать это при подаче игры в поле assets_description."
    },
    {
      id: 4,
      title: "4. Дедлайн и Grace Period (Милосердный интервал)",
      iconName: "Clock",
      summary: "30-минутный милосердный интервал после наступления 18:00 (МСК).",
      details: "Приём работ строго завершается по таймеру. В случае непредвиденных проблем с загрузкой WebGL билда предоставляется Grace Period ровно на 30 минут. Все сабмишены, поданные в этот период, проходят модерацию оргкомитета."
    },
    {
      id: 5,
      title: "5. Политика честной игры и дисквалификация",
      iconName: "ShieldAlert",
      summary: "Запрет вредоносного кода, накруток и навязанного рейтинга.",
      details: "Проекты, содержащие вредоносный код, майнеры, оскорбительный контент или нарушающие авторские права, немедленно снимаются с соревнований. Оценка работ жюри проходит в слепом режиме с автоматической проверкой на конфликт интересов (COI)."
    }
  ],
  faq: [
    { q: "Можно ли использовать готовые ассеты?", a: "Да, разрешено использовать сторонние аудио и графические паки при наличии коммерческой лицензии." },
    { q: "Как проходит оценка работ?", a: "Голосование состоит из двух этапов: оценки участников сообщества и вердикта экспертного жюри." },
    { q: "Нужно ли быть профессионалом?", a: "Нет! Джем открыт для разработчиков любого уровня подготовки — от новичков до инди-студий." }
  ],
  organizer: {
    name: "Hubigr Studio",
    handle: "@hubigr_studio",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=hubigr",
    role: "Главный организатор"
  },
  jury: [
    { id: 1, name: "Alexander Kael", handle: "@kael_vostokov", role: "Lead Game Designer", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop" },
    { id: 2, name: "Maria Art", handle: "@maria_3d", role: "3D & VFX Lead", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" },
    { id: 3, name: "VoidSound", handle: "@void_sound", role: "Audio Producer", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=void" }
  ],
  sponsors: [
    { name: "TechStudio Labs", logo: "https://api.dicebear.com/7.x/identicon/svg?seed=techlabs" },
    { name: "Indie Fund RU", logo: "https://api.dicebear.com/7.x/identicon/svg?seed=indiefund" },
    { name: "WebGL Alliance", logo: "https://api.dicebear.com/7.x/identicon/svg?seed=webgl" }
  ],
  criteria: [
    { name: "Геймплей", weight: "30%", desc: "Удобство управления, увлекательность механик и баланс." },
    { name: "Соответствие теме", weight: "25%", desc: "Насколько раскрыта ключевая концепция джема." },
    { name: "Графика & Стиль", weight: "20%", desc: "Визуальная целостность и художественное исполнение." },
    { name: "Звуковое сопровождение", weight: "15%", desc: "Качество эмбиента, эффектов и музыки." },
    { name: "Оригинальность", weight: "10%", desc: "Инновационность задумки и уникальный опыт." }
  ],
  submissions: [
    {
      id: 1,
      slug: "brokenlore-follow",
      title: "BrokenLore: FOLLOW",
      author: "NocturnalDevs",
      authorHandle: "@nocturnal_dev",
      avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=nocturnal",
      image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop",
      short_desc: "Сюрреалистичный 3D-хоррор о путешествии сквозь заброшенные подстанции связи и архаичные терминалы в поисках утерянного сигнала.",
      platform: "WebGL & Windows",
      platforms: ["webgl", "windows"],
      has_webgl: true,
      genres: ["Хоррор", "3D", "Sci-Fi"],
      overallScore: 4.88,
      ratingCount: 42,
      rank: 1,
      is_frozen: true,
      is_results_published: true,
      awardBadges: ["1st Place - Gameplay", "Top 10"],
      status: "published"
    },
    {
      id: 2,
      slug: "quantum-core",
      title: "QUANTUM CORE",
      author: "Alexander Kael",
      authorHandle: "@kael_vostokov",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop",
      short_desc: "Минималистичная головоломка о перекоммутации энергоблоков квантового реактора с использованием винтажных патч-панелей.",
      platform: "WebGL",
      platforms: ["webgl"],
      has_webgl: true,
      genres: ["Пазл", "Sci-Fi"],
      overallScore: 4.75,
      ratingCount: 38,
      rank: 2,
      is_frozen: true,
      is_results_published: true,
      awardBadges: ["2nd Place - Overall", "Top 10"],
      status: "published"
    },
    {
      id: 3,
      slug: "void-drifter",
      title: "VOID DRIFTER",
      author: "Pixel Wave Studio",
      authorHandle: "@pixel_wave",
      avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=pixelwave",
      image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=600&auto=format&fit=crop",
      short_desc: "Ретро 2D платформамер с физикой притягивающего луча и возможностью управления векторной кинематикой маневровых двигателей.",
      platform: "Windows & macOS",
      platforms: ["windows", "mac"],
      has_webgl: false,
      genres: ["Платформер", "2D", "Ретро"],
      overallScore: 4.62,
      ratingCount: 29,
      rank: 3,
      is_frozen: true,
      is_results_published: true,
      awardBadges: ["3rd Place - Audio"],
      status: "published"
    }
  ],
  resultsData: {
    isResultsPublished: true,
    totalRatingsCount: 542,
    judgesCount: 12,
    categoryWinners: [
      { categoryId: "gameplay", categoryName: "Лучший Геймплей", icon: <Gamepad className="w-3.5 h-3.5" />, gameTitle: "BrokenLore: FOLLOW", author: "NocturnalDevs", score: "4.98", cover: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=400&auto=format&fit=crop" },
      { categoryId: "idea", categoryName: "Лучшая Идея / Концепция", icon: <Lightbulb className="w-3.5 h-3.5" />, gameTitle: "QUANTUM CORE", author: "Alexander Kael", score: "4.95", cover: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&auto=format&fit=crop" },
      { categoryId: "art", categoryName: "Лучший Арт и Визуал", icon: <Palette className="w-3.5 h-3.5" />, gameTitle: "VOID DRIFTER", author: "Pixel Wave Studio", score: "4.92", cover: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=400&auto=format&fit=crop" },
      { categoryId: "polish", categoryName: "Звук и Полировка", icon: <Music className="w-3.5 h-3.5" />, gameTitle: "BrokenLore: FOLLOW", author: "NocturnalDevs", score: "4.96", cover: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=400&auto=format&fit=crop" }
    ],
    leaderboard: [
      {
        id: 1,
        rank: 1,
        rankBadge: "1 МЕСТО",
        title: "BrokenLore: FOLLOW",
        slug: "brokenlore-follow",
        author: "NocturnalDevs",
        isTeam: true,
        avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=nocturnal",
        cover: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop",
        platforms: ["webgl", "windows"],
        totalScore: "4.95",
        scores: { gameplay: "4.98", idea: "4.90", art: "4.96", polish: "4.96" },
        votesCount: 42,
        isTieBreak: false,
        description: "Скоростной психологический хоррор с контролем кислорода в криокамерах заброшенной космической станции.",
        juryFeedback: [
          { judge: "Alexander Kael", role: "Lead Game Designer", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=80", comment: "Шедевральная интеграция механики контроля дыхания с визуальным стилем. Абсолютный лидер по геймплею." },
          { judge: "VoidSound", role: "Audio Producer", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=void", comment: "Процедурный аудио-дизайн дыхания протагониста держит в постоянном напряжении." }
        ]
      },
      {
        id: 2,
        rank: 2,
        rankBadge: "2 МЕСТО",
        title: "QUANTUM CORE",
        slug: "quantum-core",
        author: "Alexander Kael",
        isTeam: false,
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop",
        cover: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop",
        platforms: ["webgl"],
        totalScore: "4.88",
        scores: { gameplay: "4.85", idea: "4.95", art: "4.88", polish: "4.84" },
        votesCount: 38,
        isTieBreak: false,
        description: "Головоломка о переключении временных терминалов и протоколов управления монохромным терминалом.",
        juryFeedback: [
          { judge: "Maria Art", role: "3D & VFX Lead", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=80", comment: "Гениальное раскрытие темы джема. Идея с терминалом VT100 превзошла все ожидания." }
        ]
      },
      {
        id: 3,
        rank: 3,
        rankBadge: "3 МЕСТО",
        title: "VOID DRIFTER",
        slug: "void-drifter",
        author: "Pixel Wave Studio",
        isTeam: true,
        avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=pixelwave",
        cover: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=600&auto=format&fit=crop",
        platforms: ["windows", "linux"],
        totalScore: "4.82",
        scores: { gameplay: "4.80", idea: "4.82", art: "4.92", polish: "4.74" },
        votesCount: 29,
        isTieBreak: false,
        description: "Атмосферный симулятор дрейфа среди архаичных спутников в астероидном поясе.",
        juryFeedback: [
          { judge: "Maria Art", role: "3D & VFX Lead", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=80", comment: "Визуальные эффекты и освещение астероидов заслуживают отдельного упоминания!" }
        ]
      },
      {
        id: 4,
        rank: 4,
        rankBadge: "Top 10",
        title: "ECHOES OF THANATOS",
        slug: "echoes-of-thanatos",
        author: "CyberTeam One",
        isTeam: true,
        avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=cyberteam",
        cover: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop",
        platforms: ["webgl", "windows"],
        totalScore: "4.76",
        scores: { gameplay: "4.78", idea: "4.75", art: "4.74", polish: "4.77" },
        votesCount: 35,
        isTieBreak: true,
        tieBreakReason: "Победа по критерию 'Геймплей' (4.78 vs 4.70)",
        description: "Исследование реакторного отсека с ограниченным обзором и голосовым управлением.",
        juryFeedback: [
          { judge: "Alexander Kael", role: "Lead Game Designer", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=80", comment: "Отличный баланс сложности. Тай-брейк отдан за более глубокий геймплей." }
        ]
      },
      {
        id: 5,
        rank: 5,
        rankBadge: "Top 10",
        title: "NEON PROTOCOL 1984",
        slug: "neon-protocol-1984",
        author: "Alex_Code",
        isTeam: false,
        avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=alex",
        cover: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop",
        platforms: ["webgl"],
        totalScore: "4.76",
        scores: { gameplay: "4.70", idea: "4.82", art: "4.78", polish: "4.74" },
        votesCount: 31,
        isTieBreak: true,
        tieBreakReason: "Уступил по критерию 'Геймплей' #4 при равенстве итогового балла",
        description: "Текстово-графический детектив с эмуляцией перфокарт и магнитных лент.",
        juryFeedback: [
          { judge: "VoidSound", role: "Audio Producer", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=void", comment: "Атмосферный саундтрек 80-х и реалистичные щелчки реле." }
        ]
      },
      {
        id: 6,
        rank: 6,
        rankBadge: "Top 10",
        title: "RETRO RENDERER WASM",
        slug: "retro-renderer-wasm",
        author: "GameMaker_99",
        isTeam: false,
        avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=gm99",
        cover: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=600&auto=format&fit=crop",
        platforms: ["webgl", "windows", "macos"],
        totalScore: "4.65",
        scores: { gameplay: "4.60", idea: "4.70", art: "4.68", polish: "4.62" },
        votesCount: 24,
        isTieBreak: false,
        description: "Процедурный платформер на чисто векторных линиях в стиле осциллографов 70-х.",
        juryFeedback: []
      }
    ]
  }
};

// Список участников джема для автодополнения визиток
const JAM_PARTICIPANTS = [
  { handle: "@alex_code", name: "Alex_Code", role: "Developer", avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=alex" },
  { handle: "@nocturnal_dev", name: "NocturnalDevs", role: "Team Lead", avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=nocturnal" },
  { handle: "@elena_sound", name: "ElenaSound", role: "Audio Designer", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=elena" },
  { handle: "@maria_3d", name: "Maria Art", role: "3D Artist", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" },
  { handle: "@void_sound", name: "VoidSound", role: "Audio Producer", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=void" },
  { handle: "@cyberpulse", name: "CyberPulse Studio", role: "Developer", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=cyberpulse" },
  { handle: "@vaporware", name: "VaporWare", role: "Game Designer", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=vaporware" }
];

// Исходные темы сообщества с 3-уровневым деревом ответов
const INITIAL_DISCUSSIONS = [
  {
    id: 1,
    slug: "rules-webgl-incognito",
    title: "Правила сборки WebGL и проверки на инкогнито-режим в Unity/Godot",
    author: "Hubigr Studio",
    handle: "@hubigr_studio",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=hubigr",
    role: "Organizer",
    tag: "Объявления / FAQ",
    status: "Официально",
    isPinned: true,
    isLocked: false,
    date: "04 Июл 2026, 14:00",
    lastActivity: "Ответ от @hubigr_studio 10 минут назад",
    score: 42,
    viewsCount: 1280,
    repliesCount: 3,
    preview: "Инструкция по сборке в Unity/Godot и проверка локального сервера перед публикацией на HUBIGR.",
    fullText: "Уважаемые участники! Убедитесь, что ваш WebGL билд корректно работает без стороннего серверного контекста и проходит загрузку в чистом окне инкогнито браузера. Также проверьте сжатие Gzip/Brotli и настройки памяти VRAM.",
    createdTimestamp: Date.now() - 3600000 * 24,
    posts: [
      {
        id: 101,
        author: "Alex_Code",
        handle: "@alex_code",
        avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=alex",
        role: "Participant",
        date: "04 Июл, 14:30",
        score: 5,
        text: "Спасибо за совет! А сжатие Brotli поддерживается веб-шлюзом по умолчанию или нужно дополнительно настраивать `.htaccess`?",
        parentId: null,
        createdTimestamp: Date.now() - 3600000 * 20,
        isEdited: false,
        deleted: false,
        replies: [
          {
            id: 102,
            author: "Hubigr Studio",
            handle: "@hubigr_studio",
            avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=hubigr",
            role: "Organizer",
            date: "04 Июл, 14:45",
            score: 12,
            text: "Да, серверы HUBIGR автоматически распаковывают Brotli и Gzip контекст без необходимости настройки дополнительных конф-файлов.",
            parentId: 101,
            createdTimestamp: Date.now() - 3600000 * 18,
            isEdited: false,
            deleted: false,
            replies: [
              {
                id: 103,
                author: "Alex_Code",
                handle: "@alex_code",
                avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=alex",
                role: "Participant",
                date: "04 Июл, 15:00",
                score: 3,
                text: "Отлично, проверил на тестовом билде — загружается за 1.8 секунды!",
                parentId: 102,
                createdTimestamp: Date.now() - 3600000 * 16,
                isEdited: false,
                deleted: false,
                replies: []
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 2,
    slug: "third-party-assets-fmod",
    title: "Использование сторонних ассетов и коммерческих звуковых библиотек",
    author: "GameMaker_99",
    handle: "@gm99",
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=gm99",
    role: "Participant",
    tag: "Вопросы к организаторам",
    status: "Решено",
    isPinned: false,
    isLocked: false,
    date: "Вчера в 08:30",
    lastActivity: "Ответ от @kael_vostokov 1 час назад",
    score: 18,
    viewsCount: 450,
    repliesCount: 1,
    preview: "Подскажите, разрешено ли использовать готовые плагины FMOD и приобретенные ассет-паки?",
    fullText: "Подскажите, можно ли использовать готовые синтезаторы FMOD для генерации процедурного звука и покупать ассет-паки звуковых эффектов для джем-проекта?",
    createdTimestamp: Date.now() - 3600000 * 12,
    posts: [
      {
        id: 201,
        author: "Alexander Kael",
        handle: "@kael_vostokov",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop",
        role: "Jury",
        date: "Вчера в 09:15",
        score: 14,
        text: "Да, использование сторонних библиотек и коммерческих ассетов разрешено при наличии соответствующей коммерческой лицензии. Главное — указать их список в описании проекта.",
        parentId: null,
        createdTimestamp: Date.now() - 3600000 * 10,
        isEdited: true,
        deleted: false,
        replies: []
      }
    ]
  },
  {
    id: 3,
    slug: "forgotten-tech-wasm-ideas",
    title: "Идеи реализации концепции 'Забытые Технологии' на WASM",
    author: "PlayerOne",
    handle: "@player_one",
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=p1",
    role: "Participant",
    tag: "Идеи и Ресурсы",
    status: null,
    isPinned: false,
    isLocked: false,
    date: "Вчера в 19:40",
    lastActivity: "Создано вчера",
    score: 24,
    viewsCount: 620,
    repliesCount: 0,
    preview: "Отличная тема джема! Пробуем эмулировать терминал VT100 на чистом Rust и WebAssembly.",
    fullText: "Привет всем! Мы решили поэкспериментировать с векторным рендерингом монохромных терминалов VT100. Если у кого-то есть ссылки на исторические спецификации протоколов RS-232, делитесь в треде!",
    createdTimestamp: Date.now() - 3600000 * 5,
    posts: []
  }
];

// Исходные визитки
const INITIAL_CONTACT_CARDS = [
  {
    id: "card_1",
    sender: { name: "NocturnalDevs", handle: "@nocturnal_dev", avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=nocturnal" },
    recipient: { name: "Alex_Code", handle: "@alex_code", avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=alex" },
    email: "team@nocturnal.dev",
    telegram: "@nocturnal_dev",
    discord: "nocturnal#1337",
    website: "https://nocturnal.dev",
    note: "Привет! Будем рады обсудить коллаборацию по 3D графике и шейдерам на будущем джеме.",
    created_at: "Вчера в 16:20",
    is_read: true,
    is_revoked: false
  }
];

const INITIAL_LFG_POSTS = [
  {
    id: 101,
    author: "Alex_Code",
    avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=alex",
    role: "Participant",
    lfgType: "team",
    specialization: "2D/3D Художник",
    vacancies: ["2D/3D Художник", "Саунд-дизайнер / Композитор"],
    skills: ["Blender", "Low-poly", "Shader Graph"],
    portfolio: "artstation.com/alex_code",
    contacts: "@alex_code (Telegram)",
    text: "Ищем 2D/3D художника в команду для создания low-poly моделей окружения и концептов. Код и геймдизайн с нас.",
    score: 15
  },
  {
    id: 102,
    author: "ElenaSound",
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=elena",
    role: "Participant",
    lfgType: "solo",
    specialization: "Саунд-дизайнер / Композитор",
    skills: ["FMOD", "FL Studio", "Dark Ambient"],
    portfolio: "soundcloud.com/elena_sound",
    contacts: "Discord: elena_sound#4412",
    text: "Соло саунд-дизайнер. Напишу мрачный процедурный эмбиент и звуковые эффекты для вашего хоррора или инди-проекта.",
    score: 31
  }
];

const INITIAL_DEVLOGS = [
  {
    id: 201,
    title: "Как мы делали процессинг кислорода за 12 часов до дедлайна",
    author: "NocturnalDevs",
    avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=nocturnal",
    game: "BrokenLore: FOLLOW",
    date: "13.07.2026",
    thumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=400&auto=format&fit=crop",
    summary: "Разбор разработки ключевой механики задержки дыхания и управления баллонами O2 во время файт-сцен.",
    likes: 142,
    views: 980,
    commentsCount: 18
  }
];

export default function JamPage({ authState, setAuthState }: { authState?: string; setAuthState?: (val: string) => void }) {
  // --- DEV MATRIX СТЕЙТЫ ---
  const [localRole, setLocalRole] = useState('Participant');
  const role = authState || localRole;
  const setRole = (val: string) => {
    setLocalRole(val);
    if (setAuthState) setAuthState(val);
  };
  const [jamPhase, setJamPhase] = useState('Registration');
  const [userStatus, setUserStatus] = useState('NotRegistered');
  const [pageState, setPageState] = useState('Standard');

  // --- JAM ORGANIZER WORKSPACE STATE (FE-JORG-002) ---
  const [isOrganizerWorkspaceOpen, setIsOrganizerWorkspaceOpen] = useState(false);
  const verifiedPartners = useMemo(() => {
    return jamOrganizerService.getPartners('jam-123').filter(p => p.verificationStatus === 'verified');
  }, []);

  // --- COMMUNITY POSTING POLICY STATE ---
  const [communityPostingPolicy, setCommunityPostingPolicy] = useState('always_open');
  // options: 'always_open' | 'lock_on_end' | 'lock_on_voting_end' | 'manual'
  const [isReadOnlyOverride, setIsReadOnlyOverride] = useState(false);

  // Derived Read-only Status
  const isReadOnly = useMemo(() => {
    if (isReadOnlyOverride) return true;
    if (communityPostingPolicy === 'manual') return true;
    if (communityPostingPolicy === 'lock_on_end') {
      return jamPhase === 'Voting' || jamPhase === 'Finished';
    }
    if (communityPostingPolicy === 'lock_on_voting_end') {
      return jamPhase === 'Finished';
    }
    return false;
  }, [communityPostingPolicy, jamPhase, isReadOnlyOverride]);

  const isStaff = role === 'Organizer' || role === 'Admin' || role === 'Jury';

  // Главные табы и суб-табы сообщества
  const [activeTab, setActiveTab] = useState('overview');
  const [communitySubTab, setCommunitySubTab] = useState('discussion'); // 'discussion' | 'lfg' | 'devlogs' | 'contact_cards'

  // --- ЛОКАЛЬНЫЕ UI СТЕЙТЫ ОБСУЖДЕНИЙ ---
  const [selectedThreadId, setSelectedThreadId] = useState<number | null>(null);
  const [discussionSearchQuery, setDiscussionSearchQuery] = useState('');
  const [discussionTagFilter, setDiscussionTagFilter] = useState('All');
  const [discussionSortBy, setDiscussionSortBy] = useState('latest'); // 'latest' | 'newest' | 'popular'

  // Визитки
  const [contactCards, setContactCards] = useState(INITIAL_CONTACT_CARDS);
  const [targetRecipientHandle, setTargetRecipientHandle] = useState('@alex_code');
  const [cardEmail, setCardEmail] = useState('user@hubigr.dev');
  const [cardTelegram, setCardTelegram] = useState('@my_telegram');
  const [cardDiscord, setCardDiscord] = useState('my_discord#0001');
  const [cardWebsite, setCardWebsite] = useState('https://hubigr.dev');
  const [cardNote, setCardNote] = useState('');
  const [sentCardsCountThisHour, setSentCardsCountThisHour] = useState(1);

  // Голосование (votes map: { [postId]: 1 | -1 })
  const [postVotes, setPostVotes] = useState<Record<number, number>>({});

  // Редактирование сообщений
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  // Ответ на сообщение в дереве (parentId)
  const [replyingToPostId, setReplyingToPostId] = useState<number | null>(null);

  // Подписки
  const [isJamSubscribed, setIsJamSubscribed] = useState(false);
  const [subscribedThreadIds, setSubscribedThreadIds] = useState<number[]>([1]);
  const [showMobileStickyCta, setShowMobileStickyCta] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowMobileStickyCta(window.scrollY > 280);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- ЛОКАЛЬНЫЕ UI СТЕЙТЫ DRAWERS ---
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareActiveTab, setShareActiveTab] = useState('link');
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(null);

  // Фильтры и сортировки LFG & Devlogs
  const [lfgTypeFilter, setLfgTypeFilter] = useState('All');
  const [lfgRoleFilter, setLfgRoleFilter] = useState('All');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const roleDropdownRef = useRef<HTMLDivElement>(null);

  const [devlogSort, setDevlogSort] = useState('newest');
  const [submissionSort, setSubmissionSort] = useState('random');
  const [platformFilter, setPlatformFilter] = useState('All');
  const [genreFilter, setGenreFilter] = useState('All');
  const [submissionViewMode, setSubmissionViewMode] = useState<'grid' | 'list'>('grid');

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [expandedRuleIndex, setExpandedRuleIndex] = useState<number | null>(0);
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [submissionsPage, setSubmissionsPage] = useState(1);
  const SUBMISSIONS_PER_PAGE = 12;
  const [hideEntriesUntilEnd, setHideEntriesUntilEnd] = useState(false);
  const [bookmarkedGames, setBookmarkedGames] = useState<Record<number, boolean>>({});
  const [collectionGameJam, setCollectionGameJam] = useState<any | null>(null);
  const [votingModalGame, setVotingModalGame] = useState<any | null>(null);
  const [votingScores, setVotingScores] = useState({ gameplay: 5, theme: 4, graphics: 5, audio: 4, originality: 5 });

  // Mock collections data
  const mockCollections = [
    { id: 'col_1', title: 'Избранное', games_count: 12 },
    { id: 'col_2', title: 'Играть позже', games_count: 8 },
    { id: 'col_3', title: 'Инди-хорроры 2026', games_count: 5 }
  ];
  const [activeContextMenuSubId, setActiveContextMenuSubId] = useState<number | null>(null);

  // Внешняя поддержка призового фонда джема (FE-CSP-004, AC-CSP-013, BR-CSP-018, BR-CSP-020)
  const [selectedJamSupportUrl, setSelectedJamSupportUrl] = useState<string | null>(null);
  const [selectedJamSupportPlatform, setSelectedJamSupportPlatform] = useState<string>('Boosty оргкомитета');

  // Формы
  const [regFormat, setRegFormat] = useState('solo');
  const [selectedTeam, setSelectedTeam] = useState('CyberTeam One');
  const [regAgreed, setRegAgreed] = useState(false);

  const [selectedUserGame, setSelectedUserGame] = useState('BrokenLore: FOLLOW');
  const [submitNote, setSubmitNote] = useState('');
  const [submitConfirmed, setSubmitConfirmed] = useState(false);

  const [lfgType, setLfgType] = useState('solo');
  const [lfgSpecialization, setLfgSpecialization] = useState('Программист');
  const [lfgPortfolio, setLfgPortfolio] = useState('');
  const [lfgContacts, setLfgContacts] = useState('');
  const [lfgDescription, setLfgDescription] = useState('');

  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadTag, setNewThreadTag] = useState('Вопросы к организаторам');
  const [newThreadText, setNewThreadText] = useState('');

  const [newReplyText, setNewReplyText] = useState('');

  const [newDevlogTitle, setNewDevlogTitle] = useState('');
  const [newDevlogSummary, setNewDevlogSummary] = useState('');

  const [reportReason, setReportReason] = useState('rules');
  const [reportText, setReportComment] = useState('');

  // Списки данных
  const [discussionsList, setDiscussionsList] = useState(INITIAL_DISCUSSIONS);
  const [lfgList, setLfgList] = useState(INITIAL_LFG_POSTS);
  const [devlogsList, setDevlogsList] = useState(INITIAL_DEVLOGS);

  const [likedLogs, setLikedLogs] = useState<Record<number, boolean>>({});

  // --- СТЕЙТЫ ДЛЯ ТАБА ИТОГОВ ---
  const [resultsSearchQuery, setResultsSearchQuery] = useState('');
  const [resultsCriteriaFilter, setResultsCriteriaFilter] = useState('overall');
  const [resultsViewMode, setResultsViewMode] = useState<'table' | 'grid'>('table');
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
  const leaderboardRef = useRef<HTMLDivElement | null>(null);

  // Таймер
  const [timeLeft, setTimeLeft] = useState({ days: 12, hours: 14, minutes: 59, seconds: 46 });

  // Toast
  const { showToast } = useToast();
  const triggerToast = (msg: string, type: any = 'info') => {
    showToast(msg, type === 'error' ? 'danger' : type);
  };

  const handleToggleBookmark = (gameId: number, title: string) => {
    setBookmarkedGames(prev => {
      const isBookmarked = !!prev[gameId];
      triggerToast(isBookmarked ? `"${title}" удалено из Закладок` : `"${title}" добавлено в Закладки`, 'success');
      return { ...prev, [gameId]: !isBookmarked };
    });
  };

  const handleOpenGameDetail = (slug?: string) => {
    const gameSlug = slug || 'brokenlore-follow';
    const targetPath = `/jams/${JAM_DATA.slug}/${gameSlug}`;
    console.log('Navigating to jam game detail:', targetPath);
    console.log('__hubigrNavigate exists:', !!window.__hubigrNavigate);
    
    if (typeof window.__hubigrNavigate === 'function') {
      console.log('Using __hubigrNavigate');
      window.__hubigrNavigate(targetPath);
    } else {
      console.log('Using hash fallback');
      window.location.hash = `#${targetPath}`;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyLink = (textToCopy?: string, customSuccessMsg?: string) => {
    const el = document.createElement('textarea');
    el.value = textToCopy || window.location.href;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    try {
      document.execCommand('copy');
      triggerToast(customSuccessMsg || 'Ссылка скопирована в буфер обмена!', 'success');
    } catch (err) {
      triggerToast('Не удалось скопировать данные', 'error');
    }
    document.body.removeChild(el);
  };

  // --- ХЕНДЛЕРЫ СООБЩЕСТВА ---
  const handleCreateThread = () => {
    if (!newThreadTitle.trim() || !newThreadText.trim()) {
      triggerToast('Заполните заголовок и текст темы', 'warning');
      return;
    }
    if (role === 'Guest') {
      triggerToast('Войдите в аккаунт для создания темы', 'warning');
      return;
    }
    if (isReadOnly && !isStaff) {
      triggerToast('Сообщество находится в режиме чтения. Создание тем запрещено.', 'warning');
      return;
    }

    const newId = Date.now();
    const newEntry = {
      id: newId,
      slug: `thread-${newId}`,
      title: newThreadTitle,
      author: role === 'Organizer' ? "Hubigr Studio" : "Текущий Пользователь",
      handle: role === 'Organizer' ? "@hubigr_studio" : "@current_user",
      avatar: role === 'Organizer' ? "https://api.dicebear.com/7.x/bottts/svg?seed=hubigr" : "https://api.dicebear.com/7.x/identicon/svg?seed=user",
      role: role,
      tag: newThreadTag,
      status: null,
      isPinned: false,
      isLocked: false,
      date: "Только что",
      lastActivity: "Создано только что",
      score: 1,
      viewsCount: 1,
      repliesCount: 0,
      preview: newThreadText.slice(0, 110) + "...",
      fullText: newThreadText,
      createdTimestamp: Date.now(),
      posts: []
    };

    setDiscussionsList([newEntry, ...discussionsList]);
    setSubscribedThreadIds(prev => [...prev, newId]);
    setNewThreadTitle('');
    setNewThreadText('');
    setActiveDrawer(null);
    triggerToast('Ваша тема успешно опубликована!', 'success');
  };

  const handleSendReplyInThread = (targetParentId: number | null = null) => {
    if (!newReplyText.trim()) return;
    if (role === 'Guest') {
      triggerToast('Войдите в аккаунт для ответа', 'warning');
      return;
    }
    if (isReadOnly && !isStaff) {
      triggerToast('Сообщество находится в режиме чтения. Отправка сообщений запрещена.', 'warning');
      return;
    }

    const currentThread = discussionsList.find(t => t.id === selectedThreadId);
    if (currentThread?.isLocked && !isStaff) {
      triggerToast('Эта тема закрыта для новых ответов', 'warning');
      return;
    }

    const replyObj = {
      id: Date.now(),
      author: role === 'Organizer' ? "Hubigr Studio" : "Текущий Пользователь",
      handle: role === 'Organizer' ? "@hubigr_studio" : "@current_user",
      avatar: role === 'Organizer' ? "https://api.dicebear.com/7.x/bottts/svg?seed=hubigr" : "https://api.dicebear.com/7.x/identicon/svg?seed=user",
      role: role,
      date: "Только что",
      score: 1,
      text: newReplyText,
      parentId: targetParentId,
      createdTimestamp: Date.now(),
      isEdited: false,
      deleted: false,
      replies: []
    };

    setDiscussionsList(prev => prev.map(t => {
      if (t.id === selectedThreadId) {
        if (!targetParentId) {
          return {
            ...t,
            repliesCount: t.repliesCount + 1,
            lastActivity: "Ответ опубликован только что",
            posts: [...t.posts, replyObj]
          };
        } else {
          // Recursive insert into nested posts
          const insertNested = (postsList: any[]): any[] => {
            return postsList.map(p => {
              if (p.id === targetParentId) {
                return { ...p, replies: [...(p.replies || []), replyObj] };
              }
              if (p.replies && p.replies.length > 0) {
                return { ...p, replies: insertNested(p.replies) };
              }
              return p;
            });
          };
          return {
            ...t,
            repliesCount: t.repliesCount + 1,
            lastActivity: "Ответ опубликован только что",
            posts: insertNested(t.posts)
          };
        }
      }
      return t;
    }));

    setNewReplyText('');
    setReplyingToPostId(null);
    triggerToast('Ответ опубликован!', 'success');
  };

  const handlePostVote = (postId: number, direction: 1 | -1) => {
    const currentVote = postVotes[postId] || 0;
    const newVote = currentVote === direction ? 0 : direction;

    setPostVotes(prev => ({ ...prev, [postId]: newVote }));
    triggerToast(newVote === 1 ? 'Голос "За" зафиксирован' : newVote === -1 ? 'Голос "Против" зафиксирован' : 'Голос отменен', 'info');
  };

  const handleSavePostEdit = (postId: number) => {
    if (!editText.trim()) return;
    
    const updatePostText = (postsList: any[]): any[] => {
      return postsList.map(p => {
        if (p.id === postId) {
          return { ...p, text: editText, isEdited: true };
        }
        if (p.replies && p.replies.length > 0) {
          return { ...p, replies: updatePostText(p.replies) };
        }
        return p;
      });
    };

    setDiscussionsList(prev => prev.map(t => {
      if (t.id === selectedThreadId) {
        return { ...t, posts: updatePostText(t.posts) };
      }
      return t;
    }));

    setEditingPostId(null);
    setEditText('');
    triggerToast('Сообщение отредактировано', 'success');
  };

  const handleSoftDeletePost = (postId: number) => {
    const markDeleted = (postsList: any[]): any[] => {
      return postsList.map(p => {
        if (p.id === postId) {
          return { ...p, deleted: true, text: 'Сообщение удалено модератором' };
        }
        if (p.replies && p.replies.length > 0) {
          return { ...p, replies: markDeleted(p.replies) };
        }
        return p;
      });
    };

    setDiscussionsList(prev => prev.map(t => {
      if (t.id === selectedThreadId) {
        return { ...t, posts: markDeleted(t.posts) };
      }
      return t;
    }));

    triggerToast('Сообщение софт-удалено модератором', 'warning');
  };

  const handleTogglePinThread = (threadId: number) => {
    setDiscussionsList(prev => prev.map(t => t.id === threadId ? { ...t, isPinned: !t.isPinned } : t));
    triggerToast('Статус закрепления темы изменен', 'info');
  };

  const handleToggleLockThread = (threadId: number) => {
    setDiscussionsList(prev => prev.map(t => t.id === threadId ? { ...t, isLocked: !t.isLocked } : t));
    triggerToast('Статус блокировки темы изменен', 'info');
  };

  const handleSendContactCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (sentCardsCountThisHour >= 5) {
      triggerToast('Превышен лимит отправки визиток (не более 5 в час)', 'error');
      return;
    }
    const targetObj = JAM_PARTICIPANTS.find(p => p.handle === targetRecipientHandle) || {
      name: targetRecipientHandle.replace('@', ''),
      handle: targetRecipientHandle,
      avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=target"
    };

    const newCard = {
      id: `card_${Date.now()}`,
      sender: { name: "Текущий Пользователь", handle: "@current_user", avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=user" },
      recipient: targetObj,
      email: cardEmail,
      telegram: cardTelegram,
      discord: cardDiscord,
      website: cardWebsite,
      note: cardNote,
      created_at: "Только что",
      is_read: false,
      is_revoked: false
    };

    setContactCards([newCard, ...contactCards]);
    setSentCardsCountThisHour(prev => prev + 1);
    setActiveDrawer(null);
    setCardNote('');
    triggerToast(`Визитка успешно отправлена участнику ${targetRecipientHandle}!`, 'success');
  };

  const handleRecallContactCard = (cardId: string) => {
    setContactCards(prev => prev.map(c => c.id === cardId ? { ...c, is_revoked: true } : c));
    triggerToast('Визитка успешно отозвана', 'warning');
  };

  const handlePublishLfg = () => {
    if (!lfgDescription.trim() || !lfgContacts.trim()) {
      triggerToast('Заполните описание и контакты связи', 'warning');
      return;
    }
    const newLfgPost = {
      id: Date.now(),
      author: "Текущий Пользователь",
      avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=user",
      role: role,
      lfgType: lfgType,
      specialization: lfgSpecialization,
      skills: ["C#", "Unity", "WebGL"],
      portfolio: lfgPortfolio || "github.com/my_project",
      contacts: lfgContacts,
      text: lfgDescription,
      score: 1
    };

    setLfgList([newLfgPost, ...lfgList]);
    setActiveDrawer(null);
    setLfgDescription('');
    setLfgContacts('');
    setLfgPortfolio('');
    setActiveTab('community');
    setCommunitySubTab('lfg');
    triggerToast('Объявление LFG зафиксировано!', 'success');
  };

  const handlePublishDevlog = () => {
    if (!newDevlogTitle.trim() || !newDevlogSummary.trim()) {
      triggerToast('Заполните заголовок и краткое содержание', 'warning');
      return;
    }
    const newEntry = {
      id: Date.now(),
      title: newDevlogTitle,
      author: "Текущий Пользователь",
      avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=user",
      game: selectedUserGame,
      date: "Сегодня",
      thumbnail: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=400&auto=format&fit=crop",
      summary: newDevlogSummary,
      likes: 1,
      views: 12,
      commentsCount: 0
    };
    setDevlogsList([newEntry, ...devlogsList]);
    setActiveDrawer(null);
    setNewDevlogTitle('');
    setNewDevlogSummary('');
    setActiveTab('community');
    setCommunitySubTab('devlogs');
    triggerToast('Запись DevLog создана!', 'success');
  };

  const toggleLikeDevlog = (id: number) => {
    setLikedLogs(prev => {
      const isLiked = !!prev[id];
      setDevlogsList(devlogsList.map(log => log.id === id ? { ...log, likes: isLiked ? log.likes - 1 : log.likes + 1 } : log));
      return { ...prev, [id]: !isLiked };
    });
  };

  const filteredDiscussions = useMemo(() => {
    let list = [...(discussionsList || [])];

    if (discussionSearchQuery.trim()) {
      const q = discussionSearchQuery.toLowerCase();
      list = list.filter(d => 
        d.title.toLowerCase().includes(q) || 
        d.preview.toLowerCase().includes(q) ||
        d.fullText.toLowerCase().includes(q) ||
        d.author.toLowerCase().includes(q)
      );
    }

    if (discussionTagFilter !== 'All') {
      list = list.filter(d => d.tag === discussionTagFilter);
    }

    if (discussionSortBy === 'newest') {
      list.sort((a, b) => b.createdTimestamp - a.createdTimestamp);
    } else if (discussionSortBy === 'popular') {
      list.sort((a, b) => b.repliesCount - a.repliesCount);
    } else {
      // latest activity
      list.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0) || b.createdTimestamp - a.createdTimestamp);
    }

    return list;
  }, [discussionsList, discussionSearchQuery, discussionTagFilter, discussionSortBy]);

  const activeThread = useMemo(() => {
    if (!selectedThreadId) return null;
    return (discussionsList || []).find(t => t.id === selectedThreadId) || null;
  }, [discussionsList, selectedThreadId]);

  const filteredLfg = useMemo(() => {
    let list = [...(lfgList || [])];
    if (lfgTypeFilter !== 'All') {
      list = list.filter(l => l.lfgType === lfgTypeFilter);
    }
    if (lfgRoleFilter !== 'All') {
      list = list.filter(l => {
        const spec = (l.specialization || '').toLowerCase();
        const vacs = (l.vacancies || []).map(v => v.toLowerCase()).join(' ');
        const target = lfgRoleFilter.toLowerCase();
        return spec.includes(target) || vacs.includes(target);
      });
    }
    return list;
  }, [lfgList, lfgTypeFilter, lfgRoleFilter]);

  const filteredDevlogs = useMemo(() => {
    let list = [...(devlogsList || [])];
    if (devlogSort === 'popular') {
      list.sort((a, b) => b.likes - a.likes);
    } else if (devlogSort === 'trending') {
      list.sort((a, b) => b.views - a.views);
    } else {
      list.sort((a, b) => b.id - a.id);
    }
    return list;
  }, [devlogsList, devlogSort]);

  const sortedSubmissions = useMemo(() => {
    let list = [...JAM_DATA.submissions];
    if (platformFilter !== 'All') {
      list = list.filter(s => s.platform.includes(platformFilter));
    }
    if (genreFilter !== 'All') {
      list = list.filter(s => s.genres.includes(genreFilter));
    }
    if (jamPhase === 'Finished') {
      list.sort((a, b) => (a.rank || 99) - (b.rank || 99));
    } else if (submissionSort === 'date') {
      list.sort((a, b) => b.id - a.id);
    } else if (submissionSort === 'name') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }
    return list;
  }, [jamPhase, submissionSort, platformFilter, genreFilter]);

  // Пагинация для submissions
  const paginatedSubmissions = useMemo(() => {
    const startIndex = (submissionsPage - 1) * SUBMISSIONS_PER_PAGE;
    return sortedSubmissions.slice(startIndex, startIndex + SUBMISSIONS_PER_PAGE);
  }, [sortedSubmissions, submissionsPage]);

  const totalSubmissionsPages = Math.ceil(sortedSubmissions.length / SUBMISSIONS_PER_PAGE);

  // Фильтрация leaderboard для таба Итогов
  const filteredLeaderboard = useMemo(() => {
    let list = [...(JAM_DATA.resultsData?.leaderboard || [])];

    if (resultsSearchQuery.trim()) {
      const q = resultsSearchQuery.toLowerCase();
      list = list.filter(item => 
        item.title.toLowerCase().includes(q) || 
        item.author.toLowerCase().includes(q)
      );
    }

    if (resultsCriteriaFilter !== 'overall') {
      list.sort((a, b) => {
        const scoreA = parseFloat(a.scores[resultsCriteriaFilter] || '0');
        const scoreB = parseFloat(b.scores[resultsCriteriaFilter] || '0');
        return scoreB - scoreA;
      });
    } else {
      list.sort((a, b) => a.rank - b.rank);
    }

    return list;
  }, [resultsSearchQuery, resultsCriteriaFilter]);

  const handleCategoryWinnerClick = (categoryId: string) => {
    setResultsCriteriaFilter(categoryId);
    triggerToast(`Фильтр переключен на критерий "${categoryId}"`, 'info');
    if (leaderboardRef.current) {
      leaderboardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };


  const renderMedalBadge = (rank: number) => {
    if (!rank || rank > 3) return null;
    if (rank === 1) {
      return (
        <span className="bg-accent/15 border border-accent text-accent font-mono text-caption font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-elevation-raised select-none">
          <Trophy className="w-3.5 h-3.5 fill-current text-accent" />
          <span>1 МЕСТО</span>
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="bg-surface-3 border border-borderStrong text-textPrimary font-mono text-caption font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 select-none">
          <Award className="w-3.5 h-3.5 text-textPrimary" />
          <span>2 МЕСТО</span>
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="bg-warning/15 border border-warning text-warning font-mono text-caption font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 select-none">
          <Award className="w-3.5 h-3.5 text-warning" />
          <span>3 МЕСТО</span>
        </span>
      );
    }
    return null;
  };

  // Рекурсивный рендер постов дерева сообщений до 3-х уровней вложенности
  const renderPostTree = (postList: any[], level = 1) => {
    return postList.map(post => {
      const netScore = post.score + (postVotes[post.id] || 0);
      const userVote = postVotes[post.id] || 0;
      const isAuthorWindowActive = Date.now() - post.createdTimestamp < 15 * 60 * 1000;
      const canEdit = post.author === "Текущий Пользователь" ? isAuthorWindowActive : isStaff;

      return (
        <div 
          key={post.id} 
          className={`flex flex-col gap-2 ${
            level === 1 
              ? 'pt-2' 
              : 'ml-4 sm:ml-10 pl-4 sm:pl-6 border-l-2 border-borderDef'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <img src={post.avatar} alt={post.author} className="w-8 h-8 rounded-full shrink-0" />
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-body-sm text-white">{post.author}</span>
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                    post.role === 'Organizer' 
                      ? 'text-accent' 
                      : post.role === 'Jury' 
                      ? 'text-purple-400' 
                      : 'text-textTertiary'
                  }`}>
                    {post.role !== 'Guest' && post.role !== 'Participant' && post.role}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-caption font-mono text-textTertiary">
                  <span>{post.date}</span>
                  {post.isEdited && <span className="text-accent">&bull; ред.</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* VOTE BUTTONS */}
              <div className="flex items-center text-caption font-mono">
                <button 
                  onClick={() => handlePostVote(post.id, 1)} 
                  className={`p-1 hover:text-accent transition-colors cursor-pointer ${userVote === 1 ? 'text-accent' : 'text-textTertiary'}`}
                  title="Голос За"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                </button>
                <span className={`px-1 font-bold ${netScore > 0 ? 'text-success' : netScore < 0 ? 'text-danger' : 'text-textTertiary'}`}>
                  {netScore}
                </span>
                <button 
                  onClick={() => handlePostVote(post.id, -1)} 
                  className={`p-1 hover:text-danger transition-colors cursor-pointer ${userVote === -1 ? 'text-danger' : 'text-textTertiary'}`}
                  title="Голос Против"
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* EDIT BUTTON */}
              {canEdit && !post.deleted && (
                <button 
                  onClick={() => { setEditingPostId(post.id); setEditText(post.text); }}
                  className="p-1 text-textTertiary hover:text-white transition-colors cursor-pointer"
                  title="Редактировать сообщение"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              )}

              {/* MOD DELETE BUTTON */}
              {isStaff && !post.deleted && (
                <button 
                  onClick={() => handleSoftDeletePost(post.id)}
                  className="p-1 text-textTertiary hover:text-danger transition-colors cursor-pointer"
                  title="Удалить сообщение"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* POST CONTENT OR EDIT FORM */}
          {editingPostId === post.id ? (
            <div className="space-y-2 pt-1 pl-11">
              <textarea 
                value={editText}
                onChange={e => setEditText(e.target.value)}
                className="w-full bg-transparent border-b border-borderDef focus:border-accent text-white py-2 text-body-sm outline-none font-sans resize-none transition-colors no-global-focus"
                rows={3}
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => setEditingPostId(null)} className="px-3 py-1.5 text-body-sm text-textTertiary hover:text-white hover:bg-surface-2 rounded-control cursor-pointer transition-colors">
                  Отмена
                </button>
                <button onClick={() => handleSavePostEdit(post.id)} className="px-3 py-1.5 text-body-sm text-accent hover:text-accent-hover hover:bg-accent/10 font-bold rounded-control cursor-pointer transition-colors">
                  Сохранить
                </button>
              </div>
            </div>
          ) : (
            <div className={`text-body-sm font-sans pl-11 ${post.deleted ? 'text-textTertiary italic' : 'text-textSecondary'}`}>
              {post.text}
            </div>
          )}

          {/* ACTIONS & NESTED REPLY TRIGGER */}
          {!post.deleted && level < 3 && (!isReadOnly || isStaff) && (
            <div className="flex items-center gap-3 pt-1 pl-11 text-caption font-mono text-textTertiary">
              <button 
                onClick={() => setReplyingToPostId(replyingToPostId === post.id ? null : post.id)} 
                className="hover:text-white transition-colors flex items-center gap-1.5 font-semibold cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Ответить</span>
              </button>
            </div>
          )}

          {/* INLINE NESTED REPLY INPUT FORM */}
          {replyingToPostId === post.id && (
            <div className="mt-2 ml-11 space-y-2 animate-fadeIn">
              <textarea 
                value={newReplyText}
                onChange={e => setNewReplyText(e.target.value)}
                placeholder={`Ответ ${post.author}...`}
                className="w-full bg-transparent border-b border-borderDef focus:border-accent text-white py-2 text-body-sm outline-none font-sans resize-none transition-colors no-global-focus"
                rows={2}
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => setReplyingToPostId(null)} className="px-3 py-1.5 text-body-sm text-textTertiary hover:text-white hover:bg-surface-2 rounded-control cursor-pointer transition-colors">
                  Отмена
                </button>
                <button onClick={() => handleSendReplyInThread(post.id)} className="px-3 py-1.5 text-body-sm text-accent hover:text-accent-hover hover:bg-accent/10 font-bold rounded-control cursor-pointer transition-colors">
                  Отправить
                </button>
              </div>
            </div>
          )}

          {/* RECURSIVE REPLIES RENDER */}
          {post.replies && post.replies.length > 0 && (
            <div className="mt-2 space-y-4">
              {renderPostTree(post.replies, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };


  const jamThemeSchedule = useMemo(() => {
    return {
      start_at: jamPhase === 'Announcement' || jamPhase === 'Registration' 
        ? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
        : jamPhase === 'InProgress'
        ? new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        : jamPhase === 'Voting' || jamPhase === 'Finished'
        ? new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      end_at: jamPhase === 'Finished'
        ? new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        : new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
    };
  }, [jamPhase]);

  return (
    <div className="min-h-screen bg-surface-0 text-textSecondary font-sans relative antialiased select-none pb-44 md:pb-24">
      <FontStyles />

      {/* DEV MATRIX CONTROL PANEL */}
      <DevMatrixPanel 
        bottomOffsetClass="bottom-36 md:bottom-0"
        pageName="Страница джема (/jams/broken-worlds-jam)"
        fields={[
          {
            id: 'role',
            label: 'Роль',
            type: 'select',
            value: role,
            onChange: setRole,
            options: [
              { value: 'Guest', label: 'Guest (Гость)' },
              { value: 'Participant', label: 'Participant (Участник)' },
              { value: 'Jury', label: 'Jury (Жюри)' },
              { value: 'Organizer', label: 'Organizer (Организатор)' }
            ]
          },
          {
            id: 'jamPhase',
            label: 'Фаза',
            type: 'select',
            value: jamPhase,
            onChange: setJamPhase,
            highlight: true,
            options: [
              { value: 'Announcement', label: '1. Announcement (Анонс)' },
              { value: 'Registration', label: '2. Registration (Регистрация)' },
              { value: 'InProgress', label: '3. InProgress (Разработка)' },
              { value: 'Voting', label: '4. Voting (Голосование)' },
              { value: 'Finished', label: '5. Finished (Завершен)' }
            ]
          },
          {
            id: 'communityPostingPolicy',
            label: 'Политика сообщества',
            type: 'select',
            value: communityPostingPolicy,
            onChange: setCommunityPostingPolicy,
            highlight: true,
            options: [
              { value: 'always_open', label: 'Всегда открыто' },
              { value: 'lock_on_end', label: 'Read-only после разработки' },
              { value: 'lock_on_voting_end', label: 'Read-only после голосования' },
              { value: 'manual', label: 'Ручная блокировка (Manual)' }
            ]
          },
          {
            id: 'isReadOnlyOverride',
            label: 'Read-Only режим',
            type: 'buttons',
            value: isReadOnlyOverride ? 'yes' : 'no',
            onChange: (val) => setIsReadOnlyOverride(val === 'yes'),
            options: [
              { value: 'no', label: 'Выкл' },
              { value: 'yes', label: 'Вкл (Тест)' }
            ]
          }
        ]}
      />

      {/* ORGANIZER TOP ACTION BAR (FE-JORG-002, AC-JORG-006) */}
      {role === 'Organizer' && (
        <div className="bg-surface-2/95 backdrop-blur-md border-b border-accent/40 px-4 md:px-8 py-3 sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-body-sm font-bold text-textPrimary">Панель управления организатора</span>
                <Badge variant="accent">Organizer Mode</Badge>
              </div>
              <p className="text-caption text-textTertiary hidden sm:block">
                Управление модерацией работ, составом жюри, партнерами, призами и аналитикой
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => setIsOrganizerWorkspaceOpen(true)}
              className="flex items-center gap-2 font-bold shadow-glow"
            >
              <Briefcase className="w-4 h-4" />
              <span>Рабочее место организатора (Workspace)</span>
            </Button>
          </div>
        </div>
      )}

      {/* HEADER HERO BLOCK */}
      {pageState !== 'Error' && (
        <>
          <div className="relative w-full bg-surface-1 border-b border-borderDef overflow-hidden">
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img src={JAM_DATA.cover} alt="Cover" className="w-full h-full object-cover opacity-45 scale-105 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-0 via-surface-0/60 to-surface-0/30" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-surface-0/50 to-surface-0" />
            </div>

            <div className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-8 py-12 md:py-16 2xl:py-20 flex flex-col items-center text-center">
              
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-accent/15 border border-accent/30 text-accent text-caption font-bold px-3 py-1 rounded tracking-wide">
                  Официальный Джем HUBIGR
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-textPrimary tracking-tight mb-3 sm:mb-4 leading-[1.1] text-center">
                {JAM_DATA.title}
              </h1>

              <p className="text-xs sm:text-sm md:text-body text-textSecondary max-w-xl mb-6 sm:mb-10 text-center leading-relaxed">
                {JAM_DATA.subtitle}
              </p>

              {/* ДИНАМИЧЕСКАЯ PRIMARY CTA ПО ФАЗЕ */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 mb-6 w-full sm:w-auto">
                {(jamPhase === 'Announcement' || jamPhase === 'Registration') && userStatus === 'NotRegistered' ? (
                  <button 
                    onClick={() => setActiveDrawer('register')}
                    className="h-11 sm:h-12 px-6 sm:px-8 bg-accent hover:bg-accent-hover text-white font-extrabold text-xs sm:text-body-sm tracking-wide rounded-xl transition-all active:scale-[0.98] cursor-pointer shadow-elevation-raised flex items-center justify-center gap-2 border-none touch-manipulation"
                  >
                    <Trophy className="w-4 h-4" />
                    <span>Зарегистрироваться на джем</span>
                  </button>
                ) : (jamPhase === 'InProgress' && userStatus === 'Registered') || (jamPhase === 'Registration' && userStatus === 'Registered') ? (
                  <button 
                    onClick={() => {
                      if ((window as any).__hubigrNavigate) {
                        (window as any).__hubigrNavigate(`/jams/${JAM_DATA.slug}/submit`);
                      } else {
                        window.location.hash = `#/jams/${JAM_DATA.slug}/submit`;
                      }
                    }}
                    className="h-11 sm:h-12 px-6 sm:px-8 bg-accent hover:bg-accent-hover text-white font-extrabold text-xs sm:text-body-sm tracking-wide rounded-xl transition-all active:scale-[0.98] cursor-pointer shadow-elevation-raised flex items-center justify-center gap-2 border-none touch-manipulation"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Подать работу</span>
                  </button>
                ) : jamPhase === 'Voting' ? (
                  <button 
                    onClick={() => setActiveTab('submissions')}
                    className="h-11 sm:h-12 px-6 sm:px-8 bg-accent hover:bg-accent-hover text-white font-extrabold text-xs sm:text-body-sm tracking-wide rounded-xl transition-all active:scale-[0.98] cursor-pointer shadow-elevation-raised flex items-center justify-center gap-2 border-none touch-manipulation"
                  >
                    <Star className="w-4 h-4" />
                    <span>Оценить проекты</span>
                  </button>
                ) : jamPhase === 'Results' ? (
                  <button 
                    onClick={() => setActiveTab('results')}
                    className="h-11 sm:h-12 px-6 sm:px-8 bg-accent hover:bg-accent-hover text-white font-extrabold text-xs sm:text-body-sm tracking-wide rounded-xl transition-all active:scale-[0.98] cursor-pointer shadow-elevation-raised flex items-center justify-center gap-2 border-none touch-manipulation"
                  >
                    <Trophy className="w-4 h-4" />
                    <span>Смотреть победителей</span>
                  </button>
                ) : userStatus === 'Registered' && jamPhase === 'Registration' ? (
                  <div className="flex items-center justify-center gap-2 text-success text-xs sm:text-body-sm font-semibold py-2">
                    <Check className="w-4 h-4" />
                    <span>Вы зарегистрированы на джем</span>
                  </div>
                ) : null}

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button 
                    onClick={() => setActiveDrawer('lfg')}
                    className="flex-1 sm:flex-initial h-11 sm:h-12 px-5 sm:px-6 bg-surface-2 hover:bg-surface-3 border border-borderDef text-textPrimary hover:text-accent font-bold text-xs sm:text-body-sm tracking-wide rounded-xl transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 touch-manipulation"
                  >
                    <Users className="w-4 h-4" />
                    <span>Найти команду</span>
                  </button>

                  <button 
                    onClick={() => setIsShareModalOpen(true)}
                    className="h-11 sm:h-12 w-11 sm:w-12 shrink-0 bg-surface-2 hover:bg-surface-3 border border-borderDef text-textSecondary hover:text-accent rounded-xl transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center touch-manipulation"
                    aria-label="Поделиться джемом"
                    title="Поделиться"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                {role === 'Organizer' && (
                  <button 
                    onClick={() => setIsOrganizerWorkspaceOpen(true)}
                    className="h-11 sm:h-12 px-5 sm:px-6 bg-accent/20 hover:bg-accent/30 border border-accent/50 text-accent font-extrabold text-xs sm:text-body-sm tracking-wide rounded-xl transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 touch-manipulation"
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>Управление джемом (Workspace)</span>
                  </button>
                )}
              </div>

              {/* Упрощенный фазовый индикатор (Единая скроллируемая линия) */}
              <div className="flex items-center justify-start sm:justify-center gap-3 sm:gap-4 text-caption text-textSecondary select-none w-full max-w-full overflow-x-auto no-scrollbar pb-2 sm:pb-0">
                
                {/* Фаза 1 */}
                <div className={`flex items-center gap-1.5 sm:gap-2 shrink-0 ${jamPhase === 'Announcement' || jamPhase === 'Registration' ? 'text-accent font-bold' : ''}`}>
                  <span className={`w-2 h-2 rounded-full ${jamPhase === 'Announcement' || jamPhase === 'Registration' ? 'bg-accent ring-4 ring-accent/20' : 'bg-surface-3'}`} />
                  <span className="text-[11px] sm:text-xs">РЕГИСТРАЦИЯ</span>
                </div>
                
                <span className="text-textDisabled shrink-0">&bull;</span>

                {/* Фаза 2 */}
                <div className={`flex items-center gap-1.5 sm:gap-2 shrink-0 ${jamPhase === 'InProgress' ? 'text-accent font-bold' : ''}`}>
                  <span className={`w-2 h-2 rounded-full ${jamPhase === 'InProgress' ? 'bg-accent ring-4 ring-accent/20' : 'bg-surface-3'}`} />
                  <span className="text-[11px] sm:text-xs">РАЗРАБОТКА</span>
                </div>

                <span className="text-textDisabled shrink-0">&bull;</span>

                {/* Фаза 3 */}
                <div className={`flex items-center gap-1.5 sm:gap-2 shrink-0 ${jamPhase === 'Voting' ? 'text-accent font-bold' : ''}`}>
                  <span className={`w-2 h-2 rounded-full ${jamPhase === 'Voting' ? 'bg-accent ring-4 ring-accent/20' : 'bg-surface-3'}`} />
                  <span className="text-[11px] sm:text-xs">ГОЛОСОВАНИЕ</span>
                </div>

                <span className="text-textDisabled shrink-0">&bull;</span>

                {/* Фаза 4 */}
                <div className={`flex items-center gap-1.5 sm:gap-2 shrink-0 ${jamPhase === 'Finished' ? 'text-accent font-bold' : ''}`}>
                  <span className={`w-2 h-2 rounded-full ${jamPhase === 'Finished' ? 'bg-accent ring-4 ring-accent/20' : 'bg-surface-3'}`} />
                  <span className="text-[11px] sm:text-xs">РЕЗУЛЬТАТЫ</span>
                </div>

              </div>

              {/* === ПРЕМИУМ-ПАНЕЛЬ СТАТИСТИКИ (Геро-блок) === */}
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 w-full mt-8 sm:mt-10 mb-2">
                {/* Таймер до старта/конца */}
                <div className="flex items-center gap-3 bg-surface-1/50 backdrop-blur-md border border-borderDef hover:border-borderStrong transition-colors rounded-2xl px-5 py-3">
                  <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] sm:text-xs text-textTertiary font-mono uppercase tracking-widest">Осталось времени</span>
                    <span className="text-body sm:text-body-lg font-black text-textPrimary tabular-nums leading-none mt-1">
                      {timeLeft.days}д : {timeLeft.hours}ч : {timeLeft.minutes}м
                    </span>
                  </div>
                </div>

                {/* Участники */}
                <div className="flex items-center gap-3 bg-surface-1/50 backdrop-blur-md border border-borderDef hover:border-borderStrong transition-colors rounded-2xl px-5 py-3">
                  <div className="flex -space-x-2 shrink-0">
                    <img className="inline-block h-10 w-10 rounded-full ring-2 ring-surface-0 object-cover" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=80" alt="" />
                    <img className="inline-block h-10 w-10 rounded-full ring-2 ring-surface-0 object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=80" alt="" />
                    <img className="inline-block h-10 w-10 rounded-full ring-2 ring-surface-0 object-cover" src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=80" alt="" />
                  </div>
                  <div className="flex flex-col ml-1">
                    <span className="text-[10px] sm:text-xs text-textTertiary font-mono uppercase tracking-widest">Участников</span>
                    <span className="text-body sm:text-body-lg font-black text-textPrimary tabular-nums leading-none mt-1">
                      +{JAM_DATA.stats.participantsCount}
                    </span>
                  </div>
                </div>

                {/* Призовой фонд */}
                <div className="flex items-center gap-3 bg-surface-1/50 backdrop-blur-md border border-borderDef hover:border-borderStrong transition-colors rounded-2xl px-5 py-3">
                  <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center shrink-0">
                    <Trophy className="w-5 h-5 text-celebratory" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] sm:text-xs text-textTertiary font-mono uppercase tracking-widest">Призовой фонд</span>
                    <span className="text-body sm:text-body-lg font-black text-textPrimary tabular-nums leading-none mt-1">
                      {JAM_DATA.stats.prizePool}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* MAIN SPLIT LAYOUT */}
          <div className={`max-w-[1440px] mx-auto px-4 md:px-8 mt-8 grid gap-12 items-start w-full ${
            activeTab === 'overview' ? 'grid-cols-1 lg:grid-cols-[1fr_380px]' : 'grid-cols-1'
          }`}>
            
            {/* === ЛЕВАЯ КОЛОНКА === */}
            <main className="w-full flex flex-col gap-6 min-w-0">
              
              {/* ГЛАВНЫЕ ТАБЫ СЕКЦИЙ */}
              <div className="mb-6">
                <Tabs
                  tabs={[
                    { id: 'overview', label: 'ОБЗОР И ПРАВИЛА' },
                    { id: 'submissions', label: `ПОДАННЫЕ ИГРЫ (${JAM_DATA.stats.submissionsCount})` },
                    { id: 'community', label: 'СООБЩЕСТВО' },
                    ...(jamPhase === 'Finished' ? [{ id: 'results', label: 'ИТОГИ' }] : [])
                  ]}
                  activeTab={activeTab}
                  onChange={(id) => { setActiveTab(id as any); setSelectedThreadId(null); }}
                />
              </div>

              {/* TAB 1: ОБЗОР И ПРАВИЛА (True Editorial Magazine UI - Zero Bento Card Spam) */}
              {activeTab === 'overview' && (
                <div id="panel-overview" role="tabpanel" aria-labelledby="tab-overview" className="flex flex-col space-y-12 sm:space-y-20 animate-fadeIn pt-4 pb-12">
                  
                  {/* 1. HERO THEME ANNOUNCEMENT (Editorial Banner) */}
                  <section className="flex flex-col gap-6">
                    <JamThemeBlock 
                      jam={{
                        slug: JAM_DATA.slug,
                        title: JAM_DATA.title,
                        theme: JAM_DATA.theme.title,
                        schedule: jamThemeSchedule,
                        content_html: JAM_DATA.theme.description
                      } as any}
                      userRole={role === 'Organizer' ? 'organizer' : role === 'Admin' ? 'admin' : role === 'Participant' ? 'participant' : 'visitor'}
                      canSubmit={jamPhase === 'InProgress'}
                      onSubscribe={() => {
                        setIsJamSubscribed(true);
                        triggerToast('Подписка на уведомления активирована!', 'success');
                      }}
                      onSubmit={() => setActiveDrawer('submit')}
                    />
                  </section>


                  {/* 3. ABOUT JAM (Editorial Typography) */}
                  <section className="flex flex-col gap-5">
                    <h3 className="text-heading-2 font-bold text-textPrimary tracking-tight">О мероприятии</h3>
                    <p className="text-body text-textSecondary font-sans max-w-3xl">
                      {JAM_DATA.aboutText}
                    </p>
                  </section>

                  {/* 4. SCHEDULE TIMELINE (Clean Vertical Editorial List with Stage Badges) */}
                  <section className="flex flex-col gap-10">
                    <div>
                      <h3 className="text-heading-2 font-bold text-textPrimary tracking-tight mb-2">Расписание этапов</h3>
                      <p className="text-body-sm text-textTertiary font-sans">Ключевые вехи соревнований от старта до объявления победителей</p>
                    </div>

                    <div>
                      {JAM_DATA.schedule.map((step, idx) => {
                        const getStepStatus = (i: number, phase: string) => {
                          if (phase === 'Announcement') return 'upcoming';
                          if (phase === 'Registration') return i === 0 ? 'active' : 'upcoming';
                          if (phase === 'InProgress') return i < 1 ? 'completed' : i === 1 ? 'active' : 'upcoming';
                          if (phase === 'Voting') return i < 2 ? 'completed' : i === 2 ? 'active' : 'upcoming';
                          if (phase === 'Results') return i < 3 ? 'completed' : i === 3 ? 'active' : 'upcoming';
                          if (phase === 'Finished') return 'completed';
                          return 'upcoming';
                        };
                        const dynamicStatus = getStepStatus(idx, jamPhase);

                        const isLast = idx === JAM_DATA.schedule.length - 1;
                        
                        return (
                          <div key={idx} className="flex gap-4">
                            {/* Timeline Column */}
                            <div className="flex flex-col items-center shrink-0">
                              {/* Node Circle */}
                              <div className={`flex items-center justify-center w-8 h-8 rounded-full border shrink-0 ${
                                dynamicStatus === 'completed'
                                  ? 'bg-success border-success'
                                  : dynamicStatus === 'active'
                                  ? 'bg-accent border-accent'
                                  : 'bg-transparent border-borderStrong'
                              }`}>
                                {dynamicStatus === 'completed' ? (
                                  <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
                                ) : (
                                  <div className={`w-1.5 h-1.5 rounded-full ${
                                    dynamicStatus === 'active' ? 'bg-white' : 'bg-textDisabled'
                                  }`} />
                                )}
                              </div>

                              {/* Connecting Line */}
                              {!isLast && (
                                <div className={`w-px h-full min-h-[80px] ${
                                  dynamicStatus === 'completed' ? 'bg-success' : 'bg-surface-3'
                                }`} />
                              )}
                            </div>

                            {/* Content Column */}
                            <div className="flex-1 pb-8">
                              <div className="flex items-center gap-2.5 mb-2">
                                <span className="text-caption font-mono text-textTertiary uppercase tracking-wide">
                                  {step.date}
                                </span>
                                
                                {dynamicStatus === 'active' && (
                                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-accent/10 border border-accent/20 rounded">
                                    <Flame className="w-3 h-3 text-accent" />
                                    <span className="text-caption font-mono font-bold text-accent uppercase">В процессе</span>
                                  </div>
                                )}
                                
                                {dynamicStatus === 'completed' && (
                                  <span className="text-caption font-mono text-success">Завершено</span>
                                )}
                              </div>

                              <h4 className={`text-body font-bold mb-1.5 ${
                                dynamicStatus === 'active' ? 'text-textPrimary' : 'text-textSecondary'
                              }`}>
                                {step.title}
                              </h4>

                              <p className="text-body-sm text-textTertiary">
                                {step.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  {/* 5. RULES (Borderless Row List with Accordions) */}
                  <section className="flex flex-col gap-10">
                    <div>
                      <h3 className="text-heading-2 font-bold text-textPrimary tracking-tight mb-2">Подробный регламент соревнований</h3>
                      <p className="text-body-sm text-textTertiary font-sans">Официальные правила участия и условия дисквалификации</p>
                    </div>

                    <div className="divide-y divide-borderDef border-y border-borderDef">
                      {JAM_DATA.rulesDetailed.map((rule, idx) => {
                        const isExpanded = expandedRuleIndex === idx;
                        return (
                          <div key={rule.id} className="py-5 transition-colors">
                            <button
                              onClick={() => setExpandedRuleIndex(isExpanded ? null : idx)}
                              className="w-full flex items-center justify-between gap-4 text-left cursor-pointer outline-none group"
                            >
                              <div className="flex items-center gap-4">
                                <div>
                                  <h4 className={`text-body font-bold transition-colors ${
                                    isExpanded ? 'text-accent' : 'text-textPrimary group-hover:text-accent'
                                  }`}>
                                    {rule.title}
                                  </h4>
                                  <p className="text-body-sm text-textTertiary mt-1 font-sans">{rule.summary}</p>
                                </div>
                              </div>

                              <ChevronDown className={`w-5 h-5 text-textTertiary transition-transform duration-200 shrink-0 ${
                                isExpanded ? 'rotate-180 text-accent' : 'group-hover:text-textPrimary'
                              }`} />
                            </button>

                            {isExpanded && (
                              <div className="pl-10 pr-4 pt-5 text-body-sm text-textSecondary font-sans animate-fadeIn">
                                {rule.details}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  {/* 6. CRITERIA MATRIX (Clean Typographic Matrix List) */}
                  <section className="flex flex-col gap-10">
                    <div>
                      <h3 className="text-heading-2 font-bold text-textPrimary tracking-tight flex items-center gap-2.5 mb-2">
                        <Star className="w-6 h-6 text-accent" />
                        <span>Критерии и коэффициенты оценки</span>
                      </h3>
                      <p className="text-body-sm text-textTertiary font-sans">Матрица весовых коэффициентов экспертной оценки</p>
                    </div>

                    <div className="divide-y divide-borderDef border-y border-borderDef">
                      {JAM_DATA.criteria.map((crit, i) => (
                        <div key={i} className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex flex-col gap-2 max-w-xl">
                            <span className="text-body-lg font-bold text-textPrimary">{crit.name}</span>
                            <p className="text-body-sm text-textTertiary font-sans">{crit.desc}</p>
                          </div>

                          <div className="flex items-center gap-4 w-full md:w-72 shrink-0">
                            <div className="w-full bg-surface-3 h-2 rounded-full overflow-hidden border border-borderDef">
                              <div 
                                className="bg-accent h-full rounded-full" 
                                style={{ width: crit.weight }}
                              />
                            </div>
                            <span className="font-mono text-body-sm font-bold text-accent shrink-0 w-12 text-right">
                              {crit.weight}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                </div>
              )}


              {/* TAB 2: ПОДАННЫЕ ИГРЫ (/jams/[slug]/submissions) */}
              {activeTab === 'submissions' && (
                <div id="panel-submissions" role="tabpanel" aria-labelledby="tab-submissions" className="space-y-6 animate-fadeIn">
                  
                  {/* HIDE ENTRIES UNTIL END MODE BANNER */}
                  {hideEntriesUntilEnd && jamPhase !== 'Voting' && jamPhase !== 'Finished' ? (
                    <div className="p-10 border border-dashed border-accent/40 bg-accent/5 rounded-2xl text-center flex flex-col items-center gap-3 animate-fadeIn my-4">
                      <div className="w-12 h-12 rounded-full border border-accent/40 bg-accent/10 flex items-center justify-center text-accent">
                        <Lock className="w-6 h-6" />
                      </div>
                      <div className="space-y-1 max-w-md">
                        <span className="text-body font-bold text-white tracking-wide block">Прием работ продолжается</span>
                        <p className="text-caption text-textTertiary font-sans">
                          Организатор джема включил режим скрытых заявок (hideEntriesUntilEnd). Все поданные карточки проектов зафиксированы и будут автоматически опубликованы в общей сетке после завершения дедлайна сдачи (07 Июля).
                        </p>
                      </div>
                    </div>
                  ) : pageState === 'EmptySubmissions' ? (
                    <div className="p-10 border border-dashed border-borderDef bg-surface-1 rounded-2xl text-center flex flex-col items-center gap-3 animate-fadeIn">
                      <Layers className="w-10 h-10 text-textTertiary" />
                      <div className="space-y-1">
                        <span className="text-body-sm font-bold text-textPrimary tracking-wide block">Разработка в самом разгаре!</span>
                        <p className="text-caption sm:text-body-sm text-textSecondary max-w-md mx-auto">Поданные игры появятся здесь сразу после завершения дедлайна сдачи сборок.</p>
                      </div>
                      <button 
                        onClick={() => {
                          if (window.__hubigrNavigate) {
                            window.__hubigrNavigate('/jams/broken-worlds-jam/submit');
                          } else {
                            window.location.hash = '#/jams/broken-worlds-jam/submit';
                          }
                        }} 
                        className="mt-1 min-h-[44px] px-6 bg-accent hover:bg-accent-hover text-white font-bold text-caption rounded-lg transition-all active:scale-[0.98] cursor-pointer"
                      >
                        Подать свою игру
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-6 animate-fadeIn">
                      {/* SUBMISSIONS TOOLBAR: FILTERS & VIEW MODE */}
                      <div className="flex items-center gap-3 pb-4 border-b border-borderDef overflow-x-auto no-scrollbar scroll-smooth">
                        {/* FILTERS */}
                        <div className="flex items-center gap-2 shrink-0">
                          <CustomSelect
                            id="submission-sort"
                            icon={Filter}
                            value={submissionSort}
                            onChange={setSubmissionSort}
                            options={[
                              { value: 'random', label: 'Случайный порядок' },
                              { value: 'date', label: 'По дате подачи' },
                              { value: 'name', label: 'По названию' },
                            ]}
                          />

                          <CustomSelect
                            id="submission-platform"
                            icon={Cpu}
                            value={platformFilter}
                            onChange={setPlatformFilter}
                            options={[
                              { value: 'All', label: 'Все платформы' },
                              { value: 'WebGL', label: 'WebGL / Браузер' },
                              { value: 'Windows', label: 'Windows' },
                              { value: 'mac', label: 'macOS' },
                            ]}
                          />

                          <CustomSelect
                            id="submission-genre"
                            icon={Gamepad2}
                            value={genreFilter}
                            onChange={setGenreFilter}
                            options={[
                              { value: 'All', label: 'Все жанры' },
                              { value: 'Хоррор', label: 'Хоррор' },
                              { value: 'Пазл', label: 'Пазл' },
                              { value: 'Платформер', label: 'Платформер' },
                              { value: 'Sci-Fi', label: 'Sci-Fi' },
                            ]}
                          />
                        </div>

                        {/* SPACER TO PUSH TOGGLE TO THE RIGHT ON DESKTOP */}
                        <div className="flex-1 min-w-[1rem] hidden sm:block"></div>

                        {/* VIEW MODE TOGGLE (Hidden on mobile) */}
                        <div className="hidden sm:flex items-center gap-1 bg-surface-1 border border-borderDef p-1 rounded-lg shrink-0">
                          <button
                            onClick={() => setSubmissionViewMode('grid')}
                            className={`p-2 rounded transition-colors cursor-pointer ${submissionViewMode === 'grid' ? 'bg-surface-2 text-accent' : 'text-textTertiary hover:text-white'}`}
                            title="Вид сеткой"
                            aria-label="Вид сеткой"
                          >
                            <Grid className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setSubmissionViewMode('list')}
                            className={`p-2 rounded transition-colors cursor-pointer ${submissionViewMode === 'list' ? 'bg-surface-2 text-accent' : 'text-textTertiary hover:text-white'}`}
                            title="Вид списком"
                            aria-label="Вид списком"
                          >
                            <List className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                        {submissionViewMode === 'grid' ? (
                          <>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {paginatedSubmissions.map(sub => {
                              // Mock jury evaluation state per entry
                              const juryStatus: 'pending' | 'draft' | 'evaluated' =
                                sub.id % 3 === 0 ? 'evaluated' : sub.id % 3 === 1 ? 'draft' : 'pending';
                              const juryScore = juryStatus === 'evaluated'
                                ? (4 + ((sub.id * 17) % 100) / 100).toFixed(2)
                                : null;
                              // In a real app: compare sub.authorHandle to currentUser.handle
                              const isOwn = sub.id === 1 && role === 'Participant';

                              // Derive jamPhase prop for card
                              const cardPhase: 'InProgress' | 'Voting' | 'Results' =
                                jamPhase === 'Voting' ? 'Voting'
                                : (jamPhase === 'Finished' || jamPhase === 'Results') ? 'Results'
                                : 'InProgress';

                              return (
                                <JamSubmissionCard
                                  key={sub.id}
                                  entry={sub}
                                  jamPhase={cardPhase}
                                  role={role}
                                  isOwnSubmission={isOwn}
                                  juryStatus={juryStatus}
                                  juryScore={juryScore}
                                  hideEntriesUntilEnd={hideEntriesUntilEnd}
                                  bookmarked={!!bookmarkedGames[sub.id]}
                                  onNavigate={handleOpenGameDetail}
                                  onQuickPlay={(item) => {
                                    triggerToast(`Запуск WebGL версии "${item.title}"...`, 'success');
                                    handleOpenGameDetail(item.slug);
                                  }}
                                  onBookmark={(item) => handleToggleBookmark(item.id, item.title)}
                                  onVote={(item) => setVotingModalGame(item)}
                                  onReport={() => setActiveDrawer('report')}
                                  triggerToast={triggerToast}
                                />
                              );
                            })}
                          </div>
                        
                        {/* ПАГИНАЦИЯ */}
                        {totalSubmissionsPages > 1 && (
                          <div className="flex items-center justify-center gap-2 pt-8">
                            <button
                              onClick={() => setSubmissionsPage(p => Math.max(1, p - 1))}
                              disabled={submissionsPage === 1}
                              className="h-10 px-4 bg-surface-2 hover:bg-surface-3 border border-borderDef text-textSecondary hover:text-accent rounded-lg font-mono text-body-sm font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              Назад
                            </button>
                            
                            <div className="flex items-center gap-1">
                              {Array.from({ length: totalSubmissionsPages }, (_, i) => i + 1).map(page => (
                                page === submissionsPage ||
                                page === 1 ||
                                page === totalSubmissionsPages ||
                                Math.abs(page - submissionsPage) === 1
                              ) ? (
                                <button
                                  key={page}
                                  onClick={() => setSubmissionsPage(page)}
                                  className={`h-10 w-10 flex items-center justify-center rounded-lg font-mono text-body-sm font-bold transition-all ${
                                    page === submissionsPage
                                      ? 'bg-accent text-white'
                                      : 'bg-surface-2 hover:bg-surface-3 border border-borderDef text-textSecondary hover:text-accent'
                                  }`}
                                >
                                  {page}
                                </button>
                              ) : page === submissionsPage - 2 || page === submissionsPage + 2 ? (
                                <span key={page} className="px-2 text-textSecondary">...</span>
                              ) : null)}
                            </div>
                            
                            <button
                              onClick={() => setSubmissionsPage(p => Math.min(totalSubmissionsPages, p + 1))}
                              disabled={submissionsPage === totalSubmissionsPages}
                              className="h-10 px-4 bg-surface-2 hover:bg-surface-3 border border-borderDef text-textSecondary hover:text-accent rounded-lg font-mono text-body-sm font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              Вперёд
                            </button>
                          </div>
                        )}
                        </>
                      ) : (
                        /* LIST VIEW */
                        <>
                        <div className="flex flex-col gap-3">
                          {paginatedSubmissions.map(sub => (
                            <article 
                              key={sub.id}
                              onClick={() => handleOpenGameDetail(sub.slug)}
                              className="bg-surface-1 border border-transparent hover:border-borderStrong p-4 rounded-card flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-5 transition-all cursor-pointer group shadow-md"
                            >
                              <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div className="w-32 h-20 bg-surface-2 rounded-xl overflow-hidden shrink-0 relative">
                                  <img src={sub.image} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={sub.title} />
                                </div>
                                <div className="flex flex-col gap-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-body font-bold text-white group-hover:text-accent transition-colors truncate">
                                      {sub.title}
                                    </h4>
                                    <span className="bg-surface-2 border border-borderDef font-mono text-caption text-textTertiary px-2 py-0.5 rounded">
                                      {sub.platform}
                                    </span>
                                  </div>
                                  <p className="text-caption text-textSecondary line-clamp-1">{sub.short_desc}</p>
                                  <div className="flex items-center gap-2 text-caption font-mono text-textSecondary pt-1">
                                    <span>Автор: <strong className="text-white">{sub.author}</strong></span>
                                    <span>&bull;</span>
                                    <span className="text-accent-hover">★ {sub.overallScore} ({sub.ratingCount || 42})</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto" onClick={e => e.stopPropagation()}>
                                {sub.has_webgl && (
                                  <button 
                                    onClick={() => handleOpenGameDetail(sub.slug)}
                                    className="px-3 py-1.5 bg-accent hover:bg-accent-hover text-white font-mono font-bold text-caption rounded flex items-center gap-1"
                                  >
                                    <Play className="w-3.5 h-3.5 fill-current" />
                                    <span>Запустить</span>
                                  </button>
                                )}
                                {jamPhase === 'Voting' && (
                                  <button 
                                    onClick={() => setVotingModalGame(sub)}
                                    className="px-3 py-1.5 bg-surface-2 hover:bg-surface-3 border border-borderDef text-white font-mono font-bold text-caption rounded flex items-center gap-1"
                                  >
                                    <Star className="w-3.5 h-3.5 text-accent-hover" />
                                    <span>Оценить</span>
                                  </button>
                                )}
                                <button 
                                  onClick={() => setCollectionGameJam(sub)}
                                  className="p-2 bg-surface-2 hover:bg-surface-3 border border-borderDef text-textTertiary hover:text-accent rounded"
                                >
                                  <Bookmark className={`w-4 h-4 ${bookmarkedGames[sub.id] ? 'text-accent fill-current' : ''}`} />
                                </button>
                              </div>
                            </article>
                          ))}
                        </div>
                        
                        {/* ПАГИНАЦИЯ */}
                        {totalSubmissionsPages > 1 && (
                          <div className="flex items-center justify-center gap-2 pt-8">
                            <button
                              onClick={() => setSubmissionsPage(p => Math.max(1, p - 1))}
                              disabled={submissionsPage === 1}
                              className="h-10 px-4 bg-surface-2 hover:bg-surface-3 border border-borderDef text-textSecondary hover:text-accent rounded-lg font-mono text-body-sm font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              Назад
                            </button>
                            
                            <div className="flex items-center gap-1">
                              {Array.from({ length: totalSubmissionsPages }, (_, i) => i + 1).map(page => (
                                page === submissionsPage ||
                                page === 1 ||
                                page === totalSubmissionsPages ||
                                Math.abs(page - submissionsPage) === 1
                              ) ? (
                                <button
                                  key={page}
                                  onClick={() => setSubmissionsPage(page)}
                                  className={`h-10 w-10 flex items-center justify-center rounded-lg font-mono text-body-sm font-bold transition-all ${
                                    page === submissionsPage
                                      ? 'bg-accent text-white'
                                      : 'bg-surface-2 hover:bg-surface-3 border border-borderDef text-textSecondary hover:text-accent'
                                  }`}
                                >
                                  {page}
                                </button>
                              ) : page === submissionsPage - 2 || page === submissionsPage + 2 ? (
                                <span key={page} className="px-2 text-textSecondary">...</span>
                              ) : null)}
                            </div>
                            
                            <button
                              onClick={() => setSubmissionsPage(p => Math.min(totalSubmissionsPages, p + 1))}
                              disabled={submissionsPage === totalSubmissionsPages}
                              className="h-10 px-4 bg-surface-2 hover:bg-surface-3 border border-borderDef text-textSecondary hover:text-accent rounded-lg font-mono text-body-sm font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              Вперёд
                            </button>
                          </div>
                        )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* =========================================================================
                  TAB 3: СООБЩЕСТВО (/jams/[slug]?tab=community)
                  ========================================================================= */}
              {activeTab === 'community' && (
                <div id="panel-community" role="tabpanel" aria-labelledby="tab-community" className="space-y-6 animate-fadeIn">
                  
                  {/* 1. READ-ONLY STATUS WARNING BANNER */}
                  {isReadOnly && (
                    <div className="bg-danger/10 border border-danger/30 p-4 rounded-[10px] flex items-center gap-3 text-caption sm:text-body-sm font-sans">
                      <Lock className="w-5 h-5 text-danger shrink-0" />
                      <div className="flex flex-col">
                        <span className="font-bold text-textPrimary">
                          Сообщество переведено в режим чтения (Read-Only)
                        </span>
                        <span className="text-textTertiary">
                          {communityPostingPolicy === 'lock_on_end' 
                            ? "Прием работ завершен. Создание новых тем и ответов заблокировано."
                            : communityPostingPolicy === 'lock_on_voting_end'
                            ? "Оценка работ завершена. Обсуждения закрыты."
                            : "Публикации в сообществе временно приостановлены администрацией."}
                        </span>
                      </div>
                      {isStaff && (
                        <span className="ml-auto bg-accent/10 border border-accent/30 text-accent font-mono text-caption font-bold px-2 py-0.5 rounded shrink-0">
                          Доступ Staff
                        </span>
                      )}
                    </div>
                  )}

                  {/* COMMUNITY TOOLBAR: ACTIONS & NAVIGATION */}
                  <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pb-4 border-b border-borderDef">
                    {/* LEFT: SECTION TITLE OR BACK BUTTON */}
                    <div className="flex items-center gap-3">
                      {selectedThreadId ? (
                        <button 
                          onClick={() => setSelectedThreadId(null)}
                          className="flex items-center gap-2 text-white hover:text-accent font-bold transition-colors cursor-pointer group"
                        >
                          <ArrowLeft className="w-4 h-4 text-textTertiary group-hover:text-accent transition-colors" />
                          <span>Назад ко всем темам</span>
                        </button>
                      ) : (
                        <>
                          <MessageCircle className="w-5 h-5 text-accent" />
                          <h3 className="text-body-lg font-bold text-textPrimary">Темы обсуждений</h3>
                          <span className="text-body-sm text-textTertiary font-mono">({discussionsList.length})</span>
                        </>
                      )}
                    </div>

                    {/* RIGHT: ACTIONS */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {selectedThreadId && activeThread ? (
                        <button 
                          onClick={() => {
                            const isSub = subscribedThreadIds.includes(activeThread.id);
                            setSubscribedThreadIds(prev => isSub ? prev.filter(id => id !== activeThread.id) : [...prev, activeThread.id]);
                            triggerToast(isSub ? 'Отписка от темы' : 'Вы подписались на обновления темы', 'success');
                          }}
                          className={`h-9 px-4 border rounded-lg text-body-sm font-medium flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
                            subscribedThreadIds.includes(activeThread.id)
                              ? 'bg-success/10 border-success/30 text-success' 
                              : 'bg-transparent border-borderDef text-textTertiary hover:text-textPrimary hover:bg-surface-2'
                          }`}
                        >
                          <Bell className="w-4 h-4" />
                          <span>{subscribedThreadIds.includes(activeThread.id) ? 'Отписаться от темы' : 'Подписаться на тему'}</span>
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => setIsJamSubscribed(!isJamSubscribed)}
                            className={`h-9 px-4 border rounded-control text-body-sm font-medium flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
                              isJamSubscribed 
                                ? 'bg-success/10 border-success/30 text-success' 
                                : 'bg-transparent border-borderDef text-textTertiary hover:text-textPrimary hover:bg-surface-2'
                            }`}
                            title="Получать уведомления о новых темах"
                          >
                            <Bell className="w-4 h-4" />
                            <span>{isJamSubscribed ? 'Подписан на раздел' : 'Подписаться на раздел'}</span>
                          </button>

                          <button
                            onClick={() => setActiveDrawer('addDiscussion')}
                            disabled={isReadOnly && !isStaff}
                            className="h-9 px-4 bg-accent hover:bg-accent-hover disabled:opacity-40 text-white text-body-sm font-bold rounded-control flex items-center gap-2 transition-colors cursor-pointer disabled:cursor-not-allowed whitespace-nowrap"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Создать тему</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* 3. THREAD DETAIL VIEW VS LIST VIEW */}
                  {selectedThreadId && activeThread ? (
                    /* ========================================================= */
                    /* THREAD DETAIL VIEW (/jams/[slug]/community/[threadId])   */
                    /* ========================================================= */
                    <div className="space-y-6 animate-fadeIn">

                      {/* THREAD MAIN VIEW (Editorial style, no card) */}
                      <div className="space-y-5 pb-6 border-b border-borderDef/50">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-3 flex-wrap">
                            {activeThread.isPinned && (
                              <span className="text-accent font-mono text-caption font-bold flex items-center gap-1 uppercase tracking-wider">
                                <Pin className="w-3.5 h-3.5" /> Закреплено
                              </span>
                            )}
                            {activeThread.isLocked && (
                              <span className="text-danger font-mono text-caption font-bold flex items-center gap-1 uppercase tracking-wider">
                                <Lock className="w-3.5 h-3.5" /> Закрыто
                              </span>
                            )}
                            <span className="text-textTertiary font-mono text-caption font-bold uppercase tracking-wider">
                              {activeThread.tag}
                            </span>
                          </div>

                          {/* MODERATOR TOOLS */}
                          {isStaff && (
                            <div className="flex items-center gap-2 font-mono text-caption">
                              <button 
                                onClick={() => handleTogglePinThread(activeThread.id)}
                                className="px-2.5 py-1 bg-transparent hover:bg-surface-2 text-textTertiary hover:text-white rounded flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <Pin className="w-3 h-3" />
                                <span>{activeThread.isPinned ? 'Открепить' : 'Закрепить'}</span>
                              </button>
                              <button 
                                onClick={() => handleToggleLockThread(activeThread.id)}
                                className="px-2.5 py-1 bg-transparent hover:bg-surface-2 text-textTertiary hover:text-white rounded flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <Lock className="w-3 h-3" />
                                <span>{activeThread.isLocked ? 'Открыть' : 'Закрыть'}</span>
                              </button>
                            </div>
                          )}
                        </div>

                        <h1 className="text-heading-2 sm:text-heading-2 font-extrabold text-white font-sans tracking-tight">
                          {activeThread.title}
                        </h1>

                        <div className="flex items-center gap-3 text-body-sm text-textTertiary font-sans">
                          <div className="flex items-center gap-2">
                            <img src={activeThread.avatar} alt={activeThread.author} className="w-7 h-7 rounded-full" />
                            <span className="font-bold text-textPrimary">{activeThread.author}</span>
                          </div>
                          <span>&bull;</span>
                          <span className="font-mono">{activeThread.date}</span>
                          <span>&bull;</span>
                          <span className="font-mono flex items-center gap-1.5" title="Просмотры"><Eye className="w-4 h-4"/> {activeThread.viewsCount}</span>
                        </div>

                        <div className="text-body text-textSecondary pt-2 font-sans max-w-3xl">
                          {activeThread.fullText}
                        </div>
                      </div>

                      {/* POSTS COMMENT TREE SECTION */}
                      <div className="space-y-6 pt-8">
                        <div className="pb-3 border-b border-borderDef/50">
                          <h3 className="text-body-lg font-bold text-white font-sans">
                            {activeThread.repliesCount} {activeThread.repliesCount === 1 ? 'ответ' : activeThread.repliesCount > 1 && activeThread.repliesCount < 5 ? 'ответа' : 'ответов'}
                          </h3>
                        </div>

                        {activeThread.posts.length === 0 ? (
                          <div className="py-8 text-center text-body-sm font-sans text-textTertiary">
                            В этой теме пока нет ответов. Напишите первый комментарий!
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {renderPostTree(activeThread.posts)}
                          </div>
                        )}

                        {/* ROOT REPLY FORM */}
                        {(!activeThread.isLocked && (!isReadOnly || isStaff)) ? (
                          <div className="pt-6 mt-6 border-t border-borderDef/50 flex gap-4">
                            {/* Мы используем заглушку аватарки "Текущего пользователя", так как реального user.avatar в стейте нет для этого компонента */}
                            <img src="https://api.dicebear.com/7.x/bottts/svg?seed=CurrentUser" alt="Вы" className="w-8 h-8 rounded-full shrink-0 hidden sm:block" />
                            <div className="flex-1 space-y-3">
                              <textarea 
                                value={newReplyText}
                                onChange={e => setNewReplyText(e.target.value)}
                                placeholder="Напишите ответ..."
                                className="w-full bg-transparent hover:bg-surface-1/30 focus:bg-surface-1/50 border border-borderDef focus:border-accent text-white p-3.5 rounded-control text-body-sm outline-none font-sans transition-colors resize-y min-h-[100px]"
                              />
                              <div className="flex items-center justify-end">
                                <button 
                                  onClick={() => handleSendReplyInThread(null)}
                                  className="px-5 py-2 bg-accent hover:bg-accent-hover text-white font-bold text-body-sm rounded-control transition-colors cursor-pointer"
                                >
                                  Отправить
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="py-6 mt-6 border-t border-borderDef/50 text-center font-sans text-body-sm text-textTertiary">
                            {activeThread.isLocked ? "Тема заблокирована, новые ответы отключены." : "Сообщество переведено в режим чтения."}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : communitySubTab === 'discussion' ? (
                    /* ========================================================= */
                    /* THREAD LISTING VIEW                                      */
                    /* ========================================================= */
                    <div className="space-y-5 animate-fadeIn">
                      {/* SEARCH & FILTERS */}
                      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
                        {/* Search */}
                        <div className="relative flex-1">
                          <Search className="w-4 h-4 text-textTertiary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input 
                            type="text"
                            value={discussionSearchQuery}
                            onChange={e => setDiscussionSearchQuery(e.target.value)}
                            placeholder="Поиск по темам, авторам, тексту..."
                            className="w-full h-9 bg-transparent hover:bg-surface-1/50 border border-borderDef focus:border-accent text-white placeholder:text-textDisabled pl-10 pr-10 rounded-lg text-body-sm outline-none transition-colors"
                          />
                          {discussionSearchQuery && (
                            <button 
                              onClick={() => setDiscussionSearchQuery('')} 
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-textTertiary hover:text-white transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        {/* Category Filter */}
                        <CustomSelect
                          id="discussion-category"
                          icon={Hash}
                          value={discussionTagFilter}
                          onChange={setDiscussionTagFilter}
                          options={[
                            { value: 'All', label: 'Все категории' },
                            { value: 'Объявления / FAQ', label: 'Объявления / FAQ' },
                            { value: 'Вопросы к организаторам', label: 'Вопросы' },
                            { value: 'Идеи и Ресурсы', label: 'Идеи и Ресурсы' },
                            { value: 'Общий чат / Флуд', label: 'Общий чат' },
                          ]}
                        />

                        {/* Sort */}
                        <CustomSelect
                          id="discussion-sort"
                          icon={Filter}
                          value={discussionSortBy}
                          onChange={setDiscussionSortBy}
                          options={[
                            { value: 'latest', label: 'Последняя активность' },
                            { value: 'newest', label: 'Сначала новые' },
                            { value: 'popular', label: 'Популярные' },
                          ]}
                        />
                      </div>

                      {/* THREAD CARDS */}
                      {filteredDiscussions.length === 0 ? (
                        <div className="p-12 bg-surface-1 border border-dashed border-borderDef rounded-lg text-center space-y-3">
                          <Search className="w-10 h-10 mx-auto text-textDisabled" />
                          <div className="space-y-1">
                            <p className="text-body-sm font-bold text-textPrimary">Темы не найдены</p>
                            <p className="text-caption text-textTertiary">Попробуйте изменить фильтры или поисковый запрос</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col border-t border-borderDef">
                          {filteredDiscussions.map(t => (
                            <div 
                              key={t.id}
                              onClick={() => setSelectedThreadId(t.id)}
                              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-borderDef hover:bg-surface-1/40 px-3 -mx-3 transition-colors cursor-pointer group"
                            >
                              <div className="flex flex-col gap-1 flex-1 min-w-0">
                                <div className="flex items-center gap-3 flex-wrap mb-0.5">
                                  {t.isPinned && (
                                    <span className="text-accent font-mono text-[10px] font-bold flex items-center gap-1 uppercase tracking-wider">
                                      <Pin className="w-3 h-3" /> Закреплено
                                    </span>
                                  )}
                                  {t.isLocked && (
                                    <span className="text-danger font-mono text-[10px] font-bold flex items-center gap-1 uppercase tracking-wider">
                                      <Lock className="w-3 h-3" /> Закрыто
                                    </span>
                                  )}
                                  <span className="text-textTertiary font-mono text-[10px] font-bold uppercase tracking-wider">
                                    {t.tag}
                                  </span>
                                </div>

                                <h3 className="text-body font-bold text-white group-hover:text-accent transition-colors line-clamp-1">
                                  {t.title}
                                </h3>

                                <div className="flex items-center gap-2 text-caption text-textTertiary font-sans mt-0.5">
                                  <img src={t.avatar} alt={t.author} className="w-4 h-4 rounded-full grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                                  <span>{t.author}</span>
                                  <span>&bull;</span>
                                  <span>{t.lastActivity}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-6 text-body-sm text-textTertiary shrink-0 font-mono pt-2 sm:pt-0">
                                <div className="flex items-center gap-2 group-hover:text-white transition-colors" title="Ответы">
                                  <MessageCircle className="w-4 h-4" />
                                  <span className="font-bold">{t.repliesCount}</span>
                                </div>
                                <div className="flex items-center gap-2 group-hover:text-white transition-colors" title="Просмотры">
                                  <Eye className="w-4 h-4" />
                                  <span className="font-bold">{t.viewsCount}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              )}

              {/* =========================================================================
                  TAB 4: ИТОГИ ДЖЕМА (Results & Leaderboard)
                  ========================================================================= */}
              {activeTab === 'results' && (
                <div id="panel-results" role="tabpanel" aria-labelledby="tab-results" className="flex flex-col gap-16 animate-fadeIn w-full">
                  
                  {!JAM_DATA.resultsData?.isResultsPublished ? (
                    <div className="p-12 border border-dashed border-borderDef bg-surface-0 rounded-[16px] text-center flex flex-col items-center gap-4 animate-fadeIn">
                      <div className="w-14 h-14 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
                        <Clock className="w-7 h-7" />
                      </div>
                      <div className="space-y-1 max-w-md">
                        <h2 className="text-body-lg font-bold font-mono text-white uppercase tracking-wider">Подведение итогов в процессе</h2>
                        <p className="text-caption sm:text-body-sm text-textTertiary">
                          Жюри и участники оценивают работы. Результаты и таблица лидеров будут опубликованы по окончании этапа судейства.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* SECTION 1: PODIUM */}
                      <section className="flex flex-col gap-8">
                        <h2 className="text-body sm:text-body-lg font-extrabold font-mono uppercase tracking-wider text-white flex items-center gap-2.5">
                          <Trophy className="w-5 h-5 text-accent fill-current" /> Пьедестал победителей
                        </h2>

                        {/* PODIUM GRID */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                          
                          {/* 2-ND PLACE */}
                          {JAM_DATA.resultsData.leaderboard[1] && (
                            <div className="bg-surface-0 border border-borderStrong hover:border-borderStrong p-5 rounded-[16px] flex flex-col justify-between gap-4 relative transition-all duration-200 hover:-translate-y-1 shadow-lg order-2 md:order-1">
                              <div className="flex justify-between items-center gap-2">
                                <span className="bg-surface-3 border border-borderStrong/60 text-textPrimary font-mono text-caption font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5 tracking-wider shrink-0 whitespace-nowrap">
                                  <Award className="w-3.5 h-3.5 text-textPrimary" />
                                  <span>2 МЕСТО</span>
                                </span>
                                <span className="text-caption font-mono font-bold text-textPrimary bg-surface-1 px-2.5 py-1 rounded-md border border-borderDef shrink-0 whitespace-nowrap">{JAM_DATA.resultsData.leaderboard[1].totalScore} ★</span>
                              </div>

                              <div className="aspect-[16/10] bg-surface-2 rounded-[10px] overflow-hidden border border-borderDef relative group">
                                <img src={JAM_DATA.resultsData.leaderboard[1].cover} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90" alt="" />
                              </div>

                              <div className="space-y-1">
                                <h3 className="text-body font-extrabold text-white leading-snug tracking-tight">{JAM_DATA.resultsData.leaderboard[1].title}</h3>
                                <div className="flex items-center gap-2">
                                  <img src={JAM_DATA.resultsData.leaderboard[1].avatar} className="w-4 h-4 rounded-full border border-borderDef" alt="" />
                                  <span className="text-caption font-mono text-textTertiary">{JAM_DATA.resultsData.leaderboard[1].author}</span>
                                </div>
                              </div>

                              <button 
                                onClick={() => handleOpenGameDetail(JAM_DATA.resultsData.leaderboard[1].slug)}
                                className="w-full min-h-[40px] bg-surface-2 hover:bg-surface-2 border border-borderDef text-white font-extrabold text-overline  tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                              >
                                <Play className="w-3.5 h-3.5 fill-current text-textPrimary" />
                                <span>Смотреть проект</span>
                              </button>
                            </div>
                          )}

                          {/* 1-ST PLACE (GOLD) */}
                          {JAM_DATA.resultsData.leaderboard[0] && (
                            <div className="bg-surface-1 border-2 border-accent p-6 rounded-[20px] flex flex-col justify-between gap-5 relative transition-all duration-200 hover:-translate-y-1.5 shadow-elevation-raised order-1 md:order-2 md:-translate-y-3">
                              <div className="flex justify-between items-center gap-2">
                                <span className="bg-accent text-white font-mono text-caption font-black px-3.5 py-1.5 rounded-full flex items-center gap-1.5 tracking-wider shadow-md shrink-0 whitespace-nowrap">
                                  <Trophy className="w-4 h-4 fill-current text-white" />
                                  <span>1 МЕСТО / ПОБЕДИТЕЛЬ</span>
                                </span>
                                <span className="text-body-sm font-mono font-black text-accent bg-accent/15 border border-accent/30 px-3 py-1 rounded-md shrink-0 whitespace-nowrap">{JAM_DATA.resultsData.leaderboard[0].totalScore} ★</span>
                              </div>

                              <div className="aspect-[16/10] bg-surface-2 rounded-2xl overflow-hidden border border-accent/40 relative group">
                                <img src={JAM_DATA.resultsData.leaderboard[0].cover} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-95" alt="" />
                              </div>

                              <div className="space-y-3">
                                <div>
                                  <h2 className="text-heading-3 font-black text-white tracking-tight">{JAM_DATA.resultsData.leaderboard[0].title}</h2>
                                  <div className="flex items-center gap-2 mt-1.5">
                                    <img src={JAM_DATA.resultsData.leaderboard[0].avatar} className="w-5 h-5 rounded-full border border-accent/40" alt="" />
                                    <span className="text-caption font-mono text-textSecondary font-bold">{JAM_DATA.resultsData.leaderboard[0].author}</span>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-borderDef font-mono text-caption">
                                  <div className="flex justify-between text-textTertiary bg-surface-2 p-1.5 rounded"><span>Геймплей:</span> <strong className="text-accent">{JAM_DATA.resultsData.leaderboard[0].scores.gameplay}</strong></div>
                                  <div className="flex justify-between text-textTertiary bg-surface-2 p-1.5 rounded"><span>Идея:</span> <strong className="text-white">{JAM_DATA.resultsData.leaderboard[0].scores.idea}</strong></div>
                                  <div className="flex justify-between text-textTertiary bg-surface-2 p-1.5 rounded"><span>Арт:</span> <strong className="text-white">{JAM_DATA.resultsData.leaderboard[0].scores.art}</strong></div>
                                  <div className="flex justify-between text-textTertiary bg-surface-2 p-1.5 rounded"><span>Звук:</span> <strong className="text-white">{JAM_DATA.resultsData.leaderboard[0].scores.polish}</strong></div>
                                </div>
                              </div>

                              <button 
                                onClick={() => handleOpenGameDetail(JAM_DATA.resultsData.leaderboard[0].slug)}
                                className="w-full min-h-[46px] bg-accent hover:bg-accent-hover text-white font-black text-overline  tracking-wider rounded-[10px] transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 shadow-md"
                              >
                                <Play className="w-4 h-4 fill-current text-white" />
                                <span>Играть в браузере</span>
                              </button>
                            </div>
                          )}

                          {/* 3-RD PLACE */}
                          {JAM_DATA.resultsData.leaderboard[2] && (
                            <div className="bg-surface-0 border border-warning/40 hover:border-warning p-5 rounded-[16px] flex flex-col justify-between gap-4 relative transition-all duration-200 hover:-translate-y-1 shadow-lg order-3">
                              <div className="flex justify-between items-center gap-2">
                                <span className="bg-warning/15 border border-warning/60 text-textPrimary font-mono text-caption font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5 tracking-wider shrink-0 whitespace-nowrap">
                                  <Award className="w-3.5 h-3.5 text-warning" />
                                  <span>3 МЕСТО</span>
                                </span>
                                <span className="text-caption font-mono font-bold text-warning bg-surface-1 px-2.5 py-1 rounded-md border border-borderDef shrink-0 whitespace-nowrap">{JAM_DATA.resultsData.leaderboard[2].totalScore} ★</span>
                              </div>

                              <div className="aspect-[16/10] bg-surface-2 rounded-[10px] overflow-hidden border border-borderDef relative group">
                                <img src={JAM_DATA.resultsData.leaderboard[2].cover} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90" alt="" />
                              </div>

                              <div className="space-y-1">
                                <h3 className="text-body font-extrabold text-white leading-snug tracking-tight">{JAM_DATA.resultsData.leaderboard[2].title}</h3>
                                <div className="flex items-center gap-2">
                                  <img src={JAM_DATA.resultsData.leaderboard[2].avatar} className="w-4 h-4 rounded-full border border-borderDef" alt="" />
                                  <span className="text-caption font-mono text-textTertiary">{JAM_DATA.resultsData.leaderboard[2].author}</span>
                                </div>
                              </div>

                              <button 
                                onClick={() => handleOpenGameDetail(JAM_DATA.resultsData.leaderboard[2].slug)}
                                className="w-full min-h-[40px] bg-surface-2 hover:bg-surface-2 border border-borderDef text-white font-extrabold text-overline  tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                              >
                                <Play className="w-3.5 h-3.5 fill-current text-warning" />
                                <span>Смотреть проект</span>
                              </button>
                            </div>
                          )}

                        </div>
                      </section>

                      {/* SECTION 2: CATEGORY WINNERS */}
                      <section className="flex flex-col gap-6">
                        <h3 className="text-body-sm font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
                          <Medal className="w-4 h-4 text-accent" /> Победители в частных номинациях
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          {JAM_DATA.resultsData.categoryWinners.map(cat => (
                            <div 
                              key={cat.categoryId}
                              onClick={() => handleCategoryWinnerClick(cat.categoryId)}
                              className="bg-surface-0 border border-borderDef hover:border-accent/60 p-4 rounded-2xl flex flex-col justify-between gap-3 cursor-pointer group transition-all duration-200"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-caption font-mono text-textTertiary font-bold uppercase tracking-wider flex items-center gap-1.5">
                                  {cat.icon}
                                  <span>{cat.categoryName}</span>
                                </span>
                                <span className="text-caption font-mono font-bold text-accent bg-accent/10 px-2 py-0.5 rounded shrink-0">{cat.score} ★</span>
                              </div>

                              <div className="flex items-center gap-3">
                                <img src={cat.cover} className="w-16 h-10 object-cover rounded border border-borderDef shrink-0" alt="" />
                                <div className="flex flex-col min-w-0">
                                  <h4 className="text-caption font-extrabold text-white group-hover:text-accent transition-colors truncate">{cat.gameTitle}</h4>
                                  <span className="text-caption font-mono text-textTertiary truncate">{cat.author}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>

                      {/* SECTION 3: LEADERBOARD TABLE WITH FILTERS */}
                      <section ref={leaderboardRef} className="flex flex-col bg-surface-0 border border-borderDef rounded-2xl overflow-hidden shadow-lg">
                        
                        {/* FILTER & SEARCH CONTROL BAR */}
                        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 border-b border-borderDef">
                          
                          <div className="relative flex-1 min-w-[220px]">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-textTertiary" />
                            <input 
                              type="text"
                              value={resultsSearchQuery}
                              onChange={e => setResultsSearchQuery(e.target.value)}
                              placeholder="Поиск по названию игры или автору..."
                              className="w-full bg-surface-0 border border-borderDef text-white placeholder:text-textTertiary pl-10 pr-8 py-2 rounded-xl text-caption font-sans outline-none focus:border-accent"
                            />
                            {resultsSearchQuery && (
                              <button onClick={() => setResultsSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-textTertiary hover:text-white">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          {/* Criteria Filter Chips - УБРАНЫ, теперь сортировка только через заголовки таблицы */}

                          {/* View Switcher */}
                          <div className="flex items-center gap-1 bg-surface-0 p-1 border border-borderDef rounded-lg shrink-0">
                            <button 
                              onClick={() => setResultsViewMode('table')} 
                              className={`p-1.5 rounded transition-colors ${resultsViewMode === 'table' ? 'bg-surface-2 text-accent' : 'text-textTertiary hover:text-white'}`}
                              title="Таблица"
                            >
                              <List className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => setResultsViewMode('grid')} 
                              className={`p-1.5 rounded transition-colors ${resultsViewMode === 'grid' ? 'bg-surface-2 text-accent' : 'text-textTertiary hover:text-white'}`}
                              title="Сетка"
                            >
                              <LayoutGrid className="w-4 h-4" />
                            </button>
                          </div>

                        </div>

                        {/* LEADERBOARD TABLE / GRID */}
                        {filteredLeaderboard.length === 0 ? (
                          <div className="p-8 text-center">
                            <p className="text-body-sm text-textTertiary">
                              По запросу <span className="text-white font-mono">"{resultsSearchQuery}"</span> ничего не найдено
                            </p>
                          </div>
                        ) : resultsViewMode === 'table' ? (
                        <div className="overflow-x-auto">
                          <table className="w-full min-w-[900px] text-left border-collapse font-sans text-caption">
                            <thead>
                              <tr className="bg-surface-0 text-textTertiary font-mono text-caption uppercase tracking-wider border-b border-borderDef">
                                <th className="py-4 px-4 font-bold w-[60px] text-center">#</th>
                                <th className="py-4 px-4 font-bold min-w-[280px]">Игра и Команда</th>
                                <th className="py-4 px-3 font-bold w-[140px] text-center">Платформы</th>
                                
                                <th 
                                  onClick={() => setResultsCriteriaFilter('gameplay')}
                                  className={`py-4 px-3 font-bold text-center w-[100px] cursor-pointer hover:text-white transition-colors group ${resultsCriteriaFilter === 'gameplay' ? 'text-accent' : ''}`}
                                >
                                  <div className="flex items-center justify-center gap-1">
                                    <span>Геймплей ★</span>
                                    {resultsCriteriaFilter === 'gameplay' ? (
                                      <ChevronDown className="w-3 h-3 text-accent" />
                                    ) : (
                                      <ChevronsUpDown className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" />
                                    )}
                                  </div>
                                </th>
                                <th 
                                  onClick={() => setResultsCriteriaFilter('idea')}
                                  className={`py-4 px-3 font-bold text-center w-[100px] cursor-pointer hover:text-white transition-colors group ${resultsCriteriaFilter === 'idea' ? 'text-accent' : ''}`}
                                >
                                  <div className="flex items-center justify-center gap-1">
                                    <span>Идея ★</span>
                                    {resultsCriteriaFilter === 'idea' ? (
                                      <ChevronDown className="w-3 h-3 text-accent" />
                                    ) : (
                                      <ChevronsUpDown className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" />
                                    )}
                                  </div>
                                </th>
                                <th 
                                  onClick={() => setResultsCriteriaFilter('art')}
                                  className={`py-4 px-3 font-bold text-center w-[100px] cursor-pointer hover:text-white transition-colors group ${resultsCriteriaFilter === 'art' ? 'text-accent' : ''}`}
                                >
                                  <div className="flex items-center justify-center gap-1">
                                    <span>Арт ★</span>
                                    {resultsCriteriaFilter === 'art' ? (
                                      <ChevronDown className="w-3 h-3 text-accent" />
                                    ) : (
                                      <ChevronsUpDown className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" />
                                    )}
                                  </div>
                                </th>
                                <th 
                                  onClick={() => setResultsCriteriaFilter('polish')}
                                  className={`py-4 px-3 font-bold text-center w-[100px] cursor-pointer hover:text-white transition-colors group ${resultsCriteriaFilter === 'polish' ? 'text-accent' : ''}`}
                                >
                                  <div className="flex items-center justify-center gap-1">
                                    <span>Звук ★</span>
                                    {resultsCriteriaFilter === 'polish' ? (
                                      <ChevronDown className="w-3 h-3 text-accent" />
                                    ) : (
                                      <ChevronsUpDown className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" />
                                    )}
                                  </div>
                                </th>
                                
                                <th 
                                  onClick={() => setResultsCriteriaFilter('overall')}
                                  className={`py-4 px-4 font-bold text-right w-[110px] cursor-pointer hover:text-white transition-colors group ${resultsCriteriaFilter === 'overall' ? 'text-accent' : ''}`}
                                >
                                  <div className="flex items-center justify-end gap-1">
                                    <span>Итого ★</span>
                                    {resultsCriteriaFilter === 'overall' ? (
                                      <ChevronDown className="w-3 h-3 text-accent" />
                                    ) : (
                                      <ChevronsUpDown className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" />
                                    )}
                                  </div>
                                </th>
                                <th className="py-4 px-3 font-bold text-center w-[90px]">Оценки</th>
                                <th className="py-4 px-4 font-bold text-center w-[60px]"></th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-borderDef">
                              {filteredLeaderboard.map(item => {
                                const isExpanded = expandedRowId === item.id;
                                return (
                                  <React.Fragment key={item.id}>
                                    <tr 
                                      onClick={() => setExpandedRowId(isExpanded ? null : item.id)}
                                      className={`hover:bg-surface-1 transition-colors cursor-pointer ${isExpanded ? 'bg-surface-1' : ''}`}
                                    >
                                      <td className="py-4 px-4 text-center">
                                        <div className="flex items-center justify-center gap-1.5">
                                          {item.rank === 1 ? (
                                            <span className="bg-accent/20 text-accent border border-accent/50 px-2.5 py-1 rounded text-caption font-black flex items-center gap-1">
                                              <Trophy className="w-3.5 h-3.5 fill-current" />
                                              <span>1</span>
                                            </span>
                                          ) : item.rank === 2 ? (
                                            <span className="bg-surface-3 text-textPrimary border border-borderStrong px-2.5 py-1 rounded text-caption font-black flex items-center gap-1">
                                              <Medal className="w-3.5 h-3.5" />
                                              <span>2</span>
                                            </span>
                                          ) : item.rank === 3 ? (
                                            <span className="bg-warning/20 text-warning border border-warning/40 px-2.5 py-1 rounded text-caption font-black flex items-center gap-1">
                                              <Medal className="w-3.5 h-3.5" />
                                              <span>3</span>
                                            </span>
                                          ) : (
                                            <span className="text-textTertiary font-mono font-bold">{item.rank}</span>
                                          )}
                                          {item.isTieBreak && (
                                            <span className="bg-accent/10 border border-accent/30 text-accent text-caption font-mono font-bold px-1.5 py-0.5 rounded shrink-0" title={item.tieBreakReason}>
                                              TB
                                            </span>
                                          )}
                                        </div>
                                      </td>

                                      <td className="py-4 px-4">
                                        <div className="flex items-start gap-3">
                                          <img src={item.cover} className="w-14 h-8 object-cover rounded border border-borderDef bg-surface-2 shrink-0" alt="" />
                                          <div className="flex flex-col min-w-0">
                                            <a 
                                              href={`#/games/${item.slug}`}
                                              onClick={(e) => { e.stopPropagation(); handleOpenGameDetail(item.slug); }}
                                              className="font-extrabold text-white text-body-sm hover:text-accent transition-colors leading-snug truncate"
                                            >
                                              {item.title}
                                            </a>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                              <img src={item.avatar} className="w-3.5 h-3.5 rounded-full border border-borderDef shrink-0" alt="" />
                                              <span className="text-caption text-textTertiary font-mono truncate flex items-center gap-1">
                                                {item.isTeam && <Users className="w-3 h-3" />}
                                                {item.author}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </td>

                                      <td className="py-4 px-3 text-center">
                                        <div className="flex items-center justify-center gap-1.5">
                                          <div className="flex items-center justify-center gap-1.5 text-textTertiary">
                                            {item.platforms.map((p: string) => (
                                              <PlatformIcon key={p} platform={p} className="w-3.5 h-3.5 text-textTertiary" />
                                            ))}
                                          </div>
                                        </div>
                                      </td>

                                      <td className={`py-4 px-3 text-center font-mono ${resultsCriteriaFilter === 'gameplay' ? 'text-accent font-bold' : 'text-textTertiary'}`}>{item.scores.gameplay}</td>
                                      <td className={`py-4 px-3 text-center font-mono ${resultsCriteriaFilter === 'idea' ? 'text-accent font-bold' : 'text-textTertiary'}`}>{item.scores.idea}</td>
                                      <td className={`py-4 px-3 text-center font-mono ${resultsCriteriaFilter === 'art' ? 'text-accent font-bold' : 'text-textTertiary'}`}>{item.scores.art}</td>
                                      <td className={`py-4 px-3 text-center font-mono ${resultsCriteriaFilter === 'polish' ? 'text-accent font-bold' : 'text-textTertiary'}`}>{item.scores.polish}</td>

                                      <td className={`py-4 px-4 text-right font-mono font-black text-body-sm whitespace-nowrap ${resultsCriteriaFilter === 'overall' ? 'text-accent' : 'text-white'}`}>
                                        {item.totalScore} ★
                                      </td>

                                      <td className="py-4 px-3 text-center font-mono text-caption">
                                        <span className="text-textTertiary" title={`Проект оценили ${item.votesCount} участников`}>
                                          {item.votesCount}
                                        </span>
                                      </td>

                                      <td className="py-4 px-4 text-center">
                                        <button 
                                          onClick={(e) => { e.stopPropagation(); }}
                                          className="text-textTertiary hover:text-white p-1 transition-colors"
                                        >
                                          {isExpanded ? <ChevronUp className="w-4 h-4 text-accent" /> : <ChevronDown className="w-4 h-4" />}
                                        </button>
                                      </td>
                                    </tr>

                                    {isExpanded && (
                                      <tr className="bg-surface-0 border-b border-borderDef border-l-2 border-l-accent animate-fadeIn">
                                        <td colSpan={10} className="p-5 pl-7">
                                          <div className="flex flex-col gap-4 max-w-3xl mx-auto">
                                            
                                            {item.isTieBreak && (
                                              <div className="bg-accent/10 border border-accent/30 text-accent p-2.5 rounded-lg font-mono text-caption flex items-center gap-2">
                                                <Info className="w-4 h-4 shrink-0" />
                                                <span><strong>Правило тай-брейка:</strong> {item.tieBreakReason}</span>
                                              </div>
                                            )}

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                              <div className="bg-surface-0 border border-borderDef p-4 rounded-xl space-y-3 font-mono text-caption">
                                                <h5 className="font-bold text-accent uppercase tracking-wider">Детализация баллов судей</h5>
                                                <div className="space-y-2">
                                                  <div className="flex justify-between border-b border-borderDef pb-1"><span>Геймплей:</span> <strong className="text-white">{item.scores.gameplay} / 5.00</strong></div>
                                                  <div className="flex justify-between border-b border-borderDef pb-1"><span>Идея:</span> <strong className="text-white">{item.scores.idea} / 5.00</strong></div>
                                                  <div className="flex justify-between border-b border-borderDef pb-1"><span>Арт:</span> <strong className="text-white">{item.scores.art} / 5.00</strong></div>
                                                  <div className="flex justify-between pb-1"><span>Звук:</span> <strong className="text-white">{item.scores.polish} / 5.00</strong></div>
                                                </div>
                                              </div>

                                              <div className="bg-surface-0 border border-borderDef p-4 rounded-xl space-y-3 font-sans text-caption">
                                                <h5 className="font-mono font-bold text-accent uppercase tracking-wider">Отзывы судейской коллегии</h5>
                                                {item.juryFeedback && item.juryFeedback.length > 0 ? (
                                                  <div className="space-y-3">
                                                    {item.juryFeedback.map((fb, idx) => (
                                                      <div key={idx} className="border-b border-borderDef last:border-b-0 pb-2">
                                                        <div className="flex items-center gap-2 mb-1">
                                                          <img src={fb.avatar} className="w-4 h-4 rounded-full" alt="" />
                                                          <span className="font-bold text-white">{fb.judge}</span>
                                                          <span className="text-caption font-mono text-textTertiary">({fb.role})</span>
                                                        </div>
                                                        <p className="text-textSecondary italic">"{fb.comment}"</p>
                                                      </div>
                                                    ))}
                                                  </div>
                                                ) : (
                                                  <p className="text-textTertiary italic">Публичный вердикт жюри формируется...</p>
                                                )}
                                              </div>
                                            </div>

                                          </div>
                                        </td>
                                      </tr>
                                    )}
                                  </React.Fragment>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      ) : null}

                      </section>

                    </>
                  )}

                </div>
              )}

            </main>

            {/* === ПРАВАЯ КОЛОНКА (САЙДБАР) === */}
            {activeTab === 'overview' && (
              <aside className="w-full shrink-0 flex flex-col gap-5 text-caption sm:text-body-sm text-textPrimary select-none lg:sticky lg:top-20 lg:self-start">
              {/* РАСПРЕДЕЛЕНИЕ ПРИЗОВ В САЙДБАРЕ */}
              <div className="bg-surface-2 border border-borderDef rounded-xl p-5 flex flex-col gap-4">
                <div className="flex items-center gap-2 text-textPrimary">
                  <Award className="w-5 h-5 text-accent" />
                  <span className="text-body-sm font-bold tracking-tight">Распределение призов</span>
                </div>

                <div className="flex flex-col gap-3">
                  {JAM_DATA.prizes.map((p, i) => {
                    const icons = [
                      <Trophy className="w-5 h-5 text-celebratory shrink-0" />,
                      <Medal className="w-5 h-5 text-textSecondary shrink-0" />,
                      <Award className="w-5 h-5 text-warning shrink-0" />
                    ];
                    return (
                      <div key={i} className="flex items-start justify-between gap-4 group">
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="group-hover:scale-110 transition-transform flex items-center">{icons[i]}</span>
                          <span className="text-body-sm text-textSecondary whitespace-nowrap">{p.place}</span>
                        </div>
                        <span className="text-body-sm font-bold text-textPrimary text-right break-words mt-0.5">{p.sum}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* БЛОК ВНЕШНЕЙ ПОДДЕРЖКИ ПРИЗОВОГО ФОНДА (FE-CSP-004, AC-CSP-013, BR-CSP-018, BR-CSP-020) */}
              <div className="bg-surface-2 border border-borderDef rounded-xl p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-textPrimary">
                    <Coins className="w-5 h-5 text-accent" />
                    <span className="text-body-sm font-bold tracking-tight">Поддержка призового фонда</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/15 text-accent border border-accent/30 font-bold">
                    Внешний сбор
                  </span>
                </div>

                <div className="p-3 bg-surface-1 border border-borderDef rounded-lg flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-textSecondary">Фонд от комьюнити:</span>
                    <span className="font-mono font-bold text-textPrimary">{JAM_DATA.stats.prizePool}</span>
                  </div>
                  <div className="h-1.5 bg-surface-3 rounded-full overflow-hidden">
                    <div className="h-full bg-accent w-[72%]" />
                  </div>
                  <span className="text-[11px] text-textTertiary leading-normal">
                    Цель: $3,500. Все средства направляются победителям джема.
                  </span>
                </div>

                <p className="text-[11px] text-textSecondary leading-normal">
                  HUBIGR не собирает донаты в эскроу и не взимает комиссий (0%). Внести вклад в призовой фонд можно на официальной странице сбора организатора.
                </p>

                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedJamSupportUrl('https://boosty.to/hubigr_studio/jam-prize');
                      setSelectedJamSupportPlatform('Boosty оргкомитета');
                    }}
                    className="w-full py-2.5 px-3 bg-accent hover:bg-accent-hover text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
                  >
                    <Heart className="w-3.5 h-3.5" />
                    <span>Пополнить фонд (Boosty)</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedJamSupportUrl('https://pay.cloudtips.ru/p/hubigr-jam-fund');
                      setSelectedJamSupportPlatform('CloudTips (СБП)');
                    }}
                    className="w-full py-2 px-3 bg-surface-1 hover:bg-surface-3 border border-borderDef text-textSecondary hover:text-textPrimary text-xs font-medium rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>Чаевые фонда (CloudTips)</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* ОРГАНИЗАТОРЫ И ЖЮРИ */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-textTertiary" />
                  <span className="text-caption text-textTertiary font-bold tracking-wide">Организаторы и жюри</span>
                </div>
                
                <div className="flex items-center gap-3 bg-surface-1 border border-borderDef hover:border-borderStrong p-3 rounded-lg transition-colors">
                  <img src={JAM_DATA.organizer.avatar} className="w-10 h-10 rounded-full bg-surface-2" alt="" />
                  <div>
                    <h5 className="text-body-sm font-bold text-textPrimary">{JAM_DATA.organizer.name}</h5>
                    <span className="text-caption text-accent font-medium">{JAM_DATA.organizer.role}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  {JAM_DATA.jury.map(j => (
                    <div key={j.id} className="flex items-center gap-3 p-2.5 hover:bg-surface-1 rounded-lg transition-colors cursor-pointer">
                      <img src={j.avatar} className="w-8 h-8 rounded-full bg-surface-2" alt="" />
                      <div>
                        <span className="text-body-sm font-bold text-textPrimary block">{j.name}</span>
                        <span className="text-caption text-textTertiary">{j.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <hr className="border-t border-borderDef" />

              {/* СПОНСОРЫ И ПАРТНЕРЫ (FE-JORG-003, AC-JORG-034) */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-textTertiary" />
                    <span className="text-caption text-textTertiary font-bold tracking-wide">Партнеры соревнования</span>
                  </div>
                  {verifiedPartners.length > 0 && (
                    <span className="text-[10px] font-mono text-accent bg-accent/10 px-1.5 py-0.5 rounded font-bold">
                      Verified
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {JAM_DATA.sponsors.map((s, i) => (
                    <div 
                      key={i} 
                      className="bg-surface-1 border border-borderDef hover:border-borderStrong p-3 rounded-lg text-center flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      title={s.name}
                    >
                      <img src={s.logo} className="w-7 h-7 rounded" alt={s.name} />
                      <span className="text-caption text-textTertiary font-medium truncate w-full">{s.name}</span>
                    </div>
                  ))}
                  {verifiedPartners.map(p => (
                    <a 
                      key={p.id}
                      href={p.websiteUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-surface-1 border border-accent/30 hover:border-accent p-3 rounded-lg text-center flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      title={`${p.name} (Официальный верифицированный партнер)`}
                    >
                      <div className="w-7 h-7 rounded bg-accent/20 flex items-center justify-center text-accent text-caption font-bold">
                        {p.name.charAt(0)}
                      </div>
                      <span className="text-caption text-accent font-medium truncate w-full">{p.name}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* ЖАЛОБА */}
              <button onClick={() => setActiveDrawer('report')} className="text-caption text-textTertiary hover:text-danger flex items-center gap-2 transition-colors cursor-pointer min-h-[44px]">
                <Flag className="w-3.5 h-3.5" /> <span>Заявить о нарушении правил джема</span>
              </button>

            </aside>
            )}

          </div>
        </>
      )}

      {/* =========================================================================
          4. ДИАЛОГОВЫЕ ОКНА И OFFCANVAS DRAWERS
          ========================================================================= */}

      {/* DRAWER: СОЗДАТЬ ТЕМУ ОБСУЖДЕНИЯ */}
      <Drawer
        isOpen={activeDrawer === 'addDiscussion'}
        onClose={() => setActiveDrawer(null)}
        title="Создать тему"
        icon={<MessageSquarePlus className="w-5 h-5" />}
        size="md"
      >
        <div className="flex flex-col gap-6 -mx-6 -my-6 p-6">
          <div className="flex flex-col gap-1.5">
            <label className="block text-body-sm font-semibold text-textPrimary">
              <span className="font-mono text-caption text-accent font-bold uppercase tracking-wider">1.</span> Категория темы <span className="text-danger">*</span>
            </label>
            <CustomSelect 
              value={newThreadTag} 
              onChange={setNewThreadTag} 
              options={[
                { value: 'Вопросы к организаторам', label: 'Вопросы к организаторам' },
                { value: 'Идеи и Ресурсы', label: 'Идеи и Ресурсы' },
                { value: 'Общий чат / Флуд', label: 'Общий чат / Флуд' },
                { value: 'Объявления / FAQ', label: 'Объявления / FAQ' },
              ]}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="block text-body-sm font-semibold text-textPrimary">
              <span className="font-mono text-caption text-accent font-bold uppercase tracking-wider">2.</span> Заголовок темы <span className="text-danger">*</span>
            </label>
            <input 
              type="text"
              maxLength={120}
              value={newThreadTitle}
              onChange={e => setNewThreadTitle(e.target.value)}
              placeholder="Короткая суть вашего вопроса или темы..."
              className="bg-surface-2 border border-borderDef text-textPrimary p-3 text-body-sm rounded-lg outline-none transition-colors placeholder:text-textTertiary"
            />
            <span className="text-caption font-mono text-textTertiary self-end">{newThreadTitle.length}/120</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="block text-body-sm font-semibold text-textPrimary">
              <span className="font-mono text-caption text-accent font-bold uppercase tracking-wider">3.</span> Подробное описание <span className="text-danger">*</span>
            </label>
            <textarea 
              maxLength={10000}
              value={newThreadText}
              onChange={e => setNewThreadText(e.target.value)}
              placeholder="Напишите подробности сообщения (поддерживается форматирование Markdown/HTML)..."
              className="bg-surface-2 border border-borderDef text-textPrimary p-3 rounded-lg h-36 resize-none outline-none transition-colors text-body-sm font-sans placeholder:text-textTertiary"
            />
            <span className="text-caption font-mono text-textTertiary self-end">{newThreadText.length}/10000</span>
          </div>

          <button 
            onClick={handleCreateThread}
            disabled={isReadOnly && !isStaff}
            className="w-full bg-accent hover:bg-accent-hover disabled:opacity-40 text-white font-bold text-body-sm py-3.5 rounded-xl tracking-wide transition-all active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed mt-2"
          >
            Опубликовать тему
          </button>
        </div>
      </Drawer>

      {/* DRAWER: ОТПРАВИТЬ ПРИВАТНУЮ ВИЗИТКУ */}
      <Drawer
        isOpen={activeDrawer === 'sendContactCard'}
        onClose={() => setActiveDrawer(null)}
        title="Отправить визитку"
        icon={<Mail className="w-5 h-5" />}
        size="md"
      >
        <div className="flex flex-col gap-6 -mx-6 -my-6 p-6">
          <form onSubmit={handleSendContactCard} className="flex flex-col gap-6">
            {/* RATE LIMIT BADGE */}
            <div className="bg-surface-2 border border-borderDef p-3 rounded-lg flex items-center justify-between font-mono text-caption">
              <span className="text-textTertiary">Квота отправки визиток:</span>
              <span className="font-bold text-accent">{sentCardsCountThisHour}/5 в час</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="block text-body-sm font-semibold text-textPrimary">
                <span className="font-mono text-caption text-accent font-bold uppercase tracking-wider">1.</span> Получатель (Участник джема) <span className="text-danger">*</span>
              </label>
              <CustomSelect 
                value={targetRecipientHandle}
                onChange={setTargetRecipientHandle}
                options={JAM_PARTICIPANTS.map(p => ({
                  value: p.handle,
                  label: `${p.name} (${p.handle}) • ${p.role}`
                }))}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="block text-body-sm font-semibold text-textPrimary">
                <span className="font-mono text-caption text-accent font-bold uppercase tracking-wider">2.</span> Ваши контакты
              </label>
              
              <div className="flex flex-col gap-3">
                <input 
                  type="email"
                  value={cardEmail}
                  onChange={e => setCardEmail(e.target.value)}
                  placeholder="Email для связи"
                  className="bg-surface-2 border border-borderDef text-textPrimary p-3 text-body-sm rounded-lg outline-none transition-colors placeholder:text-textTertiary"
                />
                
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    type="text"
                    value={cardTelegram}
                    onChange={e => setCardTelegram(e.target.value)}
                    placeholder="Telegram"
                    className="bg-surface-2 border border-borderDef text-textPrimary p-3 text-body-sm rounded-lg outline-none transition-colors placeholder:text-textTertiary"
                  />
                  <input 
                    type="text"
                    value={cardDiscord}
                    onChange={e => setCardDiscord(e.target.value)}
                    placeholder="Discord"
                    className="bg-surface-2 border border-borderDef text-textPrimary p-3 text-body-sm rounded-lg outline-none transition-colors placeholder:text-textTertiary"
                  />
                </div>
                
                <input 
                  type="text"
                  value={cardWebsite}
                  onChange={e => setCardWebsite(e.target.value)}
                  placeholder="Личный сайт / Портфолио"
                  className="bg-surface-2 border border-borderDef text-textPrimary p-3 text-body-sm rounded-lg outline-none transition-colors placeholder:text-textTertiary"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="block text-body-sm font-semibold text-textPrimary">
                <span className="font-mono text-caption text-accent font-bold uppercase tracking-wider">3.</span> Личная заметка получателю
              </label>
              <textarea 
                rows={3}
                maxLength={500}
                value={cardNote}
                onChange={e => setCardNote(e.target.value)}
                placeholder="Например: Понравился ваш последний DevLog! Хотим предложить объединить усилия в роли 3D-моделлера..."
                className="bg-surface-2 border border-borderDef text-textPrimary p-3 text-body-sm rounded-lg resize-none outline-none transition-colors placeholder:text-textTertiary"
              />
            </div>

            <button 
              type="submit"
              disabled={sentCardsCountThisHour >= 5}
              className="w-full bg-accent hover:bg-accent-hover disabled:opacity-40 text-white font-bold text-body-sm py-3.5 rounded-xl tracking-wide transition-all active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed mt-2"
            >
              Передать карточку контактов
            </button>
          </form>
        </div>
      </Drawer>

      {/* MODAL: РЕГИСТРАЦИЯ НА ДЖЕМ */}
      <JamRegistrationModal
        isOpen={activeDrawer === 'register'}
        onClose={() => {
          setActiveDrawer(null);
          setUserStatus('Registered'); // Обновляем статус пользователя
        }}
        jamTitle={JAM_DATA.title}
        jamId={JAM_DATA.id}
        jamStartDate="15 марта 2026, 18:00 (UTC+3)"
        userTeams={[
          { id: 'team_1', name: 'CyberTeam One', role: 'Капитан' },
          { id: 'team_2', name: 'NocturnalDevs', role: 'Участник' },
        ]}
        triggerToast={triggerToast}
        isEditMode={userStatus === 'Registered'}
        currentData={userStatus === 'Registered' ? {
          participationType: 'solo',
          role: 'Геймдизайнер',
          isLookingForTeam: true
        } : undefined}
      />

      {/* DRAWER: LFG / НАЙТИ КОМАНДУ */}
      <Drawer
        isOpen={activeDrawer === 'lfg'}
        onClose={() => setActiveDrawer(null)}
        title="Опубликовать заявку LFG"
        icon={<Users className="w-5 h-5" />}
        size="md"
      >
        <div className="flex flex-col gap-6 -mx-6 -my-6 p-6">
          <div className="flex flex-col gap-2">
            <label className="block text-body-sm font-semibold text-textPrimary">
              <span className="font-mono text-caption text-accent font-bold uppercase tracking-wider">1.</span> Формат заявки
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setLfgType('solo')}
                className={`py-3 px-2 rounded-lg border font-mono text-caption font-bold transition-all cursor-pointer text-center ${lfgType === 'solo' ? 'bg-surface-2 border-accent text-accent' : 'bg-surface-2 border-borderDef text-textTertiary hover:border-borderStrong'}`}
              >
                🙋 Я соло (Ищу команду)
              </button>
              <button 
                onClick={() => setLfgType('team')}
                className={`py-3 px-2 rounded-lg border font-mono text-caption font-bold transition-all cursor-pointer text-center ${lfgType === 'team' ? 'bg-surface-2 border-accent text-accent' : 'bg-surface-2 border-borderDef text-textTertiary hover:border-borderStrong'}`}
              >
                👥 Ищем специалиста
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="block text-body-sm font-semibold text-textPrimary">
              <span className="font-mono text-caption text-accent font-bold uppercase tracking-wider">2.</span> Основная роль / Вакансия
            </label>
            <CustomSelect 
              value={lfgSpecialization} 
              onChange={setLfgSpecialization} 
              options={[
                { value: "Программист", label: "💻 Программист" },
                { value: "2D/3D Художник", label: "🎨 2D/3D Художник" },
                { value: "Геймдизайнер", label: "📝 Геймдизайнер" },
                { value: "Саунд-дизайнер / Композитор", label: "🎵 Саунд-дизайнер / Композитор" },
                { value: "Сценарист / Нарративщик", label: "📖 Сценарист / Нарративщик" }
              ]}
              className="w-full"
              size="lg"
              variant="form"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="block text-body-sm font-semibold text-textPrimary">
              <span className="font-mono text-caption text-accent font-bold uppercase tracking-wider">3.</span> Ссылка на портфолио / Профиль
            </label>
            <input 
              type="text"
              value={lfgPortfolio}
              onChange={e => setLfgPortfolio(e.target.value)}
              placeholder="Например: artstation.com/myname или github.com/user"
              className="bg-surface-2 border border-borderDef text-textPrimary p-3 text-body-sm rounded-lg outline-none transition-colors placeholder:text-textTertiary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="block text-body-sm font-semibold text-textPrimary">
              <span className="font-mono text-caption text-accent font-bold uppercase tracking-wider">4.</span> Контакты связи (Telegram / Discord) <span className="text-danger">*</span>
            </label>
            <input 
              type="text"
              value={lfgContacts}
              onChange={e => setLfgContacts(e.target.value)}
              placeholder="Например: @username (Telegram) или Discord ID"
              className="bg-surface-2 border border-borderDef text-textPrimary p-3 text-body-sm rounded-lg outline-none transition-colors placeholder:text-textTertiary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="block text-body-sm font-semibold text-textPrimary">
              <span className="font-mono text-caption text-accent font-bold uppercase tracking-wider">5.</span> Описание заявки / Проекта <span className="text-danger">*</span>
            </label>
            <textarea 
              value={lfgDescription}
              onChange={e => setLfgDescription(e.target.value)}
              placeholder="Расскажите о своем опыте, стеке технологий или об идее игры..."
              className="bg-surface-2 border border-borderDef text-textPrimary p-3 text-body-sm rounded-lg h-28 resize-none outline-none transition-colors placeholder:text-textTertiary"
            />
          </div>

          <button 
            onClick={handlePublishLfg}
            className="w-full bg-accent hover:bg-accent-hover text-white font-bold text-body-sm py-3.5 rounded-xl tracking-wide transition-all active:scale-[0.98] cursor-pointer mt-2"
          >
            Опубликовать в LFG
          </button>
        </div>
      </Drawer>

      {/* DRAWER: ПУБЛИКАЦИЯ ДЕВЛОГА */}
      <Drawer
        isOpen={activeDrawer === 'addDevlog'}
        onClose={() => setActiveDrawer(null)}
        title="Опубликовать DevLog"
        icon={<FileText className="w-5 h-5" />}
        size="md"
      >
        <div className="flex flex-col gap-6 -mx-6 -my-6 p-6">
          <div className="flex flex-col gap-4 text-caption sm:text-body-sm font-sans">
            <div className="flex flex-col gap-1.5">
              <label className="text-textTertiary font-mono text-overline  font-bold">Привязанная игра</label>
              <CustomSelect 
                value={selectedUserGame} 
                onChange={setSelectedUserGame} 
                options={[
                  { value: "BrokenLore: FOLLOW", label: "BrokenLore: FOLLOW" },
                  { value: "VOID DRIFTER", label: "VOID DRIFTER" }
                ]}
                className="w-full"
                size="lg"
                variant="form"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-textTertiary font-mono text-overline  font-bold">Заголовок статьи *</label>
              <input 
                type="text"
                value={newDevlogTitle}
                onChange={e => setNewDevlogTitle(e.target.value)}
                placeholder="Например: Разбор генерации лабиринта за 24 часа..."
                className="bg-surface-2 border border-borderDef text-textPrimary p-3 min-h-[44px] text-caption sm:text-body-sm rounded outline-none focus:border-accent placeholder:text-textTertiary"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-textTertiary font-mono text-overline  font-bold">Содержание статьи / Дневника *</label>
              <textarea 
                value={newDevlogSummary}
                onChange={e => setNewDevlogSummary(e.target.value)}
                placeholder="Расскажите сообществу об успехах, трудных задачах или покажите гифку механики..."
                className="bg-surface-2 border border-borderDef text-textPrimary p-3 rounded h-32 resize-none outline-none focus:border-accent text-caption sm:text-body-sm font-sans placeholder:text-textTertiary"
              />
            </div>
          </div>

          <button 
            onClick={handlePublishDevlog}
            className="w-full bg-accent hover:bg-accent-hover text-white font-bold text-caption min-h-[44px] py-3.5 rounded-xl tracking-wide transition-all active:scale-[0.98] cursor-pointer mt-4"
          >
            Опубликовать DevLog
          </button>
        </div>
      </Drawer>

      {/* DRAWER: ЖАЛОБА НА ДЖЕМ */}
      <JamAbuseReportDrawer
        isOpen={activeDrawer === 'report'}
        onClose={() => setActiveDrawer(null)}
        jamTitle={JAM_DATA.title}
        jamOrganizer={JAM_DATA.organizer.name}
        triggerToast={triggerToast}
      />

      {/* MODAL: ПОДЕЛИЦИЯ И ВИДЖЕТ */}
      <ShareJamModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        jamTitle={JAM_DATA.title}
        jamSlug={JAM_DATA.slug}
        triggerToast={triggerToast}
      />

      {/* MODAL: ОЦЕНКА ПРОЕКТА УЧАСТНИКОМ / ЖЮРИ (1-5 КРИТЕРИЕВ) */}
      <Modal
        isOpen={!!votingModalGame}
        onClose={() => setVotingModalGame(null)}
        title={`Оценить «${votingModalGame?.title}»`}
        icon={<Star className="w-4 h-4 fill-current text-accent" />}
        maxWidth="md"
      >
        <div className="space-y-6">
          <div className="space-y-4 text-xs font-sans">
            {JAM_DATA.criteria.map((crit, idx) => {
              const key = crit.name.toLowerCase().includes('геймплей') ? 'gameplay' :
                          crit.name.toLowerCase().includes('теме') ? 'theme' :
                          crit.name.toLowerCase().includes('графика') ? 'graphics' :
                          crit.name.toLowerCase().includes('звук') ? 'audio' : 'originality';
              return (
                <div key={idx} className="space-y-2 bg-surface-3/60 p-3 rounded-xl border border-borderDef/60">
                  <div className="flex justify-between items-center font-mono">
                    <span className="text-textPrimary font-bold">{crit.name} ({crit.weight})</span>
                    <span className="text-accent font-bold bg-accent/10 px-2 py-0.5 rounded border border-accent/20">{(votingScores as any)[key]} / 5</span>
                  </div>
                  <input 
                    type="range" 
                    min={1} 
                    max={5} 
                    step={1} 
                    value={(votingScores as any)[key]} 
                    onChange={e => setVotingScores({ ...votingScores, [key]: Number(e.target.value) })}
                    className="w-full accent-accent cursor-pointer"
                  />
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-borderDef">
            <button 
              onClick={() => {
                if ((window as any).__hubigrNavigate) {
                  (window as any).__hubigrNavigate(`/jury/evaluations`);
                } else {
                  window.location.hash = `#/jury/evaluations`;
                }
              }}
              className="px-3.5 py-2 text-xs font-mono text-accent hover:text-accent-hover bg-accent/10 hover:bg-accent/20 border border-accent/30 rounded-lg transition-colors cursor-pointer"
            >
              Панель жюри &rarr;
            </button>
            <div className="flex gap-2.5">
              <button 
                onClick={() => setVotingModalGame(null)} 
                className="px-4 py-2 text-xs font-semibold text-textTertiary hover:text-textPrimary rounded-lg bg-surface-2 hover:bg-surface-3 transition-colors cursor-pointer"
              >
                Отмена
              </button>
              <button 
                onClick={() => {
                  triggerToast(`Оценки для «${votingModalGame?.title}» успешно сохранены!`, 'success');
                  setVotingModalGame(null);
                }}
                className="px-5 py-2 bg-accent hover:bg-accent-hover text-white font-bold text-xs rounded-lg transition-all cursor-pointer shadow-sm active:scale-95"
              >
                Сохранить оценку
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Add To Collection Modal */}
      <AddToCollectionModal 
        isOpen={collectionGameJam !== null}
        game={collectionGameJam}
        collections={mockCollections}
        role={role}
        onClose={() => {
          console.log('JamPage: Closing modal');
          setCollectionGameJam(null);
        }}
        onSave={(gameId, collectionIds) => {
          console.log('JamPage: Saving game', gameId, 'to collections', collectionIds);
          setBookmarkedGames(prev => ({ ...prev, [gameId]: true }));
        }}
        onCreateNew={() => {
          console.log('JamPage: Create new collection');
        }}
        triggerToast={triggerToast}
      />

      {/* ANTI-PHISHING MODAL FOR JAM EXTERNAL PRIZE SUPPORT (FE-CSP-004, AC-CSP-011, AC-CSP-013) */}
      {selectedJamSupportUrl && (
        <AntiPhishingModal
          isOpen={!!selectedJamSupportUrl}
          onClose={() => setSelectedJamSupportUrl(null)}
          targetUrl={selectedJamSupportUrl}
          platformName={selectedJamSupportPlatform}
          onProceed={() => {
            creatorSupportService.recordClick('jam_prize_boosty', 'jam', JAM_DATA.id);
            window.open(selectedJamSupportUrl, '_blank', 'noopener,noreferrer');
            setSelectedJamSupportUrl(null);
          }}
        />
      )}

      {/* =========================================================================
          MOBILE CONTEXTUAL STICKY CTA BAR (above BottomAppNavBar)
          ========================================================================= */}
      <div className={`fixed bottom-[84px] left-4 right-4 h-[56px] bg-surface-1/95 backdrop-blur-xl border border-borderDef z-40 flex md:hidden items-center justify-between px-3 gap-3 rounded-2xl transition-all duration-300 ${
        showMobileStickyCta ? 'translate-y-0 opacity-100 pointer-events-auto shadow-elevation-raised' : 'translate-y-[150%] opacity-0 pointer-events-none'
      }`}>
        <div className="flex-1 min-w-0 h-10">
          {(jamPhase === 'Announcement' || jamPhase === 'Registration') && userStatus === 'NotRegistered' ? (
            <button 
              onClick={() => setActiveDrawer('register')}
              className="w-full h-full bg-accent hover:bg-accent-hover text-white font-extrabold text-xs tracking-wide rounded-xl flex items-center justify-center gap-2 cursor-pointer touch-manipulation active:scale-[0.98] shadow-sm"
            >
              <Trophy className="w-4 h-4 shrink-0" />
              <span className="truncate">Регистрация на джем</span>
            </button>
          ) : (jamPhase === 'InProgress' && userStatus === 'Registered') || (jamPhase === 'Registration' && userStatus === 'Registered') ? (
            <button 
              onClick={() => {
                if ((window as any).__hubigrNavigate) {
                  (window as any).__hubigrNavigate(`/jams/${JAM_DATA.slug}/submit`);
                } else {
                  window.location.hash = `#/jams/${JAM_DATA.slug}/submit`;
                }
              }}
              className="w-full h-full bg-accent hover:bg-accent-hover text-white font-extrabold text-xs tracking-wide rounded-xl flex items-center justify-center gap-2 cursor-pointer touch-manipulation active:scale-[0.98] shadow-sm"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span className="truncate">Подать работу</span>
            </button>
          ) : jamPhase === 'Voting' ? (
            <button 
              onClick={() => setActiveTab('submissions')}
              className="w-full h-full bg-accent hover:bg-accent-hover text-white font-extrabold text-xs tracking-wide rounded-xl flex items-center justify-center gap-2 cursor-pointer touch-manipulation active:scale-[0.98] shadow-sm"
            >
              <Star className="w-4 h-4 shrink-0" />
              <span className="truncate">Оценить проекты</span>
            </button>
          ) : (
            <button 
              onClick={() => setActiveDrawer('lfg')}
              className="w-full h-full bg-surface-2 hover:bg-surface-3 border border-borderDef text-textPrimary font-bold text-xs tracking-wide rounded-xl flex items-center justify-center gap-2 cursor-pointer touch-manipulation active:scale-[0.98]"
            >
              <Users className="w-4 h-4 shrink-0" />
              <span className="truncate">Найти команду</span>
            </button>
          )}
        </div>
        <button 
          onClick={() => setIsShareModalOpen(true)}
          className="h-10 w-10 shrink-0 bg-surface-2 hover:bg-surface-3 border border-borderDef text-textSecondary rounded-xl flex items-center justify-center cursor-pointer touch-manipulation active:scale-[0.98]"
          aria-label="Поделиться"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* JAM ORGANIZER WORKSPACE MODAL */}
      <JamOrganizerWorkspace
        isOpen={isOrganizerWorkspaceOpen}
        onClose={() => setIsOrganizerWorkspaceOpen(false)}
        jamId="jam-123"
        jamTitle={JAM_DATA.title}
      />
    </div>
  );
}