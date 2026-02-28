import React, { useState, useRef, useEffect } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { getPlanTierLabel } from '../utils/planUtils';

interface OnboardingModalProps {
  firstName: string;
  planName: string;
  onComplete: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ firstName, planName, onComplete }) => {
  const [step, setStep] = useState(1);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // On mount, find the textarea in the dashboard to focus after completion
  useEffect(() => {
    const el = document.querySelector<HTMLTextAreaElement>('textarea');
    if (el) textareaRef.current = el;
  }, []);

  const planLimits: Record<string, string> = {
    starter: '3 compliance checks included this month',
    free: '3 compliance checks included this month',
    professional: '30 compliance checks included this month',
    proplus: '100 compliance checks included this month',
    ultra: 'Unlimited compliance checks this month',
  };

  const displayPlan = getPlanTierLabel(planName);
  const displayLimit = planLimits[planName.toLowerCase()] || '3 compliance checks included this month';

  const handleClose = () => {
    onComplete();
  };

  const handleFinalCTA = () => {
    onComplete();
    // Focus the textarea after closing
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  const dots = [1, 2, 3];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative max-w-lg w-full rounded-2xl bg-white p-8 shadow-xl mx-4">
        {/* Skip button — always visible */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-black/[0.04] transition-colors"
          aria-label="Skip onboarding"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step 1 — Welcome */}
        {step === 1 && (
          <div className="text-center space-y-5">
            {/* SafePost wordmark */}
            <div className="flex items-center justify-center gap-0">
              <span className="text-[28px] font-extrabold tracking-tight text-gray-900">Safe</span>
              <span className="text-[28px] font-extrabold tracking-tight text-[#2563EB]">Post</span>
              <span className="text-[14px] font-medium text-gray-400 ml-0.5 -mt-2">™</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">
                Welcome to SafePost™{firstName ? `, ${firstName}` : ''}!
              </h2>
              <p className="text-[14px] text-gray-500">
                You're seconds away from your first AHPRA compliance check.
              </p>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white text-[15px] font-semibold rounded-lg shadow-sm shadow-blue-600/25 transition-all duration-200 active:scale-[0.98]"
            >
              Show me how →
            </button>
          </div>
        )}

        {/* Step 2 — How it works */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-gray-900">How it works</h2>
            </div>

            <div className="space-y-5">
              {[
                {
                  num: 1,
                  label: 'Paste your content',
                  desc: 'Add your social media post, website copy, or ad caption.',
                },
                {
                  num: 2,
                  label: 'Get your compliance verdict',
                  desc: 'Checked against 134 AHPRA rules in seconds.',
                },
                {
                  num: 3,
                  label: 'Fix any issues instantly',
                  desc: 'AI-powered rewrites generated automatically.',
                },
              ].map((item) => (
                <div key={item.num} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-[14px] font-bold flex items-center justify-center flex-shrink-0">
                    {item.num}
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold text-gray-900">{item.label}</p>
                    <p className="text-[13px] text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setStep(3)}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white text-[15px] font-semibold rounded-lg shadow-sm shadow-blue-600/25 transition-all duration-200 active:scale-[0.98]"
            >
              Got it →
            </button>

            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-1 mx-auto text-[13px] text-gray-400 hover:text-gray-600 font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
          </div>
        )}

        {/* Step 3 — You're ready */}
        {step === 3 && (
          <div className="text-center space-y-5">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-gray-900">You're ready!</h2>
            </div>

            {/* Plan badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-blue-200 bg-blue-50">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-[13px] font-semibold text-blue-700">
                You're on SafePost™ {displayPlan}
              </span>
            </div>

            <p className="text-[14px] text-gray-500">{displayLimit}</p>

            <button
              onClick={handleFinalCTA}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white text-[15px] font-semibold rounded-lg shadow-sm shadow-blue-600/25 transition-all duration-200 active:scale-[0.98]"
            >
              Run my first check →
            </button>

            <p className="text-[12px] text-gray-400">
              Upgrade anytime for more checks and features
            </p>

            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-1 mx-auto text-[13px] text-gray-400 hover:text-gray-600 font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
          </div>
        )}

        {/* Step indicator dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {dots.map((dot) => (
            <div
              key={dot}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                dot === step ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
