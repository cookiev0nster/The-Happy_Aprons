import React, { useState } from 'react';
import { ActiveTab, HouseholdMemberProfile } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  activeProfile: HouseholdMemberProfile;
  householdProfiles: HouseholdMemberProfile[];
  onSelectProfile: (profile: HouseholdMemberProfile) => void;
  basketCount: number;
  onOpenBasket: () => void;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  activeProfile,
  householdProfiles,
  onSelectProfile,
  basketCount,
  onOpenBasket,
  onOpenAdmin,
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#e2eae2] shadow-[0_1px_8px_rgba(22,69,48,0.04)]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-4 shrink-0">
          <button
            type="button"
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-[#164530] flex items-center justify-center text-[#bceed0] shadow-xs group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[22px]">nutrition</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold text-[#164530] tracking-tight">NourishMe</span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#edf6ee] text-[#164530] border border-[#dce5dd]">
                  Singapore
                </span>
              </div>
              <p className="text-[11px] text-[#556057] font-medium leading-none hidden sm:block">
                The right ingredients for you.
              </p>
            </div>
          </button>
        </div>

        {/* Household Profile Switcher Pill */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#edf6ee] hover:bg-[#e2eae2] border border-[#dce5dd] transition-all cursor-pointer text-left"
            title="Change active household dietary profile"
          >
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
              style={{ backgroundColor: activeProfile.avatarColor }}
            >
              {activeProfile.name.charAt(0)}
            </div>
            <div className="max-w-[130px] sm:max-w-[200px] truncate">
              <span className="text-[10px] uppercase tracking-wider text-[#556057] font-semibold block leading-none">
                Shopping For:
              </span>
              <span className="text-xs font-bold text-[#151d19] truncate block leading-tight">
                {activeProfile.name}
              </span>
            </div>
            <span className="material-symbols-outlined text-[18px] text-[#414943]">expand_more</span>
          </button>

          {profileDropdownOpen && (
            <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#e2eae2] py-2 z-50 text-left animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2 border-b border-[#edf6ee]">
                <p className="text-xs font-bold text-[#151d19]">Household Dietary Guardrails</p>
                <p className="text-[11px] text-[#556057]">
                  All ingredient safety badges immediately calibrate to the selected family member.
                </p>
              </div>

              <div className="py-1 max-h-60 overflow-y-auto">
                {householdProfiles.map((member) => (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => {
                      onSelectProfile(member);
                      setProfileDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 flex items-start gap-3 hover:bg-[#edf6ee] transition-colors text-left cursor-pointer ${
                      activeProfile.id === member.id ? 'bg-[#edf6ee]/70 font-bold' : ''
                    }`}
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5"
                      style={{ backgroundColor: member.avatarColor }}
                    >
                      {member.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#151d19] truncate">{member.name}</span>
                        {member.isPrimary && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#ffdbce] text-[#380d00] font-semibold">
                            Primary
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#556057] truncate mt-0.5">
                        {member.healthConditions.length > 0
                          ? member.healthConditions[0]
                          : member.allergies.length > 0
                          ? `Allergic: ${member.allergies.join(', ')}`
                          : member.dietaryPreferences.join(', ') || 'General Wellness'}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="px-3 pt-2 pb-1 border-t border-[#edf6ee]">
                <button
                  type="button"
                  onClick={() => {
                    onSelectTab('profile');
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full py-1.5 px-3 rounded-lg text-xs font-bold text-[#164530] hover:bg-[#edf6ee] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">manage_accounts</span>
                  Manage All Profiles & Constraints
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Navigation Links */}
        <nav aria-label="Desktop Navigation" className="hidden lg:flex items-center gap-1 bg-[#edf6ee] p-1 rounded-full border border-[#dce5dd]">
          <button
            type="button"
            onClick={() => onSelectTab('home')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'home'
                ? 'bg-[#164530] text-white shadow-xs'
                : 'text-[#414943] hover:text-[#151d19]'
            }`}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('discover')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'discover'
                ? 'bg-[#164530] text-white shadow-xs'
                : 'text-[#414943] hover:text-[#151d19]'
            }`}
          >
            Discover Ingredients
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('recipes')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'recipes'
                ? 'bg-[#164530] text-white shadow-xs'
                : 'text-[#414943] hover:text-[#151d19]'
            }`}
          >
            Safe Recipes
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('saved-orders')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'saved-orders'
                ? 'bg-[#164530] text-white shadow-xs'
                : 'text-[#414943] hover:text-[#151d19]'
            }`}
          >
            Saved & Orders
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('profile')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-[#164530] text-white shadow-xs'
                : 'text-[#414943] hover:text-[#151d19]'
            }`}
          >
            Dietary Profile
          </button>
        </nav>

        {/* Actions Zone: Admin + Basket */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onOpenAdmin}
            className="p-2 rounded-xl text-[#414943] hover:text-[#164530] hover:bg-[#edf6ee] transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
            title="Admin data quality & multi-supermarket catalog management"
          >
            <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
            <span className="hidden xl:inline">Catalog Admin</span>
          </button>

          <button
            type="button"
            onClick={onOpenBasket}
            className="relative px-3 sm:px-4 py-2 rounded-full bg-[#164530] hover:bg-[#2f5d46] text-white transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            aria-label="View shopping basket"
          >
            <span className="material-symbols-outlined text-[20px]">shopping_basket</span>
            <span className="text-xs font-bold hidden sm:inline">Basket</span>
            {basketCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#9a4521] text-white text-[11px] font-bold flex items-center justify-center">
                {basketCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
