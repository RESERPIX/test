import React, { useState, useRef } from 'react';
import Button from '../ui/Button';
import { Flag, Upload, X, AlertTriangle } from 'lucide-react';
import Drawer from '../ui/Drawer';

export interface JamAbuseReportDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  jamTitle: string;
  jamOrganizer: string;
  triggerToast?: (message: string, type?: any) => void;
}

interface ValidationErrors {
  reason?: string;
  description?: string;
  attachment?: string;
}

const JAM_ABUSE_REASONS = [
  { value: 'fake_prizes', label: 'Обман с призовым фондом / Невыплата призов' },
  { value: 'rules_violation', label: 'Нарушение правил судейства / Накрутка оценок / Сговор' },
  { value: 'inappropriate_content', label: 'Запрещенный контент в описании или теме (Ненависть / Оскорбления)' },
  { value: 'copyright', label: 'Нарушение авторских прав (DMCA / Плагиат концепта джема)' },
  { value: 'spam_scam', label: 'Спам / Фишинг / Мошенничество' },
  { value: 'other', label: 'Другое' }
];

const MIN_TEXT_LENGTH = 10;
const MAX_TEXT_LENGTH = 500;
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const JamAbuseReportDrawer: React.FC<JamAbuseReportDrawerProps> = ({
  isOpen,
  onClose,
  jamTitle,
  jamOrganizer,
  triggerToast
}) => {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleReset = () => {
    setReason('');
    setDescription('');
    setAttachmentFile(null);
    setErrors({});
    setIsSubmitting(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!reason) {
      newErrors.reason = 'Выберите причину жалобы';
    }

    if (description.length < MIN_TEXT_LENGTH) {
      newErrors.description = `Описание должно содержать минимум ${MIN_TEXT_LENGTH} символов`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return `Файл "${file.name}" превышает допустимый размер ${MAX_FILE_SIZE_MB} МБ`;
    }

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const isValidType = ['png', 'jpg', 'jpeg', 'webp', 'pdf', 'txt'].includes(fileExtension || '');
    
    if (!isValidType) {
      return 'Прикрепить можно только изображения (PNG, JPG, WebP), PDF или текстовые файлы (TXT)';
    }

    return null;
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const validationError = validateFile(file);

    if (validationError) {
      setErrors({ ...errors, attachment: validationError });
      return;
    }

    setAttachmentFile(file);
    setErrors({ ...errors, attachment: undefined });
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

  const handleRemoveFile = () => {
    setAttachmentFile(null);
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Имитация отправки
    setTimeout(() => {
      setIsSubmitting(false);
      handleReset();
      onClose();
      if (triggerToast) {
        triggerToast('Жалоба на геймджем успешно отправлена. Команда модерации рассмотрит ее в ближайшее время.', 'success');
      }
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Жалоба на геймджем"
      icon={<Flag className="w-5 h-5" />}
      size="lg"
      footer={
        <div className="flex items-center gap-3 w-full">
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1"
          >
            Отмена
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting || !reason || description.length < MIN_TEXT_LENGTH}
            className="flex-1"
          >
            {isSubmitting ? 'Отправка...' : 'Отправить жалобу'}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Jam Info */}
        <div className="bg-surface-2 border border-borderDef rounded-lg p-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-mono text-textTertiary uppercase tracking-wider">Джем</span>
            <h4 className="text-sm font-bold text-textPrimary">{jamTitle}</h4>
            <span className="text-xs text-textSecondary">Организатор: {jamOrganizer}</span>
          </div>
        </div>

        {/* Step 1: Reason */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-textPrimary">
            <span className="font-mono text-xs text-accent font-bold uppercase tracking-wider">1.</span> Укажите причину жалобы <span className="text-danger">*</span>
          </label>
          <div className="space-y-2">
            {JAM_ABUSE_REASONS.map((r) => (
              <label 
                key={r.value}
                className="flex items-start gap-3 p-3 bg-surface-2 border border-borderDef rounded-lg cursor-pointer hover:border-borderStrong transition-colors"
              >
                <input
                  type="radio"
                  name="reason"
                  value={r.value}
                  checked={reason === r.value}
                  onChange={(e) => {
                    setReason(e.target.value);
                    setErrors({ ...errors, reason: undefined });
                  }}
                  className="mt-0.5 cursor-pointer accent-accent"
                />
                <span className="text-sm text-textSecondary leading-relaxed">{r.label}</span>
              </label>
            ))}
          </div>
          {errors.reason && (
            <p className="text-xs text-danger flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              {errors.reason}
            </p>
          )}
        </div>

        {/* Step 2: Description */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-textPrimary">
            <span className="font-mono text-xs text-accent font-bold uppercase tracking-wider">2.</span> Подробное описание нарушения <span className="text-danger">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (e.target.value.length >= MIN_TEXT_LENGTH) {
                setErrors({ ...errors, description: undefined });
              }
            }}
            maxLength={MAX_TEXT_LENGTH}
            placeholder="Укажите конкретные детали: какие пункты правил джема были нарушены, приведите ссылки на спорные сабмиты, скриншоты переписок или посты в сообществе..."
            className={`w-full bg-surface-2 border ${errors.description ? 'border-danger' : 'border-borderDef'} text-textPrimary p-3 rounded-lg h-32 resize-none outline-none focus:border-accent transition-colors text-sm placeholder:text-textTertiary`}
            disabled={isSubmitting}
          />
          <div className="flex items-center justify-between">
            {errors.description && (
              <p className="text-xs text-danger flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                {errors.description}
              </p>
            )}
            <span className={`text-xs font-mono ${description.length < MIN_TEXT_LENGTH ? 'text-danger' : 'text-textTertiary'} ml-auto`}>
              {description.length} / {MAX_TEXT_LENGTH}
            </span>
          </div>
        </div>

        {/* Step 3: Attachment */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-textPrimary">
            <span className="font-mono text-xs text-accent font-bold uppercase tracking-wider">3.</span> Доказательства / Скриншоты <span className="text-textTertiary">(Опционально)</span>
          </label>
          
          {!attachmentFile ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed ${isDragging ? 'border-accent bg-accent/5' : 'border-borderDef'} rounded-lg p-6 text-center cursor-pointer hover:border-accent hover:bg-surface-2 transition-all`}
            >
              <Upload className="w-8 h-8 text-textTertiary mx-auto mb-2" />
              <p className="text-sm text-textSecondary mb-1">
                Перетащите файл сюда или нажмите для выбора
              </p>
              <p className="text-xs text-textTertiary">
                PNG, JPG, WebP, PDF, TXT до {MAX_FILE_SIZE_MB} МБ
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".png,.jpg,.jpeg,.webp,.pdf,.txt"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
                disabled={isSubmitting}
              />
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 bg-surface-2 border border-borderDef rounded-lg">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="w-8 h-8 bg-accent/10 rounded flex items-center justify-center shrink-0">
                  <Upload className="w-4 h-4 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-textPrimary truncate">{attachmentFile.name}</p>
                  <p className="text-xs text-textTertiary font-mono">
                    {(attachmentFile.size / 1024 / 1024).toFixed(2)} МБ
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemoveFile}
                className="p-1.5 hover:bg-danger/10 rounded transition-colors text-textTertiary hover:text-danger"
                disabled={isSubmitting}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          {errors.attachment && (
            <p className="text-xs text-danger flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              {errors.attachment}
            </p>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default JamAbuseReportDrawer;
