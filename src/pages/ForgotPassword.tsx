import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicHeader from '../components/layout/PublicHeader';
import PublicFooter from '../components/layout/PublicFooter';
import { supabase } from '../services/supabaseClient';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Validation helpers
  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const getInputClasses = (value: string, isValid: boolean) => {
    const base = 'w-full h-12 px-4 text-[14px] text-gray-900 bg-white rounded-lg border outline-none transition-all duration-200 placeholder:text-gray-400';
    if (!submitted && value.length === 0) return `${base} border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20`;
    if (isValid) return `${base} border-green-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20`;
    return `${base} border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setError('');

    if (!isValidEmail(email)) return;

    setLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://safepost.com.au/update-password',
      });

      if (resetError) {
        setError(resetError.message);
      } else {
        setSuccess(true);
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7f4]">
      <PublicHeader />

      {/* Forgot password Form */}
      <main className="flex-grow flex items-center justify-center px-6 py-16 md:py-24">
        <div className="w-full max-w-[450px]">
          <div className="bg-white rounded-2xl border border-black/[0.06] shadow-lg shadow-black/[0.04] p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 mb-2">
                Reset password
              </h1>
              <p className="text-[14px] text-gray-500">
                Enter your email address and we'll send you a link to reset your password
              </p>
            </div>

            {success ? (
              <>
                <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                  <p className="text-[14px] text-green-800 font-medium mb-1">Check your email</p>
                  <p className="text-[13px] text-green-700">
                    We've sent a password reset link to <span className="font-medium">{email}</span>. Click the link in the email to reset your password.
                  </p>
                </div>
                <p className="text-center text-[13px] text-gray-500 mt-6">
                  Back to{' '}
                  <a onClick={() => navigate('/login')} className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2 cursor-pointer">
                    Sign in
                  </a>
                </p>
              </>
            ) : (
              <>
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-[13px] font-medium text-gray-700 mb-1.5">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={getInputClasses(email, isValidEmail(email))}
                      disabled={loading}
                    />
                  </div>

                  {error && (
                    <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                      <p className="text-[13px] text-red-700">{error}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white text-[15px] font-semibold rounded-lg shadow-sm shadow-blue-600/25 transition-all duration-200 active:scale-[0.98] hover:shadow-blue-600/30 flex items-center justify-center gap-2"
                    >
                      {loading && (
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      )}
                      {loading ? 'Sending...' : 'Send reset link'}
                    </button>
                  </div>
                </form>

                {/* Footer */}
                <p className="text-center text-[13px] text-gray-500 mt-6">
                  Back to{' '}
                  <a onClick={() => navigate('/login')} className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2 cursor-pointer">
                    Sign in
                  </a>
                </p>
              </>
            )}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};

export default ForgotPassword;
