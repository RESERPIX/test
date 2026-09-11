import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Cpu, ChevronDown, ChevronUp, X, Sliders, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export interface DevMatrixField {
  id: string;
  label: string;
  type: 'select' | 'checkbox' | 'buttons';
  value: any;
  onChange: (val: any) => void;
  options?: { value: string; label: string }[];
  highlight?: boolean;
}

interface DevMatrixPanelProps {
  pageName?: string;
  fields: DevMatrixField[];
  bottomOffsetClass?: string; // e.g. "bottom-0" or "bottom-20"
}

/**
 * DesktopDropdown — compact dropdown for the desktop bar.
 * Shows current value as a pill; opens a floating popover on click.
 */
function DesktopDropdown({ field }: { field: DevMatrixField }) {
  const [isOpen, setIsOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ left: 0, bottom: 0 });

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (
        btnRef.current && !btnRef.current.contains(e.target as Node) &&
        popRef.current && !popRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  // Calculate position when opening
  useEffect(() => {
    if (isOpen && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({
        left: rect.left,
        bottom: window.innerHeight - rect.top + 6,
      });
    }
  }, [isOpen]);

  const currentLabel = field.options?.find(o => o.value === field.value)?.label || field.value;
  const cleanLabel = (s: any) => (typeof s === 'string' ? s.replace(/^\[/, '').replace(/\]$/, '') : String(s ?? ''));

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-mono cursor-pointer transition-colors border ${
          field.highlight
            ? 'bg-accent/10 border-accent/30 text-accent font-bold'
            : isOpen
              ? 'bg-surface-2 border-borderStrong text-textPrimary'
              : 'bg-surface-2 border-borderDef text-textPrimary hover:border-borderStrong'
        }`}
      >
        <span className="max-w-[140px] truncate">{cleanLabel(currentLabel)}</span>
        <ChevronDown className={`w-3 h-3 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && ReactDOM.createPortal(
        <div
          ref={popRef}
          className="fixed min-w-[200px] max-w-[280px] bg-surface-1 border border-borderDef rounded-xl shadow-elevation-overlay py-1 z-[99999] animate-fadeIn overflow-hidden"
          style={{ left: pos.left, bottom: pos.bottom }}
        >
          <div className="px-3 py-1.5 border-b border-borderDef mb-0.5">
            <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${field.highlight ? 'text-accent' : 'text-textTertiary'}`}>
              {field.label}
            </span>
          </div>
          {field.options?.map((opt) => {
            const isSelected = field.value === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  field.onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 text-xs font-sans flex items-center gap-2 cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-accent/10 text-accent font-semibold'
                    : 'text-textSecondary hover:bg-surface-2 hover:text-textPrimary'
                }`}
              >
                <span className={`w-4 h-4 shrink-0 rounded-full border flex items-center justify-center ${
                  isSelected ? 'border-accent bg-accent' : 'border-borderDef'
                }`}>
                  {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                </span>
                <span className="truncate">{cleanLabel(opt.label)}</span>
              </button>
            );
          })}
        </div>,
        document.body
      )}
    </>
  );
}

export default function DevMatrixPanel({ pageName, fields, bottomOffsetClass = "bottom-0" }: DevMatrixPanelProps) {
  const { isAuthModalOpen } = useAuth();
  const [isCollapsedDesktop, setIsCollapsedDesktop] = useState(false);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);

  // Close mobile sheet on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileSheetOpen) {
        setIsMobileSheetOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileSheetOpen]);

  // Скрываем DevMatrixPanel, если открыто модальное окно авторизации или нет доступных полей
  if (!fields || fields.length === 0 || isAuthModalOpen) return null;

  return (
    <>
      {/* =========================================================================
          1. МОБИЛЬНАЯ ВЕРСИЯ (< md): ПЛАВАЮЩИЙ БЕЙДЖ + ВЫДВИЖНОЙ BOTTOM SHEET
          ========================================================================= */}
      <div className="md:hidden">
        {/* Floating FAB Badge */}
        <div className={`fixed ${bottomOffsetClass.startsWith('bottom-') ? bottomOffsetClass : 'bottom-20'} right-4 z-devtools pointer-events-auto`}>
          <button
            type="button"
            onClick={() => setIsMobileSheetOpen(true)}
            aria-label="Открыть панель тестирования Dev Matrix"
            className="bg-surface-1/95 backdrop-blur-xl border border-accent/60 text-accent font-mono font-bold text-xs px-3.5 py-2 rounded-full shadow-elevation-overlay flex items-center gap-2 cursor-pointer touch-manipulation active:scale-95 transition-all shadow-[0_4px_20px_rgba(124,58,237,0.3)]"
          >
            <Cpu className="w-3.5 h-3.5 animate-pulse text-accent" />
            <span className="tracking-wider">DEV</span>
            <Sliders className="w-3 h-3 opacity-70" />
          </button>
        </div>

        {/* Mobile Bottom Sheet Modal */}
        {isMobileSheetOpen && ReactDOM.createPortal(
          <div className="fixed inset-0 z-devtools bg-black/80 backdrop-blur-sm flex items-end justify-center animate-fadeIn safe-area-pb">
            {/* Backdrop click to close */}
            <div 
              className="fixed inset-0" 
              onClick={() => setIsMobileSheetOpen(false)} 
              aria-hidden="true" 
            />

            <div className="relative z-10 w-full max-h-[85vh] bg-surface-1 border-t border-borderDef rounded-t-2xl flex flex-col shadow-elevation-overlay animate-slideUpBottom overflow-hidden font-sans">
              {/* Drag Handle */}
              <div className="w-full flex items-center justify-center pt-2.5 pb-1 bg-surface-1 shrink-0">
                <div className="w-10 h-1.5 bg-surface-4 rounded-full" />
              </div>

              {/* Header */}
              <div className="px-5 py-3 border-b border-borderDef flex items-center justify-between bg-surface-1 shrink-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center text-accent shrink-0">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-mono font-bold text-xs text-accent uppercase tracking-wider">DEV MATRIX PANEL</span>
                    {pageName && (
                      <span className="text-[11px] text-textTertiary font-mono truncate">{pageName}</span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMobileSheetOpen(false)}
                  className="w-8 h-8 rounded-control bg-surface-2 hover:bg-surface-3 active:scale-95 flex items-center justify-center text-textTertiary hover:text-textPrimary transition-all cursor-pointer touch-manipulation"
                  aria-label="Закрыть"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Fields Body */}
              <div className="p-5 overflow-y-auto touch-scroll space-y-4 flex-1">
                {fields.map((field) => (
                  <div key={field.id} className="bg-surface-2 border border-borderDef p-3.5 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <label className={`text-xs font-mono font-semibold uppercase tracking-wider ${field.highlight ? 'text-accent' : 'text-textSecondary'}`}>
                        {field.label}
                      </label>
                      {field.highlight && (
                        <span className="text-[10px] font-mono font-bold bg-accent/15 text-accent px-2 py-0.5 rounded">
                          ACTIVE
                        </span>
                      )}
                    </div>

                    {field.type === 'select' && (
                      <div className="relative">
                        <select
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="w-full min-h-[42px] bg-surface-0 border border-borderDef focus:border-accent text-textPrimary text-base font-sans px-3.5 py-2 rounded-lg outline-none cursor-pointer touch-manipulation appearance-none"
                        >
                          {field.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-textTertiary absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    )}

                    {field.type === 'checkbox' && (
                      <label className="min-h-[40px] flex items-center gap-3 cursor-pointer touch-manipulation select-none">
                        <input
                          type="checkbox"
                          checked={!!field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="w-5 h-5 rounded border-borderDef accent-accent cursor-pointer"
                        />
                        <span className="text-sm text-textPrimary font-medium">Включить режим</span>
                      </label>
                    )}

                    {field.type === 'buttons' && (
                      <div className="grid grid-cols-2 gap-1.5 p-1 bg-surface-0 border border-borderDef rounded-lg">
                        {field.options?.map((opt) => {
                          const isSelected = field.value === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => field.onChange(opt.value)}
                              className={`min-h-[38px] px-3 py-1.5 rounded-md font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition-all touch-manipulation active:scale-95 ${
                                isSelected
                                  ? 'bg-accent text-white font-bold shadow-sm'
                                  : 'text-textTertiary hover:text-textPrimary bg-transparent'
                              }`}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5" />}
                              <span>{opt.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Bottom Actions */}
              <div className="p-4 border-t border-borderDef bg-surface-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsMobileSheetOpen(false)}
                  className="w-full min-h-[44px] bg-accent hover:bg-accent-hover active:scale-98 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 touch-manipulation"
                >
                  <span>Применить и закрыть</span>
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>

      {/* =========================================================================
          2. ДЕСКТОПНАЯ ВЕРСИЯ (>= md): ФИКСИРОВАННАЯ ПОЛОСА С DROPDOWN-ПОПАПАМИ
          ========================================================================= */}
      {ReactDOM.createPortal(
        <div className={`hidden md:block fixed ${bottomOffsetClass} left-0 right-0 z-devtools transition-all duration-200 select-none`}>
          {isCollapsedDesktop ? (
            <div className="flex justify-end px-4 pb-2">
              <button 
                type="button"
                onClick={() => setIsCollapsedDesktop(false)}
                className="bg-surface-1/95 backdrop-blur-md border border-accent/40 hover:border-accent text-accent text-xs font-mono font-bold px-3 py-1.5 rounded-full flex items-center gap-2 shadow-2xl cursor-pointer active:scale-95 transition-all"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>DEV MATRIX</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="bg-surface-0/95 backdrop-blur-md border-t border-borderDef shadow-2xl h-[42px] px-4 md:px-8 flex items-center justify-between font-mono text-xs text-textPrimary">
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar min-w-0 py-1">
                {/* BRAND BADGE */}
                <div className="flex items-center gap-2 shrink-0">
                  <Cpu className="w-3.5 h-3.5 text-accent" />
                  <span className="font-extrabold text-accent uppercase tracking-wider text-[11px]">DEV MATRIX</span>
                  {pageName && (
                    <span className="text-textTertiary text-[10px] hidden sm:inline-block">({pageName})</span>
                  )}
                </div>

                {/* DYNAMIC FIELDS — dropdowns for buttons/select, inline for checkbox */}
                <div className="flex items-center gap-2 whitespace-nowrap">
                  {fields.map((field) => (
                    <div key={field.id} className="flex items-center gap-1.5 border-l border-borderDef/60 pl-2">
                      <span className={`text-[10px] shrink-0 ${field.highlight ? 'text-accent font-bold' : 'text-textTertiary'}`}>
                        {field.label}:
                      </span>

                      {/* SELECT → native select dropdown */}
                      {field.type === 'select' && (
                        <select 
                          value={field.value} 
                          onChange={(e) => field.onChange(e.target.value)} 
                          className={`bg-surface-2 border text-textPrimary px-2 py-0.5 rounded-lg outline-none cursor-pointer font-sans text-xs transition-colors ${
                            field.highlight ? 'border-accent/50 text-accent font-bold' : 'border-borderDef hover:border-borderStrong'
                          }`}
                        >
                          {field.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      )}

                      {/* CHECKBOX → inline toggle */}
                      {field.type === 'checkbox' && (
                        <input 
                          type="checkbox" 
                          checked={!!field.value} 
                          onChange={(e) => field.onChange(e.target.checked)} 
                          className="cursor-pointer rounded border-borderDef accent-accent w-4 h-4"
                        />
                      )}

                      {/* BUTTONS → compact dropdown popup */}
                      {field.type === 'buttons' && (
                        <DesktopDropdown field={field} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* COLLAPSE / MINIMIZE BUTTON */}
              <button 
                type="button"
                onClick={() => setIsCollapsedDesktop(true)}
                className="text-textTertiary hover:text-textPrimary p-1 transition-colors cursor-pointer shrink-0 ml-2"
                title="Свернуть панель DEV MATRIX"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>,
        document.body
      )}
    </>
  );
}
