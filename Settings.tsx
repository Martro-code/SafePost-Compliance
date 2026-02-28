import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Bell, ShieldCheck, Moon, Mail, Info, Lock, Check } from 'lucide-react';
import LoggedInLayout from './src/components/LoggedInLayout';
import { useAuth } from './useAuth';
import { useTheme } from './src/context/ThemeContext';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();

  // 2FA status
  const twoFactor = sessionStorage.getItem('safepost_2fa') === 'true';

  // In-App Notification preferences
  const [notifComplianceResults, setNotifComplianceResults] = useState(false);
  const [notifGuidelineUpdates, setNotifGuidelineUpdates] = useState(false);
  const [notifBillingActivity, setNotifBillingActivity] = useState(false);
  const [notifNewFeatures, setNotifNewFeatures] = useState(false);
  const notifMasterOn = notifComplianceResults || notifGuidelineUpdates || notifBillingActivity || notifNewFeatures;
  const [notifExpanded, setNotifExpanded] = useState(false);
  const [notifSaved, setNotifSaved] = useState(false);

  // Email preferences
  const [emailProductUpdates, setEmailProductUpdates] = useState(false);
  const [emailComplianceAlerts, setEmailComplianceAlerts] = useState(false);
  const [emailUsageSummaries, setEmailUsageSummaries] = useState(false);
  const [emailTipsEducation, setEmailTipsEducation] = useState(false);
  const emailMasterOn = emailProductUpdates || emailComplianceAlerts || emailUsageSummaries || emailTipsEducation;
  const [emailExpanded, setEmailExpanded] = useState(false);
  const [emailSaved, setEmailSaved] = useState(false);

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

  const handleNotifSave = () => {
    localStorage.setItem('safepost_notification_prefs', JSON.stringify({
      complianceResults: notifComplianceResults,
      guidelineUpdates: notifGuidelineUpdates,
      billingActivity: notifBillingActivity,
      newFeatures: notifNewFeatures,
    }));
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

  const handleEmailSave = () => {
    localStorage.setItem('safepost_email_prefs', JSON.stringify({
      productUpdates: emailProductUpdates,
      complianceAlerts: emailComplianceAlerts,
      usageSummaries: emailUsageSummaries,
      tipsEducation: emailTipsEducation,
    }));
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

        <div className="space-y-3">
          {/* Setting 1 — Dark Mode */}
          <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center justify-between p-5 md:px-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center dark:bg-purple-950">
                  <Moon className="w-4.5 h-4.5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <span className="text-[14px] font-medium text-gray-700 dark:text-gray-300">Dark Mode</span>
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

          {/* Setting 2 — In-App Notifications */}
          <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm dark:bg-gray-800 dark:border-gray-700">
            {/* Master row */}
            <div className="flex items-center justify-between p-5 md:px-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center dark:bg-blue-950">
                  <Bell className="w-4.5 h-4.5 text-blue-600" />
                </div>
                <div>
                  <span className="text-[14px] font-medium text-gray-700 dark:text-gray-300">In-App Notifications</span>
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
                {/* Compliance Check Results */}
                <div className="flex items-center justify-between py-3 pl-12">
                  <div>
                    <span className="text-[13px] font-medium text-gray-600 dark:text-gray-400">Compliance Check Results</span>
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

                {/* Guideline Updates */}
                <div className="flex items-center justify-between py-3 pl-12">
                  <div>
                    <span className="text-[13px] font-medium text-gray-600 dark:text-gray-400">Guideline Updates</span>
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

                {/* Billing Activity */}
                <div className="flex items-center justify-between py-3 pl-12">
                  <div>
                    <span className="text-[13px] font-medium text-gray-600 dark:text-gray-400">Billing Activity</span>
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

                {/* New Features */}
                <div className="flex items-center justify-between py-3 pl-12">
                  <div>
                    <span className="text-[13px] font-medium text-gray-600 dark:text-gray-400">New Features</span>
                    <p className="text-[11px] text-gray-400 mt-0.5 dark:text-gray-500">Product updates and new capabilities</p>
                  </div>
                  <button
                    onClick={() => { setNotifNewFeatures(!notifNewFeatures); setNotifSaved(false); }}
                    className={toggleClass(notifNewFeatures)}
                  >
                    <span className={toggleDot(notifNewFeatures)} />
                  </button>
                </div>

                {/* Save Preferences */}
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
                      'Save Preferences'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Setting 3 — Email Preferences */}
          <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm dark:bg-gray-800 dark:border-gray-700">
            {/* Master row */}
            <div className="flex items-center justify-between p-5 md:px-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center dark:bg-green-950">
                  <Mail className="w-4.5 h-4.5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <span className="text-[14px] font-medium text-gray-700 dark:text-gray-300">Email Preferences</span>
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
                {/* Product Updates */}
                <div className="flex items-center justify-between py-3 pl-12">
                  <div>
                    <span className="text-[13px] font-medium text-gray-600 dark:text-gray-400">Product Updates</span>
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

                {/* Compliance Alerts */}
                <div className="flex items-center justify-between py-3 pl-12">
                  <div>
                    <span className="text-[13px] font-medium text-gray-600 dark:text-gray-400">Compliance Alerts</span>
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

                {/* Billing Notifications (locked) */}
                <div className="flex items-center justify-between py-3 pl-12">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium text-gray-600 dark:text-gray-400">Billing Notifications</span>
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

                {/* Usage Summaries */}
                <div className="flex items-center justify-between py-3 pl-12">
                  <div>
                    <span className="text-[13px] font-medium text-gray-600 dark:text-gray-400">Usage Summaries</span>
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

                {/* Tips & Education */}
                <div className="flex items-center justify-between py-3 pl-12">
                  <div>
                    <span className="text-[13px] font-medium text-gray-600 dark:text-gray-400">Tips & Education</span>
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

                {/* Save Preferences */}
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
                      'Save Preferences'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Setting 4 — Two-Factor Authentication */}
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
                  <span className="text-[14px] font-medium text-gray-700 dark:text-gray-300">Two-Factor Authentication</span>
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
