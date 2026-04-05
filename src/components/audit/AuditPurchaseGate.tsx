import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Check, Lock, Loader2 } from 'lucide-react';
import { useAccount } from '../../context/AccountContext';
import { supabase } from '../../services/supabaseClient';
import LoggedInLayout from '../layout/LoggedInLayout';

const FEATURES = [
  'Guided page-by-page assessment across 6 key website sections',
  'Checked against 172 verified AHPRA and TGA rules',
  'Severity-rated findings for every page',
  'Recommended actions for each issue identified',
  'Consolidated PDF audit report for your records',
];

const AuditPurchaseGate: React.FC = () => {
  const { auditPurchased, accountLoading } = useAccount();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (accountLoading) {
    return (
      <LoggedInLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      </LoggedInLayout>
    );
  }

  if (auditPurchased) {
    return <Navigate to="/audit/start" replace />;
  }

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
            <Lock className="w-3.5 h-3.5 text-blue-600" />
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
              <Lock className="w-5 h-5 text-blue-600" />
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
