import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X, ArrowLeft, CreditCard, LogOut } from 'lucide-react';
import SafePostLogo from './components/SafePostLogo';
import { useAuth } from './useAuth';

const UpdateCard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userEmail, firstName, signOut } = useAuth();

  const planName = sessionStorage.getItem('safepost_plan') || '';
  const planDisplayNames: Record<string, string> = {
    professional: 'SafePost Professional',
    proplus: 'SafePost Pro+',
    ultra: 'SafePost Ultra',
  };
  const dropdownPlanName = planDisplayNames[planName.toLowerCase()] || 'SafePost Professional';

  // Form state
  const [nameOnCard, setNameOnCard] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [setAsDefault, setSetAsDefault] = useState(false);

  // Header state
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
                  <p className="text-[10px] font-medium text-[#2563EB] mt-1">{dropdownPlanName}</p>
                </div>
                <div className="border-t border-black/[0.06] my-1" />
                <button onClick={() => navigate('/profile')} className="block w-full text-left px-4 py-2 text-[13px] text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-colors">
                  Profile
                </button>
                <button onClick={() => navigate('/billing')} className="block w-full text-left px-4 py-2 text-[13px] text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-colors">
                  Billing
                </button>
                <button onClick={() => navigate('/settings')} className="block w-full text-left px-4 py-2 text-[13px] text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-colors">
                  Settings
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
              <p className="text-[10px] font-medium text-[#2563EB] mt-1">{dropdownPlanName}</p>
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
            <button onClick={() => { navigate('/profile'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2.5 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200">
              Profile
            </button>
            <button onClick={() => { navigate('/billing'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2.5 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200">
              Billing
            </button>
            <button onClick={() => { navigate('/settings'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2.5 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200">
              Settings
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

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-2xl mx-auto px-6 pt-6 pb-10 md:pt-8 md:pb-16">
          {/* Back to Billing */}
          <button
            onClick={() => navigate('/billing')}
            className="flex items-center gap-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Billing
          </button>

          {/* Page Heading */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 mb-2">
              Update your Card
            </h1>
            <p className="text-[14px] text-gray-500">
              Your new card will replace your current card
            </p>
          </div>

          {/* Update Card Form */}
          <div className="bg-white rounded-2xl border border-black/[0.06] shadow-lg shadow-black/[0.04]">
            <div className="p-6 md:p-8 space-y-5">
              {/* Name on Card */}
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-2">Name on Card</label>
                <input
                  type="text"
                  value={nameOnCard}
                  onChange={(e) => setNameOnCard(e.target.value)}
                  placeholder="Name on card"
                  className="w-full px-4 py-3 text-[14px] text-gray-900 bg-white rounded-xl border border-gray-200 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Card Number */}
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-2">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
                      const formatted = raw.replace(/(.{4})/g, '$1 ').trim();
                      setCardNumber(formatted);
                    }}
                    placeholder="Card number"
                    inputMode="numeric"
                    className="w-full px-4 py-3 text-[14px] text-gray-900 bg-white rounded-xl border border-gray-200 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 pr-12"
                  />
                  <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Expiry + CVC */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-[13px] font-semibold text-gray-700 mb-2">Expiry Date</label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
                      if (raw.length <= 2) {
                        setExpiry(raw);
                      } else {
                        setExpiry(raw.slice(0, 2) + '/' + raw.slice(2));
                      }
                    }}
                    placeholder="MM/YY"
                    inputMode="numeric"
                    className="w-full px-4 py-3 text-[14px] text-gray-900 bg-white rounded-xl border border-gray-200 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[13px] font-semibold text-gray-700 mb-2">CVC</label>
                  <input
                    type="text"
                    value={cvc}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, '').slice(0, 3);
                      setCvc(raw);
                    }}
                    placeholder="CVC"
                    inputMode="numeric"
                    maxLength={3}
                    className="w-full px-4 py-3 text-[14px] text-gray-900 bg-white rounded-xl border border-gray-200 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* Default payment method checkbox */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={setAsDefault}
                    onChange={(e) => setSetAsDefault(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-[13px] text-gray-600">Set as default payment method</span>
                </label>
              </div>
            </div>

            <div className="border-t border-black/[0.06]" />

            {/* Buttons */}
            <div className="flex items-center gap-3 p-6 md:px-8">
              <button
                onClick={() => navigate('/billing')}
                className="flex-1 h-11 text-[14px] font-semibold text-gray-600 hover:text-gray-900 rounded-lg border border-black/[0.08] hover:border-black/[0.15] hover:bg-black/[0.02] transition-all duration-200 active:scale-[0.98]"
              >
                Cancel
              </button>
              <button className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-semibold rounded-lg transition-all duration-200 active:scale-[0.98]">
                Update Card
              </button>
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
                <li><button onClick={() => navigate('/terms-of-use')} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Terms of Use</button></li>
                <li><button onClick={() => navigate('/privacy-policy')} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Privacy Policy</button></li>
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

export default UpdateCard;
