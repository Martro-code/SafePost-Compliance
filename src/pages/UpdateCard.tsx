import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import LoggedInLayout from '../components/layout/LoggedInLayout';
import { supabase } from '../services/supabaseClient';

let stripePromise: Promise<Stripe | null> | null = null;
function getStripe() {
  if (!stripePromise) {
    const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      console.error('Stripe publishable key is not configured');
      return null;
    }
    stripePromise = loadStripe(key);
  }
  return stripePromise;
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '14px',
      color: '#111827',
      fontFamily: 'inherit',
      '::placeholder': { color: '#9ca3af' },
    },
    invalid: { color: '#dc2626' },
  },
};

const UpdateCardForm: React.FC = () => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [setAsDefault, setSetAsDefault] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!stripe || !elements) return;

    const cardElement = elements.getElement('card');
    if (!cardElement) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // Create a SetupIntent via the Supabase edge function
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setError('Not authenticated. Please sign in.');
        setSaving(false);
        return;
      }

      const setupResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-setup-intent`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({ setAsDefault }),
        },
      );

      if (!setupResponse.ok) {
        const errBody = await setupResponse.json().catch(() => ({}));
        throw new Error(errBody.error || 'Failed to create setup intent.');
      }

      const { clientSecret } = await setupResponse.json();

      // Confirm the card setup with Stripe
      const { error: stripeError } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (stripeError) {
        setError(stripeError.message ?? 'Failed to update card. Please try again.');
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update card. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 pt-6 pb-10 md:pt-8 md:pb-16">
      {/* Back to Billing */}
      <button
        onClick={() => navigate('/billing')}
        className="flex items-center gap-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors mb-8 dark:text-gray-400 dark:hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Billing
      </button>

      {/* Page Heading */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Update your card
        </h1>
        <p className="text-[14px] text-gray-500 mt-1 mb-8">
          Your new card will replace your current card
        </p>
      </div>

      {/* Update card Form */}
      <div className="bg-white rounded-2xl border border-black/[0.06] shadow-lg shadow-black/[0.04] dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 md:p-8 space-y-5">
          {/* Stripe CardElement */}
          <div>
            <label className="block text-[13px] font-semibold text-gray-700 mb-2 dark:text-gray-300">Card details</label>
            <div className="px-4 py-3 bg-white rounded-xl border border-gray-200 transition-all duration-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 dark:bg-gray-700 dark:border-gray-600">
              <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>
          </div>

          {/* Default payment method checkbox */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={setAsDefault}
                onChange={(e) => setSetAsDefault(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-[13px] text-gray-600 dark:text-gray-300">Set as default payment method</span>
            </label>
          </div>

          {error && (
            <p className="text-[13px] text-red-600 dark:text-red-400">{error}</p>
          )}
          {success && (
            <p className="text-[13px] text-green-600 dark:text-green-400">Card updated successfully.</p>
          )}
        </div>

        <div className="border-t border-black/[0.06] dark:border-gray-700" />

        {/* Buttons */}
        <div className="flex items-center gap-3 p-6 md:px-8">
          <button
            onClick={() => navigate('/billing')}
            className="flex-1 h-11 text-[14px] font-semibold text-gray-600 hover:text-gray-900 rounded-lg border border-black/[0.08] hover:border-black/[0.15] hover:bg-black/[0.02] transition-all duration-200 active:scale-[0.98] dark:text-gray-300 dark:hover:text-white dark:border-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || !stripe}
            className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-[14px] font-semibold rounded-lg transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</> : 'Update card'}
          </button>
        </div>
      </div>
    </div>
  );
};

const UpdateCard: React.FC = () => {
  return (
    <LoggedInLayout>
      <Elements stripe={getStripe()}>
        <UpdateCardForm />
      </Elements>
    </LoggedInLayout>
  );
};

export default UpdateCard;
