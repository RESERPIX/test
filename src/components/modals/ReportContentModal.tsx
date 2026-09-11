/**
 * ReportContentModal - Wrapper for AbuseReportDrawer with auth check
 * Provides backward compatibility with existing code while using new implementation
 */
import React from 'react';
import { AbuseReportDrawer } from './AbuseReportModal';

interface ReportContentModalProps {
  isOpen: boolean;
  game: {
    id?: string;
    title: string;
    author?: string | { name: string; [key: string]: any };
    coverUrl?: string;
  } | null;
  onClose: () => void;
  onSuccessfulSubmit?: () => void; // Callback after successful report submission
  triggerToast?: (message: string, type?: any) => void;
  role?: string; // 'Guest' | 'player' | 'developer' | etc.
}

/**
 * Legacy wrapper component that delegates to AbuseReportModal
 * Maintains API compatibility with existing GamesCatalogPage, LibraryPage, etc.
 * 
 * Auth check: If role === 'Guest', shows toast and blocks modal opening
 */
export const ReportContentModal: React.FC<ReportContentModalProps> = ({
  isOpen,
  game,
  onClose,
  onSuccessfulSubmit,
  triggerToast,
  role
}) => {
  // Pre-condition: Check authorization (client-side)
  React.useEffect(() => {
    if (isOpen && role === 'Guest') {
      if (triggerToast) {
        triggerToast('Войдите в аккаунт, чтобы отправить жалобу на проект', 'warning');
      }
      onClose(); // Close immediately without showing modal
    }
  }, [isOpen, role, onClose, triggerToast]);

  // Don't render if not open, no game, or user is guest
  if (!isOpen || !game || role === 'Guest') return null;

  const handleClose = () => {
    onClose();
  };

  return (
    <AbuseReportDrawer
      isOpen={isOpen}
      onClose={handleClose}
      gameId={game.id || 'unknown'}
      gameTitle={game.title}
      gameAuthor={typeof game.author === 'string' ? game.author : (game.author?.name || 'Неизвестный автор')}
      gameCoverUrl={game.coverUrl}
      onSuccessfulSubmit={onSuccessfulSubmit}
    />
  );
};

export default ReportContentModal;
