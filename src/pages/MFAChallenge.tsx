import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, AlertTriangle, Loader2, LogOut } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

const MFAChallenge: React.FC = () => {
  const navigate = useNavigate();

  const [factorId, setFactorId] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [loading, setLoading] = useState(true);

  // On mount, get the verified TOTP factor
  useEffect(() => {
    (async () => {
      const { data, error: listErr } = await supabase.auth.mfa.listFactors();
      if (listErr || !data) {
        setError('Failed to load MFA factors. Please sign in again.');
        setLoading(false);
        return;
      }
      const verified = data.totp.find((f) => f.status === 'verified');
      if (!verified) {
        // No verified factor — shouldn't be here, redirect to dashboard
        navigate('/dashboard', { replace: true });
        return;
      }
      setFactorId(verified.id);
      setLoading(false);
    })();
  }, [navigate]);

  const handleCodeInput = (value: string) => {
    setCode(value.replace(/\D/g, '').slice(0, 6));
  };

  const handleVerify = async () => {
    if (code.length !== 6 || !factorId) return;

    setError(null);
    setVerifying(true);

    const { error: verifyErr } = await supabase.auth.mfa.challengeAndVerify({
      factorId,
      code,
    });

    if (verifyErr) {
      setVerifying(false);
      setError('Invalid code. Please check your authenticator app and try again.');
      return;
    }

    setVerifying(false);
    navigate('/dashboard', { replace: true });
  };

  const handleSignOut = async () => {
    localStorage.removeItem('safepost_remember_me');
    sessionStorage.clear();
    await supabase.auth.signOut();
    navigate('/login', { replace: true });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && code.length === 6 && !verifying) {
      handleVerify();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f7f4]">
        <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f7f4] px-6">
      <div className="w-full max-w-[420px]">
        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-lg shadow-black/[0.04] p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-7 h-7 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Two-factor authentication
            </h1>
            <p className="text-[14px] text-gray-500">
              Enter the 6-digit code from your authenticator app to continue
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 flex items-center gap-2 p-3.5 bg-red-50 border border-red-200 rounded-xl text-[13px] text-red-700">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Code input */}
          <div className="flex justify-center mb-6">
            <input
              type="text"
              inputMode="numeric"
              autoFocus
              value={code}
              onChange={(e) => handleCodeInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="000000"
              maxLength={6}
              className="w-48 px-6 py-4 text-center text-2xl font-mono font-bold tracking-[0.3em] text-gray-900 bg-white rounded-xl border border-gray-200 outline-none transition-all duration-200 placeholder:text-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Verify button */}
          <button
            onClick={handleVerify}
            disabled={code.length !== 6 || verifying}
            className={`w-full h-12 text-[15px] font-semibold rounded-lg transition-all duration-200 active:scale-[0.98] ${
              code.length === 6 && !verifying
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/25'
                : 'bg-blue-600/50 text-white/70 cursor-not-allowed'
            }`}
          >
            {verifying ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Verifying…
              </span>
            ) : (
              'Verify'
            )}
          </button>

          {/* Sign out link */}
          <div className="text-center mt-6">
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 text-[13px] text-gray-400 hover:text-gray-600 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MFAChallenge;
