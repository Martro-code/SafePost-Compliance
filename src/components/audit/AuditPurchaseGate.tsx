import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { Check, LockIcon, Loader2 } from 'lucide-react';
import { useAccount } from '../../context/AccountContext';
import { supabase } from '../../services/supabaseClient';
import LoggedInLayout from '../layout/LoggedInLayout';

const FEATURES = [
  'Guided page-by-page assessment across 6 key website sections',
  'Checked against AHPRA advertising guidelines and TGA rules',
  'Severity-rated findings — High, Medium, and Low',
  'Recommended actions for each issue identified',
  'Downloadable audit report for your records',
];

const AuditPurchaseGate: React.FC = () => {
  const { auditPurchased, accountLoading, refreshAccount, plan } = useAccount();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isPurchaseReturn = searchParams.get('purchase') === 'success';

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(isPurchaseReturn);
  const [error, setError] = useState<string | null>(null);

  // When returning from a successful Stripe payment, refresh the account so
  // audit_purchased updates without a manual page reload.
  useEffect(() => {
    if (!isPurchaseReturn) return;
    (async () => {
      setRefreshing(true);
      await refreshAccount();
      setRefreshing(false);
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (accountLoading || refreshing) {
    return (
      <LoggedInLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          {refreshing && (
            <p className="text-[14px] text-gray-500">Confirming your purchase…</p>
          )}
        </div>
      </LoggedInLayout>
    );
  }

  // Already purchased — go straight to the audit
  if (auditPurchased) {
    return <Navigate to="/audit/start" replace />;
  }

  const hasActiveSubscription = plan !== 'starter';

  // ── No active subscription ─────────────────────────────────────────────────

  if (!hasActiveSubscription) {
    return (
      <LoggedInLayout>
        <div className="max-w-3xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full mb-5">
              <LockIcon className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-[12px] font-semibold text-blue-700 uppercase tracking-wider">
                Website Compliance Audit
              </span>
            </div>
            <h1 className="text-[32px] font-bold text-gray-900 leading-tight mb-4">
              Subscription Required
            </h1>
            <p className="text-[16px] text-gray-500 max-w-xl mx-auto leading-relaxed">
              The Website Compliance Audit is available exclusively to active SafePost subscribers. Please subscribe to a plan to unlock this feature.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-8 flex flex-col gap-4">
            <button
              onClick={() => navigate('/pricing/medical-practitioners')}
              className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white text-[15px] font-semibold rounded-xl transition-colors duration-200"
            >
              View Plans
            </button>
            <button
              onClick={() => navigate('/pricing/medical-practices')}
              className="w-full py-3.5 px-6 bg-white hover:bg-slate-50 text-gray-700 text-[15px] font-semibold rounded-xl border border-slate-200 hover:border-slate-300 transition-colors duration-200"
            >
              View Plans for Practices
            </button>
            <p className="text-center text-[12px] text-gray-400 mt-1">
              Already subscribed? Your access will activate automatically.
            </p>
          </div>
        </div>
      </LoggedInLayout>
    );
  }

  // ── Active subscriber, not yet purchased ───────────────────────────────────

  const handlePurchase = async () => {
    setError(null);
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setError('Please log in again to continue.');
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ productType: 'audit' }),
        }
      );

      const data = await response.json();
      if (!response.ok || !data.url) {
        setError(data.error || 'Failed to start checkout. Please try again.');
        return;
      }

      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoggedInLayout>
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full mb-5">
            <LockIcon className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-[12px] font-semibold text-blue-700 uppercase tracking-wider">
              Website Compliance Audit
            </span>
          </div>
          <h1 className="text-[32px] font-bold text-gray-900 leading-tight mb-4">
            Full Website Compliance Audit
          </h1>
          <p className="text-[16px] text-gray-500 max-w-xl mx-auto leading-relaxed">
            A comprehensive, page-by-page review of your practice website against AHPRA advertising guidelines and TGA therapeutic goods rules.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-[13px] font-semibold text-gray-400 uppercase tracking-wider mb-1">One-time payment</p>
              <div className="flex items-baseline gap-2">
                <span className="text-[42px] font-bold text-gray-900 leading-none">$149</span>
                <span className="text-[14px] text-gray-400">AUD</span>
              </div>
            </div>
            <div className="bg-blue-50 rounded-xl p-3">
              <LockIcon className="w-5 h-5 text-blue-600" />
            </div>
          </div>

          <div className="flex flex-col gap-3 mb-8">
            {FEATURES.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <Check className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="text-[14px] text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-[13px] text-red-700">{error}</p>
            </div>
          )}

          <button
            onClick={handlePurchase}
            disabled={loading}
            className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-[15px] font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Redirecting to checkout…
              </>
            ) : (
              'Purchase Audit — $149'
            )}
          </button>
          <p className="text-center text-[12px] text-gray-400 mt-3">
            Secure payment via Stripe. One-time charge, no subscription.
          </p>
        </div>

        {/* Trust note */}
        <p className="text-center text-[13px] text-gray-400">
          Your audit results are saved securely and accessible any time from your dashboard.
        </p>
      </div>
    </LoggedInLayout>
  );
};

export default AuditPurchaseGate;
