import React, { useState } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import LoggedInLayout from './src/components/LoggedInLayout';

const plans = [
  {
    key: 'professional',
    name: 'Professional',
    monthlyPrice: 20,
    yearlyPrice: 200,
    yearlyMonthlyEquivalent: '~$16',
    features: [
      '30 compliance checks per month',
      'AI-powered compliant content rewrites',
      'Image and video content analysis',
      'Compliance history (last 30 checks)',
      'Email support',
    ],
  },
  {
    key: 'proplus',
    name: 'Pro+',
    monthlyPrice: 49,
    yearlyPrice: 490,
    yearlyMonthlyEquivalent: '~$41',
    features: [
      'Everything in Professional, plus:',
      '100 compliance checks per month',
      'Multi-user access (up to 3 team members)',
      'Compliance history (last 100 checks)',
      'Priority email support',
    ],
  },
  {
    key: 'ultra',
    name: 'Ultra',
    monthlyPrice: 149,
    yearlyPrice: 1490,
    yearlyMonthlyEquivalent: '~$124',
    features: [
      'Everything in Pro+, plus:',
      'Unlimited compliance checks',
      'Multi-user access (up to 10 team members)',
      'Unlimited compliance history',
      'PDF compliance audit log export',
      'Bulk content review (upload multiple posts at once)',
      'Proactive notification of guideline changes',
      'Priority support + onboarding',
    ],
  },
];

const ChangePlan: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || 'profile';
  const backLabel = from === 'billing' ? 'Back to Billing' : 'Back to Profile';
  const backPath = from === 'billing' ? '/billing' : '/profile';

  const [searchParams] = useSearchParams();
  const planName = sessionStorage.getItem('safepost_plan') || '';
  const isUpgradeMode = searchParams.get('mode') === 'upgrade';

  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const currentPlanKey = planName.toLowerCase();
  const tierOrder = ['free', '', 'professional', 'proplus', 'ultra'];
  const currentTierIndex = tierOrder.indexOf(currentPlanKey);

  const availablePlans = isUpgradeMode
    ? plans.filter((p) => tierOrder.indexOf(p.key) > currentTierIndex)
    : plans.filter((p) => p.key !== currentPlanKey);

  const isHighestPlan = isUpgradeMode && currentPlanKey === 'ultra';
  const selectedPlanData = plans.find((p) => p.key === selectedPlan);

  return (
    <LoggedInLayout>
      <div className="max-w-2xl mx-auto px-6 pt-6 pb-10 md:pt-8 md:pb-16">
        {/* Back link */}
        <button
          onClick={() => navigate(backPath)}
          className="flex items-center gap-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors mb-8 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          {backLabel}
        </button>

        {/* Page Heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {isUpgradeMode ? 'Upgrade your Plan' : 'Change your Plan'}
          </h1>
          <p className="text-[14px] text-gray-500 mt-1 mb-8">
            {isUpgradeMode ? 'Choose a higher plan to unlock more features' : 'Pick one of the following plans'}
          </p>
        </div>

        {/* Highest Plan Message */}
        {isHighestPlan && (
          <div className="bg-white rounded-2xl border border-black/[0.06] shadow-lg shadow-black/[0.04] dark:bg-gray-800 dark:border-gray-700 p-8 text-center">
            <p className="text-[15px] font-medium text-gray-900 dark:text-white mb-4">You are already on our highest plan.</p>
            <button
              onClick={() => navigate(backPath)}
              className="text-[14px] font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              {backLabel}
            </button>
          </div>
        )}

        {/* Plan Card */}
        {!isHighestPlan && (
        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-lg shadow-black/[0.04] dark:bg-gray-800 dark:border-gray-700">
          {/* Billing Cycle Toggle */}
          <div className="p-6 md:px-8 pb-0">
            <div className="inline-flex rounded-lg border border-black/[0.06] dark:border-gray-600 p-0.5">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 text-[13px] font-medium rounded-md transition-colors duration-200 ${
                  billingCycle === 'monthly'
                    ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-1.5 text-[13px] font-medium rounded-md transition-colors duration-200 ${
                  billingCycle === 'yearly'
                    ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                }`}
              >
                Yearly
              </button>
            </div>
          </div>

          {/* Plan Radio Options */}
          {availablePlans.map((plan, index) => (
            <div key={plan.key}>
              {index > 0 && <div className="border-t border-black/[0.06] dark:border-gray-700" />}
              <button
                onClick={() => setSelectedPlan(plan.key)}
                className="w-full flex items-center justify-between p-6 md:px-8 text-left transition-colors hover:bg-black/[0.01] dark:hover:bg-white/[0.02]"
              >
                <div>
                  <p className="text-[14px] font-medium text-gray-900 dark:text-white">{plan.name}</p>
                  <p className="text-[13px] text-gray-500 mt-0.5 dark:text-gray-400">
                    {billingCycle === 'yearly'
                      ? `${plan.yearlyMonthlyEquivalent}/month — billed as $${plan.yearlyPrice.toLocaleString()}/year (2 months free)`
                      : `$${plan.monthlyPrice}/month`}
                  </p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  selectedPlan === plan.key ? 'border-blue-600 bg-blue-600' : 'border-gray-300 dark:border-gray-600'
                }`}>
                  {selectedPlan === plan.key && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
              </button>
            </div>
          ))}

          {/* Features Section (shown when a plan is selected) */}
          {selectedPlanData && (
            <>
              <div className="border-t border-black/[0.06] dark:border-gray-700" />
              <div className="p-6 md:px-8">
                <p className="text-[13px] font-semibold text-gray-700 mb-3 dark:text-gray-300">Features include:</p>
                <ul className="space-y-2.5">
                  {selectedPlanData.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-[13px] text-gray-600 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          <div className="border-t border-black/[0.06] dark:border-gray-700" />

          {/* Bottom Actions */}
          <div className="p-6 md:px-8 flex items-center gap-3">
            <button
              onClick={() => navigate(backPath)}
              className="flex-1 h-11 text-[14px] font-semibold text-gray-600 hover:text-gray-900 rounded-lg border border-black/[0.08] hover:border-black/[0.15] hover:bg-black/[0.02] transition-all duration-200 active:scale-[0.98] dark:text-gray-300 dark:hover:text-white dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              disabled={!selectedPlan}
              onClick={() => {
                if (isUpgradeMode && selectedPlan) {
                  navigate(`/upgrade-confirmation?plan=${selectedPlan}&billing=${billingCycle}`);
                }
              }}
              className={`flex-1 h-11 text-[14px] font-semibold rounded-lg transition-all duration-200 active:scale-[0.98] ${
                selectedPlan
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-600/50 text-white/70 cursor-not-allowed'
              }`}
            >
              {isUpgradeMode ? 'Upgrade Plan' : 'Change Plan'}
            </button>
          </div>
        </div>
        )}
      </div>
    </LoggedInLayout>
  );
};

export default ChangePlan;
