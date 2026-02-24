import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X, ArrowLeft, LogOut, CheckCircle, Bell } from 'lucide-react';
import SafePostLogo from './components/SafePostLogo';
import { useAuth } from './useAuth';

const reasons = [
  'Too expensive',
  'Not using it enough',
  'Missing a feature I need',
  'Switching to a competitor',
  'Practice closing or changing',
  'Other',
];

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
};

const CancelSubscription: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userEmail, firstName, signOut } = useAuth();

  const planName = sessionStorage.getItem('safepost_plan') || '';
  const billingPeriod = sessionStorage.getItem('safepost_billing') || '';
  const planDisplayNames: Record<string, string> = {
    professional: 'SafePost Professional',
    proplus: 'SafePost Pro+',
    ultra: 'SafePost Ultra',
  };
  const dropdownPlanName = planDisplayNames[planName.toLowerCase()] || 'SafePost Professional';

  const [step, setStep] = useState(1);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [otherText, setOtherText] = useState('');
  const [featureFeedback, setFeatureFeedback] = useState('');
  const [outcome, setOutcome] = useState<'paused' | 'cancelled' | null>(null);

  // Header state
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
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

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'History', path: '/history' },
    { label: 'Settings', path: '/settings' },
  ];

  // Calculate billing period end date
  const billingEndDate = (() => {
    const date = new Date();
    if (billingPeriod.toLowerCase() === 'yearly') {
      date.setFullYear(date.getFullYear() + 1);
    } else {
      date.setMonth(date.getMonth() + 1);
    }
    return formatDate(date);
  })();

  // Pause resume date (30 days from today)
  const pauseResumeDate = (() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return formatDate(date);
  })();

  const handlePause = () => {
    sessionStorage.setItem('safepost_paused', 'true');
    setOutcome('paused');
  };

  const handleConfirmCancel = () => {
    sessionStorage.setItem('safepost_cancelled', 'true');
    sessionStorage.setItem('safepost_cancel_date', billingEndDate);
    setOutcome('cancelled');
  };

  // Step indicator
  const StepIndicator = () => (
    <div className="flex items-center gap-3 mb-6">
      <p className="text-[12px] font-medium text-gray-400 dark:text-gray-500">Step {step} of 3</p>
      <div className="flex items-center gap-1.5">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              s <= step ? 'w-6 bg-blue-500' : 'w-4 bg-gray-200 dark:bg-gray-700'
            }`}
          />
        ))}
      </div>
    </div>
  );

  // Step 2 retention offer content
  const getRetentionOffer = () => {
    const isPauseOffer = selectedReason === 'Too expensive' || selectedReason === 'Practice closing or changing';

    if (isPauseOffer) {
      return {
        heading: selectedReason === 'Too expensive' ? 'What if you could pause instead?' : 'Take a break instead',
        body: 'Put your subscription on hold for 30 days at no charge. Your account and compliance check history will be fully preserved and your subscription resumes automatically after 30 days.',
        buttonLabel: 'Pause My Subscription for 30 Days',
        onButtonClick: handlePause,
        showTextArea: false,
      };
    }

    if (selectedReason === 'Not using it enough') {
      return {
        heading: "Here's the value you've already received",
        body: 'Every compliance check protects your AHPRA registration. Missing just one non-compliant post could trigger an investigation.',
        buttonLabel: 'Keep My Subscription',
        onButtonClick: () => navigate('/dashboard'),
        showTextArea: false,
      };
    }

    if (selectedReason === 'Missing a feature I need') {
      return {
        heading: 'Tell us what you need',
        body: "We're constantly improving SafePost based on user feedback. Your input directly shapes our roadmap.",
        buttonLabel: 'Submit Feedback & Keep Subscription',
        onButtonClick: () => navigate('/dashboard'),
        showTextArea: true,
      };
    }

    if (selectedReason === 'Switching to a competitor') {
      return {
        heading: 'SafePost is built specifically for Australian practitioners',
        body: 'Our compliance database is built on AHPRA guidelines, the National Law and TGA requirements — specific to Australian healthcare. No generic AI tool offers this level of Australian regulatory precision.',
        buttonLabel: 'Keep My Subscription',
        onButtonClick: () => navigate('/dashboard'),
        showTextArea: false,
      };
    }

    // Other
    return {
      heading: "We'd love to help",
      body: 'If there\'s anything we can do to improve your experience, please reach out before you go.',
      buttonLabel: 'Keep My Subscription',
      onButtonClick: () => navigate('/dashboard'),
      showTextArea: false,
      showContact: true,
    };
  };

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
                    <button onClick={() => setNotificationCount(0)} className="text-[12px] text-blue-600 hover:text-blue-700 font-medium transition-colors dark:text-blue-400">
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
                {firstName || 'My Account'}
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
          {/* Back to Profile */}
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors mb-8 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </button>

          {/* Card */}
          <div className="bg-white rounded-2xl border border-black/[0.06] shadow-lg shadow-black/[0.04] dark:bg-gray-800 dark:border-gray-700">

            {/* ===== OUTCOME: PAUSED ===== */}
            {outcome === 'paused' && (
              <div className="p-6 md:p-8 text-center">
                <div className="text-4xl mb-4">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2 dark:text-white">
                  Subscription Paused
                </h2>
                <p className="text-[14px] text-gray-500 mb-6 leading-relaxed dark:text-gray-300">
                  Your subscription is on hold for 30 days. No charge will be made during this period. Your subscription will resume automatically on {pauseResumeDate}.
                </p>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="h-11 px-8 bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-semibold rounded-lg transition-all duration-200 active:scale-[0.98]"
                >
                  Go to Dashboard
                </button>
              </div>
            )}

            {/* ===== OUTCOME: CANCELLED ===== */}
            {outcome === 'cancelled' && (
              <div className="p-6 md:p-8 text-center">
                <div className="text-4xl mb-4">
                  <span className="inline-block">&#128075;</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2 dark:text-white">
                  Your subscription has been cancelled
                </h2>
                <p className="text-[14px] text-gray-500 mb-6 leading-relaxed dark:text-gray-300">
                  Your access continues until {billingEndDate}. We hope to see you again soon.
                </p>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="h-11 px-8 bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-semibold rounded-lg transition-all duration-200 active:scale-[0.98]"
                >
                  Go to Dashboard
                </button>
              </div>
            )}

            {/* ===== STEP 1: REASON ===== */}
            {!outcome && step === 1 && (
              <div className="p-6 md:p-8">
                <StepIndicator />

                <h2 className="text-xl font-bold text-gray-900 mb-2 dark:text-white">
                  We're sorry to see you go
                </h2>
                <p className="text-[14px] text-gray-500 mb-6 dark:text-gray-300">
                  Before you cancel, could you tell us why?
                </p>

                <div className="space-y-2">
                  {reasons.map((reason) => (
                    <button
                      key={reason}
                      onClick={() => setSelectedReason(reason)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-200 ${
                        selectedReason === reason
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500'
                          : 'border-black/[0.06] hover:border-black/[0.12] hover:bg-black/[0.01] dark:border-gray-700 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        selectedReason === reason ? 'border-blue-600 bg-blue-600' : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {selectedReason === reason && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <span className="text-[14px] text-gray-700 dark:text-gray-300">{reason}</span>
                    </button>
                  ))}
                </div>

                {/* Other text area */}
                {selectedReason === 'Other' && (
                  <textarea
                    value={otherText}
                    onChange={(e) => setOtherText(e.target.value)}
                    placeholder="Please tell us more (optional)"
                    className="w-full mt-3 px-4 py-3 text-[14px] text-gray-900 bg-white rounded-xl border border-gray-200 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-y min-h-[80px] dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  />
                )}

                <div className="border-t border-black/[0.06] dark:border-gray-700 mt-6 pt-6" />

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-semibold rounded-lg transition-all duration-200 active:scale-[0.98]"
                  >
                    Keep My Subscription
                  </button>
                  <button
                    disabled={!selectedReason}
                    onClick={() => setStep(2)}
                    className={`flex-1 h-11 text-[14px] font-semibold rounded-lg border transition-all duration-200 active:scale-[0.98] ${
                      selectedReason
                        ? 'text-gray-600 hover:text-gray-900 border-black/[0.08] hover:border-black/[0.15] hover:bg-black/[0.02] dark:text-gray-300 dark:hover:text-white dark:border-gray-600'
                        : 'text-gray-300 border-black/[0.04] cursor-not-allowed dark:text-gray-600 dark:border-gray-700'
                    }`}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* ===== STEP 2: RETENTION OFFER ===== */}
            {!outcome && step === 2 && (() => {
              const offer = getRetentionOffer();
              return (
                <div className="p-6 md:p-8">
                  <StepIndicator />

                  <h2 className="text-xl font-bold text-gray-900 mb-2 dark:text-white">
                    {offer.heading}
                  </h2>
                  <p className="text-[14px] text-gray-500 leading-relaxed dark:text-gray-300">
                    {offer.body}
                  </p>

                  {'showContact' in offer && offer.showContact && (
                    <p className="text-[14px] text-blue-600 font-medium mt-3 dark:text-blue-400">
                      info@safepost.com.au
                    </p>
                  )}

                  {offer.showTextArea && (
                    <textarea
                      value={featureFeedback}
                      onChange={(e) => setFeatureFeedback(e.target.value)}
                      placeholder="Tell us what feature you need..."
                      className="w-full mt-4 px-4 py-3 text-[14px] text-gray-900 bg-white rounded-xl border border-gray-200 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-y min-h-[100px] dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    />
                  )}

                  <div className="border-t border-black/[0.06] dark:border-gray-700 mt-6 pt-6" />

                  <button
                    onClick={offer.onButtonClick}
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-semibold rounded-lg transition-all duration-200 active:scale-[0.98]"
                  >
                    {offer.buttonLabel}
                  </button>

                  <div className="text-center mt-4">
                    <button
                      onClick={() => setStep(3)}
                      className="text-[13px] text-gray-400 hover:text-gray-600 transition-colors dark:text-gray-500 dark:hover:text-gray-300"
                    >
                      No thanks, continue to cancel &rarr;
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* ===== STEP 3: FINAL CONFIRMATION ===== */}
            {!outcome && step === 3 && (
              <div className="p-6 md:p-8">
                <StepIndicator />

                <h2 className="text-xl font-bold text-gray-900 mb-2 dark:text-white">
                  Confirm Cancellation
                </h2>
                <p className="text-[14px] text-gray-500 mb-6 dark:text-gray-300">
                  Please read the following before confirming
                </p>

                {/* Info box */}
                <div className="bg-gray-50 rounded-xl p-5 space-y-3 dark:bg-gray-700/50">
                  <div className="flex items-start gap-2.5">
                    <span className="text-green-500 text-[14px] leading-none mt-0.5 flex-shrink-0">&#10003;</span>
                    <p className="text-[13px] text-gray-600 dark:text-gray-300">Your access continues until {billingEndDate}</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-green-500 text-[14px] leading-none mt-0.5 flex-shrink-0">&#10003;</span>
                    <p className="text-[13px] text-gray-600 dark:text-gray-300">Your compliance check history will be preserved</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-green-500 text-[14px] leading-none mt-0.5 flex-shrink-0">&#10003;</span>
                    <p className="text-[13px] text-gray-600 dark:text-gray-300">You can reactivate your subscription at any time</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-green-500 text-[14px] leading-none mt-0.5 flex-shrink-0">&#10003;</span>
                    <p className="text-[13px] text-gray-600 dark:text-gray-300">No further charges will be made after your access ends</p>
                  </div>
                </div>

                <div className="border-t border-black/[0.06] dark:border-gray-700 mt-6 pt-6" />

                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-semibold rounded-lg transition-all duration-200 active:scale-[0.98]"
                >
                  Keep My Subscription
                </button>

                <div className="text-center mt-4">
                  <button
                    onClick={handleConfirmCancel}
                    className="text-[13px] text-red-500 hover:text-red-600 transition-colors"
                  >
                    Confirm Cancellation
                  </button>
                </div>
              </div>
            )}
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
              Ahpra and the National Boards do not provide pre-approval for advertising.
              Registered health practitioners are ultimately responsible for ensuring their advertising complies with the Health Practitioner Regulation National Law.
            </p>
            <p className="text-[11px] text-gray-400 mt-4">&copy; SafePost&trade; 2026</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CancelSubscription;
