import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation, useSearchParams } from 'react-router-dom';
import { ChevronDown, Menu, X, ArrowLeft, LogOut, Check, Bell } from 'lucide-react';
import SafePostLogo from './components/SafePostLogo';
import { useAuth } from './useAuth';

const plans = [
  {
    key: 'professional',
    name: 'Professional',
    monthlyPrice: 20,
    yearlyPrice: 192,
    yearlySaving: 48,
    features: [
      'Unlimited compliance checks',
      'Compliant content rewrites (AI-generated alternatives)',
      'Image and video content analysis',
      'Compliance history tracking',
    ],
  },
  {
    key: 'proplus',
    name: 'Pro+',
    monthlyPrice: 49,
    yearlyPrice: 470,
    yearlySaving: 118,
    features: [
      'Everything in Professional, plus:',
      'Multi-user access (up to 3 team members)',
      'Basic online advertising compliance analysis',
      'Custom compliance guidelines repository',
    ],
  },
  {
    key: 'ultra',
    name: 'Ultra',
    monthlyPrice: 200,
    yearlyPrice: 1920,
    yearlySaving: 480,
    features: [
      'Everything in Pro+, plus:',
      'Unlimited compliance checks for social media AND online advertising',
      'Multi-user access (up to 10 team members)',
      'Advanced advertising compliance analysis',
      'Bulk content review (upload multiple posts/ads at once)',
      'Proactive notification of guideline changes',
    ],
  },
];

const ChangePlan: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchParams] = useSearchParams();
  const { userEmail, firstName, signOut } = useAuth();
  const planName = sessionStorage.getItem('safepost_plan') || '';
  const isUpgradeMode = searchParams.get('mode') === 'upgrade';

  const planDisplayNames: Record<string, string> = {
    professional: 'SafePost Professional',
    proplus: 'SafePost Pro+',
    ultra: 'SafePost Ultra',
  };
  const dropdownPlanName = planDisplayNames[planName.toLowerCase()] || 'SafePost Professional';

  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

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

  const currentPlanKey = planName.toLowerCase();
  const tierOrder = ['free', '', 'professional', 'proplus', 'ultra'];
  const currentTierIndex = tierOrder.indexOf(currentPlanKey);

  const availablePlans = isUpgradeMode
    ? plans.filter((p) => tierOrder.indexOf(p.key) > currentTierIndex)
    : plans.filter((p) => p.key !== currentPlanKey);

  const isHighestPlan = isUpgradeMode && currentPlanKey === 'ultra';
  const selectedPlanData = plans.find((p) => p.key === selectedPlan);

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
          {/* Back to Dashboard */}
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors mb-8 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          {/* Page Heading */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 mb-2 dark:text-white">
              {isUpgradeMode ? 'Upgrade your Plan' : 'Change your Plan'}
            </h1>
            <p className="text-[14px] text-gray-500 dark:text-gray-300">
              {isUpgradeMode ? 'Choose a higher plan to unlock more features' : 'Pick one of the following plans'}
            </p>
          </div>

          {/* Highest Plan Message */}
          {isHighestPlan && (
            <div className="bg-white rounded-2xl border border-black/[0.06] shadow-lg shadow-black/[0.04] dark:bg-gray-800 dark:border-gray-700 p-8 text-center">
              <p className="text-[15px] font-medium text-gray-900 dark:text-white mb-4">You are already on our highest plan.</p>
              <button
                onClick={() => navigate('/dashboard')}
                className="text-[14px] font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          )}

          {/* Plan Card */}
          {!isHighestPlan && (
          <div className="bg-white rounded-2xl border border-black/[0.06] shadow-lg shadow-black/[0.04] dark:bg-gray-800 dark:border-gray-700">
            {/* Billing Cycle Toggle */}
            <div className="p-6 md:px-8 pb-0">
              <div className="inline-flex rounded-lg border border-black/[0.06] dark:border-gray-600 p-0.5">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-1.5 text-[13px] font-medium rounded-md transition-colors duration-200 ${
                    billingCycle === 'monthly'
                      ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                      : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-4 py-1.5 text-[13px] font-medium rounded-md transition-colors duration-200 ${
                    billingCycle === 'yearly'
                      ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                      : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  }`}
                >
                  Yearly
                </button>
              </div>
            </div>

            {/* Plan Radio Options */}
            {availablePlans.map((plan, index) => (
              <div key={plan.key}>
                {index > 0 && <div className="border-t border-black/[0.06] dark:border-gray-700" />}
                <button
                  onClick={() => setSelectedPlan(plan.key)}
                  className="w-full flex items-center justify-between p-6 md:px-8 text-left transition-colors hover:bg-black/[0.01] dark:hover:bg-white/[0.02]"
                >
                  <div>
                    <p className="text-[14px] font-medium text-gray-900 dark:text-white">{plan.name}</p>
                    <p className="text-[13px] text-gray-500 mt-0.5 dark:text-gray-400">
                      {billingCycle === 'yearly'
                        ? `$${plan.yearlyPrice.toLocaleString()}/year (save $${plan.yearlySaving})`
                        : `$${plan.monthlyPrice}/month`}
                    </p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    selectedPlan === plan.key ? 'border-blue-600 bg-blue-600' : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {selectedPlan === plan.key && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                </button>
              </div>
            ))}

            {/* Features Section (shown when a plan is selected) */}
            {selectedPlanData && (
              <>
                <div className="border-t border-black/[0.06] dark:border-gray-700" />
                <div className="p-6 md:px-8">
                  <p className="text-[13px] font-semibold text-gray-700 mb-3 dark:text-gray-300">Features include:</p>
                  <ul className="space-y-2.5">
                    {selectedPlanData.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-[13px] text-gray-600 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            <div className="border-t border-black/[0.06] dark:border-gray-700" />

            {/* Bottom Actions */}
            <div className="p-6 md:px-8 flex items-center gap-3">
              <button
                onClick={() => navigate(isUpgradeMode ? '/dashboard' : '/profile')}
                className="flex-1 h-11 text-[14px] font-semibold text-gray-600 hover:text-gray-900 rounded-lg border border-black/[0.08] hover:border-black/[0.15] hover:bg-black/[0.02] transition-all duration-200 active:scale-[0.98] dark:text-gray-300 dark:hover:text-white dark:border-gray-600"
              >
                Cancel
              </button>
              <button
                disabled={!selectedPlan}
                onClick={() => {
                  if (isUpgradeMode && selectedPlan) {
                    navigate(`/upgrade-confirmation?plan=${selectedPlan}&billing=${billingCycle}`);
                  }
                }}
                className={`flex-1 h-11 text-[14px] font-semibold rounded-lg transition-all duration-200 active:scale-[0.98] ${
                  selectedPlan
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-600/50 text-white/70 cursor-not-allowed'
                }`}
              >
                {isUpgradeMode ? 'Upgrade Plan' : 'Change Plan'}
              </button>
            </div>
          </div>
          )}
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

export default ChangePlan;
