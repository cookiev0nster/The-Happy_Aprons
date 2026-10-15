import React from 'react';

interface FooterProps {
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="w-full bg-[#edf6ee] py-10 mt-16 border-t border-[#dce5dd]/60">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-[#164530] flex items-center justify-center text-[#bceed0]">
            <span className="material-symbols-outlined text-[14px]">apron</span>
          </div>
          <span className="text-xs sm:text-sm font-semibold text-[#414943]">
            © 2025 The Happy Aprons. Nourishing everyday living in Singapore.
          </span>
        </div>

        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => onSelectTab('preferences')}
            className="text-xs font-semibold text-[#414943] hover:text-[#164530] transition-colors cursor-pointer"
          >
            Dietary Profiles
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('meal-planner')}
            className="text-xs font-semibold text-[#414943] hover:text-[#164530] transition-colors cursor-pointer"
          >
            Weekly Cadence
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('recipe-discover')}
            className="text-xs font-semibold text-[#414943] hover:text-[#164530] transition-colors cursor-pointer"
          >
            Atelier Recipes
          </button>
        </div>
      </div>
    </footer>
  );
};
