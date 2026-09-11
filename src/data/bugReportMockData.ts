import { BugReport, BugReportMessage, BugReportStatus, BugReportSeverity } from '../types/bugReport';

const STORAGE_KEY = 'hubigr_bug_reports_v1';

export const INITIAL_BUG_REPORTS: BugReport[] = [
  {
    id: 'bug_101',
    gameId: 'g_01',
    gameTitle: 'BrokenLore: FOLLOW',
    buildVersion: 'v1.2.4',
    platform: 'Windows 11 x64 / WebGL Chrome 124',
    title: 'Падение WebGL плеера при переходе в шлюзовой отсек',
    description: 'Игра аварийно закрывается с ошибкой WebGL Context Lost при открытии третьей двери в коридоре станции.',
    stepsToReproduce: '1. Запустить игру в браузере Chrome на Windows 11.\n2. Дойти до локации "Шлюз C".\n3. Нажать кнопку "Открыть гермозатвор" на настенной панели.',
    expectedResult: 'Дверь открывается со звуковым эффектом шипения гидравлики, загружается следующая комната.',
    actualResult: 'Экран замирает, через 2 секунды появляется черный экран с консольной ошибкой "WebGL: context lost".',
    reporterId: 'u_player_01',
    reporterNick: 'VoidRunner',
    reporterSeverity: 'critical',
    confirmedSeverity: 'critical',
    priority: 'urgent',
    status: 'in_progress',
    createdAt: '2026-08-20T10:15:00Z',
    updatedAt: '2026-08-21T14:30:00Z',
    triagedAt: '2026-08-20T12:00:00Z',
    attachments: [
      {
        id: 'att_01',
        name: 'webgl_console_error.log',
        url: '#',
        sizeBytes: 14200,
        mimeType: 'text/plain',
        uploadedAt: '2026-08-20T10:15:00Z',
        isSafe: true
      },
      {
        id: 'att_02',
        name: 'screenshot_lock_hang.png',
        url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800',
        sizeBytes: 340000,
        mimeType: 'image/png',
        uploadedAt: '2026-08-20T10:15:00Z',
        isSafe: true
      }
    ],
    revisions: [],
    messagesCount: 3,
    internalNotesCount: 1
  },
  {
    id: 'bug_102',
    gameId: 'g_02',
    gameTitle: 'Neon Horizon: Vector Run',
    buildVersion: 'v0.9.1-beta',
    platform: 'Windows 10 / Steam Deck',
    title: 'Инверсия стика геймпада не сохраняется после перезапуска',
    description: 'В настройках включаю инверсию оси Y для правого стика камеры. После перезапуска чекбокс сброшен.',
    stepsToReproduce: '1. Зайти в "Настройки" -> "Управление".\n2. Отметить "Инверсия по Y".\n3. Перезапустить клиент.',
    expectedResult: 'Настройка инверсии сохраняется в профиле пользователя.',
    actualResult: 'После перезапуска камера снова движется по умолчанию (без инверсии).',
    reporterId: 'u_player_02',
    reporterNick: 'DeckGamer',
    reporterSeverity: 'medium',
    confirmedSeverity: 'low',
    priority: 'low',
    status: 'new',
    createdAt: '2026-08-23T08:40:00Z',
    updatedAt: '2026-08-23T08:40:00Z',
    attachments: [],
    revisions: [],
    messagesCount: 0,
    internalNotesCount: 0
  },
  {
    id: 'bug_103',
    gameId: 'g_01',
    gameTitle: 'BrokenLore: FOLLOW',
    buildVersion: 'v1.2.4',
    platform: 'macOS Sonoma 14.4 / Safari 17',
    title: 'Фоновая эмбиент-музыка заикается в главном меню',
    description: 'При загрузке стартового экрана музыка воспроизводится рывками, как будто буфер переполнен.',
    stepsToReproduce: '1. Открыть игру в браузере Safari на macOS.\n2. Дождаться появления меню и послушать 15 секунд трек.',
    expectedResult: 'Чистое бесшовное воспроизведение саундтрека.',
    actualResult: 'Каждые 3 секунды слышны щелчки аудио-контекста.',
    reporterId: 'u_player_03',
    reporterNick: 'AudioPhile',
    reporterSeverity: 'low',
    confirmedSeverity: 'medium',
    priority: 'medium',
    status: 'confirmed',
    createdAt: '2026-08-22T19:00:00Z',
    updatedAt: '2026-08-23T11:20:00Z',
    triagedAt: '2026-08-23T11:20:00Z',
    attachments: [],
    revisions: [],
    messagesCount: 1,
    internalNotesCount: 0
  },
  {
    id: 'bug_104',
    gameId: 'g_03',
    gameTitle: 'Void Drifter: Zero G',
    buildVersion: 'v0.1.0-dev',
    platform: 'Windows 11 x64',
    title: 'Бесконечное ускорение при зажатии Shift и Пробела',
    description: 'Корабль развивает сверхсветовую скорость и вылетает за пределы скайбокса карты.',
    stepsToReproduce: '1. Войти в режим свободного дрифта.\n2. Одновременно зажать Shift + Space и удерживать 5 секунд.',
    expectedResult: 'Ускоритель перегревается и тяга отключается.',
    actualResult: 'Вектор скорости экспоненциально растет, физический движок ломает коллизии.',
    reporterId: 'u_player_04',
    reporterNick: 'SpeedDemon',
    reporterSeverity: 'high',
    confirmedSeverity: 'high',
    priority: 'high',
    status: 'fixed',
    resolvedAt: '2026-08-21T16:00:00Z',
    createdAt: '2026-08-19T14:10:00Z',
    updatedAt: '2026-08-21T16:00:00Z',
    triagedAt: '2026-08-19T15:00:00Z',
    attachments: [],
    revisions: [],
    messagesCount: 2,
    internalNotesCount: 1
  },
  {
    id: 'bug_105',
    gameId: 'g_01',
    gameTitle: 'BrokenLore: FOLLOW',
    buildVersion: 'v1.2.3',
    platform: 'Windows 11',
    title: 'Вылет при загрузке 4 главы',
    description: 'Старый краш при загрузке тяжелых шейдеров в устаревшем билде.',
    stepsToReproduce: '1. Загрузить сохранение главы 4.',
    expectedResult: 'Успешная загрузка.',
    actualResult: 'Зависание.',
    reporterId: 'u_player_05',
    reporterNick: 'RetroGamer',
    reporterSeverity: 'critical',
    status: 'rejected',
    rejectedReason: 'Проблема не воспроизводится в актуальной версии v1.2.4. Пожалуйста, обновите клиент игры.',
    createdAt: '2026-08-18T12:00:00Z',
    updatedAt: '2026-08-18T13:45:00Z',
    triagedAt: '2026-08-18T13:45:00Z',
    attachments: [],
    revisions: [],
    messagesCount: 1,
    internalNotesCount: 0
  },
  {
    id: 'bug_106',
    gameId: 'g_01',
    gameTitle: 'BrokenLore: FOLLOW',
    buildVersion: 'v1.2.4',
    platform: 'WebGL / Windows',
    title: 'Краш при открытии двери шлюза C',
    description: 'Дубликат критического бага с падением WebGL.',
    stepsToReproduce: 'Открыть дверь шлюза C.',
    expectedResult: 'Дверь открывается.',
    actualResult: 'Вылет браузера.',
    reporterId: 'u_player_06',
    reporterNick: 'NovaPilot',
    reporterSeverity: 'high',
    status: 'duplicate',
    duplicateOfBugReportId: 'bug_101',
    isDuplicateTargetVisible: true,
    createdAt: '2026-08-21T09:00:00Z',
    updatedAt: '2026-08-21T11:00:00Z',
    triagedAt: '2026-08-21T11:00:00Z',
    attachments: [],
    revisions: [],
    messagesCount: 0,
    internalNotesCount: 0
  }
];

export const INITIAL_BUG_MESSAGES: Record<string, BugReportMessage[]> = {
  bug_101: [
    {
      id: 'msg_01',
      bugReportId: 'bug_101',
      authorId: 'u_dev_01',
      authorName: 'NocturnalDevs',
      authorRole: 'creator',
      content: 'Спасибо за подробный лог! Мы воспроизвели проблему в Chrome 124 при включенном аппаратном ускорении Angle D3D11.',
      visibility: 'public_to_reporter',
      createdAt: '2026-08-20T12:05:00Z'
    },
    {
      id: 'msg_02',
      bugReportId: 'bug_101',
      authorId: 'u_dev_01',
      authorName: 'NocturnalDevs',
      authorRole: 'creator',
      content: 'NOTE ДЛЯ КОМАНДЫ: Проблема в шейдере `Standard_Airlock_Emissive.shader`. Не освобождается RenderTexture буфера глубины.',
      visibility: 'creator_only',
      createdAt: '2026-08-20T12:08:00Z'
    },
    {
      id: 'msg_03',
      bugReportId: 'bug_101',
      authorId: 'u_player_01',
      authorName: 'VoidRunner',
      authorRole: 'reporter',
      content: 'Отлично! Если нужен дополнительный лог памяти или тест нового тестового веб-билда, готов помочь.',
      visibility: 'public_to_reporter',
      createdAt: '2026-08-21T14:30:00Z'
    }
  ],
  bug_104: [
    {
      id: 'msg_10',
      bugReportId: 'bug_104',
      authorId: 'u_dev_02',
      authorName: 'Pixel Pioneers',
      authorRole: 'creator',
      content: 'Исправлено в коммите `fix/rigidbody-clamping`. Ограничили максимальную линейную скорость до 250 м/с.',
      visibility: 'creator_only',
      createdAt: '2026-08-21T15:30:00Z'
    },
    {
      id: 'msg_11',
      bugReportId: 'bug_104',
      authorId: 'u_dev_02',
      authorName: 'Pixel Pioneers',
      authorRole: 'creator',
      content: 'Проблема устранена в хотфиксе v0.1.1-dev. Благодарим за содействие!',
      visibility: 'public_to_reporter',
      createdAt: '2026-08-21T16:00:00Z'
    }
  ]
};

// Storage Helpers
export function getStoredBugReports(): BugReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse stored bug reports:', e);
  }
  return INITIAL_BUG_REPORTS;
}

export function saveStoredBugReports(reports: BugReport[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  } catch (e) {
    console.error('Failed to save bug reports:', e);
  }
}

export function getStoredBugMessages(bugId: string): BugReportMessage[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_msgs_${bugId}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse bug messages:', e);
  }
  return INITIAL_BUG_MESSAGES[bugId] || [];
}

export function saveStoredBugMessages(bugId: string, msgs: BugReportMessage[]) {
  try {
    localStorage.setItem(`${STORAGE_KEY}_msgs_${bugId}`, JSON.stringify(msgs));
  } catch (e) {
    console.error('Failed to save bug messages:', e);
  }
}
