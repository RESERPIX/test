// Jam Organizer Service (M11 - User / Partner Jam)
// Specification: jam-organizer.md

import {
  JamOrganizerRequest,
  JamOrganizerAssignment,
  OrganizerTrustProfile,
  JamPartner,
  JamPrize,
  JamRuleVersion,
  JamJudgeInvitation,
  JamJudgeAssignment,
  JamJudgeConflict,
  JamTeamRoster,
  JamTeamRosterMember,
  JamBuildSnapshot,
  JamDisqualification,
  JamAppeal,
  JamReport,
  JamAnnouncement,
  JamAward,
  JamResultCorrection,
  JamOrganizerAnalytics,
  JamPermission,
  JamSubjectType,
  JamOrganizerRequestStatus,
  JamPartnerVerificationStatus,
  JamAppealStatus,
  JamReportCategory
} from '../types/jamOrganizer';

const STORAGE_PREFIX = 'hubigr_jam_organizer_';

class JamOrganizerService {
  private requests: JamOrganizerRequest[] = [];
  private assignments: JamOrganizerAssignment[] = [];
  private trustProfiles: OrganizerTrustProfile[] = [];
  private partners: JamPartner[] = [];
  private prizes: JamPrize[] = [];
  private ruleVersions: JamRuleVersion[] = [];
  private judgeInvitations: JamJudgeInvitation[] = [];
  private judgeAssignments: JamJudgeAssignment[] = [];
  private judgeConflicts: JamJudgeConflict[] = [];
  private teamRosters: JamTeamRoster[] = [];
  private buildSnapshots: JamBuildSnapshot[] = [];
  private disqualifications: JamDisqualification[] = [];
  private appeals: JamAppeal[] = [];
  private reports: JamReport[] = [];
  private announcements: JamAnnouncement[] = [];
  private awards: JamAward[] = [];
  private corrections: JamResultCorrection[] = [];

  constructor() {
    this.loadState();
  }

  private loadState(): void {
    try {
      const storedReqs = localStorage.getItem(STORAGE_PREFIX + 'requests');
      if (storedReqs) {
        this.requests = JSON.parse(storedReqs);
      } else {
        this.initSeedRequests();
      }

      const storedAnnouncements = localStorage.getItem(STORAGE_PREFIX + 'announcements');
      if (storedAnnouncements) {
        this.announcements = JSON.parse(storedAnnouncements);
      } else {
        this.initSeedAnnouncements();
      }

      const storedPartners = localStorage.getItem(STORAGE_PREFIX + 'partners');
      if (storedPartners) {
        this.partners = JSON.parse(storedPartners);
      } else {
        this.initSeedPartners();
      }

      const storedPrizes = localStorage.getItem(STORAGE_PREFIX + 'prizes');
      if (storedPrizes) {
        this.prizes = JSON.parse(storedPrizes);
      } else {
        this.initSeedPrizes();
      }

      const storedRules = localStorage.getItem(STORAGE_PREFIX + 'rules');
      if (storedRules) {
        this.ruleVersions = JSON.parse(storedRules);
      } else {
        this.initSeedRules();
      }

      const storedJudges = localStorage.getItem(STORAGE_PREFIX + 'judges');
      if (storedJudges) {
        this.judgeAssignments = JSON.parse(storedJudges);
      } else {
        this.initSeedJudges();
      }

      const storedInvites = localStorage.getItem(STORAGE_PREFIX + 'judge_invites');
      if (storedInvites) {
        this.judgeInvitations = JSON.parse(storedInvites);
      } else {
        this.initSeedJudgeInvites();
      }

      const storedAppeals = localStorage.getItem(STORAGE_PREFIX + 'appeals');
      if (storedAppeals) {
        this.appeals = JSON.parse(storedAppeals);
      } else {
        this.initSeedAppeals();
      }

      const storedDisq = localStorage.getItem(STORAGE_PREFIX + 'disqualifications');
      if (storedDisq) {
        this.disqualifications = JSON.parse(storedDisq);
      } else {
        this.initSeedDisqualifications();
      }
    } catch {
      this.initSeedRequests();
      this.initSeedAnnouncements();
      this.initSeedPartners();
      this.initSeedPrizes();
      this.initSeedRules();
      this.initSeedJudges();
      this.initSeedJudgeInvites();
      this.initSeedAppeals();
      this.initSeedDisqualifications();
    }
  }

  private save(key: string, data: any): void {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
    } catch {
      // Storage unavailable fallback
    }
  }

  // --- SEED INITIALIZERS ---

  private initSeedRequests(): void {
    this.requests = [
      {
        id: 'jreq_01',
        applicantUserId: 'usr_me',
        applicantUserNick: 'NocturnalDev',
        organizerSubjectType: 'team',
        organizerSubjectId: 'st_01',
        organizerSubjectName: 'Void Labs Studio',
        title: 'Indie Cyber Jam 2026',
        slug: 'indie-cyber-jam-2026',
        concept: 'Создание киберпанк-проектов за 72 часа',
        descriptionMd: 'Большой весенний геймджем для независимых разработчиков и энтузиастов.',
        proposedDates: {
          startAt: '2026-09-01T18:00:00Z',
          endAt: '2026-09-04T18:00:00Z',
          resultsAt: '2026-09-08T18:00:00Z'
        },
        formatPreset: 'ranked',
        rulesMd: '1. Игра создается с нуля во время джема.\n2. Разрешены любые движки.\n3. Команды до 5 человек.',
        organizerContact: 'team@voidlabs.games',
        coverUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200',
        isRanked: true,
        expectedParticipantsCount: 300,
        status: 'approved',
        approvedJamId: 'jam-123',
        createdAt: '2026-08-10T10:00:00Z',
        updatedAt: '2026-08-12T14:00:00Z'
      },
      {
        id: 'jreq_02',
        applicantUserId: 'usr_me',
        applicantUserNick: 'NocturnalDev',
        organizerSubjectType: 'user',
        organizerSubjectId: 'usr_me',
        organizerSubjectName: 'NocturnalDev',
        title: 'Pixel Horror Weekend',
        slug: 'pixel-horror-weekend',
        concept: 'Мини-джем ретро-хорроров на 48 часов',
        descriptionMd: 'Уютный пиксельный хоррор-джем с упором на атмосферу и звук.',
        proposedDates: {
          startAt: '2026-10-10T18:00:00Z',
          endAt: '2026-10-12T18:00:00Z',
          resultsAt: '2026-10-15T18:00:00Z'
        },
        formatPreset: 'short',
        rulesMd: 'Пиксель-арт графика, оригинальный звук, тема объявляется на старте.',
        organizerContact: 'nocturnal@hubigr.ru',
        isRanked: true,
        expectedParticipantsCount: 80,
        status: 'needs_changes',
        moderatorFeedback: 'Пожалуйста, уточните требования к лицензиям сторонних аудио-ассетов в правилах.',
        createdAt: '2026-09-01T12:00:00Z',
        updatedAt: '2026-09-02T16:00:00Z'
      }
    ];
    this.save('requests', this.requests);
  }

  private initSeedAnnouncements(): void {
    this.announcements = [
      {
        id: 'anc_01',
        jamId: 'jam-123',
        authorUserId: 'usr_me',
        authorName: 'Void Labs Studio',
        title: 'Тема джема объявлена!',
        contentMd: 'Главная тема нашего хакатона: **«Трансформация и Память»**. Удачи всем разработчикам!',
        isPinned: true,
        publishedAt: '2026-09-01T18:00:00Z'
      },
      {
        id: 'anc_02',
        jamId: 'jam-123',
        authorUserId: 'usr_me',
        authorName: 'Void Labs Studio',
        title: 'Старт судейского голосования',
        contentMd: 'Прием заявок завершен! Жюри приступает к оценке работ по 4 критериям.',
        isPinned: false,
        publishedAt: '2026-09-04T18:30:00Z'
      }
    ];
    this.save('announcements', this.announcements);
  }

  private initSeedPartners(): void {
    this.partners = [
      {
        id: 'part_01',
        jamId: 'jam-123',
        name: 'Void Engine',
        logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100',
        websiteUrl: 'https://voidengine.dev',
        roleDescription: 'Генеральный технологический партнер',
        proposedBy: 'usr_me',
        verificationStatus: 'verified',
        verifiedBy: 'admin_hubigr',
        verifiedAt: '2026-08-15T12:00:00Z'
      },
      {
        id: 'part_02',
        jamId: 'jam-123',
        name: 'Indie Fund Community',
        logoUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=100',
        websiteUrl: 'https://indiefund.example',
        roleDescription: 'Партнер призового фонда',
        proposedBy: 'usr_me',
        verificationStatus: 'verified',
        verifiedBy: 'admin_hubigr',
        verifiedAt: '2026-08-16T15:00:00Z'
      }
    ];
    this.save('partners', this.partners);
  }

  private initSeedPrizes(): void {
    this.prizes = [
      {
        id: 'prz_01',
        jamId: 'jam-123',
        type: 'money',
        title: 'Гран-при за 1 место',
        amount: '100 000',
        currency: 'RUB',
        description: 'Денежный приз победителю общего зачета',
        provider: 'Indie Fund Community',
        providerType: 'partner',
        fulfillmentStatus: 'verified',
        versionNumber: 1,
        placeNumber: 1
      },
      {
        id: 'prz_02',
        jamId: 'jam-123',
        type: 'money',
        title: '2 место',
        amount: '50 000',
        currency: 'RUB',
        description: 'Денежный приз за второе место',
        provider: 'Indie Fund Community',
        providerType: 'partner',
        fulfillmentStatus: 'verified',
        versionNumber: 1,
        placeNumber: 2
      },
      {
        id: 'prz_03',
        jamId: 'jam-123',
        type: 'license',
        title: 'Лицензия Void Engine PRO',
        description: 'Годовая подписка на движок для всей команды победителей номинации «Лучший визуал»',
        provider: 'Void Engine',
        providerType: 'partner',
        fulfillmentStatus: 'verified',
        versionNumber: 1
      }
    ];
    this.save('prizes', this.prizes);
  }

  private initSeedRules(): void {
    this.ruleVersions = [
      {
        id: 'rule_v1',
        jamId: 'jam-123',
        versionNumber: 1,
        rulesMd: 'Базовые правила Indie Cyber Jam 2026. Запрещен плагиат и готовые прототипы.',
        effectiveAt: '2026-08-15T00:00:00Z',
        isMaterialChange: false,
        moderationStatus: 'approved'
      }
    ];
    this.save('rules', this.ruleVersions);
  }

  private initSeedJudges(): void {
    this.judgeAssignments = [
      {
        id: 'jass_01',
        jamId: 'jam-123',
        userId: 'usr_1',
        userNick: 'AlexGameDev',
        userName: 'Алексей Иванов',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
        role: 'head_judge',
        assignedAt: '2026-08-20T10:00:00Z',
        ratedCount: 14,
        assignedSubmissionsCount: 18
      },
      {
        id: 'jass_02',
        jamId: 'jam-123',
        userId: 'usr_2',
        userNick: 'ElenaAudio',
        userName: 'Елена Соколова',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
        role: 'judge',
        assignedAt: '2026-08-20T10:00:00Z',
        ratedCount: 18,
        assignedSubmissionsCount: 18
      }
    ];
    this.save('judges', this.judgeAssignments);
  }

  private initSeedJudgeInvites(): void {
    this.judgeInvitations = [
      {
        id: 'jinv_01',
        jamId: 'jam-123',
        jamTitle: 'Indie Cyber Jam 2026',
        targetUserId: 'usr_3',
        targetUserNick: 'Max3D',
        targetUserName: 'Максим Петров',
        targetUserAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        role: 'judge',
        status: 'pending',
        invitedBy: 'usr_me',
        createdAt: '2026-08-25T11:00:00Z'
      }
    ];
    this.save('judge_invites', this.judgeInvitations);
  }

  private initSeedAppeals(): void {
    this.appeals = [
      {
        id: 'app_01',
        jamId: 'jam-123',
        jamTitle: 'Indie Cyber Jam 2026',
        submissionId: 'sub_99',
        gameTitle: 'Neon Shadows',
        appellantUserId: 'usr_5',
        appellantUserNick: 'RetroCoder',
        targetDecisionType: 'disqualification',
        reason: 'Дисквалификация за сторонние ассеты ошибочна: куплена коммерческая лицензия Unity Asset Store.',
        evidence: 'https://assetstore.unity.com/receipt/123984712',
        status: 'under_review',
        createdAt: '2026-09-05T09:00:00Z'
      }
    ];
    this.save('appeals', this.appeals);
  }

  private initSeedDisqualifications(): void {
    this.disqualifications = [
      {
        id: 'disq_01',
        jamId: 'jam-123',
        submissionId: 'sub_99',
        gameTitle: 'Neon Shadows',
        participantSubjectType: 'user',
        participantSubjectId: 'usr_5',
        reason: 'Использование готовой игры, опубликованной до начала джема',
        evidence: 'Репозиторий датирован 2025 годом: github.com/retrocoder/neon-shadows',
        disqualifiedBy: 'AlexGameDev (Head Judge)',
        disqualifiedAt: '2026-09-04T22:00:00Z'
      }
    ];
    this.save('disqualifications', this.disqualifications);
  }

  // --- 1. ORGANIZER REQUEST OPERATIONS (JORG-API-001..006) ---

  public createRequest(data: {
    applicantUserId: string;
    applicantUserNick: string;
    organizerSubjectType: JamSubjectType;
    organizerSubjectId: string;
    organizerSubjectName: string;
    title: string;
    concept: string;
    descriptionMd: string;
    proposedDates: { startAt: string; endAt: string; resultsAt: string };
    formatPreset: 'short' | 'ranked' | 'non_ranked' | 'educational' | 'partner';
    rulesMd: string;
    organizerContact: string;
    coverUrl?: string;
    isRanked: boolean;
    expectedParticipantsCount: number;
  }): JamOrganizerRequest {
    const slug = data.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-а-яА-Я]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'new-jam';

    const newReq: JamOrganizerRequest = {
      id: 'jreq_' + Date.now(),
      ...data,
      slug,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.requests.unshift(newReq);
    this.save('requests', this.requests);
    return newReq;
  }

  public getMyRequests(userId: string): JamOrganizerRequest[] {
    return this.requests.filter(r => r.applicantUserId === userId || userId === 'usr_me');
  }

  public getRequest(requestId: string): JamOrganizerRequest | undefined {
    return this.requests.find(r => r.id === requestId);
  }

  public updateRequest(requestId: string, updates: Partial<JamOrganizerRequest>): JamOrganizerRequest | { error: string } {
    const req = this.requests.find(r => r.id === requestId);
    if (!req) return { error: 'Заявка не найдена' };
    if (req.status !== 'draft' && req.status !== 'needs_changes') {
      return { error: 'Нельзя редактировать заявку в текущем статусе' };
    }

    Object.assign(req, updates, { updatedAt: new Date().toISOString() });
    this.save('requests', this.requests);
    return req;
  }

  public submitRequest(requestId: string): { success: boolean; request?: JamOrganizerRequest; error?: string } {
    const req = this.requests.find(r => r.id === requestId);
    if (!req) return { success: false, error: 'Заявка не найдена' };

    // Validation
    if (!req.title || req.title.trim().length < 3) {
      return { success: false, error: 'Название джема должно содержать минимум 3 символа' };
    }
    if (!req.concept || req.concept.trim().length < 10) {
      return { success: false, error: 'Концепт должен содержать минимум 10 символов' };
    }
    if (new Date(req.proposedDates.endAt) <= new Date(req.proposedDates.startAt)) {
      return { success: false, error: 'Дата окончания должна быть позже даты старта' };
    }

    req.status = 'submitted';
    req.submittedAt = new Date().toISOString();
    req.updatedAt = new Date().toISOString();
    this.save('requests', this.requests);
    return { success: true, request: req };
  }

  public cancelRequest(requestId: string): boolean {
    const idx = this.requests.findIndex(r => r.id === requestId);
    if (idx === -1) return false;
    if (this.requests[idx].status === 'draft') {
      this.requests.splice(idx, 1);
    } else {
      this.requests[idx].status = 'cancelled';
      this.requests[idx].updatedAt = new Date().toISOString();
    }
    this.save('requests', this.requests);
    return true;
  }

  // --- 2. WORKSPACE & PERMISSIONS (JORG-API-007..010) ---

  public getEffectivePermissions(jamId: string, userId: string): JamPermission[] {
    // All 6 permissions granted for demo author of jam-123
    return [
      'jam.manage_profile',
      'jam.manage_participants',
      'jam.manage_submissions',
      'jam.manage_judges',
      'jam.manage_results',
      'jam.manage_communications'
    ];
  }

  // --- 3. JUDGES & INVITATIONS (JORG-API-012..017) ---

  public getJudges(jamId: string): JamJudgeAssignment[] {
    return this.judgeAssignments.filter(j => j.jamId === jamId);
  }

  public getJudgeInvitations(jamId: string): JamJudgeInvitation[] {
    return this.judgeInvitations.filter(i => i.jamId === jamId);
  }

  public inviteJudge(jamId: string, targetUser: { id: string; nick: string; name: string; avatar?: string }, role: 'judge' | 'head_judge', invitedBy: string): JamJudgeInvitation {
    const invite: JamJudgeInvitation = {
      id: 'jinv_' + Date.now(),
      jamId,
      jamTitle: 'Indie Cyber Jam 2026',
      targetUserId: targetUser.id,
      targetUserNick: targetUser.nick,
      targetUserName: targetUser.name,
      targetUserAvatar: targetUser.avatar,
      role,
      status: 'pending',
      invitedBy,
      createdAt: new Date().toISOString()
    };
    this.judgeInvitations.push(invite);
    this.save('judge_invites', this.judgeInvitations);
    return invite;
  }

  public revokeJudgeInvite(jamId: string, inviteId: string): boolean {
    const idx = this.judgeInvitations.findIndex(i => i.id === inviteId && i.jamId === jamId);
    if (idx === -1) return false;
    this.judgeInvitations[idx].status = 'revoked';
    this.save('judge_invites', this.judgeInvitations);
    return true;
  }

  public acceptJudgeInvite(inviteId: string): boolean {
    const invite = this.judgeInvitations.find(i => i.id === inviteId);
    if (!invite || invite.status !== 'pending') return false;

    invite.status = 'accepted';
    invite.respondedAt = new Date().toISOString();
    this.save('judge_invites', this.judgeInvitations);

    // Create assignment
    const assignment: JamJudgeAssignment = {
      id: 'jass_' + Date.now(),
      jamId: invite.jamId,
      userId: invite.targetUserId,
      userNick: invite.targetUserNick,
      userName: invite.targetUserName,
      userAvatar: invite.targetUserAvatar,
      role: invite.role,
      assignedAt: new Date().toISOString(),
      ratedCount: 0,
      assignedSubmissionsCount: 18
    };
    this.judgeAssignments.push(assignment);
    this.save('judges', this.judgeAssignments);
    return true;
  }

  public rejectJudgeInvite(inviteId: string): boolean {
    const invite = this.judgeInvitations.find(i => i.id === inviteId);
    if (!invite || invite.status !== 'pending') return false;
    invite.status = 'rejected';
    invite.respondedAt = new Date().toISOString();
    this.save('judge_invites', this.judgeInvitations);
    return true;
  }

  public declareJudgeConflict(jamId: string, judgeUserId: string, submissionId: string, reason: string): JamJudgeConflict {
    const conflict: JamJudgeConflict = {
      id: 'cnf_' + Date.now(),
      jamId,
      judgeUserId,
      submissionId,
      gameTitle: 'Проект участника',
      reason,
      status: 'declared',
      declaredAt: new Date().toISOString()
    };
    this.judgeConflicts.push(conflict);
    return conflict;
  }

  // --- 4. SUBMISSION MODERATION & DISQUALIFICATION (JORG-API-023, 024, 027) ---

  public getDisqualifications(jamId: string): JamDisqualification[] {
    return this.disqualifications.filter(d => d.jamId === jamId);
  }

  public disqualifySubmission(data: {
    jamId: string;
    submissionId: string;
    gameTitle: string;
    participantSubjectType: JamSubjectType;
    participantSubjectId: string;
    reason: string;
    evidence: string;
    disqualifiedBy: string;
  }): JamDisqualification {
    const disq: JamDisqualification = {
      id: 'disq_' + Date.now(),
      ...data,
      disqualifiedAt: new Date().toISOString()
    };
    this.disqualifications.unshift(disq);
    this.save('disqualifications', this.disqualifications);
    return disq;
  }

  // --- 5. APPEALS & REPORTS (JORG-API-025, 026, 035, 047) ---

  public getAppeals(jamId?: string): JamAppeal[] {
    if (jamId) {
      return this.appeals.filter(a => a.jamId === jamId);
    }
    return this.appeals;
  }

  public submitAppeal(data: {
    jamId: string;
    jamTitle: string;
    submissionId: string;
    gameTitle: string;
    appellantUserId: string;
    appellantUserNick: string;
    targetDecisionType: 'rejection' | 'disqualification';
    reason: string;
    evidence: string;
  }): JamAppeal {
    const appeal: JamAppeal = {
      id: 'app_' + Date.now(),
      ...data,
      status: 'under_review',
      createdAt: new Date().toISOString()
    };
    this.appeals.unshift(appeal);
    this.save('appeals', this.appeals);
    return appeal;
  }

  public reviewAppeal(appealId: string, decision: 'accepted' | 'rejected', reason: string, reviewerId: string): boolean {
    const app = this.appeals.find(a => a.id === appealId);
    if (!app) return false;
    app.status = decision;
    app.reviewedBy = reviewerId;
    app.reviewDecisionReason = reason;
    app.decidedAt = new Date().toISOString();
    this.save('appeals', this.appeals);
    return true;
  }

  public submitReport(data: {
    jamId: string;
    jamTitle: string;
    reporterUserId: string;
    category: JamReportCategory;
    description: string;
    evidenceUrl?: string;
  }): JamReport {
    const rep: JamReport = {
      id: 'rep_' + Date.now(),
      ...data,
      status: 'submitted',
      createdAt: new Date().toISOString()
    };
    this.reports.unshift(rep);
    return rep;
  }

  // --- 6. ANNOUNCEMENTS (JORG-API-029, 030) ---

  public getAnnouncements(jamId: string): JamAnnouncement[] {
    return this.announcements.filter(a => a.jamId === jamId);
  }

  public createAnnouncement(jamId: string, authorUserId: string, authorName: string, title: string, contentMd: string, isPinned = false): JamAnnouncement {
    const anc: JamAnnouncement = {
      id: 'anc_' + Date.now(),
      jamId,
      authorUserId,
      authorName,
      title,
      contentMd,
      isPinned,
      publishedAt: new Date().toISOString()
    };
    this.announcements.unshift(anc);
    this.save('announcements', this.announcements);
    return anc;
  }

  // --- 7. PARTNERS & PRIZES (JORG-API-031..033, 041) ---

  public getPartners(jamId: string): JamPartner[] {
    return this.partners.filter(p => p.jamId === jamId);
  }

  public proposePartner(jamId: string, name: string, roleDescription: string, websiteUrl?: string): JamPartner {
    const partner: JamPartner = {
      id: 'part_' + Date.now(),
      jamId,
      name,
      roleDescription,
      websiteUrl,
      proposedBy: 'usr_me',
      verificationStatus: 'under_review'
    };
    this.partners.push(partner);
    this.save('partners', this.partners);
    return partner;
  }

  public getPrizes(jamId: string): JamPrize[] {
    return this.prizes.filter(p => p.jamId === jamId);
  }

  public addPrize(jamId: string, prizeData: Omit<JamPrize, 'id' | 'jamId' | 'versionNumber'>): JamPrize {
    const prize: JamPrize = {
      id: 'prz_' + Date.now(),
      jamId,
      versionNumber: 1,
      ...prizeData
    };
    this.prizes.push(prize);
    this.save('prizes', this.prizes);
    return prize;
  }

  // --- 8. RULES VERSIONS (JORG-API-028) ---

  public getRulesVersions(jamId: string): JamRuleVersion[] {
    return this.ruleVersions.filter(r => r.jamId === jamId);
  }

  public addRuleVersion(jamId: string, rulesMd: string, changeReason: string, isMaterial = true): JamRuleVersion {
    const existing = this.getRulesVersions(jamId);
    const versionNumber = existing.length + 1;
    const rule: JamRuleVersion = {
      id: 'rule_v' + versionNumber,
      jamId,
      versionNumber,
      rulesMd,
      changeReason,
      effectiveAt: new Date().toISOString(),
      isMaterialChange: isMaterial,
      moderationStatus: isMaterial ? 'pending_review' : 'approved'
    };
    this.ruleVersions.push(rule);
    this.save('rules', this.ruleVersions);
    return rule;
  }

  // --- 9. ORGANIZER ANALYTICS (JORG-API-034, FE-JORG-012) ---

  public getAnalytics(jamId: string): JamOrganizerAnalytics {
    return {
      jamId,
      viewsCount: 14280,
      followersCount: 1840,
      registrationsCount: 420,
      soloCount: 290,
      teamsCount: 130,
      submissionsTotal: 184,
      submissionsApproved: 168,
      submissionsRejected: 12,
      submissionsDisqualified: 4,
      judgingCompletedPercent: 78,
      trafficSources: [
        { name: 'Каталог джемов HUBIGR', count: 6850, percent: 48 },
        { name: 'Внешние соцсети (VK / TG)', count: 4280, percent: 30 },
        { name: 'Прямые переходы', count: 2140, percent: 15 },
        { name: 'Сообщество авторов', count: 1010, percent: 7 }
      ],
      dailyViewsHistory: [
        { date: '01 сен', views: 2400, registrations: 120, submissions: 10 },
        { date: '02 сен', views: 3100, registrations: 160, submissions: 25 },
        { date: '03 сен', views: 4200, registrations: 85, submissions: 65 },
        { date: '04 сен', views: 3500, registrations: 40, submissions: 80 },
        { date: '05 сен', views: 1800, registrations: 15, submissions: 4 },
        { date: '06 сен', views: 1600, registrations: 0, submissions: 0 },
        { date: '07 сен', views: 1400, registrations: 0, submissions: 0 }
      ]
    };
  }

  // --- 10. TRUST PROFILE (JORG-API-039, 040) ---

  public getTrustProfile(subjectType: JamSubjectType, subjectId: string): OrganizerTrustProfile {
    return {
      subjectType,
      subjectId,
      isVerifiedOrganizer: true,
      trustLevel: 'trusted',
      completedJamsCount: 3,
      cancelledJamsCount: 0,
      violationsCount: 0,
      prizeFulfillmentRate: 100,
      concurrentJamLimit: 3,
      canCreateJam: true
    };
  }
}

export const jamOrganizerService = new JamOrganizerService();
