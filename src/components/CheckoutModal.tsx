import React, { useState } from 'react';
import { BasketItem, DeliveryAddress, HouseholdMemberProfile, Order, RetailerSubOrder } from '../types';
import { SAMPLE_DELIVERY_ADDRESSES, SUPERMARKETS } from '../data/mockData';

interface CheckoutModalProps {
  basketItems: BasketItem[];
  activeProfile: HouseholdMemberProfile;
  onClose: () => void;
  onOrderPlaced: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  basketItems,
  activeProfile,
  onClose,
  onOrderPlaced,
}) => {
  const [selectedAddressId, setSelectedAddressId] = useState<string>(SAMPLE_DELIVERY_ADDRESSES[0].id);
  const [deliveryInstructions, setDeliveryInstructions] = useState(
    SAMPLE_DELIVERY_ADDRESSES[0].specialInstructions || 'Elderly resident. Please call prior to delivery.'
  );
  const [selectedPayment, setSelectedPayment] = useState<'paynow' | 'paylah' | 'card'>('paylah');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<Order | null>(null);

  // Group items to compute sub-orders
  const activeRetailerIds = Array.from(new Set(basketItems.map((b) => b.selectedRetailerId)));
  const subOrders: RetailerSubOrder[] = activeRetailerIds.map((retailerId) => {
    const supermarket = SUPERMARKETS.find((s) => s.id === retailerId) || SUPERMARKETS[0];
    const itemsInStore = basketItems.filter((b) => b.selectedRetailerId === retailerId);
    const subtotal = itemsInStore.reduce((acc, b) => {
      const price = b.product.retailers.find((r) => r.supermarketId === retailerId)?.priceSgd || 0;
      return acc + price * b.quantity;
    }, 0);
    const deliveryFee = subtotal >= supermarket.freeDeliveryThreshold ? 0 : supermarket.standardDeliveryFee;

    return {
      retailerId,
      items: itemsInStore.map((b) => {
        const price = b.product.retailers.find((r) => r.supermarketId === retailerId)?.priceSgd || 0;
        return {
          productId: b.productId,
          productName: b.product.name,
          brand: b.product.brand,
          packSize: b.product.packSize,
          image: b.product.image,
          priceSgd: price,
          quantity: b.quantity,
          retailerId,
          suitabilityStatus: 'matches',
        };
      }),
      subtotal,
      deliveryFee,
      deliverySlot: supermarket.nextAvailableSlot,
      status: 'Packing',
      estimatedArrival: 'Tomorrow, within chosen delivery window',
    };
  });

  const totalAmount = subOrders.reduce((sum, s) => sum + s.subtotal + s.deliveryFee, 0);
  const currentAddress = SAMPLE_DELIVERY_ADDRESSES.find((a) => a.id === selectedAddressId) || SAMPLE_DELIVERY_ADDRESSES[0];

  const handlePlaceOrder = () => {
    setIsPlacingOrder(true);
    setTimeout(() => {
      const newOrder: Order = {
        id: `ord-${Date.now().toString().slice(-4)}`,
        orderNumber: `NM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: 'Just now',
        totalAmount,
        subOrders,
        deliveryAddress: {
          ...currentAddress,
          specialInstructions: deliveryInstructions,
        },
        paymentMethod: selectedPayment === 'paylah' ? 'DBS PayLah! (Simulated)' : selectedPayment === 'paynow' ? 'PayNow Singapore (Simulated)' : 'Credit Card (Simulated)',
        overallStatus: 'In Progress',
      };
      setOrderConfirmed(newOrder);
      setIsPlacingOrder(false);
      onOrderPlaced(newOrder);
    }, 1200);
  };

  if (orderConfirmed) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#e2eae2] my-auto text-center space-y-6 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-[#bceed0] text-[#003920] flex items-center justify-center mx-auto shadow-sm">
            <span className="material-symbols-outlined text-[36px]">check_circle</span>
          </div>

          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-[#edf6ee] text-[#164530] text-xs font-mono-data font-bold mb-2">
              Order #{orderConfirmed.orderNumber}
            </div>
            <h2 className="text-2xl font-bold text-[#151d19]">
              Groceries Dispatched to Supermarkets!
            </h2>
            <p className="text-xs sm:text-sm text-[#556057] mt-1 max-w-md mx-auto leading-relaxed">
              Your dietary order has been coordinated with {orderConfirmed.subOrders.length} Singapore supermarkets for delivery to <strong>{orderConfirmed.deliveryAddress.recipientName}</strong>.
            </p>
          </div>

          {/* Sub-orders Status Cards */}
          <div className="space-y-3 text-left">
            {orderConfirmed.subOrders.map((sub) => {
              const superm = SUPERMARKETS.find((s) => s.id === sub.retailerId);
              return (
                <div key={sub.retailerId} className="p-3.5 rounded-2xl bg-[#f8fbf8] border border-[#e2eae2] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#164530] text-[20px]">
                      {superm?.logoIcon}
                    </span>
                    <div>
                      <span className="font-bold text-[#151d19] block">{superm?.name}</span>
                      <span className="text-[11px] text-[#556057]">{sub.items.length} items · Slot: {sub.deliverySlot}</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#bceed0] text-[#003920] font-bold text-[10px]">
                    Packing Now
                  </span>
                </div>
              );
            })}
          </div>

          {/* Elderly recipient note reminder */}
          <div className="p-3.5 rounded-2xl bg-[#ffeed6] border border-[#fcd39b] text-left text-xs text-[#683b00] flex items-start gap-2">
            <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">notification_important</span>
            <div>
              <strong>Delivery Caregiver Instruction Staged:</strong>
              <p className="text-[11px] mt-0.5">{orderConfirmed.deliveryAddress.specialInstructions}</p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 rounded-full bg-[#164530] hover:bg-[#2f5d46] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              Track in Saved & Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#e2eae2] my-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-[#edf6ee] flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#151d19] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#164530]">local_shipping</span>
              <span>Home Delivery & Checkout</span>
            </h2>
            <p className="text-xs text-[#556057]">
              Fulfilling dietary orders for <strong>{activeProfile.name}</strong>
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

        <div className="p-6 sm:p-8 space-y-6">
          {/* Section 1: Address selection */}
          <div>
            <h3 className="text-xs font-bold text-[#151d19] uppercase tracking-wider mb-2.5">
              1. Delivery Address (Singapore)
            </h3>
            <div className="space-y-2.5">
              {SAMPLE_DELIVERY_ADDRESSES.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => {
                    setSelectedAddressId(addr.id);
                    if (addr.specialInstructions) setDeliveryInstructions(addr.specialInstructions);
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    selectedAddressId === addr.id
                      ? 'border-[#164530] bg-[#edf6ee]/60 ring-2 ring-[#164530]/20'
                      : 'border-[#e2eae2] bg-white hover:border-[#bceed0]'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[#164530] text-[20px] mt-0.5">
                      {addr.id === 'addr-parents' ? 'elderly' : 'home'}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#151d19]">{addr.label}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#dce5dd] text-[#151d19] font-medium">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#414943] mt-0.5">
                        {addr.recipientName} ({addr.phone})
                      </p>
                      <p className="text-xs text-[#717973]">
                        {addr.addressLine1}, {addr.unitNumber}, Singapore {addr.postalCode}
                      </p>
                    </div>
                  </div>
                  {selectedAddressId === addr.id && (
                    <span className="w-5 h-5 rounded-full bg-[#164530] text-white flex items-center justify-center text-xs shrink-0">
                      ✓
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Caregiver Delivery Instructions */}
          <div>
            <label className="text-xs font-bold text-[#151d19] uppercase tracking-wider block mb-1.5">
              2. Special Caregiver Delivery Instructions
            </label>
            <textarea
              rows={2}
              value={deliveryInstructions}
              onChange={(e) => setDeliveryInstructions(e.target.value)}
              placeholder="e.g. Recipient is elderly. Please knock loudly or call. Do not leave fresh items unattended."
              className="w-full p-3 rounded-xl border border-[#dce5dd] text-xs text-[#151d19] focus:outline-none focus:border-[#164530]"
            />
          </div>

          {/* Section 3: Supermarket Delivery Slots Preview */}
          <div>
            <h3 className="text-xs font-bold text-[#151d19] uppercase tracking-wider mb-2.5">
              3. Supermarket Delivery Scheduling
            </h3>
            <div className="space-y-2">
              {subOrders.map((sub) => {
                const superm = SUPERMARKETS.find((s) => s.id === sub.retailerId);
                return (
                  <div key={sub.retailerId} className="p-3 rounded-xl bg-[#f8fbf8] border border-[#e2eae2] flex items-center justify-between text-xs">
                    <span className="font-bold text-[#151d19]">{superm?.name}</span>
                    <span className="font-mono-data text-[#164530] font-semibold bg-[#edf6ee] px-2.5 py-1 rounded-md">
                      {sub.deliverySlot}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 4: Safe Substitution Policy */}
          <div className="p-4 rounded-2xl bg-[#edf6ee]/70 border border-[#dce5dd] text-xs text-[#2f5d46]">
            <div className="flex items-center gap-1.5 font-bold text-[#151d19] mb-1">
              <span className="material-symbols-outlined text-[18px] text-[#164530]">shield_with_heart</span>
              <span>Allergen & Dietary Safe Substitution Guarantee</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              If an item is out of stock at any supermarket, our system will <strong>never</strong> substitute with a product that contains {activeProfile.allergies.join(', ') || 'unverified allergens'} without direct phone confirmation.
            </p>
          </div>

          {/* Section 5: Simulated Payment Method */}
          <div>
            <h3 className="text-xs font-bold text-[#151d19] uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>4. Payment Method</span>
              <span className="text-[10px] text-[#717973] normal-case">
                Prototype Simulation (No real charges)
              </span>
            </h3>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'paylah', label: 'DBS PayLah!', icon: 'account_balance_wallet' },
                { id: 'paynow', label: 'PayNow SG', icon: 'qr_code_scanner' },
                { id: 'card', label: 'Credit Card', icon: 'credit_card' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedPayment(m.id as any)}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                    selectedPayment === m.id
                      ? 'border-[#164530] bg-[#edf6ee] text-[#164530] shadow-2xs'
                      : 'border-[#dce5dd] text-[#414943] hover:bg-[#f8fbf8]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{m.icon}</span>
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-10 bg-white/95 backdrop-blur-md px-6 py-4 border-t border-[#edf6ee] flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] text-[#556057] block">Total Payable ({subOrders.length} Stores)</span>
            <span className="font-mono-data text-xl font-bold text-[#164530]">
              ${totalAmount.toFixed(2)} SGD
            </span>
          </div>

          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder}
            className="px-6 py-3.5 rounded-full bg-[#164530] hover:bg-[#2f5d46] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isPlacingOrder ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Confirming Order...</span>
              </>
            ) : (
              <>
                <span>Place Dietary Grocery Order</span>
                <span className="material-symbols-outlined text-[18px]">verified</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
