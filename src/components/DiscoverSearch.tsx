import React, { useState, useMemo } from 'react';
import { HouseholdMemberProfile, Product, SupermarketId } from '../types';
import { PRODUCTS, SUPERMARKETS } from '../data/mockData';
import { evaluateProductSuitability } from '../services/suitabilityEngine';
import { SuitabilityBadge } from './SuitabilityBadge';

interface DiscoverSearchProps {
  activeProfile: HouseholdMemberProfile;
  initialQuery?: string;
  onOpenProductModal: (product: Product) => void;
  onAddToBasket: (product: Product, retailerId: SupermarketId, quantity: number) => void;
  comparisonList: Product[];
  onToggleComparison: (product: Product) => void;
  onOpenComparisonModal: () => void;
  onClearComparison: () => void;
}

export const DiscoverSearch: React.FC<DiscoverSearchProps> = ({
  activeProfile,
  initialQuery = '',
  onOpenProductModal,
  onAddToBasket,
  comparisonList,
  onToggleComparison,
  onOpenComparisonModal,
  onClearComparison,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSupermarket, setSelectedSupermarket] = useState<string>('All');
  const [suitabilityFilter, setSuitabilityFilter] = useState<string>('all');
  const [maxSodium, setMaxSodium] = useState<number>(1500);
  const [maxSugar, setMaxSugar] = useState<number>(20);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const categories = [
    'All',
    'Pantry & Sauces',
    'Fresh Produce',
    'Proteins & Seafood',
    'Dairy & Plant Mylks',
    'Grains & Bakery',
    'Snacks & Beverages',
    'Elderly & Special Care',
  ];

  // Filter and score products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.map((prod) => ({
      product: prod,
      analysis: evaluateProductSuitability(prod, activeProfile),
    })).filter(({ product, analysis }) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesBrand = product.brand.toLowerCase().includes(q);
        const matchesIngredients = product.ingredientsList.some((ing) => ing.toLowerCase().includes(q));
        const matchesBadges = product.healthBadges.some((b) => b.toLowerCase().includes(q));
        const matchesCategory = product.category.toLowerCase().includes(q);

        // Smart semantic aliases
        let semanticMatch = false;
        if (q.includes('low-sodium') || q.includes('low salt') || q.includes('less sodium')) {
          semanticMatch = product.nutritionFacts.sodiumMg <= 600;
        } else if (q.includes('dairy-free') || q.includes('lactose')) {
          semanticMatch = !product.declaredAllergens.includes('Dairy / Milk') && product.healthBadges.some((b) => b.includes('Dairy-Free'));
        } else if (q.includes('peanut-free') || q.includes('nut-free')) {
          semanticMatch = !product.declaredAllergens.includes('Peanuts') && !product.declaredAllergens.includes('Tree Nuts');
        } else if (q.includes('low-sugar') || q.includes('diabetic')) {
          semanticMatch = product.nutritionFacts.sugarsG <= 5;
        } else if (q.includes('high-protein') || q.includes('protein')) {
          semanticMatch = product.nutritionFacts.proteinG >= 10;
        } else if (q.includes('gluten')) {
          semanticMatch = !product.declaredAllergens.includes('Wheat / Gluten');
        }

        if (!matchesName && !matchesBrand && !matchesIngredients && !matchesBadges && !matchesCategory && !semanticMatch) {
          return false;
        }
      }

      // 2. Category
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }

      // 3. Supermarket
      if (selectedSupermarket !== 'All') {
        const hasGrocer = product.retailers.some(
          (r) => r.supermarketId === selectedSupermarket && r.inStock
        );
        if (!hasGrocer) return false;
      }

      // 4. Suitability Filter
      if (suitabilityFilter === 'matches_only' && analysis.status !== 'matches') {
        return false;
      }
      if (suitabilityFilter === 'safe_and_check' && (analysis.status === 'not_suitable' || analysis.status === 'insufficient_info')) {
        return false;
      }

      // 5. Sodium & Sugar bounds
      if (product.nutritionFacts.sodiumMg > maxSodium) return false;
      if (product.nutritionFacts.sugarsG > maxSugar) return false;

      return true;
    });
  }, [searchQuery, selectedCategory, selectedSupermarket, suitabilityFilter, maxSodium, maxSugar, activeProfile]);

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6 pb-24">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#164530] font-bold">
            Multi-Supermarket Marketplace
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#151d19] mt-1">
            Discover & Compare Ingredients
          </h1>
          <p className="text-xs sm:text-sm text-[#556057]">
            Showing ingredients evaluated against <strong>{activeProfile.name}</strong>'s dietary guardrails
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
            className="px-4 py-2.5 rounded-full border border-[#dce5dd] bg-white hover:bg-[#edf6ee] text-xs font-bold text-[#414943] transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <span className="material-symbols-outlined text-[18px] text-[#164530]">tune</span>
            <span>Filters & Bounds</span>
            {(selectedCategory !== 'All' || selectedSupermarket !== 'All' || suitabilityFilter !== 'all') && (
              <span className="w-2 h-2 rounded-full bg-[#9a4521]"></span>
            )}
          </button>
        </div>
      </div>

      {/* Main Search Input Bar */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#556057] text-[22px]">
          search
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder='Try searching "Low-sodium soy sauce", "Dairy-free milk", "Peanut-free snacks", "Low-GI rice"...'
          className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white border border-[#dce5dd] text-sm text-[#151d19] shadow-xs focus:outline-none focus:border-[#164530] focus:ring-2 focus:ring-[#164530]/10 placeholder:text-[#717973]"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#717973] hover:text-[#151d19] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#164530] text-white shadow-2xs'
                : 'bg-[#edf6ee] text-[#414943] hover:bg-[#e2eae2]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filter Drawer / Expanded Controls */}
      {filterDrawerOpen && (
        <div className="bg-[#f8fbf8] p-5 rounded-3xl border border-[#e2eae2] space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between border-b border-[#edf6ee] pb-3">
            <h3 className="text-xs font-bold text-[#151d19] uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#164530]">filter_alt</span>
              <span>Advanced Dietary & Supermarket Filters</span>
            </h3>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setSelectedSupermarket('All');
                setSuitabilityFilter('all');
                setMaxSodium(1500);
                setMaxSugar(20);
                setSearchQuery('');
              }}
              className="text-xs text-[#ba1a1a] font-semibold hover:underline cursor-pointer"
            >
              Reset All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Suitability Filter */}
            <div>
              <label className="text-xs font-bold text-[#151d19] block mb-2">
                Safety & Suitability Level
              </label>
              <div className="space-y-1.5 text-xs">
                {[
                  { id: 'all', label: 'All Products (Show all ratings)' },
                  { id: 'matches_only', label: '100% Matches Profile Only (Green)' },
                  { id: 'safe_and_check', label: 'Matches & Check-Needed' },
                ].map((opt) => (
                  <label key={opt.id} className="flex items-center gap-2 text-[#414943] cursor-pointer">
                    <input
                      type="radio"
                      name="suitability"
                      checked={suitabilityFilter === opt.id}
                      onChange={() => setSuitabilityFilter(opt.id)}
                      className="accent-[#164530]"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Supermarket Filter */}
            <div>
              <label className="text-xs font-bold text-[#151d19] block mb-2">
                Supermarket Availability
              </label>
              <select
                value={selectedSupermarket}
                onChange={(e) => setSelectedSupermarket(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white border border-[#dce5dd] text-xs text-[#151d19] focus:outline-none"
              >
                <option value="All">All Singapore Supermarkets</option>
                {SUPERMARKETS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Nutritional Limit Sliders */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-[#151d19]">Max Sodium per Serving:</span>
                  <span className="font-mono-data font-bold text-[#164530]">{maxSodium} mg</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1500"
                  step="50"
                  value={maxSodium}
                  onChange={(e) => setMaxSodium(parseInt(e.target.value, 10))}
                  className="w-full accent-[#164530]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-[#151d19]">Max Sugars per Serving:</span>
                  <span className="font-mono-data font-bold text-[#164530]">{maxSugar} g</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={maxSugar}
                  onChange={(e) => setMaxSugar(parseInt(e.target.value, 10))}
                  className="w-full accent-[#164530]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Count & Comparison Bar Notification */}
      <div className="flex items-center justify-between text-xs text-[#556057]">
        <span>
          Showing <strong>{filteredProducts.length}</strong> ingredient products from multiple supermarkets
        </span>
        {comparisonList.length > 0 && (
          <span className="text-[#164530] font-bold">
            {comparisonList.length} item{comparisonList.length > 1 ? 's' : ''} in comparison tray
          </span>
        )}
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#e2eae2]">
          <span className="material-symbols-outlined text-[48px] text-[#717973] mb-2">
            search_off
          </span>
          <h3 className="text-base font-bold text-[#151d19]">No matching ingredients found</h3>
          <p className="text-xs text-[#556057] mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or relaxing the sodium and sugar limits in the filter drawer.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedSupermarket('All');
              setSuitabilityFilter('all');
              setMaxSodium(1500);
            }}
            className="mt-4 px-4 py-2 rounded-full bg-[#164530] text-white text-xs font-bold cursor-pointer"
          >
            Clear Search & Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map(({ product, analysis }) => {
            const sortedPrices = [...product.retailers].sort((a, b) => a.priceSgd - b.priceSgd);
            const lowestPrice = sortedPrices[0];
            const lowestSupermarket = SUPERMARKETS.find((s) => s.id === lowestPrice.supermarketId);
            const isInCompare = comparisonList.some((p) => p.id === product.id);

            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl border border-[#e2eae2] p-4 flex flex-col justify-between hover:shadow-md transition-all group"
              >
                <div>
                  <div
                    onClick={() => onOpenProductModal(product)}
                    className="relative h-44 rounded-2xl bg-[#edf6ee] overflow-hidden mb-3 border border-[#dce5dd]/60 cursor-pointer"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2 py-0.5 rounded-md bg-white/95 backdrop-blur-xs text-[10px] font-bold text-[#164530] shadow-2xs border border-[#bceed0]">
                        {product.brand}
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono-data px-2 py-0.5 rounded-md">
                      {product.retailers.length} Stores Compare
                    </div>
                  </div>

                  {/* Suitability Badge */}
                  <div className="mb-2">
                    <SuitabilityBadge
                      analysis={analysis}
                      compact
                      onOpenDetails={() => onOpenProductModal(product)}
                    />
                  </div>

                  <h3
                    onClick={() => onOpenProductModal(product)}
                    className="text-sm font-bold text-[#151d19] group-hover:text-[#164530] cursor-pointer line-clamp-2 leading-snug"
                  >
                    {product.name}
                  </h3>
                  <span className="text-[11px] text-[#556057] block mt-0.5">{product.packSize}</span>

                  {/* Quick Nutrition Highlights */}
                  <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                    <span className="px-1.5 py-0.5 rounded bg-[#edf6ee] text-[#164530] text-[10px] font-mono-data font-bold">
                      {product.nutritionFacts.sodiumMg}mg Sodium
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-[#edf6ee] text-[#164530] text-[10px] font-mono-data font-bold">
                      {product.nutritionFacts.proteinG}g Protein
                    </span>
                    {product.nutritionFacts.glycemicIndex && (
                      <span className="px-1.5 py-0.5 rounded bg-[#bceed0]/50 text-[#003920] text-[10px] font-bold">
                        {product.nutritionFacts.glycemicIndex} GI
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#edf6ee]">
                  <div className="flex items-baseline justify-between mb-2">
                    <div>
                      <span className="text-[10px] text-[#556057] block">
                        Best: ${lowestPrice.priceSgd.toFixed(2)} at {lowestSupermarket?.name}
                      </span>
                      <span className="font-mono-data text-xs text-[#717973]">
                        Unit: {lowestPrice.unitPrice}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => onToggleComparison(product)}
                      className={`py-2 px-2 rounded-xl border text-[11px] font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                        isInCompare
                          ? 'bg-[#164530] text-white border-[#164530]'
                          : 'border-[#dce5dd] text-[#414943] hover:bg-[#edf6ee]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">compare_arrows</span>
                      <span>{isInCompare ? 'In Tray' : 'Compare'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onAddToBasket(product, lowestPrice.supermarketId, 1)}
                      className="py-2 px-2 rounded-xl bg-[#164530] hover:bg-[#2f5d46] text-white text-[11px] font-bold shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[15px]">add</span>
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Comparison Tray (When items selected for compare) */}
      {comparisonList.length > 0 && (
        <div className="fixed bottom-18 lg:bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-[#164530]/20 p-3.5 flex items-center gap-4 max-w-lg w-[90%] animate-in slide-in-from-bottom-4">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="material-symbols-outlined text-[#164530] text-[20px] shrink-0">
              compare_arrows
            </span>
            <div className="flex -space-x-2 overflow-hidden shrink-0">
              {comparisonList.map((p) => (
                <img
                  key={p.id}
                  src={p.image}
                  alt={p.name}
                  className="w-7 h-7 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
            <span className="text-xs font-bold text-[#151d19] truncate">
              {comparisonList.length} ingredient{comparisonList.length > 1 ? 's' : ''} staged
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onClearComparison}
              className="text-xs text-[#717973] hover:text-[#151d19] cursor-pointer"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={onOpenComparisonModal}
              className="px-4 py-2 rounded-full bg-[#164530] hover:bg-[#2f5d46] text-white text-xs font-bold cursor-pointer shadow-xs flex items-center gap-1"
            >
              <span>Compare Now</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
