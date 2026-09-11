import { BugReport } from '../types/bugReport';

export const MOCK_BUG_REPORTS: BugReport[] = [
  {
    id: 'bug-101',
    gameId: 'g1',
    gameTitle: 'Neon Drift',
    reporterId: 'user-88',
    reporterName: 'CyberPunk2077_Fan',
    buildVersion: 'v1.0.4',
    platform: 'windows',
    title: 'Игра вылетает при входе в меню настроек графики',
    description: 'Когда я нажимаю "Настройки" -> "Графика" в главном меню, игра полностью зависает на секунду, а затем вылетает на рабочий стол без сообщения об ошибке.',
    expectedBehavior: 'Должно открыться меню настроек графики.',
    actualBehavior: 'Происходит краш игры (CTD).',
    reporterSeverity: 'high',
    triageSeverity: 'critical',
    status: 'in_progress',
    attachments: [
      { id: 'att-1', name: 'crash_log.txt', size: 14500, type: 'log', url: '#' },
      { id: 'att-2', name: 'screenshot.png', size: 1024000, type: 'image', url: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&q=80&w=600' }
    ],
    comments: [
      {
        id: 'c-1',
        authorId: 'user-88',
        authorName: 'CyberPunk2077_Fan',
        isCreator: false,
        isInternal: false,
        content: 'Могу прислать дамп памяти, если нужно.',
        createdAt: '2026-09-05T10:00:00Z'
      },
      {
        id: 'c-2',
        authorId: 'dev-1',
        authorName: 'alex_dev',
        isCreator: true,
        isInternal: true, // BR-BUG-025: Internal Note
        content: 'Похоже на утечку в UI Shader. Нужно проверить загрузку ассетов в Canvas.',
        createdAt: '2026-09-05T10:15:00Z'
      },
      {
        id: 'c-3',
        authorId: 'dev-1',
        authorName: 'alex_dev',
        isCreator: true,
        isInternal: false,
        content: 'Спасибо за репорт! Дамп памяти пока не нужен, мы уже смогли воспроизвести эту проблему. Работаем над фиксом.',
        createdAt: '2026-09-05T10:18:00Z'
      }
    ],
    createdAt: '2026-09-05T09:45:00Z',
    updatedAt: '2026-09-05T10:18:00Z'
  },
  {
    id: 'bug-102',
    gameId: 'g1',
    gameTitle: 'Neon Drift',
    reporterId: 'user-88',
    reporterName: 'QA_Ninja',
    buildVersion: 'v1.0.4',
    platform: 'webgl',
    title: 'Опечатка в диалоге с торговцем',
    description: 'В третьем акте торговец говорит "Здраствуйте" вместо "Здравствуйте".',
    expectedBehavior: 'Текст без грамматических ошибок.',
    actualBehavior: 'Текст с ошибкой.',
    reporterSeverity: 'low',
    triageSeverity: 'low',
    status: 'fixed',
    attachments: [],
    comments: [],
    createdAt: '2026-09-02T14:20:00Z',
    updatedAt: '2026-09-03T09:00:00Z'
  },
  {
    id: 'bug-103',
    gameId: 'g2',
    gameTitle: 'Cyber Hunter',
    reporterId: 'user-88',
    reporterName: 'Speedrunner_Max',
    buildVersion: 'v0.9.1b',
    platform: 'mac_os',
    title: 'Провал под текстуры в стартовой локации',
    description: 'Если прыгнуть в левый угол гаража во время анимации спавна, персонаж проваливается под карту и падает бесконечно.',
    expectedBehavior: 'Коллизия должна не пускать персонажа за пределы уровня.',
    actualBehavior: 'Отсутствие коллизии в углу.',
    reporterSeverity: 'medium',
    triageSeverity: 'medium',
    status: 'duplicate',
    duplicateTargetId: 'bug-089',
    attachments: [],
    comments: [
      {
        id: 'c-4',
        authorId: 'dev-2',
        authorName: 'level_designer_bob',
        isCreator: true,
        isInternal: false,
        content: 'Этот баг уже известен и пофикшен в следующем патче (дубликат #bug-089).',
        createdAt: '2026-09-06T11:00:00Z'
      }
    ],
    createdAt: '2026-09-06T10:30:00Z',
    updatedAt: '2026-09-06T11:00:00Z'
  },
  {
    id: 'bug-104',
    gameId: 'g1',
    gameTitle: 'Neon Drift',
    reporterId: 'user-55',
    reporterName: 'AngryGamer',
    buildVersion: 'v1.0.4',
    platform: 'windows',
    title: 'Добавьте мультиплеер!!!',
    description: 'Игра скучная без мультиплеера. Сделайте онлайн!',
    expectedBehavior: 'Онлайн режим.',
    actualBehavior: 'Только синглплеер.',
    reporterSeverity: 'critical',
    triageSeverity: null,
    status: 'rejected',
    rejectedReason: 'Это не баг, а фиче-реквест (Feature Request). Мультиплеер пока не планируется.',
    attachments: [],
    comments: [],
    createdAt: '2026-09-06T12:00:00Z',
    updatedAt: '2026-09-06T12:15:00Z'
  },
  {
    id: 'bug-105',
    gameId: 'g2',
    gameTitle: 'Cyber Hunter',
    reporterId: 'user-77',
    reporterName: 'Tester_01',
    buildVersion: 'v0.9.1b',
    platform: 'windows',
    title: 'Сломан сейв после загрузки чекпоинта',
    description: 'Загрузил чекпоинт перед боссом, инвентарь полностью пустой.',
    expectedBehavior: 'Инвентарь должен сохраняться.',
    actualBehavior: 'Инвентарь обнуляется.',
    reporterSeverity: 'high',
    triageSeverity: null,
    status: 'new',
    attachments: [],
    comments: [],
    createdAt: '2026-09-06T16:00:00Z',
    updatedAt: '2026-09-06T16:00:00Z'
  }
];

const STORAGE_KEY = 'habr_game_bugs_v1';

export const getStoredBugReports = (): BugReport[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load bug reports from localStorage', e);
  }
  return [...MOCK_BUG_REPORTS];
};

export const saveStoredBugReports = (bugs: BugReport[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bugs));
  } catch (e) {
    console.error('Failed to save bug reports to localStorage', e);
  }
};

export const addBugReport = (newBug: BugReport): BugReport => {
  const current = getStoredBugReports();
  const updated = [newBug, ...current];
  saveStoredBugReports(updated);
  return newBug;
};

export const updateBugReport = (id: string, patch: Partial<BugReport>): BugReport | null => {
  const current = getStoredBugReports();
  const idx = current.findIndex(b => b.id === id);
  if (idx === -1) return null;
  const updatedBug = { ...current[idx], ...patch, updatedAt: new Date().toISOString() };
  current[idx] = updatedBug;
  saveStoredBugReports(current);
  return updatedBug;
};

export const withdrawBugReport = (id: string): boolean => {
  const current = getStoredBugReports();
  const target = current.find(b => b.id === id);
  // Only allow withdrawing new untriaged reports (BR-BUG-031, SC-BUG-014)
  if (!target || target.status !== 'new') return false;
  const filtered = current.filter(b => b.id !== id);
  saveStoredBugReports(filtered);
  return true;
};
