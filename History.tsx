import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X, LogOut, Clock } from 'lucide-react';
import SafePostLogo from './components/SafePostLogo';

const History: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Read user info from sessionStorage
  const userEmail = sessionStorage.getItem('safepost_signup_email') || 'your@email.com';
  const firstName = sessionStorage.getItem('safepost_first_name') || '';

  // Header state
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-20">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 mb-2">
              Compliance History
            </h1>
            <p className="text-[14px] text-gray-500">
              A record of all your past compliance checks
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm p-12 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-[14px] text-gray-500">
              Your compliance check history will appear here
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default History;
