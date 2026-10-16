import React from 'react';
import { HouseholdMemberProfile, Product, SupermarketId } from '../types';
import { SUPERMARKETS } from '../data/mockData';
import { evaluateProductSuitability } from '../services/suitabilityEngine';
import { SuitabilityBadge } from './SuitabilityBadge';

interface ProductComparisonModalProps {
  products: Product[];
  activeProfile: HouseholdMemberProfile;
  onClose: () => void;
  onRemoveProduct: (productId: string) => void;
  onAddToBasket: (product: Product, retailerId: SupermarketId, quantity: number) => void;
}

export const ProductComparisonModal: React.FC<ProductComparisonModalProps> = ({
  products,
  activeProfile,
  onClose,
  onRemoveProduct,
  onAddToBasket,
}) => {
  if (products.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#e2eae2] my-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-[#edf6ee] flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#151d19] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#164530]">compare_arrows</span>
              <span>Side-by-Side Ingredient Comparison</span>
            </h2>
            <p className="text-xs text-[#556057]">
              Evaluating against <strong>{activeProfile.name}</strong>'s dietary guardrails
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#414943] hover:bg-[#edf6ee] cursor-pointer"
            aria-label="Close dialog"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Comparison Grid */}
        <div className="p-6 overflow-x-auto">
          <div className="min-w-[650px] grid grid-cols-4 gap-4">
            {/* Left metric headers column */}
            <div className="col-span-1 pt-48 space-y-4 text-xs font-bold text-[#556057] uppercase tracking-wider">
              <div className="h-10 flex items-center">Suitability Status</div>
              <div className="h-10 flex items-center border-t border-[#edf6ee]">Best Retailer Price</div>
              <div className="h-10 flex items-center border-t border-[#edf6ee]">Sodium Content</div>
              <div className="h-10 flex items-center border-t border-[#edf6ee]">Sugar Content</div>
              <div className="h-10 flex items-center border-t border-[#edf6ee]">Protein</div>
              <div className="h-10 flex items-center border-t border-[#edf6ee]">Glycemic Index</div>
              <div className="h-14 flex items-center border-t border-[#edf6ee]">Declared Allergens</div>
              <div className="h-14 flex items-center border-t border-[#edf6ee]">Action</div>
            </div>

            {/* Product columns */}
            {products.map((prod) => {
              const analysis = evaluateProductSuitability(prod, activeProfile);
              const sortedPrices = [...prod.retailers].sort((a, b) => a.priceSgd - b.priceSgd);
              const bestPrice = sortedPrices[0];
              const bestSupermarket = SUPERMARKETS.find((s) => s.id === bestPrice.supermarketId);

              return (
                <div key={prod.id} className="col-span-1 bg-[#f9fbf9] p-4 rounded-2xl border border-[#e2eae2] flex flex-col justify-between">
                  <div>
                    {/* Remove button */}
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold text-[#556057] uppercase tracking-wider">
                        {prod.brand}
                      </span>
                      <button
                        type="button"
                        onClick={() => onRemoveProduct(prod.id)}
                        className="text-[11px] text-[#ba1a1a] hover:underline cursor-pointer font-semibold"
                      >
                        Remove
                      </button>
                    </div>

                    {/* Image & Title */}
                    <div className="h-28 rounded-xl bg-white overflow-hidden mb-2 border border-[#dce5dd]">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xs font-bold text-[#151d19] line-clamp-2 h-8">
                      {prod.name}
                    </h3>
                    <span className="text-[11px] text-[#556057] block mb-3">{prod.packSize}</span>

                    {/* Metrics values aligned with left column */}
                    <div className="space-y-4 text-xs mt-4">
                      {/* 1. Suitability */}
                      <div className="h-10 flex items-center">
                        <SuitabilityBadge analysis={analysis} compact />
                      </div>

                      {/* 2. Best Price */}
                      <div className="h-10 flex flex-col justify-center border-t border-[#edf6ee]">
                        <div className="flex items-baseline gap-1 font-mono-data font-bold text-[#164530]">
                          <span>${bestPrice.priceSgd.toFixed(2)}</span>
                          <span className="text-[10px] text-[#556057] font-normal">at {bestSupermarket?.name}</span>
                        </div>
                        <span className="text-[10px] text-[#717973]">{bestPrice.unitPrice}</span>
                      </div>

                      {/* 3. Sodium */}
                      <div className="h-10 flex items-center border-t border-[#edf6ee] font-mono-data font-bold">
                        <span className={prod.nutritionFacts.sodiumMg > 400 ? 'text-[#9a4521]' : 'text-[#164530]'}>
                          {prod.nutritionFacts.sodiumMg} mg
                        </span>
                      </div>

                      {/* 4. Sugar */}
                      <div className="h-10 flex items-center border-t border-[#edf6ee] font-mono-data font-bold">
                        <span className={prod.nutritionFacts.sugarsG > 5 ? 'text-[#9a4521]' : 'text-[#164530]'}>
                          {prod.nutritionFacts.sugarsG} g
                        </span>
                      </div>

                      {/* 5. Protein */}
                      <div className="h-10 flex items-center border-t border-[#edf6ee] font-mono-data font-bold text-[#164530]">
                        {prod.nutritionFacts.proteinG} g
                      </div>

                      {/* 6. GI */}
                      <div className="h-10 flex items-center border-t border-[#edf6ee]">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#edf6ee] text-[#164530]">
                          {prod.nutritionFacts.glycemicIndex || 'Unrated'}
                        </span>
                      </div>

                      {/* 7. Declared Allergens */}
                      <div className="h-14 flex items-center border-t border-[#edf6ee] text-[11px] text-[#151d19]">
                        {prod.declaredAllergens.length > 0 ? prod.declaredAllergens.join(', ') : 'None'}
                      </div>

                      {/* 8. Action */}
                      <div className="h-14 flex items-center border-t border-[#edf6ee]">
                        <button
                          type="button"
                          onClick={() => onAddToBasket(prod, bestPrice.supermarketId, 1)}
                          className="w-full py-2 rounded-xl bg-[#164530] hover:bg-[#2f5d46] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                          <span>Add from ${bestPrice.priceSgd.toFixed(2)}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
