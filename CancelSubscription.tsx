import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import LoggedInLayout from './src/components/LoggedInLayout';

const reasons = [
  'Too expensive',
  'Not using it enough',
  'Missing a feature I need',
  'Switching to a competitor',
  'Practice closing or changing',
  'Other',
];

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
};

const CancelSubscription: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || 'billing';
  const backLabel = from === 'billing' ? 'Back to Billing' : 'Back to Profile';
  const backPath = from === 'billing' ? '/billing' : '/profile';

  const billingPeriod = sessionStorage.getItem('safepost_billing') || '';

  const [step, setStep] = useState(1);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [otherText, setOtherText] = useState('');
  const [featureFeedback, setFeatureFeedback] = useState('');
  const [outcome, setOutcome] = useState<'paused' | 'cancelled' | null>(null);

  // Calculate billing period end date
  const billingEndDate = (() => {
    const date = new Date();
    if (billingPeriod.toLowerCase() === 'yearly') {
      date.setFullYear(date.getFullYear() + 1);
    } else {
      date.setMonth(date.getMonth() + 1);
    }
    return formatDate(date);
  })();

  // Pause resume date (30 days from today)
  const pauseResumeDate = (() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return formatDate(date);
  })();

  const handlePause = () => {
    sessionStorage.setItem('safepost_paused', 'true');
    setOutcome('paused');
  };

  const handleConfirmCancel = () => {
    sessionStorage.setItem('safepost_cancelled', 'true');
    sessionStorage.setItem('safepost_cancel_date', billingEndDate);
    setOutcome('cancelled');
  };

  // Step indicator
  const StepIndicator = () => (
    <div className="flex items-center gap-3 mb-6">
      <p className="text-[12px] font-medium text-gray-400 dark:text-gray-500">Step {step} of 3</p>
      <div className="flex items-center gap-1.5">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              s <= step ? 'w-6 bg-blue-500' : 'w-4 bg-gray-200 dark:bg-gray-700'
            }`}
          />
        ))}
      </div>
    </div>
  );

  // Step 2 retention offer content
  const getRetentionOffer = () => {
    const isPauseOffer = selectedReason === 'Too expensive' || selectedReason === 'Practice closing or changing';

    if (isPauseOffer) {
      return {
        heading: selectedReason === 'Too expensive' ? 'What if you could pause instead?' : 'Take a break instead',
        body: 'Put your subscription on hold for 30 days at no charge. Your account and compliance check history will be fully preserved and your subscription resumes automatically after 30 days.',
        buttonLabel: 'Pause My Subscription for 30 Days',
        onButtonClick: handlePause,
        showTextArea: false,
      };
    }

    if (selectedReason === 'Not using it enough') {
      return {
        heading: "Here's the value you've already received",
        body: 'Every compliance check protects your AHPRA registration. Missing just one non-compliant post could trigger an investigation.',
        buttonLabel: 'Keep My Subscription',
        onButtonClick: () => navigate('/dashboard'),
        showTextArea: false,
      };
    }

    if (selectedReason === 'Missing a feature I need') {
      return {
        heading: 'Tell us what you need',
        body: "We're constantly improving SafePost based on user feedback. Your input directly shapes our roadmap.",
        buttonLabel: 'Submit Feedback & Keep Subscription',
        onButtonClick: () => navigate('/dashboard'),
        showTextArea: true,
      };
    }

    if (selectedReason === 'Switching to a competitor') {
      return {
        heading: 'SafePost is built specifically for Australian practitioners',
        body: 'Our compliance database is built on AHPRA guidelines, the National Law and TGA requirements — specific to Australian healthcare. No generic AI tool offers this level of Australian regulatory precision.',
        buttonLabel: 'Keep My Subscription',
        onButtonClick: () => navigate('/dashboard'),
        showTextArea: false,
      };
    }

    // Other
    return {
      heading: "We'd love to help",
      body: 'If there\'s anything we can do to improve your experience, please reach out before you go.',
      buttonLabel: 'Keep My Subscription',
      onButtonClick: () => navigate('/dashboard'),
      showTextArea: false,
      showContact: true,
    };
  };

  return (
    <LoggedInLayout>
      <div className="max-w-2xl mx-auto px-6 pt-6 pb-10 md:pt-8 md:pb-16">
        {/* Back link */}
        <button
          onClick={() => navigate(backPath)}
          className="flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {backLabel}
        </button>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-lg shadow-black/[0.04] dark:bg-gray-800 dark:border-gray-700">

          {/* ===== OUTCOME: PAUSED ===== */}
          {outcome === 'paused' && (
            <div className="p-6 md:p-8 text-center">
              <div className="text-4xl mb-4">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2 dark:text-white">
                Subscription Paused
              </h2>
              <p className="text-[14px] text-gray-500 mb-6 leading-relaxed dark:text-gray-300">
                Your subscription is on hold for 30 days. No charge will be made during this period. Your subscription will resume automatically on {pauseResumeDate}.
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="h-11 px-8 bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-semibold rounded-lg transition-all duration-200 active:scale-[0.98]"
              >
                Go to Dashboard
              </button>
            </div>
          )}

          {/* ===== OUTCOME: CANCELLED ===== */}
          {outcome === 'cancelled' && (
            <div className="p-6 md:p-8 text-center">
              <div className="text-4xl mb-4">
                <span className="inline-block">&#128075;</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2 dark:text-white">
                Your subscription has been cancelled
              </h2>
              <p className="text-[14px] text-gray-500 mb-6 leading-relaxed dark:text-gray-300">
                Your access continues until {billingEndDate}. We hope to see you again soon.
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="h-11 px-8 bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-semibold rounded-lg transition-all duration-200 active:scale-[0.98]"
              >
                Go to Dashboard
              </button>
            </div>
          )}

          {/* ===== STEP 1: REASON ===== */}
          {!outcome && step === 1 && (
            <div className="p-6 md:p-8">
              <StepIndicator />

              <h2 className="text-xl font-bold text-gray-900 mb-2 dark:text-white">
                We're sorry to see you go
              </h2>
              <p className="text-[14px] text-gray-500 mb-6 dark:text-gray-300">
                Before you cancel, could you tell us why?
              </p>

              <div className="space-y-2">
                {reasons.map((reason) => (
                  <button
                    key={reason}
                    onClick={() => setSelectedReason(reason)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-200 ${
                      selectedReason === reason
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500'
                        : 'border-black/[0.06] hover:border-black/[0.12] hover:bg-black/[0.01] dark:border-gray-700 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      selectedReason === reason ? 'border-blue-600 bg-blue-600' : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {selectedReason === reason && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>
                    <span className="text-[14px] text-gray-700 dark:text-gray-300">{reason}</span>
                  </button>
                ))}
              </div>

              {/* Other text area */}
              {selectedReason === 'Other' && (
                <textarea
                  value={otherText}
                  onChange={(e) => setOtherText(e.target.value)}
                  placeholder="Please tell us more (optional)"
                  className="w-full mt-3 px-4 py-3 text-[14px] text-gray-900 bg-white rounded-xl border border-gray-200 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-y min-h-[80px] dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
              )}

              <div className="border-t border-black/[0.06] dark:border-gray-700 mt-6 pt-6" />

              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-semibold rounded-lg transition-all duration-200 active:scale-[0.98]"
                >
                  Keep My Subscription
                </button>
                <button
                  disabled={!selectedReason}
                  onClick={() => setStep(2)}
                  className={`flex-1 h-11 text-[14px] font-semibold rounded-lg border transition-all duration-200 active:scale-[0.98] ${
                    selectedReason
                      ? 'text-gray-600 hover:text-gray-900 border-black/[0.08] hover:border-black/[0.15] hover:bg-black/[0.02] dark:text-gray-300 dark:hover:text-white dark:border-gray-600'
                      : 'text-gray-300 border-black/[0.04] cursor-not-allowed dark:text-gray-600 dark:border-gray-700'
                  }`}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* ===== STEP 2: RETENTION OFFER ===== */}
          {!outcome && step === 2 && (() => {
            const offer = getRetentionOffer();
            return (
              <div className="p-6 md:p-8">
                <StepIndicator />

                <h2 className="text-xl font-bold text-gray-900 mb-2 dark:text-white">
                  {offer.heading}
                </h2>
                <p className="text-[14px] text-gray-500 leading-relaxed dark:text-gray-300">
                  {offer.body}
                </p>

                {'showContact' in offer && offer.showContact && (
                  <p className="text-[14px] text-blue-600 font-medium mt-3 dark:text-blue-400">
                    info@safepost.com.au
                  </p>
                )}

                {offer.showTextArea && (
                  <textarea
                    value={featureFeedback}
                    onChange={(e) => setFeatureFeedback(e.target.value)}
                    placeholder="Tell us what feature you need..."
                    className="w-full mt-4 px-4 py-3 text-[14px] text-gray-900 bg-white rounded-xl border border-gray-200 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-y min-h-[100px] dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  />
                )}

                <div className="border-t border-black/[0.06] dark:border-gray-700 mt-6 pt-6" />

                <button
                  onClick={offer.onButtonClick}
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-semibold rounded-lg transition-all duration-200 active:scale-[0.98]"
                >
                  {offer.buttonLabel}
                </button>

                <div className="text-center mt-4">
                  <button
                    onClick={() => setStep(3)}
                    className="text-[13px] text-gray-400 hover:text-gray-600 transition-colors dark:text-gray-500 dark:hover:text-gray-300"
                  >
                    No thanks, continue to cancel &rarr;
                  </button>
                </div>
              </div>
            );
          })()}

          {/* ===== STEP 3: FINAL CONFIRMATION ===== */}
          {!outcome && step === 3 && (
            <div className="p-6 md:p-8">
              <StepIndicator />

              <h2 className="text-xl font-bold text-gray-900 mb-2 dark:text-white">
                Confirm Cancellation
              </h2>
              <p className="text-[14px] text-gray-500 mb-6 dark:text-gray-300">
                Please read the following before confirming
              </p>

              {/* Info box */}
              <div className="bg-gray-50 rounded-xl p-5 space-y-3 dark:bg-gray-700/50">
                <div className="flex items-start gap-2.5">
                  <span className="text-green-500 text-[14px] leading-none mt-0.5 flex-shrink-0">&#10003;</span>
                  <p className="text-[13px] text-gray-600 dark:text-gray-300">Your access continues until {billingEndDate}</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-green-500 text-[14px] leading-none mt-0.5 flex-shrink-0">&#10003;</span>
                  <p className="text-[13px] text-gray-600 dark:text-gray-300">Your compliance check history will be preserved</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-green-500 text-[14px] leading-none mt-0.5 flex-shrink-0">&#10003;</span>
                  <p className="text-[13px] text-gray-600 dark:text-gray-300">You can reactivate your subscription at any time</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-green-500 text-[14px] leading-none mt-0.5 flex-shrink-0">&#10003;</span>
                  <p className="text-[13px] text-gray-600 dark:text-gray-300">No further charges will be made after your access ends</p>
                </div>
              </div>

              <div className="border-t border-black/[0.06] dark:border-gray-700 mt-6 pt-6" />

              <button
                onClick={() => navigate('/dashboard')}
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-semibold rounded-lg transition-all duration-200 active:scale-[0.98]"
              >
                Keep My Subscription
              </button>

              <div className="text-center mt-4">
                <button
                  onClick={handleConfirmCancel}
                  className="text-[13px] text-red-500 hover:text-red-600 transition-colors"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </LoggedInLayout>
  );
};

export default CancelSubscription;
