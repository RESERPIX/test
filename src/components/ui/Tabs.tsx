import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-4 sm:gap-8 overflow-x-auto no-scrollbar touch-scroll text-sm font-medium border-b border-surface-3 select-none ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative min-h-[44px] h-12 px-1 flex items-center gap-2 transition-all duration-120 outline-none cursor-pointer whitespace-nowrap rounded-control touch-manipulation active:scale-95 ${
              isActive
                ? 'text-textPrimary font-bold'
                : 'text-textTertiary hover:text-textPrimary active:text-textPrimary'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono ${isActive ? 'bg-accent/20 text-accent font-bold' : 'bg-surface-2 text-textTertiary'}`}>
                {tab.count}
              </span>
            )}
            {isActive && (
              <span className="absolute bottom-[-1px] left-0 right-0 h-[2.5px] bg-accent shadow-[0_0_8px_rgba(124,58,237,0.8)] z-10 rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
