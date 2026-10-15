import React from 'react';
import { ProfileState } from '../types';

interface NutritionStepProps {
  profile: ProfileState;
  onUpdateProfile: (updated: Partial<ProfileState>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const NutritionStep: React.FC<NutritionStepProps> = ({
  profile,
  onUpdateProfile,
  onNext,
  onPrev,
}) => {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="max-w-3xl mb-8">
        <span className="text-xs uppercase tracking-widest text-[#164530] font-bold">
          Step 2 of 4 / Nutritional Precision
        </span>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#151d19] mt-1 mb-2">
          Macro targets tailored for long workdays.
        </h1>
        <p className="text-sm sm:text-base text-[#414943] leading-relaxed">
          Singapore working adults often face post-dinner crashes or heavy hawker sodium. We tune each recipe’s macronutrient distribution to keep energy high and sleep restorative.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Calorie & Protein Targets */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(22,69,48,0.04)] border border-[#e2eae2]">
            <h2 className="text-lg font-bold text-[#151d19] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#164530]">fitness_center</span>
              Dinner Calorie & Protein Bounds
            </h2>

            <div className="space-y-6">
              {/* Protein Target */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-[#151d19]">
                    Minimum Protein per Adult Serving
                  </span>
                  <span className="font-mono-data text-base font-bold text-[#164530]">
                    {profile.proteinTarget}g+
                  </span>
                </div>
                <input
                  type="range"
                  min="25"
                  max="55"
                  step="5"
                  value={profile.proteinTarget}
                  onChange={(e) => onUpdateProfile({ proteinTarget: parseInt(e.target.value, 10) })}
                  className="w-full h-2 bg-[#dce5dd] rounded-lg appearance-none cursor-pointer accent-[#164530]"
                />
                <div className="flex justify-between text-[11px] text-[#414943] mt-1.5 font-mono-data">
                  <span>25g (Light)</span>
                  <span className="text-[#164530] font-bold">Recommended: 35g–40g for muscle preservation</span>
                  <span>55g (Athlete)</span>
                </div>
              </div>

              {/* Calorie Target */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-[#151d19]">
                    Target Calorie Cap per Dinner
                  </span>
                  <span className="font-mono-data text-base font-bold text-[#164530]">
                    ~{profile.calorieTarget} kcal
                  </span>
                </div>
                <input
                  type="range"
                  min="400"
                  max="850"
                  step="50"
                  value={profile.calorieTarget}
                  onChange={(e) => onUpdateProfile({ calorieTarget: parseInt(e.target.value, 10) })}
                  className="w-full h-2 bg-[#dce5dd] rounded-lg appearance-none cursor-pointer accent-[#164530]"
                />
                <div className="flex justify-between text-[11px] text-[#414943] mt-1.5 font-mono-data">
                  <span>400 kcal (Cutting)</span>
                  <span className="text-[#164530] font-bold">Optimal: 500–650 kcal</span>
                  <span>850 kcal (High Energy)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Singapore Health & Seasoning Standards */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(22,69,48,0.04)] border border-[#e2eae2]">
            <h2 className="text-lg font-bold text-[#151d19] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#164530]">health_and_safety</span>
              Singapore Healthier Choice & Sodium Profile
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              {[
                { id: 'normal', title: 'Balanced Pantry', desc: 'Natural sea salt, light soy, cold-pressed oils' },
                { id: 'low-sodium', title: 'Low Sodium Standard', desc: '<500mg sodium per meal, Healthier Choice logo focus' },
                { id: 'no-msg', title: 'Zero MSG & Refined Sugars', desc: 'All umami derived from dried shiitake, kombu & aromatics' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onUpdateProfile({ sodiumPreference: item.id as any })}
                  className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                    profile.sodiumPreference === item.id
                      ? 'bg-[#edf6ee] border-[#164530] ring-1 ring-[#164530]'
                      : 'bg-white border-[#e2eae2] hover:bg-[#edf6ee]/50'
                  }`}
                >
                  <p className="text-xs font-bold text-[#151d19] mb-1">{item.title}</p>
                  <p className="text-[11px] text-[#414943] leading-relaxed">{item.desc}</p>
                </button>
              ))}
            </div>

            <div className="p-4 bg-[#edf6ee]/60 rounded-xl border border-[#dce5dd]/60 flex items-center gap-3">
              <span className="material-symbols-outlined text-[#164530] text-[24px]">verified</span>
              <p className="text-xs text-[#151d19] leading-relaxed">
                <span className="font-bold">HPB (Health Promotion Board) Aligned:</span> Meals automatically meet recommended daily vegetable fiber targets with 2+ servings of greens.
              </p>
            </div>
          </div>
        </div>

        {/* Right Rail Info */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(22,69,48,0.04)] border border-[#e2eae2]">
            <span className="text-xs uppercase tracking-wider text-[#164530] font-bold block mb-2">
              Macronutrient Target Card
            </span>
            <div className="space-y-3 font-mono-data text-xs">
              <div className="flex justify-between py-2 border-b border-[#edf6ee]">
                <span className="text-[#414943]">Protein Per Serving</span>
                <span className="font-bold text-[#151d19]">{profile.proteinTarget}g</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#edf6ee]">
                <span className="text-[#414943]">Energy Target</span>
                <span className="font-bold text-[#151d19]">~{profile.calorieTarget} kcal</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#edf6ee]">
                <span className="text-[#414943]">Estimated Fat</span>
                <span className="font-bold text-[#151d19]">18–22g (Good Fats)</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[#414943]">Complex Carbs</span>
                <span className="font-bold text-[#151d19]">35–45g</span>
              </div>
            </div>
          </div>

          <div className="bg-[#bceed0]/40 rounded-2xl p-5 border border-[#bceed0]/60">
            <h4 className="text-xs font-bold text-[#002113] mb-1 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">bolt</span>
              Why 35g+ Protein for Dinner?
            </h4>
            <p className="text-xs text-[#414943] leading-relaxed">
              Clinical nutrition studies show 35g of bioavailable protein in evening meals suppresses late-night sweet cravings and prevents next-morning cortisol spikes.
            </p>
          </div>
        </div>
      </div>

      {/* Nav Buttons */}
      <div className="flex items-center justify-between mt-10 pt-6 border-t border-[#e2eae2]">
        <button
          type="button"
          onClick={onPrev}
          className="px-5 py-2.5 rounded-full border border-[#164530] text-[#164530] text-xs sm:text-sm font-semibold hover:bg-[#164530]/5 transition-colors cursor-pointer"
        >
          &larr; Back to Household Profile
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 rounded-full bg-[#164530] text-white text-xs sm:text-sm font-bold hover:bg-[#2f5d46] transition-colors shadow-sm cursor-pointer"
        >
          Next: Pantry & Grocer Sync &rarr;
        </button>
      </div>
    </div>
  );
};
