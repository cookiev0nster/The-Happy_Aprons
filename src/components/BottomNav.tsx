import React from 'react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  basketCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  basketCount,
}) => {
  const navItems: { tab: ActiveTab; label: string; icon: string; hasBadge?: boolean }[] = [
    { tab: 'home', label: 'Home', icon: 'home' },
    { tab: 'discover', label: 'Discover', icon: 'search' },
    { tab: 'recipes', label: 'Recipes', icon: 'skillet' },
    { tab: 'basket', label: 'Basket', icon: 'shopping_basket', hasBadge: true },
    { tab: 'saved-orders', label: 'Saved', icon: 'favorite' },
    { tab: 'profile', label: 'Profile', icon: 'person' },
  ];

  return (
    <nav aria-label="Mobile Navigation" className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#e2eae2] shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-2 py-1.5">
      <div className="grid grid-cols-6 gap-1 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.tab;
          return (
            <button
              key={item.tab}
              type="button"
              onClick={() => onSelectTab(item.tab)}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer relative ${
                isActive ? 'text-[#164530]' : 'text-[#717973] hover:text-[#151d19]'
              }`}
            >
              <div className="relative">
                <span
                  className={`material-symbols-outlined text-[22px] transition-transform ${
                    isActive ? 'scale-110 font-bold' : ''
                  }`}
                >
                  {item.icon}
                </span>
                {item.hasBadge && basketCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-[#9a4521] text-white text-[10px] font-bold flex items-center justify-center leading-none">
                    {basketCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#164530] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
