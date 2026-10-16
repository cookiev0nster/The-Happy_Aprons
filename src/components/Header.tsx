import React, { useState } from 'react';

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
    <header className="fixed top-0 w-full z-50 bg-[#f3fcf3]/90 backdrop-blur-md border-b border-[#e2eae2]/60 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      <div className="h-20 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6">
        {/* Brand Zone */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectTab('preferences')}
            className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#164530] flex items-center justify-center text-[#bceed0] shadow-sm transition-transform group-hover:scale-105">
              <span className="material-symbols-outlined text-[20px]">nutrition</span>
            </div>
            <span className="text-[19px] font-bold text-[#164530] tracking-tight whitespace-nowrap">
              NourishMe
            </span>
          </button>
        </div>

        {/* Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#edf6ee] p-1 rounded-full border border-[#dce5dd]/60">
          <button
            onClick={() => onSelectTab('meal-planner')}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              currentTab === 'meal-planner'
                ? 'bg-[#164530] text-white shadow-sm'
                : 'text-[#414943] hover:text-[#151d19] hover:bg-[#e2eae2]/50'
            }`}
          >
            Meal Planner
          </button>
          <button
            onClick={() => onSelectTab('my-pantry-cart')}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              currentTab === 'my-pantry-cart'
                ? 'bg-[#164530] text-white shadow-sm'
                : 'text-[#414943] hover:text-[#151d19] hover:bg-[#e2eae2]/50'
            }`}
          >
            My Pantry & Cart
          </button>
          <button
            onClick={() => onSelectTab('recipe-discover')}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              currentTab === 'recipe-discover'
                ? 'bg-[#164530] text-white shadow-sm'
                : 'text-[#414943] hover:text-[#151d19] hover:bg-[#e2eae2]/50'
            }`}
          >
            Recipe Discover
          </button>
          <button
            onClick={() => onSelectTab('preferences')}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              currentTab === 'preferences'
                ? 'bg-[#164530] text-white shadow-sm'
                : 'text-[#414943] hover:text-[#151d19] hover:bg-[#e2eae2]/50'
            }`}
          >
            Preferences
          </button>
        </nav>

        {/* Action Zone: Cart + Profile */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCart}
            aria-label="View Grocery Cart"
            className="relative p-2 rounded-full text-[#414943] hover:text-[#151d19] hover:bg-[#edf6ee] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">shopping_basket</span>
            {cartCount > 0 && (
              <span className="absolute 0 top-1 right-1 w-4 h-4 rounded-full bg-[#9a4521] text-white text-[10px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-1.5 p-1 rounded-full hover:bg-[#edf6ee] transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-[#164530]/10 border border-[#164530]/20 flex items-center justify-center overflow-hidden">
                <span className="text-xs font-bold text-[#164530]">SG</span>
              </div>
              <span className="material-symbols-outlined text-[#414943] text-[18px]">expand_more</span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#e2eae2] py-2 z-50 text-left">
                <div className="px-4 py-2 border-b border-[#edf6ee]">
                  <p className="text-xs font-bold text-[#151d19]">rachelkoh10@gmail.com</p>
                  <p className="text-[11px] text-[#414943]">Singapore Atelier Member</p>
                </div>
                <button
                  onClick={() => {
                    onSelectTab('preferences');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-[#151d19] hover:bg-[#edf6ee] flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#164530]">tune</span>
                  Kitchen Calibration Profile
                </button>
                <button
                  onClick={() => {
                    onSelectTab('my-pantry-cart');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-[#151d19] hover:bg-[#edf6ee] flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#164530]">local_shipping</span>
                  Grocer Delivery Connect
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
