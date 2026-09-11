import { CommunityCategory, CommunityThread } from '../types/community';

export const MOCK_COMMUNITY_CATEGORIES: CommunityCategory[] = [
  { id: 'cat-general', slug: 'general', name: 'Общее', description: 'Обсуждение платформы, индустрии и свободное общение.', status: 'active', order: 1 },
  { id: 'cat-questions', slug: 'questions', name: 'Вопросы', description: 'Помощь, советы и решение проблем.', status: 'active', order: 2 },
  { id: 'cat-gamedesign', slug: 'gamedesign', name: 'Геймдизайн', description: 'Механики, левелдизайн, нарратив.', status: 'active', order: 3 },
  { id: 'cat-art', slug: 'art', name: 'Арт', description: '2D, 3D, анимация, UI/UX и визуальный стиль.', status: 'active', order: 4 },
  { id: 'cat-code', slug: 'code', name: 'Код', description: 'Программирование, архитектура, движки.', status: 'active', order: 5 },
  { id: 'cat-audio', slug: 'audio', name: 'Звук', description: 'Саундтреки, SFX, озвучка и аудио-движки.', status: 'active', order: 6 },
];

export const MOCK_COMMUNITY_THREADS: CommunityThread[] = [
  {
    id: 'th-001',
    categoryId: 'cat-code',
    type: 'normal',
    title: 'Оптимизация физики в 2D платформере на Godot 4',
    bodyMarkdown: 'Всем привет! Делаю платформер, и на мобилках сильно проседает FPS из-за большого количества физических объектов. Какие есть best practices?',
    authorId: 'u-1',
    authorNick: 'gamedev_alex',
    authorAvatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    visibilityState: 'published',
    discussionState: 'open',
    isOfficial: false,
    isPinned: false,
    isSolved: true,
    solutionPostId: 'p-101',
    linkedGameName: 'Cyber Quest',
    linkedGameSlug: 'cyber-quest',
    linkedJamName: 'Summer 2026',
    linkedJamSlug: 'summer-2026',
    tags: ['godot', 'physics', 'optimization', '2d'],
    normalizedViews: 1240,
    repliesCount: 18,
    likesCount: 45,
  },
  {
    id: 'th-002',
    categoryId: 'cat-general',
    type: 'looking_for_team',
    title: 'Ищем 2D-художника для метроидвании в стиле Hollow Knight',
    bodyMarkdown: 'У нас готов кор-геймплей и прототип уровня, но не хватает крутого артовика.',
    authorId: 'u-2',
    authorNick: 'hollow_studio',
    authorAvatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=hollow',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    visibilityState: 'published',
    discussionState: 'open',
    isOfficial: false,
    isPinned: true,
    isSolved: false,
    tags: ['lookingforteam', '2d', 'artist'],
    normalizedViews: 850,
    repliesCount: 12,
    likesCount: 30,
    lookingForTeamDetails: {
      roles: ['2D-художник', 'Аниматор'],
      participationFormat: 'revshare',
      summary: 'Нужен художник для мрачной метроидвании на RevShare',
      engine: 'Unity',
      skills: ['Spine', 'Photoshop', 'Frame-by-frame'],
      experience: 'mid',
      searchState: 'active'
    }
  },
  {
    id: 'th-003',
    categoryId: 'cat-gamedesign',
    type: 'need_feedback',
    title: 'Прототип боевки: нужны отзывы по таймингам парирования',
    bodyMarkdown: 'Залил веб-билд. Попробуйте поймать окно парирования у босса.',
    authorId: 'u-3',
    authorNick: 'soulslike_fan',
    authorAvatarUrl: 'https://api.dicebear.com/7.x/micah/svg?seed=souls',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    visibilityState: 'published',
    discussionState: 'open',
    isOfficial: false,
    isPinned: false,
    isSolved: false,
    linkedGameName: 'Parry Master',
    linkedGameSlug: 'parry-master',
    tags: ['combat', 'feedback', 'webgl'],
    normalizedViews: 420,
    repliesCount: 8,
    likesCount: 15,
    needFeedbackDetails: {
      feedbackCategories: ['Gameplay', 'Balance', 'UI-UX'],
      questions: ['Чувствуется ли импакт?', 'Окно парирования слишком узкое?'],
      platform: ['WebGL'],
      estimatedTime: '5-10 минут'
    }
  },
  {
    id: 'th-004',
    categoryId: 'cat-art',
    type: 'show_progress',
    title: 'Перерисовали освещение на первом уровне (Скриншоты)',
    bodyMarkdown: 'Перешли с baked GI на Lumen в Unreal 5. Как вам разница?',
    authorId: 'u-4',
    authorNick: 'unreal_dev',
    authorAvatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=unreal',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    visibilityState: 'published',
    discussionState: 'open',
    isOfficial: false,
    isPinned: false,
    isSolved: false,
    tags: ['ue5', 'lighting', 'graphics'],
    normalizedViews: 2100,
    repliesCount: 34,
    likesCount: 112,
    showProgressDetails: {
      mediaUrls: ['https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2000&auto=format&fit=crop']
    }
  },
  {
    id: 'th-005',
    categoryId: 'cat-general',
    type: 'normal',
    title: 'Обновление правил раздела "Поиск команды"',
    bodyMarkdown: 'Пожалуйста, ознакомьтесь с новыми правилами формирования команд для предстоящего HUBIGR Jam #5.',
    authorId: 'u-admin',
    authorNick: 'hubigr_team',
    authorAvatarUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=admin',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    visibilityState: 'published',
    discussionState: 'locked',
    isOfficial: true,
    isPinned: true,
    isSolved: false,
    tags: ['news', 'rules', 'jam'],
    normalizedViews: 5400,
    repliesCount: 0,
    likesCount: 230,
  },
  {
    id: 'th-006',
    categoryId: 'cat-general',
    type: 'share_reference',
    title: 'Обсуждение нового DevLog #12: Оружие',
    bodyMarkdown: 'Делитесь мнениями по новому UI и пушкам здесь!',
    authorId: 'u-1',
    authorNick: 'gamedev_alex',
    authorAvatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    visibilityState: 'published',
    discussionState: 'open',
    isOfficial: false,
    isPinned: false,
    isSolved: false,
    tags: ['devlog', 'weapons', 'ui'],
    normalizedViews: 320,
    repliesCount: 5,
    likesCount: 18,
    shareReferenceDetails: {
      sourceType: 'devlog',
      sourceId: 'dl-99',
      sourceTitle: 'Девлог: Переработка интерфейса и инвентаря',
      sourcePreview: 'На этой неделе мы полностью переработали систему инвентаря. Теперь предметы можно группировать и перетаскивать...',
      sourceUrl: '/games/neon-shadow/devlog/99',
      sourceAuthorNick: 'gamedev_alex',
      sourceCreatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    }
  }
];

import { CommunityComment } from '../types/communityComment';

export const MOCK_COMMUNITY_COMMENTS: Record<string, CommunityComment[]> = {
  'th-001': [
    {
      id: 'p-100',
      threadId: 'th-001',
      parentId: null,
      authorId: 'u-5',
      authorNick: 'indie_dev',
      authorAvatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=indie',
      isThreadAuthor: false,
      bodyMarkdown: 'А какой тикрейт физики выставлен в настройках проекта?',
      createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      likesCount: 2,
      isSolution: false,
      replies: [
        {
          id: 'p-100-1',
          threadId: 'th-001',
          parentId: 'p-100',
          authorId: 'u-1',
          authorNick: 'gamedev_alex',
          authorAvatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
          isThreadAuthor: true,
          bodyMarkdown: 'Стоит стандартный 60 Гц, но на мобилках просаживается, когда объектов больше 50 на экране.',
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          likesCount: 1,
          isSolution: false,
        }
      ]
    },
    {
      id: 'p-101',
      threadId: 'th-001',
      parentId: null,
      authorId: 'u-6',
      authorNick: 'godot_pro',
      authorAvatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=godot',
      isThreadAuthor: false,
      bodyMarkdown: 'Используй кастомный сервер физики через `PhysicsServer2DManager`. Если объектов много, отключай коллизии у тех, кто вне экрана через `VisibilityNotifier2D`.\n\n```gdscript\nfunc _on_screen_exited():\n    collision_layer = 0\n    collision_mask = 0\n```\n\nЭто сильно разгрузит процессор на мобилках.',
      createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
      likesCount: 12,
      isSolution: true,
      replies: []
    },
    {
      id: 'p-102',
      threadId: 'th-001',
      parentId: null,
      authorId: 'u-7',
      authorNick: 'troll',
      authorAvatarUrl: '',
      isThreadAuthor: false,
      bodyMarkdown: 'Удалено',
      createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
      deletedAt: new Date(Date.now() - 85 * 60 * 1000).toISOString(),
      likesCount: 0,
      isSolution: false,
      replies: [
        {
          id: 'p-102-1',
          threadId: 'th-001',
          parentId: 'p-102',
          authorId: 'u-1',
          authorNick: 'gamedev_alex',
          authorAvatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
          isThreadAuthor: true,
          bodyMarkdown: 'Эй, зачем удалил, нормальный же код был.',
          createdAt: new Date(Date.now() - 80 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 80 * 60 * 1000).toISOString(),
          likesCount: 0,
          isSolution: false,
        }
      ]
    }
  ]
};

const THREADS_STORAGE_KEY = 'hubigr_community_threads_v1';
const COMMENTS_STORAGE_KEY = 'hubigr_community_comments_v1';

export function getStoredCommunityThreads(): CommunityThread[] {
  if (typeof window === 'undefined') return MOCK_COMMUNITY_THREADS;
  try {
    const raw = localStorage.getItem(THREADS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(THREADS_STORAGE_KEY, JSON.stringify(MOCK_COMMUNITY_THREADS));
      return MOCK_COMMUNITY_THREADS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return MOCK_COMMUNITY_THREADS;
  }
}

export function saveStoredCommunityThreads(threads: CommunityThread[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(THREADS_STORAGE_KEY, JSON.stringify(threads));
  } catch (e) {
    console.error('Failed to save community threads', e);
  }
}

export function addCommunityThread(newThread: CommunityThread) {
  const current = getStoredCommunityThreads();
  const updated = [newThread, ...current];
  saveStoredCommunityThreads(updated);
  return newThread;
}

export function updateCommunityThread(id: string, patch: Partial<CommunityThread>): CommunityThread | null {
  const current = getStoredCommunityThreads();
  let updatedItem: CommunityThread | null = null;
  const updated = current.map(t => {
    if (t.id === id) {
      updatedItem = { ...t, ...patch, updatedAt: new Date().toISOString() };
      return updatedItem;
    }
    return t;
  });
  if (updatedItem) {
    saveStoredCommunityThreads(updated);
  }
  return updatedItem;
}

export function getStoredCommunityComments(threadId: string): CommunityComment[] {
  if (typeof window === 'undefined') return MOCK_COMMUNITY_COMMENTS[threadId] || [];
  try {
    const raw = localStorage.getItem(`${COMMENTS_STORAGE_KEY}_${threadId}`);
    if (!raw) {
      const initial = MOCK_COMMUNITY_COMMENTS[threadId] || [];
      localStorage.setItem(`${COMMENTS_STORAGE_KEY}_${threadId}`, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    return MOCK_COMMUNITY_COMMENTS[threadId] || [];
  }
}

export function saveStoredCommunityComments(threadId: string, comments: CommunityComment[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${COMMENTS_STORAGE_KEY}_${threadId}`, JSON.stringify(comments));
  } catch (e) {
    console.error('Failed to save community comments', e);
  }
}

export function addCommunityComment(threadId: string, newComment: CommunityComment) {
  const current = getStoredCommunityComments(threadId);
  const updated = [...current, newComment];
  saveStoredCommunityComments(threadId, updated);
  
  // Also increment thread repliesCount
  const thread = getStoredCommunityThreads().find(t => t.id === threadId);
  if (thread) {
    updateCommunityThread(threadId, { repliesCount: thread.repliesCount + 1 });
  }
  return updated;
}

export function addCommunityReply(threadId: string, parentId: string, newReply: CommunityComment): CommunityComment[] {
  const current = getStoredCommunityComments(threadId);
  const updated = current.map(c => {
    if (c.id === parentId) {
      return {
        ...c,
        replies: [...(c.replies || []), newReply]
      };
    }
    // If reply was posted to a child reply, flatten to root comment's replies per BR-COM-022
    if (c.replies && c.replies.some(r => r.id === parentId)) {
      return {
        ...c,
        replies: [...c.replies, newReply]
      };
    }
    return c;
  });
  saveStoredCommunityComments(threadId, updated);

  const thread = getStoredCommunityThreads().find(t => t.id === threadId);
  if (thread) {
    updateCommunityThread(threadId, { repliesCount: thread.repliesCount + 1 });
  }
  return updated;
}

export function updateCommunityComment(threadId: string, commentId: string, patch: Partial<CommunityComment>): CommunityComment[] {
  const current = getStoredCommunityComments(threadId);
  const updated = current.map(c => {
    if (c.id === commentId) {
      return { ...c, ...patch, updatedAt: new Date().toISOString(), isEdited: true };
    }
    if (c.replies && c.replies.length > 0) {
      return {
        ...c,
        replies: c.replies.map(r => r.id === commentId ? { ...r, ...patch, updatedAt: new Date().toISOString(), isEdited: true } : r)
      };
    }
    return c;
  });
  saveStoredCommunityComments(threadId, updated);
  return updated;
}

export function deleteCommunityComment(threadId: string, commentId: string, isModerator = false, modReason = ''): CommunityComment[] {
  const current = getStoredCommunityComments(threadId);
  let decremented = false;

  // Check if root comment
  const rootIndex = current.findIndex(c => c.id === commentId);
  if (rootIndex !== -1) {
    const target = current[rootIndex];
    if (target.replies && target.replies.length > 0) {
      // BR-COM-024: If replies exist, replace with tombstone
      current[rootIndex] = {
        ...target,
        deletedAt: new Date().toISOString(),
        bodyMarkdown: isModerator 
          ? `Сообщение удалено модератором (Причина: ${modReason || 'Нарушение правил'})`
          : 'Сообщение удалено пользователем',
        moderationDeleteReason: isModerator ? (modReason || 'Нарушение правил') : undefined
      };
    } else {
      // No replies -> remove completely
      current.splice(rootIndex, 1);
    }
    decremented = true;
  } else {
    // Check inside replies
    for (const c of current) {
      if (c.replies && c.replies.length > 0) {
        const replyIndex = c.replies.findIndex(r => r.id === commentId);
        if (replyIndex !== -1) {
          c.replies.splice(replyIndex, 1);
          decremented = true;
          break;
        }
      }
    }
  }

  saveStoredCommunityComments(threadId, current);

  if (decremented) {
    const thread = getStoredCommunityThreads().find(t => t.id === threadId);
    if (thread && thread.repliesCount > 0) {
      updateCommunityThread(threadId, { repliesCount: thread.repliesCount - 1 });
    }
  }

  return [...current];
}

const LIKES_STORAGE_KEY = 'hubigr_community_likes_v1';
const FOLLOWS_STORAGE_KEY = 'hubigr_community_follows_v1';

export function isThreadLiked(threadId: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(LIKES_STORAGE_KEY);
    const set = raw ? JSON.parse(raw) : [];
    return Array.isArray(set) && set.includes(threadId);
  } catch {
    return false;
  }
}

export function toggleLikeThread(threadId: string): { isLiked: boolean; count: number } {
  if (typeof window === 'undefined') return { isLiked: false, count: 0 };
  let set: string[] = [];
  try {
    const raw = localStorage.getItem(LIKES_STORAGE_KEY);
    set = raw ? JSON.parse(raw) : [];
  } catch {}

  const thread = getStoredCommunityThreads().find(t => t.id === threadId);
  if (!thread) return { isLiked: false, count: 0 };

  let isLiked = false;
  let newCount = thread.likesCount;

  if (set.includes(threadId)) {
    set = set.filter(id => id !== threadId);
    newCount = Math.max(0, thread.likesCount - 1);
    isLiked = false;
  } else {
    set.push(threadId);
    newCount = thread.likesCount + 1;
    isLiked = true;
  }

  localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(set));
  updateCommunityThread(threadId, { likesCount: newCount });
  return { isLiked, count: newCount };
}

const FOLLOWS_META_KEY = 'hubigr_community_follows_meta_v1';

export function isThreadFollowed(threadId: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(FOLLOWS_STORAGE_KEY);
    const set = raw ? JSON.parse(raw) : [];
    return Array.isArray(set) && set.includes(threadId);
  } catch {
    return false;
  }
}

export function getThreadFollowSource(threadId: string): 'manual' | 'auto_comment' | null {
  if (typeof window === 'undefined') return null;
  try {
    const rawMeta = localStorage.getItem(FOLLOWS_META_KEY);
    const meta = rawMeta ? JSON.parse(rawMeta) : {};
    return meta[threadId] || 'manual';
  } catch {
    return 'manual';
  }
}

export function toggleFollowThread(
  threadId: string, 
  forceFollow?: boolean, 
  source: 'manual' | 'auto_comment' = 'manual'
): boolean {
  if (typeof window === 'undefined') return false;
  let set: string[] = [];
  let meta: Record<string, 'manual' | 'auto_comment'> = {};
  try {
    const raw = localStorage.getItem(FOLLOWS_STORAGE_KEY);
    set = raw ? JSON.parse(raw) : [];
  } catch {}
  try {
    const rawMeta = localStorage.getItem(FOLLOWS_META_KEY);
    meta = rawMeta ? JSON.parse(rawMeta) : {};
  } catch {}

  let isFollowed = set.includes(threadId);
  if (forceFollow === true) {
    if (!isFollowed) {
      set.push(threadId);
      meta[threadId] = source;
      localStorage.setItem(FOLLOWS_STORAGE_KEY, JSON.stringify(set));
      localStorage.setItem(FOLLOWS_META_KEY, JSON.stringify(meta));
    }
    return true;
  }

  if (isFollowed) {
    set = set.filter(id => id !== threadId);
    delete meta[threadId];
    isFollowed = false;
  } else {
    set.push(threadId);
    meta[threadId] = source;
    isFollowed = true;
  }

  localStorage.setItem(FOLLOWS_STORAGE_KEY, JSON.stringify(set));
  localStorage.setItem(FOLLOWS_META_KEY, JSON.stringify(meta));
  return isFollowed;
}


