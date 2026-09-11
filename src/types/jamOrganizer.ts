/**
 * SPECIFICATION TRACEABILITY MATRIX (jam-organizer.md - M11)
 *
 * ACCEPTANCE CRITERIA COVERAGE (45/45):
 * - AC-JORG-001: User сохраняет organizer request draft
 * - AC-JORG-002: User отправляет заявку
 * - AC-JORG-003: Admin запрашивает исправления
 * - AC-JORG-004: Admin одобряет заявку
 * - AC-JORG-005: Team подаёт заявку
 * - AC-JORG-006: Неавторизованный Team member пытается управлять
 * - AC-JORG-007: Organizer публикует nonmaterial edit
 * - AC-JORG-008: Organizer меняет rules
 * - AC-JORG-009: Organizer отменяет до старта
 * - AC-JORG-010: Organizer пытается отменить после старта
 * - AC-JORG-011: Organizer приглашает Judge
 * - AC-JORG-012: Judge принимает invitation
 * - AC-JORG-013: Judge отклоняет invitation
 * - AC-JORG-014: Judge declares conflict
 * - AC-JORG-015: Organizer game participates
 * - AC-JORG-016: Team регистрируется
 * - AC-JORG-017: Team меняет roster до deadline
 * - AC-JORG-018: Team меняет roster после deadline
 * - AC-JORG-019: User выбирает existing Game
 * - AC-JORG-020: User создаёт Game из Jam flow
 * - AC-JORG-021: Game уже в active Jam
 * - AC-JORG-022: Author меняет Jam-build до deadline
 * - AC-JORG-023: Author пытается менять build после freeze
 * - AC-JORG-024: Moderator approves Submission
 * - AC-JORG-025: Moderator rejects Submission
 * - AC-JORG-026: Organizer пытается модерировать свою Game
 * - AC-JORG-027: Judge scores criteria
 * - AC-JORG-028: Judge edits before close
 * - AC-JORG-029: Judge edits after close
 * - AC-JORG-030: Community voting включено
 * - AC-JORG-031: System computes ranking
 * - AC-JORG-032: Organizer/Admin publishes results
 * - AC-JORG-033: Admin corrects published result
 * - AC-JORG-034: Organizer предлагает partner
 * - AC-JORG-035: Admin verifies partner
 * - AC-JORG-036: Organizer adds prize
 * - AC-JORG-037: Organizer reduces prize after start
 * - AC-JORG-038: Winner reports prize non-delivery
 * - AC-JORG-039: Participant appeals disqualification
 * - AC-JORG-040: User reports Jam
 * - AC-JORG-041: Admin suspends Jam
 * - AC-JORG-042: Admin cancels Jam
 * - AC-JORG-043: Organizer posts announcement
 * - AC-JORG-044: Guest opens public Jam
 * - AC-JORG-045: Organizer opens analytics
 *
 * FRONTEND WORKSTREAMS COVERAGE (13/13):
 * - FE-JORG-001: organizer request drafts/list/detail/submit/resubmit.
 * - FE-JORG-002: organizer workspace with permission-aware navigation.
 * - FE-JORG-003: Jam setup/profile/rules/prizes/partners/version-change UX.
 * - FE-JORG-004: judge invitations/progress/head judge/conflicts.
 * - FE-JORG-005: User/Team registration + roster management.
 * - FE-JORG-006: Submission/Jam-build/freeze/moderation status.
 * - FE-JORG-007: organizer moderation queue/disqualification.
 * - FE-JORG-008: judging UI criteria/scores/comments/visibility.
 * - FE-JORG-009: results/awards/public corrections presentation.
 * - FE-JORG-010: appeals/reports/cancellation states.
 * - FE-JORG-011: public page organizer/partner/rules/prizes/judges/announcements.
 * - FE-JORG-012: organizer analytics.
 * - FE-JORG-013: admin organizer-request/trust/partner/prize/appeal/report panels.
 */

export type JamSubjectType = 'user' | 'team';

/** Granular permissions for Jam Organizer (BR-JORG-009, Section 00.4) */
export type JamPermission =
  | 'jam.manage_profile'
  | 'jam.manage_participants'
  | 'jam.manage_submissions'
  | 'jam.manage_judges'
  | 'jam.manage_results'
  | 'jam.manage_communications';

/** Organizer request lifecycle (Section 00.1, Section 03.3) */
export type JamOrganizerRequestStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'needs_changes'
  | 'cancelled';

/** Jam target lifecycle states (Section 00.8, Section 03.4) */
export type JamTargetLifecycleState =
  | 'preparing'
  | 'announced'
  | 'registration'
  | 'active'
  | 'submission_closed'
  | 'judging'
  | 'results_published'
  | 'finished'
  | 'archived'
  | 'suspended'
  | 'cancelled';

/** Judge invitation state machine (Section 00.11, Section 03.5) */
export type JamJudgeInvitationStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'revoked'
  | 'expired';

/** Submission state machine (Section 00.16, Section 03.6) */
export type JamSubmissionLifecycleStatus =
  | 'draft'
  | 'submitted'
  | 'on_moderation'
  | 'approved'
  | 'rejected'
  | 'withdrawn'
  | 'disqualified';

/** Partner verification state machine (Section 00.22, Section 03.8) */
export type JamPartnerVerificationStatus =
  | 'proposed'
  | 'under_review'
  | 'verified'
  | 'rejected'
  | 'revoked';

/** Prize fulfillment status (Section 00.21, Section 03.9) */
export type JamPrizeFulfillmentStatus =
  | 'declared'
  | 'verified'
  | 'due'
  | 'fulfilled'
  | 'disputed'
  | 'failed';

/** Appeal lifecycle status (Section 00.25, Section 03.10) */
export type JamAppealStatus =
  | 'submitted'
  | 'under_review'
  | 'accepted'
  | 'rejected'
  | 'withdrawn';

/** Report lifecycle status (Section 00.26, Section 03.11) */
export type JamReportStatus =
  | 'submitted'
  | 'triaged'
  | 'investigating'
  | 'resolved'
  | 'dismissed';

export type JamReportCategory =
  | 'fraud_prizes'
  | 'harassment'
  | 'prohibited_content'
  | 'plagiarism'
  | 'unsafe_links'
  | 'rule_abuse'
  | 'other';

/** Judging comment visibility (Section 00.20) */
export type JamJudgingCommentVisibility =
  | 'internal'
  | 'participant'
  | 'public_after_results';

/** 1. JamOrganizerRequest (Section 03.2) */
export interface JamOrganizerRequest {
  id: string;
  applicantUserId: string;
  applicantUserNick: string;
  organizerSubjectType: JamSubjectType;
  organizerSubjectId: string;
  organizerSubjectName: string;
  title: string;
  slug: string;
  concept: string;
  descriptionMd: string;
  proposedDates: {
    startAt: string;
    endAt: string;
    resultsAt: string;
  };
  formatPreset: 'short' | 'ranked' | 'non_ranked' | 'educational' | 'partner';
  rulesMd: string;
  organizerContact: string;
  coverUrl?: string;
  isRanked: boolean;
  expectedParticipantsCount: number;
  status: JamOrganizerRequestStatus;
  moderatorFeedback?: string;
  submittedAt?: string;
  decisionAt?: string;
  approvedJamId?: string;
  createdAt: string;
  updatedAt: string;
}

/** 2. JamOrganizerAssignment (Section 03.2) */
export interface JamOrganizerAssignment {
  id: string;
  jamId: string;
  subjectType: JamSubjectType;
  subjectId: string;
  subjectName: string;
  userId: string;
  permissions: JamPermission[];
  assignedAt: string;
  assignedBy: string;
}

/** 3. OrganizerTrustProfile (Section 03.2) */
export interface OrganizerTrustProfile {
  subjectType: JamSubjectType;
  subjectId: string;
  isVerifiedOrganizer: boolean;
  trustLevel: 'new' | 'standard' | 'trusted' | 'restricted';
  completedJamsCount: number;
  cancelledJamsCount: number;
  violationsCount: number;
  prizeFulfillmentRate: number;
  concurrentJamLimit: number;
  canCreateJam: boolean;
  restrictionReason?: string;
}

/** 4. JamPartner (Section 03.2) */
export interface JamPartner {
  id: string;
  jamId: string;
  name: string;
  logoUrl?: string;
  websiteUrl?: string;
  roleDescription: string;
  proposedBy: string;
  verificationStatus: JamPartnerVerificationStatus;
  verifiedBy?: string;
  verifiedAt?: string;
}

/** 5. JamPrize (Section 03.2) */
export interface JamPrize {
  id: string;
  jamId: string;
  type: 'money' | 'physical' | 'license' | 'service' | 'custom';
  title: string;
  amount?: string;
  currency?: string;
  description: string;
  provider: string;
  providerType: 'organizer' | 'partner' | 'community';
  fulfillmentStatus: JamPrizeFulfillmentStatus;
  versionNumber: number;
  placeNumber?: number;
}

/** 6. JamRuleVersion (Section 03.2) */
export interface JamRuleVersion {
  id: string;
  jamId: string;
  versionNumber: number;
  rulesMd: string;
  effectiveAt: string;
  changeReason?: string;
  isMaterialChange: boolean;
  moderationStatus: 'approved' | 'pending_review';
}

/** 7. JamJudgeInvitation (Section 03.2) */
export interface JamJudgeInvitation {
  id: string;
  jamId: string;
  jamTitle: string;
  targetUserId: string;
  targetUserNick: string;
  targetUserName: string;
  targetUserAvatar?: string;
  role: 'judge' | 'head_judge';
  status: JamJudgeInvitationStatus;
  invitedBy: string;
  createdAt: string;
  respondedAt?: string;
}

/** 8. JamJudgeAssignment (Section 03.2) */
export interface JamJudgeAssignment {
  id: string;
  jamId: string;
  userId: string;
  userNick: string;
  userName: string;
  userAvatar?: string;
  role: 'judge' | 'head_judge';
  assignedAt: string;
  ratedCount: number;
  assignedSubmissionsCount: number;
}

/** 9. JamJudgeConflict (Section 03.2) */
export interface JamJudgeConflict {
  id: string;
  jamId: string;
  judgeUserId: string;
  submissionId: string;
  gameTitle: string;
  reason: string;
  status: 'declared' | 'acknowledged';
  declaredAt: string;
}

/** 10. JamTeamRoster & Member (Section 03.2) */
export interface JamTeamRosterMember {
  userId: string;
  userNick: string;
  userName: string;
  roleInJam: string;
  avatarUrl?: string;
  joinedAt: string;
}

export interface JamTeamRoster {
  id: string;
  jamId: string;
  teamId: string;
  teamName: string;
  members: JamTeamRosterMember[];
  versionNumber: number;
  isFrozen: boolean;
  updatedAt: string;
}

/** 11. JamBuildSnapshot (Section 03.2) */
export interface JamBuildSnapshot {
  id: string;
  jamId: string;
  submissionId: string;
  gameId: string | number;
  versionString: string;
  fileSizeBytes: number;
  checksum: string;
  uploadedAt: string;
  isFrozen: boolean;
}

/** 12. JamDisqualification (Section 03.2) */
export interface JamDisqualification {
  id: string;
  jamId: string;
  submissionId: string;
  gameTitle: string;
  participantSubjectType: JamSubjectType;
  participantSubjectId: string;
  reason: string;
  evidence: string;
  disqualifiedBy: string;
  disqualifiedAt: string;
}

/** 13. JamAppeal (Section 03.2) */
export interface JamAppeal {
  id: string;
  jamId: string;
  jamTitle: string;
  submissionId: string;
  gameTitle: string;
  appellantUserId: string;
  appellantUserNick: string;
  targetDecisionType: 'rejection' | 'disqualification';
  reason: string;
  evidence: string;
  status: JamAppealStatus;
  reviewedBy?: string;
  reviewDecisionReason?: string;
  createdAt: string;
  decidedAt?: string;
}

/** 14. JamReport (Section 03.2) */
export interface JamReport {
  id: string;
  jamId: string;
  jamTitle: string;
  reporterUserId: string;
  category: JamReportCategory;
  description: string;
  evidenceUrl?: string;
  status: JamReportStatus;
  createdAt: string;
}

/** 15. JamAnnouncement (Section 03.2) */
export interface JamAnnouncement {
  id: string;
  jamId: string;
  authorUserId: string;
  authorName: string;
  title: string;
  contentMd: string;
  isPinned: boolean;
  publishedAt: string;
}

/** 16. JamAward (Section 03.2) */
export interface JamAward {
  id: string;
  jamId: string;
  submissionId: string;
  gameTitle: string;
  recipientName: string;
  category: 'place_1' | 'place_2' | 'place_3' | 'special_nomination' | 'finalist' | 'participant' | 'custom';
  title: string;
  awardedAt: string;
}

/** 17. JamResultCorrection (Section 03.2) */
export interface JamResultCorrection {
  id: string;
  jamId: string;
  previousResultsHash: string;
  correctionReason: string;
  appliedBy: string;
  createdAt: string;
}

/** 18. JamOrganizerAnalytics (Section 03.2, FE-JORG-012) */
export interface JamOrganizerAnalytics {
  jamId: string;
  viewsCount: number;
  followersCount: number;
  registrationsCount: number;
  soloCount: number;
  teamsCount: number;
  submissionsTotal: number;
  submissionsApproved: number;
  submissionsRejected: number;
  submissionsDisqualified: number;
  judgingCompletedPercent: number;
  trafficSources: { name: string; count: number; percent: number }[];
  dailyViewsHistory: { date: string; views: number; registrations: number; submissions: number }[];
}
