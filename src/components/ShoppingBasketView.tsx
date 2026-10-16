import React from 'react';
import { ActiveTab, BasketItem, HouseholdMemberProfile, SupermarketId } from '../types';
import { SUPERMARKETS } from '../data/mockData';
import { evaluateProductSuitability } from '../services/suitabilityEngine';
import { SuitabilityBadge } from './SuitabilityBadge';

interface ShoppingBasketViewProps {
  basketItems: BasketItem[];
  activeProfile: HouseholdMemberProfile;
  householdProfiles: HouseholdMemberProfile[];
  onUpdateQuantity: (productId: string, retailerId: SupermarketId, delta: number) => void;
  onRemoveItem: (productId: string, retailerId: SupermarketId) => void;
  onSwitchRetailer: (productId: string, oldRetailerId: SupermarketId, newRetailerId: SupermarketId) => void;
  onProceedToCheckout: () => void;
  onSelectTab: (tab: ActiveTab) => void;
}

export const ShoppingBasketView: React.FC<ShoppingBasketViewProps> = ({
  basketItems,
  activeProfile,
  householdProfiles,
  onUpdateQuantity,
  onRemoveItem,
  onSwitchRetailer,
  onProceedToCheckout,
  onSelectTab,
}) => {
  // Group basket items by retailer
  const groupedByRetailer = SUPERMARKETS.map((superm) => {
    const items = basketItems.filter((item) => item.selectedRetailerId === superm.id);
    const subtotal = items.reduce((sum, item) => {
      const price = item.product.retailers.find((r) => r.supermarketId === superm.id)?.priceSgd || 0;
      return sum + price * item.quantity;
    }, 0);

    const isFreeDelivery = subtotal >= superm.freeDeliveryThreshold && subtotal > 0;
    const deliveryFee = items.length === 0 ? 0 : isFreeDelivery ? 0 : superm.standardDeliveryFee;
    const amountToFreeDelivery = Math.max(0, superm.freeDeliveryThreshold - subtotal);

    return {
      supermarket: superm,
      items,
      subtotal,
      deliveryFee,
      isFreeDelivery,
      amountToFreeDelivery,
      total: subtotal + deliveryFee,
    };
  }).filter((group) => group.items.length > 0);

  const overallItemsTotal = groupedByRetailer.reduce((acc, g) => acc + g.subtotal, 0);
  const overallDeliveryTotal = groupedByRetailer.reduce((acc, g) => acc + g.deliveryFee, 0);
  const grandTotal = overallItemsTotal + overallDeliveryTotal;

  if (basketItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#edf6ee] text-[#164530] flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-[32px]">shopping_basket</span>
        </div>
        <h2 className="text-2xl font-bold text-[#151d19]">Your Shopping Basket is Empty</h2>
        <p className="text-xs sm:text-sm text-[#556057] max-w-md mx-auto">
          Discover verified safe ingredients across Singapore supermarkets for {activeProfile.name}.
        </p>
        <button
          type="button"
          onClick={() => onSelectTab('discover')}
          className="mt-4 px-6 py-3 rounded-full bg-[#164530] hover:bg-[#2f5d46] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
        >
          Discover Ingredients &rarr;
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 pb-24">
      {/* Basket Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#edf6ee] pb-5">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#164530] font-bold">
            Unified Multi-Retailer Basket
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#151d19] mt-1">
            Shopping Basket ({basketItems.length} Products)
          </h1>
          <p className="text-xs sm:text-sm text-[#556057]">
            Items are fulfilled directly from their respective Singapore supermarkets with coordinated delivery slots.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onSelectTab('discover')}
          className="text-xs font-bold text-[#164530] hover:underline cursor-pointer self-start sm:self-auto"
        >
          + Add more ingredients
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Grouped Supermarket Orders (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {groupedByRetailer.map(({ supermarket, items, subtotal, deliveryFee, isFreeDelivery, amountToFreeDelivery }) => (
            <div
              key={supermarket.id}
              className="bg-white rounded-3xl border border-[#e2eae2] overflow-hidden shadow-xs"
            >
              {/* Supermarket Header Bar */}
              <div className="p-4 sm:p-5 bg-[#f8fbf8] border-b border-[#edf6ee] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white border border-[#dce5dd] flex items-center justify-center text-[#164530]">
                    <span className="material-symbols-outlined text-[18px]">{supermarket.logoIcon}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#151d19]">{supermarket.name}</h3>
                    <p className="text-[11px] text-[#556057]">Next available slot: {supermarket.nextAvailableSlot}</p>
                  </div>
                </div>

                {/* Free Delivery Threshold Meter */}
                <div className="text-right sm:max-w-xs">
                  <div className="text-[11px] font-bold">
                    {isFreeDelivery ? (
                      <span className="text-[#164530] flex items-center gap-1 sm:justify-end">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                        FREE Delivery Unlocked!
                      </span>
                    ) : (
                      <span className="text-[#9a4521]">
                        Add ${amountToFreeDelivery.toFixed(2)} more for Free Delivery
                      </span>
                    )}
                  </div>
                  <div className="w-full sm:w-40 h-1.5 rounded-full bg-[#dce5dd] overflow-hidden mt-1">
                    <div
                      className="h-full bg-[#164530] rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, (subtotal / supermarket.freeDeliveryThreshold) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Items List in this Supermarket */}
              <div className="p-4 sm:p-6 divide-y divide-[#edf6ee]">
                {items.map((item) => {
                  const targetProfile = householdProfiles.find((p) => p.id === item.forProfileId) || activeProfile;
                  const analysis = evaluateProductSuitability(item.product, targetProfile);
                  const currentPrice = item.product.retailers.find((r) => r.supermarketId === supermarket.id)?.priceSgd || 0;

                  // Check if another store is cheaper
                  const otherRetailers = item.product.retailers.filter((r) => r.supermarketId !== supermarket.id && r.inStock);
                  const cheaperAlternative = otherRetailers.find((r) => r.priceSgd < currentPrice);
                  const cheaperStore = cheaperAlternative ? SUPERMARKETS.find((s) => s.id === cheaperAlternative.supermarketId) : null;

                  return (
                    <div key={`${item.productId}-${supermarket.id}`} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3.5 flex-1 min-w-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 rounded-2xl bg-[#edf6ee] object-cover shrink-0 border border-[#dce5dd]"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-[#556057] uppercase tracking-wider">
                              {item.product.brand}
                            </span>
                            <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#edf6ee] text-[#164530] font-semibold">
                              For: {targetProfile.name}
                            </span>
                          </div>

                          <h4 className="text-xs sm:text-sm font-bold text-[#151d19] truncate mt-0.5">
                            {item.product.name}
                          </h4>
                          <span className="text-[11px] text-[#717973]">{item.product.packSize}</span>

                          {/* Suitability Badge Preview */}
                          <div className="mt-1">
                            <SuitabilityBadge analysis={analysis} compact />
                          </div>

                          {/* Cheaper alternative tip */}
                          {cheaperAlternative && cheaperStore && (
                            <div className="mt-2 text-[10px] text-[#164530] bg-[#edf6ee] p-1.5 rounded-lg inline-flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[14px]">savings</span>
                              <span>
                                Available at <strong>{cheaperStore.name}</strong> for ${cheaperAlternative.priceSgd.toFixed(2)} (Save ${(currentPrice - cheaperAlternative.priceSgd).toFixed(2)})
                              </span>
                              <button
                                type="button"
                                onClick={() => onSwitchRetailer(item.productId, supermarket.id, cheaperAlternative.supermarketId)}
                                className="font-bold underline cursor-pointer ml-1 text-[#003920]"
                              >
                                Switch Store
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Quantity Stepper & Price */}
                      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                        <div className="flex items-center rounded-full border border-[#dce5dd] bg-[#edf6ee] p-0.5">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.productId, supermarket.id, -1)}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-[#151d19] hover:bg-white cursor-pointer font-bold text-xs"
                          >
                            -
                          </button>
                          <span className="w-7 text-center text-xs font-bold font-mono-data">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.productId, supermarket.id, 1)}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-[#151d19] hover:bg-white cursor-pointer font-bold text-xs"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right min-w-[70px]">
                          <span className="font-mono-data text-sm font-bold text-[#164530] block">
                            ${(currentPrice * item.quantity).toFixed(2)}
                          </span>
                          <span className="text-[10px] text-[#717973]">
                            ${currentPrice.toFixed(2)} each
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.productId, supermarket.id)}
                          className="text-[#ba1a1a] hover:bg-[#ffdad6] p-1.5 rounded-full cursor-pointer transition-colors"
                          title="Remove item"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Supermarket subtotal footer */}
              <div className="px-5 py-3 bg-[#f8fbf8] border-t border-[#edf6ee] flex items-center justify-between text-xs text-[#556057]">
                <span>
                  Delivery charge: {deliveryFee === 0 ? <strong className="text-[#164530]">FREE</strong> : `$${deliveryFee.toFixed(2)} SGD`}
                </span>
                <span className="font-bold text-[#151d19]">
                  {supermarket.name} Subtotal: ${(subtotal + deliveryFee).toFixed(2)} SGD
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Multi-Store Order Summary & Checkout Card (4 Cols) */}
        <div className="lg:col-span-4 sticky top-24">
          <div className="bg-white rounded-3xl border border-[#e2eae2] p-6 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-[#151d19]">Consolidated Checkout Summary</h3>

            {/* Breakdown per store */}
            <div className="space-y-2 text-xs text-[#414943] border-b border-[#edf6ee] pb-4">
              {groupedByRetailer.map(({ supermarket, subtotal, deliveryFee }) => (
                <div key={supermarket.id} className="flex justify-between py-1">
                  <span>{supermarket.name} ({subtotal >= supermarket.freeDeliveryThreshold ? 'Free Ship' : '+$' + deliveryFee}):</span>
                  <span className="font-mono-data font-bold text-[#151d19]">
                    ${(subtotal + deliveryFee).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total figures */}
            <div className="space-y-2 text-xs font-mono-data">
              <div className="flex justify-between text-[#556057]">
                <span>Total Items Subtotal:</span>
                <span className="font-bold text-[#151d19]">${overallItemsTotal.toFixed(2)} SGD</span>
              </div>
              <div className="flex justify-between text-[#556057]">
                <span>Combined Delivery Fees:</span>
                <span className={overallDeliveryTotal === 0 ? 'text-[#164530] font-bold' : 'text-[#151d19] font-bold'}>
                  {overallDeliveryTotal === 0 ? 'FREE ($0.00)' : `$${overallDeliveryTotal.toFixed(2)} SGD`}
                </span>
              </div>

              <div className="pt-3 border-t border-[#edf6ee] flex justify-between items-baseline text-sm">
                <span className="font-sans font-bold text-[#151d19]">Estimated Order Total:</span>
                <span className="text-lg font-bold text-[#164530]">${grandTotal.toFixed(2)} SGD</span>
              </div>
            </div>

            {/* Caregiver peace of mind notice */}
            <div className="p-3 rounded-2xl bg-[#edf6ee] border border-[#dce5dd] text-[11px] text-[#2f5d46] flex items-start gap-2">
              <span className="material-symbols-outlined text-[16px] text-[#164530] shrink-0 mt-0.5">
                verified_user
              </span>
              <span>
                <strong>Dietary Guarantee:</strong> Substitutions will never be made automatically if a product conflicts with {activeProfile.name}'s declared restrictions.
              </span>
            </div>

            <button
              type="button"
              onClick={onProceedToCheckout}
              className="w-full py-4 rounded-full bg-[#164530] hover:bg-[#2f5d46] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Delivery & Checkout</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
