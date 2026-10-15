/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { StepProgressBar } from './components/StepProgressBar';
import { ProfileStep } from './components/ProfileStep';
import { NutritionStep } from './components/NutritionStep';
import { PantryStep } from './components/PantryStep';
import { WeekPlanStep } from './components/WeekPlanStep';
import { RecipeDiscover } from './components/RecipeDiscover';
import { RecipeModal } from './components/RecipeModal';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { ProfileState, Recipe } from './types';
import { RECIPES } from './data/mockData';

export default function App() {
  const [profile, setProfile] = useState<ProfileState>({
    adults: 2,
    kids: 1,
    activePreset: 'small-family',
    activeDays: ['Mon', 'Tue', 'Wed', 'Thu'],
    dishStyle: '2-Dish Balanced',
    pacingConstraints: ['🍱 Next-Day Lunch Friendly', '👶 Picky-Eater Approved'],
    eatingStyles: ['Mediterranean', 'High Protein (35g+)'],
    allergies: ['Gluten-Free', 'Peanut & Tree Nut Free'],
    dislikes: ['No Raw Cilantro', 'No Eggplant'],
    grocer: 'fairprice',
    budgetMidpoint: 120,
    calorieTarget: 550,
    proteinTarget: 38,
    sodiumPreference: 'normal',
    carbPreference: 'balanced',
  });

  const [currentTab, setCurrentTab] = useState<string>('preferences');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedRecipeModal, setSelectedRecipeModal] = useState<Recipe | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  const handleUpdateProfile = (updated: Partial<ProfileState>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  const handleSelectTab = (tab: string) => {
    setCurrentTab(tab);
    if (tab === 'preferences') {
      setCurrentStep(1);
    } else if (tab === 'meal-planner') {
      setCurrentStep(4);
    } else if (tab === 'my-pantry-cart') {
      setIsCartOpen(true);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectStep = (stepNumber: number) => {
    setCurrentStep(stepNumber);
    setCurrentTab('preferences');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveAndGenerateWeek1 = () => {
    setCurrentStep(4);
    setCurrentTab('meal-planner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-[#f3fcf3] min-h-screen text-[#151d19] font-sans flex flex-col selection:bg-[#bceed0] selection:text-[#002113]">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        cartCount={11}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="w-full pt-20 flex-1">
        {/* If we are in preferences or meal-planner, show the 4-step progress banner */}
        {(currentTab === 'preferences' || currentTab === 'meal-planner') && (
          <StepProgressBar
            currentStep={currentStep}
            onSelectStep={handleSelectStep}
          />
        )}

        {/* Tab / Step Routing */}
        {currentTab === 'recipe-discover' ? (
          <RecipeDiscover
            onOpenRecipeModal={(recipe) => setSelectedRecipeModal(recipe)}
          />
        ) : (
          <>
            {currentStep === 1 && (
              <ProfileStep
                profile={profile}
                onUpdateProfile={handleUpdateProfile}
                onSaveAndGenerate={handleSaveAndGenerateWeek1}
                onOpenRecipeModal={(recipe) => setSelectedRecipeModal(recipe)}
              />
            )}

            {currentStep === 2 && (
              <NutritionStep
                profile={profile}
                onUpdateProfile={handleUpdateProfile}
                onNext={() => {
                  setCurrentStep(3);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onPrev={() => {
                  setCurrentStep(1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {currentStep === 3 && (
              <PantryStep
                profile={profile}
                onUpdateProfile={handleUpdateProfile}
                onNext={() => {
                  setCurrentStep(4);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onPrev={() => {
                  setCurrentStep(2);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {currentStep === 4 && (
              <WeekPlanStep
                profile={profile}
                onOpenRecipeModal={(recipe) => setSelectedRecipeModal(recipe)}
                onOpenCart={() => setIsCartOpen(true)}
                onRecalibrate={() => {
                  setCurrentStep(1);
                  setCurrentTab('preferences');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        profile={profile}
      />

      {/* Detailed Recipe Modal */}
      <RecipeModal
        recipe={selectedRecipeModal}
        profile={profile}
        onClose={() => setSelectedRecipeModal(null)}
      />

      {/* Footer */}
      <Footer onSelectTab={handleSelectTab} />
    </div>
  );
}
