import React, { useState } from 'react';
import { Header } from './components/Header';
import { ElderlySetupStep } from './components/ElderlySetupStep';
import { ElderlyWeekPlanStep } from './components/ElderlyWeekPlanStep';
import { RecipeDiscover } from './components/RecipeDiscover';
import { NutritionGuideStep } from './components/NutritionGuideStep';
import { RecipeModal } from './components/RecipeModal';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { ElderlyProfileState, Recipe } from './types';
import { ELDERLY_RECIPES } from './data/mockData';

export default function App() {
  const [profile, setProfile] = useState<ElderlyProfileState>({
    elderlyCount: 2,
    primaryCuisines: ['cantonese-teochew', 'peranakan'],
    restrictions: ['low-sodium', 'diabetic-safe', 'dysphagia-soft'],
    activeMealSlots: ['breakfast', 'lunch', 'dinner', 'supper'],
    budgetPerMeal: 5.5,
    textureLevel: 'Level 6: Soft & Bite-Sized (15mm max)',
    chewingAssistanceRequired: false,
    selectedGrocer: 'fairprice',
    activeDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  });

  const [currentTab, setCurrentTab] = useState<string>('meal-planner');
  const [selectedRecipeModal, setSelectedRecipeModal] = useState<Recipe | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [cartCount, setCartCount] = useState<number>(12);

  const handleUpdateProfile = (updated: Partial<ElderlyProfileState>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  const handleSelectTab = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (recipe: Recipe) => {
    setCartCount((prev) => prev + recipe.ingredients.length);
  };

  return (
    <div className="bg-[#f3fcf3] min-h-screen text-[#151d19] font-sans flex flex-col selection:bg-[#bceed0] selection:text-[#002113]">
      {/* Top Bar Contract Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="w-full pt-16 flex-1">
        {currentTab === 'meal-planner' && (
          <ElderlyWeekPlanStep
            profile={profile}
            onOpenRecipeModal={(recipe) => setSelectedRecipeModal(recipe)}
            onOpenCart={() => setIsCartOpen(true)}
            onNavigateToSetup={() => handleSelectTab('elderly-setup')}
          />
        )}

        {currentTab === 'elderly-setup' && (
          <ElderlySetupStep
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onProceedToWeeklyMenu={() => handleSelectTab('meal-planner')}
          />
        )}

        {currentTab === 'recipe-library' && (
          <RecipeDiscover
            profile={profile}
            onOpenRecipeModal={(recipe) => setSelectedRecipeModal(recipe)}
          />
        )}

        {currentTab === 'nutrition-guide' && (
          <NutritionGuideStep
            profile={profile}
            onNavigateToWeeklyMenu={() => handleSelectTab('meal-planner')}
          />
        )}
      </main>

      {/* Singapore Supermarkets Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        profile={profile}
      />

      {/* Individual Recipe Modal */}
      <RecipeModal
        recipe={selectedRecipeModal}
        profile={profile}
        onClose={() => setSelectedRecipeModal(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Footer */}
      <Footer onSelectTab={handleSelectTab} />
    </div>
  );
}
