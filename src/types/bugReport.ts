// Domain: BugReport (M4 RoadMap Specification: bug-report.md)
// Separate from GameReview (Market), NeedFeedback (Community), and Moderation Content Report.

export type BugStatus = 'new' | 'confirmed' | 'in_progress' | 'fixed' | 'rejected' | 'duplicate';
export type BugReportStatus = BugStatus;

export type BugSeverity = 'low' | 'medium' | 'high' | 'critical';
export type BugReportSeverity = BugSeverity;

export type BugReportPriority = 'P0' | 'P1' | 'P2' | 'P3' | 'low' | 'medium' | 'high' | 'urgent';

export interface BugAttachment {
  id: string;
  name: string;
  url: string;
  size?: number;
  sizeBytes?: number;
  type?: 'image' | 'log' | 'video' | 'file' | string;
  mimeType?: string;
  uploadedAt?: string;
  isSafe?: boolean;
}
export type BugReportAttachment = BugAttachment;

export interface BugReportRevision {
  revisionId: string;
  editedAt: string;
  title: string;
  description: string;
  stepsToReproduce?: string;
  steps?: string;
  expectedResult?: string;
  expectedBehavior?: string;
  actualResult?: string;
  actualBehavior?: string;
}

export type BugMessageVisibility = 'public_to_reporter' | 'creator_only';

export interface BugComment {
  id: string;
  bugReportId?: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorRole?: 'reporter' | 'creator' | 'staff';
  isCreator?: boolean;
  isInternal?: boolean; // BR-BUG-025: Internal Note
  visibility?: BugMessageVisibility;
  content: string;
  attachments?: BugAttachment[];
  createdAt: string;
}
export type BugReportMessage = BugComment;

export interface BugReport {
  id: string;
  gameId: string;
  gameTitle: string;
  buildVersion?: string;
  platform?: string;
  
  title: string;
  description: string;
  
  // Steps to reproduce
  steps?: string;
  stepsToReproduce?: string;
  
  // Expected & Actual results
  expectedBehavior?: string;
  expectedResult?: string;
  actualBehavior?: string;
  actualResult?: string;

  // Reporter info
  reporterId: string;
  reporterName?: string;
  reporterNick?: string;
  reporterAvatar?: string;
  reporterSeverity: BugSeverity;

  // Creator triage info
  triageSeverity?: BugSeverity;
  confirmedSeverity?: BugSeverity;
  priority?: BugReportPriority;
  status: BugStatus;
  
  // Reject & Duplicate references
  rejectReason?: string;
  rejectedReason?: string;
  duplicateTargetId?: string;
  duplicateOfBugReportId?: string;
  isDuplicateTargetVisible?: boolean;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  triagedAt?: string;
  resolvedAt?: string;

  // Attachments & Revisions & Comments/Messages
  attachments: BugAttachment[];
  comments?: BugComment[];
  revisions?: BugReportRevision[];
  messagesCount?: number;
  internalNotesCount?: number;

  isWithdrawn?: boolean;
  scope?: string;
}

export interface BugReportFilterParams {
  gameId?: string;
  status?: BugStatus | 'all' | 'active';
  severity?: BugSeverity | 'all';
  searchQuery?: string;
  buildVersion?: string;
}

export interface BugReportStats {
  total: number;
  newCount: number;
  confirmedCount: number;
  inProgressCount: number;
  fixedCount: number;
  rejectedCount: number;
  duplicateCount: number;
  criticalCount: number;
}
