import React, { useEffect, useState } from 'react';
import { CuisineType, ElderlyProfileState, MealSlot, Recipe } from '../types';
import { ELDERLY_RECIPES } from '../data/mockData';

interface RecipeDiscoverProps {
  profile: ElderlyProfileState;
  onOpenRecipeModal: (recipe: Recipe) => void;
}

export const RecipeDiscover: React.FC<RecipeDiscoverProps> = ({
  profile,
  onOpenRecipeModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<MealSlot | 'all'>('all');
  const [selectedCuisine, setSelectedCuisine] = useState<CuisineType | 'all'>('all');
  const [apiData, setApiData] = useState<any>(null);
  const [loadingApi, setLoadingApi] = useState(false);
  const [apiQueryIngredient, setApiQueryIngredient] = useState('chicken');

  // Query /api/recipes for live USDA & TheMealDB enrichment
  const fetchLiveApiRecipes = async (ingredient: string) => {
    setLoadingApi(true);
    try {
      const res = await fetch(
        `/api/recipes?ingredient=${encodeURIComponent(ingredient)}&nutritionQuery=${encodeURIComponent(
          ingredient
        )}&pageSize=4&elderlyCount=${profile.elderlyCount}`
      );
      if (res.ok) {
        const json = await res.json();
        setApiData(json);
      }
    } catch (err) {
      console.warn('Failed to fetch from /api/recipes:', err);
    } finally {
      setLoadingApi(false);
    }
  };

  useEffect(() => {
    fetchLiveApiRecipes('chicken');
  }, []);

  const handleApiSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiQueryIngredient.trim()) {
      fetchLiveApiRecipes(apiQueryIngredient.trim());
    }
  };

  const filteredLocalRecipes = ELDERLY_RECIPES.filter((r) => {
    const matchesSlot = selectedSlot === 'all' || r.mealSlot === selectedSlot;
    const matchesCuisine = selectedCuisine === 'all' || r.cuisine === selectedCuisine;
    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.chineseTitle && r.chineseTitle.includes(searchTerm)) ||
      r.ingredients.some((i) => i.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSlot && matchesCuisine && matchesSearch;
  });

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Editorial Header */}
      <div className="mb-8 max-w-3xl">
        <span className="text-xs uppercase tracking-wider text-[#164530] font-bold block mb-1.5">
          Elderly Recipe Library & Live Ingredient Verification
        </span>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#151d19] tracking-tight">
          Nourishing Dishes for Singapore Seniors
        </h1>
        <p className="text-xs sm:text-sm text-[#414943] mt-2 leading-relaxed">
          Explore recipes calibrated for elderly digestion, deboning safety, and IDDSI texture levels. All recipes scale dynamically for your {profile.elderlyCount} {profile.elderlyCount === 1 ? 'senior' : 'seniors'}.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e2eae2] shadow-2xs mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#414943] text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search recipes, ingredients (threadfin, pumpkin, tofu, congee, soup)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#dce5dd] text-xs sm:text-sm text-[#151d19] focus:outline-none focus:border-[#164530]"
            />
          </div>

          {/* Quick slot filter */}
          <div className="flex items-center gap-1 overflow-x-auto bg-[#edf6ee] p-1 rounded-xl border border-[#dce5dd]">
            {(['all', 'breakfast', 'lunch', 'dinner', 'supper'] as const).map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setSelectedSlot(slot)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors capitalize cursor-pointer whitespace-nowrap ${
                  selectedSlot === slot
                    ? 'bg-white text-[#164530] shadow-xs'
                    : 'text-[#414943] hover:text-[#151d19]'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* Cuisine Filter Tags */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-[#edf6ee] scrollbar-none text-xs">
          <span className="text-[11px] font-bold text-[#414943] uppercase tracking-wider shrink-0">
            Cuisine:
          </span>
          {[
            { id: 'all', label: 'All Cuisines' },
            { id: 'cantonese-teochew', label: 'Cantonese / Teochew' },
            { id: 'peranakan', label: 'Peranakan' },
            { id: 'hainanese', label: 'Hainanese' },
            { id: 'malay', label: 'Malay' },
            { id: 'indian', label: 'Indian' },
            { id: 'western', label: 'Western' },
          ].map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCuisine(c.id as any)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                selectedCuisine === c.id
                  ? 'bg-[#164530] text-white'
                  : 'bg-[#edf6ee] text-[#414943] hover:text-[#151d19]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
        {filteredLocalRecipes.map((recipe) => (
          <div
            key={recipe.id}
            role="button"
            tabIndex={0}
            onClick={() => onOpenRecipeModal(recipe)}
            onKeyDown={(e) => e.key === 'Enter' && onOpenRecipeModal(recipe)}
            className="bg-white rounded-2xl border border-[#e2eae2] overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group text-left"
          >
            <div>
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />
                <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {recipe.mealSlot.toUpperCase()} · {recipe.textureLevel.split(':')[0]}
                </div>
                <div className="absolute bottom-2.5 right-2.5 bg-white/95 text-[#151d19] font-mono-data text-xs font-bold px-2 py-0.5 rounded shadow-xs">
                  ~{recipe.prepMinutes}m
                </div>
              </div>

              <div className="p-4">
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
                  <span className="text-xs text-[#414943] block mt-0.5">{recipe.chineseTitle}</span>
                )}

                <p className="text-xs text-[#414943] mt-2 line-clamp-2 leading-relaxed">
                  {recipe.subtitle}
                </p>

                {/* Dietary pills */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {recipe.dietaryBadges.slice(0, 3).map((badge, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] text-[#164530] bg-[#edf6ee] px-2 py-0.5 rounded font-medium"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 pt-0">
              <div className="py-2 px-3 rounded-xl bg-[#edf6ee] text-[#164530] text-xs font-bold flex items-center justify-between group-hover:bg-[#164530] group-hover:text-white transition-colors">
                <span>View Recipe & Buy</span>
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* LIVE SERVERLESS API VERIFICATION PANEL (/api/recipes) */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e2eae2] shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#edf6ee] mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#164530] mb-1">
              <span className="material-symbols-outlined text-[16px]">sync</span>
              <span>Live Express Serverless API Verification (/api/recipes & /api/health)</span>
            </div>
            <h2 className="text-lg font-bold text-[#151d19]">
              USDA FoodData Central & TheMealDB Query Engine
            </h2>
            <p className="text-xs text-[#414943] mt-0.5">
              Testing backend API integration for ingredient nutrient density and global recipe validation.
            </p>
          </div>

          <form onSubmit={handleApiSearch} className="flex items-center gap-2">
            <input
              type="text"
              value={apiQueryIngredient}
              onChange={(e) => setApiQueryIngredient(e.target.value)}
              placeholder="e.g. chicken, salmon, tofu"
              className="px-3 py-1.5 rounded-lg border border-[#dce5dd] text-xs focus:outline-none focus:border-[#164530]"
            />
            <button
              type="submit"
              disabled={loadingApi}
              className="px-3.5 py-1.5 rounded-lg bg-[#164530] text-white text-xs font-bold hover:bg-[#23583f] transition-colors cursor-pointer disabled:opacity-50"
            >
              {loadingApi ? 'Querying...' : 'Fetch Live Data'}
            </button>
          </form>
        </div>

        {apiData && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* USDA Nutrition Status */}
              <div className="p-4 rounded-xl bg-[#edf6ee]/70 border border-[#dce5dd]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#164530]">
                    USDA FoodData Central Records
                  </span>
                  <span className="text-[10px] font-semibold text-[#414943] bg-white px-2 py-0.5 rounded">
                    Status: {apiData.usdaNutrition?.status}
                  </span>
                </div>
                <p className="text-xs text-[#414943] mb-3">
                  Query: <code>{apiData.query?.nutritionQuery}</code> · Hits:{' '}
                  {apiData.usdaNutrition?.totalHits ?? 0}
                </p>
                {apiData.usdaNutrition?.message && (
                  <p className="text-[11px] text-[#414943] italic bg-white p-2 rounded border border-[#dce5dd]">
                    {apiData.usdaNutrition.message}
                  </p>
                )}
                {Array.isArray(apiData.usdaNutrition?.foods) &&
                  apiData.usdaNutrition.foods.length > 0 && (
                    <div className="space-y-1.5 text-xs">
                      {apiData.usdaNutrition.foods.slice(0, 2).map((f: any, i: number) => (
                        <div key={i} className="p-2 bg-white rounded border border-[#e2eae2]">
                          <strong className="block text-[#151d19]">{f.description}</strong>
                          <span className="text-[11px] text-[#414943]">
                            FDC ID: {f.fdcId} · Brand: {f.brandOwner || 'Generic'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
              </div>

              {/* TheMealDB Live Recipes */}
              <div className="p-4 rounded-xl bg-[#edf6ee]/70 border border-[#dce5dd]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#164530]">
                    TheMealDB Global Records
                  </span>
                  <span className="text-[10px] font-semibold text-[#414943] bg-white px-2 py-0.5 rounded">
                    Ingredient: {apiData.query?.ingredient}
                  </span>
                </div>
                {Array.isArray(apiData.meals) && apiData.meals.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {apiData.meals.slice(0, 2).map((m: any) => (
                      <div
                        key={m.idMeal}
                        className="p-2 bg-white rounded border border-[#e2eae2] flex items-center gap-2"
                      >
                        <img
                          src={m.strMealThumb}
                          alt={m.strMeal}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <span className="text-xs font-bold text-[#151d19] truncate">
                          {m.strMeal}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#414943]">
                    No immediate TheMealDB recipes for "{apiData.query?.ingredient}".
                  </p>
                )}
              </div>
            </div>

            {/* Singapore Elderly Care Guidance from API */}
            {apiData.singaporeElderlyInsights && (
              <div className="p-3.5 rounded-xl bg-[#f3fcf3] border border-[#bceed0] text-xs text-[#002113] flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#164530] text-[18px] shrink-0 mt-0.5">
                  tips_and_updates
                </span>
                <div>
                  <strong className="block mb-0.5">Singapore Elderly Care API Insight:</strong>
                  <span>{apiData.singaporeElderlyInsights.textureGuidance} </span>
                  <span className="text-[#414943]">
                    {apiData.singaporeElderlyInsights.chewingSafetyNote}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};
