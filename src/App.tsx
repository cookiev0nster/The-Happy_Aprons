/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ActiveTab,
  BasketItem,
  HouseholdMemberProfile,
  Order,
  Product,
  SavedList,
  SupermarketId,
} from './types';
import {
  DEFAULT_HOUSEHOLD_PROFILES,
  PRODUCTS,
  SAMPLE_ORDERS,
  SAMPLE_SAVED_LISTS,
} from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { MedicalDisclaimerBanner } from './components/MedicalDisclaimerBanner';
import { HomeDashboard } from './components/HomeDashboard';
import { DiscoverSearch } from './components/DiscoverSearch';
import { RecipesView } from './components/RecipesView';
import { ShoppingBasketView } from './components/ShoppingBasketView';
import { OrdersAndSavedView } from './components/OrdersAndSavedView';
import { DietaryProfileView } from './components/DietaryProfileView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ProductComparisonModal } from './components/ProductComparisonModal';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { TalkToUsView } from './components/TalkToUsView';

export default function App() {
  // Navigation & Profile State
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [householdProfiles, setHouseholdProfiles] = useState<HouseholdMemberProfile[]>(DEFAULT_HOUSEHOLD_PROFILES);
  const [activeProfile, setActiveProfile] = useState<HouseholdMemberProfile>(DEFAULT_HOUSEHOLD_PROFILES[0]);

  // Catalog & Marketplace State
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [searchPromptQuery, setSearchPromptQuery] = useState<string>('');
  const [comparisonList, setComparisonList] = useState<Product[]>([]);

  // Basket & Orders State
  const [basketItems, setBasketItems] = useState<BasketItem[]>([
    {
      productId: 'prod-kikkoman-low-sodium',
      product: PRODUCTS[0],
      selectedRetailerId: 'fairprice',
      quantity: 1,
      forProfileId: 'prof-dad',
    },
    {
      productId: 'prod-kuhlbarra-barramundi',
      product: PRODUCTS[3],
      selectedRetailerId: 'fairprice',
      quantity: 1,
      forProfileId: 'prof-dad',
    },
    {
      productId: 'prod-fresh-baby-bokchoy',
      product: PRODUCTS[9],
      selectedRetailerId: 'shengsiong',
      quantity: 2,
      forProfileId: 'prof-dad',
    },
  ]);
  const [orders, setOrders] = useState<Order[]>(SAMPLE_ORDERS);
  const [savedLists, setSavedLists] = useState<SavedList[]>(SAMPLE_SAVED_LISTS);

  // Modals
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Tab Navigation Handler
  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add / Update Basket
  const handleAddToBasket = (product: Product, retailerId: SupermarketId, quantity = 1) => {
    setBasketItems((prev) => {
      const existingIdx = prev.findIndex(
        (b) => b.productId === product.id && b.selectedRetailerId === retailerId
      );
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx].quantity += quantity;
        return copy;
      }
      return [
        ...prev,
        {
          productId: product.id,
          product,
          selectedRetailerId: retailerId,
          quantity,
          forProfileId: activeProfile.id,
        },
      ];
    });
  };

  const handleUpdateQuantity = (productId: string, retailerId: SupermarketId, delta: number) => {
    setBasketItems((prev) => {
      return prev
        .map((item) => {
          if (item.productId === productId && item.selectedRetailerId === retailerId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter((item): item is BasketItem => item !== null);
    });
  };

  const handleRemoveFromBasket = (productId: string, retailerId: SupermarketId) => {
    setBasketItems((prev) =>
      prev.filter((item) => !(item.productId === productId && item.selectedRetailerId === retailerId))
    );
  };

  const handleSwitchRetailer = (productId: string, oldRetailerId: SupermarketId, newRetailerId: SupermarketId) => {
    setBasketItems((prev) =>
      prev.map((item) => {
        if (item.productId === productId && item.selectedRetailerId === oldRetailerId) {
          return { ...item, selectedRetailerId: newRetailerId };
        }
        return item;
      })
    );
  };

  // Comparison Handlers
  const handleToggleComparison = (product: Product) => {
    setComparisonList((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), product];
      }
      return [...prev, product];
    });
  };

  const handleRemoveFromComparison = (productId: string) => {
    setComparisonList((prev) => prev.filter((p) => p.id !== productId));
  };

  // Profile Handlers
  const handleUpdateProfile = (updated: HouseholdMemberProfile) => {
    setActiveProfile(updated);
    setHouseholdProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleAddNewProfile = (newProfile: HouseholdMemberProfile) => {
    setHouseholdProfiles((prev) => [...prev, newProfile]);
    setActiveProfile(newProfile);
  };

  // Admin Catalog Update
  const handleUpdateProductInCatalog = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    if (selectedProductDetail?.id === updated.id) {
      setSelectedProductDetail(updated);
    }
  };

  const handleAddNewProductToCatalog = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  // Reorder flow
  const handleReorder = (order: Order) => {
    for (const sub of order.subOrders) {
      for (const item of sub.items) {
        const prod = products.find((p) => p.id === item.productId);
        if (prod) {
          handleAddToBasket(prod, item.retailerId, item.quantity);
        }
      }
    }
    setActiveTab('basket');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Total basket item count
  const totalBasketCount = basketItems.reduce((acc, it) => acc + it.quantity, 0);

  return (
    <div className="bg-[#f3fcf3] min-h-screen text-[#151d19] font-sans flex flex-col selection:bg-[#bceed0] selection:text-[#002113]">
      {/* 1. Header with brand, household switcher, desktop nav, and basket count */}
      <Header
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        activeProfile={activeProfile}
        householdProfiles={householdProfiles}
        onSelectProfile={(p) => setActiveProfile(p)}
        basketCount={totalBasketCount}
        onOpenBasket={() => handleSelectTab('basket')}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      {/* 2. Medical & Dietary Safety Disclaimer Banner */}
      <MedicalDisclaimerBanner />

      {/* 3. Main Views Router */}
      <main className="w-full flex-1">
        {activeTab === 'home' && (
          <HomeDashboard
            activeProfile={activeProfile}
            onSelectTab={handleSelectTab}
            onOpenProductModal={(p) => setSelectedProductDetail(p)}
            onAddToBasket={handleAddToBasket}
            onSearchPrompt={(query) => {
              setSearchPromptQuery(query);
              handleSelectTab('discover');
            }}
            onAddToComparison={handleToggleComparison}
          />
        )}

        {activeTab === 'discover' && (
          <DiscoverSearch
            activeProfile={activeProfile}
            initialQuery={searchPromptQuery}
            onOpenProductModal={(p) => setSelectedProductDetail(p)}
            onAddToBasket={handleAddToBasket}
            comparisonList={comparisonList}
            onToggleComparison={handleToggleComparison}
            onOpenComparisonModal={() => setIsComparisonModalOpen(true)}
            onClearComparison={() => setComparisonList([])}
          />
        )}

        {activeTab === 'recipes' && (
          <RecipesView
            activeProfile={activeProfile}
            onOpenProductModal={(p) => setSelectedProductDetail(p)}
            onAddToBasket={handleAddToBasket}
          />
        )}

        {activeTab === 'basket' && (
          <ShoppingBasketView
            basketItems={basketItems}
            activeProfile={activeProfile}
            householdProfiles={householdProfiles}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveFromBasket}
            onSwitchRetailer={handleSwitchRetailer}
            onProceedToCheckout={() => setIsCheckoutModalOpen(true)}
            onSelectTab={handleSelectTab}
          />
        )}

        {activeTab === 'saved-orders' && (
          <OrdersAndSavedView
            orders={orders}
            savedLists={savedLists}
            activeProfile={activeProfile}
            onOpenProductModal={(p) => setSelectedProductDetail(p)}
            onAddToBasket={handleAddToBasket}
            onReorder={handleReorder}
          />
        )}

        {activeTab === 'profile' && (
          <DietaryProfileView
            householdProfiles={householdProfiles}
            activeProfile={activeProfile}
            onSelectProfile={(p) => setActiveProfile(p)}
            onUpdateProfile={handleUpdateProfile}
            onAddNewProfile={handleAddNewProfile}
          />
        )}

        {activeTab === 'talk-to-us' && (
          <TalkToUsView />
        )}
      </main>

      {/* 4. Product Details Modal */}
      {selectedProductDetail && (
        <ProductDetailModal
          product={selectedProductDetail}
          activeProfile={activeProfile}
          onClose={() => setSelectedProductDetail(null)}
          onAddToBasket={handleAddToBasket}
          onAddToComparison={handleToggleComparison}
          isInComparison={comparisonList.some((p) => p.id === selectedProductDetail.id)}
        />
      )}

      {/* 5. Product Side-by-Side Comparison Modal */}
      {isComparisonModalOpen && (
        <ProductComparisonModal
          products={comparisonList}
          activeProfile={activeProfile}
          onClose={() => setIsComparisonModalOpen(false)}
          onRemoveProduct={handleRemoveFromComparison}
          onAddToBasket={handleAddToBasket}
        />
      )}

      {/* 6. Checkout & Home Delivery Modal */}
      {isCheckoutModalOpen && (
        <CheckoutModal
          basketItems={basketItems}
          activeProfile={activeProfile}
          onClose={() => setIsCheckoutModalOpen(false)}
          onOrderPlaced={(newOrder) => {
            setOrders([newOrder, ...orders]);
            setBasketItems([]);
          }}
        />
      )}

      {/* 7. Catalog Admin Modal */}
      {isAdminModalOpen && (
        <AdminDashboardModal
          products={products}
          onClose={() => setIsAdminModalOpen(false)}
          onUpdateProduct={handleUpdateProductInCatalog}
          onAddNewProduct={handleAddNewProductToCatalog}
        />
      )}

      {/* 8. Mobile Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        basketCount={totalBasketCount}
      />
    </div>
  );
}
