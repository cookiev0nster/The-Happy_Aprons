import React, { useState } from 'react';
import { ProfileState } from '../types';
import { GROCER_OPTIONS, PANTRY_STAPLES } from '../data/mockData';

interface PantryStepProps {
  profile: ProfileState;
  onUpdateProfile: (updated: Partial<ProfileState>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const PantryStep: React.FC<PantryStepProps> = ({
  profile,
  onUpdateProfile,
  onNext,
  onPrev,
}) => {
  const [ownedStaples, setOwnedStaples] = useState<string[]>(
    PANTRY_STAPLES.filter((s) => s.defaultOwned).map((s) => s.id)
  );
  const [selectedSlot, setSelectedSlot] = useState('Sunday 18:00 – 20:00');

  const toggleStaple = (id: string) => {
    if (ownedStaples.includes(id)) {
      setOwnedStaples(ownedStaples.filter((x) => x !== id));
    } else {
      setOwnedStaples([...ownedStaples, id]);
    }
  };

  const currentGrocer = GROCER_OPTIONS.find((g) => g.id === profile.grocer) || GROCER_OPTIONS[0];

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="max-w-3xl mb-8">
        <span className="text-xs uppercase tracking-widest text-[#164530] font-bold">
          Step 3 of 4 / Zero-Duplicate Cart Logic
        </span>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#151d19] mt-1 mb-2">
          Sync your kitchen pantry staples.
        </h1>
        <p className="text-sm sm:text-base text-[#414943] leading-relaxed">
          Tell us what basic Asian or Western staples you already have in your kitchen cabinets. We automatically deduct them from your {currentGrocer.name} cart so you never hoard duplicate bottles of sesame oil or soy sauce.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Pantry Staples Checklist */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(22,69,48,0.04)] border border-[#e2eae2]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#151d19] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#164530]">inventory_2</span>
                In-Stock Pantry Checklist
              </h2>
              <span className="text-xs font-bold text-[#164530] bg-[#bceed0]/50 px-2.5 py-1 rounded-full">
                {ownedStaples.length} Staples In Stock
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {PANTRY_STAPLES.map((staple) => {
                const isOwned = ownedStaples.includes(staple.id);
                return (
                  <button
                    key={staple.id}
                    type="button"
                    onClick={() => toggleStaple(staple.id)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                      isOwned
                        ? 'bg-[#edf6ee] border-[#164530] shadow-2xs'
                        : 'bg-white border-[#e2eae2] hover:bg-[#edf6ee]/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isOwned ? 'bg-[#164530] text-white' : 'bg-[#edf6ee] text-[#414943]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {staple.icon}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#151d19]">{staple.name}</p>
                        <span className="text-[10px] text-[#414943]">{staple.category}</span>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                        isOwned
                          ? 'bg-[#164530] border-[#164530] text-white'
                          : 'border-[#c0c9c1] bg-white'
                      }`}
                    >
                      {isOwned && (
                        <span className="material-symbols-outlined text-[14px]">check</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-3 bg-[#edf6ee]/70 rounded-xl text-xs text-[#414943] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#164530] text-[18px]">savings</span>
              <span>
                Deducting {ownedStaples.length} staples saves approximately{' '}
                <strong className="text-[#164530] font-mono-data">~$24.50 SGD</strong> on your first weekly grocery run.
              </span>
            </div>
          </div>

          {/* Grocer Delivery Window */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(22,69,48,0.04)] border border-[#e2eae2]">
            <h2 className="text-lg font-bold text-[#151d19] mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#164530]">schedule</span>
              Preferred {currentGrocer.name} Delivery Window
            </h2>
            <p className="text-xs text-[#414943] mb-4">
              Scheduled to arrive Sunday evening so all fresh meats and greens are pre-washed and chilled for Monday dinner.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { time: 'Sunday 18:00 – 20:00', label: 'Prime Weeknight Prep', popular: true },
                { time: 'Sunday 20:00 – 22:00', label: 'Late Evening Drop' },
                { time: 'Monday 08:00 – 10:00', label: 'Morning Work From Home' },
              ].map((slot) => (
                <button
                  key={slot.time}
                  type="button"
                  onClick={() => setSelectedSlot(slot.time)}
                  className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer ${
                    selectedSlot === slot.time
                      ? 'bg-[#edf6ee] border-[#164530] ring-1 ring-[#164530]'
                      : 'bg-white border-[#e2eae2] hover:bg-[#edf6ee]/50'
                  }`}
                >
                  <p className="text-xs font-bold text-[#151d19]">{slot.time}</p>
                  <p className="text-[11px] text-[#414943] mt-0.5">{slot.label}</p>
                  {slot.popular && (
                    <span className="inline-block mt-2 text-[10px] font-bold text-[#164530] bg-[#bceed0] px-2 py-0.5 rounded-full">
                      Most Selected
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(22,69,48,0.04)] border border-[#e2eae2]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#edf6ee] flex items-center justify-center text-[#164530]">
                <span className="material-symbols-outlined text-[24px]">
                  {currentGrocer.iconName}
                </span>
              </div>
              <div>
                <p className="text-xs text-[#414943]">Active Dispatcher</p>
                <h3 className="text-sm font-bold text-[#151d19]">{currentGrocer.name}</h3>
              </div>
            </div>

            <div className="space-y-2 text-xs text-[#414943] border-t border-[#edf6ee] pt-3">
              <div className="flex justify-between">
                <span>Free Delivery Min:</span>
                <span className="font-bold text-[#151d19] font-mono-data">
                  ${currentGrocer.freeDeliveryThreshold}.00 SGD
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Week Cart:</span>
                <span className="font-bold text-[#164530] font-mono-data">
                  ${profile.budgetMidpoint}.00 SGD
                </span>
              </div>
              <div className="flex justify-between">
                <span>Free Delivery Status:</span>
                <span className="font-bold text-[#164530]">Unlocked (Free)</span>
              </div>
            </div>
          </div>

          <div className="bg-[#ffdbce]/40 rounded-2xl p-5 border border-[#ffdbce]/60">
            <span className="material-symbols-outlined text-[#9a4521] text-[20px] mb-1">
              verified
            </span>
            <h4 className="text-xs font-bold text-[#380d00] mb-1">Cold-Chain Guarantee</h4>
            <p className="text-xs text-[#414943] leading-relaxed">
              All seafood and poultry arrive sealed in temperature-controlled insulating pouches to ensure zero temperature abuse before dinner prep.
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
          &larr; Back to Macro Targets
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 rounded-full bg-[#164530] text-white text-xs sm:text-sm font-bold hover:bg-[#2f5d46] transition-colors shadow-sm cursor-pointer"
        >
          Generate Week 1 AI Plan &rarr;
        </button>
      </div>
    </div>
  );
};
