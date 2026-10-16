import React, { useState } from 'react';
import { ElderlyProfileState, GrocerId, Recipe } from '../types';
import { GROCER_OPTIONS } from '../data/mockData';

interface RecipeModalProps {
  recipe: Recipe | null;
  profile: ElderlyProfileState;
  onClose: () => void;
  onAddToCart?: (recipe: Recipe) => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({
  recipe,
  profile,
  onClose,
  onAddToCart,
}) => {
  const [selectedGrocer, setSelectedGrocer] = useState<GrocerId>(profile.selectedGrocer);
  const [copiedHelperText, setCopiedHelperText] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  if (!recipe) return null;

  const currentGrocer =
    GROCER_OPTIONS.find((g) => g.id === selectedGrocer) || GROCER_OPTIONS[0];

  const totalMealCost = (recipe.estimatedCostPerPaxSgd * profile.elderlyCount).toFixed(2);

  const getSupermarketSearchUrl = (grocerId: GrocerId, searchTerm: string) => {
    const grocer = GROCER_OPTIONS.find((g) => g.id === grocerId) || GROCER_OPTIONS[0];
    return `${grocer.searchUrlTemplate}${encodeURIComponent(searchTerm)}`;
  };

  const handleCopyHelperInstructions = () => {
    const text = `🍽️ Prep Guide for: ${recipe.title} (${recipe.chineseTitle || ''})
For ${profile.elderlyCount} elderly person(s):
• Texture Target: ${recipe.textureLevel}
• Deboning: ${recipe.caregiverTips.deboningAdvice}
• Cooking Time: ${recipe.caregiverTips.steamingOrSimmerTime}
• Helper Note: ${recipe.caregiverTips.domesticHelperTip || recipe.caregiverTips.swallowingSafetyTip}

Ingredients Needed:
${recipe.ingredients
  .map(
    (ing) =>
      `- ${ing.name}: ${ing.baseAmountPerPax * profile.elderlyCount} ${ing.unit} (${ing.elderlyPreparationTip || ''})`
  )
  .join('\n')}
`;
    navigator.clipboard?.writeText(text);
    setCopiedHelperText(true);
    setTimeout(() => setCopiedHelperText(false), 3000);
  };

  const handleAddIngredientsToBasket = () => {
    if (onAddToCart) {
      onAddToCart(recipe);
    }
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#e2eae2] my-auto">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-[#e2eae2] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#164530] bg-[#bceed0]/50 px-2.5 py-1 rounded-md">
              {recipe.mealSlot.toUpperCase()}
            </span>
            <span className="text-xs font-bold text-[#9a4521] bg-[#ffdbce]/40 px-2.5 py-1 rounded-md">
              {recipe.textureLevel.split(':')[0]}
            </span>
            <span className="text-xs text-[#414943] hidden sm:inline">
              Scaled for {profile.elderlyCount} {profile.elderlyCount === 1 ? 'elderly' : 'elders'}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close recipe details"
            className="w-9 h-9 rounded-full border border-[#dce5dd] flex items-center justify-center text-[#414943] hover:text-[#151d19] hover:bg-[#edf6ee] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Hero Section */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-100">
          <img
            src={recipe.image}
            alt={recipe.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
            <span className="text-xs text-[#bceed0] uppercase tracking-wider font-bold mb-1">
              {recipe.cuisine.toUpperCase()} · ~{recipe.prepMinutes} MINS PREP
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
              {recipe.title}
            </h2>
            {recipe.chineseTitle && (
              <span className="text-sm text-white/90 font-medium mt-0.5">
                {recipe.chineseTitle}
              </span>
            )}
            <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-2xl leading-relaxed">
              {recipe.subtitle}
            </p>
          </div>
        </div>

        {/* Toast */}
        {addedToast && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-[#164530] text-white text-xs font-bold flex items-center justify-between">
            <span>✓ Ingredients added to your Singapore Supermarket Shopping Basket!</span>
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
          </div>
        )}

        <div className="p-6 space-y-8">
          {/* Quick Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#f3fcf3] p-4 rounded-2xl border border-[#bceed0]/50">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#414943] block">
                Total for {profile.elderlyCount} Pax
              </span>
              <span className="font-mono-data text-xl font-bold text-[#164530]">
                ${totalMealCost} SGD
              </span>
              <span className="text-[10px] text-[#414943] block mt-0.5">
                (${recipe.estimatedCostPerPaxSgd.toFixed(2)}/elder)
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#414943] block">
                Protein / Pax
              </span>
              <span className="font-mono-data text-xl font-bold text-[#164530]">
                {recipe.elderlyNutrition.proteinGrams}g
              </span>
              <span className="text-[10px] text-[#414943] block mt-0.5">Muscle preservation</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#414943] block">
                Sodium / Pax
              </span>
              <span className="font-mono-data text-xl font-bold text-[#164530]">
                {recipe.elderlyNutrition.sodiumMg}mg
              </span>
              <span className="text-[10px] text-[#414943] block mt-0.5">DASH low-salt safe</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#414943] block">
                Calcium / Pax
              </span>
              <span className="font-mono-data text-xl font-bold text-[#164530]">
                {recipe.elderlyNutrition.calciumMg}mg
              </span>
              <span className="text-[10px] text-[#414943] block mt-0.5">Bone density target</span>
            </div>
          </div>

          {/* CAREGIVER & HELPER PREPARATION PROTOCOL (Crucial Feature) */}
          <div className="bg-[#edf6ee] p-5 sm:p-6 rounded-2xl border border-[#dce5dd]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#dce5dd]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#164530] text-[22px]">
                  health_and_safety
                </span>
                <h3 className="font-bold text-base text-[#151d19]">
                  Caregiver & Domestic Helper Preparation Protocol
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCopyHelperInstructions}
                className="text-xs font-bold text-[#164530] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">content_copy</span>
                <span>{copiedHelperText ? 'Copied to Clipboard!' : 'Copy Prep Notes (WhatsApp)'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-white rounded-xl border border-[#e2eae2]">
                <span className="font-bold text-[#164530] block mb-1">
                  1. Deboning & Physical Safety:
                </span>
                <p className="text-[#414943] leading-relaxed">
                  {recipe.caregiverTips.deboningAdvice}
                </p>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-[#e2eae2]">
                <span className="font-bold text-[#164530] block mb-1">
                  2. Texture Modification ({recipe.textureLevel}):
                </span>
                <p className="text-[#414943] leading-relaxed">
                  {recipe.caregiverTips.textureModification}
                </p>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-[#e2eae2]">
                <span className="font-bold text-[#164530] block mb-1">
                  3. Cooking Duration & Heat Level:
                </span>
                <p className="text-[#414943] leading-relaxed">
                  {recipe.caregiverTips.steamingOrSimmerTime}
                </p>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-[#e2eae2]">
                <span className="font-bold text-[#164530] block mb-1">
                  4. Swallowing Safety & Posture:
                </span>
                <p className="text-[#414943] leading-relaxed">
                  {recipe.caregiverTips.swallowingSafetyTip}
                </p>
              </div>
            </div>

            {recipe.caregiverTips.domesticHelperTip && (
              <div className="mt-3 p-3 bg-[#bceed0]/30 rounded-xl text-xs text-[#002113]">
                <strong>Helper Direct instruction:</strong> "{recipe.caregiverTips.domesticHelperTip}"
              </div>
            )}
          </div>

          {/* DYNAMIC SCALED INGREDIENTS WITH DIRECT SINGAPORE SUPERMARKET LINKS */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-bold text-lg text-[#151d19]">
                  Exact Ingredients for {profile.elderlyCount} Elderly
                </h3>
                <p className="text-xs text-[#414943]">
                  Quantities mathematically calibrated for {profile.elderlyCount} portion(s). Click any 1-click link to buy directly from Singapore online supermarkets.
                </p>
              </div>

              {/* Supermarket selector */}
              <div className="flex items-center gap-1.5 self-start sm:self-auto bg-[#edf6ee] p-1 rounded-xl border border-[#dce5dd]">
                <span className="text-[10px] uppercase font-bold text-[#414943] px-2">Store:</span>
                {GROCER_OPTIONS.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setSelectedGrocer(g.id)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      selectedGrocer === g.id
                        ? 'bg-white text-[#164530] shadow-xs'
                        : 'text-[#414943] hover:text-[#151d19]'
                    }`}
                  >
                    {g.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-[#e2eae2] border border-[#e2eae2] rounded-2xl overflow-hidden bg-white">
              {recipe.ingredients.map((ing, idx) => {
                const totalAmount = ing.baseAmountPerPax * profile.elderlyCount;
                const totalCost = (ing.estimatedPricePerPaxSgd * profile.elderlyCount).toFixed(2);
                const searchUrl = getSupermarketSearchUrl(selectedGrocer, ing.singaporeSearchTerm);

                return (
                  <div
                    key={idx}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#f3fcf3]/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#151d19]">{ing.name}</span>
                        <span className="text-[10px] text-[#414943] uppercase bg-[#edf6ee] px-2 py-0.5 rounded">
                          {ing.category}
                        </span>
                      </div>
                      {ing.elderlyPreparationTip && (
                        <p className="text-xs text-[#414943] mt-0.5 leading-snug">
                          💡 <em>{ing.elderlyPreparationTip}</em>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                      <div className="text-right">
                        <span className="font-mono-data text-sm font-bold text-[#164530] block">
                          {totalAmount} {ing.unit}
                        </span>
                        <span className="text-[11px] text-[#414943] block">
                          ~${totalCost} SGD
                        </span>
                      </div>

                      {/* Direct Singapore Online Supermarket Link */}
                      <a
                        href={searchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-[#edf6ee] hover:bg-[#164530] text-[#164530] hover:text-white text-xs font-semibold border border-[#dce5dd] transition-all flex items-center gap-1.5 shrink-0"
                      >
                        <span>Buy on {currentGrocer.name.split(' ')[0]}</span>
                        <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP-BY-STEP COOKING STEPS */}
          <div>
            <h3 className="font-bold text-lg text-[#151d19] mb-3">
              Caregiver Step-by-Step Cooking Method
            </h3>
            <ol className="space-y-3">
              {recipe.cookingSteps.map((step, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white border border-[#e2eae2]"
                >
                  <span className="w-6 h-6 rounded-full bg-[#164530] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-[#151d19] leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Supermarket Freshness Advice */}
          <div className="p-4 rounded-xl bg-[#edf6ee]/70 border border-[#dce5dd] flex items-start gap-3">
            <span className="material-symbols-outlined text-[#164530] text-[20px] shrink-0 mt-0.5">
              storefront
            </span>
            <div className="text-xs text-[#414943]">
              <strong className="text-[#151d19] block mb-0.5">Singapore Supermarket Sourcing Note:</strong>
              {recipe.singaporeGrocerRecommendation}
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-[#e2eae2] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-[#414943]">
              Estimated meal total: <strong className="text-[#164530]">${totalMealCost} SGD</strong> for {profile.elderlyCount} {profile.elderlyCount === 1 ? 'elderly' : 'elders'}.
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-[#dce5dd] text-xs font-bold text-[#414943] hover:bg-[#edf6ee] cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleAddIngredientsToBasket}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#164530] hover:bg-[#23583f] text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                <span>Add Ingredients to SG Basket</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
