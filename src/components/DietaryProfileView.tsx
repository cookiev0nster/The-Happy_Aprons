import React, { useState } from 'react';
import { HouseholdMemberProfile } from '../types';

interface DietaryProfileViewProps {
  householdProfiles: HouseholdMemberProfile[];
  activeProfile: HouseholdMemberProfile;
  onSelectProfile: (profile: HouseholdMemberProfile) => void;
  onUpdateProfile: (updatedProfile: HouseholdMemberProfile) => void;
  onAddNewProfile: (newProfile: HouseholdMemberProfile) => void;
}

export const DietaryProfileView: React.FC<DietaryProfileViewProps> = ({
  householdProfiles,
  activeProfile,
  onSelectProfile,
  onUpdateProfile,
  onAddNewProfile,
}) => {
  const [avoidInput, setAvoidInput] = useState('');
  const [saveToast, setSaveToast] = useState(false);

  const availableAllergies = [
    'Peanuts',
    'Tree Nuts',
    'Dairy / Milk',
    'Eggs',
    'Soy',
    'Wheat / Gluten',
    'Crustaceans / Shellfish',
    'Fish',
    'Sesame',
  ];

  const availableIntolerances = [
    'Lactose Intolerance',
    'Non-Celiac Gluten Sensitivity',
    'FODMAP Sensitivity',
    'Histamine Intolerance',
  ];

  const availableHealthConditions = [
    'Type 2 Diabetes / Prediabetes (Low GI)',
    'Hypertension / High Blood Pressure (DASH / Low Sodium)',
    'High Cholesterol / Hyperlipidemia (Heart Healthy)',
    'Kidney Care (Low Potassium & Phosphorus)',
    'Gout (Low Purine / High Uric Acid)',
  ];

  const availablePreferences = [
    'Vegetarian',
    'Vegan / 100% Plant-Based',
    'Halal-Certified Ingredients',
    'High Protein (25g+)',
    'Low Carb / Keto',
    'Mediterranean',
    'Organic / Non-GMO',
  ];

  const toggleAllergy = (allergy: string) => {
    const exists = activeProfile.allergies.includes(allergy);
    const updated = exists
      ? activeProfile.allergies.filter((a) => a !== allergy)
      : [...activeProfile.allergies, allergy];
    onUpdateProfile({ ...activeProfile, allergies: updated });
  };

  const toggleIntolerance = (intolerance: string) => {
    const exists = activeProfile.intolerances.includes(intolerance);
    const updated = exists
      ? activeProfile.intolerances.filter((i) => i !== intolerance)
      : [...activeProfile.intolerances, intolerance];
    onUpdateProfile({ ...activeProfile, intolerances: updated });
  };

  const toggleCondition = (cond: string) => {
    const exists = activeProfile.healthConditions.includes(cond);
    const updated = exists
      ? activeProfile.healthConditions.filter((c) => c !== cond)
      : [...activeProfile.healthConditions, cond];
    onUpdateProfile({ ...activeProfile, healthConditions: updated });
  };

  const togglePreference = (pref: string) => {
    const exists = activeProfile.dietaryPreferences.includes(pref);
    const updated = exists
      ? activeProfile.dietaryPreferences.filter((p) => p !== pref)
      : [...activeProfile.dietaryPreferences, pref];
    onUpdateProfile({ ...activeProfile, dietaryPreferences: updated });
  };

  const handleAddAvoid = () => {
    const clean = avoidInput.trim();
    if (!clean) return;
    if (!activeProfile.ingredientsToAvoid.includes(clean)) {
      onUpdateProfile({
        ...activeProfile,
        ingredientsToAvoid: [...activeProfile.ingredientsToAvoid, clean],
      });
    }
    setAvoidInput('');
  };

  const handleRemoveAvoid = (item: string) => {
    onUpdateProfile({
      ...activeProfile,
      ingredientsToAvoid: activeProfile.ingredientsToAvoid.filter((i) => i !== item),
    });
  };

  const handleCreateNewMember = () => {
    const newId = `prof-${Date.now().toString().slice(-4)}`;
    const newMember: HouseholdMemberProfile = {
      id: newId,
      name: 'Family Member',
      relationship: 'Other',
      avatarColor: '#553800',
      isPrimary: false,
      allergies: [],
      intolerances: [],
      healthConditions: [],
      dietaryPreferences: ['Healthy Everyday'],
      ingredientsToAvoid: [],
      nutritionalGoals: {
        maxSodiumMgPerServing: 400,
        maxSugarGramsPer100g: 6,
      },
      substitutionPolicy: 'strict-approval-only',
    };
    onAddNewProfile(newMember);
  };

  const triggerSaveNotification = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 pb-24">
      {/* Toast */}
      {saveToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#164530] text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-[18px] text-[#bceed0]">check_circle</span>
          <span>Dietary guardrails updated for {activeProfile.name}!</span>
        </div>
      )}

      {/* Header */}
      <div>
        <span className="text-xs uppercase tracking-widest text-[#164530] font-bold">
          Household Calibration
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#151d19] mt-1">
          Personalised Dietary Profile Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#556057]">
          Configure diagnosed allergies, health conditions, nutritional bounds, and safe substitution policies for each family member.
        </p>
      </div>

      {/* Household Profile Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#edf6ee]">
        {householdProfiles.map((member) => {
          const isSelected = activeProfile.id === member.id;
          return (
            <button
              key={member.id}
              type="button"
              onClick={() => onSelectProfile(member)}
              className={`px-4 py-2.5 rounded-2xl flex items-center gap-2.5 transition-all cursor-pointer shrink-0 border ${
                isSelected
                  ? 'bg-[#164530] text-white border-[#164530] shadow-xs'
                  : 'bg-white text-[#414943] border-[#dce5dd] hover:bg-[#edf6ee]'
              }`}
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                style={{ backgroundColor: member.avatarColor }}
              >
                {member.name.charAt(0)}
              </div>
              <span className="text-xs font-bold whitespace-nowrap">{member.name}</span>
              {member.isPrimary && (
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-[#ffdbce] text-[#380d00]'
                  }`}
                >
                  Primary
                </span>
              )}
            </button>
          );
        })}

        <button
          type="button"
          onClick={handleCreateNewMember}
          className="px-4 py-2.5 rounded-2xl border border-dashed border-[#c0c9c1] text-xs font-bold text-[#164530] hover:bg-[#edf6ee] transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>Add Family Member</span>
        </button>
      </div>

      {/* Main Profile Form Sections */}
      <div className="bg-white rounded-3xl border border-[#e2eae2] p-6 sm:p-8 shadow-xs space-y-8">
        {/* Profile Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-[#edf6ee]">
          <div>
            <label className="text-xs font-bold text-[#151d19] uppercase tracking-wider block mb-1.5">
              Profile Display Name
            </label>
            <input
              type="text"
              value={activeProfile.name}
              onChange={(e) => onUpdateProfile({ ...activeProfile, name: e.target.value })}
              className="w-full p-3 rounded-xl border border-[#dce5dd] text-xs text-[#151d19] focus:outline-none focus:border-[#164530]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#151d19] uppercase tracking-wider block mb-1.5">
              Household Relationship
            </label>
            <select
              value={activeProfile.relationship}
              onChange={(e) => onUpdateProfile({ ...activeProfile, relationship: e.target.value as any })}
              className="w-full p-3 rounded-xl border border-[#dce5dd] text-xs text-[#151d19] focus:outline-none bg-white"
            >
              <option value="Parent / Elderly">Parent / Elderly (Caregiver Managed)</option>
              <option value="Self">Self</option>
              <option value="Child">Child</option>
              <option value="Partner">Partner</option>
              <option value="Other">Other Family Member</option>
            </select>
          </div>
        </div>

        {/* 1. Diagnosed Food Allergies (High Medical Alert) */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-[#ba1a1a] text-[20px]">error</span>
            <h2 className="text-sm font-bold text-[#151d19] uppercase tracking-wider">
              1. Diagnosed Food Allergies (Strict Rejection)
            </h2>
          </div>
          <p className="text-xs text-[#556057] mb-3">
            Products containing declared ingredients or shared-facility warnings will trigger immediate safety flags.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {availableAllergies.map((allergy) => {
              const checked = activeProfile.allergies.includes(allergy);
              return (
                <button
                  key={allergy}
                  type="button"
                  onClick={() => toggleAllergy(allergy)}
                  className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                    checked
                      ? 'bg-[#ffdad6] text-[#93000a] border-[#ffb4ab] shadow-2xs'
                      : 'bg-[#f8fbf8] text-[#414943] border-[#e2eae2] hover:bg-[#edf6ee]'
                  }`}
                >
                  <span>{allergy}</span>
                  <span className="material-symbols-outlined text-[16px]">
                    {checked ? 'cancel' : 'add'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Health-Related Dietary Conditions (Diabetes, Hypertension, Renal, Cardiac) */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-[#164530] text-[20px]">cardiology</span>
            <h2 className="text-sm font-bold text-[#151d19] uppercase tracking-wider">
              2. Health Conditions & Chronic Illness Management
            </h2>
          </div>
          <p className="text-xs text-[#556057] mb-3">
            Enforces clinical benchmarks for blood sugar control, sodium moderation, and vascular protection.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {availableHealthConditions.map((cond) => {
              const checked = activeProfile.healthConditions.includes(cond);
              return (
                <button
                  key={cond}
                  type="button"
                  onClick={() => toggleCondition(cond)}
                  className={`p-3.5 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                    checked
                      ? 'bg-[#edf6ee] text-[#164530] border-[#bceed0] ring-1 ring-[#164530]/20'
                      : 'bg-[#f8fbf8] text-[#414943] border-[#e2eae2] hover:bg-[#edf6ee]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">
                      {checked ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    <span>{cond}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Food Intolerances */}
        <div>
          <h2 className="text-sm font-bold text-[#151d19] uppercase tracking-wider mb-2">
            3. Digestive Intolerances & Sensitivities
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {availableIntolerances.map((intol) => {
              const checked = activeProfile.intolerances.includes(intol);
              return (
                <button
                  key={intol}
                  type="button"
                  onClick={() => toggleIntolerance(intol)}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                    checked
                      ? 'bg-[#edf6ee] text-[#164530] border-[#bceed0]'
                      : 'bg-[#f8fbf8] text-[#414943] border-[#e2eae2] hover:bg-[#edf6ee]'
                  }`}
                >
                  <span>{intol}</span>
                  <span className="material-symbols-outlined text-[16px]">
                    {checked ? 'check' : 'add'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Lifestyle & Dietary Preferences */}
        <div>
          <h2 className="text-sm font-bold text-[#151d19] uppercase tracking-wider mb-2">
            4. Lifestyle & Cultural Preferences
          </h2>
          <div className="flex flex-wrap gap-2">
            {availablePreferences.map((pref) => {
              const checked = activeProfile.dietaryPreferences.includes(pref);
              return (
                <button
                  key={pref}
                  type="button"
                  onClick={() => togglePreference(pref)}
                  className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    checked
                      ? 'bg-[#164530] text-white shadow-2xs'
                      : 'bg-[#edf6ee] text-[#414943] hover:bg-[#e2eae2]'
                  }`}
                >
                  {pref}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Custom Nutritional Bounds (Sodium & Sugar Sliders) */}
        <div className="p-5 rounded-2xl bg-[#f8fbf8] border border-[#e2eae2] space-y-4">
          <h3 className="text-xs font-bold text-[#151d19] uppercase tracking-wider">
            5. Quantitative Nutritional Guardrails
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-bold text-[#151d19]">Maximum Sodium per Serving:</span>
                <span className="font-mono-data font-bold text-[#164530]">
                  {activeProfile.nutritionalGoals.maxSodiumMgPerServing ?? 350} mg
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="800"
                step="25"
                value={activeProfile.nutritionalGoals.maxSodiumMgPerServing ?? 350}
                onChange={(e) =>
                  onUpdateProfile({
                    ...activeProfile,
                    nutritionalGoals: {
                      ...activeProfile.nutritionalGoals,
                      maxSodiumMgPerServing: parseInt(e.target.value, 10),
                    },
                  })
                }
                className="w-full accent-[#164530]"
              />
              <span className="text-[10px] text-[#556057] mt-1 block">
                Standard Singapore hawker dinner: ~1,200mg · DASH Diet target: &lt;350mg
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-bold text-[#151d19]">Maximum Sugars per 100g:</span>
                <span className="font-mono-data font-bold text-[#164530]">
                  {activeProfile.nutritionalGoals.maxSugarGramsPer100g ?? 5.0} g
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                step="0.5"
                value={activeProfile.nutritionalGoals.maxSugarGramsPer100g ?? 5.0}
                onChange={(e) =>
                  onUpdateProfile({
                    ...activeProfile,
                    nutritionalGoals: {
                      ...activeProfile.nutritionalGoals,
                      maxSugarGramsPer100g: parseFloat(e.target.value),
                    },
                  })
                }
                className="w-full accent-[#164530]"
              />
              <span className="text-[10px] text-[#556057] mt-1 block">
                Diabetic blood glucose threshold: &lt;5.0g per 100g
              </span>
            </div>
          </div>
        </div>

        {/* 6. Specific Ingredients to Avoid (Tag input) */}
        <div>
          <h2 className="text-sm font-bold text-[#151d19] uppercase tracking-wider mb-2">
            6. Specific Ingredients to Avoid (Personal Dislikes / Exclusions)
          </h2>
          <div className="flex gap-2 mb-3 max-w-md">
            <input
              type="text"
              value={avoidInput}
              onChange={(e) => setAvoidInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddAvoid()}
              placeholder="e.g. Added MSG, Palm Oil, Aspartame, Raw Cilantro"
              className="flex-1 p-2.5 rounded-xl border border-[#dce5dd] text-xs text-[#151d19] focus:outline-none focus:border-[#164530]"
            />
            <button
              type="button"
              onClick={handleAddAvoid}
              className="px-4 py-2.5 rounded-xl bg-[#164530] text-white text-xs font-bold cursor-pointer"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {activeProfile.ingredientsToAvoid.map((item) => (
              <span
                key={item}
                className="px-3 py-1 rounded-full bg-[#ffeed6] text-[#683b00] border border-[#fcd39b] text-xs font-medium flex items-center gap-1.5"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveAvoid(item)}
                  className="hover:text-[#ba1a1a] cursor-pointer"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* 7. Safe Substitution Policy */}
        <div>
          <h2 className="text-sm font-bold text-[#151d19] uppercase tracking-wider mb-2">
            7. Supermarket Out-of-Stock Substitution Policy
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: 'strict-approval-only',
                title: 'Strict Approval Only',
                desc: 'Never substitute without caregiver phone or app confirmation.',
              },
              {
                id: 'dietary-equivalent-auto',
                title: 'Dietary Equivalent',
                desc: 'Allow substitution only if it strictly matches all safety guardrails.',
              },
              {
                id: 'no-substitutes',
                title: 'No Substitutions',
                desc: 'Refund out-of-stock items immediately. Do not substitute.',
              },
            ].map((pol) => (
              <div
                key={pol.id}
                onClick={() => onUpdateProfile({ ...activeProfile, substitutionPolicy: pol.id as any })}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-xs ${
                  activeProfile.substitutionPolicy === pol.id
                    ? 'border-[#164530] bg-[#edf6ee] ring-1 ring-[#164530]'
                    : 'border-[#e2eae2] bg-[#f8fbf8] hover:bg-[#edf6ee]'
                }`}
              >
                <span className="font-bold text-[#151d19] block">{pol.title}</span>
                <span className="text-[11px] text-[#556057] mt-1 block">{pol.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 8. Caregiver Notes */}
        <div>
          <label className="text-xs font-bold text-[#151d19] uppercase tracking-wider block mb-1.5">
            8. Caregiver & Doctor Notes (Private)
          </label>
          <textarea
            rows={2}
            value={activeProfile.caregiverNotes || ''}
            onChange={(e) => onUpdateProfile({ ...activeProfile, caregiverNotes: e.target.value })}
            placeholder="e.g. Doctor recommended low-sodium DASH diet. Check sauces for hidden sugar."
            className="w-full p-3 rounded-xl border border-[#dce5dd] text-xs text-[#151d19] focus:outline-none focus:border-[#164530]"
          />
        </div>

        {/* Save Bar */}
        <div className="pt-4 border-t border-[#edf6ee] flex justify-end">
          <button
            type="button"
            onClick={triggerSaveNotification}
            className="px-8 py-3.5 rounded-full bg-[#164530] hover:bg-[#2f5d46] text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            <span>Save Guardrails for {activeProfile.name}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
