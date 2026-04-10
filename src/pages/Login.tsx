import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import PublicHeader from '../components/layout/PublicHeader';
import { supabase } from '../services/supabaseClient';
import PublicFooter from '../components/layout/PublicFooter';
import { trackLogin } from '../services/analytics';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const auditRedirect = searchParams.get('redirect'); // 'audit-standard' | 'audit-extended'

  // If user arrives from email verification (URL contains access_token or type=signup),
  // skip the login page and redirect directly to the dashboard.
  useEffect(() => {
    const hash = window.location.hash;
    const search = window.location.search;
    if (hash.includes('access_token') || search.includes('type=signup')) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          navigate('/dashboard', { replace: true });
        }
      });
    }
  }, [navigate]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  // Lockout countdown timer
  useEffect(() => {
    if (!lockoutUntil) {
      setLockoutRemaining(0);
      return;
    }

    const tick = () => {
      const remaining = Math.ceil((lockoutUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        setLockoutUntil(null);
        setLockoutRemaining(0);
        setFailedAttempts(0);
        setAuthError('');
      } else {
        setLockoutRemaining(remaining);
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [lockoutUntil]);

  const isLockedOut = lockoutUntil !== null && Date.now() < lockoutUntil;

  // Validation helpers
  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const getInputClasses = (value: string, isValid: boolean) => {
    const base = 'w-full h-12 px-4 text-[14px] text-gray-900 bg-white rounded-lg border outline-none transition-all duration-200 placeholder:text-gray-400';
    if (!submitted && value.length === 0) return `${base} border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20`;
    if (isValid) return `${base} border-green-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20`;
    return `${base} border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20`;
  };

  // Price ID mapping for pending checkout redirect
  const PRICE_IDS: Record<string, Record<string, string>> = {
    starter: {
      monthly: 'price_1TAHuHJAm9wjk5YfCqAF30bc',
      yearly: 'price_1TAI1AJAm9wjk5Yf5b68eoVw',
    },
    professional: {
      monthly: 'price_1T8VA7JAm9wjk5YfkbJ56VTX',
      yearly: 'price_1T8VA3JAm9wjk5YfSRSEyVoW',
    },
    pro_plus: {
      monthly: 'price_1T8VA4JAm9wjk5YfEAzY5e4q',
      yearly: 'price_1T8VA3JAm9wjk5YfsvpQvllA',
    },
    ultra: {
      monthly: 'price_1T8VA6JAm9wjk5YfK73bIGbJ',
      yearly: 'price_1T8VA7JAm9wjk5YfN6Ql6KfM',
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLockedOut) return;
    setSubmitted(true);
    setAuthError('');
    setIsSubmitting(true);

    const { data: signInData, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setIsSubmitting(false);
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      if (newAttempts >= 5) {
        const lockUntil = Date.now() + 300 * 1000; // 5 minutes
        setLockoutUntil(lockUntil);
        setAuthError('Too many failed attempts. Please wait 5 minutes before trying again.');
      } else {
        setAuthError('Invalid email or password');
      }
      return;
    }

    // Reset failed attempts on successful login
    setFailedAttempts(0);
    setLockoutUntil(null);

    trackLogin('email');

    // Persist session preference based on "Remember me" checkbox
    if (rememberMe) {
      localStorage.setItem('safepost_remember_me', 'true');
    } else {
      localStorage.removeItem('safepost_remember_me');
      sessionStorage.setItem('safepost_session_active', 'true');
    }

    // Check if MFA is required (user has enrolled TOTP but hasn't completed 2nd factor yet)
    const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aalData && aalData.nextLevel === 'aal2' && aalData.currentLevel === 'aal1') {
      setIsSubmitting(false);
      navigate('/mfa-challenge');
      return;
    }

    // If user arrived from an audit pricing CTA, initiate Stripe checkout now
    if ((auditRedirect === 'audit-standard' || auditRedirect === 'audit-extended') && signInData.session) {
      const productType = auditRedirect === 'audit-extended' ? 'audit_extended' : 'audit';
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
        const response = await fetch(`${supabaseUrl}/functions/v1/create-checkout-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${signInData.session.access_token}`,
          },
          body: JSON.stringify({ productType }),
        });
        if (response.ok) {
          const data = await response.json();
          if (data?.url) {
            window.location.href = data.url;
            return;
          }
        }
      } catch {
        // fall through to dashboard
      }
    }

    // Check for pending checkout from signup flow
    const pendingCheckoutRaw = localStorage.getItem('safepost_pending_checkout');
    if (pendingCheckoutRaw && signInData.user && signInData.session) {
      try {
        const { plan, billing } = JSON.parse(pendingCheckoutRaw);
        const priceId = PRICE_IDS[plan]?.[billing];
        if (priceId) {
          localStorage.removeItem('safepost_pending_checkout');
          const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
          const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
          const response = await fetch(`${supabaseUrl}/functions/v1/create-checkout-session`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${signInData.session.access_token}`,
              'apikey': supabaseAnonKey,
            },
            body: JSON.stringify({ priceId, userId: signInData.user.id }),
          });
          if (response.ok) {
            const data = await response.json();
            if (data?.url) {
              window.location.href = data.url;
              return;
            }
          }
        }
      } catch {
        // If checkout redirect fails, fall through to dashboard
        localStorage.removeItem('safepost_pending_checkout');
      }
    }

    setIsSubmitting(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7f4]">
      <PublicHeader />

      {/* Login Form */}
      <main className="flex-grow flex items-center justify-center px-6 pt-6 pb-10 md:pt-8 md:pb-16">
        <div className="w-full max-w-[450px]">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
          <div className="bg-white rounded-2xl border border-black/[0.06] shadow-lg shadow-black/[0.04] p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 mb-2">
                Welcome back
              </h1>
              <p className="text-[14px] text-gray-500">
                Sign in to your account to continue
              </p>
            </div>

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
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-[13px] font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={getInputClasses(password, password.length > 0)}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              {/* Stay signed in & Forgot password */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="rememberMe" className="text-[13px] text-gray-600 cursor-pointer">
                    Stay signed in
                  </label>
                </div>
                <a onClick={() => navigate('/forgot-password')} className="text-[12px] text-blue-600 hover:text-blue-700 font-medium cursor-pointer">
                  Forgot password?
                </a>
              </div>

              {/* Auth Error */}
              {authError && (
                <p className="text-[13px] text-red-600 font-medium">
                  {authError}
                  {isLockedOut && lockoutRemaining > 0 && (
                    <span className="block mt-1 text-gray-500">
                      Try again in {Math.floor(lockoutRemaining / 60)}:{String(lockoutRemaining % 60).padStart(2, '0')}
                    </span>
                  )}
                </p>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || isLockedOut}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-[15px] font-semibold rounded-lg shadow-sm shadow-blue-600/25 transition-all duration-200 active:scale-[0.98] hover:shadow-blue-600/30"
                >
                  {isLockedOut ? 'Temporarily locked' : isSubmitting ? 'Signing in...' : 'Continue with email'}
                </button>
              </div>
            </form>

            {/* OR Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-[13px] font-medium text-gray-400">OR</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Continue with Google */}
            <button
              type="button"
              onClick={async () => {
                await supabase.auth.signInWithOAuth({
                  provider: 'google',
                  options: {
                    redirectTo: 'https://www.safepost.com.au/auth/callback',
                  },
                });
              }}
              className="w-full h-12 flex items-center justify-center gap-3 bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-[15px] font-semibold text-gray-700 rounded-lg transition-all duration-200 active:scale-[0.98]"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
                <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            {/* Footer */}
            <p className="text-center text-[13px] text-gray-500 mt-6">
              Don't have an account?{' '}
              <a onClick={() => navigate('/signup')} className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2 cursor-pointer">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};

export default Login;
