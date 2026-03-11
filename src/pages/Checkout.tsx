import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import SafePostLogo from '../components/ui/SafePostLogo';
import { supabase } from '../services/supabaseClient';

const priceIds: Record<string, { monthly: string; yearly: string }> = {
  professional: {
    monthly: 'price_1T8UTeR1RAuGYaVLg6CI48VN',
    yearly: 'price_1T8UUPR1RAuGYaVL8SdWS9ut',
  },
  pro_plus: {
    monthly: 'price_1T8UWKR1RAuGYaVL2RUXVEAr',
    yearly: 'price_1T8UXuR1RAuGYaVLPGTPgSqA',
  },
  ultra: {
    monthly: 'price_1T8UZUR1RAuGYaVLkkbcBvJL',
    yearly: 'price_1T8UaCR1RAuGYaVL3M5ob7TV',
  },
};

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  const plan = searchParams.get('plan') || '';
  const billing = (searchParams.get('billing') || 'monthly') as 'monthly' | 'yearly';

  useEffect(() => {
    const redirectToStripe = async () => {
      const prices = priceIds[plan.toLowerCase()];
      if (!prices) {
        setError('Invalid plan selected.');
        return;
      }

      const priceId = prices[billing] || prices.monthly;

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate(`/signup?plan=${plan}&billing=${billing}`, { replace: true });
          return;
        }

        const { data, error: fnError } = await supabase.functions.invoke('create-checkout-session', {
          body: { priceId, userId: user.id },
        });

        if (fnError) throw fnError;

        if (data?.url) {
          window.location.href = data.url;
        } else {
          setError('Unable to create checkout session. Please try again.');
        }
      } catch (err) {
        console.error('Checkout error:', err);
        setError('Something went wrong. Please try again.');
      }
    };

    redirectToStripe();
  }, [plan, billing, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7f4]">
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

      <main className="flex-grow flex items-center justify-center">
        {error ? (
          <div className="text-center max-w-md px-6">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{error}</h2>
            <p className="text-[14px] text-gray-500 mb-6">
              Please go back to pricing and try again.
            </p>
            <button
              onClick={() => navigate('/pricing/medical-practitioners')}
              className="px-6 py-3 text-[14px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
            >
              Back to Pricing
            </button>
          </div>
        ) : (
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-1">Redirecting to checkout...</h2>
            <p className="text-[14px] text-gray-500">You'll be taken to our secure payment page.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Checkout;
