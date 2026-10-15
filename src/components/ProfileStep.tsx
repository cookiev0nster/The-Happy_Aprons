import React, { useState } from 'react';
import { DayOfWeek, DishStyle, GrocerId, ProfileState, Recipe } from '../types';
import { GROCER_OPTIONS, RECIPES } from '../data/mockData';

interface ProfileStepProps {
  profile: ProfileState;
  onUpdateProfile: (updated: Partial<ProfileState>) => void;
  onSaveAndGenerate: () => void;
  onOpenRecipeModal: (recipe: Recipe) => void;
}

export const ProfileStep: React.FC<ProfileStepProps> = ({
  profile,
  onUpdateProfile,
  onSaveAndGenerate,
  onOpenRecipeModal,
}) => {
  const [dislikeInput, setDislikeInput] = useState('');
  const [showSaveToast, setShowSaveToast] = useState(false);

  // Derive dynamic AI recipe preview based on profile filters
  const getMatchingPreviewRecipe = (): Recipe => {
    if (profile.eatingStyles.includes('Plant-Forward / Flexitarian')) {
      const found = RECIPES.find((r) => r.id === 'tofu-shiitake-claypot');
      if (found) return found;
    }
    if (profile.eatingStyles.includes('Pescatarian')) {
      const found = RECIPES.find((r) => r.id === 'miso-barramundi' || r.id === 'salmon-asparagus');
      if (found) return found;
    }
    if (profile.dishStyle === '3-Dish Family Feast') {
      const found = RECIPES.find((r) => r.id === 'tofu-shiitake-claypot');
      if (found) return found;
    }
    if (profile.dishStyle === '1-Dish Wonder') {
      const found = RECIPES.find((r) => r.id === 'one-pan-chicken-sweet-potato');
      if (found) return found;
    }
    if (profile.eatingStyles.includes('High Protein (35g+)') && profile.allergies.includes('Gluten-Free')) {
      const found = RECIPES.find((r) => r.id === 'salmon-asparagus');
      if (found) return found;
    }
    return RECIPES[0];
  };

  const previewRecipe = getMatchingPreviewRecipe();

  // Presets handler
  const handleSelectPreset = (preset: 'solo' | 'couples' | 'small-family' | 'big-table') => {
    if (preset === 'solo') {
      onUpdateProfile({ adults: 1, kids: 0, activePreset: 'solo' });
    } else if (preset === 'couples') {
      onUpdateProfile({ adults: 2, kids: 0, activePreset: 'couples' });
    } else if (preset === 'small-family') {
      onUpdateProfile({ adults: 2, kids: 1, activePreset: 'small-family' });
    } else if (preset === 'big-table') {
      onUpdateProfile({ adults: 4, kids: 2, activePreset: 'big-table' });
    }
  };

  // Adjust adult/kid counters
  const handleAdjustCount = (type: 'adults' | 'kids', delta: number) => {
    if (type === 'adults') {
      const newCount = Math.max(1, profile.adults + delta);
      onUpdateProfile({ adults: newCount, activePreset: 'custom' });
    } else {
      const newCount = Math.max(0, profile.kids + delta);
      onUpdateProfile({ kids: newCount, activePreset: 'custom' });
    }
  };

  // Toggle day
  const handleToggleDay = (day: DayOfWeek) => {
    let nextDays: DayOfWeek[];
    if (profile.activeDays.includes(day)) {
      if (profile.activeDays.length > 1) {
        nextDays = profile.activeDays.filter((d) => d !== day);
      } else {
        return; // maintain at least 1 day
      }
    } else {
      const order: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      nextDays = [...profile.activeDays, day].sort(
        (a, b) => order.indexOf(a) - order.indexOf(b)
      );
    }
    onUpdateProfile({ activeDays: nextDays });
  };

  const handleResetDays = () => {
    onUpdateProfile({ activeDays: ['Mon', 'Tue', 'Wed', 'Thu'] });
  };

  // Toggle Pacing tag
  const handleTogglePacing = (tag: string) => {
    const exists = profile.pacingConstraints.includes(tag);
    const updated = exists
      ? profile.pacingConstraints.filter((t) => t !== tag)
      : [...profile.pacingConstraints, tag];
    onUpdateProfile({ pacingConstraints: updated });
  };

  // Toggle Diet Style
  const handleToggleDiet = (diet: string) => {
    const exists = profile.eatingStyles.includes(diet);
    const updated = exists
      ? profile.eatingStyles.filter((d) => d !== diet)
      : [...profile.eatingStyles, diet];
    onUpdateProfile({ eatingStyles: updated });
  };

  // Toggle Allergy
  const handleToggleAllergy = (allergy: string) => {
    const exists = profile.allergies.includes(allergy);
    const updated = exists
      ? profile.allergies.filter((a) => a !== allergy)
      : [...profile.allergies, allergy];
    onUpdateProfile({ allergies: updated });
  };

  // Add Dislike
  const handleAddDislike = () => {
    const clean = dislikeInput.trim();
    if (!clean) return;
    const formatted = clean.toLowerCase().startsWith('no ') ? clean : `No ${clean}`;
    if (!profile.dislikes.includes(formatted)) {
      onUpdateProfile({ dislikes: [...profile.dislikes, formatted] });
    }
    setDislikeInput('');
  };

  const handleRemoveDislike = (dislike: string) => {
    onUpdateProfile({ dislikes: profile.dislikes.filter((d) => d !== dislike) });
  };

  // Budget calculations
  const budgetMin = Math.round(profile.budgetMidpoint * 0.9);
  const budgetMax = Math.round(profile.budgetMidpoint * 1.15);
  const totalPax = profile.adults + profile.kids * 0.6;
  const totalMeals = totalPax * profile.activeDays.length;
  const costPerMeal = totalMeals > 0 ? (profile.budgetMidpoint / totalMeals).toFixed(0) : '11';

  const formatDaysSummary = (days: DayOfWeek[]) => {
    if (days.length === 4 && days.includes('Mon') && days.includes('Tue') && days.includes('Wed') && days.includes('Thu')) {
      return 'Mon–Thu';
    }
    return days.join(', ');
  };

  return (
    <div className="w-full">
      {/* Toast Notification when saved */}
      {showSaveToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#164530] text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 text-sm font-semibold animate-in fade-in slide-in-from-top-4 duration-300">
          <span className="material-symbols-outlined text-[20px] text-[#bceed0]">check_circle</span>
          Calibrating Week 1 AI Meal Plan with Singapore Grocers...
        </div>
      )}

      {/* Main Work Surface */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header Introduction */}
        <div className="mb-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffdbce] text-[#380d00] mb-3">
            <span className="material-symbols-outlined text-[16px]">psychiatry</span>
            <span className="text-xs uppercase font-bold tracking-wider">
              Zero Decision Fatigue Guarantee
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#151d19] tracking-tight leading-tight mb-2">
            Let’s calibrate your kitchen profile.
          </h1>
          <p className="text-base sm:text-lg text-[#414943] leading-relaxed">
            Say goodbye to the 6 PM "what's for dinner?" panic. Tell us who you're cooking for, how you eat, and your cadence so your weekly recipes and auto-consolidated cart leave zero food wasted.
          </p>
        </div>

        {/* 2-Column Split Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Questionnaire Panels (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* SECTION 1: Household & Servings */}
            <section className="bg-white rounded-2xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(22,69,48,0.04)] border border-[#e2eae2]">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#164530] font-bold">
                    01 / Household Composition
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#151d19] mt-1">
                    Who are you cooking for each evening?
                  </h2>
                </div>
                <div className="p-2.5 rounded-xl bg-[#edf6ee] text-[#164530]">
                  <span className="material-symbols-outlined text-[24px]">group</span>
                </div>
              </div>

              {/* Quick Household Presets */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
                <button
                  type="button"
                  onClick={() => handleSelectPreset('solo')}
                  className={`px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                    profile.activePreset === 'solo'
                      ? 'bg-[#2f5d46] text-white shadow-sm'
                      : 'bg-[#edf6ee] hover:bg-[#e2eae2] text-[#151d19]'
                  }`}
                >
                  <span
                    className={`block text-xs font-bold ${
                      profile.activePreset === 'solo' ? 'text-white' : 'text-[#151d19]'
                    }`}
                  >
                    Solo Living
                  </span>
                  <span
                    className={`text-[11px] ${
                      profile.activePreset === 'solo' ? 'text-[#bceed0]' : 'text-[#414943]'
                    }`}
                  >
                    1 adult
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectPreset('couples')}
                  className={`px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                    profile.activePreset === 'couples'
                      ? 'bg-[#2f5d46] text-white shadow-sm'
                      : 'bg-[#edf6ee] hover:bg-[#e2eae2] text-[#151d19]'
                  }`}
                >
                  <span
                    className={`block text-xs font-bold ${
                      profile.activePreset === 'couples' ? 'text-white' : 'text-[#151d19]'
                    }`}
                  >
                    Couples Duo
                  </span>
                  <span
                    className={`text-[11px] ${
                      profile.activePreset === 'couples' ? 'text-[#bceed0]' : 'text-[#414943]'
                    }`}
                  >
                    2 adults
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectPreset('small-family')}
                  className={`px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                    profile.activePreset === 'small-family'
                      ? 'bg-[#2f5d46] text-white shadow-sm'
                      : 'bg-[#edf6ee] hover:bg-[#e2eae2] text-[#151d19]'
                  }`}
                >
                  <span
                    className={`block text-xs font-bold ${
                      profile.activePreset === 'small-family' ? 'text-white' : 'text-[#151d19]'
                    }`}
                  >
                    Small Family
                  </span>
                  <span
                    className={`text-[11px] ${
                      profile.activePreset === 'small-family' ? 'text-[#bceed0]' : 'text-[#414943]'
                    }`}
                  >
                    2 adults + 1 kid
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectPreset('big-table')}
                  className={`px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                    profile.activePreset === 'big-table'
                      ? 'bg-[#2f5d46] text-white shadow-sm'
                      : 'bg-[#edf6ee] hover:bg-[#e2eae2] text-[#151d19]'
                  }`}
                >
                  <span
                    className={`block text-xs font-bold ${
                      profile.activePreset === 'big-table' ? 'text-white' : 'text-[#151d19]'
                    }`}
                  >
                    Big Table
                  </span>
                  <span
                    className={`text-[11px] ${
                      profile.activePreset === 'big-table' ? 'text-[#bceed0]' : 'text-[#414943]'
                    }`}
                  >
                    5+ servings
                  </span>
                </button>
              </div>

              {/* Detailed Steppers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Adults Counter */}
                <div className="flex items-center justify-between p-4 bg-[#edf6ee]/70 rounded-xl border border-[#e2eae2]/80">
                  <div>
                    <p className="text-sm font-bold text-[#151d19]">Adult Portions</p>
                    <p className="text-xs text-[#414943]">Full caloric portions</p>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-full shadow-xs border border-[#dce5dd]">
                    <button
                      type="button"
                      aria-label="Decrease adults"
                      onClick={() => handleAdjustCount('adults', -1)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[#151d19] hover:bg-[#edf6ee] transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">remove</span>
                    </button>
                    <span className="font-mono-data text-base font-bold min-w-[24px] text-center text-[#151d19]">
                      {profile.adults}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase adults"
                      onClick={() => handleAdjustCount('adults', 1)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[#151d19] hover:bg-[#edf6ee] transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">add</span>
                    </button>
                  </div>
                </div>

                {/* Kids Counter */}
                <div className="flex items-center justify-between p-4 bg-[#edf6ee]/70 rounded-xl border border-[#e2eae2]/80">
                  <div>
                    <p className="text-sm font-bold text-[#151d19]">Kids / Light Portions</p>
                    <p className="text-xs text-[#414943]">~50–60% portion scaling</p>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-full shadow-xs border border-[#dce5dd]">
                    <button
                      type="button"
                      aria-label="Decrease children"
                      onClick={() => handleAdjustCount('kids', -1)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[#151d19] hover:bg-[#edf6ee] transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">remove</span>
                    </button>
                    <span className="font-mono-data text-base font-bold min-w-[24px] text-center text-[#151d19]">
                      {profile.kids}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase children"
                      onClick={() => handleAdjustCount('kids', 1)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[#151d19] hover:bg-[#edf6ee] transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">add</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 2: Weekly Rhythm & Cooking Days */}
            <section className="bg-white rounded-2xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(22,69,48,0.04)] border border-[#e2eae2]">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#164530] font-bold">
                    02 / Weekly Cooking Rhythm
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#151d19] mt-1">
                    Which nights do you want home-cooked food?
                  </h2>
                  <p className="text-xs sm:text-sm text-[#414943] mt-1">
                    We order exactly what expires within your active nights so nothing sits rotting in the crisper drawer.
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-[#edf6ee] text-[#164530]">
                  <span className="material-symbols-outlined text-[24px]">calendar_month</span>
                </div>
              </div>

              {/* Day Toggles */}
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-4">
                {(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as DayOfWeek[]).map((day) => {
                  const isActive = profile.activeDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleToggleDay(day)}
                      className={`flex flex-col items-center justify-center py-3 rounded-xl transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#164530] text-white shadow-sm'
                          : 'bg-[#edf6ee] text-[#414943] hover:bg-[#e2eae2]'
                      }`}
                    >
                      <span className="text-xs font-bold uppercase tracking-wider">{day}</span>
                      <span
                        className={`material-symbols-outlined text-[18px] mt-1 transition-opacity ${
                          isActive ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        check
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Cadence Helper */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-[#edf6ee]/60 rounded-xl border border-[#dce5dd]/60">
                <span className="text-xs text-[#164530] flex items-center gap-1.5 font-bold">
                  <span className="material-symbols-outlined text-[18px] text-[#2f5d46]">verified</span>
                  Recommended cadence: Weeknight Cook (Mon–Thu)
                </span>
                <button
                  type="button"
                  onClick={handleResetDays}
                  className="text-xs text-[#9a4521] hover:underline font-bold cursor-pointer"
                >
                  Reset to Mon-Thu
                </button>
              </div>
            </section>

            {/* SECTION 3: Dinner Structure & Style */}
            <section className="bg-white rounded-2xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(22,69,48,0.04)] border border-[#e2eae2]">
              <div className="mb-5">
                <span className="text-xs uppercase tracking-widest text-[#164530] font-bold">
                  03 / Dinner Complexity & Architecture
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#151d19] mt-1">
                  How do you prefer your evening dinners built?
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* 1-Dish Wonder */}
                <button
                  type="button"
                  onClick={() => onUpdateProfile({ dishStyle: '1-Dish Wonder' })}
                  className={`cursor-pointer p-4 rounded-xl transition-all flex flex-col justify-between text-left ${
                    profile.dishStyle === '1-Dish Wonder'
                      ? 'bg-white border-2 border-[#164530] shadow-md ring-2 ring-[#164530]/10'
                      : 'bg-[#edf6ee] border border-transparent hover:bg-[#e2eae2]'
                  }`}
                >
                  <div>
                    <div className="w-10 h-10 rounded-full bg-[#ffdbce] flex items-center justify-center text-[#380d00] mb-3">
                      <span className="material-symbols-outlined text-[20px]">skillet</span>
                    </div>
                    <h3 className="text-base font-bold text-[#151d19] mb-1">1-Dish Wonder</h3>
                    <p className="text-xs text-[#414943] leading-relaxed">
                      One-pan roasts, grain bowls, noodle soups, hearty salads. 1 pan to clean.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#9a4521] mt-4 inline-block">
                    Fastest (~18–25m)
                  </span>
                </button>

                {/* 2-Dish Balanced */}
                <button
                  type="button"
                  onClick={() => onUpdateProfile({ dishStyle: '2-Dish Balanced' })}
                  className={`cursor-pointer p-4 rounded-xl transition-all flex flex-col justify-between text-left relative ${
                    profile.dishStyle === '2-Dish Balanced'
                      ? 'bg-white border-2 border-[#164530] shadow-md ring-2 ring-[#164530]/10'
                      : 'bg-[#edf6ee] border border-transparent hover:bg-[#e2eae2]'
                  }`}
                >
                  <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-[#164530] text-white text-[10px] font-bold tracking-wide">
                    Most Popular
                  </div>
                  <div>
                    <div className="w-10 h-10 rounded-full bg-[#bceed0] flex items-center justify-center text-[#002113] mb-3">
                      <span className="material-symbols-outlined text-[20px]">dinner_dining</span>
                    </div>
                    <h3 className="text-base font-bold text-[#151d19] mb-1">2-Dish Balanced</h3>
                    <p className="text-xs text-[#414943] leading-relaxed">
                      A high-protein hero main paired with a seasonal crisp vegetable or warm side.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#164530] mt-4 inline-block">
                    Balanced (~25–35m)
                  </span>
                </button>

                {/* 3-Dish Family Feast */}
                <button
                  type="button"
                  onClick={() => onUpdateProfile({ dishStyle: '3-Dish Family Feast' })}
                  className={`cursor-pointer p-4 rounded-xl transition-all flex flex-col justify-between text-left ${
                    profile.dishStyle === '3-Dish Family Feast'
                      ? 'bg-white border-2 border-[#164530] shadow-md ring-2 ring-[#164530]/10'
                      : 'bg-[#edf6ee] border border-transparent hover:bg-[#e2eae2]'
                  }`}
                >
                  <div>
                    <div className="w-10 h-10 rounded-full bg-[#ffddb0] flex items-center justify-center text-[#281800] mb-3">
                      <span className="material-symbols-outlined text-[20px]">soup_kitchen</span>
                    </div>
                    <h3 className="text-base font-bold text-[#151d19] mb-1">3-Dish Family Feast</h3>
                    <p className="text-xs text-[#414943] leading-relaxed">
                      Traditional Asian/homestyle setup: nourishing soup, main protein, and side greens.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#553800] mt-4 inline-block">
                    Elaborate (~40–50m)
                  </span>
                </button>
              </div>

              {/* Pacing & Kitchen Constraints */}
              <div>
                <p className="text-xs text-[#414943] font-bold uppercase tracking-wider mb-2">
                  Pacing & Kitchen Constraints
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    '⏱️ Under 25 Mins Flat',
                    '🍱 Next-Day Lunch Friendly',
                    '👶 Picky-Eater Approved',
                    '🫕 Sheet-Pan / Instant Pot',
                    '🥦 Extra Green / Fiber Boost',
                  ].map((tag) => {
                    const isActive = profile.pacingConstraints.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleTogglePacing(tag)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#2f5d46] text-white shadow-xs'
                            : 'bg-[#edf6ee] text-[#151d19] hover:bg-[#e2eae2]'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* SECTION 4: Dietary Needs & Exclusions */}
            <section className="bg-white rounded-2xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(22,69,48,0.04)] border border-[#e2eae2]">
              <div className="mb-5">
                <span className="text-xs uppercase tracking-widest text-[#164530] font-bold">
                  04 / Dietary Lifestyle & Allergies
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#151d19] mt-1">
                  What guidelines should we hard-lock into the AI?
                </h2>
                <p className="text-xs sm:text-sm text-[#414943] mt-1">
                  Our pantry logic strictly cross-checks every ingredient against your criteria.
                </p>
              </div>

              {/* Diet Styles */}
              <div className="mb-5">
                <p className="text-xs text-[#414943] uppercase tracking-wider font-bold mb-2">
                  Eating Style
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Mediterranean', icon: 'eco' },
                    { label: 'High Protein (35g+)', icon: 'fitness_center' },
                    { label: 'Low Carb / Keto', icon: 'egg_alt' },
                    { label: 'Plant-Forward / Flexitarian', icon: 'spa' },
                    { label: 'Pescatarian', icon: 'set_meal' },
                  ].map((d) => {
                    const isActive = profile.eatingStyles.includes(d.label);
                    return (
                      <button
                        key={d.label}
                        type="button"
                        onClick={() => handleToggleDiet(d.label)}
                        className={`px-3.5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#164530] text-white shadow-xs'
                            : 'bg-[#edf6ee] text-[#151d19] hover:bg-[#e2eae2]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">{d.icon}</span>
                        {d.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Allergies / Strict Exclusions */}
              <div className="mb-5">
                <p className="text-xs text-[#414943] uppercase tracking-wider font-bold mb-2">
                  Strict Exclusions & Intolerances
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Gluten-Free',
                    'Dairy-Free',
                    'Peanut & Tree Nut Free',
                    'Shellfish-Free',
                    'No Pork / Lard',
                  ].map((allergy) => {
                    const isActive = profile.allergies.includes(allergy);
                    return (
                      <button
                        key={allergy}
                        type="button"
                        onClick={() => handleToggleAllergy(allergy)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#ffdad6] text-[#93000a] border border-[#ffdad6]'
                            : 'bg-[#edf6ee] text-[#151d19] hover:bg-[#e2eae2]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">block</span>
                        {allergy}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Dislikes Input Tag List */}
              <div>
                <label
                  htmlFor="dislike-input"
                  className="text-xs text-[#414943] uppercase tracking-wider font-bold block mb-1.5"
                >
                  Specific Ingredient Dislikes (e.g. Cilantro, Bell Peppers)
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    id="dislike-input"
                    type="text"
                    value={dislikeInput}
                    onChange={(e) => setDislikeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddDislike();
                      }
                    }}
                    placeholder="Add ingredient to omit (e.g. Coriander, Eggplant)..."
                    className="flex-1 bg-[#edf6ee] px-4 py-2.5 rounded-xl text-[#151d19] text-xs sm:text-sm border border-[#dce5dd] focus:outline-none focus:bg-white focus:border-[#164530]"
                  />
                  <button
                    type="button"
                    onClick={handleAddDislike}
                    className="px-4 py-2.5 rounded-xl bg-[#164530] text-white text-xs font-bold hover:bg-[#2f5d46] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Add Dislike
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {profile.dislikes.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#edf6ee] text-[#414943] text-xs font-medium border border-[#dce5dd]"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => handleRemoveDislike(item)}
                        className="hover:text-[#ba1a1a] cursor-pointer ml-0.5 flex items-center"
                      >
                        <span className="material-symbols-outlined text-[14px]">close</span>
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* SECTION 5: Grocery Integration & Target Budget */}
            <section className="bg-white rounded-2xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(22,69,48,0.04)] border border-[#e2eae2]">
              <div className="mb-5">
                <span className="text-xs uppercase tracking-widest text-[#164530] font-bold">
                  05 / Grocer Sync & Target Budget
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#151d19] mt-1">
                  Where do you prefer pantry deliveries dispatched from?
                </h2>
                <p className="text-xs sm:text-sm text-[#414943] mt-1">
                  We match the recipe's exact stock keeping units to real-time prices at your favorite local store.
                </p>
              </div>

              {/* Supermarket Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {GROCER_OPTIONS.map((g) => {
                  const isActive = profile.grocer === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => onUpdateProfile({ grocer: g.id })}
                      className={`cursor-pointer p-3 sm:p-4 rounded-xl flex flex-col items-center text-center transition-all ${
                        isActive
                          ? 'bg-[#edf6ee] border-2 border-[#164530] shadow-xs'
                          : 'bg-[#edf6ee]/60 border border-transparent hover:bg-[#edf6ee]'
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-[28px] mb-1 ${
                          isActive ? 'text-[#164530]' : 'text-[#414943]'
                        }`}
                      >
                        {g.iconName}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-[#151d19]">{g.name}</span>
                      <span className="text-[11px] text-[#414943] mt-0.5">{g.tagline}</span>
                    </button>
                  );
                })}
              </div>

              {/* Target Budget Slider */}
              <div className="bg-[#edf6ee]/70 p-4 sm:p-5 rounded-xl border border-[#dce5dd]/80">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <span className="text-xs sm:text-sm font-bold text-[#151d19]">
                    Estimated Target Dinner Budget
                  </span>
                  <span className="font-mono-data text-lg sm:text-xl text-[#164530] font-bold">
                    ${budgetMin} – ${budgetMax} / week
                  </span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="250"
                  step="10"
                  value={profile.budgetMidpoint}
                  onChange={(e) => onUpdateProfile({ budgetMidpoint: parseInt(e.target.value, 10) })}
                  className="w-full h-2 bg-[#dce5dd] rounded-lg appearance-none cursor-pointer accent-[#164530]"
                />
                <div className="flex justify-between text-[11px] sm:text-xs text-[#414943] mt-2 font-mono-data">
                  <span>$60 (Budget Everyday)</span>
                  <span className="text-[#164530] font-bold">~${costPerMeal} per serving</span>
                  <span>$250+ (Gourmet / Organic)</span>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Sticky Live Calibration Engine Preview (4 Cols) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 flex flex-col gap-4">
            {/* Live Calculation Summary Card */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_2px_16px_rgba(22,69,48,0.06)] border border-[#e2eae2]">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#edf6ee]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#fd9167] animate-pulse"></span>
                  <span className="text-xs uppercase tracking-wider text-[#164530] font-bold">
                    Dynamic Kitchen Profile
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#bceed0] text-[#002113] text-[11px] font-bold">
                  Active
                </span>
              </div>

              {/* Dynamic Configuration Metrics */}
              <div className="space-y-4 mb-5">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-[#edf6ee] text-[#164530] mt-0.5">
                    <span className="material-symbols-outlined text-[20px]">restaurant</span>
                  </div>
                  <div>
                    <p className="text-xs text-[#414943]">Target Table Capacity</p>
                    <p className="text-sm font-bold text-[#151d19]">
                      {profile.adults + profile.kids} Pax ({profile.adults} Adults
                      {profile.kids > 0 ? `, ${profile.kids} Kid${profile.kids > 1 ? 's' : ''}` : ''})
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-[#edf6ee] text-[#164530] mt-0.5">
                    <span className="material-symbols-outlined text-[20px]">event_repeat</span>
                  </div>
                  <div>
                    <p className="text-xs text-[#414943]">Cooking Schedule</p>
                    <p className="text-sm font-bold text-[#151d19]">
                      {profile.activeDays.length} Dinners/Week ({formatDaysSummary(profile.activeDays)})
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-[#edf6ee] text-[#164530] mt-0.5">
                    <span className="material-symbols-outlined text-[20px]">layers</span>
                  </div>
                  <div>
                    <p className="text-xs text-[#414943]">Plate Architecture</p>
                    <p className="text-sm font-bold text-[#151d19]">{profile.dishStyle} Meals</p>
                  </div>
                </div>
              </div>

              {/* Impact Metrics Bento */}
              <div className="grid grid-cols-2 gap-2 mb-5">
                <div className="p-3 bg-[#edf6ee] rounded-xl text-center">
                  <span className="block font-mono-data text-xl sm:text-2xl text-[#9a4521] font-bold">
                    ~3.5 hrs
                  </span>
                  <span className="text-[11px] text-[#414943] leading-tight block mt-0.5">
                    Saved weekly on planning & queuing
                  </span>
                </div>
                <div className="p-3 bg-[#bceed0]/40 rounded-xl text-center border border-[#bceed0]/50">
                  <span className="block font-mono-data text-xl sm:text-2xl text-[#164530] font-bold">
                    94%
                  </span>
                  <span className="text-[11px] text-[#414943] leading-tight block mt-0.5">
                    Zero-waste ingredient reuse index
                  </span>
                </div>
              </div>

              {/* Live AI Sample Recipe Match Preview */}
              <div
                onClick={() => onOpenRecipeModal(previewRecipe)}
                className="p-3.5 rounded-xl bg-[#edf6ee] hover:bg-[#e2eae2] transition-colors cursor-pointer group border border-[#dce5dd]/70"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#164530] text-[18px]">
                      auto_awesome
                    </span>
                    <span className="text-[11px] uppercase tracking-wide text-[#164530] font-bold">
                      Preview: Your AI Match
                    </span>
                  </div>
                  <span className="text-[11px] text-[#9a4521] font-bold group-hover:underline">
                    View &rarr;
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl bg-[#dce5dd] overflow-hidden shrink-0 shadow-xs">
                    <img
                      src={previewRecipe.image}
                      alt={previewRecipe.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs sm:text-sm font-bold text-[#151d19] truncate">
                      {previewRecipe.title}
                    </h4>
                    {previewRecipe.subtitle && (
                      <p className="text-[11px] text-[#414943] truncate">
                        {previewRecipe.subtitle}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-1.5 py-0.5 rounded bg-[#ffdbce] text-[#380d00] font-mono-data text-[10px] font-bold">
                        {previewRecipe.prepMinutes} mins
                      </span>
                      <span className="font-mono-data text-[11px] text-[#164530] font-bold">
                        {previewRecipe.proteinGrams}g Protein
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-4 flex items-center justify-center gap-4 text-[#414943] text-xs">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[#164530]">lock</span>
                  AES-256 Encrypted
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[#164530]">sync</span>
                  1-Click Cart Export
                </span>
              </div>
            </div>

            {/* Pro-Tip Box */}
            <div className="bg-[#ffdbce]/40 rounded-2xl p-4 flex items-start gap-3 border border-[#ffdbce]/60">
              <span className="material-symbols-outlined text-[#9a4521] text-[22px] mt-0.5">
                lightbulb
              </span>
              <div>
                <h5 className="text-xs font-bold text-[#380d00]">Happy Aprons Pantry Engine</h5>
                <p className="text-xs text-[#414943] mt-0.5 leading-relaxed">
                  If a recipe needs 2 stalks of celery or spring onion, your other dinners this week will automatically utilize the remaining bunch. Zero half-used vegetables going slimy in your fridge crisper.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Floating Action Bar */}
      <div className="sticky bottom-0 z-40 w-full bg-white/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.06)] border-t border-[#e2eae2] py-4">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#164530] hidden sm:inline-block"></span>
            <p className="text-xs sm:text-sm text-[#414943] text-center sm:text-left">
              Profile saves automatically to your private kitchen atelier.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                setShowSaveToast(true);
                setTimeout(() => setShowSaveToast(false), 2000);
              }}
              className="w-1/2 sm:w-auto text-xs sm:text-sm font-semibold text-[#414943] hover:text-[#151d19] px-4 py-2.5 transition-colors cursor-pointer text-center"
            >
              I'll finish this later
            </button>
            <button
              type="button"
              onClick={() => {
                setShowSaveToast(true);
                setTimeout(() => {
                  setShowSaveToast(false);
                  onSaveAndGenerate();
                }, 700);
              }}
              className="w-1/2 sm:w-auto px-6 py-3 rounded-full bg-[#164530] hover:bg-[#2f5d46] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all group cursor-pointer"
            >
              <span>Save Profile & Generate Week 1 Plan</span>
              <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
