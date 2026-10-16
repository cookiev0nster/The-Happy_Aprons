import React from 'react';
import { ElderlyProfileState } from '../types';

interface NutritionGuideStepProps {
  profile: ElderlyProfileState;
  onNavigateToWeeklyMenu: () => void;
}

export const NutritionGuideStep: React.FC<NutritionGuideStepProps> = ({
  profile,
  onNavigateToWeeklyMenu,
}) => {
  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-10">
      {/* Header */}
      <div className="max-w-3xl">
        <span className="text-xs uppercase tracking-wider text-[#164530] font-bold block mb-1.5">
          Caregiver Clinical & Clinical Dietitian Guide
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#151d19] tracking-tight">
          Singapore Elderly Nutrition & Swallowing Framework
        </h1>
        <p className="text-sm text-[#414943] mt-2 leading-relaxed">
          Designed in alignment with Singapore Health Promotion Board (HPB) elderly guidelines and the International Dysphagia Diet Standardisation Initiative (IDDSI).
        </p>
      </div>

      {/* Grid of 4 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pillar 1: Sarcopenia & Protein */}
        <div className="bg-white p-6 rounded-2xl border border-[#e2eae2] shadow-2xs">
          <div className="flex items-center gap-2.5 text-[#164530] mb-3">
            <span className="material-symbols-outlined text-[24px]">fitness_center</span>
            <h3 className="font-bold text-lg text-[#151d19]">
              1. Combating Sarcopenia (Muscle Loss)
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[#414943] leading-relaxed mb-4">
            Seniors over 65 require <strong>1.2g to 1.5g of protein per kg of body weight</strong> daily—significantly more than young adults—due to anabolic resistance.
          </p>
          <div className="p-3.5 bg-[#edf6ee] rounded-xl text-xs space-y-2">
            <div className="flex justify-between font-semibold text-[#164530]">
              <span>Recommended daily target for 60kg senior:</span>
              <span>72g – 90g protein</span>
            </div>
            <p className="text-[#414943]">
              Distribute evenly across Breakfast, Lunch, and Dinner (approx. 25-30g per meal) rather than clustering in one heavy dinner.
            </p>
          </div>
        </div>

        {/* Pillar 2: Calcium & Bone Health */}
        <div className="bg-white p-6 rounded-2xl border border-[#e2eae2] shadow-2xs">
          <div className="flex items-center gap-2.5 text-[#164530] mb-3">
            <span className="material-symbols-outlined text-[24px]">healing</span>
            <h3 className="font-bold text-lg text-[#151d19]">
              2. Osteoporosis & Bone Integrity
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[#414943] leading-relaxed mb-4">
            Hip fractures are a major risk in Singapore. Seniors need <strong>1,000mg to 1,200mg of elemental calcium</strong> daily.
          </p>
          <div className="p-3.5 bg-[#edf6ee] rounded-xl text-xs space-y-2">
            <div className="flex justify-between font-semibold text-[#164530]">
              <span>Key Singapore calcium sources:</span>
              <span>Fortune Tau Kwa (260mg)</span>
            </div>
            <p className="text-[#414943]">
              Unicurd firm tofu, pasteurized eggs, and fortified NutriSoy calcium milk deliver easily absorbable calcium without relying solely on dairy.
            </p>
          </div>
        </div>

        {/* Pillar 3: Low Sodium & Hypertension */}
        <div className="bg-white p-6 rounded-2xl border border-[#e2eae2] shadow-2xs">
          <div className="flex items-center gap-2.5 text-[#164530] mb-3">
            <span className="material-symbols-outlined text-[24px]">favorite</span>
            <h3 className="font-bold text-lg text-[#151d19]">
              3. Sodium Cap & Cardiovascular Care
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[#414943] leading-relaxed mb-4">
            Excess sodium drives fluid retention and systolic blood pressure surges. Singapore seniors average 3,600mg sodium daily—far above the <strong>1,500mg DASH target</strong>.
          </p>
          <div className="p-3.5 bg-[#edf6ee] rounded-xl text-xs space-y-2">
            <div className="flex justify-between font-semibold text-[#164530]">
              <span>Our seasoning technique:</span>
              <span>Aromatics over Salt</span>
            </div>
            <p className="text-[#414943]">
              We boost umami with old ginger, toasted pure sesame oil, goji berries, dried honey dates, and mild white pepper instead of MSG or heavy salt.
            </p>
          </div>
        </div>

        {/* Pillar 4: IDDSI Dysphagia Protocols */}
        <div className="bg-white p-6 rounded-2xl border border-[#e2eae2] shadow-2xs">
          <div className="flex items-center gap-2.5 text-[#164530] mb-3">
            <span className="material-symbols-outlined text-[24px]">soup_kitchen</span>
            <h3 className="font-bold text-lg text-[#151d19]">
              4. IDDSI Swallowing Safety & Texture
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[#414943] leading-relaxed mb-4">
            Silent aspiration pneumonia is a leading hospital admission cause for elderly. Texture calibration ensures food safely passes the pharynx.
          </p>
          <div className="p-3.5 bg-[#edf6ee] rounded-xl text-xs space-y-2">
            <div className="flex justify-between font-semibold text-[#164530]">
              <span>Active Household Texture:</span>
              <span>{profile.textureLevel}</span>
            </div>
            <p className="text-[#414943]">
              Ensure senior sits upright at a 90-degree angle for at least 30 minutes following meals. Avoid crumbly foods and dry crusts.
            </p>
          </div>
        </div>
      </div>

      {/* CTA to return to Weekly Menus */}
      <div className="p-6 rounded-2xl bg-[#164530] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">Apply these nutrition standards to this week's menu</h3>
          <p className="text-xs sm:text-sm text-white/80 mt-0.5">
            View the 7-day schedule configured for your {profile.elderlyCount} {profile.elderlyCount === 1 ? 'elderly' : 'elders'}.
          </p>
        </div>
        <button
          type="button"
          onClick={onNavigateToWeeklyMenu}
          className="px-6 py-2.5 rounded-xl bg-[#bceed0] hover:bg-[#a0d2b5] text-[#002113] text-xs sm:text-sm font-bold shadow-xs cursor-pointer whitespace-nowrap"
        >
          View Weekly Menus
        </button>
      </div>
    </div>
  );
};
