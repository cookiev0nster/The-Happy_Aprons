import React, { useState } from 'react';
import { DietaryRecipe, HouseholdMemberProfile, Product, SupermarketId } from '../types';
import { DIETARY_RECIPES, PRODUCTS } from '../data/mockData';

interface RecipesViewProps {
  activeProfile: HouseholdMemberProfile;
  onOpenProductModal: (product: Product) => void;
  onAddToBasket: (product: Product, retailerId: SupermarketId, quantity: number) => void;
}

export const RecipesView: React.FC<RecipesViewProps> = ({
  activeProfile,
  onOpenProductModal,
  onAddToBasket,
}) => {
  const [selectedRecipe, setSelectedRecipe] = useState<DietaryRecipe>(DIETARY_RECIPES[0]);
  const [addedToast, setAddedToast] = useState(false);

  const handleAddAllIngredients = (recipe: DietaryRecipe) => {
    let addedCount = 0;
    for (const ing of recipe.ingredients) {
      if (ing.matchedProductId) {
        const prod = PRODUCTS.find((p) => p.id === ing.matchedProductId);
        if (prod) {
          const best = [...prod.retailers].sort((a, b) => a.priceSgd - b.priceSgd)[0];
          if (best) {
            onAddToBasket(prod, best.supermarketId, 1);
            addedCount++;
          }
        }
      }
    }
    if (addedCount > 0) {
      setAddedToast(true);
      setTimeout(() => setAddedToast(false), 2500);
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 pb-24">
      {/* Toast */}
      {addedToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#164530] text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-[18px] text-[#bceed0]">check_circle</span>
          <span>Ingredients successfully added to your multi-store basket!</span>
        </div>
      )}

      {/* Header */}
      <div>
        <span className="text-xs uppercase tracking-widest text-[#164530] font-bold">
          Dietary Inspiration & Home Cooking
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#151d19] mt-1">
          Nourishing Recipes with Multi-Store Ingredients
        </h1>
        <p className="text-xs sm:text-sm text-[#556057]">
          Every recipe is reviewed for glycemic index stability, lower sodium, and allergen transparency for <strong>{activeProfile.name}</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Recipe Selector (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-sm font-bold text-[#151d19] uppercase tracking-wider">
            Curated Singapore Recipes
          </h2>

          <div className="space-y-3">
            {DIETARY_RECIPES.map((recipe) => {
              const isSelected = selectedRecipe.id === recipe.id;
              return (
                <div
                  key={recipe.id}
                  onClick={() => setSelectedRecipe(recipe)}
                  className={`p-4 rounded-3xl border transition-all cursor-pointer flex items-start gap-4 ${
                    isSelected
                      ? 'border-[#164530] bg-[#edf6ee]/70 shadow-xs ring-2 ring-[#164530]/20'
                      : 'border-[#e2eae2] bg-white hover:border-[#bceed0]'
                  }`}
                >
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-[#dce5dd]"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-[#164530] uppercase tracking-wider block">
                      ⏱️ {recipe.prepMinutes} mins · {recipe.servings} Servings
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-[#151d19] line-clamp-2 mt-0.5">
                      {recipe.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 font-mono-data text-[10px] text-[#556057]">
                      <span>{recipe.nutritionPerServing.sodiumMg}mg Sodium</span>
                      <span>·</span>
                      <span>{recipe.nutritionPerServing.proteinG}g Protein</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Recipe Details & 1-Click Buy (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#e2eae2] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="relative h-64 rounded-2xl overflow-hidden bg-[#edf6ee] border border-[#dce5dd]">
            <img
              src={selectedRecipe.image}
              alt={selectedRecipe.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
              {selectedRecipe.suitableProfiles.map((p, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-[#164530] uppercase tracking-wider">
              ⏱️ {selectedRecipe.prepMinutes} Minutes · Scaled for {selectedRecipe.servings} Servings
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#151d19] mt-1 leading-snug">
              {selectedRecipe.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#414943] mt-1 leading-relaxed">
              {selectedRecipe.subtitle}
            </p>
          </div>

          {/* Nutritional Profile Bento */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-4 rounded-2xl bg-[#f8fbf8] border border-[#e2eae2] text-center">
            <div>
              <span className="text-[10px] text-[#556057] uppercase font-bold block">Calories</span>
              <span className="font-mono-data text-base font-bold text-[#151d19]">
                {selectedRecipe.nutritionPerServing.calories} kcal
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#556057] uppercase font-bold block">Sodium</span>
              <span className="font-mono-data text-base font-bold text-[#164530]">
                {selectedRecipe.nutritionPerServing.sodiumMg} mg
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#556057] uppercase font-bold block">Sugars</span>
              <span className="font-mono-data text-base font-bold text-[#164530]">
                {selectedRecipe.nutritionPerServing.sugarsG} g
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#556057] uppercase font-bold block">Protein</span>
              <span className="font-mono-data text-base font-bold text-[#164530]">
                {selectedRecipe.nutritionPerServing.proteinG} g
              </span>
            </div>
          </div>

          {/* Clinical Dietitian Advice */}
          <div className="p-4 rounded-2xl bg-[#edf6ee] border border-[#bceed0] flex items-start gap-3 text-xs text-[#2f5d46]">
            <span className="material-symbols-outlined text-[#164530] text-[20px] shrink-0 mt-0.5">
              clinical_notes
            </span>
            <div>
              <strong className="block text-[#151d19] mb-0.5">Clinical Dietitian Note:</strong>
              {selectedRecipe.clinicalDietitianTip}
            </div>
          </div>

          {/* Required Ingredients Section with 1-Click Buy */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-[#151d19] uppercase tracking-wider">
                Required Multi-Supermarket Ingredients ({selectedRecipe.ingredients.length})
              </h3>

              <button
                type="button"
                onClick={() => handleAddAllIngredients(selectedRecipe)}
                className="px-4 py-2 rounded-full bg-[#164530] hover:bg-[#2f5d46] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                <span>Add All Ingredients to Basket</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {selectedRecipe.ingredients.map((ing, idx) => {
                const prod = ing.matchedProductId ? PRODUCTS.find((p) => p.id === ing.matchedProductId) : null;

                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-[#f8fbf8] border border-[#e2eae2] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#164530]"></span>
                        <span className="font-bold text-[#151d19]">{ing.name}</span>
                        <span className="text-[#556057] font-mono-data">({ing.amount})</span>
                      </div>
                      <p className="text-[11px] text-[#556057] mt-1 pl-3.5">
                        {ing.dietarySafetyNote}
                      </p>
                    </div>

                    {prod && (
                      <button
                        type="button"
                        onClick={() => onOpenProductModal(prod)}
                        className="text-[11px] font-bold text-[#164530] hover:underline cursor-pointer self-start sm:self-auto shrink-0 pl-3.5 sm:pl-0"
                      >
                        Inspect Product &rarr;
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Preparation Instructions */}
          <div>
            <h3 className="text-xs font-bold text-[#151d19] uppercase tracking-wider mb-3">
              Step-by-Step Gentle Cooking Method
            </h3>
            <ol className="space-y-3 text-xs text-[#151d19]">
              {selectedRecipe.instructions.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3 leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-[#164530] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 font-mono-data">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
