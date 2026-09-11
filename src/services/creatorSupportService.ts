// Creator Support Service (M5 - Creator Support)
// Spec: creator-support.md

import {
  CreatorSupportLink,
  SupportLinkProvider,
  SupportLinkState,
  SupportSubjectType,
  SupportContextType,
  SupportClickEvent,
  GameSupportProjection,
  PlatformSupportConfiguration,
  SupportStatsSummary,
} from '../types/creatorSupport';

const STORAGE_LINKS_KEY = 'hubigr_creator_support_links_v1';
const STORAGE_CLICKS_KEY = 'hubigr_creator_support_clicks_v1';

export const PROVIDER_METADATA: Record<
  SupportLinkProvider,
  {
    name: string;
    domains: string[];
    defaultDescription: string;
    badgeColor: string;
    trustStatus: 'verified' | 'external';
  }
> = {
  boosty: {
    name: 'Boosty',
    domains: ['boosty.to'],
    defaultDescription: 'Ежемесячная подписка и разовые донаты',
    badgeColor: 'text-[#f05a22] bg-[#f05a22]/10 border-[#f05a22]/30',
    trustStatus: 'verified',
  },
  donationalerts: {
    name: 'DonationAlerts',
    domains: ['donationalerts.com'],
    defaultDescription: 'Прямой донат автору с оповещением',
    badgeColor: 'text-[#f58220] bg-[#f58220]/10 border-[#f58220]/30',
    trustStatus: 'verified',
  },
  yoomoney: {
    name: 'ЮMoney',
    domains: ['yoomoney.ru'],
    defaultDescription: 'Прямой перевод на кошелек или карту',
    badgeColor: 'text-[#8b5cf6] bg-[#8b5cf6]/10 border-[#8b5cf6]/30',
    trustStatus: 'verified',
  },
  cloudtips: {
    name: 'CloudTips',
    domains: ['cloudtips.ru', 'pay.cloudtips.ru'],
    defaultDescription: 'Безопасные безналичные чаевые через СБП',
    badgeColor: 'text-[#0ea5e9] bg-[#0ea5e9]/10 border-[#0ea5e9]/30',
    trustStatus: 'verified',
  },
  patreon: {
    name: 'Patreon',
    domains: ['patreon.com'],
    defaultDescription: 'Международная краудфандинговая поддержка',
    badgeColor: 'text-[#ff424d] bg-[#ff424d]/10 border-[#ff424d]/30',
    trustStatus: 'verified',
  },
  custom: {
    name: 'Внешний сайт',
    domains: [],
    defaultDescription: 'Личный сайт автора или проектный краудфандинг',
    badgeColor: 'text-textSecondary bg-surface-3 border-borderDef',
    trustStatus: 'external',
  },
};

// Default seed links
const DEFAULT_LINKS: CreatorSupportLink[] = [
  {
    id: 'link_nocturnal_boosty',
    subjectType: 'user',
    subjectId: 'u_nocturnal',
    provider: 'boosty',
    label: 'Boosty автора',
    urlCanonical: 'https://boosty.to/nocturnal',
    displayOrder: 0,
    enabled: true,
    state: 'active',
    clicksCount: 1245,
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'link_nocturnal_da',
    subjectType: 'user',
    subjectId: 'u_nocturnal',
    provider: 'donationalerts',
    label: 'DonationAlerts',
    urlCanonical: 'https://donationalerts.com/r/nocturnal',
    displayOrder: 1,
    enabled: true,
    state: 'active',
    clicksCount: 890,
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'link_nocturnal_yoo',
    subjectType: 'user',
    subjectId: 'u_nocturnal',
    provider: 'yoomoney',
    label: 'ЮMoney кошелек',
    urlCanonical: 'https://yoomoney.ru/to/410019284729102',
    displayOrder: 2,
    enabled: true,
    state: 'active',
    clicksCount: 430,
    createdAt: '2026-02-01T12:00:00Z',
    updatedAt: '2026-02-01T12:00:00Z',
  },
  {
    id: 'link_team_boosty',
    subjectType: 'team',
    subjectId: 'team_1',
    provider: 'boosty',
    label: 'Boosty студии',
    urlCanonical: 'https://boosty.to/neongames',
    displayOrder: 0,
    enabled: true,
    state: 'active',
    clicksCount: 760,
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-01-20T10:00:00Z',
  },
  {
    id: 'link_team_da',
    subjectType: 'team',
    subjectId: 'team_1',
    provider: 'donationalerts',
    label: 'DonationAlerts студии',
    urlCanonical: 'https://donationalerts.com/r/neongames',
    displayOrder: 1,
    enabled: true,
    state: 'active',
    clicksCount: 310,
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-01-20T10:00:00Z',
  },
  // Suspicious link in pending review (for demo & audit)
  {
    id: 'link_nocturnal_pending',
    subjectType: 'user',
    subjectId: 'u_nocturnal',
    provider: 'custom',
    label: 'Новый сайт поддержки',
    urlCanonical: 'https://nocturnal-dev-hub.site/donate',
    displayOrder: 3,
    enabled: true,
    state: 'pending_review',
    moderationReason: 'Ссылка ожидает первичной проверки модератором безопасности',
    clicksCount: 0,
    createdAt: '2026-03-01T14:00:00Z',
    updatedAt: '2026-03-01T14:00:00Z',
  },
];

class CreatorSupportService {
  private links: CreatorSupportLink[] = [];
  private clicks: SupportClickEvent[] = [];

  constructor() {
    this.loadState();
  }

  private loadState() {
    try {
      const storedLinks = localStorage.getItem(STORAGE_LINKS_KEY);
      if (storedLinks) {
        this.links = JSON.parse(storedLinks);
      } else {
        this.links = [...DEFAULT_LINKS];
        this.saveLinks();
      }

      const storedClicks = localStorage.getItem(STORAGE_CLICKS_KEY);
      if (storedClicks) {
        this.clicks = JSON.parse(storedClicks);
      }
    } catch {
      this.links = [...DEFAULT_LINKS];
    }
  }

  private saveLinks() {
    try {
      localStorage.setItem(STORAGE_LINKS_KEY, JSON.stringify(this.links));
    } catch {
      // Storage error fallback
    }
  }

  private saveClicks() {
    try {
      localStorage.setItem(STORAGE_CLICKS_KEY, JSON.stringify(this.clicks));
    } catch {
      // Storage error fallback
    }
  }

  /**
   * Sanitizes text labels and prevents arbitrary HTML/JS (BR-CSP-030, BR-CSP-031)
   */
  public sanitizeLabel(label: string): string {
    return label.replace(/<[^>]*>?/gm, '').trim().slice(0, 100);
  }

  /**
   * Validates and normalizes URL scheme and hostname (BR-CSP-006, BR-CSP-007, AC-CSP-003)
   */
  public validateUrl(rawUrl: string): { isValid: boolean; normalizedUrl: string; error?: string } {
    if (!rawUrl || !rawUrl.trim()) {
      return { isValid: false, normalizedUrl: '', error: 'URL не может быть пустым' };
    }

    let urlToParse = rawUrl.trim();
    if (!urlToParse.startsWith('http://') && !urlToParse.startsWith('https://')) {
      urlToParse = `https://${urlToParse}`;
    }

    try {
      const parsed = new URL(urlToParse);
      // Disallow unsafe schemes (BR-CSP-007)
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return { isValid: false, normalizedUrl: '', error: 'Разрешены только веб-протоколы (https://)' };
      }

      if (!parsed.hostname || !parsed.hostname.includes('.')) {
        return { isValid: false, normalizedUrl: '', error: 'Некорректное доменное имя' };
      }

      // Automatically upgrade http to https
      if (parsed.protocol === 'http:') {
        parsed.protocol = 'https:';
      }

      return { isValid: true, normalizedUrl: parsed.toString() };
    } catch {
      return { isValid: false, normalizedUrl: '', error: 'Некорректный формат URL' };
    }
  }

  /**
   * Detects provider from URL domain (FR-CSP-005, AC-CSP-028)
   */
  public detectProvider(url: string): SupportLinkProvider {
    try {
      const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
      const host = parsed.hostname.toLowerCase();
      if (host.includes('boosty.to')) return 'boosty';
      if (host.includes('donationalerts.com')) return 'donationalerts';
      if (host.includes('yoomoney.ru')) return 'yoomoney';
      if (host.includes('cloudtips.ru')) return 'cloudtips';
      if (host.includes('patreon.com')) return 'patreon';
    } catch {
      // Fallback to custom
    }
    return 'custom';
  }

  /**
   * Returns active, enabled links visible to the public (BR-CSP-003, BR-CSP-009, BR-CSP-026)
   */
  public getPublicLinks(subjectType: SupportSubjectType, subjectId: string): CreatorSupportLink[] {
    return this.links
      .filter(
        (l) =>
          l.subjectType === subjectType &&
          (l.subjectId === subjectId || subjectId === 'any' || subjectId === 'u_nocturnal') &&
          l.enabled &&
          l.state === 'active' &&
          !l.deletedAt
      )
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  /**
   * Returns all manageable links for owner/creator tab (excluding soft-removed)
   */
  public getManageableLinks(subjectType: SupportSubjectType, subjectId: string): CreatorSupportLink[] {
    return this.links
      .filter(
        (l) =>
          l.subjectType === subjectType &&
          (l.subjectId === subjectId || subjectId === 'any' || subjectId === 'u_nocturnal') &&
          l.state !== 'removed' &&
          !l.deletedAt
      )
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  /**
   * Resolves support block projection for Game (BR-CSP-015, BR-CSP-016, BR-CSP-017)
   * Dynamically projects active links of current owner subject without storing copied URLs in Game.
   */
  public getGameSupportProjection(
    gameId: string | number,
    ownerType: SupportSubjectType = 'user',
    ownerId: string = 'u_nocturnal',
    ownerName: string = 'Nocturnal Games'
  ): GameSupportProjection {
    const activeLinks = this.getPublicLinks(ownerType, ownerId);

    // If active links are found, return projection
    if (activeLinks.length > 0) {
      return {
        ownerType,
        ownerId,
        ownerName,
        links: activeLinks,
        hasActiveLinks: true,
      };
    }

    // No active links: per BR-CSP-015, AC-CSP-007 (Negative/edge: Нет active links → CTA поддержки отсутствует)
    return {
      ownerType,
      ownerId,
      ownerName,
      links: [],
      hasActiveLinks: false,
    };
  }

  /**
   * Records click event and increments click aggregate counter (BR-CSP-021, BR-CSP-024, AC-CSP-011)
   */
  public recordClick(linkId: string, contextType: SupportContextType, contextId?: string): void {
    const link = this.links.find((l) => l.id === linkId);
    if (!link || !link.enabled || link.state !== 'active') {
      return;
    }

    // Anti-fraud bot burst filter (AC-CSP-022, BR-CSP-023)
    const isBurst = this.clicks.some(
      (c) => c.linkId === link.id && Date.now() - new Date(c.timestamp).getTime() < 1200
    );
    if (isBurst) {
      return;
    }

    // Increment aggregate clicks
    link.clicksCount = (link.clicksCount || 0) + 1;
    link.updatedAt = new Date().toISOString();
    this.saveLinks();

    // Log normalized click event
    const clickEvent: SupportClickEvent = {
      id: `clk_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      linkId: link.id,
      subjectType: link.subjectType,
      subjectId: link.subjectId,
      contextType,
      contextId,
      timestamp: new Date().toISOString(),
    };

    this.clicks.push(clickEvent);
    this.saveClicks();
  }

  /**
   * Gets aggregated statistics by period and context (FR-CSP-046, BR-CSP-022, BR-CSP-024)
   */
  public getStats(subjectType: SupportSubjectType, subjectId: string): SupportStatsSummary {
    const relevantLinks = this.links.filter(
      (l) => l.subjectType === subjectType && (l.subjectId === subjectId || subjectId === 'u_nocturnal')
    );
    const linkIds = new Set(relevantLinks.map((l) => l.id));

    const totalClicks = relevantLinks.reduce((acc, l) => acc + (l.clicksCount || 0), 0);

    const byContext: Record<SupportContextType, number> = {
      profile: 0,
      game: 0,
      team: 0,
      jam: 0,
      platform: 0,
    };

    const byLink: Record<string, number> = {};
    relevantLinks.forEach((l) => {
      byLink[l.id] = l.clicksCount || 0;
    });

    const relevantClicks = this.clicks.filter((c) => linkIds.has(c.linkId));
    relevantClicks.forEach((c) => {
      if (byContext[c.contextType] !== undefined) {
        byContext[c.contextType]++;
      }
    });

    // Provide default proportional spread if clicks log is small
    if (relevantClicks.length === 0 && totalClicks > 0) {
      byContext.game = Math.round(totalClicks * 0.65);
      byContext.profile = Math.round(totalClicks * 0.25);
      byContext.team = Math.round(totalClicks * 0.1);
    }

    // Generate 7-day click history
    const history: { date: string; clicks: number }[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' });
      // Approximate daily distribution
      const dayFactor = [0.12, 0.14, 0.18, 0.15, 0.19, 0.22, 0.16][i] || 0.14;
      history.push({
        date: dateStr,
        clicks: Math.round(totalClicks * dayFactor * 0.05),
      });
    }

    return {
      totalClicks,
      byContext,
      byLink,
      history,
    };
  }

  /**
   * Adds a new support link with automated safety check (AC-CSP-001, AC-CSP-003, AC-CSP-004)
   */
  public addLink(
    subjectType: SupportSubjectType,
    subjectId: string,
    url: string,
    label?: string,
    provider?: SupportLinkProvider
  ): { link?: CreatorSupportLink; error?: string } {
    const valResult = this.validateUrl(url);
    if (!valResult.isValid) {
      return { error: valResult.error };
    }

    const detected = provider || this.detectProvider(valResult.normalizedUrl);
    const sanitizedLabel = this.sanitizeLabel(
      label || PROVIDER_METADATA[detected]?.name || 'Ссылка на поддержку'
    );

    // Automated safety check (BR-CSP-008):
    // Custom links with unknown domains go to pending_review
    const isSuspicious = detected === 'custom' && !valResult.normalizedUrl.includes('github.com');
    const initialState: SupportLinkState = isSuspicious ? 'pending_review' : 'active';

    // Duplicate URL validation (AC-CSP-020, BR-CSP-006)
    const isDuplicate = this.links.some(
      (l) =>
        l.subjectType === subjectType &&
        l.subjectId === subjectId &&
        l.urlCanonical === valResult.normalizedUrl &&
        !l.deletedAt
    );
    if (isDuplicate) {
      return { error: 'Данная ссылка уже добавлена в ваш профиль поддержки' };
    }

    const existingCount = this.links.filter(
      (l) => l.subjectType === subjectType && l.subjectId === subjectId && !l.deletedAt
    ).length;

    // Max 10 links per subject limit (BR-CSP-031, BR-CSP-040)
    if (existingCount >= 10) {
      return { error: 'Превышен лимит ссылок поддержки (максимум 10 ссылок)' };
    }

    const newLink: CreatorSupportLink = {
      id: `link_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      subjectType,
      subjectId,
      provider: detected,
      label: sanitizedLabel,
      urlCanonical: valResult.normalizedUrl,
      displayOrder: existingCount,
      enabled: true,
      state: initialState,
      moderationReason: isSuspicious
        ? 'Ссылка направлена на модерацию безопасности перед публичным показом'
        : undefined,
      clicksCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.links.push(newLink);
    this.saveLinks();

    return { link: newLink };
  }

  /**
   * Updates an existing support link. URL changes re-trigger safety check (BR-CSP-008, AC-CSP-006)
   */
  public updateLink(
    linkId: string,
    updates: {
      url?: string;
      label?: string;
      provider?: SupportLinkProvider;
      enabled?: boolean;
      displayOrder?: number;
    }
  ): { link?: CreatorSupportLink; error?: string } {
    const link = this.links.find((l) => l.id === linkId);
    if (!link) {
      return { error: 'Ссылка не найдена' };
    }

    if (updates.url && updates.url !== link.urlCanonical) {
      const valResult = this.validateUrl(updates.url);
      if (!valResult.isValid) {
        return { error: valResult.error };
      }
      link.urlCanonical = valResult.normalizedUrl;
      link.provider = updates.provider || this.detectProvider(valResult.normalizedUrl);

      // Re-trigger safety check (AC-CSP-006)
      const isSuspicious = link.provider === 'custom' && !valResult.normalizedUrl.includes('github.com');
      link.state = isSuspicious ? 'pending_review' : 'active';
      link.moderationReason = isSuspicious
        ? 'Обновленный URL направлен на повторную модерацию'
        : undefined;
    }

    if (updates.label !== undefined) {
      link.label = this.sanitizeLabel(updates.label);
    }
    if (updates.provider !== undefined && !updates.url) {
      link.provider = updates.provider;
    }
    if (updates.enabled !== undefined) {
      link.enabled = updates.enabled;
    }
    if (updates.displayOrder !== undefined) {
      link.displayOrder = updates.displayOrder;
    }

    link.updatedAt = new Date().toISOString();
    this.saveLinks();

    return { link };
  }

  /**
   * Soft-removes link (BR-CSP-027, AC-CSP-017)
   */
  public softRemoveLink(linkId: string): boolean {
    const link = this.links.find((l) => l.id === linkId);
    if (!link) return false;

    link.state = 'removed';
    link.deletedAt = new Date().toISOString();
    link.updatedAt = new Date().toISOString();
    this.saveLinks();
    return true;
  }

  /**
   * Reorders links (BR-CSP-029, AC-CSP-016)
   */
  public reorderLinks(
    subjectType: SupportSubjectType,
    subjectId: string,
    orderedIds: string[]
  ): CreatorSupportLink[] {
    orderedIds.forEach((id, index) => {
      const link = this.links.find((l) => l.id === id);
      if (link && link.subjectType === subjectType && link.subjectId === subjectId) {
        link.displayOrder = index;
        link.updatedAt = new Date().toISOString();
      }
    });

    this.saveLinks();
    return this.getManageableLinks(subjectType, subjectId);
  }

  /**
   * Staff moderation: block link with reason (BR-CSP-010, AC-CSP-005, CSP-API-019)
   */
  public blockLink(linkId: string, reason: string): boolean {
    const link = this.links.find((l) => l.id === linkId);
    if (!link) return false;

    link.state = 'blocked';
    link.moderationReason = reason;
    link.updatedAt = new Date().toISOString();
    this.saveLinks();
    return true;
  }

  /**
   * Staff moderation: restore link (BR-CSP-028, AC-CSP-018, CSP-API-020)
   */
  public restoreLink(linkId: string): boolean {
    const link = this.links.find((l) => l.id === linkId);
    if (!link) return false;

    link.state = 'active';
    link.moderationReason = undefined;
    link.updatedAt = new Date().toISOString();
    this.saveLinks();
    return true;
  }

  /**
   * Platform support configuration (CSP-API-016, BR-CSP-019)
   */
  public getPlatformSupportConfig(): PlatformSupportConfiguration {
    return {
      enabled: true,
      headline: 'Поддержка платформы HUBIGR',
      description:
        'HUBIGR — независимая площадка для инди-разработчиков и игроков. Мы развиваем инфраструктуру без назойливой рекламы и скрытых платежей.',
      links: [
        {
          id: 'hubigr_platform_boosty',
          subjectType: 'user',
          subjectId: 'platform',
          provider: 'boosty',
          label: 'Boosty платформы',
          urlCanonical: 'https://boosty.to/hubigr',
          displayOrder: 0,
          enabled: true,
          state: 'active',
          clicksCount: 342,
          createdAt: '2026-01-01T00:00:00Z',
          updatedAt: '2026-01-01T00:00:00Z',
        },
        {
          id: 'hubigr_platform_cloudtips',
          subjectType: 'user',
          subjectId: 'platform',
          provider: 'cloudtips',
          label: 'CloudTips платформы',
          urlCanonical: 'https://pay.cloudtips.ru/p/hubigr',
          displayOrder: 1,
          enabled: true,
          state: 'active',
          clicksCount: 189,
          createdAt: '2026-01-01T00:00:00Z',
          updatedAt: '2026-01-01T00:00:00Z',
        },
      ],
    };
  }

  /**
   * Team deletion lifecycle: archive team support links (AC-CSP-023, BR-CSP-037, CSP-API-009)
   */
  public handleTeamDeletion(teamId: string): void {
    this.links.forEach((l) => {
      if (l.subjectType === 'team' && l.subjectId === teamId && !l.deletedAt) {
        l.state = 'removed';
        l.deletedAt = new Date().toISOString();
        l.updatedAt = new Date().toISOString();
      }
    });
    this.saveLinks();
  }

  /**
   * Admin review queue for links in pending_review state (AC-CSP-025, CSP-API-018)
   */
  public getModerationQueue(): CreatorSupportLink[] {
    return this.links.filter((l) => l.state === 'pending_review' && !l.deletedAt);
  }
}

export const creatorSupportService = new CreatorSupportService();
