import React, { useState } from 'react';
import { DayOfWeek, ElderlyProfileState, MealSlot, Recipe } from '../types';
import { ELDERLY_RECIPES, GROCER_OPTIONS } from '../data/mockData';

interface ElderlyWeekPlanStepProps {
  profile: ElderlyProfileState;
  onOpenRecipeModal: (recipe: Recipe) => void;
  onOpenCart: () => void;
  onNavigateToSetup: () => void;
}

const DAYS_OF_WEEK: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const ElderlyWeekPlanStep: React.FC<ElderlyWeekPlanStepProps> = ({
  profile,
  onOpenRecipeModal,
  onOpenCart,
  onNavigateToSetup,
}) => {
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Mon');
  const [viewMode, setViewMode] = useState<'day-focus' | 'weekly-matrix'>('day-focus');
  const [activeSlotFilter, setActiveSlotFilter] = useState<MealSlot | 'all'>('all');
  const [swapTarget, setSwapTarget] = useState<{ day: DayOfWeek; slot: MealSlot } | null>(null);

  // Default initial schedule mapping
  const [schedule, setSchedule] = useState<Record<DayOfWeek, Record<MealSlot, string>>>({
    Mon: {
      breakfast: 'teochew-fish-porridge',
      lunch: 'steamed-silken-egg-tofu',
      dinner: 'double-boiled-cucumber-soup',
      supper: 'warm-red-bean-soup',
    },
    Tue: {
      breakfast: 'soft-pumpkin-chicken-congee',
      lunch: 'steamed-herbal-barramundi',
      dinner: 'tofu-shiitake-claypot',
      supper: 'warm-soya-gingko',
    },
    Wed: {
      breakfast: 'soft-eggs-steamed-pau',
      lunch: 'gentle-ayam-pongteh',
      dinner: 'poached-salmon-cauliflower',
      supper: 'warm-red-bean-soup',
    },
    Thu: {
      breakfast: 'teochew-fish-porridge',
      lunch: 'mild-soto-ayam',
      dinner: 'moong-dal-khichdi',
      supper: 'warm-soya-gingko',
    },
    Fri: {
      breakfast: 'soft-pumpkin-chicken-congee',
      lunch: 'steamed-silken-egg-tofu',
      dinner: 'double-boiled-cucumber-soup',
      supper: 'warm-red-bean-soup',
    },
    Sat: {
      breakfast: 'soft-eggs-steamed-pau',
      lunch: 'steamed-herbal-barramundi',
      dinner: 'poached-salmon-cauliflower',
      supper: 'warm-soya-gingko',
    },
    Sun: {
      breakfast: 'teochew-fish-porridge',
      lunch: 'gentle-ayam-pongteh',
      dinner: 'tofu-shiitake-claypot',
      supper: 'warm-red-bean-soup',
    },
  });

  const currentGrocer =
    GROCER_OPTIONS.find((g) => g.id === profile.selectedGrocer) || GROCER_OPTIONS[0];

  const getRecipeById = (id: string): Recipe => {
    return ELDERLY_RECIPES.find((r) => r.id === id) || ELDERLY_RECIPES[0];
  };

  const handleSwapRecipe = (day: DayOfWeek, slot: MealSlot, newRecipeId: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [slot]: newRecipeId,
      },
    }));
    setSwapTarget(null);
  };

  // Compute daily totals for currently selected day
  const dailyMeals = profile.activeMealSlots.map((slot) => {
    const recipeId = schedule[selectedDay]?.[slot] || ELDERLY_RECIPES[0].id;
    return {
      slot,
      recipe: getRecipeById(recipeId),
    };
  });

  const dailyCalories = dailyMeals.reduce((acc, m) => acc + m.recipe.elderlyNutrition.calories, 0);
  const dailyProtein = dailyMeals.reduce((acc, m) => acc + m.recipe.elderlyNutrition.proteinGrams, 0);
  const dailyCalcium = dailyMeals.reduce((acc, m) => acc + m.recipe.elderlyNutrition.calciumMg, 0);
  const dailySodium = dailyMeals.reduce((acc, m) => acc + m.recipe.elderlyNutrition.sodiumMg, 0);
  const dailyCostPerElderly = dailyMeals.reduce((acc, m) => acc + m.recipe.estimatedCostPerPaxSgd, 0);
  const dailyHouseholdTotal = (dailyCostPerElderly * profile.elderlyCount).toFixed(2);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Top Banner & Caregiver Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#e2eae2] mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#164530] font-bold mb-2">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>Weekly Calibrated Schedule · Singapore Elder Care Standards</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#151d19] tracking-tight">
            Nourishing 7-Day Meal Schedule
          </h1>
          <p className="text-xs sm:text-sm text-[#414943] mt-1 max-w-2xl leading-relaxed">
            Calibrated for {profile.elderlyCount} {profile.elderlyCount === 1 ? 'elderly' : 'elders'} across {profile.activeMealSlots.length} daily meal intervals. All meals meet {profile.textureLevel.split(':')[0]} texture specifications with strict low-sodium standards.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center bg-[#edf6ee] p-1 rounded-xl border border-[#dce5dd]">
            <button
              type="button"
              onClick={() => setViewMode('day-focus')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                viewMode === 'day-focus'
                  ? 'bg-white text-[#164530] shadow-xs'
                  : 'text-[#414943] hover:text-[#151d19]'
              }`}
            >
              Day Detail
            </button>
            <button
              type="button"
              onClick={() => setViewMode('weekly-matrix')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                viewMode === 'weekly-matrix'
                  ? 'bg-white text-[#164530] shadow-xs'
                  : 'text-[#414943] hover:text-[#151d19]'
              }`}
            >
              Full Week Matrix
            </button>
          </div>

          <button
            type="button"
            onClick={onNavigateToSetup}
            className="px-3.5 py-2 rounded-xl border border-[#dce5dd] text-xs font-bold text-[#414943] hover:bg-[#edf6ee] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span>Edit Elders Setup</span>
          </button>

          <button
            type="button"
            onClick={onOpenCart}
            className="px-4 py-2 rounded-xl bg-[#164530] hover:bg-[#23583f] text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
            <span>View {currentGrocer.name} Basket</span>
          </button>
        </div>
      </div>

      {/* Day Selector Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        {DAYS_OF_WEEK.map((day) => {
          const isSelected = selectedDay === day;
          return (
            <button
              key={day}
              type="button"
              onClick={() => setSelectedDay(day)}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                isSelected
                  ? 'bg-[#164530] text-white shadow-xs'
                  : 'bg-white text-[#414943] hover:bg-[#edf6ee] border border-[#e2eae2]'
              }`}
            >
              <span>{day === 'Mon' ? 'Monday' : day === 'Tue' ? 'Tuesday' : day === 'Wed' ? 'Wednesday' : day === 'Thu' ? 'Thursday' : day === 'Fri' ? 'Friday' : day === 'Sat' ? 'Saturday' : 'Sunday'}</span>
            </button>
          );
        })}
      </div>

      {/* VIEW MODE 1: DAY FOCUS (Rich Cards for Breakfast, Lunch, Dinner, Supper) */}
      {viewMode === 'day-focus' && (
        <div className="space-y-8">
          {/* Day Nutritional KPI Strip */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e2eae2] shadow-2xs grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#414943] block">
                Total Daily Energy
              </span>
              <span className="font-mono-data text-xl sm:text-2xl font-bold text-[#164530]">
                {dailyCalories} kcal
              </span>
              <span className="text-[11px] text-[#414943] block mt-0.5">Optimal for sedentary senior</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#414943] block">
                Bioavailable Protein
              </span>
              <span className="font-mono-data text-xl sm:text-2xl font-bold text-[#164530]">
                {dailyProtein}g
              </span>
              <span className="text-[11px] text-[#414943] block mt-0.5">Sarcopenia defense target</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#414943] block">
                Bone Calcium
              </span>
              <span className="font-mono-data text-xl sm:text-2xl font-bold text-[#164530]">
                {dailyCalcium}mg
              </span>
              <span className="text-[11px] text-[#414943] block mt-0.5">Osteoporosis support</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#414943] block">
                Controlled Sodium
              </span>
              <span className="font-mono-data text-xl sm:text-2xl font-bold text-[#164530]">
                {dailySodium}mg
              </span>
              <span className="text-[11px] text-[#414943] block mt-0.5">Well under 1500mg DASH cap</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#414943] block">
                Est. Day Cost ({profile.elderlyCount} Pax)
              </span>
              <span className="font-mono-data text-xl sm:text-2xl font-bold text-[#9a4521]">
                ${dailyHouseholdTotal} SGD
              </span>
              <span className="text-[11px] text-[#414943] block mt-0.5">
                (${dailyCostPerElderly.toFixed(2)}/elder)
              </span>
            </div>
          </div>

          {/* Meal Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {profile.activeMealSlots.map((slot) => {
              const recipeId = schedule[selectedDay]?.[slot] || ELDERLY_RECIPES[0].id;
              const recipe = getRecipeById(recipeId);

              const slotTitle =
                slot === 'breakfast'
                  ? 'Breakfast (7:30 AM)'
                  : slot === 'lunch'
                  ? 'Lunch (12:00 PM)'
                  : slot === 'dinner'
                  ? 'Dinner (6:00 PM)'
                  : 'Supper (8:30 PM Nightcap)';

              return (
                <div
                  key={slot}
                  className="bg-white rounded-2xl border border-[#e2eae2] overflow-hidden shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Header bar */}
                    <div className="px-4 py-2.5 bg-[#edf6ee]/70 border-b border-[#e2eae2] flex items-center justify-between">
                      <span className="text-xs font-bold text-[#164530] uppercase tracking-wider">
                        {slotTitle}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSwapTarget({ day: selectedDay, slot })}
                        className="text-[11px] font-semibold text-[#164530] hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[13px]">swap_horiz</span>
                        <span>Swap</span>
                      </button>
                    </div>

                    {/* Image with fallback */}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => onOpenRecipeModal(recipe)}
                      onKeyDown={(e) => e.key === 'Enter' && onOpenRecipeModal(recipe)}
                      className="relative h-44 w-full overflow-hidden bg-slate-100 cursor-pointer"
                    >
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                        onError={(e) => {
                          // Styled fallback container on error
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        {recipe.textureLevel.split(':')[0]}
                      </div>
                      <div className="absolute bottom-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-[#151d19] font-mono-data text-xs font-bold px-2 py-0.5 rounded shadow-xs">
                        ~{recipe.prepMinutes} mins
                      </div>
                    </div>

                    {/* Card Body */}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => onOpenRecipeModal(recipe)}
                      onKeyDown={(e) => e.key === 'Enter' && onOpenRecipeModal(recipe)}
                      className="p-4 cursor-pointer"
                    >
                      <div className="flex items-center gap-2 text-xs text-[#414943] mb-1">
                        <span>{recipe.cuisine.toUpperCase()}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono-data text-[#164530] font-bold">
                          ${(recipe.estimatedCostPerPaxSgd * profile.elderlyCount).toFixed(2)} SGD for{' '}
                          {profile.elderlyCount}pax
                        </span>
                      </div>

                      <h3 className="font-bold text-base text-[#151d19] group-hover:text-[#164530] transition-colors leading-snug">
                        {recipe.title}
                      </h3>
                      {recipe.chineseTitle && (
                        <span className="text-xs text-[#414943] block mt-0.5 font-medium">
                          {recipe.chineseTitle}
                        </span>
                      )}

                      <p className="text-xs text-[#414943] mt-2 line-clamp-2 leading-relaxed">
                        {recipe.subtitle}
                      </p>

                      {/* Caregiver Texture/Safety highlight */}
                      <div className="mt-3 p-2.5 rounded-lg bg-[#f3fcf3] border border-[#bceed0]/60 text-[11px] text-[#164530] leading-snug">
                        <strong className="font-bold block mb-0.5">Caregiver Safety Tip:</strong>
                        {recipe.caregiverTips.swallowingSafetyTip}
                      </div>

                      {/* Scaled Ingredients Preview */}
                      <div className="mt-3 pt-3 border-t border-[#edf6ee]">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#414943] block mb-1.5">
                          Scaled for {profile.elderlyCount} {profile.elderlyCount === 1 ? 'elder' : 'elders'}:
                        </span>
                        <ul className="text-xs text-[#414943] space-y-1">
                          {recipe.ingredients.slice(0, 3).map((ing, i) => (
                            <li key={i} className="flex justify-between items-center text-[11px]">
                              <span className="truncate pr-2">{ing.name}</span>
                              <span className="font-mono-data font-bold text-[#164530] shrink-0">
                                {ing.baseAmountPerPax * profile.elderlyCount}
                                {ing.unit}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="p-4 pt-0">
                    <button
                      type="button"
                      onClick={() => onOpenRecipeModal(recipe)}
                      className="w-full py-2 rounded-xl border border-[#dce5dd] text-xs font-bold text-[#164530] hover:bg-[#edf6ee] transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span>View Full Menu & Supermarket Link</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW MODE 2: FULL WEEK MATRIX */}
      {viewMode === 'weekly-matrix' && (
        <div className="bg-white rounded-2xl border border-[#e2eae2] overflow-x-auto shadow-2xs">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[#edf6ee] border-b border-[#e2eae2]">
                <th className="py-3.5 px-4 text-xs font-bold text-[#164530] uppercase tracking-wider w-32">
                  Day
                </th>
                {profile.activeMealSlots.map((slot) => (
                  <th
                    key={slot}
                    className="py-3.5 px-4 text-xs font-bold text-[#164530] uppercase tracking-wider"
                  >
                    {slot === 'breakfast'
                      ? 'Breakfast'
                      : slot === 'lunch'
                      ? 'Lunch'
                      : slot === 'dinner'
                      ? 'Dinner'
                      : 'Supper'}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2eae2]">
              {DAYS_OF_WEEK.map((day) => (
                <tr key={day} className="hover:bg-[#f3fcf3]/60 transition-colors">
                  <td className="py-4 px-4 font-bold text-sm text-[#151d19] align-top bg-[#edf6ee]/30">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDay(day);
                        setViewMode('day-focus');
                      }}
                      className="text-left hover:text-[#164530] cursor-pointer"
                    >
                      <span className="block text-sm font-bold text-[#151d19]">{day}</span>
                      <span className="text-[10px] text-[#164530] font-medium block">Open Day</span>
                    </button>
                  </td>
                  {profile.activeMealSlots.map((slot) => {
                    const recipeId = schedule[day]?.[slot] || ELDERLY_RECIPES[0].id;
                    const recipe = getRecipeById(recipeId);
                    return (
                      <td key={slot} className="py-3 px-4 align-top">
                        <button
                          type="button"
                          onClick={() => onOpenRecipeModal(recipe)}
                          className="w-full text-left p-2.5 rounded-lg border border-[#e2eae2] bg-white hover:border-[#164530] transition-all cursor-pointer group"
                        >
                          <span className="text-[10px] font-bold text-[#164530] block">
                            {recipe.textureLevel.split(':')[0]}
                          </span>
                          <span className="font-bold text-xs text-[#151d19] group-hover:text-[#164530] block truncate mt-0.5">
                            {recipe.title}
                          </span>
                          <span className="text-[11px] text-[#414943] block mt-1">
                            ${(recipe.estimatedCostPerPaxSgd * profile.elderlyCount).toFixed(2)} SGD · ~
                            {recipe.prepMinutes}m
                          </span>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SWAP RECIPE MODAL */}
      {swapTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#e2eae2] mb-4">
              <div>
                <h3 className="font-bold text-lg text-[#151d19]">
                  Swap {swapTarget.slot.toUpperCase()} Recipe for {swapTarget.day}
                </h3>
                <p className="text-xs text-[#414943]">
                  Select an alternate elderly-safe recipe from our nutrition library.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSwapTarget(null)}
                className="w-8 h-8 rounded-full border border-[#dce5dd] flex items-center justify-center text-[#414943] hover:bg-[#edf6ee] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {ELDERLY_RECIPES.filter((r) => r.mealSlot === swapTarget.slot).map((alt) => (
                <button
                  key={alt.id}
                  type="button"
                  onClick={() => handleSwapRecipe(swapTarget.day, swapTarget.slot, alt.id)}
                  className="w-full text-left p-3.5 rounded-xl border border-[#e2eae2] hover:border-[#164530] hover:bg-[#edf6ee]/50 transition-all flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={alt.image}
                      alt={alt.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <span className="font-bold text-sm text-[#151d19] block">{alt.title}</span>
                      <span className="text-xs text-[#414943] block">
                        {alt.textureLevel.split(':')[0]} · ~{alt.prepMinutes}m · $
                        {alt.estimatedCostPerPaxSgd} SGD/pax
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#164530] bg-[#bceed0]/50 px-2.5 py-1 rounded-md">
                    Select
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
