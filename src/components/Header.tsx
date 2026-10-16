import React from 'react';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  cartCount: number;
  onOpenCart: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  cartCount,
  onOpenCart,
}) => {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#f3fcf3]/95 backdrop-blur-md border-b border-[#e2eae2] shadow-xs">
      <div className="h-16 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onSelectTab('meal-planner')}
          className="text-lg font-bold tracking-tight text-[#164530] whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[22px] text-[#164530]">elderly</span>
          <span>The Happy Aprons</span>
        </button>

        {/* Zone 2: 4 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#414943]">
          <button
            onClick={() => onSelectTab('meal-planner')}
            className={`whitespace-nowrap shrink-0 hover:text-[#164530] transition-colors cursor-pointer py-1 ${
              currentTab === 'meal-planner'
                ? 'text-[#164530] font-bold border-b-2 border-[#164530]'
                : ''
            }`}
          >
            Weekly Menus
          </button>
          <button
            onClick={() => onSelectTab('elderly-setup')}
            className={`whitespace-nowrap shrink-0 hover:text-[#164530] transition-colors cursor-pointer py-1 ${
              currentTab === 'elderly-setup'
                ? 'text-[#164530] font-bold border-b-2 border-[#164530]'
                : ''
            }`}
          >
            Caregiver Setup
          </button>
          <button
            onClick={() => onSelectTab('recipe-library')}
            className={`whitespace-nowrap shrink-0 hover:text-[#164530] transition-colors cursor-pointer py-1 ${
              currentTab === 'recipe-library'
                ? 'text-[#164530] font-bold border-b-2 border-[#164530]'
                : ''
            }`}
          >
            Recipe Library
          </button>
          <button
            onClick={() => onSelectTab('nutrition-guide')}
            className={`whitespace-nowrap shrink-0 hover:text-[#164530] transition-colors cursor-pointer py-1 ${
              currentTab === 'nutrition-guide'
                ? 'text-[#164530] font-bold border-b-2 border-[#164530]'
                : ''
            }`}
          >
            Elderly Nutrition
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenCart}
            aria-label="Open Singapore Supermarket Shopping Basket"
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#164530] hover:bg-[#23583f] rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
            <span>SG Supermarket Basket</span>
            {cartCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-[#bceed0] text-[#002113] text-[11px] font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
