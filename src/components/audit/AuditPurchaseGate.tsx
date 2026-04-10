import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { Check, CheckCircle, LockIcon, ArrowLeft, Loader2, ArrowRight } from 'lucide-react';
import { useAccount } from '../../context/AccountContext';
import { supabase } from '../../services/supabaseClient';
import LoggedInLayout from '../layout/LoggedInLayout';

const STANDARD_FEATURES = [
  'Guided page-by-page assessment across 6 key website sections',
  'Checked against AHPRA advertising guidelines and TGA rules',
  'Severity-rated findings — High, Medium, and Low',
  'Recommended actions for each issue identified',
  'Downloadable audit report for your records',
];

const EXTENDED_FEATURES = [
  'Guided page-by-page assessment across up to 12 website sections',
  'Everything included in the Standard Audit',
  'Ideal for larger practice websites',
  'Checked against AHPRA advertising guidelines and TGA rules',
  'Severity-rated findings — High, Medium, and Low',
  'Recommended actions for each issue identified',
  'Downloadable audit report for your records',
];

const STEPS = [
  'Set up your audit — enter your page names and URLs',
  'We analyse each page — AI checks against AHPRA and TGA rules',
  'Download your report — get a full findings report with recommendations',
];

const AuditPurchaseGate: React.FC = () => {
  const { auditPurchased, extendedAuditPurchased, auditOnly, accountLoading, refreshAccount, plan } = useAccount();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isPurchaseReturn = searchParams.get('purchase') === 'success';
  const purchaseType = searchParams.get('type'); // 'standalone' | 'extended' | null

  const [loading, setLoading] = useState(false);
  const [extLoading, setExtLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(isPurchaseReturn);
  const [error, setError] = useState<string | null>(null);

  // When returning from a successful Stripe payment, refresh the account so
  // purchased flags update without a manual page reload.
  useEffect(() => {
    if (!isPurchaseReturn) return;
    (async () => {
      setRefreshing(true);
      await refreshAccount();
      setRefreshing(false);
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (accountLoading || refreshing) {
    return null;
  }

  // ── Extended audit success screen ──────────────────────────────────────────
  if (isPurchaseReturn && purchaseType === 'extended') {
    return (
      <div className="min-h-screen bg-[#f7f7f4] flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-lg">
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <div className="text-center mb-10">
            <h1 className="text-[28px] font-bold text-gray-900 leading-tight mb-3">
              Extended Audit Unlocked
            </h1>
            <p className="text-[16px] text-gray-500 leading-relaxed">
              You can now audit up to 12 pages of your practice website. Start a new audit or continue an existing one.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-6">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-5">
              What's included:
            </p>
            <div className="flex flex-col gap-3">
              {EXTENDED_FEATURES.map((f, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span className="text-[14px] text-gray-700">{f}</span>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => navigate('/audit/start')}
            className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white text-[15px] font-semibold rounded-xl transition-colors duration-200"
          >
            Start your audit
          </button>
          <p className="text-center text-[12px] text-gray-400 mt-3">
            Your audit results are saved automatically and accessible any time from your dashboard.
          </p>
        </div>
      </div>
    );
  }

  // ── Standalone success screen ───────────────────────────────────────────────
  // Shown after account creation (via /signup?audit=pending) or after Stripe payment
  if (isPurchaseReturn && purchaseType === 'standalone') {
    // If not yet purchased (just created account, haven't paid yet), show purchase CTA
    if (!auditPurchased) {
      return (
        <div className="min-h-screen bg-[#f7f7f4] flex items-center justify-center px-6 py-16">
          <div className="w-full max-w-lg">
            <div className="flex justify-center mb-6">
              <CheckCircle className="w-16 h-16 text-blue-500" />
            </div>
            <div className="text-center mb-10">
              <h1 className="text-[28px] font-bold text-gray-900 leading-tight mb-3">
                Account created — now purchase your audit
              </h1>
              <p className="text-[16px] text-gray-500 leading-relaxed">
                Your SafePost account is ready. Complete your Website Compliance Audit purchase below to get started.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-6">
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
              <div className="flex flex-col gap-3 mb-6">
                {STANDARD_FEATURES.map((f, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className="text-[14px] text-gray-700">{f}</span>
                  </div>
                ))}
              </div>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-[13px] text-red-700">{error}</p>
                </div>
              )}
              <button
                onClick={async () => {
                  setError(null);
                  setLoading(true);
                  try {
                    const { data: { session } } = await supabase.auth.getSession();
                    if (!session?.access_token) { setError('Please log in to continue.'); return; }
                    const response = await fetch(
                      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`,
                      {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
                        body: JSON.stringify({ productType: 'audit_standalone' }),
                      }
                    );
                    const data = await response.json();
                    if (!response.ok || !data.url) { setError(data.error || 'Failed to start checkout. Please try again.'); return; }
                    window.location.href = data.url;
                  } catch (err: any) {
                    setError(err.message || 'An unexpected error occurred.');
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-[15px] font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Redirecting to checkout…</> : 'Purchase Audit — $149'}
              </button>
              <p className="text-center text-[12px] text-gray-400 mt-3">
                Secure payment via Stripe. One-time charge, no subscription.
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Purchased — show success screen
    return (
      <div className="min-h-screen bg-[#f7f7f4] flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-lg">
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <div className="text-center mb-10">
            <h1 className="text-[28px] font-bold text-gray-900 leading-tight mb-3">
              Payment confirmed — you're ready to audit
            </h1>
            <p className="text-[16px] text-gray-500 leading-relaxed">
              Your Website Compliance Audit has been unlocked. Enter the URLs of up to 6 pages from your practice website and we'll check each one against AHPRA and TGA compliance rules.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-6">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-5">
              What happens next:
            </p>
            <div className="flex flex-col gap-4">
              {STEPS.map((step, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[11px] font-bold text-blue-600">{idx + 1}</span>
                  </div>
                  <span className="text-[14px] text-gray-700 leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => navigate('/audit/start')}
            className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white text-[15px] font-semibold rounded-xl transition-colors duration-200"
          >
            Start your audit
          </button>
          <p className="text-center text-[12px] text-gray-400 mt-3">
            Your audit results are saved automatically and accessible any time from your dashboard.
          </p>
        </div>
      </div>
    );
  }

  // ── Standard post-purchase confirmation screen ─────────────────────────────
  if (isPurchaseReturn) {
    return (
      <div className="min-h-screen bg-[#f7f7f4] flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-lg">
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <div className="text-center mb-10">
            <h1 className="text-[28px] font-bold text-gray-900 leading-tight mb-3">
              Payment confirmed — you're ready to audit
            </h1>
            <p className="text-[16px] text-gray-500 leading-relaxed">
              Your Website Compliance Audit has been unlocked. Enter the URLs of up to 6 pages from your practice website and we'll check each one against AHPRA and TGA compliance rules.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-6">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-5">
              What happens next:
            </p>
            <div className="flex flex-col gap-4">
              {STEPS.map((step, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[11px] font-bold text-blue-600">{idx + 1}</span>
                  </div>
                  <span className="text-[14px] text-gray-700 leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => navigate('/audit/start')}
            className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white text-[15px] font-semibold rounded-xl transition-colors duration-200"
          >
            Start your audit
          </button>
          <p className="text-center text-[12px] text-gray-400 mt-3">
            Your audit results are saved automatically and accessible any time from your dashboard.
          </p>
        </div>
      </div>
    );
  }

  // Already have extended audit — go straight to the audit
  if (auditPurchased) {
    return <Navigate to="/audit/start" replace />;
  }

  const hasActiveSubscription = plan && plan !== 'starter';

  // ── No active subscription ─────────────────────────────────────────────────
  if (!hasActiveSubscription && !auditOnly) {
    return (
      <LoggedInLayout>
        <div className="max-w-3xl mx-auto px-6 py-16">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full mb-5">
              <LockIcon className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-[12px] font-semibold text-blue-700 uppercase tracking-wider">
                Website Compliance Audit
              </span>
            </div>
            <h1 className="text-[32px] font-bold text-gray-900 leading-tight mb-4">
              Audit Your Practice Website
            </h1>
            <p className="text-[16px] text-gray-500 max-w-xl mx-auto leading-relaxed">
              Check your practice website page by page against AHPRA and TGA rules. No subscription required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Standard */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Standard</p>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-[36px] font-bold text-gray-900 leading-none">$149</span>
                <span className="text-[13px] text-gray-400">AUD</span>
              </div>
              <div className="flex flex-col gap-2.5 mb-6 flex-grow">
                {STANDARD_FEATURES.map((f, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <Check className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className="text-[13px] text-gray-700">{f}</span>
                  </div>
                ))}
              </div>
              {error && (
                <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-[13px] text-red-700">{error}</p>
                </div>
              )}
              <button
                onClick={async () => {
                  setError(null);
                  setLoading(true);
                  try {
                    const { data: { session } } = await supabase.auth.getSession();
                    if (!session?.access_token) { navigate('/signup?audit=pending'); return; }
                    const response = await fetch(
                      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`,
                      {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
                        body: JSON.stringify({ productType: 'audit_standalone' }),
                      }
                    );
                    const data = await response.json();
                    if (!response.ok || !data.url) { setError(data.error || 'Failed to start checkout. Please try again.'); return; }
                    window.location.href = data.url;
                  } catch (err: any) {
                    setError(err.message || 'An unexpected error occurred.');
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-[14px] font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Redirecting…</> : 'Buy Standard Audit'}
              </button>
            </div>

            {/* Extended */}
            <div className="relative bg-white rounded-2xl border-2 border-blue-200 p-6 flex flex-col shadow-lg shadow-blue-600/[0.06]">
              <div className="absolute -top-3 right-5">
                <span className="text-[11px] font-semibold text-white bg-blue-600 px-3 py-1 rounded-full shadow-sm">
                  Best value
                </span>
              </div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Extended</p>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-[36px] font-bold text-gray-900 leading-none">$249</span>
                <span className="text-[13px] text-gray-400">AUD</span>
              </div>
              <div className="flex flex-col gap-2.5 mb-6 flex-grow">
                {EXTENDED_FEATURES.map((f, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <Check className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className="text-[13px] text-gray-700">{f}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={async () => {
                  setError(null);
                  setExtLoading(true);
                  try {
                    const { data: { session } } = await supabase.auth.getSession();
                    if (!session?.access_token) { navigate('/signup?audit=pending'); return; }
                    const response = await fetch(
                      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`,
                      {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
                        body: JSON.stringify({ productType: 'audit_extended' }),
                      }
                    );
                    const data = await response.json();
                    if (!response.ok || !data.url) { setError(data.error || 'Failed to start checkout. Please try again.'); return; }
                    window.location.href = data.url;
                  } catch (err: any) {
                    setError(err.message || 'An unexpected error occurred.');
                  } finally {
                    setExtLoading(false);
                  }
                }}
                disabled={extLoading}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-[14px] font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {extLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Redirecting…</> : 'Buy Extended Audit'}
              </button>
            </div>
          </div>

        </div>
      </LoggedInLayout>
    );
  }

  // ── Active subscriber or audit-only user, not yet purchased ───────────────

  const handlePurchase = async (type: 'audit' | 'audit_extended') => {
    setError(null);
    if (type === 'audit') setLoading(true); else setExtLoading(true);
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
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
          body: JSON.stringify({ productType: type }),
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
      if (type === 'audit') setLoading(false); else setExtLoading(false);
    }
  };

  return (
    <LoggedInLayout>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

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
            Check your practice website page by page against AHPRA and TGA rules. No subscription required.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-[13px] text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Standard */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7 flex flex-col">
            <div className="mb-5">
              <p className="text-[13px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Standard</p>
              <div className="flex items-baseline gap-2">
                <span className="text-[38px] font-bold text-gray-900 leading-none">$149</span>
                <span className="text-[13px] text-gray-400">AUD</span>
              </div>
            </div>
            <div className="flex flex-col gap-2.5 mb-7 flex-grow">
              {STANDARD_FEATURES.map((f, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <Check className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span className="text-[13px] text-gray-700">{f}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => handlePurchase('audit')}
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-[14px] font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Redirecting…</> : 'Purchase Standard — $149'}
            </button>
          </div>

          {/* Extended */}
          <div className="relative bg-white rounded-2xl border-2 border-blue-200 p-7 flex flex-col shadow-lg shadow-blue-600/[0.06]">
            <div className="absolute -top-3 right-5">
              <span className="text-[11px] font-semibold text-white bg-blue-600 px-3 py-1 rounded-full shadow-sm">
                Best value
              </span>
            </div>
            <div className="mb-5">
              <p className="text-[13px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Extended</p>
              <div className="flex items-baseline gap-2">
                <span className="text-[38px] font-bold text-gray-900 leading-none">$249</span>
                <span className="text-[13px] text-gray-400">AUD</span>
              </div>
            </div>
            <div className="flex flex-col gap-2.5 mb-7 flex-grow">
              {EXTENDED_FEATURES.map((f, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <Check className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span className="text-[13px] text-gray-700">{f}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => handlePurchase('audit_extended')}
              disabled={extLoading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-[14px] font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {extLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Redirecting…</> : 'Purchase Extended — $249'}
            </button>
          </div>
        </div>

        <p className="text-center text-[13px] text-gray-400">
          Secure payment via Stripe. One-time charge, no subscription.
        </p>
      </div>
    </LoggedInLayout>
  );
};

export default AuditPurchaseGate;
