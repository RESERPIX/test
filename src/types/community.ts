export type CommunityVisibilityState = 'published' | 'hidden' | 'blocked';
export type CommunityDiscussionState = 'open' | 'locked' | 'archived';

export type CommunityThreadType = 'normal' | 'looking_for_team' | 'need_feedback' | 'show_progress' | 'share_reference';

export interface CommunityCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  order: number;
}

export interface CommunityThreadBase {
  id: string;
  categoryId: string;
  type: CommunityThreadType;
  title: string;
  bodyMarkdown: string;
  
  // Author
  authorId: string;
  authorNick: string;
  authorAvatarUrl?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  
  // States
  visibilityState: CommunityVisibilityState;
  discussionState: CommunityDiscussionState;
  
  // System Flags
  isOfficial: boolean;
  isPinned: boolean;
  
  // Solution
  solutionPostId?: string | null;
  isSolved: boolean;
  
  // Context Links
  linkedGameId?: string | null;
  linkedGameSlug?: string | null;
  linkedGameName?: string | null;
  
  linkedJamId?: string | null;
  linkedJamSlug?: string | null;
  linkedJamName?: string | null;
  contextType?: 'global' | 'jam';
  
  // Tags
  tags: string[];
  
  // Stats
  normalizedViews: number;
  repliesCount: number;
  likesCount: number;
}

// Special Type: Looking For Team
export interface LookingForTeamDetails {
  roles: string[];
  participationFormat: 'enthusiasm' | 'jam' | 'revshare' | 'commercial';
  summary: string;
  engine?: string;
  skills: string[];
  experience?: 'beginner' | 'mid' | 'senior';
  searchState: 'active' | 'closed';
  closeReason?: 'team_found' | 'no_longer_needed' | 'project_cancelled' | 'other' | null;
}

// Special Type: Need Feedback
export interface NeedFeedbackDetails {
  feedbackCategories: string[];
  questions: string[];
  platform: string[];
  estimatedTime?: string;
}

// Special Type: Show Progress
export interface ShowProgressDetails {
  mediaUrls: string[];
  devLogId?: string | null;
}

// Special Type: Share Reference
export interface ShareReferenceDetails {
  sourceType: 'devlog' | 'jam_thread';
  sourceId: string;
  sourceTitle: string;
  sourcePreview: string;
  sourceUrl: string;
  sourceAuthorNick: string;
  sourceCreatedAt: string;
}

export type CommunityThread = CommunityThreadBase & {
  lookingForTeamDetails?: LookingForTeamDetails;
  needFeedbackDetails?: NeedFeedbackDetails;
  showProgressDetails?: ShowProgressDetails;
  shareReferenceDetails?: ShareReferenceDetails;
};
