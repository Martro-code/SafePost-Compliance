import React, { useState, useMemo } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Check, Lock, CreditCard, Shield } from 'lucide-react';
import SafePostLogo from './components/SafePostLogo';

const planData: Record<string, {
  name: string;
  subtitle: string;
  monthlyPrice: number;
  yearlyPrice: number;
  yearlySavings: number;
  popular: boolean;
  features: string[];
}> = {
  professional: {
    name: 'SafePost Professional',
    subtitle: 'For practitioners who post regularly',
    monthlyPrice: 20,
    yearlyPrice: 192,
    yearlySavings: 48,
    popular: true,
    features: [
      'Unlimited compliance checks',
      'AI-powered rewrites',
      'Priority support (24hr)',
      'Image & video analysis',
      'Compliance history tracking',
      'Monthly compliance reports',
      'Early access to new features',
    ],
  },
  proplus: {
    name: 'SafePost Pro+',
    subtitle: 'For practices with small marketing teams',
    monthlyPrice: 49,
    yearlyPrice: 470,
    yearlySavings: 118,
    popular: false,
    features: [
      'Everything in Professional, plus:',
      'Multi-user access (up to 3 team members)',
      'Team collaboration tools',
      'Basic online advertising compliance',
      'Brand voice consistency checker',
      'Custom compliance guidelines repository',
    ],
  },
  ultra: {
    name: 'SafePost Ultra',
    subtitle: 'Best for multi-practitioner practices',
    monthlyPrice: 200,
    yearlyPrice: 1920,
    yearlySavings: 480,
    popular: true,
    features: [
      'Everything in Pro+, plus:',
      'Multi-user access (up to 15 team members)',
      'Advanced advertising compliance (TGA)',
      'Bulk content review',
      'White-label compliance reports',
      'Dedicated account manager',
      'Priority phone & email support (4hr)',
      'API access for workflow integration',
    ],
  },
};

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const plan = searchParams.get('plan') || 'professional';
  const billing = searchParams.get('billing') || 'monthly';

  // Route guard: redirect unverified users to signup with plan params
  const isVerified = sessionStorage.getItem('safepost_verified') === 'true';
  if (!isVerified) {
    const params = new URLSearchParams();
    params.set('plan', plan);
    params.set('billing', billing);
    navigate(`/signup?${params.toString()}`, { replace: true });
    return null;
  }

  const selectedPlan = planData[plan];

  // Redirect to pricing if invalid plan
  if (!selectedPlan) {
    navigate('/pricing/medical-practitioners');
    return null;
  }

  const price = billing === 'yearly' ? selectedPlan.yearlyPrice : selectedPlan.monthlyPrice;
  const monthlyEquivalent = billing === 'yearly' ? Math.round(selectedPlan.yearlyPrice / 12) : selectedPlan.monthlyPrice;

  // Calculate date 7 days from now
  const trialEndDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
  }, []);

  // Form state
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [country] = useState('Australia');
  const [postcode, setPostcode] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f7f7f4]">
        <header className="sticky top-0 z-50 bg-white border-b border-black/[0.06]">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link to="/">
              <SafePostLogo />
            </Link>
          </div>
        </header>
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">You're all set!</h2>
            <p className="text-[14px] text-gray-500 mb-1">Your 7-day free trial has started.</p>
            <p className="text-[13px] text-gray-400">Redirecting to your dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7f4]">
      {/* Simplified Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-black/[0.06]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/">
            <SafePostLogo />
          </Link>
          <button
            onClick={() => navigate('/pricing/medical-practitioners')}
            className="flex items-center gap-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Pricing
          </button>
        </div>
      </header>

      {/* Demo Notice */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-6xl mx-auto px-6 py-2.5 text-center">
          <p className="text-[12px] font-medium text-amber-700">Demo mode &mdash; payments not yet active</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-5xl mx-auto px-6 py-10 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-8 md:gap-12">

            {/* LEFT COLUMN - Payment Form */}
            <div className="space-y-8 order-2 md:order-1">
              {/* Heading */}
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 mb-2">
                  Complete your purchase
                </h1>
                <p className="text-[14px] text-gray-500">
                  7-day free trial &bull; Cancel anytime
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-2">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="youremail@example.com.au"
                  className="w-full px-4 py-3 text-[14px] text-gray-900 bg-white rounded-xl border border-gray-200 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
                <p className="text-[12px] text-gray-400 mt-1.5">{"We\u2019ll send your receipt and account details here"}</p>
              </div>

              {/* Payment Information */}
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-2">Payment information</label>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  {/* Card Number */}
                  <div className="relative border-b border-gray-200">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4242 4242 4242 4242"
                      className="w-full px-4 py-3 text-[14px] text-gray-900 bg-transparent outline-none placeholder:text-gray-400 pr-24"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                      <div className="w-8 h-5 rounded bg-[#1A1F71] flex items-center justify-center">
                        <span className="text-[8px] font-bold text-white italic">VISA</span>
                      </div>
                      <div className="w-8 h-5 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
                        <div className="flex">
                          <div className="w-3 h-3 rounded-full bg-red-500 opacity-80" />
                          <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-80 -ml-1.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Expiry + CVC row */}
                  <div className="flex">
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      placeholder="MM / YY"
                      className="flex-1 px-4 py-3 text-[14px] text-gray-900 bg-transparent outline-none placeholder:text-gray-400 border-r border-gray-200"
                    />
                    <input
                      type="text"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      placeholder="CVC"
                      className="flex-1 px-4 py-3 text-[14px] text-gray-900 bg-transparent outline-none placeholder:text-gray-400"
                    />
                  </div>
                </div>
                {/* Cardholder name */}
                <input
                  type="text"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  placeholder="Cardholder name"
                  className="w-full px-4 py-3 text-[14px] text-gray-900 bg-white rounded-xl border border-gray-200 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 mt-3"
                />
                <div className="flex items-center gap-1.5 mt-2">
                  <Lock className="w-3 h-3 text-gray-400" />
                  <span className="text-[11px] text-gray-400">Powered by Stripe &mdash; your payment information is secure and encrypted</span>
                </div>
              </div>

              {/* Billing Address */}
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-2">Billing address</label>
                <div className="space-y-3">
                  <div className="relative">
                    <select
                      value={country}
                      disabled
                      className="w-full px-4 py-3 text-[14px] text-gray-900 bg-white rounded-xl border border-gray-200 outline-none appearance-none cursor-not-allowed opacity-80"
                    >
                      <option value="Australia">Australia</option>
                    </select>
                    <ChevronIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  <input
                    type="text"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    placeholder="Postcode"
                    className="w-full px-4 py-3 text-[14px] text-gray-900 bg-white rounded-xl border border-gray-200 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* Terms */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-[13px] text-gray-600 leading-relaxed">
                    I agree to the{' '}
                    <a href="#" onClick={(e) => e.preventDefault()} className="text-blue-600 hover:text-blue-700 underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" onClick={(e) => e.preventDefault()} className="text-blue-600 hover:text-blue-700 underline">Privacy Policy</a>
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  onClick={handleSubmit}
                  disabled={!agreedToTerms}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-[15px] font-semibold rounded-xl shadow-lg shadow-blue-600/25 transition-all duration-200 active:scale-[0.98] hover:shadow-blue-600/30 flex items-center justify-center gap-2.5"
                >
                  <Lock className="w-4 h-4" />
                  Start 7-Day Free Trial
                </button>
                <p className="text-[12px] text-gray-400 text-center mt-2.5">
                  {"You won\u2019t be charged until " + trialEndDate}
                </p>
              </div>

              {/* Security Badges */}
              <div className="flex items-center justify-center gap-6 pt-2 pb-4">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-[11px] text-gray-400 font-medium">Secure checkout</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-[11px] text-gray-400 font-medium">Stripe</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-[11px] text-gray-400 font-medium">SSL Encrypted</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - Order Summary */}
            <div className="order-1 md:order-2">
              <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm p-6 md:p-8 md:sticky md:top-24">
                {/* Plan Info */}
                <div className="mb-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{selectedPlan.name}</h3>
                      <p className="text-[13px] text-gray-500 mt-0.5">{selectedPlan.subtitle}</p>
                    </div>
                    {selectedPlan.popular && (
                      <span className="text-[10px] font-semibold text-white bg-blue-600 px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                        MOST POPULAR
                      </span>
                    )}
                  </div>
                </div>

                {/* Pricing */}
                <div className="mb-6 pb-6 border-b border-black/[0.06]">
                  {billing === 'yearly' ? (
                    <div>
                      <div className="flex items-end gap-2">
                        <span className="text-3xl font-extrabold text-gray-900">${selectedPlan.yearlyPrice}</span>
                        <span className="text-[14px] text-gray-500 font-medium pb-0.5">/year</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[13px] text-gray-500">(${monthlyEquivalent}/month)</span>
                        <span className="text-[11px] font-semibold text-green-700 bg-green-100 border border-green-200 px-2 py-0.5 rounded-full">
                          Save ${selectedPlan.yearlySavings}
                        </span>
                      </div>
                      <p className="text-[12px] text-gray-400 mt-1">Billed annually</p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-end gap-2">
                        <span className="text-3xl font-extrabold text-gray-900">${selectedPlan.monthlyPrice}</span>
                        <span className="text-[14px] text-gray-500 font-medium pb-0.5">/month</span>
                      </div>
                      <p className="text-[12px] text-gray-400 mt-1">Billed monthly</p>
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="mb-6 pb-6 border-b border-black/[0.06]">
                  <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">{"What\u2019s included"}</h4>
                  <ul className="space-y-2.5">
                    {selectedPlan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span className="text-[13px] text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Total */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[14px] font-semibold text-gray-900">Total</span>
                    <span className="text-xl font-extrabold text-gray-900">${price}.00 <span className="text-[13px] font-medium text-gray-500">AUD</span></span>
                  </div>
                  <p className="text-[12px] text-gray-400">Includes 7-day free trial</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

// Small chevron icon for the country dropdown
const ChevronIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

export default Checkout;
