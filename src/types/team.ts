// Domain: Team (M7 RoadMap Specification: team.md)
// Source of truth for changes/team/01...05

export type TeamType = 'indie_team' | 'studio' | 'collective' | 'company_organization' | 'other';

export type TeamRole = 'owner' | 'admin' | 'member';

export type TeamPermissionKey = 
  | 'game_manage' 
  | 'devlog_manage' 
  | 'reviews_manage' 
  | 'feedback_manage' 
  | 'bugs_manage' 
  | 'stats_view' 
  | 'finance_view' 
  | 'team_manage_support';

export type TeamPermissions = Record<TeamPermissionKey, boolean>;

export const DEFAULT_MEMBER_PERMISSIONS: TeamPermissions = {
  game_manage: true,
  devlog_manage: true,
  reviews_manage: false,
  feedback_manage: false,
  bugs_manage: true,
  stats_view: false,
  finance_view: false,
  team_manage_support: false,
};

export const OWNER_PERMISSIONS: TeamPermissions = {
  game_manage: true,
  devlog_manage: true,
  reviews_manage: true,
  feedback_manage: true,
  bugs_manage: true,
  stats_view: true,
  finance_view: true,
  team_manage_support: true,
};

export interface TeamMember {
  id: string;
  userId?: string;
  nick: string;
  name: string;
  avatar: string;
  role: TeamRole;
  permissions: TeamPermissions;
  joinedAt?: string;
}

export type TeamInvitationStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';

export interface TeamInvitation {
  id: string;
  teamId: string;
  teamName: string;
  teamSlug: string;
  teamLogo?: string;
  inviterNick: string;
  inviterName?: string;
  targetUserQuery: string;
  targetUserId?: string;
  targetRole: 'admin' | 'member';
  permissions: TeamPermissions;
  status: TeamInvitationStatus;
  createdAt: string;
  expiresAt?: string;
}

export type TeamOwnershipTransferStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';

export interface TeamOwnershipTransfer {
  id: string;
  teamId: string;
  teamName: string;
  currentOwnerId: string;
  currentOwnerNick: string;
  targetMemberId: string;
  targetMemberNick: string;
  targetMemberName: string;
  status: TeamOwnershipTransferStatus;
  createdAt: string;
}

export interface TeamContacts {
  email?: string;
  phone?: string;
  telegram?: string;
  vk?: string;
  website?: string;
  discord?: string;
}

export interface TeamSupportLink {
  id: string;
  platform: 'Boosty' | 'DonationAlerts' | 'CloudTips' | 'Patreon' | string;
  url: string;
  verified: boolean;
  desc?: string;
}

export interface TeamSettings {
  hideMembers: boolean;
  hideJamAchievements: boolean;
}

export interface TeamAuditRecord {
  id: string;
  timestamp: string;
  action: string;
  actorNick: string;
  details?: string;
}

export interface Team {
  id: string;
  slug: string;
  name: string;
  type: TeamType;
  customType?: string;
  logo?: string;
  coverUrl?: string;
  description?: string;
  userRole?: TeamRole;
  membersCount: number;
  gamesCount: number;
  members: TeamMember[];
  contacts?: TeamContacts;
  supportLinks?: TeamSupportLink[];
  settings?: TeamSettings;
  createdAt: string;
  previousSlugs?: string[];
  pendingTransfer?: TeamOwnershipTransfer | null;
  activeJamsCount?: number;
  hasActiveSettlements?: boolean;
}
