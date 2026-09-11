import React from 'react';

interface FormSectionProps {
  id?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({ 
  id, 
  title, 
  description, 
  children,
  className = ''
}) => {
  return (
    <section 
      id={id}
      className={`scroll-mt-24 space-y-6 pb-8 border-b border-borderDef ${className}`}
    >
      <div>
        <h2 className="text-heading-2 font-semibold text-textPrimary mb-2">
          {title}
        </h2>
        {description && (
          <p className="text-body-sm text-textSecondary">
            {description}
          </p>
        )}
      </div>
      
      <div className="space-y-5">
        {children}
      </div>
    </section>
  );
};

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  success?: boolean;
  hint?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({ 
  label, 
  required, 
  error, 
  success,
  hint,
  children 
}) => {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-textPrimary block">
        {label}
        {required && <span className="text-danger ml-1">*</span>}
      </label>
      
      {children}
      
      {error && (
        <p className="text-xs text-danger flex items-center gap-1.5">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          {error}
        </p>
      )}
      
      {!error && hint && (
        <p className="text-xs text-textTertiary">
          {hint}
        </p>
      )}
    </div>
  );
};
