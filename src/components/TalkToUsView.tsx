import React, { useState } from 'react';
import { DiscussionEmbed, CommentCount } from 'disqus-react';

interface DiscussionTopic {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: string;
}

const TOPICS: DiscussionTopic[] = [
  {
    id: 'nourishme-talk-to-us-general',
    title: 'Talk to Us: Community Inquiries, Support & Feedback',
    category: 'General Care & Support',
    description: 'Ask questions directly to our team, report ingredient discrepancies, or share ideas to improve NourishMe.',
    icon: 'chat',
  },
  {
    id: 'nourishme-elderly-caregiver-exchange',
    title: 'Caregiver Circle: Low-Sodium & Diabetic Cooking for Aging Parents',
    category: 'Elderly Care',
    description: 'Exchange recipe adaptations, practical low-GI hacks, and tips for managing hypertension and diabetes at home.',
    icon: 'elderly',
  },
  {
    id: 'nourishme-product-supermarket-requests',
    title: 'Request Missing Ingredients from FairPrice, RedMart & Sheng Siong',
    category: 'Marketplace Sourcing',
    description: 'Tell us which hard-to-find allergy-safe or organic products you want us to track across Singapore grocers.',
    icon: 'add_shopping_cart',
  },
  {
    id: 'nourishme-allergy-safety-discussions',
    title: 'Allergy Alerts & Shared Facility Verification',
    category: 'Food Safety',
    description: 'Community-vetted alerts regarding manufacturer changes in precautionary "may contain" statements.',
    icon: 'security',
  },
];

export const TalkToUsView: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<DiscussionTopic>(TOPICS[0]);

  // Safe window location fallback
  const currentUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/talk-to-us#${selectedTopic.id}`
    : `https://nourishme.sg/talk-to-us#${selectedTopic.id}`;

  const disqusConfig = {
    url: currentUrl,
    identifier: selectedTopic.id,
    title: selectedTopic.title,
    language: 'en',
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 pb-24">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#edf6ee] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#bceed0] text-[#003920] text-xs font-bold mb-2">
            <span className="material-symbols-outlined text-[16px]">forum</span>
            <span>Open Community & Direct Support</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#151d19]">
            Talk to Us & Community Forum
          </h1>
          <p className="text-xs sm:text-sm text-[#556057] mt-1 max-w-2xl leading-relaxed">
            Have a question about specific dietary ingredients, clinical conditions, or supermarket pricing? Connect directly with the NourishMe team, nutritionists, and other Singapore families.
          </p>
        </div>

        {/* Live Comment Count Badge */}
        <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-white border border-[#e2eae2] shadow-2xs self-start md:self-auto">
          <span className="material-symbols-outlined text-[#164530] text-[20px]">mark_chat_read</span>
          <div className="text-xs">
            <span className="text-[10px] text-[#556057] block font-semibold uppercase tracking-wider">
              Disqus Discussion
            </span>
            <span className="font-bold text-[#164530]">
              <CommentCount
                shortname="nourishme"
                config={{
                  url: currentUrl,
                  identifier: selectedTopic.id,
                  title: selectedTopic.title,
                }}
              >
                Comments & Discussions
              </CommentCount>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Topic Channels & Direct Help (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Discussion Channels Selector */}
          <div className="bg-white rounded-3xl border border-[#e2eae2] p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-[#151d19] uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#164530]">topic</span>
              <span>Discussion Channels</span>
            </h3>

            <div className="space-y-2">
              {TOPICS.map((topic) => {
                const isSelected = selectedTopic.id === topic.id;
                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => setSelectedTopic(topic)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-[#edf6ee] border-[#164530] ring-1 ring-[#164530]/20 shadow-xs'
                        : 'bg-[#f8fbf8] border-[#e2eae2] hover:bg-[#edf6ee]/50'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected ? 'bg-[#164530] text-white' : 'bg-white text-[#556057] border border-[#dce5dd]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">{topic.icon}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#9a4521]">
                          {topic.category}
                        </span>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-[#164530]"></span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-[#151d19] leading-snug mt-0.5">
                        {topic.title}
                      </h4>
                      <p className="text-[11px] text-[#556057] mt-1 line-clamp-2 leading-relaxed">
                        {topic.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Caregiver Direct Contact Card */}
          <div className="bg-[#f8fbf8] rounded-3xl border border-[#e2eae2] p-5 space-y-3">
            <h3 className="text-xs font-bold text-[#151d19] uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#164530]">contact_support</span>
              <span>Caregiver Direct Helpdesk</span>
            </h3>
            <p className="text-xs text-[#556057] leading-relaxed">
              Need urgent assistance verifying ingredient labels for severe anaphylactic allergies or dialysis dietary bounds?
            </p>

            <div className="space-y-2 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-white border border-[#edf6ee] flex items-center gap-3">
                <span className="material-symbols-outlined text-[#164530] text-[20px]">mail</span>
                <div>
                  <span className="text-[10px] text-[#556057] block font-bold uppercase">Direct Email</span>
                  <a href="mailto:support@nourishme.sg" className="font-semibold text-[#164530] hover:underline">
                    support@nourishme.sg
                  </a>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#edf6ee] flex items-center gap-3">
                <span className="material-symbols-outlined text-[#164530] text-[20px]">schedule</span>
                <div>
                  <span className="text-[10px] text-[#556057] block font-bold uppercase">Operating Hours</span>
                  <span className="font-semibold text-[#151d19]">Mon – Fri, 9:00 AM – 6:00 PM (SGT)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Embedded Disqus Forum Thread (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl border border-[#e2eae2] p-6 sm:p-8 shadow-xs">
            {/* Active Thread Banner */}
            <div className="border-b border-[#edf6ee] pb-4 mb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#164530] bg-[#edf6ee] px-2.5 py-1 rounded-full inline-block mb-2">
                Active Thread: {selectedTopic.category}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-[#151d19]">
                {selectedTopic.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#556057] mt-1 leading-relaxed">
                {selectedTopic.description}
              </p>
            </div>

            {/* Disqus Discussion Embed */}
            <div className="min-h-[450px]">
              <DiscussionEmbed
                shortname="nourishme"
                config={disqusConfig}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
