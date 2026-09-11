import React from 'react';
import DevMatrixPanel from './components/DevMatrixPanel';

const MarketPage = React.lazy(() => import('./pages/MarketPage'));
const HomePage = React.lazy(() => import('./pages/HomePage'));
const GamePage = React.lazy(() => import('./pages/GamePage'));
const JamsCatalogPage = React.lazy(() => import('./pages/JamsCatalogPage'));
const JamPage = React.lazy(() => import('./pages/JamPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const CreatorDashboardPage = React.lazy(() => import('./pages/CreatorDashboardPage'));
const JuryEvaluationsPage = React.lazy(() => import('./pages/JuryEvaluationsPage'));
const JamCreationPage = React.lazy(() => import('./pages/JamCreationPage'));
const GameSubmissionPage = React.lazy(() => import('./pages/GameSubmissionPage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const SupportPage = React.lazy(() => import('./pages/SupportPage'));
const TutorialPage = React.lazy(() => import('./pages/TutorialPage'));
const LibraryPage = React.lazy(() => import('./pages/LibraryPage'));
const JamGamePage = React.lazy(() => import('./pages/JamGamePage'));
const CommunityPage = React.lazy(() => import('./pages/CommunityPage'));
const CommunityThreadPage = React.lazy(() => import('./pages/CommunityThreadPage'));
const CommunityNewThreadPage = React.lazy(() => import('./pages/CommunityNewThreadPage'));
const CommunitySubscriptionsPage = React.lazy(() => import('./pages/CommunitySubscriptionsPage'));
const DevLogsHubPage = React.lazy(() => import('./pages/DevLogsHubPage'));
const DevLogPage = React.lazy(() => import('./pages/DevLogPage'));
const DevLogEditorPage = React.lazy(() => import('./pages/DevLogEditorPage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));
const GameEditorPage = React.lazy(() => import('./pages/GameEditorPage'));
const MarketAdminPage = React.lazy(() => import('./pages/MarketAdminPage'));
const TeamsCatalogPage = React.lazy(() => import('./pages/TeamsCatalogPage'));
const TeamDashboardPage = React.lazy(() => import('./pages/TeamDashboardPage'));
const AccountRestrictedPage = React.lazy(() => import('./pages/AccountRestrictedPage'));
const AdminUsersPage = React.lazy(() => import('./pages/AdminUsersPage'));
const PurchaseHistoryPage = React.lazy(() => import('./pages/PurchaseHistoryPage'));
const MyBugsPage = React.lazy(() => import('./pages/MyBugsPage'));
const CheckoutPage = React.lazy(() => import('./pages/CheckoutPage'));

const PageLoadingFallback = () => (
  <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-4 animate-fadeIn">
    <div className="w-10 h-10 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
    <span className="text-xs font-mono uppercase tracking-widest text-textTertiary">Загрузка модуля HUBIGR...</span>
  </div>
);

interface AppRouterProps {
  currentPath: string;
  authState: string;
  setAuthState: (state: string) => void;
  setCurrentPath: (path: string) => void;
  activeNavItem: any;
  showToastNotification: (text: string, type?: string) => void;
  NAV_LINKS: any[];
  ABOUT_DROPDOWN_ITEMS: any[];
}

export const AppRouter = React.memo(({
  currentPath,
  authState,
  setAuthState,
  setCurrentPath,
  activeNavItem,
  showToastNotification,
  NAV_LINKS,
  ABOUT_DROPDOWN_ITEMS
}: AppRouterProps) => {
  return (
        <main className="w-full pb-24 md:pb-12">
          <React.Suspense fallback={<PageLoadingFallback />}>
            {(() => {
              const path = currentPath.split('#')[0].split('?')[0];
              const searchParams = new URLSearchParams(currentPath.split('?')[1] || '');
              const urlScope = searchParams.get('scope') || 'personal';

              // 0. Home Page
              if (path === '/') {
                return <HomePage />;
              }

              // 1. Market / Games Catalog
              if (path === '/market' || path === '/games') {
                return <MarketPage authState={authState} setAuthState={setAuthState} />;
              }

              // 1.5 Market Checkout Flow
              if (path === '/checkout' || path === '/market/checkout') {
                return (
                  <CheckoutPage
                    onClose={() => setCurrentPath('/market')}
                    onGoToLibrary={() => setCurrentPath('/library')}
                    onGoToPurchases={() => setCurrentPath('/purchases')}
                    onGoToGame={() => setCurrentPath('/market')}
                  />
                );
              }

              // 2. Game Page Detail
              if (path.startsWith('/games/')) {
                const slug = path.replace('/games/', '');
                return <GamePage slug={slug} authState={authState} setAuthState={setAuthState} />;
              }

              // 4. Jams Catalog
              if (path === '/jams') {
                return <JamsCatalogPage authState={authState} setAuthState={setAuthState} />;
              }

              // 4.5. Jam Creation Page
              if (path === '/jams/create' || path === '/jams/new') {
                return <JamCreationPage authState={authState} setAuthState={setAuthState} />;
              }

              // 4.6. Game Submission Page (Submit game to jam)
              if (path.endsWith('/submit') || path === '/games/submit') {
                return <GameSubmissionPage authState={authState} setAuthState={setAuthState} />;
              }

              // 4.7. Jam Game Page Detail (/jams/:jamSlug/:gameSlug)
              const jamGameMatch = path.match(/^\/jams\/([^/]+)\/([^/]+)$/);
              if (jamGameMatch) {
                const [_, jamSlug, gameSlug] = jamGameMatch;
                if (gameSlug !== 'create' && gameSlug !== 'new') {
                  return <JamGamePage jamSlug={jamSlug} gameSlug={gameSlug} slug={gameSlug} authState={authState} setAuthState={setAuthState} />;
                }
              }

              // 5. Jam Page Detail
              if (path.startsWith('/jams/')) {
                return <JamPage authState={authState} setAuthState={setAuthState} />;
              }

              // 5.5. Jury Evaluations Console
              if (path === '/jury/evaluations' || path.startsWith('/jury/evaluations?')) {
                return <JuryEvaluationsPage authState={authState} setAuthState={setAuthState} onNavigate={setCurrentPath} />;
              }

              // 6.0. Teams (FE-TEAM-001)
              if (path === '/teams' || path.startsWith('/teams?')) {
                return <TeamsCatalogPage />;
              }
              if (path === '/my-teams' || path.startsWith('/my-teams/')) {
                return <CreatorDashboardPage initialTab="teams" />;
              }

              // 6.5. Admin Panels
              if (path === '/admin/users' || path === '/admin-users' || path.startsWith('/admin/users/')) {
                return <AdminUsersPage />;
              }
              if (path === '/market-admin' || path.startsWith('/market-admin/')) {
                return <MarketAdminPage />;
              }
              if (path === '/game-editor' || path.startsWith('/game-editor/')) {
                const gameId = path.split('/')[2];
                return <GameEditorPage gameId={gameId} scope={urlScope} />;
              }
              if (path === '/creator-dashboard' || path.startsWith('/creator-dashboard/') || path === '/creator' || path.startsWith('/creator/')) {
                return <CreatorDashboardPage />;
              }
              if (path === '/devlog-editor' || path.startsWith('/devlog-editor/') || path.startsWith('/devlog-editor?')) {
                const queryId = path.includes('?') ? new URLSearchParams(path.substring(path.indexOf('?'))).get('id') : undefined;
                const devlogId = (path.split('/')[2] && !path.split('/')[2].includes('?')) ? path.split('/')[2] : (queryId || undefined);
                return <DevLogEditorPage devlogId={devlogId} scope={urlScope} onNavigate={setCurrentPath} />;
              }

              // 6. User Profile (Solo)
              if (path.startsWith('/users/') || path === '/profile') {
                return <ProfilePage initialProfileType="solo" authState={authState} setAuthState={setAuthState} />;
              }

              // 7. Team Profile (Team) (FE-TEAM-002)
              if (path.startsWith('/teams/') || path.startsWith('/team')) {
                return <ProfilePage initialProfileType="team" authState={authState} setAuthState={setAuthState} />;
              }

              // 7.5 Settings Page
              if (path.startsWith('/settings')) {
                return <SettingsPage />;
              }

              // 8. About Page
              if (path === '/about') {
                return <AboutPage onNavigate={setCurrentPath} />;
              }

              // 9. How to participate / Tutorial Page
              if (path === '/how-to-participate' || path === '/guide' || path === '/tutorial') {
                return <TutorialPage onNavigate={setCurrentPath} />;
              }

              // 10. Support Page
              if (path === '/support') {
                return <SupportPage onNavigate={setCurrentPath} />;
              }

              // 11. My Library Page
              if (path === '/library') {
                return <LibraryPage authState={authState} setAuthState={setAuthState} onNavigate={setCurrentPath} />;
              }

              // 11.1 Purchase History (FE-MKT-008, SC-MKT-069, AC-MKT-084)
              if (path === '/purchases' || path === '/me/purchases' || path === '/orders') {
                return <PurchaseHistoryPage authState={authState} setAuthState={setAuthState} onNavigate={setCurrentPath} />;
              }

              // 11.2 My Bugs (FE-BUG-003, BUG-API-002)
              if (path === '/me/bugs' || path === '/bugs' || path.startsWith('/bugs/')) {
                const bugId = path.startsWith('/bugs/') ? path.split('/')[2] : undefined;
                return <MyBugsPage onNavigate={setCurrentPath} authState={authState} setAuthState={setAuthState} initialBugId={bugId} />;
              }

              if (path === '/me/community/subscriptions') {
                return <CommunitySubscriptionsPage onNavigate={setCurrentPath} />;
              }

              if (path === '/devlogs') {
                return <DevLogsHubPage onNavigate={setCurrentPath} />;
              }
              
              if (path === '/devlogs/new' || path === '/devlog-editor') {
                const devlogId = searchParams.get('id') || undefined;
                return <DevLogEditorPage onNavigate={setCurrentPath} devlogId={devlogId} scope={urlScope} />;
              }

              if (path.startsWith('/devlogs/')) {
                const slug = path.split('/devlogs/')[1];
                return <DevLogPage slug={slug} onNavigate={setCurrentPath} />;
              }

              // 12. Community Page
              if (path === '/community/new') {
                return <CommunityNewThreadPage onNavigate={setCurrentPath} />;
              }

              if (path === '/me/community/subscriptions' || path === '/community/subscriptions') {
                return <CommunitySubscriptionsPage onNavigate={setCurrentPath} />;
              }

              if (path === '/community') {
                return <CommunityPage onNavigate={setCurrentPath} />;
              }

              // 13. Community Thread Page & Thread Edit (COM-API-008)
              if (path.startsWith('/community/thread/')) {
                const sub = path.split('/community/thread/')[1];
                if (sub.endsWith('/edit')) {
                  const editId = sub.replace('/edit', '');
                  return <CommunityNewThreadPage editThreadId={editId} onNavigate={setCurrentPath} />;
                }
                return <CommunityThreadPage threadId={sub} onNavigate={setCurrentPath} />;
              }

              // 14. Account Restriction Screen (FE-ACC-008: BR-ACC-053...055, FR-ACC-049...052, FR-ACC-058)
              if (path === '/account-restricted' || path === '/account/restricted') {
                return (
                  <AccountRestrictedPage 
                    onCancelDeletionSuccess={() => setCurrentPath('/settings')}
                    onLogout={() => setCurrentPath('/market')}
                  />
                );
              }

              // 11. Placeholder Section for unbuilt pages
              return (
                <div className="max-w-md mx-auto text-center py-20 md:py-28 space-y-5 animate-fadeIn font-sans">
                  <div className="space-y-2">
                    <span className="text-xs font-mono uppercase tracking-widest text-accent">
                      Раздел в разработке
                    </span>

                    <h1 className="text-3xl sm:text-4xl font-extrabold text-textPrimary tracking-tight">
                      {activeNavItem ? activeNavItem.label : 'Раздел'}
                    </h1>

                    <p className="text-sm text-textTertiary leading-relaxed">
                      {activeNavItem?.desc || 'Мы активно работаем над запуском этого раздела.'}
                    </p>
                  </div>

                  {/* Recovery navigation CTA */}
                  <div className="pt-2 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentPath('/market')}
                      className="h-9 px-4 bg-surface-2 hover:bg-surface-3 border border-borderDef text-textPrimary text-xs font-semibold rounded-control transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0"
                    >
                      В маркет
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentPath('/jams')}
                      className="h-9 px-4 bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-control transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0"
                    >
                      Смотреть джемы
                    </button>
                  </div>

                  {/* DEV MATRIX CONTROL PANEL FOR PLACEHOLDER PAGES */}
                  <DevMatrixPanel 
                    pageName={activeNavItem?.label || "Раздел платформы"}
                    fields={[
                      {
                        id: 'authState',
                        label: 'Роль',
                        type: 'select',
                        value: authState,
                        onChange: (val) => {
                          setAuthState(val);
                          showToastNotification(`Режим: ${val.toUpperCase()}`);
                        },
                        options: [
                          { value: 'guest', label: 'Гость (Guest)' },
                          { value: 'creator', label: 'Автор (Creator)' },
                          { value: 'admin', label: 'Модерация (Admin)' }
                        ]
                      },
                      {
                        id: 'currentPath',
                        label: 'Быстрый переход',
                        type: 'select',
                        value: currentPath,
                        onChange: setCurrentPath,
                        highlight: true,
                        options: [
                          ...NAV_LINKS.map(link => ({ value: link.path, label: `${link.label} (${link.path})` })),
                          ...ABOUT_DROPDOWN_ITEMS.map(item => ({ value: item.path, label: `${item.label} (${item.path})` })),
                          { value: '/my-teams', label: 'Мои команды (/my-teams)' },
                          { value: '/account-restricted', label: 'Экран блокировки (/account-restricted)' },
                          { value: '/admin/users', label: 'Пользователи и Права (/admin/users)' },
                          { value: '/market-admin', label: 'Market Admin Panel' }
                        ]
                      }
                    ]}
                  />
                </div>
              );
            })()}
          </React.Suspense>
        </main>
  );
});
