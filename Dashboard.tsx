import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useSearchParams, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X, ArrowRight, Paperclip, Loader2, AlertTriangle, CheckCircle2, XCircle, Clock, Sparkles, Rocket, ChevronRight, LogOut, Bell } from 'lucide-react';
import SafePostLogo from './components/SafePostLogo';
import { useAuth } from './useAuth';
import { useComplianceChecker } from './src/hooks/useComplianceChecker';
import { ComplianceResults } from './src/components/ComplianceResults';
import { analyzePost, generateCompliantRewrites } from './services/geminiService';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { userEmail, firstName, signOut } = useAuth();
  
  // Read plan info from URL params or sessionStorage
  const planName = searchParams.get('plan') || sessionStorage.getItem('safepost_plan') || '';
  const billingPeriod = searchParams.get('billing') || sessionStorage.getItem('safepost_billing') || '';

  const checker = useComplianceChecker(planName);

  const hasPaidPlan = planName && !['free', 'starter'].includes(planName.toLowerCase());

  const formatPlanName = (plan: string) => {
    return plan.charAt(0).toUpperCase() + plan.slice(1).toLowerCase();
  };

  const planDisplayNames: Record<string, string> = {
    professional: 'SafePost Professional',
    proplus: 'SafePost Pro+',
    ultra: 'SafePost Ultra',
  };
  const dropdownPlanName = planDisplayNames[planName.toLowerCase()] || 'SafePost Professional';

  // Form state
  const [content, setContent] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [view, setView] = useState<'input' | 'loading' | 'results'>('input');

  // Restore results view if a previous result exists in session
  useEffect(() => {
    if (checker.result && view === 'input') {
      setView('results');
    }
  }, [checker.result]);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'non_compliant':
      case 'non-compliant':
        return <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />;
      case 'compliant':
        return <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />;
      case 'warning':
      case 'requires_review':
        return <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />;
      default:
        return null;
    }
  };

  const handleCheckCompliance = async () => {
    if (!content.trim()) return;
    setView('loading');
    await checker.runCheck(content);
    setView('results');
  };

  const handleNewCheck = () => {
    setContent('');
    setAttachedFile(null);
    setView('input');
    checker.resetChecker();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0]);
    }
  };

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
              <p className="text-[12px] text-gray-400 dark:text-gray-500 truncate">{userEmail}</p>
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

      {/* Dashboard Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
          {/* Cancellation Banner */}
          {sessionStorage.getItem('safepost_cancelled') === 'true' && (
            <div className="mb-6 px-5 py-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between dark:bg-amber-900/20 dark:border-amber-800">
              <p className="text-[13px] text-amber-700 dark:text-amber-300">
                Your subscription ends on {sessionStorage.getItem('safepost_cancel_date') || 'your next billing date'}. Reactivate anytime.
              </p>
              <button
                onClick={() => {
                  sessionStorage.removeItem('safepost_cancelled');
                  sessionStorage.removeItem('safepost_cancel_date');
                  navigate('/dashboard');
                }}
                className="text-[13px] font-medium text-blue-600 hover:text-blue-700 transition-colors flex-shrink-0 ml-4 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Reactivate
              </button>
            </div>
          )}

          {/* Two-column grid: on mobile, sidebar cards appear first via order classes */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-6">

            {/* LEFT COLUMN - Compliance Checker */}
            <div className="space-y-6 order-2 md:order-1">
              {/* Welcome */}
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 mb-2 dark:text-white">
                  {firstName ? `Welcome Back, ${firstName}!` : 'Welcome Back!'}
                </h2>
                <p className="text-[14px] text-gray-500 dark:text-gray-300">
                  Instant AHPRA compliance check for medical practitioners and practices
                </p>
              </div>

              {/* Active Plan Badge */}
              {planName && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-[13px] font-semibold text-blue-700 dark:text-blue-300">
                    SafePost {formatPlanName(planName)}
                  </span>
                  <span className="text-[12px] text-blue-400 dark:text-blue-500">
                    &middot; {billingPeriod ? formatPlanName(billingPeriod) : 'Monthly'}
                  </span>
                </div>
              )}

              {/* Input / Loading / Results views */}
              {view === 'input' && (
                <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm dark:bg-gray-800 dark:border-gray-700 p-6 md:p-8 space-y-4">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Paste your social media or online advertising content here..."
                    className="w-full min-h-[200px] px-4 py-3 text-[14px] text-gray-900 bg-white rounded-xl border border-gray-200 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-y dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  />

                  {/* Attached file indicator */}
                  {attachedFile && (
                    <div className="flex items-center gap-2 text-[13px] text-gray-500 dark:text-gray-400">
                      <Paperclip className="w-3.5 h-3.5" />
                      <span className="truncate">{attachedFile.name}</span>
                      <button onClick={() => setAttachedFile(null)} className="text-gray-400 hover:text-gray-600 ml-1">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Attach image — paid plans only */}
                  {hasPaidPlan && (
                    <>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 text-[13px] text-gray-500 hover:text-gray-700 transition-colors dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        <Paperclip className="w-4 h-4" />
                        Attach Image (optional)
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </>
                  )}

                  {/* Submit */}
                  {checker.usage.isAtLimit ? (
                    <div className="space-y-3">
                      <div className="w-full h-12 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center">
                        <p className="text-[13px] font-medium text-red-600">Monthly check limit reached</p>
                      </div>
                      <button
                        onClick={() => navigate('/change-plan?mode=upgrade')}
                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white text-[15px] font-semibold rounded-lg shadow-sm shadow-blue-600/25 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2.5"
                      >
                        Upgrade Plan
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleCheckCompliance}
                      disabled={!content.trim()}
                      className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-[15px] font-semibold rounded-lg shadow-sm shadow-blue-600/25 transition-all duration-200 active:scale-[0.98] hover:shadow-blue-600/30 flex items-center justify-center gap-2.5"
                    >
                      Check Compliance
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}

              {view === 'loading' && (
                <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm dark:bg-gray-800 dark:border-gray-700 p-12 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                  <p className="text-[14px] text-gray-500 dark:text-gray-300 font-medium">Analysing your content for AHPRA compliance...</p>
                </div>
              )}

              {view === 'results' && checker.result && (
                <ComplianceResults
                  result={checker.result}
                  originalContent={checker.lastContent || content || sessionStorage.getItem('safepost_last_content') || ''}
                  onNewCheck={handleNewCheck}
                  onGenerateRewrites={generateCompliantRewrites}
                />
              )}

            </div>
            {/* END LEFT COLUMN */}

            {/* RIGHT SIDEBAR */}
            <div className="space-y-6 order-1 md:order-2 md:sticky md:top-20 md:self-start md:max-h-[calc(100vh-6rem)] md:overflow-y-auto">
              {/* Usage Stats */}
              <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm dark:bg-gray-800 dark:border-gray-700 p-6">
                <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider dark:text-gray-500 mb-4">Your Usage</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-[14px] text-gray-700 dark:text-gray-300">
                      {checker.usage.checksUsedThisMonth} {checker.usage.checksUsedThisMonth === 1 ? 'check' : 'checks'} used
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className={`w-4 h-4 ${checker.usage.isAtLimit ? 'text-red-400' : 'text-blue-500'}`} />
                    <span className={`text-[14px] dark:text-gray-300 ${checker.usage.isAtLimit ? 'text-red-600 font-medium' : 'text-gray-700'}`}>
                      {checker.usage.planLimit === Infinity
                        ? 'Unlimited remaining'
                        : checker.usage.isAtLimit
                        ? 'Limit reached'
                        : `${checker.usage.checksRemaining} remaining`
                      }
                    </span>
                  </div>
                </div>
                <div className="border-t border-black/[0.06] dark:border-gray-700 mt-4 pt-4">
                  <p className="text-[12px] text-gray-400 dark:text-gray-500">Resets: {checker.usage.resetDate}</p>
                </div>
              </div>

              {/* Upgrade CTA - only show if no paid plan and not on Ultra */}
              {!hasPaidPlan && planName.toLowerCase() !== 'ultra' && (
                <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6 dark:bg-blue-950 dark:border-blue-900">
                  <div className="flex items-center gap-2.5 mb-3">
                    <Rocket className="w-5 h-5 text-blue-600" />
                    <h3 className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider dark:text-blue-400">Upgrade to Pro</h3>
                  </div>
                  <ul className="space-y-2.5 mb-5">
                    <li className="flex items-center gap-2.5 text-[13px] text-gray-700 dark:text-white">
                      <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      Unlimited checks
                    </li>
                    <li className="flex items-center gap-2.5 text-[13px] text-gray-700 dark:text-white">
                      <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      AI-powered rewrites
                    </li>
                    <li className="flex items-center gap-2.5 text-[13px] text-gray-700 dark:text-white">
                      <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      Full history tracking
                    </li>
                    <li className="flex items-center gap-2.5 text-[13px] text-gray-700 dark:text-white">
                      <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      Priority support
                    </li>
                  </ul>
                  <button
                    onClick={() => navigate('/change-plan?mode=upgrade')}
                    className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold rounded-lg shadow-sm shadow-blue-600/25 transition-all duration-200 active:scale-[0.98]"
                  >
                    Upgrade Now
                  </button>
                </div>
              )}

              {/* Recent Checks */}
              <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm dark:bg-gray-800 dark:border-gray-700 p-6">
                <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider dark:text-gray-500 mb-4">Recent Checks</h3>
                <div className="space-y-1">
                  {checker.isLoadingHistory ? (
                    <div className="flex items-center gap-2 px-3 py-2.5 text-gray-400">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span className="text-[13px]">Loading...</span>
                    </div>
                  ) : checker.history.length === 0 ? (
                    <p className="text-[13px] text-gray-400 px-3 py-2">No checks yet — run your first check above.</p>
                  ) : (
                    checker.history.slice(0, 3).map((check) => (
                      <button
                        key={check.id}
                        onClick={() => {
                          sessionStorage.setItem('safepost_last_result', JSON.stringify(check.result_json));
                          sessionStorage.setItem('safepost_last_content', check.content_text);
                          setView('results');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-full flex items-start gap-3 px-0 py-2.5 rounded-lg hover:bg-black/[0.03] transition-colors text-left group"
                      >
                        <span className="mt-1 flex-shrink-0">
                        {getStatusIcon(check.overall_status)}
                      </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] text-gray-700 truncate dark:text-gray-300">
                            {check.content_text?.slice(0, 50)}...
                          </p>
                          <p className="text-[11px] text-gray-400 dark:text-gray-500">
                            {new Date(check.created_at).toLocaleDateString('en-AU', {
                              day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
                      </button>
                    ))
                  )}
                </div>
                <div className="border-t border-black/[0.06] dark:border-gray-700 mt-3 pt-3">
                  <button onClick={() => navigate('/history')} className="flex items-center gap-1 text-[13px] text-blue-600 hover:text-blue-700 font-medium transition-colors">
                    View All
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
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
              Ahpra and the National Boards do not provide pre-approval for advertising.
              Registered health practitioners are ultimately responsible for ensuring their advertising complies with the Health Practitioner Regulation National Law.
            </p>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-4">&copy; SafePost&trade; 2026</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
