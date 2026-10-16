import React from 'react';

interface StepProgressBarProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
}

export const StepProgressBar: React.FC<StepProgressBarProps> = ({
  currentStep,
  onSelectStep,
}) => {
  const steps = [
    { number: 1, title: 'Household & Taste Profile', shortTitle: '1. Household & Needs' },
    { number: 2, title: 'Nutrition & Macro Targets', shortTitle: '2. Nutrition & Macro' },
    { number: 3, title: 'Pantry & Grocer Sync', shortTitle: '3. Pantry & Grocer' },
    { number: 4, title: 'Instant NourishMe Week Plan', shortTitle: '4. Weekly Plan' },
  ];

  const activeStepObj = steps.find((s) => s.number === currentStep) || steps[0];

  return (
    <div className="w-full bg-[#edf6ee]/80 backdrop-blur-sm py-4 border-b border-[#e2eae2]/80">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#164530] text-[#bceed0] text-xs font-bold font-mono-data">
              {currentStep}
            </span>
            <span className="text-sm text-[#164530] font-bold tracking-tight">
              Stage {currentStep} of 4: {activeStepObj.title}
            </span>
          </div>
          <span className="text-xs text-[#414943] font-medium font-mono-data tracking-tight">
            Estimated calibration: ~90s
          </span>
        </div>

        {/* Segmented Step Bars */}
        <div className="grid grid-cols-4 gap-2.5">
          {steps.map((s) => (
            <button
              key={s.number}
              type="button"
              onClick={() => onSelectStep(s.number)}
              className="group text-left focus:outline-none cursor-pointer py-1"
              aria-label={`Go to ${s.title}`}
            >
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s.number <= currentStep
                    ? 'bg-[#164530]'
                    : 'bg-[#dce5dd] group-hover:bg-[#c0c9c1]'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Labels below bars */}
        <div className="hidden md:grid grid-cols-4 gap-2.5 mt-1.5">
          {steps.map((s) => (
            <button
              key={s.number}
              type="button"
              onClick={() => onSelectStep(s.number)}
              className={`text-left text-xs transition-colors cursor-pointer ${
                s.number === currentStep
                  ? 'text-[#164530] font-bold'
                  : s.number < currentStep
                  ? 'text-[#164530] font-medium'
                  : 'text-[#414943]/70 hover:text-[#151d19]'
              }`}
            >
              {s.shortTitle}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
