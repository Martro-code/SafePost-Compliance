import React, { useState, useRef } from 'react';
import { useNavigate, Link, useSearchParams, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X, ArrowRight, Paperclip, Loader2, AlertTriangle, CheckCircle2, XCircle, Clock, Sparkles, Rocket, ChevronRight, LogOut } from 'lucide-react';
import SafePostLogo from './components/SafePostLogo';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Read plan info from URL params or sessionStorage
  const planName = searchParams.get('plan') || sessionStorage.getItem('safepost_plan') || '';
  const billingPeriod = searchParams.get('billing') || sessionStorage.getItem('safepost_billing') || '';

  // Read user info from sessionStorage
  const userEmail = sessionStorage.getItem('safepost_signup_email') || 'your@email.com';
  const firstName = sessionStorage.getItem('safepost_first_name') || '';

  const hasPaidPlan = planName && !['free', 'starter'].includes(planName.toLowerCase());

  const formatPlanName = (plan: string) => {
    return plan.charAt(0).toUpperCase() + plan.slice(1).toLowerCase();
  };

  // Form state
  const [content, setContent] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [view, setView] = useState<'input' | 'loading' | 'results'>('input');

  // Header state
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const recentChecks = [
    { id: 1, status: 'non-compliant', preview: 'My patients give me a 5 star...', time: '2 mins ago' },
    { id: 2, status: 'compliant', preview: 'Join our wellness workshop...', time: '1 hour ago' },
    { id: 3, status: 'warning', preview: 'New treatment now available...', time: 'Yesterday' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'non-compliant':
        return <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />;
      case 'compliant':
        return <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />;
      default:
        return null;
    }
  };

  const handleCheckCompliance = () => {
    if (!content.trim()) return;
    setView('loading');
    setTimeout(() => setView('results'), 2000);
  };

  const handleNewCheck = () => {
    setContent('');
    setAttachedFile(null);
    setView('input');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0]);
    }
  };

  const handleLogOut = () => {
    sessionStorage.clear();
    navigate('/');
  };

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'History', path: '/history' },
    { label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7f4]">
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
                  className={`px-3.5 py-2 text-[13px] font-medium rounded-lg transition-all duration-200 ${
                    location.pathname === link.path
                      ? 'text-gray-900 bg-black/[0.04]'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-black/[0.04]'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Right: My Account dropdown */}
          <div className="hidden md:block relative">
            <button
              onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
              onBlur={() => setTimeout(() => setAccountDropdownOpen(false), 150)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200"
            >
              {firstName || 'My Account'}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${accountDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {accountDropdownOpen && (
              <div className="absolute top-full right-0 mt-1 w-56 bg-white rounded-xl border border-black/[0.06] shadow-lg shadow-black/[0.06] py-1.5 fade-in">
                <div className="px-4 py-2.5">
                  <p className="text-[12px] text-gray-400 truncate">{userEmail}</p>
                </div>
                <div className="border-t border-black/[0.06] my-1" />
                <button className="block w-full text-left px-4 py-2 text-[13px] text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-colors">
                  Profile
                </button>
                <button onClick={() => navigate('/billing')} className="block w-full text-left px-4 py-2 text-[13px] text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-colors">
                  Billing
                </button>
                <button onClick={() => navigate('/pricing/medical-practitioners')} className="block w-full text-left px-4 py-2 text-[13px] text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-colors">
                  Pricing Plans
                </button>
                <div className="border-t border-black/[0.06] my-1" />
                <button
                  onClick={handleLogOut}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-[13px] text-gray-600 hover:text-gray-900 hover:bg-black/[0.04] transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Log Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-all duration-200"
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
          <div className="px-6 pb-5 pt-2 border-t border-black/[0.06] space-y-1">
            <div className="px-3 py-2.5">
              <p className="text-[12px] text-gray-400 truncate">{userEmail}</p>
            </div>
            <div className="border-t border-black/[0.06] my-1" />
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => { navigate(link.path); setMobileMenuOpen(false); }}
                className={`block w-full text-left px-3 py-2.5 text-[13px] font-medium rounded-lg transition-all duration-200 ${
                  location.pathname === link.path
                    ? 'text-gray-900 bg-black/[0.04]'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-black/[0.04]'
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="border-t border-black/[0.06] my-1" />
            <button onClick={() => { setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2.5 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200">
              Profile
            </button>
            <button onClick={() => { navigate('/billing'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2.5 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200">
              Billing
            </button>
            <button onClick={() => { navigate('/pricing/medical-practitioners'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2.5 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200">
              Pricing Plans
            </button>
            <div className="border-t border-black/[0.06] my-1" />
            <button
              onClick={handleLogOut}
              className="flex items-center gap-2 w-full text-left px-3 py-2.5 text-[13px] font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200"
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
          {/* Two-column grid: on mobile, sidebar cards appear first via order classes */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-6">

            {/* LEFT COLUMN - Compliance Checker */}
            <div className="space-y-6 order-2 md:order-1">
              {/* Welcome */}
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 mb-2">
                  {firstName ? `Welcome back, ${firstName}` : 'Welcome back'}
                </h2>
                <p className="text-[14px] text-gray-500">
                  Paste your social media post or advertising content to check AHPRA compliance.
                </p>
              </div>

              {/* Active Plan Badge */}
              {planName && (
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-gray-200 bg-gray-50 text-[12px] font-medium text-gray-600">
                  SafePost {formatPlanName(planName)} &middot; {billingPeriod ? formatPlanName(billingPeriod) : 'Monthly'}
                </div>
              )}

              {/* Usage badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-black/[0.08] bg-white text-[12px] font-medium text-gray-500">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                2 of 3 checks used this month
              </div>

              {/* Input / Loading / Results views */}
              {view === 'input' && (
                <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm p-6 md:p-8 space-y-4">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Paste your social media post content here..."
                    className="w-full min-h-[200px] px-4 py-3 text-[14px] text-gray-900 bg-white rounded-xl border border-gray-200 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-y"
                  />

                  {/* Attached file indicator */}
                  {attachedFile && (
                    <div className="flex items-center gap-2 text-[13px] text-gray-500">
                      <Paperclip className="w-3.5 h-3.5" />
                      <span className="truncate">{attachedFile.name}</span>
                      <button onClick={() => setAttachedFile(null)} className="text-gray-400 hover:text-gray-600 ml-1">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Attach image */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 text-[13px] text-gray-500 hover:text-gray-700 transition-colors"
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

                  {/* Submit */}
                  <button
                    onClick={handleCheckCompliance}
                    disabled={!content.trim()}
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-[15px] font-semibold rounded-lg shadow-sm shadow-blue-600/25 transition-all duration-200 active:scale-[0.98] hover:shadow-blue-600/30 flex items-center justify-center gap-2.5"
                  >
                    Check Compliance
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {view === 'loading' && (
                <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm p-12 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                  <p className="text-[14px] text-gray-500 font-medium">Analysing your content for AHPRA compliance...</p>
                </div>
              )}

              {view === 'results' && (
                <div className="space-y-4">
                  {/* Verdict card */}
                  <div className="bg-red-50 rounded-2xl border border-red-200 p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                        <XCircle className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-red-500 uppercase tracking-wider">Verdict</p>
                        <h3 className="text-lg font-bold text-red-700">Non-Compliant</h3>
                      </div>
                    </div>
                    <p className="text-[14px] text-red-700/80 leading-relaxed mb-5">
                      This content contains testimonial-style claims and uses superlative language that may breach AHPRA advertising guidelines under Section 133 of the National Law.
                    </p>

                    <div className="space-y-3">
                      <h4 className="text-[12px] font-semibold text-red-600 uppercase tracking-wider">Identified Risks</h4>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2.5">
                          <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <p className="text-[13px] text-red-700/80">Use of patient testimonials and star ratings</p>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <p className="text-[13px] text-red-700/80">Superlative claims that could create unreasonable expectations</p>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <p className="text-[13px] text-red-700/80">Missing required disclaimers for advertised services</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-semibold rounded-lg shadow-sm shadow-blue-600/25 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Generate Compliant Rewrites
                    </button>
                    <button
                      onClick={handleNewCheck}
                      className="flex-1 h-12 text-[14px] font-semibold text-gray-600 hover:text-gray-900 rounded-lg border border-black/[0.08] hover:border-black/[0.15] hover:bg-black/[0.02] transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      Back to New Check
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="space-y-6 order-1 md:order-2">
              {/* Usage Stats */}
              <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm p-6">
                <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-4">Your Usage</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-[14px] text-gray-700">2 checks used</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="text-[14px] text-gray-700">1 remaining</span>
                  </div>
                </div>
                <div className="border-t border-black/[0.06] mt-4 pt-4">
                  <p className="text-[12px] text-gray-400">Resets: Mar 1, 2026</p>
                </div>
              </div>

              {/* Upgrade CTA - only show if no paid plan */}
              {!hasPaidPlan && (
                <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
                  <div className="flex items-center gap-2.5 mb-3">
                    <Rocket className="w-5 h-5 text-blue-600" />
                    <h3 className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">Upgrade to Pro</h3>
                  </div>
                  <ul className="space-y-2.5 mb-5">
                    <li className="flex items-center gap-2.5 text-[13px] text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      Unlimited checks
                    </li>
                    <li className="flex items-center gap-2.5 text-[13px] text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      AI-powered rewrites
                    </li>
                    <li className="flex items-center gap-2.5 text-[13px] text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      Full history tracking
                    </li>
                    <li className="flex items-center gap-2.5 text-[13px] text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      Priority support
                    </li>
                  </ul>
                  <button
                    onClick={() => navigate('/pricing/medical-practitioners')}
                    className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold rounded-lg shadow-sm shadow-blue-600/25 transition-all duration-200 active:scale-[0.98]"
                  >
                    Upgrade Now
                  </button>
                </div>
              )}

              {/* Recent Checks */}
              <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm p-6">
                <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-4">Recent Checks</h3>
                <div className="space-y-1">
                  {recentChecks.map((check) => (
                    <button
                      key={check.id}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-black/[0.03] transition-colors text-left group"
                    >
                      {getStatusIcon(check.status)}
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] text-gray-700 truncate">{check.preview}</p>
                        <p className="text-[11px] text-gray-400">{check.time}</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
                    </button>
                  ))}
                </div>
                <div className="border-t border-black/[0.06] mt-3 pt-3">
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
      <footer className="bg-[#f7f7f4] border-t border-black/[0.06] pt-14 pb-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8">
            <div>
              <h4 className="text-[13px] font-semibold text-gray-900 mb-4">Features</h4>
              <ul className="space-y-2.5">
                <li><button onClick={() => navigate('/features')} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Features</button></li>
                <li><button onClick={() => navigate('/pricing/medical-practitioners')} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Pricing</button></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Demo</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[13px] font-semibold text-gray-900 mb-4">Pricing</h4>
              <ul className="space-y-2.5">
                <li><button onClick={() => navigate('/pricing/medical-practitioners')} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Medical Practitioners</button></li>
                <li><button onClick={() => navigate('/pricing/medical-practices')} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Medical Practices</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[13px] font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2.5">
                <li><button onClick={() => navigate('/about')} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">About us</button></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">News</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[13px] font-semibold text-gray-900 mb-4">Resources</h4>
              <ul className="space-y-2.5">
                <li><a href="https://www.ahpra.gov.au/Resources/Advertising-hub.aspx" target="_blank" rel="noopener noreferrer" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Advertising hub</a></li>
                <li><a href="https://www.medicalboard.gov.au/codes-guidelines-policies/code-of-conduct.aspx" target="_blank" rel="noopener noreferrer" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Code of conduct</a></li>
                <li><a href="https://www.tga.gov.au/resources/guidance/advertising-therapeutic-goods-social-media" target="_blank" rel="noopener noreferrer" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">TGA guidelines</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[13px] font-semibold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2.5">
                <li><a href="#" onClick={(e) => e.preventDefault()} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Terms of Service</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Privacy Policy</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Data Use</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Security</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[13px] font-semibold text-gray-900 mb-4">Connect</h4>
              <ul className="space-y-2.5">
                <li><button onClick={() => navigate('/contact')} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Contact us</button></li>
              </ul>
            </div>
          </div>

          <div className="mt-14 pt-6 border-t border-black/[0.06]">
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

export default Dashboard;
