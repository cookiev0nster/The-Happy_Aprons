import React, { useState } from 'react';
import { HouseholdMemberProfile, Order, Product, SavedList, SupermarketId } from '../types';
import { PRODUCTS, SAMPLE_SAVED_LISTS, SUPERMARKETS } from '../data/mockData';

interface OrdersAndSavedViewProps {
  orders: Order[];
  savedLists: SavedList[];
  activeProfile: HouseholdMemberProfile;
  onOpenProductModal: (product: Product) => void;
  onAddToBasket: (product: Product, retailerId: SupermarketId, quantity: number) => void;
  onReorder: (order: Order) => void;
}

export const OrdersAndSavedView: React.FC<OrdersAndSavedViewProps> = ({
  orders,
  savedLists,
  activeProfile,
  onOpenProductModal,
  onAddToBasket,
  onReorder,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'orders' | 'saved'>('orders');
  const [reorderedOrderId, setReorderedOrderId] = useState<string | null>(null);

  const handleReorderClick = (order: Order) => {
    onReorder(order);
    setReorderedOrderId(order.id);
    setTimeout(() => {
      setReorderedOrderId(null);
    }, 2500);
  };

  const handleAddEntireList = (list: SavedList) => {
    const listProducts = PRODUCTS.filter((p) => list.productIds.includes(p.id));
    for (const p of listProducts) {
      const best = [...p.retailers].sort((a, b) => a.priceSgd - b.priceSgd)[0];
      if (best) {
        onAddToBasket(p, best.supermarketId, 1);
      }
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6 pb-24">
      {/* Header & Sub-Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#edf6ee] pb-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#164530] font-bold">
            Caregiver Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#151d19] mt-1">
            Orders & Saved Care Lists
          </h1>
          <p className="text-xs sm:text-sm text-[#556057]">
            Track multi-supermarket deliveries, reorder weekly pantry staples, and manage dietary lists.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 p-1 bg-[#edf6ee] rounded-full border border-[#dce5dd]">
          <button
            type="button"
            onClick={() => setActiveSubTab('orders')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'orders'
                ? 'bg-[#164530] text-white shadow-2xs'
                : 'text-[#414943] hover:text-[#151d19]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">receipt_long</span>
            <span>Orders ({orders.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('saved')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'saved'
                ? 'bg-[#164530] text-white shadow-2xs'
                : 'text-[#414943] hover:text-[#151d19]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">bookmark</span>
            <span>Saved Lists ({savedLists.length})</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'orders' ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-[#e2eae2] p-5 sm:p-6 shadow-xs space-y-5"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#edf6ee] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono-data font-bold text-sm text-[#151d19]">
                      Order #{order.orderNumber}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        order.overallStatus === 'Delivered'
                          ? 'bg-[#edf6ee] text-[#164530]'
                          : 'bg-[#ffeed6] text-[#683b00]'
                      }`}
                    >
                      {order.overallStatus}
                    </span>
                  </div>
                  <p className="text-xs text-[#556057] mt-0.5">
                    Placed on {order.createdAt} · Delivering to {order.deliveryAddress.recipientName} ({order.deliveryAddress.label})
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-[#556057] block">Total Amount</span>
                    <span className="font-mono-data text-base font-bold text-[#164530]">
                      ${order.totalAmount.toFixed(2)} SGD
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleReorderClick(order)}
                    className="px-4 py-2 rounded-full bg-[#edf6ee] hover:bg-[#164530] text-[#164530] hover:text-white border border-[#dce5dd] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {reorderedOrderId === order.id ? 'check' : 'repeat'}
                    </span>
                    <span>{reorderedOrderId === order.id ? 'Reordered to Basket!' : '1-Click Reorder'}</span>
                  </button>
                </div>
              </div>

              {/* Sub-Orders by Supermarket */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {order.subOrders.map((sub) => {
                  const superm = SUPERMARKETS.find((s) => s.id === sub.retailerId);
                  return (
                    <div
                      key={sub.retailerId}
                      className="p-4 rounded-2xl bg-[#f8fbf8] border border-[#e2eae2] flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#164530] text-[18px]">
                              {superm?.logoIcon}
                            </span>
                            <span className="text-xs font-bold text-[#151d19]">{superm?.name}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-[#bceed0] text-[#003920] text-[10px] font-bold">
                            {sub.status}
                          </span>
                        </div>

                        {/* Items preview */}
                        <div className="space-y-2 mb-3">
                          {sub.items.map((it, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                              <span className="text-[#151d19] truncate pr-2">
                                {it.quantity}x {it.productName}
                              </span>
                              <span className="font-mono-data font-semibold text-[#164530] shrink-0">
                                ${(it.priceSgd * it.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#edf6ee] flex items-center justify-between text-[11px] text-[#556057]">
                        <span>Delivery Slot: {sub.deliverySlot}</span>
                        <span className="font-bold text-[#151d19]">
                          Subtotal: ${(sub.subtotal + sub.deliveryFee).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Special Delivery Instructions reminder */}
              {order.deliveryAddress.specialInstructions && (
                <div className="text-xs text-[#556057] bg-[#edf6ee] p-3 rounded-xl flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#164530] text-[18px]">info</span>
                  <span><strong>Driver Instructions:</strong> {order.deliveryAddress.specialInstructions}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedLists.map((list) => {
            const listProducts = PRODUCTS.filter((p) => list.productIds.includes(p.id));

            return (
              <div
                key={list.id}
                className="bg-white rounded-3xl border border-[#e2eae2] p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all"
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-[#edf6ee] text-[#164530] flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-[20px]">{list.icon}</span>
                  </div>
                  <h3 className="text-base font-bold text-[#151d19]">{list.title}</h3>
                  <p className="text-xs text-[#556057] mt-1 leading-relaxed">{list.description}</p>

                  {/* List preview items */}
                  <div className="mt-4 pt-3 border-t border-[#edf6ee] space-y-2">
                    {listProducts.slice(0, 4).map((p) => (
                      <div
                        key={p.id}
                        onClick={() => onOpenProductModal(p)}
                        className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-[#edf6ee] cursor-pointer transition-colors"
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-8 h-8 rounded-lg object-cover bg-[#edf6ee] border border-[#dce5dd]"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-semibold text-[#151d19] truncate block">
                            {p.name}
                          </span>
                          <span className="text-[10px] text-[#717973]">{p.packSize}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-[#edf6ee]">
                  <button
                    type="button"
                    onClick={() => handleAddEntireList(list)}
                    className="w-full py-2.5 rounded-full bg-[#164530] hover:bg-[#2f5d46] text-white text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                    <span>Add All ({listProducts.length}) to Basket</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
