import React, { useState } from 'react';
import { DayOfWeek, ProfileState, Recipe } from '../types';
import { GROCER_OPTIONS, RECIPES } from '../data/mockData';

interface WeekPlanStepProps {
  profile: ProfileState;
  onOpenRecipeModal: (recipe: Recipe) => void;
  onOpenCart: () => void;
  onRecalibrate: () => void;
}

export const WeekPlanStep: React.FC<WeekPlanStepProps> = ({
  profile,
  onOpenRecipeModal,
  onOpenCart,
  onRecalibrate,
}) => {
  const [dayAssignments, setDayAssignments] = useState<Record<DayOfWeek, string>>({
    Mon: 'salmon-asparagus',
    Tue: 'ginger-scallion-chicken',
    Wed: 'miso-barramundi',
    Thu: 'tofu-shiitake-claypot',
    Fri: 'one-pan-chicken-sweet-potato',
    Sat: 'salmon-asparagus',
    Sun: 'tofu-shiitake-claypot',
  });

  const [swapDay, setSwapDay] = useState<DayOfWeek | null>(null);
  const [showExportSuccess, setShowExportSuccess] = useState(false);

  const currentGrocer = GROCER_OPTIONS.find((g) => g.id === profile.grocer) || GROCER_OPTIONS[0];

  const handleSwapRecipe = (day: DayOfWeek, newRecipeId: string) => {
    setDayAssignments({
      ...dayAssignments,
      [day]: newRecipeId,
    });
    setSwapDay(null);
  };

  const handleExportCart = () => {
    setShowExportSuccess(true);
    setTimeout(() => {
      setShowExportSuccess(false);
    }, 3500);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Export notification */}
      {showExportSuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#164530] text-white px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-3 text-sm font-semibold border border-[#bceed0]/40 animate-in fade-in slide-in-from-top-4">
          <span className="material-symbols-outlined text-[#bceed0] text-[22px]">shopping_cart_checkout</span>
          <span>
            Transferred 14 ingredients to your <strong>{currentGrocer.name}</strong> cart! Free Sunday delivery applied.
          </span>
        </div>
      )}

      {/* Header banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#bceed0] text-[#002113] text-xs font-bold mb-3">
            <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
            Instant AI Week 1 Blueprint Calibrated
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#151d19] tracking-tight">
            Your zero-waste dinner rhythm is set.
          </h1>
          <p className="text-sm sm:text-base text-[#414943] mt-1 max-w-2xl leading-relaxed">
            Calibrated for {profile.adults + profile.kids} pax ({profile.adults} Adults
            {profile.kids > 0 ? `, ${profile.kids} Kid` : ''}) across {profile.activeDays.length} evenings. Ingredients link sequentially so Monday’s excess becomes Tuesday & Wednesday’s hero aromatics.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onRecalibrate}
            className="px-4 py-2.5 rounded-full border border-[#dce5dd] text-xs font-bold text-[#414943] hover:text-[#151d19] hover:bg-[#edf6ee] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">tune</span>
            Edit Profile
          </button>
          <button
            type="button"
            onClick={handleExportCart}
            className="px-5 py-2.5 rounded-full bg-[#164530] hover:bg-[#2f5d46] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
            1-Click Export to {currentGrocer.name}
          </button>
        </div>
      </div>

      {/* Bento Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <div className="bg-white p-4 rounded-2xl border border-[#e2eae2] shadow-2xs">
          <span className="text-[11px] uppercase tracking-wider text-[#414943] font-bold block mb-1">
            Weekly Dinners
          </span>
          <span className="font-mono-data text-xl sm:text-2xl font-bold text-[#164530]">
            {profile.activeDays.length} Meals
          </span>
          <p className="text-[11px] text-[#414943] mt-0.5">{profile.activeDays.join(' · ')}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#e2eae2] shadow-2xs">
          <span className="text-[11px] uppercase tracking-wider text-[#414943] font-bold block mb-1">
            Zero-Waste Index
          </span>
          <span className="font-mono-data text-xl sm:text-2xl font-bold text-[#164530]">
            94.2%
          </span>
          <p className="text-[11px] text-[#414943] mt-0.5">4 shared fresh SKU links</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#e2eae2] shadow-2xs">
          <span className="text-[11px] uppercase tracking-wider text-[#414943] font-bold block mb-1">
            Avg Cook Time
          </span>
          <span className="font-mono-data text-xl sm:text-2xl font-bold text-[#9a4521]">
            23 mins
          </span>
          <p className="text-[11px] text-[#414943] mt-0.5">Under 30m weeknight guarantee</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#e2eae2] shadow-2xs">
          <span className="text-[11px] uppercase tracking-wider text-[#414943] font-bold block mb-1">
            Estimated Cost
          </span>
          <span className="font-mono-data text-xl sm:text-2xl font-bold text-[#164530]">
            ${profile.budgetMidpoint} SGD
          </span>
          <p className="text-[11px] text-[#414943] mt-0.5">At {currentGrocer.name}</p>
        </div>
      </div>

      {/* Week Meals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {profile.activeDays.map((day) => {
          const recipeId = dayAssignments[day] || 'salmon-asparagus';
          const recipe = RECIPES.find((r) => r.id === recipeId) || RECIPES[0];

          return (
            <div
              key={day}
              className="bg-white rounded-2xl border border-[#e2eae2] overflow-hidden shadow-[0_2px_12px_rgba(22,69,48,0.04)] flex flex-col justify-between group hover:shadow-md transition-shadow"
            >
              <div>
                {/* Day Header */}
                <div className="px-4 py-3 bg-[#edf6ee]/70 border-b border-[#e2eae2] flex items-center justify-between">
                  <span className="font-mono-data text-xs font-bold text-[#164530] uppercase">
                    {day} Evening
                  </span>
                  <button
                    type="button"
                    onClick={() => setSwapDay(day)}
                    className="text-[11px] font-bold text-[#9a4521] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">sync</span>
                    Swap
                  </button>
                </div>

                {/* Recipe Image */}
                <div
                  onClick={() => onOpenRecipeModal(recipe)}
                  className="relative h-44 bg-[#edf6ee] overflow-hidden cursor-pointer"
                >
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold">
                    {recipe.dishStyle}
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-[#164530] text-[11px] font-bold font-mono-data">
                    {recipe.prepMinutes} mins
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4">
                  <h3
                    onClick={() => onOpenRecipeModal(recipe)}
                    className="text-sm font-bold text-[#151d19] group-hover:text-[#164530] transition-colors cursor-pointer line-clamp-1"
                  >
                    {recipe.title}
                  </h3>
                  {recipe.subtitle && (
                    <p className="text-xs text-[#414943] line-clamp-1 mt-0.5">
                      {recipe.subtitle}
                    </p>
                  )}

                  {/* Macro indicators */}
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#edf6ee] text-[11px] font-mono-data">
                    <span className="text-[#164530] font-bold">{recipe.proteinGrams}g Protein</span>
                    <span className="text-[#c0c9c1]">·</span>
                    <span className="text-[#414943]">{recipe.calories} kcal</span>
                  </div>

                  {/* Zero-Waste Link */}
                  <div className="mt-3 p-2 rounded-lg bg-[#edf6ee]/70 text-[10px] text-[#164530] flex items-start gap-1.5 leading-snug">
                    <span className="material-symbols-outlined text-[14px] text-[#2f5d46] shrink-0 mt-0.5">
                      recycling
                    </span>
                    <span>
                      {day === 'Mon' && 'Uses lemon zest & 1/2 asparagus bunch; stems preserved for Wed.'}
                      {day === 'Tue' && 'Ginger & scallion bundle shared with Wed Barramundi.'}
                      {day === 'Wed' && 'Uses remaining scallion greens & miso paste.'}
                      {day === 'Thu' && 'Consumes remaining firm tofu and ginger root. Zero crisper waste.'}
                      {day === 'Fri' && 'Uses root vegetables & single sheet pan.'}
                      {day === 'Sat' && 'Chilled seafood fresh delivery sync.'}
                      {day === 'Sun' && 'Comforting homestyle claypot broth.'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer action */}
              <div className="p-3 border-t border-[#edf6ee] bg-[#fbfdfb]">
                <button
                  type="button"
                  onClick={() => onOpenRecipeModal(recipe)}
                  className="w-full py-1.5 text-center text-xs font-bold text-[#164530] hover:bg-[#edf6ee] rounded-lg transition-colors cursor-pointer"
                >
                  View Cooking Steps & Ingredients
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Swap Modal */}
      {swapDay && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#e2eae2]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-[#151d19]">
                Swap Recipe for {swapDay} Evening
              </h3>
              <button
                type="button"
                onClick={() => setSwapDay(null)}
                className="text-[#414943] hover:text-[#151d19] cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <p className="text-xs text-[#414943] mb-4">
              Choose an alternative chef-curated weeknight recipe that matches your diet and uses overlapping ingredients.
            </p>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {RECIPES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleSwapRecipe(swapDay, r.id)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-[#e2eae2] hover:border-[#164530] hover:bg-[#edf6ee]/50 text-left transition-colors cursor-pointer"
                >
                  <img
                    src={r.image}
                    alt={r.title}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#151d19] truncate">{r.title}</h4>
                    <p className="text-[11px] text-[#414943] truncate">{r.subtitle || r.dishStyle}</p>
                    <span className="text-[10px] text-[#164530] font-mono-data font-bold">
                      {r.prepMinutes} mins · {r.proteinGrams}g Protein
                    </span>
                  </div>
                  <span className="text-xs text-[#164530] font-bold">Select</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Zero-Waste Engine Visualization Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#e2eae2] shadow-[0_2px_12px_rgba(22,69,48,0.04)] mb-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#edf6ee] flex items-center justify-center text-[#164530] shrink-0">
            <span className="material-symbols-outlined text-[28px]">eco</span>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#151d19]">
              How The NourishMe Zero-Waste Pantry Engine Prevents Food Waste
            </h3>
            <p className="text-xs sm:text-sm text-[#414943] mt-1 leading-relaxed">
              In traditional meal planning, buying 1 bundle of scallions or fresh dill leaves 70% unused until it spoils. Our cross-day pairing algorithm schedules your week so that perishable ingredients are completely exhausted by your final active dinner night.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-[#edf6ee]">
              <div className="p-3 bg-[#edf6ee]/60 rounded-xl">
                <span className="text-xs font-bold text-[#151d19] block">1 Bunch Asparagus</span>
                <span className="text-[11px] text-[#414943] mt-0.5 block">
                  Monday Main + Wednesday Diced Frittata / Side
                </span>
              </div>
              <div className="p-3 bg-[#edf6ee]/60 rounded-xl">
                <span className="text-xs font-bold text-[#151d19] block">Old Ginger Root (60g)</span>
                <span className="text-[11px] text-[#414943] mt-0.5 block">
                  Tuesday Chicken Relish + Thursday Claypot Broth
                </span>
              </div>
              <div className="p-3 bg-[#edf6ee]/60 rounded-xl">
                <span className="text-xs font-bold text-[#151d19] block">Fresh Scallions Bundle</span>
                <span className="text-[11px] text-[#414943] mt-0.5 block">
                  Greens for relish & garnish; whites simmered in broth
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
