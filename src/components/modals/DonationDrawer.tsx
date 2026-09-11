import React, { useState } from 'react';
import { 
  Heart, 
  ExternalLink, 
  ShieldCheck, 
  ArrowUpRight, 
  Globe, 
  Coins, 
  Sparkles, 
  Info,
  CreditCard,
  MessageCircle,
  HelpCircle
} from 'lucide-react';
import Drawer from '../ui/Drawer';
import AntiPhishingModal from './AntiPhishingModal';
import { 
  CreatorSupportLink, 
  SupportContextType, 
  SupportSubjectType 
} from '../../types/creatorSupport';
import { 
  creatorSupportService, 
  PROVIDER_METADATA 
} from '../../services/creatorSupportService';

export interface DonationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  /** Author or team display name */
  recipientName?: string;
  /** Subject type: user (individual author) or team (studio/collective) */
  ownerType?: SupportSubjectType;
  /** Subject ID (user ID or team ID) */
  ownerId?: string;
  /** Context where the drawer was opened */
  context?: SupportContextType;
  /** ID of game or entity in context */
  contextId?: string | number;
  /** Optional pre-resolved support links */
  supportLinks?: CreatorSupportLink[];
  /** User role */
  role?: string;
  triggerToast?: (message: string, type?: any) => void;
}

export const DonationDrawer: React.FC<DonationDrawerProps> = ({
  isOpen,
  onClose,
  recipientName = 'Автор',
  ownerType = 'user',
  ownerId = 'u_nocturnal',
  context = 'game',
  contextId,
  supportLinks: passedLinks,
  triggerToast,
}) => {
  const [selectedLinkForRedirect, setSelectedLinkForRedirect] = useState<CreatorSupportLink | null>(null);
  const [showPlatformSupport, setShowPlatformSupport] = useState(false);

  // Dynamic projection of active owner-subject links (BR-CSP-015, BR-CSP-016)
  const activeLinks: CreatorSupportLink[] = passedLinks
    ? passedLinks.filter((l) => l.enabled && l.state === 'active')
    : creatorSupportService.getPublicLinks(ownerType, ownerId);

  const platformConfig = creatorSupportService.getPlatformSupportConfig();

  const handleLinkClick = (link: CreatorSupportLink) => {
    setSelectedLinkForRedirect(link);
  };

  const handleRedirectProceed = () => {
    if (!selectedLinkForRedirect) return;

    // Record click analytics (BR-CSP-021, BR-CSP-024)
    creatorSupportService.recordClick(
      selectedLinkForRedirect.id,
      context,
      contextId ? String(contextId) : undefined
    );

    // Open target canonical URL in a safe new window
    window.open(selectedLinkForRedirect.urlCanonical, '_blank', 'noopener,noreferrer');

    if (triggerToast) {
      triggerToast(
        `Переход на страницу поддержки ${selectedLinkForRedirect.label || PROVIDER_METADATA[selectedLinkForRedirect.provider]?.name}`,
        'info'
      );
    }

    setSelectedLinkForRedirect(null);
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'boosty':
        return <Coins className="w-5 h-5 text-[#f05a22]" />;
      case 'donationalerts':
        return <Heart className="w-5 h-5 text-[#f58220]" />;
      case 'yoomoney':
        return <CreditCard className="w-5 h-5 text-[#8b5cf6]" />;
      case 'cloudtips':
        return <Sparkles className="w-5 h-5 text-[#0ea5e9]" />;
      case 'patreon':
        return <Heart className="w-5 h-5 text-[#ff424d]" />;
      default:
        return <Globe className="w-5 h-5 text-accent" />;
    }
  };

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        title="Поддержать автора"
        subtitle={recipientName ? `Получатель: ${recipientName}` : undefined}
        size="md"
        footer={
          <div className="flex flex-col gap-3 pt-2">
            {/* PLATFORM NOTICE (BR-CSP-001, AC-CSP-016) */}
            <div className="flex items-center justify-between text-xs text-textTertiary pt-1">
              <span className="flex items-center gap-1.5 font-mono text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-success" />
                Безопасный внешний переход
              </span>
              <button
                type="button"
                onClick={() => setShowPlatformSupport(!showPlatformSupport)}
                className="text-[11px] text-accent hover:underline cursor-pointer font-medium"
              >
                {showPlatformSupport ? 'Скрыть поддержку платформы' : 'Поддержать HUBIGR'}
              </button>
            </div>

            {/* EXPANDABLE PLATFORM SUPPORT (FE-CSP-005, CSP-API-016) */}
            {showPlatformSupport && (
              <div className="p-3.5 bg-surface-2 border border-borderDef rounded-xl flex flex-col gap-2.5 animate-fadeIn">
                <div className="flex items-center gap-2 text-xs font-bold text-textPrimary">
                  <Heart className="w-3.5 h-3.5 text-accent" />
                  <span>{platformConfig.headline}</span>
                </div>
                <p className="text-[11px] text-textSecondary leading-normal">
                  {platformConfig.description}
                </p>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {platformConfig.links.map((pLink) => (
                    <button
                      key={pLink.id}
                      type="button"
                      onClick={() => handleLinkClick(pLink)}
                      className="p-2 bg-surface-1 hover:bg-surface-3 border border-borderDef rounded-lg text-left flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span className="text-xs font-medium text-textPrimary truncate">{pLink.label}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-textTertiary shrink-0 ml-1" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        }
      >
        <div className="flex flex-col gap-5 flex-1">
          {/* NOTICE BANNER (BR-CSP-001: No internal escrow, 0% platform fee) */}
          <div className="p-4 rounded-xl bg-accent/10 border border-accent/25 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent shrink-0 mt-0.5">
              <Info className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-textPrimary uppercase tracking-wider">
                Прямая поддержка без комиссий платформы
              </div>
              <p className="text-xs text-textSecondary mt-1 leading-normal">
                HUBIGR не принимает донаты во внутренний кошелек и не удерживает комиссий. Выберите удобный способ поддержать автора напрямую на его внешней странице.
              </p>
            </div>
          </div>

          {/* ACTIVE EXTERNAL SUPPORT LINKS */}
          {activeLinks.length > 0 ? (
            <div className="flex flex-col gap-3">
              <span className="text-xs font-mono uppercase tracking-wider text-textTertiary font-semibold">
                Доступные способы поддержки ({activeLinks.length})
              </span>

              <div className="flex flex-col gap-2.5">
                {activeLinks.map((link) => {
                  const meta = PROVIDER_METADATA[link.provider] || PROVIDER_METADATA.custom;
                  let hostname = '';
                  try {
                    const parsed = new URL(link.urlCanonical);
                    hostname = parsed.hostname;
                  } catch {
                    hostname = link.urlCanonical;
                  }

                  return (
                    <div
                      key={link.id}
                      onClick={() => handleLinkClick(link)}
                      className="p-3.5 bg-surface-1 hover:bg-surface-2 border border-borderDef hover:border-accent/40 rounded-xl transition-all duration-150 cursor-pointer group flex items-center justify-between gap-3 shadow-sm active:scale-[0.99]"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-11 h-11 rounded-xl bg-surface-2 group-hover:bg-surface-3 border border-borderDef flex items-center justify-center shrink-0 transition-colors">
                          {getProviderIcon(link.provider)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-textPrimary group-hover:text-accent transition-colors truncate">
                              {link.label || meta.name}
                            </h4>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${meta.badgeColor} shrink-0`}>
                              {meta.name}
                            </span>
                          </div>
                          <p className="text-xs text-textTertiary truncate mt-0.5">
                            {meta.defaultDescription}
                          </p>
                          <div className="text-[11px] font-mono text-textTertiary/80 truncate mt-0.5">
                            {hostname}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="w-8 h-8 rounded-lg bg-surface-2 group-hover:bg-accent group-hover:text-white flex items-center justify-center text-textTertiary transition-colors">
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* EMPTY STATE: AUTHOR HAS NO ACTIVE LINKS (AC-CSP-007, AC-CSP-010) */
            <div className="p-8 bg-surface-1 border border-borderDef rounded-2xl text-center flex flex-col items-center gap-4 my-auto">
              <div className="w-14 h-14 rounded-full bg-surface-2 flex items-center justify-center text-textTertiary">
                <Heart className="w-7 h-7 stroke-[1.5]" />
              </div>
              <div className="flex flex-col gap-1 max-w-[320px]">
                <h4 className="text-base font-bold text-textPrimary">
                  У автора пока нет ссылок для поддержки
                </h4>
                <p className="text-xs text-textSecondary leading-relaxed">
                  Разработчик еще не подключил внешние сервисы донатов, но вы можете поддержать проект активностью на платформе:
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2 w-full mt-2 text-left">
                <div className="p-3 rounded-xl bg-surface-2/60 border border-borderDef/60 flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-accent shrink-0" />
                  <span className="text-xs text-textPrimary">Добавьте игру в избранное или в коллекцию</span>
                </div>
                <div className="p-3 rounded-xl bg-surface-2/60 border border-borderDef/60 flex items-center gap-3">
                  <MessageCircle className="w-4 h-4 text-accent shrink-0" />
                  <span className="text-xs text-textPrimary">Оставьте подробный отзыв и оценку в сообществе</span>
                </div>
              </div>
            </div>
          )}

          {/* SECURITY REMINDER */}
          <div className="mt-auto pt-4 border-t border-borderDef/50 flex items-center gap-2.5 text-textTertiary">
            <HelpCircle className="w-4 h-4 shrink-0" />
            <span className="text-[11px] leading-snug">
              При переходе HUBIGR покажет окно антифишинговой защиты с подтверждением оригинального домена.
            </span>
          </div>
        </div>
      </Drawer>

      {/* ANTI-PHISHING VERIFICATION MODAL (AC-CSP-011, AC-CSP-013) */}
      {selectedLinkForRedirect && (
        <AntiPhishingModal
          isOpen={true}
          onClose={() => setSelectedLinkForRedirect(null)}
          targetUrl={selectedLinkForRedirect.urlCanonical}
          platformName={
            selectedLinkForRedirect.label ||
            PROVIDER_METADATA[selectedLinkForRedirect.provider]?.name
          }
          onProceed={handleRedirectProceed}
        />
      )}
    </>
  );
};

export default DonationDrawer;
