import React, { useEffect, useState } from 'react';
import { Database, Brain, CheckCircle } from 'lucide-react';
import type { CheckerStep } from '../../hooks/useComplianceChecker';

interface AnalysisProgressProps {
  step: CheckerStep;
}

const STEPS = [
  {
    id: 'fetching_guidelines',
    icon: Database,
    label: 'Loading guidelines',
    description: 'Fetching AHPRA, National Law, and TGA guidelines from the database…',
  },
  {
    id: 'analyzing',
    icon: Brain,
    label: 'Analysing content',
    description: 'Comparing your content against all applicable compliance rules…',
  },
];

const ANALYZING_MESSAGES = [
  'Checking for prohibited testimonials and patient reviews…',
  'Reviewing claims and efficacy statements…',
  'Verifying qualification representations…',
  'Checking for prohibited before/after imagery references…',
  'Reviewing discount and inducement provisions…',
  'Checking TGA therapeutic goods requirements…',
  'Verifying privacy compliance…',
  'Compiling compliance report…',
];

export function AnalysisProgress({ step }: AnalysisProgressProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (step !== 'analyzing') return;
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % ANALYZING_MESSAGES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [step]);

  const currentStepIndex = step === 'analyzing' ? 0 : 1;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
      <div className="max-w-md mx-auto">
        {/* Animated logo */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
              {step === 'analyzing' && currentStepIndex === 0 ? (
                <Database className="w-8 h-8 text-blue-600 animate-pulse" />
              ) : (
                <Brain className="w-8 h-8 text-blue-600 animate-pulse" />
              )}
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
          </div>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-3 mb-6">
          {STEPS.map((s, i) => {
            const isDone = i < currentStepIndex;
            const isCurrent = i === currentStepIndex;
            return (
              <React.Fragment key={s.id}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      isDone
                        ? 'bg-green-500 text-white'
                        : isCurrent
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {isDone ? <CheckCircle className="w-4 h-4" /> : i + 1}
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      isCurrent ? 'text-blue-700' : isDone ? 'text-green-700' : 'text-gray-400'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`h-px w-8 ${isDone ? 'bg-green-400' : 'bg-gray-200'}`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Dynamic message */}
        <p className="text-sm text-gray-600 min-h-[40px] transition-opacity duration-500">
          {step === 'analyzing' && currentStepIndex === 0
            ? STEPS[0].description
            : ANALYZING_MESSAGES[messageIndex]}
        </p>

        <p className="text-xs text-gray-400 mt-4">
          This usually takes 15–30 seconds depending on content length.
        </p>
      </div>
    </div>
  );
}