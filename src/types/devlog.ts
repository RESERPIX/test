export type DevLogType = 'update' | 'postmortem' | 'need_feedback' | 'looking_for_team' | 'announcement';
export type DevLogCoreStatus = 'draft' | 'published' | 'hidden' | 'blocked';

export interface DevLogFeedbackDetails {
  feedbackCategories: string[];
  questions: string[];
  platforms: string[];
}

export interface DevLogRecruitmentDetails {
  roles: string[];
  participationFormat: 'enthusiasm' | 'jam' | 'revshare' | 'commercial';
  summary: string;
  engine?: string;
}

export interface DevLogPost {
  id: string;
  slug: string;
  title: string;
  bodyMarkdown: string;
  type: DevLogType;
  
  coverUrl?: string | null;

  // Authorship
  authorUserId: string;
  authorNick: string;
  authorAvatarUrl?: string | null;

  // Publisher
  publisherType: 'user' | 'team';
  publisherId: string; // userId or teamId
  publisherName: string;
  publisherAvatarUrl?: string | null;

  // Core Status
  coreStatus: DevLogCoreStatus;
  
  // Relations
  gameId?: string | null;
  gameSlug?: string | null;
  gameName?: string | null;

  jamId?: string | null;
  jamSlug?: string | null;
  jamName?: string | null;

  // Metadata & Tags
  tags: string[];

  // Time & Lifecycle
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
  
  // Orthogonal markers
  scheduledAt?: string | null;
  deletedAt?: string | null;
  archivedAt?: string | null;
  archiveReason?: string | null;
  
  isEdited: boolean; // True if edited after publication
  isCommentsDisabled: boolean;
  isPinnedToGame?: boolean;

  // Moderation
  blockReason?: string | null;

  // Metrics
  normalizedViews: number;
  likesCount: number;
  commentsCount: number;

  // Dynamic Content Details
  feedbackDetails?: DevLogFeedbackDetails;
  recruitmentDetails?: DevLogRecruitmentDetails;
}
