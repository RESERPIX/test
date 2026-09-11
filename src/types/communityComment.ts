import { CommunityThread } from './community';

export interface CommunityComment {
  id: string;
  threadId: string;
  parentId: string | null; // null if it's a root post
  authorId: string;
  authorNick: string;
  authorAvatarUrl: string;
  isThreadAuthor: boolean;
  bodyMarkdown: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  likesCount: number;
  isSolution: boolean;
  isEdited?: boolean;
  moderationDeleteReason?: string;
  replies?: CommunityComment[]; // Nested replies up to 1 level deep for UI purposes
}

