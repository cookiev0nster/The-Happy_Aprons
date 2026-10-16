import React from 'react';

interface NourishMeLogoProps {
  variant?: 'full' | 'mark-only' | 'compact';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  inverted?: boolean;
}

export const NourishMeLogo: React.FC<NourishMeLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  inverted = false,
}) => {
  // Dimensions based on size
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-[19px]',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  const textColorPrimary = inverted ? 'text-white' : 'text-[#164530]';
  const textColorAccent = inverted ? 'text-[#bceed0]' : 'text-[#22724D]';

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Brand Icon Emblem */}
      <div
        className={`relative ${iconSizes[size]} shrink-0 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm overflow-hidden ${
          inverted ? 'bg-white/10 border border-white/20' : 'bg-gradient-to-br from-[#164530] to-[#1e583f] border border-[#164530]/20'
        }`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[75%] h-[75%]"
        >
          {/* Nourishing Bowl Base */}
          <path
            d="M6 18C6 24.6274 11.3726 30 18 30C24.6274 30 30 24.6274 30 18H6Z"
            fill={inverted ? '#ffffff' : '#bceed0'}
            fillOpacity={inverted ? '0.9' : '0.95'}
          />
          {/* Stem & Center Vein */}
          <path
            d="M18 20V8"
            stroke={inverted ? '#164530' : '#164530'}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Left Sprout Leaf */}
          <path
            d="M18 14C14.2 13.5 11.5 10 11.5 7C14.5 7 17.5 10.2 18 14Z"
            fill={inverted ? '#bceed0' : '#34D399'}
          />
          {/* Right Flourishing Leaf */}
          <path
            d="M18 11.5C21.8 11 24.5 8 24.5 5C21.5 5 18.5 7.8 18 11.5Z"
            fill={inverted ? '#ffdbce' : '#fd9167'}
          />
          {/* Golden Vitality Seed Accent */}
          <circle cx="18" cy="22" r="2" fill="#C25E34" />
        </svg>
      </div>

      {/* Wordmark */}
      {variant !== 'mark-only' && (
        <div className="flex flex-col leading-none">
          <div className={`font-bold tracking-tight ${textSizes[size]} whitespace-nowrap`}>
            <span className={textColorPrimary}>Nourish</span>
            <span className={`${textColorAccent} font-extrabold ml-0.5`}>Me</span>
          </div>
          {variant === 'full' && size !== 'sm' && (
            <span className={`text-[10px] uppercase font-semibold tracking-wider mt-0.5 ${inverted ? 'text-white/60' : 'text-[#414943]/80'} font-mono-data`}>
              Smart Meal Atelier
            </span>
          )}
        </div>
      )}
    </div>
  );
};
