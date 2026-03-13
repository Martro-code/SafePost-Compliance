import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Info, AlertTriangle, Download, Loader2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import LoggedInLayout from '../components/layout/LoggedInLayout';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../hooks/useAuth';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Generate a single backup code in XXXX-XXXX-XXXX format using crypto. */
function generateBackupCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const values = crypto.getRandomValues(new Uint8Array(12));
  const raw = Array.from(values, (v) => chars[v % chars.length]).join('');
  return `${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8, 12)}`;
}

/** SHA-256 hash a plaintext string, returned as hex. */
async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Trigger a .txt file download with the given content. */
function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const TwoFactorAuth: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // MFA factor state from Supabase
  const [verifiedFactorId, setVerifiedFactorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Enrollment state
  const [enrollFactorId, setEnrollFactorId] = useState<string | null>(null);
  const [totpSecret, setTotpSecret] = useState('');
  const [totpUri, setTotpUri] = useState('');

  // UI state
  const [step, setStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  // Backup codes (plaintext, shown only once)
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  // Disable flow
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);
  const [disableCode, setDisableCode] = useState('');
  const [disabling, setDisabling] = useState(false);

  // --------------------------------------------------
  // On mount: check if user already has a verified TOTP factor
  // --------------------------------------------------
  const checkFactors = useCallback(async () => {
    setLoading(true);
    const { data, error: listErr } = await supabase.auth.mfa.listFactors();
    if (listErr) {
      console.error('Failed to list MFA factors:', listErr);
      setLoading(false);
      return;
    }

    const verified = data.totp.find((f) => f.status === 'verified');
    if (verified) {
      setVerifiedFactorId(verified.id);
      setLoading(false);
      return;
    }

    // Silently clean up any unverified (pending) factors left from abandoned enrollments
    const unverifiedFactors = data.totp.filter((f) => f.status !== 'verified');
    for (const factor of unverifiedFactors) {
      await supabase.auth.mfa.unenroll({ factorId: factor.id });
    }

    setVerifiedFactorId(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    checkFactors();
  }, [checkFactors]);

  // --------------------------------------------------
  // Fix 1 — Enroll: call supabase.auth.mfa.enroll
  // --------------------------------------------------
  const handleGetStarted = async () => {
    setError(null);
    setEnrolling(true);

    // Clean up any stale unverified factors that may have appeared since mount
    const { data: factors, error: listErr } = await supabase.auth.mfa.listFactors();
    if (!listErr && factors) {
      const verified = factors.totp.find((f) => f.status === 'verified');
      if (verified) {
        setVerifiedFactorId(verified.id);
        setEnrolling(false);
        return;
      }
      for (const f of factors.totp.filter((f) => f.status !== 'verified')) {
        await supabase.auth.mfa.unenroll({ factorId: f.id });
      }
    }

    const { data, error: enrollErr } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
    });
    setEnrolling(false);

    if (enrollErr || !data) {
      setError(enrollErr?.message ?? 'Failed to start enrollment. Please try again.');
      return;
    }

    setEnrollFactorId(data.id);
    setTotpSecret(data.totp.secret);
    setTotpUri(data.totp.uri);
    setStep(2);
  };

  // --------------------------------------------------
  // Fix 2 — Verify: call challengeAndVerify
  // --------------------------------------------------
  const handleVerify = async () => {
    if (verificationCode.length !== 6 || !enrollFactorId) return;

    setError(null);
    setVerifying(true);

    const { error: verifyErr } = await supabase.auth.mfa.challengeAndVerify({
      factorId: enrollFactorId,
      code: verificationCode,
    });

    if (verifyErr) {
      setVerifying(false);
      setError(verifyErr.message ?? 'Invalid code. Please try again.');
      return;
    }

    // Fix 3 — Generate & store backup codes after successful verification
    await generateAndStoreBackupCodes();

    setVerifiedFactorId(enrollFactorId);
    setVerifying(false);
    setStep(4);
  };

  // --------------------------------------------------
  // Fix 3 — Generate 8 backup codes, hash & store them
  // --------------------------------------------------
  const generateAndStoreBackupCodes = async () => {
    if (!user) return;

    const codes = Array.from({ length: 8 }, () => generateBackupCode());
    const hashes = await Promise.all(codes.map((c) => sha256(c)));

    // Delete any existing codes for this user
    await supabase.from('mfa_backup_codes').delete().eq('user_id', user.id);

    // Insert new hashed codes
    const rows = hashes.map((h) => ({
      user_id: user.id,
      code_hash: h,
      used: false,
    }));
    await supabase.from('mfa_backup_codes').insert(rows);

    setBackupCodes(codes);
  };

  // --------------------------------------------------
  // Download backup codes as .txt
  // --------------------------------------------------
  const handleDownloadCodes = () => {
    const header = 'SafePost Compliance — MFA Backup Codes\n';
    const separator = '=========================================\n\n';
    const body = backupCodes.map((c, i) => `${i + 1}. ${c}`).join('\n');
    const footer = '\n\nEach code can only be used once.\nStore these codes in a safe place.';
    downloadTextFile('safepost-backup-codes.txt', header + separator + body + footer);
  };

  // --------------------------------------------------
  // Fix 5 — Disable 2FA (unenroll)
  // --------------------------------------------------
  const handleDisable = async () => {
    if (disableCode.length !== 6 || !verifiedFactorId) return;

    setError(null);
    setDisabling(true);

    // Challenge first to validate the code
    const { data: challenge, error: challengeErr } = await supabase.auth.mfa.challenge({
      factorId: verifiedFactorId,
    });

    if (challengeErr || !challenge) {
      setDisabling(false);
      setError(challengeErr?.message ?? 'Failed to create challenge. Please try again.');
      return;
    }

    const { error: verifyErr } = await supabase.auth.mfa.verify({
      factorId: verifiedFactorId,
      challengeId: challenge.id,
      code: disableCode,
    });

    if (verifyErr) {
      setDisabling(false);
      setError('Invalid code. Please enter a valid 6-digit code from your authenticator app.');
      return;
    }

    // Unenroll the factor
    const { error: unenrollErr } = await supabase.auth.mfa.unenroll({
      factorId: verifiedFactorId,
    });

    if (unenrollErr) {
      setDisabling(false);
      setError(unenrollErr.message ?? 'Failed to disable 2FA. Please try again.');
      return;
    }

    // Delete backup codes
    if (user) {
      await supabase.from('mfa_backup_codes').delete().eq('user_id', user.id);
    }

    setDisabling(false);
    navigate('/settings');
  };

  const handleCodeInput = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 6);
    setVerificationCode(digits);
  };

  const handleDisableCodeInput = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 6);
    setDisableCode(digits);
  };

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  if (loading) {
    return (
      <LoggedInLayout>
        <div className="max-w-2xl mx-auto px-6 pt-6 pb-10 md:pt-8 md:pb-16">
          {/* Back link skeleton — matches h-4 icon + text with mb-8 */}
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-8 dark:bg-gray-700" />

          {/* Heading skeleton — matches text-2xl (h-8) title + text-[14px] subtitle with mb-8 */}
          <div className="mb-8">
            <div className="h-8 w-80 bg-gray-200 rounded animate-pulse mb-1 dark:bg-gray-700" />
            <div className="h-4 w-64 bg-gray-100 rounded animate-pulse mt-1 mb-8 dark:bg-gray-700/60" />
          </div>

          {/* Card skeleton — matches intro card: paragraph + info box + divider + button */}
          <div className="bg-white rounded-2xl border border-black/[0.06] shadow-lg shadow-black/[0.04] p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
            {/* Paragraph lines — matches text-[14px] leading-relaxed mb-5 */}
            <div className="h-4 w-full bg-gray-100 rounded animate-pulse mb-2 dark:bg-gray-700/60" />
            <div className="h-4 w-11/12 bg-gray-100 rounded animate-pulse mb-5 dark:bg-gray-700/60" />

            {/* Info box — matches flex gap-3 p-4 bg-blue-50 rounded-xl with two lines of text */}
            <div className="p-4 bg-gray-50 rounded-xl dark:bg-gray-700/40">
              <div className="h-4 w-28 bg-gray-200 rounded animate-pulse mb-2 dark:bg-gray-600" />
              <div className="h-4 w-72 bg-gray-100 rounded animate-pulse dark:bg-gray-700/60" />
            </div>

            {/* Divider + button — matches mt-6 pt-6 border-t + h-11 button */}
            <div className="border-t border-black/[0.06] dark:border-gray-700 mt-6 pt-6">
              <div className="h-11 w-full bg-gray-200 rounded-lg animate-pulse dark:bg-gray-700" />
            </div>
          </div>
        </div>
      </LoggedInLayout>
    );
  }

  const is2FAEnabled = !!verifiedFactorId;

  return (
    <LoggedInLayout>
      <div className="max-w-2xl mx-auto px-6 pt-6 pb-10 md:pt-8 md:pb-16">
        {/* Back to Settings */}
        <button
          onClick={() => navigate('/settings')}
          className="flex items-center gap-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors mb-8 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Settings
        </button>

        {/* Page Heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {is2FAEnabled ? 'Two-factor authentication' : 'Set up two-factor authentication'}
          </h1>
          <p className="text-[14px] text-gray-500 mt-1 mb-8">
            {is2FAEnabled ? 'Manage your two-factor authentication settings' : 'Add an extra layer of security to your account'}
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-4 flex items-center gap-2 p-3.5 bg-red-50 border border-red-200 rounded-xl text-[13px] text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Card */}
        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-lg shadow-black/[0.04] dark:bg-gray-800 dark:border-gray-700">

          {/* ===== 2FA ENABLED — Management Screen (Fix 5) ===== */}
          {is2FAEnabled && step === 1 && (
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-2.5 mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Two-factor authentication</h2>
                <span className="text-[11px] font-semibold text-green-700 bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full dark:bg-green-900/30 dark:border-green-800 dark:text-green-400">
                  Active
                </span>
              </div>

              <p className="text-[14px] text-gray-500 mb-6 leading-relaxed dark:text-gray-300">
                Your account is protected with two-factor authentication.
              </p>

              <div className="border-t border-black/[0.06] dark:border-gray-700 mt-6 pt-6" />

              {!showDisableConfirm ? (
                <div className="text-center">
                  <button
                    onClick={() => setShowDisableConfirm(true)}
                    className="text-[13px] text-red-500 hover:text-red-600 transition-colors"
                  >
                    Disable two-factor authentication
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-[14px] text-gray-700 mb-4 dark:text-gray-300">
                    Enter a 6-digit code from your authenticator app to confirm disabling 2FA.
                  </p>

                  <div className="flex justify-center mb-4">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={disableCode}
                      onChange={(e) => handleDisableCodeInput(e.target.value)}
                      placeholder="000000"
                      maxLength={6}
                      className="w-48 px-6 py-4 text-center text-2xl font-mono font-bold tracking-[0.3em] text-gray-900 bg-white rounded-xl border border-gray-200 outline-none transition-all duration-200 placeholder:text-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-600"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => { setShowDisableConfirm(false); setDisableCode(''); setError(null); }}
                      className="flex-1 h-11 text-[14px] font-semibold text-gray-600 hover:text-gray-900 rounded-lg border border-black/[0.08] hover:border-black/[0.15] hover:bg-black/[0.02] transition-all duration-200 active:scale-[0.98] dark:text-gray-300 dark:hover:text-white dark:border-gray-600"
                    >
                      Keep enabled
                    </button>
                    <button
                      onClick={handleDisable}
                      disabled={disableCode.length !== 6 || disabling}
                      className={`flex-1 h-11 text-[14px] font-semibold rounded-lg border transition-all duration-200 active:scale-[0.98] ${
                        disableCode.length === 6 && !disabling
                          ? 'text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20'
                          : 'text-red-400 border-red-100 cursor-not-allowed dark:border-red-900 dark:text-red-600'
                      }`}
                    >
                      {disabling ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Disabling…
                        </span>
                      ) : (
                        'Disable 2FA'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===== SETUP STEP 1 — Introduction ===== */}
          {!is2FAEnabled && step === 1 && (
            <div className="p-6 md:p-8">
              <p className="text-[14px] text-gray-600 leading-relaxed mb-5 dark:text-gray-300">
                Two-factor authentication adds an extra layer of security by requiring a verification code from your authenticator app each time you sign in.
              </p>

              <div className="flex gap-3 p-4 bg-blue-50 rounded-xl dark:bg-blue-900/20">
                <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[13px] font-medium text-blue-700 mb-1 dark:text-blue-300">What you'll need</p>
                  <p className="text-[13px] text-blue-600 dark:text-blue-400">
                    Google Authenticator or Microsoft Authenticator app installed on your mobile device
                  </p>
                </div>
              </div>

              <div className="border-t border-black/[0.06] dark:border-gray-700 mt-6 pt-6" />

              <button
                onClick={handleGetStarted}
                disabled={enrolling}
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-semibold rounded-lg transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {enrolling ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Setting up…
                  </span>
                ) : (
                  'Get started'
                )}
              </button>
            </div>
          )}

          {/* ===== SETUP STEP 2 — QR Code (Fix 1) ===== */}
          {!is2FAEnabled && step === 2 && (
            <div className="p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-2 dark:text-white">Scan the QR code</h2>
              <p className="text-[14px] text-gray-500 mb-6 dark:text-gray-300">
                Open your authenticator app, tap the + button, and scan the QR code below
              </p>

              {/* Real QR Code */}
              <div className="flex justify-center mb-5">
                <div className="p-4 bg-white rounded-xl border border-gray-200 dark:border-gray-600">
                  <QRCodeSVG value={totpUri} size={180} />
                </div>
              </div>

              {/* Real Manual Secret */}
              <div className="text-center mb-6">
                <p className="text-[13px] text-gray-500 mb-2 dark:text-gray-400">Can't scan? Enter this code manually:</p>
                <span className="inline-block px-4 py-2 bg-gray-100 rounded-lg text-[14px] font-mono font-medium text-gray-700 tracking-wider dark:bg-gray-700 dark:text-gray-300 select-all">
                  {totpSecret}
                </span>
              </div>

              <div className="border-t border-black/[0.06] dark:border-gray-700 mt-2 pt-6" />

              <button
                onClick={() => setStep(3)}
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-semibold rounded-lg transition-all duration-200 active:scale-[0.98]"
              >
                Next
              </button>
            </div>
          )}

          {/* ===== SETUP STEP 3 — Verification (Fix 2) ===== */}
          {!is2FAEnabled && step === 3 && (
            <div className="p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-2 dark:text-white">Enter verification code</h2>
              <p className="text-[14px] text-gray-500 mb-6 dark:text-gray-300">
                Enter the 6-digit code from your authenticator app
              </p>

              <div className="flex justify-center mb-6">
                <input
                  type="text"
                  inputMode="numeric"
                  value={verificationCode}
                  onChange={(e) => handleCodeInput(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                  className="w-48 px-6 py-4 text-center text-2xl font-mono font-bold tracking-[0.3em] text-gray-900 bg-white rounded-xl border border-gray-200 outline-none transition-all duration-200 placeholder:text-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-600"
                />
              </div>

              <div className="border-t border-black/[0.06] dark:border-gray-700 mb-6" />

              <button
                onClick={handleVerify}
                disabled={verificationCode.length !== 6 || verifying}
                className={`w-full h-11 text-[14px] font-semibold rounded-lg transition-all duration-200 active:scale-[0.98] ${
                  verificationCode.length === 6 && !verifying
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-600/50 text-white/70 cursor-not-allowed'
                }`}
              >
                {verifying ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying…
                  </span>
                ) : (
                  'Verify & enable 2FA'
                )}
              </button>

              <div className="text-center mt-4">
                <button
                  onClick={() => { setStep(2); setError(null); }}
                  className="text-[13px] text-gray-400 hover:text-gray-600 transition-colors dark:text-gray-500 dark:hover:text-gray-300"
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {/* ===== SETUP STEP 4 — Success + Backup Codes (Fix 3) ===== */}
          {step === 4 && (
            <div className="p-6 md:p-8">
              <div className="text-center mb-5">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h2 className="text-xl font-bold text-gray-900 mb-1 dark:text-white">Two-factor authentication enabled</h2>
                <p className="text-[14px] text-gray-500 dark:text-gray-300">Save your backup codes in a safe place</p>
              </div>

              {/* Backup Codes */}
              <div className="border border-black/[0.06] rounded-xl p-5 mb-4 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-2.5">
                  {backupCodes.map((code) => (
                    <p key={code} className="text-[13px] font-mono text-gray-700 text-center py-1.5 dark:text-gray-300">
                      {code}
                    </p>
                  ))}
                </div>
              </div>

              {/* Warning */}
              <div className="flex gap-3 p-4 bg-amber-50 rounded-xl mb-6 dark:bg-amber-900/20">
                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-[13px] text-amber-700 leading-relaxed dark:text-amber-300">
                  These codes can only be used once. Store them somewhere safe — you'll need them if you lose access to your authenticator app.
                </p>
              </div>

              <button
                onClick={handleDownloadCodes}
                className="w-full h-11 text-[14px] font-semibold text-gray-600 hover:text-gray-900 rounded-lg border border-black/[0.08] hover:border-black/[0.15] hover:bg-black/[0.02] transition-all duration-200 active:scale-[0.98] mb-3 flex items-center justify-center gap-2 dark:text-gray-300 dark:hover:text-white dark:border-gray-600"
              >
                <Download className="w-4 h-4" />
                Download backup codes
              </button>

              <button
                onClick={() => navigate('/settings')}
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-semibold rounded-lg transition-all duration-200 active:scale-[0.98]"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </LoggedInLayout>
  );
};

export default TwoFactorAuth;
