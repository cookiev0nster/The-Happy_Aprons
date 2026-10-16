import React, { useState } from 'react';
import { NourishMeLogo } from './NourishMeLogo';

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
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-[#f4f7f4]/95 backdrop-blur-md border-b border-[#e2eae2]/80 shadow-[0_1px_10px_rgba(22,69,48,0.04)]">
      <div className="h-20 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Zone with NourishMe Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectTab('preferences')}
            className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer"
            aria-label="NourishMe Home"
          >
            <NourishMeLogo size="md" variant="full" />
          </button>
        </div>

        {/* Zone 2: Navigation Links (Single-Line, Clean Typography) */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#edf6ee] p-1.5 rounded-full border border-[#dce5dd]/70">
          <button
            onClick={() => onSelectTab('preferences')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              currentTab === 'preferences'
                ? 'bg-[#164530] text-white shadow-sm'
                : 'text-[#414943] hover:text-[#151d19] hover:bg-[#e2eae2]/60'
            }`}
          >
            Preferences
          </button>
          <button
            onClick={() => onSelectTab('meal-planner')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              currentTab === 'meal-planner'
                ? 'bg-[#164530] text-white shadow-sm'
                : 'text-[#414943] hover:text-[#151d19] hover:bg-[#e2eae2]/60'
            }`}
          >
            Weekly Cadence
          </button>
          <button
            onClick={() => onSelectTab('recipe-discover')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              currentTab === 'recipe-discover'
                ? 'bg-[#164530] text-white shadow-sm'
                : 'text-[#414943] hover:text-[#151d19] hover:bg-[#e2eae2]/60'
            }`}
          >
            Atelier Recipes
          </button>
          <button
            onClick={() => onSelectTab('my-pantry-cart')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              currentTab === 'my-pantry-cart'
                ? 'bg-[#164530] text-white shadow-sm'
                : 'text-[#414943] hover:text-[#151d19] hover:bg-[#e2eae2]/60'
            }`}
          >
            Pantry & Grocer
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Cart + Profile) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenCart}
            aria-label="View Grocery Cart"
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#edf6ee] hover:bg-[#e2eae2] border border-[#dce5dd] text-[#164530] text-xs font-semibold transition-all cursor-pointer shadow-xs hover:shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px] text-[#164530]">shopping_basket</span>
            <span className="hidden sm:inline">Pantry Cart</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#9a4521] text-white text-[11px] font-bold flex items-center justify-center font-mono-data">
                {cartCount}
              </span>
            )}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-1.5 p-1 rounded-full hover:bg-[#edf6ee] transition-colors cursor-pointer border border-transparent hover:border-[#dce5dd]"
              aria-label="User profile menu"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#164530] to-[#25684b] text-[#bceed0] flex items-center justify-center overflow-hidden shadow-xs font-bold text-xs tracking-wider">
                NM
              </div>
              <span className="material-symbols-outlined text-[#414943] text-[18px]">expand_more</span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-[#e2eae2] py-2 z-50 text-left animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-4 py-2.5 border-b border-[#edf6ee]">
                  <p className="text-xs font-bold text-[#151d19]">cookiev0nster@gmail.com</p>
                  <p className="text-[11px] text-[#22724D] font-medium flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]"></span>
                    NourishMe Atelier Member
                  </p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      onSelectTab('preferences');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-[#151d19] hover:bg-[#edf6ee] flex items-center gap-2.5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[17px] text-[#164530]">tune</span>
                    Kitchen Calibration Profile
                  </button>
                  <button
                    onClick={() => {
                      onSelectTab('meal-planner');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-[#151d19] hover:bg-[#edf6ee] flex items-center gap-2.5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[17px] text-[#164530]">calendar_month</span>
                    Weekly Plan & Portions
                  </button>
                  <button
                    onClick={() => {
                      onSelectTab('my-pantry-cart');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-[#151d19] hover:bg-[#edf6ee] flex items-center gap-2.5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[17px] text-[#164530]">local_shipping</span>
                    Grocer Delivery Sync
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
