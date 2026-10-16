import React from 'react';
import { SuitabilityAnalysis } from '../types';

interface SuitabilityBadgeProps {
  analysis: SuitabilityAnalysis;
  onOpenDetails?: () => void;
  compact?: boolean;
}

export const SuitabilityBadge: React.FC<SuitabilityBadgeProps> = ({
  analysis,
  onOpenDetails,
  compact = false,
}) => {
  const getBadgeStyle = () => {
    switch (analysis.status) {
      case 'matches':
        return {
          bg: 'bg-[#bceed0]/70 border-[#8ed7ac]',
          text: 'text-[#003920]',
          icon: 'check_circle',
          label: 'Matches Profile',
        };
      case 'check_needed':
        return {
          bg: 'bg-[#ffeed6] border-[#fcd39b]',
          text: 'text-[#683b00]',
          icon: 'warning',
          label: 'Check Needed',
        };
      case 'not_suitable':
        return {
          bg: 'bg-[#ffdad6] border-[#ffb4ab]',
          text: 'text-[#680007]',
          icon: 'cancel',
          label: analysis.isMedicallyCritical ? 'Medical Conflict' : 'Not Suitable',
        };
      case 'insufficient_info':
      default:
        return {
          bg: 'bg-[#edf6ee] border-[#c0c9c1]',
          text: 'text-[#414943]',
          icon: 'help',
          label: 'Info Incomplete',
        };
    }
  };

  const style = getBadgeStyle();

  if (compact) {
    return (
      <button
        type="button"
        onClick={onOpenDetails}
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-bold cursor-pointer transition-transform hover:scale-102 ${style.bg} ${style.text}`}
        title={analysis.summary}
      >
        <span className="material-symbols-outlined text-[14px]">{style.icon}</span>
        <span>{style.label}</span>
      </button>
    );
  }

  return (
    <div
      onClick={onOpenDetails}
      className={`rounded-xl border p-2.5 flex items-start gap-2.5 transition-all ${
        onOpenDetails ? 'cursor-pointer hover:shadow-xs' : ''
      } ${style.bg}`}
    >
      <span className={`material-symbols-outlined text-[18px] shrink-0 mt-0.5 ${style.text}`}>
        {style.icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <span className={`text-xs font-bold ${style.text}`}>{style.label}</span>
          {onOpenDetails && (
            <span className={`text-[10px] font-semibold underline underline-offset-2 ${style.text}`}>
              Why?
            </span>
          )}
        </div>
        <p className={`text-[11px] leading-snug mt-0.5 line-clamp-2 ${style.text} opacity-90`}>
          {analysis.summary}
        </p>
      </div>
    </div>
  );
};
