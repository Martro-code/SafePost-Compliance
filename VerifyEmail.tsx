import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import SafePostLogo from './components/SafePostLogo';
import { supabase } from './src/services/supabaseClient';

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [resent, setResent] = useState(false);

  const email = searchParams.get('email') || '';
  const plan = searchParams.get('plan') || '';
  const billing = searchParams.get('billing') || '';

  // Starter/free plan users skip checkout and go straight to the dashboard.
  // Paid plans (professional, pro_plus, ultra) proceed to checkout as normal.
  const PAID_PLANS = ['professional', 'pro_plus', 'ultra'];
  const isPaidPlan = PAID_PLANS.includes(plan.toLowerCase());

  const handleVerified = () => {
    sessionStorage.setItem('safepost_verified', 'true');
    if (isPaidPlan) {
      navigate(`/checkout?plan=${plan}&billing=${billing || 'monthly'}`);
    } else {
      // Free / Starter / unknown plan → dashboard (no checkout needed)
      navigate('/dashboard');
    }
  };

  const handleResend = async () => {
    if (!email) return;
    await supabase.auth.resend({ type: 'signup', email });
    setResent(true);
    setTimeout(() => setResent(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7f4]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-black/[0.06]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/">
            <SafePostLogo />
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-grow flex items-center justify-center px-6 py-16 md:py-24">
        <div className="w-full max-w-[450px]">
          <div className="bg-white rounded-2xl border border-black/[0.06] shadow-lg shadow-black/[0.04] p-8 md:p-10 text-center">
            {/* Email Icon */}
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-50 flex items-center justify-center">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>

            {/* Heading */}
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 mb-3">
              Check your email
            </h1>

            {/* Message */}
            <p className="text-[14px] text-gray-500 leading-relaxed mb-8">
              {"We\u2019ve sent a verification link to"}
              {email && (
                <span className="font-semibold text-gray-900"> {email}</span>
              )}
              {". Once you\u2019ve verified your account, check your inbox for a welcome email from us with everything you need to get started."}
            </p>

            {/* Verify Button */}
            <button
              onClick={handleVerified}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white text-[15px] font-semibold rounded-lg shadow-sm shadow-blue-600/25 transition-all duration-200 active:scale-[0.98] hover:shadow-blue-600/30"
            >
              {"I\u2019ve verified my email"}
            </button>

            {/* Resend */}
            <div className="mt-5">
              {resent ? (
                <p className="text-[13px] text-green-600 font-medium">Verification email resent!</p>
              ) : (
                <p className="text-[13px] text-gray-500">
                  {"Didn\u2019t receive the email? "}
                  <button
                    onClick={handleResend}
                    className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2"
                  >
                    Resend email
                  </button>
                </p>
              )}
            </div>

            {/* Back to sign in */}
            <div className="mt-6 pt-6 border-t border-black/[0.06]">
              <button
                onClick={() => navigate('/login')}
                className="flex items-center justify-center gap-2 text-[13px] text-gray-500 hover:text-gray-900 font-medium transition-colors mx-auto"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to sign in
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VerifyEmail;
