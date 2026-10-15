import React, { useState } from 'react';
import { Recipe } from '../types';
import { RECIPES } from '../data/mockData';

interface RecipeDiscoverProps {
  onOpenRecipeModal: (recipe: Recipe) => void;
}

export const RecipeDiscover: React.FC<RecipeDiscoverProps> = ({
  onOpenRecipeModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<string>('All');

  const tags = ['All', 'High Protein (35g+)', 'Mediterranean', 'Pescatarian', 'Plant-Forward / Flexitarian', 'Gluten-Free'];

  const filteredRecipes = RECIPES.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.ingredients.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTag = filterTag === 'All' || r.dietTags.includes(filterTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="max-w-2xl mb-8">
        <span className="text-xs uppercase tracking-widest text-[#164530] font-bold">
          Curated Atelier Library
        </span>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#151d19] mt-1 mb-2">
          Discover fast, zero-fatigue weeknight dinners.
        </h1>
        <p className="text-sm sm:text-base text-[#414943] leading-relaxed">
          Every recipe takes under 35 minutes, requires minimal kitchen cookware cleanup, and sources readily from Singapore grocers.
        </p>
      </div>

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
    </div>
  );
};
