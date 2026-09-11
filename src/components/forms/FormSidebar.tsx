import React from 'react';
import { Save, Send, ArrowLeft } from 'lucide-react';
import { AutoSaveIndicator } from './AutoSaveIndicator';

interface NavItem {
  id: string;
  label: string;
  completed?: boolean;
}

interface FormSidebarProps {
  title: string;
  navItems: NavItem[];
  activeSection: string;
  progress: number;
  autoSaveStatus: 'idle' | 'saving' | 'saved' | 'error';
  lastSaved?: Date;
  onSaveDraft: () => void;
  onSubmit: () => void;
  onBack?: () => void;
  submitLabel?: string;
  canSubmit?: boolean;
}

export const FormSidebar: React.FC<FormSidebarProps> = ({
  title,
  navItems,
  activeSection,
  progress,
  autoSaveStatus,
  lastSaved,
  onSaveDraft,
  onSubmit,
  onBack,
  submitLabel = 'Отправить',
  canSubmit = true
}) => {
  return (
    <aside className="w-64 shrink-0 sticky top-24 h-fit">
      {/* Back button */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-textSecondary hover:text-textPrimary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад
        </button>
      )}

      {/* Title */}
      <h1 className="text-lg font-bold text-textPrimary mb-6">
        {title}
      </h1>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-textPrimary">Прогресс</span>
          <span className="text-xs font-mono text-textTertiary">{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
          <div 
            className="h-full bg-accent transition-all duration-300" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 mb-8">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`block px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeSection === item.id
                ? 'text-accent bg-accent/10'
                : 'text-textSecondary hover:text-textPrimary hover:bg-surface-2'
            }`}
          >
            <span className="flex items-center justify-between">
              {item.label}
              {item.completed && (
                <svg className="w-4 h-4 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </span>
          </a>
        ))}
      </nav>

      {/* Actions */}
      <div className="space-y-3 pt-6 border-t border-borderDef">
        <button
          onClick={onSaveDraft}
          className="w-full h-10 bg-surface-2 hover:bg-surface-3 border border-borderDef text-textPrimary text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          Сохранить черновик
        </button>

        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          className={`w-full h-10 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
            canSubmit
              ? 'bg-accent hover:bg-accent-hover text-white active:scale-95'
              : 'bg-surface-2 text-textDisabled cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" />
          {submitLabel}
        </button>
      </div>

      {/* Auto-save status */}
      <div className="mt-4">
        <AutoSaveIndicator status={autoSaveStatus} lastSaved={lastSaved} />
      </div>
    </aside>
  );
};
