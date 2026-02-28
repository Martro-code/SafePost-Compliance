import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X, ArrowLeft, LogOut, Eye, EyeOff, Bell } from 'lucide-react';
import SafePostLogo from './components/SafePostLogo';
import { useAuth } from './useAuth';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userEmail, firstName, surname, mobileNumber, practiceName, streetAddress, suburb, userState, postcode, signOut } = useAuth();

  const planName = sessionStorage.getItem('safepost_plan') || '';
  const billingPeriod = sessionStorage.getItem('safepost_billing') || '';

  const planDisplayNames: Record<string, string> = {
    professional: 'SafePost Professional',
    proplus: 'SafePost Pro+',
    ultra: 'SafePost Ultra',
  };
  const displayPlanName = planDisplayNames[planName.toLowerCase()] || 'SafePost Free';
  const dropdownPlanName = planDisplayNames[planName.toLowerCase()] || 'SafePost Professional';

  // Password visibility toggle
  const [showPassword, setShowPassword] = useState(false);

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

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'History', path: '/history' },
    { label: 'Settings', path: '/settings' },
  ];

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
              Profile
            </h1>
            <p className="text-[14px] text-gray-500 dark:text-gray-300">
              Manage your personal information
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-black/[0.06] shadow-lg shadow-black/[0.04] dark:bg-gray-800 dark:border-gray-700">
            {/* Section 1: Personal Details */}
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider dark:text-gray-500">Personal Details</h3>
                <button onClick={() => navigate('/update-personal-details')} className="text-[13px] font-medium text-blue-600 hover:text-blue-700 transition-colors dark:text-blue-400 dark:hover:text-blue-300">
                  Edit
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-gray-500 dark:text-gray-400">First Name</span>
                  <span className="text-[14px] font-medium text-gray-900 dark:text-white">{firstName || '—'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-gray-500 dark:text-gray-400">Last Name</span>
                  <span className="text-[14px] font-medium text-gray-900 dark:text-white">{surname || '—'}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-black/[0.06] dark:border-gray-700" />

            {/* Section: Account Details */}
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider dark:text-gray-500">Account Details</h3>
                <button onClick={() => navigate('/change-plan')} className="text-[13px] font-medium text-blue-600 hover:text-blue-700 transition-colors dark:text-blue-400 dark:hover:text-blue-300">
                  Change Plan
                </button>
              </div>
              <div>
                <p className="text-[14px] font-medium text-gray-900 dark:text-white">{displayPlanName}</p>
                <p className="text-[12px] text-gray-400 mt-0.5">{billingPeriod ? billingPeriod.charAt(0).toUpperCase() + billingPeriod.slice(1).toLowerCase() : 'Monthly'} billing</p>
              </div>
              <div className="mt-5">
                <button
                  onClick={() => navigate('/cancel-subscription')}
                  className="text-[12px] text-gray-400 hover:text-red-500 transition-colors duration-200"
                >
                  Cancel Subscription
                </button>
              </div>
            </div>

            <div className="border-t border-black/[0.06] dark:border-gray-700" />

            {/* Section 2: Contact Details */}
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider dark:text-gray-500">Contact Details</h3>
                <button onClick={() => navigate('/update-contact-details')} className="text-[13px] font-medium text-blue-600 hover:text-blue-700 transition-colors dark:text-blue-400 dark:hover:text-blue-300">
                  Edit
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-gray-500 dark:text-gray-400">Email</span>
                  <span className="text-[14px] font-medium text-gray-900 dark:text-white">{userEmail}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-gray-500 dark:text-gray-400">Mobile Number</span>
                  <span className={`text-[14px] ${mobileNumber ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-400'}`}>{mobileNumber || 'Not provided'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-gray-500 dark:text-gray-400">Practice Name</span>
                  <span className={`text-[14px] ${practiceName ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-400'}`}>{practiceName || 'Not provided'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-gray-500 dark:text-gray-400">Street Address</span>
                  <span className={`text-[14px] ${streetAddress ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-400'}`}>{streetAddress || 'Not provided'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-gray-500 dark:text-gray-400">Suburb</span>
                  <span className={`text-[14px] ${suburb ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-400'}`}>{suburb || 'Not provided'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-gray-500 dark:text-gray-400">State</span>
                  <span className={`text-[14px] ${userState ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-400'}`}>{userState || 'Not provided'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-gray-500 dark:text-gray-400">Postcode</span>
                  <span className={`text-[14px] ${postcode ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-400'}`}>{postcode || 'Not provided'}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-black/[0.06] dark:border-gray-700" />

            {/* Section 3: Password */}
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider dark:text-gray-500">Password</h3>
                <button onClick={() => navigate('/update-password')} className="text-[13px] font-medium text-blue-600 hover:text-blue-700 transition-colors dark:text-blue-400 dark:hover:text-blue-300">
                  Edit
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-medium text-gray-900 dark:text-white">
                  {showPassword ? (sessionStorage.getItem('safepost_password') || '••••••••••••') : '••••••••••••'}
                </span>
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>
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

export default Profile;
