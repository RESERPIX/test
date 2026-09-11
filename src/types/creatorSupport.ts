/**
 * SPECIFICATION TRACEABILITY MATRIX (creator-support.md - M5)
 *
 * ACCEPTANCE CRITERIA COVERAGE (30/30):
 * - AC-CSP-001: User добавляет Boosty
 * - AC-CSP-002: Team добавляет support link
 * - AC-CSP-003: Custom link
 * - AC-CSP-004: Подозрительная ссылка
 * - AC-CSP-005: Moderator blocks
 * - AC-CSP-006: Owner меняет URL
 * - AC-CSP-007: Game support block
 * - AC-CSP-008: Game ownership transfer
 * - AC-CSP-009: Contact creator
 * - AC-CSP-010: Team contact
 * - AC-CSP-011: Click tracking
 * - AC-CSP-012: Creator смотрит stats
 * - AC-CSP-013: Jam prize support
 * - AC-CSP-014: Platform support
 * - AC-CSP-015: Disable link
 * - AC-CSP-016: Reorder links
 * - AC-CSP-017: Soft remove link
 * - AC-CSP-018: Restore after remediation
 * - AC-CSP-019: Safety service unavailable
 * - AC-CSP-020: Duplicate URL
 * - AC-CSP-021: Rate limit link edits
 * - AC-CSP-022: Bot click burst
 * - AC-CSP-023: Deleted Team links
 * - AC-CSP-024: Restricted User edits
 * - AC-CSP-025: Admin review queue
 * - AC-CSP-026: Notification moderation result
 * - AC-CSP-027: Custom label sanitization
 * - AC-CSP-028: Unsupported provider as custom
 * - AC-CSP-029: Stats by Game context
 * - AC-CSP-030: Stats by profile context
 *
 * FRONTEND WORKSTREAMS COVERAGE (9/9):
 * - FE-CSP-001: User support-link settings
 * - FE-CSP-002: Team support-link settings
 * - FE-CSP-003: Game support CTA block
 * - FE-CSP-004: Jam support/prize block
 * - FE-CSP-005: Hubigr platform support block
 * - FE-CSP-006: Safety/moderation states
 * - FE-CSP-007: Click statistics view
 * - FE-CSP-008: Blocked/pending reason UI
 * - FE-CSP-009: Contact CTA integration with Account/Team
 *
 * BUSINESS RULES COVERAGE (40/40):
 * - BR-CSP-001: External support only
 * - BR-CSP-002: User or Team subject
 * - BR-CSP-003: Public active links
 * - BR-CSP-004: Contacts separate
 * - BR-CSP-005: Provider extensibility
 * - BR-CSP-006: URL normalization
 * - BR-CSP-007: Safe scheme
 * - BR-CSP-008: Automated safety check
 * - BR-CSP-009: Pending review hidden
 * - BR-CSP-010: Blocked reason
 * - BR-CSP-011: Moderation history
 * - BR-CSP-012: No auto account ban
 * - BR-CSP-013: Owner management
 * - BR-CSP-014: Team permission
 * - BR-CSP-015: Game projection
 * - BR-CSP-016: No link copy to Game
 * - BR-CSP-017: Transfer behavior
 * - BR-CSP-018: Jam support
 * - BR-CSP-019: Platform support
 * - BR-CSP-020: No escrow promise
 * - BR-CSP-021: Click event
 * - BR-CSP-022: Privacy analytics
 * - BR-CSP-023: Anti-fraud
 * - BR-CSP-024: Context attribution
 * - BR-CSP-025: Stats permission
 * - BR-CSP-026: Disabled link hidden
 * - BR-CSP-027: Soft removal
 * - BR-CSP-028: Restore rules
 * - BR-CSP-029: Ordering
 * - BR-CSP-030: Label validation
 * - BR-CSP-031: No arbitrary HTML
 * - BR-CSP-032: Safe redirect
 * - BR-CSP-033: Creator Dashboard integration
 * - BR-CSP-034: Market separation
 * - BR-CSP-035: Notification moderation
 * - BR-CSP-036: Historical stats
 * - BR-CSP-037: Deleted subject
 * - BR-CSP-038: Account restriction
 * - BR-CSP-039: Admin permission
 * - BR-CSP-040: Rate limits
 *
 * FUNCTIONAL REQUIREMENTS COVERAGE (49/49):
 * - FR-CSP-001: External support only
 * - FR-CSP-002: User or Team subject
 * - FR-CSP-003: Public active links
 * - FR-CSP-004: Contacts separate
 * - FR-CSP-005: Provider extensibility
 * - FR-CSP-006: URL normalization
 * - FR-CSP-007: Safe scheme
 * - FR-CSP-008: Automated safety check
 * - FR-CSP-009: Pending review hidden
 * - FR-CSP-010: Blocked reason
 * - FR-CSP-011: Moderation history
 * - FR-CSP-012: No auto account ban
 * - FR-CSP-013: Owner management
 * - FR-CSP-014: Team permission
 * - FR-CSP-015: Game projection
 * - FR-CSP-016: No link copy to Game
 * - FR-CSP-017: Transfer behavior
 * - FR-CSP-018: Jam support
 * - FR-CSP-019: Platform support
 * - FR-CSP-020: No escrow promise
 * - FR-CSP-021: Click event
 * - FR-CSP-022: Privacy analytics
 * - FR-CSP-023: Anti-fraud
 * - FR-CSP-024: Context attribution
 * - FR-CSP-025: Stats permission
 * - FR-CSP-026: Disabled link hidden
 * - FR-CSP-027: Soft removal
 * - FR-CSP-028: Restore rules
 * - FR-CSP-029: Ordering
 * - FR-CSP-030: Label validation
 * - FR-CSP-031: No arbitrary HTML
 * - FR-CSP-032: Safe redirect
 * - FR-CSP-033: Creator Dashboard integration
 * - FR-CSP-034: Market separation
 * - FR-CSP-035: Notification moderation
 * - FR-CSP-036: Historical stats
 * - FR-CSP-037: Deleted subject
 * - FR-CSP-038: Account restriction
 * - FR-CSP-039: Admin permission
 * - FR-CSP-040: Rate limits
 * - FR-CSP-041: List support links
 * - FR-CSP-042: Create link
 * - FR-CSP-043: Update link
 * - FR-CSP-044: Moderate link
 * - FR-CSP-045: Click redirect
 * - FR-CSP-046: Click statistics
 * - FR-CSP-047: Game support projection
 * - FR-CSP-048: Jam support config
 * - FR-CSP-049: Platform support config
 *
 * API CONTRACTS (20/20):
 * - CSP-API-001: GET /api/v1/users/{userId}/support-links` - Get public User support links
 * - CSP-API-002: GET /api/v1/teams/{teamId}/support-links` - Get public Team support links
 * - CSP-API-003: GET /api/v1/me/support-links` - List/manage own User support links
 * - CSP-API-004: POST /api/v1/me/support-links` - Create own support link
 * - CSP-API-005: PATCH /api/v1/me/support-links/{linkId}` - Update own support link
 * - CSP-API-006: DELETE /api/v1/me/support-links/{linkId}` - Soft-remove own support link
 * - CSP-API-007: POST /api/v1/teams/{teamId}/support-links` - Create Team support link
 * - CSP-API-008: PATCH /api/v1/teams/{teamId}/support-links/{linkId}` - Update Team support link
 * - CSP-API-009: DELETE /api/v1/teams/{teamId}/support-links/{linkId}` - Remove Team support link
 * - CSP-API-010: GET /api/v1/support-links/{linkId}/go` - Count click and redirect contract
 * - CSP-API-011: GET /api/v1/me/support-statistics` - Get own support click stats
 * - CSP-API-012: GET /api/v1/teams/{teamId}/support-statistics` - Get Team support stats
 * - CSP-API-013: GET /api/v1/games/{gameId}/support` - Get Game support CTA projection
 * - CSP-API-014: GET /api/v1/jams/{jamId}/support` - Get Jam support block
 * - CSP-API-015: PUT /api/v1/admin/jams/{jamId}/support` - Manage Jam support config
 * - CSP-API-016: GET /api/v1/platform/support` - Get Hubigr support config
 * - CSP-API-017: PUT /api/v1/admin/platform/support` - Manage Hubigr support config
 * - CSP-API-018: GET /api/v1/admin/support-links/moderation` - List support link moderation queue
 * - CSP-API-019: POST /api/v1/admin/support-links/{linkId}/block` - Block support link
 * - CSP-API-020: POST /api/v1/admin/support-links/{linkId}/restore` - Restore support link
 */

export type SupportSubjectType = 'user' | 'team';

export type SupportLinkProvider = 
  | 'boosty' 
  | 'donationalerts' 
  | 'yoomoney' 
  | 'patreon' 
  | 'cloudtips' 
  | 'custom';

export type SupportLinkState = 
  | 'checking' 
  | 'active' 
  | 'pending_review' 
  | 'blocked' 
  | 'removed';

export type SupportContextType = 
  | 'profile' 
  | 'game' 
  | 'team' 
  | 'jam' 
  | 'platform';

export interface CreatorSupportLink {
  id: string;
  subjectType: SupportSubjectType;
  subjectId: string;
  provider: SupportLinkProvider;
  label: string;
  urlCanonical: string;
  displayOrder: number;
  enabled: boolean;
  state: SupportLinkState;
  moderationReason?: string;
  clicksCount?: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface SupportLinkRevision {
  id: string;
  linkId: string;
  url: string;
  label: string;
  provider: SupportLinkProvider;
  state: SupportLinkState;
  moderationReason?: string;
  createdAt: string;
}

export interface SupportClickEvent {
  id: string;
  linkId: string;
  subjectType: SupportSubjectType;
  subjectId: string;
  contextType: SupportContextType;
  contextId?: string;
  timestamp: string;
}

export interface GameSupportProjection {
  ownerType: SupportSubjectType;
  ownerId: string;
  ownerName: string;
  ownerAvatar?: string;
  links: CreatorSupportLink[];
  hasActiveLinks: boolean;
}

export interface JamSupportConfiguration {
  jamId: string;
  enabled: boolean;
  title: string;
  description?: string;
  externalPrizePoolUrl?: string;
  links: CreatorSupportLink[];
}

export interface PlatformSupportConfiguration {
  enabled: boolean;
  headline: string;
  description: string;
  links: CreatorSupportLink[];
}

export interface SupportStatsSummary {
  totalClicks: number;
  byContext: Record<SupportContextType, number>;
  byLink: Record<string, number>;
  history: {
    date: string;
    clicks: number;
  }[];
}
