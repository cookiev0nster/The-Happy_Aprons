import React from 'react';
import { ProfileState, Recipe } from '../types';

interface RecipeModalProps {
  recipe: Recipe | null;
  profile: ProfileState;
  onClose: () => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({
  recipe,
  profile,
  onClose,
}) => {
  if (!recipe) return null;

  // Portion multiplier: 1 per adult, 0.55 per kid
  const portionMultiplier = (profile.adults * 1 + profile.kids * 0.55) / 2; // base recipe is 2 adults

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#e2eae2] my-auto">
        {/* Hero Image */}
        <div className="relative h-64 sm:h-72 w-full bg-[#edf6ee]">
          <img
            src={recipe.image}
            alt={recipe.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
          <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
            <span className="px-2.5 py-1 rounded-full bg-[#164530] text-white text-xs font-bold shadow-xs">
              {recipe.dishStyle}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-white/90 text-[#151d19] text-xs font-bold font-mono-data">
              ⏱️ {recipe.prepMinutes} Mins Flat
            </span>
            <span className="px-2.5 py-1 rounded-full bg-[#bceed0] text-[#002113] text-xs font-bold font-mono-data">
              {recipe.proteinGrams}g Protein
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[#151d19]">
              {recipe.title}
            </h2>
            {recipe.subtitle && (
              <p className="text-sm font-semibold text-[#164530] mt-0.5">
                {recipe.subtitle}
              </p>
            )}
            <p className="text-xs text-[#414943] mt-2">
              Portions scaled for:{' '}
              <strong className="text-[#151d19]">
                {profile.adults} Adult{profile.adults > 1 ? 's' : ''}
                {profile.kids > 0 ? ` + ${profile.kids} Kid${profile.kids > 1 ? 's' : ''}` : ''}
              </strong>{' '}
              (~{portionMultiplier.toFixed(1)}x batch factor)
            </p>
          </div>

          {/* Dish Architecture breakdown */}
          <div className="p-4 rounded-2xl bg-[#edf6ee]/70 border border-[#dce5dd]/70 mb-6">
            <div className="text-xs font-bold text-[#164530] uppercase tracking-wider mb-2">
              Dinner Plate Architecture
            </div>
            <div className="space-y-1.5 text-xs text-[#151d19]">
              <p>
                <strong>Hero Main:</strong> {recipe.mainDish}
              </p>
              {recipe.sideDish && (
                <p>
                  <strong>Crisp Side:</strong> {recipe.sideDish}
                </p>
              )}
              {recipe.soupDish && (
                <p>
                  <strong>Family Broth:</strong> {recipe.soupDish}
                </p>
              )}
            </div>
          </div>

          {/* Ingredients list */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-[#151d19] uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Required Ingredients</span>
              <span className="text-[11px] text-[#414943] normal-case font-normal">
                Auto-synced with Singapore grocers
              </span>
            </h3>

            <div className="space-y-2">
              {recipe.ingredients.map((ing, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-white border border-[#edf6ee] flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#164530]"></span>
                    <span className="font-semibold text-[#151d19]">{ing.name}</span>
                    <span className="text-[#414943] font-mono-data">({ing.amount})</span>
                  </div>
                  {ing.zeroWasteNote && (
                    <span className="text-[11px] text-[#164530] bg-[#edf6ee] px-2 py-0.5 rounded-md font-medium">
                      Zero-Waste: {ing.zeroWasteNote}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step by Step Cooking Instructions */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-[#151d19] uppercase tracking-wider mb-3">
              Step-by-Step Rapid Cooking Method
            </h3>
            <ol className="space-y-3">
              {recipe.instructions.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#151d19] leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-[#164530] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 font-mono-data">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Singapore Chef Tip */}
          {recipe.singaporeTip && (
            <div className="p-4 rounded-2xl bg-[#ffdbce]/40 border border-[#ffdbce]/60 text-xs text-[#380d00] flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[#9a4521] text-[18px] shrink-0 mt-0.5">
                tips_and_updates
              </span>
              <div>
                <strong className="block mb-0.5">Singapore Kitchen Note:</strong>
                {recipe.singaporeTip}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-6 pt-4 border-t border-[#edf6ee] flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full border border-[#dce5dd] text-xs font-semibold text-[#414943] hover:bg-[#edf6ee] transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full bg-[#164530] text-white text-xs font-bold hover:bg-[#2f5d46] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">bookmark</span>
              Keep in My Week
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
