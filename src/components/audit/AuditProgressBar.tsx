import React from 'react';
import { Check } from 'lucide-react';

interface StepItem {
  name: string;
  status: 'pending' | 'complete' | 'active';
}

interface AuditProgressBarProps {
  currentStep: number;
  steps: StepItem[];
}

const AuditProgressBar: React.FC<AuditProgressBarProps> = ({ currentStep, steps }) => {
  const total = steps.length;
  const completedCount = steps.filter((s) => s.status === 'complete').length;
  const progressPercent = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  return (
    <div className="w-full">
      {/* Step counter + label */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-[13px] font-medium text-gray-700">
          Step {Math.min(currentStep + 1, total)} of {total}
          {currentStep < total && (
            <span className="text-gray-400 font-normal"> — {steps[currentStep]?.name}</span>
          )}
        </p>
        <p className="text-[12px] text-gray-400">{progressPercent}% complete</p>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Step dots */}
      <div className="flex items-center justify-between mt-3">
        {steps.map((step, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1" style={{ width: `${100 / total}%` }}>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                step.status === 'complete'
                  ? 'bg-blue-600 border-blue-600'
                  : step.status === 'active'
                  ? 'bg-white border-blue-600'
                  : 'bg-white border-gray-200'
              }`}
            >
              {step.status === 'complete' ? (
                <Check className="w-3 h-3 text-white" />
              ) : (
                <span
                  className={`text-[10px] font-semibold ${
                    step.status === 'active' ? 'text-blue-600' : 'text-gray-300'
                  }`}
                >
                  {idx + 1}
                </span>
              )}
            </div>
            <span
              className={`text-[10px] text-center leading-tight hidden md:block ${
                step.status === 'active'
                  ? 'text-blue-600 font-medium'
                  : step.status === 'complete'
                  ? 'text-gray-500'
                  : 'text-gray-300'
              }`}
            >
              {step.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuditProgressBar;
