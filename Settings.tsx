import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, Menu, X, ArrowLeft, LogOut, Bell, ShieldCheck, Moon, Mail, Info, Lock } from 'lucide-react';
import SafePostLogo from './components/SafePostLogo';
import { useAuth } from './useAuth';
import { useTheme } from './src/context/ThemeContext';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userEmail, firstName, signOut } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const planName = sessionStorage.getItem('safepost_plan') || '';

  const planDisplayNames: Record<string, string> = {
    professional: 'SafePost Professional',
    proplus: 'SafePost Pro+',
    ultra: 'SafePost Ultra',
  };
  const dropdownPlanName = planDisplayNames[planName.toLowerCase()] || 'SafePost Professional';

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

  // Header state
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(() => {
    const saved = sessionStorage.getItem('safepost_notification_count');
    return saved !== null ? parseInt(saved, 10) : 3;
  });
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogOut = async () => {
    sessionStorage.clear();
    await signOut();
    navigate('/');
  };

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
    setTimeout(() => setNotifSaved(false), 2000);
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
    setTimeout(() => setEmailSaved(false), 2000);
  };

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'History', path: '/history' },
    { label: 'Settings', path: '/settings' },
  ];

  const toggleClass = (enabled: boolean, disabled?: boolean) =>
    `relative w-11 h-6 rounded-full transition-colors duration-200 ${disabled ? 'cursor-not-allowed opacity-60' : ''} ${enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'}`;

  const toggleDot = (enabled: boolean) =>
    `absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${enabled ? 'translate-x-5' : 'translate-x-0'}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7f4] dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-black/[0.06]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-8">
            <Link to="/dashboard">
              <SafePostLogo />
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`px-3.5 py-2 text-[13px] font-medium rounded-lg transition-colors duration-200 ${
                    location.pathname === link.path
                      ? 'text-gray-900 bg-black/[0.04] dark:bg-gray-100 dark:text-gray-900'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] dark:text-gray-400 dark:hover:text-gray-900'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Right: Bell + My Account */}
          <div className="hidden md:flex items-center gap-1 justify-end min-w-[180px]">
            {/* Notification Bell */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => { setNotificationDropdownOpen(!notificationDropdownOpen); setAccountDropdownOpen(false); }}
                className="relative p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-colors duration-200 dark:text-gray-400 dark:hover:text-white"
              >
                <Bell className="w-[18px] h-[18px]" />
                {notificationCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-[9px] font-bold text-white">{notificationCount}</span>
                  </span>
                )}
              </button>
              {notificationDropdownOpen && (
                <div className="absolute top-full right-0 mt-1 w-80 bg-white rounded-xl border border-black/[0.06] shadow-lg shadow-black/[0.06] py-1.5 fade-in dark:bg-gray-800 dark:border-gray-700 z-50">
                  <div className="flex items-center justify-between px-4 py-2.5">
                    <p className="text-[13px] font-semibold text-gray-900 dark:text-white">Notifications</p>
                    <button onClick={() => { setNotificationCount(0); sessionStorage.setItem('safepost_notification_count', '0'); }} className="text-[12px] text-blue-600 hover:text-blue-700 font-medium transition-colors dark:text-blue-400">
                      Mark all as read
                    </button>
                  </div>
                  <div className="border-t border-black/[0.06] dark:border-gray-700" />
                  <div className="py-1">
                    <button className="w-full text-left px-4 py-3 hover:bg-black/[0.02] transition-colors dark:hover:bg-white/[0.02]">
                      <p className="text-[13px] text-gray-900 dark:text-white">Compliance check complete</p>
                      <p className="text-[12px] text-gray-400 mt-0.5">Your recent post has been analysed — 2 mins ago</p>
                    </button>
                    <button className="w-full text-left px-4 py-3 hover:bg-black/[0.02] transition-colors dark:hover:bg-white/[0.02]">
                      <p className="text-[13px] text-gray-900 dark:text-white">Guideline update</p>
                      <p className="text-[12px] text-gray-400 mt-0.5">AHPRA advertising guidelines updated — 1 hour ago</p>
                    </button>
                    <button className="w-full text-left px-4 py-3 hover:bg-black/[0.02] transition-colors dark:hover:bg-white/[0.02]">
                      <p className="text-[13px] text-gray-900 dark:text-white">Billing notification</p>
                      <p className="text-[12px] text-gray-400 mt-0.5">Your next payment is due soon — Yesterday</p>
                    </button>
                  </div>
                  <div className="border-t border-black/[0.06] dark:border-gray-700" />
                  <button
                    onClick={() => { navigate('/notification-preferences'); setNotificationDropdownOpen(false); }}
                    className="block w-full text-center px-4 py-2.5 text-[13px] font-medium text-blue-600 hover:text-blue-700 transition-colors dark:text-blue-400"
                  >
                    View All Notifications
                  </button>
                </div>
              )}
            </div>

            {/* My Account dropdown */}
            <div className="relative">
              <button
                onClick={() => { setAccountDropdownOpen(!accountDropdownOpen); setNotificationDropdownOpen(false); }}
                onBlur={() => setTimeout(() => setAccountDropdownOpen(false), 150)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium text-gray-700 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-colors duration-200"
              >
                My Account
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${accountDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {accountDropdownOpen && (
                <div className="absolute top-full right-0 mt-1 w-56 bg-white rounded-xl border border-black/[0.06] shadow-lg shadow-black/[0.06] py-1.5 fade-in dark:bg-gray-800 dark:border-gray-700">
                  <div className="px-4 py-2.5">
                    <p className="text-[12px] text-gray-400 truncate">{userEmail}</p>
                    <p className="text-[10px] font-medium text-[#2563EB] mt-1">{dropdownPlanName}</p>
                  </div>
                  <div className="border-t border-black/[0.06] dark:border-gray-700 my-1" />
                  <button onClick={() => navigate('/profile')} className="block w-full text-left px-4 py-2 text-[13px] text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-colors dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/[0.06]">
                    Profile
                  </button>
                  <button onClick={() => navigate('/billing')} className="block w-full text-left px-4 py-2 text-[13px] text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-colors dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/[0.06]">
                    Billing
                  </button>
                  <button onClick={() => navigate('/settings')} className="block w-full text-left px-4 py-2 text-[13px] text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-colors dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/[0.06]">
                    Settings
                  </button>
                  <div className="border-t border-black/[0.06] dark:border-gray-700 my-1" />
                  <button
                    onClick={handleLogOut}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-[13px] text-gray-600 hover:text-gray-900 hover:bg-black/[0.04] transition-colors dark:text-gray-400 dark:hover:text-white"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-all duration-200 dark:text-gray-400 dark:hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-6 pb-5 pt-2 border-t border-black/[0.06] dark:border-gray-700 space-y-1">
            <div className="px-3 py-2.5">
              <p className="text-[12px] text-gray-400 truncate">{userEmail}</p>
              <p className="text-[10px] font-medium text-[#2563EB] mt-1">{dropdownPlanName}</p>
            </div>
            <div className="border-t border-black/[0.06] dark:border-gray-700 my-1" />
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => { navigate(link.path); setMobileMenuOpen(false); }}
                className={`block w-full text-left px-3 py-2.5 text-[13px] font-medium rounded-lg transition-colors duration-200 ${
                  location.pathname === link.path
                    ? 'text-gray-900 bg-black/[0.04] dark:bg-gray-100 dark:text-gray-900'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] dark:text-gray-400 dark:hover:text-gray-900'
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="border-t border-black/[0.06] dark:border-gray-700 my-1" />
            <button onClick={() => { navigate('/profile'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2.5 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200 dark:text-gray-400 dark:hover:text-white">
              Profile
            </button>
            <button onClick={() => { navigate('/billing'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2.5 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200 dark:text-gray-400 dark:hover:text-white">
              Billing
            </button>
            <button onClick={() => { navigate('/settings'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2.5 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200 dark:text-gray-400 dark:hover:text-white">
              Settings
            </button>
            <div className="border-t border-black/[0.06] dark:border-gray-700 my-1" />
            <button
              onClick={handleLogOut}
              className="flex items-center gap-2 w-full text-left px-3 py-2.5 text-[13px] font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200 dark:text-gray-400 dark:hover:text-white"
            >
              <LogOut className="w-3.5 h-3.5" />
              Log Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
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
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 mb-2 dark:text-white">
              Settings
            </h1>
            <p className="text-[14px] text-gray-500 dark:text-gray-300">
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
                      className="h-9 px-5 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold rounded-lg shadow-sm shadow-blue-600/25 transition-all duration-200 active:scale-[0.98]"
                    >
                      {notifSaved ? 'Saved!' : 'Save Preferences'}
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
                      className="h-9 px-5 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold rounded-lg shadow-sm shadow-blue-600/25 transition-all duration-200 active:scale-[0.98]"
                    >
                      {emailSaved ? 'Saved!' : 'Save Preferences'}
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
      </main>

      {/* Footer */}
      <footer className="bg-[#f7f7f4] dark:bg-gray-900 border-t border-black/[0.06] dark:border-gray-700 pt-14 pb-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8">
            <div>
              <h4 className="text-[13px] font-semibold text-gray-900 mb-4 dark:text-white">Features</h4>
              <ul className="space-y-2.5">
                <li><button onClick={() => navigate('/features')} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200 dark:text-gray-400 dark:hover:text-white">Features</button></li>
                <li><button onClick={() => navigate('/pricing/medical-practitioners')} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200 dark:text-gray-400 dark:hover:text-white">Pricing</button></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200 dark:text-gray-400 dark:hover:text-white">Demo</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[13px] font-semibold text-gray-900 mb-4 dark:text-white">Pricing</h4>
              <ul className="space-y-2.5">
                <li><button onClick={() => navigate('/pricing/medical-practitioners')} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200 dark:text-gray-400 dark:hover:text-white">Medical Practitioners</button></li>
                <li><button onClick={() => navigate('/pricing/medical-practices')} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200 dark:text-gray-400 dark:hover:text-white">Medical Practices</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[13px] font-semibold text-gray-900 mb-4 dark:text-white">Company</h4>
              <ul className="space-y-2.5">
                <li><button onClick={() => navigate('/about')} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200 dark:text-gray-400 dark:hover:text-white">About us</button></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200 dark:text-gray-400 dark:hover:text-white">News</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[13px] font-semibold text-gray-900 mb-4 dark:text-white">Resources</h4>
              <ul className="space-y-2.5">
                <li><a href="https://www.ahpra.gov.au/Resources/Advertising-hub.aspx" target="_blank" rel="noopener noreferrer" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200 dark:text-gray-400 dark:hover:text-white">Advertising hub</a></li>
                <li><a href="https://www.medicalboard.gov.au/codes-guidelines-policies/code-of-conduct.aspx" target="_blank" rel="noopener noreferrer" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200 dark:text-gray-400 dark:hover:text-white">Code of conduct</a></li>
                <li><a href="https://www.tga.gov.au/resources/guidance/advertising-therapeutic-goods-social-media" target="_blank" rel="noopener noreferrer" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200 dark:text-gray-400 dark:hover:text-white">TGA guidelines</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[13px] font-semibold text-gray-900 mb-4 dark:text-white">Legal</h4>
              <ul className="space-y-2.5">
                <li><button onClick={() => navigate('/terms-of-use')} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200 dark:text-gray-400 dark:hover:text-white">Terms of Use</button></li>
                <li><button onClick={() => navigate('/privacy-policy')} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200 dark:text-gray-400 dark:hover:text-white">Privacy Policy</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[13px] font-semibold text-gray-900 mb-4 dark:text-white">Connect</h4>
              <ul className="space-y-2.5">
                <li><button onClick={() => navigate('/contact')} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200 dark:text-gray-400 dark:hover:text-white">Contact us</button></li>
              </ul>
            </div>
          </div>

          <div className="mt-14 pt-6 border-t border-black/[0.06] dark:border-gray-700">
            <p className="text-[10px] text-gray-400 leading-relaxed tracking-wide">
              Disclaimer: This application is an AI-powered guidance tool and does not constitute legal or regulatory advice.
              AHPRA and the National Boards do not provide pre-approval for advertising.
              Registered health practitioners are ultimately responsible for ensuring their social media activities and advertising complies with the Health Practitioner Regulation National Law.
            </p>
            <p className="text-[11px] text-gray-400 mt-4">&copy; SafePost&trade; 2026</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Settings;
