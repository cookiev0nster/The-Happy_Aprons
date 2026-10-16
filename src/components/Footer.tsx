import React from 'react';
import { NourishMeLogo } from './NourishMeLogo';

interface FooterProps {
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="w-full bg-[#edf6ee] py-12 mt-20 border-t border-[#dce5dd]/70">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#dce5dd]/60">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <NourishMeLogo size="md" variant="compact" />
            <span className="text-xs text-[#414943] max-w-md leading-relaxed">
              Mindful, zero-waste meal planning platform for Singapore homes. Eliminating dinner fatigue through automated pantry calibration and grocer sync.
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <button
              type="button"
              onClick={() => onSelectTab('preferences')}
              className="text-xs font-semibold text-[#414943] hover:text-[#164530] transition-colors cursor-pointer"
            >
              Dietary Profile
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
            <button
              type="button"
              onClick={() => onSelectTab('my-pantry-cart')}
              className="text-xs font-semibold text-[#414943] hover:text-[#164530] transition-colors cursor-pointer"
            >
              Pantry Cart
            </button>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs text-[#414943]/70 font-mono-data">
          <p>© 2026 NourishMe Atelier. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span>FairPrice</span>
            <span>·</span>
            <span>Cold Storage</span>
            <span>·</span>
            <span>RedMart</span>
            <span>·</span>
            <span>Amazon Fresh</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
