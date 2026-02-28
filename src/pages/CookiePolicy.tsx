import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X, ExternalLink } from 'lucide-react';
import SafePostLogo from '../../components/SafePostLogo';

const CookiePolicy: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  const [pricingDropdownOpen, setPricingDropdownOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);

  const resourceLinks = [
    { label: 'Advertising hub', href: 'https://www.ahpra.gov.au/Resources/Advertising-hub.aspx' },
    { label: 'Code of conduct', href: 'https://www.medicalboard.gov.au/codes-guidelines-policies/code-of-conduct.aspx' },
    { label: 'TGA guidelines', href: 'https://www.tga.gov.au/resources/guidance/advertising-therapeutic-goods-social-media' },
  ];

  const resourcesDropdownRef = useRef<HTMLDivElement>(null);
  const resourcesContextMenuRef = useRef(false);

  // Close Resources dropdown when clicking outside (ignore right-click so users can copy URLs)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (event.button !== 0) return;
      if (resourcesDropdownRef.current && !resourcesDropdownRef.current.contains(event.target as Node)) {
        setResourcesDropdownOpen(false);
      }
      resourcesContextMenuRef.current = false;
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7f4]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-black/[0.06]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/">
            <SafePostLogo />
          </Link>

          <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            <button onClick={() => navigate('/features')} className="px-3.5 py-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200">
              Features
            </button>
            <div className="relative">
              <button
                onClick={() => setPricingDropdownOpen(!pricingDropdownOpen)}
                onBlur={() => setTimeout(() => setPricingDropdownOpen(false), 150)}
                className="flex items-center gap-1 px-3.5 py-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200"
              >
                Pricing
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${pricingDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {pricingDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl border border-black/[0.06] shadow-lg shadow-black/[0.06] py-1.5 fade-in">
                  <button onClick={() => navigate('/pricing/medical-practitioners')} className="block w-full text-left px-4 py-2 text-[13px] text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-colors">
                    Medical Practitioners
                  </button>
                  <button onClick={() => navigate('/pricing/medical-practices')} className="block w-full text-left px-4 py-2 text-[13px] text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-colors">
                    Medical Practices
                  </button>
                </div>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => setCompanyDropdownOpen(!companyDropdownOpen)}
                onBlur={() => setTimeout(() => setCompanyDropdownOpen(false), 150)}
                className="flex items-center gap-1 px-3.5 py-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200"
              >
                Company
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${companyDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {companyDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-40 bg-white rounded-xl border border-black/[0.06] shadow-lg shadow-black/[0.06] py-1.5 fade-in">
                  <button onClick={() => navigate('/about')} className="block w-full text-left px-4 py-2 text-[13px] text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-colors">
                    About us
                  </button>
                  <a href="#" onClick={(e) => e.preventDefault()} className="block px-4 py-2 text-[13px] text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-colors">
                    News
                  </a>
                  <button onClick={() => navigate('/contact')} className="block w-full text-left px-4 py-2 text-[13px] text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-colors">
                    Contact us
                  </button>
                </div>
              )}
            </div>
            <div className="relative" ref={resourcesDropdownRef} onMouseDown={(e) => { if (e.button === 2) resourcesContextMenuRef.current = true; }} onContextMenu={() => { resourcesContextMenuRef.current = true; }} onMouseLeave={() => { if (!resourcesContextMenuRef.current) { setResourcesDropdownOpen(false); } }}>
              <button
                onClick={() => setResourcesDropdownOpen(!resourcesDropdownOpen)}
                className="flex items-center gap-1 px-3.5 py-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200"
              >
                Resources
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${resourcesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {resourcesDropdownOpen && (
                <div className="absolute top-full right-0 mt-1 w-64 bg-white rounded-xl border border-black/[0.06] shadow-lg shadow-black/[0.06] py-1.5 fade-in">
                  {resourceLinks.map((link, i) => (
                    <a
                      key={i}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-4 py-2.5 text-[13px] text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-colors"
                    >
                      {link.label}
                      <ExternalLink className="w-3 h-3 flex-shrink-0 ml-2 opacity-40" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="hidden md:flex items-center gap-2.5">
            <button onClick={() => navigate('/login')} className="px-4 py-2 text-[13px] font-medium text-gray-600 hover:text-gray-900 rounded-lg border border-black/[0.08] hover:border-black/[0.15] hover:bg-black/[0.02] transition-all duration-200">
              Login
            </button>
            <button onClick={() => navigate('/pricing/medical-practitioners')} className="bg-blue-500 hover:bg-blue-600 px-4 py-2 text-[13px] font-medium text-white rounded-lg shadow-sm shadow-blue-500/25 transition-all duration-200">
              Sign Up
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-all duration-200"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-6 pb-5 pt-2 border-t border-black/[0.06] space-y-1">
            <button onClick={() => navigate('/features')} className="block w-full text-left px-3 py-2.5 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200">
              Features
            </button>
            <a href="#" onClick={(e) => e.preventDefault()} className="block px-3 py-2.5 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200">
              Pricing
            </a>
            <a href="#" onClick={(e) => e.preventDefault()} className="block px-3 py-2.5 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200">
              Company
            </a>

            <div>
              <button
                onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200"
              >
                Resources
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${mobileResourcesOpen ? 'rotate-180' : ''}`} />
              </button>
              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                  maxHeight: mobileResourcesOpen ? '300px' : '0px',
                  opacity: mobileResourcesOpen ? 1 : 0,
                }}
              >
                <div className="pl-4 space-y-0.5 pt-1">
                  {resourceLinks.map((link, i) => (
                    <a
                      key={i}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-3 py-2 text-[13px] text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-colors"
                    >
                      {link.label}
                      <ExternalLink className="w-3 h-3 flex-shrink-0 ml-2 opacity-40" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-black/[0.06] flex flex-col gap-2">
              <button onClick={() => navigate('/login')} className="w-full px-4 py-2.5 text-[13px] font-medium text-gray-600 hover:text-gray-900 rounded-lg border border-black/[0.08] hover:border-black/[0.15] hover:bg-black/[0.02] transition-all duration-200">
                Login
              </button>
              <button onClick={() => navigate('/pricing/medical-practitioners')} className="w-full bg-blue-500 hover:bg-blue-600 px-4 py-2.5 text-[13px] font-medium text-white rounded-lg shadow-sm shadow-blue-500/25 transition-all duration-200">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="w-full" style={{ backgroundColor: '#f7f7f4' }}>
        <div className="max-w-6xl mx-auto px-6 pt-10 md:pt-14 pb-16 md:pb-24">
          <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6 md:gap-12">

            {/* Sidebar Navigation */}
            <nav className="flex md:flex-col gap-4 md:gap-2 md:pt-1">
              <button
                onClick={() => navigate('/terms-of-use')}
                className={`text-[13px] font-medium text-left transition-colors duration-200 ${
                  location.pathname === '/terms-of-use' ? 'text-[#2563EB]' : 'text-gray-400 hover:text-gray-900'
                }`}
              >
                Terms of Use
              </button>
              <button
                onClick={() => navigate('/privacy-policy')}
                className={`text-[13px] font-medium text-left transition-colors duration-200 ${
                  location.pathname === '/privacy-policy' ? 'text-[#2563EB]' : 'text-gray-400 hover:text-gray-900'
                }`}
              >
                Privacy Policy
              </button>
              <button
                onClick={() => navigate('/cookie-policy')}
                className={`text-[13px] font-medium text-left transition-colors duration-200 ${
                  location.pathname === '/cookie-policy' ? 'text-[#2563EB]' : 'text-gray-400 hover:text-gray-900'
                }`}
              >
                Cookie Policy
              </button>
            </nav>

            {/* Document Content */}
            <div className="max-w-[800px] space-y-8">

            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 mb-2">
                Cookie Policy
              </h1>
              <p className="text-[14px] text-gray-500">
                Last updated 23 February 2026
              </p>
            </div>

            {/* Introduction */}
            <div>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                {`SafePost\u2122 uses cookies and similar tracking technologies to operate our platform, improve your experience, and understand how our platform is used. This Cookie Policy explains what cookies are, what cookies we use, and how you can manage them. This Cookie Policy should be read together with our Privacy Policy, which provides further information about how we handle your personal information.`}
              </p>
            </div>

            {/* 1. What are cookies? */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">1. What are cookies?</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                Cookies are small text files that are stored on your device when you visit a website or use a web application. They are widely used to make websites and applications work efficiently and to provide information to the site operator.
              </p>
            </div>

            {/* 2. What cookies does SafePost use? */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">{`2. What cookies does SafePost\u2122 use?`}</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                We use the following categories of cookies:
              </p>

              <h3 className="text-[15px] font-semibold text-gray-800 mb-2">Essential cookies</h3>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-6">
                {`These cookies are necessary for the SafePost\u2122 platform to function. They enable core features such as authentication, session management, and security. You cannot opt out of essential cookies as the platform cannot function without them. Examples include cookies used by Supabase to manage your login session and keep you authenticated while you use the platform.`}
              </p>

              <h3 className="text-[15px] font-semibold text-gray-800 mb-2">Preference cookies</h3>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-6">
                These cookies remember your settings and preferences to improve your experience. For example, we use localStorage to remember whether you have accepted or declined our cookie consent banner, and to store your notification preferences and session data during your visit.
              </p>

              <h3 className="text-[15px] font-semibold text-gray-800 mb-2">Analytics cookies</h3>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                {`We may use analytics tools to understand how users interact with SafePost\u2122 \u2014 for example, which pages are visited most frequently and how users navigate through the platform. This information is collected in aggregate and de-identified form and is used solely to improve the platform. We do not currently use third-party advertising or tracking cookies.`}
              </p>
            </div>

            {/* 3. Third-party cookies */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">3. Third-party cookies</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                We use a small number of third-party services that may set their own cookies:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 mb-4">
                <li className="text-[14px] text-gray-500 leading-relaxed">{`Supabase \u2014 our authentication and database provider, which uses cookies to manage secure login sessions.`}</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">{`Stripe \u2014 our payment processor, which may set cookies when you interact with payment-related features of the platform.`}</li>
              </ul>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                We do not use cookies from advertising networks, social media platforms, or data brokers.
              </p>
            </div>

            {/* 4. How long do cookies last? */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">4. How long do cookies last?</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                Session cookies are temporary and are deleted when you close your browser. Persistent cookies remain on your device for a set period or until you delete them. The cookies we use are primarily session-based or tied to your authentication session.
              </p>
            </div>

            {/* 5. How to manage cookies */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">5. How to manage cookies</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                You can manage or disable cookies through your browser settings. Most browsers allow you to:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 mb-4">
                <li className="text-[14px] text-gray-500 leading-relaxed">View what cookies are stored and delete them individually</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Block cookies from specific websites</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Block all third-party cookies</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Block all cookies</li>
              </ul>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                {`Please note that disabling essential cookies will affect the functionality of the SafePost\u2122 platform \u2014 you may not be able to log in or use the compliance checker if essential cookies are blocked. For guidance on managing cookies in your specific browser, visit your browser\u2019s help documentation.`}
              </p>
            </div>

            {/* 6. Your consent */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">6. Your consent</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                {`When you first visit SafePost\u2122, you will be shown a cookie consent banner. By clicking Accept All, you consent to our use of all cookies described in this policy. By clicking Decline, only essential cookies required for the platform to function will be used. You can update your cookie preferences at any time by clearing your browser cookies and revisiting the platform, which will re-display the consent banner.`}
              </p>
            </div>

            {/* 7. Changes to this Cookie Policy */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">7. Changes to this Cookie Policy</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                {`We may update this Cookie Policy from time to time to reflect changes to our practices or for legal or operational reasons. When we make material changes, we will update the date at the top of this policy. Your continued use of SafePost\u2122 after any changes constitutes your acceptance of the updated policy.`}
              </p>
            </div>

            {/* 8. Contact us */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">8. Contact us</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                If you have any questions about this Cookie Policy, please contact us:
              </p>
              <div className="text-[14px] text-gray-500 leading-relaxed">
                <p className="font-medium text-gray-700">{`SafePost\u2122`}</p>
                <p>Email: <a href="mailto:privacy@safepost.com.au" className="text-blue-600 hover:text-blue-700 underline underline-offset-2">privacy@safepost.com.au</a></p>
                <p>Website: <a href="https://www.safepost.com.au" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline underline-offset-2">www.safepost.com.au</a></p>
              </div>
            </div>

          </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#f7f7f4] border-t border-black/[0.06] pt-14 pb-10">
        <div className="max-w-6xl mx-auto px-6">
          {/* Brand Zone */}
          <div className="flex flex-col items-start mb-10 pb-10 border-b border-black/[0.06]">
            <div className="text-[22px] font-extrabold tracking-tight leading-none mb-3">
              <span className="text-gray-900">Safe</span>
              <span className="text-[#2563EB]">Post</span>
              <span className="text-gray-400 text-[15px] font-medium ml-0.5">™</span>
            </div>
            <p className="text-[13px] text-gray-500 leading-relaxed max-w-[360px]">
              Checks your online advertising and social media content against AHPRA's rules — before you publish, not after.
            </p>
          </div>

          {/* Footer Columns */}
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
                <li><button onClick={() => navigate('/cookie-policy')} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Cookie Policy</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[13px] font-semibold text-gray-900 mb-4">Connect</h4>
              <ul className="space-y-2.5">
                <li><button onClick={() => navigate('/contact')} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Contact us</button></li>
              </ul>
              <div className="flex items-center gap-4 mt-4">
                {/* X / Twitter */}
                <div className="text-gray-400 cursor-not-allowed" title="Coming soon">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-label="X / Twitter">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </div>
                {/* Instagram */}
                <div className="text-gray-400 cursor-not-allowed" title="Coming soon">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-label="Instagram">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                  </svg>
                </div>
                {/* LinkedIn */}
                <div className="text-gray-400 cursor-not-allowed" title="Coming soon">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-label="LinkedIn">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
                {/* Facebook */}
                <div className="text-gray-400 cursor-not-allowed" title="Coming soon">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-label="Facebook">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-14 pt-6 border-t border-black/[0.06]">
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

export default CookiePolicy;
