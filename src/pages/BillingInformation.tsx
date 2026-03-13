import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CreditCard, Mail, CalendarDays, Receipt, CheckCircle, XCircle } from 'lucide-react';
import LoggedInLayout from '../components/layout/LoggedInLayout';
import { useAuth } from '../hooks/useAuth';
import { getDisplayPlanName, getPlanTierLabel } from '../utils/planUtils';
import { supabase } from '../services/supabaseClient';

const planPricing: Record<string, { monthlyPrice: number; yearlyPrice: number }> = {
  professional: { monthlyPrice: 20, yearlyPrice: 200 },
  pro_plus: { monthlyPrice: 49, yearlyPrice: 490 },
  ultra: { monthlyPrice: 149, yearlyPrice: 1490 },
};

const BillingInformation: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { userEmail, signOut } = useAuth();

  const [billingMessage, setBillingMessage] = useState<{ type: 'success' | 'cancelled'; text: string } | null>(null);
  const [cardDetails, setCardDetails] = useState<{ brand: string; last4: string; exp_month: number; exp_year: number } | null>(null);
  const [cardLoading, setCardLoading] = useState(true);

  // Fetch payment method details from Stripe
  useEffect(() => {
    const fetchCard = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-payment-method');
        if (!error && data?.card) {
          setCardDetails(data.card);
        }
      } catch (err) {
        console.error('Failed to fetch payment method:', err);
      } finally {
        setCardLoading(false);
      }
    };
    fetchCard();
  }, []);

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setBillingMessage({
        type: 'success',
        text: 'Your subscription has been activated. Welcome to SafePost!',
      });
      setSearchParams({}, { replace: true });
    } else if (searchParams.get('cancelled') === 'true') {
      setBillingMessage({
        type: 'cancelled',
        text: 'Your payment was cancelled. Your plan has not changed.',
      });
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Read plan info from sessionStorage
  const planName = sessionStorage.getItem('safepost_plan') || '';
  const billingPeriod = sessionStorage.getItem('safepost_billing') || '';

  const formatBillingPeriod = (period: string) => {
    return period.charAt(0).toUpperCase() + period.slice(1).toLowerCase();
  };

  // Calculate next payment amount and date
  const { nextPaymentAmount, nextPaymentDate } = useMemo(() => {
    const pricing = planPricing[planName.toLowerCase()];
    let amount = 0;
    if (pricing) {
      amount = billingPeriod.toLowerCase() === 'yearly' ? pricing.yearlyPrice : pricing.monthlyPrice;
    }

    const date = new Date();
    if (billingPeriod.toLowerCase() === 'yearly') {
      date.setFullYear(date.getFullYear() + 1);
    } else {
      date.setMonth(date.getMonth() + 1);
    }
    const formatted = date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });

    return { nextPaymentAmount: amount, nextPaymentDate: formatted };
  }, [planName, billingPeriod]);

  // Billing email state — pre-populate from Supabase session
  const [billingEmail, setBillingEmail] = useState(userEmail);

  return (
    <LoggedInLayout>
      <div className="max-w-2xl mx-auto px-6 pt-6 pb-10 md:pt-8 md:pb-16">
        {/* Back to Dashboard */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors mb-8 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {/* Billing Status Message */}
        {billingMessage && (
          <div
            className={`mb-6 flex items-start gap-3 rounded-xl border p-4 ${
              billingMessage.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}
          >
            {billingMessage.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="text-[14px] font-medium">{billingMessage.text}</p>
            </div>
            <button
              onClick={() => setBillingMessage(null)}
              className="text-[13px] font-medium opacity-60 hover:opacity-100 transition-opacity"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Page Heading */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Billing</h1>
        <p className="text-[14px] text-gray-500 mt-1 mb-8">
          Manage your subscription, billing details, and payment history.
        </p>

        {/* Section 1: Current plan */}
        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm p-6 mb-6">
          <h2 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Current plan
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800 mb-3">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-[13px] font-semibold text-blue-700 dark:text-blue-300">
                  {getDisplayPlanName(planName)}
                </span>
                <span className="text-[12px] text-blue-400 dark:text-blue-500">
                  &middot; {billingPeriod ? formatBillingPeriod(billingPeriod) : 'Monthly'}
                </span>
              </div>
              <p className="text-[13px] text-gray-500">
                {planName.toLowerCase() === 'ultra'
                  ? 'Unlimited compliance checks per month'
                  : planName.toLowerCase() === 'pro_plus'
                  ? '100 compliance checks per month'
                  : planName.toLowerCase() === 'professional'
                  ? '30 compliance checks per month'
                  : '3 compliance checks'
                }
              </p>
            </div>
            <button
              onClick={() => navigate('/change-plan?mode=upgrade', { state: { from: 'billing' } })}
              className="px-4 py-2 text-[13px] font-semibold text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-300 rounded-xl transition-colors bg-blue-50 hover:bg-blue-100"
            >
              Change plan
            </button>
          </div>
        </div>

        {/* Section 2: Billing Details */}
        {/* Payment method */}
        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center dark:bg-blue-950">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider dark:text-gray-500">Payment method</h3>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              {cardLoading ? (
                <p className="text-[14px] text-gray-400 dark:text-gray-500">Loading payment method…</p>
              ) : cardDetails ? (
                <>
                  <p className="text-[14px] font-medium text-gray-900 dark:text-white">
                    {cardDetails.brand.charAt(0).toUpperCase() + cardDetails.brand.slice(1)} ending in {cardDetails.last4}
                  </p>
                  <p className="text-[13px] text-gray-500 mt-0.5 dark:text-gray-400">
                    Expires {String(cardDetails.exp_month).padStart(2, '0')}/{cardDetails.exp_year}
                  </p>
                </>
              ) : (
                <p className="text-[14px] text-gray-500 dark:text-gray-400">No payment method on file</p>
              )}
            </div>
            <button onClick={() => navigate('/update-card')} className="text-[13px] font-medium text-blue-600 hover:text-blue-700 transition-colors dark:text-blue-400 dark:hover:text-blue-300">
              Edit
            </button>
          </div>
        </div>

        {/* Billing email */}
        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center dark:bg-blue-950">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider dark:text-gray-500">Billing email</h3>
              </div>
            </div>
            <button onClick={() => navigate('/update-billing-email')} className="text-[13px] font-medium text-blue-600 hover:text-blue-700 transition-colors dark:text-blue-400 dark:hover:text-blue-300">
              Edit
            </button>
          </div>
          <input
            type="email"
            value={billingEmail}
            onChange={(e) => setBillingEmail(e.target.value)}
            placeholder="youremail@example.com.au"
            className="w-full px-4 py-3 text-[14px] text-gray-900 bg-white rounded-xl border border-gray-200 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
          />
          <p className="text-[12px] text-gray-400 mt-1.5 dark:text-gray-500">Receipts and invoices will be sent to this address.</p>
        </div>

        {/* Section 3: Next payment */}
        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center dark:bg-blue-950">
              <CalendarDays className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider dark:text-gray-500">Next payment</h3>
              <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full dark:bg-amber-950 dark:border-amber-800 dark:text-amber-400">
                Upcoming
              </span>
            </div>
          </div>
          {planName ? (
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-medium text-gray-900 dark:text-white">
                    {getDisplayPlanName(planName)}{billingPeriod ? ` — ${formatBillingPeriod(billingPeriod)}` : ''}
                  </p>
                  <p className="text-[13px] text-gray-500 mt-0.5 dark:text-gray-400">{nextPaymentDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-extrabold text-gray-900 dark:text-white">
                    ${nextPaymentAmount}.00 <span className="text-[12px] font-medium text-gray-500">AUD</span>
                  </p>
                  <p className="text-[12px] text-gray-400">Incl. GST</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-[14px] text-gray-500 dark:text-gray-300">No active plan</p>
          )}
        </div>

        {/* Section 4: Invoice history */}
        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm p-6 mb-6">
          <h2 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Invoice history
          </h2>
          <div className="text-center py-8">
            <Receipt className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <p className="text-[14px] font-medium text-gray-500">No invoices yet</p>
            <p className="text-[13px] text-gray-400 mt-1">
              Your invoices will appear here once your first payment is processed.
            </p>
          </div>
        </div>

        {/* Section 5: Danger zone — Cancel subscription */}
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
          <h2 className="text-[11px] font-semibold text-red-400 uppercase tracking-wider mb-4">
            Danger zone
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] font-semibold text-gray-900">Cancel subscription</p>
              <p className="text-[13px] text-gray-500 mt-0.5">
                Your access will continue until the end of your current billing period.
              </p>
            </div>
            <button
              onClick={() => navigate('/cancel-subscription', { state: { from: 'billing' } })}
              className="px-4 py-2 text-[13px] font-semibold text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 rounded-xl transition-colors hover:bg-red-50 flex-shrink-0 ml-4"
            >
              Cancel plan
            </button>
          </div>
        </div>
      </div>
    </LoggedInLayout>
  );
};

export default BillingInformation;
