import React, { useState } from 'react';
import { HouseholdMemberProfile, Product, SupermarketId } from '../types';
import { SUPERMARKETS } from '../data/mockData';
import { evaluateProductSuitability } from '../services/suitabilityEngine';
import { SuitabilityBadge } from './SuitabilityBadge';

interface ProductDetailModalProps {
  product: Product | null;
  activeProfile: HouseholdMemberProfile;
  onClose: () => void;
  onAddToBasket: (product: Product, retailerId: SupermarketId, quantity: number) => void;
  onAddToComparison?: (product: Product) => void;
  isInComparison?: boolean;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  activeProfile,
  onClose,
  onAddToBasket,
  onAddToComparison,
  isInComparison = false,
}) => {
  if (!product) return null;

  const analysis = evaluateProductSuitability(product, activeProfile);
  const [selectedRetailerId, setSelectedRetailerId] = useState<SupermarketId>(
    product.retailers.find((r) => r.inStock)?.supermarketId || product.retailers[0]?.supermarketId || 'fairprice'
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [addedToast, setAddedToast] = useState(false);

  const selectedRetailer = product.retailers.find((r) => r.supermarketId === selectedRetailerId) || product.retailers[0];
  const supermarketMeta = SUPERMARKETS.find((s) => s.id === selectedRetailerId) || SUPERMARKETS[0];

  const handleAdd = () => {
    onAddToBasket(product, selectedRetailerId, quantity);
    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#e2eae2] my-auto animate-in zoom-in-95 duration-200">
        {/* Modal Top Header with Close */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-[#edf6ee] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#556057] uppercase tracking-wider">
              {product.category}
            </span>
            <span className="text-xs text-[#c0c9c1]">/</span>
            <span className="text-xs font-bold text-[#164530]">{product.brand}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#414943] hover:bg-[#edf6ee] transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {/* Main Product Header Details */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-5 bg-[#edf6ee] rounded-2xl overflow-hidden aspect-square border border-[#dce5dd] relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 flex flex-col gap-1">
                {product.healthBadges.map((badge, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-[10px] font-bold text-[#164530] shadow-2xs border border-[#bceed0]"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            <div className="md:col-span-7 flex flex-col justify-between h-full">
              <div>
                <span className="text-xs text-[#556057] font-semibold">{product.packSize}</span>
                <h1 className="text-xl sm:text-2xl font-bold text-[#151d19] leading-snug mt-0.5">
                  {product.name}
                </h1>
                <p className="text-xs sm:text-sm text-[#414943] mt-2 leading-relaxed">
                  {product.description}
                </p>

                {/* Suitability Banner */}
                <div className="mt-4">
                  <SuitabilityBadge analysis={analysis} />
                </div>
              </div>

              {/* Data Verification Quality Seal */}
              <div className="mt-5 p-3 rounded-xl bg-[#edf6ee]/70 border border-[#dce5dd] flex items-center gap-2.5 text-xs text-[#2f5d46]">
                <span className="material-symbols-outlined text-[20px] text-[#164530] shrink-0">
                  verified
                </span>
                <div className="flex-1 min-w-0">
                  <span className="font-bold block text-[#151d19]">{product.dataQuality.verifiedBy}</span>
                  <span className="text-[11px] text-[#556057]">
                    Last audited {product.dataQuality.lastAudited} · SFA & HPB Singapore compliant
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Transparent Dietary Suitability Breakdown */}
          <div className="p-5 rounded-2xl bg-[#f8fbf8] border border-[#e2eae2]">
            <h3 className="text-sm font-bold text-[#151d19] flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-[#164530] text-[18px]">
                policy
              </span>
              <span>Transparent Safety & Suitability Engine: Shopping for {activeProfile.name}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Positive matches */}
              <div className="p-3 rounded-xl bg-white border border-[#bceed0] space-y-1">
                <span className="text-[11px] font-bold text-[#164530] flex items-center gap-1 uppercase tracking-wide">
                  <span className="material-symbols-outlined text-[14px]">check</span>
                  Matches Profile ({analysis.matchingPoints.length})
                </span>
                {analysis.matchingPoints.length > 0 ? (
                  <ul className="text-xs text-[#2f5d46] space-y-1">
                    {analysis.matchingPoints.map((pt, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-[#164530] font-bold">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-[#717973] italic">No specific positive matches</p>
                )}
              </div>

              {/* Warnings / Check needed */}
              <div className="p-3 rounded-xl bg-white border border-[#fcd39b] space-y-1">
                <span className="text-[11px] font-bold text-[#804700] flex items-center gap-1 uppercase tracking-wide">
                  <span className="material-symbols-outlined text-[14px]">warning</span>
                  Notices to Check ({analysis.warningPoints.length})
                </span>
                {analysis.warningPoints.length > 0 ? (
                  <ul className="text-xs text-[#683b00] space-y-1">
                    {analysis.warningPoints.map((pt, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-[#804700] font-bold">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-[#717973] italic">No precautionary warnings</p>
                )}
              </div>

              {/* Conflicts */}
              <div className="p-3 rounded-xl bg-white border border-[#ffb4ab] space-y-1">
                <span className="text-[11px] font-bold text-[#93000a] flex items-center gap-1 uppercase tracking-wide">
                  <span className="material-symbols-outlined text-[14px]">cancel</span>
                  Restriction Conflicts ({analysis.conflictPoints.length})
                </span>
                {analysis.conflictPoints.length > 0 ? (
                  <ul className="text-xs text-[#93000a] space-y-1 font-semibold">
                    {analysis.conflictPoints.map((pt, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span>•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-[#164530] italic">Zero declared conflicts!</p>
                )}
              </div>
            </div>
          </div>

          {/* Section: Multi-Supermarket Price & Availability Comparison */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-[#151d19]">
                  Multi-Supermarket Marketplace Comparison
                </h3>
                <p className="text-xs text-[#556057]">
                  Prices and stock synced directly from Singapore grocers
                </p>
              </div>

              {onAddToComparison && (
                <button
                  type="button"
                  onClick={() => onAddToComparison(product)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1 ${
                    isInComparison
                      ? 'bg-[#164530] text-white border-[#164530]'
                      : 'border-[#dce5dd] text-[#414943] hover:bg-[#edf6ee]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">compare_arrows</span>
                  <span>{isInComparison ? 'In Comparison Tray' : 'Compare Similar'}</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {product.retailers.map((ret) => {
                const superm = SUPERMARKETS.find((s) => s.id === ret.supermarketId);
                const isSelected = selectedRetailerId === ret.supermarketId;

                return (
                  <div
                    key={ret.supermarketId}
                    onClick={() => ret.inStock && setSelectedRetailerId(ret.supermarketId)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'border-[#164530] bg-[#edf6ee]/60 shadow-xs ring-2 ring-[#164530]/20'
                        : ret.inStock
                        ? 'border-[#e2eae2] bg-white hover:border-[#bceed0]'
                        : 'border-[#e2eae2] bg-[#f9fbf9] opacity-60 cursor-not-allowed'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#164530] text-white flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                    )}

                    <span className="text-xs font-bold text-[#151d19] block">{superm?.name}</span>
                    <span className="text-[10px] text-[#556057] block">{ret.unitPrice}</span>

                    <div className="mt-2 flex items-baseline gap-1.5">
                      <span className="font-mono-data text-lg font-bold text-[#164530]">
                        ${ret.priceSgd.toFixed(2)}
                      </span>
                      {ret.originalPriceSgd && (
                        <span className="font-mono-data text-xs text-[#717973] line-through">
                          ${ret.originalPriceSgd.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <div className="mt-2 pt-2 border-t border-[#edf6ee] flex items-center justify-between text-[10px]">
                      <span className={`font-semibold ${ret.inStock ? 'text-[#164530]' : 'text-[#ba1a1a]'}`}>
                        {ret.stockLevel}
                      </span>
                      <span className="text-[#717973]">{ret.lastUpdated}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Ingredients & Allergens Disclosure */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-2xl bg-[#edf6ee]/50 border border-[#dce5dd]">
              <h4 className="text-xs font-bold text-[#151d19] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#164530]">checklist</span>
                <span>Full Verified Ingredients List</span>
              </h4>
              <p className="text-xs text-[#151d19] leading-relaxed">
                {product.ingredientsList.join(', ')}
              </p>

              <div className="mt-3 pt-3 border-t border-[#dce5dd]/60 space-y-1.5">
                <div className="text-xs text-[#151d19]">
                  <strong className="text-[#9a4521]">Declared Allergens:</strong>{' '}
                  {product.declaredAllergens.length > 0
                    ? product.declaredAllergens.join(', ')
                    : 'None declared by manufacturer'}
                </div>

                {product.precautionaryStatements.length > 0 && (
                  <div className="text-xs text-[#683b00] bg-[#ffeed6] p-2 rounded-lg">
                    <strong>Precautionary Notice:</strong> {product.precautionaryStatements.join('. ')}
                  </div>
                )}
              </div>
            </div>

            {/* Nutrition Facts Table */}
            <div className="p-4 rounded-2xl bg-white border border-[#e2eae2]">
              <h4 className="text-xs font-bold text-[#151d19] uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Nutrition Facts</span>
                <span className="text-[11px] text-[#556057] normal-case">
                  Per {product.nutritionFacts.servingSize}
                </span>
              </h4>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-[#edf6ee]">
                  <span className="text-[#556057]">Calories</span>
                  <span className="font-mono-data font-bold text-[#151d19]">
                    {product.nutritionFacts.calories} kcal
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#edf6ee]">
                  <span className="text-[#556057]">Protein</span>
                  <span className="font-mono-data font-bold text-[#164530]">
                    {product.nutritionFacts.proteinG}g
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#edf6ee]">
                  <span className="text-[#556057]">Total Carbohydrates</span>
                  <span className="font-mono-data font-semibold text-[#151d19]">
                    {product.nutritionFacts.totalCarbG}g
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#edf6ee] pl-3">
                  <span className="text-[#556057]">Sugars</span>
                  <span className={`font-mono-data font-bold ${
                    product.nutritionFacts.sugarsG > 5 ? 'text-[#9a4521]' : 'text-[#164530]'
                  }`}>
                    {product.nutritionFacts.sugarsG}g
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#edf6ee]">
                  <span className="text-[#556057]">Sodium</span>
                  <span className={`font-mono-data font-bold ${
                    product.nutritionFacts.sodiumMg > 400 ? 'text-[#9a4521]' : 'text-[#164530]'
                  }`}>
                    {product.nutritionFacts.sodiumMg} mg
                  </span>
                </div>
                {product.nutritionFacts.potassiumMg && (
                  <div className="flex justify-between py-1 border-b border-[#edf6ee]">
                    <span className="text-[#556057]">Potassium</span>
                    <span className="font-mono-data font-semibold text-[#151d19]">
                      {product.nutritionFacts.potassiumMg} mg
                    </span>
                  </div>
                )}
                {product.nutritionFacts.glycemicIndex && (
                  <div className="flex justify-between py-1 pt-1.5">
                    <span className="text-[#556057]">Glycemic Index</span>
                    <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                      product.nutritionFacts.glycemicIndex === 'Low'
                        ? 'bg-[#bceed0] text-[#003920]'
                        : 'bg-[#ffeed6] text-[#683b00]'
                    }`}>
                      {product.nutritionFacts.glycemicIndex} GI
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="sticky bottom-0 z-10 bg-white/95 backdrop-blur-md px-6 py-4 border-t border-[#edf6ee] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div>
              <span className="text-[10px] text-[#556057] block">Selected Grocer</span>
              <span className="text-xs font-bold text-[#151d19]">{supermarketMeta.name}</span>
            </div>
            <div className="h-6 w-px bg-[#dce5dd]"></div>
            <div>
              <span className="text-[10px] text-[#556057] block">Total ({quantity}x)</span>
              <span className="font-mono-data text-lg font-bold text-[#164530]">
                ${(selectedRetailer.priceSgd * quantity).toFixed(2)} SGD
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Quantity stepper */}
            <div className="flex items-center rounded-full border border-[#dce5dd] bg-[#edf6ee] p-1">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#151d19] hover:bg-white cursor-pointer font-bold"
              >
                -
              </button>
              <span className="w-8 text-center text-xs font-bold font-mono-data">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#151d19] hover:bg-white cursor-pointer font-bold"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              disabled={!selectedRetailer.inStock}
              className={`flex-1 sm:flex-none px-6 py-3 rounded-full text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                selectedRetailer.inStock
                  ? 'bg-[#164530] hover:bg-[#2f5d46] text-white'
                  : 'bg-[#dce5dd] text-[#717973] cursor-not-allowed'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {addedToast ? 'check' : 'add_shopping_cart'}
              </span>
              <span>{addedToast ? 'Added to Basket!' : `Add to ${supermarketMeta.name}`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
