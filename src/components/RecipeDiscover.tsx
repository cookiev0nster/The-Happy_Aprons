import React, { useState, useEffect } from 'react';
import { Recipe } from '../types';
import { RECIPES } from '../data/mockData';

interface RecipeDiscoverProps {
  onOpenRecipeModal: (recipe: Recipe) => void;
}

interface LiveApiResponse {
  success: boolean;
  query: {
    ingredient: string;
    nutritionQuery: string;
    pageSize: number;
  };
  sources: {
    theMealDbEndpoint: string;
    usdaEndpoint: string;
  };
  meals: Array<{
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
  }>;
  usdaNutrition: {
    query: string;
    keyConfigured?: boolean;
    totalHits?: number;
    foods: Array<{
      fdcId: number;
      description: string;
      brandOwner?: string;
      nutrients: Record<string, { value: number; unit: string }>;
    }>;
    note?: string;
  };
}

export const RecipeDiscover: React.FC<RecipeDiscoverProps> = ({
  onOpenRecipeModal,
}) => {
  const [activeView, setActiveView] = useState<'curated' | 'live-api'>('curated');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<string>('All');

  // Live API States
  const [liveIngredient, setLiveIngredient] = useState('chicken_breast');
  const [liveNutritionQuery, setLiveNutritionQuery] = useState('cheddar');
  const [liveData, setLiveData] = useState<LiveApiResponse | null>(null);
  const [isLoadingLive, setIsLoadingLive] = useState(false);
  const [healthStatus, setHealthStatus] = useState<any>(null);

  const tags = [
    'All',
    'High Protein (35g+)',
    'Mediterranean',
    'Pescatarian',
    'Plant-Forward / Flexitarian',
    'Gluten-Free',
  ];

  const filteredRecipes = RECIPES.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.ingredients.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTag = filterTag === 'All' || r.dietTags.includes(filterTag);
    return matchesSearch && matchesTag;
  });

  // Fetch live health & API data
  const fetchLiveEndpoints = async (ingredient = liveIngredient, nutrition = liveNutritionQuery) => {
    setIsLoadingLive(true);
    try {
      const [healthRes, recipesRes] = await Promise.all([
        fetch('/api/health').then((r) => (r.ok ? r.json() : null)),
        fetch(
          `/api/recipes?ingredient=${encodeURIComponent(ingredient)}&nutritionQuery=${encodeURIComponent(
            nutrition
          )}&pageSize=5`
        ).then((r) => (r.ok ? r.json() : null)),
      ]);
      setHealthStatus(healthRes);
      setLiveData(recipesRes);
    } catch (e) {
      console.error('Failed to query live serverless endpoints', e);
    } finally {
      setIsLoadingLive(false);
    }
  };

  useEffect(() => {
    if (activeView === 'live-api' && !liveData) {
      fetchLiveEndpoints();
    }
  }, [activeView]);

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div className="max-w-2xl">
          <span className="text-xs uppercase tracking-widest text-[#164530] font-bold">
            Curated Atelier & Live Serverless Sync
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#151d19] mt-1 mb-2">
            Discover fast, zero-fatigue weeknight dinners.
          </h1>
          <p className="text-sm sm:text-base text-[#414943] leading-relaxed">
            Browse chef-calibrated recipes or explore the live serverless feed connected to TheMealDB and USDA FoodData Central.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#edf6ee] rounded-full border border-[#dce5dd]/60 shrink-0">
          <button
            type="button"
            onClick={() => setActiveView('curated')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeView === 'curated'
                ? 'bg-[#164530] text-white shadow-xs'
                : 'text-[#414943] hover:text-[#151d19]'
            }`}
          >
            Atelier Kitchen ({RECIPES.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveView('live-api')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeView === 'live-api'
                ? 'bg-[#164530] text-white shadow-xs'
                : 'text-[#414943] hover:text-[#151d19]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-[#bceed0]">hub</span>
            Live USDA & TheMealDB
          </button>
        </div>
      </div>

      {activeView === 'curated' ? (
        <>
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#414943] text-[20px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search salmon, chicken, tofu, barramundi..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-[#dce5dd] text-xs sm:text-sm text-[#151d19] focus:outline-none focus:border-[#164530]"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFilterTag(t)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                    filterTag === t
                      ? 'bg-[#164530] text-white shadow-2xs'
                      : 'bg-[#edf6ee] text-[#414943] hover:bg-[#e2eae2]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of recipes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <div
                key={recipe.id}
                onClick={() => onOpenRecipeModal(recipe)}
                className="bg-white rounded-2xl border border-[#e2eae2] overflow-hidden shadow-[0_2px_12px_rgba(22,69,48,0.04)] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 bg-[#edf6ee] overflow-hidden">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold">
                      {recipe.dishStyle}
                    </div>
                    <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-[#164530] text-[11px] font-bold font-mono-data">
                      ⏱️ {recipe.prepMinutes} mins
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-base font-bold text-[#151d19] group-hover:text-[#164530] transition-colors">
                      {recipe.title}
                    </h3>
                    {recipe.subtitle && (
                      <p className="text-xs text-[#414943] mt-1">{recipe.subtitle}</p>
                    )}

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {recipe.dietTags.slice(0, 2).map((dt) => (
                        <span
                          key={dt}
                          className="px-2 py-0.5 rounded bg-[#edf6ee] text-[#164530] text-[10px] font-bold"
                        >
                          {dt}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-5 py-3 border-t border-[#edf6ee] bg-[#fbfdfb] flex items-center justify-between text-xs font-mono-data">
                  <span className="text-[#164530] font-bold">{recipe.proteinGrams}g Protein</span>
                  <span className="text-[#9a4521] font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Cook this &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* LIVE SERVERLESS ENDPOINTS VIEW */
        <div className="space-y-6">
          {/* Endpoint Status Card */}
          <div className="bg-white rounded-2xl p-6 border border-[#e2eae2] shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#edf6ee]">
              <div>
                <span className="text-xs font-bold text-[#164530] uppercase tracking-wider">
                  Live Serverless Connection Status
                </span>
                <h3 className="text-lg font-bold text-[#151d19] mt-0.5">
                  /api/health & /api/recipes
                </h3>
              </div>
              <button
                type="button"
                onClick={() => fetchLiveEndpoints()}
                disabled={isLoadingLive}
                className="px-4 py-2 rounded-full bg-[#edf6ee] hover:bg-[#e2eae2] text-xs font-bold text-[#164530] transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto"
              >
                <span
                  className={`material-symbols-outlined text-[16px] ${
                    isLoadingLive ? 'animate-spin' : ''
                  }`}
                >
                  refresh
                </span>
                {isLoadingLive ? 'Querying APIs...' : 'Refresh Live Status'}
              </button>
            </div>

            {/* Health Status Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="p-4 rounded-xl bg-[#edf6ee]/70 border border-[#dce5dd]/60 flex items-start gap-3">
                <span className="material-symbols-outlined text-[#164530] text-[24px]">
                  check_circle
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-xs text-[#151d19]">TheMealDB Connection</strong>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#bceed0] text-[#002113]">
                      HTTP 200 OK
                    </span>
                  </div>
                  <p className="text-[11px] text-[#414943] mt-0.5 font-mono-data">
                    Endpoint: https://www.themealdb.com/api/json/v1/1/filter.php?i=chicken_breast
                  </p>
                  {healthStatus?.connections?.theMealDb && (
                    <span className="text-[11px] text-[#164530] font-mono-data mt-1 block">
                      Latency: {healthStatus.connections.theMealDb.latencyMs}ms · Sample Count:{' '}
                      {healthStatus.connections.theMealDb.sampleRecipeCount}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#edf6ee]/70 border border-[#dce5dd]/60 flex items-start gap-3">
                <span className="material-symbols-outlined text-[#164530] text-[24px]">
                  {healthStatus?.connections?.usdaFoodDataCentral?.keyConfigured ? 'verified' : 'vpn_key'}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-xs text-[#151d19]">USDA FoodData Central</strong>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        healthStatus?.connections?.usdaFoodDataCentral?.keyConfigured
                          ? 'bg-[#bceed0] text-[#002113]'
                          : 'bg-[#ffdbce] text-[#380d00]'
                      }`}
                    >
                      {healthStatus?.connections?.usdaFoodDataCentral?.keyConfigured
                        ? 'Key Active'
                        : 'Key Pending (DATA_GOV_KEY)'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#414943] mt-0.5 font-mono-data">
                    Endpoint: https://api.nal.usda.gov/fdc/v1/foods/search?query=cheddar&pageSize=5
                  </p>
                  {healthStatus?.connections?.usdaFoodDataCentral?.error && (
                    <span className="text-[11px] text-[#9a4521] font-medium mt-1 block">
                      {healthStatus.connections.usdaFoodDataCentral.error}
                    </span>
                  )}
                  {healthStatus?.connections?.usdaFoodDataCentral?.latencyMs && (
                    <span className="text-[11px] text-[#164530] font-mono-data mt-1 block">
                      Latency: {healthStatus.connections.usdaFoodDataCentral.latencyMs}ms · Items:{' '}
                      {healthStatus.connections.usdaFoodDataCentral.sampleItemCount}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Live Filter Controls */}
            <div className="mt-6 pt-4 border-t border-[#edf6ee] grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-5">
                <label className="text-[11px] uppercase tracking-wider font-bold text-[#414943] block mb-1">
                  TheMealDB Ingredient Filter (?i=)
                </label>
                <input
                  type="text"
                  value={liveIngredient}
                  onChange={(e) => setLiveIngredient(e.target.value)}
                  placeholder="chicken_breast, salmon, beef..."
                  className="w-full bg-[#edf6ee] px-3.5 py-2 rounded-xl text-xs font-mono-data border border-[#dce5dd] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="sm:col-span-5">
                <label className="text-[11px] uppercase tracking-wider font-bold text-[#414943] block mb-1">
                  USDA FoodData Query (?query=)
                </label>
                <input
                  type="text"
                  value={liveNutritionQuery}
                  onChange={(e) => setLiveNutritionQuery(e.target.value)}
                  placeholder="cheddar, salmon, oats..."
                  className="w-full bg-[#edf6ee] px-3.5 py-2 rounded-xl text-xs font-mono-data border border-[#dce5dd] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="button"
                  onClick={() => fetchLiveEndpoints(liveIngredient, liveNutritionQuery)}
                  className="w-full py-2.5 rounded-xl bg-[#164530] hover:bg-[#2f5d46] text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Execute Query
                </button>
              </div>
            </div>
          </div>

          {/* Results: Meals & USDA Nutrients */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* TheMealDB Results (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#e2eae2] shadow-2xs">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#edf6ee]">
                <div>
                  <h4 className="text-sm font-bold text-[#151d19]">
                    Live TheMealDB Meals ({liveData?.meals?.length || 0})
                  </h4>
                  <span className="text-[11px] text-[#414943] font-mono-data">
                    Filtered by: "{liveIngredient}"
                  </span>
                </div>
                <span className="text-xs font-mono-data text-[#164530] font-bold">
                  GET filter.php?i={liveIngredient}
                </span>
              </div>

              {isLoadingLive ? (
                <div className="py-12 text-center text-xs text-[#414943]">
                  Fetching meals from TheMealDB...
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
                  {liveData?.meals?.slice(0, 8).map((meal) => (
                    <div
                      key={meal.idMeal}
                      className="p-2.5 rounded-xl border border-[#e2eae2] hover:border-[#164530] transition-colors flex items-center gap-3 bg-[#edf6ee]/30"
                    >
                      <img
                        src={meal.strMealThumb}
                        alt={meal.strMeal}
                        className="w-12 h-12 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-[#151d19] truncate">{meal.strMeal}</p>
                        <span className="text-[10px] text-[#414943] font-mono-data">
                          ID: #{meal.idMeal}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* USDA FoodData Central Results (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#e2eae2] shadow-2xs">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#edf6ee]">
                <div>
                  <h4 className="text-sm font-bold text-[#151d19]">USDA FoodData Central</h4>
                  <span className="text-[11px] text-[#414943] font-mono-data">
                    Query: "{liveNutritionQuery}"
                  </span>
                </div>
                <span className="text-xs font-mono-data text-[#164530] font-bold">
                  FDC Search API
                </span>
              </div>

              {isLoadingLive ? (
                <div className="py-12 text-center text-xs text-[#414943]">
                  Fetching USDA nutrient profiles...
                </div>
              ) : liveData?.usdaNutrition?.keyConfigured === false ? (
                <div className="p-4 rounded-xl bg-[#edf6ee] border border-[#dce5dd] text-xs text-[#414943] space-y-2">
                  <div className="flex items-center gap-2 font-bold text-[#151d19]">
                    <span className="material-symbols-outlined text-[#9a4521] text-[18px]">key</span>
                    <span>USDA FoodData Central Key Pending</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    The serverless endpoint is ready and waiting for your key. When you set <code className="bg-white px-1.5 py-0.5 rounded border border-[#dce5dd] text-[#164530] font-mono">DATA_GOV_KEY</code> and optional <code className="bg-white px-1.5 py-0.5 rounded border border-[#dce5dd] text-[#164530] font-mono">LTA_ACCOUNT_KEY</code> in environment variables, live USDA macro data will populate here automatically.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {liveData?.usdaNutrition?.foods?.map((food) => (
                    <div
                      key={food.fdcId}
                      className="p-3 rounded-xl border border-[#e2eae2] bg-[#edf6ee]/40 text-xs"
                    >
                      <div className="flex justify-between items-start mb-1.5">
                        <span className="font-bold text-[#151d19] leading-snug">
                          {food.description}
                        </span>
                        <span className="text-[10px] text-[#164530] font-mono-data font-bold">
                          FDC #{food.fdcId}
                        </span>
                      </div>
                      {food.brandOwner && (
                        <span className="text-[10px] text-[#414943] block mb-2">
                          Brand: {food.brandOwner}
                        </span>
                      )}

                      <div className="grid grid-cols-2 gap-1.5 mt-2 pt-2 border-t border-[#dce5dd]/60 font-mono-data text-[10px]">
                        {Object.entries(food.nutrients || {})
                          .slice(0, 4)
                          .map(([name, val]: [string, any]) => (
                            <div key={name} className="flex justify-between">
                              <span className="text-[#414943] truncate pr-1">{name}:</span>
                              <span className="font-bold text-[#151d19]">
                                {val.value} {val.unit}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
