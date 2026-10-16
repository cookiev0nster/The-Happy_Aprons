import React, { useState } from 'react';

export const MedicalDisclaimerBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <aside aria-label="Medical and Dietary Safety Notice" className="bg-[#edf6ee] border-b border-[#dce5dd] py-2.5 px-4 sm:px-6">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-3 text-xs text-[#2f5d46]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-[#164530] shrink-0">
            health_and_safety
          </span>
          <p className="leading-snug">
            <strong className="text-[#151d19]">Inclusive & Empowering Care:</strong> Ingredient suitability is evaluated from verified manufacturer labels, declared allergens, and Singapore HPB data. We do not diagnose illness or provide therapeutic medical advice. Always cross-check product packaging for severe anaphylactic conditions.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="text-[#414943] hover:text-[#151d19] p-1 rounded-full shrink-0 cursor-pointer"
          aria-label="Dismiss disclaimer banner"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>
    </aside>
  );
};
