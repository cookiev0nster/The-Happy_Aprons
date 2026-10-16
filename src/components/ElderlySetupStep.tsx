import React from 'react';
import {
  CuisineType,
  DietaryRestriction,
  ElderlyProfileState,
  GrocerId,
  MealSlot,
  TextureLevel,
} from '../types';
import { GROCER_OPTIONS } from '../data/mockData';

interface ElderlySetupStepProps {
  profile: ElderlyProfileState;
  onUpdateProfile: (updated: Partial<ElderlyProfileState>) => void;
  onProceedToWeeklyMenu: () => void;
}

const CUISINE_OPTIONS: Array<{
  id: CuisineType;
  title: string;
  subtitle: string;
  badge: string;
}> = [
  {
    id: 'cantonese-teochew',
    title: 'Cantonese & Teochew',
    subtitle: 'Silken congee, double-boiled herbal soups, steamed threadfin & egg tofu',
    badge: 'Popular',
  },
  {
    id: 'peranakan',
    title: 'Peranakan / Nyonya Gentle',
    subtitle: 'Mild Ayam Pongteh with melting potatoes, Nonya Chap Chye, steamed fish',
    badge: 'Comforting',
  },
  {
    id: 'hainanese',
    title: 'Hainanese & Local Kopitiam',
    subtitle: 'Pasteurized soft sous-vide eggs, steamed red bean pau, poached chicken',
    badge: 'Classic',
  },
  {
    id: 'malay',
    title: 'Malay Mild & Halal',
    subtitle: 'Turmeric Soto Ayam, soft lontong rice cakes, comforting Begedil',
    badge: 'Halal',
  },
  {
    id: 'indian',
    title: 'Indian Soft Lentils & Khichdi',
    subtitle: 'Digestive Moong Dal Khichdi with gentle cumin ghee & soft spinach',
    badge: 'Ayurvedic',
  },
  {
    id: 'western',
    title: 'Western Mild & Steamed',
    subtitle: 'Dill poached salmon, smooth cauliflower mash, tender root vegetables',
    badge: 'Omega-3',
  },
];

const RESTRICTION_OPTIONS: Array<{
  id: DietaryRestriction;
  name: string;
  elderlyBenefit: string;
}> = [
  {
    id: 'low-sodium',
    name: 'Low Sodium / Heart-Friendly',
    elderlyBenefit: 'Under 350mg sodium/meal to prevent hypertension & fluid retention',
  },
  {
    id: 'diabetic-safe',
    name: 'Diabetic-Safe / Low Glycemic',
    elderlyBenefit: 'Low GI grains, monkfruit sweetening, zero blood sugar spikes',
  },
  {
    id: 'dysphagia-soft',
    name: 'Dysphagia & Swallowing Safety',
    elderlyBenefit: 'Minced, moist, or pureed textures with zero choking hazards',
  },
  {
    id: 'low-purine',
    name: 'Low Purine (Gout Safe)',
    elderlyBenefit: 'No organ meats or high-purine seafood; gentle on joints',
  },
  {
    id: 'renal-safe',
    name: 'Renal / Kidney Friendly',
    elderlyBenefit: 'Controlled potassium and phosphorus with gentle protein targets',
  },
  {
    id: 'lactose-free',
    name: 'Lactose-Free & High Calcium',
    elderlyBenefit: 'Fortified soy and calcium milks for bone osteoporosis care',
  },
  {
    id: 'halal',
    name: 'Halal Certified Ingredients',
    elderlyBenefit: '100% Halal-sourced poultry, beef, and pantry seasonings',
  },
  {
    id: 'vegetarian',
    name: 'Vegetarian / Plant-Forward',
    elderlyBenefit: 'Silken tofu, tender lentils, and digestible plant proteins',
  },
];

const TEXTURE_LEVELS: Array<{
  level: TextureLevel;
  iddsiLabel: string;
  description: string;
  example: string;
}> = [
  {
    level: 'Level 7: Easy to Chew',
    iddsiLabel: 'IDDSI Level 7',
    description: 'Normal everyday soft foods requiring minimal biting force.',
    example: 'Tender steamed fish fillet, well-cooked rice, soft braised potatoes',
  },
  {
    level: 'Level 6: Soft & Bite-Sized (15mm max)',
    iddsiLabel: 'IDDSI Level 6',
    description: 'Tender pieces ≤ 15mm; mashable with gentle fork pressure.',
    example: 'Diced silken tofu, flaked barramundi, soft lontong cubes',
  },
  {
    level: 'Level 5: Minced & Moist (4mm max)',
    iddsiLabel: 'IDDSI Level 5',
    description: 'Finely minced ≤ 4mm with moist gravy; minimal chewing required.',
    example: 'Double-minced chicken in savory sauce, soft congee, mashed squash',
  },
  {
    level: 'Level 4: Pureed & Smooth',
    iddsiLabel: 'IDDSI Level 4',
    description: 'Completely smooth, uniform consistency with zero lumps or chewing.',
    example: 'Blended cauliflower puree, smooth red bean soup, silky pumpkin gruel',
  },
];

const MEAL_SLOT_DEFS: Array<{
  slot: MealSlot;
  name: string;
  timeLabel: string;
  typicalDish: string;
}> = [
  {
    slot: 'breakfast',
    name: 'Breakfast',
    timeLabel: '7:30 AM',
    typicalDish: 'Warm Teochew Fish Porridge or Soft Half-Boiled Eggs with Pau',
  },
  {
    slot: 'lunch',
    name: 'Lunch',
    timeLabel: '12:00 PM',
    typicalDish: 'Steamed Silken Egg Tofu with Minced Chicken or Herbal Barramundi',
  },
  {
    slot: 'dinner',
    name: 'Dinner',
    timeLabel: '6:00 PM',
    typicalDish: 'Double-Boiled Old Cucumber Soup or Poached Salmon with Cauliflower Mash',
  },
  {
    slot: 'supper',
    name: 'Supper',
    timeLabel: '8:30 PM',
    typicalDish: 'Warm Red Bean Soup (Monkfruit) or Fortified Soya Milk with Tau Kee',
  },
];

export const ElderlySetupStep: React.FC<ElderlySetupStepProps> = ({
  profile,
  onUpdateProfile,
  onProceedToWeeklyMenu,
}) => {
  const handleToggleCuisine = (cuisine: CuisineType) => {
    const exists = profile.primaryCuisines.includes(cuisine);
    let next: CuisineType[];
    if (exists) {
      if (profile.primaryCuisines.length > 1) {
        next = profile.primaryCuisines.filter((c) => c !== cuisine);
      } else {
        return; // keep at least 1
      }
    } else {
      next = [...profile.primaryCuisines, cuisine];
    }
    onUpdateProfile({ primaryCuisines: next });
  };

  const handleToggleRestriction = (res: DietaryRestriction) => {
    const exists = profile.restrictions.includes(res);
    const next = exists
      ? profile.restrictions.filter((r) => r !== res)
      : [...profile.restrictions, res];
    onUpdateProfile({ restrictions: next });
  };

  const handleToggleMealSlot = (slot: MealSlot) => {
    const exists = profile.activeMealSlots.includes(slot);
    let next: MealSlot[];
    if (exists) {
      if (profile.activeMealSlots.length > 1) {
        next = profile.activeMealSlots.filter((s) => s !== slot);
      } else {
        return; // maintain at least 1 meal
      }
    } else {
      const order: MealSlot[] = ['breakfast', 'lunch', 'dinner', 'supper'];
      next = [...profile.activeMealSlots, slot].sort(
        (a, b) => order.indexOf(a) - order.indexOf(b)
      );
    }
    onUpdateProfile({ activeMealSlots: next });
  };

  // Budget calculations
  const mealsPerDayCount = profile.activeMealSlots.length;
  const daysPerWeek = profile.activeDays.length;
  const weeklyMealsTotal = profile.elderlyCount * mealsPerDayCount * daysPerWeek;
  const estimatedWeeklySpendSgd = (weeklyMealsTotal * profile.budgetPerMeal).toFixed(2);
  const dailySpendPerElderly = (mealsPerDayCount * profile.budgetPerMeal).toFixed(2);

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Editorial Header */}
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <span className="text-xs uppercase tracking-wider text-[#164530] font-bold block mb-2">
          Elderly Care & Nutrition Parameters
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#151d19] tracking-tight text-balance">
          Tailor meals for the health, dignity, and joy of your elders.
        </h1>
        <p className="text-sm sm:text-base text-[#414943] mt-2 leading-relaxed">
          Configure family senior count, favorite Singapore cuisines, texture IDDSI levels, meal intervals, and budget. Our platform scales exact ingredient grams and links directly to Singapore supermarkets.
        </p>
      </div>

      <div className="space-y-10">
        {/* SECTION 1: Number of Elderly */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e2eae2] shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#edf6ee]">
            <div>
              <h2 className="text-lg font-bold text-[#151d19]">
                1. Number of Elderly in Household
              </h2>
              <p className="text-xs sm:text-sm text-[#414943] mt-0.5">
                Recipe ingredient weights, deboning instructions, and grocery quantities will dynamically scale for this count.
              </p>
            </div>
            <div className="flex items-center gap-3 self-start sm:self-auto">
              <button
                type="button"
                onClick={() =>
                  onUpdateProfile({ elderlyCount: Math.max(1, profile.elderlyCount - 1) })
                }
                disabled={profile.elderlyCount <= 1}
                aria-label="Decrease elderly count"
                className="w-10 h-10 rounded-full border border-[#dce5dd] flex items-center justify-center text-[#151d19] hover:bg-[#edf6ee] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">remove</span>
              </button>
              <div className="min-w-[60px] text-center">
                <span className="font-mono-data text-2xl font-bold text-[#164530] tabular-nums">
                  {profile.elderlyCount}
                </span>
                <span className="block text-[11px] text-[#414943] font-medium">
                  {profile.elderlyCount === 1 ? 'Senior' : 'Seniors'}
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  onUpdateProfile({ elderlyCount: Math.min(8, profile.elderlyCount + 1) })
                }
                disabled={profile.elderlyCount >= 8}
                aria-label="Increase elderly count"
                className="w-10 h-10 rounded-full border border-[#dce5dd] flex items-center justify-center text-[#151d19] hover:bg-[#edf6ee] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
              </button>
            </div>
          </div>

          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => onUpdateProfile({ elderlyCount: count })}
                className={`py-3 px-4 rounded-xl text-left border transition-all cursor-pointer ${
                  profile.elderlyCount === count
                    ? 'border-[#164530] bg-[#edf6ee] text-[#164530]'
                    : 'border-[#e2eae2] hover:border-[#164530]/40 text-[#414943]'
                }`}
              >
                <span className="text-xs font-bold block">
                  {count === 1 && 'Solo Senior (1 Pax)'}
                  {count === 2 && 'Couple Seniors (2 Pax)'}
                  {count === 3 && '3 Seniors / Extended'}
                  {count === 4 && '4+ Seniors Household'}
                </span>
                <span className="text-[11px] text-[#414943] mt-0.5 block">
                  {count === 1
                    ? 'Single-pot waste prevention'
                    : `Scaled for ${count} elders & helpers`}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* SECTION 2: Type of Cuisine */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e2eae2] shadow-2xs">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#151d19]">
              2. Preferred Singapore Cuisines
            </h2>
            <p className="text-xs sm:text-sm text-[#414943] mt-0.5">
              Select one or multiple styles to keep weekly meals familiar, appetizing, and nostalgic for elders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CUISINE_OPTIONS.map((c) => {
              const selected = profile.primaryCuisines.includes(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleToggleCuisine(c.id)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selected
                      ? 'border-[#164530] bg-[#edf6ee]/80 text-[#151d19]'
                      : 'border-[#e2eae2] hover:border-[#164530]/40 bg-white text-[#414943]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-bold text-sm text-[#151d19]">{c.title}</span>
                      <span className="text-[10px] font-semibold text-[#164530] bg-[#bceed0]/50 px-2 py-0.5 rounded">
                        {c.badge}
                      </span>
                    </div>
                    <p className="text-xs text-[#414943] leading-relaxed">{c.subtitle}</p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-[#dce5dd]/40 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-[#164530]">
                      {selected ? 'Included in Menu' : '+ Add to Menu'}
                    </span>
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                        selected
                          ? 'bg-[#164530] border-[#164530] text-white'
                          : 'border-[#414943]/40'
                      }`}
                    >
                      {selected && '✓'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* SECTION 3: Dietary Restrictions & Swallowing Texture */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e2eae2] shadow-2xs">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#151d19]">
              3. Dietary Restrictions & Texture Calibration
            </h2>
            <p className="text-xs sm:text-sm text-[#414943] mt-0.5">
              Select health considerations and choose appropriate International Dysphagia Diet Standardisation Initiative (IDDSI) texture levels.
            </p>
          </div>

          {/* Texture selector */}
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#164530] block mb-3">
              Chewing & Swallowing Texture (IDDSI Standard)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {TEXTURE_LEVELS.map((t) => {
                const active = profile.textureLevel === t.level;
                return (
                  <button
                    key={t.level}
                    type="button"
                    onClick={() => onUpdateProfile({ textureLevel: t.level })}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      active
                        ? 'border-[#164530] bg-[#164530] text-white shadow-xs'
                        : 'border-[#e2eae2] hover:border-[#164530]/40 bg-white text-[#151d19]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider ${
                          active ? 'text-[#bceed0]' : 'text-[#164530]'
                        }`}
                      >
                        {t.iddsiLabel}
                      </span>
                      {active && <span className="text-xs text-[#bceed0]">Active</span>}
                    </div>
                    <span className="font-bold text-xs block mb-1">{t.level.split(':')[1]}</span>
                    <p
                      className={`text-[11px] leading-snug ${
                        active ? 'text-white/80' : 'text-[#414943]'
                      }`}
                    >
                      {t.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Health Dietary restrictions */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#164530] block mb-3">
              Chronic Condition & Health Guardrails
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {RESTRICTION_OPTIONS.map((r) => {
                const checked = profile.restrictions.includes(r.id);
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleToggleRestriction(r.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start justify-between gap-2 ${
                      checked
                        ? 'border-[#164530] bg-[#edf6ee] text-[#151d19]'
                        : 'border-[#e2eae2] hover:border-[#164530]/30 bg-white text-[#414943]'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-xs text-[#151d19] block mb-0.5">
                        {r.name}
                      </span>
                      <span className="text-[11px] text-[#414943] leading-snug block">
                        {r.elderlyBenefit}
                      </span>
                    </div>
                    <span
                      className={`w-4 h-4 shrink-0 rounded border flex items-center justify-center text-[10px] mt-0.5 ${
                        checked
                          ? 'bg-[#164530] border-[#164530] text-white'
                          : 'border-[#414943]/40'
                      }`}
                    >
                      {checked && '✓'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 4: Meals a Day (Breakfast, Lunch, Dinner, Supper) */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e2eae2] shadow-2xs">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#151d19]">
              4. Daily Meal Frequency & Intervals
            </h2>
            <p className="text-xs sm:text-sm text-[#414943] mt-0.5">
              Select which meals to plan each day (Breakfast, Lunch, Dinner, Supper). Many Singapore seniors benefit from a warm, calming supper nightcap to support hydration and sleep.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MEAL_SLOT_DEFS.map((m) => {
              const active = profile.activeMealSlots.includes(m.slot);
              return (
                <button
                  key={m.slot}
                  type="button"
                  onClick={() => handleToggleMealSlot(m.slot)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    active
                      ? 'border-[#164530] bg-[#edf6ee] text-[#151d19]'
                      : 'border-[#e2eae2] hover:border-[#164530]/30 bg-white text-[#414943] opacity-65'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-[#151d19]">{m.name}</span>
                      <span className="font-mono-data text-xs text-[#164530] font-semibold bg-[#bceed0]/40 px-2 py-0.5 rounded">
                        {m.timeLabel}
                      </span>
                    </div>
                    <p className="text-xs text-[#414943] leading-relaxed">{m.typicalDish}</p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-[#dce5dd]/50 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#164530]">
                      {active ? 'Planned in Menu' : 'Disabled'}
                    </span>
                    <span
                      className={`w-5 h-5 rounded-md border flex items-center justify-center text-xs ${
                        active
                          ? 'bg-[#164530] border-[#164530] text-white'
                          : 'border-[#414943]/40'
                      }`}
                    >
                      {active && '✓'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* SECTION 5: Budget per Meal & Supermarket Selection */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e2eae2] shadow-2xs">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#151d19]">
              5. Budget per Meal & Singapore Supermarket Partner
            </h2>
            <p className="text-xs sm:text-sm text-[#414943] mt-0.5">
              Control food expenditure per elder while generating direct cart links to your preferred Singapore grocer.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Budget Slider */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="budget-slider"
                  className="text-xs font-bold uppercase tracking-wider text-[#414943]"
                >
                  Budget per Elder per Meal (SGD)
                </label>
                <span className="font-mono-data text-2xl font-bold text-[#164530] tabular-nums">
                  ${profile.budgetPerMeal.toFixed(2)} SGD
                </span>
              </div>

              <input
                id="budget-slider"
                type="range"
                min="3.00"
                max="12.00"
                step="0.50"
                value={profile.budgetPerMeal}
                onChange={(e) =>
                  onUpdateProfile({ budgetPerMeal: parseFloat(e.target.value) })
                }
                className="w-full accent-[#164530] cursor-pointer"
              />

              <div className="flex justify-between text-[11px] text-[#414943] font-medium">
                <span>$3.00 (Economy / Congee & Dal)</span>
                <span>$6.00 (Standard / Threadfin & Tofu)</span>
                <span>$12.00 (Premium / Wild Salmon & Kühlbarra)</span>
              </div>

              {/* Real-time Budget Metrics */}
              <div className="p-4 rounded-xl bg-[#edf6ee] border border-[#dce5dd] grid grid-cols-3 gap-2 text-center mt-4">
                <div>
                  <span className="text-[10px] uppercase text-[#414943] font-semibold block">
                    Daily / Elder
                  </span>
                  <span className="font-mono-data text-sm font-bold text-[#164530]">
                    ${dailySpendPerElderly}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#414943] font-semibold block">
                    Total Meals / Wk
                  </span>
                  <span className="font-mono-data text-sm font-bold text-[#164530]">
                    {weeklyMealsTotal} meals
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#414943] font-semibold block">
                    Est. Weekly Groceries
                  </span>
                  <span className="font-mono-data text-sm font-bold text-[#9a4521]">
                    ${estimatedWeeklySpendSgd}
                  </span>
                </div>
              </div>
            </div>

            {/* Singapore Grocer Selection */}
            <div className="lg:col-span-6 space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[#414943] block">
                Primary Online Supermarket in Singapore
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {GROCER_OPTIONS.map((g) => {
                  const isSelected = profile.selectedGrocer === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => onUpdateProfile({ selectedGrocer: g.id })}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#164530] bg-[#edf6ee] text-[#151d19]'
                          : 'border-[#e2eae2] hover:border-[#164530]/30 bg-white text-[#414943]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-[#151d19]">{g.name}</span>
                        <span
                          className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[9px] ${
                            isSelected
                              ? 'bg-[#164530] border-[#164530] text-white'
                              : 'border-[#414943]/40'
                          }`}
                        >
                          {isSelected && '✓'}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#414943] block leading-tight">
                        {g.tagline}
                      </span>
                      <span className="text-[10px] text-[#164530] font-medium mt-1 block">
                        Free delivery over ${g.freeDeliveryThreshold}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Action Button: Proceed to Generate Weekly Menus */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-[#164530] text-white">
          <div>
            <h3 className="text-base sm:text-lg font-bold">
              Ready to generate your {profile.elderlyCount}-elderly weekly meal schedule?
            </h3>
            <p className="text-xs sm:text-sm text-white/80 mt-0.5">
              Calibrated for {profile.activeMealSlots.length} meals daily with{' '}
              {profile.textureLevel.split(':')[0]} texture guidance and {profile.primaryCuisines.length}{' '}
              cuisines.
            </p>
          </div>
          <button
            type="button"
            onClick={onProceedToWeeklyMenu}
            className="px-6 py-3 rounded-xl bg-[#bceed0] hover:bg-[#a0d2b5] text-[#002113] text-sm font-bold shadow-md hover:shadow-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-2"
          >
            <span>Generate Full Week Menu</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
