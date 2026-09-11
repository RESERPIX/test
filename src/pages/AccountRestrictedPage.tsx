import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertOctagon, 
  Clock, 
  RotateCcw,
  LogOut, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  HelpCircle, 
  Info,
  Mail,
  Send,
  AlertTriangle
} from 'lucide-react';
import Button from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import DevMatrixPanel, { DevMatrixField } from '../components/DevMatrixPanel';

export type AccountRestrictionType = 'suspended' | 'banned' | 'recovery_only';

export interface AccountRestrictedPageProps {
  initialType?: AccountRestrictionType;
  reason?: string;
  violationCode?: string;
  issuedAt?: string;
  expiresAt?: string;
  caseId?: string;
  onLogout?: () => void;
  onCancelDeletionSuccess?: () => void;
}

export const AccountRestrictedPage: React.FC<AccountRestrictedPageProps> = ({
  initialType,
  reason = 'Нарушение правил сообщества (Раздел 4.2: Недопустимый контент и спам)',
  violationCode = 'RULE-COMMUNITY-4.2',
  issuedAt = '05 сентября 2026, 14:30',
  expiresAt = '19 сентября 2026 (через 11 дней)',
  caseId = 'BAN-89412',
  onLogout = () => { if ((window as any).__hubigrNavigate) (window as any).__hubigrNavigate('/market'); },
  onCancelDeletionSuccess
}) => {
  const { showToast } = useToast();
  const [currentType, setCurrentType] = useState<AccountRestrictionType>(() => {
    if (initialType) return initialType;
    const stored = typeof window !== 'undefined' ? sessionStorage.getItem('hubigr_account_restricted_type') : null;
    return (stored as AccountRestrictionType) || 'suspended';
  });
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');
  const [isSupportSent, setIsSupportSent] = useState(false);
  const [isCancellingDeletion, setIsCancellingDeletion] = useState(false);

  // BR-ACC-060, BR-ACC-061, ACC-API-053: Отмена удаления в recovery-period
  const handleCancelDeletion = () => {
    setIsCancellingDeletion(true);
    setTimeout(() => {
      setIsCancellingDeletion(false);
      try {
        sessionStorage.removeItem('hubigr_account_restricted_type');
      } catch (e) {}
      showToast('Удаление аккаунта успешно отменено! Доступ полностью восстановлен.', 'success');
      if (onCancelDeletionSuccess) {
        onCancelDeletionSuccess();
      } else if ((window as any).__hubigrNavigate) {
        (window as any).__hubigrNavigate('/settings');
      }
    }, 600);
  };

  const handleSendSupport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;
    setIsSupportSent(true);
    showToast('Обращение в службу поддержки отправлено. Ответ поступит на ваш email.', 'success');
  };

  return (
    <div className="min-h-screen bg-surface-0 text-textPrimary font-sans flex flex-col items-center justify-center p-4 md:p-8 relative select-none">
      
      {/* Фоновый радиальный градиент */}
      <div className={`absolute inset-0 pointer-events-none transition-colors duration-slow ${
        currentType === 'recovery_only' 
          ? 'bg-radial-gradient from-warning/5 via-transparent to-transparent' 
          : currentType === 'suspended'
            ? 'bg-radial-gradient from-warning/10 via-transparent to-transparent'
            : 'bg-radial-gradient from-danger/10 via-transparent to-transparent'
      }`} />

      <div className="max-w-2xl w-full bg-surface-1 border border-borderDef rounded-card p-6 md:p-8 space-y-6 shadow-elevation-overlay relative z-10 animate-fadeIn">
        
        {/* ========================================================================= */}
        {/* РЕЖИМ 1 И 2: SUSPENDED И BANNED (BR-ACC-053...055, FR-ACC-049...052)     */}
        {/* ========================================================================= */}
        {currentType !== 'recovery_only' && (
          <>
            {/* Заголовок и статус-бейдж */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-borderDef pb-6">
              <div className="flex items-center gap-3.5">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  currentType === 'suspended' 
                    ? 'bg-warning/15 text-warning border border-warning/30' 
                    : 'bg-danger/15 text-danger border border-danger/30'
                }`}>
                  {currentType === 'suspended' ? <AlertOctagon className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-textPrimary">
                    {currentType === 'suspended' 
                      ? 'Действие аккаунта временно приостановлено' 
                      : 'Учетная запись заблокирована'}
                  </h1>
                  <p className="text-xs font-mono text-textTertiary mt-0.5">
                    Дело: <span className="text-textSecondary font-semibold">#{caseId}</span>
                  </p>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider shrink-0 ${
                currentType === 'suspended' 
                  ? 'bg-warning/10 text-warning border border-warning/30' 
                  : 'bg-danger/10 text-danger border border-danger/30'
              }`}>
                {currentType === 'suspended' ? 'Приостановка' : 'Блокировка'}
              </span>
            </div>

            {/* Детали нарушения */}
            <div className="bg-surface-2 p-4 rounded-control border border-borderDef space-y-3 text-xs">
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold uppercase text-textTertiary font-mono text-[10px]">Причина взыскания</span>
                <span className="font-mono text-[10px] text-textTertiary">{violationCode}</span>
              </div>

              <p className="text-sm font-medium text-textPrimary leading-relaxed">
                {currentType === 'suspended' 
                  ? reason 
                  : 'Систематическое или грубое нарушение условий использования платформы и правил безопасности.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-borderDef/60 font-mono text-[11px]">
                <div>
                  <span className="text-textTertiary">Дата вынесения: </span>
                  <span className="text-textSecondary font-semibold">{issuedAt}</span>
                </div>
                <div>
                  <span className="text-textTertiary">Срок действия: </span>
                  <span className={`font-semibold ${currentType === 'suspended' ? 'text-warning' : 'text-danger'}`}>
                    {currentType === 'suspended' ? expiresAt : 'Бессрочно'}
                  </span>
                </div>
              </div>
            </div>

            {/* Статус прав и сохранение Entitlements (BR-ACC-054, BR-ACC-055) */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-textSecondary flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-accent" /> Правовой статус и сохранность покупок
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Заблокировано (BR-ACC-054: включая библиотеку!) */}
                <div className="p-3.5 bg-danger/5 border border-danger/20 rounded-control space-y-2">
                  <div className="flex items-center gap-1.5 text-danger font-bold">
                    <XCircle className="w-4 h-4" /> Доступ заблокирован
                  </div>
                  <ul className="space-y-1 text-textSecondary text-[11px] list-disc list-inside leading-relaxed">
                    <li>Использование платформы Hubigr</li>
                    <li>Доступ к Библиотеке игр и запуск</li>
                    <li>Покупка новых продуктов</li>
                    <li>Публикация контента и комментариев</li>
                  </ul>
                </div>

                {/* Сохранность прав (BR-ACC-055: Entitlements сохранены в базе) */}
                <div className="p-3.5 bg-success/5 border border-success/20 rounded-control space-y-2">
                  <div className="flex items-center gap-1.5 text-success font-bold">
                    <CheckCircle2 className="w-4 h-4" /> Сохранность цифровых прав
                  </div>
                  <ul className="space-y-1 text-textSecondary text-[11px] list-disc list-inside leading-relaxed">
                    <li>Лицензии не аннулируются в базе</li>
                    <li>Купленные игры закреплены за вами</li>
                    <li>Авторство проектов сохраняется</li>
                    <li>Полный возврат прав при снятии бана</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Информационная сноска BR-ACC-054 / BR-ACC-055 */}
            <div className="p-3.5 bg-surface-0 border border-borderDef rounded-control text-xs text-textSecondary flex items-start gap-2.5">
              <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                На период действия ограничения использование платформы и запуск игр из библиотеки приостановлены. Приобретенные цифровые права сохраняются в реестре платформы и будут автоматически активированы после истечения срока или отмены взыскания администратором.
              </p>
            </div>

            {/* Кнопки действий */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-borderDef">
              <Button
                variant="secondary"
                onClick={() => { setIsSupportSent(false); setIsSupportModalOpen(true); }}
                className="w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Служба поддержки</span>
              </Button>

              <Button
                variant="ghost"
                onClick={onLogout}
                className="w-full sm:w-auto text-textTertiary hover:text-textPrimary flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>Выйти из аккаунта</span>
              </Button>
            </div>
          </>
        )}

        {/* ========================================================================= */}
        {/* РЕЖИМ 3: RECOVERY-ONLY SCREEN (BR-ACC-060, BR-ACC-061, FR-ACC-058)       */}
        {/* ========================================================================= */}
        {currentType === 'recovery_only' && (
          <>
            {/* Заголовок и статус-бейдж */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-borderDef pb-6">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-warning/15 text-warning border border-warning/30 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-textPrimary">
                    Аккаунт находится в процессе удаления
                  </h1>
                  <p className="text-xs font-mono text-textTertiary mt-0.5">
                    Режим сессии: <span className="text-warning font-semibold">Только восстановление (Recovery-only)</span>
                  </p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-warning/10 text-warning border border-warning/30 shrink-0">
                Ожидает удаления
              </span>
            </div>

            {/* Детали срока восстановления (BR-ACC-060: 30 дней) */}
            <div className="bg-surface-2 p-4 rounded-control border border-borderDef space-y-3 text-xs">
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold uppercase text-textTertiary font-mono text-[10px]">Статус процедуры</span>
                <span className="font-mono text-[10px] text-warning font-bold">Осталось 23 дня до финализации</span>
              </div>

              <p className="text-sm font-medium text-textPrimary leading-relaxed">
                Вы запросили удаление учетной записи. В течение 30-дневного периода ожидания вы можете в любой момент отменить эту процедуру и полностью восстановить доступ к своему профилю и покупкам.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-borderDef/60 font-mono text-[11px]">
                <div>
                  <span className="text-textTertiary">Дата запроса: </span>
                  <span className="text-textSecondary font-semibold">01 сентября 2026, 11:20</span>
                </div>
                <div>
                  <span className="text-textTertiary">Окончательное удаление: </span>
                  <span className="text-danger font-semibold">01 октября 2026, 11:20</span>
                </div>
              </div>
            </div>

            {/* Ограничения сессии (BR-ACC-061) и последствия (BR-ACC-062) */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-textSecondary flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-warning" /> Условия периода ожидания
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Ограничение сессии */}
                <div className="p-3.5 bg-surface-2 border border-borderDef rounded-control space-y-2">
                  <div className="flex items-center gap-1.5 text-textPrimary font-bold">
                    <Clock className="w-4 h-4 text-accent" /> Ограниченный доступ
                  </div>
                  <p className="text-textSecondary text-[11px] leading-relaxed">
                    Использование каталога, библиотеки и публикаций заблокировано. Сессия открыта только для просмотра статуса и отмены удаления.
                  </p>
                </div>

                {/* Необратимость после срока */}
                <div className="p-3.5 bg-danger/5 border border-danger/20 rounded-control space-y-2">
                  <div className="flex items-center gap-1.5 text-danger font-bold">
                    <XCircle className="w-4 h-4" /> По окончании 30 дней
                  </div>
                  <p className="text-textSecondary text-[11px] leading-relaxed">
                    Все цифровые права на игры, баланс, комментарии и личные данные будут безвозвратно уничтожены без возможности восстановления.
                  </p>
                </div>
              </div>
            </div>

            {/* Кнопки действий для Recovery-only (ACC-API-053) */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-borderDef">
              <Button
                variant="primary"
                onClick={handleCancelDeletion}
                disabled={isCancellingDeletion}
                className="w-full sm:w-auto flex items-center justify-center gap-2 font-bold"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{isCancellingDeletion ? 'Восстановление...' : 'Отменить удаление аккаунта'}</span>
              </Button>

              <Button
                variant="ghost"
                onClick={onLogout}
                className="w-full sm:w-auto text-textTertiary hover:text-textPrimary flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>Выйти из аккаунта</span>
              </Button>
            </div>
          </>
        )}

      </div>

      {/* МОДАЛЬНОЕ ОКНО ОБРАЩЕНИЯ В СЛУЖБУ ПОДДЕРЖКИ */}
      <Modal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        title="Служба поддержки пользователей"
        subtitle={`Обращение по делу #${caseId}`}
        icon={<Mail className="w-5 h-5 text-accent" />}
        maxWidth="md"
      >
        <div className="space-y-4">
          {!isSupportSent ? (
            <form onSubmit={handleSendSupport} className="space-y-4">
              <div className="p-3 bg-surface-2 rounded-control border border-borderDef text-xs space-y-1">
                <span className="font-bold text-textPrimary block">Отдел модерации и безопасности Hubigr</span>
                <p className="text-textSecondary">
                  Если вы считаете, что взыскание было наложено по ошибке, подробно опишите обстоятельства.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-caption font-bold text-textSecondary uppercase tracking-wider block">
                  Ваше сообщение
                </label>
                <textarea
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  placeholder="Опишите вопрос или аргументы для пересмотра решения..."
                  rows={4}
                  required
                  className="w-full bg-surface-2 border border-borderDef focus:border-accent text-textPrimary text-xs p-3 rounded-control outline-none resize-none placeholder-textTertiary"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-borderDef">
                <Button variant="secondary" type="button" onClick={() => setIsSupportModalOpen(false)}>
                  Отмена
                </Button>
                <Button variant="primary" type="submit">
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  <span>Отправить обращение</span>
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 text-center py-3 animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-success/15 text-success border border-success/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-base text-textPrimary">Обращение отправлено</h4>
                <p className="text-xs text-textSecondary max-w-sm mx-auto">
                  Специалисты службы поддержки рассмотрят ваше сообщение в рабочем порядке. Ответ будет направлен на подтверждённый email аккаунта.
                </p>
              </div>
              <div className="pt-3 border-t border-borderDef flex justify-end">
                <Button variant="secondary" onClick={() => setIsSupportModalOpen(false)}>
                  Закрыть
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* DEV MATRIX PANEL (Зафиксированная панель для QA без искажения UI) */}
      <DevMatrixPanel
        pageName="Ограничение аккаунта"
        fields={[
          {
            id: 'currentType',
            label: 'Режим ограничения',
            type: 'select',
            value: currentType,
            onChange: (val) => setCurrentType(val as AccountRestrictionType),
            options: [
              { value: 'suspended', label: 'Приостановка (Suspended)' },
              { value: 'banned', label: 'Полный бан (Banned)' },
              { value: 'recovery_only', label: 'Удаление (Recovery-only)' }
            ]
          }
        ]}
      />

    </div>
  );
};

export default AccountRestrictedPage;
