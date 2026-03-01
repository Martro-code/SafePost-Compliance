import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Info, AlertTriangle, Download } from 'lucide-react';
import LoggedInLayout from './src/components/LoggedInLayout';

const backupCodes = [
  'SAFE-1234-ABCD',
  'SAFE-5678-EFGH',
  'SAFE-9012-IJKL',
  'SAFE-3456-MNOP',
  'SAFE-7890-QRST',
  'SAFE-2345-UVWX',
  'SAFE-6789-YZAB',
  'SAFE-0123-CDEF',
];

const TwoFactorAuth: React.FC = () => {
  const navigate = useNavigate();

  const is2FAEnabled = sessionStorage.getItem('safepost_2fa') === 'true';

  const [step, setStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState('');
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);

  const handleVerify = () => {
    if (verificationCode.length === 6) {
      sessionStorage.setItem('safepost_2fa', 'true');
      setStep(4);
    }
  };

  const handleDisable = () => {
    sessionStorage.removeItem('safepost_2fa');
    navigate('/settings');
  };

  const handleCodeInput = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 6);
    setVerificationCode(digits);
  };

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
            {is2FAEnabled ? 'Two-Factor Authentication' : 'Set Up Two-Factor Authentication'}
          </h1>
          <p className="text-[14px] text-gray-500 mt-1 mb-8">
            {is2FAEnabled ? 'Manage your two-factor authentication settings' : 'Add an extra layer of security to your account'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-lg shadow-black/[0.04] dark:bg-gray-800 dark:border-gray-700">

          {/* ===== 2FA ENABLED — Management Screen ===== */}
          {is2FAEnabled && step === 1 && (
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-2.5 mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Two-Factor Authentication</h2>
                <span className="text-[11px] font-semibold text-green-700 bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full dark:bg-green-900/30 dark:border-green-800 dark:text-green-400">
                  Active
                </span>
              </div>

              <p className="text-[14px] text-gray-500 mb-6 leading-relaxed dark:text-gray-300">
                Your account is protected with two-factor authentication.
              </p>

              <button
                onClick={() => {}}
                className="w-full h-11 text-[14px] font-semibold text-gray-600 hover:text-gray-900 rounded-lg border border-black/[0.08] hover:border-black/[0.15] hover:bg-black/[0.02] transition-all duration-200 active:scale-[0.98] dark:text-gray-300 dark:hover:text-white dark:border-gray-600"
              >
                View Backup Codes
              </button>

              <div className="border-t border-black/[0.06] dark:border-gray-700 mt-6 pt-6" />

              {!showDisableConfirm ? (
                <div className="text-center">
                  <button
                    onClick={() => setShowDisableConfirm(true)}
                    className="text-[13px] text-red-500 hover:text-red-600 transition-colors"
                  >
                    Disable Two-Factor Authentication
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-[14px] text-gray-700 mb-4 dark:text-gray-300">
                    Are you sure you want to disable two-factor authentication? This will make your account less secure.
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowDisableConfirm(false)}
                      className="flex-1 h-11 text-[14px] font-semibold text-gray-600 hover:text-gray-900 rounded-lg border border-black/[0.08] hover:border-black/[0.15] hover:bg-black/[0.02] transition-all duration-200 active:scale-[0.98] dark:text-gray-300 dark:hover:text-white dark:border-gray-600"
                    >
                      Keep Enabled
                    </button>
                    <button
                      onClick={handleDisable}
                      className="flex-1 h-11 text-[14px] font-semibold text-red-600 hover:text-red-700 rounded-lg border border-red-200 hover:border-red-300 hover:bg-red-50 transition-all duration-200 active:scale-[0.98] dark:border-red-800 dark:hover:bg-red-900/20"
                    >
                      Disable 2FA
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
                onClick={() => setStep(2)}
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-semibold rounded-lg transition-all duration-200 active:scale-[0.98]"
              >
                Get Started
              </button>
            </div>
          )}

          {/* ===== SETUP STEP 2 — QR Code ===== */}
          {!is2FAEnabled && step === 2 && (
            <div className="p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-2 dark:text-white">Scan the QR Code</h2>
              <p className="text-[14px] text-gray-500 mb-6 dark:text-gray-300">
                Open your authenticator app, tap the + button, and scan the QR code below
              </p>

              {/* QR Code Placeholder */}
              <div className="flex justify-center mb-5">
                <div className="w-[180px] h-[180px] rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center dark:border-gray-600">
                  <p className="text-[13px] text-gray-400 text-center px-4 dark:text-gray-500">QR Code will appear here</p>
                </div>
              </div>

              {/* Manual Code */}
              <div className="text-center mb-6">
                <p className="text-[13px] text-gray-500 mb-2 dark:text-gray-400">Can't scan? Enter this code manually:</p>
                <span className="inline-block px-4 py-2 bg-gray-100 rounded-lg text-[14px] font-mono font-medium text-gray-700 tracking-wider dark:bg-gray-700 dark:text-gray-300">
                  SAFEPOST-XXXX-XXXX
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

          {/* ===== SETUP STEP 3 — Verification ===== */}
          {!is2FAEnabled && step === 3 && (
            <div className="p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-2 dark:text-white">Enter Verification Code</h2>
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
                disabled={verificationCode.length !== 6}
                className={`w-full h-11 text-[14px] font-semibold rounded-lg transition-all duration-200 active:scale-[0.98] ${
                  verificationCode.length === 6
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-600/50 text-white/70 cursor-not-allowed'
                }`}
              >
                Verify & Enable 2FA
              </button>

              <div className="text-center mt-4">
                <button
                  onClick={() => setStep(2)}
                  className="text-[13px] text-gray-400 hover:text-gray-600 transition-colors dark:text-gray-500 dark:hover:text-gray-300"
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {/* ===== SETUP STEP 4 — Success + Backup Codes ===== */}
          {step === 4 && (
            <div className="p-6 md:p-8">
              <div className="text-center mb-5">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h2 className="text-xl font-bold text-gray-900 mb-1 dark:text-white">Two-Factor Authentication Enabled</h2>
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
                onClick={() => {}}
                className="w-full h-11 text-[14px] font-semibold text-gray-600 hover:text-gray-900 rounded-lg border border-black/[0.08] hover:border-black/[0.15] hover:bg-black/[0.02] transition-all duration-200 active:scale-[0.98] mb-3 flex items-center justify-center gap-2 dark:text-gray-300 dark:hover:text-white dark:border-gray-600"
              >
                <Download className="w-4 h-4" />
                Download Backup Codes
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
