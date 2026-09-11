import React from 'react';

export interface SegmentItem {
  key: string;
  label: string;
  count?: number;
}

export interface SegmentedControlProps {
  items: SegmentItem[];
  value: string;
  onChange: (val: string) => void;
  className?: string;
  fullWidth?: boolean;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  items,
  value,
  onChange,
  className = '',
  fullWidth = true,
}) => {
  return (
    <div className={`p-1 bg-surface-1 border border-borderDef rounded-[10px] font-mono text-xs overflow-x-auto no-scrollbar touch-scroll select-none ${fullWidth ? 'grid grid-flow-col auto-cols-fr' : 'inline-flex gap-1'} ${className}`}>
      {items.map((item) => {
        const isSelected = item.key === value;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            className={`min-h-[36px] py-1.5 px-3 rounded-[6px] transition-all duration-120 flex items-center justify-center gap-2 text-xs cursor-pointer touch-manipulation active:scale-[0.98] whitespace-nowrap ${
              isSelected
                ? 'bg-surface-3 text-textPrimary font-bold shadow-sm'
                : 'text-textTertiary hover:text-textSecondary hover:bg-surface-2/50 active:bg-surface-2'
            }`}
          >
            <span>{item.label}</span>
            {item.count !== undefined && (
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono transition-colors ${
                isSelected 
                  ? 'bg-surface-1 text-textPrimary shadow-inner' 
                  : 'bg-surface-2 text-textTertiary'
              }`}>
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default SegmentedControl;
