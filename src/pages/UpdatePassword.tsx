import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import LoggedInLayout from '../components/layout/LoggedInLayout';
import { supabase } from '../services/supabaseClient';
import { useAuth, isPasswordRecovery } from '../hooks/useAuth';

const UpdatePassword: React.FC = () => {
  const navigate = useNavigate();
  const { userEmail } = useAuth();
  const recoveryMode = isPasswordRecovery;

  // Form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordMismatch = confirmNewPassword.length > 0 && newPassword !== confirmNewPassword;

  const handleUpdatePassword = async () => {
    if (passwordMismatch || !newPassword || (!recoveryMode && !currentPassword)) return;
    setError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      // In normal mode, verify the current password first
      if (!recoveryMode) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: userEmail,
          password: currentPassword,
        });

        if (signInError) {
          setError('Current password is incorrect');
          setIsSubmitting(false);
          return;
        }
      }

      // Proceed with password update
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) {
        setError(updateError.message);
        setIsSubmitting(false);
        return;
      }

      if (recoveryMode) {
        // Sign out so the user logs in with their new password
        await supabase.auth.signOut();
        navigate('/login', { state: { passwordReset: true } });
      } else {
        navigate('/profile');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  const content = (
      <div className={recoveryMode ? "min-h-screen flex items-center justify-center bg-[#f7f7f4] px-6 py-16" : "max-w-2xl mx-auto px-6 pt-6 pb-10 md:pt-8 md:pb-16"}>
        {!recoveryMode && (
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors mb-8 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Profile
        </button>
        )}

        <div className={recoveryMode ? "w-full max-w-[450px]" : ""}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {recoveryMode ? 'Set new password' : 'Update password'}
          </h1>
          <p className="text-[14px] text-gray-500 mt-1 mb-8">
            Choose a strong password for your account
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-lg shadow-black/[0.04] dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 md:p-8 space-y-4">
            {/* Current password — hidden in recovery mode */}
            {!recoveryMode && (
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5 dark:text-gray-300">Current password</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  className="w-full h-12 px-4 text-[14px] text-gray-900 bg-white rounded-lg border border-gray-200 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 pr-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showCurrentPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>
            )}

            {/* New password */}
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5 dark:text-gray-300">New password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password (min. 8 characters)"
                  className="w-full h-12 px-4 text-[14px] text-gray-900 bg-white rounded-lg border border-gray-200 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 pr-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showNewPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {/* Confirm new password */}
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5 dark:text-gray-300">Confirm new password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  className={`w-full h-12 px-4 text-[14px] text-gray-900 bg-white rounded-lg border outline-none transition-all duration-200 placeholder:text-gray-400 pr-12 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 ${
                    passwordMismatch
                      ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                      : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                  }`}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
              {passwordMismatch && (
                <p className="text-[12px] text-red-500 mt-1.5">Passwords do not match</p>
              )}
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                <p className="text-[13px] text-red-700">{error}</p>
              </div>
            )}

            {successMessage && (
              <div className="rounded-lg bg-green-50 border border-green-200 p-3">
                <p className="text-[13px] text-green-700">{successMessage}</p>
              </div>
            )}
          </div>

          <div className="border-t border-black/[0.06] dark:border-gray-700" />

          <div className="flex items-center gap-3 p-6 md:px-8">
            <button
              onClick={() => navigate(recoveryMode ? '/login' : '/profile')}
              className="flex-1 h-11 text-[14px] font-semibold text-gray-600 hover:text-gray-900 rounded-lg border border-black/[0.08] hover:border-black/[0.15] hover:bg-black/[0.02] transition-all duration-200 active:scale-[0.98] dark:text-gray-300 dark:hover:text-white dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdatePassword}
              disabled={passwordMismatch || !newPassword || (!recoveryMode && !currentPassword) || isSubmitting}
              className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-[14px] font-semibold rounded-lg transition-all duration-200 active:scale-[0.98]"
            >
              {isSubmitting ? 'Updating...' : (recoveryMode ? 'Set new password' : 'Update password')}
            </button>
          </div>
        </div>
        </div>
      </div>
  );

  if (recoveryMode) {
    return content;
  }

  return <LoggedInLayout>{content}</LoggedInLayout>;
};

export default UpdatePassword;
