import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CreditCard, Info, CheckCircle } from 'lucide-react';
import LoggedInLayout from './src/components/LoggedInLayout';

const plans: Record<string, { name: string; monthlyPrice: number; yearlyPrice: number }> = {
  professional: { name: 'SafePost Professional', monthlyPrice: 20, yearlyPrice: 200 },
  proplus: { name: 'SafePost Pro+', monthlyPrice: 49, yearlyPrice: 490 },
  ultra: { name: 'SafePost Ultra', monthlyPrice: 149, yearlyPrice: 1490 },
};

const UpgradeConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const planKey = searchParams.get('plan') || '';
  const billing = searchParams.get('billing') || 'monthly';
  const selectedPlan = plans[planKey];

  const price = selectedPlan
    ? billing === 'yearly' ? selectedPlan.yearlyPrice : selectedPlan.monthlyPrice
    : 0;
  const billingLabel = billing === 'yearly' ? 'year' : 'month';
  const formattedPrice = `$${price.toFixed(2)}/${billingLabel}`;

  const [upgraded, setUpgraded] = useState(false);

  const handleConfirmUpgrade = () => {
    if (planKey) {
      sessionStorage.setItem('safepost_plan', planKey);
    }
    setUpgraded(true);
  };

  return (
    <LoggedInLayout>
      <div className="max-w-2xl mx-auto px-6 pt-6 pb-10 md:pt-8 md:pb-16">
        {/* Back to Plans */}
        <button
          onClick={() => navigate('/change-plan?mode=upgrade')}
          className="flex items-center gap-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors mb-8 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Plans
        </button>

        {/* Page Heading */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 mb-2 dark:text-white">
            Confirm Your Upgrade
          </h1>
          <p className="text-[14px] text-gray-500 dark:text-gray-300">
            Review your new plan before confirming
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-lg shadow-black/[0.04] dark:bg-gray-800 dark:border-gray-700">
          {!upgraded ? (
            <>
              {/* Order Summary */}
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[14px] font-semibold text-gray-900 dark:text-white">
                    {selectedPlan?.name || 'Unknown Plan'}
                  </p>
                  <p className="text-[14px] font-medium text-gray-900 dark:text-white">{formattedPrice}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[13px] text-gray-500 dark:text-gray-400">
                    Billed {billing === 'yearly' ? 'annually' : 'monthly'}
                  </p>
                  <p className="text-[12px] text-gray-400 dark:text-gray-500">Incl. GST</p>
                </div>

                <div className="border-t border-black/[0.06] dark:border-gray-700 my-5" />

                <div className="flex items-center justify-between">
                  <p className="text-[14px] font-semibold text-gray-900 dark:text-white">Total</p>
                  <p className="text-[14px] font-semibold text-gray-900 dark:text-white">{formattedPrice}</p>
                </div>
              </div>

              <div className="border-t border-black/[0.06] dark:border-gray-700" />

              {/* Payment Method */}
              <div className="p-6 md:p-8">
                <p className="text-[11px] font-semibold text-gray-400 tracking-wider uppercase mb-3 dark:text-gray-500">Payment Method</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <div>
                      <p className="text-[14px] font-medium text-gray-900 dark:text-white">Visa ending in 4242</p>
                      <p className="text-[13px] text-gray-500 mt-0.5 dark:text-gray-400">Expires 12/2027</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/update-card')}
                    className="text-[13px] font-medium text-blue-600 hover:text-blue-700 transition-colors dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Update
                  </button>
                </div>
              </div>

              <div className="border-t border-black/[0.06] dark:border-gray-700" />

              {/* Info Notice */}
              <div className="px-6 md:px-8 pt-5 pb-1">
                <div className="flex gap-3 p-4 bg-blue-50 rounded-xl dark:bg-blue-900/20">
                  <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-[13px] text-blue-700 leading-relaxed dark:text-blue-300">
                    Your new plan takes effect immediately. You will be charged the prorated difference for the remainder of your current billing period.
                  </p>
                </div>
              </div>

              <div className="border-t border-black/[0.06] dark:border-gray-700 mt-5" />

              {/* Buttons */}
              <div className="flex items-center gap-3 p-6 md:px-8">
                <button
                  onClick={() => navigate('/change-plan?mode=upgrade')}
                  className="flex-1 h-11 text-[14px] font-semibold text-gray-600 hover:text-gray-900 rounded-lg border border-black/[0.08] hover:border-black/[0.15] hover:bg-black/[0.02] transition-all duration-200 active:scale-[0.98] dark:text-gray-300 dark:hover:text-white dark:border-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmUpgrade}
                  className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-semibold rounded-lg transition-all duration-200 active:scale-[0.98]"
                >
                  Confirm Upgrade
                </button>
              </div>
            </>
          ) : (
            /* Success State */
            <div className="p-6 md:p-8 text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2 dark:text-white">
                Plan Upgraded Successfully!
              </h2>
              <p className="text-[14px] text-gray-500 mb-6 dark:text-gray-300">
                Your plan has been upgraded to {selectedPlan?.name || 'your new plan'}. Your new features are now active.
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="h-11 px-8 bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-semibold rounded-lg transition-all duration-200 active:scale-[0.98]"
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </LoggedInLayout>
  );
};

export default UpgradeConfirmation;
