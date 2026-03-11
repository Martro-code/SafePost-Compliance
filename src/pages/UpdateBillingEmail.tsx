import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import LoggedInLayout from '../components/layout/LoggedInLayout';
import { supabase } from '../services/supabaseClient';

const UpdateBillingEmail: React.FC = () => {
  const navigate = useNavigate();

  // Pre-populate from sessionStorage
  const [billingEmail, setBillingEmail] = useState(
    sessionStorage.getItem('safepost_signup_email') || ''
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    if (!billingEmail.trim()) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        email: billingEmail.trim(),
      });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      sessionStorage.setItem('safepost_signup_email', billingEmail.trim());
      setSuccess(true);
    } catch (err) {
      setError('Failed to update billing email. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <LoggedInLayout>
      <div className="max-w-2xl mx-auto px-6 pt-6 pb-10 md:pt-8 md:pb-16">
        {/* Back to Billing */}
        <button
          onClick={() => navigate('/billing')}
          className="flex items-center gap-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors mb-8 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Billing
        </button>

        {/* Page Heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Update billing email
          </h1>
          <p className="text-[14px] text-gray-500 mt-1 mb-8">
            Your receipts and invoices will be sent to this address
          </p>
        </div>

        {/* Update Billing email Form */}
        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-lg shadow-black/[0.04] dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 md:p-8 space-y-5">
            {/* Billing email */}
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-2 dark:text-gray-300">Billing email</label>
              <input
                type="email"
                value={billingEmail}
                onChange={(e) => { setBillingEmail(e.target.value); setSuccess(false); setError(null); }}
                placeholder="Enter your billing email address"
                className="w-full px-4 py-3 text-[14px] text-gray-900 bg-white rounded-xl border border-gray-200 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
              <p className="text-[12px] text-gray-400 mt-1.5 dark:text-gray-500">Receipts and invoices will be sent to this address.</p>
            </div>

            {error && (
              <p className="text-[13px] text-red-600 dark:text-red-400">{error}</p>
            )}
            {success && (
              <p className="text-[13px] text-green-600 dark:text-green-400">
                Billing email updated. If you changed your email address, please check your inbox to confirm.
              </p>
            )}
          </div>

          <div className="border-t border-black/[0.06] dark:border-gray-700" />

          {/* Buttons */}
          <div className="flex items-center gap-3 p-6 md:px-8">
            <button
              onClick={() => navigate('/billing')}
              className="flex-1 h-11 text-[14px] font-semibold text-gray-600 hover:text-gray-900 rounded-lg border border-black/[0.08] hover:border-black/[0.15] hover:bg-black/[0.02] transition-all duration-200 active:scale-[0.98] dark:text-gray-300 dark:hover:text-white dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !billingEmail.trim()}
              className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-[14px] font-semibold rounded-lg transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Save changes'}
            </button>
          </div>
        </div>
      </div>
    </LoggedInLayout>
  );
};

export default UpdateBillingEmail;
