import React, { useState, useRef } from 'react';
import Button from '../ui/Button';
import { Flag, Shield, Upload, X, AlertTriangle, Info } from 'lucide-react';
import { Drawer } from '../ui/Drawer';

export interface AbuseReportDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  gameId: string;
  gameTitle: string;
  gameAuthor: string;
  gameCoverUrl?: string;
  onSuccessfulSubmit?: () => void; // Callback after successful submission
}

interface ValidationErrors {
  reason?: string;
  report_text?: string;
  evidence_files?: string;
}

// Constants according to specification
const MAX_FILES = 1; // Only 1 file allowed as per spec
const MAX_FILE_SIZE_MB = 5;
const MIN_TEXT_LENGTH = 10;
const MAX_TEXT_LENGTH = 500;

const ABUSE_REASONS = [
  { value: 'malware', label: 'Вредоносный файл / Вирус / Угроза безопасности' },
  { value: 'copyright', label: 'Нарушение авторских прав (DMCA / Заимствование ассетов)' },
  { value: 'inappropriate', label: 'Неприемлемый / Запрещенный контент' },
  { value: 'spam_scam', label: 'Спам / Мошенничество / Завышенная стоимость' },
  { value: 'broken_build', label: 'Критическая ошибка / Игра не запускается' },
  { value: 'other', label: 'Другая причина' }
];

const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_FORMATS = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'text/plain', 'text/log', 'application/x-log'];

export const AbuseReportDrawer: React.FC<AbuseReportDrawerProps> = ({
  isOpen,
  onClose,
  gameId,
  gameTitle,
  gameAuthor,
  gameCoverUrl,
  onSuccessfulSubmit
}) => {
  const [reason, setReason] = useState('');
  const [reportText, setReportText] = useState('');
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showAlreadyReportedMessage, setShowAlreadyReportedMessage] = useState(false);
  const [showRateLimitMessage, setShowRateLimitMessage] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleReset = () => {
    setReason('');
    setReportText('');
    setEvidenceFiles([]);
    setErrors({});
    setIsSubmitting(false);
    setShowAlreadyReportedMessage(false);
    setShowRateLimitMessage(false);
    setApiError(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!reason) {
      newErrors.reason = 'Выберите причину нарушения';
    }

    if (reportText.length < MIN_TEXT_LENGTH) {
      newErrors.report_text = `Опишите причину подробнее (минимум ${MIN_TEXT_LENGTH} символов)`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return `Файл "${file.name}" превышает допустимый размер ${MAX_FILE_SIZE_MB} МБ`;
    }

    // Check file format
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const isValidType = ALLOWED_FORMATS.includes(file.type) || 
                       ['png', 'jpg', 'jpeg', 'webp', 'txt', 'log'].includes(fileExtension || '');
    
    if (!isValidType) {
      return 'Прикрепить можно только изображения (PNG, JPG, WebP) или текстовые логи (TXT, LOG)';
    }

    return null;
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files);
    const validationError = newFiles.map(validateFile).find(err => err !== null);

    if (validationError) {
      setErrors({ ...errors, evidence_files: validationError });
      return;
    }

    if (evidenceFiles.length + newFiles.length > MAX_FILES) {
      setErrors({ ...errors, evidence_files: `Можно прикрепить максимум ${MAX_FILES} файла` });
      return;
    }

    setEvidenceFiles([...evidenceFiles, ...newFiles]);
    setErrors({ ...errors, evidence_files: undefined });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleRemoveFile = (index: number) => {
    setEvidenceFiles(evidenceFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setApiError(null);

    try {
      // Simulate API call for now
      setTimeout(() => {
        setIsSubmitting(false);
        if (onSuccessfulSubmit) {
          onSuccessfulSubmit();
        }
        handleClose();
      }, 1000);
    } catch (error) {
      console.error('Failed to submit report:', error);
      setApiError('Произошла непредвиденная ошибка. Попробуйте снова.');
      setIsSubmitting(false);
    }
  };

  const textLength = reportText.length;
  const textLengthColor = textLength < MIN_TEXT_LENGTH 
    ? 'text-warning' 
    : textLength > MAX_TEXT_LENGTH 
    ? 'text-danger' 
    : 'text-textTertiary';

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Сообщить о нарушении"
      icon={<Flag className="w-5 h-5 text-danger" />}
      size="md"
      footer={
        !showAlreadyReportedMessage && !showRateLimitMessage && (
          <div className="flex items-center justify-end gap-3 pt-2 w-full">
            <Button
              variant="ghost"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Отмена
            </Button>
            <Button
              variant="danger"
              onClick={handleSubmit}
              disabled={isSubmitting || !reason || reportText.length < MIN_TEXT_LENGTH}
              icon={<Flag className="w-4 h-4" />}
            >
              {isSubmitting ? 'Отправка...' : 'Отправить жалобу'}
            </Button>
          </div>
        )
      }
    >
      <div className="flex flex-col gap-6 -mx-6 -my-6 p-6">
        {/* Already Reported Message */}
        {showAlreadyReportedMessage ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-info/10 border border-info/30 rounded-xl">
              <Info className="w-5 h-5 text-info shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-textPrimary mb-1">
                  Жалоба уже отправлена
                </h4>
                <p className="text-xs text-textSecondary leading-relaxed">
                  Вы уже отправили жалобу на этот проект. Она находится на рассмотрении модерации. 
                  Мы сообщим вам о результате проверки.
                </p>
              </div>
            </div>
            <div className="flex justify-end pt-2 border-t border-borderDef mt-4">
              <Button variant="secondary" onClick={handleClose}>
                Закрыть
              </Button>
            </div>
          </div>
        ) : showRateLimitMessage ? (
          /* Rate Limit Message */
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-warning/10 border border-warning/30 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-textPrimary mb-1">
                  Слишком много жалоб
                </h4>
                <p className="text-xs text-textSecondary leading-relaxed">
                  Вы превысили лимит на отправку жалоб. Пожалуйста, подождите несколько минут перед отправкой следующей.
                </p>
              </div>
            </div>
            <div className="flex justify-end pt-2 border-t border-borderDef mt-4">
              <Button variant="secondary" onClick={handleClose}>
                Понятно
              </Button>
            </div>
          </div>
        ) : (
          /* Normal Form */
          <div className="space-y-5">
            {/* Game Context Card */}
            <div className="flex items-center gap-3 p-3 bg-surface-2 border border-borderDef rounded-xl">
              {gameCoverUrl && (
                <img 
                  src={gameCoverUrl} 
                  alt={gameTitle}
                  className="w-12 h-12 rounded-lg object-cover shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-textPrimary truncate">{gameTitle}</div>
                <div className="text-caption text-textTertiary">Автор: {gameAuthor}</div>
              </div>
            </div>

            {/* Reason Radio Group */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-textPrimary">
                <span className="font-mono text-xs text-accent font-bold uppercase tracking-wider">1.</span> Укажите причину жалобы <span className="text-danger">*</span>
              </label>
              <div className="space-y-2">
                {ABUSE_REASONS.map(option => (
                  <label 
                    key={option.value}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      reason === option.value 
                        ? 'bg-accent/5 border-accent' 
                        : 'bg-surface-2 border-borderDef hover:border-accent/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={option.value}
                      checked={reason === option.value}
                      onChange={(e) => {
                        setReason(e.target.value);
                        setErrors({ ...errors, reason: undefined });
                      }}
                      className="mt-0.5 w-4 h-4 text-accent border-borderDef cursor-pointer"
                    />
                    <span className="text-sm text-textPrimary font-medium flex-1">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
              {errors.reason && (
                <div className="flex items-center gap-1.5 text-xs text-danger">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {errors.reason}
                </div>
              )}
            </div>

            {/* Report Text */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-textPrimary">
                <span className="font-mono text-xs text-accent font-bold uppercase tracking-wider">2.</span> Подробное описание ситуации <span className="text-danger">*</span>
              </label>
              <textarea
                value={reportText}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_TEXT_LENGTH) {
                    setReportText(e.target.value);
                    setErrors({ ...errors, report_text: undefined });
                  }
                }}
                placeholder="Опишите проблему подробно, укажите таймкоды или ссылки..."
                rows={5}
                className={`w-full px-3.5 py-2.5 bg-surface-2 border rounded-xl text-sm text-textPrimary placeholder:text-textTertiary resize-none focus:outline-none transition-all ${
                  errors.report_text ? 'border-danger' : 'border-borderDef hover:border-accent/50'
                }`}
              />
              <div className="flex items-center justify-between">
                {errors.report_text ? (
                  <div className="flex items-center gap-1.5 text-xs text-danger">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {errors.report_text}
                  </div>
                ) : (
                  <div className="text-xs text-textTertiary">
                    Минимум {MIN_TEXT_LENGTH} символов
                  </div>
                )}
                <div className={`text-xs font-mono ${textLengthColor}`}>
                  {textLength} / {MAX_TEXT_LENGTH}
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-textPrimary">
                <span className="font-mono text-xs text-accent font-bold uppercase tracking-wider">3.</span> Доказательства / Скриншоты <span className="text-textTertiary">(Опционально)</span>
              </label>
              
              {evidenceFiles.length === 0 ? (
                /* Dropzone */
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                    isDragging 
                      ? 'border-accent bg-accent/5' 
                      : 'border-borderDef hover:border-accent/50 hover:bg-surface-2/50'
                  }`}
                >
                  <Upload className="w-8 h-8 text-textTertiary mx-auto mb-2" />
                  <div className="text-sm text-textSecondary mb-1">
                    Прикрепить файл (до {MAX_FILE_SIZE_MB} МБ)
                  </div>
                  <div className="text-xs text-textTertiary">
                    PNG, JPG, WebP или текстовые логи TXT, LOG
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".png,.jpg,.jpeg,.webp,.txt,.log"
                    onChange={(e) => handleFileSelect(e.target.files)}
                    className="hidden"
                  />
                </div>
              ) : (
                /* File Preview */
                <div className="flex items-center gap-3 p-3 bg-surface-2 border border-borderDef rounded-xl">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-textPrimary font-medium truncate">{evidenceFiles[0].name}</div>
                    <div className="text-xs font-mono text-textTertiary">
                      {(evidenceFiles[0].size / 1024).toFixed(1)} КБ
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(0);
                    }}
                    className="p-1.5 hover:bg-surface-3 rounded-lg text-textTertiary hover:text-danger transition-colors shrink-0"
                    aria-label="Удалить файл"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {errors.evidence_files && (
                <div className="flex items-center gap-1.5 text-xs text-danger">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {errors.evidence_files}
                </div>
              )}
            </div>

            {/* Disclaimer */}
            <div className="flex items-start gap-2.5 p-3 bg-danger/5 border border-danger/20 rounded-xl">
              <Shield className="w-4 h-4 text-danger shrink-0 mt-0.5" />
              <div className="text-xs text-textSecondary leading-relaxed">
                Заведомо ложные жалобы и злоупотребление функцией репорта могут привести к ограничению доступа к вашему аккаунту.
              </div>
            </div>

            {/* API Error Message */}
            {apiError && (
              <div className="flex items-start gap-2.5 p-3 bg-danger/10 border border-danger/30 rounded-xl">
                <AlertTriangle className="w-4 h-4 text-danger shrink-0 mt-0.5" />
                <div className="text-xs text-textSecondary leading-relaxed">
                  {apiError}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default AbuseReportDrawer;
