import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Bell, ShieldCheck, Moon, Mail, Info, Lock, Check, AlertCircle } from 'lucide-react';
import LoggedInLayout from '../components/layout/LoggedInLayout';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import { useAccount } from '../context/AccountContext';
import { supabase } from '../services/supabaseClient';

const DEFAULTS = {
  notif_compliance_results: false,
  notif_guideline_updates: false,
  notif_billing_activity: false,
  notif_new_features: false,
  email_product_updates: false,
  email_compliance_alerts: false,
  email_usage_summaries: false,
  email_tips_education: false,
};

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { role, plan: accountPlan } = useAccount();

  const isOwner = role === 'owner';

  // Plan check
  // SECURITY: Never fall back to sessionStorage for plan — it's user-controlled.
  // Only trust the database-backed value from AccountContext.
  const planName = accountPlan || '';
  const isUltra = planName.toLowerCase() === 'ultra';

  // 2FA status — check Supabase MFA factors
  const [twoFactor, setTwoFactor] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error: listErr } = await supabase.auth.mfa.listFactors();
      if (listErr) {
        console.error('Failed to list MFA factors:', listErr);
        return;
      }
      const hasVerified = data.totp.some((f) => f.status === 'verified');
      setTwoFactor(hasVerified);
    })();
  }, []);

  // In-App Notification preferences
  const [notifComplianceResults, setNotifComplianceResults] = useState(DEFAULTS.notif_compliance_results);
  const [notifGuidelineUpdates, setNotifGuidelineUpdates] = useState(DEFAULTS.notif_guideline_updates);
  const [notifBillingActivity, setNotifBillingActivity] = useState(DEFAULTS.notif_billing_activity);
  const [notifNewFeatures, setNotifNewFeatures] = useState(DEFAULTS.notif_new_features);
  const notifMasterOn = notifComplianceResults || notifGuidelineUpdates || notifBillingActivity || notifNewFeatures;
  const [notifExpanded, setNotifExpanded] = useState(false);
  const [notifSaved, setNotifSaved] = useState(false);

  // Email preferences
  const [emailProductUpdates, setEmailProductUpdates] = useState(DEFAULTS.email_product_updates);
  const [emailComplianceAlerts, setEmailComplianceAlerts] = useState(DEFAULTS.email_compliance_alerts);
  const [emailUsageSummaries, setEmailUsageSummaries] = useState(DEFAULTS.email_usage_summaries);
  const [emailTipsEducation, setEmailTipsEducation] = useState(DEFAULTS.email_tips_education);
  const emailMasterOn = emailProductUpdates || emailComplianceAlerts || emailUsageSummaries || emailTipsEducation;
  const [emailExpanded, setEmailExpanded] = useState(false);
  const [emailSaved, setEmailSaved] = useState(false);

  // Error state
  const [saveError, setSaveError] = useState<string | null>(null);

  // Load preferences from Supabase on mount
  useEffect(() => {
    if (!user) return;

    (async () => {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Failed to load preferences:', error);
        return;
      }

      if (data) {
        setNotifComplianceResults(data.notif_compliance_results ?? false);
        setNotifGuidelineUpdates(data.notif_guideline_updates ?? false);
        setNotifBillingActivity(data.notif_billing_activity ?? false);
        setNotifNewFeatures(data.notif_new_features ?? false);
        setEmailProductUpdates(data.email_product_updates ?? false);
        setEmailComplianceAlerts(data.email_compliance_alerts ?? false);
        setEmailUsageSummaries(data.email_usage_summaries ?? false);
        setEmailTipsEducation(data.email_tips_education ?? false);
      } else {
        // No row yet — insert with all preferences off (opt-in model)
        await supabase.from('user_preferences').insert({
          user_id: user.id,
          notif_compliance_results: false,
          notif_guideline_updates: false,
          notif_billing_activity: false,
          notif_new_features: false,
          email_product_updates: false,
          email_compliance_alerts: false,
          email_usage_summaries: false,
          email_tips_education: false,
        });
      }
    })();
  }, [user]);

  const handleNotifMasterToggle = () => {
    if (notifMasterOn) {
      setNotifComplianceResults(false);
      setNotifGuidelineUpdates(false);
      setNotifBillingActivity(false);
      setNotifNewFeatures(false);
      setNotifExpanded(false);
    } else {
      setNotifComplianceResults(true);
      setNotifGuidelineUpdates(true);
      setNotifBillingActivity(true);
      setNotifNewFeatures(true);
      setNotifExpanded(true);
    }
    setNotifSaved(false);
  };

  const handleNotifSave = async () => {
    if (!user) return;
    setSaveError(null);

    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: user.id,
        notif_compliance_results: notifComplianceResults,
        notif_guideline_updates: notifGuidelineUpdates,
        notif_billing_activity: notifBillingActivity,
        notif_new_features: notifNewFeatures,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (error) {
      console.error('Failed to save notification preferences:', error);
      setSaveError('Failed to save preferences. Please try again.');
      return;
    }

    setNotifSaved(true);
    setTimeout(() => {
      setNotifExpanded(false);
      setNotifSaved(false);
    }, 1500);
  };

  const handleEmailMasterToggle = () => {
    if (emailMasterOn) {
      setEmailProductUpdates(false);
      setEmailComplianceAlerts(false);
      setEmailUsageSummaries(false);
      setEmailTipsEducation(false);
      setEmailExpanded(false);
    } else {
      setEmailProductUpdates(true);
      setEmailComplianceAlerts(true);
      setEmailUsageSummaries(true);
      setEmailTipsEducation(false);
      setEmailExpanded(true);
    }
    setEmailSaved(false);
  };

  const handleEmailSave = async () => {
    if (!user) return;
    setSaveError(null);

    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: user.id,
        email_product_updates: emailProductUpdates,
        email_compliance_alerts: emailComplianceAlerts,
        email_usage_summaries: emailUsageSummaries,
        email_tips_education: emailTipsEducation,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (error) {
      console.error('Failed to save email preferences:', error);
      setSaveError('Failed to save preferences. Please try again.');
      return;
    }

    setEmailSaved(true);
    setTimeout(() => {
      setEmailExpanded(false);
      setEmailSaved(false);
    }, 1500);
  };

  const toggleClass = (enabled: boolean, disabled?: boolean) =>
    `relative w-11 h-6 rounded-full transition-colors duration-200 ${disabled ? 'cursor-not-allowed opacity-60' : ''} ${enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'}`;

  const toggleDot = (enabled: boolean) =>
    `absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${enabled ? 'translate-x-5' : 'translate-x-0'}`;

  return (
    <LoggedInLayout>
      <div className="max-w-2xl mx-auto px-6 pt-6 pb-10 md:pt-8 md:pb-16">
        {/* Back to Dashboard */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors mb-8 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Settings
          </h1>
          <p className="text-[14px] text-gray-500 mt-1 mb-8">
            Manage your account preferences
          </p>
        </div>

        {/* Error toast */}
        {saveError && (
          <div className="mb-4 flex items-center gap-2 p-3.5 bg-red-50 border border-red-200 rounded-xl text-[13px] text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {saveError}
          </div>
        )}

        <div className="space-y-3">
          {/* Setting 1 — Dark mode */}
          <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center justify-between p-5 md:px-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center dark:bg-purple-950">
                  <Moon className="w-4.5 h-4.5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <span className="text-[14px] font-medium text-gray-700 dark:text-gray-300">Dark mode</span>
                  <p className="text-[12px] text-gray-400 mt-0.5 dark:text-gray-500">Switch between light and dark themes</p>
                </div>
              </div>
              <button
                onClick={toggleDarkMode}
                className={toggleClass(isDarkMode)}
              >
                <span className={toggleDot(isDarkMode)} />
              </button>
            </div>
          </div>

          {/* Setting 2 — In-app notifications */}
          <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm dark:bg-gray-800 dark:border-gray-700">
            {/* Master row */}
            <div className="flex items-center justify-between p-5 md:px-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center dark:bg-blue-950">
                  <Bell className="w-4.5 h-4.5 text-blue-600" />
                </div>
                <div>
                  <span className="text-[14px] font-medium text-gray-700 dark:text-gray-300">In-app notifications</span>
                  <p className="text-[12px] text-gray-400 mt-0.5 dark:text-gray-500">Manage notification preferences</p>
                </div>
              </div>
              <button
                onClick={handleNotifMasterToggle}
                className={toggleClass(notifMasterOn)}
              >
                <span className={toggleDot(notifMasterOn)} />
              </button>
            </div>

            {/* Expandable sub-toggles */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                notifExpanded && notifMasterOn ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="border-t border-black/[0.06] dark:border-gray-700" />
              <div className="px-5 md:px-6 py-4 space-y-0">
                {/* Compliance check results */}
                <div className="flex items-center justify-between py-3 pl-12">
                  <div>
                    <span className="text-[13px] font-medium text-gray-600 dark:text-gray-400">Compliance check results</span>
                    <p className="text-[11px] text-gray-400 mt-0.5 dark:text-gray-500">Get notified when your checks are complete</p>
                  </div>
                  <button
                    onClick={() => { setNotifComplianceResults(!notifComplianceResults); setNotifSaved(false); }}
                    className={toggleClass(notifComplianceResults)}
                  >
                    <span className={toggleDot(notifComplianceResults)} />
                  </button>
                </div>

                <div className="border-t border-black/[0.04] dark:border-gray-700/50 ml-12" />

                {/* Guideline updates */}
                <div className="flex items-center justify-between py-3 pl-12">
                  <div>
                    <span className="text-[13px] font-medium text-gray-600 dark:text-gray-400">Guideline updates</span>
                    <p className="text-[11px] text-gray-400 mt-0.5 dark:text-gray-500">AHPRA and TGA guideline changes</p>
                  </div>
                  <button
                    onClick={() => { setNotifGuidelineUpdates(!notifGuidelineUpdates); setNotifSaved(false); }}
                    className={toggleClass(notifGuidelineUpdates)}
                  >
                    <span className={toggleDot(notifGuidelineUpdates)} />
                  </button>
                </div>

                <div className="border-t border-black/[0.04] dark:border-gray-700/50 ml-12" />

                {/* Billing activity */}
                <div className="flex items-center justify-between py-3 pl-12">
                  <div>
                    <span className="text-[13px] font-medium text-gray-600 dark:text-gray-400">Billing activity</span>
                    <p className="text-[11px] text-gray-400 mt-0.5 dark:text-gray-500">Payment confirmations and reminders</p>
                  </div>
                  <button
                    onClick={() => { setNotifBillingActivity(!notifBillingActivity); setNotifSaved(false); }}
                    className={toggleClass(notifBillingActivity)}
                  >
                    <span className={toggleDot(notifBillingActivity)} />
                  </button>
                </div>

                <div className="border-t border-black/[0.04] dark:border-gray-700/50 ml-12" />

                {/* New features */}
                <div className="flex items-center justify-between py-3 pl-12">
                  <div>
                    <span className="text-[13px] font-medium text-gray-600 dark:text-gray-400">New features</span>
                    <p className="text-[11px] text-gray-400 mt-0.5 dark:text-gray-500">Product updates and new capabilities</p>
                  </div>
                  <button
                    onClick={() => { setNotifNewFeatures(!notifNewFeatures); setNotifSaved(false); }}
                    className={toggleClass(notifNewFeatures)}
                  >
                    <span className={toggleDot(notifNewFeatures)} />
                  </button>
                </div>

                {/* Save preferences */}
                <div className="pt-4 pl-12">
                  <button
                    onClick={handleNotifSave}
                    disabled={notifSaved}
                    className={`h-9 px-5 text-white text-[13px] font-semibold rounded-lg shadow-sm transition-all duration-200 ${
                      notifSaved
                        ? 'bg-green-600 shadow-green-600/25 pointer-events-none'
                        : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/25 active:scale-[0.98]'
                    }`}
                  >
                    {notifSaved ? (
                      <span className="flex items-center gap-1.5">
                        <Check className="w-4 h-4" />
                        Saved!
                      </span>
                    ) : (
                      'Save preferences'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Setting 3 — Email preferences */}
          <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm dark:bg-gray-800 dark:border-gray-700">
            {/* Master row */}
            <div className="flex items-center justify-between p-5 md:px-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center dark:bg-green-950">
                  <Mail className="w-4.5 h-4.5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <span className="text-[14px] font-medium text-gray-700 dark:text-gray-300">Email preferences</span>
                  <p className="text-[12px] text-gray-400 mt-0.5 dark:text-gray-500">Manage which emails you receive</p>
                </div>
              </div>
              <button
                onClick={handleEmailMasterToggle}
                className={toggleClass(emailMasterOn)}
              >
                <span className={toggleDot(emailMasterOn)} />
              </button>
            </div>

            {/* Expandable sub-toggles */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                emailExpanded && emailMasterOn ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="border-t border-black/[0.06] dark:border-gray-700" />
              <div className="px-5 md:px-6 py-4 space-y-0">
                {/* Product updates */}
                <div className="flex items-center justify-between py-3 pl-12">
                  <div>
                    <span className="text-[13px] font-medium text-gray-600 dark:text-gray-400">Product updates</span>
                    <p className="text-[11px] text-gray-400 mt-0.5 dark:text-gray-500">New features, improvements, and announcements</p>
                  </div>
                  <button
                    onClick={() => { setEmailProductUpdates(!emailProductUpdates); setEmailSaved(false); }}
                    className={toggleClass(emailProductUpdates)}
                  >
                    <span className={toggleDot(emailProductUpdates)} />
                  </button>
                </div>

                <div className="border-t border-black/[0.04] dark:border-gray-700/50 ml-12" />

                {/* Compliance alerts */}
                <div className="flex items-center justify-between py-3 pl-12">
                  <div>
                    <span className="text-[13px] font-medium text-gray-600 dark:text-gray-400">Compliance alerts</span>
                    <p className="text-[11px] text-gray-400 mt-0.5 dark:text-gray-500">Regulatory changes that may affect your content</p>
                  </div>
                  <button
                    onClick={() => { setEmailComplianceAlerts(!emailComplianceAlerts); setEmailSaved(false); }}
                    className={toggleClass(emailComplianceAlerts)}
                  >
                    <span className={toggleDot(emailComplianceAlerts)} />
                  </button>
                </div>

                <div className="border-t border-black/[0.04] dark:border-gray-700/50 ml-12" />

                {/* Billing notifications (locked) */}
                <div className="flex items-center justify-between py-3 pl-12">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium text-gray-600 dark:text-gray-400">Billing notifications</span>
                      <Lock className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5 dark:text-gray-500">Payment receipts, reminders, and subscription changes</p>
                  </div>
                  <button
                    disabled
                    className={toggleClass(true, true)}
                  >
                    <span className={toggleDot(true)} />
                  </button>
                </div>

                <div className="border-t border-black/[0.04] dark:border-gray-700/50 ml-12" />

                {/* Usage summaries */}
                <div className="flex items-center justify-between py-3 pl-12">
                  <div>
                    <span className="text-[13px] font-medium text-gray-600 dark:text-gray-400">Usage summaries</span>
                    <p className="text-[11px] text-gray-400 mt-0.5 dark:text-gray-500">Weekly summary of your compliance check activity</p>
                  </div>
                  <button
                    onClick={() => { setEmailUsageSummaries(!emailUsageSummaries); setEmailSaved(false); }}
                    className={toggleClass(emailUsageSummaries)}
                  >
                    <span className={toggleDot(emailUsageSummaries)} />
                  </button>
                </div>

                <div className="border-t border-black/[0.04] dark:border-gray-700/50 ml-12" />

                {/* Tips & education */}
                <div className="flex items-center justify-between py-3 pl-12">
                  <div>
                    <span className="text-[13px] font-medium text-gray-600 dark:text-gray-400">Tips & education</span>
                    <p className="text-[11px] text-gray-400 mt-0.5 dark:text-gray-500">Helpful guides and best practices for compliant advertising</p>
                  </div>
                  <button
                    onClick={() => { setEmailTipsEducation(!emailTipsEducation); setEmailSaved(false); }}
                    className={toggleClass(emailTipsEducation)}
                  >
                    <span className={toggleDot(emailTipsEducation)} />
                  </button>
                </div>

                {/* Info Box */}
                <div className="pt-4 pl-12">
                  <div className="flex gap-3 p-3.5 bg-blue-50 rounded-xl dark:bg-blue-900/20">
                    <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <p className="text-[12px] text-blue-700 leading-relaxed dark:text-blue-300">
                      Essential emails such as billing notifications and security alerts will always be sent regardless of your preferences.
                    </p>
                  </div>
                </div>

                {/* Save preferences */}
                <div className="pt-4 pl-12">
                  <button
                    onClick={handleEmailSave}
                    disabled={emailSaved}
                    className={`h-9 px-5 text-white text-[13px] font-semibold rounded-lg shadow-sm transition-all duration-200 ${
                      emailSaved
                        ? 'bg-green-600 shadow-green-600/25 pointer-events-none'
                        : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/25 active:scale-[0.98]'
                    }`}
                  >
                    {emailSaved ? (
                      <span className="flex items-center gap-1.5">
                        <Check className="w-4 h-4" />
                        Saved!
                      </span>
                    ) : (
                      'Save preferences'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Setting 4 — Two-factor authentication */}
          <button
            onClick={() => navigate('/two-factor-auth')}
            className="w-full bg-white rounded-2xl border border-black/[0.06] shadow-sm dark:bg-gray-800 dark:border-gray-700 hover:border-black/[0.12] dark:hover:border-gray-600 transition-[border-color] duration-200"
          >
            <div className="flex items-center justify-between p-5 md:px-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center dark:bg-amber-950">
                  <ShieldCheck className="w-4.5 h-4.5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="text-left">
                  <span className="text-[14px] font-medium text-gray-700 dark:text-gray-300">Two-factor authentication</span>
                  <p className="text-[12px] text-gray-400 mt-0.5 dark:text-gray-500">Add an extra layer of security to your account</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                  twoFactor
                    ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                }`}>
                  {twoFactor ? 'Active' : 'Not set up'}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              </div>
            </div>
          </button>

        </div>
      </div>
    </LoggedInLayout>
  );
};

export default Settings;
