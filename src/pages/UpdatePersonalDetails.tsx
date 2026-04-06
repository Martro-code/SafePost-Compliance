import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import LoggedInLayout from '../components/layout/LoggedInLayout';
import { useAuth } from '../hooks/useAuth';
import { useAccount } from '../context/AccountContext';
import { supabase } from '../services/supabaseClient';
import { sanitizeInput } from '../utils/sanitizeInput';

const UpdatePersonalDetails: React.FC = () => {
  const navigate = useNavigate();
  const { firstName: currentFirstName, surname: currentSurname } = useAuth();
  const { accountId, abn: currentAbn, abnEntityName: currentAbnEntityName, refreshAccount } = useAccount();

  // Form state
  const [firstNameField, setFirstNameField] = useState(currentFirstName);
  const [lastNameField, setLastNameField] = useState(currentSurname);
  const [abnField, setAbnField] = useState(currentAbn);
  const [abnVerified, setAbnVerified] = useState(!!currentAbn);
  const [abnEntityName, setAbnEntityName] = useState(currentAbnEntityName);
  const [abnStatus, setAbnStatus] = useState('');
  const [abnLoading, setAbnLoading] = useState(false);
  const [abnError, setAbnError] = useState('');
  const [saving, setSaving] = useState(false);
  const abnControllerRef = useRef<AbortController | null>(null);

  const isValidAbnFormat = (val: string) => /^\d{11}$/.test(val.replace(/\s/g, ''));

  const verifyAbn = useCallback(async (abnValue: string) => {
    const cleaned = abnValue.replace(/\s/g, '');
    if (!isValidAbnFormat(abnValue)) {
      setAbnVerified(false);
      setAbnEntityName('');
      setAbnStatus('');
      if (cleaned.length > 0) {
        setAbnError('ABN must be exactly 11 digits.');
      }
      return;
    }

    // Cancel any in-flight request
    if (abnControllerRef.current) abnControllerRef.current.abort();
    const controller = new AbortController();
    abnControllerRef.current = controller;

    setAbnLoading(true);
    setAbnError('');
    setAbnVerified(false);
    setAbnEntityName('');
    setAbnStatus('');

    try {
      const { data, error } = await supabase.functions.invoke('verify-abn', {
        body: { abn: cleaned },
      });

      if (controller.signal.aborted) return;

      if (error || !data?.valid) {
        setAbnError(data?.error || 'This ABN could not be verified. Please check and try again.');
        setAbnVerified(false);
      } else {
        setAbnVerified(true);
        setAbnEntityName(data.entityName || '');
        setAbnStatus(data.status || '');
        setAbnError('');
      }
    } catch {
      if (!controller.signal.aborted) {
        setAbnError('This ABN could not be verified. Please check and try again.');
        setAbnVerified(false);
      }
    } finally {
      if (!controller.signal.aborted) setAbnLoading(false);
    }
  }, []);

  const handleSave = async () => {
    // If ABN field has content, it must be verified before saving
    const cleanedAbn = abnField.replace(/\s/g, '');
    if (cleanedAbn.length > 0 && !abnVerified) return;

    setSaving(true);
    try {
      // Update user metadata (first/last name)
      await supabase.auth.updateUser({
        data: {
          first_name: sanitizeInput(firstNameField.trim()),
          surname: sanitizeInput(lastNameField.trim()),
        },
      });

      // Update ABN in accounts table
      if (accountId) {
        await supabase
          .from('accounts')
          .update({
            abn: cleanedAbn ? sanitizeInput(cleanedAbn) : null,
            abn_entity_name: abnEntityName ? sanitizeInput(abnEntityName) : null,
          })
          .eq('id', accountId);
      }

      await refreshAccount();
      navigate('/profile');
    } finally {
      setSaving(false);
    }
  };

  const abnInputClasses = (() => {
    const base = 'w-full h-12 px-4 text-[14px] text-gray-900 bg-white rounded-lg border outline-none transition-all duration-200 placeholder:text-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400';
    const cleaned = abnField.replace(/\s/g, '');
    if (cleaned.length === 0) return `${base} border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20`;
    if (abnVerified) return `${base} border-green-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20`;
    if (abnError) return `${base} border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20`;
    return `${base} border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20`;
  })();

  return (
    <LoggedInLayout>
      <div className="max-w-2xl mx-auto px-6 pt-6 pb-10 md:pt-8 md:pb-16">
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors mb-8 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Profile
        </button>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Personal details
          </h1>
          <p className="text-[14px] text-gray-500 mt-1 mb-8">
            Update your personal information
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-lg shadow-black/[0.04] dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 md:p-8 space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5 dark:text-gray-300">First name</label>
              <input
                type="text"
                value={firstNameField}
                onChange={(e) => setFirstNameField(e.target.value)}
                placeholder="Enter your first name"
                className="w-full h-12 px-4 text-[14px] text-gray-900 bg-white rounded-lg border border-gray-200 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5 dark:text-gray-300">Last name</label>
              <input
                type="text"
                value={lastNameField}
                onChange={(e) => setLastNameField(e.target.value)}
                placeholder="Enter your last name"
                className="w-full h-12 px-4 text-[14px] text-gray-900 bg-white rounded-lg border border-gray-200 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            </div>

            {/* ABN */}
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5 dark:text-gray-300">ABN</label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter your 11-digit ABN"
                  value={abnField}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^\d\s]/g, '');
                    setAbnField(val);
                    if (abnVerified || abnError) {
                      setAbnVerified(false);
                      setAbnEntityName('');
                      setAbnStatus('');
                      setAbnError('');
                    }
                  }}
                  onBlur={() => {
                    if (abnField.replace(/\s/g, '').length > 0) {
                      verifyAbn(abnField);
                    }
                  }}
                  maxLength={14}
                  className={abnInputClasses}
                />
                {abnLoading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                  </div>
                )}
                {abnVerified && !abnLoading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  </div>
                )}
              </div>
              {abnVerified && abnEntityName && (
                <p className="text-[13px] text-green-600 font-medium mt-1.5 flex items-center gap-1">
                  <span>&#10003;</span> {abnEntityName}{abnStatus ? ` — ${abnStatus}` : ''}
                </p>
              )}
              {abnError && !abnLoading && (
                <p className="text-[13px] text-red-600 font-medium mt-1.5">{abnError}</p>
              )}
            </div>
          </div>

          <div className="border-t border-black/[0.06] dark:border-gray-700" />

          <div className="flex items-center gap-3 p-6 md:px-8">
            <button
              onClick={() => navigate('/profile')}
              className="flex-1 h-11 text-[14px] font-semibold text-gray-600 hover:text-gray-900 rounded-lg border border-black/[0.08] hover:border-black/[0.15] hover:bg-black/[0.02] transition-all duration-200 active:scale-[0.98] dark:text-gray-300 dark:hover:text-white dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || (abnField.replace(/\s/g, '').length > 0 && !abnVerified)}
              className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-semibold rounded-lg transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>
      </div>
    </LoggedInLayout>
  );
};

export default UpdatePersonalDetails;
