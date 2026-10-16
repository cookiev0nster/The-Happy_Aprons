import React, { useState } from 'react';
import { ConsolidatedCartItem, ElderlyProfileState, GrocerId } from '../types';
import { ELDERLY_RECIPES, GROCER_OPTIONS } from '../data/mockData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ElderlyProfileState;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  profile,
}) => {
  const [activeGrocerId, setActiveGrocerId] = useState<GrocerId>(profile.selectedGrocer);
  const [copiedWhatsapp, setCopiedWhatsapp] = useState(false);
  const [purchasedIds, setPurchasedIds] = useState<string[]>([]);

  if (!isOpen) return null;

  const currentGrocer =
    GROCER_OPTIONS.find((g) => g.id === activeGrocerId) || GROCER_OPTIONS[0];

  // Consolidate all ingredients from the planned weekly recipes scaled by elderlyCount
  const consolidatedItems: ConsolidatedCartItem[] = [
    {
      id: 'item-threadfin',
      name: 'Fresh Chilled Threadfin (Ngoh He) Fillet',
      totalQuantity: `${140 * profile.elderlyCount * 3}g`,
      category: 'protein',
      estimatedCostSgd: 3.6 * profile.elderlyCount * 3,
      singaporeSearchTerm: 'fresh threadfin fillet',
      usedInMeals: [
        { day: 'Mon', mealSlot: 'breakfast', recipeTitle: 'Teochew Threadfin Porridge' },
        { day: 'Thu', mealSlot: 'breakfast', recipeTitle: 'Teochew Threadfin Porridge' },
        { day: 'Sun', mealSlot: 'breakfast', recipeTitle: 'Teochew Threadfin Porridge' },
      ],
      helperNotes: 'Ask uncle at wet market or fish counter to de-bone 100% and remove skin.',
    },
    {
      id: 'item-egg-tofu',
      name: 'Unicurd Japanese Egg Tofu Tubes',
      totalQuantity: `${2 * profile.elderlyCount} tubes`,
      category: 'protein',
      estimatedCostSgd: 1.4 * profile.elderlyCount * 2,
      singaporeSearchTerm: 'unicurd egg tofu tube',
      usedInMeals: [
        { day: 'Mon', mealSlot: 'lunch', recipeTitle: 'Steamed Silken Egg Tofu' },
        { day: 'Fri', mealSlot: 'lunch', recipeTitle: 'Steamed Silken Egg Tofu' },
      ],
      helperNotes: 'Slice into gentle medallions, steam for only 6 minutes.',
    },
    {
      id: 'item-minced-chicken',
      name: 'Kee Song Fresh Minced Chicken Breast',
      totalQuantity: `${110 * profile.elderlyCount * 2}g`,
      category: 'protein',
      estimatedCostSgd: 1.8 * profile.elderlyCount * 2,
      singaporeSearchTerm: 'kee song minced chicken',
      usedInMeals: [
        { day: 'Mon', mealSlot: 'lunch', recipeTitle: 'Steamed Silken Egg Tofu' },
        { day: 'Fri', mealSlot: 'lunch', recipeTitle: 'Steamed Silken Egg Tofu' },
      ],
      helperNotes: 'Double mince or knead with cornstarch so it stays moist for swallowing.',
    },
    {
      id: 'item-barramundi',
      name: 'Kühlbarra Singapore Barramundi Fillets',
      totalQuantity: `${150 * profile.elderlyCount * 2}g`,
      category: 'protein',
      estimatedCostSgd: 4.2 * profile.elderlyCount * 2,
      singaporeSearchTerm: 'kuhlbarra barramundi fillet',
      usedInMeals: [
        { day: 'Tue', mealSlot: 'lunch', recipeTitle: 'Steamed Herbal Barramundi' },
        { day: 'Sat', mealSlot: 'lunch', recipeTitle: 'Steamed Herbal Barramundi' },
      ],
      helperNotes: 'Check for pin bones along lateral line with clean fingers.',
    },
    {
      id: 'item-salmon',
      name: 'Norwegian Atlantic Salmon Center-Cut Fillet',
      totalQuantity: `${150 * profile.elderlyCount * 2}g`,
      category: 'protein',
      estimatedCostSgd: 4.6 * profile.elderlyCount * 2,
      singaporeSearchTerm: 'fresh norwegian salmon fillet',
      usedInMeals: [
        { day: 'Wed', mealSlot: 'dinner', recipeTitle: 'Poached Salmon in Dill Broth' },
        { day: 'Sat', mealSlot: 'dinner', recipeTitle: 'Poached Salmon in Dill Broth' },
      ],
      helperNotes: 'Skinless center-cut preferred. Poach gently on low flame.',
    },
    {
      id: 'item-pumpkin',
      name: 'Japanese Sweet Kabocha Pumpkin',
      totalQuantity: `${100 * profile.elderlyCount * 2}g`,
      category: 'produce',
      estimatedCostSgd: 0.9 * profile.elderlyCount * 2,
      singaporeSearchTerm: 'japanese pumpkin kabocha',
      usedInMeals: [
        { day: 'Tue', mealSlot: 'breakfast', recipeTitle: 'Silken Pumpkin Chicken Congee' },
        { day: 'Fri', mealSlot: 'breakfast', recipeTitle: 'Silken Pumpkin Chicken Congee' },
      ],
      helperNotes: 'Steam until soft and mash directly into congee.',
    },
    {
      id: 'item-cauliflower',
      name: 'Fresh White Cauliflower Heads',
      totalQuantity: `${140 * profile.elderlyCount * 2}g`,
      category: 'produce',
      estimatedCostSgd: 1.1 * profile.elderlyCount * 2,
      singaporeSearchTerm: 'fresh white cauliflower',
      usedInMeals: [
        { day: 'Wed', mealSlot: 'dinner', recipeTitle: 'Poached Salmon with Cauliflower Mash' },
        { day: 'Sat', mealSlot: 'dinner', recipeTitle: 'Poached Salmon with Cauliflower Mash' },
      ],
      helperNotes: 'Steam for 10 minutes and blend into silky smooth mash.',
    },
    {
      id: 'item-old-cucumber',
      name: 'Fresh Pasar Old Cucumber (Lao Huang Gua)',
      totalQuantity: `${150 * profile.elderlyCount * 2}g`,
      category: 'produce',
      estimatedCostSgd: 1.1 * profile.elderlyCount * 2,
      singaporeSearchTerm: 'old cucumber pasar',
      usedInMeals: [
        { day: 'Mon', mealSlot: 'dinner', recipeTitle: 'Double-Boiled Old Cucumber Soup' },
        { day: 'Fri', mealSlot: 'dinner', recipeTitle: 'Double-Boiled Old Cucumber Soup' },
      ],
      helperNotes: 'Scrape away all seeds completely before cutting into soft cubes.',
    },
    {
      id: 'item-beancurd-skin',
      name: 'Fresh Beancurd Skin (Tau Kee)',
      totalQuantity: `${30 * profile.elderlyCount * 2}g`,
      category: 'produce',
      estimatedCostSgd: 0.8 * profile.elderlyCount * 2,
      singaporeSearchTerm: 'fresh beancurd skin tau kee',
      usedInMeals: [
        { day: 'Tue', mealSlot: 'supper', recipeTitle: 'Warm Soya Milk with Tau Kee' },
        { day: 'Thu', mealSlot: 'supper', recipeTitle: 'Warm Soya Milk with Tau Kee' },
      ],
    },
    {
      id: 'item-red-beans',
      name: 'Premium Azuki Red Beans & Seedless Lotus Seeds',
      totalQuantity: `${40 * profile.elderlyCount * 4}g`,
      category: 'grains',
      estimatedCostSgd: 0.9 * profile.elderlyCount * 4,
      singaporeSearchTerm: 'azuki red beans seedless lotus',
      usedInMeals: [
        { day: 'Mon', mealSlot: 'supper', recipeTitle: 'Lotus Seed Red Bean Soup' },
        { day: 'Wed', mealSlot: 'supper', recipeTitle: 'Lotus Seed Red Bean Soup' },
        { day: 'Fri', mealSlot: 'supper', recipeTitle: 'Lotus Seed Red Bean Soup' },
        { day: 'Sun', mealSlot: 'supper', recipeTitle: 'Lotus Seed Red Bean Soup' },
      ],
      helperNotes: 'Pressure cook until velvety. Sweeten with monkfruit only.',
    },
    {
      id: 'item-soya-milk',
      name: 'NutriSoy High Calcium Reduced Sugar Soya Milk (1L)',
      totalQuantity: `${profile.elderlyCount >= 3 ? 3 : 2} cartons`,
      category: 'pantry',
      estimatedCostSgd: 2.8 * (profile.elderlyCount >= 3 ? 3 : 2),
      singaporeSearchTerm: 'nutrisoy high calcium soya milk 1L',
      usedInMeals: [
        { day: 'Wed', mealSlot: 'breakfast', recipeTitle: 'Kopitiam Soft Eggs & Pau' },
        { day: 'Tue', mealSlot: 'supper', recipeTitle: 'Warm Soya Milk with Tau Kee' },
      ],
    },
    {
      id: 'item-sesame-oil',
      name: 'Chee Seng Pure Toasted Sesame Oil (375ml)',
      totalQuantity: '1 bottle',
      category: 'pantry',
      estimatedCostSgd: 5.6,
      singaporeSearchTerm: 'chee seng pure toasted sesame oil',
      usedInMeals: [
        { day: 'Mon', mealSlot: 'breakfast', recipeTitle: 'Teochew Fish Porridge' },
        { day: 'Tue', mealSlot: 'lunch', recipeTitle: 'Steamed Herbal Barramundi' },
      ],
    },
  ];

  const totalCartCost = consolidatedItems
    .reduce((sum, item) => sum + item.estimatedCostSgd, 0)
    .toFixed(2);

  const meetsFreeDelivery = parseFloat(totalCartCost) >= currentGrocer.freeDeliveryThreshold;
  const amountToFreeDelivery = (
    currentGrocer.freeDeliveryThreshold - parseFloat(totalCartCost)
  ).toFixed(2);

  const togglePurchased = (id: string) => {
    setPurchasedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleCopyWhatsAppList = () => {
    const lines = [
      `🛒 *Elderly Weekly Grocery List (${currentGrocer.name})*`,
      `For: ${profile.elderlyCount} Senior(s) | Texture: ${profile.textureLevel}`,
      `Total Est: ~$${totalCartCost} SGD`,
      '',
      '*Fresh Proteins & Fish:*',
      ...consolidatedItems
        .filter((i) => i.category === 'protein')
        .map(
          (i) =>
            `• ${i.name} — ${i.totalQuantity} (~$${i.estimatedCostSgd.toFixed(2)})${
              i.helperNotes ? `\n  ⚠️ Note: ${i.helperNotes}` : ''
            }`
        ),
      '',
      '*Fresh Produce & Vegetables:*',
      ...consolidatedItems
        .filter((i) => i.category === 'produce')
        .map(
          (i) =>
            `• ${i.name} — ${i.totalQuantity} (~$${i.estimatedCostSgd.toFixed(2)})${
              i.helperNotes ? `\n  ⚠️ Note: ${i.helperNotes}` : ''
            }`
        ),
      '',
      '*Grains & Pantry:*',
      ...consolidatedItems
        .filter((i) => i.category === 'grains' || i.category === 'pantry')
        .map((i) => `• ${i.name} — ${i.totalQuantity} (~$${i.estimatedCostSgd.toFixed(2)})`),
      '',
      `Direct Online Store: ${currentGrocer.homeUrl}`,
    ];

    navigator.clipboard?.writeText(lines.join('\n'));
    setCopiedWhatsapp(true);
    setTimeout(() => setCopiedWhatsapp(false), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        role="button"
        tabIndex={0}
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Enter' && onClose()}
        aria-label="Close Shopping Cart Drawer"
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity cursor-pointer"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-white shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="px-6 py-5 bg-[#edf6ee] border-b border-[#dce5dd] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#164530] text-[24px]">
                local_mall
              </span>
              <div>
                <h2 className="font-bold text-lg text-[#151d19]">
                  Singapore Supermarket Shopping Basket
                </h2>
                <p className="text-xs text-[#414943]">
                  Scaled for {profile.elderlyCount} {profile.elderlyCount === 1 ? 'elderly' : 'elders'} across 7 days of meals
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close cart drawer"
              className="w-8 h-8 rounded-full border border-[#dce5dd] flex items-center justify-center text-[#414943] hover:bg-white transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Supermarket Selection Tabs */}
          <div className="px-6 py-3 border-b border-[#e2eae2] bg-[#f3fcf3]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#164530]">
                Choose Singapore Supermarket
              </span>
              <span className="text-[11px] text-[#414943]">{currentGrocer.deliveryTime}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {GROCER_OPTIONS.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setActiveGrocerId(g.id)}
                  className={`py-2 px-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                    activeGrocerId === g.id
                      ? 'border-[#164530] bg-[#164530] text-white shadow-xs'
                      : 'border-[#e2eae2] bg-white text-[#414943] hover:border-[#164530]/40'
                  }`}
                >
                  <span className="font-bold text-xs block leading-tight truncate">
                    {g.name.split(' ')[0]}
                  </span>
                  <span
                    className={`text-[10px] block mt-0.5 ${
                      activeGrocerId === g.id ? 'text-[#bceed0]' : 'text-[#164530]'
                    }`}
                  >
                    Free over ${g.freeDeliveryThreshold}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Delivery & Spend Status Strip */}
          <div className="px-6 py-3 bg-[#edf6ee]/70 border-b border-[#e2eae2] flex items-center justify-between text-xs">
            <div>
              <span className="text-[#414943]">Estimated Basket: </span>
              <strong className="text-[#164530] font-mono-data text-sm font-bold">
                ${totalCartCost} SGD
              </strong>
            </div>
            {meetsFreeDelivery ? (
              <span className="text-[#164530] font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>Eligible for Free Delivery!</span>
              </span>
            ) : (
              <span className="text-[#9a4521] font-medium">
                Add ${amountToFreeDelivery} for free delivery on {currentGrocer.name}
              </span>
            )}
          </div>

          {/* Itemized List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#151d19]">
                Consolidated Ingredients ({consolidatedItems.length} Items)
              </span>
              <button
                type="button"
                onClick={handleCopyWhatsAppList}
                className="text-xs font-bold text-[#164530] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">send_to_mobile</span>
                <span>{copiedWhatsapp ? 'Copied WhatsApp List!' : 'Share WhatsApp List for Helper'}</span>
              </button>
            </div>

            <div className="divide-y divide-[#e2eae2] border border-[#e2eae2] rounded-2xl overflow-hidden bg-white">
              {consolidatedItems.map((item) => {
                const isChecked = purchasedIds.includes(item.id);
                const searchUrl = `${currentGrocer.searchUrlTemplate}${encodeURIComponent(
                  item.singaporeSearchTerm
                )}`;

                return (
                  <div
                    key={item.id}
                    className={`p-4 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isChecked ? 'bg-[#f3fcf3]/70 opacity-60' : 'hover:bg-[#f3fcf3]/40'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => togglePurchased(item.id)}
                        aria-label={`Mark ${item.name} as purchased`}
                        className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center text-xs cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-[#164530] border-[#164530] text-white'
                            : 'border-[#414943]/40 bg-white'
                        }`}
                      >
                        {isChecked && '✓'}
                      </button>

                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold text-sm ${
                              isChecked ? 'line-through text-[#414943]' : 'text-[#151d19]'
                            }`}
                          >
                            {item.name}
                          </span>
                          <span className="text-[10px] text-[#414943] uppercase bg-[#edf6ee] px-1.5 py-0.2 rounded">
                            {item.category}
                          </span>
                        </div>

                        {item.helperNotes && (
                          <p className="text-xs text-[#9a4521] mt-0.5">
                            ⚠️ <em>{item.helperNotes}</em>
                          </p>
                        )}

                        <span className="text-[11px] text-[#414943] block mt-1">
                          Used in: {item.usedInMeals.map((m) => `${m.day} ${m.mealSlot}`).join(', ')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pl-8 sm:pl-0 shrink-0">
                      <div className="text-right">
                        <span className="font-mono-data text-sm font-bold text-[#164530] block">
                          {item.totalQuantity}
                        </span>
                        <span className="text-[11px] text-[#414943] block">
                          ~${item.estimatedCostSgd.toFixed(2)} SGD
                        </span>
                      </div>

                      {/* 1-click Link to Singapore Grocer Search */}
                      <a
                        href={searchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 rounded-lg border border-[#dce5dd] bg-[#edf6ee] hover:bg-[#164530] text-[#164530] hover:text-white text-xs font-semibold transition-all flex items-center gap-1 shrink-0"
                      >
                        <span>Buy on {currentGrocer.name.split(' ')[0]}</span>
                        <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Drawer Footer with Supermarket Checkout Links */}
          <div className="p-6 bg-[#edf6ee] border-t border-[#dce5dd] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-[#414943] block">Total Estimated Weekly Spend</span>
                <span className="text-xs text-[#414943]">
                  {profile.elderlyCount} {profile.elderlyCount === 1 ? 'Senior' : 'Seniors'} ·{' '}
                  {profile.activeMealSlots.length} meals/day
                </span>
              </div>
              <span className="font-mono-data text-2xl font-bold text-[#164530]">
                ${totalCartCost} SGD
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleCopyWhatsAppList}
                className="w-full py-2.5 rounded-xl border border-[#dce5dd] bg-white hover:bg-[#f3fcf3] text-xs font-bold text-[#164530] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">chat</span>
                <span>{copiedWhatsapp ? 'Copied WhatsApp!' : 'Copy for Helper / WhatsApp'}</span>
              </button>

              <a
                href={currentGrocer.homeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-[#164530] hover:bg-[#23583f] text-white text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-2 text-center"
              >
                <span>Open {currentGrocer.name}</span>
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
