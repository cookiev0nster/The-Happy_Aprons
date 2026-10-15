import React from 'react';
import { ProfileState } from '../types';
import { GROCER_OPTIONS } from '../data/mockData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileState;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  profile,
}) => {
  if (!isOpen) return null;

  const currentGrocer = GROCER_OPTIONS.find((g) => g.id === profile.grocer) || GROCER_OPTIONS[0];

  const cartItems = [
    { name: 'Fresh Atlantic Salmon Fillets (380g)', category: 'Proteins', price: 16.80, days: 'Mon' },
    { name: 'Kühlbarra SG Barramundi Fillets (400g)', category: 'Proteins', price: 18.20, days: 'Wed' },
    { name: 'Fresh Skinless Chicken Breast (450g)', category: 'Proteins', price: 9.50, days: 'Tue' },
    { name: 'Organic Firm Pressed Tofu (450g)', category: 'Proteins', price: 3.40, days: 'Thu' },
    { name: 'Fresh Asparagus Bunch (250g)', category: 'Fresh Produce', price: 4.90, days: 'Mon, Wed (Shared)' },
    { name: 'Baby Bok Choy / Xiao Bai Cai (250g)', category: 'Fresh Produce', price: 2.20, days: 'Tue' },
    { name: 'Fresh Broccolini Bunch (200g)', category: 'Fresh Produce', price: 5.20, days: 'Wed' },
    { name: 'Fresh Shiitake Mushrooms (180g)', category: 'Fresh Produce', price: 3.80, days: 'Thu' },
    { name: 'Fresh Scallions / Spring Onions (150g)', category: 'Fresh Produce', price: 1.60, days: 'Tue, Wed (Shared)' },
    { name: 'Old Ginger Root (150g pack)', category: 'Fresh Produce', price: 1.40, days: 'Tue, Thu (Shared)' },
    { name: 'Organic Lemon (Single)', category: 'Fresh Produce', price: 1.10, days: 'Mon' },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const deliveryFee = subtotal >= currentGrocer.freeDeliveryThreshold ? 0 : 5.99;
  const total = subtotal + deliveryFee;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-[#e2eae2] animate-in slide-in-from-right duration-300">
        {/* Cart Header */}
        <div className="p-5 border-b border-[#edf6ee] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#edf6ee] flex items-center justify-center text-[#164530]">
              <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-[#151d19]">Smart Grocery Basket</h2>
              <p className="text-[11px] text-[#414943]">
                Auto-matched to <strong>{currentGrocer.name}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart drawer"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#414943] hover:bg-[#edf6ee] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Zero waste guarantee strip */}
        <div className="bg-[#bceed0]/40 px-5 py-2.5 border-b border-[#bceed0]/60 flex items-center gap-2 text-xs text-[#002113]">
          <span className="material-symbols-outlined text-[18px] text-[#164530]">recycling</span>
          <span>
            <strong>94% Zero-Waste:</strong> Scallions & Ginger split across 3 dinners.
          </span>
        </div>

        {/* Item List */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#414943] mb-1">
            Ingredients for {profile.activeDays.length} Weeknight Dinners
          </div>

          {cartItems.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-[#edf6ee]/50 border border-[#dce5dd]/60 flex items-center justify-between text-xs"
            >
              <div className="flex-1 pr-2">
                <span className="font-semibold text-[#151d19] block">{item.name}</span>
                <span className="text-[10px] text-[#164530] font-medium">{item.days}</span>
              </div>
              <span className="font-mono-data font-bold text-[#151d19]">
                ${item.price.toFixed(2)}
              </span>
            </div>
          ))}

          {/* Deducted Staples notice */}
          <div className="p-3 rounded-xl bg-white border border-dashed border-[#c0c9c1] text-xs text-[#414943]">
            <div className="flex items-center gap-1.5 text-[#164530] font-bold mb-1">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              Pantry Staples Automatically Deducted ($0.00)
            </div>
            <p className="text-[11px]">
              Light soy sauce, toasted sesame oil, garlic, and jasmine rice detected in your kitchen atelier and omitted.
            </p>
          </div>
        </div>

        {/* Checkout Summary */}
        <div className="p-5 border-t border-[#edf6ee] bg-[#fbfdfb]">
          <div className="space-y-1.5 text-xs text-[#414943] font-mono-data mb-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="text-[#151d19] font-bold">${subtotal.toFixed(2)} SGD</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee ({currentGrocer.name}):</span>
              <span className={deliveryFee === 0 ? 'text-[#164530] font-bold' : 'text-[#151d19]'}>
                {deliveryFee === 0 ? 'FREE ($79+ Met)' : `$${deliveryFee.toFixed(2)} SGD`}
              </span>
            </div>
            <div className="flex justify-between text-sm text-[#151d19] font-bold pt-2 border-t border-[#edf6ee]">
              <span>Estimated Weekly Total:</span>
              <span className="text-[#164530] font-mono-data text-base">${total.toFixed(2)} SGD</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              alert(`Cart exported to ${currentGrocer.name}! Your items are staged for Sunday evening delivery.`);
              onClose();
            }}
            className="w-full py-3.5 rounded-full bg-[#164530] hover:bg-[#2f5d46] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Proceed to {currentGrocer.name} Checkout</span>
            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
          </button>
        </div>
      </div>
    </div>
  );
};
