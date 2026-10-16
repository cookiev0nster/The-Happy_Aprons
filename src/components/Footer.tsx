import React from 'react';

interface FooterProps {
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="w-full bg-[#edf6ee] py-8 mt-16 border-t border-[#dce5dd]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-[20px] text-[#164530]">elderly</span>
          <span className="text-xs sm:text-sm font-semibold text-[#414943]">
            © The Happy Aprons · Elderly & Caregiver Meal Nutrition Platform (Singapore)
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs font-semibold text-[#414943]">
          <button
            type="button"
            onClick={() => onSelectTab('meal-planner')}
            className="hover:text-[#164530] transition-colors cursor-pointer"
          >
            Weekly Menus
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('elderly-setup')}
            className="hover:text-[#164530] transition-colors cursor-pointer"
          >
            Caregiver Setup
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('recipe-library')}
            className="hover:text-[#164530] transition-colors cursor-pointer"
          >
            Recipe Library
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('nutrition-guide')}
            className="hover:text-[#164530] transition-colors cursor-pointer"
          >
            Nutrition Guidelines
          </button>
        </div>
      </div>
    </footer>
  );
};
