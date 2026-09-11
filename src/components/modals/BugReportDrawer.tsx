import React, { useState, useRef } from 'react';
import { 
  Bug, X, Lock, CheckCircle2, Paperclip, Upload, AlertTriangle, 
  Monitor, Globe, Apple, Terminal, Info, ShieldAlert, Trash2
} from 'lucide-react';
import Drawer from '../ui/Drawer';
import { BugReport, BugSeverity, BugAttachment } from '../../types/bugReport';
import { addBugReport } from '../../mocks/bugReports';

export interface BugReportDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  role: string; // 'guest' | 'player' | 'author' | 'judge' | 'admin'
  gameTitle: string;
  gameId?: string;
  isPaid?: boolean;
  hasEntitlement?: boolean;
  isBanned?: boolean;
  detectedVersion?: string;
  triggerToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  onBugCreated?: (newBug: BugReport) => void;
}

export const BugReportDrawer: React.FC<BugReportDrawerProps> = ({
  isOpen,
  onClose,
  role,
  gameTitle,
  gameId = 'g1',
  isPaid = false,
  hasEntitlement = true,
  isBanned = false,
  detectedVersion = 'v1.0.4',
  triggerToast,
  onBugCreated
}) => {
  // Form State (BR-BUG-012, BR-BUG-013, BR-BUG-014, BR-BUG-015)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState('');
  const [expectedBehavior, setExpectedBehavior] = useState('');
  const [actualBehavior, setActualBehavior] = useState('');
  const [severity, setSeverity] = useState<BugSeverity>('medium');
  const [platform, setPlatform] = useState<'windows' | 'mac_os' | 'linux' | 'webgl'>('webgl');
  const [buildVersion, setBuildVersion] = useState(detectedVersion);
  
  // Attachments State (BR-BUG-017, FE-BUG-009)
  const [attachments, setAttachments] = useState<BugAttachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validation & Submission State
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Handle Safe File Attachment Simulation (BR-BUG-017, SC-BUG-021, SC-BUG-022)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Check file size (max 5 MB)
    if (file.size > 5 * 1024 * 1024) {
      triggerToast('Файл слишком большой (максимум 5 МБ)', 'error');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Check file type
    const validExtensions = ['.png', '.jpg', '.jpeg', '.log', '.txt'];
    const hasValidExt = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    if (!hasValidExt) {
      triggerToast('Допустимы только скриншоты (PNG, JPG) и логи (LOG, TXT)', 'error');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const newAttachment: BugAttachment = {
      id: `att_${Date.now()}`,
      name: file.name,
      size: file.size,
      type: file.name.endsWith('.log') || file.name.endsWith('.txt') ? 'log' : 'image',
      url: '#'
    };

    setAttachments(prev => [...prev, newAttachment]);
    triggerToast(`Файл "${file.name}" прикреплен`, 'info');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (attId: string) => {
    setAttachments(prev => prev.filter(a => a.id !== attId));
  };

  // Submit Bug Report
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors: { [key: string]: boolean } = {};
    if (!title.trim()) errors.title = true;
    if (!description.trim()) errors.description = true;
    if (!expectedBehavior.trim()) errors.expectedBehavior = true;
    if (!actualBehavior.trim()) errors.actualBehavior = true;

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      triggerToast('Заполните обязательные поля отчета', 'error');
      return;
    }

    setIsSubmitting(true);
    setValidationErrors({});

    setTimeout(() => {
      const newBug: BugReport = {
        id: `bug-${Math.floor(100 + Math.random() * 900)}`,
        gameId,
        gameTitle,
        reporterId: 'user-88',
        reporterName: 'CyberPunk2077_Fan',
        buildVersion: buildVersion || detectedVersion,
        platform,
        title: title.trim(),
        description: description.trim(),
        steps: steps.trim() || undefined,
        expectedBehavior: expectedBehavior.trim(),
        actualBehavior: actualBehavior.trim(),
        reporterSeverity: severity,
        triageSeverity: null,
        status: 'new',
        attachments,
        comments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      addBugReport(newBug);
      if (onBugCreated) onBugCreated(newBug);

      setIsSubmitting(false);
      setIsSuccess(true);
      triggerToast('Баг-репорт успешно отправлен разработчику!', 'success');

      setTimeout(() => {
        onClose();
        setTimeout(() => {
          setIsSuccess(false);
          setTitle('');
          setDescription('');
          setSteps('');
          setExpectedBehavior('');
          setActualBehavior('');
          setSeverity('medium');
          setAttachments([]);
        }, 300);
      }, 2000);
    }, 800);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setValidationErrors({});
    }
  };

  // Check access eligibility (BR-BUG-004, BR-BUG-005, BR-BUG-006, BR-ACC-055)
  const isGuest = role === 'guest';
  const isPaidWithoutEntitlement = isPaid && !hasEntitlement;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Сообщить о баге"
      icon={<Bug className="w-5 h-5 text-danger" />}
      size="lg"
    >
      <div className="flex flex-col gap-6 -mx-6 -my-6 p-6 h-full overflow-y-auto">
        
        {/* Case 1: Restricted / Banned Account (BR-ACC-055, SC-BUG-029) */}
        {isBanned ? (
          <div className="p-6 bg-surface-2 border border-danger/30 rounded-xl text-center flex flex-col items-center gap-4">
            <ShieldAlert className="w-12 h-12 text-danger" />
            <div>
              <p className="text-base font-bold text-textPrimary mb-1">Действие заблокировано</p>
              <p className="text-xs text-textTertiary leading-relaxed max-w-md">
                Ваш аккаунт временно ограничен. Вы можете запускать уже купленные игры из библиотеки, 
                но отправка новых баг-репортов и сообщений недоступна.
              </p>
            </div>
          </div>
        ) : isGuest ? (
          /* Case 2: Guest user (BR-BUG-004, SC-BUG-001) */
          <div className="p-6 bg-surface-2 border border-borderDef rounded-xl text-center flex flex-col items-center gap-4">
            <Lock className="w-10 h-10 text-danger" />
            <div>
              <p className="text-sm font-semibold text-textPrimary mb-1">Требуется авторизация</p>
              <p className="text-xs text-textTertiary leading-relaxed max-w-sm">
                Только авторизованные игроки могут отправлять баг-репорты. Пожалуйста, войдите в свой профиль.
              </p>
            </div>
          </div>
        ) : isPaidWithoutEntitlement ? (
          /* Case 3: Paid Game Without Entitlement (BR-BUG-006, SC-BUG-002) */
          <div className="p-6 bg-surface-2 border border-warning/30 rounded-xl text-center flex flex-col items-center gap-4">
            <AlertTriangle className="w-10 h-10 text-warning" />
            <div>
              <p className="text-sm font-semibold text-textPrimary mb-1">Требуется доступ к игре (Entitlement)</p>
              <p className="text-xs text-textTertiary leading-relaxed max-w-sm">
                Для отправки баг-репорта по платной игре требуется подтвержденный доступ или покупка в маркете.
              </p>
            </div>
          </div>
        ) : isSuccess ? (
          /* Success Screen */
          <div className="p-8 bg-success/5 border border-success/20 rounded-xl text-center flex flex-col items-center gap-4 animate-fadeIn my-auto">
            <CheckCircle2 className="w-16 h-16 text-success" />
            <div>
              <h3 className="text-lg font-bold text-success mb-1">Отчёт зарегистрирован!</h3>
              <p className="text-xs text-textTertiary leading-relaxed max-w-sm">
                Баг передан авторам «{gameTitle}». Вы сможете отслеживать статус решения и ответы разработчика в разделе «Мои баги».
              </p>
            </div>
          </div>
        ) : (
          /* Main Bug Report Form (BR-BUG-012, BR-BUG-013, BR-BUG-014, BR-BUG-015, BR-BUG-017) */
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1">
            
            {/* Game Context Header */}
            <div className="bg-surface-2/60 border border-borderDef p-3.5 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Bug className="w-4 h-4 text-danger shrink-0" />
                <span className="text-textSecondary">Игра:</span>
                <span className="font-bold text-textPrimary">{gameTitle}</span>
              </div>
              <span className="text-textTertiary font-mono">Build: {buildVersion}</span>
            </div>

            {/* 1. Bug Title (Required per BR-BUG-012) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-textPrimary flex justify-between">
                <span>Краткое название проблемы (Заголовок) <span className="text-danger">*</span></span>
                {validationErrors.title && <span className="text-danger font-medium animate-pulse">Обязательное поле</span>}
              </label>
              <input 
                type="text"
                value={title}
                onChange={e => {
                  setTitle(e.target.value);
                  if (e.target.value.trim()) setValidationErrors(prev => ({ ...prev, title: false }));
                }}
                placeholder="Например: Вылет игры при переходе на 3 уровень"
                className={`bg-surface-2 border ${validationErrors.title ? 'border-danger' : 'border-borderDef focus:border-borderStrong'} text-textPrimary px-3.5 py-2.5 text-sm rounded-lg outline-none transition-colors placeholder:text-textTertiary`}
                maxLength={120}
              />
            </div>

            {/* 2. Platform Context & Severity (BR-BUG-013, BR-BUG-015) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-textPrimary">Платформа / Окружение</label>
                <select 
                  value={platform} 
                  onChange={e => setPlatform(e.target.value as any)}
                  className="bg-surface-2 border border-borderDef text-textSecondary px-3 py-2.5 text-sm rounded-lg outline-none cursor-pointer focus:border-borderStrong transition-colors"
                >
                  <option value="webgl">🌐 WebGL (Браузерная версия)</option>
                  <option value="windows">🪟 Windows Desktop</option>
                  <option value="mac_os">🍎 macOS</option>
                  <option value="linux">🐧 Linux</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-textPrimary">Критичность (Оценка игрока)</label>
                <select 
                  value={severity} 
                  onChange={e => setSeverity(e.target.value as BugSeverity)}
                  className="bg-surface-2 border border-borderDef text-textSecondary px-3 py-2.5 text-sm rounded-lg outline-none cursor-pointer focus:border-borderStrong transition-colors"
                >
                  <option value="low">🟢 Низкая (Косметическая опечатка/анимация)</option>
                  <option value="medium">🟡 Средняя (Мешает геймплею, но играбельно)</option>
                  <option value="high">🟠 Высокая (Блокирует прохождение миссии)</option>
                  <option value="critical">🔴 Критичная (Краш на рабочий стол / софтлок)</option>
                </select>
              </div>
            </div>

            {/* 3. Description (Required per BR-BUG-012) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-textPrimary flex justify-between">
                <span>Подробное описание проблемы <span className="text-danger">*</span></span>
                {validationErrors.description && <span className="text-danger font-medium animate-pulse">Обязательное поле</span>}
              </label>
              <textarea 
                value={description}
                onChange={e => {
                  setDescription(e.target.value);
                  if (e.target.value.trim()) setValidationErrors(prev => ({ ...prev, description: false }));
                }}
                placeholder="Опишите, что именно сломалось, где и при каких обстоятельствах..."
                className={`bg-surface-2 border ${validationErrors.description ? 'border-danger' : 'border-borderDef focus:border-borderStrong'} text-textPrimary p-3 rounded-lg h-24 resize-none outline-none transition-colors text-sm font-sans placeholder:text-textTertiary`}
                maxLength={2000}
              />
              <span className="text-[10px] text-textTertiary text-right mt-0.5">{description.length}/2000</span>
            </div>

            {/* 4. Steps to reproduce (Recommended per bug-report.md line 20) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-textPrimary">
                Шаги для воспроизведения (рекомендуется)
              </label>
              <textarea 
                value={steps}
                onChange={e => setSteps(e.target.value)}
                placeholder="1. Зайти в инвентарь&#10;2. Использовать зелье маны&#10;3. Нажать Esc во время анимации"
                className="bg-surface-2 border border-borderDef focus:border-borderStrong text-textPrimary p-3 rounded-lg h-20 resize-none outline-none transition-colors text-sm font-sans placeholder:text-textTertiary"
                maxLength={1000}
              />
            </div>

            {/* 5. Expected vs Actual behavior (Required per BR-BUG-014) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-textPrimary flex justify-between">
                  <span>Ожидаемый результат <span className="text-danger">*</span></span>
                  {validationErrors.expectedBehavior && <span className="text-danger font-medium animate-pulse">Обязательно</span>}
                </label>
                <input 
                  type="text"
                  value={expectedBehavior}
                  onChange={e => {
                    setExpectedBehavior(e.target.value);
                    if (e.target.value.trim()) setValidationErrors(prev => ({ ...prev, expectedBehavior: false }));
                  }}
                  placeholder="Должно открыться окно паузы"
                  className={`bg-surface-2 border ${validationErrors.expectedBehavior ? 'border-danger' : 'border-borderDef focus:border-borderStrong'} text-textPrimary px-3 py-2 text-sm rounded-lg outline-none transition-colors placeholder:text-textTertiary`}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-textPrimary flex justify-between">
                  <span>Фактический результат <span className="text-danger">*</span></span>
                  {validationErrors.actualBehavior && <span className="text-danger font-medium animate-pulse">Обязательно</span>}
                </label>
                <input 
                  type="text"
                  value={actualBehavior}
                  onChange={e => {
                    setActualBehavior(e.target.value);
                    if (e.target.value.trim()) setValidationErrors(prev => ({ ...prev, actualBehavior: false }));
                  }}
                  placeholder="Игра зависает намертво"
                  className={`bg-surface-2 border ${validationErrors.actualBehavior ? 'border-danger' : 'border-borderDef focus:border-borderStrong'} text-textPrimary px-3 py-2 text-sm rounded-lg outline-none transition-colors placeholder:text-textTertiary`}
                />
              </div>
            </div>

            {/* 6. Safe Attachments (BR-BUG-017, FE-BUG-009) */}
            <div className="flex flex-col gap-2 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-textPrimary flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5 text-textSecondary" />
                  Вложения (Скриншоты, лог-файлы)
                </label>
                <span className="text-[10px] text-textTertiary">До 5 МБ (PNG, JPG, LOG, TXT)</span>
              </div>

              {/* Upload trigger button */}
              <input 
                ref={fileInputRef} 
                type="file" 
                accept=".png,.jpg,.jpeg,.log,.txt" 
                onChange={handleFileUpload} 
                className="hidden" 
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="border border-dashed border-borderDef hover:border-borderStrong hover:bg-surface-2/40 p-3 rounded-lg text-xs text-textSecondary flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4 text-textTertiary" />
                <span>Прикрепить файл логов или скриншот</span>
              </button>

              {/* Attached Files List */}
              {attachments.length > 0 && (
                <div className="flex flex-col gap-1.5 mt-1">
                  {attachments.map(att => (
                    <div key={att.id} className="flex items-center justify-between p-2 bg-surface-2 border border-borderDef rounded-lg text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <Paperclip className="w-3.5 h-3.5 text-textSecondary shrink-0" />
                        <span className="text-textPrimary truncate">{att.name}</span>
                        <span className="text-textTertiary text-[10px]">({(att.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(att.id)}
                        className="p-1 hover:text-danger text-textTertiary transition-colors ml-2"
                        title="Удалить файл"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-4 pt-4 border-t border-borderDef">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-danger hover:bg-danger-hover disabled:bg-surface-2 disabled:text-textTertiary disabled:border disabled:border-borderDef text-white font-bold text-sm py-3 rounded-xl tracking-wide transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-danger/10"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-textTertiary border-t-white animate-spin"></div>
                    <span>Регистрация бага...</span>
                  </>
                ) : (
                  <>
                    <Bug className="w-4 h-4" />
                    <span>Отправить баг-репорт</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </Drawer>
  );
};

export default BugReportDrawer;
