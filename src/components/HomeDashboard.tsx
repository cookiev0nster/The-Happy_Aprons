import React from 'react';
import { ActiveTab, HouseholdMemberProfile, Product, SupermarketId } from '../types';
import { PRODUCTS, SUPERMARKETS } from '../data/mockData';
import { evaluateProductSuitability } from '../services/suitabilityEngine';
import { SuitabilityBadge } from './SuitabilityBadge';

interface HomeDashboardProps {
  activeProfile: HouseholdMemberProfile;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenProductModal: (product: Product) => void;
  onAddToBasket: (product: Product, retailerId: SupermarketId, quantity: number) => void;
  onSearchPrompt: (query: string) => void;
  onAddToComparison: (product: Product) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  activeProfile,
  onSelectTab,
  onOpenProductModal,
  onAddToBasket,
  onSearchPrompt,
  onAddToComparison,
}) => {
  // Filter products by suitability
  const analyzedProducts = PRODUCTS.map((prod) => ({
    product: prod,
    analysis: evaluateProductSuitability(prod, activeProfile),
  }));

  const safePicks = analyzedProducts.filter((p) => p.analysis.status === 'matches').slice(0, 4);

  const quickSearchPrompts = [
    { label: 'Low-sodium soy sauce', icon: 'soup_kitchen', query: 'low-sodium soy sauce' },
    { label: 'Dairy-free milk', icon: 'water_drop', query: 'dairy-free milk' },
    { label: 'Peanut-free snacks', icon: 'cookie', query: 'peanut-free snacks' },
    { label: 'Low-sugar breakfast', icon: 'bakery_dining', query: 'low-sugar breakfast' },
    { label: 'High-protein vegetarian', icon: 'fitness_center', query: 'high-protein vegetarian' },
    { label: 'Gluten-free staples', icon: 'grain', query: 'gluten-free' },
  ];

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-10">
      {/* Hero Welcome Banner */}
      <section className="bg-gradient-to-br from-[#164530] via-[#23583e] to-[#2f5d46] rounded-3xl p-6 sm:p-10 text-white shadow-lg relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#bceed0]/20 text-[#bceed0] border border-[#bceed0]/30 text-xs font-semibold mb-3">
            <span className="material-symbols-outlined text-[16px]">verified_user</span>
            <span>Personalised Dietary Ingredient Marketplace</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
            The right ingredients for {activeProfile.name}.
          </h1>

          <p className="text-sm sm:text-base text-[#bceed0]/90 mt-2 leading-relaxed">
            Multi-supermarket price comparison, transparent allergen verification, and clinical safety checks tailored to Singapore families, elderly care, and dietary lifestyles.
          </p>

          {/* Active Dietary Guardrails Strip */}
          <div className="mt-6 pt-5 border-t border-white/15">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[11px] uppercase tracking-wider text-[#bceed0] font-bold">
                Active Guardrails:
              </span>
              {activeProfile.healthConditions.map((cond, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-full bg-white/15 text-white text-[11px] font-semibold flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px] text-[#bceed0]">favorite</span>
                  {cond}
                </span>
              ))}
              {activeProfile.allergies.map((all, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-full bg-[#ffb4ab]/20 text-[#ffdbce] text-[11px] font-semibold flex items-center gap-1 border border-[#ffb4ab]/30"
                >
                  <span className="material-symbols-outlined text-[14px]">block</span>
                  Zero {all}
                </span>
              ))}
              {activeProfile.nutritionalGoals.maxSodiumMgPerServing && (
                <span className="px-2.5 py-1 rounded-full bg-white/15 text-white text-[11px] font-mono-data font-semibold">
                  Sodium &lt; {activeProfile.nutritionalGoals.maxSodiumMgPerServing}mg
                </span>
              )}
              <button
                type="button"
                onClick={() => onSelectTab('profile')}
                className="text-[11px] text-[#bceed0] hover:underline font-bold ml-1 cursor-pointer"
              >
                Edit &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Everyday Natural Language Search Queries */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#151d19]">
              Smart Dietary Search
            </h2>
            <p className="text-xs text-[#556057]">
              Explore ingredients using conversational natural language
            </p>
          </div>
          <button
            type="button"
            onClick={() => onSelectTab('discover')}
            className="text-xs font-bold text-[#164530] hover:underline cursor-pointer"
          >
            Open Full Marketplace &rarr;
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickSearchPrompts.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSearchPrompt(item.query)}
              className="p-3.5 rounded-2xl bg-white border border-[#e2eae2] hover:border-[#164530] hover:shadow-xs transition-all text-left group cursor-pointer flex flex-col justify-between"
            >
              <div className="w-8 h-8 rounded-xl bg-[#edf6ee] group-hover:bg-[#164530] text-[#164530] group-hover:text-white flex items-center justify-center transition-colors mb-2">
                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
              </div>
              <div>
                <span className="text-xs font-bold text-[#151d19] group-hover:text-[#164530] block leading-snug">
                  {item.label}
                </span>
                <span className="text-[10px] text-[#556057] mt-0.5 block">
                  Compare stores &rarr;
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Verified Safe Picks for Active Household Member */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#164530] uppercase tracking-wider mb-1">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>100% Verified Safe Picks</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#151d19]">
              Recommended for {activeProfile.name}
            </h2>
            <p className="text-xs text-[#556057]">
              Zero allergen conflicts and meets custom sodium & sugar limits
            </p>
          </div>

          <button
            type="button"
            onClick={() => onSelectTab('discover')}
            className="text-xs font-bold text-[#164530] hover:underline cursor-pointer self-start sm:self-auto"
          >
            View all matching items ({analyzedProducts.filter((p) => p.analysis.status === 'matches').length}) &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {safePicks.map(({ product, analysis }) => {
            const sortedPrices = [...product.retailers].sort((a, b) => a.priceSgd - b.priceSgd);
            const lowestPrice = sortedPrices[0];
            const lowestSupermarket = SUPERMARKETS.find((s) => s.id === lowestPrice.supermarketId);

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
                  </div>

                  <div className="mb-2">
                    <SuitabilityBadge analysis={analysis} compact onOpenDetails={() => onOpenProductModal(product)} />
                  </div>

                  <h3
                    onClick={() => onOpenProductModal(product)}
                    className="text-sm font-bold text-[#151d19] group-hover:text-[#164530] cursor-pointer line-clamp-2 leading-snug"
                  >
                    {product.name}
                  </h3>
                  <span className="text-[11px] text-[#556057] block mt-0.5">{product.packSize}</span>
                </div>

                <div className="mt-4 pt-3 border-t border-[#edf6ee]">
                  <div className="flex items-baseline justify-between mb-2">
                    <div>
                      <span className="text-[10px] text-[#556057] block">Best Price at {lowestSupermarket?.name}</span>
                      <span className="font-mono-data text-base font-bold text-[#164530]">
                        ${lowestPrice.priceSgd.toFixed(2)}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#717973] font-mono-data">
                      {lowestPrice.unitPrice}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => onAddToComparison(product)}
                      className="py-2 px-2 rounded-xl border border-[#dce5dd] text-[11px] font-bold text-[#414943] hover:bg-[#edf6ee] transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">compare_arrows</span>
                      <span>Compare</span>
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
      </section>

      {/* Multi-Supermarket Transparency Teaser Banner */}
      <section className="bg-[#f8fbf8] rounded-3xl p-6 sm:p-8 border border-[#e2eae2]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-5">
            <span className="text-xs uppercase font-bold tracking-wider text-[#9a4521] block mb-1">
              Multi-Supermarket Marketplace
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#151d19]">
              Never visit 3 supermarkets just to find the right ingredients.
            </h2>
            <p className="text-xs sm:text-sm text-[#414943] mt-2 leading-relaxed">
              We aggregate and cross-verify ingredients from Singapore's top supermarkets so you get the best price, guaranteed dietary safety, and consolidated home delivery.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {SUPERMARKETS.slice(0, 5).map((grocer) => (
              <div
                key={grocer.id}
                className="p-3.5 rounded-2xl bg-white border border-[#e2eae2] shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="material-symbols-outlined text-[#164530] text-[18px]">
                      {grocer.logoIcon}
                    </span>
                    <span className="text-xs font-bold text-[#151d19] truncate">{grocer.name}</span>
                  </div>
                  <p className="text-[10px] text-[#556057] line-clamp-2">{grocer.tagline}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#edf6ee] flex items-center justify-between text-[10px]">
                  <span className="font-semibold text-[#164530]">
                    {grocer.freeDeliveryThreshold > 0 ? `Free at $${grocer.freeDeliveryThreshold}` : 'Free Delivery'}
                  </span>
                  <span className="text-[#717973]">Next: Tomorrow</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clinical Dietitian Caregiver Advice for Aging & Illness */}
      <section className="bg-[#ffeed6]/50 rounded-3xl p-6 sm:p-8 border border-[#fcd39b]/70">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-[#9a4521] text-white flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[24px]">medical_services</span>
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#9a4521]">
              Caregiver Guidance & Nutrition Notes
            </span>
            <h3 className="text-base sm:text-lg font-bold text-[#380d00] mt-0.5">
              Cooking for Aging Parents Managing Chronic Illness
            </h3>
            <p className="text-xs sm:text-sm text-[#414943] mt-1.5 leading-relaxed">
              When cooking for parents with diabetes and high blood pressure, simple seasoning substitutions make the largest impact. Switching standard dark soy sauce (1280mg sodium) to Kikkoman Less Sodium (520mg) or San-J Organic Tamari immediately reduces vascular stress. Pairing meals with Low-GI rice like Kinmemai stabilizes post-dinner blood glucose without sacrificing the comfort of a warm family meal.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onSelectTab('recipes')}
                className="px-4 py-2 rounded-full bg-[#9a4521] hover:bg-[#7e3415] text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">skillet</span>
                <span>Browse Safe Singapore Recipes</span>
              </button>
              <button
                type="button"
                onClick={() => onSelectTab('profile')}
                className="px-4 py-2 rounded-full border border-[#9a4521] text-[#9a4521] hover:bg-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">tune</span>
                <span>Calibrate Dad's Sodium Targets</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
